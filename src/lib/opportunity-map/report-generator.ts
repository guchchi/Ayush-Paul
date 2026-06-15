import type {
  ClientSource,
  OpportunityMapState,
} from '@/src/types/opportunity-map';
import {
  resolveSelectedService,
  resolveSelectedMarket,
  resolveSelectedNiche,
  resolveSelectedOffer,
} from '@/src/lib/opportunity-map/store';
import {
  calculateOpportunityScore,
  type DifficultyRating,
  type OpportunityScoreResult,
} from '@/src/lib/opportunity-map/simulator-engine';

export interface ReportEntity {
  id: string;
  label: string;
  description: string;
}

export interface ReportOffer {
  id: string;
  label: string;
  description: string;
  priceRange: string;
  deliveryFormat: string;
}

export interface ActionPlanItem {
  step: number;
  action: string;
}

export interface OpportunityReport {
  careerTrack: ReportEntity | null;
  service: ReportEntity | null;
  market: ReportEntity | null;
  niche: ReportEntity | null;
  offer: ReportOffer | null;
  positioningTemplate: string;
  opportunityScore: OpportunityScoreResult | null;
  clientSources: ClientSource[];
  actionPlan: ActionPlanItem[];
}

const ACTION_PLANS: Record<DifficultyRating, string[]> = {
  'Fast Traction': [
    'Launch a landing page and begin cold outreach to your first 10 prospects this week.',
    'Leverage your low-competition advantage to dominate search and social channels.',
    'Scale by building a referral loop with your first 3 paying clients.',
  ],
  Balanced: [
    'Validate demand by running a small ad campaign or posting in 3 relevant communities.',
    'Build a portfolio of 2–3 case studies to overcome competition objections.',
    'Establish a recurring revenue model by packaging your offer as a retainer.',
  ],
  'Niche Play': [
    'Double down on a specific sub-niche where you can be the top expert.',
    'Create educational content that builds authority and drives inbound leads.',
    'Partner with complementary service providers for warm referrals.',
  ],
  'Heavy Lift': [
    'Consider revising your offer to target a higher-demand market segment.',
    'Reduce execution friction by simplifying your delivery or raising prices.',
    'Build social proof through free or discounted work for influential clients.',
  ],
};

export function generateOpportunityReport(
  state: OpportunityMapState,
): OpportunityReport {
  const track =
    state.careerTrackId !== null
      ? state.tracks.find((t) => t.id === state.careerTrackId) ?? null
      : null;

  const service = resolveSelectedService(state);
  const market = resolveSelectedMarket(state);
  const niche = resolveSelectedNiche(state);
  const offer = resolveSelectedOffer(state);

  const positioningTemplate =
    state.positioning.trim().length > 0
      ? state.positioning
      : offer?.positioningTemplate ?? '';

  let opportunityScore: OpportunityScoreResult | null = null;
  if (offer !== null) {
    try {
      opportunityScore = calculateOpportunityScore(offer.id);
    } catch {
      opportunityScore = null;
    }
  }

  const actionPlan: ActionPlanItem[] = opportunityScore
    ? ACTION_PLANS[opportunityScore.rating].map((action, i) => ({
        step: i + 1,
        action,
      }))
    : [];

  const mapToEntity = <T extends { id: string; label: string; description: string }>(
    item: T | null,
  ): ReportEntity | null =>
    item ? { id: item.id, label: item.label, description: item.description } : null;

  return {
    careerTrack: mapToEntity(track),
    service: mapToEntity(service),
    market: mapToEntity(market),
    niche: mapToEntity(niche),
    offer: offer
      ? {
          id: offer.id,
          label: offer.label,
          description: offer.description,
          priceRange: offer.priceRange,
          deliveryFormat: offer.deliveryFormat,
        }
      : null,
    positioningTemplate,
    opportunityScore,
    clientSources: offer?.clientSources ?? [],
    actionPlan,
  };
}
