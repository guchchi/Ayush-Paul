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
  startingMaterial: string;
  executionSteps: string[];
  deliverables: string[];
  evidenceToCapture: string[];
  presentationStructure: string;
  portfolioCopy: ProofAssetPortfolioCopy;
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
  lastUpdated: number;
  upstreamFingerprint: string;
  version: number;

  mod1Service: string | null;
  mod1Market: string | null;
  mod1Niche: string | null;
  mod1Positioning: string;

  mod2OfferType: string | null;
  mod2UniqueMechanism: string;
  mod2Deliverables: string[];
  mod2ScopeLimits: string;
  mod2Pricing: string;

  currentStep: Module3Step;
  completedSteps: Module3Step[];

  setPhase1Context(ctx: {
    service: string | null;
    market: string | null;
    niche: string | null;
    positioning: string;
  }): void;

  setPhase2Context(ctx: {
    offerType: string | null;
    uniqueMechanism: string;
    deliverables: string[];
    scopeLimits: string;
    pricing: string;
  }): void;

  setAuthorityPosition(value: AuthorityPosition): void;
  setCoreTrustPromise(value: string): void;
  setAuthorityPositionRationale(value: string): void;
  setProofPriorities(value: ProofPriority[]): void;
  setProofAssets(value: ProofAsset[]): void;
  setProfileCopy(value: ProfileCopy): void;
  setPortfolioCopy(value: PortfolioCopy): void;
  setChecklist(value: ChecklistItem[]): void;
  setIsCompleted(value: boolean): void;
  setUpstreamFingerprint(value: string): void;

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
