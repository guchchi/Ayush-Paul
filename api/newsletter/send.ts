import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { Resend } from "resend";

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')),
    });
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
  }
}

const db = getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "(default)");

const ADMIN_UIDS = ["80OJfcmVXCRNmSZuthVU68K6vJq2"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  
  try {
    // 1. Verify Admin Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!ADMIN_UIDS.includes(decodedToken.uid)) {
      return res.status(403).json({ error: "Access Denied: You do not have permission to send newsletters." });
    }

    // 2. Validate Resend Config
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ 
        error: "Newsletter system is not configured. Please add RESEND_API_KEY to your Vercel Environment Variables.",
        code: "MISSING_API_KEY"
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { subject, content, campaignId, isTestMode } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ error: "Subject and content are required" });
    }

    // 3. Fetch Subscribers
    let allSubscribers: any[] = [];
    
    if (isTestMode) {
      // Test Mode: Only send to the admin who triggered the send
      allSubscribers = [{ id: 'test-admin', email: decodedToken.email }];
    } else {
      const subSnapshot = await db.collection("subscribers").get();
      allSubscribers = subSnapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email
      }));
    }

    if (allSubscribers.length === 0) {
      return res.status(400).json({ error: "No subscribers found" });
    }

    // 3. Batching Logic (100 per day limit)
    let currentCampaignId = campaignId;
    let sentCount = 0;
    
    // If resuming, find where we left off
    let startIndex = 0;
    if (campaignId) {
      const campDoc = await db.collection("newsletter_campaigns").doc(campaignId).get();
      if (campDoc.exists) {
        startIndex = campDoc.data()?.sentCount || 0;
      }
    }

    const batchSize = 100;
    const batch = allSubscribers.slice(startIndex, startIndex + batchSize);

    // 4. Send Emails via Resend
    const results = await Promise.all(batch.map(async (sub) => {
      try {
        const unsubscribeUrl = `${process.env.APP_URL || 'https://ayushpaul.com'}/api/newsletter/unsubscribe?id=${sub.id}`;
        
        await resend.emails.send({
          from: "Ayush Paul <newsletter@ayushpaul.com>",
          to: sub.email,
          subject: subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #1a1a1a; padding: 40px; border-radius: 12px;">
              <div style="margin-bottom: 30px;">
                <span style="font-weight: bold; letter-spacing: 2px; text-transform: uppercase; font-size: 12px; color: #00C2FF;">Innovation Lab</span>
              </div>
              <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 20px; line-height: 1.2;">${subject}</h1>
              <div style="font-size: 16px; line-height: 1.6; color: #444444; margin-bottom: 40px;">
                ${content.replace(/\n/g, '<br/>')}
              </div>
              <div style="border-top: 1px solid #eeeeee; padding-top: 20px; font-size: 12px; color: #999999; text-align: center;">
                <p>© ${new Date().getFullYear()} Ayush Paul Innovation Lab</p>
                <p>
                  You received this because you subscribed to updates on ayushpaul.com. 
                  <a href="${unsubscribeUrl}" style="color: #00C2FF; text-decoration: none;">Unsubscribe instantly</a>
                </p>
              </div>
            </div>
          `
        });
        return { email: sub.email, success: true };
      } catch (err: any) {
        return { email: sub.email, success: false, error: err.message };
      }
    }));

    const successfulSends = results.filter(r => r.success).length;
    sentCount = startIndex + successfulSends;

    // 6. Update/Create Campaign Log (Skip if test mode)
    if (isTestMode) {
      return res.status(200).json({
        message: "Test email sent successfully to " + decodedToken.email,
        sentCount: 1,
        total: 1,
        status: "test"
      });
    }

    const campaignData = {
      subject,
      content,
      sentCount,
      totalSubscribers: allSubscribers.length,
      status: sentCount >= allSubscribers.length ? "completed" : "processing",
      lastBatchAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (!currentCampaignId) {
      const newCamp = await db.collection("newsletter_campaigns").add({
        ...campaignData,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      currentCampaignId = newCamp.id;
    } else {
      await db.collection("newsletter_campaigns").doc(currentCampaignId).update(campaignData);
    }

    return res.status(200).json({
      message: sentCount >= allSubscribers.length ? "Newsletter fully sent!" : "Batch sent successfully. Resume tomorrow.",
      campaignId: currentCampaignId,
      sentCount,
      total: allSubscribers.length,
      status: campaignData.status
    });

  } catch (error: any) {
    console.error("Newsletter Send Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
