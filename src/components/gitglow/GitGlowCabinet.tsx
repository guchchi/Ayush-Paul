import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Lock, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { GITHUB_BADGES, GitHubBadge } from '../../data/gitglow/github-badges';

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
  scannedUser: {
    username: string;
    avatarUrl?: string;
    score: number;
    earnedBadgeIds: string[];
    processingBadgeIds: string[];
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
    difficulty: 'Easy', 
    description: 'Merged 2+ pull requests into public repos.' 
  },
  { 
    id: 'quickdraw', 
    name: 'Quickdraw', 
    image: '/images/badges/quickdraw.png',
    webpImage: '/images/badges/quickdraw.webp',
    alt: 'GitHub Quickdraw Achievement Badge - Closed in under 5 minutes Trophy',
    time: '~2 min', 
    difficulty: 'Very Easy', 
    description: 'Closed an issue or pull request within 5 minutes.' 
  },
  { 
    id: 'yolo', 
    name: 'YOLO', 
    image: '/images/badges/yolo.png',
    webpImage: '/images/badges/yolo.webp',
    alt: 'GitHub YOLO Achievement Badge - Merge Without Code Review Trophy',
    time: '~2 min', 
    difficulty: 'Easy', 
    description: 'Merged a pull request directly without code review.' 
  },
  { 
    id: 'pair-extraordinaire', 
    name: 'Pair Extraordinaire', 
    image: '/images/badges/pair-extraordinaire.png',
    webpImage: '/images/badges/pair-extraordinaire.webp',
    alt: 'GitHub Pair Extraordinaire Achievement Badge - Co-authored Commit Trophy',
    time: '~5 min', 
    difficulty: 'Medium', 
    description: 'Co-authored a commit in a merged pull request.' 
  },
  { 
    id: 'galaxy-brain', 
    name: 'Galaxy Brain', 
    image: '/images/badges/galaxy-brain.png',
    webpImage: '/images/badges/galaxy-brain.webp',
    alt: 'GitHub Galaxy Brain Achievement Badge - Accepted Discussion Answer Trophy',
    time: '~5 min', 
    difficulty: 'Medium', 
    description: 'Accepted answer on a repository discussion.' 
  },
];

