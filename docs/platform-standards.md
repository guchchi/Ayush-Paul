# AyushPaul.in Platform Standards

> Every feature must satisfy ALL 12 rules before being marked complete.

---

## RULE 1 — Full Lifecycle Support
Every feature must support:
1. Create
2. Read
3. Update
4. Delete
5. User Access
6. Admin Access
7. Analytics
8. Payments (if applicable)
9. Email Flow (if applicable)
10. Vault/Ownership Flow (if applicable)

## RULE 2 — Admin CMS Requirement
Every content type must have:
- Admin navigation entry
- Schema definition in `cms-schemas.ts`
- CRUD operations via SchemaDrivenList/SchemaDrivenForm
- Field validation
- Preview support (thumbnail/images in list)
- Status controls (select fields)

Admin must never require Firestore edits. Everything manageable through Admin UI.

## RULE 3 — User Ownership Requirement
If a user acquires something, then:
- Ownership must be stored (Firestore document)
- Ownership must appear in Vault
- Ownership must survive refresh
- Ownership must survive logout/login
- Duplicate purchases must be blocked
- Product page must show "Already Owned" or "Open in Vault" instead of purchase buttons

## RULE 4 — Payment Requirement
Every paid product must support:
- Stripe checkout
- Coupon system (discount codes)
- Creator attribution (affiliate codes)
- Analytics tracking

Required fields: `stripeProductId`, `stripePriceId`, `salePrice`, `productPrice`
Validation: `salePrice <= productPrice`

## RULE 5 — Coupon Requirement
Coupons must support:
- Validation (code lookup)
- Expiry date
- Usage limits
- Minimum purchase amount
- Creator assignment

When used: discount applied correctly, checkout amount updated, analytics updated, usage count incremented.

## RULE 6 — Creator Affiliate Requirement
If coupon belongs to a creator:
- Track: sales count, revenue, commission, customers
- Commission = original product price × creator commission % (NOT discounted price)
- Update: `creator_codes`, `creator_sales_log`, analytics dashboard

## RULE 7 — Vault Requirement
Every acquired item must appear inside Vault with:
- Ownership verification
- Launch/open buttons
- Completed states
- Active states

## RULE 8 — Email Requirement
Any feature involving registration must support:
1. Confirmation Email
2. Reminder Email
3. Update Email
4. Completion Email

Admin must send manually AND automatically. Delivery status must be visible.

## RULE 9 — Status System Requirement
Every content type should support statuses (Draft, Upcoming, Published, Live, Completed, Archived, Cancelled) that affect frontend behavior.

## RULE 10 — Analytics Requirement
Every business action should update analytics:
- Purchase, Coupon Use, Creator Sale, Registration, Enrollment, Email Send, Workshop Join
- Admin dashboard must reflect changes

## RULE 11 — Feature Completion Checklist
Before marking any feature complete:
- [ ] Admin CRUD works
- [ ] Frontend displays correctly
- [ ] Ownership works
- [ ] Vault integration works
- [ ] Payment works (if applicable)
- [ ] Coupon works (if applicable)
- [ ] Creator tracking works (if applicable)
- [ ] Analytics works
- [ ] Email works (if applicable)
- [ ] Duplicate prevention works
- [ ] Refresh persistence works
- [ ] Mobile responsive
- [ ] Production tested

## RULE 12 — Session Memory
Before any implementation session:
1. Read `docs/platform-standards.md`
2. Read `docs/feature-status.md`
3. Read `docs/known-issues.md`
4. Read `docs/change-log.md`

After any implementation session:
1. Update `docs/feature-status.md`
2. Update `docs/known-issues.md`
3. Update `docs/change-log.md`
