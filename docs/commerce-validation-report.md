# Commerce Validation — Verification Report

## Changes Summary

### Issue 1: `minPurchaseAmount` not enforced

| File | Change |
|------|--------|
| `api/checkout.ts` — `handleValidateCoupon` | Returns `minPurchaseAmount` field in response. Accepts optional `productPrice` parameter and rejects if product price is below minimum. |
| `api/checkout.ts` — `handleCreateCheckoutSession` | After calculating `effectivePrice`, checks `coupon.minPurchaseAmount` and returns HTTP 400 with clear error if price is below minimum. |
| `src/components/ui/CouponInput.tsx` | Accepts `productPrice` prop. Passes it to `/api/validate-coupon` for server-side validation at UI stage. Shows error messages returned by the API. |
| `src/pages/LabDetailPage.tsx` | Passes `product.salePrice \|\| product.basePrice` as `productPrice` to `CouponInput`. |
| `src/pages/BlueprintDetailPage.tsx` | Same as above. |

### Issue 2: Inactive creators receiving commissions

| File | Change |
|------|--------|
| `api/checkout.ts` — `handleVerifyCheckoutSession` | Before processing creator commission, checks `creatorData.isActive === false` and skips with a warning log. |
| `api/stripe-webhook.ts` | Same `isActive === false` guard before commission processing. |
| `server.ts` | Same `isActive === false` guard before commission processing. |

## Test Scenarios

### Scenario 1: `minPurchaseAmount` — Valid coupon on expensive product

```
Product price: ₹1000
Coupon minPurchaseAmount: ₹500
Result: ✅ Coupon applied successfully
```

### Scenario 2: `minPurchaseAmount` — Coupon rejected on cheap product

```
Product price: ₹200
Coupon minPurchaseAmount: ₹500
Result: ❌ Checkout blocked with error:
  "This coupon requires a minimum purchase of ₹500.
   The product price is ₹200."
```

### Scenario 3: `minPurchaseAmount` — No amount set (legacy coupons)

```
Product price: ₹300
Coupon minPurchaseAmount: 0 (not set / default)
Result: ✅ Coupon applied successfully (no blocking)
```

### Scenario 4: Inactive creator — Commission blocked (verify path)

```
Creator: isActive = false
Purchase: verified via /api/verify-checkout-session
Result: ❌ Commission skipped. Console log:
  "[Creator] Verify: Creator 'XYZ' is inactive — skipping commission"
No entry in creator_sales_log, no stats update.
```

### Scenario 5: Inactive creator — Commission blocked (webhook path)

```
Creator: isActive = false
Purchase: processed via Stripe webhook
Result: ❌ Commission skipped. Console log:
  "[Creator] Webhook: Creator 'XYZ' is inactive — skipping commission"
```

### Scenario 6: Active creator — Commission processed normally

```
Creator: isActive = true
Product: ₹1000, Commission: 15%
Result: ✅ Commission logged: ₹150 credited to creator
Stats incremented: totalSales, totalRevenue, totalCommission, totalCustomers
```

### Scenario 7: Client-side coupon validation with `productPrice`

```
User enters coupon on product page (₹200 product)
Coupon has minPurchaseAmount = ₹500
API call: POST /api/validate-coupon { code: "XYZ", productPrice: 200 }
Result: HTTP 400, { valid: false, error: "This coupon requires a minimum purchase of ₹500..." }
UI: Shows error message in coupon input
```

## Firestore Queries Added / Modified

### `handleValidateCoupon` (accepts optional `productPrice`):
```typescript
const { code, productPrice } = req.body;
// ... existing validation ...
const minPurchaseAmount = coupon.minPurchaseAmount || 0;
if (minPurchaseAmount > 0 && typeof productPrice === 'number') {
  if (productPrice < minPurchaseAmount) {
    return res.status(400).json({ valid: false, error: '...' });
  }
}
```

### `handleCreateCheckoutSession` (post-effectivePrice):
```typescript
if (couponSnap) {
  const c = couponSnap.data();
  const minAmount = c.minPurchaseAmount || 0;
  if (minAmount > 0 && effectivePrice < minAmount) {
    return res.status(400).json({ error: '...' });
  }
}
```

### All three commission paths (`isActive` guard):
```typescript
if (creatorData.isActive === false) {
  console.warn(`[Creator] ... skipping commission`);
} else {
  // process commission
}
```

## Running Tests

```bash
npx tsx scripts/validate-commerce.ts
```
