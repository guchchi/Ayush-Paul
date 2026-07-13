import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, ArrowRight, RotateCcw, AlertTriangle, 
  CheckCircle2, Circle, Edit3, X, ChevronRight, FileText
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

  // Initialize assets if they don't exist or there aren't exactly 3
  useEffect(() => {
    if (proofPriorities.length === 3 && proofAssets.length !== 3) {
      const generated = proofPriorities.map((priority) => generateProofAsset(priority, ctx));
      setProofAssets(generated);
    }
  }, [proofPriorities, proofAssets.length, ctx, setProofAssets]);

  // Check for stale linked priorities
  useEffect(() => {
    if (proofAssets.length === 3 && proofPriorities.length === 3) {
      for (let i = 0; i < 3; i++) {
        const priority = proofPriorities[i];
        const asset = proofAssets.find(a => a.priorityId === priority.id);
        if (asset) {
          const currentFingerprint = calculatePriorityFingerprint(priority);
          if (currentFingerprint !== asset.sourcePriorityFingerprint) {
            setStaleAssetId(asset.id);
            setActiveTab(i); // Jump to the stale tab
            return; // Only show one dialog at a time
          }
        }
      }
      setStaleAssetId(null);
    }
  }, [proofPriorities, proofAssets]);

  if (proofAssets.length !== 3 || proofPriorities.length !== 3) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <p className="text-sm text-zinc-500">Generating Proof Assets...</p>
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
    if (activeAsset.isCustom) {
      setRegenerateWarningId(activeAsset.id);
    } else {
      doRegenerate(activeAsset.id);
    }
  };

  const doRegenerate = (id: string) => {
    const asset = proofAssets.find(a => a.id === id);
    if (!asset) return;
    const priority = proofPriorities.find(p => p.id === asset.priorityId);
    if (!priority) return;

    const regenerated = generateProofAsset(priority, ctx);
    replaceProofAsset(id, regenerated);
    setRegenerateWarningId(null);
    setStaleAssetId(null);
  };

  const keepStaleAsset = () => {
    setStaleAssetId(null);
    // Note: We don't update the fingerprint. The asset remains stale. 
    // This dialog will pop up again if they navigate back. 
    // Wait, the prompt says: "Keep Current: preserve asset and manual edits, do not falsely update sourcePriorityFingerprint"
    // To prevent an infinite loop of dialogs, we could just clear the staleAssetId in local state.
    // However, if the effect runs again, it will trigger again. Let's rely on local state. 
    // Since `staleAssetId` is set to null, and the effect only runs on deps change, it won't re-trigger immediately.
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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Proof Asset Builder</h1>
          <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
            Generate and refine your 3 execution-ready proof asset briefs.
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-col sm:flex-row gap-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
        {proofAssets.map((asset, idx) => {
          const isActive = idx === activeTab;
          return (
            <button
              key={asset.id}
              onClick={() => setActiveTab(idx)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap min-w-max",
                isActive 
                  ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary" 
                  : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-300"
              )}
            >
              {asset.isAccepted ? (
                <CheckCircle2 size={14} className={isActive ? "text-brand-primary" : "text-emerald-500"} />
              ) : (
                <Circle size={14} className={isActive ? "text-brand-primary" : "text-zinc-500"} />
              )}
              <span className="text-xs font-semibold tracking-wide">Project {idx + 1}</span>
              {asset.isCustom && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-amber-500/80" title="Customized" />}
            </button>
          );
        })}
      </div>

      {/* SPLIT SCREEN LAYOUT */}
      <motion.div 
        key={activeAsset.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
        className="flex flex-col lg:flex-row gap-6 min-h-[500px]"
      >
        {/* LEFT: EDITING AREA */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Project Brief</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRegenerateClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.03] text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-400 hover:text-zinc-300 hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                <RotateCcw size={10} />
                Regenerate Asset
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <Field label="Title" value={activeAsset.title} onChange={(v) => handleFieldChange('title', v)} />
            <Field label="Target Audience" value={activeAsset.targetAudience} onChange={(v) => handleFieldChange('targetAudience', v)} />
            <Field label="Scenario" value={activeAsset.scenario} onChange={(v) => handleFieldChange('scenario', v)} type="textarea" />
            
            <ArrayField label="Execution Steps" values={activeAsset.executionSteps} onChange={(i, v) => handleArrayChange('executionSteps', i, v)} />
            <ArrayField label="Deliverables" values={activeAsset.deliverables} onChange={(i, v) => handleArrayChange('deliverables', i, v)} />
            <ArrayField label="Evidence to Capture" values={activeAsset.evidenceToCapture} onChange={(i, v) => handleArrayChange('evidenceToCapture', i, v)} />
            <ArrayField label="Process to Document" values={activeAsset.processToDocument} onChange={(i, v) => handleArrayChange('processToDocument', i, v)} />
            
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.02] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" />
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider">What Not To Claim</h3>
              </div>
              <ArrayField 
                label="" 
                values={activeAsset.whatNotToClaim} 
                onChange={(i, v) => handleArrayChange('whatNotToClaim', i, v)} 
                hideLabel 
              />
            </div>
          </div>
        </div>

        {/* RIGHT: PRESENTATION PREVIEW */}
        <div className="w-full lg:w-[400px] shrink-0 space-y-6">
          <h2 className="text-sm font-bold text-white">Portfolio Preview</h2>
          
          <div className="rounded-xl border border-white/10 bg-zinc-900 overflow-hidden shadow-xl">
            {/* Fake Portfolio Card Header */}
            <div className="h-32 bg-white/[0.03] border-b border-white/5 relative flex items-center justify-center overflow-hidden">
              <FileText size={32} className="text-white/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <input 
                  value={activeAsset.portfolioCopy.headline}
                  onChange={(e) => handleCopyChange('headline', e.target.value)}
                  className="w-full bg-transparent border-b border-transparent hover:border-white/10 focus:border-brand-primary/50 outline-none text-base font-bold text-white transition-colors"
                  placeholder="Headline..."
                />
                <textarea 
                  value={activeAsset.portfolioCopy.description}
                  onChange={(e) => handleCopyChange('description', e.target.value)}
                  className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-brand-primary/50 outline-none text-xs text-zinc-400 transition-colors resize-none overflow-hidden"
                  rows={2}
                  placeholder="Description..."
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Proof Statement</p>
                <textarea 
                  value={activeAsset.portfolioCopy.proofStatement}
                  onChange={(e) => handleCopyChange('proofStatement', e.target.value)}
                  className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-brand-primary/50 outline-none text-[11px] text-zinc-300 transition-colors resize-none"
                  rows={2}
                  placeholder="Proof Statement..."
                />
              </div>

              <div className="pt-2">
                <input 
                  value={activeAsset.portfolioCopy.cta}
                  onChange={(e) => handleCopyChange('cta', e.target.value)}
                  className="w-full bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary/20 focus:border-brand-primary/50 outline-none text-xs font-bold text-brand-primary text-center py-2 rounded-lg transition-colors cursor-pointer"
                  placeholder="Call to Action..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div>
              <p className="text-xs font-bold text-white">Finalise Brief</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Mark as accepted to proceed.</p>
            </div>
            <button
              onClick={() => handleFieldChange('isAccepted', !activeAsset.isAccepted)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                activeAsset.isAccepted 
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-white/[0.05] text-zinc-300 border border-white/10 hover:bg-white/[0.1]"
              )}
            >
              {activeAsset.isAccepted ? (
                <>
                  <CheckCircle2 size={14} />
                  Accepted
                </>
              ) : (
                'Accept Brief'
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* NAVIGATION BUTTONS */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
        <button
          onClick={previousStep}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/5 bg-white/[0.03] text-zinc-400 hover:text-zinc-300 hover:bg-white/[0.06] transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
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
              ? 'bg-brand-primary text-white border-transparent hover:opacity-90 shadow-sm'
              : 'bg-white/[0.02] border-white/5 text-zinc-500 cursor-not-allowed',
          )}
        >
          {isCompleted ? 'Next Step' : 'Confirm & Continue'}
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
            onConfirm={() => doRegenerate(regenerateWarningId)}
            confirmLabel="Regenerate"
          />
        )}
        
        {staleAssetId && (
          <Dialog
            title="Proof Strategy Changed"
            message={`The linked priority or format for this project was changed in Step 2. Do you want to refresh this brief to match the new strategy?`}
            onCancel={keepStaleAsset}
            onConfirm={() => doRegenerate(staleAssetId)}
            confirmLabel="Refresh Asset"
            cancelLabel="Keep Current"
            warningIcon
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">{label}</label>
      {type === 'text' ? (
        <input 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg outline-none text-xs text-white/90 placeholder:text-zinc-600 bg-white/[0.02] border border-white/5 focus:border-brand-primary/50 transition-colors"
        />
      ) : (
        <textarea 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg outline-none text-xs text-white/90 placeholder:text-zinc-600 bg-white/[0.02] border border-white/5 focus:border-brand-primary/50 transition-colors resize-y min-h-[60px]"
        />
      )}
    </div>
  );
}

