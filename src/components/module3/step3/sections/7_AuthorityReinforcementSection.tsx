import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import type { ProfilePortfolioAuthorityBlueprint } from '../../../../types/module3-step3-authority';

interface AuthorityReinforcementSectionProps {
  blueprint: ProfilePortfolioAuthorityBlueprint;
}

export const AuthorityReinforcementSection: React.FC<AuthorityReinforcementSectionProps> = ({ blueprint }) => {
  const { alignmentAudit } = blueprint;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-[#0058be] font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
          <Activity className="w-4 h-4 text-[#0058be]" />
          Section 7 — System Alignment Diagnostic
        </div>
        <h3 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Authority Reinforcement & Diagnostic Audit</h3>
        <p className="text-sm text-[#424754] mt-1 max-w-2xl leading-relaxed">
          Verifies whether your Authority Position, Profile, Portfolio, Work, and Proof all reinforce the exact same core perception without contradictory signals.
        </p>
      </div>

      {/* Visual Alignment Score Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-[#0b1c30]">System Alignment Verdict</h4>
            <span
              className={`text-xs font-mono font-bold px-3 py-0.5 rounded-full border ${
                alignmentAudit.alignmentScore >= 80
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {alignmentAudit.alignmentScore}% Score
            </span>
          </div>
          <p className="text-xs text-[#424754] font-sans">{alignmentAudit.overallVerdict}</p>
        </div>

        {/* System Alignment Chain */}
        <div className="text-[11px] font-mono text-[#0b1c30] bg-[#f8f9ff] p-3 rounded-xl border border-slate-200/80 whitespace-nowrap">
          <span className="text-[#0058be] font-bold">CHAIN:</span> POSITION → PROFILE → PORTFOLIO → PROOF → PERCEPTION
        </div>
      </div>

      {/* Diagnostic Issues List */}
      <div className="space-y-3">
        {alignmentAudit.diagnostics.map((diag) => (
          <div
            key={diag.id}
            className={`p-5 rounded-2xl border transition-all ${
              diag.severity === 'warning'
                ? 'bg-amber-50/60 border-amber-200 shadow-xs'
                : diag.severity === 'critical'
                ? 'bg-rose-50/60 border-rose-200 shadow-xs'
                : 'bg-emerald-50/60 border-emerald-200 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                {diag.severity === 'warning' || diag.severity === 'critical' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <h4 className="text-base font-bold text-[#0b1c30]">{diag.title}</h4>
              </div>

              <span className="text-[10px] font-mono uppercase bg-white text-[#0b1c30] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                {diag.impactedSection}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-200/80 font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">POSITIONING CLAIM</span>
                  <span className="text-[#0b1c30] font-semibold">{diag.positioningClaim}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">ACTUAL EVIDENCE / WORK</span>
                  <span className="text-[#0b1c30] font-semibold">{diag.actualEvidenceOrWork}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#eff4ff]/80 border border-[#0058be]/20 text-[#0058be] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#0058be] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0b1c30]">Strategic Advisor Recommendation:</strong> {diag.recommendation}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
