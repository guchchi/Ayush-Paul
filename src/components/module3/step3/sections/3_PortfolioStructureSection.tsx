import React from 'react';
import { LayoutGrid, ArrowUp, ArrowDown, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ProfilePortfolioAuthorityBlueprint } from '../../../../types/module3-step3-authority';
import { useModule3Store } from '../../../../lib/module3/store';

interface PortfolioStructureSectionProps {
  blueprint: ProfilePortfolioAuthorityBlueprint;
}

export const PortfolioStructureSection: React.FC<PortfolioStructureSectionProps> = ({ blueprint }) => {
  const { portfolioStructure } = blueprint;
  const { reorderBlueprintPortfolioSection, toggleBlueprintPortfolioSection, acceptBlueprintRecommendation } = useModule3Store();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-1">
          <LayoutGrid className="w-4 h-4 text-indigo-400" />
          Section 3 — Guided Credibility Journey
        </div>
        <h3 className="text-xl font-bold text-slate-100">Portfolio Structure & Information Flow</h3>
        <p className="text-sm text-slate-400 mt-1">
          Your portfolio is a guided credibility journey designed to lead visitors from initial interest to validated trust and high-ticket action.
        </p>
      </div>

      {/* Mental Model Callout */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
        <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
          <Sparkles className="w-4 h-4" />
          VISITOR JOURNEY:
        </span>
        <span className="text-slate-400 text-right">
          UNDERSTANDS YOU → SEES WORK → EVALUATES PROOF → BUILDS TRUST → CONVERTS
        </span>
      </div>

      {/* Reorderable Section Stack */}
      <div className="space-y-3">
        {portfolioStructure.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              !sec.isEnabled
                ? 'bg-slate-950/40 border-slate-900 opacity-60'
                : sec.status === 'accepted'
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : sec.status === 'adjusted'
                ? 'bg-amber-950/20 border-amber-500/40'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-950 text-indigo-300 font-mono text-xs font-bold border border-indigo-800/40">
                  0{sec.position}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-200">{sec.sectionTitle}</h4>
                    <span className="text-[10px] font-mono uppercase bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                      {sec.structuralRole}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{sec.conversionRationale}</p>

                  <div className="pt-2 text-[11px] font-mono text-slate-500 flex items-center gap-2">
                    <span className="text-indigo-400 font-semibold">Visitor Mindset:</span>
                    <span>"{sec.visitorMindset}"</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                {sec.status !== 'accepted' && (
                  <button
                    onClick={() => acceptBlueprintRecommendation('portfolioStructure', sec.id)}
                    className="p-1.5 rounded-lg bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40 border border-emerald-800/40 text-xs font-mono flex items-center gap-1"
                    title="Accept recommendation"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Accept
                  </button>
                )}

                <button
                  onClick={() => toggleBlueprintPortfolioSection(sec.id)}
                  className={`p-1.5 rounded-lg border text-xs ${
                    sec.isEnabled
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      : 'bg-rose-950/40 text-rose-300 border-rose-800/40 hover:bg-rose-900/40'
                  }`}
                  title={sec.isEnabled ? 'Hide section' : 'Enable section'}
                >
                  {sec.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <div className="flex flex-col gap-0.5">
                  <button
                    disabled={idx === 0}
                    onClick={() => reorderBlueprintPortfolioSection(idx, idx - 1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800"
                    title="Move section up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={idx === portfolioStructure.length - 1}
                    onClick={() => reorderBlueprintPortfolioSection(idx, idx + 1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800"
                    title="Move section down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
