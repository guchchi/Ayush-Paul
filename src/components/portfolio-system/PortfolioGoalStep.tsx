import { motion } from 'motion/react';
import { Check, ArrowRight, Target, Sparkles } from 'lucide-react';
import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import { cn } from '../../lib/utils';
import { GOAL_OPTIONS, getServiceCategory, getAudienceLabel, generatePortfolioGoalStatement } from '../../lib/blueprint-content';

export function PortfolioGoalStep() {
  const goal = usePortfolioSystemStore((s) => s.portfolioGoal);
  const setGoal = usePortfolioSystemStore((s) => s.setPortfolioGoal);
  const confirmStep = usePortfolioSystemStore((s) => s.confirmStep);
  const nextStep = usePortfolioSystemStore((s) => s.nextStep);
  const isCompleted = usePortfolioSystemStore((s) => s.completedSteps).includes('portfolio_goal');
  const niche = usePortfolioSystemStore((s) => s.phase3Niche) ?? '';
  const serviceLabel = usePortfolioSystemStore((s) => s.phase3ServiceLabel) ?? '';
  const service = usePortfolioSystemStore((s) => s.phase3Service);

  const isValid = goal.statement.trim().length > 0;

  const toggleGoal = (id: string) => {
    const exists = goal.goals.includes(id);
    const newGoals = exists ? goal.goals.filter((g) => g !== id) : [...goal.goals, id];
    setGoal({ ...goal, goals: newGoals });
  };

  const generate = () => {
    const all = GOAL_OPTIONS.map((o) => o.id);
    const cat = getServiceCategory(service);
    setGoal({
      goals: all,
      statement: generatePortfolioGoalStatement(cat, serviceLabel, niche, service || undefined),
    });
  };

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 1 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Portfolio Goal</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          What should your portfolio prove? Choose goals that match your current level.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Target size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Your Portfolio Goal</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Select what you want your portfolio to communicate to potential clients.
          </p>
        </div>
      </div>

      {goal.goals.length === 0 && (
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Portfolio Goal
        </button>
      )}

      <div className="space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Select Goals</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GOAL_OPTIONS.map((opt) => {
            const selected = goal.goals.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggleGoal(opt.id)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                  selected
                    ? 'border-brand-primary/40 bg-brand-primary/[0.06]'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10',
                )}
              >
                <span className={cn(
                  'flex items-center justify-center w-5 h-5 rounded shrink-0',
                  selected ? 'bg-brand-primary/20 border border-brand-primary/40' : 'bg-white/5 border border-white/5',
                )}>
                  {selected && <Check size={10} className="text-brand-primary" />}
                </span>
                <span className={cn('text-xs font-medium', selected ? 'text-white' : 'text-white/70')}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Portfolio Goal Statement</p>
        <textarea
          value={goal.statement}
          onChange={(e) => setGoal({ ...goal, statement: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 rounded-xl outline-none text-xs text-white/90 placeholder:text-zinc-500 resize-none bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
          placeholder="What will your portfolio prove?"
        />
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Portfolio goal saved</span>
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
          Continue to Asset Selection
        </motion.button>
      )}
    </div>
  );
}
