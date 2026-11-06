import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
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
  ChevronDown,
  ChevronUp,
  Award,
  Flame,
  Check,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { GITHUB_BADGES, GitHubBadge } from '../../../data/gitglow/github-badges';

// ─── B7 Motion Curve ─────────────────────────────────────────────────────────
const BASE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── B11 Tagline Reveal Component (Mandatory) ────────────────────────────────
interface TaglineWordProps {
  word: string;
  index: number;
  totalWords: number;
}

const TaglineWord: React.FC<TaglineWordProps> = ({ word, index, totalWords }) => {
  const [isActive, setIsActive] = useState(false);
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wordRef.current;
    if (!el) return;

    // Check prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger reveal based on word position
          setTimeout(() => {
            setIsActive(true);
          }, index * 35);
          observer.disconnect();
        }
      },
      { threshold: 0.6, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <span
      ref={wordRef}
      className={cn(
        'inline-block mr-[0.3em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        isActive ? 'text-[#0b1c30] opacity-100 translate-y-0' : 'text-neutral-400 opacity-25 translate-y-1'
      )}
    >
      {word}
    </span>
  );
};

const TaglineRevealSection: React.FC = () => {
  const statement =
    'Copying markdown shields only proves you can paste text. Earning official achievement badges proves your code was merged into a real repository.';
  const words = statement.split(' ');

  return (
    <section className="py-20 sm:py-28 my-8 text-center flex flex-col items-center justify-center">
      <div className="max-w-[680px] mx-auto px-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#0058be] block mb-4">
          The Core Philosophy
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-[#0b1c30] [text-wrap:balance]">
          {words.map((word, i) => (
            <TaglineWord key={i} word={word} index={i} totalWords={words.length} />
          ))}
        </h2>
        <p className="mt-6 text-sm text-neutral-500 max-w-[540px] mx-auto [text-wrap:pretty]">
          Stop optimizing cosmetic markdown lines. Focus on verifiable Git events that recruiters respect.
        </p>
      </div>
    </section>
  );
};

// ─── FAQ Accordion Item ──────────────────────────────────────────────────────
const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden transition-all duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-center justify-between text-left text-base font-semibold text-[#0b1c30] hover:text-[#0058be] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0058be]"
        aria-expanded={open}
      >
        <span className="pr-4 [text-wrap:pretty]">{q}</span>
        <span className="p-1 rounded-full bg-neutral-100 text-[#0b1c30] shrink-0">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: BASE_EASE }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-1 text-sm text-neutral-600 leading-normal border-t border-neutral-100 [text-wrap:pretty]">
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

  const difficultyStyles = {
    'Very Easy': 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Easy': 'bg-blue-50 text-blue-800 border-blue-200',
    'Medium': 'bg-amber-50 text-amber-800 border-amber-200',
    'Hard': 'bg-purple-50 text-purple-800 border-purple-200',
    'Special': 'bg-neutral-100 text-neutral-700 border-neutral-200',
  }[badge.difficulty];

  return (
    <div
      className={cn(
        'relative p-6 rounded-3xl border bg-white transition-all duration-300 flex flex-col justify-between hover:shadow-lg',
        badge.isRecommendedStarter
          ? 'border-[#0058be]/40 shadow-sm'
          : 'border-neutral-200 hover:border-neutral-300'
      )}
    >
      <div>
        {/* Header Row: Badge Image + Difficulty Tag */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[#f8f9ff] border border-neutral-200 p-2 flex items-center justify-center">
              <img
                src={badge.image}
                alt={badge.name}
                className="w-full h-full object-contain filter drop-shadow-sm select-none"
                loading="lazy"
              />
            </div>
            {badge.isRecommendedStarter && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#d1f34d] text-[#0b1c30] text-xs font-semibold tracking-wider flex items-center gap-1 border border-neutral-200">
                <Flame size={10} fill="#0b1c30" /> Starter
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5 text-right">
            <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full border', difficultyStyles)}>
              {badge.difficulty}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md border bg-neutral-50 text-neutral-600 border-neutral-200">
              {badge.statusLabel}
            </span>
          </div>
        </div>

        {/* Title and Tagline */}
        <h3 className="text-xl font-semibold text-[#0b1c30] tracking-tight mb-1 [text-wrap:balance]">
          {badge.name}
        </h3>
        <p className="text-xs text-neutral-500 font-normal mb-4 [text-wrap:pretty]">
          {badge.tagline}
        </p>

        {/* Criteria Box */}
        <div className="p-3 rounded-2xl bg-[#f8f9ff] border border-neutral-200 space-y-1 mb-4 text-xs text-neutral-700">
          <p className="font-semibold text-[#0b1c30] flex items-center gap-1.5 uppercase text-xs tracking-wider">
            <CheckCircle2 size={13} className="text-[#0058be]" />
            <span>GitHub unlock criteria</span>
          </p>
          <p className="text-neutral-600 font-normal [text-wrap:pretty]">{badge.howToGet}</p>
        </div>

        {/* Strategy description */}
        <div className="space-y-1 mb-4 text-xs">
          <span className="font-semibold text-neutral-400 uppercase text-xs tracking-wider block">
            Blueprint claiming strategy
          </span>
          <p className="text-neutral-700 font-normal leading-normal [text-wrap:pretty]">
            {badge.blueprintStrategy}
          </p>
        </div>

        {/* Tiers List */}
        {badge.tiers && badge.tiers.length > 0 && (
          <div className="mb-4 pt-2 border-t border-neutral-100">
            <span className="font-medium text-neutral-400 text-xs tracking-wider block mb-1">
              Available multiplier tiers:
            </span>
            <div className="flex flex-wrap gap-1">
              {badge.tiers.map((tier, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium px-2 py-0.5 rounded-md bg-neutral-50 border border-neutral-200 text-[#0b1c30]"
                  title={tier.description}
                >
                  {tier.level.split(' ')[0]}: {tier.threshold.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Button Row */}
      <div className="pt-4 border-t border-neutral-100 space-y-2">
        {badge.isObtainable ? (
          <Link
            to={`/blueprints/gitglow/engine?badge=${badge.id}`}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-[#0058be] text-white font-semibold text-sm transition-colors hover:bg-[#0047a0] focus:outline-none focus:ring-2 focus:ring-[#0058be]"
          >
            <span>Launch claim engine</span>
            <ArrowRight size={14} />
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-neutral-100 text-neutral-400 font-semibold text-sm cursor-not-allowed">
            <Lock size={13} />
            <span>{badge.status === 'testing' ? 'In beta testing' : 'Archived snapshot'}</span>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-xs font-medium text-neutral-500 hover:text-[#0058be] py-1 transition-colors flex items-center justify-center gap-1"
        >
          <span>{expanded ? 'Hide technical rules' : 'View technical rules and gotchas'}</span>
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: BASE_EASE }}
              className="overflow-hidden text-left text-xs space-y-2 pt-2"
            >
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                <div>
                  <p className="font-semibold text-[#0b1c30] uppercase text-xs tracking-wider mb-1">
                    Strict requirements:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-600 [text-wrap:pretty]">
                    {badge.requirements.map((req, rIdx) => (
                      <li key={rIdx}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-amber-800 uppercase text-xs tracking-wider mb-1">
                    Known gotchas:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-600 [text-wrap:pretty]">
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
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] pt-24 pb-20 selection:bg-[#d1f34d] selection:text-[#0b1c30]">
      
      {/* ─── Upper Navigation Back Link ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <Link
          to="/blueprints"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-[#0058be] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0058be] rounded-lg p-1"
          aria-label="Back to blueprints collection"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back to blueprints</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── A2 / B5 Hero Section (Capped at 680px) ───────────────────────── */}
        <section id="overview" className="pt-6 pb-16 md:pt-10 md:pb-24 text-center flex flex-col items-center">
          
          {/* Overline Capsule */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-[#0058be] text-xs font-semibold uppercase tracking-wider mb-6 shadow-2xs">
            <Sparkles size={12} className="text-[#0058be]" />
            <span>Official GitHub achievement blueprint</span>
          </div>

          {/* Heading 1 with B5 Left-to-Right Text Gradient */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight max-w-[680px] mx-auto bg-gradient-to-r from-black to-neutral-500 bg-clip-text text-transparent [text-wrap:balance] mb-6">
            Earn verified GitHub achievements without fake profile tricks
          </h1>

          {/* Subheadline (B5 Capped at 680px) */}
          <p className="text-base sm:text-lg text-neutral-600 leading-normal max-w-[680px] mx-auto mb-8 [text-wrap:pretty]">
            Recruiters ignore copy and paste markdown shields. The only permanent proof on GitHub is official achievement badges awarded directly by GitHub event runners. GitGlow gives you the verified Git recipes and safe sandbox merges to claim your first three badges today.
          </p>

          {/* Action Row (B2: 8px vertical padding, 12px horizontal padding) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-[420px] mb-6">
            <Link
              to="/blueprints/gitglow/engine?badge=quickdraw"
              className="w-full sm:w-auto py-2 px-4 rounded-xl bg-[#d1f34d] text-[#0b1c30] font-semibold text-base transition-all hover:bg-[#c2e240] shadow-sm text-center flex items-center justify-center gap-2"
            >
              <span>Start with Quickdraw blueprint</span>
              <ArrowRight size={16} />
            </Link>

            <a
              href="#catalog"
              className="w-full sm:w-auto py-2 px-4 rounded-xl border border-neutral-300 bg-white text-[#0b1c30] hover:bg-neutral-50 font-semibold text-base transition-colors text-center"
            >
              <span>Browse all badges</span>
            </a>
          </div>

          {/* Proof Line */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>7 currently obtainable achievements</span>
            </span>
            <span className="text-neutral-300">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>100% verified by GitHub event runners</span>
            </span>
            <span className="text-neutral-300">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>Zero repository risk in safe sandbox</span>
            </span>
          </div>

          {/* ─── Hero Visual: Interactive Profile Header Showcase ─────────── */}
          <div className="mt-12 w-full max-w-4xl p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-neutral-100">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0058be]">
                  Interactive preview
                </span>
                <h3 className="text-lg font-semibold text-[#0b1c30] [text-wrap:balance]">
                  How your profile looks after claiming achievements
                </h3>
              </div>
              <p className="text-xs text-neutral-500">
                Click badge buttons below to toggle preview state:
              </p>
            </div>

            {/* Flat Dark Simulated Profile Header (B4 Flat Background) */}
            <div className="mt-6 p-6 rounded-2xl bg-[#181818] text-white border border-neutral-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-base text-white">
                    DEV
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white flex items-center gap-2">
                      <span>Alex Rivera</span>
                      <span className="text-xs font-normal text-neutral-400">@arivera-code</span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      First year developer building web systems
                    </p>
                  </div>
                </div>

                {/* Achievements Box */}
                <div className="bg-[#272727] p-3 rounded-2xl border border-neutral-700/60">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Achievements ({simulatedBadges.length})
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">Verified</span>
                  </div>

                  <div className="flex items-center gap-3 min-h-[52px]">
                    {simulatedBadges.length === 0 ? (
                      <span className="text-xs text-neutral-500">
                        No badges selected. Click below to add.
                      </span>
                    ) : (
                      simulatedBadges.map((badgeId) => {
                        const b = GITHUB_BADGES.find((x) => x.id === badgeId);
                        if (!b) return null;
                        return (
                          <div key={b.id} className="flex flex-col items-center">
                            <div className="w-11 h-11 rounded-xl bg-[#181818] p-1 flex items-center justify-center border border-neutral-700">
                              <img src={b.image} alt={b.name} className="w-9 h-9 object-contain" />
                            </div>
                            <span className="text-xs text-neutral-300 mt-1 font-medium">{b.name}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Toggler Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-neutral-400 font-medium mr-2">Toggle badges:</span>
                {[
                  { id: 'quickdraw', name: 'Quickdraw' },
                  { id: 'pull-shark', name: 'Pull Shark' },
                  { id: 'yolo', name: 'YOLO' },
                  { id: 'pair-extraordinaire', name: 'Pair Extraordinaire' },
                  { id: 'galaxy-brain', name: 'Galaxy Brain' },
                  { id: 'starstruck', name: 'Starstruck' },
                ].map((b) => {
                  const isActive = simulatedBadges.includes(b.id);
                  return (
                    <button
                      key={b.id}
                      onClick={() => toggleSimulatedBadge(b.id)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg font-medium transition-colors border text-xs',
                        isActive
                          ? 'bg-[#d1f34d] border-[#d1f34d] text-[#0b1c30]'
                          : 'bg-[#272727] border-neutral-700 text-neutral-300 hover:text-white'
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

        {/* ─── A2 Problem to Solution: The Reality Check ──────────────────── */}
        <section className="py-12 border-t border-neutral-200 text-left">
          <div className="max-w-[680px] mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 block mb-2">
              The Reality Check
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#0b1c30] tracking-tight [text-wrap:balance]">
              Why ninety percent of student GitHub advice fails
            </h2>
            <p className="text-sm text-neutral-600 mt-2 [text-wrap:pretty]">
              Tutorials tell beginners to paste colorful markdown graphics. Here is what happens when engineering leads evaluate those profiles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
                ✕
              </div>
              <h3 className="text-base font-semibold text-[#0b1c30]">The shields generator myth</h3>
              <p className="text-xs text-neutral-600 leading-normal [text-wrap:pretty]">
                Pasting forty colorful badges takes two minutes with an online tool. Reviewers recognize the template instantly. It confirms you can copy markdown, not that you can write code.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
                ✕
              </div>
              <h3 className="text-base font-semibold text-[#0b1c30]">The automated commit trap</h3>
              <p className="text-xs text-neutral-600 leading-normal [text-wrap:pretty]">
                Running cron scripts to fake daily contribution dots creates an immediate warning signal. Experienced engineers click your commit history and see the empty commits immediately.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#0058be]/40 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <h3 className="text-base font-semibold text-[#0b1c30]">The official achievement standard</h3>
              <p className="text-xs text-neutral-700 leading-normal font-medium [text-wrap:pretty]">
                Official GitHub achievements cannot be faked with markdown text. They require verified Git events like merged pull requests and coauthored commits directly indexed by GitHub.
              </p>
            </div>
          </div>
        </section>

        {/* ─── B11 Mandatory Tagline Reveal Section ────────────────────────── */}
        <TaglineRevealSection />

        {/* ─── A2 / A5 Benefits Section ───────────────────────────────────── */}
        <section className="py-12 border-t border-neutral-200 text-left">
          <div className="max-w-[680px] mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0058be] block mb-2">
              System Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#0b1c30] tracking-tight [text-wrap:balance]">
              Built for first year engineering confidence
            </h2>
            <p className="text-sm text-neutral-600 mt-2 [text-wrap:pretty]">
              Four concrete reasons to earn your badges through a structured blueprint engine rather than guessing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0058be] flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="text-base font-semibold text-[#0b1c30]">Permanent profile credibility</h3>
              <p className="text-xs text-neutral-600 leading-normal [text-wrap:pretty]">
                Badges mount permanently onto your profile header. They remain verified by GitHub regardless of future repository changes.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="text-base font-semibold text-[#0b1c30]">Safe sandbox execution</h3>
              <p className="text-xs text-neutral-600 leading-normal [text-wrap:pretty]">
                Practice branching and pull requests on a designated community repository without fear of making public mistakes on stranger projects.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="text-base font-semibold text-[#0b1c30]">Zero account risk</h3>
              <p className="text-xs text-neutral-600 leading-normal [text-wrap:pretty]">
                All actions follow standard Git protocol and documented GitHub workflows. No automated token abuse or terms of service violations.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h3 className="text-base font-semibold text-[#0b1c30]">Predictable tier progression</h3>
              <p className="text-xs text-neutral-600 leading-normal [text-wrap:pretty]">
                Follow clear numerical thresholds to unlock Bronze, Silver, and Gold multipliers as your contribution volume expands.
              </p>
            </div>
          </div>
        </section>

        {/* ─── A2 How It Works (Three Steps) ──────────────────────────────── */}
        <section className="py-12 border-t border-neutral-200 text-left">
          <div className="max-w-[680px] mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0058be] block mb-2">
              Three Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#0b1c30] tracking-tight [text-wrap:balance]">
              How the claiming blueprint works
            </h2>
            <p className="text-sm text-neutral-600 mt-2 [text-wrap:pretty]">
              A direct execution pathway that eliminates trial and error.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3">
              <span className="text-xs font-mono font-bold text-[#0058be] uppercase">Step 01</span>
              <h3 className="text-base font-semibold text-[#0b1c30]">Select target badge</h3>
              <p className="text-xs text-neutral-600 leading-normal [text-wrap:pretty]">
                Pick an obtainable achievement like Quickdraw or Pull Shark based on your immediate goal and time availability.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3">
              <span className="text-xs font-mono font-bold text-[#0058be] uppercase">Step 02</span>
              <h3 className="text-base font-semibold text-[#0b1c30]">Execute the verified recipe</h3>
              <p className="text-xs text-neutral-600 leading-normal [text-wrap:pretty]">
                The engine provides the exact Git commands, branch configuration, or contributor card schema required by GitHub.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-3">
              <span className="text-xs font-mono font-bold text-[#0058be] uppercase">Step 03</span>
              <h3 className="text-base font-semibold text-[#0b1c30]">Automated sandbox merge</h3>
              <p className="text-xs text-neutral-600 leading-normal [text-wrap:pretty]">
                Submit your pull request to the community repository where automated verification merges your work and triggers the badge.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Beginner Fast Track Spotlight ──────────────────────────────── */}
        <section id="quickstart" className="py-12 border-t border-neutral-200 text-left">
          <div className="max-w-[680px] mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block mb-2">
              Start Here
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#0b1c30] tracking-tight [text-wrap:balance]">
              The beginner fast track
            </h2>
            <p className="text-sm text-neutral-600 mt-2 [text-wrap:pretty]">
              If you have a new account or zero badges, claim these three first. They can be completed in one sitting.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Quickdraw */}
            <div className="p-6 rounded-3xl border border-emerald-300 bg-white flex flex-col justify-between space-y-4 shadow-sm">
              <div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-3">
                  Fastest unlock · Two minutes
                </span>
                <div className="w-16 h-16 mx-auto my-2 p-1.5 rounded-2xl bg-[#f8f9ff] border border-neutral-200 flex items-center justify-center">
                  <img src="/images/badges/quickdraw.png" alt="Quickdraw" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg font-semibold text-[#0b1c30] text-center mb-1">Quickdraw</h3>
                <p className="text-xs text-neutral-600 text-center [text-wrap:pretty]">
                  Close an issue or pull request within five minutes on your personal repository.
                </p>
              </div>
              <Link
                to="/blueprints/gitglow/engine?badge=quickdraw"
                className="w-full py-2 px-3 rounded-xl bg-emerald-700 text-white font-semibold text-xs text-center transition-colors hover:bg-emerald-800"
              >
                Claim Quickdraw blueprint →
              </Link>
            </div>

            {/* Pull Shark */}
            <div className="p-6 rounded-3xl border border-blue-300 bg-white flex flex-col justify-between space-y-4 shadow-sm">
              <div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 inline-block mb-3">
                  Core flagship · Ten minutes
                </span>
                <div className="w-16 h-16 mx-auto my-2 p-1.5 rounded-2xl bg-[#f8f9ff] border border-neutral-200 flex items-center justify-center">
                  <img src="/images/badges/pull-shark.png" alt="Pull Shark" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg font-semibold text-[#0b1c30] text-center mb-1">Pull Shark</h3>
                <p className="text-xs text-neutral-600 text-center [text-wrap:pretty]">
                  Merge two pull requests into a public repository using our verified sandbox.
                </p>
              </div>
              <Link
                to="/blueprints/gitglow/engine?badge=pull-shark"
                className="w-full py-2 px-3 rounded-xl bg-[#0058be] text-white font-semibold text-xs text-center transition-colors hover:bg-[#0047a0]"
              >
                Claim Pull Shark blueprint →
              </Link>
            </div>

            {/* YOLO */}
            <div className="p-6 rounded-3xl border border-amber-300 bg-white flex flex-col justify-between space-y-4 shadow-sm">
              <div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 inline-block mb-3">
                  Solo merge · Five minutes
                </span>
                <div className="w-16 h-16 mx-auto my-2 p-1.5 rounded-2xl bg-[#f8f9ff] border border-neutral-200 flex items-center justify-center">
                  <img src="/images/badges/yolo.png" alt="YOLO" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg font-semibold text-[#0b1c30] text-center mb-1">YOLO</h3>
                <p className="text-xs text-neutral-600 text-center [text-wrap:pretty]">
                  Merge a pull request directly without requesting or waiting for code review.
                </p>
              </div>
              <Link
                to="/blueprints/gitglow/engine?badge=yolo"
                className="w-full py-2 px-3 rounded-xl bg-amber-700 text-white font-semibold text-xs text-center transition-colors hover:bg-amber-800"
              >
                Claim YOLO blueprint →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Complete Badge Catalog Grid ─────────────────────────────────── */}
        <section id="catalog" className="py-12 border-t border-neutral-200 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-[680px]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0058be] block mb-2">
                Complete Directory
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#0b1c30] tracking-tight [text-wrap:balance]">
                All ten GitHub profile achievements
              </h2>
              <p className="text-sm text-neutral-600 mt-2 [text-wrap:pretty]">
                Real badge artwork and verified requirements. Filter by category to plan your next unlock.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-white border border-neutral-200 gap-1 flex-wrap">
              {[
                { id: 'all', label: 'All' },
                { id: 'obtainable', label: 'Obtainable' },
                { id: 'starter', label: 'Starter' },
                { id: 'collaborative', label: 'Collaborative' },
                { id: 'community', label: 'Community' },
                { id: 'milestone', label: 'Milestones' },
                { id: 'legacy', label: 'Historic' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedCategory(filter.id)}
                  className={cn(
                    'px-3 py-1 rounded-xl text-xs font-semibold transition-colors',
                    selectedCategory === filter.id
                      ? 'bg-[#0b1c30] text-white'
                      : 'text-neutral-600 hover:text-[#0b1c30] hover:bg-neutral-50'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </section>

        {/* ─── Tier Multiplier Ladders ─────────────────────────────────────── */}
        <section id="tiers" className="py-12 border-t border-neutral-200 text-left">
          <div className="max-w-[680px] mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0058be] block mb-2">
              Multiplier Ladders
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#0b1c30] tracking-tight [text-wrap:balance]">
              How badge multiplier tiers work
            </h2>
            <p className="text-sm text-neutral-600 mt-2 [text-wrap:pretty]">
              Certain badges evolve as contribution volume increases. GitHub decorates your badge with Bronze, Silver, and Gold borders.
            </p>
          </div>

          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl border border-neutral-200 bg-white text-center">
              <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[#0b1c30] text-xs font-semibold uppercase block mb-1">
                Base
              </span>
              <p className="text-sm font-semibold text-[#0b1c30]">Initial unlock</p>
            </div>

            <div className="p-4 rounded-2xl border border-[#F9BFA7] bg-white text-center">
              <span className="px-2 py-0.5 rounded-full bg-[#F9BFA7]/30 text-[#0b1c30] text-xs font-semibold uppercase block mb-1">
                Bronze tier
              </span>
              <p className="text-sm font-semibold text-[#0b1c30]">x2 Multiplier</p>
            </div>

            <div className="p-4 rounded-2xl border border-[#E1E4E4] bg-white text-center">
              <span className="px-2 py-0.5 rounded-full bg-[#E1E4E4] text-[#0b1c30] text-xs font-semibold uppercase block mb-1">
                Silver tier
              </span>
              <p className="text-sm font-semibold text-[#0b1c30]">x3 Multiplier</p>
            </div>

            <div className="p-4 rounded-2xl border border-[#FAE57E] bg-white text-center">
              <span className="px-2 py-0.5 rounded-full bg-[#FAE57E]/50 text-[#0b1c30] text-xs font-semibold uppercase block mb-1">
                Gold tier
              </span>
              <p className="text-sm font-semibold text-[#0b1c30]">x4 Multiplier</p>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-neutral-200 p-2">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 text-neutral-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4">Default</th>
                  <th className="py-3 px-4 text-[#b86241]">Bronze (x2)</th>
                  <th className="py-3 px-4 text-slate-700">Silver (x3)</th>
                  <th className="py-3 px-4 text-amber-700">Gold (x4)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700 font-normal">
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0b1c30] flex items-center gap-2">
                    <img src="/images/badges/pull-shark.png" alt="Pull Shark" className="w-5 h-5 object-contain" />
                    <span>Pull Shark</span>
                  </td>
                  <td className="py-3 px-4">2 PRs</td>
                  <td className="py-3 px-4 font-semibold text-[#b86241]">16 PRs</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">128 PRs</td>
                  <td className="py-3 px-4 font-semibold text-amber-700">1024 PRs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0b1c30] flex items-center gap-2">
                    <img src="/images/badges/pair-extraordinaire.png" alt="Pair Extraordinaire" className="w-5 h-5 object-contain" />
                    <span>Pair Extraordinaire</span>
                  </td>
                  <td className="py-3 px-4">1 Coauthored PR</td>
                  <td className="py-3 px-4 font-semibold text-[#b86241]">10 PRs</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">24 PRs</td>
                  <td className="py-3 px-4 font-semibold text-amber-700">48 PRs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0b1c30] flex items-center gap-2">
                    <img src="/images/badges/galaxy-brain.png" alt="Galaxy Brain" className="w-5 h-5 object-contain" />
                    <span>Galaxy Brain</span>
                  </td>
                  <td className="py-3 px-4">2 Answers</td>
                  <td className="py-3 px-4 font-semibold text-[#b86241]">8 Answers</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">16 Answers</td>
                  <td className="py-3 px-4 font-semibold text-amber-700">32 Answers</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0b1c30] flex items-center gap-2">
                    <img src="/images/badges/starstruck.png" alt="Starstruck" className="w-5 h-5 object-contain" />
                    <span>Starstruck</span>
                  </td>
                  <td className="py-3 px-4">16 Stars</td>
                  <td className="py-3 px-4 font-semibold text-[#b86241]">128 Stars</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">512 Stars</td>
                  <td className="py-3 px-4 font-semibold text-amber-700">4096 Stars</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── A2 / A4 FAQ Section (Objection Handling) ───────────────────── */}
        <section id="faq" className="py-12 border-t border-neutral-200 text-left">
          <div className="max-w-[680px] mx-auto text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2">
              Objection Handling
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#0b1c30] tracking-tight [text-wrap:balance]">
              Frequently asked questions
            </h2>
            <p className="text-sm text-neutral-600 mt-2 [text-wrap:pretty]">
              Detailed technical answers regarding achievement indexing, permissions, and security.
            </p>
          </div>

          <div className="max-w-[680px] mx-auto space-y-3">
            <FAQItem
              q="Is this against GitHub terms of service?"
              a="No. All workflows follow standard Git protocol and documented GitHub features: standard branch creation, clean commit messaging, and standard pull requests. You are submitting real contributions to a designated public repository. No automated scripts abuse API quotas or bypass GitHub access controls."
            />
            <FAQItem
              q="How long does it take for GitHub to award the badge?"
              a="GitHub processes achievements through background event queues. Most achievements appear on your profile within ten to thirty minutes after the qualifying pull request or issue is closed. During heavy GitHub platform load, indexing may take up to twenty four hours."
            />
            <FAQItem
              q="Can I earn achievements on private repositories?"
              a="Yes, provided you enable private contribution visibility in your GitHub settings: navigate to Settings, select Profile Settings, locate Contribution Settings, and check the box to include private contributions on your profile."
            />
            <FAQItem
              q="Do pull requests have to be merged?"
              a="Yes. Pull requests that are closed without being merged into the default branch do not count toward Pull Shark. However, closing an unmerged pull request within five minutes does qualify for the Quickdraw achievement."
            />
            <FAQItem
              q="What if my pull request has formatting errors?"
              a="The community sandbox repository uses automated bot feedback to review your submission. If your commit formatting needs adjustment, the bot leaves a specific inline explanation so you can update your branch safely."
            />
            <FAQItem
              q="Can I hide achievements if I choose?"
              a="Yes. GitHub provides a native toggle under Settings, Profile Settings, Achievements. You can enable or disable achievement visibility at any time."
            />
            <FAQItem
              q="Can I earn the Arctic Code Vault badge?"
              a="No. The Arctic Code Vault Contributor achievement was awarded exclusively to repositories archived in the Svalbard Arctic World Archive before February 2, 2020. It is permanently closed for newer accounts."
            />
          </div>
        </section>

        {/* ─── A2 Final CTA & Risk Reversal ────────────────────────────────── */}
        <section className="mt-12 p-8 sm:p-12 rounded-3xl bg-[#0b1c30] text-white text-center">
          <div className="max-w-[680px] mx-auto space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#d1f34d] block">
              Execution Ready
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight [text-wrap:balance]">
              Earn your first verified GitHub achievement today
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-normal max-w-[540px] mx-auto [text-wrap:pretty]">
              Stop decorating an empty canvas with copy and paste markdown icons. Use our verified recipes and safe sandbox to claim Quickdraw in two minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to="/blueprints/gitglow/engine?badge=quickdraw"
                className="w-full sm:w-auto py-2 px-4 rounded-xl bg-[#d1f34d] text-[#0b1c30] font-semibold text-base transition-colors hover:bg-[#c2e240] text-center"
              >
                Start with Quickdraw blueprint →
              </Link>

              <Link
                to="/blueprints/gitglow/engine?badge=pull-shark"
                className="w-full sm:w-auto py-2 px-4 rounded-xl border border-neutral-700 bg-white/5 hover:bg-white/10 text-white font-semibold text-base transition-colors text-center"
              >
                Claim Pull Shark
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-neutral-400 font-medium border-t border-neutral-800 mt-6">
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-[#d1f34d]" /> Free tier available
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-[#d1f34d]" /> Zero repository risk
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-[#d1f34d]" /> Legitimate GitHub events
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
