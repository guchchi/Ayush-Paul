import { motion } from 'motion/react';
import { Sparkles, Target, Check, ArrowRight } from 'lucide-react';
import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import { cn } from '../../lib/utils';
import { getServiceCategory, generateIdealClientCriteria } from '../../lib/blueprint-content';

export function IdealClientCriteriaStep() {
  const idealClientCriteria = useClientPipelineStore((s) => s.idealClientCriteria);
  const setIdealClientCriteria = useClientPipelineStore((s) => s.setIdealClientCriteria);
  const confirmStep = useClientPipelineStore((s) => s.confirmStep);
  const nextStep = useClientPipelineStore((s) => s.nextStep);
  const isCompleted = useClientPipelineStore((s) => s.completedSteps).includes('ideal_client_criteria');
  const service = useClientPipelineStore((s) => s.phase4Service);
  const niche = useClientPipelineStore((s) => s.phase4Niche) ?? '';

  const isValid = idealClientCriteria.criteria.length > 0;

  const generate = () => {
    const cat = getServiceCategory(service);
    setIdealClientCriteria(generateIdealClientCriteria(cat, niche, service ?? undefined));
  };

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  const priorityColors: Record<string, string> = {
    high: 'text-red-400 bg-red-500/10 border-red-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    low: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 2 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Ideal Client Criteria</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Define the signals that identify a high-quality prospect worth pursuing.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Target size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">What Makes a Good Client</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            These criteria help you filter prospects and focus your outreach on the best-fit opportunities.
          </p>
        </div>
      </div>

      {idealClientCriteria.criteria.length === 0 && (
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Ideal Client Criteria
        </button>
      )}

      {idealClientCriteria.criteria.length > 0 && (
        <div className="space-y-3">
          {idealClientCriteria.criteria.map((criterion, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-white/90">{criterion.label}</h3>
                <span className={cn(
                  'shrink-0 text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md border',
                  priorityColors[criterion.priority],
                )}>
                  {criterion.priority}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">Why It Matters</p>
                  <p className="text-xs text-zinc-300">{criterion.whyItMatters}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">How to Check</p>
                  <p className="text-xs text-zinc-300">{criterion.howToCheck}</p>
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
            value={JSON.stringify(idealClientCriteria, null, 2)}
            onChange={(e) => {
              try { setIdealClientCriteria(JSON.parse(e.target.value)); }
              catch { /* ignore invalid json while typing */ }
            }}
            rows={4}
            className="w-full mt-2 px-4 py-3 rounded-xl outline-none text-xs text-white/90 placeholder:text-zinc-500 resize-none bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300 font-mono"
            placeholder="Criteria data (JSON)"
          />
        </details>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Ideal client criteria saved</span>
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
          Continue to Prospect Type Selector
        </motion.button>
      )}
    </div>
  );
}
