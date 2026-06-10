import React from 'react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const DEFAULT_BEFORE = [
  'No clear direction or strategy',
  'Random, inconsistent effort',
  'Slow or no measurable progress',
  'Wasted time on wrong approaches',
];

const DEFAULT_AFTER = [
  'Clear roadmap and repeatable system',
  'Consistent, focused execution',
  'Measurable results and faster growth',
  'Confidence in your approach',
];

export const BlueprintResults = ({ product }: Props) => {
  const outcomes = product.outcomes && product.outcomes.length > 0 ? product.outcomes : null;

  const before = DEFAULT_BEFORE;
  const after = outcomes && outcomes.length >= 3 ? outcomes.slice(0, 4) : DEFAULT_AFTER;

  return (
    <section>
      <h2 className="text-sm font-semibold text-[#0b1c30] mb-5">What Changes After Implementation</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Before */}
        <div>
          <p className="text-[11px] font-semibold text-[#c62828] uppercase tracking-widest mb-4">Before</p>
          <ul className="space-y-3">
            {before.map((item, idx) => (
              <li key={idx} className="text-[15px] text-[#424754]/50 leading-relaxed pl-4 border-l-2 border-[#c62828]/15">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* After */}
        <div>
          <p className="text-[11px] font-semibold text-[#0058be] uppercase tracking-widest mb-4">After</p>
          <ul className="space-y-3">
            {after.map((item, idx) => (
              <li key={idx} className="text-[15px] text-[#0b1c30] leading-relaxed pl-4 border-l-2 border-[#0058be]/15">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
