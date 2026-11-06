import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Github,
  Star,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  Trophy,
  Lock,
  Sparkles,
  Code2,
  GitPullRequest,
  Activity,
  Shield,
  Rocket,
  ChevronDown,
  ChevronUp,
  Terminal,
  GitBranch,
  GitCommit,
  ExternalLink,
  Flame,
  Check,
  CircleDot,
  FileCode2,
  Cpu,
  Layers,
  Sparkle,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DURATION, EASING } from '../../../lib/motion-presets';

// ─── Color & Design Tokens (GitHub Darkroom Aesthetic) ────────────────────────
const GH_BG = '#0d1117';
const GH_CARD = '#161b22';
const GH_CARD_HOVER = '#1c2128';
const GH_BORDER = '#30363d';
const GH_BORDER_LIGHT = '#21262d';
const GH_GREEN = '#238636';
const GH_GREEN_BRIGHT = '#3fb950';
const GH_BLUE = '#58a6ff';
const LIME = '#d1f34d';

// ─── 8 Diagnostic Criteria for Profile Health Calculator ───────────────────────
interface Criterion {
  id: string;
  points: number;
  label: string;
  detail: string;
  category: string;
}

const CRITERIA: Criterion[] = [
  {
    id: 'avatar',
    points: 10,
    label: 'High-Res Headshot with Clean Background',
    detail: 'Professional lighting, face clearly visible. Not an anime character, car, or default GitHub identicon.',
    category: 'Identity',
  },
  {
    id: 'bio',
    points: 10,
    label: '160-Character Impact Bio Stating What You Build',
    detail: 'Specifies your current tech focus & target roles instead of generic "CS student at XYZ college".',
    category: 'Identity',
  },
  {
    id: 'special_repo',
    points: 15,
    label: 'Special Username Repository (username/username) Initialized',
    detail: 'The official GitHub easter-egg feature that mounts your personal markdown file onto your public profile page.',
    category: 'Foundation',
  },
  {
    id: 'readme_architecture',
    points: 15,
    label: 'Scaffolded Profile README with Tech Stack Icon Grid',
    detail: 'Formatted shields/badges displaying your active stack (Python, React, TypeScript, Docker) readable in 3 seconds.',
    category: 'Foundation',
  },
  {
    id: 'pinned_repos',
    points: 15,
    label: '6 Curated Pinned Repositories with Descriptions & Tags',
    detail: 'Every pinned card has a clear one-line problem statement, tech tags, and a live deployment demo URL.',
    category: 'Proof',
  },
  {
    id: 'social_badges',
    points: 10,
    label: 'Verified Social & Contact Touchpoints',
    detail: 'Clean SVG badges linking directly to your LinkedIn, portfolio, and email for fast recruiter outreach.',
    category: 'Proof',
  },
  {
    id: 'dynamic_metrics',
    points: 10,
    label: 'Dynamic GitHub Stats & Top Languages SVG Cards',
    detail: 'Live rendered activity cards showcasing commit volume, total PRs, and language breakdown without manual edits.',
    category: 'Automation',
  },
  {
    id: 'official_badge',
    points: 15,
    label: 'At Least One Official GitHub Achievement Badge',
    detail: 'Official profile badges verified by GitHub (Pull Shark 🦈, Quickdraw ⚡, or Pair Extraordinaire 👯).',
    category: 'Achievement',
  },
];

// ─── 13 Quest Engine Curriculum ────────────────────────────────────────────────
interface Quest {
  id: string;
  phase: 'foundation' | 'proof' | 'pro';
  phaseName: string;
  stepNumber: string;
  title: string;
  desc: string;
  estMinutes: number;
  cliCommand: string;
  reward: string;
  isPro?: boolean;
}

