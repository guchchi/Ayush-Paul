/**
 * Module 3 — Personalized Content Composers
 *
 * Uses the Phase 1 shared Personalization Content System to generate
 * read-only UI guidance for each of the 5 Module 3 V2 Authority System steps.
 *
 * Fallback chain per spec:
 *   exact niche override → semantic composition → service + canonical market fallback
 *
 * This module must NOT:
 *   - Call any Zustand setters
 *   - Write to localStorage
 *   - Modify proof priorities or assets
 *   - Depend on Module 4
 */

import type {
  PersonalizationContext,
  PersonalizationContextM1,
  NicheSemanticMetadata,
} from '../personalization/types';
import { resolveServiceNiche } from '../personalization/resolver';
import {
  resolveM1Context,
  resolveM2Context,
  resolveM3Context,
  getServiceLabel,
  getAudienceLabel,
  getBuyerTerm,
} from '../personalization/context';
import type { AuthorityPosition, ProofFormat } from '../../types/module3';

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

/** Personalized content for Step 1 — Authority Position */
export interface Step1Content {
  /** Heading description */
  description: string;
  /** Rationale for the recommended position */
  positionRationale: string;
  /** Helper text shown above the core trust promise field */
  promiseHelperText: string;
  /** Placeholder for the core trust promise textarea */
  promisePlaceholder: string;
}

/** Personalized content for Step 2 — Proof Strategy */
export interface Step2Content {
  /** Heading description */
  description: string;
  /** Strategy rationale — why these 3 gaps */
  strategyRationale: string;
  /** Empty state guidance when no priorities are set */
  emptyStateGuidance: string;
  /** All-priorities-defined banner text */
  allDefinedBanner: string;
}

/** Personalized content for Step 3 — Proof Asset Builder */
export interface Step3Content {
  /** Heading description */
  description: string;
  /** Loading state text */
  loadingText: string;
  /** Section-specific helper text keyed by section name */
  sectionHelpers: Record<string, string>;
  /** Field placeholders keyed by field name */
  fieldPlaceholders: Record<string, string>;
  /** Status messages */
  status: {
    allAccepted: string;
    oneAccepted: string;
    noneAccepted: string;
  };
}

/** Personalized content for Step 4 — Profile & Portfolio */
export interface Step4Content {
  /** Heading description */
  description: string;
  /** Empty state guidance (before assets accepted) */
  emptyStateGuidance: string;
  /** Loading state text (while generating) */
  loadingText: string;
  /** Field-level helper text keyed by profile field */
  fieldHelpers: Record<string, string>;
  /** Section heading placeholder */
  sectionHeadingPlaceholder: string;
}

/** Personalized content for Step 5 — Authority Pack */
export interface Step5Content {
  /** Empty state guidance (before profile done) */
  emptyStateGuidance: string;
  /** Completed heading description */
  completedDescription: string;
  /** Checklist context guidance */
  checklistGuidance: string;
}

/** Union of all step content types */
export type Module3PersonalizedContent =
  | { step: 'authority_position'; content: Step1Content }
  | { step: 'proof_strategy'; content: Step2Content }
  | { step: 'proof_asset_builder'; content: Step3Content }
  | { step: 'profile_portfolio'; content: Step4Content }
  | { step: 'authority_pack'; content: Step5Content };

/* ──────────────────────────────────────────────
   Query helpers (exposed for JSX hook composition)
   ────────────────────────────────────────────── */

