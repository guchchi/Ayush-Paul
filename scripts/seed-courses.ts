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

const courses = [
  {
    id: "cursor-ai-mastery",
    title: "Cursor AI Mastery: Build Production Apps 10x Faster",
    slug: "cursor-ai-mastery",
    category: "ai",
    description: "Master Cursor AI to build full-stack applications at 10x speed. Learn prompt engineering, custom rules, and AI-assisted architecture patterns.",
    difficulty: "Intermediate",
    duration: "6 hours",
    lessonsCount: 12,
    price: 0,
    isPublished: true,
    isFree: true,
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
    author: "Ayush Paul",
    tags: ["Cursor AI", "AI Tools", "Prompt Engineering", "Development"],
  },
  {
    id: "nextjs-saas-foundations",
    title: "Next.js SaaS Foundations: From Zero to Launch",
    slug: "nextjs-saas-foundations",
    category: "websites",
    description: "Build a production-ready SaaS platform with Next.js, Firebase, Stripe, and Tailwind CSS. Covering auth, payments, databases, and deployment.",
    difficulty: "Advanced",
    duration: "8 hours",
    lessonsCount: 16,
    price: 49,
    isPublished: true,
    isFree: false,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
    author: "Ayush Paul",
    tags: ["Next.js", "SaaS", "Firebase", "Stripe"],
  },
  {
    id: "seo-authority-system",
    title: "Technical SEO: Build Authority Systems That Scale",
    slug: "seo-authority-system",
    category: "seo",
    description: "Learn technical SEO from the ground up. Covers crawl optimization, structured data, Core Web Vitals, and content strategy for long-term growth.",
    difficulty: "Beginner",
    duration: "4 hours",
    lessonsCount: 8,
    price: 0,
    isPublished: true,
    isFree: true,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200",
    author: "Ayush Paul",
    tags: ["SEO", "Web Development", "Structured Data", "Content Strategy"],
  },
];

