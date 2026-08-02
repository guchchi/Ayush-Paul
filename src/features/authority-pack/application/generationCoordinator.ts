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
function formatId(str?: string | null): string {
  if (!str) return '';
  const formatted = str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return formatted
    .replace(/\bYoutube\b/g, 'YouTube')
    .replace(/\bB2b\b/g, 'B2B')
    .replace(/\bUx\b/g, 'UX')
    .replace(/\bAi\b/g, 'AI');
}

function buildContextDrivenFallbackPack(packId: string, rawInputs?: any): AuthorityPackDomain {
  const mod3State = rawInputs || {};
  const authorityProfile = mod3State.authorityProfile || {};
  const niche = formatId(mod3State.mod1NicheId) || 'Your Target Niche';
  const targetMarket = formatId(mod3State.mod1MarketId) || 'Ideal Clients';
  const serviceId = formatId(mod3State.mod1ServiceId) || 'High-Ticket Solutions';
  const position = authorityProfile.position || 'Domain Authority Specialist';
  const trustPromise = authorityProfile.coreTrustPromise || 'Guaranteed outcome execution backed by verifiable proof assets';

  return {
    id: packId,
    version: '1.0',
    status: 'ready',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    executiveSummary: {
      strategyOverview: `Comprehensive authority roadmap positioning you as the leading ${position} for ${targetMarket}.`,
      keyInsight: `Prospects in ${niche} prioritize proven implementation frameworks over unverified claims.`,
      primaryRecommendation: trustPromise,
      readingGuidance: 'Review your 3 core Strategic Pillars and complete the Action Plan items in sequence.'
    },
    strategicPillars: [
      {
        id: 'pillar-1',
        title: 'Authority Positioning & Trust Anchor',
        description: `Establish unquestionable authority in ${niche} as a ${position} focused on ${serviceId}.`,
        rationale: 'High-ticket buyers choose specialists who demonstrate deep domain clarity.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'pillar-2',
        title: 'Proof-Asset Demonstration Engine',
        description: 'Deploy public case studies, live site teardowns, and verifiable operational workflows.',
        rationale: 'Demonstrated proof eliminates sales friction and shortens client acquisition cycles.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'pillar-3',
        title: 'Conversion & Outreach Architecture',
        description: `Structure your profile and content distribution to drive qualified inbound inquiries from ${targetMarket}.`,
        rationale: 'Consistent value-first positioning converts audience trust into high-value engagements.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    actionPlan: [
      {
        id: 'action-1',
        title: 'Optimize Profile & Headline',
        description: `Rewrite profile headline to feature: "${trustPromise}".`,
        priority: 'high',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'action-2',
        title: 'Publish Case Study Proof Asset',
        description: 'Deploy your top case study with problem, solution, metrics, and video walkthrough.',
        priority: 'high',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'action-3',
        title: 'Initiate Targeted Authority Outreach',
        description: `Connect with key decision makers in ${targetMarket} sharing your customized framework.`,
        priority: 'medium',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  };
}

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
      
      // We will mark the pack as 'generating' in DB if connected
      await this.packRepo.updateStatus(packId, 'generating');

      // 2. Build Context
      const context = this.contextBuilder.buildContext(rawInputs);
      const prompt = this.promptBuilder(context);

      let parsedDomain: AuthorityPackDomain;

      try {
        // 3. Call AI Service
        const aiResponse = await this.aiService.generateStructured(prompt, this.responseSchema, {
          temperature: 0.2
        });
        parsedDomain = this.responseParser.parseAndValidate(aiResponse.data);
      } catch (aiErr) {
        console.warn('[GenerationCoordinator] AI Generation failed or key unconfigured, using context-driven fallback pack:', aiErr);
        parsedDomain = buildContextDrivenFallbackPack(packId, rawInputs);
      }

      // Enforce the current pack ID
      parsedDomain.id = packId;
      parsedDomain.status = 'ready';

      // 6. Persist Result
      await this.packRepo.save(parsedDomain);

      // 7. Update Store
      store.updateWorkspace({ pack: parsedDomain });
      store.updateGeneration({ isGenerating: false, error: null });
      
    } catch (error: any) {
      store.updateGeneration({ isGenerating: false, error: error.message || 'Generation failed' });
      await this.packRepo.updateStatus(packId, 'error');
    }
  }
}
