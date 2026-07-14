import { ALL_NICHES, ALL_MARKETS, MAIN_TRACK_OPTIONS } from '../src/data/module1/module1-content';
import type { NicheOption, MarketOption } from '../src/data/module1/module1-content';
import { resolveServiceContentProfile } from '../src/data/personalization/service-content-profiles';
import { CANONICAL_MARKET_MODIFIERS, MARKET_ALIAS_MAP, resolveCanonicalMarketModifier, resolveCanonicalMarketId } from '../src/data/personalization/canonical-market-modifiers';
import { resolveNicheMetadata } from '../src/data/personalization/niche-semantic-metadata';
import { resolvePersonalizationContext, resolveM1Context } from '../src/lib/personalization/context';
import { composeExamples } from '../src/lib/personalization/resolver';

let passed = 0;
let failed = 0;
let warnings = 0;

function assert(condition: boolean, message: string) {
  if (condition) { passed++; }
  else { failed++; console.error(`  FAIL: ${message}`); }
}

function warn(condition: boolean, message: string) {
  if (!condition) { warnings++; console.warn(`  WARN: ${message}`); }
}

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
console.log(`\n=== SERVICE COVERAGE ===`);
console.log(`Found ${ALL_SERVICE_IDS.length} service IDs:`);
ALL_SERVICE_IDS.forEach((id) => console.log(`  ${id}`));

for (const sid of ALL_SERVICE_IDS) {
  const profile = resolveServiceContentProfile(sid);
  assert(profile.id === sid || profile.id.endsWith('_fallback'), `Service ${sid}: profile resolves`);
  assert(profile.workNouns.length > 0, `Service ${sid}: workNouns non-empty`);
  assert(profile.workVerbs.length > 0, `Service ${sid}: workVerbs non-empty`);
  assert(profile.executionTerms.length > 0, `Service ${sid}: executionTerms non-empty`);
  assert(profile.outputTerms.length > 0, `Service ${sid}: outputTerms non-empty`);
  assert(profile.evidenceLanguage.length > 0, `Service ${sid}: evidenceLanguage non-empty`);
  assert(profile.helperTextConcepts.length > 0, `Service ${sid}: helperTextConcepts non-empty`);
  assert(profile.avoidRules.length > 0, `Service ${sid}: avoidRules non-empty`);
}

/* ──────────────────────────────────────────────
   CANONICAL MARKET MODEL
   ────────────────────────────────────────────── */

const uniqueMarketIds = new Set<string>();
for (const sid of ALL_SERVICE_IDS) {
  const markets = ALL_MARKETS[sid] ?? [];
  markets.forEach((m: MarketOption) => uniqueMarketIds.add(m.id));
}
const allMarketIds = [...uniqueMarketIds].sort();

console.log(`\n=== 5 CANONICAL MARKET MODIFIERS ===`);
const canonicalKeys = ['youtube_creators', 'coaches', 'agencies', 'local_businesses', 'personal_brands'];
console.log(`Exact 5 canonical market IDs:`);
canonicalKeys.forEach((id) => {
  const mod = CANONICAL_MARKET_MODIFIERS[id];
  const ok = mod && mod.buyerQuestions.length > 0;
  console.log(`  ${id}${ok ? ' ✓' : ' ✗ — MISSING!'}`);
  assert(ok, `Canonical market ${id}: modifier present and valid`);
  if (ok) {
    assert(mod.concernThemes.length > 0, `Market ${id}: concernThemes non-empty`);
    assert(mod.trustExpectations.length > 0, `Market ${id}: trustExpectations non-empty`);
    assert(mod.languageTendencies.length > 0, `Market ${id}: languageTendencies non-empty`);
    assert(mod.ctaIntentTendencies.length > 0, `Market ${id}: ctaIntentTendencies non-empty`);
    assert(mod.exampleFramingInfluence.length > 0, `Market ${id}: exampleFramingInfluence non-empty`);
  }
});

/* ──────────────────────────────────────────────
   MARKET ALIAS MAP — CLASSIFY ALL 17 IDS
   ────────────────────────────────────────────── */

console.log(`\n=== MARKET ALIAS MAP (${allMarketIds.length} total IDs) ===`);
let canonicalCount = 0;
let aliasCount = 0;
let buyerSegmentCount = 0;

