# 🧭 B.Cyber Compass — Pillar 1: Detailed Content & Wireframe Analysis Report
**Route:** `/blueprints/b-cyber` | **Stage:** Pillar 1 — Understand  
**Target Audience:** Prospective students (Class 12th PCM, droppers, 1st-year college students) and their parents  
**Source Code Baseline:** `src/pages/blueprints/b-cyber/BCyberHomePage.tsx`  
**Purpose:** Hand-off dossier for specialized content writers, UX editors, and SEO strategists to audit, refine, and calibrate all section messaging and structural layouts.

---

## 🏛️ Executive Information Architecture & Strategic Intent

Pillar 1 is **not an admission portal duplicate, nor is it a promotional blog post**. It is an authoritative **software-grade orientation compass**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PILLAR 1: INFORMATION ARCHITECTURE FLOW                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Sec 0: Hero & Jump Chips] ──► Orient status & provide 1-click jumps for informed users│
│         │                                                                              │
│ [Sec 1: 30-Sec Summary]    ──► Google Featured Snippet / AEO direct answer in 40 words │
│         │                                                                              │
│ [Sec 2: Key Facts Grid]    ──► 4 foundational pillars (Senate degree, 2+2, WSAIS, no salaries)
│         │                                                                              │
│ [Sec 3: 2+2 Model Stepper] ──► Visual timeline: 2 yrs on-campus + 2 yrs field deployment│
│         │                                                                              │
│ [Sec 4: 4-Sem Curriculum]  ──► Deep-dive coursework (197-201 cr) + 5 mandatory cyber labs│
│         │                                                                              │
│ [Sec 5: Beyond Hacking]    ──► 5 real cyber disciplines (OS, Crypto, Forensics, Networks, Psychology)
│         │                                                                              │
│ [Sec 6: Degree Comparison] ──► Objective B.Cyber vs conventional B.Tech CSE matrix     │
│         │                                                                              │
│ [Sec 7: Fit Self-Check]    ──► Dual archetype cards (Ideal Candidate vs Chasing Tag)  │
│         │                                                                              │
│ [Sec 8: Degree Recognition]──► Senate ordinances: IIT alumni status, global MS/PhD parity│
│         │                                                                              │
│ [Sec 9: Internship Truth]  ──► Field practicum details (host orgs, stipend variability)│
│         │                                                                              │
│ [Sec 10: Myths vs Facts]   ──► 5 viral coaching misconceptions debunked with evidence  │
│         │                                                                              │
│ [Sec 11: Common FAQs]      ──► 8 essential accordions categorized by topic             │
│         │                                                                              │
│ [Sec 12: Source Citations] ──► Editorial disclosure, primary WSAIS URLs & Senate date  │
│         │                                                                              │
│ [Sec 13: Decision Gateway] ──► Dual high-intent CTAs to Pillar 2 (Admission) & Pillar 3 (Roadmap)
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📑 Section-by-Section Wireframe & Content Specifications

---

### Section 0: Hero & Fast-Track Route Jump
* **Anchor ID:** `#overview-start`
* **Canonical Role:** Establishes instant institutional credibility, grounds the visitor, and prevents forcing a linear reading order.
* **Target Emotional State:** Overwhelmed student searching on Google ➔ Relieved to find transparent, grounded clarity.

#### 1. Wireframe Layout (Desktop ≥ 1024px vs Mobile < 768px)
* **Desktop:** Centered editorial stack. Trust stamp pill at top ➔ 2-line tight tracking display H1 ➔ 2-line explanatory subtitle ➔ 4-column metric grid (`ENTRANCE`, `CREDENTIAL`, `ARCHITECTURE`, `LAB TRAINING`) ➔ 2-button centered action pill bar.
* **Mobile:** Stacked layout with 2x2 metric grid, full-width pill buttons.

