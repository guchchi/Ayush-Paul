import type { PathContentMechanism } from './path-content-types';

/* ── Short-Form Editor ── */
export const SHORT_FORM_EDITOR_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'First-1.5-Second Hook Audit',
    description:
      'Every clip\'s opening 1.5 seconds is reviewed against a 7-point hook checklist: visual motion, text overlay, facial expression, audio sync, pattern interrupt, curiosity gap, and platform best practice. Clips that fail 3+ points get restructured before delivery.',
    bestFor:
      'Clients whose content is solid but whose openers consistently underperform — the video is good, but viewers do not stay long enough to discover that.',
  },
  {
    name: 'Trend Mapping Protocol',
    description:
      'A weekly research process that identifies rising audio, format shifts, and editing trends across Instagram, TikTok, and YouTube Shorts — then maps each trend to the client\'s niche with a feasibility score and production timeline.',
    bestFor:
      'Clients in fast-moving niches where early trend adoption drives disproportionate reach but chasing every trend without a filter wastes production time.',
  },
  {
    name: 'Format Rotation System',
    description:
      'A 4-week content calendar that rotates between 6 short-form formats (talking head, stitch, B-roll heavy, text overlay, challenge/trend, educational) so the feed stays varied and the algorithm sees the client as a versatile publisher, not a one-format pony.',
    bestFor:
      'Clients whose engagement plateaus because every post looks the same. Format rotation reintroduces novelty and re-engages followers who started scrolling past repetitive content.',
  },
];

/* ── YouTube Editor ── */
export const YOUTUBE_EDITOR_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'Retention Curve Engineering Process',
    description:
      'A structured editing workflow that starts with mapping the target retention curve before making a single cut. Every editing decision ties back to whether it improves or hurts watch time at that point in the video.',
    bestFor:
      'Clients who care about analytics and understand that retention is their primary growth lever.',
  },
  {
    name: '90-Second Pacing Protocol',
    description:
      'A rule-based editing system that inserts a pattern interrupt — visual change, topic shift, or pacing acceleration — every 90 seconds without fail, then tightens or loosens based on the content type.',
    bestFor:
      'Clients whose content naturally trends toward longer takes and needs forced pacing discipline to maintain engagement.',
  },
  {
    name: 'Retrospective Hook Optimisation',
    description:
      'A review process applied after the first rough cut: the first 60 seconds are re-edited 3 times with different pacing approaches, then the best version is selected based on a retention prediction score.',
    bestFor:
      'Clients whose first-draft hooks consistently underperform. This mechanism treats the hook as a testable asset rather than a one-shot decision.',
  },
];

/* ── WordPress Developer ── */
export const WP_DEV_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'Iteration-Ready Build Architecture',
    description:
      'A site built with modular page builders and centralised settings so the client can update copy, layouts, and CTAs without needing developer involvement for every change. Content blocks, global styling, and reusable components are standardised from the first build.',
    bestFor:
      'Clients whose messaging and offerings change regularly and who need a site that keeps pace without requiring developer hours for every text update.',
  },
  {
    name: 'Technical SEO Foundation',
    description:
      'WordPress SEO architecture built for discoverability: custom post types, automatic schema markup, XML sitemaps organised by content priority, canonical URL management, and page-speed optimisation targeting 90+ on mobile Lighthouse.',
    bestFor:
      'Clients investing in organic search as a growth channel who need their site to rank without requiring an SEO specialist to configure every technical setting.',
  },
  {
    name: 'Integration Pipeline',
    description:
      'Pre-built connector architecture for CRM, analytics, booking, email marketing, and payment tools — installed and configured with event tracking so the client\'s tech stack is operational from launch day.',
    bestFor:
      'Clients who need their website to actively feed their business systems (CRM, email, analytics) rather than functioning as a standalone brochure that requires manual data transfer.',
  },
];

