export const DELIVERY_SYSTEM_STEPS = [
  'project_intake',
  'scope_success',
  'delivery_plan',
  'execution_workspace',
  'communication_updates',
  'feedback_revision',
  'handoff_closeout',
] as const;

export type DeliverySystemStep = typeof DELIVERY_SYSTEM_STEPS[number];

export type ChecklistStatus = 'pending' | 'in_progress' | 'ready';

export type ProjectType = 'one_time' | 'retainer' | 'milestone';

export type AccessSensitivity = 'normal' | 'sensitive';

export type PaymentStatus = 'not_recorded' | 'deposit_pending' | 'deposit_received' | 'final_payment_pending' | 'paid';

export type ProjectStatus =
  | 'setup'
  | 'waiting_for_client'
  | 'ready_to_start'
  | 'in_progress'
  | 'client_review'
  | 'revision'
  | 'qa'
  | 'handoff'
  | 'completed'
  | 'paused'
  | 'cancelled';

export interface DeliveryUpstreamContext {
  serviceId: string | null;
  serviceLabel: string;
  marketId: string | null;
  marketLabel: string;
  nicheId: string | null;
  nicheLabel: string;
  positioning: string;
  offerName: string;
  offerType: string | null;
  deliverables: string[];
  uniqueMechanism: string;
  revisionCount: number;
  deliveryTime: string;
  communicationMethod: string;
  includedRounds: number;
  authorityPosition: string;
  proofSummary: string;
  portfolioSummary: string;
}

export interface DeliveryProjectContext {
  clientName: string;
  clientContact: string;
  projectName: string;
  projectType: ProjectType;
  clientGoals: string;
  agreedDeliverables: string;
  agreedTimeline: string;
  startDate: string;
  targetDeadline: string;
  agreedRevisions: number;
  communicationChannel: string;
  approvalOwner: string;
  clientTimezone: string;
  requiredAssets: string;
  requiredAccess: string;
  accessSensitivity: AccessSensitivity;
  paymentStatus: PaymentStatus;
  projectStatus: ProjectStatus;
  isProjectContextCustom: boolean;
}

export interface IntakeRequirement {
  id: string;
  label: string;
  category: 'asset' | 'access' | 'information';
  status: ChecklistStatus;
  notes: string;
  isCustom: boolean;
}

export interface ProjectIntake {
  kickoffQuestions: string[];
  dependencyChecklist: IntakeRequirement[];
  missingInfoWarnings: string[];
  readyToStart: boolean;
  isCustom: boolean;
}

export interface ScopeLock {
  includedWork: string[];
  excludedWork: string[];
  revisionAllowance: string;
  successDefinition: string;
  approvalResponsibilities: string;
  scopeChangeProcess: string;
  assumptions: string[];
  unresolvedWarnings: string[];
  isScopeCustom: boolean;
}

export interface SuccessDefinition {
  primaryGoal: string;
  qualityBar: string;
  clientAcceptanceCriteria: string;
  completionTriggers: string[];
  isCustom: boolean;
}

export interface DeliveryMilestone {
  id: string;
  stage: string;
  milestone: string;
  timing: string;
  owner: string;
  dependencies: string[];
  reviewPoint: string;
  clientActionDeadline: string;
  status: ChecklistStatus;
  isCustom: boolean;
}

export interface ExecutionTask {
  id: string;
  task: string;
  category: 'setup' | 'execution' | 'review' | 'qa' | 'delivery';
  status: ChecklistStatus;
  serviceSpecific: boolean;
  notes: string;
  isCustom: boolean;
}

export interface ProjectBlocker {
  id: string;
  description: string;
  impact: string;
  resolution: string;
  status: 'open' | 'resolved' | 'mitigated';
  createdAt: string;
  isCustom: boolean;
}

export interface MessageTemplate {
  id: string;
  label: string;
  channel: string;
  subject: string;
  body: string;
  isCustom: boolean;
}

