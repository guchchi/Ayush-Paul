
import { GoogleGenerativeAI, Schema } from '@google/generative-ai';
import { IAIService, AIRequestOptions, AIResponse, AITelemetry } from './types';
import { AIRateLimitError, AITimeoutError, AIError } from './errors';

/**
 * AI Adapter for Google Gemini
 * Implements provider independence and retry logic.
 */
export class GeminiAdapter implements IAIService {
  private genAI: GoogleGenerativeAI;
  private defaultModel = 'gemini-2.5-flash';

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    options?: AIRequestOptions
  ): Promise<{ result: T; retries: number; duration: number }> {
    const maxRetries = options?.retryPolicy?.maxRetries ?? 3;
    let delay = options?.retryPolicy?.initialDelayMs ?? 1000;
    const backoff = options?.retryPolicy?.backoffFactor ?? 2;
    
    let retries = 0;
    const startTime = Date.now();

    while (true) {
      try {
        const result = await operation();
        return { result, retries, duration: Date.now() - startTime };
      } catch (error: any) {
        const isTransient = this.isTransientError(error);
        if (!isTransient || retries >= maxRetries) {
          if (isTransient) {
             throw new AITimeoutError({ retryCount: retries, latencyMs: Date.now() - startTime });
          }
          throw new AIError(error.message, false, { retryCount: retries, latencyMs: Date.now() - startTime });
        }
        retries++;
        await new Promise(res => setTimeout(res, delay));
        delay *= backoff;
      }
    }
  }

  private isTransientError(error: any): boolean {
    const msg = error?.message?.toLowerCase() || '';
    if (msg.includes('429') || msg.includes('quota')) return true;
    if (msg.includes('503') || msg.includes('unavailable')) return true;
    if (msg.includes('timeout')) return true;
    return false;
  }

  async generateContent(prompt: string, options?: AIRequestOptions): Promise<AIResponse<string>> {
    const modelName = options?.model || this.defaultModel;
    const model = this.genAI.getGenerativeModel({ model: modelName });
    
    // NOTE: Streaming is supported via model.generateContentStream but we use generateContent for now
    // while keeping the interface stream-ready.
    
    const { result, retries, duration } = await this.executeWithRetry(async () => {
      return await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
        }
      });
    }, options);

    const response = result.response;
    const text = response.text();

    const telemetry: AITelemetry = {
      provider: 'google',
      model: modelName,
      latencyMs: duration,
      retryCount: retries,
      promptTokens: response.usageMetadata?.promptTokenCount,
      completionTokens: response.usageMetadata?.candidatesTokenCount,
      totalTokens: response.usageMetadata?.totalTokenCount,
      finishReason: response.candidates?.[0]?.finishReason
    };

    return { data: text, telemetry };
  }

  async generateStructured<T>(prompt: string, schema: Schema, options?: AIRequestOptions): Promise<AIResponse<T>> {
    const modelName = options?.model || this.defaultModel;
    const model = this.genAI.getGenerativeModel({ model: modelName });

    const { result, retries, duration } = await this.executeWithRetry(async () => {
      return await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options?.temperature ?? 0.2, // lower temp for structured
          responseMimeType: 'application/json',
          responseSchema: schema
        }
      });
    }, options);

    const response = result.response;
    const text = response.text();
    let parsed: T;
    
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      throw new AIError('Failed to parse JSON response from model', false);
    }

    const telemetry: AITelemetry = {
      provider: 'google',
      model: modelName,
      latencyMs: duration,
      retryCount: retries,
      promptTokens: response.usageMetadata?.promptTokenCount,
      completionTokens: response.usageMetadata?.candidatesTokenCount,
      totalTokens: response.usageMetadata?.totalTokenCount,
      finishReason: response.candidates?.[0]?.finishReason
    };

    return { data: parsed, telemetry };
  }
}
