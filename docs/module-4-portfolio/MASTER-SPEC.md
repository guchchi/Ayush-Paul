# MODULE 4 — PORTFOLIO SYSTEM MASTER SPECIFICATION

**Status:** FROZEN  
**Version:** 1.0  
**Date:** 2026-07-13  

---

## 1. PRODUCT DEFINITION

**Module 3 answered:** *What should I prove and how should I position myself?*

**Module 4 answers:** *How do I turn that into an actual portfolio that convinces my specific buyer to trust and hire me?*

Module 4 is an **execution system**, not a strategy system. It takes the completed Module 3 authority strategy and transforms it into a buyer-facing Portfolio Build Pack — a structured specification detailing exactly what to build, which project goes where, how to present each proof asset, what platform to use, and how to publish.

**Guarantee:** Every user who completes Module 4 walks away with an actionable build specification that produces a materially different portfolio depending on their service, market, niche, authority position, and offer.

---

## 2. NON-NEGOTIABLE PRINCIPLES

1. **No generic workflow.** Every portfolio strategy must materially differ by service, market, niche, authority position, and offer. A `short_form_editor → fitness_coaches` portfolio must NOT look like a `short_form_editor → business_coaches` portfolio.

2. **No Module 3 duplication.** Module 4 must NOT ask the user to recreate: profile headline, bio, trust promise, proof strategy, proof asset ideas, generic portfolio section copy, or checklist items. All of these exist in Module 3 and must be transformed, not regenerated.

3. **Honest proof rules.** Module 4 must never suggest invented outcomes, fabricated metrics, fake testimonials, or misleading evidence. All proof is sourced from Module 3's proof assets. Any sample project must be explicitly labelled as a sample.

4. **No hardcoded free-work CTAs.** CTAs must be service-appropriate, not generic "send me your video and I'll edit it for free." Each CTA reflects the service family's actual buyer conversation.

5. **Actual Module 1 IDs only.** All service, market, and niche identifiers must match the actual source data in `src/data/module1/module1-content.ts`. No invented IDs.

6. **Append / replace / rank / reorder only.** No layer in the personalisation stack blindly replaces the entire portfolio output. Each layer operates on specific fields.

7. **Manual edits preserved.** Never silently regenerate edited portfolio work. Track custom flags per field.

---

## 3. ACTUAL SOURCE ID COVERAGE

### 3.1 Career Tracks (3)

| ID | Label | Services |
|---|---|---|
| `editor` | Editor | 5 subtracks |
| `developer` | Developer | 5 subtracks |
| `designer` | Designer | 5 subtracks |

**Source:** `module1-content.ts:48` — `MAIN_TRACK_OPTIONS`

### 3.2 Services / SubTracks (15, all `isActive: true`)

**Editor track:**
`video_editor`, `short_form_editor`, `youtube_editor`, `podcast_clip_editor`, `ad_creative_editor`

**Developer track:**
`wordpress_developer`, `landing_page_developer`, `no_code_developer`, `frontend_developer`, `automation_developer`

**Designer track:**
`ui_ux_designer`, `landing_page_designer`, `brand_designer`, `social_media_designer`, `presentation_designer`

**Source:** `module1-content.ts:56-182` — subTracks under each `MAIN_TRACK_OPTIONS` entry

### 3.3 Markets by Service

Each service has exactly 5 markets. Active markets (`isActive: true`) are listed first; inactive markets are still valid as they appear in the selection UI:

