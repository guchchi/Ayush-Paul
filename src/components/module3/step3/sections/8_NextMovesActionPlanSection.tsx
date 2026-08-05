import React from 'react';
import { Rocket, CheckSquare, Square, Sparkles } from 'lucide-react';
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
    <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-indigo-950/30 border border-indigo-500/30 space-y-6 shadow-xl">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-1">
          <Rocket className="w-4 h-4 text-indigo-400" />
          Tactical Execution Checklist (Post-Blueprint Action Plan)
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-100">Your Next Moves</h3>
            <p className="text-sm text-slate-400 mt-1">
              Dynamically generated tactical execution steps tailored to your specific positioning, proof assets, and alignment audit.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 shrink-0">
            <span className="text-xs font-mono text-slate-400">Progress:</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{completedCount} / {totalCount} Done</span>
            <span className="text-xs font-mono text-indigo-300">({progressPct}%)</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-850">
        <div
          className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
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
                ? 'bg-emerald-950/20 border-emerald-500/40 opacity-80'
                : 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <button className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors">
                {item.isCompleted ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-600" />
                )}
              </button>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-semibold ${item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                    0{item.stepNumber}. {item.title}
                  </h4>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-slate-900 text-indigo-300 px-2 py-0.5 rounded border border-slate-800">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-900/40">
                      {item.impact}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
