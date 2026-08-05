import React from 'react';
import { ShieldAlert, ArrowRight, Award, AlertTriangle } from 'lucide-react';
import type { ProfilePortfolioAuthorityBlueprint } from '../../../../types/module3-step3-authority';

interface EvidencePlacementSectionProps {
  blueprint: ProfilePortfolioAuthorityBlueprint;
}

export const EvidencePlacementSection: React.FC<EvidencePlacementSectionProps> = ({ blueprint }) => {
  const { evidencePlacements } = blueprint;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-[#0058be] font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
          <ShieldAlert className="w-4 h-4 text-[#0058be]" />
          Section 5 — Contextual Evidence Strategy
        </div>
        <h3 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Evidence Placement & Claim Validation</h3>
        <p className="text-sm text-[#424754] mt-1 max-w-2xl leading-relaxed">
          Connect your authority claims to specific proof assets from Step 2 so evidence appears precisely where it satisfies visitor skepticism.
        </p>
      </div>

      {/* Placements List */}
      <div className="space-y-4">
        {evidencePlacements.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-xs">
            {/* Header: Claim & Strength Badge */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#0058be] font-bold block mb-0.5">AUTHORITY CLAIM</span>
                <h4 className="text-base font-bold text-[#0b1c30]">"{item.claim}"</h4>
              </div>

              <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-[#0058be]/10 text-[#0058be] border border-[#0058be]/20">
                Strength: {item.proofStrength.replace('_', ' ')}
              </span>
            </div>

            {/* Visual Placement Pipeline */}
            <div className="p-3.5 rounded-xl bg-[#f8f9ff] border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">SUPPORTING PROOF ASSET</span>
                <div className="text-[#0b1c30] font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#0058be]" />
                  {item.proofTitle}
                </div>
              </div>

              <div className="hidden md:flex items-center justify-center text-[#0058be]/40">
                <ArrowRight className="w-5 h-5 text-[#0058be]" />
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">RECOMMENDED PLACEMENT</span>
                <div className="text-emerald-700 font-bold">
                  {item.recommendedPlacement} ({item.visibilityLevel} Visibility)
                </div>
              </div>
            </div>

            {/* Why it supports claim */}
            <p className="text-xs text-[#424754] leading-relaxed font-sans bg-[#f8f9ff] p-3 rounded-xl border border-slate-200/80 font-medium">
              <strong className="text-[#0b1c30]">Why It Supports Claim:</strong> {item.whyItSupportsClaim}
            </p>

            {/* Warning if proof is weak */}
            {item.actionIfWeak && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Weak Signal Warning:</strong> {item.actionIfWeak}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
