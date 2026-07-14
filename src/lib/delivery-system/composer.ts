import type {
  DeliveryUpstreamContext,
  DeliverySystemState,
  ProjectIntake,
  ScopeLock,
  DeliveryMilestone,
  ExecutionTask,
  CommunicationPlan,
  QualityCheck,
  HandoffItem,
  ProjectCloseout,
  ClientDeliveryPack,
  IntakeRequirement,
  MessageTemplate,
} from '../../types/delivery-system';
import type { ServiceDeliveryProfile } from '../../data/delivery-system/service-delivery-profiles';
import { SERVICE_DELIVERY_PROFILES, DEFAULT_DELIVERY_PROFILE } from '../../data/delivery-system/service-delivery-profiles';

function getProfile(profile: ServiceDeliveryProfile): ServiceDeliveryProfile {
  return profile;
}

/* ──────────────────────────────────────────────
   STEP 1 — Project Intake
   ────────────────────────────────────────────── */

export function composeProjectIntake(
  upstream: DeliveryUpstreamContext,
  profile: ServiceDeliveryProfile,
): Pick<ProjectIntake, 'kickoffQuestions' | 'dependencyChecklist'> {
  const questions = profile.kickoffQuestions.length > 0
    ? profile.kickoffQuestions
    : DEFAULT_DELIVERY_PROFILE.kickoffQuestions;

  const deps: IntakeRequirement[] = profile.dependencyChecklist.map((d, i) => ({
    id: `dep-${i + 1}`,
    label: d.label,
    category: d.category,
    status: 'pending' as const,
    notes: '',
    isCustom: false,
  }));

  return { kickoffQuestions: questions, dependencyChecklist: deps };
}

/* ──────────────────────────────────────────────
   STEP 2 — Scope Lock
   ────────────────────────────────────────────── */

export function composeScopeLock(
  upstream: DeliveryUpstreamContext,
): Pick<ScopeLock, 'includedWork' | 'excludedWork' | 'revisionAllowance' | 'successDefinition' | 'assumptions'> {
  const serviceId = upstream.serviceId || '';
  const profile = SERVICE_DELIVERY_PROFILES[serviceId] ?? DEFAULT_DELIVERY_PROFILE;

  const included = profile.scopeIncluded.length > 0
    ? profile.scopeIncluded
    : [`${upstream.serviceLabel} delivery as per agreed scope`];

  const excluded = profile.scopeExcluded.length > 0
    ? profile.scopeExcluded
    : ['Out-of-scope changes', 'Additional revision rounds beyond allowance'];

  const revisionAllowance = profile.revisionPolicy || `${upstream.revisionCount} rounds of revisions included`;

  const successDef = profile.successDefinition || `Project delivered on time meeting agreed specifications with no more than ${upstream.revisionCount} revision rounds.`;

  const assumptions = profile.assumptions.length > 0
    ? profile.assumptions
    : ['Client provides all required assets before work begins', 'Client responds to feedback requests within 48 hours'];

  return {
    includedWork: included,
    excludedWork: excluded,
    revisionAllowance,
    successDefinition: successDef,
    assumptions,
  };
}

/* ──────────────────────────────────────────────
   STEP 3 — Delivery Milestones
   ────────────────────────────────────────────── */

export function composeDeliveryMilestones(
  upstream: DeliveryUpstreamContext,
  profile: ServiceDeliveryProfile,
): DeliveryMilestone[] {
  const base = profile.milestones.length > 0 ? profile.milestones : DEFAULT_DELIVERY_PROFILE.milestones;

  return base.map((m, i) => ({
    id: `milestone-${i + 1}`,
    stage: m.stage,
    milestone: m.milestone,
    timing: m.timing,
    owner: m.owner,
    dependencies: i > 0 ? [`milestone-${i}`] : [],
    reviewPoint: i < base.length - 1 ? `Review after ${m.stage} completion` : 'Final review before delivery',
    clientActionDeadline: m.owner === 'client' ? m.timing : '',
    status: 'pending' as const,
    isCustom: false,
  }));
}

/* ──────────────────────────────────────────────
   STEP 3 — Execution Tasks
   ────────────────────────────────────────────── */

