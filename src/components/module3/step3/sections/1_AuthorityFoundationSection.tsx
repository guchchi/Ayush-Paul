import React from 'react';
import { ShieldCheck, ArrowRight, Award, FileSpreadsheet } from 'lucide-react';
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
        <div className="flex items-center gap-2 text-[#0058be] font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#0058be]" />
          Section 1 — Strategic Foundation
        </div>
        <h3 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Authority Foundation</h3>
        <p className="text-sm text-[#424754] mt-1 max-w-2xl leading-relaxed">
          Your profile and portfolio structure is a direct continuation of your Step 1 Authority Position and Step 2 Proof Strategy.
        </p>
      </div>

      {/* Visual Pipeline Connector */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-3">
          SYSTEM CONTINUITY LOGIC
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#0058be]/20 flex flex-col items-center justify-center">
            <Award className="w-6 h-6 text-[#0058be] mb-1.5" />
            <div className="text-xs font-bold text-[#0b1c30]">1. Authority Position</div>
            <div className="text-[11px] text-[#424754] mt-0.5 font-mono">{foundation.authorityPosition}</div>
            <span className="mt-2 text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2.5 py-0.5 rounded-full font-bold border border-emerald-300">
              ✓ Established
            </span>
          </div>

          <div className="hidden md:flex items-center justify-center text-[#0058be]/40">
            <ArrowRight className="w-6 h-6 text-[#0058be]" />
          </div>

          <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#0058be]/20 flex flex-col items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-[#0058be] mb-1.5" />
            <div className="text-xs font-bold text-[#0b1c30]">2. Proof Strategy</div>
            <div className="text-[11px] text-[#424754] mt-0.5 font-mono">{foundation.equippedProofCount} Proof Assets</div>
            <span className="mt-2 text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2.5 py-0.5 rounded-full font-bold border border-emerald-300">
              ✓ Equipped
            </span>
          </div>
        </div>
      </div>

      {/* Decision Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 Position Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#0058be] uppercase tracking-wide font-semibold">From Step 1</span>
            <span className="text-xs font-mono text-emerald-700 font-bold">Position Verified</span>
          </div>
          <h4 className="text-base font-bold text-[#0b1c30]">{foundation.authorityPosition} Specialist</h4>
          <p className="text-xs text-[#424754] leading-relaxed bg-[#f8f9ff] p-3 rounded-xl border border-slate-200/80 font-medium">
            "{foundation.trustPromise}"
          </p>
        </div>

        {/* Step 2 Proof Strategy Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#0058be] uppercase tracking-wide font-semibold">From Step 2</span>
            <span className="text-xs font-mono text-emerald-700 font-bold">{foundation.equippedProofCount} Assets Ready</span>
          </div>
          <h4 className="text-base font-bold text-[#0b1c30]">Strongest Proof Signal</h4>
          <p className="text-xs text-[#0b1c30] font-mono bg-[#f8f9ff] p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <span className="font-semibold">{foundation.strongestProofSignal}</span>
            <span className="text-[10px] bg-[#0058be]/10 text-[#0058be] font-bold px-2 py-0.5 rounded-full border border-[#0058be]/20">
              Primary Anchor
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
