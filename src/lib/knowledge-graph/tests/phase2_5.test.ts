import { generateInitialGraph } from '../seed/initial-seed';
import { GraphValidator } from '../services/validator';
import { BlueprintProjection } from '../projections/projections';
import { SeoProjectionService } from '../seo/generator';
import { UnifiedSearchEngine } from '../services/search';

async function runPhase25TestSuite() {
  console.log('=== Starting Phase 2.5 Full Application Migration Test Suite ===\n');

  // 1. Initialize Seed Graph
  const { repository, nodes, edges } = generateInitialGraph();
  console.log(`[Seed Graph] Initialized ${nodes.length} nodes and ${edges.length} edges.`);

  // 2. Validate Expanded Topology
  console.log('\n--- Running GraphValidator on Full Blueprint ---');
  const validator = new GraphValidator(repository);
  const errors = await validator.validateGraph();

  if (errors.length > 0) {
    console.error(`❌ GraphValidator reported ${errors.length} errors:`);
    errors.forEach(e => console.error(`   - [${e.type}] ${e.message}`));
    process.exit(1);
  }
  console.log('✅ GraphValidator: 0 errors! Topology is 100% valid.');

  // 3. Test Full Blueprint Projection
  console.log('\n--- Testing Full BlueprintProjection ---');
  const bpProj = new BlueprintProjection();
  const bpVm = await bpProj.project('prod_first_3_clients', repository);

  if (!bpVm) throw new Error('BlueprintProjection returned null!');

  console.log(`✅ Blueprint Title: "${bpVm.productNode.title.en}"`);
  console.log(`   Modules Count: ${bpVm.modules.length}`);
  bpVm.modules.forEach((mod, idx) => {
    console.log(`   Module ${idx + 1}: ${mod.moduleNode.title.en} (${mod.steps.length} steps)`);
    mod.steps.forEach(step => {
      console.log(`      -> [STEP] ${step.title.en}`);
    });
  });

  if (bpVm.modules.length < 6) {
    throw new Error(`Expected 6 modules in blueprint, found ${bpVm.modules.length}`);
  }

  // 4. Test Full SEO & Search Engine
  console.log('\n--- Testing SEO & Search Engine ---');
  const seoService = new SeoProjectionService(repository, 'https://ayushpaul.in');
  const seoMeta = await seoService.generateSeoMetadata('prod_first_3_clients', 'en');
  console.log(`✅ SEO Title: "${seoMeta?.title}"`);
  console.log(`   Canonical: ${seoMeta?.canonicalUrl}`);

  const searchEngine = new UnifiedSearchEngine(repository);
  const searchResults = await searchEngine.search('Outreach');
  console.log(`✅ UnifiedSearchEngine for "Outreach" returned ${searchResults.length} hits.`);

  console.log('\n🎉 ALL PHASE 2.5 MIGRATION TESTS PASSED CLEANLY!');
}

runPhase25TestSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
