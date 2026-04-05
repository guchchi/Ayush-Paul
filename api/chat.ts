import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { messages, systemPrompt } = req.body;

  if (!systemPrompt) {
    return res.status(400).json({ error: "System prompt is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables");
    return res.status(500).json({ error: "AI system not configured. Please check Vercel settings." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Fallback list of models to try in sequence
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash"];
    let lastError = null;

    for (const modelId of modelsToTry) {
      try {
        console.log(`Attempting AI connection with model: ${modelId}`);
        const model = genAI.getGenerativeModel({ model: modelId });
        
        const chat = model.startChat({
          history: (messages || []).slice(0, -1).map((m: any) => ({
            role: m.role === 'ai' ? 'model' : 'user',
            parts: [{ text: m.text }]
          })),
          generationConfig: { maxOutputTokens: 1000 },
        });

        const result = await chat.sendMessage(systemPrompt);
        const response = await result.response;
        const text = response.text();
        
        if (text) {
          return res.status(200).json({ text });
        }
      } catch (err: any) {
        console.error(`AI model ${modelId} failed:`, err.message);
        lastError = err;
        continue; // Try the next model
      }
    }

    // If we reach here, all models failed
    throw lastError || new Error("All AI models failed to respond.");
    
  } catch (error: any) {
    console.error("Vercel AI Final failure:", error.message);
    return res.status(500).json({ error: error.message || "Internal AI failure after all fallback attempts." });
  }
}
