import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, BarChart3, Check, ArrowRight } from 'lucide-react';
import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import { cn } from '../../lib/utils';
import type { ScoreFactor } from '../../types/client-pipeline-system';

function interpretScore(total: number, maxPossible: number): string {
  const pct = maxPossible > 0 ? total / maxPossible : 0;
  if (pct <= 0.3) return 'Low';
  if (pct <= 0.6) return 'Medium';
  if (pct <= 0.85) return 'High';
  return 'Excellent';
}

function interpretColor(total: number, maxPossible: number): string {
  const pct = maxPossible > 0 ? total / maxPossible : 0;
  if (pct <= 0.3) return 'text-red-400 bg-red-500/10 border-red-500/20';
  if (pct <= 0.6) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  if (pct <= 0.85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  return 'text-brand-primary bg-brand-primary/10 border-brand-primary/30';
}

export function LeadQualificationScoreStep() {
  const pipelinePack = useClientPipelineStore((s) => s.pipelinePack);
  const scorecard = useClientPipelineStore((s) => s.leadScorecard);
  const setScorecard = useClientPipelineStore((s) => s.setLeadScorecard);
  const confirmStep = useClientPipelineStore((s) => s.confirmStep);
  const nextStep = useClientPipelineStore((s) => s.nextStep);
  const isCompleted = useClientPipelineStore((s) => s.completedSteps).includes('lead_qualification_score');

  // Dynamic qualification factors from pipelinePack
  const packFactors = pipelinePack?.qualificationFactors ?? [];

  const factors = useMemo((): ScoreFactor[] => {
    if (packFactors.length === 0) return [];
    if (scorecard.factors.length === packFactors.length && scorecard.factors.every((f) => {
      const match = packFactors.find((pf) => pf.name === f.name);
      return match && f.maxScore === match.weight;
    })) {
      // Reuse existing scores if factor set matches
      return scorecard.factors;
    }
    // Initialize fresh
    return packFactors.map((pf) => ({
      name: pf.name,
      score: 0,
      maxScore: pf.weight,
    }));
  }, [packFactors, scorecard.factors]);

  const maxPossible = useMemo(() => factors.reduce((sum, f) => sum + f.maxScore, 0), [factors]);
  const total = useMemo(() => factors.reduce((sum, f) => sum + f.score, 0), [factors]);
  const interpretation = interpretScore(total, maxPossible);
  const colorClass = interpretColor(total, maxPossible);

  const isValid = packFactors.length > 0;

  const handleGenerate = () => {
    setScorecard({
      factors,
      total,
      interpretation,
    });
  };

  const handleContinue = () => {
    confirmStep();
    nextStep();
  };

  const updateScore = (index: number, value: number) => {
    const updated = factors.map((f, i) =>
      i === index ? { ...f, score: Math.min(Math.max(value, 0), f.maxScore) } : f,
    );
    const newTotal = updated.reduce((s, f) => s + f.score, 0);
    setScorecard({
      factors: updated,
      total: newTotal,
      interpretation: interpretScore(newTotal, maxPossible),
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 5 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Qualification Rules</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Score each factor to qualify prospects consistently. Factors are dynamic — they change based on your strategy context.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <BarChart3 size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Dynamic Qualification Model</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Each factor has a weight (max score) specific to your service, niche, and strategy. Rate 1–{Math.max(...packFactors.map(f => f.weight), 5)} per factor.
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
      ) : packFactors.length === 0 ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400">No qualification factors generated for this configuration.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Factor cards */}
          <div className="space-y-3">
            {packFactors.map((pf, i) => (
              <div key={pf.id || pf.name}>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs font-medium text-white/80">{pf.name}</p>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">{pf.whyImportant}</p>
                    <p className="text-[9px] text-zinc-600 italic">{pf.scoringGuidance}</p>
                    <p className="text-[9px] text-zinc-500">Max: {pf.weight}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {Array.from({ length: Math.min(pf.weight, 5) }, (_, v) => v + 1).map((val) => (
                      <button
                        key={val}
                        onClick={() => updateScore(i, val)}
                        className={cn(
                          'w-7 h-7 rounded-lg text-[9px] font-bold transition-all duration-200 cursor-pointer',
                          (factors[i]?.score ?? 0) === val
                            ? 'bg-brand-primary/20 border border-brand-primary/40 text-brand-primary'
                            : 'bg-white/[0.03] border border-white/5 text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300',
                        )}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total score */}
          <div className={cn(
            'flex items-center justify-between p-4 rounded-xl border',
            colorClass,
          )}>
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em]">Total Score</p>
              <p className="text-lg font-bold">{total} / {maxPossible}</p>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.08em]">{interpretation}</span>
          </div>

          <p className="text-[10px] text-zinc-500 leading-relaxed">
            Factors and weights are dynamic — generated from your service, niche, market, offer, authority, and portfolio readiness.
          </p>
        </div>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Qualification rules saved</span>
        </div>
      ) : (
        <motion.button
          onClick={() => { handleGenerate(); handleContinue(); }}
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
          Continue to Pipeline Builder
        </motion.button>
      )}
    </div>
  );
}
