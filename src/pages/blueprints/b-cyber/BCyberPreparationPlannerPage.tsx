import React, { useState } from 'react';
import {
  CalendarCheck,
  RotateCcw,
  Clock,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  ArrowRight,
  Info,
  Calendar,
  Check,
  Filter,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  HeartPulse,
  Link2,
  Sparkles,
  Award,
} from 'lucide-react';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { TrustBadge } from '../../../components/b-cyber/TrustBadge';
import { useBCyberPlannerStore, PlannerTab } from '../../../lib/b-cyber-compass/store';
import { resourcesCatalog } from '../../../content/b-cyber';
import { useSEO } from '../../../hooks/useSEO';
import { getCanonicalUrl } from '../../../lib/domain';
import { cn } from '../../../lib/utils';
import type {
  PrepPathway,
  AcademicStage,
  TechnicalBaseline,
  PrimaryGoal,
  TargetTimeline,
  PlanItemCategory,
  PlanTaskItem,
} from '../../../types/b-cyber-compass';

const CATEGORY_STYLES: Record<
  PlanItemCategory,
  { label: string; badgeClass: string; borderClass: string }
> = {
  confirmed_admission_requirement: {
    label: 'Category A: Official Admission Rule',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    borderClass: 'border-l-2 border-l-emerald-500',
  },
  independent_provisional_prep: {
    label: 'Category B: Foundational Logic / Math',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
    borderClass: 'border-l-2 border-l-indigo-500',
  },
  published_evidence_alignment: {
    label: 'Category C: FAQ 22 Evidence of Work',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
    borderClass: 'border-l-2 border-l-amber-500',
  },
  technical_skill_development: {
    label: 'Independent Technical Lab',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    borderClass: 'border-l-2 border-l-slate-400',
  },
};

interface GapAnalysisResult {
  criticalGap: string;
  strategicRule: string;
  ruleType: 'Protection Rule' | 'Leverage Rule' | 'Fast-Track Rule';
  timeSplit: string;
  rejectionTrap: string;
  standoutAdvantage: string;
}

function computeGapAnalysis(stage: AcademicStage, baseline: TechnicalBaseline): GapAnalysisResult {
  if (stage === 'class_11_12') {
    return {
      ruleType: 'Protection Rule',
      strategicRule: '85% time to JEE Main / Boards (PCM core), 15% weekend hands-on lab.',
      criticalGap: 'Severe risk of blowing JEE prep if overcomplicating cybersecurity or drowning in rabbit holes.',
      timeSplit: 'Mon–Fri JEE focus + strictly 2 hours on weekend for Linux & Bandit labs.',
      rejectionTrap: 'Dropping 20 hours a week on exploit tutorials while mock test PCM ranks crash.',
      standoutAdvantage: 'High JEE score + clean 1-repo Proof-of-Work showing genuine terminal & discrete math curiosity.',
    };
  }
  if (stage === 'dropper') {
    return {
      ruleType: 'Protection Rule',
      strategicRule: 'Strict 90/10 time partition. Drop year cannot be compromised for unannounced entrance test formats.',
      criticalGap: 'Anxiety driving unfocused multitasking between PCM revision and random CTF challenges.',
      timeSplit: '90% Core Drop routine + strictly 1 weekend hour on Bandit Linux fundamentals.',
      rejectionTrap: 'Spending 90 minutes on a single hard 50-point CTF challenge during revision weeks.',
      standoutAdvantage: 'Disciplined focus: rock-solid math fundamentals and a lean, verified 10-level Bandit log.',
    };
  }
  if (stage === 'college_year_1') {
    return {
      ruleType: 'Leverage Rule',
      strategicRule: 'Connect C programming & Discrete Maths to basic Cryptography & Networking; ship first public repo in 21 days.',
      criticalGap: 'Strong algorithmic head, zero public proof-of-work, no CTF vocabulary, and zero verifiable artifacts.',
      timeSplit: '50% Semester coursework + 50% technical proof-of-work buildout.',
      rejectionTrap: 'Collecting 15 Coursera/Udemy certificates of completion that admission committees disregard.',
      standoutAdvantage: 'A public GitHub repo with clean commit history demonstrating socket programming and Bandit notes.',
    };
  }
  return {
    ruleType: 'Fast-Track Rule',
    strategicRule: 'Build 1 network protocol analyzer or security tool + prepare direct dossier to C3iHub principal investigators.',
    criticalGap: 'Missing faculty-grade research-oriented project depth and live vulnerability disclosures.',
    timeSplit: '40% Academic maintenance + 60% high-signal security tool development.',
    rejectionTrap: 'Generic web scraping scripts or boilerplate CRUD applications masquerading as security projects.',
    standoutAdvantage: 'Demonstrated vulnerability research, original tooling, or meaningful open-source commits.',
  };
}

