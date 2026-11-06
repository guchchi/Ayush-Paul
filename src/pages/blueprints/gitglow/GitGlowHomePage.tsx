import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  GraduationCap,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { EASING, DURATION } from '../../../lib/motion-presets';

// ─── Design tokens ───────────────────────────────────────────────────────────
const NAVY   = '#0b1c30';
const COBALT = '#0058be';
const LIME   = '#d1f34d';
const GREEN  = '#22c55e';
const GREEN_DIM = '#16a34a';
const GREEN_BG  = '#f0fdf4';
const GREEN_BORDER = '#bbf7d0';

// ─── Quest data ──────────────────────────────────────────────────────────────
const FREE_QUESTS = [
  { n: '01', title: 'Profile Photo & Display Name', desc: 'Set a real, professional photo and a clean display name. First impressions take 0.1 second.' },
  { n: '02', title: 'Bio — Your 160-char Story', desc: 'Write a bio that says what you build, not just where you study.' },
  { n: '03', title: 'Create Your Special Repo', desc: 'The hidden GitHub feature: a repo with your username as its name becomes your profile README.' },
  { n: '04', title: 'Build a Killer README', desc: "Headers, sections, emojis in the right places — we'll scaffold the whole thing live." },
  { n: '05', title: 'Tech Stack Icon Grid', desc: 'Add colourful tech badge icons so anyone can read your stack in 3 seconds.' },
  { n: '06', title: 'Pin Your 6 Best Repos', desc: 'Curate what people see first. 6 pinned repos = your GitHub portfolio.' },
  { n: '07', title: 'Contact & Social Badges', desc: 'LinkedIn, Twitter/X, email — all linked with clean badge buttons.' },
  { n: '08', title: 'Proof-of-Work Matrix', desc: 'GitHub stats card, top languages card, streak card — installed and sized correctly.' },
];

const PRO_QUESTS = [
  { n: '09', title: 'GitHub Actions Auto-Update', desc: 'A free workflow that updates your stats every 24 hours without you touching anything.' },
  { n: '10', title: 'Get the Pull Shark 🦈 Badge', desc: 'We guide you through your first real PR to the gitglow-community repo — badge unlocks automatically.' },
  { n: '11', title: 'Quickdraw ⚡ Achievement', desc: 'Close your first issue in under 5 minutes. We walk you through the whole flow, live.' },
  { n: '12', title: '3 Starter Mini-Projects', desc: 'Python calculator, AI quote generator, CLI tool — real code, real commits, real green squares.' },
  { n: '13', title: 'Green-Square Jumpstart', desc: 'First genuine OSS contribution guided step-by-step. Recruiter-ready activity graph by end of day.' },
];

// ─── Score visual ─────────────────────────────────────────────────────────────
const ScoreCard = ({
  score,
  label,
  color,
  border,
}: {
  score: number;
  label: string;
  color: string;
  border: string;
}) => (
  <div
    className="flex flex-col items-center justify-center rounded-2xl p-6 border"
    style={{ backgroundColor: `${color}10`, borderColor: border }}
  >
    <div className="text-5xl font-black tracking-tighter mb-1" style={{ color }}>
      {score}
      <span className="text-2xl font-bold">/100</span>
    </div>
    <div className="text-xs font-bold uppercase tracking-widest" style={{ color: `${color}99` }}>
      {label}
    </div>
    <div className="mt-4 w-full h-2 rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

// ─── FAQ item ─────────────────────────────────────────────────────────────────
const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#c2c6d6]/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-bold text-[#0b1c30]">{q}</span>
        {open ? (
          <ChevronUp size={16} className="shrink-0 text-[#424754]" />
        ) : (
          <ChevronDown size={16} className="shrink-0 text-[#424754]" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-[#424754] leading-relaxed bg-white border-t border-[#c2c6d6]/20">
          {a}
        </div>
      )}
    </div>
  );
};

