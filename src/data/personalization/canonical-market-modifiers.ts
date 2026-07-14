import type { CanonicalMarketModifier, MarketAliasEntry } from '../../lib/personalization/types';

export const MARKET_ALIAS_MAP: Record<string, MarketAliasEntry> = {
  /* ── 5 Canonical Module 1 Markets ── */
  youtube_creators:   { type: 'canonical', canonicalId: 'youtube_creators',   label: 'YouTube Creators' },
  coaches:            { type: 'canonical', canonicalId: 'coaches',            label: 'Coaches' },
  agencies:           { type: 'canonical', canonicalId: 'agencies',           label: 'Agencies' },
  local_businesses:   { type: 'canonical', canonicalId: 'local_businesses',   label: 'Local Businesses' },
  personal_brands:    { type: 'canonical', canonicalId: 'personal_brands',    label: 'Personal Brands' },

  /* ── Legacy Aliases (1:1 map to a canonical) ── */
  creators:             { type: 'legacy_alias', canonicalId: 'youtube_creators',   label: 'Creators' },
  coaches_consultants:  { type: 'legacy_alias', canonicalId: 'coaches',            label: 'Coaches & Consultants' },
  marketing_agencies:   { type: 'legacy_alias', canonicalId: 'agencies',           label: 'Marketing Agencies' },
  business_owners:      { type: 'legacy_alias', canonicalId: 'local_businesses',   label: 'Business Owners' },

  /* ── Buyer Segments (semantic enrichment of a canonical) ── */
  course_creators:        { type: 'buyer_segment', canonicalId: 'youtube_creators', label: 'Course Creators',
    buyerContext: ['course creation', 'educational content', 'student engagement'] },
  podcasters:             { type: 'buyer_segment', canonicalId: 'youtube_creators', label: 'Podcasters',
    buyerContext: ['audio content', 'episode production', 'audience growth'] },
  educators:              { type: 'buyer_segment', canonicalId: 'youtube_creators', label: 'Educators',
    buyerContext: ['teaching', 'lesson design', 'learning outcomes'] },
  creators_course_sellers: { type: 'buyer_segment', canonicalId: 'youtube_creators', label: 'Creators & Course Sellers',
    buyerContext: ['course sales', 'audience monetization', 'content repurposing'] },
  ecommerce_brands:       { type: 'buyer_segment', canonicalId: 'local_businesses', label: 'Ecommerce Brands',
    buyerContext: ['product sales', 'brand consistency', 'conversion optimization'] },
  saas_startups:          { type: 'buyer_segment', canonicalId: 'agencies',         label: 'SaaS Startups',
    buyerContext: ['product development', 'rapid iteration', 'startup growth'] },
  startups_saas:          { type: 'buyer_segment', canonicalId: 'agencies',         label: 'Startups & SaaS',
    buyerContext: ['lean operations', 'product quality', 'speed-to-market'] },
  startups:               { type: 'buyer_segment', canonicalId: 'agencies',         label: 'Startups',
    buyerContext: ['early stage', 'resource constraints', 'pragmatic solutions'] },
};

export function resolveCanonicalMarketId(marketId: string): string {
  return MARKET_ALIAS_MAP[marketId]?.canonicalId ?? marketId;
}

