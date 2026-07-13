export const PORTFOLIO_SYSTEM_STEPS = [
  'portfolio_direction',
  'platform_structure',
  'project_arrangement',
  'project_presentations',
  'portfolio_copy_cta',
  'portfolio_build_pack',
] as const;

export type PortfolioSystemStep = typeof PORTFOLIO_SYSTEM_STEPS[number];

export type PortfolioGoal = 'start_conversation' | 'review_offer' | 'evaluate_capability' | 'request_project';

export type PortfolioDestination = 'personal_site' | 'social_native_showcase' | 'code_and_live_demo' | 'visual_showcase' | 'document_case_study' | 'video_walkthrough';

export type SectionSource = 'base' | 'service' | 'market' | 'niche' | 'authority' | 'user';

export type ChecklistStatus = 'pending' | 'in_progress' | 'ready';

export type ChecklistSource = 'module3' | 'module4_build' | 'module4_publish' | 'user';

export type ProjectRole = 'featured' | 'secondary' | 'supporting';

export interface PortfolioDirection {
  goal: PortfolioGoal;
  targetBuyer: string;
  portfolioPromise: string;
  ctaIntent: string;
  recommendedGoalReason: string;
  isCustom: boolean;
}

export interface PlatformRecommendation {
  destination: PortfolioDestination;
  primaryRecommendation: string;
  supportingDestinations: string[];
  reason: string;
  userConfirmed: boolean;
  isUserOverride: boolean;
}

export interface PortfolioSectionSpec {
  id: string;
  sectionType: string;
  heading: string;
  purpose: string;
  buyerQuestionAnswered: string;
  included: boolean;
  order: number;
  source: SectionSource;
  isCustom: boolean;
}

export interface ProjectPlacement {
  assetId: string;
  priorityId: string;
  role: ProjectRole;
  buyerQuestionAnswered: string;
  placementReason: string;
  sectionId: string;
  ctaProximity: 'hero' | 'inline' | 'section_end' | 'footer';
  isCustom: boolean;
}

export interface EvidencePlacement {
  type: string;
  label: string;
  order: number;
  description: string;
  isCustom: boolean;
}

export interface ProjectPresentationSpec {
  assetId: string;
  projectTitle: string;
  honestContextLabel: string;
  buyerProblem: string;
  proofObjective: string;
  openingMedia: string;
  presentationSequence: string[];
  evidenceOrder: EvidencePlacement[];
  processEvidence: string[];
  decisionEvidence: string[];
  outputEvidence: string[];
  limitationsNote: string;
  proofStatement: string;
  cta: string;
  buildChecklist: string[];
  sourceAssetFingerprint: string;
  isCustom: boolean;
  isAccepted: boolean;
}

export interface SectionCopyEntry {
  heading: string;
  body: string;
}

export interface ProjectCopyEntry {
  headline: string;
  description: string;
  cta: string;
}

export interface CTAArchitecture {
  heroCta: string;
  inlineCta: string;
  sectionCta: string;
  footerCta: string;
}

export interface PortfolioCopyArchitecture {
  headline: string;
  shortIntro: string;
  sectionCopy: Record<string, SectionCopyEntry>;
  projectCopy: Record<string, ProjectCopyEntry>;
  ctaArchitecture: CTAArchitecture;
  isCustom: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  status: ChecklistStatus;
  source: ChecklistSource;
  isCustom: boolean;
}

export interface NextAction {
  id: string;
  label: string;
  source: string;
}

export interface PortfolioBuildPack {
  direction: PortfolioDirection;
  platform: PlatformRecommendation;
  sections: PortfolioSectionSpec[];
  projectPlacements: ProjectPlacement[];
  projectPresentations: ProjectPresentationSpec[];
  copy: PortfolioCopyArchitecture;
  buildChecklist: ChecklistItem[];
  publishChecklist: ChecklistItem[];
  nextActions: NextAction[];
  generatedAt: string;
}

export interface Module5BridgeContext {
  portfolioReady: boolean;
  portfolioDestination: PortfolioDestination;
  featuredProofAssetId: string;
  featuredProofTitle: string;
  featuredProofUrl?: string;
  portfolioCta: string;
  portfolioHeadline: string;
  portfolioUrl?: string;
}

