# Shared Personalization Content System — Discovery & Architecture

---

## STATUS

Discovery complete. Architecture designed. Ready for implementation planning.

---

## CURRENT CONTENT PERSONALIZATION MAP

### Module 1 (Client Acquisition / Direction)

| Area | # Items | Personalization | Current Source |
|------|---------|----------------|----------------|
| Step labels / headings | ~30 | NO — static | Hardcoded JSX |
| Helper / instructional text | ~26 | NO — static | Hardcoded JSX |
| Button labels | ~25 | PARTIAL (progress) | Hardcoded JSX |
| Empty states | ~7 | NO — static | Hardcoded JSX |
| Default/fallback text | ~5 | PARTIAL (marketLabel) | Hardcoded template |
| Placeholder text | ~4 | PARTIAL (track) | Hardcoded |
| Example content | ~6 | NO — static | Hardcoded |
| Track/market/niche data | ~375 niches | YES (by composite key) | `data/module1/module1-content.ts` |
| Adapter mappings | ~75 | YES (by track+market) | `lib/module1/opportunityMapAdapter.ts` |
| Direction statement variants | ~3 | YES (service+market+niche) | Hardcoded adapter map |
| Error messages | ~3 | PARTIAL (ID interpolation) | Hardcoded template |

**Personalization depth:** Shallow — selections are displayed back to user. No generated content references user's actual profile, name, or business. Track/market/niche data is read-only selection UI.

### Module 2 (Offer Engineering)

| Area | # Items | Personalization | Current Source |
|------|---------|----------------|----------------|
| Step labels / headings | ~40 | NO — static | Hardcoded JSX |
| Helper / instructional text | ~25 | NO — static | Hardcoded JSX |
| Button labels | ~20 | NO — static | Hardcoded JSX |
| Empty states | ~10 | NO — static | Hardcoded JSX |
| Placeholder text | ~20 | NO — static | Hardcoded "e.g." strings |
| Default values (scope) | ~6 | YES (by service) | `master-data.ts` per-service defaults |
| Suggested deliverables | ~5-8/step | YES (by service+niche) | Data-driven fallback chain |
| Suggested mechanisms | ~3-4/step | YES (by service+niche) | Data-driven fallback chain |
| Suggested amplifiers | ~3/step | YES (by service) | Data-driven fallback chain |
| Path content (10 paths) | ~60 fields/path | YES (by specific path key) | Hardcoded `path-content.ts` |
| Generated proposal copy | ~5 sections | YES (cat+niche+service) | Template functions `contentQuality.ts` |
| Generated blueprint copy | ~5 sections | YES (cat+niche+service) | Template functions `contentQuality.ts` |
| Pricing context | ~10 strings | PARTIAL (service) | Hardcoded lookup |
| Offer type examples | ~10×3 | PARTIAL (service) | Hardcoded lookup |
| Validation reasons | ~7 | NO — static | Hardcoded in store |
| Load Defaults button | 1 | YES (service) | `pathScopeDefaults` / `scopeLimitsDefaults` |
| Value amplifier examples | ~10 shared + per-service | YES (service) | Hardcoded arrays |

**Personalization depth:** Medium — suggestions and defaults change per service and niche via pre-authored data files. Generated copy uses deterministic string templates with category/niche branching. No AI.

### Module 3 (Authority System — NEW)

| Area | # Items | Personalization | Current Source |
|------|---------|----------------|----------------|
| Step labels / headings | ~60 | NO — static | Hardcoded JSX |
| Helper / instructional text | ~35 | NO — static | Hardcoded JSX |
| Button labels | ~40 | NO — static | Hardcoded JSX |
| Empty states | ~8 | NO — static | Hardcoded JSX |
| Default/fallback values | ~15 | PARTIAL (service) | Hardcoded fallback maps |
| Recommended authority position | 1 | YES (score-based) | Deterministic scoring function |
| Core trust promise | 1 | YES (position+context) | String template with branching |
| Proof priorities (3) | 3 | YES (service+market+niche) | `resolveProofPriorities()` |
| Proof assets (3) | 3×full | YES (priority+service+niche) | `generateProofAsset()` |
| Profile copy | 6 fields | YES (all context) | `generateProfileCopy()` |
| Portfolio copy | sections | YES (all context) | `generatePortfolioCopy()` |
| Authority pack checklist | 11 items | PARTIAL (count) | Hardcoded `CHECKLIST_TEMPLATES` |
| Authority positions (4) | 4 descriptions | NO — static | Hardcoded definition data |
| Service/buyer label maps | ~30 entries | YES (service/market) | Hardcoded lookup maps |
| Buyer doubt map | ~12 types | YES (marketId) | Hardcoded doubt map |

**Personalization depth:** Deep — all generated content references upstream context (service, market, niche, offer, deliverables, positioning, etc.). All copy is deterministic string templates, not AI. Some fallback values are still generic.

### Module 4 (Portfolio System)

| Area | # Items | Personalization | Current Source |
|------|---------|----------------|----------------|
| Step labels / headings | ~60 | NO — static | Hardcoded JSX |
| Helper / instructional text | ~25 | NO — static | Hardcoded JSX |
| Button labels | ~25 | NO — static | Hardcoded JSX |
| Empty states | ~14 | NO — static | Hardcoded JSX |
| Service primitives (15) | ~10 fields/service | YES (by serviceId) | `SERVICE_PRIMITIVES` in composer.ts |
| Market modifiers (16) | ~8 fields/market | YES (by marketId) | `MARKET_MODIFIERS` in composer.ts |
| Niche modifiers (6) | ~7 fields/niche | YES (by nicheId) | `NICHE_MODIFIERS` in composer.ts |
| Portfolio direction | goal + reason | YES (offer+market+position) | `generatePortfolioDirection()` |
| Platform recommendation | destination | YES (service+market) | `generatePlatformRecommendation()` |
| Section structure | sections | YES (service+market+niche+position) | `generateSections()` |
| Project placements | placements | YES (market+position+priority) | `generateProjectPlacements()` |
| Project presentations | presentations | YES (asset+role+context) | `generateProjectPresentation()` |
| Portfolio copy architecture | headline+sections+CTA | YES (all context) | `generatePortfolioCopyArchitecture()` |
| Checklists | build+publish | PARTIAL (destination+sections) | `generateChecklists()` |
| Build pack markdown | full doc | YES (all context) | `compileBuildPack()` |

