# Change Log — AyushPaul.in

> All significant changes to the platform, organized by date.

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
