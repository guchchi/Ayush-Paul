export const AUTHORITY_SYSTEM_STEPS = [
  'authority_position',
  'proof_asset_builder',
  'portfolio_asset_plan',
  'trust_builder',
  'social_proof_strategy',
  'content_asset_generator',
  'authority_profile',
  'authority_report',
] as const;

export type AuthoritySystemStep = typeof AUTHORITY_SYSTEM_STEPS[number];

export type ProofAssetType =
  | 'sample_project'
  | 'before_after'
  | 'audit_report'
  | 'process_walkthrough'
  | 'mini_case_study'
  | 'teardown_post'
  | 'portfolio_mock_project'
  | 'result_simulation';

export interface ProofAsset {
  type: ProofAssetType;
  title: string;
  whatToCreate: string;
  whyItBuildsTrust: string;
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PortfolioAsset {
  name: string;
  format: string;
  description: string;
  whatToInclude: string;
  whereToPublish: string;
  cta: string;
}

export interface ContentAsset {
  title: string;
  hook: string;
  format: string;
  mainPoints: string;
  cta: string;
  platformSuggestion: string;
}

export interface TrustBuilderItem {
  label: string;
  reason: string;
  status: 'pending' | 'ready' | 'in_progress';
  action: string;
}

export interface SocialProofPlan {
  currentProof: string;
  missingProof: string;
  nextActions: string[];
}

export interface AuthorityProfileData {
  oneLinePositioning: string;
  shortBio: string;
  serviceDescription: string;
  trustBullets: string[];
  ctaLine: string;
}

export interface AuthorityReport {
  authorityPosition: string;
  authorityAngle: string;
  credibilityLevel: string;
  trustPromise: string;
  proofAssets: ProofAsset[];
  portfolioAssets: PortfolioAsset[];
  trustBuilderChecklist: TrustBuilderItem[];
  socialProofPlan: SocialProofPlan;
  contentAssets: ContentAsset[];
  authorityProfile: AuthorityProfileData;
  nextActions: string[];
}

export interface AuthoritySystemState {
  phase2Service: string | null;
  phase2ServiceLabel: string | null;
  phase2Market: string | null;
  phase2Niche: string | null;
  phase2Positioning: string;
  phase2OfferName: string;
  phase2OfferType: string | null;
  phase2CorePromise: string;
  phase2UniqueMechanism: string;
  phase2Deliverables: string[];
  phase2Pricing: string;
  phase2Timeline: string;
  phase2ScopeDetails: string;
  phase2ValueAmplifier: string;

  authorityAngle: string;
  credibilityLevel: string;
  trustPromise: string;
  authorityPosition: string;
  proofAssets: ProofAsset[];
  portfolioAssets: PortfolioAsset[];
  trustBuilderChecklist: TrustBuilderItem[];
  socialProofPlan: SocialProofPlan;
  contentAssets: ContentAsset[];
  authorityProfile: AuthorityProfileData;
  authorityReport: AuthorityReport | null;

  currentStep: AuthoritySystemStep;
  completedSteps: AuthoritySystemStep[];

  setPhase2Context(ctx: {
    service: string | null;
    serviceLabel: string | null;
    market: string | null;
    niche: string | null;
    positioning: string;
    offerName: string;
    offerType: string | null;
    corePromise: string;
    uniqueMechanism: string;
    deliverables: string[];
    pricing: string;
    timeline: string;
    scopeDetails: string;
    valueAmplifier: string;
  }): void;
  setAuthorityAngle(value: string): void;
  setCredibilityLevel(value: string): void;
  setTrustPromise(value: string): void;
  setAuthorityPosition(value: string): void;
  setProofAssets(value: ProofAsset[]): void;
  setPortfolioAssets(value: PortfolioAsset[]): void;
  setTrustBuilderChecklist(value: TrustBuilderItem[]): void;
  setSocialProofPlan(value: SocialProofPlan): void;
  setContentAssets(value: ContentAsset[]): void;
  setAuthorityProfile(value: AuthorityProfileData): void;
  setAuthorityReport(value: AuthorityReport): void;
  nextStep(): void;
  previousStep(): void;
  confirmStep(): void;
  jumpToStep(step: AuthoritySystemStep): void;
  reset(): void;
}

export interface StepAccess {
  unlocked: boolean;
  reason?: string;
}

export function getStepIndex(step: AuthoritySystemStep): number {
  return AUTHORITY_SYSTEM_STEPS.indexOf(step);
}

export function canNavigateTo(
  target: AuthoritySystemStep,
  completedSteps: AuthoritySystemStep[],
): StepAccess {
  if (target === 'authority_position') return { unlocked: true };
  const targetIdx = getStepIndex(target);
  const requiredIdx = targetIdx - 1;
  if (requiredIdx < 0) return { unlocked: true };
  const requiredStep = AUTHORITY_SYSTEM_STEPS[requiredIdx];
  const isUnlocked = completedSteps.includes(requiredStep);
  return {
    unlocked: isUnlocked,
    reason: isUnlocked
      ? undefined
      : `Complete "${requiredStep.replace(/_/g, ' ')}" first`,
  };
}
