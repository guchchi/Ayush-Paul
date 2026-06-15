import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Plus, Trash2, Sparkles } from 'lucide-react';
import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import { cn } from '../../lib/utils';
import { getServiceCategory, generateSampleProject } from '../../lib/blueprint-content';

export function SampleProjectBuilderStep() {
  const sp = usePortfolioSystemStore((s) => s.sampleProject);
  const setSP = usePortfolioSystemStore((s) => s.setSampleProject);
  const confirmStep = usePortfolioSystemStore((s) => s.confirmStep);
  const nextStep = usePortfolioSystemStore((s) => s.nextStep);
  const isCompleted = usePortfolioSystemStore((s) => s.completedSteps).includes('sample_project_builder');
  const service = usePortfolioSystemStore((s) => s.phase3Service);
  const niche = usePortfolioSystemStore((s) => s.phase3Niche) ?? '';
  const serviceLabel = usePortfolioSystemStore((s) => s.phase3ServiceLabel) ?? '';
  const offerName = usePortfolioSystemStore((s) => s.phase3OfferName) ?? '';

  const isValid = sp.projectName.trim().length > 0;

  const generate = () => {
    const cat = getServiceCategory(service);
    const proj = generateSampleProject(cat, niche, service || undefined);
    setSP(proj);
  };

  const addDeliverable = () => {
    setSP({ ...sp, deliverables: [...sp.deliverables, ''] });
  };

  const updateDeliverable = (i: number, v: string) => {
    const d = [...sp.deliverables];
    d[i] = v;
    setSP({ ...sp, deliverables: d });
  };

  const removeDeliverable = (i: number) => {
    setSP({ ...sp, deliverables: sp.deliverables.filter((_, idx) => idx !== i) });
  };

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 4 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Sample Project Builder</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Generate a sample project idea based on your service and niche. This becomes a portfolio piece.
        </p>
      </div>

      {!sp.projectName && (
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Sample Project
        </button>
      )}

      <div className="space-y-4">
        <Field label="Project Name" value={sp.projectName} onChange={(v) => setSP({ ...sp, projectName: v })} placeholder="e.g. Gaming Shorts Sample Pack" />
        <Field label="Goal" value={sp.goal} onChange={(v) => setSP({ ...sp, goal: v })} placeholder="What should this project prove?" multiline />
        <Field label="What to Create" value={sp.whatToCreate} onChange={(v) => setSP({ ...sp, whatToCreate: v })} placeholder="Describe what you will actually make" multiline />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Deliverables</span>
            <button onClick={addDeliverable} className="flex items-center gap-1 text-[9px] text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer">
              <Plus size={10} /> Add
            </button>
          </div>
          {sp.deliverables.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={d}
                onChange={(e) => updateDeliverable(i, e.target.value)}
                className="flex-1 h-9 px-3 rounded-lg outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
                placeholder="e.g. 3 short-form clips"
              />
              <button onClick={() => removeDeliverable(i)} className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer">
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>

        <Field label="Timeline" value={sp.timeline} onChange={(v) => setSP({ ...sp, timeline: v })} placeholder="e.g. 1 week" />
        <Field label="How to Present It" value={sp.howToPresent} onChange={(v) => setSP({ ...sp, howToPresent: v })} placeholder="How will you showcase this in your portfolio?" multiline />
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Sample project saved</span>
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
          Continue to Proof Page Structure
        </motion.button>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const cls = "w-full px-3 py-2 rounded-lg outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300";
  return (
    <div className="space-y-1">
      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className={`${cls} resize-none`} placeholder={placeholder} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} placeholder={placeholder} />
      )}
    </div>
  );
}
