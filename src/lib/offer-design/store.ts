import { create } from 'zustand';
import type {
  OfferDesignState,
  OfferDesignStep,
  StepAccess,
} from '../../types/offer-design';
import {
  OFFER_DESIGN_STEPS,
  canNavigateTo,
  getStepIndex,
} from '../../types/offer-design';

export { canNavigateTo, getStepIndex, OFFER_DESIGN_STEPS };

/* ── Validation ── */

export interface StepValidation {
  isValid: boolean;
  reason?: string;
}

export function validateStepCompletion(
  step: OfferDesignStep,
  state: OfferDesignState,
): StepValidation {
  switch (step) {
    case 'pricing_model':
      return {
        isValid: state.pricingModel !== null,
        reason:
          state.pricingModel === null ? 'Select a pricing model' : undefined,
      };
    case 'price_point':
      return {
        isValid: state.pricePoint !== null && state.pricePoint > 0,
        reason:
          state.pricePoint === null || state.pricePoint <= 0
            ? 'Set a valid price point'
            : undefined,
      };
    case 'core_deliverables':
      return {
        isValid: state.coreDeliverables.length > 0,
        reason:
          state.coreDeliverables.length === 0
            ? 'Add at least one deliverable'
            : undefined,
      };
    case 'timeline':
      return {
        isValid: state.timeline.trim().length > 0,
        reason:
          state.timeline.trim().length === 0
            ? 'Define a delivery timeline'
            : undefined,
      };
    case 'guarantee':
      return {
        isValid: state.guarantee.trim().length > 0,
        reason:
          state.guarantee.trim().length === 0
            ? 'Add a guarantee or risk reversal'
            : undefined,
      };
    case 'review':
      return { isValid: true };
    default:
      return { isValid: false, reason: 'Unknown step' };
  }
}

/* ── Store ── */

export const useOfferDesignStore = create<OfferDesignState>((set, get) => ({
  /* ── data ── */
  pricingModel: null,
  pricePoint: null,
  coreDeliverables: [],
  timeline: '',
  guarantee: '',

  /* ── workflow state ── */
  currentStep: 'pricing_model',
  completedSteps: [],

  /* ── actions ── */

  setPricingModel(value: string | null) {
    set({ pricingModel: value });
  },

  setPricePoint(value: number | null) {
    set({ pricePoint: value });
  },

  addDeliverable(value: string) {
    set((s) => ({ coreDeliverables: [...s.coreDeliverables, value] }));
  },

  removeDeliverable(index: number) {
    set((s) => ({
      coreDeliverables: s.coreDeliverables.filter((_, i) => i !== index),
    }));
  },

  setTimeline(value: string) {
    set({ timeline: value });
  },

  setGuarantee(value: string) {
    set({ guarantee: value });
  },

  confirmStep() {
    const state = get();
    const validation = validateStepCompletion(state.currentStep, state);

    if (!validation.isValid) {
      console.warn(
        `[OfferDesign] Cannot confirm step "${state.currentStep}": ${validation.reason}`,
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
      console.warn(`[OfferDesign] Cannot advance: ${validation.reason}`);
      return;
    }

    const currentIdx = getStepIndex(state.currentStep);
    const nextIdx = Math.min(currentIdx + 1, OFFER_DESIGN_STEPS.length - 1);
    const nextStep = OFFER_DESIGN_STEPS[nextIdx];
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
    const prevStep = OFFER_DESIGN_STEPS[prevIdx];

    const access: StepAccess =
      prevIdx === 0
        ? { unlocked: true }
        : canNavigateTo(prevStep, state.completedSteps);

    if (access.unlocked) {
      set({ currentStep: prevStep });
    }
  },

  jumpToStep(step: OfferDesignStep) {
    const state = get();
    const access = canNavigateTo(step, state.completedSteps);

    if (!access.unlocked) {
      console.warn(
        `[OfferDesign] Cannot jump to "${step}": ${access.reason}`,
      );
      return;
    }

    set({ currentStep: step });
  },

  reset() {
    set({
      pricingModel: null,
      pricePoint: null,
      coreDeliverables: [],
      timeline: '',
      guarantee: '',
      currentStep: 'pricing_model',
      completedSteps: [],
    });
  },
}));
