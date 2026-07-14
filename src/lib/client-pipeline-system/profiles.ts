/**
 * Service Acquisition Profiles
 *
 * Each profile defines the BASE acquisition strategy for a service.
 * Modifiers (market, niche, offer, authority, portfolio) then
 * layer on top of this base.
 *
 * Designed to avoid combinatorial explosion: the base profile captures
 * the service-level acquisition shape. Each modifier adjusts specific
 * dimensions.
 */

import type {
  ProspectProfile,
  TargetChannel,
  BuyingSignal,
  QualificationFactor,
  PriorityRule,
  PipelineStage,
} from '../../types/client-pipeline-system';
import type { ServiceCategory } from './context';

/* ──────────────────────────────────────────────
   Service Acquisition Profile shape
   ────────────────────────────────────────────── */

export interface ServiceAcquisitionProfile {
  /** A label for this acquisition type */
  label: string;

  /** Default ideal prospect shape */
  prospectProfile: Omit<ProspectProfile, 'title'>;

  /** Default target channels */
  targetChannels: Omit<TargetChannel, 'searchInstructions'>[];

  /** Default buying signals */
  buyingSignals: Omit<BuyingSignal, 'howToDetect'>[];

  /** Default disqualifiers */
  disqualifiers: string[];

  /** Default qualification factors */
  qualificationFactors: Omit<QualificationFactor, 'scoringGuidance'>[];

  /** Default pipeline stages */
  pipelineStages: PipelineStage[];

  /** Default priority rules */
  priorityRules: Omit<PriorityRule, 'reason'>[];

  /** Default daily prospecting target */
  dailyProspectingTarget: number;

  /** Default weekly qualified prospect target */
  weeklyQualifiedProspectTarget: number;

  /** How buyers typically decide */
  buyerShape: 'individual_creator' | 'small_business_owner' | 'agency_decision_maker' | 'startup_founder' | 'product_lead';

  /** Typical decision context */
  decisionContext: string;

  /** The primary discovery behavior */
  discoveryBehavior: 'platform_search' | 'directory_listing' | 'community_engagement' | 'local_prospecting' | 'network_introductions';
}

/* ──────────────────────────────────────────────
   Category-level base profiles
   ────────────────────────────────────────────── */

