/**
 * Module 5 — Modifier System
 *
 * Each modifier inspects the Module5StrategyContext and applies
 * deterministic adjustments to the pipeline strategy accumulator.
 *
 * Modifiers are applied in order: market → niche → offer → authority → portfolio.
 * Each receives the previous modifier's output as input.
 */

import type {
  ProspectProfile,
  TargetChannel,
  BuyingSignal,
  QualificationFactor,
  PriorityRule,
} from '../../types/client-pipeline-system';
import type { Module5StrategyContext } from './context';

/* ──────────────────────────────────────────────
   Accumulator — mutable working state
   ────────────────────────────────────────────── */

export interface PipelineStrategyAccumulator {
  idealProspectProfile: ProspectProfile;
  targetChannels: TargetChannel[];
  buyingSignals: BuyingSignal[];
  disqualifiers: string[];
  qualificationFactors: QualificationFactor[];
  priorityRules: PriorityRule[];
  dailyProspectingTarget: number;
  weeklyQualifiedProspectTarget: number;
}

/* ──────────────────────────────────────────────
   Modifier type
   ────────────────────────────────────────────── */

type Modifier = (ctx: Module5StrategyContext, acc: PipelineStrategyAccumulator) => PipelineStrategyAccumulator;

/* ──────────────────────────────────────────────
   1. MARKET MODIFIER
   ──────────────────────────────────────────────
   Market context shifts discovery behavior, channel priority,
   buyer characteristics, and qualification emphasis.
   ────────────────────────────────────────────── */

const marketModifier: Modifier = (ctx, acc) => {
  const market = (ctx.market || '').toLowerCase();
  if (!market) return acc;

  // Clone to avoid mutation
  const result = structuredClone(acc);

  // Local market — emphasize geographic discovery, local signals
  if (market.includes('local') || market.includes('city') || market.includes('regional')) {
    // Boost local search channels to top
    result.targetChannels = result.targetChannels.map((ch) => {
      if (ch.platform === 'Google Maps' || ch.platform === 'Google Search' || ch.platform === 'Local Search') {
        return { ...ch, priority: 'high' as const };
      }
      return ch;
    });

    // Add local-specific buying signals
    result.buyingSignals.unshift({
      signal: 'Business appears in local search but has outdated or inconsistent web presence',
      whyItMatters: 'Local businesses with weak online presence are the most addressable prospects',
      howToDetect: 'Search for [service] in [city] and evaluate website quality of top results',
    });

    // Add local disqualifier
    if (!result.disqualifiers.includes('Business is outside target geographic area')) {
      result.disqualifiers.push('Business is outside target geographic area');
    }

    // Reduce daily target — local markets have fewer prospects
    result.dailyProspectingTarget = Math.max(3, result.dailyProspectingTarget - 2);
    result.weeklyQualifiedProspectTarget = Math.max(2, result.weeklyQualifiedProspectTarget - 1);

    // Adjust prospect characteristics
    result.idealProspectProfile.characteristics.push(
      'Operates within a defined geographic service area',
      'Relies on local search or word-of-mouth for customer acquisition',
    );
  }

  // Global/remote market — emphasize platform discovery, remove geographic constraints
  if (market.includes('global') || market.includes('remote') || market.includes('online') || market.includes('worldwide')) {
    result.targetChannels = result.targetChannels.map((ch) => {
      if (ch.platform === 'LinkedIn') return { ...ch, priority: 'high' as const };
      if (ch.platform === 'Product Hunt') return { ...ch, priority: 'high' as const };
      return ch;
    });

    result.buyingSignals.unshift({
      signal: 'Active on multiple platforms with consistent content across geographies',
      whyItMatters: 'Global creators/businesses have scaling needs that match remote service delivery',
      howToDetect: 'Check profile for multi-region audience or global client mentions',
    });

    result.idealProspectProfile.characteristics.push(
      'Serves a geographically distributed audience or customer base',
      'Comfortable with remote collaboration and async communication',
    );

    // Increase targets — global pool is larger
    result.dailyProspectingTarget += 3;
    result.weeklyQualifiedProspectTarget += 2;
  }

  // B2B market
  if (market.includes('b2b') || market.includes('business')) {
    result.qualificationFactors = result.qualificationFactors.map((f) => {
      if (f.id === 'budget_capacity' || f.name.includes('Budget') || f.name.includes('Pay')) {
        return { ...f, weight: Math.min(5, f.weight + 1) };
      }
      return f;
    });

    result.idealProspectProfile.characteristics.push(
      'Has authority to make purchasing decisions or influence budget',
      'Understands ROI-based investment in service improvements',
    );

    result.buyingSignals.push({
      signal: 'Company has dedicated marketing or growth team',
      whyItMatters: 'Organizations with marketing teams have budget and understanding of web investment',
      howToDetect: 'Check LinkedIn company page for marketing roles',
    });
  }

  // B2C / creator market
  if (market.includes('b2c') || market.includes('creator') || market.includes('consumer')) {
    result.qualificationFactors = result.qualificationFactors.map((f) => {
      if (f.id === 'audience_engagement' || f.name.includes('Engagement') || f.name.includes('Audience')) {
        return { ...f, weight: Math.min(5, f.weight + 1) };
      }
      return f;
    });

    result.idealProspectProfile.characteristics.push(
      'Has a direct audience or following that engages with their content',
      'Personal brand or creator identity is central to their business model',
    );
  }

  return result;
};

