/**
 * src/data/module3/content-roadmap.ts
 *
 * Section 6 — Content Roadmap (DETERMINISTIC, no LLM call)
 *
 * Generates 4 content pillars + publishing cadence + 5 starter post hooks
 * purely from: authorityPosition + niche + uniqueMechanism.
 *
 * Per user instruction: "Section 6 (Content Roadmap) is deterministic
 * (pure-function, no LLM) for cost/speed."
 */

import { formatSnakeCaseWords } from './authority-suite-engine';
import type { ContentRoadmapOutput, ContentPillar, ContentPost } from '../../types/module3-step3-authority';

type AuthorityPosition = 'builder' | 'auditor' | 'deconstructor' | 'practitioner';

// ── Pillar templates per authority position ───────────────────────────────────

const PILLAR_MAP: Record<AuthorityPosition, Omit<ContentPillar, 'id'>[]> = {
  builder: [
    {
      title: 'Build in Public',
      description:
        'Share your process as you create — not the polished version, the real one. This positions you as someone doing the work, not just talking about it.',
      exampleTopics: [
        'WIP screenshots & commentary',
        'Decision logs: why you chose X over Y',
        'Tooling breakdowns',
        'Architecture rationale',
        'Mistakes made mid-project',
      ],
    },
    {
      title: 'Methodology Breakdown',
      description:
        'Explain how you solve problems step by step. This converts expertise into intellectual property and shows buyers the rigor behind your process.',
      exampleTopics: [
        'Framework walkthroughs',
        'Decision trees you use',
        'Trade-off analysis posts',
        'Before/during/after process maps',
        'How you scope a project',
      ],
    },
    {
      title: 'Proof Documentation',
      description:
        'Show verified outputs from real work. Proof turns claims into evidence and makes social proof structural, not optional.',
      exampleTopics: [
        'Project teardown posts',
        'Before-and-after comparisons',
        'Metric reveals with context',
        'Client win stories',
        'Work-in-progress reveals',
      ],
    },
    {
      title: 'Market Education',
      description:
        'Teach your niche what they do not yet know. This establishes you as a category authority, not just a service provider.',
      exampleTopics: [
        'Common mistakes in your niche',
        'Industry myths debunked',
        'Resource breakdowns',
        'Standard vs. your standard',
        'Emerging trends with commentary',
      ],
    },
  ],
  auditor: [
    {
      title: 'Critique & Analysis',
      description:
        'Publicly audit systems, approaches, and patterns in your niche. Auditors earn trust by demonstrating the ability to see what others miss.',
      exampleTopics: [
        'Public example audits',
        'Teardowns of bad patterns',
        'Grading existing work with criteria',
        'Red flag checklists',
        'Industry-standard vs. best-in-class comparisons',
      ],
    },
    {
      title: 'Standard Setting',
      description:
        'Define what "good" looks like in your domain. Those who set standards attract clients who want to meet them.',
      exampleTopics: [
        'Quality benchmarks',
        'Comparison frameworks',
        'Evaluation rubrics',
        'Criteria posts',
        'What a passing grade looks like',
      ],
    },
    {
      title: 'Risk Identification',
      description:
        'Reveal blind spots your audience has not considered. Risk-revealing content is the highest-trust content type for auditors.',
      exampleTopics: [
        'What you should be worried about',
        'Overlooked failure modes',
        'Hidden costs of the status quo',
        'Assumption audits',
        'The thing nobody is talking about',
      ],
    },
    {
      title: 'Case Evidence',
      description:
        'Show before/after transformation through audit work. Evidence-based posts are the most shareable content type in B2B.',
      exampleTopics: [
        'Before-state documentation',
        'Intervention steps',
        'After-state results with numbers',
        'Counterfactual analysis',
        'What would have happened without the audit',
      ],
    },
  ],
  deconstructor: [
    {
      title: 'System Breakdowns',
      description:
        'Take apart how existing tools, systems, and methods actually work. Deconstructors get attention by revealing the hidden logic others skip.',
      exampleTopics: [
        'How X really works under the hood',
        'Inside look at Y',
        'The logic behind Z no one explains',
        'What they don\'t tell you about X',
        'The actual sequence of steps in Y',
      ],
    },
    {
      title: 'Contrarian Takes',
      description:
        'Challenge accepted wisdom with evidence-backed alternatives. Thoughtful contrarianism is the fastest way to build a distinct intellectual brand.',
      exampleTopics: [
        'Why the consensus is wrong',
        'The overlooked alternative to X',
        'What smart people miss about Y',
        'Counter-case evidence',
        'The uncomfortable truth about Z',
      ],
    },
    {
      title: 'Framework Creation',
      description:
        'Build original mental models from your deconstruction work. Named frameworks are your most defensible intellectual property.',
      exampleTopics: [
        'Original frameworks with names',
        'Decision maps',
        'Naming new patterns you\'ve observed',
        'Classification systems',
        'Visual models with explanation',
      ],
    },
    {
      title: 'Research Synthesis',
      description:
        'Combine disparate ideas into actionable insights your audience hasn\'t seen assembled. Synthesis is the rarest skill in content.',
      exampleTopics: [
        'Pattern-spotting posts',
        'Cross-domain transfers',
        'Literature synthesis made practical',
        'Trend identification with implications',
        'The thread connecting X, Y, and Z',
      ],
    },
  ],
  practitioner: [
    {
      title: 'Client Outcome Stories',
      description:
        'Document real client journeys and measurable results. Practitioners earn trust through demonstrated outcomes, not theoretical expertise.',
      exampleTopics: [
        'Result reveals with before/after numbers',
        'Client win stories with context',
        'Impact metrics with interpretation',
        'Timeline documentation',
        'What changed for the client and why',
      ],
    },
    {
      title: 'Practitioner Insights',
      description:
        'Share lessons only someone with hands-on experience would know. Field observations convert practitioners from doers to authorities.',
      exampleTopics: [
        'What clients actually need vs. what they ask for',
        'Unexpected discoveries mid-project',
        'Nuance-over-theory posts',
        'The thing I\'ve learned that books don\'t cover',
        'Field observations from real work',
      ],
    },
    {
      title: 'Process Transparency',
      description:
        'Open up your delivery workflow so prospects understand your rigor before hiring. Transparency builds pre-sale confidence.',
      exampleTopics: [
        'How I onboard clients',
        'My quality checks and why they exist',
        'Tools I actually use vs. what I recommend',
        'A day in the life of delivery',
        'How I scope and sequence work',
      ],
    },
    {
      title: 'Trust Building',
      description:
        'Build social credibility through direct endorsement and proof. For practitioners, social trust is the primary purchase trigger.',
      exampleTopics: [
        'Testimonial breakdowns with context',
        'Referral stories',
        'Partnership context',
        'Public recognition',
        'The story behind a client relationship',
      ],
    },
  ],
};

