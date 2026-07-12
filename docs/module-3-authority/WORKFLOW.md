# WORKFLOW: Module 3 — Authority System

## Step 1 — Authority Position

*   **Objective:** Decide HOW the user will demonstrate credibility without relying on past client results.
*   **Strategic Reason:** Beginners freeze because they think "proof = client testimonials". We must give them a valid, professional framework for self-initiated proof to unblock them.
*   **User Question Being Answered:** "How do I prove I'm good if nobody has hired me yet?"
*   **Inputs:** Module 1 Service, Module 2 Mechanism.
*   **Choices (The 4 Archetypes):**
    1.  **The Builder:** Creates conceptual/spec projects from scratch. (Best for: Design, Dev, Copy).
    2.  **The Auditor:** Finds flaws in public-facing businesses and maps solutions. (Best for: SEO, CRO, Ads, Systems).
    3.  **The Deconstructor:** Analyzes highly successful businesses/campaigns to explain why they work. (Best for: Strategy, Marketing).
    4.  **The Practitioner:** Documents their own internal process/experiments applied to their own business. (Best for: Ops, Automations, Content).
*   **Branching Logic:** The system analyzes the Service and Mechanism and *recommends* the single best archetype, while allowing the user to select any of the 4.
*   **Validation:** Must select exactly 1 position.
*   **Exact Stored State:** `authorityPosition` (enum), `coreTrustPromise` (string), `authorityPositionRationale` (string).
*   **Final Step Output:** The confirmed Authority Position and Core Trust Promise. The `coreTrustPromise` explicitly answers: "What honest reason should a prospect have to believe I understand this problem?" without using fake metrics, fake client claims, or unsupported superlatives.
*   **UI Pattern:** 4 large selectable cards. The recommended card has a "Best for your Offer" badge. Clicking a card expands a detailed preview of what this looks like in practice.
*   **Common User Mistakes:** Picking a position that doesn't fit their service (e.g., a backend dev picking "The Auditor" when backend code isn't public).
*   **Edge Cases:** Highly obscure services where none perfectly fit (default to The Builder).
*   **Why this step comes first:** It dictates the format of the proof assets in Step 3.

---

## Step 2 — Proof Strategy

*   **Objective:** Identify 3 credibility gaps (proof priorities) based on the user's specific offer and market, and recommend the best proof asset format to solve each gap.
*   **Credibility-Gap Logic:** Buyers have specific doubts based on the service and market. An enterprise software buyer doubts security and scale; a creator doubts voice matching and turnaround time.
*   **How Priorities are Selected:** The system cross-references Module 1 Market with Module 2 Offer Type. It generates 5 potential gaps, selects the top 3, and recommends a specific proof format for each.
*   **Proof Formats:** Demonstration project, audit, teardown, rebuild, process evidence, annotated analysis, technical demonstration.
*   **Flow:** `Credibility Gap → Recommended Proof Format → Proof Asset`
*   **User Choices:** The user is presented with the 3 recommended gaps and their suggested formats. They can accept them, swap them from an alternate list, change the format, or write a custom gap.
*   **Validation:** Exactly 3 gaps and 3 formats must be finalized. Custom gaps must be > 10 chars.
*   **Exact State:** `proofPriorities` (array of 3 objects: `{ id, gapTitle, gapDescription, recommendedFormat, isCustom }`).
*   **Output:** A finalized list of the 3 credibility gaps and the format the user will use to prove each one.
*   **UI:** A list of 3 priority slots. Each slot displays the Gap and a dropdown for the Format, with a "Swap" button for alternatives.
*   **Why this exists separately from Asset Builder:** It forces the user to agree on the *strategic goal* of the proof and the *format* before getting lost in the *tactics* of what to build.

---

## Step 3 — Proof Asset Builder

*   **Objective:** Generate 3 execution-ready proof asset briefs based on the selected formats.
*   **Generation Logic:** 
    *   Asset 1 targets Priority 1, using the selected Proof Format.
    *   Asset 2 targets Priority 2, etc.
