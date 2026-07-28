import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpportunityMapStore } from '../lib/opportunity-map';
import { useOfferEngineeringStore } from '../lib/offer-engineering';
import { useAuthoritySystemStore } from '../lib/authority-system';
import { usePortfolioSystemStore } from '../lib/portfolio-system';
import { useClientPipelineStore } from '../lib/client-pipeline-system';
import { useOutreachEngineStore } from '../lib/outreach-engine-system';
import { getServiceCategory, getAudienceLabel, generateContentAssetIdeas, generateAuthorityProfile, generatePortfolioAssetIdeas, generateCaseStudy, generateSampleProject, generatePortfolioCopy, generateNextActions, generatePortfolioGoalStatement, PAGE_SECTIONS, generateClientSourceMap, generateIdealClientCriteria, generateProspectTypes, generateSearchQueries, generateLeadScorecard, generatePriorityPlan, generatePipelineNextActions } from '../lib/blueprint-content';
import { downloadAudit } from './content-audit/generateContentAudit';
import { downloadBlueprintAudit } from './blueprint-audit/generateBlueprintAudit';
import type { OfferBlueprint, ScopeLimits, ProposalSummary, TieredPricing, ValueBasedPricing } from '../types/offer-engineering';
import type { ProofAsset, PortfolioAsset, ContentAsset, TrustBuilderItem, SocialProofPlan, AuthorityProfileData } from '../types/authority-system';
import { composeAll } from '../lib/portfolio-system/composer';
import type { PortfolioGoal } from '../types/portfolio-system';

/* ───────────────────────────────────────────────
 *  Scope of work defaults
 * ─────────────────────────────────────────────── */

const DEF_SCOPE: ScopeLimits = {
  revisionCount: 2, communicationMethod: 'Discord', responseTime: '12 hours', deliveryTime: '48 hours', includedRounds: 2,
};
const DEF_TIERED: TieredPricing = { starterPrice: null, proPrice: null, premiumPrice: null };
const DEF_VALUE_BASED: ValueBasedPricing = { estimatedClientValue: null, impactLevel: '', suggestedPriceRange: '' };

function makeBlueprint(opts: {
  label: string; name: string; audience: string; problem: string; promise: string;
  deliverables: string[]; mechanism: string; timeline: string; price: number; why: string;
}): OfferBlueprint {
  const ps: ProposalSummary = {
    headline: opts.name, problem: opts.problem,
    solution: `This offer delivers ${opts.deliverables.slice(0, 3).join(', ')} using ${opts.mechanism || 'a structured approach'}.`,
    deliverables: opts.deliverables, timeline: opts.timeline, pricing: `$${opts.price}`,
    nextSteps: 'Book a quick discovery call to confirm if this package fits your needs.',
  };
  return {
    productizedService: opts.label, offerName: opts.name, whoItIsFor: opts.audience,
    problemItSolves: opts.problem, corePromise: opts.promise, deliverables: opts.deliverables,
    uniqueMechanism: opts.mechanism, scopeLimits: DEF_SCOPE, valueAmplifier: 'Priority support and clear communication throughout the engagement',
    timeline: opts.timeline, pricingModel: 'flat_rate', finalPrice: opts.price,
    tieredPricing: DEF_TIERED, valueBasedPricing: DEF_VALUE_BASED,
    pricingStructure: `$${opts.price} one-time`, whyThisWorks: opts.why,
    nextStepCTA: 'Book a quick discovery call to confirm the scope and start the project.',
    proposalSummary: ps,
  };
}

/* ───────────────────────────────────────────────
 *  Scenario definitions
 * ─────────────────────────────────────────────── */

type Scenario = 'video' | 'wordpress' | 'design';

