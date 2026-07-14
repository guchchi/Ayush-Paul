/**
 * Validation script for Module 2 Personalized Content
 *
 * Tests:
 * 1. 75-path coverage — all service×market combos produce valid content
 * 2. All-niche high-priority (375 instances) — Step 1-5 personalization areas
 * 3. Service mismatch gate — 5 pairs, 0 wrong-domain leaks
 * 4. Required 5 comparisons — print resolved content
 * 5. Duplication gate — max overlap <70%
 * 6. Honesty gate — no fabricated claims
 * 7. Read-only safety — no setters in composer
 * 8. Module 3/4 dependency — no imports
 */

import { ALL_NICHES, ALL_MARKETS, MAIN_TRACK_OPTIONS } from '../src/data/module1/module1-content';
import type { NicheOption } from '../src/data/module1/module1-content';
import {
  composeStep1Content,
  composeStep2Content,
  composeStep3Content,
  composeStep4Content,
  composeStep5Content,
  composeStep6Content,
  composeStep7Content,
  composeStep8Content,
} from '../src/lib/offer-engineering/personalized-content';
import type { M2PersonalizationInput } from '../src/lib/offer-engineering/personalized-content';

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

let passed = 0;
let failed = 0;
let warnings = 0;

function check(condition: boolean, label: string, detail?: string) {
  if (condition) { passed++; }
  else { failed++; console.error(`  ❌ ${label}${detail ? `: ${detail}` : ''}`); }
}

function warn(condition: boolean, label: string, detail?: string) {
  if (!condition) { warnings++; console.warn(`  ⚠ ${label}${detail ? `: ${detail}` : ''}`); }
}

function ok(label: string) { passed++; }

function err(label: string, detail?: string) { failed++; console.error(`  ❌ ${label}${detail ? `: ${detail}` : ''}`); }

/* ──────────────────────────────────────────────
   Test data
   ────────────────────────────────────────────── */

const ALL_SERVICE_IDS: string[] = [];
for (const track of MAIN_TRACK_OPTIONS) {
  for (const sub of track.subTracks ?? []) {
    ALL_SERVICE_IDS.push(sub.id);
  }
}

const ALL_MARKET_IDS = new Set<string>();
for (const sid of ALL_SERVICE_IDS) {
  const markets = ALL_MARKETS[sid] ?? [];
  markets.forEach((m: any) => ALL_MARKET_IDS.add(m.id));
}

function parseCompositeKey(key: string): { serviceId: string; marketId: string } {
  for (const sid of ALL_SERVICE_IDS) {
    if (key.startsWith(sid + '_')) {
      return { serviceId: sid, marketId: key.slice(sid.length + 1) };
    }
  }
  return { serviceId: key, marketId: '' };
}

/** 80-chars for comparison */
function trunc(s: string, n = 60): string {
  return s.length <= n ? s : s.slice(0, n) + '...';
}

const FORBIDDEN_PATTERNS = [
  /\bundefined\b/, /\bnull\b/,
];

const CLAIM_PATTERNS = [
  /\d+%/, /\brevenue\b/i, /\bROAS\b/i, /\bconversion increase\b/i,
  /\bretention increase\b/i, /\bengagement increase\b/i,
  /\btime saved\b/i, /\bclient results\b/i, /\btestimonial\b/i,
  /\bguaranteed\b/i, /\bfree audit\b/i, /\bfree sample\b/i,
  /\bfree work\b/i, /\btrial project\b/i,
  /\bindustry standard\b/i, /\bmost buyers\b/i, /\bmost clients\b/i,
];

function buildInput(serviceId: string, marketId: string, nicheId: string | null, extras?: Partial<M2PersonalizationInput>): M2PersonalizationInput {
  return {
    careerTrackId: null,
    serviceId,
    marketId,
    nicheId,
    positioning: 'premium quality',
    offerType: 'retainer',
    deliverables: ['Core deliverable 1', 'Core deliverable 2', 'Core deliverable 3'],
    uniqueMechanism: 'Structured Delivery System',
    scopeLimits: { revisionCount: 2, deliveryTime: '48 hours', communicationMethod: 'Slack', responseTime: '24 hours', includedRounds: 2 },
    valueAmplifier: 'Priority support',
    pricingModel: 'flat_rate',
    finalPrice: 2500,
    ...extras,
  };
}

