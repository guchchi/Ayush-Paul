import { cn } from '../../lib/utils';

export type RoadmapMilestone = 'doubt' | 'asset' | 'portfolio' | 'authority';

interface DynamicRoadmapProps {
  activeMilestone: RoadmapMilestone;
  className?: string;
}

export function DynamicRoadmap({ activeMilestone, className }: DynamicRoadmapProps) {
  return (
    <div className={cn(
      "flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-neutral-50 border border-neutral-200/50 text-[10px] font-bold uppercase tracking-wider text-neutral-400 max-w-lg mx-auto mb-2",
      className
    )}>
      <span className={cn(activeMilestone === 'doubt' ? "text-[#0058be] font-extrabold" : "text-neutral-400")}>
        Client Doubt
      </span>
      <span className="text-neutral-300">→</span>
      <span className={cn(activeMilestone === 'asset' ? "text-[#0058be] font-extrabold" : "text-neutral-400")}>
        Proof Asset
      </span>
      <span className="text-neutral-300">→</span>
      <span className={cn(activeMilestone === 'portfolio' ? "text-[#0058be] font-extrabold" : "text-neutral-400")}>
        Portfolio
      </span>
      <span className="text-neutral-300">→</span>
      <span className={cn(activeMilestone === 'authority' ? "text-[#0058be] font-extrabold" : "text-neutral-400")}>
        Authority
      </span>
    </div>
  );
}
