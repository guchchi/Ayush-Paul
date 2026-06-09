import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { sendEmail } from "./lib/email";
import { renderWorkshopRegistrationConfirmation } from "./emails/WorkshopRegistrationConfirmation";
import { renderWorkshopReminderEmail } from "./emails/WorkshopReminderEmail";
import { renderWorkshopLiveNotification } from "./emails/WorkshopLiveNotification";
import { renderWorkshopRecordingAvailable } from "./emails/WorkshopRecordingAvailable";
import { renderWorkshopCancellationNotice } from "./emails/WorkshopCancellationNotice";

function getDb() {
  if (!admin.apps.length) {
    try {
      const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!sa) throw new Error("FIREBASE_SERVICE_ACCOUNT env var not set");
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(sa)),
      });
      console.log("[workshop-email] Firebase admin initialized successfully");
    } catch (error) {
      console.error("[workshop-email] Firebase admin initialization error:", error);
    }
  }
  if (!admin.apps.length) {
    throw new Error("Firebase app not available — cannot connect to Firestore");
  }
  return getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a");
}

const APP_URL = process.env.APP_URL || "https://ayushpaul.vercel.app";

async function sendConfirmation(req: VercelRequest, res: VercelResponse) {
  try {
    const { workshopId, registrationId } = req.body;
    if (!workshopId || !registrationId) {
      return res.status(400).json({ success: false, error: "Missing workshopId or registrationId" });
    }

    const regDoc = await getDb().collection("workshop_registrations").doc(registrationId).get();
    if (!regDoc.exists) return res.status(404).json({ success: false, error: "Registration not found" });
    const reg = regDoc.data()!;

    const workshopDoc = await getDb().collection("workshops").doc(workshopId).get();
    if (!workshopDoc.exists) return res.status(404).json({ success: false, error: "Workshop not found" });
    const workshop = workshopDoc.data()!;

    const html = renderWorkshopRegistrationConfirmation({
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
  } catch (err: any) {
    console.error("[sendConfirmation] Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function sendConfirmationAll(req: VercelRequest, res: VercelResponse) {
  try {
    const { workshopId } = req.body;
    if (!workshopId) return res.status(400).json({ success: false, error: "Missing workshopId" });

    const workshopDoc = await getDb().collection("workshops").doc(workshopId).get();
    if (!workshopDoc.exists) return res.status(404).json({ success: false, error: "Workshop not found" });
    const workshop = workshopDoc.data()!;

    const registrationsSnap = await getDb().collection("workshop_registrations")
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
        const html = renderWorkshopRegistrationConfirmation({
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

        const result = await sendEmail({
          to: reg.email,
          subject: `✅ Confirmed: ${workshop.title || "Workshop"} — Your Spot is Reserved!`,
          html,
        });

        if (result.success) {
          notified++;
          await regDoc.ref.update({
            confirmationSentAt: admin.firestore.FieldValue.serverTimestamp(),
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
  } catch (err: any) {
    console.error("[sendConfirmationAll] Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function sendReminder(req: VercelRequest, res: VercelResponse) {
  try {
    const { workshopId, reminderType } = req.body;
    if (!workshopId || !reminderType) {
      return res.status(400).json({ success: false, error: "Missing workshopId or reminderType" });
    }
    if (!['24h', '1h', '5m'].includes(reminderType)) {
      return res.status(400).json({ success: false, error: "Invalid reminderType. Use: 24h, 1h, or 5m" });
    }

    const workshopDoc = await getDb().collection("workshops").doc(workshopId).get();
    if (!workshopDoc.exists) return res.status(404).json({ success: false, error: "Workshop not found" });
    const workshop = workshopDoc.data()!;

    if (!workshop.meetingLink) {
      return res.status(400).json({ success: false, error: "Workshop has no meeting link." });
    }

    const registrationsSnap = await getDb().collection("workshop_registrations")
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
  } catch (err: any) {
    console.error("[sendReminder] Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function sendLiveNotification(req: VercelRequest, res: VercelResponse) {
  try {
    const { workshopId } = req.body;
    if (!workshopId) return res.status(400).json({ success: false, error: "Missing workshopId" });

    const workshopDoc = await getDb().collection("workshops").doc(workshopId).get();
    if (!workshopDoc.exists) return res.status(404).json({ success: false, error: "Workshop not found" });
    const workshop = workshopDoc.data()!;

    if (!workshop.meetingLink) {
      return res.status(400).json({ success: false, error: "Workshop has no meeting link." });
    }

    const registrationsSnap = await getDb().collection("workshop_registrations")
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
  } catch (err: any) {
    console.error("[sendLiveNotification] Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function sendRecordingAvailable(req: VercelRequest, res: VercelResponse) {
  try {
    const { workshopId } = req.body;
    if (!workshopId) return res.status(400).json({ success: false, error: "Missing workshopId" });

    const workshopDoc = await getDb().collection("workshops").doc(workshopId).get();
    if (!workshopDoc.exists) return res.status(404).json({ success: false, error: "Workshop not found" });
    const workshop = workshopDoc.data()!;

    const registrationsSnap = await getDb().collection("workshop_registrations")
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
  } catch (err: any) {
    console.error("[sendRecordingAvailable] Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function sendCancellationNotice(req: VercelRequest, res: VercelResponse) {
  try {
    const { workshopId } = req.body;
    if (!workshopId) return res.status(400).json({ success: false, error: "Missing workshopId" });

    const workshopDoc = await getDb().collection("workshops").doc(workshopId).get();
    if (!workshopDoc.exists) return res.status(404).json({ success: false, error: "Workshop not found" });
    const workshop = workshopDoc.data()!;

    const registrationsSnap = await getDb().collection("workshop_registrations")
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
  } catch (err: any) {
    console.error("[sendCancellationNotice] Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const action = req.body?.action;
  const handlerFn = HANDLERS[action as string];

  if (!handlerFn) {
    return res.status(400).json({ error: `Unknown action: ${action}. Available: ${Object.keys(HANDLERS).join(', ')}` });
  }

  try {
    return await handlerFn(req, res);
  } catch (err: any) {
    console.error(`[workshop-email] Unhandled error in action "${action}":`, err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
}
