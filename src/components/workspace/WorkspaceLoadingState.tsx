import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { Zap } from 'lucide-react';

interface WorkspaceLoadingStateProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function WorkspaceLoadingState({
  message = "Loading workspace...",
  className,
  fullScreen = false
}: WorkspaceLoadingStateProps) {
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
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -inset-4 bg-[#0058be] rounded-full blur-xl opacity-30"
        />
        
        {/* Core spinner / icon */}
        <div className="relative w-16 h-16 bg-[#0a0a0a] rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(0,88,190,0.5)]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-transparent border-t-[#0058be] border-r-[#0058be]/30"
          />
          <Zap size={24} className="text-[#0058be]" />
        </div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-sm font-bold uppercase tracking-widest text-white/50"
      >
        {message}
      </motion.p>
    </div>
  );
}