| Service ID | Active Market IDs | Inactive Market IDs |
|---|---|---|
| `video_editor` | `youtube_creators` | `coaches`, `agencies`, `local_businesses`, `personal_brands` |
| `short_form_editor` | `creators`, `coaches`, `agencies`, `local_businesses`, `personal_brands` | — |
| `youtube_editor` | `youtube_creators`, `course_creators`, `podcasters`, `educators`, `personal_brands` | — |
| `podcast_clip_editor` | `podcasters`, `creators`, `coaches`, `agencies`, `business_owners` | — |
| `ad_creative_editor` | `ecommerce_brands`, `marketing_agencies`, `coaches`, `saas_startups`, `local_businesses` | — |
| `wordpress_developer` | `local_businesses` | `coaches_consultants`, `startups_saas`, `agencies`, `creators_course_sellers` |
| `landing_page_developer` | `coaches`, `course_creators`, `saas_startups`, `local_businesses`, `agencies` | — |
| `no_code_developer` | `startups`, `coaches_consultants`, `creators`, `agencies`, `local_businesses` | — |
| `frontend_developer` | `saas_startups`, `agencies`, `startups`, `creators`, `local_businesses` | — |
| `automation_developer` | `agencies`, `coaches_consultants`, `ecommerce_brands`, `local_businesses`, `creators` | — |
| `ui_ux_designer` | `coaches` | `saas_startups`, `creators`, `agencies`, `local_businesses` |
| `landing_page_designer` | `coaches`, `course_creators`, `saas_startups`, `local_businesses`, `agencies` | — |
| `brand_designer` | `creators`, `coaches_consultants`, `startups`, `local_businesses`, `agencies` | — |
| `social_media_designer` | `creators`, `coaches`, `agencies`, `local_businesses`, `ecommerce_brands` | — |
| `presentation_designer` | `startups`, `coaches_consultants`, `agencies`, `creators`, `business_owners` | — |

**Source:** `module1-content.ts:186-1203` — `ALL_MARKETS`

### 3.4 Niches

Each service × market combination has 5 niche entries in `ALL_NICHES`. Total niche combinations across all active markets: 15 services × 5 markets × ~5 niches ≈ ~375 niche entries.

**Source:** `module1-content.ts:1205+` — `ALL_NICHES`

### 3.5 Offer Data

Offer-level details (pricing, delivery format, positioning templates, client sources) are defined per niche in `master-data.ts` with `MASTER_TRACKS`. This data is Phase 1 simulator data and is NOT consumed by Module 4 directly, but the offer names and pricing structures inform Module 4's output templates.

---

## 4. PERSONALISATION ARCHITECTURE

### 4.1 Personalisation Stack

```
Layer 1: AUTHORITY POSITION
  Input:  authorityPosition ('builder'|'auditor'|'deconstructor'|'practitioner')
  Effect: Sets initial proof layout priority, section order
  Behaviour: RANK-REORDER

Layer 2: SERVICE EXECUTION PROFILE
  Input:  serviceId
  Effect: Portfolio medium, project format, evidence type
  Behaviour: REPLACE format defaults

Layer 3: MARKET BUYER PROFILE
  Input:  marketId
  Effect: Buyer concern hierarchy, trust signal priority, language
  Behaviour: RANK-RANK

Layer 4: NICHE MODIFIER
  Input:  nicheId
  Effect: Specific examples, audience terminology, evidence examples
  Behaviour: APPEND + REPLACE

Layer 5: OFFER MODIFIER
  Input:  offerType, deliverables, uniqueMechanism, scopeLimits, valueAmplifier
  Effect: Deliverables checklist, timeline, differentiator
  Behaviour: APPEND

Layer 6: PROOF PLACEMENT
  Input:  proofPriorities[], proofAssets[] (from Module 3)
  Effect: Maps 3 assets to featured/secondary/supporting positions
  Behaviour: RANK

Layer 7: FINAL COMPOSITION
  Input:  All prior layers + profileCopy + portfolioCopy (Module 3)
  Effect: Compiles final PortfolioBuildPack
  Behaviour: ASSEMBLE
```

### 4.2 Personalisation Dimension Matrix

| Dimension | Affects | Behaviour |
|---|---|---|
| `authorityPosition` | Section order, proof layout priority | RANK-REORDER |
| `coreTrustPromise` | Portfolio headline angle, trust statement | REPLACE |
| `serviceId` | Portfolio platform, project format, evidence medium | REPLACE |
| `marketId` | Buyer concern hierarchy, language register | RANK |
| `nicheId` | Audience terminology, example projects, evidence type | APPEND + REPLACE |
| `offerType` | Deliverables checklist, scope framing | APPEND |
| `deliverables[]` | Checklist items, project scope expectations | APPEND |
| `uniqueMechanism` | Differentiator positioning in portfolio copy | APPEND |
| `scopeLimits` | What NOT to claim, boundary transparency | REPLACE |
| `valueAmplifier` | Bonus / upsell positioning | APPEND |
| `proofPriorities[]` | Which proof asset is featured/secondary/supporting | RANK |
| `proofAssets[]` | Exactly what media/evidence goes in each project slot | PLACE |
| `profileCopy` | Headline, bio, offer statement for portfolio copy | TRANSFORM |
| `portfolioCopy` (M3) | Section structure, CTA, existing copy foundation | TRANSFORM |

