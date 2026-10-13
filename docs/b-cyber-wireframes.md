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
* **Section Purpose:** Present on-campus academic progression from Semester 1 to Semester 4 with verified course names, laboratory units, and credit distributions without overwhelming the visitor with an undifferentiated 24-course list.
* **User's Key Question:** *“What exact subjects and practical labs will I study semester-by-semester, and how does the curriculum build up?”*
* **Design Pattern:** **Chronological Semester Progression Selector (Tabs on Desktop, Segmented Stepper on Mobile)** based on *GOV.UK Tabs* and *MIT EECS Curriculum Maps*. Avoids a monolithic wall of text while keeping essential semester data visible without nested accordions.
* **Do Not:** Dump all 24 courses in one continuous unformatted table; do not hide core courses inside individual click-to-expand accordions; do not pick 50 or 54 credits without noting the discrepancy.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ CURRICULUM & SUBJECTS (SEMESTERS 1 TO 4)                                     │
│ On-Campus Academic & Laboratory Foundations at IIT Kanpur                    │
│                                                                              │
│ [Sem 1 (51 Cr)]*   [Sem 2 (50–54 Cr ⚠️)]   [Sem 3 (50 Cr)]   [Sem 4 (48 Cr)] │
│ ──────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│ ┌─ ACTIVE SEMESTER PANEL: SEMESTER 2 ──────────────────────────────────────┐ │
│ │ Cryptographic Foundations, Data Structures & Forensics                   │ │
│ │ Total Credits: 50–54 Credits* (Campus Residential Phase)                 │ │
│ │                                                                          │ │
│ │ ⚠️ OFFICIAL CREDIT NOTE (UNRESOLVED DISCREPANCY):                         │ │
│ │ The official WSAIS curriculum table lists one elective from a predefined │ │
│ │ list as 9–13 credits, yielding 50–54 credits for Semester 2. Senate      │ │
│ │ circular drafts cite 50 Cr vs 54 Cr. This figure is marked as            │ │
│ │ unconfirmed pending authoritative Senate circular clarification.         │ │
│ │                                                                          │ │
│ │ Core Subjects & Laboratory Practicals:                                   │ │
│ │ • Applied Cryptography                  │ 9 Cr  │ Core Theory            │ │
│ │ • Data Structures and Algorithms (DSA)  │ 12 Cr │ Core Computing         │ │
│ │ • Computer Organization                 │ 12 Cr │ Hardware / Systems     │ │
│ │ • Course from Predefined List           │ 9–13C │ Elective (Math/Comp)   │ │
│ │                                                                          │ │
│ │ ┌─ 🔬 CORE LABORATORY HIGHLIGHT ───────────────────────────────────────┐ │ │
│ │ │ Lab: Digital Forensics (8 Credits)                                   │ │ │
│ │ │ Hands-on disk imaging, memory dump triage, file carvers, and         │ │ │
│ │ │ chain-of-custody evidence handling in dedicated campus forensics lab.│ │ │
│ │ └──────────────────────────────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ────────────────────── 5 DEDICATED HANDS-ON CYBER LABS ───────────────────── │
│ Sem 1: Malware Analysis Lab (8C)        │ Sem 3: Cloud Computing & Sec (8C)  │
│ Sem 2: Digital Forensics Lab (8C)       │ Sem 3: VAPT Laboratory (8C)        │
│ Sem 4: Network & Web App Security Lab (8C)                                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ CURRICULUM & SUBJECTS       │
│ Semesters 1 to 4            │
│                             │
│ [Segmented Semester Switch] │
│ [S1: 51C] [S2: 50-54C*]     │
│ [S3: 50C] [S4: 48C]         │
│                             │
│ ┌─ SEMESTER 2 PANEL ──────┐ │
│ │ Cryptography & Forensics│ │
│ │ Total: 50–54 Credits*   │ │
│ │                         │ │
│ │ ⚠️ Credit Discrepancy:   │ │
│ │ Elective lists 9–13 Cr; │ │
│ │ total 50–54 Cr pending  │ │
│ │ Senate clarification.   │ │
│ │                         │ │
│ │ Applied Cryptography    │ │
│ │ 9 Credits · Core Theory │ │
│ │ ─────────────────────── │ │
│ │ Data Structures (DSA)   │ │
│ │ 12 Credits · Computing  │ │
│ │ ─────────────────────── │ │
│ │ Computer Organization   │ │
│ │ 12 Credits · Hardware   │ │
│ │ ─────────────────────── │ │
│ │ Predefined Elective     │ │
│ │ 9–13 Credits · Elective │ │
│ │                         │ │
│ │ 🔬 LAB HIGHLIGHT:       │ │
│ │ Digital Forensics Lab   │ │
│ │ 8 Credits · Hands-on    │ │
│ │ Disk imaging & memory   │ │
│ │ triage in campus lab.   │ │
│ └─────────────────────────┘ │
│                             │
│ ── 5 DEDICATED CYBER LABS ──│
│ S1: Malware Analysis (8C)   │
│ S2: Digital Forensics (8C)  │
│ S3: Cloud Security (8C)     │
│ S3: VAPT Lab (8C)           │
│ S4: Network & Web Sec (8C)  │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - Desktop displays horizontal semester selector tabs (`role="tablist"`). Active tab displays a solid dark background with high-contrast text; inactive tabs use clean neutral borders.
  - Mobile uses a 2x2 segmented button grid (or horizontal scroll with full-width snap) with minimum 48px tap height.
  - The 5 core laboratories are visually anchored with distinct border styling (`border-l-4 border-brand-primary`) to reinforce the degree's intensive practical commitment.
  - Individual course items display: Subject Title, Credit Weight, and Academic Category (Core Theory, Systems, Lab, Elective).
