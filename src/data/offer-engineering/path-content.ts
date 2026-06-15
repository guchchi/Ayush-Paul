import type {
  OfferEngineeringPathContent,
  OfferEngineeringPathContentMap,
  PathContentKey,
} from './path-content-types';

/* ───────────────────────────────────────────────
 *  Helper to cast string literals to PathContentKey
 * ─────────────────────────────────────────────── */

function key(s: string): PathContentKey {
  return s as PathContentKey;
}

/* ───────────────────────────────────────────────
 *  Path-specific content entries
 *
 *  Key format: `${subTrackId}_${marketId}`
 *  Match against MARKET_ADAPTER_MAP keys.
 * ─────────────────────────────────────────────── */

export const OFFER_ENGINEERING_PATH_CONTENT: OfferEngineeringPathContentMap = {

  /* ── Short-Form Editor × Coaches ── */
  [key('short_form_editor_coaches')]: {
    pathTitle: 'Coach Short-Form Authority System',
    audienceInsight:
      'Coaches sell trust and transformation, not products. Their short-form content needs to demonstrate expertise in 15–60 seconds — a single clip must communicate authority, empathy, and a clear next step. Generic trending edits fail here because coaches compete on credibility, not entertainment.',
    offerStrategy:
      'Position this as a thought leadership clip system, not a generic editing service. Each clip should extract a specific coaching insight, frame it as a teachable moment, and end with an authority-building CTA. The coach posts these to attract discovery call bookings, not vanity views.',
    recommendedOfferType: 'retainer',

    deliverables: [
      {
        label: 'Insight Extraction Reel',
        description:
          'One polished short-form clip per week extracted from the coach\'s long-form content — podcast appearances, webinar recordings, or client sessions — framed as a standalone teaching moment.',
        whyItMatters:
          'Coaches rarely have time to repurpose their own content. A weekly clip pulled from existing material turns one recorded hour into a month of authority-building posts without extra recording.',
      },
      {
        label: 'Hook-First Caption Package',
        description:
          'Platform-optimised caption with a scroll-stopping first line, 3–5 bullet insights, and a soft CTA that invites comments or DMs rather than hard-selling.',
        whyItMatters:
          'Coaches convert through conversation, not direct sales. A caption that starts a dialogue in the comments creates warm leads without feeling pushy.',
      },
      {
        label: 'Authority Stack Thumbnail Set',
        description:
          'Custom thumbnail or cover frame featuring the coach\'s face, a teaser quote, and visual branding — consistent across every post so followers recognise the series.',
        whyItMatters:
          'Coaches build personal brands. A recognisable thumbnail style means followers stop scrolling when they see the coach\'s face, increasing repeat viewership and trust.',
      },
      {
        label: 'Trending Audio Adaptation',
        description:
          'Monthly review of trending audio and formats relevant to the coaching niche, with recommendations for which trends the coach can authentically join without diluting their authority.',
        whyItMatters:
          'Coaches fear trends feel unprofessional. Showing them which trends actually reinforce their authority (instead of chasing viral dance clips) keeps content timely without losing credibility.',
      },
      {
        label: 'Engagement Response Scripts',
        description:
          'Three pre-written comment replies and one DM template per clip, designed to convert engaged viewers into discovery call bookings.',
        whyItMatters:
          'A clip that gets comments but no reply strategy is a missed lead. Pre-written scripts remove the coach\'s hesitation about what to say next.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Authority Extraction Engine',
        description:
          'A repeatable system for scanning any long-form coaching content and pulling the single most teachable 60-second moment that builds credibility and invites engagement.',
        bestFor:
          'Coaches who already record podcasts, webinars, or client sessions but have no process for mining those recordings into daily social proof.',
      },
      {
        name: 'Consultation Velocity Method',
        description:
          'A clip structure designed specifically to end with a low-friction CTA — not "link in bio" but a conversation starter that leads to discovery call bookings within 3 replies.',
        bestFor:
          'Coaches whose goal is paid discovery calls or consultation bookings, not content virality.',
      },
      {
        name: 'Trust Stack Pacing Framework',
        description:
          'A three-beat editing pattern: open with a specific client win or credential, deliver one actionable insight, close with an invitation to go deeper. Every clip builds the trust stack one layer at a time.',
        bestFor:
          'Coaches in crowded niches where differentiation comes from demonstrated expertise, not production flash.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '5 business days per batch of 4 clips',
      revisions: '2 revision rounds per clip',
      feedbackRounds: '2 rounds of structural feedback per batch',
      communication: 'Async via Loom and Slack',
      responseTime: 'Within 12 hours during business days',
      scopeWarning:
        'Coaches often request clips from poor-quality source audio (Zoom recordings, phone videos). Set a minimum audio quality threshold upfront, or include a basic audio cleanup pass in scope to avoid friction.',
    },

    valueAmplifiers: [
      {
        label: 'Discovery Call Script Pack',
        description:
          'A 3-page framework for what to say when a prospect books a call after seeing a clip — including the first 30 seconds, the qualification questions, and the close.',
        whyItWorks:
          'Coaches who get calls from clip views often fumble the transition from content consumer to paying client. This removes that gap.',
      },
      {
        label: 'Monthly Content Audit',
        description:
          'A 30-minute monthly review of which clips drove the most engagement and bookings, with specific recommendations for the next month\'s content direction.',
        whyItWorks:
          'Coaches need feedback loops. A monthly audit turns content from a guessing game into a predictable lead generation channel.',
      },
      {
        label: 'Hook Scorecard',
        description:
          'A written analysis of each clip\'s first 3 seconds with a retention score, a pacing score, and one specific change to improve the next batch.',
        whyItWorks:
          'Coaches who understand why a clip worked will make better content decisions long-term. The scorecard teaches the principle behind the edit.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'tiered',
      beginnerRange: '$800–$1,200/month',
      intermediateRange: '$1,500–$2,500/month',
      premiumRange: '$3,000–$5,000/month',
      pricingLogic:
        'Coach retainer pricing should scale with clip volume and source material complexity. A coach who sends polished podcast episodes weekly is easier to edit for than one who sends raw Zoom recordings. Tier by output (4, 8, 12 clips/month) rather than by "level." The highest tier includes the Monthly Content Audit amplifier.',
    },

    proposalAngle: {
      headline: 'Coach Authority Clip System — Turn Every Insight Into a Booking',
      problem:
        'You record podcasts, webinars, and client sessions, but the best coaching moments stay buried inside hour-long recordings instead of becoming daily short-form content that fills your discovery call calendar.',
      solution:
        'Each week I extract one powerful teaching moment from your existing content and turn it into a polished short clip with a hook-first caption, a recognisable thumbnail, and a comment strategy that turns viewers into booked calls — without you recording a single new video.',
      nextStep:
        'Send me one recorded coaching session or podcast episode. I will send back a sample clip within 48 hours so you can see exactly how your content sounds as a short-form post before committing to anything.',
    },

    blueprintAngle: {
      whoItIsFor:
        'Coaches and consultants who already record long-form content — podcast episodes, webinar replays, client sessions — but lack a repeatable system for turning those recordings into daily short-form authority clips that attract ideal clients.',
      problemItSolves:
        'Most coaches know short-form content drives bookings, but repurposing an hour of recording into 60 seconds of scroll-stopping clip is a separate skill from coaching. Without a system, either nothing gets posted, or clips feel flat and fail to convert.',
      corePromise:
        'A weekly short-form clip extracted from your existing content, edited for authority and booked-call conversion, with a caption and engagement strategy designed to start conversations — not just collect views.',
      whyThisWorks:
        'Coaches who post consistently from existing content see 2–3x more discovery call bookings than those who post sporadically, because every clip reinforces the same expertise. The system removes the production bottleneck so you stay visible without adding recording time.',
      nextStepCTA:
        'Send this blueprint to coaching prospects as a retainer proposal. The best next step is a 15-minute call to review one recent recording and identify your first three clip opportunities.',
    },
  },

  /* ── YouTube Editor × YouTube Creators ── */
  [key('youtube_editor_youtube_creators')]: {
    pathTitle: 'YouTube Retention Editing System',
    audienceInsight:
      'YouTube creators live and die by audience retention. The difference between a 40% and 60% retention rate can double a video\'s long-term views. These creators need an editor who thinks in retention curves, not timelines — someone who can spot a pacing dip before it happens and restructure a section to keep viewers watching.',
    offerStrategy:
      'This is not a generic "I edit videos" offer. Position it as a retention engineering service. The deliverable is not a finished video — it is a higher AVD (average view duration). Creators pay for more watch time, not for cuts.',
    recommendedOfferType: 'milestone_based',

    deliverables: [
      {
        label: 'Retention-Optimised Rough Cut',
        description:
          'Full video edit structured around the audience retention curve — hook placement, pacing adjustments, pattern interrupts every 90 seconds, and cut points for maximum watch time.',
        whyItMatters:
          'Most creators get editing that looks good but does not keep viewers watching. A retention-first rough cut directly improves the metric YouTube\'s algorithm rewards most: average view duration.',
      },
      {
        label: 'Hook Analysis Report',
        description:
          'A written breakdown of the first 30 seconds with a retention prediction score, a comparison to the creator\'s channel average, and specific notes on what to reshoot or re-record if the hook underperforms.',
        whyItMatters:
          'The first 30 seconds determine 50%+ of a video\'s retention curve. A hook analysis before the final edit catches retention-killing openings before they go live.',
      },
      {
        label: 'Pattern Interrupt Map',
        description:
          'Timestamps marking where pacing shifts, visual changes, or information drops should occur throughout the video — built into the edit timeline as reference markers.',
        whyItMatters:
          'Viewers mentally check out every 60–90 seconds. Strategic pattern interrupts re-engage them before they click away. A map ensures no section runs too long without a visual or tonal shift.',
      },
      {
        label: 'End Screen Optimisation Layout',
        description:
          'Custom end screen design with strategically placed video recommendations, subscribe button, and a clickable CTA that follows retention best practices for the creator\'s specific audience.',
        whyItMatters:
          'A well-placed end screen can recover 10–15% of viewers who would otherwise leave after the main content ends. Most creators waste this real estate on generic suggestions.',
      },
      {
        label: 'Thumbnail Heatmap Suggestion',
        description:
          'A thumbnail concept brief with two variants, including colour contrast notes, face placement guidance, and a curiosity gap headline — based on what is currently performing in the creator\'s niche.',
        whyItMatters:
          'Thumbnail CTR and video retention are linked. A thumbnail that overpromises creates a retention drop in the first 30 seconds. Heatmap suggestions align the thumbnail promise with the actual video pacing.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Retention Curve Engineering Process',
        description:
          'A structured editing workflow that starts with mapping the target retention curve before making a single cut. Every editing decision ties back to whether it improves or hurts watch time at that point in the video.',
        bestFor:
          'YouTube creators who care about analytics and understand that retention is their primary growth lever — not editors looking for a generic workflow.',
      },
      {
        name: '90-Second Pacing Protocol',
        description:
          'A rule-based editing system that inserts a pattern interrupt — visual change, topic shift, or pacing acceleration — every 90 seconds without fail, then tightens or loosens based on the content type.',
        bestFor:
          'Educational or commentary creators whose content naturally trends toward longer takes and needs forced pacing discipline to maintain engagement.',
      },
      {
        name: 'Retrospective Hook Optimisation',
        description:
          'A review process applied after the first rough cut: the first 60 seconds are re-edited 3 times with different pacing approaches, then the best version is selected based on a retention prediction score.',
        bestFor:
          'Creators whose first-draft hooks consistently underperform. This mechanism treats the hook as a testable asset rather than a one-shot decision.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '10 business days per 15–25 minute video',
      revisions: '2 rounds of revisions on the rough cut',
      feedbackRounds: '1 round of structural feedback before the rough cut',
      communication: 'Async via Slack with weekly sync calls',
      responseTime: 'Within 24 hours',
      scopeWarning:
        'Creators often underestimate how much time raw footage review takes when delivery timelines are tight. Factor in at least 2 hours of footage review per 10 minutes of final runtime before the first edit. Spell this out upfront so scope expectations are realistic.',
    },

    valueAmplifiers: [
      {
        label: 'Retention Graph Post-Mortem',
        description:
          'A 15-minute Loom review of the final video\'s retention graph 7 days after publishing — what worked, where viewers dropped, and what to adjust for the next video.',
        whyItWorks:
          'Most editors never see the analytics. Closing the loop between edit decisions and actual retention data makes every subsequent video better than the last.',
      },
      {
        label: 'Title & Hook Lab',
        description:
          'A 30-minute co-working session to brainstorm and pressure-test 5 video title and hook combinations before the creator records, so the edit starts with a strong opening already planned.',
        whyItWorks:
          'When the creator films with a retention-aware opening, the editor has better material to work with. This upstream shift reduces editing time and improves final retention.',
      },
      {
        label: 'A/B Thumbnail Variant',
        description:
          'A second thumbnail concept delivered with the final edit, ready for YouTube\'s thumbnail A/B testing feature, with a prediction note on which variant will likely perform better.',
        whyItWorks:
          'Thumbnail A/B testing is underused. Providing a second variant as a standard deliverable increases the creator\'s chance of finding a winning thumbnail without extra back-and-forth.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'value_based',
      beginnerRange: '$400–$800 per video',
      intermediateRange: '$1,000–$1,800 per video',
      premiumRange: '$2,000–$4,000 per video',
      pricingLogic:
        'YouTube editing pricing should reflect the creator\'s channel size and revenue per video, not just video length. A creator earning $5K/month per video can justify a higher edit cost because improved retention directly increases ad revenue. Price as a percentage of estimated video revenue (15–25%) rather than a flat per-minute rate. This naturally scales with channel growth.',
    },

    proposalAngle: {
      headline: 'Retention Engineering for YouTube — Higher Watch Time, Predictable Growth',
      problem:
        'Your videos look good but the retention graph tells a different story. Viewers drop off in the middle, the hook does not hold, and you know better pacing would keep people watching — but editing your own videos leaves no time to optimise for retention.',
      solution:
        'I edit your videos around a target retention curve, not just around cuts. Every pacing decision, pattern interrupt, and hook adjustment is made to improve a specific metric: average view duration. The result is a video that keeps more people watching longer and tells YouTube\'s algorithm to show it to more subscribers.',
      nextStep:
        'Send me your last 3 videos with retention graphs. I will analyse where viewers dropped in each one and send back a 3-point optimisation plan for your next video — no commitment required.',
    },

    blueprintAngle: {
      whoItIsFor:
        'YouTube creators who publish 15–30 minute videos weekly and understand that audience retention is the single most important growth metric — creators who have outgrown basic editing and need a retention-focused partner, not just a cutter.',
      problemItSolves:
        'Most freelance editors cut to the timeline, not to the retention curve. Creators end up with clean edits that still lose viewers in the middle because pacing, pattern interrupts, and hook placement were afterthoughts rather than the core of the editing process.',
      corePromise:
        'A retention-engineered video edit built around a target curve, with hook analysis, 90-second pacing discipline, and a post-publishing retention review — so every video measurably improves watch time over the last one.',
      whyThisWorks:
        'YouTube\'s algorithm prioritises watch time and session duration above all other signals. A video that holds viewers for 60% of its runtime will outrank a similar video with 40% retention even if everything else is equal. Improving retention is the highest-leverage editing investment a creator can make.',
      nextStepCTA:
        'Share this blueprint with YouTube creators who track their analytics. The next step is a 15-minute call to review their last 3 retention graphs and identify the single highest-impact editing change for their next video.',
    },
  },

  /* ── WordPress Developer × Local Businesses ── */
  [key('wordpress_developer_local_businesses')]: {
    pathTitle: 'Local Business Lead Engine — WordPress',
    audienceInsight:
      'Local business owners are not looking for a beautiful website. They are looking for more phone calls, walk-ins, and bookings. They have been burned by agencies that overcharged for fancy designs that did not bring in a single customer. They need a site that loads fast on a phone, shows up in Google Maps results, and makes it dead simple for a customer to call or book.',
    offerStrategy:
      'Position this as a local lead generation system, not a web design service. Every page, button, and section should serve one purpose: getting the phone to ring or the booking form to submit. Remove decorative fluff. Replace it with trust signals, local SEO structure, and frictionless contact paths.',
    recommendedOfferType: 'one_time_project',

    deliverables: [
      {
        label: 'Mobile-First Lead Capture Theme',
        description:
          'A custom WordPress theme built mobile-first — not adapted from desktop — with thumb-sized tap targets, a sticky call button, and a contact form that auto-fills location info from Google Maps.',
        whyItMatters:
          '70%+ of local business website visits come from mobile. A theme designed desktop-first then squished into mobile breaks the booking flow. Mobile-first means the phone call button is always one tap away, no matter where the customer scrolls.',
      },
      {
        label: 'Local SEO Content Architecture',
        description:
          'A 5-page structure (Home, Services, About, Reviews, Contact) with neighbourhood-specific landing pages, schema markup for local business, and Google Business Profile optimisation guidance.',
        whyItMatters:
          'Local businesses live and die by "near me" searches. A standard site structure misses local search signals. Neighbourhood-specific pages capture search traffic for "plumber in [neighbourhood]" queries that generic sites ignore.',
      },
      {
        label: 'Review & Trust Signal Integration',
        description:
          'Live Google Reviews feed, before/after photo gallery, and trust badge section integrated into the theme — not pasted as screenshots but dynamically pulling from Google Business Profile.',
        whyItMatters:
          'Local customers check reviews before calling. A site with stale or missing reviews loses trust. Live review feeds show the business is active and customers are talking.',
      },
      {
        label: 'Booking & Contact Flow',
        description:
          'A streamlined contact path — click-to-call button, same-page booking form with calendar integration (Acuity/Caledar), and an auto-responder that sends the business\'s address and hours to the customer\'s phone.',
        whyItMatters:
          'Every extra click between "I want this service" and "contact the business" loses a conversion. A one-tap call button doubles conversion rate compared to a contact form alone for local service businesses.',
      },
      {
        label: 'Performance Baseline Guarantee',
        description:
          'The delivered site scores 85+ on Lighthouse mobile performance, passes Core Web Vitals, and includes a performance monitoring report for the first 30 days with recommendations.',
        whyItMatters:
          'Local businesses rarely audit site speed. A slow site that takes 4 seconds to load loses 50% of mobile visitors. Guaranteeing performance means the business does not have to wonder whether their site is actually fast enough.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Neighbourhood Capture Grid',
        description:
          'A page structure that creates individual landing pages for each neighbourhood or suburb the business serves, each optimised for local search terms and featuring a unique trust signal (local landmark, neighbourhood-specific review).',
        bestFor:
          'Local service businesses (plumbers, electricians, cleaners, dentists) who serve multiple neighbourhoods and are losing search traffic to competitors who have neighbourhood-specific pages.',
      },
      {
        name: 'Tap-to-Convert Architecture',
        description:
          'A mobile-first design rule: every page section ends with a tap target — a phone number, a booking button, or a "get directions" link — within thumb reach. No section leaves the user without a clear one-thumb action.',
        bestFor:
          'Any local business where the primary conversion action happens on a phone: calling, booking, or getting directions.',
      },
      {
        name: 'Proof-on-Arrival System',
        description:
          'The first section below the hero is always social proof — live review count, number of jobs completed, or a photo of a recent project — not a generic "about us" paragraph. Trust before information.',
        bestFor:
          'Local businesses new to digital presence who need to establish credibility immediately rather than asking visitors to scroll to find testimonials.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '3 weeks for initial build',
      revisions: '2 revision rounds on design before development',
      feedbackRounds: '2 rounds of content review',
      communication: 'Async via email + 2 checkpoint calls',
      responseTime: 'Within 24 hours',
      scopeWarning:
        'Local business owners frequently request changes to content they have not yet provided ("can we add a services page for X?") after the build has started. Require all page content (text, photos, reviews) before the development phase begins. Any new pages after that point are scope change.',
    },

    valueAmplifiers: [
      {
        label: 'Google Business Profile Optimisation',
        description:
          'Audit and optimisation of the business\'s Google Business Profile — category selection, service menu, Q&A seeding, photo upload strategy, and post schedule — synced with the new website launch.',
        whyItWorks:
          'Google Business Profile drives more local leads than the website itself for many service businesses. Syncing the website launch with a GBP optimisation doubles the local search presence at minimal extra cost.',
      },
      {
        label: 'Local Citation Setup',
        description:
          'Consistent NAP (name, address, phone) listing across 15 top local directories (Yelp, Bing, Apple Maps, Nextdoor, etc.) with tracking to verify accuracy.',
        whyItWorks:
          'Inconsistent business listings across directories confuse Google\'s local ranking algorithm and hurt local pack rankings. A clean citation footprint improves local search position by removing ranking penalties.',
      },
      {
        label: '30-Day Conversion Check-In',
        description:
          'A 30-minute call 30 days after launch reviewing Google Search Console data, contact form submissions, call tracking numbers, and providing 3 specific recommendations to improve conversion rate.',
        whyItWorks:
          'Local business owners need a feedback loop to understand whether their new site is actually working. A data-driven check-in turns abstract "my website" into a measurable lead generation channel they can evaluate.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'flat_rate',
      beginnerRange: '$1,500–$2,500',
      intermediateRange: '$3,000–$5,000',
      premiumRange: '$6,000–$10,000',
      pricingLogic:
        'Local business websites should be priced as a flat project fee (not hourly) because the business owner needs a predictable cost to budget. The range depends on page count and integration complexity — a plumber needing 5 pages + click-to-call is at the low end; a dental practice needing 10 pages + booking integration + patient portal is at the high end. The premium tier includes citation setup and GBP optimisation as bundled amplifiers.',
    },

    proposalAngle: {
      headline: 'Local Lead Engine — A WordPress Site Built to Get You Calls, Not Just Clicks',
      problem:
        'Your current website looks fine but does not actually bring in customers. It is slow on phones, hard to find on Google, and visitors have to hunt for your phone number. You are paying for a site that looks professional but performs like a brochure.',
      solution:
        'I build a mobile-first WordPress site designed around one metric: how many people call or book after visiting. Every section ends with a tap-to-call button or a booking form. The site is structured to rank in local search, loads fast on any device, and comes with a performance guarantee so you know it is actually working.',
      nextStep:
        'Send me your business name and the neighbourhoods you serve. I will check whether your current site shows up in local search and send back a free local SEO audit with 3 specific opportunities you are currently missing.',
    },

    blueprintAngle: {
      whoItIsFor:
        'Local service businesses — plumbers, electricians, cleaners, dentists, landscapers, HVAC contractors — who need a website that actually generates leads, not just a digital business card that looks nice.',
      problemItSolves:
        'Most local business websites are built by generalist agencies that prioritise design over lead generation. The result: a beautiful, slow website that ranks poorly in local search, confuses mobile visitors, and buries the phone number behind three navigation clicks.',
      corePromise:
        'A mobile-first WordPress site that scores 85+ on Lighthouse performance, ranks for neighbourhood-specific local searches, and puts a tap-to-call button within thumb reach on every single page.',
      whyThisWorks:
        'Local search behaviour is transactional. Customers searching for "plumber near me" have a problem they need solved now, not a brand they want to discover. A fast, mobile-optimised site with clear contact paths and local SEO structure converts this intent into calls better than any design-heavy alternative.',
      nextStepCTA:
        'Send this blueprint to local business owners who are unhappy with their current website. Offer a free 15-minute local SEO audit of their current site as a no-pressure starting point.',
    },
  },

  /* /--- Short-Form Editor x Creators ---/ */
  [key('short_form_editor_creators')]: {
    pathTitle: 'Creator Short-Form Content Engine',
    audienceInsight:
      'Creators on Instagram and TikTok compete for scroll-stop in the first 1.5 seconds. Unlike coaches who build authority, general creators win or lose on entertainment value, relatability, and trend alignment. A single well-timed pattern interrupt or trending audio sync can push a video past 100K views, but a flat edit kills reach before the algorithm even measures engagement. These creators need an editor who thinks in hooks per second, not in timeline cuts.',
    offerStrategy:
      'Position as a short-form content partner who owns the entire production pipeline from raw footage to platform-optimised export. The creator films; the editor handles cutting, trending audio, captioning, thumbnail design, and posting schedule. Success is measured in consistency and engagement rate, not just view counts. The creator should never open a timeline again.',
    recommendedOfferType: 'retainer',

    deliverables: [
      {
        label: '3x Weekly Short-Form Package',
        description:
          'Three platform-ready short-form clips delivered every Monday -- edited for retention, synced to trending audio, captioned for sound-off viewing, and exported in platform-specific formats (9:16 for Reels/TikTok, 1:1 for feed, 16:9 for Shorts if applicable).',
        whyItMatters:
          'Consistency is the single biggest growth lever for short-form creators. A predictable weekly drop removes the every-morning scramble to post something, replacing it with a bank of polished content ready to publish.',
      },
      {
        label: 'Trending Audio Sync Report',
        description:
          'Weekly scan of rising audio tracks and format trends relevant to the creator\'s niche, with 2-3 recommendations for which trends fit their voice and a timeline for production.',
        whyItMatters:
          'Trending audio is the cheapest distribution boost on short-form platforms. A creator whose editor proactively identifies relevant trends posts content that rides algorithm tailwinds instead of fighting against them.',
      },
      {
        label: 'Hook-Optimised Caption Set',
        description:
          'Three caption variants per clip -- one scroll-stopping hook line, one curiosity gap, one question-based -- optimised for the first line\'s cut-off point on each platform so the most important text is always visible before the "see more" break.',
        whyItMatters:
          'The caption\'s first line is the second hook after the video itself. A caption that starts flat kills engagement even if the video is strong. Hook-optimised captions ensure the text amplifies the video rather than competing with it.',
      },
      {
        label: 'Platform-Specific Export Suite',
        description:
          'Each clip exported in three formats -- vertical (9:16) for Reels/TikTok, square (1:1) for feed, and horizontal (16:9) for YouTube Shorts -- with platform-appropriate caption styling and aspect-ratio-safe title overlays.',
        whyItMatters:
          'Cross-posting the same vertical video to all platforms looks lazy and tanks performance on square-dominant feeds. Platform-specific exports signal quality and maximise reach on each algorithm independently.',
      },
      {
        label: 'Weekly Performance Snapshot',
        description:
          'A 3-line summary of the previous week\'s clip performance -- views, saves, shares, and engagement rate -- with one specific recommendation for the next batch based on what resonated.',
        whyItMatters:
          'Creators need a closed feedback loop between editing decisions and performance data. A weekly snapshot makes the creator feel like the editor is invested in outcomes, not just output.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'First-1.5-Second Hook Audit',
        description:
          'Every clip\'s opening 1.5 seconds is reviewed against a 7-point hook checklist: visual motion, text overlay, facial expression, audio sync, pattern interrupt, curiosity gap, and platform best practice. Clips that fail 3+ points get restructured before delivery.',
        bestFor:
          'Creators whose content is solid but whose openers consistently underperform -- the video is good, but viewers do not stay long enough to discover that.',
      },
      {
        name: 'Trend Mapping Protocol',
        description:
          'A weekly research process that identifies rising audio, format shifts, and editing trends across Instagram, TikTok, and YouTube Shorts -- then maps each trend to the creator\'s niche with a feasibility score and production timeline.',
        bestFor:
          'Creators in fast-moving niches (comedy, commentary, lifestyle) where early trend adoption drives disproportionate reach but chasing every trend without a filter wastes production time.',
      },
      {
        name: 'Format Rotation System',
        description:
          'A 4-week content calendar that rotates between 6 short-form formats (talking head, stitch, B-roll heavy, text overlay, challenge/trend, educational) so the feed stays varied and the algorithm sees the creator as a versatile publisher, not a one-format pony.',
        bestFor:
          'Creators whose engagement plateaus because every post looks the same. Format rotation reintroduces novelty and re-engages followers who started scrolling past repetitive content.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '3 business days per 3-clip batch',
      revisions: '1 revision per clip',
      feedbackRounds: '1 round of direction feedback per batch',
      communication: 'Async via Slack',
      responseTime: 'Within 6 hours during business days',
      scopeWarning:
        'Creators often send raw footage in widely varying quality -- phone vertical, screen recordings, downloaded TikToks with watermarks. Define minimum resolution (1080p) and aspect ratio expectations upfront. Footage requiring significant cleanup (denoise, stabilisation, watermark removal) should be scoped as a value add or rejected at intake to avoid scope creep.',
    },

    valueAmplifiers: [
      {
        label: 'Platform Trend Calendar',
        description:
          'A monthly calendar of known upcoming events, holidays, and cultural moments relevant to the creator\'s niche, with pre-planned clip concepts for each date delivered 2 weeks in advance.',
        whyItWorks:
          'Timely content around cultural moments outperforms evergreen content by 3-5x in short-form feeds. A pre-planned calendar means the creator never misses a timely post because the idea was already in production.',
      },
      {
        label: 'Repurpose Kit',
        description:
          'Each weekly clip also delivered as a static social graphic (quote card, statistic card, or before/after comparison) for cross-posting to LinkedIn, Twitter, or a blog post.',
        whyItWorks:
          'Repurposing a clip into a static post takes 15 minutes for an editor but 45 minutes for a creator. Delivering it as a standard add-on increases the creator\'s cross-platform presence without any extra work on their end.',
      },
      {
        label: 'Monthly Strategy Call',
        description:
          'A 30-minute monthly video call to review what worked, what didn\'t, and plan the next month\'s content direction -- including format experiments, trend bets, and audience growth targets.',
        whyItWorks:
          'Editors who understand the creator\'s broader strategy produce better-aligned content. A monthly check-in turns a transactional editing relationship into a strategic partnership that the creator values beyond the edit itself.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'tiered',
      beginnerRange: '$600-$1,000/month',
      intermediateRange: '$1,200-$2,000/month',
      premiumRange: '$2,500-$4,000/month',
      pricingLogic:
        'Short-form retainer pricing should scale by output volume (clips per week) and source material quality. A creator who sends pre-planned talking-head recordings with clear timestamps is faster to edit than one who sends hours of B-roll and asks for highlight reels. Tier by weekly clip count (3, 6, 10/week) with a footage-quality surcharge for raw, unstructured source material. The premium tier includes the monthly strategy call and repurpose kit as bundled amplifiers.',
    },

    proposalAngle: {
      headline: 'Your Short-Form Pipeline -- Consistent Content Without the Editing Overhead',
      problem:
        'You know you need to post 3-5 times per week to stay relevant, but editing each clip takes 45 minutes. By the time you finish one, three trends have passed, and you are posting inconsistently because editing eats the time you should spend filming.',
      solution:
        'Send me your raw footage -- talking heads, B-roll, whatever you capture. I handle everything: cutting, trending audio, captions, thumbnails, and platform-specific exports. You film; I ship. You get a consistent 3-clip weekly package ready to post across Instagram, TikTok, and Shorts.',
      nextStep:
        'Send me your last 5 posts with engagement data. I will edit a 15-second clip from your best-performing format for free so you can see the quality before committing to a retainer.',
    },

    blueprintAngle: {
      whoItIsFor:
        'Short-form creators on Instagram, TikTok, and YouTube Shorts who understand that content consistency drives growth but are bottlenecked by the time editing takes away from filming and strategy.',
      problemItSolves:
        'Most creators either post inconsistently (because editing takes too long) or burn out trying to do everything themselves. A reliable editing partner removes the production bottleneck without making the content feel outsourced or generic.',
      corePromise:
        'A weekly 3-clip short-form package delivered every Monday -- edited for retention, synced to trending audio, captioned for sound-off viewing, and exported in platform-optimised formats -- so you never scramble for content again.',
      whyThisWorks:
        'Creators who post 3-5 times per week grow 2-3x faster than those who post 1-2 times per week because platform algorithms favour consistent publishers. Removing the editing bottleneck is the single highest-leverage investment a creator can make in their content schedule.',
      nextStepCTA:
        'Share this blueprint with creators who post less than 3 times per week and blame "not enough time." Offer a free 15-second clip edit from their best-performing recent video as a risk-free trial.',
    },
  },


  /* /--- Short-Form Editor x Agencies ---/ */
  [key('short_form_editor_agencies')]: {
    pathTitle: 'Agency White-Label Short-Form Department',
    audienceInsight:
      'Digital and social media agencies sell short-form content to their clients but rarely have in-house editing capacity that scales. They either overpay freelancers per clip, burn out their own team, or deliver inconsistent quality that damages client retention. They need a white-label editing partner who can absorb unpredictable volume spikes, match brand style guides across multiple clients, and deliver broadcast-quality clips on agency timelines without the agency ever admitting an outsourced hand touched the timeline.',
    offerStrategy:
      'Position as a white-label post-production department for agencies, not a freelance editor. The agency retains the client relationship; the editor is the invisible production engine. Every deliverable uses the agency\'s branding, naming conventions, and quality bar. The agency marks up the editing cost and presents it as their own. Success is measured in client retention and margin preservation, not individual clip performance.',
    recommendedOfferType: 'retainer',

    deliverables: [
      {
        label: 'Multi-Client Batch Workflow',
        description:
          'A structured intake system where the agency submits clip requests via a shared tracker with brand guidelines, source footage, and deadlines. Clips are delivered in agency-branded folders with platform-specific exports and a style consistency checklist per client.',
        whyItMatters:
          'Agencies managing 5-20 clients need a zero-friction handoff. A batch workflow with consistent naming, folder structure, and quality checklist means the agency account manager can review and forward without re-editing or reformatting.',
      },
      {
        label: 'Brand Style Lock File',
        description:
          'A per-client style guide document that captures typography, colour palette, caption tone, transition preferences, intro/outro treatment, and platform-specific formatting rules -- applied automatically to every clip for that client.',
        whyItMatters:
          'The biggest agency fear is inconsistent quality across deliverables. A style lock file ensures the agency\'s brand promise is kept even when different editors handle different batches, creating a seamless output that looks like one in-house team produced everything.',
      },
      {
        label: 'Agency-Facing Dashboard',
        description:
          'A weekly status report showing active projects, upcoming deadlines, clips in review, completed deliveries, and hours burned -- formatted for the agency to share with their own clients as a "production update."',
        whyItMatters:
          'Agencies need to look organised to retain clients. A professional dashboard that the agency can white-label and forward to their clients signals competence and transparency without revealing the outsourcing relationship.',
      },
      {
        label: 'Volume Scaling Addendum',
        description:
          'A pre-agreed surge capacity framework: base retainer covers X clips/week, with a predefined overflow rate and 48-hour turnaround for up to 2x volume. No renegotiation needed during busy months.',
        whyItMatters:
          'Agency workloads spike unpredictably -- campaign launches, holiday seasons, client emergencies. A pre-agreed scaling mechanism prevents the agency from having to find a new editor mid-crisis or overpaying for rush work.',
      },
      {
        label: 'Quarterly Quality Audit',
        description:
          'A quarterly review of all clips delivered in the previous 3 months, assessing consistency, platform performance trends, and 3 recommendations for improving the agency\'s short-form output quality across all clients.',
        whyItMatters:
          'Agencies that continuously improve retain clients longer. A quality audit shows the agency owner that their white-label partner is invested in raising the bar, not just collecting the retainer.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Invisible Handoff Protocol',
        description:
          'A delivery process that makes every clip look like it was produced in-house: agency-branded file naming, agency-standard colour grading, agency-specified caption formatting, and a "no logo, no watermark, no external references" rule that leaves zero trace of outsourced production.',
        bestFor:
          'Agencies that are sensitive about outsourcing perception and need their clients to believe all production happens internally.',
      },
      {
        name: 'Volume Surge Triggers',
        description:
          'A predefined threshold system: when the agency submits more than 120% of the base retainer volume in a given week, surge pricing auto-activates at a pre-agreed rate with a guaranteed 48-hour turnaround -- no negotiation, no delays, no excuses.',
        bestFor:
          'Agencies with seasonal or campaign-driven volume spikes who cannot predict their monthly workload but need guaranteed capacity during peaks.',
      },
      {
        name: 'Style Consistency Matrix',
        description:
          'A per-client scoring system that evaluates each delivered clip against 10 brand consistency criteria (typography, colour, pacing, caption tone, music style, transition type, intro, outro, thumbnail style, platform format). Any clip scoring below 8/10 gets automatically flagged for revision before delivery.',
        bestFor:
          'Agencies managing multiple clients in different niches who cannot afford a style mismatch that makes them look disorganised to a paying client.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '48 hours per clip batch',
      revisions: '2 rounds per clip',
      feedbackRounds: 'Intake form only; no discovery calls for standard requests',
      communication: 'Async via shared tracker and Slack channel',
      responseTime: 'Within 4 hours during business days',
      scopeWarning:
        'Agencies frequently send incomplete brand guidelines or change them mid-stream when a client pushes back. Require a signed-off brand style lock file per client before any work begins. Style changes after intake count as a new revision round, not a scope correction. Also flag that "quick favours" for existing clients will be tracked against the surge capacity, not comped.',
    },

    valueAmplifiers: [
      {
        label: 'Client-Facing Performance Report',
        description:
          'A monthly PDF report branded for the agency to send to each client, showing clips delivered, engagement metrics, platform growth trends, and content recommendations for the next month -- written as if the agency\'s own analytics team produced it.',
        whyItWorks:
          'Agencies that demonstrate measurable value retain clients longer. A white-label performance report lets the agency show ROI without having to build an analytics function in-house.',
      },
      {
        label: 'Competitor Content Scan',
        description:
          'A monthly review of what the agency\'s clients\' top 3 competitors are posting on short-form platforms, with a 1-page summary of content gaps and opportunities the agency can pitch to the client as a strategy upsell.',
        whyItWorks:
          'Agencies win by selling strategy, not just production. A competitor scan gives the agency account manager a reason to call the client with a value-add insight, reinforcing the agency\'s strategic value beyond content delivery.',
      },
      {
        label: 'Emergency Rush Lane',
        description:
          'A guaranteed 12-hour turnaround lane for urgent clips (client complaint response, trend-jacking, PR crisis) at a fixed premium rate with a dedicated editor slot held in reserve.',
        whyItWorks:
          'When an agency client has a crisis or a time-sensitive opportunity, the agency needs a guarantee, not a maybe. An emergency lane turns the editor from a vendor into a reliability partner the agency cannot afford to lose.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'tiered',
      beginnerRange: '$2,000-$3,500/month',
      intermediateRange: '$4,000-$7,000/month',
      premiumRange: '$8,000-$15,000/month',
      pricingLogic:
        'Agency pricing should be based on committed weekly clip volume across all clients, not per-client. A base retainer of 20 clips/week is the entry point. The agency marks up 50-100% and bills their clients individually. The premium tier adds the emergency rush lane, competitor content scan, and client-facing performance reports as bundled amplifiers. Price increases with volume commitment, not with individual clip cost -- the agency gets economies of scale as they commit to higher volume.',
    },

    proposalAngle: {
      headline: 'White-Label Short-Form Department -- Scale Your Agency\'s Content Production Without Hiring',
      problem:
        'Your agency sells short-form content to clients, but your editing capacity is the bottleneck. Hiring more editors is expensive and slow, freelancers are inconsistent, and your account managers spend more time managing production than selling strategy. Your clients are happy with the strategy but frustrated by the delivery.',
      solution:
        'I become your invisible post-production department. You send me clip requests with brand guidelines and source footage; I deliver polished, platform-ready clips with your branding, your naming conventions, and your quality bar. Your clients never know I exist. You retain the relationship, the margin, and the creative control.',
      nextStep:
        'Send me your current client roster with average monthly clip volumes. I will put together a white-label partnership proposal with a base retainer, surge pricing, and a sample clip from one of your existing clients -- edited to your brand standards -- so you can evaluate quality before committing.',
    },

    blueprintAngle: {
      whoItIsFor:
        'Digital agencies, social media agencies, and marketing firms that offer short-form content as a service to their clients but struggle to scale production without sacrificing quality or margin.',
      problemItSolves:
        'Most agencies either cap their short-form offering at what their in-house team can produce (leaving revenue on the table) or outsource to unreliable freelancers who miss deadlines and deliver inconsistent quality that damages client trust.',
      corePromise:
        'A white-label post-production partnership with predictable pricing, guaranteed turnaround, brand-locked consistency across all clients, and surge capacity for peak periods -- delivered as if your in-house team produced every clip.',
      whyThisWorks:
        'Agencies that outsource production while retaining client relationships grow faster than those that build in-house capacity for every function, because they convert fixed labour costs into variable costs and focus their team on higher-margin strategy and sales work. A reliable white-label partner is the difference between capping your short-form offering and scaling it.',
      nextStepCTA:
        'Share this blueprint with agency owners who are turning down content work because their team is at capacity. Offer a free sample clip from one of their existing clients as a quality proof point.',
    },
  },


  /* /--- YouTube Editor x Course Creators ---/ */
  [key('youtube_editor_course_creators')]: {
    pathTitle: 'Course Creator YouTube Funnel System',
    audienceInsight:
      'Course creators use YouTube as their primary lead generation channel -- free value on YouTube converts to paid course sales. Unlike entertainment creators who optimise for watch time alone, course creators need editing that balances educational depth with retention pacing. A video that teaches effectively but bleeds 60% of viewers by the halfway mark fails as a funnel asset. These creators need an editor who understands curriculum pacing, authority positioning, and the specific cadence of a free-to-paid conversion journey.',
    offerStrategy:
      'Position as a funnel-optimised editing service, not a general YouTube editor. Every editing decision serves the course sales funnel: the hook qualifies the viewer, the body delivers curriculum-grade value, the mid-roll and end-screen direct viewers toward the paid offer. The editor should think like a sales engineer who happens to edit video.',
    recommendedOfferType: 'retainer',

    deliverables: [
      {
        label: 'Funnel-Paced Edit',
        description:
          'Full video edit structured for educational retention: curriculum-style pacing with clear section markers, topic transitions every 3-5 minutes, pattern interrupts that reinforce the teaching point rather than distracting from it, and strategic pauses that let complex ideas land.',
        whyItMatters:
          'Course content has a different retention curve than entertainment. Viewers drop off when the teaching loses structure, not when it gets slow. Curriculum-paced editing keeps learners oriented and reduces cognitive load, directly improving the percentage who reach the offer.',
      },
      {
        label: 'Offer Integration Timing',
        description:
          'Strategically placed mid-roll and end-screen elements that introduce the paid course at the natural peak of viewer engagement -- not too early (before trust is built) and not too late (after viewers have already left). Includes CTA text overlays, verbal cue editing, and annotation markers.',
        whyItMatters:
          'A course creator\'s video is worthless if it teaches well but never converts. Offer integration timing determines whether a viewer finishes the video and buys the course or finishes the video and leaves without taking action.',
      },
      {
        label: 'Authority Credibility Package',
        description:
          'On-screen credential callouts, case study timestamps, testimonial overlays, and social proof inserts woven into the video at strategic trust-building moments -- edited from the creator\'s existing client results and credentials without feeling like bragging.',
        whyItMatters:
          'Course buyers purchase based on trust in the creator\'s expertise. A video that demonstrates authority through edited credibility signals converts better than one that simply teaches the material well.',
      },
      {
        label: 'Course Preview Integration',
        description:
          'Seamless excerpts from the paid course edited into the free video as a "what you get inside the full program" preview -- typically 30-60 seconds of premium content that demonstrates the gap between the free video and the paid course depth.',
        whyItMatters:
          'Viewers who see a sample of the paid course content are 3x more likely to purchase. A well-placed course preview creates a "I need the rest of this" feeling that no CTA button alone can generate.',
      },
      {
        label: 'Resource & Worksheet Packaging',
        description:
          'Free downloadable resource or worksheet edited into the video flow with visual callouts and a link in description that captures the viewer\'s email before they leave YouTube -- turning a viewer into a lead even if they do not buy the course immediately.',
        whyItMatters:
          'Not every viewer is ready to buy today. A resource download captures their email so the creator can nurture them through email sequences until they are ready to purchase the course.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Curriculum Retention Architecture',
        description:
          'An editing structure that treats each YouTube video as a lesson module: clear learning objective in the first 60 seconds, section-based navigation markers, summary recaps at transition points, and a "what you learned" closing segment that reinforces key takeaways before the offer.',
        bestFor:
          'Course creators whose videos have strong content but weak structure -- viewers get lost, confused, or overwhelmed and leave before the CTA.',
      },
      {
        name: 'Free-to-Paid Bridge Editing',
        description:
          'A specific editing pattern for the transition from free teaching to paid offer: 1) demonstrate a problem, 2) teach a partial solution, 3) show what the full solution looks like (course preview), 4) present the offer as the bridge from where the viewer is to where they want to be. The edit makes the offer feel like the natural next step, not an interruption.',
        bestFor:
          'Course creators who mention their course at the end and wonder why nobody buys. The bridge edit integrates the offer into the narrative arc of the video itself.',
      },
      {
        name: 'Authority Signal Mapping',
        description:
          'A pre-edit review of the creator\'s credentials, case studies, testimonials, and client results -- mapped to specific moments in the video where each signal carries maximum weight. The editor inserts each signal at the point where a viewer might doubt the creator\'s authority, pre-empting objections before they form.',
        bestFor:
          'Course creators in competitive niches where the viewer has multiple options and needs compelling reasons to choose this creator\'s course over alternatives.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '7 business days per 20-30 minute video',
      revisions: '2 rounds on the rough cut',
      feedbackRounds: '1 round of curriculum structure review before editing begins',
      communication: 'Async via Slack and Loom feedback',
      responseTime: 'Within 12 hours during business days',
      scopeWarning:
        'Course creators often change their course offer or pricing mid-stream, which can invalidate offer integration timing and CTA scripting. Lock the call to action and offer details (pricing, link, bonus) before the rough cut stage. Any changes to the offer after the rough cut should be scoped as additional revision rounds. Also clarify that course preview clips must be provided by the creator -- the editor does not have access to the paid course platform.',
    },

    valueAmplifiers: [
      {
        label: 'YouTube-to-Email Funnel Setup',
        description:
          'A landing page or link-in-description flow for the free resource/worksheet offered in the video, integrated with an email marketing platform (ConvertKit, MailerLite), including the opt-in form, delivery sequence, and a 3-email nurture sequence that promotes the course.',
        whyItWorks:
          'A video that captures email addresses is worth 10x more than one that does not. Setting up the capture-and-nurture infrastructure means the creator does not have to figure it out separately, and every new video feeds their email list automatically.',
      },
      {
        label: 'Retention Analytics Review',
        description:
          'A 20-minute monthly review of the creator\'s YouTube retention graphs for the previous month\'s videos -- identifying drop-off points, comparing retention curves across videos, and providing 3 specific editing adjustments for the next batch.',
        whyItWorks:
          'Educational content has predictable retention drop patterns (too much theory, unclear structure, weak transitions). A monthly retention review closes the feedback loop and systematically improves every video over time.',
      },
      {
        label: 'Offer Page Optimisation Notes',
        description:
          'A brief review of the course sales page or checkout funnel that the video links to, with 3-5 specific recommendations for improving conversion from video viewer to paying customer -- focused on the handoff from YouTube to the sales page.',
        whyItWorks:
          'Getting a viewer to click the link is only half the battle. If the sales page is poorly optimised, the video\'s conversion work is wasted. Optimising both sides of the handoff doubles the ROI of every video produced.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'tiered',
      beginnerRange: '$600-$1,000 per video',
      intermediateRange: '$1,200-$2,000 per video',
      premiumRange: '$2,500-$4,500 per video',
      pricingLogic:
        'Course creator pricing should be based on video length and conversion complexity, not just editing time. A 10-minute tutorial with a simple end-screen CTA is faster to edit than a 30-minute deep-dive with multiple offer integrations, curriculum pacing, and resource packaging. Tier by video length and number of offer integration points. The premium tier includes the YouTube-to-email funnel setup and retention analytics review as bundled amplifiers. Frame pricing as a percentage of estimated course revenue from YouTube traffic (5-10%) to justify the investment.',
    },

    proposalAngle: {
      headline: 'YouTube Funnel Editing -- Free Content That Actually Sells Your Course',
      problem:
        'Your YouTube videos teach valuable content but they are not converting viewers into course buyers. The teaching is solid, but the editing treats every video like a standalone tutorial instead of a funnel asset. Viewers learn what they need and leave without ever knowing you have a paid course that goes deeper.',
      solution:
        'I edit your YouTube videos as curriculum-paced funnel assets. Every video has a clear learning objective, strategic authority signals, a integrated course preview that demonstrates the gap between free and paid, and a resource download that captures emails -- so your free content works as a lead generation engine, not just a teaching tool.',
      nextStep:
        'Send me your best-performing YouTube video and your current course sales page. I will edit a 2-minute excerpt demonstrating the funnel approach -- with offer integration, authority signals, and a resource CTA -- so you can see the difference a funnel-focused edit makes.',
    },

    blueprintAngle: {
      whoItIsFor:
        'Course creators who use YouTube as their primary lead channel but are frustrated that their free content teaches well without converting viewers into paid students -- creators who need their videos to work harder as sales assets.',
      problemItSolves:
        'Most YouTube editors cut for retention and aesthetics, not for conversion. Course creators end up with polished videos that attract views but not buyers, because the editing never considers the free-to-paid journey as a structural element of the video itself.',
      corePromise:
        'A curriculum-paced, funnel-optimised video edit with offer integration timing, authority credibility signals, and a resource capture mechanism -- so every video feeds your course sales pipeline instead of just boosting your view count.',
      whyThisWorks:
        'Course creators who structure their YouTube content as a funnel -- free value -> email capture -> course offer -- generate 5-10x more course sales per video than those who treat YouTube as a pure content platform. The editing is the difference between a video that educates and a video that converts.',
      nextStepCTA:
        'Share this blueprint with course creators who have a YouTube presence but are not seeing course sales from their video content. Offer a free 10-minute audit of their best-performing video\'s conversion potential as a starting point.',
    },
  },


  /* /--- Podcast Clip Editor x Podcasters ---/ */
  [key('podcast_clip_editor_podcasters')]: {
    pathTitle: 'Podcast Clip Distribution Engine',
    audienceInsight:
      'Podcasters produce hours of long-form audio or video every week but capture only a fraction of that content as short-form social clips. The best podcast moments -- hot takes, guest stories, actionable advice -- stay buried inside episodes that most listeners never discover. Podcasters need an editor who can listen with a clip mentality: identifying the 60-second moments that work as standalone social posts, not just cutting out sections of the episode. The difference between a podcast clip that gets 10K views and one that gets 100 views is often entirely in the editing -- the pacing, the subtitle placement, the visual hook on a static podcast face.',
    offerStrategy:
      'Position as a podcast clip distribution system, not a podcast editor. The podcaster records the episode; the editor mines it for social gold. Deliver clips optimised for Instagram Reels, TikTok, YouTube Shorts, and Twitter/X -- each platform requires a different edit of the same moment. The podcaster\'s job is to show up and record; the editor\'s job is to make every episode generate 2 weeks of social content.',
    recommendedOfferType: 'retainer',

    deliverables: [
      {
        label: 'Weekly Clip Pack (5-7 Clips)',
        description:
          '5-7 short-form clips extracted from the week\'s episode, each 30-90 seconds long and edited as a standalone piece of content -- with subtitle animation, visual interest elements (B-roll, graphics, zooms), and a hook that works without context from the full episode.',
        whyItMatters:
          'A podcast episode is a content mine. Extracting 5-7 clips per episode turns one recording session into a week of social content, multiplying the episode\'s reach by 5-7x without the podcaster spending extra time recording.',
      },
      {
        label: 'Quote Card & Audiogram Set',
        description:
          'Each clip also delivered as a static quote card (text overlay on a branded background) and an audiogram (audio waveform animation) for platforms where video clips underperform -- Twitter/X, LinkedIn, or blog embeds.',
        whyItMatters:
          'Not every platform rewards short-form video the same way. Quote cards and audiograms give the podcaster platform-appropriate assets for Twitter and LinkedIn, where text-and-audio content often outperforms video clips.',
      },
      {
        label: 'Episode Teaser (Pre-Release)',
        description:
          'A 30-60 second teaser clip edited from the upcoming episode, delivered 24 hours before the episode publishes -- designed to build anticipation and drive early episode downloads.',
        whyItMatters:
          'Podcast download numbers are heavily influenced by first-week performance. A teaser clip that drives pre-release interest can double first-week downloads compared to episodes promoted only after publication.',
      },
      {
        label: 'Guest Share Clip',
        description:
          'A highlight clip focused on the guest\'s best moment, edited and branded for the guest to share with their audience -- including the guest\'s handle, a thank-you caption template, and a link to the full episode.',
        whyItMatters:
          'Guest-shared clips are the highest-converting promotion for podcast episodes because the guest\'s audience already trusts them. A share-ready clip removes the friction of the guest having to create their own promo content.',
      },
      {
        label: 'Clip Performance Report',
        description:
          'A weekly summary of which clips performed best across platforms -- views, shares, saves, and click-throughs to the full episode -- with a recommendation for which moments to prioritise in next week\'s clips.',
        whyItMatters:
          'Podcasters need data to refine their clip strategy. A performance report closes the feedback loop so each week\'s clips improve on the last, and the podcaster learns which topics and formats drive the most episode listens.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Clip-First Listening Process',
        description:
          'A structured listening workflow where the editor watches/listens to each episode with a specific clip-mining lens: mark timestamps for hot takes, guest stories, actionable advice, controversial opinions, emotional moments, and quotable one-liners -- then ranks each candidate clip by standalone watchability before editing a single frame.',
        bestFor:
          'Podcasters with long-format episodes (60+ minutes) who need an editor who can efficiently identify the 5% of content worth clipping without requiring direction on every episode.',
      },
      {
        name: 'Platform-Native Re-Edit Rule',
        description:
          'Each clip is re-edited specifically for its target platform rather than cut once and reformatted: Reels clips favour faster pacing and text overlays, TikTok clips favour trending audio integration, YouTube Shorts clips favour searchable titles and slower pacing, Twitter clips favour embedded caption-first viewing. The same moment gets 4 different edits.',
        bestFor:
          'Podcasters serious about cross-platform distribution who are currently posting the same clip everywhere and wondering why it performs well on one platform but not others.',
      },
      {
        name: 'Guest Amplification Loop',
        description:
          'A system for turning each guest into a distribution channel: the guest clip is delivered with a pre-written social post, the guest\'s handle tagged, and a link to the full episode. The editor tracks which guests share and which do not, and adjusts future clip selection to prioritise moments from guests with high share-propensity.',
        bestFor:
          'Podcasters who interview guests regularly and want to turn each guest\'s audience into a repeat distribution source without manually following up with every guest.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '3 business days after episode is published',
      revisions: '1 revision round on the clip pack',
      feedbackRounds: '1 round of clip selection feedback per week',
      communication: 'Async via Slack with a shared clip tracker',
      responseTime: 'Within 12 hours during business days',
      scopeWarning:
        'Podcasters frequently change their episode release schedule or skip weeks without notice, which affects clip pack timing and creates idle retainer weeks. Set a minimum weekly episode length commitment (30+ minutes of publishable content) and define what happens if the podcaster skips a week -- either the retainer pauses or the clip pack is pulled from a back-catalogue episode. Clarify that the editor selects clips autonomously; the podcaster should not need to review and approve every clip selection before editing begins.',
    },

    valueAmplifiers: [
      {
        label: 'TikTok-First Clip Strategy',
        description:
          'A dedicated TikTok clip strategy where clips are edited specifically for TikTok\'s algorithm -- trending audio integration, hook-first subtitle placement, and shorter pacing (15-30 seconds) compared to Reels clips. Delivered as a separate weekly TikTok clip pack.',
        whyItWorks:
          'Podcast clips on TikTok have a different optimal format than Reels. A TikTok-specific strategy captures a younger audience that rarely discovers podcasts through traditional directories, expanding the podcaster\'s reach beyond the core podcast audience.',
      },
      {
        label: 'YouTube Clips Channel Management',
        description:
          'A dedicated YouTube Shorts or clips channel for the podcast, with consistent branding, playlist organisation, and SEO-optimised titles and descriptions for each clip -- managed and uploaded by the editor on a weekly schedule.',
        whyItWorks:
          'A YouTube clips channel acts as a permanent searchable library of podcast highlights. Unlike social platforms where clips disappear in 24 hours, YouTube clips accumulate SEO value and drive ongoing discovery months after publication.',
      },
      {
        label: 'Clip Hook Lab (Monthly)',
        description:
          'A 30-minute monthly call where the editor and podcaster review the best-performing clips from the last month, identify patterns in what hooks worked, and plan the next month\'s clip strategy -- including specific moments to look for in upcoming episodes.',
        whyItWorks:
          'The editor-podcaster relationship improves dramatically when both parties understand what makes a clip work. A monthly hook lab aligns the editor\'s clip selection with the podcaster\'s content instincts, producing better clips every month.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'tiered',
      beginnerRange: '$500-$1,000/month',
      intermediateRange: '$1,200-$2,000/month',
      premiumRange: '$2,500-$4,000/month',
      pricingLogic:
        'Podcast clip pricing should scale with episode frequency and clip output volume. A weekly podcaster needing 5-7 clips is the standard base. Bi-weekly podcasters should be on a lower tier or supplement with back-catalogue clips. The premium tier includes the TikTok clip strategy and YouTube clips channel management as bundled amplifiers. Price increases with the number of platforms the clips are optimised for, not just the number of clips.',
    },

    proposalAngle: {
      headline: 'Podcast Clip Distribution Engine -- Turn One Episode Into Two Weeks of Social Content',
      problem:
        'You record a great podcast episode every week, but most of the best moments stay inside the episode file. You post one clip manually, maybe two, but editing them takes hours and you know you are leaving reach on the table. Meanwhile, other podcasters in your niche seem to have clips everywhere.',
      solution:
        'I listen to every episode and extract 5-7 clips that work as standalone social posts -- hot takes, guest stories, actionable advice -- each edited and captioned for the platform where it will perform best. You record once; I turn that episode into two weeks of daily social content across Reels, TikTok, Shorts, and Twitter.',
      nextStep:
        'Send me your last published episode and your Instagram/TikTok handles. I will extract and edit 3 clips for free so you can see how much social content is hiding in your existing episodes.',
    },

    blueprintAngle: {
      whoItIsFor:
        'Podcasters who publish weekly episodes but are capturing less than 10% of their content as short-form social clips -- missing the distribution multiplier that turns a single recording into weeks of audience growth.',
      problemItSolves:
        'Most podcasters either skip clip production entirely (losing the social amplification that drives episode downloads) or spend hours editing clips themselves (taking time away from recording better episodes). The result is either low episode reach or podcaster burnout.',
      corePromise:
        'A weekly pack of 5-7 platform-optimised clips extracted from your episode, delivered within 3 business days, with guest share clips and performance tracking -- so every episode generates 2 weeks of social content without you touching a timeline.',
      whyThisWorks:
        'Podcasts that actively distribute short-form clips see 3-5x more episode downloads than those that rely on directory discovery alone, because each clip acts as a discovery entry point for new listeners. A clip that goes viral on TikTok can drive thousands of new episode downloads in 48 hours.',
      nextStepCTA:
        'Share this blueprint with podcasters who post clips inconsistently or not at all. Offer a free 3-clip sample from their most recent episode as a proof of concept.',
    },
  },


  /* /--- Podcast Clip Editor x Business Owners ---/ */
  [key('podcast_clip_editor_business_owners')]: {
    pathTitle: 'Thought Leadership Clip System for Business Owners',
    audienceInsight:
      'Business owners, founders, and executives start podcasts to build authority and attract clients, but they do not have time to think about clip strategy. They are not trying to become content creators -- they are trying to position themselves as the go-to expert in their industry. Every clip needs to reinforce a specific authority narrative: "this person is the person to call when you have [specific problem]." Generic "here is a tip" clips dilute their positioning. They need an editor who understands business narrative, not just social media trends.',
    offerStrategy:
      'Position as a thought leadership clip partner, not a podcast clip editor. The deliverable is not clips -- it is authority distribution. Each clip should advance a specific positioning angle that the business owner has defined. The editor\'s job is to identify moments that reinforce that positioning and cut everything else. No fluff clips, no trend-chasing, no content for the sake of posting.',
    recommendedOfferType: 'retainer',

    deliverables: [
      {
        label: 'Authority Narrative Clip Pack',
        description:
          '4-6 clips per episode that each reinforce a specific authority pillar -- industry insight, client success pattern, contrarian opinion, or decision-making framework -- rather than generic highlights or funny moments.',
        whyItMatters:
          'Business owners do not need viral clips; they need positioning clips. A clip that reinforces their authority with one ideal client is worth more than a clip that entertains 10,000 random viewers.',
      },
      {
        label: 'Positioning-Aligned Caption Suite',
        description:
          'Each clip delivered with a caption that frames the clip within the business owner\'s specific positioning narrative -- not just "listen to the full episode" but "this is why [industry] leaders are wrong about [topic], and here is what we do instead."',
        whyItMatters:
          'The caption is where positioning happens. A generic caption wastes the clip\'s authority-building potential. A positioning-aligned caption makes every clip a miniature lead generation asset.',
      },
      {
        label: 'Client-Facing Distribution Pack',
        description:
          'A curated set of 2-3 clips per month designed specifically to be sent to prospects or shared in sales conversations -- formatted as private links with a one-sentence introduction the business owner can paste into an email or LinkedIn DM.',
        whyItMatters:
          'Business owners close deals in conversations, not on social feeds. Clips that are designed to be shared in sales conversations directly impact revenue, not just vanity metrics.',
      },
      {
        label: 'LinkedIn-Long-Form Adaptation',
        description:
          'One clip per episode expanded into a 300-500 word LinkedIn post or newsletter article -- using the clip\'s core insight but written for text-first consumption on LinkedIn, where the business owner\'s professional network lives.',
        whyItMatters:
          'LinkedIn rewards text-based thought leadership, not just video clips. A written adaptation doubles the clip\'s reach by capturing the LinkedIn audience that scrolls past video content.',
      },
      {
        label: 'Quarterly Positioning Audit',
        description:
          'A quarterly review of all clips produced in the last 3 months, assessing whether the clip content is consistently reinforcing the business owner\'s authority pillars or drifting into generic content territory, with recommendations for course correction.',
        whyItMatters:
          'Business owners often drift from their positioning without realising it. A quarterly audit keeps the clip strategy aligned with the business owner\'s evolving market position and ensures every clip serves the authority narrative.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Authority Pillar Mapping',
        description:
          'A pre-engagement workshop where the editor maps the business owner\'s 3-5 authority pillars (the specific areas where they want to be known as the go-to expert), then scores each potential clip against those pillars before editing. Clips that do not reinforce at least one pillar do not get produced.',
        bestFor:
          'Business owners who have started a podcast but whose clip content feels random -- sometimes they post about industry trends, sometimes about personal stories, without a consistent positioning thread.',
      },
      {
        name: 'Sales Conversation Clip Library',
        description:
          'A running library of clips categorised by sales objection type -- each clip tagged with which prospect objection it answers (price, timing, trust, competitor comparison), so the business owner can pull the right clip for any sales conversation in seconds.',
        bestFor:
          'Business owners who sell high-ticket services or consulting and need content assets that support their sales process rather than just their social media presence.',
      },
      {
        name: 'Positioning Drift Detection',
        description:
          'A quarterly review process that compares the last 3 months of clips against the original authority pillar map, flagging any clip that does not clearly reinforce at least one pillar and identifying trends that indicate positioning drift before it becomes a brand problem.',
        bestFor:
          'Established business owners who have been podcasting for 6+ months and need quality control on their content direction, not just more output.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '4 business days after episode publication',
      revisions: '1 revision round on clip selection and captions',
      feedbackRounds: '1 round of pillar alignment feedback per month',
      communication: 'Async via email or Slack; no daily check-ins required',
      responseTime: 'Within 24 hours',
      scopeWarning:
        'Business owners frequently change their positioning, offers, or messaging as their business evolves, which can make previously produced clips feel outdated. Set a quarterly realignment process where the authority pillars are reviewed and updated. Clarify that clips produced under a previous positioning are not automatically retired but new clips will align with the updated pillars. Also note that the business owner must provide 30 minutes for the initial pillar mapping workshop -- skipping this undermines the entire clip strategy.',
    },

    valueAmplifiers: [
      {
        label: 'Sales Team Clip Training',
        description:
          'A 30-minute session with the business owner\'s sales team on how to use the clip library in sales conversations -- which clips to send at each stage of the sales process, how to introduce a clip in a follow-up email, and how to track which clips influence deal velocity.',
        whyItWorks:
          'A clip library only creates value if the sales team uses it. Training turns the content investment into a sales enablement asset that the entire team leverages, not just the business owner\'s personal social media.',
      },
      {
        label: 'Speaking Engagement Reel',
        description:
          'A 60-second highlight reel of the business owner\'s best podcast moments, edited as a speaker reel for conference organisers and event booking -- including key insights, stage presence, and audience reaction clips where available.',
        whyItWorks:
          'Many business owners use podcasting as a path to speaking engagements. A professional speaker reel created from podcast clips opens a distribution channel that social media alone cannot reach.',
      },
      {
        label: 'Newsletter Content Feed',
        description:
          'Each week\'s best clip repurposed as the lead item for the business owner\'s newsletter or LinkedIn newsletter, with a written introduction, the embedded clip, and a "go deeper" link to the full episode.',
        whyItWorks:
          'Newsletter subscribers are a business owner\'s most engaged audience. Feeding clip content into the newsletter ensures the podcast consistently drives newsletter growth and that subscribers always have fresh content to engage with.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'tiered',
      beginnerRange: '$800-$1,500/month',
      intermediateRange: '$2,000-$3,500/month',
      premiumRange: '$4,000-$6,000/month',
      pricingLogic:
        'Business owner pricing is higher than general podcaster pricing because the clips require strategic thinking (authority pillar alignment, sales conversation use cases), not just editing. Tier by weekly episode count and number of distribution platforms (social-only vs. social + sales library + LinkedIn adaptation). The premium tier includes the sales team training and quarterly positioning audit. Price as a percentage of the business owner\'s client acquisition cost -- a clip that helps close a $10K deal is worth more than a clip that gets 100K views.',
    },

    proposalAngle: {
      headline: 'Thought Leadership Clip System -- Authority Distribution for Busy Business Owners',
      problem:
        'You started your podcast to build authority and attract ideal clients, but clip production feels like a second job. When you do post clips, they feel random -- sometimes industry insights, sometimes personal stories -- without a consistent thread that tells prospects why they should hire you.',
      solution:
        'I build a clip system around your specific authority pillars -- the 3-5 areas where you want to own the conversation. Every clip I produce reinforces at least one of those pillars. I also build a sales conversation clip library so your team can pull the right clip for any prospect objection in seconds.',
      nextStep:
        'Schedule a 30-minute pillar mapping call. I will identify your 3-5 authority pillars and produce 2 sample clips from your most recent episode that demonstrate how each clip reinforces a specific pillar -- no commitment required.',
    },

    blueprintAngle: {
      whoItIsFor:
        'Business owners, founders, and executives who host a podcast as a thought leadership and lead generation tool but lack the time or strategic focus to turn episodes into a consistent authority-building clip system.',
      problemItSolves:
        'Most business owners either post clips sporadically (with no consistent positioning thread) or outsource clip production to editors who treat their content like entertainment rather than authority distribution. The result is a lot of content with no strategic impact on their business goals.',
      corePromise:
        'A weekly clip pack aligned to your authority pillars, a sales-ready clip library organised by prospect objection, and a quarterly positioning audit -- so your podcast consistently reinforces your market position and feeds your sales pipeline.',
      whyThisWorks:
        'Business owners who distribute podcast clips aligned to specific authority pillars generate 3-5x more inbound leads from their content than those who post generic highlights, because every clip tells the same story: "this is the person who solves [specific problem]." Consistent positioning compounds faster than viral reach in B2B markets.',
      nextStepCTA:
        'Share this blueprint with business owners who have a podcast but feel like it is not generating the business impact they expected. Offer a free 30-minute authority pillar mapping session as a starting point.',
    },
  },


  /* /--- Ad Creative Editor x Ecommerce Brands ---/ */
  [key('ad_creative_editor_ecommerce_brands')]: {
    pathTitle: 'DTC Ad Creative System -- Scroll-Stopping Assets That Convert',
    audienceInsight:
      'Ecommerce brands running paid social ads live and die by creative performance. A winning ad creative can sustain a 2-3x ROAS for weeks; a flat creative burns through ad spend in hours. Unlike organic content editors who optimise for engagement, ad creative editors optimise for a single metric: cost per acquisition. Every split-second decision in the edit -- the hook framing, the product reveal timing, the social proof placement, the CTA urgency -- determines whether the pixel sees a conversion or a bounce. These brands need an editor who understands direct response principles, not just visual storytelling.',
    offerStrategy:
      'Position as a direct response creative partner, not a video editor. The deliverable is not a well-edited video -- it is a lower CPA. Every edit is made with the ad platform\'s optimisation algorithm in mind: hook pacing for retention, text overlay placement for sound-off viewing, CTA framing for click-through rate. The editor should be able to articulate why each edit decision exists in terms of conversion impact, not aesthetic preference.',
    recommendedOfferType: 'milestone_based',

    deliverables: [
      {
        label: 'Hook-Variant Ad Package',
        description:
          'A single core ad creative edited in 3-5 hook variations -- different opening angles (problem, social proof, curiosity, authority, fear of missing out) with the same product demonstration body and CTA. Delivered as a split-test-ready asset pack for the brand to test against each other on Meta or TikTok Ads.',
        whyItMatters:
          'The hook determines 80% of an ad\'s performance. A brand running 5 hook variants against each other will identify a winner in 48 hours, while a brand running one ad has no optimisable data. Hook variants are the single highest-leverage investment in ad creative production.',
      },
      {
        label: 'Sound-Off Optimisation Pass',
        description:
          'A dedicated edit pass where the ad is re-optimised for sound-off viewing -- text overlays for every key claim, visual emphasis on product demonstration, on-screen captions for spoken audio, and a CTA that works without audio context.',
        whyItMatters:
          '85% of Meta ads are viewed with sound off. An ad that relies on audio narration to communicate value fails silently. A sound-off optimised edit ensures the ad converts regardless of whether the viewer has headphones in.',
      },
      {
        label: 'Social Proof Integration Edit',
        description:
          'Customer review clips, star ratings, before/after photos, and user-generated content woven into the ad edit as native social proof -- timed to appear at the moment of maximum purchase intent rather than dumped at the end.',
        whyItMatters:
          'Social proof embedded within the ad narrative (rather than appended as a testimonial card) increases conversion rate by 20-40% because it answers the trust objection exactly when the viewer is deciding whether to click.',
      },
      {
        label: 'Platform-Specific Compliance Edit',
        description:
          'A compliance review and edit pass for each ad platform -- ensuring the creative meets Meta\'s text overlay limits, TikTok\'s branded content policies, and each platform\'s ad length, aspect ratio, and CTA button requirements before the brand submits it for review.',
        whyItMatters:
          'Ad creatives rejected by platform review waste production time and delay campaign launches. A compliance edit pass prevents the brand from spending money on a creative that gets disapproved and ensures every creative variant is ready to go live immediately.',
      },
      {
        label: 'Performance Creative Brief',
        description:
          'A 1-page brief delivered with each ad pack that explains why each hook variant was chosen, what conversion hypothesis it tests, and which audience segment it is likely to resonate with -- so the brand\'s media buyer can make informed decisions about spend allocation.',
        whyItMatters:
          'An ad creative is only as good as the media buying strategy behind it. A creative brief that tells the buyer what to test, with which audience, and why, eliminates the guesswork and accelerates the winning creative discovery process.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Hook Hypothesis Framework',
        description:
          'A structured process where every ad creative starts with 3-5 hook hypotheses based on the brand\'s customer research, competitor ad analysis, and past creative performance data. Each hook variant is edited to test a specific psychological trigger -- scarcity, social proof, authority, reciprocity, or loss aversion -- with the rest of the ad body held constant so the brand can isolate the winning hook variable.',
        bestFor:
          'DTC brands spending $5K+/month on paid social who need to systematically improve their creative CPA rather than relying on gut-feel ad production.',
      },
      {
        name: 'Pixel-Aligned Pacing Protocol',
        description:
          'An editing framework that structures ad pacing around the ad platform\'s optimisation signals: the first 3 seconds hook the viewer (retention signal), seconds 3-10 demonstrate value (engagement signal), seconds 10-20 present social proof (trust signal), seconds 20-30 deliver CTA (conversion signal). Each section is paced to maximise the signal the platform\'s algorithm needs to optimise delivery.',
        bestFor:
          'Brands whose ads have strong creative but inconsistent CPA because the ads are not structured to feed the platform\'s optimisation algorithm the signals it needs.',
      },
      {
        name: 'Creative Testing Cadence',
        description:
          'A production workflow that delivers ad creative variants on a fixed 2-week testing cycle: 5 new hook variants every 2 weeks, with a performance review after the first week to inform the next batch\'s creative direction. The brand always has fresh creative to test against fatiguing winners.',
        bestFor:
          'Brands experiencing creative fatigue -- their winning ads are losing steam and they need a systematic, predictable creative testing pipeline rather than scrambling for new concepts when performance drops.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '5 business days per 5-variant ad pack',
      revisions: '1 revision round on selected winning variant',
      feedbackRounds: '1 round of brand and offer brief review before production',
      communication: 'Async via Slack with a shared creative tracker',
      responseTime: 'Within 8 hours during business days',
      scopeWarning:
        'Ecommerce brands frequently change their offers, discounts, or promotions mid-cycle, which invalidates CTA framing and offer-specific social proof in ads already in production. Lock the offer, discount, and CTA before production begins. Any offer changes after the ad pack is in production will require a new creative brief and count as a new milestone. Also clarify that the brand must provide past creative performance data (CPA, CTR, hook retention) for the Hook Hypothesis Framework to work effectively -- skipping this data input reduces the framework\'s effectiveness.',
    },

    valueAmplifiers: [
      {
        label: 'Winning Creative Analysis',
        description:
          'A written analysis of the ad variant that wins the split test, breaking down exactly why it outperformed the others -- which hook angle resonated, which social proof placement drove conversions, and what the next creative should double down on.',
        whyItWorks:
          'Most brands know which ad won but not why. Understanding the "why" turns ad production from creative gambling into a repeatable optimisation process, where each test cycle produces actionable learning for the next batch.',
      },
      {
        label: 'Competitor Ad Creative Scan',
        description:
          'A monthly review of the brand\'s top 5 competitors\' ad creatives -- hooks, offers, social proof strategies, and pacing approaches -- with a 1-page summary of gaps and opportunities the brand can exploit in their next creative batch.',
        whyItWorks:
          'Competitor ad creatives reveal what is working in the market and what messaging angles are saturated. A competitor scan prevents the brand from producing ads that look like everyone else\'s and identifies white space messaging opportunities.',
      },
      {
        label: 'Retargeting Creative Variant',
        description:
          'A separate edit of the winning ad variant, modified for retargeting audiences -- stronger social proof (they already know the brand), faster product reveal, a comparison-driven hook (why our solution is better than what you are using), and a scarcity or loyalty-based CTA.',
        whyItWorks:
          'Cold audiences and warm audiences need different creative approaches. A retargeting-specific variant of the winning ad converts 2-3x better than showing the same cold ad to a retargeting audience that has already seen it.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'flat_rate',
      beginnerRange: '$500-$1,000 per 5-variant pack',
      intermediateRange: '$1,200-$2,500 per 5-variant pack',
      premiumRange: '$3,000-$5,000 per 5-variant pack',
      pricingLogic:
        'Ad creative pricing should be per-variant-pack rather than hourly or monthly, because the value is in the split-test output (5 variants that find a winner) rather than the time spent editing. A brand spending $10K/month on ad spend justifies a $2K creative pack if it improves CPA by 20%. Tier by production complexity: simple direct-to-camera ads at the low end, UGC-montage-edited ads at the mid-range, and fully produced animation-overlay ads at the premium tier. Frame pricing as a percentage of monthly ad spend (10-20% of monthly ad spend for a single creative pack) to demonstrate ROI alignment.',
    },

    proposalAngle: {
      headline: 'DTC Ad Creative System -- Ad Assets Engineered for a Target CPA, Not Just Views',
      problem:
        'Your ad creatives look good but your CPA is climbing. You are spending more on ads to get the same number of conversions, and your creative testing process is too slow -- by the time you find a winner, it is already fatiguing. Meanwhile, your competitors are rotating fresh creative every two weeks.',
      solution:
        'I deliver 5 hook-variant ad creatives every 2 weeks, each engineered to test a specific conversion hypothesis. Every edit decision -- hook pacing, social proof placement, CTA framing -- is made to improve a specific metric: cost per acquisition. You get a systematic creative testing pipeline that produces a winning ad faster and keeps your ad account from fatiguing.',
      nextStep:
        'Send me your last 3 winning ad creatives and your current CPA data. I will analyse what made them work and produce a 5-variant hook test pack with a creative brief -- delivered in 5 business days -- so you can see the systematic approach before committing to a retainer.',
    },

    blueprintAngle: {
      whoItIsFor:
        'DTC ecommerce brands spending $5K+/month on Meta and TikTok ads who need a systematic, data-informed creative production process that improves CPA rather than just producing more ads that look the same.',
      problemItSolves:
        'Most ad creative editors produce visually appealing ads that fail to convert because they edit for aesthetics instead of direct response principles -- hooks that are entertaining but do not qualify viewers, social proof buried at the end, CTAs that lack urgency. The result is high creative production costs with inconsistent CPA performance.',
      corePromise:
        'A bi-weekly 5-variant hook test pack delivered with a creative brief, sound-off optimisation pass, and social proof integration -- so every batch of creative systematically improves your CPA rather than guessing at what might work.',
      whyThisWorks:
        'DTC brands that test 5+ creative variants every 2 weeks discover winning ads 3x faster than those testing 1-2 variants per month, because the split-test methodology isolates the winning variable faster and the higher creative velocity prevents ad fatigue from setting in. A systematic creative testing pipeline is the single highest-ROI investment for a brand at $5K+/month ad spend.',
      nextStepCTA:
        'Share this blueprint with DTC brand owners or marketing directors who are frustrated with inconsistent ad creative performance. Offer a free analysis of their last 3 winning ad creatives as a starting point.',
    },
  },


  /* /--- WordPress Developer x Startups/SaaS ---/ */
  [key('wordpress_developer_startups_saas')]: {
    pathTitle: 'SaaS Marketing Site -- WordPress for Startups',
    audienceInsight:
      'Early-stage SaaS startups need a marketing website that converts visitors into sign-ups, trials, or demos. Unlike local businesses that optimise for phone calls, SaaS startups optimise for a single metric: free trial or demo request conversion rate. They need a site that communicates value proposition in under 3 seconds, handles A/B testing infrastructure, integrates with analytics and CRM tools, and can be iterated on weekly as the product and messaging evolve. They do not need a beautiful brochure; they need a conversion machine that their growth team can run experiments on.',
    offerStrategy:
      'Position as a SaaS marketing site engineer, not a WordPress developer. The deliverable is a conversion-optimised marketing site with built-in experimentation infrastructure. Every page section, heading, and CTA button is built to be A/B testable from day one. The site should integrate with the startup\'s analytics stack (GA4, Mixpanel, Hotjar), CRM (HubSpot, Salesforce), and onboarding tool (Intercom, Userflow) without the startup needing a dedicated engineer for integrations.',
    recommendedOfferType: 'one_time_project',

    deliverables: [
      {
        label: 'Conversion-First Theme Build',
        description:
          'A custom WordPress theme built around SaaS conversion patterns: hero section with value prop and primary CTA, social proof bar, feature comparison grid, pricing table with toggle, FAQ accordion with schema markup, and a persistent demo request CTA that scrolls with the user.',
        whyItMatters:
          'SaaS visitors decide whether to sign up in under 5 seconds. A conversion-optimised theme structure reduces bounce rate and increases trial sign-up rate by guiding the visitor through a proven persuasion sequence rather than letting them wander.',
      },
      {
        label: 'A/B Testing Infrastructure',
        description:
          'Built-in A/B testing framework (Google Optimize or custom split testing) with pre-configured experiment templates for headline variants, CTA copy changes, pricing page layouts, and hero section imagery -- all manageable without developer involvement.',
        whyItMatters:
          'SaaS growth teams need to test constantly. A site that makes A/B testing easy (without requiring a developer to set up every experiment) enables the growth team to iterate at startup speed rather than developer-sprint speed.',
      },
      {
        label: 'Analytics & CRM Integration Suite',
        description:
          'Pre-built integrations with GA4, Mixpanel or Amplitude, Hotjar (session recording + heatmaps), HubSpot or Salesforce CRM tracking, and Intercom or Crisp live chat -- installed and configured with conversion event tracking (sign-up, demo request, pricing page view, FAQ interaction).',
        whyItMatters:
          'A SaaS site without proper analytics and CRM tracking is flying blind. Pre-built integrations mean the startup\'s data infrastructure is operational from launch day, not 3 weeks later when they realise nothing is being tracked.',
      },
      {
        label: 'Pricing Page Optimisation',
        description:
          'A dynamic pricing page with monthly/annual toggle, feature comparison table, tiered pricing cards with "most popular" highlighting, FAQ schema for rich search results, and a live chat or demo request CTA on the pricing tier the user is hovering over.',
        whyItMatters:
          'The pricing page is the highest-stakes page on any SaaS site. An optimised pricing page with toggle, comparison table, and contextual CTAs can improve trial-to-paid conversion by 15-30% compared to a static pricing table.',
      },
      {
        label: 'Documentation & Changelog Integration',
        description:
          'A knowledge base or documentation section integrated into the WordPress site (or linked to a headless docs platform) with search, category filtering, and version tracking -- plus a changelog page that auto-publishes from GitHub or Linear webhooks.',
        whyItMatters:
          'SaaS buyers evaluate documentation quality before committing. A professional docs section signals product maturity and reduces support burden. A changelog shows the product is actively developed, which builds trust with technical buyers.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Startup Iteration Architecture',
        description:
          'A WordPress build designed for rapid iteration: modular page builders (ACF Flexible Content or Gutenberg blocks), centralised global settings for CTAs and colours, pre-built experiment templates, and a 24-hour turnaround policy for copy and layout changes -- so the startup can update their site as fast as they update their product.',
        bestFor:
          'Early-stage SaaS startups whose messaging and pricing change monthly (or weekly) and who need a site that can keep pace with product iterations without requiring a developer for every text change.',
      },
      {
        name: 'Trial Conversion Flow Mapping',
        description:
          'A structured analysis of the startup\'s ideal trial-to-paid user journey, mapped into the site architecture: acquisition page -> landing page -> sign-up -> activation email -> in-app onboarding -> first value -> upgrade prompt. Each stage of the funnel has a corresponding page or section with a specific conversion CTA.',
        bestFor:
          'SaaS startups with a product-market fit who need their marketing site to actively support the trial conversion funnel rather than just describing the product.',
      },
      {
        name: 'Technical SEO Foundation',
        description:
          'WordPress SEO architecture built for SaaS content marketing: custom post types for blog posts, case studies, and documentation; automatic schema markup for each post type; XML sitemaps organised by content priority; canonical URL management; and page-speed optimisation targeting 90+ on mobile Lighthouse.',
        bestFor:
          'SaaS startups investing in content marketing as a growth channel who need their WordPress site to rank for competitive SaaS keywords without requiring an SEO specialist to configure every technical setting.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '4-6 weeks for initial build (5-7 pages)',
      revisions: '2 rounds on design mockups before development',
      feedbackRounds: '2 rounds of content and structure review',
      communication: 'Async via Slack + weekly check-in calls',
      responseTime: 'Within 24 hours',
      scopeWarning:
        'SaaS startups frequently change their pricing, feature set, and target audience during the build process as they respond to market feedback. Lock the pricing structure, feature names, and core messaging before development begins. Any changes to pricing tiers, product names, or primary value proposition during development count as a scope change. Build the site with a "messaging lock" milestone: once development starts, the copy is frozen until launch.',
    },

    valueAmplifiers: [
      {
        label: 'Conversion Rate Audit (30 Days Post-Launch)',
        description:
          'A 30-day post-launch analysis of the site\'s conversion performance -- traffic sources, landing page bounce rates, trial sign-up conversion funnel, pricing page interaction heatmaps -- with 5 specific recommendations for improvement based on real user behaviour data.',
        whyItWorks:
          'A site that launches without a conversion audit is a guess. A data-driven audit 30 days after launch turns the site from a static asset into a continuously improving conversion engine, built on real user behaviour rather than assumptions.',
      },
      {
        label: 'Pricing Page Experiment Pack',
        description:
          '3 pre-built pricing page experiment variations (feature highlighting, CTA placement, social proof positioning) that the startup can A/B test against their current pricing page -- with experiment setup and performance tracking configured.',
        whyItWorks:
          'Pricing page optimisation is the highest-leverage experiment for most SaaS startups. Pre-built experiment variations eliminate the "what do we test?" paralysis and give the growth team a structured starting point for conversion optimisation.',
      },
      {
        label: 'Knowledge Base SEO Package',
        description:
          'SEO optimisation of the documentation and knowledge base section -- keyword research for support-related searches, FAQ schema implementation, internal linking structure, and content organisation for featured snippet capture.',
        whyItWorks:
          'Support content (docs, knowledge base, FAQ) is the most overlooked SEO asset for SaaS companies. An optimised docs section captures long-tail search traffic from users searching for solutions the product provides, creating a top-of-funnel acquisition channel from the documentation budget.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'flat_rate',
      beginnerRange: '$3,000-$6,000',
      intermediateRange: '$7,000-$12,000',
      premiumRange: '$15,000-$25,000',
      pricingLogic:
        'SaaS marketing site pricing should be a flat project fee based on page count, integration complexity, and custom functionality requirements. A 5-page site with standard integrations (analytics, CRM, live chat) is at the low end; a 15-page site with custom post types, membership gating, multi-language support, and complex third-party integrations is at the high end. The premium tier includes the post-launch conversion audit and pricing page experiment pack as bundled amplifiers. Price as a fraction of the startup\'s monthly ad spend or target customer acquisition cost to demonstrate ROI.',
    },

    proposalAngle: {
      headline: 'SaaS Marketing Site -- A WordPress Conversion Engine Built for Startup Speed',
      problem:
        'Your current website looks fine but it is not converting visitors into trial sign-ups. It was not built for experimentation, your growth team cannot run A/B tests without developer help, and the analytics are not tracking the right conversion events. You need a site that adapts as fast as your product.',
      solution:
        'I build a conversion-optimised WordPress site with built-in A/B testing infrastructure, pre-configured analytics and CRM integrations, and an iteration architecture that lets your team update copy and run experiments without developer involvement. It is a marketing engine built for startup speed, not a brochure.',
      nextStep:
        'Send me your current site URL and your trial sign-up conversion rate. I will run a 30-point conversion audit and send back a specific report with the 5 highest-impact changes I would make, so you can evaluate my approach before committing to a build.',
    },

    blueprintAngle: {
      whoItIsFor:
        'Early-stage SaaS startups that have outgrown their basic landing page and need a marketing site that actively drives trial sign-ups, supports A/B testing, integrates with their growth stack, and can be iterated on weekly as the product evolves.',
      problemItSolves:
        'Most SaaS marketing sites are built by agencies that deliver a beautiful static site and walk away. The startup is left with a site they cannot easily change, analytics that are not tracking the right events, and no experimentation infrastructure -- making it impossible to optimise conversion rates systematically.',
      corePromise:
        'A conversion-first WordPress site with A/B testing infrastructure, analytics and CRM integrations, and an iteration architecture that lets your team make changes without developer bottlenecks -- so your site improves as fast as your product does.',
      whyThisWorks:
        'SaaS startups that invest in a conversion-optimised marketing site before scaling ad spend see 2-3x higher trial-to-paid conversion rates than those that spend on traffic first and optimise the site later, because every dollar of ad spend lands on a page engineered to convert rather than a page that looks good.',
      nextStepCTA:
        'Share this blueprint with SaaS founders or growth leads who are spending money on traffic but not seeing trial sign-up conversion improve. Offer a free 30-point conversion audit of their current site as a starting point.',
    },
  },


  /* /--- Landing Page Developer x Course Creators ---/ */
  [key('landing_page_developer_course_creators')]: {
    pathTitle: 'Course Creator Launch Page System',
    audienceInsight:
      'Course creators sell their programs through launch windows -- typically a 5-14 day cart open period where every page visit, email click, and social post needs to drive toward a single conversion goal: course purchase. Unlike general landing page developers who optimise for evergreen lead generation, course creators need pages designed for urgency, scarcity, and launch-time psychology. The page needs to communicate the course value, overcome objections, present testimonials, display the curriculum, and drive purchase decisions -- all within a compressed launch window where every hour of lost conversion opportunity is gone forever.',
    offerStrategy:
      'Position as a launch page engineer, not a landing page developer. The deliverable is not a page -- it is a launch conversion system. Every element of the page is designed to maximise conversion rate during the cart open window: urgency triggers, scarcity counters, testimonial carousels, curriculum preview sections, FAQ accordion, and a persistent checkout CTA that follows the visitor. The page should be built to integrate with the creator\'s email platform (ConvertKit, Kajabi, Teachable) and payment processor (Stripe, PayPal) so launch data flows automatically.',
    recommendedOfferType: 'one_time_project',

    deliverables: [
      {
        label: 'Launch Landing Page Build',
        description:
          'A full-sales-page build designed for course launches: hero section with course title and early-bird pricing callout, instructor authority section (photo, credentials, social proof number), curriculum preview with module breakdown, testimonial carousel with video thumbnail support, FAQ accordion with schema markup, pricing section with payment plan options, and a persistent sticky CTA bar.',
        whyItMatters:
          'A course launch page is the highest-stakes page a creator will ever build. A 1% conversion rate improvement on a $500 course with 10K launch visitors is $50K in additional revenue. A launch-optimised page structure is not a nice-to-have; it directly determines launch revenue.',
      },
      {
        label: 'Cart & Checkout Integration',
        description:
          'Seamless integration with the creator\'s course platform (Teachable, Kajabi, Thinkific, or ThriveCart) and payment processor, including a smooth cart flow, order bump integration, upsell/downsell page links, and post-purchase redirect to the course welcome page.',
        whyItMatters:
          'Checkout friction is the #1 cause of abandoned course purchases. A seamless integration that eliminates redirect confusion, loading delays, and form re-entry can recover 15-25% of lost sales during the launch window.',
      },
      {
        label: 'Email Capture & Launch Sequence Integration',
        description:
          'Pre-built email capture forms integrated with the creator\'s email platform (ConvertKit, MailerLite, ActiveCampaign), including waitlist capture before launch, cart-open notification triggers, abandoned cart email triggers, and post-purchase thank-you page with course access instructions.',
        whyItMatters:
          'Course launches depend on email sequences to drive traffic and close sales. A page that feeds directly into the creator\'s email automation (capturing leads before launch, triggering cart notifications, following up on abandoned carts) creates a complete launch infrastructure, not just a standalone page.',
      },
      {
        label: 'Urgency & Scarcity Elements',
        description:
          'Dynamic countdown timers for cart close deadline, limited-availability badges for early-bird pricing tiers, social proof counters showing "X students enrolled this week," and live notification pop-ups showing recent purchases -- all built to trigger during the launch window.',
        whyItMatters:
          'Urgency and scarcity are the psychological drivers of launch conversions. Dynamic elements that create real-time FOMO (fear of missing out) can increase launch conversion rates by 30-60% compared to static pricing pages.',
      },
      {
        label: 'Post-Launch Evergreen Variant',
        description:
          'A modified version of the launch page adapted for evergreen sales between launches -- removing urgency/countdown elements, adjusting pricing to full price, adding a "join the waitlist for the next cohort" option if the course is cohort-based, and reworking the hero to focus on ongoing enrollment rather than limited-time access.',
        whyItMatters:
          'Course creators who only sell during launches leave money on the table between launch windows. An evergreen variant of the launch page captures sales from visitors who discover the course outside launch periods, creating a continuous revenue stream between launches.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Launch Day Conversion Architecture',
        description:
          'A page structure designed specifically for the psychology of a course launch: pre-launch (waitlist capture, teaser content), launch (urgency-driven sales page with countdown, testimonials, curriculum preview), and post-launch (cart close countdown, last-chance email integration, evergreen variant handoff). Each phase has a distinct page layout and CTA strategy.',
        bestFor:
          'Course creators running structured launches (open cart, close cart, reopen) who need their website to support each phase of the launch cycle rather than using a single static page for the entire process.',
      },
      {
        name: 'Testimonial-to-Objection Mapping',
        description:
          'A strategic testimonial placement system where each testimonial is positioned to answer a specific purchase objection at the exact moment the objection arises -- price objection near the pricing section, time commitment objection near the curriculum section, "is this for me?" objection near the hero section.',
        bestFor:
          'Course creators with strong testimonials who are placing them in a single carousel at the bottom of the page rather than strategically deploying them throughout the page to overcome objections at the moment they arise.',
      },
      {
        name: 'Post-Purchase Upsell Continuity',
        description:
          'A post-purchase page flow that guides the new student through upsell/downsell offers, community access setup, course orientation, and the first lesson -- all within the same session, eliminating the "I bought it but never started" problem that plagues course creators.',
        bestFor:
          'Course creators with upsell offers (community membership, coaching add-on, advanced course) who are currently sending new students to a generic "thank you" page that captures none of the post-purchase momentum.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '2-3 weeks for initial launch page build',
      revisions: '2 rounds on design and copy layout',
      feedbackRounds: '1 round of curriculum and pricing structure review',
      communication: 'Async via email + 2 checkpoint calls',
      responseTime: 'Within 24 hours',
      scopeWarning:
        'Course creators frequently change their pricing, curriculum, and launch timeline during the build process, which can invalidate urgency elements (timers, pricing displays) and testimonial placement. Lock the launch date, pricing structure, and curriculum outline before development begins. Any changes to cart close date, pricing tiers, or course content structure during development should be scoped as a revision round. Clarify that the evergreen variant is only built after the launch page is complete and live, not in parallel.',
    },

    valueAmplifiers: [
      {
        label: 'Launch Day Monitoring & Quick Fixes',
        description:
          'On-call availability during the 48-hour launch window to fix any page issues, update pricing or messaging, adjust countdown timers, or make emergency changes -- ensuring the launch runs without technical friction.',
        whyItWorks:
          'Course launches are high-stakes events where a broken checkout link or incorrect timer can cost thousands in revenue. Launch day monitoring provides insurance against technical failures and gives the creator confidence that their page infrastructure is being actively managed during the most critical hours.',
      },
      {
        label: 'Sales Page Copy Template Pack',
        description:
          'A structured template for the launch page copy -- hero headline frameworks, objection-handling subheadings, testimonial placement guide, CTA button copy variants, and urgency messaging templates -- that the creator can use to write their own copy or brief a copywriter.',
        whyItWorks:
          'The page build is only as good as the copy it displays. A copy template pack helps the creator produce launch copy that matches the page structure, eliminating the "the page is built but I do not know what to write" bottleneck that delays launches.',
      },
      {
        label: 'Launch Performance Dashboard',
        description:
          'A real-time dashboard showing launch page traffic, conversion rate, revenue, email sign-ups, and cart abandonment rate -- integrated with Google Analytics and the creator\'s email platform -- accessible during the launch window so the creator can monitor performance without logging into multiple tools.',
        whyItWorks:
          'Course creators need real-time data to make launch-day decisions (extend cart close, add bonus, adjust pricing). A consolidated dashboard gives them the visibility they need to optimise mid-launch without technical support.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'flat_rate',
      beginnerRange: '$1,500-$3,000',
      intermediateRange: '$3,500-$7,000',
      premiumRange: '$8,000-$15,000',
      pricingLogic:
        'Course launch page pricing should be a flat project fee based on page complexity and integration requirements. A single landing page with email integration and countdown timers is at the low end; a multi-page launch funnel (waitlist, sales page, checkout, upsell, thank you) with dynamic urgency elements and post-launch evergreen variant is at the high end. The premium tier includes launch day monitoring and the launch performance dashboard as bundled amplifiers. Price as a percentage of the creator\'s target launch revenue (5-10%) to demonstrate ROI alignment.',
    },

    proposalAngle: {
      headline: 'Course Creator Launch Page System -- Maximise Your Next Launch Revenue',
      problem:
        'Your course is ready, your content is excellent, but your launch page is leaving money on the table. The checkout flow has friction, the urgency elements are static, the testimonials are buried at the bottom, and you are not capturing abandoned cart visitors. Your next launch could generate 2x more revenue with the right page infrastructure.',
      solution:
        'I build a launch-optimised page system: a high-converting sales page with dynamic urgency elements, testimonial-to-objection mapping, seamless checkout integration, abandoned cart email triggers, and an evergreen variant for between-launch sales. Your launch converts better, and you keep selling between cart opens.',
      nextStep:
        'Send me your current launch page URL and your last launch\'s conversion data. I will produce a 10-point launch page optimisation audit with specific recommendations for your next launch -- no commitment required.',
    },

    blueprintAngle: {
      whoItIsFor:
        'Course creators who run structured launches and need a landing page system that maximises conversion rate during the cart open window, captures abandoned cart visitors, and continues selling between launches through an evergreen variant.',
      problemItSolves:
        'Most course creator launch pages are built with basic page builders that lack dynamic urgency elements, strategic testimonial placement, seamless checkout integration, and abandoned cart recovery. The result is a 2-4% conversion rate on a page that could convert at 6-10% with the right architecture.',
      corePromise:
        'A launch-optimised page system with dynamic urgency elements, testimonial-to-objection mapping, seamless checkout integration, email capture and abandoned cart recovery, and a post-launch evergreen variant -- so your next launch generates maximum revenue and you keep selling between launches.',
      whyThisWorks:
        'Course creators who invest in a launch-optimised page infrastructure see 2-3x higher launch revenue per visitor than those using templates or basic page builders, because every element of the page is designed for the specific psychology of a course purchase decision -- urgency, social proof, objection handling, and frictionless checkout.',
      nextStepCTA:
        'Share this blueprint with course creators who are planning their next launch and want to improve their conversion rate. Offer a free 10-point launch page audit as a starting point.',
    },
  },


  /* /--- No-Code Developer x Agencies ---/ */
  [key('no_code_developer_agencies')]: {
    pathTitle: 'Agency No-Code Delivery Wing',
    audienceInsight:
      'Digital agencies are being asked to build more than websites -- clients want automation tools, internal dashboards, client portals, and custom workflows that differentiate their service. But agencies cannot afford to staff full-time developers for every client request, and traditional software development is too slow and expensive for agency budgets. No-code platforms (Bubble, Airtable, Make, Softr) let agencies deliver software-like solutions at a fraction of the cost and timeline. They need a no-code specialist who can take a client brief and deliver a working tool in days, not months.',
    offerStrategy:
      'Position as the agency\'s no-code delivery arm, not a freelance Bubble developer. The agency sells the solution to the client; the no-code developer builds it. Every project has a fixed scope, fixed price, and fixed delivery timeline that the agency can present to their client with confidence. The agency marks up the development cost and retains the client relationship. Success is measured in delivery speed and client satisfaction, not in lines of code.',
    recommendedOfferType: 'milestone_based',

    deliverables: [
      {
        label: 'No-Code Solution Blueprint',
        description:
          'A 1-page solution architecture document delivered before any development begins -- outlining the platform choice (Bubble, Airtable, Make, Softr), data model, user flows, and key integrations -- so the agency can review and approve the approach before committing development budget.',
        whyItMatters:
          'Agencies cannot afford surprises. A blueprint document gives the agency confidence that the solution is well-planned before any money is spent on development, and provides a clear scope reference that prevents feature creep.',
      },
      {
        label: 'MVP Build (Milestone 1)',
        description:
          'A functional minimum viable product delivered within 2-3 weeks -- core feature set, working integrations, testable user flows -- deployed to a staging environment for the agency to demo to their client before the full build continues.',
        whyItMatters:
          'Agencies need to show their client progress quickly to maintain trust and momentum. An MVP in 2-3 weeks demonstrates delivery capability and lets the client provide feedback before the full investment is committed.',
      },
      {
        label: 'Full Build & Integration (Milestone 2)',
        description:
          'Complete build with all features, third-party integrations (Stripe, Zapier, Slack, Google Sheets, CRM), user authentication, permissions, and admin panel -- delivered with documentation and a handoff video so the agency can manage the tool independently.',
        whyItMatters:
          'The full build is where the agency delivers the value they promised. A complete, well-documented solution with self-service handoff means the agency does not need ongoing developer support for basic maintenance.',
      },
      {
        label: 'White-Label Deployment',
        description:
          'The solution deployed under the agency\'s brand -- custom domain, agency logo, agency colour scheme, agency email notifications -- with no reference to the no-code developer or platform, so the client sees a seamless agency-branded product.',
        whyItMatters:
          'Agencies need their clients to perceive the solution as an agency-built product, not a third-party tool. White-label deployment protects the agency\'s brand premium and justifies their margin on the project.',
      },
      {
        label: '30-Day Post-Launch Support',
        description:
          '30 days of bug fixes, minor tweaks, and user support after launch -- handled through a shared support channel so the agency can forward client requests without becoming the technical middle layer.',
        whyItMatters:
          'Post-launch issues are inevitable and can damage the agency-client relationship if not handled quickly. A dedicated support window protects the agency from being the bottleneck and shows the client that the agency stands behind their delivery.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Fixed-Scope Sprints',
        description:
          'Every project broken into 2-week sprints with fixed scope, fixed price, and fixed deliverables per sprint. The agency knows exactly what they are getting and when, with no timeline uncertainty. Scope changes go into the next sprint rather than expanding the current one.',
        bestFor:
          'Agencies who are wary of outsourcing development because of horror stories about timeline overruns and scope creep. Fixed-scope sprints eliminate the uncertainty that makes agencies hesitant to sell software solutions.',
      },
      {
        name: 'Agency-Facing Technical Translator',
        description:
          'All technical communication translated into agency-friendly language: no platform jargon, no developer excuses, no "it depends." Each sprint deliverable is described in terms the agency can sell to their client -- "your client gets a login portal with automated invoice generation" rather than "we implemented Airtable automations."',
        bestFor:
          'Agencies whose account managers are not technical and need to communicate confidently with their clients about what is being built without understanding the underlying no-code architecture.',
      },
      {
        name: 'Platform-Agnostic Recommendation',
        description:
          'A structured evaluation of which no-code platform is best for each specific project -- Bubble for complex web apps, Airtable for database-driven tools, Make for automation workflows, Softr for client portals -- based on the client\'s budget, timeline, and long-term maintenance needs, not the developer\'s platform preference.',
        bestFor:
          'Agencies who are unsure which no-code platform to recommend to their clients and need an honest, project-specific recommendation rather than a developer pushing their favourite tool.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '2 weeks per sprint milestone',
      revisions: '1 round of feedback per sprint deliverable',
      feedbackRounds: 'Blueprint review before sprint 1, demo review before sprint 2',
      communication: 'Async via Slack with weekly status update',
      responseTime: 'Within 12 hours during business days',
      scopeWarning:
        'Agencies frequently act as a middle layer between the developer and the client, introducing communication delays and misinterpretation. Establish a direct communication channel for technical clarification (agency account manager + developer) while keeping the agency as the primary client-facing contact. Clarify that any feature requests from the client that were not in the original blueprint will be scoped into the next sprint with an additional cost, not added to the current sprint.',
    },

    valueAmplifiers: [
      {
        label: 'Client Handoff Video',
        description:
          'A 5-10 minute screen recording walking the agency\'s client through the completed solution -- how to log in, how to use each feature, how to get support -- branded for the agency and delivered as a shareable link.',
        whyItWorks:
          'Client education reduces support requests and increases satisfaction. A handoff video that the agency can send to their client eliminates the need for the agency account manager to learn the tool deeply enough to train the client themselves.',
      },
      {
        label: 'Maintenance Retainer Option',
        description:
          'A monthly retainer option for ongoing support, minor feature additions, and platform updates -- so the agency can offer their client a "managed solution" rather than a one-time build, creating recurring revenue for the agency.',
        whyItWorks:
          'Agencies maximise client lifetime value through recurring revenue. A maintenance retainer turns a one-off no-code build into an ongoing revenue stream and prevents the client from needing to find another developer for future changes.',
      },
      {
        label: 'Integration Automation Pack',
        description:
          'Additional automations connecting the no-code solution to the client\'s existing tools -- Zapier workflows, Make scenarios, Slack notifications, Google Sheets sync -- scoped as a separate post-launch milestone.',
        whyItWorks:
          'The initial build rarely covers every integration the client needs. An automation pack post-launch captures additional budget from the same client and deepens the solution\'s integration into the client\'s workflow, making it stickier and harder to replace.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'flat_rate',
      beginnerRange: '$2,000-$5,000 per project',
      intermediateRange: '$6,000-$15,000 per project',
      premiumRange: '$18,000-$35,000 per project',
      pricingLogic:
        'No-code project pricing should be milestone-based with fixed prices per sprint. The agency needs predictable costs to quote their client confidently. A simple internal tool with one integration is at the low end; a multi-feature client portal with payment processing, user roles, and multiple integrations is at the high end. Price by number of sprints (2-6 sprints per project) rather than hourly. The maintenance retainer is priced monthly at 10-15% of the total build cost.',
    },

    proposalAngle: {
      headline: 'Agency No-Code Delivery Wing -- Ship Software Solutions Your Clients Will Love',
      problem:
        'Your clients are asking for more than websites -- they want automation tools, client portals, internal dashboards -- but you cannot afford to staff developers for every request. Traditional software development takes months and costs more than your clients want to pay, so you are either turning down work or delivering solutions that do not fully meet the need.',
      solution:
        'I become your no-code delivery arm. You sell the solution to your client; I build it on Bubble, Airtable, or Make in weeks, not months. Fixed scope, fixed price, white-label deployed under your brand. You mark up the development cost and keep the client relationship.',
      nextStep:
        'Tell me about a client request you recently turned down or delivered a suboptimal solution for. I will put together a 1-page no-code solution blueprint showing exactly how we would build it, on which platform, and for what price -- no commitment required.',
    },

    blueprintAngle: {
      whoItIsFor:
        'Digital agencies whose clients are requesting software solutions -- automation tools, client portals, internal dashboards, custom workflows -- but who lack the in-house development capacity to deliver them profitably.',
      problemItSolves:
        'Most agencies either turn down software projects (leaving revenue on the table) or deliver them through expensive, slow traditional development that erodes their margin and frustrates their clients with long timelines.',
      corePromise:
        'A fixed-scope, fixed-price no-code delivery partnership: 2-week sprints, white-label deployment, agency-friendly communication, and a 30-day post-launch support window -- so your agency can sell and deliver software solutions without hiring developers.',
      whyThisWorks:
        'Agencies that add no-code development to their service offering without hiring full-time developers increase their average project value by 40-60% and win deals that pure marketing agencies cannot touch, because they can offer automation and software solutions alongside traditional agency services.',
      nextStepCTA:
        'Share this blueprint with agency owners who are considering adding software development to their offering. Offer a free solution blueprint for a client project they are currently scoping.',
    },
  },


  /* /--- Automation Developer x Agencies ---/ */
  [key('automation_developer_agencies')]: {
    pathTitle: 'Agency Automation Backend -- Scale Delivery Without Hiring',
    audienceInsight:
      'Agencies run on processes -- client onboarding, reporting, invoicing, project management, email sequences -- but most of these processes are manual, repetitive, and error-prone. Every manual handoff between tools or team members creates a delay and a potential failure point. Agencies need an automation specialist who can audit their workflows, identify automation opportunities, and build Make/Zapier/Relay integrations that eliminate manual steps. The ROI is measured in hours saved per week, not in aesthetic improvement.',
    offerStrategy:
      'Position as an agency backend engineer, not a "Zapier guy." The deliverable is not individual automations -- it is an agency operating system. The automation developer maps every manual process in the agency, builds the integrations that connect their tools, and creates a dashboard that shows which processes are running and which have failed. The agency owner should be able to see, at a glance, whether every client is being onboarded, billed, and reported on without manual intervention.',
    recommendedOfferType: 'retainer',

    deliverables: [
      {
        label: 'Agency Workflow Audit',
        description:
          'A 2-week audit of the agency\'s current workflows -- client onboarding, invoicing, reporting, content delivery, project management, email communication -- identifying every manual step, documenting the current tool stack, and ranking automation opportunities by time-savings potential and implementation complexity.',
        whyItMatters:
          'Most agencies do not know how much time they waste on manual processes because the waste is invisible. An audit surfaces the 20% of workflows causing 80% of the manual overhead and provides a roadmap for eliminating it.',
      },
      {
        label: 'Automation Roadmap & Priority Matrix',
        description:
          'A prioritised implementation plan with each automation mapped to hours saved per week, implementation complexity, and dependencies -- so the agency can decide which automations to build first based on their biggest pain points rather than the developer\'s preference.',
        whyItMatters:
          'Agencies need to see the ROI before committing budget. An automation roadmap with estimated hours saved makes the investment decision easy -- $X for an automation that saves Y hours per week at the agency\'s effective hourly rate.',
      },
      {
        label: 'Core Process Automations',
        description:
          'Build and deployment of the highest-priority automations from the roadmap: typically client onboarding (auto-create projects, folders, email sequences, calendar invites), invoicing (auto-generate and send invoices based on project milestones), reporting (auto-pull data from ad platforms, CRM, project management into a client-facing report), and content delivery (auto-notify when content is ready, deliver via shared folder).',
        whyItMatters:
          'Client onboarding, invoicing, and reporting are the three highest-friction manual processes in most agencies. Automating them saves 10-20 hours per week and eliminates the errors that occur when humans rush through repetitive data entry.',
      },
      {
        label: 'Monitoring Dashboard & Error Alerts',
        description:
          'A central dashboard showing the status of all automations -- successful runs, failed runs, warnings, and manual steps still required -- with Slack or email notifications when an automation fails so the agency can fix issues before they impact clients.',
        whyItMatters:
          'Automations that fail silently are worse than manual processes because they create invisible problems that clients discover before the agency does. A monitoring dashboard ensures the agency trusts their automations rather than double-checking every output.',
      },
      {
        label: 'Monthly Automation Optimisation',
        description:
          'Monthly review of automation performance -- runs triggered, runs failed, hours saved, new workflow opportunities discovered since the last review -- with recommendations for new automations and improvements to existing ones.',
        whyItMatters:
          'Agencies\' workflows evolve as they grow. A monthly optimisation review ensures the automation system keeps pace with the agency\'s changing processes rather than becoming outdated and gradually abandoned.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Agency Ops Architecture',
        description:
          'A structured automation framework that maps every agency process into a central operating system -- client data flows from intake (CRM) through delivery (project management) through billing (accounting) through reporting (analytics) with no manual handoffs. Each tool feeds the next tool through automated triggers rather than human copy-paste.',
        bestFor:
          'Agencies with 5+ tools in their stack that do not talk to each other, forcing team members to manually move data between platforms multiple times per day.',
      },
      {
        name: 'Time-Saved ROI Tracking',
        description:
          'Every automation includes built-in tracking of how many hours it saves per week, reported in the monitoring dashboard. The agency can see, in real time, the cumulative hours saved and the dollar value of those hours at their effective team rate.',
        bestFor:
          'Agency owners who need to justify automation investment to their partners or themselves and want hard data on ROI rather than "it feels faster" anecdotes.',
      },
      {
        name: 'Client-Facing Automation Integration',
        description:
          'Where possible, automations are built to create a better client experience, not just internal efficiency -- automated status updates sent to clients, auto-generated proposal documents, scheduled check-in emails, and self-service client portals that reduce the "can you send me X?" email volume.',
        bestFor:
          'Agencies whose clients generate high support email volume and where better client-facing automation would free up account manager time and improve client satisfaction simultaneously.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '2 weeks for audit + 4-6 weeks for initial automation build',
      revisions: '1 round of testing and refinement per automation',
      feedbackRounds: 'Weekly check-ins during build phase',
      communication: 'Async via Slack + weekly status call',
      responseTime: 'Within 8 hours during business days',
      scopeWarning:
        'Agencies often underestimate how much their workflows change week to week. An automation built for last month\'s process may not fit next month\'s process. Design automations with flexibility in mind -- configurable triggers, toggle-able steps, and clear documentation so the agency can adjust parameters without developer involvement. Clarify that major process changes after automation deployment will require additional scoping as a monthly optimisation item rather than a "quick tweak."',
    },

    valueAmplifiers: [
      {
        label: 'New Hire Automation Training',
        description:
          'A 60-minute training session for each new agency hire on how to use the automation system -- what is automated, what still requires manual input, how to check the monitoring dashboard, and how to flag new automation opportunities.',
        whyItWorks:
          'New hires who understand the automation system from day one are productive faster and less likely to create manual workarounds that bypass the automations. Training ensures the automation investment compounds rather than being gradually abandoned as team members change.',
      },
      {
        label: 'Quarterly Process Re-Audit',
        description:
          'A quarterly re-audit of the agency\'s workflows to identify new automation opportunities created by team growth, new tools, or changing client requirements -- plus a review of existing automations to ensure they still match current processes.',
        whyItWorks:
          'Agencies change fast. A quarterly re-audit prevents the automation system from becoming stale and ensures the agency is continuously eliminating manual work as they grow.',
      },
      {
        label: 'Emergency Automation Support',
        description:
          'A guaranteed 4-hour response SLA for automation failures that impact client delivery -- with a dedicated escalation path so the agency is never stuck waiting for a fix while a client deadline approaches.',
        whyItWorks:
          'Automation failures during client delivery are high-stakes events. An emergency support guarantee gives the agency confidence to fully commit to their automation system rather than maintaining manual fallback processes "just in case."',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'tiered',
      beginnerRange: '$2,000-$4,000/month',
      intermediateRange: '$5,000-$8,000/month',
      premiumRange: '$10,000-$18,000/month',
      pricingLogic:
        'Agency automation pricing should be a monthly retainer that covers the initial audit and roadmap, ongoing automation build and maintenance, and the monitoring dashboard. The retainer is priced based on agency size and tool stack complexity. A 5-person agency with 5 tools is at the low end; a 20-person agency with 15+ tools and complex client reporting requirements is at the high end. The premium tier includes quarterly re-audits and emergency support SLA as bundled services. Price as a fraction of the agency\'s total payroll -- automating 10 hours/week at $50/hour effective rate saves $2K/month, making a $3K retainer a clear positive ROI.',
    },

    proposalAngle: {
      headline: 'Agency Automation Backend -- Stop Doing Manually What Software Can Do in Seconds',
      problem:
        'Your agency runs on manual processes -- copying data between tools, sending invoices by hand, generating reports individually for each client, onboarding every new client through the same 20-step checklist you created once and never updated. Your team spends more time on operations than on client work, and every manual step is a place where errors, delays, and forgotten tasks happen.',
      solution:
        'I audit your entire workflow, build automations that connect your tools and eliminate manual handoffs, and give you a monitoring dashboard that shows which processes are running and which have failed -- so your team spends their time on client work, not on copy-paste operations.',
      nextStep:
        'Send me your current tool stack and team size. I will do a 30-minute discovery call to identify your top 3 automation opportunities and estimate the hours saved per week -- no commitment required.',
    },

    blueprintAngle: {
      whoItIsFor:
        'Agency owners and operations directors who know their team is spending too much time on manual, repetitive processes -- client onboarding, invoicing, reporting, data entry -- but have never measured the waste or invested in automation.',
      problemItSolves:
        'Most agencies accept manual processes as "the way things are done" and never calculate the hidden cost of copy-paste operations, manual data entry, and repetitive email sends. The waste is invisible but can account for 30-50% of team time that should be spent on billable client work.',
      corePromise:
        'A full agency workflow audit, prioritised automation roadmap, built and deployed automations for your highest-impact processes, and a monitoring dashboard -- so your team recovers 10-20 hours per week that they currently spend on manual operations.',
      whyThisWorks:
        'Agencies that invest in automation recover 15-25 hours per week across their team within the first 60 days, because the 20% of workflows that consume 80% of manual labour (onboarding, invoicing, reporting) are the most automatable and produce the highest immediate time savings.',
      nextStepCTA:
        'Share this blueprint with agency owners who complain their team is "too busy" but cannot point to what is consuming their time. Offer a free 30-minute workflow audit discovery call as a starting point.',
    },
  },


  /* /--- Landing Page Designer x Coaches ---/ */
  [key('landing_page_designer_coaches')]: {
    pathTitle: 'Coach Discovery Page System',
    audienceInsight:
      'Coaches sell high-ticket services ($1K-$10K+ programs) through a combination of content marketing, discovery calls, and email nurturing. Their landing page is the bridge between free content and paid conversation -- it needs to convince a prospect who has consumed some free value to book a discovery call. Unlike ecommerce or SaaS landing pages that optimise for a direct purchase, coach landing pages optimise for a single action: booking a call. The page needs to communicate the coach\'s transformation promise, establish authority, overcome "not sure if this is for me" objections, and make booking a call feel like the natural next step rather than a high-pressure sales move.',
    offerStrategy:
      'Position as a discovery call conversion specialist, not a landing page designer. The page is not a brochure -- it is a bridge from content consumer to paid client. Every section, headline, and CTA is designed to reduce the friction of booking a call. The page should answer every objection a prospect has before they book, while making the booking process itself feel like a warm invitation rather than a sales funnel.',
    recommendedOfferType: 'one_time_project',

    deliverables: [
      {
        label: 'Discovery Call Landing Page',
        description:
          'A single-page landing page designed to convert content consumers into discovery call bookings: hero section with transformation promise and call booking CTA, authority section (credentials, media features, social proof numbers), client results section (before/after, testimonials with photos), approach section explaining the coaching methodology, FAQ section answering common objections, and a persistent booking CTA that scrolls with the visitor.',
        whyItMatters:
          'A coach\'s landing page is the most important page on their site because it directly determines how many content consumers convert into paid discovery calls. A well-structured page can double the call booking rate compared to a generic "work with me" page.',
      },
      {
        label: 'Booking Calendar Integration',
        description:
          'Seamless integration with the coach\'s scheduling tool (Calendly, Acuity, SimplyBook) -- pre-populated with the coach\'s availability, buffer times between calls, and automatic email/SMS reminders. The booking flow happens without leaving the landing page, with a post-booking confirmation page and calendar invite automation.',
        whyItMatters:
          'Every extra click between "I want to book" and "call is scheduled" loses a conversion. An integrated booking flow that keeps the prospect on the same page eliminates the drop-off that happens when prospects are redirected to an external scheduling tool.',
      },
      {
        label: 'Objection-Answering FAQ Section',
        description:
          'A strategically structured FAQ section that addresses the 7 most common objections coaches hear before a discovery call -- "I am not ready yet," "I cannot afford it," "I am not sure it will work for me," "I need to think about it," "I have tried other programs," "I need to talk to my partner," "Can you tell me more about what we would do?" -- with answers designed to move the prospect toward booking rather than giving them a reason to leave.',
        whyItMatters:
          'Prospects who reach the FAQ section are on the fence. An FAQ that validates their concerns while gently addressing each objection keeps them moving toward the booking CTA instead of hitting the back button to "think about it."',
      },
      {
        label: 'Trust Signal Integration',
        description:
          'Social proof elements integrated throughout the page: testimonial carousel with video thumbnail support, live count of coaching sessions completed or clients served, media logos and press features, certification badges, and a "as seen in" section -- placed at strategic trust-building moments rather than buried at the bottom.',
        whyItMatters:
          'Coaches sell on trust, not features. Trust signals placed at the moments when prospects are most sceptical -- after the price mention, before the CTA, in the approach section -- pre-empt objections and increase call booking confidence.',
      },
      {
        label: 'Post-Booking Nurture Email Sequence',
        description:
          'A 3-email post-booking sequence: confirmation + prep worksheet, reminder with a client success story, and a "see you tomorrow" email -- all integrated with the booking calendar and designed to reduce no-shows and increase call conversion rate.',
        whyItMatters:
          '20-30% of booked discovery calls result in no-shows. A nurture sequence that keeps the prospect engaged between booking and the call reduces no-show rates and increases the likelihood that the prospect arrives ready to buy.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Objection Deferral Architecture',
        description:
          'A page structure designed to surface and answer objections at the exact moment they arise in the prospect\'s decision journey -- cost concerns addressed near the CTA, trust concerns addressed near the authority section, "not sure if this is for me" addressed near the approach section. The page is engineered to answer every "but what about X?" before the prospect has to ask it.',
        bestFor:
          'Coaches selling high-ticket programs ($2K+) where the prospect needs significant reassurance before booking a call and where unanswered objections lead to "I will think about it" paralysis.',
      },
      {
        name: 'Low-Friction Booking Flow',
        description:
          'The booking process requires 3 clicks or fewer from any point on the page: click CTA -> select time slot from embedded calendar -> confirm. No account creation, no form filling, no "tell me about yourself" before the call. The prospect books before they have time to second-guess.',
        bestFor:
          'Coaches whose current booking process requires prospects to fill out a multi-field contact form or create an account before scheduling -- every field beyond name and email costs conversions.',
      },
      {
        name: 'Social Proof Placement Matrix',
        description:
          'A strategic matrix that maps each social proof element (testimonial, case study, credential, media feature) to the specific objection it neutralises, then places that social proof at the point on the page where the objection is most likely to occur. Price objection social proof goes near the pricing section; trust objection social proof goes near the CTA.',
        bestFor:
          'Coaches with strong social proof assets who are placing them randomly on their page rather than strategically deploying them to overcome specific objections at the point of maximum impact.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '2 weeks for initial build',
      revisions: '2 rounds of design review',
      feedbackRounds: '1 round of copy and objection strategy review',
      communication: 'Async via email + 1 kickoff call',
      responseTime: 'Within 24 hours',
      scopeWarning:
        'Coaches frequently change their offers, pricing, and messaging as they refine their coaching programs, which can require page copy and CTA updates. Build the page with a centralised copy management system (ACF or custom fields) so the coach can update text, testimonials, and pricing without requiring developer changes. Clarify that major structural changes (new sections, different page flow) after launch will be scoped as a separate project.',
    },

    valueAmplifiers: [
      {
        label: 'A/B Test Variant Package',
        description:
          'A second page variant with a different headline, hero approach, testimonial placement, or CTA copy -- deployed and set up for split testing so the coach can test which version converts better without building a second page from scratch.',
        whyItWorks:
          'The first version of a landing page is rarely the best version. An A/B test variant gives the coach a built-in optimisation path and a data-driven reason to improve their page over time rather than guessing what might work better.',
      },
      {
        label: 'Discovery Call Script Template',
        description:
          'A 1-page discovery call script template designed to follow the landing page\'s promise -- what to say in the first 5 minutes, how to connect the prospect\'s situation to the page\'s transformation promise, the qualification questions to ask, and the close -- so the coach\'s call delivery matches the page\'s conversion intent.',
        whyItWorks:
          'A landing page that promises a specific transformation creates a set of expectations. If the discovery call does not match those expectations, the prospect feels misled and does not buy. A call script that aligns with the page promise increases close rate from booked calls.',
      },
      {
        label: 'Page Performance Analytics Setup',
        description:
          'Google Analytics 4 setup with conversion tracking (call booking completed), event tracking (CTA clicks, FAQ accordion opens, testimonial carousel interactions), and a simple dashboard showing page traffic, conversion rate, and booking sources.',
        whyItWorks:
          'Coaches who track their page performance can make data-driven decisions about what to change. A simple analytics setup removes the technical barrier and gives the coach visibility into whether their page is working and where prospects are dropping off.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'flat_rate',
      beginnerRange: '$1,000-$2,000',
      intermediateRange: '$2,500-$5,000',
      premiumRange: '$6,000-$10,000',
      pricingLogic:
        'Coach landing page pricing should be a flat project fee based on page complexity and integration requirements. A single landing page with booking calendar integration and testimonial carousel is at the low end; a page with video background, advanced animation, multi-step booking flow, and A/B test variant is at the high end. The premium tier includes the A/B test variant and discovery call script template as bundled amplifiers. Price as a percentage of the coach\'s program price -- a page supporting a $3K program should cost less than one supporting a $10K program.',
    },

    proposalAngle: {
      headline: 'Coach Discovery Page System -- Turn Content Consumers Into Booked Calls',
      problem:
        'You create excellent content that attracts ideal prospects, but when they visit your website, the page does not convert them into booked discovery calls. The page feels like a bio instead of a bridge. Prospects read, nod, and leave without booking -- and you never know why they did not take the next step.',
      solution:
        'I build a discovery-optimised landing page designed around one goal: getting prospects to book a call. Objection-answering FAQ, strategic social proof placement, frictionless booking calendar integration, and a post-booking nurture sequence that reduces no-shows. Your content does the attracting; this page does the converting.',
      nextStep:
        'Send me your current website URL and your typical discovery call close rate. I will produce a 15-point landing page audit with specific recommendations for improving your call booking conversion rate -- no commitment required.',
    },

    blueprintAngle: {
      whoItIsFor:
        'Coaches and consultants who attract prospects through content marketing but struggle to convert website visitors into booked discovery calls -- coaches whose content brings the right people but whose page fails to close the gap.',
      problemItSolves:
        'Most coach websites are designed as online brochures that describe the coach\'s credentials and approach but do nothing to actively convert a reader into a booked call. The page lacks objection-answering structure, strategic social proof placement, and frictionless booking flow -- leaving the coach wondering why visitors do not book.',
      corePromise:
        'A discovery call landing page with objection-answering FAQ, strategic social proof matrix, friction-free booking calendar integration, and a post-booking nurture sequence -- so your content consistently feeds your discovery call calendar.',
      whyThisWorks:
        'Coaches who replace their generic "work with me" page with a conversion-optimised discovery page see 2-4x more booked calls from the same traffic, because the page actively moves prospects through the decision journey rather than passively presenting information and hoping they act.',
      nextStepCTA:
        'Share this blueprint with coaches who are getting traffic but not calls. Offer a free 15-point landing page audit as a starting point.',
    },
  },


  /* /--- Brand Designer x Creators ---/ */
  [key('brand_designer_creators')]: {
    pathTitle: 'Creator Brand Identity System',
    audienceInsight:
      'Creators on Instagram, YouTube, and TikTok are waking up to the reality that good content alone is not enough -- they need a recognisable brand that makes followers stop scrolling because they recognise the visual style before they read the caption. But most creators think branding means a logo and a colour palette. They need a brand identity that works across platforms, content formats, merchandise, and potential sponsorship decks. They need a designer who understands that a creator\'s brand is not just how it looks -- it is how it feels across every touchpoint, from an Instagram story to a YouTube thumbnail to a hoodie.',
    offerStrategy:
      'Position as a creator brand strategist, not a graphic designer. The deliverable is not a logo -- it is a brand system that makes the creator recognisable anywhere their content appears. Every element -- colour palette, typography, pattern library, iconography, photo filter -- works to create instant recognition across platforms, merchandise, and partnerships. The creator should be able to hand this brand system to any future designer, editor, or merch partner and get consistent output without hand-holding.',
    recommendedOfferType: 'one_time_project',

    deliverables: [
      {
        label: 'Creator Brand Strategy Document',
        description:
          'A brand strategy foundation: brand archetype, brand personality traits (3-5 words), target audience definition, competitive positioning map, brand voice guidelines (tone, vocabulary, message pillars), and visual territory exploration -- delivered as a presentation deck the creator can use to brief collaborators and sponsors.',
        whyItMatters:
          'A brand identity without a strategy is decoration. A strategy document ensures the visual identity is built on a clear foundation of who the creator is, who they serve, and how they are different -- making every design decision intentional rather than aesthetic preference.',
      },
      {
        label: 'Visual Identity System',
        description:
          'Complete visual identity: primary and secondary logo variations (horizontal, vertical, icon-only, favicon), extended colour palette with light/dark mode considerations, primary and secondary typefaces with web-safe fallbacks, pattern library (5+ patterns and textures), iconography set (20+ icons for content categories), and photo/graphic filter treatment for visual consistency across content.',
        whyItMatters:
          'Creators post across multiple platforms and formats. A comprehensive visual system ensures that an Instagram story, a YouTube thumbnail, a TikTok video, and a merch design all look like they come from the same creator -- building recognition that compounds with every post.',
      },
      {
        label: 'Content Template Kit',
        description:
          'Platform-specific templates built from the brand system: Instagram story templates (5 variations), Instagram post templates (3 variations), YouTube thumbnail templates (3 variations), YouTube end screen template, TikTok overlay template, Twitter/X header and post graphic templates, email header template, and a LinkedIn banner template -- all delivered as editable Figma or Canva files.',
        whyItMatters:
          'Creators post daily and do not have time to design every asset from scratch. A template kit makes the brand system operational from day one -- the creator can produce on-brand content without needing to be a designer or going back to the brand designer for every post.',
      },
      {
        label: 'Merch & Collateral Brand Guide',
        description:
          'A merch-specific brand extension guide: colour usage on different fabric types, logo placement guidelines for apparel, pattern application for accessories, packaging design specifications, and social media avatar/banner specifications for all platforms.',
        whyItMatters:
          'Creators who launch merchandise without a brand guide end up with products that look disconnected from their content. A merch brand guide ensures that a hoodie, a phone case, and a sticker all feel like the same brand, extending the creator\'s visual identity into physical products.',
      },
      {
        label: 'Sponsorship Deck Template',
        description:
          'A brand-compliant sponsorship media kit template: about section with brand story, audience demographics with data visualisation, content format showcase with embedded video thumbnails, past brand partnership highlights, rate card, and contact information -- designed to be updated by the creator as their metrics grow.',
        whyItMatters:
          'Creators who approach brands with a professional, on-brand media kit get 3-5x more sponsorship responses than those who send a PDF of their Instagram grid. A brand-compliant sponsorship deck signals that the creator treats their content as a business.',
      },
    ],

    uniqueMechanisms: [
      {
        name: 'Cross-Platform Recognition Architecture',
        description:
          'A brand system engineered for the way creators actually work: the logo, colours, and patterns are tested across Instagram (square, vertical, story), YouTube (16:9 thumbnail, horizontal banner), TikTok (vertical with overlay), Twitter (square, header), and merch (fabric, print, digital) before finalisation. Any element that does not work across all platforms gets redesigned.',
        bestFor:
          'Creators who are active on 3+ platforms and currently have a different visual identity on each one, confusing their audience and diluting their brand recognition.',
      },
      {
        name: 'Template-First Brand Delivery',
        description:
          'The brand system is delivered as operational templates from day one -- the creator does not receive a PDF of brand guidelines to decipher alone. Instead, they receive editable Canva/Figma templates that already have the brand applied, so their first post using the new brand is the first template they open, not the first design they create.',
        bestFor:
          'Creators who have no design background and would never open a brand guidelines PDF but would immediately use a pre-built template that looks amazing and matches their content.',
      },
      {
        name: 'Brand-in-a-Box Transition Kit',
        description:
          'A transition plan for rolling out the new brand without confusing the existing audience: phased rollout schedule (avatar first, then templates, then all content), announcement graphic templates, and a "what changed" FAQ for the creator\'s community -- ensuring the rebrand feels like an evolution rather than an identity crisis.',
        bestFor:
          'Established creators with an existing audience who are rebranding and need to manage the transition carefully to avoid confusing or alienating their current followers.',
      },
    ],

    scopeDefaults: {
      deliveryTime: '3-4 weeks for full brand system',
      revisions: '2 rounds on strategy, 2 rounds on visual identity',
      feedbackRounds: '3 rounds total (strategy, visual exploration, final refinement)',
      communication: 'Async via Slack + weekly check-in calls',
      responseTime: 'Within 24 hours',
      scopeWarning:
        'Creators often change their content niche, platform focus, or personal brand direction during the design process as they discover new opportunities or audience preferences. Lock the brand strategy (archetype, personality traits, positioning) before visual design begins. Any changes to the brand strategy after visual exploration has started will require a new strategy round and additional fee. Clarify that additional platform templates beyond the standard 12 (Instagram, YouTube, TikTok, Twitter, LinkedIn) are scoped separately.',
    },

    valueAmplifiers: [
      {
        label: 'Brand Photoshoot Art Direction Guide',
        description:
          'A 1-page art direction guide for the creator\'s next photoshoot: lighting references, colour palette applications, prop suggestions, composition guidelines, and outfit colour recommendations that match the brand palette -- so the creator can brief a photographer or shoot themselves with brand-consistent results.',
        whyItWorks:
          'The creator\'s personal photos are the most visible expression of their brand. An art direction guide ensures that every new photo the creator takes reinforces the brand identity rather than working against it.',
      },
      {
        label: 'Seasonal Brand Refresh Pack',
        description:
          'A seasonal or campaign-specific brand variation pack: alternate colour treatments, holiday-themed pattern variations, campaign-specific logo lockups, and temporary avatar treatments -- delivered quarterly or for major content campaigns.',
        whyItWorks:
          'Brands that stay visually fresh without losing recognition maintain higher audience engagement. A seasonal refresh pack gives the creator the tools to keep their content feeling timely and dynamic while staying recognisably on-brand.',
      },
      {
        label: 'Sponsor Brand Integration Guide',
        description:
          'A 2-page guide showing how the creator\'s brand integrates with sponsor brands without looking like an ad: colour overlay rules for sponsored content, logo placement hierarchy when featuring sponsor logos, sponsored post template variations, and disclosure text styling guidelines.',
        whyItWorks:
          'Creators who maintain their brand identity in sponsored content build stronger personal brands than those who let sponsor branding overwhelm their visual identity. A sponsor integration guide protects the creator\'s brand equity while making sponsors look good.',
      },
    ],

    pricingGuidance: {
      suggestedModel: 'flat_rate',
      beginnerRange: '$1,500-$3,000',
      intermediateRange: '$4,000-$8,000',
      premiumRange: '$10,000-$20,000',
      pricingLogic:
        'Creator brand identity pricing should be a flat project fee based on the scope of the brand system and the number of platform templates. A basic brand identity with strategy, visual system, and 10 templates is at the low end; a comprehensive system with merch guide, sponsorship deck, photoshoot guide, and 20+ templates is at the high end. The premium tier includes the seasonal refresh pack and sponsor integration guide as bundled amplifiers. Price as a reflection of the creator\'s current or target annual revenue -- a creator making $50K/year should invest 5-10% of annual revenue in their brand identity.',
    },

    proposalAngle: {
      headline: 'Creator Brand Identity System -- Look Like a Brand, Not Just Another Creator',
      problem:
        'Your content is good, but your visual identity is inconsistent. Your Instagram looks different from your YouTube, your thumbnails do not have a consistent style, your merchandise looks disconnected from your content, and when sponsors ask for a media kit, you send them a link to your Instagram. You know you need a brand, but you do not know where to start or what it should include.',
      solution:
        'I build a complete brand system: strategy foundation, visual identity (logo, colours, typography, patterns, iconography), platform-specific content templates, merch brand guide, and a sponsorship deck -- all designed to make you recognisable anywhere your content appears. You get a brand that works across every platform and touchpoint.',
      nextStep:
        'Send me links to your content platforms and tell me 3 words your ideal audience uses to describe you. I will put together a brand strategy concept with visual direction samples so you can see the approach before committing to the full system.',
    },

    blueprintAngle: {
      whoItIsFor:
        'Creators who have outgrown the "just post consistently" phase and need a professional brand identity that makes them recognisable across platforms, attractive to sponsors, and expandable into merchandise and products.',
      problemItSolves:
        'Most creators build their visual identity organically and inconsistently -- choosing colours, fonts, and styles as they go, resulting in a fragmented brand that does not build recognition. When they try to create merchandise or approach sponsors, the lack of a cohesive brand system makes them look amateur.',
      corePromise:
        'A complete brand identity system with strategy foundation, cross-platform visual system, content template kit, merch brand guide, and sponsorship deck -- delivered as editable templates so you can produce on-brand content from day one without needing to be a designer.',
      whyThisWorks:
        'Creators with a professional brand identity earn 3-5x more sponsorship revenue than those without, because brands pay for audience reach AND brand polish. A consistent visual identity signals that the creator treats their content as a business and will represent the sponsor professionally.',
      nextStepCTA:
        'Share this blueprint with creators approaching 10K+ followers who are starting to get sponsorship inquiries but have no media kit or brand system. Offer a free brand strategy concept with visual direction samples as a starting point.',
    },
  },

};

export function getAllPathContentKeys(): PathContentKey[] {
  return Object.keys(OFFER_ENGINEERING_PATH_CONTENT) as PathContentKey[];
}

export function getPathContentEntry(key: PathContentKey): OfferEngineeringPathContent | undefined {
  return OFFER_ENGINEERING_PATH_CONTENT[key];
}

