import React from 'react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export const BlueprintWhyICreated = ({ product }: Props) => {
  const authName = product.authorName || product.author?.name || 'Ayush Paul';
  const authPhoto = product.authorPhoto || product.author?.avatar;
  const problem = product.problemSolved;

  if (!problem) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-[#0b1c30] mb-5">Why I Created This Blueprint</h2>

      <div className="space-y-4 text-[15px] text-[#424754] leading-relaxed">
        <p>
          After working with dozens of people in this space, I noticed the same pattern over and over:
          everyone has the knowledge, but nobody has the <span className="text-[#0b1c30] font-medium">system</span>.
        </p>
        <p>
          {problem}
        </p>
        <p>
          I built this blueprint to solve that exact problem. It's the system I wish I had when I started —
          no fluff, no theory, just the exact steps to get results.
        </p>
      </div>

      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#c2c6d6]/10">
        {authPhoto && (
          <img
            src={authPhoto}
            alt={authName}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <p className="text-[13px] font-medium text-[#0b1c30]">{authName}</p>
          <p className="text-[11px] text-[#424754]/40">Creator</p>
        </div>
      </div>
    </section>
  );
};
