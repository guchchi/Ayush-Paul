import { doc, updateDoc, db } from '../firebase';

/**
 * Generates a unique referral code from a user's UID.
 * Format: REF-{first 5 chars of UID in uppercase}
 */
export function generateReferralCode(uid: string): string {
  const prefix = uid.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `REF-${prefix}${suffix}`;
}

/**
 * Assigns a referral code to a user if they don't already have one.
 */
export async function ensureReferralCode(userId: string, profile: any): Promise<string | null> {
  if (profile?.referralCode) return profile.referralCode;

  try {
    const code = generateReferralCode(userId);
    await updateDoc(doc(db, 'users', userId), { referralCode: code });
    return code;
  } catch {
    return null;
  }
}
