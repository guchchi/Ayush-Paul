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

async function migrateProducts() {
  console.log(`--- PRODUCT MIGRATION & CLEANUP (Database: ${dbId}) ---`);
  
  const productsRef = db.collection("products");
  
  // 1. Create/Update the REAL product
  const realProduct = {
    title: "Ayu-Boat: Autonomous Water Drone Blueprint",
    slug: "ayu-boat-blueprint",
    type: "premium",
    basePrice: 49,
    salePrice: 29, // Added a sale price for conversion
    currency: "inr",
    stripePriceId: "price_1TIilMCrlf5LZT5FZxK6H6Z8", // PLACEHOLDER: User should update this
    downloadFileURL: "https://ayushpaul.in/downloads/ayu-boat-free.zip", // Added for free download
    category: "Robotics",
    description: "Full engineering blueprints for the Ayu-Boat autonomous water drone. Includes CAD, source code, and assembly guide.",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
    features: [
      "Full CAD Models (STEP/STL)",
      "Autonomous Navigation Source Code",
      "Assembly & Calibration Guide",
      "Bill of Materials (BOM)"
    ],
    comparisonFree: [
      "Basic Source Code",
      "PDF Assembly Guide"
    ],
    comparisonPremium: [
      "Standard CAD Files",
      "Advanced AI Navigation Code",
      "1-on-1 Video Consultation",
      "Lifetime Updates",
      "Commercial License"
    ],
    isPublished: true,
    downloadCount: 150,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    author: {
      name: "Ayush Paul",
      avatar: "/founder.png"
    }
  };

  console.log("Upserting premium product...");
  await productsRef.doc("ayu-boat-blueprint").set(realProduct, { merge: true });
  console.log("✅ Created/Updated: ayu-boat-blueprint");

  // 2. Delete legacy test product
  console.log("Checking for legacy test products...");
  const testDoc = await productsRef.doc("ayu-boat-test").get();
  if (testDoc.exists) {
    await productsRef.doc("ayu-boat-test").delete();
    console.log("🗑️ Deleted legacy test product: ayu-boat-test");
  }

  console.log("--- MIGRATION COMPLETE ---");
}

migrateProducts().catch(console.error);
