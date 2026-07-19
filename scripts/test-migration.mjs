/**
 * Migration v2→v3 pure-function test.
 * Calls the migration logic directly (no Zustand, no localStorage).
 */
const v2State = {
  version: 2,
  contentGeneratorVersion: 2,
  offerId: null,
  phase1OfferId: null,
  service: null,
  market: null,
  niche: null,
  positioning: '',
  offerType: 'one_time_project',
  deliverables: ['UX Audit Report', 'Wireframes', 'User Flow Diagram'],
  uniqueMechanism: 'User-First Information Architecture',
  scopeLimits: {
    revisionCount: 2,
    communicationMethod: 'Slack',
    responseTime: '24 hours',
    deliveryTime: '3-4 weeks for full website design',
    includedRounds: 2,
  },
  valueAmplifier: 'User Testing and Validation',
  pricingModel: 'flat_rate',
  finalPrice: 50,
  tieredPricing: { starterPrice: null, proPrice: null, premiumPrice: null },
  valueBasedPricing: { estimatedClientValue: null, impactLevel: '', suggestedPriceRange: '' },
  proposalSummary: {
    headline: 'Product UI Design Proposal',
    problem: 'Your AI tool lacks a cohesive UX',
    solution: 'I will design a complete interface',
    deliverables: ['UX Audit Report', 'Wireframes', 'User Flow Diagram'],
    timeline: '4 weeks',
    pricing: '$50 flat rate',
    nextSteps: 'Schedule kickoff',
  },
  offerBlueprint: {
    productizedService: 'Product UI Design One-Time Project',
    offerName: 'Product UI Design One-Time Project',
    whoItIsFor: 'SaaS founders needing a UI refresh',
    problemItSolves: 'Poor user experience hurting retention',
    corePromise: 'A clean interface your users will love',
    deliverables: ['UX Audit Report', 'Wireframes', 'User Flow Diagram'],
    uniqueMechanism: 'User-First Information Architecture',
    scopeLimits: {
      revisionCount: 2,
      communicationMethod: 'Slack',
      responseTime: '24 hours',
      deliveryTime: '3-4 weeks for full website design',
      includedRounds: 2,
    },
    valueAmplifier: 'User Testing and Validation',
    timeline: '4 weeks',
    pricingModel: 'flat_rate',
    finalPrice: 50,
    tieredPricing: { starterPrice: null, proPrice: null, premiumPrice: null },
    valueBasedPricing: { estimatedClientValue: null, impactLevel: '', suggestedPriceRange: '' },
    pricingStructure: '$50 — Flat Rate',
    whyThisWorks: 'Focused design sprints deliver results quickly',
    nextStepCTA: 'Book a discovery call to start',
    proposalSummary: {
      headline: 'Product UI Design Proposal',
      problem: 'Your AI tool lacks a cohesive UX',
      solution: 'I will design a complete interface',
      deliverables: ['UX Audit Report', 'Wireframes', 'User Flow Diagram'],
      timeline: '4 weeks',
      pricing: '$50 flat rate',
      nextSteps: 'Schedule kickoff',
    },
  },
  currentStep: 'offer_blueprint',
  completedSteps: [
    'offer_type', 'deliverables', 'unique_mechanism',
    'scope_protection', 'value_amplifier', 'pricing', 'proposal_summary',
  ],
};

// -------- Migration v2→v3 logic (copied from store.ts) --------

function defaultScopeLimits() {
  return { revisionCount: 2, communicationMethod: '', responseTime: '', deliveryTime: '', includedRounds: 2 };
}
function defaultProposalSummary() {
  return { headline: '', problem: '', solution: '', deliverables: [], timeline: '', pricing: '', nextSteps: '' };
}
function defaultTieredPricing() {
  return { starterPrice: null, proPrice: null, premiumPrice: null };
}
function defaultValueBasedPricing() {
  return { estimatedClientValue: null, impactLevel: '', suggestedPriceRange: '' };
}

