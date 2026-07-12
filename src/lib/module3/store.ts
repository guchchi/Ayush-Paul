import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Module3State,
  Module3Step,
  StepAccess,
  AuthorityPosition,
  ProofPriority,
  ProofAsset,
  ProfileCopy,
  PortfolioCopy,
  ChecklistItem,
} from '../../types/module3';
import {
  MODULE3_STEPS,
  canNavigateTo,
  getStepIndex,
} from '../../types/module3';

export { canNavigateTo, getStepIndex, MODULE3_STEPS };

function defaultProfileCopy(): ProfileCopy {
  return {
    professionalHeadline: '',
    shortBio: '',
    longBio: '',
    offerStatement: '',
    credibilityBullets: [],
    proofReferenceLine: '',
    ctaLine: '',
  };
}

function defaultPortfolioCopy(): PortfolioCopy {
  return {
    portfolioCta: '',
    sections: [],
  };
}

function computeFingerprint(
  mod1Service: string | null,
  mod1Market: string | null,
  mod2OfferType: string | null,
  mod2UniqueMechanism: string,
): string {
  return [mod1Service ?? '', mod1Market ?? '', mod2OfferType ?? '', mod2UniqueMechanism].join('|');
}

export const useModule3Store = create<Module3State>()(
  persist(
    (set, get) => ({
      authorityPosition: null,
      coreTrustPromise: '',
      authorityPositionRationale: '',

      proofPriorities: [],

      proofAssets: [],

      profileCopy: defaultProfileCopy(),
      portfolioCopy: defaultPortfolioCopy(),

      checklist: [],

      isCompleted: false,
      lastUpdated: Date.now(),
      upstreamFingerprint: '',
      version: 1,

      mod1Service: null,
      mod1Market: null,
      mod1Niche: null,
      mod1Positioning: '',

      mod2OfferType: null,
      mod2UniqueMechanism: '',
      mod2Deliverables: [],
      mod2ScopeLimits: '',
      mod2Pricing: '',

      currentStep: 'authority_position',
      completedSteps: [],

      setPhase1Context(ctx) {
        const fingerprint = computeFingerprint(
          ctx.service,
          ctx.market,
          get().mod2OfferType,
          get().mod2UniqueMechanism,
        );
        set({
          mod1Service: ctx.service,
          mod1Market: ctx.market,
          mod1Niche: ctx.niche,
          mod1Positioning: ctx.positioning,
          upstreamFingerprint: fingerprint,
          lastUpdated: Date.now(),
        });
      },

      setPhase2Context(ctx) {
        const fingerprint = computeFingerprint(
          get().mod1Service,
          get().mod1Market,
          ctx.offerType,
          ctx.uniqueMechanism,
        );
        set({
          mod2OfferType: ctx.offerType,
          mod2UniqueMechanism: ctx.uniqueMechanism,
          mod2Deliverables: ctx.deliverables,
          mod2ScopeLimits: ctx.scopeLimits,
          mod2Pricing: ctx.pricing,
          upstreamFingerprint: fingerprint,
          lastUpdated: Date.now(),
        });
      },

      setAuthorityPosition(value: AuthorityPosition) {
        set({ authorityPosition: value, lastUpdated: Date.now() });
      },

      setCoreTrustPromise(value: string) {
        set({ coreTrustPromise: value, lastUpdated: Date.now() });
      },

      setAuthorityPositionRationale(value: string) {
        set({ authorityPositionRationale: value, lastUpdated: Date.now() });
      },

      setProofPriorities(value: ProofPriority[]) {
        set({ proofPriorities: value, lastUpdated: Date.now() });
      },

      setProofAssets(value: ProofAsset[]) {
        set({ proofAssets: value, lastUpdated: Date.now() });
      },

      setProfileCopy(value: ProfileCopy) {
        set({ profileCopy: value, lastUpdated: Date.now() });
      },

      setPortfolioCopy(value: PortfolioCopy) {
        set({ portfolioCopy: value, lastUpdated: Date.now() });
      },

      setChecklist(value: ChecklistItem[]) {
        set({ checklist: value, lastUpdated: Date.now() });
      },

      setIsCompleted(value: boolean) {
        set({ isCompleted: value, lastUpdated: Date.now() });
      },

      setUpstreamFingerprint(value: string) {
        set({ upstreamFingerprint: value, lastUpdated: Date.now() });
      },

      confirmStep() {
        const state = get();
        const step = state.currentStep;
        set((s) => ({
          completedSteps: s.completedSteps.includes(step)
            ? s.completedSteps
            : [...s.completedSteps, step],
          lastUpdated: Date.now(),
        }));
      },

      nextStep() {
        const state = get();
        const currentIdx = getStepIndex(state.currentStep);
        const nextIdx = Math.min(currentIdx + 1, MODULE3_STEPS.length - 1);
        const nextStep = MODULE3_STEPS[nextIdx];
        const step = state.currentStep;
        set((s) => ({
          currentStep: nextStep,
          completedSteps: s.completedSteps.includes(step)
            ? s.completedSteps
            : [...s.completedSteps, step],
          lastUpdated: Date.now(),
        }));
      },

      previousStep() {
        const state = get();
        const currentIdx = getStepIndex(state.currentStep);
        const prevIdx = Math.max(currentIdx - 1, 0);
        const prevStep = MODULE3_STEPS[prevIdx];
        const access: StepAccess =
          prevIdx === 0
            ? { unlocked: true }
            : canNavigateTo(prevStep, state.completedSteps);
        if (access.unlocked) {
          set({ currentStep: prevStep, lastUpdated: Date.now() });
        }
      },

      jumpToStep(step: Module3Step) {
        const state = get();
        const access = canNavigateTo(step, state.completedSteps);
        if (!access.unlocked) {
          console.warn(`[Module3] Cannot jump to "${step}": ${access.reason}`);
          return;
        }
        set({ currentStep: step, lastUpdated: Date.now() });
      },

      reset() {
        set({
          authorityPosition: null,
          coreTrustPromise: '',
          authorityPositionRationale: '',
          proofPriorities: [],
          proofAssets: [],
          profileCopy: defaultProfileCopy(),
          portfolioCopy: defaultPortfolioCopy(),
          checklist: [],
          isCompleted: false,
          lastUpdated: Date.now(),
          upstreamFingerprint: '',
          version: 1,
          mod1Service: null,
          mod1Market: null,
          mod1Niche: null,
          mod1Positioning: '',
          mod2OfferType: null,
          mod2UniqueMechanism: '',
          mod2Deliverables: [],
          mod2ScopeLimits: '',
          mod2Pricing: '',
          currentStep: 'authority_position',
          completedSteps: [],
        });
      },
    }),
    {
      name: 'module-3-progress',
      version: 1,
      partialize: (state) => ({
        authorityPosition: state.authorityPosition,
        coreTrustPromise: state.coreTrustPromise,
        authorityPositionRationale: state.authorityPositionRationale,
        proofPriorities: state.proofPriorities,
        proofAssets: state.proofAssets,
        profileCopy: state.profileCopy,
        portfolioCopy: state.portfolioCopy,
        checklist: state.checklist,
        isCompleted: state.isCompleted,
        lastUpdated: state.lastUpdated,
        upstreamFingerprint: state.upstreamFingerprint,
        version: state.version,
        mod1Service: state.mod1Service,
        mod1Market: state.mod1Market,
        mod1Niche: state.mod1Niche,
        mod1Positioning: state.mod1Positioning,
        mod2OfferType: state.mod2OfferType,
        mod2UniqueMechanism: state.mod2UniqueMechanism,
        mod2Deliverables: state.mod2Deliverables,
        mod2ScopeLimits: state.mod2ScopeLimits,
        mod2Pricing: state.mod2Pricing,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    },
  ),
);
