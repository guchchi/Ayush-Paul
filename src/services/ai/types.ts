export interface RetryOptions {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
}

export interface GenerationMetrics {
  promptVersion: number;
  model: string;
  generatedAt: string;
  latencyMs?: number;
}

export interface AIProvider {
  /**
   * Generates a structured JSON response from the given prompt.
   * @param prompt The string prompt to send to the LLM.
   * @param schemaDescription An optional description of the expected schema (sometimes used by providers natively).
   * @param signal An optional AbortSignal to cancel the request.
   */
  generateJSON<T>(prompt: string, schemaDescription: string, signal?: AbortSignal): Promise<T>;
  
  /**
   * Returns the model identifier used by the provider.
   */
  getModelName(): string;
}
