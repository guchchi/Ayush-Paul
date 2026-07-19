import type { PersonalizationContext, PersonalizationContextM1, PersonalizationContextM2, PersonalizationContextM3 } from './types';
import { resolveCanonicalMarketLabel } from '../../data/personalization/canonical-market-modifiers';

export function getServiceLabel(serviceId: string | null): string {
  const labels: Record<string, string> = {
    video_editor: 'Video Editor',
    short_form_editor: 'Short-Form Editor',
    youtube_editor: 'YouTube Editor',
    podcast_clip_editor: 'Podcast Clip Editor',
    ad_creative_editor: 'Ad Creative Editor',
    wordpress_developer: 'WordPress Developer',
    landing_page_developer: 'Landing Page Developer',
    no_code_developer: 'No-Code Developer',
    frontend_developer: 'Frontend Developer',
    custom_theme_development: 'Custom Theme Developer',
    automation_developer: 'Automation Developer',
    ui_ux_designer: 'UI/UX Designer',
    landing_page_designer: 'Landing Page Designer',
    brand_designer: 'Brand Designer',
    social_media_designer: 'Social Media Designer',
    presentation_designer: 'Pitch Deck Designer',
  };
  return labels[serviceId ?? ''] || (serviceId?.replace(/_/g, ' ')?.replace(/\b\w/g, (c) => c.toUpperCase()) ?? '');
}

export function getMarketLabel(marketId: string | null): string {
  if (!marketId) return '';
  return resolveCanonicalMarketLabel(marketId);
}

export function getBuyerTerm(marketId: string | null, nicheId: string | null): string {
  if (nicheId) return nicheId.replace(/_/g, ' ');
  return getMarketLabel(marketId).toLowerCase();
}

export function getCategory(serviceId: string | null): 'video' | 'wordpress' | 'design' {
  const video = ['video_editor', 'short_form_editor', 'youtube_editor', 'podcast_clip_editor', 'ad_creative_editor'];
  const wp = ['wordpress_developer', 'landing_page_developer', 'no_code_developer', 'frontend_developer', 'automation_developer', 'custom_theme_development'];
  if (video.includes(serviceId ?? '')) return 'video';
  if (wp.includes(serviceId ?? '')) return 'wordpress';
  return 'design';
}

export function getTrack(serviceId: string | null): 'editor' | 'developer' | 'designer' {
  const editor = ['video_editor', 'short_form_editor', 'youtube_editor', 'podcast_clip_editor', 'ad_creative_editor'];
  const dev = ['wordpress_developer', 'landing_page_developer', 'no_code_developer', 'frontend_developer', 'automation_developer', 'custom_theme_development'];
  if (editor.includes(serviceId ?? '')) return 'editor';
  if (dev.includes(serviceId ?? '')) return 'developer';
  return 'designer';
}

export function getAudienceLabel(marketId: string | null, serviceId: string | null): string {
  if (!marketId) return getServiceLabel(serviceId);
  const map: Record<string, string> = {
    youtube_creators: 'content creators on YouTube',
    creators: 'social media creators',
    coaches: 'coaches and consultants',
    agencies: 'agencies and studios',
    local_businesses: 'local business owners',
    personal_brands: 'personal brand builders',
    course_creators: 'online course creators',
    podcasters: 'podcasters and audio creators',
    educators: 'online educators',
    business_owners: 'small business owners',
    ecommerce_brands: 'ecommerce brand owners',
    marketing_agencies: 'marketing and growth agencies',
    saas_startups: 'SaaS startup teams',
    coaches_consultants: 'coaches and professional consultants',
    startups_saas: 'startup and SaaS companies',
    startups: 'early-stage startup founders',
    creators_course_sellers: 'creators selling digital courses',
  };
  return map[marketId] ?? resolveCanonicalMarketLabel(marketId).toLowerCase();
}

export function getOfferTypeLabel(offerType: string | null): string {
  const map: Record<string, string> = {
    retainer: 'Retainer Support',
    one_time_project: 'One-Time Project',
    milestone_based: 'Milestone Based Project',
  };
  return map[offerType ?? ''] || 'Service';
}

export function resolveM1Context(
  store: {
    careerTrackId?: string | null;
    serviceId?: string | null;
    marketId?: string | null;
    marketLabel?: string | null;
    nicheId?: string | null;
    nicheLabel?: string | null;
    positioning?: string;
  }
): PersonalizationContextM1 {
  return {
    careerTrackId: store.careerTrackId ?? null,
    serviceId: store.serviceId ?? null,
    serviceLabel: getServiceLabel(store.serviceId ?? null),
    marketId: store.marketId ?? null,
    marketLabel: store.marketLabel ?? getMarketLabel(store.marketId ?? null),
    nicheId: store.nicheId ?? null,
    nicheLabel: store.nicheLabel ?? '',
    positioning: store.positioning ?? '',
  };
}

