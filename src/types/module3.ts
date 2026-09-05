import type {
  OfferType,
  PricingModel,
  ScopeLimits,
  TieredPricing,
  ValueBasedPricing,
  ProposalSummary,
} from './offer-engineering';
import type { GeneratedAuthoritySuite, PortfolioBlueprintSection } from '../data/module3/authority-suite-engine';
import type {
  ProfilePortfolioAuthorityBlueprint,
  ClaimToAssetMapping,
  ContentRoadmapOutput,
  BrandIdentityOutput,
} from './module3-step3-authority';

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

export interface ProofContext {
  availableAssets: string[];
  skippedAssets: string[];
  existingProofInventory?: string;
  proofAssets?: ProofAsset[];
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

export interface ConfidenceFactor {
  label: string;
  isMet: boolean;
  impact: string;
}

export interface BlueprintConfidence {
  level: 'Strong' | 'Moderate' | 'Limited';
  score: number;
  factors: ConfidenceFactor[];
}

export interface StrategySummary {
  primaryPlatform: string;
  primaryGoal: string;
  targetClient: string;
  portfolioStyle: string;
  contentStrategy: string;
  confidenceScore?: BlueprintConfidence;
  biggestOpportunity?: string;
}

export interface StrategyMetadata {
  sectionId: string;
  impact: 'High' | 'Medium' | 'Low';
  difficulty: 'Hard' | 'Medium' | 'Easy';
  estimatedMinutes: number;
  expectedOutcome: string;
  firstAction: string;
  recommendedAssets?: string[];
  nextStepDependencies?: string[];
}

export interface EducationalBlock {
  why: string;
  principle: string;
  commonMistake: string;
}

export interface PlatformRecommendation {
  platform: string;
  priority: number;
  purpose: string;
  action: 'focus' | 'maintain' | 'ignore' | 'explore';
  aiReasoning: string;
  expectedRoi: string;
  timeToResults: string;
  difficulty: string;
}

export interface PlatformStrategyParams {
  personalizationNote: string;
  educational: EducationalBlock;
  metadata: StrategyMetadata;
  recommendations: PlatformRecommendation[];
}

export interface ProfileStrategyParams {
  personalizationNote: string;
  educational: EducationalBlock;
  metadata: StrategyMetadata;
  username: string;
  displayName: string;
  headline: string;
  bio: string;
  bannerConcept: string;
  profileImageConcept: string;
  callToAction: string;
}

export interface PortfolioStrategyParams {
  personalizationNote: string;
  educational: EducationalBlock;
  metadata: StrategyMetadata;
  recommendedStructure: string[];
  projectOrdering: string[];
  navigation: string[];
  contentHierarchy: string;
}

export interface TrustStrategyParams {
  personalizationNote: string;
  educational: EducationalBlock;
  metadata: StrategyMetadata;
  recommendedElements: string[];
  priority: string;
}

export interface ContentStrategyParams {
  personalizationNote: string;
  educational: EducationalBlock;
  metadata: StrategyMetadata;
  contentTypes: string[];
  publishingFrequency: string;
  authorityBuildingIdeas: string[];
}

export interface BrandingStrategyParams {
  personalizationNote: string;
  educational: EducationalBlock;
  metadata: StrategyMetadata;
  visualConsistency: string;
  typography: string;
  colorUsage: string;
  toneOfVoice: string;
}

export interface OptimizationRecommendation {
  area: string;
  suggestion: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface PublishingRoadmapPhase {
  week: string;
  tasks: string[];
}

export interface ExecutionProgress {
  completedTasks: Record<string, boolean>;
  lastUpdated: number;
}

export interface ProfilePortfolioStrategy {
  version: number;
  
  strategySummary: StrategySummary;
  platformStrategy: PlatformStrategyParams;
  profileStrategy: ProfileStrategyParams;
  portfolioStrategy: PortfolioStrategyParams;
  trustStrategy: TrustStrategyParams;
  contentStrategy: ContentStrategyParams;
  brandingStrategy: BrandingStrategyParams;
  optimizationRecommendations: OptimizationRecommendation[];
  publishingRoadmap: PublishingRoadmapPhase[];

  status: 'draft' | 'approved' | 'stale';
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
  skippedAssets: string[];
  strongestAsset: string | null;
  missingAssets: string[];

  proofPriorities: ProofPriority[];

  proofAssets: ProofAsset[];

  existingProofInventory: string;
  pendingProofAssetStrategy: ProofAssetStrategy | null;
  proofAssetStrategy: ProofAssetStrategy | null;

  pendingProfilePortfolioStrategy: ProfilePortfolioStrategy | null;
  profilePortfolioStrategy: ProfilePortfolioStrategy | null;
  isGeneratingStrategy: boolean;

  executionProgress: ExecutionProgress;

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
  setSkippedAssets(assets: string[]): void;
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

  authoritySuite: GeneratedAuthoritySuite | null;
  authorityBlueprint: ProfilePortfolioAuthorityBlueprint | null;

