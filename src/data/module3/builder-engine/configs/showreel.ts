/**
 * Showreel Builder Config â€" Sequence Interaction Model
 *
 * Covers: demo_video, before_after, educational_content (video form)
 * Asset: An ordered visual sequence â€" Hook, Best Work, CTA
 */

import type { BuilderConfig, BuilderContext, FieldValues, OutputBrief } from '../types';
import {
  fmt, marketAssumptions,
  runSpecificity, runClarity, runCredibility, runBusinessRelevance, runDifferentiation,
  runEcosystemFit, runBuyerConfidence,
  buildAuthorityScore, scoreToDimension, signalFromScore,
} from '../engine';

export const showreelConfig: BuilderConfig = {
  proofFormat: 'demo_video',
  label: 'Showreel / Demo Video',
  interactionModel: 'sequence',

  scoutOptions: [
    {
      id: 'existing',
      label: 'I have published clips I can pull from',
      description: 'You have footage on YouTube, client projects, or existing reels you can edit together.',
    },
    {
      id: 'partial',
      label: 'I have raw footage but haven\'t edited a showreel yet',
      description: 'You have the material â€" you need to select, order, and package it.',
    },
    {
      id: 'scratch',
      label: 'I need to create footage before I can build this',
      description: 'You\'ll need to produce or source clips specifically for this showreel.',
    },
  ],

  stages: [
    {
      id: 'concept',
      label: 'The Concept',
      description: 'What will this showreel prove in the first 3 seconds? Define the hook before you touch the timeline.',
      fields: [
        {
          id: 'hookConcept',
          label: 'Opening hook (first 3 seconds)',
          hint: 'Buyers make judgements instantly. What visual or audio moment grabs attention and signals your skill immediately? Don\'t start with your name or logo.',
          type: 'textarea',
          placeholder: (ctx) => `e.g. A high-retention ${fmt(ctx.serviceId)} moment that immediately shows your signature style`,
          generateDefault: (ctx) => {
            const service = fmt(ctx.serviceId);
            const market = fmt(ctx.marketId);
            return `Opens with your most visually impactful ${service} moment â€" the kind a ${market} buyer immediately recognizes as high quality.`;
          },
        },
        {
          id: 'coreProof',
          label: 'What does this showreel prove above everything else?',
          hint: 'One sentence. This is the single impression you want the viewer to walk away with.',
          type: 'textarea',
          placeholder: () => 'e.g. "This editor can hook any audience in 3 seconds and hold them for the whole video"',
          generateDefault: (ctx) => {
            const { doubt } = marketAssumptions(ctx.marketId);
            return `That you can ${doubt.replace('whether you ', '').replace('whether your work ', '')} â€" proven through real project output.`;
          },
        },
      ],
    },
    {
      id: 'sequence',
      label: 'The Sequence',
      description: 'Define your clip order and what each section must prove. The sequence IS the argument.',
      fields: [
        {
          id: 'clip1',
          label: 'Clip 1 â€" The Hook (0â€"10 seconds)',
          hint: 'Your best single moment. The one clip that makes a buyer stop scrolling. What is it, and what does it prove?',
          type: 'textarea',
          placeholder: () => 'Describe the clip and what it proves: e.g. "Fast-paced gaming edit showing reaction-timing precision"',
        },
        {
          id: 'clip2',
          label: 'Clip 2 â€" The Range Proof (10â€"30 seconds)',
          hint: 'Show something different from Clip 1. Diversity of craft or application. Avoids the "one-trick pony" objection.',
          type: 'textarea',
          placeholder: () => 'Describe a clip that shows a different dimension of your skill',
        },
        {
          id: 'clip3',
          label: 'Clip 3 â€" The Results Proof (30â€"50 seconds)',
          hint: 'Show the closest thing you have to an outcome: before/after, engagement spike, a viral moment, or a result-driven edit.',
          type: 'textarea',
          placeholder: () => 'e.g. Before-after edit showing a 40% retention improvement, or your highest-performing clip with view counts',
        },
        {
          id: 'cta',
          label: 'Closing CTA (final 5 seconds)',
          hint: 'What do you want them to do after watching? Make it specific, not "contact me."',
          type: 'text',
          placeholder: () => 'e.g. "See full breakdowns at [portfolio link]" or "DM me to see the retention data"',
          generateDefault: (ctx) =>
            `See more at [your ${ctx.gapPlatforms[0] ?? 'portfolio'}]`,
        },
      ],
    },
    {
      id: 'technical',
      label: 'Technical Brief',
      description: 'The technical decisions that will affect quality and platform performance.',
      fields: [
        {
          id: 'duration',
          label: 'Target duration',
          type: 'radio',
          options: [
            { value: '60s', label: 'Under 60 seconds', description: 'Best for Instagram Reels, TikTok, first-touch' },
            { value: '90s', label: '60â€"90 seconds', description: 'Best for YouTube Shorts, LinkedIn' },
            { value: '3m', label: '2â€"3 minutes', description: 'Best for YouTube main, Vimeo, portfolio page' },
            { value: '5m+', label: '5+ minutes', description: 'Best for detailed breakdown or documentary style' },
          ],
          generateDefault: (ctx) =>
            ctx.marketId?.includes('youtube') ? '90s' : ctx.offerType === 'project' ? '3m' : '60s',
        },
        {
          id: 'primaryPlatform',
          label: 'Primary publish platform',
          type: 'radio',
          options: [
            { value: 'youtube', label: 'YouTube', description: 'Searchable, embeddable, best for long-term discovery' },
            { value: 'vimeo', label: 'Vimeo', description: 'Professional, password-protected, great for proposals' },
            { value: 'instagram', label: 'Instagram Reels', description: 'Best for short-form, audience building' },
            { value: 'linkedin', label: 'LinkedIn video', description: 'Best for B2B buyers and agency outreach' },
            { value: 'google_drive', label: 'Google Drive / Dropbox', description: 'For private sharing with clients' },
          ],
          generateDefault: (ctx) => {
            if (ctx.marketId?.includes('youtube')) return 'youtube';
            if (ctx.marketId?.includes('saas') || ctx.marketId?.includes('agency')) return 'vimeo';
            return 'youtube';
          },
        },
      ],
    },
  ],

  generateStrategicRationale(ctx: BuilderContext): string {
    const { alreadyBelieve, doubt } = marketAssumptions(ctx.marketId);
    const market = fmt(ctx.marketId);
    const service = fmt(ctx.serviceId);
    const craftScore = ctx.scores.craft;

    return `Your Craft score is ${craftScore}/100 â€" ${craftScore < 40 ? 'critically low' : craftScore < 70 ? 'moderate' : 'strong'}.\n\n${market} buyers evaluating ${service} need to see your work immediately â€" before reading a word. A showreel answers the question they can't ask in a brief: "What does this person's work actually feel like?"\n\nThey already assume ${alreadyBelieve}. What they doubt is ${doubt}. A well-structured showreel â€" one that starts with your strongest hook and closes with a results-driven clip â€" closes that doubt faster than any case study.\n\nThis is ${ctx.gapRank === 1 ? 'your #1 priority' : `Priority #${ctx.gapRank}`}.`;
  },

  computeAdvisorSignals(fields: FieldValues, ctx: BuilderContext) {
    const signals = [];
    if (fields.hookConcept) {
      const c = runClarity(fields.hookConcept);
      signals.push(signalFromScore('hookConcept', c.score, c.message));
    }
    if (fields.coreProof) {
      const s = runSpecificity(fields.coreProof);
      signals.push(signalFromScore('coreProof', s.score, s.message));
    }
    if (fields.clip3) {
      const br = runBusinessRelevance(fields.clip3, ctx);
      signals.push(signalFromScore('clip3', br.score, br.message));
    }
    if (fields.cta) {
      const passes = /\b(link|url|visit|see|view|dm|message|portfolio|notion|youtube|vimeo)\b/i.test(fields.cta);
      signals.push(signalFromScore('cta', passes ? 88 : 30,
        passes
          ? 'Clear and actionable CTA.'
          : 'Too vague. Give a specific place to go or action to take.'));
    }
    return signals;
  },

  computeQualityScore(fields: FieldValues, ctx: BuilderContext, otherFieldSets: FieldValues[]) {
    const allText = Object.values(fields).join(' ');
    const specificity = runSpecificity(fields.clip3 ?? allText);
    const clarity = runClarity(fields.hookConcept ?? allText);
    const credibility = runCredibility(fields.coreProof ?? allText);
    const relevance = runBusinessRelevance(fields.clip3 ?? allText, ctx);
    const diff = runDifferentiation(fields.hookConcept ?? allText, ctx);
    const eco = runEcosystemFit(allText, 'showreel', otherFieldSets);
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
    const allText = Object.values(fields).join(' ');
    const hasHook = !!fields.hookConcept && fields.hookConcept.length > 20;
    const hasResult = /\b(retention|growth|views|engagement|percent|%|viral|audience)\b/i.test(allText);
    const hasCTA = !!fields.cta && fields.cta.length > 10;
    const hasSequence = !!fields.clip1 && !!fields.clip2 && !!fields.clip3;

    const questions = [
      {
        question: 'Will this make me stop scrolling in under 3 seconds?',
        passes: hasHook,
        explanation: hasHook
          ? 'Hook is defined and specific.'
          : 'Define exactly what the first 3 seconds will show. Vague hooks fail.',
      },
      {
        question: 'Does it prove results, not just skill?',
        passes: hasResult,
        explanation: hasResult
          ? 'Includes a results-oriented clip â€" strong for buyer trust.'
          : 'Include a clip that shows an outcome (retention spike, viral moment, before/after), not just technique.',
      },
      {
        question: primaryQuestion,
        passes: hasSequence && hasResult,
        explanation: hasSequence && hasResult
          ? `Yes â€" structured sequence with proof of results would answer this.`
          : `Not yet â€" define all 3 clips with at least one results-driven segment.`,
      },
      {
        question: 'Is there a clear next step after watching?',
        passes: hasCTA,
        explanation: hasCTA
          ? 'CTA is clear and specific.'
          : 'Define where viewers should go. Without a CTA, impressions don\'t convert.',
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

  computePublishPlatforms(ctx: BuilderContext) {
    const preferred = [...ctx.gapPlatforms];
    if (ctx.marketId?.includes('youtube')) preferred.unshift('YouTube');
    if (ctx.marketId?.includes('saas') || ctx.marketId?.includes('agency')) preferred.unshift('Vimeo');
    return [...new Set(preferred)].slice(0, 4);
  },

  assembleOutput(fields: FieldValues, ctx: BuilderContext): OutputBrief {
    const market = fmt(ctx.marketId);
    const service = fmt(ctx.serviceId);
    const duration = fields.duration ?? '60â€"90 seconds';
    const platform = fmt(fields.primaryPlatform ?? ctx.gapPlatforms[0] ?? 'YouTube');

    const headline = `${service} Showreel â€" ${duration}`;
    const description = `${fields.coreProof || `Demonstrates ${service} capability for ${market} clients`}`;
    const proofStatement = fields.clip3
      ? `Results clip: ${fields.clip3.substring(0, 120)}`
      : `Visual proof of ${service} work for ${market} buyers`;
    const cta = fields.cta || `Watch the showreel â†'`;

    const platforms = showreelConfig.computePublishPlatforms(ctx);
    const platformTips: Record<string, string> = {
      YouTube: 'Use a keyword-rich title. Add chapters. Pin the best comment with a portfolio link.',
      Vimeo: 'Set to password-protected for private client sharing. Use a custom thumbnail.',
      'Instagram Reels': 'Cut to 30s for Reels. Add captions. Hook in first frame â€" no intro.',
      'LinkedIn video': 'Upload directly (not YouTube link). Captions mandatory. First 3 seconds decide everything.',
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
        presentationStructure: ['Hook Clip', 'Range Proof', 'Results Proof', 'CTA'],
        deliverables: [
          `${duration} ${service} showreel`,
          `Published on ${platform}`,
          fields.cta ? 'CTA defined' : 'CTA pending',
        ],
      },
    };
  },
};
