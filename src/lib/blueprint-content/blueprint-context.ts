import type { ServiceCategory } from './contentQuality';
import type { ClientSource, Criterion, ProspectType, SearchQuery, PipelineEntry } from '../../types/client-pipeline-system';
import { getServiceCategory, getAudienceLabel, getNicheKey, VIDEO_SERVICES, WP_SERVICES, DESIGN_SERVICES } from './contentQuality';

export interface BlueprintContext {
  serviceCategory: ServiceCategory;
  serviceType: string;
  nicheKey: string;
  audienceLabel: string;
  offerLabel: string;
  tools: string[];
  deliverables: string[];
  caseStudyTemplate: {
    problem: string;
    process: string;
    result: string;
    tools: string;
    cta: string;
  };
  sampleProjectTemplate: {
    projectName: string;
    goal: string;
    whatToCreate: string;
    deliverables: string[];
    timeline: string;
    howToPresent: string;
  };
  portfolioCopyTemplate: {
    headline: string;
    shortIntro: string;
    caseStudyIntro: string;
    processSection: string;
    cta: string;
  };
  recommendedSources: ClientSource[];
  criteria: Criterion[];
  prospectTypes: ProspectType[];
  searchQueries: SearchQuery[];
  sampleProspects: PipelineEntry[];
  forbiddenTerms: string[];
}

type ServiceDef = Omit<BlueprintContext, 'serviceCategory' | 'serviceType' | 'nicheKey' | 'audienceLabel' | 'offerLabel'>;

const SERVICE_TOOLS: Record<string, string[]> = {
  short_form_clips: ['Premiere Pro', 'After Effects', 'Audition', 'CapCut', 'DaVinci Resolve'],
  long_form_content: ['Premiere Pro', 'After Effects', 'Audition', 'DaVinci Resolve', 'Final Cut Pro'],
  podcast_post_production: ['Audition', 'Premiere Pro', 'Headliner', 'Descript', 'Auphonic'],
  custom_theme_development: ['VS Code', 'LocalWP', 'Figma', 'Git', 'Lighthouse', 'WordPress', 'ACF'],
  plugin_integration_dev: ['VS Code', 'LocalWP', 'Postman', 'Git', 'WP CLI', 'PHP', 'REST APIs'],
  site_migration_performance: ['VS Code', 'LocalWP', 'WP CLI', 'Lighthouse', 'PageSpeed Insights', 'Cloudflare CDN', 'Redis'],
  product_ui_design: ['Figma', 'Protopie', 'Miro', 'Storybook', 'Principle'],
  brand_identity_visual_systems: ['Figma', 'Illustrator', 'Photoshop', 'FontForge', 'Brandpad'],
  ux_research_conversion_audits: ['Figma', 'Miro', 'Hotjar', 'FullStory', 'Google Analytics', 'Clarity'],
};

const SERVICE_DELIVERABLES: Record<string, Record<string, string[]>> = {
  custom_theme_development: {
    ai_startups: ['Custom WordPress theme', 'Responsive mobile layout', 'Performance-optimised code', 'SEO-friendly structure', 'Landing page with clear CTA', 'Handoff documentation'],
    local_business: ['Custom WordPress theme', 'Responsive mobile version', 'Local SEO-optimised content', 'Contact form integration', 'Google Maps embed', 'Handoff documentation'],
    marketing_agencies: ['Custom WordPress theme with portfolio layout', 'Case study page template', 'Responsive mobile version', 'SEO-optimised structure', 'Lead capture forms', 'Handoff documentation'],
    default: ['Custom WordPress theme', 'Responsive mobile layout', 'Performance optimisation', 'SEO-friendly structure', 'Handoff documentation'],
  },
  plugin_integration_dev: {
    ai_startups: ['WordPress plugin with API connector', 'Configuration settings page', 'Frontend embed component', 'Setup and troubleshooting documentation', 'Integration test results'],
    marketing_agencies: ['Multi-tool integration plugin', 'Automated data sync module', 'Unified dashboard widget', 'Setup and configuration guide', 'Workflow automation examples'],
    default: ['Custom WordPress plugin', 'API integration module', 'Configuration interface', 'Setup documentation', 'Troubleshooting guide'],
  },
  product_ui_design: {
    saas: ['Redesigned dashboard screens (3 views)', 'Interactive Figma prototype', 'Design system components', 'Before/after comparison', 'Design decisions document'],
    product_startups: ['Onboarding flow screens (4-5 views)', 'Interactive Figma prototype', 'User flow documentation', 'Before/after comparison', 'Design rationale document'],
    default: ['High-fidelity UI screens', 'Interactive prototype', 'Component library', 'Design tokens', 'Developer handoff files'],
  },
  short_form_clips: {
    default: ['3 short-form clips', 'Hook notes per clip', 'Caption files (SRT)', 'Before/after editing breakdown', 'Process explanation'],
  },
};

