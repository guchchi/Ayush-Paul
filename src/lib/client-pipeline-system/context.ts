/**
 * Module 5 Strategy Context
 *
 * Normalizes Module 4 upstream data + Module5BridgeContext into
 * a clean domain context for the pipeline strategy composer.
 *
 * This adapter lives in M5 territory. It does not modify M4 stores.
 */

import type { Module5BridgeState } from '../../types/client-pipeline-system';
import { VIDEO_SERVICES, WP_SERVICES, DESIGN_SERVICES } from '../blueprint-content';

/* ──────────────────────────────────────────────
   Service category
   ────────────────────────────────────────────── */

export type ServiceCategory = 'video' | 'wordpress' | 'design';

export function resolveServiceCategory(service: string | null): ServiceCategory {
  if (!service) return 'video';
  if (VIDEO_SERVICES.includes(service)) return 'video';
  if (WP_SERVICES.includes(service)) return 'wordpress';
  if (DESIGN_SERVICES.includes(service)) return 'design';
  return 'video';
}

/* ──────────────────────────────────────────────
   Structured proof asset
   ────────────────────────────────────────────── */

export interface NormalizedProofAsset {
  title: string;
  type: string;
}

/* ──────────────────────────────────────────────
   Authority profile shape
   ────────────────────────────────────────────── */

export interface NormalizedAuthorityProfile {
  oneLinePositioning: string;
  shortBio: string;
  trustBullets: string[];
  ctaLine: string;
}

/* ──────────────────────────────────────────────
   Module 5 Strategy Context — the single input
   to the pipeline strategy composer
   ────────────────────────────────────────────── */

export interface Module5StrategyContext {
  service: string | null;
  serviceLabel: string;
  category: ServiceCategory;
  market: string | null;
  niche: string | null;

  positioning: string;
  offer: {
    name: string;
    type: string | null;
    deliverables: string[];
    uniqueMechanism: string;
  };

  authority: {
    position: string;
    proofAssets: NormalizedProofAsset[];
    profile: NormalizedAuthorityProfile;
  };

  portfolio: {
    ready: boolean;
    destination: string;
    url: string;
    headline: string;
    cta: string;
    featuredProof: {
      id: string;
      title: string;
      url: string;
    };
  };
}

/* ──────────────────────────────────────────────
   Normalize — build Module5StrategyContext from
   raw store fields + bridge state
   ────────────────────────────────────────────── */

export function normalizeModule5Context(
  service: string | null,
  serviceLabel: string | null,
  market: string | null,
  niche: string | null,
  positioning: string,
  offerName: string,
  offerType: string | null,
  deliverables: string[],
  uniqueMechanism: string,
  authorityAngle: string,
  proofAssets: { title: string; type: string }[],
  authorityProfile: { oneLinePositioning: string; shortBio: string; trustBullets: string[]; ctaLine: string },
  bridgeState: Module5BridgeState,
): Module5StrategyContext {
  return {
    service,
    serviceLabel: (serviceLabel || service || '').replace(/_/g, ' '),
    category: resolveServiceCategory(service),
    market: market || null,
    niche: niche || null,

    positioning: positioning.trim(),
    offer: {
      name: offerName.trim(),
      type: offerType || null,
      deliverables: Array.isArray(deliverables) ? deliverables.filter(Boolean) : [],
      uniqueMechanism: uniqueMechanism.trim(),
    },

    authority: {
      position: authorityAngle.trim(),
      proofAssets: Array.isArray(proofAssets)
        ? proofAssets.filter((a) => a.title?.trim())
        : [],
      profile: {
        oneLinePositioning: authorityProfile?.oneLinePositioning?.trim() || '',
        shortBio: authorityProfile?.shortBio?.trim() || '',
        trustBullets: Array.isArray(authorityProfile?.trustBullets) ? authorityProfile.trustBullets.filter(Boolean) : [],
        ctaLine: authorityProfile?.ctaLine?.trim() || '',
      },
    },

    portfolio: {
      ready: bridgeState.portfolioReady,
      destination: bridgeState.portfolioDestination || '',
      url: bridgeState.portfolioUrl || '',
      headline: bridgeState.portfolioHeadline || '',
      cta: bridgeState.portfolioCta || '',
      featuredProof: {
        id: bridgeState.featuredProofAssetId || '',
        title: bridgeState.featuredProofTitle || '',
        url: bridgeState.featuredProofUrl || '',
      },
    },
  };
}

/**
 * Compute a stable deterministic fingerprint from upstream context.
 * Used to detect strategy-invalidating changes without resetting manual user data.
 */
export function computeUpstreamFingerprint(
  service: string | null,
  market: string | null,
  niche: string | null,
  positioning: string,
  offerName: string,
  offerType: string | null,
  deliverables: string[],
  uniqueMechanism: string,
  authorityAngle: string,
  proofAssets: { title: string; type: string }[],
  bridgeState: Module5BridgeState,
): string {
  const parts = [
    service || '',
    market || '',
    niche || '',
    positioning.trim(),
    offerName.trim(),
    offerType || '',
    ...(Array.isArray(deliverables) ? deliverables : []),
    uniqueMechanism.trim(),
    authorityAngle.trim(),
    ...(Array.isArray(proofAssets) ? proofAssets.map((a) => `${a.title}:${a.type}`) : []),
    String(bridgeState.portfolioReady),
    bridgeState.portfolioDestination,
    bridgeState.featuredProofTitle,
    bridgeState.portfolioCta,
    bridgeState.portfolioHeadline,
  ];
  // Simple deterministic hash — stable across environments
  let hash = 0;
  for (const p of parts) {
    for (let i = 0; i < p.length; i++) {
      const ch = p.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash |= 0;
    }
  }
  return `v1:${Math.abs(hash).toString(36)}`;
}
