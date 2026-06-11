import { Check, ArrowLeft, Layers, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from './ProgressBar';
import type { BlueprintModule } from '../../types/blueprint-engine';
import { cn } from '../../lib/utils';

interface ModuleSidebarProps {
  title: string;
  description: string;
  modules: BlueprintModule[];
  activeModuleId: string;
  completedModules: string[];
  onModuleChange: (id: string) => void;
  overallProgress: number;
  onClose?: () => void;
}

export function ModuleSidebar({
  title,
  description,
  modules,
  activeModuleId,
  completedModules,
  onModuleChange,
  overallProgress,
  onClose,
}: ModuleSidebarProps) {
  const navigate = useNavigate();
  const currentIndex = modules.findIndex((m) => m.id === activeModuleId);

  return (
    <aside className="w-[280px] shrink-0 h-screen sticky top-0 flex flex-col bg-[#070708] border-r border-white/[0.06] overflow-y-auto">
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/vault')}
            className="flex items-center gap-1.5 text-caption text-text-muted hover:text-text-primary transition-colors cursor-pointer group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Vault
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors lg:hidden cursor-pointer"
            >
              <X size={12} className="text-text-muted" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="w-7 h-7 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
            <Layers size={13} className="text-brand-primary" />
          </span>
          <h2 className="text-body-sm font-bold text-text-primary tracking-tight">{title}</h2>
        </div>

        <p className="text-caption text-text-muted leading-relaxed line-clamp-2 mb-5">{description}</p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-caption text-text-muted">Progress</span>
          <span className="text-caption font-semibold text-brand-primary">{Math.round(overallProgress)}%</span>
        </div>
        <ProgressBar value={overallProgress} />
      </div>

      <nav className="flex-1 py-3 px-3">
        <p className="text-caption text-text-muted px-2 mb-2 tracking-wider">Modules</p>
        <ul className="space-y-0.5">
          {modules.map((mod, i) => {
            const isActive = mod.id === activeModuleId;
            const isCompleted = completedModules.includes(mod.id);
            const isPast = i < currentIndex;
            return (
              <li key={mod.id}>
                <button
                  onClick={() => onModuleChange(mod.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer group',
                    isActive
                      ? 'bg-white/[0.06]'
                      : 'hover:bg-white/[0.03]',
                  )}
                >
                  <span
                    className={cn(
                      'w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-300',
                      isCompleted
                        ? 'bg-brand-primary'
                        : isActive
                          ? 'border-2 border-brand-primary'
                          : 'border-2 border-white/15 group-hover:border-white/30',
                    )}
                  >
                    {isCompleted ? (
                      <Check size={10} className="text-white" />
                    ) : (
                      <span className={cn(
                        'text-[9px] font-bold transition-colors',
                        isActive ? 'text-brand-primary' : isPast ? 'text-white/40' : 'text-white/30',
                      )}>
                        {i + 1}
                      </span>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-body-sm font-medium transition-colors truncate',
                      isActive
                        ? 'text-white'
                        : isCompleted
                          ? 'text-white/30 line-through'
                          : 'text-white/50 group-hover:text-white/70',
                    )}>
                      {mod.title}
                    </p>
                  </div>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-brand-primary shrink-0 animate-pulse" />
                  )}
                  {isCompleted && !isActive && (
                    <span className="text-caption text-brand-primary/40">{i + 1}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/[0.06]">
        <p className="text-caption text-text-muted text-center">
          {completedModules.length}/{modules.length} modules completed
        </p>
      </div>
    </aside>
  );
}
