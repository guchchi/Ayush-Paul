import React, { useState } from 'react';
import { PortfolioBlueprintSection } from '../../../../data/module3/authority-suite-engine';
import { EditableAssetCard } from '../components/EditableAssetCard';
import { Layout, ArrowUp, ArrowDown, Eye, EyeOff, Sparkles, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';

interface Props {
  sections: PortfolioBlueprintSection[];
  onSectionChange?: (sectionId: string, updatedFields: Partial<PortfolioBlueprintSection>) => void;
  onReorderSections?: (reorderedSections: PortfolioBlueprintSection[]) => void;
}

export const PortfolioOrderingCanvas = React.memo(function PortfolioOrderingCanvas({
  sections,
  onSectionChange,
  onReorderSections,
}: Props) {
  const [expandedSectionId, setExpandedSectionId] = useState<string>(sections[0]?.id || '');
  const [copiedAll, setCopiedAll] = useState(false);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (!onReorderSections) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    const [movedItem] = newSections.splice(index, 1);
    newSections.splice(newIndex, 0, movedItem);

    const updatedWithNumbers = newSections.map((sec, idx) => ({
      ...sec,
      sectionNumber: idx + 1,
    }));

    onReorderSections(updatedWithNumbers);
  };

  const handleToggleEnable = (sectionId: string, currentEnabled: boolean) => {
    if (onSectionChange) {
      onSectionChange(sectionId, { isEnabled: !currentEnabled });
    }
  };

  const handleCopyStructure = () => {
    const text = sections
      .map(
        (s, idx) =>
          `Position ${idx + 1}: ${s.title} [Status: ${s.isEnabled === false ? 'Disabled' : 'Active'}]\n- Purpose: ${s.purpose}\n- Rationale: ${s.conversionReasoning}\n- Headline: "${s.headline}"`
      )
      .join('\n\n---\n\n');

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <section className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layout size={18} className="text-cyan-400" />
            <h3 className="text-xl font-black tracking-tight">Portfolio Authority Structural Blueprint</h3>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Arrange, enable/disable, and sequence your portfolio website sections to match your proof strategy.
          </p>
        </div>

        <button
          onClick={handleCopyStructure}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer shrink-0"
        >
          {copiedAll ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copiedAll ? 'Structure Blueprint Copied!' : 'Copy Section Order Spec'}</span>
        </button>
      </div>

      {/* Interactive Reordering Controls List */}
      <div className="space-y-3">
        {sections.map((section, idx) => {
          const isExpanded = expandedSectionId === section.id;
          const isEnabled = section.isEnabled !== false;

          return (
            <div
              key={section.id}
              className={`bg-white rounded-2xl border transition-all ${
                !isEnabled
                  ? 'opacity-60 border-dashed border-neutral-300 bg-neutral-50/50'
                  : isExpanded
                  ? 'border-blue-400 shadow-md ring-2 ring-blue-100'
                  : 'border-neutral-200/90 shadow-2xs hover:border-neutral-300'
              }`}
            >
              {/* Card Header & Reordering Controls */}
              <div className="p-4 flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Position Badge */}
                  <span className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center border shrink-0 ${
                    isEnabled ? 'bg-blue-50 text-[#0058be] border-blue-100' : 'bg-neutral-200 text-neutral-500 border-neutral-300'
                  }`}>
                    0{idx + 1}
                  </span>

                  {/* Section Title & Purpose */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-[#0b1c30] truncate">{section.title}</h4>
                      {!isEnabled && (
                        <span className="px-2 py-0.5 bg-neutral-200 text-neutral-600 text-[10px] font-bold rounded-md">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 font-medium line-clamp-1">{section.purpose}</p>
                  </div>
                </div>

                {/* Right Actions: Move Up / Down, Enable/Disable, Expand */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Move Up / Down */}
                  <div className="flex items-center bg-neutral-100 rounded-xl p-0.5 border border-neutral-200">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      title="Move Up in Sequence"
                      className="p-1 text-neutral-600 hover:text-blue-700 disabled:opacity-30 disabled:hover:text-neutral-600 cursor-pointer"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      title="Move Down in Sequence"
                      className="p-1 text-neutral-600 hover:text-blue-700 disabled:opacity-30 disabled:hover:text-neutral-600 cursor-pointer"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Toggle Active / Hidden */}
                  <button
                    onClick={() => handleToggleEnable(section.id, isEnabled)}
                    title={isEnabled ? 'Hide section from portfolio structure' : 'Activate section in portfolio structure'}
                    className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                      isEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    {isEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  {/* Expand / Collapse Details */}
                  <button
                    onClick={() => setExpandedSectionId(isExpanded ? '' : section.id)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isExpanded ? 'Hide Specs' : 'Edit Specs'}
                  </button>
                </div>
              </div>

              {/* Accordion Body: Conversion Rationale & Copy Specs */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
                    className="border-t border-neutral-100 p-5 space-y-4 bg-neutral-50/50 rounded-b-2xl"
                  >
                    {/* Position Strategy Callouts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3.5 rounded-xl border border-neutral-200/80">
                        <span className="font-bold text-blue-900 uppercase tracking-wider text-[10px] block mb-1">
                          Conversion Rationale for Position #{idx + 1}
                        </span>
                        <p className="text-neutral-700 font-medium">{section.conversionReasoning}</p>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-neutral-200/80">
                        <span className="font-bold text-indigo-900 uppercase tracking-wider text-[10px] block mb-1">
                          Recommended Visual Component
                        </span>
                        <p className="text-neutral-700 font-medium">{section.recommendedVisuals}</p>
                      </div>
                    </div>

                    {/* Copy Assets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <EditableAssetCard
                        id={`${section.id}_headline`}
                        title="Section Headline"
                        value={section.headline}
                        originalValue={section.headline}
                        onSave={(val) => onSectionChange && onSectionChange(section.id, { headline: val })}
                      />
                      <EditableAssetCard
                        id={`${section.id}_subheadline`}
                        title="Section Subheadline"
                        value={section.subheadline}
                        originalValue={section.subheadline}
                        onSave={(val) => onSectionChange && onSectionChange(section.id, { subheadline: val })}
                      />
                      <EditableAssetCard
                        id={`${section.id}_body`}
                        title="Body Copy / Purpose Summary"
                        value={section.bodyCopy}
                        originalValue={section.bodyCopy}
                        multiline
                        className="md:col-span-2"
                        onSave={(val) => onSectionChange && onSectionChange(section.id, { bodyCopy: val })}
                      />
                      <EditableAssetCard
                        id={`${section.id}_cta`}
                        title="Section CTA Button Label"
                        value={section.ctaText}
                        originalValue={section.ctaText}
                        onSave={(val) => onSectionChange && onSectionChange(section.id, { ctaText: val })}
                      />
                      <EditableAssetCard
                        id={`${section.id}_trust`}
                        title="Trust Badge / Guarantee Line"
                        value={section.trustStatement || ''}
                        originalValue={section.trustStatement || ''}
                        onSave={(val) => onSectionChange && onSectionChange(section.id, { trustStatement: val })}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
});
