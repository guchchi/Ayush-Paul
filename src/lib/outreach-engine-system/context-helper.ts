import { resolveBlueprintContext } from '../blueprint-content/blueprint-context';
import { generateOutreachContextDefaults } from '../blueprint-content/contentQuality';

export function getNicheKey(niche: string): string {
  const lower = (niche ?? '').toLowerCase();
  if (lower.includes('gaming')) return 'gaming';
  if (lower.includes('educational') || lower.includes('course')) return 'educational';
  if (lower.includes('podcast')) return 'podcasters';
  if (lower.includes('ai startup') || lower.includes('ai startups')) return 'ai_startups';
  if (lower.includes('design agency') || lower.includes('design agencies') || lower.includes('ux agency')) return 'design_agencies';
  if (lower.includes('product startup') || lower.includes('product startups')) return 'product_startups';
  if (lower.includes('marketing agency') || lower.includes('marketing agencies')) return 'marketing_agencies';
  if (lower.includes('saas')) return 'saas';
  if (lower.includes('local') || lower.includes('service business')) return 'local_business';
  return 'default';
}

export interface CleanContextState {
  phase5Service: string | null;
  phase5ServiceLabel: string | null;
  phase5Niche: string | null;
  phase5PortfolioAsset?: string;
  prospectContext?: {
    prospectName: string;
    companyOrChannelName: string;
    platform: string;
    visibleProblem: string;
    reasonToContact: string;
    recommendedAsset: string;
    isSampleProspect: boolean;
  } | null;
}

export interface CleanContext {
  serviceId: string | null;
  nicheKey: string;
  serviceLabel: string;
  audienceLabel: string;
  cleanProspect: string;
  cleanVisibleProblem: string;
  cleanReasonToContact: string;
  cleanRecommendedAsset: string;
  cleanServiceDescription: string;
  cleanSampleAssetLine: string;
  cleanCTA: string;
  hasRealContext: boolean;
  isSampleMode: boolean;
}

export function getCleanOutreachContext(state: CleanContextState): CleanContext {
  const serviceId = state.phase5Service;
  const niche = state.phase5Niche ?? '';
  const nicheKey = getNicheKey(niche);
  
  const ctx = serviceId ? resolveBlueprintContext(serviceId, nicheKey) : null;
  const audienceLabel = ctx?.audienceLabel ?? 'people like you';
  const serviceLabel = state.phase5ServiceLabel ?? ctx?.offerLabel ?? serviceId ?? 'freelance services';

  const isSampleMode = state.prospectContext?.isSampleProspect ?? false;
  const hasRealContext = Boolean(serviceId && niche);

  const defaults = generateOutreachContextDefaults(serviceId, nicheKey);

  let cleanProspect = state.prospectContext?.prospectName ?? '';
  if (!cleanProspect || cleanProspect === 'Sample prospect') {
    cleanProspect = defaults.prospectName;
  }

  let cleanVisibleProblem = state.prospectContext?.visibleProblem ?? '';
  if (!cleanVisibleProblem || cleanVisibleProblem === 'They show a visible problem related to your selected service.' || cleanVisibleProblem.trim() === '') {
    cleanVisibleProblem = defaults.visibleProblem;
  }

  let cleanReasonToContact = state.prospectContext?.reasonToContact ?? '';
  if (!cleanReasonToContact || cleanReasonToContact === 'There is a clear fit between their need and your offer.' || cleanReasonToContact.trim() === '') {
    cleanReasonToContact = defaults.reasonToContact;
  }

  let cleanRecommendedAsset = state.prospectContext?.recommendedAsset ?? state.phase5PortfolioAsset ?? '';
  if (!cleanRecommendedAsset || cleanRecommendedAsset === 'Sample Project' || cleanRecommendedAsset.trim() === '') {
    cleanRecommendedAsset = defaults.recommendedAsset;
  }

  const cleanCTA = 'Would it be useful if I sent 2-3 quick ideas?';

  return {
    serviceId,
    nicheKey,
    serviceLabel,
    audienceLabel,
    cleanProspect,
    cleanVisibleProblem,
    cleanReasonToContact,
    cleanRecommendedAsset,
    cleanServiceDescription: defaults.serviceDescription,
    cleanSampleAssetLine: defaults.sampleAssetLine,
    cleanCTA,
    hasRealContext,
    isSampleMode
  };
}

export function sanitizeText(text: string, cleanCtx: CleanContext): string {
  if (!text) return text;
  let result = text;

  // Forbidden final-user strings replacements
  result = result.replace(/They show a visible problem related to your selected service\./gi, cleanCtx.cleanVisibleProblem);
  result = result.replace(/They show a visible problem related to your selected service/gi, cleanCtx.cleanVisibleProblem);
  result = result.replace(/There is a clear fit between their need and your offer\./gi, cleanCtx.cleanReasonToContact);
  result = result.replace(/There is a clear fit between their need and your offer/gi, cleanCtx.cleanReasonToContact);
  result = result.replace(/Sample Project/g, cleanCtx.cleanRecommendedAsset);
  result = result.replace(/Sample prospect/g, cleanCtx.cleanProspect);
  result = result.replace(/\bmy service\b/gi, cleanCtx.serviceLabel);
  result = result.replace(/\bthis type of work\b/gi, cleanCtx.cleanServiceDescription);
  
  result = result.replace(/I noticed They/g, "I noticed they");
  result = result.replace(/I noticed Their/g, "I noticed their");
  
  result = result.replace(/service\.\./g, cleanCtx.serviceLabel);
  
  result = result.replace(/\.\./g, ".");
  result = result.replace(/---/g, "");

  return result;
}
