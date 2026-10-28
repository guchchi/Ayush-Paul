import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Code2,
  GitBranch,
  ShieldAlert,
  FileCode,
  Copy,
  Check,
  Info,
  Sparkles,
  SlidersHorizontal,
  Terminal,
} from 'lucide-react';
import { PROOF_OF_WORK_STANDARDS } from '../../content/b-cyber/knowledge-base';
import { cn } from '../../lib/utils';

interface AuditorItem {
  id: string;
  label: string;
  desc: string;
  weight: number;
}

const AUDITOR_CRITERIA: AuditorItem[] = [
  {
    id: 'git_history',
    label: 'Organic Git Commit Cadence',
    desc: 'Repository has multi-week commit history showing incremental problem solving (not a single-day dump of 100 files).',
    weight: 20,
  },
  {
    id: 'reproducibility',
    label: '1-Command Reproducibility',
    desc: 'README includes clear run commands, required dependencies (requirements.txt/Makefile), and runs locally without broken paths.',
    weight: 25,
  },
  {
    id: 'sample_logs',
    label: 'Concrete Terminal / Attack Logs',
    desc: 'Contains terminal outputs, packet capture (.pcap) snippets, or test assertions verifying that the code actually worked.',
    weight: 20,
  },
  {
    id: 'originality',
    label: 'Zero Tutorial Clone Signature',
    desc: 'Original domain logic or custom security tooling; strictly avoids YouTube tutorial clones, generic port scanners, or todo apps.',
    weight: 20,
  },
  {
    id: 'platform_handle',
    label: 'Verifiable Security Handle / CTF',
    desc: 'Public CTF profile (e.g., PicoCTF, OverTheWire, HackTheBox) or published technical writeup explaining a solved challenge.',
    weight: 15,
  },
];

