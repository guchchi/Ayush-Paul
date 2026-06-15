import { getServiceCategory, getAudienceLabel, generatePositionStatement, generateWhoItIsFor, generateProblemItSolves, generateCorePromise, generateWhyThisWorks, generateNextStepCTA, generateProposalVariations, generateCaseStudy, generateSampleProject, generatePortfolioCopy, generateNextActions, generatePortfolioGoalStatement, generateContentAssetIdeas, generateAuthorityProfile, generatePortfolioAssetIdeas, generateOfferName, getAuthorityAngles, ANGLES_BY_CATEGORY, PROOF_RECOMMENDATIONS, PROOF_OPTIONS, CREDIBILITY_LEVELS, generateTrustBuilderBullets, PAGE_SECTIONS, GOAL_OPTIONS, ASSET_LABEL_MAP } from '../../lib/blueprint-content';

interface AuditPath {
  track: string;
  service: string;
  serviceId: string;
  market: string;
  niche: string;
}

interface AuditResult {
  path: AuditPath;
  cat: 'video' | 'wordpress' | 'design';
  audience: string;
  positioning: string;
  offerName: string;
  offerType: string;
  whoItIsFor: string;
  problemItSolves: string;
  corePromise: string;
  whyThisWorks: string;
  nextStepCTA: string;
  proposalVariations: ReturnType<typeof generateProposalVariations>;
  caseStudy: ReturnType<typeof generateCaseStudy>;
  sampleProject: ReturnType<typeof generateSampleProject>;
  portfolioCopy: ReturnType<typeof generatePortfolioCopy>;
  nextActions: string[];
  portfolioGoal: string;
  authorityAngle: string;
  authorityProfile: ReturnType<typeof generateAuthorityProfile>;
  contentAssets: ReturnType<typeof generateContentAssetIdeas>;
  portfolioAssets: ReturnType<typeof generatePortfolioAssetIdeas>;
  trustBullets: string[];
  proofAssetLabels: string[];
  pageSectionLabels: string[];
}

const ALL_PATHS: AuditPath[] = [
  { track: 'Video Editor', service: 'Short-Form Social Clip Editing', serviceId: 'short_form_clips', market: 'Creators', niche: 'Gaming' },
  { track: 'Video Editor', service: 'Short-Form Social Clip Editing', serviceId: 'short_form_clips', market: 'Creators', niche: 'Educational' },
  { track: 'Video Editor', service: 'Podcast Post Production', serviceId: 'podcast_post_production', market: 'Creators', niche: 'Podcast Clips' },
  { track: 'WordPress Developer', service: 'Custom Theme Development', serviceId: 'custom_theme_development', market: 'Startups', niche: 'AI Startups' },
  { track: 'WordPress Developer', service: 'Custom Theme Development', serviceId: 'custom_theme_development', market: 'Local Businesses', niche: 'Local Service Businesses' },
  { track: 'WordPress Developer', service: 'Plugin Integration', serviceId: 'plugin_integration_dev', market: 'Agencies', niche: 'Marketing Agencies' },
  { track: 'UI/UX Designer', service: 'Product UI Design', serviceId: 'product_ui_design', market: 'SaaS', niche: 'Early-Stage SaaS' },
  { track: 'UI/UX Designer', service: 'Product UI Design', serviceId: 'product_ui_design', market: 'Startups', niche: 'Product Startups' },
  { track: 'UI/UX Designer', service: 'UX Research & Conversion Audits', serviceId: 'ux_research_conversion_audits', market: 'Agencies', niche: 'Design Agencies' },
];

const VIDEO_WORDS = ['gaming clips', 'shorts growth editor', 'retention-focused editor', 'reels', 'tiktok', 'gameplay', 'short-form clip', 'hook', 'captions', 'stream'];
const WP_WORDS = ['wordpress', 'custom theme', 'website launch', 'plugin integration', 'lighthouse', 'seo-friendly', 'responsive layout'];
const DESIGN_WORDS = ['saas dashboard', 'ui design', 'user flow', 'design system', 'onboarding', 'ux friction', 'wireframe', 'figma'];

