import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PortfolioSystemState,
  PortfolioSystemStep,
  StepAccess,
  PortfolioGoal,
  CaseStudy,
  SampleProject,
  PortfolioPageStructure,
  PortfolioCopy,
  PortfolioChecklistItem,
  PortfolioReport,
} from '../../types/portfolio-system';
import {
  PORTFOLIO_SYSTEM_STEPS,
  canNavigateTo,
  getStepIndex,
} from '../../types/portfolio-system';

export { canNavigateTo, getStepIndex, PORTFOLIO_SYSTEM_STEPS };

function defaultGoal(): PortfolioGoal {
  return { goals: [], statement: '' };
}

function defaultCaseStudy(): CaseStudy {
  return {
    projectTitle: '', clientNicheType: '', problem: '', process: '',
    deliverables: '', resultExpectedOutcome: '', toolsUsed: '', cta: '',
    isSampleProject: true,
  };
}

function defaultSampleProject(): SampleProject {
  return { projectName: '', goal: '', whatToCreate: '', deliverables: [], timeline: '', howToPresent: '' };
}

function defaultPageStructure(): PortfolioPageStructure {
  return { sections: [] };
}

function defaultCopy(): PortfolioCopy {
  return { headline: '', shortIntro: '', caseStudyIntro: '', processSection: '', cta: '' };
}

