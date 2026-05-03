
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "(default)");

async function init() {
  console.log("🚀 Starting Firestore Schema initialization...");

  const schema = {
    milestones: {
      items: [],
      updatedAt: serverTimestamp()
    },
    about: {
      headline: "",
      bio: "",
      skills: [],
      updatedAt: serverTimestamp()
    },
    experience: {
      phases: [],
      updatedAt: serverTimestamp()
    }
  };

  try {
    for (const [id, data] of Object.entries(schema)) {
      await setDoc(doc(db, "content", id), data);
      console.log(`✅ Document '${id}' schema created.`);
    }
    console.log("✨ Initial schema established successfully.");
  } catch (error: any) {
    console.error("❌ Error initializing schema:", error.message);
    if (error.code === 'permission-denied') {
      console.warn("⚠️ PERMISSION DENIED: Please ensure you are authorized or that Firestore rules allow this write.");
    }
  }
}

init();