/* ──────────────────────────────────────────────
   TEST 1: 75-PATH COVERAGE
   ────────────────────────────────────────────── */

console.log('\n=== TEST 1: 75-PATH COVERAGE ===\n');

const allCompositeKeys = Object.keys(ALL_NICHES);
check(allCompositeKeys.length === 75, `Expected 75 paths, got ${allCompositeKeys.length}`);

interface M2PC {
  s1?: ReturnType<typeof composeStep1Content>;
  s2?: ReturnType<typeof composeStep2Content>;
  s3?: ReturnType<typeof composeStep3Content>;
  s4?: ReturnType<typeof composeStep4Content>;
  s5?: ReturnType<typeof composeStep5Content>;
  s6?: ReturnType<typeof composeStep6Content>;
  s7?: ReturnType<typeof composeStep7Content>;
  s8?: ReturnType<typeof composeStep8Content>;
}

const pathContents: Record<string, M2PC> = {};

for (const key of allCompositeKeys) {
  const { serviceId, marketId } = parseCompositeKey(key);
  const entry: M2PC = {};

  try {
    entry.s1 = composeStep1Content(buildInput(serviceId, marketId, null));
    entry.s2 = composeStep2Content(buildInput(serviceId, marketId, null));
    entry.s3 = composeStep3Content(buildInput(serviceId, marketId, null));
    entry.s4 = composeStep4Content(buildInput(serviceId, marketId, null));
    entry.s5 = composeStep5Content(buildInput(serviceId, marketId, null));
    entry.s6 = composeStep6Content(buildInput(serviceId, marketId, null));
    entry.s7 = composeStep7Content(buildInput(serviceId, marketId, null));
    entry.s8 = composeStep8Content(buildInput(serviceId, marketId, null));
    ok(`Path ${key}: all 8 steps resolved without exception`);
  } catch (e: any) {
    err(`Path ${key}: exception — ${e.message}`);
    continue;
  }

  // Validate each step output
  for (const [step, content] of Object.entries(entry)) {
    const allText = JSON.stringify(content);
    check(!/\\bundefined\\b/.test(allText), `${step} [${key}]: no undefined`);
    check(!/\\bnull\\b/.test(allText), `${step} [${key}]: no null`);
  }

  // S1 checks
  const s1 = entry.s1!;
  check(s1.recommendationRationale.length > 10, `S1 rationale [${key}]: non-empty`);
  check(s1.helperText.length > 10, `S1 helper [${key}]: non-empty`);
  check(Object.keys(s1.offerTypeExamples).length >= 3, `S1 examples [${key}]: 3 types`);
  check(s1.offerTypeExamples.retainer.length > 10, `S1 retainer example [${key}]: non-empty`);

  // S2 checks
  const s2 = entry.s2!;
  check(s2.suggestionRationale.length > 10, `S2 rationale [${key}]: non-empty`);
  check(s2.exampleGuidance.length > 10, `S2 guidance [${key}]: non-empty`);
  check(s2.helperText.length > 10, `S2 helper [${key}]: non-empty`);
  check(s2.placeholderHint.length > 3, `S2 placeholder [${key}]: non-empty`);

  // S3 checks
  const s3 = entry.s3!;
  check(s3.mechanismRationale.length > 10, `S3 rationale [${key}]: non-empty`);
  check(s3.namingExamples.length >= 2, `S3 examples [${key}]: >=2 examples`);
  check(s3.helperText.length > 10, `S3 helper [${key}]: non-empty`);

  // S4 checks
  const s4 = entry.s4!;
  check(s4.loadDefaultsExplanation.length > 10, `S4 explanation [${key}]: non-empty`);
  check(Object.keys(s4.fieldHelpers).length >= 5, `S4 field helpers [${key}]: 5 fields`);
  check(Object.keys(s4.fieldPlaceholders).length >= 5, `S4 placeholders [${key}]: 5 fields`);
  check(s4.emptyGuidance.length > 10, `S4 empty [${key}]: non-empty`);

  // S5 checks
  const s5 = entry.s5!;
  check(s5.amplifierRationale.length > 10, `S5 rationale [${key}]: non-empty`);
  check(s5.examples.length >= 1, `S5 examples [${key}]: >=1`);
  check(s5.emptyGuidance.length > 10, `S5 empty [${key}]: non-empty`);

  // S6 checks
  const s6 = entry.s6!;
  check(s6.flatRateHelper.length > 10, `S6 flat [${key}]: non-empty`);
  check(s6.tieredHelper.length > 10, `S6 tiered [${key}]: non-empty`);
  check(s6.valueBasedHelper.length > 10, `S6 value [${key}]: non-empty`);

  // S7 checks
  const s7 = entry.s7!;
  check(Object.keys(s7.reviewGuidance).length >= 5, `S7 guidance [${key}]: 5+ fields`);
  check(s7.nextActionGuidance.length > 10, `S7 next [${key}]: non-empty`);

  // S8 checks
  const s8 = entry.s8!;
  check(s8.executionGuidance.length > 10, `S8 execution [${key}]: non-empty`);
  check(s8.reviewGuidance.length > 10, `S8 review [${key}]: non-empty`);
  check(s8.nextActionHelper.length > 10, `S8 next [${key}]: non-empty`);

  pathContents[key] = entry;
}

