import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  deleteUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where, 
  limit 
} from 'firebase/firestore';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

// 1. Initialize Firebase Admin (for cleanup and setup)
const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
let credential;
if (fs.existsSync(serviceAccountPath)) {
  credential = admin.credential.cert(serviceAccountPath);
} else {
  credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}'));
}

if (!admin.apps.length) {
  admin.initializeApp({ credential });
}
const adminDb = getAdminFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID);

// 2. Client config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, process.env.VITE_FIREBASE_FIRESTORE_DB_ID);

async function runTests() {
  console.log("\n🧪 --- RUNNING DIGITAL DELIVERY INTEGRATION & SECURITY TESTS --- 🧪\n");

  const testEmail = `test_${Math.floor(Math.random() * 100000)}@test.com`;
  const testPassword = "testPassword123!";
  let testUid = "";
  let userCredential: any = null;

  try {
    // --- STEP 1: CREATE TEST USER (CLIENT SIDE) ---
    console.log(`[Setup] Creating client-side test user: ${testEmail}...`);
    userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    testUid = userCredential.user.uid;
    console.log(`✅ Test user created with UID: ${testUid}\n`);

    // --- STEP 2: AUTHENTICATED READ TESTS (OWN DOCUMENT) ---
    console.log(`[Test 1] Authenticated user reading their own document in /users/${testUid}...`);
    try {
      const ownDocSnap = await getDoc(doc(db, "users", testUid));
      console.log(`✅ SUCCESS: Read own profile successfully (exists: ${ownDocSnap.exists()})`);
    } catch (err: any) {
      console.error(`❌ FAILED: Could not read own profile document:`, err.message);
    }
    console.log("");

    // --- STEP 3: UNAUTHORIZED READ TESTS (OTHER USER'S DOCUMENT) ---
    const otherUid = "N8CwYfUAQBaBN3ohDAPDtPzrfrl1"; // Existing user
    console.log(`[Test 2] Authenticated user reading another user's document in /users/${otherUid}...`);
    try {
      await getDoc(doc(db, "users", otherUid));
      console.error(`❌ FAILED (SECURITY VULNERABILITY): Successfully read another user's profile!`);
    } catch (err: any) {
      if (err.code === 'permission-denied' || err.message.includes('permission-denied')) {
        console.log(`✅ SUCCESS: Blocked with permission-denied (403) as expected.`);
      } else {
        console.error(`❌ FAILED: Unexpected error:`, err.message);
      }
    }
    console.log("");

    // --- STEP 4: PUBLIC CATALOG READS (SYSTEMS CATALOG) ---
    console.log(`[Test 3] Reading public Systems catalog from /products...`);
    try {
      const q = query(collection(db, "products"), where("isPublished", "==", true), limit(1));
      const snap = await getDocs(q);
      console.log(`✅ SUCCESS: Read systems catalog successfully. Count: ${snap.size}`);
    } catch (err: any) {
      console.error(`❌ FAILED: Public read of products failed:`, err.message);
    }
    console.log("");

    // --- STEP 5: SENSITIVE DATA ACCESS CHECKS (/purchases) ---
    console.log(`[Test 4] Public/Authenticated read of purchases collection...`);
    try {
      const q = query(collection(db, "purchases"), limit(1));
      await getDocs(q);
      console.error(`❌ FAILED (SECURITY VULNERABILITY): Read purchases collection successfully! Private purchase data exposed.`);
    } catch (err: any) {
      if (err.code === 'permission-denied' || err.message.includes('permission-denied')) {
        console.log(`✅ SUCCESS: Read of purchases blocked with permission-denied (403) as expected.`);
      } else {
        console.error(`❌ FAILED: Unexpected error:`, err.message);
      }
    }
    console.log("");

    // --- STEP 6: STRIPE webhook / verify session sync simulation ---
    console.log(`[Test 5] Simulating instant purchase synchronization...`);
    const testProductId = "ayu-boat-blueprint";
    const testStripeSessionId = `test_session_${Math.floor(Math.random() * 1000000)}`;

    console.log(`[Simulation] Triggering database write to grant product access...`);
    // Simulate what the Stripe verify-checkout-session API endpoint does under the Admin SDK
    const userRef = adminDb.collection("users").doc(testUid);
    await userRef.set({
      ownedProducts: {
        [testProductId]: "premium"
      },
      purchasedProducts: admin.firestore.FieldValue.arrayUnion(testProductId)
    }, { merge: true });

    // Verify it recorded a purchase
    await adminDb.collection("purchases").add({
      userId: testUid,
      productId: testProductId,
      stripeSessionId: testStripeSessionId,
      amountTotal: 99900,
      currency: "inr",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "completed"
    });

    console.log(`[Simulation] Purchase recorded. Verifying on the client-side...`);
    
    // Now verify on the client side that the ownedProducts are synced instantly!
    const clientUserSnap = await getDoc(doc(db, "users", testUid));
    if (clientUserSnap.exists()) {
      const userData = clientUserSnap.data();
      const owned = userData?.ownedProducts?.[testProductId] === "premium";
      if (owned) {
        console.log(`✅ SUCCESS: Client side read verifies owned product synced instantly! Vault matches correctly.`);
      } else {
        console.error(`❌ FAILED: User document read, but ownership was not correctly mapped.`);
      }
    } else {
      console.error(`❌ FAILED: Client side user document not found.`);
    }
    console.log("");

  } catch (err: any) {
    console.error("Test runner encountered error:", err);
  } finally {
    // --- CLEANUP ---
    if (testUid) {
      console.log(`[Cleanup] Cleaning up test user and document...`);
      try {
        await adminDb.collection("users").doc(testUid).delete();
        // Delete user auth
        await admin.auth().deleteUser(testUid);
        console.log(`✅ Test user data deleted.`);
      } catch (cleanupErr: any) {
        console.warn(`[Cleanup Warning] Could not delete test auth/data:`, cleanupErr.message);
      }
    }
    console.log("\n🧪 --- SECURITY & DIGITAL DELIVERY INTEGRATION TESTS COMPLETE --- 🧪\n");
    process.exit(0);
  }
}

runTests().catch(console.error);
