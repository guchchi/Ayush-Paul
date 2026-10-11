import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarCheck,
  Sparkles,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Layers,
  ArrowRight,
  Info,
  Calendar,
  Check,
} from 'lucide-react';
import { BCyberNav } from '../../../components/b-cyber/BCyberNav';
import { DisclaimerBanner } from '../../../components/b-cyber/DisclaimerBanner';
import { TrustBadge } from '../../../components/b-cyber/TrustBadge';
import { useBCyberPlannerStore } from '../../../lib/b-cyber-compass/store';
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
    label: 'Category A: Official Admission Requirement',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderClass: 'border-l-4 border-l-emerald-500',
  },
  independent_provisional_prep: {
    label: 'Category B: Independent Provisional Guidance',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    borderClass: 'border-l-4 border-l-indigo-500',
  },
  published_evidence_alignment: {
    label: 'Category C: Published Evidence-of-Work Alignment',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    borderClass: 'border-l-4 border-l-amber-500',
  },
  technical_skill_development: {
    label: 'Practical Skill Development Lab',
    badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    borderClass: 'border-l-4 border-l-zinc-500',
  },
};

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
    updateInputs,
    generatePlan,
    toggleTaskCompletion,
    setActiveTab,
    reset,
  } = useBCyberPlannerStore();

  const [confirmReset, setConfirmReset] = useState(false);

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

  const completedCount = completedTaskIds.length;
  const totalTasksCount =
    generatedPlan?.phases.reduce((sum, p) => sum + p.tasks.length, 0) || 0;
  const progressPercent =
    totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 10) / 10 : 0;

  return (
    <div className="w-full min-h-screen bg-bg-primary text-text-primary pb-24">
      <BCyberNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Layer 2 — Dynamic Preparation Planner • Zero Fixed 50/50 Splits</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              Personalised Preparation Planner
            </h1>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Configure your academic stage, technical baseline, and available weekly study hours (3 to 25 hours). The rule engine dynamically packs tasks without arbitrary splits, strictly keeping official admission requirements separate from independent foundational learning.
            </p>
          </div>

          {/* Local Storage & Non-Guarantee Advisory */}
          <div className="mt-5 rounded-xl border border-border-color bg-bg-secondary/40 p-4 text-xs text-text-secondary flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-primary shrink-0" />
              <span>
                <strong>Browser Persistence Notice:</strong> Progress is stored locally in this browser. Data does not sync across devices and will be lost if you clear your browser data.
              </span>
            </div>
            {generatedPlan && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-semibold text-text-primary">
                  {completedCount}/{totalTasksCount} tasks completed
                </span>
              </div>
            )}
          </div>
        </div>

        <DisclaimerBanner variant="compact" />

        {/* View Tabs */}
        <div className="flex items-center justify-between border-b border-border-color pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('diagnostic')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                activeTab === 'diagnostic'
                  ? 'bg-brand-primary text-white shadow-2xs'
                  : 'bg-white border border-border-color text-text-secondary hover:text-text-primary'
              )}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Diagnostic Intake</span>
            </button>
            <button
              onClick={() => setActiveTab('phases')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                activeTab === 'phases'
                  ? 'bg-brand-primary text-white shadow-2xs'
                  : 'bg-white border border-border-color text-text-secondary hover:text-text-primary'
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Phased Roadmap</span>
            </button>
            <button
              onClick={() => setActiveTab('weekly_calendar')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                activeTab === 'weekly_calendar'
                  ? 'bg-brand-primary text-white shadow-2xs'
                  : 'bg-white border border-border-color text-text-secondary hover:text-text-primary'
              )}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Weekly Calendar</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-bg-secondary text-text-secondary text-xs hover:text-text-primary cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-color bg-white text-text-muted hover:text-rose-700 hover:border-rose-300 text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Plan</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Diagnostic Intake Form */}
        {activeTab === 'diagnostic' && (
          <div className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs space-y-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">
                Preparation Diagnostic Intake
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Adjust your profile parameters. Changes will re-generate your phased roadmap and weekly timetable immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field 1: Pathway */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-primary">
                  1. Preparation Pathway
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    {
                      id: 'both',
                      title: 'Combined Preparation (Admission + Practical Skills)',
                      desc: 'Balances institutional admission readiness, discrete logic, and practical hands-on labs.',
                    },
                    {
                      id: 'admission_prep',
                      title: 'Admission Only (Policy + Logic + Evidence)',
                      desc: 'Focuses strictly on confirmed admission requirements, analytical reasoning, and FAQ 22 portfolio dossier. Excludes OverTheWire Bandit.',
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
                      className={cn(
                        'p-3 rounded-xl border text-left transition-all cursor-pointer',
                        inputs.selectedPathway === opt.id
                          ? 'border-brand-primary bg-brand-primary/5 shadow-2xs'
                          : 'border-border-color bg-white hover:bg-bg-secondary/40'
                      )}
                    >
                      <div className="font-semibold text-xs text-text-primary flex items-center justify-between">
                        <span>{opt.title}</span>
                        {inputs.selectedPathway === opt.id && (
                          <Check className="w-4 h-4 text-brand-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-text-secondary mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 2: Academic Stage */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-primary">
                  2. Academic Stage
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
                        'p-3 rounded-xl border text-center transition-all cursor-pointer text-xs font-medium',
                        inputs.academicStage === opt.id
                          ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-semibold'
                          : 'border-border-color bg-white text-text-secondary hover:text-text-primary'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Field 3: Technical Baseline */}
                <div className="pt-4 space-y-2">
                  <label className="text-xs font-semibold text-text-primary">
                    3. Technical Baseline
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'zero_terminal', label: 'Zero Terminal Experience', sub: 'New to command-line and Linux' },
                      { id: 'basic_programming', label: 'Basic Programming', sub: 'Comfortable with Python, C, or Java logic' },
                      { id: 'intermediate_scripting_networking', label: 'Intermediate Scripting & Networking', sub: 'Experience with sockets, bash, and CTFs' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateInputs({ technicalBaseline: opt.id as TechnicalBaseline })}
                        className={cn(
                          'p-2.5 rounded-xl border text-left transition-all cursor-pointer',
                          inputs.technicalBaseline === opt.id
                            ? 'border-brand-primary bg-brand-primary/5 text-text-primary'
                            : 'border-border-color bg-white text-text-secondary hover:text-text-primary'
                        )}
                      >
                        <div className="text-xs font-semibold">{opt.label}</div>
                        <div className="text-[11px] text-text-muted">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Field 4: Available Weekly Hours */}
              <div className="space-y-3 md:col-span-2 pt-2 border-t border-border-color">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-text-primary">
                    4. Available Weekly Hours
                  </label>
                  <span className="font-mono text-sm font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-md">
                    {inputs.availableWeeklyHours} hours / week
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="25"
                  step="1"
                  value={inputs.availableWeeklyHours}
                  onChange={(e) => updateInputs({ availableWeeklyHours: parseInt(e.target.value, 10) })}
                  className="w-full accent-brand-primary cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>3 hrs/week (Minimal light pacing)</span>
                  <span>10 hrs/week (Recommended balanced)</span>
                  <span>25 hrs/week (Intensive immersion)</span>
                </div>
              </div>

              {/* Field 5: Target Timeline */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-primary">
                  5. Target Timeline
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '3_months', label: '3 Months', sub: '12 Weeks' },
                    { id: '6_months', label: '6 Months', sub: '24 Weeks' },
                    { id: '12_months', label: '12 Months', sub: '48 Weeks' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateInputs({ targetTimelineMonths: opt.id as TargetTimeline })}
                      className={cn(
                        'p-2.5 rounded-xl border text-center transition-all cursor-pointer',
                        inputs.targetTimelineMonths === opt.id
                          ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-semibold'
                          : 'border-border-color bg-white text-text-secondary hover:text-text-primary'
                      )}
                    >
                      <div className="text-xs font-semibold">{opt.label}</div>
                      <div className="text-[10px] text-text-muted">{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 6: Primary Goal */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-primary">
                  6. Primary Goal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'bcyber_admission', label: 'B.Cyber Admission Readiness' },
                    { id: 'cyber_foundations', label: 'Cyber Foundations Mastery' },
                    { id: 'practical_portfolio', label: 'Practical Portfolio Assembly' },
                    { id: 'career_shift', label: 'General Cybersecurity Shift' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateInputs({ primaryGoal: opt.id as PrimaryGoal })}
                      className={cn(
                        'p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-medium',
                        inputs.primaryGoal === opt.id
                          ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-semibold'
                          : 'border-border-color bg-white text-text-secondary hover:text-text-primary'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-color flex justify-end">
              <button
                type="button"
                onClick={() => {
                  generatePlan();
                  setActiveTab('phases');
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-secondary transition-colors cursor-pointer shadow-2xs"
              >
                <span>Generate Personalised Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Phased Roadmap View */}
        {activeTab === 'phases' && generatedPlan && (
          <div className="space-y-8">
            {/* Plan Summary Bar */}
            <div className="rounded-xl border border-border-color bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-bg-secondary text-brand-primary">
                    Active Plan
                  </span>
                  <span className="text-xs text-text-muted">
                    Generated: {new Date(generatedPlan.generatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-text-secondary">
                  Pathway: <strong className="text-text-primary">{inputs.selectedPathway}</strong> • Target:{' '}
                  <strong className="text-text-primary">{inputs.targetTimelineMonths.replace('_', ' ')}</strong> • Capacity:{' '}
                  <strong className="text-brand-primary">{inputs.availableWeeklyHours} hrs/week</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('diagnostic')}
                  className="px-3 py-1.5 rounded-lg border border-border-color bg-bg-secondary text-text-secondary hover:text-text-primary text-xs font-medium cursor-pointer"
                >
                  Adjust Profile
                </button>
                <button
                  onClick={() => setActiveTab('weekly_calendar')}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-secondary cursor-pointer shadow-2xs"
                >
                  View Weekly Calendar
                </button>
              </div>
            </div>

            {/* Trade-off Insights */}
            {generatedPlan.tradeOffExplanations.length > 0 && (
              <div className="rounded-xl border border-border-color/80 bg-bg-secondary/40 p-4 space-y-2 text-xs text-text-secondary">
                <div className="font-semibold text-text-primary flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                  <span>Dynamic Capacity & Pacing Assessment</span>
                </div>
                {generatedPlan.tradeOffExplanations.map((msg, idx) => (
                  <p key={idx} className="leading-relaxed pl-5.5">
                    • {msg}
                  </p>
                ))}
              </div>
            )}

            {/* Phases Grid */}
            <div className="space-y-8">
              {generatedPlan.phases.map((phase) => (
                <div
                  key={phase.id}
                  className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs space-y-6"
                >
                  {/* Phase Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border-color">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary">
                          PHASE {phase.phaseNumber}
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                          {phase.title}
                        </h2>
                      </div>
                      <p className="text-xs text-text-secondary">{phase.focusArea}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-text-muted bg-bg-secondary px-3 py-1.5 rounded-lg">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Weeks {phase.weekRange[0]} – {phase.weekRange[1]}</span>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-4">
                    {phase.tasks.map((task) => {
                      const isCompleted = completedTaskIds.includes(task.id);
                      const catStyle = CATEGORY_STYLES[task.category] || CATEGORY_STYLES.technical_skill_development;

                      return (
                        <div
                          key={task.id}
                          className={cn(
                            'rounded-xl border bg-white p-4.5 transition-all space-y-3',
                            catStyle.borderClass,
                            isCompleted ? 'bg-bg-secondary/40 opacity-75' : 'border-border-color'
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <button
                                type="button"
                                onClick={() => toggleTaskCompletion(task.id)}
                                className={cn(
                                  'w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer',
                                  isCompleted
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'border-border-color bg-white hover:border-brand-primary'
                                )}
                              >
                                {isCompleted && <Check className="w-3.5 h-3.5" />}
                              </button>

                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={cn(
                                      'text-[10px] font-semibold px-2 py-0.5 rounded border',
                                      catStyle.badgeClass
                                    )}
                                  >
                                    {catStyle.label}
                                  </span>
                                  <TrustBadge trustLevel={task.trustLevel} size="sm" />
                                </div>
                                <h3
                                  className={cn(
                                    'font-semibold text-sm text-text-primary',
                                    isCompleted && 'line-through text-text-muted'
                                  )}
                                >
                                  {task.title}
                                </h3>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                  {task.description}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 text-right">
                              <span className="font-mono text-xs font-semibold text-text-primary bg-bg-secondary px-2 py-0.5 rounded">
                                {task.estimatedHours}h est.
                              </span>
                            </div>
                          </div>

                          {/* Why Recommended */}
                          <div className="text-[11px] text-text-secondary pl-8 leading-relaxed">
                            <strong className="text-text-primary">Rationale: </strong>
                            {task.whyRecommended}
                          </div>

                          {/* Mandatory Editorial Disclaimer if attached */}
                          {task.disclaimer && (
                            <div className="ml-8 text-[11px] text-amber-900 bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-lg leading-relaxed">
                              {task.disclaimer}
                            </div>
                          )}

                          {/* Resources link if attached */}
                          {task.resourceIds && task.resourceIds.length > 0 && (
                            <div className="ml-8 pt-1 flex flex-wrap gap-2 text-xs">
                              {task.resourceIds.map((resId) => {
                                const res = resourcesCatalog.resources.find((r) => r.id === resId);
                                if (!res) return null;
                                return (
                                  <a
                                    key={res.id}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-bg-secondary text-brand-primary font-medium hover:underline text-[11px]"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                    <span>{res.name}</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Milestone Definition of Done */}
                  <div className="rounded-xl bg-emerald-50/50 border border-emerald-200/60 p-4 text-xs text-emerald-950 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-emerald-900">
                        Phase {phase.phaseNumber} Definition of Done:{' '}
                      </strong>
                      {phase.milestoneDefinitionOfDone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Weekly Calendar View */}
        {activeTab === 'weekly_calendar' && generatedPlan && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border-color bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border-color">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-text-primary">
                    Weekly Execution Timetable
                  </h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Time-boxed allocations respecting your limit of{' '}
                    <strong>{inputs.availableWeeklyHours} hours/week</strong> across {generatedPlan.weeklySchedule.length} weeks.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('phases')}
                  className="px-3.5 py-1.5 rounded-lg border border-border-color bg-white text-text-secondary hover:text-text-primary text-xs font-medium cursor-pointer"
                >
                  Switch to Roadmap View
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {generatedPlan.weeklySchedule.map((slot) => (
                  <div
                    key={slot.week}
                    className="rounded-xl border border-border-color bg-bg-secondary/30 p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-brand-primary">
                          WEEK {slot.week}
                        </span>
                        <span className="text-[11px] font-mono text-text-muted">
                          {slot.totalAllocatedHours} / {inputs.availableWeeklyHours}h
                        </span>
                      </div>

                      {/* Scheduled Tasks in this week */}
                      <div className="space-y-1.5">
                        {slot.tasks.map((task, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-2 rounded-lg border border-border-color text-xs space-y-0.5"
                          >
                            <div className="font-semibold text-text-primary flex items-center justify-between gap-1">
                              <span className="truncate">{task.title}</span>
                              <span className="font-mono text-[10px] text-text-muted shrink-0">
                                {task.allocatedHours}h
                              </span>
                            </div>
                            <div className="text-[10px] text-text-secondary truncate">
                              {task.category.replace(/_/g, ' ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {slot.capacityExplanation && (
                      <div className="text-[10px] text-text-muted italic bg-white/60 p-2 rounded border border-border-color/60">
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
