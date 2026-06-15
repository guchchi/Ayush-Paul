import {
  getServiceCategory,
  getAudienceLabel,
  generatePositionStatement,
  generateOfferName,
  generateWhoItIsFor,
  generateProblemItSolves,
  generateCorePromise,
  generateWhyThisWorks,
  generateNextStepCTA,
  generateCaseStudy,
  generateSampleProject,
  generatePortfolioCopy,
  generateNextActions,
  generatePortfolioGoalStatement,
  generateClientSourceMap,
  generateIdealClientCriteria,
  generateProspectTypes,
  generateSearchQueries,
  generateLeadScorecard,
  generatePipelineSampleProspects,
  generatePriorityPlan,
  generatePipelineNextActions,
  generateTrustBuilderBullets,
  getAuthorityAngles,
  ANGLES_BY_CATEGORY,
  CREDIBILITY_LEVELS,
} from '../../lib/blueprint-content';
import { resolveBlueprintContext } from '../../lib/blueprint-content/blueprint-context';

interface AuditPathDef {
  label: string;
  track: string;
  selectedSkills: string[];
  serviceId: string;
  serviceLabel: string;
  market: string;
  niche: string;
  offerName: string;
  offerType: string;
}

interface ModuleOutput {
  positioning: string;
  offerName: string;
  whoItIsFor: string;
  problem: string;
  corePromise: string;
  caseStudy: ReturnType<typeof generateCaseStudy>;
  sampleProject: ReturnType<typeof generateSampleProject>;
  portfolioCopy: ReturnType<typeof generatePortfolioCopy>;
  nextActions: string[];
  portfolioGoal: string;
  clientSources: ReturnType<typeof generateClientSourceMap>;
  criteria: ReturnType<typeof generateIdealClientCriteria>;
  prospectTypes: ReturnType<typeof generateProspectTypes>;
  searchQueries: ReturnType<typeof generateSearchQueries>;
  leadScorecard: ReturnType<typeof generateLeadScorecard>;
  sampleProspects: ReturnType<typeof generatePipelineSampleProspects>;
  priorityPlan: ReturnType<typeof generatePriorityPlan>;
  pipelineNextActions: string[];
  trustBullets: string[];
  audience: string;
}

interface WarningCheck {
  name: string;
  pass: boolean;
  details: string[];
}

interface PathScore {
  contextAccuracy: number;
  serviceSpecificity: number;
  clientReadiness: number;
  beginnerSafety: number;
  reportQuality: number;
}

interface PathResult {
  def: AuditPathDef;
  output: ModuleOutput;
  warnings: WarningCheck[];
  scores: PathScore;
  status: 'PASS' | 'NEEDS REVIEW' | 'FAIL';
}

