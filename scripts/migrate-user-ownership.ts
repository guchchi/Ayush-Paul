import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

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

const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a";
const db = getFirestore(admin.app(), dbId);

async function migrateUserOwnership() {
  console.log(`--- USER OWNERSHIP MIGRATION (Database: ${dbId}) ---`);
  
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();
  
  if (snapshot.empty) {
    console.log("No users found.");
    return;
  }

  console.log(`Found ${snapshot.size} users. Starting migration...`);

  const batch = db.batch();
  let count = 0;

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const purchasedProducts = data.purchasedProducts || [];
    
    // Convert array to map
    const ownedProducts: { [id: string]: string } = data.ownedProducts || {};
    
    purchasedProducts.forEach((id: string) => {
      // If not already in map, add as premium (safer default for legacy data)
      if (!ownedProducts[id]) {
        ownedProducts[id] = "premium";
      }
    });

    batch.set(doc.ref, {
      ownedProducts,
      // We keep purchasedProducts for fallback safety during transition, but could delete later
    }, { merge: true });

    count++;
  });

  await batch.commit();
  console.log(`✅ Successfully migrated ${count} users to ownedProducts map.`);
  console.log("--- MIGRATION COMPLETE ---");
}

migrateUserOwnership().catch(console.error);