/* ── Podcast Clip Editor ── */
export const PODCAST_CLIP_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'Clip-First Listening Process',
    description:
      'A structured listening workflow where the editor watches/listens to each episode with a specific clip-mining lens: mark timestamps for hot takes, guest stories, actionable advice, controversial opinions, emotional moments, and quotable one-liners — then ranks each candidate clip by standalone watchability before editing a single frame.',
    bestFor:
      'Clients with long-format episodes (60+ minutes) who need an editor who can efficiently identify the 5% of content worth clipping without requiring direction on every episode.',
  },
  {
    name: 'Platform-Native Re-Edit Rule',
    description:
      'Each clip is re-edited specifically for its target platform rather than cut once and reformatted: Reels clips favour faster pacing and text overlays, TikTok clips favour trending audio integration, YouTube Shorts clips favour searchable titles and slower pacing. The same moment gets different edits per platform.',
    bestFor:
      'Clients serious about cross-platform distribution who are currently posting the same clip everywhere and wondering why it performs well on one platform but not others.',
  },
  {
    name: 'Guest Amplification Loop',
    description:
      'A system for turning each guest into a distribution channel: the guest clip is delivered with a pre-written social post, the guest\'s handle tagged, and a link to the full episode. The editor tracks which guests share and adjusts future clip selection to prioritise moments from guests with high share-propensity.',
    bestFor:
      'Clients who interview guests regularly and want to turn each guest\'s audience into a repeat distribution source without manually following up with every guest.',
  },
];

/* ── Ad Creative Editor ── */
export const AD_CREATIVE_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'Hook Hypothesis Framework',
    description:
      'A structured process where every ad creative starts with 3-5 hook hypotheses based on customer research, competitor ad analysis, and past creative performance data. Each hook variant is edited to test a specific psychological trigger — scarcity, social proof, authority, reciprocity, or loss aversion — with the rest of the ad body held constant so the winning variable can be isolated.',
    bestFor:
      'Clients spending $5K+/month on paid social who need to systematically improve creative CPA rather than relying on gut-feel ad production.',
  },
  {
    name: 'Pixel-Aligned Pacing Protocol',
    description:
      'An editing framework that structures ad pacing around the ad platform\'s optimisation signals: the first 3 seconds hook the viewer (retention signal), seconds 3-10 demonstrate value (engagement signal), seconds 10-20 present social proof (trust signal), seconds 20-30 deliver CTA (conversion signal). Each section is paced to maximise the signal the platform\'s algorithm needs to optimise delivery.',
    bestFor:
      'Clients whose ads have strong creative but inconsistent CPA because the ads are not structured to feed the platform\'s optimisation algorithm the signals it needs.',
  },
  {
    name: 'Creative Testing Cadence',
    description:
      'A production workflow that delivers ad creative variants on a fixed 2-week testing cycle: 5 new hook variants every 2 weeks, with a performance review after the first week to inform the next batch\'s creative direction. The client always has fresh creative to test against fatiguing winners.',
    bestFor:
      'Clients experiencing creative fatigue — their winning ads are losing steam and they need a systematic, predictable creative testing pipeline rather than scrambling for new concepts when performance drops.',
  },
];

/* ── Landing Page Developer ── */
export const LANDING_PAGE_DEV_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'Conversion Architecture',
    description:
      'A page structure designed for the specific conversion goal — whether trial sign-up, call booking, course purchase, or lead capture. Each section has a defined role in moving the visitor toward the conversion action, with urgency elements, social proof placement, and objection handling timed to the decision journey.',
    bestFor:
      'Clients whose current pages present information in a generic order rather than a conversion-optimised sequence, resulting in high traffic but low action rates.',
  },
  {
    name: 'Objection-to-CTA Flow',
    description:
      'Testimonials, social proof, and trust signals are strategically placed at the exact points in the page where objections typically arise — price objections near the pricing section, trust objections near the CTA, commitment objections near the booking button — so every concern is answered before the visitor reaches the action point.',
    bestFor:
      'Clients with strong testimonials and proof assets who are placing them in a single carousel at the bottom rather than deploying them throughout the page to overcome objections at the moment they arise.',
  },
  {
    name: 'Performance & Analytics Foundation',
    description:
      'The page is built with Lighthouse scores above 90, Core Web Vitals passing, and analytics instrumentation firing conversion events from day one. A/B testing framework is wired up so the client can run experiments without developer involvement.',
    bestFor:
      'Clients whose current pages lack proper tracking or performance optimisation — they cannot measure conversion rates or run experiments to improve them.',
  },
];

