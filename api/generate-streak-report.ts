import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

const db = getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID || 'ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a');

const TIER_CONFIG = [
  { days: 3, rewardType: 'badge', rewardValue: '3-Day Streak Badge' },
  { days: 7, rewardType: 'coupon', rewardValue: '15% Discount Coupon' },
  { days: 14, rewardType: 'content_unlock', rewardValue: 'Exclusive Blueprint Unlock' },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId, currentStreakDays } = req.body;

  if (!userId || typeof currentStreakDays !== 'number') {
    return res.status(400).json({ error: 'Missing userId or currentStreakDays' });
  }

  try {
    const rewards: { tier: number; rewardType: string; rewardValue: string }[] = [];

    for (const tier of TIER_CONFIG) {
      if (currentStreakDays >= tier.days) {
        // Check if already awarded this tier
        const existingSnap = await db.collection('streak_milestones')
          .where('userId', '==', userId)
          .where('milestoneTier', '==', tier.days)
          .get();

        if (existingSnap.empty) {
          // Award the milestone
          await db.collection('streak_milestones').add({
            userId,
            streakDays: currentStreakDays,
            milestoneTier: tier.days,
            rewardType: tier.rewardType,
            rewardValue: tier.rewardValue,
            claimed: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          // For 7-day streak: create a coupon
          if (tier.days === 7) {
            const couponCode = `STREAK7_${userId.slice(0, 6)}_${Date.now()}`.toUpperCase();
            await db.collection('coupons').doc(couponCode).set({
              code: couponCode,
              discountType: 'percentage',
              value: 15,
              active: true,
              description: `7-day streak reward for user ${userId}`,
              usageLimit: 1,
              usedCount: 0,
              assignedToCreator: '',
              createdBy: 'system',
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
            });
          }

          // For 14-day streak: unlock a COMING_SOON blueprint
          if (tier.days === 14) {
            const bonusSnap = await db.collection('blueprints')
              .where('status', '==', 'COMING_SOON')
              .limit(1)
              .get();
            if (!bonusSnap.empty) {
              const bonusDoc = bonusSnap.docs[0];
              // Mark as accessible for this user
              await db.collection('user_unlocks').add({
                userId,
                itemId: bonusDoc.id,
                itemType: 'blueprint',
                unlockReason: '14_day_streak',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
              });
            }
          }

          rewards.push({ tier: tier.days, rewardType: tier.rewardType, rewardValue: tier.rewardValue });
        }
      }
    }

    return res.status(200).json({
      success: true,
      currentStreak: currentStreakDays,
      rewardsAwarded: rewards,
      message: rewards.length > 0
        ? `Awarded ${rewards.length} milestone(s)!`
        : 'No new milestones to award.',
    });
  } catch (err: any) {
    console.error('[Streak Report] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
