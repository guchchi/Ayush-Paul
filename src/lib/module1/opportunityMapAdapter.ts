/**
 * opportunityMapAdapter.ts
 *
 * Converts the new 5-step Module 1 UI output into the full 9-field
 * useOpportunityMapStore payload required by Module 2.
 *
 * 3-layer priority system:
 *   1. Exact niche-level mapping (trackId + marketId + nicheId)
 *   2. Market-level mapping (trackId + marketId)
 *   3. Emergency fallback (first valid service/offer in track)
 *
 * Rule: NEVER auto-select the first available serviceId or offerId.
 * Use the deterministic MODULE1_ADAPTER_MAP for all path-specific IDs.
 * All IDs are validated against MASTER_TRACKS at runtime before use.
 */

import { MASTER_TRACKS } from '../../data/opportunity-map/master-data';
import { OFFER_ENGINEERING_MASTER_DATA } from '../../data/offer-engineering/master-data';
import { ALL_MARKETS, ALL_NICHES } from '../../data/module1/module1-content';

/* ── Types ── */

export type MappingType = 'exact' | 'market' | 'fallback';

export interface AdapterEntry {
  /** Validated serviceId that exists in MASTER_TRACKS */
  serviceId: string;
  /** Validated offerId that exists in MASTER_TRACKS */
  offerId: string;
  /** The WHO in the direction statement formula */
  who: string;
  /** The RESULT in the direction statement formula */
  result: string;
  /** The METHOD in the direction statement formula */
  method: string;
  /** Pre-written statement variations for the Regenerate button */
  statementVariants: string[];
  /** Default score for Phase 1 (not calculated by algorithm yet) */
  opportunityScore: number;
  /** Source marker so the scoring system can identify non-calculated scores later */
  opportunityScoreSource: 'default_phase_1_mapping';
}

export interface MarketAdapterEntry {
  /** Validated serviceId that exists in MASTER_TRACKS */
  serviceId: string;
  /** Validated offerId that exists in MASTER_TRACKS */
  offerId: string;
  /** The WHO in the direction statement formula */
  who: string;
  /** The RESULT in the direction statement formula */
  result: string;
  /** The METHOD in the direction statement formula */
  method: string;
  /** Default score for Phase 1 (not calculated by algorithm yet) */
  opportunityScore: number;
  /** Source marker so the scoring system can identify non-calculated scores later */
  opportunityScoreSource: 'default_phase_1_mapping';
}

type AdapterMap = Record<string, Record<string, Record<string, AdapterEntry>>>;
type MarketAdapterMap = Record<string, Record<string, MarketAdapterEntry>>;

/* ── Deterministic Mapping Tables ── */

/**
 * Exact niche-level mappings (trackId -> marketId -> nicheId).
 * These take highest priority. Only 3 exist -- covers specific
 * niche paths that need custom statementVariants.
 */
export const MODULE1_ADAPTER_MAP: AdapterMap = {
  ui_ux_designer: {
    coaches: {
      fitness_coaches: {
        serviceId: 'landing_page_design',
        offerId: 'fitness_coach_conversion_landing_page',
        who: 'fitness coaches',
        result: 'attract more paying clients',
        method: 'conversion-focused landing page design',
        statementVariants: [
          'I help fitness coaches attract more paying clients using conversion-focused landing page design.',
          'I help fitness coaches turn more visitors into consultation bookings through targeted landing page UX.',
          'I help fitness coaches improve their online trust and lead flow with clear, high-performing page design.',
        ],
        opportunityScore: 85,
        opportunityScoreSource: 'default_phase_1_mapping',
      },
    },
  },

  wordpress_developer: {
    local_businesses: {
      restaurants: {
        serviceId: 'custom_theme_development',
        offerId: 'restaurant_website_booking_package',
        who: 'restaurants',
        result: 'get more local customers',
        method: 'fast, trustworthy WordPress websites',
        statementVariants: [
          'I help restaurants get more local customers using fast, trustworthy WordPress websites.',
          'I help restaurants increase table reservations through a professional, mobile-ready WordPress site.',
          'I help restaurants turn online visitors into real customers with a clean, bookable website.',
        ],
        opportunityScore: 85,
        opportunityScoreSource: 'default_phase_1_mapping',
      },
    },
  },

  video_editor: {
    youtube_creators: {
      youtubers_retention: {
        serviceId: 'long_form_content',
        offerId: 'youtube_retention_editing_package',
        who: 'YouTubers',
        result: 'increase viewer retention',
        method: 'story-driven video editing',
        statementVariants: [
          'I help YouTubers increase viewer retention using story-driven video editing.',
          'I help YouTubers keep more viewers watching until the end through sharp, retention-focused editing.',
          'I help YouTubers grow a loyal audience with dynamic pacing and compelling video storytelling.',
        ],
        opportunityScore: 85,
        opportunityScoreSource: 'default_phase_1_mapping',
      },
    },
  },
};

