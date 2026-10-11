import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FolderGit2,
  ExternalLink,
  ShieldCheck,
  Terminal,
  FileText,
  Video,
  ListChecks,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { TrustBadge } from '../../../components/b-cyber/TrustBadge';
import { SourceCitationCard } from '../../../components/b-cyber/SourceCitationCard';
import { evidenceGuide } from '../../../content/b-cyber';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';

const TYPE_ICONS: Record<string, React.ElementType> = {
  vulnerability_disclosure: ShieldCheck,
  original_tool: Terminal,
  opensource_contribution: FolderGit2,
  technical_writeup: FileText,
  video_walkthrough: Video,
};

export function BCyberEvidenceGuidePage() {
  const canonical = getCanonicalUrl('/blueprints/b-cyber/evidence-of-work');

  useSEO({
    title: 'Evidence of Prior Work Guide (FAQ 22) | B.Cyber Compass',
    description:
      'Official standards and actionable portfolio guidelines for presenting verifiable prior cybersecurity work aligned with IIT Kanpur FAQ 22.',
    keywords:
      'evidence of prior work, FAQ 22, IIT Kanpur cybersecurity portfolio, vulnerability disclosure, open source security project, technical writeup',
    url: canonical,
  });

  const standards = evidenceGuide.standards;

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 pt-28 sm:pt-32 pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Block */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-mono">
              <FileCheck className="w-3 h-3 text-slate-500" />
              <span>Layer 1 — Official FAQ 22 Portfolio Standards</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Evidence of Prior Work Standards
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In accordance with official <strong>IIT Kanpur FAQ 22</strong>, candidates are evaluated on verifiable proof-of-work in cybersecurity. This guide outlines how to structure reproducible artifacts that faculty panels can independently verify.
            </p>
          </div>
        </div>

        {/* Non-Guarantee Notice */}
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 sm:p-5 space-y-1.5 text-amber-950 text-xs sm:text-sm leading-relaxed">
          <div className="font-semibold text-amber-900 flex items-center gap-2 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Official Non-Guarantee & Alignment Notice</span>
          </div>
          <p className="text-amber-900/90 text-xs">
            {evidenceGuide.officialDisclaimer}
          </p>
        </div>

        {/* Actionable Portfolio Self-Audit Checklist */}
        <section className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
              <ListChecks className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                Candidate Portfolio Self-Audit Checklist
              </h2>
              <p className="text-[11px] text-slate-500">
                Before submitting artifacts, benchmark them against these 4 verification gates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200/70 bg-slate-50/50 space-y-1 hover:bg-white hover:border-slate-300 transition-all">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>1. Verifiable Public Repository</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pl-5">
                Clean Git commit history, open code license, and clear architecture documentation. No single-commit template clones.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200/70 bg-slate-50/50 space-y-1 hover:bg-white hover:border-slate-300 transition-all">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>2. Reproducible Setup & Test Cases</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pl-5">
                Any security tool must have deterministic setup instructions, a dependency lockfile, and working demonstration tests.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200/70 bg-slate-50/50 space-y-1 hover:bg-white hover:border-slate-300 transition-all">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>3. Responsible Disclosure Trail</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pl-5">
                Vulnerabilities must show explicit proof of ethical disclosure: coordinated vendor correspondence, Hall of Fame listing, or CVE.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200/70 bg-slate-50/50 space-y-1 hover:bg-white hover:border-slate-300 transition-all">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>4. Original Analytical Writeup</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pl-5">
                Technical writeups must document novel methodology and root cause analysis, rather than generic walkthroughs of solved CTFs.
              </p>
            </div>
          </div>
        </section>

        {/* Standards List */}
        <div className="space-y-5">
          {standards.map((std) => {
            const Icon = TYPE_ICONS[std.type] || FileCheck;

            return (
              <section
                key={std.id}
                className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-5 hover:border-slate-300 transition-colors"
              >
                {/* Standard Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-semibold tracking-tight text-slate-900">
                        {std.title}
                      </h2>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        Category: {std.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <TrustBadge trustLevel="official_fact" size="sm" />
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {std.description}
                </p>

                {/* Criteria and Anti-patterns Side-by-Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Verification Criteria */}
                  <div className="rounded-lg bg-emerald-50/40 border border-emerald-200/60 p-4 space-y-2">
                    <div className="font-semibold text-xs text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Verifiable Criteria (Do This)</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-emerald-950/90">
                      {std.verificationCriteria.map((crit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Anti-Patterns */}
                  <div className="rounded-lg bg-rose-50/40 border border-rose-200/60 p-4 space-y-2">
                    <div className="font-semibold text-xs text-rose-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <XCircle className="w-3.5 h-3.5 text-rose-700" />
                      <span>Anti-Patterns (Avoid This)</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-rose-950/90">
                      {std.antiPatternsToAvoid.map((ap, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                          <span>{ap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended Format Box */}
                <div className="rounded-lg bg-slate-50 border border-slate-200/70 p-3.5 space-y-1 text-xs">
                  <div className="font-semibold text-slate-900 text-xs">
                    Recommended Artifact Format & Presentation
                  </div>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    {std.recommendedArtifactFormat}
                  </p>
                </div>

                {/* Official Reference */}
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400">
                    Official Reference Citation
                  </div>
                  <SourceCitationCard citation={std.officialReference} />
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
