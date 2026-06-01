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

const OLD_DB_ID = "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a";

const oldDb = getFirestore(admin.app(), OLD_DB_ID);
const newDb = getFirestore(admin.app()); // Default database

async function syncDatabases() {
  console.log("--- DATABASE SYNC: CROSS-DB RECONCILIATION ---");
  
  // 1. Find all users in OLD database who have ownedProducts
  const oldUsers = await oldDb.collection("users").get();
  console.log(`Found ${oldUsers.size} users in OLD database.`);

  for (const userDoc of oldUsers.docs) {
    try {
      const data = userDoc.data();
      const ownedProducts = data.ownedProducts || {};
      
      if (Object.keys(ownedProducts).length > 0) {
        console.log(`Syncing user ${userDoc.id} (${data.email || 'no email'})...`);
        
        // Grant these to the user in the NEW database
        await newDb.collection("users").doc(userDoc.id).set({
          ownedProducts,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log(`✅ Synced ${Object.keys(ownedProducts).length} products for ${userDoc.id}`);
      }
    } catch (e: any) {
      console.error(`❌ Failed to sync user ${userDoc.id}:`, e.message);
    }
  }

  // 2. Also check 'purchases' collection
  try {
    const oldPurchases = await oldDb.collection("purchases").get();
    console.log(`Found ${oldPurchases.size} purchases in OLD database.`);

    for (const purchaseDoc of oldPurchases.docs) {
      try {
        const pData = purchaseDoc.data();
        console.log(`Syncing purchase ${purchaseDoc.id} for user ${pData.userId}...`);
        
        await newDb.collection("purchases").doc(purchaseDoc.id).set(pData);
        
        // Also ensure the user gets access in new DB if not already
        await newDb.collection("users").doc(pData.userId).set({
          ownedProducts: {
            [pData.productId]: "premium"
          }
        }, { merge: true });
        console.log(`✅ Synced purchase ${purchaseDoc.id}`);
      } catch (e: any) {
        console.error(`❌ Failed to sync purchase ${purchaseDoc.id}:`, e.message);
      }
    }
  } catch (e: any) {
    console.error("❌ Failed to fetch old purchases:", e.message);
  }

  console.log("--- SYNC COMPLETE ---");
}

syncDatabases().catch(console.error);
