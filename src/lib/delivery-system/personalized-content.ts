import type { DeliveryUpstreamContext, DeliverySystemState } from '../../types/delivery-system';
import type { ServiceDeliveryProfile } from '../../data/delivery-system/service-delivery-profiles';
import { SERVICE_DELIVERY_PROFILES, DEFAULT_DELIVERY_PROFILE } from '../../data/delivery-system/service-delivery-profiles';

/* ──────────────────────────────────────────────
   STEP 1 — Intake Helper Text
   ────────────────────────────────────────────── */

export function getIntakeHelperText(
  upstream: DeliveryUpstreamContext,
  profile: ServiceDeliveryProfile,
): { title: string; description: string; examples: string[] } {
  const serviceLabel = upstream.serviceLabel || 'service';
  const marketLabel = upstream.marketLabel?.toLowerCase() || 'client';

  const title = `Kick Off Your ${serviceLabel} Project`;
  const description = `Set up the foundation for your ${serviceLabel} delivery. Share these questions and requirements with ${marketLabel} to ensure a smooth start.`;

  const examples = profile.kickoffQuestions.length > 0
    ? profile.kickoffQuestions.slice(0, 3)
    : [
        `What are the specific deliverables for this ${serviceLabel} project?`,
        `What timeline are you working toward?`,
        `Do you have brand references or style guides?`,
      ];

  return { title, description, examples };
}

/* ──────────────────────────────────────────────
   STEP 2 — Scope Helper Text
   ────────────────────────────────────────────── */

export function getScopeHelperText(upstream: DeliveryUpstreamContext): string {
  const serviceLabel = upstream.serviceLabel || 'service';
  const offerName = upstream.offerName || serviceLabel;

  return `Define what is included and excluded for "${offerName}". A clear scope prevents scope creep and sets expectations for both you and your client. Include revision limits, success criteria, and key assumptions.`;
}

/* ──────────────────────────────────────────────
   STEP 3 — Milestone Helper Text
   ────────────────────────────────────────────── */

export function getMilestoneHelperText(profile: ServiceDeliveryProfile): string {
  const steps = profile.milestones.length > 0
    ? profile.milestones.map((m) => m.milestone).join(' → ')
    : 'Kickoff → Execution → Review → Delivery';

  return `Break your delivery into clear stages so you and your client know what to expect and when. Typical flow: ${steps}. Adjust timing and owners based on your specific arrangement.`;
}

/* ──────────────────────────────────────────────
   STEP 3 — Execution Helper Text
   ────────────────────────────────────────────── */

export function getExecutionHelperText(profile: ServiceDeliveryProfile): string {
  return `These are the execution steps required to complete this delivery. Mark each task as you progress through it. Add or remove tasks based on the specific project needs.`;
}

/* ──────────────────────────────────────────────
   STEP 3 — Communication Helper Text
   ────────────────────────────────────────────── */

export function getCommunicationHelperText(upstream: DeliveryUpstreamContext): string {
  const channel = upstream.communicationMethod || 'email';
  const frequency = upstream.deliveryTime || 'the project timeline';

  return `Set up your communication templates so every update is professional and consistent. Preferred channel: ${channel}. Recommended cadence: updates every ${frequency.toLowerCase()}. Customise each template before sending.`;
}

/* ──────────────────────────────────────────────
   STEP 3 — QA Helper Text
   ────────────────────────────────────────────── */

export function getQAHelperText(profile: ServiceDeliveryProfile): string {
  return `Run through these quality checks before delivering to your client. Each check ensures your work meets professional standards. Add project-specific checks as needed.`;
}

/* ──────────────────────────────────────────────
   STEP 3 — Handoff Helper Text
   ────────────────────────────────────────────── */

export function getHandoffHelperText(profile: ServiceDeliveryProfile): string {
  return `Prepare everything your client needs to use and manage the delivered work. Mark each item as ready when it is prepared. Missing handoff items can cause confusion after delivery.`;
}

/* ──────────────────────────────────────────────
   PACK SUMMARY
   ────────────────────────────────────────────── */

export function getPackSummary(state: DeliverySystemState): string {
  const context = state.upstream;
  const projectName = state.projectContext.projectName || context?.serviceLabel || 'Project';
  const clientName = state.projectContext.clientName || 'Client';

  const milestoneProgress = state.milestones.filter((m) => m.status === 'ready').length;
  const taskProgress = state.executionTasks.filter((t) => t.status === 'ready').length;
  const qaProgress = state.qaChecks.filter((q) => q.status === 'ready').length;
  const handoffProgress = state.handoffItems.filter((h) => h.status === 'ready').length;

  const lines: string[] = [
    `**${projectName}** — Delivery for ${clientName}`,
    `Status: ${state.projectContext.projectStatus}`,
    `Current step: ${state.currentStep.replace(/_/g, ' ')}`,
    `Milestones: ${milestoneProgress}/${state.milestones.length} complete`,
    `Tasks: ${taskProgress}/${state.executionTasks.length} complete`,
    `QA checks: ${qaProgress}/${state.qaChecks.length} passed`,
    `Handoff items: ${handoffProgress}/${state.handoffItems.length} ready`,
  ];

  if (state.blockers.length > 0) {
    const open = state.blockers.filter((b) => b.status === 'open').length;
    lines.push(`Blockers: ${open} open`);
  }

  if (state.closeout.completionConfirmed) {
    lines.push(`Project completed: Yes`);
  }

  return lines.join('\n');
}
