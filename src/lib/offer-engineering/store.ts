import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  OfferEngineeringState,
  OfferEngineeringStep,
  StepAccess,
  ScopeLimits,
  ProposalSummary,
  OfferBlueprint,
  TieredPricing,
  ValueBasedPricing,
} from '../../types/offer-engineering';
import {
  OFFER_ENGINEERING_STEPS,
  canNavigateTo,
  getStepIndex,
} from '../../types/offer-engineering';

export { canNavigateTo, getStepIndex, OFFER_ENGINEERING_STEPS };

/* ── Validation ── */

export interface StepValidation {
  isValid: boolean;
  reason?: string;
}

export function validateStepCompletion(
  step: OfferEngineeringStep,
  state: OfferEngineeringState,
): StepValidation {
  switch (step) {
    case 'offer_type':
      return {
        isValid: state.offerType !== null,
        reason: state.offerType === null ? 'Select an offer type' : undefined,
      };
    case 'deliverables':
      return {
        isValid: state.deliverables.length > 0,
        reason:
          state.deliverables.length === 0
            ? 'Add at least one deliverable'
            : undefined,
      };
    case 'unique_mechanism':
      return {
        isValid: state.uniqueMechanism.trim().length > 0,
        reason:
          state.uniqueMechanism.trim().length === 0
            ? 'Define your unique mechanism'
            : undefined,
      };
    case 'scope_protection': {
      const sl = state.scopeLimits;
      const valid =
        sl.revisionCount > 0 &&
        sl.communicationMethod.trim().length > 0 &&
        sl.responseTime.trim().length > 0 &&
        sl.deliveryTime.trim().length > 0 &&
        sl.includedRounds > 0;
      return {
        isValid: valid,
        reason: valid ? undefined : 'Fill in all scope boundary fields',
      };
    }
    case 'value_amplifier':
      return {
        isValid: state.valueAmplifier.trim().length > 0,
        reason:
          state.valueAmplifier.trim().length === 0
            ? 'Select a value amplifier'
            : undefined,
      };
    case 'pricing': {
      const tp = state.tieredPricing;
      const vbp = state.valueBasedPricing;
      const flatValid = state.pricingModel === 'flat_rate' && state.finalPrice !== null && state.finalPrice > 0;
      const tieredValid = state.pricingModel === 'tiered' && tp.starterPrice !== null && tp.proPrice !== null && tp.premiumPrice !== null;
      const valueValid = state.pricingModel === 'value_based' && vbp.estimatedClientValue !== null && vbp.impactLevel.trim().length > 0;
      const valid = state.pricingModel !== null && (flatValid || tieredValid || valueValid);
      return {
        isValid: valid,
        reason: valid ? undefined : 'Complete pricing for the selected model',
      };
    }
    case 'proposal_summary': {
      const ps = state.proposalSummary;
      const valid =
        ps.headline.trim().length > 0 &&
        ps.problem.trim().length > 0 &&
        ps.solution.trim().length > 0 &&
        ps.timeline.trim().length > 0 &&
        ps.pricing.trim().length > 0 &&
        ps.nextSteps.trim().length > 0;
      return {
        isValid: valid,
        reason: valid ? undefined : 'Complete all proposal summary fields',
      };
    }
    case 'offer_blueprint':
      return { isValid: state.offerBlueprint !== null };
    default:
      return { isValid: false, reason: 'Unknown step' };
  }
}

/* ── Defaults ── */

function defaultScopeLimits(): ScopeLimits {
  return {
    revisionCount: 2,
    communicationMethod: '',
    responseTime: '',
    deliveryTime: '',
    includedRounds: 2,
  };
}

function defaultProposalSummary(): ProposalSummary {
  return {
    headline: '',
    problem: '',
    solution: '',
    deliverables: [],
    timeline: '',
    pricing: '',
    nextSteps: '',
  };
}

function defaultTieredPricing(): TieredPricing {
  return { starterPrice: null, proPrice: null, premiumPrice: null };
}

function defaultValueBasedPricing(): ValueBasedPricing {
  return { estimatedClientValue: null, impactLevel: '', suggestedPriceRange: '' };
}

/* ── Store ── */

