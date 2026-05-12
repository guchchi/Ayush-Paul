
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

// Load service account
const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.VITE_FIREBASE_PROJECT_ID
  });
}

const firestore = process.env.VITE_FIREBASE_FIRESTORE_DB_ID 
  ? getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID)
  : getFirestore();

async function updateBlogCover() {
  const slug = "stubble-solution-innovation-journey";
  const newCover = "/founder.png";
  
  console.log(`🚀 Updating cover for blog: ${slug} using Admin SDK`);
  
  try {
    const blogRef = firestore.collection("blogPosts");
    const snapshot = await blogRef.where("slug", "==", slug).get();
    
    if (snapshot.empty) {
      console.error(`❌ Blog with slug "${slug}" not found.`);
      return;
    }
    
    const blogDoc = snapshot.docs[0];
    await blogDoc.ref.update({
      coverImage: newCover
    });
    
    console.log(`✅ Success! Cover image updated to: ${newCover}`);
  } catch (error) {
    console.error("❌ Error updating blog cover:", error.message);
  }
}

updateBlogCover();
