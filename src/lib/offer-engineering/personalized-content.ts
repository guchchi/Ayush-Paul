import type { PersonalizationContext, NicheSemanticMetadata } from '../personalization/types';
import { resolvePersonalizationContext, resolveM1Context, resolveM2Context, getMarketLabel } from '../personalization/context';
import { resolveServiceContentProfile, resolveCanonicalMarketModifier } from '../../data/personalization';
import { resolveNicheMetadata } from '../../data/personalization/niche-semantic-metadata';
import { composeExamples, composeHelperText, composeEmptyStateGuidance } from '../personalization/resolver';

/* ──────────────────────────────────────────────
   Resolve Module 2 Personalization Context
   Only M1 + M2 — NO M3 / M4 dependency
   ────────────────────────────────────────────── */

export interface M2PersonalizationInput {
  careerTrackId?: string | null;
  serviceId?: string | null;
  marketId?: string | null;
  nicheId?: string | null;
  positioning?: string;
  offerType?: string | null;
  deliverables?: string[];
  uniqueMechanism?: string;
  scopeLimits?: {
    revisionCount?: number;
    deliveryTime?: string;
    communicationMethod?: string;
    responseTime?: string;
    includedRounds?: number;
  } | null;
  valueAmplifier?: string;
  pricingModel?: string | null;
  finalPrice?: number | null;
}

export function resolveM2PersonalizationContext(input: M2PersonalizationInput): PersonalizationContext {
  const m1 = resolveM1Context({
    careerTrackId: input.careerTrackId,
    serviceId: input.serviceId,
    marketId: input.marketId,
    nicheId: input.nicheId,
    positioning: input.positioning,
  });
  const m2 = resolveM2Context({
    offerType: input.offerType,
    deliverables: input.deliverables,
    uniqueMechanism: input.uniqueMechanism,
    scopeLimits: input.scopeLimits ?? undefined,
    valueAmplifier: input.valueAmplifier,
    pricingModel: input.pricingModel,
    finalPrice: input.finalPrice,
  });
  return resolvePersonalizationContext(m1, m2);
}

/* ──────────────────────────────────────────────
   Resolve niche metadata (read-only, null-safe)
   ────────────────────────────────────────────── */

function resolveNicheForM2(serviceId: string | null, marketId: string | null, nicheId: string | null): { metadata: NicheSemanticMetadata | null; tier: string } | null {
  if (!nicheId) return null;
  try {
    return resolveNicheMetadata(nicheId, '', serviceId ?? '', marketId ?? '');
  } catch {
    return null;
  }
}

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

function fmtBuyerTerm(marketId: string | null, nicheId: string | null): string {
  if (nicheId) return nicheId.replace(/_/g, ' ');
  const label = getMarketLabel(marketId).toLowerCase();
  return label || 'your clients';
}

/** Format an offer type as a readable label */
function fmtOfferType(type: string | null): string {
  const map: Record<string, string> = {
    retainer: 'retainer',
    one_time_project: 'one-time project',
    milestone_based: 'milestone-based',
  };
  return map[type ?? ''] || 'engagement';
}

/* ============================================================
   STEP 1 — OFFER TYPE
   ============================================================ */

export interface Step1PersonalizedContent {
  recommendationRationale: string;
  offerTypeExamples: Record<string, string>;
  helperText: string;
}

export function composeStep1Content(input: M2PersonalizationInput): Step1PersonalizedContent {
  const pc = resolveM2PersonalizationContext(input);
  const profile = resolveServiceContentProfile(pc.m1.serviceId);
  const marketMod = resolveCanonicalMarketModifier(pc.m1.marketId ?? '');
  const nicheRes = resolveNicheForM2(pc.m1.serviceId, pc.m1.marketId, pc.m1.nicheId);
  const buyerTerm = fmtBuyerTerm(pc.m1.marketId, pc.m1.nicheId);
  const serviceLabel = pc.m1.serviceLabel.toLowerCase();
  const workNoun = profile.workNouns.slice(0, 1).join(', ') || 'deliverables';
  const outputTerm = profile.outputTerms.slice(0, 1).join(', ') || 'work';

  /* Build examples keeping them materially different per service */
  const examples1 = composeExamples(pc.m1.serviceId, nicheRes?.metadata ?? null, 2, `${pc.m1.serviceId}_offer_type`);

  const recommendationRationale = `Recommended for your setup because ${buyerTerm} typically need ongoing ${serviceLabel} support. ${marketMod.buyerQuestions[0] ?? 'Consistency matters for their workflow.'} As a ${serviceLabel}, your ${profile.executionTerms.slice(0, 1).join(', ') || 'work'} ensures reliable ${outputTerm} delivery.`;

  const offerTypeExamples: Record<string, string> = {
    retainer: `Ongoing monthly ${workNoun} delivery — e.g. ${examples1[0] || profile.commonOutputs.slice(0, 1).join(', ') || 'regular output'} refreshed each cycle, with predictable scheduling for ${buyerTerm}.`,
    one_time_project: `Defined ${outputTerm} scope — e.g. a complete ${workNoun} project with clear deliverables and a fixed timeline for ${buyerTerm}.`,
    milestone_based: `Phased ${outputTerm} delivery — e.g. split a large ${workNoun} engagement into stages, each with its own review and payment checkpoint for ${buyerTerm}.`,
  };

  const helperText = `For ${serviceLabel}, the key difference is how ${buyerTerm} consume your ${workNoun}. Retainers suit ongoing ${outputTerm} needs, one-time projects fit defined scopes, and milestone-based works for complex multi-stage ${workNoun} engagements.`;

  return { recommendationRationale, offerTypeExamples, helperText };
}