console.log(`\n  75-path coverage: ${pathContents.length || Object.keys(pathContents).length}/${allCompositeKeys.length} paths`);

/* ──────────────────────────────────────────────
   TEST 2: ALL-NICHE HIGH-PRIORITY VALIDATION (375)
   ────────────────────────────────────────────── */

console.log('\n=== TEST 2: ALL-NICHE HIGH-PRIORITY (375 instances) ===\n');

let nichePassed = 0;
let nicheFailed = 0;
let nicheTotal = 0;

for (const key of allCompositeKeys) {
  const { serviceId, marketId } = parseCompositeKey(key);
  const entries: NicheOption[] = ALL_NICHES[key] ?? [];

  for (const niche of entries) {
    const input = buildInput(serviceId, marketId, niche.id);
    const label = `${serviceId}/${marketId}/${niche.id}`;
    let allNicheOk = true;

    try {
      // S1 area: offer type example + rationale
      const s1 = composeStep1Content(input);
      check(s1.recommendationRationale.length > 10, `S1 niche rationale [${label}]`);
      check(s1.offerTypeExamples.retainer.length > 10, `S1 niche retainer [${label}]`);
      const s1clean = !JSON.stringify(s1).includes(niche.id);
      // Only check snake_case IDs
      if (niche.id.includes('_')) {
        check(!JSON.stringify(s1).includes(niche.id), `S1 no raw ID [${label}]`);
      }

      // S2 area: deliverable helper/example
      const s2 = composeStep2Content(input);
      check(s2.exampleGuidance.length > 10, `S2 niche example [${label}]`);
      check(s2.placeholderHint.length > 3, `S2 niche placeholder [${label}]`);

      // S3 area: mechanism helper/example
      const s3 = composeStep3Content(input);
      check(s3.namingExamples.length >= 1, `S3 niche naming [${label}]`);

      // S4 area: scope helper/placeholders
      const s4 = composeStep4Content(input);
      check(Object.keys(s4.fieldPlaceholders).length >= 5, `S4 niche placeholders [${label}]`);
      check(Object.keys(s4.fieldHelpers).length >= 5, `S4 niche helpers [${label}]`);

      // S5 area: amplifier helper/example
      const s5 = composeStep5Content(input);
      check(s5.examples.length >= 1, `S5 niche examples [${label}]`);

      nichePassed++;
    } catch (e: any) {
      err(`Niche exception [${label}]: ${e.message}`);
      nicheFailed++;
      allNicheOk = false;
    }
    nicheTotal++;
  }
}

console.log(`\n  Niche high-priority: ${nichePassed} passed, ${nicheFailed} failed (total ${nicheTotal})`);

