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
  const promise = mod3State.coreTrustPromise || 'Verifiable outputs with zero fabricated claims';

  const equippedProofCount = mod3State.availableAssets?.length || 0;
  const proofAssets = mod3State.proofAssets || [];
  const primaryProof = proofAssets[0]?.title || (equippedProofCount > 0 ? 'Live Output Showcase' : null);

  return [
    {
      layerKey: 'who_you_are',
      layerTitle: '1. WHO YOU ARE',
      perceptionTarget: `Category Leader & ${position}-Led Specialist`,
      recommendedFocus: `The ${position}-led ${service} architect built specifically for ${market}.`,
      strategicRationale: 'Establishes clear category identity in the first 3 seconds, eliminating generic vendor ambiguity.',
      status: 'pending',
    },
    {
      layerKey: 'what_you_do',
      layerTitle: '2. WHAT YOU DO',
      perceptionTarget: `High-Certainty System Implementation`,
      recommendedFocus: `Designing and executing high-impact ${service} through our proprietary ${mechanism}.`,
      strategicRationale: 'Frames capability around system execution rather than hours or unverified promises.',
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

  // Determine structural section order based on proof availability
  const leadWithProof = equippedProofCount > 2 || proofAssets.length > 0;

  const defaultSections: PortfolioStructureSectionItem[] = [
    {
      id: 'sec_hero',
      position: 1,
      sectionTitle: '1. Hero & Positioning Statement',
      structuralRole: 'Primary Hook & Category Claim',
      visitorMindset: 'Who is this person and what problem do they solve for me?',
      conversionRationale: 'Immediately hooks high-ticket visitors and validates that they are in the right place within 5 seconds.',
      recommendedVisual: 'High-contrast typography header + floating proof badge + main CTA button',
      isEnabled: true,
      status: 'pending',
    },
    {
      id: leadWithProof ? 'sec_proof' : 'sec_capability',
      position: 2,
      sectionTitle: leadWithProof ? '2. Verified Proof Assets & Live Demonstrations' : '2. Capability & Core Offer System',
      structuralRole: leadWithProof ? 'Immediate Credibility Anchor' : 'Value Proposition & Offer Scope',
      visitorMindset: leadWithProof ? 'Can this person actually deliver what they claim?' : 'What specific service or system do they offer?',
      conversionRationale: leadWithProof
        ? 'Leading with verified proof assets immediately satisfies visitor skepticism before presenting price or scope.'
        : 'Clearly outlines deliverables and scope so visitors understand exact engagement tiers.',
      recommendedVisual: leadWithProof ? 'Interactive proof asset gallery + live prototype embeds' : '3-column scope card grid with deliverable checkmarks',
      isEnabled: true,
      status: 'pending',
    },
    {
      id: leadWithProof ? 'sec_capability' : 'sec_proof',
      position: 3,
      sectionTitle: leadWithProof ? '3. Capability & Core Offer System' : '3. Verified Proof Assets & Live Demonstrations',
      structuralRole: leadWithProof ? 'Value Proposition & Offer Scope' : 'Immediate Credibility Anchor',
      visitorMindset: leadWithProof ? 'What specific service or system do they offer?' : 'Can this person actually deliver what they claim?',
      conversionRationale: leadWithProof
        ? 'Clearly outlines deliverables and scope after credibility has already been established.'
        : 'Reinforces the offer capability with tangible, inspectable evidence.',
      recommendedVisual: leadWithProof ? '3-column scope card grid with deliverable checkmarks' : 'Interactive proof asset gallery + live prototype embeds',
      isEnabled: true,
      status: 'pending',
    },
    {
      id: 'sec_cases',
      position: 4,
      sectionTitle: '4. Case Studies & STAR Breakdown',
      structuralRole: 'Problem-Solving Teardown Evidence',
      visitorMindset: 'How do they solve complex challenges step-by-step under real constraints?',
      conversionRationale: 'Demonstrates deep strategic thinking and real-world execution capability.',
      recommendedVisual: 'STAR breakdown cards (Situation, Task, Action, Result) with metrics callout',
      isEnabled: true,
      status: 'pending',
    },
    {
      id: 'sec_social_proof',
      position: 5,
      sectionTitle: '5. Social Proof & Peer Validation',
      structuralRole: 'Third-Party Endorsement',
      visitorMindset: 'Who else trusts this person and what was their experience?',
      conversionRationale: 'Activates peer social proof to confirm safety in buying.',
      recommendedVisual: 'Verified client quote cards + LinkedIn avatar badges',
      isEnabled: true,
      status: 'pending',
    },
    {
      id: 'sec_cta',
      position: 6,
      sectionTitle: '6. High-Ticket Booking & Next Step',
      structuralRole: 'Conversion Gateway',
      visitorMindset: 'How do I take the next step to work with them?',
      conversionRationale: 'Provides a zero-pressure, high-clarity pathway to schedule a discovery call.',
      recommendedVisual: 'Embedded calendar booking widget + 3-bullet value guarantee note',
      isEnabled: true,
      status: 'pending',
    },
  ];

  return defaultSections;
}

export function buildSectionPrioritiesStrategy(mod3State: Partial<Module3State>): SectionPriorityItem[] {
  const equippedProofCount = mod3State.availableAssets?.length || 0;
  const hasProofAssets = (mod3State.proofAssets || []).length > 0;

  return [
    {
      id: 'prio_positioning',
      sectionName: 'Positioning & Hero Claim',
      priority: 'HIGH',
      whyPriority: 'High-ticket buyers evaluate relevance immediately. If your positioning is vague, visitors bounce before reviewing your work.',
      actionRequired: 'Make your primary positioning claim and category title impossible to miss at the top of your profile and portfolio.',
    },
    {
      id: 'prio_proof',
      sectionName: 'Verifiable Proof & Demonstrations',
      priority: 'HIGH',
      whyPriority: hasProofAssets
        ? 'You have prepared concrete proof assets in Step 2. These represent your strongest authority differentiator.'
        : 'In a market flooded with unverified claims, proof assets provide unquestionable credibility.',
      actionRequired: 'Position proof assets near your core claims so visitors experience evidence early in their journey.',
    },
    {
      id: 'prio_cases',
      sectionName: 'Selected Work & Case Studies',
      priority: 'HIGH',
      whyPriority: 'Shows your step-by-step problem-solving methodology and execution quality.',
      actionRequired: 'Feature 2-3 deep teardowns showing Situation, Action, and Results rather than a clutter of minor projects.',
    },
    {
      id: 'prio_offer',
      sectionName: 'Core Offer & Capability Scope',
      priority: 'MEDIUM',
      whyPriority: 'Necessary to clarify deliverables, but secondary to establishing positioning and trust.',
      actionRequired: 'Present clear deliverable scope without overwhelming the visitor with technical jargon.',
    },
    {
      id: 'prio_background',
      sectionName: 'Personal Background & Story',
      priority: 'LOW',
      whyPriority: 'Visitors care primarily about their own business outcomes before reading personal history.',
      actionRequired: 'Keep background information concise and directly connected to your core authority philosophy.',
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
        recommendedPlacement: idx === 0 ? 'Hero Section & Proof Showcase' : 'Case Studies & Deliverables Gallery',
        visibilityLevel: idx === 0 ? 'High' : 'Medium',
        actionIfWeak: asset.completionChecklist?.some((c) => !c)
          ? 'Complete remaining checklist items in Step 2 to maximize evidence clarity.'
          : undefined,
      };
    });
  }

  // Fallback structural evidence placements if no Step 2 proof assets are present
  return [
    {
      id: 'map_fallback_1',
      claim: `High-certainty ${service} delivery for ${market}`,
      proofAssetId: 'asset_demo',
      proofTitle: 'Live Architecture & Workflow Teardown',
      proofStrength: 'demonstration',
      whyItSupportsClaim: 'Shows raw execution standards and transparent process logic.',
      recommendedPlacement: 'Near Hero Positioning & Capability Section',
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
      recommendedPlacement: 'Offer Tiers & Booking Section',
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
  const service = formatSnakeCaseWords(mod3State.mod1ServiceId || 'services');

  let personaContext = 'Service Provider & High-Ticket Consultant Flow';

  if (position === 'auditor') {
    personaContext = 'Strategic Auditor & Evaluator Communication Flow';
  } else if (position === 'deconstructor') {
    personaContext = 'System Deconstructor & Technical Expert Flow';
  } else if (position === 'practitioner') {
    personaContext = 'Hands-On Practitioner & Delivery Architect Flow';
  }

  const journey: PresentationJourneyStep[] = [
    {
      stepNumber: 1,
      stageName: 'Stage 1: Immediate Hook (0-5s)',
      visitorPsychology: 'Curiosity & Relevance Check ("Who is this and is this relevant to me?")',
      communicationPurpose: 'Hook high-ticket prospects with crisp positioning and clear category authority.',
      contentToPresent: `Positioning claim for ${market} + primary proof anchor.`,
      conversionRole: 'Reduces initial bounce rate and captures focused attention.',
    },
    {
      stepNumber: 2,
      stageName: 'Stage 2: Category & Capability (5-15s)',
      visitorPsychology: 'Clarity ("What exact problem do they solve?")',
      communicationPurpose: 'Define service scope and unique mechanism without confusing agency fluff.',
      contentToPresent: `Core service breakdown + ${mod3State.mod2UniqueMechanism || 'Unique Mechanism'}.`,
      conversionRole: 'Establishes clear service expectations and engagement boundaries.',
    },
    {
      stepNumber: 3,
      stageName: 'Stage 3: Evidence & Proof (15-30s)',
      visitorPsychology: 'Validation & Evaluation ("Can they actually deliver what they claim?")',
      communicationPurpose: 'Fulfill positioning promises with inspectable proof assets and case teardowns.',
      contentToPresent: `Live prototypes, case studies, and verifiable delivery assets.`,
      conversionRole: 'Overcomes skepticism and transforms interest into genuine trust.',
    },
    {
      stepNumber: 4,
      stageName: 'Stage 4: Trust Reinforcement (30-60s)',
      visitorPsychology: 'Reassurance & Risk Reduction ("Is working with them safe?")',
      conversionReasoning: 'Address buying objections, guarantees, and peer endorsements.',
      contentToPresent: `Client feedback, trust guarantees, and milestone FAQs.`,
      conversionRole: 'Removes purchasing friction and handles sales objections upfront.',
    },
    {
      stepNumber: 5,
      stageName: 'Stage 5: Conversion Action (60s+)',
      visitorPsychology: 'Conviction & Decision ("How do I get started?")',
      communicationPurpose: 'Direct the visitor to a single, focused booking or inquiry gateway.',
      contentToPresent: `Calendar booking widget + 15-minute discovery consultation CTA.`,
      conversionRole: 'Converts validated trust into pipeline leads.',
    } as any,
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

  let alignmentScore = 75;

  // Check 1: Proof vs Positioning Gap
  if (equippedCount === 0 && proofAssets.length === 0) {
    alignmentScore -= 20;
    diagnostics.push({
      id: 'diag_proof_gap',
      severity: 'warning',
      title: '⚠ PROOF → POSITIONING GAP DETECTED',
      positioningClaim: `Claims expert authority as a ${position}`,
      actualEvidenceOrWork: 'No proof assets currently equipped or created in Step 2.',
      recommendation: 'Complete at least 1 self-initiated proof asset or live demonstration in Step 2 to anchor your claim.',
      impactedSection: 'Proof & Evidence Section',
    });
  } else {
    diagnostics.push({
      id: 'diag_proof_aligned',
      severity: 'success',
      title: '✓ POSITIONING & PROOF ALIGNED',
      positioningClaim: `Claims expert authority as a ${position}`,
      actualEvidenceOrWork: `${proofAssets.length || equippedCount} verified proof asset(s) supporting core positioning.`,
      recommendation: 'Position these proof assets near your primary headline for maximum impact.',
      impactedSection: 'Hero & Proof Section',
    });
  }

  // Check 2: Core Promise Alignment
  if (mod3State.coreTrustPromise) {
    diagnostics.push({
      id: 'diag_promise_aligned',
      severity: 'success',
      title: '✓ TRUST PROMISE ALIGNED WITH OFFER',
      positioningClaim: mod3State.coreTrustPromise,
      actualEvidenceOrWork: 'Clear service scope and transparent delivery criteria established.',
      recommendation: 'Ensure trust promise appears prominently in FAQ and offer tier callouts.',
      impactedSection: 'Trust & FAQ Section',
    });
  }

  const verdict = alignmentScore >= 80
    ? 'High Alignment — All profile & portfolio sections reinforce the same core authority perception.'
    : 'Moderate Alignment — Minor gaps detected between positioning claims and supporting proof assets.';

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
    title: 'Refine Profile Message Hierarchy',
    description: 'Structure your public bio around the 6-layer message hierarchy (Who You Are → What You Do → Proof).',
    impact: 'High Impact',
    category: 'Profile',
    isCompleted: false,
  });

  actions.push({
    id: 'next_2',
    stepNumber: step++,
    title: 'Reorganize Portfolio Sections by Conversion Rationale',
    description: 'Sequence your website layout so positioning comes first, followed by proof assets and service scope.',
    impact: 'High Impact',
    category: 'Portfolio',
    isCompleted: false,
  });

  if (proofAssets.length > 0) {
    actions.push({
      id: 'next_3',
      stepNumber: step++,
      title: `Embed Primary Proof Asset "${proofAssets[0].title}" Near Hero`,
      description: 'Position your strongest verified demonstration immediately after your main headline.',
      impact: 'Very High Impact',
      category: 'Proof',
      isCompleted: false,
    });
  } else if (equippedCount === 0) {
    actions.push({
      id: 'next_3',
      stepNumber: step++,
      title: 'Prepare 1 High-Impact Demonstration Project',
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
      title: 'Resolve Diagnostic Alignment Warnings',
      description: 'Address detected positioning gaps before launching your public authority pack.',
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
    keyEvidencePlacement: evidencePlacements[0]?.recommendedPlacement || 'Hero & Proof Showcase',
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