const PROOF_OF_WORK_ARTIFACTS = [
  {
    id: 'github_repo',
    title: 'Artifact 1: Personal GitHub Repository',
    subtitle: 'Public repo with clean README documenting learning notes, bash scripts, and exercises.',
    placeholder: 'https://github.com/username/bcyber-foundations',
    benchmark: 'At least 15 commits over 4+ weeks with meaningful commit messages.',
  },
  {
    id: 'bandit_milestone',
    title: 'Artifact 2: OverTheWire Bandit Milestone',
    subtitle: 'Levels 1–10 (or 1–15) completed with concise local command notes (without leaking passwords).',
    placeholder: 'https://github.com/username/bcyber-foundations/blob/main/bandit-notes.md',
    benchmark: 'Stop at Level 15; do not get stuck on Level 16+ rabbit holes.',
  },
  {
    id: 'practical_writeup',
    title: 'Artifact 3: Practical Mini-Writeup / Packet Analysis',
    subtitle: '1-page structured markdown analysis of a sample PCAP file (Wireshark) or PicoCTF web challenge.',
    placeholder: 'https://github.com/username/bcyber-foundations/blob/main/packet-analysis.md',
    benchmark: 'Explain root-cause, evidence, and remediation clearly in plain English.',
  },
  {
    id: 'video_walkthrough',
    title: 'Artifact 4 (Optional Video Edge): 2-Minute Screen Recording',
    subtitle: 'Unlisted YouTube demo walking through your terminal commands, code, and thought process.',
    placeholder: 'https://youtu.be/your-unlisted-walkthrough',
    benchmark: 'Authentic 120-second screen share showing terminal and Git repo. No fancy editing needed.',
  },
];

