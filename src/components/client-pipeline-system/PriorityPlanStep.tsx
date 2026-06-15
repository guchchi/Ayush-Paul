import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Check, ArrowRight } from 'lucide-react';
import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import { cn } from '../../lib/utils';
import { getServiceCategory, generatePriorityPlan } from '../../lib/blueprint-content';

export function PriorityPlanStep() {
  const priorityPlan = useClientPipelineStore((s) => s.priorityPlan);
  const setPriorityPlan = useClientPipelineStore((s) => s.setPriorityPlan);
  const pipelineList = useClientPipelineStore((s) => s.pipelineList);
  const confirmStep = useClientPipelineStore((s) => s.confirmStep);
  const nextStep = useClientPipelineStore((s) => s.nextStep);
  const isCompleted = useClientPipelineStore((s) => s.completedSteps).includes('priority_plan');
  const service = useClientPipelineStore((s) => s.phase4Service);
  const niche = useClientPipelineStore((s) => s.phase4Niche) ?? '';

  const cat = getServiceCategory(service);

  const validProspects = pipelineList.filter(
    (p) => (p.prospectName?.trim() || p.websiteUrl?.trim()) && (p.score > 0 || p.visibleProblem?.trim())
  );

  const isValid = priorityPlan.entries.length > 0 || validProspects.length === 0;

  const generate = () => {
    setPriorityPlan(generatePriorityPlan(pipelineList, cat, niche));
  };

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 7 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Priority Plan</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Sort your pipeline by score and define your outreach strategy for the top prospects.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <TrendingUp size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Top Prospects</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            The highest-scored prospects are prioritised. Each entry includes the approach angle and asset to show.
          </p>
        </div>
      </div>

      {validProspects.length === 0 ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400">
            Add prospects with names and scores to the pipeline list first before generating a priority plan.
          </p>
        </div>
      ) : priorityPlan.entries.length === 0 ? (
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Priority Plan
        </button>
      ) : null}

      {priorityPlan.entries.length > 0 && (
        <div className="space-y-3">
          {priorityPlan.entries.map((entry, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary/15 text-[10px] font-bold text-brand-primary shrink-0">
                  {i + 1}
                </span>
                <h3 className="text-sm font-semibold text-white/90">{entry.prospectName}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Why Worth Contacting</p>
                  <p className="text-xs text-zinc-300">{entry.whyWorthContacting}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Angle to Use</p>
                  <p className="text-xs text-zinc-300">{entry.angleToUse}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Portfolio Asset to Show</p>
                  <p className="text-xs text-zinc-300">{entry.portfolioAssetToShow}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Next Step</p>
                  <p className="text-xs text-zinc-300">{entry.nextStep}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCompleted || (validProspects.length === 0 && priorityPlan.entries.length === 0) ? null : (
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
          Continue to Client Pipeline Report
        </motion.button>
      )}

      {isCompleted && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Priority plan saved</span>
        </div>
      )}
    </div>
  );
}
