import { initializeApp } from 'firebase/app';
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, 
  getRedirectResult, signOut, onAuthStateChanged 
} from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot, addDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';

// Construct Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DB_ID || "(default)"
};

// --- Production Diagnostic Engine ---
const isProduction = import.meta.env.PROD;
const missingVars = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value && key !== 'firestoreDatabaseId')
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error("❌ Firebase Configuration Mismatch: Missing environment variables:", missingVars);
} else {
  console.log(`✅ Production Sync: Connected to [${firebaseConfig.projectId}] (${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'})`);
}

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Export environment info helper for UI diagnostics
export const getFirebaseStatus = () => ({
  projectId: firebaseConfig.projectId,
  databaseId: firebaseConfig.firestoreDatabaseId,
  isConfigured: missingVars.length === 0,
  missingVars,
  mode: import.meta.env.MODE
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged,
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocFromServer
};