**Personalization depth:** Deepest in the system — 3-tier modifier architecture (service → market → niche) with deterministic composition. Service primitives are complete for all 15 service IDs. Market modifiers cover 16/17 markets. Niche modifiers only cover 6/114 unique niches (biggest gap).

---

## GENERIC CONTENT LEAKAGE

### Leak 1: Niche modifier gap (6 of 114 covered)

Only 6 niches have authored `NICHE_MODIFIERS`:
- `fitness_coaches`, `business_coaches`, `gaming`, `educational`, `restaurants`, `gyms`, `clinics`

**Leakage:** All ~108 other niches use generic fallback. A `short_form_editor` serving `creators` + `fitness` niche gets the **same** non-niche-specific portfolio guidance as a `short_form_editor` serving `creators` + `gaming` niche. The only differentiation comes from `MARKET_MODIFIERS` (market level) and `SERVICE_PRIMITIVES` (service level), which are identical for both.

### Leak 2: path-content.ts coverage (10 of 75 paths)

`path-content.ts` has pre-authored content for only 10 of 75 possible `subtrackId_marketId` combinations. The remaining 65 paths resolve through:
1. Market-level adapter map (75 entries) mapping to 10 service engineering IDs
2. `buildServiceFallback()` — generic template using `cat` (video/wordpress/design)
3. `buildCategoryFallback()` — fully generic fallback

**Leakage:** Two users with different sub-tracks (e.g. `video_editor` vs `youtube_editor`) but the same market (`youtube_creators`) often resolve to different path contents or fallbacks, but a user with `video_editor` + `youtube_creators` and a user with `video_editor` + `local_businesses` who fall to `buildCategoryFallback('video')` get **identical** generic content.

### Leak 3: Example strings across services

`OFFER_TYPE_META` has **empty** example strings for all 3 offer types (placeholder `''`). The `SERVICE_EXAMPLES` map covers 10 services × 3 types but uses generic names like `"Monthly content editing support for influencers"` — same template pattern reused.

**Leakage:** `short_form_editor` + `creators` example: `"Monthly short-form content editing for creators"`. `youtube_editor` + `creators` example: `"Monthly long-form video editing for YouTube creators"`. The only difference is the medium prefix — same structural template.

### Leak 4: Generic placeholder text across all modules

Positioning input: `placeholder="e.g. health coaches who post daily Reels"` — hardcoded to editor track regardless of actual user context. A `wordpress_developer` sees the same editing example placeholder.

Scope placeholders: `placeholder="e.g. 48 hours"`, `placeholder="e.g. 2"`, `placeholder="e.g. Async via Slack"` — identical across all services and niches.

### Leak 5: M3 profile copy fallback

When no proof assets are accepted: `credibilityBullets: ['Exploring demonstration projects to showcase capability']` and `proofReferenceLine: 'Proof assets in development'` — identical for all users regardless of service, market, or niche.

### Leak 6: M4 niche modifiers only at niche level

A `brand_designer` + `creators` + `personal_brand_creators` gets no niche modifier (not in the 6). A `social_media_designer` + `creators` + `personal_brand_creators` also gets no niche modifier. Both fall to service-level + market-level only — produces overlapping content despite different services + same niche.

### Leak 7: M4 portfolio copy fallback

`headline` fallback: `"{serviceLabel} for {buyerTerm}"` — same shape for all services.
`shortIntro` fallback: `"I help {buyerTerm} achieve their goals through {serviceLabel}."` — same shape for all.
`ctaBase` fallback: `"Get in touch to discuss your project"` — identical for all users.

### Sample comparison

| User A | User B | Leak? |
|--------|--------|-------|
| `short_form_editor` + `creators` + `fitness` | `short_form_editor` + `creators` + `gaming` | **YES** — no authored niche modifier for `fitness` (wait, `fitness_coaches` is one of the 6). `gaming` is also one of the 6. These two would actually differ. |
| `short_form_editor` + `coaches` + `fitness_coaches` | `youtube_editor` + `coaches` + `fitness_coaches` | **YES** at niche level — same niche modifier. But different service primitives. Moderate differentiation. |
| `video_editor` + `local_businesses` + `restaurants` | `frontend_developer` + `local_businesses` + `restaurants` | **PARTIAL** — different service primitives but same market modifier. Niche modifier exists only for `restaurants`. |
| `ui_ux_designer` + `saas_startups` + `saas_design` | `frontend_developer` + `saas_startups` + `saas_dev` | **YES** at niche level — neither `saas_design` nor `saas_dev` has an authored niche modifier. Both rely on `MARKET_MODIFIERS['saas_startups']` only. |
| `automation_developer` + `agencies` + `agency_workflow` | `automation_developer` + `local_businesses` + `local_automation` | **YES** at market level — different market modifiers so moderate difference. But same niche modifier gap. |

---

## CANONICAL PERSONALIZATION CONTEXT

### Recommended shape (read-only resolver, no persistence)

