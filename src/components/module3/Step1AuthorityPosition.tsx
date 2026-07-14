import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowLeft, ArrowRight, Sparkles, RotateCcw, AlertTriangle, Award, BookOpen, GitBranch, Compass, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import type { AuthorityPosition } from '../../types/module3';
import {
  AUTHORITY_POSITIONS,
  resolveRecommendedPosition,
  generatePositionRationale,
  generateCoreTrustPromise,
  getServiceLabel,
} from '../../data/module3/authority-positions';
import type { PositionContext } from '../../data/module3/authority-positions';
import { composeStep1Content, buildPersonalizationContext } from '../../lib/module3/personalized-content';
import { StepHeader } from '../workspace/StepHeader';
import { StepActionArea } from '../workspace/StepActionArea';
import { ModuleButton } from '../workspace/ModuleButton';
import { SelectionCard } from '../workspace/SelectionCard';

const POSITION_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  prior_client_results: Award,
  domain_expertise: BookOpen,
  proprietary_process: GitBranch,
  strategic_frameworks: Compass,
};

function usePositionContext() {
  const careerTrackId = useModule3Store((s) => s.mod1CareerTrackId);
  const serviceId = useModule3Store((s) => s.mod1ServiceId);
  const marketId = useModule3Store((s) => s.mod1MarketId);
  const nicheId = useModule3Store((s) => s.mod1NicheId);
  const positioning = useModule3Store((s) => s.mod1Positioning);
  const offerType = useModule3Store((s) => s.mod2OfferType);
  const deliverables = useModule3Store((s) => s.mod2Deliverables);
  const uniqueMechanism = useModule3Store((s) => s.mod2UniqueMechanism);
  const valueAmplifier = useModule3Store((s) => s.mod2ValueAmplifier);

  const ctx: PositionContext = useMemo(() => ({
    careerTrackId,
    serviceId,
    marketId,
    nicheId,
    positioning,
    offerType,
    deliverables,
    uniqueMechanism,
    valueAmplifier,
  }), [careerTrackId, serviceId, marketId, nicheId, positioning, offerType, deliverables, uniqueMechanism, valueAmplifier]);

  return ctx;
}

