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

export const BCyberHackathonMatrix: React.FC = () => {
  const [selectedDomainId, setSelectedDomainId] = useState<string>(HACKATHON_DOMAINS[0].id);

  const selectedDomain =
    HACKATHON_DOMAINS.find((d) => d.id === selectedDomainId) || HACKATHON_DOMAINS[0];

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 p-5 sm:p-6 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200/80 text-[11px] font-mono text-purple-800 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-purple-600" />
            <span>On-Campus Practical Evaluation</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            6 Hours Duration • New Core Lab, IIT Kanpur
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          The 6-Hour Hackathon &amp; 8 Technical Evaluation Pillars
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          The final selection round is an in-person, hands-on technical challenge conducted inside IIT Kanpur’s <strong>New Core Lab</strong>. Candidates work on sanitized Linux/Windows workstations without internet access or outside assistance to solve real-world security challenges.
        </p>
      </div>

      <div className="p-5 sm:p-8 space-y-6">
        {/* Hackathon Day Operational Environment */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-semibold">Venue</span>
            </div>
            <p className="text-xs font-bold text-slate-900">New Core Lab, IIT Kanpur</p>
            <p className="text-[10px] text-slate-500">Sanitized desktop workstations</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-semibold">Schedule</span>
            </div>
            <p className="text-xs font-bold text-slate-900">10:00 AM – 4:00 PM</p>
            <p className="text-[10px] text-slate-500">Entry strictly closes at 9:45 AM</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-semibold">Supervision</span>
            </div>
            <p className="text-xs font-bold text-slate-900">Faculty &amp; C3iHub Staff</p>
            <p className="text-[10px] text-slate-500">Proctored closed environment</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold">Hospitality</span>
            </div>
            <p className="text-xs font-bold text-slate-900">Packed Lunch &amp; Water</p>
            <p className="text-[10px] text-slate-500">Provided at workstations</p>
          </div>
        </div>

        {/* 8 Domains Grid + Active Detail View */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Select Evaluated Domain (8 Pillars Tested)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              Interactive Domain Blueprint
            </span>
          </div>

          {/* 8 Pills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {HACKATHON_DOMAINS.map((domain) => {
              const IconComponent = ICON_MAP[domain.iconName] || Terminal;
              const isSelected = selectedDomainId === domain.id;

              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => setSelectedDomainId(domain.id)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2',
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-xs ring-1 ring-slate-900'
                      : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-white'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <IconComponent
                      className={cn('w-4 h-4', isSelected ? 'text-white' : 'text-slate-500')}
                    />
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block leading-snug">{domain.title}</span>
                    <span
                      className={cn(
                        'text-[10px] block line-clamp-1',
                        isSelected ? 'text-slate-300' : 'text-slate-400'
                      )}
                    >
                      {domain.tagline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Domain Detailed Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{selectedDomain.title}</span>
                  <span className="text-xs font-normal text-slate-500 font-mono">
                    ({selectedDomain.tagline})
                  </span>
                </h4>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800 self-start sm:self-auto">
                Practical Evaluator
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Skills & Sample Challenge */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Core Evaluated Skills
                  </span>
                  <ul className="space-y-1 text-xs">
                    {selectedDomain.evaluatedSkills.map((skill, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-900 block flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-purple-600" />
                    <span>Sample Challenge Archetype</span>
                  </span>
                  <p className="text-xs font-mono text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                    {selectedDomain.sampleChallenge}
                  </p>
                </div>
              </div>

              {/* Right Column: Tools & Committee Metric */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Standard Tools Pre-Installed on Workstation
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDomain.recommendedTools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-purple-200 bg-purple-50/40 p-3.5 space-y-1">
                  <span className="text-[11px] font-bold text-purple-950 block">
                    What the Admissions Committee Evaluates
                  </span>
                  <p className="text-xs text-purple-900 leading-relaxed">
                    {selectedDomain.evaluationCriterion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