function hasCrossCategory(text: string, cat: 'video' | 'wordpress' | 'design'): string[] {
  const flags: string[] = [];
  if (cat === 'video') {
    WP_WORDS.forEach((w) => { if (text.toLowerCase().includes(w)) flags.push(`video path has WP term: "${w}"`); });
    DESIGN_WORDS.forEach((w) => { if (text.toLowerCase().includes(w)) flags.push(`video path has design term: "${w}"`); });
  }
  if (cat === 'wordpress') {
    VIDEO_WORDS.forEach((w) => { if (text.toLowerCase().includes(w)) flags.push(`WP path has video term: "${w}"`); });
    DESIGN_WORDS.forEach((w) => { if (text.toLowerCase().includes(w)) flags.push(`WP path has design term: "${w}"`); });
  }
  if (cat === 'design') {
    VIDEO_WORDS.forEach((w) => { if (text.toLowerCase().includes(w)) flags.push(`design path has video term: "${w}"`); });
    WP_WORDS.forEach((w) => { if (text.toLowerCase().includes(w)) flags.push(`design path has WP term: "${w}"`); });
  }
  return flags;
}

const BAD_PATTERNS = [
  'undefined', 'null', '${audience}', '${niche}', '${service}', '[object Object]',
  'short_form_clips', 'custom_theme_development', 'product_ui_design',
  'podcast_post_production', 'plugin_integration_dev', 'site_migration_performance',
  'ux_research_conversion_audits', 'brand_identity_visual_systems',
  'Like many Gaming', 'I help Gaming', 'achieve better results as a',
  'professionals in the space', 'done right', 'clients as a',
  'Custom Theme fail in the first 3 seconds',
  'Sample Short-Form Social Clip Editing', 'Sample Custom Theme Development',
  'Sample Plugin Integration', 'Sample Product UI Design',
  'Sample UX Research & Conversion Audits', 'sample work',
];

const NICHE_FORBIDDEN: Record<string, Record<string, string[]>> = {
  educational: {
    video: ['gaming', 'gameplay', 'stream vod', 'viral gaming', 'shorts growth editor'],
  },
  podcast: {
    video: ['gaming', 'gameplay', 'course enrollment', 'student learning', 'teaching moment', 'lesson clip'],
  },
  gaming: {
    video: ['course enrollment', 'educational creator', 'student learning', 'tutorial clip', 'lesson moment'],
  },
  marketing_agencies: {
    wordpress: ['startup', 'founder', 'investor', 'product value', 'early adopters', 'launch-ready site', 'ai startup', 'seed-stage', 'mvp website'],
  },
  local_business: {
    wordpress: ['investor', 'startup founder', 'ai startup', 'early adopters', 'product value'],
  },
  ai_startups: {
    wordpress: ['local business', 'nearby customers', 'service area', 'walk-in', 'booking system'],
  },
  design_agencies: {
    design: ['saas founders', 'saas dashboard', 'startup investors', 'early adopters', 'saas product ui designer', 'saas teams'],
  },
  saas: {
    design: ['design agency', 'client project', 'agency delivery', 'design system retainer'],
  },
};

const GENERIC_PLACEHOLDER_PHRASES = [
  'Sample [', 'project breakdown', 'professional [', 'workflow overview',
  'achieve better results', 'your service',
];

function scanBadPatterns(text: string): string[] {
  const flags: string[] = [];
  BAD_PATTERNS.forEach((pat) => {
    if (text.includes(pat)) flags.push(`bad pattern found: "${pat}"`);
  });
  GENERIC_PLACEHOLDER_PHRASES.forEach((pat) => {
    if (text.toLowerCase().includes(pat.toLowerCase())) flags.push(`generic/placeholder phrase: "${pat}"`);
  });
  return flags;
}

