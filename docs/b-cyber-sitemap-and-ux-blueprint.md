# B.Cyber Compass — Complete Website Sitemap & UX Blueprint
*Version: 3.0 | Status: FROZEN & LOCKED (12 October 2026)*
*Platform: Ayush-Paul Blueprints Ecosystem*
*Architectural Governance: Strict Sitemap Freeze Active — All 3 pillars (Pillar 1: 14 sections, Pillar 2: 12 sections, Pillar 3: 14 sections) are permanently locked. Zero sections may be added, removed, or renumbered without an approved architectural RFC.*

---

## 1. Executive Summary & Core UX Principles

### The Core Definition of this Blueprint
This is **not a generic blog, information wiki, or duplicate admission portal**. 
A Blueprint in the Ayush-Paul ecosystem is a **software-grade interface that guides the student from complete confusion to their desired outcome**.

### The Three Guiding UX Rules
1. **Never Force a Linear Prison**: A first-time student gets a gentle recommended order (`Understand → Check → Prepare`), but returning or informed students get 1-click fast-track jumps to any pillar.
2. **Anti-Wall-of-Text Visual Chunking**: Information is structured as interactive cards, data tables, split-comparators, visual steppers, and expandable drawers. Zero long, dry paragraphs.
3. **Institutional Integrity & Zero Hype**: Grounded 100% in verified official IIT Kanpur Senate records and WSAIS publications. No false placement guarantees, no unverified 2027 syllabus rumors, and transparent editorial disclosure as an independent guide.

---

## 2. Global Route Architecture & Sitemap Matrix

| Pillar | Stage | Canonical Route | Page Title | Primary Purpose | Primary CTA | Secondary CTA |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Pillar 1** | **Understand** | `/blueprints/b-cyber` | **B.Cyber Overview** | Understand the 4-year degree, 2+2 model, curriculum & realistic expectations | `Check Admission →` | `Explore Roadmap` |
| **Pillar 2** | **Check** | `/blueprints/b-cyber/admission` | **Admission & Eligibility** | Interactive eligibility screener, 2026 vs 2027 shift, 6h Hackathon domains | `View Preparation Roadmap →` | `Review Official Rules` |
| **Pillar 3** | **Prepare** | `/blueprints/b-cyber/roadmap`<br>*(alias: `/prepare`)* | **Preparation Roadmap** | Free 5-stage actionable pipeline + Paid personalized execution system (₹199–299) | `Check My Starting Point →` | `Explore Free Roadmap` |

---

