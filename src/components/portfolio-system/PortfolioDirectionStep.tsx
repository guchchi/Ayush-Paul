import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Briefcase, Check, ArrowRight, AlertTriangle } from 'lucide-react';
import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import { generatePortfolioDirection } from '../../lib/portfolio-system/composer';
import { composeStep1Content } from '../../lib/portfolio-system/personalized-content';
import type { PortfolioGoal } from '../../types/portfolio-system';
import { cn } from '../../lib/utils';

const GOAL_LABELS: Record<PortfolioGoal, string> = {
  start_conversation: 'Start a Conversation',
  review_offer: 'Review My Offer',
  evaluate_capability: 'Evaluate Capability',
  request_project: 'Request a Project',
};

const GOALS: PortfolioGoal[] = [
  'start_conversation',
  'review_offer',
  'evaluate_capability',
  'request_project',
];

export function PortfolioDirectionStep() {
  const upstream = usePortfolioSystemStore((s) => s.upstream);
  const portfolioDirection = usePortfolioSystemStore((s) => s.portfolioDirection);
  const setPortfolioDirection = usePortfolioSystemStore((s) => s.setPortfolioDirection);
  const staleSince = usePortfolioSystemStore((s) => s.staleSince);
  const markEdited = usePortfolioSystemStore((s) => s.markEdited);
  const confirmStep = usePortfolioSystemStore((s) => s.confirmStep);
  const nextStep = usePortfolioSystemStore((s) => s.nextStep);
  const completedSteps = usePortfolioSystemStore((s) => s.completedSteps);

  const pc = useMemo(() => upstream ? composeStep1Content(upstream) : null, [upstream]);
  const isCompleted = completedSteps.includes('portfolio_direction');
  const direction = portfolioDirection;

  if (!upstream) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/[0.03] border border-white/5 mb-4">
          <Briefcase size={20} className="text-zinc-500" />
        </div>
        <p className="text-sm text-zinc-500 text-center max-w-xs">
          Complete Module 3 first to pipe your selections here.
        </p>
      </div>
    );
  }

  if (!direction) {
    const handleGenerate = () => {
      const result = generatePortfolioDirection(upstream);
      setPortfolioDirection(result);
    };

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 1 of 6</span>
          <h2 className="text-2xl font-bold tracking-tight text-white/95">Portfolio Direction</h2>
          <p className="text-sm text-zinc-400 max-w-lg">
            Define the direction and positioning for your portfolio.
          </p>
        </div>
        <motion.button
          onClick={handleGenerate}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/10 text-sm font-semibold text-brand-primary transition-all duration-200 cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Direction
        </motion.button>
      </div>
    );
  }

  const handleGoalChange = (goal: PortfolioGoal) => {
    setPortfolioDirection({ ...direction, goal, isCustom: true });
    markEdited('portfolioDirection.goal');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 1 of 6</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Portfolio Direction</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Define the direction and positioning for your portfolio.
        </p>
      </div>

      {staleSince && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle size={14} className="text-amber-400 shrink-0" />
          <span className="text-xs font-medium text-amber-400">
            Upstream context has changed. Regenerate?
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Portfolio Goal</span>
        {direction.isCustom && (
          <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[9px] font-bold uppercase tracking-[0.1em] text-brand-primary">
            Customised
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {GOALS.map((g) => {
          const selected = direction.goal === g;
          return (
            <button
              key={g}
              onClick={() => handleGoalChange(g)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                selected
                  ? 'border-brand-primary/40 bg-brand-primary/[0.06]'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10',
              )}
            >
              <span
                className={cn(
                  'flex items-center justify-center w-5 h-5 rounded-full shrink-0',
                  selected
                    ? 'bg-brand-primary/20 border border-brand-primary/40'
                    : 'bg-white/5 border border-white/5',
                )}
              >
                {selected && <span className="w-2 h-2 rounded-full bg-brand-primary" />}
              </span>
              <div className="min-w-0">
                <span className={cn('text-xs font-medium', selected ? 'text-white' : 'text-white/70')}>
                  {GOAL_LABELS[g]}
                </span>
                {pc?.goalPlaceholderHints[g] && (
                  <p className="text-[9px] text-zinc-500 leading-tight mt-0.5">{pc.goalPlaceholderHints[g]}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {pc?.recommendationRationale && (
        <p className="text-xs text-zinc-400 italic leading-relaxed">{pc.recommendationRationale}</p>
      )}

      <div className="space-y-2">
        <label className="text-xs font-medium text-white/80">Target Buyer</label>
        <input
          type="text"
          value={direction.targetBuyer}
          onChange={(e) => {
            setPortfolioDirection({ ...direction, targetBuyer: e.target.value, isCustom: true });
          }}
          className="w-full px-4 py-3 rounded-xl outline-none text-xs text-white/90 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
          placeholder={pc?.targetBuyerHelper || 'e.g. YouTube Creators'}
        />
        {pc?.targetBuyerHelper && (
          <p className="text-[10px] text-zinc-500 italic leading-relaxed px-1">{pc.targetBuyerHelper}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-white/80">Portfolio Promise</label>
        <textarea
          value={direction.portfolioPromise}
          onChange={(e) => {
            setPortfolioDirection({ ...direction, portfolioPromise: e.target.value, isCustom: true });
          }}
          rows={3}
          className="w-full px-4 py-3 rounded-xl outline-none text-xs text-white/90 placeholder:text-zinc-500 resize-none bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
          placeholder={pc?.portfolioPromiseHelper || 'What does your portfolio promise to buyers?'}
        />
        {pc?.portfolioPromiseHelper && (
          <p className="text-[10px] text-zinc-500 italic leading-relaxed px-1">{pc.portfolioPromiseHelper}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-white/80">CTA Intent</label>
        <input
          type="text"
          value={direction.ctaIntent}
          onChange={(e) => {
            setPortfolioDirection({ ...direction, ctaIntent: e.target.value, isCustom: true });
          }}
          className="w-full px-4 py-3 rounded-xl outline-none text-xs text-white/90 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
          placeholder={pc?.ctaIntentHelper || 'e.g. review_approach'}
        />
        {pc?.ctaIntentHelper && (
          <p className="text-[10px] text-zinc-500 italic leading-relaxed px-1">{pc.ctaIntentHelper}</p>
        )}
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-medium text-emerald-400">Portfolio direction confirmed</span>
        </div>
      ) : (
        <motion.button
          onClick={() => {
            confirmStep();
            nextStep();
          }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 h-11 rounded-lg text-xs font-bold uppercase tracking-[0.08em] bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)] transition-all duration-200 cursor-pointer"
        >
          <Check size={14} />
          Confirm &amp; Continue
        </motion.button>
      )}
    </div>
  );
}
