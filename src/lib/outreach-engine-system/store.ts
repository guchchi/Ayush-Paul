import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  OutreachEngineState, OutreachEngineStep, OutreachGoal, ProspectContext,
  PersonalizationAngle, MessageDraft, FollowUpMessage, ObjectionReply,
  OutreachTrackerEntry, OutreachReport, AngleType, MessageChannel,
  Module6UpstreamContext,
} from '../../types/outreach-engine-system';
import { OUTREACH_ENGINE_STEPS, canNavigateTo, getStepIndex } from '../../types/outreach-engine-system';
export { canNavigateTo, getStepIndex, OUTREACH_ENGINE_STEPS };

import { getNicheKey, getCleanOutreachContext, sanitizeText } from './context-helper';
import { generateOutreachContextDefaults } from '../blueprint-content';
import { buildGeneratorContext } from './generation-context';
import { generateAngles as generateAnglesPure } from './angle-generator';
import { generateMessageDrafts as generateMessageDraftsPure } from './message-generator';
import { generateFollowUpSequence as generateFollowUpSequencePure } from './followup-generator';
import { generateObjectionReplies as generateObjectionRepliesPure } from './objection-generator';
import type { Module6ProspectContext } from '../../types/outreach-engine-system';

function toModule6ProspectContext(pc: ProspectContext | null): Module6ProspectContext | null {
  if (!pc) return null;
  return {
    id: pc.canonicalProspectId ?? pc.prospectName.replace(/\s+/g, '-').toLowerCase(),
    prospectName: pc.prospectName,
    platform: pc.platform,
    websiteUrl: pc.websiteOrProfileUrl,
    nicheFit: pc.nicheFit ?? '',
    visibleProblem: pc.visibleProblem,
    score: pc.leadScore,
    priority: pc.priority,
    contactAvailable: pc.contactAvailable ?? false,
    notes: pc.notes,
    status: pc.status ?? 'pending',
  };
}

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

/* ──────────────────────────────────────────────
   Legacy generators removed — each superseded by a dedicated pure generator:
     angle-generator.ts, message-generator.ts,
     followup-generator.ts, objection-generator.ts
   ────────────────────────────────────────────── */

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

        // Resolve canonical prospect from upstream context
        const upstream = state.upstreamContext;
        const canonical = upstream?.prospects?.find(
          (pr) => pr.prospectName === prospect.prospectName && pr.platform === prospect.platform,
        ) ?? null;

        if (canonical) {
          // Populate ProspectContext from full canonical data
          set({
            phase5SelectedProspect: prospect,
            phase5VisibleProblem: prospect.visibleProblem,
            phase5LeadScore: prospect.score,
            phase5Priority: prospect.priority,
            prospectContext: {
              prospectName: canonical.prospectName,
              companyOrChannelName: '',
              platform: canonical.platform,
              websiteOrProfileUrl: canonical.websiteUrl,
              visibleProblem: canonical.visibleProblem,
              reasonToContact: state.outreachGoal?.description ?? '',
              leadScore: canonical.score,
              priority: canonical.priority,
              recommendedAsset: state.phase5PortfolioAsset,
              notes: canonical.notes,
              isSampleProspect: false,
              canonicalProspectId: canonical.id,
              nicheFit: canonical.nicheFit,
              contactAvailable: canonical.contactAvailable,
              status: canonical.status,
            },
          });
        } else {
          // Fallback: no canonical match — preserve entered values with honest defaults
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
              contactAvailable: false,
            },
          });
        }
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
        const upstream = state.upstreamContext;
        if (!upstream) return;
        const prospect = toModule6ProspectContext(state.prospectContext);
        const ctx = buildGeneratorContext(upstream, prospect, state.outreachGoal, undefined);
        const angles = generateAnglesPure(ctx);
        // Invalidate downstream content that depended on the previous angle
        set({
          personalizationAngles: angles,
          selectedAngleId: null,
          messageDrafts: [],
          selectedMessageDraftId: null,
          followUpSequence: [],
          selectedFollowUpId: null,
          objectionReplies: [],
          outreachReport: null,
        });
      },

      selectPersonalizationAngle(angleId: string) {
        const state = get();
        const angleChanged = state.selectedAngleId !== angleId;
        const updated = state.personalizationAngles.map((a) => ({
          ...a,
          selected: a.id === angleId,
        }));
        const updates: Record<string, unknown> = {
          personalizationAngles: updated,
          selectedAngleId: angleId,
        };
        // Invalidate downstream content when a different angle is selected
        if (angleChanged) {
          updates.messageDrafts = [];
          updates.selectedMessageDraftId = null;
          updates.followUpSequence = [];
          updates.selectedFollowUpId = null;
          updates.objectionReplies = [];
          updates.outreachReport = null;
        }
        set(updates as Partial<OutreachEngineState>);
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
        const upstream = state.upstreamContext;
        if (!upstream) return;
        const prospect = toModule6ProspectContext(state.prospectContext);
        const selectedAngle = state.personalizationAngles.find((a) => a.selected);
        const ctx = buildGeneratorContext(upstream, prospect, state.outreachGoal, selectedAngle);
        const drafts = generateMessageDraftsPure(ctx);
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
        const upstream = state.upstreamContext;
        if (!upstream) return;
        const prospect = toModule6ProspectContext(state.prospectContext);
        const selectedAngle = state.personalizationAngles.find((a) => a.selected);
        const ctx = buildGeneratorContext(upstream, prospect, state.outreachGoal, selectedAngle);
        const seq = generateFollowUpSequencePure(ctx);
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
        const upstream = state.upstreamContext;
        if (!upstream) return;
        const prospect = toModule6ProspectContext(state.prospectContext);
        const selectedAngle = state.personalizationAngles.find((a) => a.selected);
        const ctx = buildGeneratorContext(upstream, prospect, state.outreachGoal, selectedAngle);
        const replies = generateObjectionRepliesPure(ctx);
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
