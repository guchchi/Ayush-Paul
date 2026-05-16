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

const dbId = "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a";
const db = getFirestore(admin.app(), dbId);

async function listSubscribers() {
  console.log(`Listing subscribers in database: ${dbId}`);
  
  const snapshot = await db.collection("subscribers").get();
  
  if (snapshot.empty) {
    console.log("No subscribers found.");
    return;
  }

  snapshot.docs.forEach(doc => {
    console.log(`- ${doc.data().email} (ID: ${doc.id})`);
  });
}

listSubscribers().catch(console.error);
