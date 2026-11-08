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
  GitFork,
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
  Rocket,
  TrendingUp,
  Star,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DURATION, EASING } from '../../../lib/motion-presets';
import { GITHUB_BADGES, GitHubBadge } from '../../../data/gitglow/github-badges';

const AppleLogo = ({ className = "w-4 h-4 fill-current" }: { className?: string }) => (
  <svg viewBox="0 0 170 170" className={className} fill="currentColor">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.79-11.71-14.24-5.74-9.04-10.23-19.16-13.48-30.34-3.26-11.19-4.89-21.9-4.89-32.16 0-14.39 3.53-26.33 10.59-35.81 7.06-9.48 16.03-14.34 26.91-14.59 4.93.07 10.15 1.25 15.65 3.54 5.51 2.29 9.38 3.51 11.61 3.67 1.83-.16 5.86-1.42 12.08-3.79 6.23-2.37 11.62-3.41 16.18-3.14 12.23.63 21.84 5.14 28.84 13.53-10.89 6.64-16.22 15.86-16 27.66.24 9.16 3.73 16.89 10.47 23.2 6.74 6.31 14.78 9.92 24.12 10.83-2.02 6.27-4.45 12.57-7.29 18.91zM119.22 31.84c0-7.39 2.66-14.39 7.98-21.01 5.32-6.62 11.79-10.55 19.41-11.83.18 1.04.27 2.08.27 3.12 0 7.39-2.73 14.53-8.19 21.43-5.46 6.9-12 10.74-19.63 11.52-.28-1.07-.42-2.14-.42-3.23z" />
  </svg>
);

const MicrosoftLogo = ({ className = "w-3.5 h-3.5 fill-current" }: { className?: string }) => (
  <svg viewBox="0 0 21 21" className={className} fill="currentColor">
    <rect x="1" y="1" width="9" height="9" />
    <rect x="11" y="1" width="9" height="9" />
    <rect x="1" y="11" width="9" height="9" />
    <rect x="11" y="11" width="9" height="9" />
  </svg>
);

