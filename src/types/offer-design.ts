export const OFFER_DESIGN_STEPS = [
  'pricing_model',
  'price_point',
  'core_deliverables',
  'timeline',
  'guarantee',
  'review',
] as const;

export type OfferDesignStep = typeof OFFER_DESIGN_STEPS[number];

export interface OfferDesignState {
  pricingModel: string | null;
  pricePoint: number | null;
  coreDeliverables: string[];
  timeline: string;
  guarantee: string;
  currentStep: OfferDesignStep;
  completedSteps: OfferDesignStep[];

  setPricingModel(value: string | null): void;
  setPricePoint(value: number | null): void;
  addDeliverable(value: string): void;
  removeDeliverable(index: number): void;
  setTimeline(value: string): void;
  setGuarantee(value: string): void;
  nextStep(): void;
  previousStep(): void;
  confirmStep(): void;
  jumpToStep(step: OfferDesignStep): void;
  reset(): void;
}

export interface StepAccess {
  unlocked: boolean;
  reason?: string;
}

export function getStepIndex(step: OfferDesignStep): number {
  return OFFER_DESIGN_STEPS.indexOf(step);
}

export function canNavigateTo(
  target: OfferDesignStep,
  completedSteps: OfferDesignStep[],
): StepAccess {
  if (target === 'pricing_model') return { unlocked: true };

  const targetIdx = getStepIndex(target);
  const requiredIdx = targetIdx - 1;
  if (requiredIdx < 0) return { unlocked: true };

  const requiredStep = OFFER_DESIGN_STEPS[requiredIdx];
  const isUnlocked = completedSteps.includes(requiredStep);

  return {
    unlocked: isUnlocked,
    reason: isUnlocked
      ? undefined
      : `Complete "${requiredStep.replace(/_/g, ' ')}" first`,
  };
}
