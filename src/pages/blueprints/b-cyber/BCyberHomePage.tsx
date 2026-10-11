import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Compass,
  ShieldCheck,
  History,
  Bell,
  FileCheck,
  CalendarCheck,
  ArrowRight,
  ExternalLink,
  BookOpen,
  AlertTriangle,
  GraduationCap,
  Scale,
  Sparkles,
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
    <div className="w-full min-h-screen bg-bg-primary text-text-primary pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Prominent Disclaimer */}
        <DisclaimerBanner variant="prominent" />

        {/* Hero Section */}
        <section className="relative rounded-2xl border border-border-color bg-white p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Trust-First Architecture • Updated for October 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text-primary leading-tight">
              Independent Admission Intelligence & Preparation Planner for <span className="text-brand-primary">B.Cyber</span>
            </h1>

            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              The 4-year Bachelor of Science in Cybersecurity (B.Cyber) is India's premier specialized undergraduate cybersecurity degree, offered independently by <strong>IIT Kanpur</strong> and <strong>IIT Madras</strong>.
            </p>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              B.Cyber Compass provides prospective students with verified institutional policies, grounded analysis of the inaugural 2026 selection precedent, and a personalised preparation planner that fits your available weekly hours.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/blueprints/b-cyber/prepare"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-secondary transition-colors shadow-2xs"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Launch Preparation Planner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/blueprints/b-cyber/admission"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border-color bg-bg-secondary/60 text-text-primary text-sm font-semibold hover:bg-bg-secondary transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-brand-primary" />
                <span>Browse Verified Policies</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Core Confirmed Institutional Facts */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                Core Institutional Facts at a Glance
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary">
                Verified against official published notices from IIT Kanpur WSAIS and IIT Madras.
              </p>
            </div>
            <TrustBadge trustLevel="official_fact" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl border border-border-color bg-white p-5 shadow-2xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-text-primary">Degree & Alumnus Status</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Degrees are awarded by the respective enrolling institute. Students graduating at IIT Kanpur receive an IIT Kanpur degree and alumnus status. Students at IIT Madras receive their degree and alumnus status from IIT Madras.
              </p>
              <div className="pt-2">
                <TrustBadge trustLevel="official_fact" size="sm" />
              </div>
            </div>

            <div className="rounded-xl border border-border-color bg-white p-5 shadow-2xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-text-primary">JEE Main Discontinued (FAQ 23)</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                JEE Main was used for inaugural 2026 screening, but IIT Kanpur officially confirmed in FAQ 23 that <strong>JEE Main will not be used for future admissions</strong>. A separate entrance test will be announced.
              </p>
              <div className="pt-2">
                <TrustBadge trustLevel="official_fact" size="sm" />
              </div>
            </div>

            <div className="rounded-xl border border-border-color bg-white p-5 shadow-2xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-text-primary">Future Test Unannounced</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                The format, syllabus, examination date, and eligibility criteria for the replacement entrance test have <strong>not been published</strong> by IIT Kanpur. B.Cyber Compass does not invent mock syllabi.
              </p>
              <div className="pt-2">
                <TrustBadge trustLevel="pending_official_notice" size="sm" />
              </div>
            </div>
          </div>
        </section>

        {/* 2-Dimensional Trust Architecture */}
        <section className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
              The 2-Dimensional Content & Trust Taxonomy
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              To protect students from misinformation, every single card, resource, and task on B.Cyber Compass is classified across two distinct axes:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 rounded-xl border border-border-color/80 bg-bg-secondary/40 p-4">
              <div className="font-semibold text-xs text-brand-primary uppercase tracking-wider">
                Axis 1: Content Domain
              </div>
              <div className="space-y-2 text-xs">
                <div className="bg-white p-3 rounded-lg border border-border-color">
                  <div className="font-semibold text-text-primary">Domain A: Admission Policy</div>
                  <p className="text-text-secondary mt-0.5">
                    Covers institutional eligibility, degree progression, Senate rules, and official screening criteria.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-border-color">
                  <div className="font-semibold text-text-primary">Domain B: Educational Guidance</div>
                  <p className="text-text-secondary mt-0.5">
                    Covers independent technical skill development, open wargames, and portfolio heuristics. Never described as an official syllabus.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border-color/80 bg-bg-secondary/40 p-4">
              <div className="font-semibold text-xs text-brand-primary uppercase tracking-wider">
                Axis 2: Trust & Evidence Status
              </div>
              <div className="space-y-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-border-color flex items-center justify-between gap-2">
                  <span className="text-text-secondary font-medium">Official Institutional Notice</span>
                  <TrustBadge trustLevel="official_fact" size="sm" />
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-border-color flex items-center justify-between gap-2">
                  <span className="text-text-secondary font-medium">Historical Inaugural 2026 Cycle</span>
                  <TrustBadge trustLevel="observed_precedent_2026" size="sm" />
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-border-color flex items-center justify-between gap-2">
                  <span className="text-text-secondary font-medium">Awaiting Official Notification</span>
                  <TrustBadge trustLevel="pending_official_notice" size="sm" />
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-border-color flex items-center justify-between gap-2">
                  <span className="text-text-secondary font-medium">Independent Curated Lab</span>
                  <TrustBadge trustLevel="independent_foundational" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Navigation Grid */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Explore the Compass Modules
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              Direct access to all verified guides, chronological updates, and interactive planning tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link
              to="/blueprints/b-cyber/admission"
              className="rounded-xl border border-border-color bg-white p-5 shadow-2xs hover:border-brand-primary/40 hover:shadow-xs transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-text-primary group-hover:text-brand-primary transition-colors">
                  Admission Intelligence
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Degree-awarding structure, Senate academic regulations, credit exit points, and branch-change prohibitions.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-brand-primary">
                <span>View 12 Verified Policies</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/blueprints/b-cyber/2026-process"
              className="rounded-xl border border-border-color bg-white p-5 shadow-2xs hover:border-brand-primary/40 hover:shadow-xs transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <History className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-text-primary group-hover:text-brand-primary transition-colors">
                  2026 Process Precedent
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Historical breakdown of the inaugural 2026 selection process, JEE screening, and the 6-hour on-campus hackathon.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-brand-primary">
                <span>Inspect 2026 Timeline</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/blueprints/b-cyber/updates"
              className="rounded-xl border border-border-color bg-white p-5 shadow-2xs hover:border-brand-primary/40 hover:shadow-xs transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-text-primary group-hover:text-brand-primary transition-colors">
                  Official Updates Timeline
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Chronological record of official portal announcements, FAQ releases, and institutional policy shifts.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-brand-primary">
                <span>View Timeline Updates</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/blueprints/b-cyber/evidence-of-work"
              className="rounded-xl border border-border-color bg-white p-5 shadow-2xs hover:border-brand-primary/40 hover:shadow-xs transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-text-primary group-hover:text-brand-primary transition-colors">
                  Evidence of Prior Work
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  FAQ 22 alignment guide for reporting vulnerabilities, developing original security tools, and avoiding anti-patterns.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-brand-primary">
                <span>Review FAQ 22 Standards</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/blueprints/b-cyber/prepare"
              className="rounded-xl border border-brand-primary/40 bg-gradient-to-br from-brand-primary/5 to-white p-5 shadow-2xs hover:border-brand-primary hover:shadow-xs transition-all group flex flex-col justify-between sm:col-span-2 lg:col-span-2"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-text-primary group-hover:text-brand-primary transition-colors">
                  Personalised Preparation Planner (Layer 2)
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Input your current academic stage, technical baseline, and available weekly study hours (3 to 25 hours). Generates a practical, adjustable schedule with strict separation of admission requirements, independent foundations, and evidence tasks.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-brand-primary">
                <span>Build Your Personalised Plan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* Official Grounding Portal Links */}
        <section className="rounded-xl border border-border-color bg-bg-secondary/40 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-text-primary">Always Verify on the Official Portals</h3>
            <p className="text-xs text-text-secondary">
              Official application links, senate notifications, and contact emails are managed directly by IIT Kanpur and IIT Madras.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://iitk.ac.in/wsais/b-cyber.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-border-color text-xs font-semibold text-brand-primary hover:text-brand-secondary hover:border-brand-primary/30 transition-all shadow-2xs"
            >
              <span>IIT Kanpur WSAIS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.iitm.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-border-color text-xs font-semibold text-brand-primary hover:text-brand-secondary hover:border-brand-primary/30 transition-all shadow-2xs"
            >
              <span>IIT Madras Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