const SCENARIOS: Record<Scenario, {
  label: string; career: string; service: string; serviceLabel: string; market: string; niche: string;
  positioning: string;
  offerName: string; offerType: string; deliverables: string[]; mechanism: string; price: number; timeline: string;
  angle: string; credibility: string; promise: string;
}> = {
  video: {
    label: 'Video',
    career: 'video_editor',
    service: 'short_form_clips',
    serviceLabel: 'Short-Form Social Clip Editing',
    market: 'Gaming Creators',
    niche: 'Gaming',
    positioning: 'I help gaming creators turn long-form content into short-form clips designed for retention, discovery, and consistent publishing.',
    offerName: 'Gaming Shorts Growth Package',
    offerType: 'Retainer',
    deliverables: ['12 short-form clips/month', 'Captions and hooks', 'Viral moment selection', 'Thumbnail support'],
    mechanism: 'Viral Moment Extraction Framework',
    price: 200,
    timeline: '48 hours per batch',
    angle: 'Shorts Growth Editor',
    credibility: 'intermediate',
    promise: 'Clear communication, fast response, consistent delivery',
  },
  wordpress: {
    label: 'WordPress',
    career: 'wordpress_developer',
    service: 'custom_theme_development',
    serviceLabel: 'Custom Theme Development',
    market: 'Tech Startups',
    niche: 'AI Startups',
    positioning: 'I help startup teams launch fast, professional WordPress websites with clear structure, responsive layouts, and performance-first development.',
    offerName: 'AI Startup Website Launch Proposal',
    offerType: 'One-Time Project',
    deliverables: ['Custom WordPress Theme', 'Responsive Mobile Layout', 'SEO-Optimised Semantic HTML', 'Theme Documentation', 'Handoff Session'],
    mechanism: 'Performance-First Build System',
    price: 1000,
    timeline: '3 weeks',
    angle: 'AI Startup Website Specialist',
    credibility: 'intermediate',
    promise: 'Defined scope, fast response, clear process',
  },
  design: {
    label: 'Design',
    career: 'ui_ux_designer',
    service: 'product_ui_design',
    serviceLabel: 'Product UI Design',
    market: 'SaaS Products',
    niche: 'Early-Stage SaaS',
    positioning: 'I help SaaS teams design clearer product interfaces that make the product easier to understand and use.',
    offerName: 'SaaS Product Interface Design Package',
    offerType: 'Milestone Based',
    deliverables: ['Wireframes', 'High-fidelity screens', 'Design system components', 'Developer handoff'],
    mechanism: 'User-First Design System',
    price: 750,
    timeline: '2 weeks',
    angle: 'SaaS Product UI Designer',
    credibility: 'intermediate',
    promise: 'Clear communication, structured design process, developer-ready handoff',
  },
};

/* ───────────────────────────────────────────────
 *  Seed helpers
 * ─────────────────────────────────────────────── */

const ALL_MOD1_STEPS = ['career_track', 'service', 'market', 'niche', 'offer', 'positioning', 'opportunity_score'] as const;
const ALL_MOD2 = ['offer_type', 'deliverables', 'unique_mechanism', 'scope_protection', 'value_amplifier', 'pricing', 'proposal_summary', 'offer_blueprint'] as const;
const ALL_MOD3 = ['authority_position', 'proof_asset_builder', 'portfolio_asset_plan', 'trust_builder', 'social_proof_strategy', 'content_asset_generator', 'authority_profile', 'authority_report'] as const;
const ALL_MOD4 = ['portfolio_direction', 'platform_structure', 'project_arrangement', 'project_presentations', 'portfolio_copy_cta', 'portfolio_build_pack'] as const;
const ALL_MOD5 = ['client_source_map', 'ideal_client_criteria', 'prospect_type_selector', 'search_query_builder', 'lead_qualification_score', 'pipeline_list_builder', 'priority_plan', 'client_pipeline_report'] as const;

function seedPhase1(s: Scenario) {
  const d = SCENARIOS[s];
  useOpportunityMapStore.setState({
    careerTrackId: d.career,
    serviceId: d.service,
    marketId: d.market.toLowerCase().replace(/\s+/g, '_'),
    marketLabel: d.market,
    nicheId: d.niche.toLowerCase().replace(/\s+/g, '_'),
    nicheLabel: d.niche,
    offerId: null,
    positioning: d.positioning,
    opportunityScore: 75,
    currentStep: 'positioning',
    completedSteps: [...ALL_MOD1_STEPS],
  });
}

