import { performance } from 'perf_hooks';
import { AuthorityPackDomain, StrategicPillar, ActionItem } from '../src/features/authority-pack/types';
import { AuthorityPackExportValidator } from '../src/features/export/pipeline/AuthorityPackValidator';
import { AuthorityPackExportMapper } from '../src/features/export/mappers/AuthorityPackExportMapper';
import { MarkdownExporter } from '../src/features/export/exporters/MarkdownExporter';

// ----------------------------------------------------------------------------
// THRESHOLDS (Milliseconds)
// ----------------------------------------------------------------------------
const THRESHOLDS = {
  JSON_PARSE: 50, // Parsing a massive state payload
  VALIDATION: 20, // Domain validation
  MAPPING: 50, // Mapping domain to DTO
  EXPORT_GEN: 100, // Generating markdown text from DTO
};

// ----------------------------------------------------------------------------
// MOCK DATA GENERATOR
// ----------------------------------------------------------------------------
function generateMassivePayload(count: number): AuthorityPackDomain {
  const pillars: StrategicPillar[] = Array.from({ length: count }, (_, i) => ({
    id: `pillar-${i}`,
    title: `Pillar ${i}`,
    description: `Detailed description for pillar ${i} with sufficient text volume to simulate real-world usage patterns across the application.`,
    rationale: `Rationale for pillar ${i} explaining the strategic importance.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const actions: ActionItem[] = Array.from({ length: count }, (_, i) => ({
    id: `action-${i}`,
    title: `Action ${i}`,
    description: `Action description ${i} - executing this task will yield significant progress.`,
    priority: i % 2 === 0 ? 'high' : 'low',
    status: i % 3 === 0 ? 'completed' : 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  return {
    id: 'pack-massive-01',
    version: 'v1.0.0',
    status: 'ready',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    executiveSummary: {
      strategyOverview: 'Massive Overview',
      keyInsight: 'Massive Insight',
      primaryRecommendation: 'Massive Rec',
      readingGuidance: 'Massive Guidance',
    },
    strategicPillars: pillars,
    actionPlan: actions,
  };
}

// ----------------------------------------------------------------------------
// TEST RUNNER
// ----------------------------------------------------------------------------
async function runStressTests() {
  console.log('=============================================');
  console.log('🚀 Blueprint OS Module 3 - Node Stress Test');
  console.log('=============================================\n');

  let hasFailures = false;
  const count = 1000;
  console.log(`Generating payload with ${count} pillars and ${count} actions...`);
  const domain = generateMassivePayload(count);

  const rawJson = JSON.stringify(domain);
  const sizeMb = (Buffer.byteLength(rawJson, 'utf8') / 1024 / 1024).toFixed(2);
  console.log(`Payload Size: ${sizeMb} MB\n`);

  // 1. JSON Parse Test (Simulating State Hydration)
  const parseStart = performance.now();
  JSON.parse(rawJson);
  const parseTime = performance.now() - parseStart;
  if (parseTime > THRESHOLDS.JSON_PARSE) {
    console.error(`❌ JSON Parse: ${parseTime.toFixed(2)}ms (Threshold: ${THRESHOLDS.JSON_PARSE}ms)`);
    hasFailures = true;
  } else {
    console.log(`✅ JSON Parse: ${parseTime.toFixed(2)}ms`);
  }

  // 2. Validation Test
  const validator = new AuthorityPackExportValidator();
  const valStart = performance.now();
  const validationResult = validator.validate(domain);
  const valTime = performance.now() - valStart;
  
  if (!validationResult.isValid) {
    console.error(`❌ Validation logic failed unexpectedly.`);
    hasFailures = true;
  } else if (valTime > THRESHOLDS.VALIDATION) {
    console.error(`❌ Validation: ${valTime.toFixed(2)}ms (Threshold: ${THRESHOLDS.VALIDATION}ms)`);
    hasFailures = true;
  } else {
    console.log(`✅ Validation: ${valTime.toFixed(2)}ms`);
  }

  // 3. Mapping Test
  const mapper = new AuthorityPackExportMapper();
  const mapStart = performance.now();
  const dto = mapper.mapToDTO(domain);
  const mapTime = performance.now() - mapStart;

  if (mapTime > THRESHOLDS.MAPPING) {
    console.error(`❌ Mapping: ${mapTime.toFixed(2)}ms (Threshold: ${THRESHOLDS.MAPPING}ms)`);
    hasFailures = true;
  } else {
    console.log(`✅ Mapping: ${mapTime.toFixed(2)}ms`);
  }

  // 4. Export Generation Test
  const exporter = new MarkdownExporter();
  const genStart = performance.now();
  await exporter.generate(dto);
  const genTime = performance.now() - genStart;

  if (genTime > THRESHOLDS.EXPORT_GEN) {
    console.error(`❌ Export Generation: ${genTime.toFixed(2)}ms (Threshold: ${THRESHOLDS.EXPORT_GEN}ms)`);
    hasFailures = true;
  } else {
    console.log(`✅ Export Generation: ${genTime.toFixed(2)}ms`);
  }

  console.log('\n=============================================');
  if (hasFailures) {
    console.error('⚠️ STRESS TEST FAILED: One or more thresholds exceeded.');
    process.exit(1);
  } else {
    console.log('🎯 STRESS TEST PASSED: All operations within safe thresholds.');
    process.exit(0);
  }
}

runStressTests().catch(err => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});
