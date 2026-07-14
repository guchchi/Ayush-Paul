/**
 * Angle Generator — Deterministic personalization angle generation
 *
 * Pure function. No store access. No React. No Date.now(). No random values.
 * Consumes GeneratorContext (derived from Module6UpstreamContext).
 */

import type { PersonalizationAngle, AngleType } from '../../types/outreach-engine-system';
import type { GeneratorContext } from './generation-context';

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Determine if a visible problem is too weak for specific reference */
function isWeakProblem(text: string): boolean {
  const t = (text ?? '').trim();
  if (t.length < 12) return true;
  const weak = ['h', 'kh', 'hk', 'test', 'abc', 'xyz', 'random', 'asd', 'qwe', 'hkh', 'dfg'];
  return weak.some((w) => t.toLowerCase() === w);
}

/** Pick the most relevant buying signal for a visible problem */
function matchBuyingSignal(
  ctx: GeneratorContext,
): { signal: string; whyItMatters: string } | undefined {
  const problem = ctx.prospect.visibleProblem.toLowerCase();
  const signals = ctx.prospectStrategy.buyingSignals;

  if (signals.length === 0) return undefined;

  // Score signals by keyword overlap with visible problem
  const scored = signals.map((s) => {
    const signalWords = s.signal.toLowerCase().split(/\s+/);
    const problemWords = new Set(problem.split(/\s+/));
    const overlap = signalWords.filter((w) => problemWords.has(w)).length;
    return { signal: s, score: overlap };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].score > 0 ? scored[0].signal : signals[0];
}

/** Format deliverables as a readable short summary */
function deliverablesSummary(deliverables: readonly string[]): string {
  if (deliverables.length === 0) return '';
  if (deliverables.length === 1) return deliverables[0];
  if (deliverables.length === 2) return deliverables.join(' and ');
  return deliverables.slice(0, -1).join(', ') + ', and ' + deliverables[deliverables.length - 1];
}

/* ──────────────────────────────────────────────
   Angle builders
   ────────────────────────────────────────────── */

function buildProblemFirstAngle(ctx: GeneratorContext): PersonalizationAngle {
  const { visibleProblem, name, platform } = ctx.prospect;
  const { positioning, deliverables, uniqueMechanism } = ctx.strategy;
  const signal = matchBuyingSignal(ctx);

  const raw = isWeakProblem(visibleProblem)
    ? 'an opportunity to improve how things are presented'
    : visibleProblem;

  const problemRef = truncate(raw, 100).toLowerCase();
  const signalRef = signal ? ` — ${truncate(signal.signal, 80)}` : '';
  const offerRef = positioning || deliverablesSummary(deliverables) || uniqueMechanism || '';

  const hook = offerRef
    ? `I noticed ${problemRef}${signalRef}. My work focuses on ${truncate(offerRef, 80)}, and this specific area is where I tend to see the clearest opportunities. Would it be useful if I shared a few thoughts?`
    : `I noticed ${problemRef}${signalRef}. Would it be useful if I shared a few thoughts?`;

  const why = `Directly references ${truncate(raw, 60)} and connects it to your offer (${truncate(offerRef || 'your expertise', 50)}). Good for prospects who respond to specific, relevant observations.`;

  return {
    id: 'angle-problem-first',
    angleName: 'Problem-First Angle',
    angleType: 'problem_first',
    messageHook: hook,
    whyItFits: why,
    bestChannel: platform ? [platform, 'Email'] : ['LinkedIn DM', 'Email'],
    riskLevel: 'Low',
    selected: false,
  };
}

function buildQuickWinAngle(ctx: GeneratorContext): PersonalizationAngle {
  const { visibleProblem, name, priority } = ctx.prospect;
  const { deliverables, positioning, uniqueMechanism } = ctx.strategy;

  const problemRef = isWeakProblem(visibleProblem)
    ? 'how things could be improved'
    : truncate(visibleProblem, 70).toLowerCase();

  const offerRef = deliverablesSummary(deliverables) || positioning || uniqueMechanism || '';
  const scopeHint = offerRef ? ` within the scope of ${truncate(offerRef, 60)}` : '';

  const hook = `I had a couple of thoughts that could help with ${problemRef}${scopeHint}. Happy to share if useful — no commitment needed.`;

  const priorityNote = priority === 'high'
    ? ' This prospect matched with high priority — a quick-win angle can move fast.'
    : priority === 'low'
      ? ' Lower-pressure ask suitable for this prospect profile.'
      : '';

  const why = `Offers immediate value without asking for commitment.${priorityNote} Best for prospects who respond to low-pressure, value-first outreach.`;

  return {
    id: 'angle-quick-win',
    angleName: 'Quick-Win Angle',
    angleType: 'quick_win',
    messageHook: hook,
    whyItFits: why,
    bestChannel: ['LinkedIn DM', 'Email', 'Instagram/Twitter DM'],
    riskLevel: 'Low',
    selected: false,
  };
}

function buildSampleProjectAngle(ctx: GeneratorContext): PersonalizationAngle | null {
  if (!ctx.proof.available) return null;

  const { name, visibleProblem } = ctx.prospect;
  const { featuredProofTitle, featuredProofUrl } = ctx.proof;

  const proofRef = featuredProofTitle || '';
  const problemRef = isWeakProblem(visibleProblem)
    ? 'this type of challenge'
    : truncate(visibleProblem, 80).toLowerCase();

  const hook = proofRef
    ? `I worked on a project called "${proofRef}" that connects closely to ${problemRef}. Would it be useful if I shared how it was approached?`
    : `I have a relevant project that connects to ${problemRef}. Would it be useful if I shared the approach?`;

  const why = `Lets your actual work speak. Best when you have proof that genuinely relates to the prospect's situation.${featuredProofTitle ? ` Uses "${featuredProofTitle}" as the anchor.` : ''}`;

  const channels = featuredProofUrl
    ? ['Email', 'LinkedIn DM']
    : ['LinkedIn DM', 'Email'];

  return {
    id: 'angle-sample-project',
    angleName: 'Sample Project Angle',
    angleType: 'sample_project',
    messageHook: hook,
    whyItFits: why,
    bestChannel: channels,
    riskLevel: 'Low',
    selected: false,
  };
}

function buildPermissionBasedAngle(ctx: GeneratorContext): PersonalizationAngle {
  const { visibleProblem, name, platform, contactAvailable } = ctx.prospect;

  const problemRef = isWeakProblem(visibleProblem)
    ? 'how things are presented'
    : truncate(visibleProblem, 60).toLowerCase();

  const hook = `Would it be useful if I sent a quick thought on ${problemRef}? No pitch — just an observation from what I noticed.`;

  const why = `Ultra-soft opener. Respectful and easy to accept. Best for cold outreach${!contactAvailable ? ' where direct contact is not available' : ''}, or when you want to test interest before investing more effort.`;

  const ch = ['LinkedIn DM', 'Instagram/Twitter DM', 'Community Message'];
  if (contactAvailable && platform) ch.unshift(platform);

  return {
    id: 'angle-permission-based',
    angleName: 'Permission-Based Angle',
    angleType: 'permission_based',
    messageHook: hook,
    whyItFits: why,
    bestChannel: ch,
    riskLevel: 'Very Low',
    selected: false,
  };
}

function buildAuditAngle(ctx: GeneratorContext): PersonalizationAngle | null {
  const { visibleProblem, name } = ctx.prospect;
  const { deliverables, positioning } = ctx.strategy;

  // Only generate audit angle if deliverables genuinely support review/audit language
  const deliverableText = deliverables.join(' ').toLowerCase();
  const supportsAudit =
    deliverableText.includes('review') ||
    deliverableText.includes('audit') ||
    deliverableText.includes('analysis') ||
    deliverableText.includes('optim') ||
    deliverableText.includes('test') ||
    deliverableText.includes('check') ||
    (positioning ?? '').toLowerCase().includes('audit') ||
    (positioning ?? '').toLowerCase().includes('review');

  if (!supportsAudit && deliverables.length > 0) return null;

  const problemRef = isWeakProblem(visibleProblem)
    ? 'what I noticed'
    : truncate(visibleProblem, 80).toLowerCase();
  const deliverableRef = deliverablesSummary(deliverables);

  const hook = deliverableRef
    ? `I can send a short review focusing on ${problemRef} through the lens of ${truncate(deliverableRef, 60)} — a few specific observations, no fluff. Would that be useful?`
    : `I can send a short 3-point review of ${problemRef} if that would be useful.`;

  const why = `Positions you as helpful and analytical. Good for prospects who want to see your thinking before committing.`;

  return {
    id: 'angle-audit',
    angleName: 'Audit Angle',
    angleType: 'audit',
    messageHook: hook,
    whyItFits: why,
    bestChannel: ['Email', 'LinkedIn DM', 'Website Contact Form'],
    riskLevel: 'Medium',
    selected: false,
  };
}

function buildSoftConversationAngle(ctx: GeneratorContext): PersonalizationAngle {
  const { visibleProblem, name, platform, notes, nicheFit } = ctx.prospect;
  const { authorityPosition, niche } = ctx.strategy;

  const noteRef = notes ? truncate(notes, 60) : '';
  const authorityRef = authorityPosition || '';

  const base = isWeakProblem(visibleProblem)
    ? 'how things are going with your work'
    : `improving ${truncate(visibleProblem, 50).toLowerCase()}`;

  const hook = noteRef
    ? `I came across your work${nicheFit ? ` in the ${nicheFit} space` : ''} and noticed ${noteRef.toLowerCase()}. Are you currently focused on improving this area?`
    : `Are you currently working on ${base}?`;

  const why = `Starts a natural conversation without any ask.${authorityRef ? ` Your authority position (${truncate(authorityRef, 40)}) adds context to why you're reaching out.` : ''} Best for cold outreach or when you want to build rapport first.`;

  return {
    id: 'angle-soft-conversation',
    angleName: 'Soft Conversation Angle',
    angleType: 'soft_conversation',
    messageHook: hook,
    whyItFits: why,
    bestChannel: ['LinkedIn DM', 'Instagram/Twitter DM', 'Community Message'],
    riskLevel: 'Very Low',
    selected: false,
  };
}

/* ──────────────────────────────────────────────
   Main generator
   ────────────────────────────────────────────── */

export function generateAngles(ctx: GeneratorContext): PersonalizationAngle[] {
  const angles: PersonalizationAngle[] = [];

  angles.push(buildProblemFirstAngle(ctx));
  angles.push(buildQuickWinAngle(ctx));
  angles.push(buildPermissionBasedAngle(ctx));
  angles.push(buildSoftConversationAngle(ctx));

  // Sample project angle — only when proof is available
  const sampleAngle = buildSampleProjectAngle(ctx);
  if (sampleAngle) angles.push(sampleAngle);

  // Audit angle — only when deliverables support it
  const auditAngle = buildAuditAngle(ctx);
  if (auditAngle) angles.push(auditAngle);

  return angles;
}
