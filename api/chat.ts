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

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_API_KEY is not set in environment variables");
    return res.status(500).json({ error: "AI system not configured. Please check Vercel settings." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Fallback list: Start with the most lightweight/high-quota models
    const modelsToTry = ["gemini-1.5-flash-8b", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"];
    let lastError = null;

    for (const modelId of modelsToTry) {
      try {
        console.log(`Attempting AI connection with model: ${modelId}`);
        
        const model = genAI.getGenerativeModel({ 
          model: modelId,
          // Move the massive context into systemInstruction for efficiency & better adherence
          systemInstruction: systemPrompt 
        });
        
        const chat = model.startChat({
          history: (messages || []).slice(0, -1).map((m: any) => ({
            role: m.role === 'ai' ? 'model' : 'user',
            parts: [{ text: m.text }]
          })),
          generationConfig: { 
            maxOutputTokens: 800,
            temperature: 0.7,
          },
        });

        // The userMsg is handled as the final message (the last one in the history array if we sent it, 
        // but here we just send the latest one from the client)
        const lastUserMessage = messages[messages.length - 1]?.text || "Hello";
        const result = await chat.sendMessage(lastUserMessage);
        const response = await result.response;
        const text = response.text();
        
        if (text) {
          return res.status(200).json({ text });
        }
      } catch (err: any) {
        console.error(`AI model ${modelId} failed:`, err.message);
        lastError = err;
        // Continue to the next model in the list
      }
    }

    throw lastError || new Error("All AI models are currently saturated. Please try again in 1 minute.");
    
  } catch (error: any) {
    console.error("Vercel AI Final failure:", error.message);
    return res.status(500).json({ error: error.message || "The brain is currently recharging. Try back in a few seconds." });
  }
}
