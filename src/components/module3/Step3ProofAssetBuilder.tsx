import { useState, useEffect, useCallback, useId } from 'react';
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

  return {
    serviceId, marketId, nicheId, positioning, offerType, 
    deliverables, uniqueMechanism, valueAmplifier, authorityPosition, coreTrustPromise,
  };
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

  const [activeTab, setActiveTab] = useState<number>(0);
  const [staleAssetId, setStaleAssetId] = useState<string | null>(null);
  const [regenerateWarningId, setRegenerateWarningId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

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
        <p className="text-sm text-neutral-500">Generating Proof Assets...</p>
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
      setCopiedId(activeAsset.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  }, [activeAsset]);

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 mb-3">
          Step 3 of 5
        </span>
        <h2 className="text-3xl font-bold text-[#0b1c30] tracking-tight">Proof Asset Builder</h2>
        <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
          Build and refine 3 execution-ready proof assets for your portfolio.
        </p>
      </div>

      {/* TABS */}
      <div role="tablist" aria-label="Proof assets" className="flex flex-col sm:flex-row gap-2 border-b border-neutral-200 pb-4 overflow-x-auto no-scrollbar">
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
                "flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap min-w-max",
                isActive 
                  ? "bg-[#0058be]/5 border-[#0058be]/30 text-[#0058be]" 
                  : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
              )}
            >
              {asset.isAccepted ? (
                <CheckCircle2 size={14} className={isActive ? "text-[#0058be]" : "text-emerald-600"} />
              ) : (
                <Circle size={14} className={isActive ? "text-[#0058be]" : "text-neutral-400"} />
              )}
              <span className="text-xs font-semibold tracking-wide">Proof Asset {idx + 1}</span>
              {asset.isCustom && !asset.isAccepted && (
                <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-amber-50 border border-amber-200 text-[7px] font-bold uppercase tracking-wider text-amber-700">
                  <Edit3 size={7} />
                  Edited
                </span>
              )}
              {asset.isAccepted && (
                <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[7px] font-bold uppercase tracking-wider text-emerald-700">
                  <Check size={7} />
                  Accepted
                </span>
              )}
            </button>
          );
        })}
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
        className="flex flex-col lg:flex-row gap-6"
      >
        {/* LEFT: EDITING AREA */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Proof Asset {activeTab + 1} of 3
            </span>
            <button
              onClick={handleRegenerateClick}
              disabled={isRegenerating}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-[0.1em] transition-all cursor-pointer",
                isRegenerating
                  ? "border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed"
                  : "border-neutral-200 bg-white text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
              )}
            >
              <RotateCcw size={10} className={cn(isRegenerating && "animate-spin")} />
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>

          {/* Read-only Priority Context */}
          <div className="p-3 rounded-xl bg-[#f8f9ff] border border-neutral-200 flex items-start gap-3">
            <FileText size={14} className="text-neutral-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Credibility Gap</p>
              <p className="text-xs font-semibold text-[#0b1c30] mt-0.5 leading-relaxed">{activeAsset.credibilityGapProved}</p>
              {activePriority && (
                <p className="text-[10px] text-neutral-500 mt-1">
                  Format: <span className="font-semibold text-neutral-600">{activePriority.recommendedFormat.replace(/_/g, ' ')}</span>
                </p>
              )}
            </div>
          </div>

          {/* Collapsible Sections */}
          <CollapsibleSection title="Proof Objective" description="Target audience and business problem" defaultOpen>
            <Field label="Target Audience" value={activeAsset.targetAudience} onChange={(v) => handleFieldChange('targetAudience', v)} />
            <Field label="Business Problem" value={activeAsset.businessProblem} onChange={(v) => handleFieldChange('businessProblem', v)} type="textarea" />
          </CollapsibleSection>

          <CollapsibleSection title="Project Brief" description="Scenario, materials, and deliverables" defaultOpen>
            <Field label="Title" value={activeAsset.title} onChange={(v) => handleFieldChange('title', v)} />
            <Field label="Scenario" value={activeAsset.scenario} onChange={(v) => handleFieldChange('scenario', v)} type="textarea" />
            <ArrayField label="Starting Materials" values={activeAsset.startingMaterial} onChange={(i, v) => handleArrayChange('startingMaterial', i, v)} />
            <ArrayField label="Deliverables" values={activeAsset.deliverables} onChange={(i, v) => handleArrayChange('deliverables', i, v)} />
          </CollapsibleSection>

          <CollapsibleSection title="Execution Plan" description="Ordered execution steps" defaultOpen>
            <ArrayField label="Execution Steps" values={activeAsset.executionSteps} onChange={(i, v) => handleArrayChange('executionSteps', i, v)} numbered />
          </CollapsibleSection>

          <CollapsibleSection title="Evidence" description="What to capture and document" defaultOpen={false}>
            <ArrayField label="Evidence to Capture" values={activeAsset.evidenceToCapture} onChange={(i, v) => handleArrayChange('evidenceToCapture', i, v)} />
            <ArrayField label="Process to Document" values={activeAsset.processToDocument} onChange={(i, v) => handleArrayChange('processToDocument', i, v)} />
          </CollapsibleSection>

          <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={12} className="text-amber-700" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700">What Not To Claim</span>
              </div>
              <ArrayField 
                label="" 
                values={activeAsset.whatNotToClaim} 
                onChange={(i, v) => handleArrayChange('whatNotToClaim', i, v)} 
                hideLabel 
              />
            </div>
          </div>

          <CollapsibleSection title="Presentation" description="Structure for presenting this project" defaultOpen>
            <ArrayField label="Presentation Structure" values={activeAsset.presentationStructure} onChange={(i, v) => handleArrayChange('presentationStructure', i, v)} numbered />
          </CollapsibleSection>

          <CollapsibleSection title="Completion" description="Project completion checklist" defaultOpen={false}>
            <ArrayField label="Completion Checklist" values={activeAsset.completionChecklist} onChange={(i, v) => handleArrayChange('completionChecklist', i, v)} />
          </CollapsibleSection>
        </div>

        {/* RIGHT: PRESENTATION PREVIEW */}
        <div className="w-full lg:w-[400px] shrink-0 space-y-4">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Portfolio Preview</span>
          
          <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
            <div className="h-32 bg-neutral-50 border-b border-neutral-200 relative flex items-center justify-center overflow-hidden">
              <FileText size={40} className="text-neutral-200" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/80 text-neutral-500 border border-neutral-200">
                  {activeAsset.assetType.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="preview-headline" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Portfolio Headline</label>
                <input 
                  id="preview-headline"
                  value={activeAsset.portfolioCopy.headline}
                  onChange={(e) => handleCopyChange('headline', e.target.value)}
                  className="w-full bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-[#0058be]/50 outline-none text-base font-bold text-[#0b1c30] transition-colors"
                  placeholder="Your portfolio project headline..."
                />
                <label htmlFor="preview-description" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Project Description</label>
                <textarea 
                  id="preview-description"
                  value={activeAsset.portfolioCopy.description}
                  onChange={(e) => handleCopyChange('description', e.target.value)}
                  className="w-full bg-transparent border border-transparent hover:border-neutral-200 focus:border-[#0058be]/50 outline-none text-[11px] text-neutral-500 transition-colors resize-none overflow-hidden"
                  rows={2}
                  placeholder="Brief project description..."
                />
              </div>

              <div className="space-y-1.5 pt-3 border-t border-neutral-100">
                <label htmlFor="preview-proof" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Proof Statement</label>
                <textarea 
                  id="preview-proof"
                  value={activeAsset.portfolioCopy.proofStatement}
                  onChange={(e) => handleCopyChange('proofStatement', e.target.value)}
                  className="w-full bg-transparent border border-transparent hover:border-neutral-200 focus:border-[#0058be]/50 outline-none text-[11px] text-[#0b1c30] transition-colors resize-none"
                  rows={3}
                  placeholder="Your proof statement..."
                />
              </div>

              <div className="pt-2 space-y-1.5">
                <label htmlFor="preview-cta" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">CTA</label>
                <input 
                  id="preview-cta"
                  value={activeAsset.portfolioCopy.cta}
                  onChange={(e) => handleCopyChange('cta', e.target.value)}
                  className="w-full bg-[#0058be]/5 border border-[#0058be]/20 hover:bg-[#0058be]/10 focus:border-[#0058be]/50 outline-none text-xs font-bold text-[#0058be] text-center py-2.5 rounded-lg transition-colors"
                  placeholder="Call to Action..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 bg-white">
            <div>
              <p className="text-xs font-bold text-[#0b1c30]">Finalise Brief</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">Mark as accepted to proceed.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPreview}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 text-[10px] font-bold text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer"
              >
                {copiedId === activeAsset.id ? (
                  <><Check size={12} className="text-emerald-600" />Copied</>
                ) : (
                  <><Copy size={12} />Copy</>
                )}
              </button>
              <button
                onClick={() => handleFieldChange('isAccepted', !activeAsset.isAccepted)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                  activeAsset.isAccepted 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                )}
              >
                {activeAsset.isAccepted ? (
                  <><CheckCircle2 size={14} />Accepted</>
                ) : (
                  'Accept Brief'
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* NAVIGATION BUTTONS */}
      <div className="flex items-center justify-between pt-6 mt-4 border-t border-neutral-200">
        <button
          onClick={previousStep}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <button
          onClick={handleConfirm}
          disabled={!allAccepted}
          className={cn(
            'inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border',
            allAccepted
              ? 'bg-[#0058be] text-white border-transparent hover:opacity-90 shadow-sm'
              : 'bg-white border-neutral-200 text-neutral-400 cursor-not-allowed',
          )}
        >
          {isCompleted ? 'Continue' : 'Accept All & Continue'}
          <ArrowRight size={14} />
        </button>
      </div>

      {/* DIALOGS */}
      <AnimatePresence>
        {regenerateWarningId && (
          <Dialog
            title="Regenerate Edited Asset?"
            message="Regenerating will replace your manual edits for this asset. Are you sure?"
            onCancel={() => setRegenerateWarningId(null)}
            onConfirm={confirmRegenerate}
            confirmLabel="Regenerate"
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
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400">{label}</label>
      {type === 'text' ? (
        <input 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be]/50 transition-colors"
        />
      ) : (
        <textarea 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be]/50 transition-colors resize-y min-h-[60px]"
        />
      )}
    </div>
  );
}

function ArrayField({ label, values, onChange, hideLabel = false, numbered = false }: { label: string; values: string[]; onChange: (idx: number, v: string) => void; hideLabel?: boolean; numbered?: boolean }) {
  return (
    <div className="space-y-1.5">
      {!hideLabel && <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400">{label}</label>}
      <div className="space-y-1.5">
        {values.map((v, i) => (
          <div key={i} className="flex items-start gap-2">
            {numbered ? (
              <span className="shrink-0 mt-2 w-5 h-5 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[8px] font-bold text-neutral-500">
                {i + 1}
              </span>
            ) : (
              <span className="shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-neutral-300" />
            )}
            <input 
              value={v}
              onChange={(e) => onChange(i, e.target.value)}
              className="flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-2 outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 focus:border-[#0058be]/50 transition-colors"
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
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#0b1c30]">{title}</p>
            <p className="text-[11px] text-neutral-500 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-all font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                : 'bg-[#0058be] text-white border-transparent hover:opacity-90 cursor-pointer shadow-sm'
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
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={sectionId}
        className="flex items-center justify-between w-full p-4 text-left cursor-pointer group hover:bg-neutral-50 transition-colors"
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
