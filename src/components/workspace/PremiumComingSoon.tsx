import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, ArrowRight, Bell, CheckCircle2, Circle, Clock, 
  Hammer, ChevronRight, Activity, Sparkles, BookOpen, Layers,
  Zap
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
  'Complete': { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  'Near Complete': { icon: Activity, color: 'text-[#0058be]', bg: 'bg-[#0058be]/5 border-[#0058be]/10' },
  'In Progress': { icon: Circle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  'Active': { icon: Hammer, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
  'Pending': { icon: Clock, color: 'text-neutral-400', bg: 'bg-neutral-50 border-neutral-100' },
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
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] relative overflow-hidden font-sans selection:bg-[#0058be]/20">
      
      {/* Animated Blueprint Grid Background - Light Theme */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 88, 190, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 88, 190, 0.05) 1px, transparent 1px)`,
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f9ff] via-transparent to-[#f8f9ff]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9ff] via-transparent to-[#f8f9ff]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-12 lg:py-20">
        
        {/* Top Badges */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-sm border border-neutral-200">
            <span className="flex h-2 w-2 rounded-full bg-[#0058be] animate-pulse shadow-[0_0_8px_rgba(0,88,190,0.5)]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">Blueprint OS Beta</span>
            <span className="w-px h-3 bg-neutral-200" />
            <span className="text-[10px] font-bold text-[#0b1c30]">3 / 7 Modules Released</span>
            <span className="w-px h-3 bg-neutral-200" />
            <span className="text-[10px] font-extrabold text-[#0058be]">43%</span>
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d1f34d]/20 border border-[#d1f34d]/40 text-[#0b1c30] text-[10px] font-bold uppercase tracking-widest shadow-sm">
            🚀 Beta Access
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0058be]/8 text-[#0058be] text-[11px] font-bold uppercase tracking-widest mb-6">
            <Zap size={12} className="text-[#0058be]" aria-hidden="true" /> Module {config.moduleNumber}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[#0b1c30] leading-[1.1] mb-6">
            {config.moduleName}
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-[#0058be] mb-8">
            {config.tagline}
          </p>
          <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto">
            {config.description}
          </p>
        </div>

        {/* Main Grid: Info + Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24 items-center">
          
          {/* Left: Text & Features */}
          <div className="space-y-10">
            {/* Why it matters */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-200 pb-3">
                Why This Matters
              </h2>
              <p className="text-[#0b1c30] text-lg leading-relaxed font-medium pt-2">
                {config.whyItMatters}
              </p>
            </div>

            {/* Feature Spotlight */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 relative overflow-hidden shadow-md group min-h-[220px] flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0058be] to-transparent opacity-20" />
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-[#eff4ff] flex items-center justify-center shadow-sm">
                  <Sparkles size={16} className="text-[#0058be]" />
                </div>
                <h3 className="font-bold text-[#0b1c30] text-sm tracking-wide">Feature Spotlight</h3>
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
                      <h4 className="text-xl font-bold text-[#0b1c30] mb-2">
                        {config.previewFeatures[activeFeatureIndex].name}
                      </h4>
                      <p className="text-neutral-500 text-sm leading-relaxed">
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
                      "h-1.5 rounded-full transition-all duration-500",
                      idx === activeFeatureIndex ? "w-8 bg-[#0058be]" : "w-2 bg-neutral-200"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button 
                onClick={() => navigate(config.previousModulePath)}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#0058be] text-white font-bold text-base transition-colors shadow-[0_8px_24px_rgba(0,88,190,0.2)] hover:bg-[#0047a0] group focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2"
              >
                Continue Building
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white border border-neutral-200 text-neutral-600 font-bold text-base transition-colors hover:bg-neutral-50 hover:text-[#0b1c30] shadow-sm">
                <Bell size={18} />
                Notify Me
              </button>
            </div>
          </div>

          {/* Right: Sneak Peek Visuals (Light Glassmorphism) */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#0058be]/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative rounded-3xl border border-white/60 bg-white/40 backdrop-blur-xl p-6 shadow-2xl overflow-hidden group">
              {/* Fake Browser Chrome */}
              <div className="flex items-center gap-2 mb-6 border-b border-neutral-200/50 pb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto px-16 py-1.5 rounded-md bg-white/50 text-[10px] text-neutral-400 font-mono flex items-center gap-2 shadow-sm border border-neutral-100/50">
                  <Lock size={10} />
                  blueprintos.com/workspace
                </div>
              </div>

              {/* Fake Dashboard Layout */}
              <div className="space-y-6 opacity-40 group-hover:opacity-80 transition-opacity duration-700">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="w-32 h-6 bg-neutral-200 rounded-md animate-pulse" />
                  <div className="w-10 h-10 bg-neutral-200 rounded-full animate-pulse" />
                </div>
                
                {/* Fake Charts / Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-white/60 border border-neutral-100 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-[#eff4ff]" />
                      <div className="w-16 h-2 bg-neutral-200 rounded-full" />
                    </div>
                  ))}
                </div>

                {/* Fake List / Cards */}
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/60 border border-neutral-100 shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-[#0058be]/10 flex items-center justify-center">
                        <Layers size={16} className="text-[#0058be]" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="w-1/3 h-2 bg-neutral-200 rounded-full" />
                        <div className="w-1/4 h-2 bg-neutral-100 rounded-full" />
                      </div>
                      <div className="w-8 h-4 bg-neutral-200 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Overlay Lock */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mb-4 shadow-xl">
                  <Lock size={24} className="text-[#0b1c30]" />
                </div>
                <span className="text-sm font-bold tracking-widest uppercase text-[#0b1c30]">Preview Only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Status & Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          
          {/* Progress Confidence */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 lg:col-span-2 shadow-sm">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3 mb-6 flex items-center gap-2">
              <Hammer className="text-[#0058be]" size={14} />
              Development Status
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(config.developmentProgress).map(([phase, status]) => {
                const conf = statusConfig[status as keyof typeof statusConfig];
                const Icon = conf.icon;
                return (
                  <div key={phase} className={cn("p-4 rounded-2xl border", conf.bg)}>
                    <Icon size={18} className={cn("mb-2", conf.color)} />
                    <div className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-1">{phase}</div>
                    <div className={cn("text-xs font-extrabold", conf.color)}>{status}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Roadmap Timeline */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3 mb-6 flex items-center gap-2">
              <Clock className="text-[#0058be]" size={14} />
              Version Timeline
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-emerald-700 font-bold text-sm">Beta v0.3</span>
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0058be]/5 border border-[#0058be]/10">
                <span className="text-[#0058be] font-bold text-sm">Beta v0.4</span>
                <Activity size={16} className="text-[#0058be] animate-pulse" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 font-bold text-sm">Beta v0.5</span>
                <Circle size={16} className="text-neutral-300" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 font-bold text-sm">Version 1.0</span>
                <Lock size={16} className="text-neutral-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison (Available vs Coming) */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">The Blueprint Ecosystem</h2>
            <p className="text-sm text-neutral-500">See what's available today and what's coming next.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Available */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-[#0b1c30]">Available Today</h3>
              </div>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm font-semibold text-[#0b1c30]"><CheckCircle2 size={16} className="text-emerald-500"/> Module 1: Client Acquisition</div>
                <div className="flex items-center gap-3 text-sm font-semibold text-[#0b1c30]"><CheckCircle2 size={16} className="text-emerald-500"/> Module 2: Offer Engineering</div>
                <div className="flex items-center gap-3 text-sm font-semibold text-[#0b1c30]"><CheckCircle2 size={16} className="text-emerald-500"/> Module 3: Authority System</div>
              </div>
              <button 
                onClick={() => navigate('/workspace/client-acquisition')}
                className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-[#0b1c30] rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2"
              >
                Continue Learning <ArrowRight size={16} />
              </button>
            </div>

            {/* Coming Soon */}
            <div className="bg-[#eff4ff]/60 border border-[#eff4ff] rounded-3xl p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#0058be]/10 flex items-center justify-center">
                    <Activity size={20} className="text-[#0058be]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0b1c30]">Coming Soon</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-semibold text-neutral-500"><Circle size={16} className="text-[#0058be]/50"/> Module 4: Portfolio System</div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-neutral-400"><Circle size={16} className="text-neutral-300"/> Module 5: Client Pipeline</div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-neutral-400"><Circle size={16} className="text-neutral-300"/> Module 6: Outreach Engine</div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-neutral-400"><Circle size={16} className="text-neutral-300"/> Module 7: Client Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI & Philosophy & Community */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="bg-white border border-neutral-100 p-6 rounded-3xl flex flex-col items-center text-center gap-3 shadow-sm hover:border-[#0058be]/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#eff4ff] flex items-center justify-center">
              <Sparkles className="text-[#0058be]" size={20} />
            </div>
            <h4 className="font-bold text-[#0b1c30] text-sm">AI Assistant Training</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">This module is currently training its workflows and recommendations to provide personalized insights.</p>
          </div>
          <div className="bg-white border border-neutral-100 p-6 rounded-3xl flex flex-col items-center text-center gap-3 shadow-sm hover:border-[#0058be]/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <BookOpen className="text-amber-500" size={20} />
            </div>
            <h4 className="font-bold text-[#0b1c30] text-sm">Development Philosophy</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">Every module is released only after meeting our quality standards. We prefer shipping polished experiences.</p>
          </div>
          <div className="bg-white border border-neutral-100 p-6 rounded-3xl flex flex-col items-center text-center gap-3 shadow-sm hover:border-[#0058be]/30 transition-colors">
            <div className="flex -space-x-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-neutral-200 border-2 border-white shadow-sm" />
              <div className="w-10 h-10 rounded-full bg-neutral-300 border-2 border-white shadow-sm" />
              <div className="w-10 h-10 rounded-full bg-[#0058be] border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm">+</div>
            </div>
            <h4 className="font-bold text-[#0b1c30] text-sm">Community Driven</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">Join other beta users waiting for this module. Your early feedback helps shape the final product.</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-center text-[#0b1c30] mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 group hover:border-[#0058be]/40 transition-colors shadow-sm cursor-default">
              <h4 className="font-bold mb-2 flex items-center gap-2 text-[#0b1c30] text-sm">
                <ChevronRight size={16} className="text-[#0058be] group-hover:translate-x-1 transition-transform" /> 
                Why is this module unavailable?
              </h4>
              <p className="text-neutral-500 text-sm ml-6 leading-relaxed">We are rolling out Blueprint OS iteratively. This ensures we can gather feedback on the foundational modules and refine our systems before releasing advanced workflows.</p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 group hover:border-[#0058be]/40 transition-colors shadow-sm cursor-default">
              <h4 className="font-bold mb-2 flex items-center gap-2 text-[#0b1c30] text-sm">
                <ChevronRight size={16} className="text-[#0058be] group-hover:translate-x-1 transition-transform" /> 
                When will it launch?
              </h4>
              <p className="text-neutral-500 text-sm ml-6 leading-relaxed">This module is planned for the Version 1.0 release. Check the Development Status above to track our real-time progress.</p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 group hover:border-[#0058be]/40 transition-colors shadow-sm cursor-default">
              <h4 className="font-bold mb-2 flex items-center gap-2 text-[#0b1c30] text-sm">
                <ChevronRight size={16} className="text-[#0058be] group-hover:translate-x-1 transition-transform" /> 
                How do I get notified?
              </h4>
              <p className="text-neutral-500 text-sm ml-6 leading-relaxed">Use the "Notify Me" button at the top of this page. You'll receive an email the moment this module unlocks in your workspace.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-200 text-neutral-400 text-[10px] font-mono uppercase tracking-widest">
          <div>Blueprint OS Beta v0.3</div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <span>{config.estimatedRelease}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span>Build 2026.07.28</span>
          </div>
        </div>

      </div>
    </div>
  );
}