/* ──────────────────────────────────────────────
   2. NICHE MODIFIER
   ──────────────────────────────────────────────
   Matches niche against known niche patterns to
   adjust prospect characteristics, discovery surfaces,
   search vocabulary, and niche-specific disqualifiers.
   ────────────────────────────────────────────── */

function normalizeNicheKey(niche: string | null): string {
  if (!niche) return '';
  const lower = niche.toLowerCase().trim();
  if (lower.includes('gaming') || lower.includes('streamer') || lower.includes('twitch')) return 'gaming';
  if (lower.includes('educational') || lower.includes('tutorial') || lower.includes('learning') || lower.includes('course')) return 'educational';
  if (lower.includes('podcast') || lower.includes('podcaster')) return 'podcast';
  if (lower.includes('fitness') || lower.includes('workout') || lower.includes('transformation')) return 'fitness';
  if (lower.includes('ai startup') || lower.includes('ai startups')) return 'ai_startups';
  if (lower.includes('local business') || lower.includes('local') || lower.includes('small business') || lower.includes('service business')) return 'local_business';
  if (lower.includes('marketing agency') || lower.includes('marketing agencies')) return 'marketing_agencies';
  if (lower.includes('design agency') || lower.includes('design agencies') || lower.includes('ux agency')) return 'design_agencies';
  if (lower.includes('saas') || lower.includes('b2b saas')) return 'saas';
  if (lower.includes('product startup') || lower.includes('product startups') || lower.includes('startup')) return 'product_startups';
  if (lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('shopify') || lower.includes('dtc')) return 'ecommerce';
  if (lower.includes('personal brand') || lower.includes('creator') || lower.includes('influencer')) return 'creator';
  if (lower.includes('coach') || lower.includes('coaches') || lower.includes('consultant')) return 'coaches';
  if (lower.includes('restaurant') || lower.includes('food')) return 'restaurant';
  return 'default';
}

type NicheConfig = {
  characteristics: string[];
  evidenceOfFit: string[];
  buyingSignals: { signal: string; whyItMatters: string; howToDetect: string }[];
  disqualifiers: string[];
  discoverySurfaces: string[];
};