* **Factual Guardrails & Credit Discrepancy:**
  - **Semester 2 Conflict:** The discrepancy banner is colocated directly in the Semester 2 panel: *"The official WSAIS curriculum table lists one elective from a predefined list as 9–13 credits, yielding 50–54 credits for Semester 2. Senate circular drafts cite 50 Cr vs 54 Cr. This figure is marked as unconfirmed pending authoritative Senate circular clarification."*
  - Coursework total avoids asserting "200 credits" as an exact sum; accurately notes Semesters 5–8 as 54 credits each (216 credits).
* **Interaction & Accessibility:**
  - Full keyboard accessibility: Arrow keys navigate between semester tabs; Space/Enter activates the panel.
  - WAI-ARIA tab semantics (`role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`).
  - Screen reader receives semester title and credit total before reading individual course entries.

---

### Section 5: Beyond Hacking: What Cybersecurity Actually Covers
* **Anchor ID:** `#beyond-hacking` *(Verified match with sitemap)*
* **Section Purpose:** Broaden applicant perception from the popular trope of "ethical hacking/bug bounties" to full-spectrum systems engineering based on the *NIST NICE Cybersecurity Workforce Framework* and *ACM/IEEE-CS CS2023*.
* **User's Key Question:** *“Is B.Cyber just ethical hacking and CTFs, or does it cover broader computer science and systems engineering?”*
* **Design Pattern:** **Domain Decomposition Specification Sheet (5 Structured Technical Rows)** instead of 5 interchangeable marketing cards. Maps technical domains directly to curriculum anchors and contrasts pop-culture assumptions with engineering reality.
* **Do Not:** Use 5 identical rounded promo cards with generic stock icons; do not invent separate academic degree tracks or claims that every domain has an independent diploma.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ BEYOND HACKING: WHAT CYBERSECURITY ACTUALLY COVERS                           │
│ Systems Engineering, Mathematical Security & Defensive Operations           │
│                                                                              │
│ Cybersecurity is an engineering discipline requiring deep operating system   │
│ mastery, protocol analysis, and algorithmic rigor—not running scripts.       │
│                                                                              │
│ ┌─ 01 · SYSTEMS & OPERATING SYSTEM INTERNALS ──────────────────────────────┐ │
│ │ Engineering Reality: C programming, memory allocation, kernel bypass,     │ │
│ │                      stack frame inspection, and hardware architecture.   │ │
│ │ Curriculum Anchor:   Sem 1 (Fundamentals of Computing) & Sem 3 (OS).     │ │
│ │ Reality vs Trope:    Pop trope: "Running automated vulnerability tools"   │ │
│ │                      Engineering truth: Understanding kernel memory bugs. │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌─ 02 · NETWORKS, PROTOCOLS & TRAFFIC ANALYSIS ────────────────────────────┐ │
│ │ Engineering Reality: TCP/IP stack internals, packet dissection, routing   │ │
│ │                      security, DNS infrastructure, and TLS handshakes.    │ │
│ │ Curriculum Anchor:   Sem 4 (Computer Networks & Network Security Lab).    │ │
│ │ Reality vs Trope:    Pop trope: "WiFi password cracking"                  │ │
│ │                      Engineering truth: Deep packet routing & protocol TLS│ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌─ 03 · APPLIED CRYPTOGRAPHY & ALGORITHMIC SECURITY ───────────────────────┐ │
│ │ Engineering Reality: Mathematical foundations, modular arithmetic, RSA,  │ │
│ │                      elliptic curves, symmetric ciphers & hash functions. │ │
│ │ Curriculum Anchor:   Sem 2 (Applied Cryptography & DSA).                  │ │
│ │ Reality vs Trope:    Pop trope: "Cracking passwords with wordlists"       │ │
│ │                      Engineering truth: Mathematical cipher construction. │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌─ 04 · DEFENSIVE FORENSICS, REVERSE ENGINEERING & VAPT ───────────────────┐ │
│ │ Engineering Reality: Malware static/dynamic triage, memory forensics,    │ │
│ │                      binary decompilation, and disciplined penetration.   │ │
│ │ Curriculum Anchor:   Sem 1 Malware Lab, Sem 2 Forensics, Sem 3 VAPT.      │ │
│ │ Reality vs Trope:    Pop trope: "Defacing websites"                       │ │
│ │                      Engineering truth: Incident reconstruction & triage. │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌─ 05 · HUMAN COGNITION, GOVERNANCE & SECURITY ETHICS ─────────────────────┐ │
│ │ Engineering Reality: Cognitive psychology, social engineering vector     │ │
│ │                      analysis, cyber policy, and responsible disclosure.  │ │
│ │ Curriculum Anchor:   Sem 1 (Practical Ethics) & Sem 4 (Psychology).       │ │
│ │ Reality vs Trope:    Pop trope: "Anonymous hacker persona"                │ │
│ │                      Engineering truth: Organizational policy & cognition.│ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ BEYOND HACKING              │
│ Full-Spectrum Engineering   │
│                             │
│ ┌─ 01 · SYSTEMS & OS ─────┐ │
│ │ Reality: C, memory,     │ │
│ │ kernel architecture.    │ │
│ │ Course: Sem 1 & Sem 3   │ │
│ │ Trope: "Running tools"  │ │
│ │ Truth: Kernel memory.   │ │
│ └─────────────────────────┘ │
│ ┌─ 02 · NETWORKS & PROTO ─┐ │
│ │ Reality: TCP/IP, packet │ │
│ │ dissection, routing.    │ │
│ │ Course: Sem 4 Networks  │ │
│ │ Trope: "WiFi cracking"  │ │
│ │ Truth: Protocol flow.   │ │
│ └─────────────────────────┘ │
│ ┌─ 03 · CRYPTOGRAPHY ─────┐ │
│ │ Reality: Math, modular  │ │
│ │ ciphers, RSA/ECC, DSA.  │ │
│ │ Course: Sem 2 Crypto    │ │
│ │ Trope: "Wordlist brute" │ │
│ │ Truth: Math foundations.│ │
│ └─────────────────────────┘ │
│ ┌─ 04 · FORENSICS & VAPT ─┐ │
│ │ Reality: Malware triage,│ │
│ │ memory dumps, carvers.  │ │
│ │ Course: S1-S3 3 Labs    │ │
│ │ Trope: "Defacing sites" │ │
│ │ Truth: Incident triage. │ │
│ └─────────────────────────┘ │
│ ┌─ 05 · HUMAN FACTORS ────┐ │
│ │ Reality: Psychology &   │ │
│ │ responsible disclosure. │ │
│ │ Course: S1 & S4 Ethics  │ │
│ │ Trope: "Anonymous hype" │ │
│ │ Truth: Cognitive bias.  │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - 5 structured horizontal specification rows on desktop; vertically stacked clean cards on mobile.
  - Replaces marketing fluff with 3 verifiable attributes per domain: **Engineering Reality**, **Curriculum Anchor**, and **Popular Trope vs Truth**.
  - Distinct numbering index (`01` to `05`) aids screen-reader landmark navigation.
