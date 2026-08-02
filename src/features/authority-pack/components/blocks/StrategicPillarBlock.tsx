import React from 'react';
import { BlockRendererProps, ViewModel } from '../../../../lib/rendering/types';
import { Target } from 'lucide-react';
import { NoteEditor } from '../../../notes/components/NoteEditor';

interface StrategicPillarViewModel extends ViewModel {
  type: 'authority-pack.strategic-pillar';
  title: string;
  description: string;
  rationale: string;
}

export function StrategicPillarBlock({ block, index, context }: BlockRendererProps<StrategicPillarViewModel>) {
  const packId = context?.packId;
  const pillarNumber = typeof index === 'number' ? index + 1 : 1;

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#0058be] flex items-center justify-center text-xs font-black border border-blue-100/80">
            0{pillarNumber}
          </span>
          <h3 className="text-lg font-bold text-[#0b1c30] tracking-tight">
            {block.title}
          </h3>
        </div>
        <span className="p-1.5 rounded-lg bg-neutral-100 text-neutral-400">
          <Target size={16} />
        </span>
      </div>

      <p className="text-sm font-medium text-neutral-600 leading-relaxed">
        {block.description}
      </p>

      <div className="bg-neutral-50/90 p-4 rounded-2xl border border-neutral-200/70 text-xs text-neutral-700 space-y-1">
        <span className="font-black text-[#0b1c30] uppercase tracking-wider text-[10px] block mb-0.5">
          Strategic Rationale
        </span>
        <p className="font-medium text-neutral-600 leading-normal">
          {block.rationale}
        </p>
      </div>

      {packId && <NoteEditor packId={packId} blockId={block.id} />}
    </section>
  );
}