const NICHE_CONFIGS: Record<string, NicheConfig> = {
  gaming: {
    characteristics: [
      'Produces gaming content with natural highlight moments (wins, fails, reactions)',
      'Has engaged community that interacts during streams or in comments',
      'Content has entertainment value that translates well to short-form formats',
      'Treats gaming as a content business, not just a hobby',
    ],
    evidenceOfFit: [
      'Channel has regular gaming content with consistent upload schedule',
      'Stream VODs or long-form videos show clear highlight moments',
      'Business email or partnership contact visible in profile',
      'Active on multiple gaming platforms (YouTube, Twitch, TikTok)',
    ],
    buyingSignals: [
      { signal: 'Creator posts long-form gaming videos but has no Shorts or TikTok presence', whyItMatters: 'Clear gap between gaming content produced and short-form distribution', howToDetect: 'Search their channel for Shorts or check TikTok for gaming clips' },
      { signal: 'Streamer mentions wanting to grow discoverability or reach new viewers', whyItMatters: 'Shows awareness that short-form drives gaming audience growth', howToDetect: 'Review recent community posts, tweets, or stream announcements' },
      { signal: 'Gaming content has natural shareable moments but none are clipped', whyItMatters: 'Missed viral potential that professional editing can unlock', howToDetect: 'Watch recent videos for highlight moments that are not repurposed' },
    ],
    disqualifiers: [
      'Channel is purely gameplay clips with no branding or growth intent',
      'No consistent content schedule or recent uploads',
      'Gaming content is not suitable for short-form repurposing (e.g., walkthroughs only)',
    ],
    discoverySurfaces: ['YouTube gaming category', 'Twitch directory by game', 'Discord gaming communities', 'TikTok gaming hashtags', 'Steam community hubs'],
  },

  educational: {
    characteristics: [
      'Produces teaching or tutorial content with clear instructional segments',
      'Content has natural standalone moments that work as educational clips',
      'Has a course, product, or paid offering to promote through content',
      'Understands that short-form content drives course enrollment or audience growth',
    ],
    evidenceOfFit: [
      'Regular tutorial or lesson content with structured teaching format',
      'Has a paid course, coaching program, or product to sell',
      'No clip repurposing strategy visible on social platforms',
      'Audience engagement suggests demand for their educational content',
    ],
    buyingSignals: [
      { signal: 'Educator posts full-length tutorials but does not repurpose key moments', whyItMatters: 'Each tutorial contains multiple standalone teaching moments that make effective clips', howToDetect: 'Watch recent tutorials and note sections that work independently' },
      { signal: 'Course enrollment or program applications are below target', whyItMatters: 'Short-form clips directly drive course discovery and enrollment', howToDetect: 'Check if they have a course landing page with enrollment data' },
    ],
    disqualifiers: [
      'Content is purely entertainment with no educational value extractable',
      'No audience or distribution channel for promoted clips',
      'Has no product, course, or monetization path from educational content',
    ],
    discoverySurfaces: ['YouTube education category', 'LinkedIn educator profiles', 'Teachable/Udemy instructor directories', 'Skillshare instructor profiles', 'Substack education newsletters'],
  },

  podcast: {
    characteristics: [
      'Produces podcast episodes with quotable guest moments and discussion segments',
      'Interviews or conversations produce natural standalone clip content',
      'Has guest booking process indicating a professional show operation',
      'Podcast format creates predictable weekly content for clip extraction',
    ],
    evidenceOfFit: [
      'Regular episode publishing schedule (weekly or more)',
      'Episodes feature guests or discussions with quotable insights',
      'No short-form clip presence from podcast episodes',
      'Podcast has a consistent format and production quality level',
    ],
    buyingSignals: [
      { signal: 'Podcaster releases full episodes but no short promotional clips', whyItMatters: 'Clips are the primary discovery mechanism for new podcast listeners', howToDetect: 'Search social channels for podcast clips from recent episodes' },
      { signal: 'Guest appearances are not cross-promoted with clips', whyItMatters: 'Guests will share clips, creating organic reach for the podcast', howToDetect: 'Check if guest appearances result in any shared clip content' },
    ],
    disqualifiers: [
      'Podcast has no video format (audio-only with no visual content to clip)',
      'Irregular episode publishing schedule',
      'Episodes lack quotable or discussion-based content',
    ],
    discoverySurfaces: ['YouTube podcast category', 'Spotify/Apple podcast directories', 'LinkedIn podcast hosts', 'Podchaser by category', 'Guest booking platforms'],
  },

  ai_startups: {
    characteristics: [
      'Recently launched or early-stage AI product with funding or revenue',
      'Current website or landing page does not match product quality',
      'Product messaging is unclear or too technical for target audience',
      'Startup is actively iterating and open to professional web presence improvements',
    ],
    evidenceOfFit: [
      'Launched on Product Hunt or similar platform in last 6 months',
      'Website has weak messaging, unclear CTA, or template-based design',
      'Founder or team is active on LinkedIn posting about the product',
      'Has accelerator backing, funding, or clear revenue model',
    ],
    buyingSignals: [
      { signal: 'AI tool launched but landing page has unclear value proposition', whyItMatters: 'Unclear messaging directly impacts conversion and adoption', howToDetect: 'Review their homepage for clarity of product explanation and CTA' },
      { signal: 'Website looks template-based and does not match product innovation level', whyItMatters: 'Brand inconsistency undermines product credibility', howToDetect: 'Compare website quality against product demo or screenshots' },
    ],
    disqualifiers: [
      'Product is still in stealth or pre-launch with no public website',
      'No clear decision maker or contact available',
      'Startup has no revenue and no funding',
    ],
    discoverySurfaces: ['Product Hunt AI category', 'YC / accelerator directories', 'AI tool directories', 'LinkedIn AI startup founders', 'CrunchBase AI companies'],
  },

  local_business: {
    characteristics: [
      'Operates a physical or local service business with a defined service area',
      'Current website is outdated, slow, or not mobile-friendly',
      'Relies on Google Maps, local search, or word-of-mouth for customers',
      'Active in marketing but website does not match offline brand quality',
    ],
    evidenceOfFit: [
      'Google Maps listing exists but website is poor or missing',
      'Website loads slowly on mobile or has broken elements',
      'Social media is active but website is neglected or outdated',
      'Competitors in the same area have noticeably better websites',
    ],
    buyingSignals: [
      { signal: 'Local business appears in Maps search but website link is broken or leads to poor experience', whyItMatters: 'Maps-driven businesses lose leads directly from poor website experience', howToDetect: 'Search for target service in target city and evaluate each listing website' },
      { signal: 'Business posts actively on social media but website link shows outdated design', whyItMatters: 'Active marketing investment undermined by weak website', howToDetect: 'Compare Instagram activity against website quality' },
    ],
    disqualifiers: [
      'Business has no online presence or does not serve customers online',
      'Recently completed a website redesign with a different provider',
      'Decision maker is not reachable through available channels',
    ],
    discoverySurfaces: ['Google Maps local search', 'Google Search local results', 'Instagram local business hashtags', 'Chamber of Commerce directories', 'Local business association listings'],
  },

  marketing_agencies: {
    characteristics: [
      'Marketing agency that sells services requiring technical WordPress implementation',
      'No in-house developer or technical team for client delivery',
      'Runs client campaigns, landing pages, or tracking setups on WordPress',
      'Growing client base creates scalable need for technical support',
    ],
    evidenceOfFit: [
      'Agency services include campaign landing pages or client site management',
      'Own website uses WordPress and shows room for quality improvement',
      'Team page shows no developer or technical implementation roles',
      'Recent client growth or hiring suggests scaling challenges',
    ],
    buyingSignals: [
      { signal: 'Agency offers marketing services but cannot handle technical implementation in-house', whyItMatters: 'Technical gap creates recurring need for white-label support', howToDetect: 'Review their services page for technical implementation details' },
      { signal: 'Agency portfolio shows inconsistent client site quality', whyItMatters: 'Inconsistent delivery quality indicates need for standardized technical support', howToDetect: 'Browse client case studies and evaluate site quality variation' },
    ],
    disqualifiers: [
      'Agency has in-house development team covering the needed technical skills',
      'Agency does not work with WordPress or does not offer web services',
      'Decision maker is not contactable or outsources all technical decisions',
    ],
    discoverySurfaces: ['Clutch / agency directories by city', 'LinkedIn agency founders and owners', 'Agency portfolio websites', 'Marketing conference attendee lists', 'Agency partnership networks'],
  },

  saas: {
    characteristics: [
      'B2B SaaS product with an active userbase and measurable UX friction',
      'Product interface has confusing navigation, poor information hierarchy, or inconsistent design',
      'Onboarding flow has visible drop-off points or user confusion',
      'Product team is actively investing in improvements and has budget',
    ],
    evidenceOfFit: [
      'User reviews or social mentions highlight UI confusion or usability issues',
      'Product demo or trial reveals clear UX friction points',
      'Recently raised funding or hit growth milestones',
      'Competitor products have more polished, modern interfaces',
    ],
    buyingSignals: [
      { signal: 'User reviews consistently mention confusing interface or hard onboarding', whyItMatters: 'Documented UX complaints create measurable opportunity for improvement', howToDetect: 'Search G2, Capterra, or social media for UX-related product feedback' },
      { signal: 'Product dashboard screenshots show cluttered or poorly organized interface', whyItMatters: 'Visual evidence of UX problems that design can solve', howToDetect: 'Review product website screenshots or demo videos for layout clarity' },
    ],
    disqualifiers: [
      'Product is pre-MVP with no active users or feedback',
      'No clear product or design lead reachable',
      'Product has no revenue and no funding for improvements',
    ],
    discoverySurfaces: ['Product Hunt SaaS launches', 'G2 / Capterra product categories', 'LinkedIn product managers and heads of product', 'CrunchBase recently funded SaaS', 'TechCrunch SaaS coverage'],
  },

  product_startups: {
    characteristics: [
      'Pre-launch or recently launched product startup with clear UX needs',
      'Product interface or landing page lacks professional polish',
      'Founder-built MVP that needs design iteration before scaling',
      'Has accelerator backing, funding, or clear path to revenue',
    ],
    evidenceOfFit: [
      'Product is listed on Product Hunt upcoming or recently launched',
      'Landing page or product screenshots show design quality gaps',
      'Founder is active in startup communities posting about the product',
      'Has mentor, advisor, or investor feedback highlighting design needs',
    ],
    buyingSignals: [
      { signal: 'Startup preparing for Product Hunt launch but landing page lacks polish', whyItMatters: 'Pre-launch is the ideal time for design investment', howToDetect: 'Review upcoming Product Hunt listings for design quality' },
      { signal: 'Founder posts about product development challenges including UI/UX', whyItMatters: 'Explicit need signal from the decision maker', howToDetect: 'Monitor founder LinkedIn or Twitter for UX-related posts' },
    ],
    disqualifiers: [
      'Product has no users and no clear path to market',
      'Founder is not actively building or iterating on the product',
      'No budget or funding available for design improvements',
    ],
    discoverySurfaces: ['Product Hunt upcoming products', 'BetaList / BetaPage listings', 'YC / accelerator directories', 'Indie Hackers product showcases', 'Show HN submissions'],
  },

  design_agencies: {
    characteristics: [
      'Design agency producing client work without a consistent design system',
      'Portfolio shows visual quality variance across different projects',
      'Team is growing and needs scalable design infrastructure',
      'Understands the value of design systems but lacks time to build one',
    ],
    evidenceOfFit: [
      'Agency portfolio shows inconsistent visual quality or varying design approaches',
      'No mention of design system, component library, or design tokens',
      'Team is hiring or expanding, suggesting scaling without design infrastructure',
      'Offers services that would benefit from systematic design approach',
    ],
    buyingSignals: [
      { signal: 'Agency portfolio projects use different visual languages or inconsistent components', whyItMatters: 'Inconsistent quality indicates lack of design system', howToDetect: 'Browse agency portfolio and compare design consistency across projects' },
      { signal: 'Agency mentions design process but has no visible system behind it', whyItMatters: 'Claims process expertise but lacks evidence of systematic approach', howToDetect: 'Review their process pages for mention of reusable components or design tokens' },
    ],
    disqualifiers: [
      'Agency already has a mature design system in place',
      'Agency does not produce visual design work (strategy-only)',
      'Team size does not justify design system investment (1-2 person shop)',
    ],
    discoverySurfaces: ['Dribbble agency accounts', 'Behance agency portfolios', 'LinkedIn design directors and creative leads', 'Design Systems Slack community', 'Figma Community agency pages'],
  },

  creator: {
    characteristics: [
      'Individual creator building a personal brand across platforms',
      'Produces content consistently but lacks professional editing support',
      'Wants to grow reach and monetization through better content quality',
      'Treats content creation as a serious income-generating activity',
    ],
    evidenceOfFit: [
      'Active posting schedule with consistent brand voice',
      'Multiple platform presence with content tailored to each',
      'Mentions wanting to improve content quality or grow audience',
      'Has or is building monetization (sponsors, products, memberships)',
    ],
    buyingSignals: [
      { signal: 'Creator posts content but quality is inconsistent across posts', whyItMatters: 'Quality variation suggests editing bottleneck', howToDetect: 'Review their recent posts for production quality differences' },
      { signal: 'Creator mentions time constraints or editing workload on social media', whyItMatters: 'Explicit need signal for editing support', howToDetect: 'Monitor their posts for mentions of editing time or content production challenges' },
    ],
    disqualifiers: [
      'Content is purely hobby with no growth or monetization intent',
      'No consistent content output or brand direction',
      'Audience is too small to benefit from professional editing investment',
    ],
    discoverySurfaces: ['Instagram creator profiles', 'TikTok creator accounts', 'YouTube creator channels', 'LinkedIn creator mode profiles', 'Twitter/X creator communities'],
  },
};

