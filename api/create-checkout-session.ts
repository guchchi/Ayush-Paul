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

  const { productId, userId, amount, isDonation } = req.body;

  if (!productId || !userId) {
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

  const appUrl = process.env.APP_URL || "http://localhost:5173"; // Use local default if missing

  try {
    let productData: any = {};
    let priceAmount = 0;

    if (isDonation) {
      productData = {
        title: `Donation: Support Innovation`,
        description: `Your contribution directly fuels open-source robotics research.`,
        currency: "usd", // default donations to USD
      };
      priceAmount = (amount || 1) * 100;
    } else {
      // 1. Fetch Product from Firestore
      const productDoc = await db.collection("products").doc(productId).get();
      if (!productDoc.exists) {
        return res.status(404).json({ error: "Product not found" });
      }

      const product = productDoc.data();
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Guard: Ensure product is configured for premium checkout
      if (product.type === "free") {
        return res.status(400).json({ error: "Invalid product for checkout" });
      }

      if (!product.stripePriceId) {
        return res.status(400).json({ error: "Product not configured for checkout" });
      }

      // 1.5. Prevent Duplicate Purchases
      const userDoc = await db.collection("users").doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData?.purchasedProducts?.includes(productId)) {
          return res.status(400).json({ error: "You already own this product." });
        }
      }

      productData = product;
    }

    // 2. Create Stripe Checkout Session
    const line_items = isDonation 
      ? [
          {
            price_data: {
              currency: productData.currency?.toLowerCase() || "usd",
              product_data: {
                name: productData.title,
                description: productData.description || "Premium Digital Asset",
              },
              unit_amount: priceAmount,
            },
            quantity: 1,
          },
        ]
      : [
          {
            price: productData.stripePriceId,
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "upi"], // Optimized for Indian Users
      line_items,
      mode: "payment",
      success_url: isDonation ? `${appUrl}/lab/dashboard?donation=success` : `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&product_id=${productId}`,
      cancel_url: isDonation ? `${appUrl}/thank-you` : `${appUrl}/products/${productData.slug}?payment=cancelled`,
      metadata: {
        productId,
        userId,
        isDonation: isDonation ? "true" : "false"
      },
      customer_email: req.body.email || undefined,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Session Error:", error.message);
    return res.status(500).json({ error: error.message || "Failed to create payment session" });
  }
}
