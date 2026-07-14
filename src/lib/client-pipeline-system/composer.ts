/**
 * Module 5 — Pipeline Strategy Composer
 *
 * Pure deterministic function that produces a ClientPipelinePack
 * from normalized Module5StrategyContext.
 *
 * Flow:
 *   1. Resolve service acquisition profile (base)
 *   2. Build initial accumulator from profile
 *   3. Apply modifiers: market → niche → offer → authority → portfolio
 *   4. Build final ClientPipelinePack
 *
 * Pure function — no LLM calls, no Date.now(), no random IDs,
 * no store reads, no component dependencies.
 */

import type { ClientPipelinePack, TargetChannel, BuyingSignal, QualificationFactor, PriorityRule, PipelineStage, PortfolioLeadAsset, ProspectingReadiness, Module6HandoffContext, ProspectProfile } from '../../types/client-pipeline-system';
import type { Module5StrategyContext } from './context';
import { resolveServiceProfile } from './profiles';
import type { ServiceAcquisitionProfile } from './profiles';
import type { PipelineStrategyAccumulator } from './modifiers';
import { applyModifiers } from './modifiers';

/* ──────────────────────────────────────────────
   Build initial accumulator from profile
   ────────────────────────────────────────────── */

function profileToAccumulator(profile: ServiceAcquisitionProfile): PipelineStrategyAccumulator {
  const title = profile.label;

  return {
    idealProspectProfile: {
      title,
      description: profile.prospectProfile.description,
      characteristics: [...profile.prospectProfile.characteristics],
      evidenceOfFit: [...profile.prospectProfile.evidenceOfFit],
    },
    targetChannels: profile.targetChannels.map((ch) => ({
      platform: ch.platform,
      channelType: ch.channelType,
      priority: ch.priority,
      searchInstructions: '',
      expectedSignal: ch.expectedSignal,
    })),
    buyingSignals: profile.buyingSignals.map((bs) => ({
      signal: bs.signal,
      whyItMatters: bs.whyItMatters,
      howToDetect: '',
    })),
    disqualifiers: [...profile.disqualifiers],
    qualificationFactors: profile.qualificationFactors.map((qf) => ({
      id: qf.id,
      name: qf.name,
      weight: qf.weight,
      whyImportant: qf.whyImportant,
      scoringGuidance: '',
    })),
    priorityRules: profile.priorityRules.map((pr) => ({
      factor: pr.factor,
      weight: pr.weight,
      reason: '',
    })),
    dailyProspectingTarget: profile.dailyProspectingTarget,
    weeklyQualifiedProspectTarget: profile.weeklyQualifiedProspectTarget,
  };
}

/* ──────────────────────────────────────────────
   Build howToDetect from signal context
   ────────────────────────────────────────────── */

function inferHowToDetect(signal: string, ctx: Module5StrategyContext): string {
  const s = signal.toLowerCase();
  const niche = (ctx.niche || '').toLowerCase();
  const service = (ctx.service || '').toLowerCase();

  if (s.includes('short-form') || s.includes('shorts') || s.includes('reels') || s.includes('tiktok')) {
    if (niche.includes('gaming')) return 'Search their channel for Shorts or check TikTok for gaming clips from their content';
    return 'Search their social channels for short-form content posted in the last 30 days';
  }
  if (s.includes('website') || s.includes('landing page') || s.includes('mobile')) {
    return 'Open their website on mobile and desktop, evaluate load speed and contact visibility';
  }
  if (s.includes('review') || s.includes('feedback') || s.includes('mention')) {
    return `Search G2, Capterra, or social media for user feedback about ${ctx.niche || 'their product'}`;
  }
  if (s.includes('content') || s.includes('upload') || s.includes('schedule')) {
    return 'Review their upload/publishing history for consistency gaps and quality variation';
  }
  if (s.includes('product') || s.includes('demo') || s.includes('screenshot')) {
    return 'Review product website screenshots or demo videos for interface quality';
  }
  if (s.includes('founder') || s.includes('post') || s.includes('social')) {
    return `Monitor ${niche.includes('linkedin') ? 'LinkedIn' : 'social media'} for posts about business challenges or growth plans`;
  }
  if (s.includes('portfolio') || s.includes('proof') || s.includes('case study')) {
    return 'Review their website or social profiles for existing proof or case study content';
  }
  return '';
}

