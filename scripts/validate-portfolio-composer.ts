import { composeAll, generatePortfolioDirection, generatePlatformRecommendation, generateSections, generateProjectPlacements, generateProjectPresentations, generatePortfolioCopyArchitecture, generateChecklists, compileBuildPack, buildModule5Bridge } from '../src/lib/portfolio-system/composer';
import type { UpstreamContext, PortfolioDirection, PlatformRecommendation, PortfolioSectionSpec, ProjectPlacement, ProjectPresentationSpec, PortfolioCopyArchitecture, PortfolioBuildPack, Module5BridgeContext } from '../src/types/portfolio-system';

const SERVICES = [
  'video_editor', 'short_form_editor', 'youtube_editor', 'podcast_clip_editor', 'ad_creative_editor',
  'wordpress_developer', 'landing_page_developer', 'no_code_developer', 'frontend_developer', 'automation_developer',
  'ui_ux_designer', 'landing_page_designer', 'brand_designer', 'social_media_designer', 'presentation_designer',
];

const MARKETS = [
  'youtube_creators', 'coaches', 'ecommerce_brands', 'saas_startups', 'local_businesses',
];

const AUTHORITY_POSITIONS = ['practitioner', 'builder', 'auditor', 'deconstructor', 'strategist'];

function buildContext(serviceId: string, marketId: string, nicheId: string | null, authorityPosition: string): UpstreamContext {
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
    mod3AuthorityPosition: authorityPosition,
    mod3CoreTrustPromise: 'I deliver quality work on time',
    mod3ProofPriorities: [
      { id: 'pp1', gapTitle: 'Trust gap 1', gapDescription: 'Need to prove capability', recommendedFormat: 'case_study' },
      { id: 'pp2', gapTitle: 'Trust gap 2', gapDescription: 'Need to show process', recommendedFormat: 'process_doc' },
    ],
    mod3ProofAssets: [
      {
        id: 'asset1', priorityId: 'pp1', title: 'Project Alpha', assetType: 'case_study',
        credibilityGapProved: 'demonstrated ability to deliver quality work',
        portfolioCopy: { headline: 'Project Alpha: A Case Study', description: 'How we solved the problem', proofStatement: 'Delivered 40% improvement', cta: 'See the full case study' },
        presentationStructure: ['problem', 'approach', 'solution', 'results'],
        isAccepted: true,
      },
      {
        id: 'asset2', priorityId: 'pp2', title: 'Project Beta', assetType: 'process_doc',
        credibilityGapProved: 'process efficiency and reliability',
        portfolioCopy: { headline: 'Project Beta: Process Overview', description: 'Streamlined workflow approach', proofStatement: 'Reduced delivery time by 30%', cta: 'Learn about my process' },
        presentationStructure: ['workflow', 'tools', 'timeline'],
        isAccepted: true,
      },
    ],
    mod3ProfileCopy: {
      professionalHeadline: `${serviceId.replace(/_/g, ' ')} Specialist for ${marketId.replace(/_/g, ' ')}`,
      shortBio: `I help ${marketId.replace(/_/g, ' ')} achieve their goals through ${serviceId.replace(/_/g, ' ')}.`,
      longBio: `With years of experience in ${serviceId.replace(/_/g, ' ')}, I specialise in serving ${marketId.replace(/_/g, ' ')} clients.`,
      offerStatement: `I offer ${serviceId.replace(/_/g, ' ')} services tailored for ${marketId.replace(/_/g, ' ')}.`,
      credibilityBullets: ['5+ years experience', '50+ projects delivered'],
      proofReferenceLine: `See my work for ${marketId.replace(/_/g, ' ')} clients below.`,
      ctaLine: 'Book a free consultation to discuss your project.',
    },
    mod3PortfolioCopy: {
      portfolioCta: 'Ready to start your project?',
      sections: [
        { type: 'hero', heading: 'Welcome to My Portfolio', body: 'I help businesses grow through expert service delivery.' },
      ],
    },
  };
}

type ValidationResult = {
  serviceId: string;
  marketId: string;
  nicheId: string | null;
  authorityPosition: string;
  direction: { valid: boolean; errors: string[] };
  platform: { valid: boolean; errors: string[] };
  sections: { valid: boolean; errors: string[] };
  placements: { valid: boolean; errors: string[] };
  presentations: { valid: boolean; errors: string[] };
  copy: { valid: boolean; errors: string[] };
  checklists: { valid: boolean; errors: string[] };
  pack: { valid: boolean; errors: string[] };
  bridge: { valid: boolean; errors: string[] };
  allValid: boolean;
};

function validateString(value: unknown, field: string, allowEmpty: boolean = false): string[] {
  const errors: string[] = [];
  if (typeof value !== 'string') {
    errors.push(`${field}: expected string, got ${typeof value}`);
  } else if (!allowEmpty && value.trim() === '') {
    errors.push(`${field}: empty string`);
  }
  return errors;
}

