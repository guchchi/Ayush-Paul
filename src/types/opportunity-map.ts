export const STEP_ORDER = [
  'career_track',
  'service',
  'market',
  'niche',
  'offer',
  'positioning',
  'opportunity_score',
] as const;

export type BlueprintStep = typeof STEP_ORDER[number];

export type DifficultyLevel = 'easy' | 'moderate' | 'hard';

export type ClientChannel =
  | 'cold_outreach'
  | 'referral'
  | 'platform'
  | 'community'
  | 'content'
  | 'partnership';

export interface ClientSource {
  id: string;
  label: string;
  description: string;
  channel: ClientChannel;
  difficulty: DifficultyLevel;
}

export interface Offer {
  id: string;
  label: string;
  description: string;
  priceRange: string;
  deliveryFormat: string;
  positioningTemplate: string;
  simulatorWeights: {
    demand: number;
    competition: number;
    execution_speed: number;
  };
  clientSources: ClientSource[];
}

export interface Niche {
  id: string;
  label: string;
  description: string;
  offers: Offer[];
}

export interface Market {
  id: string;
  label: string;
  description: string;
  niches: Niche[];
}

export interface Service {
  id: string;
  label: string;
  description: string;
  markets: Market[];
}

export interface CareerTrack {
  id: string;
  label: string;
  description: string;
  services: Service[];
}

export interface OpportunityMapSelections {
  careerTrackId: string | null;
  serviceId: string | null;
  marketId: string | null;
  marketLabel: string | null;
  nicheId: string | null;
  nicheLabel: string | null;
  offerId: string | null;
  positioning: string;
  opportunityScore: number | null;
  moduleCompleted?: boolean;
}

export interface OpportunityMapState extends OpportunityMapSelections {
  tracks: CareerTrack[];
  currentStep: BlueprintStep;
  completedSteps: BlueprintStep[];

  setSelection(
    step: BlueprintStep,
    value: string | number | null,
  ): void;
  setPositioning(value: string): void;
  confirmStep(): void;
  nextStep(): void;
  previousStep(): void;
  jumpToStep(step: BlueprintStep): void;
  reset(): void;
}

export interface StepAccess {
  unlocked: boolean;
  reason?: string;
}

export function getStepIndex(step: BlueprintStep): number {
  return STEP_ORDER.indexOf(step);
}

export function canNavigateTo(
  target: BlueprintStep,
  completedSteps: BlueprintStep[],
): StepAccess {
  if (target === 'career_track') return { unlocked: true };

  const targetIdx = getStepIndex(target);
  const requiredIdx = targetIdx - 1;

  if (requiredIdx < 0) return { unlocked: true };

  const requiredStep = STEP_ORDER[requiredIdx];
  const isUnlocked = completedSteps.includes(requiredStep);

  return {
    unlocked: isUnlocked,
    reason: isUnlocked
      ? undefined
      : `Complete "${requiredStep.replace('_', ' ')}" first`,
  };
}
