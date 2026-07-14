import { motion } from 'motion/react';
import { Sparkles, UserCheck, Check, ArrowRight } from 'lucide-react';
import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import { cn } from '../../lib/utils';

export function ClientSourceMapStep() {
  const pipelinePack = useClientPipelineStore((s) => s.pipelinePack);
  const confirmStep = useClientPipelineStore((s) => s.confirmStep);
  const nextStep = useClientPipelineStore((s) => s.nextStep);
  const isCompleted = useClientPipelineStore((s) => s.completedSteps).includes('client_source_map');

  const profile = pipelinePack?.idealProspectProfile;
  const isValid = !!profile && profile.characteristics.length > 0;

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 1 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Prospect Profile</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          The ideal prospect persona derived from your service, market, niche, offer, authority, and portfolio.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <UserCheck size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Your Target Persona</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            This profile was composed from all upstream context — not generic filler. Every characteristic and evidence
            point was selected by your service, niche, market, offer, authority position, and portfolio readiness.
          </p>
        </div>
      </div>

      {!profile ? (
        <div className="flex items-center justify-center p-8 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="text-center space-y-2">
            <p className="text-sm text-zinc-500">Pipeline strategy not yet generated.</p>
            <p className="text-[11px] text-zinc-600">Complete upstream modules and return here.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Title & Description */}
          <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
            <h3 className="text-lg font-bold text-white/95">{profile.title}</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{profile.description}</p>
          </div>

          {/* Characteristics */}
          <div className="space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Characteristics</p>
            <div className="grid gap-2">
              {profile.characteristics.map((c, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-primary/15 text-[9px] font-bold text-brand-primary shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{c}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence of Fit */}
          <div className="space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Evidence of Fit</p>
            <div className="grid gap-2">
              {profile.evidenceOfFit.map((e, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 text-[9px] font-bold text-emerald-400 shrink-0 mt-0.5">
                    ✓
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{e}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Prospect profile reviewed</span>
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
          Continue to Prospect Signals
        </motion.button>
      )}
    </div>
  );
}
