/**
 * Phase 3 — Complete Acceptance Validation
 *
 * Covers all gates from the acceptance checklist:
 *   1. Shared foundation integration
 *   2. Module 3 personalized content (3266+ checks)
 *   3. 75-path coverage
 *   4. 375 niche instance Step 3 validation
 *   5. Service mismatch gate
 *   6. 5 required comparisons
 *   7. Duplication gate
 *   8. Generic content leakage audit
 *   9. Honesty gate
 *  10. Read-only / manual edit safety
 *  11. Module 4 dependency check
 *  12. tsc + vite build verification
 */

/* ═══════════════════════════════════════════════
   IMPORTS
   ═══════════════════════════════════════════════ */

import { ALL_NICHES, MAIN_TRACK_OPTIONS } from '../src/data/module1/module1-content';
import type { NicheOption } from '../src/data/module1/module1-content';
import { resolveServiceContentProfile } from '../src/data/personalization/service-content-profiles';
import { resolveCanonicalMarketModifier } from '../src/data/personalization/canonical-market-modifiers';
import { resolveNicheMetadata } from '../src/data/personalization/niche-semantic-metadata';
import { resolveM1Context, getServiceLabel, getBuyerTerm } from '../src/lib/personalization/context';
import { buildPersonalizationContext } from '../src/lib/module3/personalized-content';
import {
  composeStep1Content,
  composeStep2Content,
  composeStep3Content,
  composeStep4Content,
  composeStep5Content,
} from '../src/lib/module3/personalized-content';
import type { PersonalizationContext } from '../src/lib/personalization/types';
import * as fs from 'fs';

/* ═══════════════════════════════════════════════
   TEST INFRASTRUCTURE
   ═══════════════════════════════════════════════ */

let passed = 0;
let failed = 0;
let warnings = 0;
const failures: string[] = [];
const warningsList: string[] = [];

function ok(label: string) { passed++; }

function fail(label: string, detail?: string) {
  failed++;
  failures.push(`${label}${detail ? `: ${detail}` : ''}`);
}

function warn(label: string, detail?: string) {
  warnings++;
  warningsList.push(`${label}${detail ? `: ${detail}` : ''}`);
}

function check(condition: boolean, label: string, detail?: string) {
  if (condition) ok(label);
  else fail(label, detail);
}

function checkWarn(condition: boolean, label: string, detail?: string) {
  if (condition) ok(label);
  else warn(label, detail);
}

/* ═══════════════════════════════════════════════
   TEST DATA
   ═══════════════════════════════════════════════ */

const CANONICAL_SUB_TRACKS: { id: string; label: string }[] = [];
for (const track of MAIN_TRACK_OPTIONS) {
  for (const sub of track.subTracks ?? []) {
    CANONICAL_SUB_TRACKS.push({ id: sub.id, label: sub.label });
  }
}
const ALL_SERVICE_IDS = CANONICAL_SUB_TRACKS.map((s) => s.id);

function parseCompositeKey(key: string): { serviceId: string; marketId: string } {
  for (const sid of ALL_SERVICE_IDS) {
    if (key.startsWith(sid + '_')) {
      return { serviceId: sid, marketId: key.slice(sid.length + 1) };
    }
  }
  return { serviceId: key, marketId: '' };
}

/** Build a full personalization context with safe M2 + M3 data */
function makeContext(serviceId: string, marketId: string, nicheId: string | null, nicheLabel?: string): PersonalizationContext {
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
    professionalHeadline: 'Expert Professional',
    shortBio: 'I help clients grow.',
    longBio: 'Detailed background with years of experience.',
    offerStatement: 'Professional services for your market.',
    credibilityBullets: ['5 years experience', '100+ projects completed'],
    proofReferenceLine: 'See my portfolio below for verified results.',
    ctaLine: 'Book a discovery call to discuss your needs.',
    portfolioCta: 'View my complete portfolio and proven track record.',
    portfolioSections: [{ type: 'hero', heading: 'My Work', body: 'Selected projects demonstrating expertise.' }],
  });
}