function validatePortfolioDirection(d: PortfolioDirection, ctx: UpstreamContext): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validGoals = ['start_conversation', 'review_offer', 'evaluate_capability', 'request_project'];
  if (!validGoals.includes(d.goal)) errors.push(`goal: invalid value "${d.goal}"`);
  errors.push(...validateString(d.targetBuyer, 'targetBuyer'));
  errors.push(...validateString(d.portfolioPromise, 'portfolioPromise'));
  if (typeof d.isCustom !== 'boolean') errors.push('isCustom: expected boolean');
  return { valid: errors.length === 0, errors };
}

function validatePlatformRecommendation(p: PlatformRecommendation): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validDests = ['personal_site', 'social_native_showcase', 'code_and_live_demo', 'visual_showcase', 'document_case_study', 'video_walkthrough'];
  if (!validDests.includes(p.destination)) errors.push(`destination: invalid "${p.destination}"`);
  errors.push(...validateString(p.primaryRecommendation, 'primaryRecommendation'));
  if (!Array.isArray(p.supportingDestinations)) errors.push('supportingDestinations: expected array');
  if (typeof p.userConfirmed !== 'boolean') errors.push('userConfirmed: expected boolean');
  if (typeof p.isUserOverride !== 'boolean') errors.push('isUserOverride: expected boolean');
  return { valid: errors.length === 0, errors };
}

function validateSections(sections: PortfolioSectionSpec[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (sections.length === 0) errors.push('no sections generated');
  const ids = new Set<string>();
  for (const s of sections) {
    if (ids.has(s.id)) errors.push(`duplicate section id: ${s.id}`);
    ids.add(s.id);
    errors.push(...validateString(s.id, `section[${s.id}].id`));
    errors.push(...validateString(s.heading, `section[${s.id}].heading`));
    errors.push(...validateString(s.purpose, `section[${s.id}].purpose`));
    if (typeof s.included !== 'boolean') errors.push(`section[${s.id}].included: expected boolean`);
    if (typeof s.order !== 'number') errors.push(`section[${s.id}].order: expected number`);
    if (typeof s.isCustom !== 'boolean') errors.push(`section[${s.id}].isCustom: expected boolean`);
  }
  return { valid: errors.length === 0, errors };
}

function validatePlacements(placements: ProjectPlacement[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validRoles = ['featured', 'secondary', 'supporting'];
  for (const p of placements) {
    if (!validRoles.includes(p.role)) errors.push(`placement[${p.assetId}].role: invalid "${p.role}"`);
    errors.push(...validateString(p.assetId, `placement.assetId`));
    errors.push(...validateString(p.sectionId, `placement[${p.assetId}].sectionId`));
    errors.push(...validateString(p.placementReason, `placement[${p.assetId}].placementReason`));
    if (typeof p.isCustom !== 'boolean') errors.push(`placement[${p.assetId}].isCustom: expected boolean`);
  }
  return { valid: errors.length === 0, errors };
}

function validatePresentations(presentations: ProjectPresentationSpec[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const p of presentations) {
    errors.push(...validateString(p.assetId, `presentation.assetId`));
    errors.push(...validateString(p.projectTitle, `presentation[${p.assetId}].projectTitle`));
    errors.push(...validateString(p.proofStatement, `presentation[${p.assetId}].proofStatement`));
    errors.push(...validateString(p.cta, `presentation[${p.assetId}].cta`));
    if (!Array.isArray(p.presentationSequence) || p.presentationSequence.length === 0)
      errors.push(`presentation[${p.assetId}].presentationSequence: empty`);
    if (typeof p.isCustom !== 'boolean') errors.push(`presentation[${p.assetId}].isCustom: expected boolean`);
  }
  return { valid: errors.length === 0, errors };
}

function validateCopy(copy: PortfolioCopyArchitecture): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  errors.push(...validateString(copy.headline, 'headline'));
  errors.push(...validateString(copy.shortIntro, 'shortIntro'));
  if (!copy.sectionCopy || typeof copy.sectionCopy !== 'object') errors.push('sectionCopy: missing');
  if (typeof copy.isCustom !== 'boolean') errors.push('isCustom: expected boolean');
  if (copy.ctaArchitecture) {
    errors.push(...validateString(copy.ctaArchitecture.heroCta, 'ctaArchitecture.heroCta'));
    errors.push(...validateString(copy.ctaArchitecture.footerCta, 'ctaArchitecture.footerCta'));
  } else {
    errors.push('ctaArchitecture: missing');
  }
  return { valid: errors.length === 0, errors };
}

function validateChecklists(buildCk: any[], publishCk: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (buildCk.length === 0) errors.push('buildChecklist: empty');
  if (publishCk.length === 0) errors.push('publishChecklist: empty');
  for (const item of buildCk) {
    if (!item.id || !item.label) errors.push(`buildChecklist item missing id/label`);
  }
  for (const item of publishCk) {
    if (!item.id || !item.label) errors.push(`publishChecklist item missing id/label`);
  }
  return { valid: errors.length === 0, errors };
}

function validatePack(pack: PortfolioBuildPack): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!pack.direction) errors.push('pack.direction: missing');
  if (!pack.platform) errors.push('pack.platform: missing');
  if (!pack.sections || pack.sections.length === 0) errors.push('pack.sections: empty');
  if (!pack.copy) errors.push('pack.copy: missing');
  if (typeof pack.generatedAt !== 'string' || !pack.generatedAt) errors.push('generatedAt: missing');
  return { valid: errors.length === 0, errors };
}

