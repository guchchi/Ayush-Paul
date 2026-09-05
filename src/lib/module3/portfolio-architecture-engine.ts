/**
 * portfolio-architecture-engine.ts
 *
 * Core engine for Module 3 Step 3 Level 2: Portfolio Architecture Builder.
 * Provides:
 *  - Archetype definitions and preset section sequence mappings
 *  - 5-Dimension Portfolio Conversion Score calculator (0-100)
 *  - Real-time telemetry (read time, proof ratio, CTA count)
 *  - Tone variation generators for section copy
 */

import type { PortfolioBlueprintSection } from '@/src/data/module3/authority-suite-engine';

export interface PortfolioArchetype {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  bestFor: string;
  recommendedOrder: string[]; // array of section IDs in optimal order
  funnelFocus: string;
  conversionAdvantage: string;
  iconName: 'Zap' | 'Shield' | 'Cpu' | 'Award';
}

export const PORTFOLIO_ARCHETYPES: PortfolioArchetype[] = [
  {
    id: 'proof_first',
    name: 'The Proof-First Specialist',
    badge: 'Immediate Demonstration',
    subtitle: 'Front-loads verifiable proof and live demo widgets right below the hero.',
    description: 'Designed for high-skill visual and technical specialists where clients need to see immediate execution quality before reading philosophy.',
    bestFor: 'Video Editors, Motion Designers, Fullstack Engineers, UI/UX Specialists',
    recommendedOrder: [
      'section_hero',
      'section_proof',
      'section_case_studies',
      'section_services',
      'section_about',
      'section_testimonials',
      'section_faq',
      'section_cta',
    ],
    funnelFocus: 'Proof Above The Fold: Eliminates skepticism within the first 10 seconds.',
    conversionAdvantage: '73% higher retention for technical buyers who skip copy to find samples.',
    iconName: 'Zap',
  },
  {
    id: 'system_architect',
    name: 'The High-Ticket System Architect',
    badge: 'Proprietary Methodology',
    subtitle: 'Elevates your unique mechanism and transformation methodology into category king status.',
    description: 'Ideal for consultative operators and advisors whose primary value is a repeatable strategic framework that drives ROI.',
    bestFor: 'High-Ticket Consultants, Fractional Leaders, Strategy Specialists, Growth Engineers',
    recommendedOrder: [
      'section_hero',
      'section_about',
      'section_services',
      'section_case_studies',
      'section_proof',
      'section_testimonials',
      'section_authority',
      'section_faq',
      'section_cta',
    ],
    funnelFocus: 'Mechanism Framing: Proves why conventional solutions fail and why your system is mandatory.',
    conversionAdvantage: 'Justifies $5k–$25k+ project fees by demonstrating strategic mastery.',
    iconName: 'Cpu',
  },
  {
    id: 'agency_alternative',
    name: 'The Agency Alternative',
    badge: 'High-Velocity Solo Partner',
    subtitle: 'Positions you against bloated agencies with sprint velocity, transparency, and direct operator access.',
    description: 'Perfect for senior solo operators who want to highlight speed, zero bureaucratic overhead, and clear deliverable tiers.',
    bestFor: 'Senior Freelance Specialists, Product Designers, Technical Leads',
    recommendedOrder: [
      'section_hero',
      'section_services',
      'section_case_studies',
      'section_proof',
      'section_about',
      'section_testimonials',
      'section_faq',
      'section_cta',
    ],
    funnelFocus: 'Frictionless Evaluation: Clean packages, sprint pricing, and rapid time-to-value.',
    conversionAdvantage: 'Cuts procurement friction by 50% for founders tired of junior agency staffing.',
    iconName: 'Shield',
  },
  {
    id: 'case_study_showcase',
    name: 'The Deep Case Study Showcase',
    badge: 'STAR Teardown Focus',
    subtitle: 'Puts 3 detailed Situation-Task-Action-Result case studies center stage.',
    description: 'Optimized for experienced practitioners with established results who want the depth of their client transformations to close the sale.',
    bestFor: 'Niche Specialists, Retention Experts, B2B Campaign Architects',
    recommendedOrder: [
      'section_hero',
      'section_case_studies',
      'section_proof',
      'section_testimonials',
      'section_services',
      'section_about',
      'section_faq',
      'section_cta',
    ],
    funnelFocus: 'Outcome Certainty: Shows step-by-step how past bottlenecks were diagnosed and resolved.',
    conversionAdvantage: 'Ideal for closing high-skepticism enterprise buyers.',
    iconName: 'Award',
  },
];

export interface PortfolioConversionAudit {
  totalScore: number; // 0 - 100
  ratingLabel: 'Optimal' | 'Strong' | 'Needs Optimization' | 'Critical Gaps';
  ratingColor: string;
  dimensionScores: {
    hookClarity: { score: number; max: number; label: string; tip: string };
    proofProximity: { score: number; max: number; label: string; tip: string };
    offerClarity: { score: number; max: number; label: string; tip: string };
    objectionReadiness: { score: number; max: number; label: string; tip: string };
    ctaFriction: { score: number; max: number; label: string; tip: string };
  };
  recommendations: string[];
}

