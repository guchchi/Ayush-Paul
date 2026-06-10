import React from 'react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export const BlueprintRoadmap = ({ product }: Props) => {
  const modules = product.modules && product.modules.length > 0 ? product.modules : null;
  const time = product.estimatedImplementationTime || '7 Days';

  if (!modules) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-[#0b1c30] mb-2">Implementation Roadmap</h2>
      <p className="text-[13px] text-[#424754]/50 mb-6">Estimated time: {time}</p>

      <div className="space-y-0 border-l-2 border-[#c2c6d6]/15 ml-2">
        {modules.map((mod, idx) => (
          <div key={mod.id} className="relative pl-7 pb-7 last:pb-0">
            {/* Dot */}
            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#0058be]" />

            <div>
              <p className="text-[11px] text-[#424754]/40 font-medium uppercase tracking-wide mb-0.5">
                Step {idx + 1}
              </p>
              <p className="text-[15px] font-medium text-[#0b1c30]">
                {mod.title}
              </p>
              {mod.outcome && (
                <p className="text-[13px] text-[#424754]/50 mt-0.5">
                  {mod.outcome}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
