# MODULE 4 — CONTENT SYSTEM

**Status:** FROZEN  
**Deterministic only** — no LLM calls. All content generated via string templates in `src/lib/blueprint-content/contentQuality.ts`.

---

## 1. SOURCE DATA

All content templates live in `src/lib/blueprint-content/contentQuality.ts` (4268 lines).

Existing functions used by current Module 4:
- `generatePortfolioGoalStatement()` — Step 1
- `generatePortfolioCopy()` — Step 5
- `generateCaseStudy()` — removed, replaced by M3 proof assets
- `generateSampleProject()` — removed, replaced by M3 proof assets

**New functions needed for Module 4 V2:**

| Function | Step | Purpose |
|---|---|---|
| `generateDirectionOptions()` | 1 | Direction options filtered by service + market |
| `recommendPlatform()` | 2 | Platform recommendation by service family |
| `generateSectionBlueprint()` | 2 | Section plan from authority position + service |
| `generatePlacementSuggestion()` | 3 | Auto-assign 3 assets to featured/sec/supporting |
| `generatePresentationSpec()` | 4 | Per-project presentation structure |
| `generateCTAArchitecture()` | 5 | CTA placement and text per service family |
| `generateBuildChecklist()` | 6 | Build + publish checklist merged from M3 + M4 |
| `compileBuildPack()` | 6 | Assemble all outputs into final pack |

---

## 2. SERVICE FAMILY PRIMITIVES

Content generation is driven by **service family primitives** — shared defaults for closely related services, with per-service overrides where needed.

### VIDEO FAMILY (5 services)

Shared primitives:
- Portfolio medium: Video embed gallery
- Presentation structure: Raw clip → hook breakdown → edited clip → result
- Evidence type: Side-by-side comparison, retention graph
- CTA pattern: "Book a free [X] review"

Per-service overrides:

| Service | Template Variation |
|---|---|
| `video_editor` | Multi-platform generalist, before/after focus |
| `short_form_editor` | Hook-first, trend-aware, platform-native |
| `youtube_editor` | Retention-focused, long-form pacing structure |
| `podcast_clip_editor` | Moment-selection, visual treatment of audio |
| `ad_creative_editor` | Conversion-focused, split-test results |

### DEVELOPMENT FAMILY (5 services)

Shared primitives:
- Portfolio medium: Live URLs + code repositories
- Presentation structure: Live URL → Problem → Build → Evidence → Result
- Evidence type: Lighthouse scores, performance reports
- CTA pattern: "Request a free [X] audit"

Per-service overrides:

| Service | Template Variation |
|---|---|
| `wordpress_developer` | Full site builds, local SEO, maintenance |
| `landing_page_developer` | Single-page conversion, A/B testing |
| `no_code_developer` | Build speed, tool-agnostic, workflow focus |
| `frontend_developer` | Interactive frontend, mobile-first, tech stack |
| `automation_developer` | ROI/time-saved metrics, workflow diagrams |

### DESIGN FAMILY (5 services)

Shared primitives:
- Portfolio medium: Figma prototypes + Behance/Dribbble
- Presentation structure: Problem → Flow → Screens → Prototype → Rationale
- Evidence type: Before/after comparisons, user flow maps
- CTA pattern: "Book a free [X] review"

Per-service overrides:

| Service | Template Variation |
|---|---|
| `ui_ux_designer` | Full interface redesign, component systems |
| `landing_page_designer` | Conversion-focused layouts, A/B variants |
| `brand_designer` | Identity systems, application mockups |
| `social_media_designer` | Template libraries, feed mockups |
| `presentation_designer` | Deck before/after, storytelling flow |

---

## 3. MARKET MODIFIER TEMPLATES

Each market modifies content across these axes:

