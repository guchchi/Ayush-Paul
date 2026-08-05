import React, { useState } from 'react';
import { FileText, Copy, Check, ShieldCheck, Sparkles } from 'lucide-react';
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
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#0058be] font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
            <FileText className="w-4 h-4 text-[#0058be]" />
            Master Output Document
          </div>
          <h3 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Profile & Portfolio Authority Blueprint</h3>
        </div>

        <button
          onClick={handleCopyMarkdown}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-[#0058be] hover:bg-[#004395] text-white shadow-xs transition-colors shrink-0 font-mono cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied to Clipboard!' : 'Export Blueprint Markdown'}
        </button>
      </div>

      {/* Decision Summary Banner at the Top */}
      <div className="p-5 rounded-2xl bg-[#f8f9ff] border border-[#0058be]/20 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-[#0058be] font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#0058be]" />
          EXECUTIVE DECISION SUMMARY
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white border border-slate-200/80">
            <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">POSITIONING CLAIM</span>
            <span className="text-[#0b1c30] font-bold">{decisionSummary.positioningClaim}</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200/80">
            <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">STRONGEST PROOF ANCHOR</span>
            <span className="text-emerald-700 font-bold">{decisionSummary.strongestProofAnchor}</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200/80">
            <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">ALIGNMENT HEALTH</span>
            <span className="text-[#0058be] font-bold">{decisionSummary.alignmentHealth}</span>
          </div>
        </div>
      </div>

      {/* 8 Core Strategic Answers Breakdown */}
      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-xl bg-[#f8f9ff] border border-slate-200/80 space-y-2">
          <h4 className="text-[#0b1c30] font-bold text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0058be]" />
            1. What should my profile communicate?
          </h4>
          <p className="text-[#424754] leading-relaxed font-sans">{profilePositioning[0]?.recommendedFocus}</p>
        </div>

        <div className="p-4 rounded-xl bg-[#f8f9ff] border border-slate-200/80 space-y-2">
          <h4 className="text-[#0b1c30] font-bold text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0058be]" />
            2. What should my portfolio contain & what comes first?
          </h4>
          <div className="flex flex-wrap gap-2 pt-1 font-mono">
            {portfolioStructure
              .filter((s) => s.isEnabled)
              .map((s) => (
                <span key={s.id} className="bg-white text-[#0b1c30] font-semibold px-3 py-1 rounded-lg border border-slate-200 text-xs">
                  0{s.position}. {s.sectionTitle.split('.')[1] || s.sectionTitle}
                </span>
              ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#f8f9ff] border border-slate-200/80 space-y-2 font-mono">
          <h4 className="text-[#0b1c30] font-bold text-sm font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0058be]" />
            3. Which proof supports which claim and where should it appear?
          </h4>
          <div className="space-y-2 pt-1">
            {evidencePlacements.map((e) => (
              <div key={e.id} className="text-xs text-[#0b1c30] bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between font-medium">
                <span>"{e.claim}"</span>
                <span className="text-emerald-700 font-bold">→ {e.recommendedPlacement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
