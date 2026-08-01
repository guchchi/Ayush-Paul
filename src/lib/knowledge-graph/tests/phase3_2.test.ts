import { getKnowledgeGraph } from '../instance';
import { GraphValidator } from '../services/validator';

async function runPhase32VerificationTestSuite() {
  console.log('=== Starting Phase 3.2 Elimination of Legacy Paths Test Suite ===\n');

  // 1. Singleton Instance Verification
  const kg = getKnowledgeGraph();
  console.log(`[Singleton Audit] Active Repository Nodes: ${kg.nodes.length}, Edges: ${kg.edges.length}`);

  // 2. Topology Integrity Check
  const validator = new GraphValidator(kg.repository);
  const errors = await validator.validateGraph();
  if (errors.length > 0) {
    throw new Error(`GraphValidator reported ${errors.length} errors.`);
  }
  console.log('✅ GraphValidator: 0 errors! Topology is 100% valid.');

  // 3. SEO & Unified Search Verification
  const seoResult = await kg.seoService.generateSeoMetadata('eco_blueprints', 'en');
  if (!seoResult || !seoResult.title) {
    throw new Error('SeoProjectionService failed to generate metadata for eco_blueprints.');
  }
  console.log(`✅ SeoProjectionService: Generated title "${seoResult.title}".`);

  const searchHits = await kg.searchEngine.search('Client Acquisition');
  if (searchHits.length === 0) {
    throw new Error('UnifiedSearchEngine returned zero hits.');
  }
  console.log(`✅ UnifiedSearchEngine: Generated ${searchHits.length} hits.`);

  console.log('\n🎉 ALL PHASE 3.2 VERIFICATION TESTS PASSED CLEANLY!');
}

runPhase32VerificationTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
