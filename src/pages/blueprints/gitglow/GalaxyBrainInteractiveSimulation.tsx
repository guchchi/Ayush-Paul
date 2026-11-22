import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Play,
  RotateCcw,
  Zap,
  LogIn,
  LogOut,
  Github,
  Trophy,
  Clock,
  HelpCircle,
  FileCode2,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';
import { connectGitHubForGitGlow, disconnectGitGlowSession } from '../../../lib/gitglow/gitglow-auth';
import {
  createRealGalaxyDiscussion,
  postDiscussionAnswerComment,
  markRealDiscussionAnswer,
  GalaxyDiscussionResult,
} from '../../../lib/gitglow/gitglow-github-executor';
import { BadgeRewardModal } from '../../../components/gitglow/BadgeRewardModal';

interface GalaxyBrainInteractiveSimulationProps {
  onCompleted?: () => void;
  onOpenLearnModal?: () => void;
}

export const GalaxyBrainInteractiveSimulation: React.FC<GalaxyBrainInteractiveSimulationProps> = ({
  onCompleted,
  onOpenLearnModal,
}) => {
  const {
    connectedUser,
    setConnectedUser,
    logoutGitHub,
    targetUsername,
    isBadgeOwned,
    completedMissionIds,
    markMissionCompleted,
    markBadgeIndexingQueued,
    getBadgeLifecycle,
    toggleBadgeStep,
    runScan,
    refreshLiveAchievements,
  } = useGitGlowStore();

  const lifecycle = getBadgeLifecycle('galaxy-brain');
  const isAlreadyEarned = lifecycle.state === 'live_verified';
  const isMissionCompleted = completedMissionIds.includes('m6-discussion-mastery') || isAlreadyEarned;

  // Interactive Pipeline State
  const [acceptedCount, setAcceptedCount] = useState<number>(isAlreadyEarned || isMissionCompleted ? 2 : 0);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [simState, setSimState] = useState<'idle' | 'discussion_created' | 'answer_submitted' | 'answer_accepted' | 'verified'>(
    isAlreadyEarned || isMissionCompleted ? 'verified' : 'idle'
  );
  const [activeDiscussion, setActiveDiscussion] = useState<GalaxyDiscussionResult | null>(null);
  const [userAnswerText, setUserAnswerText] = useState<string>('');
  const [commentResult, setCommentResult] = useState<{ commentId: string; commentUrl: string } | null>(null);
  const [logs, setLogs] = useState<Array<{ text: string; type?: 'info' | 'success' | 'cmd' | 'error' }>>([]);
  const [isExecutingLive, setIsExecutingLive] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Connect GitHub
  const handleConnectGitHub = async () => {
    setIsConnecting(true);
    setAuthError(null);
    try {
      const user = await connectGitHubForGitGlow();
      setConnectedUser(user);
      setLogs((prev) => [
        ...prev,
        { text: `✓ Authenticated as @${user.githubUsername}`, type: 'success' },
        { text: `Ready to submit discussion answers to GitHub Community Hub.`, type: 'info' },
      ]);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to authenticate with GitHub');
    } finally {
      setIsConnecting(false);
    }
  };

  // Station 1: Bot Creates Discussion on Community Hub
  const handleCreateDiscussion = async () => {
    setIsExecutingLive(true);
    setAuthError(null);
    const roundIdx = acceptedCount; // 0 for Round 1, 1 for Round 2

    setLogs((prev) => [
      ...prev,
      { text: `$ POST https://api.github.com/graphql (mutation: createDiscussion)`, type: 'cmd' },
      { text: `[1/3] Bot @gitglow-agent opening technical Q&A discussion for Round ${roundIdx + 1}/2...`, type: 'info' },
    ]);

    try {
      const discussion = await createRealGalaxyDiscussion(
        connectedUser?.githubUsername || targetUsername,
        roundIdx
      );

      setActiveDiscussion(discussion);
      setUserAnswerText(discussion.suggestedAnswer);
      setSimState('discussion_created');
      toggleBadgeStep('galaxy-brain', 0);

      setLogs((prev) => [
        ...prev,
        { text: `✓ Discussion #${discussion.discussionNumber} created on GitHub: "${discussion.title}"`, type: 'success' },
        { text: `URL: ${discussion.discussionUrl}`, type: 'info' },
        { text: `Proceed to Station 2: Review and submit your solution.`, type: 'info' },
      ]);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to create discussion.');
      setLogs((prev) => [...prev, { text: `Error: ${err.message}`, type: 'error' }]);
    } finally {
      setIsExecutingLive(false);
    }
  };

  // Station 2: Submit Solution Comment to Discussion
  const handleSubmitAnswer = async () => {
    if (!activeDiscussion) return;
    if (!connectedUser) {
      setAuthError('Please connect your GitHub account to post your answer from your profile.');
      return;
    }

    setIsExecutingLive(true);
    setAuthError(null);

    setLogs((prev) => [
      ...prev,
      { text: `$ POST https://api.github.com/graphql (mutation: addDiscussionComment)`, type: 'cmd' },
      { text: `[2/3] Submitting technical solution as @${connectedUser.githubUsername}...`, type: 'info' },
    ]);

    try {
      const comment = await postDiscussionAnswerComment(
        connectedUser.accessToken,
        activeDiscussion.discussionId,
        userAnswerText
      );

      setCommentResult(comment);
      setSimState('answer_submitted');
      toggleBadgeStep('galaxy-brain', 1);

      setLogs((prev) => [
        ...prev,
        { text: `✓ Solution posted successfully on GitHub by @${connectedUser.githubUsername}!`, type: 'success' },
        { text: `Comment URL: ${comment.commentUrl}`, type: 'info' },
        { text: `Proceed to Station 3: Bot will mark your solution as the official Accepted Answer.`, type: 'info' },
      ]);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to post answer.');
      setLogs((prev) => [...prev, { text: `Error: ${err.message}`, type: 'error' }]);
    } finally {
      setIsExecutingLive(false);
    }
  };

  // Station 3: Bot Marks Answer as Accepted
  const handleMarkAccepted = async () => {
    if (!commentResult) return;
    setIsExecutingLive(true);
    setAuthError(null);

    setLogs((prev) => [
      ...prev,
      { text: `$ POST https://api.github.com/graphql (mutation: markDiscussionCommentAsAnswer)`, type: 'cmd' },
      { text: `[3/3] Bot @gitglow-agent marking comment ${commentResult.commentId} as official Answer...`, type: 'info' },
    ]);

    try {
      await markRealDiscussionAnswer(commentResult.commentId);
      const newCount = acceptedCount + 1;
      setAcceptedCount(newCount);

      setLogs((prev) => [
        ...prev,
        { text: `✓ OFFICIAL ACCEPTED ANSWER VERIFIED ON GITHUB!`, type: 'success' },
        { text: `Progress: ${newCount}/2 Accepted Answers earned.`, type: 'info' },
      ]);

      if (newCount >= 2) {
        setSimState('verified');
        markMissionCompleted('m6-discussion-mastery');
        markBadgeIndexingQueued('galaxy-brain', {
          prNumber: activeDiscussion?.discussionNumber,
          prUrl: activeDiscussion?.discussionUrl,
          detail: '2/2 Accepted answers verified in GitHub Discussions via GraphQL.',
          badgeName: 'Galaxy Brain',
        });
        toggleBadgeStep('galaxy-brain', 2);
        setShowRewardModal(true);

        if (connectedUser?.githubUsername || targetUsername) {
          await runScan(connectedUser?.githubUsername || targetUsername);
        }

        setLogs((prev) => [
          ...prev,
          { text: `🎉 GALAXY BRAIN QUALIFIED! 2/2 Accepted answers recorded on GitHub Discussions!`, type: 'success' },
          { text: `Your official Galaxy Brain badge is indexed for @${connectedUser?.githubUsername || targetUsername}.`, type: 'info' },
        ]);

        if (onCompleted) onCompleted();
      } else {
        setSimState('answer_accepted');
        setLogs((prev) => [
          ...prev,
          { text: `Great job! Click "Start Solution 2" below to complete your second required answer.`, type: 'info' },
        ]);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to mark answer as accepted.');
      setLogs((prev) => [...prev, { text: `Error: ${err.message}`, type: 'error' }]);
    } finally {
      setIsExecutingLive(false);
    }
  };

  // Start Second Round (To get 2/2)
  const handleStartRound2 = () => {
    setCurrentRound(2);
    setSimState('idle');
    setActiveDiscussion(null);
    setCommentResult(null);
    setUserAnswerText('');
    setLogs((prev) => [
      ...prev,
      { text: `--- ROUND 2 OF 2: INITIATING SECOND ACCEPTED ANSWER ---`, type: 'info' },
    ]);
  };

  // Reset Simulation
  const handleReset = () => {
    setSimState('idle');
    setActiveDiscussion(null);
    setCommentResult(null);
    setLogs([]);
    setAuthError(null);
  };

  const handleCopyAnswer = () => {
    if (!userAnswerText) return;
    navigator.clipboard.writeText(userAnswerText);
    setCopiedSnippet('answer');
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ── 1. ACTIVE BADGE BANNER & AUTH HEADER ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] p-2 flex items-center justify-center shrink-0">
              <img
                src="/images/badges/galaxy-brain.png"
                alt="Galaxy Brain Badge"
                className="w-full h-full object-contain filter drop-shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#101114]">Galaxy Brain</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] text-[10px] font-black uppercase tracking-wider">
                  {acceptedCount}/2 Accepted Answers
                </span>
                {acceptedCount >= 2 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#D7FF36] text-[#101114] text-[10px] font-bold">
                    QUALIFIED
                  </span>
                )}
              </div>
              <p className="text-xs text-[#65666A] mt-0.5">
                Earned when your technical answers in GitHub Discussions are marked as official accepted solutions.
              </p>
            </div>
          </div>

          {/* GitHub Connection Badge */}
          <div className="flex items-center gap-2">
            {connectedUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DA] text-xs font-mono">
                <img
                  src={connectedUser.avatarUrl || `https://github.com/${connectedUser.githubUsername}.png`}
                  alt={connectedUser.githubUsername}
                  className="w-5 h-5 rounded-full"
                />
                <span className="font-bold text-[#101114]">@{connectedUser.githubUsername}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                <button
                  onClick={logoutGitHub}
                  title="Disconnect session"
                  className="ml-1 text-[#65666A] hover:text-[#EF4444] cursor-pointer"
                >
                  <LogOut size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectGitHub}
                disabled={isConnecting}
                className="px-4 py-2 rounded-2xl bg-[#101114] hover:bg-[#202228] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Github size={14} />
                <span>{isConnecting ? 'Connecting...' : 'Connect GitHub'}</span>
              </button>
            )}

            <a
              href="https://github.com/gitglow-agent/gitglow-community-hub/discussions"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-[#7C3AED] text-[#65666A] hover:text-[#101114] text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>Community Hub</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Progress Bar (0/2 → 1/2 → 2/2) */}
        <div className="pt-2 border-t border-[#ECEAE1] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#101114]">
            <Brain size={15} className="text-[#7C3AED]" />
            <span>Galaxy Brain Progress:</span>
            <span className="font-mono text-[#7C3AED]">{acceptedCount} of 2 Accepted Solutions</span>
          </div>

          <div className="flex-1 max-w-xs h-2 rounded-full bg-[#FAF9F5] border border-[#E5E3DA] overflow-hidden">
            <div
              className="h-full bg-[#7C3AED] transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (acceptedCount / 2) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {authError && (
        <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#DC2626] font-medium flex items-center gap-2">
          <span className="font-bold">Notice:</span> {authError}
        </div>
      )}

      {/* ── 2. THREE-STATION AUTOMATED PIPELINE ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Station 1: Q&A Discussion Generation */}
        <div
          className={cn(
            'p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4',
            ['discussion_created', 'answer_submitted', 'answer_accepted', 'verified'].includes(simState)
              ? 'bg-[#F5F3FF] border-[#7C3AED]'
              : 'bg-white border-[#E5E3DA]'
          )}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-[#101114] text-white flex items-center justify-center text-[11px] font-mono font-bold">
                1
              </span>
              {['discussion_created', 'answer_submitted', 'answer_accepted', 'verified'].includes(simState) && (
                <CheckCircle2 size={18} className="text-[#7C3AED]" />
              )}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">Station 1: Bot Creates Q&amp;A</h4>
            <p className="text-[11px] text-[#65666A] leading-relaxed">
              Bot @gitglow-agent posts a technical question on the Community Hub under the Q&amp;A category.
            </p>
          </div>

          <div className="pt-2 border-t border-[#ECEAE1]">
            {activeDiscussion ? (
              <a
                href={activeDiscussion.discussionUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-[#7C3AED] hover:underline flex items-center gap-1 font-bold truncate"
              >
                Discussion #{activeDiscussion.discussionNumber} on GitHub <ExternalLink size={10} />
              </a>
            ) : (
              <span className="text-[10px] font-mono text-[#65666A]">
                Target: gitglow-community-hub
              </span>
            )}
          </div>
        </div>

        {/* Station 2: Submit Solution */}
        <div
          className={cn(
            'p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4',
            ['answer_submitted', 'answer_accepted', 'verified'].includes(simState)
              ? 'bg-[#F5F3FF] border-[#7C3AED]'
              : 'bg-white border-[#E5E3DA]'
          )}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-[#101114] text-white flex items-center justify-center text-[11px] font-mono font-bold">
                2
              </span>
              {['answer_submitted', 'answer_accepted', 'verified'].includes(simState) && (
                <CheckCircle2 size={18} className="text-[#7C3AED]" />
              )}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">Station 2: Post Verified Solution</h4>
            <p className="text-[11px] text-[#65666A] leading-relaxed">
              Submit your technical answer to the discussion. Authenticated via your personal GitHub account.
            </p>
          </div>

          <div className="pt-2 border-t border-[#ECEAE1]">
            {commentResult ? (
              <a
                href={commentResult.commentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-[#7C3AED] hover:underline flex items-center gap-1 font-bold"
              >
                Answer Comment on GitHub <ExternalLink size={10} />
              </a>
            ) : (
              <span className="text-[10px] font-mono text-[#65666A]">
                Author: @{connectedUser?.githubUsername || 'connected-user'}
              </span>
            )}
          </div>
        </div>

        {/* Station 3: Bot Accepts Answer */}
        <div
          className={cn(
            'p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4',
            ['answer_accepted', 'verified'].includes(simState)
              ? 'bg-[#F7F8EF] border-[#84CC16]'
              : 'bg-white border-[#E5E3DA]'
          )}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-[#101114] text-white flex items-center justify-center text-[11px] font-mono font-bold">
                3
              </span>
              {['answer_accepted', 'verified'].includes(simState) && (
                <CheckCircle2 size={18} className="text-[#84CC16]" />
              )}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">Station 3: Mark as Answer</h4>
            <p className="text-[11px] text-[#65666A] leading-relaxed">
              Bot maintainer marks your comment as the official Accepted Solution via GitHub GraphQL.
            </p>
          </div>

          <div className="pt-2 border-t border-[#ECEAE1]">
            <span className="text-[10px] font-mono text-[#65666A] block">
              Result: {acceptedCount}/2 Accepted Answers
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. INTERACTIVE WORKSPACE & SOLUTION EDITOR ── */}
      {simState === 'discussion_created' && activeDiscussion && (
        <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#ECEAE1]">
            <div>
              <span className="text-[10px] font-mono text-[#7C3AED] uppercase font-bold">
                Active GitHub Discussion #{activeDiscussion.discussionNumber}
              </span>
              <h4 className="text-sm font-bold text-[#101114] mt-0.5">{activeDiscussion.title}</h4>
            </div>

            <a
              href={activeDiscussion.discussionUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View on GitHub</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#101114] flex items-center gap-1.5">
                <FileCode2 size={13} className="text-[#84CC16]" />
                <span>Verified Solution (Ready to submit to GitHub)</span>
              </label>
              <button
                onClick={handleCopyAnswer}
                className="text-[11px] font-mono text-[#65666A] hover:text-[#101114] flex items-center gap-1 cursor-pointer"
              >
                {copiedSnippet === 'answer' ? <Check size={12} className="text-[#84CC16]" /> : <Copy size={12} />}
                <span>{copiedSnippet === 'answer' ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={userAnswerText}
              onChange={(e) => setUserAnswerText(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DA] text-xs font-mono text-[#101114] focus:outline-hidden focus:border-[#7C3AED]"
            />
          </div>
        </div>
      )}

      {/* ── 4. ACTION CONTROLS & REAL EXECUTION BUTTONS ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-[#101114]">
              {simState === 'idle'
                ? `Step 1: Open Community Discussion (Solution ${acceptedCount + 1} of 2)`
                : simState === 'discussion_created'
                ? 'Step 2: Submit Solution to Discussion'
                : simState === 'answer_submitted'
                ? 'Step 3: Bot Marks Answer as Accepted'
                : simState === 'answer_accepted'
                ? 'Round 1 Complete! Ready for Round 2'
                : 'Galaxy Brain Milestone Qualified!'}
            </h4>
            <p className="text-xs text-[#65666A] mt-0.5">
              {simState === 'idle'
                ? 'Click below to have the bot open an authentic technical question on the community hub.'
                : simState === 'discussion_created'
                ? 'Review your solution above and submit it directly to the discussion.'
                : simState === 'answer_submitted'
                ? 'Solution posted! Click below to have the bot maintainer accept your answer.'
                : simState === 'answer_accepted'
                ? '1 solution accepted! Complete the second solution to claim your badge.'
                : 'All 2 accepted answers registered! Click Claim to view your certificate.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {simState === 'idle' && (
              <button
                onClick={handleCreateDiscussion}
                disabled={isExecutingLive}
                className="px-5 py-2.5 rounded-xl bg-[#101114] hover:bg-[#202228] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Play size={14} className={cn(isExecutingLive && 'animate-spin')} />
                <span>
                  {isExecutingLive
                    ? 'Creating Discussion...'
                    : `1-Click Create Q&A Discussion (${acceptedCount + 1}/2)`}
                </span>
              </button>
            )}

            {simState === 'discussion_created' && (
              <button
                onClick={handleSubmitAnswer}
                disabled={isExecutingLive}
                className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <MessageSquare size={14} />
                <span>{isExecutingLive ? 'Submitting to GitHub...' : 'Submit Verified Solution'}</span>
              </button>
            )}

            {simState === 'answer_submitted' && (
              <button
                onClick={handleMarkAccepted}
                disabled={isExecutingLive}
                className="px-5 py-2.5 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-[#101114] text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50 animate-pulse"
              >
                <CheckCircle2 size={14} />
                <span>{isExecutingLive ? 'Marking Answer...' : '1-Click Bot Accepts Answer'}</span>
              </button>
            )}

            {simState === 'answer_accepted' && acceptedCount < 2 && (
              <button
                onClick={handleStartRound2}
                className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span>Start Solution 2 (Qualify for Galaxy Brain)</span>
                <ArrowRight size={14} />
              </button>
            )}

            {simState === 'verified' && (
              <button
                onClick={() => setShowRewardModal(true)}
                className="px-5 py-2.5 rounded-xl bg-[#D7FF36] hover:bg-[#C9F227] text-[#101114] border border-[#84CC16] text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Trophy size={14} />
                <span>Claim & View Galaxy Brain</span>
              </button>
            )}

            {simState !== 'idle' && (
              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-xl bg-[#FAF9F5] text-[#65666A] hover:text-[#101114] border border-[#E5E3DA] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Reset Workspace"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 5. CLEAN REASSURING DELIVERY NOTICE (When Verified) ── */}
      {simState === 'verified' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-violet-50/90 border border-violet-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="size-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <CheckCircle2 size={20} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-extrabold text-slate-900">All Done! 2/2 Solutions Accepted</h4>
                <span className="px-2 py-0.5 rounded-full bg-violet-200 text-violet-900 text-[10px] font-mono font-bold uppercase">
                  Galaxy Brain Qualified
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed max-w-xl">
                Aapke dono technical answers GitHub Discussions me officially <strong>Accepted Answers</strong> mark ho chuke hain! GitHub ka background worker verify karke <strong>24 se 72 hours ke andar</strong> Galaxy Brain badge aapke profile par araam se display kar dega.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <a
              href="https://github.com/gitglow-agent/gitglow-community-hub/discussions"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#101114] font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs border border-[#E5E3DA]"
            >
              <span>View Discussions on GitHub</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}

      {/* ── 6. LIVE TERMINAL & EXECUTION AUDIT LOG ── */}
      <div className="p-5 rounded-3xl bg-[#101114] text-white border border-[#202228] shadow-sm space-y-3 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-[#202228] text-xs">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            </div>
            <span className="text-[#8E9099] font-bold">gitglow-galaxy-terminal</span>
          </div>
          <span className="text-[10px] text-[#7C3AED]">
            {isExecutingLive ? '● EXECUTING GRAPHQL...' : '● IDLE'}
          </span>
        </div>

        <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto">
          <div className="text-[#65666A]">
            # Galaxy Brain: GitHub Discussions Accepted Solution Pipeline via GraphQL
          </div>
          {logs.length === 0 ? (
            <div className="text-[#8E9099] italic">
              Terminal idle. Click &quot;1-Click Create Q&amp;A Discussion&quot; to begin Round 1.
            </div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className={cn(
                  'leading-relaxed break-all',
                  log.type === 'cmd' && 'text-[#60A5FA]',
                  log.type === 'success' && 'text-[#84CC16] font-bold',
                  log.type === 'error' && 'text-[#F87171] font-bold',
                  log.type === 'info' && 'text-[#E5E7EB]'
                )}
              >
                {log.text}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── 7. REWARD CELEBRATION MODAL ── */}
      <BadgeRewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        badgeName="Galaxy Brain"
        badgeIcon="/images/badges/galaxy-brain.png"
        username={connectedUser?.githubUsername || targetUsername}
        durationSeconds={45}
        issueNumber={activeDiscussion?.discussionNumber || 1}
        itemType="discussion"
        repoFullName="gitglow-agent/gitglow-community-hub"
        issueUrl={activeDiscussion?.discussionUrl}
        stat1Label="Accepted Solutions"
        stat1Value="2 Answers"
        stat1Sub="100% Qualified"
        stat2Label="Category"
        stat2Value="Community Q&A"
        stat2Sub="GraphQL Verified"
        isAsyncIndexerBadge={true}
        slaTime="24–72 Hours"
        onContinueToNext={() => {
          setShowRewardModal(false);
          if (onCompleted) onCompleted();
        }}
      />
    </div>
  );
};
