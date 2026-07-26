import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { EASING, DURATION } from '../../../../lib/motion-presets';

export interface StrategyAccordionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export function StrategyAccordion({
  title,
  subtitle,
  icon,
  defaultExpanded = false,
  children,
  headerAction
}: StrategyAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white mb-4">
      <button 
        type="button"
        className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-neutral-50/50 transition-colors text-left focus:outline-none focus-visible:bg-neutral-50/50"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex items-center space-x-4">
          <div className="text-neutral-400 shrink-0">
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
          {icon && <div className="text-indigo-600 shrink-0">{icon}</div>}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        
        {headerAction && (
          <div className="shrink-0 ml-4" onClick={(e) => e.stopPropagation()}>
            {headerAction}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
            className="overflow-hidden"
            id={`accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
            role="region"
            aria-labelledby={`accordion-header-${title.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <div className="p-5 pt-0 border-t border-neutral-100 bg-white">
              <div className="pt-5">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