function getDeliverables(serviceId: string, nicheKey: string): string[] {
  return SERVICE_DELIVERABLES[serviceId]?.[nicheKey]
    ?? SERVICE_DELIVERABLES[serviceId]?.default
    ?? [];
}

function getTools(serviceId: string): string[] {
  return SERVICE_TOOLS[serviceId] ?? [];
}

const CASE_STUDY_OVERRIDES: Record<string, Record<string, { problem: string; process: string; result: string; tools: string; cta: string }>> = {
  custom_theme_development: {
    ai_startups: {
      problem: 'Many AI startups have a strong product but no professional WordPress website. A template-based or poorly structured site hurts credibility and fails to convert technical visitors into signups, demos, or investor conversations.',
      process: 'I started by understanding the AI product and its target user, planned the site structure and content hierarchy to explain complex technology clearly, built a custom WordPress theme with clean responsive layout and performance-first engineering, and delivered a fully responsive, SEO-optimised site with thorough handoff documentation.',
      result: 'A professional WordPress site that clearly communicates the product value, loads fast on all devices, and gives the startup a credible foundation for growth and investor conversations.',
      tools: 'VS Code, LocalWP, Figma, Git, Lighthouse, WordPress, ACF',
      cta: 'Send me your current website or product description and I will suggest 3 specific improvements.',
    },
  },
  plugin_integration_dev: {
    ai_startups: {
      problem: 'Many AI startups offer powerful products but lack the WordPress plugin or integration that would let users connect the tool to their existing platform. This adoption friction costs them users who need a seamless setup.',
      process: 'I analysed the AI product API and integration requirements, designed a plugin architecture that mirrors user workflows, built the integration with clear configuration options and error handling, tested against real usage patterns, and delivered thorough setup and troubleshooting documentation.',
      result: 'A functional WordPress plugin that connects the AI product to user platforms, reduces adoption friction from hours to minutes, and gives the startup a scalable distribution channel through the WordPress ecosystem.',
      tools: 'VS Code, LocalWP, Postman, Git, WP CLI, PHP, REST APIs',
      cta: 'Send me your product API documentation and I will suggest 3 specific integration approaches.',
    },
    marketing_agencies: {
      problem: 'Many marketing agencies juggle disconnected tools for CRM, email, analytics, and campaign management. Manual data transfers waste hours, delay reporting, and increase the risk of errors in client campaigns.',
      process: 'I analysed the agency tool stack and workflow bottlenecks, designed a plugin architecture connecting key platforms with automated data sync, built the integration against real campaign workflows, and delivered setup documentation that enables the team to onboard new clients without technical support.',
      result: 'A connected tool ecosystem with automated data flows between platforms, reducing manual work, improving reporting accuracy, and freeing the team to focus on strategy instead of data wrangling.',
      tools: 'VS Code, LocalWP, Postman, Git, WP CLI, PHP, REST APIs',
      cta: 'Send me your current agency tool stack and I will suggest 3 specific integration opportunities.',
    },
  },
  product_ui_design: {
    saas: {
      problem: 'Many SaaS products have powerful features buried under confusing interfaces. Users struggle to complete core tasks, onboarding drop-off is high, and the product team lacks a systematic approach to improving the experience.',
      process: 'I reviewed the existing interface, mapped the core user flows to identify friction points, redesigned key screens with clearer information hierarchy and consistent interaction patterns, built a reusable component system, and delivered developer-ready handoff files with design rationale documentation.',
      result: 'A redesigned product interface that users can navigate intuitively, with measurable improvements in task completion time, reduced onboarding friction, and a component system that keeps the product visually consistent as it scales.',
      tools: 'Figma, Protopie, Miro, Storybook, Principle',
      cta: 'Send me your current product UI and I will suggest 3 specific improvements with estimated impact.',
    },
  },
};

