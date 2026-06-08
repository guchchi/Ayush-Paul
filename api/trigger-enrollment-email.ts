import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { sendEmail } from './lib/email';
import { renderEnrollmentWelcome } from './emails/EnrollmentWelcome';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ error: 'Missing required parameters: userId, courseId' });
  }

  try {
    const [userSnap, courseSnap] = await Promise.all([
      db.collection('users').doc(userId).get(),
      db.collection('courses').doc(courseId).get(),
    ]);

    if (!userSnap.exists || !courseSnap.exists) {
      return res.status(404).json({ error: 'User or course not found' });
    }

    const userData = userSnap.data()!;
    const courseData = courseSnap.data()!;
    const email = userData.email;
    const userName = userData.displayName || email?.split('@')[0] || 'Innovator';

    if (!email) {
      return res.status(400).json({ error: 'User has no email address' });
    }

    // Count modules and lessons
    const modSnap = await db.collection('modules').where('courseId', '==', courseId).get();
    const modulesCount = modSnap.size;

    const lesSnap = await db.collection('lessons').where('courseId', '==', courseId).get();
    const lessonsCount = lesSnap.size;

    const html = renderEnrollmentWelcome({
      userName,
      courseName: courseData.title || 'Course',
      courseUrl: `https://ayushpaul.in/mastery/courses/${courseId}`,
      modulesCount,
      lessonsCount: lessonsCount || courseData.lessonsCount || 10,
      isFree: courseData.isFree || courseData.price === 0,
    });

    const result = await sendEmail({
      to: email,
      subject: `Welcome to ${courseData.title || 'Your Course'} — Start Learning`,
      html,
    });

    if (result.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: result.error || 'Failed to send email' });
    }
  } catch (err: any) {
    console.error('[Enrollment Email] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
