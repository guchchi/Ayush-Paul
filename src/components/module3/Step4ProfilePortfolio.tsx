import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, ArrowRight, RotateCcw, AlertTriangle,
  CheckCircle2, Edit3, ChevronRight, FileText, Plus, X, User, Briefcase, Award, Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { generateProfileCopy, generatePortfolioCopy } from '../../data/module3/profile-copy';
import type { ProfileCopy, PortfolioCopy, PortfolioSection } from '../../types/module3';
import { composeStep4Content, buildPersonalizationContext } from '../../lib/module3/personalized-content';
import { StepHeader } from '../workspace/StepHeader';
import { StepActionArea } from '../workspace/StepActionArea';
import { ModuleButton } from '../workspace/ModuleButton';

function usePriorityContext() {
  const serviceId = useModule3Store((s) => s.mod1ServiceId);
  const marketId = useModule3Store((s) => s.mod1MarketId);
  const nicheId = useModule3Store((s) => s.mod1NicheId);
  const positioning = useModule3Store((s) => s.mod1Positioning);
  const offerType = useModule3Store((s) => s.mod2OfferType);
  const deliverables = useModule3Store((s) => s.mod2Deliverables);
  const uniqueMechanism = useModule3Store((s) => s.mod2UniqueMechanism);
  const valueAmplifier = useModule3Store((s) => s.mod2ValueAmplifier);
  const authorityPosition = useModule3Store((s) => s.authorityPosition);
  const coreTrustPromise = useModule3Store((s) => s.coreTrustPromise);

  const deliverablesKey = deliverables.join(',');

  return useMemo(() => ({
    serviceId, marketId, nicheId, positioning, offerType,
    deliverables, uniqueMechanism, valueAmplifier, authorityPosition, coreTrustPromise,
  }), [
    serviceId, marketId, nicheId, positioning, offerType,
    deliverablesKey, uniqueMechanism, valueAmplifier, authorityPosition, coreTrustPromise,
  ]);
}

function Field({ label, value, onChange, rows, helperText }: { label: string; value: string; onChange: (v: string) => void; rows?: number; helperText?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</label>
      {helperText && <p className="text-[9px] text-neutral-400 leading-relaxed">{helperText}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows || 3}
        className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-[#0b1c30] placeholder:text-neutral-400 outline-none focus:border-[#0058be]/50 transition-all duration-200 resize-y min-h-[60px]"
      />
    </div>
  );
}

function ListField({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  const handleItemChange = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const addItem = () => onChange([...items, '']);

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</label>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <textarea
              value={item}
              onChange={(e) => handleItemChange(i, e.target.value)}
              rows={2}
              className="flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-[#0b1c30] placeholder:text-neutral-400 outline-none focus:border-[#0058be]/50 transition-all duration-200 resize-y min-h-[40px]"
            />
            <button onClick={() => removeItem(i)} className="w-5 h-5 rounded flex items-center justify-center hover:bg-neutral-100 cursor-pointer shrink-0 mt-2">
              <X size={10} className="text-neutral-400" />
            </button>
          </div>
        ))}
        <button onClick={addItem} className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer">
          <Plus size={10} />
          Add item
        </button>
      </div>
    </div>
  );
}

