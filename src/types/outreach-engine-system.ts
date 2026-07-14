export const OUTREACH_ENGINE_STEPS = [
  'outreach_goal',
  'prospect_context',
  'personalization_angle',
  'message_builder',
  'follow_up_builder',
  'objection_safe_replies',
  'outreach_tracker',
  'outreach_report',
] as const;

export type OutreachEngineStep = typeof OUTREACH_ENGINE_STEPS[number];

export const GOAL_TYPES = [
  'start_conversation',
  'offer_free_audit',
  'share_sample_project',
  'ask_permission',
  'book_discovery_call',
  'reconnect_warm_lead',
] as const;

export type GoalType = typeof GOAL_TYPES[number];

export interface GoalOption {
  goalType: GoalType;
  label: string;
  description: string;
  bestFor: string[];
  ctaStyle: string;
  riskLevel: 'Very Low' | 'Low' | 'Medium' | 'High';
  recommendedChannels: string[];
}

export interface OutreachGoal {
  goalType: GoalType;
  label: string;
  description: string;
  bestFor: string[];
  ctaStyle: string;
  riskLevel: 'Very Low' | 'Low' | 'Medium' | 'High';
  recommendedChannels: string[];
  selectedTone: 'Friendly' | 'Professional' | 'Direct' | 'Soft';
}

export const GOAL_OPTIONS: GoalOption[] = [
  {
    goalType: 'start_conversation',
    label: 'Start a Conversation',
    description: 'Begin with a light, low-pressure message that opens a conversation.',
    bestFor: ['Cold prospects', 'Beginner freelancers', 'First contact'],
    ctaStyle: 'Ask a simple question.',
    riskLevel: 'Low',
    recommendedChannels: ['LinkedIn', 'Email', 'Twitter/X', 'Instagram DM'],
  },
  {
    goalType: 'offer_free_audit',
    label: 'Offer a Free Audit',
    description: 'Offer to review one visible problem and send useful suggestions.',
    bestFor: ['Websites', 'Landing pages', 'UI/UX', 'Local businesses', 'SaaS', 'Agencies'],
    ctaStyle: 'Ask permission to send 2\u20133 ideas.',
    riskLevel: 'Medium',
    recommendedChannels: ['Email', 'LinkedIn', 'Website contact form'],
  },
  {
    goalType: 'share_sample_project',
    label: 'Share a Relevant Sample Project',
    description: 'Use a portfolio/sample project as proof and connect it to their visible problem.',
    bestFor: ['Beginner freelancers with sample work but no real client results yet'],
    ctaStyle: 'Ask if they want to see the sample.',
    riskLevel: 'Low',
    recommendedChannels: ['LinkedIn', 'Email', 'Portfolio link'],
  },
  {
    goalType: 'ask_permission',
    label: 'Ask Permission to Send Ideas',
    description: 'A very soft outreach style where the user does not pitch directly.',
    bestFor: ['Cold DMs', 'LinkedIn', 'Instagram', 'Twitter/X'],
    ctaStyle: '\u201CWould it be useful if I sent a few ideas?\u201D',
    riskLevel: 'Very Low',
    recommendedChannels: ['LinkedIn DM', 'Instagram DM', 'Twitter/X DM', 'Email'],
  },
  {
    goalType: 'book_discovery_call',
    label: 'Book a Discovery Call',
    description: 'Directly invite the prospect to a short call.',
    bestFor: ['Warm leads', 'High-score prospects', 'People who already showed interest'],
    ctaStyle: 'Ask for a 10\u201315 minute call.',
    riskLevel: 'High',
    recommendedChannels: ['Email', 'LinkedIn', 'Calendly link'],
  },
  {
    goalType: 'reconnect_warm_lead',
    label: 'Reconnect With a Warm Lead',
    description: 'Follow up with someone who already knows the user or has interacted before.',
    bestFor: ['Past conversations', 'Old inquiries', 'Previous contacts'],
    ctaStyle: 'Restart the conversation naturally.',
    riskLevel: 'Low',
    recommendedChannels: ['Email', 'LinkedIn', 'Twitter/X'],
  },
];

export const BEGINNER_SAFE_GOALS: GoalType[] = ['ask_permission', 'share_sample_project', 'start_conversation'];

export interface ProspectContext {
  prospectName: string;
  companyOrChannelName: string;
  platform: string;
  websiteOrProfileUrl: string;
  visibleProblem: string;
  reasonToContact: string;
  leadScore: number;
  priority: 'low' | 'medium' | 'high';
  recommendedAsset: string;
  notes: string;
  isSampleProspect: boolean;
}

export type AngleType = 'problem_first' | 'quick_win' | 'sample_project' | 'permission_based' | 'audit' | 'soft_conversation';

