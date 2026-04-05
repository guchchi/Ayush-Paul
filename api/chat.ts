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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Format conversation history for Gemini 1.5 Flash
    // We send history as contents[] and the latest message as a separate part or combined
    const chat = model.startChat({
      history: (messages || []).slice(0, -1).map((m: any) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }]
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // We send the system prompt + user message as the final message to force adherence
    const result = await chat.sendMessage(systemPrompt);
    const response = await result.response;
    const text = response.text() || "I'm having trouble processing that right now.";
    
    return res.status(200).json({ text });
    
  } catch (error: any) {
    console.error("Vercel AI Error:", error.message);
    return res.status(500).json({ error: error.message || "Internal AI failure" });
  }
}
