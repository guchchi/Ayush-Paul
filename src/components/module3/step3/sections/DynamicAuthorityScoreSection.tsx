import React, { useState } from 'react';
import { ROIOpportunityItem } from '../../../../data/module3/authority-suite-engine';
import { ShieldCheck, TrendingUp, CheckCircle2, Circle, Sparkles, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';

interface Props {
  baseScore?: number;
  opportunities: ROIOpportunityItem[];
  onToggleTask?: (taskId: string) => void;
}

export const DynamicAuthorityScoreSection = React.memo(function DynamicAuthorityScoreSection({
  baseScore = 74,
  opportunities,
  onToggleTask,
}: Props) {
  // Calculate dynamic bonus from completed tasks
  const completedBonus = opportunities
    .filter((o) => o.isCompleted)
    .reduce((sum, o) => sum + o.authorityImpactPts, 0);

  const currentScore = Math.min(100, baseScore + completedBonus);

  const categories = [
    { label: 'Positioning & Strategy', score: 92, color: 'bg-emerald-500' },
    { label: 'Proof Assets & Verification', score: 85, color: 'bg-blue-500' },
    { label: 'Social Profile Systems', score: 80, color: 'bg-[#0077b5]' },
    { label: 'Portfolio Architecture', score: 75, color: 'bg-indigo-500' },
    { label: 'Offer & Deliverables Scope', score: 88, color: 'bg-purple-500' },
    { label: '30-Day Content Engine', score: 70, color: 'bg-amber-500' },
    { label: 'Authority & Thought Leadership', score: 65, color: 'bg-pink-500' },
    { label: 'Outreach & Client Acquisition', score: 60, color: 'bg-red-500' },
  ];

  return (
    <section className="space-y-6 text-left">
      {/* Score Hero Card */}
      <div className="bg-gradient-to-br from-[#0b1c30] via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Award className="text-amber-400" size={20} />
              <span className="text-xs font-black uppercase tracking-widest text-blue-300">
                REAL-TIME AUTHORITY ENGINE
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Dynamic Authority Blueprint Score</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Your overall market authority rating is calculated live based on positioning clarity, proof assets, and channel readiness. Complete tasks below to dynamically increase your score!
            </p>
          </div>

          {/* Animated Gauge Score Display */}
          <div className="flex items-center justify-center p-6 bg-white/10 rounded-3xl border border-white/15 backdrop-blur-md shrink-0 text-center flex-col space-y-1">
            <motion.span
              key={currentScore}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              className="text-5xl font-black text-amber-400 tracking-tight"
            >
              {currentScore}
            </motion.span>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">
              Out of 100 Points
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {currentScore >= 85 ? '👑 Dominant Market Leader' : '🚀 High-Growth Foundation'}
            </span>
          </div>
        </div>

        {/* 8-Category Sub-Score Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-white/10">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="truncate">{cat.label}</span>
                <span className="text-white">{cat.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Improvement Tasks (Dynamic Score Booster) */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#0058be]" />
            <h4 className="text-base font-black text-[#0b1c30]">Interactive Score Improvement Roadmap</h4>
          </div>
          <span className="text-xs font-bold text-neutral-500">
            Check tasks to test real-time score recalculation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {opportunities.map((opp) => (
            <button
              key={opp.id}
              onClick={() => onToggleTask && onToggleTask(opp.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                opp.isCompleted
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-neutral-50 hover:bg-white border-neutral-200 hover:border-blue-300 text-neutral-900'
              }`}
            >
              <span className="mt-0.5 shrink-0">
                {opp.isCompleted ? (
                  <CheckCircle2 size={18} className="text-emerald-600" />
                ) : (
                  <Circle size={18} className="text-neutral-400" />
                )}
              </span>

              <div className="space-y-1 overflow-hidden w-full">
                <div className="flex items-center justify-between gap-2">
                  <h5 className={`text-xs font-bold truncate ${opp.isCompleted ? 'line-through text-emerald-800' : ''}`}>
                    {opp.title}
                  </h5>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black shrink-0">
                    +{opp.authorityImpactPts} pts
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 font-medium line-clamp-2">{opp.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
});
