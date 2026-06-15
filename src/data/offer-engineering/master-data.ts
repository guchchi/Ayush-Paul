import type { ScopeLimits } from '../../types/offer-engineering';

/* ───────────────────────────────────────────────
 *  Master dataset types
 * ─────────────────────────────────────────────── */

export interface MasterDeliverable {
  id: string;
  label: string;
  description: string;
}

export interface MasterValueAmplifier {
  id: string;
  label: string;
  description: string;
}

export interface ServiceEngineeringData {
  label: string;
  offerTypes: string[];
  deliverables: MasterDeliverable[];
  uniqueMechanisms: string[];
  nicheMechanisms?: Record<string, string[]>;
  nicheDeliverables?: Record<string, string[]>;
  scopeLimitsDefaults: ScopeLimits;
  valueAmplifiers: MasterValueAmplifier[];
  pricingModels: string[];
}

export type ServiceEngineeringMap = Record<string, ServiceEngineeringData>;

/* ───────────────────────────────────────────────
 *  Shared value amplifiers (used across services)
 * ─────────────────────────────────────────────── */

const SHARED_AMPLIFIERS: MasterValueAmplifier[] = [
  {
    id: 'priority_support',
    label: 'Priority Support',
    description: 'Your projects skip the queue and get expedited delivery',
  },
  {
    id: 'strategy_call',
    label: 'Strategy Call',
    description: 'Monthly 30-min strategy session to align on goals and direction',
  },
  {
    id: 'bonus_revision',
    label: 'Bonus Revision',
    description: 'An extra revision round beyond the standard limit',
  },
  {
    id: 'audit_report',
    label: 'Audit Report',
    description: 'Detailed performance audit with actionable recommendations',
  },
  {
    id: 'implementation_guide',
    label: 'Implementation Guide',
    description: 'Step-by-step guide to implement and maintain deliverables',
  },
  {
    id: 'source_files',
    label: 'Source Files',
    description: 'Full source and project files included with every delivery',
  },
  {
    id: 'analytics_review',
    label: 'Analytics Review',
    description: 'Monthly analytics review to track performance and optimise',
  },
  {
    id: 'express_turnaround',
    label: 'Express Turnaround',
    description: 'Rush delivery at no extra cost when you need it fast',
  },
  {
    id: 'template_pack',
    label: 'Template Pack',
    description: 'Reusable templates for future projects and scaling',
  },
  {
    id: 'extended_support',
    label: 'Extended Support',
    description: 'Extended post-delivery support window beyond standard terms',
  },
];

/* ───────────────────────────────────────────────
 *  Master data
 * ─────────────────────────────────────────────── */

