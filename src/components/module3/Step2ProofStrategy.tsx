import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowLeft, ArrowRight, RotateCcw, ChevronDown, Edit3, X, Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { resolveProofPriorities, resolveAlternateGaps, ALL_FORMATS } from '../../data/module3/proof-priorities';
import type { ProofPriority, ProofFormat } from '../../types/module3';
import type { PriorityContext } from '../../data/module3/proof-priorities';

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

  const ctx: PriorityContext = {
    serviceId,
    marketId,
    nicheId,
    positioning,
    offerType,
    deliverables,
    uniqueMechanism,
    valueAmplifier,
    authorityPosition,
    coreTrustPromise,
  };

  return ctx;
}

export function Step2ProofStrategy() {
  const ctx = usePriorityContext();

  const proofPriorities = useModule3Store((s) => s.proofPriorities);
  const setProofPriorities = useModule3Store((s) => s.setProofPriorities);
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const nextStep = useModule3Store((s) => s.nextStep);
  const previousStep = useModule3Store((s) => s.previousStep);
  const completedSteps = useModule3Store((s) => s.completedSteps);

  const isCompleted = completedSteps.includes('proof_strategy');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [swappingId, setSwappingId] = useState<string | null>(null);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [showPositionStaleDialog, setShowPositionStaleDialog] = useState(false);
  const initialisedRef = useRef(false);
  const hasCustomEdits = proofPriorities.some((p) => p.isCustom);

  const hasAllPriorities = proofPriorities.length === 3 && proofPriorities.every((p) => p.gapTitle.trim().length > 0);

  useEffect(() => {
    if (!initialisedRef.current && proofPriorities.length === 0) {
      const priorities = resolveProofPriorities(ctx);
      setProofPriorities(priorities);
      initialisedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (initialisedRef.current && proofPriorities.length > 0 && !hasCustomEdits) {
      const priorities = resolveProofPriorities(ctx);
      const currentKey = JSON.stringify(proofPriorities.map((p) => p.gapTitle));
      const newKey = JSON.stringify(priorities.map((p) => p.gapTitle));
      if (currentKey !== newKey) {
        setShowPositionStaleDialog(true);
      }
    }
  }, [ctx.authorityPosition]);

  const handleRegenerate = useCallback(() => {
    if (hasCustomEdits) {
      setShowRegenerateDialog(true);
      return;
    }
    const priorities = resolveProofPriorities(ctx);
    setProofPriorities(priorities);
  }, [hasCustomEdits, ctx, setProofPriorities]);

  const confirmRegenerate = useCallback(() => {
    const priorities = resolveProofPriorities(ctx);
    setProofPriorities(priorities);
    setShowRegenerateDialog(false);
  }, [ctx, setProofPriorities]);

  const confirmRefresh = useCallback(() => {
    const priorities = resolveProofPriorities(ctx);
    setProofPriorities(priorities);
    setShowPositionStaleDialog(false);
  }, [ctx, setProofPriorities]);

  const handleFormatChange = useCallback((priorityId: string, format: ProofFormat) => {
    setProofPriorities(
      proofPriorities.map((p) =>
        p.id === priorityId ? { ...p, recommendedFormat: format, isCustom: true } : p,
      ),
    );
  }, [proofPriorities, setProofPriorities]);

  const handleDescriptionEdit = useCallback((priorityId: string, value: string) => {
    setProofPriorities(
      proofPriorities.map((p) =>
        p.id === priorityId ? { ...p, gapDescription: value, isCustom: true } : p,
      ),
    );
  }, [proofPriorities, setProofPriorities]);

  const handleTitleEdit = useCallback((priorityId: string, value: string) => {
    setProofPriorities(
      proofPriorities.map((p) =>
        p.id === priorityId ? { ...p, gapTitle: value, isCustom: true } : p,
      ),
    );
  }, [proofPriorities, setProofPriorities]);

  const handleSwap = useCallback((priorityId: string, altTitle: string, altDescription: string, altFormat: ProofFormat) => {
    setProofPriorities(
      proofPriorities.map((p) =>
        p.id === priorityId
          ? { ...p, gapTitle: altTitle, gapDescription: altDescription, recommendedFormat: altFormat, isCustom: false }
          : p,
      ),
    );
    setSwappingId(null);
  }, [proofPriorities, setProofPriorities]);

  const alternates = resolveAlternateGaps(ctx.serviceId, ctx.marketId);

  const startEditing = useCallback((id: string, currentValue: string) => {
    setEditingId(id);
    setEditValue(currentValue);
  }, []);

  const stopEditing = useCallback(() => {
    setEditingId(null);
    setEditValue('');
  }, []);

  const handleConfirm = useCallback(() => {
    if (!hasAllPriorities) return;
    if (isCompleted) {
      nextStep();
      return;
    }
    confirmStep();
    nextStep();
  }, [hasAllPriorities, isCompleted, confirmStep, nextStep]);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 mb-3">
            Step 2 of 5
          </span>
          <h2 className="text-3xl font-bold text-[#0b1c30] tracking-tight">Proof Strategy</h2>
          <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
            These are the 3 credibility gaps your market needs you to prove before they hire you.
          </p>
        </div>
        {proofPriorities.length > 0 && (
          <button
            onClick={handleRegenerate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer shrink-0"
          >
            <RotateCcw size={10} />
            Regenerate
          </button>
        )}
      </div>

      {proofPriorities.length === 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
          <p className="text-xs text-neutral-500">Complete Step 1 (Authority Position) first to generate your proof strategy.</p>
        </div>
      )}

      <div className="space-y-4">
        {proofPriorities.map((priority, index) => {
          const isEditing = editingId === priority.id;
          const isSwapping = swappingId === priority.id;

          return (
            <motion.div
              key={priority.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index, duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              className="rounded-xl border border-neutral-200 bg-white overflow-hidden"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0058be]/10 text-[10px] font-bold text-[#0058be] shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Priority {index + 1}</span>
                  {priority.isCustom && (
                    <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-neutral-500 px-1.5 py-0.5 rounded border border-neutral-200 bg-white">
                      Custom
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {isEditing && editingId === priority.id ? (
                    <textarea
                      value={editValue}
                      onChange={(e) => {
                        setEditValue(e.target.value);
                        handleTitleEdit(priority.id, e.target.value);
                      }}
                      onBlur={stopEditing}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg outline-none text-sm font-semibold text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/30 transition-colors resize-none leading-relaxed"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-start gap-2">
                      <div
                        onClick={() => startEditing(priority.id, priority.gapTitle)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            startEditing(priority.id, priority.gapTitle);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className="flex-1 cursor-text rounded hover:bg-neutral-50 -mx-1 px-1 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be]"
                      >
                        <p className="text-sm font-semibold text-[#0b1c30] leading-relaxed">{priority.gapTitle}</p>
                      </div>
                      <button
                        onClick={() => startEditing(priority.id, priority.gapTitle)}
                        className="shrink-0 w-6 h-6 rounded flex items-center justify-center hover:bg-neutral-100 transition-all cursor-pointer"
                        aria-label="Edit title"
                      >
                        <Edit3 size={10} className="text-neutral-400 hover:text-neutral-600" />
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div>
                    <p className="text-[11px] font-medium text-neutral-500 leading-relaxed mb-3">{priority.gapDescription}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-400">Format</span>
                        <FormatDropdown
                          value={priority.recommendedFormat}
                          onChange={(fmt) => handleFormatChange(priority.id, fmt)}
                        />
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setSwappingId(isSwapping ? null : priority.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-200 bg-white text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer"
                        >
                          <RotateCcw size={8} />
                          Change
                        </button>

                        {isSwapping && alternates.length > 0 && (
                          <div className="absolute right-0 bottom-full mb-2 z-50 w-72 rounded-xl border border-neutral-200 bg-white shadow-2xl overflow-hidden py-2 px-2 space-y-1">
                            <p className="px-2 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-neutral-400">Swap with</p>
                            {alternates.map((alt, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSwap(priority.id, alt.gapTitle, alt.gapDescription, alt.recommendedFormat)}
                                className="w-full flex flex-col gap-0.5 px-3 py-2 rounded-lg text-left transition-colors hover:bg-neutral-50 cursor-pointer"
                              >
                                <span className="text-[10px] font-semibold text-[#0b1c30] leading-snug">{alt.gapTitle}</span>
                                <span className="text-[9px] text-neutral-500 leading-relaxed line-clamp-2">{alt.gapDescription}</span>
                              </button>
                            ))}
                            <button
                              onClick={() => setSwappingId(null)}
                              className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-[8px] font-bold uppercase tracking-[0.1em] text-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer"
                            >
                              <X size={8} />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {hasAllPriorities && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3"
        >
          <Sparkles size={14} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-emerald-700">All 3 priorities defined</p>
            <p className="text-[9px] text-emerald-700/60 mt-0.5">
              You can edit any priority or swap formats before continuing. These will become the foundation of your proof assets.
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <button
          onClick={previousStep}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <button
          onClick={handleConfirm}
          disabled={!hasAllPriorities}
          className={cn(
            'inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border',
            hasAllPriorities
              ? 'bg-[#0058be] text-white border-transparent hover:opacity-90 shadow-sm'
              : 'bg-white border-neutral-200 text-neutral-400 cursor-not-allowed',
          )}
        >
          {isCompleted ? 'Continue' : 'Build my proof assets'}
          <ArrowRight size={14} />
        </button>
      </div>

      <AnimatePresence>
        {showRegenerateDialog && (
          <Dialog
            title="Regenerate proof priorities?"
            message="Regenerating will replace your edited priorities. What would you like to do?"
            onCancel={() => setShowRegenerateDialog(false)}
            onConfirm={confirmRegenerate}
            confirmLabel="Regenerate All"
          />
        )}
        {showPositionStaleDialog && (
          <Dialog
            title="Authority Position changed"
            message="Your Authority Position changed since these priorities were generated. What would you like to do?"
            onCancel={() => setShowPositionStaleDialog(false)}
            onConfirm={confirmRefresh}
            confirmLabel="Refresh Recommendations"
            cancelLabel="Keep Current"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Dialog({
  title,
  message,
  onCancel,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onCancel}
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
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 border border-amber-200 shrink-0">
            <AlertTriangle size={14} className="text-amber-700" />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#0b1c30]">{title}</p>
            <p className="text-[11px] text-neutral-500 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#0058be] text-white border-transparent hover:opacity-90 transition-all font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FormatDropdown({
  value,
  onChange,
}: {
  value: ProofFormat;
  onChange: (val: ProofFormat) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = ALL_FORMATS.find((f) => f.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200 bg-white text-[10px] font-semibold text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer whitespace-nowrap"
      >
        {current?.label ?? value}
        <ChevronDown size={10} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-xl border border-neutral-200 bg-white shadow-2xl overflow-hidden py-1">
          {ALL_FORMATS.map((fmt) => {
            const isActive = fmt.value === value;
            return (
              <button
                key={fmt.value}
                onClick={() => {
                  onChange(fmt.value);
                  setOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-left transition-colors text-[10px]',
                  isActive ? 'bg-[#0058be]/5 text-[#0058be]' : 'text-neutral-500 hover:bg-neutral-50 hover:text-[#0b1c30]',
                )}
              >
                {isActive && <Check size={10} className="shrink-0 text-[#0058be]" />}
                <span className={cn(!isActive && 'ml-[18px]')}>{fmt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
