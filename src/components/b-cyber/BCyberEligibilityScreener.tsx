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
  Copy,
  Check,
  ArrowRight,
  Terminal,
  FileCheck,
  Zap,
  SlidersHorizontal,
  BookmarkCheck,
} from 'lucide-react';
import { cn } from '../../lib/utils';

type AdmissionCycle = '2027_upcoming' | '2026_precedent';

type TechnicalPoWStatus = 'verifiable_projects' | 'in_progress' | 'none';

interface EligibilityState {
  cycle: AdmissionCycle;
  hasPcm5Subjects: boolean | null;
  isNiosCandidate: boolean;
  hasTechnicalPoW: TechnicalPoWStatus | null;
  dobYear: number;
  category: 'general' | 'obc_ncl' | 'ews' | 'sc' | 'st' | 'pwd';
  gender: 'male' | 'female' | 'other';
  josaaStatus: 'never_admitted' | 'withdrew_before_final_round' | 'admitted_to_iit';
  isIndianNational: boolean | null;
}

const INITIAL_STATE: EligibilityState = {
  cycle: '2027_upcoming',
  hasPcm5Subjects: null,
  isNiosCandidate: false,
  hasTechnicalPoW: null,
  dobYear: 2006,
  category: 'general',
  gender: 'male',
  josaaStatus: 'never_admitted',
  isIndianNational: null,
};