export function resolveM2Context(
  store: {
    offerType?: string | null;
    deliverables?: string[];
    uniqueMechanism?: string;
    scopeLimits?: {
      revisionCount?: number;
      deliveryTime?: string;
      communicationMethod?: string;
      responseTime?: string;
      includedRounds?: number;
    } | null;
    valueAmplifier?: string;
    pricingModel?: string | null;
    finalPrice?: number | null;
    proposalSummary?: {
      headline?: string;
      problem?: string;
      solution?: string;
      timeline?: string;
      pricing?: string;
      nextSteps?: string;
    } | null;
  }
): PersonalizationContextM2 | null {
  const offerType = store.offerType ?? null;
  if (!offerType && (!store.deliverables || store.deliverables.length === 0)) return null;
  return {
    offerType,
    offerTypeLabel: getOfferTypeLabel(offerType),
    deliverables: store.deliverables ?? [],
    uniqueMechanism: store.uniqueMechanism ?? '',
    scopeLimits: {
      revisionCount: store.scopeLimits?.revisionCount ?? 2,
      deliveryTime: store.scopeLimits?.deliveryTime ?? '',
      communicationMethod: store.scopeLimits?.communicationMethod ?? '',
      responseTime: store.scopeLimits?.responseTime ?? '',
      includedRounds: store.scopeLimits?.includedRounds ?? 2,
    },
    valueAmplifier: store.valueAmplifier ?? '',
    pricingModel: store.pricingModel ?? null,
    finalPrice: store.finalPrice ?? null,
    proposalSummary: {
      headline: store.proposalSummary?.headline ?? '',
      problem: store.proposalSummary?.problem ?? '',
      solution: store.proposalSummary?.solution ?? '',
      timeline: store.proposalSummary?.timeline ?? '',
      pricing: store.proposalSummary?.pricing ?? '',
      nextSteps: store.proposalSummary?.nextSteps ?? '',
    },
  };
}

export function resolveM3Context(
  store: {
    authorityPosition?: string | null;
    coreTrustPromise?: string;
    proofPriorities?: { id: string; gapTitle: string; gapDescription: string; recommendedFormat: string }[];
    proofAssets?: { id: string; title: string; assetType: string; isAccepted: boolean }[];
    profileCopy?: {
      professionalHeadline?: string;
      shortBio?: string;
      longBio?: string;
      offerStatement?: string;
      credibilityBullets?: string[];
      proofReferenceLine?: string;
      ctaLine?: string;
    } | null;
    portfolioCopy?: {
      portfolioCta?: string;
      sections?: { type: string; heading: string; body: string }[];
    } | null;
    isCompleted?: boolean;
  }
): PersonalizationContextM3 | null {
  const ap = store.authorityPosition ?? null;
  if (!ap && (!store.proofPriorities || store.proofPriorities.length === 0)) return null;
  const assets = store.proofAssets ?? [];
  return {
    authorityPosition: ap ?? '',
    coreTrustPromise: store.coreTrustPromise ?? '',
    proofPriorities: store.proofPriorities ?? [],
    proofAssets: assets.map((a) => ({ id: a.id, title: a.title, assetType: a.assetType, isAccepted: a.isAccepted })),
    acceptedProofCount: assets.filter((a) => a.isAccepted).length,
    profileCopy: {
      professionalHeadline: store.profileCopy?.professionalHeadline ?? '',
      shortBio: store.profileCopy?.shortBio ?? '',
      longBio: store.profileCopy?.longBio ?? '',
      offerStatement: store.profileCopy?.offerStatement ?? '',
      credibilityBullets: store.profileCopy?.credibilityBullets ?? [],
      proofReferenceLine: store.profileCopy?.proofReferenceLine ?? '',
      ctaLine: store.profileCopy?.ctaLine ?? '',
    },
    portfolioCopy: {
      portfolioCta: store.portfolioCopy?.portfolioCta ?? '',
      sections: store.portfolioCopy?.sections?.map((s) => ({ type: s.type, heading: s.heading, body: s.body })) ?? [],
    },
  };
}

export function resolvePersonalizationContext(
  m1: PersonalizationContextM1,
  m2?: PersonalizationContextM2 | null,
  m3?: PersonalizationContextM3 | null,
): PersonalizationContext {
  const serviceId = m1.serviceId;
  const marketId = m1.marketId;
  const nicheId = m1.nicheId;
  return {
    m1,
    m2: m2 ?? null,
    m3: m3 ?? null,
    derived: {
      audienceLabel: getAudienceLabel(marketId, serviceId),
      buyerTerm: getBuyerTerm(marketId, nicheId),
      category: getCategory(serviceId),
      track: getTrack(serviceId),
    },
  };
}
