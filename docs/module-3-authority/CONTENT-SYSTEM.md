# CONTENT SYSTEM & PERSONALISATION: Module 3

## The Anti-Generic Mandate
Module 2 suffered from generic content generation (e.g., producing "I help businesses grow" regardless of inputs). Module 3 must implement a strict **Personalisation Architecture** to ensure every output feels bespoke and highly actionable.

## Content Responsibility Matrix

| Content Object | Personalisation Level | Primary Resolvers |
| :--- | :--- | :--- |
| Authority Position Names | Global | Static |
| Authority Position Rationale | Service + Mechanism | Mod 1 Service, Mod 2 Mechanism |
| Core Trust Promise | Service + Mechanism + Position | Mod 1 Service, Mod 2 Mechanism, Step 1 Position |
| Proof Priorities (Gaps & Formats) | Service + Market + Offer Type | Mod 1 Service, Mod 1 Market, Mod 2 Offer Type |
| Proof Asset Brief (Concept) | Gap + Format + Position | Step 2 Priority, Step 1 Position |
| Proof Asset Brief (Execution) | Mechanism + Position | Mod 2 Mechanism, Step 1 Position |
| Profile Fields (7 fields) | Dynamic Composition | Mod 1 Positioning, Mod 2 Mechanism, Mod 3 Assets |
| Portfolio Structure | Offer Type + Pricing | Mod 2 Offer Type, Mod 2 Pricing Level |
| Portfolio Copy | Holistic | All Module 1, 2, and 3 data |

## Designing Honest Reuse (Preventing 75 Giant Prompts)

Instead of one massive prompt generating the entire portfolio, the system uses modular prompt chaining:
1.  **Resolver 1:** Generates the Proof Priorities (Gaps + Recommended Formats based on Service/Market/Offer).
2.  **Resolver 2:** Takes Priority 1 (Gap + Format) + Position -> Generates Brief 1. (Repeated 3x).
3.  **Resolver 3:** Takes Offer + 3 Brief Titles -> Generates Profile and Portfolio Copy.

This modularity prevents the LLM from hallucinating connections and keeps outputs tightly scoped.

## Content Quality Rules & Banned Phrases

To maintain a premium, professional tone, the LLM system prompts must explicitly BAN the following generic patterns:
*   **Banned Words:** "Skyrocket", "Unleash", "Supercharge", "Revolutionize", "Secret sauce".
*   **Banned Concepts:** "Guaranteed results" (beginners cannot guarantee results), fake ROI numbers.
*   **Tone Constraint:** "Clinical, professional, authoritative, and direct. Write like a senior consultant explaining a framework, not a marketer selling a course."

## Detecting Template-Like Output

The system must include a self-correction layer (or strict few-shot prompting) to prevent outputs like:
*   *Bad:* "I will use my skills to help your business get more leads."
*   *Good:* "Implementing a 3-step technical SEO audit to identify indexation blockers for mid-market SaaS."

## Dynamic Portfolio Section Logic

The sections generated in Step 4 depend on upstream data:
*   **If Offer Type = `"one_time_project"` or `"retainer"`:** Include `Working Style / Communication` section to prove reliability.
*   **If Offer Type = `"milestone_based"`:** Include `Process / Pipeline` section to prove efficiency.
*   **If Pricing Model = `"value_based"` (or high price):** Adjust tone of proof assets to focus on strategic business value, not just technical execution.

## Fallback Behaviour
If the LLM fails to generate highly specific gaps or briefs, the system falls back to a curated library of ~20 generic but high-quality templates mapped to the top 5 freelance verticals (Design, Dev, Writing, Video, Ads).

## QA Scoring Rubric (For LLM Prompts)
Every prompt used in Module 3 must pass this test:
1.  **Specificity:** Does the output mention the target market by name?
2.  **Honesty:** Does it clearly avoid implying past paid client work?
3.  **Actionability:** Can a user read the Proof Asset Brief and immediately start working without asking "how"?
4.  **Cohesion:** Does the portfolio copy directly reference the exact titles of the generated proof assets?
