import React from 'react';
import { motion } from 'motion/react';
import { Check, X, Download, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
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

export const BlueprintFreeVsPremium = ({
  product, isOwned, isCheckingOut, isDownloading,
  onFreeDownload, onPremiumUpgrade,
}: Props) => {
  const freeFeatures = product.comparisonFree?.length ? product.comparisonFree : null;
  const premiumFeatures = product.comparisonPremium?.length ? product.comparisonPremium : null;

  if (!freeFeatures && !premiumFeatures) return null;

  const allFeatures = [
    ...new Set([
      ...(freeFeatures || []),
      ...(premiumFeatures || []),
    ]),
  ];

  const isFreeInFree = (f: string) => freeFeatures?.includes(f);

  return (
    <section>
      <div className="max-w-3xl mb-14">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#424754]/60 mb-4">Choose Your Path</h2>
        <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#0b1c30] leading-[1.05]">
          Free vs Premium
        </h3>
        <p className="text-base text-[#424754] font-semibold mt-4 max-w-xl">
          Start with the free version to explore the framework. Upgrade to premium for the complete implementation system.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Free Version Card */}
        <div className="bg-white border border-[#c2c6d6]/30 rounded-[32px] overflow-hidden shadow-sm">
          <div className="p-1.5 bg-bg-secondary border-b border-[#c2c6d6]/20">
            <div className="px-6 py-4">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-1">Free Version</h4>
              <p className="text-[13px] text-[#424754] font-semibold">Good for beginners exploring the framework</p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="text-2xl font-extrabold text-[#0b1c30] mb-6">Free</div>

            <p className="text-[11px] text-[#424754]/60 font-semibold mb-5">Contains:</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2.5 text-xs text-[#424754] font-semibold">
                <Check size={14} className="text-[#0058be] shrink-0 mt-0.5" />
                Overview & framework
              </li>
              <li className="flex items-start gap-2.5 text-xs text-[#424754] font-semibold">
                <Check size={14} className="text-[#0058be] shrink-0 mt-0.5" />
                Basic implementation steps
              </li>
              <li className="flex items-start gap-2.5 text-xs text-[#424754] font-semibold">
                <Check size={14} className="text-[#0058be] shrink-0 mt-0.5" />
                Limited prompts & examples
              </li>
            </ul>

            <button
              onClick={onFreeDownload}
              disabled={isDownloading}
              className="w-full py-3.5 rounded-full bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#dce9ff] text-[#0058be] transition-all font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-[#0058be]/25 border-t-[#0058be] rounded-full animate-spin" />
              ) : (
                <><Download size={14} /> Download Free Version</>
              )}
            </button>
          </div>
        </div>

        {/* Premium Version Card */}
        <div className="bg-white border-2 border-[#0b1c30] rounded-[32px] overflow-hidden shadow-sm relative">
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#d1f34d] text-[#0b1c30] text-[8px] font-bold uppercase tracking-wider shadow-sm">
            Best Value
          </div>

          <div className="p-6 sm:p-8">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-1">Premium Version</h4>
            <p className="text-[13px] text-[#424754] font-semibold mb-4">Complete implementation system</p>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-extrabold text-[#0b1c30]">
                {formatCurrency(product.salePrice || product.basePrice)}
              </span>
              {product.basePrice > (product.salePrice || 0) && (
                <span className="text-sm text-[#424754]/50 line-through font-semibold">
                  {formatCurrency(product.basePrice)}
                </span>
              )}
            </div>

            <p className="text-[11px] text-[#424754]/60 font-semibold mb-5">Contains:</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2.5 text-xs text-[#0b1c30] font-extrabold">
                <Zap size={14} className="text-black fill-[#d1f34d] shrink-0 mt-0.5" />
                Full workflow & implementation system
              </li>
              <li className="flex items-start gap-2.5 text-xs text-[#0b1c30] font-extrabold">
                <Zap size={14} className="text-black fill-[#d1f34d] shrink-0 mt-0.5" />
                Complete prompt library
              </li>
              <li className="flex items-start gap-2.5 text-xs text-[#0b1c30] font-extrabold">
                <Zap size={14} className="text-black fill-[#d1f34d] shrink-0 mt-0.5" />
                Ready-to-use templates & examples
              </li>
              <li className="flex items-start gap-2.5 text-xs text-[#0b1c30] font-extrabold">
                <Zap size={14} className="text-black fill-[#d1f34d] shrink-0 mt-0.5" />
                Checklists & implementation guides
              </li>
              <li className="flex items-start gap-2.5 text-xs text-[#0b1c30] font-extrabold">
                <Zap size={14} className="text-black fill-[#d1f34d] shrink-0 mt-0.5" />
                Lifetime updates & community access
              </li>
            </ul>

            {isOwned ? (
              <a
                href="/vault"
                className="w-full py-3.5 rounded-full bg-[#d1f34d] hover:bg-[#c0e045] text-black transition-all font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <ShieldCheck size={14} /> Open in Vault <ArrowRight size={14} />
              </a>
            ) : (
              <button
                onClick={onPremiumUpgrade}
                disabled={isCheckingOut}
                className="w-full py-3.5 rounded-full bg-[#0b1c30] hover:bg-[#0058be] text-white transition-all font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Unlock Premium <ArrowRight size={14} /></>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Feature Comparison Table */}
      {allFeatures.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 bg-white border border-[#c2c6d6]/25 rounded-[24px] overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#c2c6d6]/15">
                  <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-wider text-[#424754]/50">Feature</th>
                  <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-wider text-[#424754]/50 text-center">Free</th>
                  <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-wider text-[#424754]/50 text-center">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c2c6d6]/10">
                {allFeatures.map((feature, idx) => {
                  const inFree = isFreeInFree(feature);
                  return (
                    <tr key={idx} className="hover:bg-[#f8f9ff] transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-[#0b1c30]">{feature}</td>
                      <td className="px-6 py-4 text-center">
                        {inFree ? (
                          <Check size={16} className="text-[#0058be] mx-auto" />
                        ) : (
                          <X size={16} className="text-[#c2c6d6]/40 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Check size={16} className="text-[#0b1c30] mx-auto" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </section>
  );
};
