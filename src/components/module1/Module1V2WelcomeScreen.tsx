import { motion } from 'motion/react';
import {
  Sparkles, Clock, Star, ChevronRight, FileText,
  ArrowRight, BookmarkPlus, Play,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';

interface Props {
  onStart: () => void;
  onSaveLater?: () => void;
}

const STEPS_PREVIEW = [
  'Choose Your Track',
  'Choose Your Market',
  'Choose Your Niche',
  'Generate Direction Statement',
  'Save Your Result',
];

export function Module1V2WelcomeScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        >
          {/* ── Two-column layout ── */}
          <div className="grid lg:grid-cols-[1fr_360px] gap-10 xl:gap-16 items-start mb-12">

            {/* ── Left column ── */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0058be]/8 text-[#0058be] text-[11px] font-bold uppercase tracking-widest mb-6">
                <Sparkles size={12} aria-hidden="true" /> Module 1
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.04] mb-5">
                Choose Your<br />
                <span className="text-[#0058be]">Direction</span>
              </h1>

              <p className="text-lg sm:text-xl text-neutral-500 leading-relaxed mb-8 max-w-[480px]">
                Before you build an offer or find clients, you need a clear direction.
                Choose your track, market, niche, and define your first positioning statement.
              </p>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2.5 mb-10" role="list" aria-label="Module details">
                {[
                  { icon: <Clock size={13} aria-hidden="true" />, label: '20\u201330 min' },
                  { icon: <Star size={13} aria-hidden="true" />, label: 'Beginner Friendly' },
                  { icon: <ChevronRight size={13} aria-hidden="true" />, label: '5 Steps' },
                  { icon: <FileText size={13} aria-hidden="true" />, label: 'Output: Direction Statement', accent: true },
                ].map((chip, i) => (
                  <div
                    key={i}
                    role="listitem"
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold border select-none',
                      chip.accent
                        ? 'bg-[#d1f34d] border-[#d1f34d]/60 text-[#0b1c30]'
                        : 'bg-white border-neutral-200 text-neutral-600',
                    )}
                  >
                    {chip.icon} {chip.label}
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <motion.button
                  onClick={onStart}
                  whileHover={{ y: -2, boxShadow: '0 16px 48px rgba(0,88,190,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#0058be] text-white font-bold text-lg transition-colors shadow-[0_8px_32px_rgba(0,88,190,0.28)]"
                  id="v2-start-module-btn"
                >
                  Start Module 1 <ArrowRight size={18} aria-hidden="true" />
                </motion.button>

                <button
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white border border-neutral-200 text-neutral-600 font-semibold text-base hover:border-neutral-300 hover:text-neutral-800 transition-all shadow-sm"
                  id="v2-save-later-btn"
                >
                  <BookmarkPlus size={16} aria-hidden="true" /> Save for later
                </button>
              </div>
            </div>

            {/* ── Right column: at-a-glance card ── */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-5">
                Module 1 at a glance
              </h3>

              {/* Progress preview */}
              <div className="space-y-2.5 mb-6">
                {STEPS_PREVIEW.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                        i === 0
                          ? 'bg-[#0058be]'
                          : 'bg-neutral-100',
                      )}
                      aria-hidden="true"
                    >
                      {i === 0 ? (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-neutral-300" />
                      )}
                    </div>
                    <span className={cn(
                      'text-sm',
                      i === 0 ? 'font-semibold text-[#0b1c30]' : 'text-neutral-400',
                    )}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              {/* Output preview */}
              <div className="pt-4 border-t border-neutral-100">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                  Final Output
                </p>
                <div className="p-3 rounded-lg bg-[#eff4ff]">
                  <p className="text-xs text-neutral-600 leading-relaxed italic">
                    &ldquo;I help <span className="text-[#0058be] font-semibold">[audience]</span> get{' '}
                    <span className="text-[#0058be] font-semibold">[result]</span> using{' '}
                    <span className="text-[#0058be] font-semibold">[method]</span>.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Video section (full width) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.SLOW, ease: EASING.PREMIUM, delay: 0.2 }}
          >
            <button
              className="relative w-full max-w-3xl aspect-video rounded-2xl bg-[#0b1c30] overflow-hidden group cursor-pointer shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2"
              aria-label="Watch Module 1 introduction video (2:47)"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0058be]/20 via-transparent to-[#d1f34d]/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-full bg-[#d1f34d] flex items-center justify-center shadow-xl"
                >
                  <Play size={20} className="text-[#0b1c30] ml-1" fill="currentColor" aria-hidden="true" />
                </motion.div>
              </div>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wide">
                Watch before starting
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-xs font-bold text-white">
                02:47
              </div>
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-xs font-semibold text-white/80">
                Module 1 Introduction
              </div>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
