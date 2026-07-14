import { composeAll } from '../src/lib/portfolio-system/composer';
import type { UpstreamContext, PortfolioBuildPack, PortfolioDirection, PortfolioSectionSpec, ProjectPlacement, PortfolioCopyArchitecture, CTAArchitecture } from '../src/types/portfolio-system';

/* ──────────────────────────────────────────────
   TEST MATRIX
   ────────────────────────────────────────────── */

const SERVICES = [
  'video_editor', 'short_form_editor', 'youtube_editor', 'podcast_clip_editor', 'ad_creative_editor',
  'wordpress_developer', 'landing_page_developer', 'no_code_developer', 'frontend_developer', 'automation_developer',
  'ui_ux_designer', 'landing_page_designer', 'brand_designer', 'social_media_designer', 'presentation_designer',
] as const;

const MARKETS = [
  'youtube_creators', 'coaches', 'ecommerce_brands', 'saas_startups', 'local_businesses',
] as const;

const NICHES: { marketId: string; nicheId: string }[] = [
  { marketId: 'youtube_creators', nicheId: 'gaming' },
  { marketId: 'coaches', nicheId: 'fitness_coaches' },
  { marketId: 'coaches', nicheId: 'business_coaches' },
  { marketId: 'youtube_creators', nicheId: 'educational' },
];

const AUTHORITY_POSITIONS = ['practitioner', 'builder', 'auditor', 'deconstructor'] as const;

/* ──────────────────────────────────────────────
   CONTEXT BUILDER
   ────────────────────────────────────────────── */

function buildContext(serviceId: string, marketId: string, nicheId: string | null, ap: string, ctaLine?: string): UpstreamContext {
  return {
    mod1CareerTrackId: serviceId,
    mod1ServiceId: serviceId,
    mod1MarketId: marketId,
    mod1NicheId: nicheId,
    mod1OfferId: `${serviceId}-${marketId}`,
    mod1Positioning: `${serviceId}-${marketId}`,
    mod2OfferType: 'project',
    mod2Deliverables: ['deliverable_1', 'deliverable_2'],
    mod2UniqueMechanism: 'Unique methodology for delivering results',
    mod2ScopeLimits: { includes: ['core'], excludes: ['revisions'] },
    mod2ValueAmplifier: 'Value amplification through process efficiency',
    mod2PricingModel: 'project_based',
    mod2ProposalSummary: { total: 2500, timeline: '2 weeks' },
    mod3AuthorityPosition: ap,
    mod3CoreTrustPromise: 'I deliver quality work on time',
    mod3ProofPriorities: [
      { id: 'pp1', gapTitle: 'Trust gap 1', gapDescription: 'Need to prove capability', recommendedFormat: 'case_study' },
      { id: 'pp2', gapTitle: 'Trust gap 2', gapDescription: 'Need to show process', recommendedFormat: 'process_doc' },
    ],
    mod3ProofAssets: [
      {
        id: 'asset1', priorityId: 'pp1', title: 'Project Alpha', assetType: 'case_study',
        credibilityGapProved: 'demonstrated ability to deliver quality work',
        portfolioCopy: { headline: 'Project Alpha: A Case Study', description: 'How we solved the problem', proofStatement: 'Delivered measurable improvement', cta: 'See the full case study' },
        presentationStructure: ['problem', 'approach', 'solution', 'results'],
        isAccepted: true,
        deliverables: ['Final delivery', 'Documentation'],
        completionChecklist: ['Review assets', 'Write summary'],
      },
      {
        id: 'asset2', priorityId: 'pp2', title: 'Project Beta', assetType: 'process_doc',
        credibilityGapProved: 'process efficiency and reliability',
        portfolioCopy: { headline: 'Project Beta: Process Overview', description: 'Streamlined workflow approach', proofStatement: 'Reduced delivery time significantly', cta: 'Learn about my process' },
        presentationStructure: ['workflow', 'tools', 'timeline'],
        isAccepted: true,
        deliverables: ['Process doc', 'Tool guide'],
        completionChecklist: ['Document steps', 'Add screenshots'],
      },
    ],
    mod3ProfileCopy: {
      professionalHeadline: `${serviceId.replace(/_/g, ' ')} Specialist for ${marketId.replace(/_/g, ' ')}`,
      shortBio: `I help ${marketId.replace(/_/g, ' ')} achieve their goals through ${serviceId.replace(/_/g, ' ')}.`,
      longBio: `With years of experience in ${serviceId.replace(/_/g, ' ')}, I specialise in serving ${marketId.replace(/_/g, ' ')} clients.`,
      offerStatement: `I offer ${serviceId.replace(/_/g, ' ')} services tailored for ${marketId.replace(/_/g, ' ')}.`,
      credibilityBullets: ['Years of experience', 'Multiple projects delivered'],
      proofReferenceLine: `See my work for ${marketId.replace(/_/g, ' ')} clients below.`,
      ctaLine: ctaLine || 'Get in touch to discuss your project.',
    },
    mod3PortfolioCopy: {
      portfolioCta: 'Ready to start your project?',
      sections: [
        { type: 'hero', heading: 'Welcome to My Portfolio', body: 'I help businesses grow through expert service delivery.' },
      ],
    },
  };
}

