import { motion } from 'motion/react';
import { Check, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import { cn } from '../../lib/utils';
import { getServiceCategory, generatePortfolioCopy } from '../../lib/blueprint-content';

export function PortfolioCopyGeneratorStep() {
  const copy = usePortfolioSystemStore((s) => s.portfolioCopy);
  const setCopy = usePortfolioSystemStore((s) => s.setPortfolioCopy);
  const confirmStep = usePortfolioSystemStore((s) => s.confirmStep);
  const nextStep = usePortfolioSystemStore((s) => s.nextStep);
  const isCompleted = usePortfolioSystemStore((s) => s.completedSteps).includes('portfolio_copy_generator');
  const service = usePortfolioSystemStore((s) => s.phase3Service);
  const niche = usePortfolioSystemStore((s) => s.phase3Niche) ?? '';
  const serviceLabel = usePortfolioSystemStore((s) => s.phase3ServiceLabel) ?? '';
  const profile = usePortfolioSystemStore((s) => s.phase3AuthorityProfile);
  const uniqueMechanism = usePortfolioSystemStore((s) => s.phase3UniqueMechanism) ?? '';

  const isValid = copy.headline.trim().length > 0;

  const update = (key: keyof typeof copy, value: string) => {
    setCopy({ ...copy, [key]: value });
  };

  const generate = () => {
    const cat = getServiceCategory(service);
    const t = generatePortfolioCopy(cat, niche, service || undefined);

    setCopy({
      headline: profile?.oneLinePositioning || t.headline,
      shortIntro: profile?.shortBio || t.shortIntro,
      caseStudyIntro: t.caseStudyIntro,
      processSection: t.processSection,
      cta: t.cta,
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
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 6 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Portfolio Copy Generator</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Generate copy for your portfolio sections. Each piece can be edited after generation.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <FileText size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Portfolio Copy</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Use your authority profile and service context to generate copy that sounds like you.
          </p>
        </div>
      </div>

      {!copy.headline && (
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Portfolio Copy
        </button>
      )}

      <div className="space-y-4">
        <Field label="Portfolio Headline" value={copy.headline} onChange={(v) => update('headline', v)} placeholder="Your main value proposition" />
        <Field label="Short Intro" value={copy.shortIntro} onChange={(v) => update('shortIntro', v)} placeholder="2-3 sentences about who you help" multiline />
        <Field label="Case Study Intro" value={copy.caseStudyIntro} onChange={(v) => update('caseStudyIntro', v)} placeholder="Intro for your case study section" multiline />
        <Field label="Process Section" value={copy.processSection} onChange={(v) => update('processSection', v)} placeholder="Explain your process step by step" multiline />
        <Field label="CTA" value={copy.cta} onChange={(v) => update('cta', v)} placeholder="What should visitors do next?" />
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Portfolio copy saved</span>
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
          Continue to Portfolio Checklist
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
