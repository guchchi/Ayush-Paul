import React from 'react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export const BlueprintSocialProof = ({ product }: Props) => {
  const hasStats = (product.downloadCount && product.downloadCount > 0) ||
    (product.purchaseCount && product.purchaseCount > 0) ||
    (product.rating && product.rating > 0);

  if (!hasStats) return null;

  return (
    <section>
      <div className="max-w-3xl mb-14">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#424754]/60 mb-4">Social Proof</h2>
        <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#0b1c30] leading-[1.05]">
          Trusted by Builders
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {product.downloadCount && product.downloadCount > 0 && (
          <div className="p-8 rounded-[24px] bg-white border border-[#c2c6d6]/25 shadow-sm text-center">
            <p className="text-4xl font-extrabold text-[#0058be]">{product.downloadCount.toLocaleString()}</p>
            <p className="text-xs font-bold text-[#424754]/60 uppercase tracking-wider mt-2">Downloads</p>
          </div>
        )}
        {product.purchaseCount && product.purchaseCount > 0 && (
          <div className="p-8 rounded-[24px] bg-white border border-[#c2c6d6]/25 shadow-sm text-center">
            <p className="text-4xl font-extrabold text-[#558b2f]">{product.purchaseCount.toLocaleString()}</p>
            <p className="text-xs font-bold text-[#424754]/60 uppercase tracking-wider mt-2">Purchases</p>
          </div>
        )}
        {product.rating && product.rating > 0 && (
          <div className="p-8 rounded-[24px] bg-white border border-[#c2c6d6]/25 shadow-sm text-center">
            <p className="text-4xl font-extrabold text-[#f59e0b]">{product.rating.toFixed(1)}</p>
            <p className="text-xs font-bold text-[#424754]/60 uppercase tracking-wider mt-2">Rating</p>
          </div>
        )}
      </div>
    </section>
  );
};
