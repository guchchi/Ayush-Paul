import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

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

const db = getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID);

async function inspectProducts() {
  console.log("--- PRODUCT INSPECTION ---");
  
  const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "(default)";
  console.log(`Targeting Database: ${dbId}`);
  
  let db;
  try {
    db = getFirestore(admin.app(), dbId);
    const snapshot = await db.collection("products").get();
    
    if (snapshot.empty) {
      console.log("No products found in Firestore.");
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`\nID: ${doc.id}`);
      console.log(`Title: ${data.title}`);
      console.log(`Slug: ${data.slug}`);
      console.log(`Type: ${data.type}`);
      console.log(`Price: ${data.basePrice} / ${data.salePrice}`);
      console.log(`Currency: ${data.currency}`);
      console.log(`StripePriceId: ${data.stripePriceId || "MISSING"}`);
      console.log(`--------------------------`);
    });
  } catch (err: any) {
    console.error(`Error with database ${dbId}:`, err.message);
    if (dbId !== "(default)") {
      console.log("Retrying with (default) database...");
      try {
        db = getFirestore(admin.app(), "(default)");
        const snapshot = await db.collection("products").get();
        // ... same logic ...
        snapshot.forEach(doc => {
          const data = doc.data();
          console.log(`\nID: ${doc.id}`);
          console.log(`Title: ${data.title}`);
          console.log(`Slug: ${data.slug}`);
          console.log(`Type: ${data.type}`);
          console.log(`Price: ${data.basePrice} / ${data.salePrice}`);
          console.log(`Currency: ${data.currency}`);
          console.log(`StripePriceId: ${data.stripePriceId || "MISSING"}`);
          console.log(`--------------------------`);
        });
      } catch (err2: any) {
        console.error("Error with (default) database:", err2.message);
      }
    }
  }
}

inspectProducts().catch(console.error);
