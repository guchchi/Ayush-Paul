import type { UpstreamContext, PortfolioDirection, PlatformRecommendation, PortfolioSectionSpec, ProjectPlacement, ProjectPresentationSpec, ProjectRole } from '../../types/portfolio-system';
import type { PersonalizationContext, NicheSemanticMetadata } from '../personalization/types';
import { resolvePersonalizationContext, resolveM1Context, resolveM2Context, resolveM3Context } from '../personalization/context';
import { resolveServiceContentProfile, resolveCanonicalMarketModifier } from '../../data/personalization';
import { resolveNicheMetadata } from '../../data/personalization/niche-semantic-metadata';
import { composeExamples, composeHelperText, composeEmptyStateGuidance } from '../personalization/resolver';

/* ──────────────────────────────────────────────
   Resolve shared PersonalizationContext from Module 4 UpstreamContext
   ────────────────────────────────────────────── */

export function resolveM4PersonalizationContext(ctx: UpstreamContext): PersonalizationContext {
  const m1 = resolveM1Context({
    careerTrackId: ctx.mod1CareerTrackId,
    serviceId: ctx.mod1ServiceId,
    marketId: ctx.mod1MarketId,
    nicheId: ctx.mod1NicheId,
    positioning: ctx.mod1Positioning,
  });
  const m2 = resolveM2Context({
    offerType: ctx.mod2OfferType,
    deliverables: ctx.mod2Deliverables,
    uniqueMechanism: ctx.mod2UniqueMechanism,
    scopeLimits: ctx.mod2ScopeLimits as any,
    valueAmplifier: ctx.mod2ValueAmplifier,
    pricingModel: ctx.mod2PricingModel,
  });
  const m3 = resolveM3Context({
    authorityPosition: ctx.mod3AuthorityPosition,
    coreTrustPromise: ctx.mod3CoreTrustPromise,
    proofPriorities: ctx.mod3ProofPriorities,
    proofAssets: ctx.mod3ProofAssets,
    profileCopy: {
      professionalHeadline: ctx.mod3ProfileCopy.professionalHeadline,
      shortBio: ctx.mod3ProfileCopy.shortBio,
      longBio: ctx.mod3ProfileCopy.longBio,
      offerStatement: ctx.mod3ProfileCopy.offerStatement,
      credibilityBullets: ctx.mod3ProfileCopy.credibilityBullets,
      proofReferenceLine: ctx.mod3ProfileCopy.proofReferenceLine,
      ctaLine: ctx.mod3ProfileCopy.ctaLine,
    },
    portfolioCopy: {
      portfolioCta: ctx.mod3PortfolioCopy.portfolioCta,
      sections: ctx.mod3PortfolioCopy.sections,
    },
  });
  return resolvePersonalizationContext(m1, m2, m3);
}

/* ──────────────────────────────────────────────
   Resolve niche metadata for Module 4 context
   ────────────────────────────────────────────── */

function resolveNicheForM4(ctx: UpstreamContext): { metadata: NicheSemanticMetadata | null; tier: string } | null {
  const nicheId = ctx.mod1NicheId;
  if (!nicheId) return null;
  try {
    return resolveNicheMetadata(nicheId, '', ctx.mod1ServiceId ?? '', ctx.mod1MarketId ?? '');
  } catch {
    return null;
  }
}

/* ──────────────────────────────────────────────
   STEP 1 — Portfolio Direction Personalization
   ────────────────────────────────────────────── */

export interface Step1PersonalizedContent {
  recommendationRationale: string;
  targetBuyerHelper: string;
  portfolioPromiseHelper: string;
  ctaIntentHelper: string;
  goalPlaceholderHints: Record<string, string>;
  emptyGuidance: string;
}

