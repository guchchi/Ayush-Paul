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
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';
import { connectGitHubForGitGlow, disconnectGitGlowSession } from '../../../lib/gitglow/gitglow-auth';
import {
  getOrCreateStudentSandbox,
  executeRealCreatePullRequest,
  executeRealMergePullRequest,
  GitHubPullRequestResult,
} from '../../../lib/gitglow/gitglow-github-executor';
import { BadgeRewardModal } from '../../../components/gitglow/BadgeRewardModal';

interface PullSharkInteractiveSimulationProps {
  onCompleted?: () => void;
}

export const PullSharkInteractiveSimulation: React.FC<PullSharkInteractiveSimulationProps> = ({
  onCompleted,
}) => {
  const {
    connectedUser,
    setConnectedUser,
    logoutGitHub,
    targetUsername,
    testRepoName,
    setTestRepoName,
    scanAnalysis,
    toggleBadgeStep,
    markMissionCompleted,
    runScan,
  } = useGitGlowStore();

  const isAlreadyEarned = scanAnalysis ? scanAnalysis.pullSharkTier !== 'None' : false;

  // Auth State
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Live Real GitHub Action States
  const [isExecutingLive, setIsExecutingLive] = useState<boolean>(false);
  const [realPrResult, setRealPrResult] = useState<GitHubPullRequestResult | null>(null);
  const [activeRepoName, setActiveRepoName] = useState<string>(testRepoName);

  // Runner State
  const [simState, setSimState] = useState<'idle' | 'branch_created' | 'pr_opened' | 'merged' | 'verified'>('idle');
  const [prNumber, setPrNumber] = useState<number>(1);
  const [branchName, setBranchName] = useState<string>('feat/contributor-profile');
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
        { text: `Session authenticated. Ready for 1-click real PR execution.`, type: 'info' },
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

  // ── Station 1: Branch, Commit Contributor Card & Open Real PR ──
  const handleRealStep1CreatePR = async () => {
    if (!connectedUser) {
      handleConnectGitHub();
      return;
    }
    setIsExecutingLive(true);
    setAuthError(null);

    setLogs((prev) => [
      ...prev,
      { text: `$ Initializing sandbox for @${connectedUser.githubUsername}...`, type: 'cmd' },
    ]);

    try {
      const repoInfo = await getOrCreateStudentSandbox(connectedUser.accessToken, testRepoName);
      setActiveRepoName(repoInfo.name);
      setTestRepoName(repoInfo.name);

      setLogs((prev) => [
        ...prev,
        { text: `✓ Sandbox ready: ${repoInfo.full_name}`, type: 'info' },
        { text: `$ git switch -c feat/gitglow-contributor`, type: 'cmd' },
        { text: `$ Staging contributors/${connectedUser.githubUsername}.json...`, type: 'cmd' },
      ]);

      const pr = await executeRealCreatePullRequest(
        connectedUser.accessToken,
        repoInfo.owner,
        repoInfo.name,
        repoInfo.default_branch
      );

      setRealPrResult(pr);
      setPrNumber(pr.number);
      setBranchName(pr.headBranch);
      setSimState('pr_opened');
      toggleBadgeStep('pull-shark', 0);
      toggleBadgeStep('pull-shark', 1);

      setLogs((prev) => [
        ...prev,
        { text: `✓ REAL PULL REQUEST #${pr.number} OPENED ON GITHUB!`, type: 'success' },
        { text: `URL: ${pr.html_url}`, type: 'info' },
        { text: `Branch: ${pr.headBranch} → ${pr.baseBranch}`, type: 'info' },
        { text: `Proceed to Station 2 to merge and qualify for Pull Shark.`, type: 'info' },
      ]);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to open Pull Request on GitHub.');
      setLogs((prev) => [
        ...prev,
        { text: `Error: ${err.message}`, type: 'error' },
      ]);
    } finally {
      setIsExecutingLive(false);
    }
  };

  // ── Station 2: Merge PR into Default Branch (main) ──
  const handleRealStep2MergePR = async () => {
    if (!connectedUser || !realPrResult) return;
    setIsExecutingLive(true);
    setAuthError(null);

    setLogs((prev) => [
      ...prev,
      { text: `$ PUT https://api.github.com/repos/${connectedUser.githubUsername}/${activeRepoName}/pulls/${realPrResult.number}/merge`, type: 'cmd' },
    ]);

    try {
      const mergedPr = await executeRealMergePullRequest(
        connectedUser.accessToken,
        connectedUser.githubUsername,
        activeRepoName,
        realPrResult.number
      );

      setRealPrResult(mergedPr);
      setSimState('merged');
      toggleBadgeStep('pull-shark', 2);

      setLogs((prev) => [
        ...prev,
        { text: `✓ PULL REQUEST #${mergedPr.number} MERGED INTO MAIN!`, type: 'success' },
        { text: `Merged at: ${new Date(mergedPr.merged_at || '').toLocaleTimeString()}`, type: 'info' },
        { text: `Click "Verify Webhook Telemetry" to claim your achievement reward.`, type: 'info' },
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
    markMissionCompleted('m2-pullshark');
    setShowRewardModal(true);

    if (connectedUser?.githubUsername) {
      runScan(connectedUser.githubUsername);
    }

    setLogs((prev) => [
      ...prev,
      { text: `🎉 QUALIFIED! GitHub webhook event successfully recorded on your repository.`, type: 'success' },
      { text: `The official Pull Shark achievement has been incremented for @${connectedUser?.githubUsername || targetUsername}!`, type: 'info' },
    ]);

    if (onCompleted) onCompleted();
  };

  // Fallback Simulation Mode (If user wants to test without auth first)
  const handleRunMockSimulation = async () => {
    setIsExecutingLive(true);
    setLogs((prev) => [
      ...prev,
      { text: `$ Simulating local PR workflow for @${targetUsername}...`, type: 'cmd' },
    ]);

    await new Promise((r) => setTimeout(r, 600));
    setSimState('pr_opened');
    setPrNumber(1);
    setLogs((prev) => [
      ...prev,
      { text: `✓ [SIM] PR #1 created: feat/gitglow-contributor -> main`, type: 'info' },
    ]);

    await new Promise((r) => setTimeout(r, 800));
    setSimState('merged');
    setLogs((prev) => [
      ...prev,
      { text: `✓ [SIM] PR #1 merged into main default branch`, type: 'success' },
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
    <div className="space-y-6 text-left">
      {/* ── 1. ACTIVE RUN STATUS OVERVIEW CARD ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs',
                simState === 'verified'
                  ? 'bg-[#D7FF36] text-[#101114]'
                  : simState === 'merged' || simState === 'pr_opened'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-[#FAF9F5] border border-[#E5E3DA] text-[#65A30D]'
              )}
            >
              {simState === 'verified' ? (
                <Trophy size={24} />
              ) : simState === 'merged' ? (
                <GitMerge size={24} />
              ) : (
                <GitPullRequest size={24} />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#101114]">
                  {simState === 'idle' && 'Step 1: Open Real Pull Request on GitHub'}
                  {simState === 'pr_opened' && `Pull Request #${prNumber} is Open on GitHub!`}
                  {simState === 'merged' && `PR #${prNumber} Successfully Merged into Main!`}
                  {simState === 'verified' && 'Pull Shark Achievement Unlocked! 🎉'}
                </span>
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase',
                    simState === 'verified'
                      ? 'bg-[#D7FF36] text-[#101114]'
                      : simState === 'merged'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#F7F8EF] text-[#65A30D] border border-[#DCE89E]'
                  )}
                >
                  {simState === 'idle' ? 'Ready to Start' : simState}
                </span>
              </div>
              <p className="text-xs text-[#65666A] mt-1">
                {simState === 'idle' && 'Click Station 1 below to stage your contributor card and open a PR.'}
                {simState === 'pr_opened' && 'PR is waiting. Click "Merge PR into Main" to trigger Pull Shark.'}
                {simState === 'merged' && 'PR merged! Click "Verify Webhook Telemetry" to claim your achievement.'}
                {simState === 'verified' && `GitHub server has registered the merged PR for @${connectedUser?.githubUsername || targetUsername}.`}
              </p>
            </div>
          </div>

          {/* Real PR Link if available */}
          {realPrResult && (
            <a
              href={realPrResult.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-4 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-[#84CC16] text-[#101114] text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-2xs whitespace-nowrap"
            >
              <span>View PR #{realPrResult.number} on GitHub</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
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
                {connectedUser ? `Connected as @${connectedUser.githubUsername}` : 'Connect GitHub for Pull Shark'}
              </h4>
              {connectedUser && (
                <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
              )}
            </div>
            <p className="text-[11px] text-[#65666A] mt-0.5">
              {connectedUser
                ? `Authorized sandbox: ${connectedUser.githubUsername}/${activeRepoName}. 1-click in-app execution enabled.`
                : '1-click popup authorization. No passwords or tokens stored.'}
            </p>
          </div>
        </div>

        <div>
          {connectedUser ? (
            <button
              onClick={handleDisconnect}
              className="h-9 px-4 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-red-300 hover:text-red-600 text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <LogOut size={13} />
              <span>Disconnect</span>
            </button>
          ) : (
            <button
              onClick={handleConnectGitHub}
              disabled={isConnecting}
              className="h-10 px-5 rounded-full bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 border border-[#D7FF36]/40"
            >
              <LogIn size={14} className={cn(isConnecting && 'animate-spin')} />
              <span>{isConnecting ? 'Connecting...' : 'Connect GitHub Account'}</span>
            </button>
          )}
        </div>
      </div>

      {authError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle size={15} className="shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* ── 3. VISUAL 3-STATION FLOW CONTROLLER ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Station 1 Card */}
        <div
          className={cn(
            'p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4',
            simState !== 'idle'
              ? 'bg-[#F7F8EF] border-[#DCE89E]'
              : 'bg-white border-[#E5E3DA] shadow-xs'
          )}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#65A30D] uppercase">Station 01</span>
              {simState !== 'idle' && <Check size={16} className="text-[#84CC16]" />}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">1. Open Contributor PR</h4>
            <p className="text-[11px] text-[#65666A] leading-relaxed">
              Creates a feature branch, commits contributor JSON card, and opens a Pull Request.
            </p>
          </div>

          <button
            onClick={connectedUser ? handleRealStep1CreatePR : handleConnectGitHub}
            disabled={simState !== 'idle' || isExecutingLive}
            className="w-full h-10 rounded-xl bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <GitPullRequest size={13} className={cn(isExecutingLive && 'animate-spin')} />
            <span>
              {simState === 'idle'
                ? connectedUser
                  ? 'Execute: Open Real PR'
                  : 'Connect GitHub to Execute'
                : `PR #${prNumber} Created ✓`}
            </span>
          </button>
        </div>

        {/* Station 2 Card */}
        <div
          className={cn(
            'p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4',
            simState === 'merged' || simState === 'verified'
              ? 'bg-[#F7F8EF] border-[#DCE89E]'
              : simState === 'pr_opened'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-300/50 shadow-md'
              : 'bg-white border-[#E5E3DA] opacity-60'
          )}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#65A30D] uppercase">Station 02</span>
              {(simState === 'merged' || simState === 'verified') && (
                <Check size={16} className="text-[#84CC16]" />
              )}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">2. Merge PR into Main</h4>
            <p className="text-[11px] text-[#65666A] leading-relaxed">
              Merges the Pull Request into default branch. Only merged PRs qualify for Pull Shark.
            </p>
          </div>

          <button
            onClick={connectedUser ? handleRealStep2MergePR : () => {}}
            disabled={simState !== 'pr_opened' || isExecutingLive}
            className="w-full h-10 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <GitMerge size={14} />
            <span>
              {simState === 'pr_opened'
                ? 'Merge PR into Main'
                : simState === 'idle'
                ? 'Waiting for Step 1'
                : `PR #${prNumber} Merged ✓`}
            </span>
          </button>
        </div>

        {/* Station 3 Card */}
        <div
          className={cn(
            'p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4',
            simState === 'verified'
              ? 'bg-[#F7F8EF] border-[#DCE89E]'
              : simState === 'merged'
              ? 'bg-white border-[#84CC16] ring-2 ring-[#84CC16]/40 shadow-md'
              : 'bg-white border-[#E5E3DA] opacity-60'
          )}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#65A30D] uppercase">Station 03</span>
              {simState === 'verified' && <Check size={16} className="text-[#84CC16]" />}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">3. Webhook Telemetry</h4>
            <p className="text-[11px] text-[#65666A] leading-relaxed">
              Verifies event duration with GitHub Achievement ingestion.
            </p>
          </div>

          <button
            onClick={triggerStep3Verify}
            disabled={simState !== 'merged'}
            className="w-full h-10 rounded-xl bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <Shield size={13} />
            <span>
              {simState === 'verified'
                ? 'Webhook Verified! ✓'
                : 'Verify Badge Trigger'}
            </span>
          </button>
        </div>
      </div>

      {/* ── 4. REAL EXECUTION LOG CONSOLE ── */}
      <div className="p-5 rounded-3xl bg-[#101114] text-white border border-[#23262D] space-y-3 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-[#23262D]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="text-[11px] font-mono text-slate-400 ml-1">
              gitglow-runner@{connectedUser ? connectedUser.githubUsername : targetUsername}:{activeRepoName}
            </span>
          </div>

          {logs.length > 0 && (
            <button
              onClick={resetSimulation}
              className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={10} />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="h-44 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1.5 text-slate-300">
          {logs.length === 0 ? (
            <div className="text-slate-500 py-6 text-center">
              {connectedUser
                ? 'Click "Execute: Open Real PR" above to start live Pull Shark execution!'
                : 'Connect your GitHub account above to begin.'}
            </div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className={cn(
                  log.type === 'cmd'
                    ? 'text-emerald-400 font-bold'
                    : log.type === 'success'
                    ? 'text-[#D7FF36] font-bold'
                    : log.type === 'error'
                    ? 'text-rose-400'
                    : 'text-slate-400'
                )}
              >
                {log.text}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── 5. CELEBRATORY BADGE REWARD MODAL ── */}
      <BadgeRewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        badgeName="Pull Shark"
        badgeIcon="/images/badges/pull-shark.png"
        username={connectedUser?.githubUsername || targetUsername}
        issueNumber={realPrResult?.number || prNumber}
        repoFullName={`${connectedUser?.githubUsername || targetUsername}/${activeRepoName}`}
        issueUrl={realPrResult?.html_url}
        itemType="pr"
        stat1Label="PR Pipeline"
        stat1Value="Auto-Merged"
        stat1Sub="Default branch"
        stat2Label="Pull Request"
        stat2Value={`#${realPrResult?.number || prNumber}`}
        stat2Sub="Merged state"
        onContinueToNext={() => {
          setShowRewardModal(false);
          window.location.search = '?badge=pair-extraordinaire';
        }}
      />
    </div>
  );
};

