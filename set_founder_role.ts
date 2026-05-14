import admin from "firebase-admin";
import fs from "fs";
import dotenv from "dotenv";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config({ path: ".env.local" });

const serviceAccountPath = "./service-account.json";
if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
}

const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "(default)";
const db = getFirestore(admin.app(), dbId);

async function setFounderRole() {
  const founderUid = "80OJfcmVXCRNmSZuthVU68K6vJq2";
  
  try {
    const userRef = db.collection("users").doc(founderUid);
    await userRef.set({
      uid: founderUid,
      role: "founder",
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log("✅ Founder role successfully applied to UID:", founderUid);
  } catch (error) {
    console.error("❌ Error setting founder role:", error);
  }
}

setFounderRole();