```typescript
interface PersonalizationContext {
  // From Module 1 (OpportunityMapStore)
  careerTrackId: string | null;      // 'editor' | 'developer' | 'designer'
  serviceId: string | null;           // Sub-track ID (15 options)
  serviceLabel: string;               // Human-readable service name
  marketId: string | null;            // Market ID (~17 options)
  marketLabel: string;                // Human-readable market name
  nicheId: string | null;            // Niche ID (114 unique options)
  nicheLabel: string;                // Human-readable niche name
  positioning: string;                // Direction statement text

  // From Module 2 (OfferEngineeringStore)
  offerType: string | null;          // 'retainer' | 'one_time_project' | 'milestone_based'
  offerTypeLabel: string;
  deliverables: string[];            // Scoped deliverable labels
  uniqueMechanism: string;           // Named mechanism
  scopeLimits: {                     // Scope boundaries
    deliveryTime: string;
    revisionCount: number;
    includedRounds: number;
    communicationChannel: string;
    responseTime: string;
  };
  valueAmplifier: string;            // Selected amplifier
  pricingModel: string | null;       // 'flat_rate' | 'tiered' | 'value_based'
  finalPrice: string;
  blueprintHeadline: string;
  blueprintAngle: {                  // From path content
    whoItIsFor: string;
    problemItSolves: string;
    corePromise: string;
    whyThisWorks: string;
    nextStepCTA: string;
  };

  // From Module 3 (useModule3Store)
  authorityPosition: AuthorityPosition | null;  // 'builder' | 'auditor' | 'deconstructor' | 'practitioner'
  coreTrustPromise: string;
  proofPriorities: ProofPriority[];
  proofAssets: ProofAsset[];          // All 3 assets with their fields
  acceptedProofCount: number;
  profileCopy: {
    professionalHeadline: string;
    shortBio: string;
    longBio: string;
    offerStatement: string;
    credibilityBullets: string[];
    proofReferenceLine: string;
    ctaLine: string;
  };
  portfolioCopy: {
    portfolioCta: string;
    sections: PortfolioSection[];
  };

  // Derived (computed once at composition time)
  audienceLabel: string;             // Human-readable audience
  buyerTerm: string;                 // "fitness coaches", "SaaS startups", etc.
  category: 'video' | 'wordpress' | 'design';
}
```

**Key rules:**
- Source of truth remains canonical stores (OpportunityMapStore, OfferEngineeringStore, useModule3Store)
- `PersonalizationContext` is **never persisted** — constructed on demand via a resolver function
- All label lookups use existing `getServiceLabel()`, `getBuyerLabel()` functions (refactored to shared location)
- `audienceLabel` and `buyerTerm` are derived from marketId/nicheId at resolution time
- `category` is derived from serviceId via existing track mapping

---

## 15 SERVICE PROFILE MAP

Each service profile should define:

```typescript
interface ServiceProfile {
  id: string;                        // Service ID
  label: string;                     // Display label
  track: 'editor' | 'developer' | 'designer';
  category: 'video' | 'wordpress' | 'design';

  // WORK VOCABULARY
  workNouns: string[];               // "footage", "clips", "code", "screens", "decks"
  workVerbs: string[];               // "edit", "build", "design", "develop", "cut"
  executionNouns: string[];          // "timeline", "workflow", "build process", "design system"
  outputNouns: string[];             // "video", "clip", "website", "prototype", "deck"

  // EXECUTION PRIMITIVES
  executionPrimitives: string[];     // "trim footage", "add transitions", "write queries"
  evidencePrimitives: string[];      // "before/after", "timeline comparison", "live URL"

  // COMMON INPUTS
  commonInputs: string[];            // "raw footage", "brand guidelines", "Figma files"
  commonOutputs: string[];           // "finished video", "live site", "design system"

  // PROJECT PATTERNS
  projectPatterns: {
    type: string;
    description: string;
    duration: string;
  }[];

  // RECOMMENDATION PATTERNS
  recommendationPatterns: {
    gap: string;                     // What this service type needs to prove
    format: string;                  // Best proof format
    defaultTitle: string;
  }[];

  // DEFAULT TENDENCIES
  defaultDestination: PortfolioDestination;
  defaultOfferType: string;          // Most common engagement model
  defaultMechanismPrefix: string;    // E.g. "Content", "Development", "Design"
  defaultPricingRange: { min: number; max: number };

  // EXAMPLE CONTEXTS
  exampleSubjects: string[];         // "gaming highlight", "podcast clip", "landing page"
  actionContexts: string[];          // "schedule upload", "review cuts", "publish content"
  languageTerms: string[];           // "watch time", "retention", "mobile-first", "scroll-stopping"

  // MISTAKES TO PREVENT
  avoidClaims: string[];             // Can't claim: expertise without samples, etc.
  mismatchWarnings: string[];        // "Don't call yourself a cinematographer"
}
```

### Current state of coverage

All 15 services already have `SERVICE_PRIMITIVES` in `composer.ts` covering:
- `medium`, `destinationPrefs`, `sectionPrimitives`
- `presentationSequence`, `evidencePrimitives`, `openingMedia`
- `buyerTrustConcerns`, `ctaTendency`, `mistakes`

Additionally, 7 services have detailed `SERVICE_PROFILES` in `proof-assets.ts` covering:
- `briefContext`, `materials`, `baseSteps`, `deliverables`
- `headlineBase`, `proofNarrative`

**Gap:** Missing 8 service profiles in `proof-assets.ts` (cover only: short_form_clips, youtube_editor, podcast_clip_editor, ad_creative_editor, wordpress_developer, ui_ux_designer, landing_page_design = 7; missing 8 including video_editor, frontend_developer, automation_developer, no_code_developer, brand_designer, social_media_designer, presentation_designer, landing_page_developer). Service profiles in proof-assets.ts are keyed by engineering service IDs (10), not sub-track IDs (15).

---

## MARKET MODIFIER MAP

```typescript
interface MarketModifier {
  marketId: string;
  label: string;

  // BUYER QUESTIONS: What the buyer is asking themselves
  buyerQuestions: string[];          // "Can they make content that stops the scroll?"

  // BUYER CONCERNS: Ordered hierarchy of what matters most
  concernHierarchy: string[];        // ['retention', 'engagement', 'consistency', 'style']

  // TRUST EXPECTATIONS: What signals trust to this buyer
  trustExpectations: string[];       // "Show retention improvement", "Show process clarity"

  // LANGUAGE TENDENCIES
  languageStyle: string;             // 'creator_direct' | 'professional_empathetic' | etc.
  languageTerms: string[];           // Words that resonate with this market

  // DECISION CRITERIA
  decisionCriteria: string[];        // "Demonstrated ability to retain audience"

  // CTA INTENT TENDENCIES
  ctaIntent: string;                 // 'review_approach' | 'discuss_needs' | 'see_more'

  // RECOMMENDATION RANKING INFLUENCE
  sectionRankingBoost: string[];     // Sections that matter most to this market

  // EXAMPLE FRAMING
  exampleFraming: string;            // How examples should be framed for this buyer
}
```

