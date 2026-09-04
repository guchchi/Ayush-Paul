/**
 * SectionSpecStudio.tsx — Level 2 / Sub-Step 3: Section Copy, Visuals & Proof Injector
 *
 * Deep section-by-section copy and visual specification studio.
 * Supports headline, subheadline, body copy, CTA button, trust guarantee,
 * visual component specs, and 1-click tone variation regeneration.
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Lightbulb,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag,
  Palette,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { useModule3Store } from '../../../../../lib/module3/store';
import { ModuleButton } from '../../../../workspace/ModuleButton';
import type { PortfolioBlueprintSection } from '../../../../../data/module3/authority-suite-engine';

interface Props {
  onContinue: () => void;
}

export const SectionSpecStudio: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    authoritySuite,
    updatePortfolioSection,
    mod1ServiceId,
    mod1MarketId,
    mod2UniqueMechanism,
    proofAssets,
  } = useModule3Store();

  const sections = useMemo(() => {
    return authoritySuite?.portfolioBlueprint ?? [];
  }, [authoritySuite?.portfolioBlueprint]);

  const activeSections = useMemo(() => {
    return sections.filter((s) => s.isEnabled !== false);
  }, [sections]);

  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    activeSections[0]?.id || 'section_hero'
  );

  const selectedSection = useMemo(() => {
    return sections.find((s) => s.id === selectedSectionId) || activeSections[0] || sections[0];
  }, [sections, selectedSectionId, activeSections]);

  const market = (mod1MarketId || '').replace(/_/g, ' ') || 'clients';
  const service = (mod1ServiceId || '').replace(/_/g, ' ') || 'services';
  const mechanism = mod2UniqueMechanism || 'Proof-First Architecture';

  const handleFieldChange = (field: keyof PortfolioBlueprintSection, value: any) => {
    if (!selectedSection) return;
    updatePortfolioSection(selectedSection.id, { [field]: value });
  };

  // Tone quick-suggestions for the current section
  const handleApplyTone = (tone: 'executive' | 'conversion' | 'direct') => {
    if (!selectedSection) return;

    let newHeadline = selectedSection.headline;
    let newSubhead = selectedSection.subheadline;

    if (selectedSection.id === 'section_hero') {
      if (tone === 'executive') {
        newHeadline = `High-Certainty ${service} for ${market}`;
        newSubhead = `Enterprise-grade systems engineered via ${mechanism}. Predictable scale with zero agency overhead.`;
      } else if (tone === 'conversion') {
        newHeadline = `Stop Gambling on Generic ${service}. Deploy ${mechanism}.`;
        newSubhead = `Eliminate delivery risk with self-initiated proof demonstrations and verified results for ${market}.`;
      } else {
        newHeadline = `Predictable ${service} Powered by ${mechanism}`;
        newSubhead = `We build and deploy verifiable ${service} systems for ${market}. No pitch decks, just verified output.`;
      }
    } else if (selectedSection.id === 'section_proof') {
      if (tone === 'executive') {
        newHeadline = `Verifiable Output Repository & Architecture Schematics`;
        newSubhead = `Inspect technical execution standards and live client deliverables before engagement.`;
      } else if (tone === 'conversion') {
        newHeadline = `Don't Take Our Word For It. Inspect The Proof.`;
        newSubhead = `Live interactive demos, recorded walkthroughs, and verified metrics from real engagements.`;
      } else {
        newHeadline = `Live Proof Gallery: Direct Execution Outputs`;
        newSubhead = `Transparent breakdown of codebases, design files, and deployment pipelines.`;
      }
    } else if (selectedSection.id === 'section_services') {
      if (tone === 'executive') {
        newHeadline = `High-Certainty ${service} Engagements`;
        newSubhead = `Structured sprint deliverables and retainer partnerships tailored for ${market}.`;
      } else if (tone === 'conversion') {
        newHeadline = `Predictable Outcomes. Zero Scope Bloat.`;
        newSubhead = `Choose your engagement tier backed by milestone verification and weekly deliverables.`;
      } else {
        newHeadline = `Fixed-Scope ${service} Packages`;
        newSubhead = `Direct access to senior execution. Fast turnaround, transparent pricing.`;
      }
    }

    updatePortfolioSection(selectedSection.id, {
      headline: newHeadline,
      subheadline: newSubhead,
    });
  };

  // Quick Inject Step 2 Proof Asset Title into headline or body
  const handleInjectProof = (proofTitle: string) => {
    if (!selectedSection) return;
    const currentBody = selectedSection.bodyCopy || '';
    const updatedBody = currentBody.includes(proofTitle)
      ? currentBody
      : `${currentBody}\n\nFeatured Proof Demonstration: "${proofTitle}".`;
    handleFieldChange('bodyCopy', updatedBody);
  };

  if (!selectedSection) {
    return (
      <div className="p-12 text-center text-neutral-400">
        <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50 animate-pulse text-[#0058be]" />
        <p className="font-bold text-sm">Generating portfolio section copy...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-1">
        <div className="flex items-center gap-2 text-[#0058be] text-xs font-mono font-bold uppercase tracking-wider">
          <FileText size={15} />
          <span>Step 3 of 5 — Copy &amp; Spec Studio</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0b1c30]">
          Section Copy, Visuals &amp; Proof Injector
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
          Craft high-converting headlines, body copy, CTA labels, and layout directives for each active section. Inject real proof assets from Step 2 directly into the narrative.
        </p>
      </div>

      {/* Main Grid: Left Navigator (4 cols) + Right Editor (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Section Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
              Active Sections ({activeSections.length})
            </span>
            <span className="text-xs text-[#0058be] font-bold">
              Click to Inspect
            </span>
          </div>

          <div className="space-y-1.5">
            {activeSections.map((sec, idx) => {
              const isSelected = sec.id === selectedSection.id;
              const hasCustomized = !!(sec.isHeadlineCustomized || sec.isBodyCustomized || sec.isCustomized);

              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={cn(
                    'w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2',
                    isSelected
                      ? 'bg-white border-[#0058be] shadow-sm ring-2 ring-[#0058be]/15'
                      : 'bg-neutral-50/70 hover:bg-white border-neutral-200/80'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={cn(
                        'w-7 h-7 rounded-xl text-xs font-mono font-bold flex items-center justify-center shrink-0 border',
                        isSelected
                          ? 'bg-[#0058be] text-white border-[#0058be]'
                          : 'bg-white text-neutral-600 border-neutral-200'
                      )}
                    >
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h4
                        className={cn(
                          'text-xs font-bold truncate',
                          isSelected ? 'text-[#0058be]' : 'text-neutral-800'
                        )}
                      >
                        {sec.title}
                      </h4>
                      <span className="text-[10px] text-neutral-400 block truncate">
                        {sec.ctaText || 'Informational'}
                      </span>
                    </div>
                  </div>

                  {hasCustomized ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Customized" />
                  ) : (
                    <span className="text-[10px] text-neutral-400 font-bold shrink-0">Auto</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Section Editor */}
        <div className="lg:col-span-8 space-y-4 bg-white p-5 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#0058be] bg-[#0058be]/10 px-2.5 py-0.5 rounded-full border border-[#0058be]/20">
                Section #{selectedSection.sectionNumber || 1} • {selectedSection.id}
              </span>
              <h3 className="text-lg font-black text-[#0b1c30] mt-1">
                {selectedSection.title}
              </h3>
            </div>

            {/* Quick Tone Switcher Buttons */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200 shrink-0">
              <span className="text-[10px] font-bold text-neutral-500 px-1.5 uppercase">Tone:</span>
              <button
                onClick={() => handleApplyTone('executive')}
                className="px-2 py-1 text-[11px] font-bold bg-white text-neutral-700 hover:text-[#0058be] rounded-lg shadow-2xs cursor-pointer transition-colors"
                title="Apply authoritative corporate tone"
              >
                Executive
              </button>
              <button
                onClick={() => handleApplyTone('conversion')}
                className="px-2 py-1 text-[11px] font-bold bg-white text-neutral-700 hover:text-[#0058be] rounded-lg shadow-2xs cursor-pointer transition-colors"
                title="Apply punchy conversion-oriented tone"
              >
                Conversion
              </button>
              <button
                onClick={() => handleApplyTone('direct')}
                className="px-2 py-1 text-[11px] font-bold bg-white text-neutral-700 hover:text-[#0058be] rounded-lg shadow-2xs cursor-pointer transition-colors"
                title="Apply clear, direct specialist tone"
              >
                Direct
              </button>
            </div>
          </div>

          {/* Strategic Rationale Callout */}
          <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200/80 space-y-1 text-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0058be] flex items-center gap-1">
              <Lightbulb size={12} />
              Strategic Conversion Purpose
            </span>
            <p className="text-neutral-700 font-medium leading-relaxed">
              {selectedSection.conversionReasoning || selectedSection.purpose}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-xs">
            {/* Headline */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px]">
                  Section Headline
                </label>
                <span className="text-neutral-400 text-[10px]">
                  {(selectedSection.headline || '').length} chars
                </span>
              </div>
              <input
                type="text"
                value={selectedSection.headline || ''}
                onChange={(e) => handleFieldChange('headline', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/10 transition-all"
                placeholder="High-converting headline..."
              />
            </div>

            {/* Subheadline */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px]">
                  Section Subheadline
                </label>
                <span className="text-neutral-400 text-[10px]">
                  {(selectedSection.subheadline || '').length} chars
                </span>
              </div>
              <input
                type="text"
                value={selectedSection.subheadline || ''}
                onChange={(e) => handleFieldChange('subheadline', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-800 font-medium focus:outline-none focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/10 transition-all"
                placeholder="Subheadline explaining value or context..."
              />
            </div>

            {/* Body Copy */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px]">
                  Body Copy &amp; Narrative
                </label>
                <span className="text-neutral-400 text-[10px]">
                  {(selectedSection.bodyCopy || '').split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={4}
                value={selectedSection.bodyCopy || ''}
                onChange={(e) => handleFieldChange('bodyCopy', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-800 leading-relaxed focus:outline-none focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/10 transition-all resize-y"
                placeholder="Detailed copy narrative..."
              />
            </div>

            {/* Primary CTA & Trust Line (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px]">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={selectedSection.ctaText || ''}
                  onChange={(e) => handleFieldChange('ctaText', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-[#0058be] focus:outline-none focus:border-[#0058be] transition-all"
                  placeholder="Button label (e.g. Schedule Call)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 uppercase tracking-wider text-[10px]">
                  Trust Statement / Guarantee
                </label>
                <input
                  type="text"
                  value={selectedSection.trustStatement || ''}
                  onChange={(e) => handleFieldChange('trustStatement', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-emerald-800 font-medium focus:outline-none focus:border-emerald-500 transition-all"
                  placeholder="🛡️ Zero risk guarantee line"
                />
              </div>
            </div>

            {/* Visual Specs & Animation Suggestion */}
            <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200/80 space-y-2 text-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <Palette size={12} className="text-[#0058be]" />
                Recommended Layout &amp; Visual Components
              </span>
              <p className="text-neutral-700 font-medium">
                {selectedSection.recommendedVisuals || 'Clean high-contrast grid with interactive cards.'}
              </p>
              {selectedSection.animationSuggestion && (
                <div className="text-[11px] text-neutral-500 font-mono pt-1 border-t border-neutral-200/60">
                  ⚡ <strong>Motion:</strong> {selectedSection.animationSuggestion}
                </div>
              )}
            </div>

            {/* Step 2 Proof Linkage Injector */}
            {proofAssets && proofAssets.length > 0 && (
              <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-200/80 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0058be] flex items-center gap-1">
                  <Sparkles size={12} />
                  Inject Step 2 Proof Assets into this Section:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {proofAssets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => handleInjectProof(asset.title)}
                      className="px-2.5 py-1 bg-white hover:bg-blue-100/80 border border-blue-200 text-[#0058be] rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <Zap size={11} />
                      <span>{asset.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <div className="text-xs text-neutral-500">
          All changes are saved automatically to your authority blueprint.
        </div>

        <ModuleButton onClick={onContinue}>
          Confirm Specs &amp; Open Wireframe Simulator →
        </ModuleButton>
      </div>
    </div>
  );
});
