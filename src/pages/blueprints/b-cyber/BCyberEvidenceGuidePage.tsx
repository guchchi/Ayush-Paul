import React from 'react';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FolderGit2,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Code2,
  FileText,
  Video,
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
    <div className="w-full min-h-screen bg-bg-primary text-text-primary pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Layer 1 — Official FAQ 22 Portfolio Standards</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              Evidence of Prior Work Standards
            </h1>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              In accordance with official <strong>IIT Kanpur FAQ 22</strong>, candidates are evaluated on verifiable proof-of-work in cybersecurity. This guide outlines how to structure reproducible artifacts that academic panels can independently inspect.
            </p>
          </div>
        </div>

        {/* Non-Guarantee Notice */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-5 shadow-2xs space-y-2 text-amber-950 text-xs sm:text-sm leading-relaxed">
          <div className="font-bold text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Official Non-Guarantee & Alignment Notice</span>
          </div>
          <p>
            {evidenceGuide.officialDisclaimer}
          </p>
        </div>

        {/* Standards List */}
        <div className="space-y-8">
          {standards.map((std) => {
            const Icon = TYPE_ICONS[std.type] || FileCheck;

            return (
              <section
                key={std.id}
                className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs space-y-6 hover:border-brand-primary/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border-color">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                        {std.title}
                      </h2>
                      <span className="text-xs font-mono text-text-muted uppercase">
                        Type: {std.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <TrustBadge trustLevel="official_fact" size="sm" />
                </div>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {std.description}
                </p>

                {/* Criteria and Anti-patterns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Verification Criteria */}
                  <div className="rounded-xl bg-emerald-50/50 border border-emerald-200/60 p-4 space-y-3">
                    <div className="font-semibold text-xs text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Verifiable Quality Criteria</span>
                    </div>
                    <ul className="space-y-2 text-xs text-emerald-950/90">
                      {std.verificationCriteria.map((crit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Anti-Patterns */}
                  <div className="rounded-xl bg-rose-50/50 border border-rose-200/60 p-4 space-y-3">
                    <div className="font-semibold text-xs text-rose-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <XCircle className="w-4 h-4 text-rose-700" />
                      <span>Anti-Patterns to Avoid</span>
                    </div>
                    <ul className="space-y-2 text-xs text-rose-950/90">
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
                <div className="rounded-xl bg-bg-secondary/40 border border-border-color p-4 space-y-1.5 text-xs">
                  <div className="font-semibold text-text-primary">
                    Recommended Artifact Format & Presentation
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    {std.recommendedArtifactFormat}
                  </p>
                </div>

                {/* Official Reference */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-text-muted">
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