### Current state

16 of 17 markets have `MARKET_MODIFIERS` in `composer.ts` covering:
- `concernHierarchy`, `trustSignalPriority`, `proofEmphasis`
- `languageStyle`, `ctaIntent`, `sectionRankingBoost`

**Missing:** `educators` exists in `concernHierarchy` but how many markets total? Let me count the unique ones: youtube_creators, coaches, creators, agencies, local_businesses, personal_brands, course_creators, podcasters, educators, business_owners, ecommerce_brands, marketing_agencies, saas_startups, startups, coaches_consultants, startups_saas, creators_course_sellers = 17.

Actually `startups` and `startups_saas` might overlap. Let me check the 17 market IDs from the list: youtube_creators, coaches, agencies, local_businesses, personal_brands, creators, course_creators, podcasters, educators, business_owners, ecommerce_brands, marketing_agencies, saas_startups, coaches_consultants, startups_saas, startups, creators_course_sellers = 17.

MARKET_MODIFIERS has entries for: youtube_creators, coaches, creators, agencies, local_businesses, personal_brands, course_creators, podcasters, educators, business_owners, ecommerce_brands, marketing_agencies, saas_startups, startups, coaches_consultants, startups_saas, creators_course_sellers = 17 entries. But `'startups'` and `'startups_saas'` may overlap with actual market IDs.

OK, 17 markets with modifiers is solid.

---

## NICHE METADATA ARCHITECTURE

### Problem

- 375 niche entries across 75 composite keys
- 114 unique niche IDs
- Only 6 have authored `NICHE_MODIFIERS`
- Each composite key has ~5 niche entries (e.g. `short_form_editor_creators` has 5 niches)

### Architecture

Do NOT create 375 complete templates. Use a semantic metadata system with 3 tiers:

#### Tier 1: Derived metadata (computed from existing data)

From `ALL_NICHES` entries, we can derive:
- **audienceLabel**: `niche.label` → already exists
- **industryTerms**: from `niche.description` and `niche.painPoints` → extract nouns (NLP-lite: keyword extraction from existing text)
- **buyerContexts**: from `niche.painPoints` → use top 3 pain points as buyer context
- **commonArtifacts**: from niche label + market + service → e.g. "fitness coaches" + "short-form editor" = "workout clips, transformation videos"
- **proofEmphasis**: from `niche.desiredResults` → "showcase transformations" → emphasis on before/after
- **themes**: from `niche.description` → extract 2-3 theme words

Derivation function:
```typescript
function deriveNicheMetadata(
  niche: NicheOption,
  marketId: string,
  serviceId: string
): Partial<NicheModifier> {
  // Extract keywords from niche label, pain points, desired results
  // Combine with service-specific defaults
  // Return best-effort metadata with confidence score
}
```

#### Tier 2: Authoried overrides (high-value niches only)

Approximately **20-30 high-value niches** need explicit authored overrides:

**Priority niches for authoring** (those that appear across multiple service+markets):

| Niche ID | Appears in # paths | Reason |
|----------|-------------------|--------|
| `fitness_coaches` | 5+ | Coaches + multiple editors/developers |
| `youtubers_retention` | 4+ | Core YouTube editing niche |
| `gaming_youtubers` | 3+ | Large creator sub-segment |
| `podcasters` | 4+ | Core podcast editing niche |
| `course_creators` | 5+ | Cross-service niche |
| `personal_brand_creators` | 4+ | Growing market segment |
| `restaurants` | 4+ | Core local business niche |
| `local_business_owners` | 5+ | Cross-service local business |
| `real_estate_agents` | 3+ | High-value vertical |
| `saas_startups` | 4+ | Core developer/designer niche |
| `fashion_brands` | 3+ | E-commerce sub-segment |
| `coaches` | 3+ | Consulting/coaching vertical |
| `marketing_agencies` | 3+ | B2B service provider |
| `ecommerce_stores` | 3+ | Developer/designer cross |

**Authoring scope for Tier 2:**
```typescript
interface AuthoredNicheOverride {
  terminology: {
    buyer: string;       // "fitness coaches"
    problem: string;     // "client transformation content"
    result: string;      // "more coaching inquiries"
  };
  projectFraming: string;     // "fitness content and transformation storytelling"
  portfolioPromiseHint: string; // "creating content that attracts fitness clients"
  evidencePriority: string[];  // ['before_after', 'clip_embed']
  ctaContext: string;          // "fitness content approach"
  sectionEmphasis: string[];   // Which portfolio sections to boost
}

// Total authored fields: 9 per niche
// 25-30 niches × 9 fields = 225-270 authored values
```

#### Tier 3: Pure fallback (deterministic composition)

When neither tier 1 nor tier 2 resolves:

```typescript
function fallbackNicheModifier(serviceId: string, marketId: string): NicheModifier {
  const service = SERVICE_PRIMITIVES[serviceId];
  const market = MARKET_MODIFIERS[marketId];
  return {
    terminology: {
      buyer: getBuyerLabel(marketId),
      problem: `${getBuyerLabel(marketId)} problems`,
      result: `${getBuyerLabel(marketId)} desired outcomes`,
    },
    projectFraming: `${getServiceLabel(serviceId)} work for ${getBuyerLabel(marketId)}`,
    sectionEmphasis: market?.sectionRankingBoost ?? [],
    evidencePriority: ['clip_embed', 'screenshot', 'process_doc'], // Generic
    ctaContext: `review ${getServiceLabel(serviceId)}`,
    portfolioPromiseHint: `demonstrating ${getServiceLabel(serviceId)} for ${getBuyerLabel(marketId)}`,
  };
}
```