const VIDEO_BASE: ServiceAcquisitionProfile = {
  label: 'Content / Video Services',
  buyerShape: 'individual_creator',
  decisionContext: 'Individual creators making content investment decisions based on time vs. quality tradeoff.',
  discoveryBehavior: 'platform_search',

  prospectProfile: {
    description: 'Content creators who produce regular long-form video content but lack the time, skill, or consistency for short-form repurposing.',
    characteristics: [
      'Produces long-form content on a consistent schedule (weekly+)',
      'Has visible audience engagement on at least one platform',
      'Currently has weak, inconsistent, or no short-form presence',
      'Treats content creation as a business or serious side venture',
      'Shows signs of investing in their channel (equipment, tools, previous outsourcing)',
    ],
    evidenceOfFit: [
      'Regular upload schedule with predictable content format',
      'Audience engagement visible in comments or community posts',
      'Business contact method visible (email, booking link, social bio)',
      'Channel size indicates potential budget for editing investment',
    ],
  },

  targetChannels: [
    { platform: 'YouTube', channelType: 'Content creators in target niche with 5K-100K subscribers', priority: 'high', expectedSignal: 'Regular long-form uploads, visible business contact, no short-form strategy' },
    { platform: 'Twitch', channelType: 'Streamers with VODs enabled and consistent schedules', priority: 'medium', expectedSignal: 'VODs available, consistent streaming schedule, active chat community' },
    { platform: 'Instagram', channelType: 'Creators posting Reels with inconsistent quality', priority: 'medium', expectedSignal: 'Short-form presence exists but quality varies' },
    { platform: 'TikTok', channelType: 'Gaming/educational/podcast niche creators', priority: 'medium', expectedSignal: 'Content aligns with niche, creator profile is filled out' },
    { platform: 'LinkedIn', channelType: 'Professionals creating video content for authority building', priority: 'low', expectedSignal: 'Posts short-form educational or thought-leadership content' },
  ],

  buyingSignals: [
    { signal: 'Posts long-form content but no Shorts/Reels/TikTok presence', whyItMatters: 'Clear gap between content produced and content repurposed' },
    { signal: 'Mentions wanting to grow reach or audience in recent posts', whyItMatters: 'Shows awareness that short-form drives discovery' },
    { signal: 'Inconsistent upload schedule suggesting time constraints', whyItMatters: 'Editing bottleneck likely the cause of inconsistency' },
    { signal: 'Recently upgraded equipment or mentioned investing in content quality', whyItMatters: 'Willing to invest in content improvement' },
  ],

  disqualifiers: [
    'No consistent content output in the last 30 days',
    'Already has a polished short-form strategy with dedicated editor',
    'Channel or profile is purely hobby with no growth intent',
    'No visible contact method or engagement with audience',
  ],

  qualificationFactors: [
    { id: 'content_consistency', name: 'Content Consistency', weight: 5, whyImportant: 'Consistent content means reliable material for repurposing' },
    { id: 'audience_engagement', name: 'Audience Engagement', weight: 4, whyImportant: 'Engaged audiences respond better to short-form content' },
    { id: 'short_form_gap', name: 'Short-Form Gap', weight: 5, whyImportant: 'No existing short-form presence means clear opportunity' },
    { id: 'contact_access', name: 'Contact Accessibility', weight: 3, whyImportant: 'Need a way to pitch your service' },
    { id: 'investment_signs', name: 'Investment Signs', weight: 3, whyImportant: 'Shows willingness to spend on content improvement' },
    { id: 'extractable_content', name: 'Extractable Content', weight: 4, whyImportant: 'Content with highlights, moments, or teaching segments makes better clips' },
  ],

  pipelineStages: ['discovered', 'reviewing', 'qualified', 'priority', 'hold', 'disqualified'],

  priorityRules: [
    { factor: 'Content Consistency', weight: 5 },
    { factor: 'Short-Form Gap', weight: 5 },
    { factor: 'Audience Size', weight: 3 },
    { factor: 'Contact Availability', weight: 4 },
    { factor: 'Budget Potential', weight: 3 },
  ],

  dailyProspectingTarget: 10,
  weeklyQualifiedProspectTarget: 5,
};

