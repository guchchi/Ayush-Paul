import type { AuthorityPosition, ProofPriority, ProofFormat } from '../../types/module3';

export const ALL_FORMATS: { value: ProofFormat; label: string; description: string }[] = [
  { value: 'case_study', label: 'Case Study', description: 'Document a specific problem, your approach, and the result.' },
  { value: 'demo_video', label: 'Demo / Walkthrough', description: 'Show how you build, edit, or execute your process in real time.' },
  { value: 'comparison', label: 'Comparison', description: 'Compare two approaches and demonstrate how they differ in process or outcome.' },
  { value: 'framework', label: 'Framework / System', description: 'Present your repeatable method as a structured framework.' },
  { value: 'before_after', label: 'Before & After', description: 'Show the transformation your work creates.' },
  { value: 'explainer', label: 'Explainer / Educational', description: 'Teach something valuable to demonstrate your expertise.' },
  { value: 'testimonial_equivalent', label: 'Testimonial Equivalent', description: 'Document a positive outcome or feedback in detail.' },
  { value: 'data_report', label: 'Data / Analytics Report', description: 'Use data and metrics to demonstrate measurable impact.' },
  { value: 'process_walkthrough', label: 'Process Walkthrough', description: 'Walk through exactly how you approach and deliver work.' },
  { value: 'educational_content', label: 'Educational Content', description: 'Create content that teaches your market something valuable.' },
];

export interface PriorityContext {
  serviceId: string | null;
  marketId: string | null;
  nicheId: string | null;
  positioning: string;
  offerType: string | null;
  deliverables: string[];
  uniqueMechanism: string;
  valueAmplifier: string;
  authorityPosition: AuthorityPosition | null;
  coreTrustPromise: string;
  availableAssets?: string[];
  strongestAsset?: string | null;
  missingAssets?: string[];
}

interface CandidateGap {
  title: string;
  description: string;
  format: ProofFormat;
  weight: number;
  category: 'service_capability' | 'buyer_doubt' | 'offer_risk' | 'position_fit';
}

function normalise(value: string): string {
  return value.toLowerCase().trim();
}

const BUYER_LABELS: Record<string, string> = {
  youtube_creators: 'YouTube creators',
  creators: 'creators',
  coaches: 'coaches',
  agencies: 'agencies',
  local_businesses: 'local businesses',
  saas_startups: 'SaaS startups',
  startups: 'startups',
  coaches_consultants: 'coaches and consultants',
  course_creators: 'course creators',
  podcasters: 'podcasters',
  educators: 'educators',
  personal_brands: 'personal brands',
  business_owners: 'business owners',
  ecommerce_brands: 'ecommerce brands',
  marketing_agencies: 'marketing agencies',
  personal_brand_creators: 'personal brand creators',
};

const BUYER_AUDIENCE: Record<string, string> = {
  youtube_creators: 'YouTube creators',
  creators: 'creators',
  coaches: 'coaches',
  agencies: 'agencies',
  local_businesses: 'local business buyers',
  saas_startups: 'SaaS founders',
  startups: 'startup founders',
  coaches_consultants: 'coaches and consultants',
  course_creators: 'course creators',
  podcasters: 'podcasters',
  educators: 'educators',
  personal_brands: 'personal brand builders',
  business_owners: 'business owners',
  ecommerce_brands: 'ecommerce brand managers',
  marketing_agencies: 'marketing agencies',
  personal_brand_creators: 'personal brand creators',
};

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getBuyerLabel(marketId: string | null): string {
  if (!marketId) return 'your target market';
  return BUYER_LABELS[marketId] ?? marketId.replace(/_/g, ' ');
}

function getBuyerAudience(marketId: string | null): string {
  if (!marketId) return 'buyers';
  return BUYER_AUDIENCE[marketId] ?? marketId.replace(/_/g, ' ');
}

import { classifyService } from './service-taxonomy';

function getServiceTrack(serviceId: string | null): 'editor' | 'developer' | 'designer' | 'automation' | 'other' {
  return classifyService(serviceId).family;
}