const modulesData: Record<string, any[]> = {
  "cursor-ai-mastery": [
    {
      title: "Getting Started with Cursor AI",
      description: "Set up your environment and learn the fundamentals of AI-assisted coding.",
      order: 1,
      lessons: [
        { title: "Installing & Configuring Cursor", content: "# Installing Cursor\n\nCursor is an AI-first code editor built on VS Code. Let's get it set up.\n\n## Download & Install\n1. Go to cursor.com and download the latest version\n2. Install for your OS (Windows/macOS/Linux)\n3. Launch Cursor and sign in with your GitHub account\n\n## Configure AI Settings\n- Open Settings (Cmd+,)\n- Navigate to AI section\n- Set your API key or use Cursor's built-in models\n- Enable inline suggestions\n\n## Import VS Code Extensions\nCursor is compatible with VS Code extensions. Import your existing setup:\n- Cmd+Shift+X to open Extensions\n- Sign in with your VS Code account\n- Extensions sync automatically", isFree: true },
        { title: "Understanding AI Modes: Chat, Inline, & Composer", content: "# AI Modes in Cursor\n\nCursor provides three distinct AI interaction modes.\n\n## Chat Mode (Cmd+L)\n- Conversational AI assistance\n- Ask questions about your codebase\n- Get explanations and suggestions\n- Best for: Understanding code, debugging help\n\n## Inline Mode (Cmd+K)\n- Edit code directly in the editor\n- Select code and ask AI to modify it\n- Real-time diff preview\n- Best for: Quick edits, refactoring\n\n## Composer Mode (Cmd+Shift+I)\n- Multi-file editing\n- Generate entire components\n- Full project context awareness\n- Best for: Building features from scratch", isFree: true },
        { title: "Your First AI-Assisted Project", content: "# Building with Cursor AI\n\nLet's create a simple React component using Cursor's AI assistance.\n\n## Project Setup\n```bash\nnpm create vite@latest my-app -- --template react-ts\ncd my-app\nnpm install\n```\n\n## Generate a Component\nOpen a new file and press Cmd+K. Type:\n```\nCreate a responsive card component with image, title, description, and a button. Use Tailwind CSS.\n```\n\n## Review & Refine\n- Cursor will generate the code\n- Review the output\n- Use follow-up prompts to refine\n- Accept or modify as needed", isFree: true },
      ],
    },
    {
      title: "Prompt Engineering for Code",
      description: "Master the art of writing effective prompts for code generation.",
      order: 2,
      lessons: [
        { title: "Anatomy of a Great Prompt", content: "# Great Code Prompts\n\nStructure your prompts for the best results.\n\n## The Format\n```\n[Context] + [Action] + [Constraints] + [Output Format]\n```\n\n## Example\n```\nBad: \"Create a form\"\nGood: \"Create a React contact form with name, email, and message fields. Use zod validation, shadcn/ui components, and handle submission with React Hook Form. Return the complete component code.\"\n```\n\n## Key Principles\n1. **Be specific**: Include tech stack and requirements\n2. **Provide context**: Mention existing patterns\n3. **Set constraints**: Performance, accessibility, bundle size\n4. **Define output**: File structure, naming conventions", isFree: true },
        { title: "Context-Aware Prompting", content: "# Giving Cursor Context\n\nThe quality of AI output depends on the context you provide.\n\n## Using @ References\n- `@file` — Reference specific files\n- `@folder` — Include entire directories\n- `@web` — Search the web for current info\n- `@docs` — Reference documentation\n\n## Project Context Files\nCreate a `.cursorrules` file:\n```\nYou are a senior React/TypeScript developer.\n\nCode Style:\n- Use functional components with hooks\n- Prefer type over interface\n- Use named exports\n- Follow the existing project patterns\n```", isFree: false },
      ],
    },
    {
      title: "Building Production Features",
      description: "Use Cursor to build complete, production-ready features.",
      order: 3,
      lessons: [
        { title: "Authentication System", content: "# Building Auth with AI\n\nGenerate a complete authentication system.\n\n## Use Composer Mode\nOpen Composer (Cmd+Shift+I) and prompt:\n```\nCreate a complete authentication system using Next.js App Router, Lucia auth, Prisma, and PostgreSQL. Include:\n- Login/signup pages with validation\n- Email verification flow\n- Password reset\n- Session management\n- Protected route middleware\n```\n\n## Review Security\nAlways review AI-generated auth code:\n- Password hashing\n- CSRF protection\n- Rate limiting\n- Input sanitization", isFree: false },
        { title: "Database Schema & API Routes", content: "# Database with AI\n\nLet Cursor help design and implement your database layer.\n\n## Schema Design\n```\nCreate a Prisma schema for a SaaS app with:\n- Users with roles (admin, user)\n- Teams with memberships\n- Projects with CRUD\n- Subscriptions with Stripe\n```\n\n## API Routes\n```\nCreate Next.js API routes for:\n- GET /api/projects — list with pagination\n- POST /api/projects — create (auth required)\n- PUT /api/projects/:id — update\n- DELETE /api/projects/:id — soft delete\n```", isFree: false },
      ],
    },
  ],
  "nextjs-saas-foundations": [
    {
      title: "Project Setup & Architecture",
      description: "Set up your Next.js SaaS foundation with all the right tools.",
      order: 1,
      lessons: [
        { title: "Next.js 14 App Router Deep Dive", content: "# Next.js App Router\n\nUnderstanding the new App Router architecture.\n\n## Key Concepts\n- **Server Components**: Default, run on server\n- **Client Components**: Interactive, 'use client'\n- **Layouts**: Shared UI, persist across routes\n- **Loading & Error**: Built-in states\n\n## Project Structure\n```\nsrc/\n  app/\n    layout.tsx    # Root layout\n    page.tsx      # Home page\n    (auth)/       # Auth route group\n      login/\n      signup/\n    dashboard/    # Protected routes\n      layout.tsx\n      page.tsx\n  components/\n  lib/\n  hooks/\n```", isFree: true },
        { title: "Tailwind CSS Design System Setup", content: "# Setting Up Tailwind\n\nCreate a consistent design system.\n\n## Tailwind Config\n```ts\n// tailwind.config.ts\nexport default {\n  theme: {\n    extend: {\n      colors: {\n        brand: {\n          50: '#eff6ff',\n          500: '#3b82f6',\n          900: '#1e3a5f',\n        },\n      },\n    },\n  },\n};\n```\n\n## shadcn/ui Setup\n```bash\nnpx shadcn-ui@latest init\n```\n\n## Component Library\nBuild reusable components: Button, Input, Card, Modal, etc.", isFree: true },
      ],
    },
    {
      title: "Authentication & User Management",
      description: "Implement secure authentication with multiple providers.",
      order: 2,
      lessons: [
        { title: "NextAuth.js Integration", content: "# Authentication with NextAuth\n\nSet up NextAuth.js with multiple providers.\n\n## Installation\n```bash\nnpm install next-auth @auth/core\n```\n\n## Provider Setup\n- Google OAuth\n- GitHub OAuth\n- Email magic links\n- Credentials provider\n\n## Database Adapter\n```ts\nimport { PrismaAdapter } from '@auth/prisma-adapter'\n\nexport const authOptions = {\n  adapter: PrismaAdapter(prisma),\n  providers: [/* ... */],\n}\n```", isFree: true },
      ],
    },
  ],
  "seo-authority-system": [
    {
      title: "SEO Fundamentals",
      description: "Learn the core principles of technical SEO.",
      order: 1,
      lessons: [
        { title: "How Search Engines Work", content: "# Search Engine Fundamentals\n\nUnderstand how search engines discover, index, and rank content.\n\n## The Crawl-Index-Rank Pipeline\n1. **Crawling**: Bots discover URLs via links and sitemaps\n2. **Indexing**: Content is processed and stored in the index\n3. **Ranking**: Algorithm determines position for queries\n\n## Key Ranking Factors\n- Content relevance\n- Page speed (Core Web Vitals)\n- Mobile-friendliness\n- Backlink quality\n- Structured data\n\n## Technical Foundation\n- Robots.txt management\n- XML sitemaps\n- Canonical URLs\n- Hreflang for international", isFree: true },
        { title: "Technical Audit & Crawl Analysis", content: "# SEO Technical Audit\n\nPerform a comprehensive technical audit.\n\n## Audit Checklist\n- [ ] Crawl the site with Screaming Frog\n- [ ] Check robots.txt for issues\n- [ ] Review XML sitemap coverage\n- [ ] Test page speed (Lighthouse)\n- [ ] Validate structured data\n- [ ] Check mobile usability\n- [ ] Review redirect chains\n\n## Tools\n- Screaming Frog SEO Spider\n- Google Search Console\n- Lighthouse\n- Ahrefs/SEMrush", isFree: true },
      ],
    },
  ],
};

async function seed() {
  console.log(`Seeding courses into database: ${dbId}...`);

  for (const course of courses) {
    const courseRef = db.collection("courses").doc(course.id);
    const { id: courseId, ...courseData } = course;
    await courseRef.set({
      ...courseData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`✅ Course seeded: ${course.title} (${course.id})`);

    const mods = modulesData[course.id] || [];
    for (const mod of mods) {
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
        console.log(`    ✅ Lesson: ${lesson.title}`);
      }
    }
  }

  console.log("Course seeding completed!");
}

seed().catch(console.error);
