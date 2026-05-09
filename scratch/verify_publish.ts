import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(fs.readFileSync('./service-account.json', 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = getFirestore('ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a');

async function verify() {
  const slug = 'stubble-solution-innovation-journey';
  const doc = await db.collection('blogPosts').doc(slug).get();
  if (doc.exists) {
    const data = doc.data();
    console.log('Document found!');
    console.log('Title:', data.title);
    console.log('Block count:', data.blocks.length);
    console.log('Cover Image:', data.coverImage);
  } else {
    console.log('Document NOT found!');
  }
}

verify();
