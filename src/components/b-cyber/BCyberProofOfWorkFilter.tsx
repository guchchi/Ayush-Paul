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
      <div className="border-b border-slate-100 bg-slate-50/70 p-5 sm:p-6 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-[11px] font-mono text-emerald-800 font-semibold">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>WSAIS FAQ 22 Evidence Standards</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Easily Verifiable Evidence Criterion
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          The Admissions Committee&apos;s Portfolio Filter: High-Signal vs. Rejections
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Under WSAIS FAQ 22, shortlisting evaluates <em>criticality, technical depth, and reproducibility</em>. Generic video course certificates and automated vulnerability scanner exports are systematically filtered out.
        </p>
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
              <div className="bg-slate-100/70 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">FAQ 22 Criterion</span>
              </div>

              {/* Side-by-Side: Pass vs Fail */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {/* Approved (Green) */}
                <div className="p-4 sm:p-5 bg-emerald-50/20 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h3 className="text-xs font-bold text-emerald-950">
                      {item.approvedPattern.title}
                    </h3>
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
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <h3 className="text-xs font-bold text-red-950">
                      {item.rejectionPattern.title}
                    </h3>
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
              <FileCode className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Verifiable Project README Template (1-Click Copy)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => copyTemplate(sampleReadmeTemplate, 'readme')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
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

          <p className="text-xs text-slate-400 leading-relaxed">
            Use this format in your GitHub repository so the IIT Kanpur admissions committee can immediately clone, verify, and execute your code in under 60 seconds.
          </p>

          <pre className="p-3 bg-black/40 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto custom-scrollbar border border-white/10 leading-relaxed">
            {sampleReadmeTemplate}
          </pre>
        </div>
      </div>
    </div>
  );
};
