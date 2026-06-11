import { motion } from 'motion/react';
import { FileText, ExternalLink, Download } from 'lucide-react';
import type { BlueprintTemplate } from '../../types/blueprint-engine';
import { cn } from '../../lib/utils';

interface TemplateCardProps {
  template: BlueprintTemplate;
  index: number;
}

export function TemplateCard({ template, index }: TemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className="ds-card p-5 lg:p-6"
    >
      <div className="flex gap-4">
        <span className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
          <FileText size={16} className="text-brand-primary" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-body-sm font-semibold text-text-primary mb-1">{template.title}</p>
          <p className="text-body-sm text-text-secondary">{template.description}</p>
          <div className="flex items-center gap-3 mt-4">
            {template.url && (
              <a
                href={template.url}
                className={cn(
                  'btn-base text-[11px] h-8 px-4 gap-1.5',
                  'bg-white/5 text-text-secondary border border-white/10',
                  'hover:bg-white/10 hover:text-text-primary',
                )}
              >
                <ExternalLink size={12} />
                Open Template
              </a>
            )}
            {template.downloadUrl && (
              <a
                href={template.downloadUrl}
                className={cn(
                  'btn-base text-[11px] h-8 px-4 gap-1.5',
                  'bg-brand-primary/10 text-brand-primary border border-brand-primary/20',
                  'hover:bg-brand-primary/20',
                )}
              >
                <Download size={12} />
                Download
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
