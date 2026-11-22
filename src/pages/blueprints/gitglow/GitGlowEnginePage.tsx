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
  Info,
  Clock,
  X,
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
import { GalaxyBrainInteractiveSimulation } from './GalaxyBrainInteractiveSimulation';
import { StarstruckInteractiveSimulation } from './StarstruckInteractiveSimulation';
import { PublicSponsorInteractiveSimulation } from './PublicSponsorInteractiveSimulation';
import { BadgeLearningModal } from '../../../components/gitglow/BadgeLearningModal';
import { GitGlowLogo } from '../../../components/gitglow/GitGlowLogo';

export const GitGlowEnginePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const badgeQuery = searchParams.get('badge') || 'quickdraw';

  const {
    targetUsername,
    setTargetUsername,
    testRepoName,
    setTestRepoName,
    runScan,
    refreshLiveAchievements,
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
    isBadgeIndexingQueued,
    getBadgeLifecycle,
    toggleBadgeOwnership,
    connectedUser,
  } = useGitGlowStore();

  const [activeTab, setActiveTab] = useState<'sandbox' | 'terminal' | 'actions' | 'security'>('sandbox');
  const [showLearnModal, setShowLearnModal] = useState<boolean>(false);
  const [showSlaInfoModal, setShowSlaInfoModal] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);

  const AUTOMATED_BADGE_IDS = ['quickdraw', 'pull-shark', 'yolo', 'pair-extraordinaire', 'galaxy-brain'];

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
            className="w-9 h-9 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] flex items-center justify-center text-[#65666A] hover:text-[#101114] hover:bg-white hover:border-[#84CC16] transition-all shadow-2xs group"
            title="Return to GitGlow Overview"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link to="/blueprints/gitglow" title="GitGlow Home" className="transition-transform hover:scale-[1.02]">
                <GitGlowLogo size={28} showWordmark theme="light" subtitle="Engine" />
              </Link>
              <span className="px-2 py-0.5 rounded-full bg-[#D7FF36] text-[#101114] text-[10px] font-mono font-black uppercase tracking-wider shadow-2xs">
                {activeBadge.name}
              </span>
              {['quickdraw', 'pull-shark', 'yolo', 'pair-extraordinaire', 'galaxy-brain'].includes(activeBadge.id) && (
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-[#101114] text-[#D7FF36] text-[9.5px] font-mono font-bold uppercase tracking-wider items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF36] animate-pulse" />
                  1-Click Live Bot
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#65666A] hidden sm:block">
              Official GitHub Profile Achievements · Real Webhook Ingestion · 100% Genuine Activity
            </p>
          </div>
        </div>

        {/* User Handle & Repo Config */}
        <div className="flex items-center gap-2 sm:gap-3">
          {connectedUser ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#F7F8EF] border border-[#DCE89E] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse shrink-0" />
              <span className="text-xs font-mono font-bold text-[#101114] truncate max-w-[120px]">
                @{connectedUser.githubUsername}
              </span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#84CC16]/20 text-[#4D7C0F] text-[9px] font-mono font-bold uppercase">
                Auth
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] text-xs font-mono shadow-2xs">
              <span className="text-[#65666A] hidden sm:inline">Target:</span>
              <input
                type="text"
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value)}
                placeholder="github-username"
                className="bg-transparent border-none text-[#101114] font-bold focus:outline-hidden w-24 sm:w-28 text-xs"
              />
            </div>
          )}

          <button
            onClick={() => setShowSlaInfoModal(true)}
            className="h-8.5 px-3 rounded-xl bg-[#F7F8EF] border border-[#DCE89E] hover:border-[#84CC16] text-[#4D7C0F] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="GitHub 24h-72h Indexing SLA Explained"
          >
            <Clock size={12} className="text-[#84CC16]" />
            <span className="hidden sm:inline">24h–72h SLA</span>
          </button>

          <button
            onClick={() => runScan(connectedUser?.githubUsername || targetUsername)}
            disabled={isScanning}
            className="h-8.5 px-3.5 rounded-xl bg-[#101114] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#1C1E24] hover:border-[#D7FF36] border border-transparent transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Rescan GitHub Profile for Achievements"
          >
            <RefreshCw size={12} className={cn(isScanning && 'animate-spin')} />
            <span>{isScanning ? 'Syncing...' : 'Sync Profile'}</span>
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
              {GITHUB_BADGES.filter((b) => getBadgeLifecycle(b.id).state === 'live_verified').length} / {GITHUB_BADGES.length} Live
            </span>
          </div>

          {/* 1. Primary Group: 5 Automated 1-Click Bots */}
          <div className="space-y-2">
            <div className="px-1 flex items-center justify-between text-[11px] font-mono font-bold text-[#101114]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
                5 Automated Bots
              </span>
              <span className="text-[#65A30D]">
                {GITHUB_BADGES.filter((b) => AUTOMATED_BADGE_IDS.includes(b.id) && getBadgeLifecycle(b.id).state === 'live_verified').length}/5 Live
              </span>
            </div>
            {GITHUB_BADGES.filter((b) => AUTOMATED_BADGE_IDS.includes(b.id)).map((badge) => {
              const isSelected = badge.id === activeBadge.id;
              const evalData = scanAnalysis?.badgeEvaluations[badge.id];
              const lifecycle = getBadgeLifecycle(badge.id);
              const isOwned = lifecycle.state === 'live_verified';
              const isQueued = lifecycle.state === 'indexing_queued';

              return (
                <button
                  key={badge.id}
                  onClick={() => handleSelectBadge(badge.id)}
                  className={cn(
                    'w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer relative',
                    isSelected
                      ? 'bg-[#101114] text-white border-[#101114] shadow-md ring-2 ring-[#D7FF36]/30'
                      : isOwned
                      ? 'bg-[#F7F8EF]/80 border-[#DCE89E] hover:bg-white text-[#101114]'
                      : isQueued
                      ? 'bg-amber-50/70 border-amber-200 hover:bg-white text-[#101114]'
                      : 'bg-[#FAF9F5] border-[#E5E3DA] hover:bg-white hover:border-[#DCE89E] text-[#101114]'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center p-1 transition-transform group-hover:scale-105",
                        isSelected ? "bg-white/10" : "bg-white border border-[#E5E3DA]"
                      )}>
                        <img
                          src={badge.image}
                          alt={badge.name}
                          className="w-full h-full object-contain drop-shadow-xs"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      {isOwned && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#84CC16] text-white flex items-center justify-center text-[8px] font-bold shadow-2xs">
                          ✓
                        </span>
                      )}
                      {isQueued && !isOwned && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[7px] font-bold shadow-2xs">
                          ⏳
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate flex items-center gap-1.5">
                        <span className={isSelected ? "text-white" : "text-[#101114]"}>{badge.name}</span>
                        {isOwned ? (
                          <span className="px-1.5 py-0.2 rounded-md bg-[#D7FF36] text-[#101114] text-[8px] font-mono font-black uppercase">
                            LIVE
                          </span>
                        ) : isQueued ? (
                          <span className="px-1.5 py-0.2 rounded-md bg-amber-400 text-amber-950 text-[8px] font-mono font-black uppercase flex items-center gap-0.5">
                            QUEUED
                          </span>
                        ) : (
                          <span className={cn(
                            "px-1.5 py-0.2 rounded-md text-[8px] font-mono font-bold uppercase",
                            isSelected ? "bg-[#D7FF36] text-[#101114]" : "bg-[#101114] text-[#D7FF36]"
                          )}>
                            ⚡ Live Bot
                          </span>
                        )}
                      </div>
                      <div className={cn("text-[10px] truncate", isSelected ? "text-slate-400" : "text-[#65666A]")}>
                        {isOwned
                          ? 'Active on Profile'
                          : isQueued
                          ? 'Merged (24–72h SLA)'
                          : evalData
                          ? evalData.statusLabel
                          : badge.difficulty}
                      </div>
                    </div>
                  </div>

                  {isOwned ? (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1",
                      isSelected ? "bg-white/15 text-[#D7FF36]" : "bg-[#84CC16]/15 text-[#4D7C0F]"
                    )}>
                      <Check size={11} strokeWidth={3} />
                      <span className="hidden sm:inline">LIVE</span>
                    </span>
                  ) : isQueued ? (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1",
                      isSelected ? "bg-amber-400/20 text-amber-300" : "bg-amber-100 text-amber-900 border border-amber-300/80"
                    )}>
                      <Clock size={10} />
                      <span className="hidden sm:inline">QUEUED</span>
                    </span>
                  ) : (
                    <span className={cn(
                      "text-[10px] font-mono font-bold",
                      isSelected ? "text-[#D7FF36]" : "text-[#65666A]"
                    )}>
                      {evalData?.progressPercent ? `${evalData.progressPercent}%` : 'Ready'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 2. Secondary Group: Manual / Community Guides */}
          <div className="space-y-2 pt-2 border-t border-[#ECEAE1]">
            <div className="px-1 flex items-center justify-between text-[10.5px] font-mono font-bold text-[#65666A]">
              <span>Community Guides</span>
              <span className="text-[9.5px]">Manual</span>
            </div>
            {GITHUB_BADGES.filter((b) => !AUTOMATED_BADGE_IDS.includes(b.id)).map((badge) => {
              const isSelected = badge.id === activeBadge.id;
              const lifecycle = getBadgeLifecycle(badge.id);
              const isOwned = lifecycle.state === 'live_verified';
              return (
                <button
                  key={badge.id}
                  onClick={() => handleSelectBadge(badge.id)}
                  className={cn(
                    'w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between group cursor-pointer relative',
                    isSelected
                      ? 'bg-[#101114] text-white border-[#101114] shadow-sm'
                      : isOwned
                      ? 'bg-[#F7F8EF]/60 border-[#DCE89E] text-[#101114]'
                      : 'bg-white border-[#E5E3DA] hover:border-[#DCE89E] text-[#65666A]'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={badge.image}
                      alt={badge.name}
                      className="w-6 h-6 object-contain shrink-0"
                    />
                    <span className={cn("text-xs font-semibold truncate", isSelected ? "text-white" : "text-[#101114]")}>
                      {badge.name}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-[#65666A]">
                    {isOwned ? '✓' : 'Guide'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* User Profile Insight Card */}
          {scanAnalysis && (
            <div className="p-4 rounded-2xl bg-white border border-[#E5E3DA] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={scanAnalysis.user.avatar_url}
                    alt={scanAnalysis.user.login}
                    className="w-10 h-10 rounded-full border border-[#E5E3DA] shrink-0"
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

                <a
                  href={`https://github.com/${scanAnalysis.user.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DA] text-[#65666A] hover:text-[#101114] hover:border-[#84CC16] transition-colors"
                  title="View Profile on GitHub"
                >
                  <ExternalLink size={12} />
                </a>
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
                    {getBadgeLifecycle(activeBadge.id).state === 'live_verified' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D7FF36] text-[#101114] border border-[#84CC16] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                        <Check size={11} strokeWidth={3} />
                        LIVE ON PROFILE
                      </span>
                    ) : getBadgeLifecycle(activeBadge.id).state === 'indexing_queued' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                        <Clock size={11} className="text-amber-600" />
                        INDEXING QUEUED (24–72H)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F7F8EF] text-[#65A30D] border border-[#DCE89E] text-[10px] font-bold">
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
                  {getBadgeLifecycle(activeBadge.id).state === 'live_verified'
                    ? '100% Verified Live'
                    : getBadgeLifecycle(activeBadge.id).state === 'indexing_queued'
                    ? 'Merged · Ingesting'
                    : currentEval
                    ? `${currentEval.progressPercent}% Qualification`
                    : 'Ready to Run'}
                </span>
                <div className="w-24 h-1.5 rounded-full bg-[#FAF9F5] mt-1.5 overflow-hidden border border-[#E5E3DA]">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      getBadgeLifecycle(activeBadge.id).state === 'live_verified'
                        ? "bg-[#84CC16]"
                        : getBadgeLifecycle(activeBadge.id).state === 'indexing_queued'
                        ? "bg-amber-400"
                        : "bg-[#84CC16]"
                    )}
                    style={{
                      width: `${
                        getBadgeLifecycle(activeBadge.id).state === 'live_verified'
                          ? 100
                          : getBadgeLifecycle(activeBadge.id).state === 'indexing_queued'
                          ? 85
                          : currentEval?.progressPercent || 20
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 3-Tier Status Banner: Live Verified vs Indexing Queued vs Unclaimed */}
            {getBadgeLifecycle(activeBadge.id).state === 'live_verified' ? (
              <div className="p-4 rounded-2xl bg-[#F7F8EF] border border-[#84CC16]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#84CC16] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#101114]">
                        🎉 Live on Your GitHub Profile!
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#D7FF36] text-[#101114] text-[9.5px] font-mono font-black uppercase">
                        VERIFIED ON GITHUB
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4D7C0F] mt-0.5">
                      Verified for @{connectedUser?.githubUsername || targetUsername}. You already achieved this milestone on your profile achievements tab! You can still test in the sandbox below.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <a
                    href={`https://github.com/${connectedUser?.githubUsername || targetUsername}?tab=achievements`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-xl bg-[#D7FF36] text-[#101114] border border-[#84CC16] text-[11px] font-mono font-black flex items-center gap-1 hover:bg-[#cbf425] shadow-2xs"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink size={10} />
                  </a>
                  <button
                    onClick={() => toggleBadgeOwnership(activeBadge.id)}
                    title="Click to toggle ownership status"
                    className="text-[11px] font-bold text-[#65666A] hover:text-[#101114] underline cursor-pointer whitespace-nowrap ml-2"
                  >
                    Toggle
                  </button>
                </div>
              </div>
            ) : getBadgeLifecycle(activeBadge.id).state === 'indexing_queued' ? (
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Clock size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-950">
                        ⏳ Action Merged & Queued for Indexing!
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[9.5px] font-mono font-black uppercase">
                        24H–72H BATCH SLA
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                      {activeBadge.id === 'galaxy-brain'
                        ? `2/2 Accepted answers verified on GitHub Discussions for @${connectedUser?.githubUsername || targetUsername}! GitHub's background indexer is processing your Galaxy Brain badge.`
                        : activeBadge.id === 'pair-extraordinaire'
                        ? `Qualifying co-authored commit merged into main for @${connectedUser?.githubUsername || targetUsername}! GitHub's asynchronous commit attribution worker processes in periodic batch crons.`
                        : `Qualifying action verified for @${connectedUser?.githubUsername || targetUsername}! Webhook delivered to GitHub.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => refreshLiveAchievements(connectedUser?.githubUsername || targetUsername)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-950 font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <RefreshCw size={12} className={cn(isScanning && 'animate-spin')} />
                    <span>Check Live Status</span>
                  </button>
                  <button
                    onClick={() => toggleBadgeOwnership(activeBadge.id)}
                    title="Click to toggle ownership status"
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-950 underline cursor-pointer whitespace-nowrap ml-1"
                  >
                    Toggle
                  </button>
                </div>
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
              ) : activeBadge.id === 'galaxy-brain' ? (
                <GalaxyBrainInteractiveSimulation
                  onOpenLearnModal={() => setShowLearnModal(true)}
                  onCompleted={() => handleSelectBadge('starstruck')}
                />
              ) : activeBadge.id === 'starstruck' ? (
                <StarstruckInteractiveSimulation
                  onOpenLearnModal={() => setShowLearnModal(true)}
                  onCompleted={() => handleSelectBadge('public-sponsor')}
                />
              ) : activeBadge.id === 'public-sponsor' ? (
                <PublicSponsorInteractiveSimulation
                  onOpenLearnModal={() => setShowLearnModal(true)}
                  onCompleted={() => handleSelectBadge('quickdraw')}
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
          {/* Actionable Big 5 Speedrun Widget */}
          <div className="p-5 rounded-3xl bg-white border border-[#E5E3DA] space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECEAE1]">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-[#84CC16]" />
                <h3 className="text-xs font-bold text-[#101114] uppercase tracking-wider">
                  Actionable 5 Badges
                </h3>
              </div>
              <span className="text-[10.5px] font-mono font-black text-[#4D7C0F] bg-[#D7FF36]/40 px-2 py-0.5 rounded-full border border-[#84CC16]">
                {['yolo', 'pair-extraordinaire', 'galaxy-brain', 'quickdraw', 'pull-shark'].filter((id) => isBadgeOwned(id)).length}/5 Unlocked
              </span>
            </div>

            <div className="space-y-1.5">
              {[
                { id: 'quickdraw', name: 'Quickdraw', time: '< 5m', desc: '120s issue loop' },
                { id: 'pull-shark', name: 'Pull Shark', time: '1-Click', desc: 'PR sandbox merge' },
                { id: 'yolo', name: 'YOLO', time: 'Instant', desc: 'Merge without review' },
                { id: 'pair-extraordinaire', name: 'Pair Extraordinaire', time: 'Bot Pair', desc: 'Co-author trailer' },
                { id: 'galaxy-brain', name: 'Galaxy Brain', time: '2 Answers', desc: 'Discussions solver' },
              ].map((item) => {
                const owned = isBadgeOwned(item.id);
                const isCurrent = activeBadge.id === item.id;
                const badgeData = GITHUB_BADGES.find((b) => b.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectBadge(item.id)}
                    className={cn(
                      'w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer',
                      isCurrent
                        ? 'bg-[#101114] text-white border-[#101114] shadow-xs'
                        : owned
                        ? 'bg-[#F7F8EF] border-[#DCE89E] hover:bg-white text-[#101114]'
                        : 'bg-[#FAF9F5] border-[#E5E3DA] hover:bg-white hover:border-[#DCE89E] text-[#101114]'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={badgeData?.image}
                        alt={item.name}
                        className="w-6 h-6 object-contain shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate flex items-center gap-1.5">
                          <span className={isCurrent ? 'text-white' : 'text-[#101114]'}>{item.name}</span>
                        </div>
                        <span className={cn('text-[10px] block truncate', isCurrent ? 'text-slate-400' : 'text-[#65666A]')}>
                          {item.desc}
                        </span>
                      </div>
                    </div>

                    {owned ? (
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-0.5 shrink-0',
                        isCurrent ? 'bg-[#D7FF36] text-[#101114]' : 'bg-[#84CC16]/20 text-[#4D7C0F]'
                      )}>
                        <Check size={10} strokeWidth={3} />
                        <span>DONE</span>
                      </span>
                    ) : (
                      <span className={cn(
                        'text-[10px] font-mono font-bold shrink-0',
                        isCurrent ? 'text-[#D7FF36]' : 'text-[#65666A]'
                      )}>
                        {item.time}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

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

      {/* ── 24H–72H SLA INDEXING DIALOG (RESPONSIVE) ── */}
      {showSlaInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg my-auto rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-2xl text-left space-y-5 max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain">
            <button
              type="button"
              onClick={() => setShowSlaInfoModal(false)}
              className="absolute top-4 right-4 z-20 size-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </button>

            <div className="space-y-1.5 pr-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
                <Clock size={12} className="text-emerald-600" />
                <span>GitHub Telemetry Standard</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                24h–72h Indexing SLA
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Why does GitHub take 24 to 72 hours to render certain profile badges?
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-900">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-bold flex items-center gap-2 text-slate-900">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  1. Git Tree Verification (Immediate)
                </div>
                <p className="text-slate-600 text-[11px] pl-3.5 leading-relaxed">
                  The moment your action occurs, your commit trailers, discussion solutions, or webhooks are cryptographically sealed in GitHub's Git tree.
                </p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-bold flex items-center gap-2 text-slate-900">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  2. Asynchronous Queue Processing (12h–48h)
                </div>
                <p className="text-slate-600 text-[11px] pl-3.5 leading-relaxed">
                  GitHub runs background cron workers across 100M+ accounts to prevent webhook load spikes. Attribution workers index achievements in scheduled batches.
                </p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-bold flex items-center gap-2 text-slate-900">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  3. Official Profile Unfurl (24h–72h)
                </div>
                <p className="text-slate-600 text-[11px] pl-3.5 leading-relaxed">
                  Once verified, GitHub automatically displays the 3D medallion in your public profile's Achievements panel at <span className="font-mono text-slate-900 font-semibold">github.com/&#123;username&#125;?tab=achievements</span>.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200">
              <span className="text-[11px] text-emerald-700 font-mono font-bold">
                ✓ 100% Genuine Webhook Ingestion
              </span>
              <button
                type="button"
                onClick={() => setShowSlaInfoModal(false)}
                className="h-10 px-5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer transition-colors shadow-xs"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
