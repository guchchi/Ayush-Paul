import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PortfolioSystemState,
  PortfolioSystemStep,
  StepAccess,
  PortfolioDirection,
  PlatformRecommendation,
  PortfolioSectionSpec,
  ProjectPlacement,
  ProjectPresentationSpec,
  PortfolioCopyArchitecture,
  ChecklistItem,
  PortfolioBuildPack,
  UpstreamContext,
} from '../../types/portfolio-system';
import {
  PORTFOLIO_SYSTEM_STEPS,
  canNavigateTo,
  getStepIndex,
} from '../../types/portfolio-system';

export { canNavigateTo, getStepIndex, PORTFOLIO_SYSTEM_STEPS };

function defaultUpstream(): UpstreamContext {
  return {
    mod1CareerTrackId: null, mod1ServiceId: null, mod1MarketId: null,
    mod1NicheId: null, mod1OfferId: null, mod1Positioning: '',
    mod2OfferType: null, mod2Deliverables: [], mod2UniqueMechanism: '',
    mod2ScopeLimits: {}, mod2ValueAmplifier: '', mod2PricingModel: null,
    mod2ProposalSummary: {},
    mod3AuthorityPosition: '', mod3CoreTrustPromise: '',
    mod3ProofPriorities: [], mod3ProofAssets: [],
    mod3ProfileCopy: {
      professionalHeadline: '', shortBio: '', longBio: '',
      offerStatement: '', credibilityBullets: [],
      proofReferenceLine: '', ctaLine: '',
    },
    mod3PortfolioCopy: { portfolioCta: '', sections: [] },
  };
}

function computeFingerprint(ctx: UpstreamContext): string {
  const payload = {
    s: ctx.mod1ServiceId,
    m: ctx.mod1MarketId,
    n: ctx.mod1NicheId,
    p: ctx.mod1Positioning,
    ot: ctx.mod2OfferType,
    d: ctx.mod2Deliverables,
    um: ctx.mod2UniqueMechanism,
    va: ctx.mod2ValueAmplifier,
    ap: ctx.mod3AuthorityPosition,
    cp: ctx.mod3CoreTrustPromise,
    pp: ctx.mod3ProofPriorities.map((pp) => ({
      id: pp.id, gt: pp.gapTitle, gd: pp.gapDescription, rf: pp.recommendedFormat,
    })),
    pa: ctx.mod3ProofAssets.map((a) => ({
      id: a.id, pid: a.priorityId, t: a.title, at: a.assetType,
      cg: a.credibilityGapProved, pc: a.portfolioCopy,
      ps: a.presentationStructure, ia: a.isAccepted,
    })),
    prc: {
      ph: ctx.mod3ProfileCopy.professionalHeadline,
      os: ctx.mod3ProfileCopy.offerStatement,
      prl: ctx.mod3ProfileCopy.proofReferenceLine,
      cl: ctx.mod3ProfileCopy.ctaLine,
    },
    poc: {
      pc: ctx.mod3PortfolioCopy.portfolioCta,
      s: ctx.mod3PortfolioCopy.sections.map((s) => ({ t: s.type, h: s.heading })),
    },
  };
  return JSON.stringify(payload);
}

function isV1State(state: Record<string, unknown>): boolean {
  return 'portfolioGoal' in state || 'caseStudy' in state || 'sampleProject' in state;
}

