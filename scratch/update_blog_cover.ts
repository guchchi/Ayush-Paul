
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
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

async function updateBlogCover() {
  const slug = "stubble-solution-innovation-journey";
  const newCover = "/founder.png";
  
  console.log(`🚀 Updating cover for blog: ${slug}`);
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app, process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "(default)");
  
  try {
    const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error(`❌ Blog with slug "${slug}" not found.`);
      return;
    }
    
    const blogDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, "blogPosts", blogDoc.id), {
      coverImage: newCover
    });
    
    console.log(`✅ Success! Cover image updated to: ${newCover}`);
  } catch (error) {
    console.error("❌ Error updating blog cover:", error.message);
  }
}

updateBlogCover();
