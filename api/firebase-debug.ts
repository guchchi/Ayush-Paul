import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

function getAdminProjectId(): string | null {
  try {
    const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!sa) return null;
    const parsed = JSON.parse(sa);
    return parsed.project_id || null;
  } catch {
    return null;
  }
}

function getDb() {
  if (!admin.apps.length) {
    try {
      const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!sa) throw new Error("FIREBASE_SERVICE_ACCOUNT env var not set");
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(sa)) });
    } catch (e: any) {
      return { error: e.message };
    }
  }
  if (!admin.apps.length) return { error: "Firebase app not available" };
  const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a";
  return { db: getFirestore(admin.app(), dbId), dbId };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");

  // Disable completely in production
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ error: "Not Found" });
  }

  // Require DEBUG_API_KEY in dev
  const debugKey = process.env.DEBUG_API_KEY;
  const incomingKey = req.headers["x-api-key"] || req.query?.key;
  if (!debugKey || incomingKey !== debugKey) {
    return res.status(403).json({ error: "Access Denied" });
  }

  const saProjectId = getAdminProjectId();
  const resolvedDbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a";
  const clientEnvProjectId = process.env.VITE_FIREBASE_PROJECT_ID || "(not set in Vercel)";

  const result: Record<string, any> = {
    clientExpectedProject: clientEnvProjectId,
    adminProject: saProjectId,
    firestoreDatabase: resolvedDbId,
    serviceAccountProject: saProjectId,
    firebaseServiceAccountSet: !!process.env.FIREBASE_SERVICE_ACCOUNT,
    viteFirebaseProjectIdSet: !!process.env.VITE_FIREBASE_PROJECT_ID,
    viteFirestoreDbIdSet: !!process.env.VITE_FIREBASE_FIRESTORE_DB_ID,
  };

  const dbResult = getDb();
  if (dbResult.error) {
    result.adminError = dbResult.error;
    return res.json(result);
  }

  const { db } = dbResult as { db: FirebaseFirestore.Firestore; dbId: string };

  try {
    const snap = await db.collection("workshop_registrations").limit(10).get();
    result.registrationsCount = snap.size;
    result.firstFiveDocs = snap.docs.slice(0, 5).map(d => ({
      id: d.id,
      workshopId: d.data().workshopId || null,
      email: d.data().email || null,
      name: d.data().name || null,
    }));
  } catch (e: any) {
    result.registrationsError = e.message;
  }

  try {
    const wsSnap = await db.collection("workshops").limit(3).get();
    result.workshopsCount = wsSnap.size;
    result.firstThreeWorkshops = wsSnap.docs.slice(0, 3).map(d => ({
      id: d.id,
      title: d.data().title || null,
    }));
  } catch (e: any) {
    result.workshopsError = e.message;
  }

  if (saProjectId && clientEnvProjectId && saProjectId !== clientEnvProjectId) {
    result.mismatch = true;
    result.mismatchDetail = `Admin SDK uses project "${saProjectId}" from FIREBASE_SERVICE_ACCOUNT, but client expects "${clientEnvProjectId}" from VITE_FIREBASE_PROJECT_ID`;
  }

  return res.json(result);
}
