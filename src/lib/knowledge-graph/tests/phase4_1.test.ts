import { getKnowledgeGraph } from '../instance';
import { GraphValidator } from '../services/validator';

async function runPhase41MasteryVerificationTestSuite() {
  console.log('=== Starting Phase 4.1 Mastery Knowledge Graph Test Suite ===\n');

  // 1. Singleton Audit
  const kg = getKnowledgeGraph();
  console.log(`[Singleton Audit] Active Graph Nodes: ${kg.nodes.length}, Edges: ${kg.edges.length}`);

  // 2. Topology Integrity Check
  const validator = new GraphValidator(kg.repository);
  const errors = await validator.validateGraph();
  if (errors.length > 0) {
    throw new Error(`GraphValidator reported ${errors.length} errors.`);
  }
  console.log('✅ GraphValidator: 0 errors! Multi-domain topology is 100% valid.');

  // 3. MasteryProjection Verification
  const masteryVM = await kg.masteryProjection.getMasteryViewModel('en');
  if (!masteryVM || masteryVM.totalCoursesCount < 1) {
    throw new Error('MasteryProjection returned 0 courses.');
  }
  console.log(`✅ MasteryProjection: Resolved ${masteryVM.totalCoursesCount} Course(s) under eco_mastery.`);

  const courseDetail = await kg.masteryProjection.getCourseDetailViewModel('fullstack-ai-agent-engineering', 'en');
  if (!courseDetail || courseDetail.totalLessonsCount < 2) {
    throw new Error('CourseDetailViewModel failed to resolve child lessons.');
  }
  console.log(`✅ CourseDetailViewModel: Resolved "${courseDetail.title}" with ${courseDetail.totalLessonsCount} child lesson(s):`);
  courseDetail.lessons.forEach(l => {
    console.log(`   - Lesson ${l.order}: "${l.title}" (Duration: ${l.durationMinutes}m, Next: ${l.nextLessonSlug || 'None'})`);
  });

  // 4. UnifiedSearchEngine Discovery
  const searchHits = await kg.searchEngine.search('AI Agent Engineering');
  if (searchHits.length === 0) {
    throw new Error('UnifiedSearchEngine failed to discover Mastery course "Fullstack AI Agent Engineering".');
  }
  console.log(`✅ UnifiedSearchEngine: Successfully resolved ${searchHits.length} hit(s) for Mastery search query.`);

  console.log('\n🎉 ALL PHASE 4.1 MASTERY KNOWLEDGE GRAPH TESTS PASSED CLEANLY!');
}

runPhase41MasteryVerificationTestSuite().catch(err => {
  console.error('Fatal Phase 4.1 test error:', err);
  process.exit(1);
});
