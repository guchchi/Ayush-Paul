import React from 'react';
import { BlockRendererProps, ViewModel } from '../../../../lib/rendering/types';
import { Sparkles, Lightbulb, Compass, ShieldCheck } from 'lucide-react';
import { NoteEditor } from '../../../notes/components/NoteEditor';

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
    <section className="bg-gradient-to-br from-blue-50/90 via-white to-slate-50 rounded-3xl p-6 sm:p-8 border border-blue-100/90 shadow-sm relative overflow-hidden text-left space-y-6">
      {/* Ambient background accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#0058be] text-white shadow-sm shadow-blue-500/20">
            <Sparkles size={16} />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-[#0058be]">
            Executive Strategy Summary
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-black text-[#0058be] uppercase tracking-wider flex items-center gap-1.5">
            <Compass size={14} /> Overview
          </h3>
          <p className="text-sm font-semibold text-neutral-800 leading-relaxed">
            {block.overview}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-black text-[#0058be] uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb size={14} /> Key Insight
          </h3>
          <p className="text-sm font-semibold text-neutral-800 leading-relaxed">
            {block.insight}
          </p>
        </div>
      </div>

      {/* Primary Recommendation Card */}
      <div className="bg-[#0b1c30] text-white p-6 rounded-2xl shadow-md space-y-2 relative overflow-hidden">
        <div className="flex items-center gap-2 text-blue-300 text-xs font-black uppercase tracking-wider mb-1">
          <ShieldCheck size={15} />
          <span>Primary Recommendation</span>
        </div>
        <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
          {block.recommendation}
        </p>
      </div>

      {/* Guidance Note */}
      {block.guidance && (
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 bg-neutral-100/90 px-4 py-3 rounded-xl border border-neutral-200/70">
          <Lightbulb size={14} className="text-amber-500 shrink-0" />
          <span>{block.guidance}</span>
        </div>
      )}

      {packId && <NoteEditor packId={packId} blockId={block.id} />}
    </section>
  );
}
