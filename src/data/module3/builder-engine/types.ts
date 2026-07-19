/**
 * Micro-Product Engine — Type Definitions
 *
 * Every proof asset type is a BuilderConfig.
 * Adding a new asset = adding a new config. No UI changes.
 */

// ─── Interaction Models ────────────────────────────────────────────────────────
// Defines the UX pattern of the build stage.
// All other stages (scout, advisor, quality, buyer, output) are generic.
export type InteractionModel =
  | 'narrative'   // Linear storytelling blocks: Situation → Process → Outcome
  | 'sequence'    // Ordered item list with concept-level descriptions
  | 'technical';  // Structured spec: name, problem, proof, publish

export type ScoutAnswer = 'existing' | 'scratch' | 'partial';
export type SignalType = 'strong' | 'weak' | 'risky';

// ─── Context ───────────────────────────────────────────────────────────────────
// Full blueprint context passed to every engine function
export interface BuilderContext {
  // Module 1
  serviceId: string | null;
  marketId: string | null;
  nicheId: string | null;
  positioning: string;
  // Module 2
  offerType: string | null;
  deliverables: string[];
  uniqueMechanism: string;
  valueAmplifier: string;
  // Module 3 Step 1
  authorityPosition: string | null;
  coreTrustPromise: string;
  // Module 3 Step 2
  availableAssets: string[];
  strongestAsset: string | null;
  missingAssets: string[];
  // Evaluation (from credibility-rules.ts)
  scores: { craft: number; reliability: number; impact: number };
  gapRank: number;
  gapReason: string;
  gapPlatforms: string[];
  // Cross-asset awareness (prevents redundancy)
  otherAssetFormats: string[];
}

// ─── Field System ──────────────────────────────────────────────────────────────
export type FieldValues = Record<string, string>;

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface FieldDefinition {
  id: string;
  label: string;
  hint?: string;
  placeholder?: (ctx: BuilderContext) => string;
  generateDefault?: (ctx: BuilderContext, scout: ScoutAnswer) => string;
  type: 'text' | 'textarea' | 'radio';
  options?: RadioOption[];   // Only for type=radio
  optional?: boolean;
  maxLength?: number;
}

export interface StageDefinition {
  id: string;
  label: string;
  description: string;
  fields: FieldDefinition[];
}

// ─── Advisor Signals ───────────────────────────────────────────────────────────
export interface AdvisorSignal {
  fieldId: string;
  type: SignalType;
  message: string;
}

// ─── Authority Score ───────────────────────────────────────────────────────────
export type QualityDimensionName =
  | 'Specificity'
  | 'Clarity'
  | 'Credibility'
  | 'Business Relevance'
  | 'Differentiation'
  | 'Ecosystem Fit'
  | 'Buyer Confidence';

export interface QualityDimension {
  name: QualityDimensionName;
  score: number;    // 0–100
  status: 'strong' | 'moderate' | 'weak';
  message: string;  // Specific "why" and "how to improve"
}

export interface AuthorityScore {
  total: number;
  grade: 'A' | 'B' | 'C' | 'D';
  dimensions: QualityDimension[];
  verdict: string;  // Human-readable summary
  topIssue: string | null;
}

// ─── Buyer Check ───────────────────────────────────────────────────────────────
export interface BuyerQuestion {
  question: string;
  passes: boolean;
  explanation: string;
}

export interface BuyerCheck {
  buyerLabel: string;
  questions: BuyerQuestion[];
  readyToProceed: boolean;
  blockers: string[];
}

// ─── Ecosystem ─────────────────────────────────────────────────────────────────
export interface EcosystemSlot {
  assetIdx: number;
  title: string;
  role: string;        // "Proves capability" etc.
  trustDimension: 'craft' | 'reliability' | 'impact';
  isRedundant: boolean;
  redundantWith?: number;
}

export interface EcosystemMap {
  slots: EcosystemSlot[];
  isBalanced: boolean;   // True if craft/reliability/impact each covered by ≥1 asset
  redundancyWarning: string | null;
  stackNarrative: string;  // "Asset 1 answers X, Asset 2 answers Y, Asset 3 answers Z"
}

// ─── Output ────────────────────────────────────────────────────────────────────
export interface OutputBrief {
  // Human-readable (for copy)
  headline: string;
  description: string;
  proofStatement: string;
  cta: string;
  publishPlatforms: string[];
  platformTips: Record<string, string>;
  // Module 4 structured data (consumed directly by portfolio builder)
  module4: {
    headline: string;
    description: string;
    proofStatement: string;
    cta: string;
    presentationStructure: string[];
    deliverables: string[];
  };
}

// ─── Builder Config ────────────────────────────────────────────────────────────
// One config per ProofFormat. Adding a new asset type = one new config file.
export interface BuilderConfig {
  proofFormat: string;             // Matches ProofAsset.assetType
  label: string;                   // Human-readable asset type name
  interactionModel: InteractionModel;

  scoutOptions: Array<{
    id: ScoutAnswer;
    label: string;
    description: string;
  }>;

  // The build stages (after scout)
  stages: StageDefinition[];

  // Advisor rationale (top of page — "why this asset")
  generateStrategicRationale: (ctx: BuilderContext) => string;

  // Per-field advisor signals
  computeAdvisorSignals: (fields: FieldValues, ctx: BuilderContext) => AdvisorSignal[];

  // 7-dimension quality score
  computeQualityScore: (
    fields: FieldValues,
    ctx: BuilderContext,
    otherFieldSets: FieldValues[],
  ) => AuthorityScore;

  // Buyer reality check
  computeBuyerCheck: (fields: FieldValues, ctx: BuilderContext) => BuyerCheck;

  // Publish platforms (ordered by priority for this format + market)
  computePublishPlatforms: (ctx: BuilderContext) => string[];

  // Assemble final output brief
  assembleOutput: (fields: FieldValues, ctx: BuilderContext) => OutputBrief;
}
