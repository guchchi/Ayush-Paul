import React from 'react';
import { Shield, Sparkles, TrendingUp, CheckCircle2, ArrowRight, Zap, Award } from 'lucide-react';
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="bg-gradient-to-br from-[#0b1c30] via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-white/10 space-y-6 text-left relative overflow-hidden"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Award size={16} />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-blue-300">
              EXECUTIVE OPERATING SYSTEM
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Authority Command Center
          </h2>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onContinueBuilding}
          className="px-5 py-3 bg-[#0058be] hover:bg-blue-600 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-500/20 active:scale-95 shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <Zap size={14} className="text-amber-300" />
          <span>Continue Building</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 4 Core Executive Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: How am I doing? */}
        <div className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-2 relative group hover:border-blue-400/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">How Am I Doing?</span>
            <Shield size={16} className="text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400 tracking-tight">{authorityScore}</span>
            <span className="text-xs text-slate-400 font-bold">/ 100 PTS</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${authorityScore}%` }} />
          </div>
        </div>

        {/* Metric 2: How close to publishing? */}
        <div className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-2 relative group hover:border-emerald-400/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Publish Readiness</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 tracking-tight">{readinessPercent}%</span>
            <span className="text-xs text-emerald-300 font-bold">READY</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${readinessPercent}%` }} />
          </div>
        </div>

        {/* Metric 3: Overall Progress */}
        <div className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-2 relative group hover:border-blue-400/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Overall Progress</span>
            <TrendingUp size={16} className="text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-300 tracking-tight">{progressPercent}%</span>
            <span className="text-xs text-slate-400 font-bold">BUILT</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Metric 4: What should I do next? */}
        <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 p-4 sm:p-5 rounded-2xl border border-blue-400/30 space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Next Best Action</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
              +{estimatedScoreIncrease} PTS
            </span>
          </div>
          <h4 className="text-xs font-black text-white line-clamp-1">{nextActionTitle}</h4>
          <p className="text-[11px] text-blue-200 font-medium line-clamp-1">{nextActionImpact}</p>
        </div>
      </div>
    </motion.div>
  );
});
