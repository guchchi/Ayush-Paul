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
  ArrowLeft,
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
  Clock,
  FileText,
  Check,
  Compass,
  Layers,
  Sparkle,
  Share2,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DURATION, EASING } from '../../../lib/motion-presets';

// ─── Design Tokens (Matching Module 1 / Site Core Theme) ─────────────────────
const NAVY = '#0b1c30';
const COBALT = '#0058be';
const LIME = '#d1f34d';

// ─── 8 Diagnostic Criteria for Profile Health Scorecard ───────────────────────
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
    label: 'High-Res Headshot with Clean Framing',
    detail: 'Face clearly visible, good lighting. Avoid anime characters, anonymous graphics, or default GitHub identicons.',
    category: 'Identity',
  },
  {
    id: 'bio',
    points: 10,
    label: '160-Character Impact Bio Stating What You Build',
    detail: 'Specifies your primary tech stack and what you solve instead of generic "Computer Science student at XYZ college".',
    category: 'Identity',
  },
  {
    id: 'special_repo',
    points: 15,
    label: 'Special Username Repository (username/username) Initialized',
    detail: 'The official GitHub feature that mounts a custom markdown presentation directly onto your public profile page.',
    category: 'Foundation',
  },
  {
    id: 'readme_architecture',
    points: 15,
    label: 'Structured Profile README with Tech Stack Icon Grid',
    detail: 'Organized markdown sections with visual shields/badges displaying your languages and frameworks readable in 3 seconds.',
    category: 'Foundation',
  },
  {
    id: 'pinned_repos',
    points: 15,
    label: '6 Curated Pinned Repositories with Descriptions & Tags',
    detail: 'Every pinned card has a one-sentence problem statement, language tags, and a verifiable live deployment URL.',
    category: 'Proof',
  },
  {
    id: 'social_badges',
    points: 10,
    label: 'Verified Social & Recruiter Contact Touchpoints',
    detail: 'Direct badge links to your LinkedIn, portfolio website, and professional email for rapid recruiter outreach.',
    category: 'Proof',
  },
  {
    id: 'dynamic_metrics',
    points: 10,
    label: 'Dynamic GitHub Stats & Streak SVG Cards',
    detail: 'Self-refreshing activity cards highlighting commit frequency, PR counts, and language distribution.',
    category: 'Automation',
  },
  {
    id: 'official_badge',
    points: 15,
    label: 'At Least One Official GitHub Achievement Badge',
    detail: 'Official achievements verified directly by GitHub (Pull Shark 🦈, Quickdraw ⚡, or Pair Extraordinaire 👯).',
    category: 'Achievement',
  },
];

// ─── 13 Quests Roadmap ────────────────────────────────────────────────────────
interface Quest {
  id: string;
  stepNumber: string;
  phaseNumber: number;
  phaseName: string;
  title: string;
  desc: string;
  estMinutes: number;
  output: string;
  isPro?: boolean;
}