export const BCyberProofOfWorkFilter: React.FC = () => {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    git_history: true,
    reproducibility: true,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalScore = AUDITOR_CRITERIA.reduce((acc, item) => {
    return checkedItems[item.id] ? acc + item.weight : acc;
  }, 0);

  const getScoreVerdict = () => {
    if (totalScore >= 80) {
      return {
        label: 'Institutional Grade (High Signal)',
        desc: 'Your portfolio demonstrates credible, reproducible engineering that satisfies WSAIS FAQ 22 committee standards.',
        color: 'emerald',
      };
    }
    if (totalScore >= 45) {
      return {
        label: 'Moderate Signal (Polish Needed)',
        desc: 'Good start, but lacks reproducibility or commit authenticity. Add test logs and clean up README before applying.',
        color: 'amber',
      };
    }
    return {
      label: 'High Rejection Risk (Sub-Baseline)',
      desc: 'At high risk of being filtered out before the hackathon. Follow the guidelines below to build verifiable evidence.',
      color: 'red',
    };
  };

  const verdict = getScoreVerdict();

  const sampleReadmeTemplate = `# [Project Name]: Network Packet Anomaly Detector

## 1. Problem Statement
Detects ARP spoofing and irregular DNS tunneling queries in a local network segment without relying on third-party commercial software.

## 2. Technical Architecture & Implementation
- Written in Python 3 using raw socket parsing and \`struct\` unpack.
- Operates directly at the Ethernet frame level to capture MAC-IP mapping changes in real-time.
- Zero high-level wrapper dependencies for core packet extraction.

## 3. How to Reproduce & Run Locally
\`\`\`bash
# Clone the repository
git clone https://github.com/username/project-name.git
cd project-name

# Run with root privileges (required for raw sockets)
sudo python3 detector.py --interface eth0
\`\`\`

## 4. Test Runs & Proof of Execution
Tested against simulated ARP poisoning attack via Scapy in a virtual subnet:
\`\`\`text
[+] Listening on eth0 (Promiscuous Mode)...
[ALERT 14:02:11] Irregular MAC update detected on Gateway IP: 192.168.1.1
    Expected MAC: 00:11:22:33:44:55
    Spoofed MAC:  AA:BB:CC:DD:EE:FF
[ACTION] Dropped unverified ARP broadcast frame.
\`\`\`
`;

  const copyTemplate = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(id);
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  return (
    <div className="w-full rounded-3xl border border-[#c2c6d6]/35 bg-white shadow-xs overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-[#fafbfc] p-5 sm:p-7 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 font-bold">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Senate Requirement: WSAIS FAQ 22</span>
          </div>
          <span className="text-xs text-slate-500 font-mono font-medium">
            Easily Verifiable Evidence Standard
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0b1c30]">
            Proof-of-Work Standards: High-Signal vs. Immediate Rejections
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
            Under WSAIS FAQ 22, candidates must submit <em>easily verifiable evidence of prior work in cybersecurity, computing, or related fields</em>. Use the interactive portfolio auditor below to check whether your code satisfies institutional review criteria.
          </p>
        </div>

        {/* Epistemic Labeling Callout */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-xs text-slate-700 flex items-start gap-2.5 shadow-2xs">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">Epistemic Standard:</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Submitting verifiable prior work is an <strong className="text-slate-900">Official Senate Requirement</strong> under WSAIS FAQ 22. The 5-point self-audit rubric and README format below are <strong className="text-[#0058be]">Our institutional preparation recommendations</strong> to ensure your portfolio survives manual committee scrutiny.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8 space-y-8">
        {/* INTERACTIVE TOOL: Live PoW Portfolio Auditor */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Interactive Tool
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Self-Audit Your Technical Portfolio</span>
                <span className="text-xs font-normal text-slate-500">(WSAIS FAQ 22 Rubric)</span>
              </h3>
            </div>

            {/* Score Capsule */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Signal Score</span>
                <span className={cn(
                  'text-lg font-black font-mono',
                  verdict.color === 'emerald' ? 'text-emerald-700' : verdict.color === 'amber' ? 'text-amber-700' : 'text-red-700'
                )}>
                  {totalScore}/100
                </span>
              </div>
              <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    verdict.color === 'emerald' ? 'bg-emerald-500' : verdict.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
                  )}
                  style={{ width: `${totalScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* 5 Checkable Criteria */}
          <div className="space-y-2.5">
            {AUDITOR_CRITERIA.map((criterion) => {
              const isChecked = !!checkedItems[criterion.id];
              return (
                <button
                  key={criterion.id}
                  type="button"
                  onClick={() => toggleCheck(criterion.id)}
                  className={cn(
                    'w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5',
                    isChecked
                      ? 'border-emerald-500/70 bg-emerald-50/50 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50/80'
                  )}
                >
                  <span className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300" />
                    )}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={cn('text-xs font-bold block', isChecked ? 'text-slate-900' : 'text-slate-700')}>
                        {criterion.label}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-slate-400">
                        +{criterion.weight} pts
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 leading-relaxed block mt-0.5">
                      {criterion.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Score Verdict Banner */}
          <div className={cn(
            'p-4 rounded-2xl border text-xs leading-relaxed space-y-1',
            verdict.color === 'emerald' ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : verdict.color === 'amber' ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-red-50/80 border-red-200 text-red-950'
          )}>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider">Evaluation Verdict:</span>
              <span className="font-extrabold">{verdict.label}</span>
            </div>
            <p className="text-[11px] text-slate-700">
              {verdict.desc}
            </p>
          </div>
        </div>

        {/* Comparison Matrix Cards */}
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Institutional Baseline Rubric
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Approved Submissions vs. Automatic Rejection Patterns
            </h3>
          </div>

          {PROOF_OF_WORK_STANDARDS.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xs space-y-0"
            >
              {/* Category Header */}
              <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Senate Standard
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">WSAIS FAQ 22 Criterion</span>
              </div>

              {/* Side-by-Side: Pass vs Fail */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {/* Approved (Green) */}
                <div className="p-5 bg-emerald-50/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <h4 className="text-xs font-bold text-emerald-950">
                        {item.approvedPattern.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      High Signal
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {item.approvedPattern.description}
                  </p>
                  <ul className="space-y-1.5 text-xs pt-1">
                    {item.approvedPattern.examples.map((ex, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-800 text-[11px]">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rejected (Red) */}
                <div className="p-5 bg-red-50/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <h4 className="text-xs font-bold text-red-950">
                        {item.rejectionPattern.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                      Rejection Risk
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {item.rejectionPattern.description}
                  </p>
                  <ul className="space-y-1.5 text-xs pt-1">
                    {item.rejectionPattern.examples.map((ex, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                        <span className="text-red-500 font-bold shrink-0">✗</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actionable Template Drawer with 1-Click Copy */}
        <div className="rounded-3xl border border-slate-900 bg-[#0b1c30] text-white p-6 sm:p-7 space-y-4 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <FileCode className="w-5 h-5 text-[#d1f34d] shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Verifiable Project README Template
                </h3>
                <p className="text-[11px] text-slate-300">
                  Standard format to demonstrate 1-command reproducibility for your personal GitHub repositories.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyTemplate(sampleReadmeTemplate, 'readme')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d1f34d] text-slate-950 text-xs font-bold hover:bg-[#c0e045] transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
            >
              {copiedTemplate === 'readme' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-950" />
                  <span>Copy Markdown Template</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-xs font-mono bg-slate-950/80 p-4 sm:p-5 rounded-2xl overflow-x-auto text-slate-300 leading-relaxed border border-white/10">
            {sampleReadmeTemplate}
          </pre>
        </div>
      </div>
    </div>
  );
};
