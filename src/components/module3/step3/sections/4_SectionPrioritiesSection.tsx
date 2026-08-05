import React from 'react';
import { Signal, AlertCircle } from 'lucide-react';
import type { ProfilePortfolioAuthorityBlueprint } from '../../../../types/module3-step3-authority';

interface SectionPrioritiesSectionProps {
  blueprint: ProfilePortfolioAuthorityBlueprint;
}

export const SectionPrioritiesSection: React.FC<SectionPrioritiesSectionProps> = ({ blueprint }) => {
  const { sectionPriorities } = blueprint;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-[#0058be] font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
          <Signal className="w-4 h-4 text-[#0058be]" />
          Section 4 — Attention Hierarchy
        </div>
        <h3 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Section Priorities & Focus Allocation</h3>
        <p className="text-sm text-[#424754] mt-1 max-w-2xl leading-relaxed">
          Authority requires emphasis. Not all sections deserve equal attention—focus high-ticket visitor attention where your credibility is strongest.
        </p>
      </div>

      {/* Priorities Grid */}
      <div className="grid grid-cols-1 gap-4">
        {sectionPriorities.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all ${
              item.priority === 'HIGH'
                ? 'bg-rose-50/50 border-rose-200 shadow-xs'
                : item.priority === 'MEDIUM'
                ? 'bg-[#eff4ff]/60 border-[#0058be]/20 shadow-xs'
                : 'bg-white border-slate-200/80'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h4 className="text-base font-bold text-[#0b1c30]">{item.sectionName}</h4>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full border ${
                  item.priority === 'HIGH'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : item.priority === 'MEDIUM'
                    ? 'bg-[#0058be]/10 text-[#0058be] border border-[#0058be]/20'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {item.priority} PRIORITY
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 font-mono font-bold block mb-0.5 uppercase text-[10px]">
                  STRATEGIC RATIONALE (WHY):
                </span>
                <span className="text-[#424754] leading-relaxed">{item.whyPriority}</span>
              </div>

              <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-emerald-900 font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950">Action Required:</strong> {item.actionRequired}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
