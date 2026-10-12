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
} from 'lucide-react';
import { PROOF_OF_WORK_STANDARDS } from '../../content/b-cyber/knowledge-base';
import { cn } from '../../lib/utils';

export const BCyberProofOfWorkFilter: React.FC = () => {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const sampleReadmeTemplate = `# [Project Name]: Network Packet Anomaly Detector

## 1. Problem Statement
Detects ARP spoofing and irregular DNS tunneling queries in a local network segment.

## 2. Technical Architecture
- Written in Python using raw socket parsing and \`struct\` unpack.
- Analyzes Ethernet frame headers without relying on high-level external libraries.

## 3. How to Reproduce & Run
\`\`\`bash
git clone https://github.com/username/project-name.git
cd project-name
sudo python3 detector.py --interface eth0
\`\`\`

## 4. Test Runs & Packet Capture Snippets
Tested against simulated ARP poisoning attack via Scapy.
Terminal output:
[ALERT] Irregular MAC update detected on Gateway IP: 192.168.1.1
`;

  const copyTemplate = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(id);
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 font-semibold">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official requirement (WSAIS FAQ 22)</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Easily Verifiable Evidence Criterion
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          Portfolio &amp; Evidence Standards: High-Signal vs. Rejections
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Under WSAIS FAQ 22, candidates must submit <em>easily verifiable evidence of prior work in cybersecurity, computing, or related fields</em>. To help candidates submit credible evidence, the comparisons below distinguish between verified requirements and recommended documentation formats.
        </p>

        {/* Epistemic Labeling Callout */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-700 flex items-start gap-2.5 shadow-2xs">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">Epistemic Clarity &amp; Labeling</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Submitting verifiable prior work is an <strong className="text-slate-900">Official requirement</strong> under WSAIS FAQ 22. The specific documentation structures, multi-month commit cadence, and README templates shown below are <strong className="text-blue-700">Our preparation recommendation</strong> to ensure your portfolio survives manual committee scrutiny and avoids being dismissed as automated spam.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8 space-y-8">
        {/* Comparison Matrix Cards */}
        <div className="space-y-4">
          {PROOF_OF_WORK_STANDARDS.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs space-y-0"
            >
              {/* Category Header */}
              <div className="bg-slate-100/70 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Official requirement
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">WSAIS FAQ 22 Criterion</span>
              </div>

              {/* Side-by-Side: Pass vs Fail */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {/* Approved (Green) */}
                <div className="p-4 sm:p-5 bg-emerald-50/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <h3 className="text-xs font-bold text-emerald-950">
                        {item.approvedPattern.title}
                      </h3>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      Our preparation recommendation
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {item.approvedPattern.description}
                  </p>
                  <ul className="space-y-1 text-xs pt-1">
                    {item.approvedPattern.examples.map((ex, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-800 text-[11px]">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rejected (Red) */}
                <div className="p-4 sm:p-5 bg-red-50/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <h3 className="text-xs font-bold text-red-950">
                        {item.rejectionPattern.title}
                      </h3>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                      Observed rejection pattern
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {item.rejectionPattern.description}
                  </p>
                  <ul className="space-y-1 text-xs pt-1">
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

        {/* Actionable Template Drawer */}
        <div className="rounded-xl border border-slate-200 bg-slate-900 text-white p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    Verifiable Project README Template
                  </h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-900 text-blue-200 border border-blue-700">
                    Our preparation recommendation
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Recommended markdown format for your personal repository to show reproducibility.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyTemplate(sampleReadmeTemplate, 'readme')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto shrink-0"
            >
              {copiedTemplate === 'readme' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown Template</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-xs font-mono bg-slate-950 p-4 rounded-lg overflow-x-auto text-slate-300 leading-relaxed border border-slate-800">
            {sampleReadmeTemplate}
          </pre>
        </div>
      </div>
    </div>
  );
};
