import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { SidebarMode } from '../../lib/workspace/useSidebarCollapse';

interface SidebarToggleProps {
  mode: SidebarMode;
  onToggle: () => void;
  className?: string;
}

export function SidebarToggle({ mode, onToggle, className }: SidebarToggleProps) {
  const isCollapsed = mode === 'collapsed';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      type="button"
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-expanded={!isCollapsed}
      className={cn(
        'absolute -right-3.5 top-1/2 -translate-y-1/2 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-md text-neutral-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be] hover:bg-neutral-50 hover:text-[#0058be] hover:border-[#0058be] cursor-pointer',
        className
      )}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isCollapsed ? 180 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <ChevronLeft className="h-4 w-4" />
      </motion.div>
    </button>
  );
}
