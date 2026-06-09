import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { sendEmail } from "./lib/email";
import { renderWorkshopRegistrationConfirmation } from "./emails/WorkshopRegistrationConfirmation";
import { renderWorkshopReminderEmail } from "./emails/WorkshopReminderEmail";
import { renderWorkshopLiveNotification } from "./emails/WorkshopLiveNotification";
import { renderWorkshopRecordingAvailable } from "./emails/WorkshopRecordingAvailable";
import { renderWorkshopCancellationNotice } from "./emails/WorkshopCancellationNotice";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')),
    });
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
  }
}

const db = getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a");

const APP_URL = process.env.APP_URL || "https://ayushpaul.vercel.app";

async function sendConfirmation(req: VercelRequest, res: VercelResponse) {
  const { workshopId, registrationId } = req.body;
  if (!workshopId || !registrationId) {
    return res.status(400).json({ error: "Missing workshopId or registrationId" });
  }

  const regDoc = await db.collection("workshop_registrations").doc(registrationId).get();
  if (!regDoc.exists) return res.status(404).json({ error: "Registration not found" });
  const reg = regDoc.data()!;

  const workshopDoc = await db.collection("workshops").doc(workshopId).get();
  if (!workshopDoc.exists) return res.status(404).json({ error: "Workshop not found" });
  const workshop = workshopDoc.data()!;

  const html = renderWorkshopRegistrationConfirmation({
    registrantName: reg.name || reg.email?.split("@")[0] || "Innovator",
    workshopTitle: workshop.title || "Workshop",
    workshopTopic: workshop.topic,
    date: workshop.date || "TBD",
    time: workshop.time,
    workshopStartTime: workshop.workshopStartTime,
    vaultUrl: `${APP_URL}/vault`,
  });

  const result = await sendEmail({
    to: reg.email,
    subject: `✅ Confirmed: ${workshop.title || "Workshop"} — Your Spot is Reserved!`,
    html,
  });

  if (result.success) {
    await regDoc.ref.update({
      confirmationSentAt: admin.firestore.FieldValue.serverTimestamp(),
    }).catch(() => {});
  }

  return res.json({ success: result.success, error: result.error });
}