export function composeStep1Content(ctx: UpstreamContext): Step1PersonalizedContent {
  const pc = resolveM4PersonalizationContext(ctx);
  const profile = resolveServiceContentProfile(pc.m1.serviceId);
  const marketMod = resolveCanonicalMarketModifier(pc.m1.marketId ?? '');
  const nicheRes = resolveNicheForM4(ctx);
  const examples = composeExamples(pc.m1.serviceId, nicheRes?.metadata ?? null, 2, `${pc.m1.serviceId}_${pc.m1.marketId}`);
  const buyerTerm = marketMod.label.toLowerCase();
  const serviceLabel = pc.m1.serviceLabel.toLowerCase();

  const recommendationRationale = `For ${buyerTerm} evaluating ${serviceLabel}, your portfolio should make it easy to judge your fit. ${marketMod.buyerQuestions[0]?.toLowerCase() ?? ''} ${examples.length > 0 ? `Consider starting with: ${examples[0]}` : ''}`;

  const targetBuyerHelper = `${buyerTerm} who need ${serviceLabel}. ${marketMod.concernThemes.slice(0, 2).join(' and ')} are their primary concerns.`;

  const portfolioPromiseHelper = `Your portfolio promise should address ${buyerTerm}'s need for ${marketMod.trustExpectations[0]?.toLowerCase() ?? 'quality work'}. ${nicheRes?.metadata?.proofEmphasis?.slice(0, 1).join(', ') ?? ''}`;

  const ctaIntentHelper = `Based on your offer and position, guide buyers to ${marketMod.ctaIntentTendencies[0]?.replace(/_/g, ' ') ?? 'discuss their needs'}.`;

  const goalPlaceholderHints: Record<string, string> = {
    start_conversation: `Encourage ${buyerTerm} to reach out and discuss their specific ${serviceLabel} needs`,
    review_offer: `Present your ${serviceLabel} offer so ${buyerTerm} can evaluate the fit`,
    evaluate_capability: `Show ${buyerTerm} concrete examples of your ${serviceLabel} capability`,
    request_project: `Make it easy for ${buyerTerm} to request a specific ${serviceLabel} project`,
  };

  const emptyGuidance = profile.emptyStateActionConcepts.length > 0
    ? composeEmptyStateGuidance(profile.emptyStateActionConcepts, 2)
    : `Define who ${buyerTerm} are and what your ${serviceLabel} portfolio should achieve.`;

  return { recommendationRationale, targetBuyerHelper, portfolioPromiseHelper, ctaIntentHelper, goalPlaceholderHints, emptyGuidance };
}

/* ──────────────────────────────────────────────
   STEP 2 — Destination + Structure Personalization
   ────────────────────────────────────────────── */

export interface Step2PersonalizedContent {
  destinationHelper: string;
  sectionRationales: Record<string, string>;
  emptyGuidance: string;
}

export function composeStep2Content(ctx: UpstreamContext, platform: PlatformRecommendation, sections: PortfolioSectionSpec[]): Step2PersonalizedContent {
  const pc = resolveM4PersonalizationContext(ctx);
  const profile = resolveServiceContentProfile(pc.m1.serviceId);
  const marketMod = resolveCanonicalMarketModifier(pc.m1.marketId ?? '');
  const buyerTerm = marketMod.label.toLowerCase();
  const serviceLabel = pc.m1.serviceLabel.toLowerCase();

  const destinationHelper = `This destination fits your setup because ${buyerTerm} evaluating ${serviceLabel} need to ${profile.evidenceLanguage.slice(0, 1).join(' and ') || 'quickly assess your work'}. ${platform.primaryRecommendation} makes it easy to present ${profile.outputTerms.slice(0, 2).join(' and ')}.`;

  const sectionRationales: Record<string, string> = {};
  for (const section of sections) {
    const base = profile.helperTextConcepts.slice(0, 1).join('. ') || '';
    switch (section.sectionType) {
      case 'process':
        sectionRationales[section.id] = `Explain your ${profile.executionTerms.slice(0, 2).join(' and ')} decisions so ${buyerTerm} understand your approach.`;
        break;
      case 'selected_work':
      case 'hook_gallery':
      case 'clip_gallery':
      case 'live_projects':
      case 'page_showcase':
        sectionRationales[section.id] = `Let ${buyerTerm} evaluate your ${profile.workNouns.slice(0, 2).join(' and ')} quality directly. ${base}`;
        break;
      case 'implementation':
      case 'automation_showcase':
      case 'app_showcase':
        sectionRationales[section.id] = `Show ${buyerTerm} how your ${profile.workVerbs.slice(0, 2).join(' and ')} process works end-to-end.`;
        break;
      case 'identity_systems':
      case 'templates':
        sectionRationales[section.id] = `Demonstrate your systematic ${profile.workNouns.slice(0, 1).join(', ')} approach for ${buyerTerm}.`;
        break;
      default:
        sectionRationales[section.id] = `This section addresses ${buyerTerm}'s need for ${section.purpose?.toLowerCase() || 'clear information'}.`;
    }
  }

  const emptyGuidance = `Structure depends on your destination (${platform.destination}) and the proof context from your Module 3 authority strategy.`;

  return { destinationHelper, sectionRationales, emptyGuidance };
}

