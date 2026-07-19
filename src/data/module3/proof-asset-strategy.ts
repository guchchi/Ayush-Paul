import type { AuthorityProfile, ProofAssetStrategy, ProofCategory, StrategyProofAsset, ProofGapAnalysis, ProofCreationAction, TrustConnection } from '../../types/module3';

export interface ProofAssetStrategyContext {
  authorityProfile: AuthorityProfile | null;
  mod1ServiceId: string | null;
  mod1MarketId: string | null;
  mod1NicheId: string | null;
  mod2OfferType: string | null;
  mod2Deliverables: string[];
  existingProofInventory: string;
}

function getBuyerLabel(marketId: string | null, nicheId: string | null): string {
  if (nicheId) return nicheId.replace(/_/g, ' ');
  if (marketId) return marketId.replace(/_/g, ' ');
  return 'your target market';
}

function calculateConfidence(ctx: ProofAssetStrategyContext): 'Strong' | 'Moderate' | 'Limited' {
  let score = 0;
  if (ctx.mod1NicheId) score += 1;
  if (ctx.mod2Deliverables && ctx.mod2Deliverables.length > 0) score += 1;
  if (ctx.existingProofInventory && ctx.existingProofInventory.trim().length > 10) score += 1;

  if (score === 3) return 'Strong';
  if (score >= 1) return 'Moderate';
  return 'Limited';
}

