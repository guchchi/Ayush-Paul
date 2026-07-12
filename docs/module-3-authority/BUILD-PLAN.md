# BUILD PLAN: Module 3 — Authority System

This build plan is designed for sequential execution. A weaker model (like DeepSeek) can execute phases marked [DEEPSEEK SAFE]. Phases marked [REVIEW REQUIRED] must be reviewed by the lead architect (ChatGPT) before merging.

---

## Phase 1: State & Routing Scaffold [DEEPSEEK SAFE]
*   **Objective:** Set up the routing, the blank App Shell, and the Zustand/Context state store for Module 3.
*   **Files Changed:** Routes, State Store (`useModule3Store`), empty view components for Steps 1-5.
*   **Allowed Changes:** Creating new state slices, implementing the upstream fingerprint logic.
*   **Dependencies:** Module 1 & 2 state must be readable.
*   **Completion Criteria:** User can click through Steps 1 to 5 (empty screens), and state persists in localStorage.

---

## Phase 2: Step 1 & 2 UI + Logic [DEEPSEEK SAFE]
*   **Objective:** Build the Authority Position selector and the Proof Strategy gap builder.
*   **Files Changed:** Step 1 Component, Step 2 Component.
*   **Allowed Changes:** Implementing the UI cards, the "Swap" modal, and the custom input validation.
*   **Mock Data:** Use static mock data for generation to test UI without hitting LLMs.
*   **Completion Criteria:** User can select a position, view 3 gaps, swap one, write a custom one, and lock them in state.

---

## Phase 3: AI Prompts & Generation Engine [REVIEW REQUIRED]
*   **Objective:** Implement the actual LLM API calls and prompt chaining for Steps 2, 3, and 4.
*   **Files Changed:** API routes/server actions, AI utility functions.
*   **Dependencies:** Phase 2 state must be passing correct arguments to the API.
*   **Review Requirement:** ChatGPT must review the exact prompt structures to ensure the "Anti-Generic Mandate" is enforced.
*   **Completion Criteria:** The system successfully generates highly specific JSON responses for gaps, briefs, and portfolio copy based on test inputs.

---

## Phase 4: Step 3 (Proof Asset Builder) UI [DEEPSEEK SAFE]
*   **Objective:** Build the complex brief viewer interface.
*   **Files Changed:** Step 3 Component.
*   **Allowed Changes:** Implementing the tabbed/carousel layout, the "Dossier" styling for the briefs, and regenerate buttons.
*   **Completion Criteria:** All 3 AI-generated briefs render cleanly, handling long text gracefully.

---

## Phase 5: Step 4 (Profile & Portfolio Copy) UI [DEEPSEEK SAFE]
*   **Objective:** Build the editable text areas and contextual side panel.
*   **Files Changed:** Step 4 Component.
*   **Allowed Changes:** Two-column layout, binding `<textarea>` inputs directly to state for autosave.
*   **Completion Criteria:** User can view generated copy, edit it, refresh the page, and see edits preserved.

---

## Phase 6: Step 5 (Authority Pack & Bridge) [DEEPSEEK SAFE]
*   **Objective:** Build the final compilation screen, markdown export, and checklist.
*   **Files Changed:** Step 5 Component, Markdown export utility.
*   **Completion Criteria:** User can check boxes (state saves), click "Export", and receive a perfectly formatted Markdown file of all their Module 3 assets.

---

## Phase 7: Edge Cases & QA Pass [REVIEW REQUIRED]
*   **Objective:** Implement fingerprint mismatch modals, direct route guards, and destructive action warnings.
*   **Files Changed:** Global Module 3 layout, Navigation components.
*   **Review Requirement:** ChatGPT must verify the state migration and reset logic to ensure no infinite loops or trapped users.
*   **Completion Criteria:** All tests in `EDGE-CASES-QA.md` pass manually.
