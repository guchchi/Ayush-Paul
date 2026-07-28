import { AuthorityPackDomain, PackNote } from '../src/features/authority-pack/types';
import { FirestoreAuthorityPackRepository } from '../src/features/authority-pack/repositories/firestoreAuthorityPackRepository';
import { StoreNotesRepository } from '../src/features/authority-pack/repositories/storeNotesRepository';
import { AuthorityPackValidator } from '../src/features/authority-pack/validators';
import { GenerationCoordinator, IAIContextBuilder, IResponseParser, IAIPromptBuilder } from '../src/features/authority-pack/application/generationCoordinator';
import { IAIService } from '../src/lib/ai/types';
import { useAuthorityPackStore } from '../src/features/authority-pack/store/useAuthorityPackStore';
import { useCurrentPack } from '../src/features/authority-pack/store/selectors';

async function testPhase3() {
  console.log('--- Phase 3 Verification ---');

  // Clear store for tests
  useAuthorityPackStore.getState().reset();

  const packRepo = new FirestoreAuthorityPackRepository();
  const notesRepo = new StoreNotesRepository();

  // Test 1: Notes Repository CRUD (Zustand backed)
  console.log('\\n[Test 1] Notes Repository CRUD');
  const note: PackNote = { id: 'n1', packId: 'p1', content: 'Test note', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  await notesRepo.saveNote(note);
  let notes = await notesRepo.getNotes('p1');
  if (notes.length === 1 && notes[0].id === 'n1') {
    console.log('✅ Save Note successful');
  } else {
    console.error('❌ Save Note failed');
  }
  
  await notesRepo.deleteNote('n1');
  notes = await notesRepo.getNotes('p1');
  if (notes.length === 0) {
    console.log('✅ Delete Note successful');
  } else {
    console.error('❌ Delete Note failed');
  }

  // Test 2: Validation Failure
  console.log('\\n[Test 2] Invalid Schema Rejection');
  try {
    AuthorityPackValidator.validateSchema({ id: 'bad' });
    console.error('❌ Validation should have failed');
  } catch (e: any) {
    if (e.message.includes('Schema validation failed')) {
      console.log('✅ Validation failed as expected:', e.message.substring(0, 50) + '...');
    } else {
      console.error('❌ Unexpected error', e);
    }
  }

  // Test 3: Generation Orchestration (with mocked AI)
  console.log('\\n[Test 3] Generation Orchestration (Mocked AI)');
  
  // Mock Services
  class MockContextBuilder implements IAIContextBuilder { buildContext(raw?: any) { return { targetAudience: 'A', coreTopic: 'B' }; } }
  class MockPromptBuilder implements IAIPromptBuilder { buildPrompt(ctx: any) { return 'mock prompt'; } }
  class MockAIService implements IAIService { async generate<T>(p: string, s: any) { return { data: {} as T, metadata: { provider: 'mock', model: 'mock', latencyMs: 0, retryCount: 0 } }; } }
  class MockResponseParser implements IResponseParser {
    parseAndValidate(raw: any): AuthorityPackDomain {
      return {
        id: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Generated mock pack',
        status: 'draft',
        theme: 'blue',
        version: '1.0.0',
        modules: [],
        executiveSummary: {
          strategyOverview: 'Mock strategy overview',
          keyInsight: 'Mock key insight',
          primaryRecommendation: 'Mock primary recommendation',
          readingGuidance: 'Mock reading guidance'
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
      };
    }
  }

  // Wrap repo save to verify it gets called
  let repoSaved = false;
  packRepo.save = async (pack: AuthorityPackDomain) => { repoSaved = true; };

  const coordinator = new GenerationCoordinator(
    packRepo,
    new MockContextBuilder(),
    new MockPromptBuilder(),
    new MockAIService(),
    new MockResponseParser()
  );

  await coordinator.generate('p123');

  const storeState = useAuthorityPackStore.getState();
  const pack = useCurrentPack(storeState);

  if (repoSaved && pack && pack.id === 'p123' && pack.status === 'ready') {
    console.log('✅ Generation workflow completed successfully. Pack saved and stored.');
  } else {
    console.error('❌ Generation workflow failed. Error:', storeState.error);
  }

  console.log('\\nAll Phase 3 tests completed.');
}

testPhase3().catch(console.error);

