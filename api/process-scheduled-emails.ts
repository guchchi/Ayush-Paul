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

const EMAIL_TEMPLATES: Record<string, (data: any) => { subject: string; html: string }> = {
  abandoned: (data) => ({
    subject: `Come back to ${data.courseTitle || 'your course'} — it's waiting`,
    html: emailLayout(`
      <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${data.userName || 'Innovator'},</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
        You started <strong style="color:#d1f34d;">${data.courseTitle || 'a course'}</strong> but haven't been back.
      </p>
      <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">
        Your progress is saved. One session is all it takes to move forward.
      </p>
      ${emailButton('Resume Learning', `https://ayushpaul.in/mastery/courses/${data.courseId || ''}`)}
      <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>
    `),
  }),
  streak_broken: (data) => ({
    subject: 'Your streak was broken — but it\'s not over',
    html: emailLayout(`
      <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${data.userName || 'Innovator'},</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
        Your <strong style="color:#d1f34d;">${data.streakDays || 'learning'}</strong>-day streak was broken yesterday.
      </p>
      <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">
        The best time to start a new streak is today. Every day counts.
      </p>
      ${emailButton('Start a New Streak', 'https://ayushpaul.in/vault')}
      <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>
    `),
  }),
  upsell: (data) => ({
    subject: `Unlock ${data.productTitle || 'Premium'} — exclusive for you`,
    html: emailLayout(`
      <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${data.userName || 'Innovator'},</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
        Based on your interest, here's something that might help you level up.
      </p>
      <p style="margin:0 0 8px;font-size:16px;line-height:26px;color:#cccccc;">
        <strong style="color:#d1f34d;">${data.productTitle || 'Premium Blueprint'}</strong>
      </p>
      <p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#aaaaaa;">${data.productDescription || ''}</p>
      ${emailButton('View Blueprint', `https://ayushpaul.in/blueprints/${data.productId || ''}`)}
      <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>
    `),
  }),
  purchase_followup: (data) => ({
    subject: `You now own ${data.productTitle || 'a Blueprint'} — here's your next step`,
    html: emailLayout(`
      <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${data.userName || 'Innovator'},</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
        Thank you for purchasing <strong style="color:#d1f34d;">${data.productTitle || 'your Blueprint'}</strong>.
      </p>
      <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">
        It's now available in your Vault. Go explore it and start building.
      </p>
      ${emailButton('Open in Vault', 'https://ayushpaul.in/vault')}
      <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>
    `),
  }),
  creator_promo: (data) => ({
    subject: `${data.creatorName || 'A creator'} promoted — see how it performed`,
    html: emailLayout(`
      <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Team,</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
        <strong style="color:#d1f34d;">${data.creatorName || 'A creator'}</strong> just completed a promo cycle.
      </p>
      <p style="margin:0 0 8px;font-size:16px;line-height:26px;color:#cccccc;">Summary:</p>
      <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:24px;color:#cccccc;">
        <li>Code: ${data.creatorCode || 'N/A'}</li>
        <li>Sales: ${data.salesCount || 0}</li>
        <li>Commission Earned: ₹${data.totalCommission || 0}</li>
      </ul>
      <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— AyushPaul.in System</p>
    `),
  }),
};

const DEFAULT_TEMPLATE: (data: any) => { subject: string; html: string } = (data) => ({
  subject: `Update from AyushPaul.in`,
  html: emailLayout(`
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${data.userName || 'there'},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">Here's an update you requested.</p>
    ${emailButton('Visit Dashboard', 'https://ayushpaul.in/vault')}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>
  `),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const now = admin.firestore.Timestamp.now();
    const batch = db.batch();
    let processedCount = 0;
    let sentCount = 0;
    let failCount = 0;

    const pendingSnap = await db.collection('scheduled_emails')
      .where('status', '==', 'pending')
      .where('sendAt', '<=', now)
      .limit(50)
      .get();

    console.log(`[Process Emails] Found ${pendingSnap.size} pending emails to process.`);

    for (const doc of pendingSnap.docs) {
      const data = doc.data();
      const email = data.userEmail;

      if (!email) {
        batch.update(doc.ref, { status: 'failed', error: 'No user email', sentAt: now });
        failCount++;
        processedCount++;
        continue;
      }

      const template = EMAIL_TEMPLATES[data.type] || DEFAULT_TEMPLATE;
      const merged = { ...data.metadata, userName: data.userName, userEmail: data.userEmail };
      const { subject, html } = template(merged);

      const result = await sendEmail({ to: email, subject, html });

      if (result.success) {
        batch.update(doc.ref, { status: 'sent', sentAt: now });
        sentCount++;
      } else {
        batch.update(doc.ref, { status: 'failed', error: result.error || 'Send failed', sentAt: now });
        failCount++;
      }

      processedCount++;
    }

    if (processedCount > 0) {
      await batch.commit();
    }

    return res.status(200).json({
      success: true,
      processed: processedCount,
      sent: sentCount,
      failed: failCount,
    });
  } catch (err: any) {
    console.error('[Process Emails] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
