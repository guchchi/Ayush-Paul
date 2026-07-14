/**
 * Message Generator — Deterministic message draft generation
 *
 * Pure function. No store access. No React. No Date.now(). No random values.
 * The selected angle's messageHook MUST materially shape the output.
 */

import type { MessageDraft, MessageChannel } from '../../types/outreach-engine-system';
import type { GeneratorContext, } from './generation-context';
import { pickCtaStyle } from './generation-context';

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

/** Build a natural observation sentence from the visible problem */
function buildObservation(ctx: GeneratorContext): string {
  const { visibleProblem } = ctx.prospect;
  const { positioning, deliverables } = ctx.strategy;

  if (isWeakProblem(visibleProblem)) {
    return 'there may be an opportunity to improve how things are presented';
  }

  const trimmed = visibleProblem.trim().replace(/\.+$/, '');
  return trimmed;
}

/** Build proof reference when available and relevant */
function buildProofRef(ctx: GeneratorContext, channel: MessageChannel): string {
  if (!ctx.proof.available) return '';

  const { featuredProofTitle, featuredProofUrl } = ctx.proof;
  const { visibleProblem } = ctx.prospect;

  if (!featuredProofTitle) return '';

  const problemRef = isWeakProblem(visibleProblem)
    ? 'this area'
    : truncate(visibleProblem, 60).toLowerCase();

  if (channel === 'email' && featuredProofUrl) {
    return `I have a project called "${featuredProofTitle}" that connects to ${problemRef}. You can see it here: ${featuredProofUrl}`;
  }

  if (channel === 'linkedin_dm' && featuredProofUrl) {
    return `I have a project called "${featuredProofTitle}" that connects to ${problemRef}. Happy to share the approach if useful.`;
  }

  return `I have a project called "${featuredProofTitle}" that connects to ${problemRef}.`;
}

/* ──────────────────────────────────────────────
   Channel-specific message builders
   ────────────────────────────────────────────── */

function buildLinkedInDm(ctx: GeneratorContext): string {
  const { name } = ctx.prospect;
  const hook = ctx.selectedAngle?.messageHook ?? '';
  const observation = buildObservation(ctx);
  const proofRef = buildProofRef(ctx, 'linkedin_dm');
  const cta = pickCtaStyle(ctx, 'medium');

  const parts: string[] = [`Hey ${name},`];

  if (hook) {
    // Use the angle's hook as the main body
    parts.push(hook);
  } else {
    parts.push(`I noticed ${observation}.`);
  }

  if (proofRef && !hook.includes(featuredProofTitle(ctx))) {
    parts.push(proofRef);
  }

  parts.push(cta);

  return parts.join('\n\n');
}

function featuredProofTitle(ctx: GeneratorContext): string {
  return ctx.proof.featuredProofTitle ?? '';
}

function buildEmail(ctx: GeneratorContext): string {
  const { name, visibleProblem, platform } = ctx.prospect;
  const hook = ctx.selectedAngle?.messageHook ?? '';
  const observation = buildObservation(ctx);
  const proofRef = buildProofRef(ctx, 'email');
  const { positioning, deliverables, uniqueMechanism } = ctx.strategy;
  const cta = pickCtaStyle(ctx, 'medium');

  const intro = platform
    ? `Hi ${name},`
    : `Hi ${name},`;

  const contextLine = platform
    ? `I came across your work${platform ? ` on ${platform}` : ''} and noticed ${observation}.`
    : `I noticed ${observation}.`;

  const parts: string[] = [intro, contextLine];

  if (hook && !hook.includes(observation)) {
    parts.push(hook);
  }

  if (proofRef) {
    parts.push(proofRef);
  }

  // Add unique mechanism where natural
  if (uniqueMechanism && !hook.includes(uniqueMechanism)) {
    parts.push(truncate(uniqueMechanism, 120));
  }

  parts.push(cta);

  return parts.join('\n\n');
}

function buildSocialDm(ctx: GeneratorContext): string {
  const observation = buildObservation(ctx);
  const proofRef = buildProofRef(ctx, 'instagram_twitter_dm');
  const hook = ctx.selectedAngle?.messageHook ?? '';
  const cta = pickCtaStyle(ctx, 'low');

  const main = hook
    ? truncate(hook.replace(/^Hey [^,]*,?\s*/i, ''), 280)
    : truncate(`I noticed ${observation}`, 200);

  const proofLine = proofRef ? ` ${truncate(proofRef, 100)}` : '';

  return `Hey! ${main}${proofLine} ${cta}`;
}