function pickTopDeliverables(deliverables: string[], maxCount: number = 2): string[] {
  if (deliverables.length === 0) return [];
  const sorted = [...deliverables].sort((a, b) => a.length - b.length);
  return sorted.slice(0, maxCount);
}

function getServiceDefault(serviceId: string): string {
  const s = serviceId.toLowerCase();
  if (s.includes('edit')) return 'polished videos';
  if (s.includes('develop')) return 'functional builds';
  if (s.includes('design')) return 'design work';
  if (s.includes('automation')) return 'automation systems';
  return 'professional work';
}

function pickFormat(position: AuthorityPosition | null, category: string): ProofFormat {
  const pos = position ?? 'builder';
  if (category === 'service_capability') {
    if (pos === 'builder') return 'demo_video';
    if (pos === 'auditor') return 'data_report';
    if (pos === 'deconstructor') return 'framework';
    return 'process_walkthrough';
  }
  if (category === 'buyer_doubt') {
    if (pos === 'builder') return 'before_after';
    if (pos === 'auditor') return 'comparison';
    if (pos === 'deconstructor') return 'educational_content';
    return 'before_after';
  }
  if (category === 'offer_risk') {
    if (pos === 'builder') return 'process_walkthrough';
    if (pos === 'auditor') return 'case_study';
    if (pos === 'deconstructor') return 'framework';
    return 'process_walkthrough';
  }
  return 'case_study';
}

function generateServiceCandidates(ctx: PriorityContext): CandidateGap[] {
  const candidates: CandidateGap[] = [];
  const service = ctx.serviceId ?? '';
  const track = getServiceTrack(ctx.serviceId);
  const buyer = getBuyerLabel(ctx.marketId);
  const audience = getBuyerAudience(ctx.marketId);
  const deliverables = ctx.deliverables;
  const mechanism = normalise(ctx.uniqueMechanism);
  const topDeliverables = pickTopDeliverables(deliverables);

  if (track === 'editor') {
    const delivLabel = topDeliverables.length > 0 ? topDeliverables.join(' and ') : 'edited content';
    candidates.push({
      title: `Prove you can ${topDeliverables.length > 0 ? 'deliver ' + delivLabel : 'edit content'} designed to hold attention`,
      description: `${capitalizeFirst(buyer)} need to believe your editing keeps viewers watching. Show a concrete example that demonstrates your pacing, hook structure, and retention-focused editing decisions.`,
      format: pickFormat(ctx.authorityPosition, 'service_capability'),
      weight: 9,
      category: 'service_capability',
    });
    candidates.push({
      title: 'Prove you understand platform-specific requirements',
      description: `Every platform has different specs, audience behaviour, and content patterns. Show that you tailor your output to the platform, not just apply a one-size-fits-all edit.`,
      format: 'comparison',
      weight: 7,
      category: 'service_capability',
    });
  }

  if (track === 'developer') {
    const delivLabel = topDeliverables.length > 0 ? topDeliverables.join(' and ') : 'functional, polished interfaces';
    candidates.push({
      title: `Prove you can build ${delivLabel}`,
      description: `${capitalizeFirst(buyer)} need to believe your builds are production-quality. Show a project that demonstrates clean code, responsive design, and attention to user experience.`,
      format: pickFormat(ctx.authorityPosition, 'service_capability'),
      weight: 9,
      category: 'service_capability',
    });
  }

  if (track === 'designer') {
    const delivLabel = topDeliverables.length > 0 ? topDeliverables.join(' and ') : 'design work';
    const labelWithArticle = topDeliverables.length === 1 && !topDeliverables[0].endsWith('s')
      ? 'a ' + delivLabel
      : delivLabel;
    candidates.push({
      title: `Prove you can create ${labelWithArticle} with purpose`,
      description: `${capitalizeFirst(buyer)} need to see your design thinking, not just your final output. Walk through a design decision process that shows you solve real problems, not just make things look good.`,
      format: pickFormat(ctx.authorityPosition, 'service_capability'),
      weight: 9,
      category: 'service_capability',
    });
  }

  if (track === 'automation') {
    candidates.push({
      title: 'Prove you can build systems that save real time',
      description: `${capitalizeFirst(buyer)} need automation that actually works, not theoretical workflows. Show a before-and-after of a manual process you automated, with measurable time saved.`,
      format: 'before_after',
      weight: 9,
      category: 'service_capability',
    });
  }

  if (mechanism.includes('audit') || mechanism.includes('analys') || mechanism.includes('optimis') || normalise(deliverables.join(' ')).includes('audit') || normalise(deliverables.join(' ')).includes('analysis')) {
    candidates.push({
      title: 'Prove your diagnostic process is thorough',
      description: `${capitalizeFirst(buyer)} need to trust that your analysis catches what matters. Show a structured audit or analysis that reveals insights they would have missed.`,
      format: 'data_report',
      weight: 8,
      category: 'service_capability',
    });
  }

  if (mechanism.includes('framework') || mechanism.includes('system') || mechanism.includes('strategy') || normalise(deliverables.join(' ')).includes('framework') || normalise(deliverables.join(' ')).includes('strategy')) {
    candidates.push({
      title: 'Prove your framework produces reliable outcomes',
      description: `${capitalizeFirst(buyer)} want a repeatable system, not luck. Show your methodology applied to a sample problem with the step-by-step reasoning that led to the solution.`,
      format: 'framework',
      weight: 8,
      category: 'service_capability',
    });
  }

  return candidates;
}

