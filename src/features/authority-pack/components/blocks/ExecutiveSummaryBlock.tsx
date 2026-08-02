import React from 'react';
import { motion } from 'motion/react';
import { BlockRendererProps, ViewModel } from '../../../../lib/rendering/types';
import { Sparkles, Lightbulb, Compass, ShieldCheck } from 'lucide-react';
import { NoteEditor } from '../../../notes/components/NoteEditor';
import { EASING, DURATION } from '../../../../lib/motion-presets';

interface ExecutiveSummaryViewModel extends ViewModel {
  type: 'authority-pack.executive-summary';
  overview: string;
  insight: string;
  recommendation: string;
  guidance: string;
}

export function ExecutiveSummaryBlock({ block, context }: BlockRendererProps<ExecutiveSummaryViewModel>) {
  const packId = context?.packId;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="bg-gradient-to-br from-blue-50/90 via-white to-slate-50 rounded-3xl p-6 sm:p-8 border border-blue-100/90 shadow-sm relative overflow-hidden text-left space-y-6"
    >
      {/* Decorative ambient background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-[#0058be] text-white shadow-sm shadow-blue-500/20">
            <Sparkles size={18} />
          </span>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0058be] block">
              SECTION 01
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30] tracking-tight">
              Executive Strategy Summary
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: DURATION.FAST }}
          className="bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2 text-left"
        >
          <h3 className="text-xs font-black text-[#0058be] uppercase tracking-wider flex items-center gap-2">
            <Compass size={15} /> Overview
          </h3>
          <p className="text-sm font-semibold text-neutral-800 leading-relaxed">
            {block.overview}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: DURATION.FAST }}
          className="bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2 text-left"
        >
          <h3 className="text-xs font-black text-[#0058be] uppercase tracking-wider flex items-center gap-2">
            <Lightbulb size={15} /> Key Insight
          </h3>
          <p className="text-sm font-semibold text-neutral-800 leading-relaxed">
            {block.insight}
          </p>
        </motion.div>
      </div>

      {/* Primary Recommendation Hero Card */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        transition={{ duration: DURATION.FAST }}
        className="bg-[#0b1c30] text-white p-6 sm:p-7 rounded-2xl shadow-md space-y-2 relative overflow-hidden text-left"
      >
        <div className="flex items-center gap-2 text-blue-300 text-xs font-black uppercase tracking-wider mb-1">
          <ShieldCheck size={16} />
          <span>Primary Recommendation</span>
        </div>
        <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
          {block.recommendation}
        </p>
      </motion.div>

      {/* Guidance Note */}
      {block.guidance && (
        <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100/90 px-4 py-3 rounded-xl border border-neutral-200/70 text-left">
          <Lightbulb size={15} className="text-amber-500 shrink-0" />
          <span>{block.guidance}</span>
        </div>
      )}

      {packId && <NoteEditor packId={packId} blockId={block.id} />}
    </motion.section>
  );
}
