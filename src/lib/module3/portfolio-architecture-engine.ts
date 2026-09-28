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
  let proofScore;
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

  // 1. CLARITY: Hero Orientation
  if (heroIndex !== 0 || !heroSection) {
    findings.push({
      id: 'vis_hero_missing',
      category: 'CLARITY',
      severity: 'high',
      title: 'Hero Orientation Compromised',
      explanation: 'Visitors arriving at your portfolio lack an immediate above-the-fold anchor to understand who you serve and what core business outcome you engineer.',
      recommendedAction: 'Ensure the Hero section remains active at Position #1.',
      relatedSectionId: 'section_hero',
    });
  } else if (!heroSection.headline || heroSection.headline.trim().length < 12) {
    findings.push({
      id: 'vis_hero_headline_thin',
      category: 'CLARITY',
      severity: 'medium',
      title: 'Hero Value Proposition Could Be Sharper',
      explanation: 'The current hero headline is very concise and may leave incoming prospects uncertain about your specific niche outcome.',
      recommendedAction: 'State the specific market outcome and mechanism directly in your hero headline.',
      relatedSectionId: 'section_hero',
    });
  }

  // 2. CTA: Placement & Flow
  if (ctaIndex < 0 || !ctaSection) {
    findings.push({
      id: 'vis_cta_missing',
      category: 'CTA',
      severity: 'high',
      title: 'No Direct Path to Next Step',
      explanation: 'The portfolio lacks a clear call-to-action block. Prospective clients who are convinced have no direct conversion trigger to schedule a consultation or request scope.',
      recommendedAction: 'Enable the Final CTA section to guide high-intent prospects toward a conversation.',
      relatedSectionId: 'section_cta',
    });
  } else if (ctaIndex < activeSections.length - 2) {
    findings.push({
      id: 'vis_cta_premature',
      category: 'CTA',
      severity: 'medium',
      title: 'Core Sections Positioned After Primary CTA',
      explanation: 'Several evaluative sections appear below your primary call-to-action, where most visitors naturally stop scrolling.',
      recommendedAction: 'Position the primary conversion trigger near the conclusion of the visitor journey.',
      relatedSectionId: 'section_cta',
    });
  }

  // 3. PROOF TIMING & WEIGHT (Strategic Tendency based on Archetype / Goal)
  const isProofSensitive = archetypeId === 'proof_first' || goal === 'sprint';
  const isConsulting = archetypeId === 'system_architect' || goal === 'consulting';
  const isCaseStudyFocus = archetypeId === 'case_study_showcase';

  if (earliestProofIndex === 999) {
    findings.push({
      id: 'vis_proof_none',
      category: 'PROOF',
      severity: 'high',
      title: 'No Concrete Evidence or Case Studies Active',
      explanation: 'The portfolio relies purely on verbal claims without concrete work artifacts, technical demonstrations, or case study narratives.',
      recommendedAction: 'Enable either Verifiable Proof or Case Studies to validate your execution capability.',
      relatedSectionId: 'section_proof',
    });
  } else if (isProofSensitive && earliestProofIndex > 3) {
    findings.push({
      id: 'vis_proof_delayed_sprint',
      category: 'PROOF',
      severity: 'medium',
      title: 'Proof Appears Relatively Late for a Proof-Led Journey',
      explanation: `Your chosen strategy prioritizes rapid demonstration, but verifiable evidence appears at Position #${earliestProofIndex + 1}.`,
      recommendedAction: 'Consider moving Verifiable Proof or Case Studies higher (Position #2 or #3) to hook skeptical visitors earlier.',
      relatedSectionId: 'section_proof',
    });
  } else if (isCaseStudyFocus && caseStudiesIndex > 3) {
    findings.push({
      id: 'vis_case_study_buried',
      category: 'PROOF',
      severity: 'medium',
      title: 'STAR Case Studies Positioned Relatively Deep',
      explanation: 'Your chosen archetype emphasizes deep case study teardowns, but your detailed narratives appear late in the sequence.',
      recommendedAction: 'Consider placing Case Studies closer to the top to anchor your problem-solving depth.',
      relatedSectionId: 'section_case_studies',
    });
  }

  // 4. GOAL-SPECIFIC FRICTION (Retainer, Sprint, Consulting)
  if (goal === 'retainer') {
    // Retainer portfolios benefit from ongoing partnership logic and trust before high commitment
    if (aboutIndex < 0 && testimonialsIndex < 0 && authorityIndex < 0) {
      findings.push({
        id: 'vis_retainer_ongoing_value',
        category: 'TRUST',
        severity: 'medium',
        title: 'Ongoing Partnership Logic Could Be Stronger',
        explanation: 'The portfolio explains what you deliver, but lacks narrative context on your working philosophy, operating cadence, or why an ongoing relationship produces superior ROI.',
        recommendedAction: 'Consider including an Authority Story or working model section to demonstrate how you integrate with client teams over time.',
        relatedSectionId: 'section_about',
      });
    }

    // Check if CTA asks for large commitment before proof is presented
    if (earliestProofIndex !== 999 && ctaIndex < earliestProofIndex) {
      findings.push({
        id: 'vis_retainer_cta_before_proof',
        category: 'FLOW',
        severity: 'medium',
        title: 'Call-to-Action Precedes Substantive Proof',
        explanation: 'Asking for a retainer-level discussion before presenting concrete proof can increase prospect hesitation.',
        recommendedAction: 'Ensure key evidence or case studies are visible before inviting long-term partnership conversations.',
        relatedSectionId: 'section_cta',
      });
    }
  } else if (goal === 'sprint') {
    // Sprint portfolios need fast clarity on deliverables and speed
    if (servicesIndex < 0) {
      findings.push({
        id: 'vis_sprint_scope_missing',
        category: 'OFFER',
        severity: 'high',
        title: 'Scope Boundaries & Deliverables Unclear for Sprint Evaluation',
        explanation: 'Sprint clients buy rapid, focused execution. Without an active Services section, turnaround velocity and included deliverables remain ambiguous.',
        recommendedAction: 'Enable the Services section to clarify sprint packages and turnaround expectations.',
        relatedSectionId: 'section_services',
      });
    }
  } else if (isConsulting) {
    // Consulting portfolios need strategic methodology and thesis
    if (aboutIndex < 0) {
      findings.push({
        id: 'vis_mechanism_absent_consulting',
        category: 'FLOW',
        severity: 'medium',
        title: 'Strategic Mechanism Could Strengthen Advisory Positioning',
        explanation: 'Advisory and consulting clients evaluate your strategic lens and unique framework. Without an Authority Story/Thesis section, your positioning may lean heavily on execution.',
        recommendedAction: 'Consider highlighting your unique methodology or mechanism to justify premium advisory fees.',
        relatedSectionId: 'section_about',
      });
    } else if (servicesIndex >= 0 && aboutIndex > servicesIndex) {
      findings.push({
        id: 'vis_mechanism_after_services_consulting',
        category: 'FLOW',
        severity: 'low',
        title: 'Methodology Appears After Engagement Tiers',
        explanation: 'In strategic advisory scenarios, explaining why conventional solutions fail before presenting service tiers helps establish framework authority.',
        recommendedAction: 'Consider positioning your Authority Story & Mechanism ahead of Services.',
        relatedSectionId: 'section_about',
      });
    }
  }

  // 5. OFFER COMPREHENSION: Deliverable clarity
  if (servicesIndex >= 0 && servicesSection) {
    if (!servicesSection.bodyCopy || servicesSection.bodyCopy.trim().length < 25) {
      findings.push({
        id: 'vis_offer_brief',
        category: 'OFFER',
        severity: 'low',
        title: 'Deliverable Scope Could Be More Explicit',
        explanation: 'Engagement deliverables are concisely described. Adding explicit detail regarding turnaround cycles or deliverables reduces procurement questions.',
        recommendedAction: 'Expand on what is included and turnaround expectations in the Services section.',
        relatedSectionId: 'section_services',
      });
    }
  }

  // 6. FRICTION: Objection Preemption
  if (faqIndex < 0 && activeSections.length >= 5) {
    findings.push({
      id: 'vis_objections_unhandled',
      category: 'FRICTION',
      severity: 'low',
      title: 'Potential Unanswered Objections Before Conversion',
      explanation: 'Visitors ready to reach out often have practical questions regarding revisions, kickoff timeline, or communication cadences.',
      recommendedAction: 'Consider adding or strengthening objection handling before the final conversion point.',
      relatedSectionId: 'section_faq',
    });
  } else if (ctaIndex >= 0 && faqIndex > ctaIndex) {
    findings.push({
      id: 'vis_faq_after_cta',
      category: 'FRICTION',
      severity: 'low',
      title: 'FAQ Positioned Below Final CTA',
      explanation: 'Visitors encounter the primary conversion button before their practical workflow questions are resolved.',
      recommendedAction: 'Position the FAQ section immediately above the Final CTA block for smoother conversion.',
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
      explanation: 'The portfolio has no concluding conversion trigger. A prospective client who is convinced has no direct path to schedule a discovery or architecture sprint.',
      recommendedAction: 'Enable the Final CTA section.',
      relatedSectionId: 'section_cta',
    });
  } else {
    if (!ctaSection.ctaText || ctaSection.ctaText.trim().length < 3) {
      findings.push({
        id: 'vis_cta_weak_text',
        category: 'CTA',
        severity: 'low',
        title: 'Call to Action Button Text Could Be Stronger',
        explanation: 'The primary conversion button is empty or very brief. Using action-oriented copy clarifies what happens upon clicking.',
        recommendedAction: 'Specify a direct outcome in your CTA button.',
        relatedSectionId: 'section_cta',
      });
    }
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
  }

  // Sort Findings by Severity: High → Medium → Low
  const severityRank: Record<VisitorFinding['severity'], number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  findings.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);

  // Determine Overall Status
  const highCount = findings.filter((f) => f.severity === 'high').length;
  const mediumCount = findings.filter((f) => f.severity === 'medium').length;

  let overallStatus: VisitorJourneyAudit['overallStatus'] = 'Strong';
  let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let summary = 'Your portfolio architecture flows smoothly with clear positioning, credible proof, and an intuitive conversion path.';

  if (highCount > 0) {
    overallStatus = 'High Friction';
    statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
    summary = `Identified ${highCount} primary conversion blocker${highCount === 1 ? '' : 's'} that may cause prospective clients to hesitate before booking.`;
  } else if (mediumCount > 0) {
    overallStatus = 'Needs Attention';
    statusColor = 'text-amber-800 bg-amber-50 border-amber-200';
    summary = `Solid strategic structure with ${mediumCount} opportunity point${mediumCount === 1 ? '' : 's'} to tighten narrative pacing and reduce buyer uncertainty.`;
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

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 5: PORTFOLIO FINALIZATION & READINESS GATE
// ─────────────────────────────────────────────────────────────────────────────

export interface PortfolioReadinessReport {
  status: 'READY' | 'NEEDS_ATTENTION' | 'INCOMPLETE';
  statusLabel: string;
  statusColor: string;
  canLock: boolean;
  blockers: string[];
  warnings: string[];
  customizedSectionCount: number;
  totalActiveSections: number;
  totalSections: number;
  hasVerifiedProof: boolean;
  activeSequence: { id: string; title: string; number: number; cognitiveRole: string }[];
  visitorAudit: VisitorJourneyAudit;
}

export function evaluatePortfolioReadiness(
  sections: PortfolioBlueprintSection[],
  archetypeId?: string | null,
  goal?: PortfolioGoal | null,
  isLocked?: boolean
): PortfolioReadinessReport {
  const blockers: string[] = [];
  const warnings: string[] = [];

  const allSections = sections || [];
  const activeSections = allSections.filter((s) => s.isEnabled !== false);
  const heroIndex = activeSections.findIndex((s) => s.id === 'section_hero');
  const ctaIndex = activeSections.findIndex((s) => s.id === 'section_cta');
  const ctaSection = activeSections[ctaIndex];

  // 1. Mandatory Lock Gates (Blockers)
  if (heroIndex !== 0) {
    blockers.push(
      heroIndex < 0
        ? 'Hero section is missing or disabled. An active Hero is required at position #1.'
        : 'Hero section must be positioned first (#1) to orient prospective clients.'
    );
  }

  if (ctaIndex < 0 || !ctaSection) {
    blockers.push('Final CTA section is missing or disabled. An active conversion step is required.');
  }

  if (activeSections.length < 3) {
    blockers.push(`Architecture has only ${activeSections.length} active section(s). At least 3 sections are required for a viable portfolio.`);
  }

  if (!goal) {
    blockers.push('Portfolio acquisition goal has not been selected (Sprint, Retainer, or Consulting).');
  }

  if (!archetypeId) {
    blockers.push('Portfolio architecture archetype has not been confirmed.');
  }

  // Run Visitor Journey Audit
  const visitorAudit = validateVisitorJourney(sections, archetypeId, goal);

  // High-severity visitor blockers block locking
  visitorAudit.findings
    .filter((f) => f.severity === 'high')
    .forEach((f) => {
      // Avoid duplicate wording if hero or CTA missing was already caught
      if (!blockers.some((b) => b.includes(f.title) || (f.id === 'vis_hero_missing' && b.includes('Hero')) || (f.id === 'vis_cta_missing' && b.includes('CTA')))) {
        blockers.push(`${f.title}: ${f.explanation}`);
      }
    });

  // Medium and low findings are warnings (do not block finalization)
  visitorAudit.findings
    .filter((f) => f.severity === 'medium' || f.severity === 'low')
    .forEach((f) => {
      warnings.push(`${f.title} (${f.recommendedAction})`);
    });

  // 2. Content & Proof Readiness (Warnings only)
  let customizedCount = 0;
  let hasVerifiedProof = false;

  activeSections.forEach((sec) => {
    if (sec.isCustomized || sec.isHeadlineCustomized || sec.isBodyCustomized || sec.isCtaCustomized) {
      customizedCount++;
    }
    if (sec.proofAnchor && sec.proofAnchor.trim().length > 0) {
      hasVerifiedProof = true;
    }
  });

  if (!hasVerifiedProof) {
    warnings.push('No verified proof assets or case evidence attached yet (portfolio relies on narrative positioning).');
  }

  if (customizedCount === 0 && activeSections.length > 0) {
    warnings.push('Sections currently rely entirely on generated default copy. Customization is recommended before client launch.');
  }

  // Active sequence map with cognitive roles
  const activeSequence = activeSections.map((sec, idx) => {
    const role = sec.id === 'section_hero'
      ? 'ORIENT // VALUE HOOK'
      : sec.id === 'section_proof'
      ? 'VERIFY // PROOF ANCHOR'
      : sec.id === 'section_services'
      ? 'EVALUATE // SCOPE & VELOCITY'
      : sec.id === 'section_case_studies'
      ? 'DIAGNOSE // STAR EVIDENCE'
      : sec.id === 'section_about'
      ? 'DIFFERENTIATE // MECHANISM'
      : sec.id === 'section_faq'
      ? 'DE-RISK // OBJECTION KILLER'
      : sec.id === 'section_cta'
      ? 'CONVERT // DIRECT ACTION'
      : 'UNDERSTAND // AUTHORITY';

    return {
      id: sec.id,
      title: sec.title,
      number: idx + 1,
      cognitiveRole: role,
    };
  });

  let status: PortfolioReadinessReport['status'] = 'READY';
  let statusLabel = 'Ready to Finalize';
  let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (blockers.length > 0) {
    status = 'INCOMPLETE';
    statusLabel = `${blockers.length} Blocker${blockers.length === 1 ? '' : 's'} Preventing Finalization`;
    statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (warnings.length > 0) {
    status = 'NEEDS_ATTENTION';
    statusLabel = `Ready with ${warnings.length} Optimization Note${warnings.length === 1 ? '' : 's'}`;
    statusColor = 'text-amber-800 bg-amber-50 border-amber-200';
  }

  return {
    status,
    statusLabel,
    statusColor,
    canLock: blockers.length === 0,
    blockers,
    warnings,
    customizedSectionCount: customizedCount,
    totalActiveSections: activeSections.length,
    totalSections: allSections.length,
    hasVerifiedProof,
    activeSequence,
    visitorAudit,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 5: DISTINCT EXPORT GENERATORS (JSON & MARKDOWN)
// ─────────────────────────────────────────────────────────────────────────────

export interface ExportPortfolioParams {
  userName?: string;
  positioningHeadline?: string;
  uniqueMechanism?: string;
  archetypeId?: string | null;
  goal?: PortfolioGoal | null;
  sections: PortfolioBlueprintSection[];
  isLocked?: boolean;
  lockedAt?: string;
  readiness?: PortfolioReadinessReport;
}

export function exportPortfolioArchitectureAsJson(params: ExportPortfolioParams): string {
  const activeSections = params.sections.filter((s) => s.isEnabled !== false);
  const archetype = PORTFOLIO_ARCHETYPES.find((a) => a.id === params.archetypeId) || PORTFOLIO_ARCHETYPES[0];

  const payload = {
    $schema: 'https://authority-suite.schema/v1/portfolio-architecture.json',
    meta: {
      specName: 'Executive Portfolio Architecture Specification',
      version: 1,
      generatedAt: new Date().toISOString(),
      finalized: !!params.isLocked,
      finalizedAt: params.lockedAt || (params.isLocked ? new Date().toISOString() : null),
      practitioner: {
        name: params.userName || 'Specialist',
        positioning: params.positioningHeadline || 'Authority Specialist',
      },
    },
    strategy: {
      goal: params.goal || 'sprint',
      archetype: {
        id: archetype.id,
        name: archetype.name,
        targetBuyer: archetype.bestFor,
      },
      uniqueMechanism: params.uniqueMechanism || 'Proof-First Delivery Framework',
    },
    architecture: {
      totalSections: params.sections.length,
      activeSectionsCount: activeSections.length,
      sequence: activeSections.map((s) => s.id),
    },
    sections: activeSections.map((s, idx) => ({
      id: s.id,
      sectionNumber: idx + 1,
      title: s.title,
      purpose: s.purpose,
      conversionReasoning: s.conversionReasoning,
      contentSpec: {
        headline: s.headline,
        subheadline: s.subheadline,
        bodyNarrative: s.bodyCopy,
        ctaText: s.ctaText,
        trustStatement: s.trustStatement || null,
      },
      directives: {
        visualRecommendation: s.recommendedVisuals,
        proofAnchor: s.proofAnchor || null,
        isCustomized: !!(s.isCustomized || s.isHeadlineCustomized || s.isBodyCustomized),
      },
    })),
    validation: {
      overallStatus: params.readiness?.visitorAudit.overallStatus || 'Strong',
      summary: params.readiness?.visitorAudit.summary || '',
      findingsCount: params.readiness?.visitorAudit.findings.length || 0,
      blockersCount: params.readiness?.blockers.length || 0,
    },
  };

  return JSON.stringify(payload, null, 2);
}

export function exportPortfolioArchitectureAsMarkdown(params: ExportPortfolioParams): string {
  const activeSections = params.sections.filter((s) => s.isEnabled !== false);
  const archetype = PORTFOLIO_ARCHETYPES.find((a) => a.id === params.archetypeId) || PORTFOLIO_ARCHETYPES[0];
  const goalLabel = params.goal === 'retainer' ? 'High-Ticket Retainer' : params.goal === 'consulting' ? 'Strategic Advisory / Consulting' : 'High-Velocity Sprint';

  const lines: string[] = [
    `# Executive Portfolio Architecture Specification`,
    ``,
    `> **Prepared For:** ${params.userName || 'Specialist'}`,
    `> **Positioning:** ${params.positioningHeadline || 'Authority Specialist'}`,
    `> **Portfolio Goal:** ${goalLabel}`,
    `> **Architecture Archetype:** ${archetype.name}`,
    `> **Unique Mechanism:** ${params.uniqueMechanism || 'Proof-First Delivery Framework'}`,
    `> **Status:** ${params.isLocked ? `FINALIZED (Locked: ${params.lockedAt ? new Date(params.lockedAt).toLocaleDateString() : 'Yes'})` : 'IN REVISION / DRAFT'}`,
    ``,
    `---`,
    ``,
    `## 1. Executive Narrative Flow`,
    ``,
    activeSections.map((s, idx) => `${idx + 1}. **${s.title}** (${s.purpose})`).join('\n'),
    ``,
    `---`,
    ``,
    `## 2. Section-by-Section Blueprint & Approved Copy`,
    ``,
  ];

  activeSections.forEach((s, idx) => {
    lines.push(
      `### ${idx + 1}. ${s.title}`,
      ``,
      `* **Strategic Purpose:** ${s.purpose}`,
      `* **Conversion Role:** ${s.conversionReasoning}`,
      `* **Headline:** ${s.headline}`,
      `* **Subheadline:** ${s.subheadline}`,
      `* **Body Narrative:**`,
      s.bodyCopy ? `  > ${s.bodyCopy.replace(/\n/g, '\n  > ')}` : '  *(Default structure pending customized copy)*',
      `* **Primary CTA:** \`${s.ctaText}\``,
      s.trustStatement ? `* **Trust Guarantee / Reversal:** ${s.trustStatement}` : `* **Trust Guarantee / Reversal:** *(None specified)*`,
      `* **Proof Requirement:** ${s.proofAnchor ? `\`${s.proofAnchor}\`` : '*(No proof anchor attached — narrative claim)*'}`,
      `* **Visual Component Directive:** ${s.recommendedVisuals}`,
      ``
    );
  });

  if (params.readiness) {
    lines.push(
      `---`,
      ``,
      `## 3. Conversion Readiness & Visitor Audit Summary`,
      ``,
      `* **Overall Health:** ${params.readiness.visitorAudit.overallStatus}`,
      `* **Active Sections:** ${params.readiness.totalActiveSections} of ${params.readiness.totalSections}`,
      `* **Customized Sections:** ${params.readiness.customizedSectionCount} of ${params.readiness.totalActiveSections}`,
      `* **Verified Proof:** ${params.readiness.hasVerifiedProof ? 'Attached' : 'Unsubstantiated narrative'}`,
      ``
    );

    if (params.readiness.warnings.length > 0) {
      lines.push(
        `### Pre-Flight Optimization Opportunities:`,
        ...params.readiness.warnings.map((w) => `- ${w}`),
        ``
      );
    }
  }

  return lines.join('\n');
}
