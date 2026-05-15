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

const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "(default)";
const db = getFirestore(admin.app(), dbId);

async function fixProducts() {
  console.log(`--- STRIPE PRODUCT FIX (Database: ${dbId}) ---`);
  
  const productsRef = db.collection("products");
  const snapshot = await productsRef.get();
  
  if (snapshot.empty) {
    console.log("No products found.");
    return;
  }

  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    // Check if it's the Ayu-Boat or any product that should be premium
    if (data.slug === 'ayu-boat-blueprint' || data.basePrice > 0) {
      console.log(`Updating ${data.title}...`);
      
      await productsRef.doc(doc.id).update({
        type: 'premium', // Ensure it's not 'free'
        stripePriceId: data.stripePriceId || 'price_1TIilMCrlf5LZT5FZxK6H6Z8', // Example/Placeholder - User should replace with real one
        currency: 'inr'
      });
      
      console.log(`✅ Fixed: ${data.title}`);
    }
  }
  
  console.log("--- FIX COMPLETE ---");
}

fixProducts().catch(console.error);
