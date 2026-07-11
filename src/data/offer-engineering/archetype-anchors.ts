import type {
  OfferEngineeringPathContent,
  PathContentPricingGuidance,
  PathContentProposalAngle,
  PathContentBlueprintAngle,
} from './path-content-types';
import type { OfferType } from '../../types/offer-engineering';

export interface MarketOverrides {
  pathTitle: string;
  audienceInsight: string;
  offerStrategy: string;
  recommendedOfferType: OfferType;
  pricingGuidance: PathContentPricingGuidance;
  proposalAngle: PathContentProposalAngle;
  blueprintAngle: PathContentBlueprintAngle;
}

export function derivePathContent(
  base: OfferEngineeringPathContent,
  overrides: MarketOverrides,
): OfferEngineeringPathContent {
  return {
    ...base,
    pathTitle: overrides.pathTitle,
    audienceInsight: overrides.audienceInsight,
    offerStrategy: overrides.offerStrategy,
    recommendedOfferType: overrides.recommendedOfferType,
    pricingGuidance: overrides.pricingGuidance,
    proposalAngle: overrides.proposalAngle,
    blueprintAngle: overrides.blueprintAngle,
  };
}

/* ── Anchor: Video Editor × YouTube Creators ── */
export const video_editor_youtube_creators: OfferEngineeringPathContent = {
  pathTitle: 'Story-Driven Video Editing for YouTube Creators',
  audienceInsight:
    'YouTube creators need more than clean cuts — they need an editor who understands narrative structure, pacing, and emotional engagement. A well-edited video that tells a compelling story keeps viewers watching longer, increases retention, and grows the channel faster than technically perfect edits that lack soul. These creators need an editor who thinks like a storyteller first and a technician second.',
  offerStrategy:
    'Position this as a story-driven editing partnership, not a technical service. The deliverable is not a cut video — it is a narrative experience that keeps viewers watching from hook to end screen. Every pacing decision, music cue, and transition serves the story arc, not just the timeline. The creator provides the vision; the editor provides the narrative structure that makes the vision land.',
  recommendedOfferType: 'milestone_based',

  deliverables: [
    {
      label: 'Narrative Structure Edit',
      description:
        'Full-length video edit built around a clear narrative arc — hook establishes stakes, body delivers the journey, climax creates emotional payoff, resolution reinforces the takeaway. Pacing adjusted for each section\'s narrative purpose.',
      whyItMatters:
        'Videos with strong narrative structure retain 40-60% more viewers through the middle section than chronologically-cut footage, because viewers are invested in the story outcome rather than passively consuming information.',
    },
    {
      label: 'Emotional Pacing Map',
      description:
        'A pacing guide embedded in the edit timeline that marks emotional beats — tension building, relief moments, surprise reveals, reflective pauses — ensuring the video takes the audience on a controlled emotional journey rather than a flat information delivery.',
      whyItMatters:
        'Viewers remember how a video made them feel, not what they learned. An emotional pacing map ensures the edit delivers a memorable experience that keeps viewers coming back for the next video.',
    },
    {
      label: 'Music & Sound Design Layer',
      description:
        'Licensed music selection and custom sound design — ambient beds, transition sweeps, emphasis hits, and silence moments — all timed to the narrative beats to reinforce the emotional arc without distracting from the content.',
      whyItMatters:
        'Sound design is the most underutilised retention tool in video editing. Strategic silence before a key moment creates anticipation; a well-timed music swell reinforces emotional payoff. Most editors treat music as background noise rather than a narrative device.',
    },
    {
      label: 'Custom Intro/Outro Treatment',
      description:
        'A branded intro sequence (15-30 seconds) and outro sequence (30-60 seconds) that bookend each video with consistent visual identity, channel branding, and a retention-optimised end screen layout for suggested videos and subscribe CTA.',
      whyItMatters:
        'Consistent intro/outro branding builds channel recognition and gives viewers a familiar entry and exit ritual. A retention-optimised end screen recovers viewers who would otherwise leave after the content ends.',
    },
    {
      label: 'Performance Review & Recommendations',
      description:
        'A post-publishing review of the video\'s retention graph, thumbnail CTR, and audience demographics — with specific editing recommendations for the next video based on where viewers dropped off and what sections performed best.',
      whyItMatters:
        'An editor who reviews performance data makes better creative decisions on every subsequent video. Closing the feedback loop turns editing from a one-way deliverable into an iterative improvement cycle.',
    },
  ],

  uniqueMechanisms: [
    {
      name: 'Narrative Arc Engineering',
      description:
        'A structured pre-edit process where the raw footage is mapped against a 3-act narrative structure before a single cut is made. Each section is assigned a narrative purpose (setup, conflict, rising action, climax, resolution) and edited to serve that purpose rather than following chronological order.',
      bestFor:
        'Creators whose raw footage is chronological (vlog-style, day-in-the-life, tutorial recordings) and needs restructuring into a compelling narrative rather than a chronological replay.',
    },
    {
      name: 'Emotional Beat Timing System',
      description:
        'A timing framework that places emotional beats at specific intervals: hook within 0-15 seconds, tension ramp at 25%, emotional peak at 75%, resolution at 90%. Each beat is cued with a combination of visual pacing, music shift, and sound design.',
      bestFor:
        'Storytelling creators (documentary-style, personal journey, educational narratives) whose current edits are technically clean but emotionally flat.',
    },
    {
      name: 'Retrospective Edit Improvement Loop',
      description:
        'After each video is published and retention data is available (7 days post-publish), the editor reviews the retention graph against the edit timeline, identifies exactly which sections lost viewers and why, and applies that learning to the next video\'s edit plan.',
      bestFor:
        'Creators who publish regularly and want their editing to systematically improve over time based on real audience behaviour data rather than guesswork.',
    },
  ],

  scopeDefaults: {
    deliveryTime: '7-10 business days per 15-25 minute video',
    revisions: '2 rounds on the narrative cut',
    feedbackRounds: '1 round of narrative direction review before editing begins',
    communication: 'Async via Slack with weekly check-in',
    responseTime: 'Within 24 hours',
    scopeWarning:
      'Creators often send raw footage with no clear narrative direction — hours of B-roll, rambling voiceover, or unstructured clips. Define a minimum footage structure requirement (shot list, key talking points, must-include moments) before the first edit. Edits that require significant structural reorganisation of unstructured footage should be scoped at a higher tier.',
  },

  valueAmplifiers: [
    {
      label: 'Retention Graph Post-Mortem Call',
      description:
        'A 30-minute video call 7 days after publishing to review the video\'s retention graph together — identifying exactly where viewers dropped off, which sections performed best, and what editing changes would improve the next video.',
      whyItWorks:
        'Most editors never see the performance data. Closing the loop between edit decisions and actual retention data makes every subsequent video better than the last.',
    },
    {
      label: 'Thumbnail Concept Brief',
      description:
        'A thumbnail concept with two variants, including composition notes, colour psychology guidance, and headline options — designed to match the video\'s narrative tone and attract the target audience.',
      whyItWorks:
        'Thumbnail CTR and retention are linked. A thumbnail that accurately represents the video\'s emotional arc attracts viewers who stay, reducing bounce rate and improving the retention graph from the first second.',
    },
    {
      label: 'Social Clip Extraction',
      description:
        '3 short-form clips extracted from the long-form video — each edited as a standalone hook-driven short (30-60 seconds) optimised for YouTube Shorts, Instagram Reels, or TikTok — delivered alongside the main video.',
      whyItWorks:
        'Each long-form video contains multiple short-form moments. Extracting clips during the main edit takes 30 minutes but creates a week of social content that drives traffic back to the full video.',
    },
  ],

  pricingGuidance: {
    suggestedModel: 'value_based',
    beginnerRange: '$300-$600 per video',
    intermediateRange: '$800-$1,500 per video',
    premiumRange: '$2,000-$3,500 per video',
    pricingLogic:
      'Video editing pricing should reflect the creator\'s channel revenue, not video length. A creator earning $3K/month per video can justify higher editing costs because improved retention directly increases ad revenue. Price as 15-25% of estimated per-video revenue. Tier by narrative complexity: simple talking-head edits at the low end, multi-location narrative edits with sound design at the mid-range, and documentary-style productions with full sound design and colour grading at the premium tier.',
  },

  proposalAngle: {
    headline: 'Story-Driven Video Editing — Turn Raw Footage Into a Narrative Your Audience Remembers',
    problem:
      'Your videos look clean but they do not hold viewers through the middle. The retention graph drops at predictable points, and you know the issue is not the content — it is the pacing. The footage is good, but the edit lacks the narrative structure that keeps people watching.',
    solution:
      'I edit your videos around a narrative arc, not a timeline. Every pacing decision, music cue, and transition is chosen to serve the story and keep viewers emotionally engaged from hook to end screen. The result is a video that does not just look good — it feels good to watch.',
    nextStep:
      'Send me your last video with the retention graph. I will analyse where viewers dropped and send back a 3-point narrative restructuring plan for your next video — no commitment required.',
  },

  blueprintAngle: {
    whoItIsFor:
      'YouTube creators who publish narrative-driven content (vlogs, documentaries, educational storytelling, personal journey videos) and understand that emotional engagement drives retention more than technical polish.',
    problemItSolves:
      'Most video editors cut for clarity and aesthetics, not for narrative and emotion. Creators end up with technically clean edits that fail to hold viewers because the pacing does not serve a story arc — it just follows the footage chronology.',
    corePromise:
      'A story-driven video edit with narrative arc engineering, emotional beat timing, custom sound design, and a post-publishing performance review — so every video holds viewers longer and builds a connection with the audience.',
    whyThisWorks:
      'YouTube\'s algorithm rewards watch time and session duration. A video that tells a compelling story keeps viewers watching 40-60% longer than a video that simply presents information, because narrative structure creates anticipation, emotional investment, and a desire to see the resolution.',
    nextStepCTA:
      'Share this blueprint with YouTube creators whose retention graphs show a mid-video drop-off pattern. Offer a free 3-point narrative audit of their most recent video as a starting point.',
  },
};

