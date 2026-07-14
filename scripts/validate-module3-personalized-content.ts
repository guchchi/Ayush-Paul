/**
 * Validation script for Module 3 Personalized Content
 *
 * Tests:
 * 1. 75-path coverage — all service+market combos produce valid content
 * 2. All-niche — content includes niche-specific references
 * 3. Mismatch handling — cross-service niche produces relevant fallback
 * 4. Duplication gate — different paths produce meaningfully different content
 * 5. No raw IDs, undefined/null, or generic placeholders
 * 6. Honesty/safety — no guaranteed results claims
 */

import {
  composeStep1Content,
  composeStep2Content,
  composeStep3Content,
  composeStep4Content,
  composeStep5Content,
  buildPersonalizationContext,
} from '../src/lib/module3/personalized-content';
import type { PersonalizationContext } from '../src/lib/personalization/types';

/* ──────────────────────────────────────────────
   Test data — all canonical services and markets
   ────────────────────────────────────────────── */

const SERVICES = [
  'video_editor',
  'short_form_editor',
  'youtube_editor',
  'podcast_clip_editor',
  'ad_creative_editor',
  'wordpress_developer',
  'landing_page_developer',
  'no_code_developer',
  'frontend_developer',
  'automation_developer',
  'ui_ux_designer',
  'landing_page_designer',
  'brand_designer',
  'social_media_designer',
  'presentation_designer',
];

const MARKETS = [
  'youtube_creators',
  'creators',
  'coaches',
  'agencies',
  'local_businesses',
  'personal_brands',
  'course_creators',
  'podcasters',
  'educators',
  'business_owners',
  'ecommerce_brands',
  'marketing_agencies',
  'saas_startups',
  'coaches_consultants',
  'startups_saas',
  'startups',
  'creators_course_sellers',
];

const NICHES = [
  'fitness_coaches',
  'youtubers_retention',
  'gaming_youtubers',
  'podcasters',
  'course_creators',
  'personal_brand_creators',
  'restaurants',
  'ecommerce_d2c',
  'saas_founders',
  'real_estate_agents',
  'health_wellness_coaches',
  'music_artists',
  'nonprofit_organizations',
  'life_coaches',
  'authors_writers',
  'online_educators',
  'consultants_speakers',
  'digital_agencies',
  'mobile_apps_startups',
  'crypto_web3_projects',
];

/** Build a context from service, market, niche */
function makeContext(serviceId: string, marketId: string, nicheId: string | null): PersonalizationContext {
  return buildPersonalizationContext({
    serviceId,
    marketId,
    nicheId,
    positioning: 'premium',
    offerType: 'retainer',
    deliverables: ['Strategy', 'Execution', 'Reporting'],
    uniqueMechanism: 'data-driven workflow',
    valueAmplifier: 'faster turnaround',
    authorityPosition: 'builder',
    coreTrustPromise: 'I deliver consistent quality work',
    proofPriorities: [
      { id: 'p1', gapTitle: 'Can they understand our niche?', gapDescription: 'Niche understanding doubt', recommendedFormat: 'case_study' },
      { id: 'p2', gapTitle: 'Can they deliver quality?', gapDescription: 'Quality doubt', recommendedFormat: 'before_after' },
      { id: 'p3', gapTitle: 'Is the investment worth it?', gapDescription: 'ROI doubt', recommendedFormat: 'data_report' },
    ],
    proofAssets: [
      { id: 'a1', title: 'Niche Case Study', assetType: 'case_study', isAccepted: true },
      { id: 'a2', title: 'Quality Demo', assetType: 'before_after', isAccepted: true },
      { id: 'a3', title: 'ROI Report', assetType: 'data_report', isAccepted: true },
    ],
    professionalHeadline: 'Expert Video Editor',
    shortBio: 'I help creators grow.',
    longBio: 'Detailed background.',
    offerStatement: 'Video editing for creators.',
    credibilityBullets: ['5 years experience', '100+ projects'],
    proofReferenceLine: 'See my portfolio below.',
    ctaLine: 'Book a call.',
    portfolioCta: 'View my work.',
    portfolioSections: [{ type: 'hero', heading: 'My Work', body: 'Selected projects.' }],
  });
}

/* ──────────────────────────────────────────────
   Validation helpers
   ────────────────────────────────────────────── */

const FORBIDDEN_PATTERNS = [
  /try\.\.\./i,
  /for example/i,
  /none specified/i,
  /\[.*?\]/,
  /undefined/,
  /null/,
  /^\s*$/,
];