/** Build a PersonalizationContext from Module 3 store selectors */
export function buildPersonalizationContext(args: {
  serviceId: string | null;
  marketId: string | null;
  nicheId: string | null;
  positioning: string;
  offerType: string | null;
  deliverables: string[];
  uniqueMechanism: string;
  valueAmplifier: string;
  authorityPosition: string | null;
  coreTrustPromise: string;
  proofPriorities?: { id: string; gapTitle: string; gapDescription: string; recommendedFormat: string }[];
  proofAssets?: { id: string; title: string; assetType: string; isAccepted: boolean }[];
  professionalHeadline?: string;
  shortBio?: string;
  longBio?: string;
  offerStatement?: string;
  credibilityBullets?: string[];
  proofReferenceLine?: string;
  ctaLine?: string;
  portfolioCta?: string;
  portfolioSections?: { type: string; heading: string; body: string }[];
  isM3Completed?: boolean;
}): PersonalizationContext {
  const m1 = resolveM1Context({
    serviceId: args.serviceId,
    marketId: args.marketId,
    nicheId: args.nicheId,
    positioning: args.positioning,
  });
  const m2 = resolveM2Context({
    offerType: args.offerType,
    deliverables: args.deliverables,
    uniqueMechanism: args.uniqueMechanism,
    valueAmplifier: args.valueAmplifier,
  });
  const m3 = resolveM3Context({
    authorityPosition: args.authorityPosition,
    coreTrustPromise: args.coreTrustPromise,
    proofPriorities: args.proofPriorities,
    proofAssets: args.proofAssets,
    profileCopy: {
      professionalHeadline: args.professionalHeadline,
      shortBio: args.shortBio,
      longBio: args.longBio,
      offerStatement: args.offerStatement,
      credibilityBullets: args.credibilityBullets,
      proofReferenceLine: args.proofReferenceLine,
      ctaLine: args.ctaLine,
    },
    portfolioCopy: {
      portfolioCta: args.portfolioCta,
      sections: args.portfolioSections,
    },
    isCompleted: args.isM3Completed,
  });
  return {
    m1,
    m2,
    m3,
    derived: {
      audienceLabel: getAudienceLabel(args.marketId, args.serviceId),
      buyerTerm: getBuyerTerm(args.marketId, args.nicheId),
      category: 'design',
      track: 'designer',
    },
  };
}

/* ──────────────────────────────────────────────
   Internal helpers
   ────────────────────────────────────────────── */

function safeLabel(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  return value.replace(/_/g, ' ');
}

function pick<T>(items: T[], index: number): T | undefined {
  return items.length > 0 ? items[index % items.length] : undefined;
}

function fmtBuyerTerm(marketId: string | null, nicheId: string | null): string {
  if (nicheId) return safeLabel(nicheId, 'your market');
  if (marketId) return safeLabel(marketId, 'your market');
  return 'your market';
}

/* ──────────────────────────────────────────────
   Step 1 — Authority Position
   ────────────────────────────────────────────── */

const POSITION_RATIONALE_TEMPLATES: Record<string, (ctx: PersonalizationContext) => string> = {
  builder: (ctx) => {
    const buyer = ctx.derived.buyerTerm;
    const service = ctx.m1.serviceLabel || 'your service';
    if (ctx.m1.nicheId) {
      return `As a ${service} working with ${buyer}, the Builder position is a natural fit. ${buyer} need to see the quality of your craft — the raw edit, the clean integration, the polished output. Showcasing what you build, step by step, earns trust because ${buyer} evaluate based on tangible work, not theory.`;
    }
    return `The Builder position fits ${service} work — your market needs to see the quality of what you produce. Focus on demonstrating craft, structure, and the tangible outcomes of your work.`;
  },
  auditor: (ctx) => {
    const buyer = ctx.derived.buyerTerm;
    const service = ctx.m1.serviceLabel || 'your service';
    if (ctx.m1.nicheId) {
      return `As a ${service} for ${buyer}, the Auditor position works because ${buyer} need someone who can evaluate what they have and find improvements. Your market values measurable impact — showing before/after comparisons, performance data, and optimization results builds credibility.`;
    }
    return `The Auditor position fits when your market needs to see measurement and optimization. Show your ability to audit, find gaps, and deliver clear, data-backed improvements.`;
  },
  deconstructor: (ctx) => {
    const buyer = ctx.derived.buyerTerm;
    const service = ctx.m1.serviceLabel || 'your service';
    if (ctx.m1.nicheId) {
      return `For ${buyer} looking for a ${service}, the Deconstructor position shows you can break down complex challenges into clear solutions. ${buyer} want to understand the "why" behind your approach — frameworks, analyses, and structured thinking earn their trust.`;
    }
    return `The Deconstructor position works when your market values clarity and method. Show your ability to analyze, explain, and simplify what others find complex.`;
  },
  practitioner: (ctx) => {
    const buyer = ctx.derived.buyerTerm;
    const service = ctx.m1.serviceLabel || 'your service';
    if (ctx.m1.nicheId) {
      return `As a ${service} who works with ${buyer}, the Practitioner position is authentic — you're in the trenches doing the work daily. ${buyer} trust practitioners because you face the same challenges they do. Show real execution, real results, and real experience.`;
    }
    return `The Practitioner position fits when trust comes from doing the work yourself. Show real execution, real projects, and hands-on experience.`;
  },
};

