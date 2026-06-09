# Known Issues — AyushPaul.in

> Last updated: 2026-06-09

---

## Workshop System

### P1 — Paid Workshop Checkout (Missing)
**Issue**: If a workshop has `isFree: false`, there is no Stripe checkout flow. Registration goes straight to Firestore without payment.
**Impact**: Users can register without paying for paid workshops.
**Fix required**: Add payment verification step for `isFree === false` workshops in MasteryWorkshops registration flow.
**File**: `src/components/sections/MasteryWorkshops.tsx`

### P2 — Coupon + Creator Attribution for Workshops (Missing)
**Issue**: No coupon field or creator code field exists in the workshop registration flow. Paid workshops can't accept coupons or attribute sales to creators.
**Impact**: Cannot sell workshops through creator affiliates.
**Fix required**: Add coupon input + creator attribution to workshop checkout.

### P3 — No Scheduled Reminder Automation
**Issue**: Reminder emails (24h, 1h, 5m) must be sent manually via admin button. There is no cron job or scheduled function to send them automatically.
**Impact**: Reminders require manual admin action.
**Fix required**: Create Vercel cron job or Firebase scheduled function to process `scheduled_emails` for workshops.

### P4 — No Email Delivery Status UI
**Issue**: Admin can send emails but cannot see which were delivered, opened, or bounced. No delivery status dashboard.
**Impact**: No feedback on email campaign success.
**Fix required**: Add delivery status tracking to workshop email API + admin UI.

### P5 — Registration Email Not Re-sendable
**Issue**: Admin can send confirmation email once (at registration time) but cannot re-send it manually from dashboard.
**Impact**: If email fails or user loses it, admin can't re-send.
**Fix required**: Add "Re-send Confirmation" button to admin dashboard for individual registrations.

## CMS System

### P6 — SchemaDrivenList Thumbnail Fallback Edge Cases
**Issue**: Image URL validation regex might miss some valid URLs (e.g., CDN URLs without extensions, data URIs).
**Impact**: Some thumbnails may not render in admin list.
**Fix**: Relax the regex or use a try/catch with fetch to validate.

## Vault

### P7 — Workshop Recording Fallback
**Issue**: If a COMPLETED workshop has no `recordingUrl`, Vault shows "Recording Coming Soon" indefinitely.
**Impact**: No mechanism for admin to communicate "no recording available."
**Fix**: Add a `hasRecording` boolean field or check `recordingUrl` presence.

## General

### P8 — No Platform-Wide Search
**Issue**: No global search for content across blog, products, courses, workshops.
**Impact**: Users must navigate each section individually.

### P9 — No User Role Management
**Issue**: Users have a single `role` field (founder/customer). No granular permissions.
**Impact**: Cannot grant admin access to multiple users without editing Firestore rules.
