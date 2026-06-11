import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  className?: string;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, className, size = 'md' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        'w-full bg-white/5 rounded-full overflow-hidden',
        size === 'sm' ? 'h-1' : 'h-1.5',
        className,
      )}
    >
      <motion.div
        className="h-full bg-brand-primary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