const nicheModifier: Modifier = (ctx, acc) => {
  const key = normalizeNicheKey(ctx.niche);
  if (key === 'default' || !key) return acc;

  const config = NICHE_CONFIGS[key];
  if (!config) return acc;

  const result = structuredClone(acc);

  // Override prospect characteristics and evidence with niche-specific ones
  result.idealProspectProfile.characteristics = [
    ...result.idealProspectProfile.characteristics.filter(
      (c) => !config.characteristics.some((nc) => c.toLowerCase().includes(nc.slice(0, 15).toLowerCase())),
    ),
    ...config.characteristics,
  ];

  // Prepend niche-specific evidence of fit
  result.idealProspectProfile.evidenceOfFit = [
    ...config.evidenceOfFit,
    ...result.idealProspectProfile.evidenceOfFit,
  ];

  // Prepend niche-specific buying signals
  result.buyingSignals = [...config.buyingSignals, ...result.buyingSignals];

  // Add niche-specific disqualifiers
  for (const dq of config.disqualifiers) {
    if (!result.disqualifiers.includes(dq)) {
      result.disqualifiers.push(dq);
    }
  }

  // Adjust channel search instructions based on niche discovery surfaces
  const surfaces = config.discoverySurfaces;
  if (surfaces.length > 0) {
    // Tag first channel with niche-specific search instruction
    if (result.targetChannels.length > 0) {
      result.targetChannels[0] = {
        ...result.targetChannels[0],
        expectedSignal: `${surfaces.slice(0, 2).join(', ')} — look for prospects matching niche profile`,
        searchInstructions: result.targetChannels[0].searchInstructions ||
          `Search ${surfaces[0]} for potential clients in this niche`,
      };
    }
  }

  return result;
};

