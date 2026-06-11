import { useState, type ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { ModuleSidebar } from './ModuleSidebar';
import type { BlueprintModule } from '../../types/blueprint-engine';
import { cn } from '../../lib/utils';

interface BlueprintLayoutProps {
  title: string;
  description: string;
  modules: BlueprintModule[];
  activeModuleId: string;
  completedModules: string[];
  onModuleChange: (id: string) => void;
  overallProgress: number;
  children: ReactNode;
}

export function BlueprintLayout({
  title,
  description,
  modules,
  activeModuleId,
  completedModules,
  onModuleChange,
  overallProgress,
  children,
}: BlueprintLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleModuleChange = (id: string) => {
    onModuleChange(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0b] text-white">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <ModuleSidebar
          title={title}
          description={description}
          modules={modules}
          activeModuleId={activeModuleId}
          completedModules={completedModules}
          onModuleChange={onModuleChange}
          overallProgress={overallProgress}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ease-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <ModuleSidebar
          title={title}
          description={description}
          modules={modules}
          activeModuleId={activeModuleId}
          completedModules={completedModules}
          onModuleChange={handleModuleChange}
          overallProgress={overallProgress}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <main className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 lg:hidden flex items-center gap-3 px-4 h-14 border-b border-white/[0.06] bg-[#0a0a0b]/90 backdrop-blur-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Menu size={14} className="text-white/60" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-5 h-5 rounded-md bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
              <span className="text-[8px] font-bold text-brand-primary">
                {modules.findIndex((m) => m.id === activeModuleId) + 1}
              </span>
            </span>
            <span className="text-body-sm font-semibold text-white/80 truncate">
              {modules.find((m) => m.id === activeModuleId)?.title || ''}
            </span>
          </div>
          <span className="ml-auto text-caption text-brand-primary">{Math.round(overallProgress)}%</span>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-6 lg:py-16">
          {children}
        </div>
      </main>
    </div>
  );
}