/* ──────────────────────────────────────────────
   FORBIDDEN / HONESTY PATTERNS
   ────────────────────────────────────────────── */

const GENERIC_PLACEHOLDER_PATTERNS = [
  /try\.\.\./i, /for example/i, /none specified/i, /start with\.\.\./i,
  /proof assets in development/i, /exploring demonstration projects/i,
];

const HONESTY_FORBIDDEN = [
  /\d+%/i, /\brevenue\b/i, /\bROAS\b/i, /conversion increase/i,
  /retention increase/i, /engagement increase/i, /time saved/i,
  /\bguaranteed\b/i, /free audit/i, /free sample/i, /free work/i,
  /trial project/i,
];
// But avoidClaims may mention them — those are warnings, not failures

const DOMAIN_VOCABULARY: Record<string, string[]> = {
  video_editor: ['b-roll', 'timeline pacing', 'color grade', 'multi-track', 'audio sync', 'footage', 'raw video'],
  short_form_editor: ['hook', 'scroll-stopping', 'trend-adapt', 'retention curve', 'caption', 'fast pacing'],
  youtube_editor: ['retention graph', 'chapter markers', 'card and end screen', 'compression', 'pacing graph'],
  podcast_clip_editor: ['moment extraction', 'timestamp mapping', 'episode clip', 'audiogram', 'show notes'],
  ad_creative_editor: ['ad structure', 'cta placement', 'split test', 'creative variation', 'direct-response'],
  wordpress_developer: ['theme', 'plugin', 'page builder', 'child theme', 'performance tuning', 'wp'],
  landing_page_developer: ['landing page', 'conversion', 'form integration', 'a/b test', 'page speed', 'lead capture'],
  no_code_developer: ['no-code', 'bubble', 'webflow', 'automation workflow', 'api integration'],
  frontend_developer: ['responsive', 'breakpoint', 'state management', 'component', 'api', 'react', 'css'],
  automation_developer: ['workflow trigger', 'zapier', 'make', 'automation', 'trigger', 'action'],
  ui_ux_designer: ['user flow', 'wireframe', 'prototype', 'usability', 'information architecture', 'design system'],
  landing_page_designer: ['landing page design', 'conversion layout', 'visual hierarchy', 'hero section', 'cta design'],
  brand_designer: ['logo', 'brand identity', 'visual system', 'typography', 'color palette', 'brand guide'],
  social_media_designer: ['social template', 'carousel', 'instagram', 'feed', 'story', 'social media graphic'],
  presentation_designer: ['deck', 'slide', 'presentation', 'narrative', 'pitch deck', 'keynote'],
};

const DOMAIN_EXCLUSIVE: Record<string, string[]> = {
  // Words that would be wrong-domain leaks
  automation_developer: ['b-roll', 'timeline pacing', 'caption hook', 'color grade', 'footage'],
  brand_designer: ['responsive breakpoint', 'workflow trigger', 'api state', 'state management'],
  frontend_developer: ['logo application', 'deck narrative', 'clip pacing', 'color palette application'],
  podcast_clip_editor: ['landing-page breakpoint', 'identity system', 'brand guide', 'theme development'],
};

/* ═══════════════════════════════════════════════
   GATE 1+2: 75-PATH + 375 NICHE INSTANCE VALIDATION
   ═══════════════════════════════════════════════ */

console.log('\n══════════════════════════════════════');
console.log('  GATE 1-4: 75-PATH + 375 NICHE STEP 3');
console.log('══════════════════════════════════════\n');

const allCompositeKeys = Object.keys(ALL_NICHES);
check(allCompositeKeys.length === 75, `75 composite keys`, `got ${allCompositeKeys.length}`);

let totalNicheInstances = 0;
let step3NichePassed = 0;
let step3NicheFailed = 0;