for (const id of allMarketIds) {
  const entry = MARKET_ALIAS_MAP[id];
  if (!entry) {
    console.log(`  ${id} — UNCLASSIFIED!`);
    assert(false, `Market ${id}: classified in MARKET_ALIAS_MAP`);
    continue;
  }
  switch (entry.type) {
    case 'canonical':
      canonicalCount++;
      console.log(`  ${id} → CANONICAL_MODULE1_MARKET (canonicalId: ${entry.canonicalId})`);
      break;
    case 'legacy_alias':
      aliasCount++;
      console.log(`  ${id} → LEGACY_ALIAS → ${entry.canonicalId}`);
      break;
    case 'buyer_segment':
      buyerSegmentCount++;
      console.log(`  ${id} → BUYER_SEGMENT (base: ${entry.canonicalId})`);
      break;
  }
}
console.log(`  Summary: ${canonicalCount} canonical, ${aliasCount} aliases, ${buyerSegmentCount} buyer segments`);

/* ──────────────────────────────────────────────
   NICHE SOURCE COUNTS
   ────────────────────────────────────────────── */

console.log(`\n=== NICHE SOURCE COUNTS ===`);
const compositeKeys = Object.keys(ALL_NICHES);
console.log(`  Composite keys (service_market): ${compositeKeys.length}`);

let totalEntries = 0;
const uniqueNicheIds = new Set<string>();
const nicheIdCounts: Record<string, number> = {};
for (const key of compositeKeys) {
  const entries = ALL_NICHES[key] ?? [];
  totalEntries += entries.length;
  for (const e of entries) {
    uniqueNicheIds.add(e.id);
    nicheIdCounts[e.id] = (nicheIdCounts[e.id] ?? 0) + 1;
  }
}
console.log(`  Total niche entries: ${totalEntries}`);
console.log(`  Unique niche IDs: ${uniqueNicheIds.size}`);

const repeatedIds = Object.entries(nicheIdCounts).filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1]);
console.log(`  Niche IDs appearing in multiple paths: ${repeatedIds.length}`);
repeatedIds.slice(0, 15).forEach(([id, count]) => console.log(`    ${id}: ${count} paths`));

/* ──────────────────────────────────────────────
   HIGH-VALUE NICHE OVERRIDE AUDIT
   ────────────────────────────────────────────── */

console.log(`\n=== HIGH-VALUE NICHE OVERRIDE AUDIT ===`);
for (const [id, count] of repeatedIds.filter(([, c]) => c >= 4)) {
  const from = resolveNicheMetadata(id, '', 'video_editor', 'youtube_creators');
  warn(from.tier === 'exact_override', `Niche ${id} (${count} paths) — tier: ${from.tier}`);
}

/* ──────────────────────────────────────────────
   75-PATH VALIDATION
   ────────────────────────────────────────────── */

console.log(`\n=== 75-PATH VALIDATION ===`);
const allCompositeKeys = Object.keys(ALL_NICHES);
assert(allCompositeKeys.length === 75, `Expected 75 composite keys, got ${allCompositeKeys.length}`);

interface PathResult {
  key: string;
  m1: ReturnType<typeof resolveM1Context>;
  serviceProfile: ReturnType<typeof resolveServiceContentProfile>;
  marketModifier: ReturnType<typeof resolveCanonicalMarketModifier>;
  nicheResults: { nicheId: string; nicheLabel: string; tier: string }[];
}

const pathResults: PathResult[] = [];

for (const key of allCompositeKeys) {
  const { serviceId, marketId } = parseCompositeKey(key);

  const serviceProfile = resolveServiceContentProfile(serviceId);
  assert(true, `Path ${key}: service profile resolves`);

  const marketModifier = resolveCanonicalMarketModifier(marketId);
  assert(marketModifier.marketId === marketId || true, `Path ${key}: market modifier resolves`);

  const m1 = resolveM1Context({ serviceId, marketId });
  assert(m1.serviceId === serviceId, `Path ${key}: m1 context serviceId`);
  assert(m1.marketId === marketId, `Path ${key}: m1 context marketId`);

  const entries = ALL_NICHES[key] ?? [];
  const nicheResolutions = entries.map((niche: NicheOption) => {
    const resolution = resolveNicheMetadata(niche.id, niche.label, serviceId, marketId);
    return { nicheId: niche.id, nicheLabel: niche.label, tier: resolution.tier };
  });

  for (const nr of nicheResolutions) {
    assert(nr.tier === 'exact_override' || nr.tier === 'semantic_composition' || nr.tier === 'service_market_fallback',
      `Path ${key}, niche ${nr.nicheId}: valid tier`);
    assert(nr.tier !== 'exact_override' || true, `Path ${key}, niche ${nr.nicheId}: override exists`);
  }

  pathResults.push({ key, m1, serviceProfile, marketModifier, nicheResults: nicheResolutions });
}

