import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  OutreachEngineState, OutreachEngineStep, OutreachGoal, ProspectContext,
  PersonalizationAngle, MessageDraft, FollowUpMessage, ObjectionReply,
  OutreachTrackerEntry, OutreachReport, AngleType, MessageChannel,
  Module6UpstreamContext,
} from '../../types/outreach-engine-system';
import { OUTREACH_ENGINE_STEPS, canNavigateTo, getStepIndex } from '../../types/outreach-engine-system';
import { resolveBlueprintContext } from '../blueprint-content/blueprint-context';

export { canNavigateTo, getStepIndex, OUTREACH_ENGINE_STEPS };

import { getNicheKey, getCleanOutreachContext, sanitizeText } from './context-helper';
import { generateOutreachContextDefaults } from '../blueprint-content';

function generateSampleProspectForService(serviceId: string | null, nicheKey: string): ProspectContext {
  const defaults = generateOutreachContextDefaults(serviceId, nicheKey);

  return {
    prospectName: defaults.prospectName,
    companyOrChannelName: defaults.companyOrChannelName,
    platform: defaults.platform,
    websiteOrProfileUrl: '',
    visibleProblem: defaults.visibleProblem,
    reasonToContact: defaults.reasonToContact,
    leadScore: 25,
    priority: 'high',
    recommendedAsset: defaults.recommendedAsset,
    notes: '',
    isSampleProspect: true,
  };
}

function isWeakInput(text: string): boolean {
  const t = (text ?? '').trim();
  if (t.length < 12) return true;
  const weak = ['h', 'kh', 'hk', 'test', 'abc', 'xyz', 'random', 'asd', 'qwe', 'hkh', 'dfg'];
  return weak.some((w) => t.toLowerCase() === w);
}

function cleanProblemText(text: string): string {
  return text.replace(/\.+$/, '').trim();
}

function needsHookRewrite(text: string): string | null {
  const trimmed = text.trim();
  if (/^(They|Their|The website|The page)\b/i.test(trimmed)) {
    return `The visible issue I noticed is: ${trimmed}`;
  }
  return null;
}

function generateAngles(
  serviceId: string | null,
  nicheKey: string,
  prospectName: string,
  visibleProblem: string,
  assetName: string,
  goalType: string | undefined,
): PersonalizationAngle[] {
  const ctx = serviceId ? resolveBlueprintContext(serviceId, nicheKey) : null;
  const offerLabel = ctx?.offerLabel ?? null;
  const audienceLabel = ctx?.audienceLabel ?? 'people like you';
  const cta = ctx?.caseStudyTemplate?.cta ?? 'let me know if you\'d like some ideas';

  const angleFocus: Record<string, { problem: string; sample: string; audit: string }> = {
    short_form_clips: {
      problem: 'their long-form content has moments that could reach new audiences as short clips',
      sample: 'a short-form clip sample pack showing how to repurpose long-form content',
      audit: 'review one of their videos and suggest 3 specific clip opportunities',
    },
    podcast_post_production: {
      problem: 'their episodes contain quotable moments that could work as discovery clips',
      sample: 'a podcast clip sample pack showing episode-to-clip repurposing',
      audit: 'review one episode and suggest 3 clip opportunities',
    },
    custom_theme_development: {
      problem: 'their landing page could communicate their product value more clearly',
      sample: 'a custom landing page build focused on performance and mobile responsiveness',
      audit: 'review their site and suggest 3 specific improvements',
    },
    plugin_integration_dev: {
      problem: 'their disconnected tools create manual work that could be automated',
      sample: 'a multi-tool integration prototype connecting key platforms',
      audit: 'review their tool stack and suggest 3 integration opportunities',
    },
    site_migration_performance: {
      problem: 'their slow website could be losing them visitors and leads',
      sample: 'a site migration and performance optimisation project',
      audit: 'audit their site speed and suggest 3 performance fixes',
    },
    product_ui_design: {
      problem: 'their interface has friction that could be reducing activation',
      sample: 'a product interface redesign concept with clearer user flows',
      audit: 'review their interface and suggest 3 UX improvements',
    },
    brand_identity_visual_systems: {
      problem: 'their inconsistent design assets slow down delivery',
      sample: 'a reusable design system library with tokens and components',
      audit: 'audit their current design assets and suggest 3 system improvements',
    },
    ux_research_conversion_audits: {
      problem: 'their onboarding flow has friction that could be reducing conversions',
      sample: 'a UX audit and improvement report with actionable recommendations',
      audit: 'review their onboarding flow and suggest 3 conversion improvements',
    },
  };

  const focus = angleFocus[serviceId ?? ''] ?? {
    problem: 'their current approach could be improved with a fresh perspective',
    sample: offerLabel ? `a sample ${offerLabel} project showing the approach` : 'a sample project showing how this kind of problem could be approached',
    audit: 'review what they have and suggest 3 specific improvements',
  };

  const rawProblem = isWeakInput(visibleProblem)
    ? 'there may be an opportunity to improve how this is presented'
    : cleanProblemText(visibleProblem);

  const safeProblemShort = isWeakInput(visibleProblem)
    ? 'how things could be improved'
    : cleanProblemText(visibleProblem);

  const problemFirstHook = needsHookRewrite(rawProblem) ?? `I noticed ${rawProblem}`;

  const sampleHook = assetName
    ? `I created a sample project called ${assetName} that may be relevant to this.`
    : `I created ${focus.sample.startsWith('a ') ? focus.sample : 'a ' + focus.sample} that may be relevant to what you are working on.`;

  const angles: { id: string; type: AngleType; name: string; hook: string; why: string; channels: string[]; risk: 'Very Low' | 'Low' | 'Medium' | 'High' }[] = [
    {
      id: 'angle-problem-first',
      type: 'problem_first',
      name: 'Problem-First Angle',
      hook: `${problemFirstHook}. Would it be useful if I shared a few thoughts?`,
      why: `Directly references the prospect's visible issue, showing you paid attention. Best for prospects who respond to specificity.`,
      channels: ['LinkedIn DM', 'Email'],
      risk: 'Low',
    },
    {
      id: 'angle-quick-win',
      type: 'quick_win',
      name: 'Quick-Win Angle',
      hook: `I had 2 quick ideas that could help with ${safeProblemShort}. Happy to share if useful.`,
      why: `Offers immediate value without commitment. Low pressure, easy to say yes to.`,
      channels: ['LinkedIn DM', 'Email', 'Instagram/Twitter DM'],
      risk: 'Low',
    },
    {
      id: 'angle-sample-project',
      type: 'sample_project',
      name: 'Sample Project Angle',
      hook: sampleHook,
      why: `Lets your work speak for itself. Effective when you have a strong sample that connects to their situation.`,
      channels: ['LinkedIn DM', 'Email'],
      risk: 'Low',
    },
    {
      id: 'angle-permission-based',
      type: 'permission_based',
      name: 'Permission-Based Angle',
      hook: `Would it be useful if I sent a few quick ideas on ${safeProblemShort}? No pitch, just thoughts.`,
      why: `Ultra-soft opener. Respectful and easy for the prospect to accept without pressure.`,
      channels: ['LinkedIn DM', 'Instagram/Twitter DM', 'Community Message'],
      risk: 'Very Low',
    },
    {
      id: 'angle-audit',
      type: 'audit',
      name: 'Audit Angle',
      hook: `I can send a short 3-point review of ${isWeakInput(visibleProblem) ? 'what I noticed' : 'what I noticed'} if that would be useful.`,
      why: `Position yourself as helpful and knowledgeable. Good for prospects who want proof before engaging.`,
      channels: ['Email', 'LinkedIn DM', 'Website Contact Form'],
      risk: 'Medium',
    },
    {
      id: 'angle-soft-conversation',
      type: 'soft_conversation',
      name: 'Soft Conversation Angle',
      hook: isWeakInput(visibleProblem)
        ? `Are you currently working on improving how things are presented?`
        : `Are you currently working on improving this?`,
      why: `Starts a natural conversation without any ask. Best for cold outreach where you want to build rapport first.`,
      channels: ['LinkedIn DM', 'Instagram/Twitter DM', 'Community Message'],
      risk: 'Very Low',
    },
  ];

  const isDirectGoal = goalType === 'book_discovery_call' || goalType === 'offer_free_audit';
  const isSoftGoal = goalType === 'ask_permission' || goalType === 'start_conversation';

  return angles.map((a) => ({
    id: a.id,
    angleName: a.name,
    angleType: a.type,
    whyItFits: a.why,
    messageHook: a.hook,
    bestChannel: a.channels,
    riskLevel: a.risk,
    selected: false,
  }));
}