export function composeExecutionTasks(
  upstream: DeliveryUpstreamContext,
  profile: ServiceDeliveryProfile,
): ExecutionTask[] {
  const tasks = profile.executionTasks.length > 0 ? profile.executionTasks : DEFAULT_DELIVERY_PROFILE.executionTasks;

  return tasks.map((t, i) => ({
    id: `task-${i + 1}`,
    task: t.task,
    category: t.category,
    status: 'pending' as const,
    serviceSpecific: profile.id !== 'default',
    notes: '',
    isCustom: false,
  }));
}

/* ──────────────────────────────────────────────
   STEP 3 — Communication Plan
   ────────────────────────────────────────────── */

function buildMessageTemplate(
  id: string,
  label: string,
  channel: string,
  subject: string,
  body: string,
): MessageTemplate {
  return { id, label, channel, subject, body, isCustom: false };
}

const ALL_TEMPLATE_DEFS: { id: string; label: string; category: string; subjectTpl: string; bodyTpl: string }[] = [
  {
    id: 'msg-kickoff',
    label: 'Kickoff message',
    category: 'step5',
    subjectTpl: `Welcome — Let's Get Started on Your {{serviceLabel}} Project`,
    bodyTpl: `Hi there,\n\nThank you for choosing to work together. I am looking forward to delivering your {{serviceLabel}} project.\n\nHere is what to expect:\n- Timeline: {{deliveryTime}}\n- Revisions: {{revisionCount}} rounds included\n- Communication: {{channel}}\n\nPlease find the intake requirements and dependency checklist attached. Once we have everything we need, I will begin work.\n\nBest,\n[Your Name]`,
  },
  {
    id: 'msg-asset-request',
    label: 'Asset / access request',
    category: 'step5',
    subjectTpl: `Assets Needed — {{serviceLabel}} Project`,
    bodyTpl: `Hi there,\n\nTo proceed with the next phase, I need:\n\n[Missing asset 1]\n[Missing asset 2]\n\nPlease share these when you get a chance.\n\nThanks,\n[Your Name]`,
  },
  {
    id: 'msg-missing-info',
    label: 'Missing information reminder',
    category: 'step5',
    subjectTpl: `Information Needed — {{serviceLabel}} Project`,
    bodyTpl: `Hi there,\n\nA friendly reminder that I still need the following information to move forward:\n\n[Missing info 1]\n[Missing info 2]\n\nThis will help keep the project on schedule.\n\nThanks,\n[Your Name]`,
  },
  {
    id: 'msg-progress',
    label: 'Progress update',
    category: 'step5',
    subjectTpl: `Project Update — {{serviceLabel}} Progress`,
    bodyTpl: `Hi there,\n\nHere is a quick update on your project:\n\n[Progress summary]\n\nNext milestone: [Next milestone]\nExpected completion: [Date]\n\nLet me know if you have any questions.\n\nBest,\n[Your Name]`,
  },
  {
    id: 'msg-clarification',
    label: 'Clarification request',
    category: 'step5',
    subjectTpl: `Quick Question — {{serviceLabel}} Project`,
    bodyTpl: `Hi there,\n\nI have a quick question about [topic] to make sure I get this right:\n\n[Question]\n\nThis will help me move forward with the next phase.\n\nThanks,\n[Your Name]`,
  },
  {
    id: 'msg-delay',
    label: 'Delay / blocker notification',
    category: 'step5',
    subjectTpl: `Project Update — {{serviceLabel}} Delay Notice`,
    bodyTpl: `Hi there,\n\nI wanted to let you know about a delay on the project:\n\n[Blocker description]\nImpact: [Impact]\nProposed resolution: [Resolution]\n\nI will keep you updated as we work through this.\n\nBest,\n[Your Name]`,
  },
  {
    id: 'msg-action-reminder',
    label: 'Client action reminder',
    category: 'step5',
    subjectTpl: `Reminder — Action Needed on {{serviceLabel}} Project`,
    bodyTpl: `Hi there,\n\nThis is a friendly reminder that the following action is needed from you to keep things moving:\n\n[Action item]\nDeadline: [Date]\n\nPlease let me know if you have any questions.\n\nThanks,\n[Your Name]`,
  },
  {
    id: 'msg-milestone-review',
    label: 'Milestone review request',
    category: 'step6',
    subjectTpl: `Ready for Review — {{serviceLabel}} Milestone`,
    bodyTpl: `Hi there,\n\nThe [milestone name] is now ready for your review.\n\nPlease take a look and let me know:\n- Does this meet your expectations?\n- Any adjustments needed?\n\nI look forward to your feedback.\n\nBest,\n[Your Name]`,
  },
  {
    id: 'msg-feedback-request',
    label: 'Structured feedback request',
    category: 'step6',
    subjectTpl: `Feedback Request — {{serviceLabel}} Project`,
    bodyTpl: `Hi there,\n\nI would love your feedback on the latest deliverable:\n\nFocus area: [Focus]\nSpecific questions:\n1. [Question 1]\n2. [Question 2]\n\nPlease share your thoughts by [deadline].\n\nThanks,\n[Your Name]`,
  },
  {
    id: 'msg-revision-confirmation',
    label: 'Revision confirmation',
    category: 'step6',
    subjectTpl: `Revision Received — {{serviceLabel}} Project`,
    bodyTpl: `Hi there,\n\nThank you for your revision request. Here is what I understand you would like changed:\n\n[Revision description]\n\nThis has been classified as [included/out of scope]. I will update you once the revision is complete.\n\nBest,\n[Your Name]`,
  },
  {
    id: 'msg-out-of-scope',
    label: 'Out-of-scope response',
    category: 'step6',
    subjectTpl: `Scope Note — {{serviceLabel}} Project`,
    bodyTpl: `Hi there,\n\nRegarding your request for [change description]:\n\nAfter reviewing, this falls outside the agreed scope. Here are your options:\n1. Include as a paid add-on\n2. Handle in a future project\n3. Other arrangement\n\nLet me know how you would like to proceed.\n\nBest,\n[Your Name]`,
  },
  {
    id: 'msg-timeline-confirmation',
    label: 'Revised timeline confirmation',
    category: 'step6',
    subjectTpl: `Updated Timeline — {{serviceLabel}} Project`,
    bodyTpl: `Hi there,\n\nBased on recent changes, here is the updated project timeline:\n\n- Previous target: [Old date]\n- Revised target: [New date]\n\nReason for change: [Reason]\n\nLet me know if this works for you.\n\nBest,\n[Your Name]`,
  },
  {
    id: 'msg-final-approval',
    label: 'Final approval request',
    category: 'step7',
    subjectTpl: `Final Review — {{serviceLabel}} Project Complete`,
    bodyTpl: `Hi there,\n\nYour {{serviceLabel}} project is complete and ready for final review.\n\nPlease confirm that everything meets your expectations so I can proceed with delivery.\n\nBest,\n[Your Name]`,
  },
  {
    id: 'msg-final-delivery',
    label: 'Final delivery message',
    category: 'step7',
    subjectTpl: `Delivered — {{serviceLabel}} Project Complete`,
    bodyTpl: `Hi there,\n\nI am pleased to share that your {{serviceLabel}} project is now complete and delivered.\n\nYou can find all deliverables here: [link]\n\nThank you for the opportunity to work together. I hope this delivers great results for you.\n\nBest,\n[Your Name]`,
  },
  {
    id: 'msg-payment-reminder',
    label: 'Final payment reminder',
    category: 'step7',
    subjectTpl: `Payment Reminder — {{serviceLabel}} Project`,
    bodyTpl: `Hi there,\n\nJust a quick reminder about the final payment for your {{serviceLabel}} project.\n\nAmount: [Amount]\nDue: [Date]\nPayment method: [Method]\n\nPlease let me know when it has been sent.\n\nThanks,\n[Your Name]`,
  },
  {
    id: 'msg-testimonial',
    label: 'Testimonial request',
    category: 'step7',
    subjectTpl: `Love to Hear Your Feedback — {{serviceLabel}} Project`,
    bodyTpl: `Hi there,\n\nI hope you are loving the results of your {{serviceLabel}} project.\n\nIf you have a moment, I would greatly appreciate a short testimonial about your experience working together. Your words help others decide if I am the right fit for them.\n\nIf you are open to it, I can send a quick form or you can reply directly with a few sentences.\n\nThank you so much!\n\nBest,\n[Your Name]`,
  },
  {
    id: 'msg-referral',
    label: 'Referral request',
    category: 'step7',
    subjectTpl: `Do You Know Someone Who Needs {{serviceLabel}} Help?`,
    bodyTpl: `Hi there,\n\nThank you again for a great collaboration on your {{serviceLabel}} project.\n\nIf you know anyone else who could benefit from similar work, I would be honored if you passed along my name. Referrals are the highest compliment I can receive.\n\nWarmly,\n[Your Name]`,
  },
  {
    id: 'msg-repeat-work',
    label: 'Repeat work proposal',
    category: 'step7',
    subjectTpl: `Let's Keep the Momentum Going — {{serviceLabel}}`,
    bodyTpl: `Hi there,\n\nNow that your {{serviceLabel}} project is complete, I would love to discuss how we can continue working together.\n\nA few ideas:\n- Ongoing retainer for regular {{serviceLabel}} work\n- Next project at a preferred rate\n- Monthly check-ins to keep things fresh\n\nLet me know if you are interested.\n\nBest,\n[Your Name]`,
  },
];

