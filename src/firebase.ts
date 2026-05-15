import { initializeApp } from 'firebase/app';
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, 
  getRedirectResult, signOut, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot, addDoc, serverTimestamp, getDocFromServer, limit, arrayUnion } from 'firebase/firestore';
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
  authDomain: firebaseConfig.authDomain,
  databaseId: firebaseConfig.firestoreDatabaseId,
  isConfigured,
  missingVars,
  mode: import.meta.env.MODE,
  isProduction: import.meta.env.PROD
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// --- Solo Founder Architecture Guardrails ---

const isPublicRoute = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname;
  return !path.startsWith('/dashboard') && !path.startsWith('/admin') && !path.startsWith('/lab/dashboard');
};

const monitoredGetDoc = async (...args: Parameters<typeof getDoc>) => {
  if (import.meta.env.DEV) {
    console.log("%c📊 [QUOTA] Firestore Read: getDoc", "color: #00C2FF; font-weight: bold;");
  }
  return getDoc(...args);
};

const monitoredGetDocs = async (...args: Parameters<typeof getDocs>) => {
  if (import.meta.env.DEV) {
    console.log("%c📊 [QUOTA] Firestore Read: getDocs", "color: #00C2FF; font-weight: bold;");
  }
  return getDocs(...args);
};

const monitoredOnSnapshot = (...args: Parameters<typeof onSnapshot>) => {
  if (isPublicRoute()) {
    console.warn("%c🚨 [GUARD] Accidental onSnapshot detected on public route! Use getDocs + Cache instead to save quota.", "color: #FF0055; font-weight: bold;");
  }
  if (import.meta.env.DEV) {
    console.log("%c📡 [LISTENER] Firestore onSnapshot active", "color: #FFCC00; font-weight: bold;");
  }
  return onSnapshot(...args);
};

export { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  collection,  
  doc, 
  monitoredGetDoc as getDoc, 
  monitoredGetDocs as getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  monitoredOnSnapshot as onSnapshot,
  addDoc,
  serverTimestamp,
  getDocFromServer,
  limit,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  arrayUnion
};