/* ──────────────────────────────────────────────
   3. OFFER MODIFIER
   ──────────────────────────────────────────────
   Inspects positioning, deliverables, unique mechanism
   to adjust who is a fit, which problems matter,
   buying signals, and qualification factors.
   ────────────────────────────────────────────── */

const offerModifier: Modifier = (ctx, acc) => {
  const result = structuredClone(acc);
  const { deliverables, uniqueMechanism, type: offerType } = ctx.offer;
  const positioning = ctx.positioning.toLowerCase();

  // ── Positioning-based adjustments ──

  if (positioning.includes('analytics') || positioning.includes('data-driven') || positioning.includes('performance')) {
    result.qualificationFactors = result.qualificationFactors.map((f) => {
      if (f.id === 'content_consistency' || f.name.includes('Metric') || f.name.includes('Engagement')) {
        return { ...f, weight: Math.min(5, f.weight + 1) };
      }
      return f;
    });
    result.idealProspectProfile.evidenceOfFit.push(
      'Prospect has measurable content or business metrics that indicate need',
      'Prospect understands data-driven approach to content improvement',
    );
  }

  if (positioning.includes('storytelling') || positioning.includes('narrative') || positioning.includes('creative')) {
    result.idealProspectProfile.evidenceOfFit.push(
      'Prospect content has narrative potential or emotional engagement moments',
      'Prospect values creative quality and narrative structure',
    );
    result.buyingSignals.push({
      signal: 'Content has storytelling moments that are not being leveraged',
      whyItMatters: 'Storytelling-based editing requires content with narrative potential',
      howToDetect: 'Review content for natural story arcs, emotional moments, or character development',
    });
  }

  if (positioning.includes('conversion') || positioning.includes('growth') || positioning.includes('roi')) {
    result.qualificationFactors = result.qualificationFactors.map((f) => {
      if (f.id === 'budget_capacity' || f.name.includes('Budget') || f.id === 'growth_signals') {
        return { ...f, weight: Math.min(5, f.weight + 1) };
      }
      return f;
    });
    result.idealProspectProfile.characteristics.push(
      'Has measurable growth or conversion goals that professional services can directly impact',
    );
    result.buyingSignals.push({
      signal: 'Prospect has stated growth, conversion, or revenue targets publicly',
      whyItMatters: 'Goals-aligned prospects understand the ROI of the service',
      howToDetect: 'Review their public statements, about page, or investor materials for growth targets',
    });
  }

  // ── Deliverables-based adjustments ──

  const deliverablesLower = deliverables.map((d) => d.toLowerCase());

  // Short-form specific
  if (deliverablesLower.some((d) => d.includes('short') || d.includes('clip') || d.includes('reel') || d.includes('shorts'))) {
    result.dailyProspectingTarget = Math.max(result.dailyProspectingTarget, 10);
    result.idealProspectProfile.evidenceOfFit.unshift(
      'Produces long-form content regularly as source material for clips',
    );
    result.buyingSignals.unshift({
      signal: 'No Shorts, Reels, or TikTok content despite producing long-form video',
      whyItMatters: 'Clear gap between content produced and short-form distribution',
      howToDetect: 'Search their channel or handle for short-form content in the last 30 days',
    });
  }

  // Long-form / production specific
  if (deliverablesLower.some((d) => d.includes('long') || d.includes('production') || d.includes('edit') || d.includes('post-production'))) {
    result.qualificationFactors = result.qualificationFactors.map((f) => {
      if (f.id === 'content_consistency') return { ...f, weight: Math.min(5, f.weight + 1) };
      return f;
    });
    result.idealProspectProfile.evidenceOfFit.unshift(
      'Inconsistent or delayed content publishing schedule suggesting production bottleneck',
    );
    result.buyingSignals.unshift({
      signal: 'Content upload schedule is inconsistent or has visible quality gaps between episodes',
      whyItMatters: 'Production quality variation is a clear signal of editing bottleneck',
      howToDetect: 'Review their upload history for gaps and quality changes',
    });
  }

  // Website/theme specific
  if (deliverablesLower.some((d) => d.includes('theme') || d.includes('landing') || d.includes('website') || d.includes('wordpress'))) {
    result.qualificationFactors = result.qualificationFactors.map((f) => {
      if (f.id === 'website_quality_gap') return { ...f, weight: Math.min(5, f.weight + 1) };
      if (f.id === 'marketing_investment') return { ...f, weight: Math.min(5, f.weight + 1) };
      return f;
    });
    result.buyingSignals.unshift({
      signal: 'Current website is template-based and does not match brand quality',
      whyItMatters: 'Custom theme development directly addresses template limitations',
      howToDetect: 'Evaluate website for template tells (common themes, default layouts, stock imagery)',
    });
  }

  // Integration / plugin specific
  if (deliverablesLower.some((d) => d.includes('plugin') || d.includes('integration') || d.includes('api') || d.includes('form') || d.includes('tracking'))) {
    result.idealProspectProfile.evidenceOfFit.unshift(
      'Uses multiple disconnected tools that could benefit from custom integration',
    );
    result.buyingSignals.unshift({
      signal: 'Manually transferring data between tools or using workarounds for missing integrations',
      whyItMatters: 'Manual processes indicate integration need that custom development solves',
      howToDetect: 'Ask about their current tool stack during qualification conversations',
    });
  }

  // UI/UX design specific
  if (deliverablesLower.some((d) => d.includes('ui') || d.includes('ux') || d.includes('interface') || d.includes('dashboard') || d.includes('design'))) {
    result.qualificationFactors = result.qualificationFactors.map((f) => {
      if (f.id === 'ux_friction_evidence') return { ...f, weight: Math.min(5, f.weight + 1) };
      if (f.id === 'active_userbase') return { ...f, weight: Math.min(5, f.weight + 1) };
      return f;
    });
    result.buyingSignals.unshift({
      signal: 'Product screenshots or demo videos show confusing navigation or cluttered interface',
      whyItMatters: 'Visual evidence of UX problems that design directly solves',
      howToDetect: 'Review product website, demo videos, or trial for UX friction points',
    });
  }

  // ── Unique mechanism adjustments ──

  if (uniqueMechanism) {
    const um = uniqueMechanism.toLowerCase();
    if (um.includes('system') || um.includes('framework') || um.includes('process')) {
      result.idealProspectProfile.characteristics.push(
        'Responds well to structured, process-driven service delivery',
      );
    }
    if (um.includes('done for you') || um.includes('full-service') || um.includes('managed')) {
      result.idealProspectProfile.characteristics.push(
        'Prefers fully managed service over DIY tools or templates',
      );
      result.qualificationFactors = result.qualificationFactors.map((f) => {
        if (f.name.includes('Budget') || f.name.includes('Pay')) {
          return { ...f, weight: Math.min(5, f.weight + 1) };
        }
        return f;
      });
    }
  }

  // ── Offer type adjustments ──

  if (offerType) {
    const ot = offerType.toLowerCase();
    if (ot.includes('retainer') || ot.includes('monthly') || ot.includes('ongoing')) {
      result.idealProspectProfile.characteristics.push(
        'Has ongoing content or service needs that justify retainer engagement',
      );
      result.qualificationFactors = result.qualificationFactors.map((f) => {
        if (f.id === 'content_consistency' || f.id === 'recent_product_activity') {
          return { ...f, weight: Math.min(5, f.weight + 1) };
        }
        return f;
      });
    }
    if (ot.includes('project') || ot.includes('one-time') || ot.includes('fixed')) {
      result.idealProspectProfile.characteristics.push(
        'Has a specific project need with defined scope and timeline',
      );
      result.qualificationFactors = result.qualificationFactors.map((f) => {
        if (f.id === 'website_quality_gap' || f.id === 'ux_friction_evidence') {
          return { ...f, weight: Math.min(5, f.weight + 2) };
        }
        return f;
      });
    }
  }

  return result;
};

