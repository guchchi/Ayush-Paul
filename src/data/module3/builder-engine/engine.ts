/**
 * Shared Engine Logic
 *
 * Generic functions called by every BuilderConfig:
 *   - computeEcosystemMap   (cross-asset awareness)
 *   - runQualityDimension   (shared heuristic checks)
 *   - fmt                   (label formatting)
 *   - marketAssumptions     (what buyers already believe vs. doubt)
 */

import type {
  BuilderContext,
  FieldValues,
  EcosystemMap,
  EcosystemSlot,
  QualityDimension,
  QualityDimensionName,
  AuthorityScore,
  AdvisorSignal,
} from './types';
import type { ProofAsset } from '../../../types/module3';

export function fmt(s: string | null | undefined): string {
  return s ? s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';
}

// â"€â"€â"€ Market-specific buyer knowledge â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
// Returns what buyers in a given market ALREADY believe (table stakes)
// and what they DOUBT (the gap to close).
export function marketAssumptions(marketId: string | null): {
  alreadyBelieve: string;
  doubt: string;
  primaryQuestion: string;
} {
  const map: Record<string, { alreadyBelieve: string; doubt: string; primaryQuestion: string }> = {
    saas_startups: {
      alreadyBelieve: "you have technical skill",
      doubt: "whether your work actually moves a business metric",
      primaryQuestion: "Has this person's work ever grown our product?",
    },
    youtube_creators: {
      alreadyBelieve: 'you understand video editing',
      doubt: 'whether you can grow their channel, not just make it look good',
      primaryQuestion: 'Will this editor improve my retention and growth?',
    },
    coaches: {
      alreadyBelieve: 'you can produce content',
      doubt: 'whether you understand their brand and audience voice',
      primaryQuestion: 'Does this person get what my coaching audience needs?',
    },
    local_businesses: {
      alreadyBelieve: "you've done this before",
      doubt: "whether you've worked with a business like theirs",
      primaryQuestion: "Has this person helped a business in my area or industry?",
    },
    agencies: {
      alreadyBelieve: "you're competent",
      doubt: "whether you can handle volume and deadlines without hand-holding",
      primaryQuestion: "Can this person work at agency pace with minimal oversight?",
    },
    ecommerce_brands: {
      alreadyBelieve: "you can design or build",
      doubt: "whether your work actually converts customers",
      primaryQuestion: "Will this person's work increase our revenue?",
    },
    personal_brands: {
      alreadyBelieve: "you understand social media",
      doubt: "whether you understand their specific audience and voice",
      primaryQuestion: "Does this person get MY audience specifically?",
    },
  };
  return (
    map[marketId ?? ''] ?? {
      alreadyBelieve: 'you have relevant experience',
      doubt: 'whether you can deliver measurable results',
      primaryQuestion: 'Can this person solve my specific problem?',
    }
  );
}

// â"€â"€â"€ Ecosystem Map â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const ASSET_TRUST_DIMENSION: Record<string, 'craft' | 'reliability' | 'impact'> = {
  showreel: 'craft',
  before_after_edits: 'craft',
  design_samples: 'craft',
  figma_portfolio: 'craft',
  github_code: 'craft',
  open_source: 'craft',
  live_website: 'craft',
  interactive_prototype: 'craft',
  testimonials: 'reliability',
  client_work: 'reliability',
  social_proof: 'reliability',
  case_studies: 'impact',
  design_case_study: 'impact',
  metrics_results: 'impact',
  performance_metrics: 'impact',
  retention_results: 'impact',
  conversion_metrics: 'impact',
};

const ROLES: Record<'craft' | 'reliability' | 'impact', string> = {
  craft: 'Proves capability',
  reliability: 'Proves reliability',
  impact: 'Proves results',
};