| Market | Buyer Concern Emphasis | Language Register | Trust Signal Priority |
|---|---|---|---|
| `coaches` (or `coaches_consultants`) | "Can you get me clients?" | Direct, results-oriented | Client results > Process |
| `youtube_creators` | "Will you improve retention?" | Creator-friendly, ROI | Retention data > Aesthetics |
| `local_businesses` | "Can you help me get found?" | Simple, benefit-first | Local SEO > Design |
| `saas_startups` / `startups` | "Can you build fast?" | Technical, growth-focused | Speed > Quality documentation |
| `agencies` | "Can you handle client work?" | Professional, scalable | Reliability > Creativity |
| `creators` | "Can you make me grow?" | Community, supporter | Growth metrics > Process |
| `personal_brands` | "Can you match my voice?" | Collaborative | Brand consistency > Speed |
| `ecommerce_brands` | "Can you drive sales?" | Data-driven, ROI | Conversion data > Design |
| `course_creators` | "Will students complete?" | Educational, clarity | Completion rates > Aesthetics |
| `podcasters` | "Will listeners grow?" | Listener-first | Episode growth > Production |
| `business_owners` | "Will this save me time?" | Efficiency-focused | Time saved > Features |
| `marketing_agencies` | "Can you scale?" | Scale, white-label | Volume capacity > Individual quality |

---

## 4. NICHE MODIFIER RULES

Niche is the highest-resolution modifier. It affects:

1. **Audience terminology** — `fitness_coaches` → "coaches" vs "transformations"; `gaming` → "creators" vs "gamers"
2. **Example project names** — Niche-specific sample project titles
3. **Evidence type preferences** — Which evidence format resonates most
4. **CTA language** — Niche-specific conversation starters
5. **Pain point emphasis** — What problem to lead with in portfolio

**Niche overlay logic:**
```
base template
  → service override (if exists)
    → niche override (if exists)
      → market-lang register
```

**Examples:**

| Path | Niche Effect on Portfolio |
|---|---|
| `short_form_editor + coaches + fitness_coaches` | Language: "transformations", "client results", "fitness content" |
| `short_form_editor + coaches + business_coaches` | Language: "authority clips", "thought leadership", "business growth" |
| `video_editor + youtube_creators + gaming` | Language: "gaming clips", "stream highlights", "viral moments" |
| `video_editor + youtube_creators + educational` | Language: "course clips", "teaching moments", "enrollment" |
| `frontend_developer + local_businesses + gyms` | Language: "fitness websites", "booking systems", "local" |
| `frontend_developer + local_businesses + clinics` | Language: "patient portals", "trust signals", "accessibility" |

---

## 5. PROOF PLACEMENT ENGINE

**Input:** 3 proof assets from Module 3, each with priority rank, title, type, per-asset portfolio copy, credibility gap.

**Placement logic:**

```
Priority #1 → Featured Project (Selected Work section hero)
Priority #2 → Secondary Project (Selected Work section second)
Priority #3 → Supporting Proof (Trust Signals / inline evidence)
```

**Within each placement, evidence order** is determined by authority position:

| Authority Position | Evidence Order |
|---|---|
| `builder` | Process → Evidence → Result |
| `auditor` | Problem → Evidence → Solution |
| `deconstructor` | Problem → Breakdown → Solution |
| `practitioner` | Result → Evidence → Process |

**Service-specific evidence media types:**

| Service Family | Featured Evidence | Secondary Evidence | Supporting Evidence |
|---|---|---|---|
| Video | Finished clip | Side-by-side comparison | Hook analysis, retention note |
| Development | Live URL, screencast | Performance report | Code snippet, architecture |
| Design | Final screens, prototype link | Before/after comparison | Design rationale, component system |

**Fallback:** If only 1 or 2 proof assets exist, remaining slots are omitted. If 0, Module 4 blocks with "Complete Module 3 first."

---

## 6. SERVICE EXECUTION PRIMITIVES — FULL MATRIX

