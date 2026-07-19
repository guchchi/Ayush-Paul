import type { AuthorityPosition, AuthorityProfile } from '../../types/module3';
import { classifyService } from './service-taxonomy';

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
  custom_theme_development: 'Custom Theme Developer',
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

export function getServiceLabel(serviceId: string | null): string {
  if (!serviceId) return 'professional';
  return classifyService(serviceId).label;
}

function indefiniteArticle(serviceLabel: string): string {
  const first = serviceLabel.charAt(0).toLowerCase();
  if (serviceLabel.startsWith('UI')) return 'a';
  if ('aeiou'.includes(first)) return 'an';
  return 'a';
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function clampToTwoSentences(text: string): string {
  const sentences = text.match(/[^.!?\n]+[.!?]/g);
  if (!sentences) return text;
  const result = sentences.slice(0, 2).join(' ').trim();
  return result.endsWith('.') ? result : result + '.';
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

const BUYER_PROBLEM_CLAUSES: Record<string, string> = {
  youtube_creators: 'consistent, high-quality content earns viewer trust',
  creators: 'they can build authority without a big portfolio',
  coaches: 'educational content earns attention and trust',
  agencies: 'reliable quality at scale drives client retention',
  local_businesses: 'a credible online presence attracts local customers',
  saas_startups: 'a polished product experience attracts users and investors',
  startups: 'fast execution must not sacrifice quality',
  coaches_consultants: 'professional credibility drives consultation bookings',
  course_creators: 'polished content keeps students engaged',
  podcasters: 'better-produced episodes grow listenership',
  educators: 'clear video lessons improve student outcomes',
  personal_brands: 'consistent quality builds audience trust',
  business_owners: 'professional content works without full-time overhead',
  ecommerce_brands: 'reliable creative production at volume wins',
  marketing_agencies: 'dependable creative production keeps clients',
  personal_brand_creators: 'expertise must be reflected through every piece of content',
};

export function resolveBuyerProblemClause(marketId: string | null): string {
  if (!marketId) return 'they can earn trust without past client work';
  return BUYER_PROBLEM_CLAUSES[marketId] ?? 'they need credible expertise they can trust';
}

function normalise(value: string): string {
  return value.toLowerCase().trim();
}

function scoreBuilder(ctx: PositionContext): number {
  let score = 0;
  const service = ctx.serviceId ?? '';
  const track = classifyService(service).family;
  const mechanism = normalise(ctx.uniqueMechanism);
  const deliverables = ctx.deliverables.map(normalise).join(' ');

  if (track === 'editor') score += 4;
  if (track === 'developer') score += 4;
  if (track === 'designer') score += 3;

  if (
    track === 'editor' ||
    track === 'developer' ||
    track === 'designer'
  ) {
    score += 2;
  }

  if (deliverables.includes('design') || deliverables.includes('build') || deliverables.includes('develop') || deliverables.includes('create') || deliverables.includes('edit') || deliverables.includes('video') || deliverables.includes('website') || deliverables.includes('landing') || deliverables.includes('interface')) {
    score += 2;
  }

  if (mechanism.includes('build') || mechanism.includes('create') || mechanism.includes('design') || mechanism.includes('edit') || mechanism.includes('develop') || mechanism.includes('produce') || mechanism.includes('craft')) {
    score += 2;
  }

  if (mechanism.includes('audit') || mechanism.includes('analyse') || mechanism.includes('measure') || mechanism.includes('optimise') || mechanism.includes('optimize')) {
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

  if (mechanism.includes('deconstruct') || mechanism.includes('analyse') || mechanism.includes('analyse') || mechanism.includes('explain') || mechanism.includes('study') || mechanism.includes('research') || mechanism.includes('break down')) {
    score += 4;
  }

  if (positioning.includes('deconstruct') || positioning.includes('explain') || positioning.includes('analyse') || positioning.includes('research')) {
    score += 2;
  }

  if (deliverables.includes('research') || deliverables.includes('analysis') || deliverables.includes('playbook') || deliverables.includes('guide')) {
    score += 2;
  }

  return score;
}

function scorePractitioner(ctx: PositionContext): number {
  let score = 0;
  const service = ctx.serviceId ?? '';
  const mechanism = normalise(ctx.uniqueMechanism);
  const deliverables = ctx.deliverables.map(normalise).join(' ');
  const track = classifyService(service).family;

  if (track === 'automation') score += 6;

  if (track === 'designer') score += 5;
  if (track === 'editor') score += 4;
  if (track === 'developer') score += 3;

  if (
    track === 'editor' ||
    track === 'developer' ||
    track === 'designer' ||
    track === 'automation'
  ) {
    score += 2;
  }

  if (mechanism.includes('automation') || mechanism.includes('workflow') || mechanism.includes('process') || mechanism.includes('operation') || mechanism.includes('pipeline') || mechanism.includes('template') || mechanism.includes('repeat') || mechanism.includes('scale') || mechanism.includes('execute') || mechanism.includes('implement')) {
    score += 3;
  }

  if (mechanism.includes('design') || mechanism.includes('edit') || mechanism.includes('build') || mechanism.includes('develop') || mechanism.includes('create') || mechanism.includes('implement')) {
    score += 2; // Active execution/creation verbs for practitioners
  }

  if (deliverables.includes('automation') || deliverables.includes('workflow') || deliverables.includes('process') || deliverables.includes('template') || deliverables.includes('pipeline') || deliverables.includes('operation') || deliverables.includes('integration')) {
    score += 2;
  }

  if (deliverables.includes('design') || deliverables.includes('interface') || deliverables.includes('mockup') || deliverables.includes('prototype') || deliverables.includes('wireframe')) {
    score += 2;
  }

  if (ctx.offerType === 'one_time_project' || ctx.offerType === 'retainer') {
    score += 1; // Direct execution fits standard project/retainer delivery
  }

  if (ctx.valueAmplifier.toLowerCase().includes('automation') || ctx.valueAmplifier.toLowerCase().includes('workflow') || ctx.valueAmplifier.toLowerCase().includes('process') || ctx.valueAmplifier.toLowerCase().includes('efficiency') || ctx.valueAmplifier.toLowerCase().includes('scale')) {
    score += 1;
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
  const buyerLabel = getBuyerLabel(ctx.marketId);

  function reason(text: string): string {
    return `• ${text}`;
  }

  switch (position) {
    case 'builder': {
      const parts: string[] = [];
      parts.push(reason(`You are a ${serviceLabel} — your work is tangible and prospects can evaluate it directly.`));
      if (mechanism) {
        parts.push(reason(`Your "${mechanism}" method produces output that speaks for itself, so trust is earned through the quality of what you deliver to ${buyerLabel}.`));
      } else {
        parts.push(reason(`Prospects trust you because they can see the quality in every piece of work you produce for ${buyerLabel}.`));
      }
      parts.push(reason(`This position works because ${buyerProblem}.`));
      return parts.join('\n');
    }
    case 'auditor': {
      const parts: string[] = [];
      parts.push(reason(`As a ${serviceLabel}, you find what is broken and show how to fix it — ${buyerLabel} need that measurable clarity.`));
      if (mechanism) {
        parts.push(reason(`Your "${mechanism}" gives ${buyerLabel} a clear, data-backed path to improvement.`));
      }
      parts.push(reason(`This position works because ${buyerProblem}.`));
      return parts.join('\n');
    }
    case 'deconstructor': {
      const parts: string[] = [];
      parts.push(reason(`You break down why effective work succeeds, which helps ${buyerLabel} understand the strategy behind the execution.`));
      if (mechanism) {
        parts.push(reason(`Your "${mechanism}" framework translates complex challenges into clear, actionable insights for ${buyerLabel}.`));
      }
      parts.push(reason(`This position works because ${buyerProblem}.`));
      return parts.join('\n');
    }
    case 'practitioner': {
      const parts: string[] = [];
      parts.push(reason(`You do the work yourself as a ${serviceLabel} — no theory, no delegation, just real execution for ${buyerLabel}.`));
      if (mechanism) {
        parts.push(reason(`Your "${mechanism}" is built on hands-on experience, which is what ${buyerLabel} need to trust.`));
      }
      parts.push(reason(`This position works because ${buyerProblem}.`));
      return parts.join('\n');
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

interface ProcessPhrase {
  text: string;
}

function normaliseMechanismToProcess(mechanism: string): string {
  const text = mechanism.trim();
  const words = text.split(/\s+/);
  const lastWord = words[words.length - 1] ?? '';
  const lowerLast = lastWord.toLowerCase();

  if (lowerLast === 'builder' && words.length >= 2) {
    const penultimate = words[words.length - 2];
    const prefix = words.slice(0, -2).join(' ');
    if (prefix) return `${prefix} ${penultimate}-building system`;
    return `${penultimate}-building system`;
  }

  if (lowerLast === 'design' && words.length >= 2) {
    const penultimate = words[words.length - 2];
    const prefix = words.slice(0, -2).join(' ');
    if (prefix) return `${prefix}, ${penultimate}-focused design approach`;
    return `${penultimate}-focused design approach`;
  }

  return text;
}

function describeProcess(deliverables: string[], mechanism: string, serviceId: string | null): ProcessPhrase {
  const mech = mechanism.trim();
  if (mech) {
    return { text: normaliseMechanismToProcess(mech) };
  }
  const label = getServiceLabel(serviceId).toLowerCase();
  if (label.includes('edit')) return { text: 'selecting the best moments, pacing the story, and polishing every frame' };
  if (label.includes('develop')) return { text: 'turning requirements into clean, functional builds' };
  if (label.includes('design')) return { text: 'moving from concept to pixel-perfect output' };
  if (label.includes('automation')) return { text: 'designing workflows that save time and eliminate errors' };
  return { text: 'applying a structured, repeatable approach' };
}

function mechanismLead(mechanismText: string): string {
  const lastWord = mechanismText.trim().split(/\s+/).pop() ?? '';
  const endsWithGerund = lastWord.endsWith('ing');
  if (endsWithGerund) {
    return `Using ${mechanismText}`;
  }
  const first = mechanismText.trim().charAt(0).toLowerCase();
  const article = 'aeiou'.includes(first) ? 'an' : 'a';
  return `Using ${article} ${mechanismText}`;
}

function buildTrustPromise(
  sentence1: string,
  sentence2: string,
): string {
  let s1 = sentence1.trim();
  if (!s1.endsWith('.')) s1 += '.';
  let s2 = sentence2.trim();
  if (!s2.endsWith('.')) s2 += '.';

  let text = `${s1} ${s2}`;
  let count = wordCount(text);

  if (count >= 35 && count <= 55) {
    return text;
  }

  if (count < 35) {
    const s2Clean = s2.replace(/\.$/, '');
    const tail = ' to establish high-converting credibility without unnecessary overhead.';
    s2 = `${s2Clean}${tail}`;
    text = `${s1} ${s2}`;
    count = wordCount(text);
    if (count >= 35 && count <= 55) {
      return text;
    }
  }

  if (count > 55) {
    const words = text.split(/\s+/);
    const s1Words = s1.split(/\s+/);
    const s1Count = s1Words.length;
    const remaining = 54 - s1Count;
    if (remaining > 5) {
      const s2Words = s2.split(/\s+/);
      const s2Truncated = s2Words.slice(0, remaining).join(' ') + '.';
      text = `${s1} ${s2Truncated}`;
    } else {
      const truncatedS1 = s1Words.slice(0, 30).join(' ') + '.';
      const dummyS2 = 'I deliver results consistently.';
      text = `${truncatedS1} ${dummyS2}`;
    }
  }

  const sentences = text.match(/[^.!?\n]+[.!?]/g);
  if (sentences && sentences.length >= 2) {
    text = `${sentences[0].trim()} ${sentences[1].trim()}`;
  }
  return text;
}

export function generateCoreTrustPromise(
  position: AuthorityPosition,
  ctx: PositionContext,
  variation?: number,
): string {
  const serviceLabel = getServiceLabel(ctx.serviceId);
  const article = indefiniteArticle(serviceLabel);
  const buyer = getBuyerLabel(ctx.marketId);
  const problemClause = resolveBuyerProblemClause(ctx.marketId);

  const positioning = ctx.positioning.trim();
  const rolePart = positioning
    ? `${serviceLabel} focused on ${buyer}`
    : `${serviceLabel}`;

  const deliverables = ctx.deliverables;
  const mechanism = ctx.uniqueMechanism.trim();
  const v = variation ?? 0;

  switch (position) {
    case 'builder': {
      const process = describeProcess(deliverables, mechanism, ctx.serviceId);
      const method = mechanism
        ? `${mechanismLead(process.text)}`
        : `By ${process.text}`;
      
      const mod = v % 3;
      if (mod === 0) {
        const opening = `I am ${article} ${rolePart} who proves expertise through the quality of what I produce.`;
        const explanation = `${method}, I deliver work that shows ${buyer} how ${problemClause}.`;
        return buildTrustPromise(opening, explanation);
      } else if (mod === 1) {
        const opening = `As ${article} ${rolePart}, I let my work speak for itself.`;
        const explanation = `${method}, I give ${buyer} the quality they need because I understand that ${problemClause}.`;
        return buildTrustPromise(opening, explanation);
      } else {
        const opening = `I am ${article} ${rolePart} who designs and crafts every project to the highest standards.`;
        const explanation = `${method}, I help ${buyer} solve the problem that ${problemClause}.`;
        return buildTrustPromise(opening, explanation);
      }
    }

    case 'auditor': {
      const method = mechanism || 'structured analysis';
      const mod = v % 3;
      if (mod === 0) {
        const opening = `I am ${article} ${rolePart} who earns trust by finding what is broken and showing how to fix it.`;
        const explanation = `My ${method} gives ${buyer} a clear path to better results, because I understand that ${problemClause}.`;
        return buildTrustPromise(opening, explanation);
      } else if (mod === 1) {
        const opening = `I am ${article} ${rolePart} who helps ${buyer} by identifying what is not working and how to improve it.`;
        const explanation = `Through ${method}, I provide a measurable path forward because I understand that ${problemClause}.`;
        return buildTrustPromise(opening, explanation);
      } else {
        const opening = `As ${article} ${rolePart}, I audit and measure existing setups to reveal performance bottlenecks.`;
        const explanation = `Using ${method}, I ensure ${buyer} gets optimal efficiency because ${problemClause}.`;
        return buildTrustPromise(opening, explanation);
      }
    }

    case 'deconstructor': {
      const framework = mechanism || 'structured analysis';
      const mod = v % 3;
      if (mod === 0) {
        const opening = `I am ${article} ${rolePart} who earns trust by breaking down what works and making it actionable.`;
        const explanation = `My ${framework} approach helps ${buyer} see exactly how to solve the problem that ${problemClause}.`;
        return buildTrustPromise(opening, explanation);
      } else if (mod === 1) {
        const opening = `I am ${article} ${rolePart} who earns trust by studying what works and turning it into a repeatable approach.`;
        const explanation = `${framework} is how I help ${buyer} solve the challenge that ${problemClause}.`;
        return buildTrustPromise(opening, explanation);
      } else {
        const opening = `As ${article} ${rolePart}, I analyze industry benchmarks and dissect successful patterns.`;
        const explanation = `Using ${framework}, I show ${buyer} exactly why their competitors succeed and how ${problemClause}.`;
        return buildTrustPromise(opening, explanation);
      }
    }

    case 'practitioner': {
      const action = mechanism
        ? `applying ${mechanism} every day`
        : `delivering ${describeDeliverableSet(deliverables, ctx.serviceId)} myself`;
      
      const mod = v % 3;
      if (mod === 0) {
        const opening = `I am ${article} ${rolePart} who earns trust by doing the work myself, every day.`;
        const explanation = `I help ${buyer} by ${action}, which means I understand first-hand that ${problemClause}.`;
        return buildTrustPromise(opening, explanation);
      } else if (mod === 1) {
        const opening = `I am ${article} ${rolePart} who earns trust through hands-on execution, not theory.`;
        const explanation = `By ${action}, I show ${buyer} that I understand first-hand how ${problemClause}.`;
        return buildTrustPromise(opening, explanation);
      } else {
        const opening = `As ${article} ${rolePart}, I stay in the trenches delivering results without layers of delegation.`;
        const explanation = `Through ${action}, I guarantee ${buyer} that I know exactly how ${problemClause}.`;
        return buildTrustPromise(opening, explanation);
      }
    }
  }
}

export function generateGeneratedPromise(
  position: AuthorityPosition,
  ctx: PositionContext,
): string {
  return generateCoreTrustPromise(position, ctx, 0);
}

function getPositionInfo(position: AuthorityPosition) {
  return AUTHORITY_POSITIONS.find((p) => p.id === position) || AUTHORITY_POSITIONS[0];
}

export function generateAuthorityProfile(position: AuthorityPosition, ctx: PositionContext): AuthorityProfile {
  const info = getPositionInfo(position);
  const coreTrustPromise = generateCoreTrustPromise(position, ctx, 0);
  const rationale = generatePositionRationale(position, ctx);

  let startDoing: string[];
  let continueDoing: string[];
  let avoidDoing: string[];
  let clientPerspective: string;

  const buyer = getBuyerLabel(ctx.marketId);

  if (position === 'builder') {
    startDoing = ['Documenting the raw process of creation', 'Showcasing unpolished "before" states'];
    continueDoing = ['Delivering high-quality final outputs', 'Maintaining your current standards'];
    avoidDoing = ['Giving theoretical advice without showing the work', 'Hiding behind jargon'];
    clientPerspective = `As a ${buyer}, I trust you because I can see the undeniable quality of what you produce. I don't care about your philosophy; I care that you can build the thing I need.`;
  } else if (position === 'auditor') {
    startDoing = ['Sharing diagnostic tools and checklists', 'Highlighting common failure patterns'];
    continueDoing = ['Being meticulous with data and measurement', 'Providing clear improvement paths'];
    avoidDoing = ['Making subjective claims without data', 'Focusing only on execution without strategy'];
    clientPerspective = `As a ${buyer}, I trust you because you can see exactly where my current setup is failing. Your objective measurement gives me confidence that we are fixing the right problems.`;
  } else if (position === 'deconstructor') {
    startDoing = ['Writing teardowns of successful examples', 'Creating visual frameworks'];
    continueDoing = ['Making complex concepts simple', 'Focusing on the "why" behind the "what"'];
    avoidDoing = ['Keeping your insights to yourself', 'Overcomplicating the solution'];
    clientPerspective = `As a ${buyer}, I trust you because you make the complex seem simple. Your frameworks give me clarity and a mental model I can actually use.`;
  } else {
    startDoing = ['Sharing daily learnings from the trenches', 'Showing the messy reality of the work'];
    continueDoing = ['Executing at a high level', 'Staying close to the actual work'];
    avoidDoing = ['Positioning yourself as a detached guru', 'Delegating the core value delivery'];
    clientPerspective = `As a ${buyer}, I trust you because you actually do the work. You aren't just an advisor—you're in the trenches every day, which means your advice is grounded in reality.`;
  }

  const report = `Authority Strategy Report
---
Position: ${info.label}
Focus: ${ctx.deliverables.join(', ') || 'Your core service'}
Audience: ${buyer}

Your strategic advantage lies in ${info.howTrustIsEarned.toLowerCase()} This means your entire presence should reflect the reality of your work, rather than relying on standard marketing claims.`;

  return {
    version: 1,
    position,
    summary: info.label,
    strategicExplanation: info.howTrustIsEarned,
    whyThisFitsYou: rationale,
    coreTrustPromise,
    reinforcementPlan: {
      startDoing,
      continueDoing,
      avoidDoing,
    },
    clientPerspective,
    report,
  };
}

export function analyzeAuthorityStrategy(ctx: PositionContext): AuthorityProfile {
  const recommendedPosition = resolveRecommendedPosition(ctx);
  return generateAuthorityProfile(recommendedPosition, ctx);
}