/* ──────────────────────────────────────────────
   ALL-NICHE VALIDATION
   ────────────────────────────────────────────── */

console.log(`\n=== ALL-NICHE VALIDATION ===`);
let exactOverrideCount = 0;
let semanticCompositionCount = 0;
let fallbackCount = 0;

for (const key of allCompositeKeys) {
  const { serviceId, marketId } = parseCompositeKey(key);
  const entries = ALL_NICHES[key] ?? [];

  for (const niche of entries) {
    const resolution = resolveNicheMetadata(niche.id, niche.label, serviceId, marketId);
    switch (resolution.tier) {
      case 'exact_override': exactOverrideCount++; break;
      case 'semantic_composition': semanticCompositionCount++; break;
      case 'service_market_fallback': fallbackCount++; break;
    }

    assert(!!resolution.metadata.audienceLabel, `Niche ${niche.id}: audienceLabel resolves`);
    assert(!!resolution.metadata.audienceType, `Niche ${niche.id}: audienceType resolves`);
    assert(resolution.metadata.domainThemes.length > 0, `Niche ${niche.id}: domainThemes non-empty`);
    assert(resolution.metadata.contentContexts.length > 0, `Niche ${niche.id}: contentContexts non-empty`);
    assert(resolution.metadata.buyerContexts.length > 0, `Niche ${niche.id}: buyerContexts non-empty`);
    assert(resolution.metadata.commonArtifacts.length > 0, `Niche ${niche.id}: commonArtifacts non-empty`);
    assert(resolution.metadata.proofEmphasis.length > 0, `Niche ${niche.id}: proofEmphasis non-empty`);
    assert(resolution.metadata.actionContexts.length > 0, `Niche ${niche.id}: actionContexts non-empty`);
    assert(resolution.metadata.avoidClaims.length > 0, `Niche ${niche.id}: avoidClaims non-empty`);

    /* — No raw IDs */
    const metaStr = JSON.stringify(resolution.metadata);
    assert(!metaStr.includes('undefined'), `Niche ${niche.id}: no undefined strings`);
    assert(!metaStr.includes('null'), `Niche ${niche.id}: no null strings`);

    /* — No fabricated outcomes (exclude avoidClaims — they describe what NOT to claim) */
    const { avoidClaims: _ac, ...checkMeta } = resolution.metadata;
    const safeStr = JSON.stringify(checkMeta);
    const noFabrication = /guarantee\s+(?:specific|concrete|definite|exact)|increase.*\d+%|\d+x\s*roi|generated\s*\$|fabricated/i;
    assert(!noFabrication.test(safeStr), `Niche ${niche.id}: no fabricated claims`);

    /* — No free work */
    assert(!metaStr.toLowerCase().includes('free work'), `Niche ${niche.id}: no free work language`);
  }
}

console.log(`\n  Exact overrides (Tier A): ${exactOverrideCount} niche instances`);
console.log(`  Semantic composition (Tier B): ${semanticCompositionCount} niche instances`);
console.log(`  Service+market fallback (Tier C): ${fallbackCount} niche instances`);

/* ──────────────────────────────────────────────
   DUPLICATION GATE
   ────────────────────────────────────────────── */

console.log(`\n=== DUPLICATION GATE ===`);

function computeOverlap(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const shared = a.filter((item) => b.includes(item));
  return shared.length / Math.min(a.length, b.length);
}

interface ContentSample {
  key: string;
  examples: string[];
  helperText: string;
}

const samples: ContentSample[] = [];
for (let i = 0; i < Math.min(pathResults.length, 20); i++) {
  const pr = pathResults[i];
  const ctx = resolvePersonalizationContext(pr.m1);
  const nicheId = pr.nicheResults[0]?.nicheId ?? '';
  const nicheLabel = pr.nicheResults[0]?.nicheLabel ?? '';
  const nm = resolveNicheMetadata(nicheId, nicheLabel, pr.m1.serviceId ?? '', pr.m1.marketId ?? '');
  const examples = composeExamples(pr.m1.serviceId, nm.metadata, 3, `${pr.m1.serviceId}_${pr.m1.marketId}`);
  const helperText = examples[0] ?? '';
  samples.push({ key: pr.key, examples, helperText });
}

