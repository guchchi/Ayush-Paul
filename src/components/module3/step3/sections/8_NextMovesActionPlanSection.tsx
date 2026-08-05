import React from 'react';
import { Rocket, CheckSquare, Square } from 'lucide-react';
import type { ProfilePortfolioAuthorityBlueprint } from '../../../../types/module3-step3-authority';
import { useModule3Store } from '../../../../lib/module3/store';

interface NextMovesActionPlanSectionProps {
  blueprint: ProfilePortfolioAuthorityBlueprint;
}

export const NextMovesActionPlanSection: React.FC<NextMovesActionPlanSectionProps> = ({ blueprint }) => {
  const { nextMoves } = blueprint;
  const { toggleNextMoveItem } = useModule3Store();

  const completedCount = nextMoves.filter((m) => m.isCompleted).length;
  const totalCount = nextMoves.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-sm">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-[#0058be] font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
          <Rocket className="w-4 h-4 text-[#0058be]" />
          Tactical Execution Checklist (Post-Blueprint Action Plan)
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Your Next Moves</h3>
            <p className="text-sm text-[#424754] mt-1 max-w-2xl leading-relaxed">
              Dynamically generated tactical execution steps tailored to your specific positioning, proof assets, and alignment audit.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#f8f9ff] px-4 py-2 rounded-xl border border-slate-200 shrink-0">
            <span className="text-xs font-mono text-slate-500">Progress:</span>
            <span className="text-xs font-mono font-bold text-emerald-700">{completedCount} / {totalCount} Done</span>
            <span className="text-xs font-mono text-[#0058be] font-bold">({progressPct}%)</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
        <div
          className="bg-gradient-to-r from-[#0058be] to-emerald-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {nextMoves.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleNextMoveItem(item.id)}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
              item.isCompleted
                ? 'bg-emerald-50/60 border-emerald-200 opacity-85 shadow-xs'
                : 'bg-[#f8f9ff] border-slate-200/80 hover:border-[#0058be]/40 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <button className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer">
                {item.isCompleted ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-base font-bold ${item.isCompleted ? 'text-slate-400 line-through' : 'text-[#0b1c30]'}`}>
                    0{item.stepNumber}. {item.title}
                  </h4>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-white text-[#0058be] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                      {item.impact}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#424754] leading-relaxed font-sans">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
