import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "Missing productId" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const productDoc = await db.collection("products").doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productDoc.data()!;
    const isFree = product.type === "free";

    let isOwned = false;
    if (!isFree) {
      const userDoc = await db.collection("users").doc(userId).get();
      if (userDoc.exists) {
        const ownedProducts = userDoc.data()?.ownedProducts || {};
        isOwned = ownedProducts[productId] === "premium";
      }

      if (!isOwned) {
        const purchaseQuery = await db.collection("purchases")
          .where("userId", "==", userId)
          .where("productId", "==", productId)
          .where("status", "==", "completed")
          .limit(1)
          .get();
        isOwned = !purchaseQuery.empty;
      }
    }

    if (!isFree && !isOwned) {
      return res.status(403).json({ error: "Access denied: you do not own this product" });
    }

    const assetDoc = await db.collection("product_assets").doc(productId).get();
    const downloadUrl = assetDoc.exists
      ? assetDoc.data()?.downloadFileURL
      : product.downloadFileURL || null;

    if (!downloadUrl) {
      return res.status(404).json({ error: "No download file configured for this product" });
    }

    return res.status(200).json({ downloadUrl, productTitle: product.title || '' });
  } catch (err: any) {
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: "Token expired" });
    }
    if (err.code === 'auth/argument-error') {
      return res.status(401).json({ error: "Invalid token" });
    }
    console.error("[Download] Error:", err.message);
    return res.status(500).json({ error: "Failed to process download" });
  }
}
