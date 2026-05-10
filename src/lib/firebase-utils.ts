import { auth } from "../firebase";
import { OperationType, FirestoreErrorInfo } from "../types";

export function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const isQuotaExceeded = errorMessage.toLowerCase().includes("quota exceeded") || 
                          errorMessage.toLowerCase().includes("resource exhausted");

  const errInfo = {
    error: errorMessage,
    isQuotaExceeded,
    timestamp: new Date().toISOString(),
    operationType,
    path,
    auth: {
      uid: auth.currentUser?.uid,
      loggedIn: !!auth.currentUser
    }
  };

  if (isQuotaExceeded) {
    console.warn("⚠️ FIRESTORE QUOTA EXCEEDED: The free tier limit has been reached for today. Data might not appear until the daily reset.");
  }

  console.error('🔥 Firestore Diagnostic:', errInfo);
  
  return errInfo;
}

export function formatDate(date: any) {
  if (!date) return "N/A";
  if (typeof date === "string") return new Date(date).toLocaleDateString();
  if (date && typeof date === "object" && "seconds" in date) {
    return new Date(date.seconds * 1000).toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
}
