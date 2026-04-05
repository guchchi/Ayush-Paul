import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

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
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set in local .env" });
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
