import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Scale,
  LogOut,
  AlertTriangle,
  Search,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { TrustBadge } from '../../../components/b-cyber/TrustBadge';
import { SourceCitationCard } from '../../../components/b-cyber/SourceCitationCard';
import { BCyberEligibilityScreener } from '../../../components/b-cyber/BCyberEligibilityScreener';
import { BCyberParadigmShiftCard } from '../../../components/b-cyber/BCyberParadigmShiftCard';
import { BCyberHackathonMatrix } from '../../../components/b-cyber/BCyberHackathonMatrix';
import { BCyberProofOfWorkFilter } from '../../../components/b-cyber/BCyberProofOfWorkFilter';
import { admissionGuide } from '../../../content/b-cyber';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';
import { cn } from '../../../lib/utils';

export function BCyberAdmissionGuidePage() {
  const canonical = getCanonicalUrl('/blueprints/b-cyber/admission');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const [selectedTrustFilter, setSelectedTrustFilter] = useState<string>('all');
  const [expandedClaimIds, setExpandedClaimIds] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  useSEO({
    title: 'Admission Intelligence & Regulations | B.Cyber Compass',
    description:
      'Verified institutional admission policies, Senate regulations, 2026 precedent vs 2027 confirmed shift, hackathon blueprint, and proof-of-work criteria for B.Cyber at IIT Kanpur.',
    keywords:
      'B.Cyber admission policy, IIT Kanpur Senate rules, FAQ 23, separate entrance test, 2027 eligibility, hackathon format, proof of work standards',
    url: canonical,
  });

  const toggleClaimExpansion = (claimId: string) => {
    setExpandedClaimIds((prev) => ({
      ...prev,
      [claimId]: !prev[claimId],
    }));
  };

  const sections = admissionGuide.sections;

  // Filter sections and claims
  const filteredSections = sections
    .map((sec) => {
      let matchingClaims = sec.claims;

      if (selectedTrustFilter !== 'all') {
        matchingClaims = matchingClaims.filter((c) => c.trustLevel === selectedTrustFilter);
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchingClaims = matchingClaims.filter(
          (c) =>
            c.claim.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q) ||
            c.qualificationsOrLimitations?.toLowerCase().includes(q) ||
            c.historicalContext?.toLowerCase().includes(q)
        );
      }

      return {
        ...sec,
        claims: matchingClaims,
      };
    })
    .filter((sec) => {
      if (selectedSectionId !== 'all' && sec.id !== selectedSectionId) {
        return false;
      }
      return sec.claims.length > 0;
    });

  const totalFilteredClaims = filteredSections.reduce((sum, s) => sum + s.claims.length, 0);

  return (
    <div className="w-full min-h-screen bg-[#fafbfc] text-[#0f172a] pt-28 sm:pt-32 pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Block */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
              <span>Pillar 2 · Institutional Admission Intelligence</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Admission Policies, Senate Ordinances &amp; Selection Cockpit
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every regulation below is cross-referenced with official Senate resolutions, published FAQs from the <strong>IIT Kanpur WSAIS portal</strong>, and <strong>IIT Madras</strong>. Unannounced future policies are strictly designated as pending official notice.
            </p>
          </div>

          {/* Executive Facts Matrix (4 Core Pillars) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <TrustBadge trustLevel="official_fact" size="sm" />
              </div>
              <h3 className="font-semibold text-xs text-slate-900">Independent Degrees</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                Degrees and alumnus status are conferred independently by the respective enrolling institute (IITK or IITM).
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <TrustBadge trustLevel="official_fact" size="sm" />
              </div>
              <h3 className="font-semibold text-xs text-slate-900">Senate Exit Options</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                Multiple exits under Senate rules: Certificate at 150 credits, Diploma at 200 credits, or 4-year degree (365 cr).
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <TrustBadge trustLevel="official_fact" size="sm" />
              </div>
              <h3 className="font-semibold text-xs text-slate-900">Branch Changes Prohibited</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                Strictly prohibited into or out of B.Cyber across all branches per IIT Kanpur WSAIS FAQ 12.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <TrustBadge trustLevel="official_fact" size="sm" />
              </div>
              <h3 className="font-semibold text-xs text-slate-900">JEE Main Discontinued</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                JEE Main will not be used for future admissions (FAQ 23). A separate entrance test will be announced.
              </p>
            </div>
          </div>
        </div>

        {/* Compact Disclaimer */}
        <DisclaimerBanner variant="compact" />

        {/* SECTION 1: Interactive Cycle-Aware Eligibility Screener */}
        <section id="screener" className="scroll-mt-32 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>1. Check Your Statutory Eligibility</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Cycle-Aware Engine</span>
          </div>
          <BCyberEligibilityScreener />
        </section>

        {/* SECTION 2: 2026 Precedent vs 2027 Confirmed Shift */}
        <section id="paradigm-shift" className="scroll-mt-32 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>2. 2026 Precedent vs. 2027 Confirmed Shift</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">WSAIS FAQ 23 Analysis</span>
          </div>
          <BCyberParadigmShiftCard />
        </section>

        {/* SECTION 3: 6-Hour In-Person Hackathon Blueprint */}
        <section id="hackathon-blueprint" className="scroll-mt-32 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>3. The Practical Evaluation Hackathon</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">New Core Lab, IIT Kanpur</span>
          </div>
          <BCyberHackathonMatrix />
        </section>

        {/* SECTION 4: Portfolio Proof-of-Work Standards (FAQ 22) */}
        <section id="portfolio-standards" className="scroll-mt-32 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>4. Evidence of Prior Work Standards</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">WSAIS FAQ 22 Criterion</span>
          </div>
          <BCyberProofOfWorkFilter />
        </section>

        {/* SECTION 5: Detailed Verified Senate Ordinance Claims & Search */}
        <section id="ordinances" className="scroll-mt-32 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span>5. Verified Senate Regulations &amp; Policy Database</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Direct Portal Citations</span>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            {/* Search & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search policies (e.g. exit options, NIOS, credits, JoSAA)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200/90 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3" /> Section:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSectionId('all')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                    selectedSectionId === 'all'
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  )}
                >
                  All ({sections.reduce((acc, s) => acc + s.claims.length, 0)})
                </button>
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap',
                      selectedSectionId === sec.id
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    )}
                  >
                    {sec.title.split(' ')[0]} ({sec.claims.length})
                  </button>
                ))}

                <select
                  value={selectedTrustFilter}
                  onChange={(e) => setSelectedTrustFilter(e.target.value)}
                  className="rounded-md border border-slate-200/90 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-hidden focus:border-slate-900 cursor-pointer ml-auto sm:ml-0"
                >
                  <option value="all">All Trust Levels</option>
                  <option value="official_fact">Official Fact</option>
                  <option value="observed_precedent_2026">2026 Precedent</option>
                  <option value="pending_official_notice">Pending Notice</option>
                </select>
              </div>
            </div>

            {/* Claims Stream */}
            <div className="space-y-6">
              {filteredSections.map((sec) => (
                <div
                  key={sec.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200/60">
                    <div>
                      <h3 className="text-sm font-bold tracking-tight text-slate-900">
                        {sec.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{sec.summary}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-medium">
                        Cycle: {sec.applicableYear}
                      </span>
                      <TrustBadge trustLevel={sec.trustLevel} size="sm" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {sec.claims.map((claim) => {
                      const isExpanded = !!expandedClaimIds[claim.id];

                      return (
                        <article
                          key={claim.id}
                          className="rounded-xl border border-slate-200/80 bg-white p-4 transition-all hover:border-slate-300 space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                                  {claim.id.toUpperCase()}
                                </span>
                                <span className="text-xs text-slate-300">•</span>
                                <span className="text-xs text-slate-400 font-medium">
                                  Scope: {claim.applicableYear}
                                </span>
                              </div>
                              <h4 className="font-semibold text-xs sm:text-sm text-slate-900 leading-snug">
                                {claim.claim}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                              <TrustBadge trustLevel={claim.trustLevel} size="sm" />
                              <button
                                type="button"
                                onClick={() => toggleClaimExpansion(claim.id)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md bg-slate-50 border border-slate-200/80 hover:bg-slate-100 cursor-pointer transition-colors"
                              >
                                <span>{isExpanded ? 'Hide citations' : 'View citations'}</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>

                          {/* Progressive Disclosure: Citations & Context */}
                          {isExpanded && (
                            <div className="pt-3 border-t border-slate-100 space-y-3">
                              {claim.qualificationsOrLimitations && (
                                <div className="rounded-lg bg-amber-50/70 border border-amber-200/60 p-2.5 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="font-semibold">Institutional Boundary: </strong>
                                    {claim.qualificationsOrLimitations}
                                  </div>
                                </div>
                              )}

                              {claim.historicalContext && (
                                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                                  <strong className="text-slate-900">Historical Precedent Note: </strong>
                                  {claim.historicalContext}
                                </div>
                              )}

                              <div className="space-y-2">
                                <div className="text-[11px] font-semibold text-slate-400">
                                  Official Verification Citations ({claim.sources.length})
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                  {claim.sources.map((src, idx) => (
                                    <SourceCitationCard key={idx} citation={src} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}

              {totalFilteredClaims === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs text-slate-500 font-medium">
                  No policies matched your search criteria. Try a different query or reset filters.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Next Step Transition Section: Contextual In-Flow CTA (No Sticky Bottom Bar) */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block">
              Next Step: Pillar 3
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Ready to begin preparation?
            </h3>
            <p className="text-xs text-slate-500 max-w-xl">
              Start with the free 4-stage foundational tech roadmap or explore personalized execution planning.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              to="/blueprints/b-cyber/roadmap"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs group"
            >
              <span>View Preparation Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/blueprints/b-cyber"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors text-center"
            >
              <span>Revisit Overview</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
