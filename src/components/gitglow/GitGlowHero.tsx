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
    webp: '/images/badges/pull-shark.webp',
    png: '/images/badges/pull-shark.png',
    alt: 'GitHub Pull Shark Achievement Badge',
  },
  {
    id: 'quickdraw',
    name: 'Quickdraw',
    tier: null,
    webp: '/images/badges/quickdraw.webp',
    png: '/images/badges/quickdraw.png',
    alt: 'GitHub Quickdraw Achievement Badge',
  },
  {
    id: 'yolo',
    name: 'YOLO',
    tier: null,
    webp: '/images/badges/yolo.webp',
    png: '/images/badges/yolo.png',
    alt: 'GitHub YOLO Achievement Badge',
  },
  {
    id: 'pair-extraordinaire',
    name: 'Pair',
    tier: null,
    webp: '/images/badges/pair-extraordinaire.webp',
    png: '/images/badges/pair-extraordinaire.png',
    alt: 'GitHub Pair Extraordinaire Achievement Badge',
  },
  {
    id: 'galaxy-brain',
    name: 'Galaxy',
    tier: null,
    webp: '/images/badges/galaxy-brain.webp',
    png: '/images/badges/galaxy-brain.png',
    alt: 'GitHub Galaxy Brain Achievement Badge',
  },
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

  useEffect(() => {
    setUsernameInput(initialUsername);
  }, [initialUsername]);

  // Gently toggle Before/After in pre-scan mode unless hovered or manually clicked
  useEffect(() => {
    if (scannedUser || isScanning || isAutoPaused) return;
    const timer = setInterval(() => {
      setPreviewMode((prev) => (prev === 'after' ? 'before' : 'after'));
    }, 4200);
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
    <section className="relative pt-20 pb-10 sm:pt-24 sm:pb-12 md:pt-24 md:pb-12 overflow-hidden bg-[#0D1117] text-[#E6EDF3]">
      {/* Subtle Ambient Spotlight Behind Right Showcase */}
      <div className="absolute top-1/3 right-1/4 w-[520px] h-[340px] bg-gradient-to-tr from-[#D7FF36]/8 via-[#388BFD]/8 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: High-Desire Copy & Scan Box */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-4.5 text-left">
            {/* Desirable Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-xs font-medium text-[#D7FF36]">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Official GitHub Achievement Accelerator · Free Audit</span>
            </div>

            {/* Punchy Value Proposition (Zero Orphan Words) */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold font-heading tracking-tight text-[#E6EDF3] leading-[1.1]">
              Claim Official GitHub Badges.{' '}
              <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D7FF36] via-[#B8F320] to-[#E6EDF3]">
                Make Your Profile <span className="sm:whitespace-nowrap">Stand Out.</span>
              </span>
            </h1>

            {/* Persuasive Subtitle */}
            <p className="text-sm sm:text-base text-[#8B949E] leading-relaxed max-w-xl">
              Most developers leave their GitHub Achievements tab empty. Check which official medals you’re missing in 3 seconds, earn them naturally in ~2 minutes, and keep them on your profile forever.
            </p>

            {/* Primary Scan Box (Font >= 16px for Mobile Safety) */}
            <div className="pt-1">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-xl">
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
                    className="w-full pl-10 pr-4 py-3 bg-[#161B22] border border-[#30363D] focus:border-[#D7FF36] focus:ring-1 focus:ring-[#D7FF36] text-[#E6EDF3] placeholder-[#8B949E] rounded-[12px] text-base transition-all duration-200 outline-none"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isScanning}
                  className="px-6 py-3 bg-[#D7FF36] hover:bg-[#cbf42e] text-[#0D1117] font-bold rounded-[12px] text-sm transition-all duration-150 flex items-center justify-center gap-2 shrink-0 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-[0_0_24px_rgba(215,255,54,0.28)]"
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
                <p className="mt-2 text-xs text-rose-400 font-medium">{errorMsg}</p>
              )}

              {/* Quick Try Chips */}
              <div className="mt-2.5 flex items-center gap-2 text-xs text-[#8B949E]">
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
            <div className="pt-1 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#8B949E]">
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

          {/* Right Column (Option A): Interactive Before / After GitHub Profile Transformation */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              onMouseEnter={() => setIsAutoPaused(true)}
              onMouseLeave={() => setIsAutoPaused(false)}
              className="relative w-full max-w-md rounded-[16px] bg-[#161B22]/95 border border-[#30363D] shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-md overflow-hidden transition-colors duration-300 hover:border-[#D7FF36]/35"
            >
              {/* Top Bar: GitHub Profile Identity + Segmented Before/After Toggle */}
              <div className="px-4 py-3 bg-[#0D1117]/70 border-b border-[#30363D] flex items-center justify-between gap-2">
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
                    <div className="w-6 h-6 rounded-full bg-[#21262D] border border-[#30363D] flex items-center justify-center shrink-0">
                      <Github className="w-3.5 h-3.5 text-[#E6EDF3]" />
                    </div>
                  )}
                  <span className="text-xs font-semibold text-[#E6EDF3] truncate">
                    {scannedUser ? `github.com/${scannedUser.username}` : 'github.com/you'}
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
                    className="inline-flex items-center p-0.5 rounded-[10px] bg-[#0D1117] border border-[#30363D] text-[11px] shrink-0"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={previewMode === 'before'}
                      onClick={() => handleToggleMode('before')}
                      className={`px-2.5 py-1 rounded-[8px] font-semibold transition-all cursor-pointer ${
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
                      className={`px-2.5 py-1 rounded-[8px] font-semibold transition-all cursor-pointer ${
                        previewMode === 'after'
                          ? 'bg-[#D7FF36] text-[#0D1117] shadow-xs'
                          : 'text-[#8B949E] hover:text-[#E6EDF3]'
                      }`}
                    >
                      After GitGlow
                    </button>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 space-y-3.5">
                {/* Profile Strip */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-medium text-[#8B949E]">
                      {scannedUser
                        ? 'Profile Credibility Score'
                        : previewMode === 'after'
                          ? 'Profile Impact'
                          : 'Current First Impression'}
                    </div>
                    <div className="text-sm font-bold text-[#E6EDF3] font-heading mt-0.5">
                      {scannedUser
                        ? `${scannedUser.earnedBadgeIds.length} of 5 Official Badges Earned`
                        : previewMode === 'after'
                          ? 'Standout Developer Shelf'
                          : 'Empty Achievements Section'}
                    </div>
                  </div>
                  {scannedUser ? (
                    <div className="text-right">
                      <span className="text-xl font-bold font-heading text-[#D7FF36] tabular-nums">
                        {scannedUser.score}
                      </span>
                      <span className="text-xs text-[#8B949E]"> / 100</span>
                    </div>
                  ) : (
                    <span
                      className={`px-2.5 py-1 rounded-[8px] text-[10px] font-bold uppercase tracking-wider border ${
                        previewMode === 'after'
                          ? 'bg-[#D7FF36]/10 border-[#D7FF36]/30 text-[#D7FF36]'
                          : 'bg-[#0D1117] border-[#30363D] text-[#8B949E]'
                      }`}
                    >
                      {previewMode === 'after' ? '5 / 5 Unlocked' : '0 Medals'}
                    </span>
                  )}
                </div>

                {/* Authentic GitHub-Style Achievements Container */}
                <div className="p-3.5 sm:p-4 rounded-[12px] bg-[#0D1117] border border-[#30363D]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#E6EDF3] flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#D7FF36]" />
                      <span>Achievements</span>
                    </span>
                    <span className="text-[10px] text-[#8B949E]">
                      {scannedUser
                        ? 'Verified via GitHub API'
                        : previewMode === 'after'
                          ? 'Earned natively in ~2 min'
                          : 'Default GitHub view'}
                    </span>
                  </div>

                  {scannedUser ? (
                    /* Live Audited 5-Medal Row */
                    <div className="grid grid-cols-5 gap-2 py-1">
                      {HERO_BADGES.map((badge) => {
                        const isEarned = scannedUser.earnedBadgeIds.includes(badge.id);
                        const isPending = scannedUser.processingBadgeIds.includes(badge.id);

                        return (
                          <div key={badge.id} className="flex flex-col items-center text-center group/badge">
                            <div
                              className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
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
                                  className="w-11 h-11 object-contain"
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
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Interactive Before / After Transformation */
                    <AnimatePresence mode="wait">
                      {previewMode === 'after' ? (
                        <motion.div
                          key="after"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.22 }}
                        >
                          <div className="grid grid-cols-5 gap-2 py-1">
                            {HERO_BADGES.map((badge) => (
                              <div key={badge.id} className="flex flex-col items-center text-center">
                                <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-[#161B22] ring-1 ring-[#D7FF36]/35 shadow-[0_0_18px_rgba(215,255,54,0.14)]">
                                  <picture>
                                    <source type="image/webp" srcSet={badge.webp} />
                                    <img
                                      src={badge.png}
                                      alt={badge.alt}
                                      width={44}
                                      height={44}
                                      loading="eager"
                                      decoding="async"
                                      className="w-11 h-11 object-contain"
                                    />
                                  </picture>
                                  {badge.tier && (
                                    <span className="absolute -bottom-0.5 -right-1 px-1 py-px rounded-full bg-[#D7FF36] text-[#0D1117] text-[9px] font-extrabold leading-none shadow-sm">
                                      {badge.tier}
                                    </span>
                                  )}
                                </div>
                                <span className="mt-1.5 text-[10px] font-semibold text-[#E6EDF3] leading-tight">
                                  {badge.name}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-[#21262D] flex items-center justify-between text-[11px] text-emerald-400">
                            <span className="flex items-center gap-1.5 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Awarded natively on github.com</span>
                            </span>
                            <span className="text-[#8B949E] text-[10px]">Permanent</span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="before"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.22 }}
                        >
                          <div className="grid grid-cols-5 gap-2 py-1">
                            {HERO_BADGES.map((badge) => (
                              <div key={badge.id} className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full border border-dashed border-[#30363D] bg-[#161B22]/50 flex items-center justify-center">
                                  <Lock className="w-4 h-4 text-[#484F58]" />
                                </div>
                                <span className="mt-1.5 text-[10px] font-medium text-[#484F58] leading-tight">
                                  {badge.name}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-[#21262D] flex items-center justify-between text-[11px] text-[#8B949E]">
                            <span>No achievements displayed to visitors</span>
                            <button
                              type="button"
                              onClick={() => handleToggleMode('after')}
                              className="text-[#D7FF36] font-semibold hover:underline cursor-pointer"
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

              {/* Bottom Footer Strip */}
              <div className="px-4 sm:px-5 py-2.5 bg-[#0D1117]/50 border-t border-[#30363D] flex items-center justify-between text-[11px] text-[#8B949E]">
                <span>5 Official GitHub Badges Ready</span>
                <span className="text-[#E6EDF3] font-semibold">
                  {scannedUser
                    ? `${Math.max(0, 5 - scannedUser.earnedBadgeIds.length)} claimable below`
                    : 'Free 3-sec check'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