function ArrayField({ label, values, onChange, hideLabel = false }: { label: string; values: string[]; onChange: (idx: number, v: string) => void, hideLabel?: boolean }) {
  return (
    <div className="space-y-2">
      {!hideLabel && <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">{label}</label>}
      <ul className="space-y-1.5">
        {values.map((v, i) => (
          <li key={i} className="flex items-start gap-2 group">
            <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-zinc-600 group-focus-within:bg-brand-primary/50 transition-colors" />
            <input 
              value={v}
              onChange={(e) => onChange(i, e.target.value)}
              className="flex-1 bg-transparent border-b border-transparent hover:border-white/5 focus:border-brand-primary/30 outline-none text-xs text-zinc-300 transition-colors py-0.5"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Dialog({
  title, message, onCancel, onConfirm, confirmLabel = 'Confirm', cancelLabel = 'Cancel', warningIcon = false
}: {
  title: string; message: string; onCancel: () => void; onConfirm: () => void; confirmLabel?: string; cancelLabel?: string; warningIcon?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
        className="w-full max-w-sm rounded-2xl border border-white/5 bg-zinc-900/95 backdrop-blur-xl p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-start gap-3">
          {warningIcon ? (
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 shrink-0">
              <AlertTriangle size={14} className="text-amber-400" />
            </span>
          ) : (
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 shrink-0">
              <RotateCcw size={14} className="text-brand-primary" />
            </span>
          )}
          <div className="space-y-1">
            <p className="text-sm font-bold text-white/90">{title}</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-white/5 bg-white/[0.03] text-zinc-400 hover:text-zinc-300 hover:bg-white/[0.06] transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-primary text-white border-transparent hover:opacity-90 transition-all font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
