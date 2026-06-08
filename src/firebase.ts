import { initializeApp } from 'firebase/app';
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, 
  getRedirectResult, signOut, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot, addDoc, serverTimestamp, getDocFromServer, limit, arrayUnion } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from './config/firebase-config';

if (!firebaseConfig.projectId || firebaseConfig.projectId === "MISSING_PROJECT") {
  console.warn("⚠️ [SYSTEM HEALTH] Firebase is NOT configured.");
}

// Initialize Firebase SDK Fail-Safe
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// --- Solo Founder Architecture Guardrails ---

const isPublicRoute = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname;
  return !path.startsWith('/dashboard') && !path.startsWith('/admin') && !path.startsWith('/lab/dashboard') && !path.startsWith('/vault');
};

const monitoredGetDoc = ((...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log("%c📊 [QUOTA] Firestore Read: getDoc", "color: #00C2FF; font-weight: bold;");
  }
  return (getDoc as any)(...args);
}) as unknown as typeof getDoc;

const monitoredGetDocs = ((...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log("%c📊 [QUOTA] Firestore Read: getDocs", "color: #00C2FF; font-weight: bold;");
  }
  return (getDocs as any)(...args);
}) as unknown as typeof getDocs;

const monitoredOnSnapshot = ((...args: any[]) => {
  if (isPublicRoute()) {
    console.warn("%c🚨 [GUARD] Accidental onSnapshot detected on public route! Use getDocs + Cache instead to save quota.", "color: #FF0055; font-weight: bold;");
  }
  if (import.meta.env.DEV) {
    console.log("%c📡 [LISTENER] Firestore onSnapshot active", "color: #FFCC00; font-weight: bold;");
  }
  return (onSnapshot as any)(...args);
}) as unknown as typeof onSnapshot;

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

