import React from 'react';
import { ShieldCheck, ArrowRight, Download, Check } from 'lucide-react';
import { formatCurrency } from '../../lib/format';
import type { Product } from '../../types';

interface Props {
  product: Product;
  isOwned: boolean;
  isCheckingOut: boolean;
  isDownloading: boolean;
  hasDiscount: boolean;
  onPremiumUpgrade: () => void;
  onFreeDownload: () => void;
}

const WHAT_YOU_GET = [
  'Full Blueprint',
  'Templates',
  'Prompts',
  'Resources',
  'Future Updates',
  'Lifetime Access',
];

export const BlueprintPurchaseSidebar = ({
  product, isOwned, isCheckingOut, isDownloading, hasDiscount,
  onPremiumUpgrade, onFreeDownload,
}: Props) => {
  const isFree = product.type === 'free' || product.freeFileUrl;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - (product.salePrice || product.basePrice)) / product.basePrice) * 100)
    : 0;

  return (
    <div className="hidden lg:block w-full">
      <div className="sticky top-24 space-y-5">
        {/* Cover Image */}
        <div className="rounded-2xl overflow-hidden border border-[#c2c6d6]/15">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full aspect-[4/3] object-cover"
          />
        </div>

        {/* Purchase Card */}
        <div className="bg-white border border-[#c2c6d6]/20 rounded-2xl p-6">
          {/* Price */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-bold tracking-tight text-[#0b1c30]">
              {isFree ? 'Free' : formatCurrency(product.salePrice || product.basePrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-[#424754]/40 line-through">
                {formatCurrency(product.basePrice)}
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {hasDiscount && discountPercent > 0 && (
            <span className="inline-block text-[11px] font-semibold text-emerald-600 mb-4">
              Save {discountPercent}%
            </span>
          )}
          {(!hasDiscount || discountPercent <= 0) && <div className="h-5" />}

          {/* Value Statement */}
          <p className="text-[13px] text-[#424754]/60 leading-relaxed mb-5">
            Everything you need to implement this blueprint from start to finish.
          </p>

          {/* What's Included */}
          <div className="mb-6">
            <p className="text-[11px] text-[#424754]/40 font-semibold uppercase tracking-wide mb-3">What's included</p>
            <ul className="space-y-2">
              {WHAT_YOU_GET.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-[13px] text-[#0b1c30]">
                  <Check size={14} className="text-[#0058be] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          {isOwned ? (
            <a
              href="/vault"
              className="w-full py-3 rounded-xl bg-[#d1f34d] hover:bg-[#c0e045] text-[#0b1c30] transition-colors font-semibold text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} /> Open in Vault <ArrowRight size={14} />
            </a>
          ) : isFree ? (
            <button
              onClick={onFreeDownload}
              disabled={isDownloading}
              className="w-full py-3 rounded-xl bg-[#0b1c30] hover:bg-[#0058be] text-white transition-colors font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
              ) : (
                <>Get Free Blueprint <ArrowRight size={14} /></>
              )}
            </button>
          ) : (
            <button
              onClick={onPremiumUpgrade}
              disabled={isCheckingOut}
              className="w-full py-3 rounded-xl bg-[#0b1c30] hover:bg-[#0058be] text-white transition-colors font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isCheckingOut ? (
                <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
              ) : (
                <>Get Blueprint <ArrowRight size={14} /></>
              )}
            </button>
          )}

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-[#424754]/40 font-medium">
            <span className="flex items-center gap-1"><ShieldCheck size={10} /> Secure Checkout</span>
            <span className="w-1 h-1 rounded-full bg-[#c2c6d6]/30" />
            <span className="flex items-center gap-1"><Download size={10} /> Instant Delivery</span>
          </div>
          <p className="text-center text-[10px] text-[#424754]/30 font-medium mt-1">Lifetime Ownership</p>
        </div>
      </div>
    </div>
  );
};
