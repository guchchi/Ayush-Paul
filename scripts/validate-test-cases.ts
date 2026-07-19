import { resolveRecommendedPosition, type PositionContext } from '../src/data/module3/authority-positions';

type TestResult = {
  label: string;
  ctx: PositionContext;
  expected: string;
  result: string;
  pass: boolean;
  details: string;
};

function test(label: string, overrides: Partial<PositionContext>, expected: string): TestResult {
  const base: PositionContext = {
    careerTrackId: '',
    serviceId: '',
    marketId: '',
    nicheId: '',
    positioning: '',
    offerType: '',
    deliverables: [],
    uniqueMechanism: '',
    valueAmplifier: '',
    ...overrides,
  };

  const top = resolveRecommendedPosition(base);
  const pass = top === expected;

  const details = `Result: ${top}`;
  return { label, ctx: base, expected, result: top, pass, details };
}

const results: TestResult[] = [];

// Test 1: UI/UX Designer → SaaS → AI tools → Product UI Design → Practitioner
results.push(test(
  'UI/UX Designer → SaaS → AI tools → Product UI Design',
  {
    careerTrackId: 'ui_ux_designer',
    serviceId: 'ui_ux_designer',
    marketId: 'saas_startups',
    nicheId: 'ai_tools',
    positioning: 'I help SaaS startups using AI tools design product UI that turns trial users into paid customers.',
    offerType: 'one_time_project',
    deliverables: ['Activation Journey Mapping', 'Onboarding Flow Redesign', 'Workflow Efficiency Design'],
    uniqueMechanism: 'Activation-First Onboarding Architecture',
    valueAmplifier: 'Developer Handoff Checklist',
  },
  'practitioner',
));

// Test 2: UI/UX Designer → SaaS → UX Audit → Auditor
results.push(test(
  'UI/UX Designer → SaaS → UX Audit',
  {
    careerTrackId: 'ui_ux_designer',
    serviceId: 'ui_ux_designer',
    marketId: 'saas_startups',
    nicheId: '',
    positioning: 'I help SaaS startups audit their product UX to identify activation blockers and improve trial-to-paid conversion.',
    offerType: 'one_time_project',
    deliverables: ['UX Audit Report', 'Heuristic Evaluation', 'Usability Test Findings'],
    uniqueMechanism: 'UX Audit Framework',
    valueAmplifier: 'Usability Review Summary',
  },
  'auditor',
));

// Test 3: Video Editor → YouTube Creators → Long-form Editing → Practitioner
results.push(test(
  'Video Editor → YouTube Creators → Long-form Editing',
  {
    careerTrackId: 'video_editor',
    serviceId: 'video_editor',
    marketId: 'youtube_creators',
    nicheId: 'youtubers_retention',
    positioning: 'I help YouTube creators edit long-form videos that keep viewers watching with retention-focused pacing.',
    offerType: 'milestone_based',
    deliverables: ['Full Video Edit', 'Retention Graph Optimization', 'Thumbnail Design'],
    uniqueMechanism: 'Retention Curve Mapping Process',
    valueAmplifier: 'Performance Review',
  },
  'practitioner',
));

// Test 4: Content Strategist → Educational → Deconstructor
results.push(test(
  'Content Strategist → Educational',
  {
    careerTrackId: 'content_strategist',
    serviceId: 'content_strategist',
    marketId: 'course_creators',
    nicheId: 'online_educators',
    positioning: 'I help course creators deconstruct expert knowledge into educational content strategies that position them as thought leaders.',
    offerType: 'one_time_project',
    deliverables: ['Knowledge Deconstruction Framework', 'Topic Cluster Analysis', 'Educational Playbook'],
    uniqueMechanism: 'Knowledge Deconstruction Framework',
    valueAmplifier: 'Content Audit Report',
  },
  'deconstructor',
));

// Print results
console.log('=== Test Case Results ===\n');
let allPass = true;
for (const r of results) {
  const icon = r.pass ? 'PASS' : 'FAIL';
  console.log(`${icon}: ${r.label}`);
  console.log(`  Expected: ${r.expected}, Got: ${r.result}`);
  console.log(`  ${r.details}`);
  console.log();
  if (!r.pass) allPass = false;
}

console.log(allPass ? '✅ ALL 4 TEST CASES PASS' : '❌ SOME TEST CASES FAILED');
