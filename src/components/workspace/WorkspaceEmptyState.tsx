import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';
import { cn } from '../../lib/utils';

export interface WorkspaceEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const WorkspaceEmptyState = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className
}: WorkspaceEmptyStateProps) => {
  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      initial="initial"
      animate="animate"
      className={cn(
        "relative w-full max-w-2xl mx-auto p-10 md:p-14",
        "bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl",
        "flex flex-col items-center justify-center text-center overflow-hidden",
        className
      )}
    >
      {/* Soft blurred background effects */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0058be]/5 blur-[100px] pointer-events-none" />

      {/* Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#0058be]/20 blur-xl rounded-full" />
        <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#0058be] shadow-inner">
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white/95 mb-3">
        {title}
      </h3>
      <p className="text-sm sm:text-base font-medium text-zinc-400 max-w-md leading-relaxed mb-8">
        {description}
      </p>

      {/* AI Guidance Placeholder */}
      <div className="flex items-center gap-2 px-4 py-2 mb-8 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-zinc-300">
        <Sparkles size={14} className="text-[#0058be]" />
        <span>Blueprint AI recommends starting here to build your foundation.</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-white/10 bg-transparent hover:bg-white/5 text-white/80 font-medium transition-colors cursor-pointer"
          >
            {secondaryAction.label}
          </button>
        )}
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#0058be] hover:bg-[#0058be]/90 text-white font-medium transition-colors shadow-[0_0_15px_rgba(0,88,190,0.3)] hover:shadow-[0_0_25px_rgba(0,88,190,0.4)] cursor-pointer"
          >
            {primaryAction.label}
          </button>
        )}
      </div>
    </motion.div>
  );
};
