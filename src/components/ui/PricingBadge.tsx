import React from 'react';
import { cn } from '../../lib/utils';
import { getProductTier, getTierConfig, formatPrice } from '../../lib/pricing';
import type { Product, ProductTier } from '../../types';

interface PricingBadgeProps {
  product?: Product;
  tier?: ProductTier;
  price?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPrice?: boolean;
}

export const PricingBadge: React.FC<PricingBadgeProps> = ({
  product,
  tier: explicitTier,
  price: explicitPrice,
  currency = 'inr',
  size = 'sm',
  className,
  showPrice = false,
}) => {
  const tier = product ? getProductTier(product) : getTierConfig(explicitTier || 'free');
  const price = product ? (product.salePrice > 0 ? product.salePrice : product.basePrice) : (explicitPrice || 0);

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[9px]',
    md: 'px-3 py-1 text-[10px]',
    lg: 'px-4 py-1.5 text-[11px]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider border',
        tier.bgColor,
        tier.borderColor,
        tier.color,
        sizeClasses[size],
        className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', tier.dotColor)} />
      <span>{tier.label}</span>
      {showPrice && price > 0 && (
        <span className="opacity-70 font-semibold">· {formatPrice(price, currency)}</span>
      )}
    </span>
  );
};