/**
 * Market-level mappings (trackId -> marketId).
 * Used when no exact niche mapping exists.
 * Covers all 75 market paths across 15 sub-tracks.
 */
export const MARKET_ADAPTER_MAP: MarketAdapterMap = {

  /* ── Editor Track ── */

  video_editor: {
    youtube_creators: {
      serviceId: 'long_form_content',
      offerId: 'youtube_retention_editing_package',
      who: 'YouTube creators and content publishers',
      result: 'grow their audience and increase viewer retention',
      method: 'story-driven, retention-focused video editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    coaches: {
      serviceId: 'long_form_content',
      offerId: 'lecture_edit_chapters',
      who: 'coaches and course creators',
      result: 'build trust and authority through polished educational content',
      method: 'clear, engaging long-form video editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    agencies: {
      serviceId: 'long_form_content',
      offerId: 'full_podcast_episode_edit',
      who: 'marketing and creative agencies',
      result: 'scale their content production without hiring more editors',
      method: 'reliable, consistent long-form video editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    local_businesses: {
      serviceId: 'long_form_content',
      offerId: 'tutorial_post_production',
      who: 'local business owners',
      result: 'attract more customers through professional video content',
      method: 'compelling, trustworthy video editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    personal_brands: {
      serviceId: 'long_form_content',
      offerId: 'youtube_retention_editing_package',
      who: 'personal brand builders',
      result: 'grow their influence with premium, polished video content',
      method: 'consistent, high-quality long-form editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  short_form_editor: {
    creators: {
      serviceId: 'short_form_clips',
      offerId: 'weekly_reel_batch_5',
      who: 'short-form content creators',
      result: 'boost their engagement and grow faster on social media',
      method: 'fast-paced, hook-optimised short-form editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    coaches: {
      serviceId: 'short_form_clips',
      offerId: 'weekly_reel_batch_5',
      who: 'coaches building their online presence',
      result: 'attract more leads through consistent short-form content',
      method: 'punchy, educational short-form video editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    agencies: {
      serviceId: 'short_form_clips',
      offerId: 'weekly_reel_batch_5',
      who: 'social media and marketing agencies',
      result: 'deliver more short-form content for clients at scale',
      method: 'reliable, high-volume short-form editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    local_businesses: {
      serviceId: 'short_form_clips',
      offerId: 'property_tour_reel_24h',
      who: 'local business owners',
      result: 'stand out on social media with professional short-form content',
      method: 'engaging, business-focused short-form editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    personal_brands: {
      serviceId: 'short_form_clips',
      offerId: 'linkedin_tl_edit',
      who: 'personal brand builders',
      result: 'grow their daily reach with consistent short-form content',
      method: 'on-brand, scroll-stopping short-form editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  youtube_editor: {
    youtube_creators: {
      serviceId: 'long_form_content',
      offerId: 'youtube_retention_editing_package',
      who: 'YouTube creators',
      result: 'grow their channel with higher retention and watch time',
      method: 'retention-optimised long-form video editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    course_creators: {
      serviceId: 'long_form_content',
      offerId: 'lecture_edit_chapters',
      who: 'online course creators',
      result: 'improve student engagement and course completion rates',
      method: 'structured, polished educational video editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    podcasters: {
      serviceId: 'long_form_content',
      offerId: 'full_podcast_episode_edit',
      who: 'video podcasters',
      result: 'grow their audience with professional, engaging episodes',
      method: 'dynamic, multi-cam podcast video editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    educators: {
      serviceId: 'long_form_content',
      offerId: 'tutorial_post_production',
      who: 'educators and trainers',
      result: 'deliver clearer, more engaging video lessons',
      method: 'structured, visually enhanced educational editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    personal_brands: {
      serviceId: 'long_form_content',
      offerId: 'youtube_retention_editing_package',
      who: 'personal brand builders on YouTube',
      result: 'build authority and grow subscribers with premium content',
      method: 'consistent, high-retention YouTube editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  podcast_clip_editor: {
    podcasters: {
      serviceId: 'podcast_post_production',
      offerId: 'podcast_full_cleanup_show_notes',
      who: 'podcast hosts',
      result: 'grow their reach by repurposing episodes into engaging clips',
      method: 'professional podcast post-production and clip extraction',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    creators: {
      serviceId: 'podcast_post_production',
      offerId: 'podcast_video_audiogram_package',
      who: 'content creators',
      result: 'turn long-form content into a steady stream of short clips',
      method: 'efficient clip repurposing and audiogram production',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    coaches: {
      serviceId: 'podcast_post_production',
      offerId: 'podcast_full_cleanup_show_notes',
      who: 'coaches and educators',
      result: 'build authority through consistent clip distribution',
      method: 'polished podcast clip editing and show note creation',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    agencies: {
      serviceId: 'podcast_post_production',
      offerId: 'podcast_video_audiogram_package',
      who: 'agencies managing client podcasts',
      result: 'deliver high-quality podcast production at scale',
      method: 'reliable, white-label podcast post-production',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    business_owners: {
      serviceId: 'podcast_post_production',
      offerId: 'narrative_edit_sound_design',
      who: 'business owners appearing on podcasts',
      result: 'build personal authority through professional podcast clips',
      method: 'strategic clip editing and audiogram production',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  ad_creative_editor: {
    ecommerce_brands: {
      serviceId: 'short_form_clips',
      offerId: 'property_tour_reel_24h',
      who: 'ecommerce brands and DTC stores',
      result: 'increase ad conversion rates with high-performing video creatives',
      method: 'conversion-focused, direct-response short-form editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    marketing_agencies: {
      serviceId: 'short_form_clips',
      offerId: 'weekly_reel_batch_5',
      who: 'marketing and performance agencies',
      result: 'scale ad creative production for multiple clients',
      method: 'fast, reliable ad creative video editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    coaches: {
      serviceId: 'short_form_clips',
      offerId: 'weekly_reel_batch_5',
      who: 'coaches running paid ad campaigns',
      result: 'generate more qualified leads through conversion-optimised video ads',
      method: 'direct-response focused ad creative editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    saas_startups: {
      serviceId: 'short_form_clips',
      offerId: 'linkedin_tl_edit',
      who: 'SaaS startups and tech companies',
      result: 'drive more signups with compelling product demo ads',
      method: 'clear, benefit-driven video ad editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    local_businesses: {
      serviceId: 'short_form_clips',
      offerId: 'property_tour_reel_24h',
      who: 'local businesses running local ads',
      result: 'attract more local customers with professional video creatives',
      method: 'conversion-oriented local ad video editing',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  /* ── Developer / WordPress Track ── */

  wordpress_developer: {
    local_businesses: {
      serviceId: 'custom_theme_development',
      offerId: 'five_page_business_theme',
      who: 'local service businesses',
      result: 'attract more customers with a professional online presence',
      method: 'clean, lead-generating WordPress custom theme development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    coaches_consultants: {
      serviceId: 'custom_theme_development',
      offerId: 'five_page_business_theme',
      who: 'coaches and consultants',
      result: 'win more clients with a trustworthy, professional website',
      method: 'conversion-focused WordPress theme development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    startups_saas: {
      serviceId: 'custom_theme_development',
      offerId: 'ecommerce_theme_product_catalog',
      who: 'startups and SaaS companies',
      result: 'launch faster with a polished, scalable website',
      method: 'custom WordPress development with modern UI',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    agencies: {
      serviceId: 'custom_theme_development',
      offerId: 'editorial_theme_authors',
      who: 'digital and creative agencies',
      result: 'scale client website delivery without growing your team',
      method: 'white-label, reliable WordPress theme development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    creators_course_sellers: {
      serviceId: 'custom_theme_development',
      offerId: 'blog_theme_newsletter',
      who: 'creators and course sellers',
      result: 'sell more digital products with a high-converting content site',
      method: 'custom WordPress sites built for audience monetisation',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  landing_page_developer: {
    coaches: {
      serviceId: 'custom_theme_development',
      offerId: 'five_page_business_theme',
      who: 'coaches and consultants',
      result: 'convert more visitors into consultations and sales',
      method: 'high-converting WordPress landing page development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    course_creators: {
      serviceId: 'custom_theme_development',
      offerId: 'blog_theme_newsletter',
      who: 'online course creators',
      result: 'boost enrollment with compelling sales and launch pages',
      method: 'landing page-focused WordPress theme development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    saas_startups: {
      serviceId: 'custom_theme_development',
      offerId: 'ecommerce_theme_product_catalog',
      who: 'SaaS startups and tech companies',
      result: 'drive more signups and demo requests',
      method: 'clean, conversion-optimised landing page development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    local_businesses: {
      serviceId: 'custom_theme_development',
      offerId: 'restaurant_website_booking_package',
      who: 'local businesses and service providers',
      result: 'turn website visitors into paying local customers',
      method: 'local SEO-optimised WordPress landing page development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    agencies: {
      serviceId: 'custom_theme_development',
      offerId: 'editorial_theme_authors',
      who: 'agencies and marketing teams',
      result: 'deliver high-converting landing pages for clients at scale',
      method: 'white-label WordPress landing page development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  no_code_developer: {
    startups: {
      serviceId: 'plugin_integration_dev',
      offerId: 'custom_lms_payment_bridge',
      who: 'early-stage startups',
      result: 'build and launch their MVP faster without a full engineering team',
      method: 'no-code system building using plugin and integration development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    coaches_consultants: {
      serviceId: 'plugin_integration_dev',
      offerId: 'member_only_content_plugin',
      who: 'coaches and consultants',
      result: 'automate their client management and delivery systems',
      method: 'custom plugin and automation development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    creators: {
      serviceId: 'plugin_integration_dev',
      offerId: 'custom_lms_payment_bridge',
      who: 'creators and digital entrepreneurs',
      result: 'automate their content delivery and audience management',
      method: 'no-code tool integration and plugin development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    agencies: {
      serviceId: 'plugin_integration_dev',
      offerId: 'custom_checkout_flow_plugin',
      who: 'agencies and service businesses',
      result: 'streamline internal operations with automated workflows',
      method: 'custom integration and automation plugin development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    local_businesses: {
      serviceId: 'plugin_integration_dev',
      offerId: 'automated_delivery_plugin',
      who: 'local businesses',
      result: 'automate daily operations and reduce manual work',
      method: 'simple, effective no-code system and plugin building',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  frontend_developer: {
    saas_startups: {
      serviceId: 'custom_theme_development',
      offerId: 'ecommerce_theme_product_catalog',
      who: 'SaaS startups and tech companies',
      result: 'ship polished, responsive user interfaces faster',
      method: 'modern, performant frontend development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    agencies: {
      serviceId: 'custom_theme_development',
      offerId: 'editorial_theme_authors',
      who: 'digital agencies',
      result: 'scale frontend delivery across more client projects',
      method: 'reliable, high-quality frontend development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    startups: {
      serviceId: 'custom_theme_development',
      offerId: 'ecommerce_theme_product_catalog',
      who: 'early-stage startups',
      result: 'launch with a modern, responsive website',
      method: 'fast, clean frontend theme development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    creators: {
      serviceId: 'custom_theme_development',
      offerId: 'blog_theme_newsletter',
      who: 'creators and personal brands',
      result: 'stand out with a custom-designed, responsive website',
      method: 'custom frontend development with clean UX',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    local_businesses: {
      serviceId: 'custom_theme_development',
      offerId: 'five_page_business_theme',
      who: 'local businesses',
      result: 'modernise their online presence with a responsive website',
      method: 'performance-optimised frontend development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  automation_developer: {
    agencies: {
      serviceId: 'plugin_integration_dev',
      offerId: 'custom_checkout_flow_plugin',
      who: 'agencies and service businesses',
      result: 'save hours daily with automated workflows and client systems',
      method: 'custom automation and integration development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    coaches_consultants: {
      serviceId: 'plugin_integration_dev',
      offerId: 'member_only_content_plugin',
      who: 'coaches and consultants',
      result: 'automate booking, follow-ups, and client delivery',
      method: 'plugin-based automation and system integration',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    ecommerce_brands: {
      serviceId: 'plugin_integration_dev',
      offerId: 'automated_delivery_plugin',
      who: 'ecommerce brands',
      result: 'automate order processing, inventory, and customer follow-ups',
      method: 'ecommerce automation and plugin integration',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    local_businesses: {
      serviceId: 'plugin_integration_dev',
      offerId: 'automated_delivery_plugin',
      who: 'local businesses',
      result: 'reduce manual work with automated customer and operations systems',
      method: 'simple, practical business automation development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    creators: {
      serviceId: 'plugin_integration_dev',
      offerId: 'custom_lms_payment_bridge',
      who: 'creators and content entrepreneurs',
      result: 'automate audience management and digital product delivery',
      method: 'custom automation and integration development',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  /* ── Designer Track ── */

  ui_ux_designer: {
    coaches: {
      serviceId: 'product_ui_design',
      offerId: 'mvp_ui_kit_5_screens',
      who: 'coaches and course creators',
      result: 'build a professional online presence that builds trust and drives signups',
      method: 'clean, user-focused product UI design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    saas_startups: {
      serviceId: 'product_ui_design',
      offerId: 'dashboard_ui_redesign_3_views',
      who: 'SaaS startups and tech companies',
      result: 'improve user retention with clear, usable product interfaces',
      method: 'data-driven product UI design and design systems',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    creators: {
      serviceId: 'product_ui_design',
      offerId: 'mvp_ui_kit_5_screens',
      who: 'creators and digital entrepreneurs',
      result: 'create a polished brand experience across their digital presence',
      method: 'cohesive, conversion-focused product UI design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    agencies: {
      serviceId: 'product_ui_design',
      offerId: 'investor_deck_prototype',
      who: 'agencies and design studios',
      result: 'deliver more client design projects without scaling the team',
      method: 'professional, scaled product UI design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    local_businesses: {
      serviceId: 'product_ui_design',
      offerId: 'mvp_ui_kit_5_screens',
      who: 'local businesses',
      result: 'build a modern, trustworthy digital presence that attracts customers',
      method: 'clear, customer-focused product UI design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  landing_page_designer: {
    coaches: {
      serviceId: 'landing_page_design',
      offerId: 'fitness_coach_conversion_landing_page',
      who: 'coaches and consultants',
      result: 'convert more traffic into paid consultations and program sales',
      method: 'conversion-focused landing page design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    course_creators: {
      serviceId: 'landing_page_design',
      offerId: 'fitness_coach_conversion_landing_page',
      who: 'online course creators',
      result: 'boost enrollment with high-converting sales and launch pages',
      method: 'persuasive, conversion-optimised landing page design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    saas_startups: {
      serviceId: 'landing_page_design',
      offerId: 'fitness_coach_conversion_landing_page',
      who: 'SaaS startups',
      result: 'drive more demo requests and free trial signups',
      method: 'clean, high-converting landing page design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    local_businesses: {
      serviceId: 'landing_page_design',
      offerId: 'fitness_coach_conversion_landing_page',
      who: 'local businesses',
      result: 'turn website visitors into paying customers',
      method: 'trust-building, local-focused landing page design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    agencies: {
      serviceId: 'landing_page_design',
      offerId: 'fitness_coach_conversion_landing_page',
      who: 'agencies and marketing teams',
      result: 'deliver high-converting landing pages for clients at scale',
      method: 'white-label, conversion-driven landing page design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  brand_designer: {
    creators: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'personal_brand_identity',
      who: 'creators and personal brands',
      result: 'build a recognisable visual identity that attracts their ideal audience',
      method: 'cohesive brand identity and visual system design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    coaches_consultants: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'personal_brand_identity',
      who: 'coaches and consultants',
      result: 'command premium rates with a professional, trustworthy brand identity',
      method: 'strategic brand identity and visual system design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    startups: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'creator_brand_kit_multi_platform',
      who: 'startups and founders',
      result: 'launch with a polished brand that attracts investors and customers',
      method: 'complete brand identity and visual system design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    local_businesses: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'product_packaging_storefront',
      who: 'local businesses',
      result: 'refresh their brand to stand out and attract more local customers',
      method: 'modern brand identity and visual refresh design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    agencies: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'creator_brand_kit_multi_platform',
      who: 'agencies and creative teams',
      result: 'deliver complete brand identity projects for more clients',
      method: 'scalable brand identity system design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  social_media_designer: {
    creators: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'creator_brand_kit_multi_platform',
      who: 'creators and influencers',
      result: 'maintain a consistent, professional look across all social platforms',
      method: 'cohesive social media brand and content design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    coaches: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'personal_brand_identity',
      who: 'coaches building their online authority',
      result: 'build trust and recognition with polished social media visuals',
      method: 'strategic social media design for authority building',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    agencies: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'creator_brand_kit_multi_platform',
      who: 'agencies managing client social accounts',
      result: 'deliver on-brand social graphics at scale for multiple clients',
      method: 'scalable, template-driven social media design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    local_businesses: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'product_packaging_storefront',
      who: 'local businesses',
      result: 'build a professional social presence that attracts local customers',
      method: 'consistent, brand-aligned local social media design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    ecommerce_brands: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'product_packaging_storefront',
      who: 'ecommerce and DTC brands',
      result: 'drive sales with compelling, on-brand social media creatives',
      method: 'conversion-focused social media visual design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },

  presentation_designer: {
    startups: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'creator_brand_kit_multi_platform',
      who: 'startups and founders',
      result: 'raise capital with compelling, professional pitch decks',
      method: 'strategic, storytelling-driven presentation design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    coaches_consultants: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'personal_brand_identity',
      who: 'coaches and consultants',
      result: 'win more clients with polished sales and workshop presentations',
      method: 'professional, trust-building presentation design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    agencies: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'creator_brand_kit_multi_platform',
      who: 'agencies and creative teams',
      result: 'win more pitches with world-class presentation design',
      method: 'high-impact, creative presentation design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    creators: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'creator_brand_kit_multi_platform',
      who: 'creators and educators',
      result: 'engage their audience with compelling webinar and course presentations',
      method: 'clear, engaging educational presentation design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
    business_owners: {
      serviceId: 'brand_identity_visual_systems',
      offerId: 'personal_brand_identity',
      who: 'business owners and executives',
      result: 'communicate effectively with professional stakeholder presentations',
      method: 'clear, executive-level presentation design',
      opportunityScore: 85,
      opportunityScoreSource: 'default_phase_1_mapping',
    },
  },
};

/* ── Statement Variant Builder ── */

function buildStatementVariants(params: {
  who: string;
  result: string;
  method: string;
}): string[] {
  return [
    `I help ${params.who} ${params.result} through ${params.method}.`,
    `I help ${params.who} achieve ${params.result} with expert ${params.method}.`,
    `I help ${params.who} ${params.result} using a proven approach to ${params.method}.`,
  ];
}

/* ── Validation Helpers ── */

/**
 * Validates that a serviceId + offerId combination physically exists
 * somewhere in the MASTER_TRACKS data structure.
 * Returns false if either ID is missing -- caller must show an error.
 */
function validateIdsInTracks(serviceId: string, offerId: string): boolean {
  for (const track of MASTER_TRACKS) {
    for (const service of track.services) {
      if (service.id === serviceId) {
        for (const market of service.markets) {
          for (const niche of market.niches) {
            for (const offer of niche.offers) {
              if (offer.id === offerId) return true;
            }
          }
        }
      }
    }
  }
  return false;
}

/** Resolves the first available serviceId + offerId for a track when no explicit
 *  adapter mapping exists. Used as a safe fallback so the UI never hard-blocks.
 *  Returns `{ serviceId, offerId }` or throws if the track has no services. */
function resolveFallbackIds(trackId: string): { serviceId: string; offerId: string } | null {
  const track = MASTER_TRACKS.find(t => t.id === trackId);
  if (!track || !track.services.length) return null;
  const service = track.services[0];
  for (const market of service.markets) {
    for (const niche of market.niches) {
      if (niche.offers.length) {
        return { serviceId: service.id, offerId: niche.offers[0].id };
      }
    }
  }
  return null;
}

function resolveMarketLabel(trackId: string, marketId: string): string | null {
  // Try MASTER_TRACKS first (works for video_editor, wordpress_developer, ui_ux_designer)
  const track = MASTER_TRACKS.find(t => t.id === trackId);
  if (track) {
    for (const service of track.services) {
      const market = service.markets.find(m => m.id === marketId);
      if (market) return market.label;
    }
  }

  // Fallback to Module 1 content data (covers all 15 sub-tracks)
  const module1Markets = ALL_MARKETS[trackId];
  if (module1Markets) {
    const market = module1Markets.find(m => m.id === marketId);
    if (market) return market.label;
  }

  return null;
}

function resolveNicheLabel(
  trackId: string,
  marketId: string,
  nicheId: string,
): string | null {
  // Try MASTER_TRACKS first (works for video_editor, wordpress_developer, ui_ux_designer)
  const track = MASTER_TRACKS.find(t => t.id === trackId);
  if (track) {
    for (const service of track.services) {
      const market = service.markets.find(m => m.id === marketId);
      if (market) {
        const niche = market.niches.find(n => n.id === nicheId);
        if (niche) return niche.label;
      }
    }
  }

  // Fallback to Module 1 content data (covers all 15 sub-tracks)
  const nicheKey = `${trackId}_${marketId}`;
  const module1Niches = ALL_NICHES[nicheKey];
  if (module1Niches) {
    const niche = module1Niches.find(n => n.id === nicheId);
    if (niche) return niche.label;
  }

  return null;
}

/* ── Public API ── */

/** Returns the raw exact adapter entry for a given path, or null if not mapped. */
export function getAdapterEntry(
  trackId: string,
  marketId: string,
  nicheId: string,
): AdapterEntry | null {
  return MODULE1_ADAPTER_MAP[trackId]?.[marketId]?.[nicheId] ?? null;
}

/** Returns the raw market-level adapter entry for a given path, or null if not mapped. */
export function getMarketEntry(
  trackId: string,
  marketId: string,
): MarketAdapterEntry | null {
  return MARKET_ADAPTER_MAP[trackId]?.[marketId] ?? null;
}

export interface AdapterPayload {
  isValid: true;
  careerTrackId: string;
  serviceId: string;
  marketId: string;
  marketLabel: string | null;
  nicheId: string;
  nicheLabel: string | null;
  offerId: string;
  positioning: string;
  opportunityScore: number;
  opportunityScoreSource: 'default_phase_1_mapping';
  mappingType: MappingType;
}

export interface AdapterError {
  isValid: false;
  error: string;
}

export type AdapterResult = AdapterPayload | AdapterError;

/**
 * Main adapter function. Accepts the 5-step UI selections + final statement,
 * validates them against MASTER_TRACKS, and returns the full store-compatible
 * payload or a typed error.
 *
 * 3-layer priority:
 *   1. Exact niche mapping (trackId + marketId + nicheId)
 *   2. Market-level mapping (trackId + marketId)
 *   3. Emergency fallback (first valid service/offer in track)
 */
export function getAdapterPayload(
  trackId: string,
  marketId: string,
  nicheId: string,
  statement: string,
): AdapterResult {
  // Layer 1: Exact niche-level mapping
  const exactEntry = getAdapterEntry(trackId, marketId, nicheId);

  if (exactEntry) {
    const idsExist = validateIdsInTracks(exactEntry.serviceId, exactEntry.offerId);
    if (!idsExist) {
      return {
        isValid: false,
        error: `Data integrity error: serviceId "${exactEntry.serviceId}" or offerId "${exactEntry.offerId}" does not exist in MASTER_TRACKS. The adapter mapping is referencing IDs that have not been added to the data file.`,
      };
    }

    return {
      isValid: true,
      careerTrackId: trackId,
      serviceId: exactEntry.serviceId,
      marketId,
      marketLabel: resolveMarketLabel(trackId, marketId),
      nicheId,
      nicheLabel: resolveNicheLabel(trackId, marketId, nicheId),
      offerId: exactEntry.offerId,
      positioning: statement,
      opportunityScore: exactEntry.opportunityScore,
      opportunityScoreSource: exactEntry.opportunityScoreSource,
      mappingType: 'exact',
    };
  }

  // Layer 2: Market-level mapping
  const marketEntry = getMarketEntry(trackId, marketId);

  if (marketEntry) {
    const idsExist = validateIdsInTracks(marketEntry.serviceId, marketEntry.offerId);
    if (!idsExist) {
      return {
        isValid: false,
        error: `Data integrity error: serviceId "${marketEntry.serviceId}" or offerId "${marketEntry.offerId}" does not exist in MASTER_TRACKS. The adapter mapping is referencing IDs that have not been added to the data file.`,
      };
    }

    return {
      isValid: true,
      careerTrackId: trackId,
      serviceId: marketEntry.serviceId,
      marketId,
      marketLabel: resolveMarketLabel(trackId, marketId),
      nicheId,
      nicheLabel: resolveNicheLabel(trackId, marketId, nicheId),
      offerId: marketEntry.offerId,
      positioning: statement,
      opportunityScore: marketEntry.opportunityScore,
      opportunityScoreSource: marketEntry.opportunityScoreSource,
      mappingType: 'market',
    };
  }

  // Layer 3: Emergency fallback for unmapped paths -- never block the user
  const fallback = resolveFallbackIds(trackId);
  if (!fallback) {
    return {
      isValid: false,
      error: `Cannot find any services for track "${trackId}". The master data may be incomplete.`,
    };
  }

  return {
    isValid: true,
    careerTrackId: trackId,
    serviceId: fallback.serviceId,
    marketId,
    marketLabel: resolveMarketLabel(trackId, marketId),
    nicheId,
    nicheLabel: resolveNicheLabel(trackId, marketId, nicheId),
    offerId: fallback.offerId,
    positioning: statement,
    opportunityScore: 70,
    opportunityScoreSource: 'default_phase_1_mapping',
    mappingType: 'fallback',
  };
}

/**
 * Returns the direction statement at the given variant index.
 * Cycles safely if index exceeds the array length.
 * Falls back through market-level to a generic template.
 */
export function getStatementVariant(
  trackId: string,
  marketId: string,
  nicheId: string,
  variantIndex: number,
): string | null {
  // Layer 1: Exact niche mapping with custom statementVariants
  const exactEntry = getAdapterEntry(trackId, marketId, nicheId);
  if (exactEntry && exactEntry.statementVariants.length) {
    return exactEntry.statementVariants[variantIndex % exactEntry.statementVariants.length];
  }

  // Layer 2: Market-level mapping -- generate variants from who/result/method
  const marketEntry = getMarketEntry(trackId, marketId);
  if (marketEntry) {
    const variants = buildStatementVariants(marketEntry);
    return variants[variantIndex % variants.length];
  }

  // Layer 3: Fallback -- build a simple statement from available labels
  const marketLabel = resolveMarketLabel(trackId, marketId) ?? 'your target audience';
  const nicheLabel = resolveNicheLabel(trackId, marketId, nicheId) ?? 'better results';
  const fallbacks = [
    `I help ${marketLabel} achieve ${nicheLabel} through focused, high-quality work.`,
    `I help ${marketLabel} get the results they deserve with a clear, reliable approach.`,
    `I help ${marketLabel} solve their biggest challenges through practical, proven methods.`,
  ];
  return fallbacks[variantIndex % fallbacks.length];
}

/** Total number of statement variants for a given path. */
export function getVariantCount(
  trackId: string,
  marketId: string,
  nicheId: string,
): number {
  // Layer 1: Exact niche mapping
  const exactEntry = getAdapterEntry(trackId, marketId, nicheId);
  if (exactEntry?.statementVariants.length) return exactEntry.statementVariants.length;

  // Layer 2: Market-level mapping -- always 3 generated variants
  const marketEntry = getMarketEntry(trackId, marketId);
  if (marketEntry) return 3;

  // Layer 3: Fallback -- always 3 fallback variants
  return 3;
}

/**
 * Development validation helper.
 * Validates all exact and market mappings against MASTER_TRACKS
 * and OFFER_ENGINEERING_MASTER_DATA.
 * Safe to call in development -- does not affect production.
 */
export function validateAdapterMappings(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate exact niche mappings
  for (const [trackId, marketMap] of Object.entries(MODULE1_ADAPTER_MAP)) {
    for (const [marketId, nicheMap] of Object.entries(marketMap)) {
      for (const [nicheId, entry] of Object.entries(nicheMap)) {
        if (!validateIdsInTracks(entry.serviceId, entry.offerId)) {
          errors.push(
            `EXACT [${trackId}][${marketId}][${nicheId}]: serviceId "${entry.serviceId}" or offerId "${entry.offerId}" not found in MASTER_TRACKS`,
          );
        }
        if (!OFFER_ENGINEERING_MASTER_DATA[entry.serviceId]) {
          errors.push(
            `EXACT [${trackId}][${marketId}][${nicheId}]: serviceId "${entry.serviceId}" not found in OFFER_ENGINEERING_MASTER_DATA`,
          );
        }
        if (!entry.who || !entry.result || !entry.method) {
          errors.push(
            `EXACT [${trackId}][${marketId}][${nicheId}]: missing who, result, or method`,
          );
        }
        if (!entry.statementVariants.length) {
          errors.push(
            `EXACT [${trackId}][${marketId}][${nicheId}]: empty statementVariants`,
          );
        }
      }
    }
  }

  // Validate market-level mappings
  for (const [trackId, marketMap] of Object.entries(MARKET_ADAPTER_MAP)) {
    for (const [marketId, entry] of Object.entries(marketMap)) {
      if (!validateIdsInTracks(entry.serviceId, entry.offerId)) {
        errors.push(
          `MARKET [${trackId}][${marketId}]: serviceId "${entry.serviceId}" or offerId "${entry.offerId}" not found in MASTER_TRACKS`,
        );
      }
      if (!OFFER_ENGINEERING_MASTER_DATA[entry.serviceId]) {
        errors.push(
          `MARKET [${trackId}][${marketId}]: serviceId "${entry.serviceId}" not found in OFFER_ENGINEERING_MASTER_DATA`,
        );
      }
      if (!entry.who || !entry.result || !entry.method) {
        errors.push(
          `MARKET [${trackId}][${marketId}]: missing who, result, or method`,
        );
      }

      // Verify marketLabel resolves to a non-empty string
      const marketLabel = resolveMarketLabel(trackId, marketId);
      if (!marketLabel) {
        errors.push(
          `MARKET [${trackId}][${marketId}]: marketLabel resolved to null — market "${marketId}" not found in MASTER_TRACKS or ALL_MARKETS[${trackId}]`,
        );
      }

      // Verify nicheLabel resolves for all niches under this market
      const nicheKey = `${trackId}_${marketId}`;
      const niches = ALL_NICHES[nicheKey];
      if (!niches) {
        errors.push(
          `MARKET [${trackId}][${marketId}]: no ALL_NICHES entry found for key "${nicheKey}"`,
        );
      } else {
        for (const niche of niches) {
          const nicheLabel = resolveNicheLabel(trackId, marketId, niche.id);
          if (!nicheLabel) {
            errors.push(
              `NICHE [${trackId}][${marketId}][${niche.id}]: nicheLabel resolved to null — niche "${niche.id}" not found in MASTER_TRACKS or ALL_NICHES[${nicheKey}]`,
            );
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