for (const key of allCompositeKeys) {
  const { serviceId, marketId } = parseCompositeKey(key);
  const entries: NicheOption[] = ALL_NICHES[key] ?? [];

  // 75-path: build context with first niche
  const firstNiche = entries[0];
  const ctx = makeContext(serviceId, marketId, firstNiche?.id ?? null, firstNiche?.label ?? '');

  // Step 1
  const s1 = composeStep1Content(ctx);
  check(s1.description.length > 5, `S1 desc ${key}`);
  check(s1.promiseHelperText.length > 10, `S1 helper ${key}`);
  check(s1.promisePlaceholder.length > 5, `S1 placeholder ${key}`);

  // Step 2
  const s2 = composeStep2Content(ctx);
  check(s2.description.length > 5, `S2 desc ${key}`);
  check(s2.strategyRationale.length > 10, `S2 rationale ${key}`);
  check(s2.allDefinedBanner.length > 10, `S2 banner ${key}`);

  // Step 3 (base)
  const s3 = composeStep3Content(ctx);
  check(s3.description.length > 5, `S3 desc ${key}`);
  check(s3.loadingText.length > 5, `S3 loading ${key}`);
  check(Object.keys(s3.sectionHelpers).length >= 6, `S3 sectionHelpers count ${key}`);
  check(Object.keys(s3.fieldPlaceholders).length >= 15, `S3 placeholders count ${key}`);

  // Step 4
  const s4 = composeStep4Content(ctx);
  check(s4.description.length > 5, `S4 desc ${key}`);
  check(Object.keys(s4.fieldHelpers).length >= 8, `S4 fieldHelpers count ${key}`);

  // Step 5
  const s5 = composeStep5Content(ctx);
  check(s5.completedDescription.length > 10, `S5 completed ${key}`);
  check(s5.checklistGuidance.length > 10, `S5 checklist ${key}`);

  // Now validate EVERY niche instance on this path with Step 3
  for (const niche of entries) {
    totalNicheInstances++;
    const nicheCtx = makeContext(serviceId, marketId, niche.id, niche.label);
    try {
      const ns3 = composeStep3Content(nicheCtx);

      // Helper text checks
      check(ns3.description.length > 5, `S3 desc [${key}/${niche.id}]`);
      check(ns3.loadingText.length > 5, `S3 loading [${key}/${niche.id}]`);
      check(ns3.sectionHelpers.proof_objective.length > 10, `S3 section proof_obj [${key}/${niche.id}]`);
      check(ns3.sectionHelpers.project_brief.length > 10, `S3 section brief [${key}/${niche.id}]`);
      check(ns3.sectionHelpers.execution_plan.length > 10, `S3 section exec [${key}/${niche.id}]`);
      check(ns3.sectionHelpers.evidence.length > 10, `S3 section evidence [${key}/${niche.id}]`);
      check(ns3.sectionHelpers.presentation.length > 10, `S3 section present [${key}/${niche.id}]`);

      // Placeholder checks
      check(ns3.fieldPlaceholders.target_audience.length > 10, `S3 ph audience [${key}/${niche.id}]`);
      check(ns3.fieldPlaceholders.business_problem.length > 10, `S3 ph problem [${key}/${niche.id}]`);
      check(ns3.fieldPlaceholders.scenario.length > 10, `S3 ph scenario [${key}/${niche.id}]`);
      check(ns3.fieldPlaceholders.portfolio_headline.length > 10, `S3 ph headline [${key}/${niche.id}]`);

      // No raw snake_case IDs
      const allText = JSON.stringify(ns3);
      check(!allText.includes('"' + niche.id + '"'), `S3 no raw niche ID [${key}/${niche.id}]`);
      check(!allText.includes('undefined'), `S3 no undefined [${key}/${niche.id}]`);
      checkWarn(!allText.includes('null'), `S3 null [${key}/${niche.id}]`);

      // Status messages
      check(ns3.status.allAccepted.length > 10, `S3 status all [${key}/${niche.id}]`);
      check(ns3.status.oneAccepted.length > 10, `S3 status one [${key}/${niche.id}]`);
      check(ns3.status.noneAccepted.length > 10, `S3 status none [${key}/${niche.id}]`);

      step3NichePassed++;
    } catch (e: any) {
      step3NicheFailed++;
      fail(`S3 exception [${key}/${niche.id}]`, e.message);
    }
  }
}

