# B.Cyber Compass — Wireframe Specifications
*Version: 2.1 | Status: All Batches (1–4, Sections 0–13) Approved & Locked (14 October 2026)*  
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
| **Fast-Track & Topic Jump Chips** | Subtle border (`border-slate-200`), text `slate-700` | `bg-slate-100`, `border-slate-300`, text `slate-900` | `ring-2 ring-brand-primary ring-offset-2 outline-none` | `bg-slate-200 scale-[0.98]` | `opacity-50 pointer-events-none` |
| **Reflection Checkboxes** | Unchecked box (`border-slate-300 bg-white`) | `border-brand-primary/60` | `ring-2 ring-brand-primary ring-offset-1` | Scale `[0.95]` momentary | `opacity-50 cursor-not-allowed` |
| **Primary Action Buttons**| High-contrast brand green (`bg-[#d1f34d] text-slate-950`) | Subtle brightness lift (`bg-[#c5ea3e]`) | `ring-2 ring-brand-primary ring-offset-2 outline-none` | `scale-[0.98]` | `bg-slate-200 text-slate-400 cursor-not-allowed` |
| **Secondary Buttons & Action Links** | Dark border (`border-slate-700 text-white`) | `bg-white/10 text-white` | `ring-2 ring-white ring-offset-2 outline-none` | `bg-white/20` | `opacity-40 cursor-not-allowed` |

### 2.2 Keyboard Navigation & Focus Flow
- **Sequential Tab Order**: Follows natural DOM hierarchy and approved controls: Global Nav -> Fast-Track Route Jump Chips -> Fit Check Reflection Checkboxes -> In-Page FAQ Topic Jump Chips -> Next-Step Action Buttons / Gateway Links -> External Verification Links -> Footer.
- **In-Page Anchor Jump Operability**: Fast-track and FAQ topic jump chips implement standard in-page anchor links (`<a>` with `href="#..."`); keyboard Enter or Space activates an immediate or smooth jump to the target landmark heading, transferring focus accessibly.
- **Reflection Checklist Operability**: Custom checkbox cards implement native `<input type="checkbox">` or `role="checkbox"` with `tabindex="0"`, toggleable via Spacebar.

