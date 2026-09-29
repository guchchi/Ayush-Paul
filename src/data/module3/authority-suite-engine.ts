import type { ProofContext } from '../../types/module3';
import { PlatformCopyEngine } from '../../lib/module3/platform-copy-engine';export function formatSnakeCaseWords(str: string): string {
  if (!str) return '';
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function analyzeProofContext(proofCtx?: ProofContext) {
  const equipped = proofCtx?.availableAssets || [];
  const skipped = proofCtx?.skippedAssets || [];
  const proofAssets = proofCtx?.proofAssets || [];
  const rawInventory = proofCtx?.existingProofInventory || '';

  const hasTestimonials = equipped.some((id) => id.includes('testimonial') || id.includes('client_testimonials'));
  const hasCaseStudies = equipped.some((id) => id.includes('case_study') || id.includes('design_case_study'));
  const hasBeforeAfter = equipped.some((id) => id.includes('before') || id.includes('comparison'));
  const hasDemos = equipped.some((id) => id.includes('video') || id.includes('showreel') || id.includes('demo') || id.includes('prototype') || id.includes('live'));
  const hasMetrics = equipped.some((id) => id.includes('metric') || id.includes('analytics') || id.includes('conversion'));
  const hasCodeOrTech = equipped.some((id) => id.includes('code') || id.includes('github') || id.includes('automation'));

  const totalEquipped = equipped.length;

  // Extract rich item-level evidence from Step 2 proofAssets
  const preparedProofItems = proofAssets.filter((a) => a.title && a.title.trim().length > 0);
  const proofTitles = preparedProofItems.map((a) => a.title.trim());
  const primaryProofTitle = proofTitles[0] || (hasCaseStudies ? 'Interactive Case Study' : hasDemos ? 'Live System Demo' : null);

  const isLowProof = totalEquipped === 0 && preparedProofItems.length === 0;

  return {
    equipped,
    skipped,
    proofAssets,
    rawInventory,
    hasTestimonials,
    hasCaseStudies,
    hasBeforeAfter,
    hasDemos,
    hasMetrics,
    hasCodeOrTech,
    totalEquipped,
    isLowProof,
    preparedProofItems,
    proofTitles,
    primaryProofTitle,
  };
}

export interface BrandAssetItem {
  id: string;
  title: string;
  key: string;
  category: string;
  value: string;
  originalValue: string;
  isCustomized?: boolean;
  version?: number;
}

export interface ProfileSystemAsset {
  platform: 'linkedin' | 'twitter' | 'instagram' | 'youtube' | 'personal_site' | 'github' | 'behance';
  title: string;
  fields: {
    key: string;
    label: string;
    value: string;
    originalValue: string;
    isCustomized?: boolean;
  }[];
}

export interface PortfolioBlueprintSection {
  id: string;
  sectionNumber: number;
  title: string;
  purpose: string;
  conversionReasoning: string;
  recommendedVisuals: string;
  headline: string;
  subheadline: string;
  bodyCopy: string;
  ctaText: string;
  trustStatement?: string;
  animationSuggestion?: string;
  isEnabled?: boolean;
  structuralRole?: string;
  positioningReasoning?: string;
  proofAnchor?: string;
  isHeadlineCustomized?: boolean;
  isSubheadlineCustomized?: boolean;
  isBodyCustomized?: boolean;
  isCtaCustomized?: boolean;
  isTrustCustomized?: boolean;
  isCustomized?: boolean;
  layoutVariant?: string;
}

export interface ContentPostItem {
  dayNumber: number;
  weekNumber: number;
  title: string;
  platform: 'LinkedIn' | 'X' | 'X/Twitter' | 'YouTube' | 'Newsletter';
  format: 'Text + Image' | 'Carousel' | 'Short Video' | 'Text Thread' | 'Text Post' | 'Long Form';
  contentAngle: string;
  hook: string;
  body: string;
  cta: string;
  visualIdea: string;
  repurposingTip: string;
}

export interface OutboundScriptItem {
  id: string;
  title: string;
  type: string;
  targetAudience: string;
  scriptText: string;
  originalScriptText: string;
  proTip: string;
}

export interface CompetitorGapItem {
  feature: string;
  genericCompetitors: string;
  yourAuthoritySystem: string;
  gapImpact: string;
  advantageLevel: 'Dominant' | 'High' | 'Critical';
}

export interface ROIOpportunityItem {
  id: string;
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  authorityImpactPts: number;
  businessImpact: string;
  description: string;
  isCompleted: boolean;
}

export interface RoadmapMilestone {
  dayRange: string;
  phaseTitle: string;
  goals: string[];
  keyDeliverables: string[];
  expectedOutcome: string;
}

export interface GeneratedAuthoritySuite {
  brandAssets: BrandAssetItem[];
  profileSystem: ProfileSystemAsset[];
  portfolioBlueprint: PortfolioBlueprintSection[];
  contentCalendar: ContentPostItem[];
  outreachScripts: OutboundScriptItem[];
  competitorGaps: CompetitorGapItem[];
  opportunityMatrix: ROIOpportunityItem[];
  roadmaps: RoadmapMilestone[];
  upstreamFingerprint?: string;
  status?: 'draft' | 'approved';
  approvedAt?: string;
}

export function computeUpstreamFingerprint(ctx?: {
  marketId?: string | null;
  serviceId?: string | null;
  position?: string | null;
  trustPromise?: string | null;
  uniqueMechanism?: string | null;
  offerType?: string | null;
  targetClient?: string | null;
  proofContext?: ProofContext;
}): string {
  const payload = {
    m: ctx?.marketId || '',
    s: ctx?.serviceId || '',
    p: ctx?.position || '',
    tp: ctx?.trustPromise || '',
    um: ctx?.uniqueMechanism || '',
    ot: ctx?.offerType || '',
    avail: (ctx?.proofContext?.availableAssets || []).slice().sort().join(','),
    skip: (ctx?.proofContext?.skippedAssets || []).slice().sort().join(','),
  };
  return JSON.stringify(payload);
}

export function mergeAuthoritySuites(
  existingSuite: GeneratedAuthoritySuite,
  freshSuite: GeneratedAuthoritySuite
): GeneratedAuthoritySuite {
  // 1. Brand Assets Smart Merge
  const mergedBrandAssets = freshSuite.brandAssets.map((freshItem) => {
    const existingItem = existingSuite.brandAssets.find((a) => a.id === freshItem.id);
    if (existingItem && (existingItem.isCustomized || existingItem.value !== existingItem.originalValue)) {
      return {
        ...freshItem,
        value: existingItem.value,
        isCustomized: true,
      };
    }
    return freshItem;
  });

  // 2. Profile System Smart Merge
  const mergedProfileSystem = freshSuite.profileSystem.map((freshPkg) => {
    const existingPkg = existingSuite.profileSystem.find((p) => p.platform === freshPkg.platform);
    if (!existingPkg) return freshPkg;

    const mergedFields = freshPkg.fields.map((freshField) => {
      const existingField = existingPkg.fields.find((f) => f.key === freshField.key);
      if (existingField && (existingField.isCustomized || existingField.value !== existingField.originalValue)) {
        return {
          ...freshField,
          value: existingField.value,
          isCustomized: true,
        };
      }
      return freshField;
    });

    return {
      ...freshPkg,
      fields: mergedFields,
    };
  });

  // 3. Portfolio Blueprint Sections Smart Merge
  const mergedPortfolioBlueprint = freshSuite.portfolioBlueprint.map((freshSection) => {
    const existingSection = existingSuite.portfolioBlueprint.find((s) => s.id === freshSection.id);
    if (!existingSection) return freshSection;

    const isHeadlineCustomized = !!existingSection.isHeadlineCustomized;
    const isSubheadlineCustomized = !!existingSection.isSubheadlineCustomized;
    const isBodyCustomized = !!existingSection.isBodyCustomized;
    const isCtaCustomized = !!existingSection.isCtaCustomized;
    const isTrustCustomized = !!existingSection.isTrustCustomized;

    return {
      ...freshSection,
      headline: isHeadlineCustomized ? existingSection.headline : freshSection.headline,
      subheadline: isSubheadlineCustomized ? existingSection.subheadline : freshSection.subheadline,
      bodyCopy: isBodyCustomized ? existingSection.bodyCopy : freshSection.bodyCopy,
      ctaText: isCtaCustomized ? existingSection.ctaText : freshSection.ctaText,
      trustStatement: isTrustCustomized ? existingSection.trustStatement : freshSection.trustStatement,
      isHeadlineCustomized,
      isSubheadlineCustomized,
      isBodyCustomized,
      isCtaCustomized,
      isTrustCustomized,
      isCustomized: isHeadlineCustomized || isSubheadlineCustomized || isBodyCustomized || isCtaCustomized || isTrustCustomized,
    } as PortfolioBlueprintSection;
  });

  // 4. Opportunity Matrix Completion State
  const mergedOpportunityMatrix = freshSuite.opportunityMatrix.map((freshOpp) => {
    const existingOpp = existingSuite.opportunityMatrix.find((o) => o.id === freshOpp.id);
    if (existingOpp && existingOpp.isCompleted) {
      return { ...freshOpp, isCompleted: true };
    }
    return freshOpp;
  });

  return {
    ...freshSuite,
    brandAssets: mergedBrandAssets,
    profileSystem: mergedProfileSystem,
    portfolioBlueprint: mergedPortfolioBlueprint,
    opportunityMatrix: mergedOpportunityMatrix,
    upstreamFingerprint: freshSuite.upstreamFingerprint,
    status: existingSuite.status || 'draft',
    approvedAt: existingSuite.approvedAt,
  };
}

export function generateFullAuthoritySuite(ctx?: {
  marketId?: string | null;
  serviceId?: string | null;
  position?: string | null;
  trustPromise?: string | null;
  uniqueMechanism?: string | null;
  offerType?: string | null;
  targetClient?: string | null;
  proofContext?: ProofContext;
}): GeneratedAuthoritySuite {
  const market = formatSnakeCaseWords(ctx?.marketId || 'target_clients');
  const service = formatSnakeCaseWords(ctx?.serviceId || 'high_ticket_services');
  const position = formatSnakeCaseWords(ctx?.position || 'builder');
  const mechanism = ctx?.uniqueMechanism || 'Proof-First Demonstration Engine';
  const promise = ctx?.trustPromise || 'Verifiable outputs with zero fabricated claims';

  const proofAnalysis = analyzeProofContext(ctx?.proofContext);

  // 1. BRAND IDENTITY ENGINE (10 Core Strategy Assets)
  const brandAssets: BrandAssetItem[] = [
    {
      id: 'brand_positioning',
      title: 'Positioning Statement',
      key: 'Positioning Statement',
      category: 'Core Strategy',
      value: `I help ${market} achieve predictable growth using my ${mechanism}, delivering measurable outcomes without generic agency bloat.`,
      originalValue: `I help ${market} achieve predictable growth using my ${mechanism}, delivering measurable outcomes without generic agency bloat.`,
    },
    {
      id: 'brand_category',
      title: 'Category Definition',
      key: 'Category Definition',
      category: 'Core Strategy',
      value: `Category King in ${service} for ${market}`,
      originalValue: `Category King in ${service} for ${market}`,
    },
    {
      id: 'brand_value_prop',
      title: 'Value Proposition',
      key: 'Value Proposition',
      category: 'Messaging',
      value: `Transforming how ${market} source, evaluate, and scale ${service} through transparent proof assets.`,
      originalValue: `Transforming how ${market} source, evaluate, and scale ${service} through transparent proof assets.`,
    },
    {
      id: 'brand_promise',
      title: 'Brand Promise',
      key: 'Brand Promise',
      category: 'Trust',
      value: promise,
      originalValue: promise,
    },
    {
      id: 'brand_mission',
      title: 'Mission Statement',
      key: 'Mission Statement',
      category: 'Identity',
      value: `To eliminate trust friction between ${market} and elite service providers by creating verifiable demonstration projects.`,
      originalValue: `To eliminate trust friction between ${market} and elite service providers by creating verifiable demonstration projects.`,
    },
    {
      id: 'brand_pitch15',
      title: 'Elevator Pitch (15-sec)',
      key: 'Elevator Pitch (15-sec)',
      category: 'Elevator',
      value: `The ${position}-led ${service} architect built specifically for ${market}.`,
      originalValue: `The ${position}-led ${service} architect built specifically for ${market}.`,
    },
    {
      id: 'brand_pitch60',
      title: 'Elevator Pitch (60-sec)',
      key: 'Elevator Pitch (60-sec)',
      category: 'Elevator',
      value: proofAnalysis.primaryProofTitle
        ? `Most ${market} struggle with unverified service claims. I build self-initiated proof demonstrations—such as "${proofAnalysis.primaryProofTitle}"—using ${mechanism} that prove capability before any contract is signed.`
        : `Most ${market} struggle with unverified service claims. I build self-initiated proof demonstrations using ${mechanism} that prove capability before any contract is signed.`,
      originalValue: proofAnalysis.primaryProofTitle
        ? `Most ${market} struggle with unverified service claims. I build self-initiated proof demonstrations—such as "${proofAnalysis.primaryProofTitle}"—using ${mechanism} that prove capability before any contract is signed.`
        : `Most ${market} struggle with unverified service claims. I build self-initiated proof demonstrations using ${mechanism} that prove capability before any contract is signed.`,
    },
    {
      id: 'brand_tagline',
      title: 'Brand Tagline',
      key: 'Brand Tagline',
      category: 'Messaging',
      value: `Proof Over Claims. Systemized Execution. Measured Impact.`,
      originalValue: `Proof Over Claims. Systemized Execution. Measured Impact.`,
    },
    {
      id: 'brand_belief',
      title: 'Authority Belief System',
      key: 'Authority Belief System',
      category: 'Point of View',
      value: `In a market flooded with empty promises, proof is the ultimate conversion mechanism. Work should speak through verifiable outputs, not speculative slide decks.`,
      originalValue: `In a market flooded with empty promises, proof is the ultimate conversion mechanism. Work should speak through verifiable outputs, not speculative slide decks.`,
    },
    {
      id: 'brand_diff',
      title: 'Differentiation Statement',
      key: 'Differentiation Statement',
      category: 'Competitive',
      value: proofAnalysis.proofTitles.length > 0
        ? `Unlike generic agencies that rely on pitch decks, I deploy live proof assets like ${proofAnalysis.proofTitles.slice(0, 2).map((t) => `"${t}"`).join(' & ')} showing exact implementation workflows before contract sign-off.`
        : `Unlike generic agencies that rely on pitch decks, I deploy live proof assets showing exact implementation workflows before contract sign-off.`,
      originalValue: proofAnalysis.proofTitles.length > 0
        ? `Unlike generic agencies that rely on pitch decks, I deploy live proof assets like ${proofAnalysis.proofTitles.slice(0, 2).map((t) => `"${t}"`).join(' & ')} showing exact implementation workflows before contract sign-off.`
        : `Unlike generic agencies that rely on pitch decks, I deploy live proof assets showing exact implementation workflows before contract sign-off.`,
    },
  ];

  // Construct dynamic proof-based copy for Portfolio Sections & Profile System
  let proofSectionHeadline = `Interactive Proof Asset Gallery`;
  let proofSectionSubhead = `Inspect live outputs, templates, and execution blueprints.`;
  let proofSectionBody = `Transparency is our core currency. Browse our open proof repository to evaluate exact execution standards and strategic documentation.`;
  let proofSectionVisuals = `Embedded live interactive widget, clickable prototype link, GitHub repository link.`;
  let proofTrustNote = `🛡️ Verifiable proof assets self-reported & prepared in Step 2.`;

  if (proofAnalysis.preparedProofItems.length > 0) {
    proofSectionHeadline = `Interactive Proof Gallery: ${proofAnalysis.proofTitles[0]}`;
    proofSectionSubhead = `Inspect verified proof assets, interactive prototypes, and execution blueprints.`;
    proofSectionBody = `Browse our live proof repository featuring: ${proofAnalysis.preparedProofItems.map((p) => `"${p.title}" (${p.portfolioCopy?.proofStatement || p.credibilityGapProved || 'Verified Output'})`).join('; ')}.`;
    proofSectionVisuals = `Live interactive embeds for: ${proofAnalysis.proofTitles.join(', ')}.`;
    proofTrustNote = `🛡️ Verifiable proof assets prepared in Step 2: ${proofAnalysis.proofTitles.join(', ')}.`;
  } else if (proofAnalysis.hasBeforeAfter || proofAnalysis.hasDemos) {
    proofSectionHeadline = `Live Interactive Demos & Before/After Proof`;
    proofSectionSubhead = `See raw baseline assets side-by-side with our high-pacing optimizations.`;
    proofSectionBody = `Browse live interactive prototypes and split-screen visual comparisons demonstrating immediate visual and performance speedups for ${market}.`;
    proofSectionVisuals = `Split-screen Before/After video, interactive prototype embed, live demo workspace link.`;
  } else if (proofAnalysis.hasMetrics) {
    proofSectionHeadline = `Data-Backed Results & Performance Metrics`;
    proofSectionSubhead = `Analytics graphs and conversion improvements recorded under real production conditions.`;
    proofSectionBody = `Examine verified metric reports and analytics dashboards highlighting exact performance gains achieved using ${mechanism}.`;
    proofSectionVisuals = `Verified metrics breakdown chart, Google Analytics screenshot proof.`;
  } else if (proofAnalysis.isLowProof) {
    proofSectionHeadline = `Methodology Teardown & Transparent Workflow`;
    proofSectionSubhead = `Zero fabricated claims. Complete transparency into our execution frameworks.`;
    proofSectionBody = `Rather than fabricating unverified claims, we document our exact step-by-step methodology, architecture wireframes, and process standards. Inspect our transparent workflow before partnering.`;
    proofSectionVisuals = `Methodology architecture diagram, transparent workflow flowchart, open design spec notebook.`;
    proofTrustNote = `🛡️ Process-first transparency. Proof assets currently building; full methodology open for inspection.`;
  }

  let testimonialsHeadline: string;
  let testimonialsSubhead: string;
  let testimonialsBody: string;

  if (proofAnalysis.hasTestimonials) {
    testimonialsHeadline = `Client Testimonials & Verified Outcome Reports`;
    testimonialsSubhead = `Feedback from partners who transformed their business with our authority system.`;
    testimonialsBody = `"Working with us was the single best decision for our ${service}. The level of proof and clarity was unlike any agency." — Verified Client Partner`;
  } else if (proofAnalysis.preparedProofItems.length > 0) {
    testimonialsHeadline = `Verified Implementation Case Studies`;
    testimonialsSubhead = `Deep-dive teardowns demonstrating our exact execution standards for ${market}.`;
    testimonialsBody = `Featured Teardown: "${proofAnalysis.preparedProofItems[0].title}". Demonstrates baseline analysis, optimization architecture, and verifiable outcome metrics.`;
  } else {
    testimonialsHeadline = `Client Partnership & Delivery Commitments`;
    testimonialsSubhead = `Our transparent service-level agreements and execution guarantees.`;
    testimonialsBody = `We prioritize verifiable execution over verbal claims. Every client engagement includes milestone verification, documented deliverable standards, and zero hidden scope surprises.`;
  }

  const socialProofLine = proofAnalysis.proofTitles.length > 0
    ? `Featuring live proof assets: ${proofAnalysis.proofTitles.slice(0, 2).join(' | ')}`
    : (proofAnalysis.hasTestimonials || proofAnalysis.hasCaseStudies)
    ? `Backed by verified case studies & client endorsements in ${market}.`
    : (proofAnalysis.hasDemos || proofAnalysis.hasBeforeAfter)
    ? `Featuring live video demos & before/after performance comparisons.`
    : `Methodology-first execution with 100% transparent process proof.`;

  const linkedinAboutCopy = proofAnalysis.preparedProofItems.length > 0
    ? `I help ${market} build scalable ${service} architecture. ${promise}.\n\nMost providers offer promises; I build live, verifiable demonstration assets so you see the exact execution standards before we ever partner:\n\n` + proofAnalysis.preparedProofItems.map((item) => `• ${item.title}: ${item.portfolioCopy?.proofStatement || item.credibilityGapProved || 'Verified Output'}`).join('\n') + `\n\nDM me "PROOF" to view my complete case study teardowns.`
    : `I help ${market} build scalable ${service} architecture. ${promise}.\n\nMost providers offer promises; I build live, verifiable demonstration assets so you see the exact execution standards before we ever partner.\n\nDM me "PROOF" to view my complete case study teardowns.`;

  // 2. COMPLETE PROFILE SYSTEM (Generated Combinatorially for all 13 platforms)
  const profileSystem = PlatformCopyEngine.generateProfiles(
    {
      marketId: market,
      serviceId: service,
      positioning: position,
      mechanism,
      promise,
      primaryProofTitle: proofAnalysis.primaryProofTitle,
      proofTitles: proofAnalysis.proofTitles,
    },
    0, // Default seed
    'direct' // Default tone
  );

  // 3. PORTFOLIO ARCHITECTURE GENERATOR (9 Sections)
  const portfolioBlueprint: PortfolioBlueprintSection[] = [
    {
      id: 'section_hero',
      sectionNumber: 1,
      title: '1. Hero Section (First Impression)',
      purpose: 'Hook high-ticket buyers immediately and state positioning clearly.',
      conversionReasoning: 'Reduces bounce rates by immediately answering: Who is this for? What do they deliver? Why should I trust them?',
      recommendedVisuals: 'Clean high-contrast typography, interactive floating proof badge, live demonstration GIF/video preview.',
      headline: `High-Certainty ${service} for ${market}`,
      subheadline: `Scale your brand using ${mechanism}. Documented results with zero fabricated claims.`,
      bodyCopy: `Stop taking leaps of faith with generic agencies. Experience proof-first execution built specifically for ${market}.`,
      ctaText: 'Access Authority Portfolio →',
      trustStatement: '🛡️ Verifiable outputs & transparent scope notes included with every project.',
      animationSuggestion: 'FadeUp with 0.4s ease out, subtle scale-up on CTA button hover.',
    },
    {
      id: 'section_about',
      sectionNumber: 2,
      title: '2. Authority Story & Background',
      purpose: 'Establish domain expertise, core philosophy, and mission.',
      conversionReasoning: 'Buyers buy from experts they trust. Demonstrating a clear point-of-view builds immediate personal authority.',
      recommendedVisuals: 'High-resolution professional photo, key metrics counter, timeline of major milestones.',
      headline: `Why I Built the ${mechanism}`,
      subheadline: `The industry is full of promises. I chose to build on verifiable proof.`,
      bodyCopy: `After analyzing how ${market} evaluate service providers, I realized traditional pitch decks create unnecessary risk. My mission is to deliver complete transparency through self-initiated demonstration projects.`,
      ctaText: 'Read My Authority Thesis',
    },
    {
      id: 'section_services',
      sectionNumber: 3,
      title: '3. Core Service & Offer System',
      purpose: 'Display high-ticket offer tiers and deliverable scope with clarity.',
      conversionReasoning: 'Eliminates scope ambiguity so clients understand exact deliverables, milestones, and engagement options.',
      recommendedVisuals: '3-column pricing or scope cards with feature checkmarks and highlighted recommended tier.',
      headline: `Tailored ${service} Packages for ${market}`,
      subheadline: `Structured engagements designed for speed, certainty, and maximum ROI.`,
      bodyCopy: `Choose between Milestone-based implementations or Ongoing Retainer support. Every package includes direct access to expert execution, weekly updates, and documented deliverables.`,
      ctaText: 'Select Offer Tier →',
    },
    {
      id: 'section_case_studies',
      sectionNumber: 4,
      title: '4. Case Studies & STAR Breakdown',
      purpose: 'Demonstrate real-world problem solving through Situation, Task, Action, Result.',
      conversionReasoning: 'Provides concrete evidence of execution capability and strategic thinking under real constraints.',
      recommendedVisuals: 'Before/After metrics visual, code/workflow screenshots, client video snippet.',
      headline: `Live Case Studies & Implementation Teardowns`,
      subheadline: `Real challenges, strategic execution, and measured outcomes.`,
      bodyCopy: `Explore detailed breakdowns showing how we diagnosed bottlenecks for ${market} and implemented ${mechanism} to achieve measurable scale.`,
      ctaText: 'View Case Study Teardown',
    },
    {
      id: 'section_proof',
      sectionNumber: 5,
      title: '5. Verifiable Proof Assets & Code',
      purpose: 'Show actual deliverable outputs, repositories, live dashboards, or design files.',
      conversionReasoning: 'Unquestionable proof: clients can see, touch, and test your actual work quality before buying.',
      recommendedVisuals: proofSectionVisuals,
      headline: proofSectionHeadline,
      subheadline: proofSectionSubhead,
      bodyCopy: proofSectionBody,
      ctaText: 'Open Live Proof Hub',
      trustStatement: proofTrustNote,
    },
    {
      id: 'section_testimonials',
      sectionNumber: 6,
      title: '6. Testimonials & Social Proof',
      purpose: 'Provide third-party validation from peers and past clients.',
      conversionReasoning: 'Social proof activates peer validation, confirming that others in ${market} recommend your work.',
      recommendedVisuals: 'Grid of video testimonial cards + verified LinkedIn quote cards with client avatar and company logo.',
      headline: testimonialsHeadline,
      subheadline: testimonialsSubhead,
      bodyCopy: testimonialsBody,
      ctaText: 'Read All Testimonials',
    },
    {
      id: 'section_authority',
      sectionNumber: 7,
      title: '7. Media & Thought Leadership',
      purpose: 'Display podcast appearances, articles, press mentions, and guest posts.',
      conversionReasoning: 'Leverages external media authority to position you as a recognized industry leader.',
      recommendedVisuals: 'Media logo bar (Podcasts, Press, Publications) + featured article cards with reading times.',
      headline: `Featured In & Industry Contributions`,
      subheadline: `Sharing insights on ${service} across podcasts, publications, and keynotes.`,
      bodyCopy: `Listen to deep-dive interviews where we break down the future of ${service} for ${market}.`,
      ctaText: 'Listen to Podcast Interviews',
    },
    {
      id: 'section_faq',
      sectionNumber: 8,
      title: '8. High-Ticket FAQ & Objection Handling',
      purpose: 'Address the top 6 buying objections directly before the call.',
      conversionReasoning: 'Handling price, time, scope, and trust objections upfront increases calendar booking conversion by 40%.',
      recommendedVisuals: 'Clean accordion UI with search/filter tags.',
      headline: `Frequently Asked Questions`,
      subheadline: `Everything you need to know about our engagement model, timelines, and guarantees.`,
      bodyCopy: `Q: How quickly can we launch?\nA: Discovery takes 3 days, full implementation begins within 1 week.\n\nQ: What if we have custom requirements?\nA: All packages are tailored using modular components from our ${mechanism}.`,
      ctaText: 'Have More Questions? Contact Us',
    },
    {
      id: 'section_cta',
      sectionNumber: 9,
      title: '9. Final CTA & Calendar Booking',
      purpose: 'Drive high-ticket prospects to book a strategy call or request a proposal.',
      conversionReasoning: 'A focused, low-friction booking section converts interested visitors into scheduled pipeline calls.',
      recommendedVisuals: 'Embedded Calendly/SavvyCal widget alongside a quick 3-bullet value summary.',
      headline: `Ready to Build Your ${service} Authority?`,
      subheadline: `Book a 15-minute strategy consultation to review your current positioning and proof assets.`,
      bodyCopy: `Select a time that works for you below. No high-pressure sales tactics — just an honest evaluation of your market potential.`,
      ctaText: 'Book Strategy Call Now →',
      trustStatement: '🔒 100% Confidential. Zero Obligation.',
    },
  ];

  // 4. 30-DAY AUTHORITY CONTENT MATRIX (30 Posts)
  const contentCalendar: ContentPostItem[] = [];
  const platforms: ('LinkedIn' | 'X/Twitter')[] = ['LinkedIn', 'X/Twitter'];
  const formats: ('Text + Image' | 'Carousel' | 'Short Video' | 'Text Post' | 'Long Form')[] = [
    'Text Post', 'Carousel', 'Text + Image', 'Short Video', 'Long Form'
  ];

  for (let day = 1; day <= 30; day++) {
    const week = Math.ceil(day / 7);
    const platform = platforms[day % 2];
    const format = formats[day % 5];
    const itemProof = proofAnalysis.preparedProofItems.length > 0
      ? proofAnalysis.preparedProofItems[(day - 1) % proofAnalysis.preparedProofItems.length]
      : null;

    const postTitle = itemProof
      ? `Day ${day}: "${itemProof.title}" Teardown`
      : `Day ${day}: ${service} Teardown #${day}`;

    const hookText = itemProof
      ? (day % 3 === 0
          ? `Inside my "${itemProof.title}": How we solve ${service} for ${market} (Full Breakdown 🧵👇)`
          : day % 3 === 1
          ? `Why 90% of ${market} struggle with ${service}—and how our "${itemProof.title}" fixes it.`
          : `Step-by-step breakdown of "${itemProof.title}" built using ${mechanism}:`)
      : (day % 3 === 0
          ? `Most ${market} make this critical mistake when scaling ${service}...`
          : day % 3 === 1
          ? `Why 90% of ${market} struggle with ${service}—and how our ${mechanism} fixes it.`
          : `Step-by-step breakdown of how to build scalable ${service} architecture:`);
    
    contentCalendar.push({
      dayNumber: day,
      weekNumber: week,
      title: postTitle,
      platform,
      format,
      contentAngle: day % 3 === 0 ? 'Case Study Breakdown' : day % 3 === 1 ? 'Contrarian Industry Myth' : 'Step-by-Step Tactical Framework',
      hook: hookText,
      body: itemProof
        ? `Here is the exact step-by-step breakdown of "${itemProof.title}" using ${mechanism}:\n\n1. Identified credibility gap: ${itemProof.credibilityGapProved || 'Market skepticism'}\n2. Built proof asset: ${itemProof.title}\n3. Measured output results\n\nSwipe through for the complete blueprint.`
        : `Here is the exact step-by-step breakdown of how we solved it using ${mechanism}:\n\n1. Diagnosed the root bottleneck\n2. Built proof demonstration\n3. Measured output results\n\nSwipe through for the complete blueprint.`,
      cta: `DM me "PROOF" for the full template or drop a comment below!`,
      visualIdea: itemProof
        ? `Screenshot breakdown or live video clip of "${itemProof.title}".`
        : `Diagram graphic showing Before vs After metrics for ${market}.`,
      repurposingTip: `Turn this post into a 60-second vertical video script or LinkedIn article.`,
    });
  }

  // 5. 8 OUTBOUND CLIENT ACQUISITION SCRIPTS
  const outreachScripts: OutboundScriptItem[] = [
    {
      id: 'script_linkedin_dm',
      title: '1. LinkedIn Cold DM (Permission-Based)',
      type: 'Outbound DM',
      targetAudience: market,
      scriptText: `Hey [Name], noticed your recent work with [Company]. I built a live demonstration breakdown analyzing how ${market} are optimizing their ${service} using ${mechanism}.\n\nNo pitch — would you be open to me dropping the 2-minute video link over here?`,
      originalScriptText: `Hey [Name], noticed your recent work with [Company]. I built a live demonstration breakdown analyzing how ${market} are optimizing their ${service} using ${mechanism}.\n\nNo pitch — would you be open to me dropping the 2-minute video link over here?`,
      proTip: 'Permission-based DMs get a 4x higher response rate because they do not push a hard pitch upfront.',
    },
    {
      id: 'script_cold_email',
      title: '2. Cold Email (Teardown Pitch)',
      type: 'Cold Email',
      targetAudience: market,
      scriptText: `Subject: Teardown for [Company] ${service}\n\nHi [Name],\n\nI put together a quick proof asset breakdown of [Company]'s current ${service} workflow.\n\nIdentified 2 key areas where ${market} typically unlock 20-30% efficiency gains through ${mechanism}.\n\nHere is the view-only link: [Insert Link]\n\nHope this provides value! Let me know if you want me to expand on point #2.\n\nBest,\nAyush`,
      originalScriptText: `Subject: Teardown for [Company] ${service}\n\nHi [Name],\n\nI put together a quick proof asset breakdown of [Company]'s current ${service} workflow.\n\nIdentified 2 key areas where ${market} typically unlock 20-30% efficiency gains through ${mechanism}.\n\nHere is the view-only link: [Insert Link]\n\nHope this provides value! Let me know if you want me to expand on point #2.\n\nBest,\nAyush`,
      proTip: 'Always attach a free customized teardown link to prove capability before asking for time.',
    },
    {
      id: 'script_followup_1',
      title: '3. Follow-up Script #1 (Value Bump)',
      type: 'Follow-up',
      targetAudience: market,
      scriptText: `Hi [Name], following up on the ${service} teardown link I sent over. I just updated the framework with a quick checklist specifically for ${market}.\n\nDid you have a chance to take a look?`,
      originalScriptText: `Hi [Name], following up on the ${service} teardown link I sent over. I just updated the framework with a quick checklist specifically for ${market}.\n\nDid you have a chance to take a look?`,
      proTip: 'Send Follow-up #1 within 48-72 hours. Always add a new snippet of value rather than saying "just checking in".',
    },
    {
      id: 'script_followup_2',
      title: '4. Follow-up Script #2 (Break-up / Final Value)',
      type: 'Follow-up',
      targetAudience: market,
      scriptText: `Hey [Name], assuming you are fully focused on other priorities right now. I'll archive this teardown for now, but if you ever want to explore ${mechanism} for ${market}, feel free to reach out anytime!`,
      originalScriptText: `Hey [Name], assuming you are fully focused on other priorities right now. I'll archive this teardown for now, but if you ever want to explore ${mechanism} for ${market}, feel free to reach out anytime!`,
      proTip: 'Break-up emails trigger loss aversion and often generate the highest response rate in a sequence.',
    },
    {
      id: 'script_discovery_opener',
      title: '5. Discovery Call Opener Script',
      type: 'Sales Call',
      targetAudience: market,
      scriptText: `"Thanks for joining today, [Name]. The goal for our 20 minutes is simple: I want to understand your current ${service} setup, show you how we deploy ${mechanism}, and see if there is a mutual fit. How does that sound?"`,
      originalScriptText: `"Thanks for joining today, [Name]. The goal for our 20 minutes is simple: I want to understand your current ${service} setup, show you how we deploy ${mechanism}, and see if there is a mutual fit. How does that sound?"`,
      proTip: 'Setting a clear agenda in the first 30 seconds establishes authority and controls call pacing.',
    },
    {
      id: 'script_proposal_intro',
      title: '6. Proposal Introduction Script',
      type: 'Sales Proposal',
      targetAudience: market,
      scriptText: `Based on our conversation, we have structured a proof-first engagement around 3 milestones. Every milestone includes verifiable delivery criteria before phase progression.`,
      originalScriptText: `Based on our conversation, we have structured a proof-first engagement around 3 milestones. Every milestone includes verifiable delivery criteria before phase progression.`,
      proTip: 'Highlighting milestone verification in proposals removes buying anxiety for high-ticket clients.',
    },
    {
      id: 'script_objection_handling',
      title: '7. Objection Handling Scripts (Price & Trust)',
      type: 'Sales Objection',
      targetAudience: market,
      scriptText: `Objection: "Your pricing is higher than other providers."\nResponse: "I completely understand. Generic agencies charge less because they deliver unverified promises. We build custom demonstration assets using ${mechanism} that guarantee execution quality before scaling."`,
      originalScriptText: `Objection: "Your pricing is higher than other providers."\nResponse: "I completely understand. Generic agencies charge less because they deliver unverified promises. We build custom demonstration assets using ${mechanism} that guarantee execution quality before scaling."`,
      proTip: 'Frame premium pricing around certainty and execution risk reduction rather than features.',
    },
    {
      id: 'script_reengagement',
      title: '8. Re-engagement Script (Stale Leads)',
      type: 'Re-engagement',
      targetAudience: market,
      scriptText: `Hi [Name], we just released an updated case study showing how a ${market} brand achieved a 35% increase in ${service} efficiency using ${mechanism}. Thought of you — here is the open link: [Insert Link].`,
      originalScriptText: `Hi [Name], we just released an updated case study showing how a ${market} brand achieved a 35% increase in ${service} efficiency using ${mechanism}. Thought of you — here is the open link: [Insert Link].`,
      proTip: 'Re-engage cold prospects every 30-60 days whenever you publish a new high-ticket proof asset.',
    },
  ];

  // 6. COMPETITOR GAP ANALYSIS MATRIX
  const competitorGaps: CompetitorGapItem[] = [
    {
      feature: 'Proof & Credibility Assets',
      genericCompetitors: 'Generic pitch decks, fabricated testimonials, unverified case studies',
      yourAuthoritySystem: `Live demonstration projects, open proof repositories, verifiable ${mechanism}`,
      gapImpact: 'Eliminates 90% of prospect buying hesitation upfront',
      advantageLevel: 'Dominant',
    },
    {
      feature: 'Positioning & Messaging',
      genericCompetitors: 'Vague "full-service" claims, competing in red ocean categories',
      yourAuthoritySystem: `Sharply defined Category King positioning as a ${position} for ${market}`,
      gapImpact: 'Positions you as the default expert rather than a commoditized vendor',
      advantageLevel: 'High',
    },
    {
      feature: 'Outbound Client Acquisition',
      genericCompetitors: 'Spammy high-volume cold outreach with immediate sales pitch',
      yourAuthoritySystem: 'Permission-based outreach offering free value teardowns and proof links',
      gapImpact: '4x higher response rates and positive brand sentiment',
      advantageLevel: 'High',
    },
    {
      feature: 'Deliverable Transparency',
      genericCompetitors: 'Black-box execution with delayed progress updates',
      yourAuthoritySystem: 'Milestone-driven delivery with public decision rationale and scope notes',
      gapImpact: 'Builds long-term client trust and high retainer retention',
      advantageLevel: 'Critical',
    },
  ];

  // 7. PRIORITY ROI OPPORTUNITY MATRIX
  const opportunityMatrix: ROIOpportunityItem[] = [
    {
      id: 'opp_1',
      title: 'Publish Live LinkedIn & X Profile Packages',
      priority: 'HIGH',
      estimatedTime: '20 min',
      difficulty: 'Easy',
      authorityImpactPts: 12,
      businessImpact: 'High',
      description: 'Update your social profiles with the generated headlines, bio, and featured link CTA.',
      isCompleted: true,
    },
    {
      id: 'opp_2',
      title: 'Deploy Hero & About Sections to Website Canvas',
      priority: 'HIGH',
      estimatedTime: '30 min',
      difficulty: 'Medium',
      authorityImpactPts: 15,
      businessImpact: 'Transformational',
      description: 'Implement the 9-section portfolio blueprint on your landing page to convert high-ticket traffic.',
      isCompleted: false,
    },
    {
      id: 'opp_3',
      title: 'Publish First 3 Teardown Posts from Content Matrix',
      priority: 'HIGH',
      estimatedTime: '45 min',
      difficulty: 'Medium',
      authorityImpactPts: 10,
      businessImpact: 'High',
      description: 'Post Day 1-3 authority content teardowns to LinkedIn and X to establish public thought leadership.',
      isCompleted: false,
    },
    {
      id: 'opp_4',
      title: 'Send 10 Permission-Based DMs to Target Prospects',
      priority: 'MEDIUM',
      estimatedTime: '30 min',
      difficulty: 'Easy',
      authorityImpactPts: 8,
      businessImpact: 'Very High',
      description: 'Initiate targeted outreach offering free teardowns to generate qualified pipeline leads.',
      isCompleted: false,
    },
  ];

  // 8. 7 / 30 / 90-DAY EXECUTION ROADMAPS
  const roadmaps: RoadmapMilestone[] = [
    {
      dayRange: '7-Day Launch',
      phaseTitle: 'Phase 1: Foundation & Profile Activation',
      goals: ['Complete Brand Identity Engine', 'Update LinkedIn & Twitter Profiles', 'Publish Website Hero Section'],
      keyDeliverables: ['LinkedIn Banner & Headline', 'Website Hero Copy', '1 Live Case Study Teardown'],
      expectedOutcome: '100% Brand Consistency & Public Authority Infrastructure Live',
    },
    {
      dayRange: '30-Day Scale',
      phaseTitle: 'Phase 2: Content Engine & Outbound Pipeline',
      goals: ['Publish 12 Authority Posts', 'Send 50 Outbound Value DMs', 'Deploy 9-Section Portfolio Website'],
      keyDeliverables: ['30-Day Content Calendar Execution', 'Permission DM Sequence', 'Portfolio Website'],
      expectedOutcome: 'Generating 3-5 Inbound/Outbound Qualified Strategy Calls Weekly',
    },
    {
      dayRange: '90-Day Dominance',
      phaseTitle: 'Phase 3: Category Dominance & Scale',
      goals: ['Scale Retainer Offers', 'Publish 3 Comprehensive Proof Repositories', 'Establish Podcast Guest Pipeline'],
      keyDeliverables: ['High-Ticket Retainer System', 'Proof Gallery', 'Media Press Kit'],
      expectedOutcome: 'Category Leadership Position with Predictable $10k+ Monthly Revenue',
    },
  ];

  const upstreamFingerprint = computeUpstreamFingerprint(ctx);

  return {
    brandAssets,
    profileSystem,
    portfolioBlueprint,
    contentCalendar,
    outreachScripts,
    competitorGaps,
    opportunityMatrix,
    roadmaps,
    upstreamFingerprint,
    status: 'draft',
  };
}
