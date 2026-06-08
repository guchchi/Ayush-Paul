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
  admin.initializeApp({ credential });
}

const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a";
const db = getFirestore(admin.app(), dbId);

const workshops = [
  {
    id: "ai-agent-workshop-q3",
    title: "Build Your First AI Agent — Live Coding Session",
    description: "Join Ayush for a live 2-hour workshop where you'll build a functional AI agent from scratch using LangChain, OpenAI, and FastAPI. Covers tool calling, memory, and deployment.",
    date: "TBD — Q3 2026",
    time: "TBD",
    duration: "2 hours",
    instructor: "Ayush Paul",
    meetingLink: "",
    registrationLink: "",
    isPublished: true,
    isFree: true,
    status: "UPCOMING",
    category: "AI & Automation",
    maxParticipants: 50,
    tags: ["AI Agents", "LangChain", "Python", "Live Workshop"],
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200",
  },
  {
    id: "cursor-mastery-workshop-q3",
    title: "Cursor AI Mastery — Ship a Feature in 60 Minutes",
    description: "Watch Ayush ship a complete feature using Cursor AI in under 60 minutes. Learn prompt patterns, Composer workflows, and how to integrate AI into your daily development loop.",
    date: "TBD — Q3 2026",
    time: "TBD",
    duration: "1 hour",
    instructor: "Ayush Paul",
    meetingLink: "",
    registrationLink: "",
    isPublished: true,
    isFree: true,
    status: "UPCOMING",
    category: "Development",
    maxParticipants: 100,
    tags: ["Cursor AI", "AI-Assisted Development", "Live Coding"],
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
  },
  {
    id: "saas-launch-workshop-q4",
    title: "SaaS Launch Blueprint — From Idea to First Customer",
    description: "A 3-hour intensive workshop covering the entire SaaS launch process: idea validation, tech stack selection, MVP build, Stripe integration, and go-to-market strategy.",
    date: "TBD — Q4 2026",
    time: "TBD",
    duration: "3 hours",
    instructor: "Ayush Paul",
    meetingLink: "",
    registrationLink: "",
    isPublished: true,
    isFree: false,
    price: 49,
    status: "UPCOMING",
    category: "Business & SaaS",
    maxParticipants: 25,
    tags: ["SaaS", "Launch", "Startup", "Business"],
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
  },
  {
    id: "seo-audit-workshop-q4",
    title: "Live Technical SEO Audit — Real Site Walkthrough",
    description: "Ayush performs a live technical SEO audit on a real volunteer's website. You'll learn exactly how to identify crawl issues, fix structured data, optimize Core Web Vitals, and more.",
    date: "TBD — Q4 2026",
    time: "TBD",
    duration: "2 hours",
    instructor: "Ayush Paul",
    meetingLink: "",
    registrationLink: "",
    isPublished: true,
    isFree: true,
    status: "UPCOMING",
    category: "SEO & Growth",
    maxParticipants: 50,
    tags: ["SEO", "Technical Audit", "Live Demo"],
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200",
  },
];

async function seed() {
  console.log(`Seeding workshops into database: ${dbId}...`);

  for (const workshop of workshops) {
    const { id, ...workshopData } = workshop;
    const docRef = db.collection("workshops").doc(id);
    await docRef.set({
      ...workshopData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`✅ [${workshopData.status}] Workshop seeded: ${workshopData.title}`);
  }

  console.log(`\nDone! ${workshops.length} workshops written to 'workshops' collection.`);
  console.log("All entries have UPCOMING status, placeholder dates, and empty meeting links.");
  console.log("UI will display 'UPCOMING' badges and 'To be announced' for links automatically.");
  console.log("To activate: fill meetingLink + registrationLink, then set a real date.");
}

seed().catch(console.error);
