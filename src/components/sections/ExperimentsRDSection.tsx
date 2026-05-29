import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { db, collection, query, orderBy, onSnapshot } from "../../firebase";
import { Section } from '../ui/Section';
import { ArrowRight, X, ExternalLink, Activity, Play, Zap, Terminal, ShieldAlert } from 'lucide-react';
import { VARIANTS, EASING } from '../../lib/motion-presets';
import { cn } from '../../lib/utils';

export const ExperimentsRDSection = () => {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperiment, setSelectedExperiment] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((item: any) => {
          const t = (item.title || '').toLowerCase();
          const d = (item.description || '').toLowerCase();
          return !t.includes('test') && !d.includes('test');
        });
      setExperiments(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error loading experiments:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Section id="experiments-rd" glowVariant="center" className="py-24 border-t border-white/5 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="section-header max-w-3xl text-center mx-auto mb-20 flex flex-col items-center">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="badge shadow-xl shadow-brand-secondary/10"
          >
            <Activity size={12} className="text-brand-secondary animate-pulse" /> Engineering Research Lab
          </motion.div>
          <motion.h2 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mt-6"
          >
            Ongoing <span className="text-brand-secondary">Experiments.</span>
          </motion.h2>
          <motion.p 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-white/40 text-lg md:text-xl font-medium mt-6"
          >
            Active cyber-physical prototypes, system layouts, and edge-intelligence models under continuous testing.
          </motion.p>
        </div>

        {/* R&D Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse glass-card rounded-[32px] overflow-hidden aspect-video bg-white/5" />
            ))
          ) : experiments.map((exp, i) => {
            const phaseStatus = exp.status || (exp.featured ? "Live / Scale" : "Active R&D");
            const statusColorClass = 
              phaseStatus.includes("Live") ? "text-green-400 bg-green-400/10 border-green-400/20" :
              phaseStatus.includes("Beta") ? "text-brand-primary bg-brand-primary/10 border-brand-primary/20" :
              "text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20";

            return (
              <motion.div
                key={exp.id}
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                whileHover={VARIANTS.lift.whileHover}
                whileTap={{ scale: 0.99 }}
                transition={{ ...VARIANTS.fadeUp.transition, delay: i * 0.1 }}
                onClick={() => setSelectedExperiment(exp)}
                className="group relative cursor-pointer glass-card border-white/5 hover:border-white/10 rounded-[32px] overflow-hidden flex flex-col h-full bg-[#0D0D0E]"
                style={{ willChange: 'transform' }}
              >
                {/* Visual Header */}
                <div className="aspect-[16/9] w-full overflow-hidden bg-black/40 border-b border-white/5 relative">
                  <img 
                    src={exp.image} 
                    alt={exp.title} 
                    loading="lazy" 
                    className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                  
                  {/* Status Pill */}
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className={cn("px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border", statusColorClass)}>
                      {phaseStatus}
                    </span>
                    <span className="px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-white/50 border border-white/10">
                      {exp.category || "Prototype"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-brand-secondary transition-colors">
                      {exp.title}
                    </h3>
                    <ArrowRight className="-rotate-45 text-white/20 group-hover:text-brand-secondary transition-colors" size={20} />
                  </div>

                  {/* Objective (Narrative) */}
                  <div className="mb-6">
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/20 mb-2 block">Objective</span>
                    <p className="text-white/50 text-sm leading-relaxed font-medium line-clamp-2">
                      {exp.problem || exp.description}
                    </p>
                  </div>

                  {/* Technical Direction */}
                  <div className="mb-8 mt-auto">
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/20 mb-2 block">Technical Direction</span>
                    <p className="text-brand-primary text-xs font-bold tracking-wide line-clamp-1">
                      {exp.strategy || (exp.tech ? exp.tech.join(" • ") : "Custom Architecture")}
                    </p>
                  </div>

                  {/* Telemetry/Meta Tags */}
                  <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                    {exp.tech?.slice(0, 4).map((tag: string) => (
                      <span 
                        key={tag} 
                        className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[9px] font-bold text-white/30 uppercase tracking-widest"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section Action */}
        <div className="flex justify-center mt-16">
          <Link 
            to="/systems" 
            className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl text-sm font-bold tracking-widest text-white transition-all uppercase flex items-center gap-2 group"
          >
            Access All Systems & Blueprints 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-brand-secondary" />
          </Link>
        </div>

      </div>

      {/* Modal Case Study Overlay */}
      <AnimatePresence>
        {selectedExperiment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-[#0A0A0A]/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ ease: EASING.PREMIUM as any, duration: 0.4 }}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-card rounded-[40px] border border-white/10 shadow-2xl no-scrollbar"
            >
              <button 
                onClick={() => setSelectedExperiment(null)}
                className="fixed top-12 right-12 z-50 w-12 h-12 rounded-full glass-card border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <div className="aspect-video w-full relative">
                {selectedExperiment.video ? (
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src={selectedExperiment.video} type="video/mp4" />
                  </video>
                ) : (
                  <img src={selectedExperiment.image} alt={selectedExperiment.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12 lg:left-20">
                  <span className="text-brand-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
                    {selectedExperiment.category || "Prototype"}
                  </span>
                  <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-none">{selectedExperiment.title}</h2>
                </div>
              </div>

              <div className="p-8 md:p-20">
                <div className="grid lg:grid-cols-3 gap-16 md:gap-24 mb-20">
                  <div className="lg:col-span-2 space-y-16">
                    <section>
                      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                        <span className="w-10 h-10 rounded-xl bg-blend-lighten bg-brand-secondary/10 flex items-center justify-center text-brand-secondary text-sm font-bold border border-brand-secondary/20 italic">01</span>
                        The Problem / Objective
                      </h3>
                      <p className="text-white/50 text-lg leading-relaxed font-medium">{selectedExperiment.problem || selectedExperiment.description}</p>
                    </section>
                    
                    <section>
                      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                        <span className="w-10 h-10 rounded-xl bg-blend-lighten bg-brand-primary/10 flex items-center justify-center text-brand-primary text-sm font-bold border border-brand-primary/20 italic">02</span>
                        Technical Strategy
                      </h3>
                      <p className="text-white/50 text-lg leading-relaxed font-medium">{selectedExperiment.strategy || "Prioritized modular architecture and performance-first rendering to ensure 99.9% uptime and sub-second interaction latency."}</p>
                    </section>

                    <section>
                      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                        <span className="w-10 h-10 rounded-xl bg-blend-lighten bg-brand-accent/10 flex items-center justify-center text-brand-accent text-sm font-bold border border-brand-accent/20 italic">03</span>
                        Solution Architecture
                      </h3>
                      <p className="text-white/50 text-lg leading-relaxed font-medium">{selectedExperiment.process || "Implemented a custom event-driven system with edge-caching and hardware-accelerated CSS for seamless responsiveness."}</p>
                    </section>

                    <section>
                      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                        <span className="w-10 h-10 rounded-xl bg-blend-lighten bg-green-500/10 flex items-center justify-center text-green-500 text-sm font-bold border border-green-500/20 italic">04</span>
                        System Performance Impact
                      </h3>
                      <p className="text-white/50 text-lg leading-relaxed font-medium">{selectedExperiment.impact || "Delivered 40% improvement in load times and sustained a 25% increase in user engagement post-optimization."}</p>
                    </section>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="glass-card p-10 rounded-[32px] border border-white/10">
                      <h3 className="text-xl font-bold mb-8">Performance Telemetry</h3>
                      <div className="space-y-8">
                        {[
                          { label: "Performance", val: 98 },
                          { label: "Lighthouse UX", val: 95 },
                          { label: "System Scalability", val: 92 }
                        ].map(stat => (
                          <div key={stat.label}>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">
                              <span>{stat.label}</span>
                              <span className="text-brand-secondary">{stat.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${stat.val}%` }}
                                transition={{ duration: 1.5, ease: EASING.PREMIUM as any }}
                                className="h-full bg-brand-secondary shadow-[0_0_15px_rgba(255,0,60,0.4)]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {selectedExperiment.link && (
                      <a 
                        href={selectedExperiment.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-6 bg-white text-black rounded-3xl font-bold text-lg hover:bg-brand-secondary hover:text-white transition-all group shadow-2xl"
                      >
                        Launch Interactive Node <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};
