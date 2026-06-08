import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

const db = getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID || 'ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { referrerId, newUserId, refCode: incomingRefCode } = req.body;

  if (!newUserId) {
    return res.status(400).json({ error: 'Missing newUserId' });
  }

  try {
    let referrerIdFinal = referrerId;
    let refCode = '';

    if (incomingRefCode) {
      // ?ref=CODE lookup: find user by referralCode field
      const usersSnap = await db.collection('users')
        .where('referralCode', '==', incomingRefCode.toUpperCase())
        .limit(1)
        .get();

      if (usersSnap.empty) {
        return res.status(404).json({ error: `Referral code "${incomingRefCode}" not found` });
      }

      const refUser = usersSnap.docs[0];
      referrerIdFinal = refUser.id;
      refCode = refUser.data().referralCode || incomingRefCode.toUpperCase();
    } else if (referrerId) {
      const refSnap = await db.collection('users').doc(referrerId).get();
      if (!refSnap.exists) {
        return res.status(404).json({ error: 'Referrer not found' });
      }
      refCode = refSnap.data()!.referralCode;
    } else {
      return res.status(400).json({ error: 'Missing referrerId or refCode' });
    }

    if (!refCode) {
      return res.status(400).json({ error: 'Referrer has no referral code' });
    }

    // Record referral
    await db.collection('referrals').add({
      referrerId: referrerIdFinal,
      refCode,
      newUserId,
      status: 'converted',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Increment referral count on referrer
    await db.collection('users').doc(referrerIdFinal).update({
      referralCount: admin.firestore.FieldValue.increment(1),
    });

    // Grant a 15% discount coupon to the referrer for next purchase
    const couponCode = `REFERRAL_${refCode}_${Date.now()}`.toUpperCase();
    await db.collection('coupons').doc(couponCode).set({
      code: couponCode,
      discountType: 'percentage',
      value: 15,
      active: true,
      description: `Referral reward for ${refCode}`,
      usageLimit: 1,
      usedCount: 0,
      createdBy: 'system',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)),
    });

    console.log(`[Referral] ${newUserId} referred by ${referrerIdFinal}. Reward coupon ${couponCode} created.`);

    return res.status(200).json({
      success: true,
      rewardCoupon: couponCode,
      message: 'Referral claimed! You earned a 15% discount.',
    });
  } catch (err: any) {
    console.error('[Referral] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
