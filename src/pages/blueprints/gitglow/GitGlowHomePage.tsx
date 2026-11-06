import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Github,
  Star,
  Zap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  Shield,
  Layers,
  Clock,
  FileText,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Code2,
  GitPullRequest,
  Terminal,
  Trophy,
  AlertCircle,
  FolderGit2,
  Cpu,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DURATION, EASING } from '../../../lib/motion-presets';

// ─── 13 Quests Roadmap Data ──────────────────────────────────────────────────
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
  // Phase 1: Identity & Foundation (Quests 01–04)
  {
    id: 'q1',
    stepNumber: '01',
    phaseNumber: 1,
    phaseName: 'Foundation',
    title: 'Profile Picture & Verified Display Name',
    desc: 'Establish instant recruiter trust in 0.1s. Configure high-resolution headshot framing, clean lighting, and canonical name display.',
    estMinutes: 4,
    output: 'Identity Verified',
  },
  {
    id: 'q2',
    stepNumber: '02',
    phaseNumber: 1,
    phaseName: 'Foundation',
    title: 'The 160-Character Recruiter Pitch Bio',
    desc: 'Craft an engineered bio stating who you are, what stack you ship with, and what problems you solve instead of generic student tags.',
    estMinutes: 6,
    output: 'Positioning Statement',
  },
  {
    id: 'q3',
    stepNumber: '03',
    phaseNumber: 1,
    phaseName: 'Foundation',
    title: 'Initialize the Secret Username Repository',
    desc: 'Unlock GitHub\'s profile canvas by provisioning a special public repository matching your exact username (username/username).',
    estMinutes: 5,
    output: 'Canvas Initialized',
  },
  {
    id: 'q4',
    stepNumber: '04',
    phaseNumber: 1,
    phaseName: 'Foundation',
    title: 'Tech Stack Icon Grid & Visual Shields',
    desc: 'Mount organized shields.io badges displaying your programming languages, frontend libraries, and backend tools readable in 3 seconds.',
    estMinutes: 8,
    output: 'Tech Stack Grid',
  },

  // Phase 2: Proof & Architecture (Quests 05–08)
  {
    id: 'q5',
    stepNumber: '05',
    phaseNumber: 2,
    phaseName: 'Proof',
    title: 'Curate 6 Pinned Showcase Repositories',
    desc: 'Select 6 high-impact repositories to pin. Remove abandoned homework assignments and replace with structured, runnable projects.',
    estMinutes: 10,
    output: '6 Pinned Showcases',
  },
  {
    id: 'q6',
    stepNumber: '06',
    phaseNumber: 2,
    phaseName: 'Proof',
    title: 'Live Production Demos & Repository Topics',
    desc: 'Add live deployment URLs (Vercel, Render, GitHub Pages) and discoverability topic tags (#react, #typescript, #fullstack) to each repo.',
    estMinutes: 8,
    output: 'Live Demos Linked',
  },
  {
    id: 'q7',
    stepNumber: '07',
    phaseNumber: 2,
    phaseName: 'Proof',
    title: 'Social & Recruiter Contact Touchpoints',
    desc: 'Add high-trust contact buttons for LinkedIn, portfolio website, and professional email directly on your profile README.',
    estMinutes: 5,
    output: 'Recruiter Hooks',
  },
  {
    id: 'q8',
    stepNumber: '08',
    phaseNumber: 2,
    phaseName: 'Proof',
    title: 'The Standard Project README Architecture',
    desc: 'Apply the 5-part README template (Problem, Solution, Architecture Diagram, Local Setup, Live Demo) to your flagship repository.',
    estMinutes: 12,
    output: 'Flagship README',
  },

  // Phase 3: Automation & Badging (Quests 09–13)
  {
    id: 'q9',
    stepNumber: '09',
    phaseNumber: 3,
    phaseName: 'Automation',
    title: 'Fork the Safe gitglow-community Sandbox',
    desc: 'Fork our official safe sandbox repository with zero risk of breaking production. Set up your upstream remote properly.',
    estMinutes: 5,
    output: 'Sandbox Forked',
    isPro: true,
  },
  {
    id: 'q10',
    stepNumber: '10',
    phaseNumber: 3,
    phaseName: 'Automation',
    title: 'Create Your Contributor Card via Clean Git Branch',
    desc: 'Practice proper Git feature branch workflow (git checkout -b feat/your-username) and commit your contributor profile JSON.',
    estMinutes: 7,
    output: 'Clean Branch & Commit',
    isPro: true,
  },
  {
    id: 'q11',
    stepNumber: '11',
    phaseNumber: 3,
    phaseName: 'Automation',
    title: 'Submit Verified Pull Request & Unlock Pull Shark 🦈',
    desc: 'Open your first verified pull request to gitglow-community. Passing automated CI tests will award your official GitHub Pull Shark badge.',
    estMinutes: 8,
    output: 'Pull Shark Badge',
    isPro: true,
  },
  {
    id: 'q12',
    stepNumber: '12',
    phaseNumber: 3,
    phaseName: 'Automation',
    title: 'Automated GitHub Actions CI Workflow',
    desc: 'Implement a GitHub Actions workflow (.github/workflows/ci.yml) that automatically runs linter and build tests on every push.',
    estMinutes: 10,
    output: 'CI Automation Live',
    isPro: true,
  },
  {
    id: 'q13',
    stepNumber: '13',
    phaseNumber: 3,
    phaseName: 'Automation',
    title: 'Dynamic Profile Stats & Activity Streak SVG',
    desc: 'Embed self-refreshing GitHub Stats and contribution streak cards that update automatically on your profile as you ship code.',
    estMinutes: 6,
    output: 'Dynamic SVGs Active',
    isPro: true,
  },
];