function seedPhase2(s: Scenario) {
  const d = SCENARIOS[s];
  const bp = makeBlueprint({
    label: d.serviceLabel, name: d.offerName, audience: d.niche,
    problem: `Building a professional ${d.serviceLabel.toLowerCase()} is time-consuming`,
    promise: '', deliverables: d.deliverables, mechanism: d.mechanism,
    timeline: d.timeline, price: d.price,
    why: `${d.niche} need ${d.serviceLabel.toLowerCase()} to grow their business`,
  });
  useOfferEngineeringStore.setState({
    offerId: `dev_seed_${s}`,
    phase1OfferId: `dev_seed_${s}`,
    service: d.service,
    market: d.market,
    niche: d.niche,
    positioning: d.positioning,
    offerType: d.offerType === 'Retainer' ? 'retainer' : d.offerType === 'One-Time Project' ? 'one_time_project' : 'milestone_based',
    deliverables: d.deliverables,
    uniqueMechanism: d.mechanism,
    scopeLimits: DEF_SCOPE,
    valueAmplifier: 'Priority Support',
    pricingModel: 'flat_rate',
    finalPrice: d.price,
    tieredPricing: DEF_TIERED,
    valueBasedPricing: DEF_VALUE_BASED,
    proposalSummary: bp.proposalSummary,
    offerBlueprint: bp,
    currentStep: 'offer_blueprint',
    completedSteps: [...ALL_MOD2],
  });
}

function seedPhase3(s: Scenario) {
  const d = SCENARIOS[s];
  const cat3 = getServiceCategory(d.service);
  const audience3 = getAudienceLabel(d.niche, d.market);

  const proofAssets: ProofAsset[] = [
    { type: 'sample_project', title: `Sample ${d.serviceLabel} project`, whatToCreate: `A polished ${d.serviceLabel.toLowerCase()} sample showcasing your skills`, whyItBuildsTrust: 'Shows potential clients what you can deliver', estimatedTime: '2-4 hours', difficulty: 'easy' },
    { type: 'before_after', title: 'Before/after showcase', whatToCreate: 'Document a transformation showing your process and results', whyItBuildsTrust: 'Visually proves your ability to improve outcomes', estimatedTime: '1-2 hours', difficulty: 'easy' },
  ];

  const portfolioAssets: PortfolioAsset[] = generatePortfolioAssetIdeas(cat3, ['Sample ' + d.serviceLabel], d.niche || d.market || 'clients', d.serviceLabel, d.mechanism, d.niche);

  const trustChecklist: TrustBuilderItem[] = [
    { label: 'Clear process documentation', reason: 'Shows clients exactly how you work', action: 'Write a process doc', status: 'in_progress' },
    { label: 'Clear scope of work', reason: 'Prevents scope creep', action: 'Template a scope-of-work document', status: 'pending' },
    { label: 'Delivery timeline guarantee', reason: 'Builds confidence', action: 'State your standard delivery time', status: 'ready' },
  ];

  const socialProof: SocialProofPlan = {
    currentProof: 'I have sample projects and process documentation available.',
    missingProof: 'No published case studies, limited social proof content.',
    nextActions: ['Create one sample project from scratch', 'Publish one process breakdown post', 'Share a before/after on LinkedIn'],
  };

  const contentAssets: ContentAsset[] = generateContentAssetIdeas(cat3, audience3, d.offerName, d.niche);

  const authorityProfile: AuthorityProfileData = generateAuthorityProfile(cat3, d.angle, d.positioning, d.niche, d.market, [], '');

  const as = useAuthoritySystemStore.getState();
  as.reset();
  useAuthoritySystemStore.setState({
    phase2Service: d.service,
    phase2ServiceLabel: d.serviceLabel,
    phase2Market: d.market,
    phase2Niche: d.niche,
    phase2Positioning: d.positioning,
    phase2OfferName: d.offerName,
    phase2OfferType: d.offerType,
    phase2CorePromise: `Professional ${d.serviceLabel.toLowerCase()} for ${d.niche}`,
    phase2UniqueMechanism: d.mechanism,
    phase2Deliverables: d.deliverables,
    phase2Pricing: `$${d.price}`,
    phase2Timeline: d.timeline,
    phase2ScopeDetails: `${d.deliverables.length} deliverables included`,
    phase2ValueAmplifier: 'Priority Support',
    authorityAngle: d.angle,
    credibilityLevel: d.credibility,
    trustPromise: d.promise,
    authorityPosition: d.positioning,
    proofAssets,
    portfolioAssets,
    trustBuilderChecklist: trustChecklist,
    socialProofPlan: socialProof,
    contentAssets,
    authorityProfile,
    authorityReport: null,
    currentStep: 'authority_position',
    completedSteps: [],
  });
}

