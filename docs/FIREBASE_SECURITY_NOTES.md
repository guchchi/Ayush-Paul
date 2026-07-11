# Firebase & Firestore Security Notes

This document summarizes the current security posture, rules design, and data isolation requirements for our Firebase / Firestore integration.

## Current Posture & Risk Assessment

Our integration tests (`scripts/security-tests.ts`) verify that the Firestore rules actively block unauthorized access to private data. The overall risk is **Low** because the database rules have been designed with a closed-by-default (deny all) architecture.

### Storage Rules Posture
Cloud Storage rules (`storage.rules`) are secure:
- Files not explicitly matched under `/blog_images`, `/blog_covers`, `/project_images`, and `/milestones` are blocked by default (`allow read, write: if false;`).
- Writes are restricted to administrative uploads only, with checks on content type (`isImage()`) and file size (`under5MB()`).

---

## Data Classification & Access Levels

To preserve database integrity, collections are segregated into three tiers:

### 1. Public Content (Public Read, Admin Write)
These collections represent public site content and catalogues. Public visitors can read them, but writes are restricted to verified admins.
- `blogPosts`
- `projects`
- `updates`
- `products`
- `courses`
- `modules`
- `lessons`
- `workshops`
- `content`

### 2. User Submissions (Public Create, Admin Read)
These collections represent intake forms where public users submit information. Public users can create documents, but reading/modifying them requires admin privilege.
- `contact_messages`
- `collaboration_requests`
- `subscribers`
- `analytics_events`
- `mentorship_applications`
- `contacts`
- `newsletter`
- `course_waitlist`

### 3. Auth-Protected Private Data (Owner Read/Write, Admin Full)
These collections contain personal user data, progress metrics, and transaction logs. Access is governed by ownership or admin privilege.
- `users`: User profile settings. Firestore rules explicitly block self-escalation of the `role` field and prevent self-granting of `ownedProducts` premium tokens.
- `blueprint_progress`: Progress maps scoped to the authenticated user's UID (validated via `docId.startsWith(request.auth.uid)`).
- `enrollments`: Course enrollment links restricted to the owner's UID.
- `purchases`: Transaction history. Read access is restricted to the owner or admin.
- `workshop_registrations`: Registrations for workshops. Read access is restricted to the registered user or admin.

### 4. Admin-Only Collections (Admin Read/Write Only)
These collections manage coupon promotions, creator commissions, email queues, and streaks. No public or normal authenticated user can access them.
- `creator_codes`
- `creator_sales_log`
- `coupons`
- `scheduled_emails`
- `share_events`
- `streak_milestones`
- `newsletter_campaigns`
- `referrals`
- `user_unlocks`
- `blueprints`

---

## Future Security Guidelines & Best Practices

1. **Custom Claims for Admin Roles**:
   Currently, admin checks in `firestore.rules` verify both the hardcoded admin UID and checks the database document `/admin_users/{uid}`. To optimize query quotas and scale, implement custom claims on User Records (e.g. `{ admin: true }`) so that Firestore rules can verify admins instantly without a document read:
   ```javascript
   function isAdmin() {
     return request.auth != null && request.auth.token.admin == true;
   }
   ```
2. **Do Not Store Private Files in Public Buckets**:
   Always ensure any digital downloads or private blueprints are served through serverless functions (like `/api/download-product`) or storage rules that check paid status, rather than storing them in public subdirectories or public storage buckets.
