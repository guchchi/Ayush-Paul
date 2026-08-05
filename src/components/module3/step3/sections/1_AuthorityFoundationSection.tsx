import React from 'react';
import { ShieldCheck, Layers, ArrowRight, Award, FileSpreadsheet } from 'lucide-react';
import type { ProfilePortfolioAuthorityBlueprint } from '../../../../types/module3-step3-authority';

interface AuthorityFoundationSectionProps {
  blueprint: ProfilePortfolioAuthorityBlueprint;
}

export const AuthorityFoundationSection: React.FC<AuthorityFoundationSectionProps> = ({ blueprint }) => {
  const { foundation } = blueprint;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Section 1 — Strategic Foundation
        </div>
        <h3 className="text-xl font-bold text-slate-100">Authority Foundation</h3>
        <p className="text-sm text-slate-400 mt-1">
          Your profile and portfolio structure is a direct continuation of your Step 1 Authority Position and Step 2 Proof Strategy.
        </p>
      </div>

      {/* Visual Pipeline Connector */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
          SYSTEM CONTINUITY LOGIC
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-lg bg-slate-950 border border-indigo-500/30 flex flex-col items-center justify-center">
            <Award className="w-5 h-5 text-indigo-400 mb-1" />
            <div className="text-xs font-semibold text-slate-200">1. Authority Position</div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">{foundation.authorityPosition}</div>
            <span className="mt-2 text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">✓ Established</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-600">
            <ArrowRight className="w-5 h-5 text-indigo-500/60 animate-pulse" />
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-indigo-500/30 flex flex-col items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400 mb-1" />
            <div className="text-xs font-semibold text-slate-200">2. Proof Strategy</div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">{foundation.equippedProofCount} Proof Assets</div>
            <span className="mt-2 text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">✓ Equipped</span>
          </div>
        </div>
      </div>

      {/* Decision Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 Position Card */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-indigo-300 uppercase tracking-wide">From Step 1</span>
            <span className="text-xs font-mono text-emerald-400">Position Verified</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-200">{foundation.authorityPosition} Specialist</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
            "{foundation.trustPromise}"
          </p>
        </div>

        {/* Step 2 Proof Strategy Card */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-indigo-300 uppercase tracking-wide">From Step 2</span>
            <span className="text-xs font-mono text-emerald-400">{foundation.equippedProofCount} Assets Ready</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-200">Strongest Proof Signal</h4>
          <p className="text-xs text-slate-300 font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 flex items-center justify-between">
            <span>{foundation.strongestProofSignal}</span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">Primary Anchor</span>
          </p>
        </div>
      </div>
    </div>
  );
};
