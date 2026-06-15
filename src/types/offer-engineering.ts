export const OFFER_ENGINEERING_STEPS = [
  'offer_type',
  'deliverables',
  'unique_mechanism',
  'scope_protection',
  'value_amplifier',
  'pricing',
  'proposal_summary',
  'offer_blueprint',
] as const;

export type OfferEngineeringStep = typeof OFFER_ENGINEERING_STEPS[number];

export type OfferType = 'retainer' | 'one_time_project' | 'milestone_based';

export type PricingModel = 'flat_rate' | 'tiered' | 'value_based';

export interface ScopeLimits {
  revisionCount: number;
  communicationMethod: string;
  responseTime: string;
  deliveryTime: string;
  includedRounds: number;
}

export interface ProposalSummary {
  headline: string;
  problem: string;
  solution: string;
  deliverables: string[];
  timeline: string;
  pricing: string;
  nextSteps: string;
}

export interface TieredPricing {
  starterPrice: number | null;
  proPrice: number | null;
  premiumPrice: number | null;
}

export interface ValueBasedPricing {
  estimatedClientValue: number | null;
  impactLevel: string;
  suggestedPriceRange: string;
}

export interface OfferBlueprint {
  productizedService: string;
  offerName: string;
  whoItIsFor: string;
  problemItSolves: string;
  corePromise: string;
  deliverables: string[];
  uniqueMechanism: string;
  scopeLimits: ScopeLimits;
  valueAmplifier: string;
  timeline: string;
  pricingModel: PricingModel | null;
  finalPrice: number | null;
  tieredPricing: TieredPricing;
  valueBasedPricing: ValueBasedPricing;
  pricingStructure: string;
  whyThisWorks: string;
  nextStepCTA: string;
  proposalSummary: ProposalSummary;
}

export interface OfferEngineeringState {
  offerId: string | null;
  phase1OfferId: string | null;
  service: string | null;
  market: string | null;
  niche: string | null;
  positioning: string;

  offerType: OfferType | null;
  deliverables: string[];
  uniqueMechanism: string;
  scopeLimits: ScopeLimits;
  valueAmplifier: string;
  pricingModel: PricingModel | null;
  finalPrice: number | null;
  tieredPricing: TieredPricing;
  valueBasedPricing: ValueBasedPricing;
  proposalSummary: ProposalSummary;
  offerBlueprint: OfferBlueprint | null;

  currentStep: OfferEngineeringStep;
  completedSteps: OfferEngineeringStep[];

  setOfferId(id: string | null): void;
  setPhase1OfferId(id: string | null): void;
  setService(value: string | null): void;
  setMarket(value: string | null): void;
  setNiche(value: string | null): void;
  setPositioning(value: string): void;
  setOfferType(value: OfferType): void;
  addDeliverable(value: string): void;
  removeDeliverable(index: number): void;
  setUniqueMechanism(value: string): void;
  setScopeLimits(value: ScopeLimits): void;
  setValueAmplifier(value: string): void;
  setPricingModel(value: PricingModel): void;
  setFinalPrice(value: number | null): void;
  setTieredPricing(value: TieredPricing): void;
  setValueBasedPricing(value: ValueBasedPricing): void;
  setProposalSummary(value: ProposalSummary): void;
  setOfferBlueprint(value: OfferBlueprint): void;
  nextStep(): void;
  previousStep(): void;
  confirmStep(): void;
  jumpToStep(step: OfferEngineeringStep): void;
  reset(): void;
}

export interface StepAccess {
  unlocked: boolean;
  reason?: string;
}

export function getStepIndex(step: OfferEngineeringStep): number {
  return OFFER_ENGINEERING_STEPS.indexOf(step);
}

export function canNavigateTo(
  target: OfferEngineeringStep,
  completedSteps: OfferEngineeringStep[],
): StepAccess {
  if (target === 'offer_type') return { unlocked: true };

  const targetIdx = getStepIndex(target);
  const requiredIdx = targetIdx - 1;
  if (requiredIdx < 0) return { unlocked: true };

  const requiredStep = OFFER_ENGINEERING_STEPS[requiredIdx];
  const isUnlocked = completedSteps.includes(requiredStep);

  return {
    unlocked: isUnlocked,
    reason: isUnlocked
      ? undefined
      : `Complete "${requiredStep.replace(/_/g, ' ')}" first`,
  };
}
