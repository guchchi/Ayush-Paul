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
        <div className="flex items-center gap-2 text-[#0058be] font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
          <LayoutGrid className="w-4 h-4 text-[#0058be]" />
          Section 3 — Guided Credibility Journey
        </div>
        <h3 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Portfolio Structure & Information Flow</h3>
        <p className="text-sm text-[#424754] mt-1 max-w-2xl leading-relaxed">
          Your portfolio is a guided credibility journey designed to lead visitors from initial interest to validated trust and high-ticket action.
        </p>
      </div>

      {/* Mental Model Callout */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-[#0b1c30] gap-2 shadow-xs">
        <span className="flex items-center gap-1.5 text-[#0058be] font-bold tracking-wide uppercase">
          <Sparkles className="w-4 h-4" />
          VISITOR JOURNEY:
        </span>
        <span className="text-[#424754] font-semibold text-right">
          UNDERSTANDS YOU → SEES WORK → EVALUATES PROOF → BUILDS TRUST → CONVERTS
        </span>
      </div>

      {/* Reorderable Section Stack */}
      <div className="space-y-3">
        {portfolioStructure.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-4 rounded-2xl border transition-all duration-200 ${
              !sec.isEnabled
                ? 'bg-slate-50 border-slate-200 opacity-60'
                : sec.status === 'accepted'
                ? 'bg-emerald-50/60 border-emerald-200 shadow-xs'
                : sec.status === 'adjusted'
                ? 'bg-amber-50/60 border-amber-200 shadow-xs'
                : 'bg-white border-slate-200/80 hover:border-[#0058be]/30 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#0058be]/10 text-[#0058be] font-mono text-xs font-bold border border-[#0058be]/20 shrink-0">
                  0{sec.position}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-[#0b1c30]">{sec.sectionTitle}</h4>
                    <span className="text-[10px] font-mono uppercase bg-[#f8f9ff] text-[#0058be] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                      {sec.structuralRole}
                    </span>
                  </div>

                  <p className="text-xs text-[#424754] leading-relaxed font-sans">{sec.conversionRationale}</p>

                  <div className="pt-1.5 text-[11px] font-mono text-slate-500 flex items-center gap-2">
                    <span className="text-[#0058be] font-bold">Visitor Mindset:</span>
                    <span>"{sec.visitorMindset}"</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 shrink-0">
                {sec.status !== 'accepted' && (
                  <button
                    onClick={() => acceptBlueprintRecommendation('portfolioStructure', sec.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                    title="Accept recommendation"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Accept
                  </button>
                )}

                <button
                  onClick={() => toggleBlueprintPortfolioSection(sec.id)}
                  className={`p-1.5 rounded-xl border text-xs cursor-pointer ${
                    sec.isEnabled
                      ? 'bg-slate-100 text-[#0b1c30] border-slate-200 hover:bg-slate-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  }`}
                  title={sec.isEnabled ? 'Hide section' : 'Enable section'}
                >
                  {sec.isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <div className="flex flex-col gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => reorderBlueprintPortfolioSection(idx, idx - 1)}
                    className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[#0b1c30] disabled:opacity-30 cursor-pointer border border-slate-200"
                    title="Move section up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={idx === portfolioStructure.length - 1}
                    onClick={() => reorderBlueprintPortfolioSection(idx, idx + 1)}
                    className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[#0b1c30] disabled:opacity-30 cursor-pointer border border-slate-200"
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
