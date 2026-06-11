import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  status: 'completed' | 'current' | 'locked';
}

interface SidebarProps {
  phaseName: string;
  items: SidebarItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
}

const SECTION_NUMBERS: Record<string, string> = {
  'mission-brief': '01',
  'skill-inventory': '02',
  'opportunity-matrix': '03',
  'market-selection': '04',
  'niche-mapping': '05',
  'positioning-engine': '06',
  'opportunity-simulator': '07',
  'opportunity-report': '08',
};

export function Sidebar({ phaseName, items, activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
        <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/30">
          Phase {items.length > 0 ? '1' : ''} Mission Log
        </p>
        <p className="text-xs font-bold text-white/80 uppercase tracking-[0.08em] mt-1.5">
          {phaseName}
        </p>
      </div>

      {/* Items */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-3 px-3 space-y-0.5">
        {items.map((item) => {
          const isActive = item.id === activeSection;
          const isCompleted = item.status === 'completed';
          const isLocked = item.status === 'locked';
          const num = SECTION_NUMBERS[item.id] || '--';

          return (
            <button
              key={item.id}
              onClick={() => {
                if (!isLocked) onSectionChange(item.id);
              }}
              disabled={isLocked}
              className={cn(
                'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200',
                isActive && 'bg-white/[0.06] border border-white/[0.08] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]',
                !isActive && !isLocked && 'hover:bg-white/[0.03]',
                isLocked && 'opacity-25 cursor-not-allowed',
              )}
            >
              {/* Number */}
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold transition-all duration-200',
                isActive ? 'text-brand-primary bg-brand-primary/10 border border-brand-primary/20' : 'text-white/25 border border-white/[0.06]',
              )}>
                {num}
              </div>

              {/* Label + status */}
              <div className="min-w-0 flex-1 flex items-center gap-2">
                <span className={cn(
                  'text-[11px] truncate transition-colors duration-200',
                  isActive ? 'text-white font-semibold' : isCompleted ? 'text-white/50' : 'text-white/35',
                )}>
                  {item.label}
                </span>
              </div>

              {/* Status */}
              <div className="shrink-0 flex items-center">
                {isCompleted && (
                  <div className="w-4 h-4 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                    <Check size={8} className="text-white/40" />
                  </div>
                )}
                {isActive && !isCompleted && (
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_6px_rgba(0,88,190,0.5)]" />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
            <span className="text-[7px] font-bold text-brand-primary">OS</span>
          </div>
          <span className="text-[8px] font-medium text-white/20 uppercase tracking-[0.15em]">
            Blueprint OS
          </span>
        </div>
      </div>
    </div>
  );
}
