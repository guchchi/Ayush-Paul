import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// ============================================================
// EMAIL HELPERS (inlined — no subdirectory imports)
// ============================================================

const DEFAULT_FROM = 'Ayush Paul <lab@ayushpaul.in>';
let resend: any = null;

function initResend(): string | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return "RESEND_API_KEY not configured";
  try {
    const { Resend } = require("resend");
    resend = new Resend(apiKey);
    return null;
  } catch (e: any) {
    return `Resend init failed: ${e.message}`;
  }
}

async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  const initErr = initResend();
  if (initErr) return { success: false, error: initErr };
  try {
    const response = await resend.emails.send({ from: DEFAULT_FROM, to, subject, html });
    console.log(`[email] Sent "${subject}" to ${to}:`, JSON.stringify(response));
    return { success: true };
  } catch (err: any) {
    console.error(`[email] Failed "${subject}" to ${to}:`, err.message);
    if (err.response) console.error("[email] Resend body:", JSON.stringify(err.response.data || err.response.body));
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
<a href="https://ayushpaul.in/vault" style="color:#00C2FF;text-decoration:none;">My Vault</a>
&nbsp;·&nbsp;<a href="https://ayushpaul.in/blueprints" style="color:#00C2FF;text-decoration:none;">Blueprints</a>
&nbsp;·&nbsp;<a href="https://ayushpaul.in/mastery" style="color:#00C2FF;text-decoration:none;">Mastery</a>
</p>
<p style="margin:0;font-size:11px;color:#444444;">Ayush Paul — Systems Builder &amp; Architect</p>
</td></tr></table></td></tr></table></body></html>`;
}

function emailButton(text: string, url: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;"><tr><td align="center">
<a href="${url}" style="display:inline-block;padding:14px 32px;background-color:#d1f34d;color:#000000;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;letter-spacing:0.5px;">${text}</a>
</td></tr></table>`;
}

// ============================================================
// FIRESTORE HELPER (lazy init, no module-level crash)
// ============================================================

function getDb() {
  if (!admin.apps.length) {
    try {
      const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!sa) throw new Error("FIREBASE_SERVICE_ACCOUNT env var not set");
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(sa)) });
      console.log("[email] Firebase admin initialized");
    } catch (error: any) {
      console.error("[email] Firebase init error:", error.message);
    }
  }
  if (!admin.apps.length) throw new Error("Firebase app not available");
  return getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a");
}

const APP_URL = process.env.APP_URL || "https://ayushpaul.vercel.app";

function stepError(step: string, error: string, code: number = 500) {
  return { success: false, step, error };
}

// ============================================================
// TEMPLATE RENDERERS
// ============================================================

function renderEnrollmentWelcome(props: { userName: string; courseName: string; courseUrl: string; modulesCount: number; lessonsCount: number; isFree: boolean }): string {
  return emailLayout(`
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.userName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">Welcome to <strong style="color:#d1f34d;">${props.courseName}</strong>.</p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">You're now enrolled and ready to start learning. This course includes <strong style="color:#ffffff;">${props.modulesCount} modules</strong> and <strong style="color:#ffffff;">${props.lessonsCount} lessons</strong>.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;"><tr><td style="text-align:center;">
    <p style="margin:0 0 12px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">Course Roadmap</p>
    <p style="margin:0 0 4px;font-size:13px;color:#cccccc;line-height:1.6;">${props.modulesCount} Modules · ${props.lessonsCount} Lessons</p>
    <p style="margin:0;font-size:12px;color:#888888;">${props.isFree ? 'This is a free course — no payment needed.' : 'Premium course — yours forever once enrolled.'}</p>
    </td></tr></table>
    ${emailButton('Start Learning', props.courseUrl)}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`);
}