function composePromiseHelperText(ctx: PersonalizationContext): string {
  const buyer = ctx.derived.buyerTerm;
  if (ctx.m1.nicheId) {
    return `What honest reason should ${buyer} have to believe you understand their specific challenges? Think about the unique context of ${buyer} and what would genuinely reassure them.`;
  }
  return `What honest reason should a prospect have to believe you understand this problem? Be specific — reference your experience, approach, or results.`;
}

function composePromisePlaceholder(ctx: PersonalizationContext): string {
  const buyer = ctx.derived.buyerTerm;
  if (ctx.m1.nicheId) {
    return `${buyer} can trust me because I...`;
  }
  return 'My prospects can trust me because I...';
}

/* ──────────────────────────────────────────────
   Step 2 — Proof Strategy
   ────────────────────────────────────────────── */

function composeStrategyRationale(ctx: PersonalizationContext): string {
  const buyer = fmtBuyerTerm(ctx.m1.marketId, ctx.m1.nicheId);
  const service = ctx.m1.serviceLabel || 'your service';
  const niches = ctx.m1.nicheId;
  if (niches) {
    return `When ${buyer} evaluate a ${service}, they typically have 3 core doubts: do you understand their specific context, can you deliver quality work in their domain, and is the investment worth it. These priorities address each concern directly for ${buyer}.`;
  }
  return `When prospects evaluate a ${service}, they typically have 3 core doubts: do you understand their needs, can you deliver quality work, and is the investment worth it. These priorities address each concern directly.`;
}

function composeAllDefinedBanner(ctx: PersonalizationContext): string {
  const buyer = fmtBuyerTerm(ctx.m1.marketId, ctx.m1.nicheId);
  return `All 3 credibility gaps defined for ${buyer}. You can edit any priority or swap formats — these will become the foundation of your proof assets.`;
}

/* ──────────────────────────────────────────────
   Step 3 — Proof Asset Builder
   ────────────────────────────────────────────── */

function composeSectionHelpers(ctx: PersonalizationContext): Record<string, string> {
  const buyer = fmtBuyerTerm(ctx.m1.marketId, ctx.m1.nicheId);
  const nicheMeta = ctx.m1.nicheId
    ? resolveServiceNiche(ctx.m1.serviceId, ctx.m1.marketId, ctx.m1.nicheId, ctx.m1.nicheLabel).nicheResolution
    : null;
  const nicheProofEmphasis = nicheMeta?.metadata?.proofEmphasis;

  return {
    proof_objective: nicheProofEmphasis
      ? `Define who this asset speaks to and what problem it solves. ${buyer} respond best to evidence of ${nicheProofEmphasis.slice(0, 2).join(' and ')}.`
      : `Define who this asset speaks to and what business problem it solves. Be specific about the audience and the pain point.`,
    project_brief: buyer
      ? `Describe the project scenario, starting materials, and key deliverables. Frame it in terms ${buyer} will recognize from their own context.`
      : `Describe the project scenario, starting materials, and what you delivered. Be concrete and detailed.`,
    execution_plan: buyer
      ? `Lay out the order of operations. ${buyer} value clarity on how work gets done — show your process step by step.`
      : `Lay out the order of operations. Show your process with clear, sequential steps.`,
    evidence: nicheProofEmphasis
      ? `Document what proves the outcome and how you captured it. ${buyer} trust evidence of ${nicheProofEmphasis.slice(0, 2).join(' and ')}.`
      : `Document what proves the result and how you captured the process. Specific evidence builds credibility.`,
    presentation: buyer
      ? `Structure how this project is presented. ${buyer} appreciate organized, scannable proof of capability.`
      : `Structure the presentation to tell a clear story — problem, approach, result.`,
    completion: `Track everything needed to consider this proof asset complete and ready to publish.`,
  };
}