* **Factual Guardrails:**
  - Connects strictly to subjects published in the WSAIS syllabus (Fundamentals of Computing, DSA, Computer Organization, OS, Networks, Applied Crypto, Ethics, Psychology, and the 5 labs).
  - Does NOT invent unverified research centers or unannounced specialized honors tracks.

---

### Section 6: Balanced Degree Comparison (B.Cyber vs Conventional B.Tech CSE)
* **Anchor ID:** `#degree-comparison` *(Verified match with sitemap)*
* **Section Purpose:** Provide an objective, balanced side-by-side comparison between B.Cyber and standard B.Tech Computer Science across consistent dimensions, without portraying either degree as universally superior.
* **User's Key Question:** *“How does B.Cyber differ from a conventional B.Tech Computer Science degree, and what are the objective trade-offs?”*
* **Design Pattern:** **Structured Attribute Comparison Matrix (3-Column Desktop Table, Dimension Cards on Mobile)** based on *GOV.UK Summary Card* guidance. Avoids frustrating mobile horizontal scrolling while preserving exact dimensional parity.
* **Do Not:** Use a wide unresponsive table that forces horizontal scroll on mobile; do not make unverified claims about placement salaries, corporate prestige, or employer preference.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ BALANCED DEGREE COMPARISON                                                   │
│ Objective Structural Differences: B.Cyber vs Conventional B.Tech CSE         │
│                                                                              │
│ Neither degree is universally better; they serve distinctly different goals. │
│                                                                              │
│ Dimension (22%)         │ IIT Kanpur B.Cyber (39%)* │ Conventional CSE (39%) │
│ ────────────────────────┼───────────────────────────┼────────────────────────│
│ Primary Specialization  │ Focused from Year 1 on    │ Broad computing:       │
│ Focus                   │ low-level systems, cyber  │ algorithms, software   │
│                         │ defense & OS architecture │ engineering, AI/ML     │
│ ────────────────────────┼───────────────────────────┼────────────────────────│
│ Structural Learning     │ 2 Years On-Campus Study + │ 4 Years Residential    │
│ Format                  │ 2 Years Field Deployment  │ Campus Study at IIT    │
│ ────────────────────────┼───────────────────────────┼────────────────────────│
│ Laboratory Practicals   │ 5 Dedicated Cyber Labs    │ General CS Labs +      │
│                         │ (Forensics, Malware, VAPT)│ Department Electives   │
│ ────────────────────────┼───────────────────────────┼────────────────────────│
│ Branch Change           │ Strictly PROHIBITED by    │ Available subject to   │
│ Permissibility          │ Senate resolution         │ 1st-year CGPA cutoffs  │
│ ────────────────────────┼───────────────────────────┼────────────────────────│
│ Postgraduate Parity     │ Eligible to apply for     │ Standard eligibility   │
│ (MS / M.Tech / Ph.D.)   │ MS/PhD globally (FAQ 9)*  │ across all institutes  │
│ ────────────────────────┼───────────────────────────┼────────────────────────│
│ Historical Placement    │ Zero cohort track record  │ Decades of established │
│ Data                    │ (Inaugural batch July '26)│ placement records      │
│                                                                              │
│ [*B.Cyber column highlighted with subtle border: border-brand-primary/40]    │
│ [*Note: Foreign university admission depends on receiving institution criteria]│
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
*(Non-Table, Responsive Dimension Stack — Strictly No Horizontal Scroll)*
```
┌─────────────────────────────┐
│ DEGREE COMPARISON           │
│ B.Cyber vs Standard CSE     │
│                             │
│ ┌─ SPECIALIZATION FOCUS ──┐ │
│ │ B.Cyber (IIT Kanpur):   │ │
│ │ Systems, OS & cyber     │ │
│ │ defense from Year 1.    │ │
│ │ ─────────────────────── │ │
│ │ Standard B.Tech CSE:    │ │
│ │ Broad CS, algorithms,   │ │
│ │ software eng, AI/ML.    │ │
│ └─────────────────────────┘ │
│ ┌─ LEARNING STRUCTURE ────┐ │
│ │ B.Cyber (IIT Kanpur):   │ │
│ │ 2 Yrs Campus + 2 Yrs    │ │
│ │ Field Deployment.       │ │
│ │ ─────────────────────── │ │
│ │ Standard B.Tech CSE:    │ │
│ │ 4 Yrs On-Campus study.  │ │
│ └─────────────────────────┘ │
│ ┌─ BRANCH CHANGE RULE ────┐ │
│ │ B.Cyber (IIT Kanpur):   │ │
│ │ Strictly PROHIBITED.    │ │
│ │ ─────────────────────── │ │
│ │ Standard B.Tech CSE:    │ │
│ │ Permitted via CGPA.     │ │
│ └─────────────────────────┘ │
│ ┌─ POSTGRADUATE PARITY ───┐ │
│ │ B.Cyber (IIT Kanpur):   │ │
│ │ Eligible (FAQ 9; univ   │ │
│ │ criteria apply).        │ │
│ │ ─────────────────────── │ │
│ │ Standard B.Tech CSE:    │ │
│ │ Standard eligibility.   │ │
│ └─────────────────────────┘ │
│ ┌─ HISTORICAL PLACEMENTS ─┐ │
│ │ B.Cyber (IIT Kanpur):   │ │
│ │ Zero historical data;   │ │
│ │ inaugural batch 2026.   │ │
│ │ ─────────────────────── │ │
│ │ Standard B.Tech CSE:    │ │
│ │ Decades of data.        │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - Desktop uses a high-contrast 3-column comparative table with semantic `th` scopes.
  - Mobile completely reflows into **Dimension Cards** (Attribute Stack). Each card directly contrasts B.Cyber vs Conventional CSE for one parameter. **Zero horizontal table scrolling required**.
  - Language is neutral and factual: acknowledges that CSE has decades of placement history while B.Cyber has zero historical cohort statistics; highlights that branch change is completely barred for B.Cyber.
* **Factual Guardrails:**
  - Does NOT invent hypothetical starting salary packages, placement percentages, or recruiting company claims.
  - Explicit note on postgraduate study: eligibility is governed by receiving university criteria (WSAIS FAQ 9).

---

### Section 7: Is B.Cyber Right for You? (Fit Check & Reflection)
* **Anchor ID:** `#fit-check` *(Verified match with sitemap)*
* **Section Purpose:** Help prospective applicants self-reflect on their genuine interests, expectations, and personal readiness without acting as a gatekeeping admission test or generating misleading diagnostic scores.
* **User's Key Question:** *“Am I personally and temperamentally suited for this degree, or should I consider a conventional path?”*
* **Design Pattern:** **Dual Fit Criteria Guide + 3-Prompt Contextual Self-Reflection Tool** based on *NHS Self-Assessment Decision Aids* and *W3C WAI ARIA Checkbox Pattern*. Checked items surface descriptive context rather than a deceptive numerical "fit percentage."
* **Do Not:** Produce a gamified "Score: 85% Fit" meter; do not tell candidates they are guaranteed admission; do not make checkmarks unreadable on assistive technology.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ IS B.CYBER RIGHT FOR YOU?                                                    │
│ Honest Reflection Criteria & Personal Fit Evaluation                         │
│                                                                              │
│ B.Cyber requires a specific temperament: patience for debugging systems,     │
│ comfort with two years away on field deployment, and zero branch change.     │
│                                                                              │
│ ┌───────────────────────────────┐   ┌──────────────────────────────────────┐ │
│ │ A STRONG FIT TO CONSIDER IF:  │   │ THINK CAREFULLY / MAY NOT FIT IF:    │ │
│ │                               │   │                                      │ │
│ │ • You are fascinated by OS    │   │ • You are only chasing the "IIT tag" │ │
│ │   internals, C, and protocols │   │   prestige for family status         │ │
│ │ • You enjoy deep debugging    │   │ • You primarily want to build        │ │
│ │   and solving complex bugs    │   │   consumer web/mobile applications   │ │
│ │ • You are excited by practical│   │ • You expect guaranteed immediate    │ │
│ │   field deployment in Y3–Y4   │   │   high starting salaries             │ │
│ │ • You have a disciplined,     │   │ • You plan to branch-change to CSE   │ │
│ │   ethical defensive mindset   │   │   after Year 1 (strictly barred)     │ │
│ └───────────────────────────────┘   └──────────────────────────────────────┘ │
│                                                                              │
│ ┌─ 3-PROMPT PERSONAL REFLECTION CHECKLIST (NOT AN ADMISSION TEST) ─────────┐ │
│ │ Select any statements that reflect your current situation:               │ │
│ │                                                                          │ │
│ │ [ ] Prompt 1: I am comfortable spending Years 3 and 4 away from campus   │ │
│ │               on full-time practical deployment at a host organization.  │ │
│ │     ↳ Context: 216 credits occur off-campus under host organisation      │ │
│ │                rules. This is an academic internship, not campus life.   │ │
│ │                                                                          │ │
│ │ [ ] Prompt 2: I am genuinely curious about low-level computing (C, Linux,│ │
│ │               assembly, protocols), not just high-level application dev. │ │
│ │     ↳ Context: Semesters 1–4 focus heavily on operating systems, hardware│ │
│ │                organization, and mathematical cryptography.              │ │
│ │                                                                          │ │
│ │ [ ] Prompt 3: I understand admission evaluates prior technical work and   │ │
│ │               hackathon practical problem-solving.                       │ │
│ │     ↳ Context: Future cycles require practical problem-solving; admission│ │
│ │                is not based on standard JEE Main percentiles alone.      │ │
│ │                                                                          │ │
│ │ ℹ️ Reflection Note: These prompts help you evaluate programmatic fit.     │ │
│ │   They do not calculate admission eligibility or predict exam outcomes.  │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ IS B.CYBER RIGHT FOR YOU?   │
│ Personal Fit & Reflection   │
│                             │
│ ┌─ STRONG FIT IF... ──────┐ │
│ │ • Fascinated by OS & C  │ │
│ │ • Patient problem solver│ │
│ │ • Excited for Y3-Y4     │ │
│ │   field deployment      │ │
│ │ • Ethical mindset       │ │
│ └─────────────────────────┘ │
│ ┌─ THINK CAREFULLY IF... ─┐ │
│ │ • Only chasing IIT tag  │ │
│ │ • Want consumer app dev │ │
│ │ • Expect salary promises│ │
│ │ • Hoping for branch chg │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ 3-PROMPT REFLECTION ───┐ │
│ │ (Personal self-check)   │ │
│ │                         │ │
│ │ [ ] 1. Comfortable with │ │
│ │        2-yr deployment? │ │
│ │   Context: Y3-Y4 is off-│ │
│ │   campus internship.    │ │
│ │ ─────────────────────── │ │
│ │ [ ] 2. Curious about low│ │
│ │        level systems/C? │ │
│ │   Context: Deep OS and  │ │
│ │   crypto foundations.   │ │
│ │ ─────────────────────── │ │
│ │ [ ] 3. Understand prior │ │
│ │        work evaluation? │ │
│ │   Context: Practical    │ │
│ │   hackathon admission.  │ │
│ │                         │ │
│ │ ℹ️ Personal reflection   │ │
│ │   aid; not an admission │ │
│ │   score or predictor.   │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

* **Content Hierarchy & Layout Notes:**
  - Top: High-contrast 2-column Fit Guide (Strong Fit vs Think Carefully) providing clear criteria before interaction.
  - Bottom: 3-Prompt Reflection Module. Each item includes a checkbox, a primary self-statement, and inline contextual commentary explaining what checking that statement means in practice.
* **Interaction & Accessibility:**
  - Implements accessible custom checkboxes (`role="checkbox"`, `aria-checked="true|false"`, `tabindex="0"`).
  - Toggled with `Space` or `Enter`.
  - Visible focus indicators (`ring-2 ring-brand-primary ring-offset-2`).
  - Checking items does NOT calculate a deceptive percentage score. It dynamically highlights the relevant context explanations.
* **Factual Guardrails:**
  - Re-emphasizes the strict ban on branch change (WSAIS FAQ 12).
  - Clearly identifies that the tool is an informative personal self-check, NOT an admission predictor or psychometric score.

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
