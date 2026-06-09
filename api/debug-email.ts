import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const result: Record<string, any> = {
    resendConfigured: false,
    firebaseConfigured: false,
    firestoreConnected: false,
    env: {},
    errors: [] as string[],
  };

  // 1. Check env vars
  const resendKey = process.env.RESEND_API_KEY || "";
  result.env.RESEND_API_KEY = resendKey
    ? `${resendKey.slice(0, 6)}...${resendKey.slice(-4)} (len:${resendKey.length})`
    : "NOT SET";
  result.resendConfigured = resendKey.length > 0;

  const sa = process.env.FIREBASE_SERVICE_ACCOUNT || "";
  result.env.FIREBASE_SERVICE_ACCOUNT = sa
    ? `present (len:${sa.length})`
    : "NOT SET";
  result.firebaseConfigured = sa.length > 0;

  if (sa) {
    try {
      const parsed = JSON.parse(sa);
      result.env.FIREBASE_PROJECT_ID = parsed.project_id || "NOT IN JSON";
      result.env.FIREBASE_CLIENT_EMAIL = parsed.client_email
        ? `${parsed.client_email.slice(0, 10)}...`
        : "NOT IN JSON";
      result.env.FIREBASE_PRIVATE_KEY = parsed.private_key
        ? `present (len:${parsed.private_key.length})`
        : "NOT IN JSON";
    } catch (e: any) {
      result.errors.push(`FIREBASE_SERVICE_ACCOUNT is not valid JSON: ${e.message}`);
    }
  }

  // 2. Try Firestore connection
  if (resendKey && sa) {
    try {
      const admin = require("firebase-admin");
      const { getFirestore } = require("firebase-admin/firestore");
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(sa)),
        });
      }
      const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a";
      const db = getFirestore(admin.app(), dbId);
      const testDoc = await db.collection("workshops").limit(1).get();
      result.firestoreConnected = true;
      result.env.FIRESTORE_DB_ID = dbId;
    } catch (e: any) {
      result.errors.push(`Firestore connection failed: ${e.message}`);
    }
  }

  return res.status(200).json(result);
}
