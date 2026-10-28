import React, { useState } from 'react';
import {
  Terminal,
  Shield,
  KeyRound,
  Globe,
  Server,
  Network,
  Binary,
  Search,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Info,
  Cpu,
  Lock,
  Workflow,
  Sparkles,
} from 'lucide-react';
import { HACKATHON_DOMAINS, HackathonDomain } from '../../content/b-cyber/knowledge-base';
import { cn } from '../../lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  KeyRound,
  Globe,
  Server,
  Network,
  Binary,
  Search,
  Terminal,
  ShieldAlert,
};

const DAY_TIMELINE = [
  { time: '09:30 AM', title: 'Identity & Reporting Verification', desc: 'Aadhaar / Photo ID check and entry into New Core Lab. Entry strictly closes at 09:45 AM.' },
  { time: '10:00 AM', title: 'Air-Gapped Workstation Unlock', desc: 'Sanitized Linux/Windows terminals initialized with local problem repositories and flag server.' },
  { time: '01:00 PM', title: 'Mid-Way Checkpoint & Lunch', desc: 'Packed lunch and water served directly at candidate workstations to preserve focus.' },
  { time: '04:00 PM', title: 'Terminal Freeze & Code Submission', desc: 'Local repository freeze, automated flag scoring, and formal exit debrief by faculty.' },
];

