import { MASTER_TRACKS } from '@/src/data/opportunity-map/master-data';
import type { Offer } from '@/src/types/opportunity-map';

export interface OpportunityScoreResult {
  score: number;
  breakdown: {
    demand: number;
    competition: number;
    execution_speed: number;
  };
  rating: DifficultyRating;
}

export type DifficultyRating =
  | 'Fast Traction'
  | 'Balanced'
  | 'Niche Play'
  | 'Heavy Lift';

const RATING_THRESHOLDS: { min: number; max: number; label: DifficultyRating }[] = [
  { min: 70, max: 100, label: 'Fast Traction' },
  { min: 50, max: 69, label: 'Balanced' },
  { min: 30, max: 49, label: 'Niche Play' },
  { min: 0, max: 29, label: 'Heavy Lift' },
];

export function getDifficultyRating(score: number): DifficultyRating {
  const match = RATING_THRESHOLDS.find(
    (t) => score >= t.min && score <= t.max,
  );
  return match?.label ?? 'Heavy Lift';
}

export function findOfferById(offerId: string): Offer | undefined {
  for (const track of MASTER_TRACKS) {
    for (const service of track.services) {
      for (const market of service.markets) {
        for (const niche of market.niches) {
          const offer = niche.offers.find((o) => o.id === offerId);
          if (offer) return offer;
        }
      }
    }
  }
  return undefined;
}

export function calculateOpportunityScore(
  offerId: string,
): OpportunityScoreResult {
  const offer = findOfferById(offerId);

  if (!offer) {
    throw new Error(`Offer with id "${offerId}" not found in master data`);
  }

  const { demand, competition, execution_speed } = offer.simulatorWeights;

  const score =
    demand * 5 +
    execution_speed * 3 +
    (10 - competition) * 2;

  const clamped = Math.max(0, Math.min(100, score));

  return {
    score: clamped,
    breakdown: { demand, competition, execution_speed },
    rating: getDifficultyRating(clamped),
  };
}