function migrateV2toV3(persisted) {
  const old = persisted;
  const oldDeliveryTime = old.scopeLimits?.deliveryTime ?? '';
  const mechanismObsolete = old.uniqueMechanism === 'User-First Information Architecture';
  const amplifierObsolete = old.valueAmplifier === 'User Testing and Validation';
  const priceObsolete = old.finalPrice === 50;
  const deliveryObsolete = typeof oldDeliveryTime === 'string' && (
    oldDeliveryTime.includes('3-4 weeks')
    || oldDeliveryTime.includes('3\u20134 weeks')
    || oldDeliveryTime.includes('full website design')
  );

  return {
    contentGeneratorVersion: 3,
    offerId: old.offerId ?? null,
    phase1OfferId: old.phase1OfferId ?? null,
    service: null,
    market: null,
    niche: null,
    positioning: '',
    offerType: old.offerType ?? null,
    deliverables: Array.isArray(old.deliverables) ? old.deliverables : [],
    uniqueMechanism: mechanismObsolete ? '' : (typeof old.uniqueMechanism === 'string' ? old.uniqueMechanism : ''),
    scopeLimits: old.scopeLimits && typeof old.scopeLimits === 'object'
      ? { ...defaultScopeLimits(), ...old.scopeLimits, deliveryTime: deliveryObsolete ? '' : oldDeliveryTime }
      : defaultScopeLimits(),
    valueAmplifier: amplifierObsolete ? '' : (typeof old.valueAmplifier === 'string' ? old.valueAmplifier : ''),
    pricingModel: old.pricingModel ?? null,
    finalPrice: priceObsolete ? null : (typeof old.finalPrice === 'number' ? old.finalPrice : null),
    tieredPricing: old.tieredPricing && typeof old.tieredPricing === 'object'
      ? { ...defaultTieredPricing(), ...old.tieredPricing }
      : defaultTieredPricing(),
    valueBasedPricing: old.valueBasedPricing && typeof old.valueBasedPricing === 'object'
      ? { ...defaultValueBasedPricing(), ...old.valueBasedPricing }
      : defaultValueBasedPricing(),
    proposalSummary: old.proposalSummary && typeof old.proposalSummary === 'object'
      ? { ...defaultProposalSummary(), ...old.proposalSummary }
      : defaultProposalSummary(),
    offerBlueprint: null,
    currentStep: typeof old.currentStep === 'string' ? old.currentStep : 'offer_type',
    completedSteps: Array.isArray(old.completedSteps) ? old.completedSteps : [],
    fieldProvenance: {
      uniqueMechanism: { source: mechanismObsolete ? 'auto_generated' : 'user_selected', generatorVersion: 3 },
      valueAmplifier: { source: amplifierObsolete ? 'auto_generated' : 'user_selected', generatorVersion: 3 },
      finalPrice: { source: priceObsolete ? 'auto_generated' : 'user_edited', generatorVersion: 3 },
      deliveryTime: { source: deliveryObsolete ? 'auto_generated' : 'user_edited', generatorVersion: 3 },
      deliverables: { source: 'user_selected', generatorVersion: 3 },
      offerBlueprint: { source: 'auto_generated', generatorVersion: 3 },
    },
  };
}

// -------- Run migration --------

console.log('## 1. Input v2 state');
console.log(JSON.stringify({
  version: v2State.version,
  offerType: v2State.offerType,
  deliverables: v2State.deliverables,
  uniqueMechanism: v2State.uniqueMechanism,
  valueAmplifier: v2State.valueAmplifier,
  finalPrice: v2State.finalPrice,
  deliveryTime: v2State.scopeLimits.deliveryTime,
  offerBlueprint: v2State.offerBlueprint ? '<present>' : null,
  completedSteps: v2State.completedSteps.length + ' steps',
}, null, 2));

const result = migrateV2toV3(v2State);

console.log('\n## 2. Migrated v3 state');
console.log(JSON.stringify({
  contentGeneratorVersion: result.contentGeneratorVersion,
  offerType: result.offerType,
  deliverables: result.deliverables,
  uniqueMechanism: result.uniqueMechanism,
  valueAmplifier: result.valueAmplifier,
  finalPrice: result.finalPrice,
  deliveryTime: result.scopeLimits.deliveryTime,
  offerBlueprint: result.offerBlueprint,
  completedSteps: result.completedSteps.length + ' steps',
  proposalHeadline: result.proposalSummary.headline,
}, null, 2));

console.log('\n## 3. Field provenance');
console.log(JSON.stringify(result.fieldProvenance, null, 2));

// -------- Assertions --------
function PASS(msg) { console.log(`  ✓ ${msg}`); }
function FAIL(msg) { console.log(`  ✗ ${msg}`); }

let allPass = true;
const check = (label, cond) => { if (cond) PASS(label); else { FAIL(label); allPass = false; } };

console.log('\n## 4. Assertions');

check('contentGeneratorVersion → 3', result.contentGeneratorVersion === 3);
check('offerType preserved', result.offerType === 'one_time_project');
check('deliverables preserved', JSON.stringify(result.deliverables) === JSON.stringify(v2State.deliverables));
check('uniqueMechanism cleared (obsolete)', result.uniqueMechanism === '');
check('valueAmplifier cleared (obsolete)', result.valueAmplifier === '');
check('finalPrice null (obsolete $50)', result.finalPrice === null);
check('deliveryTime cleared (obsolete default)', result.scopeLimits.deliveryTime === '');
check('offerBlueprint null', result.offerBlueprint === null);
check('pricingModel preserved', result.pricingModel === 'flat_rate');
check('scopeLimits revisionCount preserved', result.scopeLimits.revisionCount === 2);
check('proposalSummary headline preserved', result.proposalSummary.headline === 'Product UI Design Proposal');
check('currentStep preserved', result.currentStep === 'offer_blueprint');
check('completedSteps preserved', result.completedSteps.length === 7);
check('service null (re-hydrated by bridge)', result.service === null);
check('fieldProvenance has 6 fields', Object.keys(result.fieldProvenance).length === 6);
check('fieldProvenance.uniqueMechanism source auto_generated', result.fieldProvenance.uniqueMechanism.source === 'auto_generated');
check('fieldProvenance.deliverables source user_selected', result.fieldProvenance.deliverables.source === 'user_selected');
check('fieldProvenance.offerBlueprint source auto_generated', result.fieldProvenance.offerBlueprint.source === 'auto_generated');

console.log(`\n## 5. Result: ${allPass ? 'ALL PASS' : 'SOME FAILED'}`);
if (!allPass) process.exit(1);
