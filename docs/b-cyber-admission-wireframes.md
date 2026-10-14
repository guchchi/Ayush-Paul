# B.Cyber Compass — Pillar 2: Admission & Eligibility Wireframe Specifications
*Version: 1.0 | Status: Draft Wireframe for Review (14 October 2026)*  
*Platform: Ayush-Paul Blueprints Ecosystem*  
*Scope: Pillar 2 — Admission & Eligibility (`/blueprints/b-cyber/admission`)*  
*Architectural Alignment: Fully synced with `docs/b-cyber-sitemap-and-ux-blueprint.md` (Pillar 2: 12 Locked Sections)*

---

## 1. Document Purpose & Architectural Governance

This document defines the structural, low-fidelity wireframe specifications, content hierarchy, and interaction mechanics for **Pillar 2: Admission & Eligibility (`/blueprints/b-cyber/admission`)**.

### Core Governance Constraints
1. **Low-Fidelity & Structural**: Communicates layout hierarchy, data density, component grouping, and responsive stacking without decorative bloat. Simple text layouts, ASCII wireframe blocks, tables, lists, and decision flows.
2. **Distinct Desktop & Mobile Layouts**: Provides explicit ASCII wireframes for both desktop (≥ 1024 px) and mobile (< 768 px) for every section.
3. **Strict Zero Mobile Sticky Overlay Policy**: Strictly no persistent bottom CTA bar or sticky floating overlay on mobile viewports.
4. **Epistemic Rigor & Source Grounding**: Every claim is mapped to official IIT Kanpur Senate records, WSAIS publications, or explicit historical precedent.
5. **Standardized 5-Part Status Taxonomy**:
   - `[Officially confirmed for the selected cycle]`
   - `[Officially announced for a future cycle]`
   - `[Previously published or observed in an earlier cycle]`
   - `[Not yet officially confirmed]` *(or `VERIFY BEFORE PUBLICATION`)*
   - `[Guide recommendation, not an official requirement]`
6. **Independence Disclosure**: The site is an independent editorial guide and is not affiliated with or endorsed by IIT Kanpur.

---

## 2. Global Navigation & Interaction Standards