function resolveTemplate(id: string, channel: string, upstream: DeliveryUpstreamContext): MessageTemplate {
  const def = ALL_TEMPLATE_DEFS.find((d) => d.id === id);
  if (!def) {
    return { id, label: id, channel, subject: '', body: '', isCustom: false };
  }
  const vars: Record<string, string> = {
    serviceLabel: upstream.serviceLabel,
    deliveryTime: upstream.deliveryTime,
    revisionCount: String(upstream.revisionCount),
    channel,
  };
  const subject = def.subjectTpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `[${k}]`);
  const body = def.bodyTpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `[${k}]`);
  return { id: def.id, label: def.label, channel, subject, body, isCustom: false };
}

export function composeCommunicationPlan(
  upstream: DeliveryUpstreamContext,
): CommunicationPlan {
  const serviceId = upstream.serviceId || '';
  const profile = SERVICE_DELIVERY_PROFILES[serviceId] ?? DEFAULT_DELIVERY_PROFILE;
  const channel = profile.communicationPreferences.method;
  const frequency = profile.communicationPreferences.frequency;

  return {
    cadence: `Updates ${frequency.toLowerCase()}`,
    updateFrequency: frequency,
    preferredChannel: channel,
    escalationContact: upstream.offerName || 'Project lead',
    templateLibrary: ALL_TEMPLATE_DEFS.map((def) => resolveTemplate(def.id, channel, upstream)),
    isCommunicationCustom: false,
  };
}

