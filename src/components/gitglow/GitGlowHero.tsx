import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Award,
  Github,
} from 'lucide-react';

interface GitGlowHeroProps {
  onScan: (username: string) => void;
  isScanning: boolean;
  initialUsername?: string;
  scannedUser?: {
    username: string;
    avatarUrl?: string;
    score: number;
    earnedBadgeIds: string[];
    processingBadgeIds: string[];
  } | null;
}

const HERO_BADGES = [
  {
    id: 'pull-shark',
    name: 'Pull Shark',
    tier: '×2',
    criteria: '2 merged PRs (~3 min)',
    webp: '/images/badges/pull-shark.webp',
    png: '/images/badges/pull-shark.png',
    alt: 'GitHub Pull Shark Achievement Badge',
  },
  {
    id: 'quickdraw',
    name: 'Quickdraw',
    tier: null,
    criteria: 'Close issue < 5m (~2 min)',
    webp: '/images/badges/quickdraw.webp',
    png: '/images/badges/quickdraw.png',
    alt: 'GitHub Quickdraw Achievement Badge',
  },
  {
    id: 'yolo',
    name: 'YOLO',
    tier: null,
    criteria: 'Merge own PR (~2 min)',
    webp: '/images/badges/yolo.webp',
    png: '/images/badges/yolo.png',
    alt: 'GitHub YOLO Achievement Badge',
  },
  {
    id: 'pair-extraordinaire',
    name: 'Pair',
    tier: null,
    criteria: 'Co-authored PR (~3 min)',
    webp: '/images/badges/pair-extraordinaire.webp',
    png: '/images/badges/pair-extraordinaire.png',
    alt: 'GitHub Pair Extraordinaire Achievement Badge',
  },
  {
    id: 'galaxy-brain',
    name: 'Galaxy',
    tier: null,
    criteria: 'Accepted discussion answer',
    webp: '/images/badges/galaxy-brain.webp',
    png: '/images/badges/galaxy-brain.png',
    alt: 'GitHub Galaxy Brain Achievement Badge',
  },
];

// Subtle 14-cell mini GitHub contribution heatmap pattern (authentic visual anchor)
const CONTRIB_CELLS = [1, 3, 2, 0, 4, 2, 3, 1, 2, 4, 3, 2, 1, 4] as const;
const CONTRIB_AFTER_COLORS = [
  'bg-[#161B22]',
  'bg-[#0E4429]',
  'bg-[#006D32]',
  'bg-[#26A641]',
  'bg-[#39D353]',
];

