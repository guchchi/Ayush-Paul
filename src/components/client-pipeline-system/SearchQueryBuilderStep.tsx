import { motion } from 'motion/react';
import { Sparkles, Search, Check, ArrowRight } from 'lucide-react';
import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import { cn } from '../../lib/utils';
import { getServiceCategory, generateSearchQueries } from '../../lib/blueprint-content';

export function SearchQueryBuilderStep() {
  const searchQueryBank = useClientPipelineStore((s) => s.searchQueryBank);
  const setSearchQueryBank = useClientPipelineStore((s) => s.setSearchQueryBank);
  const confirmStep = useClientPipelineStore((s) => s.confirmStep);
  const nextStep = useClientPipelineStore((s) => s.nextStep);
  const isCompleted = useClientPipelineStore((s) => s.completedSteps).includes('search_query_builder');
  const service = useClientPipelineStore((s) => s.phase4Service);
  const niche = useClientPipelineStore((s) => s.phase4Niche) ?? '';

  const isValid = searchQueryBank.queries.length > 0;

  const generate = () => {
    const cat = getServiceCategory(service);
    setSearchQueryBank(generateSearchQueries(cat, niche, service ?? undefined));
  };

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 4 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Search Query Builder</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Use these search queries to find and qualify prospects across different platforms.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Search size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Prospecting Search Queries</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Copy these queries into the specified platforms to find potential clients. Each query targets specific signals.
          </p>
        </div>
      </div>

      {searchQueryBank.queries.length === 0 && (
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Search Queries
        </button>
      )}

      {searchQueryBank.queries.length > 0 && (
        <div className="space-y-3">
          {searchQueryBank.queries.map((query, i) => (
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

      {import.meta.env.DEV && (
        <details className="group">
          <summary className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors select-none">
            View Debug Data
          </summary>
          <textarea
            value={JSON.stringify(searchQueryBank, null, 2)}
            onChange={(e) => {
              try { setSearchQueryBank(JSON.parse(e.target.value)); }
              catch { /* ignore invalid json while typing */ }
            }}
            rows={4}
            className="w-full mt-2 px-4 py-3 rounded-xl outline-none text-xs text-white/90 placeholder:text-zinc-500 resize-none bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300 font-mono"
            placeholder="Search query data (JSON)"
          />
        </details>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Search queries saved</span>
        </div>
      ) : (
        <motion.button
          onClick={handleContinue}
          disabled={!isValid}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'inline-flex items-center gap-2 px-6 h-11 rounded-lg text-xs font-bold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer',
            isValid
              ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)]'
              : 'bg-white/[0.03] border border-white/5 text-zinc-500 cursor-not-allowed',
          )}
        >
          <ArrowRight size={14} />
          Continue to Lead Qualification Score
        </motion.button>
      )}
    </div>
  );
}
