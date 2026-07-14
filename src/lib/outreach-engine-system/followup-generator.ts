/**
 * Follow-Up Generator — Deterministic follow-up sequence generation
 *
 * Pure function. No store access. No React. No Date.now(). No random values.
 * Builds on the original angle, message strategy, and prospect context.
 */

import type { FollowUpMessage } from '../../types/outreach-engine-system';
import type { GeneratorContext } from './generation-context';

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

function isWeakProblem(text: string): boolean {
  const t = (text ?? '').trim();
  if (t.length < 12) return true;
  const weak = ['h', 'kh', 'hk', 'test', 'abc', 'xyz', 'random', 'asd', 'qwe', 'hkh', 'dfg'];
  return weak.some((w) => t.toLowerCase() === w);
}

/** Compute follow-up timing based on prospect priority and channel */
function computeTiming(
  priority: 'high' | 'medium' | 'low',
  platform: string,
  step: 1 | 2 | 3,
): string {
  const isEmail = platform.toLowerCase().includes('email');

  let baseDays: number;
  if (priority === 'high') {
    baseDays = isEmail ? 2 : 2;
  } else if (priority === 'medium') {
    baseDays = isEmail ? 3 : 3;
  } else {
    baseDays = isEmail ? 4 : 5;
  }

  const offsets: Record<number, number> = { 1: 0, 2: baseDays + 2, 3: baseDays + 7 };
  const days = offsets[step];

  if (days <= 2) return '2–3 days after first message';
  if (days <= 4) return '3–5 days after first message';
  if (days <= 7) return '5–7 days after first message';
  if (days <= 9) return '7–10 days after first message';
  return '10–14 days after first message';
}

/* ──────────────────────────────────────────────
   Follow-up builders
   ────────────────────────────────────────────── */

function buildFollowUp1(ctx: GeneratorContext): FollowUpMessage {
  const { name, visibleProblem, priority } = ctx.prospect;
  const problemRef = isWeakProblem(visibleProblem)
    ? 'improving how things are presented'
    : truncate(visibleProblem, 60).toLowerCase();
  const { positioning, deliverables } = ctx.strategy;
  const angleType = ctx.selectedAngle?.angleType ?? '';

  const offerRef = truncate(positioning || deliverables.join(', ') || '', 60);

  const message = offerRef
    ? `Hey ${name}, quick follow-up on my note about ${problemRef}. ${offerRef ? `My approach to ${offerRef} may be relevant here.` : ''} Happy to share a few thoughts if useful.`
    : `Hey ${name}, quick follow-up on my note about ${problemRef}. Happy to share the thoughts if useful.`;

  return {
    id: 'followup-1',
    sequenceStep: 1,
    label: 'Gentle Reminder',
    timing: computeTiming(priority, ctx.prospect.platform, 1),
    message,
    purpose: 'Politely bring the conversation back without pressure.',
    tone: 'Friendly',
    riskLevel: 'Low',
  };
}

function buildFollowUp2(ctx: GeneratorContext): FollowUpMessage {
  const { name, visibleProblem, nicheFit, priority } = ctx.prospect;
  const { positioning, deliverables, uniqueMechanism, authorityPosition } = ctx.strategy;
  const { proof } = ctx;

  const problemRef = isWeakProblem(visibleProblem)
    ? 'this area'
    : truncate(visibleProblem, 50).toLowerCase();

  // Build a useful micro-insight based on positioning, unique mechanism, or deliverables
  const insight = uniqueMechanism
    ? truncate(uniqueMechanism, 120)
    : positioning
      ? `One thing I have found: ${truncate(positioning, 100).toLowerCase()}`
      : deliverables.length > 0
        ? `A practical thought on ${truncate(deliverables[0], 60).toLowerCase()} — small improvements here often create noticeable shifts.`
        : '';

  // Proof connection for second follow-up when available
  const proofLine = proof.available && proof.featuredProofTitle
    ? ` I also have a project ("${proof.featuredProofTitle}") that connects to ${problemRef}.`
    : '';

  const message = insight
    ? `One quick thought: ${insight}.${proofLine} No pressure, just wanted to share in case it is helpful.`
    : `Just wanted to circle back in case the timing was not right.${proofLine} Happy to share more if useful.`;

  return {
    id: 'followup-2',
    sequenceStep: 2,
    label: 'Value Add',
    timing: computeTiming(priority, ctx.prospect.platform, 2),
    message,
    purpose: 'Add one useful insight or relevant context without asking for a reply.',
    tone: 'Friendly',
    riskLevel: 'Low',
  };
}

function buildFollowUp3(ctx: GeneratorContext): FollowUpMessage {
  const { name, visibleProblem, priority } = ctx.prospect;
  const { proof } = ctx;

  const problemRef = isWeakProblem(visibleProblem)
    ? 'this'
    : truncate(visibleProblem, 40).toLowerCase();

  const proofRef = proof.available && proof.featuredProofTitle
    ? `the "${proof.featuredProofTitle}" project`
    : 'a few thoughts';

  const message = `No worries if this is not a priority right now. I will leave it here, but happy to share ${proofRef} later if it becomes useful. Feel free to reach out anytime.`;

  return {
    id: 'followup-3',
    sequenceStep: 3,
    label: 'Close the Loop',
    timing: computeTiming(priority, ctx.prospect.platform, 3),
    message,
    purpose: 'Politely end the sequence and leave the door open for future contact.',
    tone: 'Friendly',
    riskLevel: 'Very Low',
  };
}

/* ──────────────────────────────────────────────
   Main generator
   ────────────────────────────────────────────── */

export function generateFollowUpSequence(ctx: GeneratorContext): FollowUpMessage[] {
  return [
    buildFollowUp1(ctx),
    buildFollowUp2(ctx),
    buildFollowUp3(ctx),
  ];
}
