import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Calendar,
  GraduationCap,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface EligibilityState {
  hasPcm5Subjects: boolean | null;
  dobYear: number;
  category: 'general' | 'obc_ncl' | 'ews' | 'sc' | 'st' | 'pwd';
  gender: 'male' | 'female' | 'other';
  josaaStatus: 'never_admitted' | 'withdrew_before_final_round' | 'admitted_to_iit';
  isIndianNational: boolean | null;
}

const INITIAL_STATE: EligibilityState = {
  hasPcm5Subjects: null,
  dobYear: 2005,
  category: 'general',
  gender: 'male',
  josaaStatus: 'never_admitted',
  isIndianNational: null,
};

export const BCyberEligibilityScreener: React.FC = () => {
  const [state, setState] = useState<EligibilityState>(INITIAL_STATE);

  // Age calculation rule:
  // General/OBC/EWS: Born on or after Oct 1, 2001 (approx year >= 2001)
  // SC/ST/PwD: Born on or after Oct 1, 1996 (approx year >= 1996)
  const isReserved = state.category === 'sc' || state.category === 'st' || state.category === 'pwd';
  const cutoffYear = isReserved ? 1996 : 2001;
  const isAgeValid = state.dobYear >= cutoffYear;

  // JoSAA validity:
  const isJosaaValid = state.josaaStatus !== 'admitted_to_iit';

  // Academic validity:
  const isPcmValid = state.hasPcm5Subjects === true;

  // Citizenship:
  const isCitizenshipValid = state.isIndianNational === true;

  // Completed check:
  const isComplete =
    state.hasPcm5Subjects !== null && state.isIndianNational !== null;

  const isEligible =
    isComplete && isAgeValid && isJosaaValid && isPcmValid && isCitizenshipValid;

  // Fee calculation:
  // Female (all): ₹1,600
  // SC/ST/PwD: ₹1,600
  // Other: ₹3,200
  const applicationFee =
    state.gender === 'female' || isReserved ? '₹1,600' : '₹3,200';

  const resetForm = () => setState(INITIAL_STATE);

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-[11px] font-mono text-emerald-800 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive 30-Second Screener</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Eligibility &amp; Senate Ordinance Screener
          </h2>
          <p className="text-xs text-slate-500">
            Check your exact eligibility against confirmed IIT Kanpur Senate rules and JoSAA concurrent admission restrictions.
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

      <div className="p-5 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question 1: Academic Stream */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>1. Class 12th Academic Subjects</span>
              <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500">
              Must have taken Physics, Chemistry &amp; Mathematics (PCM) with at least 5 total subjects (CBSE, State Boards, or NIOS).
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
                <span className="text-[10px] text-slate-500 block mt-0.5">Includes NIOS</span>
              </button>
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, hasPcm5Subjects: false }))}
                className={cn(
                  'p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer',
                  state.hasPcm5Subjects === false
                    ? 'border-red-400 bg-red-50 text-red-950 font-semibold shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-white'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>Non-PCM / &lt;5 Subj</span>
                  {state.hasPcm5Subjects === false && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Ineligible (FAQ 21)</span>
              </button>
            </div>
          </div>

          {/* Question 2: Category & Age Cutoff */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>2. Category &amp; Birth Year</span>
              <span className="text-[10px] font-mono text-slate-500">Cutoff: {cutoffYear}</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'general', label: 'GEN' },
                  { id: 'obc_ncl', label: 'OBC-NCL' },
                  { id: 'ews', label: 'EWS' },
                  { id: 'sc', label: 'SC' },
                  { id: 'st', label: 'ST' },
                  { id: 'pwd', label: 'PwD' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, category: cat.id }))}
                  className={cn(
                    'py-1.5 px-2 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer',
                    state.category === cat.id
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                      : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-white'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="pt-1 flex items-center gap-2">
              <span className="text-xs text-slate-600 font-medium shrink-0">Year of Birth:</span>
              <select
                value={state.dobYear}
                onChange={(e) => setState((s) => ({ ...s, dobYear: Number(e.target.value) }))}
                className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-900 focus:outline-hidden focus:border-slate-900"
              >
                {[2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995].map(
                  (y) => (
                    <option key={y} value={y}>
                      {y} {y < cutoffYear ? '(Exceeds Age Limit)' : ''}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Question 3: JoSAA Prior Admission Restriction */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>3. Prior Admission at any IIT (JoSAA 2025 Rules)</span>
              <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500">
              IIT Kanpur enforces strict rules against candidates holding dual seats across IITs.
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: 'never_admitted',
                  label: 'Never Admitted to any IIT',
                  desc: 'Never accepted or reported for an IIT seat.',
                },
                {
                  id: 'withdrew_before_final_round',
                  label: 'Allocated but Withdrew / Never Reported',
                  desc: 'Seat allocated in JoSAA 2025 but withdrew before final round or never reported online.',
                },
                {
                  id: 'admitted_to_iit',
                  label: 'Admitted to an IIT Program',
                  desc: 'Joined an IIT academic program (even if later left or cancelled).',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, josaaStatus: opt.id as any }))}
                  className={cn(
                    'w-full p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer block',
                    state.josaaStatus === opt.id
                      ? opt.id === 'admitted_to_iit'
                        ? 'border-red-400 bg-red-50 text-red-950 font-semibold'
                        : 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:border-slate-300 hover:bg-white'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{opt.label}</span>
                    {state.josaaStatus === opt.id && (
                      opt.id === 'admitted_to_iit' ? (
                        <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Nationality & Gender for Fee */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>4. Nationality &amp; Gender (Fee Tier)</span>
              <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500">
              Only Indian nationals are eligible. Gender determines the application fee tier.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, isIndianNational: true }))}
                className={cn(
                  'p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer',
                  state.isIndianNational === true
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-white'
                )}
              >
                <span>Indian National</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Eligible</span>
              </button>
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, isIndianNational: false }))}
                className={cn(
                  'p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer',
                  state.isIndianNational === false
                    ? 'border-red-400 bg-red-50 text-red-950 font-semibold'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-white'
                )}
              >
                <span>Foreign / OCI</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Ineligible</span>
              </button>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <span className="text-xs text-slate-600 font-medium shrink-0">Candidate Gender:</span>
              <div className="grid grid-cols-3 gap-1 w-full">
                {(['male', 'female', 'other'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setState((s) => ({ ...s, gender: g }))}
                    className={cn(
                      'py-1 text-xs rounded-md border text-center capitalize transition-all cursor-pointer',
                      state.gender === g
                        ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Screener Verdict Ribbon */}
        <div
          className={cn(
            'rounded-xl border p-5 transition-all space-y-3',
            !isComplete
              ? 'border-slate-200 bg-slate-50/80 text-slate-700'
              : isEligible
              ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950 shadow-xs'
              : 'border-red-300 bg-red-50/50 text-red-950 shadow-xs'
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              {!isComplete ? (
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                  ?
                </div>
              ) : isEligible ? (
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
                  {!isComplete
                    ? 'Complete All 4 Questions to Generate Verification Verdict'
                    : isEligible
                    ? 'Eligible under Confirmed IIT Kanpur Senate Ordinances'
                    : 'Ineligibility Flag Detected based on Published Institute Rules'}
                </h3>
                <p className="text-xs text-slate-600">
                  {!isComplete
                    ? 'Select your options above to see verified admission eligibility.'
                    : isEligible
                    ? `You satisfy all mandatory academic, age, and JoSAA guidelines. Application fee: ${applicationFee} (Non-refundable).`
                    : 'Review the flagged restrictions below directly against published ordinances.'}
                </p>
              </div>
            </div>

            {isComplete && isEligible && (
              <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto pt-2 sm:pt-0">
                <div className="text-right">
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Applicable Fee</p>
                  <p className="text-base font-extrabold font-mono text-slate-900">{applicationFee}</p>
                </div>
                <div className="text-right pl-3 border-l border-emerald-200">
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Max Attempts</p>
                  <p className="text-xs font-bold text-slate-900">2 Consecutive</p>
                </div>
              </div>
            )}
          </div>

          {/* Specific Ineligibility Reason List */}
          {isComplete && !isEligible && (
            <div className="pt-3 border-t border-red-200/60 space-y-1.5 text-xs">
              {!isPcmValid && (
                <div className="flex items-center gap-2 text-red-900">
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>
                    <strong>Academic Requirement Failed:</strong> Class 12th Mathematics is strictly required with minimum 5 total subjects (FAQ 21).
                  </span>
                </div>
              )}
              {!isAgeValid && (
                <div className="flex items-center gap-2 text-red-900">
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>
                    <strong>Age Limit Exceeded:</strong> Candidates in your category must have been born on or after October 1, {cutoffYear}.
                  </span>
                </div>
              )}
              {!isJosaaValid && (
                <div className="flex items-center gap-2 text-red-900">
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>
                    <strong>Prior IIT Admission Restriction:</strong> Candidates already admitted to any IIT under JoSAA 2025 business rules are prohibited from reapplying.
                  </span>
                </div>
              )}
              {!isCitizenshipValid && (
                <div className="flex items-center gap-2 text-red-900">
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>
                    <strong>Citizenship Restriction:</strong> The B.Cyber program is restricted to Indian nationals only.
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
