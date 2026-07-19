import { generateCoreTrustPromise } from '../src/data/module3/authority-positions';

const ctx = {
  careerTrackId: 'ui_ux_designer',
  serviceId: 'ui_ux_designer',
  marketId: 'saas_startups',
  nicheId: 'ai_tools',
  positioning: 'I help SaaS startups using AI tools design product UI that turns trial users into paid customers.',
  offerType: 'one_time_project',
  deliverables: ['Activation Journey Mapping', 'Onboarding Flow Redesign', 'Workflow Efficiency Design'],
  uniqueMechanism: 'Activation-First Onboarding Architecture',
  valueAmplifier: 'Developer Handoff Checklist',
};

const promise1 = generateCoreTrustPromise('practitioner', ctx, 0);
// Generate with variation 1
const promise2 = generateCoreTrustPromise('practitioner', ctx, 1);
const promise3 = generateCoreTrustPromise('practitioner', ctx, 2);

console.log('=== Regenerate Variation Test ===\n');
console.log(`Variation 0: "${promise1}"`);
console.log(`Word count: ${promise1.split(/\s+/).length}`);
console.log();
console.log(`Variation 1: "${promise2}"`);
console.log(`Word count: ${promise2.split(/\s+/).length}`);
console.log();
console.log(`Variation 2: "${promise3}"`);
console.log(`Word count: ${promise3.split(/\s+/).length}`);
console.log();

const v0v1Different = promise1 !== promise2;
const v0v2Different = promise1 !== promise3;
const v1v2Different = promise2 !== promise3;

console.log(`Variation 0 vs 1 different: ${v0v1Different ? 'YES' : 'NO'}`);
console.log(`Variation 0 vs 2 different: ${v0v2Different ? 'YES' : 'NO'}`);
console.log(`Variation 1 vs 2 different: ${v1v2Different ? 'YES' : 'NO'}`);
console.log();

if (v0v1Different && v0v2Different && v1v2Different) {
  console.log('✅ Regenerate produces 3 different outputs');
} else if (v0v1Different) {
  console.log('✅ Regenerate produces at least 2 different outputs');
} else {
  console.log('❌ Regenerate produced identical outputs');
}

// Check word count constraints
for (const [v, p] of [[0, promise1], [1, promise2], [2, promise3]] as const) {
  const wc = p.split(/\s+/).length;
  const ok = wc >= 35 && wc <= 55;
  console.log(`Variation ${v}: ${wc} words ${ok ? 'OK' : 'OUT OF RANGE'}`);
}

// Check sentence count (max 2)
for (const [v, p] of [[0, promise1], [1, promise2], [2, promise3]] as const) {
  const sentences = p.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const ok = sentences <= 2;
  console.log(`Variation ${v}: ${sentences} sentence(s) ${ok ? 'OK' : 'TOO MANY'}`);
}