export interface CommunicationPlan {
  cadence: string;
  updateFrequency: string;
  preferredChannel: string;
  escalationContact: string;
  templateLibrary: MessageTemplate[];
  isCommunicationCustom: boolean;
}

export interface FeedbackRequest {
  id: string;
  requestedAt: string;
  focusArea: string;
  specificQuestions: string[];
  deadline: string;
  status: 'pending' | 'received' | 'reviewed';
  isCustom: boolean;
}

export type RevisionClassification = 'included' | 'out_of_scope' | 'clarification';

export type RevisionStatus = 'requested' | 'in_review' | 'accepted' | 'rejected';

export interface RevisionRequest {
  id: string;
  description: string;
  classification: RevisionClassification;
  status: RevisionStatus;
  response: string;
  completedAt: string;
  isCustom: boolean;
}

export interface ScopeChangeDecision {
  id: string;
  requestedChange: string;
  impact: string;
  decision: 'approved' | 'declined' | 'pending';
  responseNotes: string;
  isCustom: boolean;
}

export interface QualityCheck {
  id: string;
  check: string;
  category: string;
  status: ChecklistStatus;
  notes: string;
  isCustom: boolean;
}

export interface HandoffItem {
  id: string;
  item: string;
  type: 'file' | 'access' | 'documentation' | 'credential';
  status: ChecklistStatus;
  notes: string;
  isCustom: boolean;
}

export interface ProjectCloseout {
  deliveryMessage: string;
  completionConfirmed: boolean;
  finalPaymentStatus: PaymentStatus;
  testimonialRequested: boolean;
  testimonialStatus: 'pending' | 'received' | 'declined' | 'not_appropriate';
  referralRequested: boolean;
  referralStatus: 'pending' | 'sent' | 'received' | 'not_appropriate';
  repeatWorkPathway: string;
  isCloseoutCustom: boolean;
}

export interface ClientDeliveryPack {
  projectSummary: string;
  clientGoals: string;
  intakeStatus: string;
  unresolvedDependencies: string[];
  scopeLock: ScopeLock;
  successDefinition: SuccessDefinition;
  revisionPolicy: string;
  scopeChangeProcess: string;
  milestones: DeliveryMilestone[];
  timeline: string;
  reviewPoints: string[];
  clientActionDeadlines: string[];
  executionWorkflow: string;
  progressEvidence: string[];
  communicationPlan: CommunicationPlan;
  messageTemplates: MessageTemplate[];
  feedbackWorkflow: string;
  revisionRecords: RevisionRequest[];
  serviceQA: QualityCheck[];
  handoffChecklist: HandoffItem[];
  documentationNotes: string;
  finalDeliveryMessage: string;
  paymentStatusReminder: string;
  testimonialRequest: string;
  referralRequest: string;
  repeatWorkPathway: string;
  risks: string[];
  nextActions: string[];
}

export interface ExecutionHistoryArchive {
  id: string;
  recordType: 'milestone' | 'execution_task' | 'qa_check' | 'handoff_item' | 'intake_requirement';
  label: string;
  status: ChecklistStatus;
  notes: string;
  archivedAt: string;
  reason: string;
}

export type MessageTemplateType =
  | 'kickoff_confirmation'
  | 'asset_access_request'
  | 'missing_information_reminder'
  | 'progress_update'
  | 'clarification_request'
  | 'delay_blocker_update'
  | 'client_action_reminder'
  | 'milestone_review_request'
  | 'structured_feedback_request'
  | 'revision_confirmation'
  | 'out_of_scope_response'
  | 'revised_timeline_confirmation'
  | 'final_approval_request'
  | 'final_delivery_message'
  | 'final_payment_reminder'
  | 'testimonial_request'
  | 'referral_request'
  | 'repeat_work_proposal';

export interface DeliverySystemState {
  upstream: DeliveryUpstreamContext | null;
  upstreamFingerprint: string;
  staleSince: number | null;
  lastGeneratedAt: number | null;