### Resolution order

```
1. Authored niche override exists? → use Tier 2 (highest quality)
2. Niche data + derivation possible? → use Tier 1 (medium quality)
3. Neither? → use Tier 3 fallback (lowest quality but never breaks)
```

---

## HIGH-VALUE NICHE OVERRIDE STRATEGY

| Priority | Niches | Count | Effort |
|----------|--------|-------|--------|
| P0 | Cross-service niches (appear in 4+ paths): `fitness_coaches`, `youtubers_retention`, `podcasters`, `course_creators`, `personal_brand_creators`, `restaurants`, `local_business_owners`, `saas_startups`, `marketing_agencies`, `ecommerce_stores` | ~10 | ~90 fields |
| P1 | Editor-specific niches: `gaming_youtubers`, `fashion_brands`, `real_estate_agents`, `coaches`, `business_coaches`, `educational` | ~6 | ~54 fields |
| P2 | Developer-specific niches: `agency_workflow`, `local_automation`, `saas_dev`, `real_estate_websites`, `membership_sites` | ~5 | ~45 fields |
| P3 | Designer-specific niches: `saas_design`, `dtc_brands`, `content_platforms`, `personal_brand_design`, `startup_brand`, `startup_pitch` | ~6 | ~54 fields |

**Total authored:** ~27 niches × 9 fields = ~243 values. Authored in a single TS file as a map.

Remaining ~87 low-traffic niches use Tier 1 derivation + Tier 3 fallback.

---

## SHARED CONTENT CONTRACT

### Shared base primitives

```typescript
interface PersonalizedContent<TRecommendation, TDefaults> {
  recommendations: TRecommendation[];
  defaults: TDefaults;
  examples: string[];
  helperText: string;
  emptyStateGuidance: string;
}
```

### Module-specific extensions

```typescript
// Module 2: Offer Engineering
interface OfferPersonalization extends PersonalizedContent<
  { id: string; label: string; description: string; whyItMatters: string; recommended?: boolean },
  { offerType: string; deliverables: string[]; scopeLimits: ScopeLimits; pricingRange: [number, number] }
> {
  priceContext: string;               // "Most {service} projects in {market} range from $X-$Y"
  mechanismSuggestions: Mechanism[];
  amplifierSuggestions: Amplifier[];
}

// Module 3: Authority System
interface AuthorityPersonalization extends PersonalizedContent<
  { positionId: AuthorityPosition; label: string; score: number; rationale: string },
  { trustPromise: string; position: AuthorityPosition }
> {
  proofPriorityCandidates: ProofPriorityCandidate[];
  proofAssetExamples: string[];
}

// Module 4: Portfolio System
interface PortfolioPersonalization extends PersonalizedContent<
  { destination: PortfolioDestination; reason: string },
  { sections: PortfolioSectionSpec[]; placements: ProjectPlacement[] }
> {
  portfolioHeadline: string;
  ctas: string[];
}
```

### Composition logic

```
1. PersonalizationContext (read from canonical stores)
   ↓
2. ServiceProfile (15-service map, always resolves)
   ↓
3. MarketModifier (17-market map, always resolves)
   ↓
4. NicheModifier (authored → derived → fallback)
   ↓
5. Module/Step Composer (combines all 3 tiers + context)
   ↓
6. PersonalizedContent (recommendations, defaults, examples, helper, empty)
```

---

## FALLBACK RULES

1. **Service fallback**: `SERVICE_PRIMITIVES` covers all 15 service IDs. No fallback needed.

2. **Market fallback**: `MARKET_MODIFIERS` covers 16-17 market IDs. Unknown market → use `coaches` modifier as generic B2B default.

3. **Niche fallback (tiered)**:
   - Try `NICHE_MODIFIERS[nicheId]` (authored)
   - Try `deriveNicheMetadata(niche, marketId, serviceId)` (derived)
   - Fallback: `fallbackNicheModifier(serviceId, marketId)` (deterministic)

4. **Audience label fallback**: `getBuyerLabel(marketId)` → `getServiceLabel(serviceId) + " clients"` → `"professional"`

5. **Example fallback**: `deriveExample(serviceId, marketId, nicheId)` → `getServiceLabel(serviceId)` → `"professional work"`

6. **Empty state fallback**: Module-level generic message: "Complete the previous steps for personalized recommendations."

7. **Recommendation fallback**: When no authored or derived recommendations exist → return generic defaults from a static fallback record.

---

## MODULE 2 COVERAGE

### Where personalization should be used

| Step | Recommendations | Load Defaults | Examples | Helper Text | Empty State | Priority |
|------|----------------|---------------|----------|-------------|-------------|----------|
| 1 — Offer Type | **Rec. badge** already static (retainer). Should vary by service+market. | — | **SERVICE_EXAMPLES** exists but empty placeholders. Fill from profile. | Generic. Add service-specific "Most {market} prefer {type}" | Generic. Already works. | **High** |
| 2 — Deliverables | Suggested list already data-driven. Add rationale. | First 3-5 pre-selected. | Add "Example deliverable for {niche}" | Add "{service} tip: aim for 3-5" | Generic. Works. | **Medium** |
| 3 — Unique Mechanism | Suggested mechanisms data-driven. Add rank by market fit. | Best-fit mechanism pre-selected. | Name examples: "e.g. {prefix}System" | Generic. Works. | Generic. Works. | **Medium** |
| 4 — Scope Protection | Load Defaults exists. Add niche-appropriate defaults. | Already data-driven per service. | Add "e.g. 48 hours for {serviceType}" | Add "{market} buyers typically expect..." | Already works. | **Low** (Load Defaults exists) |
| 5 — Value Amplifier | Suggested list data-driven. Add rank by niche appeal. | First amplifier pre-selected. | Add "e.g. {niche}-specific bonus description" | Already works. | "No value amplifiers configured" — add niche fallback. | **Medium** |
| 6 — Pricing | Pricing context exists per service. Extend to market+niche. | Suggested range per service+market. | Add "Most {market} {service} projects..." | Generic. Works. | Already works. | **Low** |
| 7 — Proposal Summary | Generated copy already contextual. Add fallback improvements. | Generated defaults from `contentQuality.ts`. | Add 3 variations per service+market. | Generic. Works. | "No deliverables selected" — works. | **Low** |
| 8 — Blueprint | All generated content already contextual. No changes needed. | Already contextual. | Already contextual. | Already contextual. | Already contextual. | **None** |

