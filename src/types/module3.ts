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
  'proof_asset_builder',
  'profile_portfolio',
  'authority_pack',
] as const;

export type ProofFormat =
  | 'case_study'
  | 'demo_video'
  | 'comparison'
  | 'framework'
  | 'before_after'
  | 'explainer'
  | 'testimonial_equivalent'
  | 'data_report'
  | 'process_walkthrough'
  | 'educational_content';

export type Module3Step = typeof MODULE3_STEPS[number];

export type AuthorityPosition = 'builder' | 'auditor' | 'deconstructor' | 'practitioner';

export interface AuthorityProfile {
  version: number;
  position: AuthorityPosition;
  summary: string;
  strategicExplanation: string;
  whyThisFitsYou: string;
  coreTrustPromise: string;
  reinforcementPlan: {
    startDoing: string[];
    continueDoing: string[];
    avoidDoing: string[];
  };
  clientPerspective: string;
  report: string;
}

export interface ProofPriority {
  id: string;
  gapTitle: string;
  gapDescription: string;
  recommendedFormat: ProofFormat;
  isCustom: boolean;
}


export interface ProofCategory {
  id: string;
  name: string;
  purpose: string;
  trustObjective: string;
}

export interface StrategyProofAsset {
  id: string;
  name: string;
  category: string;
  recommendationReason: string;
  trustImpact: string;
  executionPriority: string;
}

export interface ProofGapAnalysis {
  existingStrengths: string[];
  missingTrustSignals: string[];
  recommendedImprovements: string[];
}

export interface ProofCreationAction {
  category: 'start_doing' | 'continue_doing' | 'avoid' | 'next_steps';
  action: string;
  rationale: string;
  expectedTrustImpact: string;
}

export interface TrustConnection {
  proofAssetId: string;
  supportedBelief: string;
  explanation: string;
}

export interface ProofAssetStrategy {
  strategyVersion: number;
  authorityProfileVersion: number;
  trustRequirement: string;
  requiredProofCategories: ProofCategory[];
  priorityProofAssets: StrategyProofAsset[];
  proofGapAnalysis: ProofGapAnalysis;
  proofCreationPlan: ProofCreationAction[];
  trustConnection: TrustConnection[];
  selectedExecutionPriority?: string;
  confidence: 'Strong' | 'Moderate' | 'Limited';
  status: 'draft' | 'approved' | 'stale';
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
  assetType: ProofFormat;
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
  difficulty?: string;
  estimatedEffort?: string;
  expectedImpact?: string;
  dependencies?: string[];
  realWorldExample?: string;
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

export interface ReadingJourneyStep {
  sectionId: string;
  stepIndex: number;
  phase: string;
  whatClientSees: string;
  whyTheySeeIt: string;
  trustEstablished: string;
  whatComesNext: string;
}

export interface PortfolioSectionStrategy {
  sectionId: string;
  sectionName: string;
  purpose: string;
  authorityRelation: string;
  order: number;
  proofAssetIds: string[];
}

export interface EvidencePlacement {
  sectionId: string;
  proofAssetId: string;
  authorityClaim: string;
  placementReason: string;
  expectedTrustOutcome: string;
}

export interface ProfilePortfolioStrategy {
  version: number;
  
  upstreamVersions: {
    authorityProfile: number;
    proofAssetStrategy: number;
    offerBlueprint: number;
    marketContext: number;
  };
  
  presentationStrategy: {
    primaryGoal: string;
    communicationApproach: string;
    authorityEmphasis: string;
    navigationPrinciple: string;
  };
  
  sectionPriorities: {
    sectionId: string;
    priority: number;
    rationale: string;
  }[];
  
  authorityReinforcement: {
    primaryAuthoritySignal: string;
    supportingEvidenceFocus: string;
    expectedClientPerception: string;
  };
  
  readingJourney: ReadingJourneyStep[];
  portfolioStructure: PortfolioSectionStrategy[];
  evidencePlacement: EvidencePlacement[];
  
  status: 'draft' | 'approved' | 'stale';
  confidence: 'Strong' | 'Moderate' | 'Limited';
  generatedAt: string;
  approvedAt?: string;
}

export type ProvenanceSource = 'auto_generated' | 'user_selected' | 'user_edited';

export interface Provenance {
  source: ProvenanceSource;
  generatorVersion: number;
  upstreamContextHash: string;
}

export interface Module3FieldProvenance {
  coreTrustPromise: 'auto_generated' | 'user_edited';
}

export interface Module3State {
  provenance: Provenance;
  fieldProvenance: Module3FieldProvenance;
  promiseVariationIndex: number;
  staleDecision: 'keep' | 'refresh' | null;

  authorityProfile: AuthorityProfile | null;
  pendingProfile: AuthorityProfile | null;