/* ── Anchor: Frontend Developer × SaaS Startups ── */
export const frontend_developer_saas_startups: OfferEngineeringPathContent = {
  pathTitle: 'UI Development for SaaS — Performant Frontends That Convert',
  audienceInsight:
    'SaaS startups need a frontend that loads fast, feels responsive, and communicates value in under 3 seconds. Unlike marketing sites that prioritise visual impact, SaaS interfaces must balance performance with conversion — every millisecond of load time costs trial sign-ups. These founders and CTOs do not need a beautiful brochure; they need a frontend engineered for Core Web Vitals, accessibility, and a seamless trial-to-paid experience across devices. They are technical enough to know when a site is slow but need a frontend specialist who can ship production-quality UI without being hand-held.',
  offerStrategy:
    'Position as a frontend delivery partner for early-stage SaaS, not a general web developer. The deliverable is not "a website" — it is a conversion-optimised marketing frontend with component systems, analytics instrumentation, and performance budgets built in from the first commit. The startup should be able to iterate on copy and layout without touching code, while the core architecture handles routing, SEO, and performance out of the box.',
  recommendedOfferType: 'milestone_based',

  deliverables: [
    {
      label: 'Conversion-First Marketing Site Build',
      description:
        'A responsive marketing site built with modern frontend tooling (Next.js or Vite-based), featuring a hero section with value prop and primary CTA, feature comparison grid, pricing table, FAQ with rich results markup, and a persistent demo/sign-up CTA that scrolls with the user.',
      whyItMatters:
        'SaaS visitors decide whether to sign up in under 5 seconds. A performance-optimised, conversion-focused frontend structure reduces bounce rate and increases trial sign-up rate by guiding the visitor through a proven persuasion sequence rather than letting them wander.',
    },
    {
      label: 'Component Library & Design System Integration',
      description:
        'A reusable component library built from the startup\'s design system or Figma files — buttons, forms, cards, navigation, modals, and data display components — each typed, documented, and ready for the product team to use in future pages.',
      whyItMatters:
        'Startups that rebuild UI components for every page waste engineering time and accumulate visual debt. A component library from day one means the marketing site and the product can share consistent, accessible, tested UI elements.',
    },
    {
      label: 'Performance & SEO Foundation',
      description:
        'Configuration and optimisation for Core Web Vitals (LCP under 2.5s, FID under 100ms, CLS under 0.1), semantic HTML with structured data, dynamic meta tags for social sharing, sitemap generation, canonical URLs, and page-speed best practices targeting 90+ on mobile Lighthouse.',
      whyItMatters:
        'Page speed is a direct ranking factor and conversion driver. A startup whose site loads in 1.5s instead of 4s will see 20-30% higher trial conversion rates and better organic search performance from day one.',
    },
    {
      label: 'Analytics & CRO Instrumentation',
      description:
        'Integration with the startup\'s analytics stack (GA4, Mixpanel, PostHog, or Plausible) with pre-configured event tracking for sign-ups, pricing page interactions, FAQ engagement, and scroll depth — plus A/B testing framework setup (Google Optimize or feature flags) so the growth team can run experiments without developer help.',
      whyItMatters:
        'A SaaS site without analytics is flying blind. Instrumentation from launch means the startup has conversion data on day one rather than setting it up weeks later when they realise nothing is being tracked.',
    },
    {
      label: 'Documentation & Changelog Section',
      description:
        'A documentation or knowledge base section integrated into the site, with search, category filtering, and version tracking — plus a changelog page that auto-publishes from GitHub releases or Linear webhooks, signalling active development to technical buyers.',
      whyItMatters:
        'Technical buyers evaluate documentation quality before trialling. A clean docs section signals product maturity and reduces support burden. A changelog shows the product is actively maintained, building trust with engineering-minded prospects.',
    },
  ],

  uniqueMechanisms: [
    {
      name: 'Performance Budget Pipeline',
      description:
        'A CI/CD-integrated performance budget that fails builds if new changes push LCP, TBT, or CLS beyond defined thresholds — enforced from the first commit so the site never regresses on speed as new features are added.',
      bestFor:
        'SaaS startups whose founders are technical enough to care about performance but need automated enforcement rather than manual discipline to keep the frontend fast as the team grows.',
    },
    {
      name: 'Component-First Delivery Model',
      description:
        'Pages are built from a shared component library, not from scratch. A new landing page is assembled from existing blocks in hours, not days. The startup\'s growth team can request new page layouts and get them within a single sprint cycle.',
      bestFor:
        'Early-stage SaaS startups whose messaging and landing pages change weekly as they iterate on positioning and need a frontend that keeps pace without accumulating technical debt.',
    },
    {
      name: 'Self-Serve Content Editing Layer',
      description:
        'A headless CMS or structured content layer (Contentlayer, Sanity, or decoupled WordPress) that lets non-technical team members update copy, add testimonials, change pricing, and publish blog posts without touching the frontend codebase — while the developer maintains control over layout, design, and performance.',
      bestFor:
        'SaaS startups where the founder or marketing lead needs to iterate on copy daily without waiting for developer availability for every text change.',
    },
  ],

  scopeDefaults: {
    deliveryTime: '3-5 weeks for initial site build (5-8 pages)',
    revisions: '2 rounds on design-to-code translation',
    feedbackRounds: '2 rounds of content and layout review',
    communication: 'Async via Slack + weekly check-ins',
    responseTime: 'Within 24 hours',
    scopeWarning:
      'SaaS startups frequently change their pricing, feature names, and target audience during the build process as they respond to market feedback. Lock the pricing structure, feature names, and core messaging before development begins. Any changes to pricing tiers, product names, or primary value proposition during development count as a scope change. Build the site with a "messaging lock" milestone: once development starts, copy changes go through the self-serve layer, not code changes.',
  },

  valueAmplifiers: [
    {
      label: 'Post-Launch Conversion Audit',
      description:
        'A 30-day post-launch analysis of the site\'s conversion performance — traffic sources, landing page bounce rates, trial sign-up funnel, pricing page interaction heatmaps — with 5 specific recommendations for improvement based on real user behaviour data.',
      whyItWorks:
        'A site that launches without a conversion audit is a guess. A data-driven audit 30 days after launch turns the site from a static asset into a continuously improving conversion engine.',
    },
    {
      label: 'Pricing Page Experiment Variants',
      description:
        '3 pre-built pricing page layout variants (feature highlighting, CTA placement, social proof positioning) that the startup can A/B test against their current pricing page — configured and deployed by the developer so the growth team only needs to turn on the experiment.',
      whyItWorks:
        'Pricing page optimisation is the highest-leverage experiment for most SaaS startups. Pre-built experiment variants eliminate the "what do we test?" paralysis and give the growth team a structured starting point.',
    },
    {
      label: 'Component Library Extension',
      description:
        'An additional set of 10+ components beyond the initial build — data tables, charts, timeline views, onboarding flows, notification systems — scoped to the startup\'s product roadmap and delivered as a second milestone.',
      whyItWorks:
        'The initial component library covers the marketing site. An extension that covers the product UI means the startup\'s engineering team can build product features using pre-built, tested components rather than starting from scratch.',
    },
  ],

  pricingGuidance: {
    suggestedModel: 'flat_rate',
    beginnerRange: '$3,000-$6,000',
    intermediateRange: '$7,000-$12,000',
    premiumRange: '$15,000-$25,000',
    pricingLogic:
      'SaaS frontend pricing should be a flat project fee based on page count, component complexity, and integration requirements. A 5-page marketing site with standard analytics integration is at the low end; a 12-page site with custom components, headless CMS, documentation section, and A/B testing infrastructure is at the high end. The premium tier includes the post-launch conversion audit and pricing page experiment variants. Price as a fraction of what the startup spends on customer acquisition — a frontend that improves conversion by 15% is worth 3-5x its development cost in reduced CAC.',
  },

  proposalAngle: {
    headline: 'UI Development for SaaS — A Frontend Engineered for Speed and Conversion',
    problem:
      'Your current site loads slowly, your Lighthouse scores are embarrassing, and your team spends more time fixing layout bugs than building features. You know a faster, better-structured frontend would improve conversion, but rebuilding it would take engineering cycles away from the product.',
    solution:
      'I build a modern, performant frontend with a reusable component library, analytics instrumentation, headless CMS integration for self-serve copy changes, and a performance budget enforced from day one. Your team owns the product; I own the frontend infrastructure.',
    nextStep:
      'Send me your current site URL and your Lighthouse performance scores. I will produce a 10-point frontend optimisation audit with estimated conversion impact for each issue — no commitment required.',
  },

  blueprintAngle: {
    whoItIsFor:
      'Early-stage SaaS startups that have outgrown their basic landing page and need a professional, performant frontend that supports conversion rate optimisation, content iteration, and growing engineering teams.',
    problemItSolves:
      'Most early-stage SaaS sites are built quickly by the founding team and accumulate performance debt, inconsistent UI, and no analytics instrumentation. By the time the startup is ready to invest in growth, the frontend is a bottleneck that slows down every experiment.',
    corePromise:
      'A performant, component-based frontend with analytics instrumentation, self-serve content editing, and a CI-enforced performance budget — so your site loads fast, converts well, and your team can iterate without touching code.',
    whyThisWorks:
      'SaaS startups that invest in a professional frontend before scaling ad spend see 2-3x higher trial-to-paid conversion rates than those that spend on traffic first and optimise the site later, because every dollar of ad spend lands on a page engineered to convert.',
    nextStepCTA:
      'Share this blueprint with SaaS founders who are spending money on ads but seeing poor conversion. Offer a free 10-point frontend performance and conversion audit as a starting point.',
  },
};

