import React from 'react';
import { BlockRendererProps, ViewModel } from '../../../../lib/rendering/types';

interface ExecutiveSummaryViewModel extends ViewModel {
  type: 'authority-pack.executive-summary';
  overview: string;
  insight: string;
  recommendation: string;
  guidance: string;
}

export function ExecutiveSummaryBlock({ block }: BlockRendererProps<ExecutiveSummaryViewModel>) {
  return (
    <section className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
      <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">Executive Summary</h2>
      
      <div className="space-y-4 text-sm text-blue-800/80 dark:text-blue-200/80">
        <div>
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Overview</h3>
          <p>{block.overview}</p>
        </div>
        
        <div>
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Key Insight</h3>
          <p>{block.insight}</p>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Primary Recommendation</h3>
          <p>{block.recommendation}</p>
        </div>
        
        <div className="text-xs text-blue-600 dark:text-blue-400 pt-2">
          <strong>Guidance:</strong> {block.guidance}
        </div>
      </div>
    </section>
  );
}
