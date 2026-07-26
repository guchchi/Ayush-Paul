import React from 'react';
import { cn } from '../../../../lib/utils';

export function StrategySkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6 animate-pulse", className)}>
      {/* Header section skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-neutral-200 rounded-md"></div>
          <div className="h-4 w-96 bg-neutral-100 rounded-md"></div>
        </div>
        <div className="h-8 w-24 bg-neutral-100 rounded-full"></div>
      </div>

      {/* Accordion list skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-neutral-100 rounded-xl p-5 bg-white space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-5 w-5 bg-neutral-200 rounded-full shrink-0"></div>
              <div className="h-5 w-5 bg-neutral-200 rounded-md shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 w-1/3 bg-neutral-200 rounded-md"></div>
                <div className="h-4 w-1/2 bg-neutral-100 rounded-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