export function computeEcosystemMap(
  proofAssets: ProofAsset[],
  activeIdx: number,
): EcosystemMap {
  const slots: EcosystemSlot[] = proofAssets.map((asset, i) => {
    const dim = ASSET_TRUST_DIMENSION[asset.priorityId] ?? 'craft';
    return {
      assetIdx: i,
      title: asset.credibilityGapProved || `Asset ${i + 1}`,
      role: ROLES[dim],
      trustDimension: dim,
      isRedundant: false,
    };
  });

  // Redundancy detection: if 2 assets cover the same trust dimension
  const dimCounts: Record<string, number[]> = {};
  slots.forEach((s) => {
    if (!dimCounts[s.trustDimension]) dimCounts[s.trustDimension] = [];
    dimCounts[s.trustDimension].push(s.assetIdx);
  });

  let redundancyWarning: string | null = null;
  Object.entries(dimCounts).forEach(([dim, indices]) => {
    if (indices.length > 1) {
      indices.forEach((idx) => {
        slots[idx].isRedundant = true;
        slots[idx].redundantWith = indices.find((i) => i !== idx);
      });
      redundancyWarning = `Assets ${indices.map((i) => i + 1).join(' and ')} both prove ${dim}. Consider replacing one with an asset that covers a different trust gap.`;
    }
  });

  const covered = new Set(slots.map((s) => s.trustDimension));
  const isBalanced = covered.has('craft') && covered.has('reliability') && covered.has('impact');

  const roleNarrative = slots
    .map((s, i) => `Asset ${i + 1} ${s.role.toLowerCase()}`)
    .join(', and ');
  const stackNarrative = isBalanced
    ? `Your three assets cover all three trust dimensions: ${roleNarrative}.`
    : `Your authority stack ${redundancyWarning ? 'has redundancy' : 'is incomplete'}. ${roleNarrative}.`;

  return { slots, isBalanced, redundancyWarning, stackNarrative };
}

// â"€â"€â"€ Shared Quality Heuristics â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const VAGUE_WORDS = /\b(amazing|great|best|always|never|very|many|a lot|tons|huge|incredible|outstanding|exceptional)\b/i;
const HAS_METRIC = /\d+\s*(%|k|m|\$|x|times|minutes|seconds|days|weeks|months)/i;
const HAS_NUMBER = /\b\d+\b/;
const SELF_FOCUSED = /\bI\b/g;

export function runSpecificity(text: string): { score: number; message: string } {
  if (!text) return { score: 0, message: 'No content yet.' };
  const hasMetric = HAS_METRIC.test(text);
  const hasNumber = HAS_NUMBER.test(text);
  if (hasMetric) return { score: 95, message: 'Excellent â€" contains a specific, measurable result.' };
  if (hasNumber) return { score: 65, message: 'Good â€" contains a number. Adding a percentage or dollar figure would strengthen it further.' };
  return { score: 25, message: 'Too vague. Add a specific number, timeframe, or platform name to make this provable.' };
}

export function runClarity(text: string): { score: number; message: string } {
  if (!text) return { score: 0, message: 'No content yet.' };
  const len = text.length;
  if (len < 30) return { score: 35, message: 'Too brief. Expand to 1â€"2 specific sentences so a buyer can understand what you built.' };
  if (len > 400) return { score: 55, message: 'Too long. Cut to the most important 1â€"2 sentences. Buyers scan, they don\'t read.' };
  return { score: 85, message: 'Good length. Clear and scannable.' };
}

export function runCredibility(text: string): { score: number; message: string } {
  if (!text) return { score: 0, message: 'No content yet.' };
  const vagueCount = (text.match(VAGUE_WORDS) || []).length;
  const selfCount = (text.match(SELF_FOCUSED) || []).length;
  if (vagueCount > 1) return { score: 20, message: `Contains ${vagueCount} vague descriptor${vagueCount > 1 ? 's' : ''} (e.g. "${text.match(VAGUE_WORDS)?.[0]}"). Replace with a specific named outcome.` };
  if (selfCount > 3) return { score: 40, message: `Too self-focused ("I" appears ${selfCount}x). Lead with the client's outcome, not your process.` };
  if (HAS_METRIC.test(text)) return { score: 92, message: 'Specific and provable. Strong credibility signal.' };
  return { score: 70, message: 'Acceptable. Adding a specific client outcome or metric would push this to strong.' };
}

export function runBusinessRelevance(text: string, ctx: BuilderContext): { score: number; message: string } {
  if (!text) return { score: 0, message: 'No content yet.' };
  const { doubt } = marketAssumptions(ctx.marketId);
  const businessKeywords = /\b(revenue|growth|conversion|retention|churn|roi|metric|result|outcome|increase|reduce|improve|save|earned|generated|grew|cut)\b/i;
  if (businessKeywords.test(text)) {
    return { score: 88, message: `Strong business relevance â€" directly speaks to what ${fmt(ctx.marketId)} buyers care about.` };
  }
  return { score: 35, message: `Buyers (${fmt(ctx.marketId)}) doubt ${doubt}. This proof doesn't yet address that specific concern.` };
}

