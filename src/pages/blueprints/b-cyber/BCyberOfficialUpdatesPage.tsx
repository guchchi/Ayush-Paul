import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Filter,
} from 'lucide-react';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { TrustBadge } from '../../../components/b-cyber/TrustBadge';
import { SourceCitationCard } from '../../../components/b-cyber/SourceCitationCard';
import { officialUpdates } from '../../../content/b-cyber';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';
import { cn } from '../../../lib/utils';

export function BCyberOfficialUpdatesPage() {
  const canonical = getCanonicalUrl('/blueprints/b-cyber/updates');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useSEO({
    title: 'Official Updates Timeline | B.Cyber Compass',
    description:
      'Chronological log of verified institutional announcements, FAQ additions, policy shifts, and entrance test updates for the B.Cyber program.',
    keywords:
      'B.Cyber official updates, FAQ 23, IIT Kanpur WSAIS news, IIT Madras B.Cyber launch, entrance test announcements',
    url: canonical,
  });

  const updates = officialUpdates.updates;

  const filteredUpdates = updates.filter((u) => {
    if (selectedCategory === 'all') return true;
    return u.category === selectedCategory;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 pt-28 sm:pt-32 pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Block */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
              <Bell className="w-3 h-3 text-slate-500" />
              <span>Layer 1 — Chronological Feed • {updates.length} Verified Entries</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Official Institutional Updates & FAQ Log
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every entry in this chronological log represents a verified institutional policy shift or FAQ addition published by <strong>IIT Kanpur</strong> or <strong>IIT Madras</strong>. Unverified rumors or social media claims are strictly excluded.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              )}
            >
              All Updates ({updates.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('policy_change')}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                selectedCategory === 'policy_change'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              )}
            >
              Policy Changes ({updates.filter((u) => u.category === 'policy_change').length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('timeline')}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                selectedCategory === 'timeline'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              )}
            >
              Timeline Events ({updates.filter((u) => u.category === 'timeline').length})
            </button>
          </div>
        </div>

        {/* Compact Disclaimer */}
        <DisclaimerBanner variant="compact" />

        {/* Chronological Stream */}
        <div className="space-y-4">
          {filteredUpdates.map((update) => (
            <article
              key={update.id}
              className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-colors space-y-3.5"
            >
              {/* Metadata Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {update.date}
                  </span>
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200/70">
                    {update.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Cycle: {update.applicableYear}
                  </span>
                </div>
                <TrustBadge trustLevel={update.trustLevel} size="sm" />
              </div>

              {/* Title & Summary */}
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-semibold tracking-tight text-slate-900">
                  {update.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {update.summary}
                </p>
              </div>

              {/* Actionable Implication Callout */}
              <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3 space-y-1 text-xs text-slate-800">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  <span>Actionable Takeaway for Candidates</span>
                </div>
                <p className="leading-relaxed pl-5 text-slate-600 text-xs">
                  {update.implicationsForStudents}
                </p>
              </div>

              {/* Source Card */}
              <div className="space-y-1 pt-1">
                <div className="text-[11px] font-semibold text-slate-400">
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