// ─── FAQ Accordion Item ──────────────────────────────────────────────────────
const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden transition-all duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-center justify-between text-left text-sm sm:text-base font-bold text-[#0b1c30] hover:text-[#0058be] transition-colors focus:outline-none"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="p-1 rounded-full bg-neutral-100 text-[#0b1c30] shrink-0 ml-4">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── GitGlow Home Page ────────────────────────────────────────────────────────
export const GitGlowHomePage: React.FC = () => {
  const [activePhaseTab, setActivePhaseTab] = useState<number>(0); // 0 = all, 1, 2, 3

  const filteredQuests = QUESTS.filter((q) => {
    if (activePhaseTab === 0) return true;
    return q.phaseNumber === activePhaseTab;
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] pt-24 pb-20 overflow-x-hidden selection:bg-[#d1f34d] selection:text-[#0b1c30]">
      
      {/* ─── Upper Navigation / Back link ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-4 pb-8">
        <Link
          to="/blueprints"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-[#0058be] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0058be] rounded-lg p-1.5"
          aria-label="Back to Blueprints collection"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back to Blueprints</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* ─── Hero Section (Module 1 Inspired 2-Column Layout) ───────────── */}
        <section id="overview" className="grid lg:grid-cols-[1fr_390px] gap-10 xl:gap-16 items-start mb-16 md:mb-24">
          
          {/* Left Column: Hero Copy + Meta Chips + Primary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASING.PREMIUM }}
            className="space-y-6 text-left"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0058be]/8 text-[#0058be] text-[11px] font-bold uppercase tracking-widest border border-[#0058be]/15">
              <Github size={12} className="text-[#0058be]" aria-hidden="true" />
              <span>Blueprint 03 • Open Source Track</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0b1c30] leading-[1.08]">
              Glow Up Your GitHub <br />
              <span className="text-[#0058be]">From Zero to Pro</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
              A 13-quest execution blueprint engineered for first-year engineers and beginners. Transform your profile from an empty student assignment repo into a recruiter-grade engineering showcase with verified proof, badges, and automated workflows.
            </p>

            {/* Meta Chips */}
            <div className="flex flex-wrap gap-2.5 pt-2" role="list" aria-label="Blueprint details">
              {[
                { icon: <Clock size={14} className="text-neutral-500" />, label: '25–35 Mins Total' },
                { icon: <Star size={14} className="text-neutral-500" />, label: 'Beginner Friendly' },
                { icon: <Layers size={14} className="text-neutral-500" />, label: '13 Guided Quests' },
                {
                  icon: <FileText size={14} className="text-[#0b1c30]" />,
                  label: 'Output: Recruiter-Ready Profile',
                  accent: true,
                },
              ].map((chip, i) => (
                <div
                  key={i}
                  role="listitem"
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border select-none transition-all',
                    chip.accent
                      ? 'bg-[#d1f34d] border-[#d1f34d]/60 text-[#0b1c30] shadow-xs'
                      : 'bg-white border-neutral-200 text-neutral-600',
                  )}
                >
                  {chip.icon}
                  <span>{chip.label}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <Link
                to="/blueprints/gitglow/engine"
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#0058be] text-white font-bold text-base transition-all shadow-[0_8px_24px_rgba(0,88,190,0.22)] hover:bg-[#0047a0] hover:shadow-[0_12px_28px_rgba(0,88,190,0.3)] focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2"
              >
                <span>Launch GitGlow Engine</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <a
                href="#quests"
                className="flex items-center justify-center px-6 py-4 rounded-xl border border-neutral-200 bg-white text-[#0b1c30] hover:bg-neutral-50 font-bold text-base transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]"
              >
                <span>View 13 Quests Roadmap</span>
              </a>
            </div>

            <p className="text-xs text-neutral-500 font-medium pt-1">
              Helper note: You are not writing thousands of lines of complex code. You are establishing clean repository architecture and verified open-source proof.
            </p>
          </motion.div>

          {/* Right Column: "GitGlow at a glance" Card (Matching Module 1) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASING.PREMIUM }}
            className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl space-y-6 text-left"
          >
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3 flex items-center justify-between">
              <span>GitGlow at a glance</span>
              <span className="text-[#0058be] font-mono text-[10px]">v1.0 SPEC</span>
            </h2>

            {/* Curriculum Progress Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#0b1c30]">Curriculum Scope</span>
                <span className="text-sm font-extrabold text-[#0058be]">13 Quests</span>
              </div>
              <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden relative">
                <div
                  className="h-full bg-[#0058be] rounded-full transition-all duration-500 ease-out"
                  style={{ width: '100%' }}
                />
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                3 Structured Phases • Foundation, Proof & Automation
              </p>
            </div>

            {/* Final Deliverable Preview */}
            <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-neutral-100 space-y-2.5">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Final Deliverable
              </h3>
              <p className="text-sm font-bold text-[#0b1c30] leading-relaxed">
                A verified GitHub presence featuring clean README architecture, 6 pinned showcase repos with live URLs, automated CI workflows, and the official GitHub Pull Shark 🦈 badge.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span>Verified across 13 guided steps</span>
              </div>
            </div>

            {/* Safe Sandbox Assurance */}
            <div className="space-y-1.5 pt-1">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={12} className="text-emerald-600" />
                <span>Zero Risk Guarantee</span>
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Practice Git commits and pull requests against our dedicated safe sandbox repository (<span className="font-mono text-[#0058be]">gitglow-community</span>) with automated bot reviews.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ─── Section 2: The Transformation at a Glance (Before vs. After) ─── */}
        <section id="transformation" className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-sm mb-16 md:mb-24 text-left">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-widest mb-3">
              <Sparkles size={11} className="text-[#0058be]" /> Visual Proof
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight mb-2">
              The Transformation at a Glance
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Why 87% of student GitHub profiles get ignored in the first 5 seconds — and how GitGlow restructures your profile into a hiring asset.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* The Default Profile (Before) */}
            <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-[11px] font-bold uppercase tracking-wider">
                  Before: Default Profile
                </span>
                <span className="text-xs font-semibold text-rose-600">87% Ignored</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-neutral-700">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</div>
                  <p><strong className="text-[#0b1c30]">Anonymous Identity:</strong> Default GitHub identicon or anime picture; recruiters cannot verify who you are.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</div>
                  <p><strong className="text-[#0b1c30]">Vague Bio:</strong> Generic “B.Tech Student @ College | Aspiring Developer” that says nothing about what you build.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</div>
                  <p><strong className="text-[#0b1c30]">Zero Pinned Projects:</strong> Either empty, or abandoned homework repos with names like “project-1” and no README.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</div>
                  <p><strong className="text-[#0b1c30]">Empty Contribution Canvas:</strong> Sporadic grey squares with zero open-source interaction and 0 achievement badges.</p>
                </div>
              </div>
            </div>

            {/* The GitGlow Engineered Profile (After) */}
            <div className="p-6 rounded-2xl border border-[#0058be]/25 bg-blue-50/20 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#0058be]/10">
                <span className="px-2.5 py-1 rounded-md bg-[#0058be] text-white text-[11px] font-bold uppercase tracking-wider">
                  After: GitGlow Profile
                </span>
                <span className="text-xs font-bold text-[#0058be]">Recruiter Ready in 5s</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-neutral-700">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                  <p><strong className="text-[#0b1c30]">High-Trust Headshot:</strong> Clean professional framing and canonical name matching your resume and LinkedIn.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                  <p><strong className="text-[#0b1c30]">160-Char Pitch Bio:</strong> States your stack, the systems you ship, and your primary technical focus clearly.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                  <p><strong className="text-[#0b1c30]">6 Curated Showcases:</strong> Every repo has a 1-sentence value statement, topic tags, and a verifiable live demo URL.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                  <p><strong className="text-[#0b1c30]">Verified Pull Shark 🦈 Badge:</strong> Real open-source PR merged into our sandbox repo, proving collaborative Git fluency.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── Section 3: What You'll Complete: The 13 Quests Roadmap ─────── */}
        <section id="quests" className="space-y-8 mb-16 md:mb-24 text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-2 border border-[#0058be]/15">
                <Layers size={11} /> Guided Curriculum
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">
                What You’ll Complete
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 mt-1 max-w-xl">
                The blueprint is structured into 13 atomic quests across three distinct execution phases.
              </p>
            </div>

            {/* Phase Filters */}
            <div className="inline-flex items-center p-1 rounded-xl bg-white border border-neutral-200 shadow-2xs gap-1">
              {[
                { id: 0, label: 'All (13)' },
                { id: 1, label: 'Phase 1: Foundation (4)' },
                { id: 2, label: 'Phase 2: Proof (4)' },
                { id: 3, label: 'Phase 3: Automation (5)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePhaseTab(tab.id)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all',
                    activePhaseTab === tab.id
                      ? 'bg-[#0b1c30] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-[#0b1c30] hover:bg-neutral-50',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quests Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredQuests.map((quest) => (
              <div
                key={quest.id}
                className={cn(
                  'relative p-6 rounded-2xl border bg-white transition-all duration-200 flex flex-col justify-between hover:shadow-md hover:border-[#0058be]/30',
                  quest.isPro ? 'border-neutral-200' : 'border-neutral-200',
                )}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="w-8 h-8 rounded-xl bg-[#0058be]/8 text-[#0058be] font-mono font-extrabold text-xs flex items-center justify-center">
                      {quest.stepNumber}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {quest.phaseName}
                      </span>
                      {quest.isPro && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#d1f34d] text-[#0b1c30]">
                          Pro
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#0b1c30] leading-snug mb-2">
                    {quest.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                    {quest.desc}
                  </p>
                </div>

                {/* Card Footer: Output badge & time */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold text-neutral-500">
                    <Clock size={12} className="text-neutral-400" />
                    <span>{quest.estMinutes} mins</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-md bg-[#f8f9ff] border border-neutral-200 text-[#0b1c30] font-bold text-[10px] tracking-tight">
                    {quest.output}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Engine Direct Launch CTA */}
          <div className="p-6 rounded-2xl bg-white border border-[#0058be]/20 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d1f34d] text-[#0b1c30] flex items-center justify-center shrink-0">
                <Code2 size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0b1c30]">Ready to execute the quests step-by-step?</p>
                <p className="text-xs text-neutral-500">Launch the interactive engine to track progress and generate all copy.</p>
              </div>
            </div>

            <Link
              to="/blueprints/gitglow/engine"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0058be] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#0047a0] transition-colors shrink-0"
            >
              <span>Launch Engine Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ─── Section 4: Why This Works: The 3 Core Pillars ──────────────── */}
        <section id="why-it-works" className="space-y-6 mb-16 md:mb-24 text-left">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-widest mb-2">
              <Shield size={11} className="text-emerald-600" /> Architectural Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">
              Why GitGlow Works
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-1">
              Engineered around real recruiter heuristics and hiring manager scanning patterns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0058be]/8 text-[#0058be] flex items-center justify-center font-bold">
                <Zap size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                1. Recruiter Scan Psychology
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Engineering recruiters spend an average of 15 seconds skimming a candidate’s profile. If your stack and top projects aren’t immediately visible, they move to the next candidate. GitGlow creates a high-contrast, instant-scan visual hierarchy.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FolderGit2 size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                2. Verifiable Proof Over Claims
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Anyone can write “Proficient in React and Node” on a resume. GitGlow proves competence by curating 6 pinned repositories, each equipped with live working URLs, topic tags, and architectural README breakdowns that verify you ship real code.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <GitPullRequest size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                3. Zero-Fear Open Source Sandbox
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Beginners often fear contributing to open source because they worry about making mistakes. Our dedicated repository (<span className="font-mono text-[#0058be]">gitglow-community</span>) gives you a friendly sandbox with automated bot checks where you can safely submit your first PR.
              </p>
            </div>

          </div>
        </section>

        {/* ─── Section 5: Transparent Tier Selection (Free vs Pro) ────────── */}
        <section id="pricing" className="space-y-6 mb-16 md:mb-24 text-left">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-widest mb-2">
              <Trophy size={11} className="text-[#0058be]" /> Clear Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">
              Choose Your Starting Point
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-1">
              Start 100% free with the core blueprint, or upgrade to Pro Pioneer for advanced CI workflows and project kits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            
            {/* Free Tier Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Standard Access</span>
                    <h3 className="text-2xl font-bold text-[#0b1c30]">GitGlow Core</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-[#0b1c30]">₹0</span>
                    <span className="block text-[11px] font-medium text-neutral-400">Free Forever</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Everything you need to transform your personal profile into a professional, recruiter-ready developer showcase.
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700" role="list">
                  {[
                    'Quests 01–08 (Complete Foundation & Proof phases)',
                    'The 160-character bio generator & formulas',
                    'Custom Profile README Markdown architecture',
                    'Tech stack shield & badge generator matrix',
                    '6 Pinned showcase repository curation checklist',
                    'Step-by-step first safe PR guide to gitglow-community',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/blueprints/gitglow/engine"
                className="w-full py-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-[#0b1c30] font-bold text-sm text-center transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]"
              >
                Launch Free Blueprint
              </Link>
            </div>

            {/* Pro Pioneer Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#0058be] shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-[#d1f34d] text-[#0b1c30] text-[10px] font-extrabold uppercase tracking-wider">
                  Recommended
                </span>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0058be]">Full Career Suite</span>
                    <h3 className="text-2xl font-bold text-[#0b1c30]">GitGlow Pro Pioneer</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-[#0058be]">₹199</span>
                    <span className="block text-[11px] font-medium text-neutral-400">One-time payment</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Full 13-quest access with CI automation templates, dynamic SVG activity streak workflows, and starter project kits.
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700" role="list">
                  {[
                    'Everything in GitGlow Core (Quests 01–08)',
                    'Complete Quests 09–13 (Advanced Automation & Badging)',
                    'Official GitHub Actions CI workflow config (.github/ci.yml)',
                    'Dynamic GitHub streak & stats SVG configuration',
                    '6 Production starter project kits with live deployment guides',
                    'Priority PR review & instant merge in gitglow-community',
                    'Official Pull Shark 🦈 badge verification path',
                    'Verified Certificate of Open Source Completion',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={16} className="text-[#0058be] shrink-0 mt-0.5" />
                      <span className="font-medium text-[#0b1c30]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/blueprints/gitglow/engine?tier=pro"
                className="w-full py-4 rounded-xl bg-[#0058be] hover:bg-[#0047a0] text-white font-bold text-sm text-center transition-all shadow-[0_8px_20px_rgba(0,88,190,0.25)] focus:outline-none focus:ring-2 focus:ring-[#0058be]"
              >
                Unlock Pro Pioneer — ₹199
              </Link>
            </div>

          </div>
        </section>

        {/* ─── Section 6: Frequently Asked Questions ───────────────────────── */}
        <section id="faq" className="max-w-3xl mx-auto space-y-6 mb-16 md:mb-24 text-left">
          <div className="text-center space-y-2 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-widest">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Everything you need to know about GitGlow, safe sandbox PRs, and badge unlocks.
            </p>
          </div>

          <div className="space-y-3">
            <FAQItem
              q="I am a complete beginner in 1st year B.Tech. Can I do this?"
              a="Yes, absolutely. GitGlow was built specifically for students and beginners. Every quest comes with exact copy-paste templates, step-by-step guidance, and visual examples. You do not need to be an expert programmer to establish clean presentation standards."
            />
            <FAQItem
              q="What is the gitglow-community safe sandbox repository?"
              a="When beginners try to make their first open-source pull request, they are often terrified of making mistakes on major repos. We created gitglow-community as a safe, welcoming sandbox where you can practice branching, committing, and opening a PR. Automated bot checks review your submission and merge it safely."
            />
            <FAQItem
              q="How do I get the official GitHub Pull Shark 🦈 badge?"
              a="GitHub automatically awards the Pull Shark badge to any user who has a pull request merged. By following Quest 11 and opening a clean PR to our gitglow-community repository, once merged, GitHub automatically adds the verified badge to your public profile."
            />
            <FAQItem
              q="How long does it take to complete the blueprint?"
              a="The core foundation quests (01–08) can easily be completed in 25 to 35 minutes. If you also configure the GitHub Actions CI workflows and dynamic SVG stats (Quests 09–13), the entire system takes about 45 to 60 minutes."
            />
            <FAQItem
              q="Do I need to pay for GitGlow Core?"
              a="No. The core blueprint (Quests 01 to 08) is 100% free forever. It gives you the full README architecture, 160-char bio generator, and repository curation checklist. Pro Pioneer is an optional upgrade for advanced GitHub Actions CI workflows and starter project kits."
            />
          </div>
        </section>

        {/* ─── Section 7: Final CTA Banner ─────────────────────────────────── */}
        <section className="rounded-3xl bg-[#0b1c30] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0058be]/25 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#d1f34d] text-[10px] font-extrabold uppercase tracking-widest border border-white/10">
              <Sparkles size={11} /> Start Today
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Turn Your GitHub Into an <br />
              <span className="text-[#d1f34d]">Engineered Showcase</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl mx-auto">
              Skip the confusion of generic templates. Follow the 13-quest execution path and stand out to recruiters on your very next application.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/blueprints/gitglow/engine"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#d1f34d] text-[#0b1c30] font-extrabold text-sm uppercase tracking-wider hover:bg-[#c2e240] transition-colors shadow-lg shadow-[#d1f34d]/20"
              >
                Launch GitGlow Engine Now
              </Link>
              
              <Link
                to="/blueprints"
                className="w-full sm:w-auto px-6 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors"
              >
                Browse All Blueprints
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 text-[11px] text-neutral-400 font-medium border-t border-white/10 mt-6">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#d1f34d]" /> Instant Free Access
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#d1f34d]" /> 100% Beginner Safe
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#d1f34d]" /> Real GitHub Achievements
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