const SCENARIO_TO_CANONICAL: Record<string, { serviceId: string; marketId: string; nicheId: string | null }> = {
  video: { serviceId: 'short_form_editor', marketId: 'creators', nicheId: 'gaming' },
  wordpress: { serviceId: 'wordpress_developer', marketId: 'startups', nicheId: null },
  design: { serviceId: 'ui_ux_designer', marketId: 'saas_startups', nicheId: null },
};

function seedPhase4(s: Scenario) {
  const d = SCENARIOS[s];
  const canonical = SCENARIO_TO_CANONICAL[s];

  const ctx: import('../types/portfolio-system').UpstreamContext = {
    mod1CareerTrackId: d.career,
    mod1ServiceId: canonical.serviceId,
    mod1MarketId: canonical.marketId,
    mod1NicheId: canonical.nicheId,
    mod1OfferId: null,
    mod1Positioning: d.positioning,
    mod2OfferType: d.offerType === 'Retainer' ? 'retainer' : d.offerType === 'One-Time Project' ? 'one_time_project' : 'milestone_based',
    mod2Deliverables: d.deliverables,
    mod2UniqueMechanism: d.mechanism,
    mod2ScopeLimits: {},
    mod2ValueAmplifier: 'Priority Support',
    mod2PricingModel: 'flat_rate',
    mod2ProposalSummary: {},
    mod3AuthorityPosition: 'builder',
    mod3CoreTrustPromise: d.promise,
    mod3ProofPriorities: [
      { id: 'pp1', gapTitle: 'Capability demonstration', gapDescription: 'Show ability to deliver', recommendedFormat: 'case_study' },
    ],
    mod3ProofAssets: [
      {
        id: 'asset1', priorityId: 'pp1', title: `Sample ${d.serviceLabel}`, assetType: 'case_study',
        credibilityGapProved: 'demonstrated ability',
        portfolioCopy: { headline: `${d.serviceLabel}: Case Study`, description: `How I helped ${d.niche}`, proofStatement: `Delivered professional ${d.serviceLabel.toLowerCase()}`, cta: 'See the work' },
        presentationStructure: ['problem', 'process', 'result'],
        isAccepted: true,
      },
    ],
    mod3ProfileCopy: {
      professionalHeadline: d.positioning,
      shortBio: `I help ${d.niche} with ${d.serviceLabel.toLowerCase()}.`,
      longBio: d.positioning,
      offerStatement: d.offerName,
      credibilityBullets: ['Clear process', 'Fast turnaround'],
      proofReferenceLine: 'See my work below.',
      ctaLine: 'Let us talk.',
    },
    mod3PortfolioCopy: {
      portfolioCta: 'Ready to start?',
      sections: [],
    },
  };

  const result = composeAll(ctx);
  const store = usePortfolioSystemStore.getState();
  store.reset();

  store.setPhase3Context(ctx);
  store.setPortfolioDirection(result.direction);
  store.setPlatformRecommendation(result.platform);
  store.setSections(result.sections);
  store.setProjectPlacements(result.placements);
  store.setProjectPresentations(result.presentations);
  store.setPortfolioCopy(result.copy);
  store.setBuildChecklist(result.buildChecklist);
  store.setPublishChecklist(result.publishChecklist);
  store.setBuildPack(result.pack);
  store.confirmStep();
}

