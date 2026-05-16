import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow GET for simple link clicks from emails
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, id } = req.query;

  if (!email && !id) {
    return res.status(400).send(`
      <html>
        <body style="font-family: sans-serif; background: #0A0A0A; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center;">
          <div>
            <h1 style="color: #FF4B4B;">Invalid Request</h1>
            <p style="opacity: 0.6;">Missing subscriber identifier.</p>
          </div>
        </body>
      </html>
    `);
  }

  try {
    const subscribersRef = db.collection("subscribers");
    let deleted = false;

    if (id) {
      // Delete by ID
      await subscribersRef.doc(id as string).delete();
      deleted = true;
    } else if (email) {
      // Delete by Email
      const snapshot = await subscribersRef.where("email", "==", (email as string).toLowerCase().trim()).get();
      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
        deleted = true;
      });
      await batch.commit();
    }

    return res.status(200).send(`
      <html>
        <head>
          <title>Unsubscribed | Momentum</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #080808; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            .card { background: rgba(255, 255, 255, 0.03); border: 1px border rgba(255, 255, 255, 0.1); padding: 3rem; border-radius: 2rem; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
            h1 { font-size: 1.5rem; margin-bottom: 1rem; }
            p { font-size: 0.9rem; opacity: 0.5; line-height: 1.6; }
            .brand { color: #00C2FF; font-weight: bold; margin-bottom: 2rem; display: block; letter-spacing: 0.1em; text-transform: uppercase; font-size: 0.7rem; }
            .btn { display: inline-block; margin-top: 2rem; padding: 0.8rem 1.5rem; background: #00C2FF; color: black; text-decoration: none; border-radius: 0.8rem; font-weight: bold; font-size: 0.8rem; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="brand">Momentum Lab</span>
            <h1>You have been unsubscribed</h1>
            <p>Your email has been removed from our list. You will no longer receive our newsletters or innovation updates.</p>
            <a href="/" class="btn">Back to Momentum</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Unsubscribe Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
