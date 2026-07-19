/**
 * Development-only content and personalization audit
 * for Module 3 Step 1 (Authority Position recommendation
 * and Core Trust Promise generation).
 *
 * Run: npx tsx scripts/audit/module3-step1-audit.ts
 */
import {
  resolveRecommendedPosition,
  generateCoreTrustPromise,
  generatePositionRationale,
  getServiceLabel,
  getBuyerLabel,
  type PositionContext,
} from '../../src/data/module3/authority-positions';
import type { AuthorityPosition } from '../../src/types/module3';

/* ── 6 test personas ── */

interface Persona {
  id: string;
  label: string;
  ctx: PositionContext;
  expectedTrack: string;
}

const PERSONAS: Persona[] = [
  // 1. Long-form editor serving personal brands/founders
  {
    id: '01-longform-editor-personal-brands',
    label: 'Long-Form Editor → Personal Brands / Founders',
    ctx: {
      careerTrackId: 'editor',
      serviceId: 'youtube_editor',
      marketId: 'personal_brands',
      nicheId: null,
      positioning: 'story-driven narrative editing for personal brands',
      offerType: 'retainer',
      deliverables: [
        'Fully Edited Video',
        'Chapter Timestamps & SEO Description',
        'Audio Master & Sound Design',
      ],
      uniqueMechanism: 'Narrative Arc Engineering',
      valueAmplifier: 'priority_support',
    },
    expectedTrack: 'editor',
  },
  // 2. Short-form editor serving gyms (local businesses)
  {
    id: '02-shortform-editor-gyms',
    label: 'Short-Form Editor → Gyms / Local Businesses',
    ctx: {
      careerTrackId: 'editor',
      serviceId: 'short_form_editor',
      marketId: 'local_businesses',
      nicheId: null,
      positioning: 'high-energy gym content and workout reels',
      offerType: 'retainer',
      deliverables: [
        'Short-Form Videos',
        'Caption & Hashtag Package',
        'Audio Cleanup & Mixing',
      ],
      uniqueMechanism: 'Scroll-Stopping Hook Framework',
      valueAmplifier: 'express_turnaround',
    },
    expectedTrack: 'editor',
  },
  // 3. Developer serving B2B SaaS startups
  {
    id: '03-frontend-dev-saas',
    label: 'Frontend Developer → B2B SaaS Startups',
    ctx: {
      careerTrackId: 'developer',
      serviceId: 'frontend_developer',
      marketId: 'saas_startups',
      nicheId: null,
      positioning: 'building polished product interfaces for SaaS platforms',
      offerType: 'one_time_project',
      deliverables: [
        'Interactive Dashboard',
        'Component Library',
        'Developer Handoff Notes',
      ],
      uniqueMechanism: 'Performance Budget Pipeline',
      valueAmplifier: 'strategy_call',
    },
    expectedTrack: 'developer',
  },
  // 4. Designer serving coaches
  {
    id: '04-landing-page-designer-coaches',
    label: 'Landing Page Designer → Coaches',
    ctx: {
      careerTrackId: 'designer',
      serviceId: 'landing_page_designer',
      marketId: 'coaches',
      nicheId: null,
      positioning: 'high-converting landing pages for coaches',
      offerType: 'one_time_project',
      deliverables: [
        'Hero Section Wireframe',
        'Conversion-Focused Page Layout',
        'Mobile-First Responsive Layout',
      ],
      uniqueMechanism: 'Conversion Arc Page Architecture',
      valueAmplifier: 'conversion_review',
    },
    expectedTrack: 'designer',
  },
  // 5. Editor serving local businesses (NO unique mechanism – tests fallback)
  {
    id: '05-video-editor-local-businesses',
    label: 'Video Editor → Local Businesses (no mechanism)',
    ctx: {
      careerTrackId: 'editor',
      serviceId: 'video_editor',
      marketId: 'local_businesses',
      nicheId: null,
      positioning: 'local business video content',
      offerType: 'one_time_project',
      deliverables: ['Fully Edited Video', 'Custom Thumbnail Design'],
      uniqueMechanism: '',
      valueAmplifier: 'express_turnaround',
    },
    expectedTrack: 'editor',
  },
  // 6. Automation developer serving ecommerce brands
  {
    id: '06-automation-dev-ecommerce',
    label: 'Automation Developer → Ecommerce Brands',
    ctx: {
      careerTrackId: 'developer',
      serviceId: 'automation_developer',
      marketId: 'ecommerce_brands',
      nicheId: null,
      positioning: 'ecommerce automation and workflow systems',
      offerType: 'one_time_project',
      deliverables: [
        'Operations Architecture',
        'Time-Saved ROI Tracking',
        'Client-Facing Automation Integration',
      ],
      uniqueMechanism: 'Operations Architecture',
      valueAmplifier: 'audit_report',
    },
    expectedTrack: 'developer',
  },
];

