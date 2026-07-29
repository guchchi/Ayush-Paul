import React from 'react';
import { ViewModel } from './types';
import { registry } from './Registry';
import { BlockErrorBoundary } from './BlockErrorBoundary';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

interface ContentRendererProps {
  blocks: ViewModel[];
  className?: string;
  animate?: boolean;
}

/**
 * ContentRenderer iterates over view models, looks them up in the RendererRegistry,
 * and renders them. It never knows business logic or inspects data.
 */
export function ContentRenderer({ blocks, className, animate = true }: ContentRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-zinc-500">
        No content available.
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <AnimatePresence mode="popLayout">
        {blocks.map((block, index) => {
          const Component = registry.get(block.type);

          if (!Component) {
            return (
              <div key={block.id} className="p-4 border border-orange-500/20 bg-orange-500/10 text-orange-600 rounded-lg text-sm">
                Unsupported block type: {block.type}
              </div>
            );
          }

          const content = (
            <BlockErrorBoundary blockId={block.id}>
              <Component block={block} index={index} />
            </BlockErrorBoundary>
          );

          if (!animate) {
            return <React.Fragment key={block.id}>{content}</React.Fragment>;
          }

          // Use motion boundary at the list level to prevent over-animation 
          // inside the block itself.
          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout="position"
            >
              {content}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
