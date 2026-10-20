import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Terminal,
  FileCheck,
  Copy,
  Check,
  BookOpen,
  Layers,
  Code2,
} from 'lucide-react';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { BCyberRoadmapStageList } from '../../../components/b-cyber/BCyberRoadmapStageList';
import { BCyberResourceDirectory } from '../../../components/b-cyber/BCyberResourceDirectory';
import { BCyberPracticeExercises } from '../../../components/b-cyber/BCyberPracticeExercises';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';
import { cn } from '../../../lib/utils';

// --- Preparation FAQs ---
const PREP_FAQS = [
  {
    q: 'How much prior programming experience is required before starting this roadmap?',
    a: 'Zero prior programming knowledge is required to begin Stage 0 and Stage 1. You start with fundamental Linux terminal commands (cd, ls, grep) and file operations. By the conclusion of Stage 2, understanding basic Python loops, socket concepts, and string manipulation is more than sufficient for the foundational security challenges.',
  },
  {
    q: 'Do I need a high-end laptop, gaming rig, or dedicated GPU?',
    a: 'No. Any standard PC or laptop with 4GB to 8GB of RAM capable of running Windows Subsystem for Linux (WSL2) or a lightweight Linux virtual machine (Ubuntu 22.04/24.04) is 100% sufficient. High-end GPUs are only relevant for deep learning model training, not for network packet analysis, web inspection, or cryptography labs.',
  },
  {
    q: 'Are free resources genuinely sufficient to prepare for B.Cyber selection?',
    a: 'Yes. Authoritative platforms like OverTheWire Bandit, PortSwigger Web Security Academy, Wireshark sample captures, and PicoCTF are globally recognized, open-access, and standard across top university security curricula. The key differentiator in B.Cyber evaluation is your verifiable evidence and conceptual clarity, not expensive coaching packages.',
  },
  {
    q: 'Can a candidate from a non-computer science Class 12 background succeed here?',
    a: 'Yes. As long as you satisfy the statutory Class 12 PCM requirement, Stage 0 (Baseline) is purpose-built to bridge the gap. It guides you through safe terminal navigation, virtualization setup, and foundational computing logic without assuming prior coding background.',
  },
  {
    q: 'How will this roadmap adapt when IIT Kanpur releases the official 2027 entrance syllabus?',
    a: 'The roadmap will dynamically update upon official Senate publication. Core foundational security competencies (Linux, networking, web flaws, crypto, disassembly) are universal and transferable across all computing entrance tests. Any test-specific formats will be directly integrated with verified citation timestamps.',
  },
];

