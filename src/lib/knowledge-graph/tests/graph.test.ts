import { generateInitialGraph } from '../seed/initial-seed';
import { GraphValidator } from '../services/validator';
import { GraphQueryApi } from '../services/query';
import { GraphMigrationSystem } from '../migrations/migrator';

async function runGraphTestSuite() {
  console.log('=== Starting Knowledge Graph Test Suite ===\n');

  // 1. Initialize Seed Graph
  const { repository } = generateInitialGraph();
  const allNodes = await repository.getAllNodes();
  const allEdges = await repository.getAllEdges();

  console.log(`[Seed Graph] Successfully initialized ${allNodes.length} nodes and ${allEdges.length} edges.`);

  // 2. Validate Graph Integrity
  console.log('\n--- Running GraphValidator ---');
  const validator = new GraphValidator(repository);
  const errors = await validator.validateGraph();

  if (errors.length > 0) {
    console.error(`❌ GraphValidator reported ${errors.length} errors:`);
    errors.forEach(err => console.error(`  - [${err.type}] ${err.message}`));
    process.exit(1);
  } else {
    console.log('✅ GraphValidator: 0 errors! Graph topology is 100% valid.');
  }

  // 3. Test GraphQueryApi
  console.log('\n--- Testing GraphQueryApi ---');
  const query = new GraphQueryApi(repository);

  // Test getNode
  const productNode = await query.getNode('prod_first_3_clients');
  console.log(`[getNode] ${productNode?.title.en} (Type: ${productNode?.nodeType})`);

  // Test getChildren
  const modules = await query.getChildren('prod_first_3_clients');
  console.log(`[getChildren] Product has ${modules.length} modules: ${modules.map(m => m.title.en).join(', ')}`);

  // Test getLearningPath
  const learningPath = await query.getLearningPath('prod_first_3_clients');
  console.log(`[getLearningPath] Generated sequence of ${learningPath.length} nodes:`);
  learningPath.forEach((node, i) => console.log(`   ${i + 1}. [${node.nodeType}] ${node.title.en}`));

  // Test getAssets
  const step1Assets = await query.getAssets('step_niche_selection');
  console.log(`[getAssets] Step 1 has ${step1Assets.length} asset(s): ${step1Assets.map(a => a.title.en).join(', ')}`);

  // Test getBreadcrumbs
  const breadcrumbs = await query.getBreadcrumbs('step_niche_selection');
  console.log(`[getBreadcrumbs] Path to Step 1: ${breadcrumbs.map(b => b.title.en).join(' > ')}`);

  // Test searchNodes
  const searchResults = await query.searchNodes('cold');
  console.log(`[searchNodes] Query "cold" returned ${searchResults.length} result(s): ${searchResults.map(r => r.title.en).join(', ')}`);

  // 4. Test GraphMigrationSystem
  console.log('\n--- Testing GraphMigrationSystem ---');
  const migrationSystem = new GraphMigrationSystem();
  migrationSystem.registerMigration({
    version: 1,
    name: 'Add initial tag to all nodes',
    up: async (repo) => {
      const nodes = await repo.getAllNodes();
      for (const node of nodes) {
        node.metadata.updatedBy = 'migration_v1';
        await repo.saveNode(node);
      }
    }
  });

  const newVersion = await migrationSystem.runMigrations(repository, 0);
  console.log(`✅ Migrations completed. Graph is now at version ${newVersion}.`);

  console.log('\n🎉 ALL KNOWLEDGE GRAPH TESTS PASSED CLEANLY!');
}

runGraphTestSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