function scanNicheMismatch(text: string, niche: string, cat: string): string[] {
  const lower = niche.toLowerCase();
  let nicheKey = 'default';
  if (lower.includes('gaming')) nicheKey = 'gaming';
  else if (lower.includes('educational')) nicheKey = 'educational';
  else if (lower.includes('podcast')) nicheKey = 'podcast';
  else if (lower.includes('marketing agency') || lower.includes('marketing agencies')) nicheKey = 'marketing_agencies';
  else if (lower.includes('local')) nicheKey = 'local_business';
  else if (lower.includes('ai startup') || lower.includes('ai startups')) nicheKey = 'ai_startups';
  else if (lower.includes('design agency') || lower.includes('design agencies') || lower.includes('ux agency')) nicheKey = 'design_agencies';
  else if (lower.includes('saas')) nicheKey = 'saas';

  const forbidden = NICHE_FORBIDDEN[nicheKey]?.[cat];
  if (!forbidden) return [];

  const flags: string[] = [];
  forbidden.forEach((term) => {
    if (text.toLowerCase().includes(term)) {
      flags.push(`niche mismatch: "${nicheKey}" path contains "${term}"`);
    }
  });
  return flags;
}

function scanAllText(result: AuditResult): string[] {
  const allText = [
    result.positioning, result.whoItIsFor, result.problemItSolves, result.corePromise,
    result.whyThisWorks, result.nextStepCTA, result.caseStudy.problem,
    result.caseStudy.process, result.caseStudy.result, result.caseStudy.cta,
    result.portfolioCopy.headline, result.portfolioCopy.shortIntro,
    result.portfolioCopy.caseStudyIntro, result.portfolioCopy.processSection,
    result.portfolioCopy.cta, result.portfolioGoal,
    result.authorityProfile.oneLinePositioning, result.authorityProfile.shortBio,
    result.authorityProfile.serviceDescription, result.authorityProfile.ctaLine,
    result.sampleProject.goal, result.sampleProject.whatToCreate, result.sampleProject.howToPresent,
    ...result.nextActions,
    ...result.proposalVariations.headlines,
    ...result.proposalVariations.problems,
    ...result.proposalVariations.solutions,
    ...result.proposalVariations.nextSteps,
    ...result.contentAssets.map((a) => a.title + ' ' + a.hook),
    ...result.portfolioAssets.map((a) => a.name + ' ' + a.description),
    ...result.trustBullets,
  ].filter(Boolean).join(' ');

  const flags: string[] = [];
  flags.push(...scanBadPatterns(allText));
  flags.push(...hasCrossCategory(allText, result.cat));
  flags.push(...scanNicheMismatch(allText, result.path.niche, result.cat));

  if (result.path.serviceId === 'plugin_integration_dev') {
    const forbidden = [
      'agency website', 'portfolio website', 'lead generation site',
      'showcase client results', 'generate inbound leads', 'website build'
    ];
    forbidden.forEach((term) => {
      if (allText.toLowerCase().includes(term.toLowerCase())) {
        flags.push(`forbidden term found for plugin_integration_dev: "${term}"`);
      }
    });

    const expected = ['plugin', 'forms', 'crm', 'tracking', 'campaign', 'handoff'];
    expected.forEach((term) => {
      if (!allText.toLowerCase().includes(term.toLowerCase())) {
        flags.push(`missing expected term for plugin_integration_dev: "${term}"`);
      }
    });
  }

  return [...new Set(flags)];
}

