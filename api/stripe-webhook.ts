import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { Resend } from "resend";

// ── Inlined helpers (no subdirectory imports) ──

const DEFAULT_FROM = 'Ayush Paul <lab@thepaulx.in>';
let _resend: Resend | null = null;

function initResend(): string | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return "RESEND_API_KEY not configured";
  try {
    console.log("[RESEND INIT] starting");
    _resend = new Resend(apiKey);
    console.log("[RESEND INIT] success");
    return null;
  } catch (e: any) {
    return `Resend init failed: ${e.message}`;
  }
}

async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  const initErr = initResend();
  if (initErr) return { success: false, error: initErr };
  try {
    const response = await _resend.emails.send({ from: DEFAULT_FROM, to, subject, html });
    console.log(`[stripe-webhook] Sent "${subject}" to ${to}:`, JSON.stringify(response));
    return { success: true };
  } catch (err: any) {
    console.error(`[stripe-webhook] Failed "${subject}" to ${to}:`, err.message);
    if (err.response) console.error("[stripe-webhook] Resend body:", JSON.stringify(err.response.data || err.response.body));
    return { success: false, error: err.message };
  }
}

function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A;"><tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" style="max-width:560px;background-color:#111111;border-radius:12px;border:1px solid #333333;">
<tr><td style="padding:28px 24px;background-color:#1a1a1a;border-top-left-radius:12px;border-top-right-radius:12px;border-bottom:1px solid #333333;text-align:center;">
<h1 style="margin:0;font-size:20px;font-weight:700;color:#d1f34d;letter-spacing:1px;text-transform:uppercase;">AyushPaul.in</h1>
<p style="margin:4px 0 0;font-size:11px;color:#666666;letter-spacing:2px;text-transform:uppercase;">Innovation Lab</p>
</td></tr>
<tr><td style="padding:32px 24px;">${content}</td></tr>
<tr><td style="padding:20px 24px;border-top:1px solid #222222;text-align:center;">
<p style="margin:0 0 8px;font-size:12px;color:#555555;">
<a href="https://thepaulx.in/vault" style="color:#00C2FF;text-decoration:none;">My Vault</a>
&nbsp;·&nbsp;<a href="https://thepaulx.in/blueprints" style="color:#00C2FF;text-decoration:none;">Blueprints</a>
&nbsp;·&nbsp;<a href="https://thepaulx.in/mastery" style="color:#00C2FF;text-decoration:none;">Mastery</a>
</p>
<p style="margin:0;font-size:11px;color:#444444;">Ayush Paul — Systems Builder &amp; Architect</p>
</td></tr></table></td></tr></table></body></html>`;
}

function emailButton(text: string, url: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;"><tr><td align="center">
<a href="${url}" style="display:inline-block;padding:14px 32px;background-color:#d1f34d;color:#000000;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;letter-spacing:0.5px;">${text}</a>
</td></tr></table>`;
}

function renderPurchaseConfirmation(props: { customerName: string; productName: string; amount: string; vaultUrl: string; downloadUrl?: string }): string {
  return emailLayout(`
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.customerName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">Your payment of <strong style="color:#ffffff;">${props.amount}</strong> was successful.</p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;"><strong style="color:#d1f34d;">${props.productName}</strong> is now permanently unlocked in your Vault.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;"><tr><td style="text-align:center;">
    <p style="margin:0 0 4px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">What you unlocked</p>
    <p style="margin:0;font-size:18px;font-weight:700;color:#d1f34d;">${props.productName}</p>
    </td></tr></table>
    ${emailButton('Open Your Vault', props.vaultUrl)}
    ${props.downloadUrl ? emailButton('Download Now', props.downloadUrl) : ''}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`);
}

// ── Firestore helper (lazy init, no module-level crash) ──

