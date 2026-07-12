import type { AuthorityPosition } from '../../types/module3';

export interface AuthorityPositionInfo {
  id: AuthorityPosition;
  label: string;
  shortExplanation: string;
  howTrustIsEarned: string;
}

export const AUTHORITY_POSITIONS: AuthorityPositionInfo[] = [
  {
    id: 'builder',
    label: 'The Builder',
    shortExplanation: 'I design, build, make things.',
    howTrustIsEarned: 'Trust is earned by showing craft, structure, and the quality of what you produce.',
  },
  {
    id: 'auditor',
    label: 'The Auditor',
    shortExplanation: 'I audit, measure, optimise what exists.',
    howTrustIsEarned: 'Trust is earned by finding what is broken, measuring what matters, and showing clear improvement paths.',
  },
  {
    id: 'deconstructor',
    label: 'The Deconstructor',
    shortExplanation: 'I study, analyse, explain how things work.',
    howTrustIsEarned: 'Trust is earned by breaking down complex problems and making them simple and actionable.',
  },
  {
    id: 'practitioner',
    label: 'The Practitioner',
    shortExplanation: 'I do the work myself, every day.',
    howTrustIsEarned: 'Trust is earned by doing the work yourself and showing real execution, not just theory.',
  },
];

export interface PositionContext {
  careerTrackId: string | null;
  serviceId: string | null;
  marketId: string | null;
  nicheId: string | null;
  positioning: string;
  offerType: string | null;
  deliverables: string[];
  uniqueMechanism: string;
  valueAmplifier: string;
}

const SERVICE_LABELS: Record<string, string> = {
  video_editor: 'Video Editor',
  short_form_editor: 'Short-Form Editor',
  youtube_editor: 'YouTube Editor',
  podcast_clip_editor: 'Podcast Clip Editor',
  ad_creative_editor: 'Ad Creative Editor',
  wordpress_developer: 'WordPress Developer',
  landing_page_developer: 'Landing Page Developer',
  frontend_developer: 'Frontend Developer',
  no_code_developer: 'No-Code Developer',
  ui_ux_designer: 'UI/UX Designer',
  landing_page_designer: 'Landing Page Designer',
  brand_designer: 'Brand Designer',
  social_media_designer: 'Social Media Designer',
  presentation_designer: 'Pitch Deck Designer',
  automation_developer: 'Automation Developer',
  editor: 'Editor',
  developer: 'Developer',
  designer: 'Designer',
};

