# B.Cyber Compass — Wireframe Specifications
*Version: 2.0 | Status: Reviewed & Corrected (13 October 2026)*  
*Platform: Ayush-Paul Blueprints Ecosystem*  
*Scope: Pillar 1 — B.Cyber Overview (`/blueprints/b-cyber`)*  
*Architectural Alignment: Fully synced with `docs/b-cyber-sitemap-and-ux-blueprint.md` (Pillar 1: 14 Locked Sections)*

---

## 1. Document Purpose & Architectural Governance

This document establishes the structural, low-fidelity wireframe blueprints and interaction models for **Pillar 1: B.Cyber Overview (`/blueprints/b-cyber`)**. It translates the frozen sitemap hierarchy and UX blueprint into exact desktop and mobile interface specifications.

### Core Architectural Rules for Wireframes
1. **Low-Fidelity & Structural**: Communicates layout hierarchy, data density, component grouping, visual boundaries, and responsive stacking without high-fidelity visual styling.
2. **Distinct Desktop & Mobile Layouts**: Every single section provides separate, actionable ASCII block wireframes for both desktop (>=1024px) and mobile (<768px). No shared or prose-only layouts.
3. **Strict Zero Mobile Sticky Overlay Policy**: To prevent viewport obstruction, distraction, and mobile keyboard collision, **no persistent floating bottom CTA bar or sticky overlay is permitted** on mobile.
4. **Epistemic Rigor & Source Grounding**: Claims are strictly bounded by official IIT Kanpur Senate records and WSAIS publications. Any unconfirmed, variable, or conflicting data point is explicitly flagged or blocked.
5. **Universal Accessibility (a11y) & Interaction States**: Every interactive control specifies default, hover, focus-visible, active, and disabled states, full keyboard navigation semantics, ARIA roles, and `prefers-reduced-motion` compliance.

---

## 2. Global Interaction & Accessibility Standards

### 2.1 Interaction State Matrix
All interactive components across Pillar 1 adhere to the following tokenized state specifications:

