import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, ArrowRight, Bell, CheckCircle2, Circle, Clock, 
  Hammer, ChevronRight, Activity, Sparkles, BookOpen, Layers
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export interface ComingSoonConfig {
  moduleNumber: number;
  moduleName: string;
  tagline: string;
  description: string;
  whyItMatters: string;
  previewFeatures: { name: string; description: string }[];
  developmentProgress: {
    research: 'Complete' | 'Near Complete' | 'In Progress' | 'Active' | 'Pending';
    content: 'Complete' | 'Near Complete' | 'In Progress' | 'Active' | 'Pending';
    design: 'Complete' | 'Near Complete' | 'In Progress' | 'Active' | 'Pending';
    development: 'Complete' | 'Near Complete' | 'In Progress' | 'Active' | 'Pending';
    testing: 'Complete' | 'Near Complete' | 'In Progress' | 'Active' | 'Pending';
  };
  estimatedRelease: string;
  previousModulePath: string;
}

const statusConfig = {
  'Complete': { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  'Near Complete': { icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  'In Progress': { icon: Circle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  'Active': { icon: Hammer, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  'Pending': { icon: Clock, color: 'text-neutral-400', bg: 'bg-neutral-500/10' },
};

export function PremiumComingSoon({ config }: { config: ComingSoonConfig }) {
  const navigate = useNavigate();
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  // Rotating feature spotlight
  useEffect(() => {
    if (config.previewFeatures.length === 0) return;
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % config.previewFeatures.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [config.previewFeatures.length]);

  return (
    <div className="min-h-screen bg-[#0b1c30] text-white relative overflow-hidden font-sans selection:bg-brand-primary/30">
      {/* Animated Blueprint Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, #1e3a5f 1px, transparent 1px), linear-gradient(to bottom, #1e3a5f 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
          animate={{
            x: [0, -40],
            y: [0, -40]
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1c30] via-transparent to-[#0b1c30]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1c30] via-transparent to-[#0b1c30]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 lg:py-32">
        
        {/* Top Badges */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(0,194,255,0.8)] animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/80">Blueprint OS Beta</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="text-xs font-medium text-white/60">3 / 7 Modules Released</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="text-xs font-bold text-brand-primary">43%</span>
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wider">
            🚀 Beta Access
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-brand-primary font-mono text-sm tracking-widest mb-4">MODULE {config.moduleNumber}</h2>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            {config.moduleName}
          </h1>
          <p className="text-xl md:text-2xl font-light text-white/60 mb-8">
            Currently in Development
          </p>
          <p className="text-lg text-white/80 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
            We are crafting this module carefully to ensure it delivers the best learning experience. 
            <br className="hidden md:block" /> {config.description}
          </p>
        </div>

        {/* Main Grid: Info + Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 items-center">
          
          {/* Left: Text & Features */}
          <div className="space-y-12">
            {/* Why it matters */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand-primary mb-2">
                <Sparkles size={18} />
                <h3 className="font-bold text-sm tracking-widest uppercase">Why This Matters</h3>
              </div>
              <p className="text-white/70 text-lg leading-relaxed">
                {config.whyItMatters}
              </p>
            </div>

            {/* Feature Spotlight */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 relative overflow-hidden group min-h-[220px] flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary/0 via-brand-primary to-brand-primary/0 opacity-50" />
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-brand-primary" />
                </div>
                <h3 className="font-bold text-white tracking-wide">Feature Spotlight</h3>
              </div>
              
              <div className="h-24 relative">
                <AnimatePresence mode="wait">
                  {config.previewFeatures.length > 0 && (
                    <motion.div
                      key={activeFeatureIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <h4 className="text-xl font-semibold text-white mb-2">
                        {config.previewFeatures[activeFeatureIndex].name}
                      </h4>
                      <p className="text-white/50">
                        {config.previewFeatures[activeFeatureIndex].description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Spotlight Indicators */}
              <div className="flex gap-2 mt-6">
                {config.previewFeatures.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      idx === activeFeatureIndex ? "w-8 bg-brand-primary" : "w-2 bg-white/20"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate(config.previousModulePath)}
                className="px-8 py-4 bg-brand-primary text-[#0b1c30] rounded-xl font-bold hover:bg-white transition-colors flex items-center justify-center gap-2 group"
              >
                Continue Building
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                <Bell size={18} />
                Notify Me
              </button>
            </div>
          </div>

          {/* Right: Sneak Peek Visuals (Glassmorphism) */}
          <div className="relative">
            <div className="absolute inset-0 bg-brand-primary/20 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl overflow-hidden group">
              {/* Fake Browser Chrome */}
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="mx-auto px-20 py-1.5 rounded-md bg-white/5 text-[10px] text-white/30 font-mono flex items-center gap-2">
                  <Lock size={10} />
                  blueprintos.com/workspace
                </div>
              </div>

              {/* Fake Dashboard Layout */}
              <div className="space-y-6 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="w-32 h-6 bg-white/10 rounded-md animate-pulse" />
                  <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
                </div>
                
                {/* Fake Charts / Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gradient-to-br from-white/5 to-white/0 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded-full bg-white/10" />
                      <div className="w-16 h-2 bg-white/10 rounded-full" />
                    </div>
                  ))}
                </div>

                {/* Fake List / Cards */}
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                        <Layers size={16} className="text-brand-primary/50" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="w-1/3 h-2 bg-white/20 rounded-full" />
                        <div className="w-1/4 h-2 bg-white/10 rounded-full" />
                      </div>
                      <div className="w-8 h-4 bg-white/10 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Overlay Lock */}
              <div className="absolute inset-0 bg-[#0b1c30]/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 backdrop-blur-md">
                  <Lock size={24} className="text-white" />
                </div>
                <span className="text-sm font-bold tracking-widest uppercase text-white">Preview Only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Status & Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
          
          {/* Progress Confidence */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 lg:col-span-2">
            <h3 className="font-bold text-xl mb-8 flex items-center gap-3">
              <Hammer className="text-brand-primary" />
              Development Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(config.developmentProgress).map(([phase, status]) => {
                const conf = statusConfig[status as keyof typeof statusConfig];
                const Icon = conf.icon;
                return (
                  <div key={phase} className={cn("p-4 rounded-xl border border-white/5", conf.bg)}>
                    <Icon size={20} className={cn("mb-3", conf.color)} />
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">{phase}</div>
                    <div className={cn("text-sm font-semibold", conf.color)}>{status}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Roadmap Timeline */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
              <Clock className="text-brand-primary" />
              Version Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-500 font-bold">Beta v0.3</span>
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-brand-primary/10 border border-brand-primary/20">
                <span className="text-brand-primary font-bold">Beta v0.4</span>
                <Activity size={16} className="text-brand-primary animate-pulse" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-white/50 font-medium">Beta v0.5</span>
                <Circle size={16} className="text-white/30" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-white/50 font-medium">Version 1.0</span>
                <Lock size={16} className="text-white/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison (Available vs Coming) */}
        <div className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Blueprint Ecosystem</h2>
            <p className="text-white/50">See what's available today and what's coming next.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Available */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold">Available Today</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/80"><CheckCircle2 size={18} className="text-emerald-500"/> Module 1: Client Acquisition</div>
                <div className="flex items-center gap-3 text-white/80"><CheckCircle2 size={18} className="text-emerald-500"/> Module 2: Offer Engineering</div>
                <div className="flex items-center gap-3 text-white/80"><CheckCircle2 size={18} className="text-emerald-500"/> Module 3: Authority System</div>
              </div>
              <button 
                onClick={() => navigate('/workspace/client-acquisition')}
                className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors flex justify-center items-center gap-2"
              >
                Continue Learning <ArrowRight size={16} />
              </button>
            </div>

            {/* Coming Soon */}
            <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-primary/5 group-hover:bg-brand-primary/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                    <Activity className="text-brand-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Coming Soon</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/50"><Circle size={18} className="text-brand-primary/50"/> Module 4: Portfolio System</div>
                  <div className="flex items-center gap-3 text-white/50"><Circle size={18} className="text-white/30"/> Module 5: Client Pipeline</div>
                  <div className="flex items-center gap-3 text-white/50"><Circle size={18} className="text-white/30"/> Module 6: Outreach Engine</div>
                  <div className="flex items-center gap-3 text-white/50"><Circle size={18} className="text-white/30"/> Module 7: Client Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI & Philosophy & Community */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-brand-primary/50 transition-colors">
            <Sparkles className="text-brand-primary" size={24} />
            <h4 className="font-bold">AI Assistant Training</h4>
            <p className="text-sm text-white/60">This module is currently training its workflows and recommendations to provide personalized insights.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-brand-primary/50 transition-colors">
            <BookOpen className="text-amber-500" size={24} />
            <h4 className="font-bold">Development Philosophy</h4>
            <p className="text-sm text-white/60">Every module is released only after meeting our quality standards. We prefer shipping polished experiences over unfinished features.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-brand-primary/50 transition-colors">
            <div className="flex -space-x-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-neutral-700 border-2 border-[#0b1c30]" />
              <div className="w-10 h-10 rounded-full bg-neutral-600 border-2 border-[#0b1c30]" />
              <div className="w-10 h-10 rounded-full bg-brand-primary/20 border-2 border-[#0b1c30] flex items-center justify-center text-xs font-bold text-brand-primary">+</div>
            </div>
            <h4 className="font-bold">Community Driven</h4>
            <p className="text-sm text-white/60">Join other beta users waiting for this module. Your early feedback helps shape the final product.</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-32">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 group hover:bg-white/10 transition-colors">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <ChevronRight size={16} className="text-brand-primary group-hover:translate-x-1 transition-transform" /> 
                Why is this module unavailable?
              </h4>
              <p className="text-white/60 text-sm ml-6">We are rolling out Blueprint OS iteratively. This ensures we can gather feedback on the foundational modules and refine our systems before releasing advanced workflows.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 group hover:bg-white/10 transition-colors">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <ChevronRight size={16} className="text-brand-primary group-hover:translate-x-1 transition-transform" /> 
                When will it launch?
              </h4>
              <p className="text-white/60 text-sm ml-6">This module is planned for the Version 1.0 release. Check the Development Status above to track our real-time progress.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 group hover:bg-white/10 transition-colors">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <ChevronRight size={16} className="text-brand-primary group-hover:translate-x-1 transition-transform" /> 
                How do I get notified?
              </h4>
              <p className="text-white/60 text-sm ml-6">Use the "Notify Me" button at the top of this page. You'll receive an email the moment this module unlocks in your workspace.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-white/40 text-xs font-mono">
          <div>Blueprint OS Beta v0.3</div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span>{config.estimatedRelease}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Build 2026.07.28</span>
          </div>
        </div>

      </div>
    </div>
  );
}
