import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });
dotenv.config();

const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
let credential;

if (fs.existsSync(serviceAccountPath)) {
  credential = admin.credential.cert(serviceAccountPath);
} else {
  credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}'));
}

if (!admin.apps.length) {
  admin.initializeApp({ credential });
}

const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a";
const db = getFirestore(admin.app(), dbId);

const ADMIN_UID = process.argv[2] || process.env.ADMIN_UID;
const ADMIN_EMAIL = process.argv[3] || process.env.ADMIN_EMAIL;
const DISPLAY_NAME = process.argv[4] || process.env.ADMIN_DISPLAY_NAME || "System Admin";

async function main() {
  if (!ADMIN_UID || !ADMIN_EMAIL) {
    console.error("⚠️  Usage: npx tsx scripts/seed-admin-user.ts <ADMIN_UID> <ADMIN_EMAIL> [DISPLAY_NAME]");
    console.error("    or set ADMIN_UID and ADMIN_EMAIL environment variables.");
    process.exit(1);
  }

  try {
    await db.collection("admin_users").doc(ADMIN_UID).set({
      uid: ADMIN_UID,
      email: ADMIN_EMAIL,
      displayName: DISPLAY_NAME,
      role: "superadmin",
      addedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`admin_users/${ADMIN_UID} created successfully.`);
    process.exit(0);
  } catch (err: any) {
    console.error("Failed to create admin user:", err.message);
    process.exit(1);
  }
}

main();
