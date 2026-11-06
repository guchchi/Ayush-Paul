import React, { useState, useMemo } from 'react';
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
  Trophy,
  AlertCircle,
  HelpCircle,
  Award,
  Filter,
  Flame,
  Info,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DURATION, EASING } from '../../../lib/motion-presets';
import { GITHUB_BADGES, GitHubBadge, BadgeCategory } from '../../../data/gitglow/github-badges';

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

// ─── Badge Card Component ────────────────────────────────────────────────────
const BadgeCard: React.FC<{ badge: GitHubBadge }> = ({ badge }) => {
  const [expanded, setExpanded] = useState(false);

  const difficultyColors = {
    'Very Easy': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Easy': 'bg-blue-50 text-blue-700 border-blue-200',
    'Medium': 'bg-amber-50 text-amber-700 border-amber-200',
    'Hard': 'bg-purple-50 text-purple-700 border-purple-200',
    'Special': 'bg-slate-100 text-slate-700 border-slate-300',
  }[badge.difficulty];

  return (
    <div
      className={cn(
        'relative p-6 sm:p-7 rounded-3xl border bg-white transition-all duration-200 flex flex-col justify-between hover:shadow-lg',
        badge.isRecommendedStarter
          ? 'border-[#0058be]/30 ring-1 ring-[#0058be]/10 shadow-sm'
          : 'border-neutral-200 hover:border-neutral-300',
      )}
    >
      <div>
        {/* Top Header: Badge Image + Status Capsules */}
        <div className="flex items-start justify-between gap-4 mb-5">
          {/* Badge Image Frame */}
          <div className="relative group">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#f8f9ff] border border-neutral-200/80 p-2 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <img
                src={badge.image}
                alt={badge.name}
                className="w-full h-full object-contain filter drop-shadow-md"
                loading="lazy"
              />
            </div>
            {badge.isRecommendedStarter && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#d1f34d] text-[#0b1c30] text-[9px] font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1">
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
                  ? 'bg-emerald-50/60 text-emerald-800 border-emerald-200/60'
                  : badge.status === 'testing'
                  ? 'bg-amber-50/60 text-amber-800 border-amber-200/60'
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
        <p className="text-xs text-neutral-500 font-medium mb-3 italic">
          "{badge.tagline}"
        </p>

        {/* How To Unlock Box */}
        <div className="p-3.5 rounded-2xl bg-[#f8f9ff] border border-neutral-100 space-y-1.5 mb-4 text-xs text-neutral-700">
          <p className="font-bold text-[#0b1c30] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <CheckCircle2 size={13} className="text-[#0058be]" />
            <span>GitHub Unlock Criteria:</span>
          </p>
          <p className="leading-relaxed text-neutral-600">{badge.howToGet}</p>
        </div>

        {/* Blueprint Strategy Callout */}
        <div className="space-y-1 mb-4 text-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
            Blueprint Claim Strategy
          </span>
          <p className="text-neutral-700 font-medium leading-relaxed">
            {badge.blueprintStrategy}
          </p>
        </div>

        {/* Tiers Preview (if badge has tiers) */}
        {badge.tiers && badge.tiers.length > 0 && (
          <div className="mb-4 pt-2 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Available Tiers:
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
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#0058be] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#0047a0] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0058be]"
          >
            <span>Claim Badge Blueprint</span>
            <ArrowRight size={14} />
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-1.5 w-full py-3 px-4 rounded-xl bg-neutral-100 text-neutral-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed">
            <Lock size={13} />
            <span>{badge.status === 'testing' ? 'In Beta Testing' : 'Archived 2020'}</span>
          </div>
        )}

        {/* Expandable Gotchas / Details Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-[11px] font-semibold text-neutral-500 hover:text-[#0058be] py-1 transition-colors flex items-center justify-center gap-1"
        >
          <span>{expanded ? 'Hide Requirements & Gotchas' : 'View Requirements & Edge Cases'}</span>
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
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-2">
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

  const filteredBadges = useMemo(() => {
    if (selectedCategory === 'all') return GITHUB_BADGES;
    if (selectedCategory === 'obtainable') return GITHUB_BADGES.filter((b) => b.isObtainable);
    if (selectedCategory === 'starter') return GITHUB_BADGES.filter((b) => b.isRecommendedStarter);
    return GITHUB_BADGES.filter((b) => b.category === selectedCategory);
  }, [selectedCategory]);

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
        
        {/* ─── Hero Section: The Badge Directory Overview ──────────────────── */}
        <section id="overview" className="grid lg:grid-cols-[1fr_390px] gap-10 xl:gap-16 items-start mb-16 md:mb-24">
          
          {/* Left Column: Hero Copy + Meta Chips */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASING.PREMIUM }}
            className="space-y-6 text-left"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0058be]/8 text-[#0058be] text-[11px] font-bold uppercase tracking-widest border border-[#0058be]/15">
              <Trophy size={12} className="text-[#0058be]" aria-hidden="true" />
              <span>Blueprint 03 • GitHub Achievement Catalog</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0b1c30] leading-[1.08]">
              Official GitHub Badges <br />
              <span className="text-[#0058be]">Catalog & Claim Blueprints</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
              An exhaustive blueprint directory of official GitHub profile badges and achievements. Filter by difficulty, inspect exact unlock rules and tier thresholds, and launch the guided claiming blueprint for each badge.
            </p>

            {/* Meta Chips */}
            <div className="flex flex-wrap gap-2.5 pt-2" role="list" aria-label="Achievement metadata">
              {[
                { label: '7 Obtainable Badges' },
                { label: '3 Fast Beginner Unlocks' },
                { label: 'Tier Multipliers (x2, x3, x4)' },
                {
                  label: 'Output: Verified Profile Achievements',
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
                  <Award size={14} className={chip.accent ? 'text-[#0b1c30]' : 'text-neutral-500'} />
                  <span>{chip.label}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <a
                href="#quickstart"
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#0058be] text-white font-bold text-base transition-all shadow-[0_8px_24px_rgba(0,88,190,0.22)] hover:bg-[#0047a0] focus:outline-none focus:ring-2 focus:ring-[#0058be]"
              >
                <span>Start With Easiest Badges</span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>

              <a
                href="#catalog"
                className="flex items-center justify-center px-6 py-4 rounded-xl border border-neutral-200 bg-white text-[#0b1c30] hover:bg-neutral-50 font-bold text-base transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]"
              >
                <span>Browse All 10 Badges</span>
              </a>
            </div>

            <p className="text-xs text-neutral-500 font-medium pt-1">
              Note: Achievements appear directly on your public GitHub profile under your header and bio. They are permanently verified by GitHub's event system.
            </p>
          </motion.div>

          {/* Right Column: Quick Status & Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASING.PREMIUM }}
            className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl space-y-6 text-left"
          >
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3 flex items-center justify-between">
              <span>Achievement System Overview</span>
              <span className="text-[#0058be] font-mono text-[10px]">OFFICIAL SPEC</span>
            </h2>

            {/* Visual Mini Showcase */}
            <div className="flex items-center justify-around py-3 bg-[#f8f9ff] rounded-2xl border border-neutral-100">
              <div className="text-center">
                <img src="/images/badges/pull-shark.png" alt="Pull Shark" className="w-14 h-14 mx-auto mb-1 filter drop-shadow-sm" />
                <span className="text-[10px] font-bold text-[#0b1c30]">Pull Shark</span>
              </div>
              <div className="text-center">
                <img src="/images/badges/quickdraw.png" alt="Quickdraw" className="w-14 h-14 mx-auto mb-1 filter drop-shadow-sm" />
                <span className="text-[10px] font-bold text-[#0b1c30]">Quickdraw</span>
              </div>
              <div className="text-center">
                <img src="/images/badges/yolo.png" alt="YOLO" className="w-14 h-14 mx-auto mb-1 filter drop-shadow-sm" />
                <span className="text-[10px] font-bold text-[#0b1c30]">YOLO</span>
              </div>
            </div>

            {/* Quick Metrics Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Active Achievements</span>
                <span className="font-bold text-[#0b1c30]">7 Badges</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">In Beta Testing</span>
                <span className="font-bold text-amber-600">2 Badges</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Historic Archives</span>
                <span className="font-bold text-slate-400">1 Badge (2020)</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-neutral-500 font-medium">Indexing Latency</span>
                <span className="font-bold text-emerald-600">10–30 mins post-action</span>
              </div>
            </div>

            {/* Safe Sandbox Note */}
            <div className="p-3.5 rounded-2xl bg-blue-50/40 border border-blue-100 text-xs text-neutral-600 space-y-1">
              <span className="font-bold text-[#0058be] block">Zero-Risk Sandbox</span>
              <p>Practice PRs and co-authored commits safely against <span className="font-mono text-[#0b1c30]">gitglow-community</span> without polluting client repos.</p>
            </div>
          </motion.div>
        </section>

        {/* ─── Section 2: Beginner Quick-Start Spotlight ───────────────────── */}
        <section id="quickstart" className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-sm mb-16 md:mb-24 text-left">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-widest mb-3 border border-emerald-200">
              <Flame size={12} className="text-emerald-700" /> Start Here · 3 Fastest Unlocks
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight mb-2">
              The Beginner Trifecta
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              If you have a fresh GitHub account or zero badges, claim these 3 first. They require no special permissions and can be unlocked within an afternoon.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Quickdraw Card */}
            <div className="p-6 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/15 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Fastest Unlock · 5 Mins
                  </span>
                </div>
                <div className="w-20 h-20 mx-auto my-2 p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center justify-center">
                  <img src="/images/badges/quickdraw.png" alt="Quickdraw" className="w-full h-full object-contain filter drop-shadow-sm" />
                </div>
                <h3 className="text-lg font-bold text-[#0b1c30] text-center mb-1">Quickdraw</h3>
                <p className="text-xs text-neutral-600 text-center leading-relaxed">
                  Close an issue or pull request within 5 minutes of opening it on your own repository.
                </p>
              </div>
              <Link
                to="/blueprints/gitglow/engine?badge=quickdraw"
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider text-center hover:bg-emerald-700 transition-colors shadow-2xs"
              >
                Claim Quickdraw Blueprint →
              </Link>
            </div>

            {/* Pull Shark Card */}
            <div className="p-6 rounded-2xl border-2 border-[#0058be]/40 bg-blue-50/15 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    Flagship Badge · 10 Mins
                  </span>
                </div>
                <div className="w-20 h-20 mx-auto my-2 p-2 rounded-2xl bg-white border border-blue-100 shadow-2xs flex items-center justify-center">
                  <img src="/images/badges/pull-shark.png" alt="Pull Shark" className="w-full h-full object-contain filter drop-shadow-sm" />
                </div>
                <h3 className="text-lg font-bold text-[#0b1c30] text-center mb-1">Pull Shark 🦈</h3>
                <p className="text-xs text-neutral-600 text-center leading-relaxed">
                  Merge 2 pull requests into a public repository. Triggered instantly using our community sandbox.
                </p>
              </div>
              <Link
                to="/blueprints/gitglow/engine?badge=pull-shark"
                className="w-full py-2.5 rounded-xl bg-[#0058be] text-white font-bold text-xs uppercase tracking-wider text-center hover:bg-[#0047a0] transition-colors shadow-2xs"
              >
                Claim Pull Shark Blueprint →
              </Link>
            </div>

            {/* YOLO Card */}
            <div className="p-6 rounded-2xl border-2 border-amber-500/40 bg-amber-50/15 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    Solo Merge · 5 Mins
                  </span>
                </div>
                <div className="w-20 h-20 mx-auto my-2 p-2 rounded-2xl bg-white border border-amber-100 shadow-2xs flex items-center justify-center">
                  <img src="/images/badges/yolo.png" alt="YOLO" className="w-full h-full object-contain filter drop-shadow-sm" />
                </div>
                <h3 className="text-lg font-bold text-[#0b1c30] text-center mb-1">YOLO 🪂</h3>
                <p className="text-xs text-neutral-600 text-center leading-relaxed">
                  Merge a pull request directly without requesting or waiting for code review.
                </p>
              </div>
              <Link
                to="/blueprints/gitglow/engine?badge=yolo"
                className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs uppercase tracking-wider text-center hover:bg-amber-700 transition-colors shadow-2xs"
              >
                Claim YOLO Blueprint →
              </Link>
            </div>

          </div>
        </section>

        {/* ─── Section 3: The Complete Badge Directory ────────────────────── */}
        <section id="catalog" className="space-y-8 mb-16 md:mb-24 text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-2 border border-[#0058be]/15">
                <Layers size={11} /> Complete Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">
                All GitHub Profile Badges
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 mt-1 max-w-xl">
                Browse every official achievement. Inspect requirements, gotchas, tier milestones, and claim guides.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="inline-flex items-center p-1 rounded-xl bg-white border border-neutral-200 shadow-2xs gap-1 flex-wrap">
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
                    'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
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

        {/* ─── Section 4: Tier Multiplier Guide ───────────────────────────── */}
        <section id="tiers" className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-sm mb-16 md:mb-24 text-left">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-widest mb-3">
              <Award size={11} className="text-[#0058be]" /> Multiplier Ladders
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight mb-2">
              How Badge Tiers Work
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Certain badges evolve as you reach higher volume milestones. GitHub decorates your badge with Bronze (x2), Silver (x3), and Gold (x4) borders.
            </p>
          </div>

          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl border border-neutral-200 bg-[#f8f9ff] text-center">
              <span className="px-2.5 py-1 rounded-full bg-neutral-200 text-[#0b1c30] text-[10px] font-bold uppercase tracking-wider inline-block mb-2">
                Default Base
              </span>
              <p className="text-sm font-bold text-[#0b1c30]">Base Badge</p>
              <p className="text-xs text-neutral-500 mt-1">First unlock milestone</p>
            </div>

            <div className="p-5 rounded-2xl border border-[#F9BFA7] bg-[#F9BFA7]/10 text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#F9BFA7] text-[#0b1c30] text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2">
                x2 Multiplier
              </span>
              <p className="text-sm font-bold text-[#0b1c30]">Bronze Tier</p>
              <p className="text-xs text-neutral-600 mt-1">Hex: #F9BFA7</p>
            </div>

            <div className="p-5 rounded-2xl border border-[#E1E4E4] bg-[#E1E4E4]/30 text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#E1E4E4] text-[#0b1c30] text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2">
                x3 Multiplier
              </span>
              <p className="text-sm font-bold text-[#0b1c30]">Silver Tier</p>
              <p className="text-xs text-neutral-600 mt-1">Hex: #E1E4E4</p>
            </div>

            <div className="p-5 rounded-2xl border border-[#FAE57E] bg-[#FAE57E]/20 text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#FAE57E] text-[#0b1c30] text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2">
                x4 Multiplier
              </span>
              <p className="text-sm font-bold text-[#0b1c30]">Gold Tier</p>
              <p className="text-xs text-neutral-600 mt-1">Hex: #FAE57E</p>
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

        {/* ─── Section 5: Frequently Asked Questions ───────────────────────── */}
        <section id="faq" className="max-w-3xl mx-auto space-y-6 mb-16 md:mb-24 text-left">
          <div className="text-center space-y-2 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-widest">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Everything you need to know about GitHub achievement detection, latency, and rules.
            </p>
          </div>

          <div className="space-y-3">
            <FAQItem
              q="How long does it take for GitHub to display an unlocked badge?"
              a="GitHub processes achievements asynchronously through internal background event queues. In most cases, badges show up on your profile within 10 to 30 minutes. Occasionally, if GitHub is experiencing heavy load, it can take up to 24 hours to index."
            />
            <FAQItem
              q="Can I earn achievements on private repositories?"
              a="Yes, but with one condition: you must go to your GitHub Profile Settings → Contribution Settings and enable 'Include private contributions on my profile'. If this is disabled, actions on private repositories are ignored for achievement calculations."
            />
            <FAQItem
              q="Do pull requests need to be merged to unlock Pull Shark?"
              a="Yes. Pull requests that are simply closed without merging do NOT award the Pull Shark badge. They must be merged into the repository's default branch. However, closing an unmerged PR does count toward Quickdraw."
            />
            <FAQItem
              q="Can I hide achievements if I don't want them on my profile?"
              a="Yes. GitHub provides a native toggle under Settings → Profile Settings → Achievements → 'Show Achievements on my profile'. You can opt out or re-enable them at any time."
            />
            <FAQItem
              q="Can I still get the Arctic Code Vault badge?"
              a="No. The Arctic Code Vault Contributor badge was awarded exclusively to accounts with qualifying commits made prior to February 2, 2020. It is a historic archival badge and is permanently unobtainable for newer accounts."
            />
          </div>
        </section>

        {/* ─── Section 6: Final CTA Banner ─────────────────────────────────── */}
        <section className="rounded-3xl bg-[#0b1c30] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0058be]/25 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#d1f34d] text-[10px] font-extrabold uppercase tracking-widest border border-white/10">
              <Sparkles size={11} /> Start Building Achievements
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to Claim Your First <br />
              <span className="text-[#d1f34d]">GitHub Achievement?</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl mx-auto">
              Launch our claiming blueprint engine to follow the exact, step-by-step verified action path for Quickdraw, Pull Shark, and YOLO.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/blueprints/gitglow/engine?badge=quickdraw"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#d1f34d] text-[#0b1c30] font-extrabold text-sm uppercase tracking-wider hover:bg-[#c2e240] transition-colors shadow-lg shadow-[#d1f34d]/20"
              >
                Claim Quickdraw First (5 Mins) →
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