/* ──────────────────────────────────────────────
   4. AUTHORITY MODIFIER
   ──────────────────────────────────────────────
   Inspects authority position, proof assets, and
   authority profile to adjust evidence-of-fit logic,
   proof confidence, and qualification emphasis.
   ────────────────────────────────────────────── */

const authorityModifier: Modifier = (ctx, acc) => {
  const result = structuredClone(acc);
  const { position, proofAssets, profile } = ctx.authority;

  const hasPosition = position.trim().length > 0;
  const hasProof = proofAssets.length > 0;
  const hasBio = profile.shortBio.trim().length > 0;
  const hasTrustBullets = profile.trustBullets.length > 0;

  // Count proof assets by type
  const proofTypes = proofAssets.map((a) => a.type.toLowerCase());

  // ── Strong authority → more confident targeting ──
  if (hasPosition && hasProof && hasBio) {
    // With strong authority, we can target higher-value prospects
    result.dailyProspectingTarget = Math.min(20, result.dailyProspectingTarget + 3);
    result.weeklyQualifiedProspectTarget = Math.min(10, result.weeklyQualifiedProspectTarget + 2);

    result.idealProspectProfile.characteristics.push(
      'High-value prospect with clear ROI case for professional services',
    );

    // Boost "Proof / Portfolio Match" equivalent factors
    result.qualificationFactors = result.qualificationFactors.map((f) => {
      if (f.name.includes('Proof') || f.name.includes('Portfolio') || f.name.includes('Investment')) {
        return { ...f, weight: Math.min(5, f.weight + 1) };
      }
      return f;
    });
  }

  // ── Moderate or weak authority → emphasize building trust ──
  if (!hasProof || (!hasPosition && !hasBio)) {
    result.idealProspectProfile.evidenceOfFit.push(
      'Prospect is likely to respond to a relationship-first approach rather than proof-first pitch',
    );

    // Decrease automatic targets — without proof, each prospect requires more effort
    result.dailyProspectingTarget = Math.max(3, result.dailyProspectingTarget - 2);
    result.weeklyQualifiedProspectTarget = Math.max(2, result.weeklyQualifiedProspectTarget - 1);

    result.qualificationFactors = result.qualificationFactors.map((f) => {
      if (f.name.includes('Contact') || f.name.includes('Access')) {
        return { ...f, weight: Math.min(5, f.weight + 1) };
      }
      return f;
    });

    result.buyingSignals.push({
      signal: 'Prospect has a clear, specific problem that matches available proof or experience',
      whyItMatters: 'Without broad proof, need a precise problem match to build confidence',
      howToDetect: 'Identify specific problems in their content or business that directly relate to past work',
    });

    result.disqualifiers.push(
      'Prospect requires extensive case studies or proof portfolio to consider service',
    );
  }

  // ── Specific proof types adjust search vocabulary ──

  if (proofTypes.includes('case_study') || proofTypes.includes('testimonial')) {
    result.idealProspectProfile.evidenceOfFit.push(
      'Prospect has a story or measurable outcome that could become a case study',
    );
  }

  if (proofTypes.includes('sample_project') || proofTypes.includes('portfolio_item')) {
    result.idealProspectProfile.evidenceOfFit.push(
      'Prospect has similar characteristics to existing portfolio projects',
    );
  }

  // ── Authority position influences which prospects are realistic ──

  if (position) {
    const pos = position.toLowerCase();
    if (pos.includes('expert') || pos.includes('specialist') || pos.includes('senior')) {
      result.idealProspectProfile.characteristics.push(
        'Has complex or advanced needs that match specialist-level expertise',
      );
    }
    if (pos.includes('designer') || pos.includes('creative') || pos.includes('artist')) {
      result.idealProspectProfile.characteristics.push(
        'Values creative quality and appreciates visual portfolio evidence',
      );
    }
    if (pos.includes('developer') || pos.includes('engineer') || pos.includes('technical')) {
      result.idealProspectProfile.characteristics.push(
        'Has technical requirements that match engineering-focused service delivery',
      );
    }
    if (pos.includes('strategist') || pos.includes('consultant') || pos.includes('advisor')) {
      result.idealProspectProfile.characteristics.push(
        'Needs strategic guidance alongside execution, not just production support',
      );
      result.buyingSignals.push({
        signal: 'Prospect mentions wanting strategy or consultation, not just execution',
        whyItMatters: 'Strategy-led positioning attracts higher-value consulting engagements',
        howToDetect: 'Review their content for mentions of wanting strategic guidance',
      });
    }
  }

  return result;
};