/* ── No-Code Developer ── */
export const NO_CODE_DEV_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'Fixed-Scope Sprints',
    description:
      'Every project broken into 2-week sprints with fixed scope, fixed price, and fixed deliverables per sprint. The client knows exactly what they are getting and when, with no timeline uncertainty. Scope changes go into the next sprint rather than expanding the current one.',
    bestFor:
      'Clients who are wary of software development because of horror stories about timeline overruns and scope creep. Fixed-scope sprints eliminate the uncertainty that makes clients hesitant to invest in custom tools.',
  },
  {
    name: 'Non-Technical Translation Layer',
    description:
      'All technical communication translated into client-friendly language: no platform jargon, no developer excuses, no "it depends." Each sprint deliverable is described in terms the client can understand and act on — "you get a login portal with automated invoice generation" rather than "we implemented Airtable automations."',
    bestFor:
      'Clients whose team members are not technical and need to communicate confidently with stakeholders about what is being built without understanding the underlying architecture.',
  },
  {
    name: 'Platform-Agnostic Recommendation',
    description:
      'A structured evaluation of which no-code platform is best for each specific project — Bubble for complex web apps, Airtable for database-driven tools, Make for automation workflows, Softr for client portals — based on budget, timeline, and long-term maintenance needs, not the developer\'s platform preference.',
    bestFor:
      'Clients who are unsure which no-code platform to adopt and need an honest, project-specific recommendation rather than a developer pushing their favourite tool.',
  },
];

/* ── Automation Developer ── */
export const AUTOMATION_DEV_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'Operations Architecture',
    description:
      'A structured automation framework that maps every business process into a central operating system — client data flows from intake through delivery through billing through reporting with no manual handoffs. Each tool feeds the next through automated triggers rather than human copy-paste.',
    bestFor:
      'Clients with 5+ tools in their stack that do not talk to each other, forcing team members to manually move data between platforms multiple times per day.',
  },
  {
    name: 'Time-Saved ROI Tracking',
    description:
      'Every automation includes built-in tracking of how many hours it saves per week, reported in a monitoring dashboard. The client can see, in real time, the cumulative hours saved and the dollar value of those hours at their effective team rate.',
    bestFor:
      'Clients who need to justify automation investment to stakeholders and want hard data on ROI rather than "it feels faster" anecdotes.',
  },
  {
    name: 'Client-Facing Automation Integration',
    description:
      'Where possible, automations are built to create a better client experience, not just internal efficiency — automated status updates, self-service portals, scheduled check-in emails — that reduce support request volume and improve client satisfaction simultaneously.',
    bestFor:
      'Clients whose teams generate high support email volume and where better client-facing automation would free up team time and improve client relationships.',
  },
];

/* ── Landing Page Designer ── */
export const LANDING_PAGE_DESIGN_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'Conversion-First Information Architecture',
    description:
      'A page structure designed to establish value and trust before presenting the ask: hero communicates the transformation, next section demonstrates authority or proof, then the offer is presented — always preceded by enough trust-building that the action feels earned rather than pushy.',
    bestFor:
      'Clients whose current pages lead with their offer and wonder why visitors leave without converting — the trust foundation was never laid before the ask.',
  },
  {
    name: 'Decision Journey Mapping',
    description:
      'A pre-design process where the client\'s ideal customer journey is mapped across every possible entry point and the page UX is designed to match each entry point with the appropriate landing experience and CTA — rather than sending all traffic to a generic homepage.',
    bestFor:
      'Clients who drive traffic from multiple sources and send everyone to the same landing page, resulting in mismatched expectations and low conversion from specific channels.',
  },
  {
    name: 'Post-Conversion Experience Design',
    description:
      'The design scope extends beyond the conversion confirmation to include the post-conversion experience: what the user sees after signing up, booking, or purchasing — ensuring the trust built on the page carries through to the first interaction.',
    bestFor:
      'Clients whose conversion completion rate is high but whose downstream engagement or retention is low — the post-conversion experience fails to maintain the momentum created by the page design.',
  },
];