  projectContext: DeliveryProjectContext;
  projectIntake: ProjectIntake;
  scopeLock: ScopeLock;
  successDefinition: SuccessDefinition;
  milestones: DeliveryMilestone[];
  executionTasks: ExecutionTask[];
  blockers: ProjectBlocker[];
  communicationPlan: CommunicationPlan;
  feedbackRequests: FeedbackRequest[];
  revisionRecords: RevisionRequest[];
  scopeChangeDecisions: ScopeChangeDecision[];
  qaChecks: QualityCheck[];
  handoffItems: HandoffItem[];
  closeout: ProjectCloseout;
  deliveryPack: ClientDeliveryPack | null;
  archivedExecutionHistory: ExecutionHistoryArchive[];

  currentStep: DeliverySystemStep;
  completedSteps: DeliverySystemStep[];
  isCompleted: boolean;

  setUpstreamContext(ctx: DeliveryUpstreamContext, fingerprint: string): void;
  setProjectContext(value: Partial<DeliveryProjectContext>): void;
  setProjectIntake(value: ProjectIntake): void;
  updateIntakeRequirement(id: string, updates: Partial<IntakeRequirement>): void;
  setScopeLock(value: ScopeLock): void;
  setSuccessDefinition(value: SuccessDefinition): void;
  setMilestones(value: DeliveryMilestone[]): void;
  updateMilestone(id: string, updates: Partial<DeliveryMilestone>): void;
  setExecutionTasks(value: ExecutionTask[]): void;
  updateExecutionTask(id: string, updates: Partial<ExecutionTask>): void;
  addBlocker(blocker: ProjectBlocker): void;
  updateBlocker(id: string, updates: Partial<ProjectBlocker>): void;
  setCommunicationPlan(value: CommunicationPlan): void;
  updateMessageTemplate(id: string, updates: Partial<MessageTemplate>): void;
  addFeedbackRequest(request: FeedbackRequest): void;
  updateFeedbackRequest(id: string, updates: Partial<FeedbackRequest>): void;
  addRevisionRecord(record: RevisionRequest): void;
  updateRevisionRecord(id: string, updates: Partial<RevisionRequest>): void;
  addScopeChangeDecision(decision: ScopeChangeDecision): void;
  updateScopeChangeDecision(id: string, updates: Partial<ScopeChangeDecision>): void;
  setQaChecks(value: QualityCheck[]): void;
  updateQaCheck(id: string, updates: Partial<QualityCheck>): void;
  setHandoffItems(value: HandoffItem[]): void;
  updateHandoffItem(id: string, updates: Partial<HandoffItem>): void;
  setCloseout(value: ProjectCloseout): void;
  setDeliveryPack(value: ClientDeliveryPack | null): void;
  confirmStep(): void;
  nextStep(): void;
  previousStep(): void;
  jumpToStep(step: DeliverySystemStep): void;
  markStale(): void;
  clearStale(): void;
  regenerate(): void;
  reset(): void;
}

export interface StepAccess {
  unlocked: boolean;
  reason?: string;
}

const STEP_INDEX_MAP: Record<DeliverySystemStep, number> = {
  project_intake: 0,
  scope_success: 1,
  delivery_plan: 2,
  execution_workspace: 3,
  communication_updates: 4,
  feedback_revision: 5,
  handoff_closeout: 6,
};

export function getStepIndex(step: DeliverySystemStep): number {
  return STEP_INDEX_MAP[step] ?? 0;
}

export function canNavigateTo(target: DeliverySystemStep, completedSteps: DeliverySystemStep[]): StepAccess {
  if (target === 'project_intake') return { unlocked: true };
  const targetIdx = getStepIndex(target);
  const requiredIdx = targetIdx - 1;
  if (requiredIdx < 0) return { unlocked: true };
  const requiredStep = DELIVERY_SYSTEM_STEPS[requiredIdx];
  const isUnlocked = completedSteps.includes(requiredStep);
  return {
    unlocked: isUnlocked,
    reason: isUnlocked ? undefined : `Complete "${requiredStep.replace(/_/g, ' ')}" first`,
  };
}