const AUDIT_PATHS: AuditPathDef[] = [
  {
    label: 'Video Editor / Short-Form Clip Editing / Gaming',
    track: 'Video Editor',
    selectedSkills: ['video-editing', 'short-form'],
    serviceId: 'short_form_clips',
    serviceLabel: 'Short-Form Social Clip Editing',
    market: 'Creators & Streamers',
    niche: 'Gaming Creators',
    offerName: 'Weekly Reel Batch (5 clips/wk)',
    offerType: 'retainer',
  },
  {
    label: 'Video Editor / Podcast Clip Repurposing / Podcasters',
    track: 'Video Editor',
    selectedSkills: ['video-editing', 'podcast'],
    serviceId: 'podcast_post_production',
    serviceLabel: 'Podcast Post-Production',
    market: 'Content Creators',
    niche: 'Podcasters',
    offerName: 'Podcast Video + Audiogram Package',
    offerType: 'one_time_project',
  },
  {
    label: 'Developer / Custom Theme Development / AI Startups',
    track: 'WordPress Developer',
    selectedSkills: ['wordpress', 'theme-dev'],
    serviceId: 'custom_theme_development',
    serviceLabel: 'Custom Theme Development',
    market: 'Startups',
    niche: 'AI Startups',
    offerName: 'AI Startup Landing Page Build',
    offerType: 'one_time_project',
  },
  {
    label: 'Developer / Plugin Integration / Marketing Agencies',
    track: 'WordPress Developer',
    selectedSkills: ['wordpress', 'plugin-dev'],
    serviceId: 'plugin_integration_dev',
    serviceLabel: 'Plugin & Integration Development',
    market: 'Agencies',
    niche: 'Marketing Agencies',
    offerName: 'Marketing Tool Integration Connector',
    offerType: 'one_time_project',
  },
  {
    label: 'Developer / Site Migration or Performance / Local Businesses',
    track: 'WordPress Developer',
    selectedSkills: ['wordpress', 'migration'],
    serviceId: 'site_migration_performance',
    serviceLabel: 'Site Migration & Performance',
    market: 'Local Businesses',
    niche: 'Local Service Businesses',
    offerName: 'Host Migration + Zero Downtime',
    offerType: 'one_time_project',
  },
  {
    label: 'Designer / Product UI Design / SaaS',
    track: 'UI/UX Designer',
    selectedSkills: ['ui-design', 'product-design'],
    serviceId: 'product_ui_design',
    serviceLabel: 'Product UI Design',
    market: 'SaaS Products',
    niche: 'SaaS',
    offerName: 'Dashboard UI Redesign (3 key views)',
    offerType: 'one_time_project',
  },
  {
    label: 'Designer / Landing Page Design / Product Startups',
    track: 'UI/UX Designer',
    selectedSkills: ['ui-design', 'landing-page'],
    serviceId: 'product_ui_design',
    serviceLabel: 'Product UI Design',
    market: 'Startups',
    niche: 'Product Startups',
    offerName: 'MVP UI Kit (5 core screens)',
    offerType: 'one_time_project',
  },
  {
    label: 'Designer / Design System Build / Design Agencies',
    track: 'UI/UX Designer',
    selectedSkills: ['ui-design', 'design-systems'],
    serviceId: 'brand_identity_visual_systems',
    serviceLabel: 'Brand Identity & Visual Systems',
    market: 'Agencies',
    niche: 'Design Agencies',
    offerName: 'Design System Build for Agency',
    offerType: 'milestone_based',
  },
];

function generateModuleOutput(def: AuditPathDef): ModuleOutput {
  const cat = getServiceCategory(def.serviceId);
  const audience = getAudienceLabel(def.niche, def.market);
  const nicheLower = def.niche.toLowerCase();
  const angle = getAuthorityAngles(cat, nicheLower)[0]?.label || `${cat} specialist`;
  const positioning = generatePositionStatement(angle, def.serviceId, nicheLower, def.market, null, def.serviceId);
  const deliverables: string[] = [];

  return {
    audience,
    positioning,
    offerName: generateOfferName(cat, def.serviceLabel, def.offerType, nicheLower, def.serviceId),
    whoItIsFor: generateWhoItIsFor(cat, audience, deliverables, nicheLower, def.serviceId),
    problem: generateProblemItSolves(cat, audience, def.serviceLabel, nicheLower, def.serviceId),
    corePromise: generateCorePromise(cat, def.serviceLabel, null, nicheLower, def.serviceId),
    caseStudy: generateCaseStudy(cat, deliverables, audience, nicheLower, def.serviceId),
    sampleProject: generateSampleProject(cat, nicheLower, def.serviceId),
    portfolioCopy: generatePortfolioCopy(cat, nicheLower, def.serviceId),
    nextActions: generateNextActions(cat, nicheLower),
    portfolioGoal: generatePortfolioGoalStatement(cat, def.serviceLabel, nicheLower, def.serviceId),
    clientSources: generateClientSourceMap(cat, nicheLower, def.serviceId),
    criteria: generateIdealClientCriteria(cat, nicheLower, def.serviceId),
    prospectTypes: generateProspectTypes(cat, nicheLower, def.serviceId),
    searchQueries: generateSearchQueries(cat, nicheLower, def.serviceId),
    leadScorecard: generateLeadScorecard(cat, nicheLower),
    sampleProspects: generatePipelineSampleProspects(cat, nicheLower, def.serviceId),
    priorityPlan: generatePriorityPlan([], cat, nicheLower),
    pipelineNextActions: generatePipelineNextActions(cat, nicheLower, def.serviceId),
    trustBullets: generateTrustBuilderBullets(cat),
  };
}

