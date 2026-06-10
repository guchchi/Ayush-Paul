import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../lib/format';
import type { Product } from '../../types';

interface Props {
  product: Product;
  isOwned: boolean;
  isCheckingOut: boolean;
  isDownloading: boolean;
  onPremiumUpgrade: () => void;
  onFreeDownload: () => void;
}

export const BlueprintStickyMobileBar = ({
  product, isOwned, isCheckingOut, isDownloading,
  onPremiumUpgrade, onFreeDownload,
}: Props) => {
  const isFree = product.type === 'free' || product.freeFileUrl;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-[#c2c6d6]/15 lg:hidden">
      <div className="flex items-center justify-between px-5 py-3.5 max-w-lg mx-auto">
        <div>
          <p className="text-sm font-semibold text-[#0b1c30]">
            {isFree ? 'Free' : formatCurrency(product.salePrice || product.basePrice)}
          </p>
        </div>

        {isOwned ? (
          <a
            href="/vault"
            className="px-5 py-2.5 rounded-xl bg-[#d1f34d] text-[#0b1c30] font-semibold text-sm flex items-center gap-1.5"
          >
            <ShieldCheck size={14} /> Open in Vault
          </a>
        ) : isFree ? (
          <button
            onClick={onFreeDownload}
            disabled={isDownloading}
            className="px-5 py-2.5 rounded-xl bg-[#0b1c30] text-white font-semibold text-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
            ) : (
              <>Get Free <ArrowRight size={14} /></>
            )}
          </button>
        ) : (
          <button
            onClick={onPremiumUpgrade}
            disabled={isCheckingOut}
            className="px-5 py-2.5 rounded-xl bg-[#0b1c30] text-white font-semibold text-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isCheckingOut ? (
              <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
            ) : (
              <>Get Blueprint <ArrowRight size={14} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
