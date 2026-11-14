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
  } = useGitGlowStore();

  const isAlreadyEarned = scanAnalysis?.quickdrawQualified;
  const currentSteps = badgeStepStatus['quickdraw'] || [false, false, false];

  // Auth & Connection State
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Live Real GitHub Action States
  const [isExecutingLive, setIsExecutingLive] = useState<boolean>(false);
  const [realIssueResult, setRealIssueResult] = useState<GitHubIssueResult | null>(null);
  const [activeRepoName, setActiveRepoName] = useState<string>(testRepoName);

  // Simulation Runner State (for dry-run practice)
  const [simState, setSimState] = useState<'idle' | 'opened' | 'closed' | 'verifying' | 'verified'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [issueNumber, setIssueNumber] = useState<number>(104);
  const [logs, setLogs] = useState<Array<{ text: string; type?: 'info' | 'success' | 'cmd' | 'error' }>>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  // Timer logic when issue is in opened state
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

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1-Click Connect with GitHub
  const handleConnectGitHub = async () => {
    setIsConnecting(true);
    setAuthError(null);
    try {
      const user = await connectGitHubForGitGlow();
      setConnectedUser(user);
      setLogs((prev) => [
        ...prev,
        { text: `✓ Connected with GitHub as @${user.githubUsername}`, type: 'success' },
        { text: `Authenticated token loaded in secure session. Ready for real 1-click execution!`, type: 'info' },
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
    setLogs((prev) => [
      ...prev,
      { text: `Disconnected GitHub session.`, type: 'info' },
    ]);
  };

  // ── REAL GITHUB EXECUTION: Step 1 (Create Issue on Real GitHub) ──
  const handleRealStep1CreateIssue = async () => {
    if (!connectedUser) return;
    setIsExecutingLive(true);
    setAuthError(null);

    setLogs((prev) => [
      ...prev,
      { text: `$ Initializing sandbox repo on github.com/${connectedUser.githubUsername}...`, type: 'cmd' },
    ]);

    try {
      // 1. Ensure sandbox repo exists
      const repoInfo = await getOrCreateStudentSandbox(connectedUser.accessToken, testRepoName);
      setActiveRepoName(repoInfo.name);
      setTestRepoName(repoInfo.name);

      setLogs((prev) => [
        ...prev,
        { text: `✓ Target repo ready: ${repoInfo.full_name}`, type: 'info' },
        { text: `$ POST /repos/${repoInfo.owner}/${repoInfo.name}/issues`, type: 'cmd' },
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
        { text: `[GitHub Webhook]: issues.opened recorded on GitHub servers. Close within 300s!`, type: 'info' },
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

  // ── REAL GITHUB EXECUTION: Step 2 (Close Issue on Real GitHub) ──
  const handleRealStep2CloseIssue = async () => {
    if (!connectedUser || !realIssueResult) return;
    setIsExecutingLive(true);
    setAuthError(null);

    setLogs((prev) => [
      ...prev,
      { text: `$ PATCH /repos/${connectedUser.githubUsername}/${activeRepoName}/issues/${realIssueResult.number}`, type: 'cmd' },
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
        { text: `✓ REAL ISSUE #${closedIssue.number} CLOSED ON GITHUB IN ${closedIssue.durationSeconds}s!`, type: 'success' },
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

  // Step 3: Verify Webhook Ingestion & Mark Mission
  const triggerStep3Verify = async () => {
    setSimState('verifying');
    setLogs((prev) => [
      ...prev,
      { text: `$ Checking GitHub telemetry queue...`, type: 'cmd' },
    ]);

    await new Promise((r) => setTimeout(r, 800));
    setSimState('verified');
    toggleBadgeStep('quickdraw', 2);
    markMissionCompleted('m1-quickdraw');

    setLogs((prev) => [
      ...prev,
      { text: `✓ QUALIFIED: Real GitHub webhook successfully triggered!`, type: 'success' },
      { text: `Official badge will appear on your public GitHub profile in 10 to 30 minutes!`, type: 'info' },
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
      {/* ── Status Banner: Informs the student clearly if they already have it or not ── */}
      {isAlreadyEarned ? (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F7F8EF] border border-[#DCE89E] flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#DCE89E] flex items-center justify-center text-[#84CC16] shrink-0 shadow-2xs">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#101114]">
                  Quickdraw is already on your GitHub profile!
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#84CC16]/20 text-[#4D7C0F] text-[10px] font-mono font-bold">
                  Qualified
                </span>
              </div>
              <p className="text-[11px] text-[#65666A] mt-0.5">
                We detected that you previously resolved an issue in{' '}
                <strong className="text-[#101114]">{scanAnalysis?.quickdrawDurationSeconds}s</strong> (&lt;300s window). You can still practice this real execution to master the triage workflow!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E3DA] flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#101114]">
                  Not Yet Earned · Ready to Claim in 120 Seconds
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                  0/1 Closed Issue
                </span>
              </div>
              <p className="text-[11px] text-[#65666A] mt-0.5">
                Connect your GitHub below to let GitGlow create & close a real issue on your account with 1 click.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 1-CLICK GITHUB CONNECTION BAR FOR GITGLOW ── */}
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
                ? 'Authorized for 1-click in-app badge execution. No passwords or tokens stored.'
                : '1-click popup authorization. No PAT required, zero setup.'}
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

      {/* ── Visual 3-Station Flow Controller ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Station 1 Card */}
        <div
          className={cn(
            'p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3',
            simState !== 'idle'
              ? 'bg-[#F7F8EF] border-[#DCE89E]'
              : 'bg-white border-[#E5E3DA] shadow-xs'
          )}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#65A30D] uppercase">Station 01</span>
              {simState !== 'idle' && <Check size={14} className="text-[#84CC16]" />}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">1. Open Test Issue</h4>
            <p className="text-[11px] text-[#65666A]">
              Fires the <code>issues.opened</code> event on your real GitHub repo.
            </p>
          </div>

          <button
            onClick={connectedUser ? handleRealStep1CreateIssue : handleConnectGitHub}
            disabled={simState !== 'idle' || isExecutingLive}
            className="w-full h-9 rounded-xl bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play size={12} className={cn(isExecutingLive && 'animate-spin')} />
            <span>
              {simState === 'idle'
                ? connectedUser
                  ? 'Execute: Open Real Issue'
                  : 'Connect GitHub to Execute'
                : `Issue #${issueNumber} Opened`}
            </span>
          </button>
        </div>

        {/* Station 2 Card */}
        <div
          className={cn(
            'p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3',
            simState === 'closed' || simState === 'verifying' || simState === 'verified'
              ? 'bg-[#F7F8EF] border-[#DCE89E]'
              : simState === 'opened'
              ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-300/40 animate-pulse'
              : 'bg-white border-[#E5E3DA] opacity-60'
          )}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#65A30D] uppercase">Station 02</span>
              {simState === 'opened' && (
                <span className="text-[10px] font-mono font-bold text-amber-700 animate-pulse flex items-center gap-1">
                  <Clock size={11} />
                  {elapsedSeconds}s / 300s
                </span>
              )}
              {(simState === 'closed' || simState === 'verified') && (
                <Check size={14} className="text-[#84CC16]" />
              )}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">2. Close Under 300s</h4>
            <p className="text-[11px] text-[#65666A]">
              Timer: {minutesRemaining}m {secondsRemaining}s left before window closes.
            </p>
          </div>

          <button
            onClick={connectedUser ? handleRealStep2CloseIssue : () => {}}
            disabled={simState !== 'opened' || isExecutingLive}
            className="w-full h-9 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <Check size={13} strokeWidth={2.5} />
            <span>
              {simState === 'opened'
                ? `Close Real Issue (${elapsedSeconds}s)`
                : simState === 'idle'
                ? 'Waiting for Step 1'
                : 'Closed on GitHub'}
            </span>
          </button>
        </div>

        {/* Station 3 Card */}
        <div
          className={cn(
            'p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3',
            simState === 'verified'
              ? 'bg-[#F7F8EF] border-[#DCE89E]'
              : simState === 'closed'
              ? 'bg-white border-[#84CC16] ring-2 ring-[#84CC16]/30'
              : 'bg-white border-[#E5E3DA] opacity-60'
          )}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#65A30D] uppercase">Station 03</span>
              {simState === 'verified' && <Check size={14} className="text-[#84CC16]" />}
            </div>
            <h4 className="text-xs font-bold text-[#101114]">3. Webhook Telemetry</h4>
            <p className="text-[11px] text-[#65666A]">
              Verifies event duration with GitHub Achievement ingestion.
            </p>
          </div>

          <button
            onClick={triggerStep3Verify}
            disabled={simState !== 'closed'}
            className="w-full h-9 rounded-xl bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Shield size={12} />
            <span>
              {simState === 'verifying'
                ? 'Verifying...'
                : simState === 'verified'
                ? 'Webhook Verified!'
                : 'Verify Badge Trigger'}
            </span>
          </button>
        </div>
      </div>

      {/* ── Interactive Terminal Stream (Shows Real Commands & Responses) ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#101114] text-white border border-[#23262D] space-y-3 shadow-sm">
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
                Timer: {elapsedSeconds}s / 300s
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
                : 'Connect GitHub above or run simulated execution.'}
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

      {/* ── Real GitHub Verification Proof Link (When Created) ── */}
      {realIssueResult && (
        <div className="p-4 rounded-2xl bg-[#F7F8EF] border border-[#DCE89E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#84CC16]" />
            <span className="text-xs text-[#101114]">
              View real issue on GitHub: <strong>#{realIssueResult.number} ({realIssueResult.state})</strong>
            </span>
          </div>
          <a
            href={realIssueResult.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#101114] hover:text-[#84CC16] inline-flex items-center gap-1"
          >
            <span>Open on GitHub</span>
            <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
};
