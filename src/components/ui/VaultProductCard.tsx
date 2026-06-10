import React from 'react';
import { Download } from 'lucide-react';
import { PricingBadge } from './PricingBadge';
import { MagneticButton } from './MagneticButton';
import type { Product } from '../../types';
import { resolveTier, TIERS } from '../../lib/pricing';

interface VaultProductCardProps {
  product: Product;
  profile: any;
  onDownload: (p: Product) => void;
}

export const VaultProductCard = ({ product, profile, onDownload }: VaultProductCardProps) => {
  const tier = resolveTier(product);
  const isFree = tier === 'free';

  return (
    <div className="p-6 rounded-[32px] bg-white border border-[#c2c6d6]/30 flex flex-col group hover:border-[#d1f34d] hover:shadow-ambient hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300 shadow-sm">
      <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden mb-5 relative bg-bg-secondary border border-[#c2c6d6]/10">
        <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover transition-opacity duration-300" />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <PricingBadge product={product} size="sm" showPrice />
      </div>
      <h3 className="text-base font-extrabold text-[#0b1c30] mb-1.5 line-clamp-1">{product.title}</h3>
      <p className="text-xs text-[#424754] mb-5 line-clamp-2 flex-1 leading-relaxed font-semibold">{product.description}</p>

      <MagneticButton className="w-full">
        <button
          onClick={() => onDownload(product)}
          className={`w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer h-11 ${
            isFree
              ? 'bg-[#f0fbe8] hover:bg-[#e1f7d2] text-[#558b2f]'
              : 'bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d]'
          }`}
        >
          <Download size={14} /> {isFree ? 'Download Free' : product.paidFileUrl ? 'Download Blueprint' : 'Access Files'}
        </button>
      </MagneticButton>
    </div>
  );
};