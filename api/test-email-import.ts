import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const result: Record<string, any> = {
    success: false,
    steps: {},
    errors: [] as string[],
  };

  // Step 1: Verify module-level imports
  result.steps.importResend = false;
  try {
    const { Resend } = require("resend");
    result.steps.importResend = true;
    result.steps.resendType = typeof Resend;
  } catch (e: any) {
    result.errors.push(`resend import failed: ${e.message}`);
  }

  result.steps.importFirebaseAdmin = false;
  try {
    const admin = require("firebase-admin");
    result.steps.importFirebaseAdmin = true;
    result.steps.adminAppsLength = admin.apps.length;
  } catch (e: any) {
    result.errors.push(`firebase-admin import failed: ${e.message}`);
  }

  // Step 2: Check env vars
  result.env = {
    RESEND_API_KEY: process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.slice(0, 8)}...${process.env.RESEND_API_KEY.slice(-4)}` : "NOT SET",
    FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT ? `present (${process.env.FIREBASE_SERVICE_ACCOUNT.length} chars)` : "NOT SET",
    APP_URL: process.env.APP_URL || "NOT SET",
    VITE_FIREBASE_FIRESTORE_DB_ID: process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "NOT SET",
  };

  // Step 3: Test Resend initialization
  result.steps.resendInit = false;
  try {
    if (process.env.RESEND_API_KEY) {
      const { Resend } = require("resend");
      const r = new Resend(process.env.RESEND_API_KEY);
      result.steps.resendInit = true;
    } else {
      result.errors.push("RESEND_API_KEY not set, skipping Resend init test");
    }
  } catch (e: any) {
    result.errors.push(`Resend init failed: ${e.message}`);
  }

  // Step 4: Test Firebase init
  result.steps.firebaseInit = false;
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const admin = require("firebase-admin");
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
        });
      }
      result.steps.firebaseInit = true;
      result.steps.adminAppsLengthAfterInit = admin.apps.length;
    } else {
      result.errors.push("FIREBASE_SERVICE_ACCOUNT not set, skipping Firebase init test");
    }
  } catch (e: any) {
    result.errors.push(`Firebase init failed: ${e.message}`);
  }

  // Step 5: Test Firestore connection
  result.steps.firestoreConnected = false;
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const admin = require("firebase-admin");
      const { getFirestore } = require("firebase-admin/firestore");
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
        });
      }
      const db = getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a");
      const test = await db.collection("workshops").limit(1).get();
      result.steps.firestoreConnected = true;
      result.steps.firestoreDocsFound = test.docs.length;
    }
  } catch (e: any) {
    result.errors.push(`Firestore connection failed: ${e.message}`);
  }

  result.success = result.errors.length === 0;
  return res.status(200).json(result);
}
