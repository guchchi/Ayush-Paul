import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Play } from 'lucide-react';
import { PricingBadge } from './PricingBadge';
import { MagneticButton } from './MagneticButton';
import type { Product } from '../../types';
import { resolveTier } from '../../lib/pricing';
import { hasEngineContent } from '../../data/blueprint-engine-content';
import { cn } from '../../lib/utils';

interface VaultProductCardProps {
  product: Product;
  profile: any;
  onDownload: (p: Product) => void;
  engineProgress?: number;
}

export const VaultProductCard = ({ product, profile, onDownload, engineProgress }: VaultProductCardProps) => {
  const tier = resolveTier(product);
  const isFree = tier === 'free';
  const hasEngine = product.slug ? hasEngineContent(product.slug) : false;

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

      {engineProgress !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#424754]/50">Engine Progress</span>
            <span className="text-[9px] font-bold text-[#0058be]">{Math.round(engineProgress)}%</span>
          </div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0058be] rounded-full transition-all duration-500"
              style={{ width: `${Math.round(engineProgress)}%` }}
            />
          </div>
        </div>
      )}

      {hasEngine ? (
        <div className="flex flex-col gap-2">
          <MagneticButton className="w-full">
            <Link
              to={`/blueprints/${product.slug}/engine`}
              className={cn(
                'w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 h-11',
                'bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d]',
              )}
            >
              <Play size={12} className="fill-current" /> Launch Engine
            </Link>
          </MagneticButton>
          <button
            onClick={() => onDownload(product)}
            className="w-full py-2 rounded-full font-bold text-[9px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-transparent text-[#424754]/60 hover:text-[#0b1c30] hover:bg-gray-50 border border-transparent hover:border-gray-200"
          >
            <Download size={10} /> Download Files
          </button>
        </div>
      ) : (
        <MagneticButton className="w-full">
          <button
            onClick={() => onDownload(product)}
            className={cn(
              'w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer h-11',
              isFree
                ? 'bg-[#f0fbe8] hover:bg-[#e1f7d2] text-[#558b2f]'
                : 'bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d]',
            )}
          >
            <Download size={14} /> {isFree ? 'Download Free' : product.paidFileUrl ? 'Download Blueprint' : 'Access Files'}
          </button>
        </MagneticButton>
      )}
    </div>
  );
};
