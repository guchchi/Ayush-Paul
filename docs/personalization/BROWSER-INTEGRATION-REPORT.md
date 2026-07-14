# Browser Integration Test Report

**Date:** 2026-07-14
**Total Paths:** 6

## Summary

| Check | Result |
|-------|--------|
| Console errors | ⚠️ Found in 2 path(s)
| M2 content differentiation (4 unique / 4 paths) | ✅ Pass
| M3 content differentiation (6 unique / 6 paths) | ✅ Pass
| M4 content differentiation (5 unique / 5 paths) | ✅ Pass
| Persistence (navigate away & back) | ⚠️ Some fail
| Stale context detection | ✅ Detected
| Responsive (320px) | ✅ All pass

## Path Details

### Video Editor → Short-Form Clips → Health & Wellness → Yoga Instructors (`path-1-video-yoga`)

- **M1 context:** video_editor → short_form_clips → health_wellness_creators → yoga_instructors_reels
- **M2 text snippet:** 
- **M3 text snippet:** Authority System  MODULE 3  BACK TO OVERVIEW  100% Complete  STEP 01  Authority Position  STEP 02  Proof Strategy  STEP 03  Proof Asset Builder  STEP 04  Profile & Portfolio  STEP 05  Authority Pack  
- **M4 text snippet:** Portfolio System  PHASE 4  Portfolio Direction Destination & Structure Project Arrangement Project Presentations Copy & CTA Portfolio Build Pack  AUTHORITY & OFFER  SERVICE  short_form_clips  OPPORTUN
- **Console errors:** [2026-07-14T07:41:43.894Z]  @firebase/firestore: Firestore (12.11.0): Could not reach Cloud Firestore backend. Connection failed 1 times. Most recent error: FirebaseError: [code=unavailable]: The operation could not be completed
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.
- **Persistence:** ✅
- **Stale context:** ✅
- **Responsive (320px):** ✅

### Video Editor → Long-Form Content → YouTube Creators → YouTubers (`path-2-video-youtube`)

- **M1 context:** video_editor → long_form_content → youtube_creators → youtubers_retention
- **M2 text snippet:** 
- **M3 text snippet:** Authority System  MODULE 3  BACK TO OVERVIEW  100% Complete  STEP 01  Authority Position  STEP 02  Proof Strategy  STEP 03  Proof Asset Builder  STEP 04  Profile & Portfolio  STEP 05  Authority Pack  
- **M4 text snippet:** Portfolio System  PHASE 4  Portfolio Direction Destination & Structure Project Arrangement Project Presentations Copy & CTA Portfolio Build Pack  AUTHORITY & OFFER  SERVICE  long_form_content  OPPORTU
- **Console errors:** None
- **Persistence:** ✅
- **Stale context:** ✅
- **Responsive (320px):** ✅

### WordPress Developer → Custom Theme → Local Businesses → Restaurants (`path-3-wp-restaurants`)

- **M1 context:** wordpress_developer → custom_theme_development → local_businesses → restaurants
- **M2 text snippet:** BACK TO OVERVIEW Offer Engineering  100% Complete  STEP 01  Offer Type  STEP 02  Deliverables  STEP 03  Unique Mechanism  STEP 04  Scope Protection  STEP 05  Value Amplifier  STEP 06  Pricing  STEP 07
- **M3 text snippet:** Authority System  MODULE 3  BACK TO OVERVIEW  100% Complete  STEP 01  Authority Position  STEP 02  Proof Strategy  STEP 03  Proof Asset Builder  STEP 04  Profile & Portfolio  STEP 05  Authority Pack  
- **M4 text snippet:** 
- **Console errors:** None
- **Persistence:** ✅
- **Stale context:** ✅
- **Responsive (320px):** ✅

### UI/UX Designer → Product UI Design → Early-Stage Startups → Pre-seed MVP (`path-4-ui-startups`)