#### 2. Exact Verbatim Wording & Microcopy
* **Trust Stamp Pill:**
  > `[Pulse Emerald Dot]` *"Independent Guide · Based on Official IIT Kanpur Senate & WSAIS Records"*
* **Headline (H1):**
  > **What Is IIT Kanpur B.Cyber?**  
  > *Degree Structure, Curriculum & Ground Truth*
* **Subtitle Body:**
  > *"India's premier practice-oriented undergraduate degree. Verified Senate ordinances, the distinctive 2+2 model, and official IITK WSAIS data."*
* **4-Card Metric Grid Content:**
  1. `ENTRANCE` | **No JEE Advanced Req** | *Separate Test · 12th PCM*
  2. `CREDENTIAL` | **IIT Alumni Status** | *Official 4-Year B.Cyber Degree*
  3. `ARCHITECTURE` | **2-Yr Field Practicum** | *Critical Cyber & Defense Units*
  4. `LAB TRAINING` | **5 Live Cyber Labs** | *Sem 1 Malware & Exploit Dev*
* **Action Buttons:**
  * Primary Button (Navy `#0b1c30`): `Free Preparation Roadmap (Pillar 3) →`
  * Secondary Button (White/Border): `Admission & 2027 Shift (Pillar 2) →`

#### 3. Writer's Strategic Audit
* *Tone Check:* Calm, confident, objective.
* *Do Not:* Add hyperbolic adjectives like "revolutionary", "game-changing", or "miraculous".
* *Key Hook:* Prominently mentioning "No JEE Advanced Req" addresses the #1 initial hurdle for Class 12 PCM students.

---

### Section 1: B.Cyber in 30 Seconds (Direct-Answer First)
* **Anchor ID:** `#quick-answer`
* **Canonical Role:** Answer-Engine Optimization (AEO/GEO). Engineered to win the Google Featured Snippet for queries like *"What is B.Cyber degree?"* or *"IIT Kanpur cybersecurity undergraduate program"*.

#### 1. Wireframe Layout
* Single elevated card (`rounded-3xl bg-white border border-slate-200/90`).
* Top metadata row (eyebrow tag + timestamp/scope indicator) ➔ Bold H2 ➔ 1 clear paragraph (40–60 words) ➔ 3-column micro-spec row ➔ Hyperlinked source anchor.

#### 2. Exact Verbatim Wording & Microcopy
* **Eyebrow:** `Direct Answer First` • *Official Institutional Summary*
* **Heading (H2):**
  > **What is IIT Kanpur B.Cyber?**
* **Direct Answer Paragraph:**
  > *"IIT Kanpur's **B.Cyber (Bachelor of Cybersecurity)** is a four-year undergraduate degree program administered by the Wadhwani School of AI and Intelligent Systems (WSAIS). Approved under dedicated Senate ordinances, its structure comprises **two years of intensive on-campus coursework** at IIT Kanpur followed by a **two-year practical field deployment** in key national defense and cybersecurity agencies. Students who successfully complete the program receive the official B.Cyber degree and regular IIT Kanpur alumni status."*
* **3-Column Micro-Spec Cards:**
  1. `Award & Standing` | **Official 4-Yr Degree & IIT Alumni**
  2. `Curriculum Model` | **2 Yrs Campus + 2 Yrs Field Practicum**
  3. `Ecosystem Host` | **WSAIS & C3iHub · Joint with IITM**
* **Source Anchor:**
  > *"Official source: IIT Kanpur WSAIS B.Cyber Portal ↗"* (`https://iitk.ac.in/wsais/b-cyber.php`)

---

### Section 2: Program at a Glance (Key Facts Matrix)
* **Anchor ID:** `#key-facts`
* **Canonical Role:** The unshakeable factual foundation of the degree. Disarms false coaching claims regarding salaries and eligibility.

#### 1. Wireframe Layout
* Section Header (Eyebrow + H2 + Subtitle) ➔ Balanced 2x2 responsive card grid.
* Each card features an index badge (`01`–`04`), status tag, title, and 3 structured micro-rows with check icons.

