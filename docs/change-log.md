# Change Log — AyushPaul.in

> All significant changes to the platform, organized by date.

---

## 2026-10-18 — B.Cyber Pillar 1 Design & Accessibility Audit Fixes (Option 1)

### Changes & Optimizations
- **Canonical In-Page Anchor IDs**: Added canonical anchor IDs (`#overview-start`, `#key-facts`, `#model-2plus2`, `#curriculum`, `#beyond-hacking`, `#degree-comparison`, `#fit-check`, `#degree-recognition`, `#internship-reality`, `#myths-vs-facts`, `#common-faqs`, `#official-sources`, `#next-steps`) with `scroll-mt-28` across all 14 section wrappers in [BCyberHomePage.tsx](file:///c:/Users/ap877/2026/Ayush-Paul/src/pages/blueprints/b-cyber/BCyberHomePage.tsx) to prevent header occlusion during direct links.
- **Section 6 Responsive Dimension Stack**: Refactored Section 6 with a responsive pattern—retained the full original comparative matrix on desktop (`hidden md:block`) while adding a single-column dimension stack for mobile viewports (`block md:hidden`), eliminating horizontal overflow.
- **Section 7 WCAG 2.1 AA Checklist Accessibility**: Upgraded candidate reflection self-diagnostic buttons with full ARIA semantics (`role="checkbox"`, `aria-checked`, `tabIndex={0}`, keyboard `Enter`/`Space` handlers, and `focus-visible` outline rings).
- **Section 13 Gateway Link Anchors**: Updated decision gateway links to target `#admission-start` and `#prep-start` on subsequent pillar pages.

---

## 2026-10-16 — B.Cyber Pillar 1 Working Optimization & SEO Schema Complete

### Changes & Optimizations
- **JSON-LD Structured Data Schema**: Injected `EducationalOccupationalProgram` (IIT Kanpur B.Cyber degree credentials, provider WSAIS, 4-year timeline) and `FAQPage` (all 8 official FAQs) via `useSEO` for rich Google search snippet eligibility.
- **Section 7 Link Fix**: Corrected non-existent route link to in-page anchor `#curriculum-heading` for smooth navigation.
- **Section 8 (Credential Parity)**: Elevated 3 sub-cards (`Official Degree Award`, `Alumni Privileges`, `Global Higher Studies`) with squircle icon badges, Senate ordinance tags, and hover micro-transitions matching Sections 2 & 4.
- **Section 11 (FAQ Accordion)**: Elevated with smooth chevron transition, active highlight styling, and WCAG accessibility attributes (`aria-expanded`, `aria-controls`).

---

## 2026-10-15 — B.Cyber Blueprint Pillar 1 UI Structure Elevation Completed

### Milestone Status
- **Pillar 1 (Understand B.Cyber — Homepage Blueprint)**: UI/UX layout, responsive surfaces, spacing rhythm, and visual hierarchy complete. Only content/copy refinement is left.
- **Section 0 (Hero & Metrics)**: Polished trust badge, standardized 4-metric strip with hover micro-transitions.
- **Section 1 (30-Sec Summary)**: Clean dual-column container with executive high-speed specs.
- **Section 2 (Key Facts Matrix)**: Permanent 2×2 grid with numbered indices `01`–`04`, clean metadata chips.
- **Section 3 (2+2 Model)**: High-clarity 2-stage milestone stepper card + symmetrical Phase 1 vs Phase 2 breakdown.
- **Section 4 (Curriculum & Subjects)**: Pristine unified white container, squircle icons (`w-9 h-9`), single badges, and right-aligned credit chips.
- **Section 5 (Beyond Hacking 5 Core Pillars)**: Balanced 5-item grid, Lucide icons, curriculum anchor tags.
- **Section 6 (Degree Comparison Table)**: Maintained and locked in original clean comparative table format.
- **Sections 7–13**: Candidate fit self-reflection, credential parity, career realities, myths vs facts, FAQ accordion, editorial standards, and dual action gateway.

---

## 2026-06-09 — Workshop System Production Audit

### Changes Made

#### Schema Upgrades
- **Added fields to Workshop type**: `slug`, `recordingUrl`, `meetingPlatform`, `reminderSchedule`, `DRAFT` status
- **Added fields to WorkshopRegistration type**: `confirmationSentAt`, `remindersSent`
- **Updated CMS schemas** with all new fields

#### Email System
- **Created 4 new email templates**: RegistrationConfirmation, ReminderEmail (parameterized), RecordingAvailable, CancellationNotice
- **Enhanced existing** WorkshopLiveNotification template
- **Created unified API endpoint** `api/workshop-email.ts` handling 5 actions: send-confirmation, send-reminder, send-live-notification, send-recording, send-cancellation

#### Admin Dashboard
- **Created `WorkshopDashboard` component** with stats (total/draft/upcoming/live/completed/cancelled), registration stats, per-workshop email action buttons
- **Integrated dashboard** into AdminPage Workshops tab
- **Thumbnail preview** in SchemaDrivenList with broken image fallback

#### Frontend
- **VaultPage**: Added "Watch Recording" button for COMPLETED workshops with recordingUrl
- **MasteryWorkshops**: Triggers registration confirmation email immediately after `addDoc`

#### Bug Fixes
- Fixed `refreshSecondary is not defined` crash (added missing function declaration)
- Fixed duplicate registration detection in MasteryWorkshops
- Fixed "Reserved" button persistence across page refresh
- Fixed `currentSchema` being null for workshops tab (schemaMap missing entries)

### Files Created
| File | Purpose |
|---|---|
| `api/workshop-email.ts` | Unified workshop email endpoint (5 actions) |
| `api/emails/WorkshopRegistrationConfirmation.ts` | Registration confirmation email |
| `api/emails/WorkshopReminderEmail.ts` | Parameterized reminder email |
| `api/emails/WorkshopRecordingAvailable.ts` | Recording available email |
| `api/emails/WorkshopCancellationNotice.ts` | Cancellation notice email |
| `src/components/admin/workshops/WorkshopDashboard.tsx` | Admin dashboard + email controls |
| `docs/platform-standards.md` | Platform standards documentation |
| `docs/feature-status.md` | Feature status tracking |
| `docs/known-issues.md` | Known issues tracking |
| `docs/change-log.md` | Change log |

### Files Modified
| File | Changes |
|---|---|
| `src/types/index.ts` | Added slug, recordingUrl, meetingPlatform, reminderSchedule, confirmationSentAt, remindersSent |
| `src/config/cms-schemas.ts` | Added 5 new fields, DRAFT status, read-only fields |
| `src/pages/AdminPage.tsx` | Imported WorkshopDashboard, updated workshops tab |
| `src/pages/VaultPage.tsx` | Watch Recording button for COMPLETED |
| `src/components/sections/MasteryWorkshops.tsx` | Confirmation email trigger after registration |
| `src/components/admin/cms/SchemaDrivenList.tsx` | Thumbnail image rendering |
| `src/hooks/admin/useAdminData.ts` | Fixed refreshSecondary crash |

## 2026-06-09 — Workshop System Finalization

### Bug Fixes
- **Admin email buttons**: Added `send-confirmation-all` API handler (sends confirmation to all registrants). Dashboard now passes `reminderType` (24h/1h/5m) for reminder actions. Added missing 5-minute reminder button.
- **Registration persistence**: After successful `addDoc`, `registeredWorkshopIds` state is updated immediately so "Reserved" button appears without page refresh.
- **Public thumbnail**: Added thumbnail image rendering to MasteryWorkshop cards with broken-image fallback.
- **Status badges**: MasteryWorkshops now handles DRAFT and CANCELLED status badges.

### Files Modified
| File | Changes |
|---|---|
| `api/workshop-email.ts` | Added `sendConfirmationAll` handler, registered `send-confirmation-all` action |
| `src/components/admin/workshops/WorkshopDashboard.tsx` | Passes `reminderType` to API, uses `send-confirmation-all`, added 5m button, removed non-functional duplicate |
| `src/components/sections/MasteryWorkshops.tsx` | Updates `registeredWorkshopIds` after registration, added thumbnail + DRAFT/CANCELLED badges |

### Remaining Issues (see known-issues.md)
- Paid workshop checkout (Stripe integration)
- Coupon + creator attribution for paid workshops
- Automatic scheduled reminders (cron job needed)
- Email delivery status UI
