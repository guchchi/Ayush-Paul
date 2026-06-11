import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Play } from 'lucide-react';
import type { BlueprintActionStep } from '../../types/blueprint-engine';
import { cn } from '../../lib/utils';

interface ActionStepCardProps {
  step: BlueprintActionStep;
  index: number;
  defaultOpen?: boolean;
}

export function ActionStepCard({ step, index, defaultOpen }: ActionStepCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className="ds-card overflow-hidden transition-shadow duration-300 hover:shadow-[0_10px_30px_-10px_rgba(0,88,190,0.15)]"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-start gap-4 p-5 lg:p-6 text-left cursor-pointer transition-colors',
          'hover:bg-white/[0.02]',
          isOpen && 'bg-white/[0.01]',
        )}
        aria-label={isOpen ? 'Collapse details' : 'Expand details'}
      >
        <span className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-primary/20 transition-colors">
          <Play size={12} className="text-brand-primary ml-0.5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-caption text-text-muted mb-1">Step {index + 1}</p>
              <p className="text-body-md font-semibold text-text-primary">{step.title}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-caption text-text-muted hidden sm:inline">
                {isOpen ? 'Hide details' : 'View details'}
              </span>
              <ChevronDown
                size={16}
                className={cn(
                  'text-text-muted transition-transform duration-300',
                  isOpen && 'rotate-180',
                )}
              />
            </div>
          </div>
          <p className="text-body-sm text-text-secondary mt-2">{step.description}</p>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 lg:px-6 pb-5 lg:pb-6 pt-2 border-t border-white/5">
              <div className="pl-12">
                <p className="text-body-sm text-text-secondary leading-relaxed">{step.details}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