/* ──────────────────────────────────────────────
   HONESTY GATE — no fabricated metrics, no testimonials, etc.
   ────────────────────────────────────────────── */

const FAKE_METRIC_PATTERNS = [
  /\d+%/g, /\d+x\s*(growth|increase|improvement)/i,
  /\$\d[\d,]*(\s*[kKmM]?)/g,
  /conversion\s*rate/i, /increased\s*(sales|revenue)/i,
];

const FORBIDDEN_TERMS = [
  'testimonial', 'client said', 'client loved', 'they were thrilled',
  'free work', 'free consultation', 'free strategy',
  'results may vary', 'individual results',
];

function checkHonesty(text: string, field: string): string[] {
  const errors: string[] = [];
  for (const term of FORBIDDEN_TERMS) {
    if (text.toLowerCase().includes(term)) {
      errors.push(`${field}: contains forbidden term "${term}"`);
    }
  }
  return errors;
}

function checkMetricPatterns(text: string, field: string): string[] {
  const errors: string[] = [];
  const matches = text.match(/\d+/g);
  if (matches) {
    for (const m of matches) {
      const num = parseInt(m, 10);
      if (num > 100 && num < 1000000 && field.includes('proofStatement')) {
        errors.push(`${field}: suspicious fabricated number "${num}"`);
      }
    }
  }
  return errors;
}

/* ──────────────────────────────────────────────
   SIMILARITY CHECK — Jaccard overlap on string sets
   ────────────────────────────────────────────── */

function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a.map((s) => s.toLowerCase().trim()));
  const setB = new Set(b.map((s) => s.toLowerCase().trim()));
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

function extractStrategyTokens(pack: PortfolioBuildPack): string[] {
  const tokens: string[] = [];
  tokens.push(pack.direction.goal);
  tokens.push(pack.direction.portfolioPromise);
  tokens.push(pack.platform.destination);
  tokens.push(...pack.sections.filter((s) => s.included).map((s) => s.sectionType));
  if (pack.projectPresentations && pack.projectPresentations.length > 0) {
    tokens.push(...pack.projectPresentations[0].presentationSequence);
  }
  if (pack.projectPresentations && pack.projectPresentations.length > 0 && pack.projectPresentations[0]) {
    if (pack.projectPresentations[0].evidenceOrder) {
      tokens.push(...pack.projectPresentations[0].evidenceOrder.map((e) => e.type));
    }
  }
  tokens.push(pack.copy.ctaArchitecture.heroCta);
  tokens.push(pack.copy.ctaArchitecture.footerCta);
  return tokens.filter(Boolean);
}

/* ──────────────────────────────────────────────
   MAIN VALIDATION
   ────────────────────────────────────────────── */

interface PathResult {
  serviceId: string;
  marketId: string;
  nicheId: string | null;
  authorityPosition: string;
  pack: PortfolioBuildPack;
  errors: string[];
}

