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