## 3. Pillar-by-Pillar Information Architecture & Section Hierarchy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 B.CYBER COMPASS SITEMAP                                │
├────────────────────────────┬────────────────────────────┬──────────────────────────────┤
│    PILLAR 1: UNDERSTAND    │      PILLAR 2: CHECK       │      PILLAR 3: PREPARE       │
│    `/blueprints/b-cyber`   │ `/blueprints/b-cyber/      │ `/blueprints/b-cyber/        │
│                            │   admission`               │   roadmap`                   │
├────────────────────────────┼────────────────────────────┼──────────────────────────────┤
│ • Sec 0: Hero & Jump Chips │ • Sec 0: Hero (#admission) │ • Sec 00: Hero & Cycle Status│
│ • Sec 1: 30-Sec Summary    │ • Sec 1: 30-Sec Summary    │ • Sec 01: Known vs Unknown   │
│ • Sec 2: Key Facts Grid    │ • Sec 2: Cycle Status Board│ • Sec 02: 60-Sec Visual Path │
│ • Sec 3: 2+2 Visual Model  │ • Sec 3: Cycle Screener    │ • Sec 03: Free Diagnostic    │
│ • Sec 4: 4-Sem Curriculum  │ • Sec 4: Rules Explained   │ • Sec 04: 5 Learning Stages  │
│ • Sec 5: Beyond Hacking    │ • Sec 5: Selection Process │ • Sec 05: Resource Library   │
│ • Sec 6: Degree Comparison │ • Sec 6: Hackathon Format  │ • Sec 06: Weekly Pace Engine │
│ • Sec 7: Who Should Join   │ • Sec 7: Prior Work & FAQ22│ • Sec 07: Proof-of-Work Board│
│ • Sec 8: Degree & Alumni   │ • Sec 8: Application Rules │ • Sec 08: Practice & Checks  │
│ • Sec 9: Internship Truth  │ • Sec 9: Admission FAQ Ctr │ • Sec 09: Paid Plan Preview  │
│ • Sec 10: Common Myths     │ • Sec 10: Official Sources │ • Sec 10: Recovery Protocol  │
│ • Sec 11: Common FAQs      │ • Sec 11: Contextual Next  │ • Sec 11: Prep FAQ Centre    │
│ • Sec 12: Source Citations │                            │ • Sec 12: Sources & Updates  │
│ • Sec 13: Next Step CTA    │                            │ • Sec 13: Next-Step Gateway  │
└────────────────────────────┴────────────────────────────┴──────────────────────────────┘
```

---

### PILLAR 1: B.Cyber Overview (Understand)
*Canonical Route:* `/blueprints/b-cyber`  
*Status: Finalized Master Architecture (Locked Source of Truth)*  
*Governance Note: The master sitemap governs global information architecture, section hierarchy, and canonical anchor IDs. The approved, locked wireframes (`docs/b-cyber-wireframes.md`) govern the corrected, source-audited layout and content specifications.*  

* **Section 0 — Hero: First Impression & Fast-Track Route Jump** (`#overview-start`)
  * Trust Label: *"Independent guide, based on official sources — not the official IIT Kanpur website."*
  * Headline: *"What Is IIT Kanpur B.Cyber? Degree Structure, Curriculum & Ground Truth."*
  * Fast-Track Entry Chips:
    * 🟢 *First-time visitor?* ➔ "Start with the basics (Scroll down)"
    * 🟡 *Already know the program?* ➔ `[ Check Admission & Eligibility → ]` (`/blueprints/b-cyber/admission#admission-start`)
    * 🔵 *Ready to prepare?* ➔ `[ Explore Preparation Roadmap → ]` (`/blueprints/b-cyber/roadmap#prep-start`)
* **Section 1 — B.Cyber in 30 Seconds (Direct-Answer First)** (`#quick-answer`)
  * 40–60 word plain text summary formatted for AEO/GEO/Google direct answer:
    *"IIT Kanpur’s Bachelor of Cybersecurity (B.Cyber.) is a four-year undergraduate program run by the Wadhwani School of AI and Intelligent Systems (WSAIS). It features two years of coursework at IIT Kanpur followed by a two-year internship component. Successful graduates receive the B.Cyber degree and official IIT Kanpur alumni status."*
  * Official source anchor: `https://iitk.ac.in/wsais/b-cyber.php`
* **Section 2 — Program at a Glance (Key Facts Matrix)** (`#key-facts`)
  * Clean 2-column accessible key-value table:
    * Program Title: *Bachelor of Cybersecurity (B.Cyber.)*
    * Academic Unit: *WSAIS, IIT Kanpur (institutional note on separate IIT Madras SIDiS option)*
    * Duration: *4 Years (Maximum 6 Years under published programme rules)*
    * Structure: *2 Years On-Campus Coursework + 2 Years Field Deployment*
    * Credential Conferred: *B.Cyber. Degree & IIT Alumni Status after successful completion*
    * Placement: *Specialized placement channel provided; zero historical cohort data as program began July 2026*
* **Section 3 — The 4-Year, 2+2 Model (Visual Stepper & Timeline)** (`#model-2plus2`)
  * Custom visual timeline:
    * *Years 01–02*: On-Campus Academic & Laboratory Rigor at IIT Kanpur.
    * *Years 03–04*: Field Deployment / Practical Internship primarily at selected government organisations.
  * Explicit conceptual breakdown: Difference between *Internship Component*, *Employment*, and *Placement*.
* **Section 4 — Curriculum and Subjects (Semesters 1 to 4)** (`#curriculum`)
  * Grouped academic-year curriculum lists (Sem 1: 51 Cr, Sem 2: 50–54 Cr, Sem 3: 50 Cr, Sem 4: 46 Cr; coursework total range: 197–201 Cr across Sem 1–4) with 5 prescribed 8-credit practical labs highlighted: Malware Analysis Lab, Digital Forensics Lab, Cloud Security Lab, VAPT Lab, Network & Web Security Lab.
* **Section 5 — Beyond Hacking: What Cybersecurity Actually Covers** (`#beyond-hacking`)
  * 5 Domain Cards: Foundations & OS, Networking & Protocols, Cryptography, Defensive Forensics & VAPT, Human Factors & Security Psychology.
* **Section 6 — Balanced Degree Comparison** (`#degree-comparison`)
  * Objective comparative matrix: B.Cyber vs. Conventional B.Tech Computer Science (focus, structure, labs, practical deployment, higher-study parity). Acknowledges what cannot yet be compared (future salaries).
* **Section 7 — Is B.Cyber Right for You? (Fit & Self-Reflection)** (`#fit-check`)
  * *Strong fit if...* (passionate about systems, patient problem solver, curious about defensive security).
  * *Think carefully if...* (only chasing IIT tag, expecting generic software dev, assuming instant job guarantee).
  * Interactive 3-checkbox reflection prompt.
* **Section 8 — Degree Award, Recognition & Higher Studies** (`#degree-recognition`)
  * Official degree title (B.Cyber), alumni status upon graduation (FAQ 17), eligibility to apply for postgraduate programmes (MS/MTech/PhD) in India and abroad subject to receiving institutions' admission criteria (FAQ 9), and strict branch change restrictions (FAQ 12).
* **Section 9 — Internship, Stipend & Placement Reality** (`#internship-reality`)
  * Ground truth: Two-year academic internship primarily at selected government organisations; stipends vary according to host-organisation policy and are not guaranteed (FAQ 14); student retains continuous IIT Kanpur student status; zero historical cohort or placement statistics exist because the inaugural cohort commenced in July 2026.
* **Section 10 — Common Misconceptions (Myth vs. Fact)** (`#myths-vs-facts`)
  * 5 high-contrast rows dispelling common myths (ethical hacking only, guaranteed paid employment, placement support = fixed salary, 2026 rules apply to 2027, interchangeable with generic CSE).
* **Section 11 — Frequently Asked Questions (Visible Three-Topic FAQ Matrix)** (`#common-faqs`)
  * 8 core student questions with direct, visible plain-text answers organized by topic (Admissions & Entry, Degree & Campus, Internship & Placement).
* **Section 12 — Editorial Transparency & Verified Sources** (`#official-sources`)
  * Citations to official WSAIS portal, Senate records, last-verified date (12 October 2026), and correction submission link.
* **Section 13 — Next Step Decision Gateway** (`#next-steps`)
  * Primary CTA: `Check Admission & Eligibility →` (leads to `/blueprints/b-cyber/admission#admission-start`)
  * Secondary CTA: `Explore Preparation Roadmap →` (leads to `/blueprints/b-cyber/roadmap#prep-start`)

---

### PILLAR 2: Admission & Eligibility (Check)
*Canonical Route: `/blueprints/b-cyber/admission`*
*Status: Finalized Master Architecture (Locked Source of Truth)*

#### 1. Product Definition & Core Boundaries
* **Core User Question**: “Main IIT Kanpur B.Cyber admission ke liye apni situation kaise assess karun, selection process kaise samjhun, aur abhi mujhe kya karna chahiye?”
* **Primary Outcome**: The student leaves with:
  1. A clear understanding of the multi-stage admission process.
  2. A cycle-specific view of what is officially known and what remains unconfirmed.
  3. Evidence-aware eligibility guidance with transparent limitations (no overconfident verdicts).
  4. A practical understanding of the selection process, hackathon format, and FAQ 22 prior-work expectations.
  5. A clear next action and direct access to authoritative sources.
* **What This Page Is**: An admission decision-support interface combining policy navigation, a cycle-aware eligibility screener, a selection-process explainer, practical preparation guidance, and an official-source directory.
* **What This Page Is NOT**:
  * An unofficial substitute for IIT Kanpur's admission portal.
  * A guarantee of eligibility, selection, or admission.
  * A prediction of future entrance-test questions or selection cutoffs.
  * A replacement for the Preparation Roadmap (Pillar 3).
  * A duplicate of the B.Cyber program overview (Pillar 1).

#### 2. Target Users & Non-Linear Entry Paths
Supports five distinct user situations in a single coherent page without forced linear sequencing:
1. **First-Time Explorer**: Needs a concise explanation and recommended reading path.
2. **Eligibility-First Student**: Jumps directly to `#eligibility-check` to assess age, academic background, and relevant conditions.
3. **Next-Cycle (2027) Aspirant**: Uses `#cycle-status` and `#selection-process` to distinguish confirmed rules from pending announcements and avoid outdated criteria.
4. **Student With Prior Technical Work**: Jumps to `#prior-work` to understand how projects, practical work, and documented evidence evaluate under FAQ 22.
5. **Returning Student**: Accesses specific rules in `#eligibility-rules` or official citations in `#official-sources` without completing the screener again.

#### 3. Navigation & Interaction Standards
* **On-This-Page Navigation (Refinement A)**:
  * *Desktop*: Compact horizontal anchor strip below the header compatible with the existing site layout, preserving content readability without squeezing the page into a narrow sidebar.
  * *Mobile*: Collapsible, non-sticky section index (`Jump to Section ▾`) that closes immediately after an anchor destination is selected. Strictly no additional persistent sticky layer or viewport obstruction.
  * Stable, unique anchor IDs across all 12 sections (`#admission-start` through `#next-step`).
* **Screener-to-Rule Deep Links (Refinement B)**:
  * Each relevant screener result links directly to the exact explanatory rule or source section using descriptive link text such as *"View the supporting official rule."*
  * Focuses destination accessibly and applies a subtle, temporary visual highlight (`ring-2 ring-brand-primary/40`).
  * Respects `prefers-reduced-motion` (strictly zero continuous pulse animations).
  * Links directly to the actual supporting official notice, FAQ, or regulation (no false assumption that every requirement originates from a Senate rule).
* **Consistent Status Taxonomy (Refinement C)**:
  Applied consistently across the cycle-status board, screener results, eligibility rules, selection process, practical assessment, prior-work guidance, and application-readiness section:
  1. `Officially confirmed for the selected cycle`
  2. `Officially announced for a future cycle`
  3. `Previously published or observed in an earlier cycle`
  4. `Not yet officially confirmed`
  5. `Guide recommendation, not an official requirement`

#### 4. Exact 12-Section Hierarchy (Sec 0–11)

* **Section 0 — Hero: Admission & Eligibility** (`#admission-start`)
  * **H1**: *How Admission to IIT Kanpur B.Cyber Works: Eligibility, 2026 Precedent & The 2027 Shift*
  * Concise explanation of what this page helps the student determine.
  * Visible admission-cycle context indicator with an honest status summary for the selected cycle.
  * Primary CTA: `Check My Admission Readiness` (scrolls to `#eligibility-check`).
  * Secondary Text Link: `Understand the Selection Process` (scrolls to `#selection-process`).
  * Boundary: Strictly no unverified eligibility cutoffs, exam dates, or selection probabilities in the hero.

* **Section 1 — Admission in 30 Seconds** (`#admission-summary`)
  * Direct-answer crawlable HTML summary answering the core search query immediately (academic qualification ➔ entrance screening ➔ practical hackathon).
  * Compact high-level visual pathway clearly distinguishing 2026 precedent from the upcoming-cycle process.
  * Visible pointer to the official WSAIS admission portal.

* **Section 2 — Admission Cycle Status Board** (`#cycle-status`)
  * Cycle selector toggle: `Upcoming Cycle (2027 Planning)` [Default] vs. `Previous Cycle (2026 Historical Reference)`.
  * Classifies all cycle-dependent claims using the 5-part Status Taxonomy.
  * Unannounced upcoming items displayed as explicit pending states (no invented dates or blank gaps).
  * Switching cycles updates status labels, screener criteria, and application logistics.
  * Boundary: Status overview only; detailed rules belong to Section 4 and full selection flow to Section 5.

* **Section 3 — Interactive Cycle-Aware Eligibility Screener** (`#eligibility-check`)
  * Multi-step compact form with visible progress indicator, back/edit controls, and zero account/email collection.
  * Evaluates conditions applicable to the selected cycle: academic qualification (PCM 5 subjects), age/DOB, nationality, and prior IIT admission/attempt history.
  * **Five Defined Result States**:
    * *Result A (Meets Published Baseline)*: Shows met conditions, outstanding items, and next verification steps.
    * *Result B (Published Condition Unmet)*: Identifies the specific documented rule, cycle, and limitation.
    * *Result C (Future-Cycle Rules Unconfirmed)*: Explicitly states *"2027 eligibility rules not yet confirmed by IIT Kanpur Senate"*; provides provisional statutory baseline (PCM & Indian nationality) without an overconfident verdict.
    * *Result D (Insufficient Information)*: Highlights missing answers with 1-click edit prompt.
    * *Result E (Rules Require Review)*: Shows that check is unavailable pending verification rather than manufacturing an answer.
  * Screener-to-rule deep links: each result contains a descriptive link (`View the supporting official rule`) pointing to Section 4 with accessible focus.
  * Strict boundary: Zero admission probabilities, scores, or fake "chance of getting into IIT Kanpur."

* **Section 4 — Eligibility Rules Explained** (`#eligibility-rules`)
  * Transparent rule cards grouped by category:
    1. Academic qualifications and subject requirements (Class 12 PCM 5 subjects).
    2. Age and date-of-birth conditions (2026 cutoff: Oct 1, 2001 / Oct 1, 1996 for SC/ST/PwD; 2027 unannounced).
    3. Nationality and statutory reservation categories.
    4. Previous IIT admission, attempts, or other restrictions.
    5. Additional conditions specific to the selected cycle.
  * Consistent card structure: rule explained, applicable cycle, published condition, student impact, source/FAQ reference, and unconfirmed status if applicable.
  * Highlightable card state when navigated from screener results.
  * Boundary: Explains admission eligibility only; general degree regulations belong on the program overview.

* **Section 5 — Selection Process: Previous Cycle vs Upcoming Cycle** (`#selection-process`)
  * Dual-lane comparison with two clearly labelled tracks:
    * *Lane A (Previous-Cycle 2026 Reference)*: JEE Main score shortlisting + FAQ 22 evidence ➔ 6-Hour New Core Lab Hackathon.
    * *Lane B (Upcoming-Cycle 2027 Status)*:
      * Officially Announced (FAQ 23): JEE Main permanently discontinued; separate entrance test announced.
      * Pending Official Notice: Examination format (CBT vs. written), schedule, syllabus topics, question counts, and selection weights. Explicit warning against unverified coaching rumors.
  * Compact visual sequence displaying pending states for uncertain stages without assumption-filling.

* **Section 6 — Practical Assessment & Hackathon** (`#practical-assessment`)
  * **Documented Format**: 6-hour practical test at New Core Lab, IIT Kanpur, on sanitized offline workstations.
    * Label: `[Previously published or observed in an earlier cycle]`
  * **Preparation Focus Areas**: 8 practical security domains (Cryptography, Web, Networks, Reversing, OSINT, OS, Malware, API) to build transferable foundational competence.
    * Label: `[Guide recommendation, not an official requirement]`
  * Direct pointer to Preparation Roadmap (Pillar 3) for structured skill development.

* **Section 7 — Prior Work & Evidence Portfolio** (`#prior-work`)
  * **Official Requirement**: WSAIS FAQ 22 requirement for *easily verifiable evidence of prior work in cybersecurity, computing, or related fields*.
    * Label: `[Officially confirmed for the selected cycle]`
  * **Evidence-Quality Matrix**:
    * *Recommended High-Signal Formats*: Documented repositories, reproducible test commands, detailed CTF writeups, responsible disclosure acknowledgments. Labeled `[Guide recommendation, not an official requirement]`.
    * *Weak Evidence Anti-Patterns*: Generic video course certificates (Coursera/Udemy), automated vulnerability scanner dumps, cloned repos with cosmetic edits. Labeled `[Weak evidence practice to avoid]`.
  * Compact self-review checklist (originality, reproducibility, documentation, external source acknowledgment). Zero fake scoring or arbitrary acceptance thresholds.

* **Section 8 — Application Logistics & Readiness Checklist** (`#application-readiness`)
  * Administrative details with explicit cycle attribution and taxonomy labels:
    * Application Fees: ₹1,600 (Female/SC/ST/PwD) / ₹3,200 (Others) for 2026 (FAQ 25); 2027 fees labeled `Not yet officially confirmed`.
    * Attempt Limits: Maximum 2 consecutive attempts for 2026 (FAQ 21); 2027 limit labeled `Not yet officially confirmed`.
    * Reservation Matrix: Statutory GoI categories under Senate ordinances.
    * Refund Status: Non-refundable application fee.
  * Local readiness checklist (browser storage only, no account requirement).
  * Missing announcements display explicit `Not yet officially announced` status with official notification portal links.

* **Section 9 — Admission FAQ Centre** (`#admission-faqs`)
  * Categorized accordion covering 6 distinct admission clusters:
    1. Eligibility and academic requirements.
    2. Age, nationality, and previous admission rules.
    3. 2026 vs 2027 admission changes.
    4. Entrance test and practical assessment format.
    5. Prior work and project evidence expectations.
    6. Application fees, documents, and administrative rules.
  * Direct, plain-text answers with cycle attribution and visible source links.

* **Section 10 — Official Sources & Update History** (`#official-sources`)
  * Primary official source directory (IIT Kanpur WSAIS portal, Senate records, IIT Madras joint launch documentation).
  * Claim-to-source mapping linking specific regulations to exact FAQ numbers.
  * Verification metadata (source title, applicable cycle, check date, exact citation reference).
  * Update history log recording substantive policy shifts with dates and concise descriptions.
  * Working editorial correction submission route.

* **Section 11 — Contextual Next-Step Gateway** (`#next-step`)
  * Primary In-Flow CTA: `Explore the Preparation Roadmap →` (links to `/blueprints/b-cyber/roadmap`).
  * Secondary In-Flow Links: `Revisit B.Cyber Overview` (`/blueprints/b-cyber`) and `Open Official Admission Source`.
  * Contextual screener next-step integration without repeated oversized banner blocks.
  * Strictly no persistent mobile bottom CTA bar.

---

### PILLAR 3: Preparation Roadmap (Prepare)
*Page:* Preparation Roadmap  
*Canonical route:* `/blueprints/b-cyber/roadmap` *(Strict 301 alias: `/blueprints/b-cyber/prepare`)*  
*Sub-routes (Phase 2):* `/blueprints/b-cyber/roadmap/check` (Diagnostic), `/blueprints/b-cyber/roadmap/my-plan` (Personalized Workspace)  
*Status:* Finalized Master Sitemap & Information Architecture — Ready for Implementation  

---

#### 1. Product Definition & Core Philosophy

##### Core User Questions Solved
1. **"Mujhe kya seekhna hai?"** ➔ Clear, trustworthy, cycle-aware preparation roadmap.
2. **"Mujhe abhi kya karna chahiye?"** ➔ Free diagnostic starting point and immediate actionable practice task.
3. **"Main consistently prepare kaise karun?"** ➔ Personalized schedule, assigned resources, structured checkpoints, and missed-week recovery plan.

##### Core Product Separation: Free vs. Paid
* **Free Core Roadmap**: Genuinely prepares the student. Solves problems 1 & 2 completely without paywalls. Gives universal 5-stage roadmap, verified announcements, curated resources with access tags, free diagnostic test, manual sample pace schedules, starter practice sets, and public evidence guidelines.
* **Paid Execution System (₹199–299)**: Makes preparation executable for the individual's specific constraints. Solves problem 3. Converts general knowledge into a personalized weekly task queue, gap-prioritized task assignments, structured progress checkpoints, and an adaptive rescheduling engine for missed weeks.
* **Epistemic Integrity & Admission Boundary**: Grounded in official IIT Kanpur statements. The official WSAIS B.Cyber page announces a separate entrance test for future admissions and explicitly specifies that JEE Main will not be used. However, upcoming cycle detailed rules/syllabus are not yet confirmed by the IIT Kanpur Senate. Therefore, the roadmap explicitly presents past 2026 test topics as historical reference, **not** as a guaranteed future syllabus.

---

#### 2. Master Section-by-Section Information Architecture (Sec 00 – Sec 13)

* **Section 00 — Hero: Start Your Preparation** (`#prep-start`)
  * **Core Intent**: Clarify page purpose, establish target audience (beginners to advanced applicants), provide instant fast-track entry.
  * **Trust & Status Badge**: Compact admission-cycle status panel clearly displaying what is officially confirmed vs. what is pending for upcoming entrance tests. Explicit disclaimer: *Zero selection guarantee; independent technical prep guide.*
  * **Primary CTA**: `Check My Starting Point ↓` (Smooth-scrolls to `#readiness-check`).
  * **Secondary CTA**: `Explore Free Roadmap ↓` (Smooth-scrolls to `#roadmap-summary`).
  * **Cycle Context**: Fast toggle/indicator acknowledging 2026 hackathon precedents vs. future separate entrance test status.

* **Section 01 — What We Know vs. What Is Still Unknown** (`#roadmap-certainty`)
  * **Core Intent**: Transparent epistemic clarity preventing student misdirection.
  * **3-Column Certainty Matrix**:
    1. *Officially Confirmed*: Separate entrance test announced on WSAIS portal; JEE Main will not be used for future admissions.
    2. *Historical Precedent (2026 Cycle)*: On-campus 6-hour hackathon across 8 security domains, prior-work evaluation, presentation round.
    3. *Not Yet Announced / Unknown*: Exact syllabus, question format, marking weights, exam dates, eligibility age cuts for future cycles.
  * **Cross-Pillar Bridge**: Direct contextual banner to Pillar 2: `[Review Complete Eligibility & Selection Rules in Pillar 2 →]`.
  * **Maintenance Protocol**: Modular design allowing instantaneous text updates whenever IIT Kanpur releases fresh circulars.

* **Section 02 — Roadmap in 60 Seconds** (`#roadmap-summary`)
  * **Core Intent**: Immediate high-level mental model before deep dives.
  * **Visual 5-Stage Path**:
    `Stage 0: Baseline` ➔ `Stage 1: Foundations` ➔ `Stage 2: Security Fundamentals` ➔ `Stage 3: Investigation` ➔ `Stage 4: Application & Evidence`
  * **Stage Preview Cards**: Each node displays:
    * Objective in 1 sentence.
    * Prerequisites needed before entry.
    * Tangible capability unlocked upon completion.
  * **Disclaimer Label**: Explicitly badged as *Technical Learning Architecture*, not an official IIT Kanpur syllabus.

* **Section 03 — Free Readiness Diagnostic** (`#readiness-check`)
  * **Core Intent**: Diagnose current competence and eliminate the "where do I start?" friction.
  * **6-Parameter Assessment Inputs**:
    1. *Operating System & Terminal*: Total beginner / Basic commands / Fluent in Linux bash & permissions.
    2. *Networking Fundamentals*: No idea / Basic IP & DNS / TCP/IP packet capture & Wireshark fluent.
    3. *Programming / Scripting*: None / Basic Python or C / Write automation scripts & parsers.
    4. *Prior Security Practice*: Zero / Read blogs & videos / Active in CTFs or Bandit labs.
    5. *Weekly Time Commitment*: 2–4 hours / 5–8 hours / 10+ hours.
    6. *Hardware & Platform Constraints*: Windows only / Dual boot or VM ready / Low hardware or limited internet.
  * **Diagnostic Output**:
    * Current Preparation Tier (Baseline, Foundation, Intermediate, Advanced).
    * Top 2–3 Priority Knowledge Gaps to address first.
    * Direct Anchor Link to Recommended Starting Stage in Section 04.
  * **Boundary Rule**: Strict guardrail: *This diagnostic evaluates technical readiness; it is not an admission selection predictor.*

* **Section 04 — The Learning Roadmap: Stage Details** (`#roadmap-stages`)
  * **Core Intent**: Deep, authoritative, step-by-step syllabus with clear milestones.
  * **Detailed Stage Breakdown**:
    * **STAGE 0 · BASELINE — Setup & Safe Practice**:
      * Focus: Command-line literacy, safe virtualized lab setup, ethical boundaries, Indian legal context (IT Act 2000).
      * Anti-Trap: Prevents beginners from getting stuck in configuration hell or risky unauthorized testing.
      * Deliverable: Working local Linux environment (WSL2 or VirtualBox) and configured terminal.
    * **STAGE 1 · FOUNDATIONS — Linux, Operating Systems & Networking**:
      * Focus: Terminal fluency, filesystem navigation, permissions (chmod/chown), process lifecycle, socket basics, TCP/IP 3-way handshake, DNS resolution, HTTP request/response inspection.
      * Deliverable: Complete OverTheWire Bandit L0–15; capture and annotate a raw HTTP/DNS PCAP in Wireshark.
    * **STAGE 2 · SECURITY FUNDAMENTALS — Web/API Security & Cryptography**:
      * Focus: Authentication mechanisms, session tokens, OWASP Top 10 web vulnerabilities (SQLi, XSS, IDOR), basic symmetric vs. asymmetric cryptography, hashing vs. encryption.
      * Deliverable: Solve PortSwigger Web Security Academy beginner labs; write a basic Caesar/Vigenère/AES cipher script in Python.
    * **STAGE 3 · INVESTIGATION — OSINT, Reverse Engineering & Threat Analysis**:
      * Focus: Structured open-source intelligence methodologies, executable anatomy (ELF/PE headers), introductory static disassembly in Ghidra/Cutter, threat modeling concepts.
      * Deliverable: Write a reproducible walkthrough of 1 beginner PicoCTF forensics and 1 reverse engineering challenge.
    * **STAGE 4 · APPLICATION — Integrated Challenges & Evidence**:
      * Focus: Multi-domain challenges, defensive reasoning, documenting vulnerabilities, explaining exploit flow clearly, code review.
      * Deliverable: Comprehensive technical writeup of an end-to-end laboratory challenge with reproduction steps and remediation advice.
  * **Epistemic Note**: Formatted as independent technical recommendations informed by past hackathon benchmarks; ready for adaptive realignment when new official syllabi are released.

* **Section 05 — Curated Resource Library** (`#resource-library`)
  * **Core Intent**: Highly curated, zero-bloat learning tools with unambiguous access labels.
  * **Interactive Filters**: By Stage (0–4), Skill Domain, Difficulty (Beginner / Intermediate), Setup Requirements, and Cost.
  * **Curated Tool Directory**:
    * *OverTheWire (Bandit)* ➔ `[Free · No Account Needed · Browser/SSH]`
    * *PortSwigger Web Security Academy* ➔ `[Free · Free Account Required · Browser/Burp Suite]`
    * *Wireshark Sample Captures (Wireshark.org)* ➔ `[Free · Local Install · Sample PCAPs]`
    * *PicoCTF (Carnegie Mellon)* ➔ `[Free · Free Account Required · Browser]`
    * *TryHackMe (Introductory Rooms)* ➔ `[Freemium · Free Tier Available · Account Required]`
  * **Resource Annotation Schema**:
    * *What you will learn from this:* 1 clear sentence.
    * *When to use it:* Stage timing and specific prerequisites.
    * *Trap warning:* "Stop at Level 15; do not get stuck trying to finish advanced levels without Stage 2 foundations."

* **Section 06 — Weekly Pace & Sample Schedules** (`#weekly-pace`)
  * **Core Intent**: Actionable study structuring for free users without forcing paid purchases.
  * **Interactive Pace Selector**:
    * *Pace A: Casual Explorer (2 hours / week)* ➔ Focus on steady weekend labs; ~20 weeks for Foundations.
    * *Pace B: Focused Student (4 hours / week)* ➔ Balanced 2 hours concept + 2 hours lab; ideal alongside Class 12th/College.
    * *Pace C: Intensive Sprint (8 hours / week)* ➔ Deep daily hands-on practice, fast-track through stages.
  * **Weekly Balance Triangle**: Fixed 40% Concept Study, 40% Hands-on Labs, 20% Documentation & Review.
  * **Boundary Rule**: Presented as illustrative pacing benchmarks; zero assumptions about remaining months before exams.

* **Section 07 — Proof-of-Work & Evidence Dossier** (`#proof-of-work`)
  * **Core Intent**: Demystify portfolio preparation and establish high-signal evidence habits.
  * **What Constitutes Real Evidence**:
    * Reproducible lab notes with commands and output snippets.
    * Original CTF challenge writeups detailing thought process, failure attempts, and final exploit logic.
    * Documented code repositories (e.g., custom network packet parser, crypto analysis tool).
    * Network traffic analysis reports with annotated screenshots.
  * **Anti-Patterns & Red Flags**:
    * Generic completion certificates from video courses (Coursera/Udemy).
    * Cloned GitHub repositories with only cosmetic changes.
    * Automated vulnerability scanner dumps passed off as personal work.
  * **Free Deliverable**: Downloadable Markdown template checklist for project writeups.
  * **Paid Linkage**: Highlights how the paid engine assigns tailored evidence tasks based on diagnosed gaps.
  * **Crucial Caveat**: Past-cycle prior work evaluation is labeled as historical precedent; not guaranteed to be mandatory in future cycles.

* **Section 08 — Practice Exercises & Self-Checks** (`#practice-tasks`)
  * **Core Intent**: Immediate active recall and hands-on skill verification.
  * **Starter Challenge Set**:
    * Task 1: "Find the hidden file with specific permissions using Linux `find`" (Stage 1).
    * Task 2: "Extract the plain-text HTTP credentials from a provided PCAP sample" (Stage 1).
    * Task 3: "Bypass a client-side form validation using browser devtools" (Stage 2).
    * Task 4: "Identify SQL injection vulnerability in a mock query string" (Stage 2).
  * **Self-Check Accordions**: Progressive hints (Hint 1, Hint 2, Solution) + "I Can Explain This" conceptual verification checklist.
  * **Exam Simulation Policy**: Timed mock exams are explicitly withheld until IIT Kanpur releases the verified format of the future separate entrance test.

* **Section 09 — Personalized Execution System (Paid Engine)** (`#personal-plan`)
  * **Core Intent**: Present the core premium product as an individualized execution workflow rather than static content.
  * **Product Offer Matrix**:
    * Intake: Gathers current skill, hardware constraints, time budget, and target cycle.
    * Output: Custom weekly task queue, gap-prioritized task assignments, tailored resource links, and dynamic rescheduling.
  * **Pricing & Transparency**:
    * Fixed pricing: ₹199 – ₹299 (one-time payment; zero hidden recurring subscriptions).
    * Clear terms: 12-month access duration, unlimited adaptive rescheduling, future cycle update guarantee, clear refund policy.
  * **Primary Action**: `[ Preview My Personalized Execution Plan → ]`
  * **Free Core Guarantee**: Transparent declaration that the entire 5-stage roadmap, diagnostic, and resource library remain 100% free forever.

* **Section 10 — Progress Tracking, Missed Weeks & Recovery** (`#recovery-plan`)
  * **Core Intent**: Overcome guilt and dropouts when academic exams or life events interrupt preparation.
  * **Public Recovery Protocol**:
    * The 60-Minute Emergency Routine: How to keep mental models warm during high-stress exam periods.
    * Resumption Protocol: Do not start from scratch; review the last completed checkpoint and continue.
  * **Paid System Preview**: Interactive preview of the one-click "Recalibrate Schedule" button that dynamically stretches deadlines without shame or lost progress.

* **Section 11 — Preparation FAQ Centre** (`#prep-faqs`)
  * **Core Intent**: Resolve immediate candidate doubts with direct, cited answers.
  * **Key FAQs**:
    1. *Kitni programming aani chahiye shuru karne se pehle?* (Zero needed for Stage 0; basic Python/C recommended by Stage 2).
    2. *Kya expensive laptop zaroori hai?* (No; any basic 4GB–8GB RAM PC capable of running Linux/WSL2 is sufficient; high-end GPUs not required).
    3. *Kya free resources B.Cyber preparation ke liye enough hain?* (Yes; 100% of core concepts and labs are covered by world-class free platforms).
    4. *Kya zero computer background se shuru karna possible hai?* (Yes; Stage 0 is specifically built for baseline readiness).
    5. *Jab IIT Kanpur future exam ka format release karega, toh roadmap kaise update hoga?* (The roadmap dynamically updates free of charge, with cycle difference notices).
  * **Navigation Rule**: Admission-specific eligibility or date questions route to Pillar 2 (`#admission-faqs`).

* **Section 12 — Sources, Methodology & Update History** (`#prep-sources`)
  * **Core Intent**: Institutional trust, transparent attribution, and audit trail.
  * **Source Registry**:
    * Official IIT Kanpur WSAIS B.Cyber Portal (`https://iitk.ac.in/wsais/b-cyber.php`).
    * 2026 Admission FAQ Circulars & Senate Ordinances.
    * Open-source curriculum benchmarks (OverTheWire, PortSwigger, NIST NICE Cybersecurity Workforce Framework).
  * **Update Audit Log**: Tracks changes, newly published dates, and impacted stages.
  * **Editorial Corrections**: Direct mail/feedback submission link for community reporting.

* **Section 13 — Contextual Next-Step Gateway** (`#prep-next`)
  * **Core Intent**: Guide the user to the logical next step based on where they stand.
  * **Action Options**:
    * 🟢 *New applicant?* ➔ `[ Start the Free Diagnostic Check (#readiness-check) ]`
    * 🟡 *Need admission clarity?* ➔ `[ Explore Pillar 2: Admission & Eligibility (/blueprints/b-cyber/admission) ]`
    * 🔵 *Want an automated schedule?* ➔ `[ Unlock Personalized Execution Engine (#personal-plan) ]`
    * ⚪ *Want full degree overview?* ➔ `[ Revisit Pillar 1: Overview (/blueprints/b-cyber) ]`
  * **Layout Rule**: In-flow responsive grid; strictly NO persistent floating/sticky mobile overlays.

---

#### 3. Free vs. Paid Feature Boundary Matrix

| Feature / Capability | Free Tier | Paid Execution System (₹199–299) |
| :--- | :--- | :--- |
| **Full 5-Stage Learning Roadmap** | ✅ Included in full detail | ✅ Included in full detail |
| **Official Announcements & Epistemic Board** | ✅ Included in full | ✅ Included; never a paid exclusive |
| **Curated Resource Directory & Access Badges** | ✅ Included with all links & filters | ✅ Included with recommended alternatives |
| **Readiness Diagnostic Assessment** | ✅ Basic result + starting stage + gaps | ✅ Deep intake + individualized gap prioritization |
| **Weekly Study Schedule** | ✅ Generic sample paces (2 / 4 / 8 hrs/wk) | ✅ Personalized calendar with custom hours |
| **Hands-On Practice Tasks** | ✅ Starter challenge set + hints + solutions | ✅ Assigned task sequence matching user gaps |
| **Resource Selection** | ✅ Student chooses from curated directory | ✅ Explicitly assigned tool & backup options |
| **Proof-of-Work Portfolio Guidance** | ✅ Public criteria, examples & MD template | ✅ Tailored milestone evidence assignments |
| **Progress Tracking** | ✅ Simple local checklist (browser storage) | ✅ Persistent cloud progress & checkpoints |
| **Missed-Week Recovery Protocol** | ✅ General 60-min emergency routine advice | ✅ Automated dynamic schedule recalibration |
| **Future Cycle Syllabus Updates** | ✅ Automatically updated for free | ✅ Automatically included for free |

---

#### 4. Personalization Engine Architecture (Paid Core)

##### Intake Parameters (Deterministic Model)
1. **Current Skill Level**: Absolute beginner / Basic computing / Prior security dabbler / Active CTF player.
2. **Technical Strengths & Deficits**: Linux CLI, Networking, Python/C Scripting, Web Security, Cryptography, OSINT.
3. **Weekly Time Availability**: 2 hrs / 4 hrs / 8 hrs / 15+ hrs sprint.
4. **Device & Environment**: Windows only (needs WSL guidance), Linux/VM ready, low hardware specs (cloud shell recommended).
5. **Resource Constraints**: Free-only preferences, account creation tolerance, local CLI tooling restrictions.
6. **Milestone Goal**: 2027 Admission Cycle / C3iHub Internship Preparation / General Cybersecurity Foundations.

##### Engine Deliverables
1. **Individual Starting Stage**: Specific stage placement with prerequisites checklist.
2. **Weekly Task Queue**: Exact sequenced tasks, effort estimates, and verifiable completion criteria.
3. **Tailored Resource Pairings**: Pinpointed modules (e.g., Bandit L1–L14) with free backups.
4. **Milestone Checkpoints**: Verifiable conceptual checks to complete before advancing.
5. **Structured Evidence Tasks**: Concrete output to document in the student's personal GitHub portfolio.
6. **Adaptive Rescheduling**: Algorithmic timeline re-computation after missed weeks.

---

#### 5. Epistemic Trust System & Badge Taxonomy

Every claim, learning recommendation, and external resource is tagged with one of five standardized badges:
1. `[Officially Confirmed]`: Directly verified from IIT Kanpur Senate records or official WSAIS admissions portal.
2. `[Announced — Details Pending]`: Official future-cycle announcement made (e.g., separate test, no JEE Main), but exact format/syllabus unconfirmed.
3. `[Previous Cycle Precedent]`: Documented 2026 admissions procedure; not guaranteed to repeat in future cycles.
4. `[Guide Recommendation]`: Practical educational guidance designed by practitioners; not an official institutional requirement.
5. `[External Resource]`: Third-party tool tagged with access conditions (`Free`, `Free Tier`, `Paid`, `Account Required`, `Local Setup`).

---

#### 6. Phased Rollout Plan

* **MVP (First Release)**:
  * Public Roadmap Hub (`/blueprints/b-cyber/roadmap`).
  * 5-Stage Visual Tech Pipeline (Stages 0–4).
  * Free Readiness Diagnostic (interactive calculator).
  * Curated Resource Library with filtering & badges.
  * Sample Weekly Paces (2, 4, 8 hours).
  * Proof-of-Work documentation checklist.
  * Starter Practice Tasks with hints.
  * Paid Execution System preview & feature comparison.
  * Source citations, update history & feedback gateway.
  * *Zero signup barriers for viewing or using the free roadmap.*
* **Phase 2 (Sub-routes & Accounts)**:
  * Persistent User Accounts & Cloud Progress Sync.
  * Dedicated Sub-routes: `/blueprints/b-cyber/roadmap/check` and `/blueprints/b-cyber/roadmap/my-plan`.
  * Automated payment gateway integration (Razorpay/Stripe for ₹199–299).
  * Interactive Adaptive Rescheduling Engine.
  * Cycle-specific mock simulations once official test format is published by IIT Kanpur.

---

## 4. Shared UX, Navigation & Layout Rules

### 4.1 Global Sub-Navigation Bar (Contextual Header)
Present across all 3 pages, fixed below the global Ayush-Paul site header:
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [B.CYBER COMPASS]   •  1. Understand Overview   •   2. Check Admission   •   3. Roadmap    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
* Shows active state badge on current pillar.
* 1-click jump to any pillar anytime without friction.

### 4.2 Breadcrumb Standard
* Standard: `Home > Blueprints > B.Cyber Compass > [Current Page]`
* Clickable links for effortless return to the main platform.

### 4.3 Mobile Navigation Standard
* Single clean column layout on screens < 768px.
* Contextual in-flow CTA at section conclusion; strictly NO persistent mobile bottom CTA overlay to preserve viewport space, prevent safe-area keyboard overlap, and avoid obscuring mobile sub-navigation.
* Collapsible, non-sticky page section index that closes immediately after an anchor destination is selected.
* Zero competing button clutter; minimum 44px touch targets.

### 4.4 Trust & Editorial Transparency Bar
* Placed at the top of every page:
  `[INDEPENDENT GUIDE · NOT AN OFFICIAL IIT KANPUR SITE · LAST CHECKED: 12 OCT 2026]`
* Source verification drawer accessible via small emerald citation tags.

### 4.5 Cross-Pillar Navigation & Deep-Linking Matrix

| Origin Pillar & Section | Link Destination | Target Anchor ID | Context & User Purpose |
| :--- | :--- | :--- | :--- |
| **Pillar 1: Sec 0 (Hero Chips)** | `/blueprints/b-cyber/admission` | `#admission-start` | Fast-track jump for students who already understand degree structure |
| **Pillar 1: Sec 0 (Hero Chips)** | `/blueprints/b-cyber/roadmap` | `#prep-start` | Fast-track jump for applicants looking for preparation resources |
| **Pillar 1: Sec 13 (Decision Gateway)** | `/blueprints/b-cyber/admission` | `#admission-start` | Primary funnel progression after understanding degree overview |
| **Pillar 1: Sec 13 (Decision Gateway)** | `/blueprints/b-cyber/roadmap` | `#prep-start` | Alternative funnel progression directly to preparation roadmap |
| **Pillar 2: Sec 1 (Summary Card)** | `/blueprints/b-cyber` | `#quick-answer` | Direct-answer pointer for students needing foundational program context |
| **Pillar 2: Sec 6 (Hackathon)** | `/blueprints/b-cyber/roadmap` | `#roadmap-stages` | Technical preparation routing to Stage 0–4 learning stages |
| **Pillar 2: Sec 7 (Prior Work FAQ 22)** | `/blueprints/b-cyber/roadmap` | `#proof-of-work` | Actionable documentation & dossier guidance for verifiable technical artifacts |
| **Pillar 2: Sec 11 (Next-Step Gateway)** | `/blueprints/b-cyber/roadmap` | `#prep-start` | Primary funnel progression: move from eligibility assessment to preparation |
| **Pillar 2: Sec 11 (Next-Step Gateway)** | `/blueprints/b-cyber` | `#quick-answer` | Revisit degree structure, curriculum, and 2+2 model |
| **Pillar 3: Sec 01 (Certainty Board)** | `/blueprints/b-cyber/admission` | `#selection-process` | Direct bridge to official selection rules and 2026 vs 2027 distinction |
| **Pillar 3: Sec 07 (Proof-of-Work)** | `/blueprints/b-cyber/admission` | `#prior-work` | Cross-reference with official FAQ 22 prior work evaluation criteria |
| **Pillar 3: Sec 11 (Prep FAQ Centre)** | `/blueprints/b-cyber/admission` | `#admission-faqs` | Route statutory eligibility, age cutoff, and reservation questions |
| **Pillar 3: Sec 13 (Next-Step Gateway)** | `/blueprints/b-cyber/admission` | `#admission-start` | Re-evaluate admission criteria and eligibility before continuing preparation |
| **Pillar 3: Sec 13 (Next-Step Gateway)** | `/blueprints/b-cyber` | `#quick-answer` | Revisit full 4-year degree overview |

### 4.6 Strict Sitemap Freeze & Governance Policy
* **Lock Status**: **PERMANENTLY FROZEN**.
* **Zero Arbitrary Mutations**: Sitemap lock hone ke baad bina valid reason ya approved architectural RFC ke koi bhi section add, remove, split, rename ya renumber nahi kiya jayega.
* **1:1 Implementation Symmetry**: Har code component (`BCyberHomePage.tsx`, `BCyberAdmissionGuidePage.tsx`, `BCyberPreparationPlannerPage.tsx`) ko exactly inhin agreed section IDs aur sequences ke mutabik render karna mandatory hai.

---

## 5. Technical Implementation & Phased Execution Plan

```
PHASE 1 (Now)     ──► Complete 3-Pillar Master Sitemap & UX Blueprint locked in docs (Done)
PHASE 2           ──► Shared Sub-Nav & Layout Shell (`BCyberNav`, Breadcrumbs, Trust Bar) (Done)
PHASE 3           ──► Build Pillar 1 Overview (`/blueprints/b-cyber`) with 14 Visual Sections (Done)
PHASE 4           ──► Build Pillar 2 Admission (`/blueprints/b-cyber/admission`) with 12 Sections (Done)
PHASE 5           ──► Build Pillar 3 Roadmap (`/blueprints/b-cyber/roadmap`) with 14 Sections (Ready to build)
PHASE 6           ──► End-to-End QA: Verification, Routing, SEO Meta & Links Validation
```
