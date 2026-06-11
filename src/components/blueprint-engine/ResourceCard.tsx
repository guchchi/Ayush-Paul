import { motion } from 'motion/react';
import { ExternalLink, BookOpen, Video, Wrench, Bookmark } from 'lucide-react';
import type { BlueprintResource } from '../../types/blueprint-engine';
import { cn } from '../../lib/utils';

interface ResourceCardProps {
  resources: BlueprintResource[];
}

const typeConfig = {
  tool: { icon: Wrench, label: 'Tool', color: 'text-brand-accent border-brand-accent/20 bg-brand-accent/10' },
  article: { icon: BookOpen, label: 'Article', color: 'text-brand-primary border-brand-primary/20 bg-brand-primary/10' },
  video: { icon: Video, label: 'Video', color: 'text-blue-400 border-blue-400/20 bg-blue-400/10' },
  reference: { icon: Bookmark, label: 'Reference', color: 'text-purple-400 border-purple-400/20 bg-purple-400/10' },
};

export function ResourceCard({ resources }: ResourceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="ds-card p-5 lg:p-6"
    >
      <p className="text-caption text-brand-primary mb-5">Resources</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {resources.map((resource, i) => {
          const config = typeConfig[resource.type];
          const Icon = config.icon;

          return (
            <motion.a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={cn(
                'group flex items-start gap-3 p-4 rounded-xl transition-all duration-200',
                'bg-white/[0.02] border border-white/5',
                'hover:bg-white/[0.05] hover:border-white/10',
              )}
            >
              <span
                className={cn(
                  'w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5',
                  config.color,
                )}
              >
                <Icon size={13} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                  {resource.title}
                </p>
                <p className="text-body-sm text-text-muted mt-0.5 line-clamp-2">
                  {resource.description}
                </p>
                <span className="text-caption text-text-muted mt-2 inline-flex items-center gap-1">
                  {config.label}
                  <ExternalLink size={10} />
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
}