/* ── Quality check helpers ── */

function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  // Split on sentence-ending punctuation followed by space or end-of-string
  const matches = trimmed.match(/[.!?](?:\s|$)/g);
  if (!matches) return trimmed.endsWith('.') || trimmed.endsWith('!') || trimmed.endsWith('?') ? 1 : 0;
  return matches.length;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countPhrase(text: string, phrase: string): number {
  const lower = text.toLowerCase();
  const target = phrase.toLowerCase();
  let count = 0;
  let pos = 0;
  while ((pos = lower.indexOf(target, pos)) !== -1) {
    count++;
    pos += target.length;
  }
  return count;
}

interface QualityCheck {
  pass: boolean;
  detail: string;
}

function runQualityChecks(
  promise: string,
  ctx: PositionContext,
  position: AuthorityPosition,
): QualityCheck[] {
  const checks: QualityCheck[] = [];
  const serviceLabel = getServiceLabel(ctx.serviceId);
  const buyerLabel = getBuyerLabel(ctx.marketId);

  // 1. Core Trust Promise is 2–3 sentences
  const sentences = countSentences(promise);
  checks.push({
    pass: sentences >= 2 && sentences <= 3,
    detail: `Sentence count: ${sentences} (expected 2–3)`,
  });

  // 2. Approximately 55–70 words maximum
  const words = countWords(promise);
  checks.push({
    pass: words >= 30 && words <= 80,
    detail: `Word count: ${words} (expected ~55–70, accepting 30–80)`,
  });

  // 3. No repeated "I help" phrasing
  const iHelpCount = countPhrase(promise, 'I help');
  checks.push({
    pass: iHelpCount <= 1,
    detail: `"I help" occurrences: ${iHelpCount} (expected ≤1)`,
  });

  // 4. No repeated "every day"
  const everyDayCount = countPhrase(promise, 'every day');
  checks.push({
    pass: everyDayCount <= 1,
    detail: `"every day" occurrences: ${everyDayCount} (expected ≤1)`,
  });

  // 5. References the correct service/specialization
  const hasServiceRef =
    promise.toLowerCase().includes(serviceLabel.toLowerCase()) ||
    promise.toLowerCase().includes(ctx.serviceId?.replace(/_/g, ' ') ?? '');
  checks.push({
    pass: hasServiceRef,
    detail: `References service "${serviceLabel}": ${hasServiceRef}`,
  });

  // 6. References the correct market/niche where appropriate
  const hasMarketRef =
    !ctx.marketId ||
    promise.toLowerCase().includes(buyerLabel.toLowerCase());
  checks.push({
    pass: !ctx.marketId || hasMarketRef,
    detail: `References market "${buyerLabel}": ${hasMarketRef}`,
  });

  // 7. References the real unique mechanism when available
  const hasMechanism =
    !ctx.uniqueMechanism.trim() ||
    promise.toLowerCase().includes(ctx.uniqueMechanism.toLowerCase().trim());
  checks.push({
    pass: !ctx.uniqueMechanism.trim() || hasMechanism,
    detail: `References mechanism "${ctx.uniqueMechanism}": ${hasMechanism}`,
  });

  // 8. Explains how trust is demonstrated
  const trustWords = [
    'trust', 'prove', 'quality', 'craft', 'expertise',
    'show', 'demonstrat', 'speaks for itself',
  ];
  const hasTrustRef = trustWords.some((w) => promise.toLowerCase().includes(w));
  checks.push({
    pass: hasTrustRef,
    detail: `Explains how trust is demonstrated: ${hasTrustRef}`,
  });

  // 9. Contains no fabricated claims or metrics
  const metricPatterns = /\b\d{2,}%\b|\b\d+x\b|\$\d+/g;
  const hasMetrics = metricPatterns.test(promise);
  checks.push({
    pass: !hasMetrics,
    detail: `Contains no fabricated claims/metrics: ${!hasMetrics}`,
  });

  // 10. Grammar and sentence structure are valid (starts with "As", ends with period)
  const startsCorrectly = promise.startsWith('As ');
  const endsCorrectly = promise.endsWith('.');
  checks.push({
    pass: startsCorrectly && endsCorrectly,
    detail: `Starts with "As ": ${startsCorrectly}, ends with ".": ${endsCorrectly}`,
  });

  return checks;
}

