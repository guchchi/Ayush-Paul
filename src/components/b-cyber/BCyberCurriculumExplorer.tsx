import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Award,
  Shield,
  Layers,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Cpu,
  CheckCircle2,
  Clock,
  Ban,
} from 'lucide-react';
import {
  CURRICULUM_DATA,
  SENATE_EXIT_OPTIONS,
  INSTITUTIONAL_CREDENTIALS,
} from '../../content/b-cyber/knowledge-base';
import { cn } from '../../lib/utils';

export const BCyberCurriculumExplorer: React.FC = () => {
  const [selectedSemIdx, setSelectedSemIdx] = useState<number>(0);

  const activeSemester = CURRICULUM_DATA[selectedSemIdx];

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 p-5 sm:p-6 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-xs text-sky-800 font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
            <span>Senate-Approved Credit Architecture</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Total Credits: ~365+ Credits | Normal Duration: 4 Years
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          The 2+2 Academic Model &amp; Detailed Curriculum Breakdown
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Unlike conventional computer science degrees, B.Cyber incorporates <strong>5 dedicated hands-on security laboratories</strong> during the first 2 years on campus, followed by <strong>2 full years of field deployment</strong> at selected government and defense agencies.
        </p>
      </div>

      <div className="p-5 sm:p-8 space-y-8">
        {/* Visual 2+2 Model Timeline Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Block 1: Campus Coursework */}
          <div className="rounded-xl border border-sky-200 bg-sky-50/30 p-4 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-900">
                Phase 1: Campus Foundation (Years 1 &amp; 2)
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900">
                Semesters 1 to 4
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Intensive theoretical coursework, systems programming, and 5 specialized practical labs on IIT Kanpur / IIT Madras campus.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Malware Lab (8cr)', 'Forensics Lab (8cr)', 'Cloud Security (8cr)', 'VAPT Lab (8cr)', 'Web Security (8cr)'].map(
                (lab, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-white border border-sky-200/80 text-sky-900 font-medium"
                  >
                    {lab}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Block 2: Field Deployment */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-900">
                Phase 2: Field Deployment (Years 3 &amp; 4)
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900">
                Semesters 5 to 8 (216 Cr)
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Stationed primarily at selected government organizations, defense units, CERT-In, NCIIPC, or critical national infrastructure.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-indigo-900/90 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                Regular IIT Student Status
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                Stipend Paid by Host Units
              </span>
            </div>
          </div>
        </div>

        {/* Semester-by-Semester Interactive Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Select Semester to Inspect Exact Courses</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {activeSemester.totalCredits}
            </span>
          </div>

          {/* Semester Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {CURRICULUM_DATA.map((sem, idx) => (
              <button
                key={sem.semesterNumber}
                type="button"
                onClick={() => setSelectedSemIdx(idx)}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer text-left shrink-0',
                  selectedSemIdx === idx
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                )}
              >
                <div className="text-[11px] font-medium opacity-80">
                  {sem.semesterNumber === 5 ? 'Sem 5–8' : `Sem ${sem.semesterNumber}`}
                </div>
                <div className="text-xs font-bold">
                  {sem.semesterNumber === 5 ? 'Internship' : `Semester ${sem.semesterNumber}`}
                </div>
              </button>
            ))}
          </div>

          {/* Active Semester Course Matrix */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-3 border-b border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{activeSemester.title}</h4>
                <p className="text-xs text-slate-500">{activeSemester.description}</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 self-start sm:self-auto">
                {activeSemester.totalCredits}
              </span>
            </div>

            {/* Courses List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeSemester.courses.map((course, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-200/80 bg-white p-3.5 space-y-1.5 hover:border-slate-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-xs text-slate-900 leading-snug">
                      {course.name}
                    </span>
                    <span
                      className={cn(
                        'text-[11px] px-2.5 py-0.5 rounded-full font-medium shrink-0',
                        course.type === 'lab'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : course.type === 'core'
                          ? 'bg-slate-100 text-slate-800 border border-slate-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      )}
                    >
                      {course.credits} cr
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {course.focus}
                  </p>

                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <span className="capitalize">{course.type} Subject</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Senate Exit Options & Duration Ordinances */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-slate-500" />
              <span>Senate Exit Options &amp; Program Duration</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Max Permissible: 6 Years</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SENATE_EXIT_OPTIONS.map((opt, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {opt.creditsRequired === 365 ? 'All 4 Years' : `${opt.creditsRequired} Credits`}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{opt.status}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{opt.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{opt.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Policy Safeguard Alerts (No branch change & Time Extensions) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Rule 1: Branch Transfer Ban */}
            <div className="rounded-xl border border-red-200/80 bg-red-50/30 p-3.5 flex items-start gap-3 text-xs">
              <Ban className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-red-950 block">Strict No-Branch-Change Ordinance (FAQ 12)</span>
                <p className="text-[11px] text-red-900/90 leading-relaxed">
                  B.Cyber students cannot transfer to regular B.Tech programs, and B.Tech students cannot switch into B.Cyber without qualifying the dedicated entrance examination.
                </p>
              </div>
            </div>

            {/* Rule 2: Extension Limits */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 flex items-start gap-3 text-xs">
              <Clock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">Maximum Coursework Extension Rules</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  An extension of at most 1 year is permissible in coursework (Years 1 &amp; 2), and at most 1 year in field internship (Years 3 &amp; 4). Total program duration must not exceed 6 years.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
