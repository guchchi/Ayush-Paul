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
  AlertCircle,
  Copy,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DURATION, EASING } from '../../../lib/motion-presets';
import { GITHUB_BADGES, GitHubBadge } from '../../../data/gitglow/github-badges';

// ─── FAQ Accordion Item ──────────────────────────────────────────────────────
const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#30363d] rounded-2xl bg-[#161b22] overflow-hidden transition-all duration-200 hover:border-[#58a6ff]/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-center justify-between text-left text-sm sm:text-base font-bold text-[#f0f6fc] hover:text-[#58a6ff] transition-colors focus:outline-none"
        aria-expanded={open}
      >
        <span className="pr-4">{q}</span>
        <span className="p-1.5 rounded-full bg-[#0d1117] border border-[#30363d] text-[#8b949e] shrink-0">
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
            <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#8b949e] leading-relaxed border-t border-[#30363d] bg-[#0d1117]/60">
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
    pedestalBorder: string;
    glow: string;
  }
> = {
  quickdraw: {
    pedestalBorder: 'border-amber-500/40 group-hover:border-amber-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
  },
  'pull-shark': {
    pedestalBorder: 'border-cyan-500/40 group-hover:border-cyan-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]',
  },
  yolo: {
    pedestalBorder: 'border-rose-500/40 group-hover:border-rose-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]',
  },
  'pair-extraordinaire': {
    pedestalBorder: 'border-purple-500/40 group-hover:border-purple-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]',
  },
  'galaxy-brain': {
    pedestalBorder: 'border-indigo-500/40 group-hover:border-indigo-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]',
  },
  starstruck: {
    pedestalBorder: 'border-amber-500/40 group-hover:border-amber-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
  },
  'public-sponsor': {
    pedestalBorder: 'border-emerald-500/40 group-hover:border-emerald-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
  },
  'heart-on-your-sleeve': {
    pedestalBorder: 'border-pink-500/40 group-hover:border-pink-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]',
  },
  'open-sourcerer': {
    pedestalBorder: 'border-teal-500/40 group-hover:border-teal-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]',
  },
  'arctic-code-vault': {
    pedestalBorder: 'border-sky-500/40 group-hover:border-sky-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]',
  },
};

