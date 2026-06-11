# Blueprint Authoring Guide

## Overview

A Blueprint is an Interactive Execution System.

It is NOT:
- A PDF
- An ebook
- A course
- Documentation
- A blog post
- A Notion template

It IS:
- A step-by-step execution system
- Something the user installs into their workflow
- Something the user completes in 30-60 minutes
- Something that produces a measurable outcome

---

## Philosophy

The Blueprint Engine is the product.
Blueprint content is only data.

Creating a new blueprint requires:
- One JSON file in `src/content/blueprints/`
- No React components
- No configuration files
- No import statements

The engine handles everything else.

---

## Authoring Workflow

Follow these steps in order. Each step builds on the previous one.

### Step 1: Define the Outcome

Start with the end in mind.

Ask:
- What specific result will the user get?
- How will they measure success?
- What is the single most important thing they achieve?

Write this as a single sentence.

> Example: "Build a repeatable audience growth system in 7 modules"

### Step 2: Define the Modules

Break the outcome into 3-7 logical modules.

Each module should:
- Be a complete unit of work (15-30 min)
- Build on the previous module
- Produce a specific deliverable
- Have a clear start and end

Ask: "What is the minimum number of steps to achieve the outcome?"

Naming convention: Short, action-oriented titles.
- Foundation (not "Setting Up the Foundation of Your System")
- Offer Design (not "How to Design Your Offer")
- Content Engine (not "Content Creation and Management Engine")

### Step 3: Define Workflows

Each module needs a visual workflow.

Workflows show the user the path before they start.

Create 3-4 linear steps per workflow.

Each step has:
- `label`: 1-2 words (Audience, Offer, Validation, Execution)
- `description`: 2-4 words (Who you serve, What you provide, etc.)

The workflow should form a logical progression from start to completion.

### Step 4: Define Action Steps

This is the core of the module.

Each step must:
- Be immediately actionable
- Take 3-7 minutes to complete
- Produce a specific output
- Require no prior knowledge

**Step structure:**
- `title`: 2-6 words. Action verb + noun. Example: "Define Your Audience"
- `description`: One sentence. What the user will do.
- `details`: 50-150 words. The exact instructions.

**Writing details:**
- Start with why this step matters (one sentence max)
- Tell the user exactly what to do
- Include specific examples
- Mention tools or resources by name
- End with what the output looks like

**DO NOT write:**
- Background theory
- Industry statistics
- Personal stories
- Multiple approaches (pick one)

### Step 5: Define Prompts

Prompts are copy-paste instructions for AI tools.

Each prompt must:
- Be a complete instruction ready to paste into ChatGPT/Claude
- Start with a role ("Act as a...")
- Include specific output format requirements
- Require user input at specific points (shown as [brackets])

**Prompt structure:**
- `title`: What this prompt does (2-6 words)
- `text`: The full prompt text

**Quality rules:**
- Maximum 1-3 prompts per module
- Each prompt should produce a different output
- Prompts must work standalone (no dependencies between prompts)
- Test every prompt before publishing

### Step 6: Define Templates

Templates are downloadable frameworks that accelerate execution.

Types:
- Spreadsheets (Google Sheets / Excel)
- Documents (Google Docs / Notion)
- Canvases (Miro / Figma)
- Code snippets
- Markdown files

Each template has:
- `title`: What it is
- `description`: What it helps the user do (one sentence)
- `url`: Link to open/view the template
- `downloadUrl`: Link to download the template file

Quality rule: Every template must be immediately usable without modification.

### Step 7: Define Checklist

Checklist items are binary (done/not done).

Each item must:
- Be objectively completable
- Take under 5 minutes
- Be specific (not "Research audience" but "Document top 3 audience pain points")

**Quantity:**
- Minimum: 3 items per module
- Maximum: 8 items per module
- Total blueprint: 15-40 items

The checklist is how progress is measured. Every checked item should mean real progress toward the module outcome.

### Step 8: Define Resources

Resources support execution. They are not required reading.

Types:
- `tool`: Software the user should use
- `article`: A short read (under 5 min)
- `video`: A tutorial or walkthrough
- `reference`: Documentation, cheatsheets, libraries

**Quantity:**
- 1-4 resources per module
- Include resources only if they directly help execution
- Remove resources that provide "nice to know" background

---

## Content Limits

### Per Module
| Element | Min | Max |
|---------|-----|-----|
| Reading time | 1 min | 4 min |
| Action steps | 2 | 7 |
| Prompts | 0 | 3 |
| Templates | 0 | 3 |
| Checklist items | 3 | 8 |
| Resources | 0 | 4 |
| Workflow steps | 2 | 5 |

### Per Blueprint
| Element | Min | Max |
|---------|-----|-----|
| Modules | 3 | 7 |
| Total action steps | 8 | 30 |
| Total prompts | 3 | 15 |
| Total completion time | 20 min | 4 hours |

---

## Quality Rules

### Rule 1: One Problem, One Outcome

A blueprint solves exactly one problem.

If you find yourself writing "and also" in the description, split it into two blueprints.

### Rule 2: Execute in 30 Minutes

A user should be able to open the first module and get a tangible result within 30 minutes.

If they can't, the first module is too theoretical.

### Rule 3: No Long Theory

Every paragraph must either:
- Tell the user what to do
- Show the user an example
- Help the user decide between options

If a paragraph doesn't lead to action, remove it.