const SERVICE_CONTEXT: Record<string, ServiceDef> = {
  short_form_clips: {
    tools: ['Premiere Pro', 'After Effects', 'Audition', 'CapCut'],
    deliverables: [],
    caseStudyTemplate: {
      problem: 'Many creators have great long-form content, but their best moments stay buried inside full videos instead of reaching new audiences through short-form platforms as discoverable clips.',
      process: 'I reviewed the source footage, selected the highest-potential moments, shaped each clip around a clear hook, added captions, tightened pacing, and prepared the clips for Shorts, Reels, or TikTok with platform-specific optimisation.',
      result: 'A focused sample pack showing how long-form content can be turned into short-form clips designed for retention, discovery, and consistent publishing.',
      tools: 'Premiere Pro, After Effects, Audition',
      cta: 'Send me one long-form video and I will suggest 3 specific clip ideas.',
    },
    sampleProjectTemplate: {
      projectName: 'Short-Form Clip Sample Pack',
      goal: 'Show how long-form content can be turned into short-form clips designed for retention and discovery on Shorts, Reels, and TikTok.',
      whatToCreate: 'Create 3 short-form clips from sample footage. Each clip should include a clear hook, tight pacing, captions, and a short explanation of the editing decisions behind each clip.',
      deliverables: ['3 short-form clips', 'Hook notes per clip', 'Caption files (SRT)', 'Before/after editing breakdown', 'Process explanation'],
      timeline: '1 week',
      howToPresent: 'Create a portfolio page showing the original moment, the edited clip, and a short explanation of why the edit improves retention and viewer engagement.',
    },
    portfolioCopyTemplate: {
      headline: 'I help creators turn long-form content into short-form clips designed for retention and discovery across Shorts, Reels, and TikTok.',
      shortIntro: 'I work with creators to review source footage, select the highest-potential moments, and shape each clip around a clear hook with tight pacing and captions.',
      caseStudyIntro: 'Here is a sample project showing how I turned long-form content into a set of short-form clips built for retention and discovery across short-form platforms.',
      processSection: 'I review your source footage, identify the highest-potential moments, shape each clip around a clear hook, add captions, tighten the pacing, and prepare the clips for Shorts, Reels, or TikTok.',
      cta: 'Send me one long-form video and I will suggest 3 specific clip ideas.',
    },
    recommendedSources: [],
    criteria: [],
    prospectTypes: [],
    searchQueries: [],
    sampleProspects: [],
    forbiddenTerms: [],
  },
  custom_theme_development: {
    tools: ['VS Code', 'LocalWP', 'Figma', 'Git', 'Lighthouse', 'WordPress', 'ACF'],
    deliverables: [],
    caseStudyTemplate: {
      problem: 'Many startups have a strong product but no professional website to show for it. This hurts credibility with investors and makes it harder to convert early visitors into customers.',
      process: 'I started by understanding the product and target audience, planned the site structure and content hierarchy, built a custom WordPress theme with performance-first principles, and delivered a responsive, SEO-optimised site with clear documentation.',
      result: 'A professional, fast-loading website that clearly communicates the product value and drives conversions from day one.',
      tools: 'VS Code, LocalWP, Figma, Git, Lighthouse',
      cta: 'Send me your current website or landing page and I will suggest 3 specific improvements.',
    },
    sampleProjectTemplate: {
      projectName: 'Landing Page Build',
      goal: 'Show how a clear, professional landing page can communicate product value and drive conversions.',
      whatToCreate: 'Build a custom WordPress landing page for a product or service. Include a hero section with clear value proposition, feature highlights, social proof placeholder, and a clear CTA. Optimise for performance and mobile responsiveness.',
      deliverables: ['Custom WordPress landing page template', 'Responsive mobile version', 'SEO-optimised semantic HTML', 'Performance report (Lighthouse)', 'Handoff documentation'],
      timeline: '2 weeks',
      howToPresent: 'Show the live landing page, include a before/after of the design process, and display Lighthouse performance scores to demonstrate optimisation.',
    },
    portfolioCopyTemplate: {
      headline: 'I help startups launch fast, professional WordPress websites with clean structure, responsive layouts, and performance-first development.',
      shortIntro: 'I build custom WordPress sites that clearly communicate your product value, load fast, and convert visitors into leads or signups.',
      caseStudyIntro: 'Here is a sample project showing how I built a professional WordPress landing page focused on performance, clarity, and conversion.',
      processSection: 'I start with your product and audience, plan the site structure and content hierarchy, build a custom WordPress theme with performance optimisation, and deliver a responsive, SEO-optimised site with clear documentation.',
      cta: 'Send me your current website or landing page and I will suggest 3 specific improvements.',
    },
    recommendedSources: [],
    criteria: [],
    prospectTypes: [],
    searchQueries: [],
    sampleProspects: [],
    forbiddenTerms: [],
  },
  plugin_integration_dev: {
    tools: ['VS Code', 'LocalWP', 'Postman', 'Git', 'WP CLI', 'PHP', 'REST APIs'],
    deliverables: [],
    caseStudyTemplate: {
      problem: 'Many businesses and agencies rely on disconnected tools that require manual data transfers, wasting time and increasing error risk.',
      process: 'I analysed the current tool stack and workflow bottlenecks, designed a plugin architecture connecting key platforms, built the integration with automated data sync, and delivered setup documentation.',
      result: 'A connected tool ecosystem with automated data flows, reducing manual work and improving reporting accuracy.',
      tools: 'VS Code, LocalWP, Postman, Git, WP CLI, PHP, REST APIs',
      cta: 'Send me your current tool stack and I will suggest 3 specific integration opportunities.',
    },
    sampleProjectTemplate: {
      projectName: 'Plugin Integration Prototype',
      goal: 'Show how a WordPress plugin can connect disconnected tools into an automated workflow that saves time and improves reporting.',
      whatToCreate: 'Build a WordPress plugin prototype that connects common tools. Include API connection module, configuration settings, frontend components, and setup documentation.',
      deliverables: ['WordPress plugin with API connector', 'Configuration settings page', 'Frontend embed component', 'Setup and troubleshooting documentation', 'Integration test results'],
      timeline: '3 weeks',
      howToPresent: 'Create a portfolio page showing the plugin architecture, API integration flow, live configuration demo, and documentation demonstrating ease of setup.',
    },
    portfolioCopyTemplate: {
      headline: 'I help businesses and agencies connect their tool stack with custom WordPress plugins that automate workflows and improve reporting.',
      shortIntro: 'I build WordPress plugins that connect disconnected tools, automate data sync, and provide unified dashboards for better campaign management and reporting.',
      caseStudyIntro: 'Here is a sample project showing how I built a multi-tool integration plugin that connects key platforms into a single automated workflow.',
      processSection: 'I start with your current tool stack and workflow bottlenecks, design a plugin architecture that connects key platforms, build automated data sync, test against real workflows, and deliver setup documentation.',
      cta: 'Send me your current tool stack and I will suggest 3 specific integration opportunities.',
    },
    recommendedSources: [],
    criteria: [],
    prospectTypes: [],
    searchQueries: [],
    sampleProspects: [],
    forbiddenTerms: [],
  },
  product_ui_design: {
    tools: ['Figma', 'Protopie', 'Miro', 'Storybook', 'Principle'],
    deliverables: [],
    caseStudyTemplate: {
      problem: 'Many products have useful features, but users struggle because the interface does not guide them clearly through key actions.',
      process: 'I reviewed the existing interface, mapped the user flow, identified friction points, redesigned key screens with clearer information hierarchy, and delivered developer-ready handoff files.',
      result: 'A redesigned interface that is easier to navigate, reduces user friction, and communicates the product value more clearly at every touchpoint.',
      tools: 'Figma, Protopie, Miro, Storybook',
      cta: 'Send me your current product UI and I will suggest 3 specific improvements.',
    },
    sampleProjectTemplate: {
      projectName: 'Interface Redesign Concept',
      goal: 'Show how a product interface can be redesigned for clarity, reduced cognitive load, and better user engagement.',
      whatToCreate: 'Design 3 key interface views with improved information hierarchy, clear data visualisation, and a consistent component system. Present as an interactive Figma prototype.',
      deliverables: ['Redesigned interface screens (3 views)', 'Interactive Figma prototype', 'Design system components', 'Before/after comparison', 'Design decisions document'],
      timeline: '3 weeks',
      howToPresent: 'Create a case study page showing the original interface, design decisions, redesigned screens, and a link to the interactive prototype.',
    },
    portfolioCopyTemplate: {
      headline: 'I help product teams design clearer interfaces and landing pages that make the product easier to understand and use.',
      shortIntro: 'I design user-friendly product interfaces that reduce friction, improve activation, and communicate product value at every touchpoint.',
      caseStudyIntro: 'Here is a sample project showing how I redesigned a product interface for better clarity, reduced friction, and improved user engagement.',
      processSection: 'I review your current interface, identify usability issues, redesign key screens with clearer information hierarchy, build a reusable component system, and deliver developer-ready handoff files.',
      cta: 'Send me your current product UI and I will suggest 3 specific improvements.',
    },
    recommendedSources: [],
    criteria: [],
    prospectTypes: [],
    searchQueries: [],
    sampleProspects: [],
    forbiddenTerms: [],
  },
};

