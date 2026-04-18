import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot, addDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Import the Firebase configuration
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
console.log("🔐 Auth initialized:", auth);
export const storage = getStorage(app);

// Phase 2: Storage Bucket Validation
console.log("🔥 Firebase Storage Bucket:", storage.app.options.storageBucket);

export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
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
  ref,
  uploadBytes,
  getDownloadURL,
  getDocFromServer
};