const WORDPRESS_BASE: ServiceAcquisitionProfile = {
  label: 'WordPress / Web Development Services',
  buyerShape: 'small_business_owner',
  decisionContext: 'Business owners or marketing leads evaluating website investment based on ROI from improved online presence.',
  discoveryBehavior: 'local_prospecting',

  prospectProfile: {
    description: 'Businesses with an existing web presence that is outdated, underperforming, or missing key conversion elements.',
    characteristics: [
      'Has an existing website that looks outdated or unprofessional',
      'Poor mobile experience or slow loading times',
      'Unclear value proposition or missing calls-to-action on homepage',
      'Active in marketing their business but website does not match quality',
      'Decision maker is reachable and has budget authority',
    ],
    evidenceOfFit: [
      'Website has visible design or performance issues',
      'Business invests in marketing (ads, social media, branding)',
      'Competitors in the same space have better online presence',
      'Contact or booking path is unclear or broken on current site',
    ],
  },

  targetChannels: [
    { platform: 'Google Maps', channelType: 'Local service businesses with poor or no website', priority: 'high', expectedSignal: 'Listed in maps but website link is broken, missing, or outdated' },
    { platform: 'Google Search', channelType: 'Businesses ranking for service searches with low-quality websites', priority: 'high', expectedSignal: 'Appears on page 1 but website quality is below competitive standard' },
    { platform: 'LinkedIn', channelType: 'Founders, owners, and marketing leads at target companies', priority: 'medium', expectedSignal: 'Active profiles, posts about business growth or marketing' },
    { platform: 'Instagram', channelType: 'Businesses active on social with weak website', priority: 'medium', expectedSignal: 'Active Instagram presence but website link leads to poor experience' },
    { platform: 'Clutch / Agency Directories', channelType: 'Agencies listed in business directories needing technical support', priority: 'low', expectedSignal: 'Agency offers services that require technical implementation support' },
  ],

  buyingSignals: [
    { signal: 'Website has not been updated in 12+ months', whyItMatters: 'Stale website indicates neglect and opportunity for improvement' },
    { signal: 'Business is actively posting about growth or new services', whyItMatters: 'Growing businesses need websites that match their ambition' },
    { signal: 'Competitors have noticeably better online presence', whyItMatters: 'Competitive pressure creates motivation to improve' },
    { signal: 'Recent negative reviews mentioning website or user experience', whyItMatters: 'Public feedback creates urgency for website improvement' },
  ],

  disqualifiers: [
    'Business is not actively operating or has closed',
    'Recently completed a website redesign with a different provider',
    'Decision maker is not reachable or outsources all decisions',
    'No budget for marketing investment indicated',
  ],

  qualificationFactors: [
    { id: 'website_quality_gap', name: 'Website Quality Gap', weight: 5, whyImportant: 'Clear problems with current site create opportunity for improvement' },
    { id: 'marketing_investment', name: 'Marketing Investment', weight: 4, whyImportant: 'Businesses investing in marketing are more likely to invest in website' },
    { id: 'competitive_pressure', name: 'Competitive Pressure', weight: 3, whyImportant: 'Seeing competitors with better sites motivates action' },
    { id: 'decision_maker_access', name: 'Decision Maker Access', weight: 4, whyImportant: 'Need to reach the person who can approve the project' },
    { id: 'budget_capacity', name: 'Budget Capacity', weight: 4, whyImportant: 'Must have ability to pay for professional development' },
    { id: 'growth_signals', name: 'Growth Signals', weight: 3, whyImportant: 'Growing businesses have ongoing website needs' },
  ],

  pipelineStages: ['discovered', 'reviewing', 'qualified', 'priority', 'hold', 'disqualified'],

  priorityRules: [
    { factor: 'Website Quality Gap', weight: 5 },
    { factor: 'Decision Maker Access', weight: 5 },
    { factor: 'Marketing Investment', weight: 4 },
    { factor: 'Budget Capacity', weight: 4 },
    { factor: 'Urgency Signals', weight: 3 },
  ],

  dailyProspectingTarget: 5,
  weeklyQualifiedProspectTarget: 3,
};