#### 2. Exact Verbatim Wording & Microcopy
* **Header Stack:**
  * Eyebrow: `Verified Data`
  * H2: **IIT Kanpur B.Cyber: Key Facts**
  * Subtitle: *"Published program parameters verified against official IIT Kanpur Senate records."*
* **Card 1: Degree Award**
  * Tag: `Regular IIT Alumni`
  * Title: **Bachelor of Cybersecurity (B.Cyber.)**
  * Micro-rows:
    * *Alumni Standing:* Full regular IIT alumni status with identical convocation rights and alumni association membership.
    * *Global Parity:* 100% recognized equivalence for international MS and Ph.D. admissions worldwide (WSAIS FAQ 9).
    * *Senate Award:* Four-year undergraduate degree conferred under official IIT Kanpur Senate regulations.
* **Card 2: Pedagogical Model**
  * Tag: `2+2 Architecture`
  * Title: **2 Yrs Campus Labs + 2 Yrs Field Practicum**
  * Micro-rows:
    * *Campus Phase:* Semesters 1–4 deliver intensive theory and 5 hands-on live security labs (Malware, VAPT, Forensics) at IITK.
    * *Field Deployment:* Semesters 5–8 practical placement in defense intelligence agencies and critical national infrastructure.
    * *Branch Lock:* Transfer into regular B.Tech is strictly prohibited by Senate ordinances (WSAIS FAQ 12).
* **Card 3: Host Ecosystem**
  * Tag: `Apex MoE Centers`
  * Title: **WSAIS & C3iHub National Hub**
  * Micro-rows:
    * *Host School:* Anchored at the Wadhwani School of AI and Intelligent Systems (WSAIS) at IIT Kanpur.
    * *Apex Cyber Hub:* Technically supported by C3iHub — India's apex Cybersecurity Innovation Hub.
    * *Joint Offering:* Offered in close partnership with IIT Madras sharing identical academic curriculum and rigor.
* **Card 4: Career Reality**
  * Tag: `First Passout: 2030`
  * Title: **Zero Historical Salary Statistics**
  * Micro-rows:
    * *Cohort Timeline:* Inaugural cohort enrolled in July 2026; the very first graduating class will pass out in 2030.
    * *Fact Check:* Beware coaching claims — any past packages or median CTC figures quoted online are fictional.
    * *Career Support:* Dedicated WSAIS career assistance channel is provided to all program completers (WSAIS FAQ 14).

---

### Section 3: The 4-Year, 2+2 Model (Visual Stepper & Timeline)
* **Anchor ID:** `#model-2plus2`
* **Canonical Role:** Demystifies the core pedagogical innovation of the degree—why it is 2 years on campus and 2 years in field deployment.

#### 1. Wireframe Layout
* Stepper progress bar: Stage 1 Box (`01 Phase 1: Sem 1–4`) ➔ Center Milestone Gate (`200 Cr Clearance`) ➔ Stage 2 Box (`02 Phase 2: Sem 5–8`).
* 2-column detailed breakdown comparing Campus Rigor vs Field Practicum ➔ Senate Exit Option pills bar (`150 Cr Certificate`, `200 Cr Diploma`, `Full Degree`).

#### 2. Exact Verbatim Wording & Microcopy
* **Header Stack:**
  * Eyebrow: `Academic Architecture`
  * H2: **How Does the IIT Kanpur B.Cyber 2+2 Model Work?**
  * Subtitle: *"The four years are divided into two distinct pedagogical phases approved by the Senate."*
* **Phase 1 Content:**
  * Title: *Years 1–2: On-Campus Core Computing & 5 Live Labs*
  * Details: 197–201 credits across computing, OS, networking, cryptography, and 5 mandatory technical labs.
* **Phase 2 Content:**
  * Title: *Years 3–4: Field Deployment & Defense Practicum*
  * Details: 216 credits dedicated to practical deployment in CERT-In, defense agencies, and research hubs.
