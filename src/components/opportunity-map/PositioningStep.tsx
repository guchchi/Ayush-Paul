import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import {
  useOpportunityMapStore,
  resolveSelectedOffer,
} from '../../lib/opportunity-map';
import { calculateOpportunityScore } from '../../lib/opportunity-map/simulator-engine';
import { EASING, DURATION } from '../../lib/motion-presets';

export function PositioningStep() {
  const storeState = useOpportunityMapStore((s) => ({
    positioning: s.positioning,
    tracks: s.tracks,
    careerTrackId: s.careerTrackId,
    serviceId: s.serviceId,
    marketId: s.marketId,
    nicheId: s.nicheId,
    offerId: s.offerId,
    setPositioning: s.setPositioning,
    previousStep: s.previousStep,
    nextStep: s.nextStep,
  }));

  const offer = useMemo(
    () => resolveSelectedOffer(storeState),
    [storeState.tracks, storeState.careerTrackId, storeState.serviceId, storeState.marketId, storeState.nicheId, storeState.offerId],
  );

  const template = offer?.positioningTemplate ?? '';
  const [text, setText] = useState(storeState.positioning || template);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (storeState.positioning && storeState.positioning !== text) {
      setText(storeState.positioning);
    }
  }, [storeState.positioning]);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleConfirm = () => {
    storeState.setPositioning(text);

    if (storeState.offerId) {
      try {
        const result = calculateOpportunityScore(storeState.offerId);
        useOpportunityMapStore.setState({ opportunityScore: result.score });
      } catch {
        // score stays null if calculation fails
      }
    }

    storeState.nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <button
            onClick={storeState.previousStep}
            className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft size={14} className="text-zinc-400" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 6 of 7</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Position Your Offer</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Refine your positioning statement — the core message that communicates your unique value to your niche.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-400">
          {offer?.label}
        </span>
      </div>

      <div className="relative">
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 z-10">
          <Sparkles size={10} className="text-white/50" />
          <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-400">Positioning Template</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        >
          <textarea
            ref={textRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={[
              'w-full min-h-[200px] px-5 pt-12 pb-5 rounded-xl resize-none outline-none',
              'bg-white/[0.02] border border-white/5',
              'focus:border-white/20 focus:bg-white/[0.03] focus:shadow-[0_0_30px_-12px_rgba(255,255,255,0.04)]',
              'text-sm text-white/90 leading-relaxed placeholder:text-zinc-500',
              'transition-all duration-300 custom-scrollbar',
              'font-sans',
            ].join(' ')}
          />
        </motion.div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">
          {text.length} characters
        </span>

        <motion.button
          onClick={handleConfirm}
          disabled={text.trim().length === 0}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.15 }}
          className={[
            'inline-flex items-center gap-2 px-6 h-10 rounded-lg text-xs font-bold uppercase tracking-[0.08em]',
            'transition-all duration-300 cursor-pointer select-none',
            text.trim().length > 0
              ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)]'
              : 'bg-white/[0.03] text-zinc-600 border border-white/5 cursor-not-allowed',
          ].join(' ')}
        >
          <Sparkles size={13} />
          Confirm &amp; Analyze Opportunity
        </motion.button>
      </div>
    </div>
  );
}