const DESIGN_BASE: ServiceAcquisitionProfile = {
  label: 'Product / UI-UX Design Services',
  buyerShape: 'startup_founder',
  decisionContext: 'Product leaders evaluating design investment based on user retention, conversion impact, and product-market fit progression.',
  discoveryBehavior: 'platform_search',

  prospectProfile: {
    description: 'Early-to-mid stage products with clear UX friction, confusing interfaces, or inconsistent design quality.',
    characteristics: [
      'Product has visible usability issues or confusing user flows',
      'Onboarding flow has friction or drop-off points',
      'Dashboard or core interface has poor information hierarchy',
      'Design is inconsistent across different product screens',
      'Has active userbase and some form of revenue or funding',
    ],
    evidenceOfFit: [
      'Public reviews or social mentions of UI confusion or poor usability',
      'Product trial reveals clear UX friction points',
      'Product team posts about improving user experience or redesigning features',
      'Competitor products have more polished interfaces',
    ],
  },

  targetChannels: [
    { platform: 'Product Hunt', channelType: 'Recently launched or upcoming SaaS/products with UI issues', priority: 'high', expectedSignal: 'Product screenshots or demos show confusing interfaces' },
    { platform: 'G2 / Capterra', channelType: 'B2B SaaS products with user reviews mentioning UX issues', priority: 'high', expectedSignal: 'Reviews cite confusing UI, poor onboarding, or hard-to-use features' },
    { platform: 'LinkedIn', channelType: 'Product managers, heads of product, design leads at target companies', priority: 'medium', expectedSignal: 'Posts about product challenges, UX improvements, or team growth' },
    { platform: 'Crunchbase / TechCrunch', channelType: 'Recently funded SaaS and product startups', priority: 'medium', expectedSignal: 'Recently raised funding and actively improving product' },
    { platform: 'Indie Hackers / HN', channelType: 'Bootstrapped founders building products', priority: 'low', expectedSignal: 'Founders posting about product development challenges' },
  ],

  buyingSignals: [
    { signal: 'User reviews consistently mention confusing interface or hard onboarding', whyItMatters: 'Public UX complaints are documented need for design improvement' },
    { signal: 'Product recently raised funding or hit revenue milestone', whyItMatters: 'Newly resourced teams are actively investing in product quality' },
    { signal: 'Product team is hiring or posting about UX improvements', whyItMatters: 'Active investment in design capability signals budget and priority' },
    { signal: 'Churn rate or trial conversion metrics are below industry benchmark', whyItMatters: 'Quantified UX problem creates measurable ROI for design work' },
  ],

  disqualifiers: [
    'Product is pre-MVP with no active users yet',
    'No clear product decision maker reachable',
    'Product has no revenue and no funding',
    'Recently completed a major redesign with an agency',
  ],

  qualificationFactors: [
    { id: 'ux_friction_evidence', name: 'UX Friction Evidence', weight: 5, whyImportant: 'Clear documented UX problems create measurable opportunity' },
    { id: 'active_userbase', name: 'Active Userbase', weight: 4, whyImportant: 'Users experiencing the problems create urgency for solutions' },
    { id: 'budget_or_funding', name: 'Budget or Funding', weight: 4, whyImportant: 'Need ability to pay for design services' },
    { id: 'decision_maker_access', name: 'Decision Maker Access', weight: 4, whyImportant: 'Need to reach product or design lead' },
    { id: 'competitive_design_gap', name: 'Competitive Design Gap', weight: 3, whyImportant: 'Falling behind competitors creates pressure to improve' },
    { id: 'recent_product_activity', name: 'Recent Product Activity', weight: 3, whyImportant: 'Active products have ongoing design needs' },
  ],

  pipelineStages: ['discovered', 'reviewing', 'qualified', 'priority', 'hold', 'disqualified'],

  priorityRules: [
    { factor: 'UX Friction Evidence', weight: 5 },
    { factor: 'Decision Maker Access', weight: 5 },
    { factor: 'Active Users', weight: 4 },
    { factor: 'Budget Availability', weight: 4 },
    { factor: 'Urgency', weight: 3 },
  ],

  dailyProspectingTarget: 8,
  weeklyQualifiedProspectTarget: 4,
};

/* ──────────────────────────────────────────────
   Service-specific profile overrides
   ────────────────────────────────────────────── */

