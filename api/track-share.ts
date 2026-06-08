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

const SHARE_THRESHOLDS = [3, 10, 25];
const MILESTONE_MAP: Record<number, string> = {
  3: 'Bonus Blueprint Preview',
  10: 'Exclusive Workshop Access',
  25: '1-on-1 Strategy Call',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId, shareTarget } = req.body;

  if (!userId || !shareTarget) {
    return res.status(400).json({ error: 'Missing userId or shareTarget' });
  }

  const validTargets = ['whatsapp', 'twitter', 'linkedin', 'copy_link', 'other'];
  if (!validTargets.includes(shareTarget)) {
    return res.status(400).json({ error: `Invalid share target. Must be one of: ${validTargets.join(', ')}` });
  }

  try {
    // Record the share event
    await db.collection('share_events').add({
      userId,
      shareTarget,
      shareCount: admin.firestore.FieldValue.increment(1),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Count total shares for this user
    const sharesSnap = await db.collection('share_events')
      .where('userId', '==', userId)
      .get();

    const totalShares = sharesSnap.size;

    // Check if any milestone was reached
    let milestoneUnlocked: string | null = null;
    for (const threshold of SHARE_THRESHOLDS) {
      if (totalShares === threshold || totalShares === threshold + 1) {
        // Check if this milestone was already unlocked
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
      // Determine which bonus blueprint to unlock based on milestone
      let bonusBlueprintId = '';
      if (totalShares >= 25) {
        bonusBlueprintId = 'strategy_call';
      } else if (totalShares >= 10) {
        bonusBlueprintId = 'workshop_access';
      } else {
        // Find a COMING_SOON blueprint to unlock
        const blueprintsSnap = await db.collection('blueprints')
          .where('status', '==', 'COMING_SOON')
          .limit(1)
          .get();
        if (!blueprintsSnap.empty) {
          bonusBlueprintId = blueprintsSnap.docs[0].id;
        }
      }

      // Record milestone with blueprint info
      await db.collection('share_events').add({
        userId,
        shareTarget: 'system',
        shareCount: totalShares,
        milestoneUnlocked: `${milestoneUnlocked} (${bonusBlueprintId || 'pending'})`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return res.status(200).json({
      success: true,
      totalShares,
      milestoneUnlocked,
    });
  } catch (err: any) {
    console.error('[Track Share] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