| Service ID | Portfolio Medium | Presentation Structure | Evidence Type | CTA Type |
|---|---|---|---|---|
| `video_editor` | Framer/Carrd + embed gallery | Clip comparison → Retention → Result | Side-by-side, retention graph | Book a clip review |
| `short_form_editor` | Carrd + social embed | Hook card → Clip → Metrics | Hook analysis, engagement | Book a hook audit |
| `youtube_editor` | Framer + YouTube embed | Pacing demo → Retention → Result | Retention chart, timeline | Book a retention audit |
| `podcast_clip_editor` | Framer + episode embeds | Moment map → Clip → Listener growth | Moment selection, growth data | Book a clip audit |
| `ad_creative_editor` | Framer case study site | Ad var → Split test → ROAS | Performance dashboard | Book a creative audit |
| `wordpress_developer` | Live URLs + Notion | Site → Build process → Performance | Lighthouse, performance report | Request a site audit |
| `landing_page_developer` | Live URLs + Carrd | Landing page → A/B test → Conversion | Conversion rate data | Request a page audit |
| `no_code_developer` | Live apps + Notion | App → Build timeline → Workflow | Build speed, feature list | Request a build consult |
| `frontend_developer` | GitHub + live demos | Demo → Implementation → Tech | Code quality, performance | Request a code review |
| `automation_developer` | Notion + Loom | Workflow → Automation → ROI | Time saved, revenue impact | Request an audit |
| `ui_ux_designer` | Figma + Behance | Problem → Flow → Screens → Prototype | Before/after, usability | Book a UI review |
| `landing_page_designer` | Behance + live URLs | Page → A/B test → Rationale | Conversion comparison | Book a page review |
| `brand_designer` | Behance + Dribbble | Identity → Applications → Rationale | Style guide, touchpoints | Book a brand audit |
| `social_media_designer` | Instagram + Notion | Feed → Templates → Metrics | Template library, engagement | Book a social audit |
| `presentation_designer` | SpeakerDeck + Notion | Deck → Story → Impact | Before/after, testimonials | Book a deck review |

---

## 7. DESTINATION STRATEGY (Platform Recommendation)

See MASTER-SPEC.md §5 for the full platform recommendation matrix.

**Implementation detail:** Platform is stored as a string field in `portfolioBuildPack.platform.recommendation`. No URLs are generated. No external API calls. The user builds their portfolio on the recommended platform independently.

---

## 8. BUILD CHECKLIST

Checklist is merged from:
- **Module 3 checklist** (inherited from authority pack — trust builder items)
- **Module 4 build items** (platform setup, section construction, project pages)
- **Module 4 publish items** (domain, hosting, URL, testing)

Default build items by service family:

**Video (all):**
- Platform account created
- Hero section with headline
- 3 project pages created
- Before/after comparison visible
- Process section written
- CTA links work
- Mobile responsive

**Development (all):**
- Live URL accessible
- Performance test run (Lighthouse)
- Mobile responsive verified
- Case study page with problem → solution
- Code repository accessible
- CTA links work

**Design (all):**
- Figma prototype link accessible
- Before/after comparison shown
- Design rationale section written
- Behance/Dribbble profile updated
- CTA links work
- Mobile mockups shown

---

## 9. MARKDOWN EXPORT

The final Build Pack compiles into a Markdown document:

```markdown
# Portfolio Build Pack — [Service Label] for [Market Label]

## Portfolio Direction
[statement]

## Platform & Structure
**Recommended platform:** [platform]
**Sections:**
1. [section 1]
2. [section 2]
...

## Project Placements
### Featured: [Project Title]
[Evidence order]
[CTA]

### Secondary: [Project Title]
...

### Supporting: [Project Title]
...

## Portfolio Copy
### Headline
[headline]

### Per-Section Copy
...

### CTA Architecture
- Hero: [hero CTA]
- Inline: [inline CTA]
- Footer: [footer CTA]

## Build Checklist
- [ ] item 1
- [ ] item 2
...

## Publish Checklist
- [ ] item 1
- [ ] item 2
...

## Next Actions
1. Action 1
2. Action 2
...
```
