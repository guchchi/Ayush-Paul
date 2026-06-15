import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  BlueprintStep,
  OpportunityMapState,
  StepAccess,
} from '@/src/types/opportunity-map';
import {
  STEP_ORDER,
  canNavigateTo,
  getStepIndex,
} from '@/src/types/opportunity-map';
import { MASTER_TRACKS } from '@/src/data/opportunity-map/master-data';
import { calculateOpportunityScore } from '@/src/lib/opportunity-map/simulator-engine';

export { canNavigateTo, getStepIndex, STEP_ORDER };

/* ───────────────────────────────────────────────
 *  Workflow validation (pure functions)
 * ─────────────────────────────────────────────── */

export interface StepValidation {
  isValid: boolean;
  reason?: string;
}

export function validateStepCompletion(
  step: BlueprintStep,
  state: Pick<OpportunityMapState, keyof OpportunityMapState>,
): StepValidation {
  switch (step) {
    case 'career_track':
      return {
        isValid: state.careerTrackId !== null,
        reason: state.careerTrackId === null ? 'Select a career track' : undefined,
      };
    case 'service':
      return {
        isValid: state.serviceId !== null,
        reason: state.serviceId === null ? 'Select a service' : undefined,
      };
    case 'market':
      return {
        isValid: state.marketId !== null,
        reason: state.marketId === null ? 'Select a market' : undefined,
      };
    case 'niche':
      return {
        isValid: state.nicheId !== null,
        reason: state.nicheId === null ? 'Select a niche' : undefined,
      };
    case 'offer':
      return {
        isValid: state.offerId !== null,
        reason: state.offerId === null ? 'Select an offer' : undefined,
      };
    case 'positioning':
      return {
        isValid: state.positioning.trim().length > 0,
        reason: state.positioning.trim().length === 0
          ? 'Write a positioning statement'
          : undefined,
      };
    case 'opportunity_score':
      return {
        isValid: state.opportunityScore !== null && state.opportunityScore >= 0,
        reason: state.opportunityScore === null
          ? 'Set an opportunity score'
          : undefined,
      };
    default:
      return { isValid: false, reason: 'Unknown step' };
  }
}

export function isStepRequired(
  step: BlueprintStep,
  completed: BlueprintStep[],
): boolean {
  const idx = getStepIndex(step);
  if (idx <= 0) return true;
  return completed.includes(STEP_ORDER[idx - 1]);
}

/* ───────────────────────────────────────────────
 *  Selection resolvers
 * ─────────────────────────────────────────────── */

export function resolveSelectedTrack(state: {
  tracks: typeof MASTER_TRACKS;
  careerTrackId: string | null;
}) {
  if (!state.careerTrackId) return null;
  return state.tracks.find((t) => t.id === state.careerTrackId) ?? null;
}

export function resolveSelectedService(state: {
  tracks: typeof MASTER_TRACKS;
  careerTrackId: string | null;
  serviceId: string | null;
}) {
  if (!state.careerTrackId || !state.serviceId) return null;
  const track = state.tracks.find((t) => t.id === state.careerTrackId);
  if (!track) return null;
  return track.services.find((s) => s.id === state.serviceId) ?? null;
}

export function resolveSelectedMarket(state: {
  tracks: typeof MASTER_TRACKS;
  careerTrackId: string | null;
  serviceId: string | null;
  marketId: string | null;
}) {
  if (!state.serviceId || !state.marketId) return null;
  const service = resolveSelectedService(state);
  if (!service) return null;
  return service.markets.find((m) => m.id === state.marketId) ?? null;
}

export function resolveSelectedNiche(state: {
  tracks: typeof MASTER_TRACKS;
  careerTrackId: string | null;
  serviceId: string | null;
  marketId: string | null;
  nicheId: string | null;
}) {
  if (!state.marketId || !state.nicheId) return null;
  const market = resolveSelectedMarket(state);
  if (!market) return null;
  return market.niches.find((n) => n.id === state.nicheId) ?? null;
}

export function resolveSelectedOffer(state: {
  tracks: typeof MASTER_TRACKS;
  careerTrackId: string | null;
  serviceId: string | null;
  marketId: string | null;
  nicheId: string | null;
  offerId: string | null;
}) {
  if (!state.nicheId || !state.offerId) return null;
  const niche = resolveSelectedNiche(state);
  if (!niche) return null;
  return niche.offers.find((o) => o.id === state.offerId) ?? null;
}

/* ───────────────────────────────────────────────
 *  Auto-save triggers
 * ─────────────────────────────────────────────── */

export type AutoSaveEvent = {
  type:
    | 'step_confirmed'
    | 'positioning_updated'
    | 'score_updated'
    | 'selection_changed';
  step: BlueprintStep;
  timestamp: number;
  payload?: Record<string, unknown>;
};

export type AutoSaveCallback = (event: AutoSaveEvent) => void;

export function shouldAutoSave(
  action: AutoSaveEvent['type'],
  _step: BlueprintStep,
): boolean {
  const autoSaveActions: Set<AutoSaveEvent['type']> = new Set([
    'step_confirmed',
    'positioning_updated',
    'score_updated',
    'selection_changed',
  ]);
  return autoSaveActions.has(action);
}

