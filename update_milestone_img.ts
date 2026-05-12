import admin from "firebase-admin";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

const serviceAccountPath = "./service-account.json";
if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
}

import { getFirestore } from "firebase-admin/firestore";

const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "(default)";
const db = getFirestore(admin.app(), dbId);

async function updateMilestoneImage() {
  try {
    const docRef = db.collection("content").doc("milestones");
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      let items = docSnap.data().items || [];
      const index = items.findIndex(item => item.title.includes("INSPIRE Awards"));
      
      if (index !== -1) {
        items[index].image = "/assets/milestones/inspire-award.png";
        await docRef.set({ items }, { merge: true });
        console.log("Milestone image updated successfully in Firestore!");
      } else {
        console.log("Milestone not found in Firestore.");
      }
    } else {
      console.log("Milestones document does not exist.");
    }
  } catch (error) {
    console.error("Error updating milestone image:", error);
  }
}

updateMilestoneImage();