  authorityPosition: AuthorityPosition | null;
  coreTrustPromise: string;
  authorityPositionRationale: string;

  availableAssets: string[];
  strongestAsset: string | null;
  missingAssets: string[];

  proofPriorities: ProofPriority[];

  proofAssets: ProofAsset[];

  existingProofInventory: string;
  pendingProofAssetStrategy: ProofAssetStrategy | null;
  proofAssetStrategy: ProofAssetStrategy | null;

  pendingProfilePortfolioStrategy: ProfilePortfolioStrategy | null;
  profilePortfolioStrategy: ProfilePortfolioStrategy | null;

  checklist: ChecklistItem[];

  isCompleted: boolean;
  isUpstreamStale: boolean;
  lastUpdated: number;
  upstreamFingerprint: string;
  version: number;
  contentGeneratorVersion: number;

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

  setAuthorityProfile(profile: AuthorityProfile | null): void;
  setPendingProfile(profile: AuthorityProfile | null): void;
  setAuthorityPosition(value: AuthorityPosition): void;
  setCoreTrustPromise(value: string): void;
  setAuthorityPositionRationale(value: string): void;
  setAvailableAssets(assets: string[]): void;
  setStrongestAsset(asset: string | null): void;
  setMissingAssets(assets: string[]): void;
  setProofPriorities(value: ProofPriority[]): void;
  setProofAssets(value: ProofAsset[]): void;
  updateProofAsset(id: string, updates: Partial<ProofAsset>): void;
  replaceProofAsset(id: string, newAsset: ProofAsset): void;
  
  setExistingProofInventory(value: string): void;
  setPendingProofAssetStrategy(value: ProofAssetStrategy | null): void;
  setProofAssetStrategy(value: ProofAssetStrategy | null): void;
  generateProofAssetStrategy(): void;
  selectExecutionPriority(priority: 'immediate' | 'short_term' | 'long_term'): void;
  approveProofAssetStrategy(): void;

  setPendingProfilePortfolioStrategy(value: ProfilePortfolioStrategy | null): void;
  setProfilePortfolioStrategy(value: ProfilePortfolioStrategy | null): void;
  generateProfilePortfolioStrategy(): void;
  approveProfilePortfolioStrategy(): void;
  updatePresentationStrategy(key: keyof ProfilePortfolioStrategy['presentationStrategy'], value: string): void;
  regeneratePresentationStrategyField(key: keyof ProfilePortfolioStrategy['presentationStrategy']): void;
  resetPresentationStrategyField(key: keyof ProfilePortfolioStrategy['presentationStrategy']): void;
  updateReadingJourneyStep(sectionId: string, updates: Partial<ReadingJourneyStep>): void;
  updatePortfolioStructureSection(sectionId: string, updates: Partial<PortfolioSectionStrategy>): void;

  setChecklist(value: ChecklistItem[]): void;
  updateChecklistItem(id: string, updates: Partial<ChecklistItem>): void;
  getModule4Context(): Module4BridgeContext;
  setIsCompleted(value: boolean): void;
  setIsUpstreamStale(value: boolean): void;
  setUpstreamFingerprint(value: string): void;
  clearModule3Data(): void;

  confirmStep(): void;
  nextStep(): void;
  previousStep(): void;
  jumpToStep(step: Module3Step): void;
  reset(): void;

  dismissStaleContext(): void;
  refreshStaleContext(): void;
}

export interface Module4BridgeContext {
  mod1CareerTrackId: string | null;
  mod1ServiceId: string | null;
  mod1MarketId: string | null;
  mod1NicheId: string | null;
  mod1OfferId: string | null;
  mod1Positioning: string;
  mod2OfferType: string | null;
  mod2Deliverables: string[];
  mod2UniqueMechanism: string;
  mod2ScopeLimits: Record<string, any>;
  mod2ValueAmplifier: string;
  mod2PricingModel: string | null;
  mod2ProposalSummary: Record<string, any>;
  mod3AuthorityPosition: string;
  mod3CoreTrustPromise: string;
  mod3ProofPriorities: { id: string; gapTitle: string; gapDescription: string; recommendedFormat: string }[];
  mod3ProofAssets: {
    id: string;
    priorityId: string;
    title: string;
    assetType: string;
    credibilityGapProved: string;
    portfolioCopy: { headline: string; description: string; proofStatement: string; cta: string };
    presentationStructure: string[];
    isAccepted: boolean;
    deliverables?: string[];
    completionChecklist?: string[];
  }[];
  mod3ProfileCopy: {
    professionalHeadline: string;
    shortBio: string;
    longBio: string;
    offerStatement: string;
    credibilityBullets: string[];
    proofReferenceLine: string;
    ctaLine: string;
  };
  mod3PortfolioCopy: {
    portfolioCta: string;
    sections: { type: string; heading: string; body: string; bullets?: string[] }[];
  };
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
