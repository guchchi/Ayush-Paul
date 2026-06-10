import React from 'react';
import { Check, X } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const DEFAULT_IDEAL = [
  'Students who want real, applicable skills',
  'Freelancers looking to deliver better results',
  'Founders building products and systems',
  'Creators who want to scale operations',
  'Small Businesses needing workflows',
  'Agencies needing repeatable frameworks',
];

const DEFAULT_NOT_FOR = [
  'You are looking for instant results',
  'You will not implement the steps',
  'You want done-for-you services',
];

export const BlueprintWhoShouldUse = ({ product }: Props) => {
  const idealFor = product.idealFor && product.idealFor.length > 0 ? product.idealFor : null;
  const notFor = product.notFor && product.notFor.length > 0 ? product.notFor : null;

  if (!idealFor && !notFor) return null;

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Perfect For */}
        <div>
          <h2 className="text-sm font-semibold text-[#0b1c30] mb-5">Perfect For</h2>
          <ul className="space-y-3">
            {(idealFor || DEFAULT_IDEAL).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[#0b1c30]">
                <Check size={16} className="text-[#0058be] shrink-0 mt-0.5" />
                <span className="text-[15px] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Not For You If */}
        <div>
          <h2 className="text-sm font-semibold text-[#0b1c30] mb-5">Not For You If</h2>
          <ul className="space-y-3">
            {(notFor || DEFAULT_NOT_FOR).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[#424754]">
                <X size={16} className="text-[#c62828] shrink-0 mt-0.5" />
                <span className="text-[15px] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
