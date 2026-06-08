import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { sendEmail, emailLayout, emailButton } from './lib/email';
import { renderEnrollmentWelcome } from './emails/EnrollmentWelcome';

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

async function handleScheduleEmail(req: VercelRequest, res: VercelResponse) {
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
      type, userId,
      userEmail: userEmail || '', userName: userName || '',
      sendAt: admin.firestore.Timestamp.fromDate(new Date(sendAt)),
      status: 'pending', metadata: metadata || {},
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      success: true, id: docRef.id,
      message: `Email scheduled successfully for ${sendAt}`,
    });
  } catch (err: any) {
    console.error('[Schedule Email] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

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
      ${emailButton('View Creator Dashboard', 'https://ayushpaul.in/admin')}
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

async function handleProcessScheduledEmails(req: VercelRequest, res: VercelResponse) {
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

    return res.status(200).json({ success: true, processed: processedCount, sent: sentCount, failed: failCount });
  } catch (err: any) {
    console.error('[Process Emails] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

async function handleProcessEmailTriggers(req: VercelRequest, res: VercelResponse) {
  const { trigger, userId, metadata } = req.body;

  if (!trigger || !userId) {
    return res.status(400).json({ error: 'Missing trigger or userId' });
  }

  try {
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
        subject = `Creator Promo Report — ${creatorName}`;
        html = emailLayout(`
          <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Admin Team,</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
            <strong style="color:#d1f34d;">${creatorName}</strong> completed a promo cycle.
          </p>
          <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:24px;color:#cccccc;">
            <li>Code: ${metadata?.creatorCode || 'N/A'}</li>
            <li>Sales: ${metadata?.salesCount || 0}</li>
            <li>Commission Earned: ₹${metadata?.totalCommission || 0}</li>
          </ul>
          ${emailButton('View Creator Dashboard', 'https://ayushpaul.in/admin')}
          <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— AyushPaul.in System</p>
        `);
        break;
      }
      default:
        return res.status(400).json({ error: `Unknown trigger: ${trigger}` });
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

async function handleTriggerAbandonedCheck(req: VercelRequest, res: VercelResponse) {
  const INACTIVE_DAYS = 7;

  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - INACTIVE_DAYS);
    const cutoffTimestamp = admin.firestore.Timestamp.fromDate(cutoff);

    const staleEnrollments = await db.collection('enrollments')
      .where('updatedAt', '<', cutoffTimestamp)
      .where('completed', '==', false)
      .limit(10)
      .get();

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

      const result = await sendEmail({ to: email, subject: `Continue where you left off — ${courseData.title || 'your course'}`, html });
      if (result.success) sent++;
    }

    return res.status(200).json({
      success: true, checked: staleEnrollments.size, sent,
      note: 'PLACEHOLDER — Schedule this via Vercel Cron for production.',
    });
  } catch (err: any) {
    console.error('[Abandoned Check] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

async function handleTriggerEnrollmentEmail(req: VercelRequest, res: VercelResponse) {
  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ error: 'Missing required parameters: userId, courseId' });
  }

  try {
    const [userSnap, courseSnap] = await Promise.all([
      db.collection('users').doc(userId).get(),
      db.collection('courses').doc(courseId).get(),
    ]);

    if (!userSnap.exists || !courseSnap.exists) {
      return res.status(404).json({ error: 'User or course not found' });
    }

    const userData = userSnap.data()!;
    const courseData = courseSnap.data()!;
    const email = userData.email;
    const userName = userData.displayName || email?.split('@')[0] || 'Innovator';

    if (!email) {
      return res.status(400).json({ error: 'User has no email address' });
    }

    const modSnap = await db.collection('modules').where('courseId', '==', courseId).get();
    const lesSnap = await db.collection('lessons').where('courseId', '==', courseId).get();

    const html = renderEnrollmentWelcome({
      userName,
      courseName: courseData.title || 'Course',
      courseUrl: `https://ayushpaul.in/mastery/courses/${courseId}`,
      modulesCount: modSnap.size,
      lessonsCount: lesSnap.size || courseData.lessonsCount || 10,
      isFree: courseData.isFree || courseData.price === 0,
    });

    const result = await sendEmail({ to: email, subject: `Welcome to ${courseData.title || 'Your Course'} — Start Learning`, html });

    if (result.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: result.error || 'Failed to send email' });
    }
  } catch (err: any) {
    console.error('[Enrollment Email] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

const HANDLERS: Record<string, (req: VercelRequest, res: VercelResponse) => Promise<any>> = {
  "schedule-email": handleScheduleEmail,
  "process-scheduled-emails": handleProcessScheduledEmails,
  "process-email-triggers": handleProcessEmailTriggers,
  "trigger-abandoned-check": handleTriggerAbandonedCheck,
  "trigger-enrollment-email": handleTriggerEnrollmentEmail,
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
