# MASTER-SPEC: Module 3 — Authority System

## 1. What exactly is the Authority System?
The Authority System is an interactive execution engine that converts a beginner freelancer's raw offer into undeniable, honest credibility. It is a systematic process for generating specific, high-leverage proof assets and translating them into public-facing authority (profile and portfolio copy) without relying on past client work, fake testimonials, or fabricated results.

## 2. What specific problem does Module 3 solve?
Beginners have a "cold start" problem. Even with a sharp niche and a well-engineered offer (from Modules 1 and 2), they lack the trust markers required to get a prospect to respond or buy. When a prospect asks, "Who are you and why should I trust you?", the beginner currently has nothing to show. Module 3 solves this by defining exactly *what* to build to prove competence and *how* to present it.

## 3. Why must Module 3 exist after Offer Engineering?
You cannot prove competence in a vacuum. Proof must be engineered to support a specific claim. Because Module 2 defines the exact offer, deliverables, and mechanism, Module 3 can specifically target the credibility gaps inherent in *that exact offer*. Without Module 2, Module 3 would revert to generic "build a portfolio" advice.

## 4. What does the user have before entering Module 3?
The user enters with a validated Opportunity Map (Module 1: Service, Market, Niche, Positioning) and a complete Offer Blueprint (Module 2: Offer Type, Deliverables, Mechanism, Scope, Pricing). They have a theoretical business but zero public proof.

## 5. What is missing from the user's credibility before Module 3?
*   **Demonstrated Competence:** No visible proof they can execute the mechanism or deliver the service.
*   **Contextual Understanding:** No proof they understand the specific market's pain points.
*   **Professional Presentation:** A weak or generic social profile.
*   **Conversion Assets:** No portfolio or case studies to send a prospect.

## 6. What must exist when the user completes Module 3?
An **Authority Pack** containing:
1.  A chosen Authority Position and a Core Trust Promise.
2.  Three identified Credibility Gaps (what they must prove).
3.  Three execution-ready Proof Asset Briefs.
4.  Platform-agnostic Profile Copy (headline, bio, offer statement).
5.  Platform-agnostic Portfolio Copy (structured narrative, proof presentation).
6.  An action-based Publish Checklist.

## 7. What should Module 3 deliberately NOT try to solve?
*   It is **NOT** a content marketing calendar or "post every day on LinkedIn" strategy.
*   It is **NOT** a tutorial on *how* to do their actual skill (e.g., how to use Figma or Premiere).
*   It is **NOT** an automated website builder (we provide the copy and structure, they build it on Carrd/Notion).
*   It **MUST NEVER** generate fake testimonials, fake client names, or fabricated results.

## 8. How does Module 3 prepare the user for Module 4?
Module 4 is Outreach & Prospecting. Module 4 relies on the user having a destination to send prospects to (the portfolio/profile) and specific proof assets to leverage in cold messages ("I just did a teardown on X..."). Module 3 provides the literal links and credibility context that Module 4's outreach templates will dynamically insert.

## 9. What is the strategic theory behind the module?
**Offer → Proof → Credibility → Presentable Authority.**
Honest proof beats fake experience. If a beginner cannot show past client results, they must show *present capability*. By adopting an Authority Position (like The Auditor or The Builder), a beginner can create self-initiated proof that directly demonstrates their mechanism in action, effectively de-risking the purchase for the buyer.

## 10. What would make Module 3 fail as a product?
*   Generating vague advice like "Build 3 projects for your portfolio."
*   Creating generic assets that do not map specifically to the Module 2 offer.
*   Encouraging dishonest claims.
*   Generating overwhelming content requirements (e.g., a 20-page website) rather than a lean, high-conversion presentation.

---

# FINAL STEP FLOW

### Step 1 — Authority Position
*   **Purpose:** Decide HOW the user will demonstrate credibility without past clients.
*   **Output:** Selected position (The Builder, The Auditor, The Deconstructor, The Practitioner) and a Core Trust Promise.

### Step 2 — Proof Strategy
*   **Purpose:** Identify 3 credibility gaps / proof priorities based on the user's specific offer and market, and recommend the best proof asset format for each priority.
*   **Output:** 3 distinct Credibility Gaps linked to 3 Recommended Proof Formats.

### Step 3 — Proof Asset Builder
*   **Purpose:** Generate the exact blueprints for the user's proof projects based on the selected formats.
*   **Output:** 3 highly detailed, execution-ready Proof Asset Briefs.

### Step 4 — Profile + Portfolio Authority
*   **Purpose:** Turn the offer and proof into a platform-agnostic public presentation.
*   **Output:** 7-field Profile Copy and dynamic Portfolio Section Copy.

### Step 5 — Authority Pack + Publish Checklist
*   **Purpose:** Compile all outputs into a single, actionable execution package.
*   **Output:** The compiled Authority Pack, an action-based checklist, and Markdown export functionality.

---

# MODULE 4 BRIDGE

When the user completes Module 3 and transitions to Module 4, the following data is explicitly passed to the Module 4 state:
1.  `authorityPosition`: The chosen archetype (influences outreach tone).
2.  `coreTrustPromise`: The fundamental honest reason the prospect should trust them.
3.  `proofPriorities`: The top 3 credibility gaps selected.
4.  `proofAssets`: Summary array containing `{ id, title, assetType, credibilityGap, completionStatus, link? }`.
5.  `authorityReadiness`: Completion status boolean.
6.  `professionalHeadline`: Profile headline.
7.  `offerStatement`: Profile offer statement.
8.  `proofReferenceLine`: Profile proof reference.
9.  `ctaLine`: Profile CTA line.
10. `portfolioCta`: Portfolio CTA.
11. `profileUrl`: Optional string (published location of profile).
12. `portfolioUrl`: Optional string (published location of portfolio).
