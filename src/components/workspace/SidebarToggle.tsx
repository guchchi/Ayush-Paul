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
      onClick={onToggle}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-expanded={!isCollapsed}
      className={cn(
        'absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm text-neutral-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be] focus-visible:ring-offset-1 hover:text-[#0b1c30] hover:border-[#0b1c30]',
        className
      )}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isCollapsed ? 180 : 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </motion.div>
    </button>
  );
}