function composeFieldPlaceholders(ctx: PersonalizationContext): Record<string, string> {
  const buyer = fmtBuyerTerm(ctx.m1.marketId, ctx.m1.nicheId);
  const service = ctx.m1.serviceLabel || 'this service';

  return {
    target_audience: `Who is the specific audience for this project? (e.g., ${buyer})`,
    business_problem: `What specific problem did this project solve for ${buyer}?`,
    title: `A clear, descriptive title for this proof asset`,
    scenario: `Describe the context and situation. What led to this project with ${buyer}?`,
    starting_material: `What raw materials or inputs did you start with?`,
    deliverables: `What specific deliverables did you produce?`,
    execution_steps: `List the key execution steps in order`,
    evidence_to_capture: `What evidence demonstrates success?`,
    process_to_document: `What parts of the process should be documented?`,
    what_not_to_claim: `What claims should you avoid for ${buyer}?`,
    presentation_structure: `How should this proof asset be structured?`,
    completion_checklist: `What needs to be done to finish this asset?`,
    portfolio_headline: `A headline that ${buyer} would find compelling`,
    project_description: `Brief project description highlighting what matters to ${buyer}`,
    proof_statement: `State clearly what was achieved and how it was measured`,
    cta: `What should ${buyer} do after seeing this?`,
  };
}

function composeStatusMessages(ctx: PersonalizationContext): Step3Content['status'] {
  const buyer = fmtBuyerTerm(ctx.m1.marketId, ctx.m1.nicheId);
  return {
    allAccepted: `All 3 proof assets accepted and ready for ${buyer} to review.`,
    oneAccepted: `This asset is accepted. Review the remaining proofs before continuing.`,
    noneAccepted: `Review each asset carefully. When ${buyer} sees these, they should immediately understand your capability.`,
  };
}

/* ──────────────────────────────────────────────
   Step 4 — Profile & Portfolio
   ────────────────────────────────────────────── */

function composeFieldHelpers(ctx: PersonalizationContext): Record<string, string> {
  const buyer = fmtBuyerTerm(ctx.m1.marketId, ctx.m1.nicheId);
  const service = ctx.m1.serviceLabel || 'your service';

  return {
    professional_headline: `This is the first thing ${buyer} see. State your role and the value you provide, specifically for ${buyer}.`,
    short_bio: `A 2-3 sentence summary of who you are, what you do as a ${service}, and who you serve. Make it clear why ${buyer} should care.`,
    long_bio: `Detailed background covering your experience, approach, and what makes you different. Connect your story to ${buyer}`,
    offer_statement: `A clear statement of what you offer as a ${service} and the specific value ${buyer} get from working with you.`,
    credibility_bullets: `Specific, verifiable points that prove your capability to ${buyer}. Lead with results.`,
    proof_reference_line: `A short line pointing ${buyer} to your proof assets or portfolio for verification.`,
    cta_line: `The next step you want ${buyer} to take after reading your profile.`,
    portfolio_cta: `What should ${buyer} do after viewing your portfolio? Be specific.`,
    section_heading: `A heading that ${buyer} will recognize and relate to`,
  };
}

/* ──────────────────────────────────────────────
   Step 5 — Authority Pack
   ────────────────────────────────────────────── */