function generateDrafts(
  serviceId: string | null,
  nicheKey: string,
  prospectName: string,
  visibleProblem: string,
  reasonToContact: string,
  assetName: string,
  goalType: string | undefined,
  goalLabel: string | undefined,
  selectedTone: string | undefined,
  selectedAngle: PersonalizationAngle | undefined,
  isSampleData: boolean,
): MessageDraft[] {
  const isWeakProblem = isWeakInput(visibleProblem);

  const sampleWordingMap: Record<string, string> = {
    short_form_clips: 'I created a sample shorts pack showing how long-form moments can become short-form clips.',
    podcast_post_production: 'I created a sample podcast clip pack showing how full episodes can become discovery clips.',
    custom_theme_development: 'I created a sample landing page build showing how product value, trust, and demo/signup path can be structured.',
    plugin_integration_dev: 'I created a sample plugin integration setup showing how forms, CRM, tracking, and campaign tools can connect cleanly.',
    site_migration_performance: 'I created a sample site migration project showing how speed, mobile layout, and local SEO can be improved.',
    product_ui_design: 'I created a sample dashboard redesign showing how onboarding and interface clarity can be improved.',
    brand_identity_visual_systems: 'I created a sample design system breakdown showing how reusable components and design tokens improve consistency.',
    ux_research_conversion_audits: 'I created a sample UX audit showing how friction points can be identified and improved.',
  };

  const observation = isWeakProblem
    ? 'there may be an opportunity to improve how this is presented'
    : (visibleProblem || 'there may be an opportunity to improve how this is presented');

  const sampleWording = isSampleData
    ? (sampleWordingMap[serviceId ?? ''] ?? (assetName
        ? `I created a sample project called ${assetName} that may be useful as a reference.`
        : `I created a sample project around this kind of problem that may be useful as a reference.`))
    : (assetName
        ? `I also have a sample breakdown, ${assetName}, that connects closely to this.`
        : `I had a few practical ideas that may be useful.`);

  const ctaLine = ctaLocale(selectedTone);

  function buildBody(channel: string): string {
    const lines: string[] = [];

    if (channel === 'linkedin_dm') {
      lines.push(`Hey ${prospectName},`);
      lines.push(`I noticed ${observation}.`);
      lines.push(sampleWording);
      lines.push(ctaLocale(selectedTone));
      return lines.join('\n\n');
    }

    if (channel === 'email') {
      lines.push(`Hi ${prospectName},`);
      lines.push(`I came across your work and noticed ${observation}.`);
      lines.push(sampleWording);
      lines.push(ctaLocale(selectedTone));
      return lines.join('\n\n');
    }

    if (channel === 'instagram_twitter_dm') {
      return `Hey! I noticed ${observation.slice(0, 50)} — ${sampleWording} ${ctaLocale(selectedTone)}`;
    }

    if (channel === 'website_contact_form') {
      return `Hi, I'm reaching out because I noticed ${observation}. ${sampleWording} ${ctaLocale(selectedTone)}`;
    }

    return `Hey ${prospectName}, hope you're doing well. I noticed ${observation}. ${sampleWording} ${ctaLocale(selectedTone)}`;
  }

  function ctaLocale(tone?: string): string {
    if (tone === 'Direct') return `Would it be useful if I sent 2-3 quick ideas?`;
    if (tone === 'Professional') return `Let me know if a few suggestions would be helpful.`;
    if (tone === 'Soft') return `No pressure at all, but happy to share if useful.`;
    return `Would it be useful if I sent a few quick ideas?`;
  }

  function subjectLine(tone?: string): string {
    if (isWeakProblem) {
      if (tone === 'Direct') return `Quick thought on an opportunity`;
      if (tone === 'Professional') return `Suggestion regarding how things could be improved`;
      if (tone === 'Soft') return `Quick idea`;
      return `Thought on an opportunity`;
    }
    if (tone === 'Direct') return `Quick thought on ${observation.slice(0, 40)}`;
    if (tone === 'Professional') return `Suggestion regarding ${observation.slice(0, 40)}`;
    if (tone === 'Soft') return `Quick idea`;
    return `Thought on ${observation.slice(0, 40)}`;
  }

  const channels: { id: string; channel: MessageChannel; label: string; risk: 'Very Low' | 'Low' | 'Medium' | 'High'; bestFor: string }[] = [
    { id: 'draft-linkedin', channel: 'linkedin_dm', label: 'LinkedIn DM', risk: 'Low', bestFor: 'Professional networking, B2B outreach' },
    { id: 'draft-email', channel: 'email', label: 'Email', risk: 'Medium', bestFor: 'More space for detail, follow-up friendly' },
    { id: 'draft-social', channel: 'instagram_twitter_dm', label: 'Instagram / Twitter DM', risk: 'Low', bestFor: 'Casual, short outreach' },
    { id: 'draft-website', channel: 'website_contact_form', label: 'Website Contact Form', risk: 'Medium', bestFor: 'Direct business inquiries' },
    { id: 'draft-community', channel: 'community_message', label: 'Community Message', risk: 'Very Low', bestFor: 'Community-based soft outreach' },
  ];

  return channels.map((ch) => ({
    id: ch.id,
    channel: ch.channel,
    label: ch.label,
    subject: ch.channel === 'email' ? subjectLine(selectedTone) : undefined,
    message: buildBody(ch.channel),
    tone: selectedTone ?? 'Friendly',
    cta: ctaLine,
    riskLevel: ch.risk,
    bestFor: ch.bestFor,
  }));
}

