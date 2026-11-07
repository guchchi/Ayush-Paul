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

        {/* ─── SECTION 1: High-Signal Command Header & Profile Scanner ──────── */}
        <section id="overview" className="mb-10 text-left">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#30363d]">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#161b22] border border-[#30363d] text-[#58a6ff] text-[11px] font-mono font-bold uppercase tracking-wider">
                <Sparkles size={11} className="text-[#58a6ff]" />
                <span>Developer Achievement Workbench</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#f0f6fc] leading-tight">
                Audit GitHub Profile. <br />
                <span className="text-[#58a6ff]">Claim Missing Achievements In-Place.</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#8b949e] leading-relaxed max-w-xl">
                Recruiters ignore markdown badges. Select any official GitHub achievement below to inspect its exact git commands, gotchas, and 1-click sandbox recipe.
              </p>
            </div>

            {/* Quick Profile Scanner Input */}
            <div className="w-full lg:w-auto lg:min-w-[420px] space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleScan();
                }}
                className="flex items-center p-1.5 rounded-xl bg-[#161b22] border border-[#30363d] focus-within:border-[#58a6ff] focus-within:ring-2 focus-within:ring-[#58a6ff]/20 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2 px-2.5 py-1 flex-1 min-w-0 bg-[#0d1117] rounded-lg border border-[#30363d]/60">
                  <Github size={16} className="text-[#8b949e] shrink-0" />
                  <span className="font-mono text-xs text-[#8b949e] select-none">
                    github.com/
                  </span>
                  <input
                    type="text"
                    value={githubInput}
                    onChange={(e) => setGithubInput(e.target.value)}
                    placeholder="username"
                    className="w-full bg-transparent font-mono text-xs text-[#f0f6fc] placeholder:text-[#8b949e]/60 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isScanning}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 ml-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-70 shrink-0 cursor-pointer"
                >
                  {isScanning ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <>
                      <Zap size={13} className="text-[#d1f34d]" />
                      <span>Audit</span>
                    </>
                  )}
                </button>
              </form>

              {/* Demo Chips */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                <span className="text-[#8b949e] font-mono text-[10px]">Try:</span>
                {['shadcn', 'torvalds', 'gaearon', 'arivera-dev'].map((demo) => (
                  <button
                    key={demo}
                    type="button"
                    onClick={() => {
                      setGithubInput(demo);
                      handleScan(demo);
                    }}
                    className="px-2 py-0.5 rounded bg-[#161b22] hover:bg-[#21262d] text-[#c9d1d9] hover:text-[#f0f6fc] font-mono text-[11px] border border-[#30363d] transition-colors cursor-pointer"
                  >
                    @{demo}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scanned Profile Banner */}
          <div className="mt-4 p-3.5 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={scannedUser.avatar_url}
                alt={scannedUser.login}
                className="w-9 h-9 rounded-full border border-[#30363d] object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#f0f6fc]">{scannedUser.name}</span>
                  <a
                    href={`https://github.com/${scannedUser.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[#8b949e] hover:text-[#58a6ff] inline-flex items-center gap-0.5 transition-colors"
                  >
                    <span>@{scannedUser.login}</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#8b949e]">
                  <span>{scannedUser.public_repos} public repos</span>
                  <span>·</span>
                  <span>{scannedUser.followers} followers</span>
                  <span>·</span>
                  <span className="text-[#3fb950] font-sans font-semibold">
                    {scannedUser.statusMessage || 'Verified Profile'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Fast-Track Action */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] block">
                  Starter Badges Status
                </span>
                <span className="text-xs font-bold text-[#f85149]">
                  0 / 4 Unlocked · Ready to Claim
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedBadgeId('quickdraw');
                  setSelectedCategory('starter');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#d1f34d] hover:bg-[#c2e240] text-[#0d1117] font-extrabold text-xs tracking-wide transition-all shadow-xs cursor-pointer"
              >
                ⚡ Fast-Track: Quickdraw (120s)
              </button>
            </div>
          </div>
        </section>

        {/* ─── SECTION 2: The Core Developer Workbench (2-Pane Studio) ──────── */}
        <section id="catalog" className="mb-14 text-left">
          
          {/* Workbench Header & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-[#58a6ff]" />
              <h2 className="text-lg font-bold text-[#f0f6fc] tracking-tight">
                Achievement Catalog & Recipe Console
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="inline-flex items-center p-1 rounded-xl bg-[#161b22] border border-[#30363d] gap-1 flex-wrap">
              {[
                { id: 'starter', label: '⚡ Quick Claims (4)' },
                { id: 'obtainable', label: 'Obtainable (7)' },
                { id: 'tiers', label: '🏆 Multi-Tier (4)' },
                { id: 'all', label: 'All 10 Badges' },
                { id: 'legacy', label: '🔒 Historic (1)' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedCategory(filter.id)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                    selectedCategory === filter.id
                      ? 'bg-[#58a6ff] text-[#0d1117]'
                      : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]',
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2-Column Split Workbench */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* ─── LEFT PANE: High-Density Interactive Badge Shelf (7 cols) ─── */}
            <div className="lg:col-span-7 space-y-2.5">
              {filteredBadges.map((badge) => {
                const isSelected = badge.id === selectedBadgeId;
                const theme = BADGE_THEMES[badge.id] || {
                  pedestalBorder: 'border-[#30363d]',
                  glow: '',
                  accentHex: '#58a6ff',
                };
                const recipe = BADGE_RECIPES[badge.id];

                return (
                  <div
                    key={badge.id}
                    onClick={() => setSelectedBadgeId(badge.id)}
                    className={cn(
                      'group relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4',
                      isSelected
                        ? 'bg-[#161b22] border-[#58a6ff] ring-1 ring-[#58a6ff]/40 shadow-lg'
                        : 'bg-[#161b22]/70 border-[#30363d] hover:bg-[#161b22] hover:border-[#30363d] hover:border-neutral-500',
                    )}
                  >
                    {/* Left: Badge Emblem on Recessed Pedestal */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={cn(
                          'relative w-12 h-12 rounded-xl p-1.5 flex items-center justify-center bg-[#0d1117] border shrink-0 transition-all duration-200',
                          theme.pedestalBorder,
                          isSelected && 'border-[#58a6ff]',
                        )}
                      >
                        <img
                          src={badge.image}
                          alt={badge.name}
                          className="w-9 h-9 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] select-none"
                          loading="lazy"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={cn(
                              'text-sm font-bold tracking-tight truncate',
                              isSelected ? 'text-[#58a6ff]' : 'text-[#f0f6fc] group-hover:text-white',
                            )}
                          >
                            {badge.name}
                          </h3>
                          {badge.isRecommendedStarter && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-[#d1f34d]/15 text-[#d1f34d] border border-[#d1f34d]/30">
                              Starter
                            </span>
                          )}
                          {badge.status === 'testing' && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              Beta
                            </span>
                          )}
                          {!badge.isObtainable && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                              Archived
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#8b949e] truncate max-w-sm mt-0.5">
                          {badge.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Right: Metadata & Select Indicator */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex flex-col items-end text-right">
                        <span className="text-[10px] font-mono text-[#8b949e]">
                          {recipe?.estimatedTime || badge.difficulty}
                        </span>
                        {badge.tiers && badge.tiers.length > 0 ? (
                          <span className="text-[10px] font-mono text-[#f9bfa7]">
                            4 Tiers Multiplier
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#8b949e]">Single Unlock</span>
                        )}
                      </div>

                      <div
                        className={cn(
                          'w-7 h-7 rounded-lg flex items-center justify-center border transition-all',
                          isSelected
                            ? 'bg-[#58a6ff] text-[#0d1117] border-[#58a6ff]'
                            : 'bg-[#0d1117] text-[#8b949e] border-[#30363d] group-hover:text-white group-hover:border-[#8b949e]',
                        )}
                      >
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ─── RIGHT PANE: Live Recipe Inspector (5 cols - Sticky) ───────── */}
            <div className="lg:col-span-5 sticky top-20">
              <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 sm:p-6 shadow-2xl space-y-5">
                
                {/* Active Badge Header */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#30363d]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#0d1117] border border-[#30363d] p-2 flex items-center justify-center shrink-0">
                      <img
                        src={activeBadge.image}
                        alt={activeBadge.name}
                        className="w-10 h-10 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-[#f0f6fc]">
                          {activeBadge.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0d1117] text-[#58a6ff] border border-[#30363d]">
                          {activeRecipe.estimatedTime}
                        </span>
                      </div>
                      <p className="text-xs text-[#8b949e] mt-0.5 leading-snug">
                        {activeBadge.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Strategy Note */}
                <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs leading-relaxed text-[#c9d1d9]">
                  <span className="font-bold text-[#f0f6fc]">Sandbox Blueprint: </span>
                  <span className="text-[#8b949e]">{activeBadge.blueprintStrategy}</span>
                </div>

                {/* Live Copyable Git Commands Terminal */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#8b949e]">
                    <span className="flex items-center gap-1.5 text-[#3fb950] font-bold">
                      <Terminal size={12} /> Execution Commands:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(allActiveCommands, 'all')}
                      className="text-[11px] text-[#58a6ff] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSnippet === 'all' ? (
                        <>
                          <Check size={11} className="text-[#3fb950]" />
                          <span className="text-[#3fb950]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy All</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    {/* Command 1 */}
                    <div className="p-2.5 rounded-lg bg-[#010409] border border-[#30363d] flex items-center justify-between gap-2 group">
                      <div className="flex items-center gap-2 overflow-x-auto select-all">
                        <span className="text-[#3fb950] select-none">$</span>
                        <span className="text-[#c9d1d9]">{activeRecipe.command1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeRecipe.command1, 'cmd1')}
                        className="text-[#8b949e] hover:text-white shrink-0 p-1 rounded hover:bg-[#21262d] transition-colors cursor-pointer"
                        title="Copy command"
                      >
                        {copiedSnippet === 'cmd1' ? (
                          <Check size={12} className="text-[#3fb950]" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>

                    {/* Command 2 */}
                    <div className="p-2.5 rounded-lg bg-[#010409] border border-[#30363d] flex items-center justify-between gap-2 group">
                      <div className="flex items-center gap-2 overflow-x-auto select-all">
                        <span className="text-[#3fb950] select-none">$</span>
                        <span className="text-[#c9d1d9]">{activeRecipe.command2}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeRecipe.command2, 'cmd2')}
                        className="text-[#8b949e] hover:text-white shrink-0 p-1 rounded hover:bg-[#21262d] transition-colors cursor-pointer"
                        title="Copy command"
                      >
                        {copiedSnippet === 'cmd2' ? (
                          <Check size={12} className="text-[#3fb950]" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>

                    {/* Command 3 */}
                    <div className="p-2.5 rounded-lg bg-[#010409] border border-[#30363d] flex items-center justify-between gap-2 group">
                      <div className="flex items-center gap-2 overflow-x-auto select-all">
                        <span className="text-[#3fb950] select-none">$</span>
                        <span className="text-[#c9d1d9]">{activeRecipe.command3}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeRecipe.command3, 'cmd3')}
                        className="text-[#8b949e] hover:text-white shrink-0 p-1 rounded hover:bg-[#21262d] transition-colors cursor-pointer"
                        title="Copy command"
                      >
                        {copiedSnippet === 'cmd3' ? (
                          <Check size={12} className="text-[#3fb950]" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gotcha Notice */}
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-[11px] text-[#8b949e]">
                  <Info size={13} className="text-[#58a6ff] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#f0f6fc]">Technical gotcha: </strong>
                    {activeRecipe.gotchaNote}
                  </span>
                </div>

                {/* Tier Multiplier Evolution Bar (if tiers exist) */}
                {activeBadge.tiers && activeBadge.tiers.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8b949e] block">
                      Tier Multiplier Milestones:
                    </span>
                    <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                      <div className="p-1 rounded bg-[#161b22] border border-[#30363d]">
                        <span className="text-[#8b949e] block text-[9px]">Base</span>
                        <span className="text-[#f0f6fc] font-bold">2 PRs</span>
                      </div>
                      <div className="p-1 rounded bg-[#161b22] border border-[#b86241]/40">
                        <span className="text-[#f9bfa7] block text-[9px]">Bronze</span>
                        <span className="text-[#f0f6fc] font-bold">16 PRs</span>
                      </div>
                      <div className="p-1 rounded bg-[#161b22] border border-[#e1e4e4]/40">
                        <span className="text-[#e1e4e4] block text-[9px]">Silver</span>
                        <span className="text-[#f0f6fc] font-bold">128 PRs</span>
                      </div>
                      <div className="p-1 rounded bg-[#161b22] border border-[#fae57e]/40">
                        <span className="text-[#fae57e] block text-[9px]">Gold</span>
                        <span className="text-[#f0f6fc] font-bold">1,024</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Direct Action Trigger */}
                <div>
                  {activeBadge.isObtainable ? (
                    <Link
                      to={`/blueprints/gitglow/engine?badge=${activeBadge.id}&user=${scannedUser.login}`}
                      className="w-full py-3 px-4 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <span>Launch Sandbox Claim ({activeBadge.name})</span>
                      <ArrowRight size={13} />
                    </Link>
                  ) : (
                    <div className="w-full py-3 px-4 rounded-xl bg-[#0d1117] text-[#8b949e] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#30363d] cursor-not-allowed">
                      <Lock size={12} />
                      <span>{activeBadge.status === 'testing' ? 'In GitHub Beta Cluster' : 'Archived Milestone'}</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

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
            <div className="p-6 sm:p-7 space-y-4">
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

              {/* Mockup of Cluttered README */}
              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d]/60 space-y-2 font-mono text-xs">
                <div className="text-[#8b949e] text-[10px]">// README.md (copy-paste shields)</div>
                <div className="flex flex-wrap gap-1.5 opacity-60">
                  {['React', 'NodeJS', 'Python', 'Docker', 'AWS', 'MongoDB', 'Git', 'Linux'].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-[#21262d] text-[#8b949e] text-[10px] border border-[#30363d]">
                      {tag}-v20
                    </span>
                  ))}
                </div>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-[#8b949e] leading-relaxed">
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
            <div className="p-6 sm:p-7 space-y-4 bg-[#161b22]/30">
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

              {/* Mockup of Official Profile Header Medallions */}
              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d]/60 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-[#8b949e] text-[10px]">
                  <span>// github.com/{scannedUser.login}</span>
                  <span className="text-[#3fb950]">Achievements</span>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { img: '/images/badges/pull-shark.png', name: 'Pull Shark' },
                    { img: '/images/badges/quickdraw.png', name: 'Quickdraw' },
                    { img: '/images/badges/yolo.png', name: 'YOLO' },
                    { img: '/images/badges/pair-extraordinaire.png', name: 'Pair Extra' },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="w-9 h-9 rounded-lg bg-[#161b22] border border-[#30363d] p-1 flex items-center justify-center hover:border-[#58a6ff]/60 transition-colors"
                      title={item.name}
                    >
                      <img src={item.img} alt={item.name} className="w-6 h-6 object-contain select-none" />
                    </div>
                  ))}
                  <span className="text-[11px] text-[#3fb950] font-sans font-medium pl-1">✓ Permanent</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-[#c9d1d9] leading-relaxed">
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
