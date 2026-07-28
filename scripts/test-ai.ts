import { AuthorityPackContextBuilder } from '../src/features/authority-pack/ai/contextBuilder';
import { AuthorityPackPromptBuilder } from '../src/features/authority-pack/ai/promptBuilder';
import { AuthorityPackParser } from '../src/features/authority-pack/ai/parser';
import { GeminiAdapter } from '../src/lib/ai/geminiAdapter';
import { GenerationCoordinator } from '../src/features/authority-pack/application/generationCoordinator';
import { FirestoreAuthorityPackRepository } from '../src/features/authority-pack/repositories/firestoreAuthorityPackRepository';
import { useAuthorityPackStore } from '../src/features/authority-pack/store/useAuthorityPackStore';
import { Schema, SchemaType } from '@google/generative-ai';

// Simple mock schema to satisfy Gemini requirements in test
const mockGeminiSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    id: { type: SchemaType.STRING },
    title: { type: SchemaType.STRING },
    description: { type: SchemaType.STRING },
    status: { type: SchemaType.STRING },
    theme: { type: SchemaType.STRING },
    version: { type: SchemaType.STRING },
    executiveSummary: {
      type: SchemaType.OBJECT,
      properties: {
        strategyOverview: { type: SchemaType.STRING },
        keyInsight: { type: SchemaType.STRING },
        primaryRecommendation: { type: SchemaType.STRING },
        readingGuidance: { type: SchemaType.STRING }
      }
    },
    strategicPillars: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          rationale: { type: SchemaType.STRING },
          createdAt: { type: SchemaType.STRING },
          updatedAt: { type: SchemaType.STRING }
        }
      }
    },
    actionPlan: { type: SchemaType.ARRAY, items: { type: SchemaType.OBJECT, properties: {} } },
    tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    createdAt: { type: SchemaType.STRING },
    updatedAt: { type: SchemaType.STRING }
  }
};

async function runAITests() {
  console.log('--- Phase 4 AI Integration Verification ---');

  // 1. Test Prompt Builder Purity
  const context = new AuthorityPackContextBuilder().buildContext({ targetAudience: 'Developers', coreTopic: 'Testing' });
  const prompt = AuthorityPackPromptBuilder.buildGenerationPrompt(context);
  if (prompt.includes('Developers') && prompt.includes('Testing')) {
    console.log('✅ PromptBuilder is pure and constructs valid prompt.');
  } else {
    console.error('❌ PromptBuilder output invalid.');
  }

  // 2. Mock IAIService to test retries, validation, and idempotency
  let callCount = 0;
  class MockAIService {
    async generateStructured(prompt: string, schema: any, options: any) {
      callCount++;
      if (callCount === 1) {
        throw new Error('503 Service Unavailable'); // Transient
      }
      if (callCount === 2) {
        // Return malformed data to trigger AIValidationError inside Parser
        return {
          data: { id: 'bad-uuid', executiveSummary: 'should-be-object' },
          telemetry: { provider: 'mock', model: 'mock', latencyMs: 100, retryCount: 1 }
        };
      }
      
      // Success case
      return {
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Mock AI Output',
          description: 'Desc',
          status: 'draft',
          theme: 'blue',
          version: '1.0.0',
          modules: [],
          executiveSummary: {
            strategyOverview: 'Overview',
            keyInsight: 'Insight',
            primaryRecommendation: 'Rec',
            readingGuidance: 'Read this'
          },
          strategicPillars: [
            { 
              id: '123e4567-e89b-12d3-a456-426614174002', 
              title: 'Pillar 1', 
              description: 'Desc 1', 
              rationale: 'Rationale 1',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          actionPlan: [],
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        telemetry: { provider: 'mock', model: 'mock', latencyMs: 150, retryCount: 0 }
      };
    }
  }

  // 3. Test Adapter Error Types directly
  const adapter = new GeminiAdapter('mock-key');
  // Hack to override genAI model call for testing
  (adapter as any).genAI = {
    getGenerativeModel: () => ({
      generateContent: async () => {
        throw new Error('503 Service Unavailable');
      }
    })
  };
  
  try {
    await adapter.generateStructured('Test', mockGeminiSchema, { retryPolicy: { maxRetries: 1, initialDelayMs: 10, backoffFactor: 1 } });
    console.error('❌ Adapter should have thrown timeout after retries exhausted.');
  } catch (e: any) {
    if (e.name === 'AITimeoutError') {
      console.log('✅ Adapter retry strategy correctly threw AITimeoutError for transient failure.');
    } else {
      console.error('❌ Unexpected error type:', e.name);
    }
  }

  // 4. Test Generation Coordinator workflow (Idempotency and Parser Validation)
  useAuthorityPackStore.getState().reset();
  const coordinator = new GenerationCoordinator(
    new FirestoreAuthorityPackRepository(),
    new AuthorityPackContextBuilder(),
    new MockAIService() as any,
    AuthorityPackParser,
    AuthorityPackPromptBuilder.buildGenerationPrompt,
    mockGeminiSchema
  );

  // Trigger once which hits 503, retries natively in GeminiAdapter, but we are mocking AIService
  // Wait, our MockAIService doesn't implement the retry wrapper (GeminiAdapter does). 
  // Let's just test that the coordinator catches the error.
  
  // Call 1: 503 error
  await coordinator.generate('pack-123');
  let state = useAuthorityPackStore.getState();
  if (state.error?.includes('503')) {
    console.log('✅ Coordinator caught service error.');
  } else {
    console.error('❌ Expected 503 error, got:', state.error);
  }

  // Call 2: Validation Failure
  await coordinator.generate('pack-123');
  state = useAuthorityPackStore.getState();
  if (state.error?.includes('Schema validation failed')) {
    console.log('✅ Parser strictly blocked malformed AI data and coordinator caught it.');
  } else {
    console.error('❌ Expected Schema validation error, got:', state.error);
  }

  // Call 3: Success
  await coordinator.generate('pack-123');
  state = useAuthorityPackStore.getState();
  if (!state.error && state.pack?.id === 'pack-123') {
    console.log('✅ Coordinator successfully parsed and stored valid AI response.');
  } else {
    console.error('❌ Coordinator success run failed. Error:', state.error);
  }

  // Test Idempotency
  useAuthorityPackStore.setState({ isGenerating: true, error: null } as any);
  try {
    await coordinator.generate('pack-123');
    console.error('❌ Coordinator should have thrown due to idempotency check.');
  } catch (e: any) {
    if (e.message.includes('already in progress')) {
      console.log('✅ Idempotency check prevents duplicate generation.');
    } else {
      console.error('❌ Unexpected error for idempotency check:', e);
    }
  }

  console.log('\\nAll Phase 4 AI tests completed.');
}

runAITests().catch(console.error);
