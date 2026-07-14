import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DeliverySystemState,
  DeliverySystemStep,
  DeliveryUpstreamContext,
  DeliveryProjectContext,
  ProjectIntake,
  IntakeRequirement,
  ScopeLock,
  SuccessDefinition,
  DeliveryMilestone,
  ExecutionTask,
  ProjectBlocker,
  CommunicationPlan,
  MessageTemplate,
  FeedbackRequest,
  RevisionRequest,
  ScopeChangeDecision,
  QualityCheck,
  HandoffItem,
  ProjectCloseout,
  ClientDeliveryPack,
  StepAccess,
  ChecklistStatus,
  ExecutionHistoryArchive,
} from '../../types/delivery-system';
import {
  DELIVERY_SYSTEM_STEPS,
  canNavigateTo,
  getStepIndex,
} from '../../types/delivery-system';

export { canNavigateTo, getStepIndex, DELIVERY_SYSTEM_STEPS };

function computeFingerprint(ctx: DeliveryUpstreamContext): string {
  const payload = {
    s: ctx.serviceId,
    sl: ctx.serviceLabel,
    m: ctx.marketId,
    ml: ctx.marketLabel,
    n: ctx.nicheId,
    nl: ctx.nicheLabel,
    p: ctx.positioning,
    on: ctx.offerName,
    ot: ctx.offerType,
    d: ctx.deliverables,
    um: ctx.uniqueMechanism,
    rc: ctx.revisionCount,
    dt: ctx.deliveryTime,
    cm: ctx.communicationMethod,
    ir: ctx.includedRounds,
    ap: ctx.authorityPosition,
    ps: ctx.proofSummary,
    pfs: ctx.portfolioSummary,
  };
  return JSON.stringify(payload);
}

function defaultProjectContext(): DeliveryProjectContext {
  return {
    clientName: '',
    clientContact: '',
    projectName: '',
    projectType: 'one_time',
    clientGoals: '',
    agreedDeliverables: '',
    agreedTimeline: '',
    startDate: '',
    targetDeadline: '',
    agreedRevisions: 2,
    communicationChannel: '',
    approvalOwner: '',
    clientTimezone: '',
    requiredAssets: '',
    requiredAccess: '',
    accessSensitivity: 'normal',
    paymentStatus: 'not_recorded',
    projectStatus: 'setup',
    isProjectContextCustom: false,
  };
}

function defaultIntake(): ProjectIntake {
  return {
    kickoffQuestions: [],
    dependencyChecklist: [],
    missingInfoWarnings: [],
    readyToStart: false,
    isCustom: false,
  };
}

function defaultScopeLock(): ScopeLock {
  return {
    includedWork: [],
    excludedWork: [],
    revisionAllowance: '',
    successDefinition: '',
    approvalResponsibilities: '',
    scopeChangeProcess: '',
    assumptions: [],
    unresolvedWarnings: [],
    isScopeCustom: false,
  };
}

function defaultSuccessDefinition(): SuccessDefinition {
  return {
    primaryGoal: '',
    qualityBar: '',
    clientAcceptanceCriteria: '',
    completionTriggers: [],
    isCustom: false,
  };
}

function defaultCommunicationPlan(): CommunicationPlan {
  return {
    cadence: '',
    updateFrequency: '',
    preferredChannel: '',
    escalationContact: '',
    templateLibrary: [],
    isCommunicationCustom: false,
  };
}

function defaultCloseout(): ProjectCloseout {
  return {
    deliveryMessage: '',
    completionConfirmed: false,
    finalPaymentStatus: 'not_recorded',
    testimonialRequested: false,
    testimonialStatus: 'pending',
    referralRequested: false,
    referralStatus: 'pending',
    repeatWorkPathway: '',
    isCloseoutCustom: false,
  };
}