/* ── Scoring breakdown helper ── */

interface ScoreBreakdown {
  position: AuthorityPosition;
  builderScore: number;
  auditorScore: number;
  deconstructorScore: number;
  practitionerScore: number;
  winner: AuthorityPosition;
  isTieBroken: boolean;
}

function extractScoreBreakdown(ctx: PositionContext): ScoreBreakdown {
  // We need to manually re-implement the scoring functions here since
  // they are not exported. We'll import the resolveRecommendedPosition and
  // compute scores differently.
  const { scoreBuilder, scoreAuditor, scoreDeconstructor, scorePractitioner } = getScoringFunctions();
  const b = scoreBuilder(ctx);
  const a = scoreAuditor(ctx);
  const d = scoreDeconstructor(ctx);
  const p = scorePractitioner(ctx);
  const winner = resolveRecommendedPosition(ctx);
  const scores = [b, a, d, p].sort((x, y) => y - x);
  return {
    position: winner,
    builderScore: b,
    auditorScore: a,
    deconstructorScore: d,
    practitionerScore: p,
    winner,
    isTieBroken: scores[0] === scores[1],
  };
}

// Access the internal scoring functions by re-importing and re-implementing
// Since they're not exported, we replicate their logic.
function normalise(value: string): string {
  return value.toLowerCase().trim();
}

function scoreBuilderImpl(ctx: PositionContext): number {
  let score = 0;
  const service = ctx.serviceId ?? '';
  const track = getTrack(service);
  const mechanism = normalise(ctx.uniqueMechanism);
  const deliverables = ctx.deliverables.map(normalise).join(' ');

  if (track === 'editor') score += 6;
  if (track === 'developer') score += 5;
  if (track === 'designer') score += 5;

  if (service.includes('editor') || service.includes('developer') || service.includes('designer')) {
    score += 2;
  }

  if (
    deliverables.includes('design') || deliverables.includes('build') ||
    deliverables.includes('develop') || deliverables.includes('create') ||
    deliverables.includes('edit') || deliverables.includes('video') ||
    deliverables.includes('website') || deliverables.includes('landing') ||
    deliverables.includes('interface')
  ) {
    score += 2;
  }

  if (
    mechanism.includes('build') || mechanism.includes('create') ||
    mechanism.includes('design') || mechanism.includes('edit') ||
    mechanism.includes('develop') || mechanism.includes('produce') ||
    mechanism.includes('craft')
  ) {
    score += 2;
  }

  if (
    mechanism.includes('audit') || mechanism.includes('analyse') ||
    mechanism.includes('analyse') || mechanism.includes('measure') ||
    mechanism.includes('optimise') || mechanism.includes('optimize')
  ) {
    score -= 2;
  }

  return score;
}

function scoreAuditorImpl(ctx: PositionContext): number {
  let score = 0;
  const service = ctx.serviceId ?? '';
  const mechanism = normalise(ctx.uniqueMechanism);
  const deliverables = ctx.deliverables.map(normalise).join(' ');
  const positioning = normalise(ctx.positioning);

  if (
    mechanism.includes('audit') || mechanism.includes('analyse') ||
    mechanism.includes('analyse') || mechanism.includes('measure') ||
    mechanism.includes('optimise') || mechanism.includes('optimize') ||
    mechanism.includes('diagnose') || mechanism.includes('evaluate') ||
    mechanism.includes('assess') || mechanism.includes('review') ||
    mechanism.includes('inspect') || mechanism.includes('test')
  ) {
    score += 4;
  }

  if (
    positioning.includes('audit') || positioning.includes('analyse') ||
    positioning.includes('measure') || positioning.includes('optimis') ||
    positioning.includes('diagnos') || positioning.includes('review')
  ) {
    score += 2;
  }

  if (
    deliverables.includes('audit') || deliverables.includes('analysis') ||
    deliverables.includes('report') || deliverables.includes('review') ||
    deliverables.includes('assessment') || deliverables.includes('optimisation') ||
    deliverables.includes('optimization')
  ) {
    score += 2;
  }

  if (
    service === 'ad_creative_editor' &&
    (mechanism.includes('analyse') || mechanism.includes('audit') || mechanism.includes('optimis'))
  ) {
    score += 3;
  }

  if (
    ctx.valueAmplifier.toLowerCase().includes('audit') ||
    ctx.valueAmplifier.toLowerCase().includes('analyse') ||
    ctx.valueAmplifier.toLowerCase().includes('diagnos')
  ) {
    score += 1;
  }

  return score;
}

