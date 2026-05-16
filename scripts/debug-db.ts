import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
let credential;

if (fs.existsSync(serviceAccountPath)) {
  credential = admin.credential.cert(serviceAccountPath);
} else {
  credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}'));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential,
  });
}

async function debugDatabase() {
  const db = getFirestore(admin.app());
  console.log("Checking default database...");
  try {
    const snap = await db.collection("users").limit(1).get();
    console.log("Successfully connected to default database. Found", snap.size, "users.");
  } catch (e: any) {
    console.error("Error connecting to default database:", e.message);
  }

  const oldDbId = "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a";
  const oldDb = getFirestore(admin.app(), oldDbId);
  console.log(`Checking old database: ${oldDbId}...`);
  try {
    const snap = await oldDb.collection("users").limit(1).get();
    console.log(`Successfully connected to ${oldDbId}. Found`, snap.size, "users.");
  } catch (e: any) {
    console.error(`Error connecting to ${oldDbId}:`, e.message);
  }
}

debugDatabase().catch(console.error);