function getAllText(output: ModuleOutput): string {
  return [
    output.positioning,
    output.offerName,
    output.whoItIsFor,
    output.problem,
    output.corePromise,
    output.caseStudy.problem,
    output.caseStudy.process,
    output.caseStudy.result,
    output.caseStudy.tools,
    output.caseStudy.cta,
    output.sampleProject.goal,
    output.sampleProject.whatToCreate,
    output.sampleProject.howToPresent,
    output.sampleProject.deliverables.join(' '),
    output.portfolioCopy.headline,
    output.portfolioCopy.shortIntro,
    output.portfolioCopy.caseStudyIntro,
    output.portfolioCopy.processSection,
    output.portfolioCopy.cta,
    output.portfolioGoal,
    ...output.nextActions,
    ...output.trustBullets,
    ...output.clientSources.sources.map((s) => s.sourceName + ' ' + s.whereToFind + ' ' + s.searchHint),
    ...output.criteria.criteria.map((c) => c.label + ' ' + c.whyItMatters),
    ...output.prospectTypes.types.map((t) => t.name + ' ' + t.description),
    ...output.searchQueries.queries.map((q) => q.query + ' ' + q.whatToLookFor),
    ...output.leadScorecard.factors.map((f) => f.name + ' ' + f.score),
    ...output.sampleProspects.map((p) => p.prospectName + ' ' + p.visibleProblem + ' ' + p.notes),
    ...output.priorityPlan.entries.map((e) => e.angleToUse + ' ' + e.whyWorthContacting + ' ' + e.nextStep),
    ...output.pipelineNextActions,
  ].filter(Boolean).join(' ').toLowerCase();
}

function checkCrossServiceMismatch(def: AuditPathDef, text: string): WarningCheck {
  const details: string[] = [];

  if (def.serviceId === 'custom_theme_development') {
    const forbidden = ['dashboard redesign', 'onboarding flow', 'figma prototype as main', 'storybook', 'plugin connector', 'short-form clips'];
    forbidden.forEach((t) => { if (text.includes(t)) details.push(`Theme dev should not mention: "${t}"`); });
  }
  if (def.serviceId === 'plugin_integration_dev') {
    const forbidden = ['investor landing page', 'full agency website build', 'saas dashboard redesign', 'short-form clips'];
    forbidden.forEach((t) => { if (text.includes(t)) details.push(`Plugin integration should not mention: "${t}"`); });
  }
  if (def.serviceId === 'product_ui_design') {
    const forbidden = ['wordpress theme', 'plugin setup', 'seo semantic html', 'lighthouse as main'];
    forbidden.forEach((t) => { if (text.includes(t)) details.push(`Product UI design should not mention: "${t}"`); });
  }
  if (def.serviceId === 'short_form_clips' || def.serviceId === 'podcast_post_production') {
    const forbidden = ['wordpress', 'plugin', 'dashboard', 'crm setup', 'seo semantic html'];
    forbidden.forEach((t) => { if (text.includes(t)) details.push(`Video editing should not mention: "${t}"`); });
  }

  return {
    name: 'Cross-service mismatch',
    pass: details.length === 0,
    details: details.length > 0 ? details : ['No cross-service contamination detected'],
  };
}

function checkRawJSON(text: string): WarningCheck {
  const patterns = ['"sources": [', '"criteria": [', '"queries": [', '"factors": [', '"entries": ['];
  const details: string[] = [];
  patterns.forEach((p) => { if (text.includes(p)) details.push(`Raw JSON structure found: "${p}"`); });
  return {
    name: 'Raw JSON visible',
    pass: details.length === 0,
    details: details.length > 0 ? details : ['No raw JSON structures in output'],
  };
}

function checkFakeClientClaims(text: string, output: ModuleOutput): WarningCheck {
  const fakePhrases = ['here is how i helped', 'client results', 'testimonials', 'proven results'];
  const samplePhrases = ['this sample project shows', 'this practice case study shows', 'this fictional project demonstrates'];
  const details: string[] = [];

  fakePhrases.forEach((p) => {
    if (text.includes(p) &&
        !samplePhrases.some((sp) => text.includes(sp))) {
      details.push(`Fake-client phrase found: "${p}"`);
    }
  });

  const copyIntro = output.portfolioCopy.caseStudyIntro.toLowerCase();
  if (copyIntro.includes('here is how i helped')) {
    if (!samplePhrases.some((sp) => copyIntro.includes(sp))) {
      details.push('Portfolio copy caseStudyIntro uses "Here is how I helped" without sample project disclaimer');
    }
  }

  return {
    name: 'Fake-client claims',
    pass: details.length === 0,
    details: details.length > 0 ? details : ['No fake-client claims detected'],
  };
}

