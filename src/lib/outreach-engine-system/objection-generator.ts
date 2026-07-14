/**
 * Objection Reply Generator — Deterministic objection-safe reply generation
 *
 * Pure function. No store access. No React. No Date.now(). No random values.
 * Adapts replies to actual context: offer, proof, positioning, deliverables.
 */

import type { ObjectionReply } from '../../types/outreach-engine-system';
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

function deliverablesSummary(deliverables: readonly string[]): string {
  if (deliverables.length === 0) return '';
  if (deliverables.length === 1) return deliverables[0];
  if (deliverables.length === 2) return deliverables.join(' and ');
  return deliverables.slice(0, -1).join(', ') + ', and ' + deliverables[deliverables.length - 1];
}

/* ──────────────────────────────────────────────
   Reply builders
   ────────────────────────────────────────────── */

function buildNotInterested(ctx: GeneratorContext): ObjectionReply {
  const { name } = ctx.prospect;
  return {
    id: 'obj-not-interested',
    objectionType: 'not_interested',
    label: 'Not Interested',
    prospectSays: '"Not interested."',
    reply: `No problem at all, ${name}. I appreciate you letting me know. If things change or you ever want to revisit this, feel free to reach out.`,
    strategy: 'Respectfully close without pressure.',
    tone: 'Friendly',
    riskLevel: 'Very Low',
  };
}

function buildSendDetails(ctx: GeneratorContext): ObjectionReply {
  const { name, visibleProblem } = ctx.prospect;
  const { offerName, positioning, deliverables, uniqueMechanism } = ctx.strategy;
  const { portfolioCta } = ctx.proof;

  const problemRef = isWeakProblem(visibleProblem)
    ? 'an opportunity to improve how things are presented'
    : truncate(visibleProblem, 80).toLowerCase();

  const offerRef = offerName || positioning || deliverablesSummary(deliverables) || 'this type of work';
  const mechRef = uniqueMechanism ? ` My approach is: ${truncate(uniqueMechanism, 80)}.` : '';
  const ctaRef = portfolioCta ? ` ${portfolioCta}` : '';

  const reply = `Happy to share more. I focus on ${truncate(offerRef, 80).toLowerCase()} — specifically around ${problemRef}.${mechRef} If you let me know what part is most relevant, I can tailor the details rather than send a long wall of text.${ctaRef}`;

  return {
    id: 'obj-send-details',
    objectionType: 'send_details',
    label: 'Send Details',
    prospectSays: '"Send details."',
    reply,
    strategy: 'Offer detail without overwhelming them.',
    tone: 'Friendly',
    riskLevel: 'Low',
  };
}

function buildPricing(ctx: GeneratorContext): ObjectionReply {
  const { name } = ctx.prospect;
  const { offerName, positioning, deliverables } = ctx.strategy;
  const scopeRef = deliverablesSummary(deliverables);

  const reply = scopeRef
    ? `Great question. Pricing depends on the specific scope, but I typically start with a focused piece around ${truncate(scopeRef, 60).toLowerCase()} to make sure the approach fits before discussing full numbers. Would it be useful if I took a quick look first and suggested a direction?`
    : `Great question. Pricing depends on the specific scope, but I typically start with a small review or trial piece to make sure the approach fits before discussing numbers. Would it be useful if I took a quick look first and suggested a direction?`;

  return {
    id: 'obj-pricing',
    objectionType: 'pricing_question',
    label: 'What Do You Charge?',
    prospectSays: '"What do you charge?"',
    reply,
    strategy: 'Offer a small review first instead of quoting blind.',
    tone: 'Professional',
    riskLevel: 'Low',
  };
}