function renderConfirmationEmail(props: { registrantName: string; workshopTitle: string; workshopDescription?: string; host?: string; duration?: string; date: string; time?: string; workshopStartTime?: string; meetingLink?: string; vaultUrl: string }): string {
  const hasLink = !!props.meetingLink;
  return emailLayout(`
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">You have successfully reserved your seat for <strong style="color:#d1f34d;">${props.workshopTitle}</strong>!</p>
    ${props.workshopDescription ? `<p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#999999;">${props.workshopDescription}</p>` : ''}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;"><tr><td style="text-align:center;">
    <p style="margin:0 0 12px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">Workshop Details</p>
    <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#d1f34d;">${props.workshopTitle}</p>
    <p style="margin:8px 0 4px;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Date:</strong> ${props.date}${props.time ? ` at ${props.time}` : ''}</p>
    ${props.host ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Host:</strong> ${props.host}</p>` : ''}
    ${props.duration ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Duration:</strong> ${props.duration}</p>` : ''}
    ${props.workshopStartTime ? `<p style="margin:4px 0;font-size:12px;color:#888888;">Starts: ${props.workshopStartTime}</p>` : ''}
    </td></tr></table>
    ${hasLink ? emailButton('Join Workshop', props.meetingLink!) : '<p style="margin:0 0 8px;font-size:14px;line-height:22px;color:#888888;">The workshop joining link will be shared before the session begins.</p>'}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">See you there!<br/>— Ayush Paul</p>`);
}

type ReminderType = '24h' | '1h' | '5m';

function renderReminderEmail(props: { registrantName: string; workshopTitle: string; workshopTopic?: string; meetingLink: string; meetingPassword?: string; meetingId?: string; date: string; time?: string; workshopStartTime?: string; vaultUrl: string; reminderType: ReminderType }): string {
  const labels: Record<ReminderType, string> = { '24h': '24 hours', '1h': '1 hour', '5m': '5 minutes' };
  const msgs: Record<ReminderType, string> = { '24h': 'Your workshop is tomorrow! Here are the access details.', '1h': 'Your workshop starts in 1 hour. Get ready to join!', '5m': 'Your workshop is starting in 5 minutes! Join now.' };
  return emailLayout(`
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;"><strong style="color:#d1f34d;">${labels[props.reminderType]} reminder!</strong></p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">${msgs[props.reminderType]}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;"><tr><td style="text-align:center;">
    <p style="margin:0 0 12px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">Access Details</p>
    <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#d1f34d;">${props.workshopTitle}</p>
    ${props.workshopTopic ? `<p style="margin:0 0 16px;font-size:13px;color:#cccccc;">${props.workshopTopic}</p>` : ''}
    <p style="margin:8px 0 4px;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Date:</strong> ${props.date}${props.time ? ` at ${props.time}` : ''}</p>
    ${props.workshopStartTime ? `<p style="margin:4px 0;font-size:12px;color:#888888;">Starts: ${props.workshopStartTime}</p>` : ''}
    <p style="margin:12px 0 4px;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Link:</strong> <a href="${props.meetingLink}" style="color:#00C2FF;text-decoration:underline;">${props.meetingLink}</a></p>
    ${props.meetingId ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">ID:</strong> ${props.meetingId}</p>` : ''}
    ${props.meetingPassword ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Password:</strong> ${props.meetingPassword}</p>` : ''}
    </td></tr></table>
    ${emailButton('Join Workshop', props.meetingLink)}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`);
}

function renderLiveNotification(props: { registrantName: string; workshopTitle: string; workshopTopic?: string; meetingLink: string; meetingPassword?: string; workshopStartTime?: string; date: string; time?: string; vaultUrl: string }): string {
  return emailLayout(`
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">Great news — <strong style="color:#d1f34d;">${props.workshopTitle}</strong> is now <strong style="color:#d1f34d;">LIVE</strong>!</p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">Your reserved spot is ready. Use the details below to join.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;"><tr><td style="text-align:center;">
    <p style="margin:0 0 12px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">Workshop Access</p>
    <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#d1f34d;">${props.workshopTitle}</p>
    ${props.workshopTopic ? `<p style="margin:0 0 16px;font-size:13px;color:#cccccc;">${props.workshopTopic}</p>` : ''}
    <p style="margin:8px 0 4px;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Date:</strong> ${props.date}${props.time ? ` at ${props.time}` : ''}</p>
    ${props.workshopStartTime ? `<p style="margin:4px 0;font-size:12px;color:#888888;">Starts: ${props.workshopStartTime}</p>` : ''}
    <p style="margin:12px 0 4px;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Link:</strong> <a href="${props.meetingLink}" style="color:#00C2FF;text-decoration:underline;">${props.meetingLink}</a></p>
    ${props.meetingPassword ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Password:</strong> ${props.meetingPassword}</p>` : ''}
    </td></tr></table>
    ${emailButton('Join Workshop Now', props.meetingLink)}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`);
}

function renderRecordingEmail(props: { registrantName: string; workshopTitle: string; workshopTopic?: string; recordingUrl?: string; vaultUrl: string }): string {
  return emailLayout(`
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">The recording for <strong style="color:#d1f34d;">${props.workshopTitle}</strong> is now available!</p>
    ${props.workshopTopic ? `<p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#999999;">${props.workshopTopic}</p>` : ''}
    ${props.recordingUrl ? emailButton('Watch Recording', props.recordingUrl) : '<p style="margin:16px 0;font-size:14px;line-height:22px;color:#888888;">Recording is being processed. Check your Vault later.</p>'}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`);
}

function renderCancellationEmail(props: { registrantName: string; workshopTitle: string; workshopTopic?: string; date: string; vaultUrl: string }): string {
  return emailLayout(`
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">Unfortunately, <strong style="color:#d1f34d;">${props.workshopTitle}</strong> scheduled for ${props.date} has been <strong style="color:#ff4444;">cancelled</strong>.</p>
    ${props.workshopTopic ? `<p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#999999;">${props.workshopTopic}</p>` : ''}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`);
}

// ============================================================
// HANDLER: schedule-email
// ============================================================

async function handleScheduleEmail(req: VercelRequest, res: VercelResponse) {
  const { type, userId, userEmail, userName, sendAt, metadata } = req.body;
  if (!type || !userId || !sendAt) return res.status(400).json({ error: 'Missing: type, userId, sendAt' });
  try {
    const validTypes = ['abandoned', 'streak', 'upsell', 'streak_broken', 'purchase_followup', 'creator_promo'];
    if (!validTypes.includes(type)) return res.status(400).json({ error: `Invalid type: ${type}` });
    const docRef = await getDb().collection('scheduled_emails').add({
      type, userId, userEmail: userEmail || '', userName: userName || '',
      sendAt: admin.firestore.Timestamp.fromDate(new Date(sendAt)),
      status: 'pending', metadata: metadata || {},
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.status(200).json({ success: true, id: docRef.id, message: `Scheduled for ${sendAt}` });
  } catch (err: any) {
    return res.status(500).json(stepError("schedule_email", err.message));
  }
}

// ============================================================
// HANDLER: process-scheduled-emails
// ============================================================

const EMAIL_TEMPLATES: Record<string, (data: any) => { subject: string; html: string }> = {
  abandoned: (data) => ({
    subject: `Come back to ${data.courseTitle || 'your course'} — it's waiting`,
    html: emailLayout(`<p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${data.userName || 'Innovator'},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">You started <strong style="color:#d1f34d;">${data.courseTitle || 'a course'}</strong> but haven't been back.</p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">Your progress is saved. One session is all it takes to move forward.</p>
    ${emailButton('Resume Learning', `https://ayushpaul.in/mastery/courses/${data.courseId || ''}`)}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`),
  }),
  streak_broken: (data) => ({
    subject: "Your streak was broken — but it's not over",
    html: emailLayout(`<p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${data.userName || 'Innovator'},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">Your <strong style="color:#d1f34d;">${data.streakDays || 'learning'}</strong>-day streak was broken yesterday.</p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">The best time to start a new streak is today.</p>
    ${emailButton('Start a New Streak', 'https://ayushpaul.in/vault')}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`),
  }),
  upsell: (data) => ({
    subject: `Unlock ${data.productTitle || 'Premium'} — exclusive for you`,
    html: emailLayout(`<p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${data.userName || 'Innovator'},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">Based on your interest, here's something that might help you level up.</p>
    <p style="margin:0 0 8px;font-size:16px;line-height:26px;color:#cccccc;"><strong style="color:#d1f34d;">${data.productTitle || 'Premium Blueprint'}</strong></p>
    ${emailButton('View Blueprint', `https://ayushpaul.in/blueprints/${data.productId || ''}`)}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`),
  }),
  purchase_followup: (data) => ({
    subject: `You now own ${data.productTitle || 'a Blueprint'} — here's your next step`,
    html: emailLayout(`<p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${data.userName || 'Innovator'},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">Thank you for purchasing <strong style="color:#d1f34d;">${data.productTitle || 'your Blueprint'}</strong>.</p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">It's now available in your Vault.</p>
    ${emailButton('Open in Vault', 'https://ayushpaul.in/vault')}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`),
  }),
  creator_promo: (data) => ({
    subject: `${data.creatorName || 'A creator'} promoted — see how it performed`,
    html: emailLayout(`<p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Team,</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;"><strong style="color:#d1f34d;">${data.creatorName || 'A creator'}</strong> just completed a promo cycle.</p>
    <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:24px;color:#cccccc;">
    <li>Code: ${data.creatorCode || 'N/A'}</li><li>Sales: ${data.salesCount || 0}</li><li>Commission: ₹${data.totalCommission || 0}</li></ul>
    ${emailButton('View Dashboard', 'https://ayushpaul.in/admin')}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— AyushPaul.in System</p>`),
  }),
};

const DEFAULT_TEMPLATE: (data: any) => { subject: string; html: string } = (data) => ({
  subject: `Update from AyushPaul.in`,
  html: emailLayout(`<p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${data.userName || 'there'},</p>
  <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">Here's an update you requested.</p>
  ${emailButton('Visit Dashboard', 'https://ayushpaul.in/vault')}
  <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`),
});

async function handleProcessScheduledEmails(req: VercelRequest, res: VercelResponse) {
  try {
    const now = admin.firestore.Timestamp.now();
    const batch = getDb().batch();
    let processed = 0, sent = 0, failed = 0;
    const pendingSnap = await getDb().collection('scheduled_emails').where('status', '==', 'pending').where('sendAt', '<=', now).limit(50).get();
    for (const doc of pendingSnap.docs) {
      const data = doc.data();
      if (!data.userEmail) { batch.update(doc.ref, { status: 'failed', error: 'No email', sentAt: now }); failed++; processed++; continue; }
      const template = EMAIL_TEMPLATES[data.type] || DEFAULT_TEMPLATE;
      const { subject, html } = template({ ...data.metadata, userName: data.userName });
      const result = await sendEmail(data.userEmail, subject, html);
      if (result.success) { batch.update(doc.ref, { status: 'sent', sentAt: now }); sent++; }
      else { batch.update(doc.ref, { status: 'failed', error: result.error, sentAt: now }); failed++; }
      processed++;
    }
    if (processed > 0) await batch.commit();
    return res.json({ success: true, processed, sent, failed });
  } catch (err: any) {
    return res.status(500).json(stepError("process_scheduled", err.message));
  }
}

// ============================================================
// HANDLER: process-email-triggers
// ============================================================

async function handleProcessEmailTriggers(req: VercelRequest, res: VercelResponse) {
  const { trigger, userId, metadata } = req.body;
  if (!trigger || !userId) return res.status(400).json({ error: 'Missing trigger or userId' });
  try {
    const userSnap = await getDb().collection('users').doc(userId).get();
    if (!userSnap.exists) return res.status(404).json({ error: 'User not found' });
    const userData = userSnap.data()!;
    const email = userData.email;
    const userName = userData.displayName || email?.split('@')[0] || 'Innovator';
    if (!email) return res.status(400).json({ error: 'User has no email' });

    let subject = '', html = '';
    switch (trigger) {
      case 'streak_broken':
        subject = 'Your streak was broken — start again today';
        html = emailLayout(`<p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${userName},</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">Your <strong style="color:#d1f34d;">${metadata?.streakDays || 'your'}</strong>-day streak was broken.</p>
        <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">Every streak starts with day one. Jump back in today.</p>
        ${emailButton('Restart Your Streak', 'https://ayushpaul.in/vault')}
        <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`);
        break;
      case 'purchase_followup':
        subject = `You now own ${metadata?.productTitle || 'your Blueprint'} — start building`;
        html = emailLayout(`<p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${userName},</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">Thank you for purchasing <strong style="color:#d1f34d;">${metadata?.productTitle || 'your Blueprint'}</strong>.</p>
        <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">It's now in your Vault. Go explore your new Blueprint.</p>
        ${emailButton('Open in Vault', 'https://ayushpaul.in/vault')}
        <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`);
        break;
      case 'creator_promo':
        subject = `Creator Promo Report — ${metadata?.creatorName || 'A creator'}`;
        html = emailLayout(`<p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Admin Team,</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;"><strong style="color:#d1f34d;">${metadata?.creatorName || 'A creator'}</strong> completed a promo cycle.</p>
        <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:24px;color:#cccccc;">
        <li>Code: ${metadata?.creatorCode || 'N/A'}</li><li>Sales: ${metadata?.salesCount || 0}</li><li>Commission: ₹${metadata?.totalCommission || 0}</li></ul>
        ${emailButton('View Dashboard', 'https://ayushpaul.in/admin')}
        <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— AyushPaul.in System</p>`);
        break;
      default:
        return res.status(400).json({ error: `Unknown trigger: ${trigger}` });
    }
    const result = await sendEmail(email, subject, html);
    return result.success ? res.json({ success: true }) : res.status(500).json({ error: result.error });
  } catch (err: any) {
    return res.status(500).json(stepError("email_trigger", err.message));
  }
}

// ============================================================
// HANDLER: trigger-abandoned-check
// ============================================================

async function handleTriggerAbandonedCheck(req: VercelRequest, res: VercelResponse) {
  try {
    const cutoff = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const staleEnrollments = await getDb().collection('enrollments').where('updatedAt', '<', cutoff).where('completed', '==', false).limit(10).get();
    let sent = 0;
    for (const doc of staleEnrollments.docs) {
      const data = doc.data();
      const { userId, courseId } = data;
      if (!userId || !courseId) continue;
      const [userSnap, courseSnap] = await Promise.all([getDb().collection('users').doc(userId).get(), getDb().collection('courses').doc(courseId).get()]);
      if (!userSnap.exists || !courseSnap.exists) continue;
      const userData = userSnap.data()!;
      const courseData = courseSnap.data()!;
      const email = userData.email;
      if (!email) continue;
      const result = await sendEmail(email, `Continue where you left off — ${courseData.title || 'your course'}`,
        emailLayout(`<p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${userData.displayName || email.split('@')[0] || 'Innovator'},</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">We noticed you haven't continued <strong style="color:#d1f34d;">${courseData.title || 'your course'}</strong> recently.</p>
        <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">Your progress is saved and waiting for you.</p>
        ${emailButton('Resume Learning', `https://ayushpaul.in/mastery/courses/${courseId}`)}
        <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`));
      if (result.success) sent++;
    }
    return res.json({ success: true, checked: staleEnrollments.size, sent });
  } catch (err: any) {
    return res.status(500).json(stepError("abandoned_check", err.message));
  }
}

// ============================================================
// HANDLER: trigger-enrollment-email
// ============================================================

async function handleTriggerEnrollmentEmail(req: VercelRequest, res: VercelResponse) {
  const { userId, courseId } = req.body;
  if (!userId || !courseId) return res.status(400).json({ error: 'Missing userId or courseId' });
  try {
    const [userSnap, courseSnap] = await Promise.all([getDb().collection('users').doc(userId).get(), getDb().collection('courses').doc(courseId).get()]);
    if (!userSnap.exists || !courseSnap.exists) return res.status(404).json({ error: 'User or course not found' });
    const userData = userSnap.data()!;
    const courseData = courseSnap.data()!;
    const email = userData.email;
    const userName = userData.displayName || email?.split('@')[0] || 'Innovator';
    if (!email) return res.status(400).json({ error: 'User has no email' });

    const [modSnap, lesSnap] = await Promise.all([
      getDb().collection('modules').where('courseId', '==', courseId).get(),
      getDb().collection('lessons').where('courseId', '==', courseId).get(),
    ]);

    const html = renderEnrollmentWelcome({
      userName, courseName: courseData.title || 'Course',
      courseUrl: `https://ayushpaul.in/mastery/courses/${courseId}`,
      modulesCount: modSnap.size, lessonsCount: lesSnap.size || courseData.lessonsCount || 10,
      isFree: courseData.isFree || courseData.price === 0,
    });
    const result = await sendEmail(email, `Welcome to ${courseData.title || 'Your Course'} — Start Learning`, html);
    return result.success ? res.json({ success: true }) : res.status(500).json({ error: result.error });
  } catch (err: any) {
    return res.status(500).json(stepError("enrollment_email", err.message));
  }
}

// ============================================================
// WORKSHOP HANDLERS (from workshop-email.ts)
// ============================================================

async function handleSendConfirmation(req: VercelRequest, res: VercelResponse) {
  try {
    const { workshopId, registrationId } = req.body;
    if (!workshopId || !registrationId) return res.status(400).json(stepError("validate_params", "Missing workshopId or registrationId", 400));

    let regDoc, reg;
    try { regDoc = await getDb().collection("workshop_registrations").doc(registrationId).get(); if (!regDoc.exists) return res.status(404).json(stepError("registration_lookup", "Not found", 404)); reg = regDoc.data()!; } catch (e: any) { return res.status(500).json(stepError("registration_lookup", e.message)); }

    let workshopDoc, workshop;
    try { workshopDoc = await getDb().collection("workshops").doc(workshopId).get(); if (!workshopDoc.exists) return res.status(404).json(stepError("workshop_lookup", "Not found", 404)); workshop = workshopDoc.data()!; } catch (e: any) { return res.status(500).json(stepError("workshop_lookup", e.message)); }

    const html = renderConfirmationEmail({
      registrantName: reg.name || reg.email?.split("@")[0] || "Innovator",
      workshopTitle: workshop.title || "Workshop", workshopDescription: workshop.description || workshop.topic || "",
      host: workshop.host || "Ayush Paul", duration: workshop.duration || "60 min",
      date: workshop.date || "TBD", time: workshop.time, workshopStartTime: workshop.workshopStartTime,
      meetingLink: workshop.meetingLink || "", vaultUrl: `${APP_URL}/vault`,
    });
    const result = await sendEmail(reg.email, `✅ Confirmed: ${workshop.title || "Workshop"} — Your Spot is Reserved!`, html);
    if (result.success) await regDoc.ref.update({ confirmationSentAt: admin.firestore.FieldValue.serverTimestamp() }).catch(() => {});
    return res.json({ success: result.success, error: result.error });
  } catch (err: any) {
    return res.status(500).json(stepError("send_confirmation", err.message));
  }
}

async function handleSendConfirmationAll(req: VercelRequest, res: VercelResponse) {
  try {
    const { workshopId } = req.body;
    if (!workshopId) return res.status(400).json(stepError("validate", "Missing workshopId", 400));

    let workshop;
    try { const d = await getDb().collection("workshops").doc(workshopId).get(); if (!d.exists) return res.status(404).json(stepError("workshop_lookup", "Not found", 404)); workshop = d.data()!; } catch (e: any) { return res.status(500).json(stepError("workshop_lookup", e.message)); }

    let snap;
    try { snap = await getDb().collection("workshop_registrations").where("workshopId", "==", workshopId).get(); } catch (e: any) { return res.status(500).json(stepError("registrations_query", e.message)); }
    if (snap.empty) return res.json({ success: true, notified: 0 });

    let notified = 0; const errors: string[] = [];
    for (const doc of snap.docs) {
      const r = doc.data(); if (!r.email) continue;
      try {
        const html = renderConfirmationEmail({ registrantName: r.name || r.email?.split("@")[0] || "Innovator", workshopTitle: workshop.title || "Workshop", workshopDescription: workshop.description || "", host: workshop.host || "Ayush Paul", duration: workshop.duration || "60 min", date: workshop.date || "TBD", time: workshop.time, workshopStartTime: workshop.workshopStartTime, meetingLink: workshop.meetingLink || "", vaultUrl: `${APP_URL}/vault` });
        const result = await sendEmail(r.email, `✅ Confirmed: ${workshop.title || "Workshop"} — Your Spot is Reserved!`, html);
        if (result.success) { notified++; await doc.ref.update({ confirmationSentAt: admin.firestore.FieldValue.serverTimestamp() }).catch(() => {}); } else { errors.push(`${r.email}: ${result.error}`); }
      } catch (e: any) { errors.push(`${r.email}: ${e.message}`); }
    }
    return res.json({ success: true, notified, total: snap.docs.length, errors: errors.length > 0 ? errors : undefined });
  } catch (err: any) {
    return res.status(500).json(stepError("send_confirmation_all", err.message));
  }
}

async function handleSendReminder(req: VercelRequest, res: VercelResponse) {
  try {
    const { workshopId, reminderType } = req.body;
    if (!workshopId || !reminderType) return res.status(400).json(stepError("validate", "Missing params", 400));
    if (!['24h', '1h', '5m'].includes(reminderType)) return res.status(400).json(stepError("validate", "Invalid reminderType", 400));

    let workshop;
    try { const d = await getDb().collection("workshops").doc(workshopId).get(); if (!d.exists) return res.status(404).json(stepError("workshop_lookup", "Not found", 404)); workshop = d.data()!; } catch (e: any) { return res.status(500).json(stepError("workshop_lookup", e.message)); }
    if (!workshop.meetingLink) return res.status(400).json(stepError("meeting", "No meeting link", 400));

    let snap; try { snap = await getDb().collection("workshop_registrations").where("workshopId", "==", workshopId).get(); } catch (e: any) { return res.status(500).json(stepError("registrations_query", e.message)); }
    if (snap.empty) return res.json({ success: true, notified: 0 });

    let notified = 0; const errors: string[] = [];
    for (const d of snap.docs) {
      const r = d.data(); if (!r.email) continue;
      try {
        const html = renderReminderEmail({ registrantName: r.name || r.email?.split("@")[0] || "Innovator", workshopTitle: workshop.title || "Workshop", workshopTopic: workshop.topic, meetingLink: workshop.meetingLink, meetingPassword: workshop.meetingPassword, meetingId: workshop.meetingId, date: workshop.date || "TBD", time: workshop.time, workshopStartTime: workshop.workshopStartTime, vaultUrl: `${APP_URL}/vault`, reminderType: reminderType as ReminderType });
        const subject = `⏰ ${reminderType === '5m' ? 'Starting Soon' : reminderType === '1h' ? '1 Hour to Go' : 'Tomorrow'}: ${workshop.title || "Workshop"}`;
        const result = await sendEmail(r.email, subject, html);
        if (result.success) { notified++; await d.ref.update({ notifiedAt: admin.firestore.FieldValue.serverTimestamp(), remindersSent: (r.remindersSent || '') ? `${r.remindersSent || ''},${reminderType}` : reminderType }).catch(() => {}); } else { errors.push(`${r.email}: ${result.error}`); }
      } catch (e: any) { errors.push(`${r.email}: ${e.message}`); }
    }
    return res.json({ success: true, notified, total: snap.docs.length, errors: errors.length > 0 ? errors : undefined });
  } catch (err: any) {
    return res.status(500).json(stepError("send_reminder", err.message));
  }
}

async function handleSendLive(req: VercelRequest, res: VercelResponse) {
  try {
    const { workshopId } = req.body;
    if (!workshopId) return res.status(400).json(stepError("validate", "Missing workshopId", 400));
    let workshop;
    try { const d = await getDb().collection("workshops").doc(workshopId).get(); if (!d.exists) return res.status(404).json(stepError("workshop_lookup", "Not found", 404)); workshop = d.data()!; } catch (e: any) { return res.status(500).json(stepError("workshop_lookup", e.message)); }
    if (!workshop.meetingLink) return res.status(400).json(stepError("meeting", "No meeting link", 400));
    let snap; try { snap = await getDb().collection("workshop_registrations").where("workshopId", "==", workshopId).get(); } catch (e: any) { return res.status(500).json(stepError("registrations_query", e.message)); }
    if (snap.empty) return res.json({ success: true, notified: 0 });
    let notified = 0; const errors: string[] = [];
    for (const d of snap.docs) {
      const r = d.data(); if (!r.email) continue;
      try {
        const html = renderLiveNotification({ registrantName: r.name || r.email?.split("@")[0] || "Innovator", workshopTitle: workshop.title || "Workshop", workshopTopic: workshop.topic, meetingLink: workshop.meetingLink, meetingPassword: workshop.meetingPassword, workshopStartTime: workshop.workshopStartTime, date: workshop.date || "TBD", time: workshop.time, vaultUrl: `${APP_URL}/vault` });
        const result = await sendEmail(r.email, `🎥 LIVE Now: ${workshop.title || "Workshop"} — Join Us!`, html);
        if (result.success) { notified++; await d.ref.update({ notifiedAt: admin.firestore.FieldValue.serverTimestamp() }).catch(() => {}); } else { errors.push(`${r.email}: ${result.error}`); }
      } catch (e: any) { errors.push(`${r.email}: ${e.message}`); }
    }
    return res.json({ success: true, notified, total: snap.docs.length, errors: errors.length > 0 ? errors : undefined });
  } catch (err: any) {
    return res.status(500).json(stepError("send_live", err.message));
  }
}

async function handleSendRecording(req: VercelRequest, res: VercelResponse) {
  try {
    const { workshopId } = req.body;
    if (!workshopId) return res.status(400).json(stepError("validate", "Missing workshopId", 400));
    let workshop;
    try { const d = await getDb().collection("workshops").doc(workshopId).get(); if (!d.exists) return res.status(404).json(stepError("workshop_lookup", "Not found", 404)); workshop = d.data()!; } catch (e: any) { return res.status(500).json(stepError("workshop_lookup", e.message)); }
    let snap; try { snap = await getDb().collection("workshop_registrations").where("workshopId", "==", workshopId).get(); } catch (e: any) { return res.status(500).json(stepError("registrations_query", e.message)); }
    if (snap.empty) return res.json({ success: true, notified: 0 });
    let notified = 0; const errors: string[] = [];
    for (const d of snap.docs) {
      const r = d.data(); if (!r.email) continue;
      try {
        const html = renderRecordingEmail({ registrantName: r.name || r.email?.split("@")[0] || "Innovator", workshopTitle: workshop.title || "Workshop", workshopTopic: workshop.topic, recordingUrl: workshop.recordingUrl, vaultUrl: `${APP_URL}/vault` });
        const result = await sendEmail(r.email, `📹 Recording Available: ${workshop.title || "Workshop"} — Watch the Replay`, html);
        if (result.success) { notified++; await d.ref.update({ notifiedAt: admin.firestore.FieldValue.serverTimestamp() }).catch(() => {}); } else { errors.push(`${r.email}: ${result.error}`); }
      } catch (e: any) { errors.push(`${r.email}: ${e.message}`); }
    }
    return res.json({ success: true, notified, total: snap.docs.length, errors: errors.length > 0 ? errors : undefined });
  } catch (err: any) {
    return res.status(500).json(stepError("send_recording", err.message));
  }
}

async function handleSendCancellation(req: VercelRequest, res: VercelResponse) {
  try {
    const { workshopId } = req.body;
    if (!workshopId) return res.status(400).json(stepError("validate", "Missing workshopId", 400));
    let workshop;
    try { const d = await getDb().collection("workshops").doc(workshopId).get(); if (!d.exists) return res.status(404).json(stepError("workshop_lookup", "Not found", 404)); workshop = d.data()!; } catch (e: any) { return res.status(500).json(stepError("workshop_lookup", e.message)); }
    let snap; try { snap = await getDb().collection("workshop_registrations").where("workshopId", "==", workshopId).get(); } catch (e: any) { return res.status(500).json(stepError("registrations_query", e.message)); }
    if (snap.empty) return res.json({ success: true, notified: 0 });
    let notified = 0; const errors: string[] = [];
    for (const d of snap.docs) {
      const r = d.data(); if (!r.email) continue;
      try {
        const html = renderCancellationEmail({ registrantName: r.name || r.email?.split("@")[0] || "Innovator", workshopTitle: workshop.title || "Workshop", workshopTopic: workshop.topic, date: workshop.date || "TBD", vaultUrl: `${APP_URL}/vault` });
        const result = await sendEmail(r.email, `❌ Cancelled: ${workshop.title || "Workshop"} — Session Update`, html);
        if (result.success) { notified++; await d.ref.update({ notifiedAt: admin.firestore.FieldValue.serverTimestamp() }).catch(() => {}); } else { errors.push(`${r.email}: ${result.error}`); }
      } catch (e: any) { errors.push(`${r.email}: ${e.message}`); }
    }
    return res.json({ success: true, notified, total: snap.docs.length, errors: errors.length > 0 ? errors : undefined });
  } catch (err: any) {
    return res.status(500).json(stepError("send_cancellation", err.message));
  }
}

// ============================================================
// HANDLER: newsletter-send (from newsletter/send.ts)
// ============================================================

const ADMIN_UIDS = ["80OJfcmVXCRNmSZuthVU68K6vJq2"];

async function handleNewsletterSend(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const ADMIN_EMAILS = ["ap877@cornell.edu"];
    const isEmailAdmin = decodedToken.email && ADMIN_EMAILS.includes(decodedToken.email);
    if (!ADMIN_UIDS.includes(decodedToken.uid) && !isEmailAdmin) return res.status(403).json({ error: "Access Denied" });

    if (!process.env.RESEND_API_KEY) return res.status(500).json({ error: "RESEND_API_KEY not configured", code: "MISSING_API_KEY" });

    initResend();
    const { subject, content, campaignId, isTestMode } = req.body;
    if (!subject || !content) return res.status(400).json({ error: "Subject and content required" });

    let allSubscribers: any[] = [];
    if (isTestMode) {
      allSubscribers = [{ id: 'test-admin', email: decodedToken.email }];
    } else {
      const subSnapshot = await getDb().collection("subscribers").get();
      allSubscribers = subSnapshot.docs.map((doc: any) => ({ id: doc.id, email: doc.data().email }));
    }
    if (allSubscribers.length === 0) return res.status(400).json({ error: "No subscribers" });

    let startIndex = 0;
    if (campaignId) {
      const campDoc = await getDb().collection("newsletter_campaigns").doc(campaignId).get();
      if (campDoc.exists) startIndex = campDoc.data()?.sentCount || 0;
    }

    const batchSize = 100;
    const batch = allSubscribers.slice(startIndex, startIndex + batchSize);
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Ayush Paul <onboarding@resend.dev>";

    const results = await Promise.all(batch.map(async (sub: any) => {
      try {
        const { data, error } = await resend.emails.send({
          from: fromAddress, to: sub.email, subject, html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#ffffff;color:#1a1a1a;padding:40px;border-radius:12px;border:1px solid #eeeeee;">
            <div style="margin-bottom:30px;"><span style="font-weight:bold;letter-spacing:2px;text-transform:uppercase;font-size:12px;color:#00C2FF;">Innovation Lab</span></div>
            <h1 style="font-size:24px;font-weight:800;margin-bottom:20px;line-height:1.2;color:#000000;">${subject}</h1>
            <div style="font-size:16px;line-height:1.6;color:#444444;margin-bottom:40px;">${content.replace(/\n/g, '<br/>')}</div>
            <div style="border-top:1px solid #eeeeee;padding-top:20px;font-size:12px;color:#999999;text-align:center;">
            <p>© ${new Date().getFullYear()} Ayush Paul Innovation Lab</p>
            <p>You received this because you subscribed. <a href="${APP_URL}/api/newsletter/unsubscribe?id=${sub.id}" style="color:#00C2FF;text-decoration:none;font-weight:bold;">Unsubscribe</a></p></div></div>`
        });
        if (error) throw error;
        return { email: sub.email, success: true };
      } catch (err: any) {
        return { email: sub.email, success: false, error: err.message || err.name };
      }
    }));

    const successfulSends = results.filter((r: any) => r.success).length;
    const failedSends = results.filter((r: any) => !r.success);
    const sentCount = startIndex + successfulSends;

    if (batch.length > 0 && successfulSends === 0) {
      const isSandbox = failedSends.some((f: any) => f.error?.toLowerCase().includes("forbidden") || f.error?.toLowerCase().includes("unverified"));
      return res.status(500).json({
        error: isSandbox
          ? "Resend Sandbox: verify your domain to send to all subscribers."
          : "Delivery failed for entire batch.",
        details: failedSends[0]?.error, code: isSandbox ? "RESEND_SANDBOX" : "BATCH_FAILED"
      });
    }

    if (isTestMode) return res.json({ message: `Test sent to ${decodedToken.email}`, sentCount: 1, total: 1, status: "test" });

    const campaignData = { subject, content, sentCount, totalSubscribers: allSubscribers.length, status: sentCount >= allSubscribers.length ? "completed" : "processing", lastBatchAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() };

    let currentCampaignId = campaignId;
    if (!currentCampaignId) {
      const newCamp = await getDb().collection("newsletter_campaigns").add({ ...campaignData, createdAt: admin.firestore.FieldValue.serverTimestamp() });
      currentCampaignId = newCamp.id;
    } else {
      await getDb().collection("newsletter_campaigns").doc(currentCampaignId).update(campaignData);
    }

    return res.json({
      message: sentCount >= allSubscribers.length ? `Newsletter sent to ${sentCount} subscribers!` : `Batch: ${successfulSends} sent, ${failedSends.length} failed. Progress: ${sentCount}/${allSubscribers.length}`,
      campaignId: currentCampaignId, sentCount, total: allSubscribers.length, status: campaignData.status,
      failures: failedSends.length > 0 ? failedSends.slice(0, 5) : undefined,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}

// ============================================================
// HANDLER: newsletter-unsubscribe (from newsletter/unsubscribe.ts)
// ============================================================

async function handleNewsletterUnsubscribe(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const { email, id } = req.query;
  if (!email && !id) {
    return res.status(400).setHeader('Content-Type', 'text/html').send(`<html><body style="font-family:sans-serif;background:#0A0A0A;color:white;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;"><div><h1 style="color:#FF4B4B;">Invalid Request</h1><p style="opacity:0.6;">Missing subscriber identifier.</p></div></body></html>`);
  }
  try {
    const subscribersRef = getDb().collection("subscribers");
    let deleted = false;
    if (id) { await subscribersRef.doc(id as string).delete(); deleted = true; }
    else if (email) {
      const snapshot = await subscribersRef.where("email", "==", (email as string).toLowerCase().trim()).get();
      const batch = getDb().batch();
      snapshot.forEach((doc: any) => { batch.delete(doc.ref); deleted = true; });
      await batch.commit();
    }
    return res.status(200).setHeader('Content-Type', 'text/html').send(`<html><head><title>Unsubscribed | Innovation Lab</title>
    <style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#080808;color:white;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;}
    .card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);padding:3rem;border-radius:2rem;max-width:400px;}
    h1{font-size:1.5rem;margin-bottom:1rem;}.brand{color:#00C2FF;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;font-size:0.7rem;}
    .btn{display:inline-block;margin-top:2rem;padding:0.8rem 1.5rem;background:#00C2FF;color:black;text-decoration:none;border-radius:0.8rem;font-weight:bold;font-size:0.8rem;}
    </style></head><body><div class="card"><span class="brand">Innovation Lab</span><h1>You have been unsubscribed</h1><p>You will no longer receive our newsletters.</p><a href="/" class="btn">Back to Lab</a></div></body></html>`);
  } catch (error: any) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// ============================================================
// ROUTER
// ============================================================

const HANDLERS: Record<string, (req: VercelRequest, res: VercelResponse) => Promise<any>> = {
  "schedule-email": handleScheduleEmail,
  "process-scheduled-emails": handleProcessScheduledEmails,
  "process-email-triggers": handleProcessEmailTriggers,
  "trigger-abandoned-check": handleTriggerAbandonedCheck,
  "trigger-enrollment-email": handleTriggerEnrollmentEmail,
  "send-confirmation": handleSendConfirmation,
  "send-confirmation-all": handleSendConfirmationAll,
  "send-reminder": handleSendReminder,
  "send-live": handleSendLive,
  "send-recording": handleSendRecording,
  "send-cancellation": handleSendCancellation,
  "newsletter-send": handleNewsletterSend,
  "newsletter-unsubscribe": handleNewsletterUnsubscribe,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  console.log("[email] handler entry method=", req.method, "action=", req.body?.action || req.query?.action);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const action = req.body?.action || req.query?.action;
  const handlerFn = HANDLERS[action as string];

  if (!handlerFn) {
    return res.status(400).json(stepError("unknown_action", `Unknown: ${action}`));
  }

  try {
    return await handlerFn(req, res);
  } catch (err: any) {
    console.error("[email] handler unhandled:", err);
    return res.status(500).json(stepError("handler_crash", err.message));
  }
}
