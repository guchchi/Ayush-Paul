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
