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

  const { type, userId, userEmail, userName, sendAt, metadata } = req.body;

  if (!type || !userId || !sendAt) {
    return res.status(400).json({ error: 'Missing required fields: type, userId, sendAt' });
  }

  try {
    const validTypes = ['abandoned', 'streak', 'upsell', 'streak_broken', 'purchase_followup', 'creator_promo'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `Invalid email type. Must be one of: ${validTypes.join(', ')}` });
    }

    const docRef = await db.collection('scheduled_emails').add({
      type,
      userId,
      userEmail: userEmail || '',
      userName: userName || '',
      sendAt: admin.firestore.Timestamp.fromDate(new Date(sendAt)),
      status: 'pending',
      metadata: metadata || {},
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`[Schedule Email] Scheduled ${type} email for user ${userId} at ${sendAt}. Doc: ${docRef.id}`);

    return res.status(200).json({
      success: true,
      id: docRef.id,
      message: `Email scheduled successfully for ${sendAt}`,
    });
  } catch (err: any) {
    console.error('[Schedule Email] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