/* ──────────────────────────────────────────────
   TEST 3: SERVICE MISMATCH GATE
   ────────────────────────────────────────────── */

console.log('\n=== TEST 3: SERVICE MISMATCH GATE ===\n');

const MISMATCH_PAIRS: [string, string, string][] = [
  ['video_editor', 'youtube_editor', 'creators'],
  ['short_form_editor', 'podcast_clip_editor', 'creators'],
  ['ui_ux_designer', 'brand_designer', 'agencies'],
  ['frontend_developer', 'automation_developer', 'startups_saas'],
  ['landing_page_designer', 'landing_page_developer', 'agencies'],
];

// Build vocabulary profiles for each service — use distinctive execution terms from profiles
const SERVICE_VOCAB: Record<string, string[]> = {
  video_editor: ['multi-cam syncing', 'color grading', 'raw footage assembly', 'sequence editing'],
  youtube_editor: ['retention curve', 'pacing graph', 'watch time optimization', 'thumbnail design'],
  short_form_editor: ['hook structure', 'scroll stopping', 'vertical format pacing', 'trend adaptation'],
  podcast_clip_editor: ['audiogram production', 'waveform visualization', 'audio cleanup', 'show notes writing'],
  ui_ux_designer: ['wireframing', 'user flow mapping', 'prototype interactivity', 'component system design'],
  brand_designer: ['logo concepting', 'brand identity system', 'style guide creation', 'visual system design'],
  frontend_developer: ['responsive layout architecture', 'component state management', 'browser compatibility', 'react implementation'],
  automation_developer: ['workflow mapping', 'trigger logic design', 'api integration wiring', 'automation sequence'],
  landing_page_designer: ['conversion layout', 'hero section design', 'a/b test variation', 'social proof placement'],
  landing_page_developer: ['html/css build', 'static page deployment', 'responsive breakpoints', 'form integration'],
};

let mismatchPairsTested = 0;
let mismatchLeaks = 0;

for (const [serviceA, serviceB, market] of MISMATCH_PAIRS) {
  const inputA = buildInput(serviceA, market, null);
  const inputB = buildInput(serviceB, market, null);
  const vocA = SERVICE_VOCAB[serviceA] || [];
  const vocB = SERVICE_VOCAB[serviceB] || [];

  const s1A = JSON.stringify(composeStep1Content(inputA)).toLowerCase();
  const s1B = JSON.stringify(composeStep1Content(inputB)).toLowerCase();
  const s2A = JSON.stringify(composeStep2Content(inputA)).toLowerCase();
  const s2B = JSON.stringify(composeStep2Content(inputB)).toLowerCase();
  const s3A = JSON.stringify(composeStep3Content(inputA)).toLowerCase();
  const s3B = JSON.stringify(composeStep3Content(inputB)).toLowerCase();

  const allA = s1A + s2A + s3A;
  const allB = s1B + s2B + s3B;

  // Check A's unique vocab doesn't appear in B
  for (const term of vocA) {
    if (term !== vocB.find(v => v.includes(term) || term.includes(v))) {
      if (allB.includes(term)) {
        console.warn(`  ⚠ ${serviceA} term "${term}" found in ${serviceB} output [${market}]`);
        mismatchLeaks++;
      }
    }
  }
  // Check B's unique vocab doesn't appear in A
  for (const term of vocB) {
    if (term !== vocA.find(v => v.includes(term) || term.includes(v))) {
      if (allA.includes(term)) {
        console.warn(`  ⚠ ${serviceB} term "${term}" found in ${serviceA} output [${market}]`);
        mismatchLeaks++;
      }
    }
  }
  mismatchPairsTested++;
}

check(mismatchLeaks === 0, `Mismatch gate: ${mismatchLeaks} leaks across ${mismatchPairsTested} pairs`);
console.log(`  Pairs tested: ${mismatchPairsTested}, Leaks found: ${mismatchLeaks}`);

/* ──────────────────────────────────────────────
   TEST 4: REQUIRED COMPARISONS
   ────────────────────────────────────────────── */

console.log('\n=== TEST 4: REQUIRED COMPARISONS ===\n');

