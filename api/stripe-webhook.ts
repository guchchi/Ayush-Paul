import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { Resend } from "resend";
import { PurchaseReceiptEmail } from "./emails/PurchaseReceipt";
import React from 'react';

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

      // 2b. Record the public proof for the SocialProofTicker (safe, non-sensitive)
      await db.collection("public_purchases").add({
        productId,
        currency: session.currency,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 3. Send automated delivery email via Resend
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        try {
          const resend = new Resend(resendApiKey);
          
          // Get user details
          const userSnap = await userRef.get();
          const userData = userSnap.data();
          const customerEmail = session.customer_details?.email || userData?.email;
          const customerName = session.customer_details?.name || userData?.displayName || 'Innovator';
          
          // Get product details
          const productSnap = await db.collection("products").doc(productId).get();
          const productData = productSnap.data();
          
          if (customerEmail && productData) {
            const formattedAmount = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: session.currency || 'inr',
            }).format((session.amount_total || 0) / 100);

            await resend.emails.send({
              from: 'Ayush Paul <lab@ayushpaul.in>', // Note: Must verify domain in Resend
              to: customerEmail,
              subject: `Unlocked: ${productData.title} 🚀`,
              react: React.createElement(PurchaseReceiptEmail, {
                customerName: customerName,
                productName: productData.title,
                amount: formattedAmount,
                labUrl: `${process.env.APP_URL || 'https://ayushpaul.vercel.app'}/vault`
              })
            });
            console.log(`📧 Receipt email sent to ${customerEmail}`);
          }
        } catch (emailError) {
          // Log but don't fail the webhook if email fails
          console.error("Failed to send receipt email:", emailError);
        }
      } else {
        console.warn("⚠️ RESEND_API_KEY missing, skipping email delivery.");
      }

      console.log(`✅ Granted product ${productId} to user ${userId}`);
    } catch (dbError: any) {
      console.error(`[Webhook] Database error while processing session ${session.id}:`, dbError);
      return res.status(500).send(`Database error: ${dbError.message}`);
    }
  }

  res.status(200).json({ received: true });
}