export const BCyberHackathonMatrix: React.FC = () => {
  const [selectedDomainId, setSelectedDomainId] = useState<string>(HACKATHON_DOMAINS[0].id);
  const [activeTab, setActiveTab] = useState<'domains' | 'workstation' | 'schedule'>('domains');

  const selectedDomain =
    HACKATHON_DOMAINS.find((d) => d.id === selectedDomainId) || HACKATHON_DOMAINS[0];

  return (
    <div className="w-full rounded-3xl border border-[#c2c6d6]/35 bg-white shadow-xs overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-[#fafbfc] p-5 sm:p-7 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs text-[#0058be] font-bold">
            <Terminal className="w-3.5 h-3.5" />
            <span>Format: 2026 Observed Precedent</span>
          </div>
          <span className="text-xs text-slate-500 font-mono font-medium">
            6 Hours Duration · New Core Lab, IIT Kanpur
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0b1c30]">
            The 6-Hour In-Person Hackathon &amp; 8 Technical Practice Domains
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
            The practical selection round is an in-person, hands-on technical challenge conducted inside IIT Kanpur’s <strong>New Core Lab</strong>. Candidates solve real-world cybersecurity challenges on sanitized workstations under faculty supervision.
          </p>
        </div>

        {/* Tab Switcher: Domains vs Workstation Spec vs Day Schedule */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
          <button
            type="button"
            onClick={() => setActiveTab('domains')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
              activeTab === 'domains'
                ? 'bg-[#0b1c30] text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            )}
          >
            8 Practice Focus Domains
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workstation')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
              activeTab === 'workstation'
                ? 'bg-[#0b1c30] text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            )}
          >
            Air-Gapped Lab Workstation Spec
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
              activeTab === 'schedule'
                ? 'bg-[#0b1c30] text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            )}
          >
            Hackathon Day Schedule
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-8 space-y-6">
        {/* TAB 1: 8 PRACTICE DOMAINS */}
        {activeTab === 'domains' && (
          <div className="space-y-6">
            {/* Quick 4 Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">VENUE</span>
                <span className="text-xs font-bold text-slate-900 block">New Core Lab</span>
                <span className="text-[11px] text-slate-500 block">IIT Kanpur Campus</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">DURATION</span>
                <span className="text-xs font-bold text-slate-900 block">6 Continuous Hours</span>
                <span className="text-[11px] text-slate-500 block">10:00 AM – 4:00 PM</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">SUPERVISION</span>
                <span className="text-xs font-bold text-slate-900 block">Faculty &amp; C3iHub</span>
                <span className="text-[11px] text-slate-500 block">Zero internet access</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">EVALUATION</span>
                <span className="text-xs font-bold text-slate-900 block">Automated Flags</span>
                <span className="text-[11px] text-slate-500 block">+ Code Quality Rubric</span>
              </div>
            </div>

            {/* 8 Domains Selection Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Select a Technical Domain to View Practice Archetype:
                </span>
                <span className="text-[11px] font-medium text-[#0058be]">
                  Domain {HACKATHON_DOMAINS.findIndex((d) => d.id === selectedDomainId) + 1} of 8
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {HACKATHON_DOMAINS.map((domain) => {
                  const IconComponent = ICON_MAP[domain.iconName] || Terminal;
                  const isSelected = selectedDomainId === domain.id;

                  return (
                    <button
                      key={domain.id}
                      type="button"
                      onClick={() => setSelectedDomainId(domain.id)}
                      className={cn(
                        'p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2',
                        isSelected
                          ? 'border-[#0058be] bg-blue-50/60 text-slate-950 font-bold shadow-2xs ring-1 ring-[#0058be]/30'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <IconComponent
                          className={cn('w-4 h-4', isSelected ? 'text-[#0058be]' : 'text-slate-500')}
                        />
                        <span className={cn(
                          'text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                          isSelected ? 'bg-blue-200/70 text-[#0058be]' : 'bg-slate-100 text-slate-500'
                        )}>
                          Domain
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold block leading-snug">{domain.title}</span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {domain.tagline}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Domain Detailed Card */}
            <div className="rounded-3xl border border-slate-200 bg-[#fafbfc] p-6 sm:p-7 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200/80">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0058be] block">
                    PRACTICAL FOCUS ARCHETYPE
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                    <span>{selectedDomain.title}</span>
                    <span className="text-xs font-normal text-slate-500 font-mono">
                      · {selectedDomain.tagline}
                    </span>
                  </h3>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 self-start sm:self-auto shadow-2xs">
                  Hands-on Rubric
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Column: Skills & Sample Problem */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                      Core Evaluated Competencies
                    </span>
                    <ul className="space-y-1.5 text-xs">
                      {selectedDomain.evaluatedSkills.map((skill, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-900 block flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-purple-600" />
                      <span>Sample Problem Statement</span>
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-mono bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {selectedDomain.sampleChallenge}
                    </p>
                  </div>
                </div>

                {/* Right Column: Offline Tools & Evaluation Logic */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                      Recommended Offline Practice Tools
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedDomain.recommendedTools.map((tool, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 font-medium shadow-2xs"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-purple-200/80 bg-purple-50/50 p-4 space-y-1.5">
                    <span className="text-[11px] font-bold text-purple-950 block">
                      IIT Kanpur Committee Scoring Criteria:
                    </span>
                    <p className="text-xs text-purple-900 leading-relaxed">
                      {selectedDomain.evaluationCriterion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AIR-GAPPED WORKSTATION SPEC */}
        {activeTab === 'workstation' && (
          <div className="rounded-3xl border border-slate-200 bg-[#fafbfc] p-6 sm:p-7 space-y-5">
            <div className="space-y-1 pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#0058be]" />
                <span>Sanitized Lab Environment Specifications (New Core Lab)</span>
              </h3>
              <p className="text-xs text-slate-600">
                Official parameters of the testing environment provided to each shortlisted applicant.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  NETWORK ACCESS
                </span>
                <span className="font-bold text-red-700 block text-sm flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  100% Air-Gapped Network
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Zero access to the public internet, search engines, StackOverflow, or AI assistants. Only internal local intranet access to documentation manpages and the challenge flag server.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  OPERATING SYSTEM
                </span>
                <span className="font-bold text-slate-900 block text-sm flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#0058be]" />
                  Linux (Ubuntu LTS / Debian)
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Sanitized desktop workstation with standard bash shell, GNU toolchain (GCC, GDB, Make), Python 3.x, and common developer utilities.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  SUBMISSION MECHANISM
                </span>
                <span className="font-bold text-emerald-800 block text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Local Git / Flag Verification
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Flags and source solutions submitted via local loopback web portal. Commits and scripts are timestamped to verify autonomous implementation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HACKATHON DAY SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="rounded-3xl border border-slate-200 bg-[#fafbfc] p-6 sm:p-7 space-y-5">
            <div className="space-y-1 pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0058be]" />
                <span>Hackathon Day Timeline (Observed 2026 Run)</span>
              </h3>
              <p className="text-xs text-slate-600">
                Exact progression of events during the in-person testing day at IIT Kanpur.
              </p>
            </div>

            <div className="space-y-3">
              {DAY_TIMELINE.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <span className="font-mono text-xs font-extrabold text-[#0058be] px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200/60 shrink-0">
                    {item.time}
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">{item.title}</span>
                    <span className="text-[11px] text-slate-600 leading-relaxed block">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
