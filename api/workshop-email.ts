import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// ── Email helpers (inlined to avoid import resolution failures in Vercel build) ──

function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" style="max-width:560px;background-color:#111111;border-radius:12px;border:1px solid #333333;">
          <tr>
            <td style="padding:28px 24px;background-color:#1a1a1a;border-top-left-radius:12px;border-top-right-radius:12px;border-bottom:1px solid #333333;text-align:center;">
              <h1 style="margin:0;font-size:20px;font-weight:700;color:#d1f34d;letter-spacing:1px;text-transform:uppercase;">AyushPaul.in</h1>
              <p style="margin:4px 0 0;font-size:11px;color:#666666;letter-spacing:2px;text-transform:uppercase;">Innovation Lab</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;">${content}</td>
          </tr>
          <tr>
            <td style="padding:20px 24px;border-top:1px solid #222222;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#555555;">
                <a href="https://ayushpaul.in/vault" style="color:#00C2FF;text-decoration:none;">My Vault</a>
                &nbsp;·&nbsp;
                <a href="https://ayushpaul.in/blueprints" style="color:#00C2FF;text-decoration:none;">Blueprints</a>
                &nbsp;·&nbsp;
                <a href="https://ayushpaul.in/mastery" style="color:#00C2FF;text-decoration:none;">Mastery</a>
              </p>
              <p style="margin:0;font-size:11px;color:#444444;">Ayush Paul — Systems Builder &amp; Architect</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function emailButton(text: string, url: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
  <tr>
    <td align="center">
      <a href="${url}" style="display:inline-block;padding:14px 32px;background-color:#d1f34d;color:#000000;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;letter-spacing:0.5px;">${text}</a>
    </td>
  </tr>
</table>`;
}

// ── Resend integration ──

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
    const response = await resend.emails.send({
      from: DEFAULT_FROM,
      to,
      subject,
      html,
    });
    console.log(`[workshop-email] Resend sent "${subject}" to ${to}:`, JSON.stringify(response));
    return { success: true };
  } catch (err: any) {
    console.error(`[workshop-email] Resend failed "${subject}" to ${to}:`, err.message);
    if (err.response) console.error("[workshop-email] Resend response:", JSON.stringify(err.response.data || err.response.body));
    return { success: false, error: err.message };
  }
}

// ── Email template renderers (inlined) ──

type ReminderType = '24h' | '1h' | '5m';

function renderConfirmationEmail(props: {
  registrantName: string; workshopTitle: string; workshopDescription?: string;
  host?: string; duration?: string; date: string; time?: string;
  workshopStartTime?: string; meetingLink?: string; vaultUrl: string;
}): string {
  const hasMeetingLink = !!props.meetingLink;
  const content = `
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">
      You have successfully reserved your seat for <strong style="color:#d1f34d;">${props.workshopTitle}</strong>!
    </p>
    ${props.workshopDescription ? `<p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#999999;">${props.workshopDescription}</p>` : ''}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;">
      <tr><td style="text-align:center;">
        <p style="margin:0 0 12px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">Workshop Details</p>
        <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#d1f34d;">${props.workshopTitle}</p>
        <p style="margin:8px 0 4px;font-size:14px;color:#cccccc;">
          <strong style="color:#ffffff;">Date:</strong> ${props.date}${props.time ? ` at ${props.time}` : ''}
        </p>
        ${props.host ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Host:</strong> ${props.host}</p>` : ''}
        ${props.duration ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Duration:</strong> ${props.duration}</p>` : ''}
        ${props.workshopStartTime ? `<p style="margin:4px 0;font-size:12px;color:#888888;">Starts: ${props.workshopStartTime}</p>` : ''}
      </td></tr>
    </table>
    ${hasMeetingLink ? emailButton('Join Workshop', props.meetingLink!) : '<p style="margin:0 0 8px;font-size:14px;line-height:22px;color:#888888;">The workshop joining link will be shared before the session begins.</p>'}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">
      You can also access all your workshops from your <a href="${props.vaultUrl}" style="color:#00C2FF;text-decoration:underline;">Vault</a>.
    </p>
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">See you there!<br/>— Ayush Paul</p>`;
  return emailLayout(content);
}