export interface PersonalizationAngle {
  id: string;
  angleName: string;
  angleType: AngleType;
  whyItFits: string;
  messageHook: string;
  bestChannel: string[];
  riskLevel: 'Very Low' | 'Low' | 'Medium' | 'High';
  selected: boolean;
}

export type MessageChannel = 'linkedin_dm' | 'email' | 'instagram_twitter_dm' | 'website_contact_form' | 'community_message';

export interface MessageDraft {
  id: string;
  channel: MessageChannel;
  label: string;
  subject?: string;
  message: string;
  tone: string;
  cta: string;
  riskLevel: 'Very Low' | 'Low' | 'Medium' | 'High';
  bestFor: string;
}

export interface FollowUpMessage {
  id: string;
  sequenceStep: 1 | 2 | 3;
  label: string;
  timing: string;
  message: string;
  purpose: string;
  tone: string;
  riskLevel: 'Very Low' | 'Low' | 'Medium';
}

export interface ObjectionReply {
  id: string;
  objectionType: 'not_interested' | 'send_details' | 'pricing_question' | 'already_have_someone' | 'maybe_later' | 'show_examples' | 'how_it_works';
  label: string;
  prospectSays: string;
  reply: string;
  strategy: string;
  tone: string;
  riskLevel: 'Very Low' | 'Low' | 'Medium';
}

export type TrackerStatus = 'Not Contacted' | 'Draft Ready' | 'Sent' | 'Follow-Up Needed' | 'Replied' | 'Interested' | 'Not Interested' | 'Later' | 'Converted';

export interface OutreachTrackerEntry {
  id: string;
  prospectName: string;
  companyOrChannelName: string;
  platform: string;
  websiteOrProfileUrl?: string;
  messageType: string;
  selectedMessageDraftId?: string;
  dateContacted?: string;
  status: TrackerStatus;
  followUpDate?: string;
  response?: string;
  nextStep?: string;
  notes?: string;
}

export interface OutreachReport {
  generatedAt: string;
  outreachGoalSummary: string;
  prospectSummary: string;
  selectedAngleSummary: string;
  selectedMessageSummary: string;
  followUpSummary: string;
  objectionReplySummary: string;
  trackerSummary: string;
  nextActions: string[];
  markdown: string;
}

export interface OutreachEngineState {
  phase5Service: string | null;
  phase5ServiceLabel: string | null;
  phase5Market: string | null;
  phase5Niche: string | null;
  phase5Positioning: string;
  phase5OfferName: string;
  phase5OfferType: string | null;
  phase5Deliverables: string[];
  phase5CorePromise: string;
  phase5AuthorityAngle: string;
  phase5AuthorityProfile: { oneLinePositioning: string; shortBio: string; trustBullets: string[]; ctaLine: string };
  phase5PortfolioAsset: string;
  phase5SampleProject: { projectName: string; goal: string };
  phase5PipelineProspects: { prospectName: string; visibleProblem: string; score: number; priority: string; platform: string }[];
  phase5SelectedProspect: { prospectName: string; visibleProblem: string; score: number; priority: string; platform: string } | null;
  phase5VisibleProblem: string;
  phase5LeadScore: number;
  phase5Priority: string;
  phase5ReasonToContactLater: string;

  /** Canonical upstream context from Module 5 */
  upstreamContext: Module6UpstreamContext | null;
  /** Deterministic fingerprint for stale-context detection */
  upstreamFingerprint: string;

  outreachGoal: OutreachGoal | null;
  prospectContext: ProspectContext | null;
  personalizationAngles: PersonalizationAngle[];
  selectedAngleId: string | null;
  messageDrafts: MessageDraft[];
  selectedMessageDraftId: string | null;
  followUpSequence: FollowUpMessage[];
  selectedFollowUpId: string | null;
  objectionReplies: ObjectionReply[];
  outreachTracker: OutreachTrackerEntry[];
  outreachReport: OutreachReport | null;

  currentStep: OutreachEngineStep;
  completedSteps: OutreachEngineStep[];

  setPhase5Context(ctx: {
    service: string | null;
    serviceLabel: string | null;
    market: string | null;
    niche: string | null;
    positioning: string;
    offerName: string;
    offerType: string | null;
    deliverables: string[];
    corePromise: string;
    authorityAngle: string;
    authorityProfile: { oneLinePositioning: string; shortBio: string; trustBullets: string[]; ctaLine: string };
    portfolioAsset: string;
    sampleProject: { projectName: string; goal: string };
    pipelineProspects: { prospectName: string; visibleProblem: string; score: number; priority: string; platform: string }[];
  }): void;

  setSelectedProspect(prospect: { prospectName: string; visibleProblem: string; score: number; priority: string; platform: string }): void;