function composeChecklistGuidance(ctx: PersonalizationContext): string {
  const buyer = fmtBuyerTerm(ctx.m1.marketId, ctx.m1.nicheId);
  return `Follow these steps to compile and publish your authority materials. Each checked item brings you closer to a complete trust presence for ${buyer}.`;
}

/* ──────────────────────────────────────────────
   Public composers
   ────────────────────────────────────────────── */

/**
 * Compose Step 1 — Authority Position personalized content.
 * Does NOT use the Phase 2 Module 4 bridge. Uses only M1 + M2 + M3 context.
 */
export function composeStep1Content(ctx: PersonalizationContext): Step1Content {
  const service = ctx.m1.serviceLabel || 'your service';

  const description = `Choose the credibility position that best matches how you work as a ${service} and what you can honestly demonstrate to your market.`;

  const positionRationale = ctx.m1.nicheId
    ? `Based on your work with ${ctx.derived.buyerTerm}, the recommended position aligns with how ${ctx.derived.buyerTerm} evaluate trust.`
    : `Based on your service and market, the recommended position aligns with how your audience evaluates trust.`;

  return {
    description,
    positionRationale,
    promiseHelperText: composePromiseHelperText(ctx),
    promisePlaceholder: composePromisePlaceholder(ctx),
  };
}

/**
 * Compose Step 2 — Proof Strategy personalized content.
 */
export function composeStep2Content(ctx: PersonalizationContext): Step2Content {
  const buyer = fmtBuyerTerm(ctx.m1.marketId, ctx.m1.nicheId);

  return {
    description: `These are the 3 credibility gaps ${buyer} need you to prove before they hire you. Each one addresses a specific doubt ${buyer} may have.`,
    strategyRationale: composeStrategyRationale(ctx),
    emptyStateGuidance: `Complete Step 1 (Authority Position) first to generate your proof strategy for ${buyer}.`,
    allDefinedBanner: composeAllDefinedBanner(ctx),
  };
}

/**
 * Compose Step 3 — Proof Asset Builder personalized content.
 */
export function composeStep3Content(ctx: PersonalizationContext): Step3Content {
  const buyer = fmtBuyerTerm(ctx.m1.marketId, ctx.m1.nicheId);

  return {
    description: `Build and refine 3 execution-ready proof assets for ${buyer}. Each asset addresses one of the credibility gaps your market needs to see.`,
    loadingText: `Generating proof assets for ${buyer}...`,
    sectionHelpers: composeSectionHelpers(ctx),
    fieldPlaceholders: composeFieldPlaceholders(ctx),
    status: composeStatusMessages(ctx),
  };
}

/**
 * Compose Step 4 — Profile & Portfolio personalized content.
 */
export function composeStep4Content(ctx: PersonalizationContext): Step4Content {
  const buyer = fmtBuyerTerm(ctx.m1.marketId, ctx.m1.nicheId);

  return {
    description: `Finalize your platform-agnostic profile and portfolio copy for ${buyer}. These assets will speak directly to your market.`,
    emptyStateGuidance: `Accept all 3 proof assets in Step 3 first so your profile and portfolio can be built around the evidence ${buyer} needs to see.`,
    loadingText: `Generating your profile and portfolio copy for ${buyer}...`,
    fieldHelpers: composeFieldHelpers(ctx),
    sectionHeadingPlaceholder: `A heading ${buyer} would recognize`,
  };
}

/**
 * Compose Step 5 — Authority Pack personalized content.
 */
export function composeStep5Content(ctx: PersonalizationContext): Step5Content {
  const buyer = fmtBuyerTerm(ctx.m1.marketId, ctx.m1.nicheId);

  return {
    emptyStateGuidance: `Complete your profile and portfolio copy in Step 4 first so the compiled pack speaks directly to ${buyer}.`,
    completedDescription: `Your trust position, proof plan, profile copy, and portfolio structure are compiled into one execution pack for ${buyer}.`,
    checklistGuidance: composeChecklistGuidance(ctx),
  };
}