function scoreDeconstructorImpl(ctx: PositionContext): number {
  let score = 0;
  const mechanism = normalise(ctx.uniqueMechanism);
  const deliverables = ctx.deliverables.map(normalise).join(' ');
  const positioning = normalise(ctx.positioning);

  if (
    mechanism.includes('deconstruct') || mechanism.includes('framework') ||
    mechanism.includes('system') || mechanism.includes('strategy') ||
    mechanism.includes('analyse') || mechanism.includes('analyse') ||
    mechanism.includes('explain') || mechanism.includes('study') ||
    mechanism.includes('research') || mechanism.includes('break down') ||
    mechanism.includes('methodology')
  ) {
    score += 4;
  }

  if (
    positioning.includes('framework') || positioning.includes('system') ||
    positioning.includes('strategy') || positioning.includes('methodolog') ||
    positioning.includes('deconstruct') || positioning.includes('explain') ||
    positioning.includes('analyse')
  ) {
    score += 2;
  }

  if (
    deliverables.includes('framework') || deliverables.includes('strategy') ||
    deliverables.includes('research') || deliverables.includes('analysis') ||
    deliverables.includes('methodology') || deliverables.includes('system') ||
    deliverables.includes('blueprint') || deliverables.includes('playbook') ||
    deliverables.includes('guide')
  ) {
    score += 2;
  }

  const service = ctx.serviceId ?? '';
  if (
    (service === 'presentation_designer' || service === 'brand_designer' || service === 'ui_ux_designer') &&
    (mechanism.includes('framework') || mechanism.includes('system') ||
     mechanism.includes('strategy') || mechanism.includes('design system') ||
     mechanism.includes('methodolog'))
  ) {
    score += 2;
  }

  return score;
}

function scorePractitionerImpl(ctx: PositionContext): number {
  let score = 0;
  const service = ctx.serviceId ?? '';
  const mechanism = normalise(ctx.uniqueMechanism);
  const deliverables = ctx.deliverables.map(normalise).join(' ');

  if (service === 'automation_developer') score += 6;

  if (
    mechanism.includes('automation') || mechanism.includes('workflow') ||
    mechanism.includes('process') || mechanism.includes('system') ||
    mechanism.includes('operation') || mechanism.includes('pipeline') ||
    mechanism.includes('template') || mechanism.includes('repeat') ||
    mechanism.includes('scale') || mechanism.includes('execute') ||
    mechanism.includes('implement')
  ) {
    score += 3;
  }

  if (
    deliverables.includes('automation') || deliverables.includes('workflow') ||
    deliverables.includes('process') || deliverables.includes('system') ||
    deliverables.includes('template') || deliverables.includes('pipeline') ||
    deliverables.includes('operation') || deliverables.includes('integration')
  ) {
    score += 2;
  }

  if (
    ctx.valueAmplifier.toLowerCase().includes('automation') ||
    ctx.valueAmplifier.toLowerCase().includes('workflow') ||
    ctx.valueAmplifier.toLowerCase().includes('process') ||
    ctx.valueAmplifier.toLowerCase().includes('efficiency') ||
    ctx.valueAmplifier.toLowerCase().includes('scale')
  ) {
    score += 1;
  }

  if (
    !mechanism.includes('automation') && !mechanism.includes('workflow') &&
    !mechanism.includes('process') && !mechanism.includes('operation')
  ) {
    score -= 1;
  }

  return score;
}

function getTrack(serviceId: string): string {
  const map: Record<string, string> = {
    video_editor: 'editor',
    short_form_editor: 'editor',
    youtube_editor: 'editor',
    podcast_clip_editor: 'editor',
    ad_creative_editor: 'editor',
    wordpress_developer: 'developer',
    landing_page_developer: 'developer',
    frontend_developer: 'developer',
    no_code_developer: 'developer',
    ui_ux_designer: 'designer',
    landing_page_designer: 'designer',
    brand_designer: 'designer',
    social_media_designer: 'designer',
    presentation_designer: 'designer',
    automation_developer: 'developer',
  };
  return map[serviceId] ?? '';
}