export const usePortfolioSystemStore = create<PortfolioSystemState>()(
  persist(
    (set, get) => ({
      upstream: null,
      upstreamFingerprint: '',
      staleSince: null,
      lastGeneratedAt: null,
      editedFields: [],
      version: 2,

      portfolioDirection: null,
      platformRecommendation: null,
      sections: [],
      projectPlacements: [],
      projectPresentations: [],
      portfolioCopy: null,
      buildPack: null,
      buildChecklist: [],
      publishChecklist: [],

      currentStep: 'portfolio_direction',
      completedSteps: [],
      isCompleted: false,

      setPhase3Context(ctx: UpstreamContext) {
        const state = get();
        const newFp = computeFingerprint(ctx);
        const oldFp = state.upstreamFingerprint;
        const hasProgress = state.completedSteps.length > 0 || state.editedFields.length > 0;
        const fingerprintChanged = oldFp !== '' && oldFp !== newFp;

        if (fingerprintChanged && hasProgress) {
          set({
            upstream: ctx,
            upstreamFingerprint: newFp,
            staleSince: Date.now(),
          });
          return;
        }

        if (fingerprintChanged && !hasProgress) {
          set({
            upstream: ctx,
            upstreamFingerprint: newFp,
            staleSince: null,
            portfolioDirection: null,
            platformRecommendation: null,
            sections: [],
            projectPlacements: [],
            projectPresentations: [],
            portfolioCopy: null,
            buildPack: null,
            buildChecklist: [],
            publishChecklist: [],
            currentStep: 'portfolio_direction',
            completedSteps: [],
            isCompleted: false,
            editedFields: [],
            lastGeneratedAt: null,
          });
          return;
        }

        if (!state.upstream) {
          set({ upstream: ctx, upstreamFingerprint: newFp });
        }
      },

      setPortfolioDirection(value: PortfolioDirection) {
        set({ portfolioDirection: value });
      },

      setPlatformRecommendation(value: PlatformRecommendation) {
        set({ platformRecommendation: value });
      },

      setSections(value: PortfolioSectionSpec[]) {
        set({ sections: value });
      },

      updateSection(id: string, updates: Partial<PortfolioSectionSpec>) {
        set((s) => ({
          sections: s.sections.map((sec) =>
            sec.id === id ? { ...sec, ...updates, isCustom: true } : sec
          ),
        }));
      },

      setProjectPlacements(value: ProjectPlacement[]) {
        set({ projectPlacements: value });
      },

      setProjectPresentations(value: ProjectPresentationSpec[]) {
        set({ projectPresentations: value });
      },

      updateProjectPresentation(assetId: string, updates: Partial<ProjectPresentationSpec>) {
        set((s) => ({
          projectPresentations: s.projectPresentations.map((p) =>
            p.assetId === assetId ? { ...p, ...updates, isCustom: true } : p
          ),
        }));
      },

      setPortfolioCopy(value: PortfolioCopyArchitecture) {
        set({ portfolioCopy: value });
      },

      setBuildChecklist(value: ChecklistItem[]) {
        set({ buildChecklist: value });
      },

      setPublishChecklist(value: ChecklistItem[]) {
        set({ publishChecklist: value });
      },

      setBuildPack(value: PortfolioBuildPack | null) {
        set({ buildPack: value, lastGeneratedAt: value ? Date.now() : null });
      },

      setCurrentStep(step: PortfolioSystemStep) {
        set({ currentStep: step });
      },

      confirmStep() {
        const step = get().currentStep;
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
        const step = state.currentStep;
        set((s) => ({
          currentStep: PORTFOLIO_SYSTEM_STEPS[nextIdx],
          completedSteps: s.completedSteps.includes(step)
            ? s.completedSteps
            : [...s.completedSteps, step],
          isCompleted: nextIdx === PORTFOLIO_SYSTEM_STEPS.length - 1,
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
        if (!access.unlocked) return;
        if (step === state.currentStep) return;
        set({ currentStep: step });
      },

      markEdited(fieldPath: string) {
        set((s) => ({
          editedFields: s.editedFields.includes(fieldPath)
            ? s.editedFields
            : [...s.editedFields, fieldPath],
        }));
      },

      clearEdits() {
        set({ editedFields: [] });
      },

      markStale() {
        set({ staleSince: Date.now() });
      },

      clearStale() {
        set({ staleSince: null });
      },

      regenerate() {
        const up = get().upstream;
        set({
          portfolioDirection: null,
          platformRecommendation: null,
          sections: [],
          projectPlacements: [],
          projectPresentations: [],
          portfolioCopy: null,
          buildPack: null,
          buildChecklist: [],
          publishChecklist: [],
          currentStep: 'portfolio_direction',
          completedSteps: [],
          isCompleted: false,
          editedFields: [],
          lastGeneratedAt: null,
          staleSince: null,
          upstreamFingerprint: up ? computeFingerprint(up) : '',
        });
      },

      reset() {
        set({
          upstream: null,
          upstreamFingerprint: '',
          staleSince: null,
          lastGeneratedAt: null,
          editedFields: [],
          portfolioDirection: null,
          platformRecommendation: null,
          sections: [],
          projectPlacements: [],
          projectPresentations: [],
          portfolioCopy: null,
          buildPack: null,
          buildChecklist: [],
          publishChecklist: [],
          currentStep: 'portfolio_direction',
          completedSteps: [],
          isCompleted: false,
          version: 2,
        });
      },
    }),
    {
      name: 'portfolio-system-progress',
      version: 2,
      migrate: (persisted: unknown) => {
        const raw = persisted as Record<string, unknown>;
        if (isV1State(raw)) {
          const up: UpstreamContext = {
            mod1CareerTrackId: null, mod1ServiceId: (raw.phase3Service as string) ?? null,
            mod1MarketId: (raw.phase3Market as string) ?? null,
            mod1NicheId: (raw.phase3Niche as string) ?? null,
            mod1OfferId: null, mod1Positioning: (raw.phase3Positioning as string) ?? '',
            mod2OfferType: (raw.phase3OfferType as string) ?? null,
            mod2Deliverables: (raw.phase3Deliverables as string[]) ?? [],
            mod2UniqueMechanism: (raw.phase3UniqueMechanism as string) ?? '',
            mod2ScopeLimits: {}, mod2ValueAmplifier: '', mod2PricingModel: null,
            mod2ProposalSummary: {},
            mod3AuthorityPosition: (raw.phase3AuthorityAngle as string) ?? '',
            mod3CoreTrustPromise: '',
            mod3ProofPriorities: [],
            mod3ProofAssets: ((raw.phase3ProofAssets as { title: string; type: string }[]) ?? []).map((a) => ({
              id: '', priorityId: '', title: a.title, assetType: a.type,
              credibilityGapProved: '', portfolioCopy: { headline: '', description: '', proofStatement: '', cta: '' },
              presentationStructure: [], isAccepted: true,
            })),
            mod3ProfileCopy: {
              professionalHeadline: '',
              shortBio: (raw.phase3AuthorityProfile as Record<string, unknown>)?.shortBio as string ?? '',
              longBio: '', offerStatement: '', credibilityBullets: [],
              proofReferenceLine: '', ctaLine: '',
            },
            mod3PortfolioCopy: { portfolioCta: '', sections: [] },
          };
          return {
            upstream: up,
            upstreamFingerprint: '',
            staleSince: null, lastGeneratedAt: null, editedFields: [],
            version: 2,
            portfolioDirection: null, platformRecommendation: null, sections: [],
            projectPlacements: [], projectPresentations: [],
            portfolioCopy: null, buildPack: null,
            buildChecklist: [], publishChecklist: [],
            currentStep: 'portfolio_direction', completedSteps: [], isCompleted: false,
          };
        }
        if (!raw.version || (raw.version as number) < 2) {
          return {
            ...raw,
            version: 2,
            portfolioDirection: null, platformRecommendation: null, sections: [],
            projectPlacements: [], projectPresentations: [],
            portfolioCopy: null, buildPack: null,
            buildChecklist: [], publishChecklist: [],
            currentStep: 'portfolio_direction', completedSteps: [], isCompleted: false,
            staleSince: null, lastGeneratedAt: null, editedFields: [],
          } as PortfolioSystemState;
        }
        return raw as unknown as PortfolioSystemState;
      },
      partialize: (state) => ({
        version: state.version,
        upstream: state.upstream,
        upstreamFingerprint: state.upstreamFingerprint,
        staleSince: state.staleSince,
        lastGeneratedAt: state.lastGeneratedAt,
        editedFields: state.editedFields,
        portfolioDirection: state.portfolioDirection,
        platformRecommendation: state.platformRecommendation,
        sections: state.sections,
        projectPlacements: state.projectPlacements,
        projectPresentations: state.projectPresentations,
        portfolioCopy: state.portfolioCopy,
        buildPack: state.buildPack,
        buildChecklist: state.buildChecklist,
        publishChecklist: state.publishChecklist,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        isCompleted: state.isCompleted,
      }),
    },
  ),
);
