import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Terminal,
  Play,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Shield,
  ArrowLeft,
  RefreshCw,
  GitPullRequest,
  CheckCheck,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { GITHUB_BADGES } from '../../../data/gitglow/github-badges';
import { useGitGlowStore } from '../../../lib/gitglow/gitglow-store';
import { BADGE_AUTOMATION_BLUEPRINTS } from '../../../lib/gitglow/gitglow-community-pr';
import { BADGE_CURRICULUM } from '../../../data/gitglow/badge-curriculum';
import { QuickdrawInteractiveSimulation } from './QuickdrawInteractiveSimulation';
import { PullSharkInteractiveSimulation } from './PullSharkInteractiveSimulation';
import { YoloInteractiveSimulation } from './YoloInteractiveSimulation';
import { PairExtraordinaireInteractiveSimulation } from './PairExtraordinaireInteractiveSimulation';
import { BadgeLearningModal } from '../../../components/gitglow/BadgeLearningModal';

export const GitGlowEnginePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const badgeQuery = searchParams.get('badge') || 'quickdraw';

  const {
    targetUsername,
    setTargetUsername,
    testRepoName,
    setTestRepoName,
    runScan,
    isScanning,
    scanAnalysis,
    badgeStepStatus,
    toggleBadgeStep,
    setAllStepsForBadge,
    completedMissionIds,
    executionLogs,
    appendLog,
    clearLogs,
    isBadgeOwned,
    toggleBadgeOwnership,
    connectedUser,
  } = useGitGlowStore();

  const [activeTab, setActiveTab] = useState<'sandbox' | 'terminal' | 'actions' | 'security'>('sandbox');
  const [showLearnModal, setShowLearnModal] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);

  // Selected Badge
  const activeBadge = GITHUB_BADGES.find((b) => b.id === badgeQuery) || GITHUB_BADGES[0];
  const automationBlueprint = BADGE_AUTOMATION_BLUEPRINTS[activeBadge.id];
  const pedagogy = BADGE_CURRICULUM[activeBadge.id];

  const badgeSteps = badgeStepStatus[activeBadge.id] || [false, false, false];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSelectBadge = (badgeId: string) => {
    setSearchParams({ badge: badgeId });
  };

  // Run initial scan on mount if not scanned yet or if scan is legacy/stale
  useEffect(() => {
    const isLegacyOrStale =
      !scanAnalysis ||
      !Array.isArray(scanAnalysis.liveEarnedAchievements) ||
      !scanAnalysis.scannedAt ||
      Date.now() - new Date(scanAnalysis.scannedAt).getTime() > 10 * 60 * 1000;

    const userToScan = connectedUser?.githubUsername || targetUsername || 'guchchi';
    if (isLegacyOrStale && userToScan) {
      runScan(userToScan);
    }
  }, [connectedUser?.githubUsername, targetUsername]);

  // Simulate local execution pipeline for non-interactive badges
  const runSimulatedAutomation = async () => {
    if (isRunningSim) return;
    setIsRunningSim(true);
    clearLogs(activeBadge.id);

    appendLog(activeBadge.id, `Starting automation engine for "${activeBadge.name}"...`);
    appendLog(activeBadge.id, `Target user: @${targetUsername} | Sandbox: ${testRepoName}`);

    await new Promise((r) => setTimeout(r, 700));
    toggleBadgeStep(activeBadge.id, 0);
    appendLog(activeBadge.id, `[STATION 1] Branch created: feat/gitglow-${activeBadge.id}`);

    await new Promise((r) => setTimeout(r, 900));
    toggleBadgeStep(activeBadge.id, 1);
    appendLog(activeBadge.id, `[STATION 2] Artifact staged & verified commit generated.`);

    await new Promise((r) => setTimeout(r, 1100));
    toggleBadgeStep(activeBadge.id, 2);
    appendLog(activeBadge.id, `[STATION 3] Pull request auto-merged into default branch.`);
    appendLog(activeBadge.id, `✓ SUCCESS: Webhook telemetry triggered. Profile badge is qualifying!`);

    setIsRunningSim(false);
  };

  const currentEval = scanAnalysis?.badgeEvaluations[activeBadge.id];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#101114] selection:bg-[#D7FF36] selection:text-[#101114]">
      {/* Top Engine Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E3DA] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/blueprints/gitglow"
            className="w-8 h-8 rounded-full bg-[#FAF9F5] border border-[#E5E3DA] flex items-center justify-center text-[#65666A] hover:text-[#101114] hover:bg-white transition-all shadow-2xs"
            title="Return to GitGlow Overview"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-[#101114]">GitGlow Sandbox Engine</span>
              <span className="px-2 py-0.5 rounded-full bg-[#D7FF36]/40 text-[#4D7C0F] text-[10px] font-mono font-bold uppercase tracking-wider">
                1-Click Execution
              </span>
            </div>
            <p className="text-[11px] text-[#65666A]">
              Real GitHub Achievements · 100% Genuine Webhook Ingestion · Zero-OAuth
            </p>
          </div>
        </div>

        {/* User Handle & Repo Config */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] text-xs font-mono">
            <span className="text-[#65666A]">Target:</span>
            <input
              type="text"
              value={targetUsername}
              onChange={(e) => setTargetUsername(e.target.value)}
              placeholder="github-username"
              className="bg-transparent border-none text-[#101114] font-bold focus:outline-hidden w-28"
            />
          </div>
          <button
            onClick={() => runScan(targetUsername)}
            disabled={isScanning}
            className="h-8 px-3 rounded-lg bg-[#101114] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#1C1E24] transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw size={12} className={cn(isScanning && 'animate-spin')} />
            <span>{isScanning ? 'Syncing...' : 'Sync GitHub'}</span>
          </button>
        </div>
      </header>

      {/* Main Grid: Left Badge Directory | Center 1-Click Sandbox | Right Community Sandbox */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (3 cols): Badge Selector */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#ECEAE1]">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#65666A]">
              Badge Catalog
            </span>
            <span className="text-xs font-bold text-[#84CC16]">
              {GITHUB_BADGES.filter((b) => isBadgeOwned(b.id)).length} / {GITHUB_BADGES.length} Owned
            </span>
          </div>

          <div className="space-y-2">
            {GITHUB_BADGES.map((badge) => {
              const isSelected = badge.id === activeBadge.id;
              const evalData = scanAnalysis?.badgeEvaluations[badge.id];
              const isOwned = isBadgeOwned(badge.id);
              return (
                <button
                  key={badge.id}
                  onClick={() => handleSelectBadge(badge.id)}
                  className={cn(
                    'w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer relative',
                    isSelected
                      ? 'bg-white border-[#84CC16] shadow-sm'
                      : isOwned
                      ? 'bg-[#F7F8EF]/60 border-[#DCE89E] hover:bg-white'
                      : 'bg-[#FAF9F5] border-[#E5E3DA] hover:bg-white hover:border-[#DCE89E]'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={badge.image}
                        alt={badge.name}
                        className="w-9 h-9 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      {isOwned && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#84CC16] text-white flex items-center justify-center text-[8px] font-bold shadow-2xs">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#101114] truncate flex items-center gap-1.5">
                        <span>{badge.name}</span>
                        {isOwned && (
                          <span className="px-1.5 py-0.2 rounded-md bg-[#D7FF36] text-[#101114] text-[8.5px] font-mono font-black uppercase">
                            OWNED
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#65666A] truncate">
                        {isOwned ? 'Active on Profile' : evalData ? evalData.statusLabel : badge.difficulty}
                      </div>
                    </div>
                  </div>

                  {isOwned ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#84CC16]/15 text-[#4D7C0F] text-[10px] font-mono font-bold flex items-center gap-1">
                      <Check size={11} strokeWidth={3} />
                      <span className="hidden sm:inline">YOU HAVE</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-[#65666A]">
                      {evalData?.progressPercent ? `${evalData.progressPercent}%` : 'Ready'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Profile Insight Card */}
          {scanAnalysis && (
            <div className="p-4 rounded-2xl bg-white border border-[#E5E3DA] space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={scanAnalysis.user.avatar_url}
                  alt={scanAnalysis.user.login}
                  className="w-10 h-10 rounded-full border border-[#E5E3DA]"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#101114] truncate">
                    {scanAnalysis.user.name || `@${scanAnalysis.user.login}`}
                  </div>
                  <div className="text-[10px] font-mono text-[#65666A]">
                    @{scanAnalysis.user.login}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-[#ECEAE1]">
                <div className="p-2 rounded-xl bg-[#FAF9F5]">
                  <span className="text-[10px] text-[#65666A] block">Merged PRs</span>
                  <span className="text-sm font-extrabold text-[#101114]">
                    {scanAnalysis.totalMergedPrs}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#FAF9F5]">
                  <span className="text-[10px] text-[#65666A] block">Public Repos</span>
                  <span className="text-sm font-extrabold text-[#101114]">
                    {scanAnalysis.user.public_repos}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center Column (6 cols): Direct 1-Click Sandbox Workspace */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Badge Hero Card with Dedicated Learning Window Trigger */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DA] p-2 flex items-center justify-center shrink-0">
                  <img
                    src={activeBadge.image}
                    alt={activeBadge.name}
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-[#101114]">{activeBadge.name}</h2>
                    {isBadgeOwned(activeBadge.id) ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D7FF36] text-[#101114] border border-[#84CC16] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                        <Check size={11} strokeWidth={3} />
                        YOU HAVE THIS
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#F7F8EF] text-[#65A30D] border border-[#DCE89E] text-[10px] font-bold">
                        {activeBadge.statusLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#65666A] mt-1">{activeBadge.tagline}</p>
                </div>
              </div>

              {/* Progress pill */}
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#84CC16]">
                  {isBadgeOwned(activeBadge.id)
                    ? '100% Unlocked'
                    : currentEval
                    ? `${currentEval.progressPercent}% Qualification`
                    : 'Ready to Run'}
                </span>
                <div className="w-24 h-1.5 rounded-full bg-[#FAF9F5] mt-1.5 overflow-hidden border border-[#E5E3DA]">
                  <div
                    className="h-full bg-[#84CC16] rounded-full transition-all duration-500"
                    style={{ width: `${isBadgeOwned(activeBadge.id) ? 100 : currentEval?.progressPercent || 20}%` }}
                  />
                </div>
              </div>
            </div>

            {/* YOU HAVE THIS BADGE BANNER & MANUAL TOGGLE OPTION */}
            {isBadgeOwned(activeBadge.id) ? (
              <div className="p-4 rounded-2xl bg-[#F7F8EF] border border-[#84CC16]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#84CC16] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#101114]">
                        🎉 You Already Own This Badge!
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#D7FF36] text-[#101114] text-[9.5px] font-mono font-black uppercase">
                        ON YOUR GITHUB PROFILE
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4D7C0F] mt-0.5">
                      Verified for @{connectedUser?.githubUsername || targetUsername}. You already achieved this milestone! You can still test in the sandbox below.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleBadgeOwnership(activeBadge.id)}
                  title="Click to toggle ownership status"
                  className="text-[11px] font-bold text-[#65666A] hover:text-[#101114] underline cursor-pointer whitespace-nowrap self-start sm:self-auto"
                >
                  Mark as unearned
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DA] flex items-center justify-between gap-3 text-xs">
                <span className="text-[#65666A]">
                  Already unlocked this badge on GitHub earlier?
                </span>
                <button
                  onClick={() => toggleBadgeOwnership(activeBadge.id)}
                  className="px-3 py-1 rounded-xl bg-white border border-[#DCE89E] hover:border-[#84CC16] text-[#4D7C0F] font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                >
                  <Check size={12} strokeWidth={2.5} />
                  <span>I Have This Badge</span>
                </button>
              </div>
            )}

            {/* SEPARATE WINDOW FOR LEARNING PART (User Request) */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#ECEAE1]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLearnModal(true)}
                  className="h-9 px-4 rounded-xl bg-[#F7F8EF] border border-[#DCE89E] hover:bg-[#D7FF36]/30 text-[#4D7C0F] text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <BookOpen size={14} className="text-[#84CC16]" />
                  <span>📖 Open Learning Guide</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#84CC16]/20 text-[9.5px] font-mono">
                    Concepts & Quiz
                  </span>
                </button>

                <button
                  onClick={() => window.open(`/blueprints/gitglow/learn?badge=${activeBadge.id}`, '_blank')}
                  title="Open Learning Guide in a separate browser window / popout"
                  className="h-9 px-3 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-[#84CC16] text-[#65666A] hover:text-[#101114] text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <span className="hidden sm:inline">Popout Window</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              <span className="text-[11px] font-mono text-[#65666A]">
                {activeBadge.statusLabel}
              </span>
            </div>

            {/* Live Recommendation Banner */}
            {currentEval && (
              <div className="p-3.5 rounded-2xl bg-[#F7F8EF] border border-[#DCE89E] flex items-start gap-2.5">
                <Sparkles size={16} className="text-[#65A30D] shrink-0 mt-0.5" />
                <div className="text-xs text-[#101114]">
                  <strong>Current Status:</strong> {currentEval.detail}{' '}
                  <span className="text-[#65666A] block mt-0.5">{currentEval.actionRecommendation}</span>
                </div>
              </div>
            )}
          </div>

          {/* Secondary Sub-Tabs for Power Users (CLI Scripts & CI/CD) */}
          <div className="flex items-center gap-2 border-b border-[#ECEAE1] px-1 overflow-x-auto">
            {[
              { id: 'sandbox', label: '⚡ 1-Click Sandbox Execution' },
              { id: 'terminal', label: '💻 Terminal Script' },
              { id: 'actions', label: '🤖 GitHub Action' },
              { id: 'security', label: '🛡️ Security & Rules' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'pb-2 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-[#84CC16] text-[#101114]'
                    : 'border-transparent text-[#65666A] hover:text-[#101114]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Primary View: 1-Click Interactive Sandbox */}
          {activeTab === 'sandbox' && (
            <div className="space-y-4">
              {activeBadge.id === 'quickdraw' ? (
                <QuickdrawInteractiveSimulation />
              ) : activeBadge.id === 'pull-shark' ? (
                <PullSharkInteractiveSimulation />
              ) : activeBadge.id === 'yolo' ? (
                <YoloInteractiveSimulation
                  onOpenLearnModal={() => setShowLearnModal(true)}
                  onCompleted={() => handleSelectBadge('pair-extraordinaire')}
                />
              ) : activeBadge.id === 'pair-extraordinaire' ? (
                <PairExtraordinaireInteractiveSimulation
                  onOpenLearnModal={() => setShowLearnModal(true)}
                  onCompleted={() => handleSelectBadge('galaxy-brain')}
                />
              ) : (
                <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] space-y-4 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[#84CC16]" />
                    <h3 className="text-xs font-bold text-[#101114] uppercase tracking-wider">
                      3-Station Qualification Recipe for {activeBadge.name}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        idx: 0,
                        title: 'Station 1: Feature Branch & Contributor Staging',
                        desc: `Switch to branch feat/gitglow-${activeBadge.id} and stage the required file.`,
                      },
                      {
                        idx: 1,
                        title: 'Station 2: Verified Commit & PR Creation',
                        desc: 'Generate signed/attributed git commit and open the Pull Request.',
                      },
                      {
                        idx: 2,
                        title: 'Station 3: Default Branch Merge & Ingestion',
                        desc: 'Merge into default branch (main). GitHub triggers profile webhook in 10-30 mins.',
                      },
                    ].map((step) => {
                      const isDone = badgeSteps[step.idx];
                      return (
                        <div
                          key={step.idx}
                          onClick={() => toggleBadgeStep(activeBadge.id, step.idx)}
                          className={cn(
                            'p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer',
                            isDone
                              ? 'bg-[#F7F8EF] border-[#DCE89E]'
                              : 'bg-[#FAF9F5] border-[#E5E3DA] hover:border-[#84CC16]'
                          )}
                        >
                          <div
                            className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all mt-0.5',
                              isDone
                                ? 'bg-[#84CC16] border-[#84CC16] text-white'
                                : 'bg-white border-[#E5E3DA] text-[#65666A]'
                            )}
                          >
                            {isDone ? <Check size={14} strokeWidth={3} /> : step.idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#101114]">{step.title}</div>
                            <p className="text-[11px] text-[#65666A] mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={runSimulatedAutomation}
                      disabled={isRunningSim}
                      className="h-10 px-5 rounded-xl bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <Play size={13} className={cn(isRunningSim && 'animate-spin')} />
                      <span>{isRunningSim ? 'Executing Recipe...' : 'Run Local Simulation'}</span>
                    </button>

                    <button
                      onClick={() => setAllStepsForBadge(activeBadge.id, true)}
                      className="h-10 px-4 rounded-xl bg-white border border-[#E5E3DA] hover:border-[#84CC16] text-[#101114] text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <CheckCheck size={14} />
                      <span>Mark All Completed</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Secondary Tab: Terminal Script */}
          {activeTab === 'terminal' && (
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#65666A]">
                  Run directly in terminal (requires Git and GitHub CLI):
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      automationBlueprint?.terminalScript(targetUsername, testRepoName) || '',
                      'termScript'
                    )
                  }
                  className="text-xs font-bold text-[#84CC16] hover:text-[#4D7C0F] inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'termScript' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedKey === 'termScript' ? 'Copied Script!' : 'Copy Script'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-[#101114] text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto select-all">
                {automationBlueprint?.terminalScript(targetUsername, testRepoName) ||
                  `# Standard Git Flow\ngit switch -c feat/${activeBadge.id}\ngit commit -m "feat: complete ${activeBadge.name}"\ngh pr merge --auto --merge`}
              </pre>
            </div>
          )}

          {/* Secondary Tab: GitHub Action YAML */}
          {activeTab === 'actions' && (
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#65666A]">
                  Workflow path: <code className="font-mono text-[#101114]">{automationBlueprint?.actionFile || '.github/workflows/auto-merge.yml'}</code>
                </span>
                <button
                  onClick={() =>
                    handleCopy(automationBlueprint?.actionCode || '', 'yamlScript')
                  }
                  className="text-xs font-bold text-[#84CC16] hover:text-[#4D7C0F] inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'yamlScript' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedKey === 'yamlScript' ? 'Copied YAML!' : 'Copy YAML'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-[#101114] text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto select-all">
                {automationBlueprint?.actionCode || '# No custom Action required for this badge.'}
              </pre>
            </div>
          )}

          {/* Secondary Tab: Security & Rules */}
          {activeTab === 'security' && (
            <div className="p-6 rounded-3xl bg-white border border-[#E5E3DA] space-y-4 shadow-xs">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#101114] uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} className="text-[#84CC16]" />
                  <span>Security & Automation Boundaries</span>
                </h4>
                <ul className="space-y-1.5">
                  {(automationBlueprint?.securityChecks || [
                    'Only runs locally on developer machine or sandbox repository',
                    'No elevated OAuth tokens stored or shared',
                    'Strict separation of personal repositories and community sandboxes',
                  ]).map((chk, i) => (
                    <li key={i} className="text-xs text-[#65666A] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] shrink-0" />
                      <span>{chk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#ECEAE1]">
                <h4 className="text-xs font-bold text-[#101114] uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-500" />
                  <span>GitHub Ingestion Gotchas</span>
                </h4>
                <ul className="space-y-1.5">
                  {activeBadge.gotchas.map((gotcha, i) => (
                    <li key={i} className="text-xs text-[#65666A] flex items-start gap-2">
                      <span className="text-amber-500 font-bold shrink-0">!</span>
                      <span>{gotcha}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (3 cols): Live Console & Community Repo Sandbox */}
        <div className="lg:col-span-3 space-y-6">
          {/* Simulated Terminal Console */}
          <div className="p-4 rounded-3xl bg-[#101114] text-white space-y-3 shadow-md border border-[#23262D]">
            <div className="flex items-center justify-between pb-2 border-b border-[#23262D]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] font-mono text-slate-400 ml-1">runner@gitglow:~</span>
              </div>
              <button
                onClick={() => clearLogs(activeBadge.id)}
                className="text-[10px] font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="h-64 font-mono text-[11px] leading-relaxed text-slate-300 overflow-y-auto space-y-1 select-all">
              <div className="text-slate-500">
                # GitGlow Live Execution Console
                <br /># Ready for badge recipe trigger.
              </div>
              {(executionLogs[activeBadge.id] || []).map((log, i) => (
                <div key={i} className={cn(log.includes('✓') ? 'text-emerald-400 font-bold' : '')}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Learning Window Card on Right Rail */}
          <div className="p-5 rounded-3xl bg-[#F7F8EF] border border-[#DCE89E] space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#84CC16]" />
              <h3 className="text-xs font-bold text-[#101114] uppercase tracking-wider">
                Concept & Guide
              </h3>
            </div>
            <p className="text-xs text-[#65666A] leading-relaxed">
              Want to understand why GitHub engineers value {activeBadge.name} before executing? Open the learning guide in a clean separate window.
            </p>
            <button
              onClick={() => setShowLearnModal(true)}
              className="w-full h-9 rounded-xl bg-white border border-[#DCE89E] hover:border-[#84CC16] text-[#101114] text-xs font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <span>Open Learning Window</span>
              <BookOpen size={13} className="text-[#84CC16]" />
            </button>
          </div>

          {/* GitGlow Community Sandbox Info */}
          <div className="p-5 rounded-3xl bg-white border border-[#E5E3DA] space-y-3">
            <div className="flex items-center gap-2">
              <GitPullRequest size={16} className="text-[#84CC16]" />
              <h3 className="text-xs font-bold text-[#101114] uppercase tracking-wider">
                Community Sandbox Repo
              </h3>
            </div>
            <p className="text-xs text-[#65666A] leading-relaxed">
              Don't want to use a personal test repo? Fork our open-source sandbox repository with preconfigured GitHub Actions auto-merge and contributor tests.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-9 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] hover:border-[#84CC16] text-[#101114] text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <span>Fork Sandbox Repo</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* ── SEPARATE WINDOW / MODAL FOR LEARNING PART ── */}
      <BadgeLearningModal
        isOpen={showLearnModal}
        onClose={() => setShowLearnModal(false)}
        activeBadge={activeBadge}
        pedagogy={pedagogy}
        onGoToExecution={() => {
          setShowLearnModal(false);
          setActiveTab('sandbox');
        }}
      />
    </div>
  );
};
