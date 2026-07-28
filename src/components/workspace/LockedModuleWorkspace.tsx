import React from 'react';
import { motion } from 'motion/react';
import { LockedFeatureCard } from './LockedFeatureCard';
import { Lock, ArrowRight, ArrowLeft, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const trackEvent = (eventName: string, properties?: any) => {
  console.log(`[Analytics] ${eventName}`, properties);
};

export interface LockedModuleConfig {
  moduleNumber: number;
  moduleName: string;
  status: string;
  whyItMatters: string;
  progress: number; // 0-100
  unlockFeatures: { title: string; description: string }[];
  milestones: {
    title: string;
    status: 'complete' | 'in-progress' | 'pending';
  }[];
  previousModulePath: string;
  previousModuleName: string;
  previewLayout?: React.ReactNode;
}

export function LockedModuleWorkspace({ config }: { config: LockedModuleConfig }) {
  const navigate = useNavigate();

  // Track view when mounted
  React.useEffect(() => {
    // In a real app, use a proper analytics library
    console.log('[Analytics] locked_module_viewed', { moduleNumber: config.moduleNumber, moduleName: config.moduleName });
  }, [config.moduleNumber, config.moduleName]);

  const getStatusIcon = (status: 'complete' | 'in-progress' | 'pending') => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'in-progress':
        return <RefreshCw size={14} className="text-amber-500 animate-spin-slow" />;
      case 'pending':
        return <Clock size={14} className="text-zinc-500" />;
    }
  };

  const handleContinueLearning = () => {
    console.log('[Analytics] locked_module_cta_clicked', { action: 'continue_learning', module: config.moduleName });
    navigate(config.previousModulePath);
  };

  const handleReturnDashboard = () => {
    console.log('[Analytics] locked_module_cta_clicked', { action: 'return_dashboard', module: config.moduleName });
    navigate('/workspace/client-acquisition'); // Default dashboard
  };

  return (
    <div className="w-full max-w-3xl py-8">
      {/* Header Area */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white/95 mb-3">
          {config.moduleName}
        </h1>
        <p className="text-sm text-zinc-400 mb-6">{config.whyItMatters}</p>
        <div className="h-px w-full bg-white/10 mb-8" />
        
        <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              <Lock size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">Module Locked</p>
              <p className="text-xs text-zinc-400">Status: {config.status}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-white/5 my-10" />

      {/* Workspace Preview */}
      <div className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
          Workspace Preview
        </h2>
        <div className="relative w-full rounded-xl border border-white/10 overflow-hidden bg-transparent flex items-center justify-center group">
          {/* Mock blurred workspace */}
          <div className="w-full p-6 opacity-40 blur-[4px] pointer-events-none transition-all duration-700 group-hover:blur-[2px] group-hover:opacity-60">
            {config.previewLayout || (
              <>
                <div className="w-1/3 h-6 rounded bg-white/10 mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="h-32 rounded-lg bg-white/5 border border-white/5" />
                  <div className="h-32 rounded-lg bg-white/5 border border-white/5" />
                </div>
                <div className="h-48 rounded-lg bg-white/5 border border-white/5 w-full" />
              </>
            )}
          </div>
          {/* Overlay Lock */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/40 px-6 py-4 backdrop-blur-md">
            <Lock size={24} className="text-white/50" />
            <span className="text-sm font-medium text-white/70">Interface Locked</span>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-white/5 my-10" />

      {/* What You'll Unlock */}
      <div className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
          What you'll unlock
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {config.unlockFeatures.map((feature, idx) => (
            <LockedFeatureCard 
              key={idx}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-white/5 my-10" />

      {/* Development Progress */}
      <div className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
          Current Development
        </h2>
        <div className="space-y-4">
          {config.milestones.map((milestone, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-3 w-32">
                <span className="text-sm font-medium text-white/80">{milestone.title}</span>
              </div>
              <div className="flex items-center justify-center w-6">
                {getStatusIcon(milestone.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-white/5 my-10" />

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button 
          onClick={handleContinueLearning}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-white/80 cursor-pointer"
        >
          Continue Learning
          <ArrowRight size={16} />
        </button>

        <button 
          onClick={handleReturnDashboard}
          className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>

    </div>
  );
}