*   **Allowed Honest Formats:** Spec work, teardown, annotated audit, process walkthrough, technical demo. No fake results.
*   **For EACH Proof Asset, define exactly:**
    *   `title`: Catchy, professional project name.
    *   `assetType`: The format selected in Step 2.
    *   `targetAudience`: Specific buyer persona.
    *   `credibilityGapProved`: Mapped from Step 2.
    *   `businessProblem`: The hypothetical or real public problem being solved.
    *   `scenario`: Context of the project.
    *   `startingMaterial`: What the user needs to find/prepare to start.
    *   `executionSteps`: 3-5 bulleted steps to actually do the work.
    *   `deliverables`: What physical files/documents to output.
    *   `evidenceToCapture`: Specific screenshots or screen recordings needed.
    *   `whatNotToClaim`: Explicit warning (e.g., "Do not claim this was paid work").
    *   `presentationStructure`: How to lay it out in the portfolio.
    *   `suggestedHeadline`, `suggestedDescription`, `proofStatement`: Copy for the portfolio card.
    *   `completionChecklist`: Task list for this specific asset.
*   **Personalisation Dimensions:** Highly specific. An Email Marketer targeting SaaS (Auditor) gets a brief to "Audit an abandoned cart sequence from a top 100 SaaS".
*   **Asset Editing Behaviour:** Users can regenerate a single brief if they don't like it, or manually edit the text.
*   **Validation:** All 3 briefs must be marked as "Accepted" to proceed.
*   **State:** `proofAssets` (array of 3 highly detailed objects).
*   **UI:** A 3-tab interface or horizontal carousel. Each brief is presented as a structured "Mission Document".

---

## Step 4 — Profile + Portfolio Authority

*   **Objective:** Turn the offer and proof into a platform-agnostic public presentation.
*   **Profile Output:** Generates exactly 7 fields: `professionalHeadline`, `shortBio`, `longBio`, `offerStatement`, `credibilityBullets` (focusing on mechanism, not past clients), `proofReferenceLine`, `ctaLine`.
*   **Portfolio Output:** 
    *   V1 generates ONE platform-agnostic authority profile designed for simple builders (Notion, Carrd, Webflow). (Platform-specific adapters like LinkedIn/Upwork are future enhancements).
    *   **Dynamic Section Logic:**
        *   `Hero`: Always included. Uses Module 2 Offer.
        *   `Problem I Solve`: Always included. Uses Module 1 Market pain points.
        *   `Process/Mechanism`: Always included. Uses Module 2 Mechanism.
        *   `Selected Work`: Always included. Uses the 3 Proof Assets.
        *   `Scope/Working Style`: Included if Offer Type is `retainer` or `one_time_project`. Uses Module 2 Scope Limits.
*   **Generated Copy:** For each section, the system generates the exact H2s, body copy, and bullet points.
*   **User-Editable Fields:** Every single piece of generated copy sits in a text area and can be edited.
*   **Empty Proof Behaviour:** The portfolio copy uses the *titles* and *descriptions* of the Proof Assets, with placeholder links `[Link to Project]` since the user hasn't built them yet.
*   **Why Profile & Portfolio are one step:** They are two sides of the same coin—the public face. Separating them causes redundant copy generation.

---

## Step 5 — Authority Pack + Publish Checklist

*   **Objective:** Compile the outputs and provide an execution checklist to transition the user from software-planning to real-world building.
*   **Final Data Structure:** A unified view of the Position, Gaps, 3 Briefs, and Copy.
*   **Checklist Generation:**
    *   Phase 1: Build (3 items for the 3 assets).
    *   Phase 2: Assemble (Create Notion/Carrd, paste copy, add assets).
    *   Phase 3: Publish (Update profile, publish portfolio).
*   **Progress Behaviour:** Action-based checkboxes.
*   **Copy/Export:** V1 supports: Copy individual sections, Copy full Authority Pack to Clipboard, and Markdown Export. (PDF Export is a future enhancement).
*   **Completion Definition:** The module is marked complete when the user reaches this step. They do NOT need to check all boxes in the UI to unlock Module 4 (since building takes days), but the checklist acts as their bridge.
*   **Module 4 Bridge:** Passes `authorityPosition`, `coreTrustPromise`, `proofPriorities`, `proofAssets` summary (with completion status), `authorityReadiness` boolean, and the 5 specific generated profile fields. `profileUrl` and `portfolioUrl` are optional since the user may not have published them yet.
