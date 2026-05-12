
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

async function checkDefaultDB() {
  console.log("Checking project:", firebaseConfig.projectId);
  console.log("Database ID: (default)");
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app, "(default)");
  
  try {
    const querySnapshot = await getDocs(collection(db, "blogPosts"));
    console.log(`Total blogs found in (default): ${querySnapshot.size}`);
    querySnapshot.forEach((doc) => {
      console.log(`- ${doc.id}: ${doc.data().title}`);
    });
  } catch (error) {
    console.error("Error fetching blogs from (default):", error.message);
  }
}

checkDefaultDB();