* **Senate Exit Options Breakdown:**
  * *150 Credits:* Certificate in Cybersecurity
  * *200 Credits:* Diploma in Cybersecurity
  * *Full 4 Years:* Official Bachelor of Cybersecurity (B.Cyber.) Degree

---

### Section 4: Curriculum and Subjects (Semesters 1 to 4)
* **Anchor ID:** `#curriculum`
* **Canonical Role:** Provides the complete semester-by-semester course syllabus and credit allocation. Solves the immense student confusion over *"What will I study in Year 1 and Year 2?"*.

#### 1. Wireframe Layout
* Semester Tab switcher (`Semester 1`, `Semester 2`, `Semester 3`, `Semester 4`) with credit badges.
* Subject list with category tags (`Core Theory`, `Security Lab`, `Humanities`, `Elective`).
* Highlight banner for the **5 Prescribed 8-Credit Live Security Labs**.

#### 2. Exact Verbatim Wording & Microcopy
* **Header Stack:**
  * Eyebrow: `Senate Syllabus`
  * H2: **Semester-by-Semester Curriculum (Years 1 & 2)**
  * Subtitle: *"Official course listings, credit weights, and laboratory requirements approved by IIT Kanpur Senate."*
* **Detailed Course Listings:**
  * **Semester 1 (51 Credits):**
    * Fundamentals of Computing (14 Credits)
    * Introduction to Electronics (14 Credits)
    * Fundamentals of Data Engineering — Data (12 Credits)
    * **Lab: Malware Analysis (8 Credits)** — *Static & dynamic malware inspection*
    * Practical Ethics (3 Credits)
  * **Semester 2 (52 Credits):**
    * Data Structures and Algorithms — DSA (12 Credits)
    * Computer Organization (12 Credits)
    * Applied Cryptography (9 Credits)
    * **Lab: Digital Forensics (8 Credits)** — *Artifact extraction & disk forensics*
    * Predefined Elective (11 Credits)
  * **Semester 3 (50 Credits):**
    * Operating Systems (13 Credits)
    * Fundamentals of Data Engineering — Ops (12 Credits)
    * **Lab: Cloud Computing & Security (8 Credits)**
    * **Lab: Vulnerability Assessment & Pen Testing — VAPT (8 Credits)**
    * Departmental Elective (9 Credits)
  * **Semester 4 (46 Credits):**
    * Introduction to Psychology (11 Credits) — *Social engineering & insider threats*
    * Computer Networks (9 Credits)
    * **Lab: Network & Web Application Security (8 Credits)**
    * Two Predefined Electives (18 Credits)

---

### Section 5: Beyond Hacking: What Cybersecurity Actually Covers
* **Anchor ID:** `#beyond-hacking`
* **Canonical Role:** Dispels the adolescent view that cybersecurity is just "running scripts and Kali Linux". Grounds cybersecurity in real computer science.

#### 1. Wireframe Layout
* 5-card horizontal/vertical layout representing the 5 core foundational pillars.
* Each card includes an icon, title, description, and real-world defense application.

#### 2. Exact Verbatim Wording & Microcopy
* **Header Stack:**
  * Eyebrow: `Scope & Discipline`
  * H2: **Beyond Hacking: The 5 Pillars of Real Cybersecurity**
  * Subtitle: *"Why B.Cyber is rigorous systems engineering, not quick penetration scripts."*
* **5 Pillars:**
  1. **Systems & Kernel Security:** Memory safety, buffer overflows, process sandboxing, Linux kernel hooks.
  2. **Network Protocol Architecture:** TCP/IP state machines, packet analysis, DNS protocol security, firewall engineering.
  3. **Mathematical Cryptography:** Public-key infrastructure (PKI), elliptic curves, hash functions, post-quantum cryptography.
  4. **Forensics & Incident Response:** Disk imaging, volatile RAM extraction, malware artifact reverse engineering.
  5. **Human Factors & Social Engineering:** Psychology of deception, phishing vector analysis, organizational security governance.