function renderReminderEmail(props: {
  registrantName: string; workshopTitle: string; workshopTopic?: string;
  meetingLink: string; meetingPassword?: string; meetingId?: string;
  date: string; time?: string; workshopStartTime?: string; vaultUrl: string; reminderType: ReminderType;
}): string {
  const reminderLabels: Record<ReminderType, string> = { '24h': '24 hours', '1h': '1 hour', '5m': '5 minutes' };
  const reminderMessages: Record<ReminderType, string> = {
    '24h': 'Your workshop is tomorrow! Here are the access details.',
    '1h': 'Your workshop starts in 1 hour. Get ready to join!',
    '5m': 'Your workshop is starting in 5 minutes! Join now.',
  };
  const meetingInfo = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;">
      <tr><td style="text-align:center;">
        <p style="margin:0 0 12px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">Access Details</p>
        <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#d1f34d;">${props.workshopTitle}</p>
        ${props.workshopTopic ? `<p style="margin:0 0 16px;font-size:13px;color:#cccccc;">${props.workshopTopic}</p>` : ''}
        <p style="margin:8px 0 4px;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Date:</strong> ${props.date}${props.time ? ` at ${props.time}` : ''}</p>
        ${props.workshopStartTime ? `<p style="margin:4px 0;font-size:12px;color:#888888;">Starts: ${props.workshopStartTime}</p>` : ''}
        <p style="margin:12px 0 4px;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Link:</strong> <a href="${props.meetingLink}" style="color:#00C2FF;text-decoration:underline;">${props.meetingLink}</a></p>
        ${props.meetingId ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Meeting ID:</strong> ${props.meetingId}</p>` : ''}
        ${props.meetingPassword ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Password:</strong> ${props.meetingPassword}</p>` : ''}
      </td></tr>
    </table>`;
  const content = `
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;"><strong style="color:#d1f34d;">${reminderLabels[props.reminderType]} reminder!</strong></p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">${reminderMessages[props.reminderType]}</p>
    ${meetingInfo}
    ${emailButton('Join Workshop', props.meetingLink)}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">Can't make it? The replay will be available in your <a href="${props.vaultUrl}" style="color:#00C2FF;text-decoration:underline;">Vault</a> after the session ends.</p>
    <p style="margin:8px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`;
  return emailLayout(content);
}

function renderLiveNotification(props: {
  registrantName: string; workshopTitle: string; workshopTopic?: string;
  meetingLink: string; meetingPassword?: string; workshopStartTime?: string;
  date: string; time?: string; vaultUrl: string;
}): string {
  const meetingInfo = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:#1a1a1a;border-radius:8px;padding:20px;">
      <tr><td style="text-align:center;">
        <p style="margin:0 0 12px;font-size:11px;color:#666666;letter-spacing:1px;text-transform:uppercase;">Workshop Access</p>
        <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#d1f34d;">${props.workshopTitle}</p>
        ${props.workshopTopic ? `<p style="margin:0 0 16px;font-size:13px;color:#cccccc;">${props.workshopTopic}</p>` : ''}
        <p style="margin:8px 0 4px;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Date:</strong> ${props.date}${props.time ? ` at ${props.time}` : ''}</p>
        ${props.workshopStartTime ? `<p style="margin:4px 0;font-size:12px;color:#888888;">Starts: ${props.workshopStartTime}</p>` : ''}
        <p style="margin:12px 0 4px;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Link:</strong> <a href="${props.meetingLink}" style="color:#00C2FF;text-decoration:underline;">${props.meetingLink}</a></p>
        ${props.meetingPassword ? `<p style="margin:4px 0;font-size:14px;color:#cccccc;"><strong style="color:#ffffff;">Password:</strong> ${props.meetingPassword}</p>` : ''}
      </td></tr>
    </table>`;
  const content = `
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">Great news — <strong style="color:#d1f34d;">${props.workshopTitle}</strong> is now <strong style="color:#d1f34d;">LIVE</strong>!</p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#cccccc;">Your reserved spot is ready. Use the details below to join the session.</p>
    ${meetingInfo}
    <p style="margin:0 0 8px;font-size:14px;line-height:22px;color:#888888;"><strong style="color:#cccccc;">Quick tips:</strong> Join 5 minutes early to test your audio and video. The session will be recorded and available in your Vault afterward.</p>
    ${emailButton('Join Workshop Now', props.meetingLink)}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">Can't make it? The replay will be available in your <a href="${props.vaultUrl}" style="color:#00C2FF;text-decoration:underline;">Vault</a> after the session ends.</p>
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">See you there!<br/>— Ayush Paul</p>`;
  return emailLayout(content);
}

