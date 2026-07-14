import { motion } from 'motion/react';
import { Sparkles, Radio, Shield, Check, ArrowRight } from 'lucide-react';
import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import { cn } from '../../lib/utils';

export function IdealClientCriteriaStep() {
  const pipelinePack = useClientPipelineStore((s) => s.pipelinePack);
  const confirmStep = useClientPipelineStore((s) => s.confirmStep);
  const nextStep = useClientPipelineStore((s) => s.nextStep);
  const isCompleted = useClientPipelineStore((s) => s.completedSteps).includes('ideal_client_criteria');

  const signals = pipelinePack?.buyingSignals ?? [];
  const disqualifiers = pipelinePack?.disqualifiers ?? [];
  const isValid = signals.length > 0;

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 2 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Prospect Signals</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Learn what signals indicate a high-fit prospect and which red flags mean do not pursue.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Radio size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">What to Look For</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            These signals are specific to your niche, offer, and authority position. Use them to review each prospect before investing time.
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
      ) : (
        <div className="space-y-6">
          {/* Buying Signals */}
          <div className="space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
              Buying Signals ({signals.length})
            </p>
            {signals.length === 0 ? (
              <p className="text-xs text-zinc-500">No specific buying signals generated for this configuration.</p>
            ) : (
              <div className="space-y-3">
                {signals.map((signal, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3"
                  >
                    <p className="text-sm font-semibold text-white/90 leading-relaxed">{signal.signal}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Why It Matters</p>
                        <p className="text-xs text-zinc-300">{signal.whyItMatters}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">How to Detect</p>
                        <p className="text-xs text-zinc-300">{signal.howToDetect}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Disqualifiers */}
          {disqualifiers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield size={12} className="text-red-400" />
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-red-400/80">
                  Do Not Pursue ({disqualifiers.length})
                </p>
              </div>
              <div className="space-y-2">
                {disqualifiers.map((dq, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10"
                  >
                    <span className="text-red-400/70 text-[10px] font-bold mt-0.5">✕</span>
                    <p className="text-xs text-zinc-300 leading-relaxed">{dq}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Prospect signals reviewed</span>
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
          Continue to Discovery Channels
        </motion.button>
      )}
    </div>
  );
}