function seedPhase5(s: Scenario) {
  const d = SCENARIOS[s];
  const canonical = SCENARIO_TO_CANONICAL[s];
  const cat = getServiceCategory(d.service);

  const sourceMap = generateClientSourceMap(cat, d.niche);
  const criteria = generateIdealClientCriteria(cat, d.niche);
  const prospectTypes = generateProspectTypes(cat, d.niche);
  const searchQueries = generateSearchQueries(cat, d.niche);
  const scorecard = generateLeadScorecard();

  useClientPipelineStore.getState().reset();
  const ps = usePortfolioSystemStore.getState();
  const up = ps.upstream;
  const dir = ps.portfolioDirection;
  useClientPipelineStore.setState({
    phase4Service: canonical.serviceId,
    phase4ServiceLabel: d.serviceLabel,
    phase4Market: canonical.marketId,
    phase4Niche: canonical.nicheId ?? d.niche,
    phase4Positioning: d.positioning,
    phase4OfferName: d.offerName,
    phase4OfferType: d.offerType,
    phase4Deliverables: d.deliverables,
    phase4UniqueMechanism: d.mechanism,
    phase4Pricing: `$${d.price}`,
    phase4Timeline: d.timeline,
    phase4ScopeDetails: `${d.deliverables.length} deliverables included`,
    phase4AuthorityAngle: d.angle,
    phase4ProofAssets: (up?.mod3ProofAssets ?? []).map((a) => ({ title: a.title, type: a.assetType })),
    phase4PortfolioAssets: [],
    phase4TrustBuilderChecklist: [],
    phase4ContentAssets: [],
    phase4AuthorityProfile: {
      oneLinePositioning: up?.mod3ProfileCopy.professionalHeadline || d.positioning,
      shortBio: up?.mod3ProfileCopy.shortBio || '',
      trustBullets: up?.mod3ProfileCopy.credibilityBullets || [],
      ctaLine: up?.mod3ProfileCopy.ctaLine || '',
    },
    phase4PortfolioGoal: { goals: [], statement: dir?.portfolioPromise || '' },
    phase4SelectedAssets: [],
    phase4CaseStudy: { projectTitle: '', clientNicheType: '' },
    phase4SampleProject: { projectName: '', goal: '' },
    phase4PortfolioCopy: { headline: ps.portfolioCopy?.headline || '', shortIntro: ps.portfolioCopy?.shortIntro || '' },
    phase4PortfolioReport: null,
    clientSourceMap: sourceMap,
    idealClientCriteria: criteria,
    prospectTypes: prospectTypes,
    searchQueryBank: searchQueries,
    leadScorecard: scorecard,
    pipelineList: [],
    priorityPlan: { entries: [] },
    pipelineReport: null,
    currentStep: 'client_source_map',
    completedSteps: [],
  });
}

function seedJourney(s: Scenario) {
  seedPhase1(s);
  seedPhase2(s);
  seedPhase3(s);
  seedPhase4(s);
  seedPhase5(s);
}

/* ───────────────────────────────────────────────
 *  Component
 * ─────────────────────────────────────────────── */

