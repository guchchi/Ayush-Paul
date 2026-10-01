/**
 * Admin authorization configuration.
 * Note: Server-side Firestore & Storage security rules enforce real data boundaries.
 * This client helper conditionally unlocks admin interface navigation.
 */

const envAdminUids = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ADMIN_UIDS
  ? String((import.meta as any).env.VITE_ADMIN_UIDS).split(',').map((u: string) => u.trim())
  : [];

const envAdminEmails = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ADMIN_EMAILS
  ? String((import.meta as any).env.VITE_ADMIN_EMAILS).split(',').map((e: string) => e.trim().toLowerCase())
  : [];

export const ADMIN_UIDS: string[] = envAdminUids.length > 0 ? envAdminUids : ["80OJfcmVXCRNmSZuthVU68K6vJq2"];

export const ADMIN_EMAILS: string[] = envAdminEmails.length > 0 ? envAdminEmails : [];

export const isUserAdmin = (uid: string | undefined, email?: string | null): boolean => {
  if (!uid) return false;
  if (ADMIN_UIDS.includes(uid)) return true;
  if (email && ADMIN_EMAILS.includes(email.toLowerCase())) return true;
  return false;
};