export const useDeliverySystemStore = create<DeliverySystemState>()(
  persist(
    (set, get) => ({
      upstream: null,
      upstreamFingerprint: '',
      staleSince: null,
      lastGeneratedAt: null,

      projectContext: defaultProjectContext(),
      projectIntake: defaultIntake(),
      scopeLock: defaultScopeLock(),
      successDefinition: defaultSuccessDefinition(),
      milestones: [],
      executionTasks: [],
      blockers: [],
      communicationPlan: defaultCommunicationPlan(),
      feedbackRequests: [],
      revisionRecords: [],
      scopeChangeDecisions: [],
      qaChecks: [],
      handoffItems: [],
      closeout: defaultCloseout(),
      deliveryPack: null,
      archivedExecutionHistory: [],

      currentStep: 'project_intake',
      completedSteps: [],
      isCompleted: false,

      setUpstreamContext(ctx: DeliveryUpstreamContext, fingerprint: string) {
        const state = get();
        const newFp = fingerprint || computeFingerprint(ctx);
        const oldFp = state.upstreamFingerprint;
        const hasProgress = state.completedSteps.length > 0 || state.deliveryPack !== null;
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
            projectContext: defaultProjectContext(),
            projectIntake: defaultIntake(),
            scopeLock: defaultScopeLock(),
            successDefinition: defaultSuccessDefinition(),
            milestones: [],
            executionTasks: [],
            blockers: [],
            communicationPlan: defaultCommunicationPlan(),
            feedbackRequests: [],
            revisionRecords: [],
            scopeChangeDecisions: [],
            qaChecks: [],
            handoffItems: [],
            closeout: defaultCloseout(),
            deliveryPack: null,
            currentStep: 'project_intake',
            completedSteps: [],
            isCompleted: false,
            lastGeneratedAt: null,
          });
          return;
        }

        if (!state.upstream) {
          set({ upstream: ctx, upstreamFingerprint: newFp });
        }
      },

      setProjectContext(value: Partial<DeliveryProjectContext>) {
        set((s) => ({
          projectContext: { ...s.projectContext, ...value },
        }));
      },

      setProjectIntake(value: ProjectIntake) {
        set({ projectIntake: value });
      },

      updateIntakeRequirement(id: string, updates: Partial<IntakeRequirement>) {
        set((s) => ({
          projectIntake: {
            ...s.projectIntake,
            dependencyChecklist: s.projectIntake.dependencyChecklist.map((req) =>
              req.id === id ? { ...req, ...updates } : req
            ),
          },
        }));
      },

      setScopeLock(value: ScopeLock) {
        set({ scopeLock: value });
      },

      setSuccessDefinition(value: SuccessDefinition) {
        set({ successDefinition: value });
      },

      setMilestones(value: DeliveryMilestone[]) {
        set({ milestones: value });
      },

      updateMilestone(id: string, updates: Partial<DeliveryMilestone>) {
        set((s) => ({
          milestones: s.milestones.map((m) =>
            m.id === id ? { ...m, ...updates, isCustom: true } : m
          ),
        }));
      },

      setExecutionTasks(value: ExecutionTask[]) {
        set({ executionTasks: value });
      },

      updateExecutionTask(id: string, updates: Partial<ExecutionTask>) {
        set((s) => ({
          executionTasks: s.executionTasks.map((t) =>
            t.id === id ? { ...t, ...updates, isCustom: true } : t
          ),
        }));
      },

      addBlocker(blocker: ProjectBlocker) {
        set((s) => ({ blockers: [...s.blockers, blocker] }));
      },

      updateBlocker(id: string, updates: Partial<ProjectBlocker>) {
        set((s) => ({
          blockers: s.blockers.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        }));
      },

      setCommunicationPlan(value: CommunicationPlan) {
        set({ communicationPlan: value });
      },

      updateMessageTemplate(id: string, updates: Partial<MessageTemplate>) {
        set((s) => ({
          communicationPlan: {
            ...s.communicationPlan,
            templateLibrary: s.communicationPlan.templateLibrary.map((t) =>
              t.id === id ? { ...t, ...updates, isCustom: true } : t
            ),
          },
        }));
      },

      addFeedbackRequest(request: FeedbackRequest) {
        set((s) => ({ feedbackRequests: [...s.feedbackRequests, request] }));
      },

      updateFeedbackRequest(id: string, updates: Partial<FeedbackRequest>) {
        set((s) => ({
          feedbackRequests: s.feedbackRequests.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      addRevisionRecord(record: RevisionRequest) {
        set((s) => ({ revisionRecords: [...s.revisionRecords, record] }));
      },

      updateRevisionRecord(id: string, updates: Partial<RevisionRequest>) {
        set((s) => ({
          revisionRecords: s.revisionRecords.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      addScopeChangeDecision(decision: ScopeChangeDecision) {
        set((s) => ({ scopeChangeDecisions: [...s.scopeChangeDecisions, decision] }));
      },

      updateScopeChangeDecision(id: string, updates: Partial<ScopeChangeDecision>) {
        set((s) => ({
          scopeChangeDecisions: s.scopeChangeDecisions.map((d) =>
            d.id === id ? { ...d, ...updates, isCustom: true } : d
          ),
        }));
      },

      setQaChecks(value: QualityCheck[]) {
        set({ qaChecks: value });
      },

      updateQaCheck(id: string, updates: Partial<QualityCheck>) {
        set((s) => ({
          qaChecks: s.qaChecks.map((c) =>
            c.id === id ? { ...c, ...updates, isCustom: true } : c
          ),
        }));
      },

      setHandoffItems(value: HandoffItem[]) {
        set({ handoffItems: value });
      },

      updateHandoffItem(id: string, updates: Partial<HandoffItem>) {
        set((s) => ({
          handoffItems: s.handoffItems.map((h) =>
            h.id === id ? { ...h, ...updates, isCustom: true } : h
          ),
        }));
      },

      setCloseout(value: ProjectCloseout) {
        set({ closeout: value });
      },

      setDeliveryPack(value: ClientDeliveryPack | null) {
        set({ deliveryPack: value, lastGeneratedAt: value ? Date.now() : null });
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
        const nextIdx = Math.min(currentIdx + 1, DELIVERY_SYSTEM_STEPS.length - 1);
        const step = state.currentStep;
        set((s) => ({
          currentStep: DELIVERY_SYSTEM_STEPS[nextIdx],
          completedSteps: s.completedSteps.includes(step)
            ? s.completedSteps
            : [...s.completedSteps, step],
          isCompleted: nextIdx === DELIVERY_SYSTEM_STEPS.length - 1,
        }));
      },

      previousStep() {
        const state = get();
        const currentIdx = getStepIndex(state.currentStep);
        const prevIdx = Math.max(currentIdx - 1, 0);
        const prevStep = DELIVERY_SYSTEM_STEPS[prevIdx];
        const access: StepAccess =
          prevIdx === 0
            ? { unlocked: true }
            : canNavigateTo(prevStep, state.completedSteps);
        if (access.unlocked) {
          set({ currentStep: prevStep });
        }
      },

      jumpToStep(step: DeliverySystemStep) {
        const state = get();
        const access = canNavigateTo(step, state.completedSteps);
        if (!access.unlocked) return;
        if (step === state.currentStep) return;
        set({ currentStep: step });
      },

      markStale() {
        set({ staleSince: Date.now() });
      },

      clearStale() {
        set({ staleSince: null });
      },

      regenerate() {
        const s = get();
        const up = s.upstream;
        const now = new Date().toISOString();
        const archiveIncompatible = <T extends { id: string; status?: string }>(
          items: T[],
          label: string
        ): ExecutionHistoryArchive[] =>
          items
            .filter((i) => 'status' in i && i.status !== 'pending')
            .map((i) => ({
              id: i.id,
              recordType: label as ExecutionHistoryArchive['recordType'],
              label: String((i as Record<string, unknown>).task ?? (i as Record<string, unknown>).milestone ?? (i as Record<string, unknown>).check ?? (i as Record<string, unknown>).item ?? (i as Record<string, unknown>).label ?? i.id),
              status: (i.status as ChecklistStatus) || 'pending',
              notes: String((i as Record<string, unknown>).notes ?? ''),
              archivedAt: now,
              reason: 'Regenerated — status preserved in archive',
            }));
        set({
          projectContext: defaultProjectContext(),
          projectIntake: defaultIntake(),
          scopeLock: defaultScopeLock(),
          successDefinition: defaultSuccessDefinition(),
          milestones: [],
          executionTasks: [],
          blockers: s.blockers,
          feedbackRequests: s.feedbackRequests,
          revisionRecords: s.revisionRecords,
          scopeChangeDecisions: s.scopeChangeDecisions,
          qaChecks: [],
          handoffItems: [],
          communicationPlan: defaultCommunicationPlan(),
          deliveryPack: null,
          archivedExecutionHistory: [
            ...s.archivedExecutionHistory,
            ...archiveIncompatible(s.milestones, 'milestone'),
            ...archiveIncompatible(s.executionTasks, 'execution_task'),
            ...archiveIncompatible(s.qaChecks, 'qa_check'),
            ...archiveIncompatible(s.handoffItems, 'handoff_item'),
            ...archiveIncompatible(s.projectIntake.dependencyChecklist, 'intake_requirement'),
          ],
          currentStep: 'project_intake',
          completedSteps: [],
          isCompleted: false,
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
          projectContext: defaultProjectContext(),
          projectIntake: defaultIntake(),
          scopeLock: defaultScopeLock(),
          successDefinition: defaultSuccessDefinition(),
          milestones: [],
          executionTasks: [],
          blockers: [],
          communicationPlan: defaultCommunicationPlan(),
          feedbackRequests: [],
          revisionRecords: [],
          scopeChangeDecisions: [],
          qaChecks: [],
          handoffItems: [],
          closeout: defaultCloseout(),
          deliveryPack: null,
          archivedExecutionHistory: [],
          currentStep: 'project_intake',
          completedSteps: [],
          isCompleted: false,
        });
      },
    }),
    {
      name: 'delivery-system-progress',
      version: 1,
      migrate: (persisted: unknown) => {
        const raw = persisted as Record<string, unknown>;
        return raw as unknown as DeliverySystemState;
      },
      partialize: (state): Partial<DeliverySystemState> => ({
        upstream: state.upstream,
        upstreamFingerprint: state.upstreamFingerprint,
        staleSince: state.staleSince,
        lastGeneratedAt: state.lastGeneratedAt,
        projectContext: state.projectContext,
        projectIntake: state.projectIntake,
        scopeLock: state.scopeLock,
        successDefinition: state.successDefinition,
        milestones: state.milestones,
        executionTasks: state.executionTasks,
        blockers: state.blockers,
        communicationPlan: state.communicationPlan,
        feedbackRequests: state.feedbackRequests,
        revisionRecords: state.revisionRecords,
        scopeChangeDecisions: state.scopeChangeDecisions,
        qaChecks: state.qaChecks,
        handoffItems: state.handoffItems,
        closeout: state.closeout,
        deliveryPack: state.deliveryPack,
        archivedExecutionHistory: state.archivedExecutionHistory,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        isCompleted: state.isCompleted,
      }),
    },
  ),
);