// ─── Option A: Compact Trophy Card Component ─────────────────────────────────
const BadgeCard: React.FC<{ badge: GitHubBadge }> = ({ badge }) => {
  const theme = BADGE_THEMES[badge.id] || {
    pedestalBorder: 'border-[#30363d]',
    glow: 'group-hover:shadow-md',
  };

  // Status Capsule Renderer (One consolidated pill per card)
  const renderStatusCapsule = () => {
    if (badge.isRecommendedStarter) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d1f34d]/15 text-[#d1f34d] text-[10px] font-extrabold uppercase tracking-wide border border-[#d1f34d]/30 shadow-2xs">
          <Flame size={11} className="text-[#d1f34d]" />
          <span>Starter · 5 Mins</span>
        </span>
      );
    }
    if (badge.status === 'testing') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-bold uppercase tracking-wide border border-amber-500/30">
          <Sparkles size={11} className="text-amber-400" />
          <span>In GitHub Beta</span>
        </span>
      );
    }
    if (!badge.isObtainable) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0d1117] text-[#8b949e] text-[10px] font-bold uppercase tracking-wide border border-[#30363d]">
          <Lock size={10} />
          <span>Archived (2020)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0d1117] text-[#c9d1d9] text-[10px] font-bold uppercase tracking-wide border border-[#30363d]">
        <span>{badge.difficulty} · Obtainable</span>
      </span>
    );
  };

  return (
    <div
      className={cn(
        'group relative p-5 rounded-2xl border bg-[#161b22] transition-all duration-200 flex flex-col justify-between hover:border-[#58a6ff]/50 hover:shadow-xl hover:-translate-y-1',
        badge.isRecommendedStarter
          ? 'border-[#238636]/50 ring-1 ring-[#238636]/20 shadow-2xs'
          : 'border-[#30363d]',
      )}
    >
      <div>
        {/* Top Header: Custom Themed Trophy Pedestal + Single Meta Capsule */}
        <div className="flex items-center justify-between gap-3 mb-4">
          {/* Custom Trophy Pedestal */}
          <div
            className={cn(
              'relative w-16 h-16 rounded-2xl p-2 flex items-center justify-center bg-[#0d1117] border transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 shadow-2xs',
              theme.pedestalBorder,
              theme.glow,
            )}
          >
            {/* Specular Glint Reflection */}
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.08),transparent_65%)] pointer-events-none" />
            <img
              src={badge.image}
              alt={badge.name}
              className="relative z-10 w-12 h-12 object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-110 select-none"
              loading="lazy"
            />
          </div>

          {/* Single Consolidated Status Capsule */}
          <div>{renderStatusCapsule()}</div>
        </div>

        {/* Title & Authentic Tagline */}
        <div className="space-y-1 mb-3">
          <div className="text-lg font-bold text-[#f0f6fc] tracking-tight group-hover:text-[#58a6ff] transition-colors leading-snug">
            {badge.name}
          </div>
          <div className="text-xs text-[#8b949e] font-medium line-clamp-1 leading-normal">
            {badge.tagline}
          </div>
        </div>

        {/* GitGlow Blueprint Strategy Capsule */}
        <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d]/80 text-xs text-[#c9d1d9] leading-relaxed min-h-[58px] flex items-center mb-3.5">
          <div className="line-clamp-2 text-xs leading-relaxed">
            <span className="font-bold text-[#f0f6fc]">Blueprint: </span>
            <span className="text-[#8b949e] font-normal">{badge.blueprintStrategy}</span>
          </div>
        </div>

        {/* Tiers Ladder Micro-Strip */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#8b949e] bg-[#0d1117] border border-[#30363d] px-2.5 py-1.5 rounded-lg mb-4">
          <span className="font-bold text-[#8b949e] text-[10px] uppercase tracking-wider">
            {badge.tiers && badge.tiers.length > 0 ? 'Tiers' : 'Scope'}
          </span>
          <div className="flex items-center gap-1.5 font-medium text-[#c9d1d9]">
            {badge.tiers && badge.tiers.length > 0 ? (
              <>
                <span className="text-[#f0f6fc]">{badge.tiers[0]?.threshold.split(' ')[0]}</span>
                <span className="text-[#30363d]">·</span>
                <span className="text-[#f9bfa7]">{badge.tiers[1]?.threshold.split(' ')[0]} 🥉</span>
                <span className="text-[#30363d]">·</span>
                <span className="text-[#e1e4e4]">{badge.tiers[2]?.threshold.split(' ')[0]} 🥈</span>
                <span className="text-[#30363d]">·</span>
                <span className="text-[#fae57e]">{badge.tiers[3]?.threshold.split(' ')[0]} 🥇</span>
              </>
            ) : (
              <span className="text-[#8b949e] font-sans text-xs">Standard Single Unlock</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Row */}
      <div className="pt-2 border-t border-[#30363d]">
        {badge.isObtainable ? (
          <Link
            to={`/blueprints/gitglow/engine?badge=${badge.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
          >
            <span>Launch Claim Engine</span>
            <ArrowRight size={13} />
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-[#0d1117] text-[#8b949e] font-bold text-xs uppercase tracking-wider cursor-not-allowed border border-[#30363d]">
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
  statusType?: 'verified' | 'fallback' | 'rate-limit';
  statusMessage?: string;
}

// ─── Main GitGlow Page ────────────────────────────────────────────────────────
export const GitGlowHomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [githubInput, setGithubInput] = useState<string>('arivera-dev');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(cmd);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const [scannedUser, setScannedUser] = useState<ScannedProfileData>({
    login: 'arivera-dev',
    name: 'Alex Rivera',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Frontend & Open Source Developer',
    public_repos: 14,
    followers: 42,
    created_at: '2022-03-15T00:00:00Z',
    isSimulated: true,
    statusType: 'verified',
    statusMessage: 'Interactive Demo Profile',
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
          statusType: 'verified',
          statusMessage: 'Public Profile Verified',
        });
      } else if (res.status === 404) {
        setScannedUser({
          login: username,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
          bio: 'Public GitHub Developer',
          public_repos: 4,
          followers: 8,
          created_at: '2023-01-01T00:00:00Z',
          isSimulated: true,
          statusType: 'fallback',
          statusMessage: 'User not found on GitHub · Sandbox preview',
        });
      } else {
        // 403 or other
        setScannedUser({
          login: username,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
          bio: 'Public GitHub Developer',
          public_repos: 6,
          followers: 12,
          created_at: '2023-01-01T00:00:00Z',
          isSimulated: true,
          statusType: 'rate-limit',
          statusMessage: 'GitHub API limit reached · Sandbox preview',
        });
      }
    } catch {
      setScannedUser({
        login: username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
        bio: 'Public GitHub Developer',
        public_repos: 6,
        followers: 12,
        created_at: '2023-01-01T00:00:00Z',
        isSimulated: true,
        statusType: 'fallback',
        statusMessage: 'Offline mode · Sandbox preview',
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
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] pt-24 pb-20 overflow-x-hidden selection:bg-[#d1f34d] selection:text-[#0d1117]">
      
      {/* ─── Upper Navigation / Back link ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-4 pb-6">
        <Link
          to="/blueprints"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8b949e] hover:text-[#58a6ff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#58a6ff] rounded-lg p-1.5"
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161b22] border border-[#30363d] text-[#58a6ff] text-[11px] font-bold uppercase tracking-widest">
              <Sparkles size={12} className="text-[#58a6ff]" />
              <span>Instant GitHub Profile Badge Audit</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#f0f6fc] leading-[1.08]">
              Paste your GitHub URL. <br />
              <span className="text-[#58a6ff]">See the badges you're missing in 2 seconds.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#8b949e] leading-relaxed max-w-2xl">
              Recruiters ignore copy-paste markdown shields. Enter your GitHub profile below to audit your official achievements and get the exact sandbox blueprint to claim your first three badges today.
            </p>

            {/* The Command Console Input Bar */}
            <div className="pt-2 max-w-2xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleScan();
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-lg focus-within:border-[#58a6ff] focus-within:ring-2 focus-within:ring-[#58a6ff]/20 transition-all"
              >
                <div className="flex items-center gap-2.5 px-3 py-1.5 flex-1 min-w-0 bg-[#0d1117] rounded-xl border border-[#30363d]/60">
                  <Github size={20} className="text-[#8b949e] shrink-0" />
                  <span className="font-mono text-xs sm:text-sm text-[#8b949e] select-none">
                    github.com/
                  </span>
                  <input
                    type="text"
                    value={githubInput}
                    onChange={(e) => setGithubInput(e.target.value)}
                    placeholder="username or paste profile link"
                    className="w-full bg-transparent font-mono text-xs sm:text-sm text-[#f0f6fc] placeholder:text-[#8b949e]/60 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isScanning}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-[0.99] disabled:opacity-70 shrink-0"
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
              <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-[#8b949e]">
                <span className="font-semibold text-[#8b949e] text-[11px] uppercase tracking-wider">Try an example:</span>
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
                    className="px-2.5 py-1 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-[#c9d1d9] hover:text-[#f0f6fc] font-mono text-xs transition-colors border border-[#30363d] shadow-2xs hover:border-[#58a6ff]/50"
                  >
                    @{demo.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Real-Time Scanned Diagnostic Card (Tactile Dark Console) ─────── */}
          <div className="mt-8 rounded-3xl bg-[#161b22] text-[#f0f6fc] border border-[#30363d] shadow-2xl p-6 sm:p-8 max-w-5xl">
            {/* Header: User Profile Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-[#30363d]">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={scannedUser.avatar_url}
                    alt={scannedUser.login}
                    className="w-16 h-16 rounded-full border-2 border-[#30363d] object-cover shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#238636] border-2 border-[#161b22] flex items-center justify-center" title="Public Profile Active">
                    <Check size={10} className="text-white font-bold" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-[#f0f6fc]">
                      {scannedUser.name}
                    </h3>
                    <a
                      href={`https://github.com/${scannedUser.login}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[#8b949e] hover:text-[#58a6ff] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>@{scannedUser.login}</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  <p className="text-xs text-[#8b949e] mt-0.5 line-clamp-1 max-w-md">
                    {scannedUser.bio}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2 text-[11px] font-mono text-[#8b949e]">
                    <span className="whitespace-nowrap">{scannedUser.public_repos} repos</span>
                    <span className="text-[#30363d]">·</span>
                    <span className="whitespace-nowrap">{scannedUser.followers} followers</span>
                    <span className="text-[#30363d]">·</span>
                    {scannedUser.statusType === 'verified' ? (
                      <span className="text-[10px] text-[#3fb950] font-sans font-semibold inline-flex items-center gap-1 whitespace-nowrap">
                        <Check size={10} className="text-[#3fb950]" /> {scannedUser.statusMessage || 'Verified Profile'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-sans font-semibold inline-flex items-center gap-1 whitespace-nowrap">
                        <AlertCircle size={10} className="text-amber-400" /> {scannedUser.statusMessage || 'Sandbox Mode'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Overall Achievement Audit Status */}
              <div className="bg-[#0d1117] px-4 py-3 rounded-2xl border border-[#30363d] flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-2 shrink-0">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8b949e]">
                  Starter Badges Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f85149]/10 border border-[#f85149]/30 text-[#f85149] font-bold text-xs whitespace-nowrap">
                  <span>0 / 4 Unlocked</span>
                  <span className="text-[#8b949e]">· Ready to Claim</span>
                </span>
              </div>
            </div>

            {/* Middle: 4 Starter Badges Diagnostics Grid */}
            <div className="py-6 border-b border-[#30363d]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8b949e]">
                  Starter Achievements Breakdown
                </span>
                <span className="text-xs text-[#8b949e]">
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
                    theme: 'border-amber-500/30 bg-[#0d1117] hover:border-amber-400/60',
                    btnBg: 'bg-[#d1f34d] hover:bg-[#c2e240] text-[#0d1117]',
                  },
                  {
                    id: 'pull-shark',
                    name: 'Pull Shark 🦈',
                    image: '/images/badges/pull-shark.png',
                    requirement: 'Merge 2 PRs into repo',
                    time: '5 Mins',
                    difficulty: 'Easy',
                    theme: 'border-cyan-500/30 bg-[#0d1117] hover:border-cyan-400/60',
                    btnBg: 'bg-[#58a6ff] hover:bg-[#388bfd] text-[#0d1117]',
                  },
                  {
                    id: 'yolo',
                    name: 'YOLO 🪂',
                    image: '/images/badges/yolo.png',
                    requirement: 'Merge PR without review',
                    time: '5 Mins',
                    difficulty: 'Easy',
                    theme: 'border-rose-500/30 bg-[#0d1117] hover:border-rose-400/60',
                    btnBg: 'bg-[#238636] hover:bg-[#2ea043] text-white',
                  },
                  {
                    id: 'pair-extraordinaire',
                    name: 'Pair Extraordinaire 👯',
                    image: '/images/badges/pair-extraordinaire.png',
                    requirement: 'Co-authored commit merged',
                    time: '10 Mins',
                    difficulty: 'Medium',
                    theme: 'border-purple-500/30 bg-[#0d1117] hover:border-purple-400/60',
                    btnBg: 'bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] border border-[#30363d]',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'p-4 rounded-2xl border flex flex-col justify-between transition-all duration-200',
                      item.theme,
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center p-1.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-9 h-9 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                          />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#161b22] text-[#c9d1d9] border border-[#30363d]">
                          {item.time}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#f0f6fc] mb-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#8b949e] leading-snug line-clamp-2 mb-3">
                        {item.requirement}
                      </p>
                    </div>

                    <Link
                      to={`/blueprints/gitglow/engine?badge=${item.id}&user=${scannedUser.login}`}
                      className={cn(
                        'w-full py-2.5 px-3 min-h-[44px] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.99]',
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
                  <p className="text-xs font-bold text-[#f0f6fc]">
                    Fastest Path for @{scannedUser.login}: Claim Quickdraw in 120 Seconds
                  </p>
                  <p className="text-[11px] text-[#8b949e]">
                    Open a tracking issue and close it in under 5 minutes on your personal repository.
                  </p>
                </div>
              </div>

              <Link
                to={`/blueprints/gitglow/engine?badge=quickdraw&user=${scannedUser.login}`}
                className="px-6 py-3 min-h-[44px] rounded-xl bg-[#d1f34d] hover:bg-[#c2e240] text-[#0d1117] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.99] shrink-0 flex items-center justify-center text-center"
              >
                Launch 2-Min Quickdraw Claim →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Section 2: Reality Check — Old Way vs GitGlow Way ────────────── */}
        <section id="compare" className="scroll-mt-28 mb-20 md:mb-28 text-left">
          <div className="max-w-3xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161b22] text-[#8b949e] text-[10px] font-bold uppercase tracking-widest mb-2 border border-[#30363d]">
              Strategic Comparison
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#f0f6fc] tracking-tight">
              The Fake Profile Trap vs. Real GitHub Achievements
            </h2>
            <p className="text-sm sm:text-base text-[#8b949e] mt-1">
              What happens when an engineering hiring manager looks at your GitHub profile.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Left Column: The Old Way (The Illusion) */}
            <div className="p-7 sm:p-8 rounded-3xl bg-[#161b22] border border-[#f85149]/40 space-y-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#30363d]">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#f85149]/15 text-[#f85149] border border-[#f85149]/30 flex items-center justify-center font-bold text-sm">
                    ✕
                  </span>
                  <h3 className="text-lg font-bold text-[#f0f6fc]">
                    The Copy-Paste Illusion
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#f85149] bg-[#f85149]/10 border border-[#f85149]/30 px-2.5 py-1 rounded-full whitespace-nowrap">
                  High Noise · Zero Signal
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#c9d1d9]">
                <div className="space-y-1">
                  <p className="font-bold text-[#f0f6fc] flex items-center gap-1.5">
                    <span className="text-[#f85149] font-bold">1.</span> 40+ Generic Shields.io Badges
                  </p>
                  <p className="text-[#8b949e] pl-4 leading-relaxed">
                    Pasting glowing shields for React, Python, Docker takes 2 minutes using an online generator. It proves you know Markdown, not engineering.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-[#f0f6fc] flex items-center gap-1.5">
                    <span className="text-[#f85149] font-bold">2.</span> Bot-Generated Cron "Green Dots"
                  </p>
                  <p className="text-[#8b949e] pl-4 leading-relaxed">
                    Automating empty commits to paint your contribution graph green is spotted in 3 seconds by tech leads who click commit logs.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-[#f0f6fc] flex items-center gap-1.5">
                    <span className="text-[#f85149] font-bold">3.</span> The Recruiter Reality
                  </p>
                  <p className="text-[#8b949e] pl-4 leading-relaxed">
                    Recruiters and senior engineers scroll past vanity README templates in 2 seconds looking for actual pull requests and merge history.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: The GitGlow Way (Real Webhooks) */}
            <div className="p-7 sm:p-8 rounded-3xl bg-[#161b22] border-2 border-[#238636]/60 shadow-lg space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#30363d]">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 flex items-center justify-center font-bold text-sm">
                    ✓
                  </span>
                  <h3 className="text-lg font-bold text-[#f0f6fc]">
                    The GitGlow Verified Blueprint
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3fb950] bg-[#238636]/20 border border-[#238636]/40 px-2.5 py-1 rounded-full whitespace-nowrap">
                  Permanent · Unfakeable
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#c9d1d9]">
                <div className="space-y-1">
                  <p className="font-bold text-[#f0f6fc] flex items-center gap-1.5">
                    <span className="text-[#3fb950] font-bold">1.</span> Official GitHub Event Webhooks
                  </p>
                  <p className="text-[#8b949e] pl-4 leading-relaxed">
                    Awarded directly by GitHub servers following real Git actions (merged pull requests, verified co-authors, accepted discussion answers).
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-[#f0f6fc] flex items-center gap-1.5">
                    <span className="text-[#3fb950] font-bold">2.</span> Safe Sandboxed Execution
                  </p>
                  <p className="text-[#8b949e] pl-4 leading-relaxed">
                    Practice Git branching, trailer formatting, and PR etiquette in our dedicated sandbox repository with zero fear of messing up a public project.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-[#f0f6fc] flex items-center gap-1.5">
                    <span className="text-[#3fb950] font-bold">3.</span> Permanent Profile Header Medallions
                  </p>
                  <p className="text-[#8b949e] pl-4 leading-relaxed">
                    Badges live permanently on your official GitHub profile header alongside your follower count and contribution graph.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── Section 3: The 3-Station Git Pipeline ────────────────────────── */}
        <div id="quickstart" className="relative -top-28 pointer-events-none" />
        <section id="engine" className="scroll-mt-28 bg-[#161b22] text-[#f0f6fc] border border-[#30363d] rounded-3xl p-6 sm:p-12 shadow-xl mb-20 md:mb-28 text-left">
          <div className="max-w-2xl mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d1117] text-[#3fb950] text-[10px] font-bold uppercase tracking-widest mb-2 border border-[#238636]/30 font-mono">
              <Terminal size={11} /> Automated Git Execution Pipeline
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#f0f6fc] tracking-tight">
              How GitGlow Triggers GitHub Achievement Webhooks
            </h2>
            <p className="text-sm sm:text-base text-[#8b949e] mt-1">
              No guesswork. No hunting for random open-source repos. Follow our 3-station pipeline.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-2xl bg-[#0d1117] border border-[#30363d] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#d1f34d]">
                  Station 01
                </span>
                <span className="text-xs text-[#8b949e] font-mono">120s Setup</span>
              </div>
              <h3 className="text-base font-bold text-[#f0f6fc]">
                Select Badge Recipe
              </h3>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Choose your target badge. Start with Quickdraw (2 mins), then advance to Pull Shark 🦈 and YOLO 🪂.
              </p>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#010409] border border-[#30363d] font-mono text-[11px] text-[#c9d1d9]">
                <div className="flex items-center gap-1.5 overflow-x-auto select-all">
                  <span className="text-[#3fb950] select-none">$</span>
                  <span>git switch -c claim/quickdraw</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCommand('git switch -c claim/quickdraw')}
                  className="p-1 rounded-md text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors shrink-0 ml-2"
                  title="Copy command"
                  aria-label="Copy station 1 command"
                >
                  {copiedCommand === 'git switch -c claim/quickdraw' ? (
                    <Check size={12} className="text-[#3fb950]" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1117] border border-[#30363d] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#58a6ff]">
                  Station 02
                </span>
                <span className="text-xs text-[#8b949e] font-mono">Instant Gen</span>
              </div>
              <h3 className="text-base font-bold text-[#f0f6fc]">
                Generate Git Triggers
              </h3>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                The engine gives you the exact Git commands, branch format, or commit trailers needed for GitHub's webhook.
              </p>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#010409] border border-[#30363d] font-mono text-[11px] text-[#c9d1d9]">
                <div className="flex items-center gap-1.5 overflow-x-auto select-all">
                  <span className="text-[#3fb950] select-none">$</span>
                  <span>git commit -m "feat: claim badge"</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCommand('git commit -m "feat: claim badge"')}
                  className="p-1 rounded-md text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors shrink-0 ml-2"
                  title="Copy command"
                  aria-label="Copy station 2 command"
                >
                  {copiedCommand === 'git commit -m "feat: claim badge"' ? (
                    <Check size={12} className="text-[#3fb950]" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1117] border border-[#30363d] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3fb950]">
                  Station 03
                </span>
                <span className="text-xs text-[#8b949e] font-mono">Auto Merge</span>
              </div>
              <h3 className="text-base font-bold text-[#f0f6fc]">
                Sandbox Bot Merge
              </h3>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Submit to our verified sandbox. Our automated bot merges in 60s, unlocking the badge on your profile.
              </p>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#010409] border border-[#30363d] font-mono text-[11px] text-[#c9d1d9]">
                <div className="flex items-center gap-1.5 overflow-x-auto select-all">
                  <span className="text-[#3fb950] select-none">$</span>
                  <span>gh pr merge --auto --merge</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCommand('gh pr merge --auto --merge')}
                  className="p-1 rounded-md text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors shrink-0 ml-2"
                  title="Copy command"
                  aria-label="Copy station 3 command"
                >
                  {copiedCommand === 'gh pr merge --auto --merge' ? (
                    <Check size={12} className="text-[#3fb950]" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ─── Section 4: The Complete Badge Catalog Grid ─────────────────── */}
        <section id="catalog" className="space-y-8 mb-20 md:mb-28 text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161b22] text-[#58a6ff] text-[10px] font-bold uppercase tracking-widest mb-2 border border-[#30363d]">
                <Layers size={11} /> Complete Directory
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#f0f6fc] tracking-tight">
                All 10 GitHub Profile Achievements
              </h2>
              <p className="text-sm sm:text-base text-[#8b949e] mt-1 max-w-xl">
                Real badge graphics downloaded from official GitHub resources. Inspect requirements, gotchas, tier milestones, and claim blueprints.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-2xs gap-1 flex-wrap">
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
                      ? 'bg-[#58a6ff] text-[#0d1117] font-extrabold shadow-xs'
                      : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]',
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badges Grid */}
          {filteredBadges.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[#161b22] border border-[#30363d] shadow-2xs space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#0d1117] border border-[#30363d] text-[#8b949e] flex items-center justify-center mx-auto">
                <Award size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#f0f6fc]">No badges match this category</h3>
                <p className="text-xs text-[#8b949e]">
                  Switch back to all badges to inspect the complete 10-badge directory.
                </p>
              </div>
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs active:scale-[0.99]"
              >
                Show All 10 Badges
              </button>
            </div>
          )}
        </section>

        {/* ─── Section 5: Tier Multiplier Ladders ─────────────────────────── */}
        <section id="tiers" className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 sm:p-10 shadow-sm mb-20 md:mb-28 text-left">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d1117] text-[#8b949e] text-[10px] font-bold uppercase tracking-widest mb-3 border border-[#30363d]">
              <Award size={11} className="text-[#58a6ff]" /> Multiplier Ladders
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f0f6fc] tracking-tight mb-2">
              How Badge Tiers Work
            </h2>
            <p className="text-sm sm:text-base text-[#8b949e] leading-relaxed">
              Certain badges evolve as your contribution volume increases. GitHub decorates your badge with Bronze (x2), Silver (x3), and Gold (x4) multipliers.
            </p>
          </div>

          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl border border-[#30363d] bg-[#0d1117] text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#21262d] text-[#c9d1d9] text-[10px] font-bold uppercase tracking-wider inline-block mb-2 border border-[#30363d]">
                Default Base
              </span>
              <p className="text-sm font-bold text-[#f0f6fc]">Base Badge</p>
              <p className="text-xs text-[#8b949e] mt-1">Initial unlock threshold</p>
            </div>

            <div className="p-5 rounded-2xl border border-[#b86241]/40 bg-[#0d1117] text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#b86241]/20 text-[#f9bfa7] border border-[#b86241]/40 text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2">
                x2 Multiplier
              </span>
              <p className="text-sm font-bold text-[#f0f6fc]">Bronze Tier</p>
              <p className="text-xs text-[#f9bfa7] mt-1">Accent: #F9BFA7</p>
            </div>

            <div className="p-5 rounded-2xl border border-[#e1e4e4]/40 bg-[#0d1117] text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#e1e4e4]/15 text-[#e1e4e4] border border-[#e1e4e4]/30 text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2">
                x3 Multiplier
              </span>
              <p className="text-sm font-bold text-[#f0f6fc]">Silver Tier</p>
              <p className="text-xs text-[#e1e4e4] mt-1">Accent: #E1E4E4</p>
            </div>

            <div className="p-5 rounded-2xl border border-[#fae57e]/40 bg-[#0d1117] text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#fae57e]/20 text-[#fae57e] border border-[#fae57e]/40 text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2">
                x4 Multiplier
              </span>
              <p className="text-sm font-bold text-[#f0f6fc]">Gold Tier</p>
              <p className="text-xs text-[#fae57e] mt-1">Accent: #FAE57E</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#8b949e] mb-2 sm:hidden px-1">
            <span>← Swipe table horizontally</span>
            <span>→</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#30363d]">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#30363d] bg-[#0d1117] text-[#8b949e] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4">Default</th>
                  <th className="py-3 px-4 text-[#f9bfa7]">Bronze (x2)</th>
                  <th className="py-3 px-4 text-[#e1e4e4]">Silver (x3)</th>
                  <th className="py-3 px-4 text-[#fae57e]">Gold (x4)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d] text-[#c9d1d9] font-medium bg-[#161b22]">
                <tr className="hover:bg-[#21262d]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#f0f6fc] flex items-center gap-2">
                    <img src="/images/badges/pull-shark.png" alt="Pull Shark" className="w-6 h-6 object-contain" />
                    <span>Pull Shark 🦈</span>
                  </td>
                  <td className="py-3.5 px-4">2 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-[#f9bfa7]">16 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-[#e1e4e4]">128 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-[#fae57e]">1,024 PRs</td>
                </tr>
                <tr className="hover:bg-[#21262d]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#f0f6fc] flex items-center gap-2">
                    <img src="/images/badges/pair-extraordinaire.png" alt="Pair Extraordinaire" className="w-6 h-6 object-contain" />
                    <span>Pair Extraordinaire 👯</span>
                  </td>
                  <td className="py-3.5 px-4">1 Coauthored PR</td>
                  <td className="py-3.5 px-4 font-bold text-[#f9bfa7]">10 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-[#e1e4e4]">24 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-[#fae57e]">48 PRs</td>
                </tr>
                <tr className="hover:bg-[#21262d]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#f0f6fc] flex items-center gap-2">
                    <img src="/images/badges/galaxy-brain.png" alt="Galaxy Brain" className="w-6 h-6 object-contain" />
                    <span>Galaxy Brain 🧠</span>
                  </td>
                  <td className="py-3.5 px-4">2 Answers</td>
                  <td className="py-3.5 px-4 font-bold text-[#f9bfa7]">8 Answers</td>
                  <td className="py-3.5 px-4 font-bold text-[#e1e4e4]">16 Answers</td>
                  <td className="py-3.5 px-4 font-bold text-[#fae57e]">32 Answers</td>
                </tr>
                <tr className="hover:bg-[#21262d]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#f0f6fc] flex items-center gap-2">
                    <img src="/images/badges/starstruck.png" alt="Starstruck" className="w-6 h-6 object-contain" />
                    <span>Starstruck ⭐</span>
                  </td>
                  <td className="py-3.5 px-4">16 Stars</td>
                  <td className="py-3.5 px-4 font-bold text-[#f9bfa7]">128 Stars</td>
                  <td className="py-3.5 px-4 font-bold text-[#e1e4e4]">512 Stars</td>
                  <td className="py-3.5 px-4 font-bold text-[#fae57e]">4,096 Stars</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── Section 6: Frequently Asked Questions ───────────────────────── */}
        <section id="faq" className="max-w-3xl mx-auto space-y-6 mb-20 md:mb-28 text-left">
          <div className="text-center space-y-2 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161b22] text-[#8b949e] text-[10px] font-bold uppercase tracking-widest border border-[#30363d]">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f0f6fc] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#8b949e]">
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
        <section className="rounded-3xl bg-[#161b22] text-[#f0f6fc] p-8 sm:p-14 text-center space-y-6 shadow-2xl border border-[#30363d] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#58a6ff]/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d1117] text-[#d1f34d] text-[10px] font-extrabold uppercase tracking-widest border border-[#30363d]">
              <Sparkles size={11} /> Start Building Real Proof
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#f0f6fc] leading-tight">
              Ready to Claim Your First <br />
              <span className="text-[#d1f34d]">GitHub Achievement?</span>
            </h2>

            <p className="text-sm sm:text-base text-[#8b949e] leading-relaxed max-w-xl mx-auto">
              Stop decorating an empty canvas with copy-paste icons. Follow our automated claiming engine to get Quickdraw and Pull Shark on your profile today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/blueprints/gitglow/engine?badge=quickdraw"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#d1f34d] text-[#0d1117] font-extrabold text-sm uppercase tracking-wider hover:bg-[#c2e240] transition-colors shadow-lg shadow-[#d1f34d]/20"
              >
                Claim Quickdraw First (2 Mins) →
              </Link>
              
              <Link
                to="/blueprints/gitglow/engine?badge=pull-shark"
                className="w-full sm:w-auto px-6 py-4 rounded-xl border border-[#30363d] bg-[#0d1117] hover:bg-[#21262d] text-[#f0f6fc] font-bold text-sm transition-colors"
              >
                Claim Pull Shark 🦈
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 text-[11px] text-[#8b949e] font-medium border-t border-[#30363d] mt-6">
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
