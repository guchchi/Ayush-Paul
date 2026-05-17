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
  const PORT = 3000;

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

  // API Route: Create Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { amount, tierName } = req.body;
      const validTiers = [99, 299, 999];
      if (!validTiers.includes(amount)) {
        return res.status(400).json({ error: "Invalid support tier" });
      }

      const stripeClient = getStripe();
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
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

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Session Error:", error);
      res.status(500).json({ error: error.message });
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
