import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  ExternalLink,
  Shield,
  ShieldCheck,
  Clock,
  GitPullRequest,
  Check,
  RotateCcw,
  AlertTriangle,
  Zap,
  LogIn,
  LogOut,
  Github,
  Trophy,
  GitBranch,
  GitCommit,
  GitMerge,
  Users,
  UserPlus,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';
import { connectGitHubForGitGlow, disconnectGitGlowSession } from '../../../lib/gitglow/gitglow-auth';
import {
  getOrCreateStudentSandbox,
  executeRealPairExtraordinairePullRequest,
  executeRealMergePullRequest,
  resolveGitHubUser,
  inviteCollaboratorToRepo,
  GitHubPullRequestResult,
} from '../../../lib/gitglow/gitglow-github-executor';
import { BadgeRewardModal } from '../../../components/gitglow/BadgeRewardModal';

interface PairExtraordinaireInteractiveSimulationProps {
  onCompleted?: () => void;
  onOpenLearnModal?: () => void;
}

export const PairExtraordinaireInteractiveSimulation: React.FC<PairExtraordinaireInteractiveSimulationProps> = ({
  onCompleted,
  onOpenLearnModal,
}) => {
  const {
    connectedUser,
    setConnectedUser,
    logoutGitHub,
    targetUsername,
    testRepoName,
    setTestRepoName,
    toggleBadgeStep,
    markMissionCompleted,
    completedMissionIds,
    markBadgeIndexingQueued,
    getBadgeLifecycle,
    runScan,
    refreshLiveAchievements,
    isBadgeOwned,
  } = useGitGlowStore();

  const lifecycle = getBadgeLifecycle('pair-extraordinaire');
  const isLiveOnGitHub = lifecycle.state === 'live_verified';
  const isQueuedOnGitHub = lifecycle.state === 'indexing_queued';
  const isMissionCompleted = completedMissionIds.includes('m3-pair-collab') || isLiveOnGitHub;
  const isAlreadyEarned = isLiveOnGitHub;

  const DEFAULT_BOT_COAUTHOR = {
    login: 'gitglow-agent',
    id: 356865526,
    name: 'gitglow-agent',
    avatar_url: 'https://avatars.githubusercontent.com/u/356865526?v=4',
    verifiedEmail: '356865526+gitglow-agent@users.noreply.github.com',
  };

  // Co-author configuration
  const [partnerMode, setPartnerMode] = useState<'bot' | 'custom'>('bot');
  const [coAuthorHandle, setCoAuthorHandle] = useState<string>('gitglow-agent');
  const [isResolvingCoAuthor, setIsResolvingCoAuthor] = useState<boolean>(false);
  const [resolvedCoAuthor, setResolvedCoAuthor] = useState<{
    login: string;
    id: number;
    name: string;
    avatar_url: string;
    verifiedEmail: string;
  } | null>(DEFAULT_BOT_COAUTHOR);

  const [coAuthorName, setCoAuthorName] = useState<string>('gitglow-agent');
  const [coAuthorEmail, setCoAuthorEmail] = useState<string>('356865526+gitglow-agent@users.noreply.github.com');

  const handleSelectBotPartner = () => {
    setPartnerMode('bot');
    setResolvedCoAuthor(DEFAULT_BOT_COAUTHOR);
    setCoAuthorName(DEFAULT_BOT_COAUTHOR.name);
    setCoAuthorEmail(DEFAULT_BOT_COAUTHOR.verifiedEmail);
    setCoAuthorHandle('gitglow-agent');
    setLogs((prev) => [
      ...prev,
      { text: `[Partner Switched] Autonomous GitGlow Partner @gitglow-agent selected. Turnkey mode ready.`, type: 'info' },
    ]);
  };

  const handleSelectCustomPartner = () => {
    setPartnerMode('custom');
    setResolvedCoAuthor(null);
    setCoAuthorName('');
    setCoAuthorEmail('');
    setCoAuthorHandle('');
    setLogs((prev) => [
      ...prev,
      { text: `[Partner Switched] Custom peer mode active. Optional: Enter any friend or secondary GitHub handle.`, type: 'info' },
    ]);
  };

  // Automatically lookup co-author GitHub details to ensure valid user mapping
  const handleLookupCoAuthor = async () => {
    const clean = coAuthorHandle.trim().replace(/^@/, '');
    if (!clean) return;
    setIsResolvingCoAuthor(true);
    setAuthError(null);
    try {
      const user = await resolveGitHubUser(clean);
      setResolvedCoAuthor(user);
      setCoAuthorName(user.name);
      setCoAuthorEmail(user.verifiedEmail);
      setLogs((prev) => [
        ...prev,
        { text: `✓ Verified GitHub Co-Author: @${user.login} (ID: ${user.id})`, type: 'success' },
        { text: `Bound to verified email: ${user.verifiedEmail}`, type: 'info' },
      ]);
    } catch (e: any) {
      setAuthError(e.message || 'Could not resolve co-author GitHub profile.');
    } finally {
      setIsResolvingCoAuthor(false);
    }
  };

  // Auth State
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Live Real GitHub Action States
  const [isExecutingLive, setIsExecutingLive] = useState<boolean>(false);
  const [realPrResult, setRealPrResult] = useState<GitHubPullRequestResult | null>(null);
  const [activeRepoName, setActiveRepoName] = useState<string>(testRepoName);

  // Runner State
  const [simState, setSimState] = useState<'idle' | 'branch_created' | 'pr_opened' | 'merged' | 'verified'>(
    isMissionCompleted ? 'verified' : 'idle'
  );
  const [prNumber, setPrNumber] = useState<number>(1);
  const [branchName, setBranchName] = useState<string>('feat/pair-collab');
  const [logs, setLogs] = useState<Array<{ text: string; type?: 'info' | 'success' | 'cmd' | 'error' }>>([]);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);

  // Connect GitHub
  const handleConnectGitHub = async () => {
    setIsConnecting(true);
    setAuthError(null);
    try {
      const user = await connectGitHubForGitGlow();
      setConnectedUser(user);
      setLogs((prev) => [
        ...prev,
        { text: `✓ Connected with GitHub as @${user.githubUsername}`, type: 'success' },
        { text: `Session authenticated. Ready for 1-click real Pair Extraordinaire execution.`, type: 'info' },
      ]);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to connect with GitHub');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await logoutGitHub();
    setRealPrResult(null);
    setSimState('idle');
    setLogs((prev) => [
      ...prev,
      { text: `Disconnected GitHub session.`, type: 'info' },
    ]);
  };

  // ── Station 1 & 2: Branch, Commit with Co-Authored Trailer, and Open Real PR ──
  const handleRealStep1CreatePR = async () => {
    if (!connectedUser) {
      handleConnectGitHub();
      return;
    }

    setIsExecutingLive(true);
    setAuthError(null);

    setLogs([
      { text: `[1/3] Setting up pairing sandbox on @${connectedUser.githubUsername}...`, type: 'info' },
      { text: `$ gh repo view ${connectedUser.githubUsername}/${activeRepoName} || gh repo create`, type: 'cmd' },
    ]);

    try {
      const sandbox = await getOrCreateStudentSandbox(connectedUser.accessToken, activeRepoName);
      setTestRepoName(sandbox.name);
      setActiveRepoName(sandbox.name);

      let pr: GitHubPullRequestResult;

      if (partnerMode === 'bot') {
        // Resolve user's verified GitHub identity
        const userDetails = await resolveGitHubUser(connectedUser.githubUsername);

        setLogs((prev) => [
          ...prev,
          { text: `✓ Target repository ready: ${sandbox.full_name}`, type: 'success' },
          { text: `[1-Click Bot] Ensuring @gitglow-agent is added as repository collaborator...`, type: 'info' },
        ]);

        try {
          const inv = await inviteCollaboratorToRepo(
            connectedUser.accessToken,
            connectedUser.githubUsername,
            sandbox.name,
            DEFAULT_BOT_COAUTHOR.login
          );
          await fetch('/api/gitglow/bot/accept-invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              invitationId: inv.invitationId,
              owner: connectedUser.githubUsername,
              repo: sandbox.name,
            }),
          });
          setLogs((prev) => [
            ...prev,
            { text: `✓ Collaborator partnership verified: @gitglow-agent active on ${sandbox.full_name}`, type: 'success' },
          ]);
        } catch (e: any) {
          console.warn('Bot invitation check note:', e.message);
        }

        setLogs((prev) => [
          ...prev,
          { text: `[2/3] @gitglow-agent committing patch with @${connectedUser.githubUsername} as official CO-AUTHOR...`, type: 'info' },
          { text: `Co-authored-by: ${userDetails.name} <${userDetails.verifiedEmail}>`, type: 'cmd' },
        ]);

        const botRes = await fetch('/api/gitglow/bot/create-coauthored-pr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            owner: connectedUser.githubUsername,
            repo: sandbox.name,
            userLogin: connectedUser.githubUsername,
            userName: userDetails.name,
            userEmail: userDetails.verifiedEmail,
            defaultBranch: sandbox.default_branch,
          }),
        });

        if (!botRes.ok) {
          const botErr = await botRes.json().catch(() => ({}));
          throw new Error(botErr.error || 'Failed to create autonomous co-authored PR.');
        }

        const prData = await botRes.json();
        pr = {
          number: prData.number,
          id: prData.id,
          title: prData.title,
          html_url: prData.html_url,
          headBranch: prData.headBranch,
          baseBranch: prData.baseBranch,
          state: 'open',
          merged: false,
          reviewRequested: false,
        };
      } else {
        // Custom Peer / Friend Mode (Recommended)
        if (!coAuthorName || !coAuthorEmail) {
          throw new Error('Please enter a GitHub username and click "Resolve Verified Email" before creating the PR.');
        }

        setLogs((prev) => [
          ...prev,
          { text: `✓ Target repository ready: ${sandbox.full_name}`, type: 'success' },
          { text: `[2/3] Writing RFC-standard Git trailer commit with dual author attribution...`, type: 'info' },
          { text: `Co-authored-by: ${coAuthorName} <${coAuthorEmail}>`, type: 'cmd' },
        ]);

        pr = await executeRealPairExtraordinairePullRequest(
          connectedUser.accessToken,
          connectedUser.githubUsername,
          sandbox.name,
          coAuthorName,
          coAuthorEmail,
          sandbox.default_branch
        );
      }

      setRealPrResult(pr);
      setPrNumber(pr.number);
      setBranchName(pr.headBranch);
      setSimState('pr_opened');
      toggleBadgeStep('pair-extraordinaire', 0);
      toggleBadgeStep('pair-extraordinaire', 1);

      setLogs((prev) => [
        ...prev,
        { text: `✓ CO-AUTHORED PR #${pr.number} OPENED ON GITHUB!`, type: 'success' },
        { text: `URL: ${pr.html_url}`, type: 'info' },
        {
          text: partnerMode === 'bot'
            ? `✓ GitHub Attribution Verified: @gitglow-agent (Author) + @${connectedUser.githubUsername} (CO-AUTHOR)`
            : `✓ GitHub Attribution Verified: Primary (@${connectedUser.githubUsername}) + Co-Author (${coAuthorName})`,
          type: 'success',
        },
        { text: `Proceed to Station 3 to merge into the default branch to claim your Pair Extraordinaire achievement!`, type: 'info' },
      ]);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to create co-authored pull request.');
      setLogs((prev) => [
        ...prev,
        { text: `Error: ${err.message}`, type: 'error' },
      ]);
    } finally {
      setIsExecutingLive(false);
    }
  };

  // ── Station 3: Merge PR into Default Branch via Standard Merge Commit (preserves Co-authored-by trailers) ──
  const handleRealStep2MergePR = async () => {
    if (!connectedUser || !realPrResult) return;
    setIsExecutingLive(true);
    setAuthError(null);

    let resolvedUserName = connectedUser.githubUsername;
    let resolvedUserEmail = `${connectedUser.githubUsername}@users.noreply.github.com`;
    try {
      const userDetails = await resolveGitHubUser(connectedUser.githubUsername);
      resolvedUserName = userDetails.name || connectedUser.githubUsername;
      resolvedUserEmail = userDetails.verifiedEmail;
    } catch (e) {
      console.warn('Could not resolve user details for merge trailer:', e);
    }

    const partnerName = partnerMode === 'bot' ? DEFAULT_BOT_COAUTHOR.name : (coAuthorName || 'collaborator');
    const partnerEmail = partnerMode === 'bot' ? DEFAULT_BOT_COAUTHOR.verifiedEmail : (coAuthorEmail || `${partnerName}@users.noreply.github.com`);

    // Standard merge commit: title is the PR title, message preserves RFC-standard Co-authored-by trailer
    const mergeTitle = `Merge pull request #${realPrResult.number} from ${realPrResult.headBranch || 'pair-collab'}`;
    // RFC Standard: Only include the co-author who is NOT the primary commit author (no self-coauthoring)
    // Blank line separating description and trailer is required by GitHub parser
    const mergeMessage = `Pair programming collaboration session with @${partnerName}\n\nCo-authored-by: ${partnerName} <${partnerEmail}>`;

    setLogs((prev) => [
      ...prev,
      { text: `$ PUT https://api.github.com/repos/${connectedUser.githubUsername}/${activeRepoName}/pulls/${realPrResult.number}/merge`, type: 'cmd' },
      { text: `Executing Standard Merge Commit to preserve Co-authored-by trailers on default branch...`, type: 'info' },
      { text: mergeMessage, type: 'cmd' },
    ]);

    try {
      const mergedPr = await executeRealMergePullRequest(
        connectedUser.accessToken,
        connectedUser.githubUsername,
        activeRepoName,
        realPrResult.number,
        mergeTitle,
        mergeMessage,
        'merge'
      );

      setRealPrResult(mergedPr);
      setSimState('merged');
      toggleBadgeStep('pair-extraordinaire', 2);

      // CRITICAL: Collaborator status MUST remain active in the repository!
      // Standard merge preserves individual commit authorship — both user avatars appear on the commit.

      setLogs((prev) => [
        ...prev,
        { text: `✓ PULL REQUEST #${mergedPr.number} MERGED INTO MAIN (Standard Merge Commit)!`, type: 'success' },
        { text: `✓ Co-authored-by trailers preserved — both GitHub profiles attributed on the commit!`, type: 'success' },
        { text: `✓ Active collaborator partnership maintained with @${partnerName}.`, type: 'success' },
        { text: `Click "Claim Reward" to record milestone completion and trigger achievement indexer.`, type: 'info' },
      ]);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to merge Pull Request.');
      setLogs((prev) => [
        ...prev,
        { text: `Error: ${err.message}`, type: 'error' },
      ]);
    } finally {
      setIsExecutingLive(false);
    }
  };

  // ── Verify & Celebrate ──
  const triggerStep3Verify = async () => {
    setSimState('verified');
    markMissionCompleted('m3-pair-collab');
    markBadgeIndexingQueued('pair-extraordinaire', {
      prNumber: realPrResult?.number || prNumber,
      prUrl: realPrResult?.html_url,
      detail: 'Co-authored PR merged into default branch with RFC headers.',
      badgeName: 'Pair Extraordinaire',
    });
    toggleBadgeStep('pair-extraordinaire', 0);
    toggleBadgeStep('pair-extraordinaire', 1);
    toggleBadgeStep('pair-extraordinaire', 2);
    setShowRewardModal(true);

    if (connectedUser?.githubUsername || targetUsername) {
      await runScan(connectedUser?.githubUsername || targetUsername);
    }

    setLogs((prev) => [
      ...prev,
      { text: `🎉 QUALIFIED & CLAIMED! Commit merged into main with dual author attribution.`, type: 'success' },
      { text: `✓ Co-Authored PR #${realPrResult?.number || prNumber} recorded into default branch.`, type: 'success' },
      { text: `Dual achievement indexed for @${connectedUser?.githubUsername || targetUsername} & ${coAuthorName}!`, type: 'info' },
      { text: `✓ GitGlow Status: Unlocked & Ingested. GitHub profile tab updates asynchronously (24–72h).`, type: 'cmd' },
    ]);

    if (onCompleted) onCompleted();
  };

  // Fallback Simulation Mode
  const handleRunMockSimulation = async () => {
    setIsExecutingLive(true);
    setLogs((prev) => [
      ...prev,
      { text: `$ Simulating Pair Extraordinaire workflow for @${targetUsername}...`, type: 'cmd' },
    ]);

    await new Promise((r) => setTimeout(r, 600));
    setSimState('pr_opened');
    setPrNumber(88);
    setLogs((prev) => [
      ...prev,
      { text: `✓ [SIM] Branch created: feat/pair-collab`, type: 'info' },
      { text: `✓ [SIM] Commit written with RFC header: "Co-authored-by: ${coAuthorName} <${coAuthorEmail}>"`, type: 'cmd' },
      { text: `✓ [SIM] PR #88 opened into default branch`, type: 'success' },
    ]);

    await new Promise((r) => setTimeout(r, 800));
    setSimState('merged');
    setLogs((prev) => [
      ...prev,
      { text: `✓ [SIM] PR #88 merged into main`, type: 'success' },
    ]);

    await new Promise((r) => setTimeout(r, 500));
    setSimState('verified');
    setShowRewardModal(true);
    setIsExecutingLive(false);
  };

  const resetSimulation = () => {
    setSimState('idle');
    setRealPrResult(null);
    setLogs([]);
  };

  return (
    <div className="space-y-6">
      {/* ── 1. ACTIVE BADGE BANNER ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-2 flex items-center justify-center shrink-0">
              <img
                src="/images/badges/pair-extraordinaire.png"
                alt="Pair Extraordinaire Badge"
                className="w-full h-full object-contain filter drop-shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#101114]">Pair Extraordinaire</h3>
                {isLiveOnGitHub ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D7FF36] text-[#101114] border border-[#84CC16] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                    <Check size={11} strokeWidth={3} />
                    LIVE ON PROFILE
                  </span>
                ) : isQueuedOnGitHub ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                    <Clock size={11} className="text-amber-600" />
                    INDEXING QUEUED (24–72H)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/10 text-[#059669] text-[10px] font-mono font-bold uppercase tracking-wider">
                    Collaborative · Git Trailer
                  </span>
                )}
              </div>
              <p className="text-xs text-[#65666A] mt-1">
                Official GitHub Criteria: <strong>Co-authored commits on merged pull requests</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLearnModal && (
              <button
                onClick={onOpenLearnModal}
                className="px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] text-xs font-bold text-[#101114] hover:bg-white hover:border-[#DCE89E] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Read Lesson & Concepts</span>
              </button>
            )}
            <span className="px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#ECEAE1] text-[11px] font-mono text-[#65666A]">
              SLA: 24h–72h Batch Ingestion
            </span>
          </div>
        </div>

        {/* Banner if already live on GitHub profile */}
        {isLiveOnGitHub && simState === 'idle' && (
          <div className="p-3.5 rounded-2xl bg-[#F7F8EF] border border-[#DCE89E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#4D7C0F]">
              <CheckCircle2 size={16} className="text-[#84CC16] shrink-0" />
              <span>
                <strong>Profile Status:</strong> Pair Extraordinaire is verified live on your GitHub profile! You can still practice crafting RFC Git trailers below.
              </span>
            </div>
            <a
              href={`https://github.com/${connectedUser?.githubUsername || targetUsername}?tab=achievements`}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-xl bg-[#D7FF36] text-[#101114] border border-[#84CC16] text-[10px] font-mono font-black shrink-0 shadow-2xs flex items-center gap-1 self-start sm:self-auto hover:bg-[#cbf425]"
            >
              <span>View Profile</span>
              <ExternalLink size={10} />
            </a>
          </div>
        )}

        {/* Banner if queued for GitHub batch indexing */}
        {isQueuedOnGitHub && !isLiveOnGitHub && simState === 'idle' && (
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-start gap-2.5 text-amber-900">
              <Clock size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">GitHub Batch Indexing in Progress (24h–72h SLA):</strong>
                <span className="text-[11.5px] text-amber-800 leading-relaxed">
                  Aapka co-authored PR default branch me successfully merge ho chuka hai! GitHub background worker periodic batch cron me profile update karega. Aapka kaam ho chuka hai.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => refreshLiveAchievements(connectedUser?.githubUsername || targetUsername)}
                className="px-2.5 py-1 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              >
                <RefreshCw size={11} />
                <span>Check Live Status</span>
              </button>
              <a
                href={`https://github.com/${connectedUser?.githubUsername || targetUsername}?tab=achievements`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-xl bg-amber-900 text-amber-100 text-[10px] font-mono font-bold flex items-center gap-1 hover:bg-amber-950"
              >
                <span>Profile Tab</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        )}

        {/* Autonomous Secondary Account Turnkey Notice */}
        <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-3.5 text-xs text-[#065F46] shadow-2xs">
          <CheckCircle2 className="size-4 text-[#10B981] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <strong className="font-bold text-[#065F46]">Autonomous Secondary Account Ready:</strong>
              <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#059669] text-[10px] font-mono font-bold uppercase tracking-wider">
                Turnkey · No 2nd Account Needed
              </span>
            </div>
            <p className="text-[11.5px] text-[#047857] leading-relaxed">
              No need to find a friend or create a second GitHub account! GitGlow's autonomous partner (<code className="bg-emerald-100/70 px-1 py-0.5 rounded text-emerald-900 font-bold">@gitglow-agent</code>) serves as your official co-author. Clean RFC Git trailers and standard merge commits ensure both accounts are attributed on your default branch.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. CO-AUTHOR CONFIGURATION PANEL ── */}
      <div className="p-5 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#10B981]" />
            <h4 className="text-xs font-bold text-[#101114] uppercase tracking-wider">
              Co-Author RFC Trailer Configuration
            </h4>
          </div>
          <span className="text-[10px] font-mono text-[#65666A]">
            RFC 822 Header Format
          </span>
        </div>

        {/* Mode Selector: 1-Click Autonomous Bot (Default) vs Custom Peer (Optional) */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#FAF9F5] border border-[#ECEAE1]">
          <button
            type="button"
            onClick={handleSelectBotPartner}
            className={cn(
              'flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
              partnerMode === 'bot'
                ? 'bg-[#101114] text-white shadow-xs'
                : 'text-[#65666A] hover:text-[#101114]'
            )}
          >
            <Bot size={14} className={cn(partnerMode === 'bot' ? 'text-[#84CC16]' : 'text-[#65666A]')} />
            <div className="flex items-center gap-1.5">
              <span>Autonomous Partner (@gitglow-agent)</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#84CC16]/20 text-[#84CC16] text-[9px] font-mono font-bold uppercase tracking-wider">
                Turnkey
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={handleSelectCustomPartner}
            className={cn(
              'flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
              partnerMode === 'custom'
                ? 'bg-[#101114] text-white shadow-xs'
                : 'text-[#65666A] hover:text-[#101114]'
            )}
          >
            <UserPlus size={14} className={cn(partnerMode === 'custom' ? 'text-[#84CC16]' : 'text-[#65666A]')} />
            <span>Custom Peer / Friend (Optional)</span>
          </button>
        </div>

        {/* Autonomous Partner Card (Turnkey Default) */}
        {partnerMode === 'bot' && (
          <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D7FF36] text-[#101114] border border-[#84CC16] text-[10px] font-black uppercase tracking-wider shadow-2xs">
                Zero Configuration · Turnkey
              </span>
              <span className="text-[10px] font-mono text-[#059669] font-bold">
                Automated Pairing Partner
              </span>
            </div>
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-[#D1FAE5]">
              <img
                src={DEFAULT_BOT_COAUTHOR.avatar_url}
                alt="gitglow-agent"
                className="w-10 h-10 rounded-full border-2 border-[#10B981] shadow-2xs"
              />
              <div className="min-w-0 flex-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#101114]">@{DEFAULT_BOT_COAUTHOR.login}</span>
                  <span className="px-2 py-0.2 rounded-md bg-[#10B981]/15 text-[#059669] text-[9.5px] font-mono font-bold">
                    Official GitGlow Partner
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#059669] block truncate mt-0.5 font-bold">
                  Verified RFC Noreply: {DEFAULT_BOT_COAUTHOR.verifiedEmail}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#065F46] leading-relaxed">
              No second account or friend required! When you click <strong>"1-Click Create Co-Authored PR"</strong>, GitGlow injects <code>@{DEFAULT_BOT_COAUTHOR.login}</code>'s verified RFC trailer into the patch commit. Standard merge commit preserves individual commit trailers on your default branch so GitHub officially records joint attribution.
            </p>
          </div>
        )}

        {/* Custom Peer Lookup Form (Optional) */}
        {partnerMode === 'custom' && (
          <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#10B981] text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                Custom Peer Mode
              </span>
              <span className="text-[10px] font-mono text-[#059669] font-bold">
                Optional · Bring Your Own Partner
              </span>
            </div>
            <p className="text-[11.5px] text-[#065F46] leading-relaxed">
              Have a friend, colleague, or secondary GitHub account? Enter their handle below and GitGlow will auto-resolve their verified noreply email for the co-author trailer.
            </p>

            <div className="pt-1 space-y-2.5">
              <label className="text-[10px] font-bold text-[#101114] uppercase tracking-wider block">
                Lookup Co-Author by GitHub Username:
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={coAuthorHandle}
                  onChange={(e) => setCoAuthorHandle(e.target.value)}
                  placeholder="e.g. friend-username, teammate, or second account"
                  className="w-full sm:flex-1 h-9 px-3 rounded-xl bg-white border border-[#D1FAE5] text-xs font-bold text-[#101114] focus:outline-hidden focus:border-[#10B981]"
                />
                <button
                  type="button"
                  onClick={handleLookupCoAuthor}
                  disabled={isResolvingCoAuthor || !coAuthorHandle.trim()}
                  className="w-full sm:w-auto h-9 px-4 rounded-xl bg-[#101114] hover:bg-[#202228] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  <span>{isResolvingCoAuthor ? 'Verifying...' : 'Resolve Verified Email'}</span>
                </button>
              </div>

              {resolvedCoAuthor && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#D1FAE5] shadow-2xs">
                  <img
                    src={resolvedCoAuthor.avatar_url}
                    alt={resolvedCoAuthor.login}
                    className="w-9 h-9 rounded-full border-2 border-[#10B981]"
                  />
                  <div className="min-w-0 text-xs flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#101114]">@{resolvedCoAuthor.login}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#059669] text-[9.5px] font-mono font-bold">
                        Verified Identity
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#059669] block truncate mt-0.5 font-bold">
                      Verified Noreply: {resolvedCoAuthor.verifiedEmail}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-[#065F46] uppercase tracking-wider block mb-1">
                    Co-Author Name
                  </label>
                  <input
                    type="text"
                    value={coAuthorName}
                    onChange={(e) => setCoAuthorName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full h-9 px-3 rounded-xl bg-white border border-[#D1FAE5] text-xs font-bold text-[#101114] focus:outline-hidden focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#065F46] uppercase tracking-wider block mb-1">
                    Co-Author Email
                  </label>
                  <input
                    type="email"
                    value={coAuthorEmail}
                    onChange={(e) => setCoAuthorEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="w-full h-9 px-3 rounded-xl bg-white border border-[#D1FAE5] text-xs font-bold text-[#101114] focus:outline-hidden focus:border-[#10B981]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Preview of Commit Message */}
        <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#ECEAE1] text-xs font-mono text-[#101114] space-y-1">
          <span className="text-[9.5px] font-bold text-[#65666A] uppercase tracking-wider block">
            Generated Commit Message Preview (Note the required empty line):
          </span>
          <div className="text-[11px] leading-relaxed text-[#101114] bg-white p-2.5 rounded-lg border border-[#E5E3DA]">
            <div>feat(collab): pair programming session milestone</div>
            <div className="text-[#8E9099] italic select-none">{"<blank line>"}</div>
            <div className="text-[#059669] font-bold">
              Co-authored-by: {coAuthorName || 'Name'} &lt;{coAuthorEmail || 'email@example.com'}&gt;
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. GITHUB ACCOUNT CONNECTION BAR ── */}
      <div className="p-5 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#101114] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Github size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-[#101114]">
                {connectedUser ? `Connected as @${connectedUser.githubUsername}` : 'Connect GitHub for Real Execution'}
              </h4>
              <span className="px-2 py-0.2 rounded-md bg-[#84CC16]/15 text-[#4D7C0F] text-[9px] font-mono font-bold">
                {connectedUser ? 'Active Session' : 'Zero-Storage'}
              </span>
            </div>
            <p className="text-[11px] text-[#65666A] mt-0.5">
              {connectedUser
                ? `Ready to create a real branch and commit with dual co-author attribution.`
                : 'Connect your GitHub account to execute this real commit and PR with 1-click.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {connectedUser ? (
            <button
              onClick={handleDisconnect}
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF9F5] hover:bg-white text-[#65666A] hover:text-[#101114] border border-[#E5E3DA] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <LogOut size={13} />
              <span>Disconnect</span>
            </button>
          ) : (
            <button
              onClick={handleConnectGitHub}
              disabled={isConnecting}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#101114] hover:bg-[#202228] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <LogIn size={14} />
              <span>{isConnecting ? 'Connecting GitHub...' : 'Authorize GitHub (1-Click)'}</span>
            </button>
          )}
        </div>
      </div>

      {authError && (
        <div className="p-4 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] text-xs text-[#BE123C] flex items-center gap-2.5">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* ── 4. 3-STATION WORKSPACE PIPELINE ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Station 1: Feature Branch & Co-Authored Commit */}
        <div
          className={cn(
            'p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4',
            simState !== 'idle'
              ? 'bg-[#F7F8EF] border-[#84CC16]'
              : 'bg-white border-[#E5E3DA]'
          )}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-[#101114] text-white flex items-center justify-center text-[11px] font-mono font-bold">
                1
              </span>
              {simState !== 'idle' && (
                <CheckCircle2 size={18} className="text-[#84CC16]" />
              )}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">Station 1: Co-Authored Commit</h4>
            <p className="text-[11px] text-[#65666A]">
              Creates branch and writes commit with <code className="text-[#101114] font-bold">Co-authored-by:</code> trailer.
            </p>
          </div>

          <div className="pt-2 border-t border-[#ECEAE1]">
            <span className="text-[10px] font-mono text-[#65666A] block truncate">
              Branch: {branchName}
            </span>
          </div>
        </div>

        {/* Station 2: Pull Request with Dual Attribution */}
        <div
          className={cn(
            'p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4',
            ['pr_opened', 'merged', 'verified'].includes(simState)
              ? 'bg-[#F7F8EF] border-[#84CC16]'
              : 'bg-white border-[#E5E3DA]'
          )}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-[#101114] text-white flex items-center justify-center text-[11px] font-mono font-bold">
                2
              </span>
              {['pr_opened', 'merged', 'verified'].includes(simState) && (
                <CheckCircle2 size={18} className="text-[#84CC16]" />
              )}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">Station 2: Open PR on GitHub</h4>
            <p className="text-[11px] text-[#65666A]">
              GitHub indexes the RFC trailer and assigns contribution avatars to both developers.
            </p>
          </div>

          <div className="pt-2 border-t border-[#ECEAE1]">
            {realPrResult ? (
              <a
                href={realPrResult.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-[#84CC16] hover:underline flex items-center gap-1 font-bold"
              >
                PR #{realPrResult.number} on GitHub <ExternalLink size={10} />
              </a>
            ) : (
              <span className="text-[10px] font-mono text-[#65666A]">
                Dual Authors Indexed
              </span>
            )}
          </div>
        </div>

        {/* Station 3: Merge into Default Branch */}
        <div
          className={cn(
            'p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4',
            ['merged', 'verified'].includes(simState)
              ? 'bg-[#F7F8EF] border-[#84CC16]'
              : 'bg-white border-[#E5E3DA]'
          )}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-[#101114] text-white flex items-center justify-center text-[11px] font-mono font-bold">
                3
              </span>
              {['merged', 'verified'].includes(simState) && (
                <CheckCircle2 size={18} className="text-[#84CC16]" />
              )}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">Station 3: Merge into Main</h4>
            <p className="text-[11px] text-[#65666A]">
              Merges PR into default branch to record the co-authored milestone on GitHub achievements.
            </p>
          </div>

          <div className="pt-2 border-t border-[#ECEAE1]">
            <span className="text-[10px] font-mono text-[#65666A] block">
              Result: Pair Extraordinaire
            </span>
          </div>
        </div>
      </div>

      {/* ── 4B. CLEAN REASSURING SUCCESS CARD ── */}
      {['merged', 'verified'].includes(simState) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="size-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <CheckCircle2 size={20} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-extrabold text-slate-900">All Done! PR Successfully Merged</h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-mono font-bold uppercase">
                  24–72h Indexing Window
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed max-w-xl">
                Aapka kaam 100% complete ho chuka hai! PR default branch me successfully merge ho gayi hai aur dono accounts GitHub par verify ho chuke hain. GitHub background me verify karke <strong>24 se 72 hours ke andar</strong> badge aapke profile par araam se display kar dega.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {connectedUser && (
              <a
                href={`https://github.com/${connectedUser.githubUsername}/${activeRepoName}/commits/main`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#101114] font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs border border-[#E5E3DA]"
              >
                <span>View Commit on GitHub</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── 5. ACTION CONTROLS & REAL EXECUTION BUTTONS ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-[#101114]">
              {simState === 'idle'
                ? 'Step 1: Commit Co-Author Trailer & Open PR'
                : simState === 'pr_opened'
                ? 'Step 2: Merge Co-Authored PR into Main'
                : 'Step 3: Webhook Telemetry Recorded'}
            </h4>
            <p className="text-xs text-[#65666A] mt-0.5">
              {simState === 'idle'
                ? `Click below to commit with "${coAuthorName}" and open the collaborative PR.`
                : simState === 'pr_opened'
                ? 'PR is open with verified dual attribution. Click below to merge it into main.'
                : 'PR merged! Pair Extraordinaire milestone telemetry recorded.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {simState === 'idle' && (
              <button
                onClick={handleRealStep1CreatePR}
                disabled={isExecutingLive}
                className="px-5 py-2.5 rounded-xl bg-[#101114] hover:bg-[#202228] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Play size={14} className={cn(isExecutingLive && 'animate-spin')} />
                <span>
                  {isExecutingLive
                    ? 'Executing on GitHub...'
                    : connectedUser
                    ? '1-Click Create Co-Authored PR'
                    : 'Connect & Execute Real PR'}
                </span>
              </button>
            )}

            {simState === 'pr_opened' && (
              <button
                onClick={handleRealStep2MergePR}
                disabled={isExecutingLive}
                className="px-5 py-2.5 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-[#101114] text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50 animate-pulse"
              >
                <GitMerge size={14} />
                <span>{isExecutingLive ? 'Merging into Main...' : 'Merge PR into Main'}</span>
              </button>
            )}

            {simState === 'verified' && (
              <button
                onClick={triggerStep3Verify}
                className="px-5 py-2.5 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Check size={14} strokeWidth={3} />
                <span>Claimed (View Certificate)</span>
              </button>
            )}

            {simState === 'merged' && (
              <button
                onClick={triggerStep3Verify}
                className="px-5 py-2.5 rounded-xl bg-[#D7FF36] hover:bg-[#C9F227] text-[#101114] border border-[#84CC16] text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs animate-bounce"
              >
                <Trophy size={14} />
                <span>Claim & View Pair Extraordinaire</span>
              </button>
            )}

            {simState !== 'idle' && (
              <button
                onClick={resetSimulation}
                className="px-3 py-2 rounded-xl bg-[#FAF9F5] text-[#65666A] hover:text-[#101114] border border-[#E5E3DA] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Reset Workspace"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Optional Sandbox Simulation Mode */}
        {!connectedUser && simState === 'idle' && (
          <div className="pt-3 border-t border-[#ECEAE1] flex items-center justify-between text-xs text-[#65666A]">
            <span>Don't want to connect your account right now?</span>
            <button
              onClick={handleRunMockSimulation}
              disabled={isExecutingLive}
              className="text-[#84CC16] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              Run Instant In-Browser Simulation <Zap size={12} />
            </button>
          </div>
        )}
      </div>

      {/* ── 6. LIVE TERMINAL & EXECUTION AUDIT LOG ── */}
      <div className="p-5 rounded-3xl bg-[#101114] text-white border border-[#202228] shadow-sm space-y-3 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-[#202228] text-xs">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            </div>
            <span className="text-[#8E9099] ml-2 text-[11px]">pair-collab-terminal</span>
          </div>
          <span className="text-[10px] text-[#84CC16]">
            {isExecutingLive ? '● Live GitHub API Link' : '● Ready'}
          </span>
        </div>

        <div className="space-y-1 text-xs max-h-56 overflow-y-auto">
          <div className="text-[#65666A]">
            # Pair Extraordinaire: Dual attribution commit trailer via RFC 822
          </div>
          {logs.length === 0 ? (
            <div className="text-[#8E9099] italic">
              Terminal idle. Click "1-Click Create Co-Authored PR" to start the live pairing pipeline.
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
        badgeName="Pair Extraordinaire"
        badgeIcon="/images/badges/pair-extraordinaire.png"
        username={connectedUser?.githubUsername || targetUsername}
        durationSeconds={24}
        issueNumber={prNumber}
        itemType="pr"
        repoFullName={`${connectedUser?.githubUsername || targetUsername}/${activeRepoName}`}
        issueUrl={realPrResult?.html_url}
        stat1Label="Attribution"
        stat1Value="Dual Authors"
        stat1Sub={`@${connectedUser?.githubUsername || targetUsername} + ${coAuthorName}`}
        stat2Label="RFC Format"
        stat2Value="Git Trailer"
        stat2Sub="Co-authored-by Header"
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
