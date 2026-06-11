import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface WorkflowCardProps {
  steps: { label: string; description?: string }[];
}

export function WorkflowCard({ steps }: WorkflowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="ds-card p-6 lg:p-8"
    >
      <p className="text-caption text-brand-primary mb-5">Workflow</p>
      <div className="flex flex-col items-center gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-col items-center">
            <div className="flex items-center gap-4 w-full">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-text-primary">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-semibold text-text-primary">{step.label}</p>
                {step.description && (
                  <p className="text-caption text-text-muted mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="py-2 flex flex-col items-center">
                <ChevronDown size={16} className="text-white/20" />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