### 2.3 Motion & `prefers-reduced-motion` Compliance
When `@media (prefers-reduced-motion: reduce)` is active:
- All CSS transitions and keyframe animations are disabled (`transition-duration: 0.001ms !important; animation-duration: 0.001ms !important;`).
- In-page smooth scrolling (`scroll-behavior: smooth`) drops to instant snap navigation (`scroll-behavior: auto`).
- Dynamic height or opacity transitions switch immediately between states without sliding or fading.
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
  - Only Option 01 is an in-page smooth-scroll anchor (`#quick-answer`). Options 02 and 03 navigate cross-pillar to `/blueprints/b-cyber/admission#admission-start` and `/blueprints/b-cyber/roadmap#prep-start`.
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
│ │ The published predefined-list course carries 9–13 credits, giving a       │ │
│ │ Semester 2 total of 50–54 credits.                                       │ │
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
│ Published elective carries  │
│ 9–13C; Semester 2 total is  │
│ 50–54 credits.              │
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
  - **Duplication Avoidance:** Placement track records and career deployment specifics are addressed in Section 9 (`#internship-reality`), not duplicated here.

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
* **Section Purpose:** Present verified credential facts regarding degree conferral, alumni status, institutional standing, and higher-studies eligibility using official IIT Kanpur WSAIS statements, without unsupported regulatory claims or marketing hype.
* **User's Key Question:** *“What exact degree will I receive, what does IIT Kanpur alumni status mean, and what is officially stated about further studies?”*
* **Official Source Reference:** [IIT Kanpur WSAIS Official Portal & FAQs](https://iitk.ac.in/wsais/b-cyber.php) *(WSAIS Overview, FAQ 9, FAQ 17, and Departmental FAQ records)*.
* **Design Pattern (Auditable Credential Facts Summary):** **Structured Key-Facts Summary List (Primary Credential Summary Card + 4 Attribute-and-Evidence Parameter Rows)**.
  - *Research Reference 1:* GOV.UK Design System — *Summary List Pattern* (`https://design-system.service.gov.uk/components/summary-list/`).
    - *Observation:* Authoritative public records present key-value-evidence rows with distinct typographic separation, ensuring each attribute stands on its own verifiable source rather than running marketing prose.
  - *Research Reference 2:* The Open University — *Qualifications Explained & Credential Summaries* (`https://www.open.ac.uk/courses/do-it/qualifications-explained`).
    - *Observation:* Higher education qualification guides present award titles, awarding bodies, alumni affiliation, and progression routes in neutral, scannable parameter blocks with clear caveats.
  - *Rationale:* Prospective applicants and parents require clear, neutral institutional facts. A key-facts summary list provides auditable clarity by pairing every formal parameter directly with official WSAIS statements, completely separating verified institute facts from downstream admissions conditions.
* **Do Not:** Use over-legalistic jargon or claim unverified verbatim Senate quotations; do not claim identical alumni email, voting, or facility privileges without an authoritative source; do not assert blanket UGC/AICTE or UPSC equivalence without specific regulatory citations; do not claim guaranteed postgraduate admission or cite unverified foreign university partnerships; do not repeat Section 6's curriculum comparison.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
*(Auditable Credential Facts Summary — 4 Verifiable Parameter Rows)*
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Institutional Standing & Credential Summary]                                │
│ DEGREE AWARD, RECOGNITION & HIGHER STUDIES                                   │
│ Official Credential Overview, Alumni Standing & Postgraduate Eligibility     │
│ Official Reference: https://iitk.ac.in/wsais/b-cyber.php (WSAIS Overview & 9)│
│                                                                              │
│ ┌─ 🎓 OFFICIAL CREDENTIAL SUMMARY STATEMENT ───────────────────────────────┐ │
│ │ Official WSAIS statements confirm that students who fulfill all academic │ │
│ │ coursework (Semesters 1–4) and prescribed field deployment requirements  │ │
│ │ (Semesters 5–8) are awarded the Bachelor of Cybersecurity (B.Cyber.)     │ │
│ │ degree by IIT Kanpur. Students who successfully complete the program     │ │
│ │ will receive IIT Kanpur alumni status (WSAIS FAQ 17).                    │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ FOUR AUDITABLE CREDENTIAL PARAMETERS ───────────────────────────────────┐ │
│ │                                                                          │ │
│ │ 01 · FORMAL DEGREE TITLE                                                 │ │
│ │ Parameter:     Degree Awarded Upon Graduation                            │ │
│ │ Official Name: Bachelor of Cybersecurity (B.Cyber.)                      │ │
│ │ Level:         Four-Year Undergraduate Degree Programme                  │ │
│ │ Source Status: Officially Confirmed on WSAIS Portal                      │ │
│ │ Context:       Programme run by the Wadhwani School of AI and            │ │
│ │                Intelligent Systems (WSAIS), IIT Kanpur.                  │ │
│ │                (Distinct degree nomenclature; not titled B.Tech).        │ │
│ │ ──────────────────────────────────────────────────────────────────────── │ │
│ │ 02 · ALUMNI STATUS                                                       │ │
│ │ Parameter:     Institutional Alumni Standing                             │ │
│ │ Official Text: "Students who successfully complete the program will      │ │
│ │                receive IIT Kanpur alumni status." (WSAIS FAQ 17)         │ │
│ │ Source Status: Officially Confirmed on WSAIS Portal (FAQ 17)             │ │
│ │ Context Note:  IIT Kanpur officially confirms alumni status upon         │ │
│ │ (Guide Interp) programme completion. Specific administrative privileges   │ │
│ │                (such as local alumni chapters, library access, or email  │ │
│ │                services) follow standard institute alumni procedures.    │ │
│ │ ──────────────────────────────────────────────────────────────────────── │ │
│ │ 03 · INSTITUTIONAL STANDING                                              │ │
│ │ Parameter:     Degree-Granting Authority                                 │ │
│ │ Awarding Body: Indian Institute of Technology Kanpur                     │ │
│ │ Status:        Institute of National Importance (INI), established       │ │
│ │                under the Institutes of Technology Act (Parliament).      │ │
│ │ Caveat Note:   National public-sector or competitive exam eligibility    │ │
│ │                depends on the specific recruitment criteria of each      │ │
│ │                examining body or notification.                           │ │
│ │ ──────────────────────────────────────────────────────────────────────── │ │
│ │ 04 · HIGHER STUDIES & POSTGRADUATE PROGRESSION                           │ │
│ │ Parameter:     Eligibility to Apply for Master's and Doctoral Programmes │ │
│ │ Official Text: Under official WSAIS FAQ 9, the degree is described as    │ │
│ │                equivalent to a regular four-year IIT Kanpur degree, and  │ │
│ │                graduates are eligible to apply for postgraduate programs │ │
│ │                (such as MS, MTech, PhD) in India and abroad.             │ │
│ │ Essential      Per official WSAIS FAQ 9, graduates can pursue higher     │ │
│ │ Qualification: studies, including applying to postgraduate programmes;   │ │
│ │                admission remains subject to each receiving               │ │
│ │                institution's requirements and selection process.         │ │
│ │ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
*(Vertical Parameter Stack — Zero Horizontal Scroll)*
```
┌─────────────────────────────┐
│ DEGREE AWARD & RECOGNITION  │
│ Credential Facts Summary    │
│ [iitk.ac.in/wsais/b-cyber]  │
│                             │
│ ┌─ OFFICIAL SUMMARY ──────┐ │
│ │ Awarded by IIT Kanpur   │ │
│ │ upon completing academic│ │
│ │ coursework & field reqs.│ │
│ │ Alumni status on        │ │
│ │ completion (FAQ 17).    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ 01 · DEGREE TITLE ─────┐ │
│ │ Bachelor of             │ │
│ │ Cybersecurity (B.Cyber.)│ │
│ │ • 4-Year Undergrad      │ │
│ │ • Programme run by      │ │
│ │   WSAIS, IIT Kanpur     │ │
│ │ • Distinct nomenclature │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ 02 · ALUMNI STATUS ────┐ │
│ │ Official Text (FAQ 17): │ │
│ │ • "Students who         │ │
│ │   successfully complete │ │
│ │   the program will      │ │
│ │   receive IIT Kanpur    │ │
│ │   alumni status."       │ │
│ │ (Guide note: admin terms│ │
│ │ follow institute rules) │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ 03 · INSTITUTION ──────┐ │
│ │ IIT Kanpur (INI)        │ │
│ │ • Institutes of Tech Act│ │
│ │ • Public exam / job     │ │
│ │   rules set by notifying│ │
│ │   bodies individually.  │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ 04 · HIGHER STUDIES ───┐ │
│ │ WSAIS FAQ 9:            │ │
│ │ Equivalent to regular   │ │
│ │ 4-year IITK degree for  │ │
│ │ applying to MS/MTech/PhD│ │
│ │ in India and abroad.    │ │
│ │ ⚠️ Caveat: Admission     │ │
│ │ subject to receiving    │ │
│ │ institution selection   │ │
│ │ process & requirements. │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - Begins with an authoritative summary card highlighting official WSAIS text.
  - Followed by 4 structured, auditable parameter rows: (1) Formal Degree Title, (2) Alumni Status, (3) Institutional Standing, and (4) Higher Studies.
  - Clear visual demarcation between official text, verified institutional parameters, and explanatory qualification caveats.
* **Factual Guardrails & Epistemic Boundaries:**
  - Standardised academic unit description: Programme run by the Wadhwani School of AI and Intelligent Systems (WSAIS), IIT Kanpur.
  - Standardised alumni wording strictly to official WSAIS FAQ 17: *"Students who successfully complete the program will receive IIT Kanpur alumni status."* Removed unsupported claims of identical alumni email, library access, or specific alumni-association privileges.
  - Removed blanket claims of UGC/AICTE or UPSC equivalence; notes that specific public-sector eligibility depends on individual notification criteria.
  - Grounded higher-studies access strictly in WSAIS FAQ 9: graduates can pursue higher studies, including applying to postgraduate programmes; admission remains subject to the receiving institution's requirements and selection process.
* **Accessibility & Interaction:**
  - 100% static, crawlable text with no accordion or tab interaction required.
  - Semantic structure using definition list (`<dl>`, `<dt>`, `<dd>`) or structured section headings (`H3`, `H4`).
  - High-contrast text labels and visible focus rings on official source links.

---

### Section 9: Internship, Stipend & Placement Reality
* **Anchor ID:** `#internship-reality` *(Verified match with sitemap)*
* **Section Purpose:** Present the verified operational facts regarding the two-year academic internship, host organisation stipend terms, and dedicated placement support without manufactured statistics, false salary promises, or misleading career progression arrows.
* **User's Key Question:** *“What happens in Years 3–4, who determines stipend, and what placement outcomes are actually known?”*
* **Official Source Reference:** [IIT Kanpur WSAIS Official Portal & FAQs](https://iitk.ac.in/wsais/b-cyber.php) *(WSAIS Programme Overview, FAQ 13, FAQ 14, and FAQ 16)*.
* **Design Pattern (Three-Area Operational Responsibility Ledger):** **Tripartite Boundary Architecture (Academic Internship Requirement vs Host Organisation & Stipend Terms vs Placement Support & Evidence Status)**.
  - *Layout Classification:* **Editorial & UX design recommendation developed specifically for this guide** (not an imported third-party implementation precedent).
  - *Design Problem Solved:* Standard academic portals often run degree details, stipend notes, and placement expectations into a single continuous narrative, leading applicants to falsely assume that field deployment converts automatically into permanent employment or carries a guaranteed stipend.
  - *Applied Information Architecture Principles:*
    1. *Multi-Stakeholder Boundary Separation:* Isolating the 3 distinct operational domains (IIT Kanpur academic requirements vs. external host organisation conditions vs. separate placement support channels) into visually disconnected containers without shared background wrappers.
    2. *Vector Elimination:* Deliberately omitting connecting lines, arrows, or pipeline chevrons between containers to eliminate any visual implication of an automatic conveyor belt from internship to permanent job.
  - *Rationale:* Presenting three independent boundary cards side-by-side on desktop (and sequentially on mobile) forces cognitive separation between what IIT Kanpur formally awards, what third-party host organisations independently administer, and what placement outcomes are actually known.
* **Do Not:** Claim that B.Cyber students participate alongside students from other IITK departments in general placement drives; do not state or imply guaranteed placement; do not state uniform or guaranteed stipends; do not name unverified partner organisations (e.g. CERT-In, NCIIPC, defense); do not manufacture salary packages or placement rates.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
*(Three-Area Operational Responsibility Ledger — Zero Transitional Progression Arrows)*
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Operational Reality & Career Boundaries]                                    │
│ INTERNSHIP, STIPEND & PLACEMENT REALITY                                      │
│ Clear Separation of Academic Requirements, Organisation Terms & Career Support│
│ Official Reference: https://iitk.ac.in/wsais/b-cyber.php (Overview, 13, 14, 16) │
│                                                                              │
│ ┌─ ⚠️ OFFICIAL WSAIS PLACEMENT & TIMELINE NOTICE ──────────────────────────┐ │
│ │ Official WSAIS FAQ statements emphasize that placement comparisons with  │ │
│ │ other programmes are premature. The first cohort began in July 2026.     │ │
│ │ Completion in 2030 corresponds to the standard four-year programme       │ │
│ │ duration; individual completion timelines may vary. Published B.Cyber    │ │
│ │ graduate placement outcomes are not yet established. No permanent        │ │
│ │ employment is guaranteed.                                                │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ AREA 1: ACADEMIC INTERNSHIP ──┐ ┌─ AREA 2: STIPEND & HOST TERMS ┐ ┌─ AREA 3: PLACEMENT & EVIDENCE ─┐ │
│ │ Mandatory Degree Requirement   │ │ Host Organisation Terms       │ │ Career Support & Market Status │ │
│ │ ────────────────────────────── │ │ ───────────────────────────── │ │ ────────────────────────────── │ │
│ │ • Semesters 5 to 8 (Years 3–4):│ │ • Field Host Sector:          │ │ • Dedicated Placement Channel: │ │
│ │   Consists of four semesters   │ │   The official WSAIS programme│ │   Official FAQ 13 confirms that│ │
│ │   carrying 54 credits each,    │ │   page states that the 2-year │ │   placement support is provided│ │
│ │   totaling 216 academic credits│ │   internship is primarily at  │ │   by inviting relevant cyber-  │ │
│ │   off-campus.                  │ │   selected government         │ │   security organisations.      │ │
│ │ • Integral Part of Degree:     │ │   organisations.              │ │ • Distinct Drives (FAQ 13):    │ │
│ │   The 2-year field internship  │ │ • Host Roster Availability:   │ │   Official FAQ 13 states that  │ │
│ │   is a mandatory component     │ │   The public WSAIS portal does│ │   B.Cyber students do NOT      │ │
│ │   required for degree award.   │ │   not provide a complete named│ │   participate in placements    │ │
│ │ • Continuous Student Status:   │ │   list of participating host  │ │   alongside students from      │ │
│ │   Students retain official     │ │   organisations.              │ │   other IITK departments.      │ │
│ │   enrolled IIT Kanpur student  │ │ • Stipend Provision (FAQ 14): │ │ • No Automatic Conversion:     │ │
│ │   status throughout the entire │ │   Official WSAIS FAQ 14       │ │   Field deployment does NOT    │ │
│ │   four years of the programme. │ │   clarifies that most students│ │   convert automatically into a │ │
│ │                                │ │   are expected to receive     │ │   permanent job at host org.   │ │
│ │                                │ │   stipends, but amounts vary  │ │ • Evidence Status:             │ │
│ │                                │ │   by organisation.            │ │   WSAIS confirms placement     │ │
│ │                                │ │ • Zero-Stipend Possibility:   │ │   comparisons are premature;   │ │
│ │                                │ │   Official FAQ 14 notes some  │ │   published graduate placement │ │
│ │                                │ │   organisations may provide   │ │   outcomes not yet established.│ │
│ │                                │ │   no stipend; IIT Kanpur      │ │                                │ │
│ │                                │ │   states it will try to send  │ │                                │ │
│ │                                │ │   students to organisations   │ │                                │ │
│ │                                │ │   that offer some support.    │ │                                │ │
│ └────────────────────────────────┘ └─────────────────────────────┘ └──────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
*(Sequential Three-Area Stack — Zero Connecting Arrows)*
```
┌─────────────────────────────┐
│ INTERNSHIP & PLACEMENT      │
│ Operational Reality Ledger  │
│ [iitk.ac.in/wsais/b-cyber]  │
│                             │
│ ⚠️ Official WSAIS Notice:   │
│ Placement comparisons are   │
│ premature. First cohort 2026│
│ (2030 standard duration).   │
│ Published graduate placement│
│ outcomes not yet established│
│                             │
│ ┌─ 01 · ACADEMIC INTERN ──┐ │
│ │ Mandatory Degree Unit   │ │
│ │ • Semesters 5–8 (Y3–Y4) │ │
│ │ • 54 Credits per semester│ │
│ │   (216 credits total)   │ │
│ │ • Integral part of degree│ │
│ │ • Continuous IITK student│ │
│ │   status throughout     │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ 02 · STIPEND & HOST ───┐ │
│ │ Host Terms & Allowance  │ │
│ │ • Primarily at selected │ │
│ │   govt organisations    │ │
│ │   (per programme page)  │ │
│ │ • No complete named host│ │
│ │   list is published     │ │
│ │ • Most expected to get  │ │
│ │   stipends; amount vary │ │
│ │ • Some orgs may offer   │ │
│ │   no stipend (FAQ 14)   │ │
│ │ • IITK tries to place at│ │
│ │   orgs offering support │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ 03 · PLACEMENT (FAQ 13)┐ │
│ │ Career Support Status   │ │
│ │ • Relevant cyber orgs   │ │
│ │   invited (FAQ 13)      │ │
│ │ • Does NOT participate  │ │
│ │   alongside other IITK  │ │
│ │   departments (FAQ 13)  │ │
│ │ • NO guaranteed job or  │ │
│ │   permanent hiring      │ │
│ │ • Published graduate    │ │
│ │   outcomes not establ.  │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - Explicit warning banner at the top directly quotes official guidance: placement comparisons are premature.
  - Three distinct, standalone columns/cards: (1) Academic Internship Requirement, (2) Organisation & Stipend Terms, and (3) Placement Support & Evidence Status.
  - No graphical arrows, pipelines, or connecting vectors between columns, ensuring no user infers an automatic conveyor belt to employment.
* **Factual Guardrails & Corrections Applied:**
  - **Host Sector Accuracy:** Preserves the official programme page statement that the two-year internship is primarily at selected government organisations, noting that the public portal does not publish a complete named host roster.
  - **Removed Assessment Claim:** Removed speculative claims regarding faculty grading schedules or evaluation mechanics, retaining the published 54-credit semester allocations (216 credits total).
  - **Major Correction:** Corrected placement description to reflect official WSAIS FAQ 13: placement support is provided by inviting relevant cybersecurity organisations, and students do *not* participate alongside students from other departments.
  - **Stipend Accuracy (FAQ 14):** Accurately reflects official text: most students expected to receive stipends, amounts vary, some may provide no stipend, and IITK tries to place students at organisations offering support.
  - **Timeline Accuracy:** Clarifies that the first cohort began in July 2026; completion in 2030 corresponds to the standard four-year programme duration, with individual timelines varying.
  - **Removed Unsupported Partner Names:** Removed specific named government agencies (CERT-In, NCIIPC, defense) that lack direct official citations.
  - **Epistemic Truth:** Affirms that published B.Cyber graduate placement outcomes are not yet established.
* **Accessibility & Interaction:**
  - High-contrast visual cards with clean border separators.
  - Semantic heading hierarchy: `H3` for Section, `H4` for Areas.
  - Visible by default without interactive toggles or accordions.

---

### Section 10: Common Misconceptions (Claims to Check Before Deciding)
* **Anchor ID:** `#myths-vs-facts` *(Verified match with sitemap)*
* **Batch Status:** Batch 3 — Approved & Locked
* **Section Purpose:** Systematically address applicant assumptions, coaching rumors, and claims needing verification using official WSAIS statements, with clear textual labels independent of color.
* **User's Key Question:** *“What claims about the degree should I verify before deciding?”*
* **Official Source Reference:** [IIT Kanpur WSAIS Official Portal & FAQs](https://iitk.ac.in/wsais/b-cyber.php) *(WSAIS Overview, FAQs 12, 13, 16, 23)*.
* **Design Pattern (Accessible Paired-Assertion Correction Ledger):** **Paired Statement Correction Pattern (Dual-State Rows with Explicit Textual Tags `[CLAIM TO CHECK]` and `[WHAT THE PUBLISHED CURRICULUM SHOWS]` / `[OFFICIAL FACT / REALITY]`, Rule Dividers, and Verifiable Source Pointers)**.
  - *Research Reference 1:* WHO Mythbusters & Fact-Checking Guidelines (`https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters`).
    - *Observation:* Effective misconception correction clearly frames the assumption, immediately presents the factual reality, and cites verifiable evidence.
  - *Research Reference 2:* W3C Web Accessibility Initiative (WAI) — Understanding Success Criterion 1.4.1: *Use of Color* (`https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html`).
    - *Observation:* Colorblind and low-vision users require explicit text prefixes (`[CLAIM TO CHECK]` and `[GROUND TRUTH]`) and typographic styling rather than color-coded containers alone.
  - *Rationale:* Structured, rule-separated paired statements provide high reading speed and scannability, clearly distinguishing official institute facts from explanatory guide interpretations.
* **Do Not:** Rely on color alone to communicate correctness; do not claim a specific Senate resolution for branch change without a public source; do not invent future exam dates, syllabi, or formats; do not present guide interpretations as direct official quotations; do not use gimmicky flip cards.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
*(Accessible Paired Statement Ledger — Text Labels Independent of Color)*
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Evidence-Based Fact Checking]                                               │
│ COMMON MISCONCEPTIONS (CLAIMS TO CHECK)                                      │
│ Claims to Check Before Deciding                                              │
│ Official Reference: https://iitk.ac.in/wsais/b-cyber.php (FAQs 12, 13, 16, 23)│
│                                                                              │
│ ──────────────────────────────────────────────────────────────────────────── │
│ 01 · CURRICULUM BREADTH                                                      │
│ [❌ CLAIM TO CHECK]: "B.Cyber is only ethical hacking/bounties."              │
│ [✅ WHAT THE PUBLISHED CURRICULUM SHOWS]: Systems & Computing Coursework     │
│ Official Curriculum Record: The official WSAIS curriculum table prescribes   │
│ foundational computer systems (Electronics, Operating Systems, Computer      │
│ Organization, Networks), data engineering (Data & Ops), applied              │
│ cryptography, and 5 prescribed 8-credit practical labs across Semesters 1–4. │
│ Guide Interpretation: The coursework reflects foundational computer systems  │
│ and engineering rigour; characterising the degree as merely bug bounty or    │
│ ethical hacking training misrepresents the published syllabus.               │
│ Evidence Pointer: WSAIS Official Curriculum Table (Semesters 1–4)            │
│ ──────────────────────────────────────────────────────────────────────────── │
│ 02 · PERMANENT EMPLOYMENT FROM INTERNSHIP                                    │
│ [❌ CLAIM TO CHECK]: "Field deployment automatically guarantees a job."      │
│ [✅ FACTUAL REALITY]: Academic Degree Unit; Employment Is a Separate Process  │
│ Factual Details: Semesters 5–8 are an academic degree requirement (216       │
│ credits). Guide Interpretation: While providing practical industry exposure, │
│ permanent hiring is not guaranteed and depends entirely on the respective    │
│ host organisation's independent recruitment policies, vacancies, and norms.  │
│ Evidence Pointer: WSAIS Programme Overview & FAQ 16                          │
│ ──────────────────────────────────────────────────────────────────────────── │
│ 03 · BRANCH TRANSFER ELIGIBILITY                                             │
│ [❌ CLAIM TO CHECK]: "High first-year CGPA allows branch change to CSE."     │
│ [✅ OFFICIAL FACT]: Branch Change to Other B.Tech Programmes Is Not Permitted │
│ Factual Details: Official WSAIS FAQ 12 explicitly confirms that students in  │
│ the B.Cyber programme are not permitted to branch-change to other B.Tech     │
│ programmes. B.Cyber is a distinct professional degree with its own track.    │
│ Evidence Pointer: WSAIS Official FAQ 12                                      │
│ ──────────────────────────────────────────────────────────────────────────── │
│ 04 · FUTURE ADMISSION RULES & TESTING                                        │
│ [❌ CLAIM TO CHECK]: "The 2026 JEE Main shortlisting applies to all years."  │
│ [✅ OFFICIAL FACT]: JEE Main Discontinued; Separate Entrance Test Announced   │
│ Factual Details: Official WSAIS FAQ 23 confirms that JEE Main will not be    │
│ used for upcoming cycles and a separate entrance test will be announced.     │
│ Note: The examination syllabus, format, and dates remain unannounced.        │
│ Evidence Pointer: WSAIS Official FAQ 23                                      │
│ ──────────────────────────────────────────────────────────────────────────── │
│ 05 · PLACEMENT PARTICIPATION & SALARY GUARANTEES                             │
│ [❌ CLAIM TO CHECK]: "B.Cyber joins common SPO drives with fixed CTC."       │
│ [✅ OFFICIAL FACT]: Separate Cyber Drives; Placement Comparisons Premature   │
│ Factual Details: Official WSAIS FAQ 13 states that placement support is      │
│ provided by inviting relevant cybersecurity organisations, and students do   │
│ not participate alongside other departments. The portal notes placement      │
│ comparisons are premature; published B.Cyber graduate outcomes are not       │
│ yet established.                                                             │
│ Evidence Pointer: WSAIS Official FAQ 13 & Placement Statement                │
│ ──────────────────────────────────────────────────────────────────────────── │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
*(Vertical Paired Statement Stack — Fully Accessible Without Color)*
```
┌─────────────────────────────┐
│ COMMON MISCONCEPTIONS       │
│ Claims to Check Before      │
│ Deciding                    │
│ [iitk.ac.in/wsais/b-cyber]  │
│ ─────────────────────────── │
│ 01 · CURRICULUM BREADTH     │
│ [❌ CLAIM TO CHECK] Just    │
│ ethical hacking/bounties?   │
│ [✅ CURRICULUM EVIDENCE]    │
│ Published syllabus covers   │
│ OS, Networks, Crypto, Data, │
│ Electronics & 5 core labs.  │
│ (Guide note: systems engg,  │
│ not just hacking).          │
│ ↳ Source: WSAIS Curriculum  │
│ ─────────────────────────── │
│ 02 · PERMANENT EMPLOYMENT   │
│ [❌ CLAIM TO CHECK] Field   │
│ deployment guarantees job?  │
│ [✅ REALITY] Academic degree│
│ requirement (216 credits).  │
│ Hiring is a separate process│
│ ↳ Source: WSAIS FAQ 16      │
│ ─────────────────────────── │
│ 03 · BRANCH TRANSFER        │
│ [❌ CLAIM TO CHECK] Top CGPA│
│ allows transfer to B.Tech?  │
│ [✅ FACT] Branch change to  │
│ other B.Tech is not allowed.│
│ ↳ Source: WSAIS FAQ 12      │
│ ─────────────────────────── │
│ 04 · FUTURE ADMISSIONS      │
│ [❌ CLAIM TO CHECK] 2026 JEE│
│ Main rule applies later?    │
│ [✅ FACT] JEE Main discont- │
│ inued; separate test to be  │
│ announced (FAQ 23).         │
│ ↳ Source: WSAIS FAQ 23      │
│ ─────────────────────────── │
│ 05 · PLACEMENT PARTICIPATION│
│ [❌ CLAIM TO CHECK] Joins   │
│ general SPO with fixed CTC? │
│ [✅ FACT] Separate cyber    │
│ drives (FAQ 13); placement  │
│ comparisons premature;      │
│ outcomes not established.   │
│ ↳ Source: WSAIS FAQ 13      │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - 5 high-impact pairs with prominent horizontal boundary dividers (`border-t border-slate-200`).
  - Textual tags: `[❌ CLAIM TO CHECK]` and `[✅ WHAT THE PUBLISHED CURRICULUM SHOWS]` / `[✅ OFFICIAL FACT / REALITY]` ensure clarity even in grayscale or high-contrast modes without assuming widespread prevalence.
  - Distinguishes direct official facts from the guide's explanatory interpretation.
* **Factual Guardrails & Corrections Applied:**
  - Replaced categorical degree characterisations with `[WHAT THE PUBLISHED CURRICULUM SHOWS]`, distinguishing syllabus records from guide interpretation.
  - Standardised unverified assertions to neutral `[CLAIM TO CHECK]` tags, eliminating unsupported prevalence claims.
  - Subtitle updated to "Claims to Check Before Deciding".
  - Grounded branch change strictly in WSAIS FAQ 12 without citing unlinked Senate resolution numbers.
  - Future admission claims confined strictly to official FAQ 23: JEE Main will not be used, and a separate test will be announced (no speculative formats or dates).
  - Explicitly states that placement support is conducted through dedicated cybersecurity invitations, not alongside other departments (FAQ 13).
  - Notes official portal guidance that placement comparisons are premature and graduate placement outcomes are not yet established.
* **Accessibility & Usability:**
  - Fully accessible without color cues: text prefixes and semantic typography ensure zero ambiguity for colorblind or screen-reader users.
  - Static display: no hidden content or accordion toggles.
  - Clear keyboard focus indicators on all source links.

---

### Section 11: Frequently Asked Questions (Three-Topic In-Page FAQ Matrix)
* **Anchor ID:** `#common-faqs` *(Verified match with sitemap)*
* **Batch Status:** Batch 4 — Approved & Locked
* **Section Purpose:** Deliver fast, authoritative resolution to unresolved candidate and parental inquiries across three distinct thematic clusters, keeping all questions and verified answers visible by default to eliminate forced interaction, scanning friction, and hidden admission caveats.
* **User's Key Question:** *“Where can I quickly find authoritative answers regarding hostel accommodation, coding prerequisites, branch transfer rules, and post-2026 admissions without digging through scattered documents?”*
* **Official Source Reference:** [IIT Kanpur WSAIS Official Portal & FAQs](https://iitk.ac.in/wsais/b-cyber.php) *(WSAIS FAQs 9, 12, 13, 14, 17, 20, 23 & Curriculum Table)*.
* **Design Pattern (Visible Topical FAQ Matrix with Category Anchor Chips):** **Three Thematic Content Groups with In-Page Anchor Jump Chips and Fully Visible Answers by Default**.
  - *Research Reference 1:* GOV.UK Design System — *Guidance on Content and Accordions* (`https://design-system.service.gov.uk/components/accordion/`).
    - *Actual Observed Pattern & Principle:* The GOV.UK Design System explicitly advises against using accordions to split up a series of questions. Hiding answers behind toggle headers forces repeated manual interactions, suppresses in-browser text search (`Ctrl+F`), obscures critical caveats from users scanning quickly, and increases cognitive overhead. The recommended pattern for concise, high-priority informational sets is well-structured visible text organized under clear headings.
    - *Why it fits:* The B.Cyber FAQ consists of eight specific, high-stakes institutional answers. Keeping them fully visible under thematic headings allows prospective students and parents to scan, search, and digest the information immediately without click fatigue.
  - *Research Reference 2:* W3C WAI Web Content Accessibility Guidelines (WCAG) & Nielsen Norman Group — *FAQ Usability & Structure Guidelines* (`https://www.nngroup.com/articles/top-faq-mistakes/`).
    - *Actual Observed Pattern:* Visible Q&A structures grouped into meaningful topical clusters with top-level in-page jump navigation. Headings follow standard semantic hierarchy (`<h2>` for section, `<h3>` for topic group, `<h4>` for individual question). Standard keyboard navigation flows naturally through document order without requiring custom script-managed keyboard handlers.
    - *Why it fits:* Eliminates assistive technology friction, avoids complex ARIA state synchronization, and ensures full accessibility across desktop, tablet, and mobile viewports.
* **Do Not:** Use accordions or collapse toggles to hide these concise answers; do not use placeholders such as "click to reveal"; do not claim prior coding is unconditionally not required (distinguish historical 2026 evaluation from post-2026 unannounced entrance test); do not describe hostel stay as a mandatory residential rule.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
*(Visible Topical FAQ Matrix — 3 Thematic Clusters, All 8 Questions & Answers Fully Displayed)*
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Direct Inquiry Resolution & Category Index]                                 │
│ FREQUENTLY ASKED QUESTIONS                                                   │
│ Verified Answers to Key Candidate & Parental Queries Grouped by Theme        │
│ Official Reference: https://iitk.ac.in/wsais/b-cyber.php                     │
│                                                                              │
│ [Topic Jump Chips]:                                                          │
│ [ ↓ Admissions & Entry (3) ]  [ ↓ Degree & Campus (3) ]  [ ↓ Internship & Placement (2) ] │
│                                                                              │
│ ┌─ TOPIC 1: ADMISSIONS & ENTRY ────────────────────────────────────────────┐ │
│ │                                                                          │ │
│ │ Q1: Is prior coding or computer science experience mandatory?            │ │
│ │ Official Fact:                                                           │ │
│ │ In the inaugural 2026 admission round, shortlisting considered JEE Main  │ │
│ │ scores along with evidence of prior technical projects, software work,   │ │
│ │ or cybersecurity problem-solving. For future admission cycles, WSAIS     │ │
│ │ FAQ 23 confirms a separate entrance test will be conducted, but exact    │ │
│ │ prerequisite knowledge, test format, and syllabus are not yet published. │ │
│ │ In the academic curriculum, Semester 1 starts from foundation levels,    │ │
│ │ including Fundamentals of Computing (14 credits) and Introduction to     │ │
│ │ Electronics (14 credits).                                                │ │
│ │ Source: WSAIS Portal (Curriculum Table & FAQ 23)                         │ │
│ │ ──────────────────────────────────────────────────────────────────────── │ │
│ │ Q2: How will admissions be conducted for cycles after 2026?              │ │
│ │ Official Fact:                                                           │ │
│ │ WSAIS FAQ 23 explicitly confirms that JEE Main will not be used for      │ │
│ │ future admissions, and a separate entrance test will be announced. The   │ │
│ │ exact syllabus, test pattern, conducting body, and dates have not yet    │ │
│ │ been announced by IIT Kanpur.                                            │ │
│ │ Source: WSAIS Portal FAQ 23                                              │ │
│ │ ──────────────────────────────────────────────────────────────────────── │ │
│ │ Q3: Can B.Cyber students branch-change to B.Tech Computer Science?       │ │
│ │ Official Fact:                                                           │ │
│ │ No. Official WSAIS FAQ 12 explicitly confirms that students enrolled in  │ │
│ │ the B.Cyber programme are not permitted to change their branch to any    │ │
│ │ other B.Tech programme at IIT Kanpur.                                    │ │
│ │ Source: WSAIS Portal FAQ 12                                              │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ TOPIC 2: DEGREE & CAMPUS ───────────────────────────────────────────────┐ │
│ │                                                                          │ │
│ │ Q4: What are the accommodation arrangements on the IIT Kanpur campus?    │ │
│ │ Official Fact:                                                           │ │
│ │ Official WSAIS FAQ 20 states that hostel accommodation will be available │ │
│ │ on the IIT Kanpur campus and B.Cyber students will be treated like other │ │
│ │ IIT Kanpur students. (Official guidance does not state that on-campus    │ │
│ │ residence is a mandatory institutional rule).                            │ │
│ │ Source: WSAIS Portal FAQ 20                                              │ │
│ │ ──────────────────────────────────────────────────────────────────────── │ │
│ │ Q5: What exact degree certificate is awarded upon graduation?            │ │
│ │ Official Fact:                                                           │ │
│ │ Graduating students receive a Bachelor of Cybersecurity (B.Cyber.)       │ │
│ │ degree awarded directly by the Indian Institute of Technology Kanpur.    │ │
│ │ The programme is conducted by the Wadhwani School of AI and Intelligent  │ │
│ │ Systems (WSAIS).                                                         │ │
│ │ Source: WSAIS Programme Specifications                                   │ │
│ │ ──────────────────────────────────────────────────────────────────────── │ │
│ │ Q6: Can B.Cyber graduates apply for postgraduate study (MS/MTech/PhD)?   │ │
│ │ Official Fact:                                                           │ │
│ │ Official WSAIS FAQ 9 describes the B.Cyber degree as equivalent to a     │ │
│ │ regular 4-year undergraduate degree from IIT Kanpur and states graduates │ │
│ │ can pursue higher studies, including applying for postgraduate           │ │
│ │ programmes in India and abroad. Admission remains subject to the         │ │
│ │ specific eligibility criteria and selection processes of receiving       │ │
│ │ institutions.                                                            │ │
│ │ Source: WSAIS Portal FAQ 9                                               │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ TOPIC 3: INTERNSHIP & PLACEMENT ────────────────────────────────────────┐ │
│ │                                                                          │ │
│ │ Q7: Are stipends guaranteed during the 2-year field deployment?          │ │
│ │ Official Fact:                                                           │ │
│ │ Official WSAIS FAQ 14 states that most host organisations are expected to│ │
│ │ offer stipends, but amounts vary by organisation policy and some         │ │
│ │ organisations may offer no stipend. IIT Kanpur aims to place students    │ │
│ │ at organisations that provide financial support.                         │ │
│ │ Source: WSAIS Portal FAQ 14                                              │ │
│ │ ──────────────────────────────────────────────────────────────────────── │ │
│ │ Q8: Do B.Cyber students join general IIT Kanpur placement drives?        │ │
│ │ Official Fact:                                                           │ │
│ │ Official WSAIS FAQ 13 confirms that placement assistance is provided by  │ │
│ │ inviting relevant cybersecurity organisations specifically for B.Cyber   │ │
│ │ students; they do not participate in campus placement drives alongside   │ │
│ │ students from other academic departments.                                │ │
│ │ Source: WSAIS Portal FAQ 13                                              │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
*(Vertical Topical Stack — All 8 Q&As Displayed Openly Without Tap Friction)*
```
┌─────────────────────────────┐
│ FREQUENTLY ASKED QUESTIONS  │
│ Categorised Direct Inquiries│
│ [iitk.ac.in/wsais/b-cyber]  │
│                             │
│ Jump: [Entry] [Campus] [Job]│
│                             │
│ ┌─ 1 · ADMISSIONS & ENTRY ┐ │
│ │ Q: Prior coding required?│ │
│ │ In 2026, shortlisting     │ │
│ │ evaluated JEE Main plus   │ │
│ │ project/work evidence.    │ │
│ │ Future entrance test is   │ │
│ │ announced (FAQ 23), but   │ │
│ │ syllabus is awaited. Sem 1│ │
│ │ coursework teaches from   │ │
│ │ foundation levels.        │ │
│ │ [Source: Portal & FAQ 23] │ │
│ │ ───────────────────────── │ │
│ │ Q: Post-2026 admissions?  │ │
│ │ JEE Main discontinued for │ │
│ │ B.Cyber (FAQ 23). Separate│ │
│ │ test to be announced.     │ │
│ │ Pattern/dates not yet out.│ │
│ │ [Source: WSAIS FAQ 23]    │ │
│ │ ───────────────────────── │ │
│ │ Q: Branch change to CS?   │ │
│ │ No. Branch transfer to any│ │
│ │ other B.Tech is not       │ │
│ │ permitted (FAQ 12).       │ │
│ │ [Source: WSAIS FAQ 12]    │ │
│ └───────────────────────────┘ │
│                             │
│ ┌─ 2 · DEGREE & CAMPUS ───┐ │
│ │ Q: Hostel accommodation?  │ │
│ │ Hostel accommodation will │ │
│ │ be available; students are│ │
│ │ treated like other IITK   │ │
│ │ students (FAQ 20). Not    │ │
│ │ stated as mandatory rule. │ │
│ │ [Source: WSAIS FAQ 20]    │ │
│ │ ───────────────────────── │ │
│ │ Q: Degree title awarded?  │ │
│ │ Bachelor of Cybersecurity │ │
│ │ (B.Cyber.) by IIT Kanpur; │ │
│ │ run by WSAIS.             │ │
│ │ [Source: WSAIS Portal]    │ │
│ │ ───────────────────────── │ │
│ │ Q: Higher studies abroad? │ │
│ │ FAQ 9 notes degree is     │ │
│ │ equivalent to regular     │ │
│ │ 4-year IITK degree; can   │ │
│ │ apply for MS/PhD. Subject │ │
│ │ to receiving inst rules.  │ │
│ │ [Source: WSAIS FAQ 9]     │ │
│ └───────────────────────────┘ │
│                             │
│ ┌─ 3 · INTERN & PLACEMENT ┐ │
│ │ Q: Field stipends?        │ │
│ │ Most hosts expected to pay│ │
│ │ stipends; amounts vary and│ │
│ │ some may not pay (FAQ 14).│ │
│ │ [Source: WSAIS FAQ 14]    │ │
│ │ ───────────────────────── │ │
│ │ Q: General placement pool?│ │
│ │ Placement assistance is   │ │
│ │ provided by inviting cyber│ │
│ │ orgs specifically; not    │ │
│ │ alongside other depts     │ │
│ │ (FAQ 13).                 │ │
│ │ [Source: WSAIS FAQ 13]    │ │
│ └───────────────────────────┘ │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - Categorised into 3 logical topic groups:
    1. *Admissions & Entry* (3 items: Prior coding context, Post-2026 entrance status, Branch transfer rule).
    2. *Degree & Campus* (3 items: Campus accommodation availability, Formal degree nomenclature, Higher studies application terms).
    3. *Internship & Placement* (2 items: Field deployment stipend variation, Dedicated cybersecurity recruitment invitations).
  - All questions and answers are presented openly in standard document flow; zero user toggles required.
* **Accessibility & Usability:**
  - Semantic heading hierarchy: Section title `<h2>`, Topic clusters `<h3>`, Questions `<h4>`.
  - In-page jump navigation (`#faq-admissions`, `#faq-campus`, `#faq-internship`) with clear focus rings (`ring-2 ring-brand-primary`).
  - Native browser search (`Ctrl+F` / `Cmd+F`) immediately finds all keywords across all 8 answers without expanding panels.
  - Screen readers read content sequentially with no aria-expanded state confusion.
