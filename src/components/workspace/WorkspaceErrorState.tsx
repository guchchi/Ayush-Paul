import { AlertTriangle, RefreshCw, MessageSquarePlus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface WorkspaceErrorStateProps {
  title?: string;
  message: string;
  errorId?: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function WorkspaceErrorState({
  title = "Something went wrong",
  message,
  errorId,
  onRetry,
  className,
  compact = false
}: WorkspaceErrorStateProps) {
  const generatedErrorId = errorId || `ERR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-xl bg-[#0a0a0a] border border-red-500/20",
          className
        )}
        role="alert"
      >
        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
          <AlertTriangle size={16} className="text-red-500" aria-hidden="true" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-bold text-white mb-1">{title}</p>
          <p className="text-xs text-white/50 leading-relaxed">{message}</p>
          <div className="mt-3 flex items-center gap-3">
             {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={12} /> Retry
                </button>
             )}
             <a
                href="https://tally.so/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold uppercase tracking-widest text-[#0058be] hover:text-[#0047a0] transition-colors flex items-center gap-1.5"
             >
                <MessageSquarePlus size={12} /> Report Issue
             </a>
             <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-auto">
                ID: {generatedErrorId}
             </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-[2rem] border border-white/5 bg-[#0a0a0a]",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      
      <h3 className="text-2xl font-bold text-white tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-white/50 max-w-md mb-8 leading-relaxed">{message}</p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white active:scale-[0.98]"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        )}
        
        <a
          href="https://tally.so/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all border border-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 active:scale-[0.98]"
        >
          <MessageSquarePlus size={16} />
          <span>Report Issue</span>
        </a>
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5 w-full max-w-[200px] flex items-center justify-center">
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
          Error ID: {generatedErrorId}
        </span>
      </div>
    </motion.div>
  );
}
