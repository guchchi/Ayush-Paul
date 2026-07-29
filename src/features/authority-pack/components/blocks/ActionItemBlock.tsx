import React from 'react';
import { BlockRendererProps, ViewModel } from '../../../../lib/rendering/types';
import { cn } from '../../../../lib/utils';
import { NoteEditor } from '../../../notes/components/NoteEditor';

interface ActionItemViewModel extends ViewModel {
  type: 'authority-pack.action-item';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

export function ActionItemBlock({ block, context }: BlockRendererProps<ActionItemViewModel>) {
  const packId = context?.packId;

  return (
    <div className="flex flex-col gap-2 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <input 
            type="checkbox" 
            checked={block.status === 'completed'}
            readOnly
            className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={cn(
              "font-medium text-sm",
              block.status === 'completed' ? "text-zinc-400 line-through" : "text-zinc-900 dark:text-zinc-100"
            )}>
              {block.title}
            </h4>
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider",
              block.priority === 'high' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
              block.priority === 'medium' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
              "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            )}>
              {block.priority}
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {block.description}
          </p>
        </div>
      </div>
      {packId && <NoteEditor packId={packId} blockId={block.id} />}
    </div>
  );
}