// ─── Persona card data ────────────────────────────────────────────────────────
const PERSONAS = [
  {
    IconEl: GraduationCap,
    title: '1st Year Engineering Student',
    desc: "You just got your laptop. GitHub exists but it feels empty and confusing. We start from absolutely zero.",
    tag: 'Most Common',
    tagColor: COBALT,
  },
  {
    IconEl: Code2,
    title: 'Self-Taught School Coder',
    desc: "You've been coding since class 9. You know Python and JavaScript but your GitHub doesn't show it yet.",
    tag: 'Perfect Fit',
    tagColor: GREEN_DIM,
  },
  {
    IconEl: Trophy,
    title: 'Hackathon Participant',
    desc: "You've built things at hackathons but forgot to push the code. Time to fix that and make it count.",
    tag: 'High Impact',
    tagColor: '#7c3aed',
  },
];

// ─── How-it-works steps ───────────────────────────────────────────────────────
const HOW_STEPS = [
  { n: '1', Icon: Activity, title: 'Scan', desc: 'Paste your GitHub username. We scan your profile and calculate your Health Score.' },
  { n: '2', Icon: GitPullRequest, title: 'Complete Quests', desc: 'Follow interactive steps. Build, write, configure — all guided inside the engine.' },
  { n: '3', Icon: Star, title: 'Earn Badges', desc: 'Unlock real GitHub achievements (Pull Shark, Quickdraw) as you complete quests.' },
  { n: '4', Icon: Shield, title: 'Glow Up', desc: 'Your profile score hits 90+. Share your Verified GitGlow badge on LinkedIn.' },
];

// ─── Achievement badges ───────────────────────────────────────────────────────
const ACHIEVEMENT_BADGES = [
  {
    emoji: '🦈',
    name: 'Pull Shark',
    desc: 'Earn this by getting a Pull Request merged. GitGlow guides you through your first real PR to our open-source community repo.',
    tier: 'Pro Quest 10',
    color: '#0ea5e9',
  },
  {
    emoji: '⚡',
    name: 'Quickdraw',
    desc: 'Close an issue in under 5 minutes of opening it. We show you exactly how to do it correctly, step by step.',
    tier: 'Pro Quest 11',
    color: '#f59e0b',
  },
  {
    emoji: '👯',
    name: 'Pair Extraordinaire',
    desc: 'Co-author a commit with another developer. The GitGlow community repo makes this happen automatically.',
    tier: 'Community Bonus',
    color: '#8b5cf6',
  },
];