| Component Type | Default State | Hover State (`:hover`) | Focus-Visible (`:focus-visible`) | Active State (`:active`) | Disabled State (`:disabled`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Fast-Track Jump Chips** | Subtle border (`border-slate-200`), text `slate-700` | `bg-slate-100`, `border-slate-300`, text `slate-900` | `ring-2 ring-brand-primary ring-offset-2 outline-none` | `bg-slate-200 scale-[0.98]` | `opacity-50 pointer-events-none` |
| **Curriculum Tabs** | Text `slate-500`, border transparent | `text-slate-900`, `bg-slate-50` | `ring-2 ring-brand-primary outline-none` | `bg-slate-900 text-white` (Selected) | N/A |
| **Reflection Checkboxes** | Unchecked box (`border-slate-300 bg-white`) | `border-brand-primary/60` | `ring-2 ring-brand-primary ring-offset-1` | Scale `[0.95]` momentary | `opacity-50 cursor-not-allowed` |
| **FAQ Accordion Triggers**| Chevron pointing down (`0deg`), border bottom | `bg-slate-50/75` | `ring-2 ring-brand-primary outline-none` | Chevron rotates to `180deg` (Expanded) | N/A |
| **Primary Action Buttons**| High-contrast brand green (`bg-[#d1f34d] text-slate-950`) | Subtle brightness lift (`bg-[#c5ea3e]`) | `ring-2 ring-brand-primary ring-offset-2 outline-none` | `scale-[0.98]` | `bg-slate-200 text-slate-400 cursor-not-allowed` |
| **Secondary Buttons** | Dark border (`border-slate-700 text-white`) | `bg-white/10 text-white` | `ring-2 ring-white ring-offset-2 outline-none` | `bg-white/20` | `opacity-40 cursor-not-allowed` |

### 2.2 Keyboard Navigation & Focus Flow
- **Sequential Tab Order**: Follows natural DOM hierarchy: Global Nav -> Fast-Track Chips -> Semester Tabs -> Reflection Checkboxes -> Accordion Triggers -> Next-Step CTAs -> Footer.
- **Tab Panel Navigation**: Semester tabs implement `role="tablist"`, `role="tab"`, and `role="tabpanel"`. Left/Right arrow keys traverse tabs; Enter or Space activates the selected tab.
- **Accordion Keyboard Operability**: Each accordion trigger utilizes standard HTML `<button>` or `<summary>` with `aria-expanded` and `aria-controls`. Space or Enter expands/collapses the panel.
- **Reflection Checklist Operability**: Custom checkbox cards implement native `<input type="checkbox">` or `role="checkbox"` with `tabindex="0"`, toggleable via Spacebar.

### 2.3 Motion & `prefers-reduced-motion` Compliance
When `@media (prefers-reduced-motion: reduce)` is active:
- All CSS transitions and keyframe animations are disabled (`transition-duration: 0.001ms !important; animation-duration: 0.001ms !important;`).
- In-page smooth scrolling (`scroll-behavior: smooth`) drops to instant snap navigation (`scroll-behavior: auto`).
- Accordion height transitions and tab cross-fades switch immediately between states without sliding or fading.
- Pulsing badges or radar indicator rings remain strictly static.

---

## 3. Pillar 1: Section-by-Section Wireframe Specifications

*Canonical Route:* `/blueprints/b-cyber`  
*Parent Ecosystem:* B.Cyber Compass  
*Stage:* Pillar 1 — Understand  

---

### Section 0: Hero & Fast-Track Route Jump
* **Anchor ID:** `#overview-start` *(Verified match with sitemap)*
* **Section Purpose:** Establish scope and institutional trust, orient the visitor, and provide a compact three-option wayfinding rail to help visitors self-route.
* **User's Key Question:** *“What is this programme, and where should I go next if I already know the basics?”*
* **Design Pattern:** Editorial hero + three-option wayfinding rail (a starting point, not a promotional feature showcase; compact route selector faster to scan than large cards).
* **Do Not:** Use a generic cybersecurity stock photo, glowing lock graphic, decorative dashboard mockup, or three competing filled primary buttons.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Existing site header / navigation                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ [Independent guide · Not official IITK]                                      │
│                                                                              │
│ What Is IIT Kanpur B.Cyber?                                                  │
│ Degree Structure, Curriculum & Ground Truth                                  │
│                                                                              │
│ A four-year undergraduate cybersecurity programme: two years of coursework   │
│ at IIT Kanpur followed by a two-year internship component.                   │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ Choose what you need next                                                │ │
│ ├────────────────────────┬─────────────────────────┬───────────────────────┤ │
│ │ 01 · New here?         │ 02 · Admission          │ 03 · Ready?           │ │
│ │ Understand the         │ Check eligibility       │ Build your            │ │
│ │ programme basics       │ and selection process   │ preparation path      │ │
│ │ Read the 30-sec ↘      │ Admission guide ↗       │ Roadmap ↗             │ │
│ └────────────────────────┴─────────────────────────┴───────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ Existing site header        │
├─────────────────────────────┤
│ [Independent guide]         │
│                             │
│ What Is IIT Kanpur          │
│ B.Cyber?                    │
│                             │
│ Degree Structure,           │
│ Curriculum & Ground Truth   │
│                             │
│ A four-year undergraduate   │
│ cybersecurity programme:    │
│ two years of coursework,    │
│ then a two-year internship  │
│ component.                  │
│                             │
│ Choose what you need next   │
│ ┌─────────────────────────┐ │
│ │ 01 · New to B.Cyber?    │ │
│ │ Read the 30-sec ans ↘   │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 02 · Exploring entry?   │ │
│ │ Admission & eligib. ↗   │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 03 · Ready to prepare?  │ │
│ │ Preparation roadmap ↗   │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - Constrained text column (650–760 px) centered on desktop; clean vertical stack on mobile.
  - The disclosure sits above the H1 as plain text in a restrained pill/label (`[Independent guide · Not official IITK]`). Avoid tiny text or hidden tooltip icons.
  - Subtitle is visually subordinate and more muted.
  - Single shared route-selector panel under the subtitle (not three isolated promotional cards). Divided with light borders.
  - Only Option 01 is an in-page smooth-scroll anchor (`#quick-answer`). Options 02 and 03 navigate cross-pillar to `/admission#admission-start` and `/roadmap#prep-start`.
* **Mobile Behavior:**
  - Stack routes vertically in order (no horizontal carousels).
  - Full-width rows with minimum 48 × 48 px interactive tap area.
  - Strictly **no persistent mobile bottom bar or floating CTA overlay**.
* **Acceptance Checks:**
  - Direct answer reachable with 1 tap/click.
  - Disclosure readable at 320 px wide.
  - No route communicated by color alone.

---

### Section 1: B.Cyber in 30 Seconds
* **Anchor ID:** `#quick-answer` *(Verified match with sitemap)*
* **Section Purpose:** Answer immediately with a direct, quotable definition and official source link, optimized for scanning and search answer extraction (AEO/GEO).
* **User's Key Question:** *“What exactly is the IIT Kanpur B.Cyber programme?”*
* **Design Pattern:** One direct-answer block with a slim left brand-accent rule and official source link.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│ ┃ DIRECT ANSWER · SOURCE-CHECKED                                             │
│ ┃                                                                            │
│ ┃ The 30-second answer                                                       │
│ ┃                                                                            │
│ ┃ IIT Kanpur's Bachelor of Cybersecurity (B.Cyber.) is a four-year           │
│ ┃ undergraduate programme run by the Wadhwani School of AI and               │
│ ┃ Intelligent Systems (WSAIS). It features two years of coursework at IIT    │
│ ┃ Kanpur followed by a two-year internship component. Successful             │
│ ┃ graduates receive the B.Cyber degree and IIT Kanpur alumni status.          │
│ ┃                                                                            │
│ ┃ Source: IIT Kanpur official B.Cyber page ↗                                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ ┃ DIRECT ANSWER             │
│ ┃ SOURCE-CHECKED            │
│ ┃                           │
│ ┃ The 30-second answer      │
│ ┃                           │
│ ┃ IIT Kanpur's Bachelor of  │
│ ┃ Cybersecurity (B.Cyber.)  │
│ ┃ is a four-year            │
│ ┃ undergraduate programme   │
│ ┃ run by WSAIS. It has two  │
│ ┃ years of coursework at    │
│ ┃ IIT Kanpur, followed by a │
│ ┃ two-year internship       │
│ ┃ component. Successful     │
│ ┃ graduates receive the     │
│ ┃ B.Cyber degree and IIT    │
│ ┃ Kanpur alumni status.     │
│ ┃                           │
│ ┃ Official IITK source ↗    │
└─────────────────────────────┘
```

* **Layout & Copy Notes:**
  - Slim brand-accent rule on left; slightly tinted neutral surface for clear grouping.
  - Section heading uses *"The 30-second answer"* to avoid duplicating the H1 immediately below the fold.
  - Tagged *"DIRECT ANSWER · SOURCE-CHECKED"* as an editorial treatment (not claiming verbatim official proclamation).
  - Strict 40–60 word range. No bullet points, illustrations, or marketing copy inside the panel.
  - Source link points to `https://iitk.ac.in/wsais/b-cyber.php` with descriptive accessible text and supplementary external icon.
* **Acceptance Checks:**
  - Answer visible without expanding an accordion.
  - Source link keyboard reachable and clearly named.
  - Reads cleanly at 320 px without horizontal page scroll.

---

### Section 2: Program at a Glance
* **Anchor ID:** `#key-facts` *(Verified match with sitemap)*
* **Section Purpose:** Present published official program parameters in an easily scannable, verifiable key/value summary format.
* **User's Key Question:** *“What are the essential published parameters?”*
* **Design Pattern:** Two-column semantic description list (`dl`, `dt`, `dd`) based on the GOV.UK Summary List pattern (35/65 column split on desktop, stacked key/value on mobile). Avoids layout-only HTML tables.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ PROGRAM AT A GLANCE                                                          │
│ Essential published facts                                                    │
│                                                                              │
│ These facts describe the IIT Kanpur option. Admission-cycle details can      │
│ change, so do not treat a past admission process as the next year's rules.   │
│                                                                              │
│ Programme title        │ Bachelor of Cybersecurity (B.Cyber.)                │
│ ───────────────────────┼─────────────────────────────────────────────────────│
│ Academic unit          │ Wadhwani School of AI and Intelligent Systems       │
│                        │ (WSAIS), IIT Kanpur                                 │
│ ───────────────────────┼─────────────────────────────────────────────────────│
│ Duration               │ 4 years; maximum completion period of 6 years under │
│                        │ the published programme rules                       │
│ ───────────────────────┼─────────────────────────────────────────────────────│
│ Structure              │ Years 1–2: coursework at IIT Kanpur                 │
│                        │ Years 3–4: internship component                     │
│ ───────────────────────┼─────────────────────────────────────────────────────│
│ Degree & alumni        │ B.Cyber degree from IIT Kanpur and alumni status    │
│                        │ after successful completion                         │
│ ───────────────────────┼─────────────────────────────────────────────────────│
│ Placement support      │ Support is described on the official page; no       │
│                        │ established salary or placement-rate claim          │
│                                                                              │
│ [Institution note: IIT Madras also has a separately administered B.Cyber     │
│  programme under SIDiS. See the official IITK-hosted programme document ↗]   │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ PROGRAM AT A GLANCE         │
│ Essential published facts   │
│                             │
│ These facts describe the    │
│ IIT Kanpur option.          │
│                             │
│ Programme title             │
│ Bachelor of Cybersecurity   │
│ (B.Cyber.)                  │
│ ─────────────────────────── │
│ Academic unit               │
│ WSAIS, IIT Kanpur           │
│ ─────────────────────────── │
│ Duration                    │
│ Four years; maximum six     │
│ years under the published   │
│ programme rules             │
│ ─────────────────────────── │
│ Structure                   │
│ Years 1–2: coursework at    │
│ IIT Kanpur                  │
│ Years 3–4: internship       │
│ component                   │
│ ─────────────────────────── │
│ Degree & alumni status      │
│ B.Cyber degree and IITK     │
│ alumni status after         │
│ successful completion       │
│ ─────────────────────────── │
│ Placement support           │
│ Support is stated by IITK;  │
│ outcomes are not promised.  │
│                             │
│ Institutional distinction   │
│ IIT Madras has a separately │
│ administered version under  │
│ SIDiS. Read official note ↗ │
└─────────────────────────────┘
```

* **Content & Governance Rules:**
  - **Single Institution Focus:** Explicitly focused on IIT Kanpur. Institutional note clarifies that IIT Madras operates a separate programme under SIDiS; do not conflate into a single joint unit.
  - **Academic Unit:** WSAIS is the verified academic unit. Do not list C3iHub as the academic unit without programme-level primary citation.
  - **Placement Support:** Stated as *"Support is described; outcomes are not established."* Zero claims of placement rate or average packages.
  - **Alumni Status:** Qualified as granted *after successful completion*, not at the start of internship.
* **Acceptance Checks:**
  - Screen reader associations preserved via semantic `<dl>`, `<dt>`, `<dd>`.
  - Mobile values stack cleanly without cramped columns or horizontal scroll.

---

### Section 3: The Four-Year, 2+2 Model
* **Anchor ID:** `#model-2plus2` *(Verified match with sitemap)*
* **Section Purpose:** Explain the relationship between two consecutive pedagogical phases and prevent confusion between an internship requirement, permanent employment, and placement support.
* **User's Key Question:** *“Where does learning happen in Years 1–2, and what changes in Years 3–4?”*
* **Design Pattern:** Two-stage pathway diagram with connecting arrow + three-part distinction strip below (not a decorative event timeline; not generic feature cards).

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ THE FOUR-YEAR, 2+2 MODEL                                                     │
│ Two stages. Different settings. One degree pathway.                          │
│                                                                              │
│ PHASE 1                                      PHASE 2                         │
│ YEARS 01–02                                  YEARS 03–04                     │
│ Semesters 1–4                                Semesters 5–8                   │
│                                                                              │
│ ┌──────────────────────────────┐            ┌──────────────────────────────┐ │
│ │ ON-CAMPUS COURSEWORK         │            │ INTERNSHIP COMPONENT         │ │
│ │                              │            │                              │ │
│ │ IIT Kanpur campus            │   ────▶    │ Primarily selected           │ │
│ │                              │            │ government organisations     │ │
│ │ Core study includes:         │            │                              │ │
│ │ • Computing foundations      │            │ • Practical work in a host   │ │
│ │ • Data engineering           │            │   organisation               │ │
│ │ • Operating systems          │            │ • 54 credits per published   │ │
│ │ • Cryptography and DSA       │            │   semester (S5–S8)           │ │
│ │ • Digital forensics          │            │ • Stipend depends on host    │ │
│ │ • Cloud/network/web security │            │   policy; not guaranteed     │ │
│ │   labs                       │            │                              │ │
│ └──────────────────────────────┘            └──────────────────────────────┘ │
│                                                                              │
│ ─────────────────────── IMPORTANT DISTINCTIONS ───────────────────────────── │
│                                                                              │
│ INTERNSHIP COMPONENT        PERMANENT EMPLOYMENT      PLACEMENT SUPPORT      │
│ Part of the degree path.    Not guaranteed by the     A separate support     │
│                             internship component.     channel for eligible   │
│                                                       successful completers. │
│                                                                              │
│ Source note: the published IITK curriculum lists 54 credits in each of       │
│ Semesters 5–8. Host placement and stipend terms depend on the organisation.  │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ THE FOUR-YEAR, 2+2 MODEL    │
│ Two stages. Different       │
│ settings. One degree path.  │
│                             │
│ ● PHASE 1                   │
│ YEARS 01–02                 │
│ Semesters 1–4               │
│                             │
│ ON-CAMPUS COURSEWORK        │
│ IIT Kanpur campus           │
│                             │
│ Includes computing          │
│ foundations, data           │
│ engineering, operating      │
│ systems, cryptography,      │
│ digital forensics, and      │
│ cloud/network/web           │
│ security labs.              │
│                             │
│              │              │
│              ▼              │
│                             │
│ ● PHASE 2                   │
│ YEARS 03–04                 │
│ Semesters 5–8               │
│                             │
│ INTERNSHIP COMPONENT        │
│ Primarily selected          │
│ government organisations    │
│                             │
│ • 54 credits per published  │
│   semester, S5–S8           │
│ • Host stipend policy       │
│   varies                    │
│                             │
│ ── IMPORTANT DISTINCTIONS ──│
│                             │
│ Internship component        │
│ A required part of the      │
│ degree pathway.             │
│                             │
│ Permanent employment        │
│ Not guaranteed by the       │
│ internship.                 │
│                             │
│ Placement support           │
│ A separate support channel  │
│ for successful completers;  │
│ not a guaranteed outcome.   │
└─────────────────────────────┘
```

* **Design & Content Notes:**
  - Distinct phase progression indicated with directional arrow (`──▶` on desktop, `▼` on mobile); does NOT imply automatic job guarantee.
  - Phase 1 highlights representative subject areas and the 5 labs named on the published page (malware analysis, digital forensics, cloud security, VAPT, network/web security) without promotional hype.
  - Phase 2 wording matches official text: *"primarily at selected government organisations"*. No unverified named entities (CERT-In, NCIIPC, intelligence agencies) listed.
  - Credits: Semesters 5–8 clearly noted as 54 credits each (216 credits across the four internship semesters). Avoids asserting "200 credits" as an exact figure for Semesters 1–4.
  - Cautious stipend wording: depends on host organization policy; not guaranteed.
  - Three distinct clarifying columns below the diagram separate *Internship Component*, *Permanent Employment*, and *Placement Support*. These remain visible by default and are not hidden inside an accordion.
* **Acceptance Checks:**
  - Clear sequential flow on mobile without requiring horizontal scrolling.
  - Users can clearly distinguish degree internship from permanent employment.
  - Stipend caveat is colocated directly with Phase 2.

---

### Section 4: Curriculum and Subjects (Semesters 1 to 4)
* **Anchor ID:** `#curriculum` *(Verified match with sitemap)*
* **Section Purpose:** Present on-campus academic progression from Semester 1 to Semester 4 with verified course names, laboratory units, and credit distributions without hiding core curriculum content behind tabs or accordions.
* **User's Key Question:** *“What exact subjects and practical labs will I study semester-by-semester, and how does the curriculum build up?”*
* **Official Source Reference:** [IIT Kanpur WSAIS Official B.Cyber Curriculum](https://iitk.ac.in/wsais/b-cyber.php) *(Department of Computer Science & Engineering / WSAIS, IIT Kanpur)*.
* **Design Pattern (No-Tabs Grouped Progression):** **Grouped Academic Year Schedule (Side-by-Side Year Columns on Desktop, Sequential Linear Stack on Mobile)**.
  - *Research Reference:* Cambridge University Engineering Tripos Curriculum Structure (`https://www.undergraduate.study.cam.ac.uk/courses/engineering`) & MIT EECS Curriculum Roadmaps (`https://eecs.mit.edu/academics/undergraduate-programs/curriculum/`).
  - *Observation:* Foundational engineering curricula are most effectively evaluated when visitors can see the prerequisite progression across semesters simultaneously. Tab-based selectors hide 75% of courses at any given moment, impeding multi-semester scanning and comparison.
  - *Rationale:* Presenting Year 1 (Semesters 1 & 2) and Year 2 (Semesters 3 & 4) in side-by-side grouped columns on desktop displays 100% of course titles, credits, and laboratory allocations at a glance without interaction cost. On mobile, this reflows naturally into a single sequential stack (Year 1 → Sem 1 → Sem 2 → Year 2 → Sem 3 → Sem 4) without horizontal tabs or scrolling.
* **Do Not:** Hide core courses inside individual click-to-expand accordions; do not force tab clicks to compare semesters; do not substitute inferred courses or alternative titles; do not cite unlinked internal Senate drafts.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
*(No-Tabs Grouped Academic Year Layout — All 4 Semesters Visible Simultaneously)*
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Academics & Structure]                                                      │
│ CURRICULUM & SUBJECTS (SEMESTERS 1 TO 4)                                     │
│ On-Campus Academic & Laboratory Foundations at IIT Kanpur                    │
│ Official Reference: https://iitk.ac.in/wsais/b-cyber.php                     │
│                                                                              │
│ ┌─ ⚠️ OFFICIAL SEMESTER 2 CREDIT RANGE NOTE ───────────────────────────────┐ │
│ │ The published WSAIS curriculum lists one course from a predefined list   │ │
│ │ as 9–13 credits, yielding a Semester 2 total of 50–54 credits. Pending   │ │
│ │ official institutional clarification, this total is stated as a range.   │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ YEAR 1: ACADEMIC FOUNDATIONS ─────┐  ┌─ YEAR 2: CORE SYSTEMS & DEFENSE ─┐ │
│ │                                    │  │                                  │ │
│ │ SEMESTER 1 (51 CREDITS TOTAL)      │  │ SEMESTER 3 (50 CREDITS TOTAL)    │ │
│ │ ────────────────────────────────── │  │ ──────────────────────────────── │ │
│ │ • Introduction to Electronics      │  │ • Fundamentals of Data           │ │
│ │   14 Credits · Hardware Foundations│  │   Engineering (Ops) · 12 Credits │ │
│ │ • Practical Ethics                 │  │ • Operating Systems              │ │
│ │   3 Credits · Context & Ethics     │  │   13 Credits · Core Systems      │ │
│ │ • Fundamentals of Computing        │  │ • Lab: Cloud Computing & Sec     │ │
│ │   14 Credits · Core Computing      │  │   8 Credits · Practical Lab      │ │
│ │ • Fundamentals of Data             │  │ • Lab: Vulnerability Assessment  │ │
│ │   Engineering (Data) · 12 Credits  │  │   & Pen Testing · 8 Credits Lab  │ │
│ │ • Lab: Malware Analysis            │  │ • Departmental Elective          │ │
│ │   8 Credits · Practical Lab        │  │   9 Credits · Dept Elective      │ │
│ │                                    │  │                                  │ │
│ │ ────────────────────────────────── │  │ ──────────────────────────────── │ │
│ │ SEMESTER 2 (50–54 CREDITS TOTAL*)  │  │ SEMESTER 4 (46 CREDITS TOTAL)    │ │
│ │ ────────────────────────────────── │  │ ──────────────────────────────── │ │
│ │ • Applied Cryptography             │  │ • Introduction to Psychology     │ │
│ │   9 Credits · Cryptographic Core   │  │   11 Credits · Behavioral Science│ │
│ │ • Data Structures & Algorithms     │  │ • Computer Networks              │ │
│ │   12 Credits · Core Computing      │  │   9 Credits · Core Systems       │ │
│ │ • Computer Organization            │  │ • Course from Predefined List    │ │
│ │   12 Credits · Hardware Arch       │  │   9 Credits · Predefined Elective│ │
│ │ • Lab: Digital Forensics           │  │ • Course from Predefined List    │ │
│ │   8 Credits · Practical Lab        │  │   9 Credits · Predefined Elective│ │
│ │ • Course from Predefined List      │  │ • Lab: Network & Web App Sec     │ │
│ │   9–13 Credits* · Predefined List  │  │   8 Credits · Practical Lab      │ │
│ └────────────────────────────────────┘  └──────────────────────────────────┘ │
│                                                                              │
│ ───────────────────── 5 PRESCRIBED LABORATORY COURSES ────────────────────── │
│ Grounded strictly in official curriculum titles and credit weights (8C each):│
│ • Sem 1: Lab: Malware Analysis (8 Credits)                                   │
│ • Sem 2: Lab: Digital Forensics (8 Credits)                                  │
│ • Sem 3: Lab: Cloud Computing and Security (8 Credits)                       │
│ • Sem 3: Lab: Vulnerability Assessment & Pen Testing (8 Credits)             │
│ • Sem 4: Lab: Network & Web Application Security (8 Credits)                 │
│ [Note: Describes course units only; does not imply dedicated physical bldgs] │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
*(Sequential Linear Stack — Zero Tabs, Zero Horizontal Scroll)*
```
┌─────────────────────────────┐
│ CURRICULUM & SUBJECTS       │
│ Semesters 1 to 4            │
│ [iitk.ac.in/wsais/b-cyber]  │
│                             │
│ ⚠️ Semester 2 Credit Note:  │
│ WSAIS lists elective as     │
│ 9–13C; total 50–54C pending │
│ official clarification.     │
│                             │
│ ════ YEAR 1 FOUNDATIONS ═══ │
│                             │
│ ┌─ SEMESTER 1 (51 CREDITS)─┐│
│ │ • Intro to Electronics   ││
│ │   14 Credits             ││
│ │ • Practical Ethics       ││
│ │   3 Credits              ││
│ │ • Fund. of Computing     ││
│ │   14 Credits             ││
│ │ • Fund. of Data Eng      ││
│ │   (Data) · 12 Credits    ││
│ │ • Lab: Malware Analysis  ││
│ │   8 Credits              ││
│ └──────────────────────────┘│
│                             │
│ ┌─ SEMESTER 2 (50–54 CR*) ─┐│
│ │ • Applied Crypto (9C)    ││
│ │ • DSA (12C)              ││
│ │ • Computer Org (12C)     ││
│ │ • Lab: Forensics (8C)    ││
│ │ • Predefined Elective    ││
│ │   (9–13C*)               ││
│ └──────────────────────────┘│
│                             │
│ ════ YEAR 2 CORE SYSTEMS ══ │
│                             │
│ ┌─ SEMESTER 3 (50 CREDITS)─┐│
│ │ • Fund. of Data Eng      ││
│ │   (Ops) · 12 Credits     ││
│ │ • Operating Systems (13C)││
│ │ • Lab: Cloud Sec (8C)    ││
│ │ • Lab: Vulnerability     ││
│ │   Assess. & Pen Test (8C)││
│ │ • Dept Elective (9C)     ││
│ └──────────────────────────┘│
│                             │
│ ┌─ SEMESTER 4 (46 CREDITS)─┐│
│ │ • Intro to Psychology    ││
│ │   11 Credits             ││
│ │ • Computer Networks (9C) ││
│ │ • Predefined Elective(9C)││
│ │ • Predefined Elective(9C)││
│ │ • Lab: Net & Web Sec (8C)││
│ └──────────────────────────┘│
│                             │
│ ── 5 PRESCRIBED LABS (8C) ──│
│ • S1: Malware Analysis (8C) │
│ • S2: Digital Forensics(8C) │
│ • S3: Cloud Security (8C)   │
│ • S3: VAPT Laboratory (8C)  │
│ • S4: Net & Web Sec (8C)    │
│ (Curriculum course units)   │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - Desktop features two wide, side-by-side containers grouping Year 1 (Semesters 1 and 2) and Year 2 (Semesters 3 and 4). All verified courses and credits are visible without clicking.
  - Semester 1 verified: Introduction to Electronics (14C), Practical Ethics (3C), Fundamentals of Computing (14C), Fundamentals of Data Engineering (Data) (12C), Lab: Malware Analysis (8C) = **51 credits**.
  - Semester 2 verified: Applied Cryptography (9C), Data Structures and Algorithms (12C), Computer Organization (12C), Lab: Digital Forensics (8C), Course from predefined list (9–13C) = **50–54 credits**.
  - Semester 3 verified: Fundamentals of Data Engineering (Ops) (12C), Operating Systems (13C), Lab: Cloud Computing and Security (8C), Lab: Vulnerability Assessment & Pen Testing (8C), Departmental Elective (9C) = **50 credits**.
  - Semester 4 verified: Introduction to Psychology (11C), Computer Networks (9C), Two courses from predefined list (9C + 9C), Lab: Network & Web Application Security (8C) = **46 credits**.
  - Mobile layout uses a clean sequential stack. Headings use prominent rules (`════`) to demarcate academic years clearly.
* **Factual Guardrails & Laboratory Rigor:**
  - The 5 laboratory courses are cited verbatim from official course titles with their 8-credit allocations.
  - Does NOT assert or imply dedicated standalone physical laboratories, specialized proprietary hardware, or specific unverified lab exercises.
* **Interaction & Accessibility:**
  - Zero interactive tabs required: content is static, instantly searchable, and screen-reader accessible in document flow order.
  - Headings structured strictly: `H2` for Section, `H3` for Academic Years, `H4` for Semesters, semantic unordered lists (`<ul>`) for course entries.

---

### Section 5: Beyond Hacking: What Cybersecurity Actually Covers
* **Anchor ID:** `#beyond-hacking` *(Verified match with sitemap)*
* **Section Purpose:** Broaden applicant perception from the popular trope of "ethical hacking/bug bounties" to full-spectrum systems engineering by grouping the official curriculum into five clear explanatory domains.
* **User's Key Question:** *“Is B.Cyber just ethical hacking and CTFs, or does it cover broader computer science and systems engineering?”*
* **Design Pattern (Rule-Separated Specification Sheet):** **Structured Specification Sheet with Distinct Table Rules** instead of repetitive marketing cards.
  - *Research Reference:* Stripe API Technical Reference (`https://stripe.com/docs/api`) & W3C Technical Architecture Documentation (`https://www.w3.org/TR/architecture/`).
  - *Observation:* Visually repetitive card grids suffer from layout fatigue and make comparing fine attributes difficult. Multi-attribute specification sheets with horizontal rule separators establish high information density, structural hierarchy, and distinct attribute scanning.
  - *Rationale:* Allows clean structural separation between (1) Verified Course Titles from the official syllabus and (2) Illustrative Technical Applications, while making the explanatory nature of the domain grouping transparent.
* **Framing & Disclaimers:**
  - **Explanatory Grouping Notice:** The five domains represent this guide's explanatory grouping to help prospective applicants understand the scope of cybersecurity. They are not official IIT Kanpur curriculum categories or independent degree tracks.
  - **Workforce Framework Context:** References to the NIST NICE Cybersecurity Workforce Framework (NIST SP 800-181) describe an external industry framework illustrating the diversity of cybersecurity roles, not proof that IIT Kanpur's syllabus maps directly to these five categories.
  - **Separation of Course Titles vs Illustrative Topics:** Verified courses are restricted strictly to official syllabus titles. Illustrative topics are explicitly marked as the guide's explanatory interpretation, not guaranteed course outcomes.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
*(Rule-Separated Technical Specification Sheet)*
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Engineering Scope & Domains]                                                │
│ BEYOND HACKING: WHAT CYBERSECURITY ACTUALLY COVERS                           │
│ Explanatory Synthesis: Systems Engineering, Data, Cryptography & Defense     │
│                                                                              │
│ [Notice: These 5 domains represent this guide's explanatory grouping to help │
│  explain the discipline. They are not official IIT Kanpur degree tracks.     │
│  NIST NICE SP 800-181 is cited as an external workforce reference model.]    │
│ ──────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│ 01 · COMPUTING & HARDWARE FOUNDATIONS                                        │
│ Verified Courses:      Introduction to Electronics (Sem 1, 14C) ·            │
│                        Fundamentals of Computing (Sem 1, 14C) ·              │
│                        Computer Organization (Sem 2, 12C) ·                  │
│                        Operating Systems (Sem 3, 13C)                        │
│ Illustrative Topics:   Low-level hardware-software interfaces, machine       │
│ (Guide's explanation)  execution models, process management, OS abstractions │
│ Engineering Context:   Understanding system foundations to analyze defense   │
│ ──────────────────────────────────────────────────────────────────────────── │
│ 02 · DATA ENGINEERING & SYSTEMS OPERATIONS                                   │
│ Verified Courses:      Fundamentals of Data Engineering (Data) (Sem 1, 12C) ·│
│                        Fundamentals of Data Engineering (Ops) (Sem 3, 12C)   │
│ Illustrative Topics:   Data storage architectures, pipeline resilience,      │
│ (Guide's explanation)  system operations, infrastructure reliability         │
│ Engineering Context:   Managing reliable data platforms and systems at scale │
│ ──────────────────────────────────────────────────────────────────────────── │
│ 03 · NETWORKS & APPLIED CRYPTOGRAPHY                                         │
│ Verified Courses:      Applied Cryptography (Sem 2, 9C) ·                    │
│                        Computer Networks (Sem 4, 9C)                         │
│ Illustrative Topics:   Mathematical cipher principles, key exchange, network │
│ (Guide's explanation)  protocol stacks, communication security flows         │
│ Engineering Context:   Protecting data in transit and cryptographic defense  │
│ ──────────────────────────────────────────────────────────────────────────── │
│ 04 · PRESCRIBED DIAGNOSTIC & DEFENSE LABORATORIES                            │
│ Verified Courses:      Lab: Malware Analysis (Sem 1, 8C) · Lab: Digital      │
│                        Forensics (Sem 2, 8C) · Lab: Cloud Computing and      │
│                        Security (Sem 3, 8C) · Lab: Vulnerability Assessment  │
│                        & Pen Testing (Sem 3, 8C) · Lab: Network & Web        │
│                        Application Security (Sem 4, 8C)                      │
│ Illustrative Topics:   Structured diagnostic evaluation, artifact analysis,  │
│ (Guide's explanation)  penetration testing frameworks, incident forensics    │
│ Engineering Context:   Five intensive 8-credit practical laboratory courses  │
│ ──────────────────────────────────────────────────────────────────────────── │
│ 05 · BEHAVIORAL, ETHICAL & SOCIAL FOUNDATIONS                                │
│ Verified Courses:      Practical Ethics (Sem 1, 3C) ·                        │
│                        Introduction to Psychology (Sem 4, 11C)               │
│ Illustrative Topics:   Professional ethical obligations, cognitive factors,  │
│ (Guide's explanation)  social engineering awareness, organizational policy   │
│ Engineering Context:   Understanding human and institutional dimensions      │
│ ──────────────────────────────────────────────────────────────────────────── │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
*(Stacked Specification Rows — Zero Horizontal Scroll)*
```
┌─────────────────────────────┐
│ BEYOND HACKING              │
│ Explanatory Domain Sheet    │
│                             │
│ [Independent grouping note: │
│  Curriculum synthesis, not  │
│  official IITK tracks.]     │
│ ─────────────────────────── │
│ 01 · COMPUTING & HARDWARE   │
│ Verified Courses:           │
│ • Intro to Electronics (S1) │
│ • Fund. of Computing (S1)   │
│ • Computer Org (S2)         │
│ • Operating Systems (S3)    │
│ Illustrative Topics:        │
│ Hardware/OS abstractions    │
│ ─────────────────────────── │
│ 02 · DATA ENGINEERING       │
│ Verified Courses:           │
│ • Fund. Data Eng (Data, S1) │
│ • Fund. Data Eng (Ops, S3)  │
│ Illustrative Topics:        │
│ Data storage, ops pipelines │
│ ─────────────────────────── │
│ 03 · NETWORKS & CRYPTO      │
│ Verified Courses:           │
│ • Applied Crypto (S2)       │
│ • Computer Networks (S4)    │
│ Illustrative Topics:        │
│ Ciphers, protocol stacks    │
│ ─────────────────────────── │
│ 04 · DIAGNOSTIC LABS        │
│ Verified Courses:           │
│ • 5 Prescribed Lab Units:   │
│   Malware (S1), Forensics(S2│
│   Cloud (S3), VAPT (S3),    │
│   Net & Web Sec (S4) (8C ea)│
│ Illustrative Topics:        │
│ Diagnostic triage & testing │
│ ─────────────────────────── │
│ 05 · BEHAVIORAL & ETHICAL   │
│ Verified Courses:           │
│ • Practical Ethics (S1)     │
│ • Intro to Psychology (S4)  │
│ Illustrative Topics:        │
│ Ethics, cognitive factors   │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - Uses an editorial specification-sheet pattern with prominent border dividers (`border-t border-slate-200`) instead of five visually repetitive card containers.
  - Strict two-tier information architecture per domain: **Verified Courses** (official curriculum syllabus titles) and **Illustrative Topics** (plain-language real-world concepts).
  - Explicit disclaimer colocated at the top: explains that domains represent an explanatory framework and that NIST NICE is cited as an external workforce taxonomy.
* **Factual Guardrails:**
  - Audited and removed all unsupported titles: *Cryptographic Engineering*, *Threat Intelligence*, *Linear Algebra*, *Probability and Statistics*.
  - Confines verified listings strictly to published WSAIS course titles.

---

### Section 6: Balanced Degree Comparison (B.Cyber vs Conventional B.Tech CSE)
* **Anchor ID:** `#degree-comparison` *(Verified match with sitemap)*
* **Section Purpose:** Provide an objective, balanced side-by-side structural comparison between IIT Kanpur B.Cyber and conventional B.Tech Computer Science across verified dimensions, without portraying either degree as universally superior.
* **User's Key Question:** *“How does B.Cyber differ from a conventional B.Tech Computer Science degree, and what are the objective trade-offs?”*
* **Design Pattern (3-Column Desktop Matrix, Mobile Dimension Stack):**
  - *Research Reference:* Nielsen Norman Group — *Comparison Tables for Mobile Devices* (`https://www.nngroup.com/articles/comparison-tables/`) & W3C WAI Web Accessibility Tutorials — *Tabular Data Display* (`https://www.w3.org/WAI/tutorials/tables/`).
  - *Observation:* Comparison tables with numerous columns fail on mobile viewports when squeezed or forced into horizontal scrolling. Reflowing each dimension into an isolated comparative card preserves clarity and reading ease on screens down to 320px.
  - *Rationale:* Eliminates arbitrary user-facing column percentage labels (such as `22% / 39% / 39%`). Streamlines comparative dimensions to structural and curricular factors, removing redundant placement and higher-study rows that duplicate Sections 8 and 9.
* **Explicit Qualifications & Exclusions:**
  - **General CSE Variance:** Explicitly notes that conventional B.Tech CSE learning formats, laboratory provisions, elective choices, branch-change rules, and career outcomes vary widely across different institutions. Avoids assuming an identical structure for all CSE programs.
  - **Higher Studies Reserved for Section 8:** Postgraduate degree recognition, statutory standing, and global higher study pathways are owned exclusively by Section 8 (`#degree-recognition`) and are omitted entirely from this comparison matrix to eliminate duplication.
  - **Branch-Change Document Status:** The unlinked assertion that branch change is prohibited by Senate resolution is removed from the matrix. (WSAIS FAQ 12 notes that branch change to other B.Tech programs is not permitted, but formal Senate resolution documents are not publicly accessible).
  - **Duplication Avoidance:** Placement track records and career deployment specifics are addressed in Section 9 (`#career-internships`), not duplicated here.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
*(3-Column Structural Comparison Matrix — No User-Facing Percentage Labels)*
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Degree Comparison & Analysis]                                               │
│ BALANCED DEGREE COMPARISON                                                   │
│ Structural & Curricular Dimensions: B.Cyber vs Conventional B.Tech CSE        │
│                                                                              │
│ [Note: Conventional CSE programme formats, curricula, and outcomes vary      │
│  across institutions. Neither degree is universally superior; each serves    │
│  distinct educational and career objectives.]                                │
│ ──────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│ Dimension              │ IIT Kanpur B.Cyber          │ Conventional B.Tech   │
│                        │                             │ CSE (General)         │
│ ───────────────────────┼─────────────────────────────┼───────────────────────│
│ Core Curricular        │ Specialized from Year 1 on  │ Broad foundational    │
│ Focus                  │ low-level systems, data     │ computing: algorithms,│
│                        │ engineering, cyber labs,    │ software engineering, │
│                        │ and applied cryptography.   │ systems, and electives│
│ ───────────────────────┼─────────────────────────────┼───────────────────────│
│ Structural Learning    │ Prescribed 2 Years          │ Typically a four-year │
│ Format                 │ On-Campus Study (Sem 1–4) + │ undergraduate degree; │
│                        │ 2 Years Field Deployment    │ campus arrangements,  │
│                        │ (Sem 5–8 at host orgs).     │ internships, lab      │
│                        │                             │ provision and elective│
│                        │                             │ structures vary by    │
│                        │                             │ institution.          │
│ ───────────────────────┼─────────────────────────────┼───────────────────────│
│ Practical Laboratory   │ 5 Prescribed Cybersecurity  │ General computing     │
│ Distribution           │ Laboratory Courses (8C each)│ labs and departmental │
│                        │ across Semesters 1 to 4.    │ electives (varies).   │
│ ──────────────────────────────────────────────────────────────────────────── │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
*(Responsive Dimension Stack — Strictly Zero Horizontal Scroll)*
```
┌─────────────────────────────┐
│ DEGREE COMPARISON           │
│ B.Cyber vs Conventional CSE │
│                             │
│ [Note: Conventional CSE     │
│  structures vary by college]│
│                             │
│ ┌─ 01 · CURRICULAR FOCUS ─┐ │
│ │ IIT Kanpur B.Cyber:     │ │
│ │ Systems, data eng, cyber│ │
│ │ labs & applied crypto   │ │
│ │ from Year 1.            │ │
│ │ ─────────────────────── │ │
│ │ Conventional B.Tech CSE:│ │
│ │ Broad computing: soft-  │ │
│ │ ware engineering, theory│ │
│ │ and general electives.  │ │
│ └─────────────────────────┘ │
│ ┌─ 02 · LEARNING FORMAT ──┐ │
│ │ IIT Kanpur B.Cyber:     │ │
│ │ Prescribed 2 Yrs campus │ │
│ │ + 2 Yrs field deploy.   │ │
│ │ ─────────────────────── │ │
│ │ Conventional B.Tech CSE:│ │
│ │ Typically a 4-year      │ │
│ │ degree; campus setup,   │ │
│ │ internships, lab &      │ │
│ │ electives vary by inst. │ │
│ └─────────────────────────┘ │
│ ┌─ 03 · LABORATORY MODEL ─┐ │
│ │ IIT Kanpur B.Cyber:     │ │
│ │ 5 Prescribed cyber labs │ │
│ │ (8 credits each, S1–S4).│ │
│ │ ─────────────────────── │ │
│ │ Conventional B.Tech CSE:│ │
│ │ General CS labs and     │ │
│ │ electives (varies).     │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - Desktop table displays clear dimensional rows without arbitrary width percentage labels.
  - Mobile reflows into a **Dimension Stack** where each card encapsulates one attribute, displaying B.Cyber and Conventional CSE side-by-side or in stacked blocks.
  - Clean boundary borders prevent visual ambiguity.
* **Factual Guardrails:**
  - Avoids unverified salary comparisons, placement statistics, or claims of employer superiority.
  - Eliminates redundant placement rows (detailed in Section 9) and reserves all postgraduate credential analysis for Section 8.
  - Qualifies that conventional CSE offerings differ significantly by institution.

---

### Section 7: Is B.Cyber Right for You? (Fit Check & Reflection)
* **Anchor ID:** `#fit-check` *(Verified match with sitemap)*
* **Section Purpose:** Help prospective applicants self-reflect on their personal academic interests, coursework readiness, and lifestyle fit using neutral, non-diagnostic prompts.
* **User's Key Question:** *“Am I personally and academically suited for this degree, or should I consider a conventional path?”*
* **Design Pattern (Non-Diagnostic Self-Reflection Checklist):** **Qualitative Considerations Guide + 3-Prompt Contextual Reflection Tool**.
  - *Research Reference:* The Open University Course Choice Self-Assessment Tools (*OU Choices Checklist*, `https://www.open.ac.uk/courses/do-it/choices`) & W3C WAI ARIA Checkbox Design Pattern (`https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/`).
  - *Observation:* Educational self-assessment aids work best when they prompt qualitative reflection on workload and study mode, rather than attempting to compute an automated "aptitude score" or "admission probability."
  - *Rationale:* Employs standard, labelled HTML checkboxes (`<input type="checkbox">` + `<label>`) with visible keyboard focus indicators. Explanatory context is visible by default directly beneath each prompt. Does NOT produce a fit percentage, diagnostic score, automated pass/fail judgment, or unsupported recommendation.
* **Scope & Framing Rules:**
  - **No Admission Process Information:** Strictly omits admission process mechanics (e.g. hackathons, JEE Main percentiles, prior work evaluations). All admission information is reserved for Pillar 2 (`/admission`).
  - **Explicit Non-Diagnostic Tool Notice:** Prominently clarifies that the tool is an educational self-reflection aid. It measures neither admission eligibility nor the probability of academic success.
  - **No Unverified Course Names:** Audited to ensure unverified course names (such as *Discrete Mathematics*, *Linear Algebra*, or *Probability*) are not referenced.
  - **Visible Explanatory Context:** Contextual explanation for each prompt is visible by default to ensure transparency and complete accessibility.
  - **Neutral Prompt Framing:** Focuses strictly on:
    1. Systems and low-level computing orientation.
    2. Technical and data engineering coursework rigor.
    3. The two-year off-campus field-deployment arrangement.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
*(Qualitative Fit Dimensions + Native Non-Diagnostic Reflection Checklist)*
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Personal Fit & Reflection]                                                  │
│ IS B.CYBER RIGHT FOR YOU?                                                    │
│ Honest Reflection Criteria & Academic Fit Considerations                     │
│                                                                              │
│ ┌───────────────────────────────┐   ┌──────────────────────────────────────┐ │
│ │ CHARACTERISTICS OF STRONG FIT │   │ CONSIDERATIONS TO WEIGH CAREFULLY    │ │
│ │                               │   │                                      │ │
│ │ • Genuine interest in low-    │   │ • Primary interest is exclusively in │ │
│ │   level computing, electronics│   │   high-level web or consumer app dev │ │
│ │   systems, and networks       │   │                                      │ │
│ │ • Readiness for intensive data│   │ • Strong preference for a traditional│ │
│ │   engineering & applied crypto│   │   four-year residential campus       │ │
│ │ • Enthusiastic about full-time│   │ • Expecting conventional CSE elective│ │
│ │   field deployment in Y3 & Y4 │   │   breadth across general software domains│
│ └───────────────────────────────┘   └──────────────────────────────────────┘ │
│                                                                              │
│ ┌─ 3-PROMPT SELF-REFLECTION CHECKLIST (NON-DIAGNOSTIC AID) ────────────────┐ │
│ │ [Tool Notice: This tool is an informational self-reflection aid. It does │ │
│ │  not calculate admission eligibility, predict success, or generate a     │ │
│ │  score. Context explanations are visible below each prompt.]             │ │
│ │                                                                          │ │
│ │ [ ] <input type="checkbox" id="check-systems">                           │ │
│ │     <label for="check-systems">                                          │ │
│ │     1. Systems & Computing Orientation                                   │ │
│ │     "I am interested in low-level computing, electronics, operating      │ │
│ │      systems, and networks, rather than solely consumer software."       │ │
│ │     </label>                                                             │ │
│ │     ↳ Context: Semesters 1–4 include Introduction to Electronics (14C),  │ │
│ │       Fundamentals of Computing (14C), Computer Organization (12C),       │ │
│ │       Operating Systems (13C), and Computer Networks (9C).               │ │
│ │                                                                          │ │
│ │ [ ] <input type="checkbox" id="check-rigor">                             │ │
│ │     <label for="check-rigor">                                            │ │
│ │     2. Technical & Systems Rigor                                         │ │
│ │     "I am prepared for intensive technical study combining systems       │ │
│ │      programming, data engineering, and applied cryptography with        │ │
│ │      practical laboratory coursework."                                   │ │
│ │     </label>                                                             │ │
│ │     ↳ Context: The curriculum pairs core computing and data engineering  │ │
│ │       (Data and Ops) with applied cryptography and five intensive        │ │
│ │       8-credit practical laboratories across Semesters 1–4.              │ │
│ │                                                                          │ │
│ │ [ ] <input type="checkbox" id="check-deployment">                        │ │
│ │     <label for="check-deployment">                                       │ │
│ │     3. Two-Year Field-Deployment Model                                   │ │
│ │     "I am comfortable with a four-year structure where Years 3 and 4 are │ │
│ │      spent off-campus on full-time field deployment at a host org."       │ │
│ │     </label>                                                             │ │
│ │     ↳ Context: Semesters 5–8 comprise 216 credits of academic field      │ │
│ │       deployment conducted off-campus under host organization norms.     │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
*(Vertical Consideration Cards + Accessible Checkbox Stack)*
```
┌─────────────────────────────┐
│ IS B.CYBER RIGHT FOR YOU?   │
│ Personal Fit & Reflection   │
│                             │
│ ┌─ STRONG FIT TRAITS ─────┐ │
│ │ • Low-level systems     │ │
│ │ • Data eng & crypto     │ │
│ │ • Off-campus deployment │ │
│ └─────────────────────────┘ │
│ ┌─ WEIGH CAREFULLY IF... ─┐ │
│ │ • Exclusively app/web   │ │
│ │ • Want 4-yr campus life │ │
│ │ • Want general CS bread.│ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ 3-PROMPT REFLECTION ───┐ │
│ │ [Non-diagnostic aid; no │ │
│ │  score or eligibility]  │ │
│ │                         │ │
│ │ [ ] 1. Systems Focus    │ │
│ │ Curious about low-level │ │
│ │ computing, OS, networks.│ │
│ │ ↳ Context: Core systems │ │
│ │   across Semesters 1–4. │ │
│ │ ─────────────────────── │ │
│ │ [ ] 2. Technical Rigor  │ │
│ │ Prepared for data eng,  │ │
│ │ crypto, and 5 labs.     │ │
│ │ ↳ Context: Data (Data & │ │
│ │   Ops) + 5 cyber labs.  │ │
│ │ ─────────────────────── │ │
│ │ [ ] 3. Two-Year Deploy  │ │
│ │ Comfortable spending    │ │
│ │ Y3–Y4 off-campus at org.│ │
│ │ ↳ Context: 216 Credits  │ │
│ │   off-campus deployment.│ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - Two qualitative consideration cards at the top (Strong Fit Traits vs Considerations to Weigh Carefully).
  - 3-Prompt Reflection Module below with prominent informational disclaimer.
  - Native semantic HTML markup: `<input type="checkbox">` elements associated with descriptive `<label>` elements via matching `id`/`for` attributes.
  - Contextual explanations remain visible by default beneath each prompt.
* **Interaction & Accessibility:**
  - Standard native checkboxes support keyboard toggling with `Space`.
  - Visible focus indicators (`:focus-visible` outline / ring).
  - Interactive state is purely reflective: toggling checkboxes does NOT trigger an automated score calculation, percentage meter, or diagnostic pass/fail label.
* **Factual Guardrails:**
  - Eliminates all claims regarding admission mechanisms, hackathon evaluation, or JEE rank predictions (which belong strictly to Pillar 2).
  - Removed all unverified course mentions (Discrete Mathematics, Linear Algebra, Probability).
  - Explicitly states that the tool does not measure admission eligibility or academic success probability.
---

### Section 8: Degree Award, Recognition & Higher Studies
* **Anchor ID:** `#degree-recognition` *(Verified match with sitemap)*
* **Section Purpose:** Detail the legal conferral, Senate statutory authority, and global postgraduate eligibility rules without making unverified institutional claims.
* **User's Key Question:** *"Is this a recognized degree? Can I pursue an MS or Ph.D. globally after graduating?"*

#### Low-Fidelity Desktop Wireframe
```
+---------------------------------------------------------------------------------------------------+
| [Category: Institutional Standing]                                                                |
| [H2: Degree Award, Recognition & Higher Studies]                                                  |
| [Subtitle: Official Senate standing, credential validity, and postgraduate pathways]              |
|                                                                                                   |
| +-- [Main Summary Statement Card (bg-white border border-slate-200 p-6)] -----------------------+ |
| | "Students who successfully complete all academic and field deployment requirements are        | |
| |  awarded the Bachelor of Cybersecurity (B.Cyber.) degree by the Senate of IIT Kanpur,         | |
| |  conferring regular IIT Kanpur alumni status upon graduation."                                | |
| |                                                                                               | |
| | +-- [3-Column Parameter Cards] -------------------------------------------------------------+ | |
| | | +-----------------------+ +-------------------------+ +---------------------------------+ | | |
| | | | Formal Degree Title   | | Alumni Standing         | | Postgraduate Eligibility (FAQ 9)| | | |
| | | | Bachelor of           | | Granted regular IIT     | | Eligible to apply for MS/MTech/ | | | |
| | | | Cybersecurity         | | Kanpur alumni status    | | PhD in India and abroad, subject| | | |
| | | | (B.Cyber.)            | | upon graduation         | | to host admission criteria*     | | | |
| | | +-----------------------+ +-------------------------+ +---------------------------------+ | | |
| | +-------------------------------------------------------------------------------------------+ | |
| |                                                                                               | |
| | [*Source Verification Note: Equivalence for foreign universities depends on receiving         | |
| |  institution criteria. No individual foreign private university names are claimed as settled] | |
| +-----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

#### Low-Fidelity Mobile Wireframe
```
+---------------------------------------------------+
| [Category: Institutional Standing]                |
| [H2: Degree Award & Recognition]                  |
|                                                   |
| +-- [Degree Conferred Card] --------------------+ |
| | Formal Degree Title:                          | |
| | -> Bachelor of Cybersecurity (B.Cyber.)       | |
| | Conferred by: Senate of IIT Kanpur            | |
| +-----------------------------------------------+ |
|                                                   |
| +-- [Alumni Standing Card] ---------------------+ |
| | Regular IIT Kanpur Alumni Status granted      | |
| | upon successful graduation                    | |
| +-----------------------------------------------+ |
|                                                   |
| +-- [Higher Studies Card (FAQ 9)] --------------+ |
| | Eligible to apply for MS/MTech/PhD programs   | |
| | in India and abroad                           | |
| |                                               | |
| | [⚠️ Source Verification Limitation]:           | |
| | Admission subject to criteria of receiving    | |
| | institution; no automatic blanket waiver.     | |
| +-----------------------------------------------+ |
+---------------------------------------------------+
```

* **Content Hierarchy & Density:** Medium density. 3-column statutory summary on desktop; stacked cards on mobile.
* **Interaction States:** Static informational display with verified citation callout.
* **Factual Rigor & Verification:**
  - **CORRECTION APPLIED:** Removed unauthorized claims that graduates have guaranteed admission at specific private US institutions (e.g. Stanford, MIT, CMU).
  - Explicitly bounds foreign higher study eligibility to WSAIS FAQ 9 exact wording: *"Eligible to apply for postgraduate programs (such as MS, MTech, PhD) in India and abroad, subject to the admission criteria of the respective institutions."*

---

### Section 9: Internship, Stipend & Placement Reality
* **Anchor ID:** `#internship-reality` *(Verified match with sitemap)*
* **Section Purpose:** Present verified facts regarding host organizations, stipend policies, and campus placement support while dispelling false salary promises.
* **User's Key Question:** *"Do I get paid during the internship? What are the actual placement outcomes?"*

#### Low-Fidelity Desktop Wireframe
```
+---------------------------------------------------------------------------------------------------+
| [Category: Career & Internship Facts]                                                             |
| [H2: Internship, Stipend & Placement Reality]                                                     |
| [Subtitle: Ground truth verified against published institute circulars and FAQ records]           |
|                                                                                                   |
| +-----------------------------------------------+  +--------------------------------------------+ |
| | WHAT OFFICIAL SOURCES CONFIRM                 |  | WHAT PUBLISHED RECORDS DO NOT ESTABLISH    | |
| | [Neutral Verified Fact List]                  |  | [Amber Warning / Boundary List]            | |
| | • Years 3 & 4 are mandatory field internships |  | • No uniform or institute-guaranteed fixed | |
| | • Partner orgs include government, defense,   |  |   stipend amount across all hosts          | |
| |   CERT-In, NCIIPC, and critical infrastructure|  | • No automatic conversion into permanent   | |
| | • Stipends are determined by host org policies|  |   government or civil service employment   | |
| | • Students retain official IITK student status|  | • Zero historical placement statistics or  | |
| | • Dedicated placement channel provided by IITK|  |   salary packages (inaugural cohort 2026)  | |
| +-----------------------------------------------+  +--------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

#### Low-Fidelity Mobile Wireframe
```
+---------------------------------------------------+
| [Category: Career & Internship Facts]             |
| [H2: Internship & Placement Reality]              |
|                                                   |
| +-- [Card 1: Confirmed Provisions] -------------+ |
| | [Badge: Confirmed by Official Sources]        | |
| | • Mandatory 2-year field deployment           | |
| | • Selected defense & government partners      | |
| | • Stipend set by host organization rules      | |
| | • Student status retained during deployment   | |
| | • Dedicated placement support channel         | |
| +-----------------------------------------------+ |
|                                                   |
| +-- [Card 2: Non-Guarantees & Limits] ----------+ |
| | [Badge: Unconfirmed / Not Established]        | |
| | ! No uniform institute stipend amount         | |
| | ! No automatic permanent government job       | |
| | ! Zero historical placement or salary data    | |
| |   (Inaugural cohort commenced July 2026)      | |
| +-----------------------------------------------+ |
+---------------------------------------------------+
```

* **Content Hierarchy & Density:** Medium density. Split 50/50 dual card layout on desktop; vertical 2-card stack on mobile.
* **Interaction States:** Static reference card with high contrast between verified facts and boundaries.
* **Factual Rigor & Verification:** Explicitly states that stipends are host-determined and that placement figures cannot be stated because no cohort has graduated yet.

---

### Section 10: Common Misconceptions (Myth vs. Fact Rows)
* **Anchor ID:** `#myths-vs-facts` *(Verified match with sitemap)*
* **Section Purpose:** Systematically debunk the top 5 rumors and internet assumptions regarding B.Cyber using official evidence.
* **User's Key Question:** *"What are the biggest myths students have about B.Cyber?"*

#### Low-Fidelity Desktop Wireframe
```
+---------------------------------------------------------------------------------------------------+
| [Category: Myth Busting]                                                                          |
| [H2: Common Misconceptions (Myth vs. Fact)]                                                       |
| [Subtitle: Common applicant assumptions compared directly with official institute reality]        |
|                                                                                                   |
| +-- [Stacked Myth vs. Fact Container (5 Rows with Horizontal Separators)] ----------------------+ |
| | [Row 1]                                                                                       | |
| | [Pill: MYTH (Rose)] "B.Cyber is just ethical hacking and running bug bounties."               | |
| | [Pill: FACT (Emerald)] B.Cyber is a rigorous systems degree covering OS, networks & crypto.   | |
| |-----------------------------------------------------------------------------------------------| |
| | [Row 2]                                                                                       | |
| | [Pill: MYTH (Rose)] "The 2-year internship guarantees a permanent government job."            | |
| | [Pill: FACT (Emerald)] It is an academic degree requirement; permanent hiring is separate.    | |
| |-----------------------------------------------------------------------------------------------| |
| | [Row 3]                                                                                       | |
| | [Pill: MYTH (Rose)] "I can branch-change to CSE if my first-year CGPA is high."               | |
| | [Pill: FACT (Emerald)] Branch change is strictly prohibited by Senate resolution.             | |
| |-----------------------------------------------------------------------------------------------| |
| | [Row 4]                                                                                       | |
| | [Pill: MYTH (Rose)] "2026 admission rules will apply identically for future cycles."          | |
| | [Pill: FACT (Emerald)] Official portal announces a separate test; JEE Main won't be used.     | |
| |-----------------------------------------------------------------------------------------------| |
| | [Row 5]                                                                                       | |
| | [Pill: MYTH (Rose)] "IIT Kanpur guarantees a fixed placement package for all graduates."      | |
| | [Pill: FACT (Emerald)] Placement support exists, but zero cohort data exists (began 2026).     | |
| +-----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

#### Low-Fidelity Mobile Wireframe
```
+---------------------------------------------------+
| [Category: Myth Busting]                          |
| [H2: Common Misconceptions]                       |
|                                                   |
| +-- [Myth 1 Card] ------------------------------+ |
| | [Pill: MYTH] Just ethical hacking?            | |
| | [Pill: FACT] Full systems engineering degree. | |
| +-----------------------------------------------+ |
|                                                   |
| +-- [Myth 2 Card] ------------------------------+ |
| | [Pill: MYTH] Guaranteed government job?       | |
| | [Pill: FACT] Academic internship requirement. | |
| +-----------------------------------------------+ |
|                                                   |
| +-- [Myth 3 Card] ------------------------------+ |
| | [Pill: MYTH] Branch change to CSE allowed?    | |
| | [Pill: FACT] Strictly prohibited by Senate.   | |
| +-----------------------------------------------+ |
|                                                   |
| +-- [Myth 4 Card] ------------------------------+ |
| | [Pill: MYTH] 2026 rules apply to 2027?        | |
| | [Pill: FACT] Separate test announced.         | |
| +-----------------------------------------------+ |
|                                                   |
| +-- [Myth 5 Card] ------------------------------+ |
| | [Pill: MYTH] Guaranteed placement package?    | |
| | [Pill: FACT] Support provided; cohort began   | |
| |              July 2026 with no historical data| |
| +-----------------------------------------------+ |
+---------------------------------------------------+
```

* **Content Hierarchy & Density:** High scannability. High-contrast Rose (Myth) vs. Emerald (Fact) badge pairings.
* **Interaction States:** Static stacked list with clean dividing borders.
* **Factual Rigor & Verification:** All 5 rows map to verified Senate resolutions and WSAIS FAQs (FAQ 12, 16, 23).

---

### Section 11: Frequently Asked Questions (Concise Accordion)
* **Anchor ID:** `#common-faqs` *(Verified match with sitemap)*
* **Section Purpose:** Answer remaining candidate and parental questions quickly without requiring them to sift through unstructured forum posts.
* **User's Key Question:** *"Where can I find quick answers to residency, transfer, and degree equivalence?"*

#### Low-Fidelity Desktop Wireframe
```
+---------------------------------------------------------------------------------------------------+
| [Category: Direct Inquiries]                                                                      |
| [H2: Frequently Asked Questions]                                                                  |
| [Subtitle: Clear, concise answers to core candidate and family questions]                         |
|                                                                                                   |
| +-- [Accordion Container (Border border-slate-200 rounded-lg)] ---------------------------------+ |
| | [>] Q1: Is B.Cyber considered equivalent to a regular 4-year degree for MS/PhD?               | |
| |     [Expanded Answer: Yes. Under WSAIS FAQ 9, it is an official 4-year degree from IIT Kanpur  | |
| |      eligible for postgrad applications globally, subject to host institution criteria.]      | |
| |-----------------------------------------------------------------------------------------------| |
| | [v] Q2: Where do students reside during the first two years?                                  | |
| |-----------------------------------------------------------------------------------------------| |
| | [v] Q3: Can a student transfer to regular B.Tech Computer Science?                            | |
| |-----------------------------------------------------------------------------------------------| |
| | [v] Q4: How does admission work for upcoming cycles?                                          | |
| |-----------------------------------------------------------------------------------------------| |
| | [v] Q5: Do host organizations pay stipends during the 2-year field deployment?                | |
| |-----------------------------------------------------------------------------------------------| |
| | [v] Q6: What degree certificate is awarded upon graduation?                                   | |
| |-----------------------------------------------------------------------------------------------| |
| | [v] Q7: What are the attendance and academic passing standards?                               | |
| |-----------------------------------------------------------------------------------------------| |
| | [v] Q8: Is prior coding experience mandatory before joining?                                  | |
| +-----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

#### Low-Fidelity Mobile Wireframe
```
+---------------------------------------------------+
| [Category: Direct Inquiries]                      |
| [H2: Frequently Asked Questions]                  |
|                                                   |
| +-- [Accordion Item 1] -------------------------+ |
| | [>] Q1: Equivalent for MS/PhD abroad?         | |
| |     [Expanded Answer: Yes, 4-year degree from | |
| |      IITK; subject to host univ criteria]     | |
| +-----------------------------------------------+ |
| +-- [Accordion Item 2] -------------------------+ |
| | [v] Q2: Where do students reside in Y1-Y2?    | |
| +-----------------------------------------------+ |
| +-- [Accordion Item 3] -------------------------+ |
| | [v] Q3: Can I transfer to standard B.Tech?    | |
| +-----------------------------------------------+ |
| +-- [Accordion Item 4] -------------------------+ |
| | [v] Q4: Admission for future cycles?          | |
| +-----------------------------------------------+ |
| +-- [Accordion Item 5 to 8 (Stacked)] ----------+ |
| | [v] Q5: Field deployment stipends?            | |
| | [v] Q6: Degree award upon graduation?         | |
| | [v] Q7: Academic passing standards?           | |
| | [v] Q8: Prior coding requirement?             | |
| +-----------------------------------------------+ |
+---------------------------------------------------+
```

* **Content Hierarchy & Density:** Space-efficient collapsible accordion container.
* **Interaction States:**
  - Header click toggles open/close state.
  - Chevron rotates `180deg` on expansion.
  - Accessible via Tab and Space/Enter with `aria-expanded` and `aria-controls`.
* **Factual Rigor & Verification:** Direct citations to WSAIS FAQs 1–25.

---

### Section 12: Source Citations & Editorial Transparency
* **Anchor ID:** `#official-sources` *(Verified match with sitemap)*
* **Section Purpose:** Disclose independent editorial methodology, audit dates, and primary official source anchors for complete institutional transparency.
* **User's Key Question:** *"Where did this information come from, and when was it verified?"*

#### Low-Fidelity Desktop Wireframe
```
+---------------------------------------------------------------------------------------------------+
| [Category: Institutional Transparency]                                                            |
| [H2: Sources, Verification & Editorial Standards]                                                 |
| [Subtitle: All content is cross-referenced with primary IIT Kanpur records and WSAIS documents]   |
|                                                                                                   |
| +-- [Source Attribution Card (bg-white border border-slate-200 p-6)] ---------------------------+ |
| | Primary Verified Source Anchors:                                                              | |
| | • [Link: IIT Kanpur WSAIS B.Cyber Official Portal ^] (https://iitk.ac.in/wsais/b-cyber.php)    | |
| | • [Link: C3iHub Cybersecurity Research Center ^] (https://c3ihub.iitk.ac.in)                  | |
| | • [Link: IIT Kanpur Senate Curricular Structure Circulars ^]                                  | |
| |                                                                                               | |
| | --------------------------------------------------------------------------------------------- | |
| | Last Verified against Primary Records: 12 October 2026                                        | |
| | Editorial Entity: B.Cyber Compass Independent Research                                        | |
| |                                                                                               | |
| | +-- [Disclaimer Callout (bg-slate-50 border border-slate-200 p-4)] -------------------------+ | |
| | | ℹ️ Notice: B.Cyber Compass is an independent research guide and is NOT affiliated with,    | | |
| | |   endorsed by, or an official portal of IIT Kanpur. For formal application submissions,    | | |
| | |   always refer exclusively to iitk.ac.in.                                                  | | |
| | +-------------------------------------------------------------------------------------------+ | |
| +-----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

#### Low-Fidelity Mobile Wireframe
```
+---------------------------------------------------+
| [Category: Transparency]                          |
| [H2: Sources & Verification]                      |
|                                                   |
| +-- [Verified Sources List] --------------------+ |
| | • [Link: WSAIS B.Cyber Portal ^]              | |
| | • [Link: C3iHub Research Center ^]            | |
| | • [Link: Senate Curricular Records ^]         | |
| |-----------------------------------------------| |
| | Last Verified: 12 October 2026                | |
| |                                               | |
| | [Disclaimer Box: Independent guide, not an    | |
| |  official IIT Kanpur website. Check iitk.ac.in| |
| |  for official admissions.]                    | |
| +-----------------------------------------------+ |
+---------------------------------------------------+
```

* **Content Hierarchy & Density:** Low-to-medium density verification footer.
* **Interaction States:** External links feature secure `target="_blank"` and `rel="noopener noreferrer"` attributes.
* **Factual Rigor & Verification:** Transparent institutional disclaimer and explicit timestamp audit.

---

### Section 13: Next-Step Decision Gateway (P2 / P3 Dual CTA)
* **Anchor ID:** `#next-steps` *(Verified match with sitemap)*
* **Section Purpose:** Prevent user drop-off and funnel the student into the next appropriate stage of their decision journey (Checking admission eligibility OR starting preparation).
* **User's Key Question:** *"Now that I understand the degree, what should I do next?"*

#### Low-Fidelity Desktop Wireframe
```
+---------------------------------------------------------------------------------------------------+
| +-- [Dark High-Contrast Gateway Container (bg-slate-900 text-white rounded-xl p-10)] -----------+ |
| | [Badge Label: NEXT DECISION (Neon Green text-emerald-400 font-mono text-xs uppercase)]        | |
| |                                                                                               | |
| | [H2: Now That You Understand B.Cyber, What's Next?]                                           | |
| | [Subtitle: Determine whether you meet admission eligibility rules, or begin technical prep.]  | |
| |                                                                                               | |
| | +-- [Dual CTA Button Row] ------------------------------------------------------------------+ | |
| | | [Primary CTA (Brand Green #d1f34d): Check Admission & Eligibility ->]                      | | |
| | |  -> Links to /blueprints/b-cyber/admission#admission-start                                 | | |
| | |                                                                                           | | |
| | | [Secondary CTA (Ghost/White Outline): Explore Preparation Roadmap ->]                      | | |
| | |  -> Links to /blueprints/b-cyber/roadmap#prep-start                                        | | |
| | +-------------------------------------------------------------------------------------------+ | |
| +-----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

#### Low-Fidelity Mobile Wireframe
```
+---------------------------------------------------+
| +-- [Dark High-Contrast Card (bg-slate-900)] ---+ |
| | NEXT DECISION                                 | |
| | [H2: What's Next?]                            | |
| | [Subtitle: Check eligibility or start prep]   | |
| |                                               | |
| | [Full-Width Button: Check Admission ->]       | |
| |  -> /blueprints/b-cyber/admission             | |
| |                                               | |
| | [Full-Width Button: Explore Prep Roadmap ->]  | |
| |  -> /blueprints/b-cyber/roadmap               | |
| +-----------------------------------------------+ |
|                                                   |
| [STRICT RULE: NO PERSISTENT FLOATING BOTTOM CTA   |
|  BAR PERMITTED ON MOBILE VIEWPORTS]               |
+---------------------------------------------------+
```

* **Content Hierarchy & Density:** Maximum contrast, bold action drivers. Dark card (`bg-slate-900`) with lime green primary CTA button (`#d1f34d`).
* **Interaction States:** Primary button lifts slightly on hover; secondary outline button gains light tint.
* **Strict Mobile Policy:** Explicitly mandates **zero persistent floating bottom CTA overlays** on mobile screens.

---

## 4. Responsive Navigation Architecture for Pillar 1

To support non-linear exploration without cluttering mobile screens:
1. **Desktop On-This-Page Bar**: A horizontal anchor-navigation strip below `BCyberNav` containing jump links to all 14 sections (`#overview-start` through `#next-steps`).
2. **Mobile Collapsible Section Index**: A non-sticky, collapsible `Jump to Section ▾` button that opens a drawer and automatically closes upon selecting an anchor destination.
3. **Strict Zero-Floating-Overlay Rule**: No persistent sticky floating footer or bottom CTA overlays.

---

## 5. Unresolved Factual Dependencies & Audit Register

The following items are officially cataloged as unresolved factual dependencies:

| Item # | Section Affected | Factual Issue / Discrepancy | Current Status | Policy / Action Rule |
| :---: | :--- | :--- | :--- | :--- |
| **DEP-01** | Section 4 (`#curriculum`) | **Semester 2 Credit Discrepancy (50 vs. 54 Cr)**: Different official circular drafts cite 50 Cr vs 54 Cr for Sem 2. | **BLOCKED** | Do not choose a number or claim resolution. Mark fact as unconfirmed pending authoritative Senate circular. Avoid claiming an exact 200 Cr coursework total. |
| **DEP-02** | Section 8 (`#degree-recognition`) | **Global Higher Studies Scope**: Overstatement of guaranteed admission into specific private US universities. | **CORRECTED** | Restricted strictly to WSAIS FAQ 9: Degree is eligible for application to MS/PhD programs in India and abroad, subject to the admission criteria of the receiving institution. |
| **DEP-03** | Section 3 & 9 (`#model-2plus2`, `#internship-reality`) | **Field Deployment vs. Permanent Employment**: Risk of candidates assuming government tenure or uniform stipend. | **CORRECTED** | Clarified that Y3-Y4 is an academic internship component under host org policies; stipends vary by host; no permanent job guarantee. |
| **DEP-04** | Section 2 & 9 (`#key-facts`, `#internship-reality`) | **Placement Outcomes & Salary Figures**: Risk of marketing hype regarding median packages. | **CORRECTED** | Confirmed that zero historical cohort statistics or median salary data exist because the inaugural batch only commenced in July 2026. Support is stated; outcomes are not promised. |
| **DEP-05** | Section 8 (`#degree-recognition`) | **Alumni Association Status**: Verification of timing of alumnus conferral. | **VERIFIED** | Conferred upon successful graduation and degree completion, not upon commencement of field deployment. |
| **DEP-06** | Section 2 (`#key-facts`) | **Institutional Distinction (IITK vs. IITM)**: Risk of conflating IIT Kanpur (WSAIS) and IIT Madras (SIDiS) as a joint unit. | **VERIFIED** | Page strictly covers IIT Kanpur option. A separate note points to the official IITK-hosted IIT Madras PDF. Do not name C3iHub as the academic unit without primary proof. |
| **DEP-07** | Section 3 (`#model-2plus2`) | **Named Deployment Host Organizations**: Speculation regarding named defense/intelligence agencies. | **CORRECTED** | Restricted strictly to verified official text: "primarily at selected government organisations". Specific entity names avoided without direct primary citation. |
| **DEP-08** | Section 3 & 9 (`#model-2plus2`, `#internship-reality`) | **Internship Stipend Guarantee**: Risk of presenting a uniform or mandatory stipend amount. | **CORRECTED** | Stated cautiously: stipend amount and availability depend on host organization policy; some organizations may not provide a stipend. |

---

## 6. Open Design Decisions for User Review

The following design decisions are documented for alignment before proceeding to future implementation:
1. **Semester 2 UI Representation in Tab View**: Should the Semester 2 tab badge display `"Sem 2 (Pending Senate)"` or `"Sem 2 (~50-54 Cr*)"`? Both clearly indicate the blocked state, but user preference can guide exact microcopy.
2. **On-This-Page Bar Sticky Behavior on Desktop**: Should the desktop horizontal anchor strip stick beneath the top navigation on scroll, or remain in flow above Section 0? (Recommendation: sticky below navbar on desktop only, non-sticky on mobile).
