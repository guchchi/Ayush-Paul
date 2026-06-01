import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getFirestore } from "firebase-admin/firestore";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, "../service-account.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore(admin.app(), "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a");

async function verify() {
  const mdDir = path.resolve(__dirname, "../src/content/blog");
  const mdFiles = fs.existsSync(mdDir) ? fs.readdirSync(mdDir).filter(f => f.endsWith(".md")) : [];
  
  const canonicalData = mdFiles.map(file => {
    const filePath = path.join(mdDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = matter(content);
    return {
      id: parsed.data.slug || file.replace(".md", ""),
      title: parsed.data.title,
      category: parsed.data.category,
    };
  });

  const fbProjects = await db.collection("projects").get();
  const fbBlogs = await db.collection("blogPosts").get();

  const firebaseData = {
    projects: fbProjects.docs.map(d => ({ id: d.id, title: d.data().title })),
    blogs: fbBlogs.docs.map(d => ({ id: d.id, title: d.data().title })),
  };

  const report = {
    canonical: canonicalData,
    firebase: firebaseData,
    diff: {
      extraInProjects: [] as string[],
      missingFromProjects: [] as string[],
      extraInBlogs: [] as string[],
      missingFromBlogs: [] as string[],
      mismatches: [] as any[]
    }
  };

  // Compare blogs
  for (const fbBlog of firebaseData.blogs) {
    const canonical = canonicalData.find(c => c.id === fbBlog.id);
    if (!canonical) {
      report.diff.extraInBlogs.push(fbBlog.id);
    } else if (canonical.title !== fbBlog.title) {
      report.diff.mismatches.push({ collection: 'blogPosts', id: fbBlog.id, fbTitle: fbBlog.title, mdTitle: canonical.title });
    }
  }
  for (const c of canonicalData) {
    if (!firebaseData.blogs.find(fb => fb.id === c.id)) {
      report.diff.missingFromBlogs.push(c.id);
    }
  }

  // Compare projects (Assuming all MD files that are 'Robotics' should be in projects)
  const canonicalProjects = canonicalData.filter(c => c.category === "Robotics" || c.category === "Environmental Innovation");
  for (const fbProj of firebaseData.projects) {
    const canonical = canonicalProjects.find(c => c.id === fbProj.id);
    if (!canonical) {
      report.diff.extraInProjects.push(fbProj.id);
    } else if (canonical.title !== fbProj.title) {
      report.diff.mismatches.push({ collection: 'projects', id: fbProj.id, fbTitle: fbProj.title, mdTitle: canonical.title });
    }
  }
  for (const c of canonicalProjects) {
    if (!firebaseData.projects.find(fb => fb.id === c.id)) {
      report.diff.missingFromProjects.push(c.id);
    }
  }

  console.log(JSON.stringify(report, null, 2));
}

verify().catch(console.error);
