export type ProofStrengthLevel =
  | 'credential'
  | 'project'
  | 'demonstration'
  | 'outcome'
  | 'testimonial'
  | 'case_study'
  | 'repeated_outcomes';

export type DecisionStatus = 'pending' | 'accepted' | 'adjusted';

export interface StrategicRecommendation<T> {
  id: string;
  recommendedValue: T;
  originalValue: T;
  userOverride?: T;
  status: DecisionStatus;
  reason: string;
  actionableAdvice: string;
}

export interface MessageHierarchyLayer {
  layerKey: 'who_you_are' | 'what_you_do' | 'who_you_help' | 'known_for' | 'why_credible' | 'next_step';
  layerTitle: string;
  perceptionTarget: string;
  recommendedFocus: string;
  strategicRationale: string;
  userCustomization?: string;
  status: DecisionStatus;
}

export interface PortfolioStructureSectionItem {
  id: string;
  position: number;
  sectionTitle: string;
  structuralRole: string;
  visitorMindset: string;
  conversionRationale: string;
  recommendedVisual: string;
  isEnabled: boolean;
  status: DecisionStatus;
}

export interface SectionPriorityItem {
  id: string;
  sectionName: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  whyPriority: string;
  actionRequired: string;
}

export interface EvidencePlacementMapping {
  id: string;
  claim: string;
  proofAssetId: string;
  proofTitle: string;
  proofStrength: ProofStrengthLevel;
  whyItSupportsClaim: string;
  recommendedPlacement: string;
  visibilityLevel: 'High' | 'Medium' | 'Low';
  actionIfWeak?: string;
}

export interface PresentationJourneyStep {
  stepNumber: number;
  stageName: string;
  visitorPsychology: string;
  communicationPurpose: string;
  contentToPresent: string;
  conversionRole: string;
}

export interface ReinforcementDiagnosticIssue {
  id: string;
  severity: 'warning' | 'success' | 'critical';
  title: string;
  positioningClaim: string;
  actualEvidenceOrWork: string;
  recommendation: string;
  impactedSection: string;
}

export interface NextMoveActionItem {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  impact: string;
  category: 'Profile' | 'Portfolio' | 'Proof' | 'Positioning';
  isCompleted: boolean;
}

export interface BlueprintDecisionSummary {
  positioningClaim: string;
  primaryCategory: string;
  strongestProofAnchor: string;
  primaryProfileFocus: string;
  topPortfolioPriorities: string[];
  keyEvidencePlacement: string;
  alignmentHealth: string;
}

export interface ProfilePortfolioAuthorityBlueprint {
  decisionSummary: BlueprintDecisionSummary;
  foundation: {
    authorityPosition: string;
    trustPromise: string;
    equippedProofCount: number;
    skippedProofCount: number;
    strongestProofSignal: string;
  };
  profilePositioning: MessageHierarchyLayer[];
  portfolioStructure: PortfolioStructureSectionItem[];
  sectionPriorities: SectionPriorityItem[];
  evidencePlacements: EvidencePlacementMapping[];
  presentationFlow: {
    personaContext: string;
    journey: PresentationJourneyStep[];
  };
  alignmentAudit: {
    alignmentScore: number;
    overallVerdict: string;
    diagnostics: ReinforcementDiagnosticIssue[];
  };
  nextMoves: NextMoveActionItem[];
  isLocked: boolean;
  generatedAt: string;
  lastUpdated: string;
}

// ── Step 3 Wizard Section Types ──────────────────────────────────────────────
// These types are produced by each section of the 7-section sequential wizard
// and persisted in the Zustand store. They survive page refresh.

/** Section 5 — Evidence Placement: one entry per profile field (Option A) */
export interface ClaimToAssetMapping {
  /** Unique ID derived from platform + field key, e.g. "linkedin_headline" */
  claimId: string;
  /** Full text of the profile field value (for context in UI) */
  claimText: string;
  /** Which platform this field belongs to */
  claimPlatform: string;
  /** Field key, e.g. "headline", "about" */
  claimField: string;
  /** Human-readable label, e.g. "LinkedIn: Professional Headline" */
  claimLabel: string;
  /** IDs of proof assets the user has mapped to this claim */
  assetIds: string[];
}

/** Section 6 — Content Roadmap: content pillar */
export interface ContentPillar {
  id: string;
  title: string;
  description: string;
  exampleTopics: string[];
}

/** Section 6 — Content Roadmap: a starter post idea */
export interface ContentPost {
  id: string;
  pillarId: string;
  hook: string;
  format: string;
  platform: string;
}

/** Section 6 output persisted to store */
export interface ContentRoadmapOutput {
  pillars: ContentPillar[];
  cadence: string;
  firstPosts: ContentPost[];
  generatedFrom: {
    position: string;
    niche: string;
    mechanism: string;
  };
  generatedAt: string;
}

/** Section 3 output persisted to store after user confirms brand choices */
export interface BrandIdentityOutput {
  tonePillars: string[];
  soundLike: string[];
  dontSoundLike: string[];
  visualDirection: string;
  confirmedAt: string;
  isCustomized: boolean;
  /** Which brandAsset IDs contributed to this output */
  sourceAssetIds: string[];
}