function inferScoringGuidance(factor: QualificationFactor, ctx: Module5StrategyContext): string {
  const name = factor.name.toLowerCase();
  const niche = (ctx.niche || '').toLowerCase();

  if (name.includes('consistency') || name.includes('content')) {
    return 'Rate based on upload frequency over the last 30 days: 5 = weekly+, 3 = biweekly, 1 = monthly or less';
  }
  if (name.includes('engagement') || name.includes('audience')) {
    return 'Evaluate comment activity, view counts, and community interaction levels relative to subscriber count';
  }
  if (name.includes('short') || name.includes('gap')) {
    return 'Check if prospect has any short-form content in the last 30 days: 5 = none, 3 = inconsistent, 1 = active short-form presence';
  }
  if (name.includes('budget') || name.includes('pay') || name.includes('investment')) {
    return 'Look for signs of marketing investment, paid tools, team, or recent funding: 5 = clear budget, 3 = uncertain, 1 = no budget signals';
  }
  if (name.includes('access') || name.includes('contact') || name.includes('decision')) {
    return 'Rate reachability: 5 = email/contact visible, 3 = indirect contact possible, 1 = no contact method found';
  }
  if (name.includes('website') || name.includes('quality')) {
    return 'Evaluate website quality on mobile and desktop: 5 = major issues, 3 = moderate issues, 1 = good quality';
  }
  if (name.includes('friction') || name.includes('ux') || name.includes('usability')) {
    return 'Count specific UX issues found in product trial or demo: 5 = 3+ issues, 3 = 1-2 issues, 1 = no clear issues';
  }
  if (name.includes('userbase') || name.includes('user') || name.includes('active')) {
    return 'Estimate active user count or engagement level: 5 = 1000+ active users, 3 = 100-1000, 1 = under 100';
  }
  if (name.includes('competitive') || name.includes('competitor')) {
    return 'Compare against top 3 competitors: 5 = significantly behind, 3 = slightly behind, 1 = competitive';
  }
  if (name.includes('growth') || name.includes('growth')) {
    return 'Look for hiring, new case studies, client wins, or expansion: 5 = strong growth signals, 3 = steady, 1 = stagnant';
  }
  if (name.includes('extractable') || name.includes('content quality')) {
    return 'Watch 2-3 recent videos/content pieces: 5 = multiple clip moments, 3 = some moments, 1 = few or none';
  }
  if (name.includes('recent') || name.includes('activity')) {
    return 'Check recent posts, product updates, or social activity: 5 = active this week, 3 = active this month, 1 = inactive 30+ days';
  }
  if (name.includes('proof') || name.includes('portfolio') || name.includes('match')) {
    return `Rate how closely the prospect's needs match your existing proof or portfolio work for ${ctx.niche || 'similar clients'}`;
  }
  if (name.includes('urgency')) {
    return 'Look for explicit deadlines, lost revenue, or time-sensitive problems: 5 = urgent, 3 = moderate, 1 = no urgency';
  }
  return 'Score 1-5 based on how strongly this factor applies to the prospect';
}

function inferPriorityRuleReason(factor: string, ctx: Module5StrategyContext): string {
  const f = factor.toLowerCase();

  if (f.includes('consistency') || f.includes('content')) return 'Consistent content producers provide reliable source material for ongoing work';
  if (f.includes('gap') || f.includes('short')) return 'Prospects without short-form presence have the highest need for clip editing services';
  if (f.includes('access') || f.includes('contact') || f.includes('decision')) return 'Direct access to decision makers dramatically increases conversion probability';
  if (f.includes('budget') || f.includes('capacity')) return 'Ability to pay is a prerequisite for professional service engagement';
  if (f.includes('quality') || f.includes('website')) return 'Larger quality gaps create stronger ROI cases for website improvement';
  if (f.includes('friction') || f.includes('ux')) return 'Documented UX problems create measurable, urgent design opportunities';
  if (f.includes('engagement') || f.includes('audience')) return 'Engaged audiences amplify the impact of improved content or design';
  if (f.includes('investment') || f.includes('marketing')) return 'Businesses already investing in marketing understand the value of professional services';
  if (f.includes('urgency') || f.includes('time')) return 'Time-sensitive problems create natural closing windows';
  if (f.includes('user') || f.includes('userbase')) return 'Products with active users provide immediate impact metrics for design improvements';
  return `Higher ${factor.toLowerCase()} scores indicate better prospect fit for this service`;
}

/* ──────────────────────────────────────────────
   Build portfolio lead asset from context
   ────────────────────────────────────────────── */

function buildPortfolioLeadAsset(ctx: Module5StrategyContext): PortfolioLeadAsset {
  if (!ctx.portfolio.ready) {
    return {
      available: false,
    };
  }

  return {
    available: true,
    id: ctx.portfolio.featuredProof.id || undefined,
    title: ctx.portfolio.featuredProof.title || ctx.portfolio.headline || undefined,
    url: ctx.portfolio.featuredProof.url || ctx.portfolio.url || undefined,
    destination: ctx.portfolio.destination || undefined,
    cta: ctx.portfolio.cta || undefined,
  };
}

/* ──────────────────────────────────────────────
   Build prospecting readiness
   ────────────────────────────────────────────── */