const GoogleLogo = ({ className = "w-3.5 h-3.5 fill-current" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

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
      {/* Gentle Header with Home-Page Theme */}
      <div className="text-center space-y-2 mb-8 select-none">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-2xs w-fit inline-block mb-3">
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
          Frequently asked questions
        </h2>
        <p className="text-xs sm:text-sm text-[#424754] max-w-md mx-auto font-medium leading-relaxed">
          Quick, clear answers to common questions about claiming verified GitHub badges.
        </p>
      </div>

      {/* Clean Minimalist Accordion */}
      <div className="divide-y divide-slate-200/90 rounded-[24px] border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="transition-colors">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full px-6 py-4.5 sm:py-5 flex items-center justify-between text-left cursor-pointer group gap-4 transition-colors hover:bg-[#f8f9ff]"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-bold text-[#0b1c30] group-hover:text-[#0058be] transition-colors">
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    'text-slate-400 shrink-0 transition-transform duration-200',
                    isOpen && 'rotate-180 text-[#0058be]',
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
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#424754] font-medium leading-relaxed">
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
  const [badgeSearchQuery, setBadgeSearchQuery] = useState<string>('');
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
    let list = GITHUB_BADGES;
    if (selectedCategory === 'starter') list = list.filter((b) => b.isRecommendedStarter);
    else if (selectedCategory === 'obtainable') list = list.filter((b) => b.isObtainable);
    else if (selectedCategory === 'tiers') list = list.filter((b) => b.tiers && b.tiers.length > 0);
    else if (selectedCategory === 'legacy') list = list.filter((b) => !b.isObtainable);

    if (badgeSearchQuery.trim()) {
      const q = badgeSearchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.tagline.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, badgeSearchQuery]);

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
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] overflow-x-hidden selection:bg-[#d1f34d] selection:text-[#0b1c30]">

      {/* ─── SECTION 1: GitGlow Modern Developer Hero (Matching Official Reference) ─── */}
      <section
        id="hero"
        className="relative w-full pt-28 pb-16 sm:pt-32 sm:pb-24 bg-[#ffffff] text-[#161b22] overflow-hidden border-b border-slate-200/80"
      >
        {/* Subtle, Crisp Architectural Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden select-none"
        >
          {/* Subtle Grid Lines Overlay */}
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                'linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)',
              backgroundSize: '44px 44px',
              maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 90%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 90%)',
            }}
          />

          {/* Top-Left Architectural Concentric Arc Contours */}
          <svg
            viewBox="0 0 500 500"
            className="absolute -top-32 -left-32 w-[520px] h-[520px] pointer-events-none opacity-40"
            fill="none"
          >
            <circle cx="160" cy="160" r="160" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="160" cy="160" r="240" stroke="#e2e8f0" strokeWidth="0.8" />
            <circle cx="160" cy="160" r="320" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 3" />
          </svg>

          {/* Right Side: Organic Lime Glow Aura (Matching Reference) */}
          <div className="absolute top-12 right-6 sm:right-16 w-[420px] sm:w-[520px] h-[360px] sm:h-[420px] rounded-[70px] bg-[#eaf8c9]/75 transform rotate-12 blur-[10px]" />

          {/* Right Side: Neutral Circular Base Plate */}
          <div className="absolute top-8 right-4 sm:right-12 w-[220px] h-[220px] rounded-full bg-[#f1f3f5] opacity-80" />

          {/* Large Soft Green Octocat Silhouette Watermark */}
          <div className="absolute top-12 right-20 sm:right-32 w-[160px] h-[160px] pointer-events-none">
            <svg viewBox="0 0 98 96" className="w-full h-full text-[#bbf7d0] fill-current opacity-70" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.215-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
            </svg>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Subtle Blueprints directory breadcrumb */}
          <div className="mb-6 sm:mb-8">
            <Link
              to="/blueprints"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-[#161b22] transition-colors px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs select-none group"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>All Blueprints</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* ── LEFT: Copy & CTAs (6 cols) ── */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Eyebrow Pill with GitHub Icon */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eaf8c9] border border-[#cdeca4] text-[#161b22] text-xs font-semibold select-none shadow-2xs">
                  <Github size={15} className="text-[#161b22] fill-current" />
                  <span>Build. Contribute. Earn. &rarr;</span>
                </div>
              </motion.div>

              {/* Bold Headline (Matching reference color breakdown) */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.06 }}
              >
                <h1 className="text-5xl sm:text-6xl lg:text-[68px] xl:text-[74px] font-extrabold text-[#161b22] tracking-[-0.035em] leading-[1.06]">
                  Earn your GitHub <br />
                  achievements. <br />
                  <span className="text-[#48b82a]">By doing </span>
                  <span className="text-[#161b22]">the work.</span>
                </h1>
              </motion.div>

              {/* Description Body */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.12 }}
                className="text-[#57606a] text-base sm:text-lg lg:text-[18px] leading-relaxed max-w-[490px] font-normal"
              >
                Complete real missions, make meaningful contributions, and build a profile that truly stands out.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.18 }}
                className="flex items-center flex-wrap gap-4 pt-1"
              >
                <a
                  href="#recipes"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('recipes')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="h-[48px] px-7 rounded-full bg-[#161b22] hover:bg-[#24292f] text-white text-sm font-semibold inline-flex items-center gap-2 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-md group cursor-pointer"
                  aria-label="Explore interactive GitHub achievement missions"
                >
                  <span>Explore Missions</span>
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="#recipe-terminal"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('recipe-terminal');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                      el.classList.add('ring-4', 'ring-[#d1f34d]', 'shadow-xl');
                      setTimeout(() => el.classList.remove('ring-4', 'ring-[#d1f34d]', 'shadow-xl'), 2500);
                    } else {
                      document.getElementById('recipes')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="h-[48px] px-6 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-[#161b22] text-sm font-semibold inline-flex items-center gap-2.5 transition-all duration-150 shadow-2xs group cursor-pointer"
                  aria-label="Learn how GitGlow works and view step-by-step commands"
                >
                  <span className="w-6 h-6 rounded-full bg-[#161b22] flex items-center justify-center transition-transform group-hover:scale-105">
                    <Play size={10} className="fill-white text-white ml-0.5" />
                  </span>
                  <span>How it works</span>
                </a>
              </motion.div>

              {/* Compact Feature Row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.24 }}
                className="flex items-center flex-wrap gap-4 sm:gap-6 pt-6 text-xs sm:text-[13px] font-semibold text-[#161b22]"
              >
                <div className="flex items-center gap-2">
                  <Rocket size={16} className="text-[#161b22]" />
                  <span>Real Missions</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-[#161b22]" />
                  <span>Verified Badges</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#161b22]" />
                  <span>Track Progress</span>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT: 3D Achievement Showcase & Social Proof (6 cols) ── */}
            <div className="lg:col-span-6 relative flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: DURATION.SLOW, ease: EASING.PREMIUM, delay: 0.15 }}
                className="relative h-[360px] sm:h-[400px] w-full flex items-center justify-center select-none"
              >
                {/* Looping Lime Curved Path Filament */}
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
                  viewBox="0 0 520 400"
                  fill="none"
                >
                  <path
                    d="M 60 260 C 20 280, 20 200, 100 130 C 180 60, 420 50, 480 140 C 520 200, 490 280, 430 310"
                    stroke="#7ccf32"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeDasharray="400 0"
                    opacity="0.85"
                  />
                </svg>

                {/* 3D Tilted Achievements Dashboard Card */}
                <motion.div
                  whileHover={{ scale: 1.02, rotateY: -6, rotateX: 6 }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 w-full max-w-[490px] rounded-[26px] bg-[#161b22] border border-white/10 shadow-[0_24px_50px_-10px_rgba(0,0,0,0.5),0_10px_20px_-5px_rgba(0,0,0,0.3)] p-4 sm:p-5 overflow-hidden cursor-pointer"
                  style={{
                    transform: 'perspective(1200px) rotateY(-8deg) rotateX(10deg) rotateZ(-2.5deg)',
                  }}
                >
                  {/* Specular gloss top reflection */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none rounded-[inherit]" />

                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
                    <div className="flex items-center gap-2">
                      <Github size={18} className="text-white fill-current" />
                      <span className="text-white font-semibold text-sm tracking-tight">Achievements</span>
                    </div>
                    <a
                      href="#catalog"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-white/60 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>View all</span>
                      <span>&rarr;</span>
                    </a>
                  </div>

                  {/* 4 Badges Row */}
                  <div className="grid grid-cols-4 gap-2 sm:gap-3 pt-4 pb-1 relative z-10">
                    {/* Badge 1: Pull Shark */}
                    <div className="flex flex-col items-center text-center group/badge">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform group-hover/badge:scale-110 duration-200">
                        <img
                          src="/images/badges/pull-shark.png"
                          alt="Pull Shark Badge"
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(168,85,247,0.3)]"
                        />
                      </div>
                      <span className="text-[11px] sm:text-[12px] font-semibold text-white mt-2 leading-tight">
                        Pull Shark
                      </span>
                      <span className="text-[10px] text-white/50 mt-0.5">
                        Oct 2024
                      </span>
                    </div>

                    {/* Badge 2: Arctic Code Vault Contributor */}
                    <div className="flex flex-col items-center text-center group/badge">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform group-hover/badge:scale-110 duration-200">
                        <img
                          src="/images/badges/arctic-code-vault.png"
                          alt="Arctic Code Vault Contributor Badge"
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(34,197,94,0.3)]"
                        />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-white mt-2 leading-tight">
                        Arctic Code Vault Contributor
                      </span>
                      <span className="text-[10px] text-white/50 mt-0.5">
                        Dec 2024
                      </span>
                    </div>

                    {/* Badge 3: Quickdraw */}
                    <div className="flex flex-col items-center text-center group/badge">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform group-hover/badge:scale-110 duration-200">
                        <img
                          src="/images/badges/quickdraw.png"
                          alt="Quickdraw Badge"
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                        />
                      </div>
                      <span className="text-[11px] sm:text-[12px] font-semibold text-white mt-2 leading-tight">
                        Quickdraw
                      </span>
                      <span className="text-[10px] text-white/50 mt-0.5">
                        Jan 2025
                      </span>
                    </div>

                    {/* Badge 4: YOLO */}
                    <div className="flex flex-col items-center text-center group/badge">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform group-hover/badge:scale-110 duration-200">
                        <img
                          src="/images/badges/yolo.png"
                          alt="YOLO Badge"
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(255,255,255,0.25)]"
                        />
                      </div>
                      <span className="text-[11px] sm:text-[12px] font-semibold text-white mt-2 leading-tight">
                        YOLO
                      </span>
                      <span className="text-[10px] text-white/50 mt-0.5">
                        Feb 2025
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Card 1: Top-Right (Pull Request Merged) */}
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  className="absolute -top-4 right-1 sm:right-4 z-20 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_16px_36px_rgba(0,0,0,0.12)] flex items-center gap-3 select-none"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Trophy size={18} className="text-amber-500 fill-amber-500/20" />
                  </div>
                  <div className="text-left">
                    <p className="text-[12px] font-bold text-[#161b22] leading-tight">Pull Request</p>
                    <p className="text-[12px] font-bold text-[#161b22] leading-tight">Merged</p>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center shrink-0 ml-0.5">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </div>

                  {/* Celebratory 3 green rays bursting upward: \ | / */}
                  <div className="absolute -top-3.5 right-3 pointer-events-none">
                    <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
                      <line x1="3" y1="12" x2="1" y2="3" stroke="#7ccf32" strokeWidth="2.4" strokeLinecap="round" />
                      <line x1="12" y1="12" x2="12" y2="1" stroke="#7ccf32" strokeWidth="2.6" strokeLinecap="round" />
                      <line x1="21" y1="12" x2="23" y2="3" stroke="#7ccf32" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  </div>
                </motion.div>

                {/* Floating Card 2: Bottom-Left (Mission Completed!) */}
                <motion.div
                  whileHover={{ scale: 1.04, y: 4 }}
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  className="absolute -bottom-4 left-0 sm:left-4 z-20 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_16px_36px_rgba(0,0,0,0.12)] flex items-center gap-2.5 select-none"
                >
                  <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </div>
                  <span className="text-[13px] font-bold text-[#161b22]">Mission Completed!</span>
                </motion.div>

                {/* Floating Hexagon 1: Top-Left (3D Beveled Dark Git Fork) */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  animate={{ y: [0, -7, 0], rotate: [-2, 2, -2] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-3 left-2 sm:left-6 z-20 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)] cursor-pointer"
                >
                  <svg viewBox="0 0 72 80" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="hexGradFork" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#30363d" />
                        <stop offset="50%" stopColor="#21262d" />
                        <stop offset="100%" stopColor="#0d1117" />
                      </linearGradient>
                      <linearGradient id="hexRimFork" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b949e" />
                        <stop offset="100%" stopColor="#30363d" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="36,4 68,22 68,58 36,76 4,58 4,22"
                      fill="url(#hexGradFork)"
                      stroke="url(#hexRimFork)"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <polygon
                      points="36,9 63,24 63,56 36,71 9,56 9,24"
                      fill="white"
                      fillOpacity="0.08"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <GitFork size={20} className="text-white drop-shadow-sm" />
                  </div>
                </motion.div>

                {/* Floating Hexagon 2: Bottom-Right (3D Beveled Dark Star) */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  animate={{ y: [0, 7, 0], rotate: [2, -2, 2] }}
                  transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  className="absolute -bottom-3 -right-2 sm:right-2 z-20 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)] cursor-pointer"
                >
                  <svg viewBox="0 0 72 80" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="hexGradStar" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#30363d" />
                        <stop offset="50%" stopColor="#161b22" />
                        <stop offset="100%" stopColor="#0d1117" />
                      </linearGradient>
                      <linearGradient id="hexRimStar" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#c9d1d9" />
                        <stop offset="100%" stopColor="#484f58" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="36,4 68,22 68,58 36,76 4,58 4,22"
                      fill="url(#hexGradStar)"
                      stroke="url(#hexRimStar)"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <polygon
                      points="36,9 63,24 63,56 36,71 9,56 9,24"
                      fill="white"
                      fillOpacity="0.08"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Star size={18} className="text-white fill-white drop-shadow-sm" />
                  </div>
                </motion.div>

                {/* Floating 4-Pointed Sparkle Stars (✦) */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="absolute top-4 right-20 w-4 h-4 text-[#161b22] select-none pointer-events-none animate-pulse"
                >
                  <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="absolute bottom-16 right-1 w-3.5 h-3.5 text-[#161b22] select-none pointer-events-none animate-pulse"
                  style={{ animationDelay: '1s' }}
                >
                  <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="absolute top-24 left-0 w-3 h-3 text-[#161b22] select-none pointer-events-none animate-pulse"
                  style={{ animationDelay: '0.5s' }}
                >
                  <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
                </svg>
              </motion.div>

              {/* Bottom Social Proof Row */}
              <div className="flex items-center justify-end gap-3 pt-6 text-xs text-[#57606a] font-medium select-none">
                <span>Trusted by developers worldwide</span>
                <div className="flex items-center gap-3 text-[#161b22]">
                  <Github size={16} className="fill-current hover:opacity-80 transition-opacity" />
                  <MicrosoftLogo className="w-3.5 h-3.5 hover:opacity-80 transition-opacity" />
                  <GoogleLogo className="w-3.5 h-3.5 hover:opacity-80 transition-opacity" />
                  <AppleLogo className="w-3.5 h-3.5 hover:opacity-80 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WORKBENCH & DIRECTORY WRAPPER ──────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">

        {/* ─── SECTION 2: The Badges Studio & Interactive Workbench ──────── */}
        <section id="catalog" className="scroll-mt-24 mb-20 text-left w-full select-none">
          {/* Gentle Header with Home-Page Theme */}
          <div className="text-center space-y-2 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-2xs w-fit inline-block mb-3">
              ACHIEVEMENT STUDIO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
              Explore and claim GitHub badges
            </h2>
            <p className="text-xs sm:text-sm text-[#424754] max-w-lg mx-auto font-medium leading-relaxed">
              Select any official medallion to inspect its server requirements, tier multipliers, and copy verified Git recipes.
            </p>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs flex-wrap justify-center">
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
                    'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none active:scale-95 min-h-[36px]',
                    selectedCategory === tab.id
                      ? 'bg-[#0b1c30] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#0b1c30] hover:bg-slate-100/70'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search badges..."
                value={badgeSearchQuery}
                onChange={(e) => setBadgeSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200/90 bg-white text-xs text-[#0b1c30] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0969da]/30 focus:border-[#0969da] shadow-2xs font-medium min-h-[36px]"
                aria-label="Filter badges by name or requirement"
              />
              {badgeSearchQuery && (
                <button
                  onClick={() => setBadgeSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  aria-label="Clear badge search query"
                >
                  <XCircle size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Medallions Showcase Shelf with Empty State Fallback */}
          {filteredBadges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
              {filteredBadges.map((badge) => {
                const isSelected = badge.id === activeBadge.id;
                return (
                  <button
                    key={badge.id}
                    onClick={() => setSelectedBadgeId(badge.id)}
                    className={cn(
                      'p-3.5 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all duration-150 cursor-pointer select-none relative group hover:-translate-y-0.5 active:scale-95 min-h-[44px]',
                      isSelected
                        ? 'bg-white border-[#0058be] shadow-[0_4px_20px_rgba(0,88,190,0.14)] ring-2 ring-[#0058be]/25 -translate-y-0.5'
                        : 'bg-white border-slate-200/90 hover:border-[#0058be]/40 hover:bg-[#f8f9ff] hover:shadow-xs'
                    )}
                  >
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <img
                        src={badge.image}
                        alt={badge.name}
                        className={cn(
                          'w-10 h-10 object-contain transition-transform duration-200 select-none',
                          isSelected
                            ? 'scale-110 drop-shadow-[0_4px_10px_rgba(0,0,0,0.2)]'
                            : 'group-hover:scale-105 opacity-90'
                        )}
                        loading="lazy"
                      />
                      {badge.tiers && badge.tiers.length > 0 && (
                        <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-bold bg-[#d1f34d] text-[#0b1c30] px-1 rounded-full border border-slate-200/80 shadow-2xs">
                          x4
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-xs font-semibold truncate w-full',
                        isSelected
                          ? 'text-[#0b1c30]'
                          : 'text-slate-600 group-hover:text-[#0b1c30]'
                      )}
                    >
                      {badge.name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 px-4 text-center rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#0b1c30]">No matching badges found</h4>
                <p className="text-xs text-[#424754]">
                  No badges match &ldquo;{badgeSearchQuery}&rdquo;. Try clearing search or exploring Starter badges.
                </p>
              </div>
              <button
                onClick={() => {
                  setBadgeSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-1.5 rounded-full bg-[#0b1c30] text-white text-xs font-semibold hover:bg-[#1a3050] transition-colors cursor-pointer min-h-[44px]"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* Single Unified Blueprint Card */}
          <div className="rounded-[28px] border border-slate-200/90 bg-white divide-y md:divide-y-0 md:divide-x divide-slate-200/80 grid md:grid-cols-12 overflow-hidden shadow-sm">
            {/* Left: Badge Identity & Verification Rules (5 cols) */}
            <div className="md:col-span-5 p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Badge Header Bar */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/80">
                  <div>
                    <span className="text-[11px] font-mono text-[#0058be] font-bold uppercase tracking-wider block">
                      {activeBadge.category}
                    </span>
                    <h3 className="text-xl font-bold text-[#0b1c30] mt-0.5">
                      {activeBadge.name}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold shrink-0',
                      activeBadge.isObtainable
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/90'
                        : 'text-slate-600 bg-slate-100 border border-slate-200'
                    )}
                  >
                    {activeBadge.difficulty}
                  </span>
                </div>

                {/* 3D Showcase Pedestal */}
                <div className="rounded-2xl border border-slate-200/90 bg-[#f8f9ff] p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center rounded-xl bg-white border border-slate-200/90 p-1.5 shadow-sm">
                    <img
                      src={activeBadge.image}
                      alt={activeBadge.name}
                      className="w-10 h-10 object-contain select-none"
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="text-xs font-bold text-[#0b1c30] leading-snug">
                      {activeBadge.tagline}
                    </div>
                    <div className="text-[11px] font-mono text-[#424754]">
                      Est. time:{' '}
                      <span className="text-[#0b1c30] font-bold">
                        {activeRecipe.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* GitHub Verification Rule */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-[#0b1c30] block">
                    How GitHub Verifies This:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#424754] leading-relaxed">
                    {activeBadge.requirements.slice(0, 3).map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Multi-Tier Multipliers (if available) */}
                {activeBadge.tiers && activeBadge.tiers.length > 0 && (
                  <div id="tiers" className="scroll-mt-28 pt-2 border-t border-slate-200/80">
                    <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider block mb-2">
                      Tier Multipliers
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                      {activeBadge.tiers.map((tier) => (
                        <div
                          key={tier.level}
                          className="px-2.5 py-1.5 rounded-lg bg-[#f8f9ff] border border-slate-200/90 flex items-center justify-between text-slate-600 shadow-2xs"
                        >
                          <span className="truncate">{tier.level}</span>
                          <span className="text-[#0b1c30] font-bold shrink-0">
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
            <div
              id="recipe-terminal"
              className="scroll-mt-28 md:col-span-7 p-6 sm:p-7 bg-[#f8fafd] flex flex-col justify-between space-y-6 transition-all duration-300 rounded-b-[28px] md:rounded-b-none md:rounded-r-[28px]"
            >
              <div id="recipes" className="space-y-4">
                {/* Recipe Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#0969da] font-bold uppercase tracking-wider block">
                        Blueprint recipe
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-[#d1f34d] text-[#0b1c30] px-2 py-0.5 rounded-full shadow-2xs">
                        3-Station Run
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#0b1c30] mt-0.5">
                      Step-by-Step Git Commands
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 bg-white border border-slate-200/90 px-2.5 py-0.5 rounded-full shadow-2xs font-semibold">
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
                      <span className="text-xs font-bold text-[#0b1c30] block">
                        {step.label}
                      </span>
                      <div className="group/cmd rounded-xl border border-slate-800 bg-[#0b1c30] px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-md">
                        <code className="font-mono text-xs text-[#d1f34d] truncate font-semibold">
                          {step.cmd}
                        </code>
                        <button
                          onClick={() =>
                            handleCopy(step.cmd, `${activeBadge.id}-${idx}`)
                          }
                          className="shrink-0 text-xs text-white/80 hover:text-white px-2 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-1 cursor-pointer select-none"
                          title="Copy command"
                        >
                          {copiedSnippet === `${activeBadge.id}-${idx}` ? (
                            <>
                              <Check size={12} className="text-[#d1f34d]" />
                              <span className="text-[#d1f34d] text-[11px] font-mono font-bold">
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
              <div className="rounded-xl border border-amber-200/90 bg-amber-50/80 p-3.5 flex items-start gap-2.5 text-xs text-amber-950 leading-relaxed shadow-2xs">
                <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-amber-900 font-bold">Anti-Mistake Gotcha:</strong>{' '}
                  {activeRecipe.gotchaNote || activeBadge.gotchas[0]}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: Visual Proof — Real Medallions vs Cluttered Shields ─── */}
        <section id="compare" className="scroll-mt-24 mb-20 text-left w-full select-none">
          {/* Gentle Header with Home-Page Theme */}
          <div className="text-center space-y-2 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-2xs w-fit inline-block mb-3">
              PROOF OVER VANITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
              Verified proof over vanity
            </h2>
            <p className="text-xs sm:text-sm text-[#424754] max-w-lg mx-auto font-medium leading-relaxed">
              Why tech leads look for official GitHub profile medallions instead of copy-pasted README shields.
            </p>
          </div>

          {/* Single Unified Comparison Card */}
          <div className="rounded-[28px] border border-slate-200/90 bg-white divide-y md:divide-y-0 md:divide-x divide-slate-200/80 grid md:grid-cols-2 overflow-hidden shadow-sm">
            {/* Left Box: The Copy-Paste Illusion */}
            <div className="p-6 sm:p-7 space-y-5 bg-slate-50/50 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                      Vanity metric
                    </span>
                    <h3 className="text-base font-bold text-[#0b1c30] mt-0.5">
                      README Markdown Shields
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-rose-700 bg-rose-50 border border-rose-200/90 px-2.5 py-0.5 rounded-full font-bold">
                    Unverified
                  </span>
                </div>

                {/* Clean Visual Showcase Canvas */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 space-y-3 shadow-2xs">
                  <div className="text-[11px] text-slate-500 flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="font-semibold text-[#0b1c30]">Static Image Shields</span>
                    <span className="font-mono text-[10px] text-slate-400">img.shields.io</span>
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
                  <div className="h-5 flex items-center text-[11px] font-mono text-slate-400 border-t border-slate-100 pt-2">
                    <span>Self-reported image URLs · 0 Git webhooks</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-[#424754] leading-relaxed pt-2">
                <li className="flex items-start gap-2">
                  <XCircle size={15} className="text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Can be copied and pasted in 30 seconds from online generator templates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={15} className="text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Proves familiarity with markdown image syntax, not real Git workflow skills.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={15} className="text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Hiring managers and senior engineers scroll right past it to commit history.</span>
                </li>
              </ul>
            </div>

            {/* Right Box: Official GitHub Webhook Medallions */}
            <div className="p-6 sm:p-7 space-y-5 bg-[#f8fafd] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <div>
                    <span className="text-[11px] font-mono text-[#0058be] font-bold uppercase tracking-wider block">
                      Verifiable proof
                    </span>
                    <h3 className="text-base font-bold text-[#0b1c30] mt-0.5">
                      GitHub Profile Medallions
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/90 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Server-Verified
                  </span>
                </div>

                {/* Clean Visual Showcase Canvas */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 space-y-3 shadow-2xs">
                  <div className="text-[11px] text-slate-500 flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="font-semibold text-[#0b1c30]">Official Profile Achievements</span>
                    <span className="font-mono text-[10px] text-emerald-600 font-semibold">github.com/profile</span>
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
                        className="relative group/badge flex items-center justify-center w-11 h-11 rounded-xl bg-[#f8f9ff] border border-slate-200/90 p-1.5 shadow-2xs hover:border-[#0058be] hover:bg-white hover:scale-105 transition-all cursor-pointer select-none"
                        title={`${item.name}${item.tier ? ` (${item.tier})` : ''}: ${item.trigger}`}
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-7 h-7 sm:w-8 sm:h-8 object-contain select-none"
                          loading="lazy"
                        />
                        {item.tier && (
                          <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-bold bg-[#d1f34d] text-[#0b1c30] px-1 rounded-full border border-slate-200 shadow-2xs">
                            {item.tier}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="h-5 flex items-center text-[11px] font-mono overflow-hidden border-t border-slate-100 pt-2">
                    {inspectedMedal ? (
                      <span className="text-[#0058be] truncate">
                        <span className="font-bold text-[#0b1c30]">
                          {inspectedMedal.name}
                          {inspectedMedal.tier ? ` ${inspectedMedal.tier}` : ''}:
                        </span>{' '}
                        {inspectedMedal.trigger}
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        Hover any medal to inspect verified Git trigger
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-[#0b1c30] font-medium leading-relaxed pt-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Awarded automatically by GitHub server webhooks on real Git events.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Stamped directly onto your public GitHub profile header next to your bio.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Proves genuine branch hygiene, co-author trailers, and PR etiquette.</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* ─── SECTION 4: Simple, Clear FAQ ─────────────────────────────────── */}
        <InteractiveFAQSection />

        {/* ─── Final Direct Launch Action Ribbon (Home-Page Signature Style) ─── */}
        <section className="rounded-[32px] bg-[#0b1c30] border border-slate-800 p-8 sm:p-12 text-center space-y-4 mb-8 relative overflow-hidden shadow-2xl">
          {/* Ambient Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d1f34d]/10 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0058be]/20 rounded-full filter blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#d1f34d] text-[10px] font-mono font-bold uppercase tracking-widest shadow-sm">
              <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full animate-ping" />
              1-Click Execution
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Claim Your First Official GitHub Medallion?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto font-medium leading-relaxed">
              Start with Quickdraw for an instant 120-second win, or advance to Pull Shark 🦈 to begin your tier multipliers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                to="/blueprints/gitglow/engine?badge=quickdraw"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#d1f34d] hover:bg-[#c0e045] text-[#0b1c30] font-bold text-xs uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-md hover:shadow-[0_8px_25px_rgba(209,243,77,0.35)] cursor-pointer"
              >
                Claim Quickdraw (120s) →
              </Link>
              <Link
                to="/blueprints/gitglow/engine?badge=pull-shark"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
              >
                Claim Pull Shark 🦈
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
