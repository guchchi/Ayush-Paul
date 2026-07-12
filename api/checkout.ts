import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

let _db: FirebaseFirestore.Firestore | null = null;

function getDb() {
  if (_db) return _db;
  if (!admin.apps.length) {
    try {
      const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!sa) throw new Error("FIREBASE_SERVICE_ACCOUNT env var not set");
      const parsed = JSON.parse(sa);
      admin.initializeApp({ credential: admin.credential.cert(parsed) });
      console.log("[checkout] Firebase admin initialized, project:", parsed.project_id);
    } catch (error: any) {
      console.error("[checkout] Firebase init error:", error.message);
    }
  }
  if (!admin.apps.length) throw new Error("Firebase app not available");
  const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a";
  console.log("[checkout] Connecting to Firestore database:", dbId);
  _db = getFirestore(admin.app(), dbId);
  return _db;
}

async function verifyIdToken(req: VercelRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    getDb();
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    return null;
  }
}

async function handleCreateCheckoutSession(req: VercelRequest, res: VercelResponse) {
  const { productId, userId, amount, tierName, couponCode, creatorCode } = req.body;

  // Handle donation tier purchase (legacy support)
  if (amount && tierName) {
    const validTiers = [99, 299, 999];
    if (!validTiers.includes(amount)) {
      return res.status(400).json({ error: "Invalid support tier" });
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
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "upi"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `Support Ayush Paul - ${tierName}`,
                description: "Thank you for supporting my work and projects!",
                images: ["https://ayushpaul.in/og-image.png"],
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}/success`,
        cancel_url: `${appUrl}/cancel`,
      });

      return res.status(200).json({ url: session.url });
    } catch (err: any) {
      console.error("Stripe Session Error:", err);
      return res.status(500).json({ error: err.message || "Failed to create checkout session" });
    }
  }

  console.log(`[Checkout] Creating session: productId=${productId}, userId=${userId}, couponCode=${couponCode || 'none'}, creatorCode=${creatorCode || 'none'}`);

  if (!productId || !userId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // Token Validation
  const decodedUid = await verifyIdToken(req);
  if (!decodedUid) {
    return res.status(401).json({ error: "Unauthorized: Invalid or missing token" });
  }
  if (decodedUid !== userId) {
    return res.status(403).json({ error: "Forbidden: User ID mismatch" });
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
    const productDoc = await getDb().collection("products").doc(productId).get();
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

    const userDoc = await getDb().collection("users").doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const ownedProducts = userData?.ownedProducts || {};
      if (ownedProducts[productId] === "premium") {
        return res.status(400).json({ error: "You already own the Premium tier for this product." });
      }
    }

    let appliedCoupon: { code: string; discountType: string; value: number; assignedToCreator?: string } | null = null;
    let couponSnap: any = null;

    if (couponCode) {
      const normalized = couponCode.trim().toUpperCase();
      const couponQuery = await getDb().collection('coupons').where('code', '==', normalized).limit(1).get();
      couponSnap = couponQuery.empty ? null : couponQuery.docs[0];

      if (!couponSnap) {
        return res.status(400).json({ error: `Coupon "${couponCode}" not found.` });
      }

      const c = couponSnap.data();

      if (!c.active) {
        return res.status(400).json({ error: `Coupon "${normalized}" is no longer active.` });
      }

      const expired = c.expiresAt?.toDate?.() ? new Date() > c.expiresAt.toDate() : false;
      if (expired) {
        return res.status(400).json({ error: `Coupon "${normalized}" has expired.` });
      }

      const exhausted = c.usageLimit && (c.usedCount || 0) >= c.usageLimit;
      if (exhausted) {
        return res.status(400).json({ error: `Coupon "${normalized}" has reached its usage limit.` });
      }

      appliedCoupon = { code: normalized, discountType: c.discountType, value: c.value, assignedToCreator: c.assignedToCreator || undefined };
    }

    // Auto-detect creator code from coupon if not explicitly provided
    let resolvedCreatorCode = creatorCode || null;
    if (appliedCoupon?.assignedToCreator && !resolvedCreatorCode) {
      resolvedCreatorCode = appliedCoupon.assignedToCreator;
      console.log(`[Coupon] Auto-detected creator code "${resolvedCreatorCode}" from coupon "${appliedCoupon.code}"`);
    }

    const stripePrice = await stripe.prices.retrieve(product.stripePriceId);
    const mode = stripePrice.type === 'recurring' ? 'subscription' : 'payment';
    const effectivePrice = Number(product.salePrice) || Number(product.basePrice) || (stripePrice.unit_amount ? stripePrice.unit_amount / 100 : 0);

    // Enforce minPurchaseAmount during checkout creation
    if (couponSnap) {
      const c = couponSnap.data();
      const minAmount = c.minPurchaseAmount || 0;
      if (minAmount > 0 && effectivePrice < minAmount) {
        console.warn(`[Coupon] Rejected: product ₹${effectivePrice} below minPurchaseAmount ₹${minAmount} for coupon ${appliedCoupon?.code}`);
        return res.status(400).json({
          error: `This coupon requires a minimum purchase of ₹${minAmount}. The product price is ₹${effectivePrice}.`,
          details: { minPurchaseAmount: minAmount, productPrice: effectivePrice },
        });
      }
    }

    let discounts: any[] = [];
    let finalMetadata: Record<string, string> = { productId, userId, productTitle: product.title || '' };

    // Store original price for commission calculation (before any discount)
    finalMetadata.originalPrice = String(effectivePrice);

    // Look up creator and store commission percent in metadata
    if (resolvedCreatorCode) {
      const normalizedCreator = resolvedCreatorCode.trim().toUpperCase();
      finalMetadata.creatorCode = normalizedCreator;
      try {
        let creatorQuery = await getDb().collection('creator_codes').where('code', '==', normalizedCreator).limit(1).get();
        if (creatorQuery.empty) {
          console.warn(`[Creator] Exact code "${normalizedCreator}" not found, trying prefix fallback`);
          creatorQuery = await getDb().collection('creator_codes')
            .where('code', '>=', normalizedCreator)
            .where('code', '<', normalizedCreator + '\uf8ff')
            .limit(1)
            .get();
          if (!creatorQuery.empty) {
            const matchedCode = creatorQuery.docs[0].data().code;
            console.log(`[Creator] Prefix fallback matched "${matchedCode}" for "${normalizedCreator}"`);
            finalMetadata.creatorCode = matchedCode;
          }
        }
        if (!creatorQuery.empty) {
          const creatorData = creatorQuery.docs[0].data();
          const commissionPct = creatorData.creatorCommissionPercent || creatorData.commissionRate || 10;
          finalMetadata.commissionPercent = String(commissionPct);
          finalMetadata.creatorId = creatorData.userId || '';
          console.log(`[Creator] Found creator "${finalMetadata.creatorCode}", commission=${commissionPct}%`);
        } else {
          console.warn(`[Creator] Code "${normalizedCreator}" not found in creator_codes (exact or prefix), using default 10%`);
          finalMetadata.commissionPercent = '10';
        }
      } catch (creatorErr) {
        console.error('[Creator] Lookup failed:', creatorErr);
        finalMetadata.commissionPercent = '10';
      }
    }

    if (appliedCoupon) {
      const couponParams: Stripe.CouponCreateParams = {
        name: appliedCoupon.code,
        duration: 'once',
      };
      if (appliedCoupon.discountType === 'percentage') {
        couponParams.percent_off = appliedCoupon.value;
      } else {
        const fixedAmount = Math.min(appliedCoupon.value, effectivePrice);
        couponParams.amount_off = fixedAmount * 100;
        couponParams.currency = 'inr';
      }
      const stripeCoupon = await stripe.coupons.create(couponParams);
      discounts = [{ coupon: stripeCoupon.id }];
      finalMetadata.couponCode = appliedCoupon.code;
      console.log(`[Coupon] Applied ${appliedCoupon.code} to session metadata`);
    }

    // Validate minimum payable amount after discounts
    const MIN_AMOUNT_PAISE = 5000; // ₹50 (Stripe minimum for INR)
    const effectivePricePaise = effectivePrice * 100;
    let finalAmountPaise = effectivePricePaise;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        finalAmountPaise = effectivePricePaise * (1 - appliedCoupon.value / 100);
      } else {
        const fixedDiscountPaise = Math.min(appliedCoupon.value * 100, effectivePricePaise);
        finalAmountPaise = effectivePricePaise - fixedDiscountPaise;
      }
      finalAmountPaise = Math.max(0, Math.round(finalAmountPaise));
    }
    console.log(
      `[Pricing] original=₹${Number(product.basePrice) || '?'}, sale=₹${Number(product.salePrice) || '?'}` +
      `, coupon=${appliedCoupon ? `${appliedCoupon.value}${appliedCoupon.discountType === 'percentage' ? '%' : ' fixed'}` : 'none'}` +
      `, final=₹${(finalAmountPaise / 100).toFixed(2)}`
    );
    if (finalAmountPaise < MIN_AMOUNT_PAISE) {
      console.warn(`[Pricing] Rejected: ₹${(finalAmountPaise / 100).toFixed(2)} below minimum ₹${(MIN_AMOUNT_PAISE / 100).toFixed(2)}`);
      return res.status(400).json({
        error: "Final payable amount must be at least ₹50.",
        details: {
          originalPrice: Number(product.basePrice) || 0,
          salePrice: Number(product.salePrice) || 0,
          couponDiscount: appliedCoupon ? `${appliedCoupon.value}${appliedCoupon.discountType === 'percentage' ? '%' : ' fixed'}` : null,
          finalAmount: finalAmountPaise / 100,
        },
      });
    }

    console.log(`[Checkout] Final metadata:`, JSON.stringify(finalMetadata));
    console.log(`[Checkout] Discounts:`, discounts.length > 0 ? `${appliedCoupon?.code} (${appliedCoupon?.value}${appliedCoupon?.discountType === 'percentage' ? '%' : ' fixed'})` : 'none');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "upi"],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.title || 'Product',
            images: product.thumbnail ? [product.thumbnail] : undefined,
          },
          unit_amount: effectivePrice * 100,
        },
        quantity: 1,
      }],
      mode,
      discounts: discounts.length > 0 ? discounts : undefined,
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

  // Token Validation
  const decodedUid = await verifyIdToken(req);
  if (!decodedUid) {
    return res.status(401).json({ error: "Unauthorized: Invalid or missing token" });
  }
  if (decodedUid !== userId) {
    return res.status(403).json({ error: "Forbidden: User ID mismatch" });
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

    const userRef = getDb().collection("users").doc(userId);
    const existingSnap = await userRef.get();
    const currentOwned = existingSnap.exists ? (existingSnap.data()?.ownedProducts || {}) : {};
    currentOwned[productId] = "premium";
    await userRef.set({
      ownedProducts: currentOwned,
      purchasedProducts: admin.firestore.FieldValue.arrayUnion(productId),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // Use sessionId as doc ID for strong consistency (eventual-consistency queries miss recent writes)
    const purchaseRef = getDb().collection("purchases").doc(sessionId);
    const purchaseSnap = await purchaseRef.get();
    if (!purchaseSnap.exists) {
      const originalPrice = Number(session.metadata?.originalPrice) || (session.amount_subtotal || 0) / 100 || (session.amount_total || 0) / 100;
      await purchaseRef.set({
        userId, productId,
        stripeSessionId: sessionId,
        amountTotal: session.amount_total,
        originalPrice: Math.round(originalPrice * 100),
        currency: session.currency,
        createdAt: admin.firestore.FieldValue.serverTimestamp(), status: "completed",
        ...(session.metadata?.creatorCode ? { creatorCode: session.metadata.creatorCode } : {}),
        ...(session.metadata?.couponCode ? { couponCode: session.metadata.couponCode } : {}),
      });

      await getDb().collection("public_purchases").add({
        productId, productTitle: session.metadata?.productTitle || '',
        currency: session.currency,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // ── Track coupon usage (atomic transaction for strong consistency) ──
      const couponCode = session.metadata?.couponCode;
      console.log(`[Verify] Session metadata: couponCode=${couponCode || 'none'}, creatorCode=${session.metadata?.creatorCode || 'none'}, productId=${productId}`);
      if (couponCode) {
        try {
          const couponQuery = await getDb().collection('coupons').where('code', '==', couponCode).limit(1).get();
          if (!couponQuery.empty) {
            const couponDocRef = couponQuery.docs[0].ref;
            await getDb().runTransaction(async (transaction) => {
              const snap = await transaction.get(couponDocRef);
              if (!snap.exists) return;
              const data = snap.data()!;
              if (data.lastUsedSessionId === sessionId) {
                console.log(`[Verify] Coupon dedup: session ${sessionId} already counted, skipping`);
                return;
              }
              const before = data.usedCount || 0;
              transaction.update(couponDocRef, {
                usedCount: before + 1,
                lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
                lastUsedBy: userId,
                lastUsedProduct: productId,
                lastUsedSessionId: sessionId,
              });
              console.log(`[Verify] Coupon incremented ${couponCode}: ${before} → ${before + 1}`);
            });
          }
        } catch (e) {
          console.error('[Verify] Coupon increment failed:', e);
        }
      }

      // ── Track creator commission (idempotent: check existing orderId in sales log) ──
      let creatorCode = session.metadata?.creatorCode;
      let normalizedCreatorCode = creatorCode?.trim().toUpperCase();

      // Fallback: detect creator from coupon if not in metadata
      if (!normalizedCreatorCode && couponCode) {
        try {
          const couponQuery = await getDb().collection('coupons').where('code', '==', couponCode).limit(1).get();
          if (!couponQuery.empty) {
            const couponData = couponQuery.docs[0].data();
            if (couponData.assignedToCreator) {
              normalizedCreatorCode = couponData.assignedToCreator.trim().toUpperCase();
              console.log(`[Verify] Detected creator "${normalizedCreatorCode}" from coupon "${couponCode}".assignedToCreator`);
            }
          }
        } catch (e) {
          console.error('[Verify] Failed to look up coupon for creator fallback:', e);
        }
      }

      if (normalizedCreatorCode) {
        try {
          // Dedup: check if this orderId already logged
          const existingLog = await getDb().collection('creator_sales_log')
            .where('orderId', '==', sessionId)
            .limit(1)
            .get();
          if (!existingLog.empty) {
            console.log(`[Verify] Creator dedup: session ${sessionId} already logged for ${normalizedCreatorCode}, skipping`);
          } else {
            const originalPrice = Number(session.metadata?.originalPrice) || (session.amount_subtotal || 0) / 100 || (session.amount_total || 0) / 100;
            const amountPaid = (session.amount_total || 0) / 100;
            const discountApplied = Math.max(0, originalPrice - amountPaid);
            const commissionPercent = Number(session.metadata?.commissionPercent) || 10;
            const commission = +(originalPrice * commissionPercent / 100).toFixed(2);

            console.log(`[Verify] Creator: original=₹${originalPrice}, paid=₹${amountPaid}, commissionPct=${commissionPercent}%, commission=₹${commission}`);

            // Look up creator — exact match first, then prefix fallback (e.g. "AYUSH" → "AYUSH10")
            let creatorQuery = await getDb().collection('creator_codes').where('code', '==', normalizedCreatorCode).limit(1).get();
            if (creatorQuery.empty) {
              console.warn(`[Verify] Exact code "${normalizedCreatorCode}" not found, trying prefix fallback`);
              creatorQuery = await getDb().collection('creator_codes')
                .where('code', '>=', normalizedCreatorCode)
                .where('code', '<', normalizedCreatorCode + '\uf8ff')
                .limit(1)
                .get();
              if (!creatorQuery.empty) {
                const matchedCode = creatorQuery.docs[0].data().code;
                console.log(`[Verify] Prefix fallback matched "${matchedCode}" for "${normalizedCreatorCode}"`);
              }
            }

            if (!creatorQuery.empty) {
              const creatorDoc = creatorQuery.docs[0];
              const creatorData = creatorDoc.data()!;

              // Re-read commission from actual creator doc (metadata may have stale default)
              const actualCommissionPercent = creatorData.creatorCommissionPercent || creatorData.commissionRate || 10;
              const actualCommission = +(originalPrice * actualCommissionPercent / 100).toFixed(2);

              if (creatorData.isActive === false) {
                console.warn(`[Verify] Creator "${normalizedCreatorCode}" is inactive — skipping commission`);
              } else {
                // Write sales log
                await getDb().collection('creator_sales_log').add({
                  creatorCode: normalizedCreatorCode,
                  creatorName: creatorData.creatorName || 'Creator',
                  orderId: sessionId,
                  productId,
                  productTitle: session.metadata?.productTitle || '',
                  userId,
                  originalPrice,
                  paidAmount: amountPaid,
                  discountApplied,
                  commission: actualCommission,
                  commissionPercent: actualCommissionPercent,
                  currency: session.currency || 'inr',
                  timestamp: admin.firestore.FieldValue.serverTimestamp(),
                });

                // Unique customer check
                const existingCustomerQuery = await getDb().collection('creator_sales_log')
                  .where('creatorCode', '==', normalizedCreatorCode)
                  .where('userId', '==', userId)
                  .limit(1)
                  .get();
                const isNewCustomer = existingCustomerQuery.empty;

                const effectiveCreatorCode = creatorData.code || normalizedCreatorCode;
                console.log('[VERIFY CREATOR UPDATE DEBUG]', {
                  creatorCode: effectiveCreatorCode,
                  userId,
                  originalPrice,
                  commission: actualCommission,
                  commissionPct: actualCommissionPercent,
                  isNewCustomer,
                });

                // Update creator stats
                const updatePayload: Record<string, any> = {
                  totalSales: admin.firestore.FieldValue.increment(1),
                  totalRevenue: admin.firestore.FieldValue.increment(originalPrice),
                  totalCommission: admin.firestore.FieldValue.increment(actualCommission),
                  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                };
                if (isNewCustomer) {
                  updatePayload.totalCustomers = admin.firestore.FieldValue.increment(1);
                }

                await getDb().collection('creator_codes').doc(creatorDoc.id).update(updatePayload);

                console.log(`[Verify] Commission logged: ${effectiveCreatorCode} earned ₹${actualCommission} (${actualCommissionPercent}% of ₹${originalPrice}) on ${productId}, newCustomer=${isNewCustomer}`);
              }
            } else {
              console.warn(`[Verify] Code "${normalizedCreatorCode}" not found in creator_codes (exact or prefix)`);
              const allCreators = await getDb().collection('creator_codes').limit(10).get();
              console.log(`[Verify] Existing creator codes:`, allCreators.docs.map(d => ({ id: d.id, code: d.data().code })));
            }
          }
        } catch (creatorError) {
          console.error('[Verify] Failed to process creator commission:', creatorError);
        }
      }
    }

    return res.status(200).json({ success: true, productId });
  } catch (error: any) {
    console.error("Stripe verification error:", error.message);
    return res.status(500).json({ error: error.message || "Failed to verify payment session" });
  }
}

async function handleValidateCoupon(req: VercelRequest, res: VercelResponse) {
  const { code, productPrice } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing coupon code' });
  }

  try {
    const normalized = code.trim().toUpperCase();
    const couponQuery = await getDb().collection('coupons').where('code', '==', normalized).limit(1).get();

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

    const minPurchaseAmount = coupon.minPurchaseAmount || 0;

    // Validate minPurchaseAmount if productPrice is provided
    if (minPurchaseAmount > 0 && typeof productPrice === 'number') {
      if (productPrice < minPurchaseAmount) {
        return res.status(400).json({
          valid: false,
          error: `This coupon requires a minimum purchase of ₹${minPurchaseAmount}. Current product price is ₹${productPrice}.`,
          minPurchaseAmount,
        });
      }
    }

    return res.status(200).json({
      valid: true, code: normalized,
      discountType: coupon.discountType, value: coupon.value,
      description: coupon.description || '',
      minPurchaseAmount,
      assignedToCreator: coupon.assignedToCreator || undefined,
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
    const creatorQuery = await getDb().collection('creator_codes').where('code', '==', normalized).limit(1).get();

    if (creatorQuery.empty) {
      return res.status(200).json({ valid: false, error: "Code not found" });
    }

    const data = creatorQuery.docs[0].data()!;

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