export const useOfferEngineeringStore = create<OfferEngineeringState>()(
  persist(
    (set, get) => ({
      /* ── Phase 1 input ── */
      offerId: null,
      phase1OfferId: null,
      service: null,
      market: null,
      niche: null,
      positioning: '',

      /* ── Offer Engineering data ── */
      offerType: null,
      deliverables: [],
      uniqueMechanism: '',
      scopeLimits: defaultScopeLimits(),
      valueAmplifier: '',
      pricingModel: null,
      finalPrice: null,
      tieredPricing: defaultTieredPricing(),
      valueBasedPricing: defaultValueBasedPricing(),
      proposalSummary: defaultProposalSummary(),
      offerBlueprint: null,

      /* ── workflow state ── */
      currentStep: 'offer_type',
      completedSteps: [],

      /* ── actions ── */

      /* ── actions ── */

      setOfferId(id: string | null) {
        set({ offerId: id });
      },

      setPhase1OfferId(id: string | null) {
        set({ phase1OfferId: id });
      },

      setService(value: string | null) {
        set({ service: value });
      },

      setMarket(value: string | null) {
        set({ market: value });
      },

      setNiche(value: string | null) {
        set({ niche: value });
      },

      setPositioning(value: string) {
        set({ positioning: value });
      },

      setOfferType(value: OfferEngineeringState['offerType']) {
        set({ offerType: value });
      },

      addDeliverable(value: string) {
        set((s) => ({ deliverables: [...s.deliverables, value] }));
      },

      removeDeliverable(index: number) {
        set((s) => ({
          deliverables: s.deliverables.filter((_, i) => i !== index),
        }));
      },

      setUniqueMechanism(value: string) {
        set({ uniqueMechanism: value });
      },

      setScopeLimits(value: ScopeLimits) {
        set({ scopeLimits: value });
      },

      setValueAmplifier(value: string) {
        set({ valueAmplifier: value });
      },

      setPricingModel(value: OfferEngineeringState['pricingModel']) {
        set({ pricingModel: value });
      },

      setFinalPrice(value: number | null) {
        set({ finalPrice: value });
      },

      setTieredPricing(value: TieredPricing) {
        set({ tieredPricing: value });
      },

      setValueBasedPricing(value: ValueBasedPricing) {
        set({ valueBasedPricing: value });
      },

      setProposalSummary(value: ProposalSummary) {
        set({ proposalSummary: value });
      },

      setOfferBlueprint(value: OfferBlueprint) {
        set({ offerBlueprint: value });
      },

      confirmStep() {
        const state = get();
        const validation = validateStepCompletion(state.currentStep, state);

        if (!validation.isValid) {
          console.warn(
            `[OfferEngineering] Cannot confirm step "${state.currentStep}": ${validation.reason}`,
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
          console.warn(
            `[OfferEngineering] Cannot advance: ${validation.reason}`,
          );
          return;
        }

        const currentIdx = getStepIndex(state.currentStep);
        const nextIdx = Math.min(
          currentIdx + 1,
          OFFER_ENGINEERING_STEPS.length - 1,
        );
        const nextStep = OFFER_ENGINEERING_STEPS[nextIdx];
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
        const prevStep = OFFER_ENGINEERING_STEPS[prevIdx];

        const access: StepAccess =
          prevIdx === 0
            ? { unlocked: true }
            : canNavigateTo(prevStep, state.completedSteps);

        if (access.unlocked) {
          set({ currentStep: prevStep });
        }
      },

      jumpToStep(step: OfferEngineeringStep) {
        const state = get();
        const access = canNavigateTo(step, state.completedSteps);

        if (!access.unlocked) {
          console.warn(
            `[OfferEngineering] Cannot jump to "${step}": ${access.reason}`,
          );
          return;
        }

        set({ currentStep: step });
      },

      reset() {
        set({
          offerId: null,
          phase1OfferId: null,
          service: null,
          market: null,
          niche: null,
          positioning: '',
          offerType: null,
          deliverables: [],
          uniqueMechanism: '',
          scopeLimits: defaultScopeLimits(),
          valueAmplifier: '',
          pricingModel: null,
          finalPrice: null,
          tieredPricing: defaultTieredPricing(),
          valueBasedPricing: defaultValueBasedPricing(),
          proposalSummary: defaultProposalSummary(),
          offerBlueprint: null,
          currentStep: 'offer_type',
          completedSteps: [],
        });
      },
    }),
    {
      name: 'offer-engineering-progress',
      version: 1,
      migrate(persisted, version) {
        if (version === 0) {
          const old = persisted as Record<string, unknown>;
          const proposalSummary = old.proposalSummary as Record<string, unknown> | undefined;
          return {
            ...(old as Record<string, unknown>),
            offerBlueprint: old.offerBlueprint ?? null,
            completedSteps: Array.isArray(old.completedSteps) ? old.completedSteps : [],
            currentStep: typeof old.currentStep === 'string' ? old.currentStep : 'offer_type',
            scopeLimits: old.scopeLimits && typeof old.scopeLimits === 'object'
              ? { ...defaultScopeLimits(), ...(old.scopeLimits as Record<string, unknown>) }
              : defaultScopeLimits(),
            proposalSummary: proposalSummary && typeof proposalSummary === 'object'
              ? { ...defaultProposalSummary(), ...proposalSummary }
              : defaultProposalSummary(),
            tieredPricing: old.tieredPricing && typeof old.tieredPricing === 'object'
              ? { ...defaultTieredPricing(), ...(old.tieredPricing as Record<string, unknown>) }
              : defaultTieredPricing(),
            valueBasedPricing: old.valueBasedPricing && typeof old.valueBasedPricing === 'object'
              ? { ...defaultValueBasedPricing(), ...(old.valueBasedPricing as Record<string, unknown>) }
              : defaultValueBasedPricing(),
          } as OfferEngineeringState;
        }
        return persisted as OfferEngineeringState;
      },
      partialize: (state) => ({
        phase1OfferId: state.phase1OfferId,
        offerId: state.offerId,
        service: state.service,
        market: state.market,
        niche: state.niche,
        positioning: state.positioning,
        offerType: state.offerType,
        deliverables: state.deliverables,
        uniqueMechanism: state.uniqueMechanism,
        scopeLimits: state.scopeLimits,
        valueAmplifier: state.valueAmplifier,
        pricingModel: state.pricingModel,
        finalPrice: state.finalPrice,
        tieredPricing: state.tieredPricing,
        valueBasedPricing: state.valueBasedPricing,
        proposalSummary: state.proposalSummary,
        offerBlueprint: state.offerBlueprint,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    },
  ),
);
