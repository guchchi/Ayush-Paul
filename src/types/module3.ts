import type {
  OfferType,
  PricingModel,
  ScopeLimits,
  TieredPricing,
  ValueBasedPricing,
  ProposalSummary,
} from './offer-engineering';

export const MODULE3_STEPS = [
  'authority_position',
  'proof_strategy',
  'proof_asset_builder',
  'profile_portfolio',
  'authority_pack',
] as const;

export type Module3Step = typeof MODULE3_STEPS[number];

export type AuthorityPosition = 'builder' | 'auditor' | 'deconstructor' | 'practitioner';

export interface ProofPriority {
  id: string;
  gapTitle: string;
  gapDescription: string;
  recommendedFormat: string;
  isCustom: boolean;
}

export interface ProofAssetPortfolioCopy {
  headline: string;
  description: string;
  proofStatement: string;
  cta: string;
}

export interface ProofAsset {
  id: string;
  priorityId: string;
  title: string;
  assetType: string;
  credibilityGapProved: string;
  targetAudience: string;
  businessProblem: string;
  scenario: string;
  startingMaterial: string[];
  executionSteps: string[];
  deliverables: string[];
  evidenceToCapture: string[];
  processToDocument: string[];
  whatNotToClaim: string[];
  presentationStructure: string[];
  portfolioCopy: ProofAssetPortfolioCopy;
  completionChecklist: string[];
  sourcePriorityFingerprint: string;
  isCustom: boolean;
  isAccepted: boolean;
}

export interface ProfileCopy {
  professionalHeadline: string;
  shortBio: string;
  longBio: string;
  offerStatement: string;
  credibilityBullets: string[];
  proofReferenceLine: string;
  ctaLine: string;
}

export interface PortfolioSection {
  type: string;
  heading: string;
  body: string;
  bullets?: string[];
}

export interface PortfolioCopy {
  portfolioCta: string;
  sections: PortfolioSection[];
}

export interface ChecklistItem {
  id: string;
  category: 'build' | 'assemble' | 'publish';
  task: string;
  isCompleted: boolean;
}

export type Module1Context = {
  careerTrackId: string | null;
  serviceId: string | null;
  marketId: string | null;
  nicheId: string | null;
  offerId: string | null;
  positioning: string;
};

export type Module2Context = {
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
};

export interface Module3State {
  authorityPosition: AuthorityPosition | null;
  coreTrustPromise: string;
  authorityPositionRationale: string;

  proofPriorities: ProofPriority[];

  proofAssets: ProofAsset[];

  profileCopy: ProfileCopy;
  portfolioCopy: PortfolioCopy;

  checklist: ChecklistItem[];

  isCompleted: boolean;
  isUpstreamStale: boolean;
  lastUpdated: number;
  upstreamFingerprint: string;
  version: number;

  mod1CareerTrackId: string | null;
  mod1ServiceId: string | null;
  mod1MarketId: string | null;
  mod1NicheId: string | null;
  mod1OfferId: string | null;
  mod1Positioning: string;

  mod2OfferType: OfferType | null;
  mod2Deliverables: string[];
  mod2UniqueMechanism: string;
  mod2ScopeLimits: ScopeLimits;
  mod2ValueAmplifier: string;
  mod2PricingModel: PricingModel | null;
  mod2FinalPrice: number | null;
  mod2TieredPricing: TieredPricing;
  mod2ValueBasedPricing: ValueBasedPricing;
  mod2ProposalSummary: ProposalSummary;

  currentStep: Module3Step;
  completedSteps: Module3Step[];

  setPhase1Context(ctx: Module1Context): void;
  setPhase2Context(ctx: Module2Context): void;

  setAuthorityPosition(value: AuthorityPosition): void;
  setCoreTrustPromise(value: string): void;
  setAuthorityPositionRationale(value: string): void;
  setProofPriorities(value: ProofPriority[]): void;
  setProofAssets(value: ProofAsset[]): void;
  updateProofAsset(id: string, updates: Partial<ProofAsset>): void;
  replaceProofAsset(id: string, newAsset: ProofAsset): void;
  setProfileCopy(value: ProfileCopy): void;
  setPortfolioCopy(value: PortfolioCopy): void;
  setChecklist(value: ChecklistItem[]): void;
  setIsCompleted(value: boolean): void;
  setIsUpstreamStale(value: boolean): void;
  setUpstreamFingerprint(value: string): void;
  clearModule3Data(): void;

  confirmStep(): void;
  nextStep(): void;
  previousStep(): void;
  jumpToStep(step: Module3Step): void;
  reset(): void;
}

export interface StepAccess {
  unlocked: boolean;
  reason?: string;
}

export function getStepIndex(step: Module3Step): number {
  return MODULE3_STEPS.indexOf(step);
}

export function canNavigateTo(
  target: Module3Step,
  completedSteps: Module3Step[],
): StepAccess {
  if (target === 'authority_position') return { unlocked: true };
  const targetIdx = getStepIndex(target);
  const requiredIdx = targetIdx - 1;
  if (requiredIdx < 0) return { unlocked: true };
  const requiredStep = MODULE3_STEPS[requiredIdx];
  const isUnlocked = completedSteps.includes(requiredStep);
  return {
    unlocked: isUnlocked,
    reason: isUnlocked
      ? undefined
      : `Complete "${requiredStep.replace(/_/g, ' ')}" first`,
  };
}
