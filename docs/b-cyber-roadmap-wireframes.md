# B.Cyber Compass — Pillar 3: Preparation Roadmap Wireframe Specifications
*Version: 1.0 | Status: Draft Wireframe for Review (14 October 2026)*  
*Platform: Ayush-Paul Blueprints Ecosystem*  
*Scope: Pillar 3 — Preparation Roadmap (`/blueprints/b-cyber/roadmap` | Canonical)*  
*Strict 301 Alias: `/blueprints/b-cyber/prepare` ➔ `/blueprints/b-cyber/roadmap`*  
*Architectural Alignment: Fully synced with `docs/b-cyber-sitemap-and-ux-blueprint.md` (Pillar 3: 14 Locked Sections, Sec 00–13)*

---

## 1. Document Purpose & Architectural Governance

This document defines the structural, low-fidelity wireframe specifications, content hierarchy, interaction mechanics, and product boundaries for **Pillar 3: Preparation Roadmap (`/blueprints/b-cyber/roadmap`)**.

### 1.1 Core Governance Constraints
1. **Low-Fidelity & Structural**: Communicates layout hierarchy, data density, component grouping, and responsive stacking without decorative bloat. Uses clean text layouts, ASCII wireframe blocks, tables, lists, and decision flows.
2. **Distinct Desktop & Mobile Layouts**: Provides explicit ASCII wireframes for both desktop (≥ 1024 px) and mobile (< 768 px) for every single section.
3. **Strict Zero Mobile Sticky Overlay Policy**: Strictly no persistent bottom CTA bar, floating buttons, or intrusive sticky toolbars on mobile viewports.
4. **Epistemic Rigor & Source Grounding**: Every claim is mapped to official IIT Kanpur Senate records, WSAIS publications, or explicit historical precedent.
5. **Standardized 5-Part Status Taxonomy**:
   - `[Officially confirmed for the selected cycle]`
   - `[Officially announced for a future cycle]`
   - `[Previously published or observed in an earlier cycle]`
   - `[Not yet officially confirmed]` *(or `VERIFY BEFORE PUBLICATION`)*
   - `[Guide recommendation, not an official requirement]`
6. **Independence Disclosure**: Clearly declares that the site is an independent editorial guide and is not affiliated with or endorsed by IIT Kanpur.
7. **Free vs. Paid Product Boundary**:
   - **Free Core Roadmap**: Complete 5-stage learning path, certainty board, free diagnostic test, curated external resource library, sample pace models, starter practice exercises, and public proof-of-work criteria. Free forever without paywalls.
   - **Paid Execution System (₹199–₹299 one-time)**: Solves personal consistency and execution. Provides individualized weekly task queues, gap-prioritized task assignments, structured checkpoints, and an adaptive rescheduling engine for missed weeks.
8. **Admission Boundary Guardrail**: Roadmap recommendations are based on past hackathon benchmarks and foundational cybersecurity competencies. It explicitly states that it is **not** an official IIT Kanpur entrance examination syllabus or an admission guarantee.

---

## 2. Global Navigation & Interaction Standards

