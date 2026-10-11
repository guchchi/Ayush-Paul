import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ShieldCheck,
  CalendarCheck,
  ArrowRight,
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
} from 'lucide-react';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { TrustBadge } from '../../../components/b-cyber/TrustBadge';
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
    <div className="w-full min-h-screen bg-[#fafbfc] text-[#0f172a] pt-28 sm:pt-32 pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Executive Hero: Institutional Authority & System Telemetry */}
        <section className="relative rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-slate-100/80 via-transparent to-transparent pointer-events-none rounded-tr-2xl" />

          <div className="max-w-3xl space-y-5 relative z-10">
            {/* Institution Badge Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-mono font-medium shadow-xs">
                <GraduationCap className="w-3.5 h-3.5 text-slate-300" />
                <span>IIT Kanpur (WSAIS &amp; C3iHub) &bull; IIT Madras</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/80 text-[11px] font-mono text-emerald-800 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Senate Approved &bull; Updated Oct 2026</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              The Authoritative Ground Reality of{' '}
              <span className="underline decoration-slate-300 underline-offset-8">
                B.Cyber
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              India&apos;s premier practice-oriented undergraduate cybersecurity degree, initiated by{' '}
              <strong>IIT Kanpur</strong> and joined by <strong>IIT Madras</strong>. Zero coaching hype, zero unverified rumors—just pure institutional facts, Senate credit ordinances, and reproducible portfolio criteria.
            </p>

            {/* Quick Action Portals */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#paradigm-shift"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs sm:text-sm font-medium hover:bg-slate-800 transition-all shadow-xs group cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Explore Ground Dossier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <Link
                to="/blueprints/b-cyber/prepare"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200/90 bg-white text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <CalendarCheck className="w-4 h-4 text-slate-500" />
                <span>Preparation Studio (Roadmap Engine)</span>
              </Link>
            </div>
          </div>

          {/* Telemetry Bar (4 Verified Institutional Metrics) */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            <div className="space-y-1">
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Degree Model</p>
              <p className="text-sm font-bold text-slate-900">4-Year B.Cyber Degree</p>
              <p className="text-[11px] text-slate-500">Full IIT alumni status granted</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Structure</p>
              <p className="text-sm font-bold text-slate-900">2 Yrs Campus + 2 Yrs Field</p>
              <p className="text-[11px] text-slate-500">Government agency deployment</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-mono text-amber-700 uppercase tracking-wider font-semibold">2027 Mandate</p>
              <p className="text-sm font-bold text-amber-900">JEE Main Discontinued</p>
              <p className="text-[11px] text-amber-800/80">FAQ 23: Separate test announced</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Practical Filter</p>
              <p className="text-sm font-bold text-slate-900">6-Hour Hackathon</p>
              <p className="text-[11px] text-slate-500">New Core Lab, IIT Kanpur</p>
            </div>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <DisclaimerBanner variant="prominent" />

        {/* Section 1: The 2026 vs 2027 Paradigm Shift (FAQ 23) */}
        <section id="paradigm-shift" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                1. The Admission Horizon &amp; Entrance Test Evolution
              </h2>
              <p className="text-xs text-slate-500">
                Understand the confirmed policy shift for future admission cycles.
              </p>
            </div>
            <TrustBadge trustLevel="official_fact" size="sm" />
          </div>

          <BCyberParadigmShiftCard />
        </section>

        {/* Section 2: Interactive 30-Second Eligibility Screener */}
        <section id="eligibility-screener" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                2. Instant Eligibility &amp; Senate Ordinance Screener
              </h2>
              <p className="text-xs text-slate-500">
                Validate your academic background, birth year cutoff, and JoSAA concurrent admission status in seconds.
              </p>
            </div>
            <TrustBadge trustLevel="official_fact" size="sm" />
          </div>

          <BCyberEligibilityScreener />
        </section>

        {/* Section 3: The 2+2 Curriculum & Senate Credit Explorer */}
        <section id="curriculum" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                3. The 2+2 Curriculum &amp; Senate Credit Architecture
              </h2>
              <p className="text-xs text-slate-500">
                Explore exact courses, 5 specialized security labs, and the 2-year government field deployment model.
              </p>
            </div>
            <TrustBadge trustLevel="official_fact" size="sm" />
          </div>

          <BCyberCurriculumExplorer />
        </section>

        {/* Section 4: The 6-Hour Hackathon & 8 Evaluation Pillars */}
        <section id="hackathon-blueprint" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                4. The 6-Hour In-Person Hackathon (New Core Lab Blueprint)
              </h2>
              <p className="text-xs text-slate-500">
                The technical domains evaluated during the practical test at IIT Kanpur.
              </p>
            </div>
            <TrustBadge trustLevel="observed_precedent_2026" size="sm" />
          </div>

          <BCyberHackathonMatrix />
        </section>

        {/* Section 5: FAQ 22 Proof-of-Work Standards (Pass vs Rejection Matrix) */}
        <section id="proof-of-work" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                5. FAQ 22 Proof-of-Work Standards: What Shortlists vs. Rejections
              </h2>
              <p className="text-xs text-slate-500">
                The admissions committee&apos;s filter: verifiable evidence vs commercial certificate anti-patterns.
              </p>
            </div>
            <TrustBadge trustLevel="official_fact" size="sm" />
          </div>

          <BCyberProofOfWorkFilter />
        </section>

        {/* Section 6: Official Verbatim FAQ Directory (1 to 26) */}
        <section id="faq-vault" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                6. Complete Official FAQ Directory (All 26 FAQs Indexed)
              </h2>
              <p className="text-xs text-slate-500">
                Direct word-for-word answers published on the official IIT Kanpur WSAIS portal.
              </p>
            </div>
            <TrustBadge trustLevel="official_fact" size="sm" />
          </div>

          <BCyberFAQVault />
        </section>

        {/* Section 7: Pillar 2 Bridge - Personalised Preparation Studio */}
        <section className="rounded-2xl border border-slate-900 bg-slate-900 text-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-[11px] font-medium border border-white/20">
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pillar 2 &bull; Interactive Studio Engine</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Ready to Prepare? Step into the Personalised Preparation Studio
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Once you understand the ground truth, input your academic stage (Class 12th JEE, 1st Year College, or Dropper), technical baseline, and weekly time budget to generate a deterministic weekly cadence and verified proof-of-work checklist.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/blueprints/b-cyber/prepare"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-slate-900 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors shadow-xs group"
            >
              <span>Launch Preparation Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <span className="text-xs font-mono text-slate-400">
              Interactive Roadmap &bull; In-Browser State &bull; Zero Fluff
            </span>
          </div>
        </section>

        {/* Institutional Verification Footer */}
        <section className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="space-y-0.5">
            <h3 className="font-semibold text-xs text-slate-900">
              Official Institute Portals
            </h3>
            <p className="text-[11px] text-slate-500">
              Official application links, PDFs, and circulars are published exclusively by the respective institutes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="https://iitk.ac.in/wsais/b-cyber.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/90 text-xs font-medium text-slate-800 hover:text-slate-950 hover:bg-slate-100 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span>IIT Kanpur WSAIS Portal</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href="https://www.iitm.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/90 text-xs font-medium text-slate-800 hover:text-slate-950 hover:bg-slate-100 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span>IIT Madras Portal</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
