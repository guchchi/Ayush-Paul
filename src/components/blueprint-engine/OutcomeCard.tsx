import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface OutcomeCardProps {
  items: string[];
}

export function OutcomeCard({ items }: OutcomeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="ds-card p-6 lg:p-8"
    >
      <p className="text-caption text-brand-primary mb-4">By the end of this module</p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
              <Check size={12} className="text-brand-primary" />
            </span>
            <span className="text-body-sm text-text-primary">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
