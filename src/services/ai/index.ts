import { AIProvider } from './types';
import { GeminiProvider } from './providers/gemini';
import { MockProvider } from './providers/mock';

let providerInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (providerInstance) {
    return providerInstance;
  }

  const useMock = 
    (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_USE_MOCK_AI === 'true') || 
    (typeof process !== 'undefined' && process.env.VITE_USE_MOCK_AI === 'true');

  if (useMock) {
    providerInstance = new MockProvider();
  } else {
    try {
      providerInstance = new GeminiProvider();
    } catch (error) {
      console.warn('Failed to initialize GeminiProvider, falling back to MockProvider:', error);
      providerInstance = new MockProvider();
    }
  }

  return providerInstance;
}

export * from './types';
