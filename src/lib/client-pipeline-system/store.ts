import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ClientPipelineState, ClientPipelineStep, ClientSourceMap, IdealClientCriteria,
  ProspectTypes, SearchQueryBank, LeadScorecard, PipelineEntry, PriorityPlan, PipelineReport,
} from '../../types/client-pipeline-system';
import { CLIENT_PIPELINE_STEPS, canNavigateTo, getStepIndex } from '../../types/client-pipeline-system';

export { canNavigateTo, getStepIndex, CLIENT_PIPELINE_STEPS };

function defaultSourceMap(): ClientSourceMap { return { sources: [] }; }
function defaultCriteria(): IdealClientCriteria { return { criteria: [] }; }
function defaultProspectTypes(): ProspectTypes { return { types: [] }; }
function defaultSearchQueryBank(): SearchQueryBank { return { queries: [] }; }
function defaultScorecard(): LeadScorecard { return { factors: [], total: 0, interpretation: '' }; }
function defaultPriorityPlan(): PriorityPlan { return { entries: [] }; }

export const useClientPipelineStore = create<ClientPipelineState>()(
  persist(
    (set, get) => ({
      phase4Service: null,
      phase4ServiceLabel: null,
      phase4Market: null,
      phase4Niche: null,
      phase4Positioning: '',
      phase4OfferName: '',
      phase4OfferType: null,
      phase4Deliverables: [],
      phase4UniqueMechanism: '',
      phase4Pricing: '',
      phase4Timeline: '',
      phase4ScopeDetails: '',
      phase4AuthorityAngle: '',
      phase4ProofAssets: [],
      phase4PortfolioAssets: [],
      phase4TrustBuilderChecklist: [],
      phase4ContentAssets: [],
      phase4AuthorityProfile: { oneLinePositioning: '', shortBio: '', trustBullets: [], ctaLine: '' },
      phase4PortfolioGoal: { goals: [], statement: '' },
      phase4SelectedAssets: [],
      phase4CaseStudy: { projectTitle: '', clientNicheType: '' },
      phase4SampleProject: { projectName: '', goal: '' },
      phase4PortfolioCopy: { headline: '', shortIntro: '' },
      phase4PortfolioReport: null,

      clientSourceMap: defaultSourceMap(),
      idealClientCriteria: defaultCriteria(),
      prospectTypes: defaultProspectTypes(),
      searchQueryBank: defaultSearchQueryBank(),
      leadScorecard: defaultScorecard(),
      pipelineList: [],
      priorityPlan: defaultPriorityPlan(),
      pipelineReport: null,

      currentStep: 'client_source_map',
      completedSteps: [],

      setPhase4Context(ctx) {
        set({
          phase4Service: ctx.service,
          phase4ServiceLabel: ctx.serviceLabel,
          phase4Market: ctx.market,
          phase4Niche: ctx.niche,
          phase4Positioning: ctx.positioning,
          phase4OfferName: ctx.offerName,
          phase4OfferType: ctx.offerType,
          phase4Deliverables: ctx.deliverables,
          phase4UniqueMechanism: ctx.uniqueMechanism,
          phase4Pricing: ctx.pricing,
          phase4Timeline: ctx.timeline,
          phase4ScopeDetails: ctx.scopeDetails,
          phase4AuthorityAngle: ctx.authorityAngle,
          phase4ProofAssets: ctx.proofAssets,
          phase4PortfolioAssets: ctx.portfolioAssets,
          phase4TrustBuilderChecklist: ctx.trustBuilderChecklist,
          phase4ContentAssets: ctx.contentAssets,
          phase4AuthorityProfile: ctx.authorityProfile,
          phase4PortfolioGoal: ctx.portfolioGoal,
          phase4SelectedAssets: ctx.selectedAssets,
          phase4CaseStudy: ctx.caseStudy,
          phase4SampleProject: ctx.sampleProject,
          phase4PortfolioCopy: ctx.portfolioCopy,
          phase4PortfolioReport: ctx.portfolioReport,
        });
      },

      setClientSourceMap(value) { set({ clientSourceMap: value }); },
      setIdealClientCriteria(value) { set({ idealClientCriteria: value }); },
      setProspectTypes(value) { set({ prospectTypes: value }); },
      setSearchQueryBank(value) { set({ searchQueryBank: value }); },
      setLeadScorecard(value) { set({ leadScorecard: value }); },
      setPipelineList(value) { set({ pipelineList: value }); },
      setPriorityPlan(value) { set({ priorityPlan: value }); },
      setPipelineReport(value) { set({ pipelineReport: value }); },

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
        const nextIdx = Math.min(currentIdx + 1, CLIENT_PIPELINE_STEPS.length - 1);
        const nextStep = CLIENT_PIPELINE_STEPS[nextIdx];
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
        const prevStep = CLIENT_PIPELINE_STEPS[prevIdx];
        const access = prevIdx === 0 ? { unlocked: true } : canNavigateTo(prevStep, state.completedSteps);
        if (access.unlocked) set({ currentStep: prevStep });
      },

      jumpToStep(step) {
        const state = get();
        const access = canNavigateTo(step, state.completedSteps);
        if (access.unlocked) set({ currentStep: step });
      },

      reset() {
        set({
          phase4Service: null,
          phase4ServiceLabel: null,
          phase4Market: null,
          phase4Niche: null,
          phase4Positioning: '',
          phase4OfferName: '',
          phase4OfferType: null,
          phase4Deliverables: [],
          phase4UniqueMechanism: '',
          phase4Pricing: '',
          phase4Timeline: '',
          phase4ScopeDetails: '',
          phase4AuthorityAngle: '',
          phase4ProofAssets: [],
          phase4PortfolioAssets: [],
          phase4TrustBuilderChecklist: [],
          phase4ContentAssets: [],
          phase4AuthorityProfile: { oneLinePositioning: '', shortBio: '', trustBullets: [], ctaLine: '' },
          phase4PortfolioGoal: { goals: [], statement: '' },
          phase4SelectedAssets: [],
          phase4CaseStudy: { projectTitle: '', clientNicheType: '' },
          phase4SampleProject: { projectName: '', goal: '' },
          phase4PortfolioCopy: { headline: '', shortIntro: '' },
          phase4PortfolioReport: null,
          clientSourceMap: defaultSourceMap(),
          idealClientCriteria: defaultCriteria(),
          prospectTypes: defaultProspectTypes(),
          searchQueryBank: defaultSearchQueryBank(),
          leadScorecard: defaultScorecard(),
          pipelineList: [],
          priorityPlan: defaultPriorityPlan(),
          pipelineReport: null,
          currentStep: 'client_source_map',
          completedSteps: [],
        });
      },
    }),
    {
      name: 'client-pipeline-progress',
      partialize: (state) => ({
        phase4Service: state.phase4Service,
        phase4ServiceLabel: state.phase4ServiceLabel,
        phase4Market: state.phase4Market,
        phase4Niche: state.phase4Niche,
        phase4Positioning: state.phase4Positioning,
        phase4OfferName: state.phase4OfferName,
        phase4OfferType: state.phase4OfferType,
        phase4Deliverables: state.phase4Deliverables,
        phase4UniqueMechanism: state.phase4UniqueMechanism,
        phase4Pricing: state.phase4Pricing,
        phase4Timeline: state.phase4Timeline,
        phase4ScopeDetails: state.phase4ScopeDetails,
        phase4AuthorityAngle: state.phase4AuthorityAngle,
        phase4ProofAssets: state.phase4ProofAssets,
        phase4PortfolioAssets: state.phase4PortfolioAssets,
        phase4TrustBuilderChecklist: state.phase4TrustBuilderChecklist,
        phase4ContentAssets: state.phase4ContentAssets,
        phase4AuthorityProfile: state.phase4AuthorityProfile,
        phase4PortfolioGoal: state.phase4PortfolioGoal,
        phase4SelectedAssets: state.phase4SelectedAssets,
        phase4CaseStudy: state.phase4CaseStudy,
        phase4SampleProject: state.phase4SampleProject,
        phase4PortfolioCopy: state.phase4PortfolioCopy,
        phase4PortfolioReport: state.phase4PortfolioReport,
        clientSourceMap: state.clientSourceMap,
        idealClientCriteria: state.idealClientCriteria,
        prospectTypes: state.prospectTypes,
        searchQueryBank: state.searchQueryBank,
        leadScorecard: state.leadScorecard,
        pipelineList: state.pipelineList,
        priorityPlan: state.priorityPlan,
        pipelineReport: state.pipelineReport,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    },
  ),
);