async function sendReminder(req: VercelRequest, res: VercelResponse) {
  const { workshopId, reminderType } = req.body;
  if (!workshopId || !reminderType) {
    return res.status(400).json({ error: "Missing workshopId or reminderType" });
  }
  if (!['24h', '1h', '5m'].includes(reminderType)) {
    return res.status(400).json({ error: "Invalid reminderType. Use: 24h, 1h, or 5m" });
  }

  const workshopDoc = await db.collection("workshops").doc(workshopId).get();
  if (!workshopDoc.exists) return res.status(404).json({ error: "Workshop not found" });
  const workshop = workshopDoc.data()!;

  if (!workshop.meetingLink) {
    return res.status(400).json({ error: "Workshop has no meeting link." });
  }

  const registrationsSnap = await db
    .collection("workshop_registrations")
    .where("workshopId", "==", workshopId)
    .get();

  if (registrationsSnap.empty) {
    return res.json({ success: true, notified: 0, message: "No registrations found." });
  }

  let notified = 0;
  const errors: string[] = [];

  for (const regDoc of registrationsSnap.docs) {
    const reg = regDoc.data();
    if (!reg.email) continue;

    try {
      const html = renderWorkshopReminderEmail({
        registrantName: reg.name || reg.email?.split("@")[0] || "Innovator",
        workshopTitle: workshop.title || "Workshop",
        workshopTopic: workshop.topic,
        meetingLink: workshop.meetingLink,
        meetingPassword: workshop.meetingPassword,
        meetingId: workshop.meetingId,
        date: workshop.date || "TBD",
        time: workshop.time,
        workshopStartTime: workshop.workshopStartTime,
        vaultUrl: `${APP_URL}/vault`,
        reminderType: reminderType as any,
      });

      const result = await sendEmail({
        to: reg.email,
        subject: `⏰ ${reminderType === '5m' ? 'Starting Soon' : reminderType === '1h' ? '1 Hour to Go' : 'Tomorrow'}: ${workshop.title || "Workshop"}`,
        html,
      });

      if (result.success) {
        notified++;
        const existing = reg.remindersSent || '';
        const updated = existing ? `${existing},${reminderType}` : reminderType;
        await regDoc.ref.update({
          notifiedAt: admin.firestore.FieldValue.serverTimestamp(),
          remindersSent: updated,
        }).catch(() => {});
      } else {
        errors.push(`${reg.email}: ${result.error}`);
      }
    } catch (err: any) {
      errors.push(`${reg.email}: ${err.message}`);
    }
  }

  return res.json({
    success: true,
    notified,
    total: registrationsSnap.docs.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}

async function sendLiveNotification(req: VercelRequest, res: VercelResponse) {
  const { workshopId } = req.body;
  if (!workshopId) return res.status(400).json({ error: "Missing workshopId" });

  const workshopDoc = await db.collection("workshops").doc(workshopId).get();
  if (!workshopDoc.exists) return res.status(404).json({ error: "Workshop not found" });
  const workshop = workshopDoc.data()!;

  if (!workshop.meetingLink) {
    return res.status(400).json({ error: "Workshop has no meeting link." });
  }

  const registrationsSnap = await db
    .collection("workshop_registrations")
    .where("workshopId", "==", workshopId)
    .get();

  if (registrationsSnap.empty) {
    return res.json({ success: true, notified: 0, message: "No registrations found." });
  }

  let notified = 0;
  const errors: string[] = [];

  for (const regDoc of registrationsSnap.docs) {
    const reg = regDoc.data();
    if (!reg.email) continue;

    try {
      const html = renderWorkshopLiveNotification({
        registrantName: reg.name || reg.email?.split("@")[0] || "Innovator",
        workshopTitle: workshop.title || "Workshop",
        workshopTopic: workshop.topic,
        meetingLink: workshop.meetingLink,
        meetingPassword: workshop.meetingPassword,
        workshopStartTime: workshop.workshopStartTime,
        date: workshop.date || "TBD",
        time: workshop.time,
        vaultUrl: `${APP_URL}/vault`,
      });

      const result = await sendEmail({
        to: reg.email,
        subject: `🎥 LIVE Now: ${workshop.title || "Workshop"} — Join Us!`,
        html,
      });

      if (result.success) {
        notified++;
        await regDoc.ref.update({
          notifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        }).catch(() => {});
      } else {
        errors.push(`${reg.email}: ${result.error}`);
      }
    } catch (err: any) {
      errors.push(`${reg.email}: ${err.message}`);
    }
  }

  return res.json({
    success: true,
    notified,
    total: registrationsSnap.docs.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}

async function sendRecordingAvailable(req: VercelRequest, res: VercelResponse) {
  const { workshopId } = req.body;
  if (!workshopId) return res.status(400).json({ error: "Missing workshopId" });

  const workshopDoc = await db.collection("workshops").doc(workshopId).get();
  if (!workshopDoc.exists) return res.status(404).json({ error: "Workshop not found" });
  const workshop = workshopDoc.data()!;

  const registrationsSnap = await db
    .collection("workshop_registrations")
    .where("workshopId", "==", workshopId)
    .get();

  if (registrationsSnap.empty) {
    return res.json({ success: true, notified: 0, message: "No registrations found." });
  }

  let notified = 0;
  const errors: string[] = [];

  for (const regDoc of registrationsSnap.docs) {
    const reg = regDoc.data();
    if (!reg.email) continue;

    try {
      const html = renderWorkshopRecordingAvailable({
        registrantName: reg.name || reg.email?.split("@")[0] || "Innovator",
        workshopTitle: workshop.title || "Workshop",
        workshopTopic: workshop.topic,
        recordingUrl: workshop.recordingUrl,
        vaultUrl: `${APP_URL}/vault`,
      });

      const result = await sendEmail({
        to: reg.email,
        subject: `📹 Recording Available: ${workshop.title || "Workshop"} — Watch the Replay`,
        html,
      });

      if (result.success) {
        notified++;
        await regDoc.ref.update({
          notifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        }).catch(() => {});
      } else {
        errors.push(`${reg.email}: ${result.error}`);
      }
    } catch (err: any) {
      errors.push(`${reg.email}: ${err.message}`);
    }
  }

  return res.json({
    success: true,
    notified,
    total: registrationsSnap.docs.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}

async function sendCancellationNotice(req: VercelRequest, res: VercelResponse) {
  const { workshopId } = req.body;
  if (!workshopId) return res.status(400).json({ error: "Missing workshopId" });

  const workshopDoc = await db.collection("workshops").doc(workshopId).get();
  if (!workshopDoc.exists) return res.status(404).json({ error: "Workshop not found" });
  const workshop = workshopDoc.data()!;

  const registrationsSnap = await db
    .collection("workshop_registrations")
    .where("workshopId", "==", workshopId)
    .get();

  if (registrationsSnap.empty) {
    return res.json({ success: true, notified: 0, message: "No registrations found." });
  }

  let notified = 0;
  const errors: string[] = [];

  for (const regDoc of registrationsSnap.docs) {
    const reg = regDoc.data();
    if (!reg.email) continue;

    try {
      const html = renderWorkshopCancellationNotice({
        registrantName: reg.name || reg.email?.split("@")[0] || "Innovator",
        workshopTitle: workshop.title || "Workshop",
        workshopTopic: workshop.topic,
        date: workshop.date || "TBD",
        vaultUrl: `${APP_URL}/vault`,
      });

      const result = await sendEmail({
        to: reg.email,
        subject: `❌ Cancelled: ${workshop.title || "Workshop"} — Session Update`,
        html,
      });

      if (result.success) {
        notified++;
        await regDoc.ref.update({
          notifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        }).catch(() => {});
      } else {
        errors.push(`${reg.email}: ${result.error}`);
      }
    } catch (err: any) {
      errors.push(`${reg.email}: ${err.message}`);
    }
  }

  return res.json({
    success: true,
    notified,
    total: registrationsSnap.docs.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}

const HANDLERS: Record<string, (req: VercelRequest, res: VercelResponse) => Promise<any>> = {
  "send-confirmation": sendConfirmation,
  "send-reminder": sendReminder,
  "send-live-notification": sendLiveNotification,
  "send-recording": sendRecordingAvailable,
  "send-cancellation": sendCancellationNotice,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const action = req.body?.action;
  const handlerFn = HANDLERS[action as string];

  if (!handlerFn) {
    return res.status(400).json({ error: `Unknown action: ${action}. Available: ${Object.keys(HANDLERS).join(', ')}` });
  }

  return handlerFn(req, res);
}
