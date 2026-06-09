import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { renderWorkshopLiveNotification } from "./emails/WorkshopLiveNotification";
import { sendEmail } from "./lib/email";

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

async function handleSendLiveNotification(req: VercelRequest, res: VercelResponse) {
  const { workshopId } = req.body;

  if (!workshopId) {
    return res.status(400).json({ error: "Missing workshopId" });
  }

  try {
    // Fetch the workshop document
    const workshopDoc = await db.collection("workshops").doc(workshopId).get();
    if (!workshopDoc.exists) {
      return res.status(404).json({ error: "Workshop not found" });
    }

    const workshop = workshopDoc.data()!;
    if (workshop.workshopStatus !== "LIVE") {
      return res.status(400).json({ error: "Workshop is not LIVE. Set workshopStatus to LIVE first." });
    }

    if (!workshop.meetingLink) {
      return res.status(400).json({ error: "Workshop has no meeting link. Add a meetingLink first." });
    }

    // Fetch all registrations for this workshop
    const registrationsSnap = await db
      .collection("workshop_registrations")
      .where("workshopId", "==", workshopId)
      .get();

    if (registrationsSnap.empty) {
      return res.status(200).json({ success: true, notified: 0, message: "No registrations found." });
    }

    const vaultUrl = process.env.APP_URL || "https://ayushpaul.vercel.app";
    let notified = 0;
    const errors: string[] = [];

    for (const regDoc of registrationsSnap.docs) {
      const reg = regDoc.data();
      const recipientEmail = reg.email;
      const recipientName = reg.name || reg.email?.split("@")[0] || "Innovator";

      if (!recipientEmail) continue;

      try {
        const html = renderWorkshopLiveNotification({
          registrantName: recipientName,
          workshopTitle: workshop.title || workshop.name || "Workshop",
          workshopTopic: workshop.topic,
          meetingLink: workshop.meetingLink,
          meetingPassword: workshop.meetingPassword,
          workshopStartTime: workshop.workshopStartTime,
          date: workshop.date || "TBD",
          time: workshop.time,
          vaultUrl: `${vaultUrl}/vault`,
        });

        const result = await sendEmail({
          to: recipientEmail,
          subject: `🎥 LIVE Now: ${workshop.title || "Workshop"} — Join Us!`,
          html,
        });

        if (result.success) {
          notified++;
          // Update notifiedAt timestamp on the registration
          await regDoc.ref.update({
            notifiedAt: admin.firestore.FieldValue.serverTimestamp(),
          }).catch(() => {});
        } else {
          errors.push(`${recipientEmail}: ${result.error}`);
        }
      } catch (regErr: any) {
        errors.push(`${recipientEmail}: ${regErr.message}`);
      }
    }

    // Update workshop lastNotifiedAt
    await workshopDoc.ref.update({
      lastNotifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    }).catch(() => {});

    console.log(`[WorkshopNotify] ${notified}/${registrationsSnap.docs.length} notified for workshop "${workshopId}"`);

    return res.status(200).json({
      success: true,
      notified,
      total: registrationsSnap.docs.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    console.error("[WorkshopNotify] Error:", err.message);
    return res.status(500).json({ error: err.message || "Failed to send notifications" });
  }
}

const HANDLERS: Record<string, (req: VercelRequest, res: VercelResponse) => Promise<any>> = {
  "send-live-notification": handleSendLiveNotification,
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
