/**
 * Risk-Reversal & Objection Preemption Framework
 * Provides high-converting guarantee structures and battlecard responses
 * for Module 2 Offer Engineering.
 */

export interface RiskReversalGuarantee {
  id: string;
  name: string;
  tagline: string;
  description: string;
  bestFor: string;
  clauseTemplate: (service: string, timeline: string) => string;
}

export interface ObjectionPreemptor {
  objection: string;
  category: 'price' | 'timeline' | 'trust' | 'scope';
  reframe: string;
  battlecardResponse: string;
}

export const RISK_REVERSAL_GUARANTEES: RiskReversalGuarantee[] = [
  {
    id: 'sprint_assurance',
    name: 'Sprint Delivery Assurance',
    tagline: 'Guaranteed Delivery Within Agreed Timeline',
    description: 'If the agreed core deliverables are not shipped by the deadline, the client receives a 20% discount or 2 weeks of post-launch optimization at zero cost.',
    bestFor: 'Design sprints, MVPs, and rapid audits',
    clauseTemplate: (service, timeline) =>
      `All core ${service || 'system'} milestones are delivered within ${timeline || 'the agreed timeframe'}. If we exceed the target delivery window without prior written amendment, we provide 14 days of dedicated post-launch support free of charge.`,
  },
  {
    id: 'execution_guard',
    name: 'Execution Guard Guarantee',
    tagline: 'Zero Scope Ambiguity & Clear Milestone Sign-offs',
    description: 'Every milestone is accepted against clear deterministic acceptance criteria before billing progresses.',
    bestFor: 'Complex systems engineering & technical infrastructure',
    clauseTemplate: (service) =>
      `Deliverables for ${service || 'the project'} are broken into verifiable milestones. You review and approve each phase before subsequent modules begin.`,
  },
  {
    id: 'value_threshold',
    name: 'Measurable ROI Threshold',
    tagline: 'Aligned with Quantifiable Business Metrics',
    description: 'Guarantees that the solution directly satisfies the performance and efficiency targets set during onboarding.',
    bestFor: 'Conversion rate optimization, automation, and revenue systems',
    clauseTemplate: (service) =>
      `Our ${service || 'architecture'} is engineered to eliminate operational friction and deliver immediate measurable efficiency. If our baseline standards are not met, we revise until aligned.`,
  },
];

export const OBJECTION_PREEMPTORS: ObjectionPreemptor[] = [
  {
    objection: '"How do we know this will integrate smoothly with our existing workflow?"',
    category: 'trust',
    reframe: 'Integration Risk → Zero-Downtime Sandbox Delivery',
    battlecardResponse: 'We build and test in isolated parallel staging before touching production assets, ensuring uninterrupted daily business operations.',
  },
  {
    objection: '"What if the scope expands as we uncover edge cases?"',
    category: 'scope',
    reframe: 'Scope Creep → Deterministic Change-Order Protocol',
    battlecardResponse: 'Core deliverables are strictly locked in Phase 1. Any subsequent feature requests enter a prioritized backlog with transparent fixed-price estimates.',
  },
  {
    objection: '"Why choose this productized model over an in-house hire?"',
    category: 'price',
    reframe: 'Fixed Cost vs Overhead → Instant Senior Execution',
    battlecardResponse: 'Zero recruitment lag, zero benefits overhead, and immediate senior-level execution from Day 1 with defined output guarantees.',
  },
  {
    objection: '"How quickly can our team begin seeing tangible outputs?"',
    category: 'timeline',
    reframe: 'Long Runway → First Milestone within 72 Hours',
    battlecardResponse: 'Our structured onboarding delivers your foundational roadmap and first actionable artifact within 72 business hours.',
  },
];