---

### Section 6: Balanced Degree Comparison (B.Cyber vs Conventional CSE)
* **Anchor ID:** `#degree-comparison`
* **Canonical Role:** Provides an objective, side-by-side comparative table against standard 4-year B.Tech CSE degrees.

#### 1. Wireframe Layout
* Comparison Matrix table with 6 evaluation criteria rows and 2 columns (`B.Cyber.` vs `Conventional B.Tech CSE`).

#### 2. Exact Verbatim Wording & Microcopy
* **Header Stack:**
  * Eyebrow: `Program Comparison`
  * H2: **B.Cyber vs Conventional B.Tech Computer Science**
  * Subtitle: *"An objective comparison to help you choose the right path for your career goals."*
* **Comparison Criteria Table:**
  * **Primary Focus:** Specialized defensive/offensive security & systems vs General software development, web & apps.
  * **Curriculum Structure:** 2 Years On-Campus + 2 Years Field Practicum vs 4 Years continuous campus lectures.
  * **Laboratory Depth:** 5 Dedicated 8-credit live security labs vs General programming and software labs.
  * **Industry Practicum:** 2-Year embedded deployment in defense/govt infra vs Standard 2-month summer internship.
  * **Higher Studies Eligibility:** 100% equivalent (eligible for MS/PhD in India and abroad) vs 100% equivalent.
  * **Historical Placement Data:** Cohort starts 2026 (Zero historical data) vs Decades of established batch trends.

---

### Section 7: Is B.Cyber Right for You? (Fit & Self-Reflection)
* **Anchor ID:** `#fit-check`
* **Canonical Role:** Interactive self-qualification. Saves unqualified students from making a 4-year mistake and builds deep trust with high-fit candidates.

#### 1. Wireframe Layout
* Dual Archetype Cards: Column 1 (Strong Fit, Emerald tone) vs Column 2 (Reconsider, Amber tone).
* Interactive 3-checkbox reflection prompt yielding an instant fit evaluation.

#### 2. Exact Verbatim Wording & Microcopy
* **Header Stack:**
  * Eyebrow: `Fit & Profile Assessment`
  * H2: **Who Should Consider IIT Kanpur B.Cyber?**
  * Subtitle: *"Assess your genuine technical interest and mindset before committing to a specialized 4-year degree."*
* **Column 1: Strong Alignment (Ideal Candidate)**
  * *Low-Level Systems Curiosity:* Fascinated by protocols, Linux shell, packet structures, and memory layouts.
  * *Reverse-Engineering Grit:* Willing to spend 6 hours debugging a binary or network trace without losing patience.
  * *Defense & National Service:* Eager to work in critical defense intelligence and public infrastructure.
* **Column 2: Poor Alignment (Think Carefully If...)**
  * *Only Chasing IIT Tag:* Want an IIT degree solely for social prestige without interest in security.
  * *Expecting Generic Full-Stack Dev:* Expecting to build React websites or generic consumer apps.
  * *Demanding Immediate Salary Guarantees:* Expecting a fixed 50 LPA placement package without proven merit.

---

### Section 8: Degree Award, Recognition & Higher Studies
* **Anchor ID:** `#degree-recognition`
* **Canonical Role:** Covers formal legal recognition, UGC/Senate status, and international graduate study validity.

#### 1. Wireframe Layout
* 3-column feature grid (`Official Degree Award`, `Alumni Privileges`, `Global Higher Studies`) + Alert Note box on branch transfer.

#### 2. Exact Verbatim Wording & Microcopy
* **Header Stack:**
  * Eyebrow: `Credential Parity`
  * H2: **What Degree Do You Get After B.Cyber?**
  * Subtitle: *"Official institutional standing and global higher-education equivalence."*
