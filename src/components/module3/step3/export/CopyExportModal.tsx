import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Download, CheckCircle2, FileText, Code2, FileDown, Sparkles, ShieldCheck } from 'lucide-react';
import type { ProfileSystemAsset } from '@/src/data/module3/authority-suite-engine';
import { downloadSocialIdentityPdf, type AuthorityScoreData } from '@/src/lib/module3/social-identity-pdf';

interface CopyExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileSystem: ProfileSystemAsset[];
  userName: string;
  userHandle?: string;
  positioningHeadline?: string;
  proofLine?: string;
  uniqueMechanism?: string;
  activeTone?: string;
  authorityScore?: AuthorityScoreData;
}

export function CopyExportModal({
  isOpen,
  onClose,
  profileSystem,
  userName,
  userHandle = 'expert',
  positioningHeadline = '',
  proofLine = '',
  uniqueMechanism = '',
  activeTone = 'executive',
  authorityScore,
}: CopyExportModalProps) {
  const [format, setFormat] = useState<'markdown' | 'json' | 'pdf'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const defaultScore: AuthorityScoreData = authorityScore || {
    total: 90,
    baseline: 38,
    improvement: 52,
    improvementPct: 137,
    positioningClarity: { score: 23, maxScore: 25 },
    platformCompleteness: { score: 22, maxScore: 25 },
    toneConsistency: { score: 23, maxScore: 25 },
    ctaPresence: { score: 22, maxScore: 25 },
  };

  const generateMarkdown = () => {
    const lines: string[] = [];
    lines.push(`# Authority Suite Profile Identity Export`);
    lines.push(`**Generated for:** ${userName || 'Operator'}`);
    lines.push(`**Date:** ${new Date().toLocaleDateString()}\n`);
    lines.push(`---\n`);

    profileSystem.forEach(item => {
      lines.push(`## ${item.platform.toUpperCase()}`);
      item.fields.forEach(f => {
        lines.push(`**${f.label}:**\n${f.value}\n`);
      });
      lines.push(`---\n`);
    });

    return lines.join('\n');
  };

  const generateJSON = () => {
    return JSON.stringify(
      {
        user: userName || 'Operator',
        exportedAt: new Date().toISOString(),
        profiles: profileSystem,
      },
      null,
      2
    );
  };

  const exportContent = format === 'markdown' ? generateMarkdown() : generateJSON();

  const handleCopy = () => {
    navigator.clipboard.writeText(exportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (format === 'pdf') {
      downloadSocialIdentityPdf({
        userName,
        userHandle,
        positioningHeadline,
        proofLine,
        uniqueMechanism,
        activeTone,
        authorityScore: defaultScore,
        profileSystem,
      });
      return;
    }

    const blob = new Blob([exportContent], { type: format === 'markdown' ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `authority_profiles_${format === 'markdown' ? 'export.md' : 'export.json'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-[#0058be]">
                <FileText size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Export All Profile Copy</h3>
                <p className="text-xs text-neutral-500">Copy or download your unified authority bios across all platforms</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Format Picker */}
          <div className="px-6 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl">
              <button
                onClick={() => setFormat('markdown')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  format === 'markdown' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <FileText size={13} />
                Markdown
              </button>
              <button
                onClick={() => setFormat('json')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  format === 'json' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Code2 size={13} />
                JSON
              </button>
              <button
                onClick={() => setFormat('pdf')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  format === 'pdf' ? 'bg-[#0058be] text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <FileDown size={13} />
                PDF Dossier
              </button>
            </div>
            <span className="text-[11px] text-neutral-400 font-medium">
              {profileSystem.length} Platforms Included
            </span>
          </div>

          {/* Preview Box */}
          <div className="p-6 flex-1 overflow-hidden flex flex-col">
            {format === 'pdf' ? (
              <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl p-5 overflow-y-auto space-y-4 text-left">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#0b1c30] to-[#061b4f] text-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#38bdf8]">
                      Level 01 Certified Executive Asset
                    </span>
                    <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-white/90">
                      Print-Ready A4
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">Social Profile Identity & Authority Dossier</h4>
                  <p className="text-xs text-neutral-300">
                    4 Structured Sections · Full Multi-Platform Copy Vault · Calibrated for {userName || 'Operator'}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <h5 className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#0058be]" />
                    Document Architecture & Sections Included:
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
                      <span className="text-[10px] font-bold text-[#0058be] block">SECTION 01</span>
                      <strong className="text-xs text-[#0b1c30] block">Core Positioning Thesis</strong>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Master headline, proof statement & proprietary mechanism</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
                      <span className="text-[10px] font-bold text-emerald-700 block">SECTION 02</span>
                      <strong className="text-xs text-[#0b1c30] block">Authority Audit & Transformation</strong>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Baseline {defaultScore.baseline} → Optimized {defaultScore.total} (+{defaultScore.improvement} pts gain)
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
                      <span className="text-[10px] font-bold text-[#0058be] block">SECTION 03</span>
                      <strong className="text-xs text-[#0b1c30] block">Multi-Platform Copy Vault</strong>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {profileSystem.length} platform packages (Headlines, bios, banners, CTAs)
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
                      <span className="text-[10px] font-bold text-indigo-600 block">SECTION 04</span>
                      <strong className="text-xs text-[#0b1c30] block">Continuity Protocol</strong>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Launch window, CTA uniformity & zero tone drift rules</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <pre className="flex-1 bg-neutral-900 text-neutral-100 text-xs font-mono p-4 rounded-xl overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                {exportContent}
              </pre>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 bg-neutral-50/50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
            >
              Close
            </button>
            <div className="flex items-center gap-2.5">
              {format !== 'pdf' && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {copied ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copied ? 'Copied to Clipboard' : 'Copy All'}
                </button>
              )}
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0058be] hover:bg-[#0048a0] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {format === 'pdf' ? <FileDown size={14} /> : <Download size={14} />}
                {format === 'pdf' ? 'Download PDF Dossier' : `Download ${format.toUpperCase()}`}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
