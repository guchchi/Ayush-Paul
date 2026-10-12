import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Calendar,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';
import { cn } from '../../lib/utils';

type AdmissionCycle = '2026_precedent' | '2027_upcoming';

interface EligibilityState {
  cycle: AdmissionCycle;
  hasPcm5Subjects: boolean | null;
  dobYear: number;
  category: 'general' | 'obc_ncl' | 'ews' | 'sc' | 'st' | 'pwd';
  gender: 'male' | 'female' | 'other';
  josaaStatus: 'never_admitted' | 'withdrew_before_final_round' | 'admitted_to_iit';
  isIndianNational: boolean | null;
}

const INITIAL_STATE: EligibilityState = {
  cycle: '2027_upcoming',
  hasPcm5Subjects: null,
  dobYear: 2005,
  category: 'general',
  gender: 'male',
  josaaStatus: 'never_admitted',
  isIndianNational: null,
};

export const BCyberEligibilityScreener: React.FC = () => {
  const [state, setState] = useState<EligibilityState>(INITIAL_STATE);

  // 2026 Age rule (Historical Precedent):
  // General/OBC/EWS: Born on or after Oct 1, 2001
  // SC/ST/PwD: Born on or after Oct 1, 1996
  const isReserved = state.category === 'sc' || state.category === 'st' || state.category === 'pwd';
  const cutoffYear2026 = isReserved ? 1996 : 2001;
  const isAgeValid2026 = state.dobYear >= cutoffYear2026;

  // JoSAA validity (2026 rule):
  const isJosaaValid = state.josaaStatus !== 'admitted_to_iit';

  // Academic validity (Senate statutory baseline):
  const isPcmValid = state.hasPcm5Subjects === true;

  // Citizenship (Statutory baseline):
  const isCitizenshipValid = state.isIndianNational === true;

  // Check if fundamental questions are answered:
  const isComplete =
    state.hasPcm5Subjects !== null && state.isIndianNational !== null;

  // 2026 Eligibility:
  const isEligible2026 =
    isComplete && isAgeValid2026 && isJosaaValid && isPcmValid && isCitizenshipValid;

  // Fee calculation (2026 Precedent only):
  const fee2026 =
    state.gender === 'female' || isReserved ? '₹1,600' : '₹3,200';

  const resetForm = () => setState(INITIAL_STATE);

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header with Cycle Selector */}
      <div className="border-b border-slate-100 bg-slate-50/70 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-sans text-slate-700 font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
              <span>Cycle-Aware Eligibility Screener</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Eligibility &amp; Senate Ordinance Screener
            </h2>
            <p className="text-xs text-slate-500">
              Check your background against confirmed Senate policies without treating past rules as confirmed 2027 mandates.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors self-start sm:self-auto shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Inputs</span>
          </button>
        </div>

        {/* Cycle Toggle Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-700">Admission Cycle:</span>
          <div className="inline-flex rounded-xl p-1 bg-slate-200/70 border border-slate-300/60 max-w-fit">
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, cycle: '2027_upcoming' }))}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                state.cycle === '2027_upcoming'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                <span>2027 Upcoming Cycle (Future)</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, cycle: '2026_precedent' }))}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                state.cycle === '2026_precedent'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <span>2026 Inaugural Cycle (Historical Precedent)</span>
            </button>
          </div>
        </div>

        {/* Cycle Context Notice Banner */}
        {state.cycle === '2027_upcoming' ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">2027 Status: Official Selection Criteria Pending Announcement</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                WSAIS FAQ 23 confirms that <strong>JEE Main is discontinued</strong> for future cycles and a separate test will be announced. However, exact 2027 cutoff dates, quotas, and application details have not yet been published by IIT Kanpur. This screener provides <em>provisional baseline guidance</em>, not a confirmed 2027 decision.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-3 text-xs text-slate-700 flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">2026 Precedent Mode: Verified Historical Guidelines</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Evaluating against verified conditions from the inaugural 2026 admission cycle (FAQ 21, 24, 25). These criteria serve as precedent and are not guaranteed to remain identical for 2027.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question 1: Academic Stream */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>1. Class 12th Academic Subjects</span>
              <span className="text-red-500">*</span>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                Official Senate Requirement
              </span>
            </label>
            <p className="text-[11px] text-slate-500">
              Must have passed Class 12 (or NIOS equivalent) with Physics, Chemistry &amp; Mathematics (PCM) across at least 5 subjects (FAQ 21).
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, hasPcm5Subjects: true }))}
                className={cn(
                  'p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer',
                  state.hasPcm5Subjects === true
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-white'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>PCM (5 Subjects)</span>
                  {state.hasPcm5Subjects === true && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, hasPcm5Subjects: false }))}
                className={cn(
                  'p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer',
                  state.hasPcm5Subjects === false
                    ? 'border-red-400 bg-red-50/80 text-red-950 font-semibold shadow-xs ring-1 ring-red-400/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-white'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>No Math / &lt;5 Subjects</span>
                  {state.hasPcm5Subjects === false && <XCircle className="w-3.5 h-3.5 text-red-600" />}
                </div>
              </button>
            </div>
          </div>

          {/* Question 2: Year of Birth */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>2. Year of Birth</span>
              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {state.cycle === '2026_precedent' ? '2026 Precedent' : 'Subject to 2027 Notice'}
              </span>
            </label>
            <p className="text-[11px] text-slate-500">
              {state.cycle === '2026_precedent'
                ? `2026 cutoff: Born on or after Oct 1, ${cutoffYear2026} (${isReserved ? 'SC/ST/PwD' : 'General/OBC/EWS'}).`
                : 'Exact cutoff birth date for the 2027 cycle will be declared in the official 2027 notification.'}
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1994"
                max="2010"
                value={state.dobYear}
                onChange={(e) => setState((s) => ({ ...s, dobYear: parseInt(e.target.value, 10) }))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <span className="px-3 py-1 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-900 text-xs shrink-0 min-w-[56px] text-center">
                {state.dobYear}
              </span>
            </div>
          </div>

          {/* Question 3: Category */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>3. Candidate Category</span>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                Statutory Reservation
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'general', label: 'General' },
                { id: 'obc_ncl', label: 'OBC-NCL' },
                { id: 'ews', label: 'GEN-EWS' },
                { id: 'sc', label: 'SC' },
                { id: 'st', label: 'ST' },
                { id: 'pwd', label: 'PwD' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, category: cat.id as any }))}
                  className={cn(
                    'p-2 rounded-lg border text-xs text-center transition-all cursor-pointer font-medium',
                    state.category === cat.id
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Prior JoSAA Status */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>4. Prior IIT Admission (JoSAA Record)</span>
              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                IIT Council Policy
              </span>
            </label>
            <div className="space-y-2">
              {[
                { id: 'never_admitted', label: 'Never Admitted to any IIT' },
                { id: 'withdrew_before_final_round', label: 'Allocated seat but withdrew before final round' },
                { id: 'admitted_to_iit', label: 'Formally admitted / accepted seat in an IIT' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, josaaStatus: opt.id as any }))}
                  className={cn(
                    'w-full p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between',
                    state.josaaStatus === opt.id
                      ? 'border-slate-900 bg-slate-900 text-white font-medium'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <span>{opt.label}</span>
                  {state.josaaStatus === opt.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#d1f34d]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 5: Citizenship */}
          <div className="space-y-2.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>5. Nationality</span>
              <span className="text-red-500">*</span>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                Official Senate Requirement
              </span>
            </label>
            <p className="text-[11px] text-slate-500">
              Under Senate ordinances, the B.Cyber program is open exclusively to Indian nationals.
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-md">
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, isIndianNational: true }))}
                className={cn(
                  'p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer',
                  state.isIndianNational === true
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-white'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>Indian National</span>
                  {state.isIndianNational === true && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, isIndianNational: false }))}
                className={cn(
                  'p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer',
                  state.isIndianNational === false
                    ? 'border-red-400 bg-red-50/80 text-red-950 font-semibold ring-1 ring-red-400/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-white'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>OCI / Foreign National</span>
                  {state.isIndianNational === false && <XCircle className="w-3.5 h-3.5 text-red-600" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Live Screener Verdict Ribbon */}
        <div
          className={cn(
            'rounded-xl border p-5 transition-all space-y-3',
            !isComplete
              ? 'border-slate-200 bg-slate-50/80 text-slate-700'
              : state.cycle === '2027_upcoming'
              ? !isPcmValid || !isCitizenshipValid || !isJosaaValid
                ? 'border-red-300 bg-red-50/50 text-red-950'
                : 'border-amber-300 bg-amber-50/50 text-amber-950'
              : isEligible2026
              ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950'
              : 'border-red-300 bg-red-50/50 text-red-950'
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              {!isComplete ? (
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                  ?
                </div>
              ) : state.cycle === '2027_upcoming' ? (
                !isPcmValid || !isCitizenshipValid || !isJosaaValid ? (
                  <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-300 flex items-center justify-center text-red-700 shrink-0">
                    <XCircle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                )
              ) : isEligible2026 ? (
                <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-300 flex items-center justify-center text-red-700 shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold">
                  {!isComplete ? (
                    'Select Mandatory Questions (PCM & Nationality) to View Status'
                  ) : state.cycle === '2027_upcoming' ? (
                    !isPcmValid || !isCitizenshipValid || !isJosaaValid ? (
                      'Provisional Ineligibility: Core Statutory Requirements Not Satisfied'
                    ) : (
                      '2027 Eligibility Rules Not Yet Confirmed by IIT Kanpur Senate'
                    )
                  ) : isEligible2026 ? (
                    'Potentially Eligible under 2026 Precedent Rules'
                  ) : (
                    'Ineligible based on 2026 Published Institute Criteria'
                  )}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {!isComplete ? (
                    'Answer all questions above to generate provisional guidance.'
                  ) : state.cycle === '2027_upcoming' ? (
                    !isPcmValid || !isCitizenshipValid || !isJosaaValid ? (
                      'Class 12 PCM (5 subjects) and Indian nationality are foundational Senate requirements unlikely to change.'
                    ) : (
                      'You satisfy core baseline prerequisites (PCM & Indian nationality). Official 2027 birth-date cutoff, application fees, attempt limits, and entrance test dates will be confirmed by IIT Kanpur in the upcoming official notification.'
                    )
                  ) : isEligible2026 ? (
                    `Satisfies verified 2026 criteria (FAQ 21, 24). Historical fee: ${fee2026} (FAQ 25, non-refundable). Attempt rule: Max 2 consecutive attempts (FAQ 21).`
                  ) : (
                    'Flagged restrictions violate published 2026 criteria (FAQ 21, 24, 25).'
                  )}
                </p>
              </div>
            </div>

            {isComplete && state.cycle === '2026_precedent' && isEligible2026 && (
              <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto pt-2 sm:pt-0">
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">2026 Fee Precedent (FAQ 25)</p>
                  <p className="text-base font-extrabold text-slate-900">{fee2026}</p>
                </div>
              </div>
            )}

            {isComplete && state.cycle === '2027_upcoming' && (
              <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto pt-2 sm:pt-0">
                <div className="text-right">
                  <p className="text-[10px] text-amber-700 font-semibold uppercase">2027 Fees &amp; Quotas</p>
                  <p className="text-xs font-bold text-amber-900">Pending Notice</p>
                </div>
              </div>
            )}
          </div>

          {/* Specific Flag Details */}
          {isComplete && (!isPcmValid || !isCitizenshipValid || !isJosaaValid || (state.cycle === '2026_precedent' && !isAgeValid2026)) && (
            <div className="pt-3 border-t border-slate-200/80 space-y-1.5 text-xs">
              {!isPcmValid && (
                <div className="flex items-center gap-2 text-red-900">
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>
                    <strong>Academic Requirement:</strong> Class 12th Mathematics is strictly mandatory with minimum 5 total subjects (FAQ 21).
                  </span>
                </div>
              )}
              {!isCitizenshipValid && (
                <div className="flex items-center gap-2 text-red-900">
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>
                    <strong>Citizenship Restriction:</strong> The degree is restricted to Indian nationals under Senate ordinances.
                  </span>
                </div>
              )}
              {!isJosaaValid && (
                <div className="flex items-center gap-2 text-red-900">
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>
                    <strong>Prior IIT Admission Restriction:</strong> Candidates already admitted to any IIT under JoSAA are prohibited from reapplying.
                  </span>
                </div>
              )}
              {state.cycle === '2026_precedent' && !isAgeValid2026 && (
                <div className="flex items-center gap-2 text-red-900">
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>
                    <strong>2026 Age Precedent Exceeded:</strong> In 2026, candidates in your category were required to be born on or after Oct 1, {cutoffYear2026}.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
