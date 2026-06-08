import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ valid: false, error: "Missing or invalid code" });
  }

  try {
    const normalized = code.trim().toUpperCase();
    const docRef = db.collection('creator_codes').doc(normalized);
    const snap = await docRef.get();

    if (!snap.exists) {
      return res.status(200).json({ valid: false, error: "Code not found" });
    }

    const data = snap.data()!;

    if (!data.isActive) {
      return res.status(200).json({ valid: false, error: "Code is deactivated" });
    }

    return res.status(200).json({
      valid: true,
      creatorName: data.creatorName,
      commissionRate: data.commissionRate,
      code: normalized,
    });
  } catch (error: any) {
    console.error("Creator code validation error:", error);
    return res.status(500).json({ valid: false, error: "Validation failed" });
  }
}
