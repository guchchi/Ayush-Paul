import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AuthoritySystemState,
  AuthoritySystemStep,
  StepAccess,
  ProofAsset,
  PortfolioAsset,
  ContentAsset,
  TrustBuilderItem,
  SocialProofPlan,
  AuthorityProfileData,
  AuthorityReport,
} from '../../types/authority-system';
import {
  AUTHORITY_SYSTEM_STEPS,
  canNavigateTo,
  getStepIndex,
} from '../../types/authority-system';

export { canNavigateTo, getStepIndex, AUTHORITY_SYSTEM_STEPS };

function defaultSocialProofPlan(): SocialProofPlan {
  return { currentProof: '', missingProof: '', nextActions: [] };
}

function defaultAuthorityProfile(): AuthorityProfileData {
  return {
    oneLinePositioning: '',
    shortBio: '',
    serviceDescription: '',
    trustBullets: [],
    ctaLine: '',
  };
}

export const useAuthoritySystemStore = create<AuthoritySystemState>()(
  persist(
    (set, get) => ({
      phase2Service: null,
      phase2ServiceLabel: null,
      phase2Market: null,
      phase2Niche: null,
      phase2Positioning: '',
      phase2OfferName: '',
      phase2OfferType: null,
      phase2CorePromise: '',
      phase2UniqueMechanism: '',
      phase2Deliverables: [],
      phase2Pricing: '',
      phase2Timeline: '',
      phase2ScopeDetails: '',
      phase2ValueAmplifier: '',

      authorityAngle: '',
      credibilityLevel: '',
      trustPromise: '',
      authorityPosition: '',
      proofAssets: [],
      portfolioAssets: [],
      trustBuilderChecklist: [],
      socialProofPlan: defaultSocialProofPlan(),
      contentAssets: [],
      authorityProfile: defaultAuthorityProfile(),
      authorityReport: null,

      currentStep: 'authority_position',
      completedSteps: [],

      setPhase2Context(ctx) {
        set({
          phase2Service: ctx.service,
          phase2ServiceLabel: ctx.serviceLabel,
          phase2Market: ctx.market,
          phase2Niche: ctx.niche,
          phase2Positioning: ctx.positioning,
          phase2OfferName: ctx.offerName,
          phase2OfferType: ctx.offerType,
          phase2CorePromise: ctx.corePromise,
          phase2UniqueMechanism: ctx.uniqueMechanism,
          phase2Deliverables: ctx.deliverables,
          phase2Pricing: ctx.pricing,
          phase2Timeline: ctx.timeline,
          phase2ScopeDetails: ctx.scopeDetails,
          phase2ValueAmplifier: ctx.valueAmplifier,
        });
      },

      setAuthorityAngle(value: string) { set({ authorityAngle: value }); },
      setCredibilityLevel(value: string) { set({ credibilityLevel: value }); },
      setTrustPromise(value: string) { set({ trustPromise: value }); },
      setAuthorityPosition(value: string) { set({ authorityPosition: value }); },
      setProofAssets(value: ProofAsset[]) { set({ proofAssets: value }); },
      setPortfolioAssets(value: PortfolioAsset[]) { set({ portfolioAssets: value }); },
      setTrustBuilderChecklist(value: TrustBuilderItem[]) { set({ trustBuilderChecklist: value }); },
      setSocialProofPlan(value: SocialProofPlan) { set({ socialProofPlan: value }); },
      setContentAssets(value: ContentAsset[]) { set({ contentAssets: value }); },
      setAuthorityProfile(value: AuthorityProfileData) { set({ authorityProfile: value }); },
      setAuthorityReport(value: AuthorityReport) { set({ authorityReport: value }); },

      confirmStep() {
        const state = get();
        const step = state.currentStep;
        set((s) => ({
          completedSteps: s.completedSteps.includes(step)
            ? s.completedSteps
            : [...s.completedSteps, step],
        }));
      },

      nextStep() {
        const state = get();
        const currentIdx = getStepIndex(state.currentStep);
        const nextIdx = Math.min(currentIdx + 1, AUTHORITY_SYSTEM_STEPS.length - 1);
        const nextStep = AUTHORITY_SYSTEM_STEPS[nextIdx];
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
        const prevStep = AUTHORITY_SYSTEM_STEPS[prevIdx];
        const access: StepAccess =
          prevIdx === 0
            ? { unlocked: true }
            : canNavigateTo(prevStep, state.completedSteps);
        if (access.unlocked) {
          set({ currentStep: prevStep });
        }
      },

      jumpToStep(step: AuthoritySystemStep) {
        const state = get();
        const access = canNavigateTo(step, state.completedSteps);
        if (!access.unlocked) {
          console.warn(`[AuthoritySystem] Cannot jump to "${step}": ${access.reason}`);
          return;
        }
        set({ currentStep: step });
      },

      reset() {
        set({
          phase2Service: null,
          phase2ServiceLabel: null,
          phase2Market: null,
          phase2Niche: null,
          phase2Positioning: '',
          phase2OfferName: '',
          phase2OfferType: null,
          phase2CorePromise: '',
          phase2UniqueMechanism: '',
          phase2Deliverables: [],
          phase2Pricing: '',
          phase2Timeline: '',
          phase2ScopeDetails: '',
          phase2ValueAmplifier: '',
          authorityAngle: '',
          credibilityLevel: '',
          trustPromise: '',
          authorityPosition: '',
          proofAssets: [],
          portfolioAssets: [],
          trustBuilderChecklist: [],
          socialProofPlan: defaultSocialProofPlan(),
          contentAssets: [],
          authorityProfile: defaultAuthorityProfile(),
          authorityReport: null,
          currentStep: 'authority_position',
          completedSteps: [],
        });
      },
    }),
    {
      name: 'authority-system-progress',
      partialize: (state) => ({
        phase2Service: state.phase2Service,
        phase2ServiceLabel: state.phase2ServiceLabel,
        phase2Market: state.phase2Market,
        phase2Niche: state.phase2Niche,
        phase2Positioning: state.phase2Positioning,
        phase2OfferName: state.phase2OfferName,
        phase2OfferType: state.phase2OfferType,
        phase2CorePromise: state.phase2CorePromise,
        phase2UniqueMechanism: state.phase2UniqueMechanism,
        phase2Deliverables: state.phase2Deliverables,
        phase2Pricing: state.phase2Pricing,
        phase2Timeline: state.phase2Timeline,
        phase2ScopeDetails: state.phase2ScopeDetails,
        phase2ValueAmplifier: state.phase2ValueAmplifier,
        authorityAngle: state.authorityAngle,
        credibilityLevel: state.credibilityLevel,
        trustPromise: state.trustPromise,
        authorityPosition: state.authorityPosition,
        proofAssets: state.proofAssets,
        portfolioAssets: state.portfolioAssets,
        trustBuilderChecklist: state.trustBuilderChecklist,
        socialProofPlan: state.socialProofPlan,
        contentAssets: state.contentAssets,
        authorityProfile: state.authorityProfile,
        authorityReport: state.authorityReport,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    },
  ),
);
