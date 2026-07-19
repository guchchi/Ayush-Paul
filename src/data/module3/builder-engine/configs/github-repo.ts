/**
 * GitHub Repository Builder Config – Technical Interaction Model
 *
 * Covers: comparison, framework, data_report (technical forms)
 * Asset: A live repository that serves as proof of technical competence
 */

import type { BuilderConfig, BuilderContext, FieldValues, OutputBrief } from '../types';
import {
  fmt, marketAssumptions,
  runSpecificity, runClarity, runCredibility, runBusinessRelevance, runDifferentiation,
  runEcosystemFit, runBuyerConfidence,
  buildAuthorityScore, scoreToDimension, signalFromScore,
} from '../engine';

export const githubRepoConfig: BuilderConfig = {
  proofFormat: 'comparison',
  label: 'GitHub / Code Repository',
  interactionModel: 'technical',

  scoutOptions: [
    {
      id: 'existing',
      label: 'I have an existing repo I can optimize and present',
      description: 'A real project, client work, or open-source contribution worth highlighting.',
    },
    {
      id: 'partial',
      label: 'I have code but the README is weak or it\'s not well structured',
      description: 'The work exists but the presentation doesn\'t communicate its value yet.',
    },
    {
      id: 'scratch',
      label: 'I need to build a demonstration project',
      description: 'A purpose-built repo that showcases your specific technical approach.',
    },
  ],

  stages: [
    {
      id: 'project',
      label: 'The Project',
      description: 'What is this repo, and why does it matter to a buyer?',
      fields: [
        {
          id: 'repoName',
          label: 'Repository / project name',
          hint: 'Name it after what it does, not what it is. "shopify-checkout-optimizer" beats "my-portfolio-project."',
          type: 'text',
          placeholder: (ctx) => `e.g. ${ctx.nicheId?.replace(/_/g, '-') ?? 'your-project'}-demo`,
          generateDefault: (ctx) =>
            ctx.nicheId ? `${ctx.nicheId.replace(/_/g, '-')}-example` : '',
        },
        {
          id: 'whatItSolves',
          label: 'What business problem does this code solve?',
          hint: 'Buyers evaluate code from the lens of "what does this fix for my business?" not "what technology did you use?" Lead with the problem.',
          type: 'textarea',
          placeholder: () => 'e.g. Reduces Shopify checkout abandonment by handling cart state edge cases that Shopify\'s native SDK misses',
          generateDefault: (ctx) => {
            const { doubt } = marketAssumptions(ctx.marketId);
            return `Solves: ${doubt.replace('whether you ', '').replace('whether your work ', '')} – demonstrating measurable technical impact.`;
          },
        },
        {
          id: 'techStack',
          label: 'Tech stack (the key technologies, not everything)',
          hint: 'List 3–5 technologies that are most relevant to your target client. Don\'t list every library.',
          type: 'text',
          placeholder: () => 'e.g. Next.js, TypeScript, Supabase, Stripe API',
          generateDefault: (ctx) => ctx.deliverables.slice(0, 3).join(', '),
        },
        {
          id: 'repoType',
          label: 'What type of repository is this?',
          type: 'radio',
          options: [
            { value: 'client_project', label: 'Real client project (anonymised or with permission)' },
            { value: 'open_source', label: 'Open source project / library' },
            { value: 'demo', label: 'Purpose-built demonstration' },
            { value: 'tool', label: 'A tool or CLI I built for myself or others' },
            { value: 'template', label: 'A starter template or boilerplate' },
          ],
          generateDefault: (_, scout) =>
            scout === 'existing' ? 'client_project' : scout === 'scratch' ? 'demo' : 'demo',
        },
      ],
    },
    {
      id: 'impact',
      label: 'The Impact',
      description: 'What does this repo prove about your technical capability? This is the hardest part for most developers to articulate.',
      fields: [
        {
          id: 'keyMetric',
          label: 'What measurable result did this produce?',
          hint: 'Performance benchmark, load time reduction, user growth, bundle size savings, API response improvement. Anything with a number.',
          type: 'textarea',
          placeholder: () => 'e.g. Reduced page load from 4.2s to 0.9s, or handles 10k concurrent users, or cut API response by 40%',
          generateDefault: (ctx) => {
            if (ctx.scores.impact < 40) return '[Critical: Add a specific performance or business metric here – this is your biggest trust gap]';
            return '';
          },
        },
        {
          id: 'architectureDecision',
          label: 'What\'s the most important technical decision you made in this project?',
          hint: 'This is what separates you from a developer who follows tutorials. Describe a choice that wasn\'t obvious – and why you made it.',
          type: 'textarea',
          placeholder: () => 'e.g. "Chose edge functions over traditional serverless to eliminate cold starts for a real-time dashboard"',
        },
        {
          id: 'liveLink',
          label: 'Live demo or deployment link (optional but strongly recommended)',
          hint: 'A URL a buyer can visit right now dramatically increases trust. "See it live" outperforms "read the code."',
          type: 'text',
          optional: true,
          placeholder: () => 'https://your-demo.vercel.app or similar',
        },
      ],
    },
    {
      id: 'presentation',
      label: 'The README',
      description: 'The README is your sales page. Most technical portfolios fail here – great code, terrible presentation.',
      fields: [
        {
          id: 'readmeLead',
          label: 'README opening line (the one sentence that explains this)',
          hint: 'A buyer landing on your repo decides in 2 seconds whether to keep reading. What\'s the single most important thing to say?',
          type: 'textarea',
          placeholder: () => 'e.g. "A Next.js app that reduced checkout abandonment by 31% for a mid-market ecommerce brand."',
          generateDefault: (ctx) => {
            const service = fmt(ctx.serviceId);
            return `A ${service} project demonstrating [your key outcome] for ${fmt(ctx.marketId)} clients.`;
          },
        },
        {
          id: 'screenshotsToTake',
          label: 'What screenshots or visuals will you add to the README?',
          hint: 'GitHub repos with visuals get 3x more time from visitors. Even one good screenshot matters.',
          type: 'radio',
          options: [
            { value: 'ui_screenshots', label: 'UI / interface screenshots' },
            { value: 'before_after', label: 'Before-after comparison (metric or visual)' },
            { value: 'architecture', label: 'Architecture diagram or system design' },
            { value: 'terminal', label: 'Terminal output / benchmarks / test results' },
            { value: 'none', label: 'Code only – no visuals' },
          ],
          generateDefault: () => 'ui_screenshots',
        },
      ],
    },
  ],

  generateStrategicRationale(ctx: BuilderContext): string {
    const { alreadyBelieve, doubt } = marketAssumptions(ctx.marketId);
    const market = fmt(ctx.marketId);
    const service = fmt(ctx.serviceId);
    const craftScore = ctx.scores.craft;
    const impactScore = ctx.scores.impact;

    const primaryGap = impactScore <= craftScore ? 'impact' : 'craft';
    const gapScore = primaryGap === 'impact' ? impactScore : craftScore;

    return `Your ${primaryGap === 'impact' ? 'Impact' : 'Craft'} score is ${gapScore}/100.\n\n${market} buyers evaluating ${service} candidates don't just want to see that you can code – they already assume ${alreadyBelieve}. What they can't determine from a resume or LinkedIn is ${doubt}.\n\nA GitHub repository proves this in a way no PDF can: it shows the actual code, the actual decisions, and (with a good README) the actual business outcome. It's the closest thing to a live reference without needing to talk to a client.\n\nThis is ${ctx.gapRank === 1 ? 'your highest priority' : `Priority #${ctx.gapRank}`} because ${ctx.gapReason.replace(/^Priority \d: /, '').toLowerCase()}.`;
  },

  computeAdvisorSignals(fields: FieldValues, ctx: BuilderContext) {
    const signals = [];

    if (fields.whatItSolves) {
      const br = runBusinessRelevance(fields.whatItSolves, ctx);
      signals.push(signalFromScore('whatItSolves', br.score, br.message));
    }
    if (fields.keyMetric) {
      const s = runSpecificity(fields.keyMetric);
      signals.push(signalFromScore('keyMetric', s.score, s.message));
    }
    if (fields.architectureDecision) {
      const d = runDifferentiation(fields.architectureDecision, ctx);
      signals.push(signalFromScore('architectureDecision', d.score, d.message));
    }
    if (fields.repoName) {
      const isDescriptive = fields.repoName.includes('-') && fields.repoName.length > 8;
      signals.push(signalFromScore('repoName', isDescriptive ? 78 : 35,
        isDescriptive
          ? 'Descriptive name – a buyer immediately understands what this does.'
          : 'Too generic. Rename to describe what it does: "shopify-checkout-optimizer" not "portfolio-project."'));
    }
    if (fields.readmeLead) {
      const c = runCredibility(fields.readmeLead);
      signals.push(signalFromScore('readmeLead', c.score, c.message));
    }

    return signals;
  },

  computeQualityScore(fields: FieldValues, ctx: BuilderContext, otherFieldSets: FieldValues[]) {
    const allText = Object.values(fields).join(' ');
    const resultText = [fields.keyMetric, fields.whatItSolves].join(' ');
    const approachText = [fields.architectureDecision, fields.whatItSolves].join(' ');
    
    const specificity = runSpecificity(resultText);
    const clarity = runClarity(allText);
    const credibility = runCredibility(resultText);
    const relevance = runBusinessRelevance(resultText, ctx);
    const diff = runDifferentiation(approachText, ctx);
    const eco = runEcosystemFit(allText, 'github', otherFieldSets);
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

  computeBuyerCheck(fields: FieldValues, ctx: BuilderContext) {
    const { primaryQuestion } = marketAssumptions(ctx.marketId);
    const hasMetric = /\d+\s*(%|k|m|\$|x|ms|seconds|times)/i.test(Object.values(fields).join(' '));
    const hasLiveLink = !!fields.liveLink && fields.liveLink.startsWith('http');
    const hasBusinessProblem = !!fields.whatItSolves && fields.whatItSolves.length > 30;
    const hasDecision = !!fields.architectureDecision && fields.architectureDecision.length > 30;

    const questions = [
      {
        question: 'Does this immediately tell me what business problem it solves?',
        passes: hasBusinessProblem,
        explanation: hasBusinessProblem
          ? 'Yes â€" leads with the business problem, not the technology.'
          : 'No â€" most repos lead with tech stack. This one needs to lead with the business outcome.',
      },
      {
        question: 'Is there a measurable result I can trust?',
        passes: hasMetric,
        explanation: hasMetric
          ? 'Yes â€" contains a specific, verifiable metric.'
          : `No â€" ${fmt(ctx.marketId)} buyers need a number to trust this. Add a benchmark, performance metric, or business result.`,
      },
      {
        question: primaryQuestion,
        passes: hasMetric && hasBusinessProblem,
        explanation: hasMetric && hasBusinessProblem
          ? `Yes â€" this would convince a ${fmt(ctx.marketId)} buyer.`
          : `Not yet â€" add the business outcome and a specific metric.`,
      },
      {
        question: 'Can I see this working right now?',
        passes: hasLiveLink,
        explanation: hasLiveLink
          ? 'Yes â€" live demo link included. This significantly increases trust.'
          : 'No â€" a live demo link triples buyer confidence. Add a Vercel, Netlify, or similar deployment.',
      },
    ];

    const blockers = questions.filter((q) => !q.passes).map((q) => q.explanation);
    return {
      buyerLabel: `${fmt(ctx.marketId)} Technical Buyer`,
      questions,
      readyToProceed: blockers.length <= 1,  // Allow 1 blocker (usually live link)
      blockers,
    };
  },

  computePublishPlatforms(ctx: BuilderContext) {
    const platforms = ['GitHub'];
    if (ctx.marketId?.includes('saas') || ctx.marketId?.includes('startup')) {
      platforms.push('Personal website (pinned project)', 'LinkedIn (featured section)');
    }
    if (ctx.deliverables.some((d) => d.toLowerCase().includes('open source'))) {
      platforms.push('Dev.to article', 'Hacker News Show HN');
    }
    platforms.push(...ctx.gapPlatforms.filter((p) => !platforms.includes(p)));
    return [...new Set(platforms)].slice(0, 4);
  },

  assembleOutput(fields: FieldValues, ctx: BuilderContext): OutputBrief {
    const service = fmt(ctx.serviceId);
    const market = fmt(ctx.marketId);
    const repoName = fields.repoName || `${service.toLowerCase().replace(/ /g, '-')}-proof`;
    const metric = fields.keyMetric || '[Add your metric]';

    const headline = `${repoName} â€" ${fields.whatItSolves?.substring(0, 60) ?? `${service} proof of concept`}`;
    const description = `${service} repository demonstrating ${metric} for ${market} clients. ${fields.architectureDecision?.substring(0, 100) ?? ''}`;
    const proofStatement = metric;
    const cta = fields.liveLink ? `View live demo â†' ${fields.liveLink}` : `View on GitHub â†'`;

    const platforms = githubRepoConfig.computePublishPlatforms(ctx);
    const platformTips: Record<string, string> = {
      GitHub: 'Pin this repo on your profile. Add a compelling description and website link. Use topics/tags for discoverability.',
      'Personal website (pinned project)': 'Embed the README lead + metric as a portfolio card. Link to the repo and live demo.',
      'LinkedIn (featured section)': 'Add to Featured. Screenshot the README with the metric visible as the preview image.',
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
        presentationStructure: ['Project Brief', 'Technical Decisions', 'Impact Metrics', 'Live Demo', 'Code'],
        deliverables: [
          `GitHub repository: ${repoName}`,
          fields.liveLink ? `Live demo: ${fields.liveLink}` : 'Live demo: [pending]',
          `README with ${fields.screenshotsToTake ? fmt(fields.screenshotsToTake) : 'visuals'}`,
        ],
      },
    };
  },
};
