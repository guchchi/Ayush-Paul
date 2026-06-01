import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

import { getFirestore } from "firebase-admin/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin using service-account.json
const serviceAccountPath = path.resolve(__dirname, "../service-account.json");
if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ service-account.json not found in root directory.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore(admin.app(), "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a");

async function migrateBlogs() {
  console.log("🚀 Starting blog migration from Firestore to local Markdown...");

  try {
    const snapshot = await db.collection("blogPosts").get();
    
    if (snapshot.empty) {
      console.log("No blog posts found in Firestore.");
      return;
    }

    const outputDir = path.resolve(__dirname, "../src/content/blog");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let count = 0;
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      const slug = data.slug || doc.id;
      const fileName = `${slug}.md`;
      const filePath = path.join(outputDir, fileName);

      // Handle timestamps
      let dateString = new Date().toISOString();
      if (data.createdAt && data.createdAt.toDate) {
        dateString = data.createdAt.toDate().toISOString();
      } else if (data.createdAt && data.createdAt._seconds) {
        dateString = new Date(data.createdAt._seconds * 1000).toISOString();
      } else if (typeof data.createdAt === 'string') {
        dateString = data.createdAt;
      }

      // Handle tags array
      let tagsArray: string[] = [];
      if (Array.isArray(data.tags)) {
        tagsArray = data.tags;
      } else if (typeof data.tags === 'string') {
        tagsArray = data.tags.split(',').map((t: string) => t.trim());
      }

      // Construct Frontmatter
      const frontmatter = {
        title: data.title || "Untitled",
        slug: slug,
        description: data.description || data.excerpt || "",
        date: dateString,
        tags: tagsArray,
        category: data.category || "",
        coverImage: data.coverImage || data.seo?.ogImage || "",
        author: data.author?.name || "Ayush Paul",
        published: data.published !== false,
      };

      // Construct Markdown Content
      let content = "";
      if (data.content) {
        content = data.content;
      } else if (data.blocks && Array.isArray(data.blocks)) {
        // Very basic block to markdown converter if using blocks
        content = data.blocks.map((block: any) => {
          if (block.type === 'text') return block.content;
          if (block.type === 'heading') return `${'#'.repeat(block.metadata?.level || 2)} ${block.content}`;
          if (block.type === 'image') return `![${block.metadata?.alt || ''}](${block.content})`;
          if (block.type === 'code') return `\`\`\`${block.metadata?.language || ''}\n${block.content}\n\`\`\``;
          if (block.type === 'quote') return `> ${block.content}`;
          return block.content;
        }).join('\n\n');
      }

      // Create markdown file with gray-matter
      const markdownContent = matter.stringify(content, frontmatter);
      
      fs.writeFileSync(filePath, markdownContent, "utf-8");
      console.log(`✅ Migrated: ${fileName}`);
      count++;
    }

    console.log(`\n🎉 Migration Complete! ${count} blogs converted to Markdown.`);
    
  } catch (error) {
    console.error("❌ Error migrating blogs:", error);
  } finally {
    process.exit(0);
  }
}

migrateBlogs();