function generateBuyerDoubtCandidates(ctx: PriorityContext): CandidateGap[] {
  const candidates: CandidateGap[] = [];
  const market = ctx.marketId ?? '';
  const niche = ctx.nicheId ?? '';
  const buyer = getBuyerLabel(ctx.marketId);

  const doubtMap: Record<string, { title: string; description: string }[]> = {
    coaches: [
      {
        title: 'Prove you understand coaching business dynamics',
        description: `Coaches need proof that you understand their business model — how they attract clients, deliver programs, and build trust. Show that your work supports their specific go-to-market motion.`,
      },
      {
        title: 'Prove you can translate expertise into engaging content',
        description: `Coaches have deep knowledge but often struggle to make it engaging. Demonstrate your ability to turn expert insights into content that captures attention and drives consultation bookings.`,
      },
    ],
    saas_startups: [
      {
        title: 'Prove you understand SaaS metrics and growth loops',
        description: `SaaS founders live and die by metrics — activation, retention, conversion. Show that your work is designed with these metrics in mind, not just aesthetics or features.`,
      },
      {
        title: 'Prove you can work within startup speed constraints',
        description: `Startups move fast and need partners who can keep pace. Demonstrate your ability to deliver quality work on startup timelines without cutting corners.`,
      },
    ],
    local_businesses: [
      {
        title: 'Prove you understand local customer acquisition',
        description: `Local businesses need to attract nearby customers, not a global audience. Show that your work drives local visibility — through local-intent structure, clear conversion and enquiry paths, and trust signals placed where nearby customers will see them.`,
      },
      {
        title: 'Prove you can work with limited budgets',
        description: `Local businesses rarely have enterprise budgets. Demonstrate your ability to deliver maximum impact per dollar spent — efficient solutions that work within their constraints.`,
      },
    ],
    startups: [
      {
        title: 'Prove you understand early-stage product constraints',
        description: `Early-stage companies need to validate fast and iterate. Show that you can deliver high-quality work even when requirements are fluid and timelines are aggressive.`,
      },
    ],
    agencies: [
      {
        title: 'Prove you can maintain quality across multiple projects',
        description: `Agencies need partners who deliver consistent quality, not one-off brilliance. Demonstrate your system for maintaining standards across different clients and project types.`,
      },
    ],
    ecommerce_brands: [
      {
        title: 'Prove you understand conversion-focused creative',
        description: `Ecommerce brands need creatives that sell, not just look pretty. Show your understanding of direct-response principles, hooks that convert, and offers that drive clicks.`,
      },
    ],
    course_creators: [
      {
        title: 'Prove you understand educational engagement',
        description: `Course creators need content that keeps students enrolled and learning. Demonstrate your ability to structure educational material for maximum retention and comprehension.`,
      },
    ],
    creators: [
      {
        title: 'Prove you can help scale content production',
        description: `Creators need to post consistently without burning out. Show your system for efficient content production that helps them maintain quality at higher volume.`,
      },
    ],
    podcasters: [
      {
        title: 'Prove you understand audio-first engagement',
        description: `Podcasters need to keep listeners engaged without visual crutches. Demonstrate your ability to pace audio content, clean up sound, and structure episodes for retention.`,
      },
    ],
    personal_brands: [
      {
        title: 'Prove you can maintain authentic voice across content',
        description: `Personal brands need content that sounds like them, not a templated version. Show your ability to preserve and amplify an individual's unique voice and perspective.`,
      },
    ],
  };

  const doubts = doubtMap[market] ?? doubtMap[market.replace(/s$/, '')] ?? [];
  for (const d of doubts) {
    candidates.push({
      title: d.title,
      description: d.description,
      format: pickFormat(ctx.authorityPosition, 'buyer_doubt'),
      weight: 8,
      category: 'buyer_doubt',
    });
  }

  if (niche) {
    const nicheLabel = niche.replace(/_/g, ' ');
    candidates.push({
      title: `Prove you understand ${nicheLabel} specifically`,
      description: `Generic expertise is not enough — ${buyer} in ${nicheLabel} have unique challenges. Show specific knowledge of their pain points, language, and success patterns.`,
      format: 'educational_content',
      weight: 7,
      category: 'buyer_doubt',
    });
  }

  return candidates;
}

