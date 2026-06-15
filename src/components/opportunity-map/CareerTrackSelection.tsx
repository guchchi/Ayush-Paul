import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useOpportunityMapStore } from '../../lib/opportunity-map';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';

const TRACK_ICONS: Record<string, string> = {
  video_editor: '🎬',
  wordpress_developer: '🔧',
  ui_ux_designer: '🎨',
};

export function CareerTrackSelection() {
  const tracks = useOpportunityMapStore((s) => s.tracks);
  const careerTrackId = useOpportunityMapStore((s) => s.careerTrackId);
  const setSelection = useOpportunityMapStore((s) => s.setSelection);
  const nextStep = useOpportunityMapStore((s) => s.nextStep);

  const handleSelect = (id: string) => {
    setSelection('career_track', id);
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 1 of 7</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Choose Your Career Track</h2>
        <p className="text-sm text-zinc-400 max-w-lg">Select the path that best matches your current skills and target direction.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tracks.map((track, i) => {
          const isSelected = careerTrackId === track.id;
          return (
            <motion.button
              key={track.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: i * 0.06 }}
              onClick={() => handleSelect(track.id)}
              className={cn(
                'relative flex flex-col gap-3 w-full p-5 rounded-xl text-left transition-all duration-300 cursor-pointer group',
                'bg-white/[0.03] border border-white/5',
                'hover:bg-white/5 hover:border-white/10 hover:scale-[1.01]',
                isSelected && 'bg-white/[0.06] border-white/20 shadow-[0_0_30px_-12px_rgba(255,255,255,0.06)]',
              )}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                  <Check size={10} className="text-white" strokeWidth={3} />
                </span>
              )}

              <span className="text-2xl">{TRACK_ICONS[track.id] ?? '📋'}</span>

              <div className="space-y-1">
                <span className={cn(
                  'block text-sm font-semibold transition-colors',
                  isSelected ? 'text-white/95' : 'text-white/90 group-hover:text-white/95',
                )}>
                  {track.label}
                </span>
                <span className="block text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {track.description}
                </span>
              </div>

              <span className={cn(
                'text-[10px] font-bold uppercase tracking-[0.1em] transition-colors',
                isSelected ? 'text-white/60' : 'text-zinc-500 group-hover:text-zinc-400',
              )}>
                {track.services.length} services
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