export const GitGlowHero: React.FC<GitGlowHeroProps> = ({
  onScan,
  isScanning,
  initialUsername = '',
  scannedUser = null,
}) => {
  const [usernameInput, setUsernameInput] = useState(initialUsername);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewMode, setPreviewMode] = useState<'after' | 'before'>('after');
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const [hoveredBadgeId, setHoveredBadgeId] = useState<string | null>(null);

  useEffect(() => {
    setUsernameInput(initialUsername);
  }, [initialUsername]);

  // Gently toggle Before/After in pre-scan mode unless hovered or manually clicked
  useEffect(() => {
    if (scannedUser || isScanning || isAutoPaused) return;
    const timer = setInterval(() => {
      setPreviewMode((prev) => (prev === 'after' ? 'before' : 'after'));
    }, 4500);
    return () => clearInterval(timer);
  }, [scannedUser, isScanning, isAutoPaused]);

  const handleToggleMode = (mode: 'after' | 'before') => {
    setPreviewMode(mode);
    setIsAutoPaused(true);
  };

  const cleanUsername = (raw: string): string => {
    let cleaned = raw.trim();
    cleaned = cleaned.replace(/^https?:\/\/(www\.)?github\.com\//i, '');
    cleaned = cleaned.replace(/^@/, '');
    cleaned = cleaned.split('/')[0].split('?')[0];
    return cleaned;
  };

  // Live mirrored handle updates on every keystroke (#1 Endowment Effect)
  const liveTypedHandle = cleanUsername(usernameInput);
  const displayHandle = scannedUser ? scannedUser.username : liveTypedHandle || 'you';
  const isLitState = Boolean(scannedUser) || previewMode === 'after';
  const hoveredBadge = HERO_BADGES.find((b) => b.id === hoveredBadgeId) || null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = cleanUsername(usernameInput);
    if (!cleaned) {
      setErrorMsg('Please enter a valid GitHub username.');
      return;
    }
    setErrorMsg('');
    onScan(cleaned);
  };

  const handleQuickTry = (handle: string) => {
    setUsernameInput(handle);
    setErrorMsg('');
    onScan(handle);
  };

  return (
    <section className="relative lg:min-h-[100svh] flex flex-col justify-center pt-[88px] pb-14 sm:pt-28 sm:pb-16 lg:pt-[108px] lg:pb-14 overflow-hidden bg-[#0D1117] text-[#E6EDF3]">
      {/* Ambient Spotlight shifts subtly with Before/After state */}
      <div
        className={`absolute top-1/3 right-1/4 w-[520px] h-[340px] blur-[120px] pointer-events-none rounded-full transition-opacity duration-500 ${
          isLitState
            ? 'bg-gradient-to-tr from-[#D7FF36]/10 via-[#388BFD]/10 to-transparent opacity-100'
            : 'bg-gradient-to-tr from-slate-500/10 to-transparent opacity-40'
        }`}
      />

      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: High-Desire Copy & Scan Box */}
          <div className="lg:col-span-7 max-w-2xl mx-auto lg:mx-0 lg:max-w-none text-left">
            {/* Desirable Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-xs font-medium text-[#D7FF36]">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Official GitHub Achievement Accelerator · Free Audit</span>
            </div>

            {/* Punchy 2-Line Value Proposition */}
            <h1 className="mt-4 sm:mt-5 text-[28px] sm:text-4xl lg:text-[36px] xl:text-[42px] font-bold font-heading tracking-tight text-[#E6EDF3] leading-[1.12]">
              Claim Official GitHub Badges.{' '}
              <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D7FF36] via-[#B8F320] to-[#E6EDF3]">
                Make Your Profile <span className="sm:whitespace-nowrap">Stand Out.</span>
              </span>
            </h1>

            {/* Persuasive Subtitle */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#8B949E] leading-relaxed max-w-xl">
              Most developers leave their GitHub Achievements tab empty. Check which official medals you’re missing in 3 seconds, earn them naturally in ~2 minutes, and keep them on your profile forever.
            </p>

            {/* Primary Scan Box (Font >= 16px for Mobile Safety) */}
            <div className="mt-6 sm:mt-7">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-xl">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B949E]">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="github.com/your-username"
                    className="w-full pl-10 pr-4 py-3.5 bg-[#161B22] border border-[#30363D] focus:border-[#D7FF36] focus:ring-1 focus:ring-[#D7FF36] text-[#E6EDF3] placeholder-[#8B949E] rounded-[12px] text-base transition-all duration-200 outline-none"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isScanning}
                  className="px-6 py-3.5 bg-[#D7FF36] hover:bg-[#cbf42e] text-[#0D1117] font-bold rounded-[12px] text-sm transition-all duration-150 flex items-center justify-center gap-2 shrink-0 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-[0_0_24px_rgba(215,255,54,0.28)]"
                >
                  {isScanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0D1117] border-t-transparent rounded-full animate-spin" />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <span>See My Missing Badges</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Error Message */}
              {errorMsg && (
                <p className="mt-2.5 text-xs text-rose-400 font-medium">{errorMsg}</p>
              )}

              {/* Quick Try Chips */}
              <div className="mt-3.5 flex items-center gap-2 text-xs text-[#8B949E]">
                <span>Quick try:</span>
                <button
                  type="button"
                  onClick={() => handleQuickTry('octocat')}
                  className="px-2.5 py-0.5 rounded-[8px] bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] text-[#E6EDF3] transition-colors cursor-pointer"
                >
                  @octocat
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTry('torvalds')}
                  className="px-2.5 py-0.5 rounded-[8px] bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] text-[#E6EDF3] transition-colors cursor-pointer"
                >
                  @torvalds
                </button>
              </div>
            </div>

            {/* Confident Trust Signals */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs text-[#8B949E]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D7FF36]" />
                <span>100% Official &amp; Permanent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#D7FF36]" />
                <span>Zero Password Needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D7FF36]" />
                <span>Safe Isolated Workflow</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live-Mirrored Before / After GitHub Profile Transformation */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              onMouseEnter={() => setIsAutoPaused(true)}
              onMouseLeave={() => {
                setIsAutoPaused(false);
                setHoveredBadgeId(null);
              }}
              className={`relative w-full max-w-md rounded-[16px] backdrop-blur-md overflow-hidden transition-all duration-500 border ${
                isLitState
                  ? 'bg-[#161B22]/95 border-[#30363D] hover:border-[#D7FF36]/40 shadow-[0_24px_60px_rgba(0,0,0,0.6),0_0_42px_rgba(215,255,54,0.06)]'
                  : 'bg-[#11151C]/95 border-[#21262D] shadow-[0_14px_34px_rgba(0,0,0,0.45)]'
              }`}
            >
              {/* Top Powered-On Specular Hairline (#4 Color Temperature Shift) */}
              <div
                className={`h-[1px] w-full transition-opacity duration-500 bg-gradient-to-r from-transparent via-[#D7FF36]/55 to-transparent ${
                  isLitState ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Top Bar: Live-Mirrored Handle + Segmented Before/After Toggle */}
              <div
                className={`px-4 py-3 border-b flex items-center justify-between gap-2 transition-colors duration-500 ${
                  isLitState
                    ? 'bg-[#0D1117]/75 border-[#30363D]'
                    : 'bg-[#0B0E14]/90 border-[#21262D]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {scannedUser?.avatarUrl ? (
                    <img
                      src={scannedUser.avatarUrl}
                      alt={scannedUser.username}
                      width={26}
                      height={26}
                      className="w-6 h-6 rounded-full border border-[#30363D] object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        liveTypedHandle
                          ? 'bg-[#D7FF36]/15 border-[#D7FF36]/40 text-[#D7FF36]'
                          : 'bg-[#21262D] border-[#30363D] text-[#E6EDF3]'
                      }`}
                    >
                      <Github className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <span className="text-xs font-semibold truncate transition-colors duration-200">
                    <span className="text-[#8B949E]">github.com/</span>
                    <span className={liveTypedHandle && !scannedUser ? 'text-[#D7FF36]' : 'text-[#E6EDF3]'}>
                      {displayHandle}
                    </span>
                  </span>
                </div>

                {scannedUser || isScanning ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D7FF36]/10 border border-[#D7FF36]/30 text-[10px] font-bold text-[#D7FF36] shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF36] animate-pulse" />
                    <span>{isScanning ? 'AUDITING' : 'LIVE AUDIT'}</span>
                  </div>
                ) : (
                  <div
                    role="tablist"
                    aria-label="Compare GitHub profile before and after GitGlow"
                    className="relative inline-flex items-center p-0.5 rounded-[10px] bg-[#0D1117] border border-[#30363D] text-[11px] shrink-0 overflow-hidden"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={previewMode === 'before'}
                      onClick={() => handleToggleMode('before')}
                      className={`relative z-10 px-2.5 py-1 rounded-[8px] font-semibold transition-all cursor-pointer ${
                        previewMode === 'before'
                          ? 'bg-[#21262D] text-[#E6EDF3] shadow-xs'
                          : 'text-[#8B949E] hover:text-[#E6EDF3]'
                      }`}
                    >
                      Before
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={previewMode === 'after'}
                      onClick={() => handleToggleMode('after')}
                      className={`relative z-10 px-2.5 py-1 rounded-[8px] font-semibold transition-all cursor-pointer ${
                        previewMode === 'after'
                          ? 'bg-[#D7FF36] text-[#0D1117] shadow-xs'
                          : 'text-[#8B949E] hover:text-[#E6EDF3]'
                      }`}
                    >
                      After GitGlow
                    </button>

                    {/* Ambient Cycle Indicator (#5 Alive Micro-Signal) */}
                    {!isAutoPaused && (
                      <motion.div
                        key={previewMode}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 4.5, ease: 'linear' }}
                        style={{ transformOrigin: 'left' }}
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#D7FF36]/60 pointer-events-none"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 space-y-3.5">
                {/* #3 Authentic GitHub Profile Context + Tabular 0 → 5 Delta */}
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#E6EDF3] font-heading truncate">
                        @{displayHandle}
                      </span>
                      {/* Subtle GitHub Contribution Activity Strip */}
                      <div className="hidden sm:flex items-center gap-[2px]" aria-hidden="true">
                        {CONTRIB_CELLS.map((level, i) => (
                          <span
                            key={i}
                            className={`w-[5px] h-[5px] rounded-[1px] transition-colors duration-500 ${
                              isLitState ? CONTRIB_AFTER_COLORS[level] : 'bg-[#21262D]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-xs sm:text-[13px] font-bold font-heading mt-1 tabular-nums">
                      {scannedUser ? (
                        <span className="text-[#E6EDF3]">
                          {scannedUser.earnedBadgeIds.length} of 5 Official Badges Earned
                        </span>
                      ) : previewMode === 'after' ? (
                        <span className="text-[#E6EDF3]">
                          <span className="line-through text-[#484F58] mr-1.5 font-medium">0</span>
                          <span className="text-[#D7FF36]">→ 5</span> Official Badges
                        </span>
                      ) : (
                        <span className="text-[#8B949E]">0 Official Badges</span>
                      )}
                    </div>
                  </div>

                  {scannedUser ? (
                    <div className="text-right shrink-0">
                      <span className="text-xl font-bold font-heading text-[#D7FF36] tabular-nums">
                        {scannedUser.score}
                      </span>
                      <span className="text-xs text-[#8B949E]"> / 100</span>
                    </div>
                  ) : (
                    <span
                      className={`px-2.5 py-1 rounded-[8px] text-[10px] font-bold uppercase tracking-wider border shrink-0 transition-colors duration-300 ${
                        previewMode === 'after'
                          ? 'bg-[#D7FF36]/10 border-[#D7FF36]/30 text-[#D7FF36]'
                          : 'bg-[#0B0E14] border-[#21262D] text-[#6E7681]'
                      }`}
                    >
                      {previewMode === 'after' ? '5 / 5 Unlocked' : 'Empty Shelf'}
                    </span>
                  )}
                </div>

                {/* Authentic GitHub-Style Achievements Shelf */}
                <div
                  className={`relative p-3.5 sm:p-4 rounded-[12px] border transition-colors duration-500 overflow-hidden ${
                    isLitState
                      ? 'bg-[#0D1117] border-[#30363D]'
                      : 'bg-[#0B0E14] border-[#21262D]'
                  }`}
                >
                  {/* Soft Radial Aura behind lit medals */}
                  <div
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,rgba(215,255,54,0.08),transparent_72%)] ${
                      isLitState ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  <div className="relative z-10 flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#E6EDF3] flex items-center gap-1.5">
                      <Award
                        className={`w-3.5 h-3.5 transition-colors duration-300 ${
                          isLitState ? 'text-[#D7FF36]' : 'text-[#484F58]'
                        }`}
                      />
                      <span>Achievements</span>
                    </span>
                    <span className="text-[10px] text-[#8B949E]">
                      {scannedUser
                        ? 'Verified via GitHub API'
                        : previewMode === 'after'
                          ? 'Hover any medal to inspect'
                          : 'Default GitHub view'}
                    </span>
                  </div>

                  <div className="relative z-10">
                    {scannedUser ? (
                      /* Live Audited 5-Medal Row */
                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 py-1">
                        {HERO_BADGES.map((badge, idx) => {
                          const isEarned = scannedUser.earnedBadgeIds.includes(badge.id);
                          const isPending = scannedUser.processingBadgeIds.includes(badge.id);

                          return (
                            <motion.div
                              key={badge.id}
                              initial={{ opacity: 0, y: 8, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.25, delay: idx * 0.05 }}
                              className="flex flex-col items-center text-center group/badge"
                            >
                              <div
                                className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                                  isEarned
                                    ? 'ring-2 ring-[#D7FF36]/60 shadow-[0_0_16px_rgba(215,255,54,0.2)]'
                                    : isPending
                                      ? 'ring-2 ring-[#388BFD]/60'
                                      : 'opacity-30 grayscale'
                                }`}
                              >
                                <picture>
                                  <source type="image/webp" srcSet={badge.webp} />
                                  <img
                                    src={badge.png}
                                    alt={badge.alt}
                                    width={44}
                                    height={44}
                                    loading="eager"
                                    decoding="async"
                                    className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
                                  />
                                </picture>
                              </div>
                              <span className="mt-1.5 text-[10px] font-semibold text-[#E6EDF3] leading-tight">
                                {badge.name}
                              </span>
                              <span
                                className={`text-[9px] mt-0.5 font-medium ${
                                  isEarned
                                    ? 'text-[#D7FF36]'
                                    : isPending
                                      ? 'text-[#388BFD]'
                                      : 'text-[#8B949E]'
                                }`}
                              >
                                {isEarned ? 'Earned' : isPending ? 'Pending' : 'Missing'}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Interactive Before / After Transformation with Staggered Reveal (#5) */
                      <AnimatePresence mode="wait">
                        {previewMode === 'after' ? (
                          <motion.div
                            key="after"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 py-1">
                              {HERO_BADGES.map((badge, idx) => {
                                const isHovered = hoveredBadgeId === badge.id;
                                return (
                                  <motion.button
                                    key={badge.id}
                                    type="button"
                                    onMouseEnter={() => setHoveredBadgeId(badge.id)}
                                    onFocus={() => setHoveredBadgeId(badge.id)}
                                    onClick={() => setHoveredBadgeId(isHovered ? null : badge.id)}
                                    initial={{ opacity: 0, y: 10, scale: 0.85 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                      duration: 0.28,
                                      delay: idx * 0.06,
                                      ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="flex flex-col items-center text-center cursor-pointer outline-none group/medal"
                                  >
                                    <div
                                      className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-[#161B22] transition-all duration-200 ${
                                        isHovered
                                          ? '-translate-y-1 scale-110 ring-2 ring-[#D7FF36] shadow-[0_0_22px_rgba(215,255,54,0.35)]'
                                          : 'ring-1 ring-[#D7FF36]/40 shadow-[0_0_16px_rgba(215,255,54,0.14)] group-hover/medal:-translate-y-0.5'
                                      }`}
                                    >
                                      <picture>
                                        <source type="image/webp" srcSet={badge.webp} />
                                        <img
                                          src={badge.png}
                                          alt={badge.alt}
                                          width={44}
                                          height={44}
                                          loading="eager"
                                          decoding="async"
                                          className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
                                        />
                                      </picture>
                                      {badge.tier && (
                                        <span className="absolute -bottom-0.5 -right-1 px-1 py-px rounded-full bg-[#D7FF36] text-[#0D1117] text-[9px] font-extrabold leading-none shadow-sm">
                                          {badge.tier}
                                        </span>
                                      )}
                                    </div>
                                    <span
                                      className={`mt-1.5 text-[10px] font-semibold leading-tight transition-colors ${
                                        isHovered ? 'text-[#D7FF36]' : 'text-[#E6EDF3]'
                                      }`}
                                    >
                                      {badge.name}
                                    </span>
                                  </motion.button>
                                );
                              })}
                            </div>

                            {/* Tactile Inspect Bar (#5 Hover Peek) */}
                            <div className="mt-3 pt-2.5 border-t border-[#21262D] flex items-center justify-between text-[11px] min-h-[28px]">
                              {hoveredBadge ? (
                                <span className="flex items-center gap-1.5 font-medium text-[#D7FF36]">
                                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                  <span>
                                    {hoveredBadge.name}: {hoveredBadge.criteria}
                                  </span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                  <span>Awarded natively on github.com</span>
                                </span>
                              )}
                              <span className="text-[#8B949E] text-[10px] shrink-0">Permanent</span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="before"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 py-1">
                              {HERO_BADGES.map((badge) => (
                                <div key={badge.id} className="flex flex-col items-center text-center">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-dashed border-[#2A3038] bg-[#161B22]/35 flex items-center justify-center">
                                    <Lock className="w-4 h-4 text-[#484F58]" />
                                  </div>
                                  <span className="mt-1.5 text-[10px] font-medium text-[#484F58] leading-tight">
                                    {badge.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-2.5 border-t border-[#1C2128] flex items-center justify-between text-[11px] text-[#6E7681] min-h-[28px]">
                              <span>Overlooked in a 6-sec recruiter scan</span>
                              <button
                                type="button"
                                onClick={() => handleToggleMode('after')}
                                className="text-[#D7FF36] font-semibold hover:underline cursor-pointer shrink-0"
                              >
                                See After →
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </div>

              {/* #3 Authentic Ownership Footer */}
              <div
                className={`px-4 sm:px-5 py-2.5 border-t flex items-center justify-between text-[11px] transition-colors duration-500 ${
                  isLitState
                    ? 'bg-[#0D1117]/55 border-[#30363D] text-[#8B949E]'
                    : 'bg-[#0B0E14]/80 border-[#21262D] text-[#6E7681]'
                }`}
              >
                <span className="truncate pr-2">
                  Visible on <span className="text-[#E6EDF3]/85 font-medium">github.com/{displayHandle}</span>
                </span>
                <span className="text-[#E6EDF3] font-semibold shrink-0">
                  {scannedUser
                    ? `${Math.max(0, 5 - scannedUser.earnedBadgeIds.length)} claimable below`
                    : isLitState
                      ? 'Yours permanently'
                      : '3-sec free check'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