function generateOfferRiskCandidates(ctx: PriorityContext): CandidateGap[] {
  const candidates: CandidateGap[] = [];
  const offerType = ctx.offerType ?? 'one_time_project';
  const track = getServiceTrack(ctx.serviceId);
  const buyer = getBuyerLabel(ctx.marketId);
  const audience = getBuyerAudience(ctx.marketId);
  const mechanism = normalise(ctx.uniqueMechanism);
  const deliverables = ctx.deliverables;
  const topDeliverables = pickTopDeliverables(deliverables);

  if (offerType === 'retainer') {
    candidates.push({
      title: 'Prove you can deliver consistent quality over time',
      description: `${capitalizeFirst(buyer)} hiring on retainer need reliability, not a one-time burst. Show your system for maintaining quality across recurring deliverables — week after week, month after month.`,
      format: 'process_walkthrough',
      weight: 9,
      category: 'offer_risk',
    });
    candidates.push({
      title: 'Prove your ongoing judgement adds compounding value',
      description: `Retainer clients pay for your judgement, not just output. Demonstrate how your recommendations improve over time as you learn their business — showing the value of a long-term partnership.`,
      format: 'framework',
      weight: 7,
      category: 'offer_risk',
    });
  }

  if (offerType === 'one_time_project') {
    switch (track) {
      case 'editor': {
        const source = topDeliverables.length > 0
          ? `raw footage through selection, hook construction, pacing, and final delivery`
          : `source footage through selection, hook construction, pacing, captions, and final delivery`;
        candidates.push({
          title: 'Prove you can take raw footage to finished video',
          description: `${capitalizeFirst(buyer)} need confidence that you can handle the complete editing workflow. Show a project where you took ${source}.`,
          format: 'demo_video',
          weight: 9,
          category: 'offer_risk',
        });
        break;
      }
      case 'developer': {
        const scope = topDeliverables.length > 0
          ? `translate requirements into ${topDeliverables.join(' and ')} that are production-ready`
          : `translate agreed requirements into a production-ready build`;
        candidates.push({
          title: 'Prove you can deliver production-ready builds',
          description: `${capitalizeFirst(buyer)} need confidence that you can ${scope}. Show a project from requirements to deployment.`,
          format: 'case_study',
          weight: 9,
          category: 'offer_risk',
        });
        break;
      }
      case 'designer': {
        const scope = topDeliverables.length > 0
          ? `move from brand direction to coherent final ${topDeliverables.join(' and ')}`
          : `move from creative brief to a coherent final design system`;
        candidates.push({
          title: 'Prove you can take a brief to finished design',
          description: `${capitalizeFirst(buyer)} need confidence that you can ${scope}. Show a project that demonstrates your full design process from concept to delivery.`,
          format: 'case_study',
          weight: 9,
          category: 'offer_risk',
        });
        break;
      }
      case 'automation': {
        const scope = topDeliverables.length > 0
          ? `translate workflow requirements into functional, documented ${topDeliverables.join(' and ')}`
          : `translate workflow requirements into a functional, documented automation system`;
        candidates.push({
          title: 'Prove you can deliver working automation systems',
          description: `${capitalizeFirst(buyer)} need confidence that you can ${scope}. Show a project that demonstrates end-to-end ownership from requirement to deployment.`,
          format: 'case_study',
          weight: 9,
          category: 'offer_risk',
        });
        break;
      }
      default: {
        candidates.push({
          title: 'Prove you can own a project from start to finish',
          description: `${capitalizeFirst(buyer)} need confidence that you can take a brief and return something complete and production-ready. Show a project that demonstrates end-to-end ownership.`,
          format: 'case_study',
          weight: 9,
          category: 'offer_risk',
        });
        break;
      }
    }
    candidates.push({
      title: 'Prove your scope execution is reliable',
      description: `Fixed-price buyers worry about scope creep and missed deadlines. Demonstrate your ability to define, scope, and execute a project within agreed boundaries.`,
      format: 'process_walkthrough',
      weight: 7,
      category: 'offer_risk',
    });
  }

  if (offerType === 'milestone_based') {
    candidates.push({
      title: 'Prove you can deliver quality at each milestone',
      description: `${capitalizeFirst(buyer)} need confidence that every phase of work is independently valuable. Show a phased project where each milestone delivered real, usable output.`,
      format: 'case_study',
      weight: 9,
      category: 'offer_risk',
    });
    candidates.push({
      title: 'Prove your handoff between phases is seamless',
      description: `Milestone-based projects live or die on phase transitions. Demonstrate your ability to document, communicate, and hand off work cleanly between stages.`,
      format: 'process_walkthrough',
      weight: 7,
      category: 'offer_risk',
    });
  }

  if (mechanism) {
    candidates.push({
      title: `Prove your "${ctx.uniqueMechanism}" approach works`,
      description: `${capitalizeFirst(buyer)} are buying your mechanism, not generic output. Show exactly how your approach changes the process or final output compared with a clear baseline.`,
      format: 'comparison',
      weight: 8,
      category: 'offer_risk',
    });
  }

  return candidates;
}