function SectionCard({ section, index, onChange, headingPlaceholder }: { section: PortfolioSection; index: number; onChange: (idx: number, s: PortfolioSection) => void; headingPlaceholder?: string }) {
  const update = (partial: Partial<PortfolioSection>) => onChange(index, { ...section, ...partial });

  const typeColors: Record<string, string> = {
    hero: 'bg-blue-50 text-blue-700 border-blue-200',
    about: 'bg-purple-50 text-purple-700 border-purple-200',
    selected_work: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    process: 'bg-amber-50 text-amber-700 border-amber-200',
    testimonials: 'bg-pink-50 text-pink-700 border-pink-200',
    cta: 'bg-[#0058be]/5 text-[#0058be] border-[#0058be]/20',
  };

  return (
    <div className={cn(
      'rounded-xl border bg-white overflow-hidden',
      section.type === 'hero' && 'border-[#0058be]/20',
      section.type !== 'hero' && 'border-neutral-200',
    )}>
      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
        <span className={cn(
          'text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border',
          typeColors[section.type] || 'bg-neutral-100 text-neutral-500 border-neutral-200',
        )}>
          {section.type.replace(/_/g, ' ')}
        </span>
        <input
          value={section.heading}
          onChange={(e) => update({ heading: e.target.value })}
          className="flex-1 bg-transparent text-sm font-semibold text-[#0b1c30] border-b border-transparent focus:border-[#0058be]/30 outline-none transition-colors"
          placeholder={headingPlaceholder || 'Section heading...'}
        />
      </div>
      <textarea
        value={section.body}
        onChange={(e) => update({ body: e.target.value })}
        rows={3}
        className="w-full bg-white px-4 py-2 text-xs text-neutral-600 placeholder:text-neutral-400 outline-none transition-all duration-200 resize-y min-h-[60px]"
      />
      {section.bullets && section.bullets.length > 0 && (
        <div className="px-4 pb-3 space-y-1">
          <label className="text-[8px] font-bold uppercase tracking-[0.1em] text-neutral-400">Key points</label>
          {section.bullets.map((b, bi) => (
            <input
              key={bi}
              value={b}
              onChange={(e) => {
                const next = [...(section.bullets || [])];
                next[bi] = e.target.value;
                update({ bullets: next });
              }}
              className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-[11px] text-[#0b1c30] outline-none focus:border-[#0058be]/30 transition-colors"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Step4ProfilePortfolio() {
  const ctx = usePriorityContext();

  const proofAssets = useModule3Store((s) => s.proofAssets);
  const proofPriorities = useModule3Store((s) => s.proofPriorities);
  const profileCopy = useModule3Store((s) => s.profileCopy);
  const portfolioCopy = useModule3Store((s) => s.portfolioCopy);
  const isProfileCopyCustom = useModule3Store((s) => s.isProfileCopyCustom);
  const isPortfolioCopyCustom = useModule3Store((s) => s.isPortfolioCopyCustom);
  const authorityPosition = useModule3Store((s) => s.authorityPosition);
  const coreTrustPromise = useModule3Store((s) => s.coreTrustPromise);

  const replaceGeneratedProfileCopy = useModule3Store((s) => s.replaceGeneratedProfileCopy);
  const replaceGeneratedPortfolioCopy = useModule3Store((s) => s.replaceGeneratedPortfolioCopy);
  const updateProfileCopy = useModule3Store((s) => s.updateProfileCopy);
  const updatePortfolioCopy = useModule3Store((s) => s.updatePortfolioCopy);
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const nextStep = useModule3Store((s) => s.nextStep);
  const previousStep = useModule3Store((s) => s.previousStep);
  const completedSteps = useModule3Store((s) => s.completedSteps);
  const jumpToStep = useModule3Store((s) => s.jumpToStep);

  const isCompleted = completedSteps.includes('profile_portfolio');

  const personalized = useMemo(() => {
    const pctx = buildPersonalizationContext({
      serviceId: ctx.serviceId,
      marketId: ctx.marketId,
      nicheId: ctx.nicheId,
      positioning: ctx.positioning,
      offerType: ctx.offerType,
      deliverables: ctx.deliverables,
      uniqueMechanism: ctx.uniqueMechanism,
      valueAmplifier: ctx.valueAmplifier,
      authorityPosition: authorityPosition,
      coreTrustPromise: coreTrustPromise || '',
      proofPriorities: proofPriorities.map((p) => ({
        id: p.id,
        gapTitle: p.gapTitle,
        gapDescription: p.gapDescription,
        recommendedFormat: p.recommendedFormat,
      })),
      proofAssets: proofAssets.map((a) => ({
        id: a.id,
        title: a.title,
        assetType: a.assetType,
        isAccepted: a.isAccepted,
      })),
      professionalHeadline: profileCopy.professionalHeadline,
      shortBio: profileCopy.shortBio,
      longBio: profileCopy.longBio,
      offerStatement: profileCopy.offerStatement,
      credibilityBullets: profileCopy.credibilityBullets,
      proofReferenceLine: profileCopy.proofReferenceLine,
      ctaLine: profileCopy.ctaLine,
      portfolioCta: portfolioCopy.portfolioCta,
      portfolioSections: portfolioCopy.sections,
    });
    return composeStep4Content(pctx);
  }, [ctx, authorityPosition, coreTrustPromise, proofPriorities, proofAssets, profileCopy, portfolioCopy]);

  const [generated, setGenerated] = useState(false);
  const [showRegenWarning, setShowRegenWarning] = useState(false);

  const allAccepted = proofAssets.length === 3 && proofAssets.every((a) => a.isAccepted);

  useEffect(() => {
    if (!allAccepted) return;
    if (!ctx.authorityPosition) return;
    if (generated) return;
    if (profileCopy.professionalHeadline) {
      setGenerated(true);
      return;
    }

    const newProfile = generateProfileCopy(ctx, ctx.authorityPosition, ctx.coreTrustPromise || coreTrustPromise, proofPriorities, proofAssets);
    const newPortfolio = generatePortfolioCopy(ctx, ctx.authorityPosition, ctx.coreTrustPromise || coreTrustPromise, proofAssets, newProfile);

    replaceGeneratedProfileCopy(newProfile);
    replaceGeneratedPortfolioCopy(newPortfolio);
    setGenerated(true);
  }, [allAccepted, ctx, generated]);

  const handleRegenerate = () => {
    if (isProfileCopyCustom || isPortfolioCopyCustom) {
      setShowRegenWarning(true);
      return;
    }
    doRegenerate();
  };

  const doRegenerate = () => {
    const newProfile = generateProfileCopy(ctx, ctx.authorityPosition!, ctx.coreTrustPromise || coreTrustPromise, proofPriorities, proofAssets);
    const newPortfolio = generatePortfolioCopy(ctx, ctx.authorityPosition!, ctx.coreTrustPromise || coreTrustPromise, proofAssets, newProfile);
    replaceGeneratedProfileCopy(newProfile);
    replaceGeneratedPortfolioCopy(newPortfolio);
    setShowRegenWarning(false);
  };

  const handleProfileField = (field: keyof ProfileCopy, value: string | string[]) => {
    updateProfileCopy({ [field]: value } as any);
  };

  const handlePortfolioSection = (index: number, section: PortfolioSection) => {
    const next = { ...portfolioCopy, sections: portfolioCopy.sections.map((s, i) => i === index ? section : s) };
    updatePortfolioCopy(next);
  };

  const handlePortfolioCta = (value: string) => {
    updatePortfolioCopy({ portfolioCta: value });
  };

  const handleConfirm = () => {
    confirmStep();
    nextStep();
  };

  if (!allAccepted) {
    return (
      <div className="space-y-6">
        <StepHeader
          step={{ current: 4, total: 5 }}
          title="Profile & Portfolio Authority"
          description="Finalize your platform-agnostic profile and portfolio copy."
        />
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center space-y-4">
          <AlertTriangle size={24} className="mx-auto text-amber-700" />
          <p className="text-sm text-neutral-600">{personalized.emptyStateGuidance}</p>
          <ModuleButton variant="primary" onClick={() => jumpToStep('proof_asset_builder')}>
            Go to Step 3
          </ModuleButton>
        </div>
      </div>
    );
  }

  if (!profileCopy.professionalHeadline) {
    return (
      <div className="space-y-6">
        <StepHeader
          step={{ current: 4, total: 5 }}
          title="Profile & Portfolio Authority"
          description={personalized.loadingText}
        />
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-[#0058be]/20 border-t-[#0058be] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <StepHeader
            step={{ current: 4, total: 5 }}
            title="Profile & Portfolio Authority"
            description={personalized.description}
          />
        </div>
        <ModuleButton
          variant="secondary"
          onClick={handleRegenerate}
          className="shrink-0 mt-2"
        >
          <RotateCcw size={11} />
          Regenerate Copy
        </ModuleButton>
      </div>

      <AnimatePresence>
        {showRegenWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3 overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Regenerating will overwrite your manual edits.</p>
                <p className="text-xs text-neutral-500 mt-1">Any custom changes to your profile or portfolio copy will be replaced. This cannot be undone.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ModuleButton variant="primary" onClick={doRegenerate} className="!bg-amber-600 hover:!bg-amber-500">
                Confirm Regenerate
              </ModuleButton>
              <ModuleButton variant="secondary" onClick={() => setShowRegenWarning(false)}>
                Cancel
              </ModuleButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: PROFILE COPY */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-1 border-b border-neutral-100">
            <User size={12} className="text-[#0058be]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0058be]">Profile Copy</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-neutral-400">
              <User size={10} />
              Identity
            </div>
            <Field label="Professional Headline" value={profileCopy.professionalHeadline} onChange={(v) => handleProfileField('professionalHeadline', v)} helperText={personalized.fieldHelpers.professional_headline} />
            <Field label="Short Bio" value={profileCopy.shortBio} onChange={(v) => handleProfileField('shortBio', v)} rows={4} helperText={personalized.fieldHelpers.short_bio} />
            <Field label="Long Bio" value={profileCopy.longBio} onChange={(v) => handleProfileField('longBio', v)} rows={6} helperText={personalized.fieldHelpers.long_bio} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-neutral-400">
              <Briefcase size={10} />
              Offer
            </div>
            <Field label="Offer Statement" value={profileCopy.offerStatement} onChange={(v) => handleProfileField('offerStatement', v)} rows={3} helperText={personalized.fieldHelpers.offer_statement} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-neutral-400">
              <Award size={10} />
              Credibility
            </div>
            <ListField label="Credibility Bullets" items={profileCopy.credibilityBullets} onChange={(v) => handleProfileField('credibilityBullets', v)} />
            <Field label="Proof Reference Line" value={profileCopy.proofReferenceLine} onChange={(v) => handleProfileField('proofReferenceLine', v)} helperText={personalized.fieldHelpers.proof_reference_line} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-neutral-400">
              <Zap size={10} />
              Action
            </div>
            <Field label="CTA Line" value={profileCopy.ctaLine} onChange={(v) => handleProfileField('ctaLine', v)} helperText={personalized.fieldHelpers.cta_line} />
          </div>
        </div>

        {/* RIGHT: PORTFOLIO COPY */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-1 border-b border-neutral-100">
            <FileText size={12} className="text-[#0058be]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0058be]">Portfolio Copy</span>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Portfolio CTA</label>
            <input
              value={portfolioCopy.portfolioCta}
              onChange={(e) => handlePortfolioCta(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-[#0b1c30] outline-none focus:border-[#0058be]/50 transition-all"
            />
          </div>

          <div className="space-y-3">
            {portfolioCopy.sections.map((section, i) => (
              <SectionCard key={i} section={section} index={i} onChange={handlePortfolioSection} headingPlaceholder={personalized.sectionHeadingPlaceholder} />
            ))}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Reference Context</p>
            <div className="space-y-1">
              {ctx.serviceId && <p className="text-[10px] text-neutral-500">Service: <span className="text-[#0b1c30]/60">{ctx.serviceId.replace(/_/g, ' ')}</span></p>}
              {ctx.marketId && <p className="text-[10px] text-neutral-500">Market: <span className="text-[#0b1c30]/60">{ctx.marketId.replace(/_/g, ' ')}</span></p>}
              {ctx.uniqueMechanism && <p className="text-[10px] text-neutral-500">Mechanism: <span className="text-[#0b1c30]/60">{ctx.uniqueMechanism}</span></p>}
              {proofAssets.filter((a) => a.isAccepted).length > 0 && (
                <div>
                  <p className="text-[10px] text-neutral-500 mt-2">Accepted Proof Assets:</p>
                  {proofAssets.filter((a) => a.isAccepted).map((a) => (
                    <p key={a.id} className="text-[10px] text-[#0b1c30]/40 pl-2">— {a.title}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <StepActionArea>
        <ModuleButton variant="secondary" onClick={previousStep}>
          <ArrowLeft size={11} />
          Back
        </ModuleButton>
        <ModuleButton variant="primary" onClick={handleConfirm}>
          {isCompleted ? 'Continue' : 'Finalize Authority Assets'}
          <ArrowRight size={11} />
        </ModuleButton>
      </StepActionArea>
    </div>
  );
}