/* ──────────────────────────────────────────────
   STEP 3 — Proof Placement Personalization
   ────────────────────────────────────────────── */

export interface Step3PersonalizedContent {
  roleExplanations: Record<ProjectRole, string>;
  ctaProximityHelpers: Record<string, string>;
  emptyGuidance: string;
}

export function composeStep3Content(ctx: UpstreamContext, placements: ProjectPlacement[]): Step3PersonalizedContent {
  const pc = resolveM4PersonalizationContext(ctx);
  const marketMod = resolveCanonicalMarketModifier(pc.m1.marketId ?? '');
  const nicheRes = resolveNicheForM4(ctx);
  const buyerTerm = marketMod.label.toLowerCase();

  const featuredConcern = marketMod.concernThemes.slice(0, 2).join(' and ');
  const roleExplanations: Record<ProjectRole, string> = {
    featured: `Buyers should see this first. For ${buyerTerm}, the primary concern is ${featuredConcern}. This asset should directly answer: "${marketMod.buyerQuestions[0] ?? 'Can they deliver?'}"`,
    secondary: `This asset addresses the next concern: "${marketMod.buyerQuestions[1] ?? 'What else can they do?'}" It reinforces the featured proof with complementary evidence.`,
    supporting: `Supports your overall credibility for ${buyerTerm}. Use this to reinforce ${nicheRes?.metadata?.proofEmphasis?.slice(0, 2).join(' and ') || 'trustworthiness and process clarity'}.`,
  };

  const ctaProximityHelpers: Record<string, string> = {
    hero: `Place CTAs where ${buyerTerm} are most engaged after seeing the featured work. An immediate CTA works best when the portfolio goal is to ${pc.m1.positioning || 'start a conversation'}.`,
    inline: `Insert CTAs after relevant evidence so ${buyerTerm} can act when a specific concern is addressed.`,
    section_end: `Section-end CTAs work when ${buyerTerm} need time to evaluate before committing.`,
    footer: `Footer CTAs serve as a final prompt for ${buyerTerm} who have reviewed the full portfolio.`,
  };

  const emptyGuidance = `Complete Step 2 to define your portfolio structure, then arrange your Module 3 proof assets across sections.`;

  return { roleExplanations, ctaProximityHelpers, emptyGuidance };
}

/* ──────────────────────────────────────────────
   STEP 4 — Project Presentation Personalization
   ────────────────────────────────────────────── */

export interface Step4PersonalizedContent {
  openingMediaHelper: string;
  buyerProblemHelper: string;
  proofObjectiveHelper: string;
  presentationSequenceHelper: string;
  evidenceOrderHelpers: string[];
  processHelper: string;
  decisionHelper: string;
  outputHelper: string;
  limitationsHelper: string;
  fieldPlaceholders: Record<string, string>;
  emptyGuidance: string;
}

