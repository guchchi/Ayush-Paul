
export interface AITelemetry {
  provider: string;
  model: string;
  latencyMs: number;
  retryCount: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  finishReason?: string;
}

export interface AIResponse<T = any> {
  data: T;
  telemetry: AITelemetry;
}

export interface AIRetryPolicy {
  maxRetries: number;
  initialDelayMs: number;
  backoffFactor: number;
}

export interface AIRequestOptions {
  model?: string;
  temperature?: number;
  retryPolicy?: AIRetryPolicy;
  responseSchema?: any; // For structured outputs
  onStream?: (chunk: string) => void;
}

export interface IAIService {
  generateContent(prompt: string, options?: AIRequestOptions): Promise<AIResponse<string>>;
  generateStructured<T>(prompt: string, schema: any, options?: AIRequestOptions): Promise<AIResponse<T>>;
}