export const BCyberEligibilityScreener: React.FC = () => {
  const [state, setState] = useState<EligibilityState>(INITIAL_STATE);
  const [copied, setCopied] = useState(false);

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
    state.hasPcm5Subjects !== null &&
    state.isIndianNational !== null &&
    state.hasTechnicalPoW !== null;

  // 2026 Full Eligibility:
  const isEligible2026 =
    isComplete && isAgeValid2026 && isJosaaValid && isPcmValid && isCitizenshipValid;

  // Fee calculation (2026 Precedent only):
  const fee2026 =
    state.gender === 'female' || isReserved ? '₹1,600' : '₹3,200';

  const resetForm = () => setState(INITIAL_STATE);

  // Presets for quick evaluation
  const applyPreset = (preset: 'cbse' | 'nios' | 'dropper') => {
    if (preset === 'cbse') {
      setState({
        cycle: '2027_upcoming',
        hasPcm5Subjects: true,
        isNiosCandidate: false,
        hasTechnicalPoW: 'verifiable_projects',
        dobYear: 2007,
        category: 'general',
        gender: 'male',
        josaaStatus: 'never_admitted',
        isIndianNational: true,
      });
    } else if (preset === 'nios') {
      setState({
        cycle: '2027_upcoming',
        hasPcm5Subjects: true,
        isNiosCandidate: true,
        hasTechnicalPoW: 'in_progress',
        dobYear: 2006,
        category: 'obc_ncl',
        gender: 'male',
        josaaStatus: 'never_admitted',
        isIndianNational: true,
      });
    } else if (preset === 'dropper') {
      setState({
        cycle: '2027_upcoming',
        hasPcm5Subjects: true,
        isNiosCandidate: false,
        hasTechnicalPoW: 'verifiable_projects',
        dobYear: 2005,
        category: 'ews',
        gender: 'female',
        josaaStatus: 'withdrew_before_final_round',
        isIndianNational: true,
      });
    }
  };

  const copySummaryReport = () => {
    const reportText = `[IIT Kanpur B.Cyber Admission Eligibility Assessment]
- Admission Cycle Evaluated: ${state.cycle === '2027_upcoming' ? '2027 Upcoming Shift' : '2026 Historical Precedent'}
- Academic Eligibility: ${state.hasPcm5Subjects ? 'Pass Class 12 PCM (5 Subjects)' : 'Ineligible'} ${state.isNiosCandidate ? '(NIOS Candidate)' : ''}
- Technical Proof-of-Work (FAQ 22): ${state.hasTechnicalPoW === 'verifiable_projects' ? 'High Signal (GitHub/CTF repos available)' : state.hasTechnicalPoW === 'in_progress' ? 'In Progress' : 'No verifiable code yet'}
- Category: ${state.category.toUpperCase()} | Year of Birth: ${state.dobYear}
- Prior IIT JoSAA Status: ${state.josaaStatus === 'never_admitted' ? 'Clean (Never admitted)' : state.josaaStatus === 'withdrew_before_final_round' ? 'Eligible (Withdrew before final round)' : 'Barred (Previously accepted IIT seat)'}
- Nationality: ${state.isIndianNational ? 'Indian Citizen (Eligible)' : 'Foreign/OCI (Ineligible)'}
- Senate Ordinance Verdict: ${
      !isComplete
        ? 'Incomplete'
        : !isPcmValid || !isCitizenshipValid || !isJosaaValid
        ? 'Ineligible under Senate Ordinances'
        : state.hasTechnicalPoW === 'none'
        ? 'Conditionally Eligible (Must build FAQ 22 Dossier)'
        : 'Eligible for Selection Screening'
    }
- Generated via B.Cyber Compass (Official Senate Data: WSAIS FAQ 21, 22, 23)`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full rounded-3xl border border-[#c2c6d6]/35 bg-white shadow-xs overflow-hidden">
      {/* Header with Cycle Selector & Quick Presets */}
      <div className="border-b border-slate-100 bg-[#fafbfc] p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs text-[#0058be] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Interactive Decision Screener</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0b1c30]">
              Eligibility &amp; Senate Ordinance Screener
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Evaluate your exact profile against confirmed IIT Kanpur Senate criteria without misleading percentage scores or commercial bias.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors self-start sm:self-auto shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>

        {/* Quick Candidate Profile Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Quick Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('cbse')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200/80 text-slate-700 hover:border-[#0058be] hover:text-[#0058be] transition-colors shadow-2xs cursor-pointer"
          >
            Standard CBSE PCM + GitHub
          </button>
          <button
            type="button"
            onClick={() => applyPreset('nios')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200/80 text-slate-700 hover:border-[#0058be] hover:text-[#0058be] transition-colors shadow-2xs cursor-pointer"
          >
            NIOS Open Schooling Candidate
          </button>
          <button
            type="button"
            onClick={() => applyPreset('dropper')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200/80 text-slate-700 hover:border-[#0058be] hover:text-[#0058be] transition-colors shadow-2xs cursor-pointer"
          >
            Gap Year / Repeater Profile
          </button>
        </div>

        {/* Cycle Toggle Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-700 shrink-0">Evaluation Cycle:</span>
          <div className="inline-flex rounded-xl p-1 bg-slate-200/60 border border-slate-300/60 max-w-fit">
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, cycle: '2027_upcoming' }))}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                state.cycle === '2027_upcoming'
                  ? 'bg-white text-[#0058be] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                <span>2027 Upcoming Cycle (Dedicated Test)</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, cycle: '2026_precedent' }))}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                state.cycle === '2026_precedent'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <span>2026 Inaugural Cycle (Historical Precedent)</span>
            </button>
          </div>
        </div>

        {/* Cycle Context Notice Banner */}
        {state.cycle === '2027_upcoming' ? (
          <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-3.5 text-xs text-blue-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#0058be] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">2027 Focus: Dedicated IITK Test (JEE Main Discontinued)</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Official WSAIS FAQ 23 confirms that <strong>JEE Main is permanently discontinued</strong>. Evaluation will be based on IIT Kanpur&apos;s dedicated entrance test, technical proof-of-work (FAQ 22), and the hands-on lab hackathon.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-3.5 text-xs text-slate-700 flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">2026 Historical Benchmark Mode</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Evaluating against observed criteria from the completed July 2026 cycle (FAQ 21, 24, 25). These criteria serve as precedent and establish baseline standards.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Questions Grid */}
      <div className="p-5 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question 1: Academic Stream & NIOS */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>1. Class 12 Academic Subjects (PCM)</span>
              <span className="text-red-500">*</span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Senate Mandatory
              </span>
            </label>
            <p className="text-[11px] text-slate-500">
              Must pass Class 12 with Physics, Chemistry &amp; Mathematics across minimum 5 subjects (FAQ 21). NIOS accepted.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, hasPcm5Subjects: true }))}
                className={cn(
                  'p-3 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer',
                  state.hasPcm5Subjects === true
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 shadow-2xs ring-1 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-white'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>PCM (5 Subjects)</span>
                  {state.hasPcm5Subjects === true && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, hasPcm5Subjects: false }))}
                className={cn(
                  'p-3 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer',
                  state.hasPcm5Subjects === false
                    ? 'border-red-400 bg-red-50/80 text-red-950 shadow-2xs ring-1 ring-red-400/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-white'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>No Math / &lt;5 Subj</span>
                  {state.hasPcm5Subjects === false && <XCircle className="w-4 h-4 text-red-600" />}
                </div>
              </button>
            </div>

            {/* NIOS Secondary Toggle */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={state.isNiosCandidate}
                  onChange={(e) => setState((s) => ({ ...s, isNiosCandidate: e.target.checked }))}
                  className="rounded border-slate-300 text-[#0058be] focus:ring-[#0058be] w-3.5 h-3.5"
                />
                <span>I completed / am appearing through NIOS (National Institute of Open Schooling)</span>
              </label>
            </div>
          </div>

          {/* Question 2: Technical Proof of Work (FAQ 22) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>2. Prior Technical Proof-of-Work</span>
              <span className="text-red-500">*</span>
              <span className="text-[10px] font-semibold text-[#0058be] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                WSAIS FAQ 22
              </span>
            </label>
            <p className="text-[11px] text-slate-500">
              Verifiable computing or cybersecurity evidence (GitHub repositories, CTF achievements, CVEs, or tools).
            </p>
            <div className="space-y-2">
              {[
                {
                  id: 'verifiable_projects',
                  label: 'Verifiable Code / CTF Profile',
                  sub: 'Public GitHub repos, reproducible setups, CTF handles',
                  badge: 'High Signal',
                },
                {
                  id: 'in_progress',
                  label: 'Work In Progress / Learning',
                  sub: 'Currently building projects; no public repo yet',
                  badge: 'Needs Build',
                },
                {
                  id: 'none',
                  label: 'No Prior Code / Only Coaching',
                  sub: 'Relying solely on entrance test preparation',
                  badge: 'Disqualifying Risk',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, hasTechnicalPoW: opt.id as TechnicalPoWStatus }))}
                  className={cn(
                    'w-full p-2.5 rounded-2xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between',
                    state.hasTechnicalPoW === opt.id
                      ? 'border-[#0058be] bg-blue-50/60 text-slate-900 font-semibold ring-1 ring-[#0058be]/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <div>
                    <span className="block font-bold text-slate-900">{opt.label}</span>
                    <span className="text-[11px] text-slate-500 font-normal">{opt.sub}</span>
                  </div>
                  <span className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-2',
                    opt.badge === 'High Signal' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : opt.badge === 'Needs Build' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-red-50 text-red-800 border border-red-200'
                  )}>
                    {opt.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Year of Birth */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>3. Year of Birth</span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {state.cycle === '2026_precedent' ? '2026 Precedent' : '2027 Pending Notice'}
                </span>
              </label>
              <span className="px-2.5 py-0.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-900 text-xs">
                {state.dobYear}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {state.cycle === '2026_precedent'
                ? `2026 cutoff: Born on or after Oct 1, ${cutoffYear2026} (${isReserved ? 'SC/ST/PwD 5-yr relaxation' : 'General/OBC/EWS'}).`
                : 'Exact cutoff date for 2027 will be declared in the formal admission notification.'}
            </p>
            <input
              type="range"
              min="1995"
              max="2010"
              value={state.dobYear}
              onChange={(e) => setState((s) => ({ ...s, dobYear: parseInt(e.target.value, 10) }))}
              className="w-full accent-[#0058be] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1995</span>
              <span>2001 (2026 Cutoff)</span>
              <span>2006</span>
              <span>2010</span>
            </div>
          </div>

          {/* Question 4: Statutory Category */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>4. Statutory Quota Category</span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                GoI Reservation
              </span>
            </label>
            <p className="text-[11px] text-slate-500">
              Central Government category certificates required during verification.
            </p>
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
                    'p-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer font-semibold',
                    state.category === cat.id
                      ? 'border-[#0b1c30] bg-[#0b1c30] text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 5: Prior JoSAA Status */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>5. Prior IIT Enrolment (JoSAA Boundary)</span>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                WSAIS FAQ 21 §3
              </span>
            </label>
            <div className="space-y-2">
              {[
                { id: 'never_admitted', label: 'Never Admitted to any IIT' },
                { id: 'withdrew_before_final_round', label: 'Allocated seat but withdrew before final round' },
                { id: 'admitted_to_iit', label: 'Formally admitted / accepted an IIT seat previously' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, josaaStatus: opt.id as any }))}
                  className={cn(
                    'w-full p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between',
                    state.josaaStatus === opt.id
                      ? 'border-[#0b1c30] bg-[#0b1c30] text-white font-medium'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <span>{opt.label}</span>
                  {state.josaaStatus === opt.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#d1f34d]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Question 6: Nationality */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>6. Citizenship &amp; Nationality</span>
              <span className="text-red-500">*</span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Senate Ordinance
              </span>
            </label>
            <p className="text-[11px] text-slate-500">
              The B.Cyber degree is open exclusively to Indian citizens. Foreign / OCI candidates are not eligible.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, isIndianNational: true }))}
                className={cn(
                  'p-3 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer',
                  state.isIndianNational === true
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-1 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-white'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>Indian National</span>
                  {state.isIndianNational === true && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, isIndianNational: false }))}
                className={cn(
                  'p-3 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer',
                  state.isIndianNational === false
                    ? 'border-red-400 bg-red-50/80 text-red-950 ring-1 ring-red-400/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-white'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>OCI / Foreign National</span>
                  {state.isIndianNational === false && <XCircle className="w-4 h-4 text-red-600" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Verdict Card 2.0 */}
        <div
          className={cn(
            'rounded-3xl border p-6 sm:p-7 transition-all space-y-5',
            !isComplete
              ? 'border-slate-200 bg-slate-50/80 text-slate-700'
              : !isPcmValid || !isCitizenshipValid || !isJosaaValid
              ? 'border-red-300 bg-red-50/40 text-red-950'
              : state.hasTechnicalPoW === 'none'
              ? 'border-amber-300 bg-amber-50/50 text-amber-950'
              : 'border-emerald-300 bg-emerald-50/40 text-emerald-950'
          )}
        >
          {/* Verdict Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/70">
            <div className="flex items-start gap-3.5">
              {!isComplete ? (
                <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  ?
                </div>
              ) : !isPcmValid || !isCitizenshipValid || !isJosaaValid ? (
                <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-300 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                  <XCircle className="w-5 h-5" />
                </div>
              ) : state.hasTechnicalPoW === 'none' ? (
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  INSTITUTIONAL ASSESSMENT VERDICT
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {!isComplete
                    ? 'Complete All Mandatory Questions (PCM, PoW, Citizenship) Above'
                    : !isPcmValid || !isCitizenshipValid || !isJosaaValid
                    ? 'Ineligible Under Mandatory Senate Ordinances'
                    : state.hasTechnicalPoW === 'none'
                    ? 'Conditionally Eligible Baseline — Technical PoW (FAQ 22) Missing'
                    : 'Statutory Eligibility Confirmed — Ready for 2027 Entrance Track'}
                </h3>
              </div>
            </div>

            {/* Copy Report Action Button */}
            {isComplete && (
              <button
                type="button"
                onClick={copySummaryReport}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-slate-500" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Assessment Report'}</span>
              </button>
            )}
          </div>

          {/* 3 Personalized Action Points */}
          {isComplete && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  1. Academic Baseline
                </span>
                <span className="font-bold text-slate-900 block">
                  {isPcmValid ? 'Class 12 PCM Satisfied' : 'Ineligible (PCM Missing)'}
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {state.isNiosCandidate
                    ? 'Your NIOS marksheet is valid provided it contains PCM across at least 5 distinct subjects (FAQ 21).'
                    : isPcmValid
                    ? 'You meet the 5-subject PCM criterion under Senate ordinances.'
                    : 'Without Class 12 Mathematics and 5 subjects, admission is strictly barred.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  2. Entrance Strategy
                </span>
                <span className="font-bold text-slate-900 block">
                  Dedicated IITK Test Prep
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Do not rely on JEE Main ranks for 2027. WSAIS FAQ 23 confirms a separate test. Focus on programming, systems, and foundational math.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  3. Technical Dossier (FAQ 22)
                </span>
                <span className="font-bold text-slate-900 block">
                  {state.hasTechnicalPoW === 'verifiable_projects'
                    ? 'High-Signal Portfolio'
                    : state.hasTechnicalPoW === 'in_progress'
                    ? 'Publish Repositories with README'
                    : 'Action Needed: Build Code'}
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {state.hasTechnicalPoW === 'verifiable_projects'
                    ? 'Ensure repositories have clear reproducibility steps, clean commits, and no tutorial plagiarism.'
                    : 'Without verifiable technical proof-of-work, candidates are screened out prior to the hackathon.'}
                </p>
              </div>
            </div>
          )}

          {/* Quick Boundary Alerts If Ineligible */}
          {isComplete && (!isPcmValid || !isCitizenshipValid || !isJosaaValid) && (
            <div className="p-3.5 rounded-2xl bg-red-100/70 border border-red-200 text-xs text-red-900 space-y-1">
              <span className="font-bold block">Disqualification Clauses Triggered:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {!isPcmValid && <li>Lacks Class 12 PCM with minimum 5 subjects (WSAIS FAQ 21).</li>}
                {!isCitizenshipValid && <li>Degree is restricted to Indian citizens under Senate regulations.</li>}
                {!isJosaaValid && <li>Candidates who previously accepted an IIT seat under JoSAA are ineligible (FAQ 21 §3).</li>}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
