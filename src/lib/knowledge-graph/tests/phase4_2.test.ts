import { getKnowledgeGraph } from '../instance';
import { GraphValidator } from '../services/validator';

async function runPhase42BlogVerificationTestSuite() {
  console.log('=== Starting Phase 4.2 Blog Knowledge Graph & Global Services Test Suite ===\n');

  // 1. Singleton Audit
  const kg = getKnowledgeGraph();
  console.log(`[Singleton Audit] Active Graph Nodes: ${kg.nodes.length}, Edges: ${kg.edges.length}`);

  // 2. Topology Integrity Check
  const validator = new GraphValidator(kg.repository);
  const errors = await validator.validateGraph();
  if (errors.length > 0) {
    throw new Error(`GraphValidator reported ${errors.length} errors.`);
  }
  console.log('✅ GraphValidator: 0 errors! Multi-ecosystem topology (Blueprints, Studio, Mastery, Blog) is 100% valid.');

  // 3. BlogProjection Verification
  const blogVM = await kg.blogProjection.getBlogViewModel('en');
  if (!blogVM || blogVM.totalPostsCount < 2) {
    throw new Error(`BlogProjection returned insufficient posts: ${blogVM?.totalPostsCount || 0}`);
  }
  console.log(`✅ BlogProjection: Resolved ${blogVM.totalPostsCount} article(s) across ${blogVM.categories.length} categories.`);
  blogVM.posts.forEach(p => {
    console.log(`   - Post: "${p.title}" (Author: ${p.author}, ReadingTime: ${p.readingTimeMinutes}m)`);
  });

  const postDetail = await kg.blogProjection.getBlogPostViewModel('how-we-built-autonomous-ai-subagents', 'en');
  if (!postDetail || !postDetail.bodyMarkdown) {
    throw new Error('BlogPostViewModel failed to resolve content markdown.');
  }
  console.log(`✅ BlogPostViewModel: Successfully resolved post "${postDetail.title}" with content node markdown.`);

  // 4. Global SeoProjectionService Verification
  const blogSeo = await kg.seoService.generateSeoMetadata('eco_blog', 'en');
  if (!blogSeo || !blogSeo.title) {
    throw new Error('SeoProjectionService failed to generate metadata for eco_blog.');
  }
  console.log(`✅ SeoProjectionService: Generated Blog SEO title "${blogSeo.title}".`);

  // 5. Global UnifiedSearchEngine Verification across All Ecosystems
  const searchQueries = ['Client Acquisition', 'Subagents', 'ICP Generator', 'AI Agent Engineering'];
  for (const query of searchQueries) {
    const hits = await kg.searchEngine.search(query);
    if (hits.length === 0) {
      throw new Error(`UnifiedSearchEngine returned zero hits for query "${query}".`);
    }
    console.log(`✅ UnifiedSearchEngine: Query "${query}" returned ${hits.length} hit(s) [Top hit: ${hits[0].node.title.en} (${hits[0].node.nodeType})].`);
  }

  console.log('\n🎉 ALL PHASE 4.2 BLOG & GLOBAL SERVICES TESTS PASSED CLEANLY!');
}

runPhase42BlogVerificationTestSuite().catch(err => {
  console.error('Fatal Phase 4.2 test error:', err);
  process.exit(1);
});