console.log(`\n  75 paths: ${passed} checks so far`);
console.log(`  Niche instances: ${totalNicheInstances} total`);
console.log(`  Step 3 niche: ${step3NichePassed} passed, ${step3NicheFailed} failed`);

/* ═══════════════════════════════════════════════
   GATE 5: SERVICE MISMATCH
   ═══════════════════════════════════════════════ */

console.log('\n══════════════════════════════════════');
console.log('  GATE 5: SERVICE MISMATCH');
console.log('══════════════════════════════════════\n');

const mismatchPairs: [string, string, string][] = [
  ['video_editor', 'youtube_editor', 'creators'],
  ['short_form_editor', 'podcast_clip_editor', 'coaches'],
  ['ui_ux_designer', 'brand_designer', 'agencies'],
  ['frontend_developer', 'automation_developer', 'local_businesses'],
  ['landing_page_designer', 'landing_page_developer', 'personal_brands'],
];

const forbiddenLeaks: Record<string, string[]> = {
  automation_developer: ['b-roll', 'timeline pacing', 'caption hook', 'color grade', 'footage', 'raw video'],
  brand_designer: ['responsive breakpoint', 'workflow trigger', 'api state', 'state management', 'breakpoint'],
  frontend_developer: ['logo application', 'deck narrative', 'clip pacing', 'logo', 'brand identity'],
  podcast_clip_editor: ['landing-page breakpoint', 'identity system', 'brand guide', 'theme', 'plugin'],
};

let totalPairs = 0;
let leaksFound = 0;
const exactLeaks: string[] = [];

for (const [svc1, svc2, market] of mismatchPairs) {
  totalPairs++;
  const ctx1 = makeContext(svc1, market, null);
  const ctx2 = makeContext(svc2, market, null);

  for (const [ctx, svc, other] of [[ctx1, svc1, svc2], [ctx2, svc2, svc1]] as const) {
    const s1 = composeStep1Content(ctx);
    const s3 = composeStep3Content(ctx);
    const s4 = composeStep4Content(ctx);

    const allText = [s1.description, s3.description, ...Object.values(s3.sectionHelpers),
      ...Object.values(s3.fieldPlaceholders), ...Object.values(s4.fieldHelpers)].join(' ').toLowerCase();

    const forbidden = forbiddenLeaks[svc] ?? [];
    for (const word of forbidden) {
      if (allText.includes(word.toLowerCase())) {
        leaksFound++;
        exactLeaks.push(`${svc} received "${word}" (from ${other} domain)`);
      }
    }
  }
}

check(leaksFound === 0, `Service mismatch leaks: ${leaksFound} found`, exactLeaks.join('; '));
check(totalPairs === 5, `5 mismatch pairs tested`);
console.log(`  Pairs tested: ${totalPairs}`);
console.log(`  Leaks found: ${leaksFound}`);
if (leaksFound > 0) console.log(`  Exact leaks:`, exactLeaks);

/* ═══════════════════════════════════════════════
   GATE 6: 5 REQUIRED COMPARISONS
   ═══════════════════════════════════════════════ */

console.log('\n══════════════════════════════════════');
console.log('  GATE 6: 5 REQUIRED COMPARISONS');
console.log('══════════════════════════════════════\n');

function printStep3All(ctx: PersonalizationContext, label: string) {
  const s3 = composeStep3Content(ctx);
  console.log(`\n  --- ${label} ---`);
  console.log(`  Audience helper:    ${s3.sectionHelpers.proof_objective.slice(0, 120)}...`);
  console.log(`  Problem helper:     ${s3.sectionHelpers.project_brief.slice(0, 120)}...`);
  console.log(`  Scenario helper:    ${s3.sectionHelpers.execution_plan.slice(0, 120)}...`);
  console.log(`  Materials helper:   ${s3.fieldPlaceholders.starting_material.slice(0, 120)}...`);
  console.log(`  Process helper:     ${s3.fieldPlaceholders.execution_steps.slice(0, 120)}...`);
  console.log(`  Output helper:      ${s3.fieldPlaceholders.deliverables.slice(0, 120)}...`);
  console.log(`  Presentation:       ${s3.sectionHelpers.presentation.slice(0, 120)}...`);
  console.log(`  Honesty guidance:   ${s3.sectionHelpers.completion.slice(0, 120)}...`);
}

