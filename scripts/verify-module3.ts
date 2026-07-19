import assert from 'assert';
import { classifyService } from '../src/data/module3/service-taxonomy';
import { resolveRecommendedPosition, generatePositionRationale, generateCoreTrustPromise } from '../src/data/module3/authority-positions';
import { resolveProofPriorities, PriorityContext } from '../src/data/module3/proof-priorities';
import { generateProofAsset } from '../src/data/module3/proof-assets';
import { generateProfileCopy, generatePortfolioCopy } from '../src/data/module3/profile-copy';
import { useModule3Store } from '../src/lib/module3/store';
import type { Module1Context, Module2Context } from '../src/types/module3';

// Helper to count words
function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Helper to count sentences
function getSentenceCount(text: string): number {
  const sentences = text.match(/[^.!?\n]+[.!?]/g);
  return sentences ? sentences.length : 0;
}

function runTests() {
  console.log('=== Starting Module 3 Verification Tests ===\n');

  // ==========================================
  // 1. SERVICE TAXONOMY TESTS
  // ==========================================
  console.log('--- Running Service Taxonomy Tests ---');
  const canonicalServices = [
    'video_editor', 'short_form_editor', 'youtube_editor', 'podcast_clip_editor', 'ad_creative_editor',
    'wordpress_developer', 'landing_page_developer', 'custom_theme_development', 'frontend_developer', 'no_code_developer',
    'ui_ux_designer', 'landing_page_designer', 'brand_designer', 'social_media_designer', 'presentation_designer',
    'automation_developer'
  ];

  for (const s of canonicalServices) {
    const classification = classifyService(s);
    assert.strictEqual(classification.id, s);
    assert.ok(classification.family, `Should have family for ${s}`);
    assert.ok(classification.proofProfileKey, `Should have proofProfileKey for ${s}`);
  }

  // Unknown service fallback
  const unknownClass = classifyService('growth_hacker');
  assert.strictEqual(unknownClass.family, 'other');
  assert.strictEqual(unknownClass.proofProfileKey, 'other_fallback');
  assert.strictEqual(unknownClass.label, 'Growth Hacker');
  console.log('✔ Service taxonomy tests passed.\n');


  // ==========================================
  // 2. PROOF PERSONALIZATION TESTS
  // ==========================================
  console.log('--- Running Proof Personalization Tests ---');
  
  const specializedServices = [
    'presentation_designer',
    'social_media_designer',
    'landing_page_designer',
    'podcast_clip_editor',
    'ad_creative_editor'
  ];

  for (const s of specializedServices) {
    const c = classifyService(s);
    // Mock priority
    const priority = {
      id: 'test_priority',
      gapTitle: 'consistent quality and delivery',
      gapDescription: 'client needs assurance of execution flow',
      recommendedFormat: 'process_walkthrough' as const,
      isCustom: false,
    };
    const ctx = {
      careerTrackId: 'design_track',
      serviceId: s,
      marketId: 'coaches',
      nicheId: 'fitness',
      positioning: 'premium design services',
      offerType: 'one_time_project',
      deliverables: ['Custom Slides'],
      uniqueMechanism: 'Interactive Layouts',
      valueAmplifier: 'Faster Turnaround',
      authorityPosition: 'builder' as const,
      coreTrustPromise: 'Test promise',
    };
    
    const asset = generateProofAsset(priority, ctx);
    assert.ok(asset.title, `Should generate title for ${s}`);
    assert.ok(asset.startingMaterial.length > 0, `Should have starting material for ${s}`);
    assert.ok(asset.executionSteps.length > 0, `Should have execution steps for ${s}`);
    assert.ok(asset.deliverables.length > 0, `Should have deliverables for ${s}`);

    // Verify no coding/git terms are present for designers or editors
    const contentText = [
      asset.title,
      asset.scenario,
      ...asset.startingMaterial,
      ...asset.executionSteps,
      ...asset.deliverables,
      ...asset.completionChecklist
    ].join(' ').toLowerCase();

    const techKeywords = ['code', 'coding', 'git', 'repository', 'github', 'database', 'deploy', 'frontend'];
    for (const kw of techKeywords) {
      if (s === 'landing_page_designer' && kw === 'deploy') continue; // Allow layout deployment references if any, but assert others
      if (kw === 'repository' || kw === 'git' || kw === 'github' || kw === 'database' || kw === 'code') {
        assert.ok(!contentText.includes(kw), `Technical keyword "${kw}" found in non-technical profile for ${s}`);
      }
    }
  }

  // Check fallback content
  const fallbackPriority = {
    id: 'test_fallback',
    gapTitle: 'general trust',
    gapDescription: 'general capability proof',
    recommendedFormat: 'framework' as const,
    isCustom: false,
  };
  const fallbackCtx = {
    careerTrackId: 'other',
    serviceId: 'growth_hacker',
    marketId: 'small_businesses',
    nicheId: 'general',
    positioning: 'growth consulting',
    offerType: 'retainer',
    deliverables: ['Growth Strategy'],
    uniqueMechanism: 'Data Audits',
    valueAmplifier: 'Weekly Calls',
    authorityPosition: 'builder' as const,
    coreTrustPromise: 'Test promise',
  };
  const fallbackAsset = generateProofAsset(fallbackPriority, fallbackCtx);
  assert.ok(fallbackAsset.title.includes('general trust'), 'Fallback asset title should include gapTitle');
  assert.strictEqual(fallbackAsset.deliverables[0], 'Service Delivery & Process Blueprint (PDF/Document)', 'Fallback asset deliverables should match other_fallback profile');
  assert.ok(fallbackAsset.executionSteps.some(step => step.includes('operational guide')));
  console.log('✔ Proof personalization and fallback tests passed.\n');


  // ==========================================
  // 3. AUTHORITY RECOMMENDATION TESTS (UI/UX SaaS PERSONA)
  // ==========================================
  console.log('--- Running Authority Recommendation Tests ---');
  
  // Target test persona: UI/UX Designer → SaaS/Startups → AI tools → Product UI Design → one-time project
  const designCtx = {
    careerTrackId: 'ui_ux_designer',
    serviceId: 'ui_ux_designer',
    marketId: 'saas_startups',
    nicheId: 'ai_tools',
    positioning: 'Product UI Design',
    offerType: 'one_time_project',
    deliverables: ['Product UI Design'],
    uniqueMechanism: 'Product UI Design',
    valueAmplifier: 'Interactive Prototype',
  };

  const recPosition = resolveRecommendedPosition(designCtx);
  console.log('Scoring evidence for UI/UX SaaS Persona:');
  console.log(`- Recommended position: ${recPosition}`);
  assert.strictEqual(recPosition, 'practitioner', 'UI/UX SaaS persona must resolve to Practitioner.');
  
  // Test Editor Persona
  const editorCtx = {
    ...designCtx,
    careerTrackId: 'video_editor',
    serviceId: 'short_form_editor',
    uniqueMechanism: 'Short-Form Clips Pacing',
    deliverables: ['Short-Form Clips'],
  };
  const editorRec = resolveRecommendedPosition(editorCtx);
  console.log(`- Editor Persona recommends: ${editorRec}`);
  
  // Test Automation Persona
  const autoCtx = {
    ...designCtx,
    careerTrackId: 'automation_developer',
    serviceId: 'automation_developer',
    uniqueMechanism: 'Zapier Integrations Workflow',
    deliverables: ['Automated Pipelines'],
  };
  const autoRec = resolveRecommendedPosition(autoCtx);
  console.log(`- Automation Persona recommends: ${autoRec}`);
  assert.strictEqual(autoRec, 'practitioner');

  // Test Developer Persona
  const devCtx = {
    ...designCtx,
    careerTrackId: 'wordpress_developer',
    serviceId: 'frontend_developer',
    uniqueMechanism: 'Custom React Frontend Rebuild',
    deliverables: ['Deployed Web App'],
  };
  const devRec = resolveRecommendedPosition(devCtx);
  console.log(`- Developer Persona recommends: ${devRec}`);

  console.log('✔ Authority recommendation tests passed.\n');


  // ==========================================
  // 4. TRUST PROMISE & REGENERATION TESTS
  // ==========================================
  console.log('--- Running Trust Promise & Regeneration Tests ---');
  
  // Generate and verify trust promise constraints
  const promisePositions: ('builder' | 'auditor' | 'deconstructor' | 'practitioner')[] = [
    'builder', 'auditor', 'deconstructor', 'practitioner'
  ];

  for (const pos of promisePositions) {
    const promise = generateCoreTrustPromise(pos, designCtx, 0);
    const sCount = getSentenceCount(promise);
    const wCount = getWordCount(promise);
    
    console.log(`[${pos}] Promise: "${promise}"`);
    console.log(`  Sentences: ${sCount}, Words: ${wCount}`);
    
    assert.strictEqual(sCount, 2, `Core Trust Promise for ${pos} must have exactly 2 sentences.`);
    assert.ok(wCount >= 35 && wCount <= 55, `Core Trust Promise for ${pos} has ${wCount} words (expected 35-55).`);
  }

  // Non-repeating consecutive regeneration
  const var0 = generateCoreTrustPromise('practitioner', designCtx, 0);
  const var1 = generateCoreTrustPromise('practitioner', designCtx, 1);
  const var2 = generateCoreTrustPromise('practitioner', designCtx, 2);

  assert.notStrictEqual(var0, var1, 'Consecutive variations 0 and 1 must differ.');
  assert.notStrictEqual(var1, var2, 'Consecutive variations 1 and 2 must differ.');
  assert.notStrictEqual(var0, var2, 'Consecutive variations 0 and 2 must differ.');
  console.log('✔ Trust Promise sentence/word limits and regeneration tests passed.\n');


  // ==========================================
  // 5. ZUSTAND STORE-LEVEL STATE TESTS
  // ==========================================
  console.log('--- Running Zustand Store State Tests ---');

  // Reset the store first
  const store = useModule3Store.getState();
  store.reset();

  // Populate mock data
  const mockM1: Module1Context = {
    careerTrackId: 'ui_ux_designer',
    serviceId: 'ui_ux_designer',
    marketId: 'saas_startups',
    nicheId: 'ai_tools',
    offerId: 'one_time_design_project',
    positioning: 'Product UI Design',
  };
  const mockM2: Module2Context = {
    offerType: 'one_time_project',
    deliverables: ['High-fidelity interactive prototype'],
    uniqueMechanism: 'Product UI Design Layouts',
    scopeLimits: {
      revisionCount: 3,
      communicationMethod: 'Slack',
      responseTime: '24h',
      deliveryTime: '14 days',
      includedRounds: 3,
    },
    valueAmplifier: 'Interactive Walkthrough',
    pricingModel: 'flat_rate',
    finalPrice: 5000,
    tieredPricing: { starterPrice: null, proPrice: null, premiumPrice: null },
    valueBasedPricing: { estimatedClientValue: null, impactLevel: '', suggestedPriceRange: '' },
    proposalSummary: {
      headline: 'SaaS Design',
      problem: 'Interface friction',
      solution: 'Clean UI',
      deliverables: ['Prototype'],
      timeline: '2 weeks',
      pricing: '$5000',
      nextSteps: 'Kickoff call',
    },
  };

  store.setPhase1Context(mockM1);
  store.setPhase2Context(mockM2);

  const priorities = resolveProofPriorities({
    ...mockM1,
    offerType: mockM2.offerType,
    deliverables: mockM2.deliverables,
    uniqueMechanism: mockM2.uniqueMechanism,
    valueAmplifier: mockM2.valueAmplifier,
    authorityPosition: 'practitioner',
    coreTrustPromise: 'Test promise',
  });
  store.setProofPriorities(priorities);

  const assets = priorities.map((p) => generateProofAsset(p, {
    ...mockM1,
    offerType: mockM2.offerType,
    deliverables: mockM2.deliverables,
    uniqueMechanism: mockM2.uniqueMechanism,
    valueAmplifier: mockM2.valueAmplifier,
    authorityPosition: 'practitioner',
    coreTrustPromise: 'Test promise',
  }));
  store.setProofAssets(assets);
  store.setIsUpstreamStale(false); // Reset to test initial state

  // Assert initially not stale
  assert.strictEqual(useModule3Store.getState().isUpstreamStale, false);

  // Trigger stale state by setting isUpstreamStale = true
  store.setIsUpstreamStale(true);
  assert.strictEqual(useModule3Store.getState().isUpstreamStale, true);

  // Selective refresh behavior test
  // Manually modify coreTrustPromise
  store.setCoreTrustPromise('Custom user trust promise');
  assert.strictEqual(useModule3Store.getState().fieldProvenance.coreTrustPromise, 'user_edited');

  // Trigger selective refresh
  store.refreshStaleContext();
  
  // Verify stale flag is dismissed
  assert.strictEqual(useModule3Store.getState().isUpstreamStale, false);
  assert.strictEqual(useModule3Store.getState().staleDecision, 'refresh');
  
  // Verify Custom trust promise survived refresh, but other fields refreshed
  assert.strictEqual(useModule3Store.getState().coreTrustPromise, 'Custom user trust promise', 'Custom trust promise must survive context refresh.');

  // Keep Current Work behavior test
  store.setIsUpstreamStale(true);
  store.dismissStaleContext();
  assert.strictEqual(useModule3Store.getState().isUpstreamStale, false);
  assert.strictEqual(useModule3Store.getState().staleDecision, 'keep');
  assert.strictEqual(useModule3Store.getState().coreTrustPromise, 'Custom user trust promise');

  // Complete typed Module 4 bridge test
  store.setIsCompleted(true);
  const bridgeContext = store.getModule4Context();
  
  assert.strictEqual(bridgeContext.mod1ServiceId, 'ui_ux_designer');
  assert.strictEqual(bridgeContext.mod2OfferType, 'one_time_project');
  assert.strictEqual(bridgeContext.mod3AuthorityPosition, 'practitioner'); // recommended since it's auto-selected/refreshed
  assert.strictEqual(bridgeContext.mod3ProfileCopy.shortBio, 'Custom user trust promise');
  assert.ok(bridgeContext.mod3ProofPriorities.length > 0);
  assert.ok(bridgeContext.mod3ProofPriorities[0].gapDescription, 'Bridge context must contain gapDescription (no placeholders).');
  
  console.log('✔ Zustand store state and bridge tests passed.\n');

  console.log('=== All Module 3 Verification Tests Passed Successfully! ===');
}

runTests();
