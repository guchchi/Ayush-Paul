import React from 'react';
import {
  Bell,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
} from 'lucide-react';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { TrustBadge } from '../../../components/b-cyber/TrustBadge';
import { SourceCitationCard } from '../../../components/b-cyber/SourceCitationCard';
import { officialUpdates } from '../../../content/b-cyber';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';

export function BCyberOfficialUpdatesPage() {
  const canonical = getCanonicalUrl('/blueprints/b-cyber/updates');

  useSEO({
    title: 'Official Updates Timeline | B.Cyber Compass',
    description:
      'Chronological log of verified institutional announcements, FAQ additions, policy shifts, and entrance test updates for the B.Cyber program.',
    keywords:
      'B.Cyber official updates, FAQ 23, IIT Kanpur WSAIS news, IIT Madras B.Cyber launch, entrance test announcements',
    url: canonical,
  });

  const updates = officialUpdates.updates;

  return (
    <div className="w-full min-h-screen bg-bg-primary text-text-primary pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
              <Bell className="w-3.5 h-3.5" />
              <span>Layer 1 — Chronological Updates Feed • {updates.length} Verified Entries</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              Official Institutional Updates & FAQ Log
            </h1>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Every entry in this chronological log represents a verified institutional policy shift or FAQ addition published by <strong>IIT Kanpur</strong> or <strong>IIT Madras</strong>. Unverified rumors or social media leaks are strictly excluded.
            </p>
          </div>
        </div>

        <DisclaimerBanner variant="compact" />

        {/* Timeline Stream */}
        <div className="space-y-6">
          {updates.map((update, index) => (
            <article
              key={update.id}
              className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs hover:border-brand-primary/30 transition-all space-y-5"
            >
              {/* Top metadata line */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border-color/60">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-brand-primary bg-bg-secondary px-2.5 py-1 rounded-md">
                    <Calendar className="w-3.5 h-3.5" />
                    {update.date}
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-bg-secondary text-text-secondary border border-border-color/60">
                    Category: {update.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-text-muted">
                    Cycle: {update.applicableYear}
                  </span>
                </div>
                <TrustBadge trustLevel={update.trustLevel} size="sm" />
              </div>

              {/* Title & Summary */}
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                  {update.title}
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {update.summary}
                </p>
              </div>

              {/* Implications Callout */}
              <div className="rounded-xl bg-blue-50/60 border border-blue-200/70 p-4 space-y-1.5 text-xs text-blue-950">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-700" />
                  <span>Actionable Implication for Prospective Students</span>
                </div>
                <p className="leading-relaxed pl-5.5 text-blue-900/90">
                  {update.implicationsForStudents}
                </p>
              </div>

              {/* Official Source Card */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-text-muted">
                  Official Verification Source
                </div>
                <SourceCitationCard citation={update.officialSource} />
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
