export const CLIENT_PIPELINE_STEPS = [
  'client_source_map',
  'ideal_client_criteria',
  'prospect_type_selector',
  'search_query_builder',
  'lead_qualification_score',
  'pipeline_list_builder',
  'priority_plan',
  'client_pipeline_report',
] as const;

export type ClientPipelineStep = typeof CLIENT_PIPELINE_STEPS[number];

export interface ClientSource {
  sourceName: string;
  whereToFind: string;
  whyItWorks: string;
  searchHint: string;
  difficulty: 'easy' | 'medium' | 'hard';
  bestFor: string;
}

export interface ClientSourceMap {
  sources: ClientSource[];
}

export interface Criterion {
  label: string;
  whyItMatters: string;
  howToCheck: string;
  priority: 'high' | 'medium' | 'low';
}

export interface IdealClientCriteria {
  criteria: Criterion[];
}

export interface ProspectType {
  name: string;
  description: string;
  whyGoodFit: string;
  whereToFind: string;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'high' | 'medium' | 'low';
}

export interface ProspectTypes {
  types: ProspectType[];
}

export interface SearchQuery {
  platform: string;
  query: string;
  whatToLookFor: string;
  howToUse: string;
  expectedQuality: string;
}

export interface SearchQueryBank {
  queries: SearchQuery[];
}

export interface ScoreFactor {
  name: string;
  score: number;
  maxScore: number;
}

export interface LeadScorecard {
  factors: ScoreFactor[];
  total: number;
  interpretation: string;
}

export interface PipelineEntry {
  id: string;
  prospectName: string;
  platform: string;
  websiteUrl: string;
  nicheFit: string;
  visibleProblem: string;
  score: number;
  priority: 'high' | 'medium' | 'low';
  contactAvailable: boolean;
  notes: string;
  status: 'Found' | 'Qualified' | 'Ready for Outreach' | 'Contacted' | 'Replied' | 'Not Fit';
}

export interface PriorityEntry {
  prospectName: string;
  whyWorthContacting: string;
  angleToUse: string;
  portfolioAssetToShow: string;
  nextStep: string;
}

export interface PriorityPlan {
  entries: PriorityEntry[];
}

export interface PipelineAction {
  label: string;
  description: string;
}

export interface PipelineReport {
  clientSourceMap: ClientSourceMap;
  idealClientCriteria: IdealClientCriteria;
  prospectTypes: ProspectTypes;
  searchQueryBank: SearchQueryBank;
  leadScorecard: LeadScorecard;
  pipelineList: PipelineEntry[];
  priorityPlan: PriorityPlan;
  nextActions: string[];
}

/* ──────────────────────────────────────────────
   Client Pipeline Pack — M5 output contract
   ────────────────────────────────────────────── */

export interface ProspectProfile {
  title: string;
  description: string;
  characteristics: string[];
  evidenceOfFit: string[];
}

export interface TargetChannel {
  platform: string;
  channelType: string;
  priority: 'high' | 'medium' | 'low';
  searchInstructions: string;
  expectedSignal: string;
}

export interface BuyingSignal {
  signal: string;
  whyItMatters: string;
  howToDetect: string;
}

export interface QualificationFactor {
  id: string;
  name: string;
  weight: number;
  whyImportant: string;
  scoringGuidance: string;
}

export type PipelineStage = 'discovered' | 'reviewing' | 'qualified' | 'priority' | 'hold' | 'disqualified';

export interface PriorityRule {
  factor: string;
  weight: number;
  reason: string;
}

export interface PortfolioLeadAsset {
  available: boolean;
  id?: string;
  title?: string;
  url?: string;
  destination?: string;
  cta?: string;
}

export interface ProspectingReadiness {
  status: 'ready' | 'limited' | 'blocked';
  reasons: string[];
}

export interface Module6HandoffContext {
  portfolioHeadline?: string;
  portfolioUrl?: string;
  portfolioCta?: string;
  featuredProofTitle?: string;
  featuredProofUrl?: string;
  positioning?: string;
  offerType?: string;
  deliverables: string[];
  uniqueMechanism?: string;
  authorityPosition?: string;
}

export interface ClientPipelinePack {
  idealProspectProfile: ProspectProfile;
  targetChannels: TargetChannel[];
  buyingSignals: BuyingSignal[];
  disqualifiers: string[];
  qualificationFactors: QualificationFactor[];
  pipelineStages: PipelineStage[];
  priorityRules: PriorityRule[];
  dailyProspectingTarget: number;
  weeklyQualifiedProspectTarget: number;
  portfolioLeadAsset: PortfolioLeadAsset;
  prospectingReadiness: ProspectingReadiness;
  module6HandoffContext: Module6HandoffContext;
}

/* ──────────────────────────────────────────────
   Bridge context for M4 portfolio data
   ────────────────────────────────────────────── */

export interface Module5BridgeState {
  portfolioReady: boolean;
  portfolioDestination: string;
  portfolioUrl: string;
  featuredProofAssetId: string;
  featuredProofTitle: string;
  featuredProofUrl: string;
  portfolioCta: string;
  portfolioHeadline: string;
}

