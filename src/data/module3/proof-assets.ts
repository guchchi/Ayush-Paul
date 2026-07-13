import { ProofAsset, ProofFormat } from '../../types/module3';
import type { PriorityContext } from './proof-priorities';

export function calculatePriorityFingerprint(priority: { id: string; gapTitle: string; gapDescription: string; recommendedFormat: string }): string {
  return JSON.stringify({
    id: priority.id,
    gapTitle: priority.gapTitle,
    gapDescription: priority.gapDescription,
    recommendedFormat: priority.recommendedFormat,
  });
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buyerLabel(marketId: string | null): string {
  const labels: Record<string, string> = {
    youtube_creators: 'YouTube Creators',
    creators: 'Creators',
    coaches: 'Coaches',
    agencies: 'Agencies',
    local_businesses: 'Local Businesses',
    saas_startups: 'SaaS Startups',
    startups: 'Startups',
    course_creators: 'Course Creators',
    podcasters: 'Podcasters',
    ecommerce_brands: 'Ecommerce Brands',
    personal_brands: 'Personal Brands',
  };
  if (marketId && labels[marketId]) return labels[marketId];
  return marketId ? marketId.replace(/_/g, ' ') : 'Target Clients';
}

function buyerLower(marketId: string | null): string {
  return buyerLabel(marketId).toLowerCase();
}

function gapTheme(gapTitle: string): string {
  const t = gapTitle.toLowerCase();
  if (t.includes('consistent quality') || t.includes('recurring consist')) return 'recurring_consistency';
  if (t.includes('coaching business') || t.includes('coaching business dynamic')) return 'coaching_business';
  if (t.includes('attention') || t.includes('retention') || t.includes('hold attention')) return 'attention_retention';
  if (t.includes('saas metric') || t.includes('growth loop')) return 'saas_metrics';
  if (t.includes('local customer') || t.includes('local acqui')) return 'local_acquisition';
  if (t.includes('brief to finished') || t.includes('take a brief')) return 'brief_to_finished';
  if (t.includes('production-ready') || t.includes('production ready')) return 'production_readiness';
  if (t.includes('early-stage') || t.includes('product constraint')) return 'early_stage_constraints';
  if (t.includes('build system') || t.includes('save real time')) return 'automation_systems';
  if (t.includes('approach works') || t.includes('mechanism') || t.includes('changes the outcome')) return 'mechanism_proof';
  if (t.includes('purpose') || t.includes('with purpose')) return 'purposeful_work';
  if (t.includes('platform-specific') || t.includes('platform specific')) return 'platform_expertise';
  return 'generic_capability';
}

interface ServiceProfile {
  briefContext: string[];
  materials: string[];
  baseSteps: string[];
  deliverables: string[];
  headlineBase: string;
  proofNarrative: string;
}

type ServiceKey = 'short_form_editor' | 'video_editor' | 'ui_ux_designer' | 'brand_designer' | 'frontend_developer' | 'no_code_developer' | 'automation_developer';

function serviceKey(serviceId: string | null): ServiceKey {
  const s = serviceId ?? '';
  if (s === 'short_form_editor') return 'short_form_editor';
  if (s === 'video_editor' || s === 'youtube_editor') return 'video_editor';
  if (s === 'ui_ux_designer') return 'ui_ux_designer';
  if (s === 'brand_designer') return 'brand_designer';
  if (s === 'frontend_developer') return 'frontend_developer';
  if (s === 'no_code_developer') return 'no_code_developer';
  if (s === 'automation_developer') return 'automation_developer';
  return 'frontend_developer';
}

const SERVICE_PROFILES: Record<ServiceKey, ServiceProfile> = {
  short_form_editor: {
    briefContext: ['source recording', 'candidate teaching moments'],
    materials: [
      'One raw public-domain or self-recorded 5–10 minute educational video file',
      'A documented list of 3 specific pacing rules and transition triggers used consistently',
    ],
    baseSteps: [
      'Review source recording and timestamp three standalone teaching moments worth isolating',
      'Select and rank the three moments by engagement potential and teaching clarity',
      'Apply hook treatment to the opening of each clip (first 3 seconds)',
      'Construct pacing through jump cuts and dead-space removal between phrases',
      'Add captions with visual emphasis hierarchy (keyword highlight, speaker label placement)',
      'Equalise audio consistency across all three clips (level, noise floor)',
      'Export three vertical clips with consistent caption and visual style',
    ],
    deliverables: [
      'Three edited vertical clips (9:16, 30–90 seconds each)',
      'Caption style specification sheet',
    ],
    headlineBase: 'Three-Clip Mini Content Cycle',
    proofNarrative: 'vertical short-form editing from source to export',
  },
  video_editor: {
    briefContext: ['long-form source', 'opening hook', 'narrative structure'],
    materials: [
      'One raw public-domain or self-recorded 10–20 minute long-form video',
      'A documented list of pacing targets (retention curve points, B-roll insertion triggers)',
    ],
    baseSteps: [
      'Mark opening hook candidate moments in the first 60 seconds of source',
      'Remove dead space, filler words, and extended pauses between key statements',
      'Insert B-roll or visual supports at pattern-interrupt points (every 60–90 seconds)',
      'Structure audio transitions between segments (level match, room-tone crossfade)',
      'Apply consistent text overlay style for key claims and speaker labels',
      'Review pacing changes against retention curve targets',
      'Export final 16:9 horizontal sequence with clean timeline structure',
    ],
    deliverables: [
      'One edited long-form video (horizontal 16:9, full-length cut)',
      'Timeline marker notes showing pacing decisions',
    ],
    headlineBase: 'Long-Form Video Edit',
    proofNarrative: 'long-form horizontal editing from source to structured sequence',
  },
  ui_ux_designer: {
    briefContext: ['product brief', 'user objective', 'activation path'],
    materials: [
      'A self-written product brief describing a fictional B2B SaaS product and a clear activation objective',
      'A blank design canvas with pre-configured 8px grid constraints',
    ],
    baseSteps: [
      'Define the user objective and the first-value activation path',
      'Map the flow from entry point to activation, flagging friction points',
      'Sketch low-fi wireframes establishing content hierarchy for each screen',
      'Design high-fi screens with consistent components, states, and spacing',
      'Build reusable component inventory (buttons, inputs, cards, navigation)',
      'Link screens into an interactive click-through prototype',
      'Write handoff notes documenting spacing, behaviour, and responsive breakpoints',
    ],
    deliverables: [
      'High-fidelity interactive prototype (Figma or equivalent)',
      'Component inventory and spacing specification',
    ],
    headlineBase: 'SaaS Onboarding Flow',
    proofNarrative: 'UI/UX design from product brief to interactive prototype',
  },
  brand_designer: {
    briefContext: ['brand brief', 'buyer audience traits', 'positioning traits'],
    materials: [
      'A self-written brand brief for a fictional coaching or service business',
      'A reference and mood board with 5–10 visual direction samples',
    ],
    baseSteps: [
      'Analyse the brand brief to extract core positioning traits and audience expectations',
      'Build a reference and mood board exploring visual direction',
      'Select typography pairings with rationale (heading + body, licensing noted)',
      'Define colour logic (primary, secondary, accent, accessibility ratios)',
      'Explore two concept directions through identity lockups (logo + wordmark)',
      'Apply the chosen identity to 2–3 application examples (social card, slide deck cover, profile image)',
      'Document usage rules (clear space, minimum size, incorrect applications)',
      'Compile final identity presentation with concept rationale',
    ],
    deliverables: [
      'Brand identity presentation with usage rules',
      'Two application mockups (social card, slide deck cover)',
    ],
    headlineBase: 'Coach Identity System',
    proofNarrative: 'brand design from brief to identity presentation',
  },
  frontend_developer: {
    briefContext: ['requirements', 'page structure', 'mobile-first layout'],
    materials: [
      'A mock UI brief specifying pages, interactive states, and a mobile-first layout grid',
      'An initialised boilerplate environment (React, Tailwind, or vanilla HTML/CSS)',
    ],
    baseSteps: [
      'Deconstruct the layout into semantic components with clear responsibilities',
      'Build mobile-first responsive structures starting at 320px viewport',
      'Implement form fields, actions, and validation states (idle, active, error, success)',
      'Add click-to-call and enquiry action paths for service-area clarity',
      'Apply viewport-responsive typography and spacing',
      'Verify touch target accessibility (minimum 44×44px for interactive elements)',
      'Test responsive breakpoints across 320px, 768px, and 1280px viewports',
      'Deploy to public hosting domain (Vercel, Netlify, or equivalent)',
    ],
    deliverables: [
      'Working repository link with deployment URL',
      'Responsive viewport test report (3 breakpoints)',
    ],
    headlineBase: 'Local-Service Website Rebuild',
    proofNarrative: 'frontend development from requirements to deployed site',
  },
  no_code_developer: {
    briefContext: ['demonstration requirements', 'data model', 'screens and pages'],
    materials: [
      'A self-written specification for a no-code interface or product build',
      'An initialised no-code project environment (Bubble, Webflow, FlutterFlow, or equivalent)',
    ],
    baseSteps: [
      'Define data and content model (record types, fields, relationships)',
      'Build required screens and pages with navigation between them',
      'Implement form fields with input validation and state management',
      'Set up conditional visibility and role-based access where applicable',
      'Configure responsive layout rules for mobile and desktop breakpoints',
      'Test all user flows end-to-end (happy path, error states, edge cases)',
      'Record or publish a demonstration walkthrough with narration',
      'Document build decisions, custom logic, and setup instructions',
    ],
    deliverables: [
      'Published or recorded demo of the no-code build',
      'Build documentation (data model, logic, setup instructions)',
    ],
    headlineBase: 'No-Code MVP Build',
    proofNarrative: 'no-code development from specification to working demo',
  },
  automation_developer: {
    briefContext: ['workflow map', 'triggers', 'integrations'],
    materials: [
      'A self-written workflow specification with trigger criteria and integration list',
      'A sandbox testing account with mock input records',
    ],
    baseSteps: [
      'Map the workflow from trigger through branching to output destinations',
      'Configure trigger condition and inbound data schema handling',
      'Implement conditional branching for happy-path and error-path logic',
      'Set up integrations with target applications (CRM, email, database, Slack)',
      'Add duplicate-detection logic to prevent redundant records',
      'Test happy-path flow end-to-end with mock input records',
      'Test failure-path flow (missing data, timeout, integration down)',
      'Capture run evidence (execution logs, output records, notification receipts)',
    ],
    deliverables: [
      'Automated workflow with run evidence (logs, output records)',
      'Workflow documentation (trigger, branching, error handling)',
    ],
    headlineBase: 'Automated Workflow Build',
    proofNarrative: 'automation development from workflow specification to run evidence',
  },
};

function formatPresentationStructure(formatId: ProofFormat, position: string): string[] {
  switch (formatId) {
    case 'case_study':
      return ['Demonstration Brief and Context', 'Execution Stages with Constraints', 'Completed Output and Evidence', 'Limitations and Scope Notes'];
    case 'before_after':
      return ['Baseline State Capture', 'Intervention Rules and Changes Applied', 'Final State Capture', 'Side-by-Side Comparison', 'Observable Differences'];
    case 'demo_video':
      return ['Demonstration Goal', 'Recording Structure', 'Exact Sequence Shown', 'Narration Points', 'Final Export or Link'];
    case 'comparison':
      return ['Approach A Description', 'Approach B Description', 'Fixed Comparison Criteria', 'Side-by-Side Evidence', 'Observable Differences Without Ranking'];
    case 'process_walkthrough':
      return ['Process Stages Overview', 'Inputs and Outputs Per Stage', 'Decision Rules', 'Repeatable Checklist', 'Checkpoint Evidence', 'Final Process Presentation'];
    case 'educational_content':
    case 'explainer':
      return ['Concept or Problem Statement', 'Common Misconception', 'Breakdown Structure', 'Concrete Examples', 'Implementation Implications', 'Final Guide Output'];
    case 'framework':
      return ['Framework Objective', 'Named Stages or Principles', 'Input-to-Decision Logic', 'Use-Case Demonstration', 'Known Limitations'];
    case 'data_report':
      return ['Objective and Hypothesis', 'Data Source and Collection Method', 'Analysis Approach', 'Findings and Patterns', 'Limitations of Analysis'];
    case 'testimonial_equivalent':
      return ['Project Context', 'Observed Outcome', 'Process Insights', 'Key Takeaways'];
    default:
      return ['Objective', 'Approach', 'Result'];
  }
}

function formatCTA(formatId: ProofFormat): string {
  switch (formatId) {
    case 'case_study': return 'Read Case Study';
    case 'demo_video': return 'Watch Demo Video';
    case 'comparison': return 'View Side-by-Side Comparison';
    case 'before_after': return 'See Transformation';
    case 'process_walkthrough': return 'View Process Overview';
    case 'educational_content': case 'explainer': return 'Read Guide';
    case 'framework': return 'Explore Framework';
    case 'data_report': return 'View Data Report';
    case 'testimonial_equivalent': return 'View Outcome Summary';
    default: return 'View Full Project';
  }
}

function formatTitlePrefix(formatId: ProofFormat): string {
  switch (formatId) {
    case 'case_study': return 'Case Study';
    case 'demo_video': return 'Walkthrough';
    case 'comparison': return 'Comparison';
    case 'before_after': return 'Before & After';
    case 'process_walkthrough': return 'Process Overview';
    case 'educational_content': case 'explainer': return 'Guide';
    case 'framework': return 'Framework';
    case 'data_report': return 'Data Report';
    case 'testimonial_equivalent': return 'Outcome View';
    default: return 'Proof Project';
  }
}

interface FormatModifier {
  extraSteps: string[];
  extraEvidence: string[];
  extraWarnings: string[];
}

function formatModifiers(formatId: ProofFormat): FormatModifier {
  switch (formatId) {
    case 'comparison':
      return {
        extraSteps: ['Define fixed comparison criteria applying to both approaches', 'Document approach A with same scope and input constraints', 'Document approach B with same scope and input constraints', 'Capture side-by-side evidence of differences'],
        extraEvidence: ['Side-by-side comparison grid or split-screen capture', 'Per-criteria observation notes'],
        extraWarnings: ['Do not state that one approach is objectively superior without qualified evidence'],
      };
    case 'before_after':
      return {
        extraSteps: ['Capture explicit baseline before any changes', 'Define exact intervention rules', 'Capture final state after changes', 'Prepare side-by-side comparison showing observable differences'],
        extraEvidence: ['Baseline capture (screenshot, recording, or description)', 'Final state capture', 'Side-by-side comparison visual'],
        extraWarnings: ['Do not imply that visual or structural changes automatically generated business results'],
      };
    case 'demo_video':
      return {
        extraSteps: ['Define the demonstration goal for the video', 'Plan recording or walkthrough structure (sequence, narration points)', 'Record screen or timeline capture with narration', 'Export or publish the demo video', 'Annotate key decision points in the video'],
        extraEvidence: ['Demo video recording or published link', 'Annotated timeline markers or narration script'],
        extraWarnings: [],
      };
    case 'case_study':
      return {
        extraSteps: ['Document demonstration brief and context', 'State objective and constraints', 'Structure execution into stages with evidence per stage', 'Capture completed output with limitations noted'],
        extraEvidence: ['Completed output screenshots or recordings', 'Execution-stage documentation'],
        extraWarnings: [],
      };
    case 'process_walkthrough':
      return {
        extraSteps: ['Map all process stages with inputs and outputs per stage', 'Define decision rules at each stage', 'Create a repeatable checklist or system diagram', 'Capture checkpoint evidence at each stage'],
        extraEvidence: ['Process flow diagram or checklist', 'Checkpoint evidence per stage (screenshots, logs, outputs)'],
        extraWarnings: [],
      };
    case 'educational_content':
    case 'explainer':
      return {
        extraSteps: ['Define the exact concept or problem to explain', 'Identify common misconception or constraint', 'Structure breakdown with concrete examples', 'Write implementation implications section', 'Produce final guide or explainer output'],
        extraEvidence: ['Final guide or explainer document', 'Supporting examples or diagrams'],
        extraWarnings: [],
      };
    case 'data_report':
      return {
        extraSteps: ['Define hypothesis and data source', 'Collect and document data with collection method', 'Analyse data for patterns and findings', 'Document limitations of data and analysis'],
        extraEvidence: ['Data source documentation', 'Analysis output (charts, tables, findings)', 'Limitations section'],
        extraWarnings: ['Do not claim statistical significance without proper methodology'],
      };
    case 'framework':
      return {
        extraSteps: ['Define framework objective and scope', 'Name each stage or principle with logic', 'Demonstrate input-to-decision logic per stage', 'Apply framework to a use-case example', 'Document known limitations'],
        extraEvidence: ['Framework diagram or stage map', 'Use-case demonstration output'],
        extraWarnings: [],
      };
    default:
      return { extraSteps: [], extraEvidence: [], extraWarnings: [] };
  }
}

interface GapModifier {
  scenarioExtra: string;
  stepsInsert: string[];
  processInsert: string[];
  evidenceInsert: string[];
  portfolioModifier: string;
}

function gapModifiers(theme: string, profile: ServiceProfile, gapTitle: string, buyer: string): GapModifier {
  const t = theme;
  if (t === 'recurring_consistency') {
    return {
      scenarioExtra: `The project must prove repeated output quality — show at least two cycles of work with shared rules, templates, or checkpoints applied identically.`,
      stepsInsert: ['Define shared template or ruleset applied to all cycles', 'Execute first output cycle using the template', 'Execute second output cycle using identical template', 'Compare outputs across cycles for structural consistency'],
      processInsert: ['How template rules ensure consistency across repeated cycles', 'How exceptions or edge cases are handled without breaking consistency'],
      evidenceInsert: ['Consistency comparison across multiple cycles', 'Template or ruleset documentation'],
      portfolioModifier: 'consistent',
    };
  }
  if (t === 'coaching_business') {
    return {
      scenarioExtra: `The work must demonstrate understanding of how coaches build trust, attract clients, and convert content into consultation opportunities.`,
      stepsInsert: [],
      processInsert: ['How the work supports educational authority and trust building', 'How the content-to-CTA relationship maps to the coaching consultation journey'],
      evidenceInsert: ['Annotation showing how decisions map to coaching trust-building', 'Notes on educational authority and consultation path design'],
      portfolioModifier: 'coach-aligned',
    };
  }
  if (t === 'attention_retention') {
    return {
      scenarioExtra: `The project must prove retention-focused decisions — show hook selection, pacing changes, and moment rejection choices explicitly.`,
      stepsInsert: ['Mark candidate hook moments and select the strongest opening', 'Document why certain source moments were rejected or moved', 'Annotate pacing decisions (cuts, B-roll inserts, audio transitions)'],
      processInsert: ['Why specific moments were selected or rejected', 'How pacing rules were derived from retention goals'],
      evidenceInsert: ['Hook selection rationale with alternative candidates', 'Pacing decision annotations on timeline'],
      portfolioModifier: 'retention-optimised',
    };
  }
  if (t === 'saas_metrics') {
    return {
      scenarioExtra: `The design decisions must connect to a stated activation objective — show how the flow guides users to first value. Do not invent analytics data.`,
      stepsInsert: ['Define the activation objective that new users must reach', 'Map the current user flow from entry to activation', 'Identify friction points delaying activation', 'Redesign flow to reduce friction to activation'],
      processInsert: ['How each design decision connects to the activation objective', 'Where friction points were identified and how they were addressed'],
      evidenceInsert: ['Activation flow map with friction points flagged', 'Before-and-after flow comparison'],
      portfolioModifier: 'activation-focused',
    };
  }
  if (t === 'local_acquisition') {
    return {
      scenarioExtra: `The work must show local-intent structure — service-area clarity, click-to-call access, enquiry path, and trust or review placement that drives nearby customer action.`,
      stepsInsert: ['Identify service-area and local-intent content structure', 'Place click-to-call and enquiry actions prominently on mobile', 'Design trust or review placement visible to nearby visitors', 'Test complete enquiry path from landing to submission'],
      processInsert: ['How service-area clarity and local-intent structure drive nearby customer action', 'Why trust and review placement decisions matter for local conversion'],
      evidenceInsert: ['Enquiry path screenshots (click-to-call, form, confirmation)', 'Local-intent structure annotations'],
      portfolioModifier: 'location-aware',
    };
  }
  if (t === 'early_stage_constraints') {
    return {
      scenarioExtra: `Work within early-stage constraints — limited scope, aggressive timeline, changing requirements, and documented trade-offs.`,
      stepsInsert: ['Define the minimum viable scope for demonstration', 'Document trade-off decisions made under time or scope constraints', 'Show how requirements changed during execution and how the approach adapted'],
      processInsert: ['How scope constraints and trade-off decisions were managed', 'How changing requirements were absorbed without full replanning'],
      evidenceInsert: ['Scope and trade-off decision log', 'Before-and-after of requirement change adaptation'],
      portfolioModifier: 'constraint-aware',
    };
  }
  if (t === 'mechanism_proof') {
    return {
      scenarioExtra: `Build an honest baseline comparison or process demonstration showing how the mechanism changes process or output.`,
      stepsInsert: ['Define baseline approach (standard or alternative method)', 'Apply the mechanism to the same scope and input', 'Capture observable differences in process or output', 'Present comparison without claiming superiority'],
      processInsert: ['How the mechanism changes the process or final output', 'What observable differences exist between the mechanism and the baseline'],
      evidenceInsert: ['Baseline output alongside mechanism output', 'Observable differences documented per fixed criteria'],
      portfolioModifier: 'mechanism-demonstrated',
    };
  }
  if (t === 'brief_to_finished') {
    return {
      scenarioExtra: `Show end-to-end ownership from brief interpretation through final delivery with clear stage transitions.`,
      stepsInsert: ['Document the initial brief and your interpretation', 'Break the work into clear stages with outputs per stage', 'Show how each stage builds on the previous one', 'Present final output alongside initial brief for comparison'],
      processInsert: ['How the brief was interpreted and translated into execution stages', 'How each stage output informed the next phase'],
      evidenceInsert: ['Initial brief alongside final output comparison', 'Stage-transition documentation'],
      portfolioModifier: 'end-to-end',
    };
  }
  if (t === 'production_readiness') {
    return {
      scenarioExtra: `The output must be production-ready — deployed, tested, and documented for real use.`,
      stepsInsert: ['Define production-readiness criteria for the output', 'Test output against production-readiness criteria', 'Document any known limitations or edge cases not addressed'],
      processInsert: ['What production-readiness criteria were defined and why', 'How each criterion was verified'],
      evidenceInsert: ['Production-readiness checklist with verification results', 'Deployment or live-output link'],
      portfolioModifier: 'production-ready',
    };
  }
  if (t === 'purposeful_work') {
    return {
      scenarioExtra: `Show design thinking — walk through the decisions that connect the work to a real problem, not just aesthetic choices.`,
      stepsInsert: ['Define the real problem the work addresses', 'Document decision alternatives considered and why each was chosen or rejected', 'Show how decisions map back to the problem'],
      processInsert: ['How each design or build decision connects to the stated problem', 'What alternatives were considered and why they were rejected'],
      evidenceInsert: ['Decision log with alternatives and rationale', 'Problem-to-decision mapping notes'],
      portfolioModifier: 'problem-driven',
    };
  }
  return {
    scenarioExtra: `Prove capability through concrete execution.`,
    stepsInsert: [],
    processInsert: ['Why this approach was chosen for this specific credibility gap'],
    evidenceInsert: [],
    portfolioModifier: 'capability-demonstrated',
  };
}

function buildPortfolioCopy(
  profile: ServiceProfile,
  formatId: ProofFormat,
  theme: string,
  gapTitle: string,
  buyer: string,
  position: string,
): { headline: string; description: string; proofStatement: string; cta: string } {
  const gm = gapModifiers(theme, profile, gapTitle, buyer);
  const buyerName = buyer;

  let headline: string;

  if (theme === 'recurring_consistency') {
    if (profile.headlineBase.includes('Content Cycle')) {
      headline = `From One Lesson to a Consistent ${profile.headlineBase}`;
    } else {
      headline = `Building ${capitalize(profile.headlineBase)} with Consistent Repeat Cycles`;
    }
  } else if (theme === 'coaching_business') {
    if (buyerName === 'Coaches') {
      const coachPrefix = gm.portfolioModifier === 'coach-aligned' && !profile.headlineBase.toLowerCase().includes('coach') ? 'a Coach-Aligned ' : '';
      headline = `Creating ${coachPrefix}${profile.headlineBase} from a Demonstration Brief`;
    } else {
      headline = `Building ${profile.headlineBase} for ${buyerName} Business Dynamics`;
    }
  } else if (theme === 'attention_retention') {
    if (profile.headlineBase.includes('Cycle')) {
      headline = `Comparing Two Retention-Pacing Structures on the Same Source Material`;
    } else {
      headline = `Applying Retention-Focused Pacing Decisions to ${profile.headlineBase}`;
    }
  } else if (theme === 'saas_metrics') {
    headline = `Mapping ${profile.headlineBase} Around a Stated Activation Objective`;
  } else if (theme === 'local_acquisition') {
    headline = `Rebuilding a Local-Service Enquiry Path for Mobile Visitors`;
  } else if (theme === 'early_stage_constraints') {
    headline = `Building ${profile.headlineBase} Under Early-Stage Product Constraints`;
  } else if (theme === 'mechanism_proof') {
    headline = `Comparing Two Approaches to ${profile.headlineBase}`;
  } else if (theme === 'brief_to_finished') {
    headline = `From Demonstration Brief to Completed ${profile.headlineBase}`;
  } else if (theme === 'production_readiness') {
    headline = `Building a Production-Ready ${profile.headlineBase}`;
  } else if (theme === 'purposeful_work') {
    headline = `Designing ${profile.headlineBase} Around a Stated Business Problem`;
  } else {
    headline = `${capitalize(profile.headlineBase)} — ${capitalize(gm.portfolioModifier)} Project`;
  }

  const formatLabel = formatId.replace(/_/g, ' ');

  let description: string;
  if (theme === 'recurring_consistency') {
    description = `A two-cycle demonstration showing consistent output quality through shared templates and repeatable checkpoints, framed for ${buyerName}.`;
  } else if (theme === 'coaching_business') {
    description = `A self-initiated project demonstrating educational authority and trust-building for coaching clients, using ${profile.proofNarrative}.`;
  } else if (theme === 'attention_retention') {
    description = `A retention-focused edit demonstrating hook selection, pacing decisions, and moment-rejection rationale, framed for ${buyerName}.`;
  } else if (theme === 'saas_metrics') {
    description = `A design demonstration mapping ${profile.headlineBase.toLowerCase()} to a stated activation objective with clear flow decisions.`;
  } else if (theme === 'local_acquisition') {
    description = `A local-service enquiry path rebuild with mobile-first structure, click-to-call access, and trust placement for nearby visitors.`;
  } else if (theme === 'early_stage_constraints') {
    description = `A constraint-aware build demonstrating scope decisions, trade-off documentation, and adaptation under early-stage limitations.`;
  } else if (theme === 'mechanism_proof') {
    description = `An honest baseline comparison showing how a specific mechanism changes process or output, without superiority claims.`;
  } else if (theme === 'brief_to_finished') {
    description = `An end-to-end project from brief interpretation through stage-gated delivery, showing clear ownership and output progression.`;
  } else if (theme === 'production_readiness') {
    description = `A production-ready build verified against defined criteria with deployment, testing, and limitation documentation.`;
  } else if (theme === 'purposeful_work') {
    description = `A problem-driven build showing how each design decision connects to a stated real business problem with alternatives documented.`;
  } else if (theme === 'platform_expertise') {
    description = `A platform-specific demonstration showing adaptation to platform constraints and audience expectations for ${buyerName}.`;
  } else {
    description = `A self-initiated ${formatLabel} demonstrating ${profile.proofNarrative} for ${buyerName}.`;
  }

  let proofStatement: string;
  if (position === 'builder') {
    proofStatement = `Shows hands-on execution of ${profile.proofNarrative} in a ${formatLabel} format with documented decisions and verifiable outputs.`;
  } else if (position === 'auditor') {
    proofStatement = `Shows diagnostic evaluation of existing approaches with structured findings, gap identification, and clear evaluation criteria.`;
  } else if (position === 'deconstructor') {
    proofStatement = `Shows analytical breakdown of a process into transferable principles with documented reasoning and application notes.`;
  } else {
    proofStatement = `Shows personal workflow standards applied to ${profile.proofNarrative} with repeatable output quality and decision documentation.`;
  }

  return {
    headline,
    description,
    proofStatement,
    cta: formatCTA(formatId),
  };
}

function buildChecklist(
  steps: string[],
  evidence: string[],
  formatId: ProofFormat,
  serviceKey: ServiceKey,
  theme: string,
): string[] {
  const items: string[] = [];

  steps.forEach((step) => {
    items.push(`Execute: ${step}`);
  });

  evidence.forEach((ev) => {
    items.push(`Capture: ${ev}`);
  });

  if (serviceKey === 'short_form_editor' || serviceKey === 'video_editor') {
    items.push('Key source moments marked with timestamps');
    items.push('Selected moments ranked by engagement or teaching value');
    items.push('Final exports checked for consistent style across outputs');
    items.push('Independent demonstration label added to presentation');
  } else if (serviceKey === 'brand_designer') {
    items.push('Brand traits defined from brief analysis');
    items.push('Mood and reference board completed');
    items.push('At least two concept directions explored');
    items.push('Typography and colour rules documented');
    items.push('Identity applied to at least two application examples');
  } else if (serviceKey === 'ui_ux_designer') {
    items.push('Activation objective defined');
    items.push('Flow map completed with friction points flagged');
    items.push('Low-fi wireframes reviewed before high-fi build');
    items.push('Component inventory documented');
    items.push('Prototype links tested for navigation completeness');
  } else if (serviceKey === 'frontend_developer') {
    items.push('Mobile-first responsive layout verified at 320px');
    items.push('Form actions and validation tested end-to-end');
    items.push('Touch targets meet 44×44px minimum');
    items.push('Deployment URL accessible from public network');
    items.push('Viewport test report completed for all breakpoints');
  } else if (serviceKey === 'no_code_developer') {
    items.push('Required pages or screens built and navigable');
    items.push('Form states tested (idle, active, error, success)');
    items.push('Responsive layouts checked on mobile and desktop');
    items.push('Demo published or recorded with narration');
  } else if (serviceKey === 'automation_developer') {
    items.push('Trigger configured and tested with mock data');
    items.push('Happy-path flow tested end-to-end');
    items.push('Failure-path flow tested with error conditions');
    items.push('Execution logs or output records captured');
  }

  if (theme === 'recurring_consistency') {
    items.push('Outputs from two or more cycles compared for consistency');
  }
  if (theme === 'attention_retention') {
    items.push('Hook selection rationale documented');
    items.push('Rejected moments listed with reasoning');
  }
  if (theme === 'local_acquisition') {
    items.push('Click-to-call or enquiry path tested on mobile viewport');
  }
  if (theme === 'early_stage_constraints') {
    items.push('Trade-off decisions logged with rationale');
  }
  if (theme === 'mechanism_proof') {
    items.push('Baseline and mechanism outputs compared side-by-side');
    items.push('No superiority claim made in presentation');
  }

  if (formatId === 'comparison') {
    items.push('Fixed comparison criteria defined before execution');
    items.push('No superiority claim made in presentation');
  }
  if (formatId === 'before_after') {
    items.push('Baseline captured before any changes applied');
    items.push('No business-results claim made from visual changes');
  }

  return items.slice(0, 14);
}

export function generateProofAsset(
  priority: { id: string; gapTitle: string; gapDescription: string; recommendedFormat: ProofFormat },
  ctx: PriorityContext,
): ProofAsset {
  const formatId = priority.recommendedFormat;
  const buyer = buyerLabel(ctx.marketId);
  const position = ctx.authorityPosition || 'builder';
  const offerType = ctx.offerType || 'one_time_project';
  const svcKey = serviceKey(ctx.serviceId);
  const profile = SERVICE_PROFILES[svcKey];
  const theme = gapTheme(priority.gapTitle);
  const gm = gapModifiers(theme, profile, priority.gapTitle, buyer);
  const fm = formatModifiers(formatId);

  let selectedSteps: string[] = [];

  if (gm.stepsInsert.length > 0) {
    selectedSteps.push(...gm.stepsInsert);
  }
  selectedSteps.push(...profile.baseSteps);

  if (fm.extraSteps.length > 0) {
    selectedSteps.push(...fm.extraSteps);
  }

  if (offerType === 'retainer') {
    selectedSteps.push('Define shared template or ruleset applied across cycles');
    selectedSteps.push('Execute first output cycle using the template');
    selectedSteps.push('Execute second output cycle using identical template');
    selectedSteps.push('Compare outputs across cycles for structural consistency');
  } else if (offerType === 'one_time_project') {
    selectedSteps.push('Perform final quality review matching original requirements');
    selectedSteps.push('Prepare final presentation or handoff with implementation notes');
  } else if (offerType === 'milestone_based') {
    selectedSteps.push('Define verification criteria for each milestone');
    selectedSteps.push('Document intermediate output per milestone');
    selectedSteps.push('Present final milestone with cumulative output');
  }

  let evidence: string[] = [];
  if (gm.evidenceInsert.length > 0) {
    evidence.push(...gm.evidenceInsert);
  }
  if (fm.extraEvidence.length > 0) {
    evidence.push(...fm.extraEvidence);
  }
  if (evidence.length === 0) {
    evidence.push('Completed output capture (screenshot, recording, or file link)');
    evidence.push('Execution-stage documentation');
  }

  let processEvidence: string[] = [];
  if (gm.processInsert.length > 0) {
    processEvidence.push(...gm.processInsert);
  }
  if (processEvidence.length === 0) {
    processEvidence.push('Why this execution approach was chosen for the credibility gap');
  }

  let warnings: string[] = [
    'Do not imply this was paid or commercial client work',
    'Do not manufacture fake revenue, conversions, or business outcomes',
    'Do not claim this was built for a live commercial brand',
  ];
  if (fm.extraWarnings.length > 0) {
    warnings.push(...fm.extraWarnings);
  }
  if (position === 'auditor') {
    warnings.push('Do not claim access to private internal analytics or proprietary metrics');
  } else if (position === 'practitioner') {
    warnings.push('Do not claim these internal standards guarantee specific client business metrics');
  } else if (position === 'deconstructor') {
    warnings.push('Do not claim that you executed the original work being analysed');
  }

  let scenarioParts: string[] = [];
  scenarioParts.push(`Create a self-initiated demonstration project targeting a typical ${buyerLower(ctx.marketId)} scenario.`);
  if (gm.scenarioExtra) {
    scenarioParts.push(gm.scenarioExtra);
  }
  if (offerType === 'retainer') {
    scenarioParts.push('Structure the project to show repeat cycles, template consistency, and quality maintained across iterations.');
  } else if (offerType === 'one_time_project') {
    scenarioParts.push('Structure the project as a linear progression from initial brief to completed handoff.');
  }
  const scenario = scenarioParts.join(' ');

  const portfolio = buildPortfolioCopy(profile, formatId, theme, priority.gapTitle, buyer, position);
  const checklist = buildChecklist(selectedSteps, evidence, formatId, svcKey, theme);

  const businessProblem = priority.gapDescription;

  return {
    id: `asset_${priority.id}`,
    priorityId: priority.id,
    title: `${formatTitlePrefix(formatId)}: ${priority.gapTitle}`,
    assetType: formatId,
    credibilityGapProved: priority.gapTitle,
    targetAudience: buyer,
    businessProblem,
    scenario,
    startingMaterial: [...profile.materials],
    executionSteps: selectedSteps,
    deliverables: [...profile.deliverables],
    evidenceToCapture: evidence,
    processToDocument: processEvidence,
    whatNotToClaim: warnings,
    presentationStructure: formatPresentationStructure(formatId, position),
    portfolioCopy: {
      headline: portfolio.headline,
      description: portfolio.description,
      proofStatement: portfolio.proofStatement,
      cta: portfolio.cta,
    },
    completionChecklist: checklist,
    sourcePriorityFingerprint: calculatePriorityFingerprint(priority),
    isCustom: false,
    isAccepted: false,
  };
}
