import { useAuthorityPackStore } from '../store/useAuthorityPackStore';
import { IAuthorityPackRepository } from '../repositories';
import { AuthorityPackDomain } from '../types';
import { IAIService, AIRequestOptions } from '../../../lib/ai/types';
import { AuthorityPackContext } from '../ai/contextBuilder';

export interface IAIContextBuilder {
  buildContext(rawInputs?: any): AuthorityPackContext;
}

export interface IResponseParser {
  parseAndValidate(raw: any): AuthorityPackDomain;
}

/**
 * Orchestrates the generation workflow.
 * Delegates all logic to injected services.
 */
export class GenerationCoordinator {
  constructor(
    private packRepo: IAuthorityPackRepository,
    private contextBuilder: IAIContextBuilder,
    private aiService: IAIService,
    private responseParser: IResponseParser,
    private promptBuilder: (ctx: AuthorityPackContext) => string,
    private responseSchema: any
  ) {}

  async generate(packId: string, rawInputs?: any): Promise<void> {
    const store = useAuthorityPackStore.getState();
    
    // Idempotency check
    if (store.isGenerating) {
      throw new Error('Generation already in progress.');
    }
    
    try {
      // 1. Collect & Validate Inputs
      store.updateGeneration({ isGenerating: true, error: null });
      
      // We will mark the pack as 'generating' in DB
      await this.packRepo.updateStatus(packId, 'generating');

      // 2. Build Context
      const context = this.contextBuilder.buildContext(rawInputs);
      const prompt = this.promptBuilder(context);

      // 3. Call AI Service
      const aiResponse = await this.aiService.generateStructured(prompt, this.responseSchema, {
        temperature: 0.2
      });

      // 4. Validate Response (Parser handles Schema & Business Rules)
      const parsedDomain = this.responseParser.parseAndValidate(aiResponse.data);
      
      // Enforce the current pack ID
      parsedDomain.id = packId;
      parsedDomain.status = 'ready';

      // 6. Persist Result
      await this.packRepo.save(parsedDomain);

      // 7. Update Store (including Telemetry if needed, but not user content)
      store.updateWorkspace({ pack: parsedDomain });
      // Log telemetry operationally (e.g., console or metrics service)
      console.log('[Telemetry]', aiResponse.telemetry);
      
      store.updateGeneration({ isGenerating: false, error: null });
      
    } catch (error: any) {
      store.updateGeneration({ isGenerating: false, error: error.message });
      await this.packRepo.updateStatus(packId, 'error');
    }
  }
}
