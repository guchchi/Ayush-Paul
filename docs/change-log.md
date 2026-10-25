# Change Log — AyushPaul.in

> All significant changes to the platform, organized by date.

---

## 2026-10-25 — B.Cyber Pillar 2 (Admission & Eligibility) UI/UX Elevation (70/30 Layout & Sticky Companion)

### Changes & Optimizations
- **Asymmetrical 2-Column Hero**: Upgraded [BCyberAdmissionGuidePage.tsx](file:///c:/Users/ap877/2026/Ayush-Paul/src/pages/blueprints/b-cyber/BCyberAdmissionGuidePage.tsx) from a centered text wireframe to an asymmetrical 2-column hero (`col-span-7` narrative + `col-span-5` interactive live Admission Snapshot card) matching the proven design standards of *Get Your First 3 Clients*.
- **70/30 Layout with Sticky Companion Sidebar**: Re-architected all 10 editorial sections into a balanced 2-column flex layout (`flex flex-col lg:flex-row gap-10 lg:gap-12`):
  - **Left Narrative Column (~70%)**: Houses Sections 1 to 10 with high-contrast `#0b1c30` typography, clean `#c2c6d6/25` borders, numbered step badges (`01`, `02`), and eliminated wall-of-text fatigue.
  - **Right Sticky Sidebar (~30% / 320px)**: Persistent companion featuring an in-page 10-section navigator with live anchors, high-contrast Action Hub with instant links to Pillar 3 Preparation Roadmap, real-time readiness checklist tracker, and official institutional citation links.
- **Enhanced Visual Tokens**: Replaced muddy slate tones with crisp pure white card surfaces, `#0058be` accents, `#d1f34d` action punch, and clean pill badges.
- **Build & Typecheck Passed**: Verified zero TypeScript errors (`npx tsc --noEmit`) and successful production bundle build (`npx vite build`).

---

## 2026-10-20 — B.Cyber Pillar 3 (Preparation Roadmap) Streamlined Direct Elevation

### Changes & Optimizations
- **Direct Roadmap Focus**: Transformed [BCyberPreparationPlannerPage.tsx](file:///c:/Users/ap877/2026/Ayush-Paul/src/pages/blueprints/b-cyber/BCyberPreparationPlannerPage.tsx) into a compact, direct, action-first technical preparation roadmap, removing 4 sections of preamble/fluff and giving students instant access to the core 5-stage curriculum.
- **Harmonized Design Architecture**: Upgraded to match Pillar 1 & 2 design standards (`max-w-6xl` container, `#fafbfc` background, squircle badges, `scroll-mt-28` canonical anchor clearance, and consistent typography).
- **Core Editorial Sections**:
  - **Section 0 (`#prep-start`)**: Hero with trust badge, 4-metric executive strip, and fast-track action buttons directly to roadmap stages, free labs, and evidence template.
  - **Section 1 (`#roadmap-stages`)**: Immediate access to the 5-stage practical curriculum (`BCyberRoadmapStageList`) with visual progression stepper.
  - **Section 2 (`#resource-library`)**: Curated free resource directory (`BCyberResourceDirectory`) featuring OverTheWire, PortSwigger, PicoCTF, and Wireshark.
  - **Section 3 (`#proof-of-work`)**: Evidence of prior work (FAQ 22) high-signal vs red flags guide and copyable standard project markdown template.
  - **Section 4 (`#practice-tasks`)**: Hands-on problem-solving exercises (`BCyberPracticeExercises`).
  - **Section 5 (`#weekly-pace`)**: Interactive study schedule selector (Casual, Balanced, Sprint) and 40/40/20 weekly balance model.
  - **Section 6 (`#prep-faqs`)**: Direct-answer preparation FAQ accordion answering key background and hardware questions.
  - **Section 7 (`#next-steps`)**: High-contrast decision gateway (`#0b1c30` card with `#d1f34d` action button linking to Pillar 2 `#admission-start` and Pillar 1 `#overview-start`).
- **Structured JSON-LD SEO Schema**: Injected `Course` and `FAQPage` schemas via `useSEO`.
- **Bundle Optimization**: Reduced bundle size from 114.6 kB to 77.8 kB for faster load times.

---

## 2026-10-19 — B.Cyber Pillar 2 (Admission & Eligibility) Design & Architecture Elevation

### Changes & Optimizations
- **Design Alignment with Pillar 1**: Transformed [BCyberAdmissionGuidePage.tsx](file:///c:/Users/ap877/2026/Ayush-Paul/src/pages/blueprints/b-cyber/BCyberAdmissionGuidePage.tsx) to match Pillar 1's exact design language (`max-w-6xl` container, `#fafbfc` backdrop, squircle badges, `scroll-mt-28` canonical anchor clearance, and consistent typography hierarchy).
- **12 Locked Sections Fully Implemented**: Built out the full editorial sequence according to `docs/b-cyber-admission-wireframes.md`:
  - **Section 0 (`#admission-start`)**: Hero with trust badge pill, 4-metric executive strip, and fast-track action jumps.
  - **Section 1 (`#admission-summary`)**: Executive 30-second Direct Answer card with 3-stage high-speed spec sequence.
  - **Section 2 (`#cycle-status`)**: Admission Cycle Status Board with 5-part taxonomy badges, cycle filter toggle, desktop table (`hidden md:block`), and mobile dimension stack (`block md:hidden`).
  - **Section 3 (`#eligibility-check`)**: Integrated cycle-aware statutory eligibility screener.
  - **Section 4 (`#eligibility-rules`)**: 4-card permanent matrix (`01`–`04` indices) for academic, age, nationality, and JoSAA attempt rules with boundary alerts.
  - **Section 5 (`#selection-process`)**: Dual-lane visual comparison (Lane A: 2026 Precedent vs Lane B: 2027 Confirmed Shift) + consumer caution warning against unverified coaching syllabi.
  - **Section 6 (`#practical-assessment`)**: Practical hackathon operational specs and 8 security domains (`BCyberHackathonMatrix`).
  - **Section 7 (`#prior-work`)**: Evidence of prior work standards and FAQ 22 portfolio rubric (`BCyberProofOfWorkFilter`).
  - **Section 8 (`#application-readiness`)**: Logistics specifications and interactive 4-item browser readiness checklist with progress meter and WCAG checkbox accessibility.
  - **Section 9 (`#admission-faqs`)**: Accessible accordion answering the 6 core candidate FAQ clusters.
  - **Section 10 (`#official-sources`)**: Verified sources directory, claim-to-FAQ citations, and searchable policy database.
  - **Section 11 (`#next-step`)**: High-contrast decision gateway (`#0b1c30` card with `#d1f34d` action button linking to Pillar 3 `#prep-start` and Pillar 1 `#overview-start`).
- **Structured JSON-LD SEO Schema**: Injected `EducationalOccupationalProgram` and `FAQPage` via `useSEO`.

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
