import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ShieldCheck,
  CalendarCheck,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Terminal,
  BookOpen,
  FileCheck,
  HelpCircle,
  AlertTriangle,
  Cpu,
  Layers,
  Award,
} from 'lucide-react';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { BCyberParadigmShiftCard } from '../../../components/b-cyber/BCyberParadigmShiftCard';
import { BCyberEligibilityScreener } from '../../../components/b-cyber/BCyberEligibilityScreener';
import { BCyberCurriculumExplorer } from '../../../components/b-cyber/BCyberCurriculumExplorer';
import { BCyberHackathonMatrix } from '../../../components/b-cyber/BCyberHackathonMatrix';
import { BCyberProofOfWorkFilter } from '../../../components/b-cyber/BCyberProofOfWorkFilter';
import { BCyberFAQVault } from '../../../components/b-cyber/BCyberFAQVault';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';

export function BCyberHomePage() {
  const canonical = getCanonicalUrl('/blueprints/b-cyber');

  useSEO({
    title: 'B.Cyber Compass | Ground Truth & Verified Admission Intelligence for IIT Kanpur & IIT Madras',
    description:
      'The authoritative student intelligence system for the 4-year Bachelor of Cybersecurity (B.Cyber) program. Verified Senate ordinances, 2026 precedent, 2027 FAQ 23 test pivot, curriculum breakdown, and eligibility screener.',
    keywords:
      'B.Cyber, IIT Kanpur B.Cyber, IIT Madras B.Cyber, cybersecurity admission, WSAIS, FAQ 23, JEE Main discontinuation, evidence of prior work, hackathon syllabus',
    url: canonical,
  });

  return (
    <div className="w-full min-h-screen bg-[#fafbfc] text-[#0b1c30]">
      <style>{`
        .bcyber-hero-bg {
          background: linear-gradient(180deg, #1A73E8 0%, #42A5F5 50%, #90CAF9 100%);
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
        }
        .bcyber-hero-bg::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12) 0%, transparent 45%),
            radial-gradient(circle at 80% 60%, rgba(255,255,255,0.18) 0%, transparent 55%);
          pointer-events: none;
        }
        .bcyber-pathway-card {
          background-color: #ffffff;
          border: 1px solid rgba(194, 198, 214, 0.35);
          border-radius: 28px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .bcyber-pathway-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -15px rgba(11, 28, 48, 0.08);
          border-color: #0b1c30;
        }
      `}</style>

      {/* Spacing from Global Fixed Header */}
      <div className="pt-24 sm:pt-28" />

      {/* =========================================================================
          HERO SECTION: Electric Blue Curved Island (Flagship Standard)
      ========================================================================= */}
      <section className="bcyber-hero-bg border border-white/15 rounded-[32px] md:rounded-[40px] lg:rounded-[48px] overflow-hidden mx-4 md:mx-6 mb-16 shadow-2xl relative z-10">
        <div className="relative z-20 px-6 pt-20 md:pt-28 pb-10 md:pb-14 max-w-5xl mx-auto flex flex-col items-center text-center">
          
          {/* Top Status Pill Badge */}
          <div className="px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[10px] font-bold uppercase tracking-[0.2em] text-white inline-flex items-center gap-2 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d1f34d] animate-pulse" />
            <span>IIT Kanpur (WSAIS &amp; C3iHub) • IIT Madras • Senate Approved</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-white text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-[1.06] tracking-tight max-w-4xl text-center">
            Bachelor of Cybersecurity <br />
            <span className="text-white/95 font-bold block text-[clamp(1.5rem,3.4vw,2.4rem)] mt-2">
              Ground Truth &amp; Admission Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/85 text-sm md:text-base max-w-2xl leading-relaxed font-semibold mt-5 mb-8 text-center">
            India&apos;s premier practice-oriented undergraduate cybersecurity degree. Zero coaching hype, zero rumors—just verified Senate ordinances, the 2027 FAQ 23 entrance test pivot, 2+2 academic architecture, and reproducible portfolio benchmarks.
          </p>

          {/* Dual Action Pill Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#paradigm-shift"
              className="bg-[#0b1c30] text-white hover:bg-[#1a3050] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md transition-all cursor-pointer text-center"
            >
              Explore Ground Dossier
            </a>
            <Link
              to="/blueprints/b-cyber/prepare"
              className="bg-[#d1f34d] text-[#0b1c30] hover:bg-[#c0e045] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>Preparation Studio</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Centerpiece Cockpit Preview Card (4 Telemetry Metrics) */}
          <div className="w-full mt-10 rounded-2xl md:rounded-3xl border border-white/20 bg-gradient-to-br from-[#0a1e35]/95 via-[#0f2b4a]/90 to-[#1a3a5c]/95 p-6 md:p-8 backdrop-blur-md shadow-2xl text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d1f34d]">
                Verified Institutional Telemetry
              </span>
              <span className="text-[11px] text-white/60 font-medium">
                Senate Ordinances &amp; WSAIS Portal Records
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider block">
                  Degree Model
                </span>
                <p className="text-base font-extrabold text-white">4-Year B.Cyber Degree</p>
                <p className="text-xs text-white/70">Full IIT alumni status granted</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider block">
                  Curriculum Structure
                </span>
                <p className="text-base font-extrabold text-white">2 Yrs Campus + 2 Yrs Field</p>
                <p className="text-xs text-white/70">Government agency deployment</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#d1f34d] uppercase tracking-wider block">
                  2027 Strategic Shift
                </span>
                <p className="text-base font-extrabold text-[#d1f34d]">JEE Main Discontinued</p>
                <p className="text-xs text-white/80">FAQ 23: Separate test announced</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider block">
                  Practical Evaluation
                </span>
                <p className="text-base font-extrabold text-white">6-Hour Hackathon</p>
                <p className="text-xs text-white/70">New Core Lab, IIT Kanpur</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 space-y-24 mb-20">
        
        {/* Disclosure Notice */}
        <DisclaimerBanner variant="prominent" />

        {/* =========================================================================
            SECTION 1: THE STRATEGIC SHIFT (2026 Precedent vs. 2027 Reality)
        ========================================================================= */}
        <section id="paradigm-shift" className="space-y-12">
          {/* Section Header */}
          <div className="text-center flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block mb-6">
              PARADIGM SHIFT
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-[3.8rem] font-extrabold text-[#0b1c30] tracking-tighter leading-[1.08] max-w-4xl mb-6 text-center">
              The Strategic Shift: <br />
              2026 Precedent vs. 2027 Reality
            </h2>
            <p className="text-base md:text-lg text-[#424754] max-w-2xl font-medium text-center leading-relaxed">
              Why traditional JEE coaching is ineffective for B.Cyber and what the admissions committee actually evaluates.
            </p>
          </div>

          {/* 3 Pathway Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
            {/* Card 1: 2026 Model */}
            <div className="bcyber-pathway-card p-8 flex flex-col justify-between shadow-sm group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#d1f34d] text-[#0b1c30] flex items-center justify-center mb-8">
                  <Clock size={24} />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0b1c30] mb-3">2026 Inaugural Model</h3>
                <p className="text-sm text-[#424754] leading-relaxed mb-6 font-medium">
                  The initial pilot batch used JEE Main as an initial filter alongside proof-of-work before the on-campus hackathon.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-[#424754] font-medium">
                    <CheckCircle2 className="text-[#0b1c30] shrink-0" size={16} />
                    Best JEE Main score used for Stage 1
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] font-medium">
                    <CheckCircle2 className="text-[#0b1c30] shrink-0" size={16} />
                    Verified evidence portfolio audited
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] font-medium">
                    <CheckCircle2 className="text-[#0b1c30] shrink-0" size={16} />
                    6-Hour in-person lab challenge
                  </li>
                </ul>
              </div>
              <a
                href="#paradigm-details"
                className="w-full inline-flex items-center justify-center bg-[#111111] text-[#d1f34d] hover:bg-[#d1f34d] hover:text-[#111111] rounded-full px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer"
              >
                Inspect 2026 Details
              </a>
            </div>

            {/* Card 2: 2027 Pivot */}
            <div className="bcyber-pathway-card p-8 flex flex-col justify-between shadow-sm group border-[#0b1c30]/40 ring-1 ring-[#0b1c30]/10">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0b1c30] text-[#d1f34d] flex items-center justify-center mb-8">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0b1c30] mb-3">2027 Confirmed Pivot</h3>
                <p className="text-sm text-[#424754] leading-relaxed mb-6 font-medium">
                  WSAIS FAQ 23 formally confirmed that JEE Main will NOT be used for subsequent intakes.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-[#0b1c30] font-bold">
                    <CheckCircle2 className="text-[#0b1c30] shrink-0" size={16} />
                    JEE Main permanently discontinued
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] font-medium">
                    <CheckCircle2 className="text-[#0b1c30] shrink-0" size={16} />
                    Separate dedicated entrance test
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] font-medium">
                    <CheckCircle2 className="text-[#0b1c30] shrink-0" size={16} />
                    Weighted against verified proof-of-work
                  </li>
                </ul>
              </div>
              <a
                href="#paradigm-details"
                className="w-full inline-flex items-center justify-center bg-[#d1f34d] text-[#0b1c30] hover:bg-[#111111] hover:text-[#d1f34d] rounded-full px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer"
              >
                View FAQ 23 Clause
              </a>
            </div>

            {/* Card 3: The Permanent Standard */}
            <div className="bcyber-pathway-card p-8 flex flex-col justify-between shadow-sm group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#d1f34d] text-[#0b1c30] flex items-center justify-center mb-8">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0b1c30] mb-3">The Permanent Standard</h3>
                <p className="text-sm text-[#424754] leading-relaxed mb-6 font-medium">
                  The faculty admissions committee evaluates practical systems competence, genuine tools, and vulnerability research.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-[#424754] font-medium">
                    <CheckCircle2 className="text-[#0b1c30] shrink-0" size={16} />
                    Raw socket &amp; network packet parsing
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] font-medium">
                    <CheckCircle2 className="text-[#0b1c30] shrink-0" size={16} />
                    Reproducible GitHub repositories
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] font-medium">
                    <CheckCircle2 className="text-[#0b1c30] shrink-0" size={16} />
                    Zero credit for generic video courses
                  </li>
                </ul>
              </div>
              <a
                href="#proof-of-work"
                className="w-full inline-flex items-center justify-center bg-[#111111] text-[#d1f34d] hover:bg-[#d1f34d] hover:text-[#111111] rounded-full px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer"
              >
                Portfolio Guidelines
              </a>
            </div>
          </div>

          {/* Interactive Comparison Switcher */}
          <div id="paradigm-details" className="pt-4">
            <BCyberParadigmShiftCard />
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: INSTANT ELIGIBILITY SCREENER
        ========================================================================= */}
        <section id="eligibility-screener" className="space-y-12">
          {/* Section Header */}
          <div className="text-center flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block mb-6">
              ELIGIBILITY ENGINE
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-[3.8rem] font-extrabold text-[#0b1c30] tracking-tighter leading-[1.08] max-w-4xl mb-6 text-center">
              Instant Eligibility &amp; <br />
              Senate Ordinance Screener
            </h2>
            <p className="text-base md:text-lg text-[#424754] max-w-2xl font-medium text-center leading-relaxed">
              Verify your Class 12 PCM qualifications, NIOS board eligibility, age cutoff rules, and JoSAA disqualification status in seconds.
            </p>
          </div>

          {/* Screener Component */}
          <BCyberEligibilityScreener />
        </section>

        {/* =========================================================================
            SECTION 3: CURRICULUM ARCHITECTURE (The 2+2 Model)
        ========================================================================= */}
        <section id="curriculum" className="space-y-12">
          {/* Section Header */}
          <div className="text-center flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block mb-6">
              ACADEMIC ARCHITECTURE
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-[3.8rem] font-extrabold text-[#0b1c30] tracking-tighter leading-[1.08] max-w-4xl mb-6 text-center">
              The 2+2 Degree Structure &amp; <br />
              5 Dedicated Security Laboratories
            </h2>
            <p className="text-base md:text-lg text-[#424754] max-w-2xl font-medium text-center leading-relaxed">
              2 intensive years on campus covering systems programming and specialized security labs, followed by 2 full years of paid field deployment at defense and national security agencies.
            </p>
          </div>

          {/* Curriculum Component */}
          <BCyberCurriculumExplorer />
        </section>

        {/* =========================================================================
            SECTION 4: THE 6-HOUR HACKATHON & 8 EVALUATION PILLARS
        ========================================================================= */}
        <section id="hackathon-blueprint" className="space-y-12">
          {/* Section Header */}
          <div className="text-center flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block mb-6">
              PRACTICAL EVALUATION
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-[3.8rem] font-extrabold text-[#0b1c30] tracking-tighter leading-[1.08] max-w-4xl mb-6 text-center">
              The 6-Hour On-Campus Hackathon: <br />
              8 Evaluated Technical Pillars
            </h2>
            <p className="text-base md:text-lg text-[#424754] max-w-2xl font-medium text-center leading-relaxed">
              Conducted inside New Core Lab, IIT Kanpur on sanitized workstations without internet access to evaluate genuine engineering fluency.
            </p>
          </div>

          {/* Hackathon Matrix Component */}
          <BCyberHackathonMatrix />
        </section>

        {/* =========================================================================
            SECTION 5: VERIFIABLE PROOF-OF-WORK STANDARDS (FAQ 22)
        ========================================================================= */}
        <section id="proof-of-work" className="space-y-12">
          {/* Section Header */}
          <div className="text-center flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block mb-6">
              PORTFOLIO BENCHMARK
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-[3.8rem] font-extrabold text-[#0b1c30] tracking-tighter leading-[1.08] max-w-4xl mb-6 text-center">
              Faculty Portfolio Filter: <br />
              High-Signal vs. Immediate Rejections
            </h2>
            <p className="text-base md:text-lg text-[#424754] max-w-2xl font-medium text-center leading-relaxed">
              Under WSAIS FAQ 22, shortlisting evaluates technical depth, original tool design, and reproducibility. Generic course certificates are systematically filtered out.
            </p>
          </div>

          {/* Proof of Work Component */}
          <BCyberProofOfWorkFilter />
        </section>

        {/* =========================================================================
            SECTION 6: OFFICIAL VERBATIM FAQ VAULT (2-Column Sticky Layout)
        ========================================================================= */}
        <section id="faq-vault" className="py-8">
          <BCyberFAQVault />
        </section>

        {/* =========================================================================
            SECTION 7: FINAL COSMIC ACTION SECTION (Preparation Studio Bridge)
        ========================================================================= */}
        <section className="bg-[#0a2540] relative py-20 md:py-24 px-6 md:px-12 lg:px-20 overflow-hidden rounded-[32px] md:rounded-[40px] text-center text-white border border-white/10 shadow-2xl">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-30 bg-gradient-to-br from-[#0a2540]/80 via-[#1a4b8c]/50 to-[#0a2540]/90" />

          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 flex items-center gap-1.5 mb-8 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm">
              <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full animate-ping" />
              PILLAR 2 • PREPARATION STUDIO
            </span>

            <h2 className="text-3xl md:text-5xl lg:text-[3.8rem] font-extrabold text-white tracking-tighter leading-[1.08] max-w-4xl mb-6 text-center">
              Turn Your Preparation Into <br />
              Verified Technical Selection
            </h2>

            <p className="text-sm md:text-base text-white/85 max-w-xl mb-12 text-center font-semibold leading-relaxed">
              Input your academic stage (Class 12th JEE, 1st Year College, or Dropper), your technical baseline, and weekly time budget to generate your deterministic weekly cadence.
            </p>

            {/* 3 Pathway Cards in Dark Glass */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch mb-10 text-left">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[24px] p-6 flex flex-col justify-between hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                <div>
                  <h3 className="text-lg font-extrabold text-white mb-2 uppercase tracking-tight">Academic Diagnostic</h3>
                  <p className="text-xs text-white/80 leading-relaxed font-medium mb-6">
                    Personalized pacing for Class 12th JEE aspirants, 1st Year College students, or Droppers.
                  </p>
                </div>
                <div className="text-[11px] font-bold text-[#d1f34d] flex items-center gap-1">
                  <span>Custom Weekly Budget</span> &rarr;
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[24px] p-6 flex flex-col justify-between hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                <div>
                  <h3 className="text-lg font-extrabold text-white mb-2 uppercase tracking-tight">Verifiable Portfolio</h3>
                  <p className="text-xs text-white/80 leading-relaxed font-medium mb-6">
                    Assemble reproducible GitHub repositories with verifiable READMEs compliant with FAQ 22.
                  </p>
                </div>
                <div className="text-[11px] font-bold text-[#d1f34d] flex items-center gap-1">
                  <span>Evidence Checklists</span> &rarr;
                </div>
              </div>

              <div className="bg-[#0b1c30] border border-white/15 rounded-[24px] p-6 flex flex-col justify-between hover:border-[#d1f34d]/30 transition-all duration-300 hover:-translate-y-1 shadow-xl">
                <div>
                  <h3 className="text-lg font-extrabold text-[#d1f34d] mb-2 uppercase tracking-tight">Hackathon Lab Prep</h3>
                  <p className="text-xs text-white/90 leading-relaxed font-medium mb-6">
                    Practical exercises across Linux, OSINT, Binary, Networking, and Cloud Security.
                  </p>
                </div>
                <div className="text-[11px] font-bold text-white flex items-center gap-1">
                  <span>8 Tested Pillars</span> &rarr;
                </div>
              </div>
            </div>

            <Link
              to="/blueprints/b-cyber/prepare"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#d1f34d] text-[#0b1c30] text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg"
            >
              <span>Launch Preparation Studio</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* =========================================================================
            INSTITUTIONAL VERIFICATION FOOTER
        ========================================================================= */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-[#0b1c30]">
              Official Institute Portals
            </h3>
            <p className="text-xs text-[#424754]">
              Official application notifications, Senate PDFs, and circulars are published exclusively by the respective institutes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="https://iitk.ac.in/wsais/b-cyber.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-[#0b1c30] hover:bg-slate-200 transition-all shadow-xs"
            >
              <span>IIT Kanpur WSAIS Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
            <a
              href="https://www.iitm.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-[#0b1c30] hover:bg-slate-200 transition-all shadow-xs"
            >
              <span>IIT Madras Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