function checkRawIDs(text: string): WarningCheck {
  const forbiddenIDs = [
    'deliver_service', 'understand_niche', 'clear_process', 'improve_results',
    'communicate_professionally', 'sample_project', 'before_after', 'process_walkthrough',
    'custom_theme_development', 'plugin_integration_dev', 'site_migration_performance',
    'product_ui_design', 'brand_identity_visual_systems', 'ux_research_conversion_audits',
    'short_form_clips', 'long_form_content', 'podcast_post_production',
  ];
  const details: string[] = [];
  forbiddenIDs.forEach((id) => {
    if (text.includes(id)) details.push(`Raw ID in output: "${id}"`);
  });
  return {
    name: 'Raw IDs in output',
    pass: details.length === 0,
    details: details.length > 0 ? details : ['No raw IDs detected'],
  };
}

function checkProspectNicheFit(def: AuditPathDef, output: ModuleOutput): WarningCheck {
  const nicheKey = def.niche.toLowerCase().replace(/\s+/g, '_');
  const details: string[] = [];

  const mismatchSignals: Record<string, string[]> = {
    podcast: ['streamer', 'streaming', 'twitch stream', 'gaming', 'gameplay', 'vod', 'long-form video', 'tutorial', 'educational'],
    gaming: ['podcast episode', 'interview clip', 'audiogram', 'educational course', 'tutorial lesson', 'course content'],
    marketing_agencies: ['website portfolio', 'startup landing page', 'ai startup website', 'local business website', 'service page build'],
    ai_startups: ['agency portfolio', 'local seo', 'service area', 'local search'],
    local_business: ['ai startup', 'product hunt', 'investor confidence', 'startup mvp'],
  };

  const forbiddenTerms = mismatchSignals[nicheKey];
  if (!forbiddenTerms) {
    return {
      name: 'Prospect niche fit',
      pass: true,
      details: ['No niche mismatch signals checked — niche not in mismatch rules'],
    };
  }

  const prospectText = output.sampleProspects.map((p) =>
    [p.prospectName, p.visibleProblem, p.notes].join(' ').toLowerCase()
  ).join(' ');

  forbiddenTerms.forEach((term) => {
    if (prospectText.includes(term.toLowerCase())) {
      details.push(`Prospect text contains wrong-niche term "${term}" for ${def.niche} path`);
    }
  });

  return {
    name: 'Prospect niche fit',
    pass: details.length === 0,
    details: details.length > 0 ? details : ['All prospect info matches expected niche context'],
  };
}

function checkScorecard(def: AuditPathDef, output: ModuleOutput): WarningCheck {
  const total = output.leadScorecard.total;
  const details: string[] = [];
  if (total === 0) {
    details.push(`Scorecard total is 0/35 — may indicate uninitialised scorecard`);
  } else {
    details.push(`Scorecard total: ${total}/35 — properly initialised`);
  }
  if (output.leadScorecard.factors.every((f) => f.score === 0)) {
    details.push('All scorecard factors are 0 — scoring not applied');
  }
  return {
    name: 'Scorecard bug',
    pass: total > 0 && output.leadScorecard.factors.some((f) => f.score > 0),
    details,
  };
}

