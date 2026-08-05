import React, { useState } from 'react';
import { FileText, Copy, Check, ShieldCheck, Sparkles, Award, ExternalLink } from 'lucide-react';
import type { ProfilePortfolioAuthorityBlueprint } from '../../../../types/module3-step3-authority';

interface MasterBlueprintViewerProps {
  blueprint: ProfilePortfolioAuthorityBlueprint;
}

export const MasterBlueprintViewer: React.FC<MasterBlueprintViewerProps> = ({ blueprint }) => {
  const [copied, setCopied] = useState(false);
  const { decisionSummary, profilePositioning, portfolioStructure, evidencePlacements, alignmentAudit } = blueprint;

  const handleCopyMarkdown = () => {
    const markdown = `# PROFILE & PORTFOLIO AUTHORITY BLUEPRINT

## EXECUTIVE DECISION SUMMARY
- **Positioning Claim:** ${decisionSummary.positioningClaim}
- **Primary Category:** ${decisionSummary.primaryCategory}
- **Strongest Proof Anchor:** ${decisionSummary.strongestProofAnchor}
- **Primary Profile Focus:** ${decisionSummary.primaryProfileFocus}
- **Top Portfolio Priorities:** ${decisionSummary.topPortfolioPriorities.join(', ')}
- **Key Evidence Placement:** ${decisionSummary.keyEvidencePlacement}
- **Alignment Health:** ${decisionSummary.alignmentHealth}

---

## 1. PROFILE POSITIONING HIERARCHY
${profilePositioning.map((l) => `### ${l.layerTitle}\n- **Perception Target:** ${l.perceptionTarget}\n- **Focus:** ${l.userCustomization || l.recommendedFocus}\n- **Status:** ${l.status}`).join('\n\n')}

---

## 2. PORTFOLIO STRUCTURE & JOURNEY
${portfolioStructure.filter((s) => s.isEnabled).map((s) => `### Position 0${s.position}: ${s.sectionTitle}\n- **Role:** ${s.structuralRole}\n- **Rationale:** ${s.conversionRationale}\n- **Visitor Mindset:** "${s.visitorMindset}"`).join('\n\n')}

---

## 3. EVIDENCE PLACEMENT STRATEGY
${evidencePlacements.map((e) => `### Claim: "${e.claim}"\n- **Proof Asset:** ${e.proofTitle} (Strength: ${e.proofStrength})\n- **Recommended Placement:** ${e.recommendedPlacement}\n- **Why It Supports Claim:** ${e.whyItSupportsClaim}`).join('\n\n')}

---

## 4. ALIGNMENT DIAGNOSTIC VERDICT
- **Score:** ${alignmentAudit.alignmentScore}%
- **Verdict:** ${alignmentAudit.overallVerdict}
`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4 text-indigo-400" />
            Master Output Document
          </div>
          <h3 className="text-xl font-bold text-slate-100">Profile & Portfolio Authority Blueprint</h3>
        </div>

        <button
          onClick={handleCopyMarkdown}
          className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0 font-mono"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied to Clipboard!' : 'Export Blueprint Markdown'}
        </button>
      </div>

      {/* Decision Summary Banner at the Top */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          EXECUTIVE DECISION SUMMARY
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850">
            <span className="text-slate-500 text-[10px] uppercase block">POSITIONING CLAIM</span>
            <span className="text-slate-200 font-semibold">{decisionSummary.positioningClaim}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850">
            <span className="text-slate-500 text-[10px] uppercase block">STRONGEST PROOF ANCHOR</span>
            <span className="text-emerald-400 font-semibold">{decisionSummary.strongestProofAnchor}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850">
            <span className="text-slate-500 text-[10px] uppercase block">ALIGNMENT HEALTH</span>
            <span className="text-indigo-300 font-semibold">{decisionSummary.alignmentHealth}</span>
          </div>
        </div>
      </div>

      {/* 8 Core Strategic Answers Breakdown */}
      <div className="space-y-4 text-xs font-mono">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-2">
          <h4 className="text-slate-300 font-semibold text-sm font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            1. What should my profile communicate?
          </h4>
          <p className="text-slate-400 leading-relaxed font-sans">{profilePositioning[0]?.recommendedFocus}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-2">
          <h4 className="text-slate-300 font-semibold text-sm font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            2. What should my portfolio contain & what comes first?
          </h4>
          <div className="flex flex-wrap gap-2 pt-1">
            {portfolioStructure
              .filter((s) => s.isEnabled)
              .map((s) => (
                <span key={s.id} className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-800 text-[11px]">
                  0{s.position}. {s.sectionTitle.split('.')[1] || s.sectionTitle}
                </span>
              ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-2">
          <h4 className="text-slate-300 font-semibold text-sm font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            3. Which proof supports which claim and where should it appear?
          </h4>
          <div className="space-y-1.5 pt-1">
            {evidencePlacements.map((e) => (
              <div key={e.id} className="text-[11px] text-slate-300 flex items-center justify-between">
                <span>"{e.claim}"</span>
                <span className="text-emerald-400">→ {e.recommendedPlacement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