export function generateProofAssetStrategyForProfile(ctx: ProofAssetStrategyContext): ProofAssetStrategy {
  if (!ctx.authorityProfile) {
    throw new Error('Authority Profile is required to generate a Proof Asset Strategy.');
  }
  if (!ctx.mod1MarketId) {
    throw new Error('Market context is required to generate a Proof Asset Strategy.');
  }
  if (!ctx.mod2OfferType) {
    throw new Error('Offer context is required to generate a Proof Asset Strategy.');
  }

  const buyer = getBuyerLabel(ctx.mod1MarketId, ctx.mod1NicheId);
  const position = ctx.authorityProfile.position;
  
  // 1. Trust Requirement
  let trustRequirement: string;
  if (position === 'builder') {
    trustRequirement = `As a Builder, your primary trust requirement is proving execution quality. ${buyer} need to see undeniable evidence that your deliverables meet their standards before they commit.`;
  } else if (position === 'auditor') {
    trustRequirement = `As an Auditor, your primary trust requirement is proving diagnostic accuracy. ${buyer} need to see that you can identify unseen problems and measure them objectively.`;
  } else if (position === 'deconstructor') {
    trustRequirement = `As a Deconstructor, your primary trust requirement is proving strategic clarity. ${buyer} need to see that your mental models and frameworks actually solve complex problems.`;
  } else {
    trustRequirement = `As a Practitioner, your primary trust requirement is proving real-world experience. ${buyer} need to see that you are actively doing the work and learning from the trenches.`;
  }

  // 2. Required Proof Categories
  const requiredProofCategories: ProofCategory[] = [];
  if (position === 'builder') {
    requiredProofCategories.push(
      { id: 'cat-1', name: 'Before & After Transformations', purpose: 'Direct comparisons of starting states vs your final deliverables.', trustObjective: 'Proves tangible capability.' },
      { id: 'cat-2', name: 'Process Walkthroughs', purpose: 'Documentation of how you build.', trustObjective: 'Proves your results are repeatable, not accidental.' }
    );
  } else if (position === 'auditor') {
    requiredProofCategories.push(
      { id: 'cat-1', name: 'Diagnostic Teardowns', purpose: 'Public audits of existing systems.', trustObjective: 'Proves your analytical eye.' },
      { id: 'cat-2', name: 'Data/Impact Reports', purpose: 'Measurable improvements tied to your audits.', trustObjective: 'Proves your insights lead to ROI.' }
    );
  } else if (position === 'deconstructor') {
    requiredProofCategories.push(
      { id: 'cat-1', name: 'Framework Breakdowns', purpose: 'Visual or written explanations of your methods.', trustObjective: 'Proves your strategic thinking.' },
      { id: 'cat-2', name: 'Client Success Stories', purpose: 'Testimonials tied to specific outcomes.', trustObjective: 'Proves your frameworks work in practice.' }
    );
  } else {
    requiredProofCategories.push(
      { id: 'cat-1', name: 'In-the-Trenches Documentation', purpose: 'Behind the scenes of your own work.', trustObjective: 'Proves you are actively practicing.' },
      { id: 'cat-2', name: 'Implementation Case Studies', purpose: 'Step-by-step breakdown of how you got a result.', trustObjective: 'Proves you know how to execute.' }
    );
  }

  // 3. Priority Proof Assets
  const priorityProofAssets: StrategyProofAsset[] = [];
  if (position === 'builder') {
    priorityProofAssets.push(
      { id: 'asset-1', name: 'Signature Case Study', category: 'cat-1', recommendationReason: 'Highest impact on trust for premium deliverables.', trustImpact: 'Critical', executionPriority: 'pending' },
      { id: 'asset-2', name: 'Visual Portfolio Grid', category: 'cat-1', recommendationReason: 'Immediate visual proof of quality.', trustImpact: 'High', executionPriority: 'pending' },
      { id: 'asset-3', name: 'Workflow Demo Video', category: 'cat-2', recommendationReason: 'Proves execution speed and tool mastery.', trustImpact: 'High', executionPriority: 'pending' }
    );
  } else if (position === 'auditor') {
    priorityProofAssets.push(
      { id: 'asset-1', name: 'Deep-Dive Teardown', category: 'cat-1', recommendationReason: 'Demonstrates your analytical framework in public.', trustImpact: 'Critical', executionPriority: 'pending' },
      { id: 'asset-2', name: 'Client ROI Case Study', category: 'cat-2', recommendationReason: 'Connects your strategy to bottom-line results.', trustImpact: 'High', executionPriority: 'pending' },
      { id: 'asset-3', name: 'Audit Scorecard Template', category: 'cat-1', recommendationReason: 'Makes your abstract thinking tangible.', trustImpact: 'Medium', executionPriority: 'pending' }
    );
  } else {
    priorityProofAssets.push(
      { id: 'asset-1', name: 'Core Framework Guide', category: 'cat-1', recommendationReason: 'Centralizes your philosophy into a shareable asset.', trustImpact: 'Critical', executionPriority: 'pending' },
      { id: 'asset-2', name: 'Client Transformation Interview', category: 'cat-2', recommendationReason: 'Third-party validation of your method.', trustImpact: 'High', executionPriority: 'pending' },
      { id: 'asset-3', name: 'Methodology Diagram', category: 'cat-1', recommendationReason: 'Makes your abstract thinking tangible.', trustImpact: 'Medium', executionPriority: 'pending' }
    );
  }

  // 4. Gap Analysis
  const hasInventory = ctx.existingProofInventory && ctx.existingProofInventory.trim().length > 10;
  let gapAnalysis: ProofGapAnalysis;
  if (!hasInventory) {
    gapAnalysis = {
      existingStrengths: ['Blank slate allows for perfectly aligned new assets.'],
      missingTrustSignals: ['Lack of tangible proof makes your authority positioning rely entirely on claims.', `No evidence of success in ${ctx.mod1MarketId || 'the market'}.`],
      recommendedImprovements: ['Focus on extracting proof from past projects before creating net-new assets.']
    };
  } else {
    gapAnalysis = {
      existingStrengths: ['You have a baseline of proof to work from.', 'Demonstrated ability to produce assets.'],
      missingTrustSignals: ['The connection between your past work and your current Authority Position may be unclear to prospects.'],
      recommendedImprovements: ['Repackage your existing inventory to explicitly highlight your new strategic positioning.', 'Filter out assets that contradict your new Authority Profile.']
    };
  }

  // 5. Creation Plan
  const proofCreationPlan: ProofCreationAction[] = [
    { category: 'start_doing', action: 'Audit Past Work', rationale: 'To find raw materials for your Priority Assets.', expectedTrustImpact: 'High' },
    { category: 'next_steps', action: 'Draft the Signature Asset', rationale: 'To anchor your portfolio with one undeniable piece of proof.', expectedTrustImpact: 'Critical' },
    { category: 'continue_doing', action: 'Distribute as Content', rationale: 'To build public authority over time.', expectedTrustImpact: 'Medium' }
  ];

  // 6. Trust Connection
  const trustConnection: TrustConnection[] = priorityProofAssets.map(asset => ({
    proofAssetId: asset.id,
    supportedBelief: `Belief that you deliver high quality as a ${position}.`,
    explanation: `This asset directly supports your core trust promise: "${ctx.authorityProfile!.coreTrustPromise}"`
  }));

  const confidence = calculateConfidence(ctx);

  return {
    strategyVersion: 1,
    authorityProfileVersion: ctx.authorityProfile.version,
    trustRequirement,
    requiredProofCategories,
    priorityProofAssets,
    proofGapAnalysis: gapAnalysis,
    proofCreationPlan,
    trustConnection,
    confidence,
    status: 'draft'
  };
}
