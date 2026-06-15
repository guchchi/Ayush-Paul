export { useOpportunityMapStore } from './store';
export {
  validateStepCompletion,
  isStepRequired,
  canNavigateTo,
  getStepIndex,
  resolveSelectedTrack,
  resolveSelectedService,
  resolveSelectedMarket,
  resolveSelectedNiche,
  resolveSelectedOffer,
  shouldAutoSave,
} from './store';
export type { StepValidation, AutoSaveEvent, AutoSaveCallback } from './store';
export {
  calculateOpportunityScore,
  getDifficultyRating,
  findOfferById,
} from './simulator-engine';
export type { OpportunityScoreResult, DifficultyRating } from './simulator-engine';
export { generateOpportunityReport } from './report-generator';
export type {
  OpportunityReport,
  ReportEntity,
  ReportOffer,
  ActionPlanItem,
} from './report-generator';
export { STEP_ORDER } from '@/src/types/opportunity-map';
export type {
  BlueprintStep,
  ClientSource,
  Offer,
  Niche,
  Market,
  Service,
  CareerTrack,
  OpportunityMapSelections,
  OpportunityMapState,
  StepAccess,
} from '@/src/types/opportunity-map';
