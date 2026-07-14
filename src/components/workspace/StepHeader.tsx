import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface StepHeaderProps {
  step: { current: number; total: number };
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function StepHeader({ step, title, description, children, className }: StepHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <span className="inline-flex items-center rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 mb-3">
        Step {step.current} of {step.total}
      </span>
      <h1 className="text-3xl font-bold text-[#0b1c30] tracking-tight">{title}</h1>
      {description && (
        <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