/* ── Anchor: UI/UX Designer × Coaches ── */
export const ui_ux_designer_coaches: OfferEngineeringPathContent = {
  pathTitle: 'Coaching Platform UX — Clean Design That Builds Trust and Drives Sign-Ups',
  audienceInsight:
    'Coaches sell high-ticket transformations through trust, authority, and a clear client journey — from free content to discovery call to paid program. Their digital presence needs to mirror that journey: a website that feels personal, professional, and friction-free. Unlike ecommerce or SaaS interfaces that optimise for speed of transaction, coaching interfaces must optimise for speed of trust. Every pixel, every interaction, every page transition should signal competence and care. Coaches need a designer who understands that their website is a 24/7 salesperson — not a digital brochure.',
  offerStrategy:
    'Position as a coaching experience designer, not a UI designer. The deliverable is not a website layout — it is a trust-building digital experience that moves prospects from "who is this person?" to "I want to work with them" with minimal friction. The design should make the coach\'s authority undeniable, their process clear, and booking a discovery call the most natural action on every page. Every design decision is tested against the question: "Does this make it easier for a prospect to trust and book?"',
  recommendedOfferType: 'one_time_project',

  deliverables: [
    {
      label: 'Coach Website UX Design',
      description:
        'A full website design (5-8 pages) including homepage with transformation promise, about page with authority narrative, services/programs page with clear offer structure, discovery call landing page, blog or resources section, and contact page — all designed around trust-building and call booking conversion.',
      whyItMatters:
        'A coach\'s website is their primary sales asset. A UX-designed site that guides visitors from awareness to booking without friction directly increases the number of paid discovery calls from the same traffic.',
    },
    {
      label: 'Member Portal or Course Platform UI',
      description:
        'UX design for the coach\'s client portal or course platform — dashboard, lesson navigation, progress tracking, community or discussion area, and resource library — designed for engagement and retention rather than just information delivery.',
      whyItMatters:
        'Coaches with a paid program need their client experience to match the quality of their coaching. A well-designed member portal increases course completion rates, client satisfaction, and referrals.',
    },
    {
      label: 'Booking Flow UX Optimisation',
      description:
        'Redesign of the discovery call booking flow — from CTA button to calendar selection to confirmation — eliminating every unnecessary click, field, and redirect. Includes post-booking confirmation page design and email notification templates.',
      whyItMatters:
        'Every extra step between "I want to book" and "call is scheduled" costs conversions. A frictionless booking flow designed for trust and ease can increase booked call rate by 30-50% compared to a standard scheduling tool embed.',
    },
    {
      label: 'Trust Signal Layout System',
      description:
        'A strategic layout system for placing trust signals — testimonials, case studies, media logos, certification badges, client count — at the exact points in the user journey where scepticism is highest: near pricing, before the booking CTA, and on the services page.',
      whyItMatters:
        'Trust signals placed reactively (tucked in a footer) do not overcome objections. A strategic layout system ensures the right trust signal appears at the exact moment the prospect needs it to take the next step.',
    },
    {
      label: 'Responsive Design & Accessibility Pass',
      description:
        'Full responsive design across desktop, tablet, and mobile — with WCAG 2.1 AA accessibility compliance for colour contrast, keyboard navigation, screen reader support, and touch targets. Delivered with a design system specification document.',
      whyItMatters:
        'A significant portion of coaching website traffic comes from mobile devices. A responsive, accessible design ensures every visitor has a professional experience regardless of device, and eliminates legal risk around accessibility compliance.',
    },
  ],

  uniqueMechanisms: [
    {
      name: 'Trust-First Information Architecture',
      description:
        'A page structure designed to establish trust before presenting an offer: hero section communicates transformation, next section demonstrates authority (credentials, media features, client count), next section shows proof (testimonials, case studies), then the offer is presented — always preceded by enough trust-building that the offer feels earned rather than pushy.',
      bestFor:
        'Coaches whose current websites lead with their offer and wonder why visitors leave without booking — the trust foundation was never laid before the ask.',
    },
    {
      name: 'Conversion Path Mapping',
      description:
        'A pre-design workshop where the coach\'s ideal client journey is mapped across every possible entry point (Instagram, podcast, referral, Google search, email) and the website UX is designed to match each entry point with the appropriate landing experience and CTA — rather than sending all traffic to a generic homepage.',
      bestFor:
        'Coaches who drive traffic from multiple sources and send everyone to the same homepage, resulting in mismatched expectations and low conversion from specific channels.',
    },
    {
      name: 'Post-Booking Experience Design',
      description:
        'The design scope extends beyond the booking confirmation to include the post-booking experience: what the prospect sees after booking (confirmation page, prep email sequence, calendar sync instructions, intake form) — ensuring the trust built on the website carries through to the first interaction.',
      bestFor:
        'Coaches whose booking completion rate is high but whose show-up rate is low — the post-booking experience fails to maintain the momentum created by the website design.',
    },
  ],

  scopeDefaults: {
    deliveryTime: '3-4 weeks for full website design',
    revisions: '2 rounds on wireframes, 2 rounds on visual design',
    feedbackRounds: '3 rounds (strategy, wireframes, visual design)',
    communication: 'Async via Slack + weekly check-in calls',
    responseTime: 'Within 24 hours',
    scopeWarning:
      'Coaches frequently refine their offers, pricing, and messaging during the design process as they gain clarity on their positioning. Lock the offer structure, pricing, and core messaging before visual design begins. Any changes to program names, pricing tiers, or target client definition after visual design has started will require a new strategy round and additional fee. Clarify that additional pages beyond the standard 8 are scoped separately.',
  },

  valueAmplifiers: [
    {
      label: 'Discovery Call Script Template',
      description:
        'A 1-page discovery call script designed to match the website\'s UX flow — what to say in the first 5 minutes to reinforce the website\'s promise, the qualification questions that align with the website\'s client profile, and a close that feels like a natural next step rather than a sales pitch.',
      whyItWorks:
        'A website that promises a specific transformation raises expectations. If the discovery call experience does not match the website\'s quality, the prospect feels misled. A call script aligned to the UX maintains trust through the conversion moment.',
    },
    {
      label: 'A/B Test Page Variant',
      description:
        'A second version of the homepage with a different hero approach, testimonial placement, or CTA strategy — designed and spec\'d for the developer to build alongside the primary design — so the coach can test which version converts better.',
      whyItWorks:
        'The first version of any design is rarely the best. An A/B variant gives the coach a built-in optimisation path and a data-driven reason to improve their site over time rather than guessing what might work better.',
    },
    {
      label: 'Brand Style Guide Extension',
      description:
        'A brand style guide document extending the website design into other touchpoints: social media graphic templates, email header designs, presentation deck template, and print collateral (business card, one-pager) — all consistent with the website\'s visual identity.',
      whyItWorks:
        'Coaches who present a consistent brand across website, social media, email, and client materials build trust faster than those whose visual identity changes in every channel. A style guide extension ensures the coach looks professional everywhere.',
    },
  ],

  pricingGuidance: {
    suggestedModel: 'flat_rate',
    beginnerRange: '$2,000-$4,000',
    intermediateRange: '$5,000-$10,000',
    premiumRange: '$12,000-$20,000',
    pricingLogic:
      'Coach website UX pricing should be a flat project fee based on page count and design complexity. A 5-page website with standard pages and booking integration is at the low end; a 10-page site with member portal UX design, custom illustrations, and A/B test variant is at the high end. The premium tier includes the A/B test variant and brand style guide extension as bundled amplifiers. Price as a reflection of the coach\'s annual revenue — a coach earning $100K/year coaching should invest 5-10% of annual revenue in their digital presence.',
  },

  proposalAngle: {
    headline: 'Coaching Platform UX — A Digital Presence That Builds Trust Before It Asks for the Sale',
    problem:
      'Your website does not feel like you. The template you chose looks generic, the flow does not match how your ideal clients decide to work with a coach, and the booking process has too many steps. You know your website is losing you clients, but a redesign feels overwhelming and you are not sure what you actually need.',
    solution:
      'I design a coaching website around your client\'s trust-building journey — from the first impression to the booked call to the post-booking experience. The design makes your authority undeniable, your process clear, and booking a discovery call the easiest thing a visitor can do.',
    nextStep:
      'Send me your current website URL and tell me about your ideal client. I will produce a 10-point UX audit with specific recommendations for improving your site\'s trust-building and conversion flow — no commitment required.',
  },

  blueprintAngle: {
    whoItIsFor:
      'Coaches and consultants who know their current website is losing them clients but are not sure what to change — coaches whose content attracts the right people but whose digital presence fails to convert interest into booked calls.',
    problemItSolves:
      'Most coaching websites are built from templates that prioritise aesthetics over trust-building and conversion. The result is a beautiful site that feels generic, does not communicate the coach\'s unique authority, and buries the booking process behind too many clicks.',
    corePromise:
      'A trust-first website UX with strategic information architecture, frictionless booking flow, trust signal placement system, and post-booking experience design — so every visitor moves naturally from interest to booked call.',
    whyThisWorks:
      'Coaches who invest in a professional, trust-optimised website see 2-4x more booked calls from the same traffic, because the design actively builds credibility and removes friction rather than passively presenting information and hoping the visitor acts.',
    nextStepCTA:
      'Share this blueprint with coaches who are getting traffic but not booked calls. Offer a free 10-point UX audit of their current website as a starting point.',
  },
};

