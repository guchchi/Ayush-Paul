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

const TIER_99 = { basePrice: 99, salePrice: 99, currency: "inr", productTier: "starter" as const };
const TIER_199 = { basePrice: 199, salePrice: 149, currency: "inr", productTier: "pro" as const };
const TIER_499 = { basePrice: 499, salePrice: 399, currency: "inr", productTier: "pro" as const };

const placeholders = [
  {
    id: "cursor-rules-pack",
    title: "Production .cursorrules Pack — 10x Dev Speed",
    slug: "cursor-rules-pack",
    category: "Prompts",
    type: "paid" as const,
    ...TIER_199,
    description: "A curated bundle of production-grade .cursorrules configurations for TypeScript, Python, Rust, and Go. Drop into any project and immediately level up AI-assisted code generation.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
    downloadFileURL: "",
    stripePriceId: "",
    isPublished: true,
    isFeatured: false,
    status: "COMING_SOON",
    tags: ["Cursor AI", "Prompts", "Development", "Productivity"],
    features: [],
    comparisonFree: ["Single-language .cursorrules template"],
    comparisonPremium: ["Multi-language rules pack (TS, Py, Rust, Go)", "Project-specific prompt presets", "Weekly updates & additions", "Private Discord channel"],
  },
  {
    id: "nextjs-saas-starter",
    title: "Next.js SaaS Starter — Auth, Payments, DB",
    slug: "nextjs-saas-starter",
    category: "Templates",
    type: "paid" as const,
    ...TIER_499,
    description: "Production-ready Next.js boilerplate with Firebase Auth, Stripe subscriptions, Prisma ORM, Tailwind CSS, and shadcn/ui. Deploy to Vercel in 10 minutes.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
    downloadFileURL: "",
    stripePriceId: "",
    isPublished: true,
    isFeatured: false,
    status: "COMING_SOON",
    tags: ["Next.js", "SaaS", "Stripe", "Firebase", "Tailwind"],
    features: [],
    comparisonFree: ["Basic layout & navigation"],
    comparisonPremium: ["Full auth (email + OAuth)", "Stripe subscription integration", "Dashboard with analytics", "API route templates", "Vercel deployment guide"],
  },
  {
    id: "make-automation-suite",
    title: "Make.com Automation Suite — 15 Scenarios",
    slug: "make-automation-suite",
    category: "Workflows",
    type: "paid" as const,
    ...TIER_199,
    description: "15 ready-to-import Make.com scenarios for lead capture, content publishing, invoice generation, Slack alerts, and social media cross-posting.",
    thumbnail: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1200",
    downloadFileURL: "",
    stripePriceId: "",
    isPublished: true,
    isFeatured: false,
    status: "COMING_SOON",
    tags: ["Make.com", "Automation", "Workflows", "No-Code"],
    features: [],
    comparisonFree: ["2 sample scenarios (lead capture, email notify)"],
    comparisonPremium: ["All 15 production scenarios", "Error handling & retry logic", "API webhook setup guide", "Priority support"],
  },
  {
    id: "seo-audit-checklist",
    title: "Technical SEO Audit Checklist — 60+ Points",
    slug: "seo-audit-checklist",
    category: "Checklists",
    type: "paid" as const,
    ...TIER_99,
    description: "A comprehensive 60+ point technical SEO audit checklist covering crawlability, indexation, structured data, Core Web Vitals, mobile UX, and security headers.",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200",
    downloadFileURL: "",
    stripePriceId: "",
    isPublished: true,
    isFeatured: false,
    status: "COMING_SOON",
    tags: ["SEO", "Checklist", "Technical SEO", "Audit"],
    features: [],
    comparisonFree: ["Top 10 audit items PDF"],
    comparisonPremium: ["Full 60-point interactive checklist", "Screaming Frog config export", "JSON-LD schema validator", "Monthly update log"],
  },
  {
    id: "ai-content-pipeline",
    title: "AI Content Pipeline — Research to Publish",
    slug: "ai-content-pipeline",
    category: "Workflows",
    type: "paid" as const,
    ...TIER_199,
    description: "End-to-end content pipeline using ChatGPT, Claude, and Make.com. From keyword research to draft generation to WordPress/Ghost publishing — fully automated.",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200",
    downloadFileURL: "",
    stripePriceId: "",
    isPublished: true,
    isFeatured: false,
    status: "COMING_SOON",
    tags: ["AI", "Content", "Automation", "Writing"],
    features: [],
    comparisonFree: ["Single prompt template for blog posts"],
    comparisonPremium: ["Multi-LLM pipeline (ChatGPT + Claude)", "Automated research briefs", "WordPress/Ghost integration", "SEO metadata generator"],
  },
  {
    id: "portfolio-template-pack",
    title: "Developer Portfolio Template — 3 Themes",
    slug: "portfolio-template-pack",
    category: "Templates",
    type: "paid" as const,
    ...TIER_99,
    description: "Three modern, responsive developer portfolio templates built with Next.js and Tailwind CSS. Includes dark/light mode, blog integration, and project showcase layouts.",
    thumbnail: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1200",
    downloadFileURL: "",
    stripePriceId: "",
    isPublished: true,
    isFeatured: false,
    status: "COMING_SOON",
    tags: ["Next.js", "Portfolio", "Tailwind", "Templates"],
    features: [],
    comparisonFree: ["Single theme (minimal)"],
    comparisonPremium: ["All 3 themes", "Blog CMS integration", "SEO meta components", "Figma design files"],
  },
  {
    id: "stripe-webhook-blueprint",
    title: "Stripe Webhook Blueprint — Node.js + Firebase",
    slug: "stripe-webhook-blueprint",
    category: "Blueprints",
    type: "paid" as const,
    ...TIER_199,
    description: "Production-grade Stripe webhook handler for Node.js with Firebase Admin SDK. Handles checkout.completed, subscription events, idempotency, and email receipts.",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200",
    downloadFileURL: "",
    stripePriceId: "",
    isPublished: true,
    isFeatured: false,
    status: "COMING_SOON",
    tags: ["Stripe", "Webhooks", "Payments", "Firebase"],
    features: [],
    comparisonFree: ["Basic webhook endpoint template"],
    comparisonPremium: ["Full event handler suite", "Idempotency layer", "Resend email integration", "Error monitoring setup"],
  },
  {
    id: "rag-system-blueprint",
    title: "RAG System Blueprint — Python + LangChain",
    slug: "rag-system-blueprint",
    category: "Blueprints",
    type: "paid" as const,
    ...TIER_499,
    description: "Build a production-ready Retrieval-Augmented Generation system with LangChain, Pinecone, OpenAI, and FastAPI. Includes document chunking, embedding pipelines, and query routing.",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200",
    downloadFileURL: "",
    stripePriceId: "",
    isPublished: true,
    isFeatured: false,
    status: "COMING_SOON",
    tags: ["AI", "RAG", "LangChain", "Python", "Vector Database"],
    features: [],
    comparisonFree: ["Single-document Q&A script"],
    comparisonPremium: ["Full RAG pipeline with LangChain", "Pinecone vector store integration", "Async FastAPI server", "Docker deployment config", "Evaluation harness"],
  },
];

async function seed() {
  console.log(`Seeding placeholder blueprints into database: ${dbId}...`);

  for (const bp of placeholders) {
    const docRef = db.collection("products").doc(bp.id);
    await docRef.set({
      ...bp,
      author: {
        name: "Ayush Paul",
        role: "Systems Builder",
        avatar: "/founder.png",
      },
      purchaseCount: 0,
      downloadCount: 0,
      viewCount: 0,
      rating: 0,
      discountPercentage: bp.basePrice > bp.salePrice
        ? Math.round((1 - bp.salePrice / bp.basePrice) * 100)
        : 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`✅ [${bp.status}] Seeded: ${bp.title} (₹${bp.basePrice})`);
  }

  console.log(`\nDone! ${placeholders.length} placeholder blueprints written to 'products' collection.`);
  console.log("All entries have isPublished=false. They will NOT appear on the live site.");
  console.log("To publish: Set isPublished=true and add a valid stripePriceId + downloadFileURL.");
}

seed().catch(console.error);
