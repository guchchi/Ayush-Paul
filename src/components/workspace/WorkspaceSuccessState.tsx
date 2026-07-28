import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { CheckCircle } from 'lucide-react';
import { EASING, DURATION } from '../../lib/motion-presets';

interface WorkspaceSuccessStateProps {
  title?: string;
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function WorkspaceSuccessState({
  title = "Success",
  message = "Action completed successfully.",
  className,
  fullScreen = false
}: WorkspaceSuccessStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center bg-[#0a0a0a]",
        fullScreen ? "fixed inset-0 z-50 h-screen w-screen" : "w-full h-full min-h-[400px] rounded-3xl",
        className
      )}
    >
      <div className="relative">
        {/* Background glow */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.2, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -inset-6 bg-emerald-500 rounded-full blur-2xl opacity-20 pointer-events-none"
        />
        
        {/* Core Icon */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: DURATION.NORMAL
          }}
          className="relative w-20 h-20 bg-[#0a0a0a] rounded-full border border-emerald-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.3)]"
        >
          <CheckCircle size={36} className="text-emerald-500" />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="mt-8 text-center"
      >
        <h3 className="text-xl font-bold text-white/95 mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
          {message}
        </p>
      </motion.div>
    </div>
  );
}
