import React from 'react';
import { Shield, TrendingUp, CheckCircle2, ArrowRight, Zap, Award, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';

interface Props {
  authorityScore: number;
  progressPercent: number;
  readinessPercent: number;
  nextActionTitle: string;
  nextActionImpact: string;
  estimatedScoreIncrease: number;
  onContinueBuilding: () => void;
}

export const ExecutiveHeroDashboard = React.memo(function ExecutiveHeroDashboard({
  authorityScore,
  progressPercent,
  readinessPercent,
  nextActionTitle,
  nextActionImpact,
  estimatedScoreIncrease,
  onContinueBuilding,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-6 text-left relative overflow-hidden"
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Award size={14} />
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-400">
              AUTHORITY WORKSPACE OS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Brand & Portfolio Generator
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
            Turn your positioning and proof assets into a market-ready public brand, visual social profiles, 9-section portfolio blueprint, and 30-day content calendar.
          </p>
        </div>

        {/* Start Working CTA */}
        <button
          onClick={onContinueBuilding}
          className="px-5 py-3 bg-[#0058be] hover:bg-blue-600 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20 active:scale-95 shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <Sparkles size={14} className="text-amber-300" />
          <span>Start Working</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Core Executive Metrics & Next Best Action Integrated Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric Pill Grid */}
        <div className="md:col-span-2 grid grid-cols-3 gap-3">
          {/* Authority Score */}
          <div className="bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700/60 space-y-1 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Authority Score</span>
              <Shield size={14} className="text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400 tracking-tight">{authorityScore}</span>
              <span className="text-[10px] text-neutral-500 font-bold">/ 100 PTS</span>
            </div>
            <div className="w-full h-1 bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${authorityScore}%` }} />
            </div>
          </div>

          {/* Publish Readiness */}
          <div className="bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700/60 space-y-1 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Publish Readiness</span>
              <CheckCircle2 size={14} className="text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400 tracking-tight">{readinessPercent}%</span>
              <span className="text-[10px] text-emerald-400/80 font-bold">READY</span>
            </div>
            <div className="w-full h-1 bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${readinessPercent}%` }} />
            </div>
          </div>

          {/* Overall Progress */}
          <div className="bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700/60 space-y-1 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Overall Progress</span>
              <TrendingUp size={14} className="text-blue-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-blue-300 tracking-tight">{progressPercent}%</span>
              <span className="text-[10px] text-blue-400/80 font-bold">BUILT</span>
            </div>
            <div className="w-full h-1 bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Integrated Next Best Action Focus */}
        <div className="bg-gradient-to-br from-blue-950/80 to-slate-900 p-4 rounded-2xl border border-blue-500/30 flex flex-col justify-between space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-widest flex items-center gap-1">
              <Zap size={12} className="text-amber-400" /> NEXT BEST ACTION
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
              +{estimatedScoreIncrease} PTS
            </span>
          </div>
          <div>
            <h4 className="text-xs font-black text-white line-clamp-1">{nextActionTitle}</h4>
            <p className="text-[11px] text-neutral-400 font-medium line-clamp-1 mt-0.5">{nextActionImpact}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
