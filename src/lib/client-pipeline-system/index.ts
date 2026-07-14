// Store
export { useClientPipelineStore, CLIENT_PIPELINE_STEPS } from './store';

// Context adapter
export { normalizeModule5Context, computeUpstreamFingerprint, resolveServiceCategory } from './context';
export type { Module5StrategyContext, ServiceCategory } from './context';

// Profiles
export { resolveServiceProfile } from './profiles';
export type { ServiceAcquisitionProfile } from './profiles';

// Modifiers
export { applyModifiers } from './modifiers';
export type { PipelineStrategyAccumulator } from './modifiers';

// Composer
export { composeClientPipelinePack } from './composer';

// Types (M5 foundation)
export type {
  ClientPipelineState, ClientPipelineStep, ClientSource, Criterion, ProspectType,
  SearchQuery, ScoreFactor, PipelineEntry, PriorityEntry, ClientSourceMap,
  IdealClientCriteria, ProspectTypes, SearchQueryBank, LeadScorecard, PriorityPlan, PipelineReport,
  ClientPipelinePack, Module5BridgeState, Module6HandoffContext,
  ProspectProfile, TargetChannel, BuyingSignal, QualificationFactor,
  PortfolioLeadAsset, ProspectingReadiness, PipelineStage, PriorityRule,
} from '../../types/client-pipeline-system';