function renderRecordingAvailable(props: {
  registrantName: string; workshopTitle: string; workshopTopic?: string;
  recordingUrl?: string; vaultUrl: string;
}): string {
  const content = `
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">The recording for <strong style="color:#d1f34d;">${props.workshopTitle}</strong> is now available!</p>
    ${props.workshopTopic ? `<p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#999999;">${props.workshopTopic}</p>` : ''}
    <p style="margin:0 0 8px;font-size:14px;line-height:22px;color:#cccccc;">Watch the replay at your convenience and revisit the key insights.</p>
    ${props.recordingUrl ? emailButton('Watch Recording', props.recordingUrl) : '<p style="margin:16px 0;font-size:14px;line-height:22px;color:#888888;">Recording is being processed. Check your Vault later.</p>'}
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">Access all your workshops in your <a href="${props.vaultUrl}" style="color:#00C2FF;text-decoration:underline;">Vault</a>.</p>
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`;
  return emailLayout(content);
}

function renderCancellationNotice(props: {
  registrantName: string; workshopTitle: string; workshopTopic?: string;
  date: string; vaultUrl: string;
}): string {
  const content = `
    <p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#cccccc;">Hi ${props.registrantName},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#cccccc;">Unfortunately, <strong style="color:#d1f34d;">${props.workshopTitle}</strong> scheduled for ${props.date} has been <strong style="color:#ff4444;">cancelled</strong>.</p>
    ${props.workshopTopic ? `<p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#999999;">${props.workshopTopic}</p>` : ''}
    <p style="margin:0 0 8px;font-size:14px;line-height:22px;color:#cccccc;">We apologize for any inconvenience. If you have questions, please reach out.</p>
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">View your other workshops in your <a href="${props.vaultUrl}" style="color:#00C2FF;text-decoration:underline;">Vault</a>.</p>
    <p style="margin:16px 0 0;font-size:14px;line-height:22px;color:#666666;">— Ayush Paul</p>`;
  return emailLayout(content);
}

// ── Firestore helper ──

function getDb() {
  if (!admin.apps.length) {
    try {
      const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!sa) throw new Error("FIREBASE_SERVICE_ACCOUNT env var not set");
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(sa)) });
      console.log("[workshop-email] Firebase admin initialized");
    } catch (error: any) {
      console.error("[workshop-email] Firebase init error:", error.message);
    }
  }
  if (!admin.apps.length) {
    throw new Error("Firebase app not available");
  }
  return getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a");
}

const APP_URL = process.env.APP_URL || "https://ayushpaul.vercel.app";

function stepError(step: string, error: string, code: number = 500) {
  return { success: false, step, error };
}

// ── Handlers with step-by-step diagnostics ──

async function sendConfirmation(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("[workshop-email] sendConfirmation: entry");
    const { workshopId, registrationId } = req.body;
    console.log("[workshop-email] sendConfirmation: body parsed", { workshopId, registrationId });
    if (!workshopId || !registrationId) {
      return res.status(400).json(stepError("validate_params", "Missing workshopId or registrationId", 400));
    }

    console.log("[workshop-email] sendConfirmation: reading registration doc");
    let regDoc, reg;
    try {
      regDoc = await getDb().collection("workshop_registrations").doc(registrationId).get();
      if (!regDoc.exists) return res.status(404).json(stepError("registration_lookup", "Registration not found", 404));
      reg = regDoc.data()!;
      console.log("[workshop-email] sendConfirmation: registration found", { email: reg.email });
    } catch (e: any) {
      return res.status(500).json(stepError("registration_lookup", e.message));
    }

    console.log("[workshop-email] sendConfirmation: reading workshop doc");
    let workshopDoc, workshop;
    try {
      workshopDoc = await getDb().collection("workshops").doc(workshopId).get();
      if (!workshopDoc.exists) return res.status(404).json(stepError("workshop_lookup", "Workshop not found", 404));
      workshop = workshopDoc.data()!;
      console.log("[workshop-email] sendConfirmation: workshop found", { title: workshop.title });
    } catch (e: any) {
      return res.status(500).json(stepError("workshop_lookup", e.message));
    }

    console.log("[workshop-email] sendConfirmation: rendering email");
    let html: string;
    try {
      html = renderConfirmationEmail({
        registrantName: reg.name || reg.email?.split("@")[0] || "Innovator",
        workshopTitle: workshop.title || "Workshop",
        workshopDescription: workshop.description || workshop.topic || "",
        host: workshop.host || "Ayush Paul",
        duration: workshop.duration || "60 min",
        date: workshop.date || "TBD",
        time: workshop.time,
        workshopStartTime: workshop.workshopStartTime,
        meetingLink: workshop.meetingLink || "",
        vaultUrl: `${APP_URL}/vault`,
      });
    } catch (e: any) {
      return res.status(500).json(stepError("render_email", e.message));
    }

    console.log("[workshop-email] sendConfirmation: calling Resend");
    const result = await sendEmail(
      reg.email,
      `✅ Confirmed: ${workshop.title || "Workshop"} — Your Spot is Reserved!`,
      html,
    );
    console.log("[workshop-email] sendConfirmation: Resend result", result);

    if (result.success) {
      try {
        await regDoc.ref.update({ confirmationSentAt: admin.firestore.FieldValue.serverTimestamp() }).catch(() => {});
      } catch (_) {}
    }

    return res.json({ success: result.success, error: result.error, step: result.success ? undefined : "resend_send" });
  } catch (err: any) {
    console.error("[workshop-email] sendConfirmation: unhandled", err);
    return res.status(500).json(stepError("unhandled", err.message));
  }
}

async function sendConfirmationAll(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("[workshop-email] sendConfirmationAll: entry");
    const { workshopId } = req.body;
    if (!workshopId) return res.status(400).json(stepError("validate_params", "Missing workshopId", 400));

    let workshop;
    try {
      const doc = await getDb().collection("workshops").doc(workshopId).get();
      if (!doc.exists) return res.status(404).json(stepError("workshop_lookup", "Workshop not found", 404));
      workshop = doc.data()!;
    } catch (e: any) {
      return res.status(500).json(stepError("workshop_lookup", e.message));
    }

    let registrationsSnap;
    try {
      registrationsSnap = await getDb().collection("workshop_registrations").where("workshopId", "==", workshopId).get();
    } catch (e: any) {
      return res.status(500).json(stepError("registrations_query", e.message));
    }

    if (registrationsSnap.empty) {
      return res.json({ success: true, notified: 0, message: "No registrations found." });
    }

    let notified = 0;
    const errors: string[] = [];

    for (const regDoc of registrationsSnap.docs) {
      const reg = regDoc.data();
      if (!reg.email) continue;
      try {
        const html = renderConfirmationEmail({
          registrantName: reg.name || reg.email?.split("@")[0] || "Innovator",
          workshopTitle: workshop.title || "Workshop",
          workshopDescription: workshop.description || workshop.topic || "",
          host: workshop.host || "Ayush Paul",
          duration: workshop.duration || "60 min",
          date: workshop.date || "TBD",
          time: workshop.time,
          workshopStartTime: workshop.workshopStartTime,
          meetingLink: workshop.meetingLink || "",
          vaultUrl: `${APP_URL}/vault`,
        });
        const result = await sendEmail(reg.email, `✅ Confirmed: ${workshop.title || "Workshop"} — Your Spot is Reserved!`, html);
        if (result.success) { notified++; await regDoc.ref.update({ confirmationSentAt: admin.firestore.FieldValue.serverTimestamp() }).catch(() => {}); }
        else { errors.push(`${reg.email}: ${result.error}`); }
      } catch (e: any) { errors.push(`${reg.email}: ${e.message}`); }
    }

    return res.json({ success: true, notified, total: registrationsSnap.docs.length, errors: errors.length > 0 ? errors : undefined });
  } catch (err: any) {
    console.error("[workshop-email] sendConfirmationAll: unhandled", err);
    return res.status(500).json(stepError("unhandled", err.message));
  }
}

async function sendReminder(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("[workshop-email] sendReminder: entry");
    const { workshopId, reminderType } = req.body;
    if (!workshopId || !reminderType) return res.status(400).json(stepError("validate_params", "Missing workshopId or reminderType", 400));
    if (!['24h', '1h', '5m'].includes(reminderType)) return res.status(400).json(stepError("validate_params", "Invalid reminderType", 400));

    let workshop;
    try {
      const doc = await getDb().collection("workshops").doc(workshopId).get();
      if (!doc.exists) return res.status(404).json(stepError("workshop_lookup", "Workshop not found", 404));
      workshop = doc.data()!;
    } catch (e: any) {
      return res.status(500).json(stepError("workshop_lookup", e.message));
    }

    if (!workshop.meetingLink) return res.status(400).json(stepError("validate_meeting", "No meeting link", 400));

    let registrationsSnap;
    try {
      registrationsSnap = await getDb().collection("workshop_registrations").where("workshopId", "==", workshopId).get();
    } catch (e: any) {
      return res.status(500).json(stepError("registrations_query", e.message));
    }

    if (registrationsSnap.empty) return res.json({ success: true, notified: 0, message: "No registrations found." });

    let notified = 0;
    const errors: string[] = [];
    for (const regDoc of registrationsSnap.docs) {
      const reg = regDoc.data();
      if (!reg.email) continue;
      try {
        const html = renderReminderEmail({
          registrantName: reg.name || reg.email?.split("@")[0] || "Innovator",
          workshopTitle: workshop.title || "Workshop", workshopTopic: workshop.topic,
          meetingLink: workshop.meetingLink, meetingPassword: workshop.meetingPassword, meetingId: workshop.meetingId,
          date: workshop.date || "TBD", time: workshop.time, workshopStartTime: workshop.workshopStartTime,
          vaultUrl: `${APP_URL}/vault`, reminderType: reminderType as ReminderType,
        });
        const subject = `⏰ ${reminderType === '5m' ? 'Starting Soon' : reminderType === '1h' ? '1 Hour to Go' : 'Tomorrow'}: ${workshop.title || "Workshop"}`;
        const result = await sendEmail(reg.email, subject, html);
        if (result.success) {
          notified++;
          const existing = reg.remindersSent || '';
          await regDoc.ref.update({ notifiedAt: admin.firestore.FieldValue.serverTimestamp(), remindersSent: existing ? `${existing},${reminderType}` : reminderType }).catch(() => {});
        } else { errors.push(`${reg.email}: ${result.error}`); }
      } catch (e: any) { errors.push(`${reg.email}: ${e.message}`); }
    }
    return res.json({ success: true, notified, total: registrationsSnap.docs.length, errors: errors.length > 0 ? errors : undefined });
  } catch (err: any) {
    console.error("[workshop-email] sendReminder: unhandled", err);
    return res.status(500).json(stepError("unhandled", err.message));
  }
}

async function sendLiveNotification(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("[workshop-email] sendLiveNotification: entry");
    const { workshopId } = req.body;
    if (!workshopId) return res.status(400).json(stepError("validate_params", "Missing workshopId", 400));

    let workshop;
    try {
      const doc = await getDb().collection("workshops").doc(workshopId).get();
      if (!doc.exists) return res.status(404).json(stepError("workshop_lookup", "Workshop not found", 404));
      workshop = doc.data()!;
    } catch (e: any) {
      return res.status(500).json(stepError("workshop_lookup", e.message));
    }
    if (!workshop.meetingLink) return res.status(400).json(stepError("validate_meeting", "No meeting link", 400));

    let registrationsSnap;
    try {
      registrationsSnap = await getDb().collection("workshop_registrations").where("workshopId", "==", workshopId).get();
    } catch (e: any) {
      return res.status(500).json(stepError("registrations_query", e.message));
    }
    if (registrationsSnap.empty) return res.json({ success: true, notified: 0, message: "No registrations found." });

    let notified = 0;
    const errors: string[] = [];
    for (const regDoc of registrationsSnap.docs) {
      const reg = regDoc.data();
      if (!reg.email) continue;
      try {
        const html = renderLiveNotification({
          registrantName: reg.name || reg.email?.split("@")[0] || "Innovator",
          workshopTitle: workshop.title || "Workshop", workshopTopic: workshop.topic,
          meetingLink: workshop.meetingLink, meetingPassword: workshop.meetingPassword,
          workshopStartTime: workshop.workshopStartTime, date: workshop.date || "TBD", time: workshop.time, vaultUrl: `${APP_URL}/vault`,
        });
        const result = await sendEmail(reg.email, `🎥 LIVE Now: ${workshop.title || "Workshop"} — Join Us!`, html);
        if (result.success) { notified++; await regDoc.ref.update({ notifiedAt: admin.firestore.FieldValue.serverTimestamp() }).catch(() => {}); }
        else { errors.push(`${reg.email}: ${result.error}`); }
      } catch (e: any) { errors.push(`${reg.email}: ${e.message}`); }
    }
    return res.json({ success: true, notified, total: registrationsSnap.docs.length, errors: errors.length > 0 ? errors : undefined });
  } catch (err: any) {
    console.error("[workshop-email] sendLiveNotification: unhandled", err);
    return res.status(500).json(stepError("unhandled", err.message));
  }
}

async function sendRecordingAvailable(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("[workshop-email] sendRecordingAvailable: entry");
    const { workshopId } = req.body;
    if (!workshopId) return res.status(400).json(stepError("validate_params", "Missing workshopId", 400));

    let workshop;
    try { const doc = await getDb().collection("workshops").doc(workshopId).get(); if (!doc.exists) return res.status(404).json(stepError("workshop_lookup", "Workshop not found", 404)); workshop = doc.data()!; } catch (e: any) { return res.status(500).json(stepError("workshop_lookup", e.message)); }

    let registrationsSnap;
    try { registrationsSnap = await getDb().collection("workshop_registrations").where("workshopId", "==", workshopId).get(); } catch (e: any) { return res.status(500).json(stepError("registrations_query", e.message)); }
    if (registrationsSnap.empty) return res.json({ success: true, notified: 0 });

    let notified = 0;
    const errors: string[] = [];
    for (const regDoc of registrationsSnap.docs) {
      const reg = regDoc.data();
      if (!reg.email) continue;
      try {
        const html = renderRecordingAvailable({ registrantName: reg.name || reg.email?.split("@")[0] || "Innovator", workshopTitle: workshop.title || "Workshop", workshopTopic: workshop.topic, recordingUrl: workshop.recordingUrl, vaultUrl: `${APP_URL}/vault` });
        const result = await sendEmail(reg.email, `📹 Recording Available: ${workshop.title || "Workshop"} — Watch the Replay`, html);
        if (result.success) { notified++; await regDoc.ref.update({ notifiedAt: admin.firestore.FieldValue.serverTimestamp() }).catch(() => {}); } else { errors.push(`${reg.email}: ${result.error}`); }
      } catch (e: any) { errors.push(`${reg.email}: ${e.message}`); }
    }
    return res.json({ success: true, notified, total: registrationsSnap.docs.length, errors: errors.length > 0 ? errors : undefined });
  } catch (err: any) {
    console.error("[workshop-email] sendRecordingAvailable: unhandled", err);
    return res.status(500).json(stepError("unhandled", err.message));
  }
}

async function sendCancellationNotice(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("[workshop-email] sendCancellationNotice: entry");
    const { workshopId } = req.body;
    if (!workshopId) return res.status(400).json(stepError("validate_params", "Missing workshopId", 400));

    let workshop;
    try { const doc = await getDb().collection("workshops").doc(workshopId).get(); if (!doc.exists) return res.status(404).json(stepError("workshop_lookup", "Workshop not found", 404)); workshop = doc.data()!; } catch (e: any) { return res.status(500).json(stepError("workshop_lookup", e.message)); }

    let registrationsSnap;
    try { registrationsSnap = await getDb().collection("workshop_registrations").where("workshopId", "==", workshopId).get(); } catch (e: any) { return res.status(500).json(stepError("registrations_query", e.message)); }
    if (registrationsSnap.empty) return res.json({ success: true, notified: 0 });

    let notified = 0;
    const errors: string[] = [];
    for (const regDoc of registrationsSnap.docs) {
      const reg = regDoc.data();
      if (!reg.email) continue;
      try {
        const html = renderCancellationNotice({ registrantName: reg.name || reg.email?.split("@")[0] || "Innovator", workshopTitle: workshop.title || "Workshop", workshopTopic: workshop.topic, date: workshop.date || "TBD", vaultUrl: `${APP_URL}/vault` });
        const result = await sendEmail(reg.email, `❌ Cancelled: ${workshop.title || "Workshop"} — Session Update`, html);
        if (result.success) { notified++; await regDoc.ref.update({ notifiedAt: admin.firestore.FieldValue.serverTimestamp() }).catch(() => {}); } else { errors.push(`${reg.email}: ${result.error}`); }
      } catch (e: any) { errors.push(`${reg.email}: ${e.message}`); }
    }
    return res.json({ success: true, notified, total: registrationsSnap.docs.length, errors: errors.length > 0 ? errors : undefined });
  } catch (err: any) {
    console.error("[workshop-email] sendCancellationNotice: unhandled", err);
    return res.status(500).json(stepError("unhandled", err.message));
  }
}

// ── Router ──

const HANDLERS: Record<string, (req: VercelRequest, res: VercelResponse) => Promise<any>> = {
  "send-confirmation": sendConfirmation,
  "send-confirmation-all": sendConfirmationAll,
  "send-reminder": sendReminder,
  "send-live-notification": sendLiveNotification,
  "send-recording": sendRecordingAvailable,
  "send-cancellation": sendCancellationNotice,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  console.log("[workshop-email] handler: entry method=", req.method, "action=", req.body?.action);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const action = req.body?.action;
  const handlerFn = HANDLERS[action as string];

  if (!handlerFn) {
    return res.status(400).json(stepError("unknown_action", `Unknown action: ${action}`));
  }

  try {
    return await handlerFn(req, res);
  } catch (err: any) {
    console.error("[workshop-email] handler: unhandled", err);
    return res.status(500).json(stepError("handler_crash", err.message));
  }
}
