import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ShieldCheck,
  MapPin,
  CalendarCheck,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  HeartPulse,
  FolderGit2,
  FileCheck,
  Copy,
  Check,
  HelpCircle,
  BookOpen,
  Terminal,
  Network,
  Shield,
  Search,
  Code2,
  Sliders,
  Layers,
  Zap,
} from 'lucide-react';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { TrustBadge } from '../../../components/b-cyber/TrustBadge';
import { BCyberReadinessDiagnostic } from '../../../components/b-cyber/BCyberReadinessDiagnostic';
import { BCyberRoadmapStageList } from '../../../components/b-cyber/BCyberRoadmapStageList';
import { BCyberResourceDirectory } from '../../../components/b-cyber/BCyberResourceDirectory';
import { BCyberPracticeExercises } from '../../../components/b-cyber/BCyberPracticeExercises';
import { BCyberPersonalPlanPreview } from '../../../components/b-cyber/BCyberPersonalPlanPreview';
import { useBCyberPlannerStore } from '../../../lib/b-cyber-compass/store';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';
import { cn } from '../../../lib/utils';

interface NavSection {
  id: string;
  label: string;
  secNum: string;
}

const SECTIONS: NavSection[] = [
  { id: 'prep-start', label: 'Start Preparation', secNum: '00' },
  { id: 'roadmap-certainty', label: 'Known vs Unknown', secNum: '01' },
  { id: 'roadmap-summary', label: '60-Sec Summary', secNum: '02' },
  { id: 'readiness-check', label: 'Readiness Diagnostic', secNum: '03' },
  { id: 'roadmap-stages', label: '5-Stage Syllabus', secNum: '04' },
  { id: 'resource-library', label: 'Curated Resources', secNum: '05' },
  { id: 'weekly-pace', label: 'Weekly Pace Plan', secNum: '06' },
  { id: 'proof-of-work', label: 'Proof-of-Work Dossier', secNum: '07' },
  { id: 'practice-tasks', label: 'Practice Exercises', secNum: '08' },
  { id: 'personal-plan', label: 'Paid Execution System', secNum: '09' },
  { id: 'recovery-plan', label: 'Recovery & Missed Weeks', secNum: '10' },
  { id: 'prep-faqs', label: 'Preparation FAQs', secNum: '11' },
  { id: 'prep-sources', label: 'Sources & Methodology', secNum: '12' },
  { id: 'prep-next', label: 'Next Steps Gateway', secNum: '13' },
];

