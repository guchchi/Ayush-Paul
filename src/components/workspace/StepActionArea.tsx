import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface StepActionAreaProps {
  children: ReactNode;
  className?: string;
  showBorder?: boolean;
}

export function StepActionArea({ children, className, showBorder = true }: StepActionAreaProps) {
  return (
    <div className={cn(
      'flex items-center justify-between pt-4',
      showBorder && 'border-t border-neutral-200',
      className,
    )}>
      {children}
    </div>
  );
}