/* ── Brand Designer ── */
export const BRAND_DESIGN_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'Cross-Platform Recognition Architecture',
    description:
      'Every brand element is tested across all the client\'s platforms before finalisation — a colour that looks great in one format may be unreadable in another or wash out on different media. Any element that fails on one platform gets redesigned before delivery.',
    bestFor:
      'Clients active on 3+ platforms whose current visual identity works on one platform but falls apart on others, forcing them to redesign assets per platform.',
  },
  {
    name: 'Template-First Brand Delivery',
    description:
      'The brand system is delivered as operational templates, not a PDF brand guide. The client\'s first experience with their new brand is opening a pre-built template that already looks amazing — not reading a document that explains what colours to use. This eliminates the gap between "having a brand" and "using a brand."',
    bestFor:
      'Clients with no design background who would never open a brand guidelines PDF but would immediately start using a pre-built template that matches their content.',
  },
  {
    name: 'Brand Rollout Transition Kit',
    description:
      'A transition plan for rolling out the new brand without confusing the existing audience: phased rollout schedule (avatar first, then templates, then all content), announcement graphic templates, and a "what changed" FAQ — ensuring the rebrand feels like an evolution rather than an identity crisis.',
    bestFor:
      'Established clients with an existing audience who are rebranding and need to manage the transition carefully to avoid confusing or alienating their current followers.',
  },
];

/* ── Video Editor ── */
export const VIDEO_EDITOR_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'Narrative Arc Engineering',
    description:
      'A structured pre-edit process where raw footage is mapped against a 3-act narrative structure before a single cut is made. Each section is assigned a narrative purpose (setup, conflict, rising action, climax, resolution) and edited to serve that purpose rather than following chronological order.',
    bestFor:
      'Clients whose raw footage is chronological and needs restructuring into a compelling narrative rather than a chronological replay.',
  },
  {
    name: 'Emotional Beat Timing System',
    description:
      'A timing framework that places emotional beats at specific intervals: hook within 0-15 seconds, tension ramp at 25%, emotional peak at 75%, resolution at 90%. Each beat is cued with a combination of visual pacing, music shift, and sound design.',
    bestFor:
      'Clients whose current edits are technically clean but emotionally flat — the footage is good but lacks the pacing that creates audience engagement.',
  },
  {
    name: 'Retrospective Edit Improvement Loop',
    description:
      'After each video is published and performance data is available, the editor reviews the retention graph against the edit timeline, identifies exactly which sections lost viewers and why, and applies that learning to the next video\'s edit plan.',
    bestFor:
      'Clients who publish regularly and want their editing to systematically improve over time based on real audience behaviour data rather than guesswork.',
  },
];

/* ── Frontend Developer ── */
export const FRONTEND_DEV_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'Performance Budget Pipeline',
    description:
      'A CI/CD-integrated performance budget that fails builds if new changes push LCP, TBT, or CLS beyond defined thresholds — enforced from the first commit so the site never regresses on speed as new features are added.',
    bestFor:
      'Clients who care about performance but need automated enforcement rather than manual discipline to keep the frontend fast as the team grows.',
  },
  {
    name: 'Component-First Delivery Model',
    description:
      'Pages are built from a shared component library, not from scratch. A new landing page is assembled from existing blocks in hours, not days. The client\'s team can request new page layouts and get them within a single sprint cycle.',
    bestFor:
      'Clients whose messaging and pages change regularly and who need a frontend that keeps pace without accumulating technical debt.',
  },
  {
    name: 'Self-Serve Content Editing Layer',
    description:
      'A headless CMS or structured content layer that lets non-technical team members update copy, add testimonials, change pricing, and publish content without touching the frontend codebase — while the developer maintains control over layout, design, and performance.',
    bestFor:
      'Clients where the marketing lead or content team needs to iterate on copy daily without waiting for developer availability for every text change.',
  },
];