/* ============================================================
   STEP 2 — DELIVERABLES
   ============================================================ */

export interface Step2PersonalizedContent {
  suggestionRationale: string;
  exampleGuidance: string;
  helperText: string;
  placeholderHint: string;
}

export function composeStep2Content(input: M2PersonalizationInput): Step2PersonalizedContent {
  const pc = resolveM2PersonalizationContext(input);
  const profile = resolveServiceContentProfile(pc.m1.serviceId);
  const marketMod = resolveCanonicalMarketModifier(pc.m1.marketId ?? '');
  const nicheRes = resolveNicheForM2(pc.m1.serviceId, pc.m1.marketId, pc.m1.nicheId);
  const buyerTerm = fmtBuyerTerm(pc.m1.marketId, pc.m1.nicheId);
  const serviceLabel = pc.m1.serviceLabel.toLowerCase();
  const workNoun = profile.workNouns.slice(0, 1).join(', ') || 'work';
  const outputTerms = profile.outputTerms.slice(0, 2).join(' and ') || 'outputs';
  const commonOutputs = profile.commonOutputs.slice(0, 1).join(', ') || outputTerms;
  const executionTerms = profile.executionTerms.slice(0, 2).join(' and ') || 'work';

  const nicheContext = nicheRes?.metadata?.contentContexts?.slice(0, 2).join(', ');

  const suggestionRationale = `These deliverables are selected because they address what ${buyerTerm} need from ${serviceLabel}: ${marketMod.concernThemes.slice(0, 2).join(' and ')}. Your approach using ${executionTerms} determines the output format.${nicheContext ? ` For ${fmtBuyerTerm(pc.m1.marketId, pc.m1.nicheId)}, context like ${nicheContext} shapes the deliverables.` : ''}`;

  const exampleGuidance = `For ${serviceLabel}, common deliverables include ${outputTerms}. ${profile.commonInputs.slice(0, 1).join(', ') ? `You typically work with ${profile.commonInputs.slice(0, 1).join(', ')} to produce ${profile.commonOutputs.slice(0, 2).join(' and ')}.` : `Focus on ${executionTerms} as core outputs.`}`;

  const helperText = `Choose 3\u20135 core deliverables that represent the complete scope of ${serviceLabel} for ${buyerTerm}. Include the ${commonOutputs} and any supporting items like ${profile.workNouns.slice(1, 2).join(', ') || 'project files'}. Too few feels thin, too many dilutes focus.`;

  const placeholderHint = `e.g. ${profile.commonOutputs.slice(0, 1).join(', ')} with ${executionTerms}`;

  return { suggestionRationale, exampleGuidance, helperText, placeholderHint };
}

/* ============================================================
   STEP 3 — UNIQUE MECHANISM
   ============================================================ */

export interface Step3PersonalizedContent {
  mechanismRationale: string;
  namingExamples: string[];
  helperText: string;
}