const QUESTS: Quest[] = [
  // Phase 1: Foundation (Free)
  {
    id: 'q1',
    phase: 'foundation',
    phaseName: 'Phase 1: Identity & Foundation',
    stepNumber: '01',
    title: 'Profile Picture & Verified Display Name',
    desc: 'Establish instant recruiter trust in 0.1s. Configure high-resolution framing, professional lighting, and canonical username formatting.',
    estMinutes: 4,
    cliCommand: 'gitglow setup identity',
    reward: 'Identity Pass',
  },
  {
    id: 'q2',
    phase: 'foundation',
    phaseName: 'Phase 1: Identity & Foundation',
    stepNumber: '02',
    title: 'The 160-Character Recruiter Pitch Bio',
    desc: 'Craft an engineered bio stating what you solve, what stack you ship with, and your current engineering thesis. Zero fluffy buzzwords.',
    estMinutes: 6,
    cliCommand: 'gitglow craft bio',
    reward: 'Positioning Stamp',
  },
  {
    id: 'q3',
    phase: 'foundation',
    phaseName: 'Phase 1: Identity & Foundation',
    stepNumber: '03',
    title: 'Initialize the Secret Username Repository',
    desc: 'Unlock the GitHub profile engine by provisioning a public repository matching your exact GitHub username with an active README.md.',
    estMinutes: 5,
    cliCommand: 'gh repo create $USER/$USER --public',
    reward: 'Canvas Initialized',
  },
  {
    id: 'q4',
    phase: 'foundation',
    phaseName: 'Phase 1: Identity & Foundation',
    stepNumber: '04',
    title: 'Scaffold the Markdown Profile Architecture',
    desc: 'Generate clean, responsive markdown typography: hero banner, engineering philosophy, and structured project sections.',
    estMinutes: 8,
    cliCommand: 'gitglow scaffold readme',
    reward: 'README Masterfile',
  },

  // Phase 2: Proof & Architecture (Free)
  {
    id: 'q5',
    phase: 'proof',
    phaseName: 'Phase 2: Proof & Portfolio',
    stepNumber: '05',
    title: 'Interactive Tech Stack Icon Grid',
    desc: 'Build a visually striking icon grid of your languages, frameworks, and cloud tooling using curated SVGs and Shields.io tokens.',
    estMinutes: 7,
    cliCommand: 'gitglow stack --generate',
    reward: 'Stack Matrix',
  },
  {
    id: 'q6',
    phase: 'proof',
    phaseName: 'Phase 2: Proof & Portfolio',
    stepNumber: '06',
    title: 'Pin Your 6 Signature Repositories',
    desc: 'Select and curate your top 6 projects. Add concise problem statements, language topic tags, and live deployment demo links.',
    estMinutes: 10,
    cliCommand: 'gitglow pin --curate-best-6',
    reward: 'Showcase Grid',
  },
  {
    id: 'q7',
    phase: 'proof',
    phaseName: 'Phase 2: Proof & Portfolio',
    stepNumber: '07',
    title: 'Recruiter Contact & Social Badges Bar',
    desc: 'Deploy custom SVG badge links to LinkedIn, Twitter/X, personal portfolio, and encrypted email contact triggers.',
    estMinutes: 5,
    cliCommand: 'gitglow touchpoints --bind',
    reward: 'Recruiter Reach',
  },
  {
    id: 'q8',
    phase: 'proof',
    phaseName: 'Phase 2: Proof & Portfolio',
    stepNumber: '08',
    title: 'Dynamic GitHub Stats & Streak Cards',
    desc: 'Embed automatically refreshing SVG analytics cards displaying total commits, PR contributions, top languages, and active streaks.',
    estMinutes: 8,
    cliCommand: 'gitglow stats --theme=dark-dimmed',
    reward: 'Verified Free Profile',
  },

  // Phase 3: Automation & Achievements (Pro ₹199)
  {
    id: 'q9',
    phase: 'pro',
    phaseName: 'Phase 3: Automation & Official Badges',
    stepNumber: '09',
    title: 'GitHub Actions Automated Cron Workflow',
    desc: 'Deploy a serverless GitHub Action workflow that automatically updates your recent blog posts, LeetCode completions, and live GitHub stats daily.',
    estMinutes: 12,
    cliCommand: 'gitglow workflow install cron-sync.yml',
    reward: 'Self-Updating Engine',
    isPro: true,
  },
  {
    id: 'q10',
    phase: 'pro',
    phaseName: 'Phase 3: Automation & Official Badges',
    stepNumber: '10',
    title: 'Unlock Official "Pull Shark" 🦈 Achievement',
    desc: 'Walk through submitting your first clean, automated Pull Request to the gitglow-community open-source repository. Automatically merged by bot.',
    estMinutes: 10,
    cliCommand: 'gitglow quest pull-shark --trigger',
    reward: 'Official Pull Shark 🦈',
    isPro: true,
  },
  {
    id: 'q11',
    phase: 'pro',
    phaseName: 'Phase 3: Automation & Official Badges',
    stepNumber: '11',
    title: 'Unlock Official "Quickdraw" ⚡ Achievement',
    desc: 'Master rapid issue triaging and resolution. Open and resolve a structured community issue in under 5 minutes to trigger GitHub badge.',
    estMinutes: 5,
    cliCommand: 'gitglow quest quickdraw --execute',
    reward: 'Official Quickdraw ⚡',
    isPro: true,
  },
  {
    id: 'q12',
    phase: 'pro',
    phaseName: 'Phase 3: Automation & Official Badges',
    stepNumber: '12',
    title: 'Deploy 3 Production Starter Projects',
    desc: 'Scaffold 3 real, production-ready repos: a Python AI API wrapper, a Next.js full-stack tool, and a CLI utility. Real commits, real green squares.',
    estMinutes: 25,
    cliCommand: 'gitglow clone starters --all',
    reward: '3 Green-Square Projects',
    isPro: true,
  },
  {
    id: 'q13',
    phase: 'pro',
    phaseName: 'Phase 3: Automation & Official Badges',
    stepNumber: '13',
    title: 'Green-Square Jumpstart & Pair Extraordinaire 👯',
    desc: 'Execute co-authored commits and establish a sustainable 30-day contribution habit with automated daily prompt reminders.',
    estMinutes: 15,
    cliCommand: 'gitglow habit start --30-days',
    reward: 'Gold Pro Pioneer Badge',
    isPro: true,
  },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
const FAQAccordion: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#30363d] rounded-xl overflow-hidden bg-[#161b22] transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-[#1c2128] transition-colors cursor-pointer"
      >
        <span className="text-sm font-semibold text-white flex items-center gap-2">
          <Terminal size={14} className="text-emerald-400 shrink-0" />
          {q}
        </span>
        <div className="w-6 h-6 rounded-md bg-[#21262d] flex items-center justify-center shrink-0 text-[#8b949e]">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#8b949e] leading-relaxed border-t border-[#21262d]">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const GitGlowHomePage: React.FC = () => {
  // Simulator State: 'raw' | 'glow'
  const [simulatorMode, setSimulatorMode] = useState<'raw' | 'glow'>('glow');

  // Interactive Calculator State
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({
    avatar: true,
    bio: false,
    special_repo: false,
    readme_architecture: false,
    pinned_repos: false,
    social_badges: false,
    dynamic_metrics: false,
    official_badge: false,
  });

  const toggleCriterion = (id: string) => {
    setCheckedCriteria(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentScore = useMemo(() => {
    return CRITERIA.reduce((acc, c) => (checkedCriteria[c.id] ? acc + c.points : acc), 0);
  }, [checkedCriteria]);

  const scoreDiagnosis = useMemo(() => {
    if (currentScore < 30) {
      return {
        label: 'Ghost Profile',
        color: '#f85149',
        tag: 'Critical Risk',
        desc: 'Recruiters bounce within 3 seconds. Zero proof of active work or engineering identity.',
      };
    }
    if (currentScore < 60) {
      return {
        label: 'Developing Beginner',
        color: '#e3b341',
        tag: 'Needs Structure',
        desc: 'Shows basic presence, but lacks portfolio curation, badges, and professional markdown architecture.',
      };
    }
    if (currentScore < 85) {
      return {
        label: 'Solid Builder Profile',
        color: '#58a6ff',
        tag: 'Above Average',
        desc: 'Outranks 80% of student peers. A few automation workflows and official badges will make it elite.',
      };
    }
    return {
      label: 'Recruiter-Ready Elite',
      color: '#3fb950',
      tag: 'Top 5% Portfolio',
      desc: 'Instant credibility. Complete markdown architecture, active green streak, and official GitHub achievements.',
    };
  }, [currentScore]);

  // Filtered Quests
  const [activePhaseTab, setActivePhaseTab] = useState<'all' | 'foundation' | 'proof' | 'pro'>('all');
  const filteredQuests = useMemo(() => {
    if (activePhaseTab === 'all') return QUESTS;
    return QUESTS.filter(q => q.phase === activePhaseTab);
  }, [activePhaseTab]);

  return (
    <div className="w-full min-h-screen bg-[#0d1117] text-[#c9d1d9] selection:bg-emerald-500/30 selection:text-white overflow-x-hidden font-sans">
      
      {/* ── 1. HERO SECTION ────────────────────────────────────────────────── */}
      <section
        id="overview"
        className="relative pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden"
      >
        {/* Subtle engineering grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#30363d 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top Terminal Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[11px] mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-wide">gitglow v1.0 — GitHub Profile Engineering Suite</span>
        </motion.div>

        {/* Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, delay: 0.1, ease: EASING.PREMIUM }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.08] mb-6"
        >
          Glow up your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#d1f34d]">
            GitHub
          </span>
          <br className="hidden sm:inline" /> from zero to recruiter-ready.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, delay: 0.2 }}
          className="text-base sm:text-lg text-[#8b949e] max-w-2xl leading-relaxed mb-10"
        >
          A 13-quest interactive workbench engineered for 1st-year students and self-taught builders.
          Transform a blank profile into a proof-first portfolio with authentic GitHub achievements,
          automated actions, and continuous green contributions.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
        >
          <Link
            to="/blueprints/gitglow/engine"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-[#0b1c30] bg-[#d1f34d] hover:bg-[#c0e045] transition-all hover:scale-[1.02] active:scale-[0.99] shadow-lg shadow-[#d1f34d]/10"
          >
            <Rocket size={17} />
            <span>Launch GitGlow Engine</span>
            <ArrowRight size={15} />
          </Link>

          <a
            href="#calculator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-[#161b22] hover:bg-[#1c2128] border border-[#30363d] transition-all hover:border-slate-500"
          >
            <Activity size={16} className="text-emerald-400" />
            <span>Calculate Profile Score</span>
          </a>
        </motion.div>

        {/* Fast Engineering Metrics Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.NORMAL, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl pt-8 border-t border-[#21262d] text-left"
        >
          {[
            { label: 'Guided Quests', val: '13 Tasks', sub: 'Interactive workbench' },
            { label: 'Official Badges', val: 'Pull Shark 🦈', sub: '+ Quickdraw & Pair' },
            { label: 'Safe OSS Sandbox', val: '1 Clean PR', sub: 'No repo breaking' },
            { label: 'Coding Required', val: 'Zero', sub: 'Step-by-step guidance' },
          ].map(m => (
            <div key={m.label} className="p-3 rounded-lg bg-[#161b22]/50 border border-[#30363d]/40">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e]">{m.label}</div>
              <div className="text-sm font-bold text-white mt-0.5">{m.val}</div>
              <div className="text-[11px] text-emerald-400/80 font-mono mt-0.5">{m.sub}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── 2. THE CENTERPIECE: INTERACTIVE BEFORE/AFTER SIMULATOR ─────────── */}
      <section id="simulator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-[11px] font-mono text-[#8b949e] mb-3">
            <Layers size={13} className="text-emerald-400" />
            <span>REAL-TIME COMPARISON SIMULATOR</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            The Recruiter Eyeball Test: 24 vs 98
          </h2>
          <p className="text-sm text-[#8b949e] max-w-lg">
            Toggle below to see the difference between a dormant student profile and an engineered
            GitGlow portfolio.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center p-1.5 rounded-xl bg-[#161b22] border border-[#30363d] mt-6 gap-2">
            <button
              onClick={() => setSimulatorMode('raw')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer',
                simulatorMode === 'raw'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-[#8b949e] hover:text-white'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Raw Beginner (Score: 24/100)</span>
            </button>

            <button
              onClick={() => setSimulatorMode('glow')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer',
                simulatorMode === 'glow'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-[#8b949e] hover:text-white'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>GitGlow Pro (Score: 98/100)</span>
            </button>
          </div>
        </div>

        {/* Realistic GitHub Profile Mockup Container */}
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl overflow-hidden text-left">
          {/* GitHub Window Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-[#30363d] text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f85149]/70" />
              <div className="w-3 h-3 rounded-full bg-[#e3b341]/70" />
              <div className="w-3 h-3 rounded-full bg-[#3fb950]/70" />
              <span className="text-[#8b949e] ml-2 font-mono">
                github.com/{simulatorMode === 'glow' ? 'ayush-engineer' : 'ayush-student'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono',
                simulatorMode === 'glow' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              )}>
                {simulatorMode === 'glow' ? 'Audit: 98/100 (Elite)' : 'Audit: 24/100 (Critical)'}
              </span>
            </div>
          </div>

          {/* GitHub Profile Interior Layout */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Sidebar: Profile Details */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
              {/* Avatar */}
              <div className="relative mb-4">
                {simulatorMode === 'glow' ? (
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-emerald-400/50 p-1 bg-[#0d1117] shadow-xl overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Engineered Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#238636] border-2 border-[#161b22] flex items-center justify-center" title="Active developer">
                      <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping" />
                    </div>
                  </div>
                ) : (
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-[#30363d] bg-[#21262d] flex items-center justify-center text-[#8b949e]">
                    <Github size={48} className="opacity-40" />
                  </div>
                )}
              </div>

              {/* Name & Username */}
              <div className="w-full mb-4">
                <h3 className="text-xl font-bold text-white">Ayush Paul</h3>
                <p className="text-xs font-mono text-[#8b949e]">
                  {simulatorMode === 'glow' ? 'ayush-engineer' : 'ayush-student-99'}
                </p>
              </div>

              {/* Bio */}
              <p className="text-xs text-[#c9d1d9] leading-relaxed mb-6 font-medium">
                {simulatorMode === 'glow' ? (
                  <>
                    Full-Stack & Autonomous AI Builder. Shipping distributed agent pipelines. Building tools for developers. 🚀
                  </>
                ) : (
                  <span className="text-[#8b949e] italic">
                    CS student at engineering college. Learning C++ and Python. No bio provided.
                  </span>
                )}
              </p>

              {/* Follower Stats */}
              <div className="flex items-center gap-4 text-xs font-mono text-[#8b949e] mb-6">
                <span><strong className="text-white">{simulatorMode === 'glow' ? '142' : '3'}</strong> followers</span>
                <span>•</span>
                <span><strong className="text-white">{simulatorMode === 'glow' ? '89' : '12'}</strong> following</span>
              </div>

              {/* Verified Achievements Showcase */}
              <div className="w-full pt-4 border-t border-[#30363d]/60">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8b949e] block mb-3">
                  GitHub Achievements
                </span>
                {simulatorMode === 'glow' ? (
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#21262d] border border-[#30363d] text-xs font-semibold text-white shadow-xs">
                      <span className="text-base">🦈</span>
                      <span>Pull Shark</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#21262d] border border-[#30363d] text-xs font-semibold text-white shadow-xs">
                      <span className="text-base">⚡</span>
                      <span>Quickdraw</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#21262d] border border-[#30363d] text-xs font-semibold text-white shadow-xs">
                      <span className="text-base">👯</span>
                      <span>Pair Extraordinaire</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#8b949e]/60 italic font-mono">
                    No public achievements unlocked yet.
                  </p>
                )}
              </div>
            </div>

            {/* Right Main Content: README & Pinned Projects */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Profile README Card */}
              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-5">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#21262d] text-xs font-mono text-[#8b949e]">
                  <span className="flex items-center gap-2">
                    <FileCode2 size={14} className="text-emerald-400" />
                    <span>README.md</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {simulatorMode === 'glow' ? 'STATUS: VERIFIED' : 'STATUS: NOT FOUND'}
                  </span>
                </div>

                {simulatorMode === 'glow' ? (
                  <div className="space-y-4 text-xs leading-relaxed">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">Hey there, I'm Ayush 👋</h4>
                    </div>
                    <p className="text-[#8b949e]">
                      Passionate software engineer focused on agentic AI workflows, TypeScript platforms, and high-trust systems.
                    </p>

                    {/* Tech Badges */}
                    <div className="pt-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] mb-2">Technologies & Tooling:</div>
                      <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                        {['TypeScript', 'React', 'Python', 'FastAPI', 'Node.js', 'Docker', 'PostgreSQL', 'TailwindCSS'].map(tech => (
                          <span key={tech} className="px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-emerald-400 font-semibold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-center text-[#8b949e]">
                    <FileCode2 size={32} className="opacity-20 mb-2" />
                    <p className="text-xs font-mono">ayush-student-99/ayush-student-99 repository does not exist.</p>
                    <p className="text-[11px] text-[#8b949e]/60 mt-1">Profile README cannot be rendered.</p>
                  </div>
                )}
              </div>

              {/* Pinned Repositories Grid */}
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-[#8b949e]">
                  <span>Pinned Repositories</span>
                  <span>{simulatorMode === 'glow' ? '6 of 6' : '0 of 6'}</span>
                </div>

                {simulatorMode === 'glow' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { name: 'agentic-crawler', desc: 'Autonomous headless web extraction engine with auto-retry.', lang: 'TypeScript', color: '#3178c6', stars: '84' },
                      { name: 'b-cyber-planner', desc: 'Curriculum & prep roadmap planner for engineering programs.', lang: 'React', color: '#61dafb', stars: '49' },
                      { name: 'rag-embedding-pipeline', desc: 'Fast semantic document chunking and vector indexing.', lang: 'Python', color: '#3572a5', stars: '112' },
                      { name: 'gitglow-cli', desc: 'Automated GitHub profile audit and quest engine for students.', lang: 'Go', color: '#00add8', stars: '320' },
                    ].map(r => (
                      <div key={r.name} className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-slate-500 transition-colors">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1">
                          <GitBranch size={13} className="text-[#8b949e]" />
                          <span className="text-[#58a6ff] hover:underline">{r.name}</span>
                        </div>
                        <p className="text-[11px] text-[#8b949e] line-clamp-2 mb-2.5 leading-snug">
                          {r.desc}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-[#8b949e]">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                            {r.lang}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star size={10} />
                            {r.stars}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-[#30363d] text-center text-xs font-mono text-[#8b949e]">
                    You haven't pinned any repositories yet. Pinned repositories appear here.
                  </div>
                )}
              </div>

              {/* Contribution Activity Heatmap */}
              <div>
                <div className="flex items-center justify-between mb-2 text-xs font-mono text-[#8b949e]">
                  <span>487 contributions in 2026</span>
                  <span className="text-emerald-400 font-bold">{simulatorMode === 'glow' ? '🔥 42 day streak' : 'Streak: 0 days'}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] overflow-x-auto">
                  <div className="flex gap-1 justify-between min-w-[500px]">
                    {Array.from({ length: 40 }).map((_, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, rowIdx) => {
                          const isLit = simulatorMode === 'glow'
                            ? (colIdx * 7 + rowIdx) % 3 !== 0
                            : (colIdx === 5 && rowIdx === 2) || (colIdx === 24 && rowIdx === 5);
                          const greenShade = isLit
                            ? simulatorMode === 'glow'
                              ? ((colIdx + rowIdx) % 4 === 0 ? '#39d353' : (colIdx + rowIdx) % 3 === 0 ? '#26a641' : '#006d32')
                              : '#006d32'
                            : '#161b22';

                          return (
                            <div
                              key={rowIdx}
                              className="w-2.5 h-2.5 rounded-2xs transition-colors duration-300"
                              style={{ backgroundColor: greenShade }}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE PROFILE HEALTH CALCULATOR ────────────────────────── */}
      <section id="calculator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#30363d]/60">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-[11px] font-mono text-emerald-400 mb-3">
            <Activity size={13} />
            <span>INSTANT AUDIT TOOL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Interactive Profile Health Scorecard
          </h2>
          <p className="text-sm text-[#8b949e] max-w-xl">
            Check off what you currently have on your GitHub profile. Watch your health score calculate live in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Checkboxes List */}
          <div className="lg:col-span-7 space-y-3">
            {CRITERIA.map(c => {
              const isChecked = checkedCriteria[c.id];
              return (
                <div
                  key={c.id}
                  onClick={() => toggleCriterion(c.id)}
                  className={cn(
                    'p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5',
                    isChecked
                      ? 'bg-[#161b22] border-emerald-500/40 shadow-xs'
                      : 'bg-[#161b22]/40 border-[#30363d]/60 hover:border-[#30363d] hover:bg-[#161b22]/70'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors border',
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-[#0d1117]'
                        : 'border-[#30363d] bg-[#0d1117]'
                    )}
                  >
                    {isChecked && <Check size={13} strokeWidth={3} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn('text-xs sm:text-sm font-semibold', isChecked ? 'text-white' : 'text-[#8b949e]')}>
                        {c.label}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 shrink-0">
                        +{c.points} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8b949e] mt-1 leading-relaxed">
                      {c.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Score Gauge Card (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6 shadow-xl text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8b949e] block mb-4">
                Diagnostic Health Rating
              </span>

              {/* Big Score Display */}
              <div className="relative inline-flex items-center justify-center mb-4">
                <div
                  className="text-6xl font-black font-mono tracking-tight"
                  style={{ color: scoreDiagnosis.color }}
                >
                  {currentScore}
                  <span className="text-2xl text-[#8b949e] font-sans font-normal">/100</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className="inline-block text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border"
                  style={{
                    backgroundColor: `${scoreDiagnosis.color}15`,
                    borderColor: `${scoreDiagnosis.color}40`,
                    color: scoreDiagnosis.color,
                  }}
                >
                  {scoreDiagnosis.tag}: {scoreDiagnosis.label}
                </span>
              </div>

              {/* Dynamic Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-[#0d1117] border border-[#30363d] overflow-hidden mb-6">
                <motion.div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${currentScore}%`,
                    backgroundColor: scoreDiagnosis.color,
                  }}
                />
              </div>

              {/* Diagnosis Prose */}
              <p className="text-xs text-[#8b949e] leading-relaxed mb-6 font-medium">
                {scoreDiagnosis.desc}
              </p>

              {/* CTA based on score */}
              <Link
                to="/blueprints/gitglow/engine"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-xs text-[#0b1c30] bg-[#d1f34d] hover:bg-[#c0e045] transition-all shadow-md"
              >
                <span>Fix Missing Points in Engine →</span>
              </Link>
              <span className="block text-[10px] font-mono text-[#8b949e] mt-3">
                Free for all Phase 1 & 2 foundational quests
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. THE 13-QUEST ENGINE ROADMAP ─────────────────────────────────── */}
      <section id="quests" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#30363d]/60">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-[11px] font-mono text-emerald-400 mb-3">
            <GitPullRequest size={13} />
            <span>INTERACTIVE WORKBENCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            The 13-Quest Curriculum
          </h2>
          <p className="text-sm text-[#8b949e] max-w-xl">
            Every step is executable inside the GitGlow workbench. No blind tab-switching, no copy-pasting broken templates.
          </p>

          {/* Phase Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center p-1 rounded-xl bg-[#161b22] border border-[#30363d] mt-6 gap-1">
            {[
              { id: 'all', label: 'All 13 Quests' },
              { id: 'foundation', label: 'Phase 1: Foundation (Free)' },
              { id: 'proof', label: 'Phase 2: Proof (Free)' },
              { id: 'pro', label: 'Phase 3: Pro Achievements' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePhaseTab(tab.id as any)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer',
                  activePhaseTab === tab.id
                    ? 'bg-[#0d1117] text-white border border-[#30363d] font-bold shadow-xs'
                    : 'text-[#8b949e] hover:text-white'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuests.map(q => (
            <div
              key={q.id}
              className={cn(
                'rounded-xl border p-5 transition-all flex flex-col justify-between text-left',
                q.isPro
                  ? 'bg-gradient-to-br from-[#161b22] to-[#1c1828] border-purple-500/30 hover:border-purple-500/50'
                  : 'bg-[#161b22] border-[#30363d] hover:border-slate-500'
              )}
            >
              <div>
                {/* Card Top: Step number & Timing */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#0d1117] border border-[#30363d] font-mono text-[11px] font-bold text-white flex items-center justify-center">
                      {q.stepNumber}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e]">
                      {q.phaseName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {q.isPro ? (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        Pro Tier
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Free
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-[#8b949e]">~{q.estMinutes}m</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                  <span>{q.title}</span>
                </h3>

                {/* Description */}
                <p className="text-xs text-[#8b949e] leading-relaxed mb-4">
                  {q.desc}
                </p>
              </div>

              {/* Bottom: Terminal command & Reward Tag */}
              <div className="pt-3 border-t border-[#30363d]/50 flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#8b949e] truncate max-w-[200px] sm:max-w-xs bg-[#0d1117] px-2 py-1 rounded border border-[#21262d]">
                  $ {q.cliCommand}
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                  <Sparkles size={12} />
                  {q.reward}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. OFFICIAL GITHUB ACHIEVEMENTS DEEP-DIVE ───────────────────────── */}
      <section id="achievements" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#30363d]/60">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-[11px] font-mono text-emerald-400 mb-3">
            <Trophy size={13} />
            <span>OFFICIAL BADGE ACCREDITATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Real GitHub Achievements. Verified by GitHub.
          </h2>
          <p className="text-sm text-[#8b949e] max-w-xl">
            These are not proprietary site badges. These are official badges permanently pinned to your public
            github.com profile, verified cryptographically by GitHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: '🦈',
              name: 'Pull Shark',
              tier: 'Level 1 x 2 x 3',
              color: '#58a6ff',
              howToEarn: 'Submit a valid Pull Request that gets reviewed and merged.',
              gitglowRole: 'Our dedicated sandbox repo (gitglow-community) runs an automated bot that reviews and merges your first PR in seconds without risking any repository damage.',
            },
            {
              emoji: '⚡',
              name: 'Quickdraw',
              tier: 'Lightning Dispatch',
              color: '#e3b341',
              howToEarn: 'Close an open issue or pull request in under 5 minutes.',
              gitglowRole: 'GitGlow guides you through a rapid structured issue lifecycle on your own repository, unlocking the achievement with zero trial-and-error.',
            },
            {
              emoji: '👯',
              name: 'Pair Extraordinaire',
              tier: 'Co-Author Credit',
              color: '#bc8cff',
              howToEarn: 'Co-author a commit with another developer on a merged branch.',
              gitglowRole: 'We walk you through configuring official Co-authored-by Git trailers in your commit message, completing the pair-programming verification.',
            },
          ].map(b => (
            <div
              key={b.name}
              className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6 text-left flex flex-col justify-between"
              style={{ borderTop: `4px solid ${b.color}` }}
            >
              <div>
                <div className="text-5xl mb-4">{b.emoji}</div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{b.name}</h3>
                  <span
                    className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                    style={{
                      color: b.color,
                      borderColor: `${b.color}40`,
                      backgroundColor: `${b.color}15`,
                    }}
                  >
                    {b.tier}
                  </span>
                </div>
                <div className="text-xs font-semibold text-white/90 mb-3">
                  Requirement: {b.howToEarn}
                </div>
                <p className="text-xs text-[#8b949e] leading-relaxed mb-6">
                  {b.gitglowRole}
                </p>
              </div>

              <div className="pt-4 border-t border-[#30363d]/60 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span>Verified on github.com</span>
                <CheckCircle2 size={13} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. TRANSPARENT PRICING & CAMPUS PACK ───────────────────────────── */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#30363d]/60">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-[11px] font-mono text-emerald-400 mb-3">
            <Zap size={13} />
            <span>NO SUBSCRIPTIONS. ONE-TIME VALUE.</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Simple, Accessible Pricing
          </h2>
          <p className="text-sm text-[#8b949e] max-w-lg">
            Free forever for foundational quests. Upgrade once for automation workflows and official badge accelerators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-8">
          
          {/* Free Tier */}
          <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-8 flex flex-col justify-between text-left">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2">
                Phase 1 & 2 — Community
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold text-white font-mono">₹0</span>
                <span className="text-xs text-[#8b949e] font-mono">/ forever free</span>
              </div>
              <p className="text-xs text-[#8b949e] mb-6">
                Everything required to transform a blank profile into a structured, credible developer resume.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Full Profile Health Diagnostic Scan (0–100)',
                  'Quests 01 through 08 (Complete Phase 1 & 2)',
                  'Markdown README Architecture Generator',
                  'Interactive Tech Stack Icon Grid Builder',
                  'Pinned Repositories 6-Project Showcase',
                  'Social & Contact Badge Integration',
                  'Live GitHub Stats & Streak SVG Integration',
                  'Community Discord Access & Help Forum',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-xs text-[#c9d1d9]">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/blueprints/gitglow/engine"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs text-white bg-[#0d1117] hover:bg-[#1c2128] border border-[#30363d] hover:border-slate-500 transition-all cursor-pointer"
            >
              Start Free Quests (01–08)
            </Link>
          </div>

          {/* Pro Tier (Featured) */}
          <div className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-b from-[#161b22] to-[#0f1f18] p-8 flex flex-col justify-between text-left relative shadow-xl shadow-emerald-950/20">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#d1f34d] text-[#0b1c30]">
                Most Popular
              </span>
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#d1f34d] font-bold mb-2">
                Full Engine — Pro Pioneer
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold text-white font-mono">₹199</span>
                <span className="text-xs text-[#8b949e] font-mono">/ one-time payment</span>
              </div>
              <p className="text-xs text-[#8b949e] mb-6">
                Automated workflows, 3 starter project kits, and official GitHub badge unlock accelerators.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Everything in Free Community Tier',
                  'Quests 09 through 13 (Phase 3 Complete)',
                  'Automated GitHub Actions Daily Cron Updater',
                  'Pull Shark 🦈 First OSS PR Guided Walkthrough',
                  'Quickdraw ⚡ Fast Issue Triaging Accelerator',
                  '3 Production Starter Project Repositories (Python/AI/Next)',
                  'Green-Square Jumpstart: 30-Day Streak Prompt Habit',
                  'Recruiter-Ready Executive Bio Templates',
                  'Gold "Verified Pro Pioneer" Community Badge',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-xs text-white">
                    <CheckCircle2 size={14} className="text-[#d1f34d] shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/blueprints/gitglow/engine"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs text-[#0b1c30] bg-[#d1f34d] hover:bg-[#c0e045] transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#d1f34d]/15 cursor-pointer"
            >
              <Sparkles size={15} />
              <span>Unlock Pro Access — ₹199</span>
            </Link>
          </div>

        </div>

        {/* Campus Pack (For College Societies) */}
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center shrink-0 text-blue-400">
              <Users size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">Campus Club Pack (Societies & Colleges)</h3>
              <p className="text-xs text-[#8b949e] leading-relaxed max-w-xl">
                Bulk licensing for college coding clubs, ACM/IEEE chapters, and hackathon teams. Includes 50 student seats, private club leaderboard, and a live onboarding AMA.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            <div>
              <span className="text-2xl font-bold font-mono text-white">₹999</span>
              <span className="text-xs text-[#8b949e] font-mono"> / club / yr</span>
            </div>
            <a
              href="mailto:contact@ayushpaul.in?subject=GitGlow Campus Pack Inquiry"
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white border border-[#30363d] hover:border-slate-400 bg-[#0d1117] transition-all"
            >
              Inquire →
            </a>
          </div>
        </div>
      </section>

      {/* ── 7. FREQUENTLY ASKED QUESTIONS ──────────────────────────────────── */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#30363d]/60">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-[11px] font-mono text-emerald-400 mb-3">
            <FileCode2 size={13} />
            <span>CLEAR ANSWERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#8b949e]">
            Everything you need to know about the engine, sandbox repository, and achievements.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'I am a complete beginner in 1st year. Can I use this?',
              a: 'Yes, 100%. GitGlow is specifically built for students with zero prior Git knowledge. Every quest gives you visual click-by-click instructions, pre-scaffolded copy, and automated scripts so you never get stuck on cryptic command-line errors.',
            },
            {
              q: 'Will this affect or break my existing GitHub repositories?',
              a: 'Never. GitGlow only configures your special personal profile repository (your username/username) and helps you curate what is publicly displayed. It never deletes or alters your private code.',
            },
            {
              q: 'Are the GitHub achievement badges (Pull Shark, Quickdraw) real?',
              a: 'Yes, they are 100% official GitHub badges issued by GitHub Inc. that appear on your live github.com profile. We guide you through executing the exact Git actions that trigger GitHub\'s automated badge issuance.',
            },
            {
              q: 'What is the gitglow-community sandbox repo?',
              a: 'It is a public open-source repository where students safely make their first Pull Request. An automated GitHub Action bot reviews your JSON submission, validates formatting, and automatically merges it — unlocking your Pull Shark 🦈 badge safely.',
            },
            {
              q: 'Is there any monthly subscription or hidden charge?',
              a: 'No subscriptions ever. Free quests (01 to 08) are free forever with no credit card required. The Pro tier is a single one-time payment of ₹199 with lifetime updates.',
            },
          ].map(faq => (
            <FAQAccordion key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── 8. FINAL CALL TO ACTION ────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-t border-[#30363d]/60">
        <div className="rounded-3xl border border-[#30363d] bg-gradient-to-b from-[#161b22] to-[#0d1117] p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 text-emerald-400">
            <Rocket size={26} />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Ready to Glow Up Your Profile?
          </h2>
          <p className="text-sm sm:text-base text-[#8b949e] max-w-lg mx-auto mb-8 leading-relaxed">
            Stop sending recruiters a blank GitHub link. Complete your 13 quests and turn your profile into your strongest job search asset today.
          </p>

          <Link
            to="/blueprints/gitglow/engine"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm text-[#0b1c30] bg-[#d1f34d] hover:bg-[#c0e045] transition-all hover:scale-[1.02] active:scale-[0.99] shadow-lg shadow-[#d1f34d]/20"
          >
            <span>Launch GitGlow Engine Now</span>
            <ArrowRight size={16} />
          </Link>
          <p className="text-[11px] font-mono text-[#8b949e] mt-4">
            Free foundational tier · Takes ~30 mins · Zero setup required
          </p>
        </div>
      </section>

    </div>
  );
};

export default GitGlowHomePage;