function buildAlreadyHaveSomeone(ctx: GeneratorContext): ObjectionReply {
  const { name } = ctx.prospect;
  const { deliverables } = ctx.strategy;
  const deliverableRef = deliverablesSummary(deliverables);

  const specificOffer = deliverableRef
    ? ` If there is ever a specific area where you need extra help with ${truncate(deliverableRef, 60).toLowerCase()} or a backup,`
    : ' If there is ever a specific area where you need extra help or a backup,';

  return {
    id: 'obj-have-someone',
    objectionType: 'already_have_someone',
    label: 'Already Have Someone',
    prospectSays: '"We already have someone."',
    reply: `That is great to hear — I am glad you have support in place.${specificOffer} feel free to reach out. No pitch here, just wanted you to know I am around.`,
    strategy: 'Respect existing setup and offer backup support.',
    tone: 'Friendly',
    riskLevel: 'Very Low',
  };
}

function buildMaybeLater(ctx: GeneratorContext): ObjectionReply {
  const { name } = ctx.prospect;
  const { proof } = ctx;
  const proofRef = proof.available && proof.featuredProofTitle
    ? ` If you ever want to see how "${proof.featuredProofTitle}" was approached, happy to share.`
    : '';

  return {
    id: 'obj-maybe-later',
    objectionType: 'maybe_later',
    label: 'Maybe Later',
    prospectSays: '"Maybe later."',
    reply: `No worries at all, ${name}. I will leave this here.${proofRef} Feel free to ping me whenever the timing works.`,
    strategy: 'Leave the door open without follow-up pressure.',
    tone: 'Friendly',
    riskLevel: 'Very Low',
  };
}

function buildShowExamples(ctx: GeneratorContext): ObjectionReply {
  const { proof, strategy } = ctx;
  const { deliverables, positioning } = strategy;

  let reply: string;

  if (proof.available && proof.featuredProofTitle) {
    const proofUrl = proof.featuredProofUrl || proof.portfolioUrl;
    const urlLine = proofUrl ? ` You can see it here: ${proofUrl}` : '';
    reply = `Sure — I can share "${proof.featuredProofTitle}". It connects closely to the kind of work we have been discussing.${urlLine}`;
  } else if (deliverables.length > 0) {
    reply = `Sure — I can share how I approach ${truncate(deliverablesSummary(deliverables), 80).toLowerCase()}. I have a few examples that show the process and outcomes.`;
  } else {
    reply = `Sure — I can share a few examples of how I have approached similar situations.`;
  }

  return {
    id: 'obj-show-examples',
    objectionType: 'show_examples',
    label: 'Can You Show Examples?',
    prospectSays: '"Can you show examples?"',
    reply,
    strategy: 'Share actual portfolio/proof when available.',
    tone: 'Friendly',
    riskLevel: 'Low',
  };
}

function buildHowItWorks(ctx: GeneratorContext): ObjectionReply {
  const { deliverables, offerType, uniqueMechanism, positioning } = ctx.strategy;

  let reply: string;

  if (deliverables.length > 0) {
    const deliverableList = deliverables.map((d) => d.toLowerCase()).join(', ');
    const mechNote = uniqueMechanism ? ` The approach is: ${truncate(uniqueMechanism, 80)}.` : '';
    reply = `I start by understanding the current situation, then focus on ${truncate(deliverableList, 120)}.${mechNote} Happy to walk through it in more detail if useful.`;
  } else {
    reply = `I start by understanding the current situation, then identify opportunities for improvement, and deliver actionable suggestions. Happy to walk through it in more detail if useful.`;
  }

  return {
    id: 'obj-how-it-works',
    objectionType: 'how_it_works',
    label: 'How Does This Work?',
    prospectSays: '"How does this work?"',
    reply,
    strategy: 'Explain simple process in 2–3 steps.',
    tone: 'Friendly',
    riskLevel: 'Low',
  };
}

/* ──────────────────────────────────────────────
   Main generator
   ────────────────────────────────────────────── */

export function generateObjectionReplies(ctx: GeneratorContext): ObjectionReply[] {
  return [
    buildNotInterested(ctx),
    buildSendDetails(ctx),
    buildPricing(ctx),
    buildAlreadyHaveSomeone(ctx),
    buildMaybeLater(ctx),
    buildShowExamples(ctx),
    buildHowItWorks(ctx),
  ];
}