---

## 5. PLATFORM STRATEGY

**V1 approach: Platform Recommendation Engine (hybrid B)**

The system recommends one or two platforms based on service family. The user confirms, changes, or overrides.

| Service | Primary Recommendation | Secondary Recommendation |
|---|---|---|
| `video_editor`, `youtube_editor` | Personal website (Framer/Carrd) + embed gallery | YouTube channel page |
| `short_form_editor` | Carrd + social embed showcase | TikTok/IG portfolio page |
| `podcast_clip_editor` | Framer + podcast episode embeds | Notion |
| `ad_creative_editor` | Framer case study site | Carrd |
| `wordpress_developer`, `frontend_developer` | Live site URLs + GitHub | Notion case studies |
| `landing_page_developer` | Live landing page URLs | Carrd |
| `no_code_developer` | Live app links + Notion process docs | Carrd |
| `automation_developer` | Notion case studies + Loom walkthroughs | Carrd |
| `ui_ux_designer`, `brand_designer` | Figma prototype + Behance/Dribbble | Personal website |
| `landing_page_designer` | Behance + live URLs | Personal website |
| `social_media_designer` | Instagram portfolio + Notion | Carrd |
| `presentation_designer` | SpeakerDeck + Notion | Personal website |

**Platform strategy does NOT require third-party API integration in V1.** The recommendation is stored as a string in the Portfolio Build Pack. The user builds the portfolio themselves.

---

## 6. HONEST PROOF RULES

1. **No invented outcomes.** Every claim in the portfolio must trace back to a Module 3 proof asset.
2. **No fabricated metrics.** Retention numbers, conversion rates, and growth stats are never generated by Module 4. If Module 3 produced them, they carry forward; otherwise omitted.
3. **No fake testimonials.** Testimonial sections are labelled "Placeholder — add real client testimonial."
4. **Sample projects labelled.** Every sample project must include "(Sample)" in its title and a note: "This is a sample project. Replace with your actual client work."
5. **CTA authenticity.** CTAs reflect real next steps: "Book a call" for coaches, "Free site audit" for developers, "Request a Figma review" for designers. No "Send me your video and I'll edit it for free" — unless the business model literally offers free samples.
6. **Scope transparency.** If the user's Module 2 scope limits exclude certain deliverables, the portfolio explicitly states: "Not currently offering [excluded service]."

---

## 7. MODULE 3 DUPLICATION AUDIT — RESOLVED

| Module 3 Feature | Module 4 Handling |
|---|---|
| authorityPosition | TRANSFORMED: determines section order, proof layout |
| coreTrustPromise | TRANSFORMED: adapted into portfolio trust statement |
| proofPriorities (3 gaps) | TRANSFORMED: becomes project placement order |
| proofAssets (3 assets) | PLACED: featured / secondary / supporting |
| profileCopy (headline, bio, trust bullets, CTA) | TRANSFORMED: adapted into portfolio copy |
| portfolioCopy (sections[], portfolioCta) | TRANSFORMED: used as foundation, not regenerated |
| checklist | KEPT: merged with Module 4 build checklist |
| per-asset ProofAssetPortfolioCopy | PLACED: each asset's existing copy used in project spec |
| authorityReadiness | VALIDATED: Module 4 blocked if not ready |

---

## 8. FROZEN DECISIONS

The following decisions are frozen and will NOT change during implementation:

1. Six steps is the final count (not five, not seven).
2. Platform recommendation is V1 hybrid (no API integration, no platform builder).
3. No LLM calls — all generation is deterministic string templates.
4. All proof assets from Module 3 are preserved — Module 4 does not create new assets.
5. The Portfolio Build Pack is a structured TypeScript object, not a document.
6. Stale-context detection uses a fingerprint that includes ALL meaningful upstream fields.
7. Module 4 never silently resets user edits — always warn, always offer choice.
8. All CTAs are service-family-appropriate and never suggest free work.
9. All sample projects are explicitly labelled.
10. Every personalisation layer uses append/replace/rank/reorder — never blind replacement.
