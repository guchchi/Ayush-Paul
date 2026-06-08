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

interface TriggerPayload {
  trigger: 'streak_broken' | 'purchase_followup' | 'creator_promo';
  userId: string;
  metadata?: Record<string, any>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { trigger, userId, metadata } = req.body as TriggerPayload;

  if (!trigger || !userId) {
    return res.status(400).json({ error: 'Missing trigger or userId' });
  }

  try {
    // Fetch user data
    const userSnap = await db.collection('users').doc(userId).get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userSnap.data()!;
    const email = userData.email;
    const userName = userData.displayName || email?.split('@')[0] || 'Innovator';

    if (!email) {
      return res.status(400).json({ error: 'User has no email' });
    }

    let subject = '';
    let html = '';

    switch (trigger) {
      case 'streak_broken': {
        const streakDays = metadata?.streakDays || 'your';
        subject = 'Your streak was broken — start again today';
        html = emailLayout(`
          <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${userName},</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
            Your <strong style="color:#d1f34d;">${streakDays}</strong>-day streak was broken.
          </p>
          <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">
            Every streak starts with day one. Jump back in today.
          </p>
          ${emailButton('Restart Your Streak', 'https://ayushpaul.in/vault')}
          <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>
        `);
        break;
      }

      case 'purchase_followup': {
        const productTitle = metadata?.productTitle || 'your Blueprint';
        subject = `You now own ${productTitle} — start building`;
        html = emailLayout(`
          <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${userName},</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
            Thank you for purchasing <strong style="color:#d1f34d;">${productTitle}</strong>.
          </p>
          <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">
            It's now in your Vault. Go explore your new Blueprint.
          </p>
          ${emailButton('Open in Vault', 'https://ayushpaul.in/vault')}
          <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>
        `);
        break;
      }

      case 'creator_promo': {
        const creatorName = metadata?.creatorName || 'A creator';
        const salesCount = metadata?.salesCount || 0;
        const totalCommission = metadata?.totalCommission || 0;
        subject = `Creator Promo Report — ${creatorName}`;
        html = emailLayout(`
          <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Admin Team,</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
            <strong style="color:#d1f34d;">${creatorName}</strong> completed a promo cycle.
          </p>
          <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:24px;color:#cccccc;">
            <li>Code: ${metadata?.creatorCode || 'N/A'}</li>
            <li>Sales: ${salesCount}</li>
            <li>Commission Earned: ₹${totalCommission}</li>
          </ul>
          ${emailButton('View Creator Dashboard', 'https://ayushpaul.in/admin')}
          <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— AyushPaul.in System</p>
        `);
        break;
      }
    }

    const result = await sendEmail({ to: email, subject, html });

    if (result.success) {
      return res.status(200).json({ success: true, message: `${trigger} email sent to ${email}` });
    } else {
      return res.status(500).json({ error: result.error || 'Failed to send email' });
    }
  } catch (err: any) {
    console.error(`[Email Trigger ${trigger}] Error:`, err.message);
    return res.status(500).json({ error: err.message });
  }
}