function buildWebsiteForm(ctx: GeneratorContext): string {
  const observation = buildObservation(ctx);
  const proofRef = buildProofRef(ctx, 'website_contact_form');
  const hook = ctx.selectedAngle?.messageHook ?? '';
  const cta = pickCtaStyle(ctx, 'medium');

  const parts: string[] = ['Hi,'];

  if (hook) {
    parts.push(hook);
  } else {
    parts.push(`I'm reaching out because I noticed ${observation}.`);
  }

  if (proofRef) {
    parts.push(proofRef);
  }

  parts.push(cta);

  return parts.join(' ');
}

function buildCommunityMessage(ctx: GeneratorContext): string {
  const observation = buildObservation(ctx);
  const hook = ctx.selectedAngle?.messageHook ?? '';
  const cta = pickCtaStyle(ctx, 'low');

  const main = hook
    ? truncate(hook.replace(/^Hey [^,]*,?\s*/i, ''), 240)
    : truncate(`I noticed ${observation}`, 160);

  return `Hey — ${main} ${cta}`;
}

/* ──────────────────────────────────────────────
   Subject line
   ────────────────────────────────────────────── */

function buildSubjectLine(ctx: GeneratorContext): string {
  const { visibleProblem } = ctx.prospect;
  const tone = ctx.goal.selectedTone;

  if (isWeakProblem(visibleProblem)) {
    if (tone === 'Direct') return 'Quick thought on an opportunity';
    if (tone === 'Professional') return 'Suggestion regarding how things could be improved';
    if (tone === 'Soft') return 'Quick idea';
    return 'Thought on an opportunity';
  }

  const ref = truncate(visibleProblem, 40).toLowerCase();
  if (tone === 'Direct') return `Quick thought on ${ref}`;
  if (tone === 'Professional') return `Suggestion regarding ${ref}`;
  if (tone === 'Soft') return 'Quick idea';
  return `Thought on ${ref}`;
}

/* ──────────────────────────────────────────────
   Main generator
   ────────────────────────────────────────────── */

const CHANNEL_CONFIGS: Array<{
  id: string;
  channel: MessageChannel;
  label: string;
  risk: 'Very Low' | 'Low' | 'Medium' | 'High';
  bestFor: string;
}> = [
  { id: 'draft-linkedin', channel: 'linkedin_dm', label: 'LinkedIn DM', risk: 'Low', bestFor: 'Professional networking, B2B outreach' },
  { id: 'draft-email', channel: 'email', label: 'Email', risk: 'Medium', bestFor: 'More space for detail, follow-up friendly' },
  { id: 'draft-social', channel: 'instagram_twitter_dm', label: 'Instagram / Twitter DM', risk: 'Low', bestFor: 'Casual, short outreach' },
  { id: 'draft-website', channel: 'website_contact_form', label: 'Website Contact Form', risk: 'Medium', bestFor: 'Direct business inquiries' },
  { id: 'draft-community', channel: 'community_message', label: 'Community Message', risk: 'Very Low', bestFor: 'Community-based soft outreach' },
];

export function generateMessageDrafts(ctx: GeneratorContext): MessageDraft[] {
  const tone = ctx.goal.selectedTone ?? 'Friendly';

  const bodyBuilders: Record<MessageChannel, (c: GeneratorContext) => string> = {
    linkedin_dm: buildLinkedInDm,
    email: buildEmail,
    instagram_twitter_dm: buildSocialDm,
    website_contact_form: buildWebsiteForm,
    community_message: buildCommunityMessage,
  };

  return CHANNEL_CONFIGS.map((cfg) => {
    const message = bodyBuilders[cfg.channel](ctx);
    const cta = pickCtaStyle(ctx, cfg.risk === 'Very Low' || cfg.risk === 'Low' ? 'low' : 'medium');
    const subject = cfg.channel === 'email' ? buildSubjectLine(ctx) : undefined;

    return {
      id: cfg.id,
      channel: cfg.channel,
      label: cfg.label,
      subject,
      message,
      tone,
      cta,
      riskLevel: cfg.risk,
      bestFor: cfg.bestFor,
    };
  });
}