export const OFFER_ENGINEERING_MASTER_DATA: ServiceEngineeringMap = {

  /* ── Video Editor: Short-Form Social Clip Editing ── */
  short_form_clips: {
    label: 'Short-Form Social Clip Editing',
    offerTypes: ['retainer', 'one_time_project', 'milestone_based'],
    deliverables: [
      {
        id: 'short_form_videos',
        label: 'Short-Form Videos',
        description: 'Polished vertical/square clips optimised for TikTok, Reels, and Shorts',
      },
      {
        id: 'caption_hashtag_package',
        label: 'Caption & Hashtag Package',
        description: 'SEO-optimised captions and hashtag sets per video',
      },
      {
        id: 'thumbnail_set',
        label: 'Thumbnail Set',
        description: 'Custom thumbnails designed to maximise click-through rate',
      },
      {
        id: 'trend_analysis',
        label: 'Trend Analysis Report',
        description: 'Weekly analysis of trending sounds, formats, and hooks in your niche',
      },
      {
        id: 'audio_cleanup',
        label: 'Audio Cleanup & Mixing',
        description: 'Noise reduction, levelling, and beat-sync for every clip',
      },
    ],
    uniqueMechanisms: [
      'Retention Growth System',
      'Scroll-Stopping Hook Framework',
      'Algorithm-Aligned Editing Method',
      'Attention Curve Optimisation Process',
    ],
    nicheMechanisms: {
      gaming: [
        'Gaming Clip Retention System',
        'Stream-to-Shorts Growth Engine',
        'Viral Moment Extraction Framework',
        'Creator Attention Loop System',
        'Highlight-to-Hook Editing Framework',
      ],
      educational: [
        'Edutainment Retention System',
        'Lesson-to-Clip Distillation Method',
        'Knowledge Hook Framework',
        'Course Teaser Optimisation System',
      ],
      podcast: [
        'Podcast Clip Velocity System',
        'Moment-to-Short Extraction Framework',
        'Audio Visual Hook Optimiser',
        'Guest Highlight Automation',
      ],
      fitness_coaches: [
        'Transformation Story Hook System',
        'Workout-to-Short Extraction Method',
        'Client Results Showcase Framework',
        'Booking Funnel Clip Engine',
      ],
      youtubers_retention: [
        'Retention Curve Clip Framework',
        'Long-to-Short Pacing Method',
        'Hook-First Extraction System',
        'Channel Growth Clip Engine',
      ],
      gaming_youtubers: [
        'Viral Moment Extraction Framework',
        'Stream Highlight Velocity System',
        'Gameplay Hook Optimisation Method',
        'Clip-to-Short Publishing Engine',
      ],
      podcasters: [
        'Podcast Clip Velocity System',
        'Moment-to-Short Extraction Framework',
        'Audio Visual Hook Optimiser',
        'Guest Highlight Automation',
      ],
      real_estate_agents: [
        'Property Story Clip System',
        'Tour-to-Short Extraction Method',
        'Market Authority Hook Framework',
        'Listing Velocity Clip Engine',
      ],
      course_creators: [
        'Lesson-to-Clip Distillation Method',
        'Knowledge Hook Framework',
        'Course Teaser Optimisation System',
        'Enrolment Funnel Clip Engine',
      ],
    },
    nicheDeliverables: {
      fitness_coaches: [
        'Workout Highlight Reel',
        'Transformation Before/After Clip',
        'Client Testimonial Short',
        'Booking Funnel Promo Clip',
      ],
      youtubers_retention: [
        'Retention-Optimised Highlight Reel',
        'Hook Analysis & Thumbnail Set',
        'Channel Growth Preview Clip',
      ],
      gaming_youtubers: [
        'Gameplay Highlight Compilation',
        'Stream Moment Extraction Pack',
        'Reaction Clip & Meme Edit',
      ],
      podcasters: [
        'Interview Moment Clip Pack',
        'Audiogram & Caption Set',
        'Guest Highlight Reel',
        'Episode Teaser Short',
      ],
      real_estate_agents: [
        'Property Tour Highlight Reel',
        'Client Testimonial Short',
        'Listing Teaser for Social',
        'Market Update Vertical Video',
      ],
      course_creators: [
        'Lesson Highlight Repurpose Pack',
        'Course Teaser Short-Form Clip',
        'Teaching Hook Demo Video',
      ],
    },
    scopeLimitsDefaults: {
      revisionCount: 3,
      communicationMethod: 'Async via Slack',
      responseTime: 'Within 24 hours',
      deliveryTime: '48 hours per batch',
      includedRounds: 2,
    },
    valueAmplifiers: [
      SHARED_AMPLIFIERS[0], // priority_support
      SHARED_AMPLIFIERS[4], // implementation_guide
      SHARED_AMPLIFIERS[5], // source_files
      SHARED_AMPLIFIERS[7], // express_turnaround
      {
        id: 'trend_analysis_call',
        label: 'Trend Analysis Call',
        description: 'Monthly 30-min call reviewing what is working and what to tweak',
      },
    ],
    pricingModels: ['flat_rate', 'tiered', 'value_based'],
  },

  /* ── Video Editor: Long-Format Content Editing ── */
  long_form_content: {
    label: 'Long-Format Content Editing',
    offerTypes: ['one_time_project', 'milestone_based'],
    deliverables: [
      {
        id: 'fully_edited_video',
        label: 'Fully Edited Video',
        description: 'Complete edit for 10–60 minute runtime with pacing and flow optimisation',
      },
      {
        id: 'chapter_timestamps',
        label: 'Chapter Timestamps & SEO Description',
        description: 'Timestamps, keywords, and description optimised for search discovery',
      },
      {
        id: 'custom_thumbnail',
        label: 'Custom Thumbnail Design',
        description: 'Two thumbnail concepts with A/B testing recommendations',
      },
      {
        id: 'audio_mastering',
        label: 'Audio Master & Sound Design',
        description: 'Professional audio levelling, noise reduction, and ambient sound design',
      },
      {
        id: 'end_screen_annotations',
        label: 'End Screen & Card Annotations',
        description: 'Strategic end-screen elements and info cards to boost retention',
      },
    ],
    uniqueMechanisms: [
      'Retention Curve Optimisation Process',
      'Pacing Flow Method',
      'Story Arc Engineering System',
      'Viewer Attention Architecture',
    ],
    nicheMechanisms: {
      fitness_coaches: [
        'Client Journey Story Arc Method',
        'Transformation Pacing System',
        'Authority Retention Framework',
        'Testimonial Highlight Engine',
      ],
      youtubers_retention: [
        'Retention Curve Optimisation Process',
        'Pacing Flow Method',
        'Story Arc Engineering System',
        'Viewer Attention Architecture',
      ],
      gaming_youtubers: [
        'Gameplay Narrative Arc Method',
        'Moment-to-Story Pacing System',
        'Viewer Retention Hook Framework',
      ],
      podcasters: [
        'Interview Story Arc Method',
        'Conversation Pacing Framework',
        'Guest Highlight Narrative System',
      ],
      real_estate_agents: [
        'Property Story Arc Method',
        'Client Journey Pacing System',
        'Market Authority Narrative Framework',
      ],
      course_creators: [
        'Educational Story Arc Method',
        'Lesson Pacing Flow System',
        'Knowledge Retention Framework',
      ],
    },
    nicheDeliverables: {
      fitness_coaches: [
        'Client Transformation Story Video',
        'Workout Tutorial Full Edit',
        'Testimonial Interview Edit',
      ],
      youtubers_retention: [
        'Fully Edited YouTube Video',
        'Retention Graph Optimisation Report',
        'Chapter Timestamps & SEO Description',
      ],
      gaming_youtubers: [
        'Gameplay Commentary Full Edit',
        'Stream Highlight Compilation',
        'Viewer Retention Optimised Cut',
      ],
      podcasters: [
        'Interview Edit with Visual Context',
        'Audio Mastered Podcast Episode',
        'Social Snippet Pack',
      ],
      real_estate_agents: [
        'Property Walkthrough Full Edit',
        'Client Testimonial Video',
        'Neighbourhood Feature Story',
      ],
      course_creators: [
        'Course Lesson Full Edit',
        'Tutorial with Chapter Markers',
        'Educational Content SEO Pack',
      ],
    },
    scopeLimitsDefaults: {
      revisionCount: 2,
      communicationMethod: 'Async via Slack / Email',
      responseTime: 'Within 24 hours',
      deliveryTime: '14 days per video',
      includedRounds: 2,
    },
    valueAmplifiers: [
      SHARED_AMPLIFIERS[0], // priority_support
      SHARED_AMPLIFIERS[6], // analytics_review
      SHARED_AMPLIFIERS[2], // bonus_revision
      SHARED_AMPLIFIERS[5], // source_files
      {
        id: 'seo_optimisation',
        label: 'SEO Optimisation Pack',
        description: 'Advanced keyword research and tagging strategy for maximum reach',
      },
    ],
    pricingModels: ['flat_rate', 'value_based'],
  },

  /* ── Video Editor: Podcast Post-Production ── */
  podcast_post_production: {
    label: 'Podcast Post-Production',
    offerTypes: ['retainer', 'one_time_project'],
    deliverables: [
      {
        id: 'audio_cleanup_episode',
        label: 'Full Episode Audio Cleanup',
        description: 'Noise reduction, levelling, compression, and final mix',
      },
      {
        id: 'show_notes',
        label: 'SEO Show Notes',
        description: 'Keyword-optimised show notes with timestamps and resources',
      },
      {
        id: 'audiogram_clips',
        label: 'Audiogram Clips',
        description: 'Three platform-optimised audiogram clips for social promotion',
      },
      {
        id: 'chapter_markers',
        label: 'Episode Chapter Markers',
        description: 'Timestamps and chapter titles for easy navigation',
      },
      {
        id: 'social_snippets',
        label: 'Social Media Snippet Pack',
        description: 'Five short clips repurposed for Instagram, LinkedIn, and Twitter',
      },
    ],
    uniqueMechanisms: [
      'Audio Perfection Protocol',
      'Clip Velocity System',
      'Listener Retention Framework',
      'Multi-Platform Repurposing Engine',
    ],
    nicheMechanisms: {
      fitness_coaches: [
        'Fitness Authority Clip System',
        'Coach Interview Highlight Engine',
        'Transformation Audio Story Method',
      ],
      youtubers_retention: [
        'Creator Interview Clip System',
        'Long-Format Audio Repurpose Engine',
        'Cross-Platform Content Velocity Method',
      ],
      gaming_youtubers: [
        'Gaming Commentary Clip System',
        'Stream Audio Highlight Engine',
        'Multi-Platform Gaming Repurpose Method',
      ],
      podcasters: [
        'Audio Perfection Protocol',
        'Clip Velocity System',
        'Listener Retention Framework',
        'Multi-Platform Repurposing Engine',
      ],
      real_estate_agents: [
        'Real Estate Audio Brand System',
        'Client Interview Highlight Engine',
        'Market Update Clip Velocity Method',
      ],
      course_creators: [
        'Educational Audio Clip System',
        'Course Content Repurpose Engine',
        'Listener-to-Student Conversion Method',
      ],
    },
    nicheDeliverables: {
      fitness_coaches: [
        'Podcast Episode Audio Cleanup',
        'Coach Interview Audiogram Pack',
        'Social Snippet Reel',
      ],
      youtubers_retention: [
        'Creator Interview Audio Master',
        'Show Notes with Timestamps',
        'Cross-Platform Snippet Pack',
      ],
      gaming_youtubers: [
        'Gaming Commentary Audio Mix',
        'Stream Highlight Audiograms',
        'Social Media Snippet Reel',
      ],
      podcasters: [
        'Full Episode Audio Cleanup',
        'Audiogram Clip Set',
        'SEO Show Notes',
        'Social Snippet Pack',
      ],
      real_estate_agents: [
        'Real Estate Podcast Audio Polish',
        'Market Update Audiogram Series',
        'Client Story Snippet Pack',
      ],
      course_creators: [
        'Educational Episode Audio Master',
        'Lesson Teaser Audiograms',
        'Course Promo Snippet Pack',
      ],
    },
    scopeLimitsDefaults: {
      revisionCount: 2,
      communicationMethod: 'Async via Slack / Email',
      responseTime: 'Within 12 hours',
      deliveryTime: '48 hours per episode',
      includedRounds: 2,
    },
    valueAmplifiers: [
      SHARED_AMPLIFIERS[0], // priority_support
      SHARED_AMPLIFIERS[7], // express_turnaround
      SHARED_AMPLIFIERS[2], // bonus_revision
      {
        id: 'transcription_service',
        label: 'Transcription Service',
        description: 'Full episode transcript included for accessibility and SEO',
      },
    ],
    pricingModels: ['flat_rate', 'tiered'],
  },

  /* ── WordPress Dev: Custom Theme Development ── */
  custom_theme_development: {
    label: 'Custom Theme Development',
    offerTypes: ['one_time_project', 'milestone_based'],
    deliverables: [
      {
        id: 'custom_wp_theme',
        label: 'Custom WordPress Theme',
        description: 'Theme built from scratch following WordPress coding standards',
      },
      {
        id: 'responsive_layout',
        label: 'Responsive Mobile Layout',
        description: 'Fully responsive design optimised for all device sizes',
      },
      {
        id: 'seo_html',
        label: 'SEO-Optimised Semantic HTML',
        description: 'Clean, semantic markup structured for search engine visibility',
      },
      {
        id: 'theme_documentation',
        label: 'Theme Documentation & Style Guide',
        description: 'Comprehensive documentation and visual style reference',
      },
      {
        id: 'handoff_session',
        label: '1-Hour Walkthrough & Handoff Session',
        description: 'Live walkthrough covering setup, customisation, and maintenance',
      },
    ],
    uniqueMechanisms: [
      'Performance-First Build System',
      'Design Fidelity Guarantee Process',
      'Component-Based Theme Architecture',
      '72 Hour Business Launch System',
    ],
    nicheMechanisms: {
      restaurants: [
        'Menu-First Site Architecture',
        'Local SEO Visibility System',
        'Online Ordering Integration Framework',
        'Hunger-Driven Conversion Design',
      ],
      local_business_owners: [
        'Local Lead Generation System',
        'Service-First Site Architecture',
        'Mobile-Footfall Conversion Framework',
        'Google Business Sync Method',
      ],
      coaches: [
        'Authority Site Architecture System',
        'Booking Funnel Integration Method',
        'Client Results Showcase Framework',
        'Content-to-Conversion Site Design',
      ],
      course_creators: [
        'Course-First Site Architecture',
        'Enrolment Funnel Integration System',
        'Content Showcase Theme Method',
        'Student Conversion Page Framework',
      ],
      marketing_agencies: [
        'Portfolio-First Site Architecture',
        'Agency Lead Generation System',
        'Case Study Showcase Framework',
        'Client Acquisition Funnel Design',
      ],
      fashion_brands: [
        'Visual-First Site Architecture',
        'Product Showcase Theme System',
        'Brand Story Integration Framework',
        'Mobile Shopping Conversion Design',
      ],
    },
    nicheDeliverables: {
      restaurants: [
        'Menu-Optimised WordPress Theme',
        'Online Ordering Integration',
        'Local SEO Content Structure',
        'Mobile-First Responsive Layout',
      ],
      local_business_owners: [
        'Service-Focused WordPress Theme',
        'Local SEO Optimised Pages',
        'Contact Form & Booking Integration',
        'Google Business Profile Sync',
      ],
      coaches: [
        'Authority WordPress Theme',
        'Booking & Calendar Integration',
        'Client Results Page Template',
        'Content Marketing Layout',
      ],
      course_creators: [
        'Course-Focused WordPress Theme',
        'Enrolment Funnel Page',
        'Content Showcase Layout',
      ],
      marketing_agencies: [
        'Portfolio WordPress Theme',
        'Case Study Page Template',
        'Lead Capture Integration',
        'Client Results Showcase Layout',
      ],
      fashion_brands: [
        'Visual-First WordPress Theme',
        'Product Gallery Layout',
        'Brand Story Integration',
      ],
    },
    scopeLimitsDefaults: {
      revisionCount: 2,
      communicationMethod: 'Async via Slack + Weekly Call',
      responseTime: 'Within 24 hours',
      deliveryTime: '3 weeks',
      includedRounds: 2,
    },
    valueAmplifiers: [
      SHARED_AMPLIFIERS[0], // priority_support
      SHARED_AMPLIFIERS[1], // strategy_call
      SHARED_AMPLIFIERS[9], // extended_support
      SHARED_AMPLIFIERS[4], // implementation_guide
      {
        id: 'staging_site',
        label: 'Staging Site Setup',
        description: 'Private staging environment for development and client review',
      },
    ],
    pricingModels: ['flat_rate', 'value_based'],
  },

  /* ── WordPress Dev: Plugin & Integration Development ── */
  plugin_integration_dev: {
    label: 'Plugin & Integration Development',
    offerTypes: ['one_time_project', 'milestone_based'],
    deliverables: [
      {
        id: 'custom_plugin',
        label: 'Custom WordPress Plugin',
        description: 'Plugin built to your exact specifications with clean, documented code',
      },
      {
        id: 'api_connector',
        label: 'API Integration Connector',
        description: 'Seamless connection between WordPress and your third-party tools',
      },
      {
        id: 'db_schema_migration',
        label: 'Database Schema & Migration Scripts',
        description: 'Database structure design and automated migration scripts',
      },
      {
        id: 'plugin_documentation',
        label: 'Plugin Documentation & Usage Guide',
        description: 'Developer and admin documentation for ongoing maintenance',
      },
      {
        id: 'setup_support',
        label: '30-Min Setup Support Call',
        description: 'Live support call to ensure smooth deployment and configuration',
      },
    ],
    uniqueMechanisms: [
      'Zero-Bloat Coding Standard',
      'API-First Integration Architecture',
      'Extendable Plugin Scaffold Framework',
      'Conversion Website Framework',
    ],
    nicheMechanisms: {
      restaurants: [
        'Restaurant Tech Stack Integration System',
        'Menu-to-Platform Sync Framework',
        'Ordering API Connector Method',
      ],
      local_business_owners: [
        'Local Business Automation System',
        'Service Platform Integration Framework',
        'Booking & CRM Sync Method',
      ],
      coaches: [
        'Coach Tech Stack Integration System',
        'Calendar & Payment API Connector',
        'Client Management Sync Framework',
      ],
      course_creators: [
        'LMS Integration Framework',
        'Payment Gateway Connector System',
        'Student Management Sync Method',
      ],
      marketing_agencies: [
        'Marketing Tool Integration System',
        'CRM & Analytics Connector Framework',
        'Campaign Automation Sync Method',
        'Multi-Platform Data Integration Engine',
      ],
      fashion_brands: [
        'E-Commerce Integration System',
        'Inventory & Order Sync Framework',
        'Product Data API Connector Method',
      ],
    },
    nicheDeliverables: {
      restaurants: [
        'Online Ordering Plugin',
        'Menu Management Integration',
        'POS System API Connector',
      ],
      local_business_owners: [
        'Booking System Plugin',
        'CRM Integration Module',
        'Service Platform API Connector',
      ],
      coaches: [
        'Calendar & Payment Integration Plugin',
        'Client Portal Module',
        'Email Marketing API Connector',
      ],
      course_creators: [
        'LMS Integration Plugin',
        'Payment Gateway Connector',
        'Student Data Sync Module',
      ],
      marketing_agencies: [
        'Marketing Tool Integration Plugin',
        'CRM & Analytics Connector',
        'Multi-Platform Data Sync Module',
        'Campaign Automation Gateway',
      ],
      fashion_brands: [
        'E-Commerce Integration Plugin',
        'Inventory Sync API Module',
        'Product Data Connector',
      ],
    },
    scopeLimitsDefaults: {
      revisionCount: 2,
      communicationMethod: 'Async via Slack + Weekly Call',
      responseTime: 'Within 24 hours',
      deliveryTime: '2 weeks',
      includedRounds: 2,
    },
    valueAmplifiers: [
      SHARED_AMPLIFIERS[0], // priority_support
      SHARED_AMPLIFIERS[9], // extended_support
      SHARED_AMPLIFIERS[3], // audit_report
      SHARED_AMPLIFIERS[4], // implementation_guide
    ],
    pricingModels: ['flat_rate', 'value_based'],
  },

  /* ── WordPress Dev: Site Migration & Performance ── */
  site_migration_performance: {
    label: 'Site Migration & Performance',
    offerTypes: ['one_time_project'],
    deliverables: [
      {
        id: 'full_site_migration',
        label: 'Full Site Migration',
        description: 'Complete migration of theme, plugins, media, and database',
      },
      {
        id: 'dns_cutover',
        label: 'DNS Cut-Over Plan & Execution',
        description: 'Staged DNS transition plan with zero-downtime execution',
      },
      {
        id: 'performance_audit',
        label: 'Performance Audit Report',
        description: 'Before-and-after audit with Lighthouse, WebPageTest, and Query Monitor',
      },
      {
        id: 'post_migration_monitoring',
        label: 'Post-Migration Monitoring',
        description: '7-day monitoring window to catch and resolve any issues',
      },
      {
        id: 'seo_preservation',
        label: 'SEO Preservation Check & Redirect Map',
        description: 'Full redirect map and URL verification to preserve search rankings',
      },
    ],
    uniqueMechanisms: [
      'Zero-Downtime Migration Protocol',
      'Performance Optimisation System',
      'SEO-First Migration Sequence',
      'Conversion Website Framework',
    ],
    nicheMechanisms: {
      restaurants: [
        'Restaurant Migration Protocol',
        'Menu SEO Preservation System',
        'Local Search Recovery Method',
      ],
      local_business_owners: [
        'Local Business Zero-Downtime Migration',
        'Local SEO Equity Preservation System',
        'Service Page Migration Protocol',
      ],
      coaches: [
        'Coach Site Migration Protocol',
        'Booking Funnel Preservation System',
        'Authority Content Migration Method',
      ],
      course_creators: [
        'Course Platform Migration System',
        'Enrolment Funnel Preservation Method',
        'Content SEO Migration Protocol',
      ],
      marketing_agencies: [
        'Agency Site Migration Protocol',
        'Portfolio SEO Preservation System',
        'Client Lead Funnel Migration Method',
      ],
      fashion_brands: [
        'E-Commerce Migration Protocol',
        'Product SEO Preservation System',
        'Shopping Experience Migration Method',
      ],
    },
    nicheDeliverables: {
      restaurants: [
        'Full Site Migration with Menu Preservation',
        'Local SEO Redirect Map',
        'Performance Optimisation Audit',
      ],
      local_business_owners: [
        'Full Site Migration with Local SEO',
        'Zero-Downtime DNS Cut-Over',
        'Service Page Redirect Map',
      ],
      coaches: [
        'Full Site Migration with Content Preservation',
        'Booking Funnel Verification',
        'Authority SEO Redirect Map',
      ],
      course_creators: [
        'LMS Platform Migration',
        'Course URL Redirect Map',
        'Enrolment Funnel Verification',
      ],
      marketing_agencies: [
        'Full Agency Site Migration',
        'Portfolio SEO Redirect Map',
        'Lead Capture Funnel Verification',
      ],
      fashion_brands: [
        'Full E-Commerce Site Migration',
        'Product URL Redirect Map',
        'Shopping Experience Performance Audit',
      ],
    },
    scopeLimitsDefaults: {
      revisionCount: 1,
      communicationMethod: 'Async via Slack + Daily Standup',
      responseTime: 'Within 4 hours',
      deliveryTime: '1 week',
      includedRounds: 1,
    },
    valueAmplifiers: [
      SHARED_AMPLIFIERS[0], // priority_support
      SHARED_AMPLIFIERS[9], // extended_support
      SHARED_AMPLIFIERS[3], // audit_report
      {
        id: 'cdn_setup',
        label: 'CDN Configuration',
        description: 'Content delivery network setup for global performance optimisation',
      },
    ],
    pricingModels: ['flat_rate'],
  },

  /* ── UI/UX Designer: Product UI Design ── */
  product_ui_design: {
    label: 'Product UI Design',
    offerTypes: ['one_time_project', 'milestone_based'],
    deliverables: [
      {
        id: 'ui_screen_set',
        label: 'Complete UI Screen Set',
        description: 'Up to 12 high-fidelity screens covering the core user flow',
      },
      {
        id: 'interactive_prototype',
        label: 'Interactive Prototype',
        description: 'Clickable Figma prototype with micro-interactions and transitions',
      },
      {
        id: 'design_system',
        label: 'Component Design System',
        description: 'Style guide with design tokens, components, and usage patterns',
      },
      {
        id: 'developer_handoff',
        label: 'Developer Handoff Assets',
        description: 'Exports, specs, annotations, and code-ready design tokens',
      },
      {
        id: 'revision_round',
        label: '1 Revision Round',
        description: 'One structured revision round with documented feedback process',
      },
    ],
    uniqueMechanisms: [
      'Component-First Design System',
      'Velocity Design Process',
      'Developer-Ready Handoff Protocol',
      'User First Design System',
      'Conversion Focused Interface Framework',
    ],
    nicheMechanisms: {
      fitness_coaches: [
        'Coach Dashboard Clarity System',
        'Booking Flow Conversion Design',
        'Client Progress Interface Method',
      ],
      saas_startups: [
        'SaaS Activation Flow Design System',
        'Data Dashboard Clarity Framework',
        'Onboarding Funnel Optimisation Method',
        'User Retention Interface Architecture',
      ],
      course_creators: [
        'Course Platform Interface System',
        'Student Progress Dashboard Method',
        'Enrolment Funnel UX Framework',
      ],
      coaches: [
        'Coach Platform Interface System',
        'Client Portal UX Method',
        'Booking & Payment Flow Design',
      ],
      personal_brand_creators: [
        'Creator Dashboard Interface System',
        'Content Management UX Method',
        'Audience Growth Interface Framework',
      ],
      marketing_agencies: [
        'Agency Dashboard Interface System',
        'Client Reporting UX Framework',
        'Campaign Management Design Method',
      ],
    },
    nicheDeliverables: {
      fitness_coaches: [
        'Coach Dashboard UI Design',
        'Booking Flow Wireframes',
        'Client Progress Screen Set',
      ],
      saas_startups: [
        'SaaS Dashboard Screen Set',
        'Onboarding Flow Prototype',
        'Design System Components',
        'Developer Handoff Assets',
      ],
      course_creators: [
        'Course Player Interface Design',
        'Student Dashboard Wireframes',
        'Enrolment Flow Prototype',
      ],
      coaches: [
        'Coach Portal UI Design',
        'Client Management Screen Set',
        'Booking & Payment Flow Design',
      ],
      personal_brand_creators: [
        'Creator Dashboard Design',
        'Content Management Interface',
        'Audience Analytics Screen Set',
      ],
      marketing_agencies: [
        'Agency Dashboard UI Design',
        'Client Report Interface',
        'Campaign Manager Screen Set',
      ],
    },
    scopeLimitsDefaults: {
      revisionCount: 2,
      communicationMethod: 'Async via Slack / Figma comments',
      responseTime: 'Within 24 hours',
      deliveryTime: '2 weeks',
      includedRounds: 2,
    },
    valueAmplifiers: [
      SHARED_AMPLIFIERS[0], // priority_support
      SHARED_AMPLIFIERS[1], // strategy_call
      SHARED_AMPLIFIERS[5], // source_files
      SHARED_AMPLIFIERS[8], // template_pack
      {
        id: 'user_testing',
        label: 'User Testing Session',
        description: 'Remote usability testing session with 3–5 target users',
      },
    ],
    pricingModels: ['flat_rate', 'tiered', 'value_based'],
  },

  /* ── UI/UX Designer: Brand Identity & Visual Systems ── */
  brand_identity_visual_systems: {
    label: 'Brand Identity & Visual Systems',
    offerTypes: ['one_time_project', 'milestone_based'],
    deliverables: [
      {
        id: 'brand_package',
        label: 'Full Brand Identity Package',
        description: 'Complete visual identity including logo, colours, and typography',
      },
      {
        id: 'logo_variations',
        label: 'Primary Logo & Variations',
        description: 'Three logo formats: primary, secondary, and icon mark',
      },
      {
        id: 'colour_typography',
        label: 'Colour System & Typography Scale',
        description: 'Comprehensive colour palette and type scale with usage rules',
      },
      {
        id: 'brand_guidelines',
        label: 'Brand Guidelines Document',
        description: 'PDF and Figma guidelines covering all brand application rules',
      },
      {
        id: 'social_kit',
        label: 'Social Media Kit',
        description: 'Profile and cover templates for all major social platforms',
      },
    ],
    uniqueMechanisms: [
      'Cohesive Brand Architecture Method',
      'Platform-First Visual Identity System',
      'Scalable Design Token Framework',
      'Conversion Focused Interface Framework',
    ],
    nicheMechanisms: {
      fitness_coaches: [
        'Fitness Brand Transformation System',
        'Coach Authority Identity Method',
        'Transformation Visual Language Framework',
      ],
      saas_startups: [
        'SaaS Brand Architecture System',
        'Product-First Visual Identity Method',
        'Investor-Ready Brand Framework',
      ],
      course_creators: [
        'Education Brand Identity System',
        'Course Creator Visual Language Method',
        'Student Trust Identity Framework',
      ],
      coaches: [
        'Coach Brand Architecture System',
        'Authority Visual Identity Method',
        'Client Trust Brand Framework',
      ],
      personal_brand_creators: [
        'Personal Brand Identity System',
        'Creator Visual Language Method',
        'Audience Connection Brand Framework',
      ],
      marketing_agencies: [
        'Agency Brand Architecture System',
        'Client-Facing Identity Method',
        'Scalable Agency Brand Framework',
      ],
    },
    nicheDeliverables: {
      fitness_coaches: [
        'Fitness Brand Logo & Variations',
        'Coach Colour & Typography System',
        'Social Media Brand Kit',
        'Brand Guidelines Document',
      ],
      saas_startups: [
        'SaaS Brand Logo & Variations',
        'Product Colour System',
        'Brand Guidelines Document',
        'Investor Deck Brand Kit',
      ],
      course_creators: [
        'Education Brand Logo & Variations',
        'Course Platform Colour System',
        'Brand Guidelines Document',
        'Social Media Brand Kit',
      ],
      coaches: [
        'Coach Brand Logo & Variations',
        'Authority Colour & Typography Scale',
        'Brand Guidelines Document',
        'Client-Facing Brand Kit',
      ],
      personal_brand_creators: [
        'Personal Brand Logo & Variations',
        'Creator Colour System',
        'Brand Guidelines Document',
        'Content Creator Brand Kit',
      ],
      marketing_agencies: [
        'Agency Brand Logo & Variations',
        'Agency Colour & Typography Scale',
        'Brand Guidelines Document',
        'Client Proposal Brand Kit',
      ],
    },
    scopeLimitsDefaults: {
      revisionCount: 3,
      communicationMethod: 'Async via Slack + Weekly Call',
      responseTime: 'Within 48 hours',
      deliveryTime: '3 weeks',
      includedRounds: 3,
    },
    valueAmplifiers: [
      SHARED_AMPLIFIERS[0], // priority_support
      SHARED_AMPLIFIERS[2], // bonus_revision
      SHARED_AMPLIFIERS[8], // template_pack
      {
        id: 'brand_audit',
        label: 'Brand Audit',
        description: 'Audit of existing brand assets with recommendations for improvement',
      },
    ],
    pricingModels: ['flat_rate', 'value_based'],
  },

  /* ── UI/UX Designer: UX Research & Conversion Audits ── */
  ux_research_conversion_audits: {
    label: 'UX Research & Conversion Audits',
    offerTypes: ['one_time_project'],
    deliverables: [
      {
        id: 'usability_audit',
        label: 'Full Usability Audit Report',
        description: 'Heuristic analysis with identified issues and severity ratings',
      },
      {
        id: 'conversion_funnel',
        label: 'Conversion Funnel Analysis',
        description: 'Funnel review with heatmap analysis and drop-off point identification',
      },
      {
        id: 'user_testing_summary',
        label: 'User Testing Session Summary',
        description: 'Recorded session with key findings and user behaviour insights',
      },
      {
        id: 'fix_roadmap',
        label: 'Prioritised Fix Roadmap',
        description: 'Effort-vs-impact prioritised action plan for improvements',
      },
      {
        id: 'executive_deck',
        label: 'Executive Presentation Deck',
        description: 'Findings and recommendations packaged for stakeholder presentation',
      },
    ],
    uniqueMechanisms: [
      'Data-Backed Redesign Framework',
      'Cognitive Load Reduction System',
      'Friction Point Elimination Protocol',
      'Conversion Focused Interface Framework',
    ],
    nicheMechanisms: {
      fitness_coaches: [
        'Coach Site Conversion Audit System',
        'Booking Funnel Friction Protocol',
        'Client Acquisition UX Framework',
      ],
      saas_startups: [
        'SaaS Activation Audit System',
        'Onboarding Friction Elimination Protocol',
        'Conversion Funnel Optimisation Framework',
      ],
      course_creators: [
        'Course Platform UX Audit System',
        'Enrolment Funnel Friction Protocol',
        'Student Retention UX Framework',
      ],
      coaches: [
        'Coach Platform Audit System',
        'Client Journey Friction Protocol',
        'Service Page Conversion Framework',
      ],
      personal_brand_creators: [
        'Creator Site UX Audit System',
        'Audience Engagement Friction Protocol',
        'Content Conversion Framework',
      ],
      marketing_agencies: [
        'Agency Site UX Audit System',
        'Client Lead Funnel Protocol',
        'Portfolio Conversion Framework',
      ],
    },
    nicheDeliverables: {
      fitness_coaches: [
        'Coach Website Usability Audit',
        'Booking Funnel Conversion Analysis',
        'Prioritised Fix Roadmap',
        'Executive Presentation Deck',
      ],
      saas_startups: [
        'SaaS Product Usability Audit',
        'Onboarding Funnel Analysis',
        'User Testing Session Summary',
        'Prioritised Fix Roadmap',
      ],
      course_creators: [
        'Course Platform Usability Audit',
        'Enrolment Funnel Analysis',
        'Student Journey Fix Roadmap',
      ],
      coaches: [
        'Coach Platform Usability Audit',
        'Client Journey Conversion Analysis',
        'Service Page Fix Roadmap',
      ],
      personal_brand_creators: [
        'Creator Site Usability Audit',
        'Audience Engagement Analysis',
        'Content Funnel Fix Roadmap',
      ],
      marketing_agencies: [
        'Agency Site Usability Audit',
        'Client Lead Funnel Analysis',
        'Portfolio Conversion Fix Roadmap',
        'Executive Presentation Deck',
      ],
    },
    scopeLimitsDefaults: {
      revisionCount: 2,
      communicationMethod: 'Async via Email + Presentation Call',
      responseTime: 'Within 48 hours',
      deliveryTime: '10 business days',
      includedRounds: 2,
    },
    valueAmplifiers: [
      SHARED_AMPLIFIERS[1], // strategy_call
      SHARED_AMPLIFIERS[3], // audit_report
      SHARED_AMPLIFIERS[4], // implementation_guide
      {
        id: 'follow_up_audit',
        label: 'Follow-Up Audit',
        description: 'Re-audit after fixes are implemented to measure improvement',
      },
    ],
    pricingModels: ['flat_rate', 'value_based'],
  },

  /* ── UI/UX Designer: Landing Page Design ── */
  landing_page_design: {
    label: 'Landing Page Design',
    offerTypes: ['one_time_project', 'milestone_based'],
    deliverables: [
      {
        id: 'hero_section',
        label: 'Hero Section Wireframe',
        description: 'Above-fold hero layout with headline, subhead, and primary CTA optimised for first-impression conversion',
      },
      {
        id: 'conversion_layout',
        label: 'Conversion-Focused Page Layout',
        description: 'Full-page layout structured around the promise-to-proof-to-process-to-CTA conversion arc',
      },
      {
        id: 'offer_section',
        label: 'Offer Breakdown Section',
        description: 'Visual offer presentation with pain-point matching, benefit bullets, and risk reversal elements',
      },
      {
        id: 'social_proof',
        label: 'Social Proof Section',
        description: 'Testimonial placement, case study snippets, trust badges, and social proof hierarchy design',
      },
      {
        id: 'cta_section',
        label: 'Primary & Secondary CTA Sections',
        description: 'Strategically placed CTA blocks with contrast-driven button design and urgency triggers',
      },
      {
        id: 'faq_section',
        label: 'FAQ & Objection-Handling Section',
        description: 'Expandable FAQ accordion designed to pre-empt buying objections and reduce hesitation',
      },
      {
        id: 'mobile_layout',
        label: 'Mobile-First Responsive Layout',
        description: 'Full mobile adaptation with thumb-friendly tap targets, stacked layout, and mobile-specific CTA placement',
      },
      {
        id: 'figma_file',
        label: 'Figma Design File',
        description: 'Editable Figma file with auto-layout components, global colour and type tokens, and reusable section components',
      },
      {
        id: 'copy_structure',
        label: 'Copy Structure & Content Map',
        description: 'Headline frameworks, section-by-section copy guidance, and tone-of-voice recommendations for each page block',
      },
      {
        id: 'developer_handoff',
        label: 'Developer Handoff Notes',
        description: 'Annotated specs with spacing values, breakpoint rules, hover states, animation notes, and export-ready assets',
      },
    ],
    uniqueMechanisms: [
      'Conversion Arc Page Architecture',
      'First-Fold Hook Optimisation System',
      'Trust Stack Layout Method',
      'Objection-Response Design Framework',
    ],
    nicheMechanisms: {
      fitness_coaches: [
        'Fitness Coach Trust Stack Method',
        'Transformation-First Page Structure',
        'Booking Funnel Conversion System',
        'Client Results Showcase Framework',
        'Consultation CTA Velocity Model',
      ],
      saas_startups: [
        'SaaS Landing Page Conversion Arc',
        'Feature-to-Benefit Layout Method',
        'Demo Request Funnel Framework',
        'Investor Trust Stack System',
      ],
      course_creators: [
        'Course Launch Page Conversion Arc',
        'Curriculum Preview Layout Method',
        'Enrolment Funnel Trust Stack',
        'Student Results Showcase Framework',
      ],
      coaches: [
        'Coach Landing Page Conversion Arc',
        'Authority-First Page Structure',
        'Discovery Call Funnel System',
        'Client Results Trust Stack Method',
      ],
      personal_brand_creators: [
        'Creator Landing Page Conversion Arc',
        'Personal Brand Trust Stack Method',
        'Newsletter Signup Funnel Framework',
      ],
      marketing_agencies: [
        'Agency Landing Page Conversion Arc',
        'Portfolio Preview Layout Method',
        'Lead Generation Funnel System',
        'Client Results Trust Stack Framework',
      ],
    },
    nicheDeliverables: {
      fitness_coaches: [
        'Coach Hero Section Wireframe',
        'Transformation-First Page Layout',
        'Booking Funnel Conversion Section',
        'Client Results Social Proof Block',
      ],
      saas_startups: [
        'SaaS Hero Section Wireframe',
        'Feature-to-Benefit Page Layout',
        'Demo Request CTA Section',
        'FAQ & Objection-Handling Section',
      ],
      course_creators: [
        'Course Hero Section Wireframe',
        'Curriculum Preview Layout',
        'Enrolment CTA Section',
        'Student Testimonial Social Proof',
      ],
      coaches: [
        'Coach Hero Section Wireframe',
        'Authority-First Page Layout',
        'Discovery Call CTA Section',
        'Client Results Showcase Block',
      ],
      personal_brand_creators: [
        'Creator Hero Section Wireframe',
        'Personal Brand Page Layout',
        'Newsletter Signup CTA Section',
      ],
      marketing_agencies: [
        'Agency Hero Section Wireframe',
        'Portfolio Preview Page Layout',
        'Lead Generation CTA Section',
        'Client Results Social Proof Block',
      ],
    },
    scopeLimitsDefaults: {
      revisionCount: 2,
      communicationMethod: 'Async via Slack / Figma comments',
      responseTime: 'Within 24 hours',
      deliveryTime: '7 days',
      includedRounds: 2,
    },
    valueAmplifiers: [
      SHARED_AMPLIFIERS[1], // strategy_call
      SHARED_AMPLIFIERS[5], // source_files
      SHARED_AMPLIFIERS[7], // express_turnaround
      SHARED_AMPLIFIERS[8], // template_pack
      {
        id: 'conversion_review',
        label: 'Conversion Review Call',
        description: '30-minute post-delivery review focused on landing page conversion strategy and next-step optimisation ideas',
      },
    ],
    pricingModels: ['flat_rate', 'tiered', 'value_based'],
  },
};

/* ───────────────────────────────────────────────
 *  Helper functions
 * ─────────────────────────────────────────────── */

export function getEngineeringDataForService(
  serviceId: string,
): ServiceEngineeringData | undefined {
  return OFFER_ENGINEERING_MASTER_DATA[serviceId];
}

export function getAllServiceIds(): string[] {
  return Object.keys(OFFER_ENGINEERING_MASTER_DATA);
}

export function getAllValueAmplifiers(): MasterValueAmplifier[] {
  return SHARED_AMPLIFIERS;
}
