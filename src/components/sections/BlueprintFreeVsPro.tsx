import React from 'react';
import { Check, X, ArrowRight, Download } from 'lucide-react';
import { formatCurrency } from '../../lib/format';
import type { Product } from '../../types';

interface Props {
  product: Product;
  isOwned: boolean;
  isCheckingOut: boolean;
  isDownloading: boolean;
  onFreeDownload: () => void;
  onPremiumUpgrade: () => void;
}

const FREE_FEATURES = [
  'Overview of the Blueprint',
  'Core Concepts',
  'Basic Action Steps',
  'Limited Resources',
];

const PRO_FEATURES = [
  'Complete Blueprint',
  'Detailed Implementation System',
  'Templates',
  'AI Prompts',
  'Checklists',
  'Resources & Tools',
  'Future Updates',
];

const COMPARISON_ROWS = [
  { feature: 'Overview', free: true, pro: true },
  { feature: 'Core Framework', free: true, pro: true },
  { feature: 'Implementation Guide', free: false, pro: true },
  { feature: 'Templates', free: false, pro: true },
  { feature: 'AI Prompts', free: false, pro: true },
  { feature: 'Checklists', free: false, pro: true },
  { feature: 'Resources', free: 'Limited' as const, pro: 'Full' as const },
  { feature: 'Updates', free: false, pro: true },
];

export const BlueprintFreeVsPro = ({
  product, isOwned, isCheckingOut, isDownloading,
  onFreeDownload, onPremiumUpgrade,
}: Props) => {
  const hasFree = product.type === 'free' || product.freeFileUrl;
  const isTargetBlueprint = product.slug === 'get-your-first-3-clients';

  if (!hasFree) return null;

  return (
    <section>
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-sm font-semibold text-[#0b1c30] mb-2">Choose Your Starting Point</h2>
        <p className="text-[13px] text-[#424754]/50 max-w-md mx-auto">
          Start free and upgrade only when you're ready to implement the complete system.
        </p>
      </div>

      {/* Two Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {/* Free Card */}
        <div className="rounded-2xl border border-[#c2c6d6]/15 p-6 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#f0f1f3] text-[11px] font-semibold text-[#424754]">
              Free
            </span>
          </div>

          <p className="text-[13px] text-[#424754]/60 mb-5">
            Perfect for exploring the framework before committing.
          </p>

          <ul className="space-y-2.5 mb-6">
            {FREE_FEATURES.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-[13px] text-[#0b1c30]">
                <Check size={14} className="text-[#0058be] shrink-0" />
                {feat}
              </li>
            ))}
          </ul>

          <button
            onClick={onFreeDownload}
            disabled={isDownloading}
            className="w-full py-2.5 rounded-xl border border-[#c2c6d6]/25 text-[#0b1c30] text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#f8f9ff] transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-[#0058be]/25 border-t-[#0058be] rounded-full animate-spin" />
            ) : (
              <>{isTargetBlueprint ? 'Launch Blueprint' : 'Get Free Blueprint'} {isTargetBlueprint ? <ArrowRight size={13} /> : <Download size={13} />}</>
            )}
          </button>
        </div>

        {/* Pro Card */}
        <div className="rounded-2xl border-2 border-[#0b1c30] p-6 bg-white relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#0b1c30] text-[11px] font-semibold text-white">
              Pro
            </span>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#fff8e1] border border-[#ffe082] text-[11px] font-semibold text-[#f57f17]">
              Most Popular
            </span>
          </div>

          <p className="text-[13px] text-[#424754]/60 mb-5">
            Everything needed to implement the system from start to finish.
          </p>

          <ul className="space-y-2.5 mb-6">
            {PRO_FEATURES.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-[13px] text-[#0b1c30]">
                <Check size={14} className="text-[#0b1c30] shrink-0" />
                {feat}
              </li>
            ))}
          </ul>

          {isOwned ? (
            <a
              href="/vault"
              className="w-full py-2.5 rounded-xl bg-[#d1f34d] text-[#0b1c30] text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#c0e045] transition-colors"
            >
              Open in Vault <ArrowRight size={13} />
            </a>
          ) : (
            <button
              onClick={onPremiumUpgrade}
              disabled={isCheckingOut}
              className="w-full py-2.5 rounded-xl bg-[#0b1c30] text-white text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#0058be] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isCheckingOut ? (
                <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
              ) : (
                <>{isTargetBlueprint ? 'Launch Blueprint' : 'Unlock Pro'} <ArrowRight size={13} /></>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="rounded-2xl border border-[#c2c6d6]/15 overflow-hidden bg-white mb-8">
        {/* Table Header */}
        <div className="flex items-center px-5 py-3 border-b border-[#c2c6d6]/10">
          <span className="flex-1 text-[11px] font-semibold text-[#424754]/40 uppercase tracking-wider">Feature</span>
          <span className="w-20 text-center text-[11px] font-semibold text-[#424754]/40 uppercase tracking-wider">Free</span>
          <span className="w-20 text-center text-[11px] font-semibold text-[#424754]/40 uppercase tracking-wider">Pro</span>
        </div>

        {COMPARISON_ROWS.map((row, idx) => (
          <div
            key={idx}
            className={`flex items-center px-5 py-3 ${idx < COMPARISON_ROWS.length - 1 ? 'border-b border-[#c2c6d6]/8' : ''}`}
          >
            <span className="flex-1 text-[13px] text-[#0b1c30]">{row.feature}</span>
            <span className="w-20 text-center">
              {typeof row.free === 'boolean' ? (
                row.free ? <Check size={14} className="text-[#0058be] mx-auto" /> : <X size={14} className="text-[#c2c6d6]/40 mx-auto" />
              ) : (
                <span className="text-[12px] text-[#424754]/50">{row.free}</span>
              )}
            </span>
            <span className="w-20 text-center">
              {typeof row.pro === 'boolean' ? (
                row.pro ? <Check size={14} className="text-[#0b1c30] mx-auto" /> : <X size={14} className="text-[#c2c6d6]/40 mx-auto" />
              ) : (
                <span className="text-[12px] font-medium text-[#0b1c30]">{row.pro}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Upgrade Message */}
      <p className="text-center text-[13px] text-[#424754]/40 max-w-lg mx-auto">
        Most users start with the free version and upgrade to Pro when they are ready to execute the full system.
      </p>
    </section>
  );
};
