import React, { useState } from 'react';
import { PortfolioBlueprintSection } from '../../../../data/module3/authority-suite-engine';
import { EditableAssetCard } from '../components/EditableAssetCard';
import { Layout, ChevronDown, ChevronUp, Copy, Check, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';

interface Props {
  sections: PortfolioBlueprintSection[];
  onSectionChange?: (sectionId: string, updatedFields: Partial<PortfolioBlueprintSection>) => void;
}

export const PortfolioArchitectureSection = React.memo(function PortfolioArchitectureSection({
  sections,
  onSectionChange,
}: Props) {
  const [expandedSectionId, setExpandedSectionId] = useState<string>(sections[0]?.id || '');
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = () => {
    const fullBlueprint = sections
      .map(
        (s) =>
          `### ${s.title}\n**Purpose:** ${s.purpose}\n**Headline:** ${s.headline}\n**Subheadline:** ${s.subheadline}\n**Body Copy:** ${s.bodyCopy}\n**CTA:** ${s.ctaText}`
      )
      .join('\n\n---\n\n');

    navigator.clipboard.writeText(fullBlueprint);
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
            <h3 className="text-xl font-black tracking-tight">3. Portfolio Architecture Generator (9 Website Sections)</h3>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Complete website wireframe architecture & copy spec from Hero to Final CTA.
          </p>
        </div>

        <button
          onClick={handleCopyAll}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer shrink-0"
        >
          {copiedAll ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copiedAll ? 'Blueprint Copied!' : 'Copy Entire Website Blueprint'}</span>
        </button>
      </div>

      {/* Accordion / Cards List of 9 Website Sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedSectionId === section.id;
          return (
            <div
              key={section.id}
              className={`bg-white rounded-2xl border transition-all ${
                isExpanded ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : 'border-neutral-200/90 shadow-2xs hover:border-neutral-300'
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => setExpandedSectionId(isExpanded ? '' : section.id)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-blue-50 text-[#0058be] text-xs font-black flex items-center justify-center border border-blue-100 shrink-0">
                    {section.sectionNumber}
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-[#0b1c30]">{section.title}</h4>
                    <p className="text-xs text-neutral-500 font-medium line-clamp-1">{section.purpose}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    {section.ctaText}
                  </span>
                  {isExpanded ? <ChevronUp size={16} className="text-neutral-400" /> : <ChevronDown size={16} className="text-neutral-400" />}
                </div>
              </button>

              {/* Accordion Body */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
                    className="border-t border-neutral-100 p-5 space-y-4 bg-neutral-50/50 rounded-b-2xl"
                  >
                    {/* Strategy Callouts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-neutral-200/80">
                        <span className="font-bold text-blue-900 block uppercase tracking-wider text-[10px] mb-1">
                          Conversion Reasoning
                        </span>
                        <p className="text-neutral-700 font-medium">{section.conversionReasoning}</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-neutral-200/80">
                        <span className="font-bold text-indigo-900 block uppercase tracking-wider text-[10px] mb-1">
                          Recommended Visuals
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
                        title="Body Copy"
                        value={section.bodyCopy}
                        originalValue={section.bodyCopy}
                        multiline
                        className="md:col-span-2"
                        onSave={(val) => onSectionChange && onSectionChange(section.id, { bodyCopy: val })}
                      />
                      <EditableAssetCard
                        id={`${section.id}_cta`}
                        title="Section CTA Button Text"
                        value={section.ctaText}
                        originalValue={section.ctaText}
                        onSave={(val) => onSectionChange && onSectionChange(section.id, { ctaText: val })}
                      />
                      <EditableAssetCard
                        id={`${section.id}_trust`}
                        title="Section Trust Statement / Badge"
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