/* ──────────────────────────────────────────────
   STEP 3 — QA Checks
   ────────────────────────────────────────────── */

export function composeQaChecks(profile: ServiceDeliveryProfile): QualityCheck[] {
  const checks = profile.qualityChecks.length > 0 ? profile.qualityChecks : DEFAULT_DELIVERY_PROFILE.qualityChecks;

  return checks.map((c, i) => ({
    id: `qa-${i + 1}`,
    check: c.check,
    category: c.category,
    status: 'pending' as const,
    notes: '',
    isCustom: false,
  }));
}

/* ──────────────────────────────────────────────
   STEP 3 — Handoff Items
   ────────────────────────────────────────────── */

export function composeHandoffItems(profile: ServiceDeliveryProfile): HandoffItem[] {
  const items = profile.handoffItems.length > 0 ? profile.handoffItems : DEFAULT_DELIVERY_PROFILE.handoffItems;

  return items.map((h, i) => ({
    id: `handoff-${i + 1}`,
    item: h.item,
    type: h.type,
    status: 'pending' as const,
    notes: '',
    isCustom: false,
  }));
}

/* ──────────────────────────────────────────────
   STEP 3 — Closeout
   ────────────────────────────────────────────── */

export function composeCloseout(
  upstream: DeliveryUpstreamContext,
): Pick<ProjectCloseout, 'deliveryMessage' | 'repeatWorkPathway'> {
  const serviceId = upstream.serviceId || '';
  const profile = SERVICE_DELIVERY_PROFILES[serviceId] ?? DEFAULT_DELIVERY_PROFILE;

  return {
    deliveryMessage: profile.deliveryMessage || `Your ${upstream.serviceLabel} project is complete. Thank you for the opportunity to work together.`,
    repeatWorkPathway: profile.repeatWorkPathway || `Let us discuss ongoing ${upstream.serviceLabel} work — a retainer or recurring project arrangement.`,
  };
}

