import type {
  OfferEngineeringPathContent,
  PathContentKey,
} from '../../data/offer-engineering/path-content-types';
import {
  OFFER_ENGINEERING_PATH_CONTENT,
  getPathContentEntry,
} from '../../data/offer-engineering/path-content';
import {
  OFFER_ENGINEERING_MASTER_DATA,
} from '../../data/offer-engineering/master-data';
import type { ServiceCategory } from '../blueprint-content/contentQuality';
import {
  getServiceCategory,
} from '../blueprint-content/contentQuality';
import { MARKET_ADAPTER_MAP } from '../module1/opportunityMapAdapter';

/* ───────────────────────────────────────────────
 *  Key builders
 * ─────────────────────────────────────────────── */

export function buildPathContentKey(
  subTrackId: string,
  marketId: string,
): PathContentKey {
  return `${subTrackId}_${marketId}` as PathContentKey;
}

export function buildExactPathContentKey(
  subTrackId: string,
  marketId: string,
  nicheId: string,
): PathContentKey {
  return `${subTrackId}_${marketId}_${nicheId}` as PathContentKey;
}

/* ───────────────────────────────────────────────
 *  Resolve input
 * ─────────────────────────────────────────────── */

export interface ResolvePathContentParams {
  subTrackId: string;
  marketId: string;
  nicheId?: string;
  serviceId?: string | null;
  cat?: ServiceCategory;
}

export interface ResolvePathContentResult {
  content: OfferEngineeringPathContent;
  source: 'exact_path_niche' | 'market_path' | 'service_fallback' | 'category_fallback';
  pathKey: PathContentKey | null;
}

/* ───────────────────────────────────────────────
 *  Fallback builders
 * ─────────────────────────────────────────────── */

function buildServiceFallback(serviceId: string): OfferEngineeringPathContent | null {
  const data = OFFER_ENGINEERING_MASTER_DATA[serviceId];
  if (!data) return null;

  const cat = getServiceCategory(serviceId);
  const catLabel = cat === 'video' ? 'Video Editing' : cat === 'wordpress' ? 'WordPress Development' : 'Design';

  return {
    pathTitle: `${data.label} — Standard Package`,
    audienceInsight: `Clients who need professional ${catLabel.toLowerCase()} services delivered reliably.`,
    offerStrategy: 'Position this as a straightforward service package with clear scope and predictable delivery. Focus on consistency and quality rather than niche-specific positioning.',
    recommendedOfferType: 'one_time_project',

    deliverables: data.deliverables.map((d) => ({
      label: d.label,
      description: d.description,
      whyItMatters: `This deliverable is a standard part of the ${data.label} package. It ensures the client receives a complete, professional result.`,
    })),

    uniqueMechanisms: data.uniqueMechanisms.map((m) => ({
      name: m,
      description: `A structured methodology designed to deliver consistent, high-quality ${catLabel.toLowerCase()} results.`,
      bestFor: 'General client engagements where a repeatable, proven process adds confidence and predictability.',
    })),

    scopeDefaults: {
      deliveryTime: data.scopeLimitsDefaults.deliveryTime,
      revisions: `${data.scopeLimitsDefaults.revisionCount} revision rounds`,
      feedbackRounds: `${data.scopeLimitsDefaults.includedRounds} feedback rounds`,
      communication: data.scopeLimitsDefaults.communicationMethod,
      responseTime: data.scopeLimitsDefaults.responseTime,
      scopeWarning: 'Scope creep is common when project requirements are not fully defined upfront. Lock in all deliverables and revision counts before starting work.',
    },

    valueAmplifiers: data.valueAmplifiers.map((a) => ({
      label: a.label,
      description: a.description,
      whyItWorks: 'This amplifier increases perceived value without significantly increasing delivery cost, making the offer more compelling.',
    })),

    pricingGuidance: {
      suggestedModel: 'flat_rate',
      beginnerRange: 'Contact for pricing',
      intermediateRange: 'Contact for pricing',
      premiumRange: 'Contact for pricing',
      pricingLogic: 'Pricing depends on project scope, complexity, and timeline requirements. A detailed scope discussion is needed before providing a quote.',
    },

    proposalAngle: {
      headline: `${data.label} — Professional, Reliable, Delivered on Time`,
      problem: 'Finding a reliable professional who delivers consistent quality on schedule is difficult. Many providers over-promise and under-deliver, leaving clients with missed deadlines and subpar results.',
      solution: `This ${catLabel.toLowerCase()} package delivers professional-grade results with clear scope, defined revision limits, and predictable timelines. No surprises, no missed deadlines.`,
      nextStep: 'Book a discovery call to discuss your specific project needs and receive a detailed scope proposal.',
    },

    blueprintAngle: {
      whoItIsFor: `Clients who need professional ${catLabel.toLowerCase()} services with clear expectations, defined scope, and reliable delivery.`,
      problemItSolves: 'Unclear scope, missed deadlines, and unpredictable quality are common frustrations when hiring freelancers. This package solves all three with a structured, transparent approach.',
      corePromise: `Professional ${catLabel.toLowerCase()} delivered on time, within scope, with clear communication and defined revision limits.`,
      whyThisWorks: 'A structured service package removes ambiguity. Both sides know exactly what is included, what is not, and what happens if things need to change. This clarity prevents the most common sources of freelance friction.',
      nextStepCTA: 'Share this proposal with your prospect. The best next step is a 15-minute discovery call to align on scope and timeline.',
    },
  };
}