const QUESTS: Quest[] = [
  // Phase 1: Identity & Foundation (Free)
  {
    id: 'q1',
    stepNumber: '01',
    phaseNumber: 1,
    phaseName: 'Foundation',
    title: 'Profile Picture & Verified Display Name',
    desc: 'Establish instant recruiter trust in 0.1s. Configure high-resolution framing and canonical naming.',
    estMinutes: 4,
    output: 'Identity Verified',
  },
  {
    id: 'q2',
    stepNumber: '02',
    phaseNumber: 1,
    phaseName: 'Foundation',
    title: 'The 160-Character Recruiter Pitch Bio',
    desc: 'Craft an engineered bio stating what you solve, what stack you ship with, and your current engineering thesis.',
    estMinutes: 6,
    output: 'Positioning Statement',
  },
  {
    id: 'q3',
    stepNumber: '03',
    phaseNumber: 1,
    phaseName: 'Foundation',
    title: 'Initialize the Secret Username Repository',
    desc: 'Unlock GitHub\'s profile canvas by provisioning a public repository matching your exact GitHub username.',
    estMinutes: 5,
    output: 'Profile Canvas Active',
  },
  {
    id: 'q4',
    stepNumber: '04',
    phaseNumber: 1,
    phaseName: 'Foundation',
    title: 'Scaffold the Markdown Profile README',
    desc: 'Generate clean, responsive markdown typography: hero banner, engineering philosophy, and structured project sections.',
    estMinutes: 8,
    output: 'README Masterfile',
  },

  // Phase 2: Proof & Architecture (Free)
  {
    id: 'q5',
    stepNumber: '05',
    phaseNumber: 2,
    phaseName: 'Proof & Portfolio',
    title: 'Interactive Tech Stack Icon Grid',
    desc: 'Build a visually striking icon grid of your languages, frameworks, and cloud tooling using curated SVGs.',
    estMinutes: 7,
    output: 'Tech Stack Matrix',
  },
  {
    id: 'q6',
    stepNumber: '06',
    phaseNumber: 2,
    phaseName: 'Proof & Portfolio',
    title: 'Pin Your 6 Signature Repositories',
    desc: 'Select and curate your top 6 projects. Add concise problem statements, language topic tags, and demo links.',
    estMinutes: 10,
    output: '6-Project Showcase',
  },
  {
    id: 'q7',
    stepNumber: '07',
    phaseNumber: 2,
    phaseName: 'Proof & Portfolio',
    title: 'Recruiter Contact & Social Badges Bar',
    desc: 'Deploy custom SVG badge links to LinkedIn, Twitter/X, personal portfolio, and verified contact triggers.',
    estMinutes: 5,
    output: 'Contact Touchpoints',
  },
  {
    id: 'q8',
    stepNumber: '08',
    phaseNumber: 2,
    phaseName: 'Proof & Portfolio',
    title: 'Dynamic GitHub Stats & Streak Cards',
    desc: 'Embed automatically refreshing SVG analytics cards displaying total commits, PR contributions, and active streaks.',
    estMinutes: 8,
    output: 'Free Profile Pass',
  },

  // Phase 3: Automation & Achievements (Pro ₹199)
  {
    id: 'q9',
    stepNumber: '09',
    phaseNumber: 3,
    phaseName: 'Automation & Pro Badges',
    title: 'GitHub Actions Automated Cron Workflow',
    desc: 'Deploy a serverless GitHub Action workflow that automatically syncs recent activity and stats every 24 hours.',
    estMinutes: 12,
    output: 'Self-Updating Engine',
    isPro: true,
  },
  {
    id: 'q10',
    stepNumber: '10',
    phaseNumber: 3,
    phaseName: 'Automation & Pro Badges',
    title: 'Unlock Official "Pull Shark" 🦈 Achievement',
    desc: 'Submit your first clean, automated Pull Request to the gitglow-community sandbox repo, safely merged by bot.',
    estMinutes: 10,
    output: 'Pull Shark Badge 🦈',
    isPro: true,
  },
  {
    id: 'q11',
    stepNumber: '11',
    phaseNumber: 3,
    phaseName: 'Automation & Pro Badges',
    title: 'Unlock Official "Quickdraw" ⚡ Achievement',
    desc: 'Master rapid issue triaging and resolution on your repository in under 5 minutes to trigger the official badge.',
    estMinutes: 5,
    output: 'Quickdraw Badge ⚡',
    isPro: true,
  },
  {
    id: 'q12',
    stepNumber: '12',
    phaseNumber: 3,
    phaseName: 'Automation & Pro Badges',
    title: 'Deploy 3 Production Starter Projects',
    desc: 'Scaffold 3 real projects: a Python AI API wrapper, a Next.js full-stack tool, and a CLI utility. Real green squares.',
    estMinutes: 25,
    output: '3 Production Repos',
    isPro: true,
  },
  {
    id: 'q13',
    stepNumber: '13',
    phaseNumber: 3,
    phaseName: 'Automation & Pro Badges',
    title: 'Green-Square Jumpstart & Pair Extraordinaire 👯',
    desc: 'Execute co-authored commits and establish a sustainable contribution habit with automated daily prompts.',
    estMinutes: 15,
    output: 'Gold Pro Pioneer 🏆',
    isPro: true,
  },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
const FAQAccordion: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-xs transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 sm:py-5 text-left hover:bg-neutral-50/80 transition-colors cursor-pointer"
      >
        <span className="text-sm sm:text-base font-bold text-[#0b1c30]">
          {q}
        </span>
        <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-500">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
            <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
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
        color: '#ef4444',
        tag: 'Critical Risk',
        desc: 'Recruiters bounce within 3 seconds. Zero proof of active work or engineering identity.',
      };
    }
    if (currentScore < 60) {
      return {
        label: 'Developing Beginner',
        color: '#f59e0b',
        tag: 'Needs Structure',
        desc: 'Shows basic presence, but lacks portfolio curation, badges, and professional markdown architecture.',
      };
    }
    if (currentScore < 85) {
      return {
        label: 'Solid Builder Profile',
        color: '#0058be',
        tag: 'Above Average',
        desc: 'Outranks 80% of student peers. A few automation workflows and official badges will make it elite.',
      };
    }
    return {
      label: 'Recruiter-Ready Elite',
      color: '#16a34a',
      tag: 'Top 5% Portfolio',
      desc: 'Instant credibility. Complete markdown architecture, active green streak, and official GitHub achievements.',
    };
  }, [currentScore]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] overflow-x-hidden font-sans">
      
      {/* ── Upper Navigation / Back link (Identical to Module 1) ─────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 sm:pt-10">
        <Link
          to="/blueprints"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#0058be] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0058be] rounded-lg p-1.5"
          aria-label="Back to Blueprints"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to Blueprints
        </Link>
      </div>

      {/* ── 1. HERO & BLUEPRINT AT A GLANCE (Module 1 Layout) ─────────────── */}
      <div id="overview" className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        >
          <div className="grid lg:grid-cols-[1fr_390px] gap-10 xl:gap-16 items-start mb-14 md:mb-20">
            
            {/* Left side: Hero Details */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0058be]/8 text-[#0058be] text-[11px] font-bold uppercase tracking-widest">
                <Github size={13} className="text-[#0058be]" aria-hidden="true" /> Blueprint 03 · GitGlow
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0b1c30] leading-[1.08]">
                Glow Up Your <br />
                <span className="text-[#0058be]">GitHub Profile</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-2xl">
                Before applying for internships or reaching out to senior engineers, you need a profile that proves you build.
                GitGlow is a 13-quest guided workbench that turns a blank GitHub profile into a recruiter-ready portfolio — with real GitHub achievements, green squares, and official badges.
              </p>

              {/* Meta chips (Matching Module 1 exact chips) */}
              <div className="flex flex-wrap gap-2.5 pt-2" role="list" aria-label="Blueprint details">
                {[
                  { icon: <Clock size={14} className="text-neutral-500" aria-hidden="true" />, label: '30–45 min' },
                  { icon: <Star size={14} className="text-neutral-500" aria-hidden="true" />, label: '1st-Year Friendly' },
                  { icon: <Layers size={14} className="text-neutral-500" aria-hidden="true" />, label: '13 Quests' },
                  { icon: <FileText size={14} className="text-[#0b1c30]" aria-hidden="true" />, label: 'Output: Recruiter-Ready Portfolio', accent: true },
                ].map((chip, i) => (
                  <div
                    key={i}
                    role="listitem"
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold border select-none transition-all',
                      chip.accent
                        ? 'bg-[#d1f34d] border-[#d1f34d]/40 text-[#0b1c30] shadow-sm shadow-[#d1f34d]/20'
                        : 'bg-white border-neutral-200 text-neutral-600',
                    )}
                  >
                    {chip.icon}
                    <span>{chip.label}</span>
                  </div>
                ))}
              </div>

              {/* Action row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <Link
                  to="/blueprints/gitglow/engine"
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#0058be] text-white font-bold text-base transition-all hover:bg-[#0047a0] shadow-[0_8px_24px_rgba(0,88,190,0.2)] hover:scale-[1.01] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2"
                >
                  <span>Launch GitGlow Engine</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>

                <a
                  href="#simulator"
                  className="flex items-center justify-center px-6 py-4 rounded-xl border border-neutral-200 bg-white text-[#0b1c30] hover:bg-neutral-50 font-bold text-base transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                >
                  View Live Simulator
                </a>
              </div>

              <p className="text-xs text-neutral-400 font-medium">
                Helper note: You don't need years of coding experience. You just need a structured portfolio that proves you build.
              </p>
            </div>

            {/* Right side: Blueprint at a glance card (Matching Module 1 exact card structure) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl space-y-6 text-left">
              <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3">
                GitGlow at a glance
              </h2>

              {/* Health Score / Progress Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0b1c30]">Average Glow Up</span>
                  <span className="text-sm font-extrabold text-[#0058be]">+74 Points</span>
                </div>
                <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-[#0058be] to-emerald-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: '96%' }}
                  />
                </div>
                <p className="text-xs text-neutral-400 font-semibold flex items-center justify-between">
                  <span>From 24 (Dormant)</span>
                  <span className="text-emerald-600 font-bold">To 98 (Recruiter Ready)</span>
                </p>
              </div>

              {/* Output Preview */}
              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-neutral-100 space-y-2.5">
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Target Portfolio Deliverable
                </h3>
                <p className="text-sm font-bold text-[#0b1c30] leading-relaxed">
                  github.com/your-username
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-neutral-500 font-medium">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    🦈 Pull Shark Unlocked
                  </span>
                  <span className="inline-flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    ⚡ Quickdraw Unlocked
                  </span>
                </div>
              </div>

              {/* Next Unlock Preview */}
              <div className="space-y-1 pt-2">
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  After this blueprint
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Share your verified GitGlow badge on LinkedIn, apply to college clubs, and stand out for internships with undeniable proof.
                </p>
              </div>
            </div>

          </div>

          {/* ── 2. INTERACTIVE SHOWCASE FRAME (GitHub Darkroom inside Light Canvas) ─ */}
          <div id="simulator" className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-14 md:mb-20 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
              <div>
                <h2 className="text-2xl font-bold text-[#0b1c30] mb-1">Interactive Profile Simulator</h2>
                <p className="text-sm text-neutral-500">
                  Toggle between the raw beginner profile and the GitGlow engineered portfolio.
                </p>
              </div>

              {/* Before / After Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-neutral-100 border border-neutral-200 gap-1.5 shrink-0">
                <button
                  onClick={() => setSimulatorMode('raw')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer',
                    simulatorMode === 'raw'
                      ? 'bg-white text-rose-600 shadow-sm border border-neutral-200'
                      : 'text-neutral-500 hover:text-[#0b1c30]'
                  )}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Raw Profile (24/100)</span>
                </button>

                <button
                  onClick={() => setSimulatorMode('glow')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer',
                    simulatorMode === 'glow'
                      ? 'bg-[#0058be] text-white shadow-sm'
                      : 'text-neutral-500 hover:text-[#0b1c30]'
                  )}
                >
                  <span className="w-2 h-2 rounded-full bg-[#d1f34d] animate-pulse" />
                  <span>GitGlow Pro (98/100)</span>
                </button>
              </div>
            </div>

            {/* Embedded GitHub Window Container (The Darkroom Heart) */}
            <div className="rounded-2xl bg-[#0d1117] border border-[#30363d] overflow-hidden shadow-2xl text-left text-[#c9d1d9]">
              
              {/* Window Controls */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#30363d] text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f85149]" />
                  <div className="w-3 h-3 rounded-full bg-[#e3b341]" />
                  <div className="w-3 h-3 rounded-full bg-[#3fb950]" />
                  <span className="text-[#8b949e] ml-2">
                    github.com/{simulatorMode === 'glow' ? 'ayush-engineer' : 'ayush-student'}
                  </span>
                </div>
                <span className={cn(
                  'px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider',
                  simulatorMode === 'glow' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                )}>
                  {simulatorMode === 'glow' ? 'Diagnostic: 98/100 (Elite)' : 'Diagnostic: 24/100 (Critical)'}
                </span>
              </div>

              {/* Profile Interior */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Profile Sidebar */}
                <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="relative mb-4">
                    {simulatorMode === 'glow' ? (
                      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-emerald-400/50 p-1 bg-[#0d1117] shadow-xl overflow-hidden relative">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                          alt="Engineered Avatar"
                          className="w-full h-full object-cover rounded-full"
                        />
                        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#238636] border-2 border-[#161b22] flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-[#30363d] bg-[#21262d] flex items-center justify-center text-[#8b949e]">
                        <Github size={48} className="opacity-40" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-0.5">Ayush Paul</h3>
                  <p className="text-xs font-mono text-[#8b949e] mb-3">
                    {simulatorMode === 'glow' ? 'ayush-engineer' : 'ayush-student-99'}
                  </p>

                  <p className="text-xs text-[#c9d1d9] leading-relaxed mb-4">
                    {simulatorMode === 'glow' ? (
                      'Full-Stack & Autonomous AI Builder. Shipping distributed agent pipelines. Building tools for developers. 🚀'
                    ) : (
                      <span className="text-[#8b949e] italic">
                        CS student at college. Learning C++ and Python. No bio provided.
                      </span>
                    )}
                  </p>

                  {/* Achievements Pill Bar */}
                  <div className="w-full pt-4 border-t border-[#30363d]/60">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] block mb-2">
                      GitHub Achievements
                    </span>
                    {simulatorMode === 'glow' ? (
                      <div className="flex flex-wrap gap-1.5">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-[11px] font-semibold text-white">
                          <span>🦈</span> Pull Shark
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-[11px] font-semibold text-white">
                          <span>⚡</span> Quickdraw
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-[11px] font-semibold text-white">
                          <span>👯</span> Pair
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-[#8b949e]/60 italic font-mono">
                        No public achievements unlocked yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Profile Main Body */}
                <div className="md:col-span-8 space-y-5">
                  {/* README Box */}
                  <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 text-xs">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#30363d] text-[11px] font-mono text-[#8b949e]">
                      <span className="flex items-center gap-1.5 text-white">
                        <FileText size={13} className="text-emerald-400" />
                        README.md
                      </span>
                      <span className="text-emerald-400 font-mono">
                        {simulatorMode === 'glow' ? 'STATUS: VERIFIED' : 'STATUS: MISSING'}
                      </span>
                    </div>

                    {simulatorMode === 'glow' ? (
                      <div className="space-y-3">
                        <p className="font-bold text-white text-sm">Hey there, I'm Ayush 👋</p>
                        <p className="text-[#8b949e] leading-relaxed">
                          Software engineer focused on AI agents, TypeScript systems, and developer productivity tools.
                        </p>
                        <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                          {['TypeScript', 'React', 'Python', 'FastAPI', 'Node.js', 'Docker', 'PostgreSQL'].map(t => (
                            <span key={t} className="px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d] text-emerald-400">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-[#8b949e] font-mono">
                        Profile README repository does not exist.
                      </div>
                    )}
                  </div>

                  {/* Pinned Repos */}
                  <div>
                    <div className="flex items-center justify-between mb-2 text-xs font-mono text-[#8b949e]">
                      <span>Pinned Repositories</span>
                      <span>{simulatorMode === 'glow' ? '6 of 6' : '0 of 6'}</span>
                    </div>

                    {simulatorMode === 'glow' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { name: 'agentic-crawler', desc: 'Autonomous headless web extraction engine.', lang: 'TypeScript', color: '#3178c6', stars: '84' },
                          { name: 'b-cyber-planner', desc: 'Admission intelligence & roadmap planner.', lang: 'React', color: '#61dafb', stars: '49' },
                          { name: 'rag-embedding-pipeline', desc: 'Semantic document chunking & vector search.', lang: 'Python', color: '#3572a5', stars: '112' },
                          { name: 'gitglow-engine', desc: '13-quest GitHub profile workbench for students.', lang: 'Go', color: '#00add8', stars: '320' },
                        ].map(r => (
                          <div key={r.name} className="p-3 rounded-lg bg-[#161b22] border border-[#30363d]">
                            <div className="text-xs font-bold text-[#58a6ff] mb-1 hover:underline cursor-pointer">
                              {r.name}
                            </div>
                            <p className="text-[11px] text-[#8b949e] line-clamp-1 mb-2">
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
                      <div className="p-4 rounded-xl border border-dashed border-[#30363d] text-center text-xs font-mono text-[#8b949e]">
                        No pinned repositories selected.
                      </div>
                    )}
                  </div>

                  {/* Contribution Heatmap */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5 text-xs font-mono text-[#8b949e]">
                      <span>Contribution Streak</span>
                      <span className="text-emerald-400 font-bold">{simulatorMode === 'glow' ? '🔥 42 day streak' : 'Streak: 0 days'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] overflow-x-auto">
                      <div className="flex gap-1 justify-between min-w-[450px]">
                        {Array.from({ length: 36 }).map((_, c) => (
                          <div key={c} className="flex flex-col gap-1">
                            {Array.from({ length: 7 }).map((_, r) => {
                              const lit = simulatorMode === 'glow'
                                ? (c * 7 + r) % 3 !== 0
                                : (c === 4 && r === 2) || (c === 20 && r === 5);
                              return (
                                <div
                                  key={r}
                                  className="w-2 h-2 rounded-2xs"
                                  style={{
                                    backgroundColor: lit
                                      ? simulatorMode === 'glow'
                                        ? ((c + r) % 4 === 0 ? '#39d353' : '#26a641')
                                        : '#006d32'
                                      : '#0d1117'
                                  }}
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
          </div>

          {/* ── 3. ROADMAP (Module 1 5-Card Step Layout) ──────────────────────── */}
          <div id="quests" className="space-y-6 mb-14 md:mb-20 text-left">
            <div>
              <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">The 13-Quest Curriculum</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Divided into 3 progressive phases. Complete each step in order inside the GitGlow workbench.
              </p>
            </div>

            {/* Quests Cards Grid */}
            <div className="grid gap-4 md:grid-cols-3">
              {QUESTS.map((q) => (
                <div
                  key={q.id}
                  className={cn(
                    'p-6 rounded-2xl border transition-all flex flex-col justify-between',
                    q.isPro
                      ? 'bg-white border-purple-200/80 hover:border-purple-400 shadow-sm'
                      : 'bg-white border-neutral-200 hover:border-[#0058be]/40 shadow-xs'
                  )}
                >
                  <div>
                    {/* Step badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs',
                          q.isPro
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-[#0058be]/8 text-[#0058be]'
                        )}
                      >
                        {q.stepNumber}
                      </div>

                      <span
                        className={cn(
                          'text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md font-mono',
                          q.isPro
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        )}
                      >
                        {q.isPro ? 'Pro Phase 3' : `Phase ${q.phaseNumber} · Free`}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#0b1c30] mb-2 leading-snug">
                      {q.title}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                      {q.desc}
                    </p>
                  </div>

                  {/* Card bottom */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span>~{q.estMinutes} mins</span>
                    <span className="font-semibold text-[#0058be]">{q.output}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4. INTERACTIVE PROFILE HEALTH CALCULATOR ─────────────────────── */}
          <div id="calculator" className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-14 md:mb-20 text-left">
            <div className="max-w-xl mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-2 border border-emerald-200">
                <Activity size={12} /> Instant Diagnostic Tool
              </span>
              <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">Profile Health Scorecard</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Check off what you currently have on your GitHub profile. Watch your diagnostic health rating update live.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Checkboxes List */}
              <div className="lg:col-span-7 space-y-2.5">
                {CRITERIA.map(c => {
                  const isChecked = checkedCriteria[c.id];
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleCriterion(c.id)}
                      className={cn(
                        'p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5',
                        isChecked
                          ? 'bg-[#eff4ff]/50 border-[#0058be]/30 shadow-xs'
                          : 'bg-neutral-50/50 border-neutral-200 hover:border-neutral-300'
                      )}
                    >
                      <div
                        className={cn(
                          'w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors border',
                          isChecked
                            ? 'bg-[#0058be] border-[#0058be] text-white'
                            : 'border-neutral-300 bg-white'
                        )}
                      >
                        {isChecked && <Check size={13} strokeWidth={3} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn('text-xs sm:text-sm font-bold', isChecked ? 'text-[#0b1c30]' : 'text-neutral-500')}>
                            {c.label}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[#0058be] px-1.5 py-0.5 rounded bg-[#0058be]/8 shrink-0">
                            +{c.points} pts
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                          {c.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Score Card */}
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <div className="rounded-3xl border border-neutral-200 bg-[#f8f9ff] p-6 sm:p-8 shadow-md text-center">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-4">
                    Your Current Health Score
                  </span>

                  {/* Big Number */}
                  <div className="text-6xl font-black font-mono tracking-tight mb-2" style={{ color: scoreDiagnosis.color }}>
                    {currentScore}
                    <span className="text-2xl text-neutral-400 font-sans font-normal">/100</span>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span
                      className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border"
                      style={{
                        backgroundColor: `${scoreDiagnosis.color}10`,
                        borderColor: `${scoreDiagnosis.color}30`,
                        color: scoreDiagnosis.color,
                      }}
                    >
                      {scoreDiagnosis.tag}: {scoreDiagnosis.label}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="w-full h-3 rounded-full bg-neutral-200/80 overflow-hidden mb-5">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${currentScore}%`, backgroundColor: scoreDiagnosis.color }}
                    />
                  </div>

                  <p className="text-xs text-neutral-500 leading-relaxed mb-6 font-medium">
                    {scoreDiagnosis.desc}
                  </p>

                  <Link
                    to="/blueprints/gitglow/engine"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-xs text-[#0b1c30] bg-[#d1f34d] hover:bg-[#c0e045] transition-all shadow-sm"
                  >
                    <span>Fix In GitGlow Engine →</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* ── 5. OUTCOME SECTION (Module 1 Exact Outcome Cards) ────────────── */}
          <div className="bg-[#eff4ff]/60 border border-[#eff4ff] rounded-3xl p-6 sm:p-8 mb-14 md:mb-20 space-y-6 text-left">
            <div>
              <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">What You’ll Have After This Blueprint</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                By completing these 13 quests, you build the 3 core pillars of an undeniable developer portfolio.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: <Compass className="text-[#0058be]" size={20} />,
                  title: 'Engineering Identity',
                  text: 'A clean high-resolution headshot, engineered 160-char positioning statement, and curated Profile README.',
                },
                {
                  icon: <FileText className="text-[#0058be]" size={20} />,
                  title: 'Verifiable Proof of Work',
                  text: '6 pinned repositories with live deployment demo URLs, tech stack badge grid, and dynamic GitHub stats.',
                },
                {
                  icon: <Trophy className="text-[#0058be]" size={20} />,
                  title: 'Official GitHub Achievements',
                  text: 'Pull Shark 🦈 and Quickdraw ⚡ badges verified directly by GitHub, plus continuous green square contribution habit.',
                },
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-2xl bg-white border border-neutral-100 space-y-4 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center shadow-xs">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0b1c30] mb-1">{item.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 6. PRICING & CAMPUS PACK ─────────────────────────────────────── */}
          <div id="pricing" className="mb-14 md:mb-20 text-left">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-2">
                <Zap size={12} /> Simple Pricing
              </span>
              <h2 className="text-3xl font-bold text-[#0b1c30] mb-2">Free for Beginners. Pro for Pioneers.</h2>
              <p className="text-sm text-neutral-500">
                No monthly subscriptions ever. Single one-time payment for lifetime updates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-6">
              
              {/* Free Tier */}
              <div className="rounded-3xl border border-neutral-200 bg-white p-8 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 mb-2">
                    Phase 1 & 2 · Free Tier
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-extrabold text-[#0b1c30] font-mono">₹0</span>
                    <span className="text-xs text-neutral-400 font-mono">/ forever free</span>
                  </div>
                  <p className="text-xs text-neutral-500 mb-6">
                    Everything required to build a structured, high-trust developer profile from scratch.
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      'Full Profile Health Diagnostic Scan (0–100)',
                      'Quests 01 to 08 (Complete Phase 1 & 2)',
                      'Profile README Markdown Scaffold Generator',
                      'Tech Stack & Languages Icon Grid Builder',
                      'Pinned Repositories 6-Project Showcase',
                      'Recruiter Social & Contact Badge Integration',
                      'Dynamic GitHub Stats & Streak Cards',
                    ].map(f => (
                      <div key={f} className="flex items-center gap-2.5 text-xs text-neutral-600">
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/blueprints/gitglow/engine"
                  className="w-full inline-flex items-center justify-center py-3.5 rounded-xl font-bold text-xs text-[#0b1c30] bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  Start Free Quests (01–08)
                </Link>
              </div>

              {/* Pro Tier (Featured) */}
              <div className="rounded-3xl border-2 border-[#0058be] bg-white p-8 flex flex-col justify-between shadow-xl relative">
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d1f34d] text-[#0b1c30]">
                    Most Popular
                  </span>
                </div>

                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#0058be] mb-2">
                    Full Engine · Pro Pioneer
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-extrabold text-[#0b1c30] font-mono">₹199</span>
                    <span className="text-xs text-neutral-400 font-mono">/ one-time payment</span>
                  </div>
                  <p className="text-xs text-neutral-500 mb-6">
                    Automated workflows, 3 starter project kits, and official GitHub badge unlock accelerators.
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      'Everything in Free Tier',
                      'Quests 09 to 13 (Phase 3 Complete)',
                      'Automated GitHub Actions Cron Workflow',
                      'Pull Shark 🦈 First OSS PR Guided Walkthrough',
                      'Quickdraw ⚡ Fast Issue Triaging Accelerator',
                      '3 Production Starter Project Kits (Python/AI/Next)',
                      'Green-Square Jumpstart: 30-Day Contribution Habit',
                      'Gold "Verified Pro Pioneer" Community Badge',
                    ].map(f => (
                      <div key={f} className="flex items-center gap-2.5 text-xs text-[#0b1c30] font-medium">
                        <CheckCircle2 size={15} className="text-[#0058be] shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/blueprints/gitglow/engine"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs text-white bg-[#0058be] hover:bg-[#0047a0] transition-all shadow-md shadow-[#0058be]/20"
                >
                  <Sparkles size={14} />
                  <span>Unlock Pro Access — ₹199</span>
                </Link>
              </div>

            </div>

            {/* Campus Pack */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0058be]/8 text-[#0058be] flex items-center justify-center shrink-0">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0b1c30] mb-0.5">Campus Club Pack (Coding Societies)</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
                    Bulk licensing for college coding clubs, ACM/IEEE student branches, and hackathon teams. Includes 50 student seats, club leaderboard, and live onboarding AMA.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <div>
                  <span className="text-2xl font-bold font-mono text-[#0b1c30]">₹999</span>
                  <span className="text-xs text-neutral-400 font-mono"> / club / yr</span>
                </div>
                <a
                  href="mailto:contact@ayushpaul.in?subject=GitGlow Campus Pack Inquiry"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#0058be] border border-[#0058be]/30 hover:bg-[#eff4ff] transition-all"
                >
                  Inquire →
                </a>
              </div>
            </div>
          </div>

          {/* ── 7. FAQ ACCORDION ─────────────────────────────────────────────── */}
          <div id="faq" className="max-w-4xl mx-auto mb-14 md:mb-20 text-left">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] mb-2">Frequently Asked Questions</h2>
              <p className="text-sm text-neutral-500">
                Common questions about the curriculum, sandbox PR repo, and official achievements.
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
          </div>

          {/* ── 8. FINAL BOTTOM CALL TO ACTION (Module 1 Navy Card Exact) ────── */}
          <div className="relative rounded-3xl bg-[#0b1c30] text-white p-8 sm:p-14 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0058be]/25 via-transparent to-[#d1f34d]/10 pointer-events-none" />
            
            <div className="space-y-2 z-10 max-w-xl">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Ready to Glow Up Your Profile?
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                Stop sending recruiters an empty GitHub link. Complete your 13 quests and turn your profile into your strongest job search asset.
              </p>
            </div>

            <div className="z-10 shrink-0">
              <Link
                to="/blueprints/gitglow/engine"
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm text-[#0b1c30] bg-[#d1f34d] hover:bg-[#c2e240] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
              >
                <span>Launch GitGlow Engine</span>
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

export default GitGlowHomePage;
