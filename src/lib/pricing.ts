import type { ProductTier, Product } from '../types';
import { formatCurrency } from './format';

export interface TierConfig {
  id: ProductTier;
  label: string;
  minPrice: number;
  maxPrice: number;
  color: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
}

export const TIERS: Record<ProductTier, TierConfig> = {
  free: {
    id: 'free',
    label: 'Free',
    minPrice: 0,
    maxPrice: 0,
    color: 'text-[#558b2f]',
    bgColor: 'bg-[#f0fbe8]',
    borderColor: 'border-[#e1f7d2]',
    dotColor: 'bg-[#8bc34a]',
  },
  starter: {
    id: 'starter',
    label: 'Starter',
    minPrice: 1,
    maxPrice: 99,
    color: 'text-[#0058be]',
    bgColor: 'bg-[#eff4ff]',
    borderColor: 'border-[#dce9ff]',
    dotColor: 'bg-[#0058be]',
  },
  pro: {
    id: 'pro',
    label: 'Pro',
    minPrice: 100,
    maxPrice: 499,
    color: 'text-[#6b35ff]',
    bgColor: 'bg-[#f3efff]',
    borderColor: 'border-[#ebe5ff]',
    dotColor: 'bg-[#6b35ff]',
  },
  premium: {
    id: 'premium',
    label: 'Premium',
    minPrice: 500,
    maxPrice: Infinity,
    color: 'text-[#b8860b]',
    bgColor: 'bg-[#fffef0]',
    borderColor: 'border-[#f5e6b8]',
    dotColor: 'bg-[#b8860b]',
  },
};

export function resolveTier(product: Product): ProductTier {
  if (product.productTier) return product.productTier;
  const price = product.salePrice > 0 ? product.salePrice : product.basePrice;
  if (price <= 0) return 'free';
  if (price <= 99) return 'starter';
  if (price <= 499) return 'pro';
  return 'premium';
}

export function getTierConfig(tier: ProductTier): TierConfig {
  return TIERS[tier];
}

export function getProductTier(product: Product): TierConfig {
  return getTierConfig(resolveTier(product));
}

export function formatPrice(price: number, currency = 'inr'): string {
  return formatCurrency(price);
}

export function formatTierRange(tier: ProductTier, currency = 'inr'): string {
  if (tier === 'free') return '₹0';
  if (tier === 'premium') return `${formatPrice(TIERS[tier].minPrice, currency)}+`;
  return `${formatPrice(TIERS[tier].minPrice, currency)} – ${formatPrice(TIERS[tier].maxPrice, currency)}`;
}

export const TIER_ORDER: ProductTier[] = ['free', 'starter', 'pro', 'premium'];