/* ──────────────────────────────────────────────
   COMPILE DELIVERY PACK
   ────────────────────────────────────────────── */

export function compileDeliveryPack(state: DeliverySystemState): ClientDeliveryPack {
  const context = state.upstream;
  const profile = SERVICE_DELIVERY_PROFILES[context?.serviceId ?? ''] ?? DEFAULT_DELIVERY_PROFILE;

  const serviceLabel = context?.serviceLabel || 'Service';
  const clientName = state.projectContext.clientName || 'Client';
  const projectName = state.projectContext.projectName || serviceLabel;

  const unresolved = state.projectIntake.dependencyChecklist
    .filter((d) => d.status !== 'ready')
    .map((d) => `${d.label} (${d.status})`);

  const revisionSummary = state.revisionRecords.length > 0
    ? state.revisionRecords.map((r) => `${r.description} — ${r.status}`)
    : [];

  const nextActions: string[] = [];
  if (state.currentStep !== 'handoff_closeout') {
    nextActions.push(`Complete the ${DELIVERY_STEP_LABELS[state.currentStep] || state.currentStep} step`);
  }
  if (unresolved.length > 0) {
    nextActions.push('Resolve outstanding dependency items');
  }
  if (state.closeout.completionConfirmed) {
    nextActions.push(state.closeout.referralRequested ? 'Follow up on referral' : 'Request referral');
  }

  return {
    projectSummary: `${projectName} — ${serviceLabel} delivery for ${clientName}`,
    clientGoals: state.projectContext.clientGoals,
    intakeStatus: state.projectIntake.readyToStart ? 'Ready to start' : 'Awaiting dependencies',
    unresolvedDependencies: unresolved,
    scopeLock: state.scopeLock,
    successDefinition: state.successDefinition,
    revisionPolicy: state.scopeLock.revisionAllowance,
    scopeChangeProcess: state.scopeLock.scopeChangeProcess,
    milestones: state.milestones,
    timeline: state.projectContext.agreedTimeline,
    reviewPoints: state.milestones.map((m) => m.reviewPoint),
    clientActionDeadlines: state.milestones
      .filter((m) => m.clientActionDeadline)
      .map((m) => `${m.milestone}: ${m.clientActionDeadline}`),
    executionWorkflow: state.executionTasks.map((t) => t.task).join(', '),
    progressEvidence: [],
    communicationPlan: state.communicationPlan,
    messageTemplates: state.communicationPlan.templateLibrary,
    feedbackWorkflow: `${state.communicationPlan.updateFrequency} — use ${state.communicationPlan.preferredChannel} for feedback`,
    revisionRecords: state.revisionRecords,
    serviceQA: state.qaChecks,
    handoffChecklist: state.handoffItems,
    documentationNotes: 'See handoff items for delivered files and credentials.',
    finalDeliveryMessage: state.closeout.deliveryMessage,
    paymentStatusReminder: state.projectContext.paymentStatus === 'paid' ? 'Payment received' : `Payment: ${state.projectContext.paymentStatus}`,
    testimonialRequest: state.closeout.testimonialRequested ? 'Testimonial requested' : 'Testimonial not yet requested',
    referralRequest: state.closeout.referralRequested ? 'Referral requested' : 'Referral not yet requested',
    repeatWorkPathway: state.closeout.repeatWorkPathway,
    risks: state.blockers.map((b) => `${b.description} (${b.status})`),
    nextActions,
  };
}

const DELIVERY_STEP_LABELS: Record<string, string> = {
  project_intake: 'Project Intake',
  scope_success: 'Scope & Success Definition',
  delivery_plan: 'Delivery Plan',
  execution_workspace: 'Execution Workspace',
  communication_updates: 'Communication & Updates',
  feedback_revision: 'Feedback & Revision',
  handoff_closeout: 'Handoff & Closeout',
};
