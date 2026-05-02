import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Section } from '../ui/Section';
import { 
  ArrowRight, 
  ExternalLink, 
  Github, 
  X, 
  Clock, 
  User
} from 'lucide-react';
import { db } from "../../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { handleFirestoreError } from "../../lib/firebase-utils";
import { OperationType } from "../../types";
import { VARIANTS, EASING } from '../../lib/motion-presets';

const Projects = ({ filter }: { filter: string | null }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "projects");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!filter) return projects;
    return projects.filter(p => p.category?.toLowerCase().includes(filter.toLowerCase()));
  }, [projects, filter]);

  const featuredProject = projects.find(p => p.featured) || projects[0];

  return (
    <>
      <Section id="projects" glowVariant="bottom">
        <div className="section-header">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="badge"
          >
            Portfolio
          </motion.div>
          <motion.h2 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Featured <span className="text-brand-primary">Products</span>
          </motion.h2>
          <motion.p 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Turning complex problems into elegant, production-ready solutions. Each project is a deep dive into engineering and design.
          </motion.p>
        </div>
        
        <div className="flex justify-center mb-16">
          <motion.div 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {filter && (
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-4 glass-card border-white/10 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Clear Filter: {filter}
              </button>
            )}
            <button className="px-10 py-5 bg-brand-primary text-white rounded-3xl text-sm font-bold hover:scale-[1.02] transition-all flex items-center gap-3 group shadow-2xl shadow-brand-primary/20">
              Explore All <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </motion.div>
        </div>

        {!filter && featuredProject && (
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            whileHover={VARIANTS.lift.whileHover}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedProject(featuredProject)}
            className="mb-24 group relative rounded-3xl lg:rounded-[60px] glass-card border-white/5 cursor-pointer shadow-2xl overflow-hidden glass-card-hover"
          >
            <div className="grid lg:grid-cols-2">
              <div className="aspect-[4/3] lg:aspect-auto overflow-hidden relative">
                <img src={featuredProject.image} alt={featuredProject.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-8 left-8">
                  <div className="px-5 py-2 rounded-full bg-brand-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">
                    Featured Case Study
                  </div>
                </div>
              </div>
              <div className="p-10 lg:p-20 flex flex-col justify-center">
                <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-[11px] mb-6 block">{featuredProject.category}</span>
                <h3 className="text-4xl lg:text-6xl font-bold text-white mb-8 tracking-tighter leading-tight">{featuredProject.title}</h3>
                <p className="text-xl mb-12 leading-relaxed line-clamp-3">{featuredProject.description}</p>
                <div className="flex flex-wrap gap-3 mb-12">
                  {featuredProject.tech?.map((t: string) => (
                    <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/30 uppercase tracking-widest">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-brand-primary font-bold text-lg group-hover:gap-6 transition-all uppercase tracking-widest">
                  View Case Study <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video rounded-[32px] bg-white/5 mb-8" />
                <div className="space-y-4 px-2">
                  <div className="h-4 w-1/4 bg-white/5 rounded-full" />
                  <div className="h-8 w-3/4 bg-white/5 rounded-full" />
                  <div className="h-4 w-full bg-white/5 rounded-full" />
                </div>
              </div>
            ))
          ) : filteredProjects.filter(p => !p.featured || filter).map((project, i) => (
            <motion.div
              key={project.id}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={VARIANTS.lift.whileHover}
              whileTap={{ scale: 0.98 }}
              transition={{ ...VARIANTS.fadeUp.transition, delay: i * 0.1 }}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer"
            >
              <div className="aspect-video rounded-[32px] lg:rounded-[48px] overflow-hidden mb-10 glass-card border-white/5 relative glass-card-hover shadow-xl">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700" />
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    <ArrowRight className="-rotate-45" size={24} />
                  </div>
                </div>
              </div>
              <div className="px-4">
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary">{project.category}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20">Product Design</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-5 group-hover:text-brand-primary transition-colors tracking-tight">{project.title}</h3>
                <p className="line-clamp-2 leading-relaxed mb-8">{project.description}</p>
                <div className="flex items-center gap-8 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3 text-white/30 text-[10px] font-bold uppercase tracking-[0.25em] leading-none">
                    <Clock size={16} /> 2024 Release
                  </div>
                  <div className="flex items-center gap-3 text-white/30 text-[10px] font-bold uppercase tracking-[0.25em] leading-none">
                    <User size={16} /> Solo Engineer
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <AnimatePresence>
        {selectedProject && (
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
              transition={{ ease: EASING.PREMIUM, duration: 0.4 }}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-card rounded-[40px] border border-white/10 shadow-2xl no-scrollbar"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="fixed top-12 right-12 z-50 w-12 h-12 rounded-full glass-card border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <div className="aspect-video w-full relative">
                {selectedProject.video ? (
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src={selectedProject.video} type="video/mp4" />
                  </video>
                ) : (
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12 lg:left-20">
                  <span className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4 block">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-none">{selectedProject.title}</h2>
                </div>
              </div>

              <div className="p-8 md:p-20">
                <div className="grid lg:grid-cols-3 gap-16 md:gap-24 mb-20">
                  <div className="lg:col-span-2 space-y-16">
                    <section>
                      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                        <span className="w-10 h-10 rounded-xl bg-blend-lighten bg-brand-primary/10 flex items-center justify-center text-brand-primary text-sm font-bold border border-brand-primary/20 italic">01</span>
                        The Problem
                      </h3>
                      <p className="text-white/50 text-xl leading-relaxed font-medium">{selectedProject.problem || selectedProject.description}</p>
                    </section>
                    
                    <section>
                      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                        <span className="w-10 h-10 rounded-xl bg-blend-lighten bg-brand-secondary/10 flex items-center justify-center text-brand-secondary text-sm font-bold border border-brand-secondary/20 italic">02</span>
                        Strategic Strategy (Why)
                      </h3>
                      <p className="text-white/50 text-xl leading-relaxed font-medium">{selectedProject.strategy || "Prioritized modular architecture and performance-first rendering to ensure 99.9% uptime and sub-second interaction latency."}</p>
                    </section>

                    <section>
                      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                        <span className="w-10 h-10 rounded-xl bg-blend-lighten bg-brand-accent/10 flex items-center justify-center text-brand-accent text-sm font-bold border border-brand-accent/20 italic">03</span>
                        The Solution (What)
                      </h3>
                      <p className="text-white/50 text-xl leading-relaxed font-medium">{selectedProject.process || "Implemented a custom event-driven system with edge-caching and hardware-accelerated CSS for seamless responsiveness."}</p>
                    </section>

                    <section>
                      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                        <span className="w-10 h-10 rounded-xl bg-blend-lighten bg-green-500/10 flex items-center justify-center text-green-500 text-sm font-bold border border-green-500/20 italic">04</span>
                        Measured Impact
                      </h3>
                      <p className="text-white/50 text-xl leading-relaxed font-medium">{selectedProject.impact || "Delivered 40% improvement in load times and sustained a 25% increase in user engagement post-optimization."}</p>
                    </section>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="glass-card p-10 rounded-[32px] border border-white/10">
                      <h3 className="text-xl font-bold mb-8">Engineering Metrics</h3>
                      <div className="space-y-8">
                        {[
                          { label: "Performance", val: 98 },
                          { label: "Lighthouse UX", val: 95 },
                          { label: "System Scalability", val: 92 }
                        ].map(stat => (
                          <div key={stat.label}>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">
                              <span>{stat.label}</span>
                              <span className="text-brand-primary">{stat.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${stat.val}%` }}
                                transition={{ duration: 1.5, ease: EASING.PREMIUM }}
                                className="h-full bg-brand-primary shadow-[0_0_15px_rgba(0,194,255,0.4)]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <a 
                      href={selectedProject.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-6 bg-white text-black rounded-3xl font-bold text-lg hover:bg-brand-primary hover:text-white transition-all group shadow-2xl"
                    >
                      Explore Live Product <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const FeaturedProjectsSection = ({ filter }: { filter: string | null }) => {
  return <Projects filter={filter} />;
};