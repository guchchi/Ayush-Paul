import React from 'react';
import {
  History,
  AlertTriangle,
  Terminal,
  ExternalLink,
  ShieldAlert,
  Clock,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Globe,
  Binary,
  Layers,
  FileCode,
  Shield,
  Eye,
  Server,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { TrustBadge } from '../../../components/b-cyber/TrustBadge';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  'Web Security': Globe,
  'API Security': Server,
  'OSINT': Eye,
  'Reverse Engineering': Binary,
  'Linux Operating Systems': Terminal,
  'Windows Security': Shield,
  'Cloud Security': Layers,
  'Malware & Threat Analysis': Cpu,
};

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
    <div className="w-full min-h-screen bg-[#fafbfc] text-[#0f172a] pt-28 sm:pt-32 pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Block */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-medium">
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Layer 1 — Observed Historical Precedent • Inaugural 2026 Cycle</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              The Inaugural 2026 Admission Process Breakdown
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              This page documents operational precedent from the inaugural 2026 admission cycle conducted by IIT Kanpur. Understanding the 2026 precedent provides clear insight into what the department values: applied, hands-on technical competence over rote exam memorization.
            </p>
          </div>
        </div>

        {/* Compact Disclaimer */}
        <DisclaimerBanner variant="compact" />

        {/* Linear Step Funnel (Stage 1 -> Stage 2 -> Stage 3) */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                Inaugural 2026 Selection Funnel
              </h2>
              <p className="text-xs text-slate-500">
                Linear workflow published by IIT Kanpur WSAIS for the July 2026 intake.
              </p>
            </div>
            <TrustBadge trustLevel="observed_precedent_2026" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200/80">
                    STAGE 1 (2026)
                  </span>
                  <TrustBadge trustLevel="observed_precedent_2026" size="sm" />
                </div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Initial Screening &amp; Shortlisting
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Screened based on the <strong>best JEE Main score</strong> of any session in 2025 or 2026, alongside submitted <strong>evidence of prior cybersecurity work</strong>.
                </p>

                {/* Critical FAQ 23 Callout embedded directly into Step 1 */}
                <div className="rounded-lg border border-rose-200/80 bg-rose-50/60 p-2.5 text-xs text-rose-950 space-y-1">
                  <div className="font-semibold text-rose-900 flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Discontinued for Future Cycles</span>
                  </div>
                  <p className="text-[11px] text-rose-900/85 leading-relaxed">
                    IIT Kanpur confirmed in FAQ 23: <em>&ldquo;JEE Mains will not be used. A separate entrance test will be announced.&rdquo;</em>
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-400 font-medium border-t border-slate-100">
                Source: IIT Kanpur Selection &amp; FAQ 23
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200/80">
                    STAGE 2 (2026)
                  </span>
                  <TrustBadge trustLevel="observed_precedent_2026" size="sm" />
                </div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Evidence of Prior Work Audit
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Faculty screening panels audited verifiable proof-of-work: reported security vulnerabilities, original tools, open-source commits, or technical challenge writeups.
                </p>

                <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/60 p-2.5 text-xs text-emerald-950 space-y-1">
                  <div className="font-semibold text-emerald-900 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Ongoing Core Benchmark</span>
                  </div>
                  <p className="text-[11px] text-emerald-900/85 leading-relaxed">
                    Defined under FAQ 22 as a mandatory assessment pillar for practical cybersecurity ability.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-400 font-medium border-t border-slate-100">
                Source: IIT Kanpur FAQ 22 Portfolio Standards
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200/80">
                    STAGE 3 (2026)
                  </span>
                  <TrustBadge trustLevel="observed_precedent_2026" size="sm" />
                </div>
                <h3 className="font-semibold text-sm text-slate-900">
                  On-Campus 6-Hour Hackathon
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Shortlisted candidates were invited to <strong>New Core Lab, IIT Kanpur</strong> on <strong>5 July 2026</strong> for an intensive 6-hour hands-on technical challenge across 8 practical cybersecurity domains.
                </p>

                <div className="rounded-lg border border-sky-200/80 bg-sky-50/60 p-2.5 text-xs text-sky-950 space-y-1">
                  <div className="font-semibold text-sky-900 flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>In-Person Testing Format</span>
                  </div>
                  <p className="text-[11px] text-sky-900/85 leading-relaxed">
                    10:00 AM to 4:00 PM on sanitized desktop lab systems monitored by faculty and technical experts.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-400 font-medium border-t border-slate-100">
                Source: IIT Kanpur Admissions Timeline
              </div>
            </div>
          </div>
        </section>

        {/* 2026 Hackathon Challenge Domains */}
        <section className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-slate-900">
                Technical Domains Tested in the 2026 Hackathon
              </h2>
              <p className="text-xs text-slate-500">
                Explicit domains published by IIT Kanpur in FAQ 24 and the Admissions timetable.
              </p>
            </div>
            <TrustBadge trustLevel="observed_precedent_2026" size="sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              { name: 'Web Security', desc: 'Injection flaws, broken access control, authentication bypasses' },
              { name: 'API Security', desc: 'REST endpoint testing, token leakage, parameter tampering' },
              { name: 'OSINT', desc: 'Open-source intelligence gathering and forensic investigation' },
              { name: 'Reverse Engineering', desc: 'Binary disassembly, opcode analysis, decompilation' },
              { name: 'Linux Operating Systems', desc: 'CLI fluency, process trees, permissions, shell scripting' },
              { name: 'Windows Security', desc: 'Registry inspection, event logs, access control lists' },
              { name: 'Cloud Security', desc: 'IAM misconfigurations, storage permissions, cloud telemetry' },
              { name: 'Malware & Threat Analysis', desc: 'Static string extraction, behavior triage, signature matching' },
            ].map((domain, idx) => {
              const Icon = DOMAIN_ICONS[domain.name] || Terminal;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-slate-200/70 bg-slate-50/50 space-y-1.5 hover:border-slate-300 hover:bg-white transition-all"
                >
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs">{domain.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug pl-8">{domain.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/70 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900 font-semibold">Educational Takeaway:</strong> The 2026 hackathon demonstrated that IIT Kanpur prioritizes applied, practical engineering fluency over abstract memorization. Candidates who had solved real hands-on problems and built software had a substantial advantage over purely theoretical test takers.
          </div>
        </section>

        {/* 2026 Eligibility Criteria Precedent Table */}
        <section className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-slate-900">
                Eligibility Precedent Table (2026 Inaugural Cycle)
              </h2>
              <p className="text-xs text-slate-500">
                Criteria enforced for 2026 applicants. Criteria for future cycles (2027+) await official notification.
              </p>
            </div>
            <TrustBadge trustLevel="observed_precedent_2026" size="sm" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-500 uppercase text-[11px] font-semibold tracking-wider bg-slate-50/70">
                  <th className="py-2.5 px-3">Parameter</th>
                  <th className="py-2.5 px-3">2026 Observed Criterion</th>
                  <th className="py-2.5 px-3">Future Cycle Status</th>
                  <th className="py-2.5 px-3">Official Citation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">Subject Stream</td>
                  <td className="py-3 px-3">Class 12 Physics, Chemistry & Mathematics (PCM) with 5 subjects</td>
                  <td className="py-3 px-3 text-sky-700 font-medium">Pending future notification</td>
                  <td className="py-3 px-3 text-xs text-slate-400 font-medium">IITK Eligibility Pane</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">Board Eligibility</td>
                  <td className="py-3 px-3">Recognized Central/State boards; NIOS explicitly eligible</td>
                  <td className="py-3 px-3 text-sky-700 font-medium">Pending future notification</td>
                  <td className="py-3 px-3 text-xs text-slate-400 font-medium">IITK Eligibility Pane</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">Nationality</td>
                  <td className="py-3 px-3">Indian Nationals only (PIO/OCI not eligible in 2026)</td>
                  <td className="py-3 px-3 text-sky-700 font-medium">Pending future notification</td>
                  <td className="py-3 px-3 text-xs text-slate-400 font-medium">IITK Eligibility Pane</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">Attempt Limit</td>
                  <td className="py-3 px-3">Maximum two attempts in consecutive years</td>
                  <td className="py-3 px-3 text-sky-700 font-medium">Pending future notification</td>
                  <td className="py-3 px-3 text-xs text-slate-400 font-medium">IITK Eligibility Pane</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">Age Cutoff</td>
                  <td className="py-3 px-3">Born on or after Oct 1, 2001 (Oct 1, 1996 for SC/ST/PwD)</td>
                  <td className="py-3 px-3 text-sky-700 font-medium">Pending future notification</td>
                  <td className="py-3 px-3 text-xs text-slate-400 font-medium">IITK Eligibility Pane</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">Prior IIT Admission</td>
                  <td className="py-3 px-3">Candidates previously admitted to an IIT under JoSAA disqualified</td>
                  <td className="py-3 px-3 text-emerald-700 font-medium">Standard Senate Ordinance</td>
                  <td className="py-3 px-3 text-xs text-slate-400 font-medium">IITK Eligibility Pane</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Action Callout */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="space-y-0.5">
            <h3 className="font-semibold text-xs sm:text-sm text-slate-900">
              Ready to Align Your Preparation with These Standards?
            </h3>
            <p className="text-xs text-slate-500">
              Use our interactive planner to assemble verifiable evidence of prior work (FAQ 22) and build foundational skills.
            </p>
          </div>
          <Link
            to="/blueprints/b-cyber/prepare"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shrink-0 shadow-xs group"
          >
            <span>Open Preparation Planner</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </main>
    </div>
  );
}