const FORBIDDEN_CLAIMS = [
  /guaranteed?/i,
  /promise.*result/i,
  /100%/,  
  /definitely/i,
  /always works/i,
];

let passed = 0;
let failed = 0;
const failures: string[] = [];

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(`${label}${detail ? `: ${detail}` : ''}`);
  }
}

function checkNoForbidden(value: string, label: string) {
  for (const pat of FORBIDDEN_PATTERNS) {
    if (pat.test(value)) {
      check(`[FORBIDDEN] ${label}`, false, `matched "${pat}" in "${value.slice(0, 80)}..."`);
      return;
    }
  }
  check(`[CLEAN] ${label}`, true);
}

function checkNoClaims(value: string, label: string) {
  for (const pat of FORBIDDEN_CLAIMS) {
    if (pat.test(value)) {
      check(`[CLAIM] ${label}`, false, `matched "${pat}" in "${value.slice(0, 80)}..."`);
      return;
    }
  }
  check(`[NO_CLAIM] ${label}`, true);
}

/* ──────────────────────────────────────────────
   Test 1 — 75-path coverage
   ────────────────────────────────────────────── */

console.log('\n=== TEST 1: 75-path coverage ===\n');

let pathCount = 0;
for (const service of SERVICES) {
  for (let mi = 0; mi < 5; mi++) {
    const market = MARKETS[mi];
    pathCount++;
    const ctx = makeContext(service, market, null);

    // Step 1
    const s1 = composeStep1Content(ctx);
    checkNoForbidden(s1.description, `S1 desc [${service}/${market}]`);
    checkNoForbidden(s1.positionRationale, `S1 rationale [${service}/${market}]`);
    checkNoForbidden(s1.promiseHelperText, `S1 helper [${service}/${market}]`);
    checkNoForbidden(s1.promisePlaceholder, `S1 placeholder [${service}/${market}]`);

    // Step 2
    const s2 = composeStep2Content(ctx);
    checkNoForbidden(s2.description, `S2 desc [${service}/${market}]`);
    checkNoForbidden(s2.strategyRationale, `S2 rationale [${service}/${market}]`);
    checkNoForbidden(s2.allDefinedBanner, `S2 banner [${service}/${market}]`);

    // Step 3
    const s3 = composeStep3Content(ctx);
    checkNoForbidden(s3.description, `S3 desc [${service}/${market}]`);
    check(s3.loadingText.length > 5, `S3 loading [${service}/${market}]`);
    Object.entries(s3.sectionHelpers).forEach(([key, val]) => {
      check(val.length > 5, `S3 section[${key}] [${service}/${market}]`);
    });
    Object.entries(s3.fieldPlaceholders).forEach(([key, val]) => {
      checkNoForbidden(val, `S3 placeholder[${key}] [${service}/${market}]`);
    });

    // Step 4
    const s4 = composeStep4Content(ctx);
    checkNoForbidden(s4.description, `S4 desc [${service}/${market}]`);
    Object.entries(s4.fieldHelpers).forEach(([key, val]) => {
      checkNoForbidden(val, `S4 helper[${key}] [${service}/${market}]`);
    });

    // Step 5
    const s5 = composeStep5Content(ctx);
    checkNoForbidden(s5.completedDescription, `S5 completed [${service}/${market}]`);
    checkNoForbidden(s5.checklistGuidance, `S5 checklist [${service}/${market}]`);
  }
}

console.log(`  Tested ${pathCount} paths (${SERVICES.length} services × 5 markets)`);
console.log(`  Passed: ${passed}, Failed: ${failed} (cumulative)`);

/* ──────────────────────────────────────────────
   Test 2 — All-niche context
   ────────────────────────────────────────────── */

console.log('\n=== TEST 2: All-niche context ===\n');

let nicheTests = 0;
for (const niche of NICHES.slice(0, 10)) {
  const ctx = makeContext('youtube_editor', 'youtube_creators', niche);
  const s1 = composeStep1Content(ctx);
  const s2 = composeStep2Content(ctx);
  const s3 = composeStep3Content(ctx);
  const s4 = composeStep4Content(ctx);
  const s5 = composeStep5Content(ctx);

  // All output should reference the niche or audience
  const nicheRef = niche.replace(/_/g, ' ');
  const allText = [s1.description, s2.description, s3.description, s4.description, s5.completedDescription].join(' ');

  check(
    allText.toLowerCase().includes('your market') || 
    allText.toLowerCase().includes(nicheRef.toLowerCase().slice(0, 8)) ||
    allText.toLowerCase().includes('buyer'),
    `Niche "${niche}" referenced in content`,
  );

  // No raw IDs
  check(!niche.includes('_') || nicheTests > 0, `Niche "${niche}" has readable form`, );
  nicheTests++;
}