### Priority ranking for M2
1. **Offer Type** — example strings are empty placeholders. Fill with real niche+service examples.
2. **Deliverables** — rationale per deliverable is generic. Add market-context why-matters.
3. **Value Amplifier** — `whyItWorks` is generic in fallback path.
4. **Scope Protection** — placeholder text is generic. Make niche-specific examples.

---

## MODULE 3 COVERAGE

### Where personalization should be used

| Step | Recommendations | Load Defaults | Examples | Helper Text | Empty State | Priority |
|------|----------------|---------------|----------|-------------|-------------|----------|
| 1 — Authority Position | Scoring already context-driven. Add rationale sentence with market context. | Recommended position already pre-selected. | Add "Most {service} professionals in {market} choose {position}" | Generic. Already minimal. | Generic. Works. | **Low** (already good) |
| 2 — Proof Strategy | Already data-driven from `resolveProofPriorities()`. | 3 priorities pre-generated. | Add niche-specific examples per priority. | Generic text. Add "Based on your {service} + {market}" | "Complete Step 1 first" — works. | **Medium** |
| 3 — Proof Asset Builder | Already data-driven from `generateProofAsset()`. | Generated fields pre-filled. | Add niche-context examples in scenario field. | All field labels are technical. Add purpose hints. | "Generating..." — works. | **Low** (already fills) |
| 4 — Profile & Portfolio | Already context-driven generation. | Pre-generated copy. | Already contextual. | Already minimal. | "Accept all 3 proof assets" — works. | **None** (already best) |
| 5 — Authority Pack | Checklist items are generic. Add service-specific tasks. | Default checklist pre-filled. | Already uses context in markdown. | Already minimal. | "Complete Step 4 first" — works. | **Medium** |

### Priority ranking for M3
1. **Authority Pack checklist** — 11 tasks are identical for all services. Add "Set up {destination} profile" (from M4 destination knowledge), "Publish {title} proof asset".
2. **Proof Strategy examples** — per-priority examples could reference niche.
3. **Proof Asset Builder field helpers** — "Target Audience" and "Business Problem" fields could show niche-aware placeholder hints.

---

## MODULE 4 COVERAGE

### Where personalization should be used

| Step | Recommendations | Load Defaults | Examples | Helper Text | Empty State | Priority |
|------|----------------|---------------|----------|-------------|-------------|----------|
| 1 — Portfolio Direction | Goal selection already context-driven. Reason strings hardcoded. Add market+position variant. | Pre-filled targetBuyer, portfolioPromise. | Add "Most {service} professionals in {market} choose {goal}" | Generic. Already minimal. | Works. | **Low** |
| 2 — Destination + Structure | Platform recommendation data-driven per service. | Destination pre-selected. Sections auto-generated. | Add "Example: {similar_service} portfolio on {platform}" | Generic. Add market-specific "Buyers in {market} expect..." | Works. | **Medium** |
| 3 — Proof Placement | Placement engine data-driven per asset+market. | Pre-generated placements. | Add market-specific placement reasons. | Generic. Already minimal. | Works. | **Low** |
| 4 — Project Presentation | Already contextual per asset+format. | Pre-generated presentations. | Add niche-specific presentation notes. | Generic. Many field labels are hardcoded. | Works. | **Medium** |
| 5 — Portfolio Copy & CTA | Already contextual from M3 copy + service primitives. | Pre-generated copy. | Already contextual (falls back to generic). | Generic. Add CTA purpose hints per niche. | Works. | **Low** |
| 6 — Build Pack | Hardcoded build checklist items. Add per-service items. | Pre-generated checklists. | Already uses context in build pack doc. | Generic. Add "Next: go to Module 5" context. | Works. | **Medium** |

### Priority ranking for M4
1. **Build checklist items** — 3 items are generic ("Set up portfolio platform", "Write and refine headline", "Add short intro / bio"). Add service-specific tasks.
2. **Destination helper text** — market-specific examples of successful portfolios.
3. **Presentation field labels** — many are hardcoded "None specified". Add fallback from niche context.

---

## COMPOSITION ORDER

```
resolvePersonalizationContext(canonical stores)
       │
       ▼
resolveServiceProfile(serviceId)  ────►  ALWAYS resolves (15/15 profiles)
       │
       ▼
resolveMarketModifier(marketId)   ────►  ALWAYS resolves (17 markets)
       │
       ▼
resolveNicheModifier(serviceId, marketId, nicheId, ALL_NICHES data)
       │
       ├── authored?  ────►  Tier 2 (overrides)
       ├── derived?   ────►  Tier 1 (from niche description/painPoints/desiredResults)
       └── fallback?  ────►  Tier 3 (service+market template)
       │
       ▼
composeModuleContent(stepId, context, serviceProfile, marketModifier, nicheModifier)
       │
       ├── Recommendations ────►  scored, deduped, ranked
       ├── Defaults        ────►  context-appropriate, pre-selected
       ├── Examples        ────►  niche- or market-specific
       ├── Helper Text     ────►  contextual guidance
       └── Empty State     ────►  meaningful next-action guidance
```

---

## OFFLINE AI AUTHORING PIPELINE

### Content schema (candidate input)

```typescript
interface ContentCandidate {
  // Target
  serviceId: string;
  marketId: string;
  nicheId: string | null;    // null = market-level only
  step: string;              // e.g. "offer-type", "proof-strategy"
  contentType: string;       // "example" | "helper" | "recommendation" | "default"

  // Generated value
  content: string | string[];
  label: string;             // Short description of what this is
  source: 'ai-generated' | 'authored';
}
```

