import { useState, useEffect, useCallback, useId, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, ArrowRight, RotateCcw, AlertTriangle, 
  CheckCircle2, Circle, ChevronDown, FileText, Check, Copy, Edit3
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { generateProofAsset, calculatePriorityFingerprint } from '../../data/module3/proof-assets';
import type { ProofAsset } from '../../types/module3';
import { composeStep3Content, buildPersonalizationContext } from '../../lib/module3/personalized-content';

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

export function Step3ProofAssetBuilder() {
  const ctx = usePriorityContext();
  const proofPriorities = useModule3Store((s) => s.proofPriorities);
  const proofAssets = useModule3Store((s) => s.proofAssets);
  const setProofAssets = useModule3Store((s) => s.setProofAssets);
  const updateProofAsset = useModule3Store((s) => s.updateProofAsset);
  const replaceProofAsset = useModule3Store((s) => s.replaceProofAsset);
  
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const nextStep = useModule3Store((s) => s.nextStep);
  const previousStep = useModule3Store((s) => s.previousStep);
  const completedSteps = useModule3Store((s) => s.completedSteps);

  const isCompleted = completedSteps.includes('proof_asset_builder');

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
      authorityPosition: ctx.authorityPosition,
      coreTrustPromise: ctx.coreTrustPromise,
      proofPriorities: undefined,
      proofAssets: undefined,
    });
    return composeStep3Content(pctx);
  }, [ctx]);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [staleAssetId, setStaleAssetId] = useState<string | null>(null);
  const [regenerateWarningId, setRegenerateWarningId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'failure'>('idle');

  useEffect(() => {
    if (proofPriorities.length === 3 && proofAssets.length !== 3) {
      const generated = proofPriorities.map((priority) => {
        const asset = generateProofAsset(priority, ctx);
        if (asset.assetType !== priority.recommendedFormat) {
          throw new Error(`Invariant Violated: asset.assetType (${asset.assetType}) does not match recommendedFormat (${priority.recommendedFormat})`);
        }
        return asset;
      });
      setProofAssets(generated);
    }
  }, [proofPriorities, proofAssets.length, ctx, setProofAssets]);

  useEffect(() => {
    if (proofAssets.length === 3 && proofPriorities.length === 3) {
      for (let i = 0; i < 3; i++) {
        const priority = proofPriorities[i];
        const asset = proofAssets.find(a => a.priorityId === priority.id);
        if (asset) {
          const currentFingerprint = calculatePriorityFingerprint(priority);
          if (currentFingerprint !== asset.sourcePriorityFingerprint || asset.assetType !== priority.recommendedFormat) {
            setStaleAssetId(asset.id);
            setActiveTab(i);
            return;
          }
        }
      }
      setStaleAssetId(null);
    }
  }, [proofPriorities, proofAssets]);

  if (proofAssets.length !== 3 || proofPriorities.length !== 3) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <p className="text-sm text-neutral-500">{personalized.loadingText}</p>
      </div>
    );
  }

  const activeAsset = proofAssets[activeTab];
  const activePriority = proofPriorities.find(p => p.id === activeAsset.priorityId);
  const allAccepted = proofAssets.every((a) => a.isAccepted);

  const handleFieldChange = (field: keyof ProofAsset, value: any) => {
    updateProofAsset(activeAsset.id, { [field]: value });
  };

  const handleArrayChange = (field: keyof ProofAsset, index: number, value: string) => {
    const arr = [...(activeAsset[field] as string[])];
    arr[index] = value;
    updateProofAsset(activeAsset.id, { [field]: arr });
  };

  const handleCopyChange = (field: keyof ProofAsset['portfolioCopy'], value: string) => {
    updateProofAsset(activeAsset.id, {
      portfolioCopy: { ...activeAsset.portfolioCopy, [field]: value }
    });
  };

  const handleRegenerateClick = () => {
    if (isRegenerating) return;
    if (activeAsset.isCustom) {
      setRegenerateWarningId(activeAsset.id);
    } else {
      doRegenerate(activeAsset.id);
    }
  };

  const doRegenerate = (id: string) => {
    if (isRegenerating) return;
    setIsRegenerating(true);
    try {
      const asset = proofAssets.find(a => a.id === id);
      if (!asset) return;
      const priority = proofPriorities.find(p => p.id === asset.priorityId);
      if (!priority) return;

      const regenerated = generateProofAsset(priority, ctx);
      if (regenerated.assetType !== priority.recommendedFormat) {
        throw new Error(`Invariant Violated: regenerated assetType (${regenerated.assetType}) does not match recommendedFormat (${priority.recommendedFormat})`);
      }

      replaceProofAsset(id, regenerated);
      setRegenerateWarningId(null);
      setStaleAssetId(null);
    } finally {
      setIsRegenerating(false);
    }
  };

  const confirmRegenerate = () => {
    if (regenerateWarningId) {
      doRegenerate(regenerateWarningId);
    }
  };

  const keepStaleAsset = () => {
    setStaleAssetId(null);
  };

  const handleConfirm = () => {
    if (!allAccepted) return;
    if (isCompleted) {
      nextStep();
      return;
    }
    confirmStep();
    nextStep();
  };

  const handleCopyPreview = useCallback(async () => {
    const text = [
      activeAsset.portfolioCopy.headline,
      activeAsset.portfolioCopy.description,
      activeAsset.portfolioCopy.proofStatement,
      activeAsset.portfolioCopy.cta,
    ].filter(Boolean).join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('success');
      setCopiedId(activeAsset.id);
      setTimeout(() => {
        setCopyStatus('idle');
        setCopiedId(null);
      }, 2000);
    } catch {
      setCopyStatus('failure');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  }, [activeAsset]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-left">
        <span className="inline-flex items-center rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 mb-3">
          Step 3 of 5
        </span>
        <h1 className="text-3xl font-bold text-[#0b1c30] tracking-tight">Proof Asset Builder</h1>
        <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
          {personalized.description}
        </p>
      </div>

      {/* TABS */}
      <div role="tablist" aria-label="Proof assets" className="flex flex-row gap-2 border-b border-neutral-200 pb-4 overflow-x-auto no-scrollbar">
        {proofAssets.map((asset, idx) => {
          const isActive = idx === activeTab;
          return (
            <button
              key={asset.id}
              role="tab"
              id={`asset-tab-${idx}`}
              aria-selected={isActive}
              aria-controls={`asset-panel-${idx}`}
              onClick={() => setActiveTab(idx)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap min-w-max outline-none",
                isActive 
                  ? "bg-[#0058be]/5 border-[#0058be] text-[#0058be] ring-1 ring-[#0058be]" 
                  : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700",
                "focus-visible:ring-2 focus-visible:ring-[#0058be]"
              )}
            >
              {asset.isAccepted ? (
                <CheckCircle2 size={14} className="text-[#0058be]" />
              ) : (
                <Circle size={14} className="text-neutral-300" />
              )}
              <span className="text-xs font-bold tracking-wide">Proof Asset {idx + 1}</span>
              {asset.isCustom && !asset.isAccepted && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-[8px] font-bold uppercase tracking-wider text-amber-700">
                  <Edit3 size={8} />
                  Edited
                </span>
              )}
              {asset.isAccepted && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[8px] font-bold uppercase tracking-wider text-emerald-700">
                  <Check size={8} />
                  Accepted
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Asset Header / Status Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm text-left">
        <div className="space-y-1 min-w-0">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Proof Asset {activeTab + 1} of 3
          </span>
          <h2 className="text-base font-bold text-[#0b1c30] flex flex-wrap items-center gap-1.5">
            <span>Credibility Gap:</span>
            <span className="font-semibold text-neutral-600 truncate">{activeAsset.credibilityGapProved}</span>
          </h2>
          {activePriority && (
            <p className="text-xs text-neutral-500">
              Recommended Format: <span className="font-bold text-[#0058be]">{activePriority.recommendedFormat.replace(/_/g, ' ')}</span>
            </p>
          )}
        </div>
        <button
          onClick={handleRegenerateClick}
          disabled={isRegenerating}
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0058be]",
            isRegenerating
              ? "border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed"
              : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 active:scale-[0.98]"
          )}
        >
          <RotateCcw size={13} className={cn("text-neutral-500", isRegenerating && "animate-spin")} />
          <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
        </button>
      </div>

      {/* SPLIT SCREEN LAYOUT */}
      <motion.div 
        key={activeAsset.id}
        role="tabpanel"
        id={`asset-panel-${activeTab}`}
        aria-labelledby={`asset-tab-${activeTab}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
        className="flex flex-col lg:flex-row gap-8 items-start"
      >
        {/* LEFT: EDITING AREA (45%) */}
        <div className="w-full lg:w-[45%] space-y-6 min-w-0">
          {/* Collapsible Sections with Progressive Disclosure */}
          <CollapsibleSection title="Proof Objective" description={personalized.sectionHelpers.proof_objective} defaultOpen={false}>
            <Field label="Target Audience" value={activeAsset.targetAudience} onChange={(v) => handleFieldChange('targetAudience', v)} />
            <Field label="Business Problem" value={activeAsset.businessProblem} onChange={(v) => handleFieldChange('businessProblem', v)} type="textarea" />
          </CollapsibleSection>

          <CollapsibleSection title="Project Brief" description={personalized.sectionHelpers.project_brief} defaultOpen={true}>
            <Field label="Title" value={activeAsset.title} onChange={(v) => handleFieldChange('title', v)} />
            <Field label="Scenario" value={activeAsset.scenario} onChange={(v) => handleFieldChange('scenario', v)} type="textarea" />
            <ArrayField label="Starting Materials" values={activeAsset.startingMaterial} onChange={(i, v) => handleArrayChange('startingMaterial', i, v)} />
            <ArrayField label="Deliverables" values={activeAsset.deliverables} onChange={(i, v) => handleArrayChange('deliverables', i, v)} />
          </CollapsibleSection>

          <CollapsibleSection title="Execution Plan" description={personalized.sectionHelpers.execution_plan} defaultOpen={false}>
            <ArrayField label="Execution Steps" values={activeAsset.executionSteps} onChange={(i, v) => handleArrayChange('executionSteps', i, v)} numbered />
          </CollapsibleSection>

          <CollapsibleSection title="Evidence" description={personalized.sectionHelpers.evidence} defaultOpen={false}>
            <ArrayField label="Evidence to Capture" values={activeAsset.evidenceToCapture} onChange={(i, v) => handleArrayChange('evidenceToCapture', i, v)} />
            <ArrayField label="Process to Document" values={activeAsset.processToDocument} onChange={(i, v) => handleArrayChange('processToDocument', i, v)} />
          </CollapsibleSection>

          <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden text-left">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-amber-700" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">What Not To Claim</span>
              </div>
              <ArrayField 
                label="" 
                values={activeAsset.whatNotToClaim} 
                onChange={(i, v) => handleArrayChange('whatNotToClaim', i, v)} 
                hideLabel 
              />
            </div>
          </div>

          <CollapsibleSection title="Presentation" description={personalized.sectionHelpers.presentation} defaultOpen={false}>
            <ArrayField label="Presentation Structure" values={activeAsset.presentationStructure} onChange={(i, v) => handleArrayChange('presentationStructure', i, v)} numbered />
          </CollapsibleSection>

          <CollapsibleSection title="Completion" description={personalized.sectionHelpers.completion} defaultOpen={false}>
            <ArrayField label="Completion Checklist" values={activeAsset.completionChecklist} onChange={(i, v) => handleArrayChange('completionChecklist', i, v)} />
          </CollapsibleSection>
        </div>

        {/* RIGHT: PRESENTATION PREVIEW (55% sticky) */}
        <div className="w-full lg:w-[55%] min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider text-left">Portfolio Preview</h2>
          
          <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
            <div className="h-32 bg-neutral-50 border-b border-neutral-200 relative flex items-center justify-center overflow-hidden">
              <FileText size={40} className="text-neutral-200" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/90 text-neutral-500 border border-neutral-200">
                  {activeAsset.assetType.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-5 text-left">
              <div className="space-y-1.5">
                <label htmlFor="preview-headline" className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Portfolio Headline</label>
                <textarea 
                  id="preview-headline"
                  value={activeAsset.portfolioCopy.headline}
                  onChange={(e) => handleCopyChange('headline', e.target.value)}
                  className="w-full bg-transparent border-b border-neutral-100 hover:border-neutral-200 focus:border-[#0058be]/50 outline-none text-base font-bold text-[#0b1c30] transition-colors resize-y min-h-[50px]"
                  placeholder={personalized.fieldPlaceholders.portfolio_headline}
                />
              </div>

              <div className="space-y-1.5 pt-3 border-t border-neutral-100">
                <label htmlFor="preview-description" className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Project Description</label>
                <textarea 
                  id="preview-description"
                  value={activeAsset.portfolioCopy.description}
                  onChange={(e) => handleCopyChange('description', e.target.value)}
                  className="w-full bg-transparent border-b border-neutral-100 hover:border-neutral-200 focus:border-[#0058be]/50 outline-none text-xs text-neutral-500 transition-colors resize-y min-h-[60px]"
                  placeholder={personalized.fieldPlaceholders.project_description}
                />
              </div>

              <div className="space-y-1.5 pt-3 border-t border-neutral-100">
                <label htmlFor="preview-proof" className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Proof Statement</label>
                <textarea 
                  id="preview-proof"
                  value={activeAsset.portfolioCopy.proofStatement}
                  onChange={(e) => handleCopyChange('proofStatement', e.target.value)}
                  className="w-full bg-transparent border-b border-neutral-100 hover:border-neutral-200 focus:border-[#0058be]/50 outline-none text-xs text-[#0b1c30] transition-colors resize-y min-h-[80px]"
                  placeholder={personalized.fieldPlaceholders.proof_statement}
                />
              </div>

              <div className="pt-2 space-y-1.5">
                <label htmlFor="preview-cta" className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">CTA</label>
                <input 
                  id="preview-cta"
                  value={activeAsset.portfolioCopy.cta}
                  onChange={(e) => handleCopyChange('cta', e.target.value)}
                  className="w-full bg-[#0058be]/5 border border-[#0058be]/20 hover:bg-[#0058be]/10 focus:border-[#0058be]/50 outline-none text-xs font-bold text-[#0058be] text-center py-2.5 rounded-lg transition-colors"
                  placeholder={personalized.fieldPlaceholders.cta}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Authoritative Action Area */}
      <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Status text & Back button */}
        <div className="flex items-center gap-4 text-left">
          <button
            onClick={previousStep}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all font-bold text-xs uppercase tracking-wider cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0058be]"
            aria-label="Go back to Step 2"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Back</span>
          </button>
          
          <div className="min-w-0" aria-live="polite">
            {allAccepted ? (
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 size={16} className="shrink-0" />
                <div>
                  <p className="text-xs font-bold">All 3 proof assets accepted</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{personalized.status.allAccepted}</p>
                </div>
              </div>
            ) : activeAsset.isAccepted ? (
              <div className="flex items-center gap-2 text-neutral-700">
                <CheckCircle2 size={16} className="text-[#0058be] shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold">Proof asset {activeTab + 1} accepted</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{personalized.status.oneAccepted}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-neutral-600">
                <Circle size={16} className="text-neutral-300 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold">Review and refine this proof asset</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{personalized.status.noneAccepted}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions (Copy & Primary Action) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleCopyPreview}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0058be]"
          >
            {copiedId === activeAsset.id ? (
              <Check size={14} className="text-[#0058be] stroke-[3]" aria-hidden="true" />
            ) : (
              <Copy size={14} aria-hidden="true" />
            )}
            <span>
              {copyStatus === 'success' && 'Copied brief'}
              {copyStatus === 'failure' && "Couldn't copy. Try again."}
              {copyStatus === 'idle' && 'Copy brief'}
            </span>
          </button>

          {!activeAsset.isAccepted ? (
            <button
              onClick={() => handleFieldChange('isAccepted', true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0058be] hover:bg-[#0047a0] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0058be] active:scale-[0.98]"
            >
              <span>Accept proof asset</span>
            </button>
          ) : !allAccepted ? (
            <button
              onClick={() => {
                const nextIndex = proofAssets.findIndex((a) => !a.isAccepted);
                if (nextIndex !== -1) {
                  setActiveTab(nextIndex);
                } else {
                  setActiveTab((activeTab + 1) % 3);
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0b1c30] hover:bg-[#152a45] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0b1c30] active:scale-[0.98]"
            >
              <span>Next proof asset</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0058be] hover:bg-[#0047a0] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0058be] active:scale-[0.98]"
            >
              <span>Continue to Profile & Portfolio</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* DIALOGS */}
      <AnimatePresence>
        {regenerateWarningId && (
          <Dialog
            title="Regenerate this proof asset?"
            message="This will replace the current generated brief and discard all manual edits for this asset."
            onCancel={() => setRegenerateWarningId(null)}
            onConfirm={confirmRegenerate}
            confirmLabel="Regenerate asset"
            loading={isRegenerating}
          />
        )}
        
        {staleAssetId && (
          <Dialog
            title="Proof Strategy Changed"
            message="The linked priority or format for this project was changed in Step 2. Do you want to refresh this brief to match the new strategy?"
            onCancel={keepStaleAsset}
            onConfirm={() => { if (!isRegenerating) doRegenerate(staleAssetId); }}
            confirmLabel="Refresh Asset"
            cancelLabel="Keep Current"
            warningIcon
            loading={isRegenerating}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' }) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400 block">{label}</label>
      {type === 'text' ? (
        <input 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be]/50 transition-colors focus:ring-2 focus:ring-[#0058be]/20"
        />
      ) : (
        <textarea 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be]/50 transition-colors resize-y min-h-[70px] focus:ring-2 focus:ring-[#0058be]/20"
        />
      )}
    </div>
  );
}

function ArrayField({ 
  label, 
  values, 
  onChange, 
  hideLabel = false, 
  numbered = false 
}: { 
  label: string; 
  values: string[]; 
  onChange: (idx: number, v: string) => void; 
  hideLabel?: boolean; 
  numbered?: boolean; 
}) {
  return (
    <div className="space-y-2 text-left">
      {!hideLabel && (
        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400 block mb-1">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-start gap-2">
            {numbered ? (
              <span className="shrink-0 mt-1.5 w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[9px] font-bold text-neutral-500">
                {i + 1}
              </span>
            ) : (
              <span className="shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-neutral-300" aria-hidden="true" />
            )}
            <textarea
              value={v}
              onChange={(e) => onChange(i, e.target.value)}
              rows={1}
              className="flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-2 outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 focus:border-[#0058be]/50 transition-colors resize-y min-h-[36px] focus:ring-2 focus:ring-[#0058be]/20"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Dialog({
  title, message, onCancel, onConfirm, confirmLabel = 'Confirm', cancelLabel = 'Cancel', warningIcon = false, loading = false
}: {
  title: string; message: string; onCancel: () => void; onConfirm: () => void; confirmLabel?: string; cancelLabel?: string; warningIcon?: boolean; loading?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={loading ? undefined : onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-start gap-3">
          {warningIcon ? (
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 border border-amber-200 shrink-0">
              <AlertTriangle size={14} className="text-amber-700" />
            </span>
          ) : (
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0058be]/10 border border-[#0058be]/20 shrink-0">
              <RotateCcw size={14} className="text-[#0058be]" />
            </span>
          )}
          <div className="space-y-1 text-left">
            <p className="text-sm font-bold text-[#0b1c30]">{title}</p>
            <p className="text-[11px] text-neutral-500 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-all font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#0058be]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl transition-all font-bold text-xs uppercase tracking-wider',
              loading
                ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
                : 'bg-[#0058be] text-white border-transparent hover:opacity-90 cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0058be]'
            )}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CollapsibleSection({ 
  title, 
  description, 
  defaultOpen = true, 
  children 
}: { 
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionId = useId();

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={sectionId}
        className="flex items-center justify-between w-full p-4 text-left cursor-pointer group hover:bg-neutral-50 transition-colors focus-visible:ring-2 focus-visible:ring-[#0058be] outline-none"
      >
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{title}</span>
          {description && <p className="text-[9px] text-neutral-500 mt-0.5">{description}</p>}
        </div>
        <ChevronDown size={14} className={cn("text-neutral-400 transition-transform shrink-0", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            id={sectionId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-neutral-100 pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
