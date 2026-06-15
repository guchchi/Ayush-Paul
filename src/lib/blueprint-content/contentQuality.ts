export type ServiceCategory = 'video' | 'wordpress' | 'design';
import type { ClientSource, Criterion, ProspectType, SearchQuery, ScoreFactor, PipelineEntry, ClientSourceMap, IdealClientCriteria, ProspectTypes, SearchQueryBank, LeadScorecard, PriorityPlan } from '../../types/client-pipeline-system';

export const VIDEO_SERVICES = ['short_form_clips', 'long_form_content', 'podcast_post_production'];
export const WP_SERVICES = ['custom_theme_development', 'plugin_integration_dev', 'site_migration_performance'];
export const DESIGN_SERVICES = ['product_ui_design', 'brand_identity_visual_systems', 'ux_research_conversion_audits'];

export function getServiceCategory(service: string | null): ServiceCategory {
  if (!service) return 'video';
  if (VIDEO_SERVICES.includes(service)) return 'video';
  if (WP_SERVICES.includes(service)) return 'wordpress';
  if (DESIGN_SERVICES.includes(service)) return 'design';
  return 'video';
}

export function getAudienceLabel(niche: string, _market?: string): string {
  const lower = niche.toLowerCase();
  if (lower.includes('fitness') || lower.includes('workout') || lower.includes('transformation') || lower === 'fitness_coaches') return 'fitness coaches';
  if (lower.includes('youtuber') || lower.includes('retention') || lower === 'youtubers_retention') return 'YouTube creators';
  if (lower.includes('restaurant')) return 'restaurants';
  if (lower.includes('gaming') || lower.includes('stream')) return 'gaming creators';
  if (lower.includes('educational') || lower.includes('course') || lower.includes('learning')) return 'educational creators';
  if (lower.includes('coach') || lower.includes('coaches')) return 'coaches';
  if (lower.includes('podcast') || lower.includes('podcaster') || lower.includes('podcast_hosts')) return 'podcasters';
  if (lower.includes('ai startup') || lower.includes('ai startups')) return 'AI startups';
  if (lower.includes('design agency') || lower.includes('design agencies') || lower.includes('ux agency') || lower.includes('ux agencies')) return 'design agencies';
  if (lower.includes('product startup') || lower.includes('product startups')) return 'product startups';
  if (lower.includes('marketing agency') || lower.includes('marketing agencies')) return 'marketing agencies';
  if (lower.includes('startup')) return 'startup teams';
  if (lower.includes('saas')) return 'SaaS teams';
  if (lower.includes('agency') || lower.includes('agencies')) return 'agencies';
  if (lower.includes('personal brand') || lower.includes('personal brand') || lower === 'personal_brand_creators' || lower === 'personal_brands') return 'personal brand creators';
  if (lower.includes('local') || lower.includes('small business') || lower.includes('service business')) return 'local businesses';
  if (lower.includes('ui') || lower.includes('ux') || lower.includes('product')) return 'product teams';
  if (lower.includes('creator')) return 'creators';
  return lower || 'clients';
}

export function getNicheKey(niche: string): string {
  const lower = niche.toLowerCase();
  if (lower.includes('fitness') || lower.includes('workout') || lower.includes('transformation') || lower === 'fitness_coaches') return 'fitness_coaches';
  if (lower.includes('youtuber') || lower.includes('retention') || lower === 'youtubers_retention') return 'youtubers_retention';
  if (lower.includes('restaurant')) return 'restaurants';
  if (lower.includes('gaming')) return 'gaming';
  if (lower.includes('educational') || lower.includes('learning') || lower.includes('tutorial')) return 'educational';
  if (lower.includes('course')) return 'course_creators';
  if (lower.includes('podcast')) return 'podcast';
  if (lower.includes('coach') || lower.includes('coaches') || lower === 'coaches') return 'coaches';
  if (lower.includes('design agency') || lower.includes('design agencies') || lower.includes('ux agency') || lower.includes('ux agencies')) return 'design_agencies';
  if (lower.includes('ai startup') || lower.includes('ai startups')) return 'ai_startups';
  if (lower.includes('product startup') || lower.includes('product startups')) return 'product_startups';
  if (lower.includes('marketing agency') || lower.includes('marketing agencies')) return 'marketing_agencies';
  if (lower === 'saas_startups') return 'saas_startups';
  if (lower.includes('saas')) return 'saas';
  if (lower.includes('personal brand') || lower.includes('personal brand') || lower === 'personal_brand_creators' || lower === 'personal_brands') return 'personal_brand_creators';
  if (lower.includes('agency') || lower.includes('agencies')) return 'marketing_agencies';
  if (lower.includes('local') || lower.includes('small business') || lower.includes('service business')) return 'local_business';
  if (lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('shopify') || lower.includes('dtc')) return 'ecommerce_brands';
  if (lower.includes('ui') || lower.includes('ux') || lower.includes('product')) return 'product_startups';
  if (lower.includes('creator')) return 'creators';
  return 'default';
}

function nicheContent<T>(cat: ServiceCategory, niche: string, defaults: Record<ServiceCategory, T>, overrides: Record<string, Partial<Record<ServiceCategory, T>>>): T {
  const key = getNicheKey(niche);
  return overrides[key]?.[cat] ?? defaults[cat];
}

function applyNicheServiceOverride<T>(result: T, serviceId: string | undefined, niche: string, overrides: Record<string, Record<string, Partial<T>>>): T {
  if (!serviceId) return result;
  const nicheOverrides = overrides[serviceId];
  if (!nicheOverrides) return result;
  const key = getNicheKey(niche);
  const override = nicheOverrides[key];
  if (!override) return result;
  return { ...result, ...override };
}

