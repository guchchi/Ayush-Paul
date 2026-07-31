import { initializeApp } from 'firebase/app';
import * as authModule from 'firebase/auth';
import * as firestoreModule from 'firebase/firestore';
import * as storageModule from 'firebase/storage';
import { firebaseConfig } from './config/firebase-config';

if (!firebaseConfig.projectId || firebaseConfig.projectId === "MISSING_PROJECT") {
  console.warn("⚠️ [SYSTEM HEALTH] Firebase is NOT configured.");
}

// Initialize Firebase SDK Fail-Safe
const app = initializeApp(firebaseConfig);
export const db = firestoreModule.getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = authModule.getAuth(app);
export const storage = storageModule.getStorage(app);

export const googleProvider = new authModule.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// --- Solo Founder Architecture Guardrails ---

const isPublicRoute = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname;
  return !path.startsWith('/dashboard') && !path.startsWith('/admin') && !path.startsWith('/lab/dashboard') && !path.startsWith('/vault');
};

export const getDoc = ((...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log("%c📊 [QUOTA] Firestore Read: getDoc", "color: #00C2FF; font-weight: bold;");
  }
  return (firestoreModule.getDoc as any)(...args);
}) as unknown as typeof firestoreModule.getDoc;

export const getDocs = ((...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log("%c📊 [QUOTA] Firestore Read: getDocs", "color: #00C2FF; font-weight: bold;");
  }
  return (firestoreModule.getDocs as any)(...args);
}) as unknown as typeof firestoreModule.getDocs;

export const onSnapshot = ((...args: any[]) => {
  if (isPublicRoute()) {
    console.warn("%c🚨 [GUARD] Accidental onSnapshot detected on public route! Use getDocs + Cache instead to save quota.", "color: #FF0055; font-weight: bold;");
  }
  if (import.meta.env.DEV) {
    console.log("%c📡 [LISTENER] Firestore onSnapshot active", "color: #FFCC00; font-weight: bold;");
  }
  return (firestoreModule.onSnapshot as any)(...args);
}) as unknown as typeof firestoreModule.onSnapshot;

// Firestore exports
export const collection = firestoreModule.collection;
export const doc = firestoreModule.doc;
export const setDoc = firestoreModule.setDoc;
export const updateDoc = firestoreModule.updateDoc;
export const deleteDoc = firestoreModule.deleteDoc;
export const query = firestoreModule.query;
export const orderBy = firestoreModule.orderBy;
export const where = firestoreModule.where;
export const addDoc = firestoreModule.addDoc;
export const serverTimestamp = firestoreModule.serverTimestamp;
export const limit = firestoreModule.limit;

// Auth exports
export const signInWithPopup = authModule.signInWithPopup;
export const signInWithRedirect = authModule.signInWithRedirect;
export const getRedirectResult = authModule.getRedirectResult;
export const signOut = authModule.signOut;
export const onAuthStateChanged = authModule.onAuthStateChanged;
export const createUserWithEmailAndPassword = authModule.createUserWithEmailAndPassword;
export const signInWithEmailAndPassword = authModule.signInWithEmailAndPassword;

// Storage exports
export const ref = storageModule.ref;
export const uploadBytesResumable = storageModule.uploadBytesResumable;
export const getDownloadURL = storageModule.getDownloadURL;