export function composeStep4Content(ctx: UpstreamContext, asset: UpstreamContext['mod3ProofAssets'][0], role: ProjectRole): Step4PersonalizedContent {
  const pc = resolveM4PersonalizationContext(ctx);
  const profile = resolveServiceContentProfile(pc.m1.serviceId);
  const marketMod = resolveCanonicalMarketModifier(pc.m1.marketId ?? '');
  const nicheRes = resolveNicheForM4(ctx);
  const buyerTerm = marketMod.label.toLowerCase();
  const examples = composeExamples(pc.m1.serviceId, nicheRes?.metadata ?? null, 3, `${pc.m1.serviceId}_${pc.m1.marketId}_${asset.id}`);

  const openingMediaHelper = `Lead with ${profile.outputTerms.slice(0, 1).join(' or ')} — this is what ${buyerTerm} need to see first to judge your ${profile.workNouns.slice(0, 1).join(', ')} quality.`;

  const buyerProblemHelper = `${nicheRes?.metadata?.buyerContexts?.slice(0, 2).join('. ') || marketMod.buyerQuestions.slice(0, 1).join('. ')} ${asset.credibilityGapProved ? `This asset proves: ${asset.credibilityGapProved}` : ''}`;

  const proofObjectiveHelper = `Demonstrate how this project addresses ${buyerTerm}'s need for ${nicheRes?.metadata?.proofEmphasis?.slice(0, 2).join(' and ') || marketMod.concernThemes.slice(0, 2).join(' and ')}. The focus should be on ${profile.evidenceLanguage.slice(0, 2).join(' and ')}.`;

  const presentationSequenceHelper = `For ${pc.m1.serviceLabel}, ${buyerTerm} benefit from this sequence: start with ${profile.executionTerms.slice(0, 1).join(', ') || 'the overall context'}, then show ${profile.evidenceLanguage.slice(0, 1).join(', ') || 'supporting evidence'}, and finish with the outcome.`;

  const evidenceOrderHelpers = (profile.evidenceLanguage.length > 0 ? profile.evidenceLanguage : ['evidence of quality', 'process documentation', 'final output']).map((e) => `This ${e} helps ${buyerTerm} ${profile.workVerbs.slice(0, 1).join(', ') || 'evaluate'} capability.`);

  const processHelper = `Describe your ${profile.executionTerms.slice(0, 2).join(' and ')} decisions. ${buyerTerm} want to understand how you approach ${profile.workNouns.slice(0, 1).join(', ')}.`;

  const decisionHelper = `Explain the key choices you made. For ${buyerTerm}, the most relevant decisions relate to ${marketMod.concernThemes.slice(0, 2).join(' and ')}.`;

  const outputHelper = `Showcase the ${profile.outputTerms.slice(0, 2).join(' and ')}. These are what ${buyerTerm} ultimately evaluate.`;

  const limitationsHelper = profile.avoidRules.length > 0
    ? `Be transparent: ${profile.avoidRules.slice(0, 2).join('. ')}.`
    : `Be transparent about what this project demonstrates and what it doesn't.`;

  const fieldPlaceholders: Record<string, string> = {
    projectTitle: `${role === 'featured' ? 'Featured' : role === 'secondary' ? 'Secondary' : 'Supporting'} ${profile.workNouns.slice(0, 1).join(', ')} for ${buyerTerm}`,
    clientContext: `Context: this ${profile.workNouns.slice(0, 1).join(', ')} project was designed for ${buyerTerm} who need ${marketMod.concernThemes.slice(0, 1).join(', ')}`,
    problemStatement: `The challenge: ${asset.credibilityGapProved || `demonstrating ${profile.workVerbs.slice(0, 1).join(', ')} capability to ${buyerTerm}`}`,
    processSummary: `My approach: used ${profile.executionTerms.slice(0, 2).join(' and ')} to ${profile.workVerbs.slice(0, 1).join(', ')} effectively`,
    resultStatement: `The outcome: ${profile.outputTerms.slice(0, 1).join(', ')} that demonstrates ${nicheRes?.metadata?.proofEmphasis?.slice(0, 1).join(', ') || marketMod.concernThemes.slice(0, 1).join(', ')}`,
  };

  const emptyGuidance = `Project presentations use your Module 3 proof assets. Complete Steps 1-3 first to define direction, structure, and placement.`;

  return {
    openingMediaHelper, buyerProblemHelper, proofObjectiveHelper,
    presentationSequenceHelper, evidenceOrderHelpers, processHelper,
    decisionHelper, outputHelper, limitationsHelper,
    fieldPlaceholders, emptyGuidance,
  };
}

/* ──────────────────────────────────────────────
   STEP 5 — Portfolio Copy + CTA Personalization
   ────────────────────────────────────────────── */

export interface Step5PersonalizedContent {
  headlineHelper: string;
  shortIntroHelper: string;
  sectionCopyHelpers: Record<string, string>;
  projectCopyHelpers: Record<string, string>;
  ctaArchitectureHelpers: Record<string, string>;
  emptyGuidance: string;
}