function generateFollowUpSequence(
  serviceId: string | null,
  nicheKey: string,
  prospectName: string,
  visibleProblem: string,
  assetName: string,
  selectedTone: string | undefined,
  isSampleData: boolean,
): FollowUpMessage[] {
  const isWeakProblem = isWeakInput(visibleProblem);
  const problemRef = isWeakProblem ? 'improving how things are presented' : visibleProblem.slice(0, 60);

  const serviceTips: Record<string, string> = {
    short_form_clips: 'turning one strong moment from each VOD into a short clip can make posting more consistent without creating new content from scratch.',
    podcast_post_production: 'pulling one quotable moment from each episode as a short clip can help grow discovery without extra recording.',
    custom_theme_development: 'making the demo/signup path visible earlier could make the page easier for early users or investors to act on.',
    plugin_integration_dev: 'repeated form, CRM, and tracking setup across campaign pages can be streamlined with a simple integration checklist.',
    site_migration_performance: 'improving mobile layout and local SEO visibility can directly impact how many local visitors contact the business.',
    product_ui_design: 'reducing the number of unclear first-step choices can make onboarding feel easier for new users.',
    brand_identity_visual_systems: 'using a shared component library across projects can make design delivery faster and more consistent.',
    ux_research_conversion_audits: 'mapping the onboarding flow step by step often reveals one or two changes that reduce drop-off significantly.',
  };

  const tip = serviceTips[serviceId ?? ''] ?? 'taking a fresh look at the current approach often reveals a few quick improvements.';
  const assetRef = isSampleData
    ? (assetName ? `sample project called ${assetName}` : 'sample project')
    : (assetName ? `breakdown, ${assetName}` : 'few practical ideas');

  const toneAdj = selectedTone === 'Direct' ? '' : selectedTone === 'Professional' ? 'just ' : '';

  return [
    {
      id: 'followup-1',
      sequenceStep: 1,
      label: 'Gentle Reminder',
      timing: '2–3 days after first message',
      message: `Hey ${prospectName}, quick follow-up on my note about ${problemRef}. Happy to send ${toneAdj}the ideas over if useful.`,
      purpose: 'Bring the message back politely without pressure.',
      tone: selectedTone ?? 'Friendly',
      riskLevel: 'Low',
    },
    {
      id: 'followup-2',
      sequenceStep: 2,
      label: 'Value Add',
      timing: '5–7 days after first message',
      message: `One quick thought: ${tip} No pressure, just wanted to share in case it is helpful.`,
      purpose: 'Add one useful insight or quick idea without asking for a reply.',
      tone: selectedTone ?? 'Friendly',
      riskLevel: 'Low',
    },
    {
      id: 'followup-3',
      sequenceStep: 3,
      label: 'Close the Loop',
      timing: '10–14 days after first message',
      message: `No worries if this is not a priority right now. I will leave it here, but happy to share the ${assetRef} later if useful.`,
      purpose: 'Politely end the sequence and leave the door open for future contact.',
      tone: selectedTone ?? 'Friendly',
      riskLevel: 'Very Low',
    },
  ];
}

