import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getFirestore } from "firebase-admin/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, "../service-account.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore(admin.app(), "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a");

async function inspect() {
  const projects = await db.collection("projects").get();
  console.log("PROJECTS:");
  projects.docs.forEach(doc => console.log(doc.id, doc.data().title));
  
  const blogs = await db.collection("blogPosts").get();
  console.log("BLOG POSTS:");
  blogs.docs.forEach(doc => console.log(doc.id, doc.data().title));
}
inspect().catch(console.error);