- **M1 context:** ui_ux_designer → product_ui_design → early_stage_startups → pre_seed_mvp_ui
- **M2 text snippet:** BACK TO OVERVIEW Offer Engineering  100% Complete  STEP 01  Offer Type  STEP 02  Deliverables  STEP 03  Unique Mechanism  STEP 04  Scope Protection  STEP 05  Value Amplifier  STEP 06  Pricing  STEP 07
- **M3 text snippet:** Authority System  MODULE 3  BACK TO OVERVIEW  100% Complete  STEP 01  Authority Position  STEP 02  Proof Strategy  STEP 03  Proof Asset Builder  STEP 04  Profile & Portfolio  STEP 05  Authority Pack  
- **M4 text snippet:** Portfolio System  PHASE 4  Portfolio Direction Destination & Structure Project Arrangement Project Presentations Copy & CTA Portfolio Build Pack  AUTHORITY & OFFER  SERVICE  product_ui_design  OPPORTU
- **Console errors:** None
- **Persistence:** ❌
- **Stale context:** ✅
- **Responsive (320px):** ✅

### Video Editor → Podcast Post-Production → Business Podcasts → Founder Interview (`path-5-podcast-founders`)

- **M1 context:** video_editor → podcast_post_production → business_podcasts → founder_interview_podcasts
- **M2 text snippet:** BACK TO OVERVIEW Offer Engineering  100% Complete  STEP 01  Offer Type  STEP 02  Deliverables  STEP 03  Unique Mechanism  STEP 04  Scope Protection  STEP 05  Value Amplifier  STEP 06  Pricing  STEP 07
- **M3 text snippet:** Authority System  MODULE 3  BACK TO OVERVIEW  100% Complete  STEP 01  Authority Position  STEP 02  Proof Strategy  STEP 03  Proof Asset Builder  STEP 04  Profile & Portfolio  STEP 05  Authority Pack  
- **M4 text snippet:** Portfolio System  PHASE 4  Portfolio Direction Destination & Structure Project Arrangement Project Presentations Copy & CTA Portfolio Build Pack  AUTHORITY & OFFER  SERVICE  podcast_post_production  O
- **Console errors:** [2026-07-14T07:43:00.754Z]  @firebase/firestore: Firestore (12.11.0): Could not reach Cloud Firestore backend. Connection failed 1 times. Most recent error: FirebaseError: [code=unavailable]: The operation could not be completed
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.
- **Persistence:** ✅
- **Stale context:** ✅
- **Responsive (320px):** ✅

### UI/UX Designer → Landing Page Design → Coaches → Fitness Coaches (`path-6-ui-fitness`)

- **M1 context:** ui_ux_designer → landing_page_design → coaches → fitness_coaches
- **M2 text snippet:** BACK TO OVERVIEW Offer Engineering  100% Complete  STEP 01  Offer Type  STEP 02  Deliverables  STEP 03  Unique Mechanism  STEP 04  Scope Protection  STEP 05  Value Amplifier  STEP 06  Pricing  STEP 07
- **M3 text snippet:** Authority System  MODULE 3  BACK TO OVERVIEW  100% Complete  STEP 01  Authority Position  STEP 02  Proof Strategy  STEP 03  Proof Asset Builder  STEP 04  Profile & Portfolio  STEP 05  Authority Pack  
- **M4 text snippet:** Portfolio System  PHASE 4  Portfolio Direction Destination & Structure Project Arrangement Project Presentations Copy & CTA Portfolio Build Pack  AUTHORITY & OFFER  SERVICE  landing_page_design  OPPOR
- **Console errors:** None
- **Persistence:** ✅
- **Stale context:** ✅
- **Responsive (320px):** ✅

## Verdict

| Criterion | Status |
|-----------|--------|
| Content differentiated across paths | ✅ PASS
| No runtime console errors | ❌ FAIL
| Persistence after navigation | ❌ FAIL
| Stale context detection | ✅ PASS
| Responsive at 320px | ✅ PASS

**Overall: 3/5 checks passed**

**⚠️ Some checks require attention.** See details above.
