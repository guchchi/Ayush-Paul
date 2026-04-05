import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

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
    const ai = new GoogleGenAI({ apiKey });
    
    // Format conversation history for Gemini 2.0 Flash
    const conversationHistory = (messages || []).map((m: any) => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        ...conversationHistory,
        { role: 'user', parts: [{ text: systemPrompt }] }
      ],
    });

    const text = response.text || "I'm having trouble processing that right now.";
    return res.status(200).json({ text });
    
  } catch (error: any) {
    console.error("Vercel AI Error:", error.message);
    return res.status(500).json({ error: error.message || "Internal AI failure" });
  }
}
