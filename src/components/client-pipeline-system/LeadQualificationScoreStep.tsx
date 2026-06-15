import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, BarChart3, Check, ArrowRight } from 'lucide-react';
import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import { cn } from '../../lib/utils';
import { generateLeadScorecard, getServiceCategory } from '../../lib/blueprint-content';
import type { ScoreFactor } from '../../types/client-pipeline-system';

const STATIC_FACTORS: { name: string; maxScore: number }[] = [
  { name: 'Niche Fit', maxScore: 5 },
  { name: 'Visible Problem', maxScore: 5 },
  { name: 'Ability to Pay', maxScore: 5 },
  { name: 'Recent Activity', maxScore: 5 },
  { name: 'Contact Accessibility', maxScore: 5 },
  { name: 'Urgency', maxScore: 5 },
  { name: 'Proof / Portfolio Match', maxScore: 5 },
];

function interpretScore(total: number): string {
  if (total <= 12) return 'Low';
  if (total <= 21) return 'Medium';
  if (total <= 30) return 'High';
  return 'Excellent';
}

function interpretColor(total: number): string {
  if (total <= 12) return 'text-red-400 bg-red-500/10 border-red-500/20';
  if (total <= 21) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  if (total <= 30) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  return 'text-brand-primary bg-brand-primary/10 border-brand-primary/30';
}

export function LeadQualificationScoreStep() {
  const scorecard = useClientPipelineStore((s) => s.leadScorecard);
  const setScorecard = useClientPipelineStore((s) => s.setLeadScorecard);
  const confirmStep = useClientPipelineStore((s) => s.confirmStep);
  const nextStep = useClientPipelineStore((s) => s.nextStep);
  const isCompleted = useClientPipelineStore((s) => s.completedSteps).includes('lead_qualification_score');

  const factors = useMemo((): ScoreFactor[] => {
    if (scorecard.factors.length === 0) {
      return STATIC_FACTORS.map((f) => ({ name: f.name, score: 0, maxScore: f.maxScore }));
    }
    return scorecard.factors;
  }, [scorecard.factors]);

  const total = useMemo(() => factors.reduce((sum, f) => sum + f.score, 0), [factors]);
  const interpretation = interpretScore(total);
  const colorClass = interpretColor(total);

  const service = useClientPipelineStore((s) => s.phase4Service);
  const niche = useClientPipelineStore((s) => s.phase4Niche) ?? '';
  const cat = getServiceCategory(service);

  const generate = () => {
    setScorecard(generateLeadScorecard(cat, niche));
  };

  const handleContinue = () => {
    confirmStep();
    nextStep();
  };

  const updateScore = (index: number, value: number) => {
    const updated = factors.map((f, i) =>
      i === index ? { ...f, score: Math.min(Math.max(value, 0), f.maxScore) } : f,
    );
    setScorecard({ factors: updated, total: updated.reduce((s, f) => s + f.score, 0), interpretation: interpretScore(updated.reduce((s, f) => s + f.score, 0)) });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 5 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Lead Qualification Score</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Score each factor 1-5 for a typical prospect in your niche. Use this model to qualify leads consistently.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <BarChart3 size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Scorecard Model</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Rate each factor to create your qualification baseline. The total score determines prospect priority.
          </p>
        </div>
      </div>

      {scorecard.factors.length === 0 && (
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Scorecard
        </button>
      )}

      <div className="space-y-3">
        {factors.map((factor, i) => (
          <div
            key={factor.name}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/80">{factor.name}</p>
              <p className="text-[9px] text-zinc-500 mt-0.5">Max: {factor.maxScore}</p>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => updateScore(i, val)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-[10px] font-bold transition-all duration-200 cursor-pointer',
                    factor.score === val
                      ? 'bg-brand-primary/20 border border-brand-primary/40 text-brand-primary'
                      : 'bg-white/[0.03] border border-white/5 text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300',
                  )}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={cn(
        'flex items-center justify-between p-4 rounded-xl border',
        colorClass,
      )}>
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em]">Total Score</p>
          <p className="text-lg font-bold">{total} / 35</p>
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.08em]">{interpretation}</span>
      </div>

      <p className="text-[10px] text-zinc-500 leading-relaxed">
        0-12 Low priority &bull; 13-21 Medium priority &bull; 22-30 High priority &bull; 31-35 Excellent fit
      </p>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Lead qualification score saved</span>
        </div>
      ) : (
        <motion.button
          onClick={handleContinue}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 h-11 rounded-lg text-xs font-bold uppercase tracking-[0.08em] bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)] transition-all duration-300 cursor-pointer"
        >
          <ArrowRight size={14} />
          Continue to Pipeline List Builder
        </motion.button>
      )}
    </div>
  );
}