function isOverlapping(a: CandidateGap, b: CandidateGap): boolean {
  const aWords = a.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const bWords = b.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  let overlap = 0;
  for (const w of aWords) {
    if (bWords.includes(w)) overlap++;
  }
  const total = Math.min(aWords.length, bWords.length);
  return total > 0 && overlap / total > 0.4;
}

function selectTopNonOverlapping(
  candidates: CandidateGap[],
  count: number,
  ctx: PriorityContext,
): CandidateGap[] {
  const sorted = [...candidates].sort((a, b) => b.weight - a.weight);
  const selected: CandidateGap[] = [];

  const priorityOrder: Record<string, number> = {
    offer_risk: 3,
    buyer_doubt: 2,
    service_capability: 1,
    position_fit: 0,
  };

  const needsCategory = new Set(['offer_risk', 'buyer_doubt', 'service_capability']);

  for (const cat of ['offer_risk', 'buyer_doubt', 'service_capability']) {
    const fromCat = sorted.filter(
      (c) => c.category === cat && !selected.some((s) => isOverlapping(s, c)),
    );
    if (fromCat.length > 0) {
      selected.push(fromCat[0]);
    }
  }

  for (const c of sorted) {
    if (selected.length >= count) break;
    if (selected.some((s) => s.category === c.category && isOverlapping(s, c))) continue;
    if (selected.some((s) => isOverlapping(s, c))) continue;
    selected.push(c);
  }

  while (selected.length < count && sorted.length > 0) {
    for (const c of sorted) {
      if (selected.length >= count) break;
      if (!selected.some((s) => isOverlapping(s, c))) {
        selected.push(c);
      }
    }
    if (selected.length < count) {
      selected.push(sorted[selected.length % sorted.length]);
    }
  }

  return selected.slice(0, count);
}

