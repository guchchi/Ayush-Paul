import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

if (!process.env.VITE_FIREBASE_PROJECT_ID) {
  console.error("❌ Error: VITE_FIREBASE_PROJECT_ID not found in .env.local");
  process.exit(1);
}

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  const serviceAccountPath = path.resolve(process.cwd(), "service-account.json");
  if (fs.existsSync(serviceAccountPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath)
    });
  } else {
    admin.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    });
  }
}

const db = getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID);

async function publish(type: string, data: any) {
  try {
    const collectionName = type === "project" ? "projects" : type === "update" ? "updates" : "blogPosts";

    // Auto-generate slug if missing
    if (data.title && !data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const docId = data.slug || `post-${Date.now()}`;
    await db.collection(collectionName).doc(docId).set(data);
    
    console.log(`\n✅ SUCCESSFULLY PUBLISHED`);
    console.log(`--------------------------------`);
    console.log(`Type: ${type}`);
    console.log(`ID: ${docId}`);
    console.log(`URL: /${type === 'blog' ? 'blog' : 'projects'}/${data.slug}`);
    console.log(`--------------------------------\n`);
    
    process.exit(0);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Publishing Error:", error.message);
    process.exit(1);
  }
}

// Get arguments from command line
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Usage: tsx scripts/publish.ts <type> <json_payload_OR_file_path>");
  process.exit(1);
}

const type = args[0];
let payloadString = args[1];

// Check if payload is a file path
if (fs.existsSync(payloadString)) {
  payloadString = fs.readFileSync(payloadString, "utf8");
}

const payload = JSON.parse(payloadString);

// Handle both direct and nested data structures
const dataToPublish = payload.data || payload;
const finalType = payload.type || type;

publish(finalType, dataToPublish);
