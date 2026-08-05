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
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4 text-indigo-400" />
          Section 5 — Contextual Evidence Strategy
        </div>
        <h3 className="text-xl font-bold text-slate-100">Evidence Placement & Claim Validation</h3>
        <p className="text-sm text-slate-400 mt-1">
          Connect your authority claims to specific proof assets from Step 2 so evidence appears precisely where it satisfies visitor skepticism.
        </p>
      </div>

      {/* Placements List */}
      <div className="space-y-4">
        {evidencePlacements.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            {/* Header: Claim & Strength Badge */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold block mb-0.5">AUTHORITY CLAIM</span>
                <h4 className="text-sm font-semibold text-slate-200">"{item.claim}"</h4>
              </div>

              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                Strength: {item.proofStrength.replace('_', ' ')}
              </span>
            </div>

            {/* Visual Placement Pipeline */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block mb-1">SUPPORTING PROOF ASSET</span>
                <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                  {item.proofTitle}
                </div>
              </div>

              <div className="hidden md:flex items-center justify-center text-slate-600">
                <ArrowRight className="w-4 h-4 text-indigo-500/60" />
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase block mb-1">RECOMMENDED PLACEMENT</span>
                <div className="text-emerald-400 font-semibold">
                  {item.recommendedPlacement} ({item.visibilityLevel} Visibility)
                </div>
              </div>
            </div>

            {/* Why it supports claim */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
              <strong className="text-slate-200">Why It Supports Claim:</strong> {item.whyItSupportsClaim}
            </p>

            {/* Warning if proof is weak */}
            {item.actionIfWeak && (
              <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
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