export function composeStep3Content(input: M2PersonalizationInput): Step3PersonalizedContent {
  const pc = resolveM2PersonalizationContext(input);
  const profile = resolveServiceContentProfile(pc.m1.serviceId);
  const marketMod = resolveCanonicalMarketModifier(pc.m1.marketId ?? '');
  const nicheRes = resolveNicheForM2(pc.m1.serviceId, pc.m1.marketId, pc.m1.nicheId);
  const buyerTerm = fmtBuyerTerm(pc.m1.marketId, pc.m1.nicheId);
  const serviceLabel = pc.m1.serviceLabel.toLowerCase();
  const workNoun = profile.workNouns.slice(0, 1).join(', ') || 'work';
  const executionTerms = profile.executionTerms.slice(0, 2).join(' and ') || 'process';

  const currentOffer = input.offerType ? fmtOfferType(input.offerType) : '';
  const nicheTheme = nicheRes?.metadata?.domainThemes?.slice(0, 1).join(', ') || '';

  const mechanismRationale = `A named system differentiates your ${serviceLabel} from generic ${workNoun} services. For ${buyerTerm}, the concern is ${marketMod.concernThemes.slice(0, 1).join(', ') || 'quality and reliability'}. Your ${executionTerms} approach becomes a repeatable methodology.${nicheTheme ? ` ${nicheTheme} expertise makes it distinctive.` : ''}${currentOffer ? ` This ${currentOffer} structure benefits from a clear name.` : ''}`;

  const namingExamples = [
    `${serviceLabel.replace(/(?:^|\s)\S/g, (c) => c.toUpperCase())} Delivery System`,
    `${buyerTerm.replace(/(?:^|\s)\S/g, (c) => c.toUpperCase())}-First ${executionTerms.replace(/(?:^|\s)\S/g, (c) => c.toUpperCase())}`,
    `Structured ${profile.outputTerms.slice(0, 1).join(', ').replace(/(?:^|\s)\S/g, (c) => c.toUpperCase())} Framework`,
  ];

  const helperText = `Your unique mechanism is how you organize your ${serviceLabel} delivery. It names ${executionTerms} as a repeatable system, not a secret formula. ${buyerTerm} recognise a structured approach and pay a premium for it.`;

  return { mechanismRationale, namingExamples, helperText };
}

/* ============================================================
   STEP 4 — SCOPE PROTECTION
   ============================================================ */

export interface Step4PersonalizedContent {
  loadDefaultsExplanation: string;
  fieldHelpers: Record<string, string>;
  fieldPlaceholders: Record<string, string>;
  emptyGuidance: string;
}

export function composeStep4Content(input: M2PersonalizationInput): Step4PersonalizedContent {
  const pc = resolveM2PersonalizationContext(input);
  const profile = resolveServiceContentProfile(pc.m1.serviceId);
  const buyerTerm = fmtBuyerTerm(pc.m1.marketId, pc.m1.nicheId);
  const serviceLabel = pc.m1.serviceLabel.toLowerCase();
  const workNoun = profile.workNouns.slice(0, 1).join(', ') || 'work';
  const outputTerm = profile.outputTerms.slice(0, 1).join(', ') || 'output';

  const scopePhrase = profile.outputTerms.slice(0, 1).join(', ') || outputTerm;
  const loadDefaultsExplanation = `These defaults are tailored to protect your ${serviceLabel} process. They define how many ${profile.executionTerms.slice(0, 1).join(', ') || workNoun} revisions are included, delivery timing based on ${scopePhrase}, and communication expectations so ${buyerTerm} know the boundaries upfront.`;

  const fieldHelpers: Record<string, string> = {
    deliveryTime: `Set this based on how long a single ${outputTerm} typically takes, including review and polish time.`,
    revisionCount: `Define the number of revision rounds ${buyerTerm} can request per ${workNoun} item.`,
    includedRounds: `Structural feedback rounds for larger scope changes before detailed work begins.`,
    communicationMethod: `Choose where ${buyerTerm} send feedback and requests for ${serviceLabel} work.`,
    responseTime: `Define how fast you typically reply to ${buyerTerm} during active ${workNoun} delivery.`,
  };

  const fieldPlaceholders: Record<string, string> = {
    deliveryTime: `e.g. ${profile.executionTerms.slice(0, 1).join(', ') || '48'} hours per ${workNoun}`,
    revisionCount: 'e.g. 2',
    includedRounds: 'e.g. 2',
    communicationMethod: `e.g. Async via Slack`,
    responseTime: 'e.g. Within 24 hours',
  };

  const emptyGuidance = `Define how ${buyerTerm} interact with your ${serviceLabel} process. Set realistic boundaries for ${workNoun} delivery, revision cycles, and response expectations.`;

  return { loadDefaultsExplanation, fieldHelpers, fieldPlaceholders, emptyGuidance };
}

/* ============================================================
   STEP 5 — VALUE AMPLIFIER
   ============================================================ */

export interface Step5PersonalizedContent {
  amplifierRationale: string;
  examples: string[];
  emptyGuidance: string;
}

