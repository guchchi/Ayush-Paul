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

      // 1. Grant product access — use field-path update to deep-merge ownedProducts map
      const userRef = db.collection("users").doc(userId);
      const existingSnap = await userRef.get();
      const currentOwned = existingSnap.exists ? (existingSnap.data()?.ownedProducts || {}) : {};
      currentOwned[productId] = "premium";
      await userRef.set({
        ownedProducts: currentOwned,
        purchasedProducts: admin.firestore.FieldValue.arrayUnion(productId),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      // 2. Record the purchase in a 'purchases' collection for analytics
      const originalPrice = Number(session.metadata?.originalPrice) || (session.amount_subtotal || 0) / 100 || (session.amount_total || 0) / 100;
      await db.collection("purchases").add({
        userId,
        productId,
        stripeSessionId: session.id,
        amountTotal: session.amount_total,
        originalPrice: Math.round(originalPrice * 100),
        currency: session.currency,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "completed",
        ...(session.metadata?.creatorCode ? { creatorCode: session.metadata.creatorCode } : {}),
        ...(session.metadata?.couponCode ? { couponCode: session.metadata.couponCode } : {}),
      });

      // 2a. Track coupon usage if applied
      const couponCode = session.metadata?.couponCode;
      console.log(`[Coupon] Processing coupon: ${couponCode || 'none'}`);
      if (couponCode) {
        const couponQuery = await db.collection('coupons').where('code', '==', couponCode).limit(1).get();
        if (!couponQuery.empty) {
          const couponDoc = couponQuery.docs[0];
          const before = couponDoc.data().usedCount || 0;
          await db.collection('coupons').doc(couponDoc.id).update({
            usedCount: admin.firestore.FieldValue.increment(1),
            lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
            lastUsedBy: userId,
            lastUsedProduct: productId,
          }).catch((err: any) => {
            console.warn(`[Coupon] Could not increment usage for ${couponCode}: ${err.message}`);
          });
          console.log(`[Coupon] Incremented ${couponCode}: ${before} → ${before + 1}`);
        } else {
          console.warn(`[Coupon] Coupon code "${couponCode}" not found in Firestore`);
        }
      }

      // 2b. Process creator code commission if present
      const creatorCode = session.metadata?.creatorCode;
      const normalizedCreatorCode = creatorCode?.trim().toUpperCase();
      if (normalizedCreatorCode) {
        try {
          console.log(`[Creator] Processing creator code: "${normalizedCreatorCode}"`);

          // Determine the original product price (before any discount)
          const originalPrice = Number(session.metadata?.originalPrice) || (session.amount_subtotal || 0) / 100 || (session.amount_total || 0) / 100;
          const amountPaid = (session.amount_total || 0) / 100;
          const discountApplied = Math.max(0, originalPrice - amountPaid);
          const commissionPercent = Number(session.metadata?.commissionPercent) || 10;

          // Commission is calculated on ORIGINAL product price (not discounted)
          const commission = +(originalPrice * commissionPercent / 100).toFixed(2);

          console.log(`[Creator] original=₹${originalPrice}, paid=₹${amountPaid}, discount=₹${discountApplied}, commissionPct=${commissionPercent}%, commission=₹${commission}`);

          const creatorQuery = await db.collection('creator_codes').where('code', '==', normalizedCreatorCode).limit(1).get();
          if (!creatorQuery.empty) {
            const creatorDoc = creatorQuery.docs[0];
            const creatorData = creatorDoc.data()!;

            // Block commission for inactive creators
            if (creatorData.isActive === false) {
              console.warn(`[Creator] Webhook: Creator "${normalizedCreatorCode}" is inactive — skipping commission`);
            } else {
              // Log the sale
              await db.collection('creator_sales_log').add({
                creatorCode: normalizedCreatorCode,
                creatorName: creatorData.creatorName || 'Creator',
                orderId: session.id,
                productId,
                productTitle: session.metadata?.productTitle || '',
                userId,
                originalPrice,
                paidAmount: amountPaid,
                discountApplied,
                commission,
                commissionPercent,
                currency: session.currency || 'inr',
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
              });

              // Update creator stats
              await db.collection('creator_codes').doc(creatorDoc.id).update({
                totalSales: admin.firestore.FieldValue.increment(1),
                totalRevenue: admin.firestore.FieldValue.increment(originalPrice),
                totalCommission: admin.firestore.FieldValue.increment(commission),
                totalCustomers: admin.firestore.FieldValue.increment(1),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              });

              console.log(`[Creator] Commission logged: ${normalizedCreatorCode} earned ₹${commission} (${commissionPercent}% of ₹${originalPrice}) on ${productId}`);
            }
          } else {
            console.warn(`[Creator] Code "${normalizedCreatorCode}" not found in creator_codes (queried by code field)`);
            // Debug: log all existing creator codes
            const allCreators = await db.collection('creator_codes').limit(10).get();
            console.log(`[Creator] Existing codes:`, allCreators.docs.map(d => ({ id: d.id, code: d.data().code })));
          }
        } catch (creatorError) {
          console.error('[Creator] Failed to process creator commission:', creatorError);
        }
      }

      // 2c. Record the public proof for the SocialProofTicker (safe, non-sensitive)
      await db.collection("public_purchases").add({
        productId,
        productTitle: session.metadata?.productTitle || '',
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
