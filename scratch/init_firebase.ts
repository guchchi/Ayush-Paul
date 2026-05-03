
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import dotenv from 'dotenv';
import path from 'path';

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
  console.log("🚀 Starting Firestore initialization...");

  const content = {
    about: {
      vision: "Building Digital Systems For The Future.",
      mission: "To architect and engineer high-performance platforms that scale.",
      founderPhilosophy: "I collaborate with ambitious builders, founders, and teams solving meaningful problems.",
      updatedAt: serverTimestamp()
    },
    milestones: {
      data: [
        { year: "2021", title: "National Level Science Exhibition", desc: "Recognized for foundational hardware engineering." },
        { year: "2022", title: "Technology Projects Initiation", desc: "Started developing comprehensive software solutions." },
        { year: "2023", title: "Automation Systems", desc: "Architected intelligent workflows and AI integrations." },
        { year: "2024", title: "Innovation Builds", desc: "Launched scalable web applications and platforms." },
        { year: "2025", title: "Digital Product Development", desc: "Leading the next wave of full-stack ecosystems." }
      ],
      updatedAt: serverTimestamp()
    },
    experience: {
      phases: [
        { title: "Technology Foundations", sub: "Started building deep technical expertise." },
        { title: "Freelance Innovation", sub: "Executed complex client projects." },
        { title: "System Architecture", sub: "Focus shifted to scalable product development." },
        { title: "Startup Ecosystem", sub: "Launching high-impact digital platforms." }
      ],
      updatedAt: serverTimestamp()
    },
    homepage: {
      hero: {
        headline: "I Design & Engineer Digital Experiences That Feel Alive.",
        subheadline: "I build production-ready systems combining engineering, design, and AI automation."
      },
      stats: [
        { label: "Products Built", value: "15+" },
        { label: "Engineering Hours", value: "8k+" },
        { label: "Global Users", value: "10k+" }
      ],
      updatedAt: serverTimestamp()
    }
  };

  try {
    for (const [id, data] of Object.entries(content)) {
      await setDoc(doc(db, "content", id), data);
      console.log(`✅ Document '${id}' initialized.`);
    }
    console.log("✨ All documents created successfully.");
  } catch (error) {
    console.error("❌ Error initializing Firestore:", error);
  }
}

init();