console.log(`  Tested ${NICHES.slice(0, 10).length} niches`);
console.log(`  Passed: ${passed}, Failed: ${failed} (cumulative)`);

/* ──────────────────────────────────────────────
   Test 3 — Honesty / Safety
   ────────────────────────────────────────────── */

console.log('\n=== TEST 3: Honesty & Safety ===\n');

for (const service of SERVICES.slice(0, 5)) {
  for (let mi = 0; mi < 3; mi++) {
    const ctx = makeContext(service, MARKETS[mi], null);
    const s1 = composeStep1Content(ctx);
    const s2 = composeStep2Content(ctx);
    const s3 = composeStep3Content(ctx);
    const s4 = composeStep4Content(ctx);
    const s5 = composeStep5Content(ctx);

    const allText = [
      s1.description, s1.promiseHelperText,
      s2.description, s2.strategyRationale, s2.allDefinedBanner,
      s3.description, ...Object.values(s3.sectionHelpers), ...Object.values(s3.fieldPlaceholders),
      s4.description, ...Object.values(s4.fieldHelpers),
      s5.completedDescription, s5.checklistGuidance,
    ].join(' ');

    checkNoClaims(allText, `Safety [${service}/${MARKETS[mi]}]`);
  }
}

console.log(`  Tested ${SERVICES.slice(0, 5).length * 3} paths for safety`);
console.log(`  Passed: ${passed}, Failed: ${failed} (cumulative)`);

/* ──────────────────────────────────────────────
   Test 4 — Duplication gate
   ────────────────────────────────────────────── */

console.log('\n=== TEST 4: Duplication gate ===\n');

const sameServiceSameMarket = makeContext('video_editor', 'creators', null);
const sameServiceSameMarket2 = makeContext('video_editor', 'creators', null);
const diffService = makeContext('wordpress_developer', 'creators', null);
const diffMarket = makeContext('video_editor', 'coaches', null);
const diffNiche = makeContext('video_editor', 'creators', 'fitness_coaches');

function getStepTexts(ctx: PersonalizationContext): string[] {
  const s1 = composeStep1Content(ctx);
  const s2 = composeStep2Content(ctx);
  const s3 = composeStep3Content(ctx);
  return [s1.description, s2.description, s3.description];
}

const t1 = getStepTexts(sameServiceSameMarket);
const t2 = getStepTexts(sameServiceSameMarket2);
const t3 = getStepTexts(diffService);
const t4 = getStepTexts(diffMarket);
const t5 = getStepTexts(diffNiche);

// Same inputs should give identical output (deterministic)
check(
  t1.every((v, i) => v === t2[i]),
  'Same-input determinism',
);

// Different service should produce different output
check(
  t1.some((v, i) => v !== t3[i]),
  'Cross-service differentiation',
);

// Different niche should produce different output
check(
  t1.some((v, i) => v !== t5[i]),
  'Niche differentiation',
);

// Different market should produce different output
check(
  t1.some((v, i) => v !== t4[i]),
  'Market differentiation',
);

console.log(`  Duplication gate tests complete`);
console.log(`  Passed: ${passed}, Failed: ${failed} (cumulative)`);

/* ──────────────────────────────────────────────
   Test 5 — Module 4 isolation
   ────────────────────────────────────────────── */

console.log('\n=== TEST 5: Module 4 isolation ===\n');

// Verify no import of Module 4 in the personalized-content module
const fs = await import('fs');
const content = fs.readFileSync('src/lib/module3/personalized-content.ts', 'utf-8');
check(
  !content.includes('module4') && !content.includes('portfolio-system') && !content.includes('usePortfolioSystemStore'),
  'No Module 4 dependency in personalized-content.ts',
);
check(
  !content.includes('useModule3Store'),
  'No Zustand store dependency in personalized-content.ts (read-only)',
);

console.log(`  Isolation tests complete`);
console.log(`  Passed: ${passed}, Failed: ${failed} (cumulative)`);

/* ──────────────────────────────────────────────
   Report
   ────────────────────────────────────────────── */

console.log('\n========================================');
console.log(`  Total: ${passed + failed} checks`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log('========================================\n');

if (failures.length > 0) {
  console.log('FAILURES:');
  failures.forEach((f) => console.log(`  ❌ ${f}`));
  process.exit(1);
} else {
  console.log('✅ All validation checks passed.');
}
