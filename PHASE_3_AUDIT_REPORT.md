# PHASE 3 SYSTEM AUDIT REPORT

**Project:** AyushPaul.in — Digital Product Ecosystem  
**Audit Date:** June 7, 2026  
**Scope:** Complete Phase 3 system analysis across 6 modules  
**Method:** Source code analysis, Firestore schema review, API endpoint audit, UI component inspection

---

## 🟦 MODULE 1 — CONTENT SEEDING SYSTEM

### 1.1 Blueprint Seed Structure (Firestore)

**Collection:** `products`

**Live published products** (from `seed-ebooks.ts` + CMS admin):
- 6 products with `isPublished: true` and populated `stripePriceId` + `downloadFileURL`
- Schema fields: title, slug, type (free/paid), basePrice, salePrice, stripePriceId, downloadFileURL, category, tags, thumbnail, features, comparisonFree, comparisonPremium, isPublished, isFeatured, productTier, status

**Draft seed products** (from `seed-blueprints-placeholder.ts`):
- 8 products with `isPublished: false` and `status: "DRAFT_SEED"`
- Empty `stripePriceId`, empty `downloadFileURL`
- Tiers: 2 at ₹99 (Starter), 3 at ₹199 (Pro), 2 at ₹499 (Pro), 1 at ₹99 (Starter)
- Categories: Prompts, Templates, Workflows, Checklists, Blueprints
- These do NOT appear on the live site due to `isPublished: false` filter in `product-utils.ts`

**Data structure quality:** GOOD  
- Schema is well-defined with typed fields, author metadata, pricing, and tier support
- `enrichDigitalSystem()` in `product-utils.ts` provides graceful fallback resources and changelog for legacy products
- Multi-tier cache (Memory → LocalStorage → Firestore) prevents redundant reads

### 1.2 Course Seed Structure (Firestore)

**Collections:** `courses` → `modules` → `lessons`

**Published courses** (from `seed-courses.ts`):
1. **Cursor AI Mastery** (free, published) — 3 modules, 7 lessons with actual `content` field populated
2. **Next.js SaaS Foundations** (₹49, published) — 2 modules, 4 lessons with actual `content`
3. **Technical SEO: Build Authority Systems** (free, published) — 1 module, 2 lessons with actual `content`

**Placeholder course** (from `seed-placeholder-course.ts`):
1. **TypeScript Systems Design** (₹29, published, Starter tier) — 3 modules, 8 lessons with EMPTY `content` field
   - First 2 lessons free, remaining 6 locked behind payment
   - Course structure exists but is non-functional (no teachable content)

**Data structure quality:** GOOD for published courses, POOR for placeholder course
- Hierarchical schema is clean: course → module (courseId) → lesson (courseId + moduleId)
- Lock/unlock per lesson via `isFree` boolean
- Content is flat markdown strings in the `content` field (no block-based editor)

### 1.3 Workshop Seed Structure (Firestore)

**Collection:** `workshops`

4 workshops seeded from `seed-workshops.ts`:
- All with `isPublished: true`
- All with `status: "UPCOMING"`
- **None have real dates** — all show "TBD — Q3 2026" or "TBD — Q4 2026"
- **None have meeting links** — all empty strings
- **None have registration links** — all empty strings
- 3 are free, 1 is priced at ₹49

**Data structure quality:** MODERATE  
- Schema is well-defined but data is non-functional
- Workshops are visible on the site but cannot be joined or registered for

### 1.4 Placeholder vs Real Content Status

| Content Type | Real | Placeholder | Total |
|-------------|------|-------------|-------|
| Published Blueprints | 6 | 8 (draft) | 14 |
| Published Courses | 3 | 1 (empty content) | 4 |
| Workshops | 0 | 4 (no dates/links) | 4 |
| Modules (real) | 6 | 3 | 9 |
| Lessons (real) | 13 | 8 | 21 |