function checkServiceTerms(def: AuditPathDef, text: string): WarningCheck {
  const expectations: Record<string, Record<string, string[]>> = {
    custom_theme_development: {
      ai_startups: ['wordpress', 'landing page', 'responsive layout', 'performance', 'seo-friendly', 'lighthouse', 'handoff documentation', 'product hunt', 'ai founders'],
      default: ['wordpress', 'theme', 'responsive', 'performance'],
    },
    plugin_integration_dev: {
      marketing_agencies: ['plugin setup', 'forms', 'crm', 'tracking tags', 'campaign landing page', 'client handoff', 'agency operators'],
      default: ['plugin', 'integration', 'api'],
    },
    product_ui_design: {
      saas: ['dashboard', 'onboarding', 'user flow', 'interface hierarchy', 'figma', 'component system', 'activation'],
      default: ['ui', 'design', 'interface', 'figma'],
    },
    short_form_clips: {
      default: ['clips', 'hooks', 'captions', 'retention', 'pacing', 'shorts', 'reels', 'tiktok', 'vods'],
    },
    podcast_post_production: {
      default: ['podcast', 'episode', 'clip', 'audio'],
    },
    site_migration_performance: {
      default: ['migration', 'performance', 'speed', 'lighthouse', 'seo'],
    },
    brand_identity_visual_systems: {
      default: ['brand', 'identity', 'design system', 'visual'],
    },
  };

  const svcExpect = expectations[def.serviceId];
  const terms = svcExpect
    ? (svcExpect[def.niche.toLowerCase().replace(/\s+/g, '_')] || svcExpect.default || [])
    : [];

  const missing: string[] = [];
  terms.forEach((term) => {
    if (!text.includes(term.toLowerCase())) missing.push(term);
  });

  return {
    name: 'Service-specific expected terms',
    pass: missing.length === 0,
    details: missing.length > 0
      ? [`Missing expected terms: ${missing.join(', ')}`]
      : ['All expected terms present'],
  };
}

function runWarnings(def: AuditPathDef, output: ModuleOutput): WarningCheck[] {
  const text = getAllText(output);
  return [
    checkCrossServiceMismatch(def, text),
    checkRawJSON(text),
    checkFakeClientClaims(text, output),
    checkRawIDs(text),
    checkScorecard(def, output),
    checkServiceTerms(def, text),
    checkProspectNicheFit(def, output),
  ];
}

function computeScores(warnings: WarningCheck[]): PathScore {
  const passedCount = warnings.filter((w) => w.pass).length;
  const totalCount = warnings.length;

  const crossSvc = warnings.find((w) => w.name === 'Cross-service mismatch');
  const fakeClaims = warnings.find((w) => w.name === 'Fake-client claims');
  const rawIDs = warnings.find((w) => w.name === 'Raw IDs in output');
  const scorecard = warnings.find((w) => w.name === 'Scorecard bug');
  const serviceTerms = warnings.find((w) => w.name === 'Service-specific expected terms');

  const hasCriticalFail = crossSvc && !crossSvc.pass;

  const contextAccuracy = hasCriticalFail ? 3 : Math.round(6 + (passedCount / totalCount) * 4);
  const serviceSpecificity = serviceTerms && !serviceTerms.pass
    ? Math.round(4 + (passedCount / totalCount) * 3)
    : Math.round(6 + (passedCount / totalCount) * 4);
  const clientReadiness = (fakeClaims && !fakeClaims.pass) || (rawIDs && !rawIDs.pass)
    ? Math.round(3 + (passedCount / totalCount) * 3)
    : Math.round(6 + (passedCount / totalCount) * 4);
  const beginnerSafety = (rawIDs && !rawIDs.pass) || (fakeClaims && !fakeClaims.pass) ? 4 : 9;
  const reportQuality = scorecard && !scorecard.pass
    ? Math.round(4 + (passedCount / totalCount) * 3)
    : Math.round(6 + (passedCount / totalCount) * 4);

  return {
    contextAccuracy: Math.min(10, contextAccuracy),
    serviceSpecificity: Math.min(10, serviceSpecificity),
    clientReadiness: Math.min(10, clientReadiness),
    beginnerSafety: Math.min(10, beginnerSafety),
    reportQuality: Math.min(10, reportQuality),
  };
}

function determineStatus(warnings: WarningCheck[], scores: PathScore): 'PASS' | 'NEEDS REVIEW' | 'FAIL' {
  const crossSvc = warnings.find((w) => w.name === 'Cross-service mismatch');
  const fakeClaims = warnings.find((w) => w.name === 'Fake-client claims');
  const rawIDs = warnings.find((w) => w.name === 'Raw IDs in output');
  const scorecard = warnings.find((w) => w.name === 'Scorecard bug');
  const rawJSON = warnings.find((w) => w.name === 'Raw JSON visible');

  if ((crossSvc && !crossSvc.pass) || (fakeClaims && !fakeClaims.pass) ||
      (rawIDs && !rawIDs.pass) || (scorecard && !scorecard.pass)) {
    return 'FAIL';
  }

  const prospectFit = warnings.find((w) => w.name === 'Prospect niche fit');

  const avgScore = (scores.contextAccuracy + scores.serviceSpecificity +
    scores.clientReadiness + scores.beginnerSafety + scores.reportQuality) / 5;

  if (avgScore < 6 || (rawJSON && !rawJSON.pass) || (prospectFit && !prospectFit.pass)) {
    return 'NEEDS REVIEW';
  }

  return 'PASS';
}

