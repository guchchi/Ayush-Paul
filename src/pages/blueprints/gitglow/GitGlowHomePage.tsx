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
    <section id="faq" className="scroll-mt-24 max-w-3xl mx-auto mb-20 text-left w-full">
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
  const [inspectedMedal, setInspectedMedal] = useState<{
    name: string;
    tier?: string;
    trigger: string;
  } | null>(null);

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── SECTION 1: Hero (Supaste-Style Grand Centered Layout) ──────── */}
        <section
          id="hero"
          className="relative pt-8 pb-20 sm:pt-12 sm:pb-28 mb-16 overflow-hidden"
        >
          {/* Supaste-Signature Royal Cobalt Ambient Glow (Radiating from under the notch) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 inset-x-0 h-[720px] overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] sm:w-[1300px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0052ff]/30 via-[#002e99]/20 to-transparent blur-[85px]" />
            <div className="absolute top-16 left-1/4 w-[450px] h-[320px] rounded-full bg-[#1e40af]/20 blur-[90px]" />
            <div className="absolute top-16 right-1/4 w-[450px] h-[320px] rounded-full bg-[#2563eb]/20 blur-[90px]" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
              }}
            />
          </div>

          <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center">
            {/* Subtle Blueprints directory breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
              className="mb-6"
            >
              <Link
                to="/blueprints"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-white/20 select-none group"
              >
                <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                <span>All Blueprints</span>
              </Link>
            </motion.div>

            {/* Supaste-Style Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              className="mb-5"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md text-white text-[13px] font-medium tracking-tight shadow-sm">
                <Github size={14} className="text-white fill-current" />
                <span>Official GitHub Profile Medallions</span>
              </div>
            </motion.div>

            {/* Giant Centered Headline (Supaste Exact 2-Line Impact) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.05 }}
              className="space-y-1 sm:space-y-2"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold text-white tracking-[-0.04em] leading-[1.04]">
                Don't just add badges.
              </h1>
              <p className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold tracking-[-0.04em] leading-[1.04] text-white">
                Earn them the right way.
              </p>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-[#94a3b8] max-w-2xl mx-auto leading-relaxed mt-5"
            >
              GitGlow is the verified terminal handbook and engine for developers to unlock, verify, and showcase genuine GitHub profile achievements in minutes.
            </motion.p>

            {/* Supaste-Style Centered CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
            >
              <a
                href="#recipes"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('recipes')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-[46px] px-6 rounded-[12px] bg-white hover:bg-[#f0f0f0] text-black text-sm font-semibold tracking-[-0.01em] inline-flex items-center gap-2 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10 group cursor-pointer"
              >
                <Terminal size={16} className="text-black" />
                <span>Start First Mission</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href="#catalog"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-[46px] px-5 rounded-[12px] bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 hover:border-white/20 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer backdrop-blur-md"
              >
                <Layers size={15} className="text-white/70" />
                <span>Explore 10 Medallions</span>
              </a>
            </motion.div>

            {/* Micro Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5 text-[12px] font-mono text-white/50"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#3fb950]" />
                100% GitHub ToS Compliant
              </span>
              <span className="text-white/20 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#3fb950]" />
                Personal Repo Safe
              </span>
              <span className="text-white/20 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#3fb950]" />
                Permanent Profile Proof
              </span>
            </motion.div>
          </div>

          {/* ── Centerpiece: Supaste-Style macOS Application Mockup Window ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.SLOW, ease: EASING.PREMIUM, delay: 0.25 }}
            className="mt-12 sm:mt-16 w-full max-w-5xl mx-auto"
          >
            <div className="relative rounded-[20px] sm:rounded-[24px] border border-white/15 bg-[#161b22]/90 backdrop-blur-2xl shadow-[0_30px_90px_-20px_rgba(0,82,255,0.35),0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
              {/* macOS Window Topbar */}
              <div className="h-11 px-4 sm:px-5 bg-[#0d1117]/80 border-b border-white/10 flex items-center justify-between select-none">
                {/* Traffic lights */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50" />
                  <span className="ml-3 text-[11px] font-mono text-white/40 hidden sm:inline">
                    GitGlow Desktop · v1.0
                  </span>
                </div>

                {/* Category Pills inside the window matching Supaste */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {[
                    { id: 'all', label: 'All Badges', count: 10 },
                    { id: 'starter', label: 'Starter', count: 4 },
                    { id: 'tiers', label: 'Multi-Tier', count: 4 },
                    { id: 'legacy', label: 'Historic', count: 1 },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(tab.id);
                        document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5",
                        selectedCategory === tab.id
                          ? "bg-white/15 text-white font-semibold"
                          : "text-white/50 hover:text-white/80 hover:bg-white/5"
                      )}
                    >
                      <span>{tab.label}</span>
                      <span className="text-[10px] opacity-60 font-mono">({tab.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Window Content: 6 Rich Visual Cards Grid */}
              <div className="p-4 sm:p-6 bg-[#0d1117]/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {[
                  {
                    id: 'quickdraw',
                    name: 'Quickdraw',
                    tag: 'Starter · 5m',
                    desc: 'Closed an issue or pull request within 5 minutes of opening.',
                    image: '/images/badges/quickdraw.png',
                    status: 'Verified',
                    cmd: 'gh issue close 1',
                  },
                  {
                    id: 'pull-shark',
                    name: 'Pull Shark',
                    tag: 'Tier: Bronze x4',
                    desc: 'Merged 2+ pull requests via Git branch and auto-merge.',
                    image: '/images/badges/pull-shark.png',
                    status: 'Multi-Tier',
                    cmd: 'gh pr merge --auto --merge',
                  },
                  {
                    id: 'pair-extraordinaire',
                    name: 'Pair Extraordinaire',
                    tag: 'Co-Authored · x4',
                    desc: 'Co-authored a commit that was merged into default branch.',
                    image: '/images/badges/pair-extraordinaire.png',
                    status: 'Multi-Tier',
                    cmd: 'Co-authored-by: bot <bot@users...>',
                  },
                  {
                    id: 'galaxy-brain',
                    name: 'Galaxy Brain',
                    tag: 'Community',
                    desc: '2 accepted answers on public repository discussions.',
                    image: '/images/badges/galaxy-brain.png',
                    status: 'Obtainable',
                    cmd: 'gh api graphql -f query="..."',
                  },
                  {
                    id: 'yolo',
                    name: 'YOLO',
                    tag: 'Autonomous',
                    desc: 'Merged a pull request without code review approval.',
                    image: '/images/badges/yolo.png',
                    status: 'Personal Safe',
                    cmd: 'git push origin main',
                  },
                  {
                    id: 'arctic-code-vault',
                    name: 'Arctic Code Vault',
                    tag: 'Historic Program',
                    desc: 'Contributed code preserved in the 2020 Svalbard Vault.',
                    image: '/images/badges/arctic-code-vault.png',
                    status: 'Historic',
                    cmd: 'Archive Snapshot 02/02/2020',
                  },
                ].map((card) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setSelectedBadgeId(card.id);
                      document.getElementById('recipes')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group relative rounded-xl border border-white/10 bg-[#161b22]/70 hover:bg-[#161b22] hover:border-white/20 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                          {card.tag}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#3fb950]">
                          <CheckCircle2 size={12} />
                          {card.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-[#0d1117] border border-white/10 p-1 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                          <img src={card.image} alt={card.name} className="w-9 h-9 object-contain" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white group-hover:text-[#58a6ff] transition-colors">
                            {card.name}
                          </h3>
                          <p className="text-[11px] text-white/60 line-clamp-1 leading-snug">
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <code className="text-[11px] font-mono text-white/40 truncate max-w-[180px]">
                        {card.cmd}
                      </code>
                      <span className="text-[11px] text-[#58a6ff] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        Recipe <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Window Footer Statusbar */}
              <div className="px-5 py-3 bg-[#0d1117]/90 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 font-mono gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" />
                  <span>10 Official Medallions Indexed · 100% Verified Rules</span>
                </div>
                <a
                  href="#catalog"
                  className="text-[#58a6ff] hover:underline flex items-center gap-1"
                >
                  Inspect All In Catalog <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── SECTION 2: The Badges Studio & Interactive Workbench ──────── */}
        <section id="catalog" className="scroll-mt-24 mb-20 text-left w-full">
          {/* Gentle Header */}
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-mono text-[#58a6ff] uppercase tracking-wider font-medium">
              Achievement studio
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f0f6fc] tracking-tight">
              Explore and claim GitHub badges
            </h2>
            <p className="text-xs sm:text-sm text-[#8b949e] max-w-lg mx-auto leading-relaxed">
              Select any official medallion to inspect its server requirements, tier multipliers, and copy verified Git recipes.
            </p>
          </div>

          {/* Muted Filter Tabs */}
          <div className="flex items-center justify-center gap-1.5 p-1 rounded-xl bg-[#161b22] border border-[#30363d] w-fit mx-auto mb-6 flex-wrap">
            {[
              { id: 'starter', label: 'Starter (4)' },
              { id: 'tiers', label: 'Multi-Tier (4)' },
              { id: 'all', label: 'All Badges (10)' },
              { id: 'legacy', label: 'Historic (1)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer select-none active:scale-95',
                  selectedCategory === tab.id
                    ? 'bg-[#21262d] text-[#f0f6fc] shadow-xs border border-[#30363d]'
                    : 'text-[#8b949e] hover:text-[#c9d1d9] border border-transparent'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Medallions Showcase Shelf */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
            {filteredBadges.map((badge) => {
              const isSelected = badge.id === activeBadge.id;
              return (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadgeId(badge.id)}
                  className={cn(
                    'p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all duration-150 cursor-pointer select-none relative group hover:-translate-y-0.5 active:scale-95',
                    isSelected
                      ? 'bg-[#161b22] border-[#58a6ff] shadow-[0_0_15px_rgba(88,166,255,0.14)] ring-1 ring-[#58a6ff]/40'
                      : 'bg-[#161b22]/40 border-[#30363d]/70 hover:border-[#58a6ff]/50 hover:bg-[#161b22]/70'
                  )}
                >
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <img
                      src={badge.image}
                      alt={badge.name}
                      className={cn(
                        'w-10 h-10 object-contain transition-transform duration-200 select-none',
                        isSelected
                          ? 'scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]'
                          : 'group-hover:scale-105 opacity-85'
                      )}
                      loading="lazy"
                    />
                    {badge.tiers && badge.tiers.length > 0 && (
                      <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-bold bg-[#b86241] text-white px-1 rounded-full border border-[#0d1117]">
                        x4
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium truncate w-full',
                      isSelected
                        ? 'text-[#f0f6fc]'
                        : 'text-[#8b949e] group-hover:text-[#c9d1d9]'
                    )}
                  >
                    {badge.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Single Unified Blueprint Card */}
          <div className="rounded-2xl border border-[#30363d] bg-[#161b22]/50 divide-y md:divide-y-0 md:divide-x divide-[#30363d]/60 grid md:grid-cols-12 overflow-hidden shadow-sm">
            {/* Left: Badge Identity & Verification Rules (5 cols) */}
            <div className="md:col-span-5 p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Badge Header Bar */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#30363d]/40">
                  <div>
                    <span className="text-[11px] font-mono text-[#58a6ff] uppercase tracking-wider block">
                      {activeBadge.category}
                    </span>
                    <h3 className="text-lg font-semibold text-[#f0f6fc] mt-0.5">
                      {activeBadge.name}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-mono px-2 py-0.5 rounded-md font-medium shrink-0',
                      activeBadge.isObtainable
                        ? 'text-[#3fb950] bg-[#238636]/15 border border-[#238636]/40'
                        : 'text-[#8b949e] bg-[#0d1117] border border-[#30363d]'
                    )}
                  >
                    {activeBadge.difficulty}
                  </span>
                </div>

                {/* 3D Showcase Pedestal */}
                <div className="rounded-xl border border-[#30363d]/80 bg-[#0d1117] p-4 flex items-center gap-3.5 shadow-inner">
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center rounded-xl bg-[#161b22] border border-[#30363d] p-1.5 shadow-sm">
                    <img
                      src={activeBadge.image}
                      alt={activeBadge.name}
                      className="w-10 h-10 object-contain select-none"
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="text-xs font-semibold text-[#f0f6fc] leading-snug">
                      {activeBadge.tagline}
                    </div>
                    <div className="text-[11px] font-mono text-[#8b949e]">
                      Est. time:{' '}
                      <span className="text-[#c9d1d9]">
                        {activeRecipe.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* GitHub Verification Rule */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-semibold text-[#f0f6fc] block">
                    How GitHub Verifies This:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#8b949e] leading-relaxed">
                    {activeBadge.requirements.slice(0, 3).map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#3fb950] font-mono text-xs mt-0.5 select-none">
                          ✓
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Multi-Tier Multipliers (if available) */}
                {activeBadge.tiers && activeBadge.tiers.length > 0 && (
                  <div id="tiers" className="scroll-mt-28 pt-2 border-t border-[#30363d]/30">
                    <span className="text-[11px] font-mono text-[#8b949e] uppercase tracking-wider block mb-2">
                      Tier Multipliers
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                      {activeBadge.tiers.map((tier) => (
                        <div
                          key={tier.level}
                          className="px-2 py-1 rounded bg-[#0d1117] border border-[#30363d]/60 flex items-center justify-between text-[#8b949e]"
                        >
                          <span className="truncate">{tier.level}</span>
                          <span className="text-[#f0f6fc] font-bold shrink-0">
                            {tier.threshold}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: 3-Step Git Blueprint & Commands (7 cols) */}
            <div id="recipes" className="scroll-mt-28 md:col-span-7 p-6 sm:p-7 bg-[#161b22]/30 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Recipe Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#30363d]/40">
                  <div>
                    <span className="text-[11px] font-mono text-[#58a6ff] uppercase tracking-wider block">
                      Blueprint recipe
                    </span>
                    <h3 className="text-base font-semibold text-[#f0f6fc] mt-0.5">
                      Step-by-Step Git Commands
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#8b949e] bg-[#0d1117] border border-[#30363d] px-2 py-0.5 rounded-md">
                    Personal Repo Safe
                  </span>
                </div>

                {/* 3 Numbered Steps with 1-Click Copy */}
                <div className="space-y-3">
                  {[
                    {
                      label: activeRecipe.station1Label,
                      cmd: activeRecipe.command1,
                    },
                    {
                      label: activeRecipe.station2Label,
                      cmd: activeRecipe.command2,
                    },
                    {
                      label: activeRecipe.station3Label,
                      cmd: activeRecipe.command3,
                    },
                  ].map((step, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <span className="text-xs font-semibold text-[#c9d1d9] block">
                        {step.label}
                      </span>
                      <div className="group/cmd rounded-xl border border-[#30363d]/80 bg-[#0d1117] px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-inner">
                        <code className="font-mono text-xs text-[#58a6ff] truncate">
                          {step.cmd}
                        </code>
                        <button
                          onClick={() =>
                            handleCopy(step.cmd, `${activeBadge.id}-${idx}`)
                          }
                          className="shrink-0 text-xs text-[#8b949e] hover:text-[#f0f6fc] px-2 py-1 rounded bg-[#161b22] border border-[#30363d] transition-all flex items-center gap-1 cursor-pointer select-none"
                          title="Copy command"
                        >
                          {copiedSnippet === `${activeBadge.id}-${idx}` ? (
                            <>
                              <Check size={12} className="text-[#3fb950]" />
                              <span className="text-[#3fb950] text-[11px] font-mono">
                                Copied
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span className="text-[11px] font-mono">
                                Copy
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gotcha Callout */}
              <div className="rounded-xl border border-[#30363d]/60 bg-[#0d1117]/60 p-3.5 flex items-start gap-2.5 text-xs text-[#8b949e] leading-relaxed">
                <Info size={15} className="text-[#58a6ff] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#c9d1d9]">Anti-Mistake Gotcha:</strong>{' '}
                  {activeRecipe.gotchaNote || activeBadge.gotchas[0]}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: Visual Proof — Real Medallions vs Cluttered Shields ─── */}
        <section id="compare" className="scroll-mt-24 mb-20 text-left w-full">
          {/* Gentle Header */}
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-mono text-[#58a6ff] uppercase tracking-wider font-medium">
              Proof over vanity
            </span>
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

                {/* Clean Visual Showcase Canvas */}
                <div className="rounded-xl border border-[#30363d]/80 bg-[#0d1117] p-4 sm:p-5 space-y-3 shadow-inner">
                  <div className="text-[11px] text-[#8b949e] flex items-center justify-between border-b border-[#30363d]/40 pb-2">
                    <span className="font-medium text-[#f0f6fc]">Static Image Shields</span>
                    <span className="font-mono text-[10px] text-[#8b949e]">img.shields.io</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center pt-1 min-h-[52px]">
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
                  <div className="h-5 flex items-center text-[11px] font-mono text-[#8b949e] border-t border-[#30363d]/20 pt-2">
                    <span>Self-reported image URLs · 0 Git webhooks</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-[#8b949e] leading-relaxed pt-2">
                <li className="flex items-start gap-2">
                  <XCircle size={14} className="text-[#f85149] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Can be copied and pasted in 30 seconds from online generator templates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={14} className="text-[#f85149] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Proves familiarity with markdown image syntax, not real Git workflow skills.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={14} className="text-[#f85149] shrink-0 mt-0.5" aria-hidden="true" />
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
                  <span className="text-[10px] font-mono text-[#3fb950] bg-[#238636]/15 border border-[#238636]/40 px-2 py-0.5 rounded-md font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span>
                    Server-Verified
                  </span>
                </div>

                {/* Clean Visual Showcase Canvas */}
                <div className="rounded-xl border border-[#30363d]/80 bg-[#0d1117] p-4 sm:p-5 space-y-3 shadow-inner">
                  <div className="text-[11px] text-[#8b949e] flex items-center justify-between border-b border-[#30363d]/40 pb-2">
                    <span className="font-medium text-[#f0f6fc]">Official Profile Achievements</span>
                    <span className="font-mono text-[10px] text-[#3fb950]">github.com/profile</span>
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3 pt-1 min-h-[52px]">
                    {[
                      {
                        name: 'Pull Shark',
                        tier: 'x2',
                        img: '/images/badges/pull-shark.png',
                        trigger: 'Merged 2 pull requests on default branch',
                      },
                      {
                        name: 'Quickdraw',
                        img: '/images/badges/quickdraw.png',
                        trigger: 'Closed an issue/PR within 5 min of opening',
                      },
                      {
                        name: 'Pair Extraordinaire',
                        img: '/images/badges/pair-extraordinaire.png',
                        trigger: 'Co-authored a commit with Git trailer',
                      },
                      {
                        name: 'YOLO',
                        img: '/images/badges/yolo.png',
                        trigger: 'Merged a pull request without code review',
                      },
                      {
                        name: 'Starstruck',
                        img: '/images/badges/starstruck.png',
                        trigger: 'Created a repository that earned stars',
                      },
                    ].map((item) => (
                      <div
                        key={item.name}
                        onMouseEnter={() => setInspectedMedal(item)}
                        onMouseLeave={() => setInspectedMedal(null)}
                        onClick={() =>
                          setInspectedMedal(
                            inspectedMedal?.name === item.name ? null : item
                          )
                        }
                        className="relative group/badge flex items-center justify-center w-11 h-11 rounded-xl bg-[#161b22] border border-[#30363d] p-1.5 shadow-sm hover:border-[#58a6ff] hover:scale-105 transition-all cursor-pointer select-none"
                        title={`${item.name}${item.tier ? ` (${item.tier})` : ''}: ${item.trigger}`}
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-7 h-7 sm:w-8 sm:h-8 object-contain select-none"
                          loading="lazy"
                        />
                        {item.tier && (
                          <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-bold bg-[#b86241] text-white px-1 rounded-full border border-[#0d1117] shadow-xs">
                            {item.tier}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="h-5 flex items-center text-[11px] font-mono overflow-hidden border-t border-[#30363d]/20 pt-2">
                    {inspectedMedal ? (
                      <span className="text-[#58a6ff] truncate">
                        <span className="font-semibold text-[#f0f6fc]">
                          {inspectedMedal.name}
                          {inspectedMedal.tier ? ` ${inspectedMedal.tier}` : ''}:
                        </span>{' '}
                        {inspectedMedal.trigger}
                      </span>
                    ) : (
                      <span className="text-[#8b949e]">
                        Hover any medal to inspect verified Git trigger
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-[#c9d1d9] leading-relaxed pt-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#3fb950] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Awarded automatically by GitHub server webhooks on real Git events.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#3fb950] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Stamped directly onto your public GitHub profile header next to your bio.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#3fb950] shrink-0 mt-0.5" aria-hidden="true" />
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
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#d1f34d] hover:bg-[#c2e240] text-[#0d1117] font-bold text-xs uppercase tracking-wider transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-sm hover:shadow-[0_4px_20px_rgba(209,243,77,0.25)] cursor-pointer"
            >
              Claim Quickdraw (120s) →
            </Link>
            <Link
              to="/blueprints/gitglow/engine?badge=pull-shark"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0d1117] hover:bg-[#21262d] text-[#f0f6fc] border border-[#30363d] font-bold text-xs uppercase tracking-wider transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] hover:border-[#58a6ff] cursor-pointer"
            >
              Claim Pull Shark 🦈
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
