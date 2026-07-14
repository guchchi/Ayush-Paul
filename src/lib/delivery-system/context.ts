import type { DeliveryUpstreamContext } from '../../types/delivery-system';
import type { Module6UpstreamContext } from '../../types/outreach-engine-system';
import { useOutreachEngineStore } from '../../lib/outreach-engine-system/store';

const SERVICE_LABELS: Record<string, string> = {
  video_editor: 'Video Editing',
  short_form_editor: 'Short-Form Editing',
  youtube_editor: 'YouTube Editing',
  podcast_clip_editor: 'Podcast Clip Editing',
  ad_creative_editor: 'Ad Creative Editing',
  wordpress_developer: 'WordPress Development',
  landing_page_developer: 'Landing Page Development',
  no_code_developer: 'No-Code Development',
  frontend_developer: 'Frontend Development',
  automation_developer: 'Automation Development',
  ui_ux_designer: 'UI/UX Design',
  landing_page_designer: 'Landing Page Design',
  brand_designer: 'Brand Design',
  social_media_designer: 'Social Media Design',
  presentation_designer: 'Presentation Design',
};

const MARKET_LABELS: Record<string, string> = {
  youtube_creators: 'YouTube Creators',
  coaches: 'Coaches',
  creators: 'Creators',
  agencies: 'Agencies',
  local_businesses: 'Local Businesses',
  personal_brands: 'Personal Brands',
  course_creators: 'Course Creators',
  podcasters: 'Podcasters',
  educators: 'Educators',
  business_owners: 'Business Owners',
  ecommerce_brands: 'E-Commerce Brands',
  marketing_agencies: 'Marketing Agencies',
  saas_startups: 'SaaS Startups',
  startups: 'Startups',
  coaches_consultants: 'Coaches & Consultants',
  startups_saas: 'Startups & SaaS',
  creators_course_sellers: 'Creators & Course Sellers',
};

const NICHE_LABELS: Record<string, string> = {
  fitness_coaches: 'Fitness Coaches',
  business_coaches: 'Business Coaches',
  gaming: 'Gaming',
  educational: 'Educational',
  restaurants: 'Restaurants',
  gyms: 'Gyms',
  clinics: 'Clinics',
};

