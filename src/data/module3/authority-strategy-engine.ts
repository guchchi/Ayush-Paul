import type {
  ProofStrengthLevel,
  MessageHierarchyLayer,
  PortfolioStructureSectionItem,
  SectionPriorityItem,
  EvidencePlacementMapping,
  PresentationJourneyStep,
  ReinforcementDiagnosticIssue,
  NextMoveActionItem,
  BlueprintDecisionSummary,
  ProfilePortfolioAuthorityBlueprint,
} from '../../types/module3-step3-authority';
import type { Module3State, ProofAsset } from '../../types/module3';

export function formatSnakeCaseWords(str: string): string {
  if (!str) return '';
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function evaluateProofStrength(asset: ProofAsset): ProofStrengthLevel {
  const title = (asset.title || '').toLowerCase();
  const assetType = (asset.assetType || '').toLowerCase();

  if (assetType.includes('case_study') || title.includes('case study') || title.includes('teardown')) {
    return 'case_study';
  }
  if (assetType.includes('testimonial') || title.includes('testimonial') || title.includes('review')) {
    return 'testimonial';
  }
  if (assetType.includes('data_report') || assetType.includes('outcome') || title.includes('result') || title.includes('metric')) {
    return 'outcome';
  }
  if (assetType.includes('demo') || assetType.includes('before_after') || title.includes('prototype') || title.includes('live')) {
    return 'demonstration';
  }
  if (assetType.includes('framework') || assetType.includes('explainer') || title.includes('project') || title.includes('repo')) {
    return 'project';
  }
  return 'credential';
}

export function buildProfilePositioningHierarchy(mod3State: Partial<Module3State>): MessageHierarchyLayer[] {
  const market = formatSnakeCaseWords(mod3State.mod1NicheId || mod3State.mod1MarketId || 'target_clients');
  const service = formatSnakeCaseWords(mod3State.mod1ServiceId || 'high_ticket_services');
  const position = formatSnakeCaseWords(mod3State.authorityPosition || 'builder');
  const mechanism = mod3State.mod2UniqueMechanism || 'Proof-First Framework';
  const promise = mod3State.coreTrustPromise || 'Verifiable outputs with zero claims';

  const equippedProofCount = mod3State.availableAssets?.length || 0;
  const proofAssets = mod3State.proofAssets || [];
  const primaryProof = proofAssets[0]?.title || (equippedProofCount > 0 ? 'Live Output Showcase' : null);

  return [
    {
      layerKey: 'who_you_are',
      layerTitle: '1. WHO YOU ARE',
      perceptionTarget: `Category Leader & ${position}-Led Specialist`,
      recommendedFocus: `The ${position}-led ${service} specialist built specifically for ${market}.`,
      strategicRationale: 'Establishes clear category identity in the first 3 seconds, eliminating generic vendor ambiguity.',
      status: 'pending',
    },
    {
      layerKey: 'what_you_do',
      layerTitle: '2. WHAT YOU DO',
      perceptionTarget: `High-Certainty System Implementation`,
      recommendedFocus: `Designing and executing high-impact ${service} through our proprietary ${mechanism}.`,
      strategicRationale: 'Frames capability around system execution rather than hours or unverified claims.',
      status: 'pending',
    },
    {
      layerKey: 'who_you_help',
      layerTitle: '3. WHO YOU HELP',
      perceptionTarget: `High-Growth ${market}`,
      recommendedFocus: `Ambitious ${market} seeking predictable, verifiable ROI without agency bloat.`,
      strategicRationale: 'Attracts ideal high-ticket clients while repelling low-budget, high-friction prospects.',
      status: 'pending',
    },
    {
      layerKey: 'known_for',
      layerTitle: '4. WHAT YOU ARE KNOWN FOR',
      perceptionTarget: `Proof-First Demonstration Engine`,
      recommendedFocus: primaryProof
        ? `Self-initiated proof assets like "${primaryProof}" that demonstrate exact execution standards.`
        : `Verifiable demonstration projects showing exact technical and business implementation workflows.`,
      strategicRationale: 'Anchors your personal brand to tangible proof assets rather than verbal claims.',
      status: 'pending',
    },
    {
      layerKey: 'why_credible',
      layerTitle: '5. WHY YOU ARE CREDIBLE',
      perceptionTarget: `Transparent Proof & Service Philosophy`,
      recommendedFocus: promise,
      strategicRationale: 'Addresses skepticism directly by offering open inspection of execution quality.',
      status: 'pending',
    },
    {
      layerKey: 'next_step',
      layerTitle: '6. WHAT THEY SHOULD DO NEXT',
      perceptionTarget: `Low-Friction Consultation Gateway`,
      recommendedFocus: `Access our live case study teardowns and book a 15-minute authority strategy call.`,
      strategicRationale: 'Directs visitor attention toward a single focused action without confusing options.',
      status: 'pending',
    },
  ];
}

export function buildPortfolioStructureJourney(mod3State: Partial<Module3State>): PortfolioStructureSectionItem[] {
  const market = formatSnakeCaseWords(mod3State.mod1NicheId || mod3State.mod1MarketId || 'target_clients');
  const service = formatSnakeCaseWords(mod3State.mod1ServiceId || 'high_ticket_services');
  const mechanism = mod3State.mod2UniqueMechanism || 'Proof-First Framework';
  const equippedProofCount = mod3State.availableAssets?.length || 0;
  const proofAssets = mod3State.proofAssets || [];

  // System adapts structure: Lead with proof if proof count > 2
  const leadWithProof = equippedProofCount > 2 || proofAssets.length > 0;

  const defaultSections: PortfolioStructureSectionItem[] = [
    {
      id: 'sec_positioning',
      position: 1,
      sectionTitle: '1. Positioning & Hero Claim',
      structuralRole: 'Positioning',
      visitorMindset: 'Who is this person and what core problem do they solve for me?',
      conversionRationale: 'Immediately hooks high-ticket visitors and validates category relevance within 5 seconds.',
      recommendedVisual: 'High-contrast positioning header + primary proof anchor badge + clear CTA',
      isEnabled: true,
      status: 'pending',
    },
    {
      id: leadWithProof ? 'sec_evidence' : 'sec_capability',
      position: 2,
      sectionTitle: leadWithProof ? '2. Evidence & Verified Demonstrations' : '2. Capability & Offer Scope',
      structuralRole: leadWithProof ? 'Evidence' : 'Capability/Offer',
      visitorMindset: leadWithProof ? 'Can this person actually deliver what they claim?' : 'What specific service scope and deliverables do they provide?',
      conversionRationale: leadWithProof
        ? 'Leading with verified proof assets satisfies visitor skepticism early before presenting prices or scope.'
        : 'Outlines service scope and deliverables so visitors understand exact engagement tiers.',
      recommendedVisual: leadWithProof ? 'Interactive proof asset gallery + live teardown embeds' : '3-column offer tier grid with deliverable checkmarks',
      isEnabled: true,
      status: 'pending',
    },
    {
      id: leadWithProof ? 'sec_capability' : 'sec_work',
      position: 3,
      sectionTitle: leadWithProof ? '3. Capability & Offer Scope' : '3. Relevant Work & Teardowns',
      structuralRole: leadWithProof ? 'Capability/Offer' : 'Relevant Work',
      visitorMindset: leadWithProof ? 'What specific service scope and deliverables do they provide?' : 'How do they solve complex challenges step-by-step?',
      conversionRationale: leadWithProof
        ? 'Outlines deliverables and scope after credibility has already been anchored by proof.'
        : 'Demonstrates deep strategic thinking and real execution methodology.',
      recommendedVisual: leadWithProof ? '3-column offer tier grid with deliverable checkmarks' : 'STAR breakdown teardown cards (Situation, Action, Result)',
      isEnabled: true,
      status: 'pending',
    },
    {
      id: leadWithProof ? 'sec_work' : 'sec_evidence',
      position: 4,
      sectionTitle: leadWithProof ? '4. Relevant Work & Teardowns' : '4. Evidence & Verified Demonstrations',
      structuralRole: leadWithProof ? 'Relevant Work' : 'Evidence',
      visitorMindset: leadWithProof ? 'How do they solve complex challenges step-by-step?' : 'Can this person actually deliver what they claim?',
      conversionRationale: leadWithProof
        ? 'Demonstrates deep strategic thinking and real execution methodology.'
        : 'Reinforces capability with tangible, inspectable evidence.',
      recommendedVisual: leadWithProof ? 'STAR breakdown teardown cards' : 'Interactive proof asset gallery + live teardown embeds',
      isEnabled: true,
      status: 'pending',
    },
    {
      id: 'sec_trust',
      position: 5,
      sectionTitle: '5. Trust & Social Proof',
      structuralRole: 'Trust',
      visitorMindset: 'Who else trusts this person and what was their outcome?',
      conversionRationale: 'Activates peer social proof and addresses buying risk directly.',
      recommendedVisual: 'Client quote cards + verified outcome badges + trust promise SLA',
      isEnabled: true,
      status: 'pending',
    },
    {
      id: 'sec_next_step',
      position: 6,
      sectionTitle: '6. Next Step & Booking Gateway',
      structuralRole: 'Next Step',
      visitorMindset: 'How do I take the next step to work with them?',
      conversionRationale: 'Provides a low-friction, high-clarity pathway to schedule a 15-minute strategy call.',
      recommendedVisual: 'Embedded calendar booking widget + 3-bullet value guarantee callout',
      isEnabled: true,
      status: 'pending',
    },
  ];

  return defaultSections;
}

export function buildSectionPrioritiesStrategy(mod3State: Partial<Module3State>): SectionPriorityItem[] {
  const proofAssets = mod3State.proofAssets || [];
  const hasProofAssets = proofAssets.length > 0;

  return [
    {
      id: 'prio_positioning',
      sectionName: 'Positioning & Hero Claim',
      priority: 'HIGH',
      whyPriority: 'High-ticket buyers evaluate relevance immediately. Vague positioning causes bounce in 5 seconds.',
      actionRequired: 'Feature primary positioning claim and category title prominently at the top of profile and portfolio.',
    },
    {
      id: 'prio_proof',
      sectionName: 'Evidence & Verified Proof',
      priority: 'HIGH',
      whyPriority: hasProofAssets
        ? 'Your Step 2 proof assets are your strongest authority differentiator.'
        : 'In a noisy market, proof assets provide unquestionable credibility.',
      actionRequired: 'Position proof assets near primary claims so visitors encounter evidence early.',
    },
    {
      id: 'prio_cases',
      sectionName: 'Relevant Work & Teardowns',
      priority: 'HIGH',
      whyPriority: 'Shows step-by-step problem-solving methodology under real constraints.',
      actionRequired: 'Feature 2-3 deep teardowns showing Situation, Action, and Results.',
    },
    {
      id: 'prio_offer',
      sectionName: 'Capability & Offer Scope',
      priority: 'MEDIUM',
      whyPriority: 'Clarifies deliverables, but secondary to establishing positioning and trust.',
      actionRequired: 'Present deliverable scope cleanly without overwhelming technical fluff.',
    },
    {
      id: 'prio_background',
      sectionName: 'Personal Story & Background',
      priority: 'LOW',
      whyPriority: 'Visitors care about their own business outcomes before reading personal history.',
      actionRequired: 'Keep background concise and tightly linked to your core authority philosophy.',
    },
  ];
}

export function buildEvidencePlacementMappings(mod3State: Partial<Module3State>): EvidencePlacementMapping[] {
  const proofAssets = mod3State.proofAssets || [];
  const market = formatSnakeCaseWords(mod3State.mod1NicheId || mod3State.mod1MarketId || 'target_clients');
  const service = formatSnakeCaseWords(mod3State.mod1ServiceId || 'high_ticket_services');
  const promise = mod3State.coreTrustPromise || 'Verifiable execution standards';

  if (proofAssets.length > 0) {
    return proofAssets.map((asset, idx) => {
      const strength = evaluateProofStrength(asset);
      return {
        id: `map_${asset.id || idx}`,
        claim: asset.portfolioCopy?.headline || `Proven capability in ${service}`,
        proofAssetId: asset.id,
        proofTitle: asset.title,
        proofStrength: strength,
        whyItSupportsClaim: `Demonstrates exact execution output for "${asset.title}", directly proving ${asset.credibilityGapProved || 'technical capability'}.`,
        recommendedPlacement: idx === 0 ? 'Positioning & Hero Section' : 'Relevant Work & Evidence Section',
        visibilityLevel: idx === 0 ? 'High' : 'Medium',
        actionIfWeak: asset.completionChecklist?.some((c) => !c)
          ? 'Complete remaining checklist items in Step 2 to maximize evidence clarity.'
          : undefined,
      };
    });
  }

  // Fallback evidence placements if no Step 2 proof assets are present
  return [
    {
      id: 'map_fallback_1',
      claim: `High-certainty ${service} delivery for ${market}`,
      proofAssetId: 'asset_demo',
      proofTitle: 'Live Architecture & Workflow Teardown',
      proofStrength: 'demonstration',
      whyItSupportsClaim: 'Shows raw execution standards and transparent process logic.',
      recommendedPlacement: 'Positioning & Capability Section',
      visibilityLevel: 'High',
      actionIfWeak: 'Add a 2-minute video walkthrough or repository link to strengthen this signal.',
    },
    {
      id: 'map_fallback_2',
      claim: promise,
      proofAssetId: 'asset_trust',
      proofTitle: 'Verified Client Outcome SLA',
      proofStrength: 'outcome',
      whyItSupportsClaim: 'Reduces buyer anxiety by guaranteeing milestone verification.',
      recommendedPlacement: 'Trust & Booking Section',
      visibilityLevel: 'High',
    },
  ];
}

export function buildPresentationFlowStrategy(mod3State: Partial<Module3State>): {
  personaContext: string;
  journey: PresentationJourneyStep[];
} {
  const position = mod3State.authorityPosition || 'builder';
  const market = formatSnakeCaseWords(mod3State.mod1NicheId || mod3State.mod1MarketId || 'clients');

  let personaContext = 'Service Provider & High-Ticket Consultant Flow';
  if (position === 'auditor') {
    personaContext = 'Strategic Auditor & Evaluator Communication Flow';
  } else if (position === 'deconstructor') {
    personaContext = 'System Deconstructor & Technical Expert Flow';
  } else if (position === 'practitioner') {
    personaContext = 'Hands-On Practitioner & Delivery Architect Flow';
  }

  // The 6-Stage Visitor Progressive Understanding Journey
  const journey: PresentationJourneyStep[] = [
    {
      stepNumber: 1,
      stageName: 'Stage 1: Curiosity (0-5s)',
      visitorPsychology: 'Relevance Check ("Who is this and is this relevant to me?")',
      communicationPurpose: 'Hook high-ticket prospects with crisp positioning and clear category authority.',
      contentToPresent: `Positioning claim for ${market} + primary proof anchor.`,
      conversionRole: 'Captures focused attention and eliminates bounce.',
    },
    {
      stepNumber: 2,
      stageName: 'Stage 2: Clarity (5-15s)',
      visitorPsychology: 'Scope Check ("What exact problem do they solve?")',
      communicationPurpose: 'Define service scope and unique mechanism without agency fluff.',
      contentToPresent: `Capability breakdown + ${mod3State.mod2UniqueMechanism || 'Unique Mechanism'}.`,
      conversionRole: 'Establishes clear service scope and engagement boundaries.',
    },
    {
      stepNumber: 3,
      stageName: 'Stage 3: Evaluation (15-30s)',
      visitorPsychology: 'Methodology Check ("How do they solve complex problems?")',
      communicationPurpose: 'Demonstrate step-by-step strategic thinking through teardowns.',
      contentToPresent: `Relevant work case studies and STAR breakdown teardowns.`,
      conversionRole: 'Demonstrates deep strategic capability under real constraints.',
    },
    {
      stepNumber: 4,
      stageName: 'Stage 4: Validation (30-45s)',
      visitorPsychology: 'Evidence Check ("Can they actually deliver what they claim?")',
      communicationPurpose: 'Fulfill positioning claims with inspectable, verified proof assets.',
      contentToPresent: `Live prototypes, code teardowns, and verified proof assets.`,
      conversionRole: 'Overcomes buyer skepticism and builds genuine trust.',
    },
    {
      stepNumber: 5,
      stageName: 'Stage 5: Conviction (45-60s)',
      visitorPsychology: 'Safety Check ("Is working with them safe and risk-free?")',
      communicationPurpose: 'Address buying objections, guarantees, and peer endorsements.',
      contentToPresent: `Client testimonials, trust guarantees, and SLA callouts.`,
      conversionRole: 'Removes purchasing anxiety and friction.',
    },
    {
      stepNumber: 6,
      stageName: 'Stage 6: Action (60s+)',
      visitorPsychology: 'Decision ("How do I get started?")',
      communicationPurpose: 'Direct the visitor to a single, focused booking gateway.',
      contentToPresent: `Calendar booking widget + 15-minute discovery consultation CTA.`,
      conversionRole: 'Converts validated trust into pipeline inquiries.',
    },
  ];

  return { personaContext, journey };
}

export function buildAuthorityReinforcementAudit(mod3State: Partial<Module3State>): {
  alignmentScore: number;
  overallVerdict: string;
  diagnostics: ReinforcementDiagnosticIssue[];
} {
  const position = mod3State.authorityPosition || 'builder';
  const equippedCount = mod3State.availableAssets?.length || 0;
  const proofAssets = mod3State.proofAssets || [];
  const diagnostics: ReinforcementDiagnosticIssue[] = [];

  let alignmentScore = 85;

  // Check 1: Positioning -> Profile Alignment
  diagnostics.push({
    id: 'diag_positioning_profile',
    severity: 'success',
    title: '✓ POSITIONING → PROFILE ALIGNED',
    positioningClaim: `Claims expert authority as a ${position}`,
    actualEvidenceOrWork: 'Profile message hierarchy directly matches Step 1 authority stance.',
    recommendation: 'Ensure your LinkedIn / X headline uses the exact 6-layer message sequence.',
    impactedSection: 'Profile Message Architecture',
  });

  // Check 2: Positioning -> Proof Alignment (Gap check)
  if (equippedCount === 0 && proofAssets.length === 0) {
    alignmentScore -= 25;
    diagnostics.push({
      id: 'diag_proof_gap',
      severity: 'warning',
      title: '⚠ POSITIONING → PROOF GAP DETECTED',
      positioningClaim: `Claims expert authority as a ${position}`,
      actualEvidenceOrWork: 'No proof assets currently equipped or created in Step 2.',
      recommendation: 'Complete at least 1 self-initiated proof asset or live demonstration in Step 2 to anchor your claim.',
      impactedSection: 'Evidence & Proof Section',
    });
  } else {
    diagnostics.push({
      id: 'diag_proof_aligned',
      severity: 'success',
      title: '✓ POSITIONING → PROOF ALIGNED',
      positioningClaim: `Claims expert authority as a ${position}`,
      actualEvidenceOrWork: `${proofAssets.length || equippedCount} verified proof asset(s) supporting core positioning.`,
      recommendation: 'Position your primary proof asset near your hero positioning statement.',
      impactedSection: 'Portfolio Hero & Proof',
    });
  }

  // Check 3: Positioning -> Portfolio Alignment
  if (mod3State.coreTrustPromise) {
    diagnostics.push({
      id: 'diag_portfolio_promise',
      severity: 'success',
      title: '✓ POSITIONING → PORTFOLIO ALIGNED',
      positioningClaim: mod3State.coreTrustPromise,
      actualEvidenceOrWork: 'Portfolio section journey places evidence early to satisfy visitor skepticism.',
      recommendation: 'Keep trust promise visible in offer tier and booking section callouts.',
      impactedSection: 'Trust & Booking Section',
    });
  }

  const verdict = alignmentScore >= 80
    ? 'High Alignment — Positioning → Profile → Portfolio → Proof reinforce the same core perception.'
    : 'Moderate Alignment — Disconnect detected between positioning claims and supporting proof assets.';

  return {
    alignmentScore,
    overallVerdict: verdict,
    diagnostics,
  };
}

export function buildNextMovesActionPlan(
  mod3State: Partial<Module3State>,
  blueprint: Partial<ProfilePortfolioAuthorityBlueprint>
): NextMoveActionItem[] {
  const actions: NextMoveActionItem[] = [];
  const proofAssets = mod3State.proofAssets || [];
  const equippedCount = mod3State.availableAssets?.length || 0;
  const diagnostics = blueprint.alignmentAudit?.diagnostics || [];

  let step = 1;

  actions.push({
    id: 'next_1',
    stepNumber: step++,
    title: 'Align Public Profile with Message Architecture',
    description: 'Update your LinkedIn / X bio to follow the 6-layer sequence (Who You Are → What You Do → Proof).',
    impact: 'High Impact',
    category: 'Profile',
    isCompleted: false,
  });

  actions.push({
    id: 'next_2',
    stepNumber: step++,
    title: 'Sequence Portfolio Journey by Recommended Order',
    description: 'Arrange portfolio sections: Positioning → Capability/Offer → Relevant Work → Evidence → Trust → Next Step.',
    impact: 'High Impact',
    category: 'Portfolio',
    isCompleted: false,
  });

  if (proofAssets.length > 0) {
    actions.push({
      id: 'next_3',
      stepNumber: step++,
      title: `Embed Primary Proof Asset "${proofAssets[0].title}" Near Hero`,
      description: 'Position your strongest verified proof asset immediately alongside your hero positioning claim.',
      impact: 'Very High Impact',
      category: 'Proof',
      isCompleted: false,
    });
  } else if (equippedCount === 0) {
    actions.push({
      id: 'next_3',
      stepNumber: step++,
      title: 'Prepare 1 High-Impact Demonstration Asset in Step 2',
      description: 'Create a self-initiated proof asset in Step 2 to remove credibility skepticism.',
      impact: 'Critical Impact',
      category: 'Proof',
      isCompleted: false,
    });
  }

  if (diagnostics.some((d) => d.severity === 'warning')) {
    actions.push({
      id: 'next_4',
      stepNumber: step++,
      title: 'Resolve Alignment Disconnect Gaps',
      description: 'Address detected positioning → proof gaps before launching your public authority pack.',
      impact: 'High Impact',
      category: 'Positioning',
      isCompleted: false,
    });
  }

  actions.push({
    id: `next_${step}`,
    stepNumber: step++,
    title: 'Lock Blueprint & Generate Authority Operating System',
    description: 'Confirm launch readiness and proceed to Step 4 (Authority Pack generation).',
    impact: 'Transformational',
    category: 'Portfolio',
    isCompleted: false,
  });

  return actions;
}

export function buildDecisionSummary(
  mod3State: Partial<Module3State>,
  profileHierarchy: MessageHierarchyLayer[],
  portfolioSections: PortfolioStructureSectionItem[],
  evidencePlacements: EvidencePlacementMapping[]
): BlueprintDecisionSummary {
  const market = formatSnakeCaseWords(mod3State.mod1NicheId || mod3State.mod1MarketId || 'Target Clients');
  const service = formatSnakeCaseWords(mod3State.mod1ServiceId || 'High-Ticket Services');
  const position = formatSnakeCaseWords(mod3State.authorityPosition || 'Builder');
  const proofAssets = mod3State.proofAssets || [];

  const topPriorities = portfolioSections
    .filter((s) => s.isEnabled)
    .slice(0, 3)
    .map((s) => s.sectionTitle);

  return {
    positioningClaim: `${position}-Led ${service} Specialist for ${market}`,
    primaryCategory: service,
    strongestProofAnchor: proofAssets[0]?.title || 'Verifiable Demonstration Engine',
    primaryProfileFocus: profileHierarchy[0]?.recommendedFocus || 'Category Identity',
    topPortfolioPriorities: topPriorities,
    keyEvidencePlacement: evidencePlacements[0]?.recommendedPlacement || 'Positioning & Hero Section',
    alignmentHealth: proofAssets.length > 0 ? 'Strong (Proof-Backed)' : 'Developing (Process-backed)',
  };
}

export function generateProfilePortfolioAuthorityBlueprint(
  mod3State: Partial<Module3State>
): ProfilePortfolioAuthorityBlueprint {
  const profilePositioning = buildProfilePositioningHierarchy(mod3State);
  const portfolioStructure = buildPortfolioStructureJourney(mod3State);
  const sectionPriorities = buildSectionPrioritiesStrategy(mod3State);
  const evidencePlacements = buildEvidencePlacementMappings(mod3State);
  const presentationFlow = buildPresentationFlowStrategy(mod3State);
  const alignmentAudit = buildAuthorityReinforcementAudit(mod3State);

  const decisionSummary = buildDecisionSummary(
    mod3State,
    profilePositioning,
    portfolioStructure,
    evidencePlacements
  );

  const partialBlueprint: Partial<ProfilePortfolioAuthorityBlueprint> = {
    decisionSummary,
    foundation: {
      authorityPosition: formatSnakeCaseWords(mod3State.authorityPosition || 'builder'),
      trustPromise: mod3State.coreTrustPromise || 'Verifiable outputs with zero claims',
      equippedProofCount: mod3State.availableAssets?.length || 0,
      skippedProofCount: mod3State.skippedAssets?.length || 0,
      strongestProofSignal: (mod3State.proofAssets || [])[0]?.title || 'Methodology Framework',
    },
    profilePositioning,
    portfolioStructure,
    sectionPriorities,
    evidencePlacements,
    presentationFlow,
    alignmentAudit,
  };

  const nextMoves = buildNextMovesActionPlan(mod3State, partialBlueprint);

  return {
    ...partialBlueprint,
    nextMoves,
    isLocked: false,
    generatedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  } as ProfilePortfolioAuthorityBlueprint;
}
