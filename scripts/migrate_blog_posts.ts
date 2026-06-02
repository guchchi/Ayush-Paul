import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import fs from 'fs';

dotenv.config();
dotenv.config({ path: '.env.local' });

async function migrate() {
  if (admin.apps.length === 0) {
    const serviceAccountPath = path.resolve(process.cwd(), "service-account.json");
    if (fs.existsSync(serviceAccountPath)) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath)
      });
    } else {
      admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });
    }
  }

  const firestoreDbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID;
  const db = getFirestore(admin.app(), firestoreDbId);
  console.log("Connected to Firestore for Migration. DB ID:", firestoreDbId || "(default)");

  // Fetch blogPosts
  const srcSnap = await db.collection("blogPosts").get();
  console.log(`Found ${srcSnap.size} posts in 'blogPosts'. Migrating to 'blogs'...`);

  for (const srcDoc of srcSnap.docs) {
    const data = srcDoc.data();
    
    // Unify content blocks to plain text if needed, or keep blocks inside the document
    const textContent = data.content || (data.blocks || [])
      .filter((b: any) => b.type === "text" || b.type === "heading")
      .map((b: any) => (typeof b.content === "string" ? b.content.replace(/<[^>]*>/g, "") : ""))
      .join(" ");

    const tagsArray = Array.isArray(data.tags) 
      ? data.tags 
      : (data.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean);

    const destData = {
      title: data.title || "",
      slug: data.slug || srcDoc.id,
      excerpt: data.description || data.excerpt || "",
      content: textContent,
      coverImage: data.coverImage || "",
      category: data.category || "General",
      tags: tagsArray,
      seoTitle: data.seo?.title || data.seoTitle || data.title || "",
      seoDescription: data.seo?.description || data.seoDescription || data.description || "",
      status: data.published ? "published" : "draft",
      featured: data.featured || false,
      createdAt: data.createdAt || admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: data.updatedAt || admin.firestore.FieldValue.serverTimestamp(),
      blocks: data.blocks || [] // Preserve blocks for rich editing
    };

    await db.collection("blogs").doc(destData.slug).set(destData);
    console.log(` Migrated post: ${destData.slug} -> blogs`);
  }

  console.log("Migration complete!");
}

migrate().then(() => process.exit(0)).catch(console.error);