export function composeStep5Content(input: M2PersonalizationInput): Step5PersonalizedContent {
  const pc = resolveM2PersonalizationContext(input);
  const profile = resolveServiceContentProfile(pc.m1.serviceId);
  const marketMod = resolveCanonicalMarketModifier(pc.m1.marketId ?? '');
  const nicheRes = resolveNicheForM2(pc.m1.serviceId, pc.m1.marketId, pc.m1.nicheId);
  const buyerTerm = fmtBuyerTerm(pc.m1.marketId, pc.m1.nicheId);
  const serviceLabel = pc.m1.serviceLabel.toLowerCase();
  const workNoun = profile.workNouns.slice(0, 1).join(', ') || 'work';
  const outputTerm = profile.outputTerms.slice(0, 1).join(', ') || 'output';

  const amplifiers = composeExamples(pc.m1.serviceId, nicheRes?.metadata ?? null, 2, `${pc.m1.serviceId}_amplifier`);

  const amplifierRationale = `The right amplifier reinforces your ${serviceLabel} offer by addressing ${buyerTerm}'s need for ${marketMod.concernThemes.slice(0, 1).join(', ') || 'value'}. Your ${profile.executionTerms.slice(0, 1).join(', ') || 'delivery'} process makes a specific type of bonus natural.${nicheRes?.metadata?.proofEmphasis?.slice(0, 1).join(', ') ? ` For ${fmtBuyerTerm(pc.m1.marketId, pc.m1.nicheId)}, ${nicheRes.metadata.proofEmphasis.slice(0, 1).join(', ')} is a strong angle.` : ''} The amplifier should complement your core ${outputTerm} without becoming the main deliverable.`;

  const examples = amplifiers.length >= 2
    ? amplifiers
    : [
        `${profile.commonOutputs.slice(0, 1).join(', ') || outputTerm} delivery checklist for ${buyerTerm}`,
        `Quick ${profile.executionTerms.slice(0, 1).join(', ') || 'review'} session after final ${workNoun} handoff`,
      ];

  const emptyGuidance = `For ${serviceLabel}, a good amplifier adds perceived value without changing your core ${outputTerm}. Think of something ${buyerTerm} would find useful — like ${examples.slice(0, 1).join(', ')}. Avoid making it the main deliverable.`;

  return { amplifierRationale, examples, emptyGuidance };
}

/* ============================================================
   STEP 6 — PRICING
   ============================================================ */

export interface Step6PersonalizedContent {
  flatRateHelper: string;
  tieredHelper: string;
  valueBasedHelper: string;
}

export function composeStep6Content(input: M2PersonalizationInput): Step6PersonalizedContent {
  const pc = resolveM2PersonalizationContext(input);
  const profile = resolveServiceContentProfile(pc.m1.serviceId);
  const buyerTerm = fmtBuyerTerm(pc.m1.marketId, pc.m1.nicheId);
  const serviceLabel = pc.m1.serviceLabel.toLowerCase();
  const outputTerm = profile.outputTerms.slice(0, 1).join(', ') || 'output';
  const workNoun = profile.workNouns.slice(0, 1).join(', ') || 'work';

  const flatRateHelper = `For ${serviceLabel}, a flat rate prices the entire ${outputTerm} scope at one figure. This works when ${buyerTerm} get a defined set of ${workNoun} with clear boundaries. Set the price based on your complete deliverable package.`;

  const tieredHelper = `Tiers let ${buyerTerm} choose a ${serviceLabel} scope level. Starter covers essential ${workNoun}, Pro adds depth and faster turnaround, Premium includes full-service ${outputTerm} with priority support. Each tier maps to a different ${outputTerm} scope.`;

  const valueBasedHelper = `Value-based pricing ties your ${serviceLabel} fee to the measurable impact for ${buyerTerm}. Before using this model, be clear on what specific ${workNoun} outcomes you deliver and how they affect ${buyerTerm}'s results. This requires evidence of past value.`;

  return { flatRateHelper, tieredHelper, valueBasedHelper };
}

/* ============================================================
   STEP 7 — PROPOSAL SUMMARY
   ============================================================ */

export interface Step7PersonalizedContent {
  reviewGuidance: Record<string, string>;
  nextActionGuidance: string;
}

