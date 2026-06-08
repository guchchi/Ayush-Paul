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

  const { productId, userId, amount, isDonation, couponCode, creatorCode } = req.body;

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

  // Determine the base URL for redirects (Success/Cancel)
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host || "localhost:5173";
  const appUrl = process.env.APP_URL || `${protocol}://${host}`;

  try {
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
      const ownedProducts = userData?.ownedProducts || {};
      
      if (ownedProducts[productId] === "premium") {
        return res.status(400).json({ error: "You already own the Premium tier for this product." });
      }
    }

    // 2. Validate coupon if provided
    let appliedCoupon: { code: string; discountType: string; value: number } | null = null;

    if (couponCode) {
      const normalized = couponCode.trim().toUpperCase();
      const couponSnap = await db.collection('coupons').doc(normalized).get();

      if (couponSnap.exists) {
        const c = couponSnap.data()!;

        if (c.active) {
          const expired = c.expiresAt?.toDate?.() ? new Date() > c.expiresAt.toDate() : false;
          const exhausted = c.usageLimit && (c.usedCount || 0) >= c.usageLimit;

          if (!expired && !exhausted) {
            appliedCoupon = { code: normalized, discountType: c.discountType, value: c.value };
          }
        }
      }

      // If coupon was provided but invalid, still proceed (just don't apply it)
    }

    // 3. Calculate discounted amount
    const price = await stripe.prices.retrieve(product.stripePriceId);
    const mode = price.type === 'recurring' ? 'subscription' : 'payment';
    const unitAmount = price.unit_amount || 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let discounts: any[] = [];
    let finalMetadata: Record<string, string> = { productId, userId, productTitle: product.title || '' };

    if (creatorCode) {
      finalMetadata.creatorCode = creatorCode.trim().toUpperCase();
    }

    if (appliedCoupon) {
      const couponParams: Stripe.CouponCreateParams = {
        name: appliedCoupon.code,
        duration: 'once',
      };

      if (appliedCoupon.discountType === 'percentage') {
        couponParams.percent_off = appliedCoupon.value;
      } else {
        couponParams.amount_off = appliedCoupon.value * 100;
        couponParams.currency = 'inr';
      }

      const stripeCoupon = await stripe.coupons.create(couponParams);
      discounts = [{ coupon: stripeCoupon.id }];
      finalMetadata.couponCode = appliedCoupon.code;
    }

    // 4. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "upi"],
      line_items: [
        {
          price: product.stripePriceId,
          quantity: 1,
        },
      ],
      mode,
      discounts,
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&product_id=${productId}`,
      cancel_url: `${appUrl}/blueprints/${product.slug}?payment=cancelled`,
      metadata: finalMetadata,
      customer_email: req.body.email || undefined,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Session Error:", error.message);
    return res.status(500).json({ error: error.message || "Failed to create payment session" });
  }
}
