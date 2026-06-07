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

const db = getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a");

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
    const ADMIN_EMAILS = ["ap877@cornell.edu"];
    const isEmailAdmin = decodedToken.email && ADMIN_EMAILS.includes(decodedToken.email);
    if (!ADMIN_UIDS.includes(decodedToken.uid) && !isEmailAdmin) {
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
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Ayush Paul <onboarding@resend.dev>";
    
    const results = await Promise.all(batch.map(async (sub) => {
      try {
        const unsubscribeUrl = `${process.env.APP_URL || 'https://ayushpaul.vercel.app'}/api/newsletter/unsubscribe?id=${sub.id}`;
        
        const { data, error } = await resend.emails.send({
          from: fromAddress,
          to: sub.email,
          subject: subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #1a1a1a; padding: 40px; border-radius: 12px; border: 1px solid #eeeeee;">
              <div style="margin-bottom: 30px;">
                <span style="font-weight: bold; letter-spacing: 2px; text-transform: uppercase; font-size: 12px; color: #00C2FF;">Innovation Lab</span>
              </div>
              <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 20px; line-height: 1.2; color: #000000;">${subject}</h1>
              <div style="font-size: 16px; line-height: 1.6; color: #444444; margin-bottom: 40px;">
                ${content.replace(/\n/g, '<br/>')}
              </div>
              <div style="border-top: 1px solid #eeeeee; padding-top: 20px; font-size: 12px; color: #999999; text-align: center;">
                <p>© ${new Date().getFullYear()} Ayush Paul Innovation Lab</p>
                <p>
                  You received this because you subscribed to updates on ayushpaul.vercel.app. 
                  <br/>
                  <a href="${unsubscribeUrl}" style="color: #00C2FF; text-decoration: none; font-weight: bold;">Unsubscribe instantly</a>
                </p>
              </div>
            </div>
          `
        });

        if (error) throw error;
        return { email: sub.email, success: true };
      } catch (err: any) {
        console.error(`Failed to send to ${sub.email}:`, err);
        return { email: sub.email, success: false, error: err.message || err.name };
      }
    }));

    const successfulSends = results.filter(r => r.success).length;
    const failedSends = results.filter(r => !r.success);
    sentCount = startIndex + successfulSends;

    // 5. Critical Error Handling: If the entire batch failed, we need to let the admin know
    if (batch.length > 0 && successfulSends === 0) {
      const isSandboxError = failedSends.some(f => f.error?.toLowerCase().includes("forbidden") || f.error?.toLowerCase().includes("unverified"));
      
      return res.status(500).json({ 
        error: isSandboxError 
          ? "Resend Sandbox Limitation: In sandbox mode (unverified domain), you can ONLY send emails to your own Resend account email. Please verify your domain in the Resend dashboard to send to all subscribers."
          : "Delivery failed for the entire batch. This is usually due to an unverified domain in Resend or an invalid API key.",
        details: failedSends[0]?.error,
        code: isSandboxError ? "RESEND_SANDBOX_LIMIT" : "BATCH_DELIVERY_FAILED"
      });
    }

    // 6. Update/Create Campaign Log (Skip if test mode)
    if (isTestMode) {
      return res.status(200).json({
        message: `Test email sent successfully to ${decodedToken.email}`,
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
      message: sentCount >= allSubscribers.length 
        ? `Newsletter fully sent to ${sentCount} subscribers!` 
        : `Batch processed: ${successfulSends} sent, ${failedSends.length} failed. Total progress: ${sentCount}/${allSubscribers.length}`,
      campaignId: currentCampaignId,
      sentCount,
      total: allSubscribers.length,
      status: campaignData.status,
      failures: failedSends.length > 0 ? failedSends.slice(0, 5) : undefined // Send first few failures for debugging
    });

  } catch (error: any) {
    console.error("Newsletter Send Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