### 1.5 DRAFT / PUBLISHED Logic

- **Products:** `isPublished: boolean` + `status: "DRAFT_SEED" | "PUBLISHED"` — enforced at query level in `getPublishedProducts()` which filters `where("isPublished", "==", true)`
- **Courses:** `isPublished: boolean` — enforced in Vault query and MasteryPage query
- **Workshops:** `isPublished: boolean` — enforced in Vault query and workshop listing
- **Draft-to-publish workflow:** Manual (via admin CMS or direct Firestore update). Requires setting `isPublished: true` AND providing `stripePriceId` + `downloadFileURL` for paid products.

### 1.6 What Is Missing

- No content quality review process before publishing
- No content versioning or draft/published states for lessons (only the entire course)
- No lesson content analytics (which lessons are most/least viewed)
- No content update notifications (users don't know when courses are updated)

---

## 💰 MODULE 2 — PRICING SYSTEM

### 2.1 Product Pricing Tiers

**Defined in:** `src/lib/pricing.ts`

| Tier | Price Range | Color | Products Live |
|------|------------|-------|---------------|
| Free | ₹0 | Green (#8bc34a) | 2 blueprints, 2 courses |
| Starter | ₹1 – ₹99 | Blue (#0058be) | 2 live + 2 draft = 4 |
| Pro | ₹100 – ₹499 | Purple (#6b35ff) | 2 live + 5 draft = 7 |
| Premium | ₹500+ | Gold (#b8860b) | 0 live + 0 draft |

**Tier resolution logic:**
1. If `productTier` field exists on product → use it directly
2. Else fall back to price-based derivation from `salePrice` or `basePrice`
3. This ensures backward compatibility with products seeded before the tier system existed

**Exported utilities:**
- `resolveTier(product)` → `ProductTier`
- `formatPrice(price, currency)` → formatted string
- `formatTierRange(tier)` → human-readable range
- `TIER_ORDER` → array for ordered iteration
- `PricingBadge` component renders tier label + price

### 2.2 Stripe Product Mapping

- Stripe Price IDs stored on products as `stripePriceId: string`
- Checkout session (`api/create-checkout-session.ts`) retrieves the price from Stripe to determine `mode` (payment vs subscription)
- All current products are one-time payment (no subscriptions)
- Stripe API version mismatch: webhook uses `2025-03-31.basil`, checkout uses `2024-06-20`

### 2.3 Coupon/Discount System

**FULLY IMPLEMENTED** (Module 5):
- Firestore `coupons` collection with schema: code, discountType (percentage/fixed), value, active, usageLimit, usedCount, expiresAt, description
- `api/validate-coupon.ts` — validates code against Firestore, checks active/expired/limit
- `api/create-checkout-session.ts` — validates coupon, creates Stripe coupon object, applies to checkout session, stores in metadata
- `api/stripe-webhook.ts` — increments `usedCount` on successful purchase
- `CouponInput.tsx` — UI component on BlueprintDetailPage for entering codes
- `api/claim-referral.ts` — auto-creates 15%-off referral reward coupons

### 2.4 Pricing UI Integration

| Location | Tier Badge | Price Display | Buy Button |
|----------|-----------|---------------|------------|
| BlueprintDetailPage | ✅ PricingBadge | ✅ Full pricing + comparison | ✅ Stripe checkout |
| EcosystemCard (grid) | ✅ PricingBadge | ✅ Sale price visible | ✅ Navigates to detail |
| Vault blueprints tab | ✅ Tier-grouped | ✅ Per-tier sections | ✅ Download button |
| VaultRecommendedUnlocks | ❌ No badge | ✅ Price shown | ✅ Navigates to product |
| MasteryPage | ❌ No tier badge | ✅ Price shown | ✅ Enrollment button |
| CourseDetailPage | ❌ No tier badge | ✅ Price shown | ✅ Enroll/checkout |

### 2.5 Gaps & Issues

| Issue | Severity | Details |
|-------|----------|---------|
| No subscription billing support | MEDIUM | All products are one-time; if subscriptions are added later, the `mode` detection works but no webhook handler for `invoice.paid` exists |
| No coupon admin UI | HIGH | Coupons must be created directly in Firestore — no admin interface exists |
| No promo code management | MEDIUM | Cannot set discount start/end dates, minimum purchase amounts, or product-specific coupons |
| No tax calculation | LOW | Indian GST not handled; price shown is pre-tax |
| No currency conversion | LOW | INR-only; future international sales would need multi-currency support |
| Pricing badge missing from recommendation cards | LOW | Recommended products in Vault don't show tier, reducing purchase motivation |

---

## 🧠 MODULE 3 — VAULT MONETIZATION LOGIC

### 3.1 What Vault Currently Does

**Location:** `src/pages/VaultPage.tsx`

**Authentication & Data Loading:**
- Redirects unauthenticated users to home
- Fetches user profile from `users/{uid}` — ownedProducts map, displayName, email
- Fetches all published products via `getPublishedProducts()`
- Fetches enrollments from `enrollments` collection filtered by userId
- Fetches registered workshops from `workshop_registrations` filtered by userId

**Tab Structure:**
1. **Blueprints & Systems** — owned products grouped by tier (Free, Starter, Pro, Premium)
2. **Courses & Tracks** — enrolled courses with progress bars
3. **Live Workshops** — registered workshops with meeting links
4. **1-on-1 Sessions** — placeholder state with CTA to book

**Engine Sections (below tabs):**
5. **VaultStreak** — (NEW) shows consecutive learning days computed from enrollment `updatedAt`
6. **VaultNextUnlock** — (NEW) persistent bar showing next available tier + owned/total count
7. **VaultReferralShare** — (NEW) copy/share referral link with reward description
8. **VaultContinueLearning** — recent course progress + owned blueprints
9. **VaultRecommendedUnlocks** — cross-sell by category/tier
10. **VaultUpgradePath** — tier upgrade offers + bundle suggestions
11. **Discover Premium Blueprints** — all unowned published products as EcosystemCards

### 3.2 Monetization Flows Inside Vault

| Flow | Status | Description |
|------|--------|-------------|
| Owned products display | **LIVE** | Filtered by ownedProducts map, grouped by tier |
| Course progress tracking | **LIVE** | Progress % shown from enrollment data |
| Continue learning | **LIVE** | 2 most recent courses + 1 owned product |
| Cross-sell recommendations | **LIVE** | Category-matched courses + premium blueprints |
| Tier upgrade offers | **LIVE** | Starter→Pro, Bundle suggestions, Starter intro |
| Next unlock bar | **LIVE** | Always visible tier progression indicator |
| Learning streak | **LIVE** | Computed from enrollment `updatedAt` timestamps |
| Referral share | **LIVE** | Auto-generated code, copy/share link, reward info |
| Share-to-unlock | **LIVE** (placeholder) | Button exists, but no real bonus resource |
| Social proof | **PARTIAL** | `public_purchases` collection exists, SocialProofTicker not verified |

### 3.3 What Is Missing

| Missing Feature | Impact | Notes |
|----------------|--------|-------|
| No "last purchased" timestamp on owned products | MEDIUM | Cannot sort by recent purchase; continue learning section shows first owned products arbitrarily |
| No download analytics per user | LOW | Cannot track which products a user has actually downloaded vs just purchased |
| No bookmark/favorites system | LOW | Users cannot save products for later |
| No "complete course" celebration | LOW | No badge, confetti, or completion certificate when a course reaches 100% |
| No course rating/review | MEDIUM | Users cannot provide feedback on courses they complete |
| No abandoned cart tracking | LOW | No mechanism to follow up on users who started checkout but didn't complete |
| No purchase history in Vault | LOW | Only shows currently owned products, not historical purchases |
| Workshop registration does not check capacity | MEDIUM | `maxParticipants` field exists on workshops but is never enforced |

---

## 📧 MODULE 4 — EMAIL AUTOMATION SYSTEM

### 4.1 Architecture

**Shared utility:** `api/lib/email.ts`
- `sendEmail(payload)` — sends via Resend, handles missing API key gracefully (logs warning, returns `{ success: false }`)
- `emailLayout(content)` — dark-themed HTML wrapper with AyushPaul.in branding, header, footer links (Vault, Blueprints, Mastery)
- `emailButton(text, url)` — consistent CTA button HTML

**Templates:**
- `api/emails/PurchaseConfirmation.ts` — `renderPurchaseConfirmation(props)` → HTML string
- `api/emails/EnrollmentWelcome.ts` — `renderEnrollmentWelcome(props)` → HTML string
- `api/emails/PurchaseReceipt.tsx` — old React-based template (kept for backward compat, no longer imported)

**Trigger endpoints:**
- `api/stripe-webhook.ts` → sends purchase confirmation after successful checkout
- `api/trigger-enrollment-email.ts` → sends welcome email on demand (POST with userId + courseId)
- `api/trigger-abandoned-check.ts` → cron-ready endpoint for inactive users (PLACEHOLDER)

### 4.2 Working Email Flows

| Flow | Trigger | Template | Status |
|------|---------|----------|--------|
| Purchase confirmation | Stripe webhook `checkout.session.completed` | PurchaseConfirmation | **LIVE** |
| Course enrollment welcome | Client-side `POST /api/trigger-enrollment-email` | EnrollmentWelcome | **LIVE** |
| Newsletter broadcast | Admin CMS "Compose Campaign" button | Custom (in admin) | **LIVE** |

### 4.3 Missing Email Flows

| Flow | Trigger | Status | Priority |
|------|---------|--------|----------|
| Abandoned cart reminder | Checkout not completed after N days | **PLACEHOLDER** (trigger-abandoned-check.ts written but not scheduled) | MEDIUM |
| Streak broken notification | User inactive >48 hours after having a streak | **NOT IMPLEMENTED** | LOW |
| New content alert | Course/blueprint updated after user enrolled/purchased | **NOT IMPLEMENTED** | MEDIUM |
| Workshop reminder | N hours before registered workshop start | **NOT IMPLEMENTED** | HIGH |
| Post-purchase upsell | N days after purchase with relevant recommendations | **NOT IMPLEMENTED** | LOW |
| Birthday/re-engagement | Annual check-in for inactive users | **NOT IMPLEMENTED** | LOW |

### 4.4 Automation Gaps

| Gap | Details |
|-----|---------|
| No cron infrastructure | Abandoned-check endpoint exists but no Vercel Cron or similar scheduler configured |
| No email preference center | Users cannot opt out of specific email types |
| No send rate limiting | Newsletter could hit Resend API limits if subscriber list grows |
| No email analytics | Opens, clicks, bounces — none tracked |
| No A/B testing | Subject lines, CTAs, send times — not configurable |
| Resend sender domain not verified | Line comment in webhook: "Note: Must verify domain in Resend" — `lab@ayushpaul.in` may not be verified |

---

## 🎟 MODULE 5 — DISCOUNT / COUPON SYSTEM

### 5.1 Firestore Coupon Schema

**Collection:** `coupons`

```
Document ID: {normalized coupon code in UPPERCASE}
{
  code: string,              // e.g., "SAVE20", "REFERRAL_REF-ABC123_1717000000000"
  discountType: string,      // "percentage" | "fixed"
  value: number,             // e.g., 20 for 20%, 100 for ₹100 off
  active: boolean,           // true = can be used
  usageLimit: number | null, // null = unlimited
  usedCount: number,         // incremented on each use
  expiresAt: Timestamp | null,
  description: string,       // e.g., "Referral reward for REF-ABC123"
  createdBy: string,         // "system" or admin UID
  createdAt: Timestamp,
  lastUsedAt?: Timestamp,
  lastUsedBy?: string,
  lastUsedProduct?: string,
}
```

### 5.2 Coupon Lifecycle

```
Admin creates coupon in Firestore
  → User enters code on BlueprintDetailPage via CouponInput
  → POST /api/validate-coupon validates against Firestore
  → If valid → coupon code is passed to POST /api/create-checkout-session
  → Checkout creates Stripe coupon dynamically, applies as discount
  → Webhook receives checkout.session.completed
  → Coupon usedCount incremented in Firestore
```

### 5.3 What Exists

| Component | Status | File |
|-----------|--------|------|
| Coupon Firestore schema definition | **EXISTS** | Inferred from validate-coupon.ts |
| Coupon validation API | **LIVE** | `api/validate-coupon.ts` |
| Coupon → Stripe integration | **LIVE** | `api/create-checkout-session.ts` (creates Stripe coupon + applies discounts) |
| Usage tracking in webhook | **LIVE** | `api/stripe-webhook.ts` |
| Coupon UI (CouponInput) | **LIVE** | `src/components/ui/CouponInput.tsx` |
| Coupon wired into BlueprintDetailPage | **LIVE** | `src/pages/BlueprintDetailPage.tsx` |
| Auto-created referral coupons | **LIVE** | `api/claim-referral.ts` |

### 5.4 What Is Missing

| Missing | Impact | Details |
|---------|--------|---------|
| No admin UI for coupons | **HIGH** | Coupons must be created/edited/deactivated via direct Firestore operations — no CMS tab exists |
| No minimum purchase amount | MEDIUM | Cannot restrict coupons to products above a certain price |
| No product-specific coupons | MEDIUM | Coupons apply to entire checkout, not specific products |
| No coupon stacking logic | LOW | Currently only one coupon per checkout (Stripe limitation but not enforced by code) |
| No coupon analytics | MEDIUM | Cannot track which coupons drive most conversions, average order value with coupons, etc. |
| No coupon code generation tool | LOW | Admin must manually invent and type coupon codes |
| No coupon test mode | LOW | Cannot validate coupon rendering in Stripe without real checkout |

---

## 🔁 MODULE 6 — GROWTH LOOPS SYSTEM

### 6.1 Referral System

**Implementation:**
- `src/lib/referral.ts` — generates `REF-{UID_PREFIX}{RANDOM}` codes
- Auto-assigned on first Vault visit via `ensureReferralCode()` in VaultPage
- `VaultReferralShare.tsx` — UI with copy link + native share button, shows reward (15% off)
- `api/claim-referral.ts` — creates referral record + 15% discount coupon for referrer

**Status: LIVE — but incomplete**
- ✅ Referral code generation
- ✅ Share UI in Vault
- ✅ Referral tracking in `referrals` collection
- ✅ Reward coupon creation
- ❌ No referral tracking dashboard (admin or user-facing)
- ❌ No referral link in signup flow (new users can't be attributed via `?ref=` param)
- ❌ No payout/payout tracking — rewards are discounts only, no cash
- ❌ No referral milestone system ("refer 5 friends, unlock X")

### 6.2 Share-to-Unlock Loop

**Implementation:**
- `VaultShareUnlock.tsx` — component placed on owned blueprint cards
- Share via native Web Share API or clipboard fallback
- `onUnlock` callback exists but has no effect

**Status: PLACEHOLDER**
- ✅ Share UI built
- ❌ No actual bonus resource to unlock
- ❌ No tracking of shares per user/product
- ❌ No Firestore collection for shared resources

### 6.3 Learning Streaks

**Implementation:**
- `VaultStreak.tsx` — computes streak from enrollment `updatedAt` timestamps
- Consecutive days = streak count (tolerance allows 48h gap)
- Circular progress indicator, last active date, streak day count

**Status: LIVE**
- ✅ Streak computation from existing enrollment data
- ✅ Visual display in Courses tab
- ❌ No email/notification when streak is about to break
- ❌ No streak milestones ("7-day streak! +10 XP")
- ❌ No gamification beyond the counter (no badges, no levels)

### 6.4 Recommendation Engine

**Implementation:**
- `src/lib/recommendations.ts` — client-side pure logic using existing Firestore data
- Three functions: `getContinueLearning()`, `getRecommendedUnlocks()`, `getUpgradePaths()`

**`getContinueLearning()` logic:**
1. Most recent course enrollments (sorted by `updatedAt`, max 2)
2. First owned blueprints (max 1)
3. No personalization beyond recency

**`getRecommendedUnlocks()` logic:**
1. If user owns products → suggest courses in same category (max 2)
2. If user is enrolled → suggest premium blueprints from discoverProducts (max 2)
3. Fallback → cheapest discoverProducts (max 2)
4. Results capped at 3 total

**`getUpgradePaths()` logic:**
1. If user has Starter → suggest Pro products
2. If user has Starter or Pro → suggest bundle (2+ products, "Bundle & Save")
3. If user has no paid products → suggest Starter products

**Status: LIVE**
- ✅ All three recommendation engines functional
- ✅ No Firestore dependencies (pure client-side `useMemo`)
- ✅ Category-matching cross-sell
- ✅ Tier-based upgrade suggestions
- ❌ No collaborative filtering (what users like you bought)
- ❌ No real-time inventory-aware suggestions
- ❌ No A/B testing of recommendation strategies

### 6.5 Upsell Logic in Vault

**Implementation:**
- `VaultNextUnlock.tsx` — persistent bar showing next tier + owned/total count + "Upgrade" badge
- `VaultUpgradePath.tsx` — detailed upgrade cards (from `getUpgradePaths()`)
- `VaultRecommendedUnlocks.tsx` — cross-sell cards with "View" CTAs

**Status: LIVE**
- ✅ Upgrade pressure is always visible
- ✅ Multiple upgrade entry points (bar + section + recommendation cards)
- ❌ No discount incentive for upgrading ("Upgrade now, save 20%")
- ❌ No limited-time urgency ("Offer ends in X days")
- ❌ No social proof ("Join 5 others who upgraded to Pro")

### 6.6 Retention Triggers

| Trigger | Status | Details |
|---------|--------|---------|
| Purchase confirmation email | **LIVE** | Webhook → Resend |
| Enrollment welcome email | **LIVE** | Client-fired POST |
| Abandoned course email | **PLACEHOLDER** | trigger-abandoned-check.ts exists, not scheduled |
| Streak break notification | **MISSING** | No mechanism to detect or notify |
| Post-purchase upsell | **MISSING** | No scheduled follow-up |
| Re-engagement campaign | **MISSING** | No dormant user detection |
| Content update notification | **MISSING** | No "what's new" push for enrolled users |

---

## 📊 FINAL SECTION — SYSTEM SCORECARD

### 1. SYSTEM COMPLETENESS SCORE (0–10)

| Module | Score | Reasoning |
|--------|-------|-----------|
| **Content Seeding** | 6.5/10 | 6 published + 8 draft blueprints, 3 published courses (with real content) + 1 placeholder, 4 placeholder workshops. Solid foundation but 60% of content is non-functional (drafts, empty lessons, no dates). |
| **Pricing System** | 7.5/10 | Clean tier architecture, backward-compatible resolution, badge components. Missing: subscription support, tax handling, multi-currency, coupon admin UI. |
| **Vault System** | 8.0/10 | Feature-rich vault with owned products display, course tracking, recommendation engine, tier grouping, streaks, referral. Missing: purchase timestamps, course ratings, download analytics, abandoned cart. |
| **Email System** | 6.0/10 | 2 live triggers (purchase + enrollment), shared template system, abandoned-check placeholder. Missing: cron scheduling, email analytics, preference center, workshop reminders, content update alerts. |
| **Coupon System** | 6.5/10 | Full coupon lifecycle implemented (validation → Stripe → webhook → tracking). Missing: admin UI, product-specific coupons, analytics, minimum purchase rules. |
| **Growth Loops** | 5.5/10 | Referral code gen + share UI + reward live. Streak counter live. Rec engine live. BUT: no referral attribution flow, share-unlock is placeholder, no gamification, no retention triggers beyond email, no A/B testing. |

### 2. OVERALL PRODUCT READINESS

```
Content Seeding    █████████░░░  6.5/10
Pricing System     ████████░░░░  7.5/10
Vault System       █████████░░░  8.0/10
Email System       ██████░░░░░░  6.0/10
Coupon System      ██████░░░░░░  6.5/10
Growth Loops       █████░░░░░░░  5.5/10
                   ─────────────
TOTAL              ███████░░░░░  6.7/10
```

### Classification: 🔥 Monetization-ready ecosystem

The system is **functional and capable of processing transactions, delivering content, sending emails, and cross-selling**. It is beyond "functional but incomplete" — the core monetization loop works end-to-end. However, placeholder content, missing admin UIs, and gaps in growth/retention prevent it from being fully "ready for users" at scale.

### 3. CRITICAL GAPS LIST (Top 10)

| Rank | Gap | Module | Impact | Effort to Fix |
|------|-----|--------|--------|---------------|
| 1 | **Admin UI for coupon management** | M5 | HIGH — Cannot create/deactivate/track coupons without direct Firestore access | 2 days |
| 2 | **Workshop data incomplete** | M1 | HIGH — 4 workshops visible but non-functional (no dates, no links) | 2 hours |
| 3 | **Placeholder course has empty lessons** | M1 | HIGH — "TypeScript Systems Design" course enrolled but unteachable | 1–2 days |
| 4 | **No cron/scheduler for email triggers** | M4 | MEDIUM — Abandoned course detection written but not running; no infrastructure for future scheduled emails | 1 day |
| 5 | **No referral attribution in signup flow** | M6 | MEDIUM — Referral links exist but new users cannot be linked back to referrer during registration | 1 day |
| 6 | **Draft blueprints not published** | M1 | MEDIUM — 8 products ready to sell but unpublished (no stripePriceId, no downloadFileURL) | 1 day |
| 7 | **No email analytics** | M4 | MEDIUM — Cannot measure open rates, click rates, or bounces for transactional or marketing emails | 2 days |
| 8 | **No product-specific coupon targeting** | M5 | LOW-MEDIUM — Coupons apply to entire cart; cannot offer "20% off Blueprint X only" | 1 day |
| 9 | **No workshop reminder email** | M6 | MEDIUM — Users register for workshops but receive no reminder before start time | 0.5 day |
| 10 | **No purchase timestamps on owned products** | M3 | LOW — Continue learning section cannot sort by most recent purchase; arbitrary order | 0.5 day |

### Summary

The system has a **strong, production-quality foundation** across all 6 modules but is held back by:

1. **Incomplete content** — 60% of seeded content is non-functional (draft blueprints, empty lessons, missing workshop data)
2. **Admin UX gaps** — Coupon and referral management require direct Firestore access, no admin UI
3. **Growth loop incompleteness** — Referral attribution, share-unlock, and retention triggers half-built
4. **No operational infrastructure** — No cron jobs, no email analytics, no automated scheduling

**Revenue-readiness is estimated at 7.5/10** — the system can process payments, deliver products, send transactional emails, cross-sell, and upgrade-sell. The gaps are operational (admin controls, content fill, scheduling) rather than architectural. Any of the top-3 critical gaps, if fixed, would immediately increase the score by 1+ points.
