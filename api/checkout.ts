import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

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

async function handleCreateCheckoutSession(req: VercelRequest, res: VercelResponse) {
  const { productId, userId, amount, isDonation, couponCode, creatorCode } = req.body;

  if (!productId || !userId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set");
    return res.status(500).json({ error: "Payment system not configured" });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host || "localhost:5173";
  const appUrl = process.env.APP_URL || `${protocol}://${host}`;

  try {
    const productDoc = await db.collection("products").doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productDoc.data();
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.type === "free" && !product.stripePriceId) {
      return res.status(400).json({ error: "Invalid product for checkout" });
    }

    if (!product.stripePriceId) {
      return res.status(400).json({ error: "Product not configured for checkout" });
    }

    const userDoc = await db.collection("users").doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const ownedProducts = userData?.ownedProducts || {};
      if (ownedProducts[productId] === "premium") {
        return res.status(400).json({ error: "You already own the Premium tier for this product." });
      }
    }

    let appliedCoupon: { code: string; discountType: string; value: number } | null = null;

    if (couponCode) {
      const normalized = couponCode.trim().toUpperCase();
      const couponQuery = await db.collection('coupons').where('code', '==', normalized).limit(1).get();
      const couponSnap = couponQuery.empty ? null : couponQuery.docs[0];

      if (couponSnap) {
        const c = couponSnap.data();
        if (c.active) {
          const expired = c.expiresAt?.toDate?.() ? new Date() > c.expiresAt.toDate() : false;
          const exhausted = c.usageLimit && (c.usedCount || 0) >= c.usageLimit;
          if (!expired && !exhausted) {
            appliedCoupon = { code: normalized, discountType: c.discountType, value: c.value };
          }
        }
      }
    }

    const price = await stripe.prices.retrieve(product.stripePriceId);
    const mode = price.type === 'recurring' ? 'subscription' : 'payment';

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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "upi"],
      line_items: [{ price: product.stripePriceId, quantity: 1 }],
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

async function handleCreateDonationSession(req: VercelRequest, res: VercelResponse) {
  const { amount, userId } = req.body;

  if (!amount) {
    return res.status(400).json({ error: "Missing donation amount" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set");
    return res.status(500).json({ error: "Payment system not configured" });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
  const appUrl = process.env.APP_URL || "http://localhost:5173";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "upi"],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: {
            name: "Donation: Support Open Innovation",
            description: "Thank you for supporting Ayush Paul's engineering research.",
            images: ["https://ayushpaul.in/founder.png"],
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${appUrl}/vault?donation=success`,
      cancel_url: `${appUrl}/thank-you`,
      metadata: { type: "donation", userId: userId || "anonymous" },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Donation Error:", error.message);
    return res.status(500).json({ error: "Failed to create donation session" });
  }
}

async function handleVerifyCheckoutSession(req: VercelRequest, res: VercelResponse) {
  const { sessionId, userId } = req.body;

  if (!sessionId || !userId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set");
    return res.status(500).json({ error: "Payment system not configured" });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Session has not been paid yet" });
    }

    const metaUserId = session.metadata?.userId;
    const productId = session.metadata?.productId;

    if (!productId) {
      return res.status(400).json({ error: "No product ID found in session metadata" });
    }

    if (metaUserId !== userId) {
      return res.status(403).json({ error: "Unauthorized: User ID mismatch" });
    }

    const userRef = db.collection("users").doc(userId);
    await userRef.set({
      ownedProducts: { [productId]: "premium" },
      purchasedProducts: admin.firestore.FieldValue.arrayUnion(productId),
    }, { merge: true });

    const purchaseQuery = await db.collection("purchases").where("stripeSessionId", "==", sessionId).get();
    if (purchaseQuery.empty) {
      await db.collection("purchases").add({
        userId, productId, stripeSessionId: sessionId,
        amountTotal: session.amount_total, currency: session.currency,
        createdAt: admin.firestore.FieldValue.serverTimestamp(), status: "completed",
      });

      await db.collection("public_purchases").add({
        productId, currency: session.currency,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return res.status(200).json({ success: true, productId });
  } catch (error: any) {
    console.error("Stripe verification error:", error.message);
    return res.status(500).json({ error: error.message || "Failed to verify payment session" });
  }
}

async function handleValidateCoupon(req: VercelRequest, res: VercelResponse) {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing coupon code' });
  }

  try {
    const normalized = code.trim().toUpperCase();
    const couponQuery = await db.collection('coupons').where('code', '==', normalized).limit(1).get();

    if (couponQuery.empty) {
      return res.status(404).json({ valid: false, error: 'Coupon not found' });
    }

    const coupon = couponQuery.docs[0].data();

    if (!coupon.active) {
      return res.status(400).json({ valid: false, error: 'Coupon is no longer active' });
    }

    if (coupon.expiresAt?.toDate?.()) {
      const now = new Date();
      const expires = coupon.expiresAt.toDate();
      if (now > expires) {
        return res.status(400).json({ valid: false, error: 'Coupon has expired' });
      }
    }

    if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
      return res.status(400).json({ valid: false, error: 'Coupon usage limit reached' });
    }

    return res.status(200).json({
      valid: true, code: normalized,
      discountType: coupon.discountType, value: coupon.value,
      description: coupon.description || '',
    });
  } catch (err: any) {
    console.error('[Coupon] Validation error:', err.message);
    return res.status(500).json({ error: 'Failed to validate coupon' });
  }
}

async function handleValidateCreatorCode(req: VercelRequest, res: VercelResponse) {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ valid: false, error: "Missing or invalid code" });
  }

  try {
    const normalized = code.trim().toUpperCase();
    const docRef = db.collection('creator_codes').doc(normalized);
    const snap = await docRef.get();

    if (!snap.exists) {
      return res.status(200).json({ valid: false, error: "Code not found" });
    }

    const data = snap.data()!;

    if (!data.isActive) {
      return res.status(200).json({ valid: false, error: "Code is deactivated" });
    }

    return res.status(200).json({
      valid: true, creatorName: data.creatorName,
      commissionRate: data.commissionRate, code: normalized,
    });
  } catch (error: any) {
    console.error("Creator code validation error:", error);
    return res.status(500).json({ valid: false, error: "Validation failed" });
  }
}

const HANDLERS: Record<string, (req: VercelRequest, res: VercelResponse) => Promise<any>> = {
  "create-checkout-session": handleCreateCheckoutSession,
  "create-donation-session": handleCreateDonationSession,
  "verify-checkout-session": handleVerifyCheckoutSession,
  "validate-coupon": handleValidateCoupon,
  "validate-creator-code": handleValidateCreatorCode,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const action = req.body?.action || req.query?.action;
  const handlerFn = HANDLERS[action as string];

  if (!handlerFn) {
    return res.status(400).json({ error: `Unknown action: ${action}` });
  }

  return handlerFn(req, res);
}