export function BCyberPreparationPlannerPage() {
  const canonical = getCanonicalUrl('/blueprints/b-cyber/roadmap');

  const [selectedPace, setSelectedPace] = useState<'casual' | 'balanced' | 'sprint'>('balanced');
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const markdownTemplate = `# Technical Artifact: [Project / Challenge Name]

## 1. Executive Summary
- **Domain:** [Linux / Networking / Web Security / Cryptography / Reverse Engineering]
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
- How should developers patch this flaw in production?
- Verified patch snippet or defensive configuration.`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(markdownTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  // Structured Data Schema for SEO
  const roadmapSchema = {
    '@graph': [
      {
        '@type': 'Course',
        '@id': `${canonical}#course`,
        name: 'B.Cyber Technical Preparation Roadmap',
        description:
          'A free 5-stage practice-oriented preparation roadmap for IIT Kanpur B.Cyber candidates. Covers Linux CLI, networking protocols, web security labs, cryptography primitives, and verifiable GitHub portfolios.',
        provider: {
          '@type': 'Organization',
          name: 'B.Cyber Compass Independent Research',
          url: 'https://ayushpaul.com/blueprints/b-cyber',
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'Online self-paced',
          courseWorkload: 'PT80H',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: PREP_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  useSEO({
    title: 'IIT Kanpur B.Cyber Preparation Roadmap: Free 5-Stage Technical Pipeline',
    description:
      'Direct, practice-first technical preparation roadmap for IIT Kanpur B.Cyber. 5 free stages covering Linux CLI, networking protocols, web security labs, and FAQ 22 portfolio evidence.',
    keywords:
      'B.Cyber preparation roadmap, IIT Kanpur B.Cyber syllabus, cybersecurity roadmap India, WSAIS FAQ 22 proof of work, OverTheWire Bandit, PortSwigger Academy, B.Cyber hackathon prep',
    url: canonical,
    schema: roadmapSchema,
  });

  return (
    <div className="w-full min-h-screen bg-[#fafbfc] text-[#0b1c30]">
      {/* Global Spacing for Fixed Main Navigation */}
      <div className="pt-20 sm:pt-24" />

      {/* Contextual Sub-Navigation Layer */}
      <BCyberNav />

      {/* Main Content Area — Harmonized 6xl Container Matching Pillars 1 & 2 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pb-24">

        {/* =========================================================================
            SECTION 0: HERO (Direct Starting Point & Immediate Roadmap Focus)
        ========================================================================= */}
        <section
          id="prep-start"
          aria-labelledby="hero-heading"
          className="space-y-6 pt-4 text-center flex flex-col items-center"
        >
          {/* Trust Stamp Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-[11px] font-semibold text-slate-700 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pillar 3 · Technical Preparation Roadmap &amp; Self-Study Engine</span>
          </div>

          {/* H1 Heading - Crisp 2-Line Architecture */}
          <h1
            id="hero-heading"
            className="text-3xl sm:text-5xl lg:text-[50px] font-extrabold text-[#0b1c30] tracking-tight max-w-4xl leading-[1.12]"
          >
            B.Cyber Technical Preparation Roadmap:
            <span className="text-brand-primary text-xl sm:text-3xl lg:text-[32px] block mt-2 font-bold tracking-tight">
              Free 5-Stage Practical Curriculum &amp; Proof-of-Work
            </span>
          </h1>

          {/* Subtitle - Punchy & Direct */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
            A direct, practice-first technical roadmap for aspiring cybersecurity undergraduates. Master Linux CLI, networking protocols, web security labs, and verifiable GitHub portfolios without generic fluff.
          </p>

          {/* Executive Key Metrics Strip Matching Pillars 1 & 2 Aesthetic */}
          <div className="w-full max-w-4xl pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
              {/* Metric 1: 5 Stages */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 group-hover:text-slate-500 transition-colors">
                  CURRICULUM
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight group-hover:text-brand-primary transition-colors">
                  5 Practical Stages
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  Stage 0 to Stage 4
                </span>
              </div>

              {/* Metric 2: Open Access */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 group-hover:text-slate-500 transition-colors">
                  COST &amp; ACCESS
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight group-hover:text-brand-primary transition-colors">
                  100% Free Labs
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  Zero Paywalls on Skills
                </span>
              </div>

              {/* Metric 3: Practical Security Domains */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 group-hover:text-slate-500 transition-colors">
                  DOMAINS
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight group-hover:text-brand-primary transition-colors">
                  8 Security Areas
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  Aligned with IITK Lab
                </span>
              </div>

              {/* Metric 4: Proof of Work */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 group">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1 group-hover:text-slate-500 transition-colors">
                  EVIDENCE
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight group-hover:text-brand-primary transition-colors">
                  FAQ 22 Dossier
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  Verifiable Code &amp; Repos
                </span>
              </div>
            </div>

            {/* Fast-Track Actions: Direct Landing into the Roadmap */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#roadmap-stages"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0b1c30] text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs group"
              >
                <span>Jump Directly to Roadmap Stages ↓</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#d1f34d]" />
              </a>

              <a
                href="#resource-library"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-800 text-xs font-semibold border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs group"
              >
                <Terminal className="w-3.5 h-3.5 text-brand-primary" />
                <span>Curated Free Labs</span>
              </a>

              <a
                href="#proof-of-work"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-800 text-xs font-semibold border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs group"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>FAQ 22 Evidence Template</span>
              </a>

              <Link
                to="/blueprints/b-cyber/admission#admission-start"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-all shadow-2xs"
              >
                <span>Check Admission Criteria (Pillar 2) →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: THE 5-STAGE TECHNICAL ROADMAP (Directly Accessible First!)
        ========================================================================= */}
        <section id="roadmap-stages" aria-labelledby="stages-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Direct Technical Curriculum
            </span>
            <h2 id="stages-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              The 5-Stage Preparation Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Expandable curriculum with actionable task checklists, anti-trap guidance, deliverables, and estimated hours.
            </p>
          </div>

          {/* 5-Node Visual Pathway Strip for Instant Mental Mapping */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
            {[
              { num: 'Stage 0', title: 'Baseline', desc: 'WSL2 / Linux setup & CLI ethics' },
              { num: 'Stage 1', title: 'Foundations', desc: 'Bandit L0–15, TCP/IP & Wireshark' },
              { num: 'Stage 2', title: 'Security Core', desc: 'PortSwigger web flaws & crypto' },
              { num: 'Stage 3', title: 'Investigation', desc: 'OSINT, ELF reversing & PicoCTF' },
              { num: 'Stage 4', title: 'Evidence', desc: 'FAQ 22 GitHub portfolio dossier' },
            ].map((node, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1"
              >
                <span className="font-mono text-[10px] font-bold text-brand-primary uppercase tracking-wider block">
                  {node.num}
                </span>
                <span className="text-xs font-bold text-slate-900 block">{node.title}</span>
                <span className="text-[11px] text-slate-500 block leading-snug">{node.desc}</span>
              </div>
            ))}
          </div>

          {/* Interactive Expandable Stage List */}
          <BCyberRoadmapStageList />
        </section>

        {/* =========================================================================
            SECTION 2: CURATED FREE RESOURCE LIBRARY
        ========================================================================= */}
        <section id="resource-library" aria-labelledby="resources-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Zero-Cost Labs &amp; Wargames
            </span>
            <h2 id="resources-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Curated Free Resource Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Vetted third-party platforms with unambiguous access conditions. No subscription paywalls on core competencies.
            </p>
          </div>

          <BCyberResourceDirectory />
        </section>

        {/* =========================================================================
            SECTION 3: PROOF-OF-WORK & EVIDENCE DOSSIER (FAQ 22 Alignment)
        ========================================================================= */}
        <section id="proof-of-work" aria-labelledby="pow-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Verifiable Portfolio
            </span>
            <h2 id="pow-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Proof-of-Work &amp; Evidence Dossier (FAQ 22 Standard)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              How to document your technical work so evaluators can verify originality and reproducible engineering logic.
            </p>
          </div>

          {/* High-Signal vs Red Flags Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/40 space-y-3">
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
                  <span>Detailed CTF tournament writeups describing failed attempts, reasoning, and final exploit logic.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Annotated packet capture reports explaining exact TCP flags and application payloads.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Working Python/C utility tools with reproducible unit test commands.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl border border-rose-200 bg-rose-50/40 space-y-3">
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
                  <span>Exaggerated claims without reproducible code or public verification links.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyable Markdown Template Box */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-3">
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

            <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto max-h-56">
              {markdownTemplate}
            </pre>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: HANDS-ON PRACTICE EXERCISES & STARTER CHECKS
        ========================================================================= */}
        <section id="practice-tasks" aria-labelledby="practice-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Skill Self-Checks
            </span>
            <h2 id="practice-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Practice Exercises &amp; Hands-On Labs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Solve these starter tasks without looking at solutions first. Test your active problem-solving reflexes.
            </p>
          </div>

          <BCyberPracticeExercises />
        </section>

        {/* =========================================================================
            SECTION 5: WEEKLY STUDY PACE & TIME HORIZON
        ========================================================================= */}
        <section id="weekly-pace" aria-labelledby="pace-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Realistic Scheduling
            </span>
            <h2 id="pace-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Weekly Study Pace &amp; Time Horizon
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select a realistic study pace that fits around your regular school or college exams.
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
                  'p-6 rounded-3xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between',
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

          {/* Weekly Balance Triangle (40 / 40 / 20 Rule) */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              The Recommended Weekly Balance (40 / 40 / 20 Rule)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                <span className="font-bold text-indigo-900 block">40% Concept Study</span>
                <p className="text-indigo-800/80 text-[11px]">RFC protocols, OWASP guides, socket models.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-900 block">40% Hands-On Labs</span>
                <p className="text-emerald-800/80 text-[11px]">Bandit wargames, Wireshark packet dissection, Burp Suite.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
                <span className="font-bold text-amber-900 block">20% Documentation</span>
                <p className="text-amber-800/80 text-[11px]">Writing markdown writeups and committing to GitHub.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: PREPARATION FAQ CENTRE (Accessible Accordion)
        ========================================================================= */}
        <section id="prep-faqs" aria-labelledby="faqs-heading" className="scroll-mt-28 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Direct Answers
            </span>
            <h2 id="faqs-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Preparation Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear answers to the most common preparation and technical background queries.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-5 shadow-xs divide-y divide-slate-100">
            {PREP_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={cn(
                    'py-3.5 px-3 rounded-xl transition-all duration-200',
                    isOpen ? 'bg-slate-50/80 shadow-2xs' : 'hover:bg-slate-50/40'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`prep-faq-answer-${idx}`}
                    className="w-full flex items-center justify-between text-left gap-3 text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={cn(
                        'p-1 rounded-md transition-transform duration-200 shrink-0',
                        isOpen ? 'rotate-180 text-brand-primary' : 'text-slate-400'
                      )}
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>
                  {isOpen && (
                    <p
                      id={`prep-faq-answer-${idx}`}
                      className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6 border-t border-slate-200/60 pt-2"
                    >
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>Have questions about admission age cutoffs, board eligibility, or fees?</span>
            <Link
              to="/blueprints/b-cyber/admission#admission-faqs"
              className="text-brand-primary font-bold hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>View Admission FAQ Centre in Pillar 2 →</span>
            </Link>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: FINAL NEXT STEP DECISION GATEWAY (Pillar 2 / Pillar 1)
        ========================================================================= */}
        <section
          id="next-steps"
          aria-labelledby="next-step-heading"
          className="scroll-mt-28 rounded-2xl border border-slate-900 bg-slate-900 text-white p-8 sm:p-10 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d1f34d] block">
                Next Decision
              </span>
              <h2 id="next-step-heading" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Now That You Have the Roadmap, What&apos;s Next?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Verify whether your Class 12 PCM qualifications satisfy official admission criteria in Pillar 2, or revisit the complete 4-year degree overview in Pillar 1.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                to="/blueprints/b-cyber/admission#admission-start"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#d1f34d] text-slate-950 text-xs font-bold hover:bg-[#c0e045] transition-all shadow-sm group"
              >
                <span>Check Admission Criteria</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/blueprints/b-cyber#overview-start"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all text-center border border-white/15"
              >
                <span>Revisit Degree Overview</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