export function runDifferentiation(text: string, ctx: BuilderContext): { score: number; message: string } {
  if (!text) return { score: 0, message: 'No content yet.' };
  const mech = ctx.uniqueMechanism.toLowerCase();
  const hasMech = mech && text.toLowerCase().includes(mech.split(' ')[0]);
  const hasNiche = ctx.nicheId && text.toLowerCase().includes(ctx.nicheId.replace(/_/g, ' ').split(' ')[0]);
  if (hasMech || hasNiche) {
    return { score: 85, message: 'References your unique approach or niche â€" differentiating from generic alternatives.' };
  }
  return { score: 42, message: `Generic. Reference your unique mechanism ("${ctx.uniqueMechanism || 'your approach'}") or niche specialization to stand out.` };
}

export function runEcosystemFit(
  text: string,
  fieldId: string,
  otherFieldSets: FieldValues[],
): { score: number; message: string } {
  if (!text || otherFieldSets.length === 0) return { score: 80, message: 'No overlap detected with other assets.' };
  const matchCount = otherFieldSets.filter((other) => {
    const otherText = Object.values(other).join(' ').toLowerCase();
    const words = text.toLowerCase().split(/\s+/).filter((w) => w.length > 5);
    const matches = words.filter((w) => otherText.includes(w));
    return matches.length > 4;
  }).length;
  if (matchCount > 0) {
    return { score: 35, message: 'This content overlaps significantly with another proof asset. Differentiate the angle or choose a different project to avoid redundancy.' };
  }
  return { score: 82, message: 'Distinct from your other proof assets â€" good ecosystem coverage.' };
}

export function runBuyerConfidence(fields: FieldValues, ctx: BuilderContext): { score: number; message: string } {
  const allText = Object.values(fields).join(' ');
  if (!allText.trim()) return { score: 0, message: 'No content yet.' };
  const hasProof = HAS_METRIC.test(allText) || HAS_NUMBER.test(allText);
  const hasCTA = /\b(see|view|visit|link|read|check|download|access|portfolio|github|notion|figma|youtube|vimeo)\b/i.test(allText);
  const { primaryQuestion } = marketAssumptions(ctx.marketId);
  if (hasProof && hasCTA) {
    return { score: 90, message: `Would answer the buyer's question: "${primaryQuestion}"` };
  }
  if (hasProof) {
    return { score: 65, message: `Has proof, but no clear CTA or access point. A buyer couldn't verify this without asking you.` };
  }
  return { score: 30, message: `A ${fmt(ctx.marketId)} buyer reading this would still ask: "${primaryQuestion}" â€" add specific proof.` };
}

// â"€â"€â"€ Shared Quality Score Builder â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export function buildAuthorityScore(
  dimensions: QualityDimension[],
): AuthorityScore {
  const total = Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length);
  const grade: AuthorityScore['grade'] = total >= 80 ? 'A' : total >= 65 ? 'B' : total >= 45 ? 'C' : 'D';

  const weakDims = dimensions.filter((d) => d.status === 'weak');
  const topIssue = weakDims.length > 0
    ? weakDims.sort((a, b) => a.score - b.score)[0].message
    : null;

  const verdict =
    grade === 'A' ? 'This proof asset is ready to publish.' :
    grade === 'B' ? `Strong overall. ${weakDims.length} dimension${weakDims.length > 1 ? 's' : ''} can be improved.` :
    grade === 'C' ? `${weakDims.length} significant issues need fixing before this asset will convert buyers.` :
    `This asset needs substantial work. Address the critical issues before publishing.`;

  return { total, grade, dimensions, verdict, topIssue };
}

export function scoreToDimension(
  name: QualityDimensionName,
  score: number,
  message: string,
): QualityDimension {
  const status = score >= 70 ? 'strong' : score >= 45 ? 'moderate' : 'weak';
  return { name, score, status, message };
}

// â"€â"€â"€ Shared Advisor Signal â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export function signalFromScore(
  fieldId: string,
  score: number,
  message: string,
): AdvisorSignal {
  const type = score >= 70 ? 'strong' : score >= 45 ? 'weak' : 'risky';
  return { fieldId, type, message };
}