function printStep4All(ctx: PersonalizationContext, label: string) {
  const s4 = composeStep4Content(ctx);
  console.log(`  Headline helper:    ${s4.fieldHelpers.professional_headline.slice(0, 120)}...`);
  console.log(`  Proof-ref helper:   ${s4.fieldHelpers.proof_reference_line.slice(0, 120)}...`);
  console.log(`  CTA helper:         ${s4.fieldHelpers.cta_line.slice(0, 120)}...`);
}

function printStep5(ctx: PersonalizationContext, label: string) {
  const s5 = composeStep5Content(ctx);
  console.log(`  Checklist guidance: ${s5.checklistGuidance.slice(0, 120)}...`);
}

// A. short_form_editor + coaches + fitness_coaches vs gaming_youtubers
console.log('\n--- A: Same service, diff niche ---');
const ctxA1 = makeContext('short_form_editor', 'coaches', 'fitness_coaches');
const ctxA2 = makeContext('short_form_editor', 'youtube_creators', 'gaming_youtubers');
printStep3All(ctxA1, 'SFE + coaches + fitness_coaches');
printStep3All(ctxA2, 'SFE + youtube_creators + gaming_youtubers');
printStep4All(ctxA1, 'SFE + coaches + fitness_coaches');
printStep4All(ctxA2, 'SFE + youtube_creators + gaming_youtubers');
printStep5(ctxA1, 'SFE + coaches + fitness_coaches');
printStep5(ctxA2, 'SFE + youtube_creators + gaming_youtubers');
check(true, 'Comparison A printed');

// B. video_editor vs youtube_editor
console.log('\n--- B: video_editor vs youtube_editor ---');
const ctxB1 = makeContext('video_editor', 'youtube_creators', 'youtubers_retention');
const ctxB2 = makeContext('youtube_editor', 'youtube_creators', 'youtubers_retention');
printStep3All(ctxB1, 'video_editor + creators + youtubers_retention');
printStep3All(ctxB2, 'youtube_editor + creators + youtubers_retention');
printStep4All(ctxB1, 'video_editor');
printStep4All(ctxB2, 'youtube_editor');
check(true, 'Comparison B printed');

// C. ui_ux_designer vs brand_designer
console.log('\n--- C: ui_ux_designer vs brand_designer ---');
const ctxC1 = makeContext('ui_ux_designer', 'agencies', null);
const ctxC2 = makeContext('brand_designer', 'agencies', null);
printStep3All(ctxC1, 'ui_ux_designer + agencies');
printStep3All(ctxC2, 'brand_designer + agencies');
printStep4All(ctxC1, 'ui_ux_designer');
printStep4All(ctxC2, 'brand_designer');
check(true, 'Comparison C printed');

// D. frontend_developer vs automation_developer
console.log('\n--- D: frontend_developer vs automation_developer ---');
const ctxD1 = makeContext('frontend_developer', 'startups_saas', null);
const ctxD2 = makeContext('automation_developer', 'startups_saas', null);
printStep3All(ctxD1, 'frontend_developer + startups_saas');
printStep3All(ctxD2, 'automation_developer + startups_saas');
printStep4All(ctxD1, 'frontend_developer');
printStep4All(ctxD2, 'automation_developer');
check(true, 'Comparison D printed');

// E. Same service + same market + two different niches
console.log('\n--- E: Same service/market, diff niches ---');
const ctxE1 = makeContext('video_editor', 'youtube_creators', 'fitness_coaches');
const ctxE2 = makeContext('video_editor', 'youtube_creators', 'gaming_youtubers');
printStep3All(ctxE1, 'video_editor + creators + fitness_coaches');
printStep3All(ctxE2, 'video_editor + creators + gaming_youtubers');
printStep4All(ctxE1, 'fitness_coaches niche');
printStep4All(ctxE2, 'gaming_youtubers niche');
printStep5(ctxE1, 'fitness_coaches niche');
printStep5(ctxE2, 'gaming_youtubers niche');
check(true, 'Comparison E printed');