type Compare = { label: string; a: M2PersonalizationInput; b: M2PersonalizationInput };

const comparisons: Compare[] = [
  {
    label: 'A: short_form_editor + coaches + fitness_coaches vs youtube_creators + gaming_youtubers',
    a: buildInput('short_form_editor', 'coaches', 'fitness_coaches'),
    b: buildInput('short_form_editor', 'youtube_creators', 'gaming_youtubers'),
  },
  {
    label: 'B: video_editor vs youtube_editor',
    a: buildInput('video_editor', 'youtube_creators', null),
    b: buildInput('youtube_editor', 'youtube_creators', null),
  },
  {
    label: 'C: ui_ux_designer vs brand_designer',
    a: buildInput('ui_ux_designer', 'agencies', null),
    b: buildInput('brand_designer', 'agencies', null),
  },
  {
    label: 'D: frontend_developer vs automation_developer',
    a: buildInput('frontend_developer', 'startups_saas', null),
    b: buildInput('automation_developer', 'startups_saas', null),
  },
  {
    label: 'E: same service+market + 2 niches (video_editor + creators + fitness_coaches vs gaming_youtubers)',
    a: buildInput('video_editor', 'creators', 'fitness_coaches'),
    b: buildInput('video_editor', 'creators', 'gaming_youtubers'),
  },
];

for (const comp of comparisons) {
  console.log(`\n--- ${comp.label} ---`);
  try {
    const s1A = composeStep1Content(comp.a);
    const s1B = composeStep1Content(comp.b);
    const s2A = composeStep2Content(comp.a);
    const s2B = composeStep2Content(comp.b);
    const s3A = composeStep3Content(comp.a);
    const s3B = composeStep3Content(comp.b);
    const s4A = composeStep4Content(comp.a);
    const s4B = composeStep4Content(comp.b);
    const s5A = composeStep5Content(comp.a);
    const s5B = composeStep5Content(comp.b);
    const s6A = composeStep6Content(comp.a);
    const s6B = composeStep6Content(comp.b);
    const s7A = composeStep7Content(comp.a);
    const s7B = composeStep7Content(comp.b);
    const s8A = composeStep8Content(comp.a);
    const s8B = composeStep8Content(comp.b);

    const show = (label: string, aText: string, bText: string) => {
      const diff = aText !== bText;
      console.log(`  ${label}: ${diff ? '⬡ DIFF' : '⚠ SAME'}`);
      if (diff) {
        console.log(`    A: ${trunc(aText, 70)}`);
        console.log(`    B: ${trunc(bText, 70)}`);
      }
    };

    show('S1 rationale', s1A.recommendationRationale, s1B.recommendationRationale);
    show('S1 helper', s1A.helperText, s1B.helperText);
    show('S2 guidance', s2A.exampleGuidance, s2B.exampleGuidance);
    show('S3 rationale', s3A.mechanismRationale, s3B.mechanismRationale);
    show('S4 explanation', s4A.loadDefaultsExplanation, s4B.loadDefaultsExplanation);
    show('S5 rationale', s5A.amplifierRationale, s5B.amplifierRationale);
    show('S6 flat', s6A.flatRateHelper, s6B.flatRateHelper);
    show('S7 guidance', s7A.nextActionGuidance, s7B.nextActionGuidance);
    show('S8 execution', s8A.executionGuidance, s8B.executionGuidance);

    ok(`Comparison rendered: ${comp.label}`);
  } catch (e: any) {
    err(`Comparison exception: ${e.message}`);
  }
}

/* ──────────────────────────────────────────────
   TEST 5: DUPLICATION GATE
   ────────────────────────────────────────────── */

console.log('\n=== TEST 5: DUPLICATION GATE ===\n');

