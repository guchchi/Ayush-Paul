import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

const db = getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth check
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.PUBLISH_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { type, data } = req.body;

  if (!type || !data) {
    return res.status(400).json({ error: 'Missing type or data' });
  }

  try {
    const collectionName = type === 'project' ? 'projects' : 'blogPosts';
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Use set with merge to ensure we don't create duplicates and can update
    await db.collection(collectionName).doc(slug).set({
      ...data,
      slug,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: data.createdAt || admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    return res.status(200).json({ 
      success: true, 
      message: `${type} published successfully`,
      slug 
    });
  } catch (error: any) {
    console.error('Publish error:', error);
    return res.status(500).json({ error: error.message });
  }
}
