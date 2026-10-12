import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Terminal,
  Network,
  Code2,
  Shield,
  Clock,
  Laptop,
} from 'lucide-react';
import { useBCyberPlannerStore } from '../../lib/b-cyber-compass/store';
import { cn } from '../../lib/utils';

interface QuestionOption {
  value: string;
  label: string;
  score: number;
}

export function BCyberReadinessDiagnostic() {
  const { inputs, updateInputs } = useBCyberPlannerStore();

  const [osLevel, setOsLevel] = useState<'beginner' | 'basic' | 'fluent'>('beginner');
  const [networkLevel, setNetworkLevel] = useState<'none' | 'basic' | 'fluent'>('none');
  const [codingLevel, setCodingLevel] = useState<'none' | 'basic' | 'fluent'>('none');
  const [securityLevel, setSecurityLevel] = useState<'zero' | 'theory' | 'active'>('zero');
  const [hoursOption, setHoursOption] = useState<'casual' | 'balanced' | 'sprint'>('balanced');
  const [hardwareOption, setHardwareOption] = useState<'windows' | 'linux_vm' | 'limited'>('windows');

  // Compute calculated diagnostic assessment
  const calculateResult = () => {
    let score = 0;
    if (osLevel === 'basic') score += 2;
    if (osLevel === 'fluent') score += 4;

    if (networkLevel === 'basic') score += 2;
    if (networkLevel === 'fluent') score += 4;

    if (codingLevel === 'basic') score += 2;
    if (codingLevel === 'fluent') score += 4;

    if (securityLevel === 'theory') score += 2;
    if (securityLevel === 'active') score += 4;

    let tier: 'Baseline' | 'Foundations' | 'Security Core' | 'Application Ready';
    let stageId: string;
    let stageName: string;

    if (score <= 4) {
      tier = 'Baseline';
      stageId = 'stage-0';
      stageName = 'Stage 0: Baseline & Safe Lab Setup';
    } else if (score <= 9) {
      tier = 'Foundations';
      stageId = 'stage-1';
      stageName = 'Stage 1: Linux & Networking Foundations';
    } else if (score <= 13) {
      tier = 'Security Core';
      stageId = 'stage-2';
      stageName = 'Stage 2: Web/API Security & Cryptography';
    } else {
      tier = 'Application Ready';
      stageId = 'stage-3';
      stageName = 'Stage 3 / 4: Investigation & Evidence';
    }

    // Identify top 2-3 gaps
    const gaps: string[] = [];
    if (osLevel === 'beginner') {
      gaps.push('Linux command-line navigation and file permission fundamentals (chmod/chown).');
    }
    if (networkLevel === 'none') {
      gaps.push('TCP/IP 3-way handshakes, DNS resolution, and Wireshark packet capture analysis.');
    }
    if (codingLevel === 'none') {
      gaps.push('Basic Python or C scripting for automating repetitive security tasks and parsing logs.');
    }
    if (securityLevel === 'zero' && gaps.length < 3) {
      gaps.push('Hands-on vulnerability testing experience on safe laboratory wargames (OverTheWire / PortSwigger).');
    }
    if (gaps.length === 0) {
      gaps.push('Building structured, reproducible public evidence dossiers on GitHub (writeups & tools).');
    }

    return { tier, stageId, stageName, gaps: gaps.slice(0, 3) };
  };

  const result = calculateResult();

  const handleApplyToStore = () => {
    const hours = hoursOption === 'casual' ? 4 : hoursOption === 'balanced' ? 8 : 15;
    const baseline =
      osLevel === 'beginner' && codingLevel === 'none'
        ? 'zero_terminal'
        : codingLevel !== 'none' && osLevel !== 'fluent'
        ? 'basic_programming'
        : 'intermediate_scripting_networking';

    updateInputs({
      availableWeeklyHours: hours,
      technicalBaseline: baseline,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-8">
      {/* Header Block */}
      <div className="space-y-2 border-b border-slate-100 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Section 03 · Free Self-Assessment Engine</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Free Readiness Diagnostic: Where Should You Start?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Answer 6 quick questions regarding your current technical baseline, hardware setup, and available hours. We calculate your recommended starting stage and highlight your priority learning gaps.
        </p>
      </div>

      {/* 6 Questions Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Q1: OS & Terminal */}
        <div className="space-y-2.5 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-brand-primary" />
            <span>1. Operating System &amp; Terminal</span>
          </label>
          <div className="space-y-2">
            {[
              { id: 'beginner', label: 'Total beginner (GUI only, no CLI)' },
              { id: 'basic', label: 'Basic commands (cd, ls, mkdir, cat)' },
              { id: 'fluent', label: 'Fluent in Linux bash, pipes & permissions' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={cn(
                  'flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all',
                  osLevel === opt.id
                    ? 'border-brand-primary bg-brand-primary/5 text-slate-900 font-semibold ring-1 ring-brand-primary/30'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                )}
              >
                <input
                  type="radio"
                  name="osLevel"
                  checked={osLevel === opt.id}
                  onChange={() => setOsLevel(opt.id as any)}
                  className="sr-only"
                />
                <span className={cn('w-2 h-2 rounded-full', osLevel === opt.id ? 'bg-brand-primary' : 'bg-slate-300')} />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Q2: Networking */}
        <div className="space-y-2.5 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Network className="w-4 h-4 text-brand-primary" />
            <span>2. Computer Networking</span>
          </label>
          <div className="space-y-2">
            {[
              { id: 'none', label: 'No idea how packets / IP work' },
              { id: 'basic', label: 'Know IP, DNS & HTTP conceptually' },
              { id: 'fluent', label: 'Inspected TCP handshakes in Wireshark' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={cn(
                  'flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all',
                  networkLevel === opt.id
                    ? 'border-brand-primary bg-brand-primary/5 text-slate-900 font-semibold ring-1 ring-brand-primary/30'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                )}
              >
                <input
                  type="radio"
                  name="networkLevel"
                  checked={networkLevel === opt.id}
                  onChange={() => setNetworkLevel(opt.id as any)}
                  className="sr-only"
                />
                <span className={cn('w-2 h-2 rounded-full', networkLevel === opt.id ? 'bg-brand-primary' : 'bg-slate-300')} />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Q3: Coding / Scripting */}
        <div className="space-y-2.5 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-brand-primary" />
            <span>3. Programming / Scripting</span>
          </label>
          <div className="space-y-2">
            {[
              { id: 'none', label: 'No prior programming experience' },
              { id: 'basic', label: 'Basic Python, C, or Java syntax' },
              { id: 'fluent', label: 'Can write log parsers & network scripts' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={cn(
                  'flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all',
                  codingLevel === opt.id
                    ? 'border-brand-primary bg-brand-primary/5 text-slate-900 font-semibold ring-1 ring-brand-primary/30'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                )}
              >
                <input
                  type="radio"
                  name="codingLevel"
                  checked={codingLevel === opt.id}
                  onChange={() => setCodingLevel(opt.id as any)}
                  className="sr-only"
                />
                <span className={cn('w-2 h-2 rounded-full', codingLevel === opt.id ? 'bg-brand-primary' : 'bg-slate-300')} />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Q4: Prior Security Practice */}
        <div className="space-y-2.5 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-brand-primary" />
            <span>4. Security Practice &amp; Labs</span>
          </label>
          <div className="space-y-2">
            {[
              { id: 'zero', label: 'Zero hands-on security experience' },
              { id: 'theory', label: 'Read blogs / watched YouTube videos' },
              { id: 'active', label: 'Solved Bandit, PicoCTF or PortSwigger' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={cn(
                  'flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all',
                  securityLevel === opt.id
                    ? 'border-brand-primary bg-brand-primary/5 text-slate-900 font-semibold ring-1 ring-brand-primary/30'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                )}
              >
                <input
                  type="radio"
                  name="securityLevel"
                  checked={securityLevel === opt.id}
                  onChange={() => setSecurityLevel(opt.id as any)}
                  className="sr-only"
                />
                <span className={cn('w-2 h-2 rounded-full', securityLevel === opt.id ? 'bg-brand-primary' : 'bg-slate-300')} />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Q5: Weekly Time Commitment */}
        <div className="space-y-2.5 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-primary" />
            <span>5. Weekly Time Available</span>
          </label>
          <div className="space-y-2">
            {[
              { id: 'casual', label: '2–4 hours / week (Casual pace)' },
              { id: 'balanced', label: '5–8 hours / week (Recommended)' },
              { id: 'sprint', label: '10–15+ hours / week (Intensive sprint)' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={cn(
                  'flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all',
                  hoursOption === opt.id
                    ? 'border-brand-primary bg-brand-primary/5 text-slate-900 font-semibold ring-1 ring-brand-primary/30'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                )}
              >
                <input
                  type="radio"
                  name="hoursOption"
                  checked={hoursOption === opt.id}
                  onChange={() => setHoursOption(opt.id as any)}
                  className="sr-only"
                />
                <span className={cn('w-2 h-2 rounded-full', hoursOption === opt.id ? 'bg-brand-primary' : 'bg-slate-300')} />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Q6: Hardware & Platform */}
        <div className="space-y-2.5 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Laptop className="w-4 h-4 text-brand-primary" />
            <span>6. Device &amp; Lab Setup</span>
          </label>
          <div className="space-y-2">
            {[
              { id: 'windows', label: 'Windows PC only (needs WSL2 guide)' },
              { id: 'linux_vm', label: 'Linux installed / VirtualBox ready' },
              { id: 'limited', label: 'Older hardware or limited internet' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={cn(
                  'flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all',
                  hardwareOption === opt.id
                    ? 'border-brand-primary bg-brand-primary/5 text-slate-900 font-semibold ring-1 ring-brand-primary/30'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                )}
              >
                <input
                  type="radio"
                  name="hardwareOption"
                  checked={hardwareOption === opt.id}
                  onChange={() => setHardwareOption(opt.id as any)}
                  className="sr-only"
                />
                <span className={cn('w-2 h-2 rounded-full', hardwareOption === opt.id ? 'bg-brand-primary' : 'bg-slate-300')} />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Calculated Result Card */}
      <div className="rounded-xl border border-brand-primary/30 bg-gradient-to-br from-brand-primary/5 via-white to-indigo-50/40 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-brand-primary/15 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
              Your Diagnostic Result
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Assessed Tier: <span className="text-brand-primary">{result.tier}</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Recommended Starting Point: <strong>{result.stageName}</strong>
            </p>
          </div>

          <a
            href={`#${result.stageId}`}
            onClick={handleApplyToStore}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary/90 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <span>Jump to {result.tier} Syllabus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Priority Gaps Box */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Top Priority Gaps to Address First:</span>
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {result.gaps.map((gap, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/90 border border-slate-200/80 text-[11px] text-slate-700 leading-snug flex items-start gap-2">
                <span className="font-mono text-brand-primary font-bold shrink-0">0{idx + 1}.</span>
                <span>{gap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strict Epistemic Boundary Notice */}
        <div className="p-3 rounded-lg bg-slate-100/80 border border-slate-200/70 text-[11px] text-slate-600 flex items-start gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>
            <strong>Transparency Boundary:</strong> This diagnostic assesses technical starting readiness for personal study. It is <strong>not</strong> an admission predictor or probability calculator for IIT Kanpur.
          </span>
        </div>
      </div>
    </div>
  );
}
