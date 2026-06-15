import { motion } from 'motion/react';
import { Film, Globe, Palette, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING } from '../../lib/motion-presets';

interface TrackOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
}

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

const TRACKS: TrackOption[] = [
  {
    id: 'video_editor',
    icon: <Film size={24} />,
    title: 'Video Editor',
    description:
      'Edit raw footage into polished, platform-ready videos for creators, businesses, and brands.',
    badge: 'Creative',
  },
  {
    id: 'wordpress_developer',
    icon: <Globe size={24} />,
    title: 'WordPress Developer',
    description:
      'Build, extend, and optimise WordPress sites including custom themes, plugins, and performance.',
    badge: 'Technical',
  },
  {
    id: 'ui_ux_designer',
    icon: <Palette size={24} />,
    title: 'UI/UX Designer',
    description:
      'Design interfaces, landing pages, and brand identities for digital products and services.',
    badge: 'Design',
  },
];

export function Step1TrackSelection({ selected, onSelect }: Props) {
  return (
    <div>
      {/* Step header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b1c30] mb-3">
          Choose Your Skill Track
        </h2>
        <p className="text-neutral-500 text-base leading-relaxed max-w-xl">
          Select the skill track that best aligns with your strengths, interests, and
          current ability. This will define the foundation of your entire offer.
        </p>
      </div>

      {/* Track cards */}
      <div className="grid sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Choose your career track">
        {TRACKS.map((track, i) => {
          const isSelected = selected === track.id;

          return (
            <motion.button
              key={track.id}
              onClick={() => onSelect(track.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASING.PREMIUM, delay: i * 0.07 }}
              whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.97 }}
              role="radio"
              aria-checked={isSelected}
              className={cn(
                'relative p-6 sm:p-7 rounded-2xl border text-left transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2',
                isSelected
                  ? 'bg-white border-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.14)] ring-1 ring-[#0058be]'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md',
              )}
              id={`track-card-${track.id}`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-4 right-4"
                  aria-hidden="true"
                >
                  <CheckCircle2 size={20} className="text-[#0058be]" />
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-200',
                  isSelected
                    ? 'bg-[#0058be]/8 text-[#0058be]'
                    : 'bg-[#eff4ff] text-neutral-500 group-hover:text-[#0058be] group-hover:bg-[#0058be]/5',
                )}
                aria-hidden="true"
              >
                {track.icon}
              </div>

              {/* Badge */}
              <span
                className={cn(
                  'inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 transition-colors',
                  isSelected
                    ? 'bg-[#0058be] text-white'
                    : 'bg-neutral-100 text-neutral-400',
                )}
              >
                {track.badge}
              </span>

              {/* Title */}
              <h3
                className={cn(
                  'font-bold text-lg mb-1.5 transition-colors',
                  isSelected ? 'text-[#0058be]' : 'text-[#0b1c30]',
                )}
              >
                {track.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-neutral-500 leading-relaxed mb-5">
                {track.description}
              </p>

              {/* Select button */}
              <div
                className={cn(
                  'inline-flex items-center justify-center w-full py-2.5 rounded-lg text-sm font-semibold transition-all',
                  isSelected
                    ? 'bg-[#0058be] text-white shadow-[0_4px_16px_rgba(0,88,190,0.25)]'
                    : 'bg-[#f8f9ff] text-neutral-500 border border-neutral-200 group-hover:border-[#0058be]/20 group-hover:text-[#0058be]',
                )}
              >
                {isSelected ? 'Selected' : 'Select Track'}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