/* ── Anchor: Social Media Designer × Creators ── */
export const social_media_designer_creators: OfferEngineeringPathContent = {
  pathTitle: 'Creator Social Media Design System — Consistent Visual Identity Across Every Platform',
  audienceInsight:
    'Creators on Instagram, TikTok, YouTube, Twitter, and LinkedIn need a visual identity that makes followers stop scrolling because they recognise the style before they read the caption. But most creators are not designers — they piece together templates, use inconsistent colours, and end up with a feed that looks disjointed. As they grow from hobbyist to professional, the lack of a cohesive visual system becomes a barrier to sponsorships, merchandise, and audience trust. They need a designer who can build a brand system that works across every platform and format, packaged as templates they can actually use without design skills.',
  offerStrategy:
    'Position as a creator brand system designer, not a social media graphic designer. The deliverable is not individual graphics — it is a complete visual system with platform-specific templates that make the creator look professional everywhere their content appears. The system should be simple enough that the creator can produce on-brand content daily without the designer, but comprehensive enough that a sponsorship partner or merch manufacturer gets consistent brand output. Success is measured in how easy the system is for the creator to use independently.',
  recommendedOfferType: 'one_time_project',

  deliverables: [
    {
      label: 'Visual Identity & Brand Guidelines',
      description:
        'Complete visual identity: primary and secondary logo variations (horizontal, stacked, icon-only, favicon), extended colour palette with light/dark mode variants, primary and secondary typefaces with web-safe fallbacks, pattern and texture library (5+ patterns), and photo filter treatment for visual consistency across all content formats.',
      whyItMatters:
        'A creator without a consistent visual identity blends into the feed. A professional visual system ensures that every post, story, thumbnail, and video reinforces the same brand — building recognition that compounds with every piece of content.',
    },
    {
      label: 'Platform-Specific Template Kit',
      description:
        'Editable templates (Canva and Figma) for every platform the creator uses: Instagram post templates (5 variations), Instagram story templates (5 variations), YouTube thumbnail templates (3 variations), YouTube end screen and banner, TikTok overlay template, Twitter/X header and post graphic, LinkedIn banner and post graphic, and email header template.',
      whyItMatters:
        'Creators post daily and do not have time to design from scratch. A template kit makes the brand operational from day one — the creator produces on-brand content without needing design skills or going back to the designer for every post.',
    },
    {
      label: 'Content Format Style Guide',
      description:
        'A 1-page guide showing how each content format should look: talking-head video overlay style, text-only graphic style, quote card format, before/after comparison layout, carousel post template, and collaboration or shoutout graphic format — all consistent with the brand identity.',
      whyItMatters:
        'Creators who post multiple content formats often end up with a disjointed feed because each format was designed independently. A format style guide ensures every type of content feels like it belongs to the same creator.',
    },
    {
      label: 'Sponsorship-Ready Media Kit Template',
      description:
        'A brand-compliant sponsorship media kit template: about section with brand story, audience demographics with data visualisation, content format showcase, past brand partnership highlights, rate card, and contact information — designed to be updated by the creator as their metrics grow.',
      whyItMatters:
        'Creators who approach brands with a professional, on-brand media kit get 3-5x more sponsorship responses than those who send a link to their Instagram. A brand-compliant sponsorship deck signals professionalism and makes the creator look like a business partner.',
    },
    {
      label: 'Brand Rollout & Transition Guide',
      description:
        'A rollout plan for introducing the new brand to the existing audience without confusion: phased transition schedule (profile picture first, then templates, then all content), announcement graphic templates, and a "what changed" FAQ for the creator\'s community.',
      whyItMatters:
        'An abrupt rebrand can confuse and alienate an existing audience. A thoughtful rollout plan makes the transition feel like an evolution rather than an identity crisis, preserving audience trust and engagement.',
    },
  ],

  uniqueMechanisms: [
    {
      name: 'Platform-First Design Architecture',
      description:
        'Every brand element is tested across all the creator\'s platforms before finalisation — a colour that looks great in an Instagram post may be unreadable in a YouTube thumbnail or wash out on a printed hoodie. Any element that fails on one platform gets redesigned before delivery.',
      bestFor:
        'Creators active on 3+ platforms whose current visual identity works on one platform but falls apart on others, forcing them to redesign assets per platform.',
    },
    {
      name: 'Template-First Delivery Model',
      description:
        'The brand system is delivered as operational templates, not a PDF brand guide. The creator\'s first experience with their new brand is opening a pre-built template that already looks amazing — not reading a document that explains what colours to use. This eliminates the gap between "having a brand" and "using a brand."',
      bestFor:
        'Creators with no design background who would never open a brand guidelines PDF but would immediately start using a pre-built template that matches their content.',
    },
    {
      name: 'Content Format Scaling System',
      description:
        'A modular template architecture where one brand element (colour, pattern, logo variation) can be applied across multiple content formats without redesign — a colour palette applied to a story template creates a different but equally brand-consistent result than the same palette applied to a thumbnail template, giving variety within consistency.',
      bestFor:
        'Creators whose feed looks repetitive because they use the exact same template for every post, sacrificing visual interest for brand consistency.',
    },
  ],

  scopeDefaults: {
    deliveryTime: '2-3 weeks for full brand system and template kit',
    revisions: '2 rounds on visual identity, 1 round on templates',
    feedbackRounds: '2 rounds (identity exploration, template review)',
    communication: 'Async via Slack + video call for brand direction',
    responseTime: 'Within 24 hours',
    scopeWarning:
      'Creators often change their content niche, platform strategy, or personal brand direction during the design process as they spot new opportunities or audience trends. Lock the brand direction (vibe, target audience, platform priorities) before visual design begins. Additional platform templates or content formats beyond the agreed scope are priced separately. Clarify that the templates are delivered as editable Canva and Figma files — the creator or their editor should be comfortable using these tools to produce content independently after handoff.',
  },

  valueAmplifiers: [
    {
      label: 'Seasonal Brand Refresh Pack',
      description:
        'A seasonal brand variation pack delivered quarterly: alternate colour treatments for holidays or campaigns, themed pattern variations, temporary profile picture templates, and campaign-specific logo lockups — keeping the brand feeling fresh without losing recognition.',
      whyItWorks:
        'Creators who update their visuals for seasons, holidays, or campaigns maintain higher audience engagement. A seasonal pack gives them the tools to stay timely without redesigning their brand every quarter.',
    },
    {
      label: 'Sponsor Integration Guide',
      description:
        'A 2-page guide showing how the creator\'s brand integrates with sponsor brands: colour overlay rules for sponsored content, logo placement hierarchy, sponsored post template variations, and disclosure text styling guidelines.',
      whyItWorks:
        'Creators who maintain their brand identity in sponsored content build stronger personal brands. A sponsor integration guide protects the creator\'s visual equity while making sponsors look professionally presented.',
    },
    {
      label: 'Merchandise Brand Extension',
      description:
        'A merch-specific brand extension: logo placement guidelines for apparel, colour usage on different fabric types, pattern application for accessories, and packaging/label design specifications — so the creator\'s merchandise looks like a natural extension of their content brand.',
      whyItWorks:
        'Creators who launch merchandise without a brand guide end up with products that look disconnected from their content. A merch extension ensures that a hoodie, phone case, and sticker all feel like the same brand.',
    },
  ],

  pricingGuidance: {
    suggestedModel: 'flat_rate',
    beginnerRange: '$1,000-$2,500',
    intermediateRange: '$3,000-$6,000',
    premiumRange: '$7,000-$12,000',
    pricingLogic:
      'Creator brand system pricing should be a flat project fee based on the number of platforms, templates, and brand elements. A basic identity with logo, colours, and 5 platform templates is at the low end; a comprehensive system with full visual identity, 20+ templates across 5+ platforms, sponsorship kit, and merch guide is at the high end. The premium tier includes the seasonal refresh pack and merch extension as bundled amplifiers. Price as a reflection of the creator\'s current or target monthly revenue — a creator making $5K/month should invest 1-2 months of revenue in their brand system.',
  },

  proposalAngle: {
    headline: 'Creator Social Media Design System — A Consistent Brand That Followers Recognise Before They Read the Caption',
    problem:
      'Your feed looks inconsistent. Your Instagram style does not match your YouTube thumbnails, your TikTok videos use different colours, and your Twitter graphics look like an afterthought. You know a cohesive brand would make you look more professional and attract better sponsorships, but you are not a designer and you do not know where to start.',
    solution:
      'I build a complete visual brand system with platform-specific templates for every channel you post on — Instagram, YouTube, TikTok, Twitter, LinkedIn. You get a recognisable look that works everywhere, delivered as editable templates so you can create on-brand content daily without design skills.',
    nextStep:
      'Send me links to your content platforms and tell me 3 words your ideal audience uses to describe you. I will create a brand direction concept with visual samples so you can see the approach before committing to the full system.',
  },

  blueprintAngle: {
    whoItIsFor:
      'Creators who are active on multiple social platforms and know they need a consistent visual identity but lack the design skills or time to build one themselves — creators who are ready to look professional and attract sponsorships.',
    problemItSolves:
      'Most creators build their visual identity piece by piece — choosing colours and templates as they go — resulting in a fragmented brand that does not build recognition, confuses their audience, and makes them look less professional to potential sponsors.',
    corePromise:
      'A complete visual brand system with platform-specific templates, content format style guide, sponsorship-ready media kit, and a phased rollout plan — delivered as editable templates so you produce on-brand content from day one without needing to be a designer.',
    whyThisWorks:
      'Creators with a consistent, professional visual identity grow audience recognition 3x faster than those with inconsistent branding, because every post reinforces the same mental shortcut. A brand that followers recognise before they read the caption wins the scroll-stop battle every time.',
    nextStepCTA:
      'Share this blueprint with creators who are approaching 10K+ followers and starting to get sponsorship inquiries. Offer a free brand direction concept with visual samples as a starting point.',
  },
};

