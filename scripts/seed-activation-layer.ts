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

async function activateBlueprints() {
  console.log('\n=== ACTIVATING BLUEPRINTS ===\n');

  const snap = await db.collection('products').where('status', '==', 'DRAFT_SEED').get();

  if (snap.empty) {
    console.log('No DRAFT_SEED blueprints found. Checking for other statuses...');
    const allSnap = await db.collection('products').limit(20).get();
    allSnap.forEach(doc => {
      const data = doc.data();
      console.log(`  Found: ${data.title || doc.id} → status: ${data.status || 'unset'}, isPublished: ${data.isPublished}`);
    });
    return;
  }

  let count = 0;
  const batch = db.batch();

  snap.forEach(doc => {
    const data = doc.data();
    console.log(`  Activating: ${data.title} (${doc.id}) → COMING_SOON`);
    batch.update(doc.ref, {
      status: 'COMING_SOON',
      isPublished: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    count++;
  });

  await batch.commit();
  console.log(`\n✅ ${count} blueprints activated to COMING_SOON status.`);
  console.log('They will now appear in the UI with a lock overlay and "Coming Soon" badge.');
}

async function activateCourses() {
  console.log('\n=== ACTIVATING COURSES ===\n');

  const courseSnap = await db.collection('courses').get();
  let updatedCount = 0;

  for (const courseDoc of courseSnap.docs) {
    const courseData = courseDoc.data();
    console.log(`\nCourse: ${courseData.title} (${courseDoc.id})`);

    const modSnap = await db.collection('modules')
      .where('courseId', '==', courseDoc.id)
      .orderBy('order', 'asc')
      .get();

    for (const modDoc of modSnap.docs) {
      const modData = modDoc.data();
      const lesSnap = await db.collection('lessons')
        .where('courseId', '==', courseDoc.id)
        .where('moduleId', '==', modDoc.id)
        .orderBy('order', 'asc')
        .get();

      let emptyLessons = 0;
      for (const lesDoc of lesSnap.docs) {
        const lesData = lesDoc.data();
        const isEmpty = !lesData.videoUrl && (!lesData.content || lesData.content.trim() === '') && (!lesData.resources || lesData.resources.length === 0);

        if (isEmpty) {
          console.log(`  📝 Marking empty lesson: ${lesData.title}`);
          emptyLessons++;
        }
      }

      if (lesSnap.empty || emptyLessons === lesSnap.size) {
        console.log(`  📦 Module "${modData.title}" → all lessons are empty/placeholder status`);
      }
    }

    // If course has no modules, ensure it has a placeholder
    if (modSnap.empty) {
      console.log(`  ⚠️ Course has no modules. Adding placeholder module...`);
      const placeholderModRef = db.collection('modules').doc();
      await placeholderModRef.set({
        courseId: courseDoc.id,
        title: 'Course Content',
        description: 'This course is being built. Modules and lessons will appear here once published.',
        order: 1,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Add a single coming-soon lesson
      const placeholderLesRef = db.collection('lessons').doc();
      await placeholderLesRef.set({
        courseId: courseDoc.id,
        moduleId: placeholderModRef.id,
        title: '[Coming Soon] Course content in production',
        description: 'This lesson is being prepared. Full video recording, documentation, and resources will be available soon.',
        videoUrl: '',
        content: '',
        isFree: true,
        order: 1,
        isPublished: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      updatedCount++;
    }
  }

  console.log(`\n✅ Course activation complete. ${updatedCount} placeholder structures added.`);
}

async function activateWorkshops() {
  console.log('\n=== ACTIVATING WORKSHOPS ===\n');

  const snap = await db.collection('workshops').get();

  if (snap.empty) {
    console.log('No workshops found. Use seed-workshops.ts to create initial workshops.');
    return;
  }

  let count = 0;
  snap.forEach(doc => {
    const data = doc.data();
    if (!data.status) {
      console.log(`  Setting UPCOMING status for: ${data.title || doc.id}`);
      doc.ref.update({
        status: 'UPCOMING',
        isPublished: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      count++;
    } else {
      console.log(`  ✅ Already has status: ${data.status} — ${data.title || doc.id}`);
    }
  });

  console.log(`\n✅ ${count} workshops updated with UPCOMING status.`);
  console.log(`   Total workshops in DB: ${snap.size}`);
}

async function main() {
  console.log('🚀 CONTENT ACTIVATION LAYER SEED\n');
  console.log(`Target database: ${dbId}\n`);

  await activateBlueprints();
  await activateCourses();
  await activateWorkshops();

  console.log('\n=== ACTIVATION COMPLETE ===');
  console.log('All content is now "alive, but in progress."');
  console.log('• Blueprints: COMING_SOON with lock overlay');
  console.log('• Courses: Coming Soon placeholders for empty lessons');
  console.log('• Workshops: UPCOMING status badges with structured info');
}

main().catch(console.error);