function getDb() {
  if (!admin.apps.length) {
    try {
      const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!sa) throw new Error("FIREBASE_SERVICE_ACCOUNT env var not set");
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(sa)) });
      console.log("[stripe-webhook] Firebase admin initialized");
    } catch (error: any) {
      console.error("[stripe-webhook] Firebase init error:", error.message);
    }
  }
  if (!admin.apps.length) throw new Error("Firebase app not available");
  return getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a");
}

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
      // 0. Idempotency Check: use session ID as doc key for strong consistency
      const purchaseRef = getDb().collection("purchases").doc(session.id);
      const purchaseSnap = await purchaseRef.get();
      if (purchaseSnap.exists) {
        console.log(`[Idempotency] Webhook already processed for session: ${session.id}. Skipping.`);
        return res.status(200).json({ received: true, status: "already_processed" });
      }

      // 1. Grant product access — use field-path update to deep-merge ownedProducts map
      const userRef = getDb().collection("users").doc(userId);
      const existingSnap = await userRef.get();
      const currentOwned = existingSnap.exists ? (existingSnap.data()?.ownedProducts || {}) : {};
      currentOwned[productId] = "premium";
      await userRef.set({
        ownedProducts: currentOwned,
        purchasedProducts: admin.firestore.FieldValue.arrayUnion(productId),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      // 2. Record the purchase — use session ID as doc key for idempotency
      const originalPrice = Number(session.metadata?.originalPrice) || (session.amount_subtotal || 0) / 100 || (session.amount_total || 0) / 100;
      await purchaseRef.set({
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

      // 2a. Track coupon usage if applied — atomic transaction for strong consistency
      const couponCode = session.metadata?.couponCode;
      console.log(`[Coupon] Processing coupon: ${couponCode || 'none'}`);
      if (couponCode) {
        try {
          const couponQuery = await getDb().collection('coupons').where('code', '==', couponCode).limit(1).get();
          if (!couponQuery.empty) {
            const couponDocRef = couponQuery.docs[0].ref;
            await getDb().runTransaction(async (transaction) => {
              const snap = await transaction.get(couponDocRef);
              if (!snap.exists) return;
              const data = snap.data()!;
              if (data.lastUsedSessionId === session.id) {
                console.log(`[Coupon] Dedup: session ${session.id} already counted, skipping`);
                return;
              }
              const before = data.usedCount || 0;
              transaction.update(couponDocRef, {
                usedCount: before + 1,
                lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
                lastUsedBy: userId,
                lastUsedProduct: productId,
                lastUsedSessionId: session.id,
              });
              console.log(`[Coupon] Incremented ${couponCode}: ${before} → ${before + 1}`);
            });
          } else {
            console.warn(`[Coupon] Coupon code "${couponCode}" not found in Firestore`);
          }
        } catch (e) {
          console.error('[Coupon] Increment failed:', e);
        }
      }

      // 2b. Resolve creator code: from metadata, or fall back to coupon's assignedToCreator
      let creatorCode = session.metadata?.creatorCode;
      let normalizedCreatorCode = creatorCode?.trim().toUpperCase();

      // Fallback: if no creatorCode in metadata but coupon exists, look up coupon's assignedToCreator
      if (!normalizedCreatorCode && couponCode) {
        try {
          const couponQuery = await getDb().collection('coupons').where('code', '==', couponCode).limit(1).get();
          if (!couponQuery.empty) {
            const couponData = couponQuery.docs[0].data();
            if (couponData.assignedToCreator) {
              normalizedCreatorCode = couponData.assignedToCreator.trim().toUpperCase();
              console.log(`[Creator] Detected creator "${normalizedCreatorCode}" from coupon "${couponCode}".assignedToCreator`);
            }
          }
        } catch (e) {
          console.error('[Creator] Failed to look up coupon for creator fallback:', e);
        }
      }
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

          // Look up creator — exact match first, then prefix fallback (e.g. "AYUSH" → "AYUSH10")
          let creatorQuery = await getDb().collection('creator_codes').where('code', '==', normalizedCreatorCode).limit(1).get();
          if (creatorQuery.empty) {
            console.warn(`[Creator] Exact code "${normalizedCreatorCode}" not found, trying prefix fallback`);
            creatorQuery = await getDb().collection('creator_codes')
              .where('code', '>=', normalizedCreatorCode)
              .where('code', '<', normalizedCreatorCode + '\uf8ff')
              .limit(1)
              .get();
            if (!creatorQuery.empty) {
              const matchedCode = creatorQuery.docs[0].data().code;
              console.log(`[Creator] Prefix fallback matched "${matchedCode}" for "${normalizedCreatorCode}"`);
            }
          }

          if (!creatorQuery.empty) {
            const creatorDoc = creatorQuery.docs[0];
            const creatorData = creatorDoc.data()!;

            // Re-read commission from actual creator doc (metadata may have stale default)
            const actualCommissionPercent = creatorData.creatorCommissionPercent || creatorData.commissionRate || 10;
            const actualCommission = +(originalPrice * actualCommissionPercent / 100).toFixed(2);

            // Block commission for inactive creators
            if (creatorData.isActive === false) {
              console.warn(`[Creator] Webhook: Creator "${normalizedCreatorCode}" is inactive — skipping commission`);
            } else {
              // Log the sale
              const effectiveCreatorCode = creatorData.code || normalizedCreatorCode;
              await getDb().collection('creator_sales_log').add({
                creatorCode: effectiveCreatorCode,
                creatorName: creatorData.creatorName || 'Creator',
                orderId: session.id,
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

              // Unique customer check: only increment totalCustomers if this userId is new for this creator
              const existingCustomerQuery = await getDb().collection('creator_sales_log')
                .where('creatorCode', '==', effectiveCreatorCode)
                .where('userId', '==', userId)
                .limit(1)
                .get();
              const isNewCustomer = existingCustomerQuery.empty;

              console.log('[CREATOR UPDATE DEBUG]', {
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

              console.log(`[Creator] Commission logged: ${effectiveCreatorCode} earned ₹${actualCommission} (${actualCommissionPercent}% of ₹${originalPrice}) on ${productId}, newCustomer=${isNewCustomer}`);
            }
          } else {
            console.warn(`[Creator] Code "${normalizedCreatorCode}" not found in creator_codes (exact or prefix)`);
            // Debug: log all existing creator codes
            const allCreators = await getDb().collection('creator_codes').limit(10).get();
            console.log(`[Creator] Existing codes:`, allCreators.docs.map(d => ({ id: d.id, code: d.data().code })));
          }
        } catch (creatorError) {
          console.error('[Creator] Failed to process creator commission:', creatorError);
        }
      }

      // 2c. Record the public proof for the SocialProofTicker (safe, non-sensitive)
      await getDb().collection("public_purchases").add({
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

        const productSnap = await getDb().collection("products").doc(productId).get();
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

          await sendEmail(customerEmail, `You unlocked ${productData.title} — access it in your Vault`, html);
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
