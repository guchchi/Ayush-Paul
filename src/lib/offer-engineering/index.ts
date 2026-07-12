export {
  useOfferEngineeringStore,
  validateStepCompletion,
  canNavigateTo,
  getStepIndex,
  OFFER_ENGINEERING_STEPS,
} from './store';
export type { StepValidation } from './store';
export type {
  OfferEngineeringState,
  OfferEngineeringStep,
  OfferType,
  PricingModel,
  StepAccess,
  ScopeLimits,
  ProposalSummary,
  OfferBlueprint,
} from '../../types/offer-engineering';
export {
  OFFER_ENGINEERING_MASTER_DATA,
  getEngineeringDataForService,
  getAllServiceIds,
  getAllValueAmplifiers,
} from '../../data/offer-engineering/master-data';
export type {
  ServiceEngineeringData,
  ServiceEngineeringMap,
  MasterDeliverable,
  MasterValueAmplifier,
} from '../../data/offer-engineering/master-data';

/* ── Path-specific content (Phase A) ── */
export {
  OFFER_ENGINEERING_PATH_CONTENT,
  getAllPathContentKeys,
  getPathContentEntry,
} from '../../data/offer-engineering/path-content';
export {
  resolveOfferEngineeringPathContent,
  buildPathContentKey,
  buildExactPathContentKey,
  validatePathContentCoverage,
} from './pathContentResolver';
export type {
  OfferEngineeringPathContent,
  PathContentKey,
  PathContentDeliverable,
  PathContentMechanism,
  PathContentScopeDefaults,
  PathContentValueAmplifier,
  PathContentPricingGuidance,
  PathContentProposalAngle,
  PathContentBlueprintAngle,
  OfferEngineeringPathContentMap,
} from '../../data/offer-engineering/path-content-types';
export type {
  ResolvePathContentParams,
  ResolvePathContentResult,
  PathContentValidationResult,
} from './pathContentResolver';
export {
  useModule2ResolvedContent,
  scopeDefaultsToScopeLimits,
} from './useModule2PathContent';
export type { Module2ResolvedContent } from './useModule2PathContent';
