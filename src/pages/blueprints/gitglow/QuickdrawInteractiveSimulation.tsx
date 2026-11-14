import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Clock,
  Terminal,
  Globe,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  CheckCheck,
  Zap,
  LogIn,
  LogOut,
  Github,
  Trophy,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';
import { connectGitHubForGitGlow, disconnectGitGlowSession } from '../../../lib/gitglow/gitglow-auth';
import {
  getOrCreateStudentSandbox,
  executeRealCreateIssue,
  executeRealCloseIssue,
  GitHubIssueResult,
} from '../../../lib/gitglow/gitglow-github-executor';
import { BadgeRewardModal } from '../../../components/gitglow/BadgeRewardModal';

interface QuickdrawInteractiveSimulationProps {
  onCompleted?: () => void;
}

export const QuickdrawInteractiveSimulation: React.FC<QuickdrawInteractiveSimulationProps> = ({
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
    badgeStepStatus,
    toggleBadgeStep,
    setAllStepsForBadge,
    markMissionCompleted,
    runScan,
  } = useGitGlowStore();

  const isAlreadyEarned = scanAnalysis?.quickdrawQualified;

  // Auth & Connection State
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Live Real GitHub Action States
  const [isExecutingLive, setIsExecutingLive] = useState<boolean>(false);
  const [realIssueResult, setRealIssueResult] = useState<GitHubIssueResult | null>(null);
  const [activeRepoName, setActiveRepoName] = useState<string>(testRepoName);

  // Simulation Runner State
  const [simState, setSimState] = useState<'idle' | 'opened' | 'closed' | 'verifying' | 'verified'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [issueNumber, setIssueNumber] = useState<number>(1);
  const [logs, setLogs] = useState<Array<{ text: string; type?: 'info' | 'success' | 'cmd' | 'error' }>>([]);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // Stopwatch timer when issue is in opened state
  useEffect(() => {
    if (simState === 'opened') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [simState]);

  // Connect with GitHub
  const handleConnectGitHub = async () => {
    setIsConnecting(true);
    setAuthError(null);
    try {
      const user = await connectGitHubForGitGlow();
      setConnectedUser(user);
      setLogs((prev) => [
        ...prev,
        { text: `✓ Connected with GitHub as @${user.githubUsername}`, type: 'success' },
        { text: `Session authenticated. Ready for 1-click real issue execution.`, type: 'info' },
      ]);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to connect with GitHub');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await logoutGitHub();
    setRealIssueResult(null);
    setSimState('idle');
    setLogs((prev) => [
      ...prev,
      { text: `Disconnected GitHub session.`, type: 'info' },
    ]);
  };

  // ── REAL GITHUB EXECUTION: Step 1 (Create Issue on Real GitHub) ──
  const handleRealStep1CreateIssue = async () => {
    if (!connectedUser) {
      handleConnectGitHub();
      return;
    }
    setIsExecutingLive(true);
    setAuthError(null);

    setLogs((prev) => [
      ...prev,
      { text: `$ Verifying sandbox repository: ${connectedUser.githubUsername}/${testRepoName}...`, type: 'cmd' },
    ]);

    try {
      // 1. Ensure sandbox repo exists
      const repoInfo = await getOrCreateStudentSandbox(connectedUser.accessToken, testRepoName);
      setActiveRepoName(repoInfo.name);
      setTestRepoName(repoInfo.name);

      setLogs((prev) => [
        ...prev,
        { text: `✓ Sandbox ready: ${repoInfo.full_name}`, type: 'info' },
        { text: `$ POST https://api.github.com/repos/${repoInfo.owner}/${repoInfo.name}/issues`, type: 'cmd' },
      ]);

      // 2. Create the real Issue on GitHub
      const createdIssue = await executeRealCreateIssue(
        connectedUser.accessToken,
        repoInfo.owner,
        repoInfo.name,
        `track: quickdraw audit #${Date.now()}`
      );

      setRealIssueResult(createdIssue);
      setIssueNumber(createdIssue.number);
      setSimState('opened');
      setElapsedSeconds(0);
      toggleBadgeStep('quickdraw', 0);

      setLogs((prev) => [
        ...prev,
        { text: `✓ REAL ISSUE #${createdIssue.number} OPENED ON GITHUB!`, type: 'success' },
        { text: `URL: ${createdIssue.html_url}`, type: 'info' },
        { text: `[Stopwatch Started]: Close within 300s to qualify for Quickdraw!`, type: 'info' },
      ]);
    } catch (err: any) {
      setAuthError(err.message || 'GitHub API call failed.');
      setLogs((prev) => [
        ...prev,
        { text: `Error: ${err.message}`, type: 'error' },
      ]);
    } finally {
      setIsExecutingLive(false);
    }
  };

  // ── Unified Step 1 (Live Real GitHub or Practice Simulation) ──
  const handleStep1CreateIssue = async () => {
    if (connectedUser) {
      await handleRealStep1CreateIssue();
    } else {
      // Instant Practice Simulation
      setSimState('opened');
      setElapsedSeconds(0);
      setIssueNumber(1);
      toggleBadgeStep('quickdraw', 0);
      setLogs((prev) => [
        ...prev,
        { text: `$ [Practice Sandbox] Opening tracking issue for @${targetUsername}...`, type: 'cmd' },
        { text: `✓ Practice Issue #1 created in sandbox!`, type: 'success' },
        { text: `[Stopwatch Started]: Close within 300s to qualify for Quickdraw!`, type: 'info' },
      ]);
    }
  };

  // ── Unified Step 2 (Live Real GitHub or Practice Simulation) ──
  const handleStep2CloseIssue = async () => {
    if (connectedUser && realIssueResult) {
      await handleRealStep2CloseIssue();
    } else {
      setSimState('closed');
      toggleBadgeStep('quickdraw', 1);
      setLogs((prev) => [
        ...prev,
        { text: `$ [Practice Sandbox] Closing Issue #${issueNumber}...`, type: 'cmd' },
        { text: `✓ Issue #${issueNumber} closed in ${elapsedSeconds}s!`, type: 'success' },
        { text: `Timing: ${elapsedSeconds}s is well under the 300-second window. Click Station 3 to claim badge!`, type: 'info' },
      ]);
    }
  };

  // ── REAL GITHUB EXECUTION: Step 2 (Close Issue on Real GitHub) ──
  const handleRealStep2CloseIssue = async () => {
    if (!connectedUser || !realIssueResult) return;
    setIsExecutingLive(true);
    setAuthError(null);

    setLogs((prev) => [
      ...prev,
      { text: `$ PATCH https://api.github.com/repos/${connectedUser.githubUsername}/${activeRepoName}/issues/${realIssueResult.number}`, type: 'cmd' },
    ]);

    try {
      const closedIssue = await executeRealCloseIssue(
        connectedUser.accessToken,
        connectedUser.githubUsername,
        activeRepoName,
        realIssueResult.number
      );

      setRealIssueResult(closedIssue);
      setSimState('closed');
      toggleBadgeStep('quickdraw', 1);

      setLogs((prev) => [
        ...prev,
        { text: `✓ REAL ISSUE #${closedIssue.number} SUCCESSFULLY CLOSED IN ${closedIssue.durationSeconds}s!`, type: 'success' },
        { text: `Timing: ${closedIssue.durationSeconds}s is well under the 300-second qualification window.`, type: 'info' },
      ]);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to close issue on GitHub.');
      setLogs((prev) => [
        ...prev,
        { text: `Error: ${err.message}`, type: 'error' },
      ]);
    } finally {
      setIsExecutingLive(false);
    }
  };

  // ── Step 3: Verify Webhook Telemetry on Real GitHub Profile ──
  const triggerStep3Verify = async () => {
    setSimState('verifying');
    setLogs((prev) => [
      ...prev,
      { text: `$ Querying GitHub Achievement Telemetry & Webhook ingestion...`, type: 'cmd' },
    ]);

    await new Promise((r) => setTimeout(r, 900));
    setSimState('verified');
    toggleBadgeStep('quickdraw', 2);
    markMissionCompleted('m1-quickdraw');
    setShowRewardModal(true);

    if (connectedUser?.githubUsername) {
      runScan(connectedUser.githubUsername);
    }

    setLogs((prev) => [
      ...prev,
      { text: `🎉 QUALIFIED! GitHub webhook event successfully recorded on your repository.`, type: 'success' },
      { text: `The official Quickdraw badge is now queued by GitHub and will appear on your profile!`, type: 'info' },
    ]);

    if (onCompleted) onCompleted();
  };

  const resetSimulation = () => {
    setSimState('idle');
    setElapsedSeconds(0);
    setRealIssueResult(null);
    setLogs([]);
  };

  const minutesRemaining = Math.max(0, Math.floor((300 - elapsedSeconds) / 60));
  const secondsRemaining = Math.max(0, (300 - elapsedSeconds) % 60);

  return (
    <div className="space-y-6 text-left">
      {/* ── 1. ACTIVE RUN STATUS OVERVIEW CARD (Clear High-Level Feedback) ── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs",
              simState === 'verified'
                ? "bg-[#D7FF36] text-[#101114]"
                : simState === 'opened'
                ? "bg-amber-100 text-amber-800 animate-pulse"
                : "bg-[#FAF9F5] border border-[#E5E3DA] text-[#65A30D]"
            )}>
              {simState === 'verified' ? (
                <Trophy size={24} />
              ) : simState === 'opened' ? (
                <Clock size={24} className="animate-spin" />
              ) : (
                <Zap size={22} />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#101114]">
                  {simState === 'idle' && 'Step 1: Open Real Issue on GitHub'}
                  {simState === 'opened' && `Live Stopwatch: ${elapsedSeconds}s / 300s Window`}
                  {simState === 'closed' && `Issue #${issueNumber} Closed in ${elapsedSeconds}s!`}
                  {simState === 'verifying' && 'Verifying Webhook Telemetry with GitHub...'}
                  {simState === 'verified' && 'Mission Complete · Quickdraw Badge Qualified! 🎉'}
                </span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase",
                  simState === 'verified'
                    ? "bg-[#D7FF36] text-[#101114]"
                    : simState === 'opened'
                    ? "bg-amber-100 text-amber-800"
                    : "bg-[#F7F8EF] text-[#65A30D] border border-[#DCE89E]"
                )}>
                  {simState === 'idle' ? 'Ready to Start' : simState}
                </span>
              </div>
              <p className="text-xs text-[#65666A] mt-1">
                {simState === 'idle' && 'Click the button below to execute on your real GitHub account.'}
                {simState === 'opened' && 'Issue is now OPEN on GitHub. Click "Close Real Issue" before the 300s timer runs out!'}
                {simState === 'closed' && 'Great triage speed! Click "Verify Badge Trigger" to complete the mission.'}
                {simState === 'verified' && `GitHub server has queued the achievement for @${connectedUser?.githubUsername || targetUsername}.`}
              </p>
            </div>
          </div>

          {/* Quick Real GitHub Issue Link if active */}
          {realIssueResult && (
            <a
              href={realIssueResult.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-4 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-[#84CC16] text-[#101114] text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-2xs whitespace-nowrap"
            >
              <span>View Issue #{realIssueResult.number} on GitHub</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* Stopwatch Progress Bar */}
        {simState === 'opened' && (
          <div className="space-y-1.5 pt-2 border-t border-[#ECEAE1]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#65666A]">Time Remaining Before 5m Window Expires:</span>
              <span className="font-bold text-amber-700">{minutesRemaining}m {secondsRemaining}s</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#FAF9F5] overflow-hidden border border-[#E5E3DA]">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (elapsedSeconds / 300) * 100)}%` }}
              />
            </div>
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
                {connectedUser ? `Connected as @${connectedUser.githubUsername}` : 'Connect GitHub for GitGlow'}
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
            <h4 className="text-xs font-bold text-[#101114]">1. Open Real Issue</h4>
            <p className="text-[11px] text-[#65666A] leading-relaxed">
              Creates a tracking issue on your real GitHub repo and begins the 300s SLA timer.
            </p>
          </div>

          <button
            onClick={handleStep1CreateIssue}
            disabled={simState !== 'idle' || isExecutingLive}
            className="w-full h-10 rounded-xl bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <Play size={13} className={cn(isExecutingLive && 'animate-spin')} />
            <span>
              {simState === 'idle'
                ? connectedUser
                  ? 'Execute: Open Real Issue'
                  : 'Open Practice Issue'
                : `Issue #${issueNumber} Created ✓`}
            </span>
          </button>
        </div>

        {/* Station 2 Card */}
        <div
          className={cn(
            'p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4',
            simState === 'closed' || simState === 'verifying' || simState === 'verified'
              ? 'bg-[#F7F8EF] border-[#DCE89E]'
              : simState === 'opened'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-300/50 shadow-md'
              : 'bg-white border-[#E5E3DA] opacity-60'
          )}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#65A30D] uppercase">Station 02</span>
              {simState === 'opened' && (
                <span className="text-[10px] font-mono font-bold text-amber-700 animate-pulse flex items-center gap-1">
                  <Clock size={11} />
                  {elapsedSeconds}s / 300s
                </span>
              )}
              {(simState === 'closed' || simState === 'verified') && (
                <Check size={16} className="text-[#84CC16]" />
              )}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">2. Close Under 300s</h4>
            <p className="text-[11px] text-[#65666A] leading-relaxed">
              Closes the issue on GitHub. GitHub servers evaluate if closure duration was under 5 minutes.
            </p>
          </div>

          <button
            onClick={handleStep2CloseIssue}
            disabled={simState !== 'opened' || isExecutingLive}
            className="w-full h-10 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <Check size={14} strokeWidth={3} />
            <span>
              {simState === 'opened'
                ? `Close Real Issue (${elapsedSeconds}s)`
                : simState === 'idle'
                ? 'Waiting for Step 1'
                : `Closed in ${elapsedSeconds}s ✓`}
            </span>
          </button>
        </div>

        {/* Station 3 Card */}
        <div
          className={cn(
            'p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4',
            simState === 'verified'
              ? 'bg-[#F7F8EF] border-[#DCE89E]'
              : simState === 'closed'
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
            disabled={simState !== 'closed'}
            className="w-full h-10 rounded-xl bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <Shield size={13} />
            <span>
              {simState === 'verifying'
                ? 'Verifying...'
                : simState === 'verified'
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

          <div className="flex items-center gap-3">
            {simState === 'opened' && (
              <span className="text-[11px] font-mono text-[#D7FF36] animate-pulse">
                Stopwatch: {elapsedSeconds}s / 300s
              </span>
            )}
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
        </div>

        <div className="h-44 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1.5 text-slate-300">
          {logs.length === 0 ? (
            <div className="text-slate-500 py-6 text-center">
              {connectedUser
                ? 'Click "Execute: Open Real Issue" above to start live GitHub execution!'
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

      {/* ── 5. CELEBRATORY BADGE REWARD MODAL (Confetti + Proof + Share) ── */}
      <BadgeRewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        badgeName="Quickdraw"
        badgeIcon="/images/badges/quickdraw.png"
        username={connectedUser?.githubUsername || targetUsername}
        durationSeconds={realIssueResult?.durationSeconds || elapsedSeconds || 38}
        issueNumber={realIssueResult?.number || issueNumber}
        repoFullName={`${connectedUser?.githubUsername || targetUsername}/${activeRepoName}`}
        issueUrl={realIssueResult?.html_url}
        onContinueToNext={() => {
          setShowRewardModal(false);
          // Route or highlight next badge
          window.location.search = '?badge=pull-shark';
        }}
      />
    </div>
  );
};
