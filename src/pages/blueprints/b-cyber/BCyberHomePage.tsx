import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ShieldCheck,
  History,
  Bell,
  FileCheck,
  CalendarCheck,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { TrustBadge } from '../../../components/b-cyber/TrustBadge';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';

export function BCyberHomePage() {
  const canonical = getCanonicalUrl('/blueprints/b-cyber');

  useSEO({
    title: 'B.Cyber Compass | Independent B.Cyber Admission Intelligence & Preparation Planner',
    description:
      'Verified institutional admission intelligence, 2026 precedent analysis, and personalised preparation planner for the 4-year B.Cyber program at IIT Kanpur and IIT Madras.',
    keywords:
      'B.Cyber, IIT Kanpur B.Cyber, IIT Madras B.Cyber, cybersecurity admission, evidence of prior work, FAQ 23, JEE Main discontinuation, preparation planner',
    url: canonical,
  });

  return (
    <div className="w-full min-h-screen bg-[#fafbfc] text-[#0f172a] pt-28 sm:pt-32 pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Sleek Linear-style Hero Card */}
        <section className="relative rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/80 text-[11px] font-mono text-slate-600 font-medium">
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              <span>Independent Student Intelligence • Updated October 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Admission Intelligence & Preparation System for <span className="underline decoration-slate-300 underline-offset-8">B.Cyber</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              The 4-year Bachelor of Cybersecurity (B.Cyber) is India&apos;s specialized undergraduate cybersecurity degree, offered independently by <strong>IIT Kanpur</strong> (via WSAIS &amp; C3iHub) and <strong>IIT Madras</strong>.
            </p>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              B.Cyber Compass cuts through coaching forums to provide verified institutional facts, grounded analysis of the inaugural 2026 selection precedent, and a deterministic preparation planner tailored to your available weekly hours.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/blueprints/b-cyber/prepare"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs sm:text-sm font-medium hover:bg-slate-800 transition-all shadow-xs group"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Launch Preparation Planner</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/blueprints/b-cyber/admission"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200/90 bg-white text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Browse Verified Policies</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-mono text-xs font-bold">
                12
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Verified Ordinances</p>
                <p className="text-[11px] text-slate-500">Senate credit exits &amp; rules</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center font-mono text-xs font-bold">
                0%
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">JEE Rote Gate</p>
                <p className="text-[11px] text-slate-500">Discontinued via FAQ 23</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center font-mono text-xs font-bold">
                4Y
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Independent Degrees</p>
                <p className="text-[11px] text-slate-500">Conferred by enrolling IIT</p>
              </div>
            </div>
          </div>
        </section>

        {/* Minimal Disclaimer Notice */}
        <DisclaimerBanner variant="prominent" />

        {/* Executive Institutional Status Strip (3 Key Pillars) */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                Institutional Facts at a Glance
              </h2>
              <p className="text-xs text-slate-500">
                Cross-referenced directly with official notices from IIT Kanpur WSAIS and IIT Madras.
              </p>
            </div>
            <TrustBadge trustLevel="official_fact" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1 */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <TrustBadge trustLevel="official_fact" size="sm" />
                </div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Independent Degree Awarding
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Degrees and alumnus status are conferred independently by the respective enrolling institute. Students graduating at IIT Kanpur receive an IIT Kanpur degree; students at IIT Madras receive an IIT Madras degree.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-100">
                Source: IIT Kanpur FAQ 16 &amp; IIT Madras Notification
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <TrustBadge trustLevel="official_fact" size="sm" />
                </div>
                <h3 className="font-semibold text-sm text-slate-900">
                  JEE Main Discontinued (FAQ 23)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  While the inaugural 2026 cycle used JEE Main scores for initial shortlisting, IIT Kanpur officially confirmed in FAQ 23 that <strong>JEE Main will NOT be used for future admissions</strong>. A separate entrance test will be announced.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-100">
                Source: IIT Kanpur FAQ 23 Official Policy
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
                    <Scale className="w-4 h-4" />
                  </div>
                  <TrustBadge trustLevel="pending_official_notice" size="sm" />
                </div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Future Entrance Test Unannounced
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The examination format, syllabus, eligibility criteria, and date for the replacement entrance test have <strong>not been published</strong>. B.Cyber Compass reports confirmed notices and avoids fabricating mock syllabi.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-100">
                Status: Awaiting official institutional publication
              </div>
            </div>
          </div>
        </section>

        {/* Guided Starting Points (3 Actionable Tracks) */}
        <section className="space-y-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
              Three Guided Focus Tracks
            </h2>
            <p className="text-xs text-slate-500">
              Targeted modules tailored to your specific objective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Track 1: Admission Policies */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all space-y-4">
              <div className="space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  Track 1 • Eligibility &amp; Rules
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Institutional Regulations
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Review 12 verified institutional claims: independent degree conferral, Senate credit exit options (Certificate at 150 cr, Diploma at 200 cr), and strict branch-change prohibitions.
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <Link
                  to="/blueprints/b-cyber/admission"
                  className="inline-flex items-center justify-between w-full text-xs font-medium text-slate-900 hover:text-slate-600 transition-colors py-1 group"
                >
                  <span>Browse Verified Admission Policies</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-slate-400" />
                </Link>
                <Link
                  to="/blueprints/b-cyber/2026-process"
                  className="inline-flex items-center justify-between w-full text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors py-1 group"
                >
                  <span>Inspect 2026 Process Precedent</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Track 2: Portfolio Standards */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all space-y-4">
              <div className="space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">
                  Track 2 • Proof-of-Work
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Evidence of Prior Work (FAQ 22)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Understand official standards for verifiable proof-of-work: responsible disclosures, original tool repos, open-source commits, and anti-patterns to avoid.
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <Link
                  to="/blueprints/b-cyber/evidence-of-work"
                  className="inline-flex items-center justify-between w-full text-xs font-medium text-slate-900 hover:text-slate-600 transition-colors py-1 group"
                >
                  <span>Review FAQ 22 Portfolio Standards</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-slate-400" />
                </Link>
                <Link
                  to="/blueprints/b-cyber/updates"
                  className="inline-flex items-center justify-between w-full text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors py-1 group"
                >
                  <span>View Official Updates Timeline</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Track 3: Preparation Planner */}
            <div className="rounded-xl border border-slate-900/20 bg-gradient-to-br from-slate-50 to-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-slate-900/40 transition-all space-y-4">
              <div className="space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Track 3 • Interactive Engine
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Personalised Preparation Planner
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Input your academic stage, technical baseline, and weekly hours (3 to 25 hrs). Generates an adjustable schedule that cleanly separates admission requirements from independent labs.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  to="/blueprints/b-cyber/prepare"
                  className="inline-flex items-center justify-center gap-2 w-full px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-xs group"
                >
                  <span>Launch Execution System</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Compact Trust Classification Key */}
        <section className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h3 className="font-semibold text-xs text-slate-900">
              Content Trust Classification Standard
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Every card carries a verifiable status tag
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start gap-2">
              <TrustBadge trustLevel="official_fact" size="sm" />
              <span className="text-slate-600 text-[11px] leading-snug">
                Supported directly by published institutional notices or official FAQs.
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start gap-2">
              <TrustBadge trustLevel="observed_precedent_2026" size="sm" />
              <span className="text-slate-600 text-[11px] leading-snug">
                Historical documentation of the inaugural 2026 cycle.
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start gap-2">
              <TrustBadge trustLevel="independent_foundational" size="sm" />
              <span className="text-slate-600 text-[11px] leading-snug">
                Third-party technical platforms recommended independently for skill mastery.
              </span>
            </div>
          </div>
        </section>

        {/* Official Grounding Portal Links */}
        <section className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="space-y-0.5">
            <h3 className="font-semibold text-xs text-slate-900">
              Always Verify on the Official Institute Portals
            </h3>
            <p className="text-[11px] text-slate-500">
              Official application links and admissions notices are published exclusively by the respective institutes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="https://iitk.ac.in/wsais/b-cyber.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/90 text-xs font-medium text-slate-800 hover:text-slate-950 hover:bg-slate-100 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span>IIT Kanpur WSAIS</span>
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
