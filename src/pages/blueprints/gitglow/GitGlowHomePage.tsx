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
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DURATION, EASING } from '../../../lib/motion-presets';
import { GITHUB_BADGES, GitHubBadge } from '../../../data/gitglow/github-badges';

// ─── Badge Terminal Recipes Definition ────────────────────────────────────────
interface BadgeRecipe {
  command1: string;
  command2: string;
  command3: string;
  station1Label: string;
  station2Label: string;
  station3Label: string;
  estimatedTime: string;
  isAutomated: boolean;
  gotchaNote: string;
}

const BADGE_RECIPES: Record<string, BadgeRecipe> = {
  quickdraw: {
    station1Label: '1. Create Test Issue',
    command1: 'gh issue create --title "track: quickdraw audit" --body "Temp milestone"',
    station2Label: '2. Close Under 5 Mins',
    command2: 'gh issue close 1 --comment "Closed for Quickdraw achievement"',
    station3Label: '3. Webhook Ingestion',
    command3: 'gh api user/public_emails',
    estimatedTime: '120 Seconds',
    isAutomated: true,
    gotchaNote: 'Must close within 300s of opening. Closing PRs without merging also qualifies.',
  },
  'pull-shark': {
    station1Label: '1. Switch Claim Branch',
    command1: 'git switch -c claim/pull-shark',
    station2Label: '2. Commit Verified Trigger',
    command2: 'git commit --allow-empty -m "feat: claim pull shark"',
    station3Label: '3. Auto-Merge PR',
    command3: 'gh pr merge --auto --merge',
    estimatedTime: '5 Minutes',
    isAutomated: true,
    gotchaNote: 'PR must be merged into main branch. Merged PRs qualify for Bronze (16) and Silver (128) multipliers.',
  },
  yolo: {
    station1Label: '1. Create YOLO Branch',
    command1: 'git switch -c claim/yolo',
    station2Label: '2. Direct Commit',
    command2: 'git commit --allow-empty -m "feat: direct merge without review"',
    station3Label: '3. Merge Without Review',
    command3: 'gh pr merge --admin --merge',
    estimatedTime: '3 Minutes',
    isAutomated: true,
    gotchaNote: 'Requires merging directly without any reviewer approval requested or submitted.',
  },
  'pair-extraordinaire': {
    station1Label: '1. Co-Authored Commit',
    command1: 'git commit -m "feat: pair programming\n\nCo-authored-by: gitglow-bot <bot@gitglow.dev>"',
    station2Label: '2. Push With Trailer',
    command2: 'git push origin claim/pair-extraordinaire',
    station3Label: '3. Merge Co-Authored PR',
    command3: 'gh pr merge --auto --merge',
    estimatedTime: '8 Minutes',
    isAutomated: true,
    gotchaNote: 'Trailer syntax must have exact blank line before "Co-authored-by:" and valid email format.',
  },
  'galaxy-brain': {
    station1Label: '1. Find Open Discussion',
    command1: 'gh browse https://github.com/orgs/community/discussions',
    station2Label: '2. Post Helpful Solution',
    command2: 'gh api graphql -f query="mutation { addDiscussionComment(...) }"',
    station3Label: '3. Mark Accepted Answer',
    command3: 'gh api graphql -f query="mutation { markDiscussionCommentAsAnswer(...) }"',
    estimatedTime: '15 Minutes',
    isAutomated: false,
    gotchaNote: 'Requires an accepted answer in a repository with GitHub Discussions enabled.',
  },
  starstruck: {
    station1Label: '1. Showcase Repository',
    command1: 'gh repo edit --add-topic "gitglow-showcase" --add-topic "developer-portfolio"',
    station2Label: '2. Share Milestone',
    command2: 'gh repo view --web',
    station3Label: '3. Reach 16 Stars',
    command3: 'gh api repos/{owner}/{repo} --jq .stargazers_count',
    estimatedTime: 'Community Milestone',
    isAutomated: false,
    gotchaNote: 'Stars from bot accounts or spam clusters can be pruned by GitHub fraud detectors.',
  },
  'public-sponsor': {
    station1Label: '1. Select Maintainer',
    command1: 'gh browse https://github.com/sponsors/guchchi',
    station2Label: '2. Set Sponsorship Tier',
    command2: 'gh api user/sponsorships_as_sponsor',
    station3Label: '3. Webhook Trigger',
    command3: 'gh api user/public_sponsorships',
    estimatedTime: '2 Minutes',
    isAutomated: false,
    gotchaNote: 'Requires a valid GitHub Sponsors transaction ($1 minimum). Badge appears within 10 minutes.',
  },
  'heart-on-your-sleeve': {
    station1Label: '1. Target Active PR',
    command1: 'gh pr view 1 --web',
    station2Label: '2. Add Heart Reaction',
    command2: 'gh api repos/{owner}/{repo}/issues/{number}/reactions -f content="heart"',
    station3Label: '3. Beta Sync',
    command3: 'gh api user --jq .login',
    estimatedTime: '1 Minute',
    isAutomated: true,
    gotchaNote: 'Currently rolling out in select GitHub testing clusters; badge activates once enabled on your shard.',
  },
  'open-sourcerer': {
    station1Label: '1. Cross-Repo PRs',
    command1: 'gh pr list --state merged --author @me',
    station2Label: '2. Verify Public Repos',
    command2: 'gh search prs --author @me --merged',
    station3Label: '3. Activation Check',
    command3: 'gh api user/achievements',
    estimatedTime: 'Multi-Repo Milestone',
    isAutomated: false,
    gotchaNote: 'Testing badge awarded for merging PRs across distinct public organizations.',
  },
  'arctic-code-vault': {
    station1Label: '1. Historic Snapshot',
    command1: '# Archived on Feb 2, 2020 at Svalbard World Archive',
    station2Label: '2. Archive Status',
    command2: '# Permanently closed for new accounts',
    station3Label: '3. Read-Only Milestone',
    command3: '# Preserved for 1,000 years in arctic permafrost',
    estimatedTime: 'Historic (Archived)',
    isAutomated: false,
    gotchaNote: 'Cannot be earned by new GitHub accounts. Preserved as a historical milestone.',
  },
};