function renderPathReport(result: PathResult): string {
  const d = result.def;
  const o = result.output;
  const ctx = resolveBlueprintContext(d.serviceId, d.niche.toLowerCase().replace(/\s+/g, '_'));

  const lines: string[] = [
    `# Path: ${d.label}`,
    '',
    '## Context',
    '',
    '| Field | Value |',
    '|-------|-------|',
    `| Track | ${d.track} |`,
    `| Skills | ${d.selectedSkills.join(', ')} |`,
    `| Service | ${d.serviceLabel} |`,
    `| Service ID | \`${d.serviceId}\` |`,
    `| Market | ${d.market} |`,
    `| Niche | ${d.niche} |`,
    `| Offer | ${d.offerName} (${d.offerType}) |`,
    `| Audience Label | ${o.audience} |`,
    `| Expected Category | ${ctx.serviceCategory} |`,
    '',
    '## Module 1 Output',
    '',
    `**Positioning Statement:** ${o.positioning}`,
    '',
    '| Field | Value |',
    '|-------|-------|',
    '| Selected Service | ' + d.serviceLabel + ' |',
    '| Selected Market/Niche | ' + d.market + ' / ' + d.niche + ' |',
    '| Opportunity Score | N/A (requires simulator) |',
    '| Warnings | None |',
    '',
    '## Module 2 Output',
    '',
    '| Field | Value |',
    '|-------|-------|',
    `| Offer Name | ${o.offerName} |`,
    `| Who It Is For | ${o.whoItIsFor} |`,
    `| Problem It Solves | ${o.problem} |`,
    `| Core Promise | ${o.corePromise} |`,
    `| Pricing Model | ${d.offerType === 'retainer' ? 'Retainer' : d.offerType === 'one_time_project' ? 'One-Time Project' : d.offerType === 'milestone_based' ? 'Milestone Based' : 'Custom'} |`,
    `| Deliverables | ${ctx.deliverables.length > 0 ? ctx.deliverables.join(', ') : '—'} |`,
    '',
    '| Warning | Status |',
    '|---------|--------|',
    '| Cross-service mismatch | ' + (result.warnings.find((w) => w.name === 'Cross-service mismatch')?.pass ? 'Pass' : 'Check') + ' |',
    '',
    '## Module 3 Output',
    '',
    '| Field | Value |',
    '|-------|-------|',
    `| Authority Angle | ${getAuthorityAngles(ctx.serviceCategory, d.niche.toLowerCase())[0]?.label || '—'} |`,
    '| Available Credibility Levels | ' + CREDIBILITY_LEVELS.map((c) => c.label).join(', ') + ' |',
    '',
    '**Trust Bullets:**',
    ...o.trustBullets.map((b) => '- ' + b),
    '',
    '**Proof Asset Recommendations (from context):**',
    '- Case Studies',
    '- Sample Projects',
    '- Before/After Breakdowns',
    '',
    '**Content Asset Ideas (generated):**',
    '- Based on service + niche context',
    '',
    '| Warning | Status |',
    '|---------|--------|',
    '| Fake-client claims | ' + (result.warnings.find((w) => w.name === 'Fake-client claims')?.pass ? 'Pass' : 'Check') + ' |',
    '| Raw IDs | ' + (result.warnings.find((w) => w.name === 'Raw IDs in output')?.pass ? 'Pass' : 'Check') + ' |',
    '',
    '## Module 4 Output',
    '',
    `**Portfolio Goal:** ${o.portfolioGoal}`,
    '',
    '| Field | Value |',
    '|-------|-------|',
    `| Case Study Problem | ${o.caseStudy.problem} |`,
    `| Case Study Process | ${o.caseStudy.process} |`,
    `| Case Study Tools | ${o.caseStudy.tools} |`,
    `| Deliverables | ${ctx.deliverables.length > 0 ? ctx.deliverables.join(', ') : '—'} |`,
    `| Tools | ${ctx.tools.join(', ')} |`,
    '',
    '**Sample Project:**',
    `- **Name:** ${o.sampleProject.projectName}`,
    `- **Goal:** ${o.sampleProject.goal}`,
    `- **What to Create:** ${o.sampleProject.whatToCreate}`,
    `- **Deliverables:** ${o.sampleProject.deliverables.join(', ')}`,
    `- **Timeline:** ${o.sampleProject.timeline}`,
    '',
    '**Portfolio Copy:**',
    `- **Headline:** ${o.portfolioCopy.headline}`,
    `- **Short Intro:** ${o.portfolioCopy.shortIntro}`,
    `- **Case Study Intro:** ${o.portfolioCopy.caseStudyIntro}`,
    `- **Process:** ${o.portfolioCopy.processSection}`,
    `- **CTA:** ${o.portfolioCopy.cta}`,
    '',
    '| Warning | Status |',
    '|---------|--------|',
    '| Service-specific terms | ' + (result.warnings.find((w) => w.name === 'Service-specific expected terms')?.pass ? 'Pass' : 'Check') + ' |',
    '| Fake-client claims | ' + (result.warnings.find((w) => w.name === 'Fake-client claims')?.pass ? 'Pass' : 'Check') + ' |',
    '',
    '## Module 5 Output',
    '',
    '**Client Sources:** ' + o.clientSources.sources.length + ' sources',
    ...o.clientSources.sources.map((s, i) => `${i + 1}. **${s.sourceName}** (${s.difficulty}) — ${s.whereToFind}`),
    '',
    '**Ideal Client Criteria:** ' + o.criteria.criteria.length + ' criteria',
    ...o.criteria.criteria.map((c) => `- **${c.label}** (${c.priority}): ${c.whyItMatters}`),
    '',
    '**Prospect Types:** ' + o.prospectTypes.types.length + ' types',
    ...o.prospectTypes.types.map((t) => `- **${t.name}** (${t.difficulty}, ${t.priority}): ${t.description}`),
    '',
    '**Search Queries:** ' + o.searchQueries.queries.length + ' queries',
    ...o.searchQueries.queries.map((q) => `- ${q.platform}: \`${q.query}\``),
    '',
    '**Lead Scorecard:** ' + o.leadScorecard.total + '/35',
    ...o.leadScorecard.factors.map((f) => `- ${f.name}: ${f.score}/${f.maxScore}`),
    '',
    '**Sample Prospects:** ' + o.sampleProspects.length + ' prospects',
    ...o.sampleProspects.map((p) => `- **${p.prospectName}** (${p.platform}) — Score: ${p.score}/35, Priority: ${p.priority}`),
    '',
    '**Priority Plan:** ' + o.priorityPlan.entries.length + ' entries',
    ...o.priorityPlan.entries.map((e, i) => `${i + 1}. **${e.prospectName}** — ${e.whyWorthContacting}`),
    '',
    '**Pipeline Next Actions:** ' + o.pipelineNextActions.length + ' actions',
    ...o.pipelineNextActions.map((a, i) => `${i + 1}. ${a}`),
    '',
    '| Warning | Status |',
    '|---------|--------|',
    '| Cross-service mismatch | ' + (result.warnings.find((w) => w.name === 'Cross-service mismatch')?.pass ? 'Pass' : 'Check') + ' |',
    '| Raw JSON visible | ' + (result.warnings.find((w) => w.name === 'Raw JSON visible')?.pass ? 'Pass' : 'Check') + ' |',
    '| Fake-client claims | ' + (result.warnings.find((w) => w.name === 'Fake-client claims')?.pass ? 'Pass' : 'Check') + ' |',
    '| Raw IDs in output | ' + (result.warnings.find((w) => w.name === 'Raw IDs in output')?.pass ? 'Pass' : 'Check') + ' |',
    '| Scorecard bug | ' + (result.warnings.find((w) => w.name === 'Scorecard bug')?.pass ? 'Pass' : 'Check') + ' |',
    '| Service-specific terms | ' + (result.warnings.find((w) => w.name === 'Service-specific expected terms')?.pass ? 'Pass' : 'Check') + ' |',
    '| Prospect niche fit | ' + (result.warnings.find((w) => w.name === 'Prospect niche fit')?.pass ? 'Pass' : 'Check') + ' |',
    '',
    '## Warning Details',
    '',
    ...result.warnings.map((w) => [
      `### ${w.name} — ${w.pass ? '✅ PASS' : '❌ ' + (w.details.some((d) => d.includes('Cross-service') || d.includes('fake-client') || d.includes('Raw ID') || d.includes('Scorecard') && d.includes('uninitialised')) ? 'FAIL' : 'WARNING')}`,
      '',
      ...w.details.map((d) => `- ${d}`),
      '',
    ]).flat(),
    '',
    '## Scores',
    '',
    '| Dimension | Score |',
    '|-----------|-------|',
    `| Context Accuracy | ${result.scores.contextAccuracy}/10 |`,
    `| Service Specificity | ${result.scores.serviceSpecificity}/10 |`,
    `| Client Readiness | ${result.scores.clientReadiness}/10 |`,
    `| Beginner Safety | ${result.scores.beginnerSafety}/10 |`,
    `| Report Quality | ${result.scores.reportQuality}/10 |`,
    '',
    `**Status:** ${result.status === 'PASS' ? '✅ PASS' : result.status === 'NEEDS REVIEW' ? '⚠️ NEEDS REVIEW' : '❌ FAIL'}`,
    '',
    '---',
    '',
  ];

  return lines.join('\n');
}