/* ── Anchor: Presentation Designer × Startups ── */
export const presentation_designer_startups: OfferEngineeringPathContent = {
  pathTitle: 'Startup Pitch Deck Design — Fundraising Presentations That Investors Remember',
  audienceInsight:
    'Startups live and die by their pitch deck. A founder typically has 3-5 minutes with an investor before they decide whether to take a meeting or pass. In that window, the deck must communicate the problem, solution, market size, traction, team, and ask — clearly, compellingly, and memorably. Most founders are not designers, and their decks suffer from cluttered slides, inconsistent branding, and narratives that do not flow. They need a presentation designer who understands storytelling structure, investor psychology, and the specific conventions of fundraising decks — not someone who just makes slides look pretty.',
  offerStrategy:
    'Position as a fundraising narrative partner, not a slide designer. The deliverable is not a set of slides — it is a persuasive narrative arc paired with a visual system that makes the story unforgettable. Every slide serves one purpose: moving the investor closer to a yes. The design process starts with story structure (problem, solution, market, traction, team, vision, ask) before any visual element is created. The deck should be so clear and compelling that the investor remembers the story, not the slides.',
  recommendedOfferType: 'one_time_project',

  deliverables: [
    {
      label: 'Pitch Deck Narrative Workshop',
      description:
        'A 2-hour structured workshop where the founding team maps their story against the investor decision journey: hook slide (why now?), problem (what is broken?), solution (how do you fix it?), market (how big?), traction (what proves it?), team (why you?), vision (where is this going?), ask (what do you need?). Output is a slide-by-slide narrative blueprint.',
      whyItMatters:
        'Most pitch decks fail before the first slide is designed because the story structure is weak. A narrative workshop ensures the deck tells a compelling story before any pixel is moved, saving weeks of redesign iterations.',
    },
    {
      label: 'Visual Identity for the Deck',
      description:
        'A presentation-specific visual identity: colour palette optimised for projector screens (high contrast, dark-mode friendly), typography system (headings, body, data labels, footnotes), iconography set, data visualisation style (charts, graphs, metrics), and photo/graphic treatment — all applied consistently across every slide.',
      whyItMatters:
        'Investors see dozens of decks. A professional, consistent visual identity signals that the startup treats its presentation seriously — a subtle but powerful credibility signal that separates funded startups from forgettable pitches.',
    },
    {
      label: 'Full Deck Design (12-18 Slides)',
      description:
        'Complete slide deck design: title slide, problem slides (2-3), solution slide, market size slide (with data visualisation), product demo or screenshot slides (2-3), traction slide (metrics timeline, growth chart), competition slide (positioning matrix), business model slide, team slide, financial projections slide, vision slide, and ask/closing slide. Includes slide master, transitions, and consistent layout system.',
      whyItMatters:
        'A professionally designed pitch deck increases meeting request rate by 40-60% compared to a founder-built deck, because investors perceive the startup as more credible, prepared, and investable based on the deck\'s quality alone.',
    },
    {
      label: 'Investor Leave-Behind Version',
      description:
        'A text-heavy, narrative-rich version of the deck optimised for investors to read asynchronously after the meeting — includes speaker notes expanded into readable copy, more detailed data, and appendix slides with additional traction data, customer testimonials, and competitive analysis.',
      whyItMatters:
        'After the pitch, investors share the deck with partners who did not attend the meeting. A leave-behind version that tells the full story in text ensures the deck works as a standalone document, not just a visual aid that needs a presenter to make sense.',
    },
    {
      label: 'Pitch Script & Speaker Notes',
      description:
        'A timed pitch script with speaker notes for every slide — including the ideal pacing (seconds per slide), key talking points, data to emphasise, transition phrases, and answers to anticipated investor questions for each slide.',
      whyItMatters:
        'The deck is only as good as the pitch delivered with it. A well-structured script ensures the founder\'s verbal delivery matches the visual narrative, eliminating the "um, so, this slide shows..." moments that kill investor confidence.',
    },
  ],

  uniqueMechanisms: [
    {
      name: 'Investor Decision Journey Mapping',
      description:
        'Before a single slide is designed, the deck structure is mapped to the investor\'s psychological decision process: attention (first 3 slides must hook), belief (next slides must prove the problem exists), conviction (traction and team must demonstrate execution), vision (closing slides must inspire), and action (ask must be clear and timely). Each slide is assigned a specific decision-journey purpose.',
      bestFor:
        'First-time founders who have a great story but whose current deck presents information in the wrong order — burying traction behind problem slides, or leading with team before establishing market opportunity.',
    },
    {
      name: 'Visual Narrative Pacing System',
      description:
        'A slide-level pacing framework that alternates between information-dense slides (data, charts, market size) and emotional slides (customer story, team photo, vision statement) — creating a rhythm that keeps investors engaged without overwhelming them with data or boring them with fluff.',
      bestFor:
        'Founders whose decks are either 100% data (overwhelming) or 100% story (lacking substance) — the pacing framework creates the right balance for a 5-minute pitch that informs and inspires.',
    },
    {
      name: 'Competitive Positioning Matrix',
      description:
        'A structured framework for the competition slide that goes beyond a simple "us vs. them" comparison table — instead, it maps competitors on a 2-axis matrix (typically something vs. something relevant to the market) that visually demonstrates the startup\'s unique position in a way investors can grasp in 10 seconds.',
      bestFor:
        'Startups in competitive markets where the standard feature comparison table is too complex or makes the startup look similar to established players. A positioning matrix communicates differentiation visually and instantly.',
    },
  ],

  scopeDefaults: {
    deliveryTime: '2-3 weeks for full deck design',
    revisions: '2 rounds on narrative structure, 2 rounds on visual design',
    feedbackRounds: 'Narrative workshop + 2 design review calls',
    communication: 'Async via email or Slack + weekly check-in calls',
    responseTime: 'Within 24 hours',
    scopeWarning:
      'Founders frequently change their pitch, metrics, and ask as they refine their fundraising strategy or receive investor feedback during the process. Lock the narrative structure, key metrics, and ask amount before visual design begins. Changes to core metrics, market size numbers, or ask amount after the visual design phase will require a new data visualisation round and additional fee. Clarify that the deck is designed for the founder\'s current fundraise stage — a seed deck and a Series A deck have different conventions and content requirements.',
  },

  valueAmplifiers: [
    {
      label: 'Investor Feedback Integration Session',
      description:
        'A 60-minute session after the founder has pitched to 5-10 investors, reviewing the feedback received and making targeted deck revisions based on real investor reactions — which slides confused them, which questions they asked repeatedly, which data they challenged.',
      whyItWorks:
        'No pitch deck survives first contact with investors unchanged. A feedback integration session turns early investor reactions into a better deck, improving close rate on subsequent pitches without starting from scratch.',
    },
    {
      label: 'Data Room & Appendix Deck',
      description:
        'A comprehensive appendix deck (20-30 slides) with detailed backup data: full market analysis, competitive deep-dives, customer acquisition cost breakdowns, unit economics, technology architecture, intellectual property details, and team background — organised and designed for investors who want to "go deeper" after the initial pitch.',
      whyItWorks:
        'Investors who request additional data after a pitch are signalling interest. A well-organised appendix deck delivered immediately demonstrates preparedness and control, accelerating the due diligence process.',
    },
    {
      label: 'Investor Update Deck Template',
      description:
        'A branded investor update deck template with a consistent monthly/quarterly format: key metrics dashboard, progress highlights, challenges, asks, and upcoming milestones — designed to make the founder look organised and communicative to existing investors.',
      whyItWorks:
        'Founders who send professional, consistent investor updates maintain stronger investor relationships and get faster introductions to other investors. An update template makes sending updates effortless, which means they actually get sent.',
    },
  ],

  pricingGuidance: {
    suggestedModel: 'flat_rate',
    beginnerRange: '$2,000-$4,000',
    intermediateRange: '$5,000-$10,000',
    premiumRange: '$12,000-$20,000',
    pricingLogic:
      'Pitch deck pricing should be a flat project fee based on the scope of the narrative workshop and number of slides. A 12-slide seed deck with basic visual identity and speaker notes is at the low end; a 20-slide Series A deck with full narrative workshop, custom data visualisations, competitive matrix, leave-behind version, and appendix is at the high end. The premium tier includes the investor feedback integration session and data room appendix. Price as a fraction of the fundraising target — a 1% improvement in close rate on a $1M round justifies a $10K deck investment.',
  },

  proposalAngle: {
    headline: 'Startup Pitch Deck Design — A Fundraising Narrative That Investors Can Not Forget',
    problem:
      'Your current pitch deck is not doing your story justice. The slides are cluttered, the narrative flow is not compelling, and you know investors are zoning out by slide 5. You have a great business, but your deck is not communicating it clearly enough to get the meetings you need.',
    solution:
      'I start with a narrative workshop to structure your story around the investor decision journey, then design a 12-18 slide deck that makes your opportunity undeniable. Every slide, chart, and transition is engineered to keep investors engaged and move them toward a yes.',
    nextStep:
      'Send me your current deck and your fundraising target. I will produce a 15-point narrative and design audit with specific recommendations for making your deck more compelling — no commitment required.',
  },

  blueprintAngle: {
    whoItIsFor:
      'Startup founders who are preparing to raise their first institutional round (seed or Series A) and need a pitch deck that clearly communicates their story, traction, and vision to investors in a competitive fundraising environment.',
    problemItSolves:
      'Most founder-built pitch decks suffer from weak narrative structure, inconsistent visual design, unclear data presentation, and a missing sense of pacing — making it harder for investors to quickly understand and believe in the opportunity. A poorly designed deck costs fundraising momentum that is hard to regain.',
    corePromise:
      'A professionally designed pitch deck with a narrative workshop foundation, investor-optimised visual identity, complete 12-18 slide design, pitch script, and investor leave-behind version — so your fundraising presentation communicates your story clearly, compellingly, and memorably.',
    whyThisWorks:
      'Startups with professionally designed pitch decks raise their rounds 40% faster on average than those using founder-built decks, because investors make snap judgments about team quality and business viability based on the deck\'s professionalism. A great deck does not guarantee funding, but a bad deck guarantees rejection.',
    nextStepCTA:
      'Share this blueprint with founders preparing for their next fundraise. Offer a free 15-point pitch deck audit as a starting point.',
  },
};