const SERVICE_TO_TRACK: Record<string, string> = {
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

export function getServiceLabel(serviceId: string | null): string {
  if (!serviceId) return 'professional';
  return SERVICE_LABELS[serviceId] ?? serviceId.replace(/_/g, ' ');
}

function indefiniteArticle(serviceLabel: string): string {
  const first = serviceLabel.charAt(0).toLowerCase();
  if (serviceLabel.startsWith('UI')) return 'a';
  if ('aeiou'.includes(first)) return 'an';
  return 'a';
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

export function getBuyerLabel(marketId: string | null): string {
  if (!marketId) return 'your ideal client';
  return BUYER_LABELS[marketId] ?? marketId.replace(/_/g, ' ');
}

export function formatBuyerAudience(marketId: string | null, nicheId: string | null): string {
  const buyer = getBuyerLabel(marketId);
  if (nicheId) {
    const nicheLabel = nicheId.replace(/_/g, ' ');
    if (!nicheLabel.toLowerCase().includes(buyer.toLowerCase())) {
      return `${nicheLabel} (${buyer})`;
    }
    return nicheLabel;
  }
  return buyer;
}

const BUYER_PROBLEMS: Record<string, string> = {
  youtube_creators: 'earning trust through consistent, high-quality content',
  creators: 'building authority without a big portfolio',
  coaches: 'earning trust through educational content',
  agencies: 'delivering reliable quality at scale',
  local_businesses: 'building a credible online presence on a limited budget',
  saas_startups: 'polishing their product experience to attract users and investors',
  startups: 'executing fast without sacrificing quality',
  coaches_consultants: 'establishing professional credibility online',
  course_creators: 'keeping students engaged through polished content',
  podcasters: 'growing listenership with better-produced episodes',
  educators: 'creating clear, structured video lessons',
  personal_brands: 'maintaining consistent quality across content',
  business_owners: 'building professional content without the overhead',
  ecommerce_brands: 'producing reliable creative at volume',
  marketing_agencies: 'delivering dependable creative production',
  personal_brand_creators: 'reflecting expertise through content',
};

export function resolveBuyerProblem(marketId: string | null): string {
  if (!marketId) return 'earning trust without past client work';
  return BUYER_PROBLEMS[marketId] ?? 'finding credible expertise they can trust';
}

function normalise(value: string): string {
  return value.toLowerCase().trim();
}

function countMatches(terms: string[], source: string): number {
  const lower = normalise(source);
  return terms.reduce((count, term) => (lower.includes(term) ? count + 1 : count), 0);
}

function scoreBuilder(ctx: PositionContext): number {
  let score = 0;
  const service = ctx.serviceId ?? '';
  const track = SERVICE_TO_TRACK[service] ?? '';
  const mechanism = normalise(ctx.uniqueMechanism);
  const deliverables = ctx.deliverables.map(normalise).join(' ');

  if (track === 'editor') score += 6;
  if (track === 'developer') score += 5;
  if (track === 'designer') score += 5;

  if (
    service.includes('editor') ||
    service.includes('developer') ||
    service.includes('designer')
  ) {
    score += 2;
  }

  if (deliverables.includes('design') || deliverables.includes('build') || deliverables.includes('develop') || deliverables.includes('create') || deliverables.includes('edit') || deliverables.includes('video') || deliverables.includes('website') || deliverables.includes('landing') || deliverables.includes('interface')) {
    score += 2;
  }

  if (mechanism.includes('build') || mechanism.includes('create') || mechanism.includes('design') || mechanism.includes('edit') || mechanism.includes('develop') || mechanism.includes('produce') || mechanism.includes('craft')) {
    score += 2;
  }

  if (mechanism.includes('audit') || mechanism.includes('analyse') || mechanism.includes('analyse') || mechanism.includes('measure') || mechanism.includes('optimise') || mechanism.includes('optimize')) {
    score -= 2;
  }

  return score;
}

function scoreAuditor(ctx: PositionContext): number {
  let score = 0;
  const service = ctx.serviceId ?? '';
  const mechanism = normalise(ctx.uniqueMechanism);
  const deliverables = ctx.deliverables.map(normalise).join(' ');
  const positioning = normalise(ctx.positioning);

  if (mechanism.includes('audit') || mechanism.includes('analyse') || mechanism.includes('analyse') || mechanism.includes('measure') || mechanism.includes('optimise') || mechanism.includes('optimize') || mechanism.includes('diagnose') || mechanism.includes('evaluate') || mechanism.includes('assess') || mechanism.includes('review') || mechanism.includes('inspect') || mechanism.includes('test')) {
    score += 4;
  }

  if (positioning.includes('audit') || positioning.includes('analyse') || positioning.includes('measure') || positioning.includes('optimis') || positioning.includes('diagnos') || positioning.includes('review')) {
    score += 2;
  }

  if (deliverables.includes('audit') || deliverables.includes('analysis') || deliverables.includes('report') || deliverables.includes('review') || deliverables.includes('assessment') || deliverables.includes('optimisation') || deliverables.includes('optimization')) {
    score += 2;
  }

  if (service === 'ad_creative_editor' && (mechanism.includes('analyse') || mechanism.includes('audit') || mechanism.includes('optimis'))) {
    score += 3;
  }

  if (ctx.valueAmplifier.toLowerCase().includes('audit') || ctx.valueAmplifier.toLowerCase().includes('analyse') || ctx.valueAmplifier.toLowerCase().includes('diagnos')) {
    score += 1;
  }

  return score;
}

function scoreDeconstructor(ctx: PositionContext): number {
  let score = 0;
  const mechanism = normalise(ctx.uniqueMechanism);
  const deliverables = ctx.deliverables.map(normalise).join(' ');
  const positioning = normalise(ctx.positioning);

  if (mechanism.includes('deconstruct') || mechanism.includes('framework') || mechanism.includes('system') || mechanism.includes('strategy') || mechanism.includes('analyse') || mechanism.includes('analyse') || mechanism.includes('explain') || mechanism.includes('study') || mechanism.includes('research') || mechanism.includes('break down') || mechanism.includes('methodology')) {
    score += 4;
  }

  if (positioning.includes('framework') || positioning.includes('system') || positioning.includes('strategy') || positioning.includes('methodolog') || positioning.includes('deconstruct') || positioning.includes('explain') || positioning.includes('analyse')) {
    score += 2;
  }

  if (deliverables.includes('framework') || deliverables.includes('strategy') || deliverables.includes('research') || deliverables.includes('analysis') || deliverables.includes('methodology') || deliverables.includes('system') || deliverables.includes('blueprint') || deliverables.includes('playbook') || deliverables.includes('guide')) {
    score += 2;
  }

  const service = ctx.serviceId ?? '';
  if ((service === 'presentation_designer' || service === 'brand_designer' || service === 'ui_ux_designer') && (mechanism.includes('framework') || mechanism.includes('system') || mechanism.includes('strategy') || mechanism.includes('design system') || mechanism.includes('methodolog'))) {
    score += 2;
  }

  return score;
}

function scorePractitioner(ctx: PositionContext): number {
  let score = 0;
  const service = ctx.serviceId ?? '';
  const mechanism = normalise(ctx.uniqueMechanism);
  const deliverables = ctx.deliverables.map(normalise).join(' ');

  if (service === 'automation_developer') score += 6;

  if (mechanism.includes('automation') || mechanism.includes('workflow') || mechanism.includes('process') || mechanism.includes('system') || mechanism.includes('operation') || mechanism.includes('pipeline') || mechanism.includes('template') || mechanism.includes('repeat') || mechanism.includes('scale') || mechanism.includes('execute') || mechanism.includes('implement')) {
    score += 3;
  }

  if (deliverables.includes('automation') || deliverables.includes('workflow') || deliverables.includes('process') || deliverables.includes('system') || deliverables.includes('template') || deliverables.includes('pipeline') || deliverables.includes('operation') || deliverables.includes('integration')) {
    score += 2;
  }

  if (ctx.valueAmplifier.toLowerCase().includes('automation') || ctx.valueAmplifier.toLowerCase().includes('workflow') || ctx.valueAmplifier.toLowerCase().includes('process') || ctx.valueAmplifier.toLowerCase().includes('efficiency') || ctx.valueAmplifier.toLowerCase().includes('scale')) {
    score += 1;
  }

  if (!mechanism.includes('automation') && !mechanism.includes('workflow') && !mechanism.includes('process') && !mechanism.includes('operation')) {
    score -= 1;
  }

  return score;
}

interface ScoredPosition {
  position: AuthorityPosition;
  score: number;
  reason: string;
}

export function resolveRecommendedPosition(ctx: PositionContext): AuthorityPosition {
  const scores: ScoredPosition[] = [
    { position: 'builder', score: scoreBuilder(ctx), reason: '' },
    { position: 'auditor', score: scoreAuditor(ctx), reason: '' },
    { position: 'deconstructor', score: scoreDeconstructor(ctx), reason: '' },
    { position: 'practitioner', score: scorePractitioner(ctx), reason: '' },
  ];

  scores.sort((a, b) => b.score - a.score);

  if (scores[0].score === scores[1].score) {
    return 'builder';
  }

  return scores[0].position;
}

function generateScoreExplanation(
  position: AuthorityPosition,
  ctx: PositionContext,
): string {
  const serviceLabel = getServiceLabel(ctx.serviceId);
  const buyerProblem = resolveBuyerProblem(ctx.marketId);
  const mechanism = ctx.uniqueMechanism.trim();

  switch (position) {
    case 'builder': {
      if (mechanism) {
        return `As a ${serviceLabel}, your strength is in the quality of what you produce. Your "${mechanism}" approach focuses on creating output that speaks for itself. The Builder position lets prospects trust you based on your craft — the actual work you deliver, not past client names. This works because ${buyerProblem}.`;
      }
      return `As a ${serviceLabel}, your strength is in the quality of what you produce. The Builder position lets prospects trust you based on your craft — the actual work you deliver, not past client names. This works because ${buyerProblem}.`;
    }
    case 'auditor': {
      const phrase = mechanism
        ? `Your "${mechanism}" approach is well-suited to the Auditor position`
        : 'The Auditor position';
      return `${phrase}, which lets prospects trust you because you can find what is broken, measure what matters, and show a clear improvement path. This works because ${buyerProblem}.`;
    }
    case 'deconstructor': {
      const phrase = mechanism
        ? `Your "${mechanism}" approach fits the Deconstructor position naturally`
        : 'The Deconstructor position';
      return `${phrase}, which lets prospects trust you because you can break down complex problems into clear, actionable insights. This works because ${buyerProblem}.`;
    }
    case 'practitioner': {
      const phrase = mechanism
        ? `Your "${mechanism}" approach is built on real execution`
        : 'You are positioned as a hands-on executor';
      return `${phrase}. The Practitioner position lets prospects trust you because you do the work yourself every day — not just talk about it. This works because ${buyerProblem}.`;
    }
  }
}

export function generatePositionRationale(
  position: AuthorityPosition,
  ctx: PositionContext,
): string {
  return generateScoreExplanation(position, ctx);
}

function pickTopDeliverables(deliverables: string[], maxCount: number = 2): string[] {
  if (deliverables.length === 0) return [];
  const sorted = [...deliverables].sort((a, b) => a.length - b.length);
  return sorted.slice(0, maxCount);
}

function describeDeliverableSet(deliverables: string[], serviceId: string | null): string {
  if (deliverables.length === 0) {
    const label = getServiceLabel(serviceId).toLowerCase();
    if (label.includes('edit')) return 'final polished videos';
    if (label.includes('develop')) return 'production-ready builds';
    if (label.includes('design')) return 'finished design work';
    if (label.includes('automation')) return 'working automations';
    return 'professional deliverables';
  }
  const top = pickTopDeliverables(deliverables, 2);
  if (top.length === 1) return top[0];
  return `${top[0]} and ${top[1]}`;
}

function describeProcess(deliverables: string[], mechanism: string, serviceId: string | null): string {
  const mech = mechanism.trim();
  if (mech) {
    return mech;
  }
  const label = getServiceLabel(serviceId).toLowerCase();
  if (label.includes('edit')) return 'selecting the best moments, pacing the story, and polishing every frame';
  if (label.includes('develop')) return 'turning requirements into clean, functional builds';
  if (label.includes('design')) return 'moving from concept to pixel-perfect output';
  if (label.includes('automation')) return 'designing workflows that save time and eliminate errors';
  return 'applying a structured, repeatable approach';
}

export function generateCoreTrustPromise(
  position: AuthorityPosition,
  ctx: PositionContext,
): string {
  const serviceLabel = getServiceLabel(ctx.serviceId);
  const article = indefiniteArticle(serviceLabel);
  const buyer = getBuyerLabel(ctx.marketId);
  const problem = resolveBuyerProblem(ctx.marketId);

  const positioning = ctx.positioning.trim();
  const roleWithPositioning = positioning
    ? `${article} ${serviceLabel} specialising in ${positioning}`
    : `${article} ${serviceLabel}`;

  const deliverables = ctx.deliverables;
  const mechanism = ctx.uniqueMechanism.trim();

  switch (position) {
    case 'builder': {
      const process = describeProcess(deliverables, mechanism, ctx.serviceId);
      const processLead = mechanism
        ? `Through ${process}`
        : `By ${process}`;
      return `As ${roleWithPositioning}, I prove my expertise through the quality of what I produce. ${processLead}, I show ${buyer} I understand their need for ${problem}. This is the standard of work they can expect.`;
    }

    case 'auditor': {
      const method = mechanism || 'structured analysis';
      return `As ${roleWithPositioning}, I prove my expertise by finding what is broken and showing how to fix it. My ${method} gives ${buyer} a clear, measurable path to better results, because I understand their need for ${problem}.`;
    }

    case 'deconstructor': {
      const framework = mechanism || 'structured analysis';
      return `As ${roleWithPositioning}, I prove my expertise by breaking down why effective work succeeds. My ${framework} framework helps ${buyer} see exactly how to solve their need for ${problem}.`;
    }

    case 'practitioner': {
      const action = mechanism
        ? `applying ${mechanism} every day`
        : `delivering ${describeDeliverableSet(deliverables, ctx.serviceId)} myself`;
      return `As ${roleWithPositioning}, I prove my expertise by doing the work myself, every day. I help ${buyer} by ${action}, which means I understand their need for ${problem} first-hand.`;
    }
  }
}

export function generateGeneratedPromise(
  position: AuthorityPosition,
  ctx: PositionContext,
): string {
  return generateCoreTrustPromise(position, ctx);
}
