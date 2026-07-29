import React from 'react';
import { BlockRendererProps, ViewModel } from '../../../../lib/rendering/types';

interface StrategicPillarViewModel extends ViewModel {
  type: 'authority-pack.strategic-pillar';
  title: string;
  description: string;
  rationale: string;
}

export function StrategicPillarBlock({ block }: BlockRendererProps<StrategicPillarViewModel>) {
  return (
    <section className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
        {block.title}
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
        {block.description}
      </p>
      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg text-sm text-zinc-700 dark:text-zinc-300">
        <span className="font-semibold block mb-1">Rationale</span>
        {block.rationale}
      </div>
    </section>
  );
}
