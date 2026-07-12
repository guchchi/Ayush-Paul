# UI/UX SPECIFICATION: Module 3 — Authority System

## Global Shell & Layout
*   **Consistency:** Module 3 must use the identical App Shell as Module 2 (Sidebar on desktop, bottom/hamburger nav on mobile).
*   **Progress Tracking:** A visual stepper at the top of the content area: 1. Position → 2. Strategy → 3. Assets → 4. Authority Copy → 5. Publish.
*   **Typography & Colours:** Adhere to the established global design system. Premium, high-contrast typography (Inter/Outfit).
*   **Autosave/Persistence:** Every choice and edit is autosaved to `localStorage` (or backend state). A subtle "Saved" indicator appears near the action buttons.
*   **Navigation:** Fixed bottom bar containing `Back` and `Next / Confirm` buttons.

---

## Step 1: Authority Position
*   **Screen Purpose:** Select the core archetype for proof generation.
*   **Information Hierarchy:** Title & brief explanation -> Recommended Option -> Other Options.
*   **Primary Interaction:** Selecting a card.
*   **UI Representation:** 
    *   Desktop: 2x2 grid of premium cards.
    *   Mobile: 1-column stack.
    *   The system-recommended card has a glowing border and a "Recommended based on your Offer" badge.
*   **Hover/Selected States:** Hover elevates the card. Selection highlights the border in primary color and reveals a detailed "How this works for you" text block and the associated Core Trust Promise inside the card.
*   **CTA:** "Lock in Position" (disabled until selection is made).

---

## Step 2: Proof Strategy
*   **Screen Purpose:** Review and finalize 3 credibility gaps.
*   **Top Header:** "Here are the 3 things your market needs to believe before they hire you."
*   **Cards/Inputs:** 3 distinct rows/cards. Each displays:
    *   Gap Title (e.g., "Can handle enterprise scale").
    *   Description ("Prove you understand high-volume architecture").
    *   Recommended Format Dropdown (e.g., "Audit", "Teardown").
    *   A "Swap" button (icon).
*   **Secondary Interaction (Swap Modal):** Clicking "Swap" opens a slide-over or modal with 3 alternate gaps and a "Custom Gap" text input.
*   **CTA:** "Generate Proof Briefs" (loading state required as generation takes time).

---

## Step 3: Proof Asset Builder
*   **Screen Purpose:** Review and accept the 3 generated project briefs.
*   **Information Hierarchy:** Brief 1, Brief 2, Brief 3.
*   **Primary Interaction:** Reading and tweaking the briefs.
*   **Desktop Layout:** A side-nav or horizontal tabs for "Project 1", "Project 2", "Project 3".
*   **Mobile Layout:** Accordions or a horizontal swipe carousel.
*   **Brief/Context Panel (The Card):** A structured, markdown-rendered document styled like a military dossier or premium invoice. It strictly separates:
    *   **The Concept** (Title, Problem).
    *   **The Execution** (Steps, Inputs).
    *   **The Rules** (What not to claim - highlighted in a Warning Alert).
*   **Regenerate Behaviour:** A "Regenerate this project" button at the bottom of each brief. Triggers a skeleton loader for that specific brief.
*   **CTA:** "Approve All 3 Projects".

---

## Step 4: Profile + Portfolio Authority
*   **Screen Purpose:** Review, edit, and finalize generated public copy.
*   **Layout:** Two main vertical sections or tabs: "1. Social Profile" and "2. Portfolio Copy".
*   **Editable Generated Content:** Every piece of generated copy is rendered inside a styled `<textarea>` or rich text input. It does NOT look like static text. It looks like an input field containing text, signaling to the user: "You can edit this."
*   **Sticky Elements:** On desktop, a sticky right-hand context panel shows their Module 2 Offer and Module 3 Proof Titles for reference while editing.
*   **Regenerate Behaviour:** A global "Regenerate Copy" button (destructive, warns user of lost edits).
*   **Empty States:** If a user deleted a proof asset title in Step 3 (edge case), the portfolio copy gracefully falls back to `[Insert Project Title]`.
*   **CTA:** "Finalize Authority Assets".

---

## Step 5: Authority Pack + Publish Checklist
*   **Screen Purpose:** The final handoff and checklist.
*   **Top Header:** "Your Authority System is Ready to Build."
*   **Cards/Inputs:** 
    *   **Export Section:** Buttons for "Copy Sections", "Copy Full Authority Pack", and "Export to Markdown".
    *   **Checklist Section:** Interactive checkboxes grouped by Phase (Build, Assemble, Publish).
*   **Completion Screen:** Once the user lands here, the Module is marked as "Completed" in the global database. Checking the boxes is for personal tracking, not module completion.
*   **Module 4 Bridge:** A prominent "Proceed to Module 4: Outreach" button at the bottom.

---

## Edge Case UX
*   **Blocked Direct-Entry State:** If a user navigates to `/module-3` without completing Module 2, a locked state screen appears: "You need an Offer before you can build Authority." with a button to route back to Module 2.
*   **Destructive Action Behaviour:** If the user clicks "Back" to Step 1 and changes their position, a modal warns: "Changing your position will regenerate all your proof assets and portfolio copy. Are you sure?"
