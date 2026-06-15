import { motion } from 'motion/react';
import { Sparkles, Map, Check, ArrowRight } from 'lucide-react';
import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import { cn } from '../../lib/utils';
import { getServiceCategory, generateClientSourceMap } from '../../lib/blueprint-content';

export function ClientSourceMapStep() {
  const clientSourceMap = useClientPipelineStore((s) => s.clientSourceMap);
  const setClientSourceMap = useClientPipelineStore((s) => s.setClientSourceMap);
  const confirmStep = useClientPipelineStore((s) => s.confirmStep);
  const nextStep = useClientPipelineStore((s) => s.nextStep);
  const isCompleted = useClientPipelineStore((s) => s.completedSteps).includes('client_source_map');
  const service = useClientPipelineStore((s) => s.phase4Service);
  const niche = useClientPipelineStore((s) => s.phase4Niche) ?? '';
  const serviceLabel = useClientPipelineStore((s) => s.phase4ServiceLabel) ?? '';

  const isValid = clientSourceMap.sources.length > 0;

  const generate = () => {
    const cat = getServiceCategory(service);
    setClientSourceMap(generateClientSourceMap(cat, niche, service ?? undefined));
  };

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  const difficultyColor = (d: string) => {
    if (d === 'easy') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (d === 'medium') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 1 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Client Source Map</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Find the best places to discover clients who need {serviceLabel || 'your service'}.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Map size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Where to Find Clients</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            These are proven sources to find clients who match your offer. Use each source's search hint to start prospecting.
          </p>
        </div>
      </div>

      {clientSourceMap.sources.length === 0 && (
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Client Source Map
        </button>
      )}

      {clientSourceMap.sources.length > 0 && (
        <div className="space-y-3">
          {clientSourceMap.sources.map((source, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/90">{source.sourceName}</h3>
                <span className={cn(
                  'text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md border',
                  difficultyColor(source.difficulty),
                )}>
                  {source.difficulty}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">Where to Find</p>
                  <p className="text-xs text-zinc-300">{source.whereToFind}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">Why It Works</p>
                  <p className="text-xs text-zinc-300">{source.whyItWorks}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">Search Hint</p>
                  <p className="text-xs text-zinc-300 font-mono">{source.searchHint}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">Best For</p>
                  <p className="text-xs text-zinc-300">{source.bestFor}</p>
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
            value={JSON.stringify(clientSourceMap, null, 2)}
            onChange={(e) => {
              try { setClientSourceMap(JSON.parse(e.target.value)); }
              catch { /* ignore invalid json while typing */ }
            }}
            rows={4}
            className="w-full mt-2 px-4 py-3 rounded-xl outline-none text-xs text-white/90 placeholder:text-zinc-500 resize-none bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300 font-mono"
            placeholder="Source map data (JSON)"
          />
        </details>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Client source map saved</span>
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
          Continue to Ideal Client Criteria
        </motion.button>
      )}
    </div>
  );
}