// ─── Badge Themes Definition ─────────────────────────────────────────────────
const BADGE_THEMES: Record<
  string,
  {
    pedestalBorder: string;
    glow: string;
    accentHex: string;
  }
> = {
  quickdraw: {
    pedestalBorder: 'border-amber-500/40 group-hover:border-amber-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    accentHex: '#f59e0b',
  },
  'pull-shark': {
    pedestalBorder: 'border-cyan-500/40 group-hover:border-cyan-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    accentHex: '#06b6d4',
  },
  yolo: {
    pedestalBorder: 'border-rose-500/40 group-hover:border-rose-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]',
    accentHex: '#f43f5e',
  },
  'pair-extraordinaire': {
    pedestalBorder: 'border-purple-500/40 group-hover:border-purple-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]',
    accentHex: '#a855f7',
  },
  'galaxy-brain': {
    pedestalBorder: 'border-indigo-500/40 group-hover:border-indigo-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]',
    accentHex: '#6366f1',
  },
  starstruck: {
    pedestalBorder: 'border-amber-500/40 group-hover:border-amber-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    accentHex: '#eab308',
  },
  'public-sponsor': {
    pedestalBorder: 'border-emerald-500/40 group-hover:border-emerald-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    accentHex: '#10b981',
  },
  'heart-on-your-sleeve': {
    pedestalBorder: 'border-pink-500/40 group-hover:border-pink-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]',
    accentHex: '#ec4899',
  },
  'open-sourcerer': {
    pedestalBorder: 'border-teal-500/40 group-hover:border-teal-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]',
    accentHex: '#14b8a6',
  },
  'arctic-code-vault': {
    pedestalBorder: 'border-sky-500/40 group-hover:border-sky-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]',
    accentHex: '#38bdf8',
  },
};

// ─── Interactive FAQ Component ──────────────────────────────────────────────
interface FAQData {
  id: string;
  q: string;
  a: string;
}

const InteractiveFAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('ban-risk');

  const faqs: FAQData[] = [
    {
      id: 'ban-risk',
      q: 'Could my GitHub account get banned?',
      a: 'No. GitGlow never uses automated bots, scrapers, or tokens. It simply guides you through standard Git commands you run yourself on your own repositories. GitHub awards badges based on native Git webhooks, exactly like everyday commits.',
    },
    {
      id: 'solo-claims',
      q: 'Can I earn badges completely solo?',
      a: 'Yes, 100%. You do not need a team, collaborators, or open-source stars. Badges like Quickdraw, Pull Shark, and Pair Extraordinaire can all be unlocked on personal scratchpad repositories in just a few minutes.',
    },
    {
      id: 'troubleshoot',
      q: "Why didn't my badge appear after merging a PR?",
      a: 'Two common reasons: first, you must merge into your repository’s default branch (main or master). Second, GitHub processes achievements in an asynchronous background queue, so medallions usually take 10 to 30 minutes to appear on your profile.',
    },
    {
      id: 'private-repos',
      q: 'Do private repositories count?',
      a: 'Yes. Private student coursework and university assignments count toward achievements without exposing your code. You only need to check "Include private contributions on my profile" in your GitHub profile settings.',
    },
    {
      id: 'tiers',
      q: 'How do tier multipliers work?',
      a: 'Certain badges like Pull Shark and Pair Extraordinaire level up as your activity increases: Base (2 PRs), Bronze (16 PRs), Silver (128 PRs), and Gold (1,024 PRs). GitGlow guides you through the fastest path to each milestone.',
    },
  ];

  return (
    <section id="faq" className="scroll-mt-24 max-w-2xl mx-auto mb-16 text-left">
      {/* Gentle Header */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#f0f6fc] tracking-tight">
          Frequently asked questions
        </h2>
        <p className="text-xs sm:text-sm text-[#8b949e] max-w-md mx-auto leading-relaxed">
          Quick, clear answers to common questions about claiming verified GitHub badges.
        </p>
      </div>

      {/* Clean Minimalist Accordion */}
      <div className="divide-y divide-[#30363d]/60 rounded-2xl border border-[#30363d] bg-[#161b22]/50 overflow-hidden">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="transition-colors">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full px-5 sm:px-6 py-4 sm:py-4.5 flex items-center justify-between text-left cursor-pointer group gap-4 transition-colors hover:bg-[#21262d]/40"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-medium text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors">
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    'text-[#8b949e] shrink-0 transition-transform duration-200',
                    isOpen && 'rotate-180 text-[#58a6ff]',
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#8b949e] leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
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
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>('quickdraw');
  const [selectedCategory, setSelectedCategory] = useState<string>('starter');
  const [githubInput, setGithubInput] = useState<string>('arivera-dev');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(label);
    setTimeout(() => setCopiedSnippet(null), 2000);
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
      }, 350);
    }
  };

  const filteredBadges = useMemo(() => {
    if (selectedCategory === 'all') return GITHUB_BADGES;
    if (selectedCategory === 'starter') return GITHUB_BADGES.filter((b) => b.isRecommendedStarter);
    if (selectedCategory === 'obtainable') return GITHUB_BADGES.filter((b) => b.isObtainable);
    if (selectedCategory === 'tiers') return GITHUB_BADGES.filter((b) => b.tiers && b.tiers.length > 0);
    if (selectedCategory === 'legacy') return GITHUB_BADGES.filter((b) => !b.isObtainable);
    return GITHUB_BADGES;
  }, [selectedCategory]);

  const activeBadge = useMemo(() => {
    return GITHUB_BADGES.find((b) => b.id === selectedBadgeId) || GITHUB_BADGES[0];
  }, [selectedBadgeId]);

  const activeRecipe = useMemo(() => {
    return (
      BADGE_RECIPES[activeBadge.id] || {
        station1Label: '1. Switch Branch',
        command1: `git switch -c claim/${activeBadge.id}`,
        station2Label: '2. Generate Commit',
        command2: `git commit -m "feat: claim ${activeBadge.name}"`,
        station3Label: '3. Merge PR',
        command3: 'gh pr merge --auto --merge',
        estimatedTime: '5 Minutes',
        isAutomated: true,
        gotchaNote: activeBadge.gotchas[0] || 'Follow standard Git branch conventions.',
      }
    );
  }, [activeBadge]);

  const allActiveCommands = useMemo(() => {
    return `${activeRecipe.command1}\n${activeRecipe.command2}\n${activeRecipe.command3}`;
  }, [activeRecipe]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] pt-20 pb-20 overflow-x-hidden selection:bg-[#d1f34d] selection:text-[#0d1117]">
      
      {/* ─── Upper Navigation Bar ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4 flex items-center justify-between">
        <Link
          to="/blueprints"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8b949e] hover:text-[#58a6ff] transition-colors rounded-lg p-1"
          aria-label="Back to Blueprints collection"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>All Blueprints</span>
        </Link>

        {/* Live Bot Telemetry Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-[11px] font-mono text-[#8b949e]">
          <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" />
          <span>gitglow-sandbox: <strong className="text-[#3fb950] font-bold">online</strong> · 42s avg merge</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── SECTION 1: Hero Section (Placeholder) ─────────────────────────── */}
        <section id="hero" className="py-24 sm:py-32 text-center border-b border-[#30363d]/40 mb-16">
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#58a6ff] bg-[#161b22] px-3 py-1 rounded-full border border-[#30363d]">
              Section 01
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#f0f6fc] tracking-tight">
              Hero Section
            </h1>
            <p className="text-xs sm:text-sm text-[#8b949e]">
              [Reserved for clean hero redesign]
            </p>
          </div>
        </section>

        {/* ─── SECTION 2: Section Two (Placeholder) ─────────────────────────── */}
        <section id="section-2" className="py-24 sm:py-32 text-center border-b border-[#30363d]/40 mb-16">
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#58a6ff] bg-[#161b22] px-3 py-1 rounded-full border border-[#30363d]">
              Section 02
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f0f6fc] tracking-tight">
              Section Two
            </h2>
            <p className="text-xs sm:text-sm text-[#8b949e]">
              [Reserved for badges studio redesign]
            </p>
          </div>
        </section>

        {/* ─── SECTION 3: Visual Proof — Real Medallions vs Cluttered Shields ─── */}
        <section id="compare" className="scroll-mt-24 mb-16 text-left max-w-4xl mx-auto">
          {/* Gentle Header */}
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f0f6fc] tracking-tight">
              Verified proof over vanity
            </h2>
            <p className="text-xs sm:text-sm text-[#8b949e] max-w-lg mx-auto leading-relaxed">
              Why tech leads look for official GitHub profile medallions instead of copy-pasted README shields.
            </p>
          </div>

          {/* Single Unified Comparison Card */}
          <div className="rounded-2xl border border-[#30363d] bg-[#161b22]/50 divide-y md:divide-y-0 md:divide-x divide-[#30363d]/60 grid md:grid-cols-2 overflow-hidden shadow-sm">
            
            {/* Left Box: The Copy-Paste Illusion */}
            <div className="p-6 sm:p-7 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#30363d]/40">
                  <div>
                    <span className="text-[11px] font-mono text-[#8b949e] uppercase tracking-wider block">
                      Vanity metric
                    </span>
                    <h3 className="text-base font-semibold text-[#f0f6fc] mt-0.5">
                      README Markdown Shields
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#8b949e] bg-[#0d1117] border border-[#30363d] px-2 py-0.5 rounded-md">
                    Unverified
                  </span>
                </div>

                {/* Realistic GitHub README File Capsule */}
                <div className="rounded-xl border border-[#30363d] bg-[#010409] overflow-hidden shadow-inner">
                  {/* File Tab Header */}
                  <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-[#30363d]/80 bg-[#161b22] text-xs font-mono text-[#8b949e]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs select-none">📄</span>
                      <span className="text-[#f0f6fc] font-medium truncate">README.md</span>
                    </div>
                    <span className="text-[10px] text-[#8b949e] font-mono shrink-0">preview</span>
                  </div>

                  {/* README Content Canvas with Real Shields */}
                  <div className="p-4 sm:p-5 space-y-3 min-h-[148px] flex flex-col justify-between">
                    <div className="text-[10px] font-mono text-[#8b949e]">// Copy-pasted image shields (0 Git proof)</div>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <img
                        src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"
                        alt="React"
                        className="h-6 rounded object-contain"
                        loading="lazy"
                      />
                      <img
                        src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"
                        alt="TypeScript"
                        className="h-6 rounded object-contain"
                        loading="lazy"
                      />
                      <img
                        src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"
                        alt="Node.js"
                        className="h-6 rounded object-contain"
                        loading="lazy"
                      />
                      <img
                        src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"
                        alt="Python"
                        className="h-6 rounded object-contain"
                        loading="lazy"
                      />
                      <img
                        src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"
                        alt="Docker"
                        className="h-6 rounded object-contain"
                        loading="lazy"
                      />
                      <img
                        src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white"
                        alt="AWS"
                        className="h-6 rounded object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-[#8b949e] leading-relaxed pt-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#8b949e] font-mono text-xs mt-0.5 select-none">—</span>
                  <span>Can be copied and pasted in 30 seconds from online generator templates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8b949e] font-mono text-xs mt-0.5 select-none">—</span>
                  <span>Proves familiarity with markdown image syntax, not real Git workflow skills.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8b949e] font-mono text-xs mt-0.5 select-none">—</span>
                  <span>Hiring managers and senior engineers scroll right past it to commit history.</span>
                </li>
              </ul>
            </div>

            {/* Right Box: Official GitHub Webhook Medallions */}
            <div className="p-6 sm:p-7 space-y-5 bg-[#161b22]/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#30363d]/40">
                  <div>
                    <span className="text-[11px] font-mono text-[#58a6ff] uppercase tracking-wider block">
                      Verifiable proof
                    </span>
                    <h3 className="text-base font-semibold text-[#f0f6fc] mt-0.5">
                      GitHub Profile Medallions
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#3fb950] bg-[#238636]/15 border border-[#238636]/40 px-2 py-0.5 rounded-md font-medium">
                    Server-Verified
                  </span>
                </div>

                {/* Realistic Official Profile Achievements Capsule */}
                <div className="rounded-xl border border-[#30363d] bg-[#010409] overflow-hidden shadow-inner">
                  {/* Profile Header Tab */}
                  <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-[#30363d]/80 bg-[#161b22] text-xs font-mono text-[#8b949e]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs select-none">🏆</span>
                      <span className="text-[#f0f6fc] font-medium truncate">@{scannedUser.login}</span>
                    </div>
                    <span className="text-[10px] text-[#3fb950] font-mono shrink-0 font-medium">achievements</span>
                  </div>

                  {/* Official Medallions Row */}
                  <div className="p-4 sm:p-5 space-y-3 min-h-[148px] flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#8b949e]">
                      <span>// Official GitHub webhooks</span>
                      <span className="text-[#3fb950] font-bold">200 OK</span>
                    </div>
                    <div className="flex items-center gap-2.5 pt-0.5">
                      {[
                        { img: '/images/badges/pull-shark.png', name: 'Pull Shark', tier: 'x2' },
                        { img: '/images/badges/quickdraw.png', name: 'Quickdraw' },
                        { img: '/images/badges/pair-extraordinaire.png', name: 'Pair Extra' },
                        { img: '/images/badges/yolo.png', name: 'YOLO' },
                        { img: '/images/badges/starstruck.png', name: 'Starstruck' },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className="relative group/badge flex flex-col items-center"
                          title={item.name}
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#161b22] border border-[#30363d] p-1.5 flex items-center justify-center hover:border-[#58a6ff] hover:scale-105 transition-all shadow-sm">
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-7 h-7 object-contain select-none"
                              loading="lazy"
                            />
                          </div>
                          {item.tier && (
                            <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-bold bg-[#b86241] text-white px-1 rounded-full border border-[#0d1117] shadow-xs">
                              {item.tier}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-[#c9d1d9] leading-relaxed pt-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#3fb950] font-mono text-xs mt-0.5 select-none">✓</span>
                  <span>Awarded automatically by GitHub server webhooks on real Git events.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3fb950] font-mono text-xs mt-0.5 select-none">✓</span>
                  <span>Stamped directly onto your public GitHub profile header next to your bio.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3fb950] font-mono text-xs mt-0.5 select-none">✓</span>
                  <span>Proves genuine branch hygiene, co-author trailers, and PR etiquette.</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* ─── SECTION 4: Simple, Clear FAQ ─────────────────────────────────── */}
        <InteractiveFAQSection />

        {/* ─── Final Direct Launch Action Ribbon ────────────────────────────── */}
        <section className="rounded-2xl bg-[#161b22] border border-[#30363d] p-6 sm:p-8 text-center space-y-3.5 mb-8">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0d1117] border border-[#30363d] text-[#d1f34d] text-[10px] font-mono font-bold uppercase tracking-wider">
            ⚡ 1-Click Execution
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f0f6fc] tracking-tight">
            Ready to Claim Your First Official GitHub Medallion?
          </h2>
          <p className="text-xs sm:text-sm text-[#8b949e] max-w-md mx-auto leading-relaxed">
            Start with Quickdraw for an instant 120-second win, or advance to Pull Shark 🦈 to begin your tier multipliers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/blueprints/gitglow/engine?badge=quickdraw"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#d1f34d] hover:bg-[#c2e240] text-[#0d1117] font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              Claim Quickdraw (120s) →
            </Link>
            <Link
              to="/blueprints/gitglow/engine?badge=pull-shark"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0d1117] hover:bg-[#21262d] text-[#f0f6fc] border border-[#30363d] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Claim Pull Shark 🦈
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
