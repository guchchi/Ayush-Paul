import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  History,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  FileText,
  XCircle,
  Clock,
  BookOpen,
} from 'lucide-react';
import { PARADIGM_SHIFT_COMPARISON } from '../../content/b-cyber/knowledge-base';
import { cn } from '../../lib/utils';

export const BCyberParadigmShiftCard: React.FC = () => {
  const [activeCycle, setActiveCycle] = useState<'both' | '2027_only' | '2026_only'>('both');

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden transition-all">
      {/* Top Banner / Callout */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-900">
              Crucial Strategic Pivot
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-medium">
              WSAIS FAQ 23
            </span>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-white/80 p-0.5 rounded-lg border border-amber-200/60 shadow-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveCycle('both')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer',
              activeCycle === 'both'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setActiveCycle('2027_only')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer',
              activeCycle === '2027_only'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            2027 Shift (New)
          </button>
          <button
            type="button"
            onClick={() => setActiveCycle('2026_only')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer',
              activeCycle === '2026_only'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            2026 Precedent
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Core Headline & FAQ 23 Quote */}
        <div className="max-w-3xl space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Admissions Architecture: 2026 Precedent vs. 2027 Confirmed Shift
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            IIT Kanpur has formally announced via WSAIS FAQ 23 that <strong>JEE Main is discontinued</strong> for future B.Cyber admissions. Aspirants must understand the difference between the 2026 inaugural precedent and upcoming 2027 regulations.
          </p>
        </div>

        {/* Verbatim Senate / FAQ Callout Block */}
        <div className="rounded-xl border border-amber-200/90 bg-amber-50/40 p-4 sm:p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 text-amber-800">
              <FileText className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-amber-950">Official Verbatim Text — IIT Kanpur WSAIS FAQ 23</span>
                <a
                  href="https://iitk.ac.in/wsais/b-cyber.php#faqCollapse23"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-amber-800 font-medium hover:underline"
                >
                  <span>Verify Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs sm:text-sm italic text-amber-950 leading-relaxed bg-white/70 p-3 rounded-lg border border-amber-200/60 shadow-xs">
                &ldquo;Will the same admission process be followed for future admissions? <strong>JEE Mains will not be used.</strong> A separate entrance test will be announced, the details of which will be made available soon.&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-900/80 pt-1 border-t border-amber-200/50">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              <strong>Rumor Alert:</strong> The official test syllabus, dates, and paper pattern have <em>not yet been announced</em>. Do not purchase speculative coaching material claiming to have the leaked 2027 syllabus.
            </span>
          </div>
        </div>

        {/* DUAL DISPLAY: Officially Announced vs. Not Yet Announced / Confirmed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-primary" />
              <span>2027 Status: Officially Announced vs. Not Yet Confirmed</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Epistemic Truth Filter</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box A: Officially Announced */}
            <div className="rounded-xl border border-emerald-300 bg-emerald-50/40 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h4 className="text-xs font-bold text-emerald-950">Officially Announced</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Confirmed by WSAIS
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-emerald-950">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <div>
                    <strong>JEE Main Discontinued:</strong> IIT Kanpur has officially stated that JEE Main scores will not be used for future selection rounds (FAQ 23).
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <div>
                    <strong>Separate Entrance Test Mandated:</strong> An independent dedicated entrance examination will be announced specifically for B.Cyber admissions.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <div>
                    <strong>Academic Baseline:</strong> Class 12 (or NIOS equivalent) with Physics, Chemistry, and Mathematics across minimum 5 subjects remains the statutory Senate prerequisite.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <div>
                    <strong>Nationality Restriction:</strong> Open exclusively to Indian nationals under Senate ordinances.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <div>
                    <strong>Participating Institutes:</strong> Joint undergraduate program across IIT Kanpur (WSAIS/C3iHub) and IIT Madras (CSE Dept).
                  </div>
                </li>
              </ul>
            </div>

            {/* Box B: Not Yet Announced / Pending Notice */}
            <div className="rounded-xl border border-amber-300 bg-amber-50/40 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <h4 className="text-xs font-bold text-amber-950">Not Yet Announced / Confirmed</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Pending Official Notice
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-amber-950">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">⏳</span>
                  <div>
                    <strong>Test Format &amp; Duration:</strong> Whether computer-based test (CBT) or written, single or multi-stage, question counts, and duration are <em>not yet confirmed</em>.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">⏳</span>
                  <div>
                    <strong>Official Syllabus &amp; Topics:</strong> The topic-wise syllabus and weightage (Math vs. CS vs. Logic) have <em>not yet been published</em>. Claims of "leaked syllabus" are baseless.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">⏳</span>
                  <div>
                    <strong>Exam Dates &amp; Registration Window:</strong> Application launch dates, testing dates, and admit card timelines have <em>not yet been announced</em>.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">⏳</span>
                  <div>
                    <strong>Selection Weights:</strong> Relative weightage between the entrance test score, FAQ 22 evidence, and on-campus hackathon is <em>not yet announced</em>.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">⏳</span>
                  <div>
                    <strong>Application Fees &amp; Quotas:</strong> 2027 fee schedule (2026 precedent was ₹1,600 / ₹3,200) and exact seat matrix by reservation category are <em>pending notice</em>.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Comparative Matrix (2026 Precedent vs. 2027 Shift) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 2026 Column */}
          {(activeCycle === 'both' || activeCycle === '2026_only') && (
            <div
              className={cn(
                'rounded-xl border p-5 space-y-4 transition-all',
                activeCycle === '2026_only' ? 'md:col-span-2' : '',
                'border-slate-200/90 bg-slate-50/70'
              )}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-800">2026 Inaugural Cycle (Observed Precedent)</h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-medium">
                  Historical Archive
                </span>
              </div>

              <div className="space-y-3">
                {PARADIGM_SHIFT_COMPARISON.map((item, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <span className="font-semibold text-slate-500 text-xs block">
                      {item.parameter}
                    </span>
                    <p className="text-slate-800 font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/70">
                      {item.cycle2026}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2027 Column */}
          {(activeCycle === 'both' || activeCycle === '2027_only') && (
            <div
              className={cn(
                'rounded-xl border p-5 space-y-4 transition-all',
                activeCycle === '2027_only' ? 'md:col-span-2' : '',
                'border-emerald-200 bg-emerald-50/30'
              )}
            >
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/80">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-emerald-950">2027 Admission Cycle (Confirmed Shift)</h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium border border-emerald-200">
                  Confirmed by FAQ 23
                </span>
              </div>

              <div className="space-y-3">
                {PARADIGM_SHIFT_COMPARISON.map((item, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <span className="font-semibold text-emerald-900/80 text-xs block">
                      {item.parameter}
                    </span>
                    <p
                      className={cn(
                        'leading-relaxed p-2.5 rounded-lg border font-medium',
                        item.isShift
                          ? 'bg-emerald-50/80 text-emerald-950 border-emerald-200 font-semibold'
                          : 'bg-white text-slate-800 border-slate-200/70'
                      )}
                    >
                      {item.cycle2027}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actionable Strategic Takeaway */}
        <div className="rounded-xl border border-slate-200 bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>What Should 2027 Aspirants Do Right Now?</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              1. Maintain Class 12 PCM passing readiness (mandatory baseline under Senate ordinances).<br />
              2. Develop foundational Discrete Math, logic, and systems thinking.<br />
              3. Build verifiable evidence of prior work (FAQ 22) through reproducible code and CTF problem-solving.
            </p>
          </div>
          <a
            href="https://iitk.ac.in/wsais/b-cyber.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-slate-900 text-xs font-semibold hover:bg-slate-100 transition-colors shrink-0 shadow-xs"
          >
            <span>Monitor WSAIS Notices</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
          </a>
        </div>
      </div>
    </div>
  );
};