export function resolveCanonicalMarketLabel(marketId: string): string {
  return MARKET_ALIAS_MAP[marketId]?.label
    ?? marketId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export const CANONICAL_MARKET_MODIFIERS: Record<string, CanonicalMarketModifier> = {
  youtube_creators: {
    marketId: 'youtube_creators', label: 'YouTube Creators',
    buyerQuestions: ['Can you improve my audience retention?', 'Do you understand YouTube pacing?', 'Will you match my content style?', 'Can you help me grow my channel?'],
    concernThemes: ['retention', 'engagement', 'consistency', 'style match', 'growth trajectory'],
    trustExpectations: ['show retention improvement samples', 'demonstrate pacing awareness', 'provide style range examples', 'prove consistent output capability'],
    languageTendencies: ['direct', 'creator-to-creator', 'metrics-aware', 'platform-specific', 'growth-oriented'],
    decisionContextThemes: ['watch time benchmarks', 'audience retention patterns', 'platform algorithm awareness', 'content strategy context'],
    ctaIntentTendencies: ['review_edit_style', 'discuss_channel_strategy', 'request_sample_edit'],
    recommendationRankingInfluence: ['selected_work', 'retention_work', 'process', 'engagement_samples'],
    exampleFramingInfluence: 'Frame examples around audience retention and viewer engagement improvements demonstrated through sample edits.',
  },
  coaches: {
    marketId: 'coaches', label: 'Coaches',
    buyerQuestions: ['Can you make me look professional?', 'Do you understand my audience?', 'Will this help me attract clients?', 'Is the quality worth the investment?'],
    concernThemes: ['professionalism', 'credibility', 'audience understanding', 'trust building', 'client attraction'],
    trustExpectations: ['show professional-quality work', 'demonstrate understanding of coaching context', 'provide client-attraction focused examples', 'prove reliability and communication'],
    languageTendencies: ['professional', 'empathetic', 'trust-oriented', 'relationship-focused', 'outcome-minded'],
    decisionContextThemes: ['professional image building', 'client trust factors', 'brand consistency', 'long-term partnership potential'],
    ctaIntentTendencies: ['discuss_needs', 'review_portfolio_fit', 'request_proposal'],
    recommendationRankingInfluence: ['process', 'case_studies', 'selected_work', 'testimonials'],
    exampleFramingInfluence: 'Frame examples around professional presentation and client-trust-building through clean, focused work.',
  },
  agencies: {
    marketId: 'agencies', label: 'Agencies',
    buyerQuestions: ['Can you handle volume?', 'Is your quality consistent?', 'Can you work within our process?', 'Are you reliable under deadlines?'],
    concernThemes: ['reliability', 'quality consistency', 'scalability', 'process integration', 'deadline adherence'],
    trustExpectations: ['show volume handling capability', 'demonstrate consistent quality across samples', 'provide process compatibility evidence', 'prove reliability track record'],
    languageTendencies: ['professional', 'scalable', 'process-oriented', 'deadline-aware', 'efficiency-focused'],
    decisionContextThemes: ['white-label partnership potential', 'workflow integration', 'team communication', 'quality control process'],
    ctaIntentTendencies: ['discuss_partnership', 'review_capabilities', 'request_rates'],
    recommendationRankingInfluence: ['process', 'implementation', 'selected_work', 'quality_samples'],
    exampleFramingInfluence: 'Frame examples around consistent quality, process adherence, and reliable delivery across multiple projects.',
  },
  local_businesses: {
    marketId: 'local_businesses', label: 'Local Businesses',
    buyerQuestions: ['Can you help my business look professional?', 'Is this affordable?', 'Do you work with local businesses?', 'Will this actually help me get customers?'],
    concernThemes: ['local relevance', 'affordability', 'professional quality', 'simplicity', 'customer attraction'],
    trustExpectations: ['show local business examples', 'demonstrate understanding of local market', 'provide clear service explanation', 'prove straightforward process'],
    languageTendencies: ['simple', 'benefit-focused', 'clear', 'conservative', 'straightforward'],
    decisionContextThemes: ['local market dynamics', 'budget consciousness', 'quick results expectation', 'low technical literacy'],
    ctaIntentTendencies: ['learn_more', 'discuss_needs', 'request_quote'],
    recommendationRankingInfluence: ['process', 'live_projects', 'selected_work', 'local_examples'],
    exampleFramingInfluence: 'Frame examples around local relevance and clear business benefits shown through straightforward project documentation.',
  },
  personal_brands: {
    marketId: 'personal_brands', label: 'Personal Brands',
    buyerQuestions: ['Can you match my personal style?', 'Do you understand my brand voice?', 'Will the work feel authentic?', 'Can you maintain consistency?'],
    concernThemes: ['style match', 'authenticity', 'voice alignment', 'consistency', 'personal brand fit'],
    trustExpectations: ['show style and voice adaptability', 'demonstrate authentic content creation', 'provide brand-aligned examples', 'prove consistency across touchpoints'],
    languageTendencies: ['collaborative', 'personal', 'authentic', 'voice-aware', 'brand-consistent'],
    decisionContextThemes: ['personal brand positioning', 'content authenticity', 'audience connection', 'long-term content strategy'],
    ctaIntentTendencies: ['discuss_collaboration', 'review_style_fit', 'request_sample'],
    recommendationRankingInfluence: ['selected_work', 'hero', 'content_series', 'style_samples'],
    exampleFramingInfluence: 'Frame examples around authentic style adaptation and personal brand alignment rather than generic templates.',
  },
};

export function resolveCanonicalMarketModifier(marketId: string): CanonicalMarketModifier {
  const canonicalId = resolveCanonicalMarketId(marketId);
  const exact = CANONICAL_MARKET_MODIFIERS[canonicalId];
  if (exact) return exact;
  return {
    marketId: canonicalId, label: resolveCanonicalMarketLabel(marketId),
    buyerQuestions: ['Can you help my business?', 'Do you understand my needs?', 'Is your work professional?', 'Can I trust you to deliver?'],
    concernThemes: ['quality', 'reliability', 'professionalism', 'value', 'trust'],
    trustExpectations: ['show relevant examples', 'demonstrate professional quality', 'prove reliable delivery', 'communicate clearly'],
    languageTendencies: ['professional', 'clear', 'direct', 'helpful'],
    decisionContextThemes: ['quality of work', 'professional presentation', 'process clarity', 'value for investment'],
    ctaIntentTendencies: ['discuss_needs', 'review_work', 'request_proposal'],
    recommendationRankingInfluence: ['selected_work', 'process'],
    exampleFramingInfluence: 'Frame examples around professional quality and clear process demonstrated through your best work.',
  };
}
