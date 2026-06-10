import React from 'react';
import { Check } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export const BlueprintWhatYouAchieve = ({ product }: Props) => {
  const outcomes = product.outcomes && product.outcomes.length > 0 ? product.outcomes : null;
  if (!outcomes) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-[#0b1c30] mb-5">What You'll Achieve</h2>

      <ul className="space-y-3">
        {outcomes.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-[#0b1c30]">
            <Check size={18} className="text-[#0058be] shrink-0 mt-0.5" />
            <span className="text-[15px] leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
