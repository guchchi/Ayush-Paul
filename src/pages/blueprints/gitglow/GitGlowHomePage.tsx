import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Github,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Layers,
  Clock,
  ChevronDown,
  GitPullRequest,
  GitFork,
  Trophy,
  Award,
  Zap,
  Terminal,
  ExternalLink,
  Check,
  Code2,
  XCircle,
  HelpCircle,
  Play,
  Search,
  Copy,
  Info,
  SlidersHorizontal,
  Rocket,
  TrendingUp,
  Star,
  Users,
  Compass,
  FileCode,
  Flame,
  Activity,
  Workflow,
  CheckCheck,
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
  difficulty: string;
  isAutomated: boolean;
  gotchaNote: string;
  missionContext: string;
}

const BADGE_RECIPES: Record<string, BadgeRecipe> = {
  quickdraw: {
    station1Label: '1. Create Test Issue or PR',
    command1: 'gh issue create --title "track: quickdraw audit" --body "Temp milestone"',
    station2Label: '2. Close Under 300 Seconds',
    command2: 'gh issue close 1 --comment "Closed for Quickdraw achievement"',
    station3Label: '3. Webhook Ingestion Check',
    command3: 'gh api user/public_emails',
    estimatedTime: '120 Seconds',
    difficulty: 'Very Easy',
    isAutomated: true,
    gotchaNote: 'Must close within 300s of opening. Closing PRs without merging also qualifies as long as it is within the 5-minute window.',
    missionContext: 'Learn issue lifecycles and fast triage by triggering GitHub webhook timing events on personal repositories.',
  },
  'pull-shark': {
    station1Label: '1. Create Feature Branch',
    command1: 'git switch -c feat/contributor-card',
    station2Label: '2. Commit Verified Work',
    command2: 'git commit --allow-empty -m "feat: add verified contributor card"',
    station3Label: '3. Merge PR into Default Branch',
    command3: 'gh pr merge --auto --merge',
    estimatedTime: '5 Minutes',
    difficulty: 'Beginner',
    isAutomated: true,
    gotchaNote: 'PR must be merged into the default branch (main). Merged PRs count toward multi-tier multipliers (x2, x16, x128).',
    missionContext: 'Master feature branch workflows, commit discipline, and pull request merging on real GitHub repos.',
  },
  yolo: {
    station1Label: '1. Create Production Branch',
    command1: 'git switch -c yolo/direct-push',
    station2Label: '2. Direct Work Commit',
    command2: 'git commit --allow-empty -m "fix: emergency patch direct merge"',
    station3Label: '3. Merge Without Pull Review',
    command3: 'gh pr merge --admin --merge',
    estimatedTime: '3 Minutes',
    difficulty: 'Intermediate',
    isAutomated: true,
    gotchaNote: 'Requires merging directly without any reviewer approval requested or submitted on a multi-contributor repo.',
    missionContext: 'Understand branch protection rules, code review workflows, and emergency bypass mechanics.',
  },
  'pair-extraordinaire': {
    station1Label: '1. Co-Authored Git Trailer',
    command1: 'git commit -m "feat: pair programming sprint\n\nCo-authored-by: partner <peer@github.com>"',
    station2Label: '2. Push Trailer Commit',
    command2: 'git push origin feat/pair-session',
    station3Label: '3. Merge Co-Authored Pull Request',
    command3: 'gh pr merge --auto --merge',
    estimatedTime: '8 Minutes',
    difficulty: 'Intermediate',
    isAutomated: true,
    gotchaNote: 'Trailer syntax requires a blank line directly before "Co-authored-by:" and a valid GitHub email format.',
    missionContext: 'Practice professional open-source collaboration using RFC-standard Git commit trailer headers.',
  },
  'galaxy-brain': {
    station1Label: '1. Locate Open Discussion',
    command1: 'gh browse https://github.com/orgs/community/discussions',
    station2Label: '2. Post Helpful Solution',
    command2: 'gh api graphql -f query="mutation { addDiscussionComment(...) }"',
    station3Label: '3. Answer Accepted by Author',
    command3: 'gh api graphql -f query="mutation { markDiscussionCommentAsAnswer(...) }"',
    estimatedTime: '15 Minutes',
    difficulty: 'Intermediate',
    isAutomated: false,
    gotchaNote: 'Requires an accepted answer in a public repository with GitHub Discussions officially enabled.',
    missionContext: 'Build technical communication skills by debugging community questions and earning community answers.',
  },
  starstruck: {
    station1Label: '1. Showcase Repository Topics',
    command1: 'gh repo edit --add-topic "gitglow-showcase" --add-topic "developer-portfolio"',
    station2Label: '2. Share Milestone Link',
    command2: 'gh repo view --web',
    station3Label: '3. Reach 16 Community Stars',
    command3: 'gh api repos/{owner}/{repo} --jq .stargazers_count',
    estimatedTime: 'Community Milestone',
    difficulty: 'Milestone',
    isAutomated: false,
    gotchaNote: 'Stars from bot clusters can be pruned by GitHub security. Earn genuine stars through open-source sharing.',
    missionContext: 'Launch an open-source tool, document your README, and attract genuine developer stars.',
  },
};

// ─── Guided Mission Catalog Definition ────────────────────────────────────────
interface GuidedMission {
  id: string;
  title: string;
  category: 'Fundamentals' | 'Pull Requests' | 'Open Source' | 'Collaboration' | 'Automation';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  skillPracticed: string;
  targetBadgeName: string;
  targetBadgeImage: string;
  summary: string;
  completionRate: string;
}

const GUIDED_MISSIONS: GuidedMission[] = [
  {
    id: 'm1-quickdraw',
    title: 'The 120-Second Quickdraw',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    estimatedTime: '2 Mins',
    skillPracticed: 'Issue lifecycles & fast triage automation',
    targetBadgeName: 'Quickdraw',
    targetBadgeImage: '/images/badges/quickdraw.png',
    summary: 'Open a tracking issue and close it under 5 minutes to trigger the GitHub Quickdraw webhook.',
    completionRate: '98% Success Rate',
  },
  {
    id: 'm2-pull-shark',
    title: 'First Pull Request Merge',
    category: 'Pull Requests',
    difficulty: 'Beginner',
    estimatedTime: '5 Mins',
    skillPracticed: 'Feature branching, commit staging & PR merges',
    targetBadgeName: 'Pull Shark',
    targetBadgeImage: '/images/badges/pull-shark.png',
    summary: 'Create a feature branch, author a verified commit, open a PR, and merge into default main.',
    completionRate: '94% Success Rate',
  },
  {
    id: 'm3-pair-collab',
    title: 'The Co-Authoring Handshake',
    category: 'Collaboration',
    difficulty: 'Intermediate',
    estimatedTime: '8 Mins',
    skillPracticed: 'Git trailer RFC standards & multi-author commits',
    targetBadgeName: 'Pair Extraordinaire',
    targetBadgeImage: '/images/badges/pair-extraordinaire.png',
    summary: 'Add a co-author trailer to your commit so GitHub attributes the contribution to both developers.',
    completionRate: '89% Success Rate',
  },
  {
    id: 'm4-yolo-merge',
    title: 'Direct Production Merge (YOLO)',
    category: 'Fundamentals',
    difficulty: 'Intermediate',
    estimatedTime: '3 Mins',
    skillPracticed: 'Branch permissions & administrative merges',
    targetBadgeName: 'YOLO',
    targetBadgeImage: '/images/badges/yolo.png',
    summary: 'Merge a pull request directly without code review on a repository with multiple collaborators.',
    completionRate: '91% Success Rate',
  },
  {
    id: 'm5-discussion-solver',
    title: 'Discussion Problem Solver',
    category: 'Open Source',
    difficulty: 'Intermediate',
    estimatedTime: '15 Mins',
    skillPracticed: 'Technical troubleshooting & accepted answers',
    targetBadgeName: 'Galaxy Brain',
    targetBadgeImage: '/images/badges/galaxy-brain.png',
    summary: 'Answer a developer question in GitHub Discussions and have your solution accepted by the author.',
    completionRate: '78% Success Rate',
  },
  {
    id: 'm6-open-source',
    title: 'Open Source Contributor Launchpad',
    category: 'Open Source',
    difficulty: 'Advanced',
    estimatedTime: '25 Mins',
    skillPracticed: 'Upstream remotes, fork synchronization & PR etiquette',
    targetBadgeName: 'Open Sourcerer',
    targetBadgeImage: '/images/badges/open-sourcerer.png',
    summary: 'Fork a public repository, synchronize remotes, squash commits, and land a merged pull request.',
    completionRate: '82% Success Rate',
  },
];

