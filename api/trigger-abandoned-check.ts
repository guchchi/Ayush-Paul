import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { sendEmail, emailLayout, emailButton } from './lib/email';

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

// PLACEHOLDER: This endpoint is designed to be called by a cron job (e.g., Vercel Cron)
// It queries for users who enrolled but haven't accessed content in N days.

const INACTIVE_DAYS = 7;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - INACTIVE_DAYS);
    const cutoffTimestamp = admin.firestore.Timestamp.fromDate(cutoff);

    // Query enrollments that haven't been updated since cutoff
    const staleEnrollments = await db.collection('enrollments')
      .where('updatedAt', '<', cutoffTimestamp)
      .where('completed', '==', false)
      .limit(10)
      .get();

    console.log(`[Abandoned Check] Found ${staleEnrollments.size} stale enrollments.`);

    let sent = 0;
    for (const doc of staleEnrollments.docs) {
      const data = doc.data();
      const { userId, courseId } = data;

      if (!userId || !courseId) continue;

      const [userSnap, courseSnap] = await Promise.all([
        db.collection('users').doc(userId).get(),
        db.collection('courses').doc(courseId).get(),
      ]);

      if (!userSnap.exists || !courseSnap.exists) continue;

      const userData = userSnap.data()!;
      const courseData = courseSnap.data()!;
      const email = userData.email;

      if (!email) continue;

      const html = emailLayout(`
        <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${userData.displayName || email.split('@')[0] || 'Innovator'},</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
          We noticed you haven't continued <strong style="color:#d1f34d;">${courseData.title || 'your course'}</strong> recently.
        </p>
        <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">
          Your progress is saved and waiting for you. A single session is all it takes to make progress.
        </p>
        ${emailButton('Resume Learning', `https://ayushpaul.in/mastery/courses/${courseId}`)}
        <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">
          — Ayush Paul
        </p>
      `);

      const result = await sendEmail({
        to: email,
        subject: `Continue where you left off — ${courseData.title || 'your course'}`,
        html,
      });

      if (result.success) sent++;
    }

    return res.status(200).json({
      success: true,
      checked: staleEnrollments.size,
      sent,
      note: 'PLACEHOLDER — Schedule this via Vercel Cron for production.',
    });
  } catch (err: any) {
    console.error('[Abandoned Check] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