/* ── UI/UX Designer ── */
export const UIUX_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'User-First Information Architecture',
    description:
      'A page or product structure designed to establish confidence before presenting key actions: entry point communicates value, next section demonstrates credibility, next shows proof, then the primary action is presented — always preceded by enough context-building that the action feels earned rather than premature.',
    bestFor:
      'Clients whose current interfaces lead with their ask and wonder why users bounce — the trust or value foundation was never laid before the action was requested.',
  },
  {
    name: 'User Journey Mapping',
    description:
      'A pre-design workshop where the client\'s ideal user journey is mapped across every possible entry point and the interface UX is designed to match each entry point with the appropriate experience and CTA — rather than sending all traffic to a generic welcome screen.',
    bestFor:
      'Clients who drive traffic from multiple sources and send everyone to the same interface, resulting in mismatched expectations and low conversion from specific channels.',
  },
  {
    name: 'Post-Conversion Experience Design',
    description:
      'The UX scope extends beyond the conversion point to include the post-conversion experience: what the user sees after signing up, completing a flow, or making a purchase — ensuring the trust and momentum built during the conversion carries through to the next interaction.',
    bestFor:
      'Clients whose conversion completion rate is high but whose activation or retention rates are low — the post-conversion experience fails to maintain the momentum created by the interface design.',
  },
];

/* ── Social Media Designer ── */
export const SOCIAL_DESIGN_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'Platform-First Design Architecture',
    description:
      'Every brand element is tested across all the client\'s platforms before finalisation — a colour that looks great in one feed may be unreadable in another format or wash out on different media. Any element that fails on one platform gets redesigned before delivery.',
    bestFor:
      'Clients active on 3+ platforms whose current visual identity works on one platform but falls apart on others, forcing them to redesign assets per platform.',
  },
  {
    name: 'Template-First Delivery Model',
    description:
      'The brand or content system is delivered as operational templates, not a static guide. The client\'s first experience with their new system is opening a pre-built template that already looks amazing — not reading a document that explains what to do. This eliminates the gap between "having a system" and "using a system."',
    bestFor:
      'Clients with no design background who would never open a style guide PDF but would immediately start using a pre-built template that matches their content.',
  },
  {
    name: 'Content Format Scaling System',
    description:
      'A modular template architecture where one brand element (colour, pattern, logo variation) can be applied across multiple content formats without redesign — giving variety within consistency across posts, stories, and platform-specific formats.',
    bestFor:
      'Clients whose feed looks repetitive because they use the exact same template for every post, sacrificing visual interest for brand consistency.',
  },
];

/* ── Presentation Designer ── */
export const PRESENTATION_DESIGN_MECHANISMS: PathContentMechanism[] = [
  {
    name: 'Audience Decision Journey Mapping',
    description:
      'Before a single slide is designed, the deck structure is mapped to the audience\'s psychological decision process: attention (first slides must hook), belief (next slides must prove the case), conviction (evidence must demonstrate results), vision (closing slides must inspire), and action (ask must be clear and timely). Each slide is assigned a specific decision-journey purpose.',
    bestFor:
      'Clients who have a strong story but whose current deck presents information in the wrong order — burying key evidence behind introductions, or leading with credentials before establishing the problem.',
  },
  {
    name: 'Visual Narrative Pacing System',
    description:
      'A slide-level pacing framework that alternates between information-dense slides (data, charts, evidence) and emotional slides (stories, imagery, vision) — creating a rhythm that keeps the audience engaged without overwhelming them with data or boring them with fluff.',
    bestFor:
      'Clients whose decks are either 100% data (overwhelming) or 100% story (lacking substance) — the pacing framework creates the right balance for a presentation that informs and inspires.',
  },
  {
    name: 'Competitive Positioning Visualisation',
    description:
      'A structured framework for presenting competitive differentiation that goes beyond a simple comparison table — it maps options on a relevant axis to visually demonstrate the client\'s unique position in a way the audience can grasp in seconds.',
    bestFor:
      'Clients in competitive markets where the standard feature comparison table is too complex or makes them look similar to established alternatives. A positioning visual communicates differentiation instantly.',
  },
];
