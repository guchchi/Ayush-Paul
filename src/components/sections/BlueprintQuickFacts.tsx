import React from 'react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export const BlueprintQuickFacts = ({ product }: Props) => {
  const facts: { label: string; value: string }[] = [
    { label: 'Difficulty Level', value: product.difficultyLevel ? product.difficultyLevel.charAt(0).toUpperCase() + product.difficultyLevel.slice(1) : 'Beginner' },
    { label: 'Category', value: product.category || 'General' },
    product.readingTime && { label: 'Reading Time', value: `${product.readingTime} minutes` },
    product.estimatedImplementationTime && { label: 'Implementation Time', value: product.estimatedImplementationTime },
    product.lastUpdated && { label: 'Last Updated', value: product.lastUpdated },
    product.version && { label: 'Version', value: `v${product.version}` },
    { label: 'Language', value: product.language || 'English' },
    { label: 'Format', value: product.blueprintType || 'Digital Blueprint' },
    product.pageCount && { label: 'Pages', value: `${product.pageCount}` },
  ].filter(Boolean) as { label: string; value: string }[];

  if (facts.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-[#0b1c30] mb-5">Blueprint Overview</h2>

      <div className="rounded-2xl border border-[#c2c6d6]/15 overflow-hidden">
        {facts.map((fact, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between px-5 py-3.5 ${idx < facts.length - 1 ? 'border-b border-[#c2c6d6]/10' : ''}`}
          >
            <span className="text-[13px] text-[#424754]/60">{fact.label}</span>
            <span className="text-[13px] font-medium text-[#0b1c30]">{fact.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
