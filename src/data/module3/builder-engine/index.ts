/**
 * Builder Engine — Public API
 *
 * resolveBuilderConfig() maps a ProofFormat to the correct BuilderConfig.
 * Also exports BuilderContext construction from the Module3 store state.
 */

import type { BuilderConfig, BuilderContext } from './types';
import type { Module3State } from '../../../types/module3';
import { caseStudyConfig } from './configs/case-study';
import { showreelConfig } from './configs/showreel';
import { githubRepoConfig } from './configs/github-repo';

// ─── Config Registry ───────────────────────────────────────────────────────────
// To add a new asset type: import config and add it to this map.
const BUILDER_REGISTRY: Record<string, BuilderConfig> = {
  // Narrative model
  case_study:             caseStudyConfig,
  process_walkthrough:    caseStudyConfig,   // Same model, different label
  design_case_study:      caseStudyConfig,   // Phase 3: override with dedicated config
  educational_content:    caseStudyConfig,

  // Sequence model
  demo_video:             showreelConfig,
  before_after:           showreelConfig,    // Phase 3: dedicated comparison config

  // Technical model
  comparison:             githubRepoConfig,
  framework:              githubRepoConfig,  // Phase 3: framework-specific config
  data_report:            githubRepoConfig,  // Phase 3: metrics config

  // Phase 3 — these will get dedicated configs; fallback to nearest model until then
  testimonial_equivalent: caseStudyConfig,
  explainer:              showreelConfig,
};

const DEFAULT_CONFIG = caseStudyConfig;

export function resolveBuilderConfig(proofFormat: string): BuilderConfig {
  return BUILDER_REGISTRY[proofFormat] ?? DEFAULT_CONFIG;
}

// ─── Context Builder ───────────────────────────────────────────────────────────
// Constructs a BuilderContext from the current Module3 store state.
// Called once per asset render. Pure function — no side effects.
export function buildContext(
  state: Module3State,
  assetIdx: number,
): BuilderContext {
  const scores = (() => {
    // Derive from evaluation scores if available via proofPriorities
    // Default to moderate values so the advisor isn't silent on first render
    const gaps = state.proofPriorities;
    const craft =
      gaps.find((g) => g.id.includes('craft') || g.id.includes('portfolio') || g.id.includes('showreel'))
        ? 35
        : 70;
    const reliability =
      gaps.find((g) => g.id.includes('testimonial') || g.id.includes('trust') || g.id.includes('client'))
        ? 35
        : 70;
    const impact =
      gaps.find((g) => g.id.includes('impact') || g.id.includes('result') || g.id.includes('metric'))
        ? 35
        : 70;
    return { craft, reliability, impact };
  })();

  const currentPriority = state.proofPriorities[assetIdx];
  const otherAssets = state.proofAssets.filter((_, i) => i !== assetIdx);

  return {
    serviceId: state.mod1ServiceId,
    marketId: state.mod1MarketId,
    nicheId: state.mod1NicheId,
    positioning: state.mod1Positioning,
    offerType: state.mod2OfferType,
    deliverables: state.mod2Deliverables,
    uniqueMechanism: state.mod2UniqueMechanism,
    valueAmplifier: state.mod2ValueAmplifier,
    authorityPosition: state.authorityPosition,
    coreTrustPromise: state.coreTrustPromise,
    availableAssets: state.availableAssets,
    strongestAsset: state.strongestAsset,
    missingAssets: state.missingAssets,
    scores,
    gapRank: assetIdx + 1,
    gapReason: currentPriority?.gapDescription ?? '',
    gapPlatforms: [],  // Populated from proof-assets data if available
    otherAssetFormats: otherAssets.map((a) => a.assetType),
  };
}

// ─── Re-exports ────────────────────────────────────────────────────────────────
export type { BuilderConfig, BuilderContext, FieldValues, ScoutAnswer, AdvisorSignal, AuthorityScore, BuyerCheck, EcosystemMap, OutputBrief, QualityDimension } from './types';
export { computeEcosystemMap } from './engine';