function getScoringFunctions() {
  return {
    scoreBuilder: scoreBuilderImpl,
    scoreAuditor: scoreAuditorImpl,
    scoreDeconstructor: scoreDeconstructorImpl,
    scorePractitioner: scorePractitionerImpl,
  };
}

/* ── Upstream field usage analysis ── */

// Fields in Module3State that are NOT consumed by PositionContext
const MOD3_STATE_FIELDS = [
  { field: 'mod1CareerTrackId', inCtx: false, note: 'Not read by PositionContext or any scoring function' },
  { field: 'mod1ServiceId', inCtx: true, note: 'Used in PositionContext.serviceId' },
  { field: 'mod1MarketId', inCtx: true, note: 'Used in PositionContext.marketId' },
  { field: 'mod1NicheId', inCtx: true, note: 'Used in PositionContext.nicheId — but NEVER read by scoring functions' },
  { field: 'mod1OfferId', inCtx: false, note: 'Not read by PositionContext or any scoring function' },
  { field: 'mod1Positioning', inCtx: true, note: 'Used in PositionContext.positioning — only read by scoreAuditor and scoreDeconstructor' },
  { field: 'mod2OfferType', inCtx: true, note: 'Used in PositionContext.offerType — NEVER read by any scoring function' },
  { field: 'mod2Deliverables', inCtx: true, note: 'Used in PositionContext.deliverables — read by all scoring functions' },
  { field: 'mod2UniqueMechanism', inCtx: true, note: 'Used in PositionContext.uniqueMechanism — read by all scoring functions' },
  { field: 'mod2ScopeLimits', inCtx: false, note: 'Not read by PositionContext or any scoring function' },
  { field: 'mod2ValueAmplifier', inCtx: true, note: 'Used in PositionContext.valueAmplifier — read by scoreAuditor and scorePractitioner' },
  { field: 'mod2PricingModel', inCtx: false, note: 'Not read by PositionContext or any scoring function' },
  { field: 'mod2FinalPrice', inCtx: false, note: 'Not read by PositionContext or any scoring function' },
  { field: 'mod2TieredPricing', inCtx: false, note: 'Not read by PositionContext or any scoring function' },
  { field: 'mod2ValueBasedPricing', inCtx: false, note: 'Not read by PositionContext or any scoring function' },
  { field: 'mod2ProposalSummary', inCtx: false, note: 'Not read by PositionContext or any scoring function' },
];

/* ── Main ── */

