import { ProofAsset, ProofPriority } from '../../types/module3';
import type { PriorityContext, ProofFormat } from './proof-priorities';

export function calculatePriorityFingerprint(priority: ProofPriority): string {
  return JSON.stringify({
    id: priority.id,
    gapTitle: priority.gapTitle,
    gapDescription: priority.gapDescription,
    recommendedFormat: priority.recommendedFormat,
  });
}

function getBuyerLabel(marketId: string | null): string {
  const labels: Record<string, string> = {
    youtube_creators: 'YouTube creators',
    creators: 'creators',
    coaches: 'coaches',
    agencies: 'agencies',
    local_businesses: 'local businesses',
    saas_startups: 'SaaS startups',
    startups: 'startups',
  };
  return (marketId && labels[marketId]) ? labels[marketId] : (marketId || 'your target market');
}

export function generateProofAsset(
  priority: ProofPriority,
  ctx: PriorityContext
): ProofAsset {
  const isBuilder = ctx.authorityPosition === 'builder';
  const isAuditor = ctx.authorityPosition === 'auditor';
  const isDeconstructor = ctx.authorityPosition === 'deconstructor';
  const isPractitioner = ctx.authorityPosition === 'practitioner';
  
  const formatId = priority.recommendedFormat as ProofFormat;
  const buyer = getBuyerLabel(ctx.marketId);

  // Default Baseline Blueprint
  let title = `Proof Project: ${priority.gapTitle}`;
  let scenario = `Demonstrate expertise for ${buyer} in solving their core business problem.`;
  let startingMaterial: string[] = ['Client brief or market research', 'Access to existing materials'];
  let executionSteps: string[] = ['Analyse the requirements', 'Develop the solution', 'Review and iterate', 'Finalise deliverables'];
  let deliverables: string[] = ['Final project files'];
  let evidenceToCapture: string[] = ['Screenshots of the working product'];
  let processToDocument: string[] = ['Why this specific approach was chosen over alternatives'];
  let whatNotToClaim: string[] = [
    'Do not claim this was paid client work',
    'Do not invent fake revenue metrics or results'
  ];
  let presentationStructure: string[] = ['The Problem', 'The Approach', 'The Result'];
  let headline = priority.gapTitle;
  let description = priority.gapDescription || `A comprehensive demonstration of your service for ${buyer}.`;
  let proofStatement = 'Proven by the detailed execution and rigorous process documented in this asset.';
  let cta = 'View Full Project';
  let completionChecklist: string[] = [
    'Define the hypothetical or real scope',
    'Execute the actual work',
    'Capture evidence of the process',
    'Format for the portfolio'
  ];

  // Layer 1: Format Blueprint Modifiers
  switch (formatId) {
    case 'case_study':
      title = `Case Study: ${priority.gapTitle}`;
      scenario = `Document a specific challenge, your applied methodology, and the measurable outcome.`;
      startingMaterial = ['Project brief', 'Before/After data points'];
      executionSteps = ['Outline the problem context', 'Detail your step-by-step intervention', 'Highlight the results achieved'];
      deliverables = ['Structured Case Study Document'];
      evidenceToCapture = ['Screenshots of work in progress', 'Data charts or analytics'];
      processToDocument = ['The exact obstacles faced and how you overcame them'];
      presentationStructure = ['The Challenge', 'Our Methodology', 'The Transformation'];
      headline = `Resolving ${priority.gapTitle}`;
      cta = 'Read the Case Study';
      break;
    case 'demo_video':
      title = `Demo: ${priority.gapTitle}`;
      scenario = `Record a live demonstration showing how you build, edit, or execute your process in real time.`;
      startingMaterial = ['Screen recording software', 'Working environment setup'];
      executionSteps = ['Prepare a script or talking points', 'Record the technical demonstration', 'Edit for clarity and pacing'];
      deliverables = ['3-5 minute loom or video file'];
      evidenceToCapture = ['Live screen capture of you working', 'Voiceover explaining the "why" behind the "what"'];
      processToDocument = ['The real-time decision making during execution'];
      presentationStructure = ['What I am Building', 'The Live Demonstration', 'The Final Output'];
      headline = `Watch the Process: ${priority.gapTitle}`;
      cta = 'Watch the Video';
      break;
    case 'comparison':
      title = `Comparison: ${priority.gapTitle}`;
      scenario = `Compare a standard approach versus your optimized methodology.`;
      startingMaterial = ['Example of a poor/average approach', 'Your optimized version'];
      executionSteps = ['Identify the industry standard flaw', 'Deconstruct why it fails', 'Present your superior alternative'];
      deliverables = ['Side-by-side comparison matrix'];
      evidenceToCapture = ['Visual breakdown of differences'];
      processToDocument = ['The specific mechanics that make your approach better'];
      presentationStructure = ['The Status Quo', 'Why It Breaks', 'The Superior Alternative'];
      headline = `Optimized Approach: ${priority.gapTitle}`;
      cta = 'View the Breakdown';
      break;
    case 'process_walkthrough':
    case 'framework':
      title = `Framework: ${priority.gapTitle}`;
      scenario = `Walk through exactly how you approach and deliver work using a structured framework.`;
      startingMaterial = ['Your internal SOPs or mental models'];
      executionSteps = ['Map out the process into distinct phases', 'Document the inputs and outputs of each phase', 'Visualize the system'];
      deliverables = ['Process diagram', 'Methodology document'];
      evidenceToCapture = ['Screenshots of your system/templates', 'Workflow diagrams'];
      processToDocument = ['Why this process guarantees consistent results without relying on luck'];
      presentationStructure = ['The Core Philosophy', 'Step-by-Step System', 'Why It Works'];
      headline = `Our Methodology: ${priority.gapTitle}`;
      cta = 'Explore the System';
      break;
    case 'before_after':
      title = `Transformation: ${priority.gapTitle}`;
      scenario = `Show a clear visual or data-driven before and after state resulting from your work.`;
      startingMaterial = ['The "Before" state artifact', 'Your implemented solution'];
      executionSteps = ['Document the starting baseline', 'Apply your unique mechanism', 'Capture the improved state'];
      deliverables = ['Before and after visual asset'];
      evidenceToCapture = ['Side-by-side visual or metric comparison'];
      processToDocument = ['The exact levers pulled to create the transformation'];
      presentationStructure = ['The Baseline', 'The Intervention', 'The New Standard'];
      headline = `Before & After: ${priority.gapTitle}`;
      cta = 'See the Transformation';
      break;
    case 'explainer':
    case 'educational_content':
      title = `Explainer: ${priority.gapTitle}`;
      scenario = `Teach ${buyer} something valuable to demonstrate your domain expertise.`;
      startingMaterial = ['Deep domain knowledge', 'A common misconception to bust'];
      executionSteps = ['Identify a complex topic in the niche', 'Break it down into simple terms', 'Provide actionable takeaways'];
      deliverables = ['Educational guide or mini-course'];
      evidenceToCapture = ['Diagrams or charts simplifying the concept'];
      processToDocument = ['Your unique perspective on this common problem'];
      presentationStructure = ['The Misconception', 'The Reality', 'Actionable Steps'];
      headline = `Understanding ${priority.gapTitle}`;
      cta = 'Learn More';
      break;
    case 'testimonial_equivalent':
      title = `Outcome Analysis: ${priority.gapTitle}`;
      scenario = `Document a positive outcome or feedback loop in detail.`;
      startingMaterial = ['Beta user feedback or project metrics'];
      executionSteps = ['Aggregate the qualitative data', 'Highlight the specific value delivered', 'Format as a compelling narrative'];
      deliverables = ['Detailed outcome report'];
      evidenceToCapture = ['Snippets of feedback', 'Adoption or usage metrics'];
      processToDocument = ['How the feedback loop drove iterations'];
      presentationStructure = ['The Objective', 'The Feedback Loop', 'The Outcome'];
      headline = `Delivering Results: ${priority.gapTitle}`;
      cta = 'Read the Analysis';
      break;
    case 'data_report':
      title = `Data Report: ${priority.gapTitle}`;
      scenario = `Use data and metrics to demonstrate measurable impact in your field.`;
      startingMaterial = ['Raw data sets', 'Analytics access'];
      executionSteps = ['Query the data', 'Identify the key trends', 'Visualize the insights'];
      deliverables = ['Comprehensive data dashboard or report'];
      evidenceToCapture = ['Charts, graphs, and structured tables'];
      processToDocument = ['The methodology used to ensure data integrity'];
      presentationStructure = ['The Hypothesis', 'The Data', 'The Insights'];
      headline = `Metrics Deep Dive: ${priority.gapTitle}`;
      cta = 'View the Data';
      break;
  }

  // Layer 5: Authority Position Modifiers
  if (isBuilder) {
    whatNotToClaim.push('Do not claim this was deployed to production for a real brand');
    scenario = `Build a complete, production-ready solution for a hypothetical ${buyer}.`;
  } else if (isAuditor) {
    whatNotToClaim.push('Do not claim you have insider knowledge of their metrics');
    scenario = `Perform a deep diagnostic audit on an existing setup used by ${buyer}.`;
  } else if (isDeconstructor) {
    whatNotToClaim.push('Do not claim you ran this campaign or built this product');
    scenario = `Select a successful ${buyer} company and deconstruct why their current approach works.`;
  } else if (isPractitioner) {
    whatNotToClaim.push('Do not claim these results are guaranteed for every client');
    scenario = `Document the exact internal process used to run your own business effectively.`;
  }

  // Layer 2: Service-Family Logic (Specific overrides based on Module 1 Service)
  if (ctx.serviceId === 'short_form_editor') {
    deliverables = ['Edited short-form video (30-60s)'];
    evidenceToCapture.push('Timeline screenshots showing cuts/pacing', 'Before/after color grading');
    processToDocument.push('How pacing decisions were made to maximize retention');
    startingMaterial = ['Raw footage (downloaded or self-recorded)', 'Music and SFX libraries'];
  } else if (ctx.serviceId === 'copywriting' || ctx.serviceId === 'email_marketing') {
    deliverables = ['Completed copy document (Google Doc)'];
    evidenceToCapture.push('Research notes', 'Drafting iterations');
    processToDocument.push('The psychological hooks used and why they were chosen');
    startingMaterial = ['Market research data', 'Customer voice transcripts'];
  } else if (ctx.serviceId === 'web_design' || ctx.serviceId === 'ui_ux_design') {
    deliverables = ['Figma prototype or live staging link'];
    evidenceToCapture.push('Wireframes vs Final Design', 'Component system overview');
    processToDocument.push('How the layout drives the core conversion metric');
  }

  return {
    id: `asset_${priority.id}`,
    priorityId: priority.id,
    title,
    assetType: formatId,
    credibilityGapProved: priority.gapTitle,
    targetAudience: buyer,
    businessProblem: ctx.coreTrustPromise || 'Lack of credible demonstration of skills',
    scenario,
    startingMaterial,
    executionSteps,
    deliverables,
    evidenceToCapture,
    processToDocument,
    whatNotToClaim,
    presentationStructure,
    portfolioCopy: {
      headline,
      description,
      proofStatement,
      cta,
    },
    completionChecklist,
    sourcePriorityFingerprint: calculatePriorityFingerprint(priority),
    isCustom: false,
    isAccepted: false,
  };
}