function getServiceContext(serviceId: string): ServiceDef | undefined {
  return SERVICE_CONTEXT[serviceId];
}

export function resolveBlueprintContext(serviceId: string, nicheKey: string): BlueprintContext {
  const cat = getServiceCategory(serviceId);
  const audienceLabel = getAudienceLabelFromNicheKey(nicheKey);
  const offerLabel = getOfferLabel(serviceId);

  const svc = getServiceContext(serviceId) || getDefaultServiceContext(cat);

  const caseStudyTemplate = CASE_STUDY_OVERRIDES[serviceId]?.[nicheKey]
    ?? svc.caseStudyTemplate;

  const deliverables = getDeliverables(serviceId, nicheKey);
  const tools = svc.tools.length > 0 ? svc.tools : getTools(serviceId);

  return {
    serviceCategory: cat,
    serviceType: serviceId,
    nicheKey,
    audienceLabel,
    offerLabel,
    tools,
    deliverables,
    caseStudyTemplate,
    sampleProjectTemplate: svc.sampleProjectTemplate,
    portfolioCopyTemplate: svc.portfolioCopyTemplate,
    recommendedSources: svc.recommendedSources,
    criteria: svc.criteria,
    prospectTypes: svc.prospectTypes,
    searchQueries: svc.searchQueries,
    sampleProspects: svc.sampleProspects,
    forbiddenTerms: svc.forbiddenTerms,
  };
}