export const usePortfolioSystemStore = create<PortfolioSystemState>()(
  persist(
    (set, get) => ({
      phase3Service: null,
      phase3ServiceLabel: null,
      phase3Market: null,
      phase3Niche: null,
      phase3Positioning: '',
      phase3OfferName: '',
      phase3OfferType: null,
      phase3Deliverables: [],
      phase3UniqueMechanism: '',
      phase3Pricing: '',
      phase3Timeline: '',
      phase3ScopeDetails: '',
      phase3AuthorityAngle: '',
      phase3ProofAssets: [],
      phase3PortfolioAssets: [],
      phase3TrustBuilderChecklist: [],
      phase3ContentAssets: [],
      phase3AuthorityProfile: { oneLinePositioning: '', shortBio: '', trustBullets: [], ctaLine: '' },

      portfolioGoal: defaultGoal(),
      selectedAssetTypes: [],
      caseStudy: defaultCaseStudy(),
      sampleProject: defaultSampleProject(),
      pageStructure: defaultPageStructure(),
      portfolioCopy: defaultCopy(),
      checklist: [],
      portfolioReport: null,

      currentStep: 'portfolio_goal',
      completedSteps: [],

      setPhase3Context(ctx) {
        set({
          phase3Service: ctx.service,
          phase3ServiceLabel: ctx.serviceLabel,
          phase3Market: ctx.market,
          phase3Niche: ctx.niche,
          phase3Positioning: ctx.positioning,
          phase3OfferName: ctx.offerName,
          phase3OfferType: ctx.offerType,
          phase3Deliverables: ctx.deliverables,
          phase3UniqueMechanism: ctx.uniqueMechanism,
          phase3Pricing: ctx.pricing,
          phase3Timeline: ctx.timeline,
          phase3ScopeDetails: ctx.scopeDetails,
          phase3AuthorityAngle: ctx.authorityAngle,
          phase3ProofAssets: ctx.proofAssets,
          phase3PortfolioAssets: ctx.portfolioAssets,
          phase3TrustBuilderChecklist: ctx.trustBuilderChecklist,
          phase3ContentAssets: ctx.contentAssets,
          phase3AuthorityProfile: ctx.authorityProfile,
        });
      },

      setPortfolioGoal(value: PortfolioGoal) { set({ portfolioGoal: value }); },
      setSelectedAssetTypes(value: string[]) { set({ selectedAssetTypes: value }); },
      setCaseStudy(value: CaseStudy) { set({ caseStudy: value }); },
      setSampleProject(value: SampleProject) { set({ sampleProject: value }); },
      setPageStructure(value: PortfolioPageStructure) { set({ pageStructure: value }); },
      setPortfolioCopy(value: PortfolioCopy) { set({ portfolioCopy: value }); },
      setChecklist(value: PortfolioChecklistItem[]) { set({ checklist: value }); },
      setPortfolioReport(value: PortfolioReport | null) { set({ portfolioReport: value }); },

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
        const nextIdx = Math.min(currentIdx + 1, PORTFOLIO_SYSTEM_STEPS.length - 1);
        const nextStep = PORTFOLIO_SYSTEM_STEPS[nextIdx];
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
        const prevStep = PORTFOLIO_SYSTEM_STEPS[prevIdx];
        const access: StepAccess =
          prevIdx === 0
            ? { unlocked: true }
            : canNavigateTo(prevStep, state.completedSteps);
        if (access.unlocked) {
          set({ currentStep: prevStep });
        }
      },

      jumpToStep(step: PortfolioSystemStep) {
        const state = get();
        const access = canNavigateTo(step, state.completedSteps);
        if (!access.unlocked) {
          console.warn(`[PortfolioSystem] Cannot jump to "${step}": ${access.reason}`);
          return;
        }
        set({ currentStep: step });
      },

      reset() {
        set({
          phase3Service: null,
          phase3ServiceLabel: null,
          phase3Market: null,
          phase3Niche: null,
          phase3Positioning: '',
          phase3OfferName: '',
          phase3OfferType: null,
          phase3Deliverables: [],
          phase3UniqueMechanism: '',
          phase3Pricing: '',
          phase3Timeline: '',
          phase3ScopeDetails: '',
          phase3AuthorityAngle: '',
          phase3ProofAssets: [],
          phase3PortfolioAssets: [],
          phase3TrustBuilderChecklist: [],
          phase3ContentAssets: [],
          phase3AuthorityProfile: { oneLinePositioning: '', shortBio: '', trustBullets: [], ctaLine: '' },
          portfolioGoal: defaultGoal(),
          selectedAssetTypes: [],
          caseStudy: defaultCaseStudy(),
          sampleProject: defaultSampleProject(),
          pageStructure: defaultPageStructure(),
          portfolioCopy: defaultCopy(),
          checklist: [],
          portfolioReport: null,
          currentStep: 'portfolio_goal',
          completedSteps: [],
        });
      },
    }),
    {
      name: 'portfolio-system-progress',
      partialize: (state) => ({
        phase3Service: state.phase3Service,
        phase3ServiceLabel: state.phase3ServiceLabel,
        phase3Market: state.phase3Market,
        phase3Niche: state.phase3Niche,
        phase3Positioning: state.phase3Positioning,
        phase3OfferName: state.phase3OfferName,
        phase3OfferType: state.phase3OfferType,
        phase3Deliverables: state.phase3Deliverables,
        phase3UniqueMechanism: state.phase3UniqueMechanism,
        phase3Pricing: state.phase3Pricing,
        phase3Timeline: state.phase3Timeline,
        phase3ScopeDetails: state.phase3ScopeDetails,
        phase3AuthorityAngle: state.phase3AuthorityAngle,
        phase3ProofAssets: state.phase3ProofAssets,
        phase3PortfolioAssets: state.phase3PortfolioAssets,
        phase3TrustBuilderChecklist: state.phase3TrustBuilderChecklist,
        phase3ContentAssets: state.phase3ContentAssets,
        phase3AuthorityProfile: state.phase3AuthorityProfile,
        portfolioGoal: state.portfolioGoal,
        selectedAssetTypes: state.selectedAssetTypes,
        caseStudy: state.caseStudy,
        sampleProject: state.sampleProject,
        pageStructure: state.pageStructure,
        portfolioCopy: state.portfolioCopy,
        checklist: state.checklist,
        portfolioReport: state.portfolioReport,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    },
  ),
);
