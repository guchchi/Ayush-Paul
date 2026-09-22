import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Download, FileText, LayoutTemplate, PlayCircle, ArrowRight, Save, LayoutGrid } from 'lucide-react';
import { useModule3Store } from '../../../../../lib/module3/store';
import { generateLeadMagnetConcept } from '../../../../../lib/module3/lead-magnet-engine';
import { cn } from '../../../../../lib/utils';
import { DURATION, EASING } from '../../../../../lib/motion-presets';

interface Props {
  onContinue: () => void;
}

export const LeadMagnetEngineSection: React.FC<Props> = React.memo(({ onContinue }) => {
  const { 
    mod1NicheId, 
    mod2UniqueMechanism, 
    stage5LeadMagnet, 
    setStage5LeadMagnet,
    step3CompletedSections,
    completeStep3Section
  } = useModule3Store();

  // Auto-generate if empty
  useEffect(() => {
    if (!stage5LeadMagnet) {
      const generated = generateLeadMagnetConcept(mod1NicheId || '', mod2UniqueMechanism || '');
      setStage5LeadMagnet(generated);
    }
  }, [stage5LeadMagnet, mod1NicheId, mod2UniqueMechanism, setStage5LeadMagnet]);

  if (!stage5LeadMagnet) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-100 rounded-lg w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 bg-slate-50 border border-slate-100 rounded-xl animate-pulse"></div>
          <div className="h-64 bg-slate-50 border border-slate-100 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const handleSaveAndContinue = () => {
    completeStep3Section(5);
    onContinue();
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'notion_template': return <LayoutTemplate className="w-5 h-5" />;
      case 'mini_course': return <PlayCircle className="w-5 h-5" />;
      case 'pdf_playbook': return <FileText className="w-5 h-5" />;
      case 'checklist': return <LayoutGrid className="w-5 h-5" />;
      default: return <Download className="w-5 h-5" />;
    }
  };

  const getFormatLabel = (format: string) => {
    return format.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Level 05 — Lead Magnet & Conversion Bridge</h2>
        <p className="mt-2 text-slate-600">
          This is the asset that turns your inbound traffic (from Level 4) into portfolio leads (Module 4). Based on your niche and mechanism, we've designed a highly optimized Lead Magnet blueprint.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column - The Lead Magnet Blueprint */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Zap size={18} />
            </div>
            <h3 className="font-bold text-slate-900">Your Lead Magnet Concept</h3>
          </div>
          
          <div className="p-6 space-y-5 flex-1">
            
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block mb-1">
                Asset Name
              </span>
              <div className="text-lg font-bold text-slate-900">
                {stage5LeadMagnet.conceptTitle}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block mb-1">
                Format
              </span>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-lg text-sm font-semibold text-neutral-700">
                {getFormatIcon(stage5LeadMagnet.format)}
                {getFormatLabel(stage5LeadMagnet.format)}
              </div>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600/80 block mb-1">
                Primary Benefit
              </span>
              <div className="text-sm font-medium text-slate-800">
                {stage5LeadMagnet.primaryBenefit}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - The Conversion Bridge (Opt-in Flow) */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Download size={18} />
            </div>
            <h3 className="font-bold text-slate-900">The Conversion Bridge Flow</h3>
          </div>
          
          <div className="p-6 space-y-6 flex-1">
            
            {/* Step 1 */}
            <div className="flex gap-4 relative">
              <div className="absolute left-[15px] top-[30px] bottom-[-20px] w-px bg-neutral-200" />
              <div className="relative z-10 w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0 border-2 border-white shadow-sm">
                1
              </div>
              <div className="pt-1">
                <h4 className="text-sm font-bold text-slate-900">Social Media Hook</h4>
                <p className="text-xs text-slate-500 mt-1 italic">
                  "{stage5LeadMagnet.hook}"
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 relative">
              <div className="absolute left-[15px] top-[30px] bottom-[-20px] w-px bg-neutral-200" />
              <div className="relative z-10 w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0 border-2 border-white shadow-sm">
                2
              </div>
              <div className="pt-1">
                <h4 className="text-sm font-bold text-slate-900">Opt-in Landing Page</h4>
                <p className="text-xs text-slate-500 mt-1">
                  User visits the portfolio gateway and clicks:
                </p>
                <div className="mt-2 inline-block px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold shadow-sm">
                  {stage5LeadMagnet.ctaText}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 relative">
              <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0 border-2 border-white shadow-sm">
                3
              </div>
              <div className="pt-1">
                <h4 className="text-sm font-bold text-emerald-700">Pipeline Trigger</h4>
                <p className="text-xs text-emerald-600 mt-1">
                  Asset is delivered. User is added to your Module 5 Client Pipeline.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      <div className="flex justify-end pt-6 border-t border-neutral-100">
        <button
          onClick={handleSaveAndContinue}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#0058be] text-white hover:bg-blue-700 hover:shadow-lg transition-all"
        >
          <Save size={18} />
          <span>Save & Complete Stage 5</span>
          <ArrowRight size={18} />
        </button>
      </div>

    </motion.div>
  );
});

LeadMagnetEngineSection.displayName = 'LeadMagnetEngineSection';
