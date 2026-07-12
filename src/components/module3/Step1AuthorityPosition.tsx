import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowLeft, ArrowRight, Sparkles, RotateCcw, AlertTriangle } from 'lucide-react';
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

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingPosition, setPendingPosition] = useState<AuthorityPosition | null>(null);
  const [promiseModified, setPromiseModified] = useState(false);
  const generatedBaseline = useRef<string>('');

  useEffect(() => {
    if (coreTrustPromise && !generatedBaseline.current) {
      generatedBaseline.current = coreTrustPromise;
    }
  }, [coreTrustPromise]);

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
    if (value !== generatedBaseline.current) {
      setPromiseModified(true);
    } else {
      setPromiseModified(false);
    }
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight">Authority Position</h1>
        <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
          Choose how you will demonstrate credibility without past client work.
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Recommended for {getServiceLabel(ctx.serviceId)}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {AUTHORITY_POSITIONS.map((pos, i) => {
          const isRecommended = pos.id === recommended;
          const isSelected = pos.id === selected;

          return (
            <motion.button
              key={pos.id}
              onClick={() => handleSelect(pos.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              className={cn(
                'relative flex flex-col gap-3 w-full p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer group',
                isSelected
                  ? 'border-brand-primary/60 ring-1 ring-brand-primary/30 bg-brand-primary/5 shadow-[0_0_32px_rgba(0,88,190,0.08)]'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]',
              )}
            >
              {isRecommended && (
                <span className="absolute -top-2.5 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-[8px] font-bold uppercase tracking-[0.12em] text-brand-primary">
                  <Sparkles size={8} className="text-brand-primary" />
                  Recommended
                </span>
              )}

              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex items-center justify-center w-5 h-5 rounded-full border shrink-0 transition-all duration-200',
                  isSelected
                    ? 'bg-brand-primary border-brand-primary ring-2 ring-brand-primary/30'
                    : 'border-white/10 group-hover:border-white/20',
                )}>
                  {isSelected && <Check size={10} className="text-white stroke-[3]" />}
                </div>
                <span className="text-sm font-bold text-white/90 tracking-tight">{pos.label}</span>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed">{pos.shortExplanation}</p>

              <div className="pt-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500 mb-1">How trust is earned</p>
                <p className="text-[10px] text-zinc-500 leading-relaxed">{pos.howTrustIsEarned}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
          className="space-y-5"
        >
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Core Trust Promise</p>
                {promiseModified && (
                  <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/20 bg-amber-400/5">
                    Edited
                  </span>
                )}
              </div>
              <button
                onClick={handleRegenerate}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/5 bg-white/[0.03] text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-400 hover:text-zinc-300 hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                <RotateCcw size={9} />
                Regenerate
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              This answers: <span className="text-zinc-400">&ldquo;What honest reason should a prospect have to believe I understand this problem?&rdquo;</span>
            </p>
            <textarea
              value={coreTrustPromise}
              onChange={(e) => handlePromiseChange(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl outline-none text-xs text-white/90 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/30 transition-colors resize-none leading-relaxed"
              placeholder="Write your core trust promise..."
            />
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Position Rationale</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">{authorityPositionRationale}</p>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={previousStep}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/5 bg-white/[0.03] text-zinc-400 hover:text-zinc-300 hover:bg-white/[0.06] transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <button
          onClick={handleConfirm}
          disabled={!selected}
          className={cn(
            'inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border',
            selected
              ? 'bg-brand-primary text-white border-transparent hover:opacity-90 shadow-sm'
              : 'bg-white/[0.02] border-white/5 text-zinc-500 cursor-not-allowed',
          )}
        >
          {isCompleted ? 'Next Step' : 'Lock in Position'}
          <ArrowRight size={14} />
        </button>
      </div>

      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={cancelPositionChange}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/5 bg-zinc-900/95 backdrop-blur-xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 shrink-0">
                  <AlertTriangle size={14} className="text-amber-400" />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white/90">You edited your Core Trust Promise</p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {pendingPosition
                      ? 'Changing your authority position can regenerate the promise. What would you like to do?'
                      : 'Regenerating will replace your edited promise. What would you like to do?'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={cancelPositionChange}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-white/5 bg-white/[0.03] text-zinc-400 hover:text-zinc-300 hover:bg-white/[0.06] transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Keep My Edit
                </button>
                <button
                  onClick={confirmPositionChange}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-primary text-white border-transparent hover:opacity-90 transition-all font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
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