/* ───────────────────────────────────────────────
 *  Zustand store
 * ─────────────────────────────────────────────── */

export const useOpportunityMapStore = create<OpportunityMapState>()(
  persist(
    (set, get) => ({
    /* ── data ── */
    tracks: MASTER_TRACKS,

    /* ── selections ── */
    careerTrackId: null,
    serviceId: null,
    marketId: null,
    marketLabel: null,
    nicheId: null,
    nicheLabel: null,
    offerId: null,
    positioning: '',
    opportunityScore: null,

    /* ── workflow state ── */
    currentStep: 'career_track',
    completedSteps: [],

    /* ── actions ── */

    setSelection(step: BlueprintStep, value: string | number | null) {
      const current = get();
      const access: StepAccess =
        step === 'career_track'
          ? { unlocked: true }
          : canNavigateTo(step, current.completedSteps);

      if (!access.unlocked) {
        console.warn(
          `[Blueprint] Blocked setSelection for "${step}": ${access.reason}`,
        );
        return;
      }

      const updates: Partial<OpportunityMapState> = {};

      switch (step) {
        case 'career_track':
          updates.careerTrackId = value as string | null;
          if (value !== current.careerTrackId) {
            updates.serviceId = null;
            updates.marketId = null;
            updates.nicheId = null;
            updates.offerId = null;
            updates.opportunityScore = null;
          }
          break;
        case 'service':
          updates.serviceId = value as string | null;
          if (value !== current.serviceId) {
            updates.marketId = null;
            updates.nicheId = null;
            updates.offerId = null;
            updates.opportunityScore = null;
          }
          break;
        case 'market':
          updates.marketId = value as string | null;
          if (value !== current.marketId) {
            updates.nicheId = null;
            updates.offerId = null;
            updates.opportunityScore = null;
          }
          break;
        case 'niche':
          updates.nicheId = value as string | null;
          if (value !== current.nicheId) {
            updates.offerId = null;
            updates.opportunityScore = null;
          }
          break;
        case 'offer': {
          const offerId = value as string | null;
          updates.offerId = offerId;
          if (offerId !== current.offerId && offerId !== null) {
            try {
              const result = calculateOpportunityScore(offerId);
              updates.opportunityScore = result.score;
            } catch {
              updates.opportunityScore = null;
            }
          }
          if (offerId === null) {
            updates.opportunityScore = null;
          }
          break;
        }
        case 'opportunity_score':
          updates.opportunityScore = value as number | null;
          break;
      }

      set(updates);
    },

    setPositioning(value: string) {
      set({ positioning: value });
    },

    confirmStep() {
      const state = get();
      const validation = validateStepCompletion(state.currentStep, state);

      if (!validation.isValid) {
        console.warn(
          `[Blueprint] Cannot confirm step "${state.currentStep}": ${validation.reason}`,
        );
        return;
      }

      const step = state.currentStep;

      set((s) => ({
        completedSteps: s.completedSteps.includes(step)
          ? s.completedSteps
          : [...s.completedSteps, step],
      }));
    },

    nextStep() {
      const state = get();
      const validation = validateStepCompletion(state.currentStep, state);

      if (!validation.isValid) {
        console.warn(`[Blueprint] Cannot advance: ${validation.reason}`);
        return;
      }

      const currentIdx = getStepIndex(state.currentStep);
      const nextIdx = Math.min(currentIdx + 1, STEP_ORDER.length - 1);
      const nextStep = STEP_ORDER[nextIdx];
      const step = state.currentStep;

      set((s) => ({
        currentStep: nextStep,
        completedSteps: s.completedSteps.includes(step)
          ? s.completedSteps
          : [...s.completedSteps, step],
      }));
    },

    previousStep() {
      const state = get();
      const currentIdx = getStepIndex(state.currentStep);
      const prevIdx = Math.max(currentIdx - 1, 0);
      const prevStep = STEP_ORDER[prevIdx];

      const access: StepAccess =
        prevIdx === 0
          ? { unlocked: true }
          : canNavigateTo(prevStep, state.completedSteps);

      if (access.unlocked) {
        set({ currentStep: prevStep });
      }
    },

    jumpToStep(step: BlueprintStep) {
      const state = get();
      const access = canNavigateTo(step, state.completedSteps);

      if (!access.unlocked) {
        console.warn(
          `[Blueprint] Cannot jump to "${step}": ${access.reason}`,
        );
        return;
      }

      set({ currentStep: step });
    },

    reset() {
      set({
        careerTrackId: null,
        serviceId: null,
        marketId: null,
        marketLabel: null,
        nicheId: null,
        nicheLabel: null,
        offerId: null,
        positioning: '',
        opportunityScore: null,
        currentStep: 'career_track',
        completedSteps: [],
      });
    },
  }),
    {
      name: 'blueprint-opportunity-map',
      partialize: (state) => ({
        careerTrackId: state.careerTrackId,
        serviceId: state.serviceId,
        marketId: state.marketId,
        marketLabel: state.marketLabel,
        nicheId: state.nicheId,
        nicheLabel: state.nicheLabel,
        offerId: state.offerId,
        positioning: state.positioning,
        opportunityScore: state.opportunityScore,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    },
  ),
);
