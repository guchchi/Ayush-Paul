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
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] overflow-x-hidden selection:bg-[#d1f34d] selection:text-[#0b1c30]">

      {/* ─── SECTION 1: Luminous Ethereal Hero (Supaste / 21st.dev Style Replica) ─── */}
      <section
        id="hero"
        className="relative w-full pt-20 pb-20 sm:pt-24 sm:pb-28 bg-[#f8fafd] text-slate-900 overflow-hidden border-b border-slate-200/80"
      >
        {/* Supaste-Signature Royal Cyan/Sky Ambient Atmosphere (Radiating beneath top notch) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {/* Intense top-center bloom radiating under the dynamic island notch */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[900px] sm:w-[1400px] h-[520px] rounded-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#38bdf8]/35 via-[#60a5fa]/22 to-transparent blur-[85px]" />
          
          {/* Top-right ambient cloud */}
          <div className="absolute -top-12 -right-16 w-[600px] h-[500px] rounded-full bg-[#60a5fa]/25 blur-[110px]" />
          
          {/* Top-left ambient cloud */}
          <div className="absolute -top-12 -left-20 w-[550px] h-[450px] rounded-full bg-[#93c5fd]/30 blur-[100px]" />
          
          {/* Bottom-left organic curved petal bloom (exact reference match) */}
          <div className="absolute -bottom-16 -left-16 w-[480px] h-[340px] rounded-tr-[160px] bg-gradient-to-tr from-[#93c5fd]/50 via-[#bfdbfe]/35 to-transparent blur-[70px]" />

          {/* Delicate Architectural Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.45]"
            style={{
              backgroundImage:
                'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 92%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 92%)',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Subtle Blueprints directory breadcrumb */}
          <div className="mb-6 sm:mb-8">
            <Link
              to="/blueprints"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-2xs select-none group"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>All Blueprints</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* ── LEFT: Copy & CTAs (7 cols) ── */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow Pill */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eff4ff] border border-[#dbeafe] text-[#1648e8] text-xs font-semibold tracking-tight shadow-2xs select-none">
                  <Zap size={13} className="fill-current text-[#1648e8]" />
                  <span>Level Up Your GitHub Profile</span>
                </div>
              </motion.div>

              {/* Bold Headline */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.06 }}
              >
                <h1 className="text-5xl sm:text-6xl lg:text-[68px] xl:text-[76px] font-black text-[#050505] tracking-[-0.038em] leading-[1.05]">
                  Earn real GitHub <br />
                  achievements. <br />
                  <span className="text-[#1648e8] relative inline-block">
                    By doing the work.
                    {/* Decorative hand-drawn underline accent matching reference screenshot */}
                    <svg
                      viewBox="0 0 280 16"
                      fill="none"
                      className="absolute -bottom-2 left-0 w-full h-[10px] text-[#1648e8]/75 pointer-events-none"
                    >
                      <path
                        d="M 4 10 C 60 4, 180 5, 274 8"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 18 14 C 75 9, 160 10, 235 13"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        opacity="0.6"
                      />
                    </svg>
                  </span>
                </h1>
              </motion.div>

              {/* Description Body */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.12 }}
                className="text-slate-600 text-base sm:text-lg lg:text-[19px] leading-relaxed max-w-[490px]"
              >
                Complete guided missions, make meaningful contributions, and build a profile that truly stands out.
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
                  className="h-[50px] px-8 rounded-full bg-[#050505] hover:bg-slate-800 text-white text-[15px] font-semibold tracking-[-0.01em] inline-flex items-center gap-2.5 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/15 group cursor-pointer"
                >
                  <span>Explore Missions</span>
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="#catalog"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-3 text-slate-800 hover:text-black text-[15px] font-semibold transition-colors py-2 px-3 group cursor-pointer"
                >
                  <span className="w-10 h-10 rounded-full bg-slate-100/90 group-hover:bg-slate-200 border border-slate-200/80 flex items-center justify-center transition-colors shadow-2xs">
                    <Play size={13} className="text-slate-900 fill-slate-900 ml-0.5" />
                  </span>
                  <span>How it works</span>
                </a>
              </motion.div>

              {/* Compact Feature Row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.24 }}
                className="flex items-center flex-wrap gap-4 sm:gap-6 pt-5 border-t border-slate-200/70 text-xs sm:text-[13.5px] font-medium text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Rocket size={16} className="text-slate-900" />
                  <span>Real Missions</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-slate-900" />
                  <span>Verified Badges</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-slate-900" />
                  <span>Track Progress</span>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT: 3D Floating GitHub Artifact Composition (5 cols) ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: DURATION.SLOW, ease: EASING.PREMIUM, delay: 0.15 }}
              className="lg:col-span-5 relative h-[400px] sm:h-[460px] w-full flex items-center justify-center select-none"
            >
              {/* Diffuse Floor Shadow with royal blue ambient core */}
              <div
                aria-hidden="true"
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[300px] h-[45px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(22,72,232,0.45)_0%,_rgba(22,72,232,0.15)_45%,_transparent_75%)] blur-xl pointer-events-none"
              />

              {/* Glowing Cyan/Blue Orbital Ring */}
              <svg
                aria-hidden="true"
                className="absolute -inset-10 w-[130%] h-[130%] pointer-events-none overflow-visible"
                viewBox="0 0 400 400"
              >
                <ellipse
                  cx="200"
                  cy="200"
                  rx="175"
                  ry="85"
                  fill="none"
                  stroke="url(#orbitGlowGrad)"
                  strokeWidth="2.8"
                  transform="rotate(-18 200 200)"
                  opacity="0.9"
                />
                <defs>
                  <linearGradient id="orbitGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#1648e8" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
              </svg>

              {/* 3D Tilted Glossy Dark GitHub Tile */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-[230px] h-[230px] sm:w-[270px] sm:h-[270px] rounded-[42px] sm:rounded-[48px] bg-gradient-to-br from-[#1c202a] via-[#0d1017] to-[#040608] border border-white/20 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.55),0_0_60px_rgba(22,72,232,0.32)] flex items-center justify-center overflow-hidden"
                style={{
                  transform: 'perspective(1000px) rotateY(-14deg) rotateX(8deg) rotateZ(-3deg)',
                }}
              >
                {/* Specular gloss top reflection */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none rounded-[inherit]" />
                {/* White GitHub Octocat Glyph */}
                <Github
                  size={116}
                  className="text-white fill-current drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                />
              </motion.div>

              {/* Floating Toast 1: Top-Right (Pull Request Merged) */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="absolute -top-3 -right-2 sm:right-2 z-20 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-[0_20px_45px_rgba(15,23,42,0.14)] flex items-center gap-3.5 select-none"
              >
                <div className="w-[38px] h-[38px] rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Trophy size={19} className="text-amber-500 fill-amber-500/30" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-900 leading-tight">Pull Request</p>
                  <p className="text-[12px] font-bold text-slate-900 leading-tight">Merged</p>
                </div>
                <CheckCircle2 size={19} className="text-emerald-500 fill-emerald-100 shrink-0 ml-0.5" />

                {/* Decorative festive sparks */}
                <div className="absolute -top-2.5 right-3 flex gap-0.5 pointer-events-none text-[#1648e8] font-bold text-[11px]">
                  <span>/</span>
                  <span>|</span>
                  <span>\</span>
                </div>
              </motion.div>

              {/* Floating Toast 2: Bottom-Left (Mission Completed!) */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="absolute bottom-6 -left-4 sm:left-0 z-20 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-[0_20px_45px_rgba(15,23,42,0.14)] flex items-center gap-3 select-none"
              >
                <CheckCircle2 size={21} className="text-emerald-500 fill-emerald-100 shrink-0" />
                <span className="text-[13px] font-bold text-slate-900">Mission Completed!</span>
              </motion.div>

              {/* Floating Hexagon 1: Top-Left (Git Fork) */}
              <motion.div
                animate={{ y: [0, -9, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-6 left-2 sm:left-4 z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-[18px] bg-gradient-to-br from-white/95 via-[#dbeafe]/90 to-[#bfdbfe]/60 backdrop-blur-md border border-white/90 shadow-[0_14px_30px_rgba(22,72,232,0.22)] flex items-center justify-center select-none"
              >
                <GitFork size={24} className="text-[#1648e8]" />
              </motion.div>

              {/* Floating Hexagon 2: Bottom-Right (Star) */}
              <motion.div
                animate={{ y: [0, 9, 0], rotate: [2, -2, 2] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute bottom-4 right-1 sm:right-4 z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-[18px] bg-gradient-to-br from-[#1e293b]/95 to-[#0f172a]/95 backdrop-blur-md border border-white/20 shadow-[0_18px_36px_rgba(0,0,0,0.35)] flex items-center justify-center select-none"
              >
                <Star size={22} className="text-white fill-white" />
              </motion.div>

              {/* Floating Sparkles (✦) matching reference screenshot */}
              <span className="absolute top-16 right-24 text-slate-900 text-lg select-none pointer-events-none animate-pulse">✦</span>
              <span className="absolute bottom-20 right-2 text-slate-900 text-base select-none pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}>✦</span>
              <span className="absolute top-28 left-0 text-slate-900 text-sm select-none pointer-events-none animate-pulse" style={{ animationDelay: '0.5s' }}>✦</span>
            </motion.div>
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

          {/* Muted Filter Tabs */}
          <div className="flex items-center justify-center gap-1.5 p-1 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs w-fit mx-auto mb-6 flex-wrap">
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
                  'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none active:scale-95',
                  selectedCategory === tab.id
                    ? 'bg-[#0b1c30] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0b1c30] hover:bg-slate-100/70'
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
                    'p-3.5 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all duration-150 cursor-pointer select-none relative group hover:-translate-y-0.5 active:scale-95',
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
            <div id="recipes" className="scroll-mt-28 md:col-span-7 p-6 sm:p-7 bg-[#f8fafd] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Recipe Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <div>
                    <span className="text-[11px] font-mono text-[#0058be] font-bold uppercase tracking-wider block">
                      Blueprint recipe
                    </span>
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
