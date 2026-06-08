import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { renderPurchaseConfirmation } from "./emails/PurchaseConfirmation";
import { sendEmail } from "./lib/email";

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')),
    });
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
  }
}

const db = getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a");

// Disable Vercel's default body parser so we can read the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to buffer the raw request
async function buffer(readable: NodeJS.ReadableStream) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    console.error("Stripe keys missing");
    return res.status(500).send("Server configuration error");
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2025-03-31.basil",
  });

  const sig = req.headers["stripe-signature"];
  
  if (!sig) {
    return res.status(400).send("No signature provided");
  }

  let event: Stripe.Event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig as string, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const productId = session.metadata?.productId;
    const userId = session.metadata?.userId;

    if (!productId || !userId) {
      console.error("Missing metadata in session:", session.id);
      return res.status(400).send("Missing metadata");
    }

    try {
      // 0. Idempotency Check: Verify if this session has already been processed
      const purchaseQuery = await db.collection("purchases").where("stripeSessionId", "==", session.id).get();
      if (!purchaseQuery.empty) {
        console.log(`[Idempotency] Webhook already processed for session: ${session.id}. Skipping.`);
        return res.status(200).json({ received: true, status: "already_processed" });
      }

      // 1. Grant product access by updating ownedProducts map
      const userRef = db.collection("users").doc(userId);
      await userRef.set({
        ownedProducts: {
          [productId]: "premium"
        },
        purchasedProducts: admin.firestore.FieldValue.arrayUnion(productId) // Legacy support
      }, { merge: true });

      // 2. Record the purchase in a 'purchases' collection for analytics
      await db.collection("purchases").add({
        userId,
        productId,
        stripeSessionId: session.id,
        amountTotal: session.amount_total,
        currency: session.currency,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "completed"
      });

      // 2a. Track coupon usage if applied
      const couponCode = session.metadata?.couponCode;
      if (couponCode) {
        const couponQuery = await db.collection('coupons').where('code', '==', couponCode).limit(1).get();
        if (!couponQuery.empty) {
          await db.collection('coupons').doc(couponQuery.docs[0].id).update({
            usedCount: admin.firestore.FieldValue.increment(1),
            lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
            lastUsedBy: userId,
            lastUsedProduct: productId,
          }).catch(() => {
            console.warn(`[Coupon] Could not increment usage for ${couponCode}`);
          });
        }
      }

      // 2b. Process creator code commission if present
      const creatorCode = session.metadata?.creatorCode;
      if (creatorCode) {
        try {
          const creatorDoc = await db.collection('creator_codes').doc(creatorCode).get();
          if (creatorDoc.exists) {
            const creatorData = creatorDoc.data()!;
            const commissionRate = creatorData.commissionRate || 10;
            const amountPaid = (session.amount_total || 0) / 100;
            const amountSubtotal = (session.amount_subtotal || 0) / 100;
            const discountApplied = Math.max(0, amountSubtotal - amountPaid);
            const commission = +(amountPaid * commissionRate / 100).toFixed(2);

            // Log the sale
            await db.collection('creator_sales_log').add({
              creatorCode,
              creatorName: creatorData.creatorName || 'Creator',
              orderId: session.id,
              productId,
              productTitle: session.metadata?.productTitle || '',
              userId,
              productPrice: amountPaid,
              discountApplied,
              commission,
              commissionRate,
              currency: session.currency || 'inr',
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });

            // Update creator stats
            await creatorDoc.ref.update({
              totalSales: admin.firestore.FieldValue.increment(1),
              totalEarnings: admin.firestore.FieldValue.increment(commission),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log(`[Creator] Commission logged: ${creatorCode} earned ₹${commission} on ${productId}`);
          } else {
            console.warn(`[Creator] Code "${creatorCode}" not found in creator_codes`);
          }
        } catch (creatorError) {
          console.error('[Creator] Failed to process creator commission:', creatorError);
        }
      }

      // 2c. Record the public proof for the SocialProofTicker (safe, non-sensitive)
      await db.collection("public_purchases").add({
        productId,
        currency: session.currency,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 3. Send automated delivery email via shared email utility
      try {
        const userSnap = await userRef.get();
        const userData = userSnap.data();
        const customerEmail = session.customer_details?.email || userData?.email;
        const customerName = session.customer_details?.name || userData?.displayName || 'Innovator';

        const productSnap = await db.collection("products").doc(productId).get();
        const productData = productSnap.data();

        if (customerEmail && productData) {
          const formattedAmount = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: session.currency || 'inr',
          }).format((session.amount_total || 0) / 100);

          const html = renderPurchaseConfirmation({
            customerName,
            productName: productData.title,
            amount: formattedAmount,
            vaultUrl: `${process.env.APP_URL || 'https://ayushpaul.vercel.app'}/vault`,
          });

          await sendEmail({
            to: customerEmail,
            subject: `Unlocked: ${productData.title}`,
            html,
          });
        }
      } catch (emailError) {
        console.error("Failed to send receipt email:", emailError);
      }

      console.log(`✅ Granted product ${productId} to user ${userId}`);
    } catch (dbError: any) {
      console.error(`[Webhook] Database error while processing session ${session.id}:`, dbError);
      return res.status(500).send(`Database error: ${dbError.message}`);
    }
  }

  res.status(200).json({ received: true });
}