function getDefaultServiceContext(cat: ServiceCategory): ServiceDef {
  const defaults: Record<ServiceCategory, ServiceDef> = {
    video: {
      tools: ['Premiere Pro', 'After Effects', 'Audition'],
      deliverables: [],
      caseStudyTemplate: {
        problem: 'Many creators have great content, but the best moments stay buried inside long videos instead of reaching new audiences on short-form platforms.',
        process: 'I reviewed the source footage, selected high-potential moments, shaped each clip around a clear hook, added captions, tightened pacing, and prepared the clips for Shorts, Reels, or TikTok.',
        result: 'A focused sample pack that shows how long-form content can be turned into short-form clips designed for retention and discovery.',
        tools: 'Premiere Pro, After Effects, Audition',
        cta: 'Send me one long-form video and I will suggest 3 specific clip ideas.',
      },
      sampleProjectTemplate: {
        projectName: 'Short-Form Clip Sample Pack',
        goal: 'Show how long-form content can be turned into short-form clips designed for retention and discovery.',
        whatToCreate: 'Create 3 short-form clips from sample footage with hooks, tight pacing, captions, and editing explanations.',
        deliverables: ['3 short-form clips', 'Hook notes', 'Caption files', 'Before/after breakdown', 'Process explanation'],
        timeline: '1 week',
        howToPresent: 'Show original moments, edited clips, and editing rationale.',
      },
      portfolioCopyTemplate: {
        headline: 'I help creators turn long-form content into short-form clips designed for retention and discovery.',
        shortIntro: 'I work with creators to review footage, select moments, and shape clips around hooks with tight pacing and captions.',
        caseStudyIntro: 'Here is a sample project showing how I turned long-form content into short-form clips built for retention and discovery.',
        processSection: 'I review footage, identify moments, shape clips around hooks, add captions, tighten pacing, and prepare for short-form platforms.',
        cta: 'Send me a long-form video and I will suggest 3 clip ideas.',
      },
      recommendedSources: [],
      criteria: [],
      prospectTypes: [],
      searchQueries: [],
      sampleProspects: [],
      forbiddenTerms: [],
    },
    wordpress: {
      tools: ['VS Code', 'LocalWP', 'Figma', 'Git', 'Lighthouse'],
      deliverables: [],
      caseStudyTemplate: {
        problem: 'Many businesses have a strong offering but no professional website to show for it.',
        process: 'I planned site structure, built a custom theme with performance optimisation, and delivered a responsive, SEO-optimised site.',
        result: 'A professional, fast-loading website that communicates value and drives conversions.',
        tools: 'VS Code, LocalWP, Figma, Git, Lighthouse',
        cta: 'Send me your current website and I will suggest 3 improvements.',
      },
      sampleProjectTemplate: {
        projectName: 'Website Build',
        goal: 'Show how a professional website can communicate value and drive conversions.',
        whatToCreate: 'Build a custom WordPress site with hero section, features, social proof, and clear CTA.',
        deliverables: ['Custom WordPress theme', 'Responsive mobile version', 'SEO-optimised HTML', 'Performance report', 'Handoff documentation'],
        timeline: '2 weeks',
        howToPresent: 'Show live site, design process, and performance scores.',
      },
      portfolioCopyTemplate: {
        headline: 'I help businesses launch professional WordPress websites with clean structure and performance-first development.',
        shortIntro: 'I build custom WordPress sites that communicate value, load fast, and convert visitors.',
        caseStudyIntro: 'Here is a sample project showing how I built a professional WordPress site focused on performance and clarity.',
        processSection: 'I plan site structure, build a custom theme with performance optimisation, and deliver a responsive, SEO-optimised site.',
        cta: 'Send me your website and I will suggest 3 specific improvements.',
      },
      recommendedSources: [],
      criteria: [],
      prospectTypes: [],
      searchQueries: [],
      sampleProspects: [],
      forbiddenTerms: [],
    },
    design: {
      tools: ['Figma', 'Protopie', 'Miro', 'Storybook'],
      deliverables: [],
      caseStudyTemplate: {
        problem: 'Many products have useful features, but users struggle because the interface is confusing.',
        process: 'I reviewed the interface, identified friction points, redesigned key screens, and delivered developer-ready handoff files.',
        result: 'A redesigned interface that is easier to navigate and reduces user friction.',
        tools: 'Figma, Protopie, Miro, Storybook',
        cta: 'Send me your current UI and I will suggest 3 improvements.',
      },
      sampleProjectTemplate: {
        projectName: 'UI Redesign Concept',
        goal: 'Show how an interface can be redesigned for clarity and better engagement.',
        whatToCreate: 'Design 3 key views with improved hierarchy, consistent components, and interactive prototype.',
        deliverables: ['Redesigned screens', 'Interactive prototype', 'Design system components', 'Before/after comparison', 'Design rationale'],
        timeline: '3 weeks',
        howToPresent: 'Show original, redesign decisions, screens, and prototype link.',
      },
      portfolioCopyTemplate: {
        headline: 'I help product teams design clearer interfaces that make products easier to use.',
        shortIntro: 'I design user-friendly interfaces that reduce friction and improve engagement.',
        caseStudyIntro: 'Here is a sample project showing how I redesigned an interface for better clarity and usability.',
        processSection: 'I review the interface, identify issues, redesign screens, build component systems, and deliver handoff files.',
        cta: 'Send me your current UI and I will suggest 3 improvements.',
      },
      recommendedSources: [],
      criteria: [],
      prospectTypes: [],
      searchQueries: [],
      sampleProspects: [],
      forbiddenTerms: [],
    },
  };
  return defaults[cat];
}

function getAudienceLabelFromNicheKey(nicheKey: string): string {
  const labels: Record<string, string> = {
    gaming: 'gaming creators',
    educational: 'educational creators',
    podcast: 'podcasters',
    ai_startups: 'AI startups',
    local_business: 'local businesses',
    marketing_agencies: 'marketing agencies',
    saas: 'SaaS teams',
    product_startups: 'product startups',
    design_agencies: 'design agencies',
    creators: 'creators',
  };
  return labels[nicheKey] || nicheKey.replace(/_/g, ' ');
}

function getOfferLabel(serviceId: string): string {
  const labels: Record<string, string> = {
    short_form_clips: 'Short-Form Clip Editing',
    long_form_content: 'Long-Format Content Editing',
    podcast_post_production: 'Podcast Post-Production',
    custom_theme_development: 'Custom Theme Development',
    plugin_integration_dev: 'Plugin & Integration Development',
    site_migration_performance: 'Site Migration & Performance',
    product_ui_design: 'Product UI Design',
    brand_identity_visual_systems: 'Brand Identity & Visual Systems',
    ux_research_conversion_audits: 'UX Research & Conversion Audits',
  };
  return labels[serviceId] || serviceId.replace(/_/g, ' ');
}