const SERVICE_SPECIFIC: Record<string, Partial<ServiceAcquisitionProfile>> = {
  short_form_clips: {
    label: 'Short-Form Clip Editing',
    buyerShape: 'individual_creator',
    discoveryBehavior: 'platform_search',
    prospectProfile: {
      description: 'Content creators who produce long-form video content regularly but lack the time or editing skills to repurpose clips for Shorts, Reels, and TikTok.',
      characteristics: [
        'Posts long-form content weekly or more frequently',
        'No short-form presence or posts Shorts inconsistently',
        'Content has natural clip-worthy moments (highlights, reactions, lessons)',
        'Shows signs of treating content creation as a business',
        'Has audience that would engage with short-form content',
      ],
      evidenceOfFit: [
        'Business email or booking link in channel About section',
        'Regular upload schedule with predictable content format',
        'Engagement metrics suggest loyal audience',
        'No dedicated Shorts/Reels content in last 30 days',
      ],
    },
    dailyProspectingTarget: 15,
    weeklyQualifiedProspectTarget: 5,
  },

  long_form_content: {
    label: 'Long-Form Content Production',
    buyerShape: 'individual_creator',
    discoveryBehavior: 'platform_search',
    prospectProfile: {
      description: 'Creators or businesses that need consistent long-form video production but lack the skills, equipment, or time to produce it themselves.',
      characteristics: [
        'Has an audience that wants long-form content',
        'Currently produces long-form content inconsistently',
        'Content quality varies between episodes',
        'Understands the value of consistent publishing',
        'Has budget for production support',
      ],
      evidenceOfFit: [
        'Irregular upload schedule suggesting production bottleneck',
        'Previous episodes have quality variation',
        'Audience asks for more frequent or better quality content',
        'Has sponsor or monetization indicating content investment capacity',
      ],
    },
    dailyProspectingTarget: 8,
    weeklyQualifiedProspectTarget: 3,
  },

  podcast_post_production: {
    label: 'Podcast Post-Production',
    buyerShape: 'individual_creator',
    discoveryBehavior: 'platform_search',
    prospectProfile: {
      description: 'Podcasters who produce regular episodes but lack the editing skills or time to create promotional clips for social media discovery.',
      characteristics: [
        'Produces podcast episodes on a regular schedule',
        'Has no clip repurposing strategy for short-form platforms',
        'Episodes contain quotable moments, guest insights, or storytelling',
        'Shows interest in growing audience beyond current platform',
        'Has visible guest booking process indicating professional approach',
      ],
      evidenceOfFit: [
        'Regular episode publishing schedule',
        'Episode content includes discussions with quotable moments',
        'No short-form clips from episodes on social media',
        'Podcast has a consistent format and production quality',
      ],
    },
    dailyProspectingTarget: 10,
    weeklyQualifiedProspectTarget: 4,
  },

  custom_theme_development: {
    label: 'Custom WordPress Theme Development',
    buyerShape: 'small_business_owner',
    discoveryBehavior: 'local_prospecting',
    prospectProfile: {
      description: 'Businesses or startups that need a custom website that goes beyond template-based solutions to match their brand quality and conversion goals.',
      characteristics: [
        'Current website is template-based or outdated',
        'Business brand quality does not match website quality',
        'Needs custom functionality beyond what templates provide',
        'Has budget for a significant website investment',
        'Decision maker understands the value of a custom-built site',
      ],
      evidenceOfFit: [
        'Website looks noticeably worse than competitor sites',
        'Business has strong branding elsewhere but weak website',
        'Recently launched new products or services without updating website',
        'Has marketing team or agency indicating professional approach',
      ],
    },
    dailyProspectingTarget: 5,
    weeklyQualifiedProspectTarget: 3,
  },

  plugin_integration_dev: {
    label: 'Plugin & Integration Development',
    buyerShape: 'agency_decision_maker',
    discoveryBehavior: 'directory_listing',
    prospectProfile: {
      description: 'Agencies or SaaS companies that need custom plugin, form, tracking, and integration development for their WordPress-based client delivery.',
      characteristics: [
        'Runs client campaigns or services on WordPress',
        'Uses multiple disconnected marketing tools',
        'No in-house developer for technical implementation',
        'Sells services that require technical setup (forms, tracking, landing pages)',
        'Scaling and taking on more clients than current team can support',
      ],
      evidenceOfFit: [
        'Client portfolio shows WordPress-based projects',
        'Service offerings mention landing pages, forms, or campaign management',
        'Team page has no developer or technical roles listed',
        'Recent hiring or client growth suggests scaling challenges',
      ],
    },
    dailyProspectingTarget: 5,
    weeklyQualifiedProspectTarget: 3,
  },

  site_migration_performance: {
    label: 'Site Migration & Performance',
    buyerShape: 'small_business_owner',
    discoveryBehavior: 'local_prospecting',
    prospectProfile: {
      description: 'Businesses with slow, poorly performing websites that need migration to better hosting, performance optimization, and modern infrastructure.',
      characteristics: [
        'Website loads slowly on mobile and desktop',
        'Current hosting causes frequent downtime or slow response',
        'Website has accumulated technical debt from years of patches',
        'Business relies on website for leads or sales',
        'Decision maker understands performance impacts conversion',
      ],
      evidenceOfFit: [
        'Page speed test shows poor scores (under 50 on mobile)',
        'Website has multiple outdated plugins or dependencies',
        'Business mentions losing sales due to site performance',
        'Competitor sites load significantly faster',
      ],
    },
    dailyProspectingTarget: 5,
    weeklyQualifiedProspectTarget: 3,
  },

  product_ui_design: {
    label: 'Product UI Design',
    buyerShape: 'product_lead',
    discoveryBehavior: 'platform_search',
    prospectProfile: {
      description: 'B2B SaaS and product companies whose interfaces have clear UX friction, confusing user flows, or inconsistent design patterns.',
      characteristics: [
        'Product interface has visible usability issues',
        'Onboarding or core workflow has confusing steps',
        'Design quality varies across different product screens',
        'Has active userbase providing feedback on UX issues',
        'Team is actively investing in product improvement',
      ],
      evidenceOfFit: [
        'User reviews specifically mention UI confusion or hard-to-use features',
        'Product demos show cluttered interfaces or unclear navigation',
        'Recent funding or growth indicates capacity for design investment',
        'Competitor products have more polished, consistent interfaces',
      ],
    },
    dailyProspectingTarget: 8,
    weeklyQualifiedProspectTarget: 4,
  },

  brand_identity_visual_systems: {
    label: 'Brand Identity & Visual Systems',
    buyerShape: 'agency_decision_maker',
    discoveryBehavior: 'network_introductions',
    prospectProfile: {
      description: 'Design agencies or in-house teams that need design system support to maintain visual consistency across growing client work or product surfaces.',
      characteristics: [
        'Produces client or product work without consistent design standards',
        'Visual quality varies noticeably across projects or screens',
        'Team is growing and taking on more work than current system supports',
        'Understands the value of design systems but lacks time to build one',
        'Has established brand guidelines that need systematic implementation',
      ],
      evidenceOfFit: [
        'Portfolio shows quality variance across projects',
        'No visible design system, component library, or design tokens',
        'Recent hiring suggests scaling without design infrastructure',
        'Posts about design process challenges or tooling improvements',
      ],
    },
    dailyProspectingTarget: 5,
    weeklyQualifiedProspectTarget: 3,
  },

  ux_research_conversion_audits: {
    label: 'UX Research & Conversion Audits',
    buyerShape: 'product_lead',
    discoveryBehavior: 'platform_search',
    prospectProfile: {
      description: 'SaaS and product companies that need expert UX audit and conversion research to identify friction points and improve user activation and retention.',
      characteristics: [
        'Product has measurable conversion or retention challenges',
        'Team suspects UX issues but lacks data to identify specific problems',
        'Has analytics data but no structured UX research process',
        'Competing in a market where user experience is a differentiator',
        'Has budget for research that directly impacts product metrics',
      ],
      evidenceOfFit: [
        'Published metrics show conversion or retention below industry benchmarks',
        'Product team posts about wanting to improve user experience',
        'Recent user feedback sessions or surveys indicate UX pain points',
        'Has a product roadmap that includes UX improvements',
      ],
    },
    dailyProspectingTarget: 6,
    weeklyQualifiedProspectTarget: 3,
  },
};

