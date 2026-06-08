import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config();
dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  // Initialize Firebase Admin
  if (admin.apps.length === 0) {
    const serviceAccountPath = path.resolve(process.cwd(), "service-account.json");
    if (fs.existsSync(serviceAccountPath)) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath)
      });
    } else {
      admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });
    }
  }
  const db = getFirestore(admin.app(), process.env.VITE_FIREBASE_FIRESTORE_DB_ID);
  
  const getDb = () => db;

  // Initialize Stripe lazily
  let stripe: Stripe | null = null;
  const getStripe = () => {
    if (!stripe) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error("STRIPE_SECRET_KEY is not defined");
      }
      stripe = new Stripe(key);
    }
    return stripe;
  };

  app.use(express.json());

  // API Route: Create Checkout Session (Product & Support)
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { productId, userId, email, amount, tierName, creatorCode } = req.body;

      // Handle donation tier purchase (legacy support)
      if (amount && tierName) {
        const validTiers = [99, 299, 999];
        if (!validTiers.includes(amount)) {
          return res.status(400).json({ error: "Invalid support tier" });
        }

        const stripeClient = getStripe();
        const session = await stripeClient.checkout.sessions.create({
          payment_method_types: ["card", "upi"],
          line_items: [
            {
              price_data: {
                currency: "inr",
                product_data: {
                  name: `Support Ayush Paul - ${tierName}`,
                  description: "Thank you for supporting my work and projects!",
                  images: ["https://ayushpaul.in/og-image.png"],
                },
                unit_amount: amount * 100,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.APP_URL || "http://localhost:3000"}/success`,
          cancel_url: `${process.env.APP_URL || "http://localhost:3000"}/cancel`,
        });

        return res.json({ url: session.url });
      }

      // Handle product purchase flow
      if (!productId || !userId) {
        return res.status(400).json({ error: "Missing required parameters (productId or userId)" });
      }

      // 1. Fetch Product from Firestore
      const productDoc = await db.collection("products").doc(productId).get();
      if (!productDoc.exists) {
        return res.status(404).json({ error: "Product not found" });
      }

      const product = productDoc.data();
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (product.type === "free" && !product.stripePriceId) {
        return res.status(400).json({ error: "Invalid product for checkout (free product)" });
      }

      if (!product.stripePriceId) {
        return res.status(400).json({ error: "Product not configured with a Stripe Price ID" });
      }

      // 1.5. Prevent Duplicate Purchases
      const userDoc = await db.collection("users").doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const ownedProducts = userData?.ownedProducts || {};
        if (ownedProducts[productId] === "premium") {
          return res.status(400).json({ error: "You already own the Premium tier for this product." });
        }
      }

      const stripeClient = getStripe();
      
      // Determine the base URL for redirects (Success/Cancel)
      const protocol = req.headers["x-forwarded-proto"] || "http";
      const host = req.headers.host || "localhost:3000";
      const appUrl = process.env.APP_URL || `${protocol}://${host}`;

      // 2. Retrieve Price from Stripe to determine mode
      const stripePrice = await stripeClient.prices.retrieve(product.stripePriceId);
      const mode = stripePrice.type === 'recurring' ? 'subscription' : 'payment';
      const effectivePrice = Number(product.salePrice) || Number(product.basePrice) || (stripePrice.unit_amount ? stripePrice.unit_amount / 100 : 0);

      // 3. Create Stripe Checkout Session
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card", "upi"], // Optimized for Indian Users
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: product.title || 'Product',
                images: product.thumbnail ? [product.thumbnail] : undefined,
              },
              unit_amount: effectivePrice * 100,
            },
            quantity: 1,
          },
        ],
        mode: mode,
        success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&product_id=${productId}`,
        cancel_url: `${appUrl}/products/${product.slug || product.productId || productId || "unknown"}?payment=cancelled`,
        metadata: {
          productId,
          userId,
          productTitle: product?.title || '',
          ...(creatorCode ? { creatorCode: creatorCode.trim().toUpperCase() } : {}),
        },
        customer_email: email || undefined,
      });

      return res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Session Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Create Donation Session
  app.post("/api/create-donation-session", async (req, res) => {
    try {
      const { amount, userId } = req.body;
      if (!amount) {
        return res.status(400).json({ error: "Missing donation amount" });
      }

      const stripeClient = getStripe();
      const appUrl = process.env.APP_URL || "http://localhost:3000";

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card", "upi"],
        line_items: [
          {
            price_data: {
              currency: "inr", // Donations use INR
              product_data: {
                name: "Donation: Support Open Innovation",
                description: "Thank you for supporting Ayush Paul's engineering research.",
                images: ["https://ayushpaul.in/founder.png"],
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}/vault?donation=success`,
        cancel_url: `${appUrl}/thank-you`,
        metadata: {
          type: "donation",
          userId: userId || "anonymous",
        },
      });

      return res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Donation Error:", error.message);
      return res.status(500).json({ error: "Failed to create donation session" });
    }
  });

  // API Route: Verify Checkout Session
  app.post("/api/verify-checkout-session", async (req, res) => {
    try {
      const { sessionId, userId } = req.body;
      if (!sessionId || !userId) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const stripeClient = getStripe();
      const session = await stripeClient.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid") {
        return res.status(400).json({ error: "Session has not been paid yet" });
      }

      const metaUserId = session.metadata?.userId;
      const productId = session.metadata?.productId;

      if (!productId) {
        return res.status(400).json({ error: "No product ID found in session metadata" });
      }

      if (metaUserId !== userId) {
        return res.status(403).json({ error: "Unauthorized: User ID mismatch" });
      }

      // Idempotently update user's ownedProducts map in Firestore
      const userRef = db.collection("users").doc(userId);
      const existingSnap = await userRef.get();
      const currentOwned = existingSnap.exists ? (existingSnap.data()?.ownedProducts || {}) : {};
      currentOwned[productId] = "premium";
      await userRef.set({
        ownedProducts: currentOwned,
        purchasedProducts: admin.firestore.FieldValue.arrayUnion(productId)
      }, { merge: true });

      // Idempotently log to purchases collection
      const purchaseQuery = await db.collection("purchases").where("stripeSessionId", "==", sessionId).get();
      if (purchaseQuery.empty) {
        await db.collection("purchases").add({
          userId,
          productId,
          stripeSessionId: sessionId,
          amountTotal: session.amount_total,
          currency: session.currency,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          status: "completed"
        });

        // Also log safe public purchase for SocialProofTicker
        await db.collection("public_purchases").add({
          productId,
          productTitle: session.metadata?.productTitle || '',
          currency: session.currency,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      return res.json({ success: true, productId });
    } catch (error: any) {
      console.error("Stripe verification error:", error.message);
      return res.status(500).json({ error: error.message || "Failed to verify payment session" });
    }
  });

  // API Route: Chat (AI Assistant)
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, systemPrompt } = req.body;
      const apiKey = process.env.GOOGLE_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "GOOGLE_API_KEY is not set in local .env" });
      }

      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      
      const modelsToTry = ["gemini-1.5-flash-8b", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"];
      let lastError = null;

      for (const modelId of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ 
            model: modelId,
            systemInstruction: systemPrompt
          });
          
          const chat = model.startChat({
            history: (messages || []).slice(0, -1).map((m: any) => ({
              role: m.role === 'ai' ? 'model' : 'user',
              parts: [{ text: m.text }]
            })),
            generationConfig: { maxOutputTokens: 800 },
          });

          const lastUserMessage = messages[messages.length - 1]?.text || "Hello";
          const result = await chat.sendMessage(lastUserMessage);
          const response = await result.response;
          return res.json({ text: response.text() });
        } catch (err: any) {
          console.error(`Local AI model ${modelId} failed:`, err.message);
          lastError = err;
          // Continue to the next model
        }
      }

      throw lastError || new Error("All local AI models failed.");
    } catch (error: any) {
      console.error("Local AI Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Secure Content Publishing (AI Hub)
  app.post("/api/publish-content", async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"];
      const secretKey = process.env.PUBLISH_API_KEY;

      if (!secretKey || apiKey !== secretKey) {
        return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
      }

      const { type, data } = req.body;
      const collectionName = type === "project" ? "projects" : type === "update" ? "updates" : "blogPosts";

      // Auto-generate slug if missing
      if (data.title && !data.slug) {
        data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      // Add timestamps
      data.createdAt = admin.firestore.FieldValue.serverTimestamp();
      data.updatedAt = admin.firestore.FieldValue.serverTimestamp();

      console.log(`📡 Attempting to write to collection: ${collectionName} in database: ${process.env.VITE_FIREBASE_FIRESTORE_DB_ID || '(default)'}`);
      
      const docId = data.slug || `post-${Date.now()}`;
      await db.collection(collectionName).doc(docId).set(data);
      
      console.log(`✅ SUCCESSFULLY PUBLISHED: ${docId}`);
      
      res.json({ 
        success: true, 
        id: docId, 
        url: `/${type === 'blog' ? 'blog' : 'projects'}/${data.slug}` 
      });
    } catch (error: any) {
      console.error("Publishing Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