export function calculatePortfolioConversionScore(
  sections: PortfolioBlueprintSection[],
  service?: string | null,
  mechanism?: string | null
): PortfolioConversionAudit {
  const activeSections = sections.filter((s) => s.isEnabled !== false);
  const hero = activeSections.find((s) => s.id === 'section_hero');
  const proof = activeSections.find((s) => s.id === 'section_proof');
  const caseStudies = activeSections.find((s) => s.id === 'section_case_studies');
  const services = activeSections.find((s) => s.id === 'section_services');
  const faq = activeSections.find((s) => s.id === 'section_faq');
  const cta = activeSections.find((s) => s.id === 'section_cta');

  // 1. Hook Clarity (Max 20 pts)
  let hookScore = 0;
  if (hero) {
    hookScore += 8;
    if (hero.headline && hero.headline.length > 15) hookScore += 4;
    if (hero.subheadline && hero.subheadline.length > 20) hookScore += 4;
    if (mechanism && hero.headline?.toLowerCase().includes(mechanism.toLowerCase())) hookScore += 4;
    else if (hero.headline && !hero.headline.toLowerCase().includes('welcome')) hookScore += 4;
  }
  hookScore = Math.min(20, hookScore);

  // 2. Proof Proximity (Max 25 pts)
  let proofScore = 0;
  const proofIdx = activeSections.findIndex((s) => s.id === 'section_proof');
  const caseStudiesIdx = activeSections.findIndex((s) => s.id === 'section_case_studies');
  const earliestProofIdx = Math.min(
    proofIdx >= 0 ? proofIdx : 999,
    caseStudiesIdx >= 0 ? caseStudiesIdx : 999
  );

  if (earliestProofIdx === 1) proofScore = 25; // Immediately after Hero!
  else if (earliestProofIdx === 2) proofScore = 22; // In position 3
  else if (earliestProofIdx === 3) proofScore = 18; // In position 4
  else if (earliestProofIdx < 999) proofScore = 12; // Far below fold
  else proofScore = 4; // No proof active!

  // 3. Offer Clarity (Max 20 pts)
  let offerScore = 0;
  if (services) {
    offerScore += 8;
    if (services.headline && services.headline.length > 10) offerScore += 4;
    if (services.bodyCopy && services.bodyCopy.length > 30) offerScore += 4;
    if (services.ctaText && services.ctaText.length > 3) offerScore += 4;
  }

  // 4. Objection Readiness (Max 15 pts)
  let objectionScore = 0;
  if (faq) {
    objectionScore += 8;
    if (faq.bodyCopy && faq.bodyCopy.includes('Q:')) objectionScore += 4;
    if (hero?.trustStatement || cta?.trustStatement) objectionScore += 3;
  } else if (hero?.trustStatement || cta?.trustStatement) {
    objectionScore += 6;
  }

  // 5. CTA Friction (Max 20 pts)
  let ctaScore = 0;
  if (cta) {
    ctaScore += 8;
    if (cta.ctaText && cta.ctaText.length > 4) ctaScore += 4;
    if (cta.trustStatement && cta.trustStatement.length > 8) ctaScore += 4;
    if (cta.bodyCopy && cta.bodyCopy.length > 20) ctaScore += 4;
  }

  const total = hookScore + proofScore + offerScore + objectionScore + ctaScore;

  let ratingLabel: PortfolioConversionAudit['ratingLabel'] = 'Critical Gaps';
  let ratingColor = 'text-rose-600 bg-rose-50 border-rose-200';
  if (total >= 85) {
    ratingLabel = 'Optimal';
    ratingColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (total >= 70) {
    ratingLabel = 'Strong';
    ratingColor = 'text-blue-700 bg-blue-50 border-blue-200';
  } else if (total >= 50) {
    ratingLabel = 'Needs Optimization';
    ratingColor = 'text-amber-700 bg-amber-50 border-amber-200';
  }

  const recommendations: string[] = [];
  if (earliestProofIdx > 2) {
    recommendations.push('Move your Proof Assets or Case Studies higher (Position #2 or #3) to hook skeptical visitors immediately.');
  }
  if (!faq || !faq.isEnabled) {
    recommendations.push('Enable the FAQ & Objection Handling section to answer price, timeline, and scope concerns upfront.');
  }
  if (!cta?.trustStatement) {
    recommendations.push('Add a risk-reversal guarantee or confidentiality statement to your Final CTA button.');
  }
  if (activeSections.length < 5) {
    recommendations.push('Your portfolio is very short. Ensure you retain at least Hero, Services, Proof, and CTA.');
  }

  return {
    totalScore: total,
    ratingLabel,
    ratingColor,
    dimensionScores: {
      hookClarity: {
        score: hookScore,
        max: 20,
        label: 'Hero & Value Proposition Hook',
        tip: 'Clearly states who you help, what you deliver, and your unique mechanism in the first 5 seconds.',
      },
      proofProximity: {
        score: proofScore,
        max: 25,
        label: 'Proof Proximity & Above-the-Fold Weight',
        tip: 'Verifiable demonstration assets or STAR case studies positioned early in the scroll journey.',
      },
      offerClarity: {
        score: offerScore,
        max: 20,
        label: 'Deliverable Scope & Offer Transparency',
        tip: 'Eliminates ambiguity regarding what clients receive, turnaround speed, and engagement model.',
      },
      objectionReadiness: {
        score: objectionScore,
        max: 15,
        label: 'FAQ & Risk Reversal Handling',
        tip: 'Addresses price, time, scope, and trust hesitations before the client books a strategy call.',
      },
      ctaFriction: {
        score: ctaScore,
        max: 20,
        label: 'Conversion CTA & Booking Reassurance',
        tip: 'Action-oriented button text backed by a zero-risk guarantee or confidentiality note.',
      },
    },
    recommendations,
  };
}

export interface PortfolioTelemetry {
  activeSectionCount: number;
  totalWordCount: number;
  estimatedReadTimeMinutes: number;
  proofRatioPct: number;
  ctaTouchpoints: number;
}

export function calculatePortfolioTelemetry(sections: PortfolioBlueprintSection[]): PortfolioTelemetry {
  const active = sections.filter((s) => s.isEnabled !== false);
  let totalWords = 0;
  let proofCount = 0;
  let ctaCount = 0;

  active.forEach((sec) => {
    const text = `${sec.title} ${sec.headline} ${sec.subheadline} ${sec.bodyCopy} ${sec.ctaText} ${sec.trustStatement || ''}`;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    totalWords += words;

    if (sec.id === 'section_proof' || sec.id === 'section_case_studies' || sec.id === 'section_testimonials') {
      proofCount++;
    }
    if (sec.ctaText && sec.ctaText.trim().length > 0) {
      ctaCount++;
    }
  });

  const estimatedReadTime = Math.max(1, Math.round(totalWords / 200));
  const proofRatio = active.length > 0 ? Math.round((proofCount / active.length) * 100) : 0;

  return {
    activeSectionCount: active.length,
    totalWordCount: totalWords,
    estimatedReadTimeMinutes: estimatedReadTime,
    proofRatioPct: proofRatio,
    ctaTouchpoints: ctaCount,
  };
}

export type PortfolioGoal = 'retainer' | 'sprint' | 'consulting';

export interface ArchetypeRecommendation {
  archetypeId: string;
  archetypeName: string;
  badge: string;
  reason: string;
  funnelFocus: string;
  conversionAdvantage: string;
}

export function getRecommendedGoal(
  serviceId?: string | null,
  careerTrackId?: string | null
): PortfolioGoal {
  const s = (serviceId || '').toLowerCase();
  const c = (careerTrackId || '').toLowerCase();

  if (s.includes('consult') || s.includes('advis') || c.includes('consult') || s.includes('fractional')) {
    return 'consulting';
  }
  if (s.includes('video') || s.includes('edit') || s.includes('motion') || s.includes('dev') || s.includes('code') || s.includes('engineer')) {
    return 'sprint';
  }
  return 'retainer';
}

export function recommendArchetype(
  serviceId?: string | null,
  careerTrackId?: string | null,
  goal?: PortfolioGoal | null
): ArchetypeRecommendation {
  const s = (serviceId || '').toLowerCase();
  const c = (careerTrackId || '').toLowerCase();
  const effectiveGoal = goal || getRecommendedGoal(serviceId, careerTrackId);

  if (effectiveGoal === 'sprint') {
    if (s.includes('video') || s.includes('edit') || s.includes('motion') || s.includes('dev') || s.includes('code') || c.includes('editor')) {
      const arch = PORTFOLIO_ARCHETYPES.find((a) => a.id === 'proof_first') || PORTFOLIO_ARCHETYPES[0];
      return {
        archetypeId: arch.id,
        archetypeName: arch.name,
        badge: arch.badge,
        reason: 'Because your craft is execution-heavy and your goal is winning fast sprint projects, front-loading verified proof right below the hero hooks high-intent buyers in the first 10 seconds without wading through theory.',
        funnelFocus: arch.funnelFocus,
        conversionAdvantage: arch.conversionAdvantage,
      };
    }
    const arch = PORTFOLIO_ARCHETYPES.find((a) => a.id === 'agency_alternative') || PORTFOLIO_ARCHETYPES[2];
    return {
      archetypeId: arch.id,
      archetypeName: arch.name,
      badge: arch.badge,
      reason: 'Because sprint clients evaluate turnaround velocity against bloated agencies, transparent scope packages and direct operator access minimize procurement friction.',
      funnelFocus: arch.funnelFocus,
      conversionAdvantage: arch.conversionAdvantage,
    };
  }

  if (effectiveGoal === 'retainer') {
    if (s.includes('video') || s.includes('edit') || s.includes('retention') || s.includes('growth') || s.includes('market')) {
      const arch = PORTFOLIO_ARCHETYPES.find((a) => a.id === 'case_study_showcase') || PORTFOLIO_ARCHETYPES[3];
      return {
        archetypeId: arch.id,
        archetypeName: arch.name,
        badge: arch.badge,
        reason: 'Because high-value ongoing retainers require trust in repeatable performance, in-depth STAR case studies prove you diagnose bottlenecks and compound measurable results over time.',
        funnelFocus: arch.funnelFocus,
        conversionAdvantage: arch.conversionAdvantage,
      };
    }
    const arch = PORTFOLIO_ARCHETYPES.find((a) => a.id === 'system_architect') || PORTFOLIO_ARCHETYPES[1];
    return {
      archetypeId: arch.id,
      archetypeName: arch.name,
      badge: arch.badge,
      reason: 'Because high-value retainers demand strategic defensibility, establishing your proprietary framework upfront justifies premium monthly fees beyond generic freelancing.',
      funnelFocus: arch.funnelFocus,
      conversionAdvantage: arch.conversionAdvantage,
    };
  }

  // effectiveGoal === 'consulting'
  const arch = PORTFOLIO_ARCHETYPES.find((a) => a.id === 'system_architect') || PORTFOLIO_ARCHETYPES[1];
  return {
    archetypeId: arch.id,
    archetypeName: arch.name,
    badge: arch.badge,
    reason: 'Because advisory and consulting engagements require commanding expert authority, framing your proprietary methodology and thesis upfront proves why your strategic diagnosis is mandatory.',
    funnelFocus: arch.funnelFocus,
    conversionAdvantage: arch.conversionAdvantage,
  };
}

// ── Phase 2: Architecture Decision Layer Types & Deterministic Helpers ────────

export interface ArchitectureRationale {
  goal: PortfolioGoal;
  goalLabel: string;
  archetypeId: string;
  archetypeName: string;
  primaryStrategy: string;
  proofPlacementRationale: string;
  mechanismPlacementRationale: string;
  visitorPsychologyIntent: string;
  summaryParagraph: string;
}

export function getArchitectureRationale(
  goal: PortfolioGoal | null | undefined,
  archetypeId: string | null | undefined,
  serviceId?: string | null,
  mechanism?: string | null
): ArchitectureRationale {
  const effectiveGoal = goal || 'retainer';
  const effectiveArch = archetypeId || 'proof_first';
  const archMeta = PORTFOLIO_ARCHETYPES.find((a) => a.id === effectiveArch) || PORTFOLIO_ARCHETYPES[0];

  const goalLabels: Record<PortfolioGoal, string> = {
    retainer: 'Win High-Value Retainers',
    sprint: 'Win Fast Sprint Projects',
    consulting: 'Build Expert / Advisor Authority',
  };

  const mechName = mechanism && mechanism.trim().length > 0 ? mechanism.trim() : 'Proprietary Delivery System';

  if (effectiveGoal === 'sprint') {
    return {
      goal: 'sprint',
      goalLabel: goalLabels.sprint,
      archetypeId: effectiveArch,
      archetypeName: archMeta.name,
      primaryStrategy: 'Frictionless velocity: eliminate buyer skepticism in the first 10 seconds and clarify deliverable scope.',
      proofPlacementRationale: 'Verifiable work outputs are positioned immediately above-the-fold so prospects verify execution competence before reading narrative copy.',
      mechanismPlacementRationale: `The ${mechName} is framed as a structured, fixed-scope turnaround that delivers rapid time-to-value without agency bureaucracy.`,
      visitorPsychologyIntent: 'Convinces the buyer that you can execute immediately with zero onboarding drag or scope creep.',
      summaryParagraph: `Because your goal is to win fast sprint projects, the architecture leads with your core positioning, places tangible proof upfront, and presents clear scope packages before the CTA. This minimizes procurement friction and proves turnaround velocity.`,
    };
  }

  if (effectiveGoal === 'consulting') {
    return {
      goal: 'consulting',
      goalLabel: goalLabels.consulting,
      archetypeId: effectiveArch,
      archetypeName: archMeta.name,
      primaryStrategy: 'Advisory authority: establish deep intellectual diagnostic mastery before proposing engagement models.',
      proofPlacementRationale: 'Case studies and system demonstrations appear after thesis presentation to substantiate your methodology with real-world outcomes.',
      mechanismPlacementRationale: `The ${mechName} is positioned immediately after the Hero to prove why conventional approaches fail and why your diagnosis is mandatory.`,
      visitorPsychologyIntent: 'Transforms skepticism into conviction that your strategic diagnosis is mandatory and commands premium advisory fees.',
      summaryParagraph: `Because your goal is to build expert and advisor authority, the architecture leads with your strategic positioning, establishes the ${mechName}, and demonstrates systemic problem solving before asking for a consultation. This establishes peer-level status with executive decision-makers.`,
    };
  }

  // Default: retainer
  return {
    goal: 'retainer',
    goalLabel: goalLabels.retainer,
    archetypeId: effectiveArch,
    archetypeName: archMeta.name,
    primaryStrategy: 'Repeatable certainty: prove sustained ROI and operational stability to justify ongoing monthly fees.',
    proofPlacementRationale: 'Case studies and proof assets are sequenced after the service model to confirm you diagnose bottlenecks and compound results over time.',
    mechanismPlacementRationale: `The ${mechName} is presented as an ongoing operational engine that continuously drives measurable upside.`,
    visitorPsychologyIntent: 'Reassures stakeholders that retaining you creates predictable leverage and permanent operational capability.',
    summaryParagraph: `Because your goal is to win high-value retainers, the architecture leads with your positioning, establishes your mechanism, and introduces verified case studies before presenting retainer tiers. This reduces perceived risk before asking for an ongoing commitment.`,
  };
}

export interface SectionPlacementMetadata {
  id: string;
  funnelRole: {
    phase: 'Top of Funnel' | 'Mid Funnel' | 'Bottom Funnel';
    label: string;
    color: string;
  };
  priority: {
    level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'OPTIONAL';
    color: string;
  };
  placementReason: string;
}

export function getSectionPlacementMetadata(
  sectionId: string,
  archetypeId?: string | null,
  goal?: PortfolioGoal | null
): SectionPlacementMetadata {
  const isProofFirst = archetypeId === 'proof_first' || goal === 'sprint';
  const isConsulting = archetypeId === 'system_architect' || goal === 'consulting';
  const isCaseStudy = archetypeId === 'case_study_showcase' || goal === 'retainer';

  switch (sectionId) {
    case 'section_hero':
      return {
        id: 'section_hero',
        funnelRole: {
          phase: 'Top of Funnel',
          label: 'Top of Funnel : Hook & Orient',
          color: 'bg-blue-50 text-[#0058be] border-blue-200',
        },
        priority: {
          level: 'CRITICAL',
          color: 'bg-rose-50 text-rose-700 border-rose-200',
        },
        placementReason: 'Anchors first impression in under 5 seconds. Answers who you serve, your exact mechanism, and the primary business transformation.',
      };

    case 'section_about':
      return {
        id: 'section_about',
        funnelRole: {
          phase: isConsulting ? 'Top of Funnel' : 'Mid Funnel',
          label: isConsulting ? 'Top of Funnel : Thesis & Mechanism' : 'Mid Funnel : Operator Thesis',
          color: isConsulting ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-neutral-50 text-neutral-700 border-neutral-200',
        },
        priority: {
          level: isConsulting ? 'HIGH' : 'OPTIONAL',
          color: isConsulting ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-neutral-100 text-neutral-600 border-neutral-200',
        },
        placementReason: isConsulting
          ? 'Positioned early to explain why traditional methods fail and why your proprietary framework is mandatory.'
          : 'Shares your practitioner background and operating ethos after proof has established initial credibility.',
      };

    case 'section_services':
      return {
        id: 'section_services',
        funnelRole: {
          phase: 'Mid Funnel',
          label: 'Mid Funnel : Scope & Engagement',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        priority: {
          level: 'HIGH',
          color: 'bg-rose-50 text-rose-700 border-rose-200',
        },
        placementReason: 'Clarifies scope tiers, deliverables, and turnaround velocity so prospects know exactly how to engage without pricing ambiguity.',
      };

    case 'section_case_studies':
      return {
        id: 'section_case_studies',
        funnelRole: {
          phase: 'Mid Funnel',
          label: 'Mid Funnel : STAR Diagnostic Proof',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        priority: {
          level: isCaseStudy ? 'HIGH' : 'MEDIUM',
          color: isCaseStudy ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200',
        },
        placementReason: isCaseStudy
          ? 'Front-loaded to show detailed Situation-Task-Action-Result breakdowns of real client transformations.'
          : 'Provides concrete narrative evidence demonstrating problem-solving under real client constraints.',
      };

    case 'section_proof':
      return {
        id: 'section_proof',
        funnelRole: {
          phase: 'Mid Funnel',
          label: isProofFirst ? 'Top / Mid Funnel : Verifiable Proof' : 'Mid Funnel : Proof Hub',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        priority: {
          level: 'CRITICAL',
          color: 'bg-rose-50 text-rose-700 border-rose-200',
        },
        placementReason: isProofFirst
          ? 'Placed directly below the hero to eliminate buyer skepticism in the first 10 seconds before reading pitch claims.'
          : 'Provides tangible work outputs, repositories, live tools, and design files to validate your claims.',
      };

    case 'section_testimonials':
      return {
        id: 'section_testimonials',
        funnelRole: {
          phase: 'Bottom Funnel',
          label: 'Bottom Funnel : Peer Validation',
          color: 'bg-purple-50 text-purple-700 border-purple-200',
        },
        priority: {
          level: 'MEDIUM',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
        },
        placementReason: 'Third-party peer endorsements confirm that others in your target market achieved their desired outcome.',
      };

    case 'section_authority':
      return {
        id: 'section_authority',
        funnelRole: {
          phase: 'Bottom Funnel',
          label: 'Bottom Funnel : Industry Stature',
          color: 'bg-purple-50 text-purple-700 border-purple-200',
        },
        priority: {
          level: isConsulting ? 'MEDIUM' : 'OPTIONAL',
          color: 'bg-neutral-100 text-neutral-600 border-neutral-200',
        },
        placementReason: 'Podcasts, press, and thought leadership reinforce high-status authority before the buying decision.',
      };

    case 'section_faq':
      return {
        id: 'section_faq',
        funnelRole: {
          phase: 'Bottom Funnel',
          label: 'Bottom Funnel : Objection Killer',
          color: 'bg-purple-50 text-purple-700 border-purple-200',
        },
        priority: {
          level: 'HIGH',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
        },
        placementReason: 'Positioned right above the final CTA to resolve price, scope, timeline, and risk reversal objections before the call.',
      };

    case 'section_cta':
    default:
      return {
        id: 'section_cta',
        funnelRole: {
          phase: 'Bottom Funnel',
          label: 'Bottom Funnel : Low-Friction Booking',
          color: 'bg-purple-50 text-purple-700 border-purple-200',
        },
        priority: {
          level: 'CRITICAL',
          color: 'bg-rose-50 text-rose-700 border-rose-200',
        },
        placementReason: 'Final focused conversion trigger. Removes buying resistance with transparent next steps and calendar access.',
      };
  }
}

export interface ArchitectureDiff {
  isCustomized: boolean;
  orderChangesCount: number;
  visibilityChangesCount: number;
  totalStructuralChanges: number;
  statusLabel: string;
  hasContentCustomizations: boolean;
}

export function diffArchitecture(
  currentSections: PortfolioBlueprintSection[],
  recommendedOrder: string[]
): ArchitectureDiff {
  let orderChangesCount = 0;
  let visibilityChangesCount = 0;
  let hasContentCustomizations = false;

  const currentOrder = currentSections.map((s) => s.id);
  const recommendedEnabledSet = new Set(recommendedOrder);

  // Compare active order against recommended order
  currentSections.forEach((sec, idx) => {
    const recIdx = recommendedOrder.indexOf(sec.id);
    if (recIdx !== -1 && recIdx !== idx) {
      orderChangesCount++;
    }

    const shouldBeEnabled = recommendedEnabledSet.has(sec.id);
    const isActuallyEnabled = sec.isEnabled !== false;
    if (shouldBeEnabled !== isActuallyEnabled) {
      visibilityChangesCount++;
    }

    if (
      sec.isCustomized ||
      sec.isHeadlineCustomized ||
      sec.isSubheadlineCustomized ||
      sec.isBodyCustomized ||
      sec.isCtaCustomized
    ) {
      hasContentCustomizations = true;
    }
  });

  const totalStructuralChanges = orderChangesCount + visibilityChangesCount;
  const isCustomized = totalStructuralChanges > 0;

  const statusLabel = isCustomized
    ? `Customized Structure (${totalStructuralChanges} change${totalStructuralChanges === 1 ? '' : 's'} from recommendation)`
    : 'Recommended Architecture Active';

  return {
    isCustomized,
    orderChangesCount,
    visibilityChangesCount,
    totalStructuralChanges,
    statusLabel,
    hasContentCustomizations,
  };
}

export interface ArchitectureWarning {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  sectionId?: string;
  title: string;
  message: string;
  actionHint?: string;
}

export function validateArchitecture(
  sections: PortfolioBlueprintSection[],
  archetypeId?: string | null,
  goal?: PortfolioGoal | null
): ArchitectureWarning[] {
  const warnings: ArchitectureWarning[] = [];

  if (!sections || sections.length === 0) return warnings;

  // 1. Hero Protection Validation
  const heroIndex = sections.findIndex((s) => s.id === 'section_hero');
  const heroSection = sections[heroIndex];

  if (heroIndex !== 0 || !heroSection || heroSection.isEnabled === false) {
    warnings.push({
      id: 'warn_hero_compromised',
      severity: 'critical',
      sectionId: 'section_hero',
      title: 'Hero Section Compromised',
      message: 'The Hero section must remain enabled and locked at Position #1 to orient visitors and establish core positioning.',
      actionHint: 'Lock Hero at Position 1 and ensure it is enabled.',
    });
  }

  // 2. CTA Validation
  const ctaIndex = sections.findIndex((s) => s.id === 'section_cta');
  const ctaSection = sections[ctaIndex];

  if (!ctaSection || ctaSection.isEnabled === false) {
    warnings.push({
      id: 'warn_cta_disabled',
      severity: 'critical',
      sectionId: 'section_cta',
      title: 'Conversion CTA Inactive',
      message: 'Your portfolio has no active call-to-action. High-intent visitors will have no direct path to schedule a call or request scope.',
      actionHint: 'Enable the Final CTA section.',
    });
  } else if (ctaIndex < sections.length - 2) {
    // Check if critical sections are below CTA
    const sectionsAfterCta = sections.slice(ctaIndex + 1).filter((s) => s.isEnabled !== false);
    const hasCoreAfterCta = sectionsAfterCta.some((s) =>
      ['section_proof', 'section_case_studies', 'section_services'].includes(s.id)
    );

    if (hasCoreAfterCta) {
      warnings.push({
        id: 'warn_cta_premature',
        severity: 'warning',
        sectionId: 'section_cta',
        title: 'Core Proof Placed After Final CTA',
        message: 'Key evaluation sections (Proof, Case Studies, or Services) appear after your primary CTA where 60%+ of visitors drop off.',
        actionHint: 'Position the Final CTA near the bottom of your sequence.',
      });
    }
  }

  // 3. Proof Proximity Validation
  const proofIndex = sections.findIndex((s) => s.id === 'section_proof' && s.isEnabled !== false);
  const isProofSensitive = archetypeId === 'proof_first' || goal === 'sprint';

  if (isProofSensitive && proofIndex > 2) {
    warnings.push({
      id: 'warn_proof_delayed',
      severity: 'warning',
      sectionId: 'section_proof',
      title: 'Proof Position Delayed',
      message: `For your ${goal === 'sprint' ? 'Fast Sprint' : 'Proof-First'} strategy, proof is placed too late (Position #${proofIndex + 1}). High-intent buyers skip long text to inspect real samples.`,
      actionHint: 'Move Verifiable Proof to Position #2 or #3.',
    });
  }

  // 4. Mechanism Visibility for Advisory/System Architect
  if (archetypeId === 'system_architect' || goal === 'consulting') {
    const aboutSection = sections.find((s) => s.id === 'section_about');
    if (!aboutSection || aboutSection.isEnabled === false) {
      warnings.push({
        id: 'warn_mechanism_missing',
        severity: 'warning',
        sectionId: 'section_about',
        title: 'Proprietary Mechanism Hidden',
        message: 'Advisory and consulting clients require your unique mechanism and thesis upfront to justify premium executive rates.',
        actionHint: 'Enable the Authority Story & Mechanism section.',
      });
    }
  }

  // 5. Active Section Depth
  const activeCount = sections.filter((s) => s.isEnabled !== false).length;
  if (activeCount < 4) {
    warnings.push({
      id: 'warn_thin_flow',
      severity: 'warning',
      title: 'Thin Conversion Flow',
      message: `Only ${activeCount} sections are active. High-ticket B2B buyers require positioning, verifiable proof, clear scope, and risk reversal.`,
      actionHint: 'Enable at least 4–5 core sections for adequate conversion depth.',
    });
  }

  return warnings;
}

export interface SectionStrategicGuidance {
  id: string;
  purpose: string;
  conversionRole: string;
  contentDirection: string;
  visualRecommendation: string;
  whatToAvoid: string[];
}

export function getSectionStrategicGuidance(sectionId: string): SectionStrategicGuidance {
  switch (sectionId) {
    case 'section_hero':
      return {
        id: 'section_hero',
        purpose: 'Establish immediate category clarity, target audience alignment, and primary transformation in under 5 seconds.',
        conversionRole: 'Hook & Orient',
        contentDirection: 'State the high-value outcome, target audience, and proprietary mechanism without corporate buzzwords or vague fluff.',
        visualRecommendation: 'High-contrast minimalist layout with strong typography, primary CTA button, trust badges, and an interactive sample/schematic card.',
        whatToAvoid: [
          'Generic slogans ("We build the future", "Crafting digital experiences")',
          'Vague value propositions without a specific target market',
          'Hiding primary CTA below fold without immediate orientation',
          'Parallax gimmicks or decorative 3D models that slow down load speed',
        ],
      };

    case 'section_about':
      return {
        id: 'section_about',
        purpose: 'Establish practitioner thesis, diagnosis of industry failures, and introduce your proprietary mechanism.',
        conversionRole: 'Build Tension & Differentiate',
        contentDirection: 'Expose why conventional approaches in your niche fail, define the architectural root cause, and present your mechanism as the inevitable solution.',
        visualRecommendation: 'Mechanism breakdown diagram, Before/After comparison matrix, or 3-pillar system architecture schematic.',
        whatToAvoid: [
          'Generic resume history or chronological autobiography ("I started in 2018...")',
          'Soft skill listings ("Passionate problem solver with great communication")',
          'Excessive narrative walls of text without architectural callout cards',
          'Unsubstantiated guru claims without structural thesis',
        ],
      };

    case 'section_services':
      return {
        id: 'section_services',
        purpose: 'Clarify tangible deliverables, scope boundaries, turnaround timeline, and engagement mechanics.',
        conversionRole: 'Scope Clarity & Engagement Tiers',
        contentDirection: 'Present structured engagement packages with explicit deliverables, velocity commitments, and scope protection limits.',
        visualRecommendation: 'Structured 2-3 column deliverable cards with bulleted deliverables, timeline badges, and fixed/tiered investment indicators.',
        whatToAvoid: [
          'Open-ended hourly billing without deliverable boundaries',
          'Vague service menus ("Design, Development, Strategy, Marketing")',
          'Hiding timeline turnaround expectations',
          'Omitting scope limits or communication SLAs',
        ],
      };

    case 'section_case_studies':
      return {
        id: 'section_case_studies',
        purpose: 'Demonstrate deep analytical problem solving through structured Situation-Task-Action-Result breakdowns.',
        conversionRole: 'Diagnostic Proof & Methodology Validation',
        contentDirection: 'Detail the client initial constraint, strategic hypothesis, implementation steps, and concrete business transformation.',
        visualRecommendation: 'STAR architecture cards with diagnostic constraint callouts, architectural screenshots/code, and verified metric callouts.',
        whatToAvoid: [
          'Vague visual galleries without business context or constraints',
          'Unverified vanity metrics without baseline comparison ("10x growth")',
          'Focusing on aesthetics rather than decision-making and business impact',
          'Omitting the client starting point and core tension',
        ],
      };

    case 'section_proof':
      return {
        id: 'section_proof',
        purpose: 'Provide tangible, inspectable execution artifacts that instantly prove technical or operational mastery.',
        conversionRole: 'Immediate Skepticism Elimination',
        contentDirection: 'Provide direct links or live embeds to real deliverables: code repositories, design systems, recorded walkthroughs, or client deliverables.',
        visualRecommendation: 'Proof Vault cards with asset format tags (Repository, Figma File, Loom Walkthrough, System Architecture), verification badges, and inspect buttons.',
        whatToAvoid: [
          'Fabricated client logos or mockups presented as real engagements',
          'Generic stock illustrations or placeholder imagery',
          'Static screenshots of work that cannot be verified or inspected',
          'Claims of enterprise work without verifiable artifacts',
        ],
      };

    case 'section_testimonials':
      return {
        id: 'section_testimonials',
        purpose: 'Leverage peer validation to demonstrate reliability, communication quality, and outcome delivery.',
        conversionRole: 'Peer Validation & Social Proof',
        contentDirection: 'Feature concise client quotes highlighting specific deliverables, turnaround speed, and working experience.',
        visualRecommendation: 'Verified testimonial cards with client name, role, company title, LinkedIn link placeholder, and highlighted quote takeaways.',
        whatToAvoid: [
          'Anonymous or initials-only quotes ("A.P., Tech Founder")',
          'Vague praise without outcome focus ("Great guy, loved working together!")',
          'Unverified quotes copied from unverified templates',
          'Giant quote carousels that hide testimonials behind clicks',
        ],
      };

    case 'section_authority':
      return {
        id: 'section_authority',
        purpose: 'Reinforce domain stature and category leadership through public writing, talks, open source, or media.',
        conversionRole: 'Status Reinforcement & Category Authority',
        contentDirection: 'Curate key industry appearances: technical essays, podcast episodes, community contributions, or industry benchmark guides.',
        visualRecommendation: 'Authority artifact grid with media publication logos, topic tags, external read links, and key citation snippets.',
        whatToAvoid: [
          'Self-congratulatory vanity awards from unverified sources',
          'Irrelevant media coverage that does not align with your core offer',
          'Excessive links that divert visitors away from the primary conversion path',
          'Outdated or inactive thought leadership links',
        ],
      };

    case 'section_faq':
      return {
        id: 'section_faq',
        purpose: 'Preemptively resolve final buying hesitations, risk anxieties, pricing concerns, and workflow questions.',
        conversionRole: 'Risk Reversal & Friction Elimination',
        contentDirection: 'Directly address the top 4-6 high-friction client concerns: turnaround time, revision rounds, scope creep handling, and communication cadences.',
        visualRecommendation: 'Clean accordion or 2-column Q&A grid with high-contrast questions and concise, definitive answers.',
        whatToAvoid: [
          'Defensive or evasive answers regarding scope, revisions, or refunds',
          'Trivial FAQs that do not impact the buying decision ("What software do you use?")',
          'Dense multi-paragraph essay answers that obscure key facts',
          'FAQ sections positioned above proof or offer tiers',
        ],
      };

    case 'section_cta':
    default:
      return {
        id: 'section_cta',
        purpose: 'Provide a single, clear, low-friction next step for serious prospective clients to initiate engagement.',
        conversionRole: 'Final Conversion & Pipeline Entry',
        contentDirection: 'State exactly what happens after clicking, expected preparation, and call expectations without pressure tactics.',
        visualRecommendation: 'High-contrast focused conversion block with calendar scheduler placeholder, direct booking button, email option, and zero-risk guarantee badge.',
        whatToAvoid: [
          'Multiple competing conversion actions (e.g. "Buy Now OR Join Newsletter OR Follow on Twitter")',
          'High-pressure artificial countdown timers or scarcity gimmicks',
          'Complex multi-step intake forms that create drop-off friction',
          'Hiding turnaround response time or meeting length expectations',
        ],
      };
  }
}

// ── Visitor Journey & Conversion Validation Engine ──────────────────────────

export type VisitorFindingCategory =
  | 'CLARITY'
  | 'TRUST'
  | 'FLOW'
  | 'PROOF'
  | 'OFFER'
  | 'FRICTION'
  | 'CTA';

export interface VisitorFinding {
  id: string;
  category: VisitorFindingCategory;
  severity: 'high' | 'medium' | 'low';
  title: string;
  explanation: string;
  recommendedAction: string;
  relatedSectionId?: string;
}

export interface VisitorJourneyAudit {
  overallStatus: 'Strong' | 'Needs Attention' | 'High Friction';
  statusColor: string;
  summary: string;
  findings: VisitorFinding[];
  activeSectionsCount: number;
  hasHero: boolean;
  hasProof: boolean;
  hasServices: boolean;
  hasCTA: boolean;
}

export function validateVisitorJourney(
  sections: PortfolioBlueprintSection[],
  archetypeId?: string | null,
  goal?: PortfolioGoal | null
): VisitorJourneyAudit {
  const findings: VisitorFinding[] = [];
  const activeSections = (sections || []).filter((s) => s.isEnabled !== false);

  const heroIndex = activeSections.findIndex((s) => s.id === 'section_hero');
  const proofIndex = activeSections.findIndex((s) => s.id === 'section_proof');
  const caseStudiesIndex = activeSections.findIndex((s) => s.id === 'section_case_studies');
  const servicesIndex = activeSections.findIndex((s) => s.id === 'section_services');
  const aboutIndex = activeSections.findIndex((s) => s.id === 'section_about');
  const faqIndex = activeSections.findIndex((s) => s.id === 'section_faq');
  const ctaIndex = activeSections.findIndex((s) => s.id === 'section_cta');
  const testimonialsIndex = activeSections.findIndex((s) => s.id === 'section_testimonials');
  const authorityIndex = activeSections.findIndex((s) => s.id === 'section_authority');

  const earliestProofIndex = Math.min(
    proofIndex >= 0 ? proofIndex : 999,
    caseStudiesIndex >= 0 ? caseStudiesIndex : 999
  );

  const heroSection = activeSections[heroIndex];
  const ctaSection = activeSections[ctaIndex];
  const servicesSection = activeSections[servicesIndex];

  // 1. CLARITY: Hero Orientation & Positioning
  if (heroIndex !== 0 || !heroSection) {
    findings.push({
      id: 'vis_hero_missing',
      category: 'CLARITY',
      severity: 'high',
      title: 'Hero Orientation Compromised',
      explanation: 'Visitors arriving at your portfolio lack an immediate above-the-fold hook to understand who you serve and what core business problem you solve.',
      recommendedAction: 'Ensure the Hero section is active at Position #1.',
      relatedSectionId: 'section_hero',
    });
  } else {
    if (!heroSection.headline || heroSection.headline.length < 12) {
      findings.push({
        id: 'vis_hero_headline_thin',
        category: 'CLARITY',
        severity: 'medium',
        title: 'Hero Headline Lacks Specificity',
        explanation: 'The current hero headline is very brief and may fail to communicate your specialized outcome in the first 5 seconds.',
        recommendedAction: 'Sharpen the hero headline with explicit market and outcome positioning.',
        relatedSectionId: 'section_hero',
      });
    }
  }

  // 2. PROOF & TRUST: Proof Proximity relative to Goal & Archetype
  const isProofSensitive = archetypeId === 'proof_first' || goal === 'sprint';
  const isAdvisory = archetypeId === 'system_architect' || goal === 'consulting';
  const isCaseStudyFocus = archetypeId === 'case_study_showcase';

  if (earliestProofIndex === 999) {
    findings.push({
      id: 'vis_proof_none',
      category: 'PROOF',
      severity: 'high',
      title: 'No Active Proof or Case Studies',
      explanation: 'Visitors have no tangible demonstration, repository, or client case study to verify that your execution matches your claims.',
      recommendedAction: 'Enable the Verifiable Proof or Case Studies section.',
      relatedSectionId: 'section_proof',
    });
  } else if (isProofSensitive && earliestProofIndex > 2) {
    findings.push({
      id: 'vis_proof_delayed_sprint',
      category: 'PROOF',
      severity: 'high',
      title: 'Proof Appears Too Late for Sprint Evaluation',
      explanation: `For your Sprint & Execution focus, buyers want immediate proof before reading long philosophy. Proof appears at Position #${earliestProofIndex + 1}.`,
      recommendedAction: 'Move Verifiable Proof or Case Studies to Position #2 or #3.',
      relatedSectionId: 'section_proof',
    });
  } else if (isCaseStudyFocus && caseStudiesIndex > 2) {
    findings.push({
      id: 'vis_case_study_buried',
      category: 'PROOF',
      severity: 'medium',
      title: 'STAR Case Studies Positioned Too Deep',
      explanation: 'Your chosen archetype is the Deep Case Study Showcase, but your in-depth case studies appear deep in the scroll journey.',
      recommendedAction: 'Move Case Studies immediately after the Hero or Authority thesis.',
      relatedSectionId: 'section_case_studies',
    });
  } else if (earliestProofIndex <= 2) {
    // Healthy proof proximity
  }

  // 3. TRUST & AUTHORITY: Testimonials & Peer Validation
  if (testimonialsIndex < 0 && authorityIndex < 0) {
    findings.push({
      id: 'vis_peer_validation_missing',
      category: 'TRUST',
      severity: 'low',
      title: 'Absence of Third-Party Validation',
      explanation: 'While self-evident proof is strong, client endorsements or published authority artifacts help reassure risk-averse enterprise buyers.',
      recommendedAction: 'Consider enabling Testimonials or Industry Stature if verified assets exist.',
      relatedSectionId: 'section_testimonials',
    });
  }

  // 4. FLOW & MECHANISM: Goal-specific ordering
  if (isAdvisory) {
    if (aboutIndex < 0) {
      findings.push({
        id: 'vis_mechanism_absent_consulting',
        category: 'FLOW',
        severity: 'high',
        title: 'Proprietary Mechanism & Thesis Omitted',
        explanation: 'High-ticket advisory clients buy your strategic lens and unique framework. Without an Authority Thesis/About section, you appear as an execution commodity.',
        recommendedAction: 'Enable the Authority Story & Mechanism section.',
        relatedSectionId: 'section_about',
      });
    } else if (aboutIndex > 3) {
      findings.push({
        id: 'vis_mechanism_late',
        category: 'FLOW',
        severity: 'medium',
        title: 'Strategic Mechanism Delayed',
        explanation: 'In consulting engagements, explaining why conventional approaches fail is critical before presenting service packages.',
        recommendedAction: 'Position Authority Story & Mechanism before Services.',
        relatedSectionId: 'section_about',
      });
    }
  }

  // 5. OFFER: Deliverable Scope Clarity
  if (servicesIndex < 0) {
    findings.push({
      id: 'vis_offer_missing',
      category: 'OFFER',
      severity: 'high',
      title: 'No Clear Scope or Service Packages',
      explanation: 'Visitors cannot determine how to engage, what deliverables are included, or expected implementation velocity.',
      recommendedAction: 'Enable the Services & Engagement Tiers section.',
      relatedSectionId: 'section_services',
    });
  } else if (servicesSection) {
    if (!servicesSection.bodyCopy || servicesSection.bodyCopy.length < 25) {
      findings.push({
        id: 'vis_offer_ambiguous',
        category: 'OFFER',
        severity: 'medium',
        title: 'Service Scope Narrative Needs Detail',
        explanation: 'Engagement deliverables are sparsely detailed. Transparent scope boundaries reduce procurement hesitation.',
        recommendedAction: 'Detail deliverable rounds and turnaround speed in the Services section.',
        relatedSectionId: 'section_services',
      });
    }
  }

  // 6. FRICTION: Objection Handling & FAQ
  if (faqIndex < 0) {
    findings.push({
      id: 'vis_objections_unaddressed',
      category: 'FRICTION',
      severity: 'medium',
      title: 'Buying Hesitations & Objections Unhandled',
      explanation: 'High-intent clients dropping off before booking usually have unanswered questions regarding turnaround timeline, scope changes, or communication protocol.',
      recommendedAction: 'Enable the FAQ & Objection Handling section right before the CTA.',
      relatedSectionId: 'section_faq',
    });
  } else if (ctaIndex >= 0 && faqIndex > ctaIndex) {
    findings.push({
      id: 'vis_faq_after_cta',
      category: 'FRICTION',
      severity: 'medium',
      title: 'FAQ Positioned Below Final CTA',
      explanation: 'Visitors encounter the conversion trigger before their risk anxieties and workflow questions are addressed.',
      recommendedAction: 'Move FAQ immediately above the Final CTA block.',
      relatedSectionId: 'section_faq',
    });
  }

  // 7. CTA: Placement & Conversion Trigger
  if (ctaIndex < 0 || !ctaSection) {
    findings.push({
      id: 'vis_cta_missing',
      category: 'CTA',
      severity: 'high',
      title: 'Missing Direct Conversion Next Step',
      explanation: 'The portfolio has no concluding conversion trigger. A visitor who is convinced has no direct path to schedule a discovery or architecture sprint.',
      recommendedAction: 'Enable the Final CTA section.',
      relatedSectionId: 'section_cta',
    });
  } else {
    if (ctaIndex < activeSections.length - 2) {
      findings.push({
        id: 'vis_cta_premature',
        category: 'CTA',
        severity: 'medium',
        title: 'Primary Conversion CTA Placed Too Early',
        explanation: 'Several core evaluation sections appear after your main CTA block, where 65%+ of visitors cease scrolling.',
        recommendedAction: 'Position the Final CTA near the bottom of your sequence.',
        relatedSectionId: 'section_cta',
      });
    }

    if (goal === 'retainer' && (!ctaSection.trustStatement || ctaSection.trustStatement.length < 5)) {
      findings.push({
        id: 'vis_retainer_trust_gap',
        category: 'CTA',
        severity: 'low',
        title: 'CTA Lacks Risk Reversal Guarantee',
        explanation: 'Retainer partnerships require mutual commitment. A subtle confidentiality or sprint pilot guarantee increases conversion on booking.',
        recommendedAction: 'Add a trust guarantee line to your CTA block.',
        relatedSectionId: 'section_cta',
      });
    }
  }

  // Determine Overall Status
  const highCount = findings.filter((f) => f.severity === 'high').length;
  const mediumCount = findings.filter((f) => f.severity === 'medium').length;

  let overallStatus: VisitorJourneyAudit['overallStatus'] = 'Strong';
  let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let summary = 'Your portfolio architecture flows smoothly from positioning to proof, scope, and conversion.';

  if (highCount > 0) {
    overallStatus = 'High Friction';
    statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
    summary = `Identified ${highCount} critical friction point${highCount === 1 ? '' : 's'} that may cause high-intent prospects to drop off before booking.`;
  } else if (mediumCount > 0) {
    overallStatus = 'Needs Attention';
    statusColor = 'text-amber-800 bg-amber-50 border-amber-200';
    summary = `Good foundational flow with ${mediumCount} optimization opportunit${mediumCount === 1 ? 'y' : 'ies'} to strengthen trust and reduce friction.`;
  }

  return {
    overallStatus,
    statusColor,
    summary,
    findings,
    activeSectionsCount: activeSections.length,
    hasHero: heroIndex >= 0,
    hasProof: earliestProofIndex < 999,
    hasServices: servicesIndex >= 0,
    hasCTA: ctaIndex >= 0,
  };
}
