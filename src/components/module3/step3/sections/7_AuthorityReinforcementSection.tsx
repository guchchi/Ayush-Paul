import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
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
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-1">
          <Activity className="w-4 h-4 text-indigo-400" />
          Section 7 — System Alignment Diagnostic
        </div>
        <h3 className="text-xl font-bold text-slate-100">Authority Reinforcement & Diagnostic Audit</h3>
        <p className="text-sm text-slate-400 mt-1">
          Verifies whether your Authority Position, Profile, Portfolio, Work, and Proof all reinforce the exact same core perception without contradictory signals.
        </p>
      </div>

      {/* Visual Alignment Score Card */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-200">System Alignment Verdict</h4>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                alignmentAudit.alignmentScore >= 80
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              {alignmentAudit.alignmentScore}% Score
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans">{alignmentAudit.overallVerdict}</p>
        </div>

        {/* System Alignment Chain */}
        <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-850 whitespace-nowrap">
          <span className="text-indigo-400 font-semibold">CHAIN:</span> POSITION → PROFILE → PORTFOLIO → PROOF → PERCEPTION
        </div>
      </div>

      {/* Diagnostic Issues List */}
      <div className="space-y-3">
        {alignmentAudit.diagnostics.map((diag) => (
          <div
            key={diag.id}
            className={`p-4 rounded-xl border ${
              diag.severity === 'warning'
                ? 'bg-amber-950/20 border-amber-500/40'
                : diag.severity === 'critical'
                ? 'bg-rose-950/20 border-rose-500/40'
                : 'bg-emerald-950/20 border-emerald-500/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                {diag.severity === 'warning' || diag.severity === 'critical' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <h4 className="text-sm font-semibold text-slate-200">{diag.title}</h4>
              </div>

              <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                {diag.impactedSection}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">POSITIONING CLAIM</span>
                  <span className="text-slate-300">{diag.positioningClaim}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">ACTUAL EVIDENCE / WORK</span>
                  <span className="text-slate-300">{diag.actualEvidenceOrWork}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-900/40 text-indigo-300 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-300">Strategic Advisor Recommendation:</strong> {diag.recommendation}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
