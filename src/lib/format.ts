export function formatCurrency(amount: number): string {
  if (amount <= 0) return 'Free';
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDiscount(basePrice: number, salePrice: number): string | null {
  if (basePrice > 0 && salePrice > 0 && salePrice < basePrice) {
    const pct = Math.round((1 - salePrice / basePrice) * 100);
    return `${pct}% OFF`;
  }
  return null;
}

export function computeSavings(basePrice: number, salePrice: number): { amount: number; percent: number } | null {
  const bp = Number(basePrice) || 0;
  const sp = Number(salePrice) || 0;
  if (bp > 0 && sp > 0 && sp < bp) {
    return {
      amount: bp - sp,
      percent: Math.round(((bp - sp) / bp) * 100),
    };
  }
  return null;
}
