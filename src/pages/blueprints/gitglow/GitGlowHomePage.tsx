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
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DURATION, EASING } from '../../../lib/motion-presets';
import { GITHUB_BADGES, GitHubBadge } from '../../../data/gitglow/github-badges';

// ─── FAQ Accordion Item ──────────────────────────────────────────────────────
const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-neutral-200/90 rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-2xs hover:border-neutral-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-center justify-between text-left text-sm sm:text-base font-bold text-[#0b1c30] hover:text-[#0058be] transition-colors focus:outline-none"
        aria-expanded={open}
      >
        <span className="pr-4">{q}</span>
        <span className="p-1.5 rounded-full bg-neutral-100 text-[#0b1c30] shrink-0">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
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

// ─── Badge Card Component ────────────────────────────────────────────────────
const BadgeCard: React.FC<{ badge: GitHubBadge }> = ({ badge }) => {
  const [expanded, setExpanded] = useState(false);

  const difficultyColors = {
    'Very Easy': 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Easy': 'bg-blue-50 text-blue-800 border-blue-200',
    'Medium': 'bg-amber-50 text-amber-800 border-amber-200',
    'Hard': 'bg-purple-50 text-purple-800 border-purple-200',
    'Special': 'bg-slate-100 text-slate-700 border-slate-300',
  }[badge.difficulty];

  return (
    <div
      className={cn(
        'relative p-6 sm:p-7 rounded-3xl border bg-white transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1',
        badge.isRecommendedStarter
          ? 'border-[#0058be]/35 ring-1 ring-[#0058be]/15 shadow-sm'
          : 'border-neutral-200/90 shadow-2xs hover:border-neutral-300',
      )}
    >
      <div>
        {/* Top Header: Badge Image + Status Capsules */}
        <div className="flex items-start justify-between gap-4 mb-5">
          {/* Badge Image Frame */}
          <div className="relative group">
            <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-2xl bg-[#f8f9ff] border border-neutral-200/80 p-2.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
              <img
                src={badge.image}
                alt={badge.name}
                className="w-full h-full object-contain filter drop-shadow-md select-none"
                loading="lazy"
              />
            </div>
            {badge.isRecommendedStarter && (
              <span className="absolute -top-2.5 -right-2 px-2.5 py-0.5 rounded-full bg-[#d1f34d] text-[#0b1c30] text-[9px] font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1 border border-[#0b1c30]/10">
                <Flame size={10} fill="#0b1c30" /> Starter
              </span>
            )}
          </div>

          {/* Difficulty & Status Pills */}
          <div className="flex flex-col items-end gap-1.5 text-right">
            <span
              className={cn(
                'text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border',
                difficultyColors,
              )}
            >
              {badge.difficulty}
            </span>
            <span
              className={cn(
                'text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md border',
                badge.status === 'obtainable'
                  ? 'bg-emerald-50/70 text-emerald-800 border-emerald-200/70'
                  : badge.status === 'testing'
                  ? 'bg-amber-50/70 text-amber-800 border-amber-200/70'
                  : 'bg-neutral-100 text-neutral-500 border-neutral-200',
              )}
            >
              {badge.statusLabel}
            </span>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-[#0b1c30] tracking-tight mb-1 flex items-center gap-2">
          <span>{badge.name}</span>
        </h3>
        <p className="text-xs text-neutral-500 font-medium mb-4 italic">
          "{badge.tagline}"
        </p>

        {/* How To Unlock Box */}
        <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-neutral-100 space-y-1.5 mb-4 text-xs text-neutral-700">
          <p className="font-bold text-[#0b1c30] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <CheckCircle2 size={13} className="text-[#0058be]" />
            <span>GitHub Unlock Criteria:</span>
          </p>
          <p className="leading-relaxed text-neutral-600 font-medium">{badge.howToGet}</p>
        </div>

        {/* Blueprint Strategy Callout */}
        <div className="space-y-1 mb-4 text-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
            GitGlow Blueprint Engine Strategy
          </span>
          <p className="text-neutral-700 font-medium leading-relaxed">
            {badge.blueprintStrategy}
          </p>
        </div>

        {/* Tiers Preview (if badge has tiers) */}
        {badge.tiers && badge.tiers.length > 0 && (
          <div className="mb-4 pt-2.5 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Available Multiplier Tiers:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {badge.tiers.map((tier, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-50 border border-neutral-200 text-[#0b1c30] font-semibold"
                  title={tier.description}
                >
                  {tier.level.split(' ')[0]}: {tier.threshold.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Actions & Details Drawer */}
      <div className="pt-4 border-t border-neutral-100 space-y-2">
        {badge.isObtainable ? (
          <Link
            to={`/blueprints/gitglow/engine?badge=${badge.id}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-[#0058be] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#0047a0] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0058be]"
          >
            <span>Launch Claim Engine</span>
            <ArrowRight size={14} />
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-1.5 w-full py-3.5 px-4 rounded-xl bg-neutral-100 text-neutral-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed">
            <Lock size={13} />
            <span>{badge.status === 'testing' ? 'In GitHub Beta Testing' : 'Archived Snapshot'}</span>
          </div>
        )}

        {/* Expandable Gotchas / Details Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-[11px] font-semibold text-neutral-500 hover:text-[#0058be] py-1.5 transition-colors flex items-center justify-center gap-1"
        >
          <span>{expanded ? 'Hide Technical Rules & Gotchas' : 'View Technical Rules & Gotchas'}</span>
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden text-left text-xs space-y-2.5 pt-2"
            >
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                <div>
                  <p className="font-bold text-[#0b1c30] text-[10px] uppercase tracking-wider mb-1">
                    Strict Requirements:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-600">
                    {badge.requirements.map((req, rIdx) => (
                      <li key={rIdx}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-amber-800 text-[10px] uppercase tracking-wider mb-1">
                    Known Gotchas:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-600">
                    {badge.gotchas.map((gotcha, gIdx) => (
                      <li key={gIdx}>{gotcha}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── Main GitGlow Page ────────────────────────────────────────────────────────
export const GitGlowHomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [simulatedBadges, setSimulatedBadges] = useState<string[]>(['quickdraw', 'pull-shark']);

  const toggleSimulatedBadge = (badgeId: string) => {
    setSimulatedBadges((prev) =>
      prev.includes(badgeId) ? prev.filter((id) => id !== badgeId) : [...prev, badgeId]
    );
  };

  const filteredBadges = useMemo(() => {
    if (selectedCategory === 'all') return GITHUB_BADGES;
    if (selectedCategory === 'obtainable') return GITHUB_BADGES.filter((b) => b.isObtainable);
    if (selectedCategory === 'starter') return GITHUB_BADGES.filter((b) => b.isRecommendedStarter);
    return GITHUB_BADGES.filter((b) => b.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] pt-24 pb-20 overflow-x-hidden selection:bg-[#d1f34d] selection:text-[#0b1c30]">
      
      {/* ─── Upper Navigation / Back link ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-4 pb-6">
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
        
        {/* ─── Hero Section: The Frustration Hook & The Badge Solution ────── */}
        <section id="overview" className="mb-20 md:mb-28 text-center sm:text-left">
          
          <div className="max-w-4xl mx-auto lg:mx-0 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0058be]/8 border border-[#0058be]/15 text-[#0058be] text-[11px] font-bold uppercase tracking-widest">
              <Sparkles size={12} className="text-[#0058be]" />
              <span>For First-Year Devs Tired of Copy-Paste Tutorials</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0b1c30] leading-[1.05]">
              Markdown icons don’t prove you code. <br />
              <span className="text-[#0058be]">Official GitHub Badges do.</span>
            </h1>

            <p className="text-base sm:text-xl text-neutral-600 leading-relaxed max-w-3xl">
              Every tutorial tells you to paste glowing shields and fake contribution snakes. Recruiters scroll past that in 2 seconds. The only un-fakeable proof on GitHub is official achievement badges directly awarded by GitHub: <strong className="text-[#0b1c30]">Pull Shark 🦈</strong>, <strong className="text-[#0b1c30]">Quickdraw ⚡</strong>, <strong className="text-[#0b1c30]">YOLO 🪂</strong>, and <strong className="text-[#0b1c30]">Pair Extraordinaire 👯</strong>.
            </p>

            <p className="text-sm sm:text-base text-neutral-500 max-w-2xl leading-relaxed">
              Most guides just give you vague steps and tell you to "go find an open source project." GitGlow provides the actual execution engine: a safe sandbox repository and automated workflows to legitimately claim your first 3 badges today without the fear of messing up a public repository.
            </p>

            {/* Hero Action Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/blueprints/gitglow/engine?badge=quickdraw"
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#d1f34d] text-[#0b1c30] font-extrabold text-base transition-all shadow-[0_8px_24px_rgba(209,243,77,0.35)] hover:bg-[#c2e240] hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#0058be]"
              >
                <span>Claim Quickdraw First (2 Mins)</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <a
                href="#catalog"
                className="flex items-center justify-center px-7 py-4 rounded-2xl border border-neutral-300 bg-white text-[#0b1c30] hover:bg-neutral-50 font-bold text-base transition-all shadow-2xs"
              >
                <span>Explore All 10 Badges</span>
              </a>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-neutral-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>100% Real GitHub Achievements</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Zero Risk: Safe Community Sandbox</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Permanent on Your Profile Header</span>
              </span>
            </div>
          </div>

          {/* ─── Interactive Profile Header Simulator ────────────────────── */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-xl max-w-5xl mx-auto lg:mx-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0058be]">
                  Interactive Preview
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#0b1c30]">
                  How Your GitHub Profile Looks After Claiming
                </h2>
              </div>
              <p className="text-xs text-neutral-500">
                Click badges below to preview them on your profile header:
              </p>
            </div>

            {/* Simulated GitHub Profile Card */}
            <div className="mt-6 p-6 sm:p-8 rounded-2xl bg-[#0d1117] text-white shadow-2xl border border-neutral-800 text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
                {/* User Identity Mini */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0058be] to-[#d1f34d] p-0.5">
                    <div className="w-full h-full rounded-full bg-[#161b22] flex items-center justify-center font-bold text-lg text-white">
                      AP
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Alex Rivera</span>
                      <span className="text-xs font-normal text-neutral-400">@arivera-dev</span>
                    </h3>
                    <p className="text-xs text-neutral-300">
                      Frontend & AI Developer · Building open source tools
                    </p>
                  </div>
                </div>

                {/* Simulated Achievements Container */}
                <div className="bg-[#161b22] p-3 rounded-2xl border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                      Achievements ({simulatedBadges.length})
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400">● GitHub Verified</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {simulatedBadges.length === 0 ? (
                      <span className="text-xs text-neutral-500 italic py-2">
                        No badges unlocked yet (click pills below to simulate)
                      </span>
                    ) : (
                      simulatedBadges.map((badgeId) => {
                        const b = GITHUB_BADGES.find((x) => x.id === badgeId);
                        if (!b) return null;
                        return (
                          <div
                            key={b.id}
                            className="group relative flex flex-col items-center"
                            title={b.name}
                          >
                            <div className="w-12 h-12 rounded-xl bg-[#21262d] p-1 flex items-center justify-center border border-neutral-700/80 shadow-md">
                              <img src={b.image} alt={b.name} className="w-10 h-10 object-contain" />
                            </div>
                            <span className="text-[9px] font-semibold text-neutral-300 mt-1">
                              {b.name}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Badges Toggler Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-neutral-400 font-medium mr-2">Toggle Badge Unlocks:</span>
                {[
                  { id: 'quickdraw', name: 'Quickdraw ⚡' },
                  { id: 'pull-shark', name: 'Pull Shark 🦈' },
                  { id: 'yolo', name: 'YOLO 🪂' },
                  { id: 'pair-extraordinaire', name: 'Pair Extraordinaire 👯' },
                  { id: 'galaxy-brain', name: 'Galaxy Brain 🧠' },
                  { id: 'starstruck', name: 'Starstruck ⭐' },
                ].map((b) => {
                  const isActive = simulatedBadges.includes(b.id);
                  return (
                    <button
                      key={b.id}
                      onClick={() => toggleSimulatedBadge(b.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg font-semibold transition-all border text-xs',
                        isActive
                          ? 'bg-[#d1f34d] border-[#d1f34d] text-[#0b1c30] shadow-xs'
                          : 'bg-[#161b22] border-neutral-700 text-neutral-400 hover:text-white',
                      )}
                    >
                      {isActive ? '✓ ' : '+ '}
                      {b.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Section 2: Why Most GitHub Advice Is Broken ────────────────── */}
        <section className="mb-20 md:mb-28 text-left">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-[10px] font-bold uppercase tracking-widest mb-2 border border-rose-200">
              The Reality Check
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
              Why 90% of Student GitHub Advice Is a Waste of Time
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-1">
              Every college senior tells you to make your README colorful. Here is what actually happens when engineering leads look at your profile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                ✕
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                The Shields.io Myth
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Putting 40 glowing tech stack badges on a profile takes 2 minutes using an online generator. Recruiters and engineering managers know this. It proves you know how to copy Markdown, not that you know how to write software.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                ✕
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                The Bot Green-Dot Trap
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Running a cron script to create automated commits just to turn your contribution graph green is an immediate red flag. Experienced engineers click into the commit history in 3 seconds and spot the automated commits immediately.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border-2 border-emerald-500/40 bg-emerald-50/10 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                The Official Achievement Truth
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                Official GitHub Badges cannot be faked with markdown or copy-paste templates. They require real GitHub event triggers (merged pull requests, verified co-authors, accepted community discussions). That is why they carry instant credibility.
              </p>
            </div>

          </div>
        </section>

        {/* ─── Section 3: How The GitGlow Blueprint Engine Works ───────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-12 shadow-sm mb-20 md:mb-28 text-left">
          <div className="max-w-2xl mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-2 border border-[#0058be]/15">
              The Implementation Solution
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
              How GitGlow Automates Your Badge Unlocks
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-1">
              No guesswork. No hunting for obscure open-source repos. Follow our 3-station engine blueprint.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0b1c30] text-[#d1f34d] flex items-center justify-center font-mono font-bold text-base">
                01
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                Select Target Badge
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Choose the badge you want to claim. We recommend starting with <strong className="text-[#0b1c30]">Quickdraw</strong> (2 mins), then advancing to <strong className="text-[#0b1c30]">Pull Shark 🦈</strong> and <strong className="text-[#0b1c30]">YOLO 🪂</strong>.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0058be] text-white flex items-center justify-center font-mono font-bold text-base">
                02
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                Launch Engine Recipe
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                The engine generates the exact Git commands, clean branch configuration, or contributor card JSON needed to trigger GitHub's internal achievement webhook.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#d1f34d] text-[#0b1c30] flex items-center justify-center font-mono font-bold text-base">
                03
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                Safe Sandbox Merge
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Submit your pull request to our verified <code className="font-mono text-[#0058be] bg-blue-50 px-1 py-0.5 rounded">gitglow-community</code> sandbox. Our automated bot reviews and merges it immediately, unlocking the badge on your profile.
              </p>
            </div>

          </div>
        </section>

        {/* ─── Section 4: The Complete Badge Catalog Grid ─────────────────── */}
        <section id="catalog" className="space-y-8 mb-20 md:mb-28 text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-2 border border-[#0058be]/15">
                <Layers size={11} /> Complete Directory
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
                All 10 GitHub Profile Achievements
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 mt-1 max-w-xl">
                Real badge graphics downloaded from official GitHub resources. Inspect requirements, gotchas, tier milestones, and claim blueprints.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-white border border-neutral-200 shadow-2xs gap-1 flex-wrap">
              {[
                { id: 'all', label: 'All (10)' },
                { id: 'obtainable', label: 'Obtainable (7)' },
                { id: 'starter', label: 'Starter Badges (3)' },
                { id: 'collaborative', label: 'Collaborative (2)' },
                { id: 'community', label: 'Community (2)' },
                { id: 'milestone', label: 'Milestones (2)' },
                { id: 'legacy', label: 'Historic (1)' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedCategory(filter.id)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
                    selectedCategory === filter.id
                      ? 'bg-[#0b1c30] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-[#0b1c30] hover:bg-neutral-50',
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </section>

        {/* ─── Section 5: Tier Multiplier Ladders ─────────────────────────── */}
        <section id="tiers" className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-sm mb-20 md:mb-28 text-left">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-widest mb-3">
              <Award size={11} className="text-[#0058be]" /> Multiplier Ladders
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight mb-2">
              How Badge Tiers Work
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Certain badges evolve as your contribution volume increases. GitHub decorates your badge with Bronze (x2), Silver (x3), and Gold (x4) multipliers.
            </p>
          </div>

          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl border border-neutral-200 bg-[#f8f9ff] text-center">
              <span className="px-2.5 py-1 rounded-full bg-neutral-200 text-[#0b1c30] text-[10px] font-bold uppercase tracking-wider inline-block mb-2">
                Default Base
              </span>
              <p className="text-sm font-bold text-[#0b1c30]">Base Badge</p>
              <p className="text-xs text-neutral-500 mt-1">Initial unlock threshold</p>
            </div>

            <div className="p-5 rounded-2xl border border-[#F9BFA7] bg-[#F9BFA7]/10 text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#F9BFA7] text-[#0b1c30] text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2">
                x2 Multiplier
              </span>
              <p className="text-sm font-bold text-[#0b1c30]">Bronze Tier</p>
              <p className="text-xs text-neutral-600 mt-1">Border: #F9BFA7</p>
            </div>

            <div className="p-5 rounded-2xl border border-[#E1E4E4] bg-[#E1E4E4]/30 text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#E1E4E4] text-[#0b1c30] text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2">
                x3 Multiplier
              </span>
              <p className="text-sm font-bold text-[#0b1c30]">Silver Tier</p>
              <p className="text-xs text-neutral-600 mt-1">Border: #E1E4E4</p>
            </div>

            <div className="p-5 rounded-2xl border border-[#FAE57E] bg-[#FAE57E]/20 text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#FAE57E] text-[#0b1c30] text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2">
                x4 Multiplier
              </span>
              <p className="text-sm font-bold text-[#0b1c30]">Gold Tier</p>
              <p className="text-xs text-neutral-600 mt-1">Border: #FAE57E</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4">Default</th>
                  <th className="py-3 px-4 text-[#b86241]">Bronze (x2)</th>
                  <th className="py-3 px-4 text-slate-700">Silver (x3)</th>
                  <th className="py-3 px-4 text-amber-700">Gold (x4)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700 font-medium">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#0b1c30] flex items-center gap-2">
                    <img src="/images/badges/pull-shark.png" alt="Pull Shark" className="w-6 h-6 object-contain" />
                    <span>Pull Shark 🦈</span>
                  </td>
                  <td className="py-3.5 px-4">2 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-[#b86241]">16 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">128 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">1,024 PRs</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#0b1c30] flex items-center gap-2">
                    <img src="/images/badges/pair-extraordinaire.png" alt="Pair Extraordinaire" className="w-6 h-6 object-contain" />
                    <span>Pair Extraordinaire 👯</span>
                  </td>
                  <td className="py-3.5 px-4">1 Coauthored PR</td>
                  <td className="py-3.5 px-4 font-bold text-[#b86241]">10 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">24 PRs</td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">48 PRs</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#0b1c30] flex items-center gap-2">
                    <img src="/images/badges/galaxy-brain.png" alt="Galaxy Brain" className="w-6 h-6 object-contain" />
                    <span>Galaxy Brain 🧠</span>
                  </td>
                  <td className="py-3.5 px-4">2 Answers</td>
                  <td className="py-3.5 px-4 font-bold text-[#b86241]">8 Answers</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">16 Answers</td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">32 Answers</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#0b1c30] flex items-center gap-2">
                    <img src="/images/badges/starstruck.png" alt="Starstruck" className="w-6 h-6 object-contain" />
                    <span>Starstruck ⭐</span>
                  </td>
                  <td className="py-3.5 px-4">16 Stars</td>
                  <td className="py-3.5 px-4 font-bold text-[#b86241]">128 Stars</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">512 Stars</td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">4,096 Stars</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── Section 6: Frequently Asked Questions ───────────────────────── */}
        <section id="faq" className="max-w-3xl mx-auto space-y-6 mb-20 md:mb-28 text-left">
          <div className="text-center space-y-2 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-widest">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Clear answers on how GitHub calculates, displays, and protects achievement badges.
            </p>
          </div>

          <div className="space-y-3">
            <FAQItem
              q="Is this against GitHub Terms of Service?"
              a="No. Everything GitGlow guides you to do uses official Git workflows (standard git commits, standard branch creation, and standard pull requests). You are making real, valid contributions to our dedicated open-source repository (gitglow-community). There are no bots faking tokens or hacking GitHub servers."
            />
            <FAQItem
              q="How long does it take for GitHub to show the badge on my profile?"
              a="GitHub processes badge achievements asynchronously through background queue runners. Usually, badges appear within 10 to 30 minutes after the pull request or issue is closed. If GitHub is experiencing high load, it can take up to 24 hours."
            />
            <FAQItem
              q="Can I earn achievements on private repositories?"
              a="Yes, but only if you enable private contribution visibility in your GitHub settings: go to Settings → Profile Settings → Contribution Settings and check 'Include private contributions on my profile'."
            />
            <FAQItem
              q="What if I make a mistake during the pull request?"
              a="That is exactly why gitglow-community exists. It is a zero-judgment sandbox specifically built for students to practice. If your commit message format is wrong, our bot posts a helpful review comment showing you how to fix it."
            />
            <FAQItem
              q="Can I still get the Arctic Code Vault Contributor badge?"
              a="No. The Arctic Code Vault Contributor badge was only awarded to developers whose code was archived in the Svalbard Arctic World Archive on February 2, 2020. It is a historic badge and is permanently unobtainable for new accounts."
            />
          </div>
        </section>

        {/* ─── Section 7: Final CTA Banner ─────────────────────────────────── */}
        <section className="rounded-3xl bg-[#0b1c30] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0058be]/25 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#d1f34d] text-[10px] font-extrabold uppercase tracking-widest border border-white/10">
              <Sparkles size={11} /> Start Building Real Proof
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Claim Your First <br />
              <span className="text-[#d1f34d]">GitHub Achievement?</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl mx-auto">
              Stop decorating an empty canvas with copy-paste icons. Follow our automated claiming engine to get Quickdraw and Pull Shark on your profile today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/blueprints/gitglow/engine?badge=quickdraw"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#d1f34d] text-[#0b1c30] font-extrabold text-sm uppercase tracking-wider hover:bg-[#c2e240] transition-colors shadow-lg shadow-[#d1f34d]/20"
              >
                Claim Quickdraw First (2 Mins) →
              </Link>
              
              <Link
                to="/blueprints/gitglow/engine?badge=pull-shark"
                className="w-full sm:w-auto px-6 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors"
              >
                Claim Pull Shark 🦈
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 text-[11px] text-neutral-400 font-medium border-t border-white/10 mt-6">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#d1f34d]" /> Official GitHub Events
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#d1f34d]" /> 100% Account Safe
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#d1f34d]" /> Instant Profile Verification
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
