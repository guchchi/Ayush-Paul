import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { TrustBadge } from '../../../components/b-cyber/TrustBadge';
import { SourceCitationCard } from '../../../components/b-cyber/SourceCitationCard';
import { admissionGuide } from '../../../content/b-cyber';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';
import { cn } from '../../../lib/utils';
import type { AdmissionTrustLevel } from '../../../types/b-cyber-compass';

export function BCyberAdmissionGuidePage() {
  const canonical = getCanonicalUrl('/blueprints/b-cyber/admission');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const [selectedTrustFilter, setSelectedTrustFilter] = useState<string>('all');

  useSEO({
    title: 'Admission Intelligence | B.Cyber Compass',
    description:
      'Verified institutional admission policies, Senate regulations, degree progression rules, and exit options for B.Cyber at IIT Kanpur and IIT Madras.',
    keywords:
      'B.Cyber admission policy, IIT Kanpur Senate rules, IIT Madras B.Cyber, FAQ 23, degree awarding, exit options, branch change restriction',
    url: canonical,
  });

  const sections = admissionGuide.sections;

  const filteredSections = sections.map((sec) => {
    let matchingClaims = sec.claims;
    if (selectedTrustFilter !== 'all') {
      matchingClaims = matchingClaims.filter((c) => c.trustLevel === selectedTrustFilter);
    }
    return {
      ...sec,
      claims: matchingClaims,
    };
  }).filter((sec) => {
    if (selectedSectionId !== 'all' && sec.id !== selectedSectionId) {
      return false;
    }
    return sec.claims.length > 0;
  });

  return (
    <div className="w-full min-h-screen bg-bg-primary text-text-primary pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <div className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Layer 1 — Admission Intelligence • 12 Verified Institutional Claims</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              Confirmed Admission Policies & Senate Regulations
            </h1>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Every claim on this page is cross-referenced directly against official ordinances, press releases, or published FAQs from the <strong>IIT Kanpur WSAIS portal</strong> and <strong>IIT Madras</strong>. Unannounced future policies are strictly designated as pending official notice.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="mt-6 pt-5 border-t border-border-color flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-text-secondary flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Section:
              </span>
              <button
                onClick={() => setSelectedSectionId('all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer',
                  selectedSectionId === 'all'
                    ? 'bg-brand-primary text-white shadow-2xs'
                    : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
                )}
              >
                All Sections ({sections.length})
              </button>
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer',
                    selectedSectionId === sec.id
                      ? 'bg-brand-primary text-white shadow-2xs'
                      : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
                  )}
                >
                  {sec.title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-text-secondary">Trust Status:</span>
              <select
                value={selectedTrustFilter}
                onChange={(e) => setSelectedTrustFilter(e.target.value)}
                className="rounded-lg border border-border-color bg-white px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer"
              >
                <option value="all">All Trust Levels</option>
                <option value="official_fact">Official Fact</option>
                <option value="observed_precedent_2026">2026 Precedent</option>
                <option value="pending_official_notice">Pending Official Notice</option>
              </select>
            </div>
          </div>
        </div>

        <DisclaimerBanner variant="compact" />

        {/* Section List */}
        <div className="space-y-8">
          {filteredSections.map((sec) => (
            <section
              key={sec.id}
              className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border-color">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                      {sec.title}
                    </h2>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-bg-secondary text-text-muted">
                      Scope: {sec.applicableYear}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">{sec.summary}</p>
                </div>
                <TrustBadge trustLevel={sec.trustLevel} />
              </div>

              {/* Claims Grid */}
              <div className="space-y-6">
                {sec.claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="rounded-xl border border-border-color/80 bg-bg-secondary/30 p-5 space-y-4 hover:border-brand-primary/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-brand-primary">
                            {claim.id.toUpperCase()}
                          </span>
                          <span className="text-xs text-text-muted">•</span>
                          <span className="text-xs font-medium text-text-secondary">
                            Cycle: {claim.applicableYear}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm sm:text-base text-text-primary leading-snug">
                          {claim.claim}
                        </h3>
                      </div>
                      <div className="shrink-0">
                        <TrustBadge trustLevel={claim.trustLevel} size="sm" />
                      </div>
                    </div>

                    {claim.qualificationsOrLimitations && (
                      <div className="rounded-lg bg-amber-50/70 border border-amber-200/60 p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold">Institutional Boundary: </strong>
                          {claim.qualificationsOrLimitations}
                        </div>
                      </div>
                    )}

                    {claim.historicalContext && (
                      <div className="text-xs text-text-secondary bg-white p-3 rounded-lg border border-border-color leading-relaxed">
                        <strong className="text-text-primary">Historical Precedent Note: </strong>
                        {claim.historicalContext}
                      </div>
                    )}

                    {/* Source Citations */}
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-text-muted">
                        Official Verification Citations ({claim.sources.length})
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {claim.sources.map((src, idx) => (
                          <SourceCitationCard key={idx} citation={src} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
