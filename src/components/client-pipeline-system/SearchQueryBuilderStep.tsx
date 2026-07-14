import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Search, Check, ArrowRight } from 'lucide-react';
import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import { cn } from '../../lib/utils';
import type { SearchQuery } from '../../types/client-pipeline-system';

/**
 * Deterministic search query generator — M5-local.
 * Derives search queries from pipeline pack context (target channels,
 * ideal prospect profile, niche, offer type, deliverables).
 * No LLM calls, no random IDs.
 */
function generateSearchQueriesFromPack(
  channels: { platform: string; searchInstructions: string }[],
  profileTitle: string,
  profileCharacteristics: string[],
  serviceLabel: string,
  offerType: string | null,
  deliverables: string[],
): SearchQuery[] {
  const queries: SearchQuery[] = [];

  // Collect unique platforms from channels
  const platforms = [...new Set(channels.map((c) => c.platform))];
  const topPlatforms = platforms.slice(0, 4);

  // Extract keywords from profile
  const keywords = [
    profileTitle,
    serviceLabel,
    ...profileCharacteristics
      .flatMap((c) => c.split(/need|who|that|with|for|and/))
      .map((w) => w.trim())
      .filter((w) => w.length > 3),
  ].filter(Boolean);

  // Platform-targeted queries
  for (const platform of topPlatforms) {
    const channel = channels.find((c) => c.platform === platform);
    const instruction = channel?.searchInstructions || '';

    // Query 1: Direct service search
    queries.push({
      platform,
      query: `"${serviceLabel}" ${profileTitle.split(' ').slice(0, 3).join(' ')}`,
      whatToLookFor: `${profileTitle} who need ${serviceLabel} — check for outdated web presence or inconsistent content quality`,
      howToUse: instruction || `Search on ${platform} for prospects matching the profile`,
      expectedQuality: 'Medium — broad search, requires manual filtering',
    });

    // Query 2: Problem-based search
    if (keywords.length > 0) {
      const problemTerms = deliverables.length > 0
        ? deliverables.slice(0, 2).map((d) => d.replace(/_/g, ' '))
        : ['improve', 'need help'];
      queries.push({
        platform,
        query: `${problemTerms.join(' ')} ${profileTitle.split(' ').slice(0, 2).join(' ')}`,
        whatToLookFor: `Prospects actively discussing problems related to ${problemTerms.join(' and ')}`,
        howToUse: `Look for posts, listings, or profiles mentioning these keywords in context`,
        expectedQuality: 'High — indicates active need or awareness',
      });
    }

    // Query 3: Niche-specific search
    if (offerType) {
      queries.push({
        platform,
        query: `${profileTitle.split(' ').slice(0, 3).join(' ')} ${offerType.replace(/_/g, ' ')}`,
        whatToLookFor: `Prospects looking for ${offerType.replace(/_/g, ' ')}-based engagements`,
        howToUse: `Filter by recent activity to find active prospects`,
        expectedQuality: 'Medium — depends on platform search capabilities',
      });
    }
  }

  // Deduplicate by query string
  const seen = new Set<string>();
  return queries.filter((q) => {
    const key = `${q.platform}:${q.query}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 8);
}

export function SearchQueryBuilderStep() {
  const pipelinePack = useClientPipelineStore((s) => s.pipelinePack);
  const setSearchQueryBank = useClientPipelineStore((s) => s.setSearchQueryBank);
  const confirmStep = useClientPipelineStore((s) => s.confirmStep);
  const nextStep = useClientPipelineStore((s) => s.nextStep);
  const isCompleted = useClientPipelineStore((s) => s.completedSteps).includes('search_query_builder');
  const serviceLabel = useClientPipelineStore((s) => s.phase4ServiceLabel) ?? '';
  const offerType = useClientPipelineStore((s) => s.phase4OfferType);
  const deliverables = useClientPipelineStore((s) => s.phase4Deliverables);

  const generatedQueries = useMemo((): SearchQuery[] => {
    if (!pipelinePack) return [];
    const channels = pipelinePack.targetChannels;
    const profile = pipelinePack.idealProspectProfile;
    return generateSearchQueriesFromPack(
      channels,
      profile.title,
      profile.characteristics,
      serviceLabel,
      offerType,
      deliverables,
    );
  }, [pipelinePack, serviceLabel, offerType, deliverables]);

  const isValid = generatedQueries.length > 0;

  const handleGenerate = () => {
    setSearchQueryBank({ queries: generatedQueries });
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 4 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Search Queries</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Ready-to-use search queries tailored to your prospect profile, channels, and offer.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Search size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Prospecting Search Queries</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Copy these queries into the specified platforms to find potential clients. Each query targets signals from your strategy context.
          </p>
        </div>
      </div>

      {!pipelinePack ? (
        <div className="flex items-center justify-center p-8 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="text-center space-y-2">
            <p className="text-sm text-zinc-500">Pipeline strategy not yet generated.</p>
            <p className="text-[11px] text-zinc-600">Complete upstream modules and return here.</p>
          </div>
        </div>
      ) : generatedQueries.length === 0 ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400">No queries could be generated. Ensure strategy context is available.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {generatedQueries.map((query, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
                  {query.platform}
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-200 bg-black/20 rounded-lg px-3 py-2 leading-relaxed">
                {query.query}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">What to Look For</p>
                  <p className="text-xs text-zinc-300">{query.whatToLookFor}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">How to Use</p>
                  <p className="text-xs text-zinc-300">{query.howToUse}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">Expected Quality</p>
                  <p className="text-xs text-zinc-300">{query.expectedQuality}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {isCompleted ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Check size={14} className="text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">Search queries saved</span>
          </div>
        ) : (
          <motion.button
            onClick={handleGenerate}
            disabled={!isValid}
            whileTap={{ scale: 0.97 }}
            className={cn(
              'inline-flex items-center gap-2 px-6 h-11 rounded-lg text-xs font-bold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer',
              isValid
                ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)]'
                : 'bg-white/[0.03] border border-white/5 text-zinc-500 cursor-not-allowed',
            )}
          >
            <Sparkles size={14} />
            Generate &amp; Confirm Search Queries
          </motion.button>
        )}
      </div>
    </div>
  );
}