function buildProspectingReadiness(ctx: Module5StrategyContext): ProspectingReadiness {
  const reasons: string[] = [];

  if (ctx.portfolio.ready) {
    reasons.push('Portfolio is ready with featured proof for strong prospecting');
  } else {
    reasons.push('No ready portfolio — prospecting requires relationship-first approach');
  }

  if (ctx.authority.position.trim()) {
    reasons.push(`Authority position defined: "${ctx.authority.position}"`);
  } else {
    reasons.push('No explicit authority position — consider defining one before active outreach');
  }

  const hasProof = ctx.authority.proofAssets.length > 0;
  if (hasProof) {
    reasons.push(`${ctx.authority.proofAssets.length} proof asset(s) available for credibility building`);
  } else {
    reasons.push('No proof assets — consider building case studies or samples');
  }

  const hasBio = ctx.authority.profile.shortBio.trim().length > 0;
  if (!hasBio && !ctx.portfolio.ready) {
    reasons.push('Limited credibility signals (no bio, no portfolio) — prioritize relationship building over cold outreach');
  }

  const hasContactSignal = ctx.authority.profile.ctaLine.trim().length > 0;
  if (!hasContactSignal) {
    reasons.push('No CTA line in authority profile — define a clear next step for prospects');
  }

  // Determine overall status
  let status: 'ready' | 'limited' | 'blocked';
  if (ctx.portfolio.ready && hasProof && ctx.authority.position.trim()) {
    status = 'ready';
  } else if (!ctx.portfolio.ready && !hasProof && !ctx.authority.position.trim()) {
    status = 'blocked';
  } else {
    status = 'limited';
  }

  return { status, reasons };
}

/* ──────────────────────────────────────────────
   Build M6 handoff context
   ────────────────────────────────────────────── */

function buildModule6HandoffContext(ctx: Module5StrategyContext): Module6HandoffContext {
  return {
    portfolioHeadline: ctx.portfolio.headline || undefined,
    portfolioUrl: ctx.portfolio.url || undefined,
    portfolioCta: ctx.portfolio.cta || undefined,
    featuredProofTitle: ctx.portfolio.featuredProof.title || undefined,
    featuredProofUrl: ctx.portfolio.featuredProof.url || undefined,
    positioning: ctx.positioning || undefined,
    offerType: ctx.offer.type || undefined,
    deliverables: [...ctx.offer.deliverables],
    uniqueMechanism: ctx.offer.uniqueMechanism || undefined,
    authorityPosition: ctx.authority.position || undefined,
  };
}

/* ──────────────────────────────────────────────
   Build final pipeline stages from context
   ────────────────────────────────────────────── */

function buildPipelineStages(ctx: Module5StrategyContext): PipelineStage[] {
  const stages: PipelineStage[] = [
    'discovered',
    'reviewing',
    'qualified',
    'priority',
    'hold',
    'disqualified',
  ];

  // If portfolio is ready, we can add a more aggressive stage path
  if (ctx.portfolio.ready) {
    return stages;
  }

  return stages;
}

/* ──────────────────────────────────────────────
   Deduplicate and normalize strategy
   ────────────────────────────────────────────── */