export function resolveProofPriorities(ctx: PriorityContext): ProofPriority[] {
  const candidates: CandidateGap[] = [
    ...generateServiceCandidates(ctx),
    ...generateBuyerDoubtCandidates(ctx),
    ...generateOfferRiskCandidates(ctx),
  ];

  const selected = selectTopNonOverlapping(candidates, 3, ctx);

  if (selected.length < 3) {
    return generateFallbackPriorities(ctx);
  }

  return selected.map((c, i) => ({
    id: `priority_${i + 1}`,
    gapTitle: c.title,
    gapDescription: c.description,
    recommendedFormat: c.format,
    isCustom: false,
  }));
}

function generateFallbackPriorities(ctx: PriorityContext): ProofPriority[] {
  const pos = ctx.authorityPosition ?? 'builder';
  const offerType = ctx.offerType ?? 'one_time_project';
  const track = getServiceTrack(ctx.serviceId);
  const buyer = getBuyerLabel(ctx.marketId);
  const audience = getBuyerAudience(ctx.marketId);
  const deliverables = ctx.deliverables;
  const mechanism = ctx.uniqueMechanism.trim();
  const topDeliverables = pickTopDeliverables(deliverables);
  const deliverableLabel = topDeliverables.length > 0
    ? topDeliverables.join(' and ')
    : getServiceDefault(ctx.serviceId ?? '');

  const gaps: { title: string; description: string; format: ProofFormat }[] = [];

  if (pos === 'builder') {
    gaps.push({
      title: `Prove your ${deliverableLabel} quality through a concrete example`,
      description: `${capitalizeFirst(buyer)} need to see, not just hear about, the quality of your output. Build a sample that demonstrates your attention to detail, technical skill, and professional standards.`,

      format: 'demo_video',
    });
  } else if (pos === 'auditor') {
    gaps.push({
      title: 'Prove your diagnostic eye catches what others miss',
      description: `${capitalizeFirst(buyer)} need confidence that your analysis is thorough. Audit a public-facing example and document the issues you found, ranked by business impact.`,
      format: 'data_report',
    });
  } else if (pos === 'deconstructor') {
    gaps.push({
      title: 'Prove your analytical framework produces unique insights',
      description: `${capitalizeFirst(buyer)} want a thinking partner, not just a doer. Break down a successful example in your space and explain the strategic decisions that made it work.`,
      format: 'framework',
    });
  } else {
    gaps.push({
      title: 'Prove your execution process is repeatable and reliable',
      description: `${capitalizeFirst(buyer)} need to trust that you can deliver consistently. Walk through your complete process from intake to delivery, showing how you ensure quality every time.`,
      format: 'process_walkthrough',
    });
  }

  if (offerType === 'retainer') {
    gaps.push({
      title: 'Prove you maintain quality across recurring cycles',
      description: `${capitalizeFirst(buyer)} on retainer need consistency over weeks and months. Show a system for delivering the same high quality on a repeating schedule without burning out.`,
      format: 'process_walkthrough',
    });
  } else if (offerType === 'milestone_based') {
    gaps.push({
      title: 'Prove each phase of your project delivers standalone value',
      description: `${capitalizeFirst(buyer)} need every milestone to feel complete and useful. Show a phased approach where each stage produced a real, usable output.`,
      format: 'case_study',
    });
  } else {
    switch (track) {
      case 'editor':
        gaps.push({
          title: `Prove you can deliver polished ${deliverableLabel} from start to finish`,
          description: `${capitalizeFirst(buyer)} need confidence you can own a project end-to-end. Document a full editing lifecycle showing how you took raw footage to final delivery.`,
          format: 'case_study',
        });
        break;
      case 'developer':
        gaps.push({
          title: `Prove you can deliver complete ${deliverableLabel} from start to finish`,
          description: `${capitalizeFirst(buyer)} need confidence you can own a project end-to-end. Document a full build lifecycle showing how you took it from requirements to deployment.`,
          format: 'case_study',
        });
        break;
      case 'designer':
        gaps.push({
          title: `Prove you can deliver complete ${deliverableLabel} from start to finish`,
          description: `${capitalizeFirst(buyer)} need confidence you can own a project end-to-end. Document a full design lifecycle showing how you took it from brief to final output.`,
          format: 'case_study',
        });
        break;
      default:
        gaps.push({
          title: `Prove you can deliver complete ${deliverableLabel} from start to finish`,
          description: `${capitalizeFirst(buyer)} need confidence you can own a project end-to-end. Document a full project lifecycle showing how you took it from brief to delivery.`,
          format: 'case_study',
        });
        break;
    }
  }

  if (mechanism) {
    gaps.push({
      title: `Prove your "${mechanism}" approach changes the outcome`,
      description: `${capitalizeFirst(buyer)} are choosing you for your specific approach, not generic output. Compare your method against a common alternative and show how the results differ.`,
      format: 'comparison',
    });
  } else {
    gaps.push({
      title: `Prove you deliver ${deliverableLabel} designed for real market problems`,
      description: `${capitalizeFirst(buyer)} need proof that your work addresses their actual challenges, not just generic best practices. Show how you tailored your approach to a specific buyer need.`,
      format: 'educational_content',
    });
  }

  return gaps.slice(0, 3).map((g, i) => ({
    id: `priority_${i + 1}`,
    gapTitle: g.title,
    gapDescription: g.description,
    recommendedFormat: g.format,
    isCustom: false,
  }));
}

