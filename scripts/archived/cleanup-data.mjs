import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';

// Load Service Account
const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore(app, 'ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a');

const FALLBACK_PROJECTS = [
  {
    id: 'wro-robotics',
    category: 'Robotics & Automation',
    title: 'Autonomous WRO Robots',
    proofTag: 'World Robot Olympiad',
    accomplishment: 'Shipped custom autonomous robotics systems with low-latency sensor feedback and closed-loop motor controls.',
    outcome: 'Deployed real-time PID tracking models for national robotics competitions.',
    image: '/assets/projects/wro-robot.jpg',
    slug: 'wro-robotics',
    ctaText: 'View Robotics Case Study',
    featured: true,
    published: true,
    source: 'canonical'
  },
  {
    id: 'inspire-solar',
    category: 'Research & Telemetry',
    title: 'Remote Solar Load Telemetry',
    proofTag: 'DST INSPIRE Award',
    accomplishment: 'Developed an automated solar load balancing prototype recognized at the national level.',
    outcome: 'Awarded the DST INSPIRE MANAK award by the Government of India.',
    image: '/assets/projects/inspire-award.png',
    slug: 'inspire-solar',
    ctaText: 'View Telemetry Case Study',
    featured: true,
    published: true,
    source: 'canonical'
  },
  {
    id: 'arduino-embedded',
    category: 'Embedded Systems',
    title: 'Open Microcontroller Blueprints',
    proofTag: 'Open Source Blueprints',
    accomplishment: 'Published fully documented firmware libraries and physical circuit schematics on open repositories.',
    outcome: 'Maintains public firmware repositories and documented circuit layouts that others can inspect, modify, and build upon.',
    image: '/assets/projects/arduino-builds.jpg',
    slug: 'arduino-embedded',
    ctaText: 'Access Open Blueprints',
    featured: true,
    published: true,
    source: 'canonical'
  }
];

const FALLBACK_ARTICLES = [
  {
    id: 'pid-tuning',
    category: 'Robotics',
    title: 'PID Tuning for Autonomous Rovers',
    date: 'March 2024',
    readTime: '6 min read',
    description: 'A deep dive into closed-loop control systems and eliminating oscillation in high-speed line tracking.',
    slug: 'pid-tuning-guide',
    featured: true,
    published: true,
    source: 'canonical'
  },
  {
    id: 'solar-telemetry',
    category: 'Embedded Systems',
    title: 'Building a Remote Solar Telemetry Node',
    date: 'February 2024',
    readTime: '8 min read',
    description: 'Architecture breakdown of the sensor array used in the DST INSPIRE award-winning project.',
    slug: 'solar-telemetry-architecture',
    featured: true,
    published: true,
    source: 'canonical'
  },
  {
    id: 'firmware-architecture',
    category: 'Software Engineering',
    title: 'Structuring Scalable Arduino Firmware',
    date: 'January 2024',
    readTime: '5 min read',
    description: 'Moving beyond single-file scripts: how to architect modular C++ libraries for hardware abstraction.',
    slug: 'scalable-arduino-firmware',
    featured: true,
    published: true,
    source: 'canonical'
  }
];

async function runCleanup() {
  console.log("Starting Firebase Admin Cleanup...");
  let deletedCount = 0;

  // Cleanup projects
  const projectsSnapshot = await db.collection('projects').get();
  for (const docSnap of projectsSnapshot.docs) {
    const data = docSnap.data();
    if (!data.title || data.title === 'Test' || data.isTest || data.title.toLowerCase().includes('make money')) {
      await db.collection('projects').doc(docSnap.id).delete();
      console.log(`Deleted spam project: ${docSnap.id}`);
      deletedCount++;
    }
  }

  // Cleanup blogPosts
  const blogsSnapshot = await db.collection('blogPosts').get();
  for (const docSnap of blogsSnapshot.docs) {
    const data = docSnap.data();
    if (!data.title || data.title === 'Test' || data.isTest || data.title.toLowerCase().includes('make money')) {
      await db.collection('blogPosts').doc(docSnap.id).delete();
      console.log(`Deleted spam blog: ${docSnap.id}`);
      deletedCount++;
    }
  }

  console.log(`Deleted ${deletedCount} spam documents.`);

  // Upload canonical data
  console.log("Pushing canonical fallback data to ensure valid state...");
  const batch = db.batch();
  for (const p of FALLBACK_PROJECTS) {
    const docRef = db.collection('projects').doc(p.id);
    batch.set(docRef, {
      ...p,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'Live / Scale'
    });
  }
  for (const a of FALLBACK_ARTICLES) {
    const docRef = db.collection('blogPosts').doc(a.id);
    batch.set(docRef, {
      ...a,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
  console.log("Canonical data seeded successfully.");
  process.exit(0);
}

runCleanup().catch(console.error);
