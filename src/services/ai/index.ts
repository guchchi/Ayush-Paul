import { AIProvider } from './types';
import { GeminiProvider } from './providers/gemini';
import { MockProvider } from './providers/mock';

let providerInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (providerInstance) {
    return providerInstance;
  }

  const useMock = import.meta.env.VITE_USE_MOCK_AI === 'true';

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
