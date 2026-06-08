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

const course = {
  id: "typescript-systems-design",
  title: "TypeScript Systems Design — Build Scalable Architectures",
  slug: "typescript-systems-design",
  category: "websites",
  description: "Learn production-grade TypeScript architecture patterns. Covers generics, discriminated unions, branded types, service layers, and monorepo design. Includes real-world case studies.",
  difficulty: "Advanced",
  duration: "5 hours",
  lessonsCount: 8,
  price: 29,
  isPublished: true,
  isFree: false,
  productTier: "starter",
  thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200",
  author: "Ayush Paul",
  tags: ["TypeScript", "Systems Design", "Architecture", "Advanced"],
};

const modules = [
  {
    title: "TypeScript Foundations for Systems",
    description: "Core TypeScript patterns that unlock scalable architecture design.",
    order: 1,
    lessons: [
      {
        title: "Generics Deep Dive — Beyond the Basics",
        content: "",
        isFree: true,
      },
      {
        title: "Discriminated Unions & Exhaustive Pattern Matching",
        content: "",
        isFree: true,
      },
      {
        title: "Branded Types — type-safe IDs & Nominative Typing",
        content: "",
        isFree: false,
      },
    ],
  },
  {
    title: "Service Layer Architecture",
    description: "Design patterns for clean, testable service layers in TypeScript.",
    order: 2,
    lessons: [
      {
        title: "The Repository Pattern with TypeScript Generics",
        content: "",
        isFree: false,
      },
      {
        title: "Dependency Injection Without a Framework",
        content: "",
        isFree: false,
      },
      {
        title: "Error Handling — Result Types & Monadic Error Flow",
        content: "",
        isFree: false,
      },
    ],
  },
  {
    title: "Monorepo Design & Package Architecture",
    description: "Structure large TypeScript codebases with monorepo tooling.",
    order: 3,
    lessons: [
      {
        title: "Monorepo Tooling — Turborepo, Nx & pnpm Workspaces",
        content: "",
        isFree: false,
      },
      {
        title: "Shared Types & API Contracts Across Packages",
        content: "",
        isFree: false,
      },
    ],
  },
];

async function seed() {
  console.log(`Seeding placeholder course into database: ${dbId}...`);

  // 1. Write course
  const courseRef = db.collection("courses").doc(course.id);
  await courseRef.set({
    ...course,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log(`✅ Course seeded: ${course.title} (${course.id})`);

  // 2. Write modules + lessons
  for (const mod of modules) {
    const { lessons, ...moduleData } = mod;
    const moduleRef = db.collection("modules").doc();
    await moduleRef.set({
      ...moduleData,
      courseId: course.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`  ✅ Module: ${mod.title}`);

    for (const lesson of lessons) {
      const lessonRef = db.collection("lessons").doc();
      await lessonRef.set({
        ...lesson,
        courseId: course.id,
        moduleId: moduleRef.id,
        order: lessons.indexOf(lesson) + 1,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      const lockIcon = lesson.isFree ? "🔓" : "🔒";
      console.log(`    ${lockIcon} Lesson: ${lesson.title}`);
    }
  }

  console.log(`\nDone! 1 course + ${modules.length} modules + 8 lessons written.`);
  console.log(`First 2 lessons are free (${modules[0].lessons.filter(l => l.isFree).length}), remaining ${modules.flatMap(m => m.lessons).filter(l => !l.isFree).length} are locked.`);
  console.log("All lessons have empty content fields — ready for real content.");
  console.log("UI will display 'Coming Soon' placeholder for empty lessons automatically.");
}

seed().catch(console.error);