function deduplicateSignals(signals: BuyingSignal[]): BuyingSignal[] {
  const seen = new Set<string>();
  return signals.filter((s) => {
    const key = s.signal.slice(0, 60).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function deduplicateCharacteristics(chars: string[]): string[] {
  const seen = new Set<string>();
  return chars.filter((c) => {
    const key = c.slice(0, 40).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* ──────────────────────────────────────────────
   Main compose function
   ────────────────────────────────────────────── */

export function composeClientPipelinePack(ctx: Module5StrategyContext): ClientPipelinePack {
  // 1. Resolve service acquisition profile
  const profile = resolveServiceProfile(ctx.service, ctx.category);

  // 2. Build initial accumulator
  const baseAccumulator = profileToAccumulator(profile);

  // 3. Apply modifiers in order
  const modified = applyModifiers(ctx, baseAccumulator);

  // 4. Deduplicate and normalize
  const characteristics = deduplicateCharacteristics(modified.idealProspectProfile.characteristics);
  const buyingSignals = deduplicateSignals(modified.buyingSignals);
  const disqualifiers = [...new Set(modified.disqualifiers)];
  const channels = modified.targetChannels;
  const factors = modified.qualificationFactors;
  const rules = modified.priorityRules;

  // 5. Fill in inferred fields
  const withDetection = buyingSignals.map((bs) => ({
    ...bs,
    howToDetect: bs.howToDetect || inferHowToDetect(bs.signal, ctx),
  }));

  const withGuidance = factors.map((qf) => ({
    ...qf,
    scoringGuidance: qf.scoringGuidance || inferScoringGuidance(qf, ctx),
  }));

  const withReasons = rules.map((pr) => ({
    ...pr,
    reason: pr.reason || inferPriorityRuleReason(pr.factor, ctx),
  }));

  // 6. Fill in search instructions for channels
  const withInstructions = channels.map((ch) => ({
    ...ch,
    searchInstructions: ch.searchInstructions || buildSearchInstruction(ch, ctx),
  }));

  // 7. Build final pack
  return {
    idealProspectProfile: {
      title: characteristics.length > 0
        ? `${ctx.serviceLabel || ctx.offer.name || 'Target'} Prospect`
        : 'Target Prospect',
      description: modified.idealProspectProfile.description,
      characteristics,
      evidenceOfFit: modified.idealProspectProfile.evidenceOfFit,
    },
    targetChannels: withInstructions,
    buyingSignals: withDetection,
    disqualifiers,
    qualificationFactors: withGuidance,
    pipelineStages: buildPipelineStages(ctx),
    priorityRules: withReasons,
    dailyProspectingTarget: modified.dailyProspectingTarget,
    weeklyQualifiedProspectTarget: modified.weeklyQualifiedProspectTarget,
    portfolioLeadAsset: buildPortfolioLeadAsset(ctx),
    prospectingReadiness: buildProspectingReadiness(ctx),
    module6HandoffContext: buildModule6HandoffContext(ctx),
  };
}

/* ──────────────────────────────────────────────
   Build search instruction for a channel
   ────────────────────────────────────────────── */

function buildSearchInstruction(ch: TargetChannel, ctx: Module5StrategyContext): string {
  const platform = ch.platform.toLowerCase();
  const niche = ctx.niche || 'target';
  const service = ctx.serviceLabel || ctx.offer.name || 'service';

  if (platform.includes('youtube')) {
    return `Search YouTube for "${niche}" creators with 5K-100K subscribers. Filter by recent uploads and check for business contact info in About section. Evaluate their short-form presence gap.`;
  }
  if (platform.includes('twitch')) {
    return `Browse Twitch directory by game/niche: "${niche}". Filter for VODs enabled, consistent schedules, and active chat. Evaluate if their content has clip-worthy moments.`;
  }
  if (platform.includes('google maps') || platform.includes('local search')) {
    return `Search Google Maps for "${niche}" in target area. Open each business listing, visit their website, and evaluate mobile experience, load speed, and contact clarity.`;
  }
  if (platform.includes('google search')) {
    return `Search Google for "${niche} ${service}" and browse first page results. Evaluate each website for design quality, mobile experience, and improvement opportunities.`;
  }
  if (platform.includes('linkedin')) {
    return `Search LinkedIn for professionals/companies in "${niche}" space. Look for those posting about growth, challenges, or investment in ${service}. Check for decision-maker access.`;
  }
  if (platform.includes('product hunt')) {
    return `Browse Product Hunt for "${niche}" related launches. Review each product's website quality, messaging clarity, and CTA effectiveness. Prioritize recently launched or upcoming products.`;
  }
  if (platform.includes('g2') || platform.includes('capterra')) {
    return `Search G2/Capterra for "${niche}" products. Read user reviews for mentions of UX issues, UI confusion, or onboarding friction. Prioritize products with consistent negative UX feedback.`;
  }
  if (platform.includes('instagram')) {
    return `Search Instagram by "${niche}" hashtags and location. Look for profiles active in the niche with inconsistent or low-quality content that could benefit from professional ${service}.`;
  }
  if (platform.includes('discord')) {
    return `Search Disboard or community directories for "${niche}" servers. Join relevant communities and observe creator/business activity. Prioritize those actively discussing content or growth challenges.`;
  }
  if (platform.includes('clutch') || platform.includes('agency')) {
    return `Browse Clutch or agency directories for "${niche}" firms. Evaluate their own website quality and service offerings. Prioritize those offering services that need technical implementation support.`;
  }
  if (platform.includes('dribbble') || platform.includes('behance')) {
    return `Search Dribbble/Behance for "${niche}" agencies or studios. Evaluate portfolio consistency and visual quality. Prioritize those showing quality variance across projects.`;
  }
  if (platform.includes('indie') || platform.includes('hacker')) {
    return `Browse Indie Hackers, Hacker News, or relevant Reddit communities for "${niche}" founders and product builders. Look for those posting about design, content, or growth challenges.`;
  }
  if (platform.includes('portfolio') || platform.includes('website')) {
    return `Optimize your portfolio/destination presence for "${niche}" prospects. Ensure featured work is prominently displayed with clear CTA for ${service}.`;
  }

  return `Search ${ch.platform} for "${niche}" prospects who need ${service}. Evaluate fit based on visible problems and improvement opportunities.`;
}