* **Factual Guardrails:**
  - Prior coding question clarifies the 2026 shortlisting practice (JEE Main + prior work) and highlights that future entrance test details are awaited under FAQ 23, while Semester 1 courses introduce computing from base.
  - Hostel question cites official FAQ 20 (accommodation available; treated like other IITK students) without asserting an unsupported mandatory residency rule.
  - Branch change is strictly prohibited under official FAQ 12.
  - Stipends vary and are not uniform under FAQ 14.
* **Rejected Alternatives:**
  - *Grouped Accordions / Collapsible Details:* Rejected based on GOV.UK Design System guidance; hiding answers behind toggle buttons creates unnecessary click barriers and obscures key caveats for users scanning quickly.
  - *Single Monolithic 12-Item List:* Rejected because lack of thematic categorization causes disorientation.
  - *Interactive Search/Filter Input:* Rejected as over-engineered for an 8-item curated set; introduces client-side script weight without measurable navigational value.

---

### Section 12: Source Citations & Editorial Transparency
* **Anchor ID:** `#official-sources` *(Verified match with sitemap)*
* **Batch Status:** Batch 4 — Approved & Locked
* **Section Purpose:** Establish factual provenance, distinguish historical precedent from future status, eliminate speculative draft discrepancies, and cite specific official URLs and FAQ numbers with transparent source review metadata.
* **User's Key Question:** *“Where did this information originate, which statements are official facts versus editorial interpretations, and when was this review conducted?”*
* **Official Source Reference:** [IIT Kanpur WSAIS Official Portal & FAQs](https://iitk.ac.in/wsais/b-cyber.php) *(WSAIS Official Portal Root, FAQs 1–25, and Official Curriculum Table)*.
* **Design Pattern (Auditable Evidence Ledger & Four-Tier Epistemic Matrix):** **Four-Tier Claim-to-Source Mapping Table with Timestamped Source Review Date and Statutory Independence Notice**.
  - *Research Reference 1:* BBC News — *How BBC News sources and verifies stories* (`https://www.bbc.com/news/help-41670342`).
    - *Actual Observed Pattern:* Uses explicit epistemic labels distinguishing primary verified records from secondary reports and analytical commentary, providing audit provenance rather than anonymous assertions.
    - *Why it fits:* Instills user confidence by providing a transparent methodology for how information is audited and maintained.
  - *Research Reference 2:* Wikimedia Foundation — *Wikipedia Verifiability & Reliable Sources Guidelines* (`https://en.wikipedia.org/wiki/Wikipedia:Verifiability`).
    - *Actual Observed Pattern:* Direct mapping from specific claims to primary authoritative URLs, complete with exact FAQ/table numbers, retrieval dates, and explicit notice of unverified or pending information.
    - *Why it fits:* Gives prospective students and families an auditable verification trail so they can check claims independently on `iitk.ac.in`.
* **Do Not:** Present a bare list of uncontextualized URLs; do not conceal the guide's independent non-official status; do not label all admission information "Confirmed Active" when future cycle details are pending; do not cite internal draft circular discrepancies as unresolved facts when the published curriculum explicitly provides the 50–54 credit range; do not invent an editorial desk title.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
*(Auditable Evidence Ledger — 4 Epistemic Tiers, Source Review Date & Independence Notice)*
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Factual Provenance & Institutional Accountability]                          │
│ SOURCES, VERIFICATION & EDITORIAL TRANSPARENCY                               │
│ Comprehensive Evidence Register, Epistemic Boundaries & Source Review Date   │
│ Primary Institutional Reference: https://iitk.ac.in/wsais/b-cyber.php        │
│                                                                              │
│ ┌─ 🛡️ INDEPENDENT EDITORIAL NOTICE ────────────────────────────────────────┐ │
│ │ B.Cyber Compass is an independent educational research guide published by│ │
│ │ Ayush-Paul Blueprints. It is NOT affiliated with, sponsored by, or an    │ │
│ │ official representative of IIT Kanpur or WSAIS. All formal admissions   │ │
│ │ decisions and statutory regulations are governed exclusively by IITK.   │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ FOUR-TIER CLAIM-TO-SOURCE EVIDENCE REGISTER ────────────────────────────┐ │
│ │                                                                          │ │
│ │ TIER 1 · PRIMARY OFFICIAL INSTITUTIONAL SOURCES (Published Facts)        │ │
│ │ • Degree Award & Unit: Bachelor of Cybersecurity (B.Cyber) by IIT Kanpur;│ │
│ │   conducted by WSAIS. [WSAIS Programme Specification]                    │ │
│ │ • Coursework Curriculum: Sem 1 (51 Cr), Sem 2 (50–54 Cr: predefined-list │ │
│ │   course carries 9–13 Cr), Sem 3 (50 Cr), Sem 4 (46 Cr). Coursework total│ │
│ │   range: 197–201 Cr across Sem 1–4. [WSAIS Curriculum Table]             │ │
│ │ • 2+2 Model & Field Internship: 2 years campus + 2 years field deployment│ │
│ │   carrying 216 credits in Sem 5–8. [WSAIS Academic Model]                │ │
│ │ • Alumni Status: Awarded upon graduation. [WSAIS FAQ 17]                 │ │
│ │ • Branch Transfer: Transfer to other B.Tech barred. [WSAIS FAQ 12]       │ │
│ │ • Hostel Accommodation: Available on campus; treated as IITK students    │ │
│ │   (not described as mandatory residential rule). [WSAIS FAQ 20]          │ │
│ │ • Higher Studies: Can pursue higher studies / apply for MS/PhD. [FAQ 9]  │ │
│ │ • Placement Assistance: Dedicated cyber org invitations. [WSAIS FAQ 13]  │ │
│ │ • Field Stipends: Vary by host organisation; some may offer none. [FAQ 14]│ │
│ │ URL: [https://iitk.ac.in/wsais/b-cyber.php ^]                            │ │
│ │ Status: Verified against published portal.                               │ │
│ │ ──────────────────────────────────────────────────────────────────────── │ │
│ │ TIER 2 · HISTORICAL ADMISSIONS RECORD (Archived 2026 Intake)             │ │
│ │ • Published 2026 Timeline: Application opening: 15 June 2026;            │ │
│ │   Application deadline: 25 June 2026; Admission test: 5 July 2026;       │ │
│ │   Results: 8 July 2026; Campus reporting: 21 July 2026.                  │ │
│ │ • 2026 Evaluation: Shortlisting based on JEE Main scores and prior       │ │
│ │   technical work / project evidence.                                     │ │
│ │ • Institutional Status: Concluded July 2026. Official portal currently   │ │
│ │   displays these past dates; they serve as historical record, not        │ │
│ │   future-cycle rules.                                                    │ │
│ │ Status: Archived Historical Precedent · Not Active for Future Cycles     │ │
│ │ ──────────────────────────────────────────────────────────────────────── │ │
│ │ TIER 3 · EDITORIAL GUIDE INTERPRETATION (Independent Analytical Models)  │ │
│ │ • Scope: "Beyond Hacking" 5-domain framework, candidate fit              │ │
│ │   self-reflection questions, and Conventional CSE vs B.Cyber trade-offs. │ │
│ │ • Origin: B.Cyber Compass independent pedagogical analysis.              │ │
│ │ Status: Guide Interpretation · Not an official institute policy or quote.│ │
│ │ ──────────────────────────────────────────────────────────────────────── │ │
│ │ TIER 4 · GENUINE UNKNOWNS & PENDING ANNOUNCEMENTS (Unverified Boundaries)│ │
│ │ • Item A: Post-2026 Separate Entrance Test: FAQ 23 confirms JEE Main is  │ │
│ │   discontinued and a separate test will be announced. Exact syllabus,    │ │
│ │   format, conducting agency, and dates are officially NOT YET PUBLISHED. │ │
│ │ • Item B: Complete Named Host Roster: Official text specifies deployment │ │
│ │   "primarily at selected government organisations"; specific named entity│ │
│ │   roster is NOT PUBLISHED / NOT VERIFIED.                                │ │
│ │ Public Status: Officially Pending Notification · Do Not Rely on Rumors   │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ Source review date: 14 October 2026 · Links verified on iitk.ac.in/wsais     │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
*(Vertical Evidence Stack — Clear Epistemic Demarcation)*
```
┌─────────────────────────────┐
│ SOURCES & TRANSPARENCY      │
│ Auditable Evidence Register │
│ [iitk.ac.in/wsais/b-cyber]  │
│                             │
│ ┌─ INDEPENDENT NOTICE ────┐ │
│ │ Independent guide. Not  │ │
│ │ affiliated with or an   │ │
│ │ official site of IITK.  │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ TIER 1 · PUBLISHED ────┐ │
│ │ • WSAIS Official Portal │ │
│ │   [iitk.ac.in/wsais/...]│ │
│ │ • Verifies: Curriculum  │ │
│ │   (Sem 1: 51, Sem 2:    │ │
│ │   50–54 with 9–13 Cr    │ │
│ │   elective, Sem 3: 50,  │ │
│ │   Sem 4: 46; Coursework:│ │
│ │   197–201; Y3–Y4: 216)  │ │
│ │ • FAQs 9, 12–14, 17,    │ │
│ │   20, 23                │ │
│ │ • Status: Published Fact│ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ TIER 2 · 2026 ARCHIVE ─┐ │
│ │ • 2026 Timeline (Past): │ │
│ │   Open: 15 Jun 2026     │ │
│ │   Close: 25 Jun 2026    │ │
│ │   Test: 5 Jul 2026      │ │
│ │   Results: 8 Jul 2026   │ │
│ │   Report: 21 Jul 2026   │ │
│ │ • Evaluated: JEE Main   │ │
│ │   + project evidence.   │ │
│ │ • Status: Historical    │ │
│ │   precedent only.       │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ TIER 3 · GUIDE INTERP ─┐ │
│ │ • 5 Technical Domains   │ │
│ │ • Fit check & trade-offs│ │
│ │ • Status: Pedagogical   │ │
│ │   independent analysis. │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ TIER 4 · PENDING ──────┐ │
│ │ ⏳ Post-2026 exam format│ │
│ │   & syllabus (FAQ 23)   │ │
│ │ ⏳ Named host list      │ │
│ │ • Status: Not published │ │
│ └─────────────────────────┘ │
│                             │
│ Source review date:         │
│ 14 October 2026             │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - Prominent Independence Notice explicitly discloses the non-affiliated educational research role of the guide.
  - Clear separation between Tier 1 (Published Official Facts), Tier 2 (Archived 2026 Admissions Precedent), Tier 3 (Guide Interpretation), and Tier 4 (Genuine Unknowns & Pending Announcements).
  - Explicitly documents the published Semester 2 range of 50–54 credits (with 9–13 credit elective course) without speculating on internal draft circulars.
  - Transparent date stamp: "Source review date: 14 October 2026", avoiding fabricated editorial desk monikers.
* **Security & Interaction States:**
  - Official links use `target="_blank" rel="noopener noreferrer"` with visual external indicators (`^`).
  - High-contrast accessible focus outlines: `ring-2 ring-brand-primary ring-offset-2`.

---

### Section 13: Next-Step Decision Gateway (P2 / P3 Dual Pathway)
* **Anchor ID:** `#next-steps` *(Verified match with sitemap)*
* **Batch Status:** Batch 4 — Approved & Locked
* **Section Purpose:** Guide visitors from foundational degree orientation (Pillar 1) into their next practical destination, presenting balanced, intent-led routing between admission criteria analysis (Pillar 2) and technical preparation planning (Pillar 3) without bias, false promises, or fabricated time estimates.
* **User's Key Question:** *“Now that I understand the degree structure, what should I do next based on my current timeline and preparation stage?”*
* **Official Source Reference:** [IIT Kanpur WSAIS Official Portal & FAQs](https://iitk.ac.in/wsais/b-cyber.php).
* **Canonical Link Destinations (Mandatory Everywhere):**
  - Admission & Eligibility: `/blueprints/b-cyber/admission#admission-start`
  - Preparation Roadmap: `/blueprints/b-cyber/roadmap#prep-start`
* **Design Pattern (Balanced Intent-Driven Pathway Cards):** **Dual Balanced Navigation Gateway (Two Equal-Weight Cards with Intent Descriptions and High-Contrast Action Links; Zero Sticky Mobile Overlays)**.
  - *Design Recommendation (Ayush-Paul Blueprints Information Architecture):* **Neutral Two-Route Intent Gateway**.
    - *Observed Pattern & Principle:* Provides balanced, neutral user routing when a guide branches into distinct user journeys. Explicitly presents options based on candidate intent (evaluating admission eligibility vs. beginning technical self-study) rather than directing or biasing users toward a single preferred conversion path.
    - *Why it fits:* Respects user autonomy. Applicants seeking admissions and entrance examination clarity navigate directly to Pillar 2, while students ready for structured technical self-study proceed directly to Pillar 3 without artificial barriers, forced prerequisites, or diagnostic gatekeeping.
  - *Research Reference 2:* W3C WAI Web Content Accessibility Guidelines (WCAG) 2.4.4 & 2.4.9 — *Link Purpose (In Context and Link Only)* (`https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html`).
    - *Actual Observed Pattern:* Action links explicitly articulate their destination and task in the link text itself (e.g. "Review admission and eligibility information" and "Explore the cybersecurity preparation roadmap"), ensuring screen-reader users and keyboard navigators understand exactly where the navigation leads without ambiguity.
    - *(Note on Dropped Attribution: NHS Action Link citation was dropped per user instruction, as NHS guidance states Action Links are not intended simply for links to another page or site).*
* **Do Not:** Make unapproved feature promises (no "guaranteed eligibility screener", "entrance-exam tracker", or "four-stage diagnostic path"); do not invent time estimates ("3–5 min / 8–10 min"); do not instruct users to always check eligibility before preparation; do not use sticky floating overlays on mobile.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
*(Balanced Dual Decision Gateway — Two Side-by-Side Equal Cards)*
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Next Step · Choose Your Pathway]                                            │
│ WHERE WOULD YOU LIKE TO GO NEXT?                                             │
│ Select the section aligned with your immediate objective and timeline        │
│                                                                              │
│ ┌─ PATHWAY A · ADMISSION & ELIGIBILITY ───┐ ┌─ PATHWAY B · PREPARATION ROADMAP ──┐ │
│ │ [BLUEPRINT PILLAR 2]                    │ │ [BLUEPRINT PILLAR 3]                │ │
│ │ Admission Criteria & Testing Status     │ │ Foundational Preparation Roadmap   │ │
│ │ ─────────────────────────────────────── │ │ ────────────────────────────────── │ │
│ │ Best for:                               │ │ Best for:                          │ │
│ │ Candidates reviewing 2026 precedent     │ │ Candidates and students seeking a  │ │
│ │ shortlisting criteria, qualifying score │ │ structured self-study roadmap in   │ │
│ │ benchmarks, and official announcements  │ │ Linux, Python, networking, and     │ │
│ │ regarding future entrance examinations. │ │ cybersecurity fundamentals.        │ │
│ │                                         │ │                                    │ │
│ │ Scope:                                  │ │ Scope:                             │ │
│ │ • 2026 shortlisting precedent review    │ │ • Foundational systems & networks  │ │
│ │ • Academic eligibility & branch rules   │ │ • Programming & scripting basics   │ │
│ │ • Status of post-2026 entrance test     │ │ • Security concepts & lab practices│ │
│ │                                         │ │                                    │ │
│ │ [Review admission and eligibility       │ │ [Explore the cybersecurity         │ │
│ │  information →]                         │ │  preparation roadmap →]            │ │
│ │ (High-Contrast Button)                  │ │ (High-Contrast Button)             │ │
│ │ Links to:                               │ │ Links to:                          │ │
│ │ /blueprints/b-cyber/admission           │ │ /blueprints/b-cyber/roadmap        │ │
│ │ #admission-start                        │ │ #prep-start                        │ │
│ └─────────────────────────────────────────┘ └────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
*(Vertical Stacked Gateway — Balanced Neutral Routing, Zero Floating Overlays)*
```
┌─────────────────────────────┐
│ WHERE WOULD YOU LIKE TO GO? │
│ Choose Your Pathway         │
│                             │
│ ┌─ PATHWAY A · ADMISSION ─┐ │
│ │ [BLUEPRINT PILLAR 2]    │ │
│ │ Admission & Eligibility │ │
│ │ • Review 2026 precedent │ │
│ │   criteria & scores     │ │
│ │ • Check branch rules    │ │
│ │ • Status of future test │ │
│ │                         │ │
│ │ [ Review admission and  │ │
│ │   eligibility info → ]  │ │
│ │ Links to:               │ │
│ │ /blueprints/b-cyber/    │ │
│ │ admission#admission-start│
│ └─────────────────────────┘ │
│                             │
│ ┌─ PATHWAY B · ROADMAP ───┐ │
│ │ [BLUEPRINT PILLAR 3]    │ │
│ │ Preparation Roadmap     │ │
│ │ • Self-study roadmap in │ │
│ │   Linux & networking    │ │
│ │ • Python & scripting    │ │
│ │ • Core security concepts│ │
│ │                         │ │
│ │ [ Explore the           │ │
│ │   preparation roadmap →]│ │
│ │ Links to:               │ │
│ │ /blueprints/b-cyber/    │ │
│ │ roadmap#prep-start      │ │
│ └─────────────────────────┘ │
│                             │
│ ⚠️ STRICT ARCHITECTURAL RULE:│
│ No persistent sticky bottom │
│ CTA bar on mobile screens.  │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - Neutral, intent-led framing: both options have equal visual balance and neutral styling.
  - Canonical destinations verified: `/blueprints/b-cyber/admission#admission-start` and `/blueprints/b-cyber/roadmap#prep-start`.
  - Descriptive link texts match user intent: "Review admission and eligibility information" and "Explore the cybersecurity preparation roadmap".
  - Feature lists reflect confirmed scope without unsupported diagnostic/screener claims or artificial time estimates.
* **Mobile Behaviour & Viewport Protection:**
  - Stacked vertical layout with tap targets exceeding the 48px minimum height.
  - Zero persistent sticky overlays, adhering strictly to the mobile viewport hygiene standard.
* **Accessibility:**
  - Link purpose is fully articulated in the link label itself (WCAG 2.4.4 / 2.4.9).
  - Clear `:focus-visible` styling (`ring-2 ring-brand-primary ring-offset-2`).

---

## 4. Responsive Navigation Architecture for Pillar 1

To support non-linear exploration without cluttering mobile screens:
1. **Desktop On-This-Page Bar**: A horizontal anchor-navigation strip below `BCyberNav` containing jump links to all 14 sections (`#overview-start` through `#next-steps`).
2. **Mobile Collapsible Section Index**: A non-sticky, collapsible `Jump to Section ▾` button that opens a drawer and automatically closes upon selecting an anchor destination.
3. **Strict Zero-Floating-Overlay Rule**: No persistent sticky floating footer or bottom CTA overlays.

---

## 5. Unresolved Factual Dependencies & Audit Register

The following items are officially cataloged as factual dependencies and epistemic boundaries:

| Item # | Section Affected | Factual Issue / Discrepancy | Current Status | Policy / Action Rule |
| :---: | :--- | :--- | :--- | :--- |
| **DEP-01** | Section 4 (`#curriculum`) | **Semester 2 Credit Range (50–54 Cr)**: Predefined-list course carries 9–13 credits, yielding an officially published Semester 2 total of 50–54 credits and coursework total range of 197–201 credits across Sem 1–4 (51 + 50–54 + 50 + 46). | **PUBLISHED RANGE** | Preserved published 50–54 Cr range and 197–201 Cr total coursework range without speculating on unpublished draft circulars. |
| **DEP-02** | Section 8 (`#degree-recognition`) | **Global Higher Studies Scope**: Overstatement of guaranteed admission into specific private US universities. | **CORRECTED** | Restricted strictly to WSAIS FAQ 9: Degree is eligible for application to MS/PhD programs in India and abroad, subject to the admission criteria of the receiving institution. |
| **DEP-03** | Section 3 & 9 (`#model-2plus2`, `#internship-reality`) | **Field Deployment vs. Permanent Employment**: Risk of candidates assuming government tenure or uniform stipend. | **CORRECTED** | Clarified that Y3-Y4 is an academic internship component under host org policies; stipends vary by host; no permanent job guarantee. |
| **DEP-04** | Section 2 & 9 (`#key-facts`, `#internship-reality`) | **Placement Outcomes & Salary Figures**: Risk of marketing hype regarding median packages. | **CORRECTED** | Confirmed that zero historical cohort statistics or median salary data exist because the inaugural batch only commenced in July 2026. Support is stated; outcomes are not promised. |
| **DEP-05** | Section 8 (`#degree-recognition`) | **Alumni Association Status**: Verification of timing of alumnus conferral. | **VERIFIED** | Conferred upon successful graduation and degree completion, not upon commencement of field deployment. |
| **DEP-06** | Section 2 (`#key-facts`) | **Institutional Distinction (IITK vs. IITM)**: Risk of conflating IIT Kanpur (WSAIS) and IIT Madras (SIDiS) as a joint unit. | **VERIFIED** | Page strictly covers IIT Kanpur option. A separate note points to the official IITK-hosted IIT Madras PDF. Do not name C3iHub as the academic unit without primary proof. |
| **DEP-07** | Section 3 (`#model-2plus2`) | **Named Deployment Host Organizations**: Speculation regarding named defense/intelligence agencies. | **CORRECTED** | Restricted strictly to verified official text: "primarily at selected government organisations". Specific entity names avoided without direct primary citation. |
| **DEP-08** | Section 3 & 9 (`#model-2plus2`, `#internship-reality`) | **Internship Stipend Guarantee**: Risk of presenting a uniform or mandatory stipend amount. | **CORRECTED** | Stated cautiously: stipend amount and availability depend on host organization policy; some organizations may not provide a stipend. |
| **DEP-09** | Section 10, 11, 12 (`#myths-vs-facts`, `#common-faqs`, `#official-sources`) | **Post-2026 Separate Entrance Test Details**: Exact syllabus, format, testing agency, and dates remain unannounced under FAQ 23. | **BLOCKED** | Do not invent or assume exam structure; state clearly that a separate test will be announced and keep details blocked pending official notification. |

---

## 6. Open Design Decisions for User Review

The following design decisions are documented for alignment before proceeding to future implementation:
1. **Semester 2 Credit Range Display**: Display the officially published Semester 2 range as `50–54 Cr` (reflecting the 9–13 credit elective) in the Year 1 curriculum list, with total coursework indicated as `197–201 Cr`.
2. **On-This-Page Bar Sticky Behavior on Desktop**: Should the desktop horizontal anchor strip stick beneath the top navigation on scroll, or remain in flow above Section 0? (Recommendation: sticky below navbar on desktop only, non-sticky on mobile).
