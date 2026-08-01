import { getKnowledgeGraph } from '../instance';
import { GraphValidator } from '../services/validator';

async function runPhase40StudioVerificationTestSuite() {
  console.log('=== Starting Phase 4.0 Studio Knowledge Graph Test Suite ===\n');

  // 1. Singleton Audit
  const kg = getKnowledgeGraph();
  console.log(`[Singleton Audit] Active Nodes: ${kg.nodes.length}, Edges: ${kg.edges.length}`);

  // 2. Topology Integrity Check
  const validator = new GraphValidator(kg.repository);
  const errors = await validator.validateGraph();
  if (errors.length > 0) {
    throw new Error(`GraphValidator reported ${errors.length} errors.`);
  }
  console.log('✅ GraphValidator: 0 errors! Graph topology is 100% valid.');

  // 3. StudioProjection Verification
  const studioVM = await kg.studioProjection.getStudioViewModel('en');
  if (!studioVM || studioVM.totalAssetsCount < 4) {
    throw new Error(`StudioProjection returned insufficient assets: ${studioVM?.totalAssetsCount || 0}`);
  }
  console.log(`✅ StudioProjection: Resolved ${studioVM.totalAssetsCount} Studio assets across ${studioVM.categories.length} categories.`);
  studioVM.categories.forEach(cat => {
    console.log(`   - Category "${cat.category}": ${cat.assets.length} assets`);
  });

  // 4. UnifiedSearchEngine Studio Discovery
  const searchHits = await kg.searchEngine.search('ICP Generator');
  if (searchHits.length === 0) {
    throw new Error('UnifiedSearchEngine failed to discover Studio asset "ICP Generator".');
  }
  console.log(`✅ UnifiedSearchEngine: Successfully discovered ${searchHits.length} hit(s) for Studio asset query.`);

  console.log('\n🎉 ALL PHASE 4.0 STUDIO KNOWLEDGE GRAPH TESTS PASSED CLEANLY!');
}

runPhase40StudioVerificationTestSuite().catch(err => {
  console.error('Fatal Phase 4.0 test error:', err);
  process.exit(1);
});