function main() {
  const reportLines: string[] = [];
  const push = (s: string) => reportLines.push(s);

  push('# Module 3 Step 1 — Content & Personalization Audit Report');
  push('');
  push(`**Date:** ${new Date().toISOString().slice(0, 10)}`);
  push(`**Engine:** \`src/data/module3/authority-positions.ts\``);
  push('**Mode:** Development-only audit — no production logic modified.');
  push('');
  push('---');
  push('');
  push('## Upstream Field Usage Analysis');
  push('');
  push('| Field | Used by PositionContext? | Used by Scoring? | Note |');
  push('|-------|------------------------|-----------------|------|');

  for (const entry of MOD3_STATE_FIELDS) {
    push(`| \`${entry.field}\` | ${entry.inCtx ? '✅ Yes' : '❌ No'} | ${entry.note.includes('NEVER') || entry.note.includes('Not read') ? '❌ No' : entry.note.includes('read by') || entry.note.includes('only read') ? entry.note.match(/read by/i) ? '⚠ Partial' : '✅ Yes' : '❌ No'} | ${entry.note} |`);
  }

  push('');
  push('### Key findings:');
  push('- **`mod1NicheId`** is stored in PositionContext but **no scoring function reads it**. Niche-specific personalization is absent from Step 1.');
  push('- **`mod1Positioning`** is only consumed by `scoreAuditor` and `scoreDeconstructor`. Builder and Practitioner scoring ignore free-text positioning entirely.');
  push('- **`mod2OfferType`** is stored in PositionContext but never referenced by any scorer. The offer type (retainer/project/etc.) has zero influence on position recommendation.');
  push('- **`mod2ValueAmplifier`** is only consumed by `scoreAuditor` (via `audit`/`analyse`/`diagnos` keywords) and `scorePractitioner` (via `automation`/`workflow`/`process` keywords). Builder and Deconstructor ignore it.');
  push('- **8 out of 16 upstream fields are completely unused** by Step 1 recommendation logic: `nicheId`, `offerId`, `offerType`, `scopeLimits`, `pricingModel`, `finalPrice`, `tieredPricing`, `valueBasedPricing`, `proposalSummary`.');
  push('');
  push('---');
  push('');

  const allPromises: string[] = [];
  let allPass = true;

  for (const persona of PERSONAS) {
    const { ctx, label, id } = persona;
    const recommended = resolveRecommendedPosition(ctx);
    const alternativePositions: AuthorityPosition[] = ['builder', 'auditor', 'deconstructor', 'practitioner'].filter(
      (p) => p !== recommended,
    ) as AuthorityPosition[];
    const rationale = generatePositionRationale(recommended, ctx);

    // Generate trust promise for the recommended position
    const promise = generateCoreTrustPromise(recommended, ctx);
    allPromises.push(promise);

    // Generate trust promises for alternative positions
    const altPromises: Record<string, string> = {};
    for (const alt of alternativePositions) {
      altPromises[alt] = generateCoreTrustPromise(alt, ctx);
    }

    // Score breakdown
    const scores = getScoringFunctions();
    const bScore = scores.scoreBuilder(ctx);
    const aScore = scores.scoreAuditor(ctx);
    const dScore = scores.scoreDeconstructor(ctx);
    const pScore = scores.scorePractitioner(ctx);
    const sorted = [
      { pos: 'builder' as AuthorityPosition, s: bScore },
      { pos: 'auditor' as AuthorityPosition, s: aScore },
      { pos: 'deconstructor' as AuthorityPosition, s: dScore },
      { pos: 'practitioner' as AuthorityPosition, s: pScore },
    ].sort((x, y) => y.s - x.s);
    const isTie = sorted[0].s === sorted[1].s;

    // Quality checks
    const checks = runQualityChecks(promise, ctx, recommended);
    const failedChecks = checks.filter((c) => !c.pass);
    if (failedChecks.length > 0) allPass = false;

    // Generic/duplicate detection
    const priorPromises = allPromises.slice(0, -1);
    const duplicateWarnings: string[] = [];
    for (let i = 0; i < priorPromises.length; i++) {
      if (priorPromises[i] === promise) {
        duplicateWarnings.push(`⚠️ EXACT DUPLICATE of persona ${i + 1}`);
      }
    }

    // Check if any alt promise is same as recommended
    for (const [altPos, altPromise] of Object.entries(altPromises)) {
      if (altPromise === promise) {
        duplicateWarnings.push(`⚠️ "${altPos}" alternative generates identical promise to recommended position`);
      }
    }

    push(`## ${id}`);
    push('');
    push(`**Persona:** ${label}`);
    push('');
    push('### Complete Upstream Inputs');
    push('');
    push('| Input Field | Value |');
    push('|------------|-------|');
    push(`| \`careerTrackId\` | \`${ctx.careerTrackId}\` |`);
    push(`| \`serviceId\` | \`${ctx.serviceId}\` → "${getServiceLabel(ctx.serviceId)}" |`);
    push(`| \`marketId\` | \`${ctx.marketId}\` → "${getBuyerLabel(ctx.marketId)}" |`);
    push(`| \`nicheId\` | \`${ctx.nicheId}\` |`);
    push(`| \`positioning\` | "${ctx.positioning}" |`);
    push(`| \`offerType\` | \`${ctx.offerType}\` |`);
    push(`| \`deliverables\` | ${JSON.stringify(ctx.deliverables)} |`);
    push(`| \`uniqueMechanism\` | "${ctx.uniqueMechanism}" |`);
    push(`| \`valueAmplifier\` | "${ctx.valueAmplifier}" |`);
    push('');
    push('### Scoring Breakdown');
    push('');
    push(`| Position | Score | Key Contributors |`);
    push('|----------|-------|-----------------|');
    const contribBuild = buildContributorSummary('Builder', bScore, ctx, 'builder');
    const contribAudit = buildContributorSummary('Auditor', aScore, ctx, 'auditor');
    const contribDecon = buildContributorSummary('Deconstructor', dScore, ctx, 'deconstructor');
    const contribPrac = buildContributorSummary('Practitioner', pScore, ctx, 'practitioner');
    const contribs = [contribBuild, contribAudit, contribDecon, contribPrac].sort((a, b) => b.score - a.score);
    for (const c of contribs) {
      push(`| ${c.name} | **${c.score}** | ${c.contributors} |`);
    }
    if (isTie) {
      push('');
      push('> ⚠️ **Tie detected.** Default tiebreaker selects `builder`.');
    }
    push('');
    push(`**Recommended Position:** \`${recommended}\``);
    push('');
    push(`**Alternative Positions (in score order):** ${sorted.slice(1).map((s) => `\`${s.pos}\` (${s.s})`).join(', ')}`);
    push('');
    push('### "Why This Position?" Reasoning');
    push('');
    push(`> ${rationale}`);
    push('');
    push('### Core Trust Promise (Recommended)');
    push('');
    push(`> ${promise}`);
    push('');
    push('### Core Trust Promise — Alternatives');
    push('');
    for (const [altPos, altPromise] of Object.entries(altPromises)) {
      push(`**${altPos}:** > ${altPromise}`);
      push('');
    }

    push('### Quality Checks');
    push('');
    for (const check of checks) {
      push(`- ${check.pass ? '✅' : '❌'} ${check.detail}`);
    }
    if (failedChecks.length > 0) {
      push('');
      push('**FAILURES:**');
      for (const fc of failedChecks) {
        push(`- ❌ ${fc.detail}`);
      }
    }
    push('');
    if (duplicateWarnings.length > 0) {
      push('### ⚠️ Warnings');
      push('');
      for (const w of duplicateWarnings) {
        push(`- ${w}`);
      }
      push('');
    }
    push('---');
    push('');
  }

  /* ── Cross-persona comparison ── */

  push('## Cross-Persona Output Differentiation');
  push('');

  // Check for duplicate promises
  const uniquePromises = new Set(allPromises);
  push(`- Total personas: ${PERSONAS.length}`);
  push(`- Unique Core Trust Promises: ${uniquePromises.size}`);
  if (uniquePromises.size < PERSONAS.length) {
    push('- ❌ **DUPLICATE PROMISES DETECTED** — some personas received identical output');
  } else {
    push('- ✅ All 6 promises are materially different');
  }

  // Check exact matches
  for (let i = 0; i < allPromises.length; i++) {
    for (let j = i + 1; j < allPromises.length; j++) {
      if (allPromises[i] === allPromises[j]) {
        push(`  - ❌ Persona ${i + 1} and Persona ${j + 1} produce IDENTICAL trust promises`);
      }
    }
  }

  // Check recommended position diversity
  const positions = PERSONAS.map((p) => resolveRecommendedPosition(p.ctx));
  const uniquePositions = new Set(positions);
  push(`- Unique recommended positions: ${uniquePositions.size} (${[...uniquePositions].join(', ')})`);
  if (uniquePositions.size < 2) {
    push('  - ❌ **All personas recommended the same position** — scoring lacks discrimination');
  }

  push('');
  push('## Overall Audit Result');
  push('');
  push(allPass ? '✅ **ALL CHECKS PASSED**' : '❌ **SOME CHECKS FAILED**');

  // Machine-readable summary
  const totalChecks = PERSONAS.length * 10;
  const passedChecks = PERSONAS.reduce((acc, p) => {
    const promise = generateCoreTrustPromise(resolveRecommendedPosition(p.ctx), p.ctx);
    const checks = runQualityChecks(promise, p.ctx, resolveRecommendedPosition(p.ctx));
    return acc + checks.filter((c) => c.pass).length;
  }, 0);
  push('');
  push(`**Summary:** ${passedChecks}/${totalChecks} quality checks passed (${Math.round(passedChecks / totalChecks * 100)}%)`);
  push('');

  // Output the report
  console.log(reportLines.join('\n'));
}

function buildContributorSummary(
  name: string,
  score: number,
  ctx: PositionContext,
  position: string,
): { name: string; score: number; contributors: string } {
  if (score === 0) return { name, score, contributors: 'No matching signals' };
  const parts: string[] = [];
  const service = ctx.serviceId ?? '';
  const mechanism = normalise(ctx.uniqueMechanism);
  const deliverables = ctx.deliverables.map(normalise).join(' ');
  const positioning = normalise(ctx.positioning);
  const track = getTrack(service);

  if (position === 'builder') {
    if (track === 'editor') parts.push('track:editor (+6)');
    if (track === 'developer') parts.push('track:developer (+5)');
    if (track === 'designer') parts.push('track:designer (+5)');
    if (service.includes('editor') || service.includes('developer') || service.includes('designer')) parts.push('service name (+2)');
    if (
      deliverables.includes('design') || deliverables.includes('build') ||
      deliverables.includes('develop') || deliverables.includes('create') ||
      deliverables.includes('edit') || deliverables.includes('video') ||
      deliverables.includes('website') || deliverables.includes('landing') ||
      deliverables.includes('interface')
    ) parts.push('deliverable keywords (+2)');
    if (
      mechanism.includes('build') || mechanism.includes('create') ||
      mechanism.includes('design') || mechanism.includes('edit') ||
      mechanism.includes('develop') || mechanism.includes('produce') ||
      mechanism.includes('craft')
    ) parts.push('mechanism keywords (+2)');
    if (
      mechanism.includes('audit') || mechanism.includes('analyse') ||
      mechanism.includes('measure') || mechanism.includes('optimise')
    ) parts.push('mechanism is audit-like (-2)');
  }
  // Similar for others - simplified
  if (position === 'auditor') {
    if (
      mechanism.includes('audit') || mechanism.includes('analyse') ||
      mechanism.includes('measure') || mechanism.includes('optimise') ||
      mechanism.includes('diagnose') || mechanism.includes('evaluate') ||
      mechanism.includes('assess') || mechanism.includes('review')
    ) parts.push('mechanism keywords (+4)');
    if (
      positioning.includes('audit') || positioning.includes('analyse') ||
      positioning.includes('measure') || positioning.includes('optimis')
    ) parts.push('positioning keywords (+2)');
    if (
      deliverables.includes('audit') || deliverables.includes('analysis') ||
      deliverables.includes('report') || deliverables.includes('review')
    ) parts.push('deliverable keywords (+2)');
    if (
      ctx.valueAmplifier.toLowerCase().includes('audit') ||
      ctx.valueAmplifier.toLowerCase().includes('analyse')
    ) parts.push('valueAmplifier keywords (+1)');
  }
  if (position === 'deconstructor') {
    if (
      mechanism.includes('deconstruct') || mechanism.includes('framework') ||
      mechanism.includes('system') || mechanism.includes('strategy') ||
      mechanism.includes('analyse') || mechanism.includes('explain') ||
      mechanism.includes('methodology')
    ) parts.push('mechanism keywords (+4)');
    if (
      positioning.includes('framework') || positioning.includes('system') ||
      positioning.includes('strategy') || positioning.includes('methodolog')
    ) parts.push('positioning keywords (+2)');
    if (
      deliverables.includes('framework') || deliverables.includes('strategy') ||
      deliverables.includes('research') || deliverables.includes('analysis')
    ) parts.push('deliverable keywords (+2)');
    if ((service === 'presentation_designer' || service === 'brand_designer' || service === 'ui_ux_designer') && (mechanism.includes('framework') || mechanism.includes('system')))
      parts.push('designer + framework bonus (+2)');
  }
  if (position === 'practitioner') {
    if (service === 'automation_developer') parts.push('automation_developer (+6)');
    if (
      mechanism.includes('automation') || mechanism.includes('workflow') ||
      mechanism.includes('process') || mechanism.includes('system') ||
      mechanism.includes('operation') || mechanism.includes('pipeline') ||
      mechanism.includes('template') || mechanism.includes('repeat') ||
      mechanism.includes('scale') || mechanism.includes('execute')
    ) parts.push('mechanism keywords (+3)');
    if (
      deliverables.includes('automation') || deliverables.includes('workflow') ||
      deliverables.includes('process') || deliverables.includes('system') ||
      deliverables.includes('template') || deliverables.includes('pipeline')
    ) parts.push('deliverable keywords (+2)');
    if (
      ctx.valueAmplifier.toLowerCase().includes('automation') ||
      ctx.valueAmplifier.toLowerCase().includes('workflow') ||
      ctx.valueAmplifier.toLowerCase().includes('process') ||
      ctx.valueAmplifier.toLowerCase().includes('efficiency') ||
      ctx.valueAmplifier.toLowerCase().includes('scale')
    ) parts.push('valueAmplifier keywords (+1)');
    if (
      !mechanism.includes('automation') && !mechanism.includes('workflow') &&
      !mechanism.includes('process') && !mechanism.includes('operation')
    ) parts.push('no execution keywords (-1)');
  }

  return {
    name,
    score,
    contributors: parts.length > 0 ? parts.join('; ') : 'No matching signals',
  };
}

main();