### 2.1 Navigation Model
- **Primary Global Navigation**: Uses the shared `BCyberNav` component with Pillar 3 marked active (`/blueprints/b-cyber/roadmap`).
- **Clean In-Flow Editorial Layout**: No heavy secondary sticky sub-nav bars. Standard in-page anchor links (#readiness-check, #roadmap-stages, #resource-library, #personal-plan) provide swift jump-points.

### 2.2 Free Readiness Diagnostic Logic (Section 03)
- 6-parameter self-assessment (OS/terminal, networking, programming, prior security exposure, weekly time budget, hardware/platform constraints).
- Zero registration, email collection, or authentication gatekeeping. Evaluated entirely in the user's browser.
- Instant output: diagnostic readiness tier (Baseline, Foundation, Intermediate, Advanced), priority knowledge gaps, and direct anchor link to recommended starting stage in Section 04.
- Guardrail: strictly no admission percentiles, probability scores, or fake "chances of cracking IIT Kanpur".

---

## 3. Section-by-Section Wireframe Specifications (Sections 00–13)

---

### Section 00: Hero — Start Your Preparation
* **Anchor ID:** `#prep-start`
* **Section Purpose:** Establish page scope, declare editorial independence, highlight the active entrance cycle context, and provide instant dual fast-tracks (diagnostic vs. full roadmap).
* **Student Key Question:** *“Where do I begin preparing for B.Cyber, and what technical level is required?”*
* **Design Pattern:** Editorial hero header with cycle-context badge, independence disclosure, and 2 direct entry actions.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Independent guide · Not official IIT Kanpur website]                        │
│                                                                              │
│ B.Cyber Technical Preparation Roadmap:                                       │
│ From First Principles to Hackathon Competence                                │
│                                                                              │
│ An open, evidence-grounded engineering guide for self-directed applicants.   │
│ Master core networking, Linux systems, web security, and verifiable labs.    │
│                                                                              │
│ Cycle Status: Upcoming Entrance Test Announced · JEE Main Discontinued (FAQ23)│
│                                                                              │
│ [ Check My Starting Point ↓ ]               [ Explore Free Roadmap ↓ ]       │
│   (#readiness-check)                          (#roadmap-summary)             │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ [Independent guide]         │
│                             │
│ B.Cyber Technical           │
│ Preparation Roadmap         │
│                             │
│ From First Principles to    │
│ Hackathon Competence        │
│                             │
│ Status: Separate Test Annou.│
│ JEE Main Discontinued (FAQ23│
│                             │
│ ┌─────────────────────────┐ │
│ │ Check My Starting Point │ │ (Primary CTA -> #readiness-check)
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Explore Free Roadmap    │ │ (Secondary Link -> #roadmap-summary)
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

* **Content Hierarchy:**
  1. Plain-text independence disclosure: `Independent guide · Based on official IIT Kanpur WSAIS records`.
  2. H1 Heading: *B.Cyber Technical Preparation Roadmap: From First Principles to Hackathon Competence*.
  3. Concise descriptive lead paragraph defining target audience (beginners to advanced applicants).
  4. Active cycle status context indicator.
  5. Primary CTA (`Check My Starting Point` -> smooth-scrolls to `#readiness-check`) and Secondary CTA (`Explore Free Roadmap` -> smooth-scrolls to `#roadmap-summary`).
* **Mobile Behavior:** Full-width buttons stacked vertically with minimum 44 px tap targets. Zero persistent floating overlays.

---

### Section 01: What We Know vs. What Is Still Unknown
* **Anchor ID:** `#roadmap-certainty`
* **Section Purpose:** Transparent epistemic clarity preventing student misdirection, fake coaching rumors, or confusion between past precedents and future rules.
* **Student Key Question:** *“What is officially confirmed about the upcoming entrance test versus unverified rumors?”*
* **Design Pattern:** 3-column epistemic certainty matrix + cross-pillar bridge banner.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ EPISTEMIC CERTAINTY BOARD                                                    │
│ What We Know with Certainty vs. What Remains Unannounced                     │
│                                                                              │
│ ┌────────────────────────┬────────────────────────┬────────────────────────┐ │
│ │ 1. OFFICIALLY CONFIRMED│ 2. HISTORICAL PRECEDENT│ 3. PENDING / UNKNOWN   │ │
│ │ [Status: Confirmed]    │ [Status: 2026 Observed]│ [Status: Not Yet Annou]│ │
│ ├────────────────────────┼────────────────────────┼────────────────────────┤ │
│ │ • Separate entrance    │ • 6-hour on-campus     │ • Official exam dates  │ │
│ │   test announced on    │   hackathon at New Core│ • Syllabus topic breakdown│
│ │   WSAIS portal.        │   Lab, IIT Kanpur.     │ • CBT vs. paper format │ │
│ │ • JEE Main will NOT be │ • Sanitized offline PCs│ • Question count & type│ │
│ │   used for future      │ • 8 security domains   │ • Exact marking weight │ │
│ │   admissions (FAQ 23). │ • Prior-work dossier   │ • 2027 age cutoff date │ │
│ │ • Class 12 PCM req.    │   review (FAQ 22).     │ • 2027 application fee │ │
│ └────────────────────────┴────────────────────────┴────────────────────────┘ │
│                                                                              │
│ Need complete admission rules? [ Review Admission & Eligibility (Pillar 2) →]│
│                                (/blueprints/b-cyber/admission)               │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ CERTAINTY BOARD             │
│ Confirmed vs Pending        │
│                             │
│ 1. OFFICIALLY CONFIRMED:    │
│ • Separate test announced   │
│ • JEE Main discontinued     │
│ • Class 12 PCM required     │
│                             │
│ 2. HISTORICAL PRECEDENT:    │
│ • 6h hackathon at IITK      │
│ • 8 practical domains       │
│ • Prior-work dossier req.   │
│                             │
│ 3. STILL UNANNOUNCED:       │
│ • Exam dates & format       │
│ • Official test syllabus    │
│ • Question counts & weight  │
│                             │
│ [ Review Pillar 2 Rules → ] │
│ (/blueprints/b-cyber/admiss)│
└─────────────────────────────┘
```

* **Epistemic Enforcement:** Explicitly cautions students against paying coaching centers for "leaked" 2027 entrance syllabi.
* **Cross-Pillar Bridge:** Direct contextual link to `/blueprints/b-cyber/admission#selection-process`.

---

### Section 02: Roadmap in 60 Seconds
* **Anchor ID:** `#roadmap-summary`
* **Section Purpose:** Deliver an instant, high-level visual mental model of the 5-stage technical learning sequence before detailed breakdowns.
* **Student Key Question:** *“What is the overall technical path from day zero to advanced labs?”*
* **Design Pattern:** Sequential 5-stage progression path with preview cards.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ROADMAP IN 60 SECONDS                                                        │
│ The 5 Progressive Stages of Technical Preparation                            │
│                                                                              │
│ [STAGE 0] ───▶ [STAGE 1] ───▶ [STAGE 2] ───▶ [STAGE 3] ───▶ [STAGE 4]        │
│ Baseline       Foundations    Security Fund.  Investigation   Application    │
│ CLI & Setup    Linux & Net    Web & Crypto    OSINT & Revers  Labs & Dossier │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ STAGE PREVIEWS:                                                          │ │
│ │ • Stage 0: Terminal literacy, virtualization & safe local environment.   │ │
│ │ • Stage 1: Filesystem permissions, processes, TCP/IP & Wireshark PCAPs.  │ │
│ │ • Stage 2: OWASP Top 10 web vulnerabilities, authentication & crypto.    │ │
│ │ • Stage 3: ELF/PE binary analysis, Ghidra disassembly & OSINT workflows. │ │
│ │ • Stage 4: End-to-end multi-step challenges & reproducible documentation.│ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ Note: Independent technical learning architecture · Not official IITK syllabus│
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ ROADMAP IN 60 SECONDS       │
│ 5-Stage Progression         │
│                             │
│ 0. BASELINE                 │
│    CLI & Virtualization     │
│         │                   │
│         ▼                   │
│ 1. FOUNDATIONS              │
│    Linux & Networking       │
│         │                   │
│         ▼                   │
│ 2. SECURITY FUNDAMENTALS    │
│    Web Security & Crypto    │
│         │                   │
│         ▼                   │
│ 3. INVESTIGATION            │
│    OSINT & Reverse Eng.     │
│         │                   │
│         ▼                   │
│ 4. APPLICATION              │
│    Full Labs & Dossier      │
│                             │
│ [ Start Stage 0 Details ↓ ] │
│ (#roadmap-stages)           │
└─────────────────────────────┘
```

---

### Section 03: Free Readiness Diagnostic
* **Anchor ID:** `#readiness-check`
* **Section Purpose:** Diagnose applicant current competence and eliminate decision paralysis through a free, 6-parameter self-assessment evaluated entirely locally in the browser.
* **Student Key Question:** *“Which stage should I start from based on my background?”*
* **Design Pattern:** Interactive diagnostic questionnaire (6 inputs) with instant diagnostic outcome cards and stage jump anchors.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ FREE READINESS DIAGNOSTIC                                                    │
│ Evaluate Your Technical Baseline & Identify Your Starting Stage             │
│                                                                              │
│ 1. Operating System & Terminal Fluent:                                       │
│    ( ) Total beginner  ( ) Basic commands  ( ) Fluent in Linux & bash        │
│ 2. Networking Fundamentals:                                                  │
│    ( ) No idea  ( ) Basic IP/DNS understanding  ( ) Wireshark PCAP fluent    │
│ 3. Programming & Scripting Background:                                       │
│    ( ) None  ( ) Basic Python or C  ( ) Write automation parsers/scripts     │
│ 4. Prior Security & CTF Exposure:                                            │
│    ( ) Zero  ( ) Read articles & videos  ( ) Active in OverTheWire / CTFs    │
│ 5. Weekly Available Study Hours:                                             │
│    ( ) 2–4 hours/week  ( ) 5–8 hours/week  ( ) 10+ hours/week                │
│ 6. Hardware & Platform Constraints:                                          │
│    ( ) Windows basic PC  ( ) Linux / VM / Dual Boot ready  ( ) Low RAM (<4GB)│
│                                                                              │
│ [ Calculate My Starting Stage ]                                              │
│                                                                              │
│ ──────────────────────────────────────────────────────────────────────────── │
│ [DIAGNOSTIC OUTCOME PREVIEW: FOUNDATION TIER DETECTED]                       │
│                                                                              │
│ Recommended Starting Point: STAGE 1 (FOUNDATIONS)                            │
│ Identified Priority Gaps:                                                    │
│ • Linux file permissions & process management                                │
│ • TCP/IP 3-way handshake & raw packet analysis                               │
│                                                                              │
│ [ Jump Directly to Stage 1 Plan → ] (#stage-1)                               │
│                                                                              │
│ Guardrail: Evaluates technical readiness only · Not an admission predictor.  │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ READINESS DIAGNOSTIC        │
│ 6 Quick Questions           │
│                             │
│ 1. Linux / Terminal:        │
│    [ Select Level ▾ ]       │
│ 2. Networking:              │
│    [ Select Level ▾ ]       │
│ 3. Programming:             │
│    [ Select Level ▾ ]       │
│ 4. Security / CTFs:         │
│    [ Select Level ▾ ]       │
│ 5. Weekly Hours:            │
│    [ Select Hours ▾ ]       │
│ 6. Hardware Setup:          │
│    [ Select Hardware ▾ ]    │
│                             │
│ [ Calculate Starting Stage ]│
│                             │
│ ── DIAGNOSTIC RESULT ────── │
│ Result: Stage 1 (Foundations│
│ Top Gap: Linux Permissions  │
│ [ Jump to Stage 1 → ]       │
│ (#stage-1)                  │
└─────────────────────────────┘
```

* **Zero Gatekeeping:** No sign-up, email, phone number, or payment required. Evaluated client-side in seconds.

---

### Section 04: The Learning Roadmap — Detailed Stage Breakdown
* **Anchor ID:** `#roadmap-stages`
* **Section Purpose:** Exhaustive, authoritative, step-by-step technical syllabus across all 5 stages with clear objectives, prerequisites, anti-traps, and tangible deliverables.
* **Student Key Question:** *“What specific concepts do I study in each stage, and what should I build?”*
* **Design Pattern:** Detailed stage cards with anchor targets (`#stage-0`, `#stage-1`, `#stage-2`, `#stage-3`, `#stage-4`).

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ THE 5-STAGE LEARNING ROADMAP                                                 │
│ Step-by-Step Curriculum with Verifiable Lab Deliverables                     │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ STAGE 0: BASELINE — Setup, Terminal & Safe Practice             (#stage-0)│ │
│ │ Objective: Establish safe virtual environment and basic command-line tool.│ │
│ │ Core Topics: VirtualBox/WSL2 setup, Linux CLI essentials, ethical hacking│ │
│ │   boundaries, Indian Information Technology Act (IT Act 2000).            │ │
│ │ Anti-Trap: Avoid getting stuck in distro hopping or illegal testing.     │ │
│ │ Milestone Deliverable: Working Ubuntu VM / WSL2 with configured bash.    │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ STAGE 1: FOUNDATIONS — Linux Systems & Networking               (#stage-1)│ │
│ │ Objective: Understand how operating systems execute and networks talk.   │ │
│ │ Core Topics: Permissions (chmod/chown), processes (ps/kill), cron jobs,  │ │
│ │   TCP/IP 3-way handshake, DNS records, HTTP requests, Wireshark filters. │ │
│ │ Anti-Trap: Do not skip networking theory; packet triage is fundamental.  │ │
│ │ Milestone Deliverable: Bandit L0–15 complete; 1 annotated PCAP report.   │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ STAGE 2: SECURITY FUNDAMENTALS — Web, APIs & Cryptography       (#stage-2)│ │
│ │ Objective: Identify common flaws in web protocols and basic cryptographic│ │
│ │   mechanisms.                                                            │ │
│ │ Core Topics: OWASP Top 10 (SQLi, XSS, CSRF, IDOR), JWT tokens, BOLA,     │ │
│ │   hashing vs encryption, XOR, symmetric AES, asymmetric RSA concepts.    │ │
│ │ Milestone Deliverable: Solve PortSwigger beginner labs; Python crypto tool│
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ STAGE 3: INVESTIGATION — OSINT & Reverse Engineering            (#stage-3)│ │
│ │ Objective: Deconstruct compiled binaries and conduct systematic recon.   │ │
│ │ Core Topics: ELF/PE structure, strings, Ghidra disassembly, OSINT pivots.│ │
│ │ Milestone Deliverable: 1 PicoCTF reverse-engineering writeup with code.   │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ STAGE 4: APPLICATION — Integrated Challenges & Evidence Dossier (#stage-4)│ │
│ │ Objective: Synthesize multi-stage labs and document reproducible findings.│ │
│ │ Core Topics: Attack-chain reconstruction, remediation writing, code audit.│
│ │ Milestone Deliverable: Comprehensive public Markdown technical report.   │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ LEARNING ROADMAP            │
│ 5 Progressive Stages        │
│                             │
│ ┌─────────────────────────┐ │
│ │ STAGE 0: BASELINE       │ │
│ │ Setup & Safe Practice   │ │
│ │ • Linux VM / WSL2       │ │
│ │ • CLI & IT Act 2000     │ │
│ │ Output: Working Linux VM│ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ STAGE 1: FOUNDATIONS    │ │
│ │ Linux & Networking      │ │
│ │ • TCP/IP, DNS, Wireshark│ │
│ │ Output: Bandit L0-15    │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ STAGE 2: SECURITY FUND. │ │
│ │ Web, APIs & Crypto      │ │
│ │ • OWASP Top 10, SQLi/XSS│ │
│ │ Output: PortSwigger labs│ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ STAGE 3: INVESTIGATION  │ │
│ │ OSINT & Reverse Eng.    │ │
│ │ • Ghidra, ELF/PE, Recon │ │
│ │ Output: PicoCTF writeup │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ STAGE 4: APPLICATION    │ │
│ │ Labs & Evidence Dossier │ │
│ │ Output: Public tech doc │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

### Section 05: Curated Resource Library
* **Anchor ID:** `#resource-library`
* **Section Purpose:** Filterable directory of high-signal, zero-bloat external learning platforms with explicit access tags, requirements, and anti-rabbit-hole guidance.
* **Student Key Question:** *“Which exact websites, tools, or courses should I use, and are they free?”*
* **Design Pattern:** Filterable resource directory (by stage, difficulty, cost, setup) with structured cards.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ CURATED RESOURCE LIBRARY                                                     │
│ High-Signal, Free Platforms with Transparent Access Requirements             │
│                                                                              │
│ Filter by Stage: [ All ] [ Stage 0 ] [ Stage 1 ] [ Stage 2 ] [ Stage 3 ]     │
│ Filter by Type:  [ Hands-On Labs ] [ Documentation ] [ Tool Downloads ]      │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ OVERTHEWIRE: BANDIT                                                      │ │
│ │ Stage: Stage 1 (Foundations) · Access: [Free · No Account Needed]        │ │
│ │ What you learn: Terminal navigation, SSH, file permissions, pipes.       │ │
│ │ When to use: Day 1 of Linux practice; complete levels 0 through 15.      │ │
│ │ Trap Warning: Do not spend weeks trying to solve advanced levels without │ │
│ │   Stage 2 networking foundations.                                        │ │
│ │ Link: [ Launch Bandit ↗ ] (overthewire.org/wargames/bandit)               │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ PORTSWIGGER WEB SECURITY ACADEMY                                         │ │
│ │ Stage: Stage 2 (Security Fundamentals) · Access: [Free · Free Account]   │ │
│ │ What you learn: SQL injection, Cross-Site Scripting, CSRF, server labs.  │ │
│ │ When to use: After basic HTTP request/response inspection is understood. │ │
│ │ Trap Warning: Stick to Apprentice level labs first; avoid Practitioner.  │ │
│ │ Link: [ Open PortSwigger Academy ↗ ] (portswigger.net/web-security)      │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ WIRESHARK SAMPLE CAPTURES                                                │ │
│ │ Stage: Stage 1 (Networking) · Access: [Free · Local Install]             │ │
│ │ What you learn: Inspecting real DNS queries, TCP handshakes, HTTP text.  │ │
│ │ Link: [ Explore Sample PCAPs ↗ ] (wiki.wireshark.org/SampleCaptures)     │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ RESOURCE LIBRARY            │
│ Curated & Free Tools        │
│                             │
│ [Filter: All Stages ▾]      │
│                             │
│ ┌─────────────────────────┐ │
│ │ OverTheWire: Bandit     │ │
│ │ [Free · No Account]     │ │
│ │ Linux CLI & Permissions │ │
│ │ Stop at Level 15!       │ │
│ │ [ Open Website ↗ ]      │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ PortSwigger Academy     │ │
│ │ [Free · Account Needed] │ │
│ │ Web Security & OWASP    │ │
│ │ Start with Apprentice   │ │
│ │ [ Open Website ↗ ]      │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Wireshark Sample PCAPs  │ │
│ │ [Free · Local Tool]     │ │
│ │ Network Packet Triage   │ │
│ │ [ Open Website ↗ ]      │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

### Section 06: Weekly Pace & Sample Schedules
* **Anchor ID:** `#weekly-pace`
* **Section Purpose:** Provide realistic, actionable time-allocation benchmarks so free students can plan their preparation alongside school or board exams without burnout.
* **Student Key Question:** *“How many hours per week do I need, and how should I split my time?”*
* **Design Pattern:** 3-tier pace model cards + 40/40/20 study ratio guideline.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ WEEKLY PACE & SAMPLE SCHEDULES                                               │
│ Structured Pacing Models for Balanced Preparation                            │
│                                                                              │
│ THE 40 / 40 / 20 WEEKLY RULE:                                                │
│ • 40% Concept Study (Reading, documentation, architectural understanding)    │
│ • 40% Hands-On Labs (Executing commands, solving challenges in VMs)          │
│ • 20% Documentation & Review (Writing notes, documenting code & proofs)     │
│                                                                              │
│ ┌────────────────────────┬────────────────────────┬────────────────────────┐ │
│ │ PACE A: CASUAL         │ PACE B: FOCUSED        │ PACE C: INTENSIVE      │ │
│ │ 2 Hours / Week         │ 4 Hours / Week         │ 8 Hours / Week         │ │
│ ├────────────────────────┼────────────────────────┼────────────────────────┤ │
│ │ • Ideal during intense │ • Recommended standard │ • Fast-track sprint or │ │
│ │   Class 12 board prep. │   alongside studies.   │   vacation schedule.   │ │
│ │ • 1 weekend lab block. │ • 2 concept hrs + 2 lab│ • Daily 1 hr lab work +│ │
│ │ • ~20 weeks to complete│ • ~10 weeks to complete│   deep weekend audits. │ │
│ │   Foundations (St 0–1).│   Foundations.         │ • ~5 weeks to complete.│ │
│ └────────────────────────┴────────────────────────┴────────────────────────┘ │
│                                                                              │
│ Pacing is illustrative · Does not assume fixed months before unannounced exams│
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ WEEKLY PACE                 │
│ Study Time Models           │
│                             │
│ The 40/40/20 Rule:          │
│ • 40% Concept Reading       │
│ • 40% Hands-on Labs         │
│ • 20% Lab Notes & Proofs    │
│                             │
│ ┌─────────────────────────┐ │
│ │ Pace A: Casual (2 h/wk) │ │
│ │ For Class 12 board time │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Pace B: Focused (4 h/wk)│ │
│ │ Recommended standard    │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Pace C: Sprint (8 h/wk) │ │
│ │ Vacation or fast-track  │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

### Section 07: Proof-of-Work & Evidence Dossier
* **Anchor ID:** `#proof-of-work`
* **Section Purpose:** Guide students on compiling high-signal technical portfolios (satisfying WSAIS FAQ 22 standards) and avoiding generic, disqualified certificate claims.
* **Student Key Question:** *“What projects should I put in my portfolio, and what makes proof verifiable?”*
* **Design Pattern:** High-signal vs Anti-pattern matrix + Downloadable Markdown template preview.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ PROOF-OF-WORK & EVIDENCE DOSSIER                                             │
│ Building Verifiable Technical Work (WSAIS FAQ 22 Precedent)                  │
│                                                                              │
│ ┌──────────────────────────────────────┬───────────────────────────────────┐ │
│ │ HIGH-SIGNAL EVIDENCE (DO THIS)       │ DISQUALIFYING ANTI-PATTERNS (AVOID│ │
│ ├──────────────────────────────────────┼───────────────────────────────────┤ │
│ │ • Documented GitHub repo with        │ • Generic video course completion │ │
│ │   reproducible README & run commands │   certificates (Coursera/Udemy)   │ │
│ │ • Original CTF challenge writeups    │ • Forked/cloned repositories with │ │
│ │   explaining thought process & fix   │   only cosmetic wording edits     │ │
│ │ • Network packet capture analysis    │ • Automated vulnerability scanner │ │
│ │   reports with annotated PCAP logs   │   PDF exports (Nessus/Nmap dumps) │ │
│ │ • Responsible disclosure reports with│ • Unverifiable claims of hacking  │ │
│ │   acknowledgment confirmations       │   without legal authorization     │ │
│ └──────────────────────────────────────┴───────────────────────────────────┘ │
│                                                                              │
│ FREE RESOURCE: [ Copy Technical Writeup Markdown Template 📋 ]               │
│ Standardized template: Executive Summary, Setup, Reproduction Steps, Fix.    │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ PROOF-OF-WORK DOSSIER       │
│ Verifiable Evidence         │
│                             │
│ High-Signal Evidence:       │
│ • Public code repositories  │
│ • Reproducible README files │
│ • Original CTF writeups     │
│ • Packet capture logs       │
│                             │
│ What to Avoid:              │
│ • Course certificates       │
│ • Cloned GitHub repos       │
│ • Automated scanner dumps   │
│                             │
│ [ Copy Markdown Template 📋]│
└─────────────────────────────┘
```

---

### Section 08: Practice Exercises & Self-Checks
* **Anchor ID:** `#practice-tasks`
* **Section Purpose:** Immediate active-recall checks allowing students to test hands-on competence without commercial mock exams or unverified questions.
* **Student Key Question:** *“Can I solve real security and systems tasks right now?”*
* **Design Pattern:** 4 starter challenges with progressive reveal accordions (Hints & Solution) and explanation checklist.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ STARTER PRACTICE CHALLENGES                                                  │
│ Self-Paced Technical Tasks with Progressive Solution Hints                   │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ TASK 01: LINUX PERMISSIONS (STAGE 1)                                     │ │
│ │ Problem: In your VM, create a file that only its owner can read and write,│ │
│ │ while group members can only read, and others have zero permissions.     │ │
│ │ [ Reveal Hint 1: What octal notation represents rw-r-----? ]             │ │
│ │ [ Reveal Full Solution: chmod 640 filename ]                             │ │
│ │ Self-Check: [ ] I can explain what umask does to default permissions.    │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ TASK 02: HTTP CREDENTIAL EXTRACTION (STAGE 1)                            │ │
│ │ Problem: In a sample PCAP, filter for unencrypted POST requests and find │ │
│ │ plain-text login parameters.                                             │ │
│ │ [ Reveal Hint: Use Wireshark filter: http.request.method == "POST" ]     │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ TASK 03: CLIENT-SIDE VALIDATION BYPASS (STAGE 2)                         │ │
│ │ Problem: Bypass a disabled submit button on a local HTML form via DevTools│
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ Note: Timed mock tests withheld until official entrance exam format announced│
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ PRACTICE CHALLENGES         │
│ Hands-on Self Checks        │
│                             │
│ Task 1: Linux Permissions   │
│ Create file rw-r----- only. │
│ [ View Hint ▾ ]             │
│ [ View Solution: chmod 640 ▾│
│                             │
│ Task 2: Wireshark POST Log  │
│ Find plain-text passwords.  │
│ [ View Hint ▾ ]             │
│                             │
│ Task 3: Client Form Bypass  │
│ DevTools DOM manipulation.  │
│ [ View Hint ▾ ]             │
│                             │
│ Exam simulation notice:     │
│ Timed mocks pending official│
│ exam format notification.   │
└─────────────────────────────┘
```

---

### Section 09: Personalized Execution System (Paid Engine)
* **Anchor ID:** `#personal-plan`
* **Section Purpose:** Present the optional ₹199–₹299 paid execution workspace clearly and transparently, demonstrating that it adds personal execution structure without locking out the free core roadmap.
* **Student Key Question:** *“What is the paid plan, how much does it cost, and do I need it?”*
* **Design Pattern:** Comparison matrix (Free vs Paid ₹199–₹299) + Transparent pricing terms + Free core guarantee.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ PERSONALIZED EXECUTION SYSTEM                                                │
│ Turn the Free Roadmap into an Individualized Weekly Schedule                 │
│                                                                              │
│ ┌──────────────────────────────────────┬───────────────────────────────────┐ │
│ │ FREE CORE ROADMAP (100% FREE FOREVER)│ PAID EXECUTION SYSTEM (₹199 – ₹299│ │
│ ├──────────────────────────────────────┼───────────────────────────────────┤ │
│ │ • Complete 5-stage curriculum        │ • Everything in Free Core         │ │
│ │ • Public certainty & announcement bd │ • Personalized weekly task queue  │ │
│ │ • Curated resource directory & tags  │ • Gap-prioritized tool assignments│ │
│ │ • Free readiness diagnostic check    │ • Structured weekly checkpoints   │ │
│ │ • Generic sample study pace models   │ • Dynamic Rescheduling Engine    │ │
│ │ • Starter practice challenges        │   (recalibrate missed weeks easily│ │
│ │ • Public portfolio markdown template │ • 12-Month access & future updates│ │
│ └──────────────────────────────────────┴───────────────────────────────────┘ │
│                                                                              │
│ Transparent Terms: One-time payment (₹199–₹299) · Zero recurring subscriptions│
│ [ Preview My Personalized Execution Plan → ]                                 │
│                                                                              │
│ Free Guarantee: The full roadmap, diagnostic, and tools remain free forever. │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ EXECUTION SYSTEM            │
│ Optional Paid Workspace     │
│                             │
│ Free Forever:               │
│ • Full 5-stage roadmap      │
│ • All curated resources     │
│ • Free diagnostic check     │
│ • Practice challenges       │
│                             │
│ Paid Workspace (₹199–₹299): │
│ • Custom weekly task queue  │
│ • Gap-specific assignments  │
│ • Dynamic rescheduling      │
│   for missed study weeks    │
│ • 12-month access           │
│                             │
│ [ Preview My Plan → ]       │
└─────────────────────────────┘
```

---

### Section 10: Progress Tracking, Missed Weeks & Recovery
* **Anchor ID:** `#recovery-plan`
* **Section Purpose:** Eliminate applicant guilt and dropouts when academic exams or personal life disrupt study routines, providing clear reset protocols.
* **Student Key Question:** *“What should I do if I miss two or three weeks due to school exams?”*
* **Design Pattern:** The 60-Minute Emergency Routine + Step-by-step Resumption Protocol + Paid Engine preview.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ PROGRESS TRACKING & RECOVERY PROTOCOL                                        │
│ How to Handle Missed Weeks and Keep Momentum Without Burnout                 │
│                                                                              │
│ THE 60-MINUTE EMERGENCY ROUTINE (During High-Stress School Exams):            │
│ • Do not attempt new complex stages.                                         │
│ • Run 1 simple OverTheWire level or review 1 previously solved challenge.    │
│ • Goal: Keep command syntax and mental models warm in 15–20 minutes.        │
│                                                                              │
│ STEP-BY-STEP RESUMPTION PROTOCOL:                                            │
│ 1. Do NOT start over from Stage 0.                                           │
│ 2. Audit the last verified deliverable in your local checklist.              │
│ 3. Spend 30 minutes verifying your VM environment still runs.                │
│ 4. Resume from the next single atomic task.                                  │
│                                                                              │
│ Paid System Feature: One-click "Recalibrate Schedule" button automatically   │
│ rebalances remaining weekly hours without lost milestones.                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ RECOVERY PROTOCOL           │
│ Handling Missed Weeks       │
│                             │
│ 60-Min Exam Routine:        │
│ • No new heavy theory       │
│ • 15 min terminal review    │
│ • Keep muscle memory warm   │
│                             │
│ When Resuming:              │
│ • Never restart from zero   │
│ • Check last completed lab  │
│ • Resume next atomic task   │
│                             │
│ Paid workspace includes     │
│ 1-click schedule rebalancer.│
└─────────────────────────────┘
```

---

### Section 11: Preparation FAQ Centre
* **Anchor ID:** `#prep-faqs`
* **Section Purpose:** Provide clear, honest, direct answers to common student anxieties regarding math prerequisites, laptop specifications, and free resource viability.
* **Student Key Question:** *“Do I need a expensive gaming laptop or advanced coding skills to start?”*
* **Design Pattern:** Accordion/list of core technical preparation questions.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ PREPARATION FAQ CENTRE                                                       │
│ Clear Answers to Technical Preparation Questions                             │
│                                                                              │
│ Q1: Kitni programming aani chahiye shuru karne se pehle?                     │
│ A1: Zero programming is required for Stage 0 and Stage 1. Basic Python or C  │
│     is introduced gently during Stage 2 for simple automation scripts.       │
│                                                                              │
│ Q2: Kya expensive laptop ya gaming PC zaroori hai?                           │
│ A2: No. Any standard laptop with 4 GB to 8 GB RAM capable of running Linux   │
│     (via WSL2 or VirtualBox) is completely sufficient. No discrete GPU needed│
│                                                                              │
│ Q3: Kya free resources se poori preparation ho sakti hai?                    │
│ A3: Yes, 100%. The curated free platforms (OverTheWire, PortSwigger Academy, │
│     Wireshark, PicoCTF) provide world-class, industry-standard training.     │
│                                                                              │
│ Q4: Kya zero computer background wala student prepare kar sakta hai?        │
│ A4: Yes. Stage 0 is built specifically for absolute beginners to establish   │
│     command-line and filesystem fluency before security concepts.            │
│                                                                              │
│ Q5: Jab IIT Kanpur official entrance syllabus release karega, kya hoga?      │
│ A5: This roadmap will immediately update to reflect official announcements,  │
│     free of charge, with explicit cycle transition markers.                  │
│                                                                              │
│ Admission eligibility questions? [ See Pillar 2 Admission FAQs → ]           │
│                                  (/blueprints/b-cyber/admission#admission-faqs│
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ PREPARATION FAQS            │
│ Common Student Questions    │
│                             │
│ • Prior coding needed?      │
│   Zero for Stage 0 & 1.     │
│                             │
│ • Expensive laptop needed?  │
│   No. 4–8GB RAM PC is fine. │
│                             │
│ • Are free resources enough?│
│   Yes, 100% comprehensive.  │
│                             │
│ • Zero background starter?  │
│   Stage 0 covers basics.    │
│                             │
│ • Future syllabus update?   │
│   Updated free on release.  │
│                             │
│ [ Admission FAQs (Pillar 2)→│
└─────────────────────────────┘
```

---

### Section 12: Sources, Methodology & Update History
* **Anchor ID:** `#prep-sources`
* **Section Purpose:** Maintain institutional credibility, source transparency, and provide an open audit log of curriculum changes.
* **Student Key Question:** *“Where do these learning recommendations come from, and when was this last updated?”*
* **Design Pattern:** 2-column source registry + Update history log + Community correction link.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ SOURCES, METHODOLOGY & AUDIT LEDGER                                          │
│ Official Sources & Curatorial Standards                                      │
│                                                                              │
│ PRIMARY SOURCES:                                                             │
│ • Official IIT Kanpur WSAIS Portal: https://iitk.ac.in/wsais/b-cyber.php     │
│ • WSAIS Admission Circular FAQ 21, FAQ 22, FAQ 23, FAQ 25                    │
│ • Open Curricula: OverTheWire, PortSwigger Web Security, NIST NICE Framework │
│                                                                              │
│ UPDATE HISTORY LOG:                                                          │
│ • 14 Oct 2026: Pillar 3 Wireframe finalized with 5-stage progression.        │
│ • 14 Oct 2026: Confirmed JEE Main discontinuation per WSAIS FAQ 23 notice.   │
│ • 12 Oct 2026: Catalogued 8 hackathon technical domains observed in 2026.    │
│                                                                              │
│ Spotted an error or outdated link? [ Submit an Editorial Correction ↗ ]      │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ SOURCES & AUDIT LOG         │
│ Source Transparency         │
│                             │
│ Sources:                    │
│ • IIT Kanpur WSAIS Portal ↗ │
│ • WSAIS FAQs 21, 22, 23, 25 │
│ • NIST NICE & PortSwigger   │
│                             │
│ Last Verified: 14 Oct 2026  │
│ [ Submit Correction ↗ ]     │
└─────────────────────────────┘
```

---

### Section 13: Contextual Next-Step Gateway
* **Anchor ID:** `#prep-next`
* **Section Purpose:** Seamlessly route applicants to their next logical action based on their immediate intent (diagnostic, admission rules, or degree review).
* **Student Key Question:** *“Where should I go from here?”*
* **Design Pattern:** 4-card responsive gateway grid with clear intent badges.

#### Low-Fidelity Desktop Wireframe (≥ 1024 px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NEXT STEP DECISION GATEWAY                                                   │
│ Choose Your Next Immediate Milestone                                         │
│                                                                              │
│ ┌──────────────────────────┬──────────────────────────┬────────────────────┐ │
│ │ 1. CHECK STARTING POINT  │ 2. REVIEW ADMISSION RULES│ 3. DEGREE OVERVIEW │ │
│ │ Diagnose skill tier &    │ Understand PCM, age cuts,│ Review 2+2 model,  │ │
│ │ prioritize first gap.    │ attempts, and selection. │ campus labs & fees.│ │
│ │                          │                          │                    │ │
│ │ [ Take Free Diagnostic ] │ [ Go to Pillar 2 → ]     │ [ Go to Pillar 1 →]│ │
│ │   (#readiness-check)     │ (/b-cyber/admission)     │ (/blueprints/b-cyb)│ │
│ └──────────────────────────┴──────────────────────────┴────────────────────┘ │
│                                                                              │
│ Optional: [ Explore Personalized Execution Workspace (₹199–₹299) → ]         │
│           (#personal-plan)                                                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Low-Fidelity Mobile Wireframe (< 768 px)
```
┌─────────────────────────────┐
│ NEXT STEPS                  │
│ Choose Your Next Move       │
│                             │
│ ┌─────────────────────────┐ │
│ │ 1. Take Free Diagnostic │ │
│ │ Check your starting gap.│ │
│ │ [ Start Check ↓ ]       │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 2. Review Admission     │ │
│ │ Eligibility & selection.│ │
│ │ [ View Pillar 2 → ]     │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 3. Degree Overview      │ │
│ │ 2+2 model & curriculum. │ │
│ │ [ View Pillar 1 → ]     │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

* **No Mobile Sticky Bar:** Strictly non-sticky, in-flow layout on mobile viewports.

---

## 4. Cross-Section Traceability & Epistemic Matrix

| Section ID | Key Data Points & Scope | Source / Evidence | Status Taxonomy |
| :--- | :--- | :--- | :--- |
| `#prep-start` | Prep scope, cycle context, zero guarantee | WSAIS Records | `[Officially confirmed for selected cycle]` |
| `#roadmap-certainty` | JEE Main out; dedicated test; unannounced syllabus | WSAIS FAQ 23 | `[Officially announced for a future cycle]` |
| `#roadmap-summary` | 5-stage progression mental model | Curated Learning Arch | `[Guide recommendation, not an official requirement]` |
| `#readiness-check` | 6-parameter self-assessment diagnostic | Browser diagnostic | `[Guide recommendation, not an official requirement]` |
| `#roadmap-stages` | Stages 0–4 detailed curricula & deliverables | NIST NICE / Lab Std | `[Guide recommendation, not an official requirement]` |
| `#resource-library` | OverTheWire, PortSwigger, Wireshark, PicoCTF | Public platforms | `[Guide recommendation, not an official requirement]` |
| `#weekly-pace` | 40/40/20 rule, 2/4/8 hr weekly benchmarks | Curated pacing models | `[Guide recommendation, not an official requirement]` |
| `#proof-of-work` | Verifiable portfolio vs. weak certificates | WSAIS FAQ 22 | `[Officially confirmed for selected cycle]` |
| `#practice-tasks` | 4 starter challenges & hint accordions | Curated exercises | `[Guide recommendation, not an official requirement]` |
| `#personal-plan` | ₹199–₹299 execution system vs. free core | Product matrix | `[Product Architecture]` |
| `#recovery-plan` | 60-min emergency routine & resumption | Study habits protocol | `[Guide recommendation, not an official requirement]` |
| `#prep-faqs` | Coding reqs, hardware specs, free resources | Editorial guide | `[Guide recommendation, not an official requirement]` |
| `#prep-sources` | WSAIS portal, FAQs 21, 22, 23, 25 | Primary sources | `[Officially confirmed for selected cycle]` |
| `#prep-next` | Route gateways to Pillars 1 & 2, and diagnostic | Blueprint Architecture| `[Locked]` |

---

## 5. Architectural Alignment Check

1. **Sitemap Synchronization**:
   - Matches all 14 locked sections (Sec 00–13) in `docs/b-cyber-sitemap-and-ux-blueprint.md` line-for-line.
2. **Epistemic Certainty**:
   - Distinctly isolates confirmed announcements (FAQ 23: JEE Main discontinued, separate test announced) from 2026 historical precedents (6-hour New Core Lab hackathon, 8 security domains) and future uncertainties (exact syllabus, exam dates, question counts).
3. **Product Boundaries**:
   - Free core roadmap is 100% self-sufficient and never paywalled.
   - Paid engine (₹199–₹299) adds structured execution, dynamic rescheduling, and personalized queue management.