### 2.1 Navigation Model
- **Primary Global Navigation**: Uses the shared `BCyberNav` component with Pillar 2 marked active (`/blueprints/b-cyber/admission`).
- **No Heavy Extra Sticky Strips**: Page flows cleanly in editorial order. In-page fast-track anchors (#eligibility-check, #selection-process, #official-sources) allow instantaneous wayfinding without intrusive horizontal sticky toolbars.

### 2.2 Screener Interaction Logic (Section 3)
- Multi-step compact diagnostic questionnaire (PCM background, DOB, nationality, prior IIT admission).
- Zero registration, email collection, or authentication gatekeeping.
- 5 mutually exclusive, accessible result states with deep links to Section 4 rules.
- Strict non-negotiable rule: **Zero admission chances, percentiles, or fake predictive probability algorithms**.

---

## 3. Section-by-Section Wireframe Specifications (Sections 0–11)

---

### Section 0: Hero — Admission & Eligibility
* **Anchor ID:** `#admission-start`
* **Section Purpose:** Establish page scope, declare editorial independence, highlight the active admission cycle context, and provide instant wayfinding for diverse applicant intents.
* **Applicant Key Question:** *“How does admission work, what is confirmed for my cycle, and where should I begin?”*
* **Design Pattern:** Editorial hero header with cycle-context badge and 2 direct entry actions.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Independent guide · Not official IIT Kanpur website]                        │
│                                                                              │
│ How Admission to IIT Kanpur B.Cyber Works:                                   │
│ Eligibility, 2026 Precedent & The 2027 Shift                                 │
│                                                                              │
│ An evidence-grounded decision guide to academic criteria, selection stages,  │
│ practical hackathon evaluations, and cycle-specific requirements.            │
│                                                                              │
│ Current Context: Upcoming Cycle (2027 Planning) · JEE Main Discontinued      │
│                                                                              │
│ [ Check My Admission Readiness ↓ ]        [ Understand Selection Process → ] │
│   (#eligibility-check)                      (#selection-process)             │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ [Independent guide]         │
│                             │
│ How Admission to            │
│ IIT Kanpur B.Cyber Works    │
│                             │
│ Eligibility, 2026 Precedent │
│ & The 2027 Shift            │
│                             │
│ Cycle: Upcoming 2027        │
│ JEE Main Discontinued       │
│                             │
│ ┌─────────────────────────┐ │
│ │ Check Admission Readin. │ │ (Primary CTA -> #eligibility-check)
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ View Selection Process  │ │ (Secondary Link -> #selection-process)
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

* **Content Hierarchy:**
  1. Plain-text disclosure: `Independent guide · Based on official IIT Kanpur WSAIS records`.
  2. H1 Heading: *How Admission to IIT Kanpur B.Cyber Works: Eligibility, 2026 Precedent & The 2027 Shift*.
  3. Concise descriptive lead paragraph.
  4. Active cycle status indicator tag.
  5. Primary CTA (`Check My Admission Readiness` -> smooth-scrolls to `#eligibility-check`) and Secondary Action (`Understand Selection Process` -> smooth-scrolls to `#selection-process`).
* **Mobile Behavior:** Full-width buttons stacked vertically with minimum 44 px tap targets. Zero floating overlays.

---

### Section 1: Admission in 30 Seconds
* **Anchor ID:** `#admission-summary`
* **Section Purpose:** Deliver an instant, crawlable summary of the admission mechanism for fast scanning and AI search engines (AEO/GEO).
* **Applicant Key Question:** *“What is the short version of how someone gets selected?”*
* **Design Pattern:** Clean editorial callout box with a high-level 3-stage visual pathway and official portal citation.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ DIRECT ANSWER · ADMISSION AT A GLANCE                                        │
│ The 30-Second Summary                                                        │
│                                                                              │
│ Admission to IIT Kanpur B.Cyber requires Class 12 PCM qualification, Indian │
│ nationality, and qualifying through a multi-stage entrance process. While    │
│ 2026 shortlisted via JEE Main and prior technical evidence for an in-person │
│ 6-hour hackathon, official WSAIS FAQ 23 confirms that JEE Main is            │
│ permanently discontinued for future intakes, with a separate entrance test   │
│ to be conducted by IIT Kanpur.                                               │
│                                                                              │
│ HIGH-LEVEL STAGES:                                                           │
│ [ 01: Academic Eligibility ] ──▶ [ 02: Entrance Screening ] ──▶ [ 03: Practical Hackathon ]
│   Class 12 PCM (5 subjects)       Dedicated Test (2027)           6h Test at IIT Kanpur
│                                                                              │
│ Official source: IIT Kanpur WSAIS Admission Portal ↗                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ DIRECT ANSWER               │
│ The 30-Second Summary       │
│                             │
│ B.Cyber admission requires  │
│ Class 12 PCM, Indian        │
│ nationality, and passing a  │
│ multi-stage selection. JEE  │
│ Main is discontinued for    │
│ future cycles (FAQ 23); a   │
│ dedicated test will occur.  │
│                             │
│ 1. Academic Eligibility     │
│    Class 12 PCM (5 subj)    │
│         │                   │
│         ▼                   │
│ 2. Entrance Screening       │
│    Dedicated Test (2027)    │
│         │                   │
│         ▼                   │
│ 3. Practical Hackathon      │
│    6h at IIT Kanpur         │
│                             │
│ Official WSAIS Portal ↗     │
└─────────────────────────────┘
```

* **Content & Governance Rules:**
  - Explicitly states that JEE Main is discontinued for future cycles per WSAIS FAQ 23.
  - Summarizes the 3-stage sequence without inventing unannounced exam details.
  - Link directly to `https://iitk.ac.in/wsais/b-cyber.php`.

---

### Section 2: Admission Cycle Status Board
* **Anchor ID:** `#cycle-status`
* **Section Purpose:** Prevent student confusion between past 2026 admission rules and pending 2027 procedures through a structured comparative status board.
* **Applicant Key Question:** *“What rules are already locked for 2027, and what is still unannounced?”*
* **Design Pattern:** 2-tab or dual-card cycle switcher with clear status taxonomy tags.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ CYCLE STATUS BOARD                                                           │
│ Confirmed Announcements vs. Historical Precedents                            │
│                                                                              │
│ [ Active View: Upcoming Cycle (2027) ]   [ Switch to 2026 Historical View ]  │
│                                                                              │
│ PARAMETER             STATUS (UPCOMING 2027 CYCLE)          OFFICIAL CITATION│
│ ──────────────────────────────────────────────────────────────────────────── │
│ Entrance Screening    Officially Announced: Separate Test   WSAIS FAQ 23     │
│                       (JEE Main permanently discontinued)                    │
│ ──────────────────────────────────────────────────────────────────────────── │
│ Syllabus & Test Mode  Not Yet Officially Confirmed          IITK Senate      │
│                       (CBT vs. paper details pending)       Pending          │
│ ──────────────────────────────────────────────────────────────────────────── │
│ Practical Hackathon   Observed Precedent: Expected Retained 2026 Launch      │
│                       (6-hour in-person evaluation)         Record           │
│ ──────────────────────────────────────────────────────────────────────────── │
│ Prior Work Weight     Officially Confirmed: Required        WSAIS FAQ 22     │
│                       (Verifiable technical portfolio)                       │
│ ──────────────────────────────────────────────────────────────────────────── │
│ Age Cutoff Date       Not Yet Officially Confirmed          Pending Official │
│                       (2026 was Oct 1, 2001; 2027 TBA)      Notification     │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ CYCLE STATUS BOARD          │
│ Confirmed vs Precedent      │
│                             │
│ [2027 Upcoming] [2026 Past] │
│                             │
│ • Entrance Screening        │
│   Separate test announced;  │
│   JEE Main discontinued.    │
│   Status: [Announced]       │
│   Source: FAQ 23            │
│ ─────────────────────────── │
│ • Syllabus & Test Mode      │
│   Format & syllabus pending.│
│   Status: [Not Yet Confirmed│
│ ─────────────────────────── │
│ • Practical Hackathon       │
│   6h in-person test at IITK.│
│   Status: [Past Precedent]  │
│ ─────────────────────────── │
│ • Prior Work Evidence       │
│   Verifiable proof needed.  │
│   Status: [Confirmed]       │
│   Source: FAQ 22            │
└─────────────────────────────┘
```

* **Status Taxonomy Enforcement:** Every row carries an explicit badge from the 5-part taxonomy.
* **Uncertainty Protection:** Unannounced items are explicitly marked `Not yet officially confirmed` (no manufactured dates).

---

### Section 3: Interactive Cycle-Aware Eligibility Screener
* **Anchor ID:** `#eligibility-check`
* **Section Purpose:** Provide an honest, multi-step self-assessment tool evaluating applicant baseline criteria without data capture or false admission promises.
* **Applicant Key Question:** *“Do I meet the published baseline requirements to apply?”*
* **Design Pattern:** Step-by-step form (4 questions) with immediate diagnostic outcome mapping to 5 defined result states.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ELIGIBILITY SELF-SCREENER                                                    │
│ Check Your Eligibility Baseline Against Published Senate Rules               │
│                                                                              │
│ Step 1 of 4: Academic Background                                             │
│ Did you pass (or are appearing for) Class 12 with Physics, Chemistry, and    │
│ Mathematics across at least 5 subjects?                                      │
│   ( ) Yes, PCM with 5+ subjects (including NIOS)                             │
│   ( ) Only took JEE Main Paper 2 / Missing Class 12 Math                     │
│   ( ) Non-PCM background                                                     │
│                                                                              │
│ [ < Back ]                                                  [ Next Step > ]  │
│                                                                              │
│ ──────────────────────────────────────────────────────────────────────────── │
│ [SAMPLE RESULT STATE: RESULT A — MEETS PUBLISHED BASELINE]                   │
│                                                                              │
│ ✓ You meet the documented baseline qualifications for B.Cyber.               │
│ • Academic qualification: Class 12 PCM (5 subjects) satisfied.               │
│ • Indian nationality confirmed.                                              │
│ • Attempt and prior IIT admission conditions clear.                          │
│                                                                              │
│ Next Action: Review the detailed selection process and evidence standards.   │
│ [ View the supporting official rule → ] (#eligibility-rules)                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ ELIGIBILITY SCREENER        │
│ Step 1 of 4: Academics      │
│                             │
│ Class 12 PCM with 5 subj?   │
│ ( ) Yes (PCM 5+ subj/NIOS)  │
│ ( ) Missing Math / Paper 2  │
│ ( ) Non-PCM background      │
│                             │
│ [ Next Step > ]             │
│                             │
│ ── RESULT PREVIEW ───────── │
│ ✓ Baseline Met              │
│ You meet the published      │
│ criteria based on your      │
│ answers.                    │
│                             │
│ [ View Supporting Rule → ]  │
│ (#eligibility-rules)        │
└─────────────────────────────┘
```

* **The 5 Defined Result States:**
  1. **Result A (Meets Published Baseline):** All conditions met based on published baseline. Links to `#eligibility-rules`.
  2. **Result B (Published Condition Unmet):** Identifies specific disqualifying rule (e.g. non-PCM, past JoSAA 2025 admission, third attempt).
  3. **Result C (Future-Cycle Rules Unconfirmed):** Informs user that 2027-specific cutoffs (e.g., exact DOB threshold) are pending Senate announcement.
  4. **Result D (Insufficient Information):** Prompts user to answer skipped questions.
  5. **Result E (Rules Require Review):** Used when candidate edge cases (e.g., international board equivalence) require direct WSAIS clarification.
* **Strict Boundary:** No admission percentage chances, no ranking calculations, no lead-generation forms.

---

### Section 4: Eligibility Rules Explained
* **Anchor ID:** `#eligibility-rules`
* **Section Purpose:** Exhaustive, transparent explanation of every documented eligibility regulation, statutory reservation, and candidate restriction.
* **Applicant Key Question:** *“What are the exact legal rules, age limits, and exceptions?”*
* **Design Pattern:** Categorized rule cards with anchor jump targets from Section 3 screener results.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ELIGIBILITY RULES EXPLAINED                                                  │
│ Official Criteria Under IIT Kanpur Ordinances                                │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ RULE 01: ACADEMIC QUALIFICATIONS                                         │ │
│ │ Condition: Must have passed Class 12 or equivalent with Physics,         │ │
│ │ Chemistry, and Mathematics (PCM). Minimum 5 subjects required.           │ │
│ │ Nuance: NIOS candidates are fully eligible. Candidates who only took     │ │
│ │ JEE Main Paper 2 or lack Class 12 Math are strictly ineligible.          │ │
│ │ Source: WSAIS FAQ 21 · Status: [Officially confirmed for selected cycle]  │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ RULE 02: AGE LIMITS & DATE OF BIRTH                                       │ │
│ │ 2026 Precedent: Born on or after October 1, 2001 (General/OBC).          │ │
│ │ Relaxation: Born on or after October 1, 1996 for SC, ST, and PwD.        │ │
│ │ 2027 Status: Official cutoff date is [Not yet officially confirmed].     │ │
│ │ Source: WSAIS FAQ 21 · Status: [Previously published in earlier cycle]   │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ RULE 03: NATIONALITY & RESERVATION CATEGORIES                             │ │
│ │ Condition: Indian Nationals only. OCI/PIO/Foreign nationals ineligible.  │ │
│ │ Statutory Reservations: Standard Government of India quotas apply         │ │
│ │ (SC, ST, OBC-NCL, EWS, PwD) under Senate guidelines.                     │ │
│ │ Source: IIT Kanpur Senate Records · Status: [Officially confirmed]       │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ RULE 04: ATTEMPTS & PREVIOUS IIT ADMISSION RESTRICTIONS                   │ │
│ │ Attempt Limit: Maximum 2 consecutive attempts.                            │ │
│ │ IIT Restriction: Candidates who accepted admission in any IIT under      │ │
│ │ JoSAA 2025 rules are ineligible, even if they later dropped out.         │ │
│ │ Permitted: Candidates who withdrew before the final round or completed    │ │
│ │ an IIT preparatory course for the first time in 2025.                    │ │
│ │ Source: WSAIS FAQ 21 · Status: [Previously published in earlier cycle]   │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ ELIGIBILITY RULES           │
│ Official Senate Criteria    │
│                             │
│ ┌─────────────────────────┐ │
│ │ Rule 01: Academics      │ │
│ │ Class 12 PCM (5 subj).  │ │
│ │ NIOS is eligible.       │ │
│ │ Source: FAQ 21          │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Rule 02: Age Limits     │ │
│ │ 2026: Born >= Oct 1 2001│ │
│ │ SC/ST/PwD: >= Oct 1 1996│ │
│ │ 2027: Not yet confirmed │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Rule 03: Nationality    │ │
│ │ Indian nationals only.  │ │
│ │ Standard GoI quotas.    │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Rule 04: Restrictions   │ │
│ │ Max 2 attempts. Prior   │ │
│ │ IIT admission restricts │ │
│ │ (JoSAA 2025 rules).     │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

* **Accessibility:** Each card has an `id` (`#rule-academics`, `#rule-age`, etc.) to allow accessible focus transfer when navigated from the screener.

---

### Section 5: Selection Process — Previous Cycle vs Upcoming Cycle
* **Anchor ID:** `#selection-process`
* **Section Purpose:** Detail the operational selection funnel, clearly contrasting the 2026 process with the confirmed 2027 shift.
* **Applicant Key Question:** *“How were students picked in 2026, and how will 2027 be different?”*
* **Design Pattern:** Dual-lane comparative workflow diagram with confirmed vs pending stage callouts.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ SELECTION PROCESS: DUAL-LANE COMPARISON                                      │
│ How Selection Worked in 2026 vs. What Changes for 2027                       │
│                                                                              │
│ LANE A: 2026 INAUGURAL CYCLE (HISTORICAL PRECEDENT)                          │
│ ┌─────────────────┐       ┌─────────────────┐       ┌──────────────────────┐ │
│ │ 1. Online App   │ ────▶ │ 2. Shortlisting │ ────▶ │ 3. In-Person Test    │ │
│ │ JEE Main Score  │       │ JEE Rank +      │       │ 6-Hour Hackathon     │ │
│ │ + FAQ 22 Dossier│       │ FAQ 22 Review   │       │ New Core Lab, IITK   │ │
│ └─────────────────┘       └─────────────────┘       └──────────────────────┘ │
│                                                                              │
│ LANE B: 2027 UPCOMING CYCLE (CONFIRMED SHIFT & PENDING DETAILS)              │
│ ┌─────────────────┐       ┌─────────────────┐       ┌──────────────────────┐ │
│ │ 1. Application  │ ────▶ │ 2. Entrance Test│ ────▶ │ 3. Final Evaluation  │ │
│ │ Portal Opens    │       │ Dedicated Test  │       │ Practical Assessment │ │
│ │ [Date: Pending] │       │ [JEE Main OUT]  │       │ [Format: Expected]   │ │
│ └─────────────────┘       └─────────────────┘       └──────────────────────┘ │
│                                                                              │
│ CRITICAL POLICY NOTE (FAQ 23):                                               │
│ IIT Kanpur WSAIS has officially announced that JEE Main will NOT be used    │
│ for future admissions. A separate dedicated entrance test will be conducted.│
│ Detailed syllabus, question format, and dates are pending official notice.  │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ SELECTION PROCESS           │
│ 2026 Precedent vs 2027 Shift│
│                             │
│ LANE A: 2026 PRECEDENT      │
│ 1. JEE Main + Dossier App   │
│        │                    │
│        ▼                    │
│ 2. Shortlist (JEE + Work)   │
│        │                    │
│        ▼                    │
│ 3. 6h Hackathon at IITK     │
│                             │
│ ── LANE B: 2027 CYCLE ───── │
│ 1. Online Registration      │
│    [Date: Pending]          │
│        │                    │
│        ▼                    │
│ 2. Dedicated Entrance Test  │
│    [JEE Main Discontinued]  │
│        │                    │
│        ▼                    │
│ 3. Practical Evaluation     │
│    [Details Pending]        │
│                             │
│ Warning: Do not buy 2027    │
│ syllabus coaching guides;   │
│ official syllabus is pending│
└─────────────────────────────┘
```

* **Epistemic Safeguard:** Warning against unverified coaching materials claiming to sell the "official 2027 B.Cyber syllabus".

---

### Section 6: Practical Assessment & Hackathon
* **Anchor ID:** `#practical-assessment`
* **Section Purpose:** Describe the physical, technical, and environmental realities of the in-person hackathon observed in 2026 and outline the 8 practical focus areas.
* **Applicant Key Question:** *“What happens inside the 6-hour hackathon, and what technical domains are tested?”*
* **Design Pattern:** Operational specification list + 8 domain capability matrix.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ PRACTICAL ASSESSMENT & HACKATHON                                             │
│ Operational Environment & Technical Domains Tested                           │
│                                                                              │
│ OPERATIONAL SPECIFICATIONS (2026 New Core Lab Precedent):                    │
│ • Duration: 6 continuous hours (10:00 AM – 4:00 PM) at New Core Lab, IITK.  │
│ • Environment: Sanitized offline workstations; no personal laptops allowed.  │
│ • Supervision: Faculty, technical officers, and C3iHub security engineers.   │
│                                                                              │
│ THE 8 PRACTICAL SECURITY DOMAINS:                                            │
│ ┌──────────────────────────┬──────────────────────────┬────────────────────┐ │
│ │ 01. Cryptography         │ 02. Web Security         │ 03. API Security   │ │
│ │ Ciphers, modular math,   │ SQLi, XSS, SSRF, IDOR,   │ BOLA, parameter    │ │
│ │ XOR, hashing logic       │ session tampering        │ tampering, JWTs    │ │
│ ├──────────────────────────┼──────────────────────────┼────────────────────┤ │
│ │ 04. Network Security     │ 05. Reverse Engineering  │ 06. OSINT          │ │
│ │ PCAP analysis, Wireshark,│ ELF/PE binary analysis,  │ Reconnaissance,    │ │
│ │ TCP/IP, DNS anomalies    │ disassembly, string hunt │ metadata triage    │ │
│ ├──────────────────────────┼──────────────────────────┼────────────────────┤ │
│ │ 07. Operating Systems    │ 08. Malware Analysis     │                    │ │
│ │ Linux CLI, processes,    │ Static signatures, strings                    │ │
│ │ cron, permissions        │ behavioral indicators    │                    │ │
│ └──────────────────────────┴──────────────────────────┴────────────────────┘ │
│                                                                              │
│ Need to build these skills? [ Explore Free Preparation Roadmap → ]           │
│                             (/blueprints/b-cyber/roadmap#roadmap-stages)     │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ PRACTICAL HACKATHON         │
│ 6-Hour In-Person Test       │
│                             │
│ Test Environment:           │
│ • 6 hours at New Core Lab   │
│ • Sanitized offline PCs     │
│ • Supervised by C3iHub/IITK │
│                             │
│ 8 Technical Domains:        │
│ 1. Cryptography             │
│ 2. Web Security (OWASP Top) │
│ 3. API Security & BOLA      │
│ 4. Network & PCAP Analysis  │
│ 5. Reverse Engineering      │
│ 6. OSINT Reconnaissance     │
│ 7. Operating Systems (Linux)│
│ 8. Malware Analysis         │
│                             │
│ [ Preparation Roadmap → ]   │
└─────────────────────────────┘
```

* **Cross-Link:** Direct link to `/blueprints/b-cyber/roadmap#roadmap-stages` to begin building hands-on labs.

---

### Section 7: Prior Work & Evidence Portfolio (FAQ 22)
* **Anchor ID:** `#prior-work`
* **Section Purpose:** Translate WSAIS FAQ 22 requirements into actionable evidence standards, distinguishing genuine proof-of-work from disqualifying anti-patterns.
* **Applicant Key Question:** *“What counts as 'verifiable evidence of prior work' under FAQ 22?”*
* **Design Pattern:** Split High-Signal vs. Anti-Pattern comparator + Self-review rubric.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ PRIOR WORK & EVIDENCE PORTFOLIO                                              │
│ Meeting the WSAIS FAQ 22 Standard for Verifiable Evidence                     │
│                                                                              │
│ Official Policy: Candidates must provide easily verifiable evidence of work │
│ in cybersecurity, computing, or related fields (FAQ 22).                     │
│                                                                              │
│ ┌──────────────────────────────────────┬───────────────────────────────────┐ │
│ │ HIGH-SIGNAL EVIDENCE (RECOMMENDED)   │ WEAK PRACTICES (AVOID)            │ │
│ ├──────────────────────────────────────┼───────────────────────────────────┤ │
│ │ • Documented GitHub repositories with│ • Generic completion certificates │ │
│ │   reproducible build instructions    │   from Udemy / Coursera           │ │
│ │ • Original security research or CTF  │ • Cloned or copy-pasted repos with│ │
│ │   challenge writeups                 │   only cosmetic README edits      │ │
│ │ • Reported vulnerabilities with      │ • Automated scanner dumps         │ │
│ │   responsible disclosure proof       │   (Nmap/Nessus without analysis)  │ │
│ │ • Open-source contributions with     │ • Unverifiable claims of "hacking │ │
│ │   merged pull requests               │   big systems" without proof      │ │
│ └──────────────────────────────────────┴───────────────────────────────────┘ │
│                                                                              │
│ PORTFOLIO CHECKLIST:                                                         │
│ [ ] Originality: Work is written or implemented by the candidate.            │
│ [ ] Reproducibility: Code can be executed with clear terminal instructions.  │
│ [ ] Verification: Public URLs, CVEs, or third-party confirmations provided.  │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ PRIOR WORK (FAQ 22)         │
│ Evidence Standards          │
│                             │
│ What IITK Looks For:        │
│ Verifiable technical work,  │
│ responsible disclosure, or  │
│ original computing tools.   │
│                             │
│ ✓ High-Signal:              │
│ • Public code repositories  │
│ • Reproducible test commands│
│ • Original CTF writeups     │
│ • Responsible disclosure    │
│                             │
│ ✕ Avoid:                    │
│ • Video course certificates │
│ • Cloned repos with no work │
│ • Automated scanner exports │
│                             │
│ [ Build Proof-of-Work → ]   │
│ (/roadmap#proof-of-work)    │
└─────────────────────────────┘
```

---

### Section 8: Application Logistics & Readiness Checklist
* **Anchor ID:** `#application-readiness`
* **Section Purpose:** Consolidate administrative details (application fees, refund policies, documents, statutory reservation) into an actionable pre-application checklist.
* **Applicant Key Question:** *“What fees, documents, and rules do I need to prepare before applying?”*
* **Design Pattern:** Logistics summary table + Interactive browser-only readiness checklist.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ APPLICATION LOGISTICS & READINESS                                            │
│ Fees, Deadlines, Documents & Statutory Conditions                            │
│                                                                              │
│ PARAMETER             OFFICIAL RULE (2026 REFERENCE)        2027 CYCLE STATUS│
│ ──────────────────────────────────────────────────────────────────────────── │
│ Application Fee       ₹1,600 (Female / SC / ST / PwD)       Not yet confirmed│
│                       ₹3,200 (All Other Candidates)                          │
│ ──────────────────────────────────────────────────────────────────────────── │
│ Refund Policy         Strictly Non-Refundable (FAQ 25)      Permanent Policy │
│ ──────────────────────────────────────────────────────────────────────────── │
│ Attempt Limit         Maximum 2 consecutive attempts (FAQ 21)Expected Policy │
│ ──────────────────────────────────────────────────────────────────────────── │
│ Reservation Policy    GoI Statutory Rules (OBC/SC/ST/EWS/PwD)Senate Mandatory│
│ ──────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│ APPLICANT READINESS CHECKLIST (Stored locally in your browser):              │
│ [ ] Class 12 PCM Marksheet / Passing Certificate ready                       │
│ [ ] Category Certificate in official Central GoI format (if applicable)     │
│ [ ] Proof-of-Work portfolio links organized and verified public              │
│ [ ] Government Photo ID ready for hackathon center reporting                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ APPLICATION LOGISTICS       │
│ Fees & Requirements         │
│                             │
│ Fees (2026 Reference):      │
│ • ₹1,600 (Female/SC/ST/PwD) │
│ • ₹3,200 (Others)           │
│ • Non-refundable (FAQ 25)   │
│ • 2027 fee: [Pending]       │
│                             │
│ Readiness Checklist:        │
│ [ ] Class 12 PCM certificate│
│ [ ] Central category doc    │
│ [ ] Public portfolio links  │
│ [ ] Valid photo identity    │
└─────────────────────────────┘
```

---

### Section 9: Admission FAQ Centre
* **Anchor ID:** `#admission-faqs`
* **Section Purpose:** Provide direct, visible, non-duplicative answers to the top 6 admission-specific question clusters.
* **Applicant Key Question:** *“What about NIOS, dropped JoSAA seats, entrance test syllabus, or branch change?”*
* **Design Pattern:** Topic-grouped FAQ list with direct answers visible by default.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ADMISSION FAQ CENTRE                                                         │
│ Ground-Truth Answers to Key Admission & Eligibility Inquiries                │
│                                                                              │
│ CLUSTER 1: ELIGIBILITY & ACADEMICS                                           │
│ Q: Is NIOS (Open Schooling) accepted for B.Cyber?                            │
│ A: Yes. NIOS candidates who passed Class 12 with Physics, Chemistry, and     │
│    Mathematics across at least 5 subjects are fully eligible (FAQ 21).       │
│                                                                              │
│ CLUSTER 2: AGE & ATTEMPTS                                                    │
│ Q: What is the age limit for the upcoming cycle?                             │
│ A: For 2026, candidates had to be born on or after Oct 1, 2001 (Oct 1, 1996 │
│    for SC/ST/PwD). The exact date cutoff for 2027 is pending official Senate │
│    announcement [VERIFY BEFORE PUBLICATION].                                 │
│                                                                              │
│ CLUSTER 3: THE 2027 SELECTION SHIFT                                          │
│ Q: Can I use my JEE Main 2027 score to apply?                                │
│ A: No. WSAIS FAQ 23 explicitly confirms that JEE Main is discontinued for    │
│    future admissions. A separate entrance test will be conducted.            │
│                                                                              │
│ CLUSTER 4: PRIOR IIT ADMISSION RESTRICTION                                   │
│ Q: If I joined an IIT in 2025 and dropped out, can I apply?                 │
│ A: No. Under Senate rules (FAQ 21), candidates admitted to any IIT in 2025   │
│    are ineligible, even if they cancelled admission later.                   │
│                                                                              │
│ CLUSTER 5: BRANCH CHANGE RESTRICTION                                         │
│ Q: Can I transfer from B.Cyber into regular B.Tech CSE after Year 1?         │
│ A: Strictly no. Branch change is prohibited under Senate ordinances (FAQ 12).│
│                                                                              │
│ CLUSTER 6: FEES & REFUNDS                                                    │
│ Q: Is the application fee refundable if I cannot attend the hackathon?       │
│ A: No. All application fees are non-refundable and non-transferable (FAQ 25).│
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ ADMISSION FAQS              │
│ Core Student Questions      │
│                             │
│ • NIOS Eligibility?         │
│   Eligible if PCM 5+ subj.  │
│                             │
│ • Age limit for 2027?       │
│   2026 was Oct 1 2001;      │
│   2027 pending announcement.│
│                             │
│ • JEE Main accepted in 2027?│
│   No. Discontinued (FAQ 23).│
│   Separate test announced.  │
│                             │
│ • Prior IIT admission?      │
│   JoSAA 2025 joined = no.   │
│                             │
│ • Branch change to B.Tech?  │
│   Strictly prohibited.      │
│                             │
│ • Fee refundable?           │
│   Non-refundable (FAQ 25).  │
└─────────────────────────────┘
```

---

### Section 10: Official Sources & Update History
* **Anchor ID:** `#official-sources`
* **Section Purpose:** Ensure absolute institutional transparency by documenting primary sources, citation mappings, and policy change history.
* **Applicant Key Question:** *“Where can I verify these rules myself on the official IIT Kanpur website?”*
* **Design Pattern:** 2-column source table + Policy update ledger + Correction submission route.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ VERIFIED SOURCES & POLICY UPDATE LEDGER                                      │
│ Direct Links to Official IIT Kanpur Institutional Notices                    │
│                                                                              │
│ PRIMARY REPOSITORIES:                                                        │
│ • IIT Kanpur WSAIS B.Cyber Portal: https://iitk.ac.in/wsais/b-cyber.php       │
│ • IIT Kanpur Senate Regulations: Ordinance 2025-26                           │
│ • IIT Madras Joint Notification: AY 2026-27 Launch Document                 │
│                                                                              │
│ CLAIM-TO-CITATION MAPPING:                                                   │
│ • Discontinuation of JEE Main ──────▶ WSAIS FAQ 23                           │
│ • Evidence of Prior Work Standard ──▶ WSAIS FAQ 22                           │
│ • Application Fees & Non-Refund ────▶ WSAIS FAQ 25                           │
│ • Branch Change Prohibition ────────▶ WSAIS FAQ 12                           │
│ • Eligibility & Attempt Limits ─────▶ WSAIS FAQ 21                           │
│                                                                              │
│ UPDATE HISTORY LOG:                                                          │
│ • 14 Oct 2026: Reconciled 2027 entrance status with WSAIS FAQ 23 notice.     │
│ • 12 Oct 2026: Verified New Core Lab hackathon operational specifications.   │
│                                                                              │
│ Found an error or updated notification? [ Submit an Editorial Correction ↗ ] │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ VERIFIED SOURCES            │
│ Official IITK Links         │
│                             │
│ Official Portals:           │
│ • WSAIS B.Cyber Portal ↗    │
│ • IITK Senate Ordinances    │
│                             │
│ Citations:                  │
│ • JEE Main Out: FAQ 23      │
│ • Prior Work: FAQ 22        │
│ • Fees & Refund: FAQ 25     │
│ • Branch Change: FAQ 12     │
│ • Eligibility: FAQ 21       │
│                             │
│ Last Verified: 14 Oct 2026  │
│ [ Submit Correction ↗ ]     │
└─────────────────────────────┘
```

---

### Section 11: Contextual Next-Step Gateway
* **Anchor ID:** `#next-step`
* **Section Purpose:** Route applicants who have evaluated their eligibility into their next logical step (technical preparation or foundational degree review).
* **Applicant Key Question:** *“I understand the admission criteria; what should I do right now?”*
* **Design Pattern:** Two-card route selector (Preparation Roadmap vs Program Overview).

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NEXT STEP DECISION GATEWAY                                                   │
│ Move From Eligibility Assessment to Concrete Preparation                     │
│                                                                              │
│ ┌──────────────────────────────────────┬───────────────────────────────────┐ │
│ │ OPTION 1: PREPARATION ROADMAP        │ OPTION 2: PROGRAM OVERVIEW        │ │
│ │ Ready to build technical competence? │ Need to review degree structure?  │ │
│ │                                      │                                   │ │
│ │ Access the free 5-stage roadmap,     │ Understand the 2+2 model, on-     │ │
│ │ 8 hackathon domain study plans, and  │ campus curriculum, and 5 practical│ │
│ │ verifiable proof-of-work guides.     │ laboratory courses.               │ │
│ │                                      │                                   │ │
│ │ [ Explore Preparation Roadmap → ]    │ [ Revisit B.Cyber Overview → ]    │ │
│ │ (/blueprints/b-cyber/roadmap)        │ (/blueprints/b-cyber)             │ │
│ └──────────────────────────────────────┴───────────────────────────────────┘ │
│                                                                              │
│ External: [ Check Official IIT Kanpur WSAIS Portal ↗ ]                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ NEXT STEPS                  │
│ Choose Your Action          │
│                             │
│ ┌─────────────────────────┐ │
│ │ 1. Prepare for Test     │ │
│ │ Free 5-stage roadmap,   │ │
│ │ 8 hackathon domains,    │ │
│ │ proof-of-work dossier.  │ │
│ │ [ Open Roadmap → ]      │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 2. Review Programme     │ │
│ │ 2+2 model, curriculum,  │ │
│ │ 5 security labs.        │ │
│ │ [ View Overview → ]     │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

* **No Sticky Bar:** Strictly non-sticky in-flow layout on mobile viewports.

---

## 4. Cross-Section Factual Consistency & Traceability Matrix

| Section ID | Key Data Points | Source / Evidence | Status |
| :--- | :--- | :--- | :--- |
| `#admission-start` | Multi-stage admission; cycle context | WSAIS Portal | `Confirmed` |
| `#admission-summary` | 3-stage funnel; JEE Main discontinued | WSAIS FAQ 23 | `Officially announced` |
| `#cycle-status` | 2026 vs 2027 parameters | WSAIS FAQ 21 & 23 | `Taxonomy tagged` |
| `#eligibility-check` | Class 12 PCM (5 subj), age, nationality | WSAIS FAQ 21 | `Baseline confirmed` |
| `#eligibility-rules` | NIOS eligible; JoSAA 2025 restriction | WSAIS FAQ 21 | `Confirmed (2026 rules)` |
| `#selection-process` | 2026 JEE+Hackathon vs 2027 separate test | WSAIS FAQ 23 | `Confirmed shift` |
| `#practical-assessment` | 6h New Core Lab test; 8 security domains | 2026 Precedent | `Observed precedent` |
| `#prior-work` | Verifiable evidence requirements | WSAIS FAQ 22 | `Confirmed` |
| `#application-readiness`| ₹1600 / ₹3200 fee; non-refundable | WSAIS FAQ 25 | `Confirmed (2026 fee)` |
| `#admission-faqs` | 6 core clusters answered directly | WSAIS FAQs 12, 21, 22, 23, 25 | `Confirmed` |
| `#official-sources` | Exact claim-to-FAQ mappings | WSAIS Portal | `Primary sources` |
| `#next-step` | Canonical links to Pillar 1 & Pillar 3 | Blueprint Architecture | `Locked` |
