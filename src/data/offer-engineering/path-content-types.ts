import type { OfferType } from '../../types/offer-engineering';

export type PathContentKey = string & { __brand: 'PathContentKey' };

export interface PathContentDeliverable {
  label: string;
  description: string;
  whyItMatters: string;
}

export interface PathContentMechanism {
  name: string;
  description: string;
  bestFor: string;
}

export interface PathContentScopeDefaults {
  deliveryTime: string;
  revisions: string;
  feedbackRounds: string;
  communication: string;
  responseTime: string;
  scopeWarning: string;
}

export interface PathContentValueAmplifier {
  label: string;
  description: string;
  whyItWorks: string;
}

export interface PathContentPricingGuidance {
  suggestedModel: 'flat_rate' | 'tiered' | 'value_based';
  beginnerRange: string;
  intermediateRange: string;
  premiumRange: string;
  pricingLogic: string;
}

export interface PathContentProposalAngle {
  headline: string;
  problem: string;
  solution: string;
  nextStep: string;
}

export interface PathContentBlueprintAngle {
  whoItIsFor: string;
  problemItSolves: string;
  corePromise: string;
  whyThisWorks: string;
  nextStepCTA: string;
}

export interface OfferEngineeringPathContent {
  pathTitle: string;
  audienceInsight: string;
  offerStrategy: string;
  recommendedOfferType: OfferType;

  deliverables: PathContentDeliverable[];

  uniqueMechanisms: PathContentMechanism[];

  scopeDefaults: PathContentScopeDefaults;

  valueAmplifiers: PathContentValueAmplifier[];

  pricingGuidance: PathContentPricingGuidance;

  proposalAngle: PathContentProposalAngle;

  blueprintAngle: PathContentBlueprintAngle;
}

export type OfferEngineeringPathContentMap = Record<PathContentKey, OfferEngineeringPathContent>;
