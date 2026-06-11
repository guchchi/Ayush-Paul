import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, PanelRight, X, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { MissionBar } from './MissionBar';
import { Sidebar } from './Sidebar';
import { AssetsPanel } from './AssetsPanel';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  status: 'completed' | 'current' | 'locked';
}

interface AssetEntry {
  id: string;
  title: string;
  description: string;
}

interface AssetCategory {
  id: string;
  label: string;
  icon: string;
  items: AssetEntry[];
}

interface WorkspaceShellProps {
  phaseName: string;
  phaseNumber: number;
  totalPhases: number;
  progress: number;
  currentObjective: string;
  sidebarItems: SidebarItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  children: ReactNode;
  assetCategories: AssetCategory[];
}

const SIDEBAR_WIDTH = 240;
const ASSETS_WIDTH = 320;

export function WorkspaceShell({
  phaseName,
  phaseNumber,
  totalPhases,
  progress,
  currentObjective,
  sidebarItems,
  activeSection,
  onSectionChange,
  children,
  assetCategories,
}: WorkspaceShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assetsOpen, setAssetsOpen] = useState(false);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 768) setViewport('mobile');
      else if (w < 1280) setViewport('tablet');
      else setViewport('desktop');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const showSidebar = viewport === 'desktop';
  const showAssets = viewport === 'desktop';

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white selection:bg-brand-primary/30">

      {/* Mission Bar */}
      <MissionBar
        phaseName={phaseName}
        phaseNumber={phaseNumber}
        totalPhases={totalPhases}
        progress={progress}
        currentObjective={currentObjective}
        onMenuToggle={() => setSidebarOpen(true)}
      />

      {/* Content Row */}
      <div className="flex flex-1 min-h-0 relative">

        {/* Desktop Sidebar — glass panel */}
        {showSidebar && (
          <div className="shrink-0 border-r border-white/[0.06]" style={{ width: SIDEBAR_WIDTH }}>
            <div className="h-full overflow-y-auto custom-scrollbar bg-[var(--glass-bg)]">
              <Sidebar
                phaseName={phaseName}
                items={sidebarItems}
                activeSection={activeSection}
                onSectionChange={onSectionChange}
              />
            </div>
          </div>
        )}

        {/* Center Workspace */}
        <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar">
          <div className="mx-auto w-full max-w-4xl px-6 sm:px-10 py-8 lg:py-12">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            >
              {children}
            </motion.div>
            <div className="h-28 lg:h-16" />
          </div>
        </main>

        {/* Desktop Intelligence Panel — glass */}
        {showAssets && (
          <div className="shrink-0 border-l border-white/[0.06]" style={{ width: ASSETS_WIDTH }}>
            <div className="h-full overflow-y-auto custom-scrollbar bg-[var(--glass-bg)]">
              <AssetsPanel categories={assetCategories} />
            </div>
          </div>
        )}

        {/* Overlays */}
        <AnimatePresence>
          {sidebarOpen && !showSidebar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.FAST }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {sidebarOpen && !showSidebar && (
            <motion.div
              initial={{ x: -SIDEBAR_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_WIDTH }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              className="fixed inset-y-0 left-0 z-50 bg-[#050505] border-r border-white/[0.06] shadow-2xl"
              style={{ width: SIDEBAR_WIDTH }}
            >
              <div className="flex items-center justify-between h-20 px-4 border-b border-white/[0.06]">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">Sections</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <X size={13} className="text-white/40" />
                </button>
              </div>
              <div className="h-[calc(100%-80px)] overflow-y-auto custom-scrollbar">
                <Sidebar
                  phaseName={phaseName}
                  items={sidebarItems}
                  activeSection={activeSection}
                  onSectionChange={(id) => {
                    onSectionChange(id);
                    setSidebarOpen(false);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {assetsOpen && !showAssets && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.FAST }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setAssetsOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {assetsOpen && !showAssets && (
            <motion.div
              initial={{ x: ASSETS_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: ASSETS_WIDTH }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              className="fixed inset-y-0 right-0 z-50 bg-[#050505] border-l border-white/[0.06] shadow-2xl"
              style={{ width: Math.min(ASSETS_WIDTH, window.innerWidth - 32) }}
            >
              <div className="flex items-center justify-between h-20 px-4 border-b border-white/[0.06]">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">Intelligence</span>
                <button
                  onClick={() => setAssetsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <X size={13} className="text-white/40" />
                </button>
              </div>
              <div className="h-[calc(100%-80px)] overflow-y-auto custom-scrollbar">
                <AssetsPanel categories={assetCategories} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tablet assets toggle */}
        {viewport === 'tablet' && (
          <button
            onClick={() => setAssetsOpen(!assetsOpen)}
            className="fixed right-5 bottom-5 z-20 w-10 h-10 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] bg-brand-primary text-white flex items-center justify-center hover:bg-brand-primary/90 transition-all cursor-pointer"
          >
            <PanelRight size={15} />
          </button>
        )}

      </div>

      {/* Mobile bottom nav */}
      {viewport === 'mobile' && (
        <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around h-16 border-t border-white/[0.06] bg-[#050505]/90 backdrop-blur-xl px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60 transition-colors cursor-pointer"
          >
            <Menu size={16} />
            <span className="text-[7px] font-bold uppercase tracking-[0.15em]">Steps</span>
          </button>

          <div className="flex flex-col items-center gap-1">
            <div className="w-20 h-[2px] rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-primary transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-white/40">
              {Math.round(progress)}%
            </span>
          </div>

          <button
            onClick={() => setAssetsOpen(!assetsOpen)}
            className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60 transition-colors cursor-pointer"
          >
            <PanelRight size={16} />
            <span className="text-[7px] font-bold uppercase tracking-[0.15em]">Intel</span>
          </button>
        </div>
      )}

    </div>
  );
}
