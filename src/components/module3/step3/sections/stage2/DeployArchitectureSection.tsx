/**
 * DeployArchitectureSection.tsx — Level 2 / Sub-Step 5: Conversion Audit & Blueprint Export
 *
 * Computes the 5-dimension portfolio conversion readiness score,
 * provides pre-flight checklist, and enables 1-click Markdown, JSON,
 * and executive PDF blueprint export.
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Rocket,
  ShieldCheck,
  Download,
  Copy,
  Check,
  CheckCircle2,
  FileCode,
  FileText,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { useModule3Store } from '../../../../../lib/module3/store';
import {
  PORTFOLIO_ARCHETYPES,
  calculatePortfolioConversionScore,
} from '../../../../../lib/module3/portfolio-architecture-engine';
import { generatePortfolioArchitecturePdf } from '../../../../../lib/module3/portfolio-architecture-pdf';
import { ModuleButton } from '../../../../workspace/ModuleButton';

interface Props {
  onComplete: () => void;
}

export const DeployArchitectureSection: React.FC<Props> = React.memo(({ onComplete }) => {
  const {
    authoritySuite,
    stage2Archetype,
    stage1Identity,
    mod1ServiceId,
    mod1MarketId,
    mod2UniqueMechanism,
  } = useModule3Store();

  const [copiedMd, setCopiedMd] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    hero_hook: true,
    proof_early: true,
    offer_scope: true,
    faq_handled: true,
    risk_reversal: true,
  });

  const sections = useMemo(() => {
    return authoritySuite?.portfolioBlueprint ?? [];
  }, [authoritySuite?.portfolioBlueprint]);

  const activeSections = useMemo(() => {
    return sections.filter((s) => s.isEnabled !== false);
  }, [sections]);

  const archetype = useMemo(() => {
    return PORTFOLIO_ARCHETYPES.find((a) => a.id === stage2Archetype?.selectedArchetypeId) || PORTFOLIO_ARCHETYPES[0];
  }, [stage2Archetype?.selectedArchetypeId]);

  const audit = useMemo(() => {
    return calculatePortfolioConversionScore(sections, mod1ServiceId, mod2UniqueMechanism);
  }, [sections, mod1ServiceId, mod2UniqueMechanism]);

  const handleToggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Copy Full Markdown Spec
  const handleCopyMarkdown = () => {
    const md = [
      `# Executive Portfolio Architecture Specification`,
      `**Prepared For:** ${stage1Identity?.userName || 'Specialist'}`,
      `**Archetype:** ${archetype.name}`,
      `**Conversion Score:** ${audit.totalScore}/100 (${audit.ratingLabel})`,
      `**Unique Mechanism:** ${mod2UniqueMechanism || 'Proof-First Delivery Framework'}`,
      `\n---\n`,
      ...activeSections.map(
        (s, idx) =>
          `## ${idx + 1}. ${s.title}\n` +
          `**Purpose:** ${s.purpose}\n` +
          `**Conversion Rationale:** ${s.conversionReasoning}\n` +
          `**Headline:** ${s.headline}\n` +
          `**Subheadline:** ${s.subheadline}\n` +
          `**Body Narrative:** ${s.bodyCopy}\n` +
          `**CTA Button:** ${s.ctaText}\n` +
          (s.trustStatement ? `**Trust Guarantee:** ${s.trustStatement}\n` : '') +
          `**Visual Component Directive:** ${s.recommendedVisuals}\n`
      ),
    ].join('\n\n');

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2500);
  };

  // Download JSON Spec
  const handleDownloadJson = () => {
    const data = {
      specName: 'Executive Portfolio Architecture',
      userName: stage1Identity?.userName || 'Specialist',
      archetype: archetype.name,
      auditScore: audit.totalScore,
      rating: audit.ratingLabel,
      generatedAt: new Date().toISOString(),
      sections: activeSections,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Portfolio_Architecture_Spec_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Executive PDF Blueprint
  const handleExportPdf = () => {
    setDownloadingPdf(true);
    try {
      const doc = generatePortfolioArchitecturePdf({
        userName: stage1Identity?.userName || 'Specialist',
        positioningHeadline: stage1Identity?.positioningHeadline || 'Authority Specialist',
        uniqueMechanism: mod2UniqueMechanism || 'Proof-First Delivery Framework',
        serviceId: mod1ServiceId,
        marketId: mod1MarketId,
        archetype,
        auditScore: audit,
        sections,
      });

      doc.save(`Executive_Portfolio_Architecture_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('[DeployArchitecture] Failed to generate PDF:', err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#061b4f] via-[#0b1c30] to-[#1e1b4b] text-white p-6 sm:p-7 rounded-3xl shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Rocket size={15} />
          <span>Step 5 of 5 — Deploy &amp; Architecture Handoff</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          Portfolio Conversion Audit &amp; Master Export
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Verify your portfolio conversion readiness score, review pre-flight directives, and export your production-ready developer handoff blueprint.
        </p>
      </div>

      {/* Conversion Score Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-neutral-400 block">
              Automated Audit Result
            </span>
            <h3 className="text-lg font-black text-[#0b1c30] mt-0.5">
              Portfolio Architecture Conversion Health
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-black text-[#0b1c30] block leading-none">
                {audit.totalScore}
                <span className="text-sm font-normal text-neutral-400"> / 100</span>
              </span>
              <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block mt-1', audit.ratingColor)}>
                {audit.ratingLabel}
              </span>
            </div>
          </div>
        </div>

        {/* 5-Dimension Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {Object.entries(audit.dimensionScores).map(([key, dim]) => {
            const pct = Math.round((dim.score / dim.max) * 100);
            return (
              <div key={key} className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-800 text-[11px] truncate">{dim.label}</span>
                  <span className="font-mono font-bold text-[#0058be] text-xs shrink-0">
                    {dim.score}/{dim.max} pts
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-[#0058be]' : 'bg-amber-500'
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-[10px] text-neutral-500 leading-snug font-medium line-clamp-2">
                  {dim.tip}
                </p>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        {audit.recommendations.length > 0 && (
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs space-y-1.5 text-amber-900">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <AlertCircle size={14} className="text-amber-600" />
              <span>Conversion Optimization Directives:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-900/90 pl-1 font-medium">
              {audit.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Export Hub Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
        <div>
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#0058be] bg-[#0058be]/10 px-2.5 py-0.5 rounded-full border border-[#0058be]/20">
            Export Suite
          </span>
          <h3 className="text-lg font-black text-[#0b1c30] mt-1">
            Master Portfolio Blueprint Handoff
          </h3>
          <p className="text-xs text-neutral-500">
            Export your complete architecture spec to hand off to a developer or import into Webflow/Framer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Executive PDF Export */}
          <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[#0058be]">
                <FileText size={20} />
                <h4 className="font-bold text-sm text-[#0b1c30]">Executive PDF Blueprint</h4>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Multi-page vector PDF containing executive title block, funnel scorecard, and complete section specifications.
              </p>
            </div>

            <button
              onClick={handleExportPdf}
              disabled={downloadingPdf}
              className="w-full py-2.5 px-4 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download size={14} />
              <span>{downloadingPdf ? 'Generating PDF...' : 'Download PDF Blueprint'}</span>
            </button>
          </div>

          {/* Copy Markdown Spec */}
          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-800">
                <Copy size={20} />
                <h4 className="font-bold text-sm text-[#0b1c30]">Markdown Copy Vault</h4>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Copy full structured markdown to paste into Notion, Google Docs, or Figma copy components.
              </p>
            </div>

            <button
              onClick={handleCopyMarkdown}
              className="w-full py-2.5 px-4 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              {copiedMd ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedMd ? 'Copied to Clipboard!' : 'Copy Markdown Spec'}</span>
            </button>
          </div>

          {/* Download JSON Spec */}
          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-700">
                <FileCode size={20} />
                <h4 className="font-bold text-sm text-[#0b1c30]">Developer JSON Export</h4>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Raw JSON data contract with section IDs, order, and copy assets for headless site builds.
              </p>
            </div>

            <button
              onClick={handleDownloadJson}
              className="w-full py-2.5 px-4 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Download size={14} />
              <span>Download JSON Spec</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pre-Flight Launch Checklist */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
        <h4 className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Pre-Flight Architecture Verification Checklist</span>
        </h4>

        <div className="space-y-2 text-xs">
          {[
            { id: 'hero_hook', label: 'Hero headline names target client and proprietary unique mechanism clearly.' },
            { id: 'proof_early', label: 'Verifiable proof is positioned within the top 3 sections to eliminate skepticism.' },
            { id: 'offer_scope', label: 'Service offerings feature explicit package deliverables and engagement models.' },
            { id: 'faq_handled', label: 'High-ticket buying objections (price, timeline, scope) are addressed in FAQ.' },
            { id: 'risk_reversal', label: 'Primary CTA button includes a risk-reversal guarantee or confidentiality note.' },
          ].map((item) => (
            <label
              key={item.id}
              onClick={() => handleToggleCheck(item.id)}
              className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={checklist[item.id] || false}
                onChange={() => {}}
                className="mt-0.5 rounded text-[#0058be] focus:ring-[#0058be]"
              />
              <span className={cn('text-neutral-700 font-medium', checklist[item.id] && 'text-neutral-900 font-bold')}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <div className="text-xs text-neutral-500">
          Level 2 Complete: Portfolio Architecture Blueprint ready for Level 3.
        </div>

        <ModuleButton onClick={onComplete}>
          Complete Level 2 &amp; Continue to Level 3 →
        </ModuleButton>
      </div>
    </div>
  );
});
