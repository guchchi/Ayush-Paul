const getRawConfig = () => ({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a"
});

const rawConfig = getRawConfig();
const missingVars = Object.entries(rawConfig)
  .filter(([key, value]) => !value && key !== 'firestoreDatabaseId')
  .map(([key]) => key);

const isConfigured = missingVars.length === 0;

export const firebaseConfig = isConfigured ? rawConfig : {
  ...rawConfig,
  apiKey: rawConfig.apiKey || "MISSING_KEY",
  projectId: rawConfig.projectId || "MISSING_PROJECT"
};

export const getFirebaseStatus = () => ({
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  databaseId: firebaseConfig.firestoreDatabaseId,
  isConfigured,
  missingVars,
  mode: import.meta.env.MODE,
  isProduction: import.meta.env.PROD
});
