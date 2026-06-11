import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import type { BlueprintChecklistItem } from '../../types/blueprint-engine';
import { cn } from '../../lib/utils';

interface ChecklistCardProps {
  items: BlueprintChecklistItem[];
  completed: string[];
  onToggle: (id: string) => void;
}

export function ChecklistCard({ items, completed, onToggle }: ChecklistCardProps) {
  const progress = items.length > 0 ? Math.round((completed.length / items.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="ds-card p-5 lg:p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-caption text-brand-primary">Checklist</p>
        <span className="text-caption text-text-muted">
          {completed.length}/{items.length}
        </span>
      </div>

      <div className="w-full h-1 bg-white/5 rounded-full mb-5 overflow-hidden">
        <motion.div
          className="h-full bg-brand-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <ul className="space-y-1.5">
        {items.map((item) => {
          const isDone = completed.includes(item.id);
          return (
            <li key={item.id}>
              <button
                onClick={() => onToggle(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200',
                  'hover:bg-white/[0.03] cursor-pointer group',
                )}
              >
                <motion.span
                  animate={isDone ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all duration-300',
                    isDone
                      ? 'bg-brand-primary border-brand-primary'
                      : 'border-white/20 group-hover:border-white/40',
                  )}
                >
                  {isDone && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      <Check size={12} className="text-white" />
                    </motion.span>
                  )}
                </motion.span>
                <span
                  className={cn(
                    'text-body-sm transition-all duration-300',
                    isDone
                      ? 'text-text-muted line-through'
                      : 'text-text-primary',
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