### Pipeline steps

```
1. CANDIDATE GENERATION
   LLM prompt: "Generate {contentType} for {step} in Module {module}
   for a {serviceLabel} serving {marketLabel} ({audienceLabel})"
   ────► produces structured JSON array of ContentCandidate

2. SCHEMA VALIDATION
   - All required fields present (serviceId, marketId, nicheId, step, content)
   - Content is non-empty
   - No markdown in single-line strings
   - Proper type match (string vs array)

3. HONESTY VALIDATION
   - Does NOT promise past client results
   - Does NOT use "my clients" language (user may not have clients)
   - Does NOT fabricate metrics or outcomes
   - Uses "you can" or "demonstrate" not "I have done"
   - Does NOT reference paid commercial projects unless specified
   - Does NOT claim expertise credentials without evidence

4. SERVICE MISMATCH VALIDATION
   - Example matches the service work domain
   - A "video editing" example is not suggested for "brand design"
   - Execution verbs match the service (not "edit" for "develop")
   - Output types match the service deliverables

5. DUPLICATION VALIDATION
   - No identical content generated for different niche IDs
   - Market-level content not duplicated with niche-level content
   - Same-niche-different-service produces genuinely different results

6. MANUAL SAMPLE REVIEW
   - Review 20% sample (every 5th candidate)
   - Check: appropriateness, honesty, mismatch, quality
   - Flag any for rejection

7. APPROVAL & COMMIT
   - Approved candidates → TypeScript/JSON constants file
   - Rejected → feedback to candidate generation prompt
   - File: src/data/personalization/authored-content.ts
```

### Validation rules (programmatic)

```typescript
const VALIDATION_RULES = {
  noClientResults: /my client|my customers|my portfolio client|paid project/i,
  noFakeMetrics: /\d+% increase|\d+x roi|generated \$/i,
  noFakeCredentials: /certified|award.?winning|top.?rated|expert in everything/i,
  noFreeWork: /free sample|work for free|unpaid project/i,
  noWrongDomain: check service category matching,
  noExactDuplicates: check content string === existing content string,
  no80PercentOverlap: check edit distance < 0.3,
};
```

---

## VALIDATION GATES

### Path resolution validation

```typescript
// Validate all 75 service×market paths resolve without error
const allKeys = Object.keys(ALL_NICHES); // 75 composite keys
for (const key of allKeys) {
  const [trackId, marketId] = key.split('_');
  const context = buildMinimalContext(trackId, marketId);
  const content = resolvePathContent(context);
  assert(content !== null, `Path ${key} failed to resolve`);
  assert(content.content.headline !== undefined, `Path ${key}: missing headline`);
}

// Validate all niche-level overrides
for (const [nicheId, override] of Object.entries(AUTHORED_OVERRIDES)) {
  const context = buildMinimalContextWithNiche(nicheId);
  const modifier = resolveNicheModifier(context);
  assert(modifier !== null, `Niche ${nicheId} failed`);
}
```

### Content quality gates

- No raw IDs visible to users (no `snake_case` in user-facing strings)
- No `undefined` or `null` shown as content
- No service mismatch (editor example ≠ developer context)
- No wrong-work examples
- No fabricated business outcomes
- No fake testimonials ("Clients love my work" without proof)
- No unsupported credentials
- No hardcoded free work recommendations
- Examples use niche context where available
- Recommendations materially differ where expected
- Unrelated paths do not share ≥70% of examples/recommendations/defaults

### Threshold comparison

```typescript
function computeContentOverlap(pathA: string, pathB: string): number {
  const contentA = getAllContentForPath(pathA);
  const contentB = getAllContentForPath(pathB);
  const shared = contentA.filter(c => contentB.includes(c));
  return shared.length / Math.min(contentA.length, contentB.length);
}

// Gate: unrelated paths (different track + different service + different market)
// must have <70% content overlap
assert(computeContentOverlap('video_editor_coaches', 'wordpress_developer_local_businesses') < 0.7);
```

---

## FILE ARCHITECTURE

```
src/
  lib/
    personalization/
      context.ts              ← PersonalizationContext resolver (reads canonical stores)
      index.ts                ← Re-exports
      types.ts                ← PersonalizationContext interface, shared types

  data/
    personalization/
      service-profiles.ts     ← 15 ServiceProfile objects (migration of SERVICE_PRIMITIVES)
      market-modifiers.ts     ← 17 MarketModifier objects (migration of MARKET_MODIFIERS)
      niche-modifiers.ts      ← Authored overrides (Tier 2, ~27 niches)
      fallbacks.ts            ← Tier 3 fallback logic

    module3/
      personalized-content.ts ← Module 3 composer wrappers (read context → produce output)
      (existing files stay — authority-positions.ts, proof-priorities.ts, etc.)

    offer-engineering/
      personalized-content.ts ← Module 2 composer wrappers
      (existing files stay — master-data.ts, path-content.ts, contentQuality.ts, etc.)

    portfolio-system/
      personalized-content.ts ← Module 4 composer wrappers
      (existing files stay — composer.ts migration path optional)

  lib/
    module3/
      personalized-content.ts ← Module 3 content composer (new)
      (existing store.ts, index.ts stay)

    offer-engineering/
      personalized-content.ts ← Module 2 content composer (new)

    portfolio-system/
      personalized-content.ts ← Module 4 content composer (new)

  scripts/
    validate-personalized-content.ts  ← Path resolution + content quality validation
    generate-content-candidates.ts     ← Offline AI authoring pipeline
```

### Migration notes

