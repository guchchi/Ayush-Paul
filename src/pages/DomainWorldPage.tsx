import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { DOMAIN_WORLDS } from '../lib/domain-worlds';
import { ArrowLeft, Terminal, LayoutGrid, Rocket } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSEO } from '../hooks/useSEO';

export const DomainWorldPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const domain = DOMAIN_WORLDS.find(d => d.id === id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, [id]);

  useSEO({
    title: domain ? `${domain.title} | Ayush Paul Ecosystem` : "Domain Not Found",
    description: domain?.description,
    noindex: !domain
  });

  if (!domain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Domain Disconnected</h1>
          <button onClick={() => navigate('/')} className="text-brand-primary">Return to Gateway</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative"
    >
      {/* Dynamic Ambient Background based on Domain Theme */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${domain.themeColor} 0%, transparent 70%)`
        }}
      />

      {/* OS Navigation Override for Domain World */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group magnetic-target"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/60 group-hover:text-white">Gateway</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: domain.themeColor }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Active Instance</span>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Fullscreen Cinematic Entry */}
        <section className="min-h-[90vh] flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div 
              className="text-xs font-bold uppercase tracking-[0.4em] mb-6"
              style={{ color: domain.themeColor }}
            >
              {domain.tagline}
            </div>
            <motion.h1 
              layoutId={`domain-title-${domain.id}`}
              className="text-[clamp(4rem,10vw,10rem)] font-extrabold tracking-tighter leading-[0.9] mb-8"
            >
              {domain.title}
            </motion.h1>
            <p className="text-xl md:text-3xl text-white/50 max-w-3xl font-medium leading-relaxed">
              {domain.description}
            </p>
          </motion.div>
        </section>

        {/* Cinematic Image Reveal */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full px-6 md:px-12 lg:px-24 mb-32"
        >
          <div className="w-full aspect-[21/9] rounded-[3rem] overflow-hidden relative border border-white/10 group">
            <motion.img 
              layoutId={`domain-card-${domain.id}`}
              src={domain.image} 
              alt={domain.title}
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            
            {/* Stat Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-wrap gap-8 md:gap-16 bg-gradient-to-t from-black to-transparent">
              {domain.stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-3xl md:text-5xl font-bold tracking-tighter text-white">{stat.value}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Narrative & Content Container (Placeholder for Phase 2) */}
        <section className="max-w-4xl mx-auto px-6 mb-40">
          <div className="space-y-12 text-lg md:text-xl text-white/60 leading-relaxed font-medium">
            <p>
              This is the operational core of the {domain.title} division. Infrastructure here is designed to scale, optimized for high-throughput interactions, and built to solve critical industry bottlenecks.
            </p>
            <p>
              {domain.id === 'ai-systems' && "Our language models and agentic workflows are currently parsing complex logical frameworks, reducing overhead by automating redundant creative and analytical tasks."}
              {domain.id === 'robotics' && "Hardware systems are integrated with real-time OS paradigms, ensuring microsecond latency for autonomous navigation and sensor fusion."}
              {domain.id === 'founder' && "Venture building requires systemic thinking. We construct operational frameworks that allow products to find product-market fit rapidly."}
              {/* Add more specific domain text as needed */}
            </p>
            
            <div className="pt-12 border-t border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Current Architecture</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="p-6 rounded-2xl glass-card border border-white/5 flex gap-4 items-start">
                    <Terminal size={20} style={{ color: domain.themeColor }} />
                    <div>
                      <div className="font-bold text-white text-sm mb-1">System Module {i}</div>
                      <div className="text-xs text-white/40">Operational status normal.</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Next Action */}
        <section className="py-32 border-t border-white/10 bg-white/[0.02] text-center">
          <div className="text-xs font-bold uppercase tracking-[0.4em] text-white/30 mb-8">System Action</div>
          <h2 className="text-5xl font-extrabold tracking-tighter mb-12">Initialize <span style={{ color: domain.themeColor }}>Connection</span>.</h2>
          <div className="flex justify-center gap-6">
             <button onClick={() => navigate('/collaborate')} className="px-10 py-5 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform">
               Deploy Project
             </button>
             <button onClick={() => navigate('/')} className="px-10 py-5 rounded-full glass-card border border-white/10 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-colors">
               Return to Gateway
             </button>
          </div>
        </section>
      </main>
    </motion.div>
  );
};
