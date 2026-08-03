import React, { useEffect, useState } from 'react';
import { Shield, Zap, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';

interface Props {
  authorityScore: number;
  progressPercent: number;
  readinessPercent: number;
  nextActionTitle: string;
  onOpenBuildMode: () => void;
}

export const StickyWorkspaceHeader = React.memo(function StickyWorkspaceHeader({
  authorityScore,
  progressPercent,
  readinessPercent,
  nextActionTitle,
  onOpenBuildMode,
}: Props) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 220) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isScrolled && (
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/80 shadow-xs px-4 py-2.5"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            {/* Left: Score & Readiness Pill */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-neutral-900 text-white px-3 py-1 rounded-full text-xs font-black shadow-2xs">
                <Shield size={14} className="text-amber-400" />
                <span>{authorityScore} PTS</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-neutral-700 bg-neutral-100/80 px-3 py-1 rounded-full border border-neutral-200/60">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>{readinessPercent}% Launch Ready</span>
              </div>

              <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <TrendingUp size={13} />
                <span>{progressPercent}% Complete</span>
              </div>
            </div>

            {/* Middle: Next Best Action (Desktop) */}
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-neutral-600 truncate max-w-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 shrink-0">Next:</span>
              <span className="truncate font-bold text-neutral-900">{nextActionTitle}</span>
            </div>

            {/* Right: Build Mode Action Button */}
            <button
              onClick={onOpenBuildMode}
              className="px-4 py-1.5 bg-[#0058be] hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shadow-blue-600/20 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Zap size={13} className="text-amber-300" />
              <span>Build Mode</span>
            </button>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
});
