import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { sessionId, userId } = req.body;

  if (!sessionId || !userId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set");
    return res.status(500).json({ error: "Payment system not configured" });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2024-06-20",
  });

  try {
    // 1. Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 2. Verify payment status is paid
    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Session has not been paid yet" });
    }

    // 3. Verify metadata userId and productId exist
    const metaUserId = session.metadata?.userId;
    const productId = session.metadata?.productId;

    if (!productId) {
      return res.status(400).json({ error: "No product ID found in session metadata" });
    }

    if (metaUserId !== userId) {
      return res.status(403).json({ error: "Unauthorized: User ID mismatch" });
    }

    // 4. Idempotently update user's ownedProducts map in Firestore
    const userRef = db.collection("users").doc(userId);
    await userRef.set({
      ownedProducts: {
        [productId]: "premium"
      },
      purchasedProducts: admin.firestore.FieldValue.arrayUnion(productId)
    }, { merge: true });

    // 5. Idempotently log to purchases collection for analytics
    const purchaseQuery = await db.collection("purchases").where("stripeSessionId", "==", sessionId).get();
    if (purchaseQuery.empty) {
      await db.collection("purchases").add({
        userId,
        productId,
        stripeSessionId: sessionId,
        amountTotal: session.amount_total,
        currency: session.currency,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "completed"
      });
      console.log(`[Verify API] Logged purchase for session: ${sessionId}`);
    }

    console.log(`[Verify API] Successfully verified and granted access to ${productId} for ${userId}`);
    return res.status(200).json({ success: true, productId });
  } catch (error: any) {
    console.error("Stripe verification error:", error.message);
    return res.status(500).json({ error: error.message || "Failed to verify payment session" });
  }
}