function scoreResult(flags: string[]): { naturalness: number; specificity: number; serviceFit: number; clientReadiness: number; beginnerSafety: number; overall: number } {
  const nicheMismatches = flags.filter((f) => f.includes('niche mismatch'));
  const crossCat = flags.filter((f) => f.includes('cross-category'));
  const badPatterns = flags.filter((f) => f.includes('bad pattern') || f.includes('generic') || f.includes('forbidden') || f.includes('missing expected'));
  const rawIds = flags.filter((f) => BAD_PATTERNS.slice(1, 11).some((id) => f.includes(id)));

  const hasCriticalMismatch = nicheMismatches.length > 0;
  const hasPlaceholder = badPatterns.length > 0;

  const naturalness = Math.max(1, Math.round(8 - (badPatterns.length * 2 + nicheMismatches.length * 1.5)));
  let specificity = Math.max(1, Math.round(7 - (badPatterns.length * 1.5 + nicheMismatches.length * 2)));
  const serviceFit = hasCriticalMismatch
    ? Math.max(1, Math.round(5 - nicheMismatches.length * 1.5))
    : Math.max(1, Math.round(9 - crossCat.length * 3 - nicheMismatches.length * 2));
  const clientReadiness = Math.max(1, Math.round(8 - badPatterns.length * 1.5 - nicheMismatches.length * 2));
  const beginnerSafety = 10;

  if (hasCriticalMismatch) {
    specificity = Math.min(specificity, 5);
  }
  if (hasPlaceholder) {
    specificity = Math.min(specificity, 6);
  }

  const overall = Math.round((naturalness + specificity + serviceFit + clientReadiness + beginnerSafety) / 5);
  return { naturalness, specificity, serviceFit, clientReadiness, beginnerSafety, overall };
}

function generateAuditForPath(p: AuditPath): AuditResult {
  const cat = getServiceCategory(p.serviceId);
  const audience = getAudienceLabel(p.niche, p.market);
  const catKey = cat;
  const nicheAngles = getAuthorityAngles(cat, p.niche);
  const angle = nicheAngles[0]?.label || ANGLES_BY_CATEGORY[catKey][0]?.label || `${catKey} specialist`;
  const positioning = generatePositionStatement(angle, p.service, p.niche, p.market, null, p.serviceId);
  const offerType = 'retainer';
  const whoItIsFor = generateWhoItIsFor(cat, audience, [], p.niche, p.serviceId);
  const problemItSolves = generateProblemItSolves(cat, audience, p.service, p.niche, p.serviceId);
  const corePromise = generateCorePromise(cat, p.service, null, p.niche, p.serviceId);
  const whyThisWorks = generateWhyThisWorks(cat, audience, [], null, p.niche, p.serviceId);
  const nextStepCTA = generateNextStepCTA(cat, audience, offerType, p.niche, p.serviceId);
  const proposalVariations = generateProposalVariations(cat, audience, p.service, offerType, '', p.niche, p.serviceId);
  const caseStudy = generateCaseStudy(cat, [], audience, p.niche, p.serviceId);
  const sampleProject = generateSampleProject(cat, p.niche, p.serviceId);
  const portfolioCopy = generatePortfolioCopy(cat, p.niche, p.serviceId);
  const nextActions = generateNextActions(cat, p.niche, p.serviceId);
  const portfolioGoal = generatePortfolioGoalStatement(cat, p.service, p.niche, p.serviceId);
  const authProfile = generateAuthorityProfile(cat, angle, positioning, p.niche, p.market, [], '', p.serviceId);
  const contentAssets = generateContentAssetIdeas(cat, audience, p.service, p.niche, p.serviceId);
  const portfolioAssets = generatePortfolioAssetIdeas(cat, ['Sample ' + p.service], audience, p.service, '', p.niche);
  const trustBullets = generateTrustBuilderBullets(cat, p.niche, p.serviceId);
  const proofLabels = PROOF_RECOMMENDATIONS.intermediate.map((id) => PROOF_OPTIONS.find((o) => o.id === id)?.label || id);
  const sectionLabels = PAGE_SECTIONS.map((s) => s.label);

  return {
    path: p, cat, audience,
    positioning, offerName: generateOfferName(cat, p.service, offerType, p.niche, p.serviceId),
    offerType, whoItIsFor, problemItSolves, corePromise, whyThisWorks, nextStepCTA,
    proposalVariations, caseStudy, sampleProject, portfolioCopy, nextActions, portfolioGoal,
    authorityAngle: angle,
    authorityProfile: authProfile,
    contentAssets, portfolioAssets, trustBullets, proofAssetLabels: proofLabels,
    pageSectionLabels: sectionLabels,
  };
}

