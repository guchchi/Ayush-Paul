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

async function grantAccess() {
  const userIds = [
    'qYjlH9timxSyc4ir34w2WwUEv8J3', // machlatodiwal@gmail.com
    '80OJfcmVXCRNmSZuthVU68K6vJq2'  // Admin / Other
  ];
  const productId = 'ayu-boat-blueprint';

  console.log(`Granting 'premium' access for '${productId}' to users...`);

  for (const uid of userIds) {
    await db.collection('users').doc(uid).set({
      ownedProducts: {
        [productId]: 'premium'
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(`✅ Granted access to user: ${uid}`);
  }
}

grantAccess().catch(console.error);
