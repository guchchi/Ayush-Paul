import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

function getDb(): FirebaseFirestore.Firestore {
  if (!admin.apps.length) {
    const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!sa) throw new Error("FIREBASE_SERVICE_ACCOUNT env var not set");
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(sa)) });
  }
  const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a";
  return getFirestore(admin.app(), dbId);
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");

  const result: Record<string, any> = {};

  try {
    const db = getDb();

    // 1. Dump all creator codes
    const creatorSnap = await db.collection("creator_codes").orderBy("totalCommission", "desc").get();
    result.creatorCodes = creatorSnap.docs.map((d) => ({
      id: d.id,
      code: d.data().code || null,
      creatorName: d.data().creatorName || null,
      isActive: d.data().isActive,
      totalSales: d.data().totalSales || 0,
      totalRevenue: d.data().totalRevenue || 0,
      totalCommission: d.data().totalCommission || 0,
      totalCustomers: d.data().totalCustomers || 0,
      commissionPercent: d.data().creatorCommissionPercent || d.data().commissionRate || null,
      userId: d.data().userId || null,
    }));
    result.creatorCodesCount = creatorSnap.size;

    // 2. Dump all coupons (especially assignedToCreator + usage)
    const couponSnap = await db.collection("coupons").orderBy("createdAt", "desc").get();
    result.coupons = couponSnap.docs.map((d) => ({
      id: d.id,
      code: d.data().code || null,
      assignedToCreator: d.data().assignedToCreator || null,
      usedCount: d.data().usedCount || 0,
      usageLimit: d.data().usageLimit || null,
      active: d.data().active,
      discountType: d.data().discountType || null,
      value: d.data().value || null,
      lastUsedSessionId: d.data().lastUsedSessionId || null,
      lastUsedBy: d.data().lastUsedBy || null,
      lastUsedProduct: d.data().lastUsedProduct || null,
    }));
    result.couponsCount = couponSnap.size;

    // 3. Dump creator sales log (last 50)
    const logSnap = await db.collection("creator_sales_log").orderBy("timestamp", "desc").limit(50).get();
    result.creatorSalesLog = logSnap.docs.map((d) => {
      const ts = d.data().timestamp;
      return {
        id: d.id,
        creatorCode: d.data().creatorCode || null,
        creatorName: d.data().creatorName || null,
        userId: d.data().userId || null,
        orderId: d.data().orderId || null,
        productId: d.data().productId || null,
        productTitle: d.data().productTitle || null,
        originalPrice: d.data().originalPrice || 0,
        paidAmount: d.data().paidAmount || 0,
        commission: d.data().commission || 0,
        commissionPercent: d.data().commissionPercent || 0,
        currency: d.data().currency || null,
        timestamp: ts?.toDate?.()?.toISOString() || ts || null,
      };
    });
    result.creatorSalesLogCount = logSnap.size;

    // 4. Dump purchases (last 50, only relevant fields)
    const purchaseSnap = await db.collection("purchases").orderBy("createdAt", "desc").limit(50).get();
    result.purchases = purchaseSnap.docs.map((d) => {
      const ts = d.data().createdAt;
      return {
        id: d.id,
        userId: d.data().userId || null,
        productId: d.data().productId || null,
        stripeSessionId: d.data().stripeSessionId || null,
        amountTotal: d.data().amountTotal || 0,
        originalPrice: d.data().originalPrice || 0,
        currency: d.data().currency || null,
        status: d.data().status || null,
        creatorCode: d.data().creatorCode || null,
        couponCode: d.data().couponCode || null,
        createdAt: ts?.toDate?.()?.toISOString() || ts || null,
      };
    });
    result.purchasesCount = purchaseSnap.size;

    result.success = true;
  } catch (err: any) {
    result.success = false;
    result.error = err.message;
    result.stack = err.stack;
  }

  return res.json(result);
}
