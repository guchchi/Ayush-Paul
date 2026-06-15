import type { CareerTrack } from '@/src/types/opportunity-map';

export const MASTER_TRACKS: CareerTrack[] = [
  {
    id: 'video_editor',
    label: 'Video Editor',
    description:
      'Edit raw footage into polished, platform-ready videos for creators, businesses, and brands.',
    services: [
      {
        id: 'short_form_clips',
        label: 'Short-Form Social Clip Editing',
        description:
          'Fast-turnaround vertical and square edits optimised for TikTok, Reels, and Shorts algorithms.',
        markets: [
          {
            id: 'health_wellness_creators',
            label: 'Health & Wellness Creators',
            description:
              'Fitness coaches, nutritionists, and mindfulness practitioners who post daily educational content.',
            niches: [
              {
                id: 'yoga_instructors_reels',
                label: 'Yoga instructors posting daily Reels',
                description:
                  'Certified yoga teachers who film 30–90 second flows or pose breakdowns and need consistent, aesthetic edits.',
                offers: [
                  {
                    id: 'weekly_reel_batch_5',
                    label: 'Weekly Reel Batch (5 clips/wk)',
                    description:
                      'Five finished vertical clips delivered every Monday, colour-graded with captions and beat-synced transitions.',
                    priceRange: '$300/wk',
                    deliveryFormat: 'Monday delivery via Google Drive',
                    positioningTemplate: 'I help yoga instructors grow their Instagram presence through consistent, aesthetic weekly reel editing.',
                    simulatorWeights: { demand: 9, competition: 8, execution_speed: 9 },
                    clientSources: [
                      {
                        id: 'ig_dm_outreach_yoga',
                        label: 'Instagram DM outreach to yoga teachers with inconsistent posting',
                        description:
                          'Identify accounts posting <3x/week and send a 3-message DM sequence offering a free sample edit.',
                        channel: 'cold_outreach',
                        difficulty: 'moderate',
                      },
                      {
                        id: 'yoga_studio_referrals',
                        label: 'Referral from yoga studio equipment brands',
                        description:
                          'Partner with 2–3 mat/ apparel brands that sponsor teachers and offer bundled editing as a perk.',
                        channel: 'referral',
                        difficulty: 'easy',
                      },
                    ],
                  },
                  {
                    id: 'challenge_series_pack',
                    label: '30-Day Challenge Edit Pack',
                    description:
                      'Batch of 30 short-form videos for a challenge launch, each with hook optimisation and CTA end cards.',
                    priceRange: '$1,500/challenge',
                    deliveryFormat: 'All 30 delivered before challenge start date',
                    positioningTemplate: 'I help yoga teachers launch viral challenges through pre-batched, hook-optimised short-form edits.',
                    simulatorWeights: { demand: 8, competition: 7, execution_speed: 7 },
                    clientSources: [
                      {
                        id: 'challenge_creators',
                        label: 'Creators running recurring challenges on Align / MindBody',
                        description:
                          'Find teachers promoting "30-day yoga challenges" on Instagram and pitch a pre-recorded batch edit service.',
                        channel: 'platform',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'nutritionists_recipe_clips',
                label: 'Nutritionists sharing recipe tutorials',
                description:
                  'Registered dietitians and nutrition coaches who film recipe demos and need quick, branded clip edits.',
                offers: [
                  {
                    id: 'recipe_demo_edit_pack',
                    label: 'Recipe Demo Edit Pack (3 recipes)',
                    description:
                      'Three recipe videos edited with ingredient pop-ups, step markers, and a consistent lower-third brand bar.',
                    priceRange: '$200/pack',
                    deliveryFormat: '3 finished clips within 48 hours',
                    positioningTemplate: 'I help nutritionists turn recipes into scroll-stopping social clips through branded, pop-up-rich video edits.',
                    simulatorWeights: { demand: 7, competition: 6, execution_speed: 8 },
                    clientSources: [
                      {
                        id: 'pinterest_recipe_outreach',
                        label: 'Pinterest-sourced nutrition creators with low video consistency',
                        description:
                          'Search Pinterest for recipe pins linking to blogs with few video assets; pitch a short-form video strategy.',
                        channel: 'cold_outreach',
                        difficulty: 'hard',
                      },
                      {
                        id: 'supplement_brand_collabs',
                        label: 'Supplement brand ambassador programme leads',
                        description:
                          'Approach brand managers who run ambassador programmes and offer editing as an included perk for their creators.',
                        channel: 'partnership',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'real_estate_agents',
            label: 'Real Estate Agents',
            description:
              'Agents and brokerages producing property tours, neighbourhood guides, and market update content.',
            niches: [
              {
                id: 'luxury_property_walkthroughs',
                label: 'Luxury property agents doing walkthrough tours',
                description:
                  'High-end real estate agents who film 2–5 min property tours and need cinematic colour grading and music scoring.',
                offers: [
                  {
                    id: 'property_tour_reel_24h',
                    label: 'Property Tour Reel (24h turnaround)',
                    description:
                      'One cinematic property reel with smooth transitions, ambient audio layering, and agent intro hook.',
                    priceRange: '$150/video',
                    deliveryFormat: 'Next-day delivery via WeTransfer',
                    positioningTemplate: 'I help luxury real estate agents sell listings faster through cinematic property reel editing.',
                    simulatorWeights: { demand: 7, competition: 5, execution_speed: 9 },
                    clientSources: [
                      {
                        id: 'zillow_premier_outreach',
                        label: 'Zillow Premier Agent cold email',
                        description:
                          'Scrape Zillow for agents with 10+ listings but no video tours; send a personalised email with a sample edit from their own listing photos.',
                        channel: 'cold_outreach',
                        difficulty: 'hard',
                      },
                    ],
                  },
                  {
                    id: 'listing_showreel_monthly',
                    label: 'Monthly Listing Showreel (4 properties)',
                    description:
                      'Four property tours edited into a cohesive monthly showreel with consistent intro/outro branding.',
                    priceRange: '$500/month',
                    deliveryFormat: '4 videos delivered each Friday',
                    positioningTemplate: 'I help real estate agents dominate their local market through consistent monthly showreel production.',
                    simulatorWeights: { demand: 6, competition: 4, execution_speed: 7 },
                    clientSources: [
                      {
                        id: 'real_estate_networking',
                        label: 'Local real estate networking group partnerships',
                        description:
                          'Join 2–3 local real estate investment or networking meetups and offer a group rate for monthly showreels.',
                        channel: 'community',
                        difficulty: 'easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'saas_founders_linkedin',
            label: 'SaaS Founders',
            description:
              'B2B and B2C founders building personal brands on LinkedIn through short-form thought leadership.',
            niches: [
              {
                id: 'b2b_founder_thought_leadership',
                label: 'B2B SaaS founders posting thought leadership',
                description:
                  'Founders of early-stage B2B companies who film 60–120 sec LinkedIn videos on industry insights, metrics, and lessons.',
                offers: [
                  {
                    id: 'linkedin_tl_edit',
                    label: 'LinkedIn Thought Leadership Edit',
                    description:
                      'Single talking-head video with captions, hook text overlay, LinkedIn-native formatting, and engagement CTAs.',
                    priceRange: '$250/video',
                    deliveryFormat: '24h turnaround, captioned + thumbnailed',
                    positioningTemplate: 'I help B2B SaaS founders build authority on LinkedIn through polished, engagement-optimised thought leadership edits.',
                    simulatorWeights: { demand: 8, competition: 6, execution_speed: 8 },
                    clientSources: [
                      {
                        id: 'linkedin_comment_outreach',
                        label: 'LinkedIn comment section engagement',
                        description:
                          'Identify founders who comment actively on startup content and engage; DM offering a free caption-only edit of their best recent video.',
                        channel: 'platform',
                        difficulty: 'easy',
                      },
                      {
                        id: 'yc_startup_referrals',
                        label: 'YC / accelerators founder community referrals',
                        description:
                          'Offer a discounted first month to YC or Techstars founders and ask for referrals within their batch Slack.',
                        channel: 'referral',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'long_form_content',
        label: 'Long-Format Content Editing',
        description:
          'Full post-production for YouTube, educational, and documentary-style content ranging 10–60 minutes.',
        markets: [
          {
            id: 'educational_creators',
            label: 'Educational Creators',
            description:
              'Course creators, tutorial makers, and edutainment channels producing structured learning content.',
            niches: [
              {
                id: 'youtube_course_creators',
                label: 'Online course creators on YouTube',
                description:
                  'Creators who repurpose their paid course material into free YouTube lessons and need consistent chapterised edits.',
                offers: [
                  {
                    id: 'lecture_edit_chapters',
                    label: 'Lecture Edit + Timestamp Chapters',
                    description:
                      'Full lesson edit with intro/outro, slide sync, chapter markers, and end-screen elements.',
                    priceRange: '$400/video',
                    deliveryFormat: '48h for <30min footage, 72h for longer',
                    positioningTemplate: 'I help online course creators grow their YouTube channel through chapterised, student-ready lecture edits.',
                    simulatorWeights: { demand: 6, competition: 5, execution_speed: 6 },
                    clientSources: [
                      {
                        id: 'udemy_instructor_reach',
                        label: 'Udemy / Teachable instructor cold outreach',
                        description:
                          'Find instructors with highly rated courses but low YouTube presence; pitch repurposing course clips into YouTube edits.',
                        channel: 'cold_outreach',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'tech_tutorial_creators',
                label: 'Tech tutorial creators',
                description:
                  'Developers and tech educators who produce coding tutorials and need screen-capture optimisation and code zoom effects.',
                offers: [
                  {
                    id: 'tutorial_post_production',
                    label: 'Tutorial Post-Production (coding)',
                    description:
                      'Screen recording clean-up, code zoom/pan, keystroke overlays, and audio levelling.',
                    priceRange: '$350/video',
                    deliveryFormat: '72h turnaround, source files included',
                    positioningTemplate: 'I help tech educators boost student comprehension through screen-optimised coding tutorial edits.',
                    simulatorWeights: { demand: 6, competition: 4, execution_speed: 7 },
                    clientSources: [
                      {
                        id: 'github_sponsor_referrals',
                        label: 'GitHub Sponsors / Patreon creator referrals',
                        description:
                          'Contact developers with active GitHub Sponsors or Patreon who post irregular YouTube content.',
                        channel: 'platform',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'youtube_podcasters',
            label: 'YouTube Podcasters',
            description:
              'Podcasters who publish full video episodes and need consistent, branded long-form editing.',
            niches: [
              {
                id: 'interview_podcasts',
                label: 'Interview-format podcasters',
                description:
                  'Host-run interview shows with 2+ camera angles needing multi-cam sync, audio cleanup, and show notes.',
                offers: [
                  {
                    id: 'full_podcast_episode_edit',
                    label: 'Full Podcast Episode Edit',
                    description:
                      'Multi-cam sync, audio levelling, intro/outro stingers, chapters, and show notes template.',
                    priceRange: '$250/episode',
                    deliveryFormat: '48h after raw footage delivery',
                    positioningTemplate: 'I help interview podcasters sound production-ready through multi-cam, audio-cleaned episode editing.',
                    simulatorWeights: { demand: 8, competition: 6, execution_speed: 8 },
                    clientSources: [
                      {
                        id: 'spotify_podcast_discovery',
                        label: 'Spotify for Podcasters discovery outreach',
                        description:
                          'Search Spotify for podcasts with <5 episodes and low production value; offer a free first-episode edit as a sample.',
                        channel: 'platform',
                        difficulty: 'easy',
                      },
                      {
                        id: 'podcast_network_referral',
                        label: 'Podcast network production referrals',
                        description:
                          'Partner with 2–3 small podcast networks as their preferred post-production vendor.',
                        channel: 'partnership',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'youtube_creators',
            label: 'YouTube Creators',
            description:
              'YouTubers building an audience through educational, entertainment, or niche content who need sharp video editing to retain viewers and grow consistently.',
            niches: [
              {
                id: 'youtubers_retention',
                label: 'YouTubers focused on growing viewer retention',
                description:
                  'Content creators who publish regularly on YouTube but struggle with audience drop-off, weak storytelling, and inconsistent video pacing.',
                offers: [
                  {
                    id: 'youtube_retention_editing_package',
                    label: 'YouTube Retention Editing Package',
                    description:
                      'Full video edit optimised for watch time: story structure, dynamic pacing, B-roll overlays, captions, and a compelling hook within the first 30 seconds.',
                    priceRange: '$350/video',
                    deliveryFormat: '48\u201372h turnaround, includes thumbnail direction brief',
                    positioningTemplate:
                      'I help YouTubers increase viewer retention through story-driven video editing with strong hooks and dynamic pacing.',
                    simulatorWeights: { demand: 9, competition: 7, execution_speed: 8 },
                    clientSources: [
                      {
                        id: 'youtube_analytics_audit_outreach',
                        label: 'YouTube channel analytics cold outreach',
                        description:
                          'Find channels with 1K\u201350K subscribers and high upload frequency but low average view duration; offer a free 60-second hook re-edit as a sample.',
                        channel: 'cold_outreach',
                        difficulty: 'moderate',
                      },
                      {
                        id: 'creator_community_reddit_discord',
                        label: 'Creator community referrals (Reddit, Discord)',
                        description:
                          'Engage in r/NewTubers and creator Discord servers offering free retention audits; convert feedback into paid editing work.',
                        channel: 'community',
                        difficulty: 'easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'podcast_post_production',
        label: 'Podcast Post-Production',
        description:
          'Audio cleanup, show notes, audiogram creation, and clip repurposing for podcasters on any platform.',
        markets: [
          {
            id: 'business_podcasts',
            label: 'Business Podcasts',
            description:
              'Founder-led, industry deep-dive, and interview podcasts targeting a professional audience.',
            niches: [
              {
                id: 'founder_interview_podcasts',
                label: 'Founder-led interview podcasts',
                description:
                  'Small-audience podcasts hosted by founders who record 2–3x/week and outsource post-production.',
                offers: [
                  {
                    id: 'podcast_full_cleanup_show_notes',
                    label: 'Podcast Audio Cleanup + Show Notes',
                    description:
                      'Audio noise reduction, level normalisation, chapter markers, SEO show notes, and social snippet text.',
                    priceRange: '$200/episode',
                    deliveryFormat: '24h after raw audio arrives',
                    positioningTemplate: 'I help founder-podcasters save hours on post-production through professional audio cleanup and SEO show notes.',
                    simulatorWeights: { demand: 7, competition: 5, execution_speed: 9 },
                    clientSources: [
                      {
                        id: 'apple_podcasts_search',
                        label: 'Apple Podcasts new-and-noteworthy outreach',
                        description:
                          'Monitor Apple Podcasts charts for new business podcasts and pitch post-production services before they scale.',
                        channel: 'cold_outreach',
                        difficulty: 'hard',
                      },
                      {
                        id: 'content_agency_referral',
                        label: 'Content marketing agency partnerships',
                        description:
                          'Partner with agencies that run podcast production for their clients and offer post-production as an add-on.',
                        channel: 'partnership',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                  {
                    id: 'podcast_video_audiogram_package',
                    label: 'Podcast Video + Audiogram Package',
                    description:
                      'Full video podcast edit plus 3 audiogram clips optimised for Instagram and LinkedIn.',
                    priceRange: '$350/episode',
                    deliveryFormat: '48h turnaround, source + export',
                    positioningTemplate: 'I help business podcasters amplify their reach through video episodes and platform-optimised audiogram clips.',
                    simulatorWeights: { demand: 7, competition: 5, execution_speed: 7 },
                    clientSources: [
                      {
                        id: 'linkedin_podcaster_outreach',
                        label: 'LinkedIn podcaster DM campaign',
                        description:
                          'Search LinkedIn for "podcast host" titles in the creator economy; send a sample audiogram made from their latest episode.',
                        channel: 'cold_outreach',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'narrative_podcasts',
            label: 'Narrative & Storytelling Podcasts',
            description:
              'Produced, scripted podcasts with sound design, interviews, and high production value expectations.',
            niches: [
              {
                id: 'solo_narrative_podcasters',
                label: 'Solo narrative podcasters',
                description:
                  'Hosts who write and narrate scripted episodes with sound design, ambience, and music beds.',
                offers: [
                  {
                    id: 'narrative_edit_sound_design',
                    label: 'Narrative Edit + Sound Design',
                    description:
                      'Script-timed editing, ambience layering, music scoring, and mix optimisation for narrative episodes.',
                    priceRange: '$500/episode',
                    deliveryFormat: '5-day turnaround with 1 revision round',
                    positioningTemplate: 'I help narrative podcasters transport their listeners through cinematic sound design and script-timed editing.',
                    simulatorWeights: { demand: 5, competition: 3, execution_speed: 4 },
                    clientSources: [
                      {
                        id: 'audible_fiction_outreach',
                        label: 'Audible / fiction podcast creator communities',
                        description:
                          'Engage in fiction podcasting communities (r/audiodrama, podcasting Facebook groups) and offer a production sample.',
                        channel: 'community',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'wordpress_developer',
    label: 'WordPress Developer',
    description:
      'Build, extend, and optimise WordPress sites including custom themes, plugins, migrations, and performance tuning.',
    services: [
      {
        id: 'custom_theme_development',
        label: 'Custom Theme Development',
        description:
          'Headless or traditional WordPress themes built from scratch with performance, SEO, and design fidelity guarantees.',
        markets: [
          {
            id: 'small_business_owners',
            label: 'Small Business Owners',
            description:
              'Local service businesses and boutique retail stores needing a professional, maintainable web presence.',
            niches: [
              {
                id: 'local_service_businesses',
                label: 'Local service businesses (plumbers, dentists, electricians)',
                description:
                  'Trade and professional service providers with outdated or no website who need a simple, lead-generating web presence.',
                offers: [
                  {
                    id: 'five_page_business_theme',
                    label: '5-Page Business Theme + Setup',
                    description:
                      'Custom theme with home, about, services, contact, and testimonial pages. Includes contact form, Google Maps embed, and basic SEO.',
                    priceRange: '$1,500',
                    deliveryFormat: '2-week delivery, includes 1 hour of training',
                    positioningTemplate: 'I help local service businesses attract more customers through a professional, lead-generating WordPress website.',
                    simulatorWeights: { demand: 7, competition: 6, execution_speed: 6 },
                    clientSources: [
                      {
                        id: 'google_maps_scrape',
                        label: 'Google Maps local business scrape + cold email',
                        description:
                          'Extract businesses with 3.5–4.5 stars and no website link; send a personalised audit showing their missing online presence.',
                        channel: 'cold_outreach',
                        difficulty: 'hard',
                      },
                      {
                        id: 'chamber_of_commerce',
                        label: 'Local chamber of commerce referrals',
                        description:
                          'Join 1–2 local chambers and offer a free website health check for members.',
                        channel: 'community',
                        difficulty: 'easy',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'boutique_retail_stores',
                label: 'Boutique retail stores',
                description:
                  'Independent clothing, home goods, or speciality stores needing e-commerce functionality with a bespoke look.',
                offers: [
                  {
                    id: 'ecommerce_theme_product_catalog',
                    label: 'E-commerce Theme with Product Catalog',
                    description:
                      'WooCommerce-integrated custom theme with product catalogue, cart, checkout styling, and inventory management.',
                    priceRange: '$2,500',
                    deliveryFormat: '3-week delivery with product import guide',
                    positioningTemplate: 'I help boutique retailers scale online sales through a custom WooCommerce storefront with seamless product catalogues.',
                    simulatorWeights: { demand: 6, competition: 5, execution_speed: 5 },
                    clientSources: [
                      {
                        id: 'shopify_frustration_outreach',
                        label: 'Shopify-to-WordPress migration angle outreach',
                        description:
                          'Target brick-and-mortar stores using Shopify with complaints about transaction fees; pitch a WooCommerce migration with lower fees.',
                        channel: 'cold_outreach',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'bloggers_content_creators',
            label: 'Bloggers & Content Creators',
            description:
              'Solo and multi-author content sites needing editorial-focused themes with newsletter integration.',
            niches: [
              {
                id: 'long_form_bloggers',
                label: 'Long-form content bloggers',
                description:
                  'Bloggers publishing 2,000+ word articles who need a reading-optimised theme with related posts and newsletter capture.',
                offers: [
                  {
                    id: 'blog_theme_newsletter',
                    label: 'Blog Theme + Newsletter Integration',
                    description:
                      'Custom blog theme with typography-first design, related post engine, Mailchimp/ConvertKit integration, and reading progress indicator.',
                    priceRange: '$1,200',
                    deliveryFormat: '10-day delivery with content migration assistance',
                    positioningTemplate: 'I help long-form bloggers grow their readership through a typography-first WordPress theme with newsletter capture.',
                    simulatorWeights: { demand: 5, competition: 4, execution_speed: 7 },
                    clientSources: [
                      {
                        id: 'medium_blogger_outreach',
                        label: 'Medium-to-WordPress migration outreach',
                        description:
                          'Identify bloggers with >1K followers on Medium who have no owned site; pitch a WordPress setup with editorial theme.',
                        channel: 'cold_outreach',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'multi_author_publications',
                label: 'Multi-author publication sites',
                description:
                  'Online magazines or industry publications with multiple contributors needing author management and editorial workflows.',
                offers: [
                  {
                    id: 'editorial_theme_authors',
                    label: 'Editorial Theme with Author Profiles',
                    description:
                      'Multi-author theme with custom author pages, contributor role management, editorial calendar integration, and submission portal.',
                    priceRange: '$2,000',
                    deliveryFormat: '3-week delivery including author onboarding documentation',
                    positioningTemplate: 'I help multi-author publications streamline their editorial workflow through a custom WordPress theme with contributor management.',
                    simulatorWeights: { demand: 4, competition: 3, execution_speed: 6 },
                    clientSources: [
                      {
                        id: 'substack_to_wp',
                        label: 'Substack-to-WordPress migration leads',
                        description:
                          'Target Substack publications with 5+ contributors who are hitting Substack\'s revenue limits; pitch self-hosted WordPress with full ownership.',
                        channel: 'cold_outreach',
                        difficulty: 'hard',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'local_businesses',
            label: 'Local Businesses',
            description:
              'Restaurants, cafes, and local service businesses needing an online presence that drives walk-ins, table bookings, and direct inquiries.',
            niches: [
              {
                id: 'restaurants',
                label: 'Restaurants and cafes needing a bookable website',
                description:
                  'Local dining establishments with outdated or no website who want to attract more local customers and increase table reservations through a professional online presence.',
                offers: [
                  {
                    id: 'restaurant_website_booking_package',
                    label: 'Restaurant Website + Booking Integration',
                    description:
                      '5-page WordPress site with menu, gallery, online booking form, Google Maps embed, and local SEO setup for Google Business Profile.',
                    priceRange: '$1,800',
                    deliveryFormat: '2-week delivery with booking system setup and owner training session',
                    positioningTemplate:
                      'I help restaurants get more local customers through fast, trustworthy WordPress websites with seamless online booking.',
                    simulatorWeights: { demand: 8, competition: 6, execution_speed: 7 },
                    clientSources: [
                      {
                        id: 'google_maps_restaurant_cold_outreach',
                        label: 'Google Maps restaurant cold outreach',
                        description:
                          'Find restaurants with 4+ star ratings but no website or broken link in Maps; offer a free website audit showing what local traffic they are missing.',
                        channel: 'cold_outreach',
                        difficulty: 'moderate',
                      },
                      {
                        id: 'local_hospitality_group_referrals',
                        label: 'Local food blogger and hospitality group referrals',
                        description:
                          'Partner with local food bloggers or hospitality industry associations to offer website packages as a preferred resource for their audience.',
                        channel: 'referral',
                        difficulty: 'easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'plugin_integration_dev',
        label: 'Plugin & Integration Development',
        description:
          'Custom WordPress plugins bridging gaps between WooCommerce, LMS, membership, and third-party APIs.',
        markets: [
          {
            id: 'membership_sites',
            label: 'Membership Sites',
            description:
              'Course creators and subscription content sites needing custom access control, payment gateways, and member management.',
            niches: [
              {
                id: 'course_creators_wp',
                label: 'Course creators on WordPress',
                description:
                  'Creators using LearnDash or Tutor LMS who need custom payment gateway bridges, drip-feed schedules, and student analytics.',
                offers: [
                  {
                    id: 'custom_lms_payment_bridge',
                    label: 'Custom LMS + Payment Gateway Bridge',
                    description:
                      'Custom plugin connecting LearnDash to a non-standard payment gateway (e.g., local bank transfer, crypto) with enrolment webhooks.',
                    priceRange: '$3,000',
                    deliveryFormat: '2-week development, 1-week testing',
                    positioningTemplate: 'I help WordPress course creators accept any payment method through custom LMS-payment gateway integration plugins.',
                    simulatorWeights: { demand: 6, competition: 4, execution_speed: 5 },
                    clientSources: [
                      {
                        id: 'lms_forum_community',
                        label: 'LearnDash / Tutor LMS forum support engagement',
                        description:
                          'Monitor official support forums for users requesting custom payment integrations; offer a tailored solution.',
                        channel: 'community',
                        difficulty: 'easy',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'subscription_content_sites',
                label: 'Subscription content sites',
                description:
                  'Paid subscription sites offering gated content tiers with recurring billing and member-only areas.',
                offers: [
                  {
                    id: 'member_only_content_plugin',
                    label: 'Member-Only Content Plugin',
                    description:
                      'Custom plugin for content dripping, tiered access control, free preview management, and cancellation flow.',
                    priceRange: '$2,500',
                    deliveryFormat: '10-day development with Stripe integration',
                    positioningTemplate: 'I help subscription site owners protect their revenue through custom content-dripping and tiered-access WordPress plugins.',
                    simulatorWeights: { demand: 5, competition: 4, execution_speed: 6 },
                    clientSources: [
                      {
                        id: 'patreon_to_wp',
                        label: 'Patreon creators moving to self-hosted',
                        description:
                          'Identify Patreon creators with >500 patrons who are losing revenue to platform fees; pitch a self-hosted membership site.',
                        channel: 'cold_outreach',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'ecommerce_stores',
            label: 'E-commerce Stores',
            description:
              'WooCommerce stores needing custom checkout flows, inventory automation, and digital delivery solutions.',
            niches: [
              {
                id: 'custom_woocommerce_needs',
                label: 'WooCommerce stores with custom checkout needs',
                description:
                  'Stores requiring multi-step checkout, conditional fields, local pickup options, or custom shipping calculators.',
                offers: [
                  {
                    id: 'custom_checkout_flow_plugin',
                    label: 'Custom Checkout Flow Plugin',
                    description:
                      'Custom WooCommerce plugin modifying the checkout experience with conditional logic, address validation, and order management hooks.',
                    priceRange: '$2,000',
                    deliveryFormat: '10-day development with testing documentation',
                    positioningTemplate: 'I help WooCommerce stores reduce cart abandonment through custom checkout flows with conditional logic and validation.',
                    simulatorWeights: { demand: 6, competition: 5, execution_speed: 6 },
                    clientSources: [
                      {
                        id: 'woocommerce_reviews_outreach',
                        label: 'WooCommerce plugin review analysis',
                        description:
                          'Analyse 1-star reviews of popular checkout plugins for common complaints; pitch a custom solution to those users.',
                        channel: 'platform',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'digital_product_sellers',
                label: 'Digital product sellers',
                description:
                  'Authors, musicians, and software vendors selling downloadable products through WooCommerce.',
                offers: [
                  {
                    id: 'automated_delivery_plugin',
                    label: 'Automated Delivery Plugin',
                    description:
                      'Custom plugin for automatic file delivery, license key generation, download limit tracking, and update notifications.',
                    priceRange: '$1,800',
                    deliveryFormat: '7-day development with EDD migration support',
                    positioningTemplate: 'I help digital product sellers automate their delivery pipeline through custom WooCommerce plugins with license key generation.',
                    simulatorWeights: { demand: 5, competition: 4, execution_speed: 7 },
                    clientSources: [
                      {
                        id: 'gumroad_migration_leads',
                        label: 'Gumroad-to-WooCommerce migration leads',
                        description:
                          'Target Gumroad sellers paying high platform fees with >$5K/mo in revenue; pitch WooCommerce with full ownership and no transaction fees.',
                        channel: 'cold_outreach',
                        difficulty: 'hard',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'site_migration_performance',
        label: 'Site Migration & Performance',
        description:
          'Zero-downtime migrations between platforms or hosts, plus speed optimisation audits and implementation.',
        markets: [
          {
            id: 'agency_handoffs',
            label: 'Agency Handoffs',
            description:
              'Sites being transferred from one agency to another, or from DIY builders to professional WordPress.',
            niches: [
              {
                id: 'wix_squarespace_migration',
                label: 'Sites moving from Wix / Squarespace to WordPress',
                description:
                  'Business owners outgrowing hosted builders who need full content and SEO migration to a self-hosted WordPress site.',
                offers: [
                  {
                    id: 'platform_migration_seo_preservation',
                    label: 'Platform Migration + SEO Preservation',
                    description:
                      'Full content, image, and URL structure migration from Wix/Squarespace to WordPress with 301 redirects, meta preservation, and search console setup.',
                    priceRange: '$1,500',
                    deliveryFormat: '1-week migration with 48h of SEO monitoring post-launch',
                    positioningTemplate: 'I help business owners escape platform lock-in through zero-risk WordPress migrations with full SEO preservation.',
                    simulatorWeights: { demand: 6, competition: 4, execution_speed: 6 },
                    clientSources: [
                      {
                        id: 'wix_to_wp_outreach',
                        label: 'Wix subreddit / forum SEO complaint outreach',
                        description:
                          'Monitor Wix-focused communities for posts about "SEO limitations" or "slow load times"; pitch a migration audit.',
                        channel: 'community',
                        difficulty: 'easy',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'wp_host_migration',
                label: 'Sites moving between WordPress hosts',
                description:
                  'Sites on shared hosting that have outgrown their environment and need a managed WP host migration.',
                offers: [
                  {
                    id: 'host_migration_zero_downtime',
                    label: 'Host Migration + Zero Downtime',
                    description:
                      'Server-to-server migration with DNS staging, SSL reissue, database transfer, and traffic cut-over with <2 min downtime.',
                    priceRange: '$800',
                    deliveryFormat: '48h planning + 2h migration window, post-migration monitoring for 24h',
                    positioningTemplate: 'I help WordPress site owners eliminate downtime during server migrations through meticulous DNS-staged cut-overs.',
                    simulatorWeights: { demand: 5, competition: 3, execution_speed: 7 },
                    clientSources: [
                      {
                        id: 'siteground_bluehost_outreach',
                        label: 'SiteGround / BlueHost support forum complaint leads',
                        description:
                          'Identify users complaining about "slow support" or "resource limits" on shared hosting forums; pitch a managed WP host migration.',
                        channel: 'community',
                        difficulty: 'easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'performance_seeking_sites',
            label: 'Performance-Seeking Sites',
            description:
              'Sites with traffic or conversion issues caused by slow load times, unoptimised databases, or poor caching architecture.',
            niches: [
              {
                id: 'slow_woocommerce_stores',
                label: 'Slow WooCommerce stores',
                description:
                  'WooCommerce stores with >3s load times causing cart abandonment and poor Core Web Vitals scores.',
                offers: [
                  {
                    id: 'speed_optimisation_audit',
                    label: 'Speed Optimisation Audit + Implementation',
                    description:
                      'Full performance audit (Lighthouse, WebPageTest, Query Monitor), image optimisation, database cleanup, caching setup, and CDN configuration.',
                    priceRange: '$1,200',
                    deliveryFormat: '1-week audit + 1-week implementation with before/after reports',
                    positioningTemplate: 'I help WooCommerce store owners double their conversion rates through comprehensive speed optimisation audits and implementation.',
                    simulatorWeights: { demand: 7, competition: 5, execution_speed: 6 },
                    clientSources: [
                      {
                        id: 'woocommerce_slow_outreach',
                        label: 'WooCommerce Facebook group performance complaint outreach',
                        description:
                          'Monitor WooCommerce Facebook groups for "slow site" complaints; offer a free Lighthouse audit with actionable findings.',
                        channel: 'community',
                        difficulty: 'easy',
                      },
                      {
                        id: 'gtmetrix_analysis_cold',
                        label: 'GTmetrix public report analysis cold outreach',
                        description:
                          'Analyse publicly indexed GTmetrix reports for WooCommerce sites with poor grades; present a customised optimisation proposal.',
                        channel: 'cold_outreach',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ui_ux_designer',
    label: 'UI/UX Designer',
    description:
      'Design digital product interfaces, brand identities, and conversion-optimised user experiences for web and mobile.',
    services: [
      {
        id: 'product_ui_design',
        label: 'Product UI Design',
        description:
          'High-fidelity screen designs for web apps, mobile apps, and SaaS platforms with component-based design systems.',
        markets: [
          {
            id: 'early_stage_startups',
            label: 'Early-Stage Startups',
            description:
              'Pre-seed and seed-stage startups needing MVP interfaces, investor-ready prototypes, and brand-aligned UI.',
            niches: [
              {
                id: 'pre_seed_mvp_ui',
                label: 'Pre-seed founders building an MVP',
                description:
                  'Technical or non-technical founders who have validated an idea and need a UI kit to build from or to show investors.',
                offers: [
                  {
                    id: 'mvp_ui_kit_5_screens',
                    label: 'MVP UI Kit (5 core screens)',
                    description:
                      'Five high-fidelity Figma screens covering the core user flow, with a component library, design token spec, and handoff files for developers.',
                    priceRange: '$2,500',
                    deliveryFormat: 'Figma file with auto-layout components + developer handoff within 10 days',
                    positioningTemplate: 'I help pre-seed founders raise their next round through investor-ready MVP UI kits with developer handoff files.',
                    simulatorWeights: { demand: 9, competition: 7, execution_speed: 7 },
                    clientSources: [
                      {
                        id: 'product_hunt_launch_outreach',
                        label: 'Product Hunt upcoming maker outreach',
                        description:
                          'Monitor Product Hunt "Upcoming" products with no UI designer on the team; DM founders with a 2-screen sample redesign.',
                        channel: 'platform',
                        difficulty: 'moderate',
                      },
                      {
                        id: 'startup_slack_communities',
                        label: 'Startup Slack / Discord community offers',
                        description:
                          'Post in founder communities (e.g., Indie Hackers, UI Brew) offering a free 30-min UI review for any early-stage app.',
                        channel: 'community',
                        difficulty: 'easy',
                      },
                    ],
                  },
                  {
                    id: 'investor_deck_prototype',
                    label: 'Investor Deck + Prototype Package',
                    description:
                      'Interactive Figma prototype of the product (8–12 screens) plus a polished investor deck with product mockups embedded.',
                    priceRange: '$3,500',
                    deliveryFormat: '14-day delivery with 2 revision rounds',
                    positioningTemplate: 'I help early-stage founders win investor confidence through interactive prototypes and polished investor decks.',
                    simulatorWeights: { demand: 7, competition: 5, execution_speed: 6 },
                    clientSources: [
                      {
                        id: 'yc_founder_referrals',
                        label: 'YC / accelerator cohort founder referrals',
                        description:
                          'Offer a discounted package to the first 3 founders from any new accelerator batch in exchange for referrals.',
                        channel: 'referral',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'saas_products',
            label: 'SaaS Products',
            description:
              'Established SaaS companies needing dashboard UI redesigns, design system creation, or feature-specific screen designs.',
            niches: [
              {
                id: 'b2b_dashboard_products',
                label: 'B2B dashboard / analytics products',
                description:
                  'SaaS companies with complex data dashboards, charts, and tables that need clarity, consistency, and usability improvements.',
                offers: [
                  {
                    id: 'dashboard_ui_redesign_3_views',
                    label: 'Dashboard UI Redesign (3 key views)',
                    description:
                      'Redesign of 3 core dashboard views with data visualisation improvements, interaction patterns, and a reusable chart component system.',
                    priceRange: '$4,000',
                    deliveryFormat: 'Figma + interactive prototype within 3 weeks, design token documentation included',
                    positioningTemplate: 'I help B2B SaaS products reduce user churn through clarity-driven dashboard UI redesigns with reusable component systems.',
                    simulatorWeights: { demand: 7, competition: 6, execution_speed: 5 },
                    clientSources: [
                      {
                        id: 'crunchbase_product_hunt',
                        label: 'Crunchbase-identified Series A companies with poor UI',
                        description:
                          'Identify Series A SaaS companies on Crunchbase that have not raised a design round; audit their public UI and send a sample redesign of one screen.',
                        channel: 'cold_outreach',
                        difficulty: 'hard',
                      },
                      {
                        id: 'dribbble_inbound',
                        label: 'Dribbble shot inbound from dashboard design posts',
                        description:
                          'Post a before/after dashboard redesign case study on Dribbble; inbound leads from CTOs searching for UI talent.',
                        channel: 'platform',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'brand_identity_visual_systems',
        label: 'Brand Identity & Visual Systems',
        description:
          'Full brand identity packages including logo, colour systems, typography, and multi-platform brand guidelines.',
        markets: [
          {
            id: 'personal_brands',
            label: 'Personal Brands',
            description:
              'Founders, creators, and executives building a visual identity across LinkedIn, Twitter, website, and email.',
            niches: [
              {
                id: 'linkedin_thought_leaders',
                label: 'LinkedIn thought leaders building a personal brand',
                description:
                  'Professionals posting daily LinkedIn content who need a consistent visual identity across their profile, banner, carousels, and lead magnets.',
                offers: [
                  {
                    id: 'personal_brand_identity',
                    label: 'Personal Brand Identity System',
                    description:
                      'Logo, wordmark, colour palette, typography selection, LinkedIn banner template, carousel template, and brand guidelines PDF.',
                    priceRange: '$1,800',
                    deliveryFormat: 'Figma brand kit + guidelines PDF within 7 days',
                    positioningTemplate: 'I help LinkedIn thought leaders get noticed by their dream clients through a cohesive personal brand identity system.',
                    simulatorWeights: { demand: 6, competition: 5, execution_speed: 8 },
                    clientSources: [
                      {
                        id: 'linkedin_creator_dm',
                        label: 'LinkedIn creator DM campaign to top-voice aspirants',
                        description:
                          'Identify professionals with "Open to Work" or who post 3x+/week but have inconsistent visuals; DM a free brand audit of their current profile.',
                        channel: 'cold_outreach',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'creator_economy_founders',
                label: 'Creator economy founders',
                description:
                  'Founders building audience monetisation tools, platforms, or agencies who need a recognisable brand across multiple channels.',
                offers: [
                  {
                    id: 'creator_brand_kit_multi_platform',
                    label: 'Creator Brand Kit (multi-platform)',
                    description:
                      'Full brand system including logo variations, social media kit (Instagram, Twitter, YouTube, TikTok), email signature, and merch-ready assets.',
                    priceRange: '$2,200',
                    deliveryFormat: '14-day delivery with platform-specific export files',
                    positioningTemplate: 'I help creator economy founders build a recognisable brand across every platform through a multi-platform visual identity kit.',
                    simulatorWeights: { demand: 6, competition: 4, execution_speed: 7 },
                    clientSources: [
                      {
                        id: 'indie_hackers_branding',
                        label: 'Indie Hackers / MicroConf community engagement',
                        description:
                          'Engage in Indie Hackers product launches and critique branding; offer a free logo sketch for new launches.',
                        channel: 'community',
                        difficulty: 'easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'ecommerce_brands',
            label: 'E-commerce Brands',
            description:
              'Direct-to-consumer and lifestyle brands needing packaging, storefront, and campaign visual systems.',
            niches: [
              {
                id: 'dtc_supplement_brands',
                label: 'DTC supplement brands',
                description:
                  'Direct-to-consumer supplement and wellness brands needing product packaging design and cohesive Shopify storefront visuals.',
                offers: [
                  {
                    id: 'product_packaging_storefront',
                    label: 'Product Packaging + Storefront Design',
                    description:
                      'Product label design, supplement fact panel layout, Shopify home page, product page, and collection page templates.',
                    priceRange: '$3,500',
                    deliveryFormat: 'Print-ready files + Figma storefront components within 3 weeks',
                    positioningTemplate: 'I help DTC supplement brands increase shelf appeal through professional product packaging and cohesive storefront design.',
                    simulatorWeights: { demand: 6, competition: 5, execution_speed: 6 },
                    clientSources: [
                      {
                        id: 'amazon_brand_registry',
                        label: 'Amazon DTC brand analysis + cold outreach',
                        description:
                          'Analyse Amazon supplement brands with weak branding and no direct website; pitch a DTC storefront + packaging redesign.',
                        channel: 'cold_outreach',
                        difficulty: 'hard',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'ux_research_conversion_audits',
        label: 'UX Research & Conversion Audits',
        description:
          'Data-driven usability audits, conversion funnel analysis, and UX research to improve retention and revenue.',
        markets: [
          {
            id: 'dtc_brands_ux',
            label: 'DTC Brands',
            description:
              'Direct-to-consumer brands looking to improve checkout conversion, retention flows, and on-boarding experiences.',
            niches: [
              {
                id: 'checkout_optimization',
                label: 'Checkout optimisation seekers',
                description:
                  'DTC brands with >60% cart abandonment rate who need a UX audit of their checkout and payment flow.',
                offers: [
                  {
                    id: 'conversion_funnel_ux_audit',
                    label: 'Conversion Funnel UX Audit',
                    description:
                      'Heuristic UX audit of the full purchase funnel (home → product → cart → checkout → thank you) with actionable recommendations and annotated wireframes.',
                    priceRange: '$1,500',
                    deliveryFormat: 'PDF report + annotated Figma file within 5 days',
                    positioningTemplate: 'I help DTC brands recover lost revenue through data-driven conversion funnel UX audits with actionable recommendations.',
                    simulatorWeights: { demand: 7, competition: 5, execution_speed: 8 },
                    clientSources: [
                      {
                        id: 'hotjar_public_outreach',
                        label: 'Hotjar / Microsoft Clarity public heatmap analysis',
                        description:
                          'Identify DTC sites with public Clarity session recordings showing checkout drop-off; offer a free checkout UX screenshot audit.',
                        channel: 'cold_outreach',
                        difficulty: 'hard',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'content_platforms_ux',
            label: 'Content Platforms',
            description:
              'Newsletter platforms, online communities, and content marketplaces needing improved onboarding and engagement UX.',
            niches: [
              {
                id: 'onboarding_flow_improvement',
                label: 'Newsletter / subscription platforms improving onboarding',
                description:
                  'Platforms with low activation rates (<30%) who need a UX review of their sign-up → first-value flow.',
                offers: [
                  {
                    id: 'onboarding_flow_ux_review',
                    label: 'Onboarding Flow UX Review',
                    description:
                      'Review of the complete onboarding flow with cognitive walkthrough, first-impression testing, and redesigned screen mockups for the 3 highest-impact screens.',
                    priceRange: '$1,200',
                    deliveryFormat: 'Research report + 3 annotated mockups within 5 days',
                    positioningTemplate: 'I help subscription platforms improve activation rates through cognitive UX reviews and high-impact onboarding mockups.',
                    simulatorWeights: { demand: 6, competition: 4, execution_speed: 8 },
                    clientSources: [
                      {
                        id: 'posthog_analysis_outreach',
                        label: 'Public Posthog / Amplitude product tour analysis',
                        description:
                          'Analyse public product walkthroughs on platforms like Posthog\'s blog; identify platforms with drop-off indicators and pitch an audit.',
                        channel: 'platform',
                        difficulty: 'moderate',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'landing_page_design',
        label: 'Landing Page Design',
        description:
          'Conversion-focused landing pages for coaches, consultants, and service businesses designed to turn visitors into leads or booked clients.',
        markets: [
          {
            id: 'coaches',
            label: 'Coaches & Consultants',
            description:
              'Online coaches and consultants selling programmes, 1-on-1 sessions, or group offers who need a landing page that converts traffic into bookings.',
            niches: [
              {
                id: 'fitness_coaches',
                label: 'Fitness coaches converting visitors to clients',
                description:
                  'Personal trainers and fitness coaches with social media traffic but low consultation booking rates due to a weak or unclear landing page.',
                offers: [
                  {
                    id: 'fitness_coach_conversion_landing_page',
                    label: 'Fitness Coach Conversion Landing Page',
                    description:
                      'Single conversion-focused landing page designed in Figma and delivered as a developer-ready file. Includes hero, offer breakdown, testimonials section, FAQ, and booking CTA.',
                    priceRange: '$1,500',
                    deliveryFormat: 'Figma design file + annotated handoff within 7 days',
                    positioningTemplate:
                      'I help fitness coaches attract more paying clients through conversion-focused landing pages that turn visitors into consultation bookings.',
                    simulatorWeights: { demand: 9, competition: 7, execution_speed: 8 },
                    clientSources: [
                      {
                        id: 'instagram_fitness_coach_dm_outreach',
                        label: 'Instagram fitness coach cold DM',
                        description:
                          'Identify fitness coaches with 5K+ followers posting daily but linking to a weak landing page; DM a free CTA audit of their bio link page.',
                        channel: 'cold_outreach',
                        difficulty: 'moderate',
                      },
                      {
                        id: 'fitness_creator_community_referral',
                        label: 'Fitness creator community referrals',
                        description:
                          'Engage in online fitness coach communities (Facebook groups, coaching forums) and offer a free landing page teardown to 3 members.',
                        channel: 'community',
                        difficulty: 'easy',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
