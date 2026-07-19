/**
 * Case Study Builder Config â€" Narrative Interaction Model
 *
 * Covers: case_study, process_walkthrough, design_case_study, educational_content
 * Asset: A written narrative structured as Situation â†' Process â†' Outcome
 */

import type { BuilderConfig, BuilderContext, FieldValues, AdvisorSignal, AuthorityScore, BuyerCheck, OutputBrief } from '../types';
import {
  fmt, marketAssumptions,
  runSpecificity, runClarity, runCredibility, runBusinessRelevance, runDifferentiation,
  runEcosystemFit, runBuyerConfidence,
  buildAuthorityScore, scoreToDimension, signalFromScore,
} from '../engine';

export const caseStudyConfig: BuilderConfig = {
  proofFormat: 'case_study',
  label: 'Case Study',
  interactionModel: 'narrative',

  scoutOptions: [
    {
      id: 'existing',
      label: 'I have a real project I can document',
      description: "You've delivered work for a client or built something with measurable results.",
    },
    {
      id: 'partial',
      label: 'I have material but no documented outcome',
      description: "You have the project but haven't captured the results or written it up yet.",
    },
    {
      id: 'scratch',
      label: 'I need to create a demonstration project',
      description: "You'll build a proof-of-concept specifically to demonstrate your approach.",
    },
  ],

  stages: [
    {
      id: 'situation',
      label: 'The Situation',
      description: 'Who was the client? What problem did they have before working with you?',
      fields: [
        {
          id: 'clientContext',
          label: 'Client or project type',
          hint: 'Describe who this is for. Keep it specific: "Series A SaaS company building a B2B sales tool" not just "a startup."',
          type: 'text',
          placeholder: (ctx) => `e.g. ${fmt(ctx.marketId)} company building a ${ctx.nicheId ? fmt(ctx.nicheId) : 'digital product'}`,
          generateDefault: (ctx, scout) => {
            if (scout === 'scratch') return `${fmt(ctx.marketId)} demonstration project`;
            return '';
          },
        },
        {
          id: 'problemStatement',
          label: 'What was the specific problem?',
          hint: 'Be precise. "Their onboarding flow had 68% drop-off at step 2" is better than "they had a UX problem."',
          type: 'textarea',
          placeholder: () => 'Describe the specific problem, constraint, or gap this client faced before working with you.',
          generateDefault: (ctx) => {
            const { doubt } = marketAssumptions(ctx.marketId);
            return `The client struggled to ${doubt.replace('whether you ', '')} â€" a common gap for ${fmt(ctx.marketId)} at their stage.`;
          },
        },
      ],
    },
    {
      id: 'process',
      label: 'Your Approach',
      description: 'What did you specifically do? Walk through your process â€" not the obvious, but the decisions that made the difference.',
      fields: [
        {
          id: 'approach',
          label: 'What was your approach?',
          hint: 'Focus on decisions, not tasks. "I audited X, identified Y, and redesigned Z using this principle" not "I designed the screens."',
          type: 'textarea',
          placeholder: () => 'Describe your specific methodology, key decisions, and what made your approach different.',
          generateDefault: (ctx) =>
            ctx.uniqueMechanism
              ? `Applied ${ctx.uniqueMechanism} â€" focusing on ${ctx.deliverables.slice(0, 2).join(' and ')}.`
              : '',
        },
        {
          id: 'keyDecision',
          label: 'What was the most important decision you made?',
          hint: 'The moment where your expertise changed the outcome. This is what sets you apart from a junior doing the same work.',
          type: 'textarea',
          placeholder: () => 'Describe the insight or decision that made the biggest difference in the outcome.',
        },
      ],
    },
    {
      id: 'outcome',
      label: 'The Outcome',
      description: 'What changed? This is the most important part. Be specific and measurable.',
      fields: [
        {
          id: 'result',
          label: 'What was the measurable result?',
          hint: 'Quantify the impact: "reduced onboarding drop-off from 68% to 31%" not "improved onboarding." If you don\'t have metrics, describe the specific change.',
          type: 'textarea',
          placeholder: () => 'e.g. Reduced X from Y to Z, or increased X by Y%, or delivered X within Y timeline',
          generateDefault: (ctx) => {
            if (ctx.scores.impact < 40) return 'Result: [Add specific metric â€" this is your most critical gap]';
            return '';
          },
        },
        {
          id: 'testimonialQuote',
          label: 'Client quote or feedback (optional)',
          hint: 'Even one specific sentence from the client makes this twice as convincing. Paraphrased is fine if you don\'t have exact wording.',
          type: 'textarea',
          optional: true,
          placeholder: () => '"[Specific feedback from the client about what changed]" â€" Client name/title (optional)',
        },
      ],
    },
    {
      id: 'evidence',
      label: 'The Evidence',
      description: 'What will you show as proof? This is what makes the case study real, not theoretical.',
      fields: [
        {
          id: 'evidenceType',
          label: 'What proof do you have?',
          type: 'radio',
          options: [
            { value: 'screenshots', label: 'Screenshots / before-after visuals', description: 'Before/after comparisons, deliverable screenshots' },
            { value: 'metrics', label: 'Analytics / metrics', description: 'Data screenshots, dashboard exports, reports' },
            { value: 'link', label: 'Live link or published work', description: 'A URL to the actual project or published deliverable' },
            { value: 'testimonial', label: 'Client testimonial only', description: 'Written or video feedback from the client' },
            { value: 'demo', label: 'Demo project / proof-of-concept', description: 'A demonstration you built specifically to prove this' },
          ],
          generateDefault: (_, scout) =>
            scout === 'existing' ? 'screenshots' : scout === 'partial' ? 'testimonial' : 'demo',
        },
        {
          id: 'publishUrl',
          label: 'Where will this case study live?',
          hint: 'This is what goes in your portfolio and outreach. Pick one primary location.',
          type: 'radio',
          options: [
            { value: 'notion', label: 'Notion public page' },
            { value: 'portfolio_site', label: 'Personal website / portfolio' },
            { value: 'pdf', label: 'PDF (for proposals and DMs)' },
            { value: 'linkedin', label: 'LinkedIn article or post' },
            { value: 'medium', label: 'Medium or blog' },
          ],
          generateDefault: (ctx) => ctx.gapPlatforms[0]?.toLowerCase().includes('notion') ? 'notion' : 'portfolio_site',
        },
      ],
    },
  ],

  generateStrategicRationale(ctx: BuilderContext): string {
    const { alreadyBelieve, doubt } = marketAssumptions(ctx.marketId);
    const market = fmt(ctx.marketId);
    const service = fmt(ctx.serviceId);
    const impactScore = ctx.scores.impact;
    const whichDim = impactScore < ctx.scores.craft && impactScore < ctx.scores.reliability
      ? `Impact score (${impactScore}/100) â€" your most critical trust gap`
      : `trust gap that a Case Study is best positioned to close`;

    return `Your ${whichDim}.\n\n${market} buyers who evaluate ${service} work already assume ${alreadyBelieve}. What they actively doubt is ${doubt}.\n\nA Case Study is the most direct answer because it shows a real situation, a real decision, and a real outcome â€" in exactly the format a ${market} buyer uses to justify a hiring decision. This is ${ctx.gapRank === 1 ? 'your #1 priority' : `Priority #${ctx.gapRank}`} because ${ctx.gapReason.replace(/^Priority \d: /, '').toLowerCase()}.`;
  },

  computeAdvisorSignals(fields: FieldValues, ctx: BuilderContext): AdvisorSignal[] {
    const signals: AdvisorSignal[] = [];

    if (fields.problemStatement) {
      const s = runCredibility(fields.problemStatement);
      signals.push(signalFromScore('problemStatement', s.score, s.message));
    }
    if (fields.result) {
      const s = runSpecificity(fields.result);
      signals.push(signalFromScore('result', s.score, s.message));
      const br = runBusinessRelevance(fields.result, ctx);
      if (br.score < 60) signals.push(signalFromScore('result', br.score, br.message));
    }
    if (fields.approach) {
      const d = runDifferentiation(fields.approach, ctx);
      signals.push(signalFromScore('approach', d.score, d.message));
    }
    if (fields.keyDecision) {
      const c = runClarity(fields.keyDecision);
      signals.push(signalFromScore('keyDecision', c.score, c.message));
    }

    return signals;
  },

  computeQualityScore(fields: FieldValues, ctx: BuilderContext, otherFieldSets: FieldValues[]): AuthorityScore {
    const allText = Object.values(fields).join(' ');
    const resultText = fields.result ?? '';
    const approachText = fields.approach ?? '';

    const specificity = runSpecificity(resultText);
    const clarity = runClarity(allText);
    const credibility = runCredibility(resultText);
    const relevance = runBusinessRelevance(resultText, ctx);
    const diff = runDifferentiation(approachText, ctx);
    const eco = runEcosystemFit(allText, 'case_study', otherFieldSets);
    const buyer = runBuyerConfidence(fields, ctx);

    return buildAuthorityScore([
      scoreToDimension('Specificity',        specificity.score, specificity.message),
      scoreToDimension('Clarity',            clarity.score, clarity.message),
      scoreToDimension('Credibility',        credibility.score, credibility.message),
      scoreToDimension('Business Relevance', relevance.score, relevance.message),
      scoreToDimension('Differentiation',    diff.score, diff.message),
      scoreToDimension('Ecosystem Fit',      eco.score, eco.message),
      scoreToDimension('Buyer Confidence',   buyer.score, buyer.message),
    ]);
  },

  computeBuyerCheck(fields: FieldValues, ctx: BuilderContext): BuyerCheck {
    const { primaryQuestion, doubt } = marketAssumptions(ctx.marketId);
    const allText = Object.values(fields).join(' ');
    const hasMetric = /\d+\s*(%|k|m|\$|x|times)/i.test(allText);
    const hasProcess = /\b(because|approach|decided|chose|identified|discovered|realized)\b/i.test(allText);
    const hasCTA = /\b(see|view|read|notion|pdf|link|portfolio|available)\b/i.test(allText);

    const questions = [
      {
        question: `Does this reduce my hiring risk as a ${fmt(ctx.marketId)} buyer?`,
        passes: hasMetric || !!fields.testimonialQuote,
        explanation: hasMetric
          ? 'Yes â€" contains a specific metric that reduces uncertainty.'
          : `No â€" ${fmt(ctx.marketId)} buyers need a specific outcome to de-risk the hire. Add a measurable result.`,
      },
      {
        question: `Does this prove they understand my specific problem?`,
        passes: hasProcess,
        explanation: hasProcess
          ? 'Yes â€" documents a decision-making process, not just output.'
          : `Unclear â€" describe a specific decision or insight from the project, not just what you delivered.`,
      },
      {
        question: primaryQuestion,
        passes: hasMetric && hasProcess,
        explanation: hasMetric && hasProcess
          ? `Yes â€" this case study would convince a ${fmt(ctx.marketId)} buyer.`
          : `Not yet. The buyer is asking: "${primaryQuestion}". Address ${doubt} directly.`,
      },
      {
        question: 'Can I verify this right now?',
        passes: hasCTA,
        explanation: hasCTA
          ? 'Yes â€" there\'s a clear location where they can see the proof.'
          : 'No â€" add where this case study will live (Notion link, portfolio page, PDF).',
      },
    ];

    const blockers = questions.filter((q) => !q.passes).map((q) => q.explanation);
    return {
      buyerLabel: `${fmt(ctx.marketId)} Buyer`,
      questions,
      readyToProceed: blockers.length === 0,
      blockers,
    };
  },

  computePublishPlatforms(ctx: BuilderContext): string[] {
    const platforms = [...ctx.gapPlatforms];
    if (ctx.offerType === 'retainer') platforms.push('PDF (proposal attachment)');
    if (ctx.marketId?.includes('saas')) platforms.push('LinkedIn article');
    if (!platforms.includes('Notion')) platforms.push('Notion');
    return [...new Set(platforms)].slice(0, 4);
  },

  assembleOutput(fields: FieldValues, ctx: BuilderContext): OutputBrief {
    const market = fmt(ctx.marketId);
    const service = fmt(ctx.serviceId);
    const client = fields.clientContext || `${market} client`;
    const result = fields.result || '[Add your measurable result]';
    const approach = fields.approach || service;

    const headline = `How I helped a ${client} achieve ${result}`;
    const description = `${service} case study: ${fields.problemStatement?.substring(0, 100) || 'A real client problem'} â†' ${result}`;
    const proofStatement = fields.testimonialQuote
      ? fields.testimonialQuote
      : `Using ${approach.substring(0, 80)}, I delivered: ${result}`;
    const cta = `Read the full case study â†'`;

    const platforms = caseStudyConfig.computePublishPlatforms(ctx);
    const platformTips: Record<string, string> = {
      Notion: 'Enable "Share to web." Use /callout for the result stat. Add a cover image.',
      'PDF': 'Export from Notion. Use as a proposal attachment and DM follow-up.',
      'LinkedIn article': 'Post with a bold first line. The result stat should be in the first sentence.',
    };

    return {
      headline,
      description,
      proofStatement,
      cta,
      publishPlatforms: platforms,
      platformTips,
      module4: {
        headline,
        description,
        proofStatement,
        cta,
        presentationStructure: ['Situation', 'Approach', 'Outcome', 'Evidence', 'Testimonial'],
        deliverables: [
          fields.publishUrl ? `${fmt(fields.publishUrl)} case study` : 'Written case study',
          fields.evidenceType ? `${fmt(fields.evidenceType)}` : 'Visual proof',
        ],
      },
    };
  },
};


