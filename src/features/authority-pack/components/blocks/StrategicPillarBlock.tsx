import React from 'react';
import { motion } from 'motion/react';
import { BlockRendererProps, ViewModel } from '../../../../lib/rendering/types';
import { Target } from 'lucide-react';
import { NoteEditor } from '../../../notes/components/NoteEditor';
import { EASING, DURATION } from '../../../../lib/motion-presets';

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
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: DURATION.NORMAL, delay: (index || 0) * 0.06, ease: EASING.PREMIUM }}
      className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 text-left space-y-4 relative overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-blue-50 text-[#0058be] flex items-center justify-center text-xs font-black border border-blue-100/80 shadow-2xs">
            0{pillarNumber}
          </span>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
              STRATEGIC PILLAR
            </span>
            <h3 className="text-lg font-bold text-[#0b1c30] tracking-tight">
              {block.title}
            </h3>
          </div>
        </div>
        <span className="p-2 rounded-xl bg-neutral-50 text-neutral-400 border border-neutral-200/60">
          <Target size={16} />
        </span>
      </div>

      <p className="text-sm font-semibold text-neutral-700 leading-relaxed">
        {block.description}
      </p>

      <div className="bg-neutral-50/90 p-4 rounded-2xl border border-neutral-200/70 text-xs text-neutral-700 space-y-1">
        <span className="font-black text-[#0b1c30] uppercase tracking-wider text-[10px] block mb-0.5">
          Strategic Rationale
        </span>
        <p className="font-semibold text-neutral-600 leading-normal">
          {block.rationale}
        </p>
      </div>

      {packId && <NoteEditor packId={packId} blockId={block.id} />}
    </motion.section>
  );
}
