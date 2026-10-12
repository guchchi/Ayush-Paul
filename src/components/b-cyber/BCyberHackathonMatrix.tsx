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
      <div className="border-b border-slate-100 bg-slate-50/70 p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs text-blue-800 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>Officially described format (2026 Precedent)</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            6 Hours Duration • New Core Lab, IIT Kanpur
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          The 6-Hour In-Person Hackathon &amp; 8 Preparation Focus Areas
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          The practical selection round is an in-person, hands-on technical challenge conducted inside IIT Kanpur’s <strong>New Core Lab</strong>. Candidates work on sanitized Linux/Windows workstations without internet access or outside assistance to solve real-world security challenges.
        </p>

        {/* Epistemic Labeling Callout */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-700 flex items-start gap-2.5 shadow-2xs">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">Epistemic Clarity &amp; Labeling</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              The 6-hour hackathon at New Core Lab is an <strong className="text-slate-900">Officially described format</strong> from the 2026 inaugural cycle. The 8 domain topics below (Cryptography, Reverse Engineering, OSINT, etc.) are <strong className="text-blue-700">Our preparation recommendation</strong> based on competitive cybersecurity problem-solving; IIT Kanpur has <em>not</em> published an official 8-domain syllabus.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8 space-y-6">
        {/* Hackathon Day Operational Environment */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-semibold">Venue</span>
              <span className="ml-auto text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">Format</span>
            </div>
            <p className="text-xs font-bold text-slate-900">New Core Lab, IIT Kanpur</p>
            <p className="text-[10px] text-slate-500">Sanitized desktop workstations</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-semibold">Schedule</span>
              <span className="ml-auto text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">Format</span>
            </div>
            <p className="text-xs font-bold text-slate-900">10:00 AM – 4:00 PM</p>
            <p className="text-[10px] text-slate-500">Entry strictly closes at 9:45 AM</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-semibold">Supervision</span>
              <span className="ml-auto text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">Format</span>
            </div>
            <p className="text-xs font-bold text-slate-900">Faculty &amp; C3iHub Staff</p>
            <p className="text-[10px] text-slate-500">Proctored closed environment</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold">Hospitality</span>
              <span className="ml-auto text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">Format</span>
            </div>
            <p className="text-xs font-bold text-slate-900">Packed Lunch &amp; Water</p>
            <p className="text-[10px] text-slate-500">Provided at workstations</p>
          </div>
        </div>

        {/* 8 Domains Grid + Active Detail View */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recommended Practice Domains
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Our preparation recommendation
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              8 Areas to Build Hands-On Competence
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
                    <span className={cn(
                      'text-[9px] font-medium px-1.5 py-0.5 rounded',
                      isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700 border border-blue-100'
                    )}>
                      Prep Rec
                    </span>
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Our preparation recommendation
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{selectedDomain.title}</span>
                  <span className="text-xs font-normal text-slate-500">
                    ({selectedDomain.tagline})
                  </span>
                </h4>
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 self-start sm:self-auto">
                Practical Skill Framework
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Skills & Sample Challenge */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Recommended Skills to Master
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
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {selectedDomain.sampleChallenge}
                  </p>
                </div>
              </div>

              {/* Right Column: Tools & Committee Metric */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Recommended Offline Tools for Practice
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDomain.recommendedTools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-purple-200 bg-purple-50/40 p-3.5 space-y-1">
                  <span className="text-[11px] font-bold text-purple-950 block">
                    Preparation Focus &amp; Practical Logic
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
