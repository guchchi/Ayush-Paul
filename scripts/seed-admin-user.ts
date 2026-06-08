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

const ADMIN_UID = "80OJfcmVXCRNmSZuthVU68K6vJq2";
const ADMIN_EMAIL = "ap8779370@gmail.com";

async function main() {
  try {
    await db.collection("admin_users").doc(ADMIN_UID).set({
      uid: ADMIN_UID,
      email: ADMIN_EMAIL,
      displayName: "Ayush Paul",
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
