export type ServiceCategory = 'video' | 'wordpress' | 'design';

export interface PersonalizationContextM1 {
  careerTrackId: string | null;
  serviceId: string | null;
  serviceLabel: string;
  marketId: string | null;
  marketLabel: string;
  nicheId: string | null;
  nicheLabel: string;
  positioning: string;
}

export interface PersonalizationContextM2 {
  offerType: string | null;
  offerTypeLabel: string;
  deliverables: string[];
  uniqueMechanism: string;
  scopeLimits: {
    revisionCount: number;
    deliveryTime: string;
    communicationMethod: string;
    responseTime: string;
    includedRounds: number;
  };
  valueAmplifier: string;
  pricingModel: string | null;
  finalPrice: number | null;
  proposalSummary: {
    headline: string;
    problem: string;
    solution: string;
    timeline: string;
    pricing: string;
    nextSteps: string;
  };
}

export interface PersonalizationContextM3 {
  authorityPosition: string;
  coreTrustPromise: string;
  proofPriorities: { id: string; gapTitle: string; gapDescription: string; recommendedFormat: string }[];
  proofAssets: { id: string; title: string; assetType: string; isAccepted: boolean }[];
  acceptedProofCount: number;
  profileCopy: {
    professionalHeadline: string;
    shortBio: string;
    longBio: string;
    offerStatement: string;
    credibilityBullets: string[];
    proofReferenceLine: string;
    ctaLine: string;
  };
  portfolioCopy: {
    portfolioCta: string;
    sections: { type: string; heading: string; body: string }[];
  };
}

export interface PersonalizationContext {
  m1: PersonalizationContextM1;
  m2: PersonalizationContextM2 | null;
  m3: PersonalizationContextM3 | null;
  derived: {
    audienceLabel: string;
    buyerTerm: string;
    category: ServiceCategory;
    track: string;
  };
}

export interface PersonalizedContentBase {
  examples: string[];
  helperText: string;
  emptyStateGuidance: string;
}

export interface ServiceContentProfile {
  id: string;
  label: string;
  track: 'editor' | 'developer' | 'designer';
  category: ServiceCategory;
  workNouns: string[];
  workVerbs: string[];
  executionTerms: string[];
  outputTerms: string[];
  commonInputs: string[];
  commonOutputs: string[];
  exampleSubjectPatterns: string[];
  recommendationThemes: string[];
  evidenceLanguage: string[];
  helperTextConcepts: string[];
  emptyStateActionConcepts: string[];
  avoidRules: string[];
}

export interface CanonicalMarketModifier {
  marketId: string;
  label: string;
  buyerQuestions: string[];
  concernThemes: string[];
  trustExpectations: string[];
  languageTendencies: string[];
  decisionContextThemes: string[];
  ctaIntentTendencies: string[];
  recommendationRankingInfluence: string[];
  exampleFramingInfluence: string;
}

export type MarketAliasType = 'canonical' | 'legacy_alias' | 'buyer_segment';

export interface MarketAliasEntry {
  type: MarketAliasType;
  canonicalId: string;
  label: string;
  buyerContext?: string[];
}

export type AudienceType =
  | 'creator' | 'coach' | 'business' | 'agency'
  | 'startup' | 'ecommerce' | 'educator' | 'podcaster'
  | 'personal_brand' | 'local_business' | 'course_creator';

export interface NicheSemanticMetadata {
  audienceLabel: string;
  audienceType: AudienceType;
  domainThemes: string[];
  contentContexts: string[];
  buyerContexts: string[];
  commonArtifacts: string[];
  exampleSubjects: string[];
  proofEmphasis: string[];
  actionContexts: string[];
  languageTerms: string[];
  sectionEmphasis: string[];
  avoidClaims: string[];
}

export type NicheResolutionTier = 'exact_override' | 'semantic_composition' | 'service_market_fallback';

export interface NicheResolution {
  metadata: NicheSemanticMetadata;
  tier: NicheResolutionTier;
  nicheId: string;
}
