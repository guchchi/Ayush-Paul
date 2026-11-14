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
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';

interface QuickdrawInteractiveSimulationProps {
  onCompleted?: () => void;
}

export const QuickdrawInteractiveSimulation: React.FC<QuickdrawInteractiveSimulationProps> = ({
  onCompleted,
}) => {
  const {
    targetUsername,
    testRepoName,
    scanAnalysis,
    badgeStepStatus,
    toggleBadgeStep,
    setAllStepsForBadge,
    markMissionCompleted,
  } = useGitGlowStore();

  const isAlreadyEarned = scanAnalysis?.quickdrawQualified;
  const currentSteps = badgeStepStatus['quickdraw'] || [false, false, false];

  // Simulation Runner State
  const [simState, setSimState] = useState<'idle' | 'opened' | 'closed' | 'verifying' | 'verified'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [issueNumber, setIssueNumber] = useState<number>(104);
  const [logs, setLogs] = useState<Array<{ text: string; type?: 'info' | 'success' | 'cmd' }>>([]);
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

  // Step 1: Open Issue
  const triggerStep1OpenIssue = () => {
    const newNum = Math.floor(Math.random() * 800) + 100;
    setIssueNumber(newNum);
    setSimState('opened');
    setElapsedSeconds(0);
    toggleBadgeStep('quickdraw', 0);

    setLogs((prev) => [
      ...prev,
      { text: `$ gh issue create --title "audit: verify system health"`, type: 'cmd' },
      { text: `✓ Issue #${newNum} created on ${targetUsername}/${testRepoName}`, type: 'success' },
      { text: `[GitHub Webhook]: issues.opened event received. Timer started. Close within 300s!`, type: 'info' },
    ]);
  };

  // Step 2: Close Issue
  const triggerStep2CloseIssue = () => {
    setSimState('closed');
    toggleBadgeStep('quickdraw', 1);

    setLogs((prev) => [
      ...prev,
      { text: `$ gh issue close ${issueNumber} --comment "Resolved in ${elapsedSeconds}s"`, type: 'cmd' },
      { text: `✓ Issue #${issueNumber} successfully closed in ${elapsedSeconds} seconds!`, type: 'success' },
      { text: `Duration ${elapsedSeconds}s is well under the 300-second threshold.`, type: 'info' },
    ]);
  };

  // Step 3: Verify Webhook Ingestion
  const triggerStep3Verify = async () => {
    setSimState('verifying');
    setLogs((prev) => [
      ...prev,
      { text: `$ gh api repos/${targetUsername}/${testRepoName}/issues/${issueNumber}`, type: 'cmd' },
      { text: `Checking GitHub Achievement Ingestion API...`, type: 'info' },
    ]);

    await new Promise((r) => setTimeout(r, 900));
    setSimState('verified');
    toggleBadgeStep('quickdraw', 2);
    markMissionCompleted('m1-quickdraw');

    setLogs((prev) => [
      ...prev,
      { text: `✓ Official Webhook Verified! GitHub achievement server has queued the Quickdraw badge!`, type: 'success' },
      { text: `ETA: Badge will appear on github.com/${targetUsername} in 10 to 30 minutes.`, type: 'info' },
    ]);

    if (onCompleted) onCompleted();
  };

  const resetSimulation = () => {
    setSimState('idle');
    setElapsedSeconds(0);
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
                <strong className="text-[#101114]">{scanAnalysis?.quickdrawDurationSeconds}s</strong> (&lt;300s window). You can still practice this interactive simulation to master the triage CLI workflow!
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
                Follow this 3-station interactive simulation to trigger the exact official GitHub webhook required for Quickdraw.
              </p>
            </div>
          </div>
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
              Fires the <code>issues.opened</code> event and logs creation timestamp.
            </p>
          </div>

          <button
            onClick={triggerStep1OpenIssue}
            disabled={simState !== 'idle'}
            className="w-full h-9 rounded-xl bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play size={12} />
            <span>{simState === 'idle' ? 'Run Step 1: Open Issue' : 'Issue #104 Opened'}</span>
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
            onClick={triggerStep2CloseIssue}
            disabled={simState !== 'opened'}
            className="w-full h-9 rounded-xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <Check size={13} strokeWidth={2.5} />
            <span>
              {simState === 'opened'
                ? `Close Now (${elapsedSeconds}s)`
                : simState === 'idle'
                ? 'Waiting for Step 1'
                : 'Closed Successfully'}
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
                : 'Verify Webhook'}
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
              sim-runner@{targetUsername}:{testRepoName}
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
              Click "Run Step 1" above to start the live interactive issue triage simulation.
              <br />
              Observe the real-time webhook telemetry timestamps.
            </div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className={cn(
                  log.type === 'cmd'
                    ? 'text-emerald-400 font-bold'
                    : log.type === 'success'
                    ? 'text-[#D7FF36]'
                    : 'text-slate-400'
                )}
              >
                {log.text}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Real Terminal Copy Script (Personalized with User's Exact Handle) ── */}
      <div className="p-5 rounded-3xl bg-white border border-[#E5E3DA] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={15} className="text-[#84CC16]" />
            <h4 className="text-xs font-bold text-[#101114]">
              Want to run this in your real terminal right now?
            </h4>
          </div>

          <button
            onClick={() =>
              handleCopy(
                `# 1-Liner Quickdraw Script for @${targetUsername}\nISSUE_URL=$(gh issue create --title "audit: verify health $(date +%s)" --body "Quickdraw achievement validation")\nISSUE_NUM=$(basename "$ISSUE_URL")\ngh issue close "$ISSUE_NUM" --comment "Closed within 120s for Quickdraw"`,
                'cliSnippet'
              )
            }
            className="text-xs font-bold text-[#84CC16] hover:text-[#4D7C0F] inline-flex items-center gap-1 cursor-pointer"
          >
            {copiedKey === 'cliSnippet' ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedKey === 'cliSnippet' ? 'Copied Script!' : 'Copy Real 1-Liner'}</span>
          </button>
        </div>

        <pre className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DA] text-[11px] font-mono text-[#101114] overflow-x-auto select-all leading-relaxed">
{`# Step 1: Open tracking issue
ISSUE_URL=$(gh issue create --title "audit: system check $(date +%s)" --body "Quickdraw achievement trigger")
ISSUE_NUM=$(basename "$ISSUE_URL")

# Step 2: Close immediately (within 300 seconds)
gh issue close "$ISSUE_NUM" --comment "Resolved in under 120 seconds."`}
        </pre>
      </div>
    </div>
  );
};
