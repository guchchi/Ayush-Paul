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

const PROJECTS_TO_DELETE = [
  "wro-robotics",
  "inspire-solar",
  "arduino-embedded",
  "Y29uGh0BgwjAandsuSwg" // Test
];

const BLOGS_TO_DELETE = [
  "pid-tuning",
  "solar-telemetry",
  "firmware-architecture",
  "v9nX9XIrOZMFpAwrXnVb", // test
  "8aOmFQN7xXEc2E8uGZ8d", // How AI is Changing
  "2pDQDSMaTDwuS4paAznc" // The Magic of Ordinary Days
];

async function reconcile() {
  console.log("Starting reconciliation...");
  
  for (const id of PROJECTS_TO_DELETE) {
    await db.collection("projects").doc(id).delete();
    console.log(`Deleted project: ${id}`);
  }
  
  for (const id of BLOGS_TO_DELETE) {
    await db.collection("blogPosts").doc(id).delete();
    console.log(`Deleted blog: ${id}`);
  }
  
  console.log("Reconciliation complete.");
}

reconcile().catch(console.error);