  setOutreachGoal(value: OutreachGoal): void;
  setProspectContext(value: ProspectContext): void;
  selectPipelineProspect(prospectId: number): void;
  updateProspectContext(partial: Partial<ProspectContext>): void;
  generateSampleProspect(): void;
  setPersonalizationAngles(value: PersonalizationAngle[]): void;
  setMessageDrafts(value: MessageDraft[]): void;
  setFollowUpSequence(value: FollowUpMessage[]): void;
  setObjectionReplies(value: ObjectionReply[]): void;
  setOutreachTracker(value: OutreachTrackerEntry[]): void;
  setOutreachReport(value: OutreachReport | null): void;

  generateTrackerFromProspect(): void;
  addTrackerEntry(entry: OutreachTrackerEntry): void;
  updateTrackerEntry(entryId: string, partial: Partial<OutreachTrackerEntry>): void;
  deleteTrackerEntry(entryId: string): void;

  generateOutreachReport(): void;
  copyOutreachReport(): Promise<void>;
  downloadOutreachReportMarkdown(): void;

  generatePersonalizationAngles(): void;
  selectPersonalizationAngle(angleId: string): void;
  updatePersonalizationAngle(angleId: string, partial: Partial<PersonalizationAngle>): void;

  generateMessageDrafts(): void;
  selectMessageDraft(draftId: string): void;
  updateMessageDraft(draftId: string, partial: Partial<MessageDraft>): void;

  generateFollowUpSequence(): void;
  updateFollowUpMessage(messageId: string, partial: Partial<FollowUpMessage>): void;
  selectFollowUpMessage(messageId: string): void;

  generateObjectionReplies(): void;
  updateObjectionReply(replyId: string, partial: Partial<ObjectionReply>): void;

  confirmStep(): void;
  nextStep(): void;
  previousStep(): void;
  jumpToStep(step: OutreachEngineStep): void;
  reset(): void;
  seedDevSampleContext(optionIndex: number): void;

  /** Set canonical upstream context (derives legacy phase5* fields internally) */
  setUpstreamContext(context: Module6UpstreamContext, fingerprint: string): void;
}

export function getStepIndex(step: OutreachEngineStep): number {
  return OUTREACH_ENGINE_STEPS.indexOf(step);
}

export interface StepAccess {
  unlocked: boolean;
  reason?: string;
}

export function canNavigateTo(target: OutreachEngineStep, completedSteps: OutreachEngineStep[]): StepAccess {
  if (target === 'outreach_goal') return { unlocked: true };
  const targetIdx = getStepIndex(target);
  const requiredIdx = targetIdx - 1;
  if (requiredIdx < 0) return { unlocked: true };
  const requiredStep = OUTREACH_ENGINE_STEPS[requiredIdx];
  const isUnlocked = completedSteps.includes(requiredStep);
  return { unlocked: isUnlocked, reason: isUnlocked ? undefined : `Complete "${requiredStep.replace(/_/g, ' ')}" first` };
}

/* ──────────────────────────────────────────────
   Module 6 Upstream Context — consumed from M5
   ────────────────────────────────────────────── */

export interface Module6ProspectContext {
  id: string;
  prospectName: string;
  platform: string;
  websiteUrl: string;
  nicheFit: string;
  visibleProblem: string;
  score: number;
  priority: 'high' | 'medium' | 'low';
  contactAvailable: boolean;
  notes: string;
  status: string;
}

export interface Module6UpstreamContext {
  strategy: {
    serviceId?: string;
    serviceLabel?: string;
    market?: string;
    niche?: string;
    positioning?: string;
    offerName?: string;
    offerType?: string;
    deliverables: string[];
    uniqueMechanism?: string;
    authorityPosition?: string;
    idealProspectProfile: {
      title: string;
      description: string;
      characteristics: string[];
      evidenceOfFit: string[];
    };
    buyingSignals: Array<{
      signal: string;
      whyItMatters: string;
      howToDetect: string;
    }>;
    targetChannels: Array<{
      platform: string;
      channelType: string;
      priority: 'high' | 'medium' | 'low';
      expectedSignal: string;
    }>;
  };
  proof: {
    available: boolean;
    portfolioUrl?: string;
    portfolioHeadline?: string;
    portfolioCta?: string;
    featuredProofId?: string;
    featuredProofTitle?: string;
    featuredProofUrl?: string;
    destination?: string;
  };
  prospecting: {
    readiness: 'ready' | 'limited' | 'blocked';
    readinessReasons: string[];
    priorityRules: Array<{
      factor: string;
      weight: number;
      reason: string;
    }>;
  };
  prospects: Module6ProspectContext[];
}
