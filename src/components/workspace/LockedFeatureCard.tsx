import { Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { EASING, DURATION } from '../../lib/motion-presets';
import { cn } from '../../lib/utils';

interface LockedFeatureCardProps {
  title: string;
  description: string;
  className?: string;
}

export function LockedFeatureCard({ title, description, className }: LockedFeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
      className={cn(
        "group relative flex items-start gap-4 p-5 rounded-xl",
        "bg-white/5 border border-white/10 overflow-hidden",
        "transition-colors duration-300 hover:bg-white/[0.07] hover:border-white/20",
        className
      )}
    >
      {/* Premium Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-[#0058be]/10 via-transparent to-transparent pointer-events-none" />

      <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-black/40 border border-white/5 text-[#0058be]">
        <Lock size={18} className="opacity-80" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between gap-4 mb-1">
          <h3 className="text-sm font-semibold text-white/90">{title}</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0058be] bg-[#0058be]/10 px-2 py-0.5 rounded-full border border-[#0058be]/20 shrink-0">
            Coming in V1.0
          </span>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