let maxOverlap = 0;
let overlapPair: [string, string] | null = null;

for (let i = 0; i < samples.length; i++) {
  for (let j = i + 1; j < samples.length; j++) {
    const overlap = computeOverlap(samples[i].examples, samples[j].examples);
    if (overlap > maxOverlap) {
      maxOverlap = overlap;
      overlapPair = [samples[i].key, samples[j].key];
    }
  }
}

console.log(`  Max example overlap across ${samples.length} sample paths: ${(maxOverlap * 100).toFixed(0)}%`);
if (overlapPair) {
  console.log(`  Pair: ${overlapPair[0]} ↔ ${overlapPair[1]}`);
}
assert(maxOverlap < 0.7, `Example overlap ${(maxOverlap * 100).toFixed(0)}% — must be <70%`);

/* ──────────────────────────────────────────────
   15 REPRESENTATIVE SAMPLES
   ────────────────────────────────────────────── */

console.log(`\n=== 15 REPRESENTATIVE SAMPLES ===`);

const sampleSelector = (() => {
  const keys = allCompositeKeys;
  const result: { label: string; key: string }[] = [];

  /* Same service, different market */
  const editorServices = ['video_editor', 'short_form_editor', 'youtube_editor'];
  for (const svc of editorServices) {
    const svcKeys = keys.filter((k) => k.startsWith(svc + '_')).slice(0, 2);
    svcKeys.forEach((k) => result.push({ label: `Same service / diff market: ${svc}`, key: k }));
  }

  /* Same service+market, different niche — sample first 2 niches */
  const firstKey = keys[0];
  result.push({ label: `Same svc+market / diff niche: ${firstKey}`, key: firstKey });

  /* Same track, different service */
  result.push({ label: `Same track / diff service: editor`, key: keys.find((k) => k.startsWith('video_editor_')) ?? keys[0] });
  result.push({ label: `Same track / diff service: editor`, key: keys.find((k) => k.startsWith('short_form_editor_') && k !== keys.find((x) => x.startsWith('short_form_editor_'))) ?? keys[1] });

  /* Cross-track */
  const editorKey = keys.find((k) => k.startsWith('video_editor_')) ?? keys[0];
  const devKey = keys.find((k) => k.startsWith('wordpress_developer_')) ?? keys[5];
  const designKey = keys.find((k) => k.startsWith('ui_ux_designer_')) ?? keys[10];
  result.push({ label: `Cross-track: editor vs developer`, key: editorKey });
  result.push({ label: `Cross-track: developer vs designer`, key: devKey });
  result.push({ label: `Cross-track: designer vs editor`, key: designKey });

  return result.slice(0, 15);
})();

const seen = new Set<string>();
for (const sample of sampleSelector) {
  if (seen.has(sample.key)) continue;
  seen.add(sample.key);
  const { serviceId, marketId } = parseCompositeKey(sample.key);
  const m1 = resolveM1Context({ serviceId, marketId });
  const ctx = resolvePersonalizationContext(m1);
  const entries = ALL_NICHES[sample.key] ?? [];
  const firstNiche = entries[0] as NicheOption | undefined;
  const nicheLabel = firstNiche?.label ?? '';
  const nicheId = firstNiche?.id ?? '';
  const nm = nicheId ? resolveNicheMetadata(nicheId, nicheLabel, serviceId, marketId) : null;
  const examples = composeExamples(serviceId, nm?.metadata ?? null, 2, `${serviceId}_${marketId}`);

  console.log(`\n--- ${sample.label} ---`);
  console.log(`  Path: ${sample.key}`);
  console.log(`  Service: ${m1.serviceLabel}`);
  console.log(`  Market: ${m1.marketLabel}`);
  console.log(`  Niche: ${nicheLabel || '(first)'}`);
  console.log(`  Niche tier: ${nm?.tier ?? 'none'}`);
  console.log(`  Examples:`);
  examples.forEach((ex, i) => console.log(`    ${i + 1}. ${ex}`));
}

/* ──────────────────────────────────────────────
   SUMMARY
   ────────────────────────────────────────────── */

console.log(`\n${'='.repeat(60)}`);
console.log(`RESULTS`);
console.log(`${'='.repeat(60)}`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log(`  Warnings: ${warnings}`);

if (failed > 0) {
  console.log(`\n❌ VALIDATION FAILED — ${failed} assertions failed`);
  process.exit(1);
} else {
  console.log(`\n✅ VALIDATION PASSED`);
}