export function composeStep5Content(ctx: UpstreamContext, direction: PortfolioDirection, sections: PortfolioSectionSpec[]): Step5PersonalizedContent {
  const pc = resolveM4PersonalizationContext(ctx);
  const profile = resolveServiceContentProfile(pc.m1.serviceId);
  const marketMod = resolveCanonicalMarketModifier(pc.m1.marketId ?? '');
  const nicheRes = resolveNicheForM4(ctx);
  const buyerTerm = marketMod.label.toLowerCase();
  const serviceLabel = pc.m1.serviceLabel.toLowerCase();

  const headlineHelper = `Your headline should quickly tell ${buyerTerm} you understand their ${marketMod.concernThemes.slice(0, 2).join(' and ')} needs and can deliver ${profile.workNouns.slice(0, 1).join(', ')} that addresses them.`;

  const shortIntroHelper = `Use terminology ${buyerTerm} recognise. Reference ${nicheRes?.metadata?.languageTerms?.slice(0, 2).join(' and ') || marketMod.languageTendencies.slice(0, 2).join(' and ')}. Frame your ${profile.workVerbs.slice(0, 1).join(', ')} capability around ${buyerTerm}'s outcomes.`;

  const sectionCopyHelpers: Record<string, string> = {};
  for (const section of sections) {
    switch (section.sectionType) {
      case 'process':
        sectionCopyHelpers[section.id] = `Describe your ${profile.executionTerms.slice(0, 2).join(' and ')} approach. Explain how you ${profile.workVerbs.slice(0, 2).join(' and ')} for ${buyerTerm}.`;
        break;
      case 'selected_work':
      case 'hook_gallery':
      case 'clip_gallery':
      case 'live_projects':
      case 'page_showcase':
        sectionCopyHelpers[section.id] = `Showcase ${profile.workNouns.slice(0, 2).join(' and ')} that demonstrate your ${profile.workVerbs.slice(0, 1).join(', ')} capability for ${buyerTerm}.`;
        break;
      case 'implementation':
      case 'automation_showcase':
        sectionCopyHelpers[section.id] = `Explain your ${profile.workVerbs.slice(0, 1).join(', ')} implementation and the ${profile.executionTerms.slice(0, 1).join(', ')} decisions for ${buyerTerm}.`;
        break;
      case 'hero':
        sectionCopyHelpers[section.id] = `Introduce your ${serviceLabel} and how you help ${buyerTerm}.`;
        break;
      default:
        sectionCopyHelpers[section.id] = `Frame this section around ${buyerTerm}'s need for ${section.purpose?.toLowerCase() || 'relevant portfolio content'}.`;
    }
  }

  const projectCopyHelpers: Record<string, string> = {};
  for (const pres of (ctx.mod3ProofAssets || [])) {
    projectCopyHelpers[pres.id] = `Emphasise how this ${pres.assetType || profile.workNouns.slice(0, 1).join(', ')} project addresses ${buyerTerm}'s need for ${nicheRes?.metadata?.proofEmphasis?.slice(0, 1).join(', ') || marketMod.concernThemes.slice(0, 1).join(', ')}.`;
  }

  const ctaArchitectureHelpers: Record<string, string> = {
    heroCta: `Ask ${buyerTerm} to ${marketMod.ctaIntentTendencies[0]?.replace(/_/g, ' ') || 'discuss their needs'} — this is what they expect after seeing your featured work.`,
    inlineCta: `Connect specific proof to your ${ctx.mod2OfferType || 'service'} offer. ${marketMod.ctaIntentTendencies[1]?.replace(/_/g, ' ') || 'Learn more'} is a natural next step.`,
    sectionCta: `After reviewing ${profile.workNouns.slice(0, 1).join(', ')} examples, prompt ${buyerTerm} to ${marketMod.ctaIntentTendencies[2]?.replace(/_/g, ' ') || 'request more information'}.`,
    footerCta: `Repeat the primary action: ${marketMod.ctaIntentTendencies[0]?.replace(/_/g, ' ') || 'start the conversation'}. ${buyerTerm} here have seen enough to decide.`,
  };

  const emptyGuidance = `Portfolio copy builds on your Module 3 profile copy and the direction set in Step 1. Complete Steps 1-4 first.`;

  return { headlineHelper, shortIntroHelper, sectionCopyHelpers, projectCopyHelpers, ctaArchitectureHelpers, emptyGuidance };
}

/* ──────────────────────────────────────────────
   STEP 6 — Portfolio Build Pack Personalization
   ────────────────────────────────────────────── */

export interface Step6PersonalizedContent {
  buildChecklistContexts: Record<string, string>;
  publishChecklistHelpers: Record<string, string>;
  nextActionHelpers: string[];
  emptyGuidance: string;
}