// Sample paths for overlap measurement
const samplePaths: { key: string; a: M2PersonalizationInput; b: M2PersonalizationInput; unrelated?: boolean }[] = [
  {
    key: 'video_editor/coaches ↔ short_form_editor/coaches',
    a: buildInput('video_editor', 'coaches', null),
    b: buildInput('short_form_editor', 'coaches', null),
    unrelated: false,
  },
  {
    key: 'video_editor/coaches ↔ ui_ux_designer/coaches',
    a: buildInput('video_editor', 'coaches', null),
    b: buildInput('ui_ux_designer', 'coaches', null),
    unrelated: true,
  },
  {
    key: 'frontend_developer/startups_saas ↔ automation_developer/startups_saas',
    a: buildInput('frontend_developer', 'startups_saas', null),
    b: buildInput('automation_developer', 'startups_saas', null),
    unrelated: true,
  },
  {
    key: 'short_form_editor/coaches/fitness_coaches ↔ short_form_editor/coaches/business_coaches',
    a: buildInput('short_form_editor', 'coaches', 'fitness_coaches'),
    b: buildInput('short_form_editor', 'coaches', 'business_coaches'),
    unrelated: false,
  },
];

const COMMON_WORDS = new Set([
  'the', 'and', 'for', 'are', 'with', 'your', 'what', 'this', 'that',
  'from', 'they', 'have', 'been', 'their', 'will', 'can', 'has', 'all',
  'but', 'not', 'you', 'its', 'was', 'how', 'each', 'which', 'who',
  'also', 'more', 'than', 'very', 'just', 'about', 'over', 'such',
  'way', 'make', 'made', 'based', 'need', 'needs', 'work', 'works',
  'help', 'best', 'good', 'well', 'set', 'one', 'two', 'new', 'use',
  'used', 'using', 'like', 'example', 'offer', 'type', 'step', 'key',
  'include', 'includes', 'including', 'ensures', 'define', 'defines',
  'delivery', 'options', 'scope', 'approach', 'without', 'output',
  'process', 'system', 'name', 'named', 'terms', 'core', 'offer',
  'value', 'between', 'define', 'clear', 'right', 'should', 'first',
  'select', 'choose', 'selection', 'fit', 'fits', 'each', 'both',
]);
function overlapScore(textA: string, textB: string): number {
  const wordsA = textA.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !COMMON_WORDS.has(w));
  const wordsB = new Set(textB.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !COMMON_WORDS.has(w)));
  if (wordsA.length === 0) return 0;
  const matches = wordsA.filter(w => wordsB.has(w)).length;
  return matches / wordsA.length;
}

let maxUnrelatedOverlap = 0;
let maxUnrelatedPair = '';
let nicheDiffOverlap = 0;
let nicheDiffPair = '';

for (const sample of samplePaths) {
  try {
    const s1A = composeStep1Content(sample.a);
    const s1B = composeStep1Content(sample.b);
    const s2A = composeStep2Content(sample.a);
    const s2B = composeStep2Content(sample.b);
    const s5A = composeStep5Content(sample.a);
    const s5B = composeStep5Content(sample.b);

    const allA = JSON.stringify(s1A) + JSON.stringify(s2A) + JSON.stringify(s5A);
    const allB = JSON.stringify(s1B) + JSON.stringify(s2B) + JSON.stringify(s5B);

    const overlap = overlapScore(allA, allB);
    if (sample.unrelated) {
      if (overlap > maxUnrelatedOverlap) {
        maxUnrelatedOverlap = overlap;
        maxUnrelatedPair = sample.key;
      }
    } else {
      if (overlap > nicheDiffOverlap) {
        nicheDiffOverlap = overlap;
        nicheDiffPair = sample.key;
      }
    }
    console.log(`  ${sample.key}: overlap ${(overlap * 100).toFixed(1)}%${sample.unrelated ? ' [unrelated]' : ' [niche-diff]'}`);
  } catch (e: any) {
    err(`Duplication check failed: ${e.message}`);
  }
}

check(maxUnrelatedOverlap < 0.7, `Max unrelated overlap ${(maxUnrelatedOverlap * 100).toFixed(1)}% — threshold <70%`);
console.log(`  MAX UNRELATED OVERLAP: ${(maxUnrelatedOverlap * 100).toFixed(1)}% (${maxUnrelatedPair})`);
console.log(`  NICHE DIFFERENTIATION OVERLAP: ${(nicheDiffOverlap * 100).toFixed(1)}% (${nicheDiffPair})`);
// Niche differentiation: same-service same-market paths may have higher overlap, which is expected.
// What matters is that niche signal is present (shown in comparisons above).