function validateBridge(bridge: Module5BridgeContext): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (typeof bridge.portfolioReady !== 'boolean') errors.push('portfolioReady: expected boolean');
  return { valid: errors.length === 0, errors };
}

async function validateAllPaths(): Promise<void> {
  const results: ValidationResult[] = [];
  let totalErrors = 0;
  let totalPaths = 0;

  for (const serviceId of SERVICES) {
    for (const marketId of MARKETS) {
      for (const ap of AUTHORITY_POSITIONS) {
        totalPaths++;
        const ctx = buildContext(serviceId, marketId, null, ap);

        const result: ValidationResult = {
          serviceId, marketId, nicheId: null, authorityPosition: ap,
          direction: { valid: true, errors: [] },
          platform: { valid: true, errors: [] },
          sections: { valid: true, errors: [] },
          placements: { valid: true, errors: [] },
          presentations: { valid: true, errors: [] },
          copy: { valid: true, errors: [] },
          checklists: { valid: true, errors: [] },
          pack: { valid: true, errors: [] },
          bridge: { valid: true, errors: [] },
          allValid: false,
        };

        try {
          const { direction, platform, sections, placements, presentations, copy, buildChecklist, publishChecklist, pack } = composeAll(ctx);

          result.direction = validatePortfolioDirection(direction, ctx);
          result.platform = validatePlatformRecommendation(platform);
          result.sections = validateSections(sections);
          result.placements = validatePlacements(placements);
          result.presentations = validatePresentations(presentations);
          result.copy = validateCopy(copy);
          result.checklists = validateChecklists(buildChecklist, publishChecklist);
          result.pack = validatePack(pack);
          result.bridge = validateBridge(buildModule5Bridge(pack));

          result.allValid = result.direction.valid && result.platform.valid && result.sections.valid
            && result.placements.valid && result.presentations.valid && result.copy.valid
            && result.checklists.valid && result.pack.valid && result.bridge.valid;

          if (!result.allValid) {
            totalErrors++;
          }
        } catch (err: any) {
          result.allValid = false;
          result.direction.errors.push(`CRASH: ${err.message || err}`);
          totalErrors++;
        }

        results.push(result);
      }
    }
  }

  // Report
  const validCount = results.filter((r) => r.allValid).length;
  console.log(`\nPORTFOLIO COMPOSER VALIDATION REPORT`);
  console.log(`======================================`);
  console.log(`Total paths:  ${totalPaths} (${SERVICES.length} services × ${MARKETS.length} markets × ${AUTHORITY_POSITIONS.length} authority positions)`);
  console.log(`Valid:        ${validCount}`);
  console.log(`With errors:  ${totalErrors}`);
  console.log(`Pass rate:    ${(validCount / totalPaths * 100).toFixed(1)}%`);
  console.log('');

  if (totalErrors > 0) {
    console.log('ERROR DETAILS:');
    console.log('--------------');
    for (const r of results) {
      if (r.allValid) continue;
      console.log(`\n[FAIL] ${r.serviceId} / ${r.marketId} / ${r.authorityPosition}`);
      for (const layer of ['direction', 'platform', 'sections', 'placements', 'presentations', 'copy', 'checklists', 'pack', 'bridge'] as const) {
        const layerResult = r[layer];
        if (!layerResult.valid && layerResult.errors.length > 0) {
          for (const err of layerResult.errors) {
            console.log(`  ${layer}: ${err}`);
          }
        }
      }
    }
  }

  // Summary per service
  console.log('\nPER-SERVICE SUMMARY:');
  console.log('--------------------');
  for (const serviceId of SERVICES) {
    const serviceResults = results.filter((r) => r.serviceId === serviceId);
    const svcValid = serviceResults.filter((r) => r.allValid).length;
    console.log(`${serviceId.padEnd(25)} ${svcValid}/${serviceResults.length} valid`);
  }

  console.log('\nPER-MARKET SUMMARY:');
  console.log('--------------------');
  for (const marketId of MARKETS) {
    const marketResults = results.filter((r) => r.marketId === marketId);
    const mktValid = marketResults.filter((r) => r.allValid).length;
    console.log(`${marketId.padEnd(25)} ${mktValid}/${marketResults.length} valid`);
  }
}

validateAllPaths().catch(console.error);
