import type {
  AuthorityProfile,
  AuthorityPosition,
  ProofAssetStrategy,
  ProfilePortfolioStrategy,
  ReadingJourneyStep,
  PortfolioSectionStrategy,
  EvidencePlacement
} from '../../types/module3';

export function generateProfilePortfolioStrategy(ctx: {
  authorityProfile: AuthorityProfile;
  proofAssetStrategy: ProofAssetStrategy;
  mod1ServiceId: string | null;
  mod2OfferType: string | null;
}): ProfilePortfolioStrategy {
  
  const { authorityProfile, proofAssetStrategy } = ctx;

  const readingJourney: ReadingJourneyStep[] = [
    {
      sectionId: 'hero',
      stepIndex: 1,
      phase: 'Hook',
      whatClientSees: 'The Core Trust Promise and strongest single proof point',
      whyTheySeeIt: 'To answer "Why should I listen to you?" in 3 seconds',
      trustEstablished: 'Initial Credibility',
      whatComesNext: 'Deeper context in the summary'
    },
    {
      sectionId: 'context',
      stepIndex: 2,
      phase: 'Context',
      whatClientSees: 'Your Authority Position Rationale and framework',
      whyTheySeeIt: 'To show that you understand their problem deeply',
      trustEstablished: 'Empathy & Expertise',
      whatComesNext: 'Concrete proof of these claims'
    },
    {
      sectionId: 'portfolio',
      stepIndex: 3,
      phase: 'Validation',
      whatClientSees: 'Supporting case studies and specific proof assets',
      whyTheySeeIt: 'To provide undeniable evidence that your approach works',
      trustEstablished: 'Certainty',
      whatComesNext: 'The call to action'
    }
  ];

  const portfolioStructure: PortfolioSectionStrategy[] = [
    {
      sectionId: 'foundational_proof',
      sectionName: 'Foundational Proof',
      purpose: 'Address the most critical credibility gaps first',
      authorityRelation: 'Validates the core authority promise',
      order: 1,
      proofAssetIds: proofAssetStrategy.priorityProofAssets
        .filter(a => a.executionPriority === 'High')
        .map(a => a.id)
    },
    {
      sectionId: 'supporting_evidence',
      sectionName: 'Supporting Evidence',
      purpose: 'Provide depth for high-scrutiny clients',
      authorityRelation: 'Strengthens specific capability claims',
      order: 2,
      proofAssetIds: proofAssetStrategy.priorityProofAssets
        .filter(a => a.executionPriority !== 'High')
        .map(a => a.id)
    }
  ];

  const evidencePlacement: EvidencePlacement[] = proofAssetStrategy.priorityProofAssets.map(asset => {
    const isCore = asset.executionPriority === 'High';
    return {
      sectionId: isCore ? 'foundational_proof' : 'supporting_evidence',
      proofAssetId: asset.id,
      authorityClaim: `Supports ${authorityProfile.position}`,
      placementReason: asset.recommendationReason,
      expectedTrustOutcome: asset.trustImpact
    };
  });

  return {
    version: 1,
    upstreamVersions: {
      authorityProfile: authorityProfile.version || 1,
      proofAssetStrategy: proofAssetStrategy.strategyVersion || 1,
      offerBlueprint: 1, // hardcoded for now until Mod2 provides versions
      marketContext: 1   // hardcoded for now until Mod1 provides versions
    },
    presentationStrategy: {
      primaryGoal: 'Establish undeniable authority through structural evidence',
      communicationApproach: authorityProfile.position.includes('Consultant') ? 'Advisory and analytical' : 'Direct and results-oriented',
      authorityEmphasis: authorityProfile.coreTrustPromise,
      navigationPrinciple: 'Lead with position, support with proof'
    },
    sectionPriorities: [
      {
        sectionId: 'hero',
        priority: 1,
        rationale: 'First impression dictates the lens through which all proof is viewed'
      },
      {
        sectionId: 'portfolio',
        priority: 2,
        rationale: 'Evidence is the primary mechanism for trust building'
      }
    ],
    authorityReinforcement: {
      primaryAuthoritySignal: authorityProfile.position,
      supportingEvidenceFocus: proofAssetStrategy.trustRequirement,
      expectedClientPerception: 'Highly capable expert who can solve their specific problem'
    },
    readingJourney,
    portfolioStructure,
    evidencePlacement,
    status: 'draft',
    confidence: 'Strong',
    generatedAt: new Date().toISOString()
  };
}

export function getPresentationStrategyVariants(position: AuthorityPosition, coreTrustPromise: string): {
  primaryGoal: string[];
  communicationApproach: string[];
  authorityEmphasis: string[];
  navigationPrinciple: string[];
} {
  const defaults = {
    authorityEmphasis: [
      coreTrustPromise,
      "Proven delivery reliability and execution metrics",
      "Systematic risk mitigation and methodology alignment",
      "Hands-on execution capability and visual asset outputs"
    ]
  };

  switch (position) {
    case 'builder':
      return {
        primaryGoal: [
          "Establish undeniable authority through visual project execution capabilities",
          "Demonstrate high-fidelity execution capabilities through actual project builds",
          "Win client confidence by showcasing ready-to-run systems and assets"
        ],
        communicationApproach: [
          "Technical, transparent, and direct",
          "Builder-led, show-dont-tell, and structural",
          "Product-focused and execution-oriented"
        ],
        authorityEmphasis: defaults.authorityEmphasis,
        navigationPrinciple: [
          "Lead with the built product, support with blueprints",
          "Show the raw project first, detail the features below",
          "Zero fluff: demo sandbox first, case studies next"
        ]
      };
    case 'auditor':
      return {
        primaryGoal: [
          "Uncover hidden performance leaks and showcase strategic solutions",
          "Establish diagnostic authority through deep performance analysis",
          "Highlight structural bottlenecks and clear pathways to resolve them"
        ],
        communicationApproach: [
          "Analytical, diagnostic, and risk-aware",
          "Objective, metric-driven, and consultative",
          "Evaluative and performance-focused"
        ],
        authorityEmphasis: defaults.authorityEmphasis,
        navigationPrinciple: [
          "Lead with audit findings, support with action recipes",
          "Show identified bottlenecks first, suggest fixes next",
          "Problem first: gap identification first, proof case studies next"
        ]
      };
    case 'deconstructor':
      return {
        primaryGoal: [
          "Deconstruct industry standards and present optimal blueprints",
          "Establish structural authority by simplifying complex frameworks",
          "Showcase conceptual mastery through clear process breakdowns"
        ],
        communicationApproach: [
          "Educational, system-oriented, and structured",
          "Deconstruction-led, simplified, and framework-first",
          "Conceptual and blueprint-focused"
        ],
        authorityEmphasis: defaults.authorityEmphasis,
        navigationPrinciple: [
          "Lead with the methodology map, support with asset templates",
          "Show process frameworks first, detail proof points next",
          "Structure first: system blueprint first, concrete assets next"
        ]
      };
    case 'practitioner':
    default:
      return {
        primaryGoal: [
          "Establish operational mastery and hands-on delivery credentials",
          "Prove execution reliability by showing real-world workflow success",
          "Highlight deep practical experience to minimize delivery risk"
        ],
        communicationApproach: [
          "Pragmatic, detailed, and results-focused",
          "Action-oriented and delivery-centered",
          "Direct, realistic, and case-based"
        ],
        authorityEmphasis: defaults.authorityEmphasis,
        navigationPrinciple: [
          "Lead with live client results, support with workflows",
          "Show project outcomes first, detail the timeline below",
          "Outcome first: client case study first, execution plan next"
        ]
      };
  }
}