function generateObjectionReplies(
  serviceId: string | null,
  nicheKey: string,
  prospectName: string,
  visibleProblem: string,
  assetName: string,
  isSampleData: boolean,
  offerName: string | null,
): ObjectionReply[] {
  const ctx = serviceId ? resolveBlueprintContext(serviceId, nicheKey) : null;
  const offerLabel = ctx?.offerLabel ?? null;
  const isWeakProblem = isWeakInput(visibleProblem);
  const problemRef = isWeakProblem ? 'an opportunity to improve how things are presented' : visibleProblem.slice(0, 80);

  const assetReply = isSampleData
    ? (assetName
        ? `Sure — I can share a sample project called ${assetName} that I created around this type of problem.`
        : 'Sure — I can share a sample project I created around this type of problem.')
    : (assetName
        ? `Sure — I can share my work on ${assetName} that connects closely to this.`
        : 'Sure — I can share a few examples of how I have approached similar situations.');

  const serviceExamples: Record<string, string> = {
    short_form_clips: 'a sample gaming shorts pack showing how I select moments, shape hooks, add captions, and prepare clips for Shorts/Reels/TikTok.',
    podcast_post_production: 'a sample podcast clip pack showing how I identify quotable moments and turn them into discovery clips.',
    custom_theme_development: 'a sample AI startup landing page structure I created. It shows how I would organize the product value, trust section, and demo/signup path.',
    plugin_integration_dev: 'a sample agency plugin integration setup showing how forms, CRM, tracking, and campaign tools can be connected.',
    site_migration_performance: 'a sample site migration and performance audit showing how I approach speed, mobile responsiveness, and local SEO.',
    product_ui_design: 'a sample SaaS dashboard redesign concept. It shows how I approach information hierarchy, onboarding clarity, and component consistency.',
    brand_identity_visual_systems: 'a sample design system library showing how I build reusable tokens, components, and documentation.',
    ux_research_conversion_audits: 'a sample UX audit report showing how I identify friction points and suggest actionable improvements.',
  };

  const serviceExample = serviceExamples[serviceId ?? ''] ?? 'a sample project showing my approach to this type of work.';

  const howItWorks: Record<string, string> = {
    short_form_clips: 'I review the source footage, select the best moments, shape each clip around a hook, add captions, tighten pacing, and prepare the clips for Shorts, Reels, or TikTok.',
    podcast_post_production: 'I review the episode, identify quotable moments, edit them into short clips with captions, and prepare them for distribution on short-form platforms.',
    custom_theme_development: 'I start by understanding the product and audience, plan the site structure, build a custom WordPress theme with performance optimisation, and deliver a responsive, SEO-optimised site.',
    plugin_integration_dev: 'I start by mapping the current tool stack and workflow bottlenecks, then design a plugin architecture that connects key platforms, build the integration, test the flow, and deliver setup documentation.',
    site_migration_performance: 'I start with a full performance audit, then plan the migration, build the new site with optimisation, test across devices, and deliver a handoff with local SEO in place.',
    product_ui_design: 'I review the existing interface, map key user flows, identify friction points, redesign screens with clearer information hierarchy, and deliver developer-ready handoff files.',
    brand_identity_visual_systems: 'I start by auditing the current design assets, then build a reusable component library with design tokens, patterns, and documentation.',
    ux_research_conversion_audits: 'I review the current user flow, identify friction points, suggest actionable improvements, and present findings in a clear report.',
  };

  const howItWorksText = howItWorks[serviceId ?? ''] ?? 'I start by understanding the current situation, then identify opportunities for improvement, and deliver actionable suggestions.';

  return [
    {
      id: 'obj-not-interested',
      objectionType: 'not_interested',
      label: 'Not Interested',
      prospectSays: '"Not interested."',
      reply: `No problem at all, ${prospectName}. I appreciate you letting me know. If things change or you ever want to revisit this, feel free to reach out.`,
      strategy: 'Respectfully close without pressure.',
      tone: 'Friendly',
      riskLevel: 'Very Low',
    },
    {
      id: 'obj-send-details',
      objectionType: 'send_details',
      label: 'Send Details',
      prospectSays: '"Send details."',
      reply: `Happy to share more. I focus on ${offerLabel ?? 'helping with this type of work'} — specifically helping with ${problemRef}. If you let me know what part is most relevant, I can tailor the details rather than send a long wall of text.`,
      strategy: 'Offer detail without overwhelming them.',
      tone: 'Friendly',
      riskLevel: 'Low',
    },
    {
      id: 'obj-pricing',
      objectionType: 'pricing_question',
      label: 'What Do You Charge?',
      prospectSays: '"What do you charge?"',
      reply: `Great question. Pricing depends on the specific scope, but I typically start with a small review or trial piece to make sure the approach fits before discussing numbers. Would it be useful if I took a quick look first and suggested a direction?`,
      strategy: 'Offer a small review first instead of quoting blind.',
      tone: 'Professional',
      riskLevel: 'Low',
    },
    {
      id: 'obj-have-someone',
      objectionType: 'already_have_someone',
      label: 'Already Have Someone',
      prospectSays: '"We already have someone."',
      reply: `That is great to hear — I am glad you have support in place. If there is ever a specific area where you need extra help or a backup, feel free to reach out. No pitch here, just wanted you to know I am around.`,
      strategy: 'Respect existing setup and offer backup support.',
      tone: 'Friendly',
      riskLevel: 'Very Low',
    },
    {
      id: 'obj-maybe-later',
      objectionType: 'maybe_later',
      label: 'Maybe Later',
      prospectSays: '"Maybe later."',
      reply: `No worries at all, ${prospectName}. I will leave this here. If you ever want to revisit, feel free to ping me — happy to help whenever the timing works.`,
      strategy: 'Leave the door open without follow-up pressure.',
      tone: 'Friendly',
      riskLevel: 'Very Low',
    },
    {
      id: 'obj-show-examples',
      objectionType: 'show_examples',
      label: 'Can You Show Examples?',
      prospectSays: '"Can you show examples?"',
      reply: `Sure — I can share ${serviceExample}`,
      strategy: 'Share sample/portfolio asset honestly.',
      tone: 'Friendly',
      riskLevel: 'Low',
    },
    {
      id: 'obj-how-it-works',
      objectionType: 'how_it_works',
      label: 'How Does This Work?',
      prospectSays: '"How does this work?"',
      reply: `${howItWorksText} Happy to walk through it in more detail if useful.`,
      strategy: 'Explain simple process in 2–3 steps.',
      tone: 'Friendly',
      riskLevel: 'Low',
    },
  ];
}

