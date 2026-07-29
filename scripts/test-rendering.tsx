import { AuthorityPackViewMapper } from '../src/features/authority-pack/view-mappers/AuthorityPackViewMapper';
import { AuthorityPackDomain } from '../src/features/authority-pack/types';
import { registerAuthorityPackBlocks } from '../src/features/authority-pack/components/registry/RegistrySetup';
import { registry } from '../src/lib/rendering/Registry';

async function testRenderingEngine() {
  console.log('--- Phase 5 Rendering Engine Verification ---');

  // 1. Initialize Registry
  registerAuthorityPackBlocks();

  // Verify registration
  const expectedTypes = [
    'authority-pack.executive-summary',
    'authority-pack.strategic-pillar',
    'authority-pack.action-item'
  ];

  let missing = false;
  for (const type of expectedTypes) {
    if (!registry.has(type)) {
      console.error(`❌ Registry is missing renderer for: ${type}`);
      missing = true;
    }
  }

  if (!missing) {
    console.log('✅ All Authority Pack blocks registered successfully.');
  }

  // 2. Test ViewMapper
  const mockDomain: AuthorityPackDomain = {
    id: 'pack-123',
    version: '1.0.0',
    status: 'ready',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    executiveSummary: {
      strategyOverview: 'Overview',
      keyInsight: 'Insight',
      primaryRecommendation: 'Recommendation',
      readingGuidance: 'Guidance'
    },
    strategicPillars: [
      {
        id: 'pillar-1',
        title: 'First Pillar',
        description: 'First Description',
        rationale: 'First Rationale',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'pillar-2',
        title: 'Second Pillar',
        description: 'Second Description',
        rationale: 'Second Rationale',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    actionPlan: [
      {
        id: 'action-1',
        title: 'Action 1',
        description: 'Action Desc 1',
        priority: 'high',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  };

  const blocks = AuthorityPackViewMapper.mapToBlocks(mockDomain);

  if (blocks.length === 4) {
    console.log('✅ ViewMapper correctly flattened Domain Model into 4 ViewModels.');
  } else {
    console.error(`❌ ViewMapper returned ${blocks.length} blocks, expected 4.`);
  }

  // Check types and data mapping
  const summaryBlock = blocks.find(b => b.type === 'authority-pack.executive-summary');
  if (summaryBlock && summaryBlock.id === 'summary-pack-123' && summaryBlock.overview === 'Overview') {
    console.log('✅ Executive Summary block correctly mapped.');
  } else {
    console.error('❌ Executive Summary block mapping failed.');
  }

  const pillarBlocks = blocks.filter(b => b.type === 'authority-pack.strategic-pillar');
  if (pillarBlocks.length === 2 && pillarBlocks[0].id === 'pillar-pillar-1') {
    console.log('✅ Strategic Pillar blocks correctly mapped.');
  } else {
    console.error('❌ Strategic Pillar block mapping failed.');
  }

  const actionBlocks = blocks.filter(b => b.type === 'authority-pack.action-item');
  if (actionBlocks.length === 1 && actionBlocks[0].priority === 'high') {
    console.log('✅ Action Item blocks correctly mapped.');
  } else {
    console.error('❌ Action Item block mapping failed.');
  }

  // 3. Graceful Failure
  if (!registry.has('unknown-type')) {
    console.log('✅ Unknown block types correctly unhandled by registry (ContentRenderer will display fallback).');
  } else {
    console.error('❌ Registry incorrectly contains unknown type.');
  }

  console.log('\\nAll Phase 5 rendering tests completed.');
}

testRenderingEngine().catch(console.error);
