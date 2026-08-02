import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ArrowLeft, Download, Shield, RefreshCw } from 'lucide-react';
import { useAuthorityPackStore } from '../store/useAuthorityPackStore';
import { ServiceRegistry } from '../services/ServiceRegistry';
import { AuthorityPackViewMapper } from '../view-mappers/AuthorityPackViewMapper';
import { ContentRenderer } from '../../../lib/rendering/ContentRenderer';
import { StepHeader } from '../../../components/workspace/StepHeader';
import { ModuleButton } from '../../../components/workspace/ModuleButton';
import { useModule3Store } from '../../../lib/module3';
import { registerAuthorityPackBlocks } from './registry/RegistrySetup';

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
    <div className="space-y-10 max-w-5xl mx-auto text-left pb-24">
      <div className="flex items-center justify-between bg-white border border-neutral-200/80 rounded-2xl p-4 text-xs font-bold text-neutral-400 shadow-sm max-w-3xl mx-auto">
        {/* Placeholder roadmap */}
        <div className="flex items-center gap-1.5 text-[#0058be] bg-blue-50/50 px-2.5 py-1.5 rounded-xl border border-blue-100/50 mx-auto">
          <Shield size={12} className="animate-pulse" />
          <span>4. Authority Pack</span>
        </div>
      </div>

      <StepHeader
        step={{ current: 4, total: 4 }}
        title="Authority Pack Generation"
        description="Compile your domain strategy into a robust Authority Pack."
      />

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 font-semibold text-sm">
          Error generating pack: {error}
        </div>
      )}

      {!pack && !isGenerating && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-6 text-center">
          <Shield size={48} className="text-neutral-300" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-neutral-800">Ready to Generate</h3>
            <p className="text-sm text-neutral-500 max-w-md">
              We will use your strategy to automatically assemble a cohesive Authority Pack.
            </p>
          </div>
          <ModuleButton variant="primary" onClick={handleGenerate}>
            <RefreshCw size={14} className="mr-2" />
            Generate Authority Pack
          </ModuleButton>
        </div>
      )}

      {isGenerating && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-6 text-center">
          <RefreshCw size={48} className="text-[#0058be] animate-spin" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-neutral-800">Generating Authority Pack...</h3>
            <p className="text-sm text-neutral-500 max-w-md">
              Our AI is processing your domain strategy. This may take up to 30 seconds.
            </p>
          </div>
        </div>
      )}

      {pack && !isGenerating && (
        <section className="space-y-8">
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 text-sm">
            <h3 className="font-bold text-[#0058be] mb-2 flex items-center gap-2">
              <Shield size={16} />
              How to use your Authority Pack
            </h3>
            <p className="text-neutral-600">
              This pack translates your core strategy into a usable foundation for all your outbound content.
              Share it with your team, use it as a reference for your social media, or feed it into AI writing tools to ensure your brand voice remains perfectly aligned with your Blueprint OS strategy.
            </p>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-3xl shadow-sm p-8">
            {/* The new Generic Content Renderer taking over the UI */}
            <ContentRenderer blocks={blocks} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-neutral-200">
            <ModuleButton variant="secondary" onClick={() => jumpToStep('profile_portfolio')}>
              <ArrowLeft size={14} />
              Back to Layout Strategy
            </ModuleButton>

            <button
              onClick={handleExport}
              disabled={downloading}
              className="w-full sm:w-auto px-6 py-3 bg-[#0058be] hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
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
