import { motion } from 'motion/react';
import { Check, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import { cn } from '../../lib/utils';
import { getServiceCategory, getAudienceLabel, generateCaseStudy } from '../../lib/blueprint-content';

export function CaseStudyBuilderStep() {
  const rawCaseStudy = usePortfolioSystemStore((s) => s.caseStudy);
  const cs = rawCaseStudy;
  const setCaseStudy = usePortfolioSystemStore((s) => s.setCaseStudy);
  const confirmStep = usePortfolioSystemStore((s) => s.confirmStep);
  const nextStep = usePortfolioSystemStore((s) => s.nextStep);
  const isCompleted = usePortfolioSystemStore((s) => s.completedSteps).includes('case_study_builder');
  const proofAssets = usePortfolioSystemStore((s) => s.phase3ProofAssets) ?? [];
  const niche = usePortfolioSystemStore((s) => s.phase3Niche) ?? '';
  const serviceLabel = usePortfolioSystemStore((s) => s.phase3ServiceLabel) ?? '';
  const deliverables = usePortfolioSystemStore((s) => s.phase3Deliverables) ?? [];
  const service = usePortfolioSystemStore((s) => s.phase3Service);

  const isValid = cs.projectTitle.trim().length > 0;

  const update = (key: keyof typeof cs, value: string | boolean) => {
    setCaseStudy({ ...cs, [key]: value });
  };

  const generate = () => {
    const firstAsset = proofAssets[0];
    const title = firstAsset?.title || `Sample ${serviceLabel || 'Service'} Project`;
    const cat = getServiceCategory(service);
    const audience = getAudienceLabel(niche);
    const t = generateCaseStudy(cat, deliverables, audience, niche, service || undefined);

    setCaseStudy({
      projectTitle: title,
      clientNicheType: audience,
      problem: t.problem,
      process: t.process,
      deliverables: deliverables.length > 0
        ? deliverables.slice(0, 3).join(', ')
        : 'Completed deliverables as agreed',
      resultExpectedOutcome: t.result,
      toolsUsed: t.tools,
      cta: t.cta,
      isSampleProject: true,
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
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 3 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Case Study Builder</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Create a beginner-safe case study structure. Label it as a sample project if no real client exists.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-400/5 border border-amber-400/15">
        <FileText size={14} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.1em]">No Fake Claims</p>
          <p className="text-[10px] text-amber-400/70 mt-0.5">
            If no real client exists, keep this labeled as a sample project. Do not create fake client claims.
          </p>
        </div>
      </div>

      {!cs.projectTitle && (
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Case Study Draft
        </button>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={cs.isSampleProject}
              onChange={(e) => update('isSampleProject', e.target.checked)}
              className="accent-brand-primary"
            />
            This is a sample project (not a real client)
          </label>
        </div>

        <Field label="Project Title" value={cs.projectTitle} onChange={(v) => update('projectTitle', v)} placeholder="e.g. Gaming Shorts Sample Pack" />
        <Field label="Client / Niche Type" value={cs.clientNicheType} onChange={(v) => update('clientNicheType', v)} placeholder={niche || 'e.g. Gaming creator'} />
        <Field label="Problem" value={cs.problem} onChange={(v) => update('problem', v)} placeholder="What challenge did the project address?" multiline />
        <Field label="Process" value={cs.process} onChange={(v) => update('process', v)} placeholder="How did you approach the work?" multiline />
        <Field label="Deliverables" value={cs.deliverables} onChange={(v) => update('deliverables', v)} placeholder="What did you deliver?" />
        <Field label="Result / Expected Outcome" value={cs.resultExpectedOutcome} onChange={(v) => update('resultExpectedOutcome', v)} placeholder="What was the outcome?" multiline />
        <Field label="Tools Used" value={cs.toolsUsed} onChange={(v) => update('toolsUsed', v)} placeholder="e.g. Premiere Pro, After Effects" />
        <Field label="CTA" value={cs.cta} onChange={(v) => update('cta', v)} placeholder="What should the reader do next?" />
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Case study saved</span>
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
          Continue to Sample Project Builder
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
