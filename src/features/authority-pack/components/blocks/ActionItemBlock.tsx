import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BlockRendererProps, ViewModel } from '../../../../lib/rendering/types';
import { cn } from '../../../../lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';
import { NoteEditor } from '../../../notes/components/NoteEditor';
import { EASING, DURATION } from '../../../../lib/motion-presets';

interface ActionItemViewModel extends ViewModel {
  type: 'authority-pack.action-item';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

export function ActionItemBlock({ block, index, context }: BlockRendererProps<ActionItemViewModel>) {
  const packId = context?.packId;
  const [completed, setCompleted] = useState(block.status === 'completed');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: DURATION.NORMAL, delay: (index || 0) * 0.05, ease: EASING.PREMIUM }}
      className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-sm hover:border-blue-200 transition-all flex flex-col gap-3 text-left"
    >
      <div className="flex items-start gap-3.5">
        <button
          type="button"
          onClick={() => setCompleted(!completed)}
          className="pt-0.5 shrink-0 transition-transform active:scale-95 focus:outline-hidden"
          aria-label="Toggle task status"
        >
          {completed ? (
            <CheckCircle2 size={22} className="text-emerald-500 fill-emerald-50" />
          ) : (
            <Circle size={22} className="text-neutral-300 hover:text-[#0058be] transition-colors" />
          )}
        </button>
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-3">
            <h4 className={cn(
              "font-bold text-base transition-all",
              completed ? "text-neutral-400 line-through" : "text-[#0b1c30]"
            )}>
              {block.title}
            </h4>

            <span className={cn(
              "text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border shrink-0",
              block.priority === 'high' ? "bg-red-50 text-red-700 border-red-200/80" :
              block.priority === 'medium' ? "bg-amber-50 text-amber-700 border-amber-200/80" :
              "bg-blue-50 text-[#0058be] border-blue-200/80"
            )}>
              {block.priority} Priority
            </span>
          </div>

          <p className="text-sm font-semibold text-neutral-600 leading-relaxed">
            {block.description}
          </p>
        </div>
      </div>

      {packId && <NoteEditor packId={packId} blockId={block.id} />}
    </motion.div>
  );
}
