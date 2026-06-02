import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import fs from 'fs';

dotenv.config();
dotenv.config({ path: '.env.local' });

async function inspect() {
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

  const firestoreDbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID;
  const db = getFirestore(admin.app(), firestoreDbId);
  console.log("Connected to Firestore. DB ID:", firestoreDbId || "(default)");

  const collections = ["projects", "products", "blogPosts", "blogs", "contact_messages", "subscribers", "courses"];
  
  for (const collName of collections) {
    try {
      const snap = await db.collection(collName).limit(3).get();
      console.log(`\nCollection [${collName}]: count = ${snap.size}`);
      snap.forEach(doc => {
        console.log(` - Document ID: ${doc.id}`);
        console.log(`   Fields:`, Object.keys(doc.data()));
      });
    } catch (err: any) {
      console.error(`Error querying [${collName}]:`, err.message);
    }
  }
}

inspect().then(() => process.exit(0)).catch(console.error);
