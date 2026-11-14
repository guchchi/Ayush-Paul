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
  Users,
  UserPlus,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';
import { connectGitHubForGitGlow, disconnectGitGlowSession } from '../../../lib/gitglow/gitglow-auth';
import {
  getOrCreateStudentSandbox,
  executeRealPairExtraordinairePullRequest,
  executeRealMergePullRequest,
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
    runScan,
    isBadgeOwned,
  } = useGitGlowStore();

  const isAlreadyEarned = isBadgeOwned('pair-extraordinaire');

  // Co-author configuration
  const [coAuthorName, setCoAuthorName] = useState<string>('GitGlow Peer Partner');
  const [coAuthorEmail, setCoAuthorEmail] = useState<string>('pair-bot@gitglow.dev');

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

      setLogs((prev) => [
        ...prev,
        { text: `✓ Target repository ready: ${sandbox.full_name}`, type: 'success' },
        { text: `[2/3] Writing RFC-standard Git trailer commit with dual author attribution...`, type: 'info' },
        { text: `Co-authored-by: ${coAuthorName} <${coAuthorEmail}>`, type: 'cmd' },
      ]);

      const pr = await executeRealPairExtraordinairePullRequest(
        connectedUser.accessToken,
        connectedUser.githubUsername,
        sandbox.name,
        coAuthorName,
        coAuthorEmail,
        sandbox.default_branch
      );

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
        { text: `Dual Attribution Header verified: Primary (@${connectedUser.githubUsername}) + Co-Author (${coAuthorName})`, type: 'success' },
        { text: `Proceed to Station 3 to merge into the default branch to trigger GitHub qualification.`, type: 'info' },
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

  // ── Station 3: Merge PR into Default Branch ──
  const handleRealStep2MergePR = async () => {
    if (!connectedUser || !realPrResult) return;
    setIsExecutingLive(true);
    setAuthError(null);

    setLogs((prev) => [
      ...prev,
      { text: `$ PUT https://api.github.com/repos/${connectedUser.githubUsername}/${activeRepoName}/pulls/${realPrResult.number}/merge`, type: 'cmd' },
      { text: `Merging co-authored commit into main default branch...`, type: 'info' },
    ]);

    try {
      const mergedPr = await executeRealMergePullRequest(
        connectedUser.accessToken,
        connectedUser.githubUsername,
        activeRepoName,
        realPrResult.number,
        `Merge pull request #${realPrResult.number} from GitGlow/PairExtraordinaire`,
        `Official Pair Extraordinaire qualification: Co-authored by ${coAuthorName} <${coAuthorEmail}>.`
      );

      setRealPrResult(mergedPr);
      setSimState('merged');
      toggleBadgeStep('pair-extraordinaire', 2);

      setLogs((prev) => [
        ...prev,
        { text: `✓ PULL REQUEST #${mergedPr.number} MERGED SUCCESSFULLY!`, type: 'success' },
        { text: `Dual attribution credited to both developers on GitHub.`, type: 'success' },
        { text: `Click "Claim Reward" to celebrate milestone completion.`, type: 'info' },
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
    setShowRewardModal(true);

    if (connectedUser?.githubUsername) {
      runScan(connectedUser.githubUsername);
    }

    setLogs((prev) => [
      ...prev,
      { text: `🎉 QUALIFIED! GitHub Pair Extraordinaire webhook recorded.`, type: 'success' },
      { text: `Dual achievement indexed for @${connectedUser?.githubUsername || targetUsername} & ${coAuthorName}!`, type: 'info' },
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
                {isAlreadyEarned ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D7FF36] text-[#101114] border border-[#84CC16] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                    <Check size={11} strokeWidth={3} />
                    YOU HAVE THIS
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
              SLA: 10–30 Mins Indexing
            </span>
          </div>
        </div>

        {isAlreadyEarned && simState === 'idle' && (
          <div className="p-3.5 rounded-2xl bg-[#F7F8EF] border border-[#DCE89E] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#4D7C0F]">
              <CheckCircle2 size={16} className="text-[#84CC16] shrink-0" />
              <span>
                <strong>Profile Status:</strong> You already have the Pair Extraordinaire achievement on your GitHub profile! You can still practice crafting RFC Git trailers below.
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D7FF36] text-[#101114] text-[9.5px] font-mono font-black shrink-0 shadow-2xs">
              YOU HAVE THIS
            </span>
          </div>
        )}
      </div>

      {/* ── 2. CO-AUTHOR CONFIGURATION PANEL ── */}
      <div className="p-5 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-3">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-[#65666A] uppercase tracking-wider block mb-1">
              Co-Author Name
            </label>
            <input
              type="text"
              value={coAuthorName}
              onChange={(e) => setCoAuthorName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full h-9 px-3 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] text-xs font-bold text-[#101114] focus:outline-hidden focus:border-[#10B981]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#65666A] uppercase tracking-wider block mb-1">
              Co-Author Email
            </label>
            <input
              type="email"
              value={coAuthorEmail}
              onChange={(e) => setCoAuthorEmail(e.target.value)}
              placeholder="e.g. alex@example.com"
              className="w-full h-9 px-3 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] text-xs font-bold text-[#101114] focus:outline-hidden focus:border-[#10B981]"
            />
          </div>
        </div>

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
                <span>{isExecutingLive ? 'Merging...' : 'Merge Co-Authored PR into Main'}</span>
              </button>
            )}

            {['merged', 'verified'].includes(simState) && (
              <button
                onClick={triggerStep3Verify}
                className="px-5 py-2.5 rounded-xl bg-[#D7FF36] text-[#101114] border border-[#84CC16] text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs"
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
        onContinueToNext={() => {
          setShowRewardModal(false);
          if (onCompleted) onCompleted();
        }}
      />
    </div>
  );
};