/* ──────────────────────────────────────────────
   Category-indexed profiles lookup
   ────────────────────────────────────────────── */

const CATEGORY_PROFILES: Record<ServiceCategory, ServiceAcquisitionProfile> = {
  video: VIDEO_BASE,
  wordpress: WORDPRESS_BASE,
  design: DESIGN_BASE,
};

/* ──────────────────────────────────────────────
   resolveServiceProfile
   ──────────────────────────────────────────────
   Get the base acquisition profile for a service.
   Starts from category-level defaults, then overlays
   service-specific overrides.
   ────────────────────────────────────────────── */

export function resolveServiceProfile(service: string | null, category: ServiceCategory): ServiceAcquisitionProfile {
  const base = CATEGORY_PROFILES[category];
  if (!service) return base;

  const override = SERVICE_SPECIFIC[service];
  if (!override) return base;

  return deepMergeProfile(base, override);
}

/* ──────────────────────────────────────────────
   Deep merge helper — applies partial overrides
   onto a base profile without mutating originals
   ────────────────────────────────────────────── */

function deepMergeProfile(
  base: ServiceAcquisitionProfile,
  override: Partial<ServiceAcquisitionProfile>,
): ServiceAcquisitionProfile {
  return {
    ...base,
    ...override,
    prospectProfile: override.prospectProfile
      ? { ...base.prospectProfile, ...override.prospectProfile }
      : base.prospectProfile,
    targetChannels: override.targetChannels ?? base.targetChannels,
    buyingSignals: override.buyingSignals ?? base.buyingSignals,
    disqualifiers: override.disqualifiers ?? base.disqualifiers,
    qualificationFactors: override.qualificationFactors ?? base.qualificationFactors,
    pipelineStages: override.pipelineStages ?? base.pipelineStages,
    priorityRules: override.priorityRules ?? base.priorityRules,
  };
}