* **Card Details:**
  1. `Official Degree Award:` Bachelor of Cybersecurity (B.Cyber.) conferred directly under IIT Kanpur Senate regulations.
  2. `Alumni Privileges:` Full IIT Kanpur alumni standing upon successful graduation.
  3. `Global Higher Studies:` 100% eligibility parity for MS, M.Tech, and Ph.D. admissions worldwide (WSAIS FAQ 9).
* **Critical Institutional Warning Note:**
  > *"Branch change into regular B.Tech is strictly prohibited by Senate ordinance (FAQ 12). Alumni status is granted upon successful degree completion, not at the start of field practicum."*

---

### Section 9: Internship, Stipend & Placement Reality
* **Anchor ID:** `#internship-reality`
* **Canonical Role:** Insider transparency on how the 2-year practical field deployment actually works.

#### 1. Wireframe Layout
* Split 2-column comparative layout: *Published Institutional Provisions* vs *Common Speculations Debunked*.

#### 2. Exact Verbatim Wording & Microcopy
* **Header Stack:**
  * Eyebrow: `Career & Deployment Truth`
  * H2: **What Does the Internship and Career Picture Actually Look Like?**
  * Subtitle: *"Separating published institutional provisions from unverified marketing assumptions."*
* **Published Provisions Summary:**
  * Semesters 5 through 8 (54 credits each) represent full-time practical work in selected organizations.
  * Host organizations primarily include defense agencies, CERT-In, NCIIPC, and national research centres.
  * Stipend policies: Paid directly by host organizations; varying financial provisions; not guaranteed fixed wages.
  * Continuous IIT student enrollment status maintained throughout all 4 years.

---

### Section 10: Common Misconceptions (Myth vs. Fact)
* **Anchor ID:** `#myths-vs-facts`
* **Canonical Role:** High-velocity search capture. Targets long-tail keywords typed by confused parents and students on forums.

#### 1. Wireframe Layout
* 2-column responsive grid containing 5 myth/fact card blocks + 1 FAQ directory anchor card.

#### 2. Exact Verbatim Wording & Microcopy
* **Card 1: Entry Pathway**
  * Myth: *"You need a top rank in JEE Advanced to get into B.Cyber."*
  * Fact: *JEE Advanced is not required. The program conducts its own entrance test and practical selection.*
* **Card 2: Syllabus Depth**
  * Myth: *"It's just an ethical hacking coaching course with an IIT tag."*
  * Fact: *It is a full 4-year university engineering degree covering advanced mathematics, OS, cryptanalysis, and data engineering.*
* **Card 3: Degree Equivalence**
  * Myth: *"Since it's B.Cyber and not B.Tech, you cannot pursue an MS abroad."*
  * Fact: *Senate ordinances explicitly confirm 100% equivalence for higher studies (MS/Ph.D.) worldwide (FAQ 9).*
* **Card 4: Employment Guarantee**
  * Myth: *"IIT Kanpur guarantees a 30 LPA placement package after graduation."*
  * Fact: *No batch has graduated yet (cohort began July 2026). Dedicated career assistance is provided, but salary claims are unverified.*
* **Card 5: Branch Change**
  * Myth: *"I can join B.Cyber and slide into B.Tech Computer Science in second year."*
  * Fact: *Branch transfer between B.Cyber and standard B.Tech is strictly prohibited under Senate ordinances.*

---

### Section 11: Frequently Asked Questions (Accordion Matrix)
* **Anchor ID:** `#common-faqs`
* **Canonical Role:** Direct plain-text answers to student and family anxieties with collapsible drawers.

#### 1. Wireframe Layout
* Categorized accordion list with plus/minus toggles and smooth vertical height expansion.

#### 2. Exact Verbatim Wording & Microcopy
* **Header Stack:**
  * Eyebrow: `Direct Answers`
  * H2: **Frequently Asked Questions**
  * Subtitle: *"Clear, direct answers to common student and family questions."*
