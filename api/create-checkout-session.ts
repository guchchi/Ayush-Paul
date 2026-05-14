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

  const { productId, userId } = req.body;

  if (!productId || !userId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set");
    return res.status(500).json({ error: "Payment system not configured" });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2025-03-31.basil",
  });

  const appUrl = process.env.APP_URL || "http://localhost:5173"; // Use local default if missing

  try {
    // 1. Fetch Product from Firestore
    const productDoc = await db.collection("products").doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productDoc.data();
    if (!product || product.type === "free") {
      return res.status(400).json({ error: "Invalid product for checkout" });
    }

    // 1.5. Prevent Duplicate Purchases
    const userDoc = await db.collection("users").doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      if (userData?.purchasedProducts?.includes(productId)) {
        return res.status(400).json({ error: "You already own this product." });
      }
    }

    // Determine price (use salePrice if > 0, else basePrice)
    const priceAmount = (product.salePrice > 0 ? product.salePrice : product.basePrice) * 100; // Stripe uses subunits

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Consider adding 'upi' if Indian account
      line_items: [
        {
          price_data: {
            currency: product.currency || "usd", // Dynamic currency support
            product_data: {
              name: product.title,
              description: product.description || "Premium Blueprint",
              images: product.thumbnail ? [product.thumbnail] : [],
            },
            unit_amount: priceAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      metadata: {
        productId,
        userId,
      },
      customer_email: req.body.email || undefined,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Session Error:", error.message);
    return res.status(500).json({ error: error.message || "Failed to create payment session" });
  }
}