export function BCyberPreparationPlannerPage() {
  const { isEmergencyRecoveryMode, toggleRecoveryMode } = useBCyberPlannerStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPace, setSelectedPace] = useState<'casual' | 'balanced' | 'sprint'>('balanced');
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useSEO({
    title: 'B.Cyber Preparation Roadmap: Free 5-Stage Pipeline & Execution System | Ayush-Paul Blueprints',
    description:
      'Structured technical preparation roadmap for IIT Kanpur B.Cyber. 5 free foundational stages, Linux/Networking labs, PortSwigger exercises, and personalized execution engine.',
    url: getCanonicalUrl('/blueprints/b-cyber/roadmap'),
  });

  const markdownTemplate = `# Technical Artifact: [Project / Challenge Name]

## 1. Executive Summary
- **Domain:** [Linux / Networking / Web / Cryptography / Reverse Engineering]
- **Time Invested:** [e.g. 12 Hours]
- **Core Security Concept:** [e.g. Broken Object Level Authorization / TCP Stream Framing]

## 2. Technical Environment & Prerequisites
- OS: Ubuntu 24.04 LTS (WSL2)
- Tools Used: [e.g. Wireshark v4.2, Python 3.12, Burp Suite Community]

## 3. Reproduction & Execution Steps
\`\`\`bash
# 1. Clone repository
git clone https://github.com/username/project-name.git
cd project-name

# 2. Run test verification
python3 verify_exploit.py --target localhost:8080
\`\`\`

## 4. Key Findings & Vulnerability Analysis
- What was the core vulnerability or technical challenge?
- How was the solution derived logically without guessing?

## 5. Security Remediation & Defense Recommendations
- How should the developer patch this flaw in production?
- Verified patch snippet or defensive configuration.`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(markdownTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="w-full min-h-screen bg-[#fafbfc] text-[#0f172a]">
      {/* Global Top Spacing for Fixed Main Navigation */}
      <div className="pt-20 sm:pt-24" />

      {/* Shared Contextual Navigation Header */}
      <BCyberNav />

      {/* On-This-Page Navigation Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        {/* Desktop Anchor Strip */}
        <div className="hidden lg:flex items-center gap-2 overflow-x-auto custom-scrollbar p-2 rounded-xl bg-white border border-slate-200/90 shadow-xs text-xs whitespace-nowrap">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] pl-2 mr-1">
            Sections:
          </span>
          {SECTIONS.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <span className="font-mono text-slate-400 text-[10px] mr-1">{sec.secNum}</span>
              <span>{sec.label}</span>
            </a>
          ))}
        </div>

        {/* Mobile Collapsible Section Drawer */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 flex items-center justify-between shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-brand-primary" />
              <span>Jump to Section (14 Sections Available)</span>
            </span>
            {isMobileMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isMobileMenuOpen && (
            <div className="mt-2 p-3 rounded-xl bg-white border border-slate-200 shadow-md grid grid-cols-2 gap-1.5 text-xs">
              {SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <span className="font-mono text-[10px] text-brand-primary font-bold">{sec.secNum}</span>
                  <span className="truncate">{sec.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area: 14 Locked Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pb-24">
        
        {/* =========================================================================
            SECTION 00: HERO (Start Your Preparation)
        ========================================================================= */}
        <section id="prep-start" aria-labelledby="prep-hero-heading" className="scroll-mt-28 space-y-6 pt-2">
          {/* Trust Stamp Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-[11px] font-semibold text-slate-700 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pillar 3 · Preparation Roadmap &amp; Execution System</span>
          </div>

          {/* H1 Heading */}
          <div className="space-y-3 max-w-4xl">
            <h1 id="prep-hero-heading" className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              B.Cyber Preparation Roadmap: <br />
              <span className="text-brand-primary text-2xl sm:text-4xl block mt-2 font-bold">
                Free Universal Pipeline &amp; Personalized Execution Engine
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-3xl">
              A cycle-aware, practice-oriented technical syllabus for aspiring cybersecurity undergraduates. Master Linux CLI, networking protocols, web security labs, and verifiable GitHub portfolios without generic fluff.
            </p>
          </div>

          {/* Admission-Cycle Status Panel */}
          <div className="rounded-2xl border border-indigo-200/90 bg-indigo-50/40 p-5 sm:p-6 text-xs text-indigo-950 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-3">
              <span className="font-bold text-indigo-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admission Cycle Status &amp; Epistemic Grounding</span>
              </span>
              <span className="text-[10px] font-semibold bg-white border border-indigo-200 text-indigo-800 px-2 py-0.5 rounded">
                Verified 12 Oct 2026
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <strong className="text-indigo-950 font-bold block">Officially Confirmed Announcement:</strong>
                <p className="text-indigo-900/80 leading-relaxed">
                  IIT Kanpur&apos;s official WSAIS B.Cyber page states that future admissions will feature a <strong>separate entrance test</strong> and that <strong>JEE Main will not be used</strong>.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-indigo-950 font-bold block">Status for Upcoming Cycle:</strong>
                <p className="text-indigo-900/80 leading-relaxed">
                  Detailed examination format, syllabus topics, and marking weights are <strong>not yet confirmed by the Senate</strong>. Our roadmap teaches fundamental transferable security competencies, not an assumed future paper pattern.
                </p>
              </div>
            </div>
          </div>

          {/* Fast-Track CTA Chips */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#readiness-check"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary/90 transition-all shadow-xs cursor-pointer"
            >
              <span>Check My Starting Point ↓</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="#roadmap-summary"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
            >
              <span>Explore Free 5-Stage Roadmap ↓</span>
            </a>

            <Link
              to="/blueprints/b-cyber/admission#selection-process"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-all ml-auto"
            >
              <span>Review Admission Process in Pillar 2 →</span>
            </Link>
          </div>
        </section>

        {/* =========================================================================
            SECTION 01: WHAT WE KNOW VS WHAT IS STILL UNKNOWN
        ========================================================================= */}
        <section id="roadmap-certainty" aria-labelledby="certainty-heading" className="scroll-mt-28 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Section 01 · Institutional Epistemic Board
            </span>
            <h2 id="certainty-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What We Know vs. What Is Still Unknown
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Transparent separation between official circulars, past observations, and independent preparation advice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Box 1: Confirmed */}
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Officially Confirmed</span>
              </span>
              <h3 className="font-bold text-sm text-emerald-950">Separate Entrance Test</h3>
              <p className="text-emerald-900/80 leading-relaxed text-[11px]">
                WSAIS announcements confirm future admissions will conduct an independent entrance test. JEE Main percentile ranking will no longer be used as the shortlist filter.
              </p>
            </div>

            {/* Box 2: Past Observation */}
            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Previous Cycle Precedent</span>
              </span>
              <h3 className="font-bold text-sm text-amber-950">6-Hour On-Campus Hackathon</h3>
              <p className="text-amber-900/80 leading-relaxed text-[11px]">
                In 2026, shortlisted applicants took a 6-hour practical test at IIT Kanpur across 8 domains and submitted documented prior work under FAQ 22.
              </p>
            </div>

            {/* Box 3: Pending */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-2 py-0.5 rounded inline-flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-slate-500" />
                <span>Not Yet Confirmed</span>
              </span>
              <h3 className="font-bold text-sm text-slate-900">Upcoming Test Syllabus &amp; Dates</h3>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                The exact syllabus, question pattern (CBT or written), dates, and weightages for the upcoming separate entrance test are strictly pending formal Senate notification.
              </p>
            </div>
          </div>

          {/* Cross-Link Banner to Pillar 2 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <span className="text-slate-600">
              Need to check whether your age, PCM marks, or 12th board satisfy statutory eligibility?
            </span>
            <Link
              to="/blueprints/b-cyber/admission#eligibility-check"
              className="text-brand-primary font-bold hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Run Interactive Screener in Pillar 2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* =========================================================================
            SECTION 02: ROADMAP IN 60 SECONDS
        ========================================================================= */}
        <section id="roadmap-summary" aria-labelledby="summary-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Section 02 · 60-Second Overview
            </span>
            <h2 id="summary-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Roadmap in 60 Seconds: Visual 5-Stage Path
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              A progressive skill tree designed to take you from complete beginner to building demonstrable cybersecurity proof-of-work.
            </p>
          </div>

          {/* 5-Node Visual Stepper */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            {[
              {
                num: 'Stage 0',
                title: 'Baseline',
                desc: 'WSL2 / VM setup, terminal literacy & legal ethics',
                deliverable: 'Working local Linux terminal',
              },
              {
                num: 'Stage 1',
                title: 'Foundations',
                desc: 'Linux files/permissions, TCP/IP & Wireshark PCAPs',
                deliverable: 'Bandit L0–15 + PCAP capture',
              },
              {
                num: 'Stage 2',
                title: 'Security Core',
                desc: 'OWASP web flaws, Burp Suite & crypto primitives',
                deliverable: 'PortSwigger Apprentice labs',
              },
              {
                num: 'Stage 3',
                title: 'Investigation',
                desc: 'Recon OSINT, ELF/PE disassembly & PicoCTF gym',
                deliverable: '2 technical CTF writeups',
              },
              {
                num: 'Stage 4',
                title: 'Evidence',
                desc: 'Multi-topic challenges & public GitHub portfolio',
                deliverable: 'Documented evidence dossier',
              },
            ].map((node, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-2 relative shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] font-bold text-brand-primary uppercase tracking-wider block">
                    {node.num}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{node.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">{node.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-600 font-semibold">
                  <span className="text-slate-400 font-normal">Build: </span>
                  {node.deliverable}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 03: FREE READINESS DIAGNOSTIC
        ========================================================================= */}
        <section id="readiness-check" aria-labelledby="readiness-heading" className="scroll-mt-28 space-y-4">
          <BCyberReadinessDiagnostic />
        </section>

        {/* =========================================================================
            SECTION 04: THE LEARNING ROADMAP — STAGE DETAILS
        ========================================================================= */}
        <section id="roadmap-stages" aria-labelledby="stages-heading" className="scroll-mt-28 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Section 04 · Complete Syllabus
            </span>
            <h2 id="stages-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              The Learning Roadmap: 5 Comprehensive Stages
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Expandable curriculum with actionable checkpoints, anti-trap guidance, and tangible deliverables.
            </p>
          </div>

          <BCyberRoadmapStageList />
        </section>

        {/* =========================================================================
            SECTION 05: CURATED RESOURCE LIBRARY
        ========================================================================= */}
        <section id="resource-library" aria-labelledby="resources-heading" className="scroll-mt-28 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Section 05 · Tool &amp; Academy Directory
            </span>
            <h2 id="resources-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Curated Resource Library
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Vetted third-party platforms with unambiguous access conditions. Zero paywalls on foundational skills.
            </p>
          </div>

          <BCyberResourceDirectory />
        </section>

        {/* =========================================================================
            SECTION 06: WEEKLY PACE & SAMPLE PLAN
        ========================================================================= */}
        <section id="weekly-pace" aria-labelledby="pace-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Section 06 · Study Planning
            </span>
            <h2 id="pace-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Weekly Pace &amp; Sample Schedules
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Choose a realistic study pace that fits around your regular school or college exams.
            </p>
          </div>

          {/* Interactive Pace Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'casual',
                hours: '2 Hours / Week',
                label: 'Casual Explorer',
                desc: 'Ideal during high-pressure school semesters or JEE prep. Steady weekend laboratory sessions.',
                timeline: '~22 Weeks for Stages 0–2',
              },
              {
                id: 'balanced',
                hours: '4–6 Hours / Week',
                label: 'Focused Candidate (Recommended)',
                desc: 'Balanced study: 2 hours concept review + 3 hours wargame labs. High retention pace.',
                timeline: '~14 Weeks for Stages 0–3',
              },
              {
                id: 'sprint',
                hours: '8–12 Hours / Week',
                label: 'Intensive Sprint',
                desc: 'Dedicated preparation sprint during semester breaks or gap year. Deep daily hands-on practice.',
                timeline: '~8 Weeks for Stages 0–4',
              },
            ].map((pace) => (
              <div
                key={pace.id}
                onClick={() => setSelectedPace(pace.id as any)}
                className={cn(
                  'p-5 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between',
                  selectedPace === pace.id
                    ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary/30 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-slate-300'
                )}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-primary">{pace.hours}</span>
                    {selectedPace === pace.id && (
                      <span className="w-2 h-2 rounded-full bg-brand-primary" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{pace.label}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{pace.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                  Estimated Horizon: <strong className="text-slate-800">{pace.timeline}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Balance Triangle */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              The Recommended Weekly Balance (40 / 40 / 20 Rule)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 space-y-1">
                <span className="font-bold text-indigo-900 block">40% Concept Study</span>
                <p className="text-indigo-800/80 text-[11px]">RFC protocols, OWASP guides, socket models.</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-900 block">40% Hands-On Labs</span>
                <p className="text-emerald-800/80 text-[11px]">Bandit wargames, Wireshark packet dissection, Burp Suite.</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100 space-y-1">
                <span className="font-bold text-amber-900 block">20% Documentation</span>
                <p className="text-amber-800/80 text-[11px]">Writing markdown writeups and committing to GitHub.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 07: PROOF-OF-WORK & EVIDENCE DOSSIER
        ========================================================================= */}
        <section id="proof-of-work" aria-labelledby="pow-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Section 07 · Portfolio Preparation
            </span>
            <h2 id="pow-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Proof-of-Work &amp; Evidence Dossier (FAQ 22 Alignment)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              How to document your technical work so evaluators can verify originality and reproducible reasoning.
            </p>
          </div>

          {/* High-Signal vs Red Flags Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-emerald-950">High-Signal Evidence Formats</h3>
              </div>
              <ul className="space-y-2 text-[11px] text-emerald-900/90">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Documented GitHub repositories with clear setup instructions and commands.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Detailed CTF tournament writeups describing failed attempts, thought processes, and the final exploit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Annotated packet capture reports explaining exact TCP flags and application payloads.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Working Python/C utility tools with unit tests.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-sm text-rose-950">Anti-Patterns &amp; Low-Signal Red Flags</h3>
              </div>
              <ul className="space-y-2 text-[11px] text-rose-900/90">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>Generic completion certificates from video courses (Coursera/Udemy/YouTube playlists).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>Forked or cloned repositories with only cosmetic changes in README text.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>Automated vulnerability scanner export dumps passed off as personal findings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>Exaggerated claims without reproducible code or verification links.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyable Markdown Template Box */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Standard Project Writeup Template</h3>
                <p className="text-xs text-slate-500">Copy this markdown structure into your personal repository README.</p>
              </div>
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTemplate ? 'Copied to Clipboard!' : 'Copy Template'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto max-h-56">
              {markdownTemplate}
            </pre>
          </div>
        </section>

        {/* =========================================================================
            SECTION 08: PRACTICE EXERCISES & SELF-CHECKS
        ========================================================================= */}
        <section id="practice-tasks" aria-labelledby="practice-heading" className="scroll-mt-28 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Section 08 · Hands-On Verification
            </span>
            <h2 id="practice-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Practice Exercises &amp; Self-Checks
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Solve these starter tasks without looking at solutions first. Test your active problem-solving reflexes.
            </p>
          </div>

          <BCyberPracticeExercises />
        </section>

        {/* =========================================================================
            SECTION 09: PERSONALIZED EXECUTION SYSTEM — PAID PREVIEW
        ========================================================================= */}
        <section id="personal-plan" aria-labelledby="paid-heading" className="scroll-mt-28 space-y-4">
          <BCyberPersonalPlanPreview />
        </section>

        {/* =========================================================================
            SECTION 10: PROGRESS, MISSED WEEKS & RECOVERY
        ========================================================================= */}
        <section id="recovery-plan" aria-labelledby="recovery-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Section 10 · Anti-Burnout Protocol
            </span>
            <h2 id="recovery-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Progress, Missed Weeks &amp; Recovery
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              How to handle school board exams, college tests, or illness without abandoning your preparation.
            </p>
          </div>

          {/* Recovery Protocol Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* The 60-Minute Emergency Routine */}
            <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                  <span>The 60-Minute Emergency Routine</span>
                </span>
                <button
                  type="button"
                  onClick={toggleRecoveryMode}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer',
                    isEmergencyRecoveryMode
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white border-rose-300 text-rose-800 hover:bg-rose-100/60'
                  )}
                >
                  {isEmergencyRecoveryMode ? 'Freeze Mode Active' : 'Toggle 60m Freeze Mode'}
                </button>
              </div>

              <h3 className="font-bold text-sm text-rose-950">When Academic Exams Strike</h3>
              <p className="text-rose-900/80 leading-relaxed text-[11px]">
                Do not attempt to complete full wargame levels during unit tests or board exam sprints. Spend exactly 60 minutes each weekend:
              </p>
              <ul className="space-y-1.5 text-[11px] text-rose-900/90 list-disc list-inside">
                <li>Read 1 technical writeup or RFC section.</li>
                <li>Make 1 small commit to your notes repository to preserve the habit.</li>
                <li>Keep mental models warm without feeling guilty.</li>
              </ul>
            </div>

            {/* Resumption Protocol */}
            <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                <span>The Resumption Protocol</span>
              </span>
              <h3 className="font-bold text-sm text-indigo-950">Never Restart from Scratch</h3>
              <p className="text-indigo-900/80 leading-relaxed text-[11px]">
                The biggest psychological failure mode is feeling &ldquo;I missed 3 weeks so I have to start again from Day 1.&rdquo;
              </p>
              <ul className="space-y-1.5 text-[11px] text-indigo-900/90 list-disc list-inside">
                <li>Review the last completed checkpoint in your Stage checklist.</li>
                <li>Spend 20 minutes re-running the last completed command.</li>
                <li>Advance immediately to the next task in the queue.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 11: PREPARATION FAQ CENTRE
        ========================================================================= */}
        <section id="prep-faqs" aria-labelledby="faqs-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Section 11 · Direct Answers
            </span>
            <h2 id="faqs-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Preparation FAQ Centre
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear answers to the most common preparation and technical background queries.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Kitni programming aani chahiye preparation shuru karne se pehle?',
                a: 'Stage 0 aur Stage 1 start karne ke liye zero programming knowledge required hai. Basic terminal commands (cd, ls, grep) se shuru karo. Stage 2 ke end tak Python ke basic loops aur string manipulation kaafi hain.',
              },
              {
                q: 'Kya expensive laptop ya high-end GPU zaroori hai?',
                a: 'Nahi. Any standard 4GB–8GB RAM laptop capable of running Windows WSL2 or a lightweight Linux virtual machine is 100% sufficient. High-end GPUs are only needed for heavy AI training, not for foundational network/web security labs.',
              },
              {
                q: 'Kya free resources B.Cyber preparation ke liye enough hain?',
                a: 'Haan. OverTheWire Bandit, PortSwigger Academy, Wireshark sample captures, Beej\'s Guide aur PicoCTF duniya ke sabse premium aur authoritative free resources hain. Paid tier sirf personalized schedule aur adaptive task sequence provide karta hai.',
              },
              {
                q: 'Kya zero computer background se shuru karna possible hai?',
                a: 'Haan. Stage 0 (Baseline) isi purpose ke liye banaya gaya hai. Yeh aapko step-by-step Linux setup aur safe CLI navigation sikhata hai bina configuration traps mein phansaye.',
              },
              {
                q: 'Jab IIT Kanpur future entrance test ka detailed format release karega, toh roadmap kaise update hoga?',
                a: 'Hamara roadmap dynamically update hoga. Official notice aane par stage mapping aur practice tasks realign kiye jayenge bina kisi extra fee ke. Updates publically verified dates ke saath display honge.',
              },
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                  >
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{faq.q}</span>
                    <div className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>Admission age cutoffs, board eligibility, ya fees se related sawal hain?</span>
            <Link
              to="/blueprints/b-cyber/admission#admission-faqs"
              className="text-brand-primary font-bold hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>View Admission FAQ Centre in Pillar 2 →</span>
            </Link>
          </div>
        </section>

        {/* =========================================================================
            SECTION 12: SOURCES, METHODOLOGY & UPDATE HISTORY
        ========================================================================= */}
        <section id="prep-sources" aria-labelledby="sources-heading" className="scroll-mt-28 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Section 12 · Transparency Record
            </span>
            <h2 id="sources-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sources, Methodology &amp; Update History
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Full transparency regarding our reference documentation, curriculum benchmarks, and update logs.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="font-bold text-slate-900 block">Primary Official Sources:</span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li>• IIT Kanpur WSAIS B.Cyber Portal (<a href="https://iitk.ac.in/wsais/b-cyber.php" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline">iitk.ac.in/wsais/b-cyber.php</a>)</li>
                  <li>• IIT Kanpur Senate Ordinances &amp; 2026 Admission FAQ Records (FAQs 1–25)</li>
                  <li>• C3iHub National Cybersecurity Hub Documentation</li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 block">Curriculum Benchmarking:</span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li>• NIST NICE Cybersecurity Workforce Framework (NICE SP 800-181)</li>
                  <li>• Open-source education benchmarks (OverTheWire, PortSwigger Academy, CMU PicoCTF)</li>
                  <li>• Standard Indian IT Act (2000) ethical compliance guidelines</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-slate-400">
              <span>Last substantive audit: 12 October 2026 · Independent Guide</span>
              <a
                href="mailto:corrections@ayushpaul.com?subject=B.Cyber%20Roadmap%20Correction"
                className="text-slate-600 hover:text-brand-primary font-semibold underline"
              >
                Submit an editorial correction or update
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 13: CONTEXTUAL NEXT-STEP GATEWAY
        ========================================================================= */}
        <section id="prep-next" aria-labelledby="next-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Section 13 · Decision Gateway
            </span>
            <h2 id="next-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Where Would You Like to Go Next?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Choose the logical next step based on where you are in your B.Cyber evaluation journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Action 1 */}
            <a
              href="#readiness-check"
              className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all shadow-xs space-y-2 flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block">
                  Action 01
                </span>
                <h3 className="font-bold text-sm text-slate-900">Take Readiness Diagnostic</h3>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Answer 6 questions to find your exact starting stage and priority knowledge gaps.
                </p>
              </div>
              <span className="text-brand-primary font-bold inline-flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition-transform">
                <span>Start Diagnostic ↓</span>
              </span>
            </a>

            {/* Action 2 */}
            <Link
              to="/blueprints/b-cyber/admission"
              className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all shadow-xs space-y-2 flex flex-col justify-between group"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Action 02
                </span>
                <h3 className="font-bold text-sm text-slate-900">Check Admission Criteria</h3>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Interactive screener for board marks, age cutoffs, and 2026 vs 2027 selection shifts.
                </p>
              </div>
              <span className="text-brand-primary font-bold inline-flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition-transform">
                <span>Explore Pillar 2 →</span>
              </span>
            </Link>

            {/* Action 3 */}
            <a
              href="#personal-plan"
              className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-xs space-y-2 flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                  Action 03
                </span>
                <h3 className="font-bold text-sm text-indigo-950">Unlock Personal Workspace</h3>
                <p className="text-[11px] text-indigo-900/80 leading-snug">
                  Get a personalized weekly task queue, gap remediation, and dynamic rescheduling for ₹249.
                </p>
              </div>
              <span className="text-indigo-700 font-bold inline-flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition-transform">
                <span>View Paid Engine ↓</span>
              </span>
            </a>

            {/* Action 4 */}
            <Link
              to="/blueprints/b-cyber"
              className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all shadow-xs space-y-2 flex flex-col justify-between group"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Action 04
                </span>
                <h3 className="font-bold text-sm text-slate-900">Revisit Program Overview</h3>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Review the 4-year degree architecture, 2+2 model, semester curriculum, and myths.
                </p>
              </div>
              <span className="text-slate-700 font-bold inline-flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition-transform">
                <span>Go to Pillar 1 →</span>
              </span>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