// ── Cadence recommendations per position ─────────────────────────────────────

const CADENCE_MAP: Record<AuthorityPosition, string> = {
  builder:
    '3–4 posts/week: 2× build-in-public + 1× methodology breakdown + 1× market education. Video or carousel weekly for max reach. Consistency > frequency — choose a cadence you can sustain for 90 days.',
  auditor:
    '2–3 posts/week: 1× audit/critique + 1× standard-setting + 1× risk identification. Depth over volume. One strong, evidence-rich analysis outperforms three shallow takes.',
  deconstructor:
    '2–3 posts/week: 1× system breakdown + 1× framework/insight + 1× contrarian take. Prioritise thread format on X/Twitter for deconstruction-style content. Quality sets the cadence.',
  practitioner:
    '3 posts/week: 1× client outcome story + 1× practitioner insight + 1× process/trust post. Testimonials and results posts are your highest-ROI content type. Never skip a week.',
};

// ── Starter post hooks (5 per position) ──────────────────────────────────────

function buildStarterPosts(
  position: AuthorityPosition,
  pillars: ContentPillar[],
  niche: string,
  mechanism: string,
): ContentPost[] {
  const p = pillars;
  const posts: ContentPost[] = [
    {
      id: 'post_1',
      pillarId: p[0]?.id ?? 'pillar_1',
      hook: `Here's how I actually ${p[0]?.exampleTopics[0]?.toLowerCase() ?? 'approach my work'} — not the polished version, the real one.`,
      format: 'Text Post',
      platform: 'LinkedIn',
    },
    {
      id: 'post_2',
      pillarId: p[1]?.id ?? 'pillar_2',
      hook: `Most ${niche} professionals skip this step entirely. Here's why that's costing them.`,
      format: 'Carousel',
      platform: 'LinkedIn',
    },
    {
      id: 'post_3',
      pillarId: p[2]?.id ?? 'pillar_3',
      hook: `I built this using ${mechanism}. Here's what happened — the good, the bad, and the number that surprised me.`,
      format: 'Text + Image',
      platform: 'X',
    },
    {
      id: 'post_4',
      pillarId: p[0]?.id ?? 'pillar_1',
      hook: `3 things I would tell a younger version of myself working in ${niche}. Nobody talks about #2.`,
      format: 'Text Thread',
      platform: 'X',
    },
    {
      id: 'post_5',
      pillarId: p[3]?.id ?? 'pillar_4',
      hook: `The industry says X. The data from my last 6 projects says something else. Here's what I found.`,
      format: 'Carousel',
      platform: 'LinkedIn',
    },
  ];

  // Override hook text per position for better relevance
  if (position === 'auditor') {
    posts[0].hook = `I audited a ${niche} system last week. Here's exactly what I found — and what they missed.`;
    posts[2].hook = `Red flags I check for in every ${niche} engagement. If you see #3, stop immediately.`;
  } else if (position === 'deconstructor') {
    posts[0].hook = `How ${mechanism} actually works — not the simplified version. A full breakdown.`;
    posts[2].hook = `Most people think ${niche} works like X. Here's why that mental model is wrong.`;
  } else if (position === 'practitioner') {
    posts[0].hook = `A client came to me with this ${niche} problem. Here's exactly how we solved it — with numbers.`;
    posts[2].hook = `What a real ${niche} engagement looks like from day 1 to delivery. Full transparency.`;
  }

  return posts;
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface ContentRoadmapContext {
  position?: string | null;
  niche?: string | null;
  mechanism?: string | null;
  serviceId?: string | null;
}

/**
 * generateContentRoadmap
 *
 * Pure function — no LLM call, no async.
 * Returns a stable ContentRoadmapOutput given the same context inputs.
 */
export function generateContentRoadmap(ctx: ContentRoadmapContext): ContentRoadmapOutput {
  const position: AuthorityPosition =
    ctx.position === 'builder' || ctx.position === 'auditor' ||
    ctx.position === 'deconstructor' || ctx.position === 'practitioner'
      ? ctx.position
      : 'builder';

  const niche = formatSnakeCaseWords(ctx.niche || ctx.serviceId || 'your niche');
  const mechanism = ctx.mechanism || 'your framework';

  const rawPillars = PILLAR_MAP[position];
  const pillars: ContentPillar[] = rawPillars.map((p, idx) => ({
    id: `pillar_${idx + 1}`,
    ...p,
  }));

  const cadence = CADENCE_MAP[position];
  const firstPosts = buildStarterPosts(position, pillars, niche, mechanism);

  return {
    pillars,
    cadence,
    firstPosts,
    generatedFrom: {
      position,
      niche,
      mechanism,
    },
    generatedAt: new Date().toISOString(),
  };
}
