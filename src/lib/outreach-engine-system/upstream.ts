/**
 * Module 6 — Upstream Context Adapter
 *
 * Pure deterministic function that builds Module6UpstreamContext
 * from Module 5 canonical output (ClientPipelinePack + pipelineList).
 *
 * Module 5 is read-only. This adapter consumes M5 decisions.
 * No independent strategy regeneration.
 */

import type { ClientPipelinePack, PipelineEntry } from '../../types/client-pipeline-system';
import type { Module6UpstreamContext, Module6ProspectContext } from '../../types/outreach-engine-system';

/* ──────────────────────────────────────────────
   Build M6 prospect context from M5 pipeline entry
   ────────────────────────────────────────────── */

function buildProspectContext(entry: PipelineEntry): Module6ProspectContext {
  return {
    id: entry.id,
    prospectName: entry.prospectName,
    platform: entry.platform,
    websiteUrl: entry.websiteUrl,
    nicheFit: entry.nicheFit,
    visibleProblem: entry.visibleProblem,
    score: entry.score,
    priority: entry.priority,
    contactAvailable: entry.contactAvailable,
    notes: entry.notes,
    status: entry.status,
  };
}

/* ──────────────────────────────────────────────
   Build complete M6 upstream context
   ────────────────────────────────────────────── */

export function buildModule6UpstreamContext(
  pipelinePack: ClientPipelinePack | null,
  pipelineList: PipelineEntry[],
  identity: {
    serviceId?: string | null;
    serviceLabel?: string | null;
    market?: string | null;
    niche?: string | null;
    offerName?: string | null;
  },
): Module6UpstreamContext {
  const handoff = pipelinePack?.module6HandoffContext;

  // Strategy section from pipelinePack
  const profile = pipelinePack?.idealProspectProfile;
  const signals = pipelinePack?.buyingSignals ?? [];
  const channels = pipelinePack?.targetChannels ?? [];
  const packRules = pipelinePack?.priorityRules ?? [];
  const packReadiness = pipelinePack?.prospectingReadiness;
  const leadAsset = pipelinePack?.portfolioLeadAsset;

  const strategy = {
    serviceId: identity.serviceId ?? undefined,
    serviceLabel: identity.serviceLabel ?? undefined,
    market: identity.market ?? undefined,
    niche: identity.niche ?? undefined,
    positioning: handoff?.positioning ?? identity.niche ?? undefined,
    offerName: identity.offerName ?? handoff?.positioning ?? undefined,
    offerType: handoff?.offerType || undefined,
    deliverables: handoff?.deliverables ?? [],
    uniqueMechanism: handoff?.uniqueMechanism || undefined,
    authorityPosition: handoff?.authorityPosition || undefined,
    idealProspectProfile: {
      title: profile?.title ?? 'Target Prospect',
      description: profile?.description ?? '',
      characteristics: profile?.characteristics ?? [],
      evidenceOfFit: profile?.evidenceOfFit ?? [],
    },
    buyingSignals: signals.map((s) => ({
      signal: s.signal,
      whyItMatters: s.whyItMatters,
      howToDetect: s.howToDetect,
    })),
    targetChannels: channels.map((c) => ({
      platform: c.platform,
      channelType: c.channelType,
      priority: c.priority,
      expectedSignal: c.expectedSignal,
    })),
  };

  // Proof section from portfolioLeadAsset + module6HandoffContext
  const proofAvailable = leadAsset?.available ?? false;
  const proof = {
    available: proofAvailable,
    portfolioUrl: handoff?.portfolioUrl || leadAsset?.url || undefined,
    portfolioHeadline: handoff?.portfolioHeadline || undefined,
    portfolioCta: handoff?.portfolioCta || leadAsset?.cta || undefined,
    featuredProofId: leadAsset?.id || undefined,
    featuredProofTitle: handoff?.featuredProofTitle || leadAsset?.title || undefined,
    featuredProofUrl: handoff?.featuredProofUrl || leadAsset?.url || undefined,
    destination: leadAsset?.destination || undefined,
  };

  // Prospecting section
  const prospecting = {
    readiness: packReadiness?.status ?? ('limited' as const),
    readinessReasons: packReadiness?.reasons ?? [],
    priorityRules: packRules.map((r) => ({
      factor: r.factor,
      weight: r.weight,
      reason: r.reason,
    })),
  };

  // Prospects — full non-lossy mapping
  const prospects: Module6ProspectContext[] = pipelineList.map(buildProspectContext);

  return { strategy, proof, prospecting, prospects };
}

/* ──────────────────────────────────────────────
   Deterministic fingerprint for stale-context detection
   ────────────────────────────────────────────── */

function sortedJson(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'object') return String(value);
  if (Array.isArray(value)) {
    return '[' + value.map((v) => sortedJson(v)).join(',') + ']';
  }
  const keys = Object.keys(value as Record<string, unknown>).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + sortedJson((value as Record<string, unknown>)[k])).join(',') + '}';
}

export function computeModule6Fingerprint(context: Module6UpstreamContext): string {
  // Hash only material fields that matter for stale detection
  const material = {
    strategy: {
      serviceId: context.strategy.serviceId,
      market: context.strategy.market,
      niche: context.strategy.niche,
      positioning: context.strategy.positioning,
      offerName: context.strategy.offerName,
      offerType: context.strategy.offerType,
      deliverables: context.strategy.deliverables,
      uniqueMechanism: context.strategy.uniqueMechanism,
      authorityPosition: context.strategy.authorityPosition,
      profile: context.strategy.idealProspectProfile,
      signals: context.strategy.buyingSignals,
      channels: context.strategy.targetChannels,
    },
    proof: {
      available: context.proof.available,
      portfolioUrl: context.proof.portfolioUrl,
      portfolioHeadline: context.proof.portfolioHeadline,
      portfolioCta: context.proof.portfolioCta,
      featuredProofTitle: context.proof.featuredProofTitle,
      featuredProofUrl: context.proof.featuredProofUrl,
    },
    prospecting: {
      readiness: context.prospecting.readiness,
      readinessReasons: context.prospecting.readinessReasons,
      priorityRules: context.prospecting.priorityRules,
    },
    prospects: context.prospects.map((p) => ({
      id: p.id,
      prospectName: p.prospectName,
      platform: p.platform,
      websiteUrl: p.websiteUrl,
      nicheFit: p.nicheFit,
      visibleProblem: p.visibleProblem,
      score: p.score,
      priority: p.priority,
      contactAvailable: p.contactAvailable,
      notes: p.notes,
      status: p.status,
    })),
  };
  return sortedJson(material);
}