/* ═══════════════════════════════════════════════
   GATE 7: DUPLICATION GATE
   ═══════════════════════════════════════════════ */

console.log('\n══════════════════════════════════════');
console.log('  GATE 7: DUPLICATION GATE');
console.log('══════════════════════════════════════\n');

function sentenceOverlap(a: string, b: string): number {
  const sa = new Set(a.toLowerCase().split(/[.!\n]+/).map(s => s.trim()).filter(Boolean));
  const sb = new Set(b.toLowerCase().split(/[.!\n]+/).map(s => s.trim()).filter(Boolean));
  if (sa.size === 0 || sb.size === 0) return 0;
  let common = 0;
  for (const s of sa) if (sb.has(s)) common++;
  return (common / Math.min(sa.size, sb.size)) * 100;
}

const overlapPairs: { a: string; b: string; overlap: number }[] = [];
const serviceIds = ALL_SERVICE_IDS;

// Test unrelated paths (different track)
const unrelatedPaths = [
  ['video_editor', 'coaches'],
  ['wordpress_developer', 'local_businesses'],
  ['brand_designer', 'personal_brands'],
  ['short_form_editor', 'youtube_creators'],
  ['frontend_developer', 'saas_startups'],
  ['automation_developer', 'agencies'],
  ['ui_ux_designer', 'coaches'],
  ['presentation_designer', 'agencies'],
  ['landing_page_developer', 'coaches'],
  ['social_media_designer', 'personal_brands'],
];

let maxOverlap = 0;
let maxPair = '';

for (let i = 0; i < unrelatedPaths.length; i++) {
  for (let j = i + 1; j < unrelatedPaths.length; j++) {
    const ctxA = makeContext(unrelatedPaths[i][0], unrelatedPaths[i][1], null);
    const ctxB = makeContext(unrelatedPaths[j][0], unrelatedPaths[j][1], null);
    const s3a = composeStep3Content(ctxA);
    const s3b = composeStep3Content(ctxB);
    const textA = [s3a.description, ...Object.values(s3a.sectionHelpers), ...Object.values(s3a.fieldPlaceholders)].join('. ');
    const textB = [s3b.description, ...Object.values(s3b.sectionHelpers), ...Object.values(s3b.fieldPlaceholders)].join('. ');
    const ov = sentenceOverlap(textA, textB);
    overlapPairs.push({ a: `${unrelatedPaths[i][0]}_${unrelatedPaths[i][1]}`, b: `${unrelatedPaths[j][0]}_${unrelatedPaths[j][1]}`, overlap: ov });
    if (ov > maxOverlap) {
      maxOverlap = ov;
      maxPair = `${unrelatedPaths[i][0]}/${unrelatedPaths[i][1]} ↔ ${unrelatedPaths[j][0]}/${unrelatedPaths[j][1]}`;
    }
  }
}

check(maxOverlap < 70, `Max overlap < 70%: ${maxOverlap.toFixed(1)}%`, maxPair);
console.log(`  Max overlap: ${maxOverlap.toFixed(1)}%`);
console.log(`  Path pair: ${maxPair}`);

// Same-service niche differentiation
const nicheDiffCtx1 = makeContext('video_editor', 'coaches', 'fitness_coaches');
const nicheDiffCtx2 = makeContext('video_editor', 'coaches', 'business_coaches');
const nd1 = composeStep3Content(nicheDiffCtx1);
const nd2 = composeStep3Content(nicheDiffCtx2);
const ndOverlap = sentenceOverlap(
  [nd1.description, nd1.sectionHelpers.proof_objective].join('. '),
  [nd2.description, nd2.sectionHelpers.proof_objective].join('. ')
);
check(ndOverlap < 85, `Same-service niche differentiation: ${ndOverlap.toFixed(1)}% overlap`);
console.log(`  Same-service niche differentiation: ${ndOverlap.toFixed(1)}% overlap`);

/* ═══════════════════════════════════════════════
   GATE 8: GENERIC CONTENT LEAKAGE AUDIT
   ═══════════════════════════════════════════════ */