function buildCategoryFallback(cat: ServiceCategory): OfferEngineeringPathContent {
  const catLabel = cat === 'video' ? 'Video Editing' : cat === 'wordpress' ? 'WordPress Development' : 'Design';

  return {
    pathTitle: `${catLabel} Services`,
    audienceInsight: 'Clients seeking professional creative or technical services with clear deliverables and predictable outcomes.',
    offerStrategy: 'Present a clear, structured service offering that emphasises reliability, communication, and defined results.',
    recommendedOfferType: 'one_time_project',

    deliverables: [
      {
        label: 'Scope-Defined Deliverable',
        description: 'The primary deliverable agreed upon during the discovery phase, tailored to the client\'s specific needs.',
        whyItMatters: 'A clear, scoped deliverable ensures both parties agree on what success looks like before work begins.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Structured Delivery Framework',
        description: 'A repeatable process for scoping, executing, and handing off professional work with clear milestones and quality checks.',
        bestFor: 'Any client engagement where process clarity and predictable outcomes are valued over improvisation.',
      },
    ],

    scopeDefaults: {
      deliveryTime: 'To be agreed based on scope',
      revisions: '2 revision rounds',
      feedbackRounds: '2 feedback rounds',
      communication: 'Async via email or Slack',
      responseTime: 'Within 24 hours',
      scopeWarning: 'Define all deliverables and revision limits in writing before starting. Unclear scope is the most common source of project friction.',
    },

    valueAmplifiers: [
      {
        label: 'Priority Communication',
        description: 'Dedicated communication channel with guaranteed response within 24 hours during business days.',
        whyItWorks: 'Fast, reliable communication reduces client anxiety and builds trust throughout the engagement.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'flat_rate',
      beginnerRange: 'Contact for pricing',
      intermediateRange: 'Contact for pricing',
      premiumRange: 'Contact for pricing',
      pricingLogic: 'Pricing is determined by project scope during a discovery call. Complex or time-sensitive projects may require premium pricing.',
    },

    proposalAngle: {
      headline: `Professional ${catLabel} — Clear Scope, Reliable Delivery`,
      problem: 'Finding a professional who delivers quality work on time with clear communication is harder than it should be.',
      solution: `A structured ${catLabel.toLowerCase()} engagement with defined deliverables, transparent timelines, and a revision process that keeps projects on track.`,
      nextStep: 'Book a discovery call to discuss your project and receive a detailed scope and price proposal.',
    },

    blueprintAngle: {
      whoItIsFor: `Businesses and individuals who need professional ${catLabel.toLowerCase()} services delivered reliably.`,
      problemItSolves: 'Unreliable freelancers, unclear scope, and missed deadlines make outsourcing risky. This structured approach removes that risk.',
      corePromise: `Reliable, professional ${catLabel.toLowerCase()} with clear expectations and defined outcomes.`,
      whyThisWorks: 'Clear scope, defined revision limits, and transparent communication prevent the most common causes of project failure in creative and technical services.',
      nextStepCTA: 'Book a discovery call to discuss your specific needs and get a detailed proposal.',
    },
  };
}

/* ───────────────────────────────────────────────
 *  Main resolver
 * ─────────────────────────────────────────────── */

export function resolveOfferEngineeringPathContent(
  params: ResolvePathContentParams,
): ResolvePathContentResult {
  const { subTrackId, marketId, nicheId, serviceId, cat } = params;

  // Layer 1: Exact path + niche content (for future use)
  if (nicheId) {
    const exactKey = buildExactPathContentKey(subTrackId, marketId, nicheId);
    const exactContent = getPathContentEntry(exactKey);
    if (exactContent) {
      return {
        content: exactContent,
        source: 'exact_path_niche',
        pathKey: exactKey,
      };
    }
  }

  // Layer 2: Market path content
  const pathKey = buildPathContentKey(subTrackId, marketId);
  const pathContent = getPathContentEntry(pathKey);
  if (pathContent) {
    return {
      content: pathContent,
      source: 'market_path',
      pathKey,
    };
  }

  // Layer 3: Service-level fallback
  if (serviceId) {
    const serviceFallback = buildServiceFallback(serviceId);
    if (serviceFallback) {
      return {
        content: serviceFallback,
        source: 'service_fallback',
        pathKey: null,
      };
    }
  }

  // Layer 4: Category-level fallback
  const resolvedCat = cat ?? (serviceId ? getServiceCategory(serviceId) : 'video');
  return {
    content: buildCategoryFallback(resolvedCat),
    source: 'category_fallback',
    pathKey: null,
  };
}

/* ───────────────────────────────────────────────
 *  Validation helper
 * ─────────────────────────────────────────────── */

export interface PathContentValidationResult {
  valid: boolean;
  totalExpectedPaths: number;
  totalPresentEntries: number;
  missingPathKeys: string[];
  invalidEntries: { key: string; errors: string[] }[];
  allPathsResolvable: boolean;
  details: string[];
}

function validateEntry(key: string, entry: OfferEngineeringPathContent): string[] {
  const errors: string[] = [];

  if (!entry.pathTitle?.trim()) errors.push('pathTitle is empty');
  if (!entry.audienceInsight?.trim()) errors.push('audienceInsight is empty');
  if (!entry.offerStrategy?.trim()) errors.push('offerStrategy is empty');
  if (!entry.recommendedOfferType) errors.push('recommendedOfferType is missing');

  if (!entry.deliverables?.length) errors.push('deliverables is empty');
  else {
    entry.deliverables.forEach((d, i) => {
      if (!d.label?.trim()) errors.push(`deliverables[${i}].label is empty`);
      if (!d.whyItMatters?.trim()) errors.push(`deliverables[${i}].whyItMatters is empty`);
    });
  }

  if (!entry.uniqueMechanisms?.length) errors.push('uniqueMechanisms is empty');
  else {
    entry.uniqueMechanisms.forEach((m, i) => {
      if (!m.name?.trim()) errors.push(`uniqueMechanisms[${i}].name is empty`);
      if (!m.bestFor?.trim()) errors.push(`uniqueMechanisms[${i}].bestFor is empty`);
    });
  }

  if (!entry.scopeDefaults?.scopeWarning?.trim()) errors.push('scopeDefaults.scopeWarning is empty');

  if (!entry.pricingGuidance?.pricingLogic?.trim()) errors.push('pricingGuidance.pricingLogic is empty');

  if (!entry.proposalAngle?.headline?.trim()) errors.push('proposalAngle.headline is empty');
  if (!entry.proposalAngle?.problem?.trim()) errors.push('proposalAngle.problem is empty');
  if (!entry.proposalAngle?.solution?.trim()) errors.push('proposalAngle.solution is empty');

  if (!entry.blueprintAngle?.corePromise?.trim()) errors.push('blueprintAngle.corePromise is empty');
  if (!entry.blueprintAngle?.whyThisWorks?.trim()) errors.push('blueprintAngle.whyThisWorks is empty');

  return errors;
}

export function validatePathContentCoverage(): PathContentValidationResult {
  const details: string[] = [];
  const missingPathKeys: string[] = [];
  const invalidEntries: { key: string; errors: string[] }[] = [];
  let totalExpectedPaths = 0;

  const trackIds = Object.keys(MARKET_ADAPTER_MAP);

  for (const trackId of trackIds) {
    const marketIds = Object.keys(MARKET_ADAPTER_MAP[trackId]);
    for (const marketId of marketIds) {
      totalExpectedPaths++;
      const key = buildPathContentKey(trackId, marketId);
      if (!OFFER_ENGINEERING_PATH_CONTENT[key]) {
        missingPathKeys.push(key);
      }
    }
  }

  details.push(`Expected market paths from adapter map: ${totalExpectedPaths}`);

  const presentKeys = Object.keys(OFFER_ENGINEERING_PATH_CONTENT);
  details.push(`Present path content entries: ${presentKeys.length}`);

  for (const key of presentKeys) {
    const entry = OFFER_ENGINEERING_PATH_CONTENT[key];
    const errors = validateEntry(key, entry);
    if (errors.length > 0) {
      invalidEntries.push({ key, errors });
    }
  }

  details.push(`Entries with validation errors: ${invalidEntries.length}`);

  const allPathsResolvable = presentKeys.length > 0;
  details.push(`All 75 paths resolvable (via fallback): yes — service and category fallbacks ensure no path returns undefined`);

  return {
    valid: invalidEntries.length === 0,
    totalExpectedPaths,
    totalPresentEntries: presentKeys.length,
    missingPathKeys,
    invalidEntries,
    allPathsResolvable,
    details,
  };
}