export const GitGlowCabinet: React.FC<GitGlowCabinetProps> = ({
  scannedUser,
  onSelectBadge,
  onClaimRecommended,
}) => {
  const [showFormula, setShowFormula] = useState(false);

  // Determine current states
  const isPreScan = !scannedUser;
  const username = scannedUser ? scannedUser.username : 'example-dev';
  const score = scannedUser ? scannedUser.score : 40;
  const earnedIds = scannedUser ? scannedUser.earnedBadgeIds : ['quickdraw'];
  const processingIds = scannedUser ? scannedUser.processingBadgeIds : [];

  const earnedCount = earnedIds.filter(id => AUTOMATED_BADGES.some(b => b.id === id)).length;
  const firstAvailableBadge = AUTOMATED_BADGES.find(b => !earnedIds.includes(b.id) && !processingIds.includes(b.id));

  return (
    <section id="cabinet" className="py-16 md:py-24 bg-[#0D1117] text-[#E6EDF3] border-t border-[#30363D]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D7FF36] uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4" />
              <span>Achievement Trophies</span>
              {isPreScan && (
                <span className="px-2 py-0.5 rounded-full bg-[#161B22] border border-[#30363D] text-[10px] text-[#8B949E]">
                  Sample Preview
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-[#E6EDF3] tracking-tight">
              {isPreScan ? 'Trophy Cabinet (5 Verified Slots)' : `@${username}'s Achievement Cabinet`}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#8B949E] max-w-xl">
              Official GitHub achievements verified through transparent git events. Click any trophy to inspect requirements or run the 1-click sandbox claim.
            </p>
          </div>

          {/* Score & Calculation Dropdown Pill */}
          <div className="flex flex-col sm:items-end gap-2">
            <div className="p-4 rounded-2xl bg-[#161B22] border border-[#30363D] flex items-center gap-4">
              {scannedUser?.avatarUrl ? (
                <img src={scannedUser.avatarUrl} alt={username} className="w-10 h-10 rounded-full border border-[#30363D]" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#21262D] border border-[#30363D] flex items-center justify-center text-lg">
                  🏆
                </div>
              )}
              <div>
                <div className="text-[11px] text-[#8B949E] font-medium uppercase tracking-wider">
                  GitGlow Profile Score
                </div>
                <div className="text-2xl font-bold font-heading text-[#D7FF36] tabular-nums leading-none">
                  {score} <span className="text-xs text-[#8B949E] font-normal">/ 100</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFormula(!showFormula)}
                className="ml-2 p-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] transition-colors cursor-pointer text-xs flex items-center gap-1"
                title="How is score calculated?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Formula</span>
                {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Transparent Formula Breakdown Accordion (Math totals 100 exactly) */}
        <AnimatePresence>
          {showFormula && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-5 rounded-2xl bg-[#161B22] border border-[#30363D] text-xs text-[#8B949E] space-y-3">
                <div className="font-bold text-[#E6EDF3] text-sm font-heading flex items-center justify-between">
                  <span>GitGlow Score Calculation (Exact 100-Point Formula)</span>
                  <span className="text-[#D7FF36]">Total = 100 pts</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D]">
                    <div className="font-bold text-[#E6EDF3]">5 Active Badges (50 pts)</div>
                    <div className="text-[11px] mt-1">10 pts for each automated official badge unlocked.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D]">
                    <div className="font-bold text-[#E6EDF3]">Merged PR Activity (20 pts)</div>
                    <div className="text-[11px] mt-1">Pull requests merged cleanly into default branches.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D]">
                    <div className="font-bold text-[#E6EDF3]">Fast Issue Resolution (15 pts)</div>
                    <div className="text-[11px] mt-1">Issues triaged and closed in under 300 seconds.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D]">
                    <div className="font-bold text-[#E6EDF3]">Discussions & Q&A (15 pts)</div>
                    <div className="text-[11px] mt-1">Accepted answers and collaborative community posts.</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Pinned Progress Bar */}
        <div className="md:hidden mb-4 p-3 rounded-xl bg-[#161B22] border border-[#30363D] flex items-center justify-between text-xs">
          <span className="text-[#8B949E]">Trophy Progress:</span>
          <span className="font-bold text-[#D7FF36] font-heading">{earnedCount} of 5 Earned</span>
        </div>

        {/* Recommended Action Banner (If unearned badges exist) */}
        {firstAvailableBadge && (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#D7FF36]/10 via-[#161B22] to-[#161B22] border border-[#D7FF36]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <picture className="w-10 h-10 shrink-0 flex items-center justify-center">
                <source type="image/webp" srcSet={firstAvailableBadge.webpImage} />
                <img
                  src={firstAvailableBadge.image}
                  alt={firstAvailableBadge.alt}
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                />
              </picture>
              <div>
                <div className="text-xs font-bold text-[#D7FF36] uppercase tracking-wider">Recommended Next Step</div>
                <div className="text-sm font-bold text-[#E6EDF3]">
                  Unlock {firstAvailableBadge.name} ({firstAvailableBadge.time})
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectBadge(firstAvailableBadge.id)}
              className="px-4 py-2 rounded-xl bg-[#D7FF36] hover:bg-[#cbf42e] text-[#0D1117] font-bold text-xs transition-all duration-150 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
            >
              <span>Claim in 1-Click</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ─── DESKTOP: Glass Shelf Grid ─── */}
        <div className="hidden md:grid grid-cols-5 gap-4">
          {AUTOMATED_BADGES.map((badge) => {
            const isEarned = earnedIds.includes(badge.id);
            const isProcessing = processingIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                onClick={() => onSelectBadge(badge.id)}
                className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between min-h-[260px] ${
                  isEarned
                    ? 'bg-[#161B22]/90 border-[#F1E05A]/40 shadow-[0_0_25px_rgba(241,224,90,0.12)] hover:border-[#F1E05A]'
                    : isProcessing
                    ? 'bg-[#161B22]/90 border-[#388BFD]/50 shadow-[0_0_20px_rgba(56,139,253,0.15)] hover:border-[#388BFD]'
                    : 'bg-[#161B22]/60 border-[#30363D] hover:border-[#D7FF36]/50 hover:bg-[#161B22]'
                }`}
              >
                {/* Top Badge Time & Difficulty */}
                <div className="w-full flex items-center justify-between text-[11px] text-[#8B949E]">
                  <span className="px-2 py-0.5 rounded-full bg-[#0D1117] border border-[#30363D]">{badge.difficulty}</span>
                  <span className="flex items-center gap-1 font-code">
                    <Clock className="w-3 h-3" />
                    <span>{badge.time}</span>
                  </span>
                </div>

                {/* Central Trophy Art / Icon */}
                <div className="relative my-4">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center p-2 transition-all duration-300 group-hover:scale-105 relative ${
                      isEarned
                        ? 'bg-gradient-to-tr from-[#F1E05A]/15 via-[#161B22] to-transparent border border-[#F1E05A]/40 shadow-[0_4px_20px_rgba(241,224,90,0.15)]'
                        : isProcessing
                        ? 'bg-gradient-to-tr from-[#388BFD]/15 via-[#161B22] to-transparent border border-[#388BFD]/40 shadow-[0_4px_16px_rgba(56,139,253,0.15)] animate-pulse'
                        : 'bg-[#0D1117]/80 border border-[#30363D] opacity-70 group-hover:opacity-100'
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
                            : 'grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-95'
                        }`}
                      />
                    </picture>

                    {/* Status overlay icon */}
                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0D1117]/60 rounded-2xl backdrop-blur-xs">
                        <Clock className="w-6 h-6 text-[#388BFD] animate-spin" />
                      </div>
                    )}
                    {!isEarned && !isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/25 group-hover:bg-transparent transition-colors">
                        <div className="w-7 h-7 rounded-full bg-[#161B22]/90 border border-[#30363D] flex items-center justify-center text-[#8B949E] group-hover:text-[#D7FF36] group-hover:border-[#D7FF36]/50 shadow-md transition-colors">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Badge Name & Subtitle */}
                <div className="w-full">
                  <h3 className="font-bold text-sm text-[#E6EDF3] font-heading group-hover:text-[#D7FF36] transition-colors">
                    {badge.name}
                  </h3>

                  {/* Dual State Label */}
                  <div className="mt-2">
                    {isEarned ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1E05A]/10 border border-[#F1E05A]/30 text-[10px] font-bold text-[#F1E05A]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>On profile ✓</span>
                      </span>
                    ) : isProcessing ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#388BFD]/10 border border-[#388BFD]/30 text-[10px] font-bold text-[#388BFD] animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#388BFD]" />
                        <span>Waiting (hours)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0D1117] border border-[#30363D] text-[10px] font-medium text-[#8B949E] group-hover:border-[#D7FF36]/40 group-hover:text-[#D7FF36]">
                        <ArrowRight className="w-3 h-3" />
                        <span>Claim in ~2m</span>
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
          {AUTOMATED_BADGES.map((badge) => {
            const isEarned = earnedIds.includes(badge.id);
            const isProcessing = processingIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                onClick={() => onSelectBadge(badge.id)}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-150 active:scale-[0.99] cursor-pointer min-h-[56px] ${
                  isEarned
                    ? 'bg-[#161B22] border-[#F1E05A]/40'
                    : isProcessing
                    ? 'bg-[#161B22] border-[#388BFD]/40'
                    : 'bg-[#161B22]/60 border-[#30363D]'
                }`}
              >
                {/* Left: Real Badge Artwork */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center p-1.5 shrink-0 relative ${
                      isEarned
                        ? 'bg-gradient-to-tr from-[#F1E05A]/20 via-[#161B22] to-transparent border border-[#F1E05A]/40'
                        : isProcessing
                        ? 'bg-gradient-to-tr from-[#388BFD]/20 via-[#161B22] to-transparent border border-[#388BFD]/40 animate-pulse'
                        : 'bg-[#0D1117] border border-[#30363D] opacity-75'
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
                            : 'grayscale brightness-75'
                        }`}
                      />
                    </picture>
                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0D1117]/60 rounded-xl">
                        <Clock className="w-4 h-4 text-[#388BFD] animate-spin" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#E6EDF3] font-heading">{badge.name}</div>
                    <div className="text-[11px] text-[#8B949E] flex items-center gap-2 mt-0.5">
                      <span>{badge.difficulty}</span>
                      <span>•</span>
                      <span>{badge.time}</span>
                    </div>
                  </div>
                </div>

                {/* Right: State Label Pill */}
                <div className="shrink-0">
                  {isEarned ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#F1E05A]/10 border border-[#F1E05A]/30 text-[11px] font-bold text-[#F1E05A]">
                      Earned ✓
                    </span>
                  ) : isProcessing ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#388BFD]/10 border border-[#388BFD]/30 text-[11px] font-bold text-[#388BFD]">
                      Pending ⏱
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-[#D7FF36] text-[#0D1117] font-bold text-[11px] flex items-center gap-1">
                      <span>Claim</span>
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