async function runValidation(): Promise<void> {
  console.log('='.repeat(80));
  console.log('CHUNK B — COMPREHENSIVE CONTENT VALIDATION');
  console.log('='.repeat(80));

  const allResults: PathResult[] = [];
  let totalPaths = 0;
  let totalErrors = 0;
  const honestyErrors: string[] = [];
  const ctaErrors: string[] = [];

  /* ── 75-PATH COVERAGE ── */
  console.log('\n## 75-PATH COVERAGE (15 services × 5 markets)');
  for (const serviceId of SERVICES) {
    for (const marketId of MARKETS) {
      for (const ap of AUTHORITY_POSITIONS) {
        const ctx = buildContext(serviceId, marketId, null, ap);
        try {
          const result = composeAll(ctx);
          allResults.push({ serviceId, marketId, nicheId: null, authorityPosition: ap, pack: result.pack, errors: [] });
          totalPaths++;
        } catch (err: any) {
          console.error(`  CRASH: ${serviceId} / ${marketId} / ${ap}: ${err.message}`);
          totalErrors++;
        }
      }
    }
  }
  console.log(`  All paths: ${allResults.length} generated, ${totalErrors} crashes`);

  /* ── NICHE COVERAGE ── */
  console.log('\n## NICHE COVERAGE');
  const nicheResults: PathResult[] = [];
  for (const { marketId, nicheId } of NICHES) {
    /* Test niche against all relevant services */
    for (const serviceId of ['short_form_editor', 'youtube_editor', 'video_editor', 'wordpress_developer', 'brand_designer'] as const) {
      const ctx = buildContext(serviceId, marketId, nicheId, 'builder');
      try {
        const result = composeAll(ctx);
        nicheResults.push({ serviceId, marketId, nicheId, authorityPosition: 'builder', pack: result.pack, errors: [] });
        allResults.push({ serviceId, marketId, nicheId, authorityPosition: 'builder', pack: result.pack, errors: [] });
      } catch (err: any) {
        console.error(`  CRASH: ${serviceId} / ${marketId} / ${nicheId}: ${err.message}`);
        totalErrors++;
      }
    }
  }
  console.log(`  Niche paths: ${nicheResults.length}`);

  /* ── SERVICE DIFFERENTIATION ── */
  console.log('\n## SERVICE DIFFERENTIATION');
  console.log('  Same market (creators), different services:');
  const diffMarket = 'creators';
  for (const serviceId of ['video_editor', 'short_form_editor', 'wordpress_developer', 'ui_ux_designer'] as const) {
    const ctx = buildContext(serviceId, diffMarket, null, 'builder');
    const full = composeAll(ctx);
    const existing = allResults.find((r) => r.serviceId === serviceId && r.marketId === diffMarket && r.nicheId === null);
    if (!existing) allResults.push({ serviceId, marketId: diffMarket, nicheId: null, authorityPosition: 'builder', pack: full.pack, errors: [] });
  }

  /* ── REPRESENTATIVE OUTPUTS ── */
  console.log('\n## REPRESENTATIVE OUTPUTS');

  const outputPaths: { label: string; serviceId: string; marketId: string; nicheId: string | null; ap: string }[] = [
    /* 15 representatives */
    { label: 'Video Editor + YouTube Creators', serviceId: 'video_editor', marketId: 'youtube_creators', nicheId: null, ap: 'practitioner' },
    { label: 'Short-Form Editor + Creators + Gaming', serviceId: 'short_form_editor', marketId: 'creators', nicheId: 'gaming', ap: 'practitioner' },
    { label: 'YouTube Editor + YouTube Creators + Educational', serviceId: 'youtube_editor', marketId: 'youtube_creators', nicheId: 'educational', ap: 'deconstructor' },
    { label: 'Podcast Clip Editor + Podcasters', serviceId: 'podcast_clip_editor', marketId: 'podcasters', nicheId: null, ap: 'builder' },
    { label: 'Ad Creative Editor + Ecommerce Brands', serviceId: 'ad_creative_editor', marketId: 'ecommerce_brands', nicheId: null, ap: 'practitioner' },
    { label: 'WordPress Developer + Local Businesses + Restaurants', serviceId: 'wordpress_developer', marketId: 'local_businesses', nicheId: 'restaurants', ap: 'builder' },
    { label: 'Landing Page Developer + SaaS Startups', serviceId: 'landing_page_developer', marketId: 'saas_startups', nicheId: null, ap: 'auditor' },
    { label: 'No-Code Developer + Startups', serviceId: 'no_code_developer', marketId: 'startups', nicheId: null, ap: 'practitioner' },
    { label: 'Frontend Developer + SaaS Startups', serviceId: 'frontend_developer', marketId: 'saas_startups', nicheId: null, ap: 'builder' },
    { label: 'Automation Developer + Marketing Agencies', serviceId: 'automation_developer', marketId: 'marketing_agencies', nicheId: null, ap: 'auditor' },
    { label: 'UI/UX Designer + SaaS Products', serviceId: 'ui_ux_designer', marketId: 'saas_startups', nicheId: null, ap: 'auditor' },
    { label: 'Landing Page Designer + Ecommerce Brands', serviceId: 'landing_page_designer', marketId: 'ecommerce_brands', nicheId: null, ap: 'practitioner' },
    { label: 'Brand Designer + Coaches + Business Coaches', serviceId: 'brand_designer', marketId: 'coaches', nicheId: 'business_coaches', ap: 'builder' },
    { label: 'Social Media Designer + Creators', serviceId: 'social_media_designer', marketId: 'creators', nicheId: null, ap: 'practitioner' },
    { label: 'Presentation Designer + Educators', serviceId: 'presentation_designer', marketId: 'educators', nicheId: null, ap: 'builder' },
  ];

  for (const path of outputPaths) {
    const ctx = buildContext(path.serviceId, path.marketId, path.nicheId, path.ap);
    const result = composeAll(ctx);
    const { direction, platform, sections, placements, presentations, copy, buildChecklist, publishChecklist, pack } = result;
    const errors: string[] = [];
    
    /* Check honesty */
    const allText = [
      direction.portfolioPromise,
      direction.ctaIntent,
      ...sections.map((s) => s.heading + ' ' + s.purpose),
      ...placements.map((p) => p.placementReason + ' ' + p.buyerQuestionAnswered),
      ...presentations.map((p) => p.projectTitle + ' ' + p.proofStatement + ' ' + p.cta + ' ' + p.limitationsNote + ' ' + p.honestContextLabel),
      copy.headline,
      copy.shortIntro,
      ...Object.values(copy.sectionCopy).map((s) => s.heading + ' ' + s.body),
      ...Object.values(copy.projectCopy).map((p) => p.headline + ' ' + p.description + ' ' + p.cta),
      copy.ctaArchitecture.heroCta + ' ' + copy.ctaArchitecture.inlineCta + ' ' + copy.ctaArchitecture.sectionCta + ' ' + copy.ctaArchitecture.footerCta,
    ].join(' ');

    for (const term of FORBIDDEN_TERMS) {
      if (allText.toLowerCase().includes(term)) {
        errors.push(`HONESTY FAIL: forbidden term "${term}"`);
        honestyErrors.push(`${path.label}: "${term}"`);
      }
    }

    /* Check CTAs are contextual */
    const validCtaIntents = ['review_approach', 'discuss_needs', 'see_more', 'discuss_partnership', 'learn_more', 'discuss_collaboration', 'see_educational_work', 'review_podcast_work', 'see_educational_examples', 'discuss_business_need', 'see_commercial_work', 'discuss_build', 'review_product_fit', 'review_build_capability', 'see_platform_work', 'review_style', 'review_hooks', 'review_retention', 'review_clip_selection', 'review_ad_creative', 'review_website', 'review_page', 'discuss_automation', 'review_ui', 'review_page_design', 'review_brand', 'review_social', 'review_deck'];
    if (!validCtaIntents.includes(direction.ctaIntent)) {
      errors.push(`CTA: unexpected ctaIntent "${direction.ctaIntent}"`);
    }

    if (!['personal_site', 'social_native_showcase', 'code_and_live_demo', 'visual_showcase', 'document_case_study', 'video_walkthrough'].includes(platform.destination)) {
      errors.push(`DESTINATION: invalid "${platform.destination}"`);
    }

    /* Check for non-fabricated CTAs */
    if (copy.ctaArchitecture.heroCta.toLowerCase().includes('free')) {
      errors.push(`CTA: contains "free" — possible free-work offer`);
    }

    /* Check no raw IDs in user-facing text */
    for (const pres of presentations) {
      if (pres.projectTitle === 'asset1' || pres.projectTitle === 'asset2') {
        errors.push(`ID LEAK: raw asset ID in project title`);
      }
    }

    if (errors.length > 0) {
      totalErrors += errors.length;
    }

    allResults.push({ serviceId: path.serviceId, marketId: path.marketId, nicheId: path.nicheId, authorityPosition: path.ap, pack: result.pack, errors });

    console.log(`\n--- ${path.label} ---`);
    console.log(`  Direction: goal=${direction.goal}, promise="${direction.portfolioPromise}"`);
    console.log(`  Platform: destination=${platform.destination}`);
    console.log(`  Sections: ${sections.filter((s) => s.included).length} included`);
    console.log(`  Placements: ${pack.projectPlacements.length} projects`);
    console.log(`  Presentations: ${pack.projectPresentations ? pack.projectPresentations.length : 0}`);
    console.log(`  CTA: hero="${copy.ctaArchitecture.heroCta}"`);
    console.log(`  CTA: footer="${copy.ctaArchitecture.footerCta}"`);
    console.log(`  Headline: "${copy.headline}"`);
    console.log(`  Errors: ${errors.length > 0 ? errors.join('; ') : 'none'}`);

    /* Print project presentation sample */
    if (presentations.length > 0) {
      const pres = presentations[0];
      console.log(`  Project presentation:`);
      console.log(`    Title: "${pres.projectTitle}"`);
      console.log(`    Sequence: ${pres.presentationSequence.join(' → ')}`);
      console.log(`    Evidence: ${pres.evidenceOrder.map((e) => e.type).join(', ')}`);
      console.log(`    Proof: "${pres.proofStatement}"`);
      console.log(`    CTA: "${pres.cta}"`);
      console.log(`    Limitation: "${pres.limitationsNote}"`);
    }

    /* Print section list */
    console.log(`  Sections:`);
    for (const sec of sections.filter((s) => s.included)) {
      console.log(`    ${sec.order}. ${sec.heading} [${sec.source}]`);
    }
  }

  /* ── MARKET DIFFERENTIATION ── */
  console.log('\n## MARKET DIFFERENTIATION');
  console.log('  Same service (video_editor), different markets:');
  for (const marketId of ['youtube_creators', 'coaches', 'ecommerce_brands'] as const) {
    const ctx = buildContext('video_editor', marketId, null, 'practitioner');
    const { direction, platform, sections } = composeAll(ctx);
    console.log(`  ${marketId}: promise="${direction.portfolioPromise}", platform=${platform.destination}, sections=${sections.filter(s => s.included).map(s => s.sectionType).join(', ')}`);
  }

  /* ── NICHE DIFFERENTIATION ── */
  console.log('\n## NICHE DIFFERENTIATION');
  console.log('  Same service (short_form_editor) + market (youtube_creators), different niches:');
  for (const nicheId of [null, 'gaming', 'educational'] as const) {
    const ctx = buildContext('short_form_editor', 'youtube_creators', nicheId, 'practitioner');
    const { direction, platform, sections, presentations, copy } = composeAll(ctx);
    const projectPromise = presentations[0]?.honestContextLabel || 'N/A';
    console.log(`  niche=${nicheId || '(none)'}: direction="${direction.portfolioPromise}", cta="${copy.ctaArchitecture.heroCta}", projectLabel="${projectPromise}"`);
  }

  /* ── CROSS-TRACK COMPARISON ── */
  console.log('\n## CROSS-TRACK COMPARISON');
  console.log('  Video track vs Design track, same market (creators):');
  const vp = composeAll(buildContext('video_editor', 'creators', 'gaming', 'practitioner'));
  const dp = composeAll(buildContext('brand_designer', 'creators', null, 'practitioner'));
  const wp = composeAll(buildContext('wordpress_developer', 'creators', null, 'practitioner'));

  console.log(`  Video: sections=${vp.sections.filter(s => s.included).map(s => s.sectionType).join(', ')}`);
  console.log(`  Design: sections=${dp.sections.filter(s => s.included).map(s => s.sectionType).join(', ')}`);
  console.log(`  Dev: sections=${wp.sections.filter(s => s.included).map(s => s.sectionType).join(', ')}`);
  console.log(`  Video destination: ${vp.platform.destination}`);
  console.log(`  Design destination: ${dp.platform.destination}`);

  /* ── DUPLICATION GATE ── */
  console.log('\n## DUPLICATION GATE');
  const allPacks = allResults.map((r) => ({ label: `${r.serviceId} / ${r.marketId} / ${r.nicheId || '(none)'}`, pack: r.pack }));
  let highDuplicationCount = 0;
  const checked = new Set<string>();

  for (let i = 0; i < allPacks.length; i++) {
    for (let j = i + 1; j < allPacks.length; j++) {
      const a = allPacks[i];
      const b = allPacks[j];

      /* Only check unrelated paths (different service + different market) */
      const pathA = a.label.split(' / ');
      const pathB = b.label.split(' / ');
      if (pathA[0] === pathB[0] || pathA[1] === pathB[1]) continue;
      if (checked.has(`${a.label}|${b.label}`)) continue;
      checked.add(`${a.label}|${b.label}`);

      const sim = jaccardSimilarity(extractStrategyTokens(a.pack), extractStrategyTokens(b.pack));
      if (sim >= 0.7) {
        highDuplicationCount++;
        if (highDuplicationCount <= 5) {
          console.log(`  ⚠ High similarity (${(sim * 100).toFixed(0)}%) between "${a.label}" and "${b.label}"`);
        }
      }
    }
  }
  console.log(`  High-similarity pairs (≥70%): ${highDuplicationCount}`);

  /* ── HONESTY GATE SUMMARY ── */
  console.log('\n## HONESTY GATE');
  console.log(`  Honesty violations: ${honestyErrors.length}`);
  for (const err of honestyErrors.slice(0, 10)) {
    console.log(`  FAIL: ${err}`);
  }

  /* ── CTA GATE ── */
  console.log('\n## CTA GATE');
  const ctaFreeOffers = allResults.filter((r) => {
    const text = r.pack.copy.ctaArchitecture.heroCta + r.pack.copy.ctaArchitecture.footerCta;
    return text.toLowerCase().includes('free');
  });
  console.log(`  CTAs with "free": ${ctaFreeOffers.length}`);
  for (const r of ctaFreeOffers) {
    console.log(`  ${r.serviceId}/${r.marketId}: "${r.pack.copy.ctaArchitecture.heroCta}"`);
  }

  /* ── FINAL SUMMARY ── */
  console.log('\n' + '='.repeat(80));
  console.log('FINAL VALIDATION RESULTS');
  console.log('='.repeat(80));
  console.log(`Service×Market×AP coverage: ${allResults.filter(r => r.nicheId === null).length} paths`);
  console.log(`Niche paths:            ${nicheResults.length}`);
  console.log(`Total paths:            ${allResults.length}`);
  console.log(`Structural errors:      ${totalErrors}`);
  console.log(`Honesty violations:     ${honestyErrors.length}`);
  console.log(`Duplicate pairs ≥70%:   ${highDuplicationCount}`);

  const allValid = totalErrors === 0 && honestyErrors.length === 0 && highDuplicationCount === 0;
  console.log(`\nOVERALL: ${allValid ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log('');
}

runValidation().catch(console.error);
