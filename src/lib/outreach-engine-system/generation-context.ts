/**
 * Generation Context — Normalized input for all M6 content generators
 *
 * Pure deterministic type that extracts exactly what generators need
 * from Module6UpstreamContext + current user selections.
 *
 * No store access. No React. No mutations.
 */

import type {
  Module6UpstreamContext,
  Module6ProspectContext,
  OutreachGoal,
  PersonalizationAngle,
} from '../../types/outreach-engine-system';

export interface GeneratorContext {
  strategy: {
    serviceId: string | undefined;
    serviceLabel: string | undefined;
    market: string | undefined;
    niche: string | undefined;
    positioning: string | undefined;
    offerName: string | undefined;
    offerType: string | undefined;
    deliverables: readonly string[];
    uniqueMechanism: string | undefined;
    authorityPosition: string | undefined;
  };
  prospectStrategy: {
    idealProspectProfile: {
      title: string;
      description: string;
      characteristics: readonly string[];
      evidenceOfFit: readonly string[];
    };
    buyingSignals: ReadonlyArray<{
      signal: string;
      whyItMatters: string;
      howToDetect: string;
    }>;
    targetChannels: ReadonlyArray<{
      platform: string;
      channelType: string;
      priority: 'high' | 'medium' | 'low';
      expectedSignal: string;
    }>;
    readiness: 'ready' | 'limited' | 'blocked';
    readinessReasons: readonly string[];
    priorityRules: ReadonlyArray<{
      factor: string;
      weight: number;
      reason: string;
    }>;
  };
  proof: {
    available: boolean;
    featuredProofTitle: string | undefined;
    featuredProofUrl: string | undefined;
    portfolioUrl: string | undefined;
    portfolioHeadline: string | undefined;
    portfolioCta: string | undefined;
  };
  prospect: {
    id: string;
    name: string;
    platform: string;
    websiteUrl: string;
    nicheFit: string;
    visibleProblem: string;
    score: number;
    priority: 'high' | 'medium' | 'low';
    contactAvailable: boolean;
    notes: string;
    status: string;
  };
  goal: {
    goalType: string | undefined;
    label: string | undefined;
    selectedTone: string | undefined;
    ctaStyle: string | undefined;
  };
  selectedAngle: PersonalizationAngle | undefined;
}

export function buildGeneratorContext(
  upstream: Module6UpstreamContext,
  prospect: Module6ProspectContext | null,
  goal: OutreachGoal | null,
  selectedAngle: PersonalizationAngle | undefined,
): GeneratorContext {
  const s = upstream.strategy;
  const p = upstream.proof;
  const ps = upstream.prospecting;

  return {
    strategy: {
      serviceId: s.serviceId,
      serviceLabel: s.serviceLabel,
      market: s.market,
      niche: s.niche,
      positioning: s.positioning,
      offerName: s.offerName,
      offerType: s.offerType,
      deliverables: s.deliverables ?? [],
      uniqueMechanism: s.uniqueMechanism,
      authorityPosition: s.authorityPosition,
    },
    prospectStrategy: {
      idealProspectProfile: s.idealProspectProfile,
      buyingSignals: s.buyingSignals ?? [],
      targetChannels: s.targetChannels ?? [],
      readiness: ps.readiness,
      readinessReasons: ps.readinessReasons ?? [],
      priorityRules: ps.priorityRules ?? [],
    },
    proof: {
      available: p.available,
      featuredProofTitle: p.featuredProofTitle,
      featuredProofUrl: p.featuredProofUrl,
      portfolioUrl: p.portfolioUrl,
      portfolioHeadline: p.portfolioHeadline,
      portfolioCta: p.portfolioCta,
    },
    prospect: prospect
      ? {
          id: prospect.id,
          name: prospect.prospectName,
          platform: prospect.platform,
          websiteUrl: prospect.websiteUrl,
          nicheFit: prospect.nicheFit,
          visibleProblem: prospect.visibleProblem,
          score: prospect.score,
          priority: prospect.priority,
          contactAvailable: prospect.contactAvailable,
          notes: prospect.notes,
          status: prospect.status,
        }
      : {
          id: '',
          name: 'there',
          platform: '',
          websiteUrl: '',
          nicheFit: '',
          visibleProblem: '',
          score: 0,
          priority: 'medium' as const,
          contactAvailable: false,
          notes: '',
          status: '',
        },
    goal: {
      goalType: goal?.goalType,
      label: goal?.label,
      selectedTone: goal?.selectedTone,
      ctaStyle: goal?.ctaStyle,
    },
    selectedAngle,
  };
}

/** Soften observation language when we don't have a specific visible problem */
export function observationPrefix(visibleProblem: string): string {
  const trimmed = visibleProblem.trim();
  if (!trimmed) return 'Based on what I can see, ';
  if (trimmed.length < 12) return 'From your public profile, it looks like ';
  return 'I noticed ';
}

/** CTA intensity based on prospect confidence and readiness */
export function pickCtaStyle(
  ctx: GeneratorContext,
  intensity: 'low' | 'medium' | 'high',
): string {
  const { score, priority, contactAvailable } = ctx.prospect;
  const readiness = ctx.prospectStrategy.readiness;

  const confidence =
    score >= 25 &&
    (priority === 'high' || priority === 'medium') &&
    contactAvailable;

  switch (intensity) {
    case 'low':
    case 'medium': {
      if (!confidence || readiness === 'blocked') {
        return 'Would it be useful if I shared a quick thought?';
      }
      return 'Would it be useful if I sent a few quick ideas?';
    }
    case 'high': {
      if (readiness === 'blocked') {
        return 'Let me know if any of this is useful.';
      }
      if (ctx.proof.available && confidence) {
        return ctx.proof.portfolioCta
          ? ctx.proof.portfolioCta
          : 'Happy to share more if this resonates.';
      }
      return 'Happy to share more if this resonates.';
    }
  }
}
