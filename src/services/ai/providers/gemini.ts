import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider } from '../types';

export class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not defined. Please set it in your environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';
  }

  getModelName(): string {
    return this.modelName;
  }

  async generateJSON<T>(prompt: string, _schemaDescription: string, signal?: AbortSignal): Promise<T> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      }, { signal });

      const responseText = result.response.text();
      
      try {
        const parsed = JSON.parse(responseText);
        return parsed as T;
      } catch (parseError) {
        throw new Error(`Failed to parse Gemini response as JSON: ${responseText}`);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error;
      }
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }
}