export function resolveAlternateGaps(
  serviceId: string | null,
  marketId: string | null,
): { gapTitle: string; gapDescription: string; recommendedFormat: ProofFormat }[] {
  const buyer = getBuyerLabel(marketId);
  const audience = getBuyerAudience(marketId);
  const service = serviceId ?? '';
  const track = getServiceTrack(serviceId);

  const alternates: { gapTitle: string; gapDescription: string; recommendedFormat: ProofFormat }[] = [];

  if (track === 'editor') {
    alternates.push({
      gapTitle: 'Prove you can maintain brand voice across content',
      gapDescription: `${capitalizeFirst(buyer)} need content that sounds like them, not a template. Show how you adapt your editing to match different brand voices and content styles.`,
      recommendedFormat: 'comparison',
    });
  }
  if (track === 'developer') {
    alternates.push({
      gapTitle: 'Prove your code is maintainable and scalable',
      gapDescription: `${capitalizeFirst(buyer)} care about what happens after launch. Show your code quality standards, documentation practices, and approach to building for long-term maintenance.`,
      recommendedFormat: 'process_walkthrough',
    });
  }
  if (track === 'designer') {
    alternates.push({
      gapTitle: 'Prove your design decisions are data-informed',
      gapDescription: `${capitalizeFirst(buyer)} want designs backed by reasoning, not just taste. Walk through how you use data, user research, or conversion principles to guide your design choices.`,
      recommendedFormat: 'framework',
    });
  }

  alternates.push({
    gapTitle: 'Prove your communication and revision process is smooth',
    gapDescription: `Prospects want to know what it is like to work with you. Show your feedback loop, revision handling, and how you keep projects moving without constant check-ins.`,
    recommendedFormat: 'process_walkthrough',
  });

  alternates.push({
    gapTitle: 'Prove you stay current with industry standards',
    gapDescription: `${capitalizeFirst(buyer)} want someone who knows modern best practices, not outdated methods. Demonstrate your knowledge of current tools, techniques, and industry trends.`,
    recommendedFormat: 'educational_content',
  });

  return alternates;
}
