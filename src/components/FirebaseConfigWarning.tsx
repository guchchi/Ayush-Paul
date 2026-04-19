import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Terminal, ShieldAlert, X, Settings2, Database } from 'lucide-react';
import { cn } from '../lib/utils';
import { getFirebaseStatus } from '../firebase';

interface Props {
  variant?: 'banner' | 'fullscreen';
  className?: string;
  onDismiss?: () => void;
}

export const FirebaseConfigWarning: React.FC<Props> = ({ 
  variant = 'banner', 
  className,
  onDismiss 
}) => {
  const status = getFirebaseStatus();
  
  if (status.isConfigured) return null;

  const containerVariants = {
    initial: variant === 'banner' ? { y: -100, opacity: 0 } : { opacity: 0, scale: 0.95 },
    animate: variant === 'banner' ? { y: 0, opacity: 1 } : { opacity: 1, scale: 1 },
    exit: variant === 'banner' ? { y: -100, opacity: 0 } : { opacity: 0, scale: 0.95 }
  };

  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-[10000] bg-[#0A0A0A] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="fixed inset-0 bg-brand-primary/[0.02] pointer-events-none" />
        
        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="max-w-2xl w-full"
        >
          <div className="glass-card p-12 rounded-[40px] border border-red-500/20 text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 blur-[100px] pointer-events-none" />

            <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-10 relative z-10">
              <ShieldAlert size={40} />
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight mb-6">Configuration Required</h1>
            
            <p className="text-lg text-white/40 mb-10 leading-relaxed">
              Firebase credentials are missing or invalid in your <span className="text-white/60 font-mono">.env</span> or deployment settings. Data and authentication features are currently offline.
            </p>

            <div className="space-y-6 text-left mb-12">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                  <Terminal size={14} /> Missing Environment Variables
                </div>
                <div className="flex flex-wrap gap-2">
                  {status.missingVars.map(v => (
                    <code key={v} className="px-3 py-1 rounded-md bg-white/10 text-xs font-mono text-white/60 border border-white/10">
                      {v}
                    </code>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                  <Database size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">Vercel Deployment Tip</h4>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Add these keys in Project Settings {'>'} Environment Variables, then trigger a new deployment.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 px-8 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:bg-white/90 transition-all active:scale-95"
              >
                Retry Connection
              </button>
              <a 
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Firebase Console
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-[10000] w-[95%] max-w-2xl",
          className
        )}
      >
        <div className="glass-card p-4 sm:p-6 rounded-3xl border border-red-500/30 shadow-2xl backdrop-blur-3xl overflow-hidden group">
          <div className="absolute inset-0 bg-red-500/[0.03] group-hover:bg-red-500/[0.05] transition-colors pointer-events-none" />
          
          <div className="flex items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <Settings2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight">System Degradation: Backend Missing</h3>
                <p className="text-xs text-white/40 max-w-[400px] leading-relaxed">
                  Site is running in static mode. Some features are unavailable due to missing Firebase configuration.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.location.href = '/admin'}
                className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all whitespace-nowrap"
              >
                Audit Setup
              </button>
              {onDismiss && (
                <button 
                  onClick={onDismiss}
                  className="p-2 text-white/20 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
