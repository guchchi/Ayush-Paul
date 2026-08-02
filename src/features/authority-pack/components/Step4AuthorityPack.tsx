import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Shield, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuthorityPackStore } from '../store/useAuthorityPackStore';
import { ServiceRegistry } from '../services/ServiceRegistry';
import { AuthorityPackViewMapper } from '../view-mappers/AuthorityPackViewMapper';
import { ContentRenderer } from '../../../lib/rendering/ContentRenderer';
import { StepHeader } from '../../../components/workspace/StepHeader';
import { ModuleButton } from '../../../components/workspace/ModuleButton';
import { useModule3Store } from '../../../lib/module3';
import { registerAuthorityPackBlocks } from './registry/RegistrySetup';
import { EASING, DURATION } from '../../../lib/motion-presets';

// Register block components into renderer registry
registerAuthorityPackBlocks();

export function Step4AuthorityPack() {
  const { pack, isGenerating, error } = useAuthorityPackStore(
    useShallow((state) => ({
      pack: state.pack,
      isGenerating: state.isGenerating,
      error: state.error,
    }))
  );

  const jumpToStep = useModule3Store((s) => s.jumpToStep);
  const [downloading, setDownloading] = useState(false);

  // When pack exists, map to blocks for the Generic Renderer
  const blocks = useMemo(() => {
    if (!pack) return [];
    return AuthorityPackViewMapper.mapToBlocks(pack);
  }, [pack]);

  const handleGenerate = async () => {
    const rawInputs = useModule3Store.getState();
    try {
      await ServiceRegistry.generationCoordinator.generate('pack-current', rawInputs);
    } catch (err) {
      console.error('Failed to generate Authority Pack:', err);
    }
  };

  const handleExport = async () => {
    if (!pack) return;
    setDownloading(true);
    try {
      await ServiceRegistry.exportPipeline.execute(pack, 'authority-pack', 'markdown', 'v1');
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left pb-24">
      <StepHeader
        step={{ current: 4, total: 4 }}
        title="Authority Pack Generation"
        description="Compile your domain strategy into a robust, ready-to-deploy Authority Pack."
      />

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200/80 font-semibold text-sm flex items-center justify-between">
          <span>Error generating pack: {error}</span>
          <ModuleButton variant="secondary" onClick={handleGenerate}>
            <RefreshCw size={13} className="mr-1.5" /> Retry
          </ModuleButton>
        </div>
      )}

      {!pack && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
          className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-6 text-center"
        >
          <div className="p-4 rounded-2xl bg-blue-50 text-[#0058be] border border-blue-100 shadow-2xs">
            <Shield size={40} />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-black text-[#0b1c30]">Ready to Generate Authority Pack</h3>
            <p className="text-sm font-medium text-neutral-600 leading-relaxed">
              We will assemble your domain positioning, strategic proof pillars, and execution items into a cohesive blueprint.
            </p>
          </div>
          <ModuleButton variant="primary" onClick={handleGenerate} className="px-6 py-3">
            <Sparkles size={16} className="mr-2" />
            Generate Authority Pack
          </ModuleButton>
        </motion.div>
      )}

      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-14 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-6 text-center"
        >
          <div className="p-4 rounded-2xl bg-blue-50 text-[#0058be] border border-blue-100 shadow-2xs">
            <RefreshCw size={36} className="animate-spin text-[#0058be]" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-black text-[#0b1c30]">Assembling Authority Pack...</h3>
            <p className="text-sm font-medium text-neutral-600 leading-relaxed">
              Structuring your positioning, strategic pillars, and high-priority action plan.
            </p>
          </div>
        </motion.div>
      )}

      {pack && !isGenerating && (
        <section className="space-y-8">
          {/* Guide Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="bg-gradient-to-br from-blue-50/90 via-white to-slate-50 border border-blue-100/90 rounded-3xl p-6 sm:p-8 text-left space-y-4 shadow-xs relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-[#0058be] text-white shadow-sm shadow-blue-500/20">
                  <Shield size={20} />
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0058be] block">
                    BLUEPRINT OUTPUT
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0b1c30] tracking-tight">
                    How to use your Authority Pack
                  </h3>
                </div>
              </div>

              {/* Quick Stat Pill */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 size={13} />
                  <span>100% Ready</span>
                </span>
              </div>
            </div>

            <p className="text-sm font-semibold text-neutral-700 leading-relaxed max-w-3xl">
              This pack translates your core strategy into a usable foundation for all your outbound content. Share it with your team, use it as a reference for your social media, or feed it into AI writing tools to ensure your brand voice remains perfectly aligned with your Blueprint OS strategy.
            </p>
          </motion.div>

          {/* Rendered Block Content */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl shadow-sm p-6 sm:p-8">
            <ContentRenderer blocks={blocks} />
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-neutral-200">
            <div className="flex items-center gap-3">
              <ModuleButton variant="secondary" onClick={() => jumpToStep('profile_portfolio')}>
                <ArrowLeft size={14} />
                Back to Layout Strategy
              </ModuleButton>
              <ModuleButton variant="secondary" onClick={handleGenerate}>
                <RefreshCw size={14} />
                Regenerate Pack
              </ModuleButton>
            </div>

            <button
              onClick={handleExport}
              disabled={downloading}
              className="w-full sm:w-auto px-6 py-3 bg-[#0058be] hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20"
            >
              <Download size={14} />
              {downloading ? 'Exporting...' : 'Export Authority Pack (.md)'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
