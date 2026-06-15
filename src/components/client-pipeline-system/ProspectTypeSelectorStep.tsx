import { motion } from 'motion/react';
import { Sparkles, Users, Check, ArrowRight } from 'lucide-react';
import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import { cn } from '../../lib/utils';
import { getServiceCategory, generateProspectTypes } from '../../lib/blueprint-content';

export function ProspectTypeSelectorStep() {
  const prospectTypes = useClientPipelineStore((s) => s.prospectTypes);
  const setProspectTypes = useClientPipelineStore((s) => s.setProspectTypes);
  const confirmStep = useClientPipelineStore((s) => s.confirmStep);
  const nextStep = useClientPipelineStore((s) => s.nextStep);
  const isCompleted = useClientPipelineStore((s) => s.completedSteps).includes('prospect_type_selector');
  const service = useClientPipelineStore((s) => s.phase4Service);
  const niche = useClientPipelineStore((s) => s.phase4Niche) ?? '';

  const isValid = prospectTypes.types.length > 0;

  const generate = () => {
    const cat = getServiceCategory(service);
    setProspectTypes(generateProspectTypes(cat, niche, service ?? undefined));
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

  const priorityColors: Record<string, string> = {
    high: 'text-red-400 bg-red-500/10 border-red-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    low: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 3 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Prospect Type Selector</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Identify the specific types of prospects you should prioritize in your outreach.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Users size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Your Target Prospect Types</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Each type represents a specific category of prospect with unique traits, needs, and outreach angles.
          </p>
        </div>
      </div>

      {prospectTypes.types.length === 0 && (
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Prospect Types
        </button>
      )}

      {prospectTypes.types.length > 0 && (
        <div className="space-y-3">
          {prospectTypes.types.map((type, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-white/90">{type.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md border',
                    difficultyColor(type.difficulty),
                  )}>
                    {type.difficulty}
                  </span>
                  <span className={cn(
                    'text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md border',
                    priorityColors[type.priority],
                  )}>
                    {type.priority}
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-300">{type.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">Why Good Fit</p>
                  <p className="text-xs text-zinc-300">{type.whyGoodFit}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">Where to Find</p>
                  <p className="text-xs text-zinc-300">{type.whereToFind}</p>
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
            value={JSON.stringify(prospectTypes, null, 2)}
            onChange={(e) => {
              try { setProspectTypes(JSON.parse(e.target.value)); }
              catch { /* ignore invalid json while typing */ }
            }}
            rows={4}
            className="w-full mt-2 px-4 py-3 rounded-xl outline-none text-xs text-white/90 placeholder:text-zinc-500 resize-none bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300 font-mono"
            placeholder="Prospect types data (JSON)"
          />
        </details>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Prospect types saved</span>
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
          Continue to Search Query Builder
        </motion.button>
      )}
    </div>
  );
}
