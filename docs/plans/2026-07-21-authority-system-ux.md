# Module 3 Authority System UX Simplification Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn the complicated, boring text forms of Module 3 Steps 1 & 2 into an interactive, visual, and engaging game-like experience for users.

**Architecture:** We will replace the heavy text fields and tab structures with modern card layouts. Step 1 will feature an interactive **Personality Card Quiz** to select the Authority Archetype, and Step 2 will feature a **Credibility Gap Roadmap** with clickable cards that reveal tailored proof projects.

**Tech Stack:** React 19, Tailwind CSS v4, Lucide Icons, Zustand (Module 3 Store), motion/react (framer-motion).

---

## User Review Required

> [!IMPORTANT]
> This plan changes the user interface of **Step 1** (Authority Profile) and **Step 2** (Proof Asset Builder) of the Authority System page. Instead of long descriptions and textboxes, the user will interact with visual cards and simple checkboxes.
>
> All data bindings to the Zustand store (`useModule3Store`) will remain intact to preserve the compatibility with Module 4 (Portfolio System).

## Proposed Changes

### Task 1: Re-design Step 1 UI (Authority Profile Selection Card Quiz)

**Files:**
- Modify: [Step1AuthorityPosition.tsx](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/module3/Step1AuthorityPosition.tsx)

We will replace the multi-tab layout with an interactive Card layout:
1. **Interactive Archetype Selection:** Show 4 cards side-by-side or in a 2x2 grid representing the 4 positions:
   * **The Builder** ("I design, build, make things.")
   * **The Auditor** ("I audit, measure, optimize existing setups.")
   * **The Deconstructor** ("I study, analyze, explain how things work.")
   * **The Practitioner** ("I do the work myself in the trenches.")
2. **AI Recommendation Highlight:** The position recommended by the AI will have a premium glowing border and a green checkmark or badge labeled `"AI Recommended For You"`.
3. **Promise Customization Area:** When a card is clicked/selected:
   * It expands using smooth motion.
   * It shows a single plain-English text area labeled `"Your Trust Pledge (Modify as needed)"` containing the 2-sentence pledge.
   * Provide a simple `"🔄 Try Alternative Wording"` button next to it. Clicking this increments the `promiseVariationIndex` store field to cycle through the 3 pre-written variations dynamically.
4. **Confirm Action:** A single big, interactive button at the bottom labeled `"Lock in My Archetype & Move to Step 2"`.

---

### Task 2: Re-design Step 2 UI (Credibility Gap & Proof Roadmap)

**Files:**
- Modify: [Step2ProofAssetBuilder.tsx](file:///c:/Users/ap877/2026/Ayush-Paul/src/components/module3/Step2ProofAssetBuilder.tsx)

Currently, this step requires rating previous items and generating a strategy which takes seconds and is text-heavy. We will change it into a visual **Proof Project Selector**:
1. **Remove Rating Forms:** Replace the blank rating forms with a single-choice question: *"What starting materials do you have?"* with simple checkbox buttons (e.g. "Previous projects", "Screenshots", "Client testimonials", "I am starting from scratch"). Checking these updates the `existingProofInventory` store field behind the scenes.
2. **Interactive Gaps Map:** Show the 3 calculated credibility gaps for their track/niche as horizontal, clickable cards (e.g., *"How do I prove quality consistency?"*).
3. **The Proof Project Panel:** Selecting a gap opens a clean preview panel showing:
   * **Goal:** A clear, simple explanation.
   * **Action Roadmap:** A horizontal or vertical timeline showing the 4 execution steps.
   * **Checklist:** Checkbox list of deliverables that user can check off dynamically to see a progress bar rise.
4. **Confirm Action:** A single prominent CTA button labeled `"Confirm Proof Strategy"`.

---

## Verification Plan

### Automated Tests
We will run the existing verification script to guarantee that all store operations, validations, and bridge context logic remain 100% correct:
- Command: `npx tsx scripts/verify-module3.ts`
- Expected output: `=== All Module 3 Verification Tests Passed Successfully! ===`

### Manual Verification
1. Run `npm run dev` to launch the local server.
2. Open `/workspace/authority-system` in the browser.
3. Test Step 1: verify that clicking an archetype updates the store and shows the correct recommendation. Verify that the "Try Alternative Wording" button successfully updates the promise.
4. Test Step 2: verify selecting a gap card displays the custom project roadmap and checkable actions correctly.
