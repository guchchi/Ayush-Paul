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
  Module1Context,
  Module2Context,
} from '../../types/module3';
import type {
  ScopeLimits,
  TieredPricing,
  ValueBasedPricing,
  ProposalSummary,
} from '../../types/offer-engineering';
import {
  MODULE3_STEPS,
  canNavigateTo,
  getStepIndex,
} from '../../types/module3';

export { canNavigateTo, getStepIndex, MODULE3_STEPS };

function defaultScopeLimits(): ScopeLimits {
  return {
    revisionCount: 2,
    communicationMethod: '',
    responseTime: '',
    deliveryTime: '',
    includedRounds: 2,
  };
}

function defaultTieredPricing(): TieredPricing {
  return { starterPrice: null, proPrice: null, premiumPrice: null };
}

function defaultvalueBasedPricing(): ValueBasedPricing {
  return { estimatedClientValue: null, impactLevel: '', suggestedPriceRange: '' };
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

export function buildFingerprint(
  mod1: Module1Context,
  mod2: Module2Context,
): string {
  const payload = {
    m1ct: mod1.careerTrackId,
    m1s: mod1.serviceId,
    m1m: mod1.marketId,
    m1n: mod1.nicheId,
    m1o: mod1.offerId,
    m1p: mod1.positioning,
    m2ot: mod2.offerType,
    m2d: mod2.deliverables,
    m2um: mod2.uniqueMechanism,
    m2sl: mod2.scopeLimits,
    m2va: mod2.valueAmplifier,
    m2pm: mod2.pricingModel,
    m2fp: mod2.finalPrice,
    m2tp: mod2.tieredPricing,
    m2vp: mod2.valueBasedPricing,
    m2ps: mod2.proposalSummary,
  };
  return JSON.stringify(payload);
}

const INITIAL_CONTEXT: Pick<Module3State,
  | 'mod1CareerTrackId' | 'mod1ServiceId' | 'mod1MarketId' | 'mod1NicheId' | 'mod1OfferId' | 'mod1Positioning'
  | 'mod2OfferType' | 'mod2Deliverables' | 'mod2UniqueMechanism' | 'mod2ScopeLimits'
  | 'mod2ValueAmplifier' | 'mod2PricingModel' | 'mod2FinalPrice' | 'mod2TieredPricing'
  | 'mod2ValueBasedPricing' | 'mod2ProposalSummary'> = {
  mod1CareerTrackId: null,
  mod1ServiceId: null,
  mod1MarketId: null,
  mod1NicheId: null,
  mod1OfferId: null,
  mod1Positioning: '',
  mod2OfferType: null,
  mod2Deliverables: [],
  mod2UniqueMechanism: '',
  mod2ScopeLimits: defaultScopeLimits(),
  mod2ValueAmplifier: '',
  mod2PricingModel: null,
  mod2FinalPrice: null,
  mod2TieredPricing: defaultTieredPricing(),
  mod2ValueBasedPricing: defaultvalueBasedPricing(),
  mod2ProposalSummary: defaultProposalSummary(),
};

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
      isUpstreamStale: false,
      lastUpdated: Date.now(),
      upstreamFingerprint: '',
      version: 2,

      ...INITIAL_CONTEXT,

      currentStep: 'authority_position',
      completedSteps: [],

      setPhase1Context(ctx: Module1Context) {
        set({
          mod1CareerTrackId: ctx.careerTrackId,
          mod1ServiceId: ctx.serviceId,
          mod1MarketId: ctx.marketId,
          mod1NicheId: ctx.nicheId,
          mod1OfferId: ctx.offerId,
          mod1Positioning: ctx.positioning,
          lastUpdated: Date.now(),
        });
      },

      setPhase2Context(ctx: Module2Context) {
        set({
          mod2OfferType: ctx.offerType,
          mod2Deliverables: ctx.deliverables,
          mod2UniqueMechanism: ctx.uniqueMechanism,
          mod2ScopeLimits: ctx.scopeLimits,
          mod2ValueAmplifier: ctx.valueAmplifier,
          mod2PricingModel: ctx.pricingModel,
          mod2FinalPrice: ctx.finalPrice,
          mod2TieredPricing: ctx.tieredPricing,
          mod2ValueBasedPricing: ctx.valueBasedPricing,
          mod2ProposalSummary: ctx.proposalSummary,
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

      updateProofAsset(id: string, updates: Partial<ProofAsset>) {
        set((state) => ({
          proofAssets: state.proofAssets.map((asset) => 
            asset.id === id ? { ...asset, ...updates, isCustom: true } : asset
          ),
          lastUpdated: Date.now()
        }));
      },

      replaceProofAsset(id: string, newAsset: ProofAsset) {
        set((state) => ({
          proofAssets: state.proofAssets.map((asset) => 
            asset.id === id ? newAsset : asset
          ),
          lastUpdated: Date.now()
        }));
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

      setIsUpstreamStale(value: boolean) {
        set({ isUpstreamStale: value, lastUpdated: Date.now() });
      },

      setUpstreamFingerprint(value: string) {
        set({ upstreamFingerprint: value, lastUpdated: Date.now() });
      },

      clearModule3Data() {
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
          isUpstreamStale: false,
          upstreamFingerprint: '',
          currentStep: 'authority_position',
          completedSteps: [],
          lastUpdated: Date.now(),
        });
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
          isUpstreamStale: false,
          lastUpdated: Date.now(),
          upstreamFingerprint: '',
          version: 2,
          ...INITIAL_CONTEXT,
          currentStep: 'authority_position',
          completedSteps: [],
        });
      },
    }),
    {
      name: 'module-3-progress',
      version: 2,
      migrate(persisted, version) {
        if (version === 0 || version === 1) {
          return {
            authorityPosition: null,
            coreTrustPromise: '',
            authorityPositionRationale: '',
            proofPriorities: [],
            proofAssets: [],
            profileCopy: defaultProfileCopy(),
            portfolioCopy: defaultPortfolioCopy(),
            checklist: [],
            isCompleted: false,
            isUpstreamStale: false,
            lastUpdated: Date.now(),
            upstreamFingerprint: '',
            version: 2,
            ...INITIAL_CONTEXT,
            currentStep: 'authority_position',
            completedSteps: [],
          } as Module3State;
        }
        return persisted as Module3State;
      },
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
        isUpstreamStale: state.isUpstreamStale,
        lastUpdated: state.lastUpdated,
        upstreamFingerprint: state.upstreamFingerprint,
        version: state.version,
        mod1CareerTrackId: state.mod1CareerTrackId,
        mod1ServiceId: state.mod1ServiceId,
        mod1MarketId: state.mod1MarketId,
        mod1NicheId: state.mod1NicheId,
        mod1OfferId: state.mod1OfferId,
        mod1Positioning: state.mod1Positioning,
        mod2OfferType: state.mod2OfferType,
        mod2Deliverables: state.mod2Deliverables,
        mod2UniqueMechanism: state.mod2UniqueMechanism,
        mod2ScopeLimits: state.mod2ScopeLimits,
        mod2ValueAmplifier: state.mod2ValueAmplifier,
        mod2PricingModel: state.mod2PricingModel,
        mod2FinalPrice: state.mod2FinalPrice,
        mod2TieredPricing: state.mod2TieredPricing,
        mod2ValueBasedPricing: state.mod2ValueBasedPricing,
        mod2ProposalSummary: state.mod2ProposalSummary,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    },
  ),
);
