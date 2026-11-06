import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Github,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  Shield,
  Layers,
  Clock,
  ChevronDown,
  ChevronUp,
  GitPullRequest,
  Trophy,
  Flame,
  Award,
  Zap,
  Terminal,
  ExternalLink,
  Check,
  Code2,
  XCircle,
  HelpCircle,
  Play,
  RefreshCw,
  Search,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DURATION, EASING } from '../../../lib/motion-presets';
import { GITHUB_BADGES, GitHubBadge } from '../../../data/gitglow/github-badges';

// ─── FAQ Accordion Item ──────────────────────────────────────────────────────
const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-neutral-200/90 rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-2xs hover:border-neutral-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-center justify-between text-left text-sm sm:text-base font-bold text-[#0b1c30] hover:text-[#0058be] transition-colors focus:outline-none"
        aria-expanded={open}
      >
        <span className="pr-4">{q}</span>
        <span className="p-1.5 rounded-full bg-neutral-100 text-[#0b1c30] shrink-0">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Badge Custom Theme Pedestal Map ─────────────────────────────────────────
const BADGE_THEMES: Record<
  string,
  {
    pedestalBg: string;
    pedestalBorder: string;
    glow: string;
  }
> = {
  quickdraw: {
    pedestalBg: 'from-amber-100/80 via-yellow-50 to-amber-50/40',
    pedestalBorder: 'border-amber-200/90',
    glow: 'group-hover:shadow-[0_4px_20px_rgba(245,158,11,0.22)]',
  },
  'pull-shark': {
    pedestalBg: 'from-cyan-100/80 via-blue-50 to-cyan-50/40',
    pedestalBorder: 'border-cyan-200/90',
    glow: 'group-hover:shadow-[0_4px_20px_rgba(6,182,212,0.22)]',
  },
  yolo: {
    pedestalBg: 'from-rose-100/80 via-orange-50 to-rose-50/40',
    pedestalBorder: 'border-rose-200/90',
    glow: 'group-hover:shadow-[0_4px_20px_rgba(244,63,94,0.22)]',
  },
  'pair-extraordinaire': {
    pedestalBg: 'from-purple-100/80 via-violet-50 to-purple-50/40',
    pedestalBorder: 'border-purple-200/90',
    glow: 'group-hover:shadow-[0_4px_20px_rgba(168,85,247,0.22)]',
  },
  'galaxy-brain': {
    pedestalBg: 'from-indigo-100/80 via-violet-50 to-indigo-50/40',
    pedestalBorder: 'border-indigo-200/90',
    glow: 'group-hover:shadow-[0_4px_20px_rgba(99,102,241,0.22)]',
  },
  starstruck: {
    pedestalBg: 'from-amber-100/80 via-yellow-50 to-amber-50/40',
    pedestalBorder: 'border-amber-200/90',
    glow: 'group-hover:shadow-[0_4px_20px_rgba(245,158,11,0.22)]',
  },
  'public-sponsor': {
    pedestalBg: 'from-emerald-100/80 via-teal-50 to-emerald-50/40',
    pedestalBorder: 'border-emerald-200/90',
    glow: 'group-hover:shadow-[0_4px_20px_rgba(16,185,129,0.22)]',
  },
  'heart-on-your-sleeve': {
    pedestalBg: 'from-pink-100/80 via-rose-50 to-pink-50/40',
    pedestalBorder: 'border-pink-200/90',
    glow: 'group-hover:shadow-[0_4px_20px_rgba(236,72,153,0.22)]',
  },
  'open-sourcerer': {
    pedestalBg: 'from-teal-100/80 via-cyan-50 to-teal-50/40',
    pedestalBorder: 'border-teal-200/90',
    glow: 'group-hover:shadow-[0_4px_20px_rgba(20,184,166,0.22)]',
  },
  'arctic-code-vault': {
    pedestalBg: 'from-slate-100/90 via-sky-50 to-slate-50/40',
    pedestalBorder: 'border-slate-300/80',
    glow: 'group-hover:shadow-[0_4px_20px_rgba(100,116,139,0.18)]',
  },
};

// ─── Option A: Compact Trophy Card Component ─────────────────────────────────
const BadgeCard: React.FC<{ badge: GitHubBadge }> = ({ badge }) => {
  const theme = BADGE_THEMES[badge.id] || {
    pedestalBg: 'from-slate-100 via-neutral-50 to-slate-50',
    pedestalBorder: 'border-neutral-200',
    glow: 'group-hover:shadow-md',
  };

  // Status Capsule Renderer (One consolidated pill per card)
  const renderStatusCapsule = () => {
    if (badge.isRecommendedStarter) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d1f34d] text-[#0b1c30] text-[10px] font-extrabold uppercase tracking-wide border border-[#0b1c30]/10 shadow-2xs">
          <Flame size={11} fill="#0b1c30" className="text-[#0b1c30]" />
          <span>Starter · 5 Mins</span>
        </span>
      );
    }
    if (badge.status === 'testing') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wide border border-amber-200">
          <Sparkles size={11} className="text-amber-600" />
          <span>In GitHub Beta</span>
        </span>
      );
    }
    if (!badge.isObtainable) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-bold uppercase tracking-wide border border-neutral-200">
          <Lock size={10} />
          <span>Archived (2020)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wide border border-slate-200">
        <span>{badge.difficulty} · Obtainable</span>
      </span>
    );
  };

  return (
    <div
      className={cn(
        'group relative p-5 rounded-2xl border bg-white transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1',
        badge.isRecommendedStarter
          ? 'border-[#0058be]/30 ring-1 ring-[#0058be]/10 shadow-2xs'
          : 'border-neutral-200/90 shadow-2xs hover:border-neutral-300',
      )}
    >
      <div>
        {/* Top Header: Custom Themed Trophy Pedestal + Single Meta Capsule */}
        <div className="flex items-center justify-between gap-3 mb-4">
          {/* Custom Trophy Pedestal */}
          <div
            className={cn(
              'relative w-16 h-16 rounded-2xl p-2 flex items-center justify-center bg-gradient-to-br border transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 shadow-2xs',
              theme.pedestalBg,
              theme.pedestalBorder,
              theme.glow,
            )}
          >
            {/* Specular Glint Reflection */}
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.85),transparent_65%)] pointer-events-none" />
            <img
              src={badge.image}
              alt={badge.name}
              className="relative z-10 w-12 h-12 object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.14)] transition-transform duration-300 group-hover:scale-110 select-none"
              loading="lazy"
            />
          </div>

          {/* Single Consolidated Status Capsule */}
          <div>{renderStatusCapsule()}</div>
        </div>

        {/* Title & Authentic Tagline */}
        <div className="space-y-1 mb-3">
          <div className="text-lg font-bold text-[#0b1c30] tracking-tight group-hover:text-[#0058be] transition-colors leading-snug">
            {badge.name}
          </div>
          <div className="text-xs text-neutral-500 font-medium line-clamp-1 leading-normal">
            {badge.tagline}
          </div>
        </div>

        {/* GitGlow Blueprint Strategy Capsule */}
        <div className="p-3 rounded-xl bg-[#f8f9ff] border border-neutral-200/60 text-xs text-neutral-700 leading-relaxed min-h-[58px] flex items-center mb-3.5">
          <div className="line-clamp-2 text-xs leading-relaxed">
            <span className="font-bold text-[#0b1c30]">Blueprint: </span>
            <span className="text-neutral-600 font-normal">{badge.blueprintStrategy}</span>
          </div>
        </div>

        {/* Tiers Ladder Micro-Strip */}
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 bg-white border border-neutral-200/80 px-2.5 py-1.5 rounded-lg mb-4">
          <span className="font-bold text-neutral-400 text-[10px] uppercase tracking-wider">
            {badge.tiers && badge.tiers.length > 0 ? 'Tiers' : 'Scope'}
          </span>
          <div className="flex items-center gap-1.5 font-medium text-[#0b1c30]">
            {badge.tiers && badge.tiers.length > 0 ? (
              <>
                <span>{badge.tiers[0]?.threshold.split(' ')[0]}</span>
                <span className="text-neutral-300">·</span>
                <span>{badge.tiers[1]?.threshold.split(' ')[0]} 🥉</span>
                <span className="text-neutral-300">·</span>
                <span>{badge.tiers[2]?.threshold.split(' ')[0]} 🥈</span>
                <span className="text-neutral-300">·</span>
                <span>{badge.tiers[3]?.threshold.split(' ')[0]} 🥇</span>
              </>
            ) : (
              <span className="text-neutral-600 font-sans text-xs">Standard Single Unlock</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Row */}
      <div className="pt-2 border-t border-neutral-100">
        {badge.isObtainable ? (
          <Link
            to={`/blueprints/gitglow/engine?badge=${badge.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#0058be] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#0047a0] transition-colors shadow-2xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0058be]"
          >
            <span>Launch Claim Engine</span>
            <ArrowRight size={13} />
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-neutral-100 text-neutral-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed">
            <Lock size={12} />
            <span>{badge.status === 'testing' ? 'In GitHub Beta' : 'Archived Milestone'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Scanned Profile Model ───────────────────────────────────────────────────
interface ScannedProfileData {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  created_at: string;
  isSimulated?: boolean;
}

// ─── Main GitGlow Page ────────────────────────────────────────────────────────
export const GitGlowHomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [githubInput, setGithubInput] = useState<string>('arivera-dev');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedUser, setScannedUser] = useState<ScannedProfileData>({
    login: 'arivera-dev',
    name: 'Alex Rivera',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Frontend & Open Source Developer',
    public_repos: 14,
    followers: 42,
    created_at: '2022-03-15T00:00:00Z',
    isSimulated: true,
  });

  const cleanGitHubInput = (input: string): string => {
    let cleaned = input.trim();
    cleaned = cleaned.replace(/^https?:\/\//i, '');
    cleaned = cleaned.replace(/^www\./i, '');
    cleaned = cleaned.replace(/^github\.com\//i, '');
    cleaned = cleaned.replace(/^@/, '');
    cleaned = cleaned.split('/')[0].split('?')[0].split('#')[0];
    return cleaned.trim();
  };

  const handleScan = async (targetUsername?: string) => {
    const raw = targetUsername || githubInput;
    const username = cleanGitHubInput(raw);
    if (!username) return;

    setIsScanning(true);

    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (res.ok) {
        const data = await res.json();
        setScannedUser({
          login: data.login,
          name: data.name || data.login,
          avatar_url: data.avatar_url,
          bio: data.bio || 'Public GitHub Developer',
          public_repos: data.public_repos || 0,
          followers: data.followers || 0,
          created_at: data.created_at,
          isSimulated: false,
        });
      } else {
        // Fallback for simulated profile
        setScannedUser({
          login: username,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
          bio: 'Public GitHub Developer',
          public_repos: 8,
          followers: 16,
          created_at: '2023-01-01T00:00:00Z',
          isSimulated: true,
        });
      }
    } catch {
      setScannedUser({
        login: username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
        bio: 'Public GitHub Developer',
        public_repos: 8,
        followers: 16,
        created_at: '2023-01-01T00:00:00Z',
        isSimulated: true,
      });
    } finally {
      setTimeout(() => {
        setIsScanning(false);
      }, 400);
    }
  };

  const filteredBadges = useMemo(() => {
    if (selectedCategory === 'all') return GITHUB_BADGES;
    if (selectedCategory === 'obtainable') return GITHUB_BADGES.filter((b) => b.isObtainable);
    if (selectedCategory === 'starter') return GITHUB_BADGES.filter((b) => b.isRecommendedStarter);
    return GITHUB_BADGES.filter((b) => b.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] pt-24 pb-20 overflow-x-hidden selection:bg-[#d1f34d] selection:text-[#0b1c30]">
      
      {/* ─── Upper Navigation / Back link ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-4 pb-6">
        <Link
          to="/blueprints"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-[#0058be] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0058be] rounded-lg p-1.5"
          aria-label="Back to Blueprints collection"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back to Blueprints</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* ─── Hero Section: Instant GitHub URL Scanner & Diagnostic Console ────── */}
        <section id="overview" className="mb-20 md:mb-28 text-left">
          
          <div className="max-w-4xl space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0058be]/8 border border-[#0058be]/15 text-[#0058be] text-[11px] font-bold uppercase tracking-widest">
              <Sparkles size={12} className="text-[#0058be]" />
              <span>Instant GitHub Profile Badge Audit</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0b1c30] leading-[1.08]">
              Paste your GitHub URL. <br />
              <span className="text-[#0058be]">See the badges you're missing in 2 seconds.</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
              Recruiters ignore copy-paste markdown shields. Enter your GitHub profile below to audit your official achievements and get the exact sandbox blueprint to claim your first three badges today.
            </p>

            {/* The Command Console Input Bar */}
            <div className="pt-2 max-w-2xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleScan();
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-2xl bg-white border-2 border-neutral-200/90 shadow-md focus-within:border-[#0058be] focus-within:ring-4 focus-within:ring-[#0058be]/10 transition-all"
              >
                <div className="flex items-center gap-2.5 px-3 py-1.5 flex-1 min-w-0">
                  <Github size={20} className="text-[#0b1c30] shrink-0" />
                  <span className="font-mono text-xs sm:text-sm text-neutral-400 select-none">
                    github.com/
                  </span>
                  <input
                    type="text"
                    value={githubInput}
                    onChange={(e) => setGithubInput(e.target.value)}
                    placeholder="username or paste profile link"
                    className="w-full bg-transparent font-mono text-xs sm:text-sm text-[#0b1c30] placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isScanning}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0058be] hover:bg-[#0047a0] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-[0.99] disabled:opacity-70 shrink-0"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={14} className="text-[#d1f34d]" />
                      <span>Audit Badges</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-400 text-[11px] uppercase tracking-wider">Try an example:</span>
                {[
                  { label: 'shadcn', handle: 'shadcn' },
                  { label: 'torvalds', handle: 'torvalds' },
                  { label: 'gaearon', handle: 'gaearon' },
                  { label: 'alexrivera', handle: 'arivera-dev' },
                ].map((demo) => (
                  <button
                    key={demo.handle}
                    type="button"
                    onClick={() => {
                      setGithubInput(demo.handle);
                      handleScan(demo.handle);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-neutral-100 text-neutral-700 font-mono text-xs transition-colors border border-neutral-200 shadow-2xs hover:border-[#0058be]/30"
                  >
                    @{demo.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Real-Time Scanned Diagnostic Card (Tactile Dark Console) ─────── */}
          <div className="mt-8 rounded-3xl bg-[#0d1117] text-white border border-neutral-800 shadow-2xl p-6 sm:p-8 max-w-5xl">
            {/* Header: User Profile Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={scannedUser.avatar_url}
                    alt={scannedUser.login}
                    className="w-16 h-16 rounded-full border-2 border-neutral-700 object-cover shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0d1117] flex items-center justify-center" title="Public Profile Active">
                    <Check size={10} className="text-white font-bold" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {scannedUser.name}
                    </h3>
                    <a
                      href={`https://github.com/${scannedUser.login}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-neutral-400 hover:text-white inline-flex items-center gap-1 transition-colors"
                    >
                      <span>@{scannedUser.login}</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1 max-w-md">
                    {scannedUser.bio}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-neutral-400">
                    <span>{scannedUser.public_repos} Public Repos</span>
                    <span>·</span>
                    <span>{scannedUser.followers} Followers</span>
                    {scannedUser.isSimulated && (
                      <span className="text-[10px] text-amber-400 font-sans font-semibold">
                        (Demo Preview)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Overall Achievement Audit Status */}
              <div className="bg-[#161b22] px-4 py-3 rounded-2xl border border-neutral-800 flex items-center justify-between md:flex-col md:items-end gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Starter Badges Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs">
                  <span>0 / 4 Unlocked</span>
                  <span className="text-neutral-500">· Ready to Claim</span>
                </span>
              </div>
            </div>

            {/* Middle: 4 Starter Badges Diagnostics Grid */}
            <div className="py-6 border-b border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Starter Achievements Breakdown
                </span>
                <span className="text-xs text-neutral-500">
                  Available to unlock on your account:
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    id: 'quickdraw',
                    name: 'Quickdraw ⚡',
                    image: '/images/badges/quickdraw.png',
                    requirement: 'Close issue/PR within 5 mins',
                    time: '2 Mins',
                    difficulty: 'Very Easy',
                    theme: 'border-amber-500/30 bg-amber-500/5',
                    btnBg: 'bg-amber-400 hover:bg-amber-300 text-[#0b1c30]',
                  },
                  {
                    id: 'pull-shark',
                    name: 'Pull Shark 🦈',
                    image: '/images/badges/pull-shark.png',
                    requirement: 'Merge 2 PRs into repo',
                    time: '5 Mins',
                    difficulty: 'Easy',
                    theme: 'border-cyan-500/30 bg-cyan-500/5',
                    btnBg: 'bg-cyan-400 hover:bg-cyan-300 text-[#0b1c30]',
                  },
                  {
                    id: 'yolo',
                    name: 'YOLO 🪂',
                    image: '/images/badges/yolo.png',
                    requirement: 'Merge PR without review',
                    time: '5 Mins',
                    difficulty: 'Easy',
                    theme: 'border-rose-500/30 bg-rose-500/5',
                    btnBg: 'bg-rose-400 hover:bg-rose-300 text-[#0b1c30]',
                  },
                  {
                    id: 'pair-extraordinaire',
                    name: 'Pair Extraordinaire 👯',
                    image: '/images/badges/pair-extraordinaire.png',
                    requirement: 'Co-authored commit merged',
                    time: '10 Mins',
                    difficulty: 'Medium',
                    theme: 'border-purple-500/30 bg-purple-500/5',
                    btnBg: 'bg-purple-400 hover:bg-purple-300 text-white',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'p-4 rounded-2xl border flex flex-col justify-between transition-all hover:border-neutral-600',
                      item.theme,
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-contain drop-shadow-md"
                        />
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#161b22] text-neutral-300 border border-neutral-700">
                          {item.time}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2 mb-3">
                        {item.requirement}
                      </p>
                    </div>

                    <Link
                      to={`/blueprints/gitglow/engine?badge=${item.id}&user=${scannedUser.login}`}
                      className={cn(
                        'w-full py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.99]',
                        item.btnBg,
                      )}
                    >
                      <span>Claim Blueprint</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Recommendation Strip */}
            <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#d1f34d]/20 text-[#d1f34d] flex items-center justify-center shrink-0">
                  <Zap size={16} />
                </span>
                <div>
                  <p className="text-xs font-bold text-white">
                    Fastest Path for @{scannedUser.login}: Claim Quickdraw in 120 Seconds
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Open a tracking issue and close it in under 5 minutes on your personal repository.
                  </p>
                </div>
              </div>

              <Link
                to={`/blueprints/gitglow/engine?badge=quickdraw&user=${scannedUser.login}`}
                className="px-6 py-3 rounded-xl bg-[#d1f34d] hover:bg-[#c2e240] text-[#0b1c30] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.99] shrink-0 text-center"
              >
                Launch 2-Min Quickdraw Claim →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Section 2: Why Most GitHub Advice Is Broken ────────────────── */}
        <section className="mb-20 md:mb-28 text-left">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-[10px] font-bold uppercase tracking-widest mb-2 border border-rose-200">
              The Reality Check
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
              Why 90% of Student GitHub Advice Is a Waste of Time
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-1">
              Every college senior tells you to make your README colorful. Here is what actually happens when engineering leads look at your profile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                ✕
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                The Shields.io Myth
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Putting 40 glowing tech stack badges on a profile takes 2 minutes using an online generator. Recruiters and engineering managers know this. It proves you know how to copy Markdown, not that you know how to write software.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                ✕
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                The Bot Green-Dot Trap
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Running a cron script to create automated commits just to turn your contribution graph green is an immediate red flag. Experienced engineers click into the commit history in 3 seconds and spot the automated commits immediately.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border-2 border-emerald-500/40 bg-emerald-50/10 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                The Official Achievement Truth
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                Official GitHub Badges cannot be faked with markdown or copy-paste templates. They require real GitHub event triggers (merged pull requests, verified co-authors, accepted community discussions). That is why they carry instant credibility.
              </p>
            </div>

          </div>
        </section>

        {/* ─── Section 3: How The GitGlow Blueprint Engine Works ───────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-12 shadow-sm mb-20 md:mb-28 text-left">
          <div className="max-w-2xl mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-2 border border-[#0058be]/15">
              The Implementation Solution
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
              How GitGlow Automates Your Badge Unlocks
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-1">
              No guesswork. No hunting for obscure open-source repos. Follow our 3-station engine blueprint.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0b1c30] text-[#d1f34d] flex items-center justify-center font-mono font-bold text-base">
                01
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                Select Target Badge
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Choose the badge you want to claim. We recommend starting with <strong className="text-[#0b1c30]">Quickdraw</strong> (2 mins), then advancing to <strong className="text-[#0b1c30]">Pull Shark 🦈</strong> and <strong className="text-[#0b1c30]">YOLO 🪂</strong>.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0058be] text-white flex items-center justify-center font-mono font-bold text-base">
                02
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                Launch Engine Recipe
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                The engine generates the exact Git commands, clean branch configuration, or contributor card JSON needed to trigger GitHub's internal achievement webhook.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#d1f34d] text-[#0b1c30] flex items-center justify-center font-mono font-bold text-base">
                03
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                Safe Sandbox Merge
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Submit your pull request to our verified <code className="font-mono text-[#0058be] bg-blue-50 px-1 py-0.5 rounded">gitglow-community</code> sandbox. Our automated bot reviews and merges it immediately, unlocking the badge on your profile.
              </p>
            </div>

          </div>
        </section>

        {/* ─── Section 4: The Complete Badge Catalog Grid ─────────────────── */}
        <section id="catalog" className="space-y-8 mb-20 md:mb-28 text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-2 border border-[#0058be]/15">
                <Layers size={11} /> Complete Directory
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
                All 10 GitHub Profile Achievements
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 mt-1 max-w-xl">
                Real badge graphics downloaded from official GitHub resources. Inspect requirements, gotchas, tier milestones, and claim blueprints.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-white border border-neutral-200 shadow-2xs gap-1 flex-wrap">
              {[
                { id: 'all', label: 'All (10)' },
                { id: 'obtainable', label: 'Obtainable (7)' },
                { id: 'starter', label: 'Starter Badges (3)' },
                { id: 'collaborative', label: 'Collaborative (2)' },
                { id: 'community', label: 'Community (2)' },
                { id: 'milestone', label: 'Milestones (2)' },
                { id: 'legacy', label: 'Historic (1)' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedCategory(filter.id)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
                    selectedCategory === filter.id
                      ? 'bg-[#0b1c30] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-[#0b1c30] hover:bg-neutral-50',
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </section>

        {/* ─── Section 5: Tier Multiplier Ladders ─────────────────────────── */}
        <section id="tiers" className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-sm mb-20 md:mb-28 text-left">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-widest mb-3">
              <Award size={11} className="text-[#0058be]" /> Multiplier Ladders
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight mb-2">
              How Badge Tiers Work
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Certain badges evolve as your contribution volume increases. GitHub decorates your badge with Bronze (x2), Silver (x3), and Gold (x4) multipliers.
            </p>
          </div>

          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl border border-neutral-200 bg-[#f8f9ff] text-center">
              <span className="px-2.5 py-1 rounded-full bg-neutral-200 text-[#0b1c30] text-[10px] font-bold uppercase tracking-wider inline-block mb-2">
                Default Base
              </span>
              <p className="text-sm font-bold text-[#0b1c30]">Base Badge</p>
              <p className="text-xs text-neutral-500 mt-1">Initial unlock threshold</p>
            </div>

            <div className="p-5 rounded-2xl border border-[#F9BFA7] bg-[#F9BFA7]/10 text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#F9BFA7] text-[#0b1c30] text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2">
                x2 Multiplier
              </span>
              <p className="text-sm font-bold text-[#0b1c30]">Bronze Tier</p>
              <p className="text-xs text-neutral-600 mt-1">Border: #F9BFA7</p>
            </div>

            <div className="p-5 rounded-2xl border border-[#E1E4E4] bg-[#E1E4E4]/30 text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#E1E4E4] text-[#0b1c30] text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2">
                x3 Multiplier
              </span>
              <p className="text-sm font-bold text-[#0b1c30]">Silver Tier</p>
              <p className="text-xs text-neutral-600 mt-1">Border: #E1E4E4</p>
            </div>

            <div className="p-5 rounded-2xl border border-[#FAE57E] bg-[#FAE57E]/20 text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#FAE57E] text-[#0b1c30] text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2">
                x4 Multiplier
              </span>
              <p className="text-sm font-bold text-[#0b1c30]">Gold Tier</p>
              <p className="text-xs text-neutral-600 mt-1">Border: #FAE57E</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4">Default</th>
                  <th className="py-3 px-4 text-[#b86241]">Bronze (x2)</th>
                  <th className="py-3 px-4 text-slate-700">Silver (x3)</th>
                  <th className="py-3 px-4 text-amber-700">Gold (x4)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700 font-medium">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#0b1c30] flex items-center gap-2">
                    <img src="/images/badges/pull-shark.png" alt="Pull Shark" className="w-6 h-6 object-contain" />
                    <span>Pull Shark 🦈</span>
                  </td>
                  <td className="py-3.5 px-4">2 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-[#b86241]">16 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">128 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">1,024 PRs</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#0b1c30] flex items-center gap-2">
                    <img src="/images/badges/pair-extraordinaire.png" alt="Pair Extraordinaire" className="w-6 h-6 object-contain" />
                    <span>Pair Extraordinaire 👯</span>
                  </td>
                  <td className="py-3.5 px-4">1 Coauthored PR</td>
                  <td className="py-3.5 px-4 font-bold text-[#b86241]">10 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">24 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">48 PRs</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#0b1c30] flex items-center gap-2">
                    <img src="/images/badges/galaxy-brain.png" alt="Galaxy Brain" className="w-6 h-6 object-contain" />
                    <span>Galaxy Brain 🧠</span>
                  </td>
                  <td className="py-3.5 px-4">2 Answers</td>
                  <td className="py-3.5 px-4 font-bold text-[#b86241]">8 Answers</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">16 Answers</td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">32 Answers</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#0b1c30] flex items-center gap-2">
                    <img src="/images/badges/starstruck.png" alt="Starstruck" className="w-6 h-6 object-contain" />
                    <span>Starstruck ⭐</span>
                  </td>
                  <td className="py-3.5 px-4">16 Stars</td>
                  <td className="py-3.5 px-4 font-bold text-[#b86241]">128 Stars</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">512 Stars</td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">4,096 Stars</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── Section 6: Frequently Asked Questions ───────────────────────── */}
        <section id="faq" className="max-w-3xl mx-auto space-y-6 mb-20 md:mb-28 text-left">
          <div className="text-center space-y-2 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-widest">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Clear answers on how GitHub calculates, displays, and protects achievement badges.
            </p>
          </div>

          <div className="space-y-3">
            <FAQItem
              q="Is this against GitHub Terms of Service?"
              a="No. Everything GitGlow guides you to do uses official Git workflows (standard git commits, standard branch creation, and standard pull requests). You are making real, valid contributions to our dedicated open-source repository (gitglow-community). There are no bots faking tokens or hacking GitHub servers."
            />
            <FAQItem
              q="How long does it take for GitHub to show the badge on my profile?"
              a="GitHub processes badge achievements asynchronously through background queue runners. Usually, badges appear within 10 to 30 minutes after the pull request or issue is closed. If GitHub is experiencing high load, it can take up to 24 hours."
            />
            <FAQItem
              q="Can I earn achievements on private repositories?"
              a="Yes, but only if you enable private contribution visibility in your GitHub settings: go to Settings → Profile Settings → Contribution Settings and check 'Include private contributions on my profile'."
            />
            <FAQItem
              q="What if I make a mistake during the pull request?"
              a="That is exactly why gitglow-community exists. It is a zero-judgment sandbox specifically built for students to practice. If your commit message format is wrong, our bot posts a helpful review comment showing you how to fix it."
            />
            <FAQItem
              q="Can I still get the Arctic Code Vault Contributor badge?"
              a="No. The Arctic Code Vault Contributor badge was only awarded to developers whose code was archived in the Svalbard Arctic World Archive on February 2, 2020. It is a historic badge and is permanently unobtainable for new accounts."
            />
          </div>
        </section>

        {/* ─── Section 7: Final CTA Banner ─────────────────────────────────── */}
        <section className="rounded-3xl bg-[#0b1c30] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0058be]/25 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#d1f34d] text-[10px] font-extrabold uppercase tracking-widest border border-white/10">
              <Sparkles size={11} /> Start Building Real Proof
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Claim Your First <br />
              <span className="text-[#d1f34d]">GitHub Achievement?</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl mx-auto">
              Stop decorating an empty canvas with copy-paste icons. Follow our automated claiming engine to get Quickdraw and Pull Shark on your profile today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/blueprints/gitglow/engine?badge=quickdraw"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#d1f34d] text-[#0b1c30] font-extrabold text-sm uppercase tracking-wider hover:bg-[#c2e240] transition-colors shadow-lg shadow-[#d1f34d]/20"
              >
                Claim Quickdraw First (2 Mins) →
              </Link>
              
              <Link
                to="/blueprints/gitglow/engine?badge=pull-shark"
                className="w-full sm:w-auto px-6 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors"
              >
                Claim Pull Shark 🦈
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 text-[11px] text-neutral-400 font-medium border-t border-white/10 mt-6">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#d1f34d]" /> Official GitHub Events
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#d1f34d]" /> 100% Account Safe
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#d1f34d]" /> Instant Profile Verification
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
