import { motion } from 'motion/react';
import { Check, ArrowRight, Layout, Sparkles } from 'lucide-react';
import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import { cn } from '../../lib/utils';
import type { PortfolioPageStructure } from '../../types/portfolio-system';
import { PAGE_SECTIONS } from '../../lib/blueprint-content';

export function ProofPageStructureStep() {
  const ps = usePortfolioSystemStore((s) => s.pageStructure);
  const setPS = usePortfolioSystemStore((s) => s.setPageStructure);
  const confirmStep = usePortfolioSystemStore((s) => s.confirmStep);
  const nextStep = usePortfolioSystemStore((s) => s.nextStep);
  const isCompleted = usePortfolioSystemStore((s) => s.completedSteps).includes('proof_page_structure');

  const hasSections = ps.sections.length > 0;
  const isValid = hasSections && ps.sections.some((s) => s.included);

  const generate = () => {
    setPS({ sections: PAGE_SECTIONS.map((s) => ({ ...s, included: true })) });
  };

  const toggle = (id: string) => {
    setPS({
      sections: ps.sections.map((s) => s.id === id ? { ...s, included: !s.included } : s),
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
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 5 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Proof Page Structure</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Define the structure of your portfolio page. Choose the sections that best tell your story.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Layout size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Portfolio Page Outline</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            These sections form a complete portfolio page. Turn off any that do not apply.
          </p>
        </div>
      </div>

      {!hasSections && (
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Page Structure
        </button>
      )}

      {hasSections && (
        <div className="space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Sections</p>
          <div className="space-y-2">
            {ps.sections.map((section) => (
              <div
                key={section.id}
                className={cn(
                  'flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer',
                  section.included
                    ? 'border-white/10 bg-white/[0.02]'
                    : 'border-white/[0.04] bg-white/[0.01] opacity-50',
                )}
                onClick={() => toggle(section.id)}
              >
                <span className={cn(
                  'flex items-center justify-center w-5 h-5 rounded shrink-0 mt-0.5 transition-all',
                  section.included ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-white/5 border border-white/5',
                )}>
                  {section.included && <Check size={10} className="text-emerald-400" />}
                </span>
                <div className="flex-1">
                  <p className={cn('text-xs font-semibold', section.included ? 'text-white' : 'text-zinc-500')}>{section.label}</p>
                  <p className="text-[9px] text-zinc-500 mt-0.5">{section.description}</p>
                </div>
                <span className={cn(
                  'text-[8px] font-medium uppercase tracking-[0.1em]',
                  section.included ? 'text-emerald-400' : 'text-zinc-500',
                )}>
                  {section.included ? 'On' : 'Off'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Page structure saved</span>
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
          Continue to Portfolio Copy
        </motion.button>
      )}
    </div>
  );
}
