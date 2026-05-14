import admin from "firebase-admin";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

const serviceAccountPath = "./service-account.json";
if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} else {
  console.error("Missing service-account.json");
  process.exit(1);
}

import { getFirestore } from "firebase-admin/firestore";

const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "(default)";
const db = getFirestore(admin.app(), dbId);

async function checkSpecificBlog() {
  const slug = "how-teachers-can-make-money-online-in-2026";
  const snapshot = await db.collection("blogPosts").where("slug", "==", slug).get();
  
  if (snapshot.empty) {
    console.log("No post found with slug:", slug);
    return;
  }

  const post = snapshot.docs[0].data();
  console.log("Title:", post.title);
  console.log("Blocks:", JSON.stringify(post.blocks, null, 2));
}

checkSpecificBlog();