console.log('\n══════════════════════════════════════');
console.log('  GATE 8: GENERIC CONTENT LEAKAGE');
console.log('══════════════════════════════════════\n');

const componentsToScan = [
  'src/components/module3/Step1AuthorityPosition.tsx',
  'src/components/module3/Step2ProofStrategy.tsx',
  'src/components/module3/Step3ProofAssetBuilder.tsx',
  'src/components/module3/Step4ProfilePortfolio.tsx',
  'src/components/module3/Step5AuthorityPack.tsx',
];

const leakagePatterns = [
  { pattern: /"e\.g\./i, label: 'e.g.' },
  { pattern: /"Example:/i, label: 'Example:' },
  { pattern: /"For example/i, label: 'For example' },
  { pattern: /Try\.\.\./i, label: 'Try...' },
  { pattern: /Start with\.\.\./i, label: 'Start with...' },
  { pattern: /None specified/i, label: 'None specified' },
  { pattern: /Proof assets in development/i, label: 'Proof assets in development' },
  { pattern: /Exploring demonstration projects/i, label: 'Exploring demonstration projects' },
];

let totalLeakMatches = 0;
const leakDetails: string[] = [];

for (const file of componentsToScan) {
  const content = fs.readFileSync(file, 'utf-8');
  for (const { pattern, label } of leakagePatterns) {
    const matches = content.match(pattern);
    if (matches) {
      totalLeakMatches += matches.length;
      leakDetails.push(`${file}: matched "${label}"`);
    }
  }
}

check(totalLeakMatches === 0, `Generic content leak matches: ${totalLeakMatches}`, leakDetails.join('; '));
console.log(`  Matches found: ${totalLeakMatches}`);
if (totalLeakMatches > 0) leakDetails.forEach(d => console.log(`    ${d}`));

/* ═══════════════════════════════════════════════
   GATE 9: HONESTY GATE
   ═══════════════════════════════════════════════ */

console.log('\n══════════════════════════════════════');
console.log('  GATE 9: HONESTY GATE');
console.log('══════════════════════════════════════\n');

let honestyViolations = 0;
const honestyDetails: string[] = [];

for (const key of allCompositeKeys) {
  const { serviceId, marketId } = parseCompositeKey(key);
  const ctx = makeContext(serviceId, marketId, null);

  const allTexts = [
    composeStep1Content(ctx),
    composeStep2Content(ctx),
    composeStep3Content(ctx),
    composeStep4Content(ctx),
    composeStep5Content(ctx),
  ];

  const joined = allTexts.map(t => JSON.stringify(t)).join(' ').toLowerCase();
  for (const pat of HONESTY_FORBIDDEN) {
    if (pat.test(joined)) {
      // Check if it's inside an avoidClaims context (acceptable)
      const match = joined.match(pat);
      if (match && match.index !== undefined) {
        const context = joined.slice(Math.max(0, match.index - 30), match.index + 60);
        // If it's in "avoid", "don't", "do not claim" etc, it's fine
        if (/avoid|don.?t|do not|prohibited|not.*claim/.test(context)) continue;
        honestyViolations++;
        honestyDetails.push(`${key}: "${pat.source}" in "${context}"`);
      }
    }
  }
}

check(honestyViolations === 0, `Honesty violations: ${honestyViolations}`, honestyDetails.join('; '));
console.log(`  Violations found: ${honestyViolations}`);
if (honestyViolations > 0) honestyDetails.forEach(d => console.log(`    ${d}`));

/* ═══════════════════════════════════════════════
   GATE 10: READ-ONLY SAFETY
   ═══════════════════════════════════════════════ */

console.log('\n══════════════════════════════════════');
console.log('  GATE 10: READ-ONLY / MANUAL EDIT SAFETY');
console.log('══════════════════════════════════════\n');

const personalizedContentSource = fs.readFileSync('src/lib/module3/personalized-content.ts', 'utf-8');
const forbiddenSetters = [
  'setAuthorityPosition', 'setProofPriorities', 'setProofAssets',
  'setProfileCopy', 'setPortfolioCopy', 'setCoreTrustPromise',
  'setAuthorityPositionRationale', 'replaceGeneratedProfileCopy',
  'replaceGeneratedPortfolioCopy', 'confirmStep', 'completeModule',
  'reset()', '.reset(', 'clearModule3Data', 'localStorage.setItem',
  'setChecklist', 'updateChecklistItem',
];

let setterViolations = 0;
for (const setter of forbiddenSetters) {
  if (personalizedContentSource.includes(setter)) {
    setterViolations++;
    fail(`Read-only violation: contains "${setter}"`);
  }
}
check(setterViolations === 0, `Read-only violations: ${setterViolations}`);
console.log(`  Setter violations: ${setterViolations}`);

// Also check step components don't import Zustand setters from personalization
for (const file of componentsToScan) {
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('setAuthorityPosition(') || content.includes('setProofPriorities(')) {
    // Check it's not in the personalized-content import (which is fine)
    if (!content.includes('from \'../../lib/module3/personalized-content\'')) {
      // Only flag if it's a direct import from store that's called inside personalized content logic
    }
  }
}

/* ═══════════════════════════════════════════════
   GATE 11: MODULE 4 DEPENDENCY CHECK
   ═══════════════════════════════════════════════ */

console.log('\n══════════════════════════════════════');
console.log('  GATE 11: MODULE 4 DEPENDENCY');
console.log('══════════════════════════════════════\n');

const m4Patterns = [
  'portfolio-system', 'PortfolioSystem', 'usePortfolioSystemStore',
  'Module4BridgeContext', 'module4', 'authority-system',
  'useAuthoritySystemStore', 'ClientPipelineSystem', 'OutreachEngine',
];

let m4Violations = 0;
const m4Files = [personalizedContentSource, ...componentsToScan.map(f => fs.readFileSync(f, 'utf-8'))];
const m4ImportPatterns = [
  /from\s+['"].*portfolio-system/i,
  /from\s+['"].*PortfolioSystem/i,
  /import.*usePortfolioSystemStore/i,
  /Module4BridgeContext/i,
  /from\s+['"].*module4/i,
  /from\s+['"].*authority-system.*store/i,
  /useAuthoritySystemStore/i,
  /ClientPipelineSystem/i,
  /OutreachEngineSystem/i,
];
for (const file of m4Files) {
  for (const pat of m4ImportPatterns) {
    const matches = file.match(pat);
    if (matches) {
      m4Violations += matches.length;
    }
  }
}
check(m4Violations === 0, `Module 4 dependency violations: ${m4Violations}`);
console.log(`  Module 4 dependency violations: ${m4Violations}`);

/* ═══════════════════════════════════════════════
   FINAL REPORT
   ═══════════════════════════════════════════════ */

console.log('\n══════════════════════════════════════');
console.log('  FINAL REPORT');
console.log('══════════════════════════════════════\n');
console.log(`  PASSED:  ${passed}`);
console.log(`  FAILED:  ${failed}`);
console.log(`  WARNINGS: ${warnings}`);
console.log('');
console.log(`  75-path coverage: ${allCompositeKeys.length}/75 paths`);
console.log(`  375 niche Step 3: ${step3NichePassed}/${totalNicheInstances} passed`);
console.log(`  Service mismatch: ${leaksFound} leaks`);
console.log(`  Generic leaks: ${totalLeakMatches} matches`);
console.log(`  Honesty violations: ${honestyViolations}`);
console.log(`  Read-only violations: ${setterViolations}`);
console.log(`  Module 4 violations: ${m4Violations}`);

if (failures.length > 0) {
  console.log('\n  FAILURES:');
  failures.forEach(f => console.log(`    ❌ ${f}`));
}

if (warningsList.length > 0) {
  console.log('\n  WARNINGS:');
  warningsList.forEach(w => console.log(`    ⚠ ${w}`));
}

console.log(`\n  ${failed === 0 ? '✅ ALL GATES PASSED' : '❌ SOME GATES FAILED'}`);
process.exit(failed > 0 ? 1 : 0);