export function BCyberPreparationPlannerPage() {
  const canonical = getCanonicalUrl('/blueprints/b-cyber/prepare');

  useSEO({
    title: 'Personalised Preparation Planner | B.Cyber Compass',
    description:
      'Interactive, trust-first preparation planner for B.Cyber aspirants. Generates customized weekly schedules respecting your available hours and baseline skills.',
    keywords:
      'B.Cyber preparation planner, cybersecurity study schedule, FAQ 22 portfolio roadmap, independent logic prep, dynamic capacity planning',
    url: canonical,
  });

  const {
    inputs,
    generatedPlan,
    completedTaskIds,
    activeTab,
    isEmergencyRecoveryMode,
    proofOfWorkArtifacts,
    updateInputs,
    generatePlan,
    toggleTaskCompletion,
    setActiveTab,
    toggleRecoveryMode,
    setProofOfWorkArtifact,
    reset,
  } = useBCyberPlannerStore();

  const [confirmReset, setConfirmReset] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});
  const [collapsedPhaseIds, setCollapsedPhaseIds] = useState<Record<string, boolean>>({});

  // Generate initial plan automatically if none exists
  React.useEffect(() => {
    if (!generatedPlan) {
      generatePlan();
    }
  }, [generatedPlan, generatePlan]);

  const handleReset = () => {
    reset();
    setConfirmReset(false);
  };

  const toggleTaskDrawer = (taskId: string) => {
    setExpandedTaskIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const togglePhaseCollapse = (phaseId: string) => {
    setCollapsedPhaseIds((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  const completedCount = completedTaskIds.length;
  const totalTasksCount =
    generatedPlan?.phases.reduce((sum, p) => sum + p.tasks.length, 0) || 0;
  const progressPercent =
    totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;

  const gapAnalysis = computeGapAnalysis(inputs.academicStage, inputs.technicalBaseline);

  const completedArtifactsCount = PROOF_OF_WORK_ARTIFACTS.filter(
    (art) => Boolean(proofOfWorkArtifacts[art.id]?.trim())
  ).length;

  return (
    <div className="w-full min-h-screen bg-[#fafbfc] text-[#0f172a] pt-28 sm:pt-32 pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Workspace Header Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/80 text-[11px] font-mono text-slate-600 font-medium">
                <CalendarCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>B-Cyber Execution System v1.0 • Deterministic Capacity Engine</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Personalised Preparation Planner
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Input your academic stage, technical baseline, and weekly study budget ({inputs.availableWeeklyHours}h/wk). Generates an adjustable execution plan with strict separation between confirmed institutional policies and open technical labs.
              </p>
            </div>

            {/* Quick Metrics & Controls Strip */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
              {generatedPlan && (
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 space-y-2 min-w-[220px]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">Roadmap Progress</span>
                    <span className="font-mono font-bold text-slate-900">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{completedCount}/{totalTasksCount} tasks</span>
                    <span>{generatedPlan.phases.length} Phases</span>
                  </div>
                </div>
              )}

              {/* Emergency Recovery Button */}
              <button
                type="button"
                onClick={toggleRecoveryMode}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
                  isEmergencyRecoveryMode
                    ? 'bg-amber-500 text-white border-amber-600 font-semibold'
                    : 'bg-white border-slate-200/90 text-slate-600 hover:text-amber-700 hover:border-amber-300'
                )}
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>{isEmergencyRecoveryMode ? 'Emergency Mode Active' : 'Exam Freeze / 60m Mode'}</span>
              </button>
            </div>
          </div>

          {/* Recovery Mode Active Banner */}
          {isEmergencyRecoveryMode && (
            <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/90 text-amber-950 text-xs flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Pause Without Guilt • Emergency 60m/Week Protocol Active</span>
                <p className="text-amber-900/90 leading-relaxed">
                  When mock tests tank or college mid-terms arrive, do not stress. Your routine is compressed to 60 minutes/week. Complete only 1 core task per week to preserve momentum without risking exam grades.
                </p>
              </div>
            </div>
          )}

          {/* Persistent State Footer */}
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Progress is stored locally in this browser. Clearing browser data will reset your plan.</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span>Capacity: {inputs.availableWeeklyHours}h/wk</span>
              <span>•</span>
              <span>Timeline: {inputs.targetTimelineMonths.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Minimal Disclaimer Notice */}
        <DisclaimerBanner variant="compact" />

        {/* Linear Segmented Tab Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar -mx-1 px-1">
            <button
              type="button"
              onClick={() => setActiveTab('diagnostic')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap',
                activeTab === 'diagnostic'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900'
              )}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>1. Diagnostic Intake</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gap_analysis')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap',
                activeTab === 'gap_analysis'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900'
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>2. Gap &amp; Strategy</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('phases')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap',
                activeTab === 'phases'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900'
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3. Phased Roadmap</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('proof_of_work')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap',
                activeTab === 'proof_of_work'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900'
              )}
            >
              <Award className="w-3.5 h-3.5" />
              <span>4. Proof-of-Work Checklist</span>
              <span className="font-mono text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.2 rounded">
                {completedArtifactsCount}/4
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('weekly_calendar')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap',
                activeTab === 'weekly_calendar'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900'
              )}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>5. Weekly Timetable</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer shadow-xs"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200/90 bg-white text-slate-500 hover:text-rose-600 hover:border-rose-200 text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Plan</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: Diagnostic Intake */}
        {activeTab === 'diagnostic' && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                1. Diagnostic Profile Configuration
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust your profile parameters. Changes will instantly re-sequence your gap analysis, phased roadmap, and weekly timetable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field 1: Pathway */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-900">
                  Preparation Pathway
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    {
                      id: 'both',
                      title: 'Combined Preparation (Admission + Practical Skills)',
                      desc: 'Balances institutional admission readiness, discrete logic, and practical hands-on wargames.',
                    },
                    {
                      id: 'admission_prep',
                      title: 'Admission Only (Policy + Logic + Evidence)',
                      desc: 'Focuses strictly on confirmed admission requirements, analytical reasoning, and FAQ 22 portfolio dossier. Excludes Bandit.',
                    },
                    {
                      id: 'skill_dev',
                      title: 'Cybersecurity Skill Development Only',
                      desc: 'Practical technical security labs (Bandit, PortSwigger, Beej, PicoCTF) for foundational competence.',
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateInputs({ selectedPathway: opt.id as PrepPathway })}
                      className="w-full text-left"
                    >
                      <div
                        className={cn(
                          'p-3 rounded-xl border text-left transition-all cursor-pointer',
                          inputs.selectedPathway === opt.id
                            ? 'border-slate-900 bg-slate-50/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-slate-900'
                            : 'border-slate-200/90 bg-white hover:bg-slate-50/50'
                        )}
                      >
                        <div className="font-medium text-xs text-slate-900 flex items-center justify-between">
                          <span>{opt.title}</span>
                          {inputs.selectedPathway === opt.id && (
                            <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 2 & 3: Academic Stage & Baseline */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-900">
                    Academic Stage
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'class_11_12', label: 'Class 11 / 12' },
                      { id: 'dropper', label: 'Dropper / Gap Year' },
                      { id: 'college_year_1', label: 'College Year 1' },
                      { id: 'college_year_2_plus', label: 'College Year 2+' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateInputs({ academicStage: opt.id as AcademicStage })}
                        className={cn(
                          'p-2.5 rounded-lg border text-center transition-all cursor-pointer text-xs font-medium',
                          inputs.academicStage === opt.id
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-900">
                    Technical Baseline
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        id: 'zero_terminal',
                        title: 'Zero Terminal / Non-Programmer',
                        sub: 'Never used CLI or Linux; starting from complete scratch.',
                      },
                      {
                        id: 'basic_programming',
                        title: 'Basic Programming / Math (C, Python)',
                        sub: 'Familiar with loops, variables, and high school discrete math.',
                      },
                      {
                        id: 'intermediate_scripting_networking',
                        title: 'Intermediate Scripting & Networking',
                        sub: 'Comfortable in Linux, TCP/IP basics, or introductory CTFs.',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          updateInputs({ technicalBaseline: opt.id as TechnicalBaseline })
                        }
                        className={cn(
                          'p-2.5 rounded-lg border text-left transition-all cursor-pointer',
                          inputs.technicalBaseline === opt.id
                            ? 'border-slate-900 bg-slate-50/80 ring-1 ring-slate-900'
                            : 'border-slate-200/90 bg-white hover:bg-slate-50/50'
                        )}
                      >
                        <div className="text-xs font-medium text-slate-900 flex items-center justify-between">
                          <span>{opt.title}</span>
                          {inputs.technicalBaseline === opt.id && (
                            <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Field 4: Weekly Hours Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-900">
                    Weekly Study Budget
                  </label>
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
                    {inputs.availableWeeklyHours} hrs / week
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="25"
                  step="1"
                  value={inputs.availableWeeklyHours}
                  onChange={(e) => updateInputs({ availableWeeklyHours: parseInt(e.target.value, 10) })}
                  className="w-full accent-slate-900 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>3h (Constrained)</span>
                  <span>10h (Balanced)</span>
                  <span>25h (Sprint)</span>
                </div>
              </div>

              {/* Field 5 & 6: Timeline & Goal */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-900">
                    Target Timeline
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '3_months', label: '3 Months', sub: '12 Wks' },
                      { id: '6_months', label: '6 Months', sub: '24 Wks' },
                      { id: '12_months', label: '12 Months', sub: '48 Wks' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          updateInputs({ targetTimelineMonths: opt.id as TargetTimeline })
                        }
                        className={cn(
                          'p-2 rounded-lg border text-center transition-all cursor-pointer',
                          inputs.targetTimelineMonths === opt.id
                            ? 'border-slate-900 bg-slate-900 text-white font-medium shadow-xs'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <div className="text-xs font-medium">{opt.label}</div>
                        <div className="text-[10px] text-slate-400">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-900">
                    Primary Goal
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'bcyber_admission', label: 'B.Cyber Admission' },
                      { id: 'cyber_foundations', label: 'Foundations Mastery' },
                      { id: 'practical_portfolio', label: 'Portfolio Dossier' },
                      { id: 'career_shift', label: 'General Cyber Skills' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateInputs({ primaryGoal: opt.id as PrimaryGoal })}
                        className={cn(
                          'p-2 rounded-lg border text-center transition-all cursor-pointer text-xs font-medium',
                          inputs.primaryGoal === opt.id
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Pacing automatically calculated without arbitrary task truncation.
              </span>
              <button
                type="button"
                onClick={() => {
                  generatePlan();
                  setActiveTab('gap_analysis');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer shadow-xs group"
              >
                <span>View Gap Analysis &amp; Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Gap Analysis & Strategy */}
        {activeTab === 'gap_analysis' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                    2. Candidate Gap Analysis &amp; Strategic Imperative
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Deterministic diagnosis based on your profile: {inputs.academicStage.replace(/_/g, ' ')} with {inputs.technicalBaseline.replace(/_/g, ' ')}.
                  </p>
                </div>
                <span className="font-mono text-xs uppercase px-2.5 py-1 rounded-md bg-slate-900 text-white font-semibold">
                  {gapAnalysis.ruleType}
                </span>
              </div>

              {/* Identified Gap and Strategic Imperative */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/50 space-y-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold text-rose-700 tracking-wider">
                    Critical Identified Gap
                  </span>
                  <p className="text-xs text-rose-950 leading-relaxed font-medium">
                    {gapAnalysis.criticalGap}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/50 space-y-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                    Strategic Imperative
                  </span>
                  <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                    {gapAnalysis.strategicRule}
                  </p>
                </div>
              </div>

              {/* Recommended Time Partition */}
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-1">
                <span className="text-xs font-semibold text-slate-900">
                  Recommended Time Partition ({inputs.availableWeeklyHours} hrs/week)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {gapAnalysis.timeSplit}
                </p>
              </div>

              {/* Rejection vs Standout Comparison */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Committee Evaluation Ground Reality
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold text-rose-700">
                      <span>What 90% Submit (Filtered Out)</span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {gapAnalysis.rejectionTrap}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                      <span>What Actually Stands Out</span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {gapAnalysis.standoutAdvantage}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('diagnostic')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200/90 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Edit Inputs
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('phases')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer shadow-xs group"
                >
                  <span>Proceed to Phased Execution Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Phased Execution Roadmap */}
        {activeTab === 'phases' && generatedPlan && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3" /> Filter:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                    selectedCategoryFilter === 'all'
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  )}
                >
                  All ({totalTasksCount})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('confirmed_admission_requirement')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                    selectedCategoryFilter === 'confirmed_admission_requirement'
                      ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  )}
                >
                  Category A (Admission)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('independent_provisional_prep')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                    selectedCategoryFilter === 'independent_provisional_prep'
                      ? 'bg-indigo-700 text-white font-semibold shadow-xs'
                      : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                  )}
                >
                  Category B (Logic &amp; Math)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('published_evidence_alignment')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                    selectedCategoryFilter === 'published_evidence_alignment'
                      ? 'bg-amber-700 text-white font-semibold shadow-xs'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  )}
                >
                  Category C (FAQ 22 Evidence)
                </button>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('weekly_calendar')}
                  className="px-2.5 py-1 rounded-md border border-slate-200/90 bg-white text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  View Weekly Schedule
                </button>
              </div>
            </div>

            {/* Phases List */}
            <div className="space-y-4">
              {generatedPlan.phases.map((phase) => {
                const isCollapsed = collapsedPhaseIds[phase.id] || false;
                const matchingTasks = phase.tasks.filter((t) =>
                  selectedCategoryFilter === 'all' ? true : t.category === selectedCategoryFilter
                );
                const phaseCompletedTasks = phase.tasks.filter((t) =>
                  completedTaskIds.includes(t.id)
                ).length;

                return (
                  <section
                    key={phase.id}
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4"
                  >
                    {/* Phase Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
                            PHASE {phase.phaseNumber}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            Weeks {phase.weekRange[0]}–{phase.weekRange[1]}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            ({phaseCompletedTasks}/{phase.tasks.length} done)
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{phase.title}</h3>
                        <p className="text-xs text-slate-500">{phase.focusArea}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => togglePhaseCollapse(phase.id)}
                        className="self-start sm:self-auto text-xs text-slate-500 hover:text-slate-900 font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isCollapsed ? 'Expand Phase' : 'Collapse Phase'}</span>
                        {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Phase Tasks */}
                    {!isCollapsed && (
                      <div className="space-y-3 pt-1">
                        {matchingTasks.map((task) => {
                          const isDone = completedTaskIds.includes(task.id);
                          const isExpanded = expandedTaskIds[task.id] || false;
                          const catMeta = CATEGORY_STYLES[task.category] || CATEGORY_STYLES.independent_provisional_prep;

                          return (
                            <article
                              key={task.id}
                              className={cn(
                                'rounded-xl border p-4 transition-all',
                                catMeta.borderClass,
                                isDone
                                  ? 'border-slate-200 bg-slate-50/60 opacity-80'
                                  : 'border-slate-200/90 bg-white hover:border-slate-300'
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                  <button
                                    type="button"
                                    onClick={() => toggleTaskCompletion(task.id)}
                                    className={cn(
                                      'w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer shrink-0 mt-0.5 transition-colors',
                                      isDone
                                        ? 'bg-slate-900 border-slate-900 text-white'
                                        : 'border-slate-300 hover:border-slate-500 bg-white'
                                    )}
                                    aria-label={`Mark ${task.title} as ${isDone ? 'incomplete' : 'done'}`}
                                  >
                                    {isDone && <Check className="w-3 h-3" />}
                                  </button>

                                  <div className="space-y-1 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <h4
                                        className={cn(
                                          'font-semibold text-xs text-slate-900',
                                          isDone && 'line-through text-slate-500'
                                        )}
                                      >
                                        {task.title}
                                      </h4>
                                      <span
                                        className={cn(
                                          'text-[10px] font-mono px-2 py-0.5 rounded border',
                                          catMeta.badgeClass
                                        )}
                                      >
                                        {catMeta.label}
                                      </span>
                                      <TrustBadge trustLevel={task.trustLevel} size="sm" />
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                      {task.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                    {task.estimatedHours}h
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => toggleTaskDrawer(task.id)}
                                    className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                                    aria-label="Toggle details"
                                  >
                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>

                              {/* Expandable Details Drawer */}
                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-2 text-slate-600">
                                  <div>
                                    <strong className="font-semibold text-slate-900">Why Recommended: </strong>
                                    {task.whyRecommended}
                                  </div>

                                  {task.prerequisites.length > 0 && (
                                    <div>
                                      <strong className="font-semibold text-slate-900">Prerequisites: </strong>
                                      <span className="font-mono text-[11px] text-slate-500">
                                        {task.prerequisites.join(', ')}
                                      </span>
                                    </div>
                                  )}

                                  {task.disclaimer && (
                                    <div className="text-[11px] text-amber-900 bg-amber-50/60 p-2 rounded border border-amber-200/60">
                                      <strong>Notice: </strong>
                                      {task.disclaimer}
                                    </div>
                                  )}

                                  {task.resourceIds && task.resourceIds.length > 0 && (
                                    <div className="pt-1 flex flex-wrap items-center gap-2">
                                      <span className="text-[11px] font-semibold text-slate-500">
                                        Direct Practice Links:
                                      </span>
                                      {task.resourceIds.map((rId) => {
                                        const res = resourcesCatalog.resources.find((r) => r.id === rId);
                                        if (!res) return null;
                                        return (
                                          <a
                                            key={res.id}
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-[11px] text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded hover:bg-slate-200 transition-colors"
                                          >
                                            <span>{res.name}</span>
                                            <ExternalLink className="w-2.5 h-2.5" />
                                          </a>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </article>
                          );
                        })}

                        {matchingTasks.length === 0 && (
                          <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                            No tasks in Phase {phase.phaseNumber} match this category filter.
                          </div>
                        )}

                        {/* Milestone Definition of Done */}
                        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs text-slate-700 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-semibold text-slate-900">
                              Phase {phase.phaseNumber} Definition of Done:{' '}
                            </strong>
                            {phase.milestoneDefinitionOfDone}
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: Proof-of-Work Checklist Board */}
        {activeTab === 'proof_of_work' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                    4. Student Proof-of-Work Dossier Tracker
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Align your application with FAQ 22 standards. Store your actual project links locally in your browser.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900 text-white">
                    {completedArtifactsCount} / 4 Artifacts Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROOF_OF_WORK_ARTIFACTS.map((artifact) => {
                  const currentVal = proofOfWorkArtifacts[artifact.id] || '';
                  const hasLink = Boolean(currentVal.trim());

                  return (
                    <div
                      key={artifact.id}
                      className={cn(
                        'rounded-xl border p-5 space-y-3 transition-all',
                        hasLink
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : 'border-slate-200/90 bg-white'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900">
                            {hasLink && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            <span>{artifact.title}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {artifact.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold flex items-center gap-1">
                          <Link2 className="w-3 h-3" /> Artifact URL / Submission Link:
                        </label>
                        <input
                          type="url"
                          placeholder={artifact.placeholder}
                          value={currentVal}
                          onChange={(e) => setProofOfWorkArtifact(artifact.id, e.target.value)}
                          className="w-full text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-200/90 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-slate-900 transition-colors"
                        />
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono bg-slate-50/80 p-2 rounded border border-slate-100">
                        <strong className="text-slate-600">Benchmark: </strong>
                        {artifact.benchmark}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 text-xs text-slate-600 flex items-start gap-3">
                <FileCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-slate-900">FAQ 22 Submission Tip</span>
                  <p className="leading-relaxed">
                    IIT Kanpur WSAIS application forms look for proof of original problem-solving. A single live GitHub repository with real daily commit logs is worth 100x more than generic course certificates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Weekly Timetable View */}
        {activeTab === 'weekly_calendar' && generatedPlan && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                    5. Weekly Execution Timetable
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Time-boxed task packing respecting your budget of{' '}
                    <strong>{inputs.availableWeeklyHours} hrs/week</strong> across {generatedPlan.weeklySchedule.length} weeks.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('phases')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200/90 bg-white text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer"
                >
                  Switch to Roadmap View
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {generatedPlan.weeklySchedule.map((slot) => (
                  <div
                    key={slot.week}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          WEEK {slot.week}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {slot.totalAllocatedHours} / {inputs.availableWeeklyHours}h
                        </span>
                      </div>

                      {/* Scheduled Tasks in this week */}
                      <div className="space-y-1.5">
                        {slot.tasks.map((task, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs space-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                          >
                            <div className="font-medium text-slate-900 flex items-center justify-between gap-1">
                              <span className="truncate">{task.title}</span>
                              <span className="font-mono text-[10px] text-slate-400 shrink-0">
                                {task.allocatedHours}h
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 truncate">
                              {task.category.replace(/_/g, ' ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {slot.capacityExplanation && (
                      <div className="text-[10px] text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                        {slot.capacityExplanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
