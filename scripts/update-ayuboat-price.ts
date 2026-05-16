import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env local
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
  admin.initializeApp({
    credential,
  });
}

const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "(default)";
const db = getFirestore(admin.app(), dbId);

const PRODUCT_ID = "ayu-boat-blueprint";
const NEW_PRICE_ID = "price_1TXafVCrlf5LZT5FgtUkEyWa";

async function updateAyuBoatPrice() {
  console.log(`Connecting to DB: ${dbId}`);
  const productsRef = db.collection("products");
  
  const docRef = productsRef.doc(PRODUCT_ID);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    console.error(`❌ Product NOT FOUND: ${PRODUCT_ID}`);
    return;
  }

  await docRef.update({
    stripePriceId: NEW_PRICE_ID,
    price: 999, // Assuming the price might have changed as well, but usually priceId is enough for Stripe.
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log(`✅ Successfully updated StripePriceId for ${doc.data()?.title} (${PRODUCT_ID}) to ${NEW_PRICE_ID}`);
}

updateAyuBoatPrice().catch(console.error);
