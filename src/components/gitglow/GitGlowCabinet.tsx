import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Lock,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  GitPullRequest,
  FolderGit2,
  MessageSquare,
} from 'lucide-react';
import { BadgeStatusEvaluation } from '../../lib/gitglow/gitglow-api';

export interface BadgeSlotState {
  id: string;
  name: string;
  icon: string;
  estimatedTime: string;
  difficulty: string;
  status: 'earned' | 'processing' | 'available';
  statusLabel: string;
}

interface GitGlowCabinetProps {
  isScanning?: boolean;
  connectedUsername?: string | null;
  onAuditUsername?: (username: string) => void;
  scannedUser: {
    username: string;
    avatarUrl?: string;
    score: number;
    potentialScore?: number;
    earnedBadgeIds: string[];
    processingBadgeIds: string[];
    publicRepos?: number;
    totalMergedPrs?: number;
    totalIssuesClosed?: number;
    pullSharkTier?: string;
    badgeEvaluations?: Record<string, BadgeStatusEvaluation>;
  } | null;
  onSelectBadge: (badgeId: string) => void;
  onClaimRecommended?: (badgeId: string) => void;
}

const AUTOMATED_BADGES: {
  id: string;
  name: string;
  image: string;
  webpImage: string;
  alt: string;
  time: string;
  minutes: number;
  difficulty: string;
  description: string;
}[] = [
  {
    id: 'pull-shark',
    name: 'Pull Shark',
    image: '/images/badges/pull-shark.png',
    webpImage: '/images/badges/pull-shark.webp',
    alt: 'GitHub Pull Shark Achievement Badge - Merged Pull Requests Trophy',
    time: '~5 min',
    minutes: 5,
    difficulty: 'Easy',
    description: 'Merged 2+ pull requests into public repos.',
  },
  {
    id: 'quickdraw',
    name: 'Quickdraw',
    image: '/images/badges/quickdraw.png',
    webpImage: '/images/badges/quickdraw.webp',
    alt: 'GitHub Quickdraw Achievement Badge - Closed in under 5 minutes Trophy',
    time: '~2 min',
    minutes: 2,
    difficulty: 'Very Easy',
    description: 'Closed an issue or pull request within 5 minutes.',
  },
  {
    id: 'yolo',
    name: 'YOLO',
    image: '/images/badges/yolo.png',
    webpImage: '/images/badges/yolo.webp',
    alt: 'GitHub YOLO Achievement Badge - Merge Without Code Review Trophy',
    time: '~2 min',
    minutes: 2,
    difficulty: 'Easy',
    description: 'Merged a pull request directly without code review.',
  },
  {
    id: 'pair-extraordinaire',
    name: 'Pair Extraordinaire',
    image: '/images/badges/pair-extraordinaire.png',
    webpImage: '/images/badges/pair-extraordinaire.webp',
    alt: 'GitHub Pair Extraordinaire Achievement Badge - Co-authored Commit Trophy',
    time: '~5 min',
    minutes: 5,
    difficulty: 'Medium',
    description: 'Co-authored a commit in a merged pull request.',
  },
  {
    id: 'galaxy-brain',
    name: 'Galaxy Brain',
    image: '/images/badges/galaxy-brain.png',
    webpImage: '/images/badges/galaxy-brain.webp',
    alt: 'GitHub Galaxy Brain Achievement Badge - Accepted Discussion Answer Trophy',
    time: '~5 min',
    minutes: 5,
    difficulty: 'Medium',
    description: 'Accepted answer on a repository discussion.',
  },
];

const QUICK_WIN_ORDER = ['quickdraw', 'yolo', 'pull-shark', 'pair-extraordinaire', 'galaxy-brain'];

function formatShortTier(tier?: string): string | null {
  if (!tier || tier === 'None' || tier === 'Default (Unlocked)') return null;
  if (tier.includes('x4')) return '×4';
  if (tier.includes('x3')) return '×3';
  if (tier.includes('x2')) return '×2';
  return null;
}

