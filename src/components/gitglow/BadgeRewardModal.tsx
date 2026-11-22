import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  MessageSquare,
  GitPullRequest,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../../lib/utils';
import { useGitGlowStore } from '../../lib/gitglow/gitglow-store';

interface BadgeRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeName: string;
  badgeIcon: string;
  username: string;
  durationSeconds?: number;
  issueNumber?: number;
  repoFullName: string;
  issueUrl?: string;
  itemType?: 'issue' | 'pr' | 'discussion' | 'milestone';
  stat1Label?: string;
  stat1Value?: string;
  stat1Sub?: string;
  stat2Label?: string;
  stat2Value?: string;
  stat2Sub?: string;
  slaTime?: string;
  isAsyncIndexerBadge?: boolean;
  commitSha?: string;
  isLiveOnProfile?: boolean;
  onContinueToNext?: () => void;
}

export const BadgeRewardModal: React.FC<BadgeRewardModalProps> = ({
  isOpen,
  onClose,
  badgeName,
  badgeIcon,
  username,
  durationSeconds = 25,
  issueNumber = 1,
  repoFullName,
  issueUrl,
  itemType = 'issue',
  stat1Label,
  stat1Value,
  stat1Sub,
  stat2Label,
  stat2Value,
  stat2Sub,
  slaTime,
  isAsyncIndexerBadge,
  commitSha,
  isLiveOnProfile,
  onContinueToNext,
}) => {
  const { scanAnalysis, refreshLiveAchievements } = useGitGlowStore();
  const [isCheckingLive, setIsCheckingLive] = useState(false);
  const [liveCheckFeedback, setLiveCheckFeedback] = useState<string | null>(null);

  const badgeSlug = badgeName.toLowerCase().replace(/\s+/g, '-');
  const isGalaxyBrain = badgeName.toLowerCase().includes('galaxy');
  const isPairExtraordinaire = badgeName.toLowerCase().includes('pair');
  const isYolo = badgeName.toLowerCase().includes('yolo');
  const isPullShark = badgeName.toLowerCase().includes('shark');

  const isLiveConfirmed =
    Boolean(isLiveOnProfile) ||
    Boolean(scanAnalysis?.liveEarnedAchievements?.includes(badgeSlug)) ||
    (isPullShark && (scanAnalysis?.totalMergedPrs ?? 0) >= 2) ||
    (badgeSlug === 'quickdraw' && Boolean(scanAnalysis?.quickdrawQualified));

  const handleCheckLive = async () => {
    setIsCheckingLive(true);
    setLiveCheckFeedback(null);
    try {
      const live = await refreshLiveAchievements(username);
      if (live.includes(badgeSlug)) {
        setLiveCheckFeedback('✓ Confirmed live on your GitHub profile!');
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch {}
      } else {
        setLiveCheckFeedback('Still indexing in GitHub batch queue (24–72h SLA).');
      }
    } catch {
      setLiveCheckFeedback('Could not check GitHub right now. Please retry in a moment.');
    } finally {
      setIsCheckingLive(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.55 },
          colors: ['#D7FF36', '#84CC16', '#101114', '#A855F7', '#38BDF8'],
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const theme = isGalaxyBrain
    ? {
        accentBg: 'bg-violet-50',
        accentBorder: 'border-violet-200',
        accentText: 'text-violet-700',
        glowBg: 'bg-violet-500/15',
        badgeBorder: 'border-violet-300',
        pillBg: 'bg-violet-100 text-violet-800 border-violet-200',
        qualifyBadge: 'bg-violet-950 text-violet-200 border-violet-700/50',
      }
    : isPairExtraordinaire
    ? {
        accentBg: 'bg-emerald-50',
        accentBorder: 'border-emerald-200',
        accentText: 'text-emerald-800',
        glowBg: 'bg-emerald-500/15',
        badgeBorder: 'border-emerald-300',
        pillBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        qualifyBadge: 'bg-emerald-950 text-emerald-200 border-emerald-700/50',
      }
    : isPullShark
    ? {
        accentBg: 'bg-sky-50',
        accentBorder: 'border-sky-200',
        accentText: 'text-sky-800',
        glowBg: 'bg-sky-500/15',
        badgeBorder: 'border-sky-300',
        pillBg: 'bg-sky-100 text-sky-800 border-sky-200',
        qualifyBadge: 'bg-sky-950 text-sky-200 border-sky-700/50',
      }
    : isYolo
    ? {
        accentBg: 'bg-amber-50',
        accentBorder: 'border-amber-200',
        accentText: 'text-amber-800',
        glowBg: 'bg-amber-500/15',
        badgeBorder: 'border-amber-300',
        pillBg: 'bg-amber-100 text-amber-800 border-amber-200',
        qualifyBadge: 'bg-amber-950 text-amber-200 border-amber-700/50',
      }
    : {
        accentBg: 'bg-lime-50',
        accentBorder: 'border-lime-200',
        accentText: 'text-lime-800',
        glowBg: 'bg-lime-500/15',
        badgeBorder: 'border-lime-300',
        pillBg: 'bg-lime-100 text-lime-800 border-lime-200',
        qualifyBadge: 'bg-slate-900 text-lime-300 border-lime-600/50',
      };

  const handleShareOnX = () => {
    let itemLabel = `Milestone verified!`;
    if (isGalaxyBrain) {
      itemLabel = `2/2 Accepted Answers verified on GitHub Discussions`;
    } else if (itemType === 'pr') {
      itemLabel = `PR #${issueNumber} merged on default branch`;
    } else if (itemType === 'issue') {
      itemLabel = `Issue #${issueNumber} closed in ${durationSeconds}s`;
    }
    const tweet = `Just qualified for the official GitHub "${badgeName}" achievement using @GitGlow! ⚡\n\n${itemLabel}.\n\nProfile: https://github.com/${username}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {/* Outer viewport wrapper with full vertical scroll support on small screens */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg my-auto rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col max-h-[calc(100dvh-2rem)] overflow-hidden text-center"
        >
          {/* Subtle Dynamic Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl',
              theme.glowBg
            )}
          />

          {/* Close button: Guaranteed top-right positioning */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 size-8 rounded-full bg-slate-100/90 hover:bg-slate-200 border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>

          {/* Scrollable Modal Content */}
          <div className="overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-7 space-y-5">
            {/* 1. Badge Showcase with Float Animation */}
            <div className="relative pt-2 flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className={cn(
                  'relative size-24 sm:size-28 rounded-2xl bg-white border-2 p-3 flex items-center justify-center shadow-lg',
                  theme.badgeBorder
                )}
              >
                <img
                  src={badgeIcon}
                  alt={badgeName}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
                <div
                  className={cn(
                    'absolute -bottom-2 px-2.5 py-0.5 rounded-full border text-[9.5px] font-mono font-bold tracking-wider uppercase shadow-xs flex items-center gap-1',
                    isLiveConfirmed
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-600/50'
                      : theme.qualifyBadge
                  )}
                >
                  {isLiveConfirmed ? (
                    <>
                      <CheckCircle2 size={10} className="text-emerald-400" />
                      <span>Live on Profile</span>
                    </>
                  ) : (
                    <>
                      <Clock size={10} className="text-amber-400" />
                      <span>Queued Indexing (24–72h)</span>
                    </>
                  )}
                </div>
              </motion.div>
            </div>

            {/* 2. Headline & Attribution */}
            <div className="space-y-1.5">
              <div
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[11px] font-semibold',
                  isLiveConfirmed ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : theme.pillBg
                )}
              >
                {isLiveConfirmed ? <CheckCircle2 size={12} /> : <Sparkles size={12} />}
                <span>{isLiveConfirmed ? 'Verified on GitHub Profile' : 'Achievement Action Complete'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {isLiveConfirmed ? `You Have ${badgeName}!` : `${badgeName} Merged & Queued!`}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                {isLiveConfirmed ? (
                  <>
                    Confirmed live on your official GitHub profile achievements tab.
                  </>
                ) : (
                  <>
                    GitHub webhook officially delivered on{' '}
                    <strong className="text-slate-900 font-semibold">{repoFullName}</strong>.
                  </>
                )}
              </p>
            </div>

            {/* 3. Proof Breakdown Stat Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
              <div className="min-w-0">
                <span className="text-[9.5px] font-mono text-slate-500 uppercase block truncate">
                  {stat1Label || (isGalaxyBrain ? 'Solutions' : itemType === 'pr' ? 'Pipeline' : 'Triage Speed')}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1 mt-0.5 truncate">
                  {isGalaxyBrain ? (
                    <MessageSquare size={12} className="text-violet-600 shrink-0" />
                  ) : itemType === 'pr' ? (
                    <GitPullRequest size={12} className="text-emerald-600 shrink-0" />
                  ) : (
                    <Clock size={12} className="text-amber-600 shrink-0" />
                  )}
                  <span className="truncate">{stat1Value || (itemType === 'pr' ? 'Auto-Merged' : `${durationSeconds}s`)}</span>
                </span>
                <span className="text-[9px] text-emerald-700 font-semibold block truncate">
                  {stat1Sub || (isGalaxyBrain ? 'Accepted Answers' : itemType === 'pr' ? 'Default branch' : '< 300s window')}
                </span>
              </div>

              <div className="min-w-0">
                <span className="text-[9.5px] font-mono text-slate-500 uppercase block truncate">
                  {stat2Label || (isGalaxyBrain ? 'Category' : itemType === 'pr' ? 'Pull Request' : 'Target Issue')}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 block truncate">
                  {stat2Value || `#${issueNumber}`}
                </span>
                <span className="text-[9px] text-emerald-700 font-semibold block truncate">
                  {stat2Sub || (isGalaxyBrain ? 'GraphQL Verified' : itemType === 'pr' ? 'Merged into main' : 'Closed state')}
                </span>
              </div>

              <div className="min-w-0">
                <span className="text-[9.5px] font-mono text-slate-500 uppercase block truncate">Attribution</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate mt-0.5 block">
                  @{username}
                </span>
                <span className="text-[9px] text-emerald-700 font-semibold block truncate">100% Verified</span>
              </div>
            </div>

            {/* 4. Context-Specific Reassurance Box */}
            {isLiveConfirmed ? (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 flex items-start gap-3 text-left">
                <div className="size-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <CheckCircle2 size={18} />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      Live on Your GitHub Profile!
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[9.5px] font-mono font-bold">
                      VERIFIED GROUND TRUTH
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11.5px] leading-relaxed">
                    Yeh badge aapke official GitHub profile ke achievements tab par actively display ho chuka hai! Aapka milestone 100% complete aur verified hai.
                  </p>
                  <div className="pt-1 text-[11px] text-slate-500">
                    View on GitHub:{' '}
                    <a
                      href={`https://github.com/${username}?tab=achievements`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold text-emerald-800 hover:text-emerald-950"
                    >
                      github.com/{username}?tab=achievements
                    </a>
                  </div>
                </div>
              </div>
            ) : isGalaxyBrain ? (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-violet-50/80 border border-violet-200/80 flex items-start gap-3 text-left">
                <div className="size-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <CheckCircle2 size={18} />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      All Done! 2/2 Answers Accepted
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-violet-200 text-violet-900 text-[9.5px] font-mono font-bold">
                      GRAPHQL SEALED
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11.5px] leading-relaxed">
                    Dono technical answers GitHub Discussions me officially <strong>Accepted Answers</strong> mark ho chuke hain! GitHub ka background attribution worker verify karke <strong>24 se 72 hours ke andar</strong> Galaxy Brain badge aapke profile par display kar dega.
                  </p>
                  <div className="pt-1 text-[11px] text-slate-500">
                    Profile status:{' '}
                    <a
                      href={`https://github.com/${username}?tab=achievements`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold text-slate-900 hover:text-violet-700"
                    >
                      github.com/{username}?tab=achievements
                    </a>
                  </div>
                </div>
              </div>
            ) : isPairExtraordinaire ? (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3 text-left">
                <div className="size-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <CheckCircle2 size={18} />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      All Done! Collaborative PR Merged
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[9.5px] font-mono font-bold">
                      STANDARD MERGE
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11.5px] leading-relaxed">
                    Co-authored PR default branch me successfully merge ho gaya hai aur dono accounts GitHub commit tree me cryptographically seal ho chuke hain! GitHub background worker verify karke <strong>24 se 72 hours ke andar</strong> badge display karega.
                  </p>
                  <div className="pt-1 text-[11px] text-slate-500">
                    Profile status:{' '}
                    <a
                      href={`https://github.com/${username}?tab=achievements`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold text-slate-900 hover:text-emerald-700"
                    >
                      github.com/{username}?tab=achievements
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-left text-xs text-slate-800">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed text-[11.5px]">
                  <strong>GitHub Ingestion Window:</strong> Webhook received and verified. Your badge will appear in your Achievements panel at{' '}
                  <a
                    href={`https://github.com/${username}?tab=achievements`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold hover:text-emerald-700"
                  >
                    github.com/{username}
                  </a>{' '}
                  in periodic batch cron (24h–72h SLA)!
                </div>
              </div>
            )}

            {/* 4.5 Live Check Status Action Bar */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <span className="text-[11px] text-slate-600 flex items-center gap-1.5 truncate pr-2">
                <Clock size={12} className="text-slate-400 shrink-0" />
                <span className="truncate">{liveCheckFeedback || 'GitHub Attribution SLA: 24h–72h batch cron'}</span>
              </span>
              <button
                type="button"
                onClick={handleCheckLive}
                disabled={isCheckingLive}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs shrink-0 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw size={11} className={cn(isCheckingLive && 'animate-spin text-emerald-600')} />
                <span>{isCheckingLive ? 'Checking...' : 'Check GitHub Live'}</span>
              </button>
            </div>

            {/* 5. Responsive CTA Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleShareOnX}
                className="w-full sm:flex-1 h-10 sm:h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <Share2 size={13} />
                <span>Share on X / Twitter</span>
              </button>

              {issueUrl && (
                <a
                  href={issueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto h-10 sm:h-11 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>{itemType === 'discussion' ? 'View Discussion' : itemType === 'pr' ? `PR #${issueNumber}` : `Issue #${issueNumber}`}</span>
                  <ExternalLink size={12} />
                </a>
              )}

              {onContinueToNext && (
                <button
                  type="button"
                  onClick={onContinueToNext}
                  className="w-full sm:w-auto h-10 sm:h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <span>Next Badge</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