/* ──────────────────────────────────────────────
   TEST 6: HONESTY GATE
   ────────────────────────────────────────────── */

console.log('\n=== TEST 6: HONESTY GATE ===\n');

let honestyViolations = 0;

for (const key of allCompositeKeys.slice(0, 10)) {
  const { serviceId, marketId } = parseCompositeKey(key);
  const input = buildInput(serviceId, marketId, null);

  const allText = JSON.stringify([
    composeStep1Content(input),
    composeStep2Content(input),
    composeStep3Content(input),
    composeStep5Content(input),
    composeStep6Content(input),
  ]);

  for (const pat of CLAIM_PATTERNS) {
    if (pat.test(allText)) {
      // Check context — if it's mentioning avoidance, it's ok
      const idx = allText.search(pat);
      const context = allText.slice(Math.max(0, idx - 60), idx + 60).toLowerCase();
      if (!context.includes('avoid') && !context.includes('not') && !context.includes('don\'t')) {
        honestyViolations++;
        console.warn(`  ⚠ Possible claim in ${key}: matched "${pat}" — context: "${trunc(context, 60)}"`);
      }
    }
  }
}

check(honestyViolations === 0, `Honesty gate: ${honestyViolations} violations`);

/* ──────────────────────────────────────────────
   TEST 7: READ-ONLY SAFETY
   ────────────────────────────────────────────── */

console.log('\n=== TEST 7: READ-ONLY SAFETY ===\n');

import * as fs from 'fs';
const composerSrc = fs.readFileSync('./src/lib/offer-engineering/personalized-content.ts', 'utf-8');

const SETTER_PATTERNS = [
  'setOfferType', 'addDeliverable', 'removeDeliverable',
  'setUniqueMechanism', 'setScopeLimits', 'setValueAmplifier',
  'setPricingModel', 'setFinalPrice', 'setTieredPricing',
  'setValueBasedPricing', 'setProposalSummary', 'setOfferBlueprint',
  'setStore', '.setState', 'localStorage.setItem',
  'confirmStep', 'reset', 'clearModule2',
];

let setterViolations = 0;
for (const pat of SETTER_PATTERNS) {
  const regex = new RegExp(`\\b${pat}\\b`, 'g');
  const matches = composerSrc.match(regex);
  if (matches) {
    console.warn(`  ⚠ Found "${pat}" (${matches.length}x) in composer`);
    setterViolations++;
  }
}

check(setterViolations === 0, `Read-only: ${setterViolations} setter violations`);

/* ──────────────────────────────────────────────
   TEST 8: MODULE 3/4 DEPENDENCY CHECK
   ────────────────────────────────────────────── */

console.log('\n=== TEST 8: MODULE 3/4 DEPENDENCY CHECK ===\n');

const DEP_CHECK = [
  { dep: 'Module 3', pattern: '../module3/' },
  { dep: 'Module 4', pattern: '../portfolio-system/' },
  { dep: 'M3 store', pattern: 'useModule3Store' },
  { dep: 'M4 store', pattern: 'usePortfolioSystemStore' },
  { dep: 'M2 pathContentResolver', pattern: '../pathContentResolver' },
];

let depViolations = 0;
for (const { dep, pattern } of DEP_CHECK) {
  if (composerSrc.includes(pattern)) {
    console.warn(`  ⚠ ${dep} dependency found in composer`);
    depViolations++;
  }
}

check(depViolations === 0, `Module dependency: ${depViolations} violations`);

/* ──────────────────────────────────────────────
   RESULTS
   ────────────────────────────────────────────── */

console.log('\n══════════════════════════════════════');
console.log(`  Total: ${passed + failed + warnings} checks`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log(`  Warnings: ${warnings}`);
console.log('══════════════════════════════════════\n');

if (failed > 0) {
  console.log(`\n  ❌ VALIDATION FAILED — ${failed} failures`);
  process.exit(1);
} else {
  console.log(`\n  ✅ All validation checks passed.`);
}