function resolveLabel(key: string | null, map: Record<string, string>, fallback: string): string {
  if (!key) return fallback;
  return map[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDefaultRevisionCount(serviceId: string | null): number {
  if (!serviceId) return 2;
  const map: Record<string, number> = {
    video_editor: 2,
    short_form_editor: 2,
    youtube_editor: 2,
    podcast_clip_editor: 2,
    ad_creative_editor: 3,
    wordpress_developer: 2,
    landing_page_developer: 2,
    no_code_developer: 2,
    frontend_developer: 2,
    automation_developer: 2,
    ui_ux_designer: 2,
    landing_page_designer: 2,
    brand_designer: 3,
    social_media_designer: 2,
    presentation_designer: 2,
  };
  return map[serviceId] ?? 2;
}

function getDefaultDeliveryTime(serviceId: string | null): string {
  if (!serviceId) return '5–7 business days';
  const map: Record<string, string> = {
    video_editor: '5–7 business days per video',
    short_form_editor: '24–48 hours per clip',
    youtube_editor: '5–7 business days per video',
    podcast_clip_editor: '24–48 hours per clip',
    ad_creative_editor: '3–5 business days per ad',
    wordpress_developer: '10–15 business days',
    landing_page_developer: '3–5 business days',
    no_code_developer: '5–10 business days',
    frontend_developer: '5–10 business days',
    automation_developer: '7–14 business days',
    ui_ux_designer: '7–10 business days per feature',
    landing_page_designer: '3–5 business days',
    brand_designer: '10–15 business days',
    social_media_designer: '2–3 business days per asset',
    presentation_designer: '3–5 business days per deck',
  };
  return map[serviceId] ?? '5–7 business days';
}

function getDefaultCommunicationMethod(serviceId: string | null): string {
  if (!serviceId) return 'Email';
  const map: Record<string, string> = {
    video_editor: 'Slack or email',
    short_form_editor: 'Slack or DM',
    youtube_editor: 'Slack or email',
    podcast_clip_editor: 'Slack or DM',
    ad_creative_editor: 'Email or Slack',
    wordpress_developer: 'Email or project management tool',
    landing_page_developer: 'Email or Slack',
    no_code_developer: 'Slack or email',
    frontend_developer: 'Slack, email, or GitHub',
    automation_developer: 'Email or Slack',
    ui_ux_designer: 'Figma comments + Slack',
    landing_page_designer: 'Email or Slack',
    brand_designer: 'Email or Figma',
    social_media_designer: 'Slack or DM',
    presentation_designer: 'Email or Slack',
  };
  return map[serviceId] ?? 'Email';
}

export function buildDeliveryUpstreamContext(): DeliveryUpstreamContext {
  const m6 = useOutreachEngineStore.getState();
  const m6Upstream = m6.upstreamContext;
  const serviceId = m6.phase5Service;
  const marketId = m6.phase5Market;
  const nicheId = m6.phase5Niche;

  const proofSummary = buildProofSummary(m6Upstream);
  const portfolioSummary = buildPortfolioSummary(m6Upstream);

  return {
    serviceId,
    serviceLabel: resolveLabel(serviceId, SERVICE_LABELS, m6.phase5ServiceLabel ?? 'Service'),
    marketId,
    marketLabel: resolveLabel(marketId, MARKET_LABELS, 'Market'),
    nicheId,
    nicheLabel: resolveLabel(nicheId, NICHE_LABELS, 'Niche'),
    positioning: m6.phase5Positioning || '',
    offerName: m6.phase5OfferName || '',
    offerType: m6.phase5OfferType,
    deliverables: m6.phase5Deliverables || [],
    uniqueMechanism: m6.phase5CorePromise || '',
    revisionCount: getDefaultRevisionCount(serviceId),
    deliveryTime: getDefaultDeliveryTime(serviceId),
    communicationMethod: getDefaultCommunicationMethod(serviceId),
    includedRounds: 2,
    authorityPosition: m6.phase5AuthorityAngle || '',
    proofSummary,
    portfolioSummary,
  };
}

function buildProofSummary(m6Upstream: Module6UpstreamContext | null): string {
  if (!m6Upstream?.proof?.available) return '';
  const parts: string[] = [];
  if (m6Upstream.proof.featuredProofTitle) parts.push(m6Upstream.proof.featuredProofTitle);
  if (m6Upstream.proof.portfolioHeadline) parts.push(m6Upstream.proof.portfolioHeadline);
  return parts.join(' — ');
}

function buildPortfolioSummary(m6Upstream: Module6UpstreamContext | null): string {
  if (!m6Upstream?.proof?.portfolioUrl) return '';
  const url = m6Upstream.proof.portfolioUrl;
  const cta = m6Upstream.proof.portfolioCta || 'View portfolio';
  return `${cta}: ${url}`;
}

export function computeDeliveryFingerprint(ctx: DeliveryUpstreamContext): string {
  const payload = {
    s: ctx.serviceId,
    sl: ctx.serviceLabel,
    m: ctx.marketId,
    ml: ctx.marketLabel,
    n: ctx.nicheId,
    nl: ctx.nicheLabel,
    p: ctx.positioning,
    on: ctx.offerName,
    ot: ctx.offerType,
    d: ctx.deliverables,
    um: ctx.uniqueMechanism,
    rc: ctx.revisionCount,
    dt: ctx.deliveryTime,
    cm: ctx.communicationMethod,
    ir: ctx.includedRounds,
    ap: ctx.authorityPosition,
    ps: ctx.proofSummary,
    pfs: ctx.portfolioSummary,
  };
  return JSON.stringify(payload);
}