// ─── Main page ────────────────────────────────────────────────────────────────
export const GitGlowHomePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="w-full min-h-screen bg-white text-[#0b1c30] overflow-x-hidden"
    >
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #0d2540 60%, #102e50 100%)` }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow orb */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
          style={{ background: `radial-gradient(circle, ${GREEN} 0%, transparent 70%)` }}
        />

        {/* New badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: DURATION.NORMAL }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LIME }} />
          New Blueprint — Nov 2026
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-[1.0] text-white max-w-4xl mb-6"
        >
          Glow up your{' '}
          <span style={{ color: LIME }}>GitHub</span>
          <br />
          from zero to pro.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: DURATION.NORMAL }}
          className="text-lg text-white/55 max-w-2xl leading-relaxed mb-10 font-medium"
        >
          A 13-step interactive engine that transforms your blank GitHub profile into a
          recruiter-ready portfolio — with real achievements, green squares, and official badges.
          No tab-switching. No guesswork.
        </motion.p>

        {/* Achievement badges row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: DURATION.NORMAL }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {[
            { emoji: '🦈', name: 'Pull Shark' },
            { emoji: '⚡', name: 'Quickdraw' },
            { emoji: '👯', name: 'Pair Extraordinaire' },
          ].map(b => (
            <div
              key={b.name}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-bold text-white"
            >
              <span className="text-lg">{b.emoji}</span>
              {b.name}
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: DURATION.NORMAL }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/blueprints/gitglow/engine"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm text-[#0b1c30] transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] shadow-lg"
            style={{ backgroundColor: LIME }}
          >
            <Rocket size={18} />
            Start My GitHub Glow Up
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <span className="text-xs text-white/35 font-medium">
            Free for Steps 1–8 · No login needed to explore
          </span>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/25">
            Scroll to explore
          </span>
          <div className="w-px h-8 bg-white/10" />
        </motion.div>
      </section>

      {/* ── BEFORE / AFTER SCORE ────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.NORMAL }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d1f34d]" />
            Profile Health Score
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: NAVY }}>
            Your GitHub tells a story.
            <br />
            Make it a good one.
          </h2>
          <p className="text-[#424754] text-sm leading-relaxed max-w-lg mx-auto">
            GitGlow scans your profile and gives it a score from 0 to 100. Most 1st-year students
            start at 24. We get you to 90+ in one session.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: DURATION.NORMAL, delay: 0.1 }}
          >
            <ScoreCard score={24} label="Before GitGlow" color="#ef4444" border="#fecaca" />
            <div className="mt-3 space-y-2">
              {['No profile photo', 'Empty bio', 'No README', 'Zero pinned repos'].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-[#424754]">
                  <div className="w-4 h-4 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: DURATION.NORMAL, delay: 0.2 }}
          >
            <ScoreCard score={96} label="After GitGlow" color={GREEN_DIM} border={GREEN_BORDER} />
            <div className="mt-3 space-y-2">
              {[
                'Pro headshot + bio',
                'Live README with stats',
                '6 pinned projects',
                'Real GitHub achievements',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-[#424754]">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-[#c2c6d6]/20" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: DURATION.NORMAL }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COBALT }} />
              Built For
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: NAVY }}>
              This is for you if…
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PERSONAS.map((card, i) => {
              const CardIcon = card.IconEl;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: DURATION.NORMAL, delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-6 border border-[#c2c6d6]/30 shadow-sm hover:shadow-md transition-all duration-200"
                  style={{ borderTop: `4px solid ${card.tagColor}` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${card.tagColor}15` }}
                  >
                    <CardIcon size={20} style={{ color: card.tagColor }} />
                  </div>
                  <span
                    className="inline-block text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full mb-3 border"
                    style={{
                      color: card.tagColor,
                      borderColor: `${card.tagColor}30`,
                      backgroundColor: `${card.tagColor}10`,
                    }}
                  >
                    {card.tag}
                  </span>
                  <h3 className="text-base font-extrabold tracking-tight mb-2" style={{ color: NAVY }}>
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#424754] leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── THE 13 QUESTS ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.NORMAL }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LIME }} />
            The Engine
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: NAVY }}>
            13 quests. One glowing profile.
          </h2>
          <p className="text-[#424754] text-sm leading-relaxed max-w-lg mx-auto">
            Each quest is interactive — you do the work inside the engine, not in another tab.
            Complete a quest, see your score jump live.
          </p>
        </motion.div>

        {/* Free quests */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
              Phase 1 — Free (Steps 1–8)
            </span>
            <div className="flex-1 h-px bg-[#c2c6d6]/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FREE_QUESTS.map((q, i) => (
              <motion.div
                key={q.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#c2c6d6]/30 hover:border-green-200 hover:shadow-sm transition-all duration-200"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
                  style={{
                    backgroundColor: GREEN_BG,
                    color: GREEN_DIM,
                    border: `1px solid ${GREEN_BORDER}`,
                  }}
                >
                  {q.n}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0b1c30] mb-0.5">{q.title}</p>
                  <p className="text-[11px] text-[#424754] leading-relaxed">{q.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pro quests */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#7c3aed] bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
              Phase 2 — Pro (Steps 9–13)
            </span>
            <div className="flex-1 h-px bg-[#c2c6d6]/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PRO_QUESTS.map((q, i) => (
              <motion.div
                key={q.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 bg-white rounded-xl border border-purple-100 hover:border-purple-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 bg-purple-50 border border-purple-200 text-purple-600">
                  {q.n}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0b1c30] mb-0.5">{q.title}</p>
                  <p className="text-[11px] text-[#424754] leading-relaxed">{q.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE VS PRO TABLE ───────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-[#c2c6d6]/20" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: DURATION.NORMAL }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ color: NAVY }}>
              Free vs Pro
            </h2>
            <p className="text-sm text-[#424754]">One-time payment. No subscription. No expiry.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free tier */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION.NORMAL }}
              className="bg-white rounded-2xl border border-[#c2c6d6]/30 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[#c2c6d6]/20">
                <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-green-600 mb-2">
                  Free
                </div>
                <div className="text-3xl font-black text-[#0b1c30]">₹0</div>
                <div className="text-xs text-[#424754] mt-1">Forever free. No card.</div>
              </div>
              <div className="p-6 space-y-3">
                {[
                  'Profile Health Score (0–100)',
                  'Steps 1–8 of the Quest Engine',
                  'Profile photo + bio guidance',
                  'README scaffold builder',
                  'Tech stack icon grid',
                  'Pinned repos curation',
                  'GitHub Stats card setup',
                  'Basic Verified Profile Badge',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-xs text-[#424754]">
                    <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <Link
                  to="/blueprints/gitglow/engine"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-green-200 text-green-700 hover:bg-green-50 transition-colors"
                >
                  Start Free
                </Link>
              </div>
            </motion.div>

            {/* Pro tier */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION.NORMAL }}
              className="rounded-2xl overflow-hidden shadow-lg relative"
              style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #0d2540 100%)` }}
            >
              <div className="absolute top-4 right-4">
                <span
                  className="text-[8px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: LIME, color: NAVY }}
                >
                  Best Value
                </span>
              </div>
              <div className="p-6 border-b border-white/10">
                <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50 mb-2">
                  Pro — One-time
                </div>
                <div className="text-3xl font-black text-white">₹199</div>
                <div className="text-xs text-white/40 mt-1">One payment. Lifetime access.</div>
              </div>
              <div className="p-6 space-y-3">
                {[
                  'Everything in Free',
                  'Steps 9–13 of the Quest Engine',
                  'GitHub Actions auto-update workflow',
                  'Pull Shark 🦈 badge guided walkthrough',
                  'Quickdraw ⚡ achievement walkthrough',
                  '3 starter mini-projects (Python/AI)',
                  'Green-Square Jumpstart (real OSS PR)',
                  'Recruiter-ready executive bio template',
                  'Gold "Verified Pro Pioneer" badge',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-xs text-white/70">
                    <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <Link
                  to="/blueprints/gitglow/engine"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                  style={{ backgroundColor: LIME, color: NAVY }}
                >
                  <Sparkles size={16} />
                  Unlock Pro — ₹199
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Campus Pack */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: DURATION.NORMAL, delay: 0.15 }}
            className="mt-6 p-5 bg-white rounded-2xl border border-[#c2c6d6]/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Users size={18} style={{ color: COBALT }} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0b1c30]">Campus Pack</p>
                <p className="text-xs text-[#424754]">
                  For college clubs & coding societies. 50 students + leaderboard + club badge.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-lg font-black text-[#0b1c30]">
                ₹999<span className="text-xs font-medium text-[#424754]">/year</span>
              </span>
              <a
                href="mailto:contact@ayushpaul.in?subject=GitGlow Campus Pack Inquiry"
                className="px-5 py-2 rounded-xl text-xs font-bold border-2 transition-colors"
                style={{ borderColor: COBALT, color: COBALT }}
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.NORMAL }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COBALT }} />
            How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: NAVY }}>
            Interactive, not just reading.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {HOW_STEPS.map((step, i) => {
            const StepIcon = step.Icon;
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex flex-col items-center text-center p-5 bg-white rounded-2xl border border-[#c2c6d6]/30 shadow-sm relative"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${COBALT}15` }}
                >
                  <StepIcon size={18} style={{ color: COBALT }} />
                </div>
                <div className="absolute top-3 right-3 text-[9px] font-black text-[#c2c6d6]">
                  0{step.n}
                </div>
                <p className="text-sm font-bold text-[#0b1c30] mb-1">{step.title}</p>
                <p className="text-[11px] text-[#424754] leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── GITHUB ACHIEVEMENTS ─────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-[#c2c6d6]/20" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: DURATION.NORMAL }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold tracking-tight mb-3" style={{ color: NAVY }}>
              Unlock real GitHub achievements 🏆
            </h2>
            <p className="text-sm text-[#424754] max-w-lg mx-auto">
              These aren't fake badges. They're official GitHub achievements that show on your real
              profile and are verified by GitHub itself — forever.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ACHIEVEMENT_BADGES.map((badge, i) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-[#c2c6d6]/30 shadow-sm p-6 text-center"
                style={{ borderTop: `4px solid ${badge.color}` }}
              >
                <div className="text-5xl mb-3">{badge.emoji}</div>
                <h3 className="text-base font-extrabold mb-1" style={{ color: NAVY }}>
                  {badge.name}
                </h3>
                <span
                  className="inline-block text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full mb-3 border"
                  style={{
                    color: badge.color,
                    borderColor: `${badge.color}30`,
                    backgroundColor: `${badge.color}10`,
                  }}
                >
                  {badge.tier}
                </span>
                <p className="text-xs text-[#424754] leading-relaxed">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.NORMAL }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: NAVY }}>
            Common questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {[
            {
              q: 'Do I need coding experience to use GitGlow?',
              a: 'Zero experience needed. GitGlow is designed for complete beginners — 1st-year students, school coders, or anyone who just made a GitHub account. Every step explains what it is, why it matters, and exactly what to click.',
            },
            {
              q: 'Is GitGlow really free?',
              a: 'Steps 1–8 are completely free, forever. No card required. The free tier gets you a solid, professional-looking profile with a good score. Pro (₹199 one-time) adds automation, achievement guided walkthroughs, and real OSS contribution support.',
            },
            {
              q: 'What is the gitglow-community repo?',
              a: "It's an open-source GitHub repository where GitGlow students safely make their first Pull Requests. It's specifically set up so beginners can contribute without breaking anything — a sandboxed, bot-managed environment perfect for earning the Pull Shark badge.",
            },
            {
              q: 'Will my GitHub achievements be real or just badges on this site?',
              a: 'They are 100% real GitHub achievements that appear on your actual github.com profile. The Pull Shark, Quickdraw, and Pair Extraordinaire badges are official GitHub features — GitGlow just guides you through unlocking them correctly.',
            },
            {
              q: 'What does the Campus Pack include?',
              a: 'The Campus Pack (₹999/year) is for college coding clubs and societies. It includes access for up to 50 students, a club leaderboard showing each member\'s GitHub Score growth, a club achievement badge, and a dedicated onboarding session.',
            },
          ].map(faq => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #0d2540 100%)` }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.NORMAL }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-5xl mb-6">✨</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Your GitHub is waiting.
          </h2>
          <p className="text-white/50 text-base mb-10 leading-relaxed">
            Every senior engineer you look up to had a blank GitHub once.
            The difference is they started. Start today.
          </p>
          <Link
            to="/blueprints/gitglow/engine"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm text-[#0b1c30] transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] shadow-lg"
            style={{ backgroundColor: LIME }}
          >
            <Zap size={18} />
            Start My GitHub Glow Up — Free
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-5 text-white/25 text-xs">
            Free for Steps 1–8 · No login required to explore · Pro unlocks at ₹199
          </p>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default GitGlowHomePage;
