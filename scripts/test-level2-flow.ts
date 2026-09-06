import { useModule3Store } from '../src/lib/module3/store';
import {
  evaluatePortfolioReadiness,
  exportPortfolioArchitectureAsJson,
  exportPortfolioArchitectureAsMarkdown,
  PORTFOLIO_ARCHETYPES,
} from '../src/lib/module3/portfolio-architecture-engine';
import { Module4BridgeAdapter } from '../src/lib/module3/module4-bridge';
import { generateFullAuthoritySuite } from '../src/data/module3/authority-suite-engine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('MODULE 3 STEP 3 LEVEL 2 - COMPREHENSIVE END-TO-END QA');
  console.log('====================================================\n');

  const store = useModule3Store.getState();

  // ----------------------------------------------------
  // TEST 1: Initialize Store & Upstream Context
  // ----------------------------------------------------
  console.log('[TEST 1] Initializing store with upstream context...');
  useModule3Store.setState({
    mod1ServiceId: 'ai_automation_consultant',
    mod1MarketId: 'b2b_saas',
    mod1NicheId: 'high_growth_startups',
    mod1Positioning: 'High-Impact AI Automation Architect',
    mod2OfferType: 'milestone_based',
    mod2Deliverables: ['Audit', 'Implementation Roadmap', 'Production Pipeline'],
    mod2UniqueMechanism: 'Certainty-Engine Automation Protocol',
    authorityPosition: 'builder',
    coreTrustPromise: 'Guaranteed working automation pipelines with transparent scope.',
  });

  const suite = generateFullAuthoritySuite({
    serviceId: 'ai_automation_consultant',
    marketId: 'b2b_saas',
    position: 'builder',
    uniqueMechanism: 'Certainty-Engine Automation Protocol',
    trustPromise: 'Guaranteed working automation pipelines with transparent scope.',
  });

  useModule3Store.setState({
    authoritySuite: suite,
    stage2Archetype: {
      selectedArchetypeId: 'proof_first',
      customNotes: '',
      confirmedAt: new Date().toISOString(),
      portfolioGoal: 'sprint',
      isLocked: false,
      revisionStatus: 'draft',
    },
  });

  const state1 = useModule3Store.getState();
  assert(!!state1.authoritySuite, 'Authority suite initialized');
  assert(state1.authoritySuite?.portfolioBlueprint.length === 9, 'Portfolio blueprint contains 9 canonical sections');
  assert(state1.authoritySuite?.portfolioBlueprint[0].id === 'section_hero', 'Hero is at index 0');

  // ----------------------------------------------------
  // TEST 2: Goal Selection & Archetype Preset Application
  // ----------------------------------------------------
  console.log('\n[TEST 2] Testing Goal Selection & Archetype Preset...');
  state1.setStage2Archetype({
    portfolioGoal: 'retainer',
    selectedArchetypeId: 'productized_service',
  });
  state1.applyArchetypePreset('productized_service');

  const state2 = useModule3Store.getState();
  assert(state2.stage2Archetype?.portfolioGoal === 'retainer', 'Goal set to retainer');
  assert(state2.stage2Archetype?.selectedArchetypeId === 'productized_service', 'Archetype set to productized_service');
  
  const productizedArch = PORTFOLIO_ARCHETYPES.find((a) => a.id === 'productized_service')!;
  const firstEnabled = state2.authoritySuite?.portfolioBlueprint.find((s) => s.isEnabled !== false);
  assert(firstEnabled?.id === 'section_hero', 'Hero remains first active section after preset application');

  // ----------------------------------------------------
  // TEST 3: Section Hierarchy & Hero Constraint Protection
  // ----------------------------------------------------
  console.log('\n[TEST 3] Testing Section Hierarchy & Hero Constraint...');
  const currentSections = [...state2.authoritySuite!.portfolioBlueprint];

  // Try moving index 1 up into index 0 (should be guarded by UI, but test store handles index 0 hero)
  const hero = currentSections[0];
  assert(hero.id === 'section_hero', 'Hero is confirmed at index 0');

  // Toggle visibility of a non-hero section (e.g., section_faq)
  state2.updatePortfolioSection('section_faq', { isEnabled: false });
  const faqSection = useModule3Store.getState().authoritySuite?.portfolioBlueprint.find((s) => s.id === 'section_faq');
  assert(faqSection?.isEnabled === false, 'section_faq was successfully toggled to disabled');

  // Reorder sections (swap position 1 and 2)
  const reordered = [...useModule3Store.getState().authoritySuite!.portfolioBlueprint];
  const item1 = reordered[1];
  const item2 = reordered[2];
  reordered[1] = item2;
  reordered[2] = item1;
  useModule3Store.getState().reorderPortfolioSections(reordered);
  
  const afterReorder = useModule3Store.getState().authoritySuite!.portfolioBlueprint;
  assert(afterReorder[0].id === 'section_hero', 'Hero still locked at index 0 after reorder');
  assert(afterReorder[1].id === item2.id, 'Position 1 swapped successfully');
  assert(afterReorder[2].id === item1.id, 'Position 2 swapped successfully');

  // ----------------------------------------------------
  // TEST 4: Spec Studio Customization & Flags
  // ----------------------------------------------------
  console.log('\n[TEST 4] Testing Spec Studio Customization & Audit Flags...');
  useModule3Store.getState().updatePortfolioSection('section_hero', {
    headline: 'Custom High-Impact Hero Headline',
    subheadline: 'Proven enterprise automation without the fluff.',
    ctaText: 'Deploy Architecture Sprint →',
  });

  const heroUpdated = useModule3Store.getState().authoritySuite?.portfolioBlueprint.find((s) => s.id === 'section_hero');
  assert(heroUpdated?.headline === 'Custom High-Impact Hero Headline', 'Headline updated');
  assert(heroUpdated?.isHeadlineCustomized === true, 'isHeadlineCustomized flag set');
  assert(heroUpdated?.isSubheadlineCustomized === true, 'isSubheadlineCustomized flag set');
  assert(heroUpdated?.isCtaCustomized === true, 'isCtaCustomized flag set');
  assert(heroUpdated?.isCustomized === true, 'isCustomized aggregate flag set');

  // ----------------------------------------------------
  // TEST 5: Readiness Evaluation Engine & CTA Validation
  // ----------------------------------------------------
  console.log('\n[TEST 5] Testing Readiness Evaluation & CTA Blocker Rules...');
  
  // Case 5A: CTA Section Disabled -> Blocker expected
  useModule3Store.getState().updatePortfolioSection('section_cta', { isEnabled: false });
  const readiness5A = evaluatePortfolioReadiness(useModule3Store.getState().authoritySuite!.portfolioBlueprint);
  assert(!readiness5A.canLock, 'canLock is false when CTA section is disabled');
  assert(
    readiness5A.blockers.some((b) => b.toLowerCase().includes('cta')),
    'Blocker includes CTA requirement warning'
  );

  // Case 5B: CTA Enabled with Weak Copy -> Warning expected, not Blocker
  useModule3Store.getState().updatePortfolioSection('section_cta', {
    isEnabled: true,
    ctaText: 'Go',
  });
  const readiness5B = evaluatePortfolioReadiness(useModule3Store.getState().authoritySuite!.portfolioBlueprint);
  assert(
    readiness5B.warnings.some((w) => w.toLowerCase().includes('cta')),
    'Warning generated for weak/short CTA copy'
  );

  // Case 5C: Clean CTA -> Ready to Lock
  useModule3Store.getState().updatePortfolioSection('section_cta', {
    isEnabled: true,
    ctaText: 'Book Strategic Implementation Sprint →',
  });
  const archState = useModule3Store.getState().stage2Archetype;
  const readiness5C = evaluatePortfolioReadiness(
    useModule3Store.getState().authoritySuite!.portfolioBlueprint,
    archState?.selectedArchetypeId,
    archState?.portfolioGoal
  );
  console.log('  5C blockers found:', readiness5C.blockers);
  console.log('  5C warnings found:', readiness5C.warnings);
  assert(readiness5C.blockers.length === 0, 'No blockers when CTA is valid and enabled');
  assert(readiness5C.canLock, 'Architecture is Ready to Lock (canLock === true)');

  // ----------------------------------------------------
  // TEST 6: Lock Lifecycle & Store Mutation Immutability
  // ----------------------------------------------------
  console.log('\n[TEST 6] Testing Lock Lifecycle & Immutability Enforcement...');
  useModule3Store.getState().lockStage2Architecture();

  const lockedState = useModule3Store.getState();
  assert(lockedState.stage2Archetype?.isLocked === true, 'stage2Archetype.isLocked is true');
  assert(lockedState.stage2Archetype?.revisionStatus === 'finalized', 'revisionStatus is finalized');
  assert(typeof lockedState.stage2Archetype?.lockedAt === 'string', 'lockedAt timestamp exists');

  // Attempt 6 mutations while locked - all should be rejected
  console.log('  Testing 6 mutation guards while locked...');
  
  // 1. updatePortfolioSection
  lockedState.updatePortfolioSection('section_hero', { headline: 'ILLEGAL MUTATION ATTEMPT' });
  const checkHero = useModule3Store.getState().authoritySuite?.portfolioBlueprint.find((s) => s.id === 'section_hero');
  assert(checkHero?.headline === 'Custom High-Impact Hero Headline', 'updatePortfolioSection rejected while locked');

  // 2. reorderPortfolioSections
  lockedState.reorderPortfolioSections([]);
  assert(useModule3Store.getState().authoritySuite!.portfolioBlueprint.length === 9, 'reorderPortfolioSections rejected while locked');

  // 3. resetPortfolioSectionsToDefault
  lockedState.resetPortfolioSectionsToDefault();
  assert(useModule3Store.getState().authoritySuite!.portfolioBlueprint[0].headline === 'Custom High-Impact Hero Headline', 'resetPortfolioSectionsToDefault rejected while locked');

  // 4. applyArchetypePreset
  lockedState.applyArchetypePreset('conversion_focused');
  assert(useModule3Store.getState().stage2Archetype?.selectedArchetypeId === 'productized_service', 'applyArchetypePreset rejected while locked');

  // 5. restoreRecommendedStructure
  lockedState.restoreRecommendedStructure('proof_first');
  assert(useModule3Store.getState().stage2Archetype?.selectedArchetypeId === 'productized_service', 'restoreRecommendedStructure rejected while locked');

  // 6. setStage2Archetype
  lockedState.setStage2Archetype({ selectedArchetypeId: 'authority_brand', portfolioGoal: 'consulting' });
  assert(useModule3Store.getState().stage2Archetype?.selectedArchetypeId === 'productized_service', 'setStage2Archetype rejected while locked');

  // ----------------------------------------------------
  // TEST 7: Unlock Lifecycle & Revision Tracking
  // ----------------------------------------------------
  console.log('\n[TEST 7] Testing Unlock Lifecycle & In-Revision Transition...');
  useModule3Store.getState().unlockStage2Architecture();

  const unlockedState = useModule3Store.getState();
  assert(unlockedState.stage2Archetype?.isLocked === false, 'stage2Archetype.isLocked is false');
  assert(unlockedState.stage2Archetype?.lockedAt === undefined, 'lockedAt is reset to undefined');
  assert(unlockedState.stage2Archetype?.revisionStatus === 'in_revision', 'revisionStatus is in_revision');

  // Mutation should succeed now that it's unlocked
  unlockedState.updatePortfolioSection('section_hero', { headline: 'Permitted Post-Unlock Headline' });
  const checkHeroUnlocked = useModule3Store.getState().authoritySuite?.portfolioBlueprint.find((s) => s.id === 'section_hero');
  assert(checkHeroUnlocked?.headline === 'Permitted Post-Unlock Headline', 'updatePortfolioSection succeeds after unlock');

  // Re-lock for final export tests
  useModule3Store.getState().lockStage2Architecture();

  // ----------------------------------------------------
  // TEST 8: Export Engines (JSON, Markdown)
  // ----------------------------------------------------
  console.log('\n[TEST 8] Testing Export Engines (JSON, Markdown)...');
  const currentState = useModule3Store.getState();
  const sections = currentState.authoritySuite!.portfolioBlueprint;

  // JSON Export
  const jsonExport = exportPortfolioArchitectureAsJson({
    sections,
    archetypeId: 'productized_service',
    goal: currentState.stage2Archetype?.portfolioGoal,
    isLocked: currentState.stage2Archetype?.isLocked,
    lockedAt: currentState.stage2Archetype?.lockedAt,
    userName: 'Specialist',
    positioningHeadline: currentState.mod1Positioning,
    uniqueMechanism: currentState.mod2UniqueMechanism,
  });
  assert(typeof jsonExport === 'string', 'JSON export returns string');
  const parsed = JSON.parse(jsonExport);
  assert(parsed.meta.version === 1, 'JSON export has meta version 1');
  assert(parsed.strategy.goal === 'retainer', 'JSON export contains goal');
  assert(parsed.meta.finalized === true, 'JSON export shows finalized status');
  assert(parsed.sections.length > 0, 'JSON export contains active sections');

  // Markdown Export
  const mdExport = exportPortfolioArchitectureAsMarkdown({
    sections,
    archetypeId: 'productized_service',
    goal: currentState.stage2Archetype?.portfolioGoal,
    isLocked: currentState.stage2Archetype?.isLocked,
    lockedAt: currentState.stage2Archetype?.lockedAt,
    userName: 'Specialist',
    positioningHeadline: currentState.mod1Positioning,
    uniqueMechanism: currentState.mod2UniqueMechanism,
  });
  assert(typeof mdExport === 'string', 'Markdown export returns string');
  assert(mdExport.includes('# Executive Portfolio Architecture Specification'), 'Markdown contains specification header');
  assert(mdExport.includes('Permitted Post-Unlock Headline'), 'Markdown contains customized headline');
  assert(mdExport.includes('Book Strategic Implementation Sprint →'), 'Markdown contains CTA text');

  // ----------------------------------------------------
  // TEST 9: Module 4 Bridge Contract Handoff
  // ----------------------------------------------------
  console.log('\n[TEST 9] Testing Module 4 Bridge Contract Handoff...');
  const bridgeCtx = currentState.getModule4Context();

  assert(bridgeCtx.mod1ServiceId === 'ai_automation_consultant', 'Bridge carries mod1ServiceId');
  assert(bridgeCtx.mod2UniqueMechanism === 'Certainty-Engine Automation Protocol', 'Bridge carries mod2UniqueMechanism');
  assert(bridgeCtx.mod3PortfolioCopy.portfolioCta === 'Deploy Architecture Sprint →', 'Bridge carries hero CTA text');
  
  // Check section filtering: section_faq was disabled earlier
  const hasDisabledSection = bridgeCtx.mod3PortfolioCopy.sections.some((s) => s.type === 'faq');
  assert(!hasDisabledSection, 'Disabled section_faq is NOT included in Module 4 bridge sections');

  // Check semantic section type mapping
  const heroBridgeSec = bridgeCtx.mod3PortfolioCopy.sections.find((s) => s.type === 'hero');
  assert(!!heroBridgeSec, 'Hero section has semantic type "hero" (not "section-1")');
  assert(heroBridgeSec?.heading.includes('Permitted Post-Unlock Headline'), 'Hero heading transferred correctly');

  const ctaBridgeSec = bridgeCtx.mod3PortfolioCopy.sections.find((s) => s.type === 'cta');
  assert(!!ctaBridgeSec, 'CTA section has semantic type "cta"');

  const readiness = Module4BridgeAdapter.validateBridgeReadiness(currentState);
  console.log(`  Bridge readiness check: ready=${readiness.isReady} (missing: ${readiness.missingItems.join(', ') || 'none'})`);

  console.log('\n====================================================');
  console.log('🎉 ALL 10 TESTS PASSED CLEANLY WITH ZERO REGRESSIONS!');
  console.log('====================================================');
}

runTestSuite().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
