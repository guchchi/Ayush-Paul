import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
let credential;

if (fs.existsSync(serviceAccountPath)) {
  credential = admin.credential.cert(serviceAccountPath);
} else {
  credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}'));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential,
  });
}

const dbId = "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a";
const db = getFirestore(admin.app(), dbId);

async function inspectUser() {
  const email = process.argv[2] || process.env.TARGET_EMAIL;
  if (!email) {
    console.log("⚠️  Usage: npx tsx scripts/inspect-user.ts <user-email> or set TARGET_EMAIL in environment.");
    return;
  }
  console.log(`Inspecting user with email: ${email} in database: ${dbId}`);
  
  const snapshot = await db.collection("users").where("email", "==", email).get();
  
  if (snapshot.empty) {
    console.log("User not found by email.");
    // Try to list all users to see what's there
    const allUsers = await db.collection("users").limit(10).get();
    console.log(`Listing first ${allUsers.size} users:`);
    allUsers.docs.forEach(doc => {
      console.log(`- ID: ${doc.id}, Email: ${doc.data().email}, Owned:`, doc.data().ownedProducts);
    });
    return;
  }

  snapshot.docs.forEach(doc => {
    console.log(`User ID: ${doc.id}`);
    console.log("Data:", JSON.stringify(doc.data(), null, 2));
  });
}

inspectUser().catch(console.error);
