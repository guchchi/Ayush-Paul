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

const updates = [
  {
    title: "Course Platform Launched: Cursor AI Mastery",
    text: "Published the first course on AI-assisted development. 3 modules, 8 lessons covering prompt engineering and production builds. First 100 students get free access.",
    statusTag: "Launch",
    isPublic: true,
    date: "2026-06-01",
  },
  {
    title: "Stripe Checkout Fully Integrated",
    text: "Premium product checkout flow is now live. Webhook verification, ownership tracking, and instant Vault access working end-to-end. Testing UPI payments for Indian users.",
    statusTag: "Infrastructure",
    isPublic: true,
    date: "2026-05-28",
  },
  {
    title: "SEO Authority System Blueprint Published",
    text: "New product: Technical SEO Audit Ebook with playbooks, checklists, and automation scenarios. Free tier available with full crawl checklist.",
    statusTag: "Product",
    isPublic: true,
    date: "2026-05-20",
  },
  {
    title: "AI Workflows Product Live",
    text: "Cursor AI Execution Pack with custom .cursorrules configurations and prompt templates now available in the Blueprints registry.",
    statusTag: "Product",
    isPublic: true,
    date: "2026-05-15",
  },
  {
    title: "Vault Portal Redesigned",
    text: "User dashboard now shows purchased products, enrolled courses, and registered workshops in a unified interface. Continue learning flow implemented.",
    statusTag: "UI/UX",
    isPublic: true,
    date: "2026-05-10",
  },
  {
    title: "Admin CMS Architecture Completed",
    text: "Schema-driven CMS is operational. Blog posts, products, and courses can be managed directly from the admin panel with AI writing assistant support.",
    statusTag: "Infrastructure",
    isPublic: true,
    date: "2026-05-05",
  },
  {
    title: "Firebase Multi-Tier Caching",
    text: "Implemented memory → localStorage → Firestore cache hierarchy for products collection. Reduces reads by 90% on repeat visits.",
    statusTag: "Performance",
    isPublic: true,
    date: "2026-04-28",
  },
  {
    title: "SaaS Boilerplate: Next.js Launch Guide",
    text: "Premium blueprint published covering Next.js App Router, Stripe integration, Firebase auth, and Tailwind design systems.",
    statusTag: "Product",
    isPublic: true,
    date: "2026-04-20",
  },
  {
    title: "Collaboration System Live",
    text: "Studio page now accepts direct collaboration requests via Firestore. Admin panel has a dedicated inquiries inbox.",
    statusTag: "Infrastructure",
    isPublic: true,
    date: "2026-04-15",
  },
  {
    title: "Platform Architecture Redesign",
    text: "Consolidated from 5 separate page concepts to 3 core systems: Mastery (learn), Blueprints (build), Studio (collaborate). CNS navigation unified.",
    statusTag: "Architecture",
    isPublic: true,
    date: "2026-04-10",
  },
];

async function seed() {
  console.log(`Seeding updates into database: ${dbId}...`);

  for (const update of updates) {
    const docRef = db.collection("updates").doc();
    await docRef.set({
      ...update,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`✅ Update: ${update.title}`);
  }

  console.log("Updates seeding completed!");
}

seed().catch(console.error);