export const GitGlowCabinet: React.FC<GitGlowCabinetProps> = ({
  isScanning = false,
  connectedUsername = null,
  onAuditUsername,
  scannedUser,
  onSelectBadge,
  onClaimRecommended,
}) => {
  const [showFormula, setShowFormula] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'claimable' | 'earned'>('all');
  const [isSwitchingHandle, setIsSwitchingHandle] = useState(false);
  const [switchInput, setSwitchInput] = useState('');

  // Determine current states (never show fake earned badges before user runs an audit)
  const isPreScan = !scannedUser;
  const username = scannedUser ? scannedUser.username : '';
  const score = scannedUser ? scannedUser.score : null;
  const potentialScore = scannedUser?.potentialScore ?? 100;
  const scoreGain = score !== null ? Math.max(0, potentialScore - score) : 0;
  const earnedIds = scannedUser ? scannedUser.earnedBadgeIds : [];
  const processingIds = scannedUser ? scannedUser.processingBadgeIds : [];

  const isViewingAnotherAccount = Boolean(
    !isPreScan &&
      connectedUsername &&
      username.toLowerCase() !== connectedUsername.toLowerCase()
  );

  useEffect(() => {
    setFilterTab('all');
    setIsSwitchingHandle(false);
    setSwitchInput('');
  }, [username]);

  const earnedCount = earnedIds.filter((id) => AUTOMATED_BADGES.some((b) => b.id === id)).length;
  const claimableBadges = AUTOMATED_BADGES.filter(
    (b) => !earnedIds.includes(b.id) && !processingIds.includes(b.id)
  );
  const claimableCount = claimableBadges.length;
  const totalClaimMinutes = claimableBadges.reduce((acc, b) => acc + b.minutes, 0);

  const firstAvailableBadge =
    QUICK_WIN_ORDER.map((id) => claimableBadges.find((b) => b.id === id)).find(Boolean) ||
    claimableBadges[0];

  const visibleBadges = isPreScan || filterTab === 'all'
    ? AUTOMATED_BADGES
    : filterTab === 'claimable'
      ? AUTOMATED_BADGES.filter((b) => !earnedIds.includes(b.id))
      : AUTOMATED_BADGES.filter((b) => earnedIds.includes(b.id));

  const handleSwitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAuditUsername) return;
    const cleaned = switchInput
      .trim()
      .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
      .replace(/^@/, '')
      .split('/')[0]
      .split('?')[0];
    if (!cleaned) return;
    setIsSwitchingHandle(false);
    setSwitchInput('');
    onAuditUsername(cleaned);
  };

  // Derive personalized 1-line diagnostic for each card in post-audit mode
  const getPersonalizedCardCopy = (badge: typeof AUTOMATED_BADGES[number], isEarned: boolean): string => {
    if (isPreScan) return badge.description;
    const evalData = scannedUser?.badgeEvaluations?.[badge.id];

    if (badge.id === 'pull-shark') {
      const prs = scannedUser?.totalMergedPrs ?? 0;
      const tier = formatShortTier(scannedUser?.pullSharkTier);
      if (isEarned) {
        return tier
          ? `Tier ${tier} active (${prs} merged PRs detected).`
          : `Verified on profile (${prs} merged PRs detected).`;
      }
      if (prs === 1) return '1 / 2 merged PRs detected — just 1 PR away.';
      return '0 / 2 merged PRs found — needs 2 merged PRs.';
    }

    if (badge.id === 'quickdraw') {
      const closed = scannedUser?.totalIssuesClosed ?? 0;
      if (isEarned) return evalData?.detail || 'Fast <5 min resolution verified on profile.';
      if (closed > 0) return `${closed} closed issue(s) found, none under 5 min.`;
      return 'No <5 min closed issue found yet.';
    }

    if (isEarned) return 'Verified live on your GitHub profile.';
    return badge.description;
  };

  return (
    <section id="cabinet" className="scroll-mt-20 sm:scroll-mt-24 py-16 md:py-24 bg-[#0D1117] text-[#E6EDF3]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-7">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#D7FF36] uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>Achievement Trophies</span>
              {isPreScan && !isScanning && (
                <span className="px-2 py-0.5 rounded-full bg-[#161B22] border border-[#30363D] text-[10px] text-[#8B949E]">
                  Ready to Audit
                </span>
              )}
              {!isPreScan && !isScanning && (
                <div className="inline-flex items-center gap-1.5 ml-1">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                    {earnedCount} On Profile
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#D7FF36]/10 border border-[#D7FF36]/30 text-[10px] font-bold text-[#D7FF36]">
                    {claimableCount} Claimable
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-[#E6EDF3] tracking-tight">
                {isScanning
                  ? 'Auditing GitHub Profile...'
                  : isPreScan
                    ? 'Trophy Cabinet (5 Verified Slots)'
                    : `@${username}'s Achievement Cabinet`}
              </h2>

              {/* Inline Quick Switch Handle Trigger (#3 Test Drive -> Own Account) */}
              {!isPreScan && !isScanning && onAuditUsername && !isSwitchingHandle && (
                <button
                  type="button"
                  onClick={() => setIsSwitchingHandle(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] text-[11px] font-semibold text-[#8B949E] hover:text-[#E6EDF3] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Switch handle</span>
                </button>
              )}
            </div>

            {/* Inline Switcher Form */}
            {isSwitchingHandle && (
              <form onSubmit={handleSwitchSubmit} className="flex items-center gap-2 max-w-sm pt-1">
                <input
                  type="text"
                  value={switchInput}
                  onChange={(e) => setSwitchInput(e.target.value)}
                  placeholder="Enter your GitHub handle"
                  autoFocus
                  className="flex-1 px-3 py-2 bg-[#161B22] border border-[#30363D] focus:border-[#D7FF36] rounded-[10px] text-sm text-[#E6EDF3] placeholder-[#8B949E] outline-none"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-[10px] bg-[#D7FF36] hover:bg-[#cbf42e] text-[#0D1117] font-bold text-xs cursor-pointer"
                >
                  Audit
                </button>
                <button
                  type="button"
                  onClick={() => setIsSwitchingHandle(false)}
                  className="px-2.5 py-2 rounded-[10px] bg-[#161B22] border border-[#30363D] text-xs text-[#8B949E] hover:text-[#E6EDF3] cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Live Scanned Evidence Strip (#1 Surface Real Telemetry) */}
            {!isPreScan && !isScanning && scannedUser ? (
              <div className="space-y-2">
                <p className="text-sm sm:text-base text-[#8B949E] max-w-2xl">
                  {claimableCount > 0 ? (
                    <>
                      Found{' '}
                      <span className="text-[#E6EDF3] font-semibold">{earnedCount} of 5</span>{' '}
                      official tracks earned. Claiming the remaining{' '}
                      <span className="text-[#D7FF36] font-semibold">{claimableCount}</span>{' '}
                      takes ~{totalClaimMinutes} min{scoreGain > 0 ? ` and lifts your score from ${score} → ${potentialScore}` : ''}.
                    </>
                  ) : (
                    <>All 5 automated GitHub tracks are active or queued on @{username}.</>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-[#8B949E]">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-[#161B22] border border-[#30363D]">
                    <FolderGit2 className="w-3.5 h-3.5 text-[#D7FF36]" />
                    <span>
                      <strong className="text-[#E6EDF3] tabular-nums">{scannedUser.publicRepos ?? 0}</strong> public repos
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-[#161B22] border border-[#30363D]">
                    <GitPullRequest className="w-3.5 h-3.5 text-[#D7FF36]" />
                    <span>
                      <strong className="text-[#E6EDF3] tabular-nums">{scannedUser.totalMergedPrs ?? 0}</strong> merged PRs
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-[#161B22] border border-[#30363D]">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D7FF36]" />
                    <span>
                      <strong className="text-[#E6EDF3] tabular-nums">{scannedUser.totalIssuesClosed ?? 0}</strong> closed issues
                    </span>
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm sm:text-base text-[#8B949E] max-w-xl">
                Official GitHub achievements verified through transparent git events. Click any trophy to inspect requirements or run the 1-click sandbox claim.
              </p>
            )}
          </div>

          {/* Score & Potential Uplift Card */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="p-4 rounded-[14px] bg-[#161B22] border border-[#30363D] flex items-center gap-4">
              {scannedUser?.avatarUrl ? (
                <img src={scannedUser.avatarUrl} alt={username} className="w-10 h-10 rounded-full border border-[#30363D]" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#21262D] border border-[#30363D] flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#D7FF36]" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-[11px] text-[#8B949E] font-medium uppercase tracking-wider whitespace-nowrap">
                    Profile Score
                  </span>
                  {!isPreScan && !isScanning && scoreGain > 0 && (
                    <span className="px-1.5 py-0.5 rounded-[6px] bg-emerald-500/12 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 tabular-nums whitespace-nowrap">
                      +{scoreGain} pts available
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold font-heading text-[#D7FF36] tabular-nums leading-none mt-1">
                  {isScanning ? (
                    <span className="inline-block w-10 h-6 bg-[#21262D] rounded-[6px] animate-pulse align-middle" />
                  ) : (
                    <>
                      {score !== null ? score : '--'} <span className="text-xs text-[#8B949E] font-normal">/ 100</span>
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFormula(!showFormula)}
                className="ml-1 px-2.5 py-1.5 rounded-[10px] bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] transition-colors cursor-pointer text-xs flex items-center gap-1"
                title="How is score calculated?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Formula</span>
                {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Transparent Formula Breakdown Accordion */}
        <AnimatePresence>
          {showFormula && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-5 rounded-[14px] bg-[#161B22] border border-[#30363D] text-xs text-[#8B949E] space-y-3">
                <div className="font-bold text-[#E6EDF3] text-sm font-heading flex items-center justify-between">
                  <span>GitGlow Score Calculation (Exact 100-Point Formula)</span>
                  <span className="text-[#D7FF36]">Total = 100 pts</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  <div className="p-3 rounded-[12px] bg-[#0D1117] border border-[#30363D]">
                    <div className="font-bold text-[#E6EDF3]">5 Active Badges (50 pts)</div>
                    <div className="text-[11px] mt-1">10 pts for each automated official badge unlocked.</div>
                  </div>
                  <div className="p-3 rounded-[12px] bg-[#0D1117] border border-[#30363D]">
                    <div className="font-bold text-[#E6EDF3]">Merged PR Activity (20 pts)</div>
                    <div className="text-[11px] mt-1">Pull requests merged cleanly into default branches.</div>
                  </div>
                  <div className="p-3 rounded-[12px] bg-[#0D1117] border border-[#30363D]">
                    <div className="font-bold text-[#E6EDF3]">Fast Issue Resolution (15 pts)</div>
                    <div className="text-[11px] mt-1">Issues triaged and closed in under 300 seconds.</div>
                  </div>
                  <div className="p-3 rounded-[12px] bg-[#0D1117] border border-[#30363D]">
                    <div className="font-bold text-[#E6EDF3]">Discussions &amp; Q&amp;A (15 pts)</div>
                    <div className="text-[11px] mt-1">Accepted answers and collaborative community posts.</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommended Action Banner */}
        {isScanning ? (
          <div className="mb-8 p-4 rounded-[14px] bg-[#161B22] border border-[#30363D] flex items-center gap-3.5 animate-pulse">
            <div className="w-10 h-10 rounded-[12px] bg-[#21262D]" />
            <div className="space-y-2 flex-1">
              <div className="w-36 h-3 bg-[#21262D] rounded" />
              <div className="w-64 max-w-full h-4 bg-[#21262D] rounded" />
            </div>
          </div>
        ) : isPreScan ? (
          <div className="mb-8 p-4 rounded-[14px] bg-gradient-to-r from-[#D7FF36]/10 via-[#161B22] to-[#161B22] border border-[#D7FF36]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 shrink-0 rounded-[12px] bg-[#161B22] border border-[#30363D] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#D7FF36]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#D7FF36] uppercase tracking-wider">Start Your Free Audit</div>
                <div className="text-sm font-bold text-[#E6EDF3] font-heading">
                  Enter your GitHub username above to audit your profile &amp; claim missing badges
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                  const input = document.querySelector<HTMLInputElement>('section input[type="text"]');
                  input?.focus();
                }, 400);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-[12px] bg-[#D7FF36] hover:bg-[#cbf42e] text-[#0D1117] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
            >
              <span>Audit My Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : isViewingAnotherAccount && connectedUsername && onAuditUsername ? (
          <div className="mb-8 p-4 rounded-[14px] bg-gradient-to-r from-[#388BFD]/12 via-[#161B22] to-[#161B22] border border-[#388BFD]/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 shrink-0 rounded-[12px] bg-[#388BFD]/15 border border-[#388BFD]/30 flex items-center justify-center text-[#388BFD]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#388BFD] uppercase tracking-wider">
                  Read-Only Preview · Signed in as @{connectedUsername}
                </div>
                <div className="text-sm font-bold text-[#E6EDF3] font-heading">
                  Viewing @{username}’s badges. Switch to @{connectedUsername} to claim badges on your profile.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onAuditUsername(connectedUsername)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-[12px] bg-[#D7FF36] hover:bg-[#cbf42e] text-[#0D1117] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
            >
              <span>Audit @{connectedUsername}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : firstAvailableBadge ? (
          <div className="mb-8 p-4 rounded-[14px] bg-gradient-to-r from-[#D7FF36]/10 via-[#161B22] to-[#161B22] border border-[#D7FF36]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <picture className="w-11 h-11 shrink-0 flex items-center justify-center rounded-[12px] bg-[#0D1117] border border-[#D7FF36]/25 p-1">
                <source type="image/webp" srcSet={firstAvailableBadge.webpImage} />
                <img
                  src={firstAvailableBadge.image}
                  alt={firstAvailableBadge.alt}
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className="w-9 h-9 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                />
              </picture>
              <div>
                <div className="text-[11px] font-bold text-[#D7FF36] uppercase tracking-wider">
                  Recommended Quick Win · {claimableCount} {claimableCount === 1 ? 'badge' : 'badges'} claimable (~{totalClaimMinutes} min total)
                </div>
                <div className="text-sm sm:text-base font-bold text-[#E6EDF3] font-heading">
                  Start with {firstAvailableBadge.name} ({firstAvailableBadge.time})
                </div>
                <div className="text-xs text-[#8B949E] mt-0.5">
                  Opens guided preview &amp; CLI steps — nothing runs without your confirmation.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => (onClaimRecommended ? onClaimRecommended(firstAvailableBadge.id) : onSelectBadge(firstAvailableBadge.id))}
              className="w-full sm:w-auto px-5 py-2.5 rounded-[12px] bg-[#D7FF36] hover:bg-[#cbf42e] text-[#0D1117] font-bold text-xs transition-all duration-150 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-[0_0_20px_rgba(215,255,54,0.22)]"
            >
              <span>Preview &amp; Claim</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="mb-8 p-4 rounded-[14px] bg-gradient-to-r from-emerald-500/12 via-[#161B22] to-[#161B22] border border-emerald-500/35 flex items-center gap-3.5">
            <div className="w-10 h-10 shrink-0 rounded-[12px] bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">All Tracks Complete</div>
              <div className="text-sm font-bold text-[#E6EDF3] font-heading">
                @{username} already holds or queued all 5 official automated badges!
              </div>
            </div>
          </div>
        )}

        {/* #4 Selective Filter Bar + Safety Reassurance (Post-Audit State Only) */}
        {!isPreScan && !isScanning && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div
              role="tablist"
              aria-label="Filter achievement badges"
              className="inline-flex items-center p-1 rounded-[12px] bg-[#161B22] border border-[#30363D] self-start"
            >
              {[
                { key: 'all' as const, label: `All (${AUTOMATED_BADGES.length})` },
                { key: 'claimable' as const, label: `Claimable (${claimableCount})` },
                { key: 'earned' as const, label: `On Profile (${earnedCount})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={filterTab === tab.key}
                  onClick={() => setFilterTab(tab.key)}
                  className={`px-3 py-1.5 rounded-[9px] text-xs font-semibold transition-all cursor-pointer ${
                    filterTab === tab.key
                      ? 'bg-[#21262D] text-[#E6EDF3] shadow-xs border border-[#30363D]'
                      : 'text-[#8B949E] hover:text-[#E6EDF3] border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#8B949E] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D7FF36] shrink-0" />
              <span>Pick any individual badge to claim or copy manual CLI commands</span>
            </div>
          </div>
        )}

        {/* ─── DESKTOP: Glass Shelf Grid ─── */}
        <div className="hidden md:grid grid-cols-5 gap-4">
          {visibleBadges.map((badge) => {
            if (isScanning) {
              return (
                <div
                  key={badge.id}
                  className="p-5 rounded-[16px] border border-[#30363D] bg-[#161B22]/60 min-h-[288px] flex flex-col items-center justify-between animate-pulse"
                >
                  <div className="w-full flex justify-between">
                    <div className="w-14 h-4 bg-[#21262D] rounded-full" />
                    <div className="w-12 h-4 bg-[#21262D] rounded" />
                  </div>
                  <div className="w-20 h-20 rounded-full bg-[#21262D]" />
                  <div className="w-full space-y-2 flex flex-col items-center">
                    <div className="w-24 h-4 bg-[#21262D] rounded" />
                    <div className="w-32 h-3 bg-[#21262D] rounded" />
                    <div className="w-28 h-7 bg-[#21262D] rounded-[10px]" />
                  </div>
                </div>
              );
            }

            const isEarned = earnedIds.includes(badge.id);
            const isProcessing = processingIds.includes(badge.id);
            const pullSharkShortTier = badge.id === 'pull-shark' ? formatShortTier(scannedUser?.pullSharkTier) : null;
            const cardCopy = getPersonalizedCardCopy(badge, isEarned);

            return (
              <div
                key={badge.id}
                onClick={() => onSelectBadge(badge.id)}
                className={`group relative p-5 rounded-[16px] border transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between min-h-[288px] ${
                  isEarned
                    ? 'bg-[#161B22]/90 border-emerald-500/35 shadow-[0_0_24px_rgba(16,185,129,0.08)] hover:border-emerald-400/70'
                    : isProcessing
                    ? 'bg-[#161B22]/90 border-[#388BFD]/50 shadow-[0_0_20px_rgba(56,139,253,0.14)] hover:border-[#388BFD]'
                    : 'bg-[#161B22]/75 border-[#30363D] hover:border-[#D7FF36]/55 hover:bg-[#161B22] hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]'
                }`}
              >
                {/* Top Badge Difficulty & Time */}
                <div className="w-full flex items-center justify-between text-[11px] text-[#8B949E]">
                  <span className="px-2 py-0.5 rounded-full bg-[#0D1117] border border-[#30363D]">{badge.difficulty}</span>
                  <span className="flex items-center gap-1 font-code">
                    <Clock className="w-3 h-3" />
                    <span>{badge.time}</span>
                  </span>
                </div>

                {/* Central Trophy Art */}
                <div className="relative my-3">
                  <div
                    className={`w-20 h-20 rounded-[16px] flex items-center justify-center p-2 transition-all duration-300 group-hover:scale-105 relative ${
                      isEarned
                        ? 'bg-gradient-to-tr from-emerald-500/15 via-[#161B22] to-transparent border border-emerald-500/35 shadow-[0_4px_20px_rgba(16,185,129,0.14)]'
                        : isProcessing
                        ? 'bg-gradient-to-tr from-[#388BFD]/15 via-[#161B22] to-transparent border border-[#388BFD]/40 shadow-[0_4px_16px_rgba(56,139,253,0.15)] animate-pulse'
                        : isPreScan
                          ? 'bg-[#0D1117]/80 border border-[#30363D] opacity-75 group-hover:opacity-100'
                          : 'bg-[#0D1117] border border-[#30363D] group-hover:border-[#D7FF36]/40'
                    }`}
                  >
                    <picture className="w-full h-full flex items-center justify-center">
                      <source type="image/webp" srcSet={badge.webpImage} />
                      <img
                        src={badge.image}
                        alt={badge.alt}
                        width={64}
                        height={64}
                        loading="lazy"
                        decoding="async"
                        className={`w-14 h-14 object-contain transition-all duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${
                          isEarned
                            ? 'scale-100 filter-none'
                            : isProcessing
                            ? 'scale-95 opacity-80'
                            : isPreScan
                              ? 'grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-95'
                              : 'opacity-85 group-hover:opacity-100 group-hover:scale-105'
                        }`}
                      />
                    </picture>

                    {/* Status overlay icon */}
                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0D1117]/60 rounded-[16px] backdrop-blur-xs">
                        <Clock className="w-6 h-6 text-[#388BFD] animate-spin" />
                      </div>
                    )}
                    {isPreScan && !isEarned && !isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-[16px] bg-black/25 group-hover:bg-transparent transition-colors">
                        <div className="w-7 h-7 rounded-full bg-[#161B22]/90 border border-[#30363D] flex items-center justify-center text-[#8B949E] group-hover:text-[#D7FF36] group-hover:border-[#D7FF36]/50 shadow-md transition-colors">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}
                    {!isPreScan && isEarned && (
                      <div className="absolute -top-1.5 -right-1.5 flex items-center gap-0.5">
                        {pullSharkShortTier ? (
                          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-[#0D1117] text-[10px] font-extrabold leading-none shadow-md">
                            {pullSharkShortTier}
                          </span>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-[#0D1117] flex items-center justify-center shadow-md">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Badge Name, Personalized Diagnostic & Action Pill */}
                <div className="w-full space-y-2.5">
                  <div>
                    <h3
                      className={`font-bold text-sm font-heading transition-colors ${
                        isEarned ? 'text-[#E6EDF3]' : 'text-[#E6EDF3] group-hover:text-[#D7FF36]'
                      }`}
                    >
                      {badge.name}
                    </h3>
                    <p className="text-[11px] text-[#8B949E] mt-1 leading-snug line-clamp-2 min-h-[30px]">
                      {cardCopy}
                    </p>
                  </div>

                  {/* State Action Pill */}
                  <div>
                    {isEarned ? (
                      <span className="inline-flex items-center justify-center gap-1 w-full py-1.5 px-2.5 rounded-[10px] bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{pullSharkShortTier ? `On Profile · ${pullSharkShortTier}` : 'On Profile'}</span>
                      </span>
                    ) : isProcessing ? (
                      <span className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-2.5 rounded-[10px] bg-[#388BFD]/10 border border-[#388BFD]/30 text-[11px] font-bold text-[#388BFD] animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#388BFD]" />
                        <span>Indexing (hours)</span>
                      </span>
                    ) : isPreScan ? (
                      <span className="inline-flex items-center justify-center gap-1 w-full py-1.5 px-2.5 rounded-[10px] bg-[#0D1117] border border-[#30363D] text-[11px] font-medium text-[#8B949E] group-hover:border-[#D7FF36]/40 group-hover:text-[#D7FF36]">
                        <ArrowRight className="w-3 h-3" />
                        <span>Inspect ({badge.time})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-[10px] bg-[#D7FF36]/12 border border-[#D7FF36]/35 text-[11px] font-bold text-[#D7FF36] group-hover:bg-[#D7FF36] group-hover:text-[#0D1117] group-hover:border-[#D7FF36] transition-colors">
                        <span>Preview &amp; Claim</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── MOBILE: Vertical Stacked List (Strict Ergonomic Choice) ─── */}
        <div className="md:hidden space-y-3">
          {visibleBadges.map((badge) => {
            if (isScanning) {
              return (
                <div
                  key={badge.id}
                  className="p-4 rounded-[14px] border border-[#30363D] bg-[#161B22]/60 flex items-center justify-between gap-4 animate-pulse"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-[12px] bg-[#21262D]" />
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-[#21262D] rounded" />
                      <div className="w-36 h-3 bg-[#21262D] rounded" />
                    </div>
                  </div>
                  <div className="w-16 h-7 bg-[#21262D] rounded-full" />
                </div>
              );
            }

            const isEarned = earnedIds.includes(badge.id);
            const isProcessing = processingIds.includes(badge.id);
            const pullSharkShortTier = badge.id === 'pull-shark' ? formatShortTier(scannedUser?.pullSharkTier) : null;
            const cardCopy = getPersonalizedCardCopy(badge, isEarned);

            return (
              <div
                key={badge.id}
                onClick={() => onSelectBadge(badge.id)}
                className={`p-4 rounded-[14px] border flex items-center justify-between gap-3 transition-all duration-150 active:scale-[0.99] cursor-pointer min-h-[56px] ${
                  isEarned
                    ? 'bg-[#161B22] border-emerald-500/35'
                    : isProcessing
                    ? 'bg-[#161B22] border-[#388BFD]/40'
                    : 'bg-[#161B22]/75 border-[#30363D]'
                }`}
              >
                {/* Left: Real Badge Artwork */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-14 h-14 rounded-[12px] flex items-center justify-center p-1.5 shrink-0 relative ${
                      isEarned
                        ? 'bg-gradient-to-tr from-emerald-500/20 via-[#161B22] to-transparent border border-emerald-500/40'
                        : isProcessing
                        ? 'bg-gradient-to-tr from-[#388BFD]/20 via-[#161B22] to-transparent border border-[#388BFD]/40 animate-pulse'
                        : 'bg-[#0D1117] border border-[#30363D]'
                    }`}
                  >
                    <picture className="w-full h-full flex items-center justify-center">
                      <source type="image/webp" srcSet={badge.webpImage} />
                      <img
                        src={badge.image}
                        alt={badge.alt}
                        width={48}
                        height={48}
                        loading="lazy"
                        decoding="async"
                        className={`w-10 h-10 object-contain drop-shadow-md ${
                          isEarned
                            ? 'filter-none'
                            : isProcessing
                            ? 'opacity-85'
                            : isPreScan
                              ? 'grayscale brightness-75'
                              : 'opacity-90'
                        }`}
                      />
                    </picture>
                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0D1117]/60 rounded-[12px]">
                        <Clock className="w-4 h-4 text-[#388BFD] animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-[#E6EDF3] font-heading truncate flex items-center gap-1.5">
                      <span>{badge.name}</span>
                      {isEarned && pullSharkShortTier && (
                        <span className="px-1.5 py-px rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] text-emerald-400">
                          {pullSharkShortTier}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#8B949E] truncate mt-0.5">{cardCopy}</div>
                    <div className="text-[10px] text-[#8B949E] flex items-center gap-1.5 mt-0.5">
                      <span>{badge.difficulty}</span>
                      <span>•</span>
                      <span>{badge.time}</span>
                    </div>
                  </div>
                </div>

                {/* Right: State Label Pill */}
                <div className="shrink-0">
                  {isEarned ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/12 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                      Earned ✓
                    </span>
                  ) : isProcessing ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#388BFD]/10 border border-[#388BFD]/30 text-[11px] font-bold text-[#388BFD]">
                      Pending
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-[10px] bg-[#D7FF36] text-[#0D1117] font-bold text-[11px] flex items-center gap-1">
                      <span>Preview</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