export interface UpstreamContext {
  mod1CareerTrackId: string | null;
  mod1ServiceId: string | null;
  mod1MarketId: string | null;
  mod1NicheId: string | null;
  mod1OfferId: string | null;
  mod1Positioning: string;
  mod2OfferType: string | null;
  mod2Deliverables: string[];
  mod2UniqueMechanism: string;
  mod2ScopeLimits: Record<string, unknown>;
  mod2ValueAmplifier: string;
  mod2PricingModel: string | null;
  mod2ProposalSummary: Record<string, unknown>;
  mod3AuthorityPosition: string;
  mod3CoreTrustPromise: string;
  mod3ProofPriorities: { id: string; gapTitle: string; gapDescription: string; recommendedFormat: string }[];
  mod3ProofAssets: {
    id: string; priorityId: string; title: string; assetType: string;
    credibilityGapProved: string; portfolioCopy: { headline: string; description: string; proofStatement: string; cta: string };
    presentationStructure: string[]; isAccepted: boolean;
    deliverables?: string[]; completionChecklist?: string[];
  }[];
  mod3ProfileCopy: {
    professionalHeadline: string; shortBio: string; longBio: string;
    offerStatement: string; credibilityBullets: string[];
    proofReferenceLine: string; ctaLine: string;
  };
  mod3PortfolioCopy: {
    portfolioCta: string;
    sections: { type: string; heading: string; body: string; bullets?: string[] }[];
  };
}

export interface PortfolioSystemState {
  upstream: UpstreamContext | null;
  upstreamFingerprint: string;
  staleSince: number | null;
  lastGeneratedAt: number | null;
  editedFields: string[];
  version: number;

  portfolioDirection: PortfolioDirection | null;
  platformRecommendation: PlatformRecommendation | null;
  sections: PortfolioSectionSpec[];
  projectPlacements: ProjectPlacement[];
  projectPresentations: ProjectPresentationSpec[];
  portfolioCopy: PortfolioCopyArchitecture | null;
  buildPack: PortfolioBuildPack | null;
  buildChecklist: ChecklistItem[];
  publishChecklist: ChecklistItem[];

  currentStep: PortfolioSystemStep;
  completedSteps: PortfolioSystemStep[];
  isCompleted: boolean;

  setPhase3Context(ctx: UpstreamContext): void;
  setPortfolioDirection(value: PortfolioDirection): void;
  setPlatformRecommendation(value: PlatformRecommendation): void;
  setSections(value: PortfolioSectionSpec[]): void;
  updateSection(id: string, updates: Partial<PortfolioSectionSpec>): void;
  setProjectPlacements(value: ProjectPlacement[]): void;
  setProjectPresentations(value: ProjectPresentationSpec[]): void;
  updateProjectPresentation(assetId: string, updates: Partial<ProjectPresentationSpec>): void;
  setPortfolioCopy(value: PortfolioCopyArchitecture): void;
  setBuildChecklist(value: ChecklistItem[]): void;
  setPublishChecklist(value: ChecklistItem[]): void;
  setBuildPack(value: PortfolioBuildPack | null): void;
  setCurrentStep(step: PortfolioSystemStep): void;
  confirmStep(): void;
  nextStep(): void;
  previousStep(): void;
  jumpToStep(step: PortfolioSystemStep): void;
  markEdited(fieldPath: string): void;
  clearEdits(): void;
  markStale(): void;
  clearStale(): void;
  regenerate(): void;
  reset(): void;
}

export interface StepAccess {
  unlocked: boolean;
  reason?: string;
}

const STEP_INDEX_MAP: Record<PortfolioSystemStep, number> = {
  portfolio_direction: 0,
  platform_structure: 1,
  project_arrangement: 2,
  project_presentations: 3,
  portfolio_copy_cta: 4,
  portfolio_build_pack: 5,
};

export function getStepIndex(step: PortfolioSystemStep): number {
  return STEP_INDEX_MAP[step] ?? 0;
}

export function canNavigateTo(
  target: PortfolioSystemStep,
  completedSteps: PortfolioSystemStep[],
): StepAccess {
  if (target === 'portfolio_direction') return { unlocked: true };
  const targetIdx = getStepIndex(target);
  const requiredIdx = targetIdx - 1;
  if (requiredIdx < 0) return { unlocked: true };
  const requiredStep = PORTFOLIO_SYSTEM_STEPS[requiredIdx];
  const isUnlocked = completedSteps.includes(requiredStep);
  return {
    unlocked: isUnlocked,
    reason: isUnlocked ? undefined : `Complete "${requiredStep.replace(/_/g, ' ')}" first`,
  };
}