* **Core Accordion Items:**
  1. **Q: Is B.Cyber a regular on-campus degree?**  
     *A:* Yes. The first two years are conducted full-time on the IIT Kanpur campus with full hostel and campus facility rights.
  2. **Q: Can I change branches to B.Tech CSE later?**  
     *A:* No. Senate ordinances strictly forbid branch transfer into regular B.Tech or vice-versa.
  3. **Q: Will I get regular IIT Kanpur alumni status?**  
     *A:* Yes. Successful graduates receive the B.Cyber degree and official alumni association status.
  4. **Q: Do I need JEE Advanced for admission?**  
     *A:* No. Admission is conducted via a dedicated selection process, not JEE Advanced.
  5. **Q: Are open schooling (NIOS) students eligible?**  
     *A:* Yes, provided they passed Class 12 with Physics, Chemistry, and Mathematics.
  6. **Q: Are stipends guaranteed during the 2-year field deployment?**  
     *A:* No. Stipends depend on the host organization's institutional policies.
  7. **Q: What is the maximum duration permitted to finish the degree?**  
     *A:* Maximum 6 years under Senate extension ordinances.
  8. **Q: Is this degree valid for government examinations (GATE, UPSC)?**  
     *A:* Yes, fully recognized as a 4-year undergraduate degree.

---

### Section 12: Editorial Transparency & Verified Sources
* **Anchor ID:** `#official-sources`
* **Canonical Role:** Establishes independent journalistic integrity. Separates this platform from shady coaching agencies.

#### 1. Wireframe Layout
* Clean border box containing external verified links, date stamp, and legal disclaimer banner.

#### 2. Exact Verbatim Wording & Microcopy
* **Header Stack:**
  * Eyebrow: `Transparency`
  * H2: **Sources, Verification and Editorial Standards**
  * Subtitle: *"All information is cross-referenced with primary institute publications."*
* **Content:**
  * Primary URLs linked: `IIT Kanpur WSAIS Portal` & `Official Program Senate Circular`.
  * Last verification date: **12 October 2026**.
  * Editorial Stamp: *Published by B.Cyber Compass Independent Research*.
  * Disclaimer: Not affiliated with or endorsed by IIT Kanpur.

---

### Section 13: Next Step Decision Gateway (P2 / P3 Dual CTA)
* **Anchor ID:** `#next-steps`
* **Canonical Role:** The high-conversion conclusion of Pillar 1. Channels the educated visitor into checking their admission eligibility (Pillar 2) or starting preparation (Pillar 3).

#### 1. Wireframe Layout
* Solid deep navy container (`bg-slate-900 text-white rounded-2xl p-8 sm:p-10`).
* Left column (Eyebrow + H2 + description) ➔ Right column (Dual primary action pills).

#### 2. Exact Verbatim Wording & Microcopy
* **Eyebrow:** `Next Decision`
* **Heading (H2):** **Now That You Understand B.Cyber, What's Next?**
* **Body:**
  > *"Check whether you satisfy official admission eligibility, or jump directly to the preparation roadmap to build verifiable proof of work."*
* **Primary Button (Lime `#d1f34d`):** `Check Admission & Eligibility →` (leads to Pillar 2)
* **Secondary Button (Ghost White):** `Explore Preparation Roadmap` (leads to Pillar 3)

---

## 🎯 Content Writer & Editor Action Items

When reviewing and writing for Pillar 1, focus on these 4 optimization levers:
1. **Preserve Epistemic Rigor:** Never guarantee future cutoffs, stipends, or placement salaries. Maintain strict alignment with Senate FAQ records.
2. **Sharpen Cognitive Contrast:** Make sure headings clearly signal *“What this means for YOU”* rather than dry administrative jargon.
3. **Enhance Search Intent (GEO/AEO):** Ensure the 30-second summary and Myth/Fact cards remain formatted in clean question-and-answer pairs for search crawlers.
4. **Tone Balance:** Maintain a calm, senior-architectural mentorship voice—encouraging, objective, and realistic.

