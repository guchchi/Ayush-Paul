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
  admin.initializeApp({
    credential,
  });
}

const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a";
const db = getFirestore(admin.app(), dbId);

const ebooks = [
  {
    id: "ayu-boat-blueprint",
    title: "Ayu-Boat: Autonomous Water Drone Ebook & CAD",
    slug: "ayu-boat-blueprint",
    category: "Robotics",
    type: "premium",
    basePrice: 49,
    salePrice: 29,
    discountPercentage: 40,
    currency: "usd",
    isPublished: true,
    isFeatured: true,
    author: {
      name: "Ayush Paul",
      role: "Systems Builder",
      avatar: "/founder.png"
    },
    description: "Complete engineering guide, wiring schematics, assembly steps, and source code for the Ayu-Boat autonomous water drone. Includes 3D printable CAD models and sensor calibration modules.",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
    stripePriceId: "price_1TXafVCrlf5LZT5FgtUkEyWa", // Active price
    downloadFileURL: "https://ayushpaul.in/downloads/ayu-boat-free.zip",
    features: [
      "3D Print CAD Models (STEP/STL)",
      "Autonomous Navigation Source Code",
      "Assembly & Calibration Guide",
      "Complete Bill of Materials (BOM)"
    ],
    comparisonFree: [
      "Basic Navigation Arduino Sketch",
      "PDF Layout Schematics"
    ],
    comparisonPremium: [
      "Full Chassis STEP/STL Models",
      "Advanced AI Navigation Script",
      "1-on-1 Setup Assistance",
      "Lifetime Updates"
    ],
    tags: ["Robotics", "Arduino", "Autonomous Systems", "3D Printing"],
    purchaseCount: 150,
    downloadCount: 420,
    viewCount: 1250,
    rating: 4.8
  },
  {
    id: "iobot-blueprint",
    title: "IOBot: Desktop Companion Robot Ebook & Firmware",
    slug: "iobot-blueprint",
    category: "Robotics",
    type: "premium",
    basePrice: 99,
    salePrice: 59,
    discountPercentage: 40,
    currency: "usd",
    isPublished: true,
    isFeatured: true,
    author: {
      name: "Ayush Paul",
      role: "Systems Builder",
      avatar: "/founder.png"
    },
    description: "An interactive guide and control software repository to build IOBot—a companion desktop robot. Includes haptic feedback configurations, computer vision algorithms, and voice synthesis codes.",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200",
    stripePriceId: "price_1TXafVCrlf5LZT5FgtUkEyWa", // Reusing active price for sandbox checkouts
    downloadFileURL: "https://ayushpaul.in/downloads/iobot-free.zip",
    features: [
      "3D Print CAD Models (STL/STEP)",
      "ROS2 Computer Vision Nodes",
      "Servo Control & Haptics Firmware",
      "Voice Synthesis Integration API"
    ],
    comparisonFree: [
      "3D Printable Outer Shell STL",
      "Basic Servo Movement Sketches"
    ],
    comparisonPremium: [
      "Full Chassis & Interior STEP CAD",
      "ROS2 Object Tracking Core Nodes",
      "Voice Synthesis Integration API",
      "Interactive Pinout Wiring Diagrams"
    ],
    tags: ["Robotics", "ROS2", "Computer Vision", "3D CAD"],
    purchaseCount: 84,
    downloadCount: 210,
    viewCount: 940,
    rating: 4.9
  },
  {
    id: "haptic-teleoperation-blueprint",
    title: "Haptic Teleoperation Spatial Control Guide",
    slug: "haptic-teleoperation-blueprint",
    category: "Robotics",
    type: "free",
    basePrice: 0,
    salePrice: 0,
    discountPercentage: 0,
    currency: "usd",
    isPublished: true,
    isFeatured: false,
    author: {
      name: "Ayush Paul",
      role: "Systems Builder",
      avatar: "/founder.png"
    },
    description: "Open-source schematics, linkage CAD, and micro-controller software for a high-precision spatial teleoperation controller offering real-time low-latency force feedback.",
    thumbnail: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200",
    stripePriceId: "",
    downloadFileURL: "https://ayushpaul.in/downloads/haptic-teleoperation-free.zip",
    features: [
      "ESP32 Low-Latency Telemetry Code",
      "3D Printable Joint Linkages CAD",
      "Haptic Force Integration Sketch",
      "Full Bill of Materials (BOM)"
    ],
    comparisonFree: [
      "Joint Linkage STEP/STL Files",
      "ESP32 Telemetry Firmware Source",
      "BOM & Part-Sourcing Guide"
    ],
    comparisonPremium: [],
    tags: ["ESP32", "Haptics", "Spatial Control", "Teleoperation"],
    purchaseCount: 0,
    downloadCount: 112,
    viewCount: 520,
    rating: 4.7
  },
  {
    id: "seo-ebook",
    title: "Technical SEO Audit Ebook: Playbooks & Checklists",
    slug: "seo-ebook",
    category: "SEO",
    type: "premium",
    basePrice: 29,
    salePrice: 19,
    discountPercentage: 34,
    currency: "usd",
    isPublished: true,
    isFeatured: true,
    author: {
      name: "Ayush Paul",
      role: "Systems Builder",
      avatar: "/founder.png"
    },
    description: "The complete technical SEO handbook for modern websites. Includes step-by-step redirect checklists, robots.txt strategies, sitemap construction codes, and JSON-LD schema markup generators.",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200",
    stripePriceId: "price_1TXafVCrlf5LZT5FgtUkEyWa",
    downloadFileURL: "https://ayushpaul.in/downloads/seo-checklist-free.zip",
    features: [
      "Technical SEO Crawl Audit Checklist",
      "Technical JSON-LD Schema Generator",
      "Sitemap Construction & Redirect Playbook",
      "Core Web Vitals Optimization Tips"
    ],
    comparisonFree: [
      "Introductory Checklist Chapter",
      "Sample JSON-LD Schema Template"
    ],
    comparisonPremium: [
      "Complete Technical Crawl Audit Sheet",
      "Automated Node.js Schema Generator Script",
      "Make.com SEO Checker Scenario",
      "Redirect Rules & .htaccess Snippets"
    ],
    tags: ["SEO", "Web Development", "JSON-LD", "Metadata"],
    purchaseCount: 215,
    downloadCount: 850,
    viewCount: 2400,
    rating: 4.9
  },
  {
    id: "ai-workflows-ebook",
    title: "AI Workflows: The Ultimate Cursor AI & Prompt Playbook",
    slug: "ai-workflows-ebook",
    category: "AI",
    type: "premium",
    basePrice: 25,
    salePrice: 15,
    discountPercentage: 40,
    currency: "usd",
    isPublished: true,
    isFeatured: true,
    author: {
      name: "Ayush Paul",
      role: "Systems Builder",
      avatar: "/founder.png"
    },
    description: "Supercharge your software development and content pipeline. Features custom `.cursorrules` configurations, automated ChatGPT workflows, and structured prompting templates to speed up development by 10x.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
    stripePriceId: "price_1TXafVCrlf5LZT5FgtUkEyWa",
    downloadFileURL: "https://ayushpaul.in/downloads/ai-workflows-free.zip",
    features: [
      "Custom .cursorrules Configurations",
      "Automated Prompting System Framework",
      "LLM Agent Design Playbooks",
      "Code Refactoring Prompt Templates"
    ],
    comparisonFree: [
      "Base .cursorrules Template",
      "Top 5 Refactoring Prompts"
    ],
    comparisonPremium: [
      "Advanced Multi-Language Cursor Configs",
      "Full API-Driven Prompt Library",
      "Automated Content Pipeline Templates",
      "Vercel/Next.js System Prompt Rules"
    ],
    tags: ["AI Tools", "Cursor AI", "Prompt Engineering", "Workflows"],
    purchaseCount: 380,
    downloadCount: 1450,
    viewCount: 4200,
    rating: 4.95
  },
  {
    id: "saas-boilerplate-ebook",
    title: "SaaS Boilerplate Ebook: Next.js + Tailwind Launch Guide",
    slug: "saas-boilerplate-ebook",
    category: "Web",
    type: "premium",
    basePrice: 79,
    salePrice: 49,
    discountPercentage: 38,
    currency: "usd",
    isPublished: true,
    isFeatured: true,
    author: {
      name: "Ayush Paul",
      role: "Systems Builder",
      avatar: "/founder.png"
    },
    description: "Launch your Next.js project with confidence. Includes styling systems, database configurations, auth setups, and ready-to-deploy Stripe webhook templates.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
    stripePriceId: "price_1TXafVCrlf5LZT5FgtUkEyWa",
    downloadFileURL: "https://ayushpaul.in/downloads/saas-boilerplate-free.zip",
    features: [
      "Next.js App Router Boilerplate Code",
      "Stripe checkout webhook templates",
      "Firebase client & admin middleware setups",
      "Tailwind CSS custom design systems"
    ],
    comparisonFree: [
      "Basic Navigation Layout Code",
      "Mock API Endpoint Snippet"
    ],
    comparisonPremium: [
      "Full Production Boilerplate Repository",
      "Stripe Signature Verifier Middleware",
      "Responsive Interactive UI Elements",
      "Direct Vercel Deployment Configurations"
    ],
    tags: ["Next.js", "Tailwind CSS", "Stripe", "Firebase"],
    purchaseCount: 110,
    downloadCount: 480,
    viewCount: 1650,
    rating: 4.85
  }
];

async function seed() {
  console.log(`Seeding database: ${dbId}...`);
  for (const ebook of ebooks) {
    const docRef = db.collection("products").doc(ebook.id);
    const data = {
      ...ebook,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await docRef.set(data);
    console.log(`✅ Seeded: ${ebook.title} (${ebook.id})`);
  }
  console.log("Database seeding completed!");
}

seed().catch(console.error);