export function DevTestTools() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const show = useCallback((msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 2000);
  }, []);

  const seed = useCallback((s: Scenario, goto?: string) => {
    seedJourney(s);
    show(`✅ ${SCENARIOS[s].label} journey seeded`);
    if (goto) navigate(goto);
    else navigate('/workspace/client-pipeline');
  }, [navigate, show]);

  const seedCompleteModule1 = useCallback(() => {
    useOpportunityMapStore.setState({ completedSteps: [...ALL_MOD1_STEPS], currentStep: 'opportunity_score' });
    show('✅ Module 1 marked complete');
  }, [show]);

  const seedCompleteModule2 = useCallback(() => {
    seedCompleteModule1();
    useOfferEngineeringStore.setState({ completedSteps: [...ALL_MOD2], currentStep: 'offer_blueprint' });
    show('✅ Module 2 marked complete');
  }, [seedCompleteModule1, show]);

  const seedCompleteModule3 = useCallback(() => {
    seedCompleteModule2();
    useAuthoritySystemStore.getState().reset();
    useAuthoritySystemStore.setState({ completedSteps: [...ALL_MOD3], currentStep: 'authority_report' });
    show('✅ Module 3 marked complete');
  }, [seedCompleteModule2, show]);

  const seedCompleteModule4 = useCallback(() => {
    seedCompleteModule3();
    usePortfolioSystemStore.getState().reset();
    usePortfolioSystemStore.setState({ completedSteps: [...ALL_MOD4] as any, currentStep: 'portfolio_build_pack' });
    show('✅ Module 4 marked complete');
  }, [seedCompleteModule3, show]);

  const seedCompleteModule5 = useCallback(() => {
    seedCompleteModule4();
    useClientPipelineStore.getState().reset();
    useClientPipelineStore.setState({ completedSteps: [...ALL_MOD5], currentStep: 'client_pipeline_report' });
    show('✅ Module 5 marked complete');
  }, [seedCompleteModule4, show]);

  const resetAll = useCallback(() => {
    useOpportunityMapStore.getState().reset();
    useOfferEngineeringStore.getState().reset();
    useAuthoritySystemStore.getState().reset();
    usePortfolioSystemStore.getState().reset();
    useClientPipelineStore.getState().reset();
    try { localStorage.removeItem('blueprint-opportunity-map'); } catch { /* noop */ }
    try { localStorage.removeItem('offer-engineering-progress'); } catch { /* noop */ }
    try { localStorage.removeItem('authority-system-progress'); } catch { /* noop */ }
    try { localStorage.removeItem('portfolio-system-progress'); } catch { /* noop */ }
    try { localStorage.removeItem('client-pipeline-progress'); } catch { /* noop */ }
    useOutreachEngineStore.getState().reset();
    try { localStorage.removeItem('outreach-engine-progress'); } catch { /* noop */ }
    show('🗑️ All test data reset');
  }, [show]);

  return (
    <div className="fixed bottom-4 right-4 sm:right-6 z-[9999] flex flex-col items-end gap-2">
      {open && (
        <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-4 w-[280px] shadow-2xl shadow-black/60 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400">Dev Test Tools</p>

          <div className="space-y-1.5">
            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-zinc-500">Seed Full Journey</p>
            <div className="grid grid-cols-1 gap-1.5">
              <DevBtn label="Seed Video Editor Journey" onClick={() => seed('video')} />
              <DevBtn label="Seed WordPress Journey" onClick={() => seed('wordpress')} />
              <DevBtn label="Seed UI/UX Journey" onClick={() => seed('design')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-zinc-500">Seed Module 5</p>
            <div className="grid grid-cols-1 gap-1.5">
              <DevBtn label="Seed Video M5" onClick={() => { seedPhase5('video'); show('✅ Video M5 seeded'); }} />
              <DevBtn label="Seed WordPress M5" onClick={() => { seedPhase5('wordpress'); show('✅ WordPress M5 seeded'); }} />
              <DevBtn label="Seed Design M5" onClick={() => { seedPhase5('design'); show('✅ Design M5 seeded'); }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-zinc-500">Mark Complete</p>
            <div className="grid grid-cols-1 gap-1.5">
              <DevBtn label="Seed Module 1 Complete" onClick={seedCompleteModule1} />
              <DevBtn label="Seed Module 2 Complete" onClick={seedCompleteModule2} />
              <DevBtn label="Seed Module 3 Complete" onClick={seedCompleteModule3} />
              <DevBtn label="Seed Module 4 Complete" onClick={seedCompleteModule4} />
              <DevBtn label="Seed Module 5 Complete" onClick={seedCompleteModule5} />
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-zinc-500">Navigation</p>
            <div className="grid grid-cols-5 gap-1.5">
              <DevBtn label="M1" onClick={() => navigate('/workspace/client-acquisition')} />
              <DevBtn label="M2" onClick={() => navigate('/workspace/offer-engineering')} />
              <DevBtn label="M3" onClick={() => navigate('/workspace/authority-system')} />
              <DevBtn label="M4" onClick={() => navigate('/workspace/portfolio-system')} />
              <DevBtn label="M5" onClick={() => navigate('/workspace/client-pipeline')} />
              <DevBtn label="M6" onClick={() => navigate('/workspace/outreach-engine')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-zinc-500">Audit</p>
            <DevBtn label="Generate Content Audit (MD)" onClick={downloadAudit} />
            <DevBtn label="Generate Full Blueprint QA Audit" onClick={downloadBlueprintAudit} />
          </div>

          <DevBtn
            label="Reset All Blueprint Test Data"
            onClick={resetAll}
            danger
          />

          {status && (
            <p className="text-[9px] text-emerald-400 text-center">{status}</p>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 text-[9px] font-bold uppercase tracking-[0.1em] text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
      >
        DEV
        <span className="text-[8px] opacity-60">{open ? '×' : '⚙'}</span>
      </button>
    </div>
  );
}

function DevBtn({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-3 py-1.5 rounded-lg text-[9px] font-semibold text-left transition-all cursor-pointer ${
        danger
          ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
          : 'bg-white/[0.03] border border-white/5 text-zinc-300 hover:bg-white/[0.06] hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}