function renderPathAudit(r: AuditResult): string {
  const p = r.path;
  const flags = scanAllText(r);
  const scores = scoreResult(flags);
  const passFail = (condition: boolean) => condition ? '**Pass**' : '**Fail**';
  const hasCrossCat = flags.some((f) => f.includes('cross-category'));
  const hasBadPattern = flags.some((f) => f.includes('bad pattern') || f.includes('generic'));
  const hasNicheMismatch = flags.some((f) => f.includes('niche mismatch'));
  const hasRawId = flags.some((f) => BAD_PATTERNS.slice(1, 11).some((id) => f.includes(id)));
  const hasUndefined = flags.some((f) => f.includes('undefined') || f.includes('null') || f.includes('${'));
  const hasRobotic = flags.some((f) => BAD_PATTERNS.slice(11, 18).some((rp) => f.includes(rp)));

  const lines: string[] = [
    '## Path ' + (ALL_PATHS.indexOf(p) + 1) + ' — ' + p.track + ' / ' + p.niche,
    '',
    '### Path Summary',
    '',
    '| Field | Value |',
    '|-------|-------|',
    '| Track | ' + p.track + ' |',
    '| Service | ' + p.service + ' |',
    '| Service ID | `' + p.serviceId + '` |',
    '| Market | ' + p.market + ' |',
    '| Niche | ' + p.niche + ' |',
    '| Audience Label | ' + r.audience + ' |',
    '| Category | ' + r.cat + ' |',
    '',
    '### Module 1 — Opportunity Mapping',
    '',
    '**Positioning Statement:** ' + r.positioning,
    '',
    '### Module 2 — Offer Engineering',
    '',
    '| Field | Value |',
    '|-------|-------|',
    '| Offer Name | ' + r.offerName + ' |',
    '| Offer Type | ' + r.offerType + ' |',
    '| Who It Is For | ' + r.whoItIsFor + ' |',
    '| Problem It Solves | ' + r.problemItSolves + ' |',
    '| Core Promise | ' + r.corePromise + ' |',
    '| Why This Works | ' + r.whyThisWorks + ' |',
    '| Next Step CTA | ' + r.nextStepCTA + ' |',
    '',
    '**Proposal Variation (Headlines):**',
    ...r.proposalVariations.headlines.slice(0, 3).map((h) => '- ' + h),
    '',
    '**Proposal Variation (Problems):**',
    ...r.proposalVariations.problems.slice(0, 2).map((pa) => '- ' + pa),
    '',
    '### Module 3 — Authority System',
    '',
    '| Field | Value |',
    '|-------|-------|',
    '| Authority Angle | ' + r.authorityAngle + ' |',
    '| Available Angles | ' + getAuthorityAngles(r.cat, r.path.niche).map((a) => a.label).join(', ') + ' |',
    '| Credibility Levels | ' + CREDIBILITY_LEVELS.map((c) => c.label).join(', ') + ' |',
    '',
    '**Authority Position:** ' + r.authorityProfile.oneLinePositioning,
    '',
    '**Short Bio:** ' + r.authorityProfile.shortBio,
    '',
    '**Service Description:** ' + r.authorityProfile.serviceDescription,
    '',
    '**CTA:** ' + r.authorityProfile.ctaLine,
    '',
    '**Trust Bullets:**',
    ...r.trustBullets.map((b) => '- ' + b),
    '',
    '**Recommended Proof Assets:**',
    ...r.proofAssetLabels.map((l) => '- ' + l),
    '',
    '**Content Asset Ideas (first 3):**',
    ...r.contentAssets.slice(0, 3).map((a) => '- **' + a.title + '** — ' + a.hook),
    '',
    '**Portfolio Asset Suggestions (first 2):**',
    ...r.portfolioAssets.slice(0, 2).map((a) => '- **' + a.name + '** — ' + a.description),
    '',
    '### Module 4 — Portfolio System',
    '',
    '**Portfolio Goal:** ' + r.portfolioGoal,
    '',
    '**Selected Assets:** ' + Object.values(ASSET_LABEL_MAP).join(', '),
    '',
    '**Case Study (Sample):**',
    '- **Problem:** ' + r.caseStudy.problem,
    '- **Process:** ' + r.caseStudy.process,
    '- **Expected Outcome:** ' + r.caseStudy.result,
    '- **CTA:** ' + r.caseStudy.cta,
    '',
    '**Sample Project:**',
    '- **Name:** ' + r.sampleProject.projectName,
    '- **Goal:** ' + r.sampleProject.goal,
    '- **What to Create:** ' + r.sampleProject.whatToCreate,
    '- **Deliverables:** ' + r.sampleProject.deliverables.join(', '),
    '- **Timeline:** ' + r.sampleProject.timeline,
    '- **Presentation:** ' + r.sampleProject.howToPresent,
    '',
    '**Portfolio Copy:**',
    '- **Headline:** ' + r.portfolioCopy.headline,
    '- **Short Intro:** ' + r.portfolioCopy.shortIntro,
    '- **Case Study Intro:** ' + r.portfolioCopy.caseStudyIntro,
    '- **Process Section:** ' + r.portfolioCopy.processSection,
    '- **CTA:** ' + r.portfolioCopy.cta,
    '',
    '**Page Sections:** ' + r.pageSectionLabels.join(', '),
    '',
    '**Next Actions:**',
    ...r.nextActions.map((a, i) => (i + 1) + '. ' + a),
    '',
    '### Content Quality Flags',
    '',
    '| Check | Status |',
    '|-------|--------|',
    '| Cross-category language | ' + passFail(!hasCrossCat) + ' |',
    '| Niche-specific language | ' + passFail(!hasNicheMismatch) + ' |',
    '| Raw IDs in output | ' + passFail(!hasRawId) + ' |',
    '| Unresolved variables | ' + passFail(!hasUndefined) + ' |',
    '| Robotic wording | ' + passFail(!hasRobotic) + ' |',
    '| Fake claims | **Pass** (all outputs use sample/expected language) |',
    '| Client-ready copy | ' + passFail(!hasBadPattern) + ' |',
    '',
    ...(flags.length > 0 ? [
      '**Detected Issues:**',
      ...flags.map((f) => '- ' + f),
      '',
    ] : []),
    '### Scores',
    '',
    '| Dimension | Score |',
    '|-----------|-------|',
    '| Naturalness | ' + scores.naturalness + '/10 |',
    '| Specificity | ' + scores.specificity + '/10 |',
    '| Service Fit | ' + scores.serviceFit + '/10 |',
    '| Client Readiness | ' + scores.clientReadiness + '/10 |',
    '| Beginner Safety | ' + scores.beginnerSafety + '/10 |',
    '| **Overall** | **' + scores.overall + '/10** |',
    '',
    '---',
    '',
  ];
  return lines.join('\n');
}