export function composeStep6Content(ctx: UpstreamContext): Step6PersonalizedContent {
  const pc = resolveM4PersonalizationContext(ctx);
  const profile = resolveServiceContentProfile(pc.m1.serviceId);
  const marketMod = resolveCanonicalMarketModifier(pc.m1.marketId ?? '');
  const nicheRes = resolveNicheForM4(ctx);
  const buyerTerm = marketMod.label.toLowerCase();
  const serviceLabel = pc.m1.serviceLabel.toLowerCase();

  const buildChecklistContexts: Record<string, string> = {
    'Set up portfolio platform': `Choose a platform where ${buyerTerm} expect to find ${profile.workNouns.slice(0, 1).join(', ')} portfolios. ${profile.commonOutputs.slice(0, 1).join(', ')} should be easy to view.`,
    'Write and refine headline': `Your headline must communicate ${serviceLabel} for ${buyerTerm} and address their ${marketMod.concernThemes.slice(0, 1).join(', ')} concern.`,
    'Add short intro / bio': `Position yourself around ${buyerTerm}'s needs: ${marketMod.concernThemes.slice(0, 2).join(' and ')}. Use language that resonates: ${nicheRes?.metadata?.languageTerms?.slice(0, 2).join(', ') || marketMod.languageTendencies.slice(0, 2).join(', ')}.`,
  };

  /* Build checklist context for section building */
  const sectionContexts: Record<string, string> = {};
  const serviceSections = [
    { id: 'selected_work', hint: `Curate ${profile.workNouns.slice(0, 1).join(', ')} that best demonstrate your ${profile.workVerbs.slice(0, 1).join(', ')} capability for ${buyerTerm}.` },
    { id: 'process', hint: `Document your ${profile.executionTerms.slice(0, 2).join(' and ')} approach so ${buyerTerm} understand how you ${profile.workVerbs.slice(0, 1).join(', ')}.` },
    { id: 'hook_gallery', hint: `Show ${buyerTerm} how you ${profile.workVerbs.slice(0, 1).join(', ')} to capture attention immediately.` },
    { id: 'live_projects', hint: `Allow ${buyerTerm} to inspect your ${profile.workNouns.slice(0, 1).join(', ')} directly.` },
    { id: 'implementation', hint: `Walk ${buyerTerm} through your ${profile.executionTerms.slice(0, 1).join(', ')} decisions and execution.` },
    { id: 'identity_systems', hint: `Present your systematic approach to ${profile.workNouns.slice(0, 1).join(', ')} for ${buyerTerm}.` },
  ];
  for (const s of serviceSections) {
    sectionContexts[s.id] = s.hint;
  }

  const publishChecklistHelpers: Record<string, string> = {
    'Choose domain name': `Pick a domain that signals ${serviceLabel} to ${buyerTerm}.`,
    'Set up hosting': `Ensure your ${profile.commonOutputs.slice(0, 1).join(', ')} load fast for ${buyerTerm}`,
    'Configure custom domain': `${buyerTerm} expect a professional domain that reflects your ${serviceLabel} focus.`,
    'Test all links and CTAs': `${buyerTerm} exploring your work need every CTA to ${marketMod.ctaIntentTendencies[0]?.replace(/_/g, ' ') || 'work as expected'}.`,
    'Review on mobile device': `Many ${buyerTerm} will first view your portfolio on mobile. Check that your ${profile.workNouns.slice(0, 1).join(', ')} display correctly.`,
    'Share portfolio URL': `Direct ${buyerTerm} to the portfolio URL in your outreach and CTA conversations.`,
  };

  const nextActionHelpers = [
    `Create your first project page specifically for ${buyerTerm}, highlighting your ${profile.workVerbs.slice(0, 1).join(', ')} capability.`,
    `Set up your chosen platform so ${profile.commonOutputs.slice(0, 2).join(' and ')} are immediately visible to ${buyerTerm}.`,
    `Review your Module 3 authority strategy and ensure every proof asset has a clear home in your ${serviceLabel} portfolio.`,
  ];

  const emptyGuidance = `Complete Steps 1-5 to generate a full Build Pack with checklists and next actions tailored to ${buyerTerm}.`;

  return { buildChecklistContexts, publishChecklistHelpers, nextActionHelpers, emptyGuidance };
}