export function generateBlueprintAudit(): string {
  const date = new Date().toISOString().slice(0, 10);
  const results: PathResult[] = AUDIT_PATHS.map((def) => {
    const output = generateModuleOutput(def);
    const warnings = runWarnings(def, output);
    const scores = computeScores(warnings);
    const status = determineStatus(warnings, scores);
    return { def, output, warnings, scores, status };
  });

  const summaryRows = results.map((r, i) => {
    const crossSvc = r.warnings.find((w) => w.name === 'Cross-service mismatch');
    const fakeClaims = r.warnings.find((w) => w.name === 'Fake-client claims');
    const rawIDs = r.warnings.find((w) => w.name === 'Raw IDs in output');
    const rawJSON = r.warnings.find((w) => w.name === 'Raw JSON visible');
    const scorecard = r.warnings.find((w) => w.name === 'Scorecard bug');
    const serviceTerms = r.warnings.find((w) => w.name === 'Service-specific expected terms');

    const m1 = crossSvc?.pass !== false ? '✅' : '❌';
    const m2 = rawJSON?.pass !== false ? '✅' : '❌';
    const m3 = (fakeClaims?.pass !== false && rawIDs?.pass !== false) ? '✅' : '❌';
    const m4 = serviceTerms?.pass !== false ? '✅' : '❌';
    const prospectFit = r.warnings.find((w) => w.name === 'Prospect niche fit');
    const m5 = (scorecard?.pass !== false && prospectFit?.pass !== false) ? '✅' : '❌';
    return `| ${i + 1} | ${r.def.label} | ${m1} | ${m2} | ${m3} | ${m4} | ${m5} | ${r.status} |`;
  });

  const header = [
    '# Blueprint QA Audit Summary',
    '',
    `> Generated: ${date}`,
    `> Environment: Development`,
    `> Paths: ${AUDIT_PATHS.length}`,
    `> Modules: 1–5 (extendable to 1–8)`,
    '',
    '---',
    '',
    '## Summary Table',
    '',
    '| Path | Module 1 | Module 2 | Module 3 | Module 4 | Module 5 | Overall |',
    '|------|----------|----------|----------|----------|----------|---------|',
    ...summaryRows,
    '',
    '---',
    '',
    '## Detailed Path Reports',
    '',
  ].join('\n');

  const body = results.map(renderPathReport).join('\n');

  const failed = results.filter((r) => r.status === 'FAIL').length;
  const needsReview = results.filter((r) => r.status === 'NEEDS REVIEW').length;
  const passed = results.filter((r) => r.status === 'PASS').length;

  const footer = [
    '## Final Summary',
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Total Paths | ${AUDIT_PATHS.length} |`,
    `| Passed | ${passed} |`,
    `| Needs Review | ${needsReview} |`,
    `| Failed | ${failed} |`,
    '',
    '---',
    '',
    '*Generated by Blueprint QA Audit Tool — development only*',
    '',
  ].join('\n');

  return header + body + footer;
}

export function downloadBlueprintAudit() {
  const md = generateBlueprintAudit();
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'blueprint-full-audit.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
