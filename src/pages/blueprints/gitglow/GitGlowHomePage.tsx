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
  BookOpen,
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
      className="relative p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E3DA] shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.04)] group-hover:shadow-[0_22px_44px_-8px_rgba(0,0,0,0.18)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#84CC16]/60"
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] flex items-center justify-center p-1 shrink-0 shadow-2xs group-hover:border-[#84CC16]/30 transition-colors">
          <img
            src={badgeImg}
            alt={name}
            className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="text-left pr-1">
          <div className="text-xs sm:text-[13px] font-bold text-[#101114] leading-tight flex items-center gap-1.5">
            <span>{name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
          </div>
          <div className="text-[10px] font-mono text-[#65666A] font-medium mt-0.5">
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
      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E3DA] shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_-6px_rgba(0,0,0,0.18)] transition-all duration-300 group-hover:scale-105"
    >
      {type === 'pr' ? (
        <>
          <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-2xs">
            <Trophy size={14} />
          </div>
          <span className="text-xs sm:text-[13px] font-bold text-[#101114] tracking-tight">Pull Request Merged</span>
          <div className="w-5 h-5 rounded-full bg-[#F7F8EF] text-[#101114] border border-[#DCE89E] flex items-center justify-center ml-0.5">
            <Check size={11} strokeWidth={3} className="text-[#84CC16]" />
          </div>
        </>
      ) : (
        <>
          <div className="w-5 h-5 rounded-full bg-[#84CC16] text-white flex items-center justify-center shadow-2xs">
            <Check size={11} strokeWidth={3} />
          </div>
          <span className="text-xs sm:text-[13px] font-bold text-[#101114] tracking-tight">Mission Completed!</span>
        </>
      )}
    </div>
  </motion.div>
);

