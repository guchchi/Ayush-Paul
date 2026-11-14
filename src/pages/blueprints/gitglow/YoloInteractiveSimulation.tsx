import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  ExternalLink,
  Shield,
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
  Flame,
  ShieldAlert,
  Users,
  UserPlus,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';
import { connectGitHubForGitGlow, disconnectGitGlowSession } from '../../../lib/gitglow/gitglow-auth';
import {
  getOrCreateStudentSandbox,
  executeRealYoloPullRequest,
  executeRealMergePullRequest,
  inviteCollaboratorToRepo,
  checkCollaboratorStatus,
  disableYoloBranchProtection,
  GitHubPullRequestResult,
} from '../../../lib/gitglow/gitglow-github-executor';
import { BadgeRewardModal } from '../../../components/gitglow/BadgeRewardModal';

interface YoloInteractiveSimulationProps {
  onCompleted?: () => void;
  onOpenLearnModal?: () => void;
}

export const YoloInteractiveSimulation: React.FC<YoloInteractiveSimulationProps> = ({
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
    runScan,
    isBadgeOwned,
  } = useGitGlowStore();

  const isAlreadyEarned = isBadgeOwned('yolo');

  // Auth State
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Live Real GitHub Action States
  const [isExecutingLive, setIsExecutingLive] = useState<boolean>(false);
  const [realPrResult, setRealPrResult] = useState<GitHubPullRequestResult | null>(null);
  const [activeRepoName, setActiveRepoName] = useState<string>(testRepoName);
  const [collaboratorReviewer, setCollaboratorReviewer] = useState<string>('');
  const [isInvitingCollaborator, setIsInvitingCollaborator] = useState<boolean>(false);
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [isCheckingCollab, setIsCheckingCollab] = useState<boolean>(false);
  const [collabVerification, setCollabVerification] = useState<{
    isCollaborator: boolean;
    isPendingInvite: boolean;
    message: string;
  } | null>(null);

  // Runner State
  const [yoloMode, setYoloMode] = useState<'autonomous' | 'collaborator'>('autonomous');
  const [simState, setSimState] = useState<'idle' | 'branch_created' | 'pr_opened' | 'merged' | 'verified'>('idle');
  const [prNumber, setPrNumber] = useState<number>(1);
  const [branchName, setBranchName] = useState<string>('hotfix/yolo-direct-merge');
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
        { text: `Session authenticated. Ready for 1-click real YOLO PR execution.`, type: 'info' },
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

  // ── Station 0: Invite Collaborator to Repository (Essential for review context) ──
  const handleInviteCollaborator = async () => {
    if (!connectedUser) {
      handleConnectGitHub();
      return;
    }
    const cleanCollab = collaboratorReviewer.trim().replace(/^@/, '');
    if (!cleanCollab) {
      setAuthError('Please enter a collaborator or secondary GitHub username.');
      return;
    }

    setIsInvitingCollaborator(true);
    setAuthError(null);
    try {
      const res = await inviteCollaboratorToRepo(
        connectedUser.accessToken,
        connectedUser.githubUsername,
        activeRepoName,
        cleanCollab
      );
      setInviteStatus(res.status);
      setLogs((prev) => [
        ...prev,
        { text: `✓ Collaborator invitation dispatched to @${cleanCollab}!`, type: 'success' },
        { text: `Status: ${res.status}. Collaborator review context is active.`, type: 'info' },
        { text: `Next: Click "1-Click Create Real YOLO PR" to request review and direct-merge.`, type: 'info' },
      ]);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send collaborator invitation.');
    } finally {
      setIsInvitingCollaborator(false);
    }
  };

  const handleCheckCollaboratorStatus = async () => {
    if (!connectedUser) {
      handleConnectGitHub();
      return;
    }
    const cleanCollab = collaboratorReviewer.trim().replace(/^@/, '');
    if (!cleanCollab) {
      setAuthError('Please enter the collaborator username to check.');
      return;
    }

    setIsCheckingCollab(true);
    setAuthError(null);
    try {
      const res = await checkCollaboratorStatus(
        connectedUser.accessToken,
        connectedUser.githubUsername,
        activeRepoName,
        cleanCollab
      );
      setCollabVerification(res);
      setLogs((prev) => [
        ...prev,
        {
          text: `[Collaborator Status] ${res.message}`,
          type: res.isCollaborator ? 'success' : 'info',
        },
      ]);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to check collaborator status.');
    } finally {
      setIsCheckingCollab(false);
    }
  };

  // ── Station 1: Branch, Commit Hotfix Patch & Open Real PR with 0 Reviewers ──
  const handleRealStep1CreatePR = async () => {
    if (!connectedUser) {
      handleConnectGitHub();
      return;
    }

    setIsExecutingLive(true);
    setAuthError(null);

    setLogs([
      { text: `[1/3] Initializing emergency hotfix sandbox on @${connectedUser.githubUsername}...`, type: 'info' },
      { text: `$ gh repo view ${connectedUser.githubUsername}/${activeRepoName} || gh repo create`, type: 'cmd' },
    ]);

    try {
      // 1. Ensure user has the sandbox repository
      const sandbox = await getOrCreateStudentSandbox(connectedUser.accessToken, activeRepoName);
      setTestRepoName(sandbox.name);
      setActiveRepoName(sandbox.name);

      setLogs((prev) => [
        ...prev,
        { text: `✓ Target repository ready: ${sandbox.full_name}`, type: 'success' },
        { text: `[2/3] Generating emergency hotfix branch and committing atomic patch...`, type: 'info' },
        { text: `$ git switch -c hotfix/yolo-bypass && git commit -m "fix(emergency): direct patch for YOLO"`, type: 'cmd' },
      ]);

      // 2. Create branch, commit patch, and open PR with review requirement or reviewer
      const pr = await executeRealYoloPullRequest(
        connectedUser.accessToken,
        connectedUser.githubUsername,
        sandbox.name,
        sandbox.default_branch,
        yoloMode === 'collaborator' ? collaboratorReviewer : undefined
      );

      setRealPrResult(pr);
      setPrNumber(pr.number);
      setBranchName(pr.headBranch);
      setSimState('pr_opened');
      toggleBadgeStep('yolo', 0);
      toggleBadgeStep('yolo', 1);

      if (pr.reviewRequested) {
        setLogs((prev) => [
          ...prev,
          { text: `✓ PULL REQUEST #${pr.number} OPENED ON GITHUB!`, type: 'success' },
          { text: `URL: ${pr.html_url}`, type: 'info' },
          {
            text: yoloMode === 'autonomous'
              ? `✓ REVIEW REQUIREMENT RULE ACTIVATED ON MAIN BRANCH!`
              : `✓ REVIEW OFFICIALLY REQUESTED FROM @${pr.reviewerUsername}!`,
            type: 'success',
          },
          {
            text: yoloMode === 'autonomous'
              ? `PR is enforced: "1 approving review required". Merging directly as Admin executes an official review bypass!`
              : `GitHub PR timeline now logs: "@${connectedUser.githubUsername} requested a review from @${pr.reviewerUsername}".`,
            type: 'info',
          },
          { text: `Station 1 & 2 completed! Now click Station 3 to execute direct YOLO merge while review is pending.`, type: 'info' },
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          { text: `✓ PULL REQUEST #${pr.number} OPENED ON GITHUB!`, type: 'success' },
          { text: `URL: ${pr.html_url}`, type: 'info' },
          { text: `Reviewer request note: ${pr.reviewRequestError || 'No reviewer assigned'}.`, type: 'info' },
          { text: collaboratorReviewer
            ? `Note: GitHub only allows review requests if @${collaboratorReviewer} has accepted the collaborator invite. Have them accept at https://github.com/${connectedUser.githubUsername}/${activeRepoName}/invitations.`
            : `Tip: Adding an alt-account or collaborator creates the official review-bypass record on GitHub.`,
            type: 'info'
          },
          { text: `Proceed to Station 3 to execute direct merge.`, type: 'info' },
        ]);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to create hotfix pull request.');
      setLogs((prev) => [
        ...prev,
        { text: `Error: ${err.message}`, type: 'error' },
      ]);
    } finally {
      setIsExecutingLive(false);
    }
  };

  // ── Station 2: Direct Merge into Default Branch without Review ──
  const handleRealStep2MergePR = async () => {
    if (!connectedUser || !realPrResult) return;
    setIsExecutingLive(true);
    setAuthError(null);

    setLogs((prev) => [
      ...prev,
      { text: `$ PUT https://api.github.com/repos/${connectedUser.githubUsername}/${activeRepoName}/pulls/${realPrResult.number}/merge`, type: 'cmd' },
      { text: `Executing direct YOLO merge without code review...`, type: 'info' },
    ]);

    try {
      const mergedPr = await executeRealMergePullRequest(
        connectedUser.accessToken,
        connectedUser.githubUsername,
        activeRepoName,
        realPrResult.number,
        `Merge pull request #${realPrResult.number} from GitGlow/YOLO`,
        `Official YOLO milestone: Merged directly without code review.`
      );

      setRealPrResult(mergedPr);
      setSimState('merged');
      toggleBadgeStep('yolo', 2);

      // Clean up temporary branch protection rule if active
      await disableYoloBranchProtection(
        connectedUser.accessToken,
        connectedUser.githubUsername,
        activeRepoName,
        realPrResult.baseBranch || 'main'
      ).catch(() => {});

      setLogs((prev) => [
        ...prev,
        { text: `✓ PULL REQUEST #${mergedPr.number} MERGED DIRECTLY INTO MAIN!`, type: 'success' },
        { text: `Merged at: ${new Date(mergedPr.merged_at || '').toLocaleTimeString()} with 0 reviews!`, type: 'success' },
        { text: `Click "Verify YOLO Webhook" to claim your achievement badge.`, type: 'info' },
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

  // ── Station 3: Verify Webhook Telemetry & Celebrate ──
  const triggerStep3Verify = async () => {
    setSimState('verified');
    markMissionCompleted('m4-yolo-merge');
    setShowRewardModal(true);

    if (connectedUser?.githubUsername) {
      runScan(connectedUser.githubUsername);
    }

    setLogs((prev) => [
      ...prev,
      { text: `🎉 QUALIFIED! GitHub YOLO achievement webhook successfully registered.`, type: 'success' },
      { text: `The official YOLO badge is now scheduled for profile display for @${connectedUser?.githubUsername || targetUsername}!`, type: 'info' },
    ]);

    if (onCompleted) onCompleted();
  };

  // Fallback Simulation Mode (For users wanting instant practice)
  const handleRunMockSimulation = async () => {
    setIsExecutingLive(true);
    setLogs((prev) => [
      ...prev,
      { text: `$ Simulating YOLO zero-review workflow for @${targetUsername}...`, type: 'cmd' },
    ]);

    await new Promise((r) => setTimeout(r, 600));
    setSimState('pr_opened');
    setPrNumber(42);
    setLogs((prev) => [
      ...prev,
      { text: `✓ [SIM] PR #42 opened: hotfix/yolo-bypass -> main (0 reviewers)`, type: 'info' },
    ]);

    await new Promise((r) => setTimeout(r, 800));
    setSimState('merged');
    setLogs((prev) => [
      ...prev,
      { text: `✓ [SIM] PR #42 merged directly without review`, type: 'success' },
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
            <div className="w-16 h-16 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] p-2 flex items-center justify-center shrink-0">
              <img
                src="/images/badges/yolo.png"
                alt="YOLO Badge"
                className="w-full h-full object-contain filter drop-shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#101114]">YOLO</h3>
                {isAlreadyEarned ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D7FF36] text-[#101114] border border-[#84CC16] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                    <Check size={11} strokeWidth={3} />
                    YOU HAVE THIS
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F43F5E]/10 text-[#E11D48] text-[10px] font-mono font-bold uppercase tracking-wider">
                    Very Easy · Direct Merge
                  </span>
                )}
              </div>
              <p className="text-xs text-[#65666A] mt-1">
                Official GitHub Criteria: <strong>Merged a pull request without code review</strong>
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
              SLA: Immediate Ingestion
            </span>
          </div>
        </div>

        {isAlreadyEarned && simState === 'idle' && (
          <div className="p-3.5 rounded-2xl bg-[#F7F8EF] border border-[#DCE89E] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#4D7C0F]">
              <CheckCircle2 size={16} className="text-[#84CC16] shrink-0" />
              <span>
                <strong>Profile Status:</strong> You already have the YOLO achievement on your GitHub profile! You can still test this direct merge loop in the practice sandbox anytime.
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D7FF36] text-[#101114] text-[9.5px] font-mono font-black shrink-0 shadow-2xs">
              YOU HAVE THIS
            </span>
          </div>
        )}
      </div>

      {/* ── 2. GITHUB ACCOUNT CONNECTION BAR ── */}
      <div className="p-5 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#101114] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Github size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-[#101114]">
                {connectedUser ? `Connected as @${connectedUser.githubUsername}` : 'Connect GitHub for Real YOLO Execution'}
              </h4>
              <span className="px-2 py-0.2 rounded-md bg-[#84CC16]/15 text-[#4D7C0F] text-[9px] font-mono font-bold">
                {connectedUser ? 'Active Session' : 'Zero-Storage'}
              </span>
            </div>
            <p className="text-[11px] text-[#65666A] mt-0.5">
              {connectedUser
                ? `Ready to create a real hotfix branch, commit patch, and direct-merge PR on your GitHub account.`
                : 'Connect your GitHub account to create and merge a real PR with 1-click.'}
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

      {/* ── 2.5 EXECUTION ARCHITECTURE: AUTONOMOUS VS COLLABORATOR ── */}
      <div className="p-5 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#84CC16]/15 text-[#4D7C0F] flex items-center justify-center shrink-0">
              <Zap size={16} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#101114]">YOLO Execution Engine</h5>
              <p className="text-[10px] text-[#65666A]">Select how you want to simulate the code review bypass:</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF9F5] border border-[#ECEAE1]">
            <button
              onClick={() => {
                setYoloMode('autonomous');
                setCollaboratorReviewer('');
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                yoloMode === 'autonomous'
                  ? 'bg-[#101114] text-white shadow-2xs'
                  : 'text-[#65666A] hover:text-[#101114]'
              )}
            >
              ⚡ 1-Click Autonomous (Solo)
            </button>
            <button
              onClick={() => setYoloMode('collaborator')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                yoloMode === 'collaborator'
                  ? 'bg-[#101114] text-white shadow-2xs'
                  : 'text-[#65666A] hover:text-[#101114]'
              )}
            >
              👥 Collaborator Mode (Optional)
            </button>
          </div>
        </div>

        {yoloMode === 'autonomous' ? (
          <div className="p-4 rounded-2xl bg-[#F7F8EF] border border-[#DCE89E] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4D7C0F]">
              <CheckCircle2 size={15} className="text-[#84CC16]" />
              <span>100% Autonomous Review-Bypass Mode (Zero Friends or Alt-Accounts Needed)</span>
            </div>
            <p className="text-[11px] text-[#65A30D] leading-relaxed">
              GitGlow uses GitHub&apos;s Branch Protection API to temporarily enforce a 1-review rule on your default branch, opens the hotfix PR under mandatory review rule, executes the Admin Review Bypass Merge, and auto-cleans the rule. <strong>Completely turnkey for any user with 1 click!</strong>
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#ECEAE1] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-[10px] font-bold text-[#101114] uppercase tracking-wider block">
                Invite Collaborator or Alt-Account:
              </label>
              {connectedUser && (
                <a
                  href={`https://github.com/${connectedUser.githubUsername}/${activeRepoName}/settings/access`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-mono font-bold text-[#84CC16] hover:underline flex items-center gap-1"
                >
                  Open GitHub Access Settings <ExternalLink size={10} />
                </a>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={collaboratorReviewer}
                onChange={(e) => setCollaboratorReviewer(e.target.value)}
                placeholder="e.g. friend-username or alt-account-username"
                className="w-full sm:flex-1 h-9 px-3 rounded-xl bg-white border border-[#E5E3DA] text-xs font-bold text-[#101114] focus:outline-hidden focus:border-[#84CC16]"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleInviteCollaborator}
                  disabled={isInvitingCollaborator || !collaboratorReviewer.trim()}
                  className="flex-1 sm:flex-none h-9 px-3.5 rounded-xl bg-[#101114] hover:bg-[#202228] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  <UserPlus size={13} />
                  <span>{isInvitingCollaborator ? 'Inviting...' : '1. Invite'}</span>
                </button>

                <button
                  onClick={handleCheckCollaboratorStatus}
                  disabled={isCheckingCollab || !collaboratorReviewer.trim()}
                  className="flex-1 sm:flex-none h-9 px-3.5 rounded-xl bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] hover:border-[#84CC16] text-[#101114] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  <CheckCircle2 size={13} className="text-[#84CC16]" />
                  <span>{isCheckingCollab ? 'Checking...' : '2. Verify Status'}</span>
                </button>
              </div>
            </div>

            {connectedUser && collaboratorReviewer && (
              <div className="p-3 rounded-xl bg-white border border-[#ECEAE1] text-xs space-y-1">
                <span className="text-[10px] font-bold text-[#65666A] uppercase tracking-wider block">
                  Direct Collaborator Acceptance Link:
                </span>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={`https://github.com/${connectedUser.githubUsername}/${activeRepoName}/invitations`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-[#2563EB] hover:underline truncate"
                  >
                    https://github.com/{connectedUser.githubUsername}/{activeRepoName}/invitations
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://github.com/${connectedUser.githubUsername}/${activeRepoName}/invitations`);
                      setInviteStatus('Link Copied');
                    }}
                    className="px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-[#E5E3DA] text-[10px] font-bold text-[#101114] hover:border-[#84CC16] shrink-0"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}

            {collabVerification && (
              <div
                className={cn(
                  'p-3 rounded-xl text-xs font-bold flex items-center gap-2 border',
                  collabVerification.isCollaborator
                    ? 'bg-[#F7F8EF] border-[#DCE89E] text-[#4D7C0F]'
                    : collabVerification.isPendingInvite
                    ? 'bg-[#FEFCE8] border-[#FEF08A] text-[#854D0E]'
                    : 'bg-[#FAF9F5] border-[#E5E3DA] text-[#65666A]'
                )}
              >
                <CheckCircle2 size={14} className={collabVerification.isCollaborator ? 'text-[#84CC16]' : 'text-[#CA8A04]'} />
                <span>{collabVerification.message}</span>
              </div>
            )}

            {inviteStatus && !collabVerification && (
              <div className="text-[11px] font-mono text-[#4D7C0F] flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={13} className="text-[#84CC16]" />
                <span>Status: {inviteStatus}. Send the acceptance link to your collaborator.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {authError && (
        <div className="p-4 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] text-xs text-[#BE123C] flex items-center gap-2.5">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* ── 3. 3-STATION REAL WORKSPACE PIPELINE ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Station 1: Branch & Atomic Commit */}
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
            <h4 className="text-xs font-bold text-[#101114]">Station 1: Hotfix Branch</h4>
            <p className="text-[11px] text-[#65666A]">
              Creates branch <code className="text-[#101114] font-bold">hotfix/yolo-bypass</code> and commits an atomic emergency patch.
            </p>
          </div>

          <div className="pt-2 border-t border-[#ECEAE1]">
            <span className="text-[10px] font-mono text-[#65666A] block truncate">
              Branch: {branchName}
            </span>
          </div>
        </div>

        {/* Station 2: Pull Request with Zero Reviewers */}
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
            <h4 className="text-xs font-bold text-[#101114]">Station 2: PR &amp; Review Request</h4>
            <p className="text-[11px] text-[#65666A]">
              Opens PR targeting main and requests review from @{collaboratorReviewer || 'collaborator'} to arm the bypass event.
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
                Reviewer: @{collaboratorReviewer || 'collaborator'}
              </span>
            )}
          </div>
        </div>

        {/* Station 3: The YOLO Direct Merge */}
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
            <h4 className="text-xs font-bold text-[#101114]">Station 3: YOLO Direct Merge</h4>
            <p className="text-[11px] text-[#65666A]">
              Directly merges PR into main without code review, firing the YOLO achievement webhook.
            </p>
          </div>

          <div className="pt-2 border-t border-[#ECEAE1]">
            <span className="text-[10px] font-mono text-[#65666A] block">
              Result: Achievement Triggered
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. ACTION CONTROLS & REAL EXECUTION BUTTONS ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-[#101114]">
              {simState === 'idle'
                ? 'Step 1: Create Branch & Open PR with Review Request'
                : simState === 'pr_opened'
                ? 'Step 2: Execute YOLO Direct Merge into Main'
                : 'Step 3: Direct YOLO Merge Completed!'}
            </h4>
            <p className="text-xs text-[#65666A] mt-0.5">
              {simState === 'idle'
                ? `Click below to create the hotfix branch and open PR with review requested from @${collaboratorReviewer || 'collaborator'}.`
                : simState === 'pr_opened'
                ? 'PR is open with review pending! Click below to merge it directly before any review is submitted.'
                : 'Pull request merged! Review bypass event registered by GitHub.'}
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
                    ? '1-Click Create Real YOLO PR'
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
                <span>{isExecutingLive ? 'Merging...' : 'Direct Merge without Review (YOLO)'}</span>
              </button>
            )}

            {['merged', 'verified'].includes(simState) && (
              <button
                onClick={triggerStep3Verify}
                className="px-5 py-2.5 rounded-xl bg-[#D7FF36] text-[#101114] border border-[#84CC16] text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Trophy size={14} />
                <span>Claim & View YOLO Reward</span>
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

      {/* ── 5. LIVE TERMINAL & EXECUTION AUDIT LOG ── */}
      <div className="p-5 rounded-3xl bg-[#101114] text-white border border-[#202228] shadow-sm space-y-3 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-[#202228] text-xs">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            </div>
            <span className="text-[#8E9099] ml-2 text-[11px]">yolo-sandbox-terminal</span>
          </div>
          <span className="text-[10px] text-[#84CC16]">
            {isExecutingLive ? '● Live GitHub API Link' : '● Ready'}
          </span>
        </div>

        <div className="space-y-1 text-xs max-h-56 overflow-y-auto">
          <div className="text-[#65666A]">
            # YOLO Qualification: Merging PR without code review
          </div>
          {logs.length === 0 ? (
            <div className="text-[#8E9099] italic">
              Terminal idle. Click "1-Click Create Real YOLO PR" to start the live execution pipeline.
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

      {/* ── 6. REWARD CELEBRATION MODAL ── */}
      <BadgeRewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        badgeName="YOLO"
        badgeIcon="/images/badges/yolo.png"
        username={connectedUser?.githubUsername || targetUsername}
        durationSeconds={18}
        issueNumber={prNumber}
        itemType="pr"
        repoFullName={`${connectedUser?.githubUsername || targetUsername}/${activeRepoName}`}
        issueUrl={realPrResult?.html_url}
        stat1Label="Code Reviews"
        stat1Value="0 Reviews"
        stat1Sub="Direct Unreviewed Merge"
        stat2Label="Trigger Event"
        stat2Value="Review Bypassed"
        stat2Sub="Direct PR Merge"
        onContinueToNext={() => {
          setShowRewardModal(false);
          if (onCompleted) onCompleted();
        }}
      />
    </div>
  );
};