export function composeStep7Content(input: M2PersonalizationInput): Step7PersonalizedContent {
  const pc = resolveM2PersonalizationContext(input);
  const profile = resolveServiceContentProfile(pc.m1.serviceId);
  const marketMod = resolveCanonicalMarketModifier(pc.m1.marketId ?? '');
  const nicheRes = resolveNicheForM2(pc.m1.serviceId, pc.m1.marketId, pc.m1.nicheId);
  const buyerTerm = fmtBuyerTerm(pc.m1.marketId, pc.m1.nicheId);
  const serviceLabel = pc.m1.serviceLabel.toLowerCase();
  const workNoun = profile.workNouns.slice(0, 1).join(', ') || 'work';
  const outputTerm = profile.outputTerms.slice(0, 1).join(', ') || 'output';

  const reviewGuidance: Record<string, string> = {
    headline: `${buyerTerm} should immediately understand this is a ${serviceLabel} offer for them. Reference ${nicheRes?.metadata?.domainThemes?.slice(0, 1).join(', ') || marketMod.concernThemes.slice(0, 1).join(', ') || 'their needs'} and your ${profile.executionTerms.slice(0, 1).join(', ') || 'approach'} in the headline.`,
    problem: `Describe the specific ${workNoun} challenge ${buyerTerm} face with their ${profile.commonInputs.slice(0, 1).join(', ') || 'current process'}. ${marketMod.buyerQuestions[0] ? `Frame it around: "${marketMod.buyerQuestions[0]}"` : ''}`,
    solution: `Explain how your ${serviceLabel} deliverables address the problem with ${profile.executionTerms.slice(0, 1).join(', ') || 'your approach'}. ${pc.m2?.uniqueMechanism ? `Reference "${pc.m2.uniqueMechanism}" as the methodology.` : 'Name the key deliverables and how they solve the issue.'}`,
    timeline: `Set clear delivery expectations based on your ${profile.executionTerms.slice(0, 1).join(', ') || workNoun} scope. ${buyerTerm} need predictability.`,
    pricing: `Show ${buyerTerm} the value of your ${outputTerm}: ${pc.m2?.pricingModel === 'tiered' ? 'tiered options let them choose the right scope level' : pc.m2?.pricingModel === 'value_based' ? 'value-based pricing ties fee to impact' : 'a clear flat rate builds trust'}.`,
    nextSteps: `Tell ${buyerTerm} exactly what happens next. ${marketMod.ctaIntentTendencies[0]?.replace(/_/g, ' ') || 'Schedule a quick call to confirm fit'} is a natural next action for ${serviceLabel}.`,
  };

  const nextActionGuidance = `Review each section to confirm the offer speaks to ${buyerTerm}'s specific ${workNoun} needs. ${nicheRes?.metadata?.languageTerms?.slice(0, 2).join(' and ') ? `Using language like "${nicheRes.metadata.languageTerms.slice(0, 2).join(' and ')}" helps resonate.` : ''} Ensure every section is complete before generating the blueprint.`;

  return { reviewGuidance, nextActionGuidance };
}

/* ============================================================
   STEP 8 — OFFER BLUEPRINT
   ============================================================ */

export interface Step8PersonalizedContent {
  executionGuidance: string;
  reviewGuidance: string;
  nextActionHelper: string;
}

export function composeStep8Content(input: M2PersonalizationInput): Step8PersonalizedContent {
  const pc = resolveM2PersonalizationContext(input);
  const profile = resolveServiceContentProfile(pc.m1.serviceId);
  const buyerTerm = fmtBuyerTerm(pc.m1.marketId, pc.m1.nicheId);
  const serviceLabel = pc.m1.serviceLabel.toLowerCase();
  const workNoun = profile.workNouns.slice(0, 1).join(', ') || 'work';
  const outputTerm = profile.outputTerms.slice(0, 1).join(', ') || 'output';

  const scopePhrase = `the ${outputTerm} scope and ${workNoun} revision boundaries`;

  const tooltips: Record<string, string> = {
    editor: `your offer must clearly define content and ${outputTerm} scope, revision limits, and delivery timeline. ${buyerTerm} need to know exactly what each ${workNoun} includes.`,
    developer: `your offer must define implementation scope, functional boundaries, and handoff criteria. ${buyerTerm} evaluate whether the ${outputTerm} solves their technical need.`,
    designer: `your offer must define design outputs, application scope, revision rounds, and file handoff. ${buyerTerm} need clarity on what ${workNoun} they receive.`,
  };
  const trackGuidance = tooltips[pc.derived.track] || `verify ${scopePhrase} are clearly stated.`;

  const executionGuidance = `Before moving to the Authority System, verify ${trackGuidance}`;

  const reviewGuidance = `Review all ${serviceLabel} offer details with ${buyerTerm} in mind. Confirm ${scopePhrase} match their expectations. Ensure the value amplifier complements rather than replaces core ${outputTerm}.`;

  const nextActionHelper = `Your ${serviceLabel} offer is ready for the Authority System, where you will build proof assets and credibility signals that support this offer for ${buyerTerm}.`;

  return { executionGuidance, reviewGuidance, nextActionHelper };
}
