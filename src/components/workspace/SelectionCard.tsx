import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING } from '../../lib/motion-presets';

interface SelectionCardProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  delay?: number;
}

export function SelectionCard({
  selected,
  onClick,
  children,
  className,
  ariaLabel,
  delay = 0,
}: SelectionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASING.PREMIUM, delay }}
      whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
      whileTap={{ scale: 0.97 }}
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel}
      className={cn(
        'relative p-5 rounded-2xl border text-left transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2',
        selected
          ? 'bg-white border-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.14)] ring-1 ring-[#0058be]'
          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm',
        className,
      )}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-4 right-4"
          aria-hidden="true"
        >
          <CheckCircle2 size={20} className="text-[#0058be]" />
        </motion.div>
      )}
      {children}
    </motion.button>
  );
}
