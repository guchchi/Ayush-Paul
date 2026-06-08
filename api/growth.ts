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

async function handleClaimReferral(req: VercelRequest, res: VercelResponse) {
  const { referrerId, newUserId, refCode: incomingRefCode } = req.body;

  if (!newUserId) {
    return res.status(400).json({ error: 'Missing newUserId' });
  }

  try {
    let referrerIdFinal = referrerId;
    let refCode = '';

    if (incomingRefCode) {
      const usersSnap = await db.collection('users')
        .where('referralCode', '==', incomingRefCode.toUpperCase())
        .limit(1)
        .get();

      if (usersSnap.empty) {
        return res.status(404).json({ error: `Referral code "${incomingRefCode}" not found` });
      }

      const refUser = usersSnap.docs[0];
      referrerIdFinal = refUser.id;
      refCode = refUser.data().referralCode || incomingRefCode.toUpperCase();
    } else if (referrerId) {
      const refSnap = await db.collection('users').doc(referrerId).get();
      if (!refSnap.exists) {
        return res.status(404).json({ error: 'Referrer not found' });
      }
      refCode = refSnap.data()!.referralCode;
    } else {
      return res.status(400).json({ error: 'Missing referrerId or refCode' });
    }

    if (!refCode) {
      return res.status(400).json({ error: 'Referrer has no referral code' });
    }

    await db.collection('referrals').add({
      referrerId: referrerIdFinal, refCode, newUserId,
      status: 'converted',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection('users').doc(referrerIdFinal).update({
      referralCount: admin.firestore.FieldValue.increment(1),
    });

    const couponCode = `REFERRAL_${refCode}_${Date.now()}`.toUpperCase();
    await db.collection('coupons').doc(couponCode).set({
      code: couponCode, discountType: 'percentage', value: 15, active: true,
      description: `Referral reward for ${refCode}`, usageLimit: 1, usedCount: 0,
      createdBy: 'system',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)),
    });

    return res.status(200).json({
      success: true, rewardCoupon: couponCode,
      message: 'Referral claimed! You earned a 15% discount.',
    });
  } catch (err: any) {
    console.error('[Referral] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

const SHARE_THRESHOLDS = [3, 10, 25];
const MILESTONE_MAP: Record<number, string> = {
  3: 'Bonus Blueprint Preview',
  10: 'Exclusive Workshop Access',
  25: '1-on-1 Strategy Call',
};

async function handleTrackShare(req: VercelRequest, res: VercelResponse) {
  const { userId, shareTarget } = req.body;

  if (!userId || !shareTarget) {
    return res.status(400).json({ error: 'Missing userId or shareTarget' });
  }

  const validTargets = ['whatsapp', 'twitter', 'linkedin', 'copy_link', 'other'];
  if (!validTargets.includes(shareTarget)) {
    return res.status(400).json({ error: `Invalid share target. Must be one of: ${validTargets.join(', ')}` });
  }

  try {
    await db.collection('share_events').add({
      userId, shareTarget,
      shareCount: admin.firestore.FieldValue.increment(1),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const sharesSnap = await db.collection('share_events')
      .where('userId', '==', userId)
      .get();

    const totalShares = sharesSnap.size;

    let milestoneUnlocked: string | null = null;
    for (const threshold of SHARE_THRESHOLDS) {
      if (totalShares === threshold || totalShares === threshold + 1) {
        const existingMilestones = await db.collection('share_events')
          .where('userId', '==', userId)
          .where('milestoneUnlocked', '==', MILESTONE_MAP[threshold])
          .get();

        if (existingMilestones.empty) {
          milestoneUnlocked = MILESTONE_MAP[threshold];
          break;
        }
      }
    }

    if (milestoneUnlocked) {
      let bonusBlueprintId = '';
      if (totalShares >= 25) {
        bonusBlueprintId = 'strategy_call';
      } else if (totalShares >= 10) {
        bonusBlueprintId = 'workshop_access';
      } else {
        const blueprintsSnap = await db.collection('blueprints')
          .where('status', '==', 'COMING_SOON')
          .limit(1)
          .get();
        if (!blueprintsSnap.empty) {
          bonusBlueprintId = blueprintsSnap.docs[0].id;
        }
      }

      await db.collection('share_events').add({
        userId, shareTarget: 'system', shareCount: totalShares,
        milestoneUnlocked: `${milestoneUnlocked} (${bonusBlueprintId || 'pending'})`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return res.status(200).json({ success: true, totalShares, milestoneUnlocked });
  } catch (err: any) {
    console.error('[Track Share] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

const TIER_CONFIG = [
  { days: 3, rewardType: 'badge', rewardValue: '3-Day Streak Badge' },
  { days: 7, rewardType: 'coupon', rewardValue: '15% Discount Coupon' },
  { days: 14, rewardType: 'content_unlock', rewardValue: 'Exclusive Blueprint Unlock' },
];

async function handleGenerateStreakReport(req: VercelRequest, res: VercelResponse) {
  const { userId, currentStreakDays } = req.body;

  if (!userId || typeof currentStreakDays !== 'number') {
    return res.status(400).json({ error: 'Missing userId or currentStreakDays' });
  }

  try {
    const rewards: { tier: number; rewardType: string; rewardValue: string }[] = [];

    for (const tier of TIER_CONFIG) {
      if (currentStreakDays >= tier.days) {
        const existingSnap = await db.collection('streak_milestones')
          .where('userId', '==', userId)
          .where('milestoneTier', '==', tier.days)
          .get();

        if (existingSnap.empty) {
          await db.collection('streak_milestones').add({
            userId, streakDays: currentStreakDays, milestoneTier: tier.days,
            rewardType: tier.rewardType, rewardValue: tier.rewardValue,
            claimed: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          if (tier.days === 7) {
            const couponCode = `STREAK7_${userId.slice(0, 6)}_${Date.now()}`.toUpperCase();
            await db.collection('coupons').doc(couponCode).set({
              code: couponCode, discountType: 'percentage', value: 15, active: true,
              description: `7-day streak reward for user ${userId}`, usageLimit: 1, usedCount: 0,
              assignedToCreator: '', createdBy: 'system',
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
            });
          }

          if (tier.days === 14) {
            const bonusSnap = await db.collection('blueprints')
              .where('status', '==', 'COMING_SOON')
              .limit(1)
              .get();
            if (!bonusSnap.empty) {
              const bonusDoc = bonusSnap.docs[0];
              await db.collection('user_unlocks').add({
                userId, itemId: bonusDoc.id, itemType: 'blueprint',
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
      success: true, currentStreak: currentStreakDays, rewardsAwarded: rewards,
      message: rewards.length > 0 ? `Awarded ${rewards.length} milestone(s)!` : 'No new milestones to award.',
    });
  } catch (err: any) {
    console.error('[Streak Report] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

const HANDLERS: Record<string, (req: VercelRequest, res: VercelResponse) => Promise<any>> = {
  "claim-referral": handleClaimReferral,
  "track-share": handleTrackShare,
  "generate-streak-report": handleGenerateStreakReport,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const action = req.body?.action || req.query?.action;
  const handlerFn = HANDLERS[action as string];

  if (!handlerFn) {
    return res.status(400).json({ error: `Unknown action: ${action}` });
  }

  return handlerFn(req, res);
}
