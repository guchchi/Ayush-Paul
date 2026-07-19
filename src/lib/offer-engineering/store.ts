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
  FieldProvenanceMap,
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

function defaultFieldProvenanceMap(): FieldProvenanceMap {
  return {
    uniqueMechanism: { source: 'auto_generated', generatorVersion: 3 },
    valueAmplifier: { source: 'auto_generated', generatorVersion: 3 },
    finalPrice: { source: 'auto_generated', generatorVersion: 3 },
    deliveryTime: { source: 'auto_generated', generatorVersion: 3 },
    deliverables: { source: 'auto_generated', generatorVersion: 3 },
    offerBlueprint: { source: 'auto_generated', generatorVersion: 3 },
  };
}

/* ── Store ── */

export const useOfferEngineeringStore = create<OfferEngineeringState>()(
  persist(
    (set, get) => ({
      /* ── Per-field provenance ── */
      fieldProvenance: defaultFieldProvenanceMap(),

      /* ── Content generator version ── */
      contentGeneratorVersion: 3,

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
        set((s) => ({
          deliverables: [...s.deliverables, value],
          fieldProvenance: {
            ...s.fieldProvenance,
            deliverables: { source: 'user_selected', generatorVersion: 3 },
          },
        }));
      },

      removeDeliverable(index: number) {
        set((s) => ({
          deliverables: s.deliverables.filter((_, i) => i !== index),
          fieldProvenance: {
            ...s.fieldProvenance,
            deliverables: { source: 'user_selected', generatorVersion: 3 },
          },
        }));
      },

      setUniqueMechanism(value: string) {
        set((s) => ({
          uniqueMechanism: value,
          fieldProvenance: {
            ...s.fieldProvenance,
            uniqueMechanism: { source: 'user_selected', generatorVersion: 3 },
          },
        }));
      },

      setScopeLimits(value: ScopeLimits) {
        set((s) => ({
          scopeLimits: value,
          fieldProvenance: {
            ...s.fieldProvenance,
            deliveryTime: { source: 'user_edited', generatorVersion: 3 },
          },
        }));
      },

      setValueAmplifier(value: string) {
        set((s) => ({
          valueAmplifier: value,
          fieldProvenance: {
            ...s.fieldProvenance,
            valueAmplifier: { source: 'user_selected', generatorVersion: 3 },
          },
        }));
      },

      setPricingModel(value: OfferEngineeringState['pricingModel']) {
        set({ pricingModel: value });
      },

      setFinalPrice(value: number | null) {
        set((s) => ({
          finalPrice: value,
          fieldProvenance: {
            ...s.fieldProvenance,
            finalPrice: { source: 'user_edited', generatorVersion: 3 },
          },
        }));
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

      setOfferBlueprint(value: OfferBlueprint | null, source: 'user_selected' | 'user_edited' = 'user_selected') {
        set((s) => ({
          offerBlueprint: value,
          fieldProvenance: value
            ? { ...s.fieldProvenance, offerBlueprint: { source, generatorVersion: 3 } }
            : s.fieldProvenance,
        }));
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
          fieldProvenance: defaultFieldProvenanceMap(),
          contentGeneratorVersion: 3,
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
      version: 3,
      migrate(persisted, version) {
        // v0→v1: migrate from old format
        if (version < 2) {
          const old = persisted as Record<string, unknown>;
          const proposalSummary = old.proposalSummary as Record<string, unknown> | undefined;
          return {
            contentGeneratorVersion: 3,
            offerId: null,
            phase1OfferId: null,
            service: null,
            market: null,
            niche: null,
            positioning: '',
            offerType: (old as any).offerType ?? null,
            deliverables: Array.isArray((old as any).deliverables) ? (old as any).deliverables : [],
            uniqueMechanism: typeof (old as any).uniqueMechanism === 'string' ? (old as any).uniqueMechanism : '',
            scopeLimits: old.scopeLimits && typeof old.scopeLimits === 'object'
              ? { ...defaultScopeLimits(), ...(old.scopeLimits as Record<string, unknown>) }
              : defaultScopeLimits(),
            valueAmplifier: typeof (old as any).valueAmplifier === 'string' ? (old as any).valueAmplifier : '',
            pricingModel: (old as any).pricingModel ?? null,
            finalPrice: (old as any).finalPrice ?? null,
            tieredPricing: old.tieredPricing && typeof old.tieredPricing === 'object'
              ? { ...defaultTieredPricing(), ...(old.tieredPricing as Record<string, unknown>) }
              : defaultTieredPricing(),
            valueBasedPricing: old.valueBasedPricing && typeof old.valueBasedPricing === 'object'
              ? { ...defaultValueBasedPricing(), ...(old.valueBasedPricing as Record<string, unknown>) }
              : defaultValueBasedPricing(),
            proposalSummary: proposalSummary && typeof proposalSummary === 'object'
              ? { ...defaultProposalSummary(), ...proposalSummary }
              : defaultProposalSummary(),
            offerBlueprint: null,
            currentStep: typeof old.currentStep === 'string' ? old.currentStep : 'offer_type',
            completedSteps: Array.isArray(old.completedSteps) ? old.completedSteps : [],
            fieldProvenance: defaultFieldProvenanceMap(),
          } as OfferEngineeringState;
        }
        // v2→v3: per-field provenance with obsolete-default detection
        if (version < 3) {
          const old = persisted as any;

          const oldDeliveryTime = old.scopeLimits?.deliveryTime ?? '';
          const mechanismObsolete = old.uniqueMechanism === 'User-First Information Architecture';
          const amplifierObsolete = old.valueAmplifier === 'User Testing and Validation';
          const priceObsolete = old.finalPrice === 50;
          const deliveryObsolete = typeof oldDeliveryTime === 'string' && (
            oldDeliveryTime.includes('3-4 weeks')
            || oldDeliveryTime.includes('3\u20134 weeks')
            || oldDeliveryTime.includes('full website design')
          );

          return {
            contentGeneratorVersion: 3,
            offerId: old.offerId ?? null,
            phase1OfferId: old.phase1OfferId ?? null,
            service: null,
            market: null,
            niche: null,
            positioning: '',
            offerType: old.offerType ?? null,
            deliverables: Array.isArray(old.deliverables) ? old.deliverables : [],
            uniqueMechanism: mechanismObsolete ? '' : (typeof old.uniqueMechanism === 'string' ? old.uniqueMechanism : ''),
            scopeLimits: old.scopeLimits && typeof old.scopeLimits === 'object'
              ? { ...defaultScopeLimits(), ...old.scopeLimits, deliveryTime: deliveryObsolete ? '' : oldDeliveryTime }
              : defaultScopeLimits(),
            valueAmplifier: amplifierObsolete ? '' : (typeof old.valueAmplifier === 'string' ? old.valueAmplifier : ''),
            pricingModel: old.pricingModel ?? null,
            finalPrice: priceObsolete ? null : (typeof old.finalPrice === 'number' ? old.finalPrice : null),
            tieredPricing: old.tieredPricing && typeof old.tieredPricing === 'object'
              ? { ...defaultTieredPricing(), ...old.tieredPricing }
              : defaultTieredPricing(),
            valueBasedPricing: old.valueBasedPricing && typeof old.valueBasedPricing === 'object'
              ? { ...defaultValueBasedPricing(), ...old.valueBasedPricing }
              : defaultValueBasedPricing(),
            proposalSummary: old.proposalSummary && typeof old.proposalSummary === 'object'
              ? { ...defaultProposalSummary(), ...old.proposalSummary }
              : defaultProposalSummary(),
            offerBlueprint: null,
            currentStep: typeof old.currentStep === 'string' ? old.currentStep : 'offer_type',
            completedSteps: Array.isArray(old.completedSteps) ? old.completedSteps : [],
            fieldProvenance: {
              uniqueMechanism: {
                source: mechanismObsolete ? 'auto_generated' : 'user_selected',
                generatorVersion: 3,
              },
              valueAmplifier: {
                source: amplifierObsolete ? 'auto_generated' : 'user_selected',
                generatorVersion: 3,
              },
              finalPrice: {
                source: priceObsolete ? 'auto_generated' : 'user_edited',
                generatorVersion: 3,
              },
              deliveryTime: {
                source: deliveryObsolete ? 'auto_generated' : 'user_edited',
                generatorVersion: 3,
              },
              deliverables: { source: 'user_selected', generatorVersion: 3 },
              offerBlueprint: { source: 'auto_generated', generatorVersion: 3 },
            },
          } as OfferEngineeringState;
        }
        return persisted as OfferEngineeringState;
      },
      partialize: (state) => ({
        fieldProvenance: state.fieldProvenance,
        contentGeneratorVersion: state.contentGeneratorVersion,
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
