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
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-1">
          <Signal className="w-4 h-4 text-indigo-400" />
          Section 4 — Attention Hierarchy
        </div>
        <h3 className="text-xl font-bold text-slate-100">Section Priorities & Focus Allocation</h3>
        <p className="text-sm text-slate-400 mt-1">
          Authority requires emphasis. Not all sections deserve equal attention—focus high-ticket visitor attention where your credibility is strongest.
        </p>
      </div>

      {/* Priorities Grid */}
      <div className="grid grid-cols-1 gap-4">
        {sectionPriorities.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border ${
              item.priority === 'HIGH'
                ? 'bg-rose-950/20 border-rose-500/40 shadow-sm shadow-rose-950/20'
                : item.priority === 'MEDIUM'
                ? 'bg-indigo-950/20 border-indigo-500/40'
                : 'bg-slate-900/40 border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h4 className="text-sm font-semibold text-slate-200">{item.sectionName}</h4>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                  item.priority === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : item.priority === 'MEDIUM'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {item.priority} PRIORITY
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                <span className="text-slate-400 font-mono font-semibold block mb-0.5">Strategic Rationale (Why):</span>
                <span className="text-slate-300">{item.whyPriority}</span>
              </div>

              <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30 text-emerald-300 font-mono flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-400">Action Required:</strong> {item.actionRequired}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
