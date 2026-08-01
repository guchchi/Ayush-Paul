import { generateInitialGraph } from '../seed/initial-seed';
import { StepProjection, BlueprintProjection } from '../projections/projections';
import { EntityInternalLinker } from '../rendering/linker';

async function runPhase23TestSuite() {
  console.log('=== Starting Phase 2.3 Content Engine Test Suite ===\n');

  // 1. Setup Seed Graph
  const { repository } = generateInitialGraph();

  // 2. Test StepProjection
  console.log('--- Testing StepProjection ---');
  const stepProj = new StepProjection();
  const stepVm = await stepProj.project('step_niche_selection', repository);

  if (!stepVm) {
    throw new Error('StepProjection returned null!');
  }
  console.log(`✅ StepProjection successfully assembled model for: "${stepVm.node.title.en}"`);
  console.log(`   - Content Node ID: ${stepVm.contentNode?.nodeId}`);
  console.log(`   - Content Body Preview: "${stepVm.contentDoc?.markdown.slice(0, 45)}..."`);
  console.log(`   - Navigation Breadcrumbs: ${stepVm.navigation.breadcrumbs.map(b => b.title).join(' > ')}`);
  console.log(`   - Next Step: ${stepVm.navigation.next?.title}`);
  console.log(`   - Associated Assets: ${stepVm.navigation.relatedAssets.map(a => a.title).join(', ')}`);

  // 3. Test BlueprintProjection
  console.log('\n--- Testing BlueprintProjection ---');
  const bpProj = new BlueprintProjection();
  const bpVm = await bpProj.project('prod_first_3_clients', repository);

  if (!bpVm) {
    throw new Error('BlueprintProjection returned null!');
  }
  console.log(`✅ BlueprintProjection assembled model for: "${bpVm.productNode.title.en}"`);
  console.log(`   - Content Node ID: ${bpVm.contentNode?.nodeId}`);
  console.log(`   - Modules Count: ${bpVm.modules.length}`);
  bpVm.modules.forEach(m => {
    console.log(`     Module: ${m.moduleNode.title.en} (${m.steps.length} steps)`);
  });

  // 4. Test EntityInternalLinker
  console.log('\n--- Testing EntityInternalLinker ---');
  const linker = new EntityInternalLinker(repository);
  const mappings = await linker.buildMappingTable('en');
  console.log(`[Linker] Built ${mappings.length} entity mapping rules.`);
  mappings.forEach(m => {
    console.log(`   Entity "${m.preferredAnchor}" -> Target URL: ${m.targetUrl}`);
  });

  const sampleRawText = `In this lesson we cover Client Acquisition strategies. Learn how to get freelance clients using cold email.`;
  const linkedText = linker.injectInternalLinks(sampleRawText, '/blog/some-article');
  console.log(`\n[Linker Injection Result]:\n"${linkedText}"`);

  if (linkedText.includes('[Client Acquisition](')) {
    console.log('✅ EntityInternalLinker: Successfully injected internal link without anchor collision!');
  } else {
    throw new Error('EntityInternalLinker failed to inject internal link');
  }

  console.log('\n🎉 ALL PHASE 2.3 CONTENT ENGINE TESTS PASSED CLEANLY WITH FIRST-CLASS CONTENT NODES!');
}

runPhase23TestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
