import React from 'react';
import {
  History,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Terminal,
  ExternalLink,
  ShieldAlert,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { TrustBadge } from '../../../components/b-cyber/TrustBadge';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';

export function BCyber2026PrecedentPage() {
  const canonical = getCanonicalUrl('/blueprints/b-cyber/2026-process');

  useSEO({
    title: '2026 Process Precedent | B.Cyber Compass',
    description:
      'Historical analysis of the inaugural 2026 B.Cyber admission cycle, JEE Main screening precedent, and the 6-hour on-campus hackathon at IIT Kanpur.',
    keywords:
      'B.Cyber 2026, IIT Kanpur hackathon, JEE Main 2026 screening, New Core Lab, FAQ 23 discontinuation',
    url: canonical,
  });

  return (
    <div className="w-full min-h-screen bg-bg-primary text-text-primary pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <History className="w-3.5 h-3.5" />
              <span>Layer 1 — Observed Historical Precedent • Inaugural 2026 Cycle</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              The Inaugural 2026 Admission Process Breakdown
            </h1>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              This page documents the exact operational precedent from the inaugural 2026 admission cycle conducted by IIT Kanpur. Understanding the 2026 process provides invaluable insight into what the academic department values—most notably hands-on technical competence over rote testing.
            </p>
          </div>
        </div>

        {/* Critical Historical Precedent Callout */}
        <div className="rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50/90 to-amber-50/70 p-5 shadow-2xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm text-rose-950 leading-relaxed">
              <div className="font-bold text-rose-900 text-sm">
                CRITICAL NOTICE: JEE Main is Officially Discontinued for Future Admissions
              </div>
              <p>
                While the inaugural 2026 cycle used JEE Main scores for initial shortlisting,{' '}
                <strong>IIT Kanpur has officially declared in FAQ 23 that JEE Main will NOT be used for future cycles</strong>.
              </p>
              <div className="bg-white/80 p-3 rounded-lg border border-rose-200/80 font-mono text-xs text-rose-900">
                Official IIT Kanpur FAQ 23 Quote: "Will the same admission process be followed for future admissions? JEE Mains will not be used. A separate entrance test will be announced, the details of which will be made available soon."
              </div>
              <p className="text-xs text-rose-800">
                Do not assume JEE Main score thresholds, cutoffs, or subject weightages from 2026 apply to future admissions.
              </p>
            </div>
          </div>
        </div>

        {/* 2026 Stage-by-Stage Breakdown */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">
                Inaugural 2026 Selection Funnel
              </h2>
              <p className="text-xs text-text-secondary">
                Observed workflow published by IIT Kanpur WSAIS for the July 2026 intake.
              </p>
            </div>
            <TrustBadge trustLevel="observed_precedent_2026" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stage 1 */}
            <div className="rounded-xl border border-border-color bg-white p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-bg-secondary text-brand-primary">
                    STAGE 1 (2026)
                  </span>
                  <TrustBadge trustLevel="observed_precedent_2026" size="sm" />
                </div>
                <h3 className="font-bold text-sm text-text-primary">
                  Initial Screening & Shortlisting
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Candidates were screened based on the <strong>best JEE Main score</strong> of any session in 2025 or 2026, evaluated alongside submitted <strong>evidence of prior cybersecurity work</strong>.
                </p>
                <div className="text-[11px] text-text-muted bg-bg-secondary/40 p-2.5 rounded-lg border border-border-color/50">
                  <strong>Source:</strong> IIT Kanpur Selection & Policies pane.
                </div>
              </div>
              <div className="pt-2 text-[11px] text-rose-700 font-medium">
                * Discontinued for future admissions (FAQ 23).
              </div>
            </div>

            {/* Stage 2 */}
            <div className="rounded-xl border border-border-color bg-white p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-bg-secondary text-brand-primary">
                    STAGE 2 (2026)
                  </span>
                  <TrustBadge trustLevel="observed_precedent_2026" size="sm" />
                </div>
                <h3 className="font-bold text-sm text-text-primary">
                  Evidence of Prior Work Audit
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Screening committees audited candidates' verifiable proof-of-work: reported security vulnerabilities, developed cybersecurity tools, open-source commits, or technical challenge writeups.
                </p>
                <div className="text-[11px] text-text-muted bg-bg-secondary/40 p-2.5 rounded-lg border border-border-color/50">
                  <strong>Source:</strong> IIT Kanpur FAQ 22 definition.
                </div>
              </div>
              <div className="pt-2 text-[11px] text-emerald-700 font-medium">
                * Ongoing standard for technical verification.
              </div>
            </div>

            {/* Stage 3 */}
            <div className="rounded-xl border border-border-color bg-white p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-bg-secondary text-brand-primary">
                    STAGE 3 (2026)
                  </span>
                  <TrustBadge trustLevel="observed_precedent_2026" size="sm" />
                </div>
                <h3 className="font-bold text-sm text-text-primary">
                  On-Campus 6-Hour Hackathon
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Shortlisted candidates were invited to <strong>New Core Lab, IIT Kanpur</strong> on <strong>5 July 2026</strong> for an intensive 6-hour hands-on technical challenge across 8 practical cybersecurity domains.
                </p>
                <div className="text-[11px] text-text-muted bg-bg-secondary/40 p-2.5 rounded-lg border border-border-color/50">
                  <strong>Source:</strong> IIT Kanpur Admissions & Timelines pane.
                </div>
              </div>
              <div className="pt-2 text-[11px] text-amber-700 font-medium">
                * Observed historical testing format.
              </div>
            </div>
          </div>
        </section>

        {/* 2026 Hackathon Challenge Domains */}
        <section className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-border-color">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                Technical Domains Tested in the 2026 Hackathon
              </h2>
              <p className="text-xs text-text-secondary">
                Exact domains explicitly published by IIT Kanpur in FAQ 24 and the Admissions timeline.
              </p>
            </div>
            <TrustBadge trustLevel="observed_precedent_2026" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { name: 'Web Security', desc: 'Injection, broken access control, authentication bypass' },
              { name: 'API Security', desc: 'REST endpoint testing, token leakage, parameter tampering' },
              { name: 'OSINT', desc: 'Open-source intelligence gathering and forensic tracing' },
              { name: 'Reverse Engineering', desc: 'Binary disassembly, opcode analysis, decompilation' },
              { name: 'Linux Operating Systems', desc: 'CLI fluency, process hierarchy, permissions, bash scripts' },
              { name: 'Windows Security', desc: 'Registry inspection, event logs, access control lists' },
              { name: 'Cloud Security', desc: 'IAM misconfigurations, bucket permissions, cloud telemetry' },
              { name: 'Malware & Threat Analysis', desc: 'Static string extraction, behavior triage, signature matching' },
            ].map((domain, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-border-color bg-bg-secondary/40 space-y-1.5"
              >
                <div className="font-semibold text-text-primary flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{domain.name}</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-snug">{domain.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-bg-secondary/40 p-4 rounded-xl border border-border-color text-xs text-text-secondary leading-relaxed">
            <strong className="text-text-primary">Educational Takeaway:</strong> The 2026 hackathon clearly proved that IIT Kanpur prioritizes applied, practical engineering fluency over abstract memorization. Candidates who had solved real hands-on problems and built software had a substantial advantage over theoretical test takers.
          </div>
        </section>

        {/* 2026 Eligibility Criteria Precedent Table */}
        <section className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-border-color">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                Eligibility Precedent Table (2026 Inaugural Cycle)
              </h2>
              <p className="text-xs text-text-secondary">
                Criteria enforced for 2026 applicants. Future criteria for 2027 are awaiting official announcement.
              </p>
            </div>
            <TrustBadge trustLevel="observed_precedent_2026" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-color text-text-muted uppercase text-[11px] font-semibold bg-bg-secondary/50">
                  <th className="py-2.5 px-3">Parameter</th>
                  <th className="py-2.5 px-3">2026 Observed Criterion</th>
                  <th className="py-2.5 px-3">Future Cycle (2027+) Status</th>
                  <th className="py-2.5 px-3">Official Citation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color/60 text-text-secondary">
                <tr>
                  <td className="py-3 px-3 font-semibold text-text-primary">Subject Stream</td>
                  <td className="py-3 px-3">Class 12 Physics, Chemistry & Mathematics (PCM) with 5 subjects</td>
                  <td className="py-3 px-3 text-sky-800 font-medium">Pending 2027 notification</td>
                  <td className="py-3 px-3 font-mono text-[11px]">IITK Eligibility Pane</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-text-primary">Board Eligibility</td>
                  <td className="py-3 px-3">Recognized Central/State boards; NIOS explicitly eligible</td>
                  <td className="py-3 px-3 text-sky-800 font-medium">Pending 2027 notification</td>
                  <td className="py-3 px-3 font-mono text-[11px]">IITK Eligibility Pane</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-text-primary">Nationality</td>
                  <td className="py-3 px-3">Indian Nationals only (PIO/OCI not eligible in 2026)</td>
                  <td className="py-3 px-3 text-sky-800 font-medium">Pending 2027 notification</td>
                  <td className="py-3 px-3 font-mono text-[11px]">IITK Eligibility Pane</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-text-primary">Attempt Limit</td>
                  <td className="py-3 px-3">Maximum two attempts in consecutive years</td>
                  <td className="py-3 px-3 text-sky-800 font-medium">Pending 2027 notification</td>
                  <td className="py-3 px-3 font-mono text-[11px]">IITK Eligibility Pane</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-text-primary">Age Cutoff</td>
                  <td className="py-3 px-3">Born on or after Oct 1, 2001 (Oct 1, 1996 for SC/ST/PwD)</td>
                  <td className="py-3 px-3 text-sky-800 font-medium">Pending 2027 notification</td>
                  <td className="py-3 px-3 font-mono text-[11px]">IITK Eligibility Pane</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-text-primary">Prior IIT Admission</td>
                  <td className="py-3 px-3">Candidates previously admitted to an IIT under JoSAA are disqualified</td>
                  <td className="py-3 px-3 text-emerald-800 font-medium">Standard Senate Ordinance</td>
                  <td className="py-3 px-3 font-mono text-[11px]">IITK Eligibility Pane</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Action Callout */}
        <div className="rounded-xl border border-brand-primary/30 bg-gradient-to-r from-brand-primary/5 to-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-text-primary">
              Ready to Align Your Preparation with These Standards?
            </h3>
            <p className="text-xs text-text-secondary">
              Use our interactive planner to assemble verifiable evidence of prior work (FAQ 22) and build foundational skills.
            </p>
          </div>
          <Link
            to="/blueprints/b-cyber/prepare"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-secondary transition-colors shrink-0 shadow-2xs"
          >
            <span>Open Preparation Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
