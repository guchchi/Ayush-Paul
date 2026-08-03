import React from 'react';
import { Target, CheckCircle2, ArrowRight, Award, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';

interface Props {
  progressPercent: number;
  readinessPercent: number;
  onBuildNow: () => void;
}

export const MissionControlFooter = React.memo(function MissionControlFooter({
  progressPercent,
  readinessPercent,
  onBuildNow,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="bg-gradient-to-br from-[#0b1c30] via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-white/10 space-y-6 text-left relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-300">
              MISSION CONTROL & LAUNCH READINESS
            </span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white">
            You Are {readinessPercent}% Ready to Launch
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Your brand identity, multi-platform profile packages, portfolio blueprint, and 30-day content calendar are active. Move straight into execution!
          </p>
        </div>

        <button
          onClick={onBuildNow}
          className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <Zap size={16} />
          <span>Build Now & Launch</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Progress Bar & Milestones */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Current Completion: {progressPercent}%</span>
          <span className="text-emerald-400 font-black">Next Milestone: 75% Target</span>
        </div>

        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-1">
          <span>0% Start</span>
          <span>25% Brand Identity</span>
          <span>50% Profiles & Portfolio</span>
          <span>75% Content Engine</span>
          <span className="text-emerald-300">100% Market Dominance</span>
        </div>
      </div>
    </motion.section>
  );
});
