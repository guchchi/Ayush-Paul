import { initializeApp } from 'firebase/app';
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, 
  getRedirectResult, signOut, onAuthStateChanged 
} from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot, addDoc, serverTimestamp, getDocFromServer, limit } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Health Check Layer: Detect environment readiness before bootstrapping
const getRawConfig = () => ({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DB_ID || "(default)"
});

const rawConfig = getRawConfig();
const missingVars = Object.entries(rawConfig)
  .filter(([key, value]) => !value && key !== 'firestoreDatabaseId')
  .map(([key]) => key);

const isConfigured = missingVars.length === 0;

// FAIL-SAFE: If config is missing, initialize with dummy values to prevent early vendor crashes, 
// but flag clearly so the UI can intercept.
const firebaseConfig = isConfigured ? rawConfig : {
  ...rawConfig,
  apiKey: rawConfig.apiKey || "MISSING_KEY",
  projectId: rawConfig.projectId || "MISSING_PROJECT"
};

if (!isConfigured) {
  console.warn("⚠️ [SYSTEM HEALTH] Firebase is NOT configured. Missing:", missingVars);
}

// Initialize Firebase SDK Fail-Safe
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Export environment info helper for UI diagnostics
export const getFirebaseStatus = () => ({
  projectId: firebaseConfig.projectId,
  databaseId: firebaseConfig.firestoreDatabaseId,
  isConfigured,
  missingVars,
  mode: import.meta.env.MODE,
  isProduction: import.meta.env.PROD
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
  getDocFromServer,
  limit,
  ref,
  uploadBytesResumable,
  getDownloadURL
};

