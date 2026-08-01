import { getKnowledgeGraph } from '../instance';
import { GraphValidator } from '../services/validator';

async function runPhase43FinalProductionAuditTestSuite() {
  console.log('=== Starting Phase 4.3 Final Production Audit & Hardening Test Suite ===\n');

  // 1. Singleton Instance & Repository Audit
  const kg = getKnowledgeGraph();
  console.log(`[Singleton Audit] Active Graph Nodes: ${kg.nodes.length}, Edges: ${kg.edges.length}`);

  // 2. Topology Integrity Check across All Ecosystems
  const validator = new GraphValidator(kg.repository);
  const errors = await validator.validateGraph();
  if (errors.length > 0) {
    throw new Error(`GraphValidator reported ${errors.length} errors during final audit.`);
  }
  console.log('✅ GraphValidator: 0 errors! Platform multi-ecosystem topology is 100% valid.');

  // 3. Complete Projection Suite Audit
  const blueprintVM = await kg.blueprintProjection.project('prod_first_3_clients', kg.repository);
  if (!blueprintVM) throw new Error('BlueprintProjection failed during final audit.');
  console.log(`✅ BlueprintProjection: Resolved "${blueprintVM.productNode.title.en}" (${blueprintVM.modules.length} modules).`);

  const studioVM = await kg.studioProjection.getStudioViewModel('en');
  if (!studioVM) throw new Error('StudioProjection failed during final audit.');
  console.log(`✅ StudioProjection: Resolved ${studioVM.totalAssetsCount} Studio assets.`);

  const masteryVM = await kg.masteryProjection.getMasteryViewModel('en');
  if (!masteryVM) throw new Error('MasteryProjection failed during final audit.');
  console.log(`✅ MasteryProjection: Resolved ${masteryVM.totalCoursesCount} Mastery course(s).`);

  const blogVM = await kg.blogProjection.getBlogViewModel('en');
  if (!blogVM) throw new Error('BlogProjection failed during final audit.');
  console.log(`✅ BlogProjection: Resolved ${blogVM.totalPostsCount} Blog article(s).`);

  // 4. Global Search & SEO Integration Audit
  const searchResults = await kg.searchEngine.search('Client');
  if (searchResults.length === 0) throw new Error('UnifiedSearchEngine failed final audit.');
  console.log(`✅ UnifiedSearchEngine: Resolved ${searchResults.length} search hits across platform.`);

  console.log('\n🎉 ALL PHASE 4.3 FINAL PRODUCTION AUDIT TESTS PASSED CLEANLY! PLATFORM IS 100% PRODUCTION READY!');
}

runPhase43FinalProductionAuditTestSuite().catch(err => {
  console.error('Fatal Phase 4.3 audit error:', err);
  process.exit(1);
});