export function Step1AuthorityPosition() {
  const ctx = usePositionContext();

  const authorityPosition = useModule3Store((s) => s.authorityPosition);
  const coreTrustPromise = useModule3Store((s) => s.coreTrustPromise);
  const authorityPositionRationale = useModule3Store((s) => s.authorityPositionRationale);
  const setAuthorityPosition = useModule3Store((s) => s.setAuthorityPosition);
  const setCoreTrustPromise = useModule3Store((s) => s.setCoreTrustPromise);
  const setAuthorityPositionRationale = useModule3Store((s) => s.setAuthorityPositionRationale);
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const nextStep = useModule3Store((s) => s.nextStep);
  const previousStep = useModule3Store((s) => s.previousStep);
  const completedSteps = useModule3Store((s) => s.completedSteps);

  const isCompleted = completedSteps.includes('authority_position');

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
      coreTrustPromise: coreTrustPromise,
      proofPriorities: undefined,
      proofAssets: undefined,
    });
    return composeStep1Content(pctx);
  }, [ctx, authorityPosition, coreTrustPromise]);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingPosition, setPendingPosition] = useState<AuthorityPosition | null>(null);
  const [promiseModified, setPromiseModified] = useState(false);
  const [rationaleOpen, setRationaleOpen] = useState(false);
  const generatedBaseline = useRef<string>('');

  const recommended = useMemo(
    () => resolveRecommendedPosition(ctx),
    [ctx],
  );

  const selected = authorityPosition;

  const generateForPosition = useCallback((id: AuthorityPosition) => {
    const rationale = generatePositionRationale(id, ctx);
    setAuthorityPositionRationale(rationale);
    const promise = generateCoreTrustPromise(id, ctx);
    setCoreTrustPromise(promise);
    generatedBaseline.current = promise;
    setPromiseModified(false);
  }, [ctx, setAuthorityPositionRationale, setCoreTrustPromise]);

  const handleSelect = useCallback((id: AuthorityPosition) => {
    if (id === selected) return;

    if (promiseModified && selected !== null) {
      setPendingPosition(id);
      setShowConfirmDialog(true);
      return;
    }

    setAuthorityPosition(id);
    generateForPosition(id);
  }, [selected, promiseModified, setAuthorityPosition, generateForPosition]);

  const confirmPositionChange = useCallback(() => {
    if (pendingPosition) {
      setAuthorityPosition(pendingPosition);
      generateForPosition(pendingPosition);
    }
    setShowConfirmDialog(false);
    setPendingPosition(null);
  }, [pendingPosition, setAuthorityPosition, generateForPosition]);

  const cancelPositionChange = useCallback(() => {
    setShowConfirmDialog(false);
    setPendingPosition(null);
  }, []);

  const handlePromiseChange = useCallback((value: string) => {
    setCoreTrustPromise(value);
    setPromiseModified(value !== generatedBaseline.current);
  }, [setCoreTrustPromise]);

  const handleRegenerate = useCallback(() => {
    if (!selected) return;
    if (promiseModified) {
      setPendingPosition(selected);
      setShowConfirmDialog(true);
      return;
    }
    generateForPosition(selected);
  }, [selected, promiseModified, generateForPosition]);

  const handleConfirm = useCallback(() => {
    if (isCompleted) {
      nextStep();
      return;
    }
    confirmStep();
    nextStep();
  }, [isCompleted, confirmStep, nextStep]);

  const activeService = getServiceLabel(ctx.serviceId);

  return (
    <div className="space-y-8">
      <StepHeader
        step={{ current: 1, total: 5 }}
        title="Authority Position"
        description={personalized.description}
      />

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3">Recommended for {activeService}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AUTHORITY_POSITIONS.map((pos, i) => {
            const isRecommended = pos.id === recommended;
            const isSelected = pos.id === selected;
            const Icon = POSITION_ICONS[pos.id] || Award;

            return (
              <SelectionCard
                key={pos.id}
                selected={isSelected}
                onClick={() => handleSelect(pos.id)}
                delay={0.05 * i}
                ariaLabel={pos.label}
              >
                {isRecommended && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0058be]/8 text-[#0058be] text-[8px] font-bold uppercase tracking-widest shrink-0 self-start mb-2">
                    <Sparkles size={8} />
                    Recommended
                  </span>
                )}

                <div className="flex items-start gap-3">
                  <span className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors',
                    isSelected ? 'bg-[#0058be]/10' : 'bg-[#f8f9ff]',
                  )}>
                    <Icon size={16} className={cn(isSelected ? 'text-[#0058be]' : 'text-neutral-500')} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-[#0b1c30] block">{pos.label}</span>
                    <span className="text-[11px] text-neutral-500 leading-relaxed block mt-0.5">{pos.shortExplanation}</span>
                  </div>
                  <span className={cn(
                    'flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 transition-all duration-200 mt-0.5',
                    isSelected
                      ? 'bg-[#0058be] border-[#0058be]'
                      : 'border-neutral-300',
                  )}>
                    {isSelected && <Check size={10} className="text-white stroke-[3]" />}
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {isSelected && (
                    <motion.div
                      key="trust-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-neutral-100">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">How trust is earned</p>
                        <p className="text-[11px] text-neutral-500 leading-relaxed">{pos.howTrustIsEarned}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SelectionCard>
            );
          })}
        </div>
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
          className="space-y-5"
        >
          <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded bg-[#0058be]/10 border border-[#0058be]/20 flex items-center justify-center shrink-0">
                    <Sparkles size={10} className="text-[#0058be]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0b1c30]">Core Trust Promise</h3>
                    <p className="text-[10px] text-neutral-500">
                      {personalized.promiseHelperText}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {promiseModified && (
                    <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50">
                      Edited
                    </span>
                  )}
                  <button
                    onClick={handleRegenerate}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer"
                  >
                    <RotateCcw size={9} />
                    Regenerate
                  </button>
                </div>
              </div>
              <textarea
                value={coreTrustPromise}
                onChange={(e) => handlePromiseChange(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl outline-none text-sm text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/30 transition-colors resize-y min-h-[80px] leading-relaxed"
                placeholder={personalized.promisePlaceholder}
              />
            </div>
            <div className="px-5 py-2.5 bg-[#f8f9ff] border-t border-neutral-100 flex items-center gap-2 text-[10px] text-neutral-400">
              <span className={cn(
                'w-1.5 h-1.5 rounded-full',
                promiseModified ? 'bg-amber-400' : 'bg-emerald-400',
              )} />
              {promiseModified ? 'Editing' : 'Saved'}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
            <button
              onClick={() => setRationaleOpen(!rationaleOpen)}
              className="flex items-center justify-between w-full p-4 text-left cursor-pointer hover:bg-neutral-50 transition-colors"
              aria-expanded={rationaleOpen}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                  <BookOpen size={10} className="text-neutral-500" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#0b1c30]">Why this position?</span>
                  {!rationaleOpen && (
                    <p className="text-[10px] text-neutral-500 mt-0.5">{authorityPositionRationale?.slice(0, 80)}...</p>
                  )}
                </div>
              </div>
              <ChevronDown size={14} className={cn('text-neutral-400 transition-transform shrink-0', rationaleOpen && 'rotate-180')} />
            </button>
            <AnimatePresence initial={false}>
              {rationaleOpen && (
                <motion.div
                  key="rationale-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-neutral-100 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Position Rationale</p>
                    <p className="text-xs text-neutral-600 leading-relaxed">{authorityPositionRationale}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <StepActionArea>
        <ModuleButton variant="secondary" onClick={previousStep}>
          <ArrowLeft size={14} />
          Back
        </ModuleButton>

        <ModuleButton
          variant="primary"
          onClick={handleConfirm}
          disabled={!selected}
        >
          {isCompleted ? 'Continue' : 'Use this position'}
          <ArrowRight size={14} />
        </ModuleButton>
      </StepActionArea>

      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={cancelPositionChange}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-labelledby="confirm-title"
              aria-modal="true"
              className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 border border-amber-200 shrink-0">
                  <AlertTriangle size={14} className="text-amber-700" />
                </span>
                <div className="space-y-1">
                  <p id="confirm-title" className="text-sm font-bold text-[#0b1c30]">You edited your Core Trust Promise</p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    {pendingPosition
                      ? 'Changing your authority position can regenerate the promise. What would you like to do?'
                      : 'Regenerating will replace your edited promise. What would you like to do?'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={cancelPositionChange}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Keep My Edit
                </button>
                <button
                  onClick={confirmPositionChange}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#0058be] text-white border-transparent hover:opacity-90 transition-all font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  {pendingPosition ? 'Use New Position' : 'Regenerate Promise'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