// ─── 4-Point Sparkle Icon ────────────────────────────────────────────────────
const SparkleStar: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={cn('text-[#84CC16]', className)}>
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
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-[100%] border border-[#84CC16]/20 border-dashed"
          />
          <div
            aria-hidden="true"
            style={{
              width: radii.rx * 2 - 30,
              height: radii.ry * 2 - 20,
              transform: `translate(-50%, -50%) rotate(-6deg)`,
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-[100%] border border-[#84CC16]/10"
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
                    isHovered && 'filter drop-shadow-[0_16px_32px_rgba(132,204,22,0.35)]'
                  )}
                >
                  {item.type === 'badge' && item.badgeImg && (
                    <div className="relative p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E3DA] shadow-[0_12px_28px_rgba(0,0,0,0.1)] hover:border-[#84CC16] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] flex items-center justify-center p-1 shrink-0">
                          <img
                            src={item.badgeImg}
                            alt={item.name}
                            className="w-full h-full object-contain filter drop-shadow-xs"
                            loading="lazy"
                          />
                        </div>
                        <div className="text-left pr-1 whitespace-nowrap">
                          <div className="text-xs font-bold text-[#101114] flex items-center gap-1.5">
                            <span>{item.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                          </div>
                          <div className="text-[10px] font-mono text-[#65666A]">{item.tag}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === 'pr-pill' && (
                    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E3DA] shadow-[0_12px_28px_rgba(0,0,0,0.1)] whitespace-nowrap">
                      <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                        <Trophy size={14} />
                      </div>
                      <span className="text-xs font-bold text-[#101114]">Pull Request Merged</span>
                      <div className="w-5 h-5 rounded-full bg-[#F7F8EF] text-[#101114] border border-[#DCE89E] flex items-center justify-center">
                        <Check size={11} strokeWidth={3} className="text-[#84CC16]" />
                      </div>
                    </div>
                  )}

                  {item.type === 'mission-pill' && (
                    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E3DA] shadow-[0_12px_28px_rgba(0,0,0,0.1)] whitespace-nowrap">
                      <div className="w-6 h-6 rounded-full bg-[#84CC16] text-white flex items-center justify-center">
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-bold text-[#101114]">Mission Completed!</span>
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
        <div className="hidden lg:flex absolute bottom-2 left-1/2 -translate-x-1/2 items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#E5E3DA] text-[11px] font-mono text-[#65666A] shadow-2xs select-none pointer-events-auto z-30">
          <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
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
    badgeImage: '/images/gitglow/badge-pull-shark.svg',
    badgeAlt: 'GitHub Pull Shark Achievement Badge',
    statusText: 'Earned',
    progress: 100,
    positionClass: 'top-[2%] left-[2%] lg:left-[3%] rotate-[-4.5deg]',
    floatDelay: 0,
  },
  {
    id: 'quickdraw',
    title: 'Quickdraw',
    badgeImage: '/images/gitglow/badge-quickdraw.svg',
    badgeAlt: 'GitHub Quickdraw Achievement Badge',
    statusText: 'Earned',
    progress: 100,
    positionClass: 'top-[7%] right-0 lg:-right-[1%] rotate-[4.5deg]',
    floatDelay: 0.45,
  },
  {
    id: 'yolo',
    title: 'YOLO',
    badgeImage: '/images/gitglow/badge-yolo.svg',
    badgeAlt: 'GitHub YOLO Achievement Badge',
    statusText: 'Earned',
    progress: 100,
    positionClass: 'bottom-[22%] left-0 rotate-[-3.5deg]',
    floatDelay: 0.9,
  },
] as const;

const HeroMonument3D: React.FC = () => {
  return (
    <div className="relative w-full max-w-[780px] flex flex-col items-center justify-center select-none">
      <div className="relative w-full h-auto sm:h-[500px] lg:h-[clamp(480px,62vh,600px)] flex items-center justify-center py-2 sm:py-0">
        {/* ── Broad Soft Acid-Lime Backlight Behind Trophy ── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 58% 58% at 54% 48%, rgba(223,255,131,0.72) 0%, rgba(215,255,54,0.24) 48%, transparent 76%)',
          }}
        />

        {/* ── Back Orbital Layer (Behind Medallion, z-10) ── */}
        <svg
          aria-hidden="true"
          className="hidden sm:block absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          viewBox="0 0 760 600"
          fill="none"
        >
          {/* Secondary subtle pale-lime outer orbit */}
          <ellipse
            cx="408"
            cy="268"
            rx="300"
            ry="112"
            transform="rotate(-17 408 268)"
            stroke="#DFFF83"
            strokeWidth="1.5"
            strokeOpacity="0.65"
          />
          {/* Back half of main lime orbit passing behind medallion */}
          <path
            d="M 151.71 346.36 A 268 82 -17 0 1 664.29 189.64"
            stroke="#A3E635"
            strokeWidth="2"
            strokeOpacity="0.42"
            strokeLinecap="round"
          />
        </svg>

        {/* Crisp 4-Point Sparkle Stars (exact reference positions) */}
        <SparkleStar size={16} className="hidden sm:block absolute top-[8%] right-[32%] text-[#101114] z-30" />
        <SparkleStar size={14} className="hidden sm:block absolute top-[35%] left-[19%] text-[#101114] z-30" />
        <SparkleStar size={14} className="hidden sm:block absolute bottom-[40%] right-[7%] text-[#101114] z-30" />

        {/* ── Centerpiece Column: 304px Metallic Octocat Medallion + Sculpted Physical Plinth ── */}
        <div className="relative z-20 flex flex-col items-center justify-center sm:translate-x-[3%] lg:translate-x-[4%]">
          {/* Floating Metallic 3D Medallion (~300–310px at 1672x941) */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-20 flex flex-col items-center"
          >
            <div
              className="relative group cursor-pointer"
              style={{
                width: 'clamp(192px, min(18.2vw, 32.4vh), 306px)',
                height: 'clamp(192px, min(18.2vw, 32.4vh), 306px)',
                perspective: '1200px',
              }}
            >
              {/* 3D Extruded Machined Rim Thickness Layer (Right Edge Depth) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full translate-x-[12px] translate-y-[2px]"
                style={{
                  background:
                    'linear-gradient(175deg, #525864 0%, #1F2329 36%, #0B0C0E 68%, #9DE823 92%, #181A1F 100%)',
                  boxShadow: '14px 20px 36px rgba(16,17,20,0.28)',
                }}
              />

              {/* Front Sculpted Medallion Body */}
              <div
                className="relative w-full h-full rounded-full transition-transform duration-300 group-hover:scale-[1.02]"
                style={{
                  transform: 'rotateY(-16deg) rotateX(6deg)',
                  background:
                    'linear-gradient(142deg, #4B515C 0%, #242830 28%, #101216 68%, #07080A 100%)',
                  padding: '6.5%',
                  boxShadow:
                    'inset 2px 3px 6px rgba(255,255,255,0.42), inset -4px -8px 14px rgba(0,0,0,0.9), 0 28px 50px -12px rgba(16,17,20,0.42)',
                }}
              >
                {/* Concentric Machined Inner Grooves */}
                <div
                  className="w-full h-full rounded-full p-[3.5%] relative"
                  style={{
                    background: 'linear-gradient(155deg, #17191E 0%, #2E333C 48%, #0E1013 100%)',
                    boxShadow:
                      'inset 0 2px 6px rgba(0,0,0,0.92), 0 0 0 1px rgba(255,255,255,0.14)',
                  }}
                >
                  {/* Deep Satin Coin Well */}
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                    style={{
                      background:
                        'radial-gradient(circle at 38% 28%, #282D35 0%, #16191F 54%, #0B0D10 100%)',
                      boxShadow:
                        'inset 0 8px 20px rgba(0,0,0,0.95), inset 0 -4px 12px rgba(190,248,55,0.22)',
                    }}
                  >
                    {/* Directional Studio Rim Sheen */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full opacity-25 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(132deg, rgba(255,255,255,0.6) 0%, transparent 38%, transparent 72%, rgba(215,255,54,0.35) 100%)',
                      }}
                    />

                    {/* Pure Brushed Metallic Silver/White GitHub Octocat Silhouette (No Outer Ring) */}
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="relative z-10 w-[68%] h-[68%] translate-y-[2%] drop-shadow-[0_12px_18px_rgba(0,0,0,0.85)]"
                    >
                      <defs>
                        <linearGradient id="octocatSilver" x1="4" y1="3" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="52%" stopColor="#DFE4EA" />
                          <stop offset="100%" stopColor="#949CA8" />
                        </linearGradient>
                        <mask id="pureOctocatMask">
                          <rect x="0" y="0" width="24" height="24" fill="black" />
                          <circle cx="12" cy="12" r="9.75" fill="white" />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            fill="black"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          />
                        </mask>
                      </defs>
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        fill="url(#octocatSilver)"
                        mask="url(#pureOctocatMask)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Cylindrical Metallic Stem Connection */}
            <div
              aria-hidden="true"
              className="-mt-2 rounded-b-[45%] z-20"
              style={{
                width: 'clamp(42px, 3.6vw, 62px)',
                height: 'clamp(16px, 1.5vw, 24px)',
                background: 'linear-gradient(90deg, #101215 0%, #484E58 35%, #1E2229 68%, #090A0C 100%)',
                boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.22), 0 8px 16px rgba(0,0,0,0.45)',
              }}
            />
          </motion.div>

          {/* ── Sculpted Physical 3D Stepped Trophy Pedestal (Multi-Layer Metallic Cylinders) ── */}
          <svg
            aria-hidden="true"
            viewBox="0 0 460 150"
            className="-mt-1 w-[clamp(260px,24.5vw,420px)] h-auto overflow-visible pointer-events-none z-10"
            fill="none"
          >
            <defs>
              <linearGradient id="pedWall" x1="70" y1="0" x2="390" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#14161A" />
                <stop offset="28%" stopColor="#3B4049" />
                <stop offset="56%" stopColor="#1D2026" />
                <stop offset="85%" stopColor="#0D0F12" />
                <stop offset="100%" stopColor="#262A31" />
              </linearGradient>
              <linearGradient id="pedTopFace" x1="230" y1="0" x2="230" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#343841" />
                <stop offset="100%" stopColor="#121418" />
              </linearGradient>
              <linearGradient id="limeBaseRim" x1="30" y1="90" x2="430" y2="115" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#99CC1F" stopOpacity="0.35" />
                <stop offset="30%" stopColor="#D7FF36" />
                <stop offset="70%" stopColor="#D7FF36" />
                <stop offset="100%" stopColor="#99CC1F" stopOpacity="0.35" />
              </linearGradient>
              <radialGradient id="pedGroundShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#101114" stopOpacity="0.34" />
                <stop offset="55%" stopColor="#101114" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#101114" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="pedLimeFloorBounce" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D7FF36" stopOpacity="0.55" />
                <stop offset="65%" stopColor="#D7FF36" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#D7FF36" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Natural Contact Shadow + Ambient Lime Reflection on Floor */}
            <ellipse cx="230" cy="116" rx="228" ry="26" fill="url(#pedGroundShadow)" />
            <ellipse cx="230" cy="106" rx="215" ry="22" fill="url(#pedLimeFloorBounce)" />

            {/* TIER 3 (Wide Base Cylindrical Body) */}
            <path
              d="M42 74 L42 98 C42 114 126 124 230 124 C334 124 418 114 418 98 L418 74 Z"
              fill="url(#pedWall)"
            />
            <ellipse cx="230" cy="74" rx="188" ry="24" fill="url(#pedTopFace)" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
            {/* Controlled Acid-Lime Lower Edge Lighting */}
            <path
              d="M42 96 C42 112 126 123 230 123 C334 123 418 112 418 96"
              stroke="url(#limeBaseRim)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* TIER 2 (Middle Machined Step Body) */}
            <path
              d="M94 46 L94 68 C94 80 155 88 230 88 C305 88 366 80 366 68 L366 46 Z"
              fill="url(#pedWall)"
            />
            <ellipse cx="230" cy="46" rx="136" ry="18" fill="url(#pedTopFace)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />

            {/* TIER 1 (Top Pedestal Collar Cap) */}
            <path
              d="M150 22 L150 40 C150 49 186 55 230 55 C274 55 310 49 310 40 L310 22 Z"
              fill="url(#pedWall)"
            />
            <ellipse cx="230" cy="22" rx="80" ry="12" fill="url(#pedTopFace)" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
          </svg>
        </div>

        {/* ── Foreground Orbital Acid-Lime Swoosh Layer (Passes In Front of Medallion, z-30) ── */}
        <svg
          aria-hidden="true"
          className="hidden sm:block absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
          viewBox="0 0 760 600"
          fill="none"
        >
          <defs>
            <linearGradient id="orbitFrontGrad" x1="152" y1="346" x2="664" y2="190" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D7FF36" stopOpacity="0.25" />
              <stop offset="28%" stopColor="#9EE620" stopOpacity="0.98" />
              <stop offset="72%" stopColor="#D7FF36" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#D7FF36" stopOpacity="0.22" />
            </linearGradient>
          </defs>
          <path
            d="M 151.71 346.36 A 268 82 -17 0 0 664.29 189.64"
            stroke="url(#orbitFrontGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>

        {/* ── Three Floating Tilted Achievement Cards ── */}
        {HERO_ACHIEVEMENT_CARDS.map((card) => (
          <motion.div
            key={card.id}
            animate={{ y: [0, card.floatDelay % 0.9 === 0 ? -5 : 5, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: card.floatDelay }}
            className={cn(
              'hidden sm:block absolute z-30 w-[clamp(182px,13.6vw,232px)] rounded-[20px] bg-white/92 backdrop-blur-md border border-[#E5E3DA] px-4 py-3.5 shadow-[0_18px_40px_rgba(16,17,20,0.08),0_2px_8px_rgba(16,17,20,0.04)]',
              card.positionClass
            )}
          >
            <div className="flex items-center gap-3 mb-2.5">
              <img
                src={card.badgeImage}
                alt={card.badgeAlt}
                className="w-11 h-11 lg:w-[50px] lg:h-[50px] object-contain shrink-0 drop-shadow-[0_6px_12px_rgba(16,17,20,0.16)]"
              />

              <div className="min-w-0 flex-1">
                <div className="text-[14px] lg:text-[16px] font-bold text-[#101114] leading-[1.15] tracking-tight truncate">
                  {card.title}
                </div>
                <div className="text-[12px] lg:text-[13px] text-[#65666A] font-medium mt-0.5">
                  {card.statusText}
                </div>
              </div>
            </div>

            <div className="w-full h-[4px] rounded-full bg-[#ECEAE0] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#A8E62E]"
                style={{ width: `${card.progress}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Compact 3-Card Row on Small Mobile Viewports */}
      <div className="grid sm:hidden grid-cols-3 gap-2.5 mt-4 w-full max-w-[390px]">
        {HERO_ACHIEVEMENT_CARDS.map((card) => (
          <div
            key={card.id}
            className="rounded-xl bg-white/95 border border-[#E5E3DA] p-2.5 shadow-[0_6px_16px_rgba(16,17,20,0.05)]"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <img src={card.badgeImage} alt={card.badgeAlt} className="w-7 h-7 object-contain shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-[#101114] truncate">{card.title}</div>
                <div className="text-[9.5px] text-[#65666A]">{card.statusText}</div>
              </div>
            </div>
            <div className="w-full h-1 rounded-full bg-[#ECEAE0] overflow-hidden">
              <div className="h-full rounded-full bg-[#A8E62E]" style={{ width: `${card.progress}%` }} />
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
    <div className="min-h-screen bg-[#FAF9F5] text-[#101114] overflow-x-hidden selection:bg-[#D7FF36] selection:text-[#101114]">

      {/* ─── SECTION 01: HERO (Full-Viewport 1672x941 Editorial Reconstruction) ─── */}
      <section
        id="hero"
        className="relative w-full pt-[72px] sm:pt-[82px] lg:pt-[98px] lg:min-h-[min(100vh,950px)] lg:flex lg:flex-col lg:justify-between bg-[#F7F6F0] text-[#101114] overflow-hidden border-b border-[#E5E3DA]"
      >
        {/* ── Phase 5: Micro-Grid Texture + Radial Lime Studio Atmosphere + Organic Curves ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-100"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(16,17,20,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,17,20,0.03) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(circle at 97% 14%, rgba(215,255,54,0.68) 0%, rgba(223,255,131,0.34) 22%, transparent 52%), radial-gradient(ellipse 46% 58% at 74% 48%, rgba(223,255,131,0.58) 0%, transparent 72%)',
          }}
        />

        <div className="relative w-full px-5 sm:px-8 lg:px-[6%] pt-7 sm:pt-9 lg:pt-[clamp(18px,3.2vh,38px)] pb-6 sm:pb-8 lg:pb-[clamp(18px,2.8vh,32px)] flex-1 flex flex-col justify-between z-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 my-auto">
            {/* ── LEFT COLUMN (~48%): Eyebrow, 90px Headline, 3-line Subheadline, 712x73 Scanner, Demo Row ── */}
            <div className="w-full lg:w-[48%] text-left z-20">
              {/* Eyebrow Pill */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASING.PREMIUM }}
                className="mb-5 lg:mb-[clamp(14px,2.2vh,26px)] inline-flex"
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#F7F8EF] text-[#101114] border border-[#DCE89E] text-[12.5px] sm:text-[13.5px] font-medium tracking-tight select-none shadow-[0_2px_10px_rgba(215,255,54,0.14)]">
                  <span className="relative flex items-center justify-center w-4 h-4 rounded-full bg-[#D7FF36] shrink-0">
                    <SparkleStar size={10} className="text-[#101114]" />
                  </span>
                  <span>Official GitHub Profile Badges · Zero OAuth</span>
                </div>
              </motion.div>

              {/* Main Headline (90px Sans ExtraBold + Serif Italic Highlight at 1672x941) */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASING.PREMIUM, delay: 0.06 }}
                className="mb-5 lg:mb-[clamp(14px,2vh,24px)]"
              >
                <h1 className="text-[clamp(40px,min(5.38vw,9.4vh),90px)] font-extrabold text-[#101114] tracking-[-0.04em] leading-[0.95] select-none">
                  Unlock official <br />
                  GitHub badges <br />
                  <span className="relative inline-flex items-center mt-1.5 align-middle">
                    <span className="relative inline-block bg-[#DDF748] rounded-[5px] px-2.5 sm:px-3.5 py-0.5 shadow-[0_2px_8px_rgba(215,255,54,0.18)]">
                      <span className="relative font-editorial-serif italic font-bold text-[#101114] text-[clamp(42px,min(5.5vw,9.6vh),92px)] leading-[0.9] tracking-[-0.02em]">
                        in minutes.
                      </span>
                    </span>
                    <SparkleStar
                      size={22}
                      className="inline-block ml-3 sm:ml-3.5 text-[#101114] shrink-0"
                    />
                  </span>
                </h1>
              </motion.div>

              {/* Subheadline (~20px / 29px line height, ~660px width -> 3 clean lines at 1672x941) */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASING.PREMIUM, delay: 0.12 }}
                className="text-[clamp(15px,1.2vw,20px)] text-[#65666A] font-normal leading-[1.45] max-w-[660px] mb-6 lg:mb-[clamp(18px,3vh,32px)]"
              >
                GitHub hides the rules behind every profile badge. Scan your username for 60-second PR &amp; merge missions that earn Pull Shark, Quickdraw, and YOLO—on your real profile.
              </motion.p>

              {/* Profile Scanner (~712x73px at 1672x941) */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASING.PREMIUM, delay: 0.16 }}
                className="w-full max-w-[712px]"
              >
                <form onSubmit={handleScanProfile} className="relative">
                  <div className="relative flex items-center w-full h-[58px] sm:h-[66px] lg:h-[73px] rounded-full bg-white border border-[#DDDBD2] shadow-[0_12px_32px_rgba(16,17,20,0.06)] hover:border-[#101114]/35 pl-3.5 sm:pl-6 pr-1.5 sm:pr-2 transition-all duration-200 focus-within:border-[#84CC16] focus-within:ring-3 focus-within:ring-[#D7FF36]/45">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#101114] flex items-center justify-center text-white shrink-0 mr-2 sm:mr-3">
                      <Github size={16} className="fill-white sm:w-[17px] sm:h-[17px]" />
                    </div>
                    <span className="hidden sm:inline text-[#65666A] text-[15.5px] font-mono shrink-0 select-none">
                      github.com/&nbsp;
                    </span>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="your-username"
                      aria-label="GitHub username"
                      className="flex-1 min-w-0 bg-transparent text-[13.5px] sm:text-[15.5px] font-mono italic text-[#101114] placeholder:text-[#65666A] focus:outline-none py-1.5"
                    />
                    <button
                      type="submit"
                      disabled={isScanning}
                      className="shrink-0 h-[46px] sm:h-[52px] lg:h-[57px] px-4 sm:px-7 rounded-full bg-[#101114] hover:bg-[#1C1E24] text-white text-[13px] sm:text-[15px] font-semibold border-2 border-[#D7FF36] shadow-[0_0_16px_rgba(215,255,54,0.35)] flex items-center gap-1.5 sm:gap-2 transition-transform active:scale-95 cursor-pointer"
                      aria-label="Check My Badges"
                    >
                      {isScanning ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Checking</span>
                        </>
                      ) : (
                        <>
                          <span className="sm:hidden">Scan Badges</span>
                          <span className="hidden sm:inline">Check My Badges</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Demo Row Horizontally Aligned */}
                <div className="mt-4 lg:mt-5 px-1 flex flex-wrap lg:flex-nowrap items-center gap-x-2 xl:gap-x-3 gap-y-2 text-[12px] sm:text-[12.5px] xl:text-[13.5px] text-[#65666A]">
                  <span className="font-medium text-[#65666A] shrink-0">Demo:</span>
                  {[
                    { handle: 'torvalds', bg: 'linear-gradient(135deg, #374151, #111827)' },
                    { handle: 'shadcn', bg: 'linear-gradient(135deg, #9A3412, #431407)' },
                    { handle: 'gaearon', bg: 'linear-gradient(135deg, #4338CA, #1E1B4B)' },
                  ].map((item, idx) => (
                    <React.Fragment key={item.handle}>
                      {idx > 0 && <span aria-hidden="true" className="text-[#C9C6BC]">·</span>}
                      <button
                        type="button"
                        onClick={() => {
                          setUsernameInput(item.handle);
                          simulateProfileScan(item.handle);
                        }}
                        className="inline-flex items-center gap-1.5 font-mono text-[#101114] hover:text-[#4D7C0F] transition-colors cursor-pointer shrink-0"
                      >
                        <span
                          style={{ background: item.bg }}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white uppercase shadow-2xs border border-white"
                        >
                          {item.handle[0]}
                        </span>
                        <span>@{item.handle}</span>
                      </button>
                    </React.Fragment>
                  ))}

                  <span aria-hidden="true" className="hidden sm:inline text-[#D5D3CA] mx-0.5">|</span>

                  <a
                    href="#achievements"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="font-medium text-[#101114] hover:text-[#4D7C0F] transition-colors whitespace-nowrap shrink-0"
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
                    className="mt-4 px-4 py-3 rounded-2xl bg-[#F7F8EF] border border-[#DCE89E] flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse shrink-0" />
                      <div>
                        <div className="text-[12px] font-semibold text-[#101114]">@{scanResult.handle} — ready</div>
                        <div className="text-[11px] text-[#65666A]">Start with: <strong>{scanResult.targetName}</strong></div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setSelectedBadgeId(scanResult.targetId); document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' }); }}
                      className="px-3 py-1.5 rounded-full bg-[#101114] hover:bg-[#23272F] text-[#D7FF36] border border-[#D7FF36]/40 text-[11px] font-semibold shrink-0 cursor-pointer transition-colors shadow-2xs"
                    >
                      View Mission →
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* ── RIGHT COLUMN (~52%): 3D Achievement Medallion & Pedestal Artwork ── */}
            <div className="w-full lg:w-[52%] flex items-center justify-center lg:justify-end z-20">
              <HeroMonument3D />
            </div>
          </div>

          {/* ── BOTTOM PROOF STRIP (~1057 x 63px Centered Within Viewport) ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-6 lg:mt-[clamp(14px,2.4vh,28px)] flex justify-center relative z-30"
          >
            <div className="w-full max-w-[1057px] min-h-[54px] lg:h-[63px] px-6 sm:px-10 py-3 rounded-full bg-white/85 backdrop-blur-md border border-[#E5E3DA] shadow-[0_12px_34px_rgba(16,17,20,0.06)] flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-2 text-[13px] sm:text-[14.5px] font-medium text-[#101114]">
              <div className="flex items-center gap-2.5">
                <Zap size={16} className="text-[#101114] shrink-0" />
                <span>Real GitHub Triggers</span>
              </div>
              <span className="hidden sm:inline h-5 w-[1px] bg-[#E5E3DA]" />
              <div className="flex items-center gap-2.5">
                <BookOpen size={16} className="text-[#101114] shrink-0" />
                <span>Step-by-Step PR Recipes</span>
              </div>
              <span className="hidden sm:inline h-5 w-[1px] bg-[#E5E3DA]" />
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#101114] shrink-0" />
                <span>Verified on Your Profile</span>
              </div>
              <span className="hidden sm:inline h-5 w-[1px] bg-[#E5E3DA]" />
              <div className="flex items-center gap-2.5">
                <Ban size={16} className="text-[#101114] shrink-0" />
                <span>No Login Required</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 02: ACHIEVEMENT WALL ─────────────────────────────────── */}
      <section
        id="achievements"
        className="scroll-mt-20 py-20 bg-[#FAF9F5] border-b border-[#E5E3DA] select-none text-left"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F8EF] text-[#101114] border border-[#DCE89E] text-[11px] font-bold uppercase tracking-[0.16em] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
              <span>Official GitHub Achievement Wall</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#101114] tracking-[-0.035em] leading-[1.12]">
              These aren't profile decorations.
            </h2>
            <p className="text-base sm:text-lg text-[#65666A] max-w-2xl mx-auto font-normal leading-relaxed">
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
                    ? 'bg-[#101114] text-white shadow-xs'
                    : 'bg-white text-[#65666A] border border-[#E5E3DA] hover:bg-[#F7F8EF] hover:text-[#101114] hover:border-[#DCE89E]'
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
                    'p-5 rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[0_16px_36px_-6px_rgba(16,17,20,0.08)] cursor-pointer',
                    isSelected
                      ? 'border-[#84CC16] ring-2 ring-[#D7FF36]/40 shadow-sm'
                      : 'border-[#E5E3DA]'
                  )}
                  onClick={() => {
                    setSelectedBadgeId(badge.id);
                    document.getElementById('first-achievement')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className="space-y-4">
                    {/* Badge Image Pedestal */}
                    <div className="w-full h-32 rounded-xl bg-[#FAF9F5] border border-[#ECEAE1] flex items-center justify-center relative overflow-hidden group-hover:border-[#84CC16]/40 transition-colors">
                      <img
                        src={badge.image}
                        alt={badge.name}
                        className="w-20 h-20 object-contain drop-shadow-sm group-hover:scale-108 transition-transform duration-200 select-none"
                        loading="lazy"
                      />
                      {badge.tiers && badge.tiers.length > 0 && (
                        <span className="absolute top-2.5 right-2.5 text-[9px] font-mono font-bold bg-[#F7F8EF] text-[#101114] border border-[#DCE89E] px-2 py-0.5 rounded-full shadow-2xs">
                          {badge.tiers.length} Tiers
                        </span>
                      )}
                    </div>

                    {/* Badge Title & Status */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-[#101114] tracking-tight">
                          {badge.name}
                        </h3>
                        <span className="text-[10px] font-mono font-bold text-[#101114] bg-[#F7F8EF] border border-[#DCE89E] px-2 py-0.5 rounded-full">
                          Official
                        </span>
                      </div>
                      <p className="text-xs text-[#65666A] font-medium leading-relaxed mt-1">
                        {badge.tagline}
                      </p>
                    </div>

                    {/* Requirement Note */}
                    <div className="pt-2 border-t border-[#ECEAE1] text-[11px] text-[#65666A] leading-relaxed">
                      <strong className="text-[#101114]">Activity:</strong> {badge.howToGet}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 mt-2">
                    <button
                      type="button"
                      className="w-full py-2 px-3 rounded-lg bg-[#FAF9F5] group-hover:bg-[#101114] group-hover:text-white border border-[#E5E3DA] group-hover:border-[#101114] text-xs font-bold text-[#101114] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
        className="scroll-mt-20 py-20 bg-white border-b border-[#E5E3DA] select-none text-left"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F8EF] text-[#101114] border border-[#DCE89E] text-[11px] font-bold uppercase tracking-[0.16em] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
              <span>Interactive Mission Runner</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#101114] tracking-[-0.035em] leading-[1.12]">
              Your first achievement starts with one mission.
            </h2>
            <p className="text-base sm:text-lg text-[#65666A] max-w-2xl mx-auto font-normal leading-relaxed">
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
                className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] space-y-1 shadow-2xs"
              >
                <div className="text-[10px] font-mono font-bold text-[#65A30D] uppercase tracking-wider">
                  Step {step.num}
                </div>
                <div className="text-xs font-bold text-[#101114]">{step.title}</div>
                <div className="text-[11px] text-[#65666A]">{step.desc}</div>
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
                        ? 'bg-[#101114] text-white border-[#101114] shadow-xs'
                        : 'bg-white text-[#65666A] border-[#E5E3DA] hover:bg-[#F7F8EF] hover:text-[#101114]'
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
          <div className="rounded-[28px] border border-[#E5E3DA] bg-white divide-y md:divide-y-0 md:divide-x divide-[#E5E3DA] grid md:grid-cols-12 overflow-hidden shadow-sm">
            {/* Left Column: Requirements & Pedestal (5 cols) */}
            <div className="md:col-span-5 p-6 sm:p-7 flex flex-col justify-between space-y-6 bg-[#FFFFFF]">
              <div className="space-y-5">
                {/* Badge Header Bar */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#ECEAE1]">
                  <div>
                    <span className="text-[11px] font-mono text-[#65A30D] font-bold uppercase tracking-wider block">
                      Target Medal
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#101114] tracking-tight mt-0.5">
                      {activeBadge.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-[#F7F8EF] text-[#101114] border border-[#DCE89E]">
                    {activeBadge.difficulty}
                  </span>
                </div>

                {/* 3D Showcase Pedestal */}
                <div className="rounded-2xl border border-[#E5E3DA] bg-[#FAF9F5] p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-xl bg-white border border-[#E5E3DA] p-1.5 shadow-sm">
                    <img
                      src={activeBadge.image}
                      alt={activeBadge.name}
                      className="w-10 h-10 object-contain select-none"
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="text-sm font-semibold text-[#101114] leading-snug">
                      {activeBadge.tagline}
                    </div>
                    <div className="text-xs font-mono text-[#65666A]">
                      Est. time:{' '}
                      <span className="text-[#101114] font-bold">
                        {activeRecipe.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mission Context */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-[#101114] block">
                    Mission Purpose:
                  </span>
                  <p className="text-xs text-[#65666A] leading-relaxed">
                    {activeRecipe.missionContext}
                  </p>
                </div>

                {/* GitHub Verification Rule */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-[#101114] tracking-tight block">
                    Official Verification Criteria:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#65666A] leading-relaxed font-medium">
                    {activeBadge.requirements.slice(0, 3).map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-[#84CC16] shrink-0 mt-0.5" />
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
              className="md:col-span-7 p-6 sm:p-7 bg-[#101114] text-[#c9d1d9] flex flex-col justify-between space-y-6 rounded-b-[28px] md:rounded-b-none md:rounded-r-[28px]"
            >
              <div className="space-y-4">
                {/* Terminal Window Header Bar */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#272B33]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#D7FF36] font-bold uppercase tracking-wider">
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
                    className="h-8 px-3 rounded-lg bg-[#1F2329] hover:bg-[#2A2F37] text-white border border-[#30363D] text-[11px] font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95"
                    title="Copy full 3-station bash script"
                  >
                    {copiedSnippet === `${activeBadge.id}-all` ? (
                      <>
                        <Check size={12} className="text-[#D7FF36]" />
                        <span className="text-[#D7FF36] font-bold">Script Copied!</span>
                      </>
                    ) : (
                      <>
                        <Zap size={12} className="text-[#D7FF36] fill-[#D7FF36]" />
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
                      <div className="rounded-xl border border-[#272B33] bg-[#17191E] px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-inner hover:border-[#8b949e]/40 transition-colors">
                        <div className="flex items-center gap-2 font-mono text-xs overflow-hidden">
                          <span className="text-[#8b949e] select-none">$</span>
                          <code className="text-[#D7FF36] truncate font-semibold">
                            {step.cmd}
                          </code>
                        </div>
                        <button
                          onClick={() => handleCopy(step.cmd, `${activeBadge.id}-${idx}`)}
                          className="shrink-0 text-xs text-[#c9d1d9] hover:text-white px-2 py-1 rounded bg-[#1F2329] hover:bg-[#2A2F37] border border-[#30363D] transition-all flex items-center gap-1 cursor-pointer select-none active:scale-95"
                          title="Copy command"
                        >
                          {copiedSnippet === `${activeBadge.id}-${idx}` ? (
                            <>
                              <Check size={12} className="text-[#D7FF36]" />
                              <span className="text-[#D7FF36] text-[11px] font-mono font-bold">
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
                  className="w-full py-3 rounded-xl bg-[#D7FF36] hover:bg-[#cbf527] text-[#101114] text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
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
        className="scroll-mt-20 py-20 bg-[#FAF9F5] border-b border-[#E5E3DA] select-none text-left"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F8EF] text-[#101114] border border-[#DCE89E] text-[11px] font-bold uppercase tracking-[0.16em] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
              <span>4-Step Execution Pipeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#101114] tracking-[-0.035em] leading-[1.12]">
              Learn it. Do it. Earn it.
            </h2>
            <p className="text-base sm:text-lg text-[#65666A] max-w-2xl mx-auto font-normal leading-relaxed">
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
                icon: <Search className="text-[#84CC16]" size={20} />,
                chip: 'Target Identification',
              },
              {
                step: '02',
                title: 'Follow the Guided Workflow',
                desc: 'Get exact CLI commands, branch conventions, and anti-mistake gotchas before pushing any code.',
                icon: <Terminal className="text-[#84CC16]" size={20} />,
                chip: 'Command Guidance',
              },
              {
                step: '03',
                title: 'Complete Real GitHub Activity',
                desc: 'Push commits, author pull requests, and co-author branches on live, indexed repositories.',
                icon: <GitPullRequest className="text-[#84CC16]" size={20} />,
                chip: 'Live Git Execution',
              },
              {
                step: '04',
                title: 'Track Verified Progress',
                desc: 'GitHub official event webhooks register your activity and award the genuine medallion to your profile.',
                icon: <Award className="text-[#84CC16]" size={20} />,
                chip: 'Webhook Verification',
              },
            ].map((card) => (
              <div
                key={card.step}
                className="p-6 rounded-2xl bg-white border border-[#E5E3DA] flex flex-col justify-between space-y-5 hover:-translate-y-1 transition-all duration-200 shadow-2xs hover:shadow-[0_16px_36px_-6px_rgba(16,17,20,0.08)] hover:border-[#84CC16]/60"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono font-extrabold text-[#65A30D]">
                      {card.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] flex items-center justify-center">
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#101114] tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#65666A] font-medium leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#ECEAE1] text-[10px] font-mono text-[#65666A] font-bold uppercase tracking-wider">
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
        className="scroll-mt-20 py-20 bg-white border-b border-[#E5E3DA] select-none text-left"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F8EF] text-[#101114] border border-[#DCE89E] text-[11px] font-bold uppercase tracking-[0.16em] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
              <span>Guided Missions Explorer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#101114] tracking-[-0.035em] leading-[1.12]">
              Your next contribution starts here.
            </h2>
            <p className="text-base sm:text-lg text-[#65666A] max-w-2xl mx-auto font-normal leading-relaxed">
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
                    ? 'bg-[#101114] text-white shadow-xs'
                    : 'bg-[#FAF9F5] text-[#65666A] border border-[#E5E3DA] hover:bg-[#F7F8EF] hover:text-[#101114]'
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
                className="p-6 rounded-2xl bg-white border border-[#E5E3DA] flex flex-col justify-between space-y-5 hover:-translate-y-1 hover:shadow-[0_16px_36px_-6px_rgba(16,17,20,0.08)] hover:border-[#84CC16]/60 transition-all duration-200"
              >
                <div className="space-y-4">
                  {/* Top Tags */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF9F5] text-[#65666A] border border-[#E5E3DA]">
                      {mission.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#101114] bg-[#F7F8EF] border border-[#DCE89E] px-2 py-0.5 rounded-full">
                      {mission.difficulty}
                    </span>
                  </div>

                  {/* Title & Target Medal Pill */}
                  <div>
                    <h3 className="text-xl font-bold text-[#101114] tracking-tight">
                      {mission.title}
                    </h3>
                    <p className="text-xs text-[#65666A] font-medium leading-relaxed mt-2">
                      {mission.summary}
                    </p>
                  </div>

                  {/* Target Achievement preview */}
                  <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={mission.targetBadgeImage}
                        alt={mission.targetBadgeName}
                        className="w-7 h-7 object-contain"
                      />
                      <span className="text-xs font-bold text-[#101114]">
                        Unlocks: {mission.targetBadgeName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#65666A] font-bold">
                      {mission.estimatedTime}
                    </span>
                  </div>

                  {/* Skills Practiced */}
                  <div className="text-[11px] text-[#65666A] space-y-1">
                    <strong className="text-[#101114]">Skill Practiced:</strong>{' '}
                    <span>{mission.skillPracticed}</span>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-[#ECEAE1] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#65A30D] font-bold">
                    {mission.completionRate}
                  </span>
                  <Link
                    to={`/blueprints/gitglow/engine?badge=${mission.id.replace(/^m\d+-/, '')}`}
                    className="text-xs font-bold text-[#101114] hover:text-[#84CC16] inline-flex items-center gap-1 transition-colors"
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
              className="h-12 px-8 rounded-full bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg border border-[#D7FF36]/40"
            >
              <span>Explore All Missions →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SECTION 06: YOUR DEVELOPER PROGRESS ───────────────────────────── */}
      <section
        id="progress"
        className="scroll-mt-20 py-20 bg-[#FAF9F5] border-b border-[#E5E3DA] select-none text-left"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F8EF] text-[#101114] border border-[#DCE89E] text-[11px] font-bold uppercase tracking-[0.16em] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
              <span>Real Progress Tracking</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#101114] tracking-[-0.035em] leading-[1.12]">
              Your progress should be visible.
            </h2>
            <p className="text-base sm:text-lg text-[#65666A] max-w-2xl mx-auto font-normal leading-relaxed">
              Track completed missions, commit milestones, skills practiced, and achievement unlocks on one unified dashboard.
            </p>
          </div>

          {/* Product Dashboard Preview */}
          <div className="max-w-5xl mx-auto rounded-[28px] bg-white border border-[#E5E3DA] shadow-sm p-6 sm:p-8 space-y-8">
            {/* Top Stat Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-[#ECEAE1]">
              <div>
                <span className="text-[11px] font-mono text-[#65666A] uppercase tracking-wider block">
                  Missions Done
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#101114] mt-0.5 block">
                  3 of 6
                </span>
                <span className="text-[10px] text-[#65A30D] font-semibold">Starter Track 50%</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#65666A] uppercase tracking-wider block">
                  Pull Requests Merged
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#101114] mt-0.5 block">
                  2 Merged
                </span>
                <span className="text-[10px] text-[#65A30D] font-semibold">Pull Shark Unlocked</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#65666A] uppercase tracking-wider block">
                  Co-Authored Commits
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#101114] mt-0.5 block">
                  1 Verified
                </span>
                <span className="text-[10px] text-[#65A30D] font-semibold">Git Trailer Valid</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#65666A] uppercase tracking-wider block">
                  Badges Earned
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#101114] mt-0.5 block">
                  2 Official
                </span>
                <span className="text-[10px] text-[#65A30D] font-semibold">Indexed on GitHub</span>
              </div>
            </div>

            {/* Contribution Activity Heatmap Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#101114]">
                  Contribution Heatmap Simulation
                </span>
                <span className="text-[11px] font-mono text-[#65666A]">
                  Real Commit Attribution
                </span>
              </div>
              {/* Heatmap Grid */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DA] overflow-x-auto">
                <div className="flex items-center gap-1.5 min-w-[500px]">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const levels = ['bg-[#EBEDF0]', 'bg-[#D7FF36]/50', 'bg-[#D7FF36]', 'bg-[#A3E635]', 'bg-[#4D7C0F]'];
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
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#101114]">Git Branching</span>
                  <span className="font-mono text-[#65A30D] font-bold">Level 2</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E5E3DA] overflow-hidden">
                  <div className="h-full bg-[#84CC16] w-[80%]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#101114]">PR Etiquette</span>
                  <span className="font-mono text-[#65A30D] font-bold">Level 3</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E5E3DA] overflow-hidden">
                  <div className="h-full bg-[#84CC16] w-[100%]" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#101114]">Git Trailers</span>
                  <span className="font-mono text-[#65A30D] font-bold">Level 1</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E5E3DA] overflow-hidden">
                  <div className="h-full bg-[#84CC16] w-[60%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 07: REAL WORK. REAL CONTRIBUTIONS. ────────────────────── */}
      <section
        id="comparison"
        className="scroll-mt-20 py-20 bg-[#FFFFFF] border-b border-[#E5E3DA] select-none text-left"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F8EF] text-[#101114] border border-[#DCE89E] text-[11px] font-bold uppercase tracking-[0.16em] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
              <span>Authenticity First</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#101114] tracking-[-0.035em] leading-[1.12]">
              Not another GitHub profile generator.
            </h2>
            <p className="text-base sm:text-lg text-[#65666A] max-w-2xl mx-auto font-normal leading-relaxed">
              Why tech leads and engineering hiring managers respect official profile achievements instead of copy-pasted README shields.
            </p>
          </div>

          {/* Comparison Cards Grid */}
          <div className="rounded-[28px] border border-[#E5E3DA] bg-white divide-y md:divide-y-0 md:divide-x divide-[#E5E3DA] grid md:grid-cols-2 overflow-hidden shadow-sm">
            {/* Left Card: Typical README Generators */}
            <div className="p-7 sm:p-9 space-y-6 bg-[#FAF9F5]/70 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DA]">
                  <div>
                    <span className="text-[11px] font-mono text-[#65666A] font-bold uppercase tracking-wider block">
                      Typical Tools
                    </span>
                    <h3 className="text-xl font-extrabold text-[#101114] tracking-tight mt-0.5">
                      README Profile Generators
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold">
                    Zero Verification
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-[13px] text-[#65666A] leading-relaxed">
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
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DA]">
                  <div>
                    <span className="text-[11px] font-mono text-[#65A30D] font-bold uppercase tracking-wider block">
                      The GitGlow Way
                    </span>
                    <h3 className="text-xl font-extrabold text-[#101114] tracking-tight mt-0.5">
                      Guided Missions &amp; Real Activity
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#101114] bg-[#F7F8EF] border border-[#DCE89E] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Check size={11} className="text-[#84CC16]" /> Server Verified
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-[13px] text-[#101114] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#84CC16] shrink-0 mt-0.5" />
                    <span><strong>Guided hands-on missions:</strong> Step-by-step CLI execution that builds genuine muscle memory for feature branching.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#84CC16] shrink-0 mt-0.5" />
                    <span><strong>Real pull requests &amp; merges:</strong> Authentic GitHub commits indexed by GitHub official event webhooks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#84CC16] shrink-0 mt-0.5" />
                    <span><strong>Multi-tier multipliers:</strong> Track progress toward Pull Shark x16 and Galaxy Brain x32 milestones.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#84CC16] shrink-0 mt-0.5" />
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
        className="scroll-mt-20 py-20 bg-[#FAF9F5] select-none text-left"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Action Ribbon Card */}
          <div className="rounded-[32px] bg-[#101114] text-white p-8 sm:p-14 text-center space-y-6 mb-20 relative overflow-hidden shadow-2xl border border-[#272B33]">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D7FF36]/15 border border-[#D7FF36]/40 text-[#D7FF36] text-[11px] font-mono font-bold uppercase tracking-[0.16em]">
                <span className="w-1.5 h-1.5 bg-[#D7FF36] rounded-full animate-pulse" />
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
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#D7FF36] hover:bg-[#e2ff6b] text-[#101114] font-bold text-xs uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer"
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
          <footer className="pt-12 border-t border-[#E5E3DA]">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
              {/* Brand Column */}
              <div className="col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[8px] bg-[#101114] border border-white/15 flex items-center justify-center relative">
                    <Github size={15} className="text-white fill-current" />
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#D7FF36]" />
                  </div>
                  <span className="text-lg font-bold text-[#101114] tracking-tight">
                    GitGlow
                  </span>
                </div>
                <p className="text-xs text-[#65666A] leading-relaxed max-w-sm font-medium">
                  The guided mission platform for authentic GitHub developer achievements. Built to help beginners contribute meaningfully.
                </p>
              </div>

              {/* Column 1: Missions */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#101114]">
                  Missions
                </h4>
                <ul className="space-y-2 text-xs text-[#65666A]">
                  <li><a href="#missions" className="hover:text-[#101114] transition-colors">Quickdraw (120s)</a></li>
                  <li><a href="#missions" className="hover:text-[#101114] transition-colors">Pull Shark (PR Merge)</a></li>
                  <li><a href="#missions" className="hover:text-[#101114] transition-colors">Pair Programming</a></li>
                  <li><a href="#missions" className="hover:text-[#101114] transition-colors">Open Source Track</a></li>
                </ul>
              </div>

              {/* Column 2: Achievements */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#101114]">
                  Achievements
                </h4>
                <ul className="space-y-2 text-xs text-[#65666A]">
                  <li><a href="#achievements" className="hover:text-[#101114] transition-colors">Official Badges</a></li>
                  <li><a href="#achievements" className="hover:text-[#101114] transition-colors">Multi-Tier Multipliers</a></li>
                  <li><a href="#first-achievement" className="hover:text-[#101114] transition-colors">Webhook Rules</a></li>
                  <li><a href="#how-it-works" className="hover:text-[#101114] transition-colors">How It Works</a></li>
                </ul>
              </div>

              {/* Column 3: Community & Legal */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#101114]">
                  Community
                </h4>
                <ul className="space-y-2 text-xs text-[#65666A]">
                  <li><Link to="/blueprints" className="hover:text-[#101114] transition-colors">All Blueprints</Link></li>
                  <li><a href="https://github.com/guchchi" target="_blank" rel="noopener noreferrer" className="hover:text-[#101114] transition-colors">GitHub Repository</a></li>
                  <li><Link to="/privacy" className="hover:text-[#101114] transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-[#101114] transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="pt-8 border-t border-[#ECEAE1] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#65666A]">
              <p>© 2026 GitGlow. An independent open-source blueprint platform.</p>
              <p className="text-[11px] text-[#8E9094]">
                GitHub and the GitHub logo are registered trademarks of GitHub, Inc.
              </p>
            </div>
          </footer>
        </div>
      </section>

    </div>
  );
};