// ─── 3D Hero Graphic Helpers ──────────────────────────────────────────────────
const SparkleStar: React.FC<{ className?: string; size?: number }> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#2da44e"
    className={cn('text-[#2da44e]', className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
  </svg>
);

const HexBadge: React.FC<{
  icon: 'git' | 'star';
  className?: string;
  size?: number;
}> = ({ icon, className, size = 52 }) => (
  <div className={cn('relative select-none pointer-events-none', className)}>
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 60 70"
      fill="none"
      className="filter drop-shadow-[0_8px_16px_rgba(45,164,78,0.35)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="30,4 56,19 56,51 30,66 4,51 4,19"
        fill="#1a7f37"
      />
      <polygon
        points="30,2 54,16 54,46 30,60 6,46 6,16"
        fill="url(#hexGreenGrad)"
      />
      <polygon
        points="30,5 51,17 51,44 30,57 9,44 9,17"
        fill="none"
        stroke="#4ac26b"
        strokeWidth="1.5"
        opacity="0.85"
      />
      <defs>
        <linearGradient id="hexGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3fb950" />
          <stop offset="100%" stopColor="#238636" />
        </linearGradient>
      </defs>
    </svg>
    <div className="absolute inset-0 flex items-center justify-center -translate-y-1 text-white">
      {icon === 'git' ? (
        <GitFork size={18} className="text-white stroke-[2.5]" />
      ) : (
        <Star size={16} className="text-white fill-white" />
      )}
    </div>
  </div>
);

const OctocatSilhouette: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 200 200"
    className={cn('w-28 h-28 sm:w-36 sm:h-36 fill-white', className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M 110 46 C 103 46 96 48 92 50 C 88 41 83 32 78 26 C 76 36 72 45 68 53 C 60 62 58 70 58 76 C 58 87 70 94 82 97 C 81 106 80 114 79 122 C 70 124 60 126 52 118 C 46 112 47 104 52 100 C 50 98 44 102 41 109 C 36 119 39 130 47 138 C 55 146 68 147 78 142 L 80 162 C 80 165 82 166 85 166 L 97 166 C 100 166 102 164 102 161 L 104 144 C 108 144 116 144 120 144 L 122 161 C 122 164 124 166 127 166 L 139 166 C 142 166 144 165 144 162 L 144 130 C 145 116 142 104 138 97 C 150 94 162 87 162 76 C 162 70 160 62 152 53 C 148 45 144 36 142 26 C 137 32 132 41 128 50 C 124 48 117 46 110 46 Z" />
  </svg>
);

const HERO_BADGE_PREVIEWS: Record<
  string,
  { line1: string; line2: string; icon: 'trophy' | 'timer' | 'zap' | 'brain' | 'users' | 'star' }
> = {
  'pull-shark': { line1: 'Pull Request', line2: 'Merged', icon: 'trophy' },
  quickdraw: { line1: 'Issue Closed', line2: '< 300 Seconds', icon: 'timer' },
  yolo: { line1: 'Direct Push', line2: 'Merged YOLO', icon: 'zap' },
  'galaxy-brain': { line1: 'Discussion Answer', line2: 'Accepted', icon: 'brain' },
  'pair-extraordinaire': { line1: 'Co-Authored Commit', line2: 'Merged PR', icon: 'users' },
  starstruck: { line1: 'Community Stars', line2: '16 Reached', icon: 'star' },
};

export const GitGlowHomePage: React.FC = () => {
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>('quickdraw');
  const [heroActiveBadgeId, setHeroActiveBadgeId] = useState<string>('pull-shark');
  const [badgeCategoryFilter, setBadgeCategoryFilter] = useState<string>('all');
  const [missionCategoryFilter, setMissionCategoryFilter] = useState<string>('all');
  const [badgeSearchQuery, setBadgeSearchQuery] = useState<string>('');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeFaqId, setActiveFaqId] = useState<number | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(label);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const filteredBadges = useMemo(() => {
    let list = GITHUB_BADGES;
    if (badgeCategoryFilter === 'starter') list = list.filter((b) => b.isRecommendedStarter);
    else if (badgeCategoryFilter === 'tiers') list = list.filter((b) => b.tiers && b.tiers.length > 0);
    else if (badgeCategoryFilter === 'legacy') list = list.filter((b) => !b.isObtainable);

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
  }, [badgeCategoryFilter, badgeSearchQuery]);

  const activeBadge = useMemo(() => {
    return GITHUB_BADGES.find((b) => b.id === selectedBadgeId) || GITHUB_BADGES[0];
  }, [selectedBadgeId]);

  const activeRecipe = useMemo(() => {
    return (
      BADGE_RECIPES[activeBadge.id] || {
        station1Label: '1. Switch Feature Branch',
        command1: `git switch -c feat/claim-${activeBadge.id}`,
        station2Label: '2. Generate Commit',
        command2: `git commit -m "feat: complete ${activeBadge.name} mission"`,
        station3Label: '3. Merge Pull Request',
        command3: 'gh pr merge --auto --merge',
        estimatedTime: '5 Minutes',
        difficulty: 'Beginner',
        isAutomated: true,
        gotchaNote: activeBadge.gotchas[0] || 'Follow standard GitHub branching and pull request guidelines.',
        missionContext: 'Complete real GitHub activity to trigger the official achievement webhook.',
      }
    );
  }, [activeBadge]);

  const allActiveCommands = useMemo(() => {
    return `${activeRecipe.command1}\n${activeRecipe.command2}\n${activeRecipe.command3}`;
  }, [activeRecipe]);

  const filteredMissions = useMemo(() => {
    if (missionCategoryFilter === 'all') return GUIDED_MISSIONS;
    return GUIDED_MISSIONS.filter(
      (m) => m.category.toLowerCase().replace(/\s+/g, '-') === missionCategoryFilter
    );
  }, [missionCategoryFilter]);

  const faqs = [
    {
      id: 1,
      q: 'Does GitGlow give me official GitHub badges directly?',
      a: 'No. GitHub directly controls and awards all official profile achievements. GitGlow provides guided missions, step-by-step Git recipes, and verified contribution workflows that help you complete the exact real-world tasks GitHub requires to award them.',
    },
    {
      id: 2,
      q: 'Will these achievements show up on my real GitHub profile?',
      a: 'Yes, 100%. Because you execute real Git operations (merging PRs, co-authoring commits, closing issues within 5 minutes) on real GitHub repositories, GitHub server webhooks automatically trigger and display the official badge on your profile.',
    },
    {
      id: 3,
      q: 'Do I need prior open-source experience to begin?',
      a: 'Not at all. GitGlow was built specifically for students and beginners. Missions start with 120-second starter challenges (like Quickdraw) before advancing to multi-tier pull request workflows and open-source contributions.',
    },
    {
      id: 4,
      q: 'Is GitGlow safe to use with my personal GitHub account?',
      a: 'Yes. All recipes follow standard GitHub CLI and Git conventions. Missions are executed in your own test repositories or verified sandbox environments. No passwords or tokens are stored.',
    },
    {
      id: 5,
      q: 'How long does GitHub take to display a badge after completing a mission?',
      a: 'GitHub background indexing runs in periodic batches. In most cases, achievements appear on your public profile within 10 to 30 minutes after your pull request or issue event is closed and indexed.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#161B22] overflow-x-hidden selection:bg-[#dafbe1] selection:text-[#1a7f37]">

      {/* ─── SECTION 01: HERO (Highest Priority WOW Section) ──────────────── */}
      <section
        id="hero"
        className="relative w-full pt-20 pb-20 sm:pt-24 sm:pb-28 bg-[#FFFFFF] text-[#161B22] overflow-hidden border-b border-[#D0D7DE]"
      >
        {/* Clean Architectural Grid Overlay (No Fog / No Fuzzy Blobs) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                'linear-gradient(#E1E4E8 1px, transparent 1px), linear-gradient(90deg, #E1E4E8 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Blueprints directory breadcrumb */}
          <div className="mb-6 sm:mb-8">
            <Link
              to="/blueprints"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#656D76] hover:text-[#161B22] transition-colors px-3 py-1 rounded-full bg-[#F6F8FA] border border-[#D0D7DE] shadow-2xs select-none group"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>All Blueprints</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* ── LEFT: Copy & CTAs (6 cols) ── */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-left">
              {/* Eyebrow Pill */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dafbe1] text-[#1a7f37] border border-[#2da44e]/30 text-[11px] font-bold uppercase tracking-[0.16em] shadow-2xs select-none">
                  <span className="w-2 h-2 rounded-full bg-[#2da44e] animate-pulse" />
                  <span>Guided Missions · Real GitHub Achievements</span>
                </div>
              </motion.div>

              {/* Bold Headline */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.06 }}
              >
                <h1 className="text-5xl sm:text-6xl lg:text-[68px] xl:text-[74px] font-extrabold text-[#161B22] tracking-[-0.038em] leading-[1.05]">
                  Your GitHub profile is <br />
                  <span className="text-[#2da44e]">about to get interesting.</span>
                </h1>
              </motion.div>

              {/* Supporting Copy */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.12 }}
                className="text-[#656D76] text-base sm:text-lg lg:text-[19px] leading-relaxed max-w-[530px] font-medium"
              >
                Earn real GitHub achievements through guided missions, meaningful contributions, and hands-on developer challenges.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.18 }}
                className="flex items-center flex-wrap gap-4 pt-1"
              >
                <a
                  href="#achievements"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="h-[52px] px-8 rounded-full bg-[#161B22] hover:bg-[#24292f] text-white text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2da44e] group cursor-pointer select-none"
                  aria-label="Explore authentic GitHub achievement badges"
                >
                  <span>Explore Achievements</span>
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="#missions"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('missions')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="h-[52px] px-8 rounded-full bg-white hover:bg-slate-50 text-[#161B22] border border-[#D0D7DE] text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-2xs hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2da44e] cursor-pointer select-none"
                  aria-label="Start your first guided GitHub mission"
                >
                  <Play size={13} className="text-[#2da44e] fill-[#2da44e]" />
                  <span>Start Your First Mission</span>
                </a>
              </motion.div>

              {/* Compact Value Row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.24 }}
                className="flex items-center flex-wrap gap-4 sm:gap-6 pt-5 border-t border-[#D0D7DE] text-xs sm:text-[13px] font-semibold text-[#656D76]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#2da44e]" />
                  <span>Guided Missions</span>
                </div>
                <div className="hidden sm:block text-slate-300">|</div>
                <div className="flex items-center gap-2">
                  <GitPullRequest size={15} className="text-[#2da44e]" />
                  <span>Real Pull Requests</span>
                </div>
                <div className="hidden sm:block text-slate-300">|</div>
                <div className="flex items-center gap-2">
                  <Award size={15} className="text-[#2da44e]" />
                  <span>Verified Badges</span>
                </div>
                <div className="hidden sm:block text-slate-300">|</div>
                <div className="flex items-center gap-2">
                  <Shield size={15} className="text-[#2da44e]" />
                  <span>100% Legitimate</span>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT: 3D Achievement Showcase Visual (Matching User Brief & Mockup) ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: DURATION.SLOW, ease: EASING.PREMIUM, delay: 0.15 }}
              className="lg:col-span-6 xl:col-span-6 relative w-full flex flex-col items-center justify-center select-none pt-4 pb-2"
            >
              {/* Outer Graphic Showcase Stage */}
              <div className="relative w-full max-w-[460px] sm:max-w-[500px] flex items-center justify-center py-6 sm:py-8">
                
                {/* 1. Subtle Background Grid Texture Layer */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    backgroundImage:
                      'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    maskImage: 'radial-gradient(circle at center, black 45%, transparent 75%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 45%, transparent 75%)',
                  }}
                />

                {/* 2. Delicate Faint Wireframe Circle (Left Side) */}
                <div
                  aria-hidden="true"
                  className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-300/60 pointer-events-none"
                />

                {/* 3. Floating 4-Point Green Sparkles */}
                <div className="absolute top-4 right-14 sm:right-20 pointer-events-none animate-pulse">
                  <SparkleStar size={16} />
                </div>
                <div className="absolute top-1/3 left-2 sm:left-6 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}>
                  <SparkleStar size={14} />
                </div>

                {/* 4. Elliptical Orbit Ring - Back Arc (Behind Central Card, z-0) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                >
                  <svg
                    viewBox="0 0 500 300"
                    className="w-[125%] h-[125%] -rotate-[22deg] overflow-visible"
                    fill="none"
                  >
                    {/* Back Arc: Loops behind top of card */}
                    <path
                      d="M 40 150 A 210 80 0 0 1 460 150"
                      stroke="#2da44e"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="opacity-95"
                    />
                  </svg>
                </div>

                {/* 5. Central Dark Squircle Card with GitHub Sitting Cat Silhouette (z-10) */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-[40px] sm:rounded-[48px] bg-gradient-to-b from-[#21262d] via-[#161b22] to-[#0d1117] border border-[#30363d]/70 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.32),inset_0_1px_1px_rgba(255,255,255,0.14)] flex items-center justify-center cursor-default group"
                >
                  {/* Subtle Top Inner Sheen */}
                  <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Sitting GitHub Octocat Silhouette */}
                  <OctocatSilhouette className="transition-transform duration-300 group-hover:scale-105" />
                </motion.div>

                {/* 6. Elliptical Orbit Ring - Front Arc (In Front of Central Card, z-20) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                >
                  <svg
                    viewBox="0 0 500 300"
                    className="w-[125%] h-[125%] -rotate-[22deg] overflow-visible"
                    fill="none"
                  >
                    {/* Front Arc: Loops in front across bottom */}
                    <path
                      d="M 460 150 A 210 80 0 0 1 40 150"
                      stroke="#2da44e"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="opacity-95 drop-shadow-[0_2px_8px_rgba(45,164,78,0.35)]"
                    />
                  </svg>
                </div>

                {/* 7. Floating Top-Left 3D Hexagonal Badge: Git Branch / Fork (z-25) */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  className="absolute top-4 left-0 sm:-left-3 z-25 pointer-events-none"
                >
                  <HexBadge icon="git" size={54} />
                </motion.div>

                {/* 8. Floating Top-Right Pill: "Pull Request Merged" (z-30) */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  className="absolute -top-3 right-0 sm:-right-4 z-30"
                >
                  {/* Celebratory Green Rays */}
                  <div className="absolute -top-3.5 right-6 flex items-end justify-center gap-1 text-[#2da44e] pointer-events-none">
                    <span className="w-0.5 h-2.5 bg-[#2da44e] rounded-full -rotate-[24deg] transform origin-bottom" />
                    <span className="w-0.5 h-3.5 bg-[#2da44e] rounded-full" />
                    <span className="w-0.5 h-2.5 bg-[#2da44e] rounded-full rotate-[24deg] transform origin-bottom" />
                  </div>

                  {/* White Pill Card */}
                  <div className="bg-white rounded-2xl shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 p-3 sm:p-3.5 pr-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-500 shrink-0">
                      {(() => {
                        const preview = HERO_BADGE_PREVIEWS[heroActiveBadgeId] || HERO_BADGE_PREVIEWS['pull-shark'];
                        if (preview.icon === 'timer') return <Clock size={18} className="text-amber-600" />;
                        if (preview.icon === 'zap') return <Zap size={18} className="text-amber-600" />;
                        if (preview.icon === 'brain') return <Sparkles size={18} className="text-amber-600" />;
                        if (preview.icon === 'users') return <Users size={18} className="text-amber-600" />;
                        if (preview.icon === 'star') return <Star size={18} className="fill-amber-400 text-amber-600" />;
                        return <Trophy size={18} className="fill-amber-400/30 text-amber-600" />;
                      })()}
                    </div>
                    <div className="text-left">
                      <p className="text-xs sm:text-[13px] font-bold text-[#161B22] leading-tight">
                        {(HERO_BADGE_PREVIEWS[heroActiveBadgeId] || HERO_BADGE_PREVIEWS['pull-shark']).line1}
                      </p>
                      <p className="text-xs sm:text-[13px] font-bold text-[#161B22] leading-tight">
                        {(HERO_BADGE_PREVIEWS[heroActiveBadgeId] || HERO_BADGE_PREVIEWS['pull-shark']).line2}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-[#2da44e] flex items-center justify-center text-[#2da44e] ml-1 shrink-0">
                      <Check size={13} strokeWidth={3} />
                    </div>
                  </div>
                </motion.div>

                {/* 9. Floating Bottom-Left Pill: "Mission Completed!" (z-30) */}
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  className="absolute -bottom-3 left-0 sm:-left-4 z-30"
                >
                  <div className="bg-white rounded-full sm:rounded-2xl shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 px-4 sm:px-5 py-2.5 sm:py-3 flex items-center gap-2.5 sm:gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-[#2da44e] flex items-center justify-center text-[#2da44e] shrink-0">
                      <Check size={13} strokeWidth={3} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#161B22] tracking-tight whitespace-nowrap">
                      Mission Completed!
                    </span>
                  </div>
                </motion.div>

                {/* 10. Floating Bottom-Right 3D Hexagonal Badge: Star (z-25) */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute bottom-2 right-1 sm:-right-2 z-25 pointer-events-none"
                >
                  <HexBadge icon="star" size={54} />
                </motion.div>

                {/* 11. Subtle DEV badge in bottom-right corner */}
                <div className="absolute -bottom-4 right-1 sm:right-3 z-30 flex items-center gap-1.5 pointer-events-none">
                  <div className="relative w-8 h-8 rounded-full bg-[#0969da] text-white flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z" />
                    </svg>
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#f85149] ring-2 ring-white" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-mono font-bold shadow-2xs">
                    DEV
                  </span>
                </div>
              </div>

              {/* 12. Authentic GitHub Badges Interactive Dock (Beneath the 3D Graphic) */}
              <div className="w-full max-w-[420px] sm:max-w-[460px] mt-6 p-2 sm:p-2.5 rounded-2xl bg-[#F6F8FA] border border-[#D0D7DE] shadow-xs">
                <div className="flex items-center justify-between px-2 pb-1.5 text-[10px] font-mono text-[#656D76] uppercase tracking-wider font-semibold">
                  <span>Authentic Badge Targets</span>
                  <span className="text-[#2da44e] font-bold">100% Legitimate</span>
                </div>
                <div className="grid grid-cols-6 gap-1.5 bg-white p-2 rounded-xl border border-[#D0D7DE]/70">
                  {[
                    { id: 'pull-shark', name: 'Pull Shark', img: '/images/badges/pull-shark.png' },
                    { id: 'quickdraw', name: 'Quickdraw', img: '/images/badges/quickdraw.png' },
                    { id: 'yolo', name: 'YOLO', img: '/images/badges/yolo.png' },
                    { id: 'galaxy-brain', name: 'Galaxy Brain', img: '/images/badges/galaxy-brain.png' },
                    { id: 'pair-extraordinaire', name: 'Pair Extraordinaire', img: '/images/badges/pair-extraordinaire.png' },
                    { id: 'starstruck', name: 'Starstruck', img: '/images/badges/starstruck.png' },
                  ].map((badge) => {
                    const isSelected = heroActiveBadgeId === badge.id;
                    return (
                      <button
                        key={badge.id}
                        type="button"
                        onClick={() => {
                          setHeroActiveBadgeId(badge.id);
                          setSelectedBadgeId(badge.id);
                        }}
                        className={cn(
                          'relative flex flex-col items-center justify-center p-1.5 rounded-lg transition-all duration-150 cursor-pointer group',
                          isSelected
                            ? 'bg-[#dafbe1] border border-[#2da44e] shadow-2xs scale-105'
                            : 'hover:bg-slate-100 opacity-75 hover:opacity-100 border border-transparent'
                        )}
                        title={`Target: ${badge.name}`}
                      >
                        <img
                          src={badge.img}
                          alt={badge.name}
                          className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                          loading="lazy"
                        />
                        {isSelected && (
                          <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#2da44e]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 02: ACHIEVEMENT WALL ─────────────────────────────────── */}
      <section
        id="achievements"
        className="scroll-mt-20 py-20 bg-[#F6F8FA] border-b border-[#D0D7DE] select-none text-left"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dafbe1] text-[#1a7f37] border border-[#2da44e]/30 text-[11px] font-bold uppercase tracking-[0.16em] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2da44e]" />
              <span>Official GitHub Achievement Wall</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#161B22] tracking-[-0.035em] leading-[1.12]">
              These aren't profile decorations.
            </h2>
            <p className="text-base sm:text-lg text-[#656D76] max-w-2xl mx-auto font-normal leading-relaxed">
              Every achievement represents something you actually did on GitHub. Authenticated by GitHub server webhooks.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {[
              { id: 'all', label: 'All Badges (10)' },
              { id: 'starter', label: 'Starter Friendly (4)' },
              { id: 'tiers', label: 'Multi-Tier Multipliers (4)' },
              { id: 'legacy', label: 'Historic (1)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setBadgeCategoryFilter(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer select-none',
                  badgeCategoryFilter === tab.id
                    ? 'bg-[#161B22] text-white shadow-xs'
                    : 'bg-white text-[#656D76] border border-[#D0D7DE] hover:bg-slate-100 hover:text-[#161B22]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Achievement Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBadges.map((badge) => {
              const isSelected = badge.id === selectedBadgeId;
              return (
                <div
                  key={badge.id}
                  className={cn(
                    'p-5 rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-md cursor-pointer',
                    isSelected
                      ? 'border-[#2da44e] ring-2 ring-[#2da44e]/20 shadow-sm'
                      : 'border-[#D0D7DE]'
                  )}
                  onClick={() => {
                    setSelectedBadgeId(badge.id);
                    document.getElementById('first-achievement')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className="space-y-4">
                    {/* Badge Image Pedestal */}
                    <div className="w-full h-32 rounded-xl bg-[#F6F8FA] border border-[#E1E4E8] flex items-center justify-center relative overflow-hidden group-hover:border-[#2da44e]/40 transition-colors">
                      <img
                        src={badge.image}
                        alt={badge.name}
                        className="w-20 h-20 object-contain drop-shadow-sm group-hover:scale-108 transition-transform duration-200 select-none"
                        loading="lazy"
                      />
                      {badge.tiers && badge.tiers.length > 0 && (
                        <span className="absolute top-2.5 right-2.5 text-[9px] font-mono font-bold bg-[#dafbe1] text-[#1a7f37] border border-[#2da44e]/30 px-2 py-0.5 rounded-full shadow-2xs">
                          {badge.tiers.length} Tiers
                        </span>
                      )}
                    </div>

                    {/* Badge Title & Status */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-[#161B22] tracking-tight">
                          {badge.name}
                        </h3>
                        <span className="text-[10px] font-mono font-bold text-[#1a7f37] bg-[#dafbe1] px-2 py-0.5 rounded-full">
                          Official
                        </span>
                      </div>
                      <p className="text-xs text-[#656D76] font-medium leading-relaxed mt-1">
                        {badge.tagline}
                      </p>
                    </div>

                    {/* Requirement Note */}
                    <div className="pt-2 border-t border-[#E1E4E8] text-[11px] text-[#656D76] leading-relaxed">
                      <strong className="text-[#161B22]">Activity:</strong> {badge.howToGet}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 mt-2">
                    <button
                      type="button"
                      className="w-full py-2 px-3 rounded-lg bg-[#F6F8FA] group-hover:bg-[#161B22] group-hover:text-white border border-[#D0D7DE] text-xs font-bold text-[#161B22] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Start Mission</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 03: UNLOCK YOUR FIRST ACHIEVEMENT (Interactive Workbench) ── */}
      <section
        id="first-achievement"
        className="scroll-mt-20 py-20 bg-[#FFFFFF] border-b border-[#D0D7DE] select-none text-left"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dafbe1] text-[#1a7f37] border border-[#2da44e]/30 text-[11px] font-bold uppercase tracking-[0.16em] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2da44e]" />
              <span>Interactive Mission Runner</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#161B22] tracking-[-0.035em] leading-[1.12]">
              Your first achievement starts with one mission.
            </h2>
            <p className="text-base sm:text-lg text-[#656D76] max-w-2xl mx-auto font-normal leading-relaxed">
              Choose an achievement below, inspect its exact server criteria, and execute the verified Git commands.
            </p>
          </div>

          {/* 5-Step Progress Pathway Graphic */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10 text-center">
            {[
              { num: '01', title: 'Choose Badge', desc: 'Select target medal' },
              { num: '02', title: 'Inspect Criteria', desc: 'Read webhook rules' },
              { num: '03', title: 'Start Mission', desc: 'Launch Git recipe' },
              { num: '04', title: 'Execute Activity', desc: 'Push & merge PR' },
              { num: '05', title: 'Unlock Medal', desc: 'Profile reflects badge' },
            ].map((step, idx) => (
              <div
                key={step.num}
                className="p-3.5 rounded-xl bg-[#F6F8FA] border border-[#D0D7DE] space-y-1 shadow-2xs"
              >
                <div className="text-[10px] font-mono font-bold text-[#2da44e] uppercase tracking-wider">
                  Step {step.num}
                </div>
                <div className="text-xs font-bold text-[#161B22]">{step.title}</div>
                <div className="text-[11px] text-[#656D76]">{step.desc}</div>
              </div>
            ))}
          </div>

          {/* Interactive Badge Selector Pills */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {['quickdraw', 'pull-shark', 'pair-extraordinaire', 'yolo', 'galaxy-brain', 'starstruck'].map(
              (id) => {
                const badge = GITHUB_BADGES.find((b) => b.id === id);
                if (!badge) return null;
                const isSelected = activeBadge.id === badge.id;
                return (
                  <button
                    key={badge.id}
                    onClick={() => setSelectedBadgeId(badge.id)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-2 border transition-all cursor-pointer',
                      isSelected
                        ? 'bg-[#161B22] text-white border-[#161B22] shadow-xs'
                        : 'bg-white text-[#656D76] border-[#D0D7DE] hover:bg-slate-100 hover:text-[#161B22]'
                    )}
                  >
                    <img src={badge.image} alt={badge.name} className="w-4 h-4 object-contain" />
                    <span>{badge.name}</span>
                  </button>
                );
              }
            )}
          </div>

          {/* Dual-Pane Mission Workbench */}
          <div className="rounded-[28px] border border-[#D0D7DE] bg-white divide-y md:divide-y-0 md:divide-x divide-[#D0D7DE] grid md:grid-cols-12 overflow-hidden shadow-sm">
            {/* Left Column: Requirements & Pedestal (5 cols) */}
            <div className="md:col-span-5 p-6 sm:p-7 flex flex-col justify-between space-y-6 bg-[#FFFFFF]">
              <div className="space-y-5">
                {/* Badge Header Bar */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E1E4E8]">
                  <div>
                    <span className="text-[11px] font-mono text-[#2da44e] font-bold uppercase tracking-wider block">
                      Target Medal
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#161B22] tracking-tight mt-0.5">
                      {activeBadge.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-[#dafbe1] text-[#1a7f37] border border-[#2da44e]/30">
                    {activeBadge.difficulty}
                  </span>
                </div>

                {/* 3D Showcase Pedestal */}
                <div className="rounded-2xl border border-[#D0D7DE] bg-[#F6F8FA] p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-xl bg-white border border-[#D0D7DE] p-1.5 shadow-sm">
                    <img
                      src={activeBadge.image}
                      alt={activeBadge.name}
                      className="w-10 h-10 object-contain select-none"
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="text-sm font-semibold text-[#161B22] leading-snug">
                      {activeBadge.tagline}
                    </div>
                    <div className="text-xs font-mono text-[#656D76]">
                      Est. time:{' '}
                      <span className="text-[#161B22] font-bold">
                        {activeRecipe.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mission Context */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-[#161B22] block">
                    Mission Purpose:
                  </span>
                  <p className="text-xs text-[#656D76] leading-relaxed">
                    {activeRecipe.missionContext}
                  </p>
                </div>

                {/* GitHub Verification Rule */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-[#161B22] tracking-tight block">
                    Official Verification Criteria:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#656D76] leading-relaxed font-medium">
                    {activeBadge.requirements.slice(0, 3).map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-[#2da44e] shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Anti-Mistake Callout */}
              <div className="rounded-xl border border-amber-200/90 bg-amber-50/80 p-3.5 flex items-start gap-2.5 text-xs text-amber-950 leading-relaxed shadow-2xs">
                <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-amber-900 font-bold">Gotcha Warning:</strong>{' '}
                  {activeRecipe.gotchaNote}
                </span>
              </div>
            </div>

            {/* Right Column: Authentic GitHub CLI Terminal & Commands (7 cols) */}
            <div
              id="recipes"
              className="md:col-span-7 p-6 sm:p-7 bg-[#0D1117] text-[#c9d1d9] flex flex-col justify-between space-y-6 rounded-b-[28px] md:rounded-b-none md:rounded-r-[28px]"
            >
              <div className="space-y-4">
                {/* Terminal Window Header Bar */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#30363D]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#7ee787] font-bold uppercase tracking-wider">
                        Terminal
                      </span>
                      <span className="text-[#8b949e] font-mono text-xs select-none">/</span>
                      <span className="text-[11px] font-mono text-[#8b949e]">
                        mission-{activeBadge.id}.sh
                      </span>
                    </div>
                  </div>

                  {/* Master Copy All Button */}
                  <button
                    onClick={() => handleCopy(allActiveCommands, `${activeBadge.id}-all`)}
                    className="h-8 px-3 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] text-[11px] font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95"
                    title="Copy full 3-station bash script"
                  >
                    {copiedSnippet === `${activeBadge.id}-all` ? (
                      <>
                        <Check size={12} className="text-[#3fb950]" />
                        <span className="text-[#3fb950] font-bold">Script Copied!</span>
                      </>
                    ) : (
                      <>
                        <Zap size={12} className="text-[#3fb950] fill-[#3fb950]" />
                        <span>Copy All Steps</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 3 Numbered Steps with 1-Click Copy */}
                <div className="space-y-3">
                  {[
                    { label: activeRecipe.station1Label, cmd: activeRecipe.command1 },
                    { label: activeRecipe.station2Label, cmd: activeRecipe.command2 },
                    { label: activeRecipe.station3Label, cmd: activeRecipe.command3 },
                  ].map((step, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#f0f6fc] tracking-tight">
                          {step.label}
                        </span>
                        <span className="font-mono text-[10px] text-[#8b949e]">
                          Step {idx + 1} of 3
                        </span>
                      </div>
                      <div className="rounded-xl border border-[#30363D] bg-[#161B22] px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-inner hover:border-[#8b949e]/40 transition-colors">
                        <div className="flex items-center gap-2 font-mono text-xs overflow-hidden">
                          <span className="text-[#8b949e] select-none">$</span>
                          <code className="text-[#7ee787] truncate font-semibold">
                            {step.cmd}
                          </code>
                        </div>
                        <button
                          onClick={() => handleCopy(step.cmd, `${activeBadge.id}-${idx}`)}
                          className="shrink-0 text-xs text-[#c9d1d9] hover:text-white px-2 py-1 rounded bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition-all flex items-center gap-1 cursor-pointer select-none active:scale-95"
                          title="Copy command"
                        >
                          {copiedSnippet === `${activeBadge.id}-${idx}` ? (
                            <>
                              <Check size={12} className="text-[#3fb950]" />
                              <span className="text-[#3fb950] text-[11px] font-mono font-bold">
                                Copied
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span className="text-[11px] font-mono">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal Bottom Action */}
              <div className="pt-2">
                <Link
                  to={`/blueprints/gitglow/engine?badge=${activeBadge.id}`}
                  className="w-full py-3 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Play size={13} className="fill-current" />
                  <span>Launch Live Mission Session →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 04: HOW GITGLOW WORKS ─────────────────────────────────── */}
      <section
        id="how-it-works"
        className="scroll-mt-20 py-20 bg-[#F6F8FA] border-b border-[#D0D7DE] select-none text-left"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dafbe1] text-[#1a7f37] border border-[#2da44e]/30 text-[11px] font-bold uppercase tracking-[0.16em] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2da44e]" />
              <span>4-Step Execution Pipeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#161B22] tracking-[-0.035em] leading-[1.12]">
              Learn it. Do it. Earn it.
            </h2>
            <p className="text-base sm:text-lg text-[#656D76] max-w-2xl mx-auto font-normal leading-relaxed">
              No boring video playlists or fake README badges. A structured engineering workflow from zero to real contribution.
            </p>
          </div>

          {/* 4 Horizontal Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Discover a Mission',
                desc: 'Browse beginner-friendly challenges mapped directly to official GitHub profile achievements.',
                icon: <Search className="text-[#2da44e]" size={20} />,
                chip: 'Target Identification',
              },
              {
                step: '02',
                title: 'Follow the Guided Workflow',
                desc: 'Get exact CLI commands, branch conventions, and anti-mistake gotchas before pushing any code.',
                icon: <Terminal className="text-[#2da44e]" size={20} />,
                chip: 'Command Guidance',
              },
              {
                step: '03',
                title: 'Complete Real GitHub Activity',
                desc: 'Push commits, author pull requests, and co-author branches on live, indexed repositories.',
                icon: <GitPullRequest className="text-[#2da44e]" size={20} />,
                chip: 'Live Git Execution',
              },
              {
                step: '04',
                title: 'Track Verified Progress',
                desc: 'GitHub official event webhooks register your activity and award the genuine medallion to your profile.',
                icon: <Award className="text-[#2da44e]" size={20} />,
                chip: 'Webhook Verification',
              },
            ].map((card) => (
              <div
                key={card.step}
                className="p-6 rounded-2xl bg-white border border-[#D0D7DE] flex flex-col justify-between space-y-5 hover:-translate-y-1 transition-all duration-200 shadow-2xs hover:shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono font-extrabold text-[#2da44e]">
                      {card.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#F6F8FA] border border-[#D0D7DE] flex items-center justify-center">
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#161B22] tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#656D76] font-medium leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E1E4E8] text-[10px] font-mono text-[#656D76] font-bold uppercase tracking-wider">
                  {card.chip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 05: EXPLORE MISSIONS ──────────────────────────────────── */}
      <section
        id="missions"
        className="scroll-mt-20 py-20 bg-[#FFFFFF] border-b border-[#D0D7DE] select-none text-left"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dafbe1] text-[#1a7f37] border border-[#2da44e]/30 text-[11px] font-bold uppercase tracking-[0.16em] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2da44e]" />
              <span>Guided Missions Explorer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#161B22] tracking-[-0.035em] leading-[1.12]">
              Your next contribution starts here.
            </h2>
            <p className="text-base sm:text-lg text-[#656D76] max-w-2xl mx-auto font-normal leading-relaxed">
              Step-by-step developer challenges designed to build genuine muscle memory across core Git workflows.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {[
              { id: 'all', label: 'All Missions (6)' },
              { id: 'fundamentals', label: 'Fundamentals' },
              { id: 'pull-requests', label: 'Pull Requests' },
              { id: 'collaboration', label: 'Collaboration' },
              { id: 'open-source', label: 'Open Source' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setMissionCategoryFilter(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer select-none',
                  missionCategoryFilter === cat.id
                    ? 'bg-[#161B22] text-white shadow-xs'
                    : 'bg-[#F6F8FA] text-[#656D76] border border-[#D0D7DE] hover:bg-slate-100 hover:text-[#161B22]'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Mission Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredMissions.map((mission) => (
              <div
                key={mission.id}
                className="p-6 rounded-2xl bg-white border border-[#D0D7DE] flex flex-col justify-between space-y-5 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-4">
                  {/* Top Tags */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F6F8FA] text-[#656D76] border border-[#D0D7DE]">
                      {mission.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#1a7f37] bg-[#dafbe1] px-2 py-0.5 rounded-full">
                      {mission.difficulty}
                    </span>
                  </div>

                  {/* Title & Target Medal Pill */}
                  <div>
                    <h3 className="text-xl font-bold text-[#161B22] tracking-tight">
                      {mission.title}
                    </h3>
                    <p className="text-xs text-[#656D76] font-medium leading-relaxed mt-2">
                      {mission.summary}
                    </p>
                  </div>

                  {/* Target Achievement preview */}
                  <div className="p-3 rounded-xl bg-[#F6F8FA] border border-[#E1E4E8] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={mission.targetBadgeImage}
                        alt={mission.targetBadgeName}
                        className="w-7 h-7 object-contain"
                      />
                      <span className="text-xs font-bold text-[#161B22]">
                        Unlocks: {mission.targetBadgeName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#656D76] font-bold">
                      {mission.estimatedTime}
                    </span>
                  </div>

                  {/* Skills Practiced */}
                  <div className="text-[11px] text-[#656D76] space-y-1">
                    <strong className="text-[#161B22]">Skill Practiced:</strong>{' '}
                    <span>{mission.skillPracticed}</span>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-[#E1E4E8] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#1a7f37] font-bold">
                    {mission.completionRate}
                  </span>
                  <Link
                    to={`/blueprints/gitglow/engine?badge=${mission.id.replace(/^m\d+-/, '')}`}
                    className="text-xs font-bold text-[#161B22] hover:text-[#2da44e] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Start Mission</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Section Central CTA */}
          <div className="text-center">
            <Link
              to="/blueprints/gitglow/engine"
              className="h-12 px-8 rounded-full bg-[#161B22] hover:bg-[#24292f] text-white text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span>Explore All Missions →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SECTION 06: YOUR DEVELOPER PROGRESS ───────────────────────────── */}
      <section
        id="progress"
        className="scroll-mt-20 py-20 bg-[#F6F8FA] border-b border-[#D0D7DE] select-none text-left"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dafbe1] text-[#1a7f37] border border-[#2da44e]/30 text-[11px] font-bold uppercase tracking-[0.16em] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2da44e]" />
              <span>Real Progress Tracking</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#161B22] tracking-[-0.035em] leading-[1.12]">
              Your progress should be visible.
            </h2>
            <p className="text-base sm:text-lg text-[#656D76] max-w-2xl mx-auto font-normal leading-relaxed">
              Track completed missions, commit milestones, skills practiced, and achievement unlocks on one unified dashboard.
            </p>
          </div>

          {/* Product Dashboard Preview */}
          <div className="max-w-5xl mx-auto rounded-[28px] bg-white border border-[#D0D7DE] shadow-sm p-6 sm:p-8 space-y-8">
            {/* Top Stat Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-[#E1E4E8]">
              <div>
                <span className="text-[11px] font-mono text-[#656D76] uppercase tracking-wider block">
                  Missions Done
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#161B22] mt-0.5 block">
                  3 of 6
                </span>
                <span className="text-[10px] text-[#2da44e] font-semibold">Starter Track 50%</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#656D76] uppercase tracking-wider block">
                  Pull Requests Merged
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#161B22] mt-0.5 block">
                  2 Merged
                </span>
                <span className="text-[10px] text-[#2da44e] font-semibold">Pull Shark Unlocked</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#656D76] uppercase tracking-wider block">
                  Co-Authored Commits
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#161B22] mt-0.5 block">
                  1 Verified
                </span>
                <span className="text-[10px] text-[#2da44e] font-semibold">Git Trailer Valid</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#656D76] uppercase tracking-wider block">
                  Badges Earned
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#161B22] mt-0.5 block">
                  2 Official
                </span>
                <span className="text-[10px] text-[#2da44e] font-semibold">Indexed on GitHub</span>
              </div>
            </div>

            {/* Contribution Activity Heatmap Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#161B22]">
                  Contribution Heatmap Simulation
                </span>
                <span className="text-[11px] font-mono text-[#656D76]">
                  Real Commit Attribution
                </span>
              </div>
              {/* Heatmap Grid */}
              <div className="p-4 rounded-2xl bg-[#F6F8FA] border border-[#D0D7DE] overflow-x-auto">
                <div className="flex items-center gap-1.5 min-w-[500px]">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const levels = ['bg-[#EBEDF0]', 'bg-[#9BE9A8]', 'bg-[#40C463]', 'bg-[#30A14E]', 'bg-[#216E39]'];
                    const level = i % 7 === 0 ? levels[3] : i % 3 === 0 ? levels[2] : i % 5 === 0 ? levels[1] : levels[0];
                    return (
                      <div
                        key={i}
                        className={cn('w-3.5 h-3.5 rounded-xs transition-transform hover:scale-125', level)}
                        title={`Day ${i + 1}: Verified Git Activity`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Skill Mastery Row */}
            <div className="grid md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#F6F8FA] border border-[#D0D7DE] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#161B22]">Git Branching</span>
                  <span className="font-mono text-[#2da44e] font-bold">Level 2</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E1E4E8] overflow-hidden">
                  <div className="h-full bg-[#2da44e] w-[80%]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F6F8FA] border border-[#D0D7DE] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#161B22]">PR Etiquette</span>
                  <span className="font-mono text-[#2da44e] font-bold">Level 3</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E1E4E8] overflow-hidden">
                  <div className="h-full bg-[#2da44e] w-[100%]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F6F8FA] border border-[#D0D7DE] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#161B22]">Git Trailers</span>
                  <span className="font-mono text-[#2da44e] font-bold">Level 1</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E1E4E8] overflow-hidden">
                  <div className="h-full bg-[#2da44e] w-[60%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 07: REAL WORK. REAL CONTRIBUTIONS. ────────────────────── */}
      <section
        id="comparison"
        className="scroll-mt-20 py-20 bg-[#FFFFFF] border-b border-[#D0D7DE] select-none text-left"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dafbe1] text-[#1a7f37] border border-[#2da44e]/30 text-[11px] font-bold uppercase tracking-[0.16em] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2da44e]" />
              <span>Authenticity First</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#161B22] tracking-[-0.035em] leading-[1.12]">
              Not another GitHub profile generator.
            </h2>
            <p className="text-base sm:text-lg text-[#656D76] max-w-2xl mx-auto font-normal leading-relaxed">
              Why tech leads and engineering hiring managers respect official profile achievements instead of copy-pasted README shields.
            </p>
          </div>

          {/* Comparison Cards Grid */}
          <div className="rounded-[28px] border border-[#D0D7DE] bg-white divide-y md:divide-y-0 md:divide-x divide-[#D0D7DE] grid md:grid-cols-2 overflow-hidden shadow-sm">
            {/* Left Card: Typical README Generators */}
            <div className="p-7 sm:p-9 space-y-6 bg-[#F6F8FA]/60 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E1E4E8]">
                  <div>
                    <span className="text-[11px] font-mono text-[#656D76] font-bold uppercase tracking-wider block">
                      Typical Tools
                    </span>
                    <h3 className="text-xl font-extrabold text-[#161B22] tracking-tight mt-0.5">
                      README Profile Generators
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold">
                    Zero Verification
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-[13px] text-[#656D76] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Static image decorations:</strong> Anyone can copy markdown badges into a README in under 10 seconds.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Passive tutorials:</strong> Explains Git theory without hands-on practice, leaving beginners stuck when merge conflicts arise.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Fake skill claims:</strong> Generates "90% React" progress bars that provide zero proof of repository activity.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Superficial appearance:</strong> Experienced engineering managers scroll straight past README badges to inspect commit history.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Card: GitGlow Guided Missions */}
            <div className="p-7 sm:p-9 space-y-6 bg-white flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E1E4E8]">
                  <div>
                    <span className="text-[11px] font-mono text-[#2da44e] font-bold uppercase tracking-wider block">
                      The GitGlow Way
                    </span>
                    <h3 className="text-xl font-extrabold text-[#161B22] tracking-tight mt-0.5">
                      Guided Missions &amp; Real Activity
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#1a7f37] bg-[#dafbe1] border border-[#2da44e]/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Check size={11} /> Server Verified
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-[13px] text-[#161B22] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#2da44e] shrink-0 mt-0.5" />
                    <span><strong>Guided hands-on missions:</strong> Step-by-step CLI execution that builds genuine muscle memory for feature branching.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#2da44e] shrink-0 mt-0.5" />
                    <span><strong>Real pull requests &amp; merges:</strong> Authentic GitHub commits indexed by GitHub official event webhooks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#2da44e] shrink-0 mt-0.5" />
                    <span><strong>Multi-tier multipliers:</strong> Track progress toward Pull Shark x16 and Galaxy Brain x32 milestones.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#2da44e] shrink-0 mt-0.5" />
                    <span><strong>Actual developer growth:</strong> You earn achievements by doing real work, producing a profile that tech leads respect.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 08: FINAL CTA & FOOTER ────────────────────────────────── */}
      <section
        id="community"
        className="scroll-mt-20 py-20 bg-[#FFFFFF] select-none text-left"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Action Ribbon Card */}
          <div className="rounded-[32px] bg-[#0D1117] text-white p-8 sm:p-14 text-center space-y-6 mb-20 relative overflow-hidden shadow-2xl border border-[#30363D]">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#238636]/30 border border-[#2ea043]/40 text-[#7ee787] text-[11px] font-mono font-bold uppercase tracking-[0.16em]">
                <span className="w-1.5 h-1.5 bg-[#7ee787] rounded-full animate-pulse" />
                1-Click Mission Execution
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-[-0.035em] leading-[1.12]">
                Your next GitHub achievement starts today.
              </h2>
              <p className="text-base sm:text-lg text-white/80 max-w-lg mx-auto font-normal leading-relaxed">
                Choose a mission. Make your first contribution. Start building a profile that means something.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                <a
                  href="#missions"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('missions')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#A3E635] hover:bg-[#bef264] text-[#0D1117] font-bold text-xs uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer"
                >
                  Start Your First Mission →
                </a>
                <a
                  href="#achievements"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
                >
                  Explore Achievements
                </a>
              </div>
            </div>
          </div>

          {/* Clean Dedicated GitGlow Footer */}
          <footer className="pt-12 border-t border-[#D0D7DE]">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
              {/* Brand Column */}
              <div className="col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[8px] bg-[#0D1117] border border-white/15 flex items-center justify-center relative">
                    <Github size={15} className="text-white fill-current" />
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#A3E635]" />
                  </div>
                  <span className="text-lg font-bold text-[#161B22] tracking-tight">
                    GitGlow
                  </span>
                </div>
                <p className="text-xs text-[#656D76] leading-relaxed max-w-sm font-medium">
                  The guided mission platform for authentic GitHub developer achievements. Built to help beginners contribute meaningfully.
                </p>
              </div>

              {/* Column 1: Missions */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#161B22]">
                  Missions
                </h4>
                <ul className="space-y-2 text-xs text-[#656D76]">
                  <li><a href="#missions" className="hover:text-[#161B22] transition-colors">Quickdraw (120s)</a></li>
                  <li><a href="#missions" className="hover:text-[#161B22] transition-colors">Pull Shark (PR Merge)</a></li>
                  <li><a href="#missions" className="hover:text-[#161B22] transition-colors">Pair Programming</a></li>
                  <li><a href="#missions" className="hover:text-[#161B22] transition-colors">Open Source Track</a></li>
                </ul>
              </div>

              {/* Column 2: Achievements */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#161B22]">
                  Achievements
                </h4>
                <ul className="space-y-2 text-xs text-[#656D76]">
                  <li><a href="#achievements" className="hover:text-[#161B22] transition-colors">Official Badges</a></li>
                  <li><a href="#achievements" className="hover:text-[#161B22] transition-colors">Multi-Tier Multipliers</a></li>
                  <li><a href="#first-achievement" className="hover:text-[#161B22] transition-colors">Webhook Rules</a></li>
                  <li><a href="#how-it-works" className="hover:text-[#161B22] transition-colors">How It Works</a></li>
                </ul>
              </div>

              {/* Column 3: Community & Legal */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#161B22]">
                  Community
                </h4>
                <ul className="space-y-2 text-xs text-[#656D76]">
                  <li><Link to="/blueprints" className="hover:text-[#161B22] transition-colors">All Blueprints</Link></li>
                  <li><a href="https://github.com/guchchi" target="_blank" rel="noopener noreferrer" className="hover:text-[#161B22] transition-colors">GitHub Repository</a></li>
                  <li><Link to="/privacy" className="hover:text-[#161B22] transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-[#161B22] transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="pt-8 border-t border-[#E1E4E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#656D76]">
              <p>© 2026 GitGlow. An independent open-source blueprint platform.</p>
              <p className="text-[11px] text-[#8b949e]">
                GitHub and the GitHub logo are registered trademarks of GitHub, Inc.
              </p>
            </div>
          </footer>
        </div>
      </section>

    </div>
  );
};
