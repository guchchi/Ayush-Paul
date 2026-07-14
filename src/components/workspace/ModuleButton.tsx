import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'success';

interface ModuleButtonProps {
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#0058be] text-white border-transparent hover:bg-[#0047a0] shadow-sm',
  secondary:
    'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-700',
  tertiary:
    'bg-white border-transparent text-neutral-400 hover:text-neutral-700',
  ghost:
    'bg-transparent border-transparent text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50',
  success:
    'bg-[#d1f34d] text-[#0b1c30] border-transparent cursor-default',
};

export function ModuleButton({
  variant = 'secondary',
  onClick,
  disabled = false,
  loading = false,
  children,
  className,
  type = 'button',
  ariaLabel,
}: ModuleButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2 active:scale-[0.98] border',
        variantStyles[variant],
        disabled && !loading && 'opacity-50 cursor-not-allowed',
        loading && 'cursor-wait',
        className,
      )}
    >
      {children}
    </button>
  );
}
