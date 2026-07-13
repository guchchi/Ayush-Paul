import type { PriorityContext } from './proof-priorities';
import type { AuthorityPosition, ProofPriority, ProofAsset, ProfileCopy, PortfolioCopy, PortfolioSection } from '../../types/module3';

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buyerLabel(marketId: string | null): string {
  const labels: Record<string, string> = {
    youtube_creators: 'YouTube Creators',
    creators: 'Creators',
    coaches: 'Coaches',
    agencies: 'Agencies',
    local_businesses: 'Local Businesses',
    saas_startups: 'SaaS Startups',
    startups: 'Startups',
    course_creators: 'Course Creators',
    podcasters: 'Podcasters',
    ecommerce_brands: 'Ecommerce Brands',
    personal_brands: 'Personal Brands',
  };
  if (marketId && labels[marketId]) return labels[marketId];
  return marketId ? marketId.replace(/_/g, ' ') : 'Target Clients';
}

function buyerLower(marketId: string | null): string {
  return buyerLabel(marketId).toLowerCase();
}

function positionLabel(position: AuthorityPosition): string {
  switch (position) {
    case 'builder': return 'Builder';
    case 'auditor': return 'Auditor';
    case 'deconstructor': return 'Deconstructor';
    case 'practitioner': return 'Practitioner';
  }
}

function offerTypeLabel(offerType: string | null): string {
  switch (offerType) {
    case 'one_time_project': return 'project';
    case 'retainer': return 'retainer';
    case 'milestone_based': return 'milestone-driven';
    default: return 'project';
  }
}

function acceptedAssets(assets: ProofAsset[]): ProofAsset[] {
  return assets.filter((a) => a.isAccepted);
}

export function generateProfileCopy(
  ctx: PriorityContext,
  position: AuthorityPosition,
  trustPromise: string,
  priorities: ProofPriority[],
  assets: ProofAsset[],
): ProfileCopy {
  const buyer = buyerLabel(ctx.marketId);
  const buyerLow = buyerLower(ctx.marketId);
  const service = ctx.serviceId ? ctx.serviceId.replace(/_/g, ' ') : '';
  const posLabel = positionLabel(position);
  const accepted = acceptedAssets(assets);
  const positionAction = position === 'builder' ? 'Build' : position === 'auditor' ? 'Evaluate' : position === 'deconstructor' ? 'Deconstruct' : 'Execute';

  const professionalHeadline = `${capitalize(service)} Who Helps ${buyer} ${capitalize(positionAction)} Trust Through ${posLabel}-Led Proof`;

  const shortBio = `${posLabel} specializing in ${service} for ${buyerLow}. ${trustPromise}. I create self-initiated demonstration projects that prove capability through documented process, verifiable outputs, and honest scope notes.`;

  const deliverableList = ctx.deliverables.length > 0 ? ctx.deliverables.slice(0, 3).join(', ') : `${service} delivery`;
  const longBio = `As a ${posLabel.toLowerCase()} focused on ${buyerLow}, I ${position === 'builder' ? 'build hands-on demonstrations that' : position === 'auditor' ? 'evaluate existing approaches and' : position === 'deconstructor' ? 'break down complex processes and' : 'execute projects that'} prove capability through documented decisions and verifiable outputs. ${trustPromise ? `My core promise: ${trustPromise}.` : ''} Each project is structured around specific credibility gaps — ${priorities.slice(0, 2).map((p) => p.gapTitle).join(' and ')} — addressed through ${deliverableList}. I do not fabricate metrics, claim client relationships, or assert outcomes I cannot evidence.`;

  const offerStatement = `I help ${buyer} ${ctx.uniqueMechanism ? `through ${ctx.uniqueMechanism.toLowerCase()} — ` : ''}delivering ${deliverableList} on a ${offerTypeLabel(ctx.offerType)} basis. Every engagement includes clear scope, documented decisions, and honest outcome notes.`;

  const credibilityBullets = accepted.length > 0
    ? accepted.slice(0, 5).map((a) => `${a.portfolioCopy.headline}`)
    : ['Exploring demonstration projects to showcase capability'];

  const firstAsset = accepted.length > 0 ? accepted[0] : (assets.length > 0 ? assets[0] : null);
  const proofReferenceLine = firstAsset
    ? `See my ${firstAsset.assetType.replace(/_/g, ' ')}: "${firstAsset.title}"`
    : 'Proof assets in development';

  const ctaLine = `Looking for a ${service} who ${ctx.uniqueMechanism ? ctx.uniqueMechanism.toLowerCase() : 'delivers'}? Let's discuss your next ${offerTypeLabel(ctx.offerType)}.`;

  return {
    professionalHeadline,
    shortBio,
    longBio,
    offerStatement,
    credibilityBullets,
    proofReferenceLine,
    ctaLine,
  };
}

export function generatePortfolioCopy(
  ctx: PriorityContext,
  position: AuthorityPosition,
  trustPromise: string,
  assets: ProofAsset[],
  profile: ProfileCopy,
): PortfolioCopy {
  const buyer = buyerLabel(ctx.marketId);
  const buyerLow = buyerLower(ctx.marketId);
  const accepted = acceptedAssets(assets);
  const posLabel = positionLabel(position);

  const sections: PortfolioSection[] = [];

  sections.push({
    type: 'hero',
    heading: profile.professionalHeadline,
    body: `${profile.shortBio}`,
  });

  if (ctx.uniqueMechanism && ctx.valueAmplifier) {
    sections.push({
      type: 'problem',
      heading: 'Problem I Solve',
      body: `${buyer} need ${ctx.uniqueMechanism.toLowerCase()} that ${ctx.valueAmplifier.toLowerCase() ? 'delivers ' + ctx.valueAmplifier.toLowerCase() : 'produces consistent results'}. I address this through ${posLabel.toLowerCase()}-driven demonstration projects that prove capability without fabricated claims.`,
    });
  }

  if (position !== 'auditor') {
    sections.push({
      type: 'process',
      heading: 'Process / Mechanism',
      body: ctx.uniqueMechanism
        ? `My approach: ${ctx.uniqueMechanism}. Every project follows a documented process — from brief interpretation through staged execution to verifiable output — with scope notes, decision rationale, and honest limitations captured at each stage.`
        : `Each project follows a documented process from brief interpretation through staged execution to verifiable output, with decision rationale and honest limitations captured at each stage.`,
    });
  }

  if (accepted.length > 0) {
    sections.push({
      type: 'proof',
      heading: 'Selected Work',
      body: accepted.map((a) => `${a.title}: ${a.portfolioCopy.description}`).join('\n\n'),
      bullets: accepted.map((a) => a.portfolioCopy.headline),
    });
  }

  sections.push({
    type: 'offer',
    heading: 'Offer',
    body: profile.offerStatement,
    bullets: ctx.deliverables.slice(0, 5),
  });

  if (ctx.offerType === 'retainer' || ctx.offerType === 'milestone_based') {
    sections.push({
      type: 'scope',
      heading: 'Scope / Working Style',
      body: ctx.offerType === 'retainer'
        ? `Ongoing ${buyerLow} support with consistent delivery cycles, shared templates, and quality maintained across iterations.`
        : `${capitalize(offerTypeLabel(ctx.offerType))} structure with defined milestones, verification criteria per stage, and cumulative output at completion.`,
    });
  }

  sections.push({
    type: 'cta',
    heading: 'Get in Touch',
    body: profile.ctaLine,
  });

  return {
    portfolioCta: profile.ctaLine,
    sections,
  };
}