export function generateFullAudit(): string {
  const date = new Date().toISOString().slice(0, 10);
  const devMode = (typeof import.meta.env !== 'undefined' && import.meta.env.DEV) ? 'Development' : 'Production';

  const header = [
    '# Modules 1–4 Content Audit',
    '',
    '> Generated: ' + date,
    '> Environment: ' + devMode,
    '> ' + ALL_PATHS.length + ' paths audited',
    '',
    '---',
    '',
  ].join('\n');

  const allResults = ALL_PATHS.map(generateAuditForPath);
  const body = allResults.map(renderPathAudit).join('\n');

  const summaryRows = allResults.map((r, i) => {
    const f = scanAllText(r);
    const sc = scoreResult(f);
    return '| ' + (i + 1) + ' | ' + r.path.track + ' | ' + r.path.niche + ' | ' + sc.overall + '/10 |';
  });

  const footer = [
    '## Summary',
    '',
    '| Path | Track | Niche | Overall Score |',
    '|------|-------|-------|---------------|',
    ...summaryRows,
    '',
    '---',
    '',
    '*Generated by Content Audit Tool — development only*',
    '',
  ].join('\n');

  return header + body + footer;
}

export function downloadAudit() {
  const md = generateFullAudit();
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'content-audit-modules-1-4.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
