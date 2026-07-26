import React from 'react';
import { Sparkles, Edit2 } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export interface AiStatusChipProps {
  status: 'generated' | 'edited' | 'stale';
  className?: string;
}

export function AiStatusChip({ status, className }: AiStatusChipProps) {
  if (status === 'generated') {
    return (
      <span className={cn("inline-flex items-center space-x-1 text-[10px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100", className)}>
        <Sparkles className="w-3 h-3" />
        <span>AI Generated</span>
      </span>
    );
  }

  if (status === 'edited') {
    return (
      <span className={cn("inline-flex items-center space-x-1 text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100", className)}>
        <Edit2 className="w-3 h-3" />
        <span>Edited by you</span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center space-x-1 text-[10px] font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100", className)}>
      <Sparkles className="w-3 h-3" />
      <span>Updates Available</span>
    </span>
  );
}