- **Do NOT** rewrite existing composer files. New `personalized-content.ts` modules wrap existing generators with the shared context pipeline.
- `service-profiles.ts` should **migrate** from `composer.ts`'s `SERVICE_PRIMITIVES` and `proof-assets.ts`'s `SERVICE_PROFILES` into one unified source.
- `market-modifiers.ts` should **migrate** from `composer.ts`'s `MARKET_MODIFIERS`.
- After migration, `composer.ts` imports from these new shared data files instead of defining data inline.
- `niche-modifiers.ts` is **new** — extends from the 6 existing `NICHE_MODIFIERS` to at least 27.

---

## MIGRATION ORDER

### Phase 1: Foundation (shared context + data refactors)

1. Create `src/lib/personalization/context.ts` — read-only resolver from canonical stores
2. Create `src/lib/personalization/types.ts` — shared interfaces
3. Create `src/data/personalization/service-profiles.ts` — consolidate SERVICE_PRIMITIVES + SERVICE_PROFILES
4. Create `src/data/personalization/market-modifiers.ts` — consolidate MARKET_MODIFIERS
5. Create `src/data/personalization/niche-modifiers.ts` — add derived + authored tiers
6. Create `src/data/personalization/fallbacks.ts` — tier 3 fallback logic
7. Write validation: `scripts/validate-personalized-content.ts`
8. **Goal**: `PersonalizationContext` resolves for all 75 paths without error

**Estimated time:** 8-12 hours

### Phase 2: Module 4 personalization

1. Create `src/lib/portfolio-system/personalized-content.ts`
2. Refactor `composer.ts` to import from shared data files (service-profiles, market-modifiers, niche-modifiers)
3. Improve build checklist — add service-specific items
4. Add market-specific destination helper text
5. Improve presentation field fallbacks
6. Tests: all 15×17 paths produce unique combinations

**Estimated time:** 6-8 hours

### Phase 3: Module 3 personalization

1. Create `src/lib/module3/personalized-content.ts`
2. Refactor authority pack checklist — use service/niche context for publish tasks
3. Add niche-aware proof strategy examples
4. Add niche-aware field helper hints in proof asset builder
5. Tests: all 15×17 paths produce unique priority sets

**Estimated time:** 4-6 hours

### Phase 4: Module 2 remaining generic UI content

1. Create `src/lib/offer-engineering/personalized-content.ts`
2. Fill offer type example strings from service profiles
3. Add market context to deliverable rationale
4. Improve scope placeholder examples per niche
5. Refactor `path-content.ts` to use derived fallbacks for uncovered paths

**Estimated time:** 6-8 hours

### Phase 5: Offline authoring pipeline

1. Create `scripts/generate-content-candidates.ts`
2. Write prompt templates
3. Define validation rules
4. Create review workflow
5. Run first pass: generate proposals for 27 priority niches × 3 modules × 3 content types = ~243 candidates

**Estimated time:** 4-6 hours

---

## ONE IMPLEMENTATION PLAN

```
PHASE 1: Foundation (8-12h)
  ├── context.ts + types.ts
  ├── service-profiles.ts (consolidate SERVICE_PRIMITIVES + SERVICE_PROFILES)
  ├── market-modifiers.ts (consolidate MARKET_MODIFIERS)
  ├── niche-modifiers.ts (authored 20 + derived + fallback)
  ├── fallbacks.ts
  └── validate-personalized-content.ts

PHASE 2: Module 4 (6-8h)
  ├── personalized-content.ts for M4
  ├── Refactor composer.ts imports
  ├── Improve checklists
  └── Unique combination tests

PHASE 3: Module 3 (4-6h)
  ├── personalized-content.ts for M3
  ├── Improve checklist + examples
  └── Unique priority tests

PHASE 4: Module 2 (6-8h)
  ├── personalized-content.ts for M2
  ├── Fill example strings
  ├── Improve placeholders
  └── Path content fallback improvements

PHASE 5: Authoring pipeline (4-6h)
  ├── generate-content-candidates.ts
  ├── Validation rules
  ├── Review workflow
  └── First run (243 candidates)

TOTAL ESTIMATE: 28-40 hours
```

---

## BLOCKERS

None identified. All phases can proceed independently. Phase 1 must precede Phases 2-4. Phase 5 is fully independent.

**Dependencies:**
- Phase 1 → Phase 2, 3, 4 (shared context must exist first)
- Phase 5 is independent of all other phases
- No Module 2, 3, or 4 product logic changes required
- No API keys or AI service dependencies
- No schema changes to existing stores

---

## APPENDIX: KEY FILES

| File | Purpose | Lines | Read Rate |
|------|---------|-------|-----------|
| `src/lib/portfolio-system/composer.ts` | M4 composer (SERVICE_PRIMITIVES, MARKET_MODIFIERS, NICHE_MODIFIERS) | 1157 | Full |
| `src/data/module3/authority-positions.ts` | Position scoring, label maps, trust promise generation | 492 | Full |
| `src/data/module3/proof-priorities.ts` | Priority resolution, buyer doubt map, fallback | 700 | Full |
| `src/data/module3/proof-assets.ts` | Asset generation, SERVICE_PROFILES (7), format modifiers | 765 | Full |
| `src/data/module3/profile-copy.ts` | Profile + portfolio copy generation | 171 | Full |
| `src/data/module3/authority-pack.ts` | Markdown compilation, checklist | 168 | Full |
| `src/lib/blueprint-content/contentQuality.ts` | All M2 generator functions | 2700+ | Partial |
| `src/lib/offer-engineering/pathContentResolver.ts` | Path content resolution with fallback chain | 189 | Full |
| `src/data/offer-engineering/path-content.ts` | 10 authored path content objects | 1700+ | Partial |
| `src/data/offer-engineering/master-data.ts` | 10 service engineering definitions | 1400+ | Partial |
| `src/data/module1/module1-content.ts` | MAIN_TRACK_OPTIONS, ALL_MARKETS, ALL_NICHES | 2000+ | Partial |
| `src/lib/module1/opportunityMapAdapter.ts` | Adapter mappings (75 market, 3 niche exact) | 1200+ | Partial |
| `src/data/opportunity-map/master-data.ts` | Legacy 3-track data w/ nested services/markets/niches/offers | 940+ | Partial |
