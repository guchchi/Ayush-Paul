import { getKnowledgeGraph } from '../instance';
import { GraphValidator } from '../services/validator';

async function runPhase31IntegrationTestSuite() {
  console.log('=== Starting Phase 3.1 Complete Knowledge Graph Integration Test Suite ===\n');

  // 1. Singleton Verification
  const kg1 = getKnowledgeGraph();
  const kg2 = getKnowledgeGraph();

  if (kg1 !== kg2) {
    throw new Error('KnowledgeGraphSingleton failed: Multiple instances constructed!');
  }
  console.log('✅ Singleton Verification: getKnowledgeGraph() reused single instance.');

  // 2. Topology & Ecosystem Verification
  console.log(`[Ecosystem Audit] Active Nodes: ${kg1.nodes.length}, Active Edges: ${kg1.edges.length}`);
  
  const validator = new GraphValidator(kg1.repository);
  const errors = await validator.validateGraph();
  if (errors.length > 0) {
    throw new Error(`GraphValidator reported ${errors.length} errors.`);
  }
  console.log('✅ GraphValidator: 0 errors across all ecosystems (Blueprints, Studio, Mastery, Blog).');

  // 3. Direct Projection View Model Verification
  const bpVm = await kg1.blueprintProjection.project('prod_first_3_clients', kg1.repository, kg1.contentRepository);
  if (!bpVm || bpVm.modules.length !== 6) {
    throw new Error(`BlueprintProjection failed to yield 6 modules for prod_first_3_clients.`);
  }
  console.log(`✅ BlueprintProjection: Direct view model resolved 6 modules for "${bpVm.productNode.title.en}".`);

  const stepVm = await kg1.stepProjection.project('step_niche', kg1.repository, kg1.contentRepository);
  if (!stepVm || !stepVm.contentDoc) {
    throw new Error('StepProjection failed to yield content document for step_niche.');
  }
  console.log(`✅ StepProjection: Resolved content doc "${stepVm.contentDoc.title}" for Step 1.`);

  // 4. Production SEO Service Output
  const seoData = await kg1.seoService.generateSeoMetadata('prod_first_3_clients', 'en');
  if (!seoData || !seoData.canonicalUrl) {
    throw new Error('SeoProjectionService failed to generate metadata.');
  }
  console.log(`✅ SeoProjectionService: Generated canonical "${seoData.canonicalUrl}".`);

  // 5. Unified Search Engine Output
  const searchResults = kg1.searchEngine.search('Client Acquisition');
  if (searchResults.length === 0) {
    throw new Error('UnifiedSearchEngine returned zero hits for query "Client Acquisition".');
  }
  console.log(`✅ UnifiedSearchEngine: Resolved ${searchResults.length} search hits for query "Client Acquisition".`);

  console.log('\n🎉 ALL PHASE 3.1 INTEGRATION TESTS PASSED CLEANLY!');
}

runPhase31IntegrationTestSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
