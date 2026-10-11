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
  ListChecks,
  FolderGit2,
  Compass,
  X,
  Settings2,
  CheckSquare,
  Square,
  Zap,
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
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200/80',
    borderClass: 'border-l-2 border-l-slate-400',
  },
};

const STAGE_LABELS: Record<AcademicStage, string> = {
  class_11_12: 'Class 11 / 12 (JEE Aspirant)',
  dropper: 'Dropper / Gap Year',
  college_year_1: 'College Year 1',
  college_year_2_plus: 'College Year 2+',
};

const BASELINE_LABELS: Record<TechnicalBaseline, string> = {
  zero_terminal: 'Zero Terminal / Beginner',
  basic_programming: 'Basic Programming / Math (C, Python)',
  intermediate_scripting_networking: 'Intermediate Scripting & Networking',
};

const GOAL_LABELS: Record<PrimaryGoal, string> = {
  bcyber_admission: 'B.Cyber Admission Shortlist',
  cyber_foundations: 'Foundational Cybersecurity Skills',
  practical_portfolio: 'FAQ 22 Portfolio Dossier',
  career_shift: 'Career & Skills Shift',
};

function getGapAnalysis(stage: AcademicStage, baseline: TechnicalBaseline) {
  if (stage === 'class_11_12' || stage === 'dropper') {
    return {
      ruleType: 'Protection Rule',
      strategicRule:
        '85% time to JEE Main / Boards (PCM core), 15% weekend hands-on cybersecurity lab.',
      criticalGap:
        'Severe risk of blowing JEE Main cutoff ranks if overcomplicating cyber or drowning in rabbit holes.',
      timeSplit: 'Mon–Fri JEE focus + strictly 2–3 hours on weekends for Linux & Bandit labs.',
      rejectionTrap:
        'Dropping 20 hours a week on exploit tutorials while mock test PCM ranks crash.',
      standoutAdvantage:
        'High JEE cutoff clearance + clean 1-repo Proof-of-Work showing genuine terminal curiosity.',
    };
  }
  if (stage === 'college_year_1') {
    return {
      ruleType: 'Leverage Rule',
      strategicRule:
        'Connect C programming & Discrete Maths to basic Cryptography & Networking; ship first public repo in 21 days.',
      criticalGap:
        'Strong algorithmic head, zero public proof-of-work, no CTF vocabulary, and zero verifiable artifacts.',
      timeSplit: '50% Semester coursework + 50% technical proof-of-work buildout.',
      rejectionTrap:
        'Collecting 15 Coursera/Udemy certificates of completion that admission committees disregard.',
      standoutAdvantage:
        'A public GitHub repo with clean commit history demonstrating socket programming and Bandit notes.',
    };
  }
  return {
    ruleType: 'Fast-Track Rule',
    strategicRule:
      'Build 1 network protocol analyzer or security tool + prepare direct dossier to C3iHub principal investigators.',
    criticalGap:
      'Missing faculty-grade research-oriented project depth and live vulnerability disclosures.',
    timeSplit: '40% Academic maintenance + 60% high-signal security tool development.',
    rejectionTrap:
      'Generic web scraping scripts or boilerplate CRUD applications masquerading as security projects.',
    standoutAdvantage:
      'Demonstrated vulnerability research, original tooling, or meaningful open-source commits.',
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
    title: 'Personalised Preparation Studio | B.Cyber Compass',
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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Auto-generate plan if none exists
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

  const gapAnalysis = getGapAnalysis(inputs.academicStage, inputs.technicalBaseline);

  const totalTasks =
    generatedPlan?.phases.reduce((acc, phase) => acc + phase.tasks.length, 0) || 0;
  const completedCount = completedTaskIds.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const artifactsLinked = Object.values(proofOfWorkArtifacts).filter(
    (url) => url && url.trim().length > 0
  ).length;

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 pt-28 sm:pt-32 pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Studio Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
                Execution System v1.0
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono">Deterministic Capacity Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Personalised Preparation Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Grounded, adaptive execution roadmap tailored to your baseline, academic constraints, and weekly hours.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Emergency Freeze Button */}
            <button
              type="button"
              onClick={toggleRecoveryMode}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
                isEmergencyRecoveryMode
                  ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs ring-1 ring-rose-400'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <HeartPulse
                className={cn(
                  'w-3.5 h-3.5',
                  isEmergencyRecoveryMode ? 'text-rose-600 animate-pulse' : 'text-slate-500'
                )}
              />
              <span>
                {isEmergencyRecoveryMode ? 'Exam Freeze Active (60m/wk)' : 'Exam Freeze / 60m Mode'}
              </span>
            </button>

            {/* Profile Configuration Button */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Tune Profile</span>
            </button>

            {/* Reset Plan */}
            {confirmReset ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer shadow-xs"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 text-xs transition-colors cursor-pointer"
                title="Reset stored progress"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Emergency Freeze Active Banner */}
        {isEmergencyRecoveryMode && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs text-rose-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-start gap-2.5">
              <HeartPulse className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-semibold text-rose-900">
                  Guilt-Free Exam Freeze Active (60 Minutes / Week)
                </div>
                <p className="text-rose-900/80 leading-relaxed text-[11px]">
                  All complex wargames and deep protocol labs are paused. Spend just 1 hour each weekend making 1 commit to your GitHub repository and reviewing your markdown cheatsheets. Full recovery when exams conclude.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleRecoveryMode}
              className="px-3 py-1 rounded-md bg-white border border-rose-300 text-rose-900 text-xs font-semibold hover:bg-rose-100/50 shrink-0 cursor-pointer"
            >
              Resume Standard Pace
            </button>
          </div>
        )}

        {/* 2-Column Studio Cockpit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: THE CONTROLLER & STRATEGIC COCKPIT (4 cols) */}
          {/* ======================================================== */}
          <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
            {/* Card 1: Live Profile & Capacity Engine */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900">
                  <Sliders className="w-3.5 h-3.5 text-slate-600" />
                  <span>Profile & Capacity Engine</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>

              {/* Active Profile Snapshot */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Academic Stage:</span>
                  <span className="font-medium text-slate-900 truncate max-w-[180px]">
                    {STAGE_LABELS[inputs.academicStage]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Baseline Skill:</span>
                  <span className="font-medium text-slate-900 truncate max-w-[180px]">
                    {BASELINE_LABELS[inputs.technicalBaseline]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Primary Goal:</span>
                  <span className="font-medium text-slate-900 truncate max-w-[180px]">
                    {GOAL_LABELS[inputs.primaryGoal]}
                  </span>
                </div>
              </div>

              {/* Interactive Weekly Hours Slider */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="weekly-study-hours-input" className="text-xs font-semibold text-slate-900">
                    Weekly Study Budget
                  </label>
                  <span className="font-mono text-xs font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {inputs.availableWeeklyHours} hrs / week
                  </span>
                </div>

                <input
                  id="weekly-study-hours-input"
                  type="range"
                  min="3"
                  max="25"
                  step="1"
                  value={inputs.availableWeeklyHours}
                  onChange={(e) =>
                    updateInputs({ availableWeeklyHours: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
                  aria-label="Weekly Study Budget in hours per week"
                />

                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>3h (Constrained)</span>
                  <span>10h (Balanced)</span>
                  <span>25h (Sprint)</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Moving this slider recalibrates weekly timeline pacing in real time without cutting foundational tasks.
                </p>
              </div>
            </div>

            {/* Card 2: Strategic Diagnosis (Gap Engine) */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Strategic Imperative</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {gapAnalysis.ruleType.toUpperCase()}
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3 text-xs space-y-1">
                <div className="font-semibold text-slate-900 text-xs">Core Directive:</div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {gapAnalysis.strategicRule}
                </p>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Critical Identified Gap:
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {gapAnalysis.criticalGap}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('gap_analysis')}
                  className="w-full py-1.5 text-center text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  View Committee Reality Check →
                </button>
              </div>
            </div>

            {/* Card 3: Execution Progress & Readiness */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-xs text-slate-900">Roadmap Completion</span>
                <span className="font-mono text-xs font-bold text-slate-900">
                  {progressPercent}%
                </span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-900 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <div className="text-[10px] font-mono text-slate-400">TASKS DONE</div>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {completedCount} / {totalTasks}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <div className="text-[10px] font-mono text-slate-400">ARTIFACTS</div>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {artifactsLinked} / 4 Ready
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-400 pt-1 text-center">
                Progress automatically saved in local browser storage
              </div>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: ACTIVE WORKSPACE & VIEWS (8 cols)          */}
          {/* ======================================================== */}
          <section className="lg:col-span-8 space-y-5">
            {/* Studio Navigation Bar */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('phases')}
                className={cn(
                  'flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer font-medium',
                  activeTab === 'phases'
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>Execution Roadmap</span>
                <span
                  className={cn(
                    'font-mono text-[10px] px-1.5 py-0.2 rounded',
                    activeTab === 'phases'
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {completedCount}/{totalTasks}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('proof_of_work')}
                className={cn(
                  'flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer font-medium',
                  activeTab === 'proof_of_work'
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Proof-of-Work Dossier</span>
                <span
                  className={cn(
                    'font-mono text-[10px] px-1.5 py-0.2 rounded',
                    activeTab === 'proof_of_work'
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {artifactsLinked}/4
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('weekly_calendar')}
                className={cn(
                  'flex-1 min-w-[110px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer font-medium',
                  activeTab === 'weekly_calendar'
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Weekly Cadence</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('gap_analysis')}
                className={cn(
                  'flex-1 min-w-[110px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer font-medium',
                  activeTab === 'gap_analysis'
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Strategic Analysis</span>
              </button>
            </div>

            {/* VIEW 1: ROADMAP & ACTION TASKS */}
            {activeTab === 'phases' && generatedPlan && (
              <div className="space-y-4">
                {/* Category Filter Chips */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1">
                      <Filter className="w-3 h-3" /> Filter:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryFilter('all')}
                      className={cn(
                        'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer',
                        selectedCategoryFilter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      )}
                    >
                      All Tasks ({totalTasks})
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCategoryFilter('confirmed_admission_requirement')
                      }
                      className={cn(
                        'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer',
                        selectedCategoryFilter === 'confirmed_admission_requirement'
                          ? 'bg-emerald-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
                      )}
                    >
                      Category A (Admission Rules)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCategoryFilter('independent_provisional_prep')
                      }
                      className={cn(
                        'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer',
                        selectedCategoryFilter === 'independent_provisional_prep'
                          ? 'bg-indigo-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50'
                      )}
                    >
                      Category B (Logic & Math)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCategoryFilter('published_evidence_alignment')
                      }
                      className={cn(
                        'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer',
                        selectedCategoryFilter === 'published_evidence_alignment'
                          ? 'bg-amber-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-amber-50'
                      )}
                    >
                      Category C (FAQ 22 Evidence)
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {generatedPlan.phases.length} Phases Total
                  </span>
                </div>

                {/* Phase Containers */}
                <div className="space-y-4">
                  {generatedPlan.phases.map((phase) => {
                    const isCollapsed = collapsedPhaseIds[phase.id];
                    const phaseTasks = phase.tasks.filter((t) => {
                      if (selectedCategoryFilter === 'all') return true;
                      return t.category === selectedCategoryFilter;
                    });

                    if (phaseTasks.length === 0 && selectedCategoryFilter !== 'all') {
                      return null;
                    }

                    const phaseDoneCount = phase.tasks.filter((t) =>
                      completedTaskIds.includes(t.id)
                    ).length;

                    return (
                      <div
                        key={phase.id}
                        className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                      >
                        {/* Phase Header */}
                        <div
                          onClick={() => togglePhaseCollapse(phase.id)}
                          className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/60 cursor-pointer transition-colors border-b border-slate-100"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
                                PHASE {phase.phaseNumber}
                              </span>
                              <span className="font-mono text-[11px] text-slate-500">
                                Weeks {phase.weekRange[0]}–{phase.weekRange[1]}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                ({phaseDoneCount}/{phase.tasks.length} done)
                              </span>
                            </div>
                            <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                              {phase.title}
                            </h2>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              {phase.focusArea}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-slate-400">
                            {isCollapsed ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronUp className="w-4 h-4" />
                            )}
                          </div>
                        </div>

                        {/* Phase Tasks (when expanded) */}
                        {!isCollapsed && (
                          <div className="p-4 sm:p-5 space-y-3 bg-slate-50/30">
                            <div className="space-y-2">
                              {phaseTasks.map((task) => {
                                const isDone = completedTaskIds.includes(task.id);
                                const isExpanded = expandedTaskIds[task.id];
                                const style =
                                  CATEGORY_STYLES[task.category] ||
                                  CATEGORY_STYLES.technical_skill_development;

                                return (
                                  <div
                                    key={task.id}
                                    className={cn(
                                      'rounded-lg border bg-white transition-all',
                                      isDone
                                        ? 'border-emerald-200/70 bg-emerald-50/20'
                                        : 'border-slate-200/80 hover:border-slate-300'
                                    )}
                                  >
                                    <div className="p-3.5 flex items-start gap-3">
                                      {/* Checkbox */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleTaskCompletion(task.id);
                                        }}
                                        className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                                      >
                                        {isDone ? (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                          <div className="w-4 h-4 rounded-full border border-slate-300 hover:border-slate-500" />
                                        )}
                                      </button>

                                      {/* Task Title & Meta */}
                                      <div
                                        onClick={() => toggleTaskDrawer(task.id)}
                                        className="flex-1 cursor-pointer space-y-1.5"
                                      >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                          <span
                                            className={cn(
                                              'text-xs font-semibold',
                                              isDone
                                                ? 'line-through text-slate-400'
                                                : 'text-slate-900'
                                            )}
                                          >
                                            {task.title}
                                          </span>
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                                              <Clock className="w-3 h-3" />
                                              {task.estimatedHours}h
                                            </span>
                                            <span className="text-slate-300">
                                              {isExpanded ? (
                                                <ChevronUp className="w-3.5 h-3.5" />
                                              ) : (
                                                <ChevronDown className="w-3.5 h-3.5" />
                                              )}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                          <span
                                            className={cn(
                                              'text-[10px] font-mono px-2 py-0.5 rounded border',
                                              style.badgeClass
                                            )}
                                          >
                                            {style.label}
                                          </span>
                                          <TrustBadge trustLevel={task.trustLevel} size="sm" />
                                        </div>

                                        {/* Task Description Preview */}
                                        <p className="text-xs text-slate-500 leading-relaxed pt-0.5">
                                          {task.description}
                                        </p>

                                        {/* Expanded Drawer: Actionable Guide & Resource Links */}
                                        {isExpanded && (
                                          <div className="pt-3 mt-2 border-t border-slate-100 space-y-2.5">
                                            {task.whyRecommended && (
                                              <div className="rounded-md bg-slate-50 border border-slate-200/70 p-2.5 text-xs text-slate-700 space-y-1">
                                                <div className="font-semibold text-slate-900 text-[11px]">
                                                  Execution Context & Guidance:
                                                </div>
                                                <p className="text-[11px] leading-relaxed text-slate-600">
                                                  {task.whyRecommended}
                                                </p>
                                              </div>
                                            )}

                                            {task.resourceIds && task.resourceIds.length > 0 && (
                                              <div className="pt-1 flex flex-wrap items-center gap-1.5">
                                                <span className="text-[10px] font-mono text-slate-400">
                                                  PRACTICE LINKS:
                                                </span>
                                                {task.resourceIds.map((rId) => {
                                                  const res = resourcesCatalog.resources.find(
                                                    (r) => r.id === rId
                                                  );
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
                                                      <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                                                    </a>
                                                  );
                                                })}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Phase Definition of Done */}
                            <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/60 text-xs text-emerald-950 flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <span className="font-semibold text-emerald-900 text-xs">
                                  Phase Definition of Done:
                                </span>
                                <p className="text-[11px] text-emerald-900/85">
                                  {phase.milestoneDefinitionOfDone}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW 2: PROOF-OF-WORK DOSSIER (FAQ 22 ARTIFACTS) */}
            {activeTab === 'proof_of_work' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                      Technical Proof-of-Work Checklist (FAQ 22)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter the live public URLs for your technical artifacts. These links are stored in your local browser and allow you to verify your application submission readiness.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    {PROOF_OF_WORK_ARTIFACTS.map((artifact) => {
                      const currentUrl = proofOfWorkArtifacts[artifact.id] || '';
                      const isFilled = currentUrl.trim().length > 0;

                      return (
                        <div
                          key={artifact.id}
                          className={cn(
                            'rounded-xl border p-4 space-y-3 transition-all',
                            isFilled
                              ? 'border-emerald-200 bg-emerald-50/20'
                              : 'border-slate-200/80 bg-white'
                          )}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xs sm:text-sm font-semibold text-slate-900">
                                  {artifact.title}
                                </h3>
                                {isFilled ? (
                                  <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.2 rounded font-semibold">
                                    LINKED
                                  </span>
                                ) : (
                                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.2 rounded">
                                    PENDING
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {artifact.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-lg bg-slate-50 border border-slate-200/60 p-2.5 text-[11px] text-slate-600">
                            <strong className="text-slate-800">Faculty Verification Standard:</strong>{' '}
                            {artifact.benchmark}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="url"
                                value={currentUrl}
                                onChange={(e) =>
                                  setProofOfWorkArtifact(artifact.id, e.target.value)
                                }
                                placeholder={artifact.placeholder}
                                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                              />
                            </div>
                            {isFilled && (
                              <a
                                href={currentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium inline-flex items-center gap-1 shrink-0"
                              >
                                <span>Test Link</span>
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Submission Guidance Box */}
                  <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/80 text-xs text-slate-600 flex items-start gap-3">
                    <FileCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-900">FAQ 22 Submission Tip</span>
                      <p className="leading-relaxed">
                        IIT Kanpur WSAIS application forms look for proof of original problem-solving. A single live GitHub repository with real weekly commit logs is worth 100x more than generic course completion certificates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: WEEKLY CADENCE (SMART SPRINT VIEW) */}
            {activeTab === 'weekly_calendar' && generatedPlan && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                        Weekly Sprint Cadence
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        High-yield weekly time distribution configured for your budget of{' '}
                        <strong>{inputs.availableWeeklyHours} hrs/week</strong>.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                      Total: {generatedPlan.weeklySchedule.length} Weeks
                    </span>
                  </div>

                  {/* Weekly Time Split Recommendation */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-4 text-xs space-y-2">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      <span>Recommended Weekly Time Partition</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {gapAnalysis.timeSplit}
                    </p>
                  </div>

                  {/* High-Impact Sprints Grid (Filtering out repetitive dummy buffer boxes) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                    {generatedPlan.weeklySchedule
                      .filter((slot) => slot.tasks.length > 0)
                      .slice(0, 12)
                      .map((slot) => (
                        <div
                          key={slot.week}
                          className="rounded-xl border border-slate-200/80 bg-white p-4 space-y-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                              <span className="font-mono text-xs font-bold text-slate-900">
                                WEEK {slot.week}
                              </span>
                              <span className="text-[11px] font-mono text-slate-500">
                                {slot.totalAllocatedHours} / {inputs.availableWeeklyHours}h
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              {slot.tasks.map((task, idx) => (
                                <div
                                  key={idx}
                                  className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 text-xs space-y-0.5"
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
                            <div className="text-[10px] text-slate-500 italic bg-slate-50/60 p-2 rounded border border-slate-100">
                              {slot.capacityExplanation}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: STRATEGIC DEEP-DIVE */}
            {activeTab === 'gap_analysis' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                        Strategic Gap Analysis & Committee Reality
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Deterministic diagnosis based on your profile ({STAGE_LABELS[inputs.academicStage]}; {BASELINE_LABELS[inputs.technicalBaseline]}).
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                      {gapAnalysis.ruleType}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="rounded-xl border border-rose-200/70 bg-rose-50/40 p-4 space-y-1.5 text-xs text-rose-950">
                      <div className="font-semibold text-rose-900 flex items-center gap-1.5 uppercase font-mono text-[10px] tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Critical Identified Gap</span>
                      </div>
                      <p className="text-rose-900/90 leading-relaxed text-xs">
                        {gapAnalysis.criticalGap}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-4 space-y-1.5 text-xs text-emerald-950">
                      <div className="font-semibold text-emerald-900 flex items-center gap-1.5 uppercase font-mono text-[10px] tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Strategic Imperative</span>
                      </div>
                      <p className="text-emerald-900/90 leading-relaxed text-xs">
                        {gapAnalysis.strategicRule}
                      </p>
                    </div>
                  </div>

                  {/* Rejections vs Standouts Table */}
                  <div className="pt-2 space-y-2">
                    <h3 className="text-xs font-semibold text-slate-900 uppercase font-mono tracking-wider">
                      Committee Evaluation Ground Reality
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-1.5">
                        <div className="font-semibold text-slate-900 text-xs">
                          What 90% Submit (Filtered Out)
                        </div>
                        <p className="text-slate-600 leading-relaxed text-xs">
                          {gapAnalysis.rejectionTrap}
                        </p>
                      </div>

                      <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 space-y-1.5">
                        <div className="font-semibold text-emerald-900 text-xs">
                          What Actually Stands Out
                        </div>
                        <p className="text-emerald-900/90 leading-relaxed text-xs">
                          {gapAnalysis.standoutAdvantage}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveTab('phases')}
                      className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Return to Execution Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ======================================================== */}
      {/* PROFILE CONFIGURATION MODAL / DRAWER                     */}
      {/* ======================================================== */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tune Diagnostic Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Adjust parameters to instantly re-calibrate your roadmap.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Field 1: Academic Stage */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900">
                Academic Stage
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'class_11_12', label: 'Class 11 / 12 (JEE)' },
                  { id: 'dropper', label: 'Dropper / Gap Year' },
                  { id: 'college_year_1', label: 'College Year 1' },
                  { id: 'college_year_2_plus', label: 'College Year 2+' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateInputs({ academicStage: opt.id as AcademicStage })}
                    className={cn(
                      'p-2.5 rounded-lg border text-xs text-left font-medium transition-all cursor-pointer',
                      inputs.academicStage === opt.id
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 2: Technical Baseline */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900">
                Technical Baseline
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  {
                    id: 'zero_terminal',
                    title: 'Zero Terminal / Non-Programmer',
                    desc: 'Never used CLI or Linux; starting from complete scratch.',
                  },
                  {
                    id: 'basic_programming',
                    title: 'Basic Programming / Math (C, Python)',
                    desc: 'Familiar with loops, variables, and high school discrete math.',
                  },
                  {
                    id: 'intermediate_scripting_networking',
                    title: 'Intermediate Scripting & Networking',
                    desc: 'Comfortable in Linux, TCP/IP basics, or introductory CTFs.',
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
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    )}
                  >
                    <div
                      className={cn(
                        'text-xs font-medium',
                        inputs.technicalBaseline === opt.id ? 'text-white' : 'text-slate-900'
                      )}
                    >
                      {opt.title}
                    </div>
                    <div
                      className={cn(
                        'text-[11px]',
                        inputs.technicalBaseline === opt.id ? 'text-slate-200' : 'text-slate-500'
                      )}
                    >
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Field 3: Target Timeline */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900">
                Target Timeline
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '3_months', label: '3 Months (12 Wks)' },
                  { id: '6_months', label: '6 Months (24 Wks)' },
                  { id: '12_months', label: '12 Months (48 Wks)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      updateInputs({ targetTimelineMonths: opt.id as TargetTimeline })
                    }
                    className={cn(
                      'p-2 rounded-lg border text-xs text-center font-medium transition-all cursor-pointer',
                      inputs.targetTimelineMonths === opt.id
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 4: Primary Goal */}
            <div className="space-y-1.5">
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
                      'p-2 rounded-lg border text-xs text-center font-medium transition-all cursor-pointer',
                      inputs.primaryGoal === opt.id
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
