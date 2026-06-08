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

  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing coupon code' });
  }

  try {
    const normalized = code.trim().toUpperCase();
    const snap = await db.collection('coupons').doc(normalized).get();

    if (!snap.exists) {
      return res.status(404).json({ valid: false, error: 'Coupon not found' });
    }

    const coupon = snap.data()!;

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
      valid: true,
      code: normalized,
      discountType: coupon.discountType,
      value: coupon.value,
      description: coupon.description || '',
    });
  } catch (err: any) {
    console.error('[Coupon] Validation error:', err.message);
    return res.status(500).json({ error: 'Failed to validate coupon' });
  }
}
