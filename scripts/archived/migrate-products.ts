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
  admin.initializeApp({
    credential,
  });
}

const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "(default)";
const db = getFirestore(admin.app(), dbId);

async function migrateProducts() {
  console.log(`--- PRODUCT MIGRATION & CLEANUP (Database: ${dbId}) ---`);
  
  const productsRef = db.collection("products");
  
  // 1. Existing Ayu-Boat Blueprint (Preserving its exact Firestore fields)
  const ayuBoatProduct = {
    title: "Ayu-Boat: Autonomous Water Drone Blueprint",
    slug: "ayu-boat-blueprint",
    type: "premium",
    basePrice: 49,
    salePrice: 29,
    currency: "inr",
    stripePriceId: "price_1TXafVCrlf5LZT5FgtUkEyWa", // Preserved exactly from active DB
    downloadFileURL: "https://thepaulx.in/downloads/ayu-boat-free.zip",
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

  // 2. New IOBot Companion Robot Blueprint (Stage-1 Realism, no active Stripe integration yet)
  const iobotProduct = {
    title: "IOBot: Intelligent Desktop Companion Robot Blueprint",
    slug: "iobot-blueprint",
    type: "premium",
    basePrice: 99,
    salePrice: 59,
    currency: "inr",
    stripePriceId: "", // Empty for stage-1 no stripe constraint
    downloadFileURL: "https://thepaulx.in/downloads/iobot-free.zip",
    category: "Robotics",
    description: "Complete engineering blueprints and control software for IOBot, a smart desktop companion robot with haptic feedback, computer vision object tracking, and integrated voice agency capabilities.",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200",
    features: [
      "3D Print CAD Models (STL/STEP)",
      "ROS2 Computer Vision Nodes",
      "Servo Control & Haptics Firmware",
      "Detailed Wiring Schematics"
    ],
    comparisonFree: [
      "3D Printable Outer Shell STL",
      "Basic Servo Movement Sketches"
    ],
    comparisonPremium: [
      "Full Chassis & Interior STEP CAD",
      "ROS2 Object Tracking Core Nodes",
      "Voice Synthesis Integration API",
      "Interactive Pinout Wiring Diagrams"
    ],
    isPublished: true,
    downloadCount: 84,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    author: {
      name: "Ayush Paul",
      avatar: "/founder.png"
    }
  };

  // 3. New Haptic Teleoperation Rig Blueprint (Free Blueprint)
  const hapticRigProduct = {
    title: "Haptic Teleoperation Rig: Spatial Control Blueprint",
    slug: "haptic-teleoperation-blueprint",
    type: "free",
    basePrice: 0,
    salePrice: 0,
    currency: "inr",
    stripePriceId: "", // Free product, no price ID
    downloadFileURL: "https://thepaulx.in/downloads/haptic-teleoperation-free.zip",
    category: "Blueprints",
    description: "Open-source schematics, linkage CAD, and micro-controller software for a high-precision haptic teleoperation controller, offering real-time low-latency force feedback.",
    thumbnail: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200",
    features: [
      "ESP32 Low-Latency Telemetry Code",
      "3D Printable Joint Linkages CAD",
      "Haptic Force Integration Sketch",
      "Full Bill of Materials (BOM)"
    ],
    comparisonFree: [
      "Joint Linkage STEP/STL Files",
      "ESP32 Telemetry Firmware Source",
      "BOM & Part-Sourcing Guide"
    ],
    comparisonPremium: [],
    isPublished: true,
    downloadCount: 112,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    author: {
      name: "Ayush Paul",
      avatar: "/founder.png"
    }
  };

  console.log("Upserting all blueprints...");
  await productsRef.doc("ayu-boat-blueprint").set(ayuBoatProduct, { merge: true });
  console.log("✅ Created/Updated: ayu-boat-blueprint");
  
  await productsRef.doc("iobot-blueprint").set(iobotProduct, { merge: true });
  console.log("✅ Created/Updated: iobot-blueprint");
  
  await productsRef.doc("haptic-teleoperation-blueprint").set(hapticRigProduct, { merge: true });
  console.log("✅ Created/Updated: haptic-teleoperation-blueprint");

  // 4. Delete legacy test product
  console.log("Checking for legacy test products...");
  const testDoc = await productsRef.doc("ayu-boat-test").get();
  if (testDoc.exists) {
    await productsRef.doc("ayu-boat-test").delete();
    console.log("🗑️ Deleted legacy test product: ayu-boat-test");
  }

  console.log("--- MIGRATION COMPLETE ---");
}

migrateProducts().catch(console.error);