### Rule 4: Measurable Outcome

The outcome must be objectively verifiable.

- Weak: "Understand your audience better"
- Strong: "Define your target audience profile with demographic and psychographic data"

### Rule 5: Completion Over Coverage

Better to have 3 tight modules that produce a result than 7 modules that cover every edge case.

Users should feel accomplished, not overwhelmed.

---

## Validation Checklist

Before publishing, answer every question:

### Core Questions
- [ ] Can the user execute this immediately?
- [ ] Can the user get a result within 30 minutes of starting?
- [ ] Does this feel like a system rather than an ebook?
- [ ] Would the user describe this as "a guide" or "a tool"?
- [ ] Is every paragraph actionable?

### Module Questions
- [ ] Does each module start with a clear outcome?
- [ ] Does each module produce a specific deliverable?
- [ ] Can each module be completed in 15-30 minutes?
- [ ] Do modules build on each other logically?
- [ ] Could any module be removed without breaking the outcome?

### Step Questions
- [ ] Does every step start with an action verb?
- [ ] Is each step's "details" under 150 words?
- [ ] Does each step tell the user exactly what to do?
- [ ] Could any step be combined with another?
- [ ] Is there any theory that should be removed?

### Prompt Questions
- [ ] Has every prompt been tested in an AI tool?
- [ ] Does every prompt produce useful output with minimal editing?
- [ ] Are prompts independent (no dependency on other prompts)?
- [ ] Could the user complete this module without the prompts?

### Checklist Questions
- [ ] Is every checklist item objectively completable?
- [ ] Would completing all items guarantee the module outcome?
- [ ] Are items specific enough to take action immediately?

### Resource Questions
- [ ] Does every resource directly help execution?
- [ ] Are all links working and pointing to the correct content?
- [ ] Could the user complete this module without any resources?

---

## Versioning

### Scheme
- `1.0` — Initial release
- `1.1` — Minor updates (better prompts, improved steps)
- `1.2` — Significant updates (new steps, reordered modules)
- `2.0` — Major rewrite (new outcome, different approach)

### Update Rules
- Never break existing progress data (module IDs must remain stable)
- Adding new checklist items is OK (existing items retain completion status)
- Adding new modules is OK (add at the end)
- Renaming or reordering modules breaks user progress (avoid unless 2.0)
- Changing module `id` fields resets progress for that module (avoid)

### Changelog
Keep a changelog in the blueprint's metadata or a separate file:

```
1.0 — 2026-06-10 — Initial release
1.1 — 2026-07-15 — Updated prompts, added resource links
```

---

## File Structure

```
src/content/blueprints/
  your-blueprint.json       # The blueprint content
  index.ts                  # Auto-loader (no changes needed)
```

### Naming Convention

JSON filename = blueprint slug = URL path.

- `growth-os.json` → `/blueprints/growth-os/engine`
- `creator-os.json` → `/blueprints/creator-os/engine`

Use lowercase, hyphens, no spaces.

### ID Convention

| Element | Convention | Example |
|---------|-----------|---------|
| Module | `{slug}` | `foundation` |
| Step | `{module-id}-{n}` | `foundation-1` |
| Prompt | `{module-id}-prompt-{n}` | `foundation-prompt-1` |
| Template | `{module-id}-template-{n}` | `foundation-template-1` |
| Checklist | `{module-id}-c{n}` | `foundation-c1` |
| Resource | `{module-id}-r{n}` | `foundation-r1` |

IDs must be globally unique within the blueprint and never change after a release (to preserve user progress data).

---

## Starting from the Template

```
cp templates/blueprint-template.json src/content/blueprints/your-blueprint.json
```

1. Fill in the top-level metadata (id, title, description, etc.)
2. Set `id` to match the filename without `.json`
3. Work through each module section
4. Remove unused blocks (set prompts/templates/resources to `[]`)
5. Validate using the checklist above
6. The engine automatically picks it up at `/blueprints/{id}/engine`

No other files need to change.

---

## Schema Reference

For the full type definitions, see `src/types/blueprint-engine.ts`.

### BlueprintEngineData

```
id          string    Unique slug, matches filename
title       string    Display name
description string    One-paragraph summary
outcome     string    Single measurable outcome
estimatedTime  string  e.g. "~2 hours total"
difficulty  string    Beginner | Intermediate | Advanced
version     string    Semantic version e.g. "1.0"
lastUpdated string    ISO date e.g. "2026-06-10"
category    string    For filtering/taxonomy
tags        string[]  For search/SEO
modules     Module[]  3-7 modules
```

### BlueprintModule

```
id          string    Unique module identifier
title       string    Short action-oriented title
description string    1-2 sentence module summary
outcome     string[]  3-5 specific deliverables
workflow    Step[]    2-5 visual workflow steps
steps       ActionStep[]  2-7 detailed action steps
prompts     Prompt[]  0-3 AI prompts
templates   Template[]  0-3 templates
checklist   ChecklistItem[]  3-8 checklist items
resources   Resource[]  0-4 resources
```

### Blocks Reference

| Block | Purpose | Required |
|-------|---------|----------|
| Outcome | What the user achieves | Yes |
| Workflow | Visual path visualization | Yes |
| Action Step | Core executable unit | Yes |
| Prompt | AI copy-paste instruction | No |
| Template | Downloadable framework | No |
| Checklist | Progress tracking | Yes |
| Resource | Supporting tools/links | No |