export function capitalize(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export const ASSET_LABEL_MAP: Record<string, string> = {
  case_studies: 'Case Studies',
  testimonials: 'Testimonials',
  certifications: 'Certifications',
  portfolio_samples: 'Portfolio Samples',
  process_documentation: 'Process Documentation',
  trust_signals: 'Trust Signals',
  sample_project: 'Sample Project',
  before_after: 'Before/After Breakdown',
  audit_report: 'Audit Report',
  process_walkthrough: 'Process Walkthrough',
  mini_case_study: 'Mini Case Study',
  teardown_post: 'Teardown Post',
  portfolio_mock_project: 'Portfolio Mock Project',
  result_simulation: 'Result Simulation',
};

export function toTitleCaseLabel(value: string): string {
  return ASSET_LABEL_MAP[value] || value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export const GOAL_OPTIONS = [
  { id: 'deliver_service', label: 'I can deliver this service' },
  { id: 'understand_niche', label: 'I understand this niche' },
  { id: 'clear_process', label: 'I have a clear process' },
  { id: 'improve_results', label: 'I can improve results' },
  { id: 'communicate_professionally', label: 'I can communicate professionally' },
];

export const PAGE_SECTIONS = [
  { id: 'hero', label: 'Hero', description: 'Your name, headline, and primary CTA' },
  { id: 'who_i_help', label: 'Who I Help', description: 'Describe your target client and what you do for them' },
  { id: 'selected_work', label: 'Selected Work', description: 'Showcase your best proof assets and projects' },
  { id: 'case_study', label: 'Case Study', description: 'One detailed project walkthrough' },
  { id: 'process', label: 'Process', description: 'Step-by-step explanation of how you work' },
  { id: 'trust_signals', label: 'Trust Signals', description: 'Testimonials, results, certifications, or ethics note' },
  { id: 'cta', label: 'CTA', description: 'Contact form, booking link, or lead magnet' },
];

export const CHECKLIST_DEFAULT_ITEMS = [
  { label: '1 strong headline', status: 'pending' as const },
  { label: '1 clear service description', status: 'pending' as const },
  { label: '2-3 proof assets', status: 'pending' as const },
  { label: '1 case study or sample project', status: 'pending' as const },
  { label: '1 process explanation', status: 'pending' as const },
  { label: '1 call-to-action', status: 'pending' as const },
  { label: 'Contact method visible', status: 'pending' as const },
  { label: 'No fake claims — sample projects labelled', status: 'ready' as const },
];

export function generateGoalStatement(cat: ServiceCategory, serviceLabel: string): string {
  const stmts: Record<ServiceCategory, string> = {
    video: 'Show that I can turn raw footage or long-form content into polished short-form clips designed for retention, pacing, and consistent publishing.',
    wordpress: 'Show that I can build clear, performance-optimised WordPress websites that communicate product value and drive action.',
    design: 'Show that I can design intuitive product interfaces and landing pages that reduce friction and improve user engagement.',
  };
  return stmts[cat];
}

const NICHE_POSITION: Record<string, Partial<Record<ServiceCategory, string>>> = {
  gaming: {
    video: 'I help gaming creators turn gameplay streams and long-form videos into short-form clips designed for retention, discovery, and viral reach.',
  },
  educational: {
    video: 'I help educational creators turn course content and tutorials into short-form clips that drive enrollment and build authority.',
  },
  podcast: {
    video: 'I help podcasters turn interview footage into short-form clips that grow show awareness and drive listens across platforms.',
  },
  ai_startups: {
    wordpress: 'I help AI startups launch fast, professional WordPress websites that communicate product value and build investor confidence.',
  },
  local_business: {
    wordpress: 'I help local businesses build professional WordPress websites that attract nearby customers and turn visits into leads.',
  },
  marketing_agencies: {
    wordpress: 'I help marketing agencies build high-performance WordPress sites that showcase client results and generate new business.',
  },
  saas: {
    design: 'I help SaaS teams design clearer product interfaces and dashboards that reduce user friction and improve activation.',
  },
  product_startups: {
    design: 'I help product startups design landing pages and product interfaces that communicate value and drive early adoption.',
  },
  design_agencies: {
    design: 'I help design agencies build scalable design systems and client-ready interfaces that improve delivery speed and quality.',
  },
  fitness_coaches: {
    video: 'I help fitness coaches turn workout footage and client transformation content into short-form clips that attract new clients and build authority.',
  },
  youtubers_retention: {
    video: 'I help YouTube creators turn long-form videos into short-form clips designed for retention, discovery, and subscriber growth.',
  },
  course_creators: {
    video: 'I help course creators turn lessons and tutorials into short-form clips that drive enrollment and demonstrate teaching quality.',
  },
  restaurants: {
    wordpress: 'I help restaurants build professional WordPress websites that showcase their menu, attract local diners, and drive online orders.',
  },
  coaches: {
    wordpress: 'I help coaches build professional WordPress websites that present their services, showcase client results, and book discovery calls.',
    design: 'I help coaches design clearer platform interfaces with streamlined booking flows that build trust and convert visitors into clients.',
  },
  personal_brand_creators: {
    design: 'I help personal brand creators design clearer audience-facing interfaces that reflect their brand and guide followers toward action.',
  },
  saas_startups: {
    design: 'I help SaaS startups design clearer product interfaces and onboarding flows that reduce friction and improve activation.',
  },
};

const SERVICE_POSITION: Record<string, Record<string, string>> = {
  plugin_integration_dev: {
    marketing_agencies: 'I help marketing agencies connect WordPress forms, plugins, tracking tags, and CRM tools so client campaigns launch faster with fewer technical issues.',
    ai_startups: 'I help AI startups build WordPress plugins and integrations that connect their products into users\' existing platforms and reduce adoption friction.',
  },
  site_migration_performance: {
    local_business: 'I help local businesses migrate from slow, outdated websites to high-performance WordPress sites that load faster, rank higher, and convert more visitors.',
    ai_startups: 'I help AI startups migrate from slow MVP sites to high-performance WordPress platforms that support growth and investor credibility.',
  },
};

export function generatePositionStatement(authorityAngle: string, service: string | null, niche: string, market: string, uniqueMechanism: string | null, serviceId?: string): string {
  const audience = getAudienceLabel(niche, market);
  const cat = getServiceCategory(service);
  const mechanism = uniqueMechanism || '';
  const angle = authorityAngle || (cat === 'wordpress' ? 'WordPress developer' : cat === 'design' ? 'product designer' : 'video editor');

  const defaults: Record<ServiceCategory, string> = {
    video: `I help ${audience} turn long-form content into short-form clips designed for retention, discovery, and consistent publishing.`,
    wordpress: `I help ${audience} launch fast, professional WordPress websites with clear structure, responsive layouts, and performance-first development.`,
    design: `I help ${audience} design clearer product interfaces that make the product easier to understand and use.`,
  };

  const finalServiceId = serviceId || service || '';
  const base = finalServiceId
    ? (SERVICE_POSITION[finalServiceId]?.[getNicheKey(niche)] ?? nicheContent(cat, niche, defaults, NICHE_POSITION))
    : nicheContent(cat, niche, defaults, NICHE_POSITION);

  if (mechanism) {
    return `${base.slice(0, -1)} using ${mechanism}.`;
  }

  return base;
}

const NICHE_PORTFOLIO_GOAL: Record<string, Partial<Record<ServiceCategory, string>>> = {
  gaming: {
    video: 'I will prove that I can take long-form gaming content and streams and turn them into short-form clips built for retention, discovery, and viral reach on Shorts, Reels, and TikTok.',
  },
  educational: {
    video: 'I will prove that I can take educational course content and turn it into short-form clips designed to drive enrollment and demonstrate teaching quality.',
  },
  podcast: {
    video: 'I will prove that I can take raw podcast footage and turn it into short-form clips that capture the strongest moments and drive listenership.',
  },
  ai_startups: {
    wordpress: 'I will prove that I can build fast, professional WordPress websites that help AI startups communicate their product value and build trust with investors and early customers.',
  },
  local_business: {
    wordpress: 'I will prove that I can build clear, local-focused WordPress websites that help service businesses attract nearby customers and convert visits into leads.',
  },
  marketing_agencies: {
    wordpress: 'I will prove that I can build high-performance WordPress sites that help marketing agencies showcase their portfolio and generate inbound leads.',
  },
  saas: {
    design: 'I will prove that I can design clearer product interfaces and landing pages that reduce user friction and improve activation for SaaS products.',
  },
  product_startups: {
    design: 'I will prove that I can design product interfaces and landing pages that help early-stage startups communicate value and drive adoption.',
  },
  design_agencies: {
    design: 'I will prove that I can design scalable interfaces and design systems that help agencies deliver consistent, high-quality client work.',
  },
  fitness_coaches: {
    video: 'I will prove that I can take fitness workout footage and transformation content and turn it into short-form clips built for client attraction and authority building on Shorts, Reels, and TikTok.',
  },
  youtubers_retention: {
    video: 'I will prove that I can take long-form YouTube content and turn it into short-form clips built for retention, subscriber growth, and cross-platform discovery.',
  },
  course_creators: {
    video: 'I will prove that I can take course lessons and tutorials and turn them into short-form clips built for enrollment and teaching authority on Shorts, Reels, and TikTok.',
  },
  restaurants: {
    wordpress: 'I will prove that I can build a menu-first, local SEO-optimised WordPress website that helps restaurants attract nearby diners and drive online orders and reservations.',
  },
  coaches: {
    wordpress: 'I will prove that I can build an authority-focused WordPress website that helps coaches present their services, showcase client results, and book discovery calls.',
    design: 'I will prove that I can design clearer coaching platform interfaces with streamlined booking flows that build trust and convert visitors into paying clients.',
  },
  personal_brand_creators: {
    design: 'I will prove that I can design clearer audience-facing interfaces that reflect a creator\'s brand and guide followers toward subscription, purchase, or booking.',
  },
  saas_startups: {
    design: 'I will prove that I can design clearer SaaS product interfaces and onboarding flows that reduce user friction and improve activation for early-stage products.',
  },
};

const SERVICE_PORTFOLIO_GOAL: Record<string, Record<string, string>> = {
  plugin_integration_dev: {
    marketing_agencies: 'I will prove that I can support marketing agencies with WordPress plugin integrations, campaign tracking setup, CRM connections, and client-ready handoff systems.',
    ai_startups: 'I will prove that I can build a WordPress plugin that connects an AI product into users\' existing platforms and reduces adoption friction.',
  },
  site_migration_performance: {
    local_business: 'I will prove that I can migrate a slow, outdated website to a high-performance WordPress setup that loads faster, ranks higher, and converts more visitors.',
    ai_startups: 'I will prove that I can migrate an AI startup from a slow MVP site to a high-performance WordPress platform that supports scaling and investor confidence.',
  },
};

export function generatePortfolioGoalStatement(cat: ServiceCategory, serviceLabel: string, niche: string, serviceId?: string): string {
  const audience = getAudienceLabel(niche);

  const defaults: Record<ServiceCategory, string> = {
    video: `I will prove that I can take long-form content and turn it into short-form clips built for retention and discovery on Shorts, Reels, and TikTok for ${audience}.`,
    wordpress: `I will prove that I can build clear, fast, professional WordPress websites that help ${audience} communicate their product value and build trust.`,
    design: `I will prove that I can design clearer product interfaces and landing pages that reduce user friction and improve engagement for ${audience}.`,
  };

  const base = nicheContent(cat, niche, defaults, NICHE_PORTFOLIO_GOAL);
  return serviceId
    ? (SERVICE_PORTFOLIO_GOAL[serviceId]?.[getNicheKey(niche)] ?? base)
    : base;
}

export function getChecklistByCategory(cat: ServiceCategory) {
  const extras: Record<ServiceCategory, { label: string; status: 'pending' | 'in_progress' | 'ready' }[]> = {
    video: [
      { label: '1 before/after pacing demo', status: 'pending' },
      { label: '1 hook breakdown example', status: 'pending' },
    ],
    wordpress: [
      { label: '1 performance score screenshot', status: 'pending' },
      { label: '1 responsive layout demo', status: 'pending' },
    ],
    design: [
      { label: '1 before/after UI comparison', status: 'pending' },
      { label: '1 design system sample', status: 'pending' },
    ],
  };
  return [...CHECKLIST_DEFAULT_ITEMS, ...extras[cat]];
}

export const ANGLES_BY_CATEGORY: Record<ServiceCategory, { label: string; desc: string }[]> = {
  video: [
    { label: 'Shorts Growth Editor', desc: 'Turn long content into discovery-optimised short clips' },
    { label: 'Retention-Focused Video Editor', desc: 'Keep viewers watching longer with smart pacing and structure' },
    { label: 'Gaming Clips Specialist', desc: 'Capture the best moments from gameplay for viral shorts' },
    { label: 'Creator Repurposing Specialist', desc: 'Maximise content ROI by repurposing across platforms' },
    { label: 'Viral Moment Finder', desc: 'Identify and extract the highest-potential moments from raw footage' },
  ],
  wordpress: [
    { label: 'AI Startup Website Specialist', desc: 'Helps AI startups launch professional websites faster' },
    { label: 'Performance-First WordPress Developer', desc: 'Builds fast, SEO-friendly, conversion-ready custom themes' },
    { label: 'Startup Launch Website Developer', desc: 'Helps startups go from idea to launch-ready website' },
    { label: 'Conversion-Focused Website Builder', desc: 'Builds websites designed to turn visitors into leads' },
    { label: 'Custom WordPress Theme Specialist', desc: 'Creates custom themes tailored to brand and growth' },
  ],
  design: [
    { label: 'SaaS Product UI Designer', desc: 'Design interfaces that drive user action and retention' },
    { label: 'Conversion-Focused Interface Designer', desc: 'Build landing pages that convert for software products' },
    { label: 'UX Audit Specialist', desc: 'Analyse and improve existing products with data-driven audits' },
    { label: 'Design System Specialist', desc: 'Build consistent, scalable design systems for brands' },
    { label: 'User Flow Optimization Designer', desc: 'Create intuitive user experiences that reduce churn' },
  ],
};

export function getAuthorityAngles(cat: ServiceCategory, niche: string): { label: string; desc: string }[] {
  const nicheKey = getNicheKey(niche);
  const nicheAngles: Record<string, Partial<Record<ServiceCategory, { label: string; desc: string }[]>>> = {
    gaming: {
      video: [
        { label: 'Gaming Clips Specialist', desc: 'Capture the best moments from gameplay for viral shorts' },
        { label: 'Shorts Growth Editor', desc: 'Turn long gaming content into discovery-optimised short clips' },
        { label: 'Viral Moment Finder', desc: 'Identify and extract the highest-potential moments from raw footage' },
      ],
    },
    educational: {
      video: [
        { label: 'Educational Content Repurposing Editor', desc: 'Turn course content into short-form clips that drive enrollment' },
        { label: 'Tutorial Clips Specialist', desc: 'Extract the best teaching moments from lessons for short-form platforms' },
        { label: 'Course Content Clip Editor', desc: 'Repurpose tutorials and lessons into engaging short-form clips' },
      ],
    },
    podcast: {
      video: [
        { label: 'Podcast Clip Repurposing Specialist', desc: 'Extract the best interview moments for short-form clips' },
        { label: 'Interview Clip Editor', desc: 'Turn podcast conversations into discovery-optimised short clips' },
        { label: 'Podcast Highlights Editor', desc: 'Capture the strongest moments from episodes for social promotion' },
      ],
    },
    ai_startups: {
      wordpress: [
        { label: 'AI Startup Website Specialist', desc: 'Helps AI startups launch professional websites faster' },
        { label: 'Performance-First WordPress Developer', desc: 'Builds fast, SEO-friendly, conversion-ready custom themes' },
        { label: 'Startup Launch Website Developer', desc: 'Helps startups go from idea to launch-ready website' },
      ],
    },
    local_business: {
      wordpress: [
        { label: 'Local Business Website Builder', desc: 'Builds websites that attract nearby customers and drive leads' },
        { label: 'Service Business WordPress Developer', desc: 'Creates clear, mobile-friendly sites for service businesses' },
        { label: 'Local Lead Website Specialist', desc: 'Optimises websites to convert local visitors into customers' },
      ],
    },
    marketing_agencies: {
      wordpress: [
        { label: 'White-Label WordPress Integration Specialist', desc: 'Handles plugin setup, CRM, tracking, and campaign pages for agencies' },
        { label: 'Agency Plugin Integration Developer', desc: 'Sets up forms, analytics, bookings, and integrations for client campaigns' },
        { label: 'Campaign Setup WordPress Developer', desc: 'Builds landing pages and tracking infrastructure for agency campaigns' },
      ],
    },
    saas: {
      design: [
        { label: 'SaaS Product UI Designer', desc: 'Design interfaces that drive user action and retention' },
        { label: 'User Flow Optimization Designer', desc: 'Create intuitive user experiences that reduce churn' },
        { label: 'SaaS UX Clarity Designer', desc: 'Reduce friction and improve activation with clearer interfaces' },
      ],
    },
    product_startups: {
      design: [
        { label: 'MVP Interface Designer', desc: 'Design clear interfaces that communicate value for early-stage products' },
        { label: 'Product Launch UI Designer', desc: 'Create landing pages and product interfaces for product launches' },
        { label: 'Startup UX Improvement Designer', desc: 'Fix friction points in onboarding and first-user experience' },
      ],
    },
    design_agencies: {
      design: [
        { label: 'Design System Specialist', desc: 'Build consistent, scalable design systems for brands and agencies' },
        { label: 'Agency UX Audit Specialist', desc: 'Analyse and improve client products with data-driven audits' },
        { label: 'Client-Ready Design System Builder', desc: 'Creates component libraries that speed up agency delivery' },
      ],
    },
  };

  const found = nicheAngles[nicheKey]?.[cat];
  return found ?? ANGLES_BY_CATEGORY[cat];
}

export const CREDIBILITY_LEVELS = [
  { value: 'beginner', label: 'Getting Started', desc: 'Learning the craft, building samples, no clients yet' },
  { value: 'intermediate', label: 'Some Experience', desc: 'Have worked on a few projects, building proof' },
  { value: 'experienced', label: 'Experienced', desc: 'Multiple projects done, ready to show results' },
];

export const PROMISE_SUGGESTIONS = [
  'Clear communication',
  'Defined scope',
  'Fast response',
  'Consistent delivery',
  'Beginner-safe process',
  'Transparent pricing',
  'Revision flexibility',
  'On-time guarantee',
];

export const TRUST_BUILDER_SUGGESTIONS = [
  { id: 'process_overview', label: 'Clear process overview', category: 'process' as const },
  { id: 'scope_definition', label: 'Scope of work template', category: 'process' as const },
  { id: 'timeline_example', label: 'Timeline example from past work', category: 'process' as const },
  { id: 'sample_deliverable', label: 'Sample deliverable', category: 'process' as const },
  { id: 'before_after', label: 'Before/after comparison', category: 'social' as const },
  { id: 'tool_stack', label: 'Tool stack I use', category: 'social' as const },
  { id: 'process_screenshot', label: 'Process screenshot or diagram', category: 'social' as const },
  { id: 'ethics_note', label: 'No fake claims — ethics note', category: 'ethics' as const },
  { id: 'sample_project_label', label: 'Sample project label', category: 'ethics' as const },
  { id: 'beginner_disclaimer', label: 'Beginner-safe disclaimer', category: 'ethics' as const },
];

export const TRUST_BUILDER_DEFAULT_SELECTIONS = [
  'process_overview', 'scope_definition', 'sample_deliverable', 'before_after',
  'tool_stack', 'ethics_note', 'sample_project_label',
];

export const SOCIAL_PROOF_LEVEL_ACTIONS: Record<string, { current: string[]; missing: string[]; next: string[] }> = {
  beginner: {
    current: ['Process overview', 'Sample project', 'Tool stack'],
    missing: ['Client testimonial', 'Case study', 'Before/after with data'],
    next: ['Complete 1 sample project', 'Ask a peer for a short review', 'Record a process walkthrough'],
  },
  intermediate: {
    current: ['Sample deliverables', 'Process documentation', '1-2 client reviews'],
    missing: ['Detailed case study', 'Video testimonial', 'Metrics/outcomes'],
    next: ['Turn best project into a case study', 'Record a client review', 'Create a before/after comparison'],
  },
  experienced: {
    current: ['Multiple case studies', 'Client testimonials', 'Process framework', 'Metrics'],
    missing: ['Video testimonials', 'Industry recognition', 'Published content'],
    next: ['Publish a case study on LinkedIn', 'Create a portfolio page', 'Write a thread about your approach'],
  },
};

export const PROOF_OPTIONS = [
  { id: 'sample_project', label: 'Sample Project', level: 'beginner' as const, desc: 'A practice project that shows your process and quality' },
  { id: 'process_walkthrough', label: 'Process Walkthrough', level: 'beginner' as const, desc: 'Record or document each step of your process' },
  { id: 'before_after', label: 'Before/After Comparison', level: 'intermediate' as const, desc: 'Show the difference your work makes' },
  { id: 'case_study', label: 'Case Study', level: 'intermediate' as const, desc: 'Detailed project breakdown with problem, process, result' },
  { id: 'testimonial', label: 'Client Testimonial', level: 'intermediate' as const, desc: 'Real feedback from someone you have worked with' },
  { id: 'social_proof', label: 'Social Proof', level: 'experienced' as const, desc: 'Metrics, engagement, or recognition from your work' },
];

export const PROOF_RECOMMENDATIONS: Record<string, string[]> = {
  beginner: ['sample_project', 'process_walkthrough'],
  intermediate: ['sample_project', 'before_after', 'process_walkthrough', 'case_study'],
  experienced: ['sample_project', 'before_after', 'case_study', 'testimonial', 'social_proof'],
};

const NICHE_PROFILE_OVERRIDES: Record<string, Partial<Record<ServiceCategory, { shortBio: string; serviceDescription: string; ctaLine: string }>>> = {
  gaming: {
    video: {
      shortBio: 'I help gaming creators turn streams, VODs, and gameplay moments into short-form clips designed for retention, discovery, and consistent publishing.',
      serviceDescription: 'I review gaming footage and streams, identify the highest-potential moments, shape each clip around a clear hook, add captions, tighten pacing, and prepare the clips for Shorts, Reels, or TikTok.',
      ctaLine: 'Send me one gaming VOD or stream highlight and I will suggest 3 specific clip ideas.',
    },
  },
  educational: {
    video: {
      shortBio: 'I help educational creators turn lessons, tutorials, and course content into short-form clips that explain ideas clearly and attract new students.',
      serviceDescription: 'I review course content and tutorial footage, identify the most engaging teaching moments, shape each clip around a clear learning hook, add captions, tighten pacing, and prepare the clips for Shorts, Reels, or TikTok.',
      ctaLine: 'Send me one educational video or tutorial and I will suggest 3 specific clip ideas.',
    },
  },
  podcast: {
    video: {
      shortBio: 'I help podcasters turn long episodes and interviews into short-form clips that highlight the strongest ideas, guest moments, and conversation hooks.',
      serviceDescription: 'I review podcast footage and interviews, identify the strongest conversational moments, shape each clip around a compelling hook, add captions, tighten pacing, and prepare the clips for Shorts, Reels, or TikTok.',
      ctaLine: 'Send me one podcast episode and I will suggest 3 specific clip ideas.',
    },
  },
  ai_startups: {
    wordpress: {
      shortBio: 'I help AI startups launch fast, professional WordPress websites that communicate product value and build investor confidence.',
      serviceDescription: 'I build custom WordPress sites for AI startups that clearly communicate complex product value, load fast, and convert visitors into signups or demo requests.',
      ctaLine: 'Send me your current website or product description and I will suggest 3 specific improvements.',
    },
  },
  local_business: {
    wordpress: {
      shortBio: 'I help local businesses build professional, mobile-friendly WordPress websites that attract nearby customers and drive leads.',
      serviceDescription: 'I build mobile-friendly WordPress websites that clearly present services, build local trust, and make it easy for customers to call, book, or inquire.',
      ctaLine: 'Send me your business information and I will suggest 3 specific improvements for your online presence.',
    },
  },
  marketing_agencies: {
    wordpress: {
      shortBio: 'I help marketing agencies handle WordPress plugin integrations, tracking setup, and campaign pages faster without slowing down client delivery.',
      serviceDescription: 'I support marketing agencies with WordPress plugin setup, CRM connections, tracking tags, campaign pages, and client-ready handoff documentation.',
      ctaLine: 'Send me one client campaign setup and I will identify 3 integration or tracking improvements.',
    },
  },
  saas: {
    design: {
      shortBio: 'I help SaaS teams design clearer product interfaces, dashboards, and onboarding flows that reduce friction and improve activation.',
      serviceDescription: 'I design user-friendly SaaS interfaces that reduce friction, improve activation, and communicate product value at every touchpoint with a focus on clarity and consistency.',
      ctaLine: 'Send me your product\u2019s current UI and I will suggest 3 specific improvements.',
    },
  },
  product_startups: {
    design: {
      shortBio: 'I help product startups design landing pages and interfaces that communicate value and drive early adoption.',
      serviceDescription: 'I design clear, focused product interfaces and landing pages for early-stage startups that help first-time users understand the product value within seconds.',
      ctaLine: 'Send me your current product screens or wireframes and I will suggest 3 specific improvements.',
    },
  },
  design_agencies: {
    design: {
      shortBio: 'I help design agencies build scalable design systems, audit client experiences, and package UX recommendations into client-ready deliverables.',
      serviceDescription: 'I build scalable design systems and reusable component libraries for agencies that enable consistent, high-quality output across all client projects with faster delivery times.',
      ctaLine: 'Send me examples of your recent client work and I will suggest 3 specific improvements for your design system.',
    },
  },
  fitness_coaches: {
    video: {
      shortBio: 'I help fitness coaches turn workout footage and client transformation content into short-form clips that attract new clients and build coaching authority.',
      serviceDescription: 'I review fitness footage and transformation content, identify the most compelling moments, shape each clip around a clear hook, add captions, tighten pacing, and prepare the clips for Shorts, Reels, or TikTok.',
      ctaLine: 'Send me one workout video or transformation story and I will suggest 3 specific clip ideas.',
    },
  },
  youtubers_retention: {
    video: {
      shortBio: 'I help YouTube creators turn long-form videos into short-form clips designed for retention, discovery, and subscriber growth across platforms.',
      serviceDescription: 'I review long-form video content, identify the highest-retention moments, shape each clip around a clear hook, add captions, tighten pacing, and prepare the clips for Shorts, Reels, or TikTok.',
      ctaLine: 'Send me one long-form YouTube video and I will suggest 3 specific clip ideas.',
    },
  },
  course_creators: {
    video: {
      shortBio: 'I help course creators turn lessons and tutorials into short-form clips that drive enrollment and demonstrate teaching quality.',
      serviceDescription: 'I review course content and tutorial footage, identify the most engaging teaching moments, shape each clip around a clear learning hook, add captions, tighten pacing, and prepare the clips for Shorts, Reels, or TikTok.',
      ctaLine: 'Send me one lesson or tutorial and I will suggest 3 specific clip ideas.',
    },
  },
  restaurants: {
    wordpress: {
      shortBio: 'I help restaurants build professional, mobile-friendly WordPress websites that showcase their menu, attract local diners, and drive online orders.',
      serviceDescription: 'I build menu-first WordPress websites that present the dining experience, optimise for local search, and make it easy for customers to view the menu, make reservations, or place orders online.',
      ctaLine: 'Send me your restaurant information and menu and I will suggest 3 specific improvements for your online presence.',
    },
  },
  coaches: {
    wordpress: {
      shortBio: 'I help coaches build professional, authority-focused WordPress websites that present their services, showcase client results, and book discovery calls.',
      serviceDescription: 'I build authority-focused WordPress websites that communicate coaching methodology, showcase transformation stories, and integrate booking and payment flows that convert visitors into clients.',
      ctaLine: 'Send me your coaching service information and I will suggest 3 specific improvements for your website.',
    },
    design: {
      shortBio: 'I help coaches design clearer platform interfaces with streamlined booking flows that build client trust and reduce friction in the signup process.',
      serviceDescription: 'I design coaching platform interfaces that streamline booking and payment flows, reduce friction in the client journey, and communicate professionalism at every touchpoint.',
      ctaLine: 'Send me your current platform interface and I will suggest 3 specific improvements.',
    },
  },
  personal_brand_creators: {
    design: {
      shortBio: 'I help personal brand creators design clearer audience-facing interfaces that reflect their brand and guide followers toward action.',
      serviceDescription: 'I design audience-facing interfaces that reflect personal brand identity, guide visitors toward subscription or purchase, and create a consistent experience across touchpoints.',
      ctaLine: 'Send me your current platform or brand materials and I will suggest 3 specific improvements.',
    },
  },
  saas_startups: {
    design: {
      shortBio: 'I help SaaS startups design clearer product interfaces and onboarding flows that reduce user friction and improve activation.',
      serviceDescription: 'I design SaaS product interfaces with optimised onboarding flows, clear information hierarchy, and consistent design systems that help early users reach the core value faster.',
      ctaLine: 'Send me your product\'s current interface and I will suggest 3 specific improvements.',
    },
  },
};

export function generateAuthorityProfile(cat: ServiceCategory, authorityAngle: string, authorityPosition: string, niche: string, market: string, trustBullets: string[], firstProofTitle: string, serviceId?: string) {
  const audience = getAudienceLabel(niche, market);
  const angle = authorityAngle || (cat === 'wordpress' ? 'WordPress developer' : cat === 'design' ? 'product designer' : 'video editor');
  const position = authorityPosition || generatePositionStatement(authorityAngle, null, niche, market, null, serviceId);
  const proofClause = firstProofTitle ? ` — starting with ${firstProofTitle}` : '';

  const defaults: Record<ServiceCategory, { oneLinePositioning: string; shortBio: string; serviceDescription: string; ctaLine: string }> = {
    video: {
      oneLinePositioning: position,
      shortBio: `I help ${audience} turn long-form content and streams into short-form clips designed for retention, discovery, and consistent publishing.`,
      serviceDescription: `I review source footage, identify the highest-potential moments, shape each clip around a clear hook, add captions, tighten pacing, and prepare the clips for Shorts, Reels, or TikTok${proofClause}.`,
      ctaLine: 'Send me one long-form video or stream and I will suggest 3 specific clip ideas.',
    },
    wordpress: {
      oneLinePositioning: position,
      shortBio: `I help ${audience} launch fast, professional WordPress websites with clean structure, responsive layouts, and performance-first development.`,
      serviceDescription: `I build custom WordPress sites that communicate your product value, load fast, and convert visitors into leads or signups${proofClause}.`,
      ctaLine: 'Send me your current website or landing page and I will suggest 3 specific improvements.',
    },
    design: {
      oneLinePositioning: position,
      shortBio: `I help ${audience} design clearer product interfaces and landing pages that make the product easier to understand and use.`,
      serviceDescription: `I design user-friendly interfaces that reduce friction, improve activation, and communicate product value at every touchpoint${proofClause}.`,
      ctaLine: 'Send me your product’s current UI and I will suggest 3 specific improvements.',
    },
  };

  const nicheKey = getNicheKey(niche);
  const override = NICHE_PROFILE_OVERRIDES[nicheKey]?.[cat];
  const profile = override
    ? {
        ...defaults[cat],
        shortBio: override.shortBio,
        serviceDescription: override.serviceDescription + proofClause,
        ctaLine: override.ctaLine,
      }
    : { ...defaults[cat] };

  const finalTrustBullets = trustBullets.length > 0 ? trustBullets.slice(0, 5) : (
    (serviceId === 'plugin_integration_dev' && nicheKey === 'marketing_agencies')
      ? [
          'Clear integration setup process',
          'Form + CRM connection workflow',
          'Tracking setup checklist',
          'Campaign QA before handoff',
          'Client-ready documentation'
        ]
      : [
          `Clear ${cat === 'video' ? 'editing' : cat === 'wordpress' ? 'build' : 'design'} process`,
          `Defined scope and timeline`,
          `Responsive ${cat === 'design' ? 'design system' : cat === 'wordpress' ? 'mobile layout' : 'delivery schedule'}`,
          `${cat === 'video' ? 'Retention-focused' : cat === 'wordpress' ? 'Performance-first' : 'User-first'} approach`,
          `Transparent communication`,
        ]
  );

  return {
    ...profile,
    trustBullets: finalTrustBullets,
  };
}

const NICHE_PORTFOLIO_ASSET_NAMES: Record<string, Partial<Record<ServiceCategory, { showcase: string; breakdown: string; process: string }>>> = {
  gaming: {
    video: {
      showcase: 'Gaming Shorts Sample Pack',
      breakdown: 'Before/After Gameplay Clip Breakdown',
      process: 'Retention Editing Process Walkthrough',
    },
  },
  educational: {
    video: {
      showcase: 'Tutorial-to-Shorts Sample Pack',
      breakdown: 'Lesson Clip Breakdown',
      process: 'Educational Hook Editing Process',
    },
  },
  podcast: {
    video: {
      showcase: 'Podcast Highlights Sample Pack',
      breakdown: 'Interview Clip Breakdown',
      process: 'Episode Moment Selection Process',
    },
  },
  ai_startups: {
    wordpress: {
      showcase: 'AI Startup Landing Page Sample',
      breakdown: 'Performance-First Build Breakdown',
      process: 'Website Structure Walkthrough',
    },
  },
  local_business: {
    wordpress: {
      showcase: 'Local Service Website Sample',
      breakdown: 'Contact Flow Breakdown',
      process: 'Local SEO Page Structure Walkthrough',
    },
  },
  marketing_agencies: {
    wordpress: {
      showcase: 'Agency Plugin Integration Sample',
      breakdown: 'Campaign Tracking Setup Breakdown',
      process: 'Client Handoff Process Walkthrough',
    },
  },
  saas: {
    design: {
      showcase: 'SaaS Dashboard Redesign Concept',
      breakdown: 'User Flow Breakdown',
      process: 'Interface Clarity Walkthrough',
    },
  },
  product_startups: {
    design: {
      showcase: 'MVP Onboarding Redesign',
      breakdown: 'Product Landing Page Breakdown',
      process: 'First-User Journey Walkthrough',
    },
  },
  design_agencies: {
    design: {
      showcase: 'Design System Sample Library',
      breakdown: 'Component System Breakdown',
      process: 'Agency UX Audit Report Sample',
    },
  },
};

const NICHE_PORTFOLIO_DESCRIPTIONS: Record<string, Partial<Record<ServiceCategory, { showcase: string; breakdown: string; process: string }>>> = {
  gaming: {
    video: {
      showcase: 'A sample pack showing how raw gameplay moments are turned into short-form clips with hooks, captions, and tight pacing for Shorts, Reels, and TikTok.',
      breakdown: 'Shows the original gameplay moment, the editing choices made, and how pacing and hook changes improve retention for gaming audiences.',
      process: 'Walks through my complete workflow from VOD review to final export, including clip selection criteria, hook crafting, pacing adjustments, and quality checks.',
    },
  },
  educational: {
    video: {
      showcase: 'A sample pack showing how tutorial and course content is repurposed into short-form clips with clear learning hooks, captions, and tight pacing.',
      breakdown: 'Shows the original teaching moment, the clip structure decisions, and how the edit makes the content more engaging for educational audiences.',
      process: 'Walks through my workflow from lesson review to final clip, including teaching moment selection, hook crafting, and pacing adjustments.',
    },
  },
  podcast: {
    video: {
      showcase: 'A sample pack showing how raw podcast episodes are turned into short-form clips with compelling hooks, visual context, and captions.',
      breakdown: 'Shows the episode moment selection, visual treatment decisions, and how editing captures the conversation value for podcast audiences.',
      process: 'Walks through my workflow from episode review to final clip, including moment selection, audiogram setup, captioning, and quality checks.',
    },
  },
  ai_startups: {
    wordpress: {
      showcase: 'A sample AI startup landing page showing how product value is communicated clearly with performance optimisation and investor-ready design.',
      breakdown: 'Shows the product understanding phase, information architecture decisions, custom theme build, and performance optimisation for AI product websites.',
      process: 'Walks through the complete build process from product discovery to launch-ready handoff, including structure planning, theme development, and quality checks.',
    },
  },
  local_business: {
    wordpress: {
      showcase: 'A sample local service website showing how services are presented clearly with mobile-first design and local SEO optimisation.',
      breakdown: 'Shows how the contact path, service page structure, and mobile layout guide a local visitor toward calling, booking, or submitting an inquiry.',
      process: 'Walks through the complete build process from service discovery to launch, including local SEO structure, mobile optimisation, and lead capture setup.',
    },
  },
  marketing_agencies: {
    wordpress: {
      showcase: 'A sample agency campaign integration showing how forms, tracking, and CRM connections are prepared for client handoff.',
      breakdown: 'Shows how forms, tracking tags, CRM connections, and campaign page checks are prepared before client handoff.',
      process: 'Walks through the complete integration setup from campaign requirements to client-ready handoff checklist, including plugin config, tracking test, and QA.',
    },
  },
  saas: {
    design: {
      showcase: 'A sample SaaS dashboard redesign showing improved information hierarchy, reduced visual noise, and a reusable component system.',
      breakdown: 'Shows the before/after user journey, the friction points found, and the interface decisions used to make the flow easier to understand.',
      process: 'Walks through the complete redesign process from UX audit to developer-ready handoff, including wireframing, visual design, and component documentation.',
    },
  },
  product_startups: {
    design: {
      showcase: 'A sample product onboarding redesign showing how first-time users are guided toward the core value with clearer interface decisions.',
      breakdown: 'Shows the original user journey, the friction points identified, and the redesign decisions that help users reach value faster.',
      process: 'Walks through the complete design process from user flow mapping to prototype handoff, including screen design, visual consistency, and documentation.',
    },
  },
  design_agencies: {
    design: {
      showcase: 'A sample design system library showing reusable components, design tokens, and documentation that enable consistent agency delivery.',
      breakdown: 'Shows the component hierarchy, design token structure, and team onboarding materials that help agencies scale their design output.',
      process: 'Walks through the complete system build process from audit to team adoption, including component planning, library creation, and documentation.',
    },
  },
};

export function generatePortfolioAssetIdeas(cat: ServiceCategory, proofTitles: string[], context: string, service: string, uniqueMechanism: string, niche = '') {
  const nicheKey = getNicheKey(niche);
  const nicheNames = NICHE_PORTFOLIO_ASSET_NAMES[nicheKey]?.[cat];
  const nicheDesc = NICHE_PORTFOLIO_DESCRIPTIONS[nicheKey]?.[cat];

  const firstProof = nicheNames?.showcase ?? (proofTitles[0] || 'Sample Project');
  const secondProof = nicheNames?.breakdown ?? (proofTitles[1] || 'Project Case Study');
  const thirdProof = nicheNames?.process ?? (proofTitles[2] || 'Workflow Overview');

  const defaultDescs: Record<ServiceCategory, { showcase: string; breakdown: string; process: string }> = {
    video: {
      showcase: `A polished showcase of ${firstProof} — clips edited for retention with hooks, captions, and tight pacing, tailored for short-form platforms.`,
      breakdown: `Shows the original footage, the editing decisions made, and how pacing and hook changes improve viewer retention.`,
      process: `A step-by-step overview of how I turn long-form content into short-form clips designed for retention and discovery.`,
    },
    wordpress: {
      showcase: `A polished showcase of ${firstProof} — a custom WordPress build with performance optimisation, responsive layout, and clear documentation.`,
      breakdown: `Shows the planning, build decisions, performance testing, and handoff process behind the deliverable.`,
      process: `A step-by-step overview of how I build fast, professional WordPress websites from understanding to launch-ready handoff.`,
    },
    design: {
      showcase: `A polished showcase of ${firstProof} — redesigned product interfaces with clear information hierarchy, consistent design system, and developer-ready files.`,
      breakdown: `Shows the before/after comparison, the UX decisions made, and how the redesign improves user flow.`,
      process: `A step-by-step overview of how I design clearer product interfaces from user research to developer-ready handoff.`,
    },
  };

  const desc = nicheDesc
    ? {
        showcase: nicheDesc.showcase,
        breakdown: nicheDesc.breakdown,
        process: nicheDesc.process,
      }
    : defaultDescs[cat];

  return [
    {
      name: firstProof,
      format: 'Case study page + social post',
      description: desc.showcase,
      whatToInclude: `The ${firstProof} itself, a short description of the process, key outcomes, tools used, and what the client or viewer should take away`,
      whereToPublish: 'Personal portfolio website, LinkedIn featured section',
      cta: 'View full portfolio \u2014 DM me to discuss your project',
    },
    {
      name: secondProof,
      format: 'Case study page + social post',
      description: desc.breakdown,
      whatToInclude: `The challenge or scenario, your approach, the ${secondProof}, what was delivered, what was learned`,
      whereToPublish: 'Portfolio site, LinkedIn article, Dribbble/Behance',
      cta: 'See how I work \u2014 book a free discovery call',
    },
    {
      name: thirdProof,
      format: 'Process doc + Loom walkthrough',
      description: desc.process,
      whatToInclude: `${uniqueMechanism ? 'Unique mechanism: ' + uniqueMechanism : 'My workflow'}, timeline from start to delivery, tools used, communication approach`,
      whereToPublish: 'Notion page, Google Doc shared on portfolio, LinkedIn post',
      cta: 'Want this process for your project? Let\u2019s talk',
    },
  ];
}

const NICHE_CONTENT_IDEAS: Record<string, Partial<Record<ServiceCategory, { title: string; hook: string; format: string; mainPoints: string; cta: string; platformSuggestion: string }[]>>> = {
  gaming: {
    video: [
      {
        title: 'Why Most Gaming Clips Lose Viewers in the First 3 Seconds',
        hook: 'There is one mistake that kills engagement before your clip even starts playing.',
        format: 'LinkedIn Post',
        mainPoints: 'The 3-second problem on short-form platforms, why hooks matter more than gameplay quality, how to test your hook before posting, expected retention improvement',
        cta: 'DM me your latest gaming clip for a hook quick review',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'How I Turn Gameplay Streams Into Short Clips That Get More Views',
        hook: 'The same gameplay footage can work twice as hard with the right editing approach.',
        format: 'Twitter/X Thread',
        mainPoints: 'Footage review process, clip selection criteria, hook crafting, pacing adjustments, caption setup for gaming content',
        cta: 'Save this thread for your next editing session',
        platformSuggestion: 'X (Twitter)',
      },
      {
        title: '3 Editing Mistakes That Kill Your Gaming Short-Form Retention',
        hook: 'These small editing choices can make viewers swipe away in under a second.',
        format: 'LinkedIn Carousel',
        mainPoints: 'Mistake 1: slow intro on gameplay clips, Mistake 2: no visual variety in streams, Mistake 3: weak captions for gaming audiences, how to fix each',
        cta: 'Connect for more gaming content editing insights',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'My Short-Form Clip Workflow for Gaming Content: From Raw Stream to Published Reel',
        hook: 'A repeatable system for turning any gameplay footage into viral short clips.',
        format: 'Blog Post',
        mainPoints: 'Step-by-step workflow from VOD review to final export, tools used, time per clip, quality checks for gaming content',
        cta: 'Subscribe for weekly gaming editing tips',
        platformSuggestion: 'Blog / Newsletter',
      },
      {
        title: 'Before/After: Fixing a Gaming Clip That Wasn\u2019t Working',
        hook: 'Small changes in pacing and structure turned a flat gameplay clip into a high-retention short.',
        format: 'Case Study',
        mainPoints: 'Original clip analysis, problems identified, editing changes made, after clip result, key takeaways for gaming creators',
        cta: 'See the full breakdown on my portfolio',
        platformSuggestion: 'Portfolio / LinkedIn',
      },
    ],
  },
  educational: {
    video: [
      {
        title: 'Why Most Educational Content Loses Students in the First 10 Seconds',
        hook: 'Even the best lesson gets skipped if the intro does not grab attention.',
        format: 'LinkedIn Post',
        mainPoints: 'The attention problem in educational content, why hooks matter, how to open a tutorial effectively, expected retention improvements',
        cta: 'DM me your latest educational video for a hook quick review',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'How I Turn Course Lessons Into Short Clips That Drive Enrollment',
        hook: 'Your best teaching moments can attract new students when repurposed for short-form platforms.',
        format: 'Twitter/X Thread',
        mainPoints: 'Lesson review process, moment selection for social clips, hook crafting for educational content, pacing adjustments, caption setup',
        cta: 'Save this thread for your next content batch',
        platformSuggestion: 'X (Twitter)',
      },
      {
        title: '3 Mistakes Educators Make When Repurposing Content for Shorts',
        hook: 'These small choices can make your educational clips feel flat and lose student interest.',
        format: 'LinkedIn Carousel',
        mainPoints: 'Mistake 1: no clear learning hook, Mistake 2: cramming too much information, Mistake 3: weak visual structure, how to fix each',
        cta: 'Connect for more educational content tips',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'My Workflow for Turning Course Content Into Short-Form Learning Clips',
        hook: 'A repeatable system for extracting the most valuable teaching moments from any lesson.',
        format: 'Blog Post',
        mainPoints: 'Step-by-step workflow from lesson review to final clip, tools used, time per clip, quality checks for educational content',
        cta: 'Subscribe for weekly educational editing insights',
        platformSuggestion: 'Blog / Newsletter',
      },
      {
        title: 'Before/After: Repurposing a Tutorial Into a High-Engagement Short',
        hook: 'Small structural changes turned a standard tutorial into a clip that students actually watch and share.',
        format: 'Case Study',
        mainPoints: 'Original tutorial analysis, problems identified, editing changes made, after clip result, key takeaways for educators',
        cta: 'See the full breakdown on my portfolio',
        platformSuggestion: 'Portfolio / LinkedIn',
      },
    ],
  },
  podcast: {
    video: [
      {
        title: 'Why Most Podcast Clips Fail to Drive Listenership',
        hook: 'A podcast clip that does not hook within the first 2 seconds will not drive new listeners.',
        format: 'LinkedIn Post',
        mainPoints: 'The clip-first discovery problem for podcasts, why hooks matter for audio content, how to select interview moments, expected listen-through rate improvement',
        cta: 'DM me your latest podcast episode for a clip quick review',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'How I Turn Podcast Interviews Into Short Clips That Drive Show Growth',
        hook: 'The best interview moments can work as standalone content that attracts new listeners.',
        format: 'Twitter/X Thread',
        mainPoints: 'Episode review process, moment selection criteria, hook crafting for podcast clips, pacing and caption setup, audiogram tips',
        cta: 'Save this thread for your next clip batch',
        platformSuggestion: 'X (Twitter)',
      },
      {
        title: '3 Mistakes Podcasters Make When Creating Short-Form Clips',
        hook: 'These common mistakes make podcast clips feel flat and fail to drive listens.',
        format: 'LinkedIn Carousel',
        mainPoints: 'Mistake 1: no visual context, Mistake 2: picking the wrong moment, Mistake 3: weak captions for audio-heavy content, how to fix each',
        cta: 'Connect for more podcast clip insights',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'My Podcast-to-Clips Workflow: From Raw Episode to Published Short',
        hook: 'A repeatable system for extracting the strongest moments from any podcast episode.',
        format: 'Blog Post',
        mainPoints: 'Step-by-step workflow from episode review to final clip, tools for audiograms and captions, time per clip, quality checks for podcast content',
        cta: 'Subscribe for weekly podcast clip tips',
        platformSuggestion: 'Blog / Newsletter',
      },
      {
        title: 'Before/After: Turning a Podcast Interview Into a Viral Short',
        hook: 'The right moment selection and visual treatment turned a simple interview clip into a high-engagement short.',
        format: 'Case Study',
        mainPoints: 'Original episode analysis, moment selection decisions, editing and captioning changes, after clip result, key takeaways for podcasters',
        cta: 'See the full breakdown on my portfolio',
        platformSuggestion: 'Portfolio / LinkedIn',
      },
    ],
  },
  ai_startups: {
    wordpress: [
      {
        title: 'Why Most AI Startup Websites Fail to Convert Visitors',
        hook: 'Even the most innovative AI products lose credibility with a slow or unclear website.',
        format: 'LinkedIn Post',
        mainPoints: 'Common conversion mistakes AI startup websites make, why each hurts investor and customer trust, how to fix each, expected conversion improvement',
        cta: 'DM me for a free 2-minute AI startup website audit',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'How I Built a Fast, Investor-Ready WordPress Site for a Seed-Stage AI Company',
        hook: 'A strong AI startup needs a website that loads fast, explains the product clearly, and feels trustworthy from the first scroll.',
        format: 'Twitter/X Thread',
        mainPoints: 'Product understanding phase, structure planning for AI products, custom theme build, performance optimisation, handoff',
        cta: 'Save this thread for your next AI startup website build',
        platformSuggestion: 'X (Twitter)',
      },
      {
        title: '5 Website Mistakes AI Founders Should Fix Before Launch',
        hook: 'These small issues can make a promising AI startup look less credible to investors and early adopters.',
        format: 'LinkedIn Carousel',
        mainPoints: 'Mistake 1 through 5, why each matters for AI startup trust and conversion, how to fix each one',
        cta: 'Connect to learn how I help AI startups launch better websites',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'My Performance-First Website Build Checklist for AI Startups',
        hook: 'Before any AI startup site goes live, I check these key performance and UX points to ensure quality.',
        format: 'Blog Post',
        mainPoints: 'Complete checklist by category, tools used for testing, performance targets, common fixes for AI product sites',
        cta: 'Subscribe for more web development insights',
        platformSuggestion: 'Blog / Newsletter',
      },
      {
        title: 'Before/After: Turning a Basic AI Startup Landing Page Into a Sharper Launch Site',
        hook: 'A clearer structure and better content hierarchy can make an AI product website feel more professional instantly.',
        format: 'Case Study',
        mainPoints: 'Before state analysis, problems identified, design and structure changes, after state, performance improvements',
        cta: 'See the full case study on my portfolio',
        platformSuggestion: 'Portfolio / LinkedIn',
      },
    ],
  },
  local_business: {
    wordpress: [
      {
        title: 'Why Most Local Business Websites Lose Customers Before They Call',
        hook: 'A slow, unclear website is costing your business real walk-in traffic and phone calls.',
        format: 'LinkedIn Post',
        mainPoints: 'Common mistakes local business websites make, why each loses customer trust, how to fix each, expected lead increase',
        cta: 'DM me for a free 2-minute local business website audit',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'How I Built a Lead-Generating WordPress Site for a Local Service Business',
        hook: 'A clear, fast website built around local search can bring in new customers every week.',
        format: 'Twitter/X Thread',
        mainPoints: 'Business understanding phase, local SEO structure planning, theme build with service focus, performance and mobile optimisation, handoff',
        cta: 'Save this thread for your next local business website build',
        platformSuggestion: 'X (Twitter)',
      },
      {
        title: '5 Website Mistakes Local Business Owners Should Fix Today',
        hook: 'These simple fixes can help your website show up in local search and convert more visitors.',
        format: 'LinkedIn Carousel',
        mainPoints: 'Mistake 1 through 5, why each matters for local visibility and trust, how to fix each one',
        cta: 'Connect to learn how I help local businesses grow online',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'My Local Business Website Build Checklist: From Discovery to Launch',
        hook: 'Every local business site I build goes through these quality checks before going live.',
        format: 'Blog Post',
        mainPoints: 'Complete checklist by phase, tools used for local SEO testing, performance targets, common local business site fixes',
        cta: 'Subscribe for more local business web tips',
        platformSuggestion: 'Blog / Newsletter',
      },
      {
        title: 'Before/After: Transforming a Local Business Website Into a Lead Machine',
        hook: 'A clearer service layout and mobile-first design turned a basic site into a steady source of inquiries.',
        format: 'Case Study',
        mainPoints: 'Before state analysis, problems identified, design and content changes, after state, traffic and lead improvements',
        cta: 'See the full case study on my portfolio',
        platformSuggestion: 'Portfolio / LinkedIn',
      },
    ],
  },
  marketing_agencies: {
    wordpress: [
      {
        title: 'Why Your Agency Website Is Losing Potential Clients',
        hook: 'A slow, unfocused website can make even the best agency look unprofessional.',
        format: 'LinkedIn Post',
        mainPoints: 'Common mistakes agency websites make, why each hurts new business, how to fix each, expected improvement in inbound inquiries',
        cta: 'DM me for a free 2-minute agency website audit',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'How I Built a High-Conversion WordPress Site for a Growing Marketing Agency',
        hook: 'An agency needs a website that showcases results and makes it easy for prospects to take the next step.',
        format: 'Twitter/X Thread',
        mainPoints: 'Brand and service understanding, portfolio structure planning, custom theme with case study focus, performance optimisation, handoff',
        cta: 'Save this thread for your next agency website project',
        platformSuggestion: 'X (Twitter)',
      },
      {
        title: '5 Website Elements Every Agency Should Have to Attract Better Clients',
        hook: 'These specific pages and sections can turn a basic agency website into a client attraction system.',
        format: 'LinkedIn Carousel',
        mainPoints: 'Element 1 through 5, why each builds client trust, how to implement each one effectively',
        cta: 'Connect to learn how I help agencies build better websites',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'My Agency Website Build Process: From Discovery to Client-Ready Launch',
        hook: 'A repeatable process for building websites that help agencies win more business.',
        format: 'Blog Post',
        mainPoints: 'Complete process from discovery to launch, tools for portfolio showcases, performance and SEO checklist, handoff documentation',
        cta: 'Subscribe for more agency web development insights',
        platformSuggestion: 'Blog / Newsletter',
      },
      {
        title: 'Before/After: Giving a Marketing Agency a Website That Reflects Their Work Quality',
        hook: 'The right structure and portfolio presentation can make an agency website feel as polished as the work they deliver.',
        format: 'Case Study',
        mainPoints: 'Before state analysis, structure and design issues identified, changes made, after state, client feedback and results',
        cta: 'See the full case study on my portfolio',
        platformSuggestion: 'Portfolio / LinkedIn',
      },
    ],
  },
  saas: {
    design: [
      {
        title: 'Why Most SaaS Products Lose Users at First Login',
        hook: 'The first 30 seconds of your product experience determine whether users stay or churn.',
        format: 'LinkedIn Post',
        mainPoints: 'Common UX friction points in SaaS onboarding, why each hurts activation, how to fix each with clearer design, before/after comparison',
        cta: 'DM me for a quick UX review of your SaaS product',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'How I Redesigned a SaaS Dashboard for Better User Engagement',
        hook: 'Small layout and information hierarchy changes made the product noticeably easier to use.',
        format: 'Twitter/X Thread',
        mainPoints: 'Original dashboard assessment, user flow issues identified, redesign approach, key changes, engagement outcome',
        cta: 'Save this thread for your next SaaS redesign project',
        platformSuggestion: 'X (Twitter)',
      },
      {
        title: '5 SaaS UI Patterns That Look Good But Hurt User Experience',
        hook: 'These common design choices appear polished but create real friction for users.',
        format: 'LinkedIn Carousel',
        mainPoints: 'Pattern 1 through 5, why each creates friction for SaaS users, better alternatives with examples',
        cta: 'Let\u2019s talk about improving your SaaS product\u2019s UX',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'My Design System Checklist for Consistent SaaS Interfaces',
        hook: 'A well-built design system saves development time and creates a cohesive product experience.',
        format: 'Blog Post',
        mainPoints: 'Key design system components for SaaS, how to build and maintain one, tools and resources, common pitfalls',
        cta: 'Subscribe for more SaaS UX design insights',
        platformSuggestion: 'Blog / Newsletter',
      },
      {
        title: 'Before/After: Improving a SaaS Onboarding Flow to Reduce Drop-Off',
        hook: 'A redesigned onboarding flow helped users reach the product\u2019s core value faster.',
        format: 'Case Study',
        mainPoints: 'Original flow with drop-off points, user research findings, redesign decisions, improved flow with engagement metrics',
        cta: 'Read the full case study on my portfolio',
        platformSuggestion: 'Portfolio / LinkedIn',
      },
    ],
  },
  product_startups: {
    design: [
      {
        title: 'Why Early-Stage Product Startups Need Better Landing Pages',
        hook: 'Your landing page is often the first impression potential users and investors get of your product.',
        format: 'LinkedIn Post',
        mainPoints: 'Common landing page mistakes for new products, why each reduces credibility, how to fix each, expected conversion improvement',
        cta: 'DM me for a quick landing page review for your product',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'How I Designed a Product Landing Page That Communicated Value Instantly',
        hook: 'A clear landing page structure helped an early-stage product explain what it does in under 5 seconds.',
        format: 'Twitter/X Thread',
        mainPoints: 'Product and audience understanding, value proposition structuring, visual hierarchy decisions, key design choices, launch outcome',
        cta: 'Save this thread for your next product landing page design',
        platformSuggestion: 'X (Twitter)',
      },
      {
        title: '5 Product Interface Decisions That Confuse First-Time Users',
        hook: 'These design choices can make new users feel lost before they reach your product\u2019s core value.',
        format: 'LinkedIn Carousel',
        mainPoints: 'Decision 1 through 5, why each confuses first-time users, better alternatives with examples',
        cta: 'Let\u2019s talk about improving your product\u2019s first-user experience',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'My Product Design Workflow: From Concept to Developer-Ready Handoff',
        hook: 'A structured design process that helps product startups move from idea to launch-ready interface.',
        format: 'Blog Post',
        mainPoints: 'Complete design workflow stages, tools used, deliverables per stage, handoff documentation best practices',
        cta: 'Subscribe for more product design insights',
        platformSuggestion: 'Blog / Newsletter',
      },
      {
        title: 'Before/After: Designing a Clearer Onboarding Screen for a New Product',
        hook: 'A redesigned first-use experience helped users understand the product value in seconds instead of minutes.',
        format: 'Case Study',
        mainPoints: 'Original onboarding assessment, usability issues identified, redesign decisions, improved flow, user feedback',
        cta: 'Read the full case study on my portfolio',
        platformSuggestion: 'Portfolio / LinkedIn',
      },
    ],
  },
  design_agencies: {
    design: [
      {
        title: 'Why Design Agencies Need a Stronger Portfolio Website',
        hook: 'Your portfolio should demonstrate your design thinking, not just show finished screens.',
        format: 'LinkedIn Post',
        mainPoints: 'Common portfolio website mistakes for design agencies, why each loses potential client interest, how to fix each, expected inquiry improvement',
        cta: 'DM me for a quick portfolio website review',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'How I Designed a Design System That Helped an Agency Scale Client Work',
        hook: 'A reusable component system can dramatically improve an agency\u2019s delivery speed and consistency.',
        format: 'Twitter/X Thread',
        mainPoints: 'Agency workflow assessment, component library planning, design system build, team adoption, scaling results',
        cta: 'Save this thread for your next design system project',
        platformSuggestion: 'X (Twitter)',
      },
      {
        title: '5 Mistakes Agencies Make When Presenting Design Work to Clients',
        hook: 'These presentation choices can make strong design work feel weaker to clients.',
        format: 'LinkedIn Carousel',
        mainPoints: 'Mistake 1 through 5, why each reduces client confidence, how to fix each with better presentation techniques',
        cta: 'Connect to talk about improving your agency\u2019s design delivery',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'My Design System Development Process for Agency Teams',
        hook: 'A repeatable approach to building design systems that agencies can use across multiple client projects.',
        format: 'Blog Post',
        mainPoints: 'Complete development process from audit to handoff, tools and frameworks, team onboarding, maintenance practices',
        cta: 'Subscribe for more design system insights',
        platformSuggestion: 'Blog / Newsletter',
      },
      {
        title: 'Before/After: Building a Design System That Transformed an Agency\u2019s Workflow',
        hook: 'A structured design system helped an agency reduce delivery time and improve client satisfaction.',
        format: 'Case Study',
        mainPoints: 'Before state with fragmented design assets, problems identified, design system build process, after state with efficiency metrics',
        cta: 'Read the full case study on my portfolio',
        platformSuggestion: 'Portfolio / LinkedIn',
      },
    ],
  },
};

export function generateContentAssetIdeas(cat: ServiceCategory, audience: string, offerName: string, niche = '', serviceId?: string) {
  const a = audience;
  const offer = offerName || 'your service';

  if (serviceId === 'plugin_integration_dev' && getNicheKey(niche) === 'marketing_agencies') {
    return [
      {
        title: 'Why Agency Campaign Pages Break Before Launch',
        hook: 'There is one key reason client campaigns hit last-minute technical delays.',
        format: 'LinkedIn Post',
        mainPoints: 'Why campaign setups fail at launch, form and CRM connection issues, tracking tag misalignment, how white-label support solves it',
        cta: 'DM me to review your next campaign setup',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: 'How to Check Forms, CRM, and Tracking Before Client Handoff',
        hook: 'A simple verification flow ensures client landing pages work perfectly on day one.',
        format: 'LinkedIn Post',
        mainPoints: 'Step-by-step verification checklist, verifying CRM form submission, checking tracking pixels, handoff document templates',
        cta: 'Get my campaign handoff checklist',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: '5 WordPress Integration Issues Agencies Should Catch Early',
        hook: 'Catch these technical plugin issues early to avoid campaign launch friction.',
        format: 'LinkedIn Carousel',
        mainPoints: 'Issue 1 to 5: disconnected forms, missing tracking tags, plugin version conflicts, booking redirects, API connection failure, how to solve each',
        cta: 'Connect for reliable agency integration support',
        platformSuggestion: 'LinkedIn',
      },
    ];
  }

  const defaults: Record<ServiceCategory, { title: string; hook: string; format: string; mainPoints: string; cta: string; platformSuggestion: string }[]> = {
    video: [
      {
        title: `Why Most ${a} Content Loses Viewers in the First 3 Seconds`,
        hook: `There is one mistake that kills engagement before your content even starts playing.`,
        format: 'LinkedIn Post',
        mainPoints: `The 3-second problem, why hooks matter more than production quality, how to test your hook before posting, expected retention improvement`,
        cta: `DM me your latest video for a hook quick review`,
        platformSuggestion: 'LinkedIn',
      },
      {
        title: `How I Turn Long-Form Content Into Short Clips That Get More Views`,
        hook: `The same footage can work twice as hard with the right editing approach.`,
        format: 'Twitter/X Thread',
        mainPoints: `Footage review process, clip selection criteria, hook crafting, pacing adjustments, caption setup`,
        cta: 'Save this thread for your next editing session',
        platformSuggestion: 'X (Twitter)',
      },
      {
        title: `3 Editing Mistakes That Kill Your Short-Form Retention`,
        hook: `These small editing choices can make viewers swipe away in under a second.`,
        format: 'LinkedIn Carousel',
        mainPoints: `Mistake 1: slow intro, Mistake 2: no visual variety, Mistake 3: weak captions, how to fix each`,
        cta: 'Connect for more content editing insights',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: `My Short-Form Clip Workflow: From Raw Footage to Published Reel`,
        hook: `A repeatable system for turning any long-form content into short clips.`,
        format: 'Blog Post',
        mainPoints: `Step-by-step workflow from footage review to final export, tools used, time per clip, quality checks`,
        cta: 'Subscribe for weekly editing tips',
        platformSuggestion: 'Blog / Newsletter',
      },
      {
        title: `Before/After: Fixing a Video Clip That Wasn\u2019t Working`,
        hook: `Small changes in pacing and structure turned a flat clip into a high-retention short.`,
        format: 'Case Study',
        mainPoints: `Original clip analysis, problems identified, editing changes made, after clip result, key takeaways`,
        cta: 'See the full breakdown on my portfolio',
        platformSuggestion: 'Portfolio / LinkedIn',
      },
    ],
    wordpress: [
      {
        title: `Why Most ${a} Websites Fail to Convert Visitors`,
        hook: `Most ${a} websites explain the product clearly but fail to guide visitors toward action.`,
        format: 'LinkedIn Post',
        mainPoints: `Common conversion mistakes ${a} make, why each one hurts trust, how to fix each, expected conversion improvement`,
        cta: `DM me for a free 2-minute website audit`,
        platformSuggestion: 'LinkedIn',
      },
      {
        title: `How I Built a Fast, Conversion-Ready WordPress Site`,
        hook: `A strong startup needs a website that loads fast, explains the product clearly, and feels trustworthy from the first scroll.`,
        format: 'Twitter/X Thread',
        mainPoints: `Product understanding phase, structure planning, theme build, performance optimisation, handoff`,
        cta: 'Save this thread for your next website build',
        platformSuggestion: 'X (Twitter)',
      },
      {
        title: `5 Website Mistakes You Should Fix Before Launch`,
        hook: `These small issues can make a promising startup look less credible to investors and early customers.`,
        format: 'LinkedIn Carousel',
        mainPoints: `Mistake 1 through 5, why each matters for trust and conversion, how to fix each one`,
        cta: 'Connect to learn how I help startups launch better',
        platformSuggestion: 'LinkedIn',
      },
      {
        title: `My Performance-First Website Build Checklist`,
        hook: `Before any site goes live, I check these key performance and UX points to ensure quality.`,
        format: 'Blog Post',
        mainPoints: `Complete checklist by category, tools used for testing, performance targets, common fixes`,
        cta: 'Subscribe for more web development insights',
        platformSuggestion: 'Blog / Newsletter',
      },
      {
        title: `Before/After: Turning a Basic Startup Website Into a Sharper Landing Page`,
        hook: `A clearer structure and better content hierarchy can make a website feel more professional instantly.`,
        format: 'Case Study',
        mainPoints: `Before state analysis, problems identified, design and structure changes, after state, performance and UX improvements`,
        cta: 'See the full case study on my portfolio',
        platformSuggestion: 'Portfolio / LinkedIn',
      },
    ],
    design: [
      {
        title: `Why Most Products Lose Users at First Interaction`,
        hook: `The first few seconds of a user's experience determine whether they stay or leave for good.`,
        format: 'LinkedIn Post',
        mainPoints: `Common UX friction points on first visit, why they hurt activation, how to fix each, before/after comparison`,
        cta: `DM me for a quick UX review of your product`,
        platformSuggestion: 'LinkedIn',
      },
      {
        title: `How I Redesigned a Product Interface for Better User Engagement`,
        hook: `Small layout and hierarchy changes made the product noticeably easier to navigate.`,
        format: 'Twitter/X Thread',
        mainPoints: `Original design assessment, user flow issues identified, redesign approach, key changes, outcome`,
        cta: 'Save this thread for your next redesign project',
        platformSuggestion: 'X (Twitter)',
      },
      {
        title: `5 UI Patterns That Look Good But Hurt User Experience`,
        hook: `These common UI choices appear polished but create real friction for users.`,
        format: 'LinkedIn Carousel',
        mainPoints: `Pattern 1 through 5, why each creates friction, better alternatives with examples`,
        cta: `Let\u2019s talk about improving your product\u2019s UX`,
        platformSuggestion: 'LinkedIn',
      },
      {
        title: `My Design System Checklist for Consistent Product Interfaces`,
        hook: `A well-built design system saves development time and creates a cohesive user experience.`,
        format: 'Blog Post',
        mainPoints: `Key design system components, how to build and maintain one, tools and resources, common pitfalls`,
        cta: 'Subscribe for more UX design insights',
        platformSuggestion: 'Blog / Newsletter',
      },
      {
        title: `Before/After: Improving a Product Onboarding Flow`,
        hook: `A redesigned onboarding flow can reduce drop-off and get users to value faster.`,
        format: 'Case Study',
        mainPoints: `Original flow with drop-off points, user research findings, redesign decisions, improved flow with metrics`,
        cta: 'Read the full case study on my portfolio',
        platformSuggestion: 'Portfolio / LinkedIn',
      },
    ],
  };

  const nicheKey = getNicheKey(niche);
  const nicheOverrides = NICHE_CONTENT_IDEAS[nicheKey];

  if (nicheOverrides?.[cat]) {
    return (nicheOverrides[cat] as typeof defaults['video']).map((t) => ({
      ...t,
      title: t.title,
      hook: t.hook,
    }));
  }

  return defaults[cat].map((t) => ({
    ...t,
    title: t.title,
    hook: t.hook,
  }));
}

const NICHE_OFFER_NAMES: Record<string, Partial<Record<ServiceCategory, Record<string, string[]>>>> = {
  gaming: {
    video: {
      retainer: ['Gaming Shorts Growth Package', 'Stream-to-Shorts Retainer', 'Clip Publishing System', 'VOD Clip Retainer'],
      one_time_project: ['Gaming Clip Pack', 'Stream Highlight Batch', 'Short-Form Edit Sprint', 'Moment Extraction Pack'],
      milestone_based: ['Gaming Content Rollout Plan', 'Clip-by-Clip Publishing Track', 'Stream Series Edit Track'],
    },
  },
  educational: {
    video: {
      retainer: ['Educational Clip Retainer', 'Course Content Repurpose Package', 'Lesson-to-Shorts System'],
      one_time_project: ['Tutorial Clip Pack', 'Course Content Batch', 'Educational Short-Form Sprint'],
      milestone_based: ['Course Launch Clip Track', 'Lesson-by-Lesson Content Rollout'],
    },
  },
  podcast: {
    video: {
      retainer: ['Podcast Clip Retainer', 'Episode Repurpose Package', 'Show Growth Clip System'],
      one_time_project: ['Podcast Clip Pack', 'Interview Highlight Batch', 'Episode-to-Short Sprint'],
      milestone_based: ['Podcast Season Clip Track', 'Episode-by-Episode Content Rollout'],
    },
  },
  ai_startups: {
    wordpress: {
      retainer: ['AI Startup Website Retainer', 'Product Launch Site Plan', 'Growth-Ready WP Package'],
      one_time_project: ['AI Startup Launch Package', 'Product Landing Page Build', 'Waitlist-to-Launch Site'],
      milestone_based: ['MVP Website Track', 'Product Launch Rollout Plan'],
    },
  },
  local_business: {
    wordpress: {
      retainer: ['Local Business Website Retainer', 'Service Area Growth Plan', 'Lead Generation Site Package'],
      one_time_project: ['Local Business Launch Package', 'Service Page Build', 'Local SEO Website Setup'],
      milestone_based: ['Local Presence Build Track', 'Service-by-Service Rollout Plan'],
    },
  },
  marketing_agencies: {
    wordpress: {
      retainer: ['Agency Website Retainer', 'Portfolio Growth Plan', 'Client Lead System Package'],
      one_time_project: ['Agency Launch Package', 'Portfolio Site Build', 'Case Study Website Setup'],
      milestone_based: ['Agency Site Build Track', 'Service-by-Service Rollout Plan'],
    },
  },
  saas: {
    design: {
      retainer: ['SaaS Design Retainer', 'Product Interface Partnership', 'UX Improvement Plan'],
      one_time_project: ['SaaS Interface Clarity Package', 'Landing Page Redesign', 'UX Audit & Improvement'],
      milestone_based: ['Product Redesign Track', 'UX Research & Rollout Plan'],
    },
  },
  product_startups: {
    design: {
      retainer: ['Product Design Retainer', 'Startup Interface Partnership', 'MVP Design Plan'],
      one_time_project: ['Product Landing Page Package', 'MVP Interface Design', 'UX Foundation Setup'],
      milestone_based: ['Product Launch Design Track', 'Feature-by-Feature Rollout Plan'],
    },
  },
  design_agencies: {
    design: {
      retainer: ['Design System Retainer', 'Agency Design Partnership', 'Component Library Plan'],
      one_time_project: ['Design System Build Package', 'Agency Portfolio Redesign', 'UX Research & System Setup'],
      milestone_based: ['Design System Rollout Track', 'Component-by-Component Build Plan'],
    },
  },
  fitness_coaches: {
    video: {
      retainer: ['Fitness Content Clip Retainer', 'Coach Short-Form Growth Package', 'Workout-to-Shorts System'],
      one_time_project: ['Fitness Clip Pack', 'Transformation Batch Edit', 'Coach Short-Form Sprint'],
      milestone_based: ['Fitness Content Rollout Track', 'Transformation Story-by-Story Plan'],
    },
  },
  youtubers_retention: {
    video: {
      retainer: ['YouTube Clip Retainer', 'Long-to-Short Content Package', 'Channel Growth Clip System'],
      one_time_project: ['YouTube Clip Pack', 'Video Moment Batch Edit', 'Creator Short-Form Sprint'],
      milestone_based: ['Content Rollout Track', 'Video-by-Video Clip Plan'],
    },
  },
  course_creators: {
    video: {
      retainer: ['Course Content Clip Retainer', 'Lesson Repurpose Package', 'Course-to-Shorts System'],
      one_time_project: ['Lesson Clip Pack', 'Course Content Batch', 'Educational Short-Form Sprint'],
      milestone_based: ['Course Launch Clip Track', 'Lesson-by-Lesson Content Rollout'],
    },
  },
  restaurants: {
    wordpress: {
      retainer: ['Restaurant Website Retainer', 'Menu Growth Package', 'Local SEO Site Plan'],
      one_time_project: ['Restaurant Launch Package', 'Menu-Optimised Site Build', 'Online Ordering Website Setup'],
      milestone_based: ['Restaurant Site Build Track', 'Menu-by-Menu Rollout Plan'],
    },
  },
  coaches: {
    wordpress: {
      retainer: ['Coach Website Retainer', 'Authority Site Growth Plan', 'Client Booking System Package'],
      one_time_project: ['Coach Website Launch Package', 'Authority Site Build', 'Booking Funnel Website Setup'],
      milestone_based: ['Coach Site Build Track', 'Service-by-Service Rollout Plan'],
    },
    design: {
      retainer: ['Coach Platform Design Retainer', 'Coach Portal Interface Partnership', 'Client Experience Design Plan'],
      one_time_project: ['Coach Platform Clarity Package', 'Portal Interface Redesign', 'Booking Flow UX Improvement'],
      milestone_based: ['Coach Platform Redesign Track', 'Feature-by-Feature UX Rollout Plan'],
    },
  },
  personal_brand_creators: {
    design: {
      retainer: ['Creator Interface Design Retainer', 'Personal Brand Platform Partnership', 'Audience Experience Plan'],
      one_time_project: ['Creator Dashboard Clarity Package', 'Brand Interface Redesign', 'Audience Flow UX Setup'],
      milestone_based: ['Creator Platform Redesign Track', 'Screen-by-Screen Rollout Plan'],
    },
  },
  saas_startups: {
    design: {
      retainer: ['SaaS Design Retainer', 'Product Interface Partnership', 'UX Improvement Plan'],
      one_time_project: ['SaaS Activation Flow Package', 'Onboarding Redesign', 'UX Audit & Improvement'],
      milestone_based: ['SaaS Product Redesign Track', 'Flow-by-Flow UX Rollout Plan'],
    },
  },
};

const SERVICE_OFFER_NAMES: Record<string, Record<string, Record<string, string[]>>> = {
  plugin_integration_dev: {
    marketing_agencies: {
      retainer: [
        'Marketing Tool Integration Connector',
        'Agency Plugin Integration Support',
        'Form + Tracking + CRM Integration Package',
        'Campaign Setup Integration System'
      ],
      one_time_project: [
        'Marketing Tool Integration Connector',
        'Agency Plugin Integration Support',
        'Form + Tracking + CRM Integration Package',
        'Campaign Setup Integration System'
      ],
      milestone_based: [
        'Marketing Tool Integration Connector',
        'Agency Plugin Integration Support',
        'Form + Tracking + CRM Integration Package',
        'Campaign Setup Integration System'
      ],
    },
    ai_startups: {
      retainer: ['Plugin Development Retainer', 'Integration Partnership Plan', 'API Connector Support Package'],
      one_time_project: ['AI Plugin Integration Package', 'WordPress Connector Build', 'API-to-Plugin Setup'],
      milestone_based: ['Plugin Development Track', 'Integration-by-Integration Rollout Plan'],
    },
  },
  site_migration_performance: {
    local_business: {
      retainer: ['Site Performance Retainer', 'Migration Support Plan', 'Speed Optimisation Package'],
      one_time_project: ['Site Migration Package', 'Performance Optimisation Setup', 'Host Migration + Zero Downtime'],
      milestone_based: ['Migration Rollout Track', 'Performance-by-Phase Improvement Plan'],
    },
    ai_startups: {
      retainer: ['Startup Site Performance Retainer', 'Growth-Ready Migration Plan', 'Scaling Infrastructure Package'],
      one_time_project: ['AI Startup Migration Package', 'Performance-First Site Relaunch', 'MVP-to-Production Migration'],
      milestone_based: ['Migration & Scaling Track', 'Performance-by-Milestone Improvement Plan'],
    },
  },
};

export function generateOfferName(cat: ServiceCategory, serviceLabel: string, offerType: string, niche = '', serviceId?: string): string {
  const defaults: Record<ServiceCategory, Record<string, string[]>> = {
    video: {
      retainer: ['Shorts Growth Package', 'Stream-to-Shorts Retainer', 'Clip Publishing System'],
      one_time_project: ['Clip Pack', 'Content Repurpose Batch', 'Short-Form Edit Sprint'],
      milestone_based: ['Content Rollout Plan', 'Clip-by-Clip Publishing Track'],
    },
    wordpress: {
      retainer: ['Website Retainer', 'WordPress Growth Package', 'Site Performance Plan'],
      one_time_project: ['Website Launch Package', 'Landing Page Build', 'Site Migration & Optimisation'],
      milestone_based: ['Website Launch Track', 'Build-Phase Rollout Plan'],
    },
    design: {
      retainer: ['Design Retainer', 'Product Interface Partnership', 'Design System Maintenance'],
      one_time_project: ['Interface Clarity Package', 'Landing Page Redesign', 'UX Audit & Improvement'],
      milestone_based: ['Product Redesign Track', 'UX Research & Rollout Plan'],
    },
  };

  const nicheKey = getNicheKey(niche);
  const servicePool = serviceId ? SERVICE_OFFER_NAMES[serviceId]?.[nicheKey]?.[offerType] : undefined;
  const nichePool = NICHE_OFFER_NAMES[nicheKey]?.[cat]?.[offerType];
  const pool = servicePool ?? nichePool ?? defaults[cat]?.[offerType] ?? ['Custom Package'];
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

const NICHE_WHO_ITS_FOR: Record<string, Partial<Record<ServiceCategory, string>>> = {
  gaming: {
    video: 'gaming creators who want to turn gameplay streams and long-form videos into short-form clips designed for retention, discovery, and consistent publishing across Shorts, Reels, and TikTok.',
  },
  educational: {
    video: 'educational creators who want to turn course content and tutorials into short-form clips that drive enrollment, build authority, and reach new students on short-form platforms.',
  },
  podcast: {
    video: 'podcasters who want to turn interview and episode footage into short-form clips that grow show awareness, drive listens, and attract new audiences on short-form platforms.',
  },
  ai_startups: {
    wordpress: 'AI startups who need a clear, fast, professional website that explains their product and turns visitors into leads, signups, or investor interest.',
  },
  local_business: {
    wordpress: 'local businesses who need a professional website that attracts nearby customers, clearly presents their services, and converts visits into calls or bookings.',
  },
  marketing_agencies: {
    wordpress: 'marketing agencies who need a high-performance website that showcases their portfolio, demonstrates expertise, and generates inbound leads.',
  },
  saas: {
    design: 'SaaS teams who want clearer product interfaces and dashboards that reduce user friction, improve activation, and make their product easier to use.',
  },
  product_startups: {
    design: 'product startups who need landing pages and product interfaces that communicate their value proposition and drive early adoption.',
  },
  design_agencies: {
    design: 'design agencies who want scalable design systems and client-ready interfaces that improve delivery speed, consistency, and quality across projects.',
  },
  fitness_coaches: {
    video: 'fitness coaches who want to turn workout footage and client transformation content into short-form clips that attract new clients, build authority, and fill their booking calendar on short-form platforms.',
  },
  youtubers_retention: {
    video: 'YouTube creators who want to turn long-form videos into short-form clips designed for retention, discovery, and subscriber growth across Shorts, Reels, and TikTok.',
  },
  course_creators: {
    video: 'course creators who want to turn lessons and tutorials into short-form clips that drive enrollment, demonstrate teaching quality, and reach new students on short-form platforms.',
  },
  restaurants: {
    wordpress: 'restaurants who need a professional, mobile-friendly website that showcases their menu, attracts local diners, and drives online orders or reservations.',
  },
  coaches: {
    wordpress: 'coaches who need a professional website that presents their services, showcases client results, and makes it easy for potential clients to book a discovery call.',
    design: 'coaches who want a clearer platform interface with streamlined booking and payment flows that build client trust and reduce friction in the signup process.',
  },
  personal_brand_creators: {
    design: 'personal brand creators who want a clearer audience-facing interface that reflects their brand personality and guides followers toward subscription, purchase, or booking.',
  },
  saas_startups: {
    design: 'SaaS startups who need clearer product interfaces and onboarding flows that reduce user friction, improve activation, and help early users reach the core value faster.',
  },
};

const SERVICE_WHO_ITS_FOR: Record<string, Record<string, string>> = {
  plugin_integration_dev: {
    marketing_agencies: 'Marketing agencies that need reliable WordPress technical support for client campaign pages, form setup, CRM/email tool connections, tracking tags, booking tools, and plugin configuration.',
    ai_startups: 'AI startups who need a WordPress plugin that connects their product into users\' existing platforms and reduces adoption friction.',
  },
  site_migration_performance: {
    local_business: 'local businesses who need to migrate from a slow, outdated website to a fast, modern WordPress site that ranks higher and converts more visitors.',
    ai_startups: 'AI startups who need to migrate from a slow MVP site to a high-performance WordPress platform that supports growth and investor confidence.',
  },
};

export function generateWhoItIsFor(cat: ServiceCategory, audience: string, deliverables: string[], niche = '', serviceId?: string): string {
  const defaults: Record<ServiceCategory, string> = {
    video: `${audience} who want to turn long-form content into short-form clips designed for retention, discovery, and consistent publishing.`,
    wordpress: `${audience} who need a clear, fast, professional website that explains their product and turns visitors into leads or signups.`,
    design: `${audience} who want clearer product interfaces that reduce user friction and improve engagement.`,
  };

  const base = nicheContent(cat, niche, defaults, NICHE_WHO_ITS_FOR);
  return serviceId
    ? (SERVICE_WHO_ITS_FOR[serviceId]?.[getNicheKey(niche)] ?? base)
    : base;
}

const NICHE_PROBLEM: Record<string, Partial<Record<ServiceCategory, string>>> = {
  gaming: {
    video: 'Many gaming creators have strong long-form streams and gameplay content, but the best moments stay buried inside VODs instead of being turned into short clips optimised for discovery and retention. Without a repeatable clip system, they miss out on viral growth from short-form platforms.',
  },
  educational: {
    video: 'Many educational creators produce high-quality course content and tutorials, but the most valuable teaching moments stay buried inside long-form lessons instead of reaching new students through short-form platforms.',
  },
  podcast: {
    video: 'Many podcasters record great interviews and conversations, but the strongest moments stay inside full-length episodes instead of being turned into discovery-optimised clips that attract new listeners.',
  },
  ai_startups: {
    wordpress: 'Many AI startups have an innovative product but no professional website that explains their value clearly. This hurts credibility with investors, makes it harder to attract early adopters, and creates extra work every time they pitch their product.',
  },
  local_business: {
    wordpress: 'Many local businesses rely on word-of-mouth but have no professional website that appears in local search. Without a clear, mobile-friendly site, they miss out on customers actively searching for their services online.',
  },
  marketing_agencies: {
    wordpress: 'Many marketing agencies have strong client results but a weak website that fails to showcase their work or generate inbound leads. A poor online presence can make even a high-performing agency look less credible.',
  },
  saas: {
    design: 'Many SaaS products launch with interfaces that confuse users, create friction during onboarding, and hurt activation rates. Without a clear information hierarchy and user flow, even useful features struggle to drive engagement.',
  },
  product_startups: {
    design: 'Many early-stage product startups build useful features but struggle to communicate their value through the interface. First-time users often feel lost, and unclear landing pages fail to convert interest into signups.',
  },
  design_agencies: {
    design: 'Many design agencies deliver great client work but lack scalable design systems and consistent interfaces, leading to slower delivery, quality variability, and higher revision costs across projects.',
  },
  fitness_coaches: {
    video: 'Many fitness coaches have strong workout footage and client transformation content, but the best moments stay buried inside long-form videos instead of being turned into short clips that attract new clients on short-form platforms. Without a consistent clip system, they miss out on discovery growth and booked consultations.',
  },
  youtubers_retention: {
    video: 'Many YouTube creators have strong long-form content with high-retention moments, but those moments stay buried inside full-length videos instead of being turned into short clips that reach new subscribers across short-form platforms.',
  },
  course_creators: {
    video: 'Many course creators produce high-quality lessons and tutorials, but the most valuable teaching moments stay buried inside full courses instead of reaching new students through short-form platforms as discoverable promotional clips.',
  },
  restaurants: {
    wordpress: 'Many restaurants have great food and atmosphere but no professional website that appears in local search, showcases their menu, or makes it easy for hungry customers to find them and place an order.',
  },
  coaches: {
    wordpress: 'Many coaches have strong expertise and client results but no professional website that presents their services, builds authority, or converts visitors into booked discovery calls.',
    design: 'Many coaching platforms grow through feature additions without a coherent interface, leading to confusing booking flows, disconnected payment experiences, and lost client conversions.',
  },
  personal_brand_creators: {
    design: 'Many personal brand creators build platforms with cluttered interfaces that confuse their audience and fail to convert followers into subscribers, customers, or clients.',
  },
  saas_startups: {
    design: 'Many SaaS startups launch with interfaces that confuse users during onboarding, create friction at critical decision points, and hurt activation and retention rates before users ever reach the core value.',
  },
};

const SERVICE_PROBLEM_SOLVES: Record<string, Record<string, string>> = {
  plugin_integration_dev: {
    marketing_agencies: 'Marketing agencies often move fast on client campaigns, but technical setup tasks like forms, CRM connections, analytics tags, booking tools, and plugin configuration can slow delivery and create last-minute issues.',
    ai_startups: 'Many AI startups have a strong product but no way for users to integrate it into their existing workflows. Without a plugin or connector, potential customers face friction and may abandon the tool before experiencing its value.',
  },
  site_migration_performance: {
    local_business: 'Many local businesses are stuck with slow, outdated websites that frustrate potential customers and hurt local search rankings. Even with great service, a poor-performing site drives visitors to faster competitors.',
    ai_startups: 'Many AI startups launch on a quick MVP site that becomes a bottleneck as they grow. Slow load times and poor mobile performance hurt growth and make the product look less credible.',
  },
};

export function generateProblemItSolves(cat: ServiceCategory, audience: string, serviceLabel: string, niche = '', serviceId?: string): string {
  const defaults: Record<ServiceCategory, string> = {
    video: `Many ${audience} have strong long-form content, but the best moments stay buried inside videos instead of being turned into short clips optimised for discovery and retention. Without a repeatable clip system, they miss out on growth from short-form platforms.`,
    wordpress: `Many ${audience} have a great product but no professional website to show for it. This hurts credibility, makes it harder to convert visitors, and creates extra work every time they need to explain what they do.`,
    design: `Many products launch with interfaces that confuse users, create friction during onboarding, and hurt activation rates. Without a clear information hierarchy and user flow, even useful features struggle to drive engagement.`,
  };

  const base = nicheContent(cat, niche, defaults, NICHE_PROBLEM);
  return serviceId
    ? (SERVICE_PROBLEM_SOLVES[serviceId]?.[getNicheKey(niche)] ?? base)
    : base;
}

const NICHE_CORE_PROMISE: Record<string, Partial<Record<ServiceCategory, string>>> = {
  gaming: {
    video: 'A repeatable short-form clip system that turns gaming streams and long-form videos into retention-optimised clips ready for Shorts, Reels, and TikTok.',
  },
  educational: {
    video: 'A repeatable short-form clip system that turns educational course content into retention-optimised clips that drive enrollment and demonstrate teaching quality.',
  },
  podcast: {
    video: 'A repeatable short-form clip system that turns podcast episodes into discovery-optimised clips that attract new listeners and grow show awareness.',
  },
  ai_startups: {
    wordpress: 'A professional, fast-loading AI startup website that clearly communicates your product value and builds confidence with investors and early customers.',
  },
  local_business: {
    wordpress: 'A professional, fast-loading local business website that attracts nearby customers, clearly presents your services, and converts visits into leads.',
  },
  marketing_agencies: {
    wordpress: 'A high-performance agency website that showcases your portfolio, demonstrates your expertise, and turns visitors into inbound leads.',
  },
  saas: {
    design: 'A clearer product interface that reduces user friction, improves activation, and communicates your product value at every touchpoint.',
  },
  product_startups: {
    design: 'A clear product interface and landing page that communicates your value proposition and helps early users understand your product within seconds.',
  },
  design_agencies: {
    design: 'A scalable design system and consistent interface library that improves delivery speed, quality consistency, and client satisfaction across projects.',
  },
  fitness_coaches: {
    video: 'A repeatable short-form clip system that turns workout footage and client transformation content into retention-optimised clips that attract new clients and build coaching authority across Shorts, Reels, and TikTok.',
  },
  youtubers_retention: {
    video: 'A repeatable short-form clip system that turns long-form YouTube videos into retention-optimised short clips designed to drive subscriber growth and cross-platform discovery.',
  },
  course_creators: {
    video: 'A repeatable short-form clip system that turns course lessons into retention-optimised short clips that drive enrollment and demonstrate teaching quality across short-form platforms.',
  },
  restaurants: {
    wordpress: 'A professional, fast-loading restaurant website that showcases your menu, attracts local diners, and drives online orders and reservations.',
  },
  coaches: {
    wordpress: 'A professional, authority-focused coaching website that presents your services, showcases client results, and converts visitors into booked discovery calls.',
    design: 'A clearer coaching platform interface with streamlined booking and payment flows that build client trust and reduce friction in the signup process.',
  },
  personal_brand_creators: {
    design: 'A clearer audience-facing interface that reflects your personal brand and guides followers toward subscription, purchase, or booking.',
  },
  saas_startups: {
    design: 'A clearer SaaS product interface with optimised onboarding flows that reduces user friction, improves activation, and helps users reach the core value faster.',
  },
};

const SERVICE_CORE_PROMISE: Record<string, Record<string, string>> = {
  plugin_integration_dev: {
    marketing_agencies: 'Reliable white-label WordPress integration support that helps agencies launch client campaigns faster with working forms, tracking, CRM connections, and clean handoff documentation.',
    ai_startups: 'A functional WordPress plugin that connects your AI product into users\' existing platforms, reducing adoption friction and helping customers get value within minutes.',
  },
  site_migration_performance: {
    local_business: 'A fast, modern WordPress website that loads in under 2 seconds, ranks higher in local search, and converts more visitors into paying customers.',
    ai_startups: 'A high-performance WordPress platform that loads quickly, scales with your growth, and presents a credible, professional presence that supports investor confidence.',
  },
};

export function generateCorePromise(cat: ServiceCategory, serviceLabel: string, uniqueMechanism: string | null, niche = '', serviceId?: string): string {
  const mech = uniqueMechanism ? ` using ${uniqueMechanism}` : '';
  const defaults: Record<ServiceCategory, string> = {
    video: `A repeatable short-form clip system that turns long-form content into retention-optimised clips ready for Shorts, Reels, and TikTok${mech}.`,
    wordpress: `A professional, fast-loading WordPress website that clearly communicates your product value and converts visitors into leads${mech}.`,
    design: `A clearer product interface that reduces user friction, improves activation, and communicates your product value at every touchpoint${mech}.`,
  };

  const base = serviceId
    ? (SERVICE_CORE_PROMISE[serviceId]?.[getNicheKey(niche)] ?? nicheContent(cat, niche, defaults, NICHE_CORE_PROMISE))
    : nicheContent(cat, niche, defaults, NICHE_CORE_PROMISE);
  return base + (mech && !base.endsWith(mech + '.') && !base.endsWith(mech) ? mech : '');
}

const NICHE_WHY_THIS_WORKS: Record<string, Partial<Record<ServiceCategory, string>>> = {
  gaming: {
    video: 'This offer works because gaming creators already have the footage — streams, VODs, and gameplay recordings — that can be turned into short-form clips. A consistent extraction and editing system turns existing content into a steady publishing pipeline without requiring new recording sessions.',
  },
  educational: {
    video: 'This offer works because educational creators already have the course content and tutorials that contain high-value teaching moments. A systematic clip extraction process turns existing lessons into a consistent stream of promotional content that attracts new students.',
  },
  podcast: {
    video: 'This offer works because podcasters already record hours of conversation every week. A focused clip extraction system turns the strongest interview moments into discovery-optimised content that drives new listens without recording additional episodes.',
  },
  ai_startups: {
    wordpress: 'This offer works because AI startups need a website that explains complex products clearly, loads quickly, and builds trust before they start driving traffic or pitching investors. A focused, performance-first build removes the guesswork and delivers a launch-ready site that communicates product value.',
  },
  local_business: {
    wordpress: 'This offer works because local businesses need a website that appears in local search, clearly presents their services, and makes it easy for nearby customers to get in touch. A focused, mobile-first build delivers an effective online presence without unnecessary complexity.',
  },
  marketing_agencies: {
    wordpress: 'This offer works because agencies need a website that showcases their best work, communicates their expertise, and generates inbound interest. A portfolio-first build approach ensures every page is designed to demonstrate capability and build client confidence.',
  },
  saas: {
    design: 'This offer works because most SaaS products improve significantly with clearer information hierarchy and reduced visual noise. A focused interface redesign removes the guesswork from the user experience and delivers a product that is easier to understand and use.',
  },
  product_startups: {
    design: 'This offer works because early-stage products benefit enormously from clear, focused interfaces that help first-time users understand the value proposition quickly. A targeted design approach removes friction and accelerates time-to-value.',
  },
  design_agencies: {
    design: 'This offer works because agencies that invest in scalable design systems reduce per-project delivery time, maintain consistent quality across clients, and spend less time on repetitive design decisions. A structured system approach transforms how the team works.',
  },
  fitness_coaches: {
    video: 'This offer works because fitness coaches already have the workout footage and client transformation content that can be repurposed into short clips. A consistent extraction and editing system turns existing content into a steady publishing pipeline that attracts new clients without requiring new recording sessions.',
  },
  youtubers_retention: {
    video: 'This offer works because YouTube creators already have long-form videos that contain high-retention moments ideal for short-form repurposing. A focused extraction system turns existing content into a stream of discovery-optimised clips that drive subscriber growth.',
  },
  course_creators: {
    video: 'This offer works because course creators already have the lesson content and tutorials containing high-value teaching moments. A systematic clip extraction process turns existing courses into a consistent stream of promotional content that attracts new students.',
  },
  restaurants: {
    wordpress: 'This offer works because restaurants need a website that showcases their menu clearly, appears in local search, and makes it easy for hungry customers to find and order from them. A focused, menu-first build delivers an effective online presence without unnecessary complexity.',
  },
  coaches: {
    wordpress: 'This offer works because coaches need a website that builds authority, presents services clearly, and converts visitors into booked calls. A focused, authority-first build removes the guesswork and delivers a professional presence that generates consistent client inquiries.',
    design: 'This offer works because coaching platforms benefit enormously from clearer interfaces with streamlined booking and payment flows. A focused design approach removes friction from the client experience and delivers a platform that builds trust and converts visitors.',
  },
  personal_brand_creators: {
    design: 'This offer works because personal brand platforms benefit from clearer interfaces that guide audiences toward action without confusion. A focused design approach removes friction and delivers an experience that strengthens brand perception and drives conversions.',
  },
  saas_startups: {
    design: 'This offer works because SaaS startups benefit enormously from clearer onboarding flows and interfaces that reduce user friction. A focused design approach removes the guesswork from the first-user experience and delivers a product that is easier to adopt and retain.',
  },
};

const SERVICE_WHY_THIS_WORKS: Record<string, Record<string, string>> = {
  plugin_integration_dev: {
    marketing_agencies: 'This offer works because agencies repeatedly launch campaign pages and client funnels that need forms, tracking, CRM connections, and plugin setup. A repeatable integration process reduces launch friction, avoids manual mistakes, and gives the agency a clearer handoff system.',
  },
};

export function generateWhyThisWorks(cat: ServiceCategory, audience: string, deliverables: string[], uniqueMechanism: string | null, niche = '', serviceId?: string): string {
  const defaults: Record<ServiceCategory, string> = {
    video: 'This offer works because it turns existing content into a repeatable publishing system. The client does not need to create more from scratch — they get a consistent way to extract, edit, and publish their strongest moments across short-form platforms.',
    wordpress: 'This offer works because startups need a website that explains their product clearly, loads quickly, and looks trustworthy before they start driving traffic or pitching customers. A focused, performance-first build eliminates the guesswork and delivers a launch-ready site.',
    design: 'This offer works because most products improve significantly with clearer information hierarchy and reduced visual noise. A focused interface redesign removes the guesswork from the user experience and delivers a product that is easier to understand and use.',
  };

  const base = serviceId
    ? (SERVICE_WHY_THIS_WORKS[serviceId]?.[getNicheKey(niche)] ?? nicheContent(cat, niche, defaults, NICHE_WHY_THIS_WORKS))
    : nicheContent(cat, niche, defaults, NICHE_WHY_THIS_WORKS);
  return base;
}

const NICHE_NEXT_STEP_CTA: Record<string, Partial<Record<ServiceCategory, Record<string, string>>>> = {
  gaming: {
    video: {
      retainer: 'Send this offer to gaming creators as a monthly retainer proposal. Book a quick call to review their recent streams and start with a trial month of clip production.',
      one_time_project: 'Share this proposal with gaming creators. The next step is a quick call to review their best VODs and identify the strongest clips for the first batch.',
      milestone_based: 'Share this offer with gaming creators. Schedule a short call to review their content library and plan the first milestone.',
    },
  },
  educational: {
    video: {
      retainer: 'Send this offer to educational creators as a monthly retainer proposal. Book a quick call to review their recent course content and start with a trial month of clip production.',
      one_time_project: 'Share this proposal with educational creators. The next step is a quick call to review their best lessons and identify the strongest clips for the first batch.',
      milestone_based: 'Share this offer with educational creators. Schedule a short call to review their course library and plan the first milestone.',
    },
  },
  podcast: {
    video: {
      retainer: 'Send this offer to podcasters as a monthly retainer proposal. Book a quick call to review their recent episodes and start with a trial month of clip production.',
      one_time_project: 'Share this proposal with podcasters. The next step is a quick call to review their best episodes and identify the strongest clips for the first batch.',
      milestone_based: 'Share this offer with podcasters. Schedule a short call to review their episode library and plan the first milestone.',
    },
  },
  ai_startups: {
    wordpress: {
      retainer: 'Send this offer to AI startups as a monthly retainer proposal. Book a call to review their current site and start with a performance audit before planning the build.',
      one_time_project: 'Share this proposal with AI startups. The next step is a discovery call to understand the product, audience, and goals before planning the site structure.',
      milestone_based: 'Share this offer with AI startups. Schedule a call to plan the first milestone and define the project scope.',
    },
  },
  local_business: {
    wordpress: {
      retainer: 'Send this offer to local businesses as a monthly retainer proposal. Book a call to discuss their services and start with a local SEO audit before planning the build.',
      one_time_project: 'Share this proposal with local businesses. The next step is a discovery call to understand their services, area, and goals before planning the site.',
      milestone_based: 'Share this offer with local businesses. Schedule a call to plan the first milestone and define the site structure.',
    },
  },
  marketing_agencies: {
    wordpress: {
      retainer: 'Send this offer to marketing agencies as a monthly retainer proposal. Book a call to review their current portfolio site and start with a performance and content audit.',
      one_time_project: 'Share this proposal with marketing agencies. The next step is a discovery call to understand their services, case studies, and target clients.',
      milestone_based: 'Share this offer with marketing agencies. Schedule a call to plan the first milestone and define the site structure.',
    },
  },
  saas: {
    design: {
      retainer: 'Send this offer to SaaS teams as a monthly retainer proposal. Book a call to review their current product interface and identify the highest-impact improvements.',
      one_time_project: 'Share this proposal with SaaS teams. The next step is a UX review call to understand the current interface and identify the key friction points.',
      milestone_based: 'Share this offer with SaaS teams. Schedule a call to plan the first milestone and define the scope of the redesign.',
    },
  },
  product_startups: {
    design: {
      retainer: 'Send this offer to product startups as a monthly design retainer. Book a call to review their current product and identify the highest-impact interface improvements.',
      one_time_project: 'Share this proposal with product startups. The next step is a discovery call to understand their product, audience, and launch timeline.',
      milestone_based: 'Share this offer with product startups. Schedule a call to plan the first milestone and define the design scope.',
    },
  },
  design_agencies: {
    design: {
      retainer: 'Send this offer to design agencies as a design system retainer. Book a call to review their current workflow and identify the highest-impact system improvements.',
      one_time_project: 'Share this proposal with design agencies. The next step is a discovery call to understand their team, workflow, and design system needs.',
      milestone_based: 'Share this offer with design agencies. Schedule a call to plan the first milestone and define the system build scope.',
    },
  },
  fitness_coaches: {
    video: {
      retainer: 'Send this offer to fitness coaches as a monthly retainer proposal. Book a quick call to review their recent workout or transformation content and start with a trial month of clip production.',
      one_time_project: 'Share this proposal with fitness coaches. The next step is a quick call to review their best footage and identify the strongest clips for the first batch.',
      milestone_based: 'Share this offer with fitness coaches. Schedule a short call to review their content library and plan the first milestone.',
    },
  },
  youtubers_retention: {
    video: {
      retainer: 'Send this offer to YouTube creators as a monthly retainer proposal. Book a quick call to review their recent videos and start with a trial month of clip production.',
      one_time_project: 'Share this proposal with YouTube creators. The next step is a quick call to review their best videos and identify the strongest clips for the first batch.',
      milestone_based: 'Share this offer with YouTube creators. Schedule a short call to review their video library and plan the first milestone.',
    },
  },
  course_creators: {
    video: {
      retainer: 'Send this offer to course creators as a monthly retainer proposal. Book a quick call to review their recent lessons and start with a trial month of clip production.',
      one_time_project: 'Share this proposal with course creators. The next step is a quick call to review their best lessons and identify the strongest clips for the first batch.',
      milestone_based: 'Share this offer with course creators. Schedule a short call to review their course library and plan the first milestone.',
    },
  },
  restaurants: {
    wordpress: {
      retainer: 'Send this offer to restaurants as a monthly retainer proposal. Book a call to review their current online presence and start with a local SEO audit before planning the site build.',
      one_time_project: 'Share this proposal with restaurants. The next step is a discovery call to understand their menu, concept, and target customers before planning the site structure.',
      milestone_based: 'Share this offer with restaurants. Schedule a call to plan the first milestone and define the site structure.',
    },
  },
  coaches: {
    wordpress: {
      retainer: 'Send this offer to coaches as a monthly retainer proposal. Book a call to review their current site and start with an authority audit before planning the build.',
      one_time_project: 'Share this proposal with coaches. The next step is a discovery call to understand their coaching niche, methodology, and target clients before planning the site.',
      milestone_based: 'Share this offer with coaches. Schedule a call to plan the first milestone and define the site structure.',
    },
    design: {
      retainer: 'Send this offer to coaches as a monthly retainer proposal. Book a call to review their current platform interface and identify the highest-impact booking flow improvements.',
      one_time_project: 'Share this proposal with coaches. The next step is a UX review call to understand their current platform and identify the key friction points in the client journey.',
      milestone_based: 'Share this offer with coaches. Schedule a call to plan the first milestone and define the scope of the platform redesign.',
    },
  },
  personal_brand_creators: {
    design: {
      retainer: 'Send this offer to personal brand creators as a monthly retainer proposal. Book a call to review their current platform and identify the highest-impact audience experience improvements.',
      one_time_project: 'Share this proposal with personal brand creators. The next step is a discovery call to understand their brand, audience, and goals before planning the interface.',
      milestone_based: 'Share this offer with personal brand creators. Schedule a call to plan the first milestone and define the scope of the platform redesign.',
    },
  },
  saas_startups: {
    design: {
      retainer: 'Send this offer to SaaS startups as a monthly retainer proposal. Book a call to review their current product interface and identify the highest-impact onboarding improvements.',
      one_time_project: 'Share this proposal with SaaS startups. The next step is a UX review call to understand their current onboarding flow and identify the key friction points.',
      milestone_based: 'Share this offer with SaaS startups. Schedule a call to plan the first milestone and define the scope of the interface redesign.',
    },
  },
};

const SERVICE_NEXT_STEP_CTA: Record<string, Record<string, Record<string, string>>> = {
  plugin_integration_dev: {
    marketing_agencies: {
      retainer: 'Send this offer to marketing agencies as a plugin integration support proposal. Start by reviewing one client campaign setup and identifying form, CRM, tracking, or plugin issues that can be improved.',
      one_time_project: 'Send this offer to marketing agencies as a plugin integration support proposal. Start by reviewing one client campaign setup and identifying form, CRM, tracking, or plugin issues that can be improved.',
      milestone_based: 'Send this offer to marketing agencies as a plugin integration support proposal. Start by reviewing one client campaign setup and identifying form, CRM, tracking, or plugin issues that can be improved.',
    },
  },
};

const NICHE_AMPLIFIER_DESC: Record<string, Partial<Record<ServiceCategory, string>>> = {
  fitness_coaches: {
    video: 'Client journey highlight reel — a polished 30-second transformation story clip they can post immediately to attract new coaching clients.',
  },
  youtubers_retention: {
    video: 'Retention analysis report — a breakdown of your top-performing clips with hook timing, pacing scores, and optimisation recommendations for future videos.',
  },
  restaurants: {
    wordpress: 'Menu optimisation audit — a review of your current menu presentation with layout, photography, and SEO recommendations to drive more online orders.',
  },
  coaches: {
    wordpress: 'Authority content starter pack — three pre-written blog or guide outlines tailored to your coaching niche to establish expertise and attract organic traffic.',
    design: 'Client journey map — a visual audit of your current booking and onboarding flow with prioritised recommendations to reduce drop-off and increase conversion.',
  },
  personal_brand_creators: {
    design: 'Audience engagement audit — a review of your current platform flow with recommendations to improve navigation, clarity, and call-to-action placement.',
  },
  saas_startups: {
    design: 'Onboarding flow audit — a detailed review of your current activation funnel with prioritised recommendations to reduce drop-off and improve time-to-value.',
  },
  course_creators: {
    video: 'Course teaser clip pack — three short promotional clips extracted from your best lessons, ready to post and drive enrollment.',
  },
};

export function generateNicheValueAmplifier(cat: ServiceCategory, niche: string, defaultAmplifier?: string): string {
  const key = getNicheKey(niche);
  const nicheDesc = NICHE_AMPLIFIER_DESC[key]?.[cat];
  if (nicheDesc) return nicheDesc;
  if (defaultAmplifier) return defaultAmplifier;
  const defaults: Record<ServiceCategory, string> = {
    video: 'Priority support and fast turnaround on all clips throughout the engagement.',
    wordpress: 'Extended post-launch support window and a performance monitoring check-in 30 days after launch.',
    design: 'Source design files and a component library that your team can extend after the engagement ends.',
  };
  return defaults[cat];
}

export function generateNextStepCTA(cat: ServiceCategory, audience: string, offerType: string, niche = '', serviceId?: string): string {
  const defaults: Record<ServiceCategory, Record<string, string>> = {
    video: {
      retainer: `Send this offer to ${audience} as a monthly retainer proposal. Book a quick call to review their recent content and start with a trial month of clip production.`,
      one_time_project: `Share this proposal with ${audience}. The next step is a quick call to review their best footage and identify the strongest clips for the first batch.`,
      milestone_based: `Share this offer with ${audience}. Schedule a short call to review their content library and plan the first milestone.`,
    },
    wordpress: {
      retainer: `Send this offer to ${audience} as a monthly retainer proposal. Book a call to review their current site and start with a performance audit before planning the build.`,
      one_time_project: `Share this proposal with ${audience}. The next step is a discovery call to understand the product, audience, and goals before planning the site structure.`,
      milestone_based: `Share this offer with ${audience}. Schedule a call to plan the first milestone and define the project scope.`,
    },
    design: {
      retainer: `Send this offer to ${audience} as a monthly retainer proposal. Book a call to review their current product interface and identify the highest-impact improvements.`,
      one_time_project: `Share this proposal with ${audience}. The next step is a UX review call to understand the current interface and identify the key friction points.`,
      milestone_based: `Share this offer with ${audience}. Schedule a call to plan the first milestone and define the scope of the redesign.`,
    },
  };

  const nicheKey = getNicheKey(niche);
  const serviceCta = serviceId ? SERVICE_NEXT_STEP_CTA[serviceId]?.[nicheKey]?.[offerType] : undefined;
  const nicheCta = NICHE_NEXT_STEP_CTA[nicheKey]?.[cat]?.[offerType];
  return serviceCta ?? nicheCta ?? defaults[cat]?.[offerType] ?? `Share this offer with ${audience}. Book a call to discuss the next steps.`;
}

const NICHE_PROPOSAL: Record<string, Partial<Record<ServiceCategory, {
  headlines: string[];
  problems: string[];
  solutions: string[];
  nextSteps: string[];
}>>> = {
  gaming: {
    video: {
      headlines: [
        'Gaming Shorts Growth Package',
        'Stream-to-Shorts Content System',
        'Viral Gaming Clips Package',
        'Creator Shorts Repurposing System',
        'Clip Publishing Retainer for Gaming Streamers',
      ],
      problems: [
        'Gaming creators often have strong long-form streams and gameplay content but struggle to turn the best moments into short clips that hold attention on Shorts, Reels, or TikTok.',
        'Many gaming channels leave high-value moments buried inside hours of VOD footage instead of converting them into discovery-focused clips that reach new audiences.',
        'Gaming creators need consistent short-form output, but finding, editing, and packaging viral moments takes time away from actual gameplay and streaming.',
      ],
      solutions: [
        'This offer turns your existing gaming content into high-retention short-form clips built for Shorts, Reels, and TikTok using a repeatable extraction and editing system.',
        'This package extracts the strongest moments from your VODs and gameplay footage and turns them into clips designed to improve discovery, watch time, and follower growth.',
        'This system helps gaming creators publish more short-form content without recording new footage — the clips come from streams and videos you already have.',
      ],
      nextSteps: [
        'Book a quick discovery call to review your recent gaming content and identify the best clips for your first batch.',
        'Send over your recent streams or long-form videos and receive a sample short-form clip to see the quality before committing.',
        'Reply with your preferred short-form platform and content style, and we will send over a custom package proposal.',
      ],
    },
  },
  educational: {
    video: {
      headlines: [
        'Educational Content Clip System',
        'Course-to-Shorts Repurposing Package',
        'Tutorial Clip Growth System',
        'Educator Short-Form Repurposing Plan',
        'Learning Content Clip Retainer',
      ],
      problems: [
        'Educational creators often produce high-quality course content but struggle to extract and repurpose teaching moments into short clips that drive enrollment and demonstrate value.',
        'Many educators leave their best lesson moments buried inside long tutorials instead of turning them into discoverable short-form content that reaches new students.',
        'Educational creators need consistent promotional content, but identifying, editing, and packaging teaching moments takes time away from creating courses.',
      ],
      solutions: [
        'This offer turns your existing educational content into high-retention short-form clips that demonstrate teaching quality and drive course enrollment across Shorts, Reels, and TikTok.',
        'This package extracts the strongest teaching moments from your lessons and turns them into clips designed to attract new students and build authority.',
        'This system helps educators publish more short-form promotional content without recording new material — the clips come from lessons you already have.',
      ],
      nextSteps: [
        'Book a quick discovery call to review your recent educational content and identify the best clips for your first batch.',
        'Send over your recent course lessons or tutorials and receive a sample short-form clip to see the quality before committing.',
        'Reply with your preferred short-form platform and teaching style, and we will send over a custom package proposal.',
      ],
    },
  },
  podcast: {
    video: {
      headlines: [
        'Podcast Clip Growth System',
        'Episode-to-Short Repurposing Package',
        'Interview Clip Highlight System',
        'Podcaster Short-Form Plan',
        'Show Growth Clip Retainer',
      ],
      problems: [
        'Podcasters often record great interviews but struggle to extract the strongest moments into short clips that drive new listens and grow show awareness.',
        'Many podcast episodes contain quotable moments, insights, and stories that stay buried inside hour-long conversations instead of reaching new audiences on short-form platforms.',
        'Podcasters need consistent short-form content to promote their show, but reviewing, selecting, and editing clips from each episode takes significant time.',
      ],
      solutions: [
        'This offer turns your podcast episodes into high-retention short-form clips that capture the strongest interview moments and drive new listenership across Shorts, Reels, and TikTok.',
        'This package extracts the most engaging conversational moments from your episodes and turns them into clips designed to attract new listeners and grow show awareness.',
        'This system helps podcasters publish more short-form promotional content without recording extra material — the clips come from episodes you already have.',
      ],
      nextSteps: [
        'Book a quick discovery call to review your recent podcast episodes and identify the best clips for your first batch.',
        'Send over your recent episodes and receive a sample short-form clip to see the quality before committing.',
        'Reply with your preferred short-form platform and episode style, and we will send over a custom package proposal.',
      ],
    },
  },
  ai_startups: {
    wordpress: {
      headlines: [
        'AI Startup Website Launch Package',
        'Product Landing Page Build for AI Companies',
        'Performance-First WordPress for Startups',
        'AI Startup Digital Presence Package',
        'Professional WordPress Launch for AI Products',
      ],
      problems: [
        'AI startups often have an innovative product but no website that explains their value clearly. Without a professional web presence, credibility with investors and early adopters suffers.',
        'Many AI founders spend weeks trying to build a website themselves, only to end up with a slow, unclear site that does not convert visitors or communicate their technology effectively.',
        'A weak website can hurt an AI startup before it gains traction. Investors, partners, and early customers judge the product by how it is presented online.',
      ],
      solutions: [
        'This package delivers a professional, performance-optimised WordPress website that clearly communicates your AI product value and guides visitors toward action.',
        'A focused build process covers product understanding, structure planning, custom theme development, performance optimisation, and clean handoff with documentation.',
        'This approach ensures your website is launch-ready, mobile-responsive, and built to convert visitors from day one — whether they are investors, early adopters, or media.',
      ],
      nextSteps: [
        'Book a discovery call to understand your AI product, target audience, and launch goals before planning the site structure and content hierarchy.',
        'Send over your current brand materials, product description, and any existing landing page for a structure proposal with layout and navigation suggestions.',
        'Reply with your preferred launch timeline and target audience, and we will send over a custom website package proposal tailored to your AI startup.',
      ],
    },
  },
  local_business: {
    wordpress: {
      headlines: [
        'Local Business Website Launch Package',
        'Service Area Lead Generation Site',
        'Local SEO WordPress Build',
        'Small Business Digital Presence Package',
        'Mobile-First Local Website',
      ],
      problems: [
        'Local businesses often rely on word-of-mouth but have no professional website that appears in local search results. Without an online presence, they miss customers actively searching for their services.',
        'Many local business owners find website building overwhelming and end up with slow, hard-to-update sites that do not effectively present their services or convert visitors into calls.',
        'A missing or outdated website can make a local business look less trustworthy and cause potential customers to choose a competitor who shows up in search results.',
      ],
      solutions: [
        'This package delivers a professional, mobile-friendly WordPress website optimised for local search, clearly presenting your services and making it easy for customers to contact you.',
        'A focused build process covers service understanding, local SEO structure planning, custom theme development, mobile optimisation, and simple handoff so you can update content yourself.',
        'This approach ensures your website shows up in local search, presents your services clearly, and converts visitors into phone calls, bookings, or walk-in visits.',
      ],
      nextSteps: [
        'Book a discovery call to understand your services, service area, and target customers before planning the site structure and local SEO approach.',
        'Send over your business information, service list, and any existing materials for a structure proposal with layout and content suggestions.',
        'Reply with your preferred launch timeline and target service area, and we will send over a custom website package proposal tailored to your local business.',
      ],
    },
  },
  marketing_agencies: {
    wordpress: {
      headlines: [
        'Agency Portfolio Website Launch',
        'Client Results Showcase Site',
        'Marketing Agency Lead Generation Site',
        'Professional Agency Digital Presence',
        'Case Study-Focused WordPress Build',
      ],
      problems: [
        'Marketing agencies often deliver great results for clients but have a website that fails to showcase their work or generate inbound leads. A weak online presence undermines their expertise.',
        'Many agencies rely on referrals and outreach instead of having a professional website that demonstrates their capabilities, showcases case studies, and converts visitors into leads.',
        'A poorly designed agency website can make even the most successful agency look less professional and cause potential clients to question their ability to deliver results.',
      ],
      solutions: [
        'This package delivers a professional, high-performance WordPress website that showcases your portfolio, demonstrates your expertise, and turns visitors into qualified inbound leads.',
        'A focused build process covers service cataloguing, portfolio structure, case study presentation, performance optimisation, and clean handoff with content management guidance.',
        'This approach ensures your agency website communicates your value proposition, demonstrates real results, and makes it easy for potential clients to start a conversation.',
      ],
      nextSteps: [
        'Book a discovery call to understand your agency services, target clients, and portfolio needs before planning the site structure and content approach.',
        'Send over your current brand materials, case studies, and service descriptions for a structure proposal with portfolio layout and navigation suggestions.',
        'Reply with your preferred launch timeline and target client types, and we will send over a custom website package proposal tailored to your agency.',
      ],
    },
  },
  saas: {
    design: {
      headlines: [
        'SaaS Interface Clarity Package',
        'Product UX Redesign Proposal',
        'Dashboard & Onboarding Redesign',
        'SaaS Design System & UI Audit',
        'User Activation Flow Improvement',
      ],
      problems: [
        'Many SaaS products have useful features but lose users because the interface is confusing, cluttered, or hard to navigate. Activation and retention suffer as a result of poor UX.',
        'Product teams often know their interface needs improvement but lack the focused design time to research, redesign, and test better solutions while maintaining ongoing development.',
        'A confusing onboarding experience can cause users to churn before they reach the product\'s core value. First impressions matter more than most SaaS teams realise.',
      ],
      solutions: [
        'This package delivers a clearer product interface with improved information hierarchy, reduced visual noise, and a reusable design system ready for development handoff.',
        'A structured redesign process covers UX audit, user flow mapping, wireframing, visual design, prototyping, and developer-ready handoff with component documentation.',
        'This approach removes the guesswork from interface design and delivers a product that users can navigate intuitively, reducing support questions and improving engagement metrics.',
      ],
      nextSteps: [
        'Book a UX review call to understand your current product interface and identify the highest-impact friction points for your specific user base.',
        'Send over your current product screens or prototype along with any user feedback or analytics, and receive a UX audit with prioritised improvement suggestions.',
        'Reply with your product area of focus and team capacity, and we will send over a custom redesign proposal with timeline and deliverable estimates.',
      ],
    },
  },
  product_startups: {
    design: {
      headlines: [
        'Product Launch Interface Package',
        'MVP Landing Page Design',
        'Early-Stage UX Foundation',
        'Product Market-Fit Interface Design',
        'First-User Experience Improvement',
      ],
      problems: [
        'Early-stage product startups often build useful features but struggle to communicate their value through the interface. First-time users feel lost and fail to reach the core experience.',
        'Many founders focus on functionality over usability and end up with a product that works technically but confuses users, leading to low activation and high early churn.',
        'A confusing first-use experience can kill a product before it gains traction. Users who do not understand the value within the first minute rarely come back.',
      ],
      solutions: [
        'This package delivers a clear, focused product interface and landing page that communicates your value proposition and helps first-time users understand your product within seconds.',
        'A structured design process covers user flow mapping, landing page design, key interface screens, and prototype handoff with clear design rationale and user journey documentation.',
        'This approach removes friction from the first user experience and delivers an interface that guides users toward the core value without confusion or unnecessary steps.',
      ],
      nextSteps: [
        'Book a discovery call to understand your product, target users, and launch timeline before planning the interface structure and user flow approach.',
        'Send over your current product concept, wireframes, or prototype along with your value proposition for a structure proposal with user flow and layout suggestions.',
        'Reply with your preferred launch timeline and target user profile, and we will send over a custom design package proposal tailored to your product stage.',
      ],
    },
  },
  design_agencies: {
    design: {
      headlines: [
        'Design System Build Package',
        'Agency Scalability System',
        'Component Library & UI Kit',
        'Design Operations Improvement',
        'Multi-Project Design Consistency Plan',
      ],
      problems: [
        'Design agencies often deliver inconsistent work across projects because they lack a centralised design system. Each project starts from scratch, leading to slower delivery and variable quality.',
        'Many agencies rely on individual designer preferences instead of a shared component library, creating inconsistencies, longer handoffs, and higher revision rates.',
        'Without a scalable design system, growing agencies struggle to maintain quality as they take on more clients. Top designers spend too much time on repetitive low-level decisions.',
      ],
      solutions: [
        'This package delivers a scalable design system and shared component library that enables consistent, high-quality output across all client projects with faster delivery times.',
        'A structured system development process covers audit of existing work, component hierarchy planning, design token definition, reusable component creation, and team onboarding documentation.',
        'This approach transforms how your agency works — reducing per-project design time, maintaining consistent quality, and freeing senior designers to focus on higher-value creative work.',
      ],
      nextSteps: [
        'Book a discovery call to understand your agency workflow, team structure, and current design process before planning the system scope and component priorities.',
        'Send over examples of recent client work, your current design files, and any existing style guides for a system structure proposal with component hierarchy suggestions.',
        'Reply with your preferred timeline and team size, and we will send over a custom design system package proposal tailored to your agency\'s needs.',
      ],
    },
  },
  fitness_coaches: {
    video: {
      headlines: [
        'Fitness Coach Short-Form Clip System',
        'Transformation Content Repurposing Package',
        'Workout-to-Shorts Growth Plan',
        'Client Results Showcase System',
        'Fitness Creator Short-Form Retainer',
      ],
      problems: [
        'Fitness coaches often have strong workout footage and client transformation content, but the best moments stay buried inside long-form videos instead of reaching new clients on Shorts, Reels, or TikTok.',
        'Many fitness creators need consistent short-form content to attract leads, but finding, editing, and packaging the most compelling moments takes time away from coaching clients.',
        'A weak short-form presence means fewer discovery views, fewer booked consultations, and less authority in a competitive fitness market.',
      ],
      solutions: [
        'This offer turns your fitness content into high-retention short-form clips that showcase transformations, demonstrate workouts, and drive consultation bookings across Shorts, Reels, and TikTok.',
        'This package extracts the strongest training and transformation moments from your existing footage and turns them into clips designed to attract new clients and build authority.',
        'This system helps fitness coaches publish consistent short-form promotional content without recording new material — the clips come from workouts and content you already have.',
      ],
      nextSteps: [
        'Book a quick discovery call to review your recent fitness content and identify the best clips for your first batch.',
        'Send over your recent workout videos and receive a sample short-form clip to see the quality before committing.',
        'Reply with your preferred short-form platform and training style, and we will send over a custom package proposal.',
      ],
    },
  },
  youtubers_retention: {
    video: {
      headlines: [
        'YouTube Retention Clip System',
        'Long-to-Short Content Repurposing Package',
        'Audience Growth Clip Plan',
        'Creator Short-Form Velocity System',
        'Channel Growth Retainer',
      ],
      problems: [
        'YouTube creators with strong long-form content often leave high-retention moments buried inside full videos instead of turning them into short clips that reach new subscribers on Shorts, Reels, and TikTok.',
        'Many creators need consistent short-form output to grow their channel, but reviewing, selecting, and editing the best moments from each long video takes significant time.',
        'Without a system for repurposing long-form content into short clips, creators miss out on cross-platform growth and audience expansion.',
      ],
      solutions: [
        'This offer turns your long-form YouTube content into high-retention short-form clips that capture the strongest moments and drive channel growth across Shorts, Reels, and TikTok.',
        'This package extracts the most engaging moments from your videos and turns them into clips designed to improve discovery, watch time, and subscriber growth.',
        'This system helps creators publish more short-form content without recording new footage — the clips come from videos you already have.',
      ],
      nextSteps: [
        'Book a quick discovery call to review your recent videos and identify the best clips for your first batch.',
        'Send over your recent long-form videos and receive a sample short-form clip to see the quality before committing.',
        'Reply with your preferred short-form platform and content style, and we will send over a custom package proposal.',
      ],
    },
  },
  course_creators: {
    video: {
      headlines: [
        'Course Content Clip System',
        'Lesson-to-Shorts Repurposing Package',
        'Educational Short-Form Growth Plan',
        'Creator Content Velocity System',
        'Course Creator Short-Form Retainer',
      ],
      problems: [
        'Course creators often have high-quality lesson content but struggle to extract and repurpose teaching moments into short clips that drive enrollment and demonstrate expertise.',
        'Many educators leave their best lesson moments buried inside full courses instead of turning them into discoverable short-form content that reaches new students.',
        'Course creators need consistent promotional content, but identifying, editing, and packaging teaching moments takes time away from creating courses.',
      ],
      solutions: [
        'This offer turns your course lessons into high-retention short-form clips that demonstrate teaching quality and drive enrollment across Shorts, Reels, and TikTok.',
        'This package extracts the strongest teaching moments from your lessons and turns them into clips designed to attract new students and build authority.',
        'This system helps course creators publish more short-form promotional content without recording new material — the clips come from lessons you already have.',
      ],
      nextSteps: [
        'Book a quick discovery call to review your recent course content and identify the best clips for your first batch.',
        'Send over your recent lessons and receive a sample short-form clip to see the quality before committing.',
        'Reply with your preferred short-form platform and teaching style, and we will send over a custom package proposal.',
      ],
    },
  },
  restaurants: {
    wordpress: {
      headlines: [
        'Restaurant Website Launch Package',
        'Menu-Optimised WordPress Build',
        'Local Restaurant Digital Presence',
        'Online Ordering Website Package',
        'Hunger-Driven Website Design',
      ],
      problems: [
        'Many restaurants rely on social media and word-of-mouth but lack a professional website that appears in local search, presents their menu clearly, and drives online orders or reservations.',
        'Restaurant owners often struggle to build a website that effectively showcases their menu, location, and brand while making it easy for hungry customers to find them and take action.',
        'Without a clear online presence, restaurants miss out on customers actively searching for places to eat in their area.',
      ],
      solutions: [
        'This package delivers a professional, mobile-friendly WordPress website optimised for local search, with clear menu presentation, online ordering integration, and easy contact options.',
        'A focused build process covers menu-first site architecture, local SEO optimisation, mobile-first responsive layout, and simple content management so you can update your menu yourself.',
        'This approach ensures your restaurant shows up in local search, presents your menu and atmosphere clearly, and converts visitors into diners.',
      ],
      nextSteps: [
        'Book a discovery call to understand your restaurant concept, menu structure, and target customers before planning the site architecture and local SEO approach.',
        'Send over your menu, brand materials, and restaurant photos for a structure proposal with layout and navigation suggestions.',
        'Reply with your preferred launch timeline and target area, and we will send over a custom website package proposal tailored to your restaurant.',
      ],
    },
  },
  coaches: {
    wordpress: {
      headlines: [
        'Coach Website Launch Package',
        'Authority WordPress Build for Coaches',
        'Client Booking Website Package',
        'Coach Digital Presence System',
        'Professional Coach Website Launch',
      ],
      problems: [
        'Many coaches rely on referrals and social media but lack a professional website that clearly presents their services, builds authority, and converts visitors into booked discovery calls.',
        'Coaches often struggle to build a website that effectively communicates their methodology, showcases client results, and makes it easy for potential clients to take the next step.',
        'Without a clear online presence, coaches miss out on clients who search for help online and choose a competitor with a stronger digital footprint.',
      ],
      solutions: [
        'This package delivers a professional, authority-focused WordPress website that presents your coaching methodology, showcases client results, and makes booking a discovery call effortless.',
        'A focused build process covers service presentation, booking and calendar integration, client results showcase, and mobile-first responsive design that builds trust from the first visit.',
        'This approach ensures your coaching website communicates your expertise, demonstrates real client outcomes, and converts visitors into booked consultations.',
      ],
      nextSteps: [
        'Book a discovery call to understand your coaching niche, methodology, and target clients before planning the site structure and content approach.',
        'Send over your current brand materials, service descriptions, and client testimonials for a structure proposal with layout and navigation suggestions.',
        'Reply with your preferred launch timeline and target client profile, and we will send over a custom website package proposal tailored to your coaching practice.',
      ],
    },
    design: {
      headlines: [
        'Coach Platform Interface Design',
        'Coach Portal UX Package',
        'Client Dashboard Design System',
        'Coaching App Interface Redesign',
        'Coach Booking & Payment Flow Design',
      ],
      problems: [
        'Many coaches build platforms that confuse clients with cluttered interfaces, unclear booking flows, and disconnected payment processes that hurt conversion and client retention.',
        'Coaching platforms often grow through feature additions without a cohesive design system, leading to inconsistent user experiences and higher support costs.',
        'A poor interface experience can undermine a coach\'s authority and cause potential clients to abandon the booking process before committing.',
      ],
      solutions: [
        'This package delivers a clearer, more intuitive platform interface with streamlined booking flows, payment integration, and a consistent design system ready for development handoff.',
        'A structured design process covers user flow mapping, booking and payment flow optimisation, interface design with a coach-specific design system, and developer-ready files with documentation.',
        'This approach removes friction from the client experience and delivers an interface that feels professional, builds trust, and converts visitors into paying clients.',
      ],
      nextSteps: [
        'Book a UX review call to understand your current platform and identify the highest-impact friction points for your coaching clients.',
        'Send over your current platform screens or prototype along with user feedback, and receive a UX audit with prioritised improvement suggestions.',
        'Reply with your platform focus and timeline, and we will send over a custom design proposal tailored to your coaching platform.',
      ],
    },
  },
  personal_brand_creators: {
    design: {
      headlines: [
        'Creator Dashboard Interface Design',
        'Personal Brand UX Package',
        'Creator Platform Interface Redesign',
        'Audience Growth Interface System',
        'Content Creator Portal Design',
      ],
      problems: [
        'Personal brand creators often build platforms with cluttered interfaces that confuse their audience, hurt engagement, and fail to convert followers into customers or subscribers.',
        'Creators need interfaces that reflect their brand quality and guide their audience toward action, but designing for clarity while maintaining personality is a common struggle.',
        'A poor interface experience can make even strong personal brands feel less professional and cause audience members to leave before taking the desired action.',
      ],
      solutions: [
        'This package delivers a clearer, more focused interface that reflects your personal brand, guides your audience toward action, and creates a consistent experience across touchpoints.',
        'A structured design process covers audience flow mapping, key screen design with brand-aligned visuals, component system for consistency, and developer-ready handoff files.',
        'This approach removes friction from your audience\'s experience and delivers an interface that strengthens your brand and converts visitors into subscribers, customers, or clients.',
      ],
      nextSteps: [
        'Book a discovery call to understand your brand, audience, and goals before planning the interface structure and user flow approach.',
        'Send over your current platform or brand materials along with your audience insights for a structure proposal with layout and flow suggestions.',
        'Reply with your preferred timeline and platform focus, and we will send over a custom design proposal tailored to your personal brand.',
      ],
    },
  },
  saas_startups: {
    design: {
      headlines: [
        'SaaS Activation Flow Design Package',
        'Product Interface Clarity Redesign',
        'Onboarding UX Optimisation Plan',
        'SaaS Dashboard & Interface System',
        'User Retention Interface Package',
      ],
      problems: [
        'Many SaaS startups launch with interfaces that confuse users during onboarding, create friction at key decision points, and hurt activation and retention rates from day one.',
        'Product teams often know their interface needs improvement but lack the focused design time to research, redesign, and test better onboarding and core workflows.',
        'A confusing first-use experience can cause users to churn before they reach the product\'s core value, making it harder to prove product-market fit and secure funding.',
      ],
      solutions: [
        'This package delivers a clearer product interface with optimised onboarding flows, improved information hierarchy, and a reusable design system ready for development handoff.',
        'A structured redesign process covers UX audit, onboarding flow mapping, core screen wireframing, visual design, prototyping, and developer-ready handoff with component documentation.',
        'This approach removes the guesswork from your interface and delivers a product that users can navigate intuitively, reducing support questions and improving activation metrics.',
      ],
      nextSteps: [
        'Book a UX review call to understand your current product interface and identify the highest-impact friction points for your user onboarding and core flows.',
        'Send over your current product screens or prototype along with any user feedback or analytics, and receive a UX audit with prioritised improvement suggestions.',
        'Reply with your product area of focus and team capacity, and we will send over a custom redesign proposal with timeline and deliverable estimates.',
      ],
    },
  },
};

const SERVICE_PROPOSAL: Record<string, Record<string, { headlines: string[]; problems: string[]; solutions: string[]; nextSteps: string[] }>> = {
  plugin_integration_dev: {
    marketing_agencies: {
      headlines: [
        'Marketing Tool Integration Connector',
        'Agency Plugin Integration Support',
        'Form + Tracking + CRM Integration Package',
        'Campaign Setup Integration System'
      ],
      problems: [
        'Marketing agencies often move fast on client campaigns, but technical setup tasks like forms, CRM connections, analytics tags, booking tools, and plugin configuration can slow delivery and create last-minute issues.'
      ],
      solutions: [
        'WordPress plugin + integration support for marketing agencies to handle WordPress plugin integrations, form setup, tracking tags, CRM connections, and campaign handoff systems without slowing down client delivery.'
      ],
      nextSteps: [
        'Send this offer to marketing agencies as a plugin integration support proposal. Start by reviewing one client campaign setup and identifying form, CRM, tracking, or plugin issues that can be improved.'
      ]
    }
  }
};

export function generateProposalVariations(cat: ServiceCategory, audience: string, serviceLabel: string, offerType: string, uniqueMechanism: string, niche = '', serviceId?: string): {
  headlines: string[];
  problems: string[];
  solutions: string[];
  nextSteps: string[];
} {
  const defaults: Record<ServiceCategory, { headlines: string[]; problems: string[]; solutions: string[]; nextSteps: string[] }> = {
    video: {
      headlines: [
        'Shorts Growth Package',
        'Stream-to-Shorts Content System',
        'Short-Form Clip Package',
        'Content Repurposing System',
        'Clip Publishing Retainer',
      ],
      problems: [
        'Creators often have strong long-form content but struggle to turn the best moments into short clips that hold attention on Shorts, Reels, or TikTok.',
        'Many channels leave high-value moments buried inside long videos instead of converting them into discovery-focused clips.',
        'Creators need consistent short-form output, but finding, editing, and packaging moments takes time away from creating content.',
      ],
      solutions: [
        `This offer turns your existing content into high-retention short-form clips built for Shorts, Reels, and TikTok${uniqueMechanism ? ` using ${uniqueMechanism}` : ''}.`,
        'This package extracts the strongest moments from your content and turns them into clips designed to improve discovery and watch time.',
        'This system helps creators publish more short-form content without recording new footage — the clips come from what you already have.',
      ],
      nextSteps: [
        'Book a quick discovery call to review your recent content and identify the best clips for your first batch.',
        'Send over your recent videos and receive a sample short-form clip to see the quality before committing.',
        'Reply with your preferred short-form platform and content style, and we will send over a custom package proposal.',
      ],
    },
    wordpress: {
      headlines: [
        'Website Launch Package',
        'Professional WordPress Build',
        'Performance-First Website Setup',
        'Website Clarity & Conversion Package',
        'Professional WordPress Launch',
      ],
      problems: [
        'Startups often have a strong product but no website that explains their value clearly. Without a professional web presence, credibility suffers and visitors leave without taking action.',
        'Many founders spend weeks trying to build a website themselves, only to end up with a slow, unclear site that does not convert visitors.',
        'A weak website can hurt a startup before it gains traction. Investors, partners, and customers judge the product by how it is presented online.',
      ],
      solutions: [
        `This package delivers a professional, performance-optimised WordPress website that clearly communicates your product value and guides visitors toward action${uniqueMechanism ? ` using ${uniqueMechanism}` : ''}.`,
        'A focused build process covers product understanding, structure planning, custom theme development, performance optimisation, and clean handoff.',
        'This approach ensures your website is launch-ready, mobile-responsive, and built to convert visitors from day one.',
      ],
      nextSteps: [
        'Book a discovery call to understand your product, audience, and goals before planning the site structure.',
        'Send over your current website or brand materials and receive a structure proposal with layout suggestions.',
        'Reply with your preferred timeline and we will send over a custom website package proposal.',
      ],
    },
    design: {
      headlines: [
        'Interface Clarity Package',
        'Product UX Redesign Proposal',
        'Landing Page Conversion Redesign',
        'Design System & UI Audit Package',
        'Onboarding Flow Redesign',
      ],
      problems: [
        'Many products have useful features but lose users because the interface is confusing, cluttered, or hard to navigate. Activation and retention suffer as a result.',
        'Product teams often know their interface needs improvement but lack the focused design time to research, redesign, and test better solutions.',
        'A confusing onboarding experience can cause users to churn before they reach the product\'s core value. First impressions matter more than most teams realise.',
      ],
      solutions: [
        `This package delivers a clearer product interface with improved information hierarchy, reduced visual noise, and a design system ready for development${uniqueMechanism ? ` using ${uniqueMechanism}` : ''}.`,
        'A structured redesign process covers UX audit, wireframing, visual design, prototyping, and developer-ready handoff.',
        'This approach removes the guesswork from interface design and delivers a product that users can navigate intuitively.',
      ],
      nextSteps: [
        'Book a UX review call to understand your current interface and identify the highest-impact friction points.',
        'Send over your current product screens or prototype and receive a UX audit with improvement suggestions.',
        'Reply with your product area of focus and we will send over a custom redesign proposal.',
      ],
    },
  };

  const nicheKey = getNicheKey(niche);
  const base = (NICHE_PROPOSAL[nicheKey]?.[cat] as typeof defaults['video']) ?? defaults[cat];
  return serviceId
    ? (SERVICE_PROPOSAL[serviceId]?.[nicheKey] ?? base)
    : base;
}

export function generateBlueprintContent(cat: ServiceCategory, audience: string, serviceLabel: string, offerType: string, deliverables: string[], uniqueMechanism: string | null, scopeLimits: any, valueAmplifier: string, pricingModel: string, finalPrice: string, tieredPricing: any, valueBasedPricing: any, niche = '') {
  const mech = uniqueMechanism || '';
  const modelLabel = pricingModel === 'flat_rate' ? 'Flat Rate' : pricingModel === 'tiered' ? 'Tiered' : pricingModel === 'value_based' ? 'Value Based' : 'Custom';
  const pricingDesc = pricingModel === 'tiered'
    ? `$${tieredPricing?.starterPrice} \u2013 $${tieredPricing?.premiumPrice}`
    : pricingModel === 'value_based'
      ? valueBasedPricing?.suggestedPriceRange || `$${finalPrice}`
      : finalPrice ? `$${finalPrice}` : 'TBD';
  const offerName = generateOfferName(cat, serviceLabel, offerType, niche);

  return {
    offerName,
    whoItIsFor: generateWhoItIsFor(cat, audience, deliverables, niche),
    problemItSolves: generateProblemItSolves(cat, audience, serviceLabel, niche),
    corePromise: generateCorePromise(cat, serviceLabel, mech || null, niche),
    whyThisWorks: generateWhyThisWorks(cat, audience, deliverables, mech || null, niche),
    nextStepCTA: generateNextStepCTA(cat, audience, offerType, niche),
    pricingStructure: `${pricingDesc} \u2014 ${modelLabel}`,
  };
}

const NICHE_CASE_STUDY: Record<string, Partial<Record<ServiceCategory, { problem: string; process: string; result: string; tools: string; cta: string }>>> = {
  gaming: {
    video: {
      problem: 'Many gaming creators have strong gameplay moments in their streams and VODs, but those moments often stay buried inside long recordings instead of reaching new audiences on short-form platforms as discoverable clips.',
      process: 'I reviewed the gaming footage and stream VODs, selected the highest-potential gameplay moments, shaped each clip around a clear hook, added captions, tightened pacing, and prepared the clips for Shorts, Reels, or TikTok with platform-specific optimisation.',
      result: 'A focused sample pack that shows how long-form gaming content can be turned into short-form clips designed for retention, discovery, and consistent publishing.',
      tools: 'Premiere Pro, After Effects, Audition',
      cta: 'Send me one gaming VOD or stream highlight and I will suggest 3 specific clip ideas.',
    },
  },
  educational: {
    video: {
      problem: 'Many educational creators have high-quality course content, but the best teaching moments stay buried inside full-length tutorials instead of reaching new students through short-form platforms as promotional clips.',
      process: 'I reviewed the course content and tutorial footage, selected the most engaging teaching moments, shaped each clip around a clear learning hook, added captions, tightened pacing, and prepared the clips for Shorts, Reels, or TikTok.',
      result: 'A focused clip pack that shows how educational content can be repurposed into short-form clips designed to drive enrollment and demonstrate teaching quality.',
      tools: 'Premiere Pro, After Effects, Audition',
      cta: 'Send me one educational video or tutorial and I will suggest 3 specific clip ideas.',
    },
  },
  podcast: {
    video: {
      problem: 'Many podcasters record great interviews and conversations, but the strongest moments stay inside full-length episodes instead of reaching new listeners through short-form platforms as discovery clips.',
      process: 'I reviewed the podcast episode, selected the most compelling conversational moments, shaped each clip around a strong hook, added captions and visual context, tightened pacing, and prepared the clips for Shorts, Reels, or TikTok.',
      result: 'A focused clip pack that shows how podcast content can be repurposed into short-form clips designed to attract new listeners and grow show awareness.',
      tools: 'Premiere Pro, After Effects, Audition, Headliner',
      cta: 'Send me one podcast episode and I will suggest 3 specific clip ideas.',
    },
  },
  ai_startups: {
    wordpress: {
      problem: 'Many AI startups have an innovative product but no professional website to show for it. This hurts credibility with investors and makes it harder to convert early visitors into signups or demos.',
      process: 'I started by understanding the AI product and target audience, planned the site structure and content hierarchy to communicate complex technology clearly, built a custom theme with performance-first principles, and delivered a responsive, SEO-optimised site with clear documentation.',
      result: 'A professional, fast-loading website that clearly communicates the AI product value, builds confidence with investors, and drives conversions from early adopters.',
      tools: 'VS Code, LocalWP, Figma, Git, Lighthouse',
      cta: 'Send me your current website or product description and I will suggest 3 specific improvements.',
    },
  },
  local_business: {
    wordpress: {
      problem: 'Many local businesses rely on word-of-mouth but have no professional website that appears in local search. Without a clear online presence, they miss out on customers actively searching for their services.',
      process: 'I started by understanding the business services and target area, planned a local SEO-focused site structure, built a mobile-first custom theme with service pages and contact optimisation, and delivered a responsive site with clear navigation and local content.',
      result: 'A professional, mobile-friendly website that shows up in local search, clearly presents services, and makes it easy for nearby customers to get in touch.',
      tools: 'VS Code, LocalWP, Figma, Git, Google Business Profile',
      cta: 'Send me your business information and I will suggest 3 specific improvements for your online presence.',
    },
  },
  marketing_agencies: {
    wordpress: {
      problem: 'Many marketing agencies have strong client results but a weak website that fails to showcase their work or generate inbound leads. This undermines their credibility and makes them rely on referrals instead of a steady lead stream.',
      process: 'I started by understanding the agency services and target clients, planned a portfolio-first site structure with case study showcases, built a custom theme with performance optimisation, and delivered a professional site that highlights results and drives inquiries.',
      result: 'A high-performance agency website that showcases client results, demonstrates expertise, and generates qualified inbound leads.',
      tools: 'VS Code, LocalWP, Figma, Git, Lighthouse',
      cta: 'Send me your current portfolio or case studies and I will suggest 3 specific improvements.',
    },
  },
  saas: {
    design: {
      problem: 'Many SaaS products have useful features, but users struggle because the interface does not guide them clearly through key actions. Confusion during onboarding leads to low activation and higher churn rates.',
      process: 'I reviewed the existing interface, mapped the user flow and identified friction points, redesigned the key screens with clearer information hierarchy, built a component system for consistency, and delivered developer-ready handoff files with design documentation.',
      result: 'A redesigned interface that is easier to navigate, reduces user friction, and communicates the product value more clearly at every touchpoint.',
      tools: 'Figma, Protopie, Miro, Storybook',
      cta: 'Send me your product\u2019s current UI and I will suggest 3 specific improvements.',
    },
  },
  product_startups: {
    design: {
      problem: 'Many early-stage product startups build useful features but struggle to communicate their value through the interface. First-time users often feel lost during onboarding, and unclear landing pages fail to convert interest into signups.',
      process: 'I reviewed the current product concept, mapped the ideal first-user journey, designed key screens with clear information hierarchy and focused CTAs, built a consistent visual language, and delivered prototype-ready files with user flow documentation.',
      result: 'A clear product interface and landing page that communicates value instantly and guides first-time users toward the core experience without confusion.',
      tools: 'Figma, Protopie, Miro',
      cta: 'Send me your current product screens or wireframes and I will suggest 3 specific improvements.',
    },
  },
  design_agencies: {
    design: {
      problem: 'Many design agencies deliver inconsistent work across projects because they lack a centralised design system. Each project starts from scratch, leading to slower delivery, variable quality, and higher revision rates.',
      process: 'I audited the agency\u2019s existing work and design assets, planned the component hierarchy and design tokens, built a reusable component library with clear documentation, and created team onboarding materials for system adoption.',
      result: 'A scalable design system that enables consistent quality across all client projects, reduces per-project delivery time, and allows senior designers to focus on higher-value creative work.',
      tools: 'Figma, Storybook, Zeroheight, GitHub',
      cta: 'Send me examples of your recent client work and I will suggest 3 specific improvements for your design system.',
    },
  },
};

const SERVICE_CASE_STUDY: Record<string, Record<string, Partial<{ problem: string; process: string; result: string; tools: string; cta: string }>>> = {
  plugin_integration_dev: {
    ai_startups: {
      problem: 'Many AI startups have a strong product but no way for users to integrate it into their existing workflows. Without a plugin or connector, potential customers face friction and may abandon the tool before experiencing its value.',
      process: 'I analysed the AI product\u2019s API and integration requirements, designed a plugin architecture that maps to user workflows, built the integration with clear configuration options, tested against real usage patterns, and delivered documentation for setup and common troubleshooting.',
      result: 'A functional plugin that connects the AI product to common platforms, reducing adoption friction and helping users get value from the tool within minutes instead of hours.',
      tools: 'VS Code, LocalWP, Postman, Git, WP CLI, PHP',
      cta: 'Send me your product\u2019s API documentation and I will suggest 3 specific integration approaches.',
    },
    marketing_agencies: {
      problem: 'Many marketing agencies struggle to get client campaign setups live on time because of complex plugin integrations, broken web forms, mismatched CRM tracking, and custom plugin settings that fail to sync campaign data.',
      process: 'I configured and tested the campaign forms, connected the custom CRM integrations, set up analytics tracking tags, resolved WordPress plugin configuration issues, and provided clean handoff documentation for the client campaign setup.',
      result: 'A fully integrated WordPress campaign setup with error-free forms, seamless CRM sync, accurate marketing tracking tags, and a reliable technical handoff.',
      tools: 'VS Code, LocalWP, Postman, Git, WP CLI, PHP, REST APIs, CRM APIs',
      cta: 'Send me one client campaign setup and I will audit the forms, tracking, and CRM integration for 3 improvement areas.',
    },
  },
  site_migration_performance: {
    local_business: {
      problem: 'Many local businesses are stuck with slow, outdated websites that frustrate potential customers and hurt local search rankings. Even with great service, a poor-performing site drives visitors to faster competitors.',
      process: 'I audited the existing site for performance issues and SEO gaps, planned a migration strategy that preserves search rankings, rebuilt the site on a modern WordPress stack with caching, CDN, and image optimisation, and delivered a fast, reliable site.',
      result: 'A fully migrated, high-performance website that loads in under 2 seconds on mobile, ranks higher in local search, and keeps visitors engaged instead of driving them to competitors.',
      tools: 'VS Code, LocalWP, WP CLI, Lighthouse, PageSpeed Insights, Cloudflare CDN',
      cta: 'Send me your current website URL and I will run a free performance audit with 3 specific recommendations.',
    },
    ai_startups: {
      problem: 'Many AI startups launch on a quick MVP site that becomes a bottleneck as they grow. Slow load times, poor mobile performance, and outdated SEO hurt growth and investor credibility.',
      process: 'I audited the existing site, planned a migration to a modern, scalable WordPress architecture, rebuilt with performance-first engineering (caching, lazy loading, CDN, critical CSS), preserved existing SEO equity, and delivered a fast, future-ready site.',
      result: 'A significantly faster website that loads in under 1.5 seconds, maintains or improves search rankings, and presents a credible, professional presence that supports growth.',
      tools: 'VS Code, LocalWP, WP CLI, Lighthouse, PageSpeed Insights, Cloudflare CDN, Redis',
      cta: 'Send me your current website URL and I will run a comprehensive performance audit with 3 specific migration recommendations.',
    },
  },
};

export function generateCaseStudy(cat: ServiceCategory, deliverables: string[], audience: string, niche = '', serviceId?: string): {
  problem: string; process: string; result: string; tools: string; cta: string
} {
  const defaults: Record<ServiceCategory, { problem: string; process: string; result: string; tools: string; cta: string }> = {
    video: {
      problem: 'Many creators have great content, but the best moments stay buried inside long videos instead of reaching new audiences on short-form platforms.',
      process: 'I reviewed the source footage, selected high-potential moments, shaped each clip around a clear hook, added captions, tightened pacing, and prepared the clips for Shorts, Reels, or TikTok.',
      result: 'A focused sample pack that shows how long-form content can be turned into short-form clips designed for retention and discovery.',
      tools: 'Premiere Pro, After Effects, Audition',
      cta: 'Send me one long-form video and I will suggest 3 specific clip ideas.',
    },
    wordpress: {
      problem: 'Many startups have a strong product but no professional website to show for it. This hurts credibility with investors and makes it harder to convert early visitors into customers.',
      process: 'I started by understanding the product and target audience, planned the site structure and content hierarchy, built a custom theme with performance-first principles, and delivered a responsive, SEO-optimised site with clear documentation.',
      result: 'A professional, fast-loading website that clearly communicates the product value and drives conversions from day one.',
      tools: 'VS Code, LocalWP, Figma, Git',
      cta: 'Send me your current website or landing page and I will suggest 3 specific improvements.',
    },
    design: {
      problem: 'Many products have useful features, but users struggle because the interface does not guide them clearly through key actions. Confusion during onboarding leads to low activation and retention.',
      process: 'I reviewed the existing interface, mapped the user flow, identified friction points, redesigned the key screens with clearer information hierarchy, built a component system for consistency, and delivered developer-ready handoff files.',
      result: 'A redesigned interface that is easier to navigate, reduces user friction, and communicates the product value more clearly at every touchpoint.',
      tools: 'Figma, Protopie, Miro, Storybook',
      cta: 'Send me your product\u2019s current UI and I will suggest 3 specific improvements.',
    },
  };

  const result = nicheContent(cat, niche, defaults, NICHE_CASE_STUDY);
  return applyNicheServiceOverride(result, serviceId, niche, SERVICE_CASE_STUDY);
}

const NICHE_SAMPLE_PROJECT: Record<string, Partial<Record<ServiceCategory, { projectName: string; goal: string; whatToCreate: string; deliverables: string[]; timeline: string; howToPresent: string }>>> = {
  gaming: {
    video: {
      projectName: 'Gaming Shorts Sample Pack',
      goal: 'Show how long-form gaming streams and VODs can be turned into short-form clips designed for retention, discovery, and viral reach on Shorts, Reels, and TikTok.',
      whatToCreate: 'Create 3 short-form clips from sample gaming footage or stream VODs. Each clip should include a clear hook, tight pacing, captions, and a short explanation of the editing decisions behind each clip.',
      deliverables: ['3 short-form gaming clips', 'Hook notes per clip', 'Caption files (SRT)', 'Before/after editing breakdown', 'Short process explanation'],
      timeline: '1 week',
      howToPresent: 'Create a portfolio page showing the original gameplay moment, the edited clip, and a short explanation of why the edit improves retention and viewer engagement for gaming audiences.',
    },
  },
  educational: {
    video: {
      projectName: 'Educational Content Clip Pack',
      goal: 'Show how long-form educational content and tutorials can be repurposed into short-form clips that drive enrollment and demonstrate teaching quality.',
      whatToCreate: 'Create 3 short-form clips from sample course content or tutorial footage. Each clip should include a clear learning hook, tight pacing, captions, and an explanation of the editing choices behind each clip.',
      deliverables: ['3 short-form educational clips', 'Hook notes per clip', 'Caption files (SRT)', 'Before/after editing breakdown', 'Short process explanation'],
      timeline: '1 week',
      howToPresent: 'Create a portfolio page showing the original lesson moment, the edited clip, and an explanation of how each edit makes the content more engaging for educational audiences.',
    },
  },
  podcast: {
    video: {
      projectName: 'Podcast Clip Sample Pack',
      goal: 'Show how raw podcast episodes can be turned into short-form clips that capture the strongest conversational moments and drive listenership.',
      whatToCreate: 'Create 3 short-form clips from a sample podcast episode. Each clip should include a compelling hook, visual context, tight pacing, captions, and an explanation of the moment selection and editing decisions.',
      deliverables: ['3 short-form podcast clips', 'Hook notes per clip', 'Caption files (SRT)', 'Episode moment mapping', 'Short process explanation'],
      timeline: '1 week',
      howToPresent: 'Create a portfolio page showing the original episode moments, the edited clips, and an explanation of how each edit captures the conversation\u2019s value for podcast audiences.',
    },
  },
  ai_startups: {
    wordpress: {
      projectName: 'AI Startup Landing Page Build',
      goal: 'Show how a clear, professional WordPress landing page can build trust and drive conversions for an AI startup targeting investors and early adopters.',
      whatToCreate: 'Build a custom WordPress landing page for a fictional AI startup. Include a hero section with clear value proposition, feature highlights, social proof placeholder, and a clear CTA. Optimise for performance and mobile responsiveness.',
      deliverables: ['Custom WordPress landing page template', 'Responsive mobile version', 'SEO-optimised semantic HTML', 'Performance report (Lighthouse)', 'Handoff documentation'],
      timeline: '2 weeks',
      howToPresent: 'Show the live landing page, include a before/after of the design process, and display Lighthouse performance scores to demonstrate optimisation for an AI product audience.',
    },
  },
  local_business: {
    wordpress: {
      projectName: 'Local Business Service Website',
      goal: 'Show how a clear, mobile-friendly WordPress website can help a local business attract nearby customers and convert online visits into calls or bookings.',
      whatToCreate: 'Build a custom WordPress website for a fictional local service business. Include a homepage with service overview, individual service pages, about section, contact page with local SEO optimisation, and a clear lead capture form.',
      deliverables: ['Custom WordPress theme with service pages', 'Responsive mobile version', 'Local SEO-optimised content structure', 'Contact and lead capture integration', 'Handoff documentation'],
      timeline: '2 weeks',
      howToPresent: 'Show the live website, highlight the local SEO structure, mobile responsiveness, and clear service presentation that makes it easy for local customers to take action.',
    },
  },
  marketing_agencies: {
    wordpress: {
      projectName: 'Agency Portfolio Website Build',
      goal: 'Show how a portfolio-focused WordPress website can help a marketing agency showcase client results and generate inbound leads.',
      whatToCreate: 'Build a custom WordPress portfolio website for a fictional marketing agency. Include a homepage with results overview, case study pages, service descriptions, about section, and a clear inquiry form.',
      deliverables: ['Custom WordPress theme with portfolio layout', 'Case study page template', 'Responsive mobile version', 'SEO-optimised structure', 'Handoff documentation'],
      timeline: '2 weeks',
      howToPresent: 'Show the live website, highlight the portfolio structure, case study presentation, and the lead generation path that makes it easy for potential clients to start a conversation.',
    },
  },
  saas: {
    design: {
      projectName: 'SaaS Dashboard Redesign Concept',
      goal: 'Show how a data-heavy SaaS dashboard can be redesigned for clarity, reduced cognitive load, and better user decision-making.',
      whatToCreate: 'Design 3 key dashboard views with improved information hierarchy, clear data visualisation, and a consistent component system. Present as an interactive Figma prototype with design rationale.',
      deliverables: ['Redesigned dashboard screens (3 views)', 'Interactive Figma prototype', 'Design system components', 'Before/after comparison', 'Design decisions document'],
      timeline: '3 weeks',
      howToPresent: 'Create a case study page showing the original dashboard, your design decisions, the redesigned screens, and a link to the interactive prototype that demonstrates improved user flow.',
    },
  },
  product_startups: {
    design: {
      projectName: 'Product Onboarding Redesign',
      goal: 'Show how a redesigned first-use experience can help an early-stage product communicate value and activate users faster.',
      whatToCreate: 'Design a complete onboarding flow for a fictional product startup, including landing page, sign-up flow, first-use tutorial, and dashboard homepage. Present as an interactive Figma prototype.',
      deliverables: ['Onboarding flow screens (4-5 views)', 'Interactive Figma prototype', 'User flow documentation', 'Before/after comparison', 'Design rationale document'],
      timeline: '2 weeks',
      howToPresent: 'Create a case study page showing the original concept, your user flow improvements, the redesigned screens, and a link to the interactive prototype that demonstrates the improved onboarding experience.',
    },
  },
  design_agencies: {
    design: {
      projectName: 'Design System Build for Agency',
      goal: 'Show how a scalable design system can help a design agency deliver consistent, high-quality work across multiple client projects.',
      whatToCreate: 'Build a complete design system for a fictional design agency, including design tokens, reusable components, page templates, and team documentation. Present as a live Figma library with storybook integration.',
      deliverables: ['Design token specification', 'Reusable component library', 'Page template examples', 'Team onboarding documentation', 'Figma library and Storybook preview'],
      timeline: '4 weeks',
      howToPresent: 'Create a case study page showing the before/state of scattered design assets, the organised system, live component examples, and documentation that enables team adoption.',
    },
  },
};

const SERVICE_SAMPLE_PROJECT: Record<string, Record<string, Partial<{ projectName: string; goal: string; whatToCreate: string; deliverables: string[]; timeline: string; howToPresent: string }>>> = {
  plugin_integration_dev: {
    ai_startups: {
      projectName: 'AI Product Plugin Integration Prototype',
      goal: 'Show how a WordPress plugin can help an AI product integrate into users\u2019 existing platforms and reduce adoption friction.',
      whatToCreate: 'Build a functional WordPress plugin prototype for a fictional AI product. Include API connection module, configuration settings page, shortcode or widget for frontend embedding, and setup documentation.',
      deliverables: ['WordPress plugin with API connector', 'Configuration settings page', 'Frontend embed component', 'Setup and troubleshooting documentation', 'Integration test results'],
      timeline: '3 weeks',
      howToPresent: 'Create a portfolio page showing the plugin architecture, the API integration flow, a live demo of the configuration, and documentation demonstrating ease of setup.',
    },
    marketing_agencies: {
      projectName: 'Marketing Tool Integration Connector',
      goal: 'Show how a WordPress plugin integration can connect CRM, forms, and tracking tools for client campaign setup.',
      whatToCreate: 'Build a plugin integration connector that links WordPress forms to a CRM and sets up campaign tracking tags with a clean client handoff process.',
      deliverables: [
        'WordPress plugin connector setup',
        'CRM API connection module',
        'WordPress forms integration',
        'Campaign tracking tag setup',
        'Client campaign setup documentation for handoff'
      ],
      timeline: '2 weeks',
      howToPresent: 'Create a case study showing the campaign setup with plugin integration, working forms, CRM connections, and tracking tags.',
    },
  },
  site_migration_performance: {
    local_business: {
      projectName: 'Local Business Site Migration Project',
      goal: 'Show how a slow, outdated website can be migrated to a modern WordPress stack to improve performance, search rankings, and user experience.',
      whatToCreate: 'Migrate a sample local business website (provided as static HTML or an old site backup) to a modern WordPress setup. Include performance optimisation, SEO preservation, mobile responsiveness, and a post-migration audit.',
      deliverables: ['Fully migrated WordPress site', 'Performance optimisation (caching, CDN, images)', 'SEO preservation and improvement report', 'Pre/post migration audit', 'Handoff and maintenance guide'],
      timeline: '2 weeks',
      howToPresent: 'Create a portfolio page showing the before/after performance scores, a case write-up of the migration process, and a live demo of the faster, mobile-optimised site.',
    },
    ai_startups: {
      projectName: 'Startup Site Performance Migration',
      goal: 'Show how an AI startup can migrate from a slow MVP site to a high-performance WordPress setup that supports growth and investor confidence.',
      whatToCreate: 'Take a sample AI startup website (or simulated slow site) and perform a full migration to a modern WordPress stack. Include performance optimisation, SEO preservation, and a comprehensive audit.',
      deliverables: ['Migrated high-performance WordPress site', 'CDN and caching setup', 'Pre/post performance audit report', 'SEO preservation documentation', 'Maintenance and scaling guide'],
      timeline: '2 weeks',
      howToPresent: 'Create a portfolio page showing the performance transformation, Lighthouse score improvements, migration case study, and a live demo of the optimised site.',
    },
  },
};

export function generateSampleProject(cat: ServiceCategory, niche = '', serviceId?: string): {
  projectName: string; goal: string; whatToCreate: string; deliverables: string[]; timeline: string; howToPresent: string
} {
  const defaults: Record<ServiceCategory, { projectName: string; goal: string; whatToCreate: string; deliverables: string[]; timeline: string; howToPresent: string }> = {
    video: {
      projectName: 'Short-Form Clip Sample Pack',
      goal: 'Show how long-form content can be turned into short-form clips designed for retention and discovery on Shorts, Reels, and TikTok.',
      whatToCreate: 'Create 3 short-form clips from sample footage. Each clip should include a clear hook, tight pacing, captions, and a short explanation of the editing decisions behind each clip.',
      deliverables: ['3 short-form clips', 'Hook notes per clip', 'Caption files (SRT)', 'Before/after editing breakdown', 'Short process explanation'],
      timeline: '1 week',
      howToPresent: 'Create a portfolio page showing the original moment, the edited clip, and a short explanation of why the edit improves retention and viewer engagement.',
    },
    wordpress: {
      projectName: 'Landing Page Build',
      goal: 'Show how a clear, professional landing page can communicate product value and drive conversions.',
      whatToCreate: 'Build a custom WordPress landing page for a fictional product. Include a hero section, feature highlights, social proof placeholder, and a clear CTA. Optimise for performance and mobile responsiveness.',
      deliverables: ['Custom WordPress landing page template', 'Responsive mobile version', 'SEO-optimised semantic HTML', 'Performance report (Lighthouse)', 'Handoff documentation'],
      timeline: '2 weeks',
      howToPresent: 'Show the live landing page, include a before/after of the design process, and display Lighthouse performance scores to demonstrate optimisation.',
    },
    design: {
      projectName: 'Interface Redesign Concept',
      goal: 'Show how a product interface can be redesigned for clarity, reduced cognitive load, and better user engagement.',
      whatToCreate: 'Design 3 key interface views with improved information hierarchy, clear data visualisation, and a consistent component system. Present as an interactive Figma prototype.',
      deliverables: ['Redesigned interface screens (3 views)', 'Interactive Figma prototype', 'Design system components', 'Before/after comparison', 'Design decisions document'],
      timeline: '3 weeks',
      howToPresent: 'Create a case study page showing the original interface, your design decisions, the redesigned screens, and a link to the interactive prototype.',
    },
  };

  const result = nicheContent(cat, niche, defaults, NICHE_SAMPLE_PROJECT);
  return applyNicheServiceOverride(result, serviceId, niche, SERVICE_SAMPLE_PROJECT);
}

const NICHE_PORTFOLIO_COPY: Record<string, Partial<Record<ServiceCategory, { headline: string; shortIntro: string; caseStudyIntro: string; processSection: string; cta: string }>>> = {
  gaming: {
    video: {
      headline: 'I help gaming creators turn long-form streams, VODs, and gameplay moments into short-form clips designed for retention, discovery, and consistent publishing.',
      shortIntro: 'I work with gaming creators to review source footage and streams, select the highest-potential moments, and shape each clip around a clear hook with tight pacing and captions for Shorts, Reels, and TikTok.',
      caseStudyIntro: 'Here is a sample project showing how gaming clips can be created from long-form gameplay and stream VODs, built for retention and discovery across short-form platforms.',
      processSection: 'I review your gaming footage and streams, identify the highest-potential gameplay moments, shape each clip around a clear hook, add captions, tighten the pacing, and prepare the clips for Shorts, Reels, or TikTok.',
      cta: 'Send me one gaming VOD or stream highlight and I will suggest 3 specific clip ideas.',
    },
  },
  educational: {
    video: {
      headline: 'I help educational creators turn course content and tutorials into short-form clips designed to drive enrollment and build teaching authority.',
      shortIntro: 'I work with educational creators to review course content and tutorial footage, select the most engaging teaching moments, and shape each clip around a clear learning hook with tight pacing and captions.',
      caseStudyIntro: 'Here is a sample project showing how educational course content can be turned into short-form clips designed to attract new students and demonstrate teaching quality.',
      processSection: 'I review your educational content, identify the most valuable teaching moments, shape each clip around a clear learning hook, add captions, tighten the pacing, and prepare the clips for Shorts, Reels, or TikTok.',
      cta: 'Send me one educational video or tutorial and I will suggest 3 specific clip ideas.',
    },
  },
  podcast: {
    video: {
      headline: 'I help podcasters turn episode footage into short-form clips that capture the strongest moments and drive listenership.',
      shortIntro: 'I work with podcasters to review episode footage, select the most compelling conversational moments, and shape each clip around a strong hook with visual context, captions, and tight pacing.',
      caseStudyIntro: 'Here is a sample project showing how raw podcast interview footage can be turned into short-form clips designed to attract new listeners and grow show awareness.',
      processSection: 'I review your podcast episodes, identify the strongest conversational moments, shape each clip around a compelling hook, add visual context and captions, tighten the pacing, and prepare the clips for Shorts, Reels, or TikTok.',
      cta: 'Send me one podcast episode and I will suggest 3 specific clip ideas.',
    },
  },
  ai_startups: {
    wordpress: {
      headline: 'I help AI startups launch fast, professional WordPress websites that communicate product value and build investor confidence.',
      shortIntro: 'I build custom WordPress sites for AI startups that clearly communicate complex product value, load fast, and convert visitors into signups or demo requests.',
      caseStudyIntro: 'Here is a sample project showing how an AI startup can go from no website to a professional, conversion-ready launch page built for performance and clarity.',
      processSection: 'I start with your AI product and target audience, plan the site structure and content hierarchy to communicate complex technology clearly, build a custom WordPress theme with performance optimisation, and deliver a responsive, SEO-optimised site with clear documentation.',
      cta: 'Send me your current website or product description and I will suggest 3 specific improvements.',
    },
  },
  local_business: {
    wordpress: {
      headline: 'I help local businesses build professional WordPress websites that attract nearby customers and turn visits into leads.',
      shortIntro: 'I build mobile-friendly, local SEO-optimised WordPress sites for service businesses that clearly present services, appear in local search, and make it easy for customers to get in touch.',
      caseStudyIntro: 'Here is a sample project showing how a local service business can go from no online presence to a professional, lead-generating website that attracts nearby customers.',
      processSection: 'I start with your business services and target area, plan a local SEO-focused site structure, build a mobile-first custom theme with service pages and clear contact paths, and deliver a responsive site optimised for local search and conversions.',
      cta: 'Send me your business information and I will suggest 3 specific improvements for your online presence.',
    },
  },
  marketing_agencies: {
    wordpress: {
      headline: 'I help marketing agencies build high-performance WordPress websites that showcase client results and generate inbound leads.',
      shortIntro: 'I build portfolio-focused WordPress sites for agencies that demonstrate expertise, showcase case studies, and turn visitors into qualified leads.',
      caseStudyIntro: 'Here is a sample project showing how a marketing agency website can be transformed into a portfolio showcase that generates consistent inbound inquiries.',
      processSection: 'I start with your agency services and target clients, plan a portfolio-first site structure, build a custom theme that highlights case studies and results, optimise for performance, and deliver a professional site that drives lead generation.',
      cta: 'Send me your current portfolio or case studies and I will suggest 3 specific improvements.',
    },
  },
  saas: {
    design: {
      headline: 'I help SaaS teams design clearer product interfaces and dashboards that make the product easier to understand and use.',
      shortIntro: 'I design user-friendly SaaS interfaces that reduce friction, improve activation, and communicate product value at every touchpoint with a focus on clarity and consistency.',
      caseStudyIntro: 'Here is a sample project showing how a SaaS product interface can be redesigned for better clarity, reduced friction, and improved user engagement.',
      processSection: 'I review your current interface, identify usability issues, redesign key screens with clearer information hierarchy, build a reusable component system, and deliver developer-ready handoff files.',
      cta: 'Send me your product\u2019s current UI and I will suggest 3 specific improvements.',
    },
  },
  product_startups: {
    design: {
      headline: 'I help product startups design landing pages and interfaces that communicate value and drive early adoption.',
      shortIntro: 'I design clear, focused product interfaces and landing pages for early-stage startups that help first-time users understand the product value within seconds.',
      caseStudyIntro: 'Here is a sample project showing how a product startup interface can communicate value instantly and guide users toward the core experience.',
      processSection: 'I review your product concept and target users, map the ideal first-user journey, design key screens with clear information hierarchy and focused CTAs, and deliver prototype-ready files with user flow documentation.',
      cta: 'Send me your current product screens or wireframes and I will suggest 3 specific improvements.',
    },
  },
  design_agencies: {
    design: {
      headline: 'I help design agencies build scalable design systems and component libraries that improve delivery speed and quality.',
      shortIntro: 'I build scalable design systems and reusable component libraries for agencies that enable consistent, high-quality output across all client projects with faster delivery times.',
      caseStudyIntro: 'Here is a sample project showing how a design agency can build a design system that transforms their workflow, reduces delivery time, and improves quality consistency.',
      processSection: 'I audit your existing work and design assets, plan the component hierarchy and design tokens, build a reusable component library with clear documentation, and create team onboarding materials for system adoption.',
      cta: 'Send me examples of your recent client work and I will suggest 3 specific improvements for your design system.',
    },
  },
};

const SERVICE_PORTFOLIO_COPY: Record<string, Record<string, Partial<{ headline: string; shortIntro: string; caseStudyIntro: string; processSection: string; cta: string }>>> = {
  plugin_integration_dev: {
    ai_startups: {
      headline: 'I help AI startups build WordPress plugins and integrations that connect their products to users\u2019 existing platforms and reduce adoption friction.',
      shortIntro: 'I build WordPress plugins for AI products that handle API integration, user authentication, configuration, and embed components so users can start getting value within minutes.',
      caseStudyIntro: 'Here is a sample project showing how I built a WordPress plugin for an AI startup that connects their product to common platforms with seamless API integration and easy setup.',
      processSection: 'I start with your product\u2019s API and integration requirements, design a plugin architecture that mirrors user workflows, build the integration with clear configuration options, test against real usage patterns, and deliver setup documentation.',
      cta: 'Send me your product\u2019s API documentation and I will suggest 3 specific integration approaches.',
    },
    marketing_agencies: {
      headline: 'I help marketing agencies handle WordPress plugin integration, CRM forms setup, and campaign tracking tags for client campaigns.',
      shortIntro: 'I support marketing agencies with WordPress plugin integrations, form setup, CRM connections, tracking tags, and clean client campaign setup handoff documentation.',
      caseStudyIntro: 'Here is a sample project showing a client campaign setup with WordPress plugin integration, working forms, CRM connections, and tracking tags.',
      processSection: 'I verify the campaign requirements, configure the plugin integration, connect form fields to CRM APIs, verify tracking tag triggers, and compile client handoff documentation.',
      cta: 'Send me one client campaign setup and I will audit the plugin integration, forms, CRM connections, and campaign tracking tags.',
    },
  },
  site_migration_performance: {
    local_business: {
      headline: 'I help local businesses migrate from slow, outdated websites to high-performance WordPress sites that attract more customers.',
      shortIntro: 'I specialise in migrating local business websites to modern WordPress stacks with performance optimisation, local SEO preservation, and mobile-first design that drives leads.',
      caseStudyIntro: 'Here is a sample project showing how I migrated a local business from a slow, outdated website to a fast, mobile-optimised WordPress site that ranks higher in local search.',
      processSection: 'I start with a full site audit for performance issues and SEO gaps, plan a migration strategy that preserves rankings, rebuild on a modern WordPress stack with caching and CDN, and deliver a fast, reliable site with documentation.',
      cta: 'Send me your current website URL and I will run a free performance audit with 3 specific recommendations.',
    },
    ai_startups: {
      headline: 'I help AI startups migrate from slow MVP sites to high-performance WordPress platforms that support growth and investor credibility.',
      shortIntro: 'I specialise in migrating AI startup websites to modern WordPress stacks with performance-first engineering, SEO preservation, and scalable architecture that grows with the business.',
      caseStudyIntro: 'Here is a sample project showing how I migrated an AI startup from a slow MVP site to a high-performance WordPress setup that loads in under 1.5 seconds and supports growth.',
      processSection: 'I start with a full audit of your current site for performance and technical debt, plan a migration to a modern, scalable WordPress architecture, rebuild with performance-first engineering, preserve SEO equity, and deliver a fast, future-ready site.',
      cta: 'Send me your current website URL and I will run a comprehensive performance audit with 3 specific migration recommendations.',
    },
  },
};

export function generatePortfolioCopy(cat: ServiceCategory, niche = '', serviceId?: string): {
  headline: string; shortIntro: string; caseStudyIntro: string; processSection: string; cta: string
} {
  const defaults: Record<ServiceCategory, { headline: string; shortIntro: string; caseStudyIntro: string; processSection: string; cta: string }> = {
    video: {
      headline: 'I help creators turn long-form content into short-form clips designed for retention and discovery.',
      shortIntro: 'I work with creators to review source footage, select the highest-potential moments, and shape each clip around a clear hook with tight pacing and captions for Shorts, Reels, and TikTok.',
      caseStudyIntro: 'Here is a sample project showing how long-form content can be turned into a set of short-form clips built for retention and discovery across short-form platforms.',
      processSection: 'I review your source footage, identify the highest-potential moments, shape each clip around a clear hook, add captions, tighten the pacing, and prepare the clips for Shorts, Reels, or TikTok.',
      cta: 'Send me one long-form video and I will suggest 3 specific clip ideas.',
    },
    wordpress: {
      headline: 'I help startups launch fast, professional WordPress websites with clean structure, responsive layouts, and performance-first development.',
      shortIntro: 'I build custom WordPress sites that clearly communicate your product value, load fast, and convert visitors into leads or signups with a clean handoff process.',
      caseStudyIntro: 'Here is a sample project showing how a startup can go from no website to a professional, conversion-ready launch page built for performance and clarity.',
      processSection: 'I start with your product and audience, plan the site structure and content hierarchy, build a custom WordPress theme with performance optimisation, and deliver a responsive, SEO-optimised site with clear documentation.',
      cta: 'Send me your current website or landing page and I will suggest 3 specific improvements.',
    },
    design: {
      headline: 'I help product teams design clearer interfaces and landing pages that make the product easier to understand and use.',
      shortIntro: 'I design user-friendly product interfaces that reduce friction, improve activation, and communicate product value at every touchpoint with a focus on clarity and consistency.',
      caseStudyIntro: 'Here is a sample project showing how a product team can redesign their interface for better clarity, reduced friction, and improved user engagement.',
      processSection: 'I review your current interface, identify usability issues, redesign key screens with clearer information hierarchy, build a reusable component system, and deliver developer-ready handoff files.',
      cta: 'Send me your product\u2019s current UI and I will suggest 3 specific improvements.',
    },
  };

  const result = nicheContent(cat, niche, defaults, NICHE_PORTFOLIO_COPY);
  return applyNicheServiceOverride(result, serviceId, niche, SERVICE_PORTFOLIO_COPY);
}

const NICHE_NEXT_ACTIONS: Record<string, Partial<Record<ServiceCategory, string[]>>> = {
  gaming: {
    video: [
      'Create one sample gaming shorts pack from your own gameplay footage or stream VODs to demonstrate your editing approach for gaming content.',
      'Record a short before/after editing breakdown showing pacing and hook changes for one gaming clip.',
      'Publish the sample pack on your portfolio page with a short note explaining your editing decisions for gaming audiences.',
      'Add your editing process and delivery timeline to the portfolio page for transparency with gaming creator clients.',
      'Share the portfolio link with 10 gaming creators or communities on Discord, Twitch, or Reddit gaming subreddits.',
      'Update the portfolio after every new gaming sample or client project to keep it current and showcase your best work.',
    ],
  },
  educational: {
    video: [
      'Create one sample educational clip pack from your own course content or tutorial footage to demonstrate your editing approach for educational content.',
      'Record a short before/after editing breakdown showing pacing and hook changes that improve educational engagement.',
      'Publish the sample pack on your portfolio page with a short note explaining your editing decisions for educational audiences.',
      'Add your editing process and delivery timeline to the portfolio page for transparency with educational creator clients.',
      'Share the portfolio link with 10 educational creators or communities on YouTube, teaching forums, or LinkedIn.',
      'Update the portfolio after every new educational sample or client project to keep it current and relevant.',
    ],
  },
  podcast: {
    video: [
      'Create one sample podcast clip pack from your own episodes or publicly available podcast footage to demonstrate your editing approach for podcast content.',
      'Record a short before/after editing breakdown showing moment selection, pacing, and visual treatment decisions.',
      'Publish the sample pack on your portfolio page with a short note explaining your clip selection and editing decisions for podcast audiences.',
      'Add your editing process and delivery timeline to the portfolio page for transparency with podcaster clients.',
      'Share the portfolio link with 10 podcasters or podcast communities on LinkedIn, Twitter, or podcast-focused forums.',
      'Update the portfolio after every new podcast clip sample or client project to keep it current.',
    ],
  },
  ai_startups: {
    wordpress: [
      'Create one sample website build for a fictional AI startup to demonstrate your build process and understanding of AI product messaging.',
      'Record a performance comparison showing Lighthouse scores before and after optimisation for an AI-focused landing page.',
      'Publish the sample site on your portfolio page with a write-up of the build decisions and challenges specific to AI product websites.',
      'Add your build process and delivery timeline to the portfolio page for client confidence with AI startup founders.',
      'Share the portfolio link with 10 AI startup founders on LinkedIn, Product Hunt, or AI startup communities.',
      'Update the portfolio after every new project to keep your work current and relevant to the AI startup space.',
    ],
  },
  local_business: {
    wordpress: [
      'Create one sample website build for a fictional local service business to demonstrate your build process and local SEO understanding.',
      'Record a mobile responsiveness and local search optimisation walkthrough for the sample site.',
      'Publish the sample site on your portfolio page with a write-up of the local SEO decisions and service page structure.',
      'Add your build process and delivery timeline to the portfolio page for client confidence with local business owners.',
      'Share the portfolio link with 10 local business owners or business groups in your area on social media or local networks.',
      'Update the portfolio after every new project to keep your work current and relevant to local business clients.',
    ],
  },
  marketing_agencies: {
    wordpress: [
      'Create one sample website build for a fictional marketing agency to demonstrate your portfolio-first approach and lead generation focus.',
      'Record a walkthrough showing the portfolio structure, case study presentation, and lead capture path.',
      'Publish the sample site on your portfolio page with a write-up of the build decisions and portfolio layout approach.',
      'Add your build process and delivery timeline to the portfolio page for client confidence with agency founders.',
      'Share the portfolio link with 10 marketing agency owners on LinkedIn, agency networks, or industry forums.',
      'Update the portfolio after every new project to keep your work current and relevant to agency clients.',
    ],
  },
  saas: {
    design: [
      'Create one sample UI redesign concept for a real SaaS product you use regularly to demonstrate your UX thinking and design skills.',
      'Record a before/after walkthrough explaining the design decisions and expected impact on user engagement metrics.',
      'Publish the case study on your portfolio page with screenshots and a link to the Figma prototype showing improved user flows.',
      'Add your design process and delivery timeline to the portfolio page for clarity with SaaS product teams.',
      'Share the portfolio link with 10 SaaS product teams or designers on LinkedIn, Dribbble, or design communities.',
      'Update the portfolio after every new project to showcase your latest SaaS UX work.',
    ],
  },
  product_startups: {
    design: [
      'Create one sample onboarding redesign concept for a real early-stage product to demonstrate your first-user experience thinking.',
      'Record a before/after walkthrough explaining the user flow improvements and expected impact on activation rates.',
      'Publish the case study on your portfolio page with screenshots and a link to the Figma prototype.',
      'Add your design process and delivery timeline to the portfolio page for clarity with startup founders.',
      'Share the portfolio link with 10 product startup founders or incubator groups on LinkedIn or product communities.',
      'Update the portfolio after every new project to showcase your latest product design work.',
    ],
  },
  design_agencies: {
    design: [
      'Create one sample design system build for a fictional agency to demonstrate your system thinking and component library skills.',
      'Record a walkthrough showing the design token structure, component hierarchy, and team documentation.',
      'Publish the case study on your portfolio page with live component examples and a link to the Figma library.',
      'Add your design system development process and timeline to the portfolio page for clarity with agency teams.',
      'Share the portfolio link with 10 agency owners or design ops teams on LinkedIn or design system communities.',
      'Update the portfolio after every new project to showcase your latest design system work.',
    ],
  },
};

const SERVICE_NEXT_ACTIONS: Record<string, Record<string, string[]>> = {
  plugin_integration_dev: {
    marketing_agencies: [
      'Create one sample campaign integration setup for a fictional marketing agency.',
      'Build a form + CRM + tracking demo using WordPress tools.',
      'Record a walkthrough showing how the setup is tested before handoff.',
      'Publish the sample integration checklist on your portfolio.',
      'Share the portfolio link with 10 marketing agency operators or campaign managers.',
      'Update the portfolio after every new integration sample or real project.'
    ],
  },
};

export function generateNextActions(cat: ServiceCategory, niche = '', serviceId?: string): string[] {
  const defaults: Record<ServiceCategory, string[]> = {
    video: [
      'Create one sample clip pack from your own footage to demonstrate your editing approach.',
      'Record a short before/after editing breakdown showing pacing and hook changes for one clip.',
      'Publish the sample pack on your portfolio page with a short note explaining your editing decisions.',
      'Add your editing process and delivery timeline to the portfolio page for transparency.',
      'Share the portfolio link with 10 creators or communities on Discord or Reddit.',
      'Update the portfolio after every new sample or client project to keep it current.',
    ],
    wordpress: [
      'Create one sample website build for a fictional startup to demonstrate your build process.',
      'Record a performance comparison showing Lighthouse scores before and after optimisation.',
      'Publish the sample site on your portfolio page with a write-up of the build decisions and challenges.',
      'Add your build process and delivery timeline to the portfolio page for client confidence.',
      'Share the portfolio link with 10 founders in online communities or LinkedIn.',
      'Update the portfolio after every new project to keep your work current and relevant.',
    ],
    design: [
      'Create one sample UI redesign concept for a real product you use regularly.',
      'Record a before/after walkthrough explaining the design decisions and expected impact on user experience.',
      'Publish the case study on your portfolio page with screenshots and a link to the Figma prototype.',
      'Add your design process and delivery timeline to the portfolio page for clarity.',
      'Share the portfolio link with 10 product teams or design communities on Dribbble or LinkedIn.',
      'Update the portfolio after every new project to showcase your latest work.',
    ],
  };

  const base = nicheContent(cat, niche, defaults, NICHE_NEXT_ACTIONS);
  return serviceId
    ? (SERVICE_NEXT_ACTIONS[serviceId]?.[getNicheKey(niche)] ?? base)
    : base;
}

export function generateTrustBuilderBullets(cat: ServiceCategory, niche = '', serviceId?: string): string[] {
  const templates: Record<ServiceCategory, string[]> = {
    video: ['Clear editing process', 'Defined scope and timeline', 'Retention-focused approach', 'Creator-friendly communication', 'Fast turnaround on clips'],
    wordpress: ['Clear website build process', 'Performance-first development', 'Defined scope and timeline', 'Responsive mobile layout', 'Handoff documentation included'],
    design: ['User research-driven approach', 'Clear design process', 'Defined scope and deliverables', 'Developer handoff-ready files', 'Usability-focused design decisions'],
  };
  if (serviceId === 'plugin_integration_dev' && getNicheKey(niche) === 'marketing_agencies') {
    return [
      'Clear integration setup process',
      'Form + CRM connection workflow',
      'Tracking setup checklist',
      'Campaign QA before handoff',
      'Client-ready documentation'
    ];
  }
  return templates[cat];
}

/* ───────────────────────────────────────────────
 *  Module 5 — Client Pipeline System
 * ─────────────────────────────────────────────── */

const NICHE_CLIENT_SOURCES: Record<string, Partial<Record<ServiceCategory, {
  sourceName: string;
  whereToFind: string;
  whyItWorks: string;
  searchHint: string;
  difficulty: 'easy' | 'medium' | 'hard';
  bestFor: string;
}[]>>> = {
  gaming: {
    video: [
      { sourceName: 'YouTube Gaming Creators', whereToFind: 'YouTube search for gaming channels with 10K-100K subscribers posting long-form content', whyItWorks: 'These creators already produce long content that can be repurposed into short-form clips', searchHint: 'site:youtube.com "gaming" "business inquiries" OR "brand deals"', difficulty: 'easy', bestFor: 'Creators with consistent uploads looking to expand to Shorts' },
      { sourceName: 'Twitch Streamers', whereToFind: 'Twitch directory by game category, focus on streamers with VODs enabled and consistent schedules', whyItWorks: 'Streamers produce hours of footage per session that can become multiple short clips', searchHint: 'Twitch directory > browse by game > look for "VODs enabled" and recent streams', difficulty: 'medium', bestFor: 'Streamers with active chat communities and regular streaming schedules' },
      { sourceName: 'Discord Gaming Communities', whereToFind: 'Discord server listing sites or gaming subreddits that share community Discord links', whyItWorks: 'Communities gather creators who need content support and share opportunities', searchHint: 'site:disboard.org gaming OR twitch OR streamer', difficulty: 'medium', bestFor: 'Building relationships with multiple creators in one place' },
      { sourceName: 'Instagram Reels Gaming Creators', whereToFind: 'Instagram search by gaming hashtags and Reels tab for gaming content', whyItWorks: 'Creators already on short-form platforms understand the format and need consistent output', searchHint: 'Instagram search: #gamingreels #gamingcreator #gamingcontent', difficulty: 'easy', bestFor: 'Creators who already post short-form and need volume' },
      { sourceName: 'TikTok Gaming Creators', whereToFind: 'TikTok search for gaming creators with 5K-50K followers posting gameplay clips', whyItWorks: 'These creators know short-form but may lack editing skills or time to edit consistently', searchHint: 'TikTok search: gaming OR gameplay OR streamer with creator profile filled out', difficulty: 'easy', bestFor: 'Creators posting gameplay who could benefit from professional editing' },
      { sourceName: 'Esports Orgs', whereToFind: 'Esports team websites and social media pages for content teams or social media managers', whyItWorks: 'Organizations need consistent content for multiple platforms and often outsource editing', searchHint: 'site:esports.com "content creator" OR "social media" gaming', difficulty: 'hard', bestFor: 'Higher budget clients with ongoing content needs' },
      { sourceName: 'Gaming Podcast Channels', whereToFind: 'YouTube and Spotify for gaming-focused podcasts that could use clip repurposing', whyItWorks: 'Podcasts produce long-form audio that benefits from short visual clips for social promotion', searchHint: 'site:youtube.com "gaming podcast" OR "gaming talk show"', difficulty: 'medium', bestFor: 'Podcasters who want to promote episodes on short-form platforms' },
    ],
  },
  educational: {
    video: [
      { sourceName: 'YouTube Educators', whereToFind: 'YouTube search for educational channels (tutorials, courses, explainers) with 5K-100K subscribers', whyItWorks: 'Educational content has natural teaching moments that make effective short clips', searchHint: 'site:youtube.com "tutorial" OR "course" OR "learn" "business email" OR "contact"', difficulty: 'easy', bestFor: 'Teachers and educators who want to reach more students through short-form' },
      { sourceName: 'Course Creators', whereToFind: 'Platform search on Teachable, Udemy, Skillshare, or Gumroad for course sellers', whyItWorks: 'Course creators need promotional content and can use clips to drive enrollment', searchHint: 'site:teachable.com OR site:udemy.com "course" instructor profiles', difficulty: 'medium', bestFor: 'Creators with existing courses who want social media promotion' },
      { sourceName: 'Cohort-Based Course Creators', whereToFind: 'Platforms like Maven, Disco, Circle for cohort-based course facilitators', whyItWorks: 'Cohort courses need regular promotional content for each new cohort launch', searchHint: 'site:maven.com OR site:disco.co "cohort" OR "course" facilitator', difficulty: 'medium', bestFor: 'Creators who run regular cohorts and need consistent promotion' },
      { sourceName: 'LinkedIn Educators', whereToFind: 'LinkedIn search for creators posting educational content, courses, or thought leadership', whyItWorks: 'LinkedIn creators need short-form video to increase engagement and reach', searchHint: 'site:linkedin.com "educator" OR "course creator" OR "teach"', difficulty: 'easy', bestFor: 'Professionals building authority through educational content' },
      { sourceName: 'Newsletter Creators', whereToFind: 'Substack, Beehiiv, ConvertKit creator directories for writers with video content', whyItWorks: 'Newsletter creators repurpose content across formats and need video clips for social', searchHint: 'site:substack.com "education" OR "learning" OR "tutorial"', difficulty: 'medium', bestFor: 'Writers expanding into video content' },
    ],
  },
  podcast: {
    video: [
      { sourceName: 'YouTube Podcast Hosts', whereToFind: 'YouTube search for podcast channels with 5K-50K subscribers posting full episodes', whyItWorks: 'Long podcast episodes contain multiple quotable moments perfect for short clips', searchHint: 'site:youtube.com "podcast" "business inquiries" OR "sponsor"', difficulty: 'easy', bestFor: 'Podcasters who want to promote episodes on Shorts, Reels, and TikTok' },
      { sourceName: 'Spotify/Apple Podcast Creators', whereToFind: 'Podcast directories like Spotify, Apple Podcasts, and Podchaser by category', whyItWorks: 'Audio podcasts need visual clips for social promotion and discovery', searchHint: 'site:podchaser.com OR site:spotify.com "podcast" category', difficulty: 'medium', bestFor: 'Audio-first podcasters expanding to video clips' },
      { sourceName: 'LinkedIn Podcast Hosts', whereToFind: 'LinkedIn search for professionals who host or appear on industry podcasts', whyItWorks: 'Professionals use podcast appearances to build authority and need clip repurposing', searchHint: 'site:linkedin.com "podcast host" OR "podcast guest"', difficulty: 'easy', bestFor: 'B2B professionals who appear on multiple podcasts' },
      { sourceName: 'Interview Show Creators', whereToFind: 'YouTube channels running interview formats with consistent guest schedules', whyItWorks: 'Interview shows produce consistent long content with natural clip moments', searchHint: 'site:youtube.com "interview" OR "conversation with" weekly series', difficulty: 'medium', bestFor: 'Channels with regular guest schedules needing episode promotion' },
    ],
  },
  ai_startups: {
    wordpress: [
      { sourceName: 'Product Hunt Launches', whereToFind: 'Product Hunt upcoming and recent launches in AI category', whyItWorks: 'Newly launched AI tools often need better landing pages and clearer messaging', searchHint: 'site:producthunt.com "AI" "launched" products with weak landing pages', difficulty: 'easy', bestFor: 'Pre-seed and seed stage AI startups with recently launched products' },
      { sourceName: 'LinkedIn Startup Founders', whereToFind: 'LinkedIn search for AI startup founders, CTOs, and technical co-founders', whyItWorks: 'Founders actively building AI tools need websites that communicate product value clearly', searchHint: 'site:linkedin.com "AI startup" founder OR co-founder OR CTO', difficulty: 'easy', bestFor: 'Founders who post about their AI product and need a better web presence' },
      { sourceName: 'AI Tool Directories', whereToFind: 'Directories like There\'s An AI For That, Futurepedia, AI Tools Directory', whyItWorks: 'Listed tools often have weak or inconsistent landing pages that need improvement', searchHint: 'site:theresanaiforthat.com OR site:futurepedia.io AI tools', difficulty: 'medium', bestFor: 'Tools already listed in directories but with poor website quality' },
      { sourceName: 'YC / Accelerator Directories', whereToFind: 'YC startup directory, Techstars, and other accelerator portfolio pages', whyItWorks: 'Accelerator-backed startups have funding and need professional websites for investor confidence', searchHint: 'site:ycombinator.com companies AI category', difficulty: 'medium', bestFor: 'Well-funded startups with budget for professional web development' },
      { sourceName: 'Indie Hacker Communities', whereToFind: 'Indie Hackers, Hacker News, and Reddit r/SaaS for bootstrapped AI founders', whyItWorks: 'Indie hackers build lean and often have basic websites that need professional polish', searchHint: 'site:indiehackers.com "AI" OR "machine learning" founder', difficulty: 'easy', bestFor: 'Bootstrapped founders with revenue who need to upgrade their website' },
    ],
  },
  local_business: {
    wordpress: [
      { sourceName: 'Google Maps Local Search', whereToFind: 'Google Maps search for service businesses in target area with poor or no website', whyItWorks: 'Local businesses with weak online presence are prime candidates for website improvements', searchHint: 'Google Maps: "service" [city] browse business profiles for websites', difficulty: 'easy', bestFor: 'Service businesses that appear in Maps but have no or poor websites' },
      { sourceName: 'Instagram Local Businesses', whereToFind: 'Instagram search by location and local business hashtags', whyItWorks: 'Businesses active on Instagram often need a better website to match their social presence', searchHint: 'Instagram search: #[city]business #[city]service #locallove', difficulty: 'easy', bestFor: 'Visually active local businesses with weak or no website' },
      { sourceName: 'Local Service Websites', whereToFind: 'Google search for "[service] [city]" and evaluate website quality', whyItWorks: 'Direct competitors in the area show what local websites look like and which need improvement', searchHint: 'Google: [service] [city] look for sites with poor mobile or slow loading', difficulty: 'medium', bestFor: 'Businesses ranking on page 1 but with outdated websites' },
      { sourceName: 'Local Business Associations', whereToFind: 'Chamber of Commerce directories, local business network websites', whyItWorks: 'Association members are actively trying to grow their business and invest in marketing', searchHint: 'site:[city]chamber.com OR site:[city]businessassociation.com members', difficulty: 'medium', bestFor: 'Business owners who invest in their local presence and network' },
    ],
  },
  marketing_agencies: {
    wordpress: [
      { sourceName: 'Agency Websites', whereToFind: 'Google search for "[city] marketing agency" and browse agency portfolio sites', whyItWorks: 'Agencies with weak websites understand the value of a strong web presence and need expert help', searchHint: 'Google: [city] marketing agency review their own website quality', difficulty: 'easy', bestFor: 'Agencies whose own website does not reflect the quality they promise clients' },
      { sourceName: 'LinkedIn Agency Founders', whereToFind: 'LinkedIn search for agency owners, founders, and managing directors in marketing', whyItWorks: 'Agency founders who post about growth are actively looking for ways to improve their service offering', searchHint: 'site:linkedin.com "marketing agency" founder OR owner OR CEO', difficulty: 'easy', bestFor: 'Agency founders who need plugin integration, tracking setup, or campaign page support' },
      { sourceName: 'Clutch / Agency Directories', whereToFind: 'Clutch.co, Agency Spotter, and DesignRush for verified agency listings', whyItWorks: 'Agencies listed on directories are actively seeking clients and often need better digital infrastructure', searchHint: 'site:clutch.co marketing agencies [city]', difficulty: 'medium', bestFor: 'Growth-focused agencies with client-facing digital needs' },
      { sourceName: 'Agency Client Campaign Pages', whereToFind: 'Search for agencies running client campaign landing pages with WordPress', whyItWorks: 'Agencies managing campaigns need reliable plugin, form, and tracking setups for client deliverables', searchHint: 'Google: "landing page" "marketing agency" campaign results', difficulty: 'hard', bestFor: 'Agencies running multiple client campaigns needing technical WordPress support' },
    ],
  },
  saas: {
    design: [
      { sourceName: 'SaaS Directories', whereToFind: 'SaaS directories like G2, Capterra, GetApp for product listings with screenshots', whyItWorks: 'Products listed with poor UI screenshots need design improvements to compete', searchHint: 'site:g2.com OR site:capterra.com categories browse for UI quality', difficulty: 'easy', bestFor: 'B2B SaaS products with outdated or confusing interfaces' },
      { sourceName: 'Product Hunt SaaS Launches', whereToFind: 'Product Hunt recent launches in SaaS, productivity, and business categories', whyItWorks: 'Newly launched SaaS products need polished interfaces for investor and user confidence', searchHint: 'site:producthunt.com "SaaS" OR "software" recent launches', difficulty: 'easy', bestFor: 'Early-stage SaaS products with recently launched interfaces' },
      { sourceName: 'LinkedIn Product Teams', whereToFind: 'LinkedIn search for product managers, heads of product, and design leads at SaaS companies', whyItWorks: 'Product leaders are actively looking for design talent to improve their product experience', searchHint: 'site:linkedin.com "Head of Product" OR "Product Manager" SaaS', difficulty: 'medium', bestFor: 'Product teams with budget for UX improvement projects' },
      { sourceName: 'Startup Communities', whereToFind: 'Indie Hackers, Hacker News Show HN, Reddit r/SaaS and r/startups', whyItWorks: 'Founders in these communities are building products and need design feedback and help', searchHint: 'site:reddit.com r/SaaS OR r/startups "looking for designer" OR "need help with UI"', difficulty: 'medium', bestFor: 'Founders actively seeking design partnerships or freelancers' },
    ],
  },
  product_startups: {
    design: [
      { sourceName: 'Product Hunt Launch Pages', whereToFind: 'Product Hunt upcoming and launched products with weak landing pages', whyItWorks: 'Startups launching on Product Hunt need strong visual design for conversion', searchHint: 'site:producthunt.com upcoming products review landing page quality', difficulty: 'easy', bestFor: 'Pre-launch startups that need design polish before public launch' },
      { sourceName: 'Beta Launch Communities', whereToFind: 'BetaList, BetaPage, and Launching Next for pre-launch and beta-stage products', whyItWorks: 'Beta-stage products are actively building and need design help before public release', searchHint: 'site:betali.st OR site:betapage.co recent product listings', difficulty: 'medium', bestFor: 'Beta-stage products needing UI/UX design before public launch' },
      { sourceName: 'Founder LinkedIn Profiles', whereToFind: 'LinkedIn search for startup founders, CEOs, and product leads at early-stage companies', whyItWorks: 'Founders who post about their product journey are open to connecting with design talent', searchHint: 'site:linkedin.com "startup founder" OR "building" product launch', difficulty: 'easy', bestFor: 'Founders actively building and posting about their product' },
      { sourceName: 'Incubator / Accelerator Lists', whereToFind: 'YC, Techstars, 500 Startups, and local accelerator portfolio pages', whyItWorks: 'Accelerator-backed startups have funding and need professional design for investor confidence', searchHint: 'site:ycombinator.com companies product category', difficulty: 'medium', bestFor: 'Funded startups that need design support to meet investor expectations' },
    ],
  },
  design_agencies: {
    design: [
      { sourceName: 'Agency Websites + Portfolios', whereToFind: 'Search for design agencies by city and review their portfolio and service pages', whyItWorks: 'Agencies with inconsistent portfolios need design system support to scale their output', searchHint: 'Google: "design agency" [city] review portfolio consistency', difficulty: 'easy', bestFor: 'Agencies that publish many client projects without consistent design standards' },
      { sourceName: 'Dribbble / Behance Agencies', whereToFind: 'Dribbble agency accounts and Behance portfolio pages for design studios', whyItWorks: 'Agencies active on design platforms understand the value of strong visual work', searchHint: 'site:dribbble.com "agency" OR "studio" teams', difficulty: 'easy', bestFor: 'Agencies that already invest in design quality and visual branding' },
      { sourceName: 'LinkedIn Design Leads', whereToFind: 'LinkedIn search for design directors, heads of design, and creative leads at agencies', whyItWorks: 'Design leaders make hiring decisions for design system and UX support', searchHint: 'site:linkedin.com "design director" OR "head of design" agency', difficulty: 'medium', bestFor: 'Agencies with dedicated design leadership looking for specialist support' },
      { sourceName: 'Design System Communities', whereToFind: 'Design Systems Slack, Figma Community, and design system conference attendee lists', whyItWorks: 'Professionals in these communities understand the value of design systems and need implementation help', searchHint: 'site:figma.com community design systems', difficulty: 'medium', bestFor: 'Agencies that want to implement or improve their design system' },
    ],
  },
};

// Create the map with default entries as fallback
function defaultClientSources(cat: ServiceCategory, niche: string): ClientSource[] {
  return [
    {
      sourceName: `${niche || 'Target'} online communities`,
      whereToFind: `Search for ${niche || 'target'} communities on LinkedIn, Reddit, and industry forums`,
      whyItWorks: 'Communities gather potential clients in one place for relationship building',
      searchHint: `site:reddit.com ${niche} OR site:linkedin.com ${niche}`,
      difficulty: 'medium' as const,
      bestFor: 'Building awareness and trust before outreach',
    },
  ];
}

const SERVICE_CLIENT_SOURCES: Record<string, Record<string, ClientSource[]>> = {
  plugin_integration_dev: {
    ai_startups: [
      { sourceName: 'AI Startups Needing Platform Integration', whereToFind: 'Product Hunt AI launches and review their integration or plugin pages', whyItWorks: 'AI tools without existing WordPress plugins need custom integration to reach WordPress users', searchHint: 'site:producthunt.com "AI" "integrations" OR "plugins"', difficulty: 'medium', bestFor: 'AI tools that list integrations as a priority but have no WordPress plugin' },
      { sourceName: 'WordPress Plugin Directory Competitors', whereToFind: 'WordPress plugin directory for AI-related plugins with poor reviews or limited features', whyItWorks: 'Existing plugins with limitations create opportunities for custom alternatives', searchHint: 'wordpress.org/plugins/search/AI browse for underperforming plugins', difficulty: 'medium', bestFor: 'Users of existing AI plugins who need more advanced custom integration' },
    ],
    marketing_agencies: [
      { sourceName: 'Agency Campaign Managers', whereToFind: 'LinkedIn for marketing agency owners who post about campaign management challenges', whyItWorks: 'Agencies managing client campaigns need reliable form, tracking, and plugin setups', searchHint: 'site:linkedin.com "campaign manager" OR "agency owner" marketing', difficulty: 'easy', bestFor: 'Agencies that sell campaign services but lack technical implementation team' },
      { sourceName: 'Agency Partnership Directories', whereToFind: 'Agency directories like Clutch, Agency Spotter for agencies that mention WordPress services', whyItWorks: 'Agencies already offering WordPress services may need plugin and integration support', searchHint: 'site:clutch.co "WordPress" marketing agency services', difficulty: 'medium', bestFor: 'Agencies that outsource technical development or need white-label support' },
    ],
  },
  custom_theme_development: {
    ai_startups: [
      { sourceName: 'Recently Launched AI Startups', whereToFind: 'Product Hunt AI launches with basic or template-based landing pages', whyItWorks: 'AI startups launching on Product Hunt often need custom websites to match product quality', searchHint: 'site:producthunt.com "AI" recent launches review website quality', difficulty: 'easy', bestFor: 'Startups that just launched and need a professional website to match their product' },
      { sourceName: 'YC / Accelerator AI Startups', whereToFind: 'YC directory, Techstars, and other accelerator portfolio pages for AI companies', whyItWorks: 'Accelerator-backed startups have funding and understand the need for professional web presence', searchHint: 'site:ycombinator.com companies AI category', difficulty: 'medium', bestFor: 'Funded AI startups that need investor-ready websites' },
    ],
    local_business: [
      { sourceName: 'Google Maps Local Service Providers', whereToFind: 'Google Maps search for service businesses in target area with poor or no website', whyItWorks: 'Local businesses with weak websites are prime candidates for custom theme builds', searchHint: 'Google Maps: [service] [city] check website links', difficulty: 'easy', bestFor: 'Service businesses appearing in Maps with outdated or no website' },
    ],
  },
  product_ui_design: {
    saas: [
      { sourceName: 'B2B SaaS with UX Reviews', whereToFind: 'G2, Capterra reviews mentioning confusing UI or difficult onboarding', whyItWorks: 'Public complaints about UX create a clear entry point for redesign proposals', searchHint: 'site:g2.com "confusing" OR "hard to use" SaaS product reviews', difficulty: 'medium', bestFor: 'SaaS products with public user feedback highlighting UX friction' },
      { sourceName: 'Recently Funded SaaS Products', whereToFind: 'CrunchBase, TechCrunch for SaaS companies that recently raised funding', whyItWorks: 'Newly funded companies have budget and are actively improving their product', searchHint: 'site:techcrunch.com "raises" SaaS seed OR Series A design', difficulty: 'medium', bestFor: 'Funded SaaS companies investing in product improvements' },
    ],
  },
};

export function generateClientSourceMap(cat: ServiceCategory, niche = '', serviceId?: string): ClientSourceMap {
  const nicheKey = getNicheKey(niche);
  const overrides = NICHE_CLIENT_SOURCES[nicheKey]?.[cat];
  const serviceOverride = serviceId ? SERVICE_CLIENT_SOURCES[serviceId]?.[nicheKey] : undefined;
  const sources = serviceOverride && serviceOverride.length > 0 ? serviceOverride
    : overrides && overrides.length > 0 ? overrides
    : defaultClientSources(cat, niche);
  return { sources };
}

const NICHE_CLIENT_CRITERIA: Record<string, Partial<Record<ServiceCategory, {
  label: string;
  whyItMatters: string;
  howToCheck: string;
  priority: 'high' | 'medium' | 'low';
}[]>>> = {
  gaming: {
    video: [
      { label: 'Posts long-form content regularly', whyItMatters: 'Long-form content provides the raw footage needed for clip extraction and editing', howToCheck: 'Browse their channel for videos longer than 10 minutes posted in the last 2 weeks', priority: 'high' },
      { label: 'Has visible audience activity', whyItMatters: 'Active engagement means clips have a built-in audience and higher chance of performing well', howToCheck: 'Check comment sections and view counts on recent uploads for consistent activity', priority: 'high' },
      { label: 'Inconsistent or absent short-form presence', whyItMatters: 'Creators not using Shorts/Reels are missing a growth opportunity that editing can solve', howToCheck: 'Search their channel or handle for short-form content in the last month', priority: 'high' },
      { label: 'Content has extractable moments', whyItMatters: 'Gameplay with highlights, reactions, or storytelling moments make better clips', howToCheck: 'Watch 2-3 recent videos for natural clip moments like wins, fails, or reactions', priority: 'medium' },
      { label: 'Has a business email or contact method', whyItMatters: 'Reachable creators are easier to pitch and convert into clients', howToCheck: 'Check their channel About page or social bio for email or booking link', priority: 'medium' },
      { label: 'Likely budgets for content improvement', whyItMatters: 'Creators investing in their channel are more likely to pay for editing services', howToCheck: 'Look for evidence of paid tools, equipment, or previous outsourcing', priority: 'low' },
    ],
  },
  educational: {
    video: [
      { label: 'Produces regular tutorial or course content', whyItMatters: 'Consistent educational content provides reliable footage for ongoing clip production', howToCheck: 'Check upload frequency for tutorial or lesson content in the last month', priority: 'high' },
      { label: 'Has a course or product to promote', whyItMatters: 'Course creators benefit directly from clip promotion that drives enrollment', howToCheck: 'Look for course links, landing pages, or product mentions in their content', priority: 'high' },
      { label: 'No short-form clip repurposing strategy', whyItMatters: 'Creators not using clips are missing a key promotion channel for their courses', howToCheck: 'Search their social channels for short-form educational clips', priority: 'high' },
      { label: 'Teaching moments are clear and structured', whyItMatters: 'Well-structured lessons make it easier to extract standalone educational clips', howToCheck: 'Watch a recent lesson for clear teaching segments that work as standalone content', priority: 'medium' },
      { label: 'Visible audience on at least one platform', whyItMatters: 'An existing audience means clips have a distribution channel from day one', howToCheck: 'Check subscriber/follower counts and recent engagement metrics', priority: 'medium' },
    ],
  },
  podcast: {
    video: [
      { label: 'Produces regular podcast episodes', whyItMatters: 'Consistent episodes provide ongoing material for clip creation', howToCheck: 'Check episode publish frequency over the last month', priority: 'high' },
      { label: 'No short-form clip strategy', whyItMatters: 'Podcasts without clips are missing the primary discovery channel for new listeners', howToCheck: 'Search their social channels for short-form podcast clips', priority: 'high' },
      { label: 'Episodes contain quotable moments', whyItMatters: 'Strong quotes and insights make the best short-form podcast clips', howToCheck: 'Listen to a recent episode for quotable statements, debates, or storytelling moments', priority: 'medium' },
      { label: 'Has a guest booking process', whyItMatters: 'Channels with regular guests have a predictable content pipeline', howToCheck: 'Check for guest schedules, interview formats, or booking pages', priority: 'medium' },
    ],
  },
  ai_startups: {
    wordpress: [
      { label: 'Has a recently launched product', whyItMatters: 'Newly launched products need polished websites to build trust and convert visitors', howToCheck: 'Check Product Hunt launch date or recent announcement posts', priority: 'high' },
      { label: 'Website has weak messaging or CTA', whyItMatters: 'Unclear value proposition and weak CTAs reduce conversion rates for startup websites', howToCheck: 'Review their homepage for clear product explanation and visible call-to-action', priority: 'high' },
      { label: 'Poor mobile experience', whyItMatters: 'Many investors and early users browse on mobile; a poor experience hurts credibility', howToCheck: 'Open their site on mobile view and test navigation, readability, and load speed', priority: 'high' },
      { label: 'No clear contact or booking flow', whyItMatters: 'Startups need demo requests or contact forms to capture leads from their website', howToCheck: 'Look for contact page, demo booking link, or newsletter signup', priority: 'medium' },
      { label: 'Has funding or revenue', whyItMatters: 'Startups with budget can invest in professional website development', howToCheck: 'Check Crunchbase, LinkedIn, or their About page for funding announcements', priority: 'medium' },
    ],
  },
  local_business: {
    wordpress: [
      { label: 'Website looks outdated or unprofessional', whyItMatters: 'First impressions from outdated websites lose potential customers', howToCheck: 'Browse their site for old design patterns, broken links, or poor mobile rendering', priority: 'high' },
      { label: 'Poor mobile experience', whyItMatters: 'Most local searches happen on mobile; a bad mobile experience drives visitors away', howToCheck: 'Open their site on a phone and test navigation, contact visibility, and load speed', priority: 'high' },
      { label: 'No visible booking or contact path', whyItMatters: 'Businesses without clear contact paths lose leads that land on their website', howToCheck: 'Look for visible phone number, contact form, booking button, or direction link', priority: 'high' },
      { label: 'Has active social media but weak website', whyItMatters: 'Social media activity shows investment in marketing, but a weak website undermines it', howToCheck: 'Compare their Instagram activity against their website quality', priority: 'medium' },
      { label: 'Has budget for marketing', whyItMatters: 'Businesses investing in marketing are more likely to invest in website improvements', howToCheck: 'Look for signs of paid ads, professional photography, or branded materials', priority: 'medium' },
    ],
  },
  marketing_agencies: {
    wordpress: [
      { label: 'Runs client campaigns on WordPress', whyItMatters: 'Agencies using WordPress for client sites have ongoing plugin, form, and tracking needs', howToCheck: 'Check their portfolio or case studies for WordPress client sites', priority: 'high' },
      { label: 'Needs tracking or form integration support', whyItMatters: 'Many agencies understand marketing but lack technical setup skills for forms and tracking', howToCheck: 'Review their service pages for mention of technical integration support', priority: 'high' },
      { label: 'Sells campaign or landing page packages', whyItMatters: 'Agencies offering campaign packages need reliable technical infrastructure for each client', howToCheck: 'Browse their services page for landing page, campaign, or CRO packages', priority: 'high' },
      { label: 'No in-house technical team', whyItMatters: 'Agencies without technical staff are the best fit for white-label WordPress support', howToCheck: 'Check their team page or LinkedIn for developer or technical roles', priority: 'medium' },
      { label: 'Growing and taking on more clients', whyItMatters: 'Growing agencies need scalable technical support that matches their client acquisition', howToCheck: 'Look for hiring posts, new case studies, or client announcement frequency', priority: 'medium' },
    ],
  },
  saas: {
    design: [
      { label: 'Product interface looks confusing', whyItMatters: 'Confusing interfaces cause user frustration and churn, directly impacting revenue', howToCheck: 'Sign up for a trial or watch product demo videos for usability issues', priority: 'high' },
      { label: 'Onboarding has visible friction', whyItMatters: 'Friction in onboarding means lost users before they reach the core value', howToCheck: 'Go through their signup flow and note confusing steps or unclear instructions', priority: 'high' },
      { label: 'Dashboard has poor information hierarchy', whyItMatters: 'Unclear dashboards make it hard for users to find what they need', howToCheck: 'Review screenshots or demos for cluttered layouts and unclear navigation', priority: 'high' },
      { label: 'Design inconsistency across the product', whyItMatters: 'Inconsistent design erodes user trust and makes the product feel unpolished', howToCheck: 'Compare different screens for different button styles, spacing, and typography', priority: 'medium' },
      { label: 'Has active userbase and revenue', whyItMatters: 'Products with paying users have budget for UX improvements that reduce churn', howToCheck: 'Check their pricing page, customer count, or funding announcements', priority: 'medium' },
    ],
  },
  product_startups: {
    design: [
      { label: 'Product has unclear user flow', whyItMatters: 'Unclear flows prevent users from reaching the product value, causing drop-off', howToCheck: 'Walk through their product trial or demo and note confusing paths', priority: 'high' },
      { label: 'Landing page lacks clarity', whyItMatters: 'Unclear landing pages fail to convert visitors into trial users or customers', howToCheck: 'Review their homepage for clear value proposition and visible CTA', priority: 'high' },
      { label: 'Pre-launch or recently launched', whyItMatters: 'Early-stage startups are open to design feedback and have budget for improvements', howToCheck: 'Check Product Hunt launch date or beta access availability', priority: 'high' },
      { label: 'Has investor or accelerator backing', whyItMatters: 'Funded startups have budget for professional design work', howToCheck: 'Look for accelerator logos, investor mentions, or funding news', priority: 'medium' },
      { label: 'Visible design quality gap', whyItMatters: 'Products with obvious design gaps are actively looking for design help', howToCheck: 'Compare their product UI against competitors in the same space', priority: 'medium' },
    ],
  },
  design_agencies: {
    design: [
      { label: 'Publishes many client projects without consistent quality', whyItMatters: 'Inconsistent portfolio quality suggests they need design system support', howToCheck: 'Browse their portfolio for varying visual quality across projects', priority: 'high' },
      { label: 'No visible design system', whyItMatters: 'Agencies without design systems struggle to maintain quality at scale', howToCheck: 'Check if they mention design systems, components, or design tokens on their site', priority: 'high' },
      { label: 'Offers UX or conversion audits', whyItMatters: 'Agencies offering audits likely understand the value of design improvement', howToCheck: 'Review their services page for UX audit, CRO, or design review services', priority: 'medium' },
      { label: 'Team is small and scaling', whyItMatters: 'Small teams scaling up need design system support to maintain consistency', howToCheck: 'Check their team page and look for recent hiring or team expansion', priority: 'medium' },
      { label: 'Invests in visual branding', whyItMatters: 'Agencies that invest in their own brand understand the value of professional design', howToCheck: 'Review their own website and brand materials for quality', priority: 'medium' },
    ],
  },
};

function defaultClientCriteria(cat: ServiceCategory): Criterion[] {
  const defaults: Record<ServiceCategory, Criterion[]> = {
    video: [
      { label: 'Produces regular long-form content', whyItMatters: 'Long-form footage is needed for clip extraction', howToCheck: 'Check upload frequency in the last month', priority: 'high' },
      { label: 'Has visible audience engagement', whyItMatters: 'Engaged audiences respond better to short-form content', howToCheck: 'Check comment activity and view counts', priority: 'high' },
      { label: 'Reachable contact available', whyItMatters: 'Need a way to pitch your service', howToCheck: 'Look for email, social link, or contact form', priority: 'medium' },
    ],
    wordpress: [
      { label: 'Website has visible issues', whyItMatters: 'Problems with current site create opportunity for improvement', howToCheck: 'Review site for mobile, speed, or clarity issues', priority: 'high' },
      { label: 'Has budget for website work', whyItMatters: 'Need ability to pay for professional development', howToCheck: 'Look for signs of marketing investment', priority: 'high' },
      { label: 'Decision maker is reachable', whyItMatters: 'Need to contact the person who can approve the project', howToCheck: 'Find owner or manager contact information', priority: 'medium' },
    ],
    design: [
      { label: 'Product has noticeable UX issues', whyItMatters: 'Poor UX creates demand for redesign services', howToCheck: 'Test their product for usability problems', priority: 'high' },
      { label: 'Has recent activity or updates', whyItMatters: 'Active products need ongoing design support', howToCheck: 'Check recent changelog, blog, or social activity', priority: 'high' },
      { label: 'Has design decision maker reachable', whyItMatters: 'Need access to product or design lead', howToCheck: 'Find head of product or design on LinkedIn', priority: 'medium' },
    ],
  };
  return defaults[cat];
}

const SERVICE_CLIENT_CRITERIA: Record<string, Record<string, Criterion[]>> = {
  plugin_integration_dev: {
    ai_startups: [
      { label: 'Has an API for integration', whyItMatters: 'An accessible API is required to build the plugin connector', howToCheck: 'Check their documentation for API reference or developer section', priority: 'high' },
      { label: 'Targets WordPress users', whyItMatters: 'WordPress plugin distribution only makes sense if their users are on WordPress', howToCheck: 'Review their user personas, case studies, or support forums for WordPress mentions', priority: 'high' },
      { label: 'No existing WordPress plugin', whyItMatters: 'No existing plugin means clear opportunity for custom development', howToCheck: 'Search WordPress plugin directory and review their integrations page', priority: 'high' },
      { label: 'Has development budget', whyItMatters: 'Custom plugin development requires investment in engineering resources', howToCheck: 'Check funding announcements, team size, or pricing page for enterprise tier', priority: 'medium' },
    ],
    marketing_agencies: [
      { label: 'Runs client campaigns on WordPress', whyItMatters: 'WordPress-based campaigns need plugin, form, and tracking support', howToCheck: 'Review their portfolio for WordPress client sites and landing pages', priority: 'high' },
      { label: 'Uses multiple disconnected tools', whyItMatters: 'Disconnected tools create the need for integration and automation', howToCheck: 'Ask about their current tool stack and manual workflow pain points', priority: 'high' },
      { label: 'No in-house developer', whyItMatters: 'Agencies without developers need outsourced technical support', howToCheck: 'Check their team page for developer roles or technical staff', priority: 'medium' },
    ],
  },
};

export function generateIdealClientCriteria(cat: ServiceCategory, niche = '', serviceId?: string): IdealClientCriteria {
  const nicheKey = getNicheKey(niche);
  const overrides = NICHE_CLIENT_CRITERIA[nicheKey]?.[cat];
  const serviceOverride = serviceId ? SERVICE_CLIENT_CRITERIA[serviceId]?.[nicheKey] : undefined;
  return {
    criteria: serviceOverride && serviceOverride.length > 0 ? serviceOverride
      : overrides && overrides.length > 0 ? overrides
      : defaultClientCriteria(cat),
  };
}

const NICHE_PROSPECT_TYPES: Record<string, Partial<Record<ServiceCategory, {
  name: string;
  description: string;
  whyGoodFit: string;
  whereToFind: string;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'high' | 'medium' | 'low';
}[]>>> = {
  gaming: {
    video: [
      { name: 'Small Growing Creators', description: 'Gaming YouTubers and streamers with 1K-10K subscribers who post consistently but have no short-form strategy', whyGoodFit: 'They need short-form growth but lack time or editing skills to create clips from their long content', whereToFind: 'YouTube search for gaming channels with recent uploads and moderate view counts', difficulty: 'easy', priority: 'high' },
      { name: 'Mid-Sized YouTubers', description: 'Gaming creators with 10K-100K subs who have long-form content but inconsistent or low-quality Shorts', whyGoodFit: 'They have existing audience and content volume but need professional editing to scale short-form output', whereToFind: 'YouTube gaming category filtered by subscriber count and upload frequency', difficulty: 'medium', priority: 'high' },
      { name: 'Twitch Streamers with VODs', description: 'Streamers who broadcast regularly and have VODs enabled for clip extraction', whyGoodFit: 'Each stream produces hours of footage that can become multiple clips with minimal source material effort', whereToFind: 'Twitch directory by game category, filter for VODs enabled and consistent schedule', difficulty: 'medium', priority: 'high' },
      { name: 'Gaming Podcast Creators', description: 'Creators running gaming-focused talk shows or podcast channels that need clip repurposing', whyGoodFit: 'Podcasts produce quotable moments and discussions that make excellent short-form content', whereToFind: 'YouTube search for "gaming podcast" channels with regular episode uploads', difficulty: 'medium', priority: 'medium' },
    ],
  },
  educational: {
    video: [
      { name: 'Tutorial YouTubers', description: 'Educational creators posting step-by-step tutorials with 5K-50K subscribers and no short-form presence', whyGoodFit: 'Tutorial content has natural standalone moments that make effective educational clips', whereToFind: 'YouTube search for tutorial channels in specific skill areas', difficulty: 'easy', priority: 'high' },
      { name: 'Course Creators', description: 'Educators with paid courses on Teachable, Udemy, or their own platform who need promotional clips', whyGoodFit: 'Clips from their course content drive enrollment and course awareness', whereToFind: 'Course platform directories and creator social media profiles', difficulty: 'medium', priority: 'high' },
      { name: 'Coaches with Long-Form Content', description: 'Online coaches who create long-form educational content but have no short-form clip strategy', whyGoodFit: 'Coaching content has teaching moments that work as standalone clips for audience building', whereToFind: 'LinkedIn and YouTube for coaching professionals posting educational content', difficulty: 'easy', priority: 'high' },
    ],
  },
  podcast: {
    video: [
      { name: 'YouTube Podcast Hosts', description: 'Podcasters with 5K-50K subscribers who post full episodes on YouTube without clip repurposing', whyGoodFit: 'Full episodes contain multiple quotable moments that can become promotional clips', whereToFind: 'YouTube podcast category or search for interview-style channels', difficulty: 'easy', priority: 'high' },
      { name: 'Audio-First Podcasters', description: 'Podcasters who publish on Spotify/Apple but want to expand to video clips for social media', whyGoodFit: 'They understand the need for visual content but lack editing skills to create clips', whereToFind: 'Podcast directories like Spotify, Apple, and Podchaser', difficulty: 'medium', priority: 'high' },
      { name: 'Interview Show Creators', description: 'Channels running interview formats with guest booking schedules', whyGoodFit: 'Regular guest episodes provide consistent content with discussion moments perfect for clips', whereToFind: 'YouTube channels with interview series and visible guest schedules', difficulty: 'medium', priority: 'medium' },
    ],
  },
  ai_startups: {
    wordpress: [
      { name: 'Pre-Seed AI Startups', description: 'AI tools in pre-seed or seed stage with basic landing pages and unclear product messaging', whyGoodFit: 'They need professional websites to communicate product value and build investor confidence', whereToFind: 'Product Hunt recent launches, YC directory, AI tool directories', difficulty: 'easy', priority: 'high' },
      { name: 'Newly Launched AI Tools', description: 'AI products launched in the last 3 months with weak or template-based websites', whyGoodFit: 'Recent launches are actively iterating and have budget for website improvements', whereToFind: 'Product Hunt upcoming and recent launches in AI category', difficulty: 'easy', priority: 'high' },
      { name: 'Founders with Weak Landing Pages', description: 'AI startup founders whose websites have poor messaging, no clear CTA, or weak mobile experience', whyGoodFit: 'Clear website issues create immediate opportunity for improvement proposals', whereToFind: 'LinkedIn AI startup founders, indie hacker communities', difficulty: 'easy', priority: 'high' },
      { name: 'YC / Accelerator Startups', description: 'AI startups backed by accelerators with funding and need for professional web presence', whyGoodFit: 'Funded startups have budget and understand the value of professional development', whereToFind: 'YC directory, Techstars, and other accelerator portfolio pages', difficulty: 'medium', priority: 'medium' },
    ],
  },
  local_business: {
    wordpress: [
      { name: 'Service Businesses with Outdated Sites', description: 'Local businesses like salons, clinics, and gyms with websites that look 5+ years old', whyGoodFit: 'Outdated websites are obvious pain points that business owners already want to fix', whereToFind: 'Google Maps search, local search for specific service categories', difficulty: 'easy', priority: 'high' },
      { name: 'Mobile-Poor Local Businesses', description: 'Businesses whose websites are not mobile-friendly in an era where most local searches happen on phones', whyGoodFit: 'Mobile issues are easy to diagnose and directly impact their lead generation', whereToFind: 'Browse local search results on mobile and test each site', difficulty: 'easy', priority: 'high' },
      { name: 'Social-Media-Active but Web-Weak', description: 'Businesses active on Instagram or Facebook but with a poor or no website', whyGoodFit: 'Their social activity shows marketing investment, but weak website undermines their online presence', whereToFind: 'Instagram local search, Facebook business pages in target area', difficulty: 'medium', priority: 'medium' },
      { name: 'Home Service Businesses', description: 'Plumbers, electricians, cleaners, landscapers with basic or no websites', whyGoodFit: 'These businesses rely on local search and a good website directly drives calls and bookings', whereToFind: 'Google Maps search for home service categories in target area', difficulty: 'easy', priority: 'high' },
    ],
  },
  marketing_agencies: {
    wordpress: [
      { name: 'Small Agencies without Dev Support', description: 'Marketing agencies with 2-10 employees doing client strategy but no in-house technical team', whyGoodFit: 'They need white-label WordPress support for form setup, tracking, and campaign page builds', whereToFind: 'LinkedIn agency founders, agency directories like Clutch', difficulty: 'easy', priority: 'high' },
      { name: 'Agencies Running Campaign Pages', description: 'Agencies that build client campaign landing pages and need reliable plugin and form support', whyGoodFit: 'Campaign page work has ongoing and repeatable needs for technical WordPress support', whereToFind: 'Agency portfolio sites showing campaign work and case studies', difficulty: 'medium', priority: 'high' },
      { name: 'Agencies Needing Tracking/Form Setup', description: 'Agencies that sell marketing services but lack the technical skills for form integrations and tracking tags', whyGoodFit: 'They can sell the service but need a technical partner to execute the setup', whereToFind: 'Agency service pages listing marketing services without technical implementation details', difficulty: 'medium', priority: 'high' },
      { name: 'Growth-Stage Agencies', description: 'Agencies taking on more clients and struggling to scale their technical delivery', whyGoodFit: 'Growing agencies need scalable technical support and have budget to invest', whereToFind: 'LinkedIn agencies with recent hiring or client announcement activity', difficulty: 'medium', priority: 'medium' },
    ],
  },
  saas: {
    design: [
      { name: 'Early-Stage SaaS Products', description: 'B2B SaaS products with 100-1000 users and interfaces that show clear UX friction', whyGoodFit: 'They have users (feedback) and revenue (budget) but need design improvement to reduce churn', whereToFind: 'Product Hunt SaaS launches, G2 listings, SaaS directories', difficulty: 'easy', priority: 'high' },
      { name: 'Dashboards with Complex Flows', description: 'SaaS products with data-heavy dashboards that have poor information hierarchy', whyGoodFit: 'Complex dashboards are prime candidates for UX redesign that measurably improves user experience', whereToFind: 'Product demo videos and screenshots on their website or Product Hunt', difficulty: 'medium', priority: 'high' },
      { name: 'Trial-Based B2B SaaS', description: 'SaaS products with free trials and visible onboarding friction', whyGoodFit: 'Improving onboarding UX directly increases trial-to-paid conversion rates', whereToFind: 'SaaS products with visible signup flows that have friction points', difficulty: 'medium', priority: 'high' },
    ],
  },
  product_startups: {
    design: [
      { name: 'Pre-Launch Products', description: 'Startups preparing for Product Hunt launch or public beta with unclear product interfaces', whyGoodFit: 'Pre-launch is the perfect time to invest in design before public perception is set', whereToFind: 'Product Hunt upcoming, BetaList, launch communities', difficulty: 'easy', priority: 'high' },
      { name: 'Recently Launched Products', description: 'Startups that launched in the last 6 months with feedback-driven design iteration needs', whyGoodFit: 'Post-launch feedback creates clear design priorities and budget for improvements', whereToFind: 'Product Hunt recent launches, startup directories', difficulty: 'easy', priority: 'high' },
      { name: 'Founder-Led Product Builds', description: 'Technical founders who built the product themselves and need professional UI polish', whyGoodFit: 'Founders who built the MVP often know they need design help but have not hired for it yet', whereToFind: 'Indie Hackers, LinkedIn technical founders, show HN posts', difficulty: 'medium', priority: 'high' },
    ],
  },
  design_agencies: {
    design: [
      { name: 'Agencies without Design Systems', description: 'Design studios that produce client work without a consistent design system or component library', whyGoodFit: 'They understand the value of design systems but need dedicated support to build and maintain them', whereToFind: 'Agency portfolio sites with inconsistent visual quality across projects', difficulty: 'easy', priority: 'high' },
      { name: 'Small Design Teams Scaling', description: 'Teams of 3-10 designers who are taking on more clients and need scalable design infrastructure', whyGoodFit: 'Scaling teams feel the pain of inconsistency and are ready to invest in systems', whereToFind: 'Agency team pages, LinkedIn design leads at small agencies', difficulty: 'medium', priority: 'high' },
      { name: 'Agencies Offering UX Audits', description: 'Agencies that sell UX or conversion audit services and need to deliver measurable improvements', whyGoodFit: 'They understand the value of UX and have clients who are receptive to design investment', whereToFind: 'Agency service pages listing UX audit, CRO, or design review services', difficulty: 'medium', priority: 'medium' },
    ],
  },
};

function defaultProspectTypes(cat: ServiceCategory): ProspectType[] {
  return [
    { name: 'General prospects', description: 'Potential clients who need your service', whyGoodFit: 'Broader net catches more opportunities', whereToFind: 'Industry directories and communities', difficulty: 'medium', priority: 'medium' },
  ];
}

const SERVICE_PROSPECT_TYPES: Record<string, Record<string, ProspectType[]>> = {
  plugin_integration_dev: {
    ai_startups: [
      { name: 'AI Tools Requiring Integration', description: 'AI products that need a WordPress plugin to reach their users on existing platforms', whyGoodFit: 'Custom plugin development solves their distribution and adoption challenges', whereToFind: 'Product Hunt AI launches, AI tool directories', difficulty: 'medium', priority: 'high' },
      { name: 'WordPress Ecosystem AI Products', description: 'AI products targeting the WordPress ecosystem that need native plugin integration', whyGoodFit: 'WordPress-native AI products need plugin development for their core offering', whereToFind: 'WordPress plugin directory, WP-themed AI conferences', difficulty: 'medium', priority: 'high' },
    ],
    marketing_agencies: [
      { name: 'Agencies with Technical Gaps', description: 'Marketing agencies that sell technical services but lack in-house development team', whyGoodFit: 'They need white-label WordPress support for plugin, form, and tracking setup', whereToFind: 'LinkedIn agency owners, Clutch agency listings', difficulty: 'easy', priority: 'high' },
      { name: 'Growing Agencies Scaling Delivery', description: 'Agencies taking on more clients and needing scalable technical infrastructure', whyGoodFit: 'Scaling creates predictable, recurring need for integration and setup support', whereToFind: 'Agency websites with recent case studies or hiring pages', difficulty: 'medium', priority: 'high' },
    ],
  },
};

export function generateProspectTypes(cat: ServiceCategory, niche = '', serviceId?: string): ProspectTypes {
  const nicheKey = getNicheKey(niche);
  const overrides = NICHE_PROSPECT_TYPES[nicheKey]?.[cat];
  const serviceOverride = serviceId ? SERVICE_PROSPECT_TYPES[serviceId]?.[nicheKey] : undefined;
  return {
    types: serviceOverride && serviceOverride.length > 0 ? serviceOverride
      : overrides && overrides.length > 0 ? overrides
      : defaultProspectTypes(cat),
  };
}

const NICHE_SEARCH_QUERIES: Record<string, Partial<Record<ServiceCategory, {
  platform: string;
  query: string;
  whatToLookFor: string;
  howToUse: string;
  expectedQuality: string;
}[]>>> = {
  gaming: {
    video: [
      { platform: 'YouTube', query: 'site:youtube.com "gaming" "business inquiries" OR "brand deals" OR "sponsorships"', whatToLookFor: 'Gaming creators with business email visible in their About section or channel description', howToUse: 'Open each result and check channel size, upload frequency, and whether they already post Shorts', expectedQuality: 'Medium - requires manual filtering for relevant channels' },
      { platform: 'YouTube', query: 'site:youtube.com gaming channel "for business inquiries" email', whatToLookFor: 'Gaming channels that clearly want professional contact, indicating they treat content creation as a business', howToUse: 'Build a list of channels that have both regular content AND a business contact method', expectedQuality: 'High - channels with business emails are more likely to invest in editing' },
      { platform: 'Twitch', query: 'Twitch directory > Browse > [game category] > filter by average viewers 10-100', whatToLookFor: 'Streamers with VODs enabled, consistent schedules, and active chat communities', howToUse: 'Visit each streamer channel and check VOD quality, audience engagement, and whether they use clips', expectedQuality: 'Medium - requires browsing the directory and manual checking' },
      { platform: 'Instagram', query: 'Instagram search: #gamingreels #gamingcontent #gamingcreator - filter by recent posts', whatToLookFor: 'Gaming creators posting Reels consistently who might need editing support for volume', howToUse: 'Review creator profiles for engagement rates and whether their content quality suggests professional editing', expectedQuality: 'Medium - high volume but requires quality filtering' },
      { platform: 'Discord', query: 'Disboard.org search: gaming OR twitch OR streamer communities', whatToLookFor: 'Discord servers where gaming creators gather and share content', howToUse: 'Join relevant servers, observe creator activity, and note creators who post content that could benefit from professional editing', expectedQuality: 'Medium - relationship building required before pitching' },
    ],
  },
  educational: {
    video: [
      { platform: 'YouTube', query: 'site:youtube.com "tutorial" OR "course" OR "learn" "email" OR "contact" OR "business"', whatToLookFor: 'Educational creators who are open to professional contact and potentially outsourcing editing', howToUse: 'Review channel content type, upload frequency, and whether they already repurpose content for Shorts', expectedQuality: 'Medium - high volume with manual quality filtering required' },
      { platform: 'LinkedIn', query: 'site:linkedin.com "course creator" OR "educator" OR "online teacher"', whatToLookFor: 'LinkedIn educators who post educational content and may need video editing support', howToUse: 'Review their posts for video content and engagement, then check if they repurpose content across platforms', expectedQuality: 'Medium - requires verifying they actually create video content' },
      { platform: 'Teachable/Platforms', query: 'site:teachable.com OR site:udemy.com "course" OR "instructor"', whatToLookFor: 'Course creators who could use clip-based promotion for their courses', howToUse: 'Find instructors with active courses and check if they have a social media presence for clip distribution', expectedQuality: 'Medium - course platform pages often limited info, cross-reference on social media' },
    ],
  },
  podcast: {
    video: [
      { platform: 'YouTube', query: 'site:youtube.com "podcast" "business inquiries" OR "sponsor" OR "email"', whatToLookFor: 'Podcast channels with business contact info and regular episode uploads', howToUse: 'Check episode frequency, format (interview vs solo), and whether they already create short clips', expectedQuality: 'Medium - requires checking clip presence and episode quality' },
      { platform: 'LinkedIn', query: 'site:linkedin.com "podcast host" OR "podcaster"', whatToLookFor: 'Professionals who host podcasts and may need clip repurposing for LinkedIn engagement', howToUse: 'Review their podcast activity and check if they currently repurpose episodes for short-form content', expectedQuality: 'Medium - requires verifying they have video podcast content' },
      { platform: 'Spotify/Apple', query: 'Podchaser.com or Spotify podcast directory > browse by category > growing podcasts', whatToLookFor: 'Growing podcast channels that could benefit from clip-based promotion', howToUse: 'Review episode frequency and listener engagement, then check social media for clip presence', expectedQuality: 'Medium - requires cross-referencing with social media activity' },
    ],
  },
  ai_startups: {
    wordpress: [
      { platform: 'Product Hunt', query: 'site:producthunt.com "AI" upcoming OR recent launches', whatToLookFor: 'Newly launched AI products whose landing pages could be improved', howToUse: 'Open each product, review their website for messaging clarity, mobile experience, and CTA visibility', expectedQuality: 'High - direct access to recently launched products needing websites' },
      { platform: 'LinkedIn', query: 'site:linkedin.com "AI startup" founder OR CEO OR CTO', whatToLookFor: 'AI startup founders and technical leaders who might need website improvements', howToUse: 'Review their profile for company website, then evaluate the website quality and messaging', expectedQuality: 'High - founders are directly reachable and decision makers' },
      { platform: 'YC Directory', query: 'site:ycombinator.com companies AI category', whatToLookFor: 'YC-backed AI startups that have funding and need professional websites', howToUse: 'Browse the directory, visit each startup website, and evaluate quality against their funding stage', expectedQuality: 'High - funded startups have budget for web development' },
      { platform: 'AI Tool Directories', query: 'site:theresanaiforthat.com OR site:futurepedia.io categories', whatToLookFor: 'AI tools listed in directories with weak or inconsistent landing pages', howToUse: 'Browse categories, visit tool websites, and assess website quality against competitive standard', expectedQuality: 'Medium - broad list requires filtering by website quality issues' },
    ],
  },
  local_business: {
    wordpress: [
      { platform: 'Google Maps', query: 'Google Maps search: [service category] [city name]', whatToLookFor: 'Local service businesses whose Google Maps listing links to poor or no website', howToUse: 'Search for specific services, open each listing, visit their website, and evaluate mobile experience and contact clarity', expectedQuality: 'High - direct local results with visible website quality to assess' },
      { platform: 'Google Search', query: '[service] [city] - browse first page results', whatToLookFor: 'Local businesses ranking for service searches with outdated or poor websites', howToUse: 'Open each result, test mobile responsiveness, check contact visibility, and note improvement opportunities', expectedQuality: 'High - actively ranking businesses are motivated to maintain their online presence' },
      { platform: 'Instagram', query: 'Instagram search: #[city]business OR #[city]service OR #supportlocal[city]', whatToLookFor: 'Local businesses active on Instagram who may have weak websites', howToUse: 'Review their profile for website link, visit the site, and compare social quality against website quality', expectedQuality: 'Medium - requires cross-referencing Instagram presence with website quality' },
    ],
  },
  marketing_agencies: {
    wordpress: [
      { platform: 'Clutch', query: 'site:clutch.co marketing agencies [city] OR category', whatToLookFor: 'Marketing agencies listed on Clutch that may need technical WordPress support', howToUse: 'Review agency profiles, visit their website, and check if they offer services that require plugin, form, or tracking setup', expectedQuality: 'High - agencies on Clutch are actively seeking growth and improvement' },
      { platform: 'LinkedIn', query: 'site:linkedin.com "marketing agency" founder OR CEO OR "managing director"', whatToLookFor: 'Agency founders and leaders who make hiring decisions for technical support', howToUse: 'Review their company page and personal profile for service offerings and team structure', expectedQuality: 'High - direct access to agency decision makers' },
      { platform: 'Agency Portfolios', query: 'Google: [city] marketing agency portfolio - browse WordPress sites', whatToLookFor: 'Agencies whose own website or client sites are built on WordPress with room for improvement', howToUse: 'Visit agency websites, evaluate their own digital presence, and assess need for technical support', expectedQuality: 'Medium - requires evaluating agency need vs. existing capability' },
    ],
  },
  saas: {
    design: [
      { platform: 'Product Hunt', query: 'site:producthunt.com SaaS recent launches OR upcoming', whatToLookFor: 'Newly launched SaaS products whose UI could benefit from design improvement', howToUse: 'Review product screenshots and demo videos for UX friction, information hierarchy issues, and design consistency', expectedQuality: 'High - direct access to products needing UX improvement' },
      { platform: 'G2/Capterra', query: 'site:g2.com OR site:capterra.com [category] products', whatToLookFor: 'B2B SaaS products listed with user reviews mentioning UI/UX issues', howToUse: 'Search by category, read user reviews mentioning design or usability, and visit product websites to assess', expectedQuality: 'Medium - user reviews highlight specific UX pain points to address' },
      { platform: 'LinkedIn', query: 'site:linkedin.com "Head of Product" OR "Product Manager" SaaS OR B2B', whatToLookFor: 'Product leaders at SaaS companies who make UX hiring decisions', howToUse: 'Review their company product and assess UI quality, then determine fit for design improvement proposal', expectedQuality: 'Medium - requires connecting product leader to specific UX opportunity' },
    ],
  },
  product_startups: {
    design: [
      { platform: 'Product Hunt', query: 'site:producthunt.com upcoming products - review landing pages', whatToLookFor: 'Pre-launch products that need design polish before public release', howToUse: 'Review upcoming products, visit their landing pages or beta sites, and evaluate UI/UX quality', expectedQuality: 'High - pre-launch products are actively investing in design' },
      { platform: 'BetaList', query: 'site:betali.st OR site:betapage.co recent product listings', whatToLookFor: 'Beta-stage products that need design help before scaling', howToUse: 'Browse recent listings, test products when possible, and evaluate UX quality', expectedQuality: 'Medium - beta stage means they are building and open to feedback' },
      { platform: 'LinkedIn', query: 'site:linkedin.com "startup founder" OR "building" product design OR launch', whatToLookFor: 'Startup founders who are actively building and may need design support', howToUse: 'Review their posts for product updates and evaluate their product UI through shared screenshots or demos', expectedQuality: 'Medium - requires assessing their product and design stage' },
    ],
  },
  design_agencies: {
    design: [
      { platform: 'Dribbble', query: 'site:dribbble.com "agency" OR "studio" teams - browse portfolios', whatToLookFor: 'Design agencies on Dribbble whose portfolio shows quality variance across projects', howToUse: 'Review agency portfolios for design consistency and identify agencies that would benefit from design system support', expectedQuality: 'High - Dribbble agencies invest in design and understand its value' },
      { platform: 'LinkedIn', query: 'site:linkedin.com "design director" OR "creative director" agency', whatToLookFor: 'Design leaders at agencies who make decisions about design process and tooling', howToUse: 'Review their agency portfolio and assess design consistency and system maturity', expectedQuality: 'Medium - requires connecting design leader to design system opportunity' },
      { platform: 'Behance', query: 'site:behance.net "agency" OR "studio" - browse design projects', whatToLookFor: 'Agency design portfolios that could benefit from a consistent design system', howToUse: 'Browse agency projects and evaluate visual consistency and system maturity', expectedQuality: 'Medium - requires quality assessment across multiple projects' },
    ],
  },
};

function defaultSearchQueries(cat: ServiceCategory): SearchQuery[] {
  return [
    { platform: 'LinkedIn', query: 'Search for [niche] professionals in [industry]', whatToLookFor: 'Professionals who might need your service', howToUse: 'Review profiles and identify potential fit', expectedQuality: 'Medium' },
    { platform: 'Google', query: '[niche] + [service keyword] + contact', whatToLookFor: 'Websites and profiles of potential clients', howToUse: 'Open results and evaluate fit', expectedQuality: 'Medium' },
  ];
}

const SERVICE_SEARCH_QUERIES: Record<string, Record<string, SearchQuery[]>> = {
  plugin_integration_dev: {
    ai_startups: [
      { platform: 'WordPress Plugin Directory', query: 'wordpress.org/plugins/search/AI browse plugins with low ratings or few active installations', whatToLookFor: 'AI-related plugins that have poor reviews, limited features, or no recent updates', howToUse: 'Contact the plugin users or the AI tool directly offering a custom integration alternative', expectedQuality: 'High - users of underperforming plugins are actively looking for better solutions' },
      { platform: 'Product Hunt', query: 'site:producthunt.com "AI" "integrations" OR "API" recent launches', whatToLookFor: 'AI tools that mention integrations but do not list a WordPress plugin', howToUse: 'Review their integration page and API docs, then propose a custom WordPress plugin', expectedQuality: 'Medium - requires review of each tool integration offering' },
    ],
    marketing_agencies: [
      { platform: 'LinkedIn', query: 'site:linkedin.com "marketing agency" "WordPress" "campaign" owner OR founder', whatToLookFor: 'Agency owners who manage WordPress client sites and campaign pages', howToUse: 'Review their service offerings and pitch plugin, form, and tracking setup support', expectedQuality: 'High - agencies with WordPress needs are clear targets for technical support' },
    ],
  },
};

export function generateSearchQueries(cat: ServiceCategory, niche = '', serviceId?: string): SearchQueryBank {
  const nicheKey = getNicheKey(niche);
  const overrides = NICHE_SEARCH_QUERIES[nicheKey]?.[cat];
  const serviceOverride = serviceId ? SERVICE_SEARCH_QUERIES[serviceId]?.[nicheKey] : undefined;
  return {
    queries: serviceOverride && serviceOverride.length > 0 ? serviceOverride
      : overrides && overrides.length > 0 ? overrides
      : defaultSearchQueries(cat),
  };
}

export function generateLeadScorecard(cat?: ServiceCategory, niche = ''): LeadScorecard {
  const nicheKey = getNicheKey(niche);
  const defaults: Record<string, Partial<Record<string, number>>> = {
    ai_startups: { 'Niche Fit': 4, 'Visible Problem': 4, 'Ability to Pay': 3, 'Recent Activity': 4, 'Contact Accessibility': 3, 'Urgency': 3, 'Proof / Portfolio Match': 3 },
    marketing_agencies: { 'Niche Fit': 4, 'Visible Problem': 4, 'Ability to Pay': 4, 'Recent Activity': 3, 'Contact Accessibility': 3, 'Urgency': 3, 'Proof / Portfolio Match': 3 },
    saas: { 'Niche Fit': 4, 'Visible Problem': 4, 'Ability to Pay': 4, 'Recent Activity': 4, 'Contact Accessibility': 3, 'Urgency': 3, 'Proof / Portfolio Match': 3 },
    local_business: { 'Niche Fit': 4, 'Visible Problem': 3, 'Ability to Pay': 3, 'Recent Activity': 3, 'Contact Accessibility': 3, 'Urgency': 3, 'Proof / Portfolio Match': 3 },
    gaming: { 'Niche Fit': 4, 'Visible Problem': 3, 'Ability to Pay': 3, 'Recent Activity': 4, 'Contact Accessibility': 3, 'Urgency': 3, 'Proof / Portfolio Match': 3 },
    podcast: { 'Niche Fit': 4, 'Visible Problem': 3, 'Ability to Pay': 3, 'Recent Activity': 3, 'Contact Accessibility': 3, 'Urgency': 3, 'Proof / Portfolio Match': 3 },
    product_startups: { 'Niche Fit': 4, 'Visible Problem': 4, 'Ability to Pay': 3, 'Recent Activity': 4, 'Contact Accessibility': 3, 'Urgency': 4, 'Proof / Portfolio Match': 3 },
    design_agencies: { 'Niche Fit': 4, 'Visible Problem': 4, 'Ability to Pay': 4, 'Recent Activity': 3, 'Contact Accessibility': 3, 'Urgency': 3, 'Proof / Portfolio Match': 3 },
  };
  const nicheDefaults = defaults[nicheKey] || {};

  const factorNames: { name: string; maxScore: number }[] = [
    { name: 'Niche Fit', maxScore: 5 },
    { name: 'Visible Problem', maxScore: 5 },
    { name: 'Ability to Pay', maxScore: 5 },
    { name: 'Recent Activity', maxScore: 5 },
    { name: 'Contact Accessibility', maxScore: 5 },
    { name: 'Urgency', maxScore: 5 },
    { name: 'Proof / Portfolio Match', maxScore: 5 },
  ];

  const factors: ScoreFactor[] = factorNames.map((f) => ({
    name: f.name,
    score: nicheDefaults[f.name] ?? 0,
    maxScore: f.maxScore,
  }));

  const total = factors.reduce((sum, f) => sum + f.score, 0);

  return {
    factors,
    total,
    interpretation: total <= 12 ? 'Low priority — focus on higher-scoring prospects.'
      : total <= 21 ? 'Medium priority — worth pursuing with tailored outreach.'
      : total <= 30 ? 'High priority — strong fit, deprioritise other leads.'
      : 'Excellent fit — move to outreach immediately.',
  };
}

export function isValidProspect(p: PipelineEntry): boolean {
  return Boolean(
    (p.prospectName?.trim() || p.websiteUrl?.trim()) &&
    (p.score > 0 || p.visibleProblem?.trim())
  );
}

export function generatePriorityPlan(pipeline: PipelineEntry[], cat?: ServiceCategory, niche = ''): PriorityPlan {
  const valid = pipeline.filter(isValidProspect);
  const sorted = [...valid].sort((a, b) => b.score - a.score).slice(0, 5);
  const nicheKey = getNicheKey(niche);

  const nextActions: Record<string, string> = {
    ai_startups: 'Find their contact email or LinkedIn DM. Prepare a 3-sentence pitch referencing their website gap and your relevant sample project.',
    marketing_agencies: 'Send a cold email offering a free technical audit of their current WordPress setup. Reference a specific plugin or integration gap you noticed.',
    saas: 'Sign up for their product trial. Note 3 specific UX issues. Send a personalised proposal with before/after mockups of their actual interface.',
    local_business: 'Call the business directly or visit in person. Offer a free mobile responsiveness check and show them your sample project on your phone.',
    gaming: 'Engage with their content for 1 week (comment, share). Then DM with a free sample edit from their own VOD or stream footage.',
    podcast: 'Listen to 2 recent episodes. Identify 3 quotable moments. Send a DM with a 30-second sample clip made from their episode.',
    default: 'Research their contact info. Prepare a personalised outreach message referencing their specific visible problem. Include your relevant sample project link.',
  };

  return {
    entries: sorted.map((entry) => {
      const angle = nicheAngleText(nicheKey, cat, entry);
      const asset = nicheAssetText(nicheKey, cat);
      const action = nextActions[nicheKey] || nextActions.default;
      return {
        prospectName: entry.prospectName,
        whyWorthContacting: `Score of ${entry.score}/35. ${entry.visibleProblem || entry.notes || 'Potential fit identified.'}`,
        angleToUse: angle,
        portfolioAssetToShow: asset,
        nextStep: action,
      };
    }),
  };
}

function nicheAngleText(nicheKey: string, cat?: ServiceCategory, entry?: PipelineEntry): string {
  const problem = entry?.visibleProblem?.toLowerCase() || '';
  if (nicheKey === 'gaming' || nicheKey === 'educational' || nicheKey === 'podcast') {
    if (problem.includes('short-form') || problem.includes('clip')) return 'Reference their inconsistent shorts or clip strategy. Position your editing as a way to grow their reach without extra filming time.';
    if (problem.includes('engagement') || problem.includes('retention')) return 'Reference their current engagement metrics and show how professional editing improves retention and viewer loyalty.';
    return 'Reference the gap between their long-form content and short-form presence. Show how consistent clips build audience growth.';
  }
  if (nicheKey === 'ai_startups' || nicheKey === 'local_business' || nicheKey === 'marketing_agencies') {
    if (problem.includes('landing page') || problem.includes('messaging') || problem.includes('cta')) return 'Reference the unclear product explanation, weak homepage CTA, or mobile layout issue. Position your portfolio as a way to improve clarity and trust.';
    if (problem.includes('mobile') || problem.includes('template')) return 'Reference the mobile experience or template-based design. Show how a custom, performance-optimised build creates a stronger first impression.';
    if (problem.includes('tracking') || problem.includes('form') || problem.includes('plugin')) return 'Reference the missing tracking, form, or plugin setup. Position your technical integration support as a way to improve campaign delivery.';
    return 'Reference the website quality gap. Show how a professional, performance-optimised build improves credibility and conversion.';
  }
  if (nicheKey === 'saas' || nicheKey === 'product_startups' || nicheKey === 'design_agencies') {
    if (problem.includes('onboarding') || problem.includes('user flow')) return 'Reference the confusing onboarding or unclear user flow. Show how your redesign reduces friction and improves activation.';
    if (problem.includes('dashboard') || problem.includes('hierarchy') || problem.includes('navigation')) return 'Reference the dashboard complexity or poor information hierarchy. Show how clearer navigation reduces cognitive load.';
    if (problem.includes('design') || problem.includes('system') || problem.includes('consistent')) return 'Reference the design inconsistency. Show how a design system ensures visual quality at scale.';
    return 'Reference the UX friction points observed. Position your design work as a way to improve user satisfaction and retention.';
  }
  const fallback = problem ? `Reference the specific ${problem} observed.` : 'Reference the visible gap or opportunity in their current approach.';
  return fallback;
}

function nicheAssetText(nicheKey: string, cat?: ServiceCategory): string {
  if (cat === 'video') {
    if (nicheKey === 'gaming') return 'Gaming Shorts Sample Pack';
    if (nicheKey === 'educational') return 'Educational Clip Sample Pack';
    if (nicheKey === 'podcast') return 'Podcast Clip Sample Pack';
    return 'Short-Form Clip Sample Pack';
  }
  if (cat === 'wordpress') {
    if (nicheKey === 'ai_startups') return 'AI Startup Landing Page Sample';
    if (nicheKey === 'local_business') return 'Local Business Website Sample';
    if (nicheKey === 'marketing_agencies') return 'Agency Integration Setup Sample';
    return 'Website Build Sample';
  }
  if (cat === 'design') {
    if (nicheKey === 'saas') return 'SaaS Dashboard Redesign Sample';
    if (nicheKey === 'product_startups') return 'Product Onboarding Redesign Sample';
    if (nicheKey === 'design_agencies') return 'Design System Library Sample';
    return 'UI Redesign Sample';
  }
  return 'Sample Project';
}

export function generatePipelineSampleProspects(cat: ServiceCategory, niche = '', serviceId?: string): PipelineEntry[] {
  const nicheKey = getNicheKey(niche);
  const id = () => crypto.randomUUID();

  if (cat === 'video' && nicheKey === 'podcast') {
    return [
      {
        id: id(), prospectName: 'Weekly Podcast Host', platform: 'YouTube', websiteUrl: 'https://youtube.com/@podcast', nicheFit: 'Strong',
        visibleProblem: 'Releases full-length episodes but has no short-form clip strategy for YouTube Shorts, Reels, or TikTok',
        score: 27, priority: 'high', contactAvailable: true, notes: 'Weekly episodes with guest interviews, strong quotable moments, active audience', status: 'Qualified',
      },
      {
        id: id(), prospectName: 'Interview Podcast', platform: 'LinkedIn', websiteUrl: 'https://linkedin.com/in/host', nicheFit: 'Medium',
        visibleProblem: 'Podcast has strong guest content but no clip repurposing to grow show awareness on short-form platforms',
        score: 23, priority: 'high', contactAvailable: true, notes: 'Regular publishing schedule, guests share episodes, needs clip system for growth', status: 'Qualified',
      },
      {
        id: id(), prospectName: 'New Podcaster', platform: 'Spotify', websiteUrl: '', nicheFit: 'Low',
        visibleProblem: 'Early stage podcaster with no episode clip system and low discoverability outside Spotify',
        score: 11, priority: 'low', contactAvailable: false, notes: 'Small audience, may need to build episode library before investing in clip editing', status: 'Found',
      },
    ];
  }

  if (cat === 'video' && (nicheKey === 'gaming' || nicheKey === 'educational' || nicheKey === 'default')) {
    return [
      {
        id: id(), prospectName: 'Streamer with VODs', platform: 'Twitch', websiteUrl: 'https://twitch.tv/sample', nicheFit: 'Strong',
        visibleProblem: 'Posts long streams but has no short-form clip presence on YouTube Shorts or TikTok',
        score: 28, priority: 'high', contactAvailable: true, notes: 'Consistent streaming schedule, VODs enabled, active chat community', status: 'Qualified',
      },
      {
        id: id(), prospectName: 'Growing Creator', platform: 'YouTube', websiteUrl: 'https://youtube.com/sample', nicheFit: 'Medium',
        visibleProblem: 'Posts long-form content consistently but Shorts are infrequent and low engagement',
        score: 24, priority: 'high', contactAvailable: true, notes: '10K subscribers, weekly uploads, business email visible', status: 'Qualified',
      },
      {
        id: id(), prospectName: 'New Creator', platform: 'Discord', websiteUrl: '', nicheFit: 'Low',
        visibleProblem: 'Early stage, small following, no consistent content schedule',
        score: 12, priority: 'low', contactAvailable: false, notes: 'Found through community, needs to grow before investing in editing', status: 'Found',
      },
    ];
  }

  if (cat === 'wordpress') {
    if (nicheKey === 'ai_startups') {
      return [
        {
          id: id(), prospectName: 'Recently launched AI tool', platform: 'Product Hunt', websiteUrl: 'https://example.com/tool', nicheFit: 'Strong',
          visibleProblem: 'Landing page has unclear product explanation and weak CTA',
          score: 28, priority: 'high', contactAvailable: true, notes: 'Product is active, but homepage does not explain the use case clearly', status: 'Qualified',
        },
        {
          id: id(), prospectName: 'AI SaaS founder', platform: 'LinkedIn', websiteUrl: 'https://example.com/saas', nicheFit: 'Strong',
          visibleProblem: 'Website looks template-based and has poor mobile spacing',
          score: 24, priority: 'high', contactAvailable: true, notes: 'Founder posts regularly about the product, but website does not match the product quality', status: 'Qualified',
        },
        {
          id: id(), prospectName: 'AI tool directory listing', platform: 'AI Tool Directory', websiteUrl: 'https://example.com/directory', nicheFit: 'Medium',
          visibleProblem: 'Tool is listed in directories but website has no strong demo CTA',
          score: 21, priority: 'medium', contactAvailable: false, notes: 'Good fit if contact details are available', status: 'Found',
        },
      ];
    }
    if (nicheKey === 'local_business') {
      return [
        {
          id: id(), prospectName: 'Local Service Business', platform: 'Google Maps', websiteUrl: 'https://example.com/business', nicheFit: 'Strong',
          visibleProblem: 'Website looks outdated with poor mobile experience and no visible contact path',
          score: 27, priority: 'high', contactAvailable: true, notes: 'Active on social media but website is from 2019', status: 'Qualified',
        },
        {
          id: id(), prospectName: 'Home Service Provider', platform: 'Instagram', websiteUrl: 'https://example.com/service', nicheFit: 'Medium',
          visibleProblem: 'No website at all, only social media presence for bookings',
          score: 22, priority: 'high', contactAvailable: true, notes: 'Growing Instagram following, no web presence to capture leads', status: 'Found',
        },
        {
          id: id(), prospectName: 'Local Consultant', platform: 'Google Maps', websiteUrl: '', nicheFit: 'Low',
          visibleProblem: 'Has a basic one-page site with no booking or contact form',
          score: 15, priority: 'low', contactAvailable: false, notes: 'Small operation, may not have budget for website work', status: 'Found',
        },
      ];
    }
    if (nicheKey === 'marketing_agencies') {
      return [
        {
          id: id(), prospectName: 'Growth Agency', platform: 'Clutch', websiteUrl: 'https://example.com/agency', nicheFit: 'Strong',
          visibleProblem: 'Agency has no in-house developer for form, tracking, and plugin setup on client sites',
          score: 27, priority: 'high', contactAvailable: true, notes: '3-5 person team, running campaign pages for clients', status: 'Qualified',
        },
        {
          id: id(), prospectName: 'Campaign Agency', platform: 'LinkedIn', websiteUrl: 'https://example.com/campaign', nicheFit: 'Medium',
          visibleProblem: 'Agency sells landing page packages but relies on client IT for technical setup',
          score: 23, priority: 'high', contactAvailable: true, notes: 'Growing client base, needs scalable technical support', status: 'Qualified',
        },
        {
          id: id(), prospectName: 'Boutique Agency', platform: 'Agency Portfolio', websiteUrl: '', nicheFit: 'Low',
          visibleProblem: 'Small agency with inconsistent client site quality and no standard tech stack',
          score: 16, priority: 'medium', contactAvailable: false, notes: 'May need education on value of technical integration support', status: 'Found',
        },
      ];
    }
    return [
      {
        id: id(), prospectName: 'Website Owner', platform: 'Google Search', websiteUrl: 'https://example.com/site1', nicheFit: 'Medium',
        visibleProblem: 'Outdated website with poor mobile responsiveness',
        score: 25, priority: 'high', contactAvailable: true, notes: 'Business is active but website needs modernisation', status: 'Qualified',
      },
      {
        id: id(), prospectName: 'Business Founder', platform: 'LinkedIn', websiteUrl: 'https://example.com/site2', nicheFit: 'Medium',
        visibleProblem: 'Website has weak CTA and unclear service explanation',
        score: 20, priority: 'medium', contactAvailable: true, notes: 'Founder is active on LinkedIn, open to improvements', status: 'Found',
      },
    ];
  }

  if (cat === 'design') {
    if (nicheKey === 'saas') {
      return [
        {
          id: id(), prospectName: 'SaaS Product with UX Friction', platform: 'Product Hunt', websiteUrl: 'https://example.com/saas1', nicheFit: 'Strong',
          visibleProblem: 'Product has confusing onboarding flow with visible drop-off points during signup',
          score: 29, priority: 'high', contactAvailable: true, notes: 'Active userbase, funding raised, clear UX issues observed in trial', status: 'Qualified',
        },
        {
          id: id(), prospectName: 'B2B Dashboard Product', platform: 'G2', websiteUrl: 'https://example.com/saas2', nicheFit: 'Medium',
          visibleProblem: 'Dashboard has poor information hierarchy and cluttered navigation',
          score: 24, priority: 'high', contactAvailable: true, notes: 'Growing product with 500+ users, reviews mention UI confusion', status: 'Qualified',
        },
        {
          id: id(), prospectName: 'Early-Stage SaaS', platform: 'Indie Hackers', websiteUrl: '', nicheFit: 'Low',
          visibleProblem: 'Founder-built MVP with weak user flow and inconsistent UI patterns',
          score: 18, priority: 'medium', contactAvailable: false, notes: 'Pre-revenue, may need to validate before investing in design', status: 'Found',
        },
      ];
    }
    if (nicheKey === 'product_startups') {
      return [
        {
          id: id(), prospectName: 'Pre-Launch Product', platform: 'Product Hunt', websiteUrl: 'https://example.com/startup1', nicheFit: 'Strong',
          visibleProblem: 'Landing page lacks clarity on value proposition and has weak visual hierarchy',
          score: 28, priority: 'high', contactAvailable: true, notes: 'Launching soon on Product Hunt, needs design polish before public', status: 'Qualified',
        },
        {
          id: id(), prospectName: 'Recently Launched Startup', platform: 'BetaList', websiteUrl: 'https://example.com/startup2', nicheFit: 'Medium',
          visibleProblem: 'Product has unclear first-user journey and poor onboarding experience',
          score: 22, priority: 'high', contactAvailable: true, notes: 'Post-launch feedback highlights UX issues', status: 'Qualified',
        },
        {
          id: id(), prospectName: 'Technical Founder', platform: 'LinkedIn', websiteUrl: '', nicheFit: 'Low',
          visibleProblem: 'Founder built MVP but interface lacks professional polish and design consistency',
          score: 15, priority: 'low', contactAvailable: false, notes: 'May need education on ROI of professional design', status: 'Found',
        },
      ];
    }
    if (nicheKey === 'design_agencies') {
      return [
        {
          id: id(), prospectName: 'Scaling Design Agency', platform: 'Dribbble', websiteUrl: 'https://example.com/agency1', nicheFit: 'Strong',
          visibleProblem: 'Portfolio shows inconsistent visual quality across projects, no standard design system',
          score: 27, priority: 'high', contactAvailable: true, notes: '5-10 person team taking on more clients, needs design system support', status: 'Qualified',
        },
        {
          id: id(), prospectName: 'Boutique Studio', platform: 'Behance', websiteUrl: 'https://example.com/agency2', nicheFit: 'Medium',
          visibleProblem: 'Agency offers UX audits but does not have a consistent component library for delivery',
          score: 23, priority: 'high', contactAvailable: true, notes: 'Sells design services, would benefit from scalable system approach', status: 'Qualified',
        },
        {
          id: id(), prospectName: 'Freelance Designer Team', platform: 'LinkedIn', websiteUrl: '', nicheFit: 'Low',
          visibleProblem: 'Small team producing client work without shared design tokens or documentation',
          score: 14, priority: 'low', contactAvailable: false, notes: 'Early stage, may not yet feel the pain of inconsistency', status: 'Found',
        },
      ];
    }
    return [
      {
        id: id(), prospectName: 'Product Team Lead', platform: 'LinkedIn', websiteUrl: 'https://example.com/product', nicheFit: 'Medium',
        visibleProblem: 'Product interface has visible usability issues and inconsistent design',
        score: 26, priority: 'high', contactAvailable: true, notes: 'Active product with user feedback highlighting design problems', status: 'Qualified',
      },
      {
        id: id(), prospectName: 'Startup Founder', platform: 'Product Hunt', websiteUrl: 'https://example.com/startup', nicheFit: 'Medium',
        visibleProblem: 'Landing page and product UI lack professional polish',
        score: 20, priority: 'medium', contactAvailable: true, notes: 'Early stage, open to design partnerships', status: 'Found',
      },
    ];
  }

  return [];
}

export function generatePipelineNextActions(cat: ServiceCategory, niche = '', serviceId?: string): string[] {
  const nicheKey = getNicheKey(niche);
  const nicheSpecificActions: Record<string, string[]> = {
    gaming: [
      'Start with YouTube gaming creators in the 5K-50K subscriber range who post weekly long-form content.',
      'Build a list of 20 gaming creators who have business emails visible in their channel About section.',
      'Add the top 5 creators who have no short-form presence to your pipeline as high priority.',
      'Score each prospect using the lead qualification scorecard before preparing for outreach.',
    ],
    educational: [
      'Start with tutorial YouTubers in the 5K-50K subscriber range who post weekly educational content.',
      'Build a list of 20 educational creators who have course products or coaching services.',
      'Add the top 5 creators who have no clip repurposing strategy as high priority.',
      'Score each prospect using the lead qualification scorecard before preparing for outreach.',
    ],
    podcast: [
      'Start with YouTube podcast channels in the 5K-50K subscriber range who post weekly episodes.',
      'Build a list of 20 podcasters who have guest booking processes and quotable episode content.',
      'Add the top 5 podcasters who have no short-form clip presence as high priority.',
      'Score each prospect using the lead qualification scorecard before preparing for outreach.',
    ],
    ai_startups: [
      'Start with AI startups recently launched on Product Hunt with basic or template-based landing pages.',
      'Build a list of 20 AI startups whose websites have weak messaging, poor CTAs, or mobile issues.',
      'Add the top 5 startups that have funding or clear revenue potential as high priority.',
      'Score each prospect using the lead qualification scorecard before preparing for outreach.',
    ],
    local_business: [
      'Start with local service businesses in your area that appear in Google Maps but have poor websites.',
      'Build a list of 20 businesses whose websites have outdated design, poor mobile experience, or no contact path.',
      'Add the top 5 businesses that are active on social media but have weak websites as high priority.',
      'Score each prospect using the lead qualification scorecard before preparing for outreach.',
    ],
    marketing_agencies: [
      'Start with small marketing agencies (2-10 employees) that have no in-house technical team.',
      'Build a list of 20 agencies whose services include campaign pages, landing pages, or client sites needing technical support.',
      'Add the top 5 agencies that are growing and taking on new clients as high priority.',
      'Score each prospect using the lead qualification scorecard before preparing for outreach.',
    ],
    saas: [
      'Start with B2B SaaS products in early stages (100-1000 users) with visible UX friction in their interface.',
      'Build a list of 20 SaaS products whose dashboards have poor information hierarchy or confusing navigation.',
      'Add the top 5 products that have active userbases and revenue as high priority.',
      'Score each prospect using the lead qualification scorecard before preparing for outreach.',
    ],
    product_startups: [
      'Start with pre-launch or recently launched product startups that need design polish before scaling.',
      'Build a list of 20 startups whose landing pages lack clarity or whose products have unclear user flows.',
      'Add the top 5 startups that have accelerator backing or visible funding as high priority.',
      'Score each prospect using the lead qualification scorecard before preparing for outreach.',
    ],
    design_agencies: [
      'Start with design studios that produce client work without a visible design system or consistent visual quality.',
      'Build a list of 20 agencies whose portfolios show quality variance across projects.',
      'Add the top 5 agencies that are scaling their team and taking on more clients as high priority.',
      'Score each prospect using the lead qualification scorecard before preparing for outreach.',
    ],
  };

  const nicheActions = nicheSpecificActions[nicheKey];
  if (nicheActions) return nicheActions;

  const defaults: Record<ServiceCategory, string[]> = {
    video: [
      'Start by identifying 20 potential clients from your chosen sources.',
      'Qualify each prospect using the ideal client criteria checklist.',
      'Score each prospect using the lead qualification scorecard.',
      'Add the top 5 scoring prospects to your pipeline as high priority.',
    ],
    wordpress: [
      'Start by identifying 20 potential clients from your chosen sources.',
      'Qualify each prospect using the ideal client criteria checklist.',
      'Score each prospect using the lead qualification scorecard.',
      'Add the top 5 scoring prospects to your pipeline as high priority.',
    ],
    design: [
      'Start by identifying 20 potential clients from your chosen sources.',
      'Qualify each prospect using the ideal client criteria checklist.',
      'Score each prospect using the lead qualification scorecard.',
      'Add the top 5 scoring prospects to your pipeline as high priority.',
    ],
  };
  return defaults[cat];
}

export function generateOutreachContextDefaults(serviceId: string | null, nicheKey: string) {
  const cat = getServiceCategory(serviceId);
  const pipelineSamples = generatePipelineSampleProspects(cat, nicheKey, serviceId ?? undefined);
  const sample = pipelineSamples[0];

  const serviceDescriptions: Record<string, string> = {
    plugin_integration_dev: 'WordPress plugin integration support — especially forms, CRM connections, tracking tags, and campaign setup.',
    custom_theme_development: 'custom WordPress landing pages for AI startups — especially product clarity, trust sections, and demo/signup flow.',
    site_migration_performance: 'WordPress site migration and performance optimisation — especially speed, mobile layouts, and local SEO.',
    product_ui_design: 'SaaS product UI design — especially onboarding clarity, dashboard hierarchy, and user flow.',
    brand_identity_visual_systems: 'brand identity visual systems — especially reusable component libraries, design tokens, and consistency.',
    ux_research_conversion_audits: 'UX research and conversion audits — especially onboarding flows, drop-off reduction, and activation.',
    short_form_clips: 'short-form clip editing — especially hooks, captions, pacing, and consistent Shorts/Reels/TikTok publishing.',
    podcast_post_production: 'podcast post-production — especially identifying quotable moments, editing clips, and adding captions.',
    long_form_content: 'long-form content production and repurposing — especially scripting, editing, and distribution.',
  };

  const sampleAssetLines: Record<string, string> = {
    plugin_integration_dev: 'I created a sample agency plugin integration setup showing how forms, CRM, tracking, and campaign tools can connect cleanly.',
    custom_theme_development: 'I created a sample AI startup landing page breakdown showing how product value, trust, and demo/signup flow can be structured.',
    site_migration_performance: 'I created a sample site migration project showing how speed, mobile layout, and local SEO can be improved.',
    product_ui_design: 'I created a sample SaaS dashboard redesign showing how onboarding and interface clarity can be improved.',
    brand_identity_visual_systems: 'I created a sample design system breakdown showing how reusable components and design tokens improve consistency.',
    ux_research_conversion_audits: 'I created a sample UX audit showing how friction points can be identified and improved.',
    short_form_clips: 'I created a sample gaming shorts pack showing how long-form moments can become short-form clips.',
    podcast_post_production: 'I created a sample podcast clip pack showing how full episodes can become discovery clips.',
    long_form_content: 'I created a sample content repurpose pack showing how to turn long videos into engaging clips.',
  };

  return {
    prospectName: sample?.prospectName || 'Ideal prospect',
    companyOrChannelName: 'Sample Business',
    platform: sample?.platform || 'LinkedIn',
    visibleProblem: sample?.visibleProblem || 'there is an opportunity to improve conversion rates and user engagement.',
    reasonToContact: sample?.notes || 'a tailored audit or project review could help address these gaps.',
    recommendedAsset: 'Sample Project',
    serviceDescription: serviceId ? (serviceDescriptions[serviceId] || 'specialized freelance services.') : 'specialized freelance services.',
    sampleAssetLine: serviceId ? (sampleAssetLines[serviceId] || 'I created a sample project showing my approach to this type of work.') : 'I created a sample project showing my approach to this type of work.'
  };
}
