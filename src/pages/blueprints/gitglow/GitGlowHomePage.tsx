import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimationFrame } from 'motion/react';
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
  ShieldCheck,
  Ban,
  Box,
  ChevronRight,
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

// ─── 3D Flying Badge Card Component ──────────────────────────────────────────
const FlyingBadgeCard: React.FC<{
  badgeImg: string;
  name: string;
  tag: string;
  rotateY?: number;
  rotateX?: number;
  rotateZ?: number;
  yOffset?: number[];
  duration?: number;
  className?: string;
  onClick?: () => void;
}> = ({
  badgeImg,
  name,
  tag,
  rotateY = 0,
  rotateX = 0,
  rotateZ = 0,
  yOffset = [0, -10, 0],
  duration = 5,
  className,
  onClick,
}) => (
  <motion.div
    animate={{ y: yOffset }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      perspective: 1000,
    }}
    className={cn('cursor-pointer select-none group', className)}
    onClick={onClick}
  >
    <div
      style={{
        transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="relative p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D0D7DE] shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.04)] group-hover:shadow-[0_22px_44px_-8px_rgba(0,0,0,0.18)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#2da44e]/60"
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#F6F8FA] border border-[#E1E4E8] flex items-center justify-center p-1 shrink-0 shadow-2xs group-hover:border-[#2da44e]/30 transition-colors">
          <img
            src={badgeImg}
            alt={name}
            className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="text-left pr-1">
          <div className="text-xs sm:text-[13px] font-bold text-[#161B22] leading-tight flex items-center gap-1.5">
            <span>{name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2da44e]" />
          </div>
          <div className="text-[10px] font-mono text-[#656D76] font-medium mt-0.5">
            {tag}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── 3D Green Hexagon Badge (Matching GitHub Elements Reference) ─────────────
const GreenHexBadge: React.FC<{
  icon: 'fork' | 'star';
  size?: number;
  className?: string;
  rotateY?: number;
  rotateX?: number;
  rotateZ?: number;
  yOffset?: number[];
  duration?: number;
}> = ({
  icon,
  size = 54,
  className,
  rotateY = 0,
  rotateX = 0,
  rotateZ = 0,
  yOffset = [0, -8, 0],
  duration = 4.8,
}) => (
  <motion.div
    animate={{ y: yOffset }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    style={{ perspective: 1000 }}
    className={cn('cursor-pointer select-none group', className)}
  >
    <div
      style={{
        transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="relative filter drop-shadow-[0_12px_24px_rgba(45,164,78,0.32)] transition-transform duration-300 group-hover:scale-110"
    >
      <svg width={size} height={size * 1.15} viewBox="0 0 100 115" fill="none">
        <defs>
          <linearGradient id={`hexGrad-${icon}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3fb950" />
            <stop offset="50%" stopColor="#238636" />
            <stop offset="100%" stopColor="#196c2e" />
          </linearGradient>
          <linearGradient id={`hexStroke-${icon}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7ee787" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0d4420" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        {/* 3D bottom extrusion */}
        <polygon points="50,5 95,29 95,84 50,108 5,84 5,29" fill="#144620" transform="translate(0, 5)" />
        {/* Main Hex Face */}
        <polygon points="50,4 94,28 94,83 50,107 6,83 6,28" fill={`url(#hexGrad-${icon})`} stroke={`url(#hexStroke-${icon})`} strokeWidth="3.5" />
        {/* Inner Bevel highlight */}
        <polygon points="50,12 86,32 86,79 50,99 14,79 14,32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white pb-1.5 pointer-events-none">
        {icon === 'fork' ? <GitFork size={size * 0.42} strokeWidth={2.4} /> : <Star size={size * 0.42} className="fill-white" />}
      </div>
    </div>
  </motion.div>
);

// ─── Floating Status Pill Component (Exact Match to GitHub Elements) ──────────
const FloatingStatusPill: React.FC<{
  type: 'pr' | 'mission';
  rotateY?: number;
  rotateX?: number;
  rotateZ?: number;
  yOffset?: number[];
  duration?: number;
  className?: string;
}> = ({
  type,
  rotateY = 0,
  rotateX = 0,
  rotateZ = 0,
  yOffset = [0, -10, 0],
  duration = 5.2,
  className,
}) => (
  <motion.div
    animate={{ y: yOffset }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    style={{ perspective: 1000 }}
    className={cn('select-none group pointer-events-auto', className)}
  >
    <div
      style={{
        transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D0D7DE] shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_-6px_rgba(0,0,0,0.18)] transition-all duration-300 group-hover:scale-105"
    >
      {type === 'pr' ? (
        <>
          <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-2xs">
            <Trophy size={14} />
          </div>
          <span className="text-xs sm:text-[13px] font-bold text-[#161B22] tracking-tight">Pull Request Merged</span>
          <div className="w-5 h-5 rounded-full bg-[#dafbe1] text-[#1a7f37] border border-[#2da44e]/40 flex items-center justify-center ml-0.5">
            <Check size={11} strokeWidth={3} />
          </div>
        </>
      ) : (
        <>
          <div className="w-5 h-5 rounded-full bg-[#2da44e] text-white flex items-center justify-center shadow-2xs">
            <Check size={11} strokeWidth={3} />
          </div>
          <span className="text-xs sm:text-[13px] font-bold text-[#161B22] tracking-tight">Mission Completed!</span>
        </>
      )}
    </div>
  </motion.div>
);

// ─── 4-Point Sparkle Icon ────────────────────────────────────────────────────
const SparkleStar: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={cn('text-[#2da44e]', className)}>
    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
  </svg>
);

// ─── Anubi-Inspired 3D Orbital Hero Engine ────────────────────────────────────
interface OrbitItemDef {
  id: string;
  type: 'badge' | 'pr-pill' | 'mission-pill' | 'hex-fork' | 'hex-star';
  badgeImg?: string;
  name?: string;
  tag?: string;
  badgeId?: string;
  customTilt?: number;
}

const ORBIT_ITEMS_DEF: OrbitItemDef[] = [
  {
    id: 'orbit-pull-shark',
    type: 'badge',
    badgeImg: '/images/badges/pull-shark.png',
    name: 'Pull Shark',
    tag: 'First PR Merged',
    badgeId: 'pull-shark',
    customTilt: -3,
  },
  {
    id: 'orbit-pr-pill',
    type: 'pr-pill',
    customTilt: 2,
  },
  {
    id: 'orbit-hex-fork',
    type: 'hex-fork',
    customTilt: -5,
  },
  {
    id: 'orbit-quickdraw',
    type: 'badge',
    badgeImg: '/images/badges/quickdraw.png',
    name: 'Quickdraw',
    tag: 'Closed <5m',
    badgeId: 'quickdraw',
    customTilt: 4,
  },
  {
    id: 'orbit-galaxy-brain',
    type: 'badge',
    badgeImg: '/images/badges/galaxy-brain.png',
    name: 'Galaxy Brain',
    tag: 'Accepted Answer',
    badgeId: 'galaxy-brain',
    customTilt: 3,
  },
  {
    id: 'orbit-mission-pill',
    type: 'mission-pill',
    customTilt: -2,
  },
  {
    id: 'orbit-hex-star',
    type: 'hex-star',
    customTilt: 5,
  },
  {
    id: 'orbit-yolo',
    type: 'badge',
    badgeImg: '/images/badges/yolo.png',
    name: 'YOLO',
    tag: 'Direct PR Merge',
    badgeId: 'yolo',
    customTilt: -4,
  },
];

const AnubiOrbitalHeroStage: React.FC<{
  onSelectBadge: (badgeId: string) => void;
  children: React.ReactNode;
}> = ({ onSelectBadge, children }) => {
  // Temporary visibility toggle for floating orbit elements (kept intact for easy re-enabling)
  const SHOW_FLOATING_ELEMENTS = false;

  const [rotation, setRotation] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number>(0);
  const dragStartRotation = useRef<number>(0);
  const velocityRef = useRef<number>(0.0022);

  // Responsive radii based on viewport
  const [radii, setRadii] = useState<{ rx: number; ry: number }>({ rx: 530, ry: 195 });

  useEffect(() => {
    const updateRadii = () => {
      const w = window.innerWidth;
      if (w >= 1440) setRadii({ rx: 560, ry: 205 });
      else if (w >= 1280) setRadii({ rx: 520, ry: 190 });
      else if (w >= 1024) setRadii({ rx: 450, ry: 175 });
      else setRadii({ rx: 320, ry: 140 });
    };
    updateRadii();
    window.addEventListener('resize', updateRadii);
    return () => window.removeEventListener('resize', updateRadii);
  }, []);

  // Continuous Orbital Physics Loop
  useAnimationFrame((_, delta) => {
    if (SHOW_FLOATING_ELEMENTS && !isPaused && !isDragging) {
      setRotation((prev) => (prev + velocityRef.current * (delta / 16.67)) % (2 * Math.PI));
    }
  });

  // Pointer event handlers for interactive drag
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!SHOW_FLOATING_ELEMENTS) return;
    if ((e.target as HTMLElement).closest('input, button, a')) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartRotation.current = rotation;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!SHOW_FLOATING_ELEMENTS || !containerRef.current) return;
    if (isDragging) {
      const deltaX = e.clientX - dragStartX.current;
      const sensitivity = 0.0035;
      setRotation(dragStartRotation.current + deltaX * sensitivity);
      velocityRef.current = deltaX * 0.0001;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    velocityRef.current = 0.0022;
  };

  // Orbit angle calculations
  const tiltRad = -10 * (Math.PI / 180);
  const cosTilt = Math.cos(tiltRad);
  const sinTilt = Math.sin(tiltRad);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={cn(
        'relative w-full flex items-center justify-center select-none overflow-visible',
        SHOW_FLOATING_ELEMENTS ? 'min-h-[640px] lg:min-h-[700px]' : 'py-2 sm:py-6',
        isDragging ? 'cursor-grabbing' : 'cursor-default'
      )}
    >
      {/* ── 3D ORBITAL ELLIPSE GUIDELINE (Preserved, hidden for now) ── */}
      {SHOW_FLOATING_ELEMENTS && (
        <>
          <div
            aria-hidden="true"
            style={{
              width: radii.rx * 2,
              height: radii.ry * 2,
              transform: `translate(-50%, -50%) rotate(-10deg)`,
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-[100%] border border-[#2da44e]/20 border-dashed"
          />
          <div
            aria-hidden="true"
            style={{
              width: radii.rx * 2 - 30,
              height: radii.ry * 2 - 20,
              transform: `translate(-50%, -50%) rotate(-6deg)`,
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-[100%] border border-[#2da44e]/10"
          />
        </>
      )}

      {/* ── 3D ORBITING ITEMS (Preserved, hidden for now) ── */}
      {SHOW_FLOATING_ELEMENTS && (
        <div className="hidden lg:block pointer-events-none absolute inset-0 overflow-visible">
          {ORBIT_ITEMS_DEF.map((item, index) => {
            const theta = rotation + (2 * Math.PI * index) / ORBIT_ITEMS_DEF.length;
            const x0 = Math.cos(theta) * radii.rx;
            const y0 = Math.sin(theta) * radii.ry;

            // Projected coords with tilt
            const x = x0 * cosTilt - y0 * sinTilt;
            const y = x0 * sinTilt + y0 * cosTilt;

            // Depth 0 (far back) to 1 (front center)
            const depth = (Math.sin(theta) + 1) / 2;
            const isHovered = hoveredItemId === item.id;

            const scale = isHovered ? 1.2 : 0.72 + depth * 0.38;
            const opacity = isHovered ? 1 : 0.45 + depth * 0.55;
            const zIndex = isHovered ? 60 : Math.round(10 + depth * 30);

            const rotY = Math.cos(theta) * -24;
            const rotX = Math.sin(theta) * 10;
            const rotZ = Math.sin(theta) * -4 + (item.customTilt || 0);

            return (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  opacity,
                  zIndex,
                  perspective: 1000,
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease',
                }}
                onMouseEnter={() => {
                  setIsPaused(true);
                  setHoveredItemId(item.id);
                }}
                onMouseLeave={() => {
                  setIsPaused(false);
                  setHoveredItemId(null);
                }}
                className="pointer-events-auto cursor-pointer"
              >
                <div
                  style={{
                    transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                  onClick={() => {
                    if (item.badgeId) {
                      onSelectBadge(item.badgeId);
                      document.getElementById('first-achievement')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      document.getElementById('missions')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={cn(
                    'transition-all duration-200',
                    isHovered && 'filter drop-shadow-[0_16px_32px_rgba(45,164,78,0.35)]'
                  )}
                >
                  {item.type === 'badge' && item.badgeImg && (
                    <div className="relative p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D0D7DE] shadow-[0_12px_28px_rgba(0,0,0,0.1)] hover:border-[#2da44e] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#F6F8FA] border border-[#E1E4E8] flex items-center justify-center p-1 shrink-0">
                          <img
                            src={item.badgeImg}
                            alt={item.name}
                            className="w-full h-full object-contain filter drop-shadow-xs"
                            loading="lazy"
                          />
                        </div>
                        <div className="text-left pr-1 whitespace-nowrap">
                          <div className="text-xs font-bold text-[#161B22] flex items-center gap-1.5">
                            <span>{item.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2da44e]" />
                          </div>
                          <div className="text-[10px] font-mono text-[#656D76]">{item.tag}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === 'pr-pill' && (
                    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D0D7DE] shadow-[0_12px_28px_rgba(0,0,0,0.1)] whitespace-nowrap">
                      <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                        <Trophy size={14} />
                      </div>
                      <span className="text-xs font-bold text-[#161B22]">Pull Request Merged</span>
                      <div className="w-5 h-5 rounded-full bg-[#dafbe1] text-[#1a7f37] border border-[#2da44e]/40 flex items-center justify-center">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    </div>
                  )}

                  {item.type === 'mission-pill' && (
                    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D0D7DE] shadow-[0_12px_28px_rgba(0,0,0,0.1)] whitespace-nowrap">
                      <div className="w-6 h-6 rounded-full bg-[#2da44e] text-white flex items-center justify-center">
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-bold text-[#161B22]">Mission Completed!</span>
                    </div>
                  )}

                  {item.type === 'hex-fork' && <GreenHexBadge icon="fork" size={54} />}
                  {item.type === 'hex-star' && <GreenHexBadge icon="star" size={54} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CENTER: Gravitational Anchor (Hero Content) ── */}
      <div className="relative z-20 max-w-3xl xl:max-w-4xl mx-auto text-center pointer-events-auto px-4">
        {children}
      </div>

      {/* ── ANUBI-INSPIRED ORBIT CONTROLS & HINT BAR (Preserved, hidden for now) ── */}
      {SHOW_FLOATING_ELEMENTS && (
        <div className="hidden lg:flex absolute bottom-2 left-1/2 -translate-x-1/2 items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#D0D7DE] text-[11px] font-mono text-[#656D76] shadow-2xs select-none pointer-events-auto z-30">
          <span className="w-2 h-2 rounded-full bg-[#2da44e] animate-pulse" />
          <span>3D Orbital Stage</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">Drag to rotate orbit · Click any badge to inspect mission</span>
        </div>
      )}
    </div>
  );
};

// ─── 3D GitHub Achievement Medallion & Orbiting Badge Cards ──────────────────
const HERO_ACHIEVEMENT_CARDS = [
  {
    id: 'pull-shark',
    title: 'Pull Shark',
    badgeImage: '/images/badges/pull-shark.png',
    badgeAlt: 'GitHub Pull Shark Achievement Badge',
    statusText: '2 / 2 PRs',
    progress: 100,
    complete: true,
    positionClass: 'top-[4%] left-0',
    floatDelay: 0,
  },
  {
    id: 'starstruck',
    title: 'Starstruck',
    badgeImage: '/images/badges/starstruck.png',
    badgeAlt: 'GitHub Starstruck Achievement Badge',
    statusText: '15 / 16 ★',
    progress: 94,
    complete: false,
    positionClass: 'top-[8%] right-0',
    floatDelay: 0.4,
  },
  {
    id: 'quickdraw',
    title: 'Quickdraw',
    badgeImage: '/images/badges/quickdraw.png',
    badgeAlt: 'GitHub Quickdraw Achievement Badge',
    statusText: '< 5 min',
    progress: 75,
    complete: false,
    positionClass: 'bottom-[10%] left-0',
    floatDelay: 0.8,
  },
  {
    id: 'pair-extraordinaire',
    title: 'Pair Extraordinaire',
    badgeImage: '/images/badges/pair-extraordinaire.png',
    badgeAlt: 'GitHub Pair Extraordinaire Achievement Badge',
    statusText: 'Unlocked',
    progress: 100,
    complete: true,
    positionClass: 'bottom-[6%] right-0',
    floatDelay: 1.2,
  },
] as const;

const HeroMonument3D: React.FC = () => {
  return (
    <div className="relative w-full max-w-[580px] xl:max-w-[620px] flex flex-col items-center justify-center select-none">
      <div className="relative w-full h-[270px] sm:h-[470px] lg:h-[520px] flex items-center justify-center">
        {/* ── Thin Orbital Acid-Lime Connecting Lines ── */}
        <svg
          aria-hidden="true"
          className="hidden sm:block absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          viewBox="0 0 600 520"
          fill="none"
        >
          {/* Primary orbital ellipse connecting top-right & bottom-left cards */}
          <ellipse
            cx="300"
            cy="260"
            rx="236"
            ry="82"
            transform="rotate(-18 300 260)"
            stroke="#A3E635"
            strokeWidth="1.25"
            strokeOpacity="0.5"
          />
          {/* Secondary orbital ellipse connecting top-left & bottom-right cards */}
          <ellipse
            cx="300"
            cy="262"
            rx="212"
            ry="116"
            transform="rotate(14 300 262)"
            stroke="#A3E635"
            strokeWidth="1.1"
            strokeOpacity="0.26"
          />
          {/* Subtle ground orbital ring beneath medallion */}
          <ellipse
            cx="300"
            cy="404"
            rx="94"
            ry="17"
            stroke="#A3E635"
            strokeWidth="1.15"
            strokeOpacity="0.38"
          />
        </svg>

        {/* ── Floating Black GitHub Octocat Medallion (Center-Right Visual Anchor) ── */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-20 flex flex-col items-center justify-center"
        >
          <div
            style={{ perspective: 1100 }}
            className="relative cursor-pointer group"
          >
            <div
              style={{
                transform: 'rotateY(-14deg) rotateX(6deg) rotateZ(-2deg)',
                transformStyle: 'preserve-3d',
              }}
              className="relative w-[160px] h-[160px] sm:w-[176px] sm:h-[176px] lg:w-[188px] lg:h-[188px] rounded-full transition-transform duration-300 group-hover:scale-[1.03]"
            >
              {/* Outer Sculpted Metallic Black Rim */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(140deg, #3A414C 0%, #1E242C 45%, #0D1117 100%)',
                  boxShadow: `
                    inset 0 2px 5px rgba(255,255,255,0.34),
                    inset 0 -5px 10px rgba(0,0,0,0.85),
                    0 24px 42px -10px rgba(22,27,34,0.24),
                    0 10px 18px -4px rgba(22,27,34,0.14)
                  `,
                  padding: '12px',
                }}
              >
                {/* Recessed Charcoal Medallion Well */}
                <div
                  className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'radial-gradient(circle at 36% 30%, #1F252E 0%, #12161C 68%, #090C10 100%)',
                    boxShadow: 'inset 0 3px 9px rgba(0,0,0,0.92), inset 0 0 0 1.5px #2D343F',
                  }}
                >
                  {/* Subtle Editorial Metallic Sheen */}
                  <div
                    className="absolute inset-0 rounded-full opacity-15 pointer-events-none"
                    style={{
                      background: 'linear-gradient(130deg, white 0%, transparent 42%, transparent 65%, rgba(255,255,255,0.1) 100%)',
                    }}
                  />

                  {/* Existing GitHub Octocat Artwork Preserved */}
                  <div
                    className="relative z-10 flex items-center justify-center"
                    style={{
                      filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.75))',
                    }}
                  >
                    <Github
                      size={88}
                      className="text-[#E5E7EB] fill-[#E5E7EB]"
                      style={{
                        filter: 'drop-shadow(0 -1px 1px rgba(255,255,255,0.55))',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Soft Natural Ground Shadow Beneath Medallion */}
          <div
            aria-hidden="true"
            className="mt-6 w-[124px] sm:w-[144px] h-[16px] rounded-full bg-[#161B22]/10 blur-[8px] pointer-events-none"
          />
        </motion.div>

        {/* ── ONLY FOUR Editorial Achievement Cards (Desktop/Tablet Orbit) ── */}
        {HERO_ACHIEVEMENT_CARDS.map((card) => (
          <motion.div
            key={card.id}
            animate={{ y: [0, card.floatDelay % 0.8 === 0 ? -4 : 4, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: card.floatDelay }}
            className={cn(
              'hidden sm:block absolute z-30 w-[166px] lg:w-[178px] rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB]/90 p-3 shadow-[0_14px_30px_rgba(22,27,34,0.06),0_2px_6px_rgba(22,27,34,0.03)]',
              card.positionClass
            )}
          >
            <div className="flex items-center gap-2.5 mb-2">
              {/* Actual GitHub Achievement Badge Icon in 3D Black Coin Frame */}
              <div style={{ perspective: 500 }} className="shrink-0">
                <div
                  style={{
                    transform: 'rotateY(-10deg) rotateX(6deg)',
                    background: 'linear-gradient(155deg, #2B313B 0%, #161B22 65%, #0D1117 100%)',
                    boxShadow:
                      'inset 0 1px 1px rgba(255,255,255,0.28), inset 0 -2px 4px rgba(0,0,0,0.65), 0 4px 10px rgba(22,27,34,0.18)',
                  }}
                  className="w-9 h-9 rounded-full border border-[#30363D] flex items-center justify-center p-1.5"
                >
                  <img
                    src={card.badgeImage}
                    alt={card.badgeAlt}
                    className="w-full h-full object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-bold text-[#161B22] leading-[1.2] tracking-tight truncate">
                  {card.title}
                </div>
              </div>

              {card.complete && (
                <span
                  aria-label="Completed"
                  className="w-4 h-4 rounded-full bg-[#A3E635] text-[#161B22] flex items-center justify-center shrink-0"
                >
                  <Check size={10} strokeWidth={3} />
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-[10.5px] font-mono text-[#57606A] mb-1.5">
              <span>{card.complete ? 'Status' : 'Progress'}</span>
              <span className={cn('font-semibold', card.complete ? 'text-[#3F6212]' : 'text-[#161B22]')}>
                {card.statusText}
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-[#ECEEE7] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#A3E635] transition-all duration-500"
                style={{ width: `${card.progress}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Compact 2x2 Badge Grid on Small Mobile Viewports */}
      <div className="grid sm:hidden grid-cols-2 gap-3 mt-4 w-full max-w-[360px]">
        {HERO_ACHIEVEMENT_CARDS.map((card) => (
          <div
            key={card.id}
            className="rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] p-2.5 shadow-[0_6px_16px_rgba(22,27,34,0.05)]"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div
                style={{
                  background: 'linear-gradient(155deg, #2B313B 0%, #161B22 65%, #0D1117 100%)',
                }}
                className="w-7 h-7 rounded-full border border-[#30363D] flex items-center justify-center p-1 shrink-0"
              >
                <img src={card.badgeImage} alt={card.badgeAlt} className="w-full h-full object-contain" />
              </div>
              <div className="text-[11px] font-bold text-[#161B22] truncate flex-1">{card.title}</div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#57606A] mb-1">
              <span>{card.complete ? 'Status' : 'Progress'}</span>
              <span className={cn('font-semibold', card.complete ? 'text-[#3F6212]' : 'text-[#161B22]')}>
                {card.statusText}
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-[#ECEEE7] overflow-hidden">
              <div className="h-full rounded-full bg-[#A3E635]" style={{ width: `${card.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GitGlowHomePage: React.FC = () => {
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>('quickdraw');
  const [badgeCategoryFilter, setBadgeCategoryFilter] = useState<string>('all');
  const [missionCategoryFilter, setMissionCategoryFilter] = useState<string>('all');
  const [badgeSearchQuery, setBadgeSearchQuery] = useState<string>('');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeFaqId, setActiveFaqId] = useState<number | null>(null);

  // Centered Username Scanner State
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{ handle: string; targetId: string; targetName: string } | null>(null);

  const simulateProfileScan = (handle: string) => {
    const cleanHandle = handle.trim().replace(/^@/, '') || 'developer';
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        handle: cleanHandle,
        targetId: 'pull-shark',
        targetName: 'Pull Shark (First PR Merge)',
      });
    }, 650);
  };

  const handleScanProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      simulateProfileScan('developer');
      return;
    }
    simulateProfileScan(usernameInput);
  };

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

      {/* ─── SECTION 01: HERO (Airy 2-Column Editorial Layout, 3-Second Clarity) ─── */}
      <section
        id="hero"
        className="relative w-full pt-36 pb-16 sm:pt-40 sm:pb-20 lg:pt-44 lg:pb-24 bg-[#FAF9F5] text-[#161B22] overflow-hidden border-b border-[#E1E4E8]/60"
      >
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-12 xl:gap-16">
            {/* ── LEFT COLUMN: Eyebrow, 2-Line Headline, Value Prop, Primary Scanner ── */}
            <div className="lg:col-span-6 text-left z-20">
              {/* Eyebrow Pill */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASING.PREMIUM }}
                className="mb-7 inline-flex"
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#F5F7EC] text-[#161B22] border border-[#DCE6BE] text-[12.5px] font-medium tracking-tight select-none">
                  <span className="relative flex items-center justify-center w-3.5 h-3.5 shrink-0">
                    <SparkleStar size={12} className="relative text-[#161B22]" />
                  </span>
                  <span>Official GitHub Profile Badges · Zero OAuth</span>
                </div>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASING.PREMIUM, delay: 0.06 }}
                className="mb-6"
              >
                <h1 className="text-[42px] sm:text-[54px] lg:text-[58px] xl:text-[66px] font-extrabold text-[#161B22] tracking-[-0.035em] leading-[1.08] select-none">
                  Unlock official GitHub <br />
                  badges{' '}
                  <span className="relative inline-block ml-1">
                    <span
                      aria-hidden="true"
                      className="absolute -inset-x-2 inset-y-0.5 bg-[#D4F843] -skew-x-6 rounded-[4px]"
                    />
                    <span className="relative italic font-serif font-bold text-[#161B22] px-1">
                      in minutes.
                    </span>
                  </span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASING.PREMIUM, delay: 0.12 }}
                className="text-[15.5px] sm:text-[17px] text-[#4B5563] font-normal leading-[1.65] max-w-[470px] mb-9"
              >
                GitHub hides the rules behind every profile badge. Scan your username for 60-second PR &amp; merge missions that earn Pull Shark, Quickdraw, and YOLO—on your real profile.
              </motion.p>

              {/* Primary Search Action Block */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASING.PREMIUM, delay: 0.16 }}
                className="max-w-[480px] w-full"
              >
                <form onSubmit={handleScanProfile} className="relative">
                  <div className="relative flex items-center w-full rounded-full bg-white border border-[#D0D7DE] shadow-[0_8px_24px_rgba(22,27,34,0.05)] hover:border-[#161B22]/40 p-1.5 pl-4 transition-all duration-200 focus-within:border-[#84CC16] focus-within:ring-3 focus-within:ring-[#D4F843]/40">
                    <Search size={16} className="text-[#57606A] shrink-0 mr-2.5" />
                    <span className="text-[#57606A] text-[13px] font-mono shrink-0 select-none">
                      github.com/&nbsp;
                    </span>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="your-username"
                      aria-label="GitHub username"
                      className="flex-1 min-w-0 bg-transparent text-[13px] font-mono text-[#161B22] placeholder:text-[#9CA3AF] focus:outline-none py-1.5"
                    />
                    <button
                      type="submit"
                      disabled={isScanning}
                      className="shrink-0 h-10 px-4 sm:px-5 rounded-full bg-[#0D1117] hover:bg-[#1C2128] text-white text-[13px] font-semibold flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                      aria-label="Check My Badges"
                    >
                      {isScanning ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Checking</span>
                        </>
                      ) : (
                        <>
                          <span>Check My Badges</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Quiet Demo Handles + Secondary Escape Link */}
                <div className="mt-4 px-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[12px] text-[#57606A]">
                  <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1">
                    <span className="font-medium text-[#6B7280]">Demo:</span>
                    {['torvalds', 'shadcn', 'gaearon'].map((handle, idx) => (
                      <React.Fragment key={handle}>
                        {idx > 0 && <span aria-hidden="true" className="text-[#D0D7DE]">·</span>}
                        <button
                          type="button"
                          onClick={() => {
                            setUsernameInput(handle);
                            simulateProfileScan(handle);
                          }}
                          className="font-mono text-[#374151] hover:text-[#161B22] underline underline-offset-4 decoration-[#D0D7DE] hover:decoration-[#161B22] transition-colors cursor-pointer"
                        >
                          @{handle}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>

                  <a
                    href="#achievements"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="font-medium text-[#374151] hover:text-[#161B22] transition-colors whitespace-nowrap"
                  >
                    Browse all 10 badge guides ↓
                  </a>
                </div>

                {/* Scan result notification if scanned */}
                {scanResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-5 px-4 py-3 rounded-2xl bg-[#EAFBEE] border border-[#2DA44E]/30 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#2DA44E] animate-pulse shrink-0" />
                      <div>
                        <div className="text-[12px] font-semibold text-[#1A7F37]">@{scanResult.handle} — ready</div>
                        <div className="text-[11px] text-[#444D56]">Start with: <strong>{scanResult.targetName}</strong></div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setSelectedBadgeId(scanResult.targetId); document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' }); }}
                      className="px-3 py-1.5 rounded-full bg-[#2DA44E] hover:bg-[#238636] text-white text-[11px] font-semibold shrink-0 cursor-pointer transition-colors"
                    >
                      View Mission →
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* ── RIGHT COLUMN: 3D GitHub Achievement Visualization ── */}
            <div className="lg:col-span-6 flex items-center justify-center lg:justify-end z-20">
              <HeroMonument3D />
            </div>
          </div>

          {/* ── BOTTOM CENTER UNDERSTATED PROOF STRIP ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-14 lg:mt-16 flex justify-center relative z-30"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-7 px-6 sm:px-8 py-3 rounded-full bg-white/75 backdrop-blur-sm border border-[#E1E4E8] shadow-[0_8px_24px_rgba(22,27,34,0.04)] text-[12px] sm:text-[12.5px] font-medium text-[#374151]">
              <div className="flex items-center gap-2">
                <Compass size={14} className="text-[#161B22]" />
                <span>Real GitHub Triggers</span>
              </div>
              <span className="hidden sm:inline text-[#D0D7DE]">|</span>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-[#161B22]" />
                <span>Step-by-Step PR Recipes</span>
              </div>
              <span className="hidden sm:inline text-[#D0D7DE]">|</span>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-[#161B22]" />
                <span>Verified on Your Profile</span>
              </div>
              <span className="hidden sm:inline text-[#D0D7DE]">|</span>
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-[#161B22]" />
                <span>No Login Required</span>
              </div>
            </div>
          </motion.div>
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