  // ── Step 3 Wizard section outputs (persisted, derived for completion) ──────
  /** Ordered list of completed section numbers [1..7]. Derived for canGoToSection. */
  step3CompletedSections: number[];
  /** Section 3 — brand identity confirmed by user */
  step3BrandIdentity: BrandIdentityOutput | null;
  /** Section 4 — ordered portfolio section IDs after user confirms */
  step3AssetOrder: string[] | null;
  /** Section 5 — claim-to-proof-asset mappings */
  step3ClaimToAssetMap: ClaimToAssetMapping[] | null;
  /** Section 6 — deterministic content roadmap */
  step3ContentRoadmap: ContentRoadmapOutput | null;
  /** Section 7 — final assembled blueprint (also mirrored to authorityBlueprint) */
  step3Blueprint: ProfilePortfolioAuthorityBlueprint | null;
  setAuthorityBlueprint(blueprint: ProfilePortfolioAuthorityBlueprint | null): void;
  updateMessageLayer(layerKey: string, customization: string): void;
  reorderBlueprintPortfolioSection(fromIdx: number, toIdx: number): void;
  toggleBlueprintPortfolioSection(sectionId: string): void;
  acceptBlueprintRecommendation(sectionKey: string, itemId: string): void;
  toggleNextMoveItem(itemId: string): void;
  setAuthoritySuite(suite: GeneratedAuthoritySuite | null): void;
  updateBrandAsset(assetId: string, newValue: string): void;
  resetBrandAsset(assetId: string): void;
  updateProfileField(platform: string, fieldKey: string, newValue: string): void;
  resetProfileField(platform: string, fieldKey: string): void;
  updatePortfolioSection(sectionId: string, updatedFields: Partial<PortfolioBlueprintSection>): void;
  toggleOpportunityTask(taskId: string): void;

  // ── Step 3 Wizard section actions ─────────────────────────────────────────
  /** Mark section n as complete (persisted). Idempotent. */
  completeStep3Section(n: number): void;
  /** Reset a section back to incomplete (used when upstream context changes) */
  resetStep3Section(n: number): void;
  setStep3BrandIdentity(data: BrandIdentityOutput): void;
  setStep3AssetOrder(order: string[]): void;
  setStep3ClaimToAssetMap(map: ClaimToAssetMapping[]): void;
  setStep3ContentRoadmap(roadmap: ContentRoadmapOutput): void;
  /** Saves to step3Blueprint and also mirrors to authorityBlueprint for Module 4 bridge */
  setStep3Blueprint(blueprint: ProfilePortfolioAuthorityBlueprint): void;

  setPendingProfilePortfolioStrategy(value: ProfilePortfolioStrategy | null): void;
  setProfilePortfolioStrategy(value: ProfilePortfolioStrategy | null): void;
  generateProfilePortfolioStrategy(signal?: AbortSignal): Promise<void>;
  regenerateProfilePortfolioStrategy(signal?: AbortSignal): Promise<void>;
  approveProfilePortfolioStrategy(): void;
  updateProfilePortfolioStrategy(updates: Partial<ProfilePortfolioStrategy>): void;

  setTaskCompletion(week: string, taskIdx: number, completed: boolean): void;

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

  // ── Stage 1 (Profile Strategy) Studio Persistence ─────────────────────────
  stage1ActiveSection: number;
  stage1CompletedSections: number[];
  stage1Audit: Stage1AuditData | null;
  stage1Identity: Stage1IdentityData | null;
  setStage1ActiveSection(section: number): void;
  setStage1CompletedSections(sections: number[]): void;
  setStage1Audit(auditData: Partial<Stage1AuditData>): void;
  setStage1Identity(identityData: Partial<Stage1IdentityData>): void;

  // ── Stage 2 (Portfolio Architecture) Studio Persistence ───────────────────
  stage2ActiveSection: number;
  stage2CompletedSections: number[];
  stage2Archetype: Stage2ArchetypeData | null;
  stage2WireframeSettings: Stage2WireframeSettings | null;
  setStage2ActiveSection(section: number): void;
  setStage2CompletedSections(sections: number[]): void;
  setStage2Archetype(archetypeData: Partial<Stage2ArchetypeData>): void;
  setStage2WireframeSettings(settings: Partial<Stage2WireframeSettings>): void;
  reorderPortfolioSections(reordered: PortfolioBlueprintSection[]): void;
  resetPortfolioSectionsToDefault(): void;
  applyArchetypePreset(archetypeId: string): void;

  dismissStaleContext(): void;
  refreshStaleContext(): void;
}

export interface Stage2ArchetypeData {
  selectedArchetypeId: string;
  customNotes?: string;
  confirmedAt?: string;
  portfolioGoal?: 'retainer' | 'sprint' | 'consulting';
}

export interface Stage2WireframeSettings {
  viewport: 'desktop' | 'tablet' | 'mobile';
  fidelity: 'wireframe' | 'high-fidelity';
  activeSectionId: string | null;
}

export interface Stage1AuditData {
  selectedPlatforms: string[];
  auditStep: 1 | 2 | 3;
  auditMode: 'quiz' | 'paste';
  quizAnswers: {
    headlineType: string | null;
    hasPinnedProof: boolean | null;
    hasSingleCta: boolean | null;
  };
  pastedBio: string;
  isBioAnalyzed: boolean;
  diagnosticScore: number | null;
  dimensionScores?: {
    positioning: number;
    platformCoverage: number;
    proofEvidence: number;
    conversionCta: number;
  };
  completedAt?: string;
}

export interface Stage1IdentityData {
  userName: string;
  userHandle: string;
  positioningHeadline: string;
  proofLine: string;
  activeTone: 'executive' | 'conversion' | 'direct';
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