/* ──────────────────────────────────────────────
   Client Pipeline State
   ────────────────────────────────────────────── */

export interface ClientPipelineState {
  /** Schema version for migration */
  schemaVersion: number;

  /** Upstream fingerprint — deterministic hash of M4 upstream fields */
  upstreamFingerprint: string;

  /** Portfolio bridge state from Module 4 */
  bridgeState: Module5BridgeState;

  phase4Service: string | null;
  phase4ServiceLabel: string | null;
  phase4Market: string | null;
  phase4Niche: string | null;
  phase4Positioning: string;
  phase4OfferName: string;
  phase4OfferType: string | null;
  phase4Deliverables: string[];
  phase4UniqueMechanism: string;
  phase4Pricing: string;
  phase4Timeline: string;
  phase4ScopeDetails: string;
  phase4AuthorityAngle: string;
  phase4ProofAssets: { title: string; type: string }[];
  phase4PortfolioAssets: { name: string }[];
  phase4TrustBuilderChecklist: { label: string; status: string }[];
  phase4ContentAssets: { title: string }[];
  phase4AuthorityProfile: { oneLinePositioning: string; shortBio: string; trustBullets: string[]; ctaLine: string };
  phase4PortfolioGoal: { goals: string[]; statement: string };
  phase4SelectedAssets: string[];
  phase4CaseStudy: { projectTitle: string; clientNicheType: string };
  phase4SampleProject: { projectName: string; goal: string };
  phase4PortfolioCopy: { headline: string; shortIntro: string };
  phase4PortfolioReport: unknown;

  /** Composed pipeline pack — the output of the strategy composer */
  pipelinePack: ClientPipelinePack | null;

  clientSourceMap: ClientSourceMap;
  idealClientCriteria: IdealClientCriteria;
  prospectTypes: ProspectTypes;
  searchQueryBank: SearchQueryBank;
  leadScorecard: LeadScorecard;
  pipelineList: PipelineEntry[];
  priorityPlan: PriorityPlan;
  pipelineReport: PipelineReport | null;

  currentStep: ClientPipelineStep;
  completedSteps: ClientPipelineStep[];

  setPhase4Context(ctx: {
    service: string | null;
    serviceLabel: string | null;
    market: string | null;
    niche: string | null;
    positioning: string;
    offerName: string;
    offerType: string | null;
    deliverables: string[];
    uniqueMechanism: string;
    pricing: string;
    timeline: string;
    scopeDetails: string;
    authorityAngle: string;
    proofAssets: { title: string; type: string }[];
    portfolioAssets: { name: string }[];
    trustBuilderChecklist: { label: string; status: string }[];
    contentAssets: { title: string }[];
    authorityProfile: { oneLinePositioning: string; shortBio: string; trustBullets: string[]; ctaLine: string };
    portfolioGoal: { goals: string[]; statement: string };
    selectedAssets: string[];
    caseStudy: { projectTitle: string; clientNicheType: string };
    sampleProject: { projectName: string; goal: string };
    portfolioCopy: { headline: string; shortIntro: string };
    portfolioReport: unknown;
  }): void;

  /** Set the M4 portfolio bridge context */
  setBridgeState(bridge: Module5BridgeState): void;

  /** Set the composed pipeline pack */
  setPipelinePack(pack: ClientPipelinePack | null): void;

  setClientSourceMap(value: ClientSourceMap): void;
  setIdealClientCriteria(value: IdealClientCriteria): void;
  setProspectTypes(value: ProspectTypes): void;
  setSearchQueryBank(value: SearchQueryBank): void;
  setLeadScorecard(value: LeadScorecard): void;
  setPipelineList(value: PipelineEntry[]): void;
  setPriorityPlan(value: PriorityPlan): void;
  setPipelineReport(value: PipelineReport | null): void;

  confirmStep(): void;
  nextStep(): void;
  previousStep(): void;
  jumpToStep(step: ClientPipelineStep): void;
  reset(): void;
}

/** Default bridge state for when no M4 bridge data is available */
export function defaultBridgeState(): Module5BridgeState {
  return {
    portfolioReady: false,
    portfolioDestination: '',
    portfolioUrl: '',
    featuredProofAssetId: '',
    featuredProofTitle: '',
    featuredProofUrl: '',
    portfolioCta: '',
    portfolioHeadline: '',
  };
}

export interface StepAccess {
  unlocked: boolean;
  reason?: string;
}

export function getStepIndex(step: ClientPipelineStep): number {
  return CLIENT_PIPELINE_STEPS.indexOf(step);
}

export function canNavigateTo(target: ClientPipelineStep, completedSteps: ClientPipelineStep[]): StepAccess {
  if (target === 'client_source_map') return { unlocked: true };
  const targetIdx = getStepIndex(target);
  const requiredIdx = targetIdx - 1;
  if (requiredIdx < 0) return { unlocked: true };
  const requiredStep = CLIENT_PIPELINE_STEPS[requiredIdx];
  const isUnlocked = completedSteps.includes(requiredStep);
  return { unlocked: isUnlocked, reason: isUnlocked ? undefined : `Complete "${requiredStep.replace(/_/g, ' ')}" first` };
}