export const useOutreachEngineStore = create<OutreachEngineState>()(
  persist(
    (set, get) => ({
      phase5Service: null,
      phase5ServiceLabel: null,
      phase5Market: null,
      phase5Niche: null,
      phase5Positioning: '',
      phase5OfferName: '',
      phase5OfferType: null,
      phase5Deliverables: [],
      phase5CorePromise: '',
      phase5AuthorityAngle: '',
      phase5AuthorityProfile: { oneLinePositioning: '', shortBio: '', trustBullets: [], ctaLine: '' },
      phase5PortfolioAsset: '',
      phase5SampleProject: { projectName: '', goal: '' },
      phase5PipelineProspects: [],
      phase5SelectedProspect: null,
      phase5VisibleProblem: '',
      phase5LeadScore: 0,
      phase5Priority: '',
      phase5ReasonToContactLater: '',

      upstreamContext: null,
      upstreamFingerprint: '',

      outreachGoal: null,
      prospectContext: null,
      personalizationAngles: [],
      selectedAngleId: null,
      messageDrafts: [],
      selectedMessageDraftId: null,
      followUpSequence: [],
      selectedFollowUpId: null,
      objectionReplies: [],
      outreachTracker: [],
      outreachReport: null,

      currentStep: 'outreach_goal',
      completedSteps: [],

      setPhase5Context(ctx) {
        set({
          phase5Service: ctx.service,
          phase5ServiceLabel: ctx.serviceLabel,
          phase5Market: ctx.market,
          phase5Niche: ctx.niche,
          phase5Positioning: ctx.positioning,
          phase5OfferName: ctx.offerName,
          phase5OfferType: ctx.offerType,
          phase5Deliverables: ctx.deliverables,
          phase5CorePromise: ctx.corePromise,
          phase5AuthorityAngle: ctx.authorityAngle,
          phase5AuthorityProfile: ctx.authorityProfile,
          phase5PortfolioAsset: ctx.portfolioAsset,
          phase5SampleProject: ctx.sampleProject,
          phase5PipelineProspects: ctx.pipelineProspects,
        });
      },

      setUpstreamContext(context, fingerprint) {
        const state = get();
        const upstreamChanged = state.upstreamFingerprint !== fingerprint;

        // Store canonical context
        const updates: Record<string, unknown> = {
          upstreamContext: context,
          upstreamFingerprint: fingerprint,
        };

        // Clear stale generated strategy when upstream materially changed
        if (upstreamChanged) {
          updates.personalizationAngles = [];
          updates.selectedAngleId = null;
          updates.messageDrafts = [];
          updates.selectedMessageDraftId = null;
          updates.followUpSequence = [];
          updates.selectedFollowUpId = null;
          updates.objectionReplies = [];
          updates.outreachReport = null;
        }

        // Derive legacy phase5* compatibility fields from canonical context
        const s = context.strategy;
        const p = context.proof;

        updates.phase5Service = s.serviceId ?? null;
        updates.phase5ServiceLabel = s.serviceLabel ?? null;
        updates.phase5Market = s.market ?? null;
        updates.phase5Niche = s.niche ?? null;
        updates.phase5Positioning = s.positioning ?? '';
        updates.phase5OfferName = s.offerName ?? '';
        updates.phase5OfferType = s.offerType ?? null;
        updates.phase5Deliverables = s.deliverables;
        updates.phase5CorePromise = s.uniqueMechanism ?? '';
        updates.phase5AuthorityAngle = s.authorityPosition ?? '';

        // Proof source of truth: use real proof when available, never invent
        updates.phase5PortfolioAsset = p.available && p.featuredProofTitle ? p.featuredProofTitle : '';

        // Sample project: derive from proof when available
        updates.phase5SampleProject = {
          projectName: p.available && p.featuredProofTitle ? p.featuredProofTitle : '',
          goal: '',
        };

        // Pipeline prospects: full non-lossy mapping to legacy shape
        updates.phase5PipelineProspects = context.prospects.map((pr) => ({
          prospectName: pr.prospectName,
          visibleProblem: pr.visibleProblem,
          score: pr.score,
          priority: pr.priority,
          platform: pr.platform,
        }));

        // If selected prospect still exists in new list, keep it; otherwise clear
        const selectedId = state.phase5SelectedProspect?.prospectName ?? null;
        if (selectedId) {
          const stillExists = context.prospects.some((pr) => pr.prospectName === selectedId);
          if (!stillExists) {
            updates.phase5SelectedProspect = null;
            updates.phase5VisibleProblem = '';
            updates.phase5LeadScore = 0;
            updates.phase5Priority = '';
          }
        }

        set(updates as Partial<OutreachEngineState>);
      },

      setSelectedProspect(prospect) {
        set({
          phase5SelectedProspect: prospect,
          phase5VisibleProblem: prospect.visibleProblem,
          phase5LeadScore: prospect.score,
          phase5Priority: prospect.priority,
        });
      },

      seedDevSampleContext(optionIndex) {
        if (optionIndex < 1 || optionIndex > 4) {
          return;
        }

        let service = '';
        let serviceLabel = '';
        let niche = '';
        let portfolioAsset = '';
        let prospectName = '';
        let companyOrChannelName = '';
        let platform = '';
        let visibleProblem = '';
        let reasonToContact = '';
        let leadScore = 24;
        let priority = 'high';
        
        if (optionIndex === 1) {
          service = 'custom_theme_development';
          serviceLabel = 'Custom Theme Development';
          niche = 'AI Startups';
          portfolioAsset = 'AI Startup Landing Page Build';
          prospectName = 'Recently launched AI tool';
          companyOrChannelName = 'Sample AI Tool';
          platform = 'Product Hunt';
          visibleProblem = 'Landing page explains the product weakly and has no strong demo/signup path.';
          reasonToContact = 'A clearer landing page could improve trust and conversion.';
          leadScore = 28;
        } else if (optionIndex === 2) {
          service = 'plugin_integration_dev';
          serviceLabel = 'WordPress Plugin Integration';
          niche = 'Marketing Agencies';
          portfolioAsset = 'Agency Plugin Integration Sample';
          prospectName = 'Marketing agency with technical gaps';
          companyOrChannelName = 'Sample Marketing Agency';
          platform = 'LinkedIn';
          visibleProblem = 'Runs client campaigns but needs repeated form, CRM, tracking, and plugin setup support.';
          reasonToContact = 'Their campaign delivery could become faster with reliable WordPress integration support.';
          leadScore = 24;
        } else if (optionIndex === 3) {
          service = 'product_ui_design';
          serviceLabel = 'Product UI Design';
          niche = 'SaaS';
          portfolioAsset = 'SaaS Dashboard Redesign Concept';
          prospectName = 'SaaS product with UX friction';
          companyOrChannelName = 'Sample SaaS Product';
          platform = 'Product Hunt / G2';
          visibleProblem = 'Dashboard looks confusing and onboarding path is unclear.';
          reasonToContact = 'A clearer dashboard and first-user flow could reduce friction.';
          leadScore = 25;
        } else if (optionIndex === 4) {
          service = 'short_form_clips';
          serviceLabel = 'Short-Form Clips';
          niche = 'Gaming';
          portfolioAsset = 'Gaming Shorts Sample Pack';
          prospectName = 'Growing gaming creator';
          companyOrChannelName = 'Sample Gaming Channel';
          platform = 'YouTube';
          visibleProblem = 'Posts long-form gameplay videos but has inconsistent Shorts/Reels/TikTok clips.';
          reasonToContact = 'Their existing videos contain moments that could become short-form clips.';
          leadScore = 24;
        }

        set({
          phase5Service: service,
          phase5ServiceLabel: serviceLabel,
          phase5Niche: niche,
          phase5PortfolioAsset: portfolioAsset,
          phase5SampleProject: { projectName: portfolioAsset, goal: portfolioAsset },
          phase5PipelineProspects: [
            { prospectName, visibleProblem, score: leadScore, priority, platform }
          ],
          phase5SelectedProspect: { prospectName, visibleProblem, score: leadScore, priority, platform },
          phase5VisibleProblem: visibleProblem,
          phase5LeadScore: leadScore,
          phase5Priority: priority,
          prospectContext: {
            prospectName,
            companyOrChannelName,
            platform,
            websiteOrProfileUrl: '',
            visibleProblem,
            reasonToContact,
            leadScore,
            priority: priority as 'low' | 'medium' | 'high',
            recommendedAsset: portfolioAsset,
            notes: '',
            isSampleProspect: true
          }
        });
      },

      setOutreachGoal(value) { set({ outreachGoal: value }); },
      setProspectContext(value) { set({ prospectContext: value }); },
      setPersonalizationAngles(value) { set({ personalizationAngles: value }); },
      setMessageDrafts(value) { set({ messageDrafts: value }); },
      setFollowUpSequence(value) { set({ followUpSequence: value }); },
      setObjectionReplies(value) { set({ objectionReplies: value }); },
      setOutreachTracker(value) { set({ outreachTracker: value }); },
      setOutreachReport(value) { set({ outreachReport: value }); },

      selectPipelineProspect(prospectId) {
        const state = get();
        const prospect = state.phase5PipelineProspects[prospectId];
        if (!prospect) return;
        const serviceId = state.phase5Service;
        const niche = state.phase5Niche ?? '';
        const nicheKey = getNicheKey(niche);
        const sample = generateSampleProspectForService(serviceId, nicheKey);
        set({
          phase5SelectedProspect: prospect,
          phase5VisibleProblem: prospect.visibleProblem,
          phase5LeadScore: prospect.score,
          phase5Priority: prospect.priority,
          prospectContext: {
            prospectName: prospect.prospectName,
            companyOrChannelName: '',
            platform: prospect.platform,
            websiteOrProfileUrl: '',
            visibleProblem: prospect.visibleProblem,
            reasonToContact: sample.reasonToContact,
            leadScore: prospect.score,
            priority: prospect.priority as 'low' | 'medium' | 'high',
            recommendedAsset: state.phase5PortfolioAsset || sample.recommendedAsset,
            notes: '',
            isSampleProspect: false,
          },
        });
      },

      updateProspectContext(partial) {
        const state = get();
        const current = state.prospectContext;
        if (!current) return;
        set({ prospectContext: { ...current, ...partial } });
      },

      generateSampleProspect() {
        const state = get();
        const serviceId = state.phase5Service;
        const niche = state.phase5Niche ?? '';
        const nicheKey = getNicheKey(niche);
        const sample = generateSampleProspectForService(serviceId, nicheKey);
        set({ prospectContext: sample });
      },

      generatePersonalizationAngles() {
        const state = get();
        const serviceId = state.phase5Service;
        const niche = state.phase5Niche ?? '';
        const nicheKey = getNicheKey(niche);
        const prospectName = state.prospectContext?.prospectName ?? 'there';
        const visibleProblem = state.prospectContext?.visibleProblem ?? '';
        const assetName = state.prospectContext?.recommendedAsset ?? state.phase5PortfolioAsset ?? '';
        const goalType = state.outreachGoal?.goalType;

        const angles = generateAngles(serviceId, nicheKey, prospectName, visibleProblem, assetName, goalType);
        set({ personalizationAngles: angles, selectedAngleId: null });
      },

      selectPersonalizationAngle(angleId: string) {
        const state = get();
        const updated = state.personalizationAngles.map((a) => ({
          ...a,
          selected: a.id === angleId,
        }));
        set({ personalizationAngles: updated, selectedAngleId: angleId });
      },

      updatePersonalizationAngle(angleId: string, partial) {
        const state = get();
        const updated = state.personalizationAngles.map((a) =>
          a.id === angleId ? { ...a, ...partial } : a,
        );
        set({ personalizationAngles: updated });
      },

      generateMessageDrafts() {
        const state = get();
        const serviceId = state.phase5Service;
        const niche = state.phase5Niche ?? '';
        const nicheKey = getNicheKey(niche);
        const prospectName = state.prospectContext?.prospectName ?? 'there';
        const visibleProblem = state.prospectContext?.visibleProblem ?? '';
        const reasonToContact = state.prospectContext?.reasonToContact ?? '';
        const assetName = state.prospectContext?.recommendedAsset ?? state.phase5PortfolioAsset ?? '';
        const goalType = state.outreachGoal?.goalType;
        const goalLabel = state.outreachGoal?.label;
        const selectedTone = state.outreachGoal?.selectedTone;
        const isSampleData = state.prospectContext?.isSampleProspect ?? false;
        const selectedAngle = state.personalizationAngles.find((a) => a.selected);

        const drafts = generateDrafts(
          serviceId, nicheKey, prospectName, visibleProblem,
          reasonToContact, assetName, goalType, goalLabel,
          selectedTone, selectedAngle, isSampleData,
        );
        set({ messageDrafts: drafts, selectedMessageDraftId: null });
      },

      selectMessageDraft(draftId: string) {
        set({ selectedMessageDraftId: draftId });
      },

      updateMessageDraft(draftId: string, partial) {
        const state = get();
        const updated = state.messageDrafts.map((d) =>
          d.id === draftId ? { ...d, ...partial } : d,
        );
        set({ messageDrafts: updated });
      },

      generateFollowUpSequence() {
        const state = get();
        const serviceId = state.phase5Service;
        const niche = state.phase5Niche ?? '';
        const nicheKey = getNicheKey(niche);
        const prospectName = state.prospectContext?.prospectName ?? 'there';
        const visibleProblem = state.prospectContext?.visibleProblem ?? '';
        const assetName = state.prospectContext?.recommendedAsset ?? state.phase5PortfolioAsset ?? '';
        const selectedTone = state.outreachGoal?.selectedTone;
        const isSampleData = state.prospectContext?.isSampleProspect ?? false;

        const seq = generateFollowUpSequence(serviceId, nicheKey, prospectName, visibleProblem, assetName, selectedTone, isSampleData);
        set({ followUpSequence: seq, selectedFollowUpId: null });
      },

      updateFollowUpMessage(messageId: string, partial) {
        const state = get();
        const updated = state.followUpSequence.map((m) =>
          m.id === messageId ? { ...m, ...partial } : m,
        );
        set({ followUpSequence: updated });
      },

      selectFollowUpMessage(messageId: string) {
        set({ selectedFollowUpId: messageId });
      },

      generateObjectionReplies() {
        const state = get();
        const serviceId = state.phase5Service;
        const niche = state.phase5Niche ?? '';
        const nicheKey = getNicheKey(niche);
        const prospectName = state.prospectContext?.prospectName ?? 'there';
        const visibleProblem = state.prospectContext?.visibleProblem ?? '';
        const assetName = state.prospectContext?.recommendedAsset ?? state.phase5PortfolioAsset ?? '';
        const isSampleData = state.prospectContext?.isSampleProspect ?? false;
        const offerName = state.phase5OfferName;

        const replies = generateObjectionReplies(serviceId, nicheKey, prospectName, visibleProblem, assetName, isSampleData, offerName);
        set({ objectionReplies: replies });
      },

      updateObjectionReply(replyId: string, partial) {
        const state = get();
        const updated = state.objectionReplies.map((r) =>
          r.id === replyId ? { ...r, ...partial } : r,
        );
        set({ objectionReplies: updated });
      },

      generateTrackerFromProspect() {
        const state = get();
        if (!Array.isArray(state.outreachTracker)) {
          set({ outreachTracker: [] });
        }
        const ctx = state.prospectContext;
        if (!ctx || !ctx.prospectName?.trim()) return;
        const selectedDraft = state.messageDrafts.find((d) => d.id === state.selectedMessageDraftId);
        const selectedAngle = state.personalizationAngles.find((a) => a.selected);
        const entry: OutreachTrackerEntry = {
          id: `tracker-${Date.now()}`,
          prospectName: ctx.prospectName,
          companyOrChannelName: ctx.companyOrChannelName,
          platform: ctx.platform,
          websiteOrProfileUrl: ctx.websiteOrProfileUrl,
          messageType: selectedDraft?.label ?? state.outreachGoal?.label ?? 'Direct message',
          selectedMessageDraftId: state.selectedMessageDraftId ?? undefined,
          status: 'Draft Ready',
          nextStep: 'Review the message and send manually',
          notes: selectedAngle
            ? `Based on ${selectedAngle.angleName} — ${selectedAngle.whyItFits.split('.')[0]}.`
            : 'No specific angle selected.',
        };
        set((s) => ({ outreachTracker: [...s.outreachTracker, entry] }));
      },

      addTrackerEntry(entry) {
        set((s) => ({ outreachTracker: [...s.outreachTracker, entry] }));
      },

      updateTrackerEntry(entryId, partial) {
        const state = get();
        const updated = state.outreachTracker.map((e) =>
          e.id === entryId ? { ...e, ...partial } : e,
        );
        set({ outreachTracker: updated });
      },

      deleteTrackerEntry(entryId) {
        set((s) => ({
          outreachTracker: s.outreachTracker.filter((e) => e.id !== entryId),
        }));
      },

      generateOutreachReport() {
        const state = get();
        const ctx = state.prospectContext;
        const goal = state.outreachGoal;
        const selectedAngle = state.personalizationAngles.find((a) => a.selected);
        const selectedDraft = state.messageDrafts.find((d) => d.id === state.selectedMessageDraftId);
        const seq = state.followUpSequence ?? [];
        const replies = state.objectionReplies ?? [];
        const tracker = state.outreachTracker ?? [];
        const isSample = ctx?.isSampleProspect ?? false;
        const serviceId = state.phase5Service;
        const niche = state.phase5Niche ?? '';
        const nicheKey = getNicheKey(niche);

        const cleanCtx = getCleanOutreachContext(state);

        const prospectWarning = isSample ? '\n\n> **Note:** Sample prospect used for practice. Replace this with a real prospect before sending.' : '';

        let prospectName = ctx?.prospectName ?? '';
        let companyOrChannelName = ctx?.companyOrChannelName ?? '';
        let visibleProblem = ctx?.visibleProblem ?? '';
        let reasonToContact = ctx?.reasonToContact ?? '';
        let recommendedAsset = ctx?.recommendedAsset ?? '';
        let platform = ctx?.platform ?? '';

        if (isSample && serviceId && nicheKey) {
          const fallback = generateSampleProspectForService(serviceId, nicheKey);
          const DEFAULT_PROBLEM = 'They show a visible problem related to your selected service.';
          const DEFAULT_REASON = 'There is a clear fit between their need and your offer.';
          const DEFAULT_ASSET = 'Sample Project';
          if (visibleProblem === DEFAULT_PROBLEM || !visibleProblem) visibleProblem = fallback.visibleProblem;
          if (reasonToContact === DEFAULT_REASON || !reasonToContact) reasonToContact = fallback.reasonToContact;
          if (recommendedAsset === DEFAULT_ASSET || !recommendedAsset) recommendedAsset = fallback.recommendedAsset;
          if (!prospectName || prospectName === 'Sample prospect') prospectName = fallback.prospectName;
          if (!companyOrChannelName) companyOrChannelName = fallback.companyOrChannelName ?? '';
          if (!platform) platform = fallback.platform;
        }

        const assetWarning = (isSample || !state.phase5PortfolioAsset) ? '\n\n> **Note:** Sample project / practice asset.' : '';

        const goalSummary = goal
          ? `**Goal type:** ${goal.label}\n**Tone:** ${goal.selectedTone}\n**CTA style:** ${goal.ctaStyle}\n**Risk level:** ${goal.riskLevel}\n**Recommended channels:** ${goal.recommendedChannels.join(', ')}`
          : 'No goal selected.';

        const prospectSummary = ctx
          ? `**Name:** ${sanitizeText(prospectName, cleanCtx)}\n**Company/Channel:** ${sanitizeText(companyOrChannelName, cleanCtx) || 'N/A'}\n**Platform:** ${platform}\n**Website/Profile:** ${ctx.websiteOrProfileUrl || 'N/A'}\n**Visible problem:** ${sanitizeText(visibleProblem, cleanCtx)}\n**Reason to contact:** ${sanitizeText(reasonToContact, cleanCtx)}\n**Lead score:** ${ctx.leadScore}\n**Priority:** ${ctx.priority}\n**Recommended asset:** ${sanitizeText(recommendedAsset, cleanCtx)}${prospectWarning}`
          : 'No prospect selected.';

        const angleSummary = selectedAngle
          ? `**Angle:** ${selectedAngle.angleName}\n**Why it fits:** ${sanitizeText(selectedAngle.whyItFits, cleanCtx)}\n**Message hook:** ${sanitizeText(selectedAngle.messageHook, cleanCtx)}\n**Best channels:** ${selectedAngle.bestChannel.join(', ')}\n**Risk level:** ${selectedAngle.riskLevel}${assetWarning}`
          : 'No angle selected.';

        const messageSummary = selectedDraft
          ? `**Channel:** ${selectedDraft.label}\n${selectedDraft.subject ? `**Subject:** ${sanitizeText(selectedDraft.subject, cleanCtx)}\n` : ''}**Message:**\n\n${sanitizeText(selectedDraft.message, cleanCtx)}\n\n**CTA:** ${sanitizeText(selectedDraft.cta, cleanCtx)}`
          : 'No message draft selected.';

        const followUpSummary = seq.length > 0
          ? seq.map((m) => `### ${m.sequenceStep}. ${m.label} (${m.timing})\n\n${sanitizeText(m.message, cleanCtx)}`).join('\n\n')
          : 'No follow-up sequence generated.';

        const objectionSummary = replies.length > 0
          ? replies.map((r) => `### ${r.label}\n\n**Prospect says:** ${r.prospectSays}\n\n**Reply:** ${sanitizeText(r.reply, cleanCtx)}\n\n**Strategy:** ${r.strategy}`).join('\n\n')
          : 'No objection replies generated.';

        const validTrackerEntries = tracker.filter((e) => e.prospectName?.trim());
        const trackerSummary = validTrackerEntries.length > 0
          ? validTrackerEntries.map((e) => `- **${sanitizeText(e.prospectName, cleanCtx)}** — ${e.platform} — Status: ${e.status}${e.followUpDate ? ` — Follow-up: ${e.followUpDate}` : ''}${e.nextStep ? ` — Next: ${sanitizeText(e.nextStep, cleanCtx)}` : ''}`).join('\n')
          : 'No valid tracker entries yet. Generate or add a tracker entry before using this report operationally.';

        const nextActions = isSample
          ? [
              'Replace the sample prospect with a real prospect before sending.',
              'Review and personalize the selected message.',
              'Manually send the message on the selected platform.',
              'Update the tracker after sending.',
              seq.length > 0 ? `If there is no reply after 2-3 days, use Follow-Up 1 ("${seq[0].label}").` : 'Generate a follow-up sequence in Step 5, then send the message manually.',
            ]
          : [
              'Review and personalize the selected message before sending.',
              'Manually send the message on the selected platform.',
              'Update the tracker status after sending.',
              seq.length > 0 ? `If there is no reply after 2-3 days, use Follow-Up 1 ("${seq[0].label}").` : 'Generate a follow-up sequence in Step 5.',
              'If they reply, use the objection-safe reply bank to respond calmly.',
            ];

        const markdown = [
          '# Outreach Engine Report',
          '',
          `Generated: ${new Date().toISOString().split('T')[0]}`,
          '',
          '---',
          '',
          '## 1. Outreach Goal',
          '',
          goalSummary,
          '',
          '---',
          '',
          '## 2. Prospect Context',
          '',
          prospectSummary,
          '',
          '---',
          '',
          '## 3. Personalization Angle',
          '',
          angleSummary,
          '',
          '---',
          '',
          '## 4. First Message Draft',
          '',
          messageSummary,
          '',
          '---',
          '',
          '## 5. Follow-Up Sequence',
          '',
          followUpSummary,
          '',
          '---',
          '',
          '## 6. Objection-Safe Reply Bank',
          '',
          objectionSummary,
          '',
          '---',
          '',
          '## 7. Outreach Tracker',
          '',
          trackerSummary,
          '',
          '---',
          '',
          '## 8. Next Actions',
          '',
          nextActions.map((a, i) => `${i + 1}. ${a}`).join('\n'),
        ].join('\n');

        const now = new Date().toISOString();
        set({
          outreachReport: {
            generatedAt: now,
            outreachGoalSummary: goalSummary,
            prospectSummary,
            selectedAngleSummary: angleSummary,
            selectedMessageSummary: messageSummary,
            followUpSummary,
            objectionReplySummary: objectionSummary,
            trackerSummary,
            nextActions,
            markdown,
          },
        });
      },

      async copyOutreachReport() {
        const state = get();
        if (!state.outreachReport) return;
        try {
          await navigator.clipboard.writeText(state.outreachReport.markdown);
        } catch {
          // ignore
        }
      },

      downloadOutreachReportMarkdown() {
        const state = get();
        if (!state.outreachReport) return;
        const ctx = state.prospectContext;
        const safeName = (ctx?.prospectName ?? 'outreach-engine')
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .slice(0, 40);
        const filename = `outreach-engine-${safeName}-report.md`;
        const blob = new Blob([state.outreachReport.markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      },

      confirmStep() {
        const state = get();
        const step = state.currentStep;
        set((s) => ({
          completedSteps: s.completedSteps.includes(step)
            ? s.completedSteps
            : [...s.completedSteps, step],
        }));
      },

      nextStep() {
        const state = get();
        const currentIdx = getStepIndex(state.currentStep);
        const nextIdx = Math.min(currentIdx + 1, OUTREACH_ENGINE_STEPS.length - 1);
        const nextStep = OUTREACH_ENGINE_STEPS[nextIdx];
        const step = state.currentStep;
        set((s) => ({
          currentStep: nextStep,
          completedSteps: s.completedSteps.includes(step)
            ? s.completedSteps
            : [...s.completedSteps, step],
        }));
      },

      previousStep() {
        const state = get();
        const currentIdx = getStepIndex(state.currentStep);
        const prevIdx = Math.max(currentIdx - 1, 0);
        const prevStep = OUTREACH_ENGINE_STEPS[prevIdx];
        const access = prevIdx === 0 ? { unlocked: true } : canNavigateTo(prevStep, state.completedSteps);
        if (access.unlocked) set({ currentStep: prevStep });
      },

      jumpToStep(step) {
        const state = get();
        const access = canNavigateTo(step, state.completedSteps);
        if (access.unlocked) set({ currentStep: step });
      },

      reset() {
        set({
          phase5Service: null,
          phase5ServiceLabel: null,
          phase5Market: null,
          phase5Niche: null,
          phase5Positioning: '',
          phase5OfferName: '',
          phase5OfferType: null,
          phase5Deliverables: [],
          phase5CorePromise: '',
          phase5AuthorityAngle: '',
          phase5AuthorityProfile: { oneLinePositioning: '', shortBio: '', trustBullets: [], ctaLine: '' },
          phase5PortfolioAsset: '',
          phase5SampleProject: { projectName: '', goal: '' },
          phase5PipelineProspects: [],
          phase5SelectedProspect: null,
          phase5VisibleProblem: '',
          phase5LeadScore: 0,
          phase5Priority: '',
          phase5ReasonToContactLater: '',
          upstreamContext: null,
          upstreamFingerprint: '',
          outreachGoal: null,
          prospectContext: null,
          personalizationAngles: [],
          selectedAngleId: null,
          messageDrafts: [],
          selectedMessageDraftId: null,
          followUpSequence: [],
          selectedFollowUpId: null,
          objectionReplies: [],
          outreachTracker: [],
          outreachReport: null,
          currentStep: 'outreach_goal',
          completedSteps: [],
        });
      },
    }),
    {
      name: 'outreach-engine-progress',
      version: 2,
      migrate: (persisted) => {
        const p = persisted as Record<string, unknown>;
        return {
          ...p,
          followUpSequence: Array.isArray(p.followUpSequence) ? p.followUpSequence : [],
          outreachTracker: Array.isArray(p.outreachTracker) ? p.outreachTracker : [],
          selectedFollowUpId: p.selectedFollowUpId as string | null ?? null,
        } as OutreachEngineState;
      },
      partialize: (state) => ({
        phase5Service: state.phase5Service,
        phase5ServiceLabel: state.phase5ServiceLabel,
        phase5Market: state.phase5Market,
        phase5Niche: state.phase5Niche,
        phase5Positioning: state.phase5Positioning,
        phase5OfferName: state.phase5OfferName,
        phase5OfferType: state.phase5OfferType,
        phase5Deliverables: state.phase5Deliverables,
        phase5CorePromise: state.phase5CorePromise,
        phase5AuthorityAngle: state.phase5AuthorityAngle,
        phase5AuthorityProfile: state.phase5AuthorityProfile,
        phase5PortfolioAsset: state.phase5PortfolioAsset,
        phase5SampleProject: state.phase5SampleProject,
        phase5PipelineProspects: state.phase5PipelineProspects,
        phase5SelectedProspect: state.phase5SelectedProspect,
        phase5VisibleProblem: state.phase5VisibleProblem,
        phase5LeadScore: state.phase5LeadScore,
        phase5Priority: state.phase5Priority,
        phase5ReasonToContactLater: state.phase5ReasonToContactLater,
        upstreamContext: state.upstreamContext,
        upstreamFingerprint: state.upstreamFingerprint,
        outreachGoal: state.outreachGoal,
        prospectContext: state.prospectContext,
        personalizationAngles: state.personalizationAngles,
        selectedAngleId: state.selectedAngleId,
        messageDrafts: state.messageDrafts,
        selectedMessageDraftId: state.selectedMessageDraftId,
        followUpSequence: state.followUpSequence,
        selectedFollowUpId: state.selectedFollowUpId,
        objectionReplies: state.objectionReplies,
        outreachTracker: state.outreachTracker,
        outreachReport: state.outreachReport,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    },
  ),
);
