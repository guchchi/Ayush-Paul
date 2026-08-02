import { generateInitialGraph } from '../seed/initial-seed';
import { SeoProjectionService } from '../seo/generator';
import { UnifiedSearchEngine } from '../services/search';

async function runPhase24TestSuite() {
  console.log('=== Starting Phase 2.4 SEO & Unified Search Test Suite ===\n');

  // 1. Setup Seed Graph
  const { repository } = generateInitialGraph();

  // 2. Test SeoProjectionService
  console.log('--- Testing SeoProjectionService ---');
  const seoService = new SeoProjectionService(repository, 'https://ayushpaul.in');

  const prodSeo = await seoService.generateSeoMetadata('prod_first_3_clients', 'en');
  if (!prodSeo) throw new Error('SeoProjectionService returned null for product!');
  
  console.log(`✅ Product SEO Title: "${prodSeo.title}"`);
  console.log(`   Canonical URL: ${prodSeo.canonicalUrl}`);
  console.log(`   JSON-LD Schemas Generated: ${prodSeo.jsonLd.length}`);
  console.log(`   Schema Types: ${prodSeo.jsonLd.map(s => s['@type']).join(', ')}`);

  const stepSeo = await seoService.generateSeoMetadata('step_niche_selection', 'en');
  if (!stepSeo) throw new Error('SeoProjectionService returned null for step!');

  console.log(`\n✅ Step SEO Title: "${stepSeo.title}"`);
  console.log(`   Canonical URL: ${stepSeo.canonicalUrl}`);
  console.log(`   JSON-LD Schemas: ${stepSeo.jsonLd.map(s => s['@type']).join(', ')}`);

  // 3. Test UnifiedSearchEngine
  console.log('\n--- Testing UnifiedSearchEngine ---');
  const searchEngine = new UnifiedSearchEngine(repository);

  const hits = await searchEngine.search('client');
  console.log(`✅ UnifiedSearchEngine query "client" returned ${hits.length} hits:`);
  hits.forEach(hit => {
    console.log(`   - [${hit.node.nodeType}] ${hit.node.title.en} (Score: ${hit.score}) -> URL: ${hit.targetUrl}`);
  });

  if (hits.length === 0) {
    throw new Error('UnifiedSearchEngine returned zero hits for query "client"');
  }

  console.log('\n🎉 ALL PHASE 2.4 SEO & UNIFIED SEARCH TESTS PASSED CLEANLY!');
}

runPhase24TestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