/* ──────────────────────────────────────────────
   5. PORTFOLIO MODIFIER
   ──────────────────────────────────────────────
   Inspects Module 4 bridge data to determine
   proof-led prospecting capability, actual proof
   asset for handoff, and portfolio readiness impact.
   ────────────────────────────────────────────── */

const portfolioModifier: Modifier = (ctx, acc) => {
  const result = structuredClone(acc);
  const { portfolio } = ctx;

  if (portfolio.ready) {
    // Portfolio is ready — strong proof-led prospecting is possible
    const proofTitle = portfolio.featuredProof.title || portfolio.headline || 'Featured Project';
    const destLabel = portfolio.destination.replace(/_/g, ' ') || 'portfolio';
    const ctaText = portfolio.cta || 'Learn More';

    // Boost targets — ready portfolio makes conversion easier
    result.dailyProspectingTarget = Math.min(25, result.dailyProspectingTarget + 5);
    result.weeklyQualifiedProspectTarget = Math.min(15, result.weeklyQualifiedProspectTarget + 3);

    // Add portfolio-specific evidence of fit
    result.idealProspectProfile.evidenceOfFit.push(
      `Prospect has needs similar to showcased work: "${proofTitle}"`,
      `Prospect would benefit from portfolio destination type: ${destLabel}`,
    );

    // Add portfolio-specific buying signal
    result.buyingSignals.push({
      signal: `Prospect's situation or problem directly matches the featured proof: "${proofTitle}"`,
      whyItMatters: 'Direct proof relevance creates strongest conversion opportunity',
      howToDetect: 'Compare prospect needs against portfolio project descriptions',
    });

    // Boost qualification factors related to proof matching
    result.qualificationFactors = result.qualificationFactors.map((f) => {
      if (f.name.includes('Proof') || f.name.includes('Portfolio') || f.name.includes('Fit')) {
        return { ...f, weight: Math.min(5, f.weight + 1) };
      }
      return f;
    });

    // Add portfolio destination channel
    if (portfolio.destination) {
      result.targetChannels.unshift({
        platform: portfolio.destination === 'personal_site' ? 'Personal Website / Portfolio' : destLabel,
        channelType: 'Visitors to portfolio who match target prospect profile',
        priority: 'high',
        searchInstructions: `Optimize portfolio for ${destLabel} — ensure featured proof "${proofTitle}" is prominent`,
        expectedSignal: 'Portfolio visitors who are in the target niche and have similar needs to featured work',
      });
    }
  } else {
    // No portfolio — prospecting is limited
    result.idealProspectProfile.evidenceOfFit.push(
      'Prospect is open to reviewing work-in-progress or sample projects rather than a polished portfolio',
    );

    result.buyingSignals.push({
      signal: 'Prospect has a clear, urgent need that can be addressed without requiring a full portfolio review',
      whyItMatters: 'Without a ready portfolio, the strongest signal is a specific urgent problem to solve',
      howToDetect: 'Look for prospects with immediate, well-defined problems that match available sample work',
    });

    // Decrease targets — harder to convert without portfolio
    result.dailyProspectingTarget = Math.max(3, result.dailyProspectingTarget - 3);
    result.weeklyQualifiedProspectTarget = Math.max(2, result.weeklyQualifiedProspectTarget - 2);

    // Add portfolio readiness as a disqualifier concern
    result.disqualifiers.push(
      'Prospect requires seeing an extensive portfolio before considering a conversation',
    );

    // Emphasize relationship-building qualification factors
    result.qualificationFactors = result.qualificationFactors.map((f) => {
      if (f.name.includes('Contact') || f.name.includes('Access') || f.name.includes('Urgency')) {
        return { ...f, weight: Math.min(5, f.weight + 1) };
      }
      return f;
    });
  }

  return result;
};

/* ──────────────────────────────────────────────
   Modifier pipeline — ordered application
   ────────────────────────────────────────────── */

const MODIFIER_PIPELINE: Modifier[] = [
  marketModifier,
  nicheModifier,
  offerModifier,
  authorityModifier,
  portfolioModifier,
];

/**
 * Apply all modifiers to the accumulator in order.
 */
export function applyModifiers(ctx: Module5StrategyContext, acc: PipelineStrategyAccumulator): PipelineStrategyAccumulator {
  return MODIFIER_PIPELINE.reduce((current, modifier) => modifier(ctx, current), acc);
}
