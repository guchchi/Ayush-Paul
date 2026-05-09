import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(fs.readFileSync('./service-account.json', 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gen-lang-client-0017546884.appspot.com'
  });
}

const db = getFirestore('ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a');
const bucket = getStorage().bucket();

async function publish() {
  try {
    // 1. Read Payload
    const payloadPath = './scratch/auto-publish-payload.json';
    const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
    const { type, data } = payload;

    // 2. Upload Image if it's a local path
    const localImagePath = 'C:/Users/ap877/.gemini/antigravity/brain/2ab96d65-1ee8-484b-88eb-f643019a8198/stubble_solution_cover_1778312698268.png';
    if (fs.existsSync(localImagePath)) {
      try {
        console.log('Uploading cover image...');
        const destination = `blog-covers/${Date.now()}_${path.basename(localImagePath)}`;
        await bucket.upload(localImagePath, {
          destination,
          public: true,
          metadata: {
            contentType: 'image/png',
          },
        });
        
        // Construct public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
        data.coverImage = publicUrl;
        console.log('Cover image uploaded:', publicUrl);
      } catch (imgError) {
        console.error('Image upload failed, using fallback:', imgError);
        data.coverImage = 'https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?q=80&w=2000';
      }
    }

    // 3. Publish to Firestore
    const collectionName = type === 'project' ? 'projects' : 'blogPosts';
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    console.log(`Publishing ${type} with slug: ${slug}...`);
    
    await db.collection(collectionName).doc(slug).set({
      ...data,
      slug,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: data.createdAt || admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log('Successfully published!');
  } catch (error) {
    console.error('Failed to publish:', error);
  }
}

publish();
